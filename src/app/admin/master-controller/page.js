"use client";

import React, { useState, useEffect, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  // Navigation & Structure
  Database,
  Layout,
  Users,
  Grid,
  List,
  ChevronRight,
  ChevronDown,
  Search,
  Filter,
  ArrowUpDown,
  // Roles & Identity
  Shield,
  Briefcase,
  Mic,
  Palette,
  BookOpen,
  Crown,
  UserCog,
  User,
  // Actions & Status
  Save,
  Trash2,
  RefreshCw,
  LogOut,
  Lock,
  Unlock,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Copy,
  Mail,
  Terminal,
  Loader2,
  Key,
  // Theme & Settings
  Sun,
  Moon,
  ToggleLeft,
  ToggleRight,
  Radio,
} from "lucide-react";

// --- 1. ENGINE CONFIGURATION ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// --- 2. CONSTANTS & MAPPINGS ---
const ROLE_CONFIG = {
  // COMMAND TIER
  ownership: {
    label: "Ownership",
    icon: Crown,
    clearance: 5,
    dark: {
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    light: {
      color: "text-amber-700",
      bg: "bg-amber-100",
      border: "border-amber-200",
    },
  },
  executive: {
    label: "Executive",
    icon: Shield,
    clearance: 4,
    dark: {
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
    },
    light: {
      color: "text-indigo-700",
      bg: "bg-indigo-100",
      border: "border-indigo-200",
    },
  },
  admin: {
    label: "Admin",
    icon: Terminal,
    clearance: 3,
    dark: {
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
    },
    light: {
      color: "text-cyan-700",
      bg: "bg-cyan-100",
      border: "border-cyan-200",
    },
  },
  crew: {
    label: "Crew",
    icon: Briefcase,
    clearance: 2,
    dark: {
      color: "text-slate-400",
      bg: "bg-slate-500/10",
      border: "border-slate-500/20",
    },
    light: {
      color: "text-slate-600",
      bg: "bg-slate-200",
      border: "border-slate-300",
    },
  },

  // TALENT TIER
  actor: {
    label: "Actor",
    icon: Mic,
    clearance: 1,
    dark: {
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    light: {
      color: "text-emerald-700",
      bg: "bg-emerald-100",
      border: "border-emerald-200",
    },
  },
  artist: {
    label: "Artist",
    icon: Palette,
    clearance: 1,
    dark: {
      color: "text-pink-400",
      bg: "bg-pink-500/10",
      border: "border-pink-500/20",
    },
    light: {
      color: "text-pink-700",
      bg: "bg-pink-100",
      border: "border-pink-200",
    },
  },
  author: {
    label: "Author",
    icon: BookOpen,
    clearance: 1,
    dark: {
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
    },
    light: {
      color: "text-orange-700",
      bg: "bg-orange-100",
      border: "border-orange-200",
    },
  },

  // SYSTEM
  public: {
    label: "Public",
    icon: User,
    clearance: 0,
    dark: {
      color: "text-slate-600",
      bg: "bg-slate-500/5",
      border: "border-slate-500/10",
    },
    light: {
      color: "text-slate-500",
      bg: "bg-slate-100",
      border: "border-slate-200",
    },
  },
};

const TAB_GROUPS = {
  COMMAND: ["ownership", "executive", "admin", "crew"],
  TALENT: ["actor", "artist", "author"],
  SYSTEM: ["keys"],
};

// --- 3. MAIN COMPONENT ---
export default function MasterControllerTitan() {
  // --- STATE: THEME (Light/Dark) ---
  const [isDarkMode, setIsDarkMode] = useState(true);

  // --- STATE: SESSION ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [adminUser, setAdminUser] = useState(null);
  const [authError, setAuthError] = useState("");

  // --- STATE: DATABASE ---
  const [dbLoading, setDbLoading] = useState(false);
  const [masterRoster, setMasterRoster] = useState([]);
  const [siteKeys, setSiteKeys] = useState([]);

  // --- STATE: GLOBAL LOCK ---
  const [globalLock, setGlobalLock] = useState(false); // SITE LOCK KEY

  // --- STATE: UI & FILTERING ---
  const [activeTab, setActiveTab] = useState("all");
  const [subFilter, setSubFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // --- STATE: EDITOR ---
  const [selectedId, setSelectedId] = useState(null);
  const [editorMode, setEditorMode] = useState("view");
  const [formData, setFormData] = useState({});
  const [formStatus, setFormStatus] = useState("idle");

  // --- 4. INITIALIZATION ---
  useEffect(() => {
    initSession();
  }, []);

  const initSession = async () => {
    setIsSessionLoading(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      // VERIFY GOD MODE
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, clearance, full_name")
        .eq("id", session.user.id)
        .single();

      if (profile && profile.clearance >= 3) {
        setAdminUser({ ...session.user, ...profile });
        setIsAuthenticated(true);
        refreshDatabase();
        fetchGlobalLock();
      } else {
        await supabase.auth.signOut();
        setAuthError("CRITICAL: UNAUTHORIZED ACCESS ATTEMPT LOGGED");
        setIsAuthenticated(false);
      }
    }
    setIsSessionLoading(false);
  };

  const fetchGlobalLock = async () => {
    // Check 'site_settings' table for 'site_locked' key
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "site_locked")
      .single();
    if (data) setGlobalLock(data.value === "true");
  };

  const toggleGlobalLock = async () => {
    const newState = !globalLock;
    setGlobalLock(newState);
    // Upsert to ensure it exists
    await supabase
      .from("site_settings")
      .upsert(
        { key: "site_locked", value: String(newState) },
        { onConflict: "key" }
      );
  };

  const refreshDatabase = async () => {
    // Don't show the huge loading spinner if we are just refreshing in the background
    // setDbLoading(true); <--- Comment this out to stop the screen flickering
    try {
      const { data: people, error: peopleErr } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      const { data: keys, error: keyErr } = await supabase
        .from("site_keys")
        .select("*")
        .order("created_at", { ascending: false });

      if (peopleErr) console.error("Profile Fetch Error:", peopleErr);
      // ONLY update if we actually got data back.
      // This prevents the "One Card" bug where a failed fetch wipes the list.
      if (people && people.length > 0) setMasterRoster(people);

      if (keys) setSiteKeys(keys);
    } catch (err) {
      console.error("Sync Error", err);
    } finally {
      setDbLoading(false);
    }
  };

  // --- 5. DATA COMPUTATION ---
  const processedList = useMemo(() => {
    let raw = activeTab === "keys" ? siteKeys : masterRoster;

    return raw.filter((item) => {
      if (activeTab === "command" && !TAB_GROUPS.COMMAND.includes(item.role))
        return false;
      if (activeTab === "talent" && !TAB_GROUPS.TALENT.includes(item.role))
        return false;
      if (subFilter !== "all" && item.role !== subFilter) return false;
      if (searchQuery) {
        const str = JSON.stringify(item).toLowerCase();
        if (!str.includes(searchQuery.toLowerCase())) return false;
      }
      return true;
    });
  }, [masterRoster, siteKeys, activeTab, subFilter, searchQuery]);

  // --- 6. ACTIONS ---

  const handleSelectUser = (user) => {
    setSelectedId(user.id);
    setFormData({ ...user });
    setEditorMode("edit");
    setFormStatus("idle");
  };

  const handleSave = async () => {
    setFormStatus("saving");
    try {
      // --- SAFETY CHECK: PREVENT SELF-LOCKOUT ---
      // If you are editing yourself, and you try to lower your clearance below 3...
      if (formData.id === adminUser.id && formData.clearance < 3) {
        alert(
          "⛔ SYSTEM OVERRIDE: You cannot demote your own account below Admin level while logged in."
        );
        setFormStatus("idle");
        return;
      }

      // --- 1. OPTIMISTIC UPDATE (Trust this first) ---
      // We update the master list immediately so the UI feels instant
      if (activeTab !== "keys") {
        setMasterRoster((prev) =>
          prev.map((p) => (p.id === formData.id ? { ...p, ...formData } : p))
        );
      }

      // --- 2. DATABASE COMMIT ---
      if (activeTab === "keys") {
        const { error } = await supabase.from("site_keys").upsert({
          id: selectedId,
          key_code: formData.key_code,
          assigned_role: formData.assigned_role,
          is_active: formData.is_active,
        });
        if (error) throw error;

        // For keys, we do a simple re-fetch because it's a small table
        const { data: freshKeys } = await supabase
          .from("site_keys")
          .select("*")
          .order("created_at", { ascending: false });
        if (freshKeys) setSiteKeys(freshKeys);
      } else {
        // FOR PROFILES: We update the row...
        const { error } = await supabase
          .from("profiles")
          .update({
            full_name: formData.full_name,
            role: formData.role,
            clearance: formData.clearance,
            status: formData.status,
            internal_notes: formData.internal_notes,
            updated_at: new Date(),
          })
          .eq("id", formData.id);

        if (error) throw error;

        // --- 3. SURGICAL CONFIRMATION (The Fix) ---
        // DO NOT reload the whole database. Just check this ONE user to be sure.
        const { data: confirmedRow } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", formData.id)
          .single();

        // If the server confirms the data, we lock it in.
        // If the server data is somehow different, this corrects it without flashing the whole list.
        if (confirmedRow) {
          setMasterRoster((prev) =>
            prev.map((p) => (p.id === formData.id ? confirmedRow : p))
          );
        }
      }

      setFormStatus("success");
      setTimeout(() => setFormStatus("idle"), 1500);
    } catch (err) {
      console.error(err);
      alert("SAVE ERROR: " + err.message);
      setFormStatus("error");
      // Only on CRITICAL failure do we try to reload everything to get back to a known state
      refreshDatabase();
    }
  };

  const handleGenerateKey = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "VIP-";
    for (let i = 0; i < 6; i++)
      code += chars.charAt(Math.floor(Math.random() * chars.length));

    setSelectedId(null);
    setFormData({ key_code: code, assigned_role: "investor", is_active: true });
    setEditorMode("create_key");
  };

  // --- STYLES HELPER ---
  // Dynamic classes based on isDarkMode
  const theme = {
    bg: isDarkMode ? "bg-[#050505]" : "bg-slate-50",
    panelBg: isDarkMode ? "bg-[#0A0A0A]" : "bg-white",
    text: isDarkMode ? "text-slate-200" : "text-slate-800",
    border: isDarkMode ? "border-white/10" : "border-slate-200",
    inputBg: isDarkMode ? "bg-white/5" : "bg-slate-100",
    inputBorder: isDarkMode ? "border-white/10" : "border-slate-300",
    cardBg: isDarkMode ? "bg-white/5" : "bg-white",
    cardHover: isDarkMode ? "hover:border-white/20" : "hover:border-cyan-500",
    accent: "text-cyan-500",
  };

  // --- 7. RENDER ---
  if (isSessionLoading) return <LoadingScreen isDarkMode={isDarkMode} />;
  if (!isAuthenticated)
    return (
      <LoginScreen
        onLogin={initSession}
        error={authError}
        isDarkMode={isDarkMode}
      />
    );

  return (
    <div
      className={`h-screen w-full ${theme.bg} ${theme.text} overflow-hidden flex flex-col font-sans transition-colors duration-300`}
    >
      {/* === HEADER === */}
      <header
        className={`h-16 border-b ${theme.border} ${
          isDarkMode ? "bg-black/50" : "bg-white/80"
        } backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-50`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-8 h-8 rounded bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-white shadow-lg`}
          >
            <Database size={16} />
          </div>
          <div>
            <h1
              className={`text-sm font-black tracking-[0.2em] uppercase ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}
            >
              Titan<span className="text-cyan-600">OS</span>
            </h1>
            <div className="flex items-center gap-2">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  globalLock ? "bg-red-500 animate-pulse" : "bg-emerald-500"
                }`}
              />
              <span className="text-[10px] font-mono text-slate-500 uppercase">
                {globalLock ? "SITE LOCKED (DEFCON 1)" : "SYSTEM ONLINE"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* GLOBAL SITE LOCK TOGGLE */}
          <button
            onClick={toggleGlobalLock}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
              globalLock
                ? "bg-red-500/10 border-red-500 text-red-500"
                : `${theme.inputBg} ${theme.border} text-slate-400`
            }`}
            title="Toggle Site Lock (Maintenance Mode)"
          >
            {globalLock ? <Lock size={14} /> : <Unlock size={14} />}
            <span className="text-[10px] font-bold uppercase hidden md:inline">
              {globalLock ? "LOCKED" : "OPEN"}
            </span>
          </button>

          <div className="h-6 w-px bg-slate-500/20 mx-2" />

          {/* THEME TOGGLE */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-lg transition-colors ${theme.inputBg} hover:text-cyan-600 text-slate-400`}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={async () => {
              await supabase.auth.signOut();
              setIsAuthenticated(false);
            }}
            className={`p-2 rounded-lg text-slate-400 hover:text-red-500 transition-colors ${theme.inputBg}`}
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* === MAIN LAYOUT === */}
      <div className="flex-1 flex overflow-hidden">
        {/* --- LEFT PANEL: EDITOR --- */}
        <aside
          className={`w-[450px] border-r ${theme.border} ${theme.panelBg} flex flex-col shrink-0 z-40 shadow-2xl relative transition-colors duration-300`}
        >
          <div className={`p-6 border-b ${theme.border}`}>
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <UserCog size={14} /> Inspector Panel
            </h2>

            {!formData.id &&
            activeTab !== "keys" &&
            editorMode !== "create_key" ? (
              <div
                className={`h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed ${theme.border} rounded-2xl ${theme.inputBg}`}
              >
                <Search className="text-slate-400 mb-4" size={32} />
                <p className={`text-sm font-medium ${theme.text}`}>
                  No Record Selected
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Select a user from the grid to modify permissions.
                </p>
              </div>
            ) : (
              <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
                {/* HEADSHOT & NAME */}
                <div className="flex items-start gap-4">
                  <div
                    className={`w-16 h-16 rounded-xl ${theme.inputBg} border ${theme.border} flex items-center justify-center shrink-0 overflow-hidden relative`}
                  >
                    {formData.headshot_url ? (
                      <img
                        src={formData.headshot_url}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-black text-slate-400">
                        {formData.full_name?.charAt(0) || "?"}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    {activeTab === "keys" ? (
                      <div>
                        <label className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">
                          Access Key
                        </label>
                        <div
                          className={`text-xl font-mono font-bold ${
                            isDarkMode ? "text-white" : "text-slate-900"
                          } tracking-widest`}
                        >
                          {formData.key_code}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <input
                          value={formData.full_name || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              full_name: e.target.value,
                            })
                          }
                          className={`bg-transparent text-lg font-bold ${
                            isDarkMode ? "text-white" : "text-slate-900"
                          } w-full outline-none placeholder:text-slate-500`}
                          placeholder="FULL NAME"
                        />
                        <div className="flex items-center gap-2 mt-1">
                          <Mail size={12} className="text-slate-500" />
                          <span className="text-xs font-mono text-slate-500 truncate">
                            {formData.email}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* --- CONTROLS --- */}
                <div
                  className={`p-5 border ${
                    theme.border
                  } rounded-2xl relative overflow-hidden group ${
                    isDarkMode ? "bg-slate-900" : "bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Shield size={14} className="text-cyan-500" />
                    <span className="text-[10px] font-black uppercase text-cyan-500 tracking-widest">
                      Clearance & Role
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* 1. SYSTEM ROLE (Restored) */}
                    <div className="col-span-2">
                      <label className="text-[9px] font-bold text-slate-500 uppercase mb-1.5 block">
                        System Role
                      </label>
                      <select
                        value={formData.role || "actor"}
                        onChange={(e) => {
                          const r = e.target.value;
                          const config = ROLE_CONFIG[r];
                          setFormData({
                            ...formData,
                            role: r,
                            clearance: config ? config.clearance : 1,
                          });
                        }}
                        className={`w-full ${theme.inputBg} ${theme.inputBorder} border rounded-lg px-3 py-2.5 text-sm ${theme.text} font-medium outline-none transition-all`}
                      >
                        <optgroup label="Command">
                          {TAB_GROUPS.COMMAND.map((r) => (
                            <option key={r} value={r}>
                              {r.toUpperCase()}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="Talent">
                          {TAB_GROUPS.TALENT.map((r) => (
                            <option key={r} value={r}>
                              {r.toUpperCase()}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                    </div>

                    {/* 2. CLEARANCE */}
                    <div>
                      <label className="text-[9px] font-bold text-slate-500 uppercase mb-1.5 block">
                        Clearance
                      </label>
                      <select
                        value={formData.clearance || 1}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            clearance: parseInt(e.target.value),
                          })
                        }
                        className={`w-full ${theme.inputBg} ${theme.inputBorder} border rounded-lg px-3 py-2.5 text-sm ${theme.text} font-mono font-bold outline-none`}
                      >
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>
                            LEVEL {n}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 3. CONTRACT STATUS (The Correct 4-Option Version) */}
                    <div>
                      <label className="text-[9px] font-bold text-slate-500 uppercase mb-1.5 block">
                        Contract Status
                      </label>
                      <select
                        value={formData.status || "active"}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                        className={`w-full ${theme.inputBg} ${
                          theme.inputBorder
                        } border rounded-lg px-3 py-2.5 text-sm font-bold outline-none ${
                          formData.status === "active"
                            ? "text-emerald-500"
                            : formData.status === "suspended"
                            ? "text-amber-500"
                            : formData.status === "quit"
                            ? "text-slate-500"
                            : "text-red-600"
                        }`}
                      >
                        <option value="active">ACTIVE</option>
                        <option value="suspended">SUSPENDED</option>
                        <option value="quit">QUIT (Voluntary)</option>
                        <option value="terminated">TERMINATED</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* NOTES */}
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase mb-1.5 block">
                    Internal Ledger
                  </label>
                  <textarea
                    value={formData.internal_notes || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        internal_notes: e.target.value,
                      })
                    }
                    className={`w-full h-32 ${theme.inputBg} ${theme.inputBorder} border rounded-xl p-3 text-xs ${theme.text} font-mono resize-none outline-none placeholder:text-slate-500`}
                    placeholder="Secure admin notes..."
                  />
                </div>
              </div>
            )}
          </div>

          <div
            className={`mt-auto p-6 border-t ${theme.border} ${
              isDarkMode ? "bg-black" : "bg-slate-50"
            }`}
          >
            <button
              onClick={handleSave}
              disabled={!formData.id && !formData.key_code}
              className={`w-full h-12 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all ${
                isDarkMode
                  ? "bg-white text-black hover:bg-cyan-400"
                  : "bg-slate-900 text-white hover:bg-cyan-600"
              } disabled:opacity-50`}
            >
              {formStatus === "saving" ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {formStatus === "success" ? "SAVED" : "COMMIT CHANGES"}
            </button>
          </div>
        </aside>

        {/* --- RIGHT PANEL: THE GRID --- */}
        <main
          className={`flex-1 ${theme.bg} flex flex-col relative transition-colors duration-300`}
        >
          {/* Toolbar */}
          <div
            className={`h-16 border-b ${
              theme.border
            } flex items-center px-6 gap-6 ${
              isDarkMode ? "bg-[#0A0A0A]/50" : "bg-white/50"
            } backdrop-blur`}
          >
            <div
              className={`flex ${
                isDarkMode ? "bg-white/5" : "bg-slate-200"
              } rounded-lg p-1`}
            >
              {[
                { id: "all", label: "All Users" },
                { id: "command", label: "Command" },
                { id: "talent", label: "Talent" },
                { id: "keys", label: "Access Keys" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSubFilter("all");
                    setSelectedId(null);
                    setFormData({});
                  }}
                  className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${
                    activeTab === tab.id
                      ? isDarkMode
                        ? "bg-white text-black shadow-sm"
                        : "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* SUB FILTERS */}
            {(activeTab === "command" || activeTab === "talent") && (
              <div className="flex gap-2">
                {(activeTab === "command"
                  ? TAB_GROUPS.COMMAND
                  : TAB_GROUPS.TALENT
                ).map((role) => (
                  <button
                    key={role}
                    onClick={() =>
                      setSubFilter(subFilter === role ? "all" : role)
                    }
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border transition-all ${
                      subFilter === role
                        ? "bg-cyan-500/10 border-cyan-500 text-cyan-600"
                        : `bg-transparent ${theme.border} text-slate-500 hover:border-slate-400`
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            )}

            <div className="ml-auto flex items-center gap-4">
              <div className="relative group">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={14}
                />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`bg-transparent border ${theme.border} rounded-full py-2 pl-9 pr-4 text-xs ${theme.text} placeholder:text-slate-400 outline-none w-48 transition-all focus:w-64`}
                  placeholder="Search..."
                />
              </div>
              {activeTab === "keys" && (
                <button
                  onClick={handleGenerateKey}
                  className="bg-emerald-600 text-white px-3 py-2 rounded-lg text-[10px] font-bold uppercase hover:bg-emerald-500 transition-all flex items-center gap-2"
                >
                  <Key size={12} /> Generate
                </button>
              )}
            </div>
          </div>

          {/* GRID CONTENT */}
          <div className="flex-1 overflow-y-auto p-6">
            {processedList.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-30">
                <Database
                  size={48}
                  className={`mb-4 ${
                    isDarkMode ? "text-slate-700" : "text-slate-300"
                  }`}
                />
                <p className="font-mono uppercase tracking-widest text-sm text-slate-500">
                  No Records Found
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {processedList.map((item) => (
                  <Card
                    key={item.id}
                    data={item}
                    type={activeTab === "keys" ? "key" : "user"}
                    isSelected={selectedId === item.id}
                    onClick={() => handleSelectUser(item)}
                    theme={theme}
                    isDarkMode={isDarkMode}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---

const Card = ({ data, type, isSelected, onClick, theme, isDarkMode }) => {
  if (type === "key") {
    return (
      <div
        onClick={onClick}
        className={`group relative p-4 rounded-xl border cursor-pointer transition-all ${
          isSelected
            ? "bg-cyan-500/10 border-cyan-500"
            : `${theme.cardBg} ${theme.border} ${theme.cardHover}`
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div
            className={`p-2 rounded-lg ${
              data.is_active
                ? "bg-emerald-500/20 text-emerald-600"
                : "bg-red-500/20 text-red-600"
            }`}
          >
            {data.is_active ? <Unlock size={16} /> : <Lock size={16} />}
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {new Date(data.created_at).toLocaleDateString()}
          </span>
        </div>
        <div
          className={`font-mono text-lg font-bold ${theme.text} tracking-widest mb-1`}
        >
          {data.key_code}
        </div>
        <div className="flex gap-2">
          <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-500/10 px-2 py-0.5 rounded">
            {data.assigned_role}
          </span>
        </div>
      </div>
    );
  }

  // User Card
  const roleConfig = ROLE_CONFIG[data.role] || ROLE_CONFIG.public;
  const RoleIcon = roleConfig.icon;
  const style = isDarkMode ? roleConfig.dark : roleConfig.light;

  return (
    <div
      onClick={onClick}
      className={`group relative p-4 rounded-xl border cursor-pointer transition-all ${
        isSelected
          ? "bg-cyan-500/10 border-cyan-500"
          : `${theme.cardBg} ${theme.border} ${theme.cardHover}`
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg ${theme.inputBg} overflow-hidden relative border ${theme.border}`}
          >
            {data.headshot_url ? (
              <img
                src={data.headshot_url}
                className="w-full h-full object-cover"
              />
            ) : (
              <User
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
            )}
          </div>
          <div>
            <h3 className={`text-sm font-bold ${theme.text} line-clamp-1`}>
              {data.full_name || "Unknown"}
            </h3>
            <p className="text-[10px] text-slate-500 font-mono">{data.email}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div
          className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase border ${style.bg} ${style.color} ${style.border}`}
        >
          <RoleIcon size={10} />
          {roleConfig.label}
        </div>
        <div
          className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
            isDarkMode
              ? "bg-slate-800 border-white/5 text-slate-400"
              : "bg-slate-100 border-slate-200 text-slate-600"
          }`}
        >
          LVL {data.clearance || 0}
        </div>
      </div>
    </div>
  );
};

const LoadingScreen = ({ isDarkMode }) => (
  <div
    className={`h-screen w-full flex flex-col items-center justify-center gap-6 ${
      isDarkMode ? "bg-black" : "bg-slate-50"
    }`}
  >
    <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
    <div className="font-mono text-cyan-600 text-xs tracking-[0.3em] animate-pulse">
      INITIALIZING TITAN PROTOCOL...
    </div>
  </div>
);

const LoginScreen = ({ onLogin, error, isDarkMode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div
      className={`h-screen w-full flex items-center justify-center relative overflow-hidden ${
        isDarkMode ? "bg-[#050505]" : "bg-slate-100"
      }`}
    >
      <div className="w-full max-w-md p-8 rounded-3xl shadow-2xl relative z-10 backdrop-blur-xl border bg-white/5 border-white/10">
        <div className="mb-8 text-center">
          <div
            className={`w-12 h-12 rounded-xl mx-auto flex items-center justify-center mb-4 border ${
              isDarkMode
                ? "bg-white/5 border-white/10 text-white"
                : "bg-slate-200 border-slate-300 text-slate-800"
            }`}
          >
            <Shield size={24} />
          </div>
          <h1
            className={`text-2xl font-black tracking-tighter uppercase ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Titan<span className="text-cyan-600">OS</span>
          </h1>
          <p className="text-slate-500 text-xs font-mono mt-2 tracking-widest">
            RESTRICTED ACCESS: LEVEL 3+
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onLogin();
          }}
          className="space-y-4"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="OPERATOR ID"
            className={`w-full border rounded-xl p-4 outline-none focus:border-cyan-500 transition-all font-mono text-sm ${
              isDarkMode
                ? "bg-white/5 border-white/10 text-white"
                : "bg-slate-50 border-slate-300 text-slate-900"
            }`}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="ACCESS CODE"
            className={`w-full border rounded-xl p-4 outline-none focus:border-cyan-500 transition-all font-mono text-sm ${
              isDarkMode
                ? "bg-white/5 border-white/10 text-white"
                : "bg-slate-50 border-slate-300 text-slate-900"
            }`}
          />
          <button
            className={`w-full h-12 rounded-xl font-bold uppercase tracking-widest transition-all ${
              isDarkMode
                ? "bg-white text-black hover:bg-cyan-400"
                : "bg-slate-900 text-white hover:bg-cyan-600"
            }`}
          >
            ENTER SYSTEM
          </button>
        </form>
        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-mono text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};
