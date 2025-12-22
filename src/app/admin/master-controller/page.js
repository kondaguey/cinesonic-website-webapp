"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import AccountModal from "../../../components/dashboard/AccountModal";
import {
  Database,
  Search,
  Shield,
  Briefcase,
  Mic,
  Palette,
  BookOpen,
  Crown,
  UserCog,
  User,
  Save,
  LogOut,
  Mail,
  Terminal,
  Loader2,
  Copy,
  Sun,
  Moon,
  LayoutDashboard,
  ShieldAlert,
  ArrowRight,
  Lock,
  Unlock,
  GraduationCap,
  ShoppingBag,
  UserPlus,
  Hash,
} from "lucide-react";

import ActorEditor from "../../../components/dashboard/editors/ActorEditor";
import ArtistEditor from "../../../components/dashboard/editors/ArtistEditor";
import AuthorEditor from "../../../components/dashboard/editors/AuthorEditor";
import TeamEditor from "../../../components/dashboard/editors/TeamEditor";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ROLE CONFIGURATION
const ROLE_CONFIG = {
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
  student: {
    label: "Academy",
    icon: GraduationCap,
    clearance: 0,
    dark: {
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    light: {
      color: "text-blue-700",
      bg: "bg-blue-100",
      border: "border-blue-200",
    },
  },
  customer: {
    label: "Shop",
    icon: ShoppingBag,
    clearance: 0,
    dark: {
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
    },
    light: {
      color: "text-violet-700",
      bg: "bg-violet-100",
      border: "border-violet-200",
    },
  },
  // LEAD VIRTUAL ROLES
  lead_newsletter: {
    label: "Lead: News",
    icon: Mail,
    clearance: 0,
    dark: {
      color: "text-slate-400",
      bg: "bg-slate-500/10",
      border: "border-slate-500/20",
    },
    light: {
      color: "text-slate-600",
      bg: "bg-slate-100",
      border: "border-slate-200",
    },
  },
  lead_shop: {
    label: "Lead: Shop",
    icon: ShoppingBag,
    clearance: 0,
    dark: {
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
    },
    light: {
      color: "text-violet-700",
      bg: "bg-violet-100",
      border: "border-violet-200",
    },
  },
  lead_academy: {
    label: "Lead: Academy",
    icon: GraduationCap,
    clearance: 0,
    dark: {
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    light: {
      color: "text-blue-700",
      bg: "bg-blue-100",
      border: "border-blue-200",
    },
  },
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
  CUSTOMERS: ["student", "customer"],
};

const TEAM_ROLES = ["crew", "admin", "executive", "ownership"];

export default function MasterControllerTitan() {
  const router = useRouter();

  // STATE: Page Status
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [denied, setDenied] = useState(false);
  const [denialReason, setDenialReason] = useState("");
  const [isSiteOpen, setIsSiteOpen] = useState(true);

  // STATE: Data & UI
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [adminUser, setAdminUser] = useState(null);
  const [masterRoster, setMasterRoster] = useState([]);
  const [leadsList, setLeadsList] = useState([]); // NEW

  // MODAL STATE
  const [accountModalOpen, setAccountModalOpen] = useState(false);

  // UI State
  const [activeTab, setActiveTab] = useState("all");
  const [subFilter, setSubFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState({});
  const [formStatus, setFormStatus] = useState("idle");
  const [generatedPass, setGeneratedPass] = useState("");

  const handleToggleOpen = async () => {
    try {
      const newOpenStatus = !isSiteOpen;
      setIsSiteOpen(newOpenStatus);
      const { error } = await supabase
        .from("site_settings")
        .update({ is_open: newOpenStatus })
        .eq("id", 1);
      if (error) throw error;
    } catch (err) {
      console.error("Toggle Error:", err);
      alert("Error updating status: " + err.message);
      setIsSiteOpen(!isSiteOpen);
    }
  };

  useEffect(() => {
    const initSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push("/hub");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role, clearance, full_name, id, email")
        .eq("id", session.user.id)
        .single();

      const allowedRoles = ["ownership", "executive", "admin"];
      const isAuthorized =
        profile &&
        (profile.clearance >= 3 || allowedRoles.includes(profile.role));

      if (isAuthorized) {
        setAdminUser({ ...session.user, ...profile });
        refreshDatabase();
        setIsSessionLoading(false);
      } else {
        setDenialReason("Unauthorized: Command Access Required (Level 3+)");
        setDenied(true);
        setIsSessionLoading(false);
      }
    };
    initSession();
  }, []);

  const refreshDatabase = async () => {
    try {
      const [profilesRes, leadsRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("leads")
          .select("*")
          .order("created_at", { ascending: false }),
      ]);

      if (profilesRes.data) setMasterRoster(profilesRes.data);
      if (leadsRes.data) setLeadsList(leadsRes.data);
    } catch (err) {
      console.error("Sync Error", err);
    }
  };

  // --- DATA COMPUTATION ---
  const processedList = useMemo(() => {
    // If on Leads Tab, use leadsList, otherwise use masterRoster
    const sourceData = activeTab === "leads" ? leadsList : masterRoster;

    return sourceData
      .filter((item) => {
        // 1. Main Tabs Logic
        if (activeTab === "command" && !TAB_GROUPS.COMMAND.includes(item.role))
          return false;
        if (activeTab === "talent" && !TAB_GROUPS.TALENT.includes(item.role))
          return false;
        if (
          activeTab === "customers" &&
          !TAB_GROUPS.CUSTOMERS.includes(item.role)
        )
          return false;

        // 2. Leads Filtering Logic
        if (activeTab === "leads") {
          if (
            subFilter === "newsletter" &&
            !["general", "newsletter"].includes(item.source)
          )
            return false;
          if (subFilter === "shop" && item.source !== "shop") return false;
          if (subFilter === "academy" && item.source !== "academy")
            return false;
        } else {
          // Normal subfilter for roles
          if (subFilter !== "all" && item.role !== subFilter) return false;
        }

        // 3. Search
        if (searchQuery) {
          const str = JSON.stringify(item).toLowerCase();
          if (!str.includes(searchQuery.toLowerCase())) return false;
        }
        return true;
      })
      .map((item) => {
        // If it's a lead, map it to look like a profile for the Card component
        if (activeTab === "leads") {
          let virtualRole = "lead_newsletter";
          if (item.source === "shop") virtualRole = "lead_shop";
          if (item.source === "academy") virtualRole = "lead_academy";

          return {
            ...item,
            full_name: item.email.split("@")[0], // Fallback name
            role: virtualRole,
            clearance: 0,
            isLead: true,
          };
        }
        return item;
      });
  }, [masterRoster, leadsList, activeTab, subFilter, searchQuery]);

  // --- ACTIONS ---
  const handleSelectUser = async (user) => {
    setSelectedId(user.id);
    setFormStatus("loading");
    let mergedData = { ...user };

    // Leads don't have zipper logic
    if (user.isLead) {
      setFormData(mergedData);
      setFormStatus("idle");
      return;
    }

    try {
      if (user.role === "actor") {
        const [pPub, pPriv] = await Promise.all([
          supabase
            .from("actor_roster_public")
            .select("*")
            .eq("id", user.id)
            .single(),
          supabase.from("actor_private").select("*").eq("id", user.id).single(),
        ]);
        if (pPub.data) mergedData.public = pPub.data;
        if (pPriv.data) mergedData.private = pPriv.data;
      } else if (user.role === "artist") {
        const [pPub, pPriv] = await Promise.all([
          supabase
            .from("artist_roster_public")
            .select("*")
            .eq("id", user.id)
            .single(),
          supabase
            .from("artist_private")
            .select("*")
            .eq("id", user.id)
            .single(),
        ]);
        if (pPub.data) mergedData.public = pPub.data;
        if (pPriv.data) mergedData.private = pPriv.data;
      } else if (user.role === "author") {
        const [pPub, pPriv] = await Promise.all([
          supabase
            .from("author_roster_public")
            .select("*")
            .eq("id", user.id)
            .single(),
          supabase
            .from("author_private")
            .select("*")
            .eq("id", user.id)
            .single(),
        ]);
        if (pPub.data) mergedData.public = pPub.data;
        if (pPriv.data) mergedData.private = pPriv.data;
      } else if (TEAM_ROLES.includes(user.role)) {
        const [pPub, pPriv] = await Promise.all([
          supabase
            .from("team_about_public")
            .select("*")
            .eq("id", user.id)
            .single(),
          supabase.from("team_private").select("*").eq("id", user.id).single(),
        ]);
        if (pPub.data) mergedData.public = pPub.data;
        if (pPriv.data) mergedData.private = pPriv.data;
      }
    } catch (err) {
      console.error("Zipper Fetch Error", err);
    }

    setFormData(mergedData);
    setFormStatus("idle");
    setGeneratedPass("");
  };

  const handleSave = async () => {
    setFormStatus("saving");
    try {
      if (formData.isLead) {
        const { error } = await supabase
          .from("leads")
          .update({ status: formData.status })
          .eq("id", formData.id);
        if (error) throw error;
      } else {
        if (formData.id === adminUser.id && formData.clearance < 3) {
          alert("⛔ SYSTEM OVERRIDE: You cannot demote yourself.");
          setFormStatus("idle");
          return;
        }
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            full_name: formData.full_name,
            role: formData.role,
            clearance: formData.clearance,
            status: formData.status,
            updated_at: new Date(),
          })
          .eq("id", formData.id);

        if (profileError) throw profileError;

        // Update Roster Tables
        if (formData.role === "actor") {
          if (formData.public)
            await supabase
              .from("actor_roster_public")
              .upsert({ id: formData.id, ...formData.public });
          if (formData.private)
            await supabase
              .from("actor_private")
              .upsert({ id: formData.id, ...formData.private });
        } else if (formData.role === "artist") {
          if (formData.public)
            await supabase
              .from("artist_roster_public")
              .upsert({ id: formData.id, ...formData.public });
          if (formData.private)
            await supabase
              .from("artist_private")
              .upsert({ id: formData.id, ...formData.private });
        } else if (formData.role === "author") {
          if (formData.public)
            await supabase
              .from("author_roster_public")
              .upsert({ id: formData.id, ...formData.public });
          if (formData.private)
            await supabase
              .from("author_private")
              .upsert({ id: formData.id, ...formData.private });
        } else if (TEAM_ROLES.includes(formData.role)) {
          if (formData.public)
            await supabase
              .from("team_about_public")
              .upsert({ id: formData.id, ...formData.public });
          if (formData.private)
            await supabase
              .from("team_private")
              .upsert({ id: formData.id, ...formData.private });
        }
      }

      await refreshDatabase();
      setFormStatus("success");
      setTimeout(() => setFormStatus("idle"), 1500);
    } catch (err) {
      alert("SAVE ERROR: " + err.message);
      setFormStatus("error");
    }
  };

  const handleGenerateTempPassword = () => {
    const chars = "abcdefghijkmnpqrstuvwxyz23456789!@#$%";
    let pass = Array(12)
      .fill(0)
      .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
      .join("");
    setGeneratedPass(pass);
  };

  if (!isSessionLoading && denied) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden p-6 font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#ef4444_0%,_transparent_40%)] opacity-20" />
        <div className="z-10 w-full max-w-md bg-[#0a0a0a] border border-red-500/20 rounded-3xl p-8 text-center shadow-2xl animate-in zoom-in-95">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
            <ShieldAlert className="text-red-500" size={32} />
          </div>
          <h2 className="text-2xl font-black tracking-widest text-white mb-2 uppercase">
            Titan Protocol
          </h2>
          <div className="h-px w-full bg-red-900/50 my-4" />
          <p className="text-sm text-red-400 font-mono mb-8 leading-relaxed uppercase tracking-wider">
            {denialReason}
          </p>
          <button
            onClick={() => router.push("/hub")}
            className="w-full py-4 bg-white text-black rounded-xl font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            Return to Hub <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  if (isSessionLoading) {
    return (
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
  }

  const theme = {
    bg: isDarkMode ? "bg-[#050505]" : "bg-slate-50",
    panelBg: isDarkMode ? "bg-[#0A0A0A]" : "bg-white",
    text: isDarkMode ? "text-slate-200" : "text-slate-800",
    border: isDarkMode ? "border-white/10" : "border-slate-200",
    inputBg: isDarkMode ? "bg-white/5" : "bg-slate-100",
    cardBg: isDarkMode ? "bg-white/5" : "bg-white",
    cardHover: isDarkMode ? "hover:border-white/20" : "hover:border-cyan-500",
  };

  return (
    <div
      className={`h-screen w-full ${theme.bg} ${theme.text} overflow-hidden flex flex-col font-sans transition-colors duration-300`}
    >
      <header
        className={`h-16 border-b ${theme.border} ${
          isDarkMode ? "bg-black/50" : "bg-white/80"
        } backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-50`}
      >
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-white shadow-lg">
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
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-mono text-slate-500 uppercase">
                SYSTEM ONLINE
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-6 w-px bg-slate-500/20 mx-1" />
          <button
            onClick={() => router.push("/hub")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all border ${theme.border} ${theme.inputBg} hover:border-cyan-500/50 hover:text-cyan-500 text-slate-400`}
          >
            <LayoutDashboard size={14} />
            <span className="text-[10px] font-bold uppercase hidden md:inline">
              Command Hub
            </span>
          </button>
          <div className="h-6 w-px bg-slate-500/20 mx-1" />
          <button
            onClick={() => setAccountModalOpen(true)}
            className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${theme.border} ${theme.inputBg} hover:border-emerald-500/50 hover:text-emerald-500 text-slate-400`}
          >
            <UserCog size={16} />
          </button>
          <div className="h-6 w-px bg-slate-500/20 mx-1" />
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-lg transition-colors ${theme.inputBg} hover:text-cyan-600 text-slate-400`}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/hub");
            }}
            className={`p-2 rounded-lg text-slate-400 hover:text-red-500 transition-colors ${theme.inputBg}`}
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside
          className={`w-[450px] border-r ${theme.border} ${theme.panelBg} flex flex-col shrink-0 z-40 shadow-2xl relative transition-colors duration-300 overflow-y-auto custom-scrollbar`}
        >
          <AccountModal
            isOpen={accountModalOpen}
            onClose={() => setAccountModalOpen(false)}
          />
          <div className={`p-6 border-b ${theme.border}`}>
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <UserCog size={14} /> Inspector Panel
            </h2>
            {!formData.id ? (
              <div
                className={`h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed ${theme.border} rounded-2xl ${theme.inputBg}`}
              >
                <Search className="text-slate-400 mb-4" size={32} />
                <p className={`text-sm font-medium ${theme.text}`}>
                  No Record Selected
                </p>
              </div>
            ) : (
              <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-16 h-16 rounded-xl ${theme.inputBg} border ${theme.border} flex items-center justify-center shrink-0 overflow-hidden`}
                  >
                    <span className="text-2xl font-black text-slate-400">
                      {formData.full_name?.charAt(0) || "?"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <input
                      disabled={formData.isLead}
                      value={formData.full_name || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, full_name: e.target.value })
                      }
                      className={`bg-transparent text-lg font-bold ${theme.text} w-full outline-none placeholder:text-slate-500 disabled:opacity-50`}
                      placeholder="FULL NAME"
                    />
                    <div className="flex items-center gap-2 mt-1">
                      <Mail size={12} className="text-slate-500" />
                      <span className="text-xs font-mono text-slate-500 truncate">
                        {formData.email}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className={`p-5 border ${
                    theme.border
                  } rounded-2xl relative overflow-hidden ${
                    isDarkMode ? "bg-slate-900" : "bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Shield size={14} className="text-cyan-500" />
                    <span className="text-[10px] font-black uppercase text-cyan-500 tracking-widest">
                      {formData.isLead ? "Lead Status" : "Permissions"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-[9px] font-bold text-slate-500 uppercase mb-1 block">
                        Type
                      </label>
                      <input
                        disabled
                        value={
                          formData.isLead
                            ? `LEAD: ${formData.source?.toUpperCase()}`
                            : formData.role?.toUpperCase()
                        }
                        className={`w-full ${theme.inputBg} border ${theme.border} rounded-lg px-3 py-2.5 text-sm ${theme.text} font-medium outline-none opacity-60`}
                      />
                    </div>
                    {!formData.isLead && (
                      <div>
                        <label className="text-[9px] font-bold text-slate-500 uppercase mb-1 block">
                          Clearance
                        </label>
                        <select
                          value={formData.clearance || 0}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              clearance: parseInt(e.target.value),
                            })
                          }
                          className={`w-full ${theme.inputBg} border ${theme.border} rounded-lg px-3 py-2.5 text-sm font-mono font-bold outline-none ${theme.text}`}
                        >
                          {[0, 1, 2, 3, 4, 5].map((n) => (
                            <option key={n} value={n}>
                              LEVEL {n}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div className={formData.isLead ? "col-span-2" : ""}>
                      <label className="text-[9px] font-bold text-slate-500 uppercase mb-1 block">
                        Status
                      </label>
                      <select
                        value={formData.status || "active"}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                        className={`w-full ${theme.inputBg} border ${theme.border} rounded-lg px-3 py-2.5 text-sm font-bold outline-none text-emerald-500`}
                      >
                        <option value="active">ACTIVE</option>
                        <option value="suspended">SUSPENDED</option>
                        <option value="banned">BANNED</option>
                        {formData.isLead && (
                          <option value="converted">CONVERTED</option>
                        )}
                      </select>
                    </div>
                  </div>
                </div>

                {!formData.isLead && (
                  <>
                    {formData.role === "actor" && (
                      <ActorEditor
                        formData={formData}
                        setFormData={setFormData}
                        theme={theme}
                      />
                    )}
                    {formData.role === "artist" && (
                      <ArtistEditor
                        formData={formData}
                        setFormData={setFormData}
                        theme={theme}
                      />
                    )}
                    {formData.role === "author" && (
                      <AuthorEditor
                        formData={formData}
                        setFormData={setFormData}
                        theme={theme}
                      />
                    )}
                    {TEAM_ROLES.includes(formData.role) && (
                      <TeamEditor
                        formData={formData}
                        setFormData={setFormData}
                        theme={theme}
                      />
                    )}

                    <div
                      className={`p-4 border ${theme.border} rounded-xl bg-orange-500/5 mt-4`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-[9px] font-bold text-orange-500 uppercase">
                          Temp Password Generator
                        </label>
                        <button
                          onClick={handleGenerateTempPassword}
                          className="text-[10px] text-orange-400 hover:text-white underline"
                        >
                          Generate
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <input
                          readOnly
                          value={generatedPass}
                          placeholder="Click Generate..."
                          className={`flex-1 bg-white/5 border ${theme.border} rounded px-2 py-1 text-xs font-mono ${theme.text}`}
                        />
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(generatedPass)
                          }
                          className="p-1.5 bg-orange-500 text-white rounded hover:bg-orange-600"
                        >
                          <Copy size={12} />
                        </button>
                      </div>
                    </div>
                  </>
                )}
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
              disabled={!formData.id}
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

        <main
          className={`flex-1 ${theme.bg} flex flex-col relative overflow-hidden transition-colors duration-300`}
        >
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
                { id: "customers", label: "Customers" },
                { id: "leads", label: "Leads" }, // NEW TAB
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

            {/* Leads Sub-Filter */}
            {activeTab === "leads" && (
              <div
                className={`flex ${
                  isDarkMode ? "bg-white/5" : "bg-slate-200"
                } rounded-lg p-1 animate-in fade-in slide-in-from-left-2 duration-300`}
              >
                {[
                  { id: "all", label: "All Leads" },
                  { id: "newsletter", label: "Newsletter" },
                  { id: "shop", label: "Shop" },
                  { id: "academy", label: "Academy" },
                ].map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setSubFilter(sub.id)}
                    className={`px-3 py-1 rounded-md text-[9px] font-bold uppercase transition-all ${
                      subFilter === sub.id
                        ? "bg-orange-500 text-white shadow-sm"
                        : "text-slate-500 hover:text-orange-600"
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            )}

            {activeTab === "customers" && (
              <div
                className={`flex ${
                  isDarkMode ? "bg-white/5" : "bg-slate-200"
                } rounded-lg p-1 animate-in fade-in slide-in-from-left-2 duration-300`}
              >
                {[
                  { id: "all", label: "Combined" },
                  { id: "customer", label: "Shop" },
                  { id: "student", label: "Academy" },
                ].map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setSubFilter(sub.id)}
                    className={`px-3 py-1 rounded-md text-[9px] font-bold uppercase transition-all ${
                      subFilter === sub.id
                        ? "bg-cyan-500 text-white shadow-sm"
                        : "text-slate-500 hover:text-cyan-600"
                    }`}
                  >
                    {sub.label}
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
                  placeholder="Search database..."
                />
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              {processedList.map((item) => (
                <Card
                  key={item.id}
                  data={item}
                  isSelected={selectedId === item.id}
                  onClick={() => handleSelectUser(item)}
                  theme={theme}
                  isDarkMode={isDarkMode}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

const Card = ({ data, isSelected, onClick, theme, isDarkMode }) => {
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
            className={`w-10 h-10 rounded-lg ${theme.inputBg} overflow-hidden relative border ${theme.border} flex items-center justify-center`}
          >
            <span className="text-lg font-black text-slate-500">
              {data.full_name?.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className={`text-sm font-bold ${theme.text} line-clamp-1`}>
              {data.full_name || "Unknown User"}
            </h3>
            <p className="text-[10px] text-slate-500 font-mono truncate w-32">
              {data.email}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div
          className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase border ${style.bg} ${style.color} ${style.border}`}
        >
          <RoleIcon size={10} /> {roleConfig.label}
        </div>
        <div
          className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
            isDarkMode
              ? "bg-slate-800 border-white/5 text-slate-400"
              : "bg-slate-100 border-slate-200 text-slate-600"
          }`}
        >
          {data.isLead ? "LEAD" : `LVL ${data.clearance || 0}`}
        </div>
      </div>
    </div>
  );
};
