"use client";

import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  UserPlus,
  Search,
  Shield,
  Mic,
  Palette,
  Briefcase,
  BookOpen,
  Save,
  Database,
  Loader2,
  Lock,
  Unlock,
  RefreshCw,
  User,
  Menu,
  LogOut,
  KeyRound,
  ChevronRight,
  ChevronLeft,
  Trash2,
  Edit3,
  X,
  Upload,
} from "lucide-react";

export default function MasterControllerV5() {
  // --- STATE: AUTHENTICATION ---
  // 🟢 ANTI-FLASH: Start at null
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [authKey, setAuthKey] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // --- STATE: NAVIGATION ---
  const [activeTab, setActiveTab] = useState("actors");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // --- STATE: DATA ---
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(false);
  const [siteLocked, setSiteLocked] = useState(false);
  const [lockLoading, setLockLoading] = useState(true);

  // --- STATE: DYNAMIC LIST OPTIONS ---
  const [listOptions, setListOptions] = useState({
    age_range: [],
    vocal_qualities: [],
    genres: [],
    accents: [],
    artist_role: [],
    crew_role: [],
    admin_role: [],
    access_level: [],
    union_status: [],
  });
  const [listsLoading, setListsLoading] = useState(true);

  // --- STATE: UI & UPLOAD ---
  const [filter, setFilter] = useState("");
  const [generatedKey, setGeneratedKey] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [uploadingField, setUploadingField] = useState(null); // 🟢 CHANGE: Isolated loaders
  const [showSuccess, setShowSuccess] = useState(false);

  // --- STATE: FORM ---
  const [form, setForm] = useState(getInitialFormState());

  function getInitialFormState() {
    return {
      name: "",
      email: "",
      status: "Active",
      login_key: "",
      age_range: "",
      vocal_qualities: "",
      accents: "",
      genres: "",
      union_status: "Non-Union",
      pfh_rate: "",
      headshot_url: "",
      reel_url: "",
      resume_url: "",
      pen_names: "",
      primary_market: "Indie",
      writing_style: "",
      avg_word_count: 0,
      website_url: "",
      artist_role: "",
      portfolio_reel_url: "",
      primary_instrument: "",
      daw_software: "",
      crew_role: "",
      day_rate: "",
      access_level: "standard",
      department: "",
      next_available: "",
      bookout_dates: [],
    };
  }

  const getSupa = () => {
    const key =
      authKey ||
      (typeof window !== "undefined"
        ? localStorage.getItem("mc_auth_key")
        : "") ||
      "";
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        global: { headers: { "x-admin-key": key } },
      }
    );
  };

  useEffect(() => {
    const savedKey = localStorage.getItem("mc_auth_key");
    if (savedKey) verifyKey(savedKey);
    else {
      setIsAuthenticated(false);
      setCheckingSession(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSiteSettings();
      fetchSiloData();
      fetchDynamicLists();
      handleReset();
    }
  }, [activeTab, isAuthenticated]);

  const verifyKey = async (key) => {
    setAuthLoading(true);
    const tempSupa = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    try {
      const { data } = await tempSupa
        .from("admin")
        .select("name, login_key")
        .eq("login_key", key)
        .single();
      if (data) {
        setIsAuthenticated(true);
        setAuthKey(key);
        localStorage.setItem("mc_auth_key", key);
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem("mc_auth_key");
      }
    } catch (e) {
      setIsAuthenticated(false);
    } finally {
      setAuthLoading(false);
      setCheckingSession(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("mc_auth_key");
    setIsAuthenticated(false);
    setAuthKey("");
  };

  const fetchSiteSettings = async () => {
    const { data } = await getSupa()
      .from("app_settings")
      .select("is_active")
      .eq("setting_name", "site_lock")
      .single();
    if (data) setSiteLocked(data.is_active);
    setLockLoading(false);
  };

  const fetchSiloData = async () => {
    setLoading(true);
    const { data, error } = await getSupa()
      .from(activeTab)
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setRoster(data);
    setLoading(false);
  };

  const fetchDynamicLists = async () => {
    try {
      const { data } = await getSupa().from("lists").select("*");
      if (data) {
        const extractOptions = (key) =>
          [
            ...new Set(data.map((item) => item[key]).filter((val) => val)),
          ].sort();
        setListOptions({
          age_range: extractOptions("age_range"),
          vocal_qualities: extractOptions("vocal_qualities"),
          genres: extractOptions("genres"),
          accents: extractOptions("accents"),
          artist_role: extractOptions("artist_role"),
          crew_role: extractOptions("crew_role"),
          admin_role: extractOptions("admin_role"),
          access_level: extractOptions("access_level"),
          union_status: extractOptions("union_status"),
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setListsLoading(false);
    }
  };

  const toggleSiteLock = async () => {
    setLockLoading(true);
    const newState = !siteLocked;
    const { error } = await getSupa()
      .from("app_settings")
      .update({ is_active: newState })
      .eq("setting_name", "site_lock");
    if (!error) setSiteLocked(newState);
    setLockLoading(false);
  };

  const handleFileUpload = async (e, folder) => {
    const file = e.target.files[0];
    if (!file || !form.name) return alert("Enter Name first.");
    setUploadingField(folder); // 🟢 Isolated loader
    try {
      const fileName = `${form.name.replace(
        /\s+/g,
        "_"
      )}_${Date.now()}.${file.name.split(".").pop()}`;
      const filePath = `${folder}/${fileName}`;
      const { error: uploadError } = await getSupa()
        .storage.from("actor-assets")
        .upload(filePath, file);
      if (uploadError) throw uploadError;
      const {
        data: { publicUrl },
      } = getSupa().storage.from("actor-assets").getPublicUrl(filePath);
      setForm((prev) => ({
        ...prev,
        [folder === "headshots"
          ? "headshot_url"
          : folder === "demos"
          ? "reel_url"
          : "resume_url"]: publicUrl,
      }));
    } catch (error) {
      alert(error.message);
    } finally {
      setUploadingField(null);
    }
  };

  const handleEnroll = async () => {
    if (!form.name || !form.email) return alert("Name/Email required.");
    const payload = cleanPayload(form, activeTab);
    const finalKey = selectedId
      ? form.login_key
      : generatedKey || Math.random().toString(36).substring(7).toUpperCase();

    const entry = { ...payload, login_key: finalKey };
    if (selectedId) entry.id = selectedId;

    // 🟢 DUPLICATE FIX: Upsert using Email as the conflict target
    const { error } = await getSupa()
      .from(activeTab)
      .upsert(entry, { onConflict: "email" });

    if (error) alert(error.message);
    else {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      fetchSiloData();
      handleReset();
    }
  };

  const handleDelete = async () => {
    if (!selectedId || !confirm("Delete record?")) return;
    const { error } = await getSupa()
      .from(activeTab)
      .delete()
      .eq("id", selectedId);
    if (!error) {
      fetchSiloData();
      handleReset();
    }
  };

  const handleSelectItem = (item) => {
    setSelectedId(item.id);
    setGeneratedKey(item.login_key || "");
    setForm({ ...getInitialFormState(), ...item });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setForm(getInitialFormState());
    setGeneratedKey("");
    setSelectedId(null);
  };

  const cleanPayload = (d, silo) => {
    const base = { name: d.name, email: d.email, status: d.status };
    const scrub = (val, type) =>
      !val || val === "" || (Array.isArray(val) && val.length === 0)
        ? type === "json"
          ? []
          : null
        : val;
    if (silo === "actors")
      return {
        ...base,
        age_range: d.age_range,
        vocal_qualities: d.vocal_qualities,
        accents: d.accents,
        genres: d.genres,
        union_status: d.union_status,
        pfh_rate: d.pfh_rate,
        headshot_url: d.headshot_url,
        reel_url: d.reel_url,
        resume_url: d.resume_url,
        website_url: d.website_url,
        next_available: scrub(d.next_available, "date"),
        bookout_dates: scrub(d.bookout_dates, "json"),
      };
    if (silo === "authors")
      return {
        ...base,
        pen_names: d.pen_names,
        genres: d.genres,
        primary_market: d.primary_market,
        writing_style: d.writing_style,
        avg_word_count: d.avg_word_count,
        headshot_url: d.headshot_url,
        website_url: d.website_url,
      };
    if (silo === "artists")
      return {
        ...base,
        artist_role: d.artist_role,
        headshot_url: d.headshot_url,
        portfolio_reel_url: d.portfolio_reel_url,
        primary_instrument: d.primary_instrument,
        daw_software: d.daw_software,
        next_available: scrub(d.next_available, "date"),
      };
    return base;
  };

  // 🟢 ANTI-FLASH GUARD
  if (checkingSession || isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-cyan-500 mb-4" size={48} />
        <p className="text-cyan-500/50 font-mono text-[10px] uppercase tracking-[0.3em]">
          Authenticating Master Session...
        </p>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-300 via-yellow-200 to-lime-300 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl border border-white/50 text-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-6">
            <Shield className="text-white" size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
            MASTER CONTROLLER
          </h2>
          <div className="relative mb-6">
            <KeyRound
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type={showPassword ? "text" : "password"}
              value={authKey}
              onChange={(e) => setAuthKey(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-black border border-slate-200 rounded-xl outline-none font-mono text-center shadow-sm"
              onKeyDown={(e) => e.key === "Enter" && verifyKey(authKey)}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            >
              {showPassword ? <Unlock size={18} /> : <Lock size={18} />}
            </button>
          </div>
          <button
            onClick={() => verifyKey(authKey)}
            disabled={authLoading}
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest shadow-md"
          >
            {authLoading ? (
              <Loader2 className="animate-spin mx-auto" size={18} />
            ) : (
              "Authorize System"
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-300 via-yellow-200 to-lime-300 text-slate-800 font-sans pb-20">
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/40 px-4 md:px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Database className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900">
            MASTER CONTROLLER <span className="text-cyan-600">V5.0</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-3 px-5 py-2 rounded-full border bg-white/50 ${
              siteLocked
                ? "border-red-400 text-red-600"
                : "border-emerald-400 text-emerald-600"
            }`}
          >
            {siteLocked ? <Lock size={16} /> : <Unlock size={16} />}
            <span className="text-[10px] font-bold uppercase">
              {siteLocked ? "LOCKED" : "PUBLIC"}
            </span>
            <button
              onClick={toggleSiteLock}
              className={`w-10 h-5 rounded-full p-1 transition-colors ${
                siteLocked ? "bg-red-500" : "bg-emerald-500"
              } relative`}
            >
              <div
                className={`w-3 h-3 bg-white rounded-full transition-transform ${
                  siteLocked ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-3 bg-white/50 border border-white/80 rounded-2xl text-xs font-bold text-slate-500 hover:text-red-600 transition-all shadow-sm"
          >
            <LogOut size={14} /> DISCONNECT
          </button>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-4 md:p-8">
        <nav className="flex flex-wrap gap-2 mb-8">
          {[
            { id: "actors", icon: Mic, color: "bg-cyan-600" },
            { id: "authors", icon: BookOpen, color: "bg-pink-600" },
            { id: "artists", icon: Palette, color: "bg-orange-500" },
            { id: "crew", icon: Briefcase, color: "bg-blue-600" },
            { id: "admin", icon: Shield, color: "bg-slate-800" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 md:flex-none flex items-center gap-2 px-6 py-3 rounded-xl border font-bold uppercase text-xs transition-all ${
                activeTab === tab.id
                  ? `${tab.color} text-white shadow-lg -translate-y-1`
                  : "bg-white/60 border-white/50 text-slate-500"
              }`}
            >
              <tab.icon size={16} /> {tab.id}
            </button>
          ))}
        </nav>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-5 space-y-6">
            <div
              className={`bg-white/80 backdrop-blur-lg border rounded-3xl p-6 md:p-8 shadow-xl ${
                selectedId
                  ? "border-cyan-400 ring-2 ring-cyan-100"
                  : "border-white/50"
              }`}
            >
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  {selectedId ? (
                    <Edit3 size={20} className="text-cyan-600" />
                  ) : (
                    <UserPlus size={20} className="text-cyan-600" />
                  )}{" "}
                  {selectedId
                    ? `Update ${activeTab}`
                    : `Initialize ${activeTab}`}
                </h2>
                <button
                  onClick={handleReset}
                  className="text-[10px] text-slate-400 hover:text-cyan-600 uppercase flex items-center gap-1"
                >
                  <RefreshCw size={12} /> Clear Form
                </button>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field
                    label="Full Name"
                    value={form.name || ""}
                    onChange={(v) => setForm({ ...form, name: v })}
                    placeholder="Required"
                    required
                  />
                  <Field
                    label="Email Address"
                    value={form.email || ""}
                    onChange={(v) => setForm({ ...form, email: v })}
                    placeholder="Required"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label text="Status" />
                    <select
                      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:border-cyan-500 outline-none shadow-sm"
                      value={form.status || ""}
                      onChange={(e) =>
                        setForm({ ...form, status: e.target.value })
                      }
                    >
                      <option value="Active">Active</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label text="Access Key" />
                    <div className="flex gap-2">
                      <input
                        readOnly
                        value={
                          (selectedId ? form.login_key : generatedKey) || ""
                        }
                        className="w-full bg-slate-100 border rounded-xl p-3 text-sm font-mono text-cyan-600"
                      />
                      {!selectedId && (
                        <button
                          onClick={() =>
                            setGeneratedKey(
                              Math.random()
                                .toString(36)
                                .substring(7)
                                .toUpperCase()
                            )
                          }
                          className="p-3 bg-white border rounded-xl text-cyan-600 shadow-sm"
                        >
                          <RefreshCw size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-cyan-50/50 rounded-2xl border border-cyan-100 space-y-4">
                  {activeTab === "actors" && (
                    <div className="space-y-4">
                      <MultiSelectDropdown
                        label="Age Range"
                        value={form.age_range || ""}
                        options={listOptions.age_range}
                        maxSelections={2}
                        onChange={(v) => setForm({ ...form, age_range: v })}
                      />
                      <SelectField
                        label="Union Status"
                        value={form.union_status || ""}
                        options={listOptions.union_status}
                        onChange={(v) => setForm({ ...form, union_status: v })}
                      />
                      <MultiSelectDropdown
                        label="Vocal Qualities"
                        value={form.vocal_qualities || ""}
                        options={listOptions.vocal_qualities}
                        maxSelections={5}
                        onChange={(v) =>
                          setForm({ ...form, vocal_qualities: v })
                        }
                      />
                      <MultiSelectDropdown
                        label="Genres"
                        value={form.genres || ""}
                        options={listOptions.genres}
                        maxSelections={3}
                        onChange={(v) => setForm({ ...form, genres: v })}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field
                          label="Next Available"
                          type="date"
                          value={form.next_available || ""}
                          onChange={(v) =>
                            setForm({ ...form, next_available: v })
                          }
                        />
                        <Field
                          label="PFH Rate ($)"
                          value={form.pfh_rate || ""}
                          onChange={(v) => setForm({ ...form, pfh_rate: v })}
                        />
                      </div>
                      <BookoutRangeManager
                        value={form.bookout_dates}
                        onChange={(v) => setForm({ ...form, bookout_dates: v })}
                      />
                      <Field
                        label="Website URL"
                        value={form.website_url || ""}
                        onChange={(v) => setForm({ ...form, website_url: v })}
                        placeholder="https://..."
                      />
                    </div>
                  )}
                  {activeTab === "authors" && (
                    <div className="space-y-4">
                      <Field
                        label="Pen Names"
                        value={form.pen_names || ""}
                        onChange={(v) => setForm({ ...form, pen_names: v })}
                      />
                      <SelectField
                        label="Genres"
                        value={form.genres || ""}
                        options={listOptions.genres}
                        onChange={(v) => setForm({ ...form, genres: v })}
                      />
                      <Field
                        label="Website URL"
                        value={form.website_url || ""}
                        onChange={(v) => setForm({ ...form, website_url: v })}
                      />
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-cyan-100 space-y-4">
                  <FileField
                    label="Headshot"
                    value={form.headshot_url}
                    folder="headshots"
                    onFileSelect={handleFileUpload}
                    uploadingField={uploadingField}
                  />
                  <FileField
                    label="Demo Reel (Video/Audio)"
                    value={form.reel_url}
                    folder="demos"
                    onFileSelect={handleFileUpload}
                    uploadingField={uploadingField}
                  />
                  <FileField
                    label="Resume (PDF)"
                    value={form.resume_url}
                    folder="resumes"
                    onFileSelect={handleFileUpload}
                    uploadingField={uploadingField}
                  />
                </div>

                {showSuccess && (
                  <div className="p-4 bg-emerald-500 text-white rounded-2xl flex items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-2 shadow-lg">
                    <Shield size={18} className="animate-pulse" />
                    <span className="font-bold uppercase tracking-widest text-[10px]">
                      Database Synced Successfully
                    </span>
                  </div>
                )}

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleEnroll}
                    className="flex-1 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-bold uppercase tracking-widest shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-all"
                  >
                    <Save size={18} />{" "}
                    {selectedId ? "Update Record" : "Commit to Database"}
                  </button>
                  {selectedId && (
                    <button
                      onClick={handleDelete}
                      className="px-6 py-4 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-100"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="xl:col-span-7 flex flex-col h-fit bg-white/30 backdrop-blur-md rounded-[2.5rem] border-2 border-white/60 shadow-2xl p-6 mb-10">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  className="w-full bg-white/80 border rounded-2xl py-5 pl-14 pr-6 text-slate-800 focus:border-cyan-500 outline-none text-lg shadow-sm"
                  placeholder={`Search ${activeTab}...`}
                  value={filter}
                  onChange={(e) => {
                    setFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-fr">
              {loading ? (
                <div className="col-span-full py-20 flex justify-center">
                  <Loader2 className="animate-spin text-cyan-600" size={48} />
                </div>
              ) : (
                (() => {
                  const filtered = roster.filter((p) =>
                    (p.name || "").toLowerCase().includes(filter.toLowerCase())
                  );
                  const startIndex = (currentPage - 1) * itemsPerPage;
                  const paginated = filtered.slice(
                    startIndex,
                    startIndex + itemsPerPage
                  );
                  if (paginated.length === 0)
                    return (
                      <div className="col-span-full py-10 text-center text-slate-400 font-bold uppercase italic">
                        No records found.
                      </div>
                    );
                  return paginated.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectItem(item)}
                      className={`bg-white/70 border rounded-2xl p-4 hover:bg-white transition-all flex gap-4 cursor-pointer group shadow-sm ${
                        selectedId === item.id
                          ? "border-cyan-500 ring-2 ring-cyan-200"
                          : "border-white/80"
                      }`}
                    >
                      <div className="w-16 h-16 shrink-0 rounded-xl bg-slate-200 overflow-hidden relative shadow-inner">
                        {item.headshot_url ? (
                          <img
                            src={item.headshot_url}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <User size={24} />
                          </div>
                        )}
                        <div
                          className={`absolute bottom-0 inset-x-0 h-1.5 ${
                            item.status === "Active"
                              ? "bg-emerald-500"
                              : "bg-slate-400"
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h4 className="font-bold text-slate-800 truncate group-hover:text-cyan-600">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-cyan-700 font-mono truncate">
                          {item.email}
                        </p>
                      </div>
                    </div>
                  ));
                })()
              )}
            </div>

            {/* 🟢 THE FIX: Restored Pagination Arrows */}
            <div className="mt-8 pt-6 border-t border-white/40 flex items-center justify-between">
              <div className="text-xs font-bold text-slate-600 tracking-tight">
                Page {currentPage} of{" "}
                {Math.max(
                  1,
                  Math.ceil(
                    roster.filter((p) =>
                      (p.name || "")
                        .toLowerCase()
                        .includes(filter.toLowerCase())
                    ).length / itemsPerPage
                  )
                )}
              </div>
              <div className="flex gap-3">
                <button
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="w-12 h-12 rounded-xl bg-white border border-white/50 text-slate-600 disabled:opacity-30 hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  disabled={
                    currentPage >=
                    Math.ceil(
                      roster.filter((p) =>
                        (p.name || "")
                          .toLowerCase()
                          .includes(filter.toLowerCase())
                      ).length / itemsPerPage
                    )
                  }
                  onClick={() => {
                    setCurrentPage((p) => p + 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="w-12 h-12 rounded-xl bg-cyan-600 text-white disabled:opacity-30 shadow-md hover:bg-cyan-700 transition-colors"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// 🟢 EXTERNAL HELPERS
const BookoutRangeManager = ({ value, onChange }) => {
  const ranges = Array.isArray(value) ? value : [];
  const [start, setStart] = React.useState("");
  const [end, setEnd] = React.useState("");
  const addRange = () => {
    if (!start || !end) return;
    onChange(
      [...ranges, { start, end }].sort(
        (a, b) => new Date(a.start) - new Date(b.start)
      )
    );
    setStart("");
    setEnd("");
  };
  return (
    <div className="space-y-3">
      <Label text="Bookout Date Ranges" />
      <div className="flex gap-2 bg-white/50 p-3 rounded-2xl border border-white/60 shadow-inner">
        <input
          type="date"
          className="flex-1 bg-white border rounded-xl p-2 text-xs outline-none focus:ring-2 focus:ring-cyan-100"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
        <input
          type="date"
          className="flex-1 bg-white border rounded-xl p-2 text-xs outline-none focus:ring-2 focus:ring-cyan-100"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />
        <button
          type="button"
          onClick={addRange}
          className="px-4 py-2 bg-slate-800 text-white rounded-xl font-bold text-[10px] hover:bg-slate-700 transition-all"
        >
          BLOCK
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {ranges.map((r, i) => (
          <div
            key={i}
            className="bg-white border shadow-sm pl-3 pr-1 py-1 rounded-xl flex items-center gap-2 animate-in fade-in zoom-in duration-200"
          >
            <span className="text-[9px] font-bold">
              {r.start} — {r.end}
            </span>
            <button
              onClick={() => onChange(ranges.filter((_, idx) => idx !== i))}
            >
              <X size={14} className="text-slate-300 hover:text-red-500" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const FileField = ({ label, value, onFileSelect, folder, uploadingField }) => {
  const isThisUploading = uploadingField === folder;
  const fileName = value
    ? decodeURIComponent(value.split("/").pop().split("?")[0])
    : "";
  return (
    <div className="space-y-1">
      <Label text={label} />
      <div className="relative flex items-center">
        <div
          className={`flex-1 bg-white border rounded-xl p-3 text-[11px] font-mono flex items-center min-h-[46px] shadow-sm pr-24 ${
            value
              ? "border-emerald-400 text-emerald-700 bg-emerald-50/50"
              : "border-gray-200 text-slate-400"
          }`}
        >
          {isThisUploading ? (
            <Loader2 className="animate-spin mr-2" size={12} />
          ) : null}
          {value ? (
            <span className="truncate font-bold">{fileName}</span>
          ) : (
            `No ${label} Uploaded`
          )}
        </div>
        <label className="absolute right-2 cursor-pointer bg-slate-900 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg active:scale-95 flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-sm">
          {isThisUploading ? (
            <Loader2 className="animate-spin" size={12} />
          ) : (
            <Upload size={12} />
          )}{" "}
          {value ? "REPLACE" : "SELECT"}
          <input
            type="file"
            className="hidden"
            onChange={(e) => onFileSelect(e, folder)}
            disabled={isThisUploading}
            accept={
              folder === "resumes"
                ? ".pdf"
                : folder === "headshots"
                ? "image/*"
                : "image/*,video/*,audio/*"
            }
          />
        </label>
      </div>
    </div>
  );
};

const Label = ({ text }) => (
  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">
    {text}
  </label>
);
const Field = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}) => (
  <div className="space-y-1">
    <div className="flex justify-between">
      <Label text={label} />
      {required && (
        <span className="text-[9px] text-cyan-600 font-bold">*Required</span>
      )}
    </div>
    <input
      type={type}
      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:border-cyan-500 outline-none text-slate-800 shadow-sm focus:ring-2 focus:ring-cyan-100 transition-all"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);
const SelectField = ({ label, value, options = [], onChange }) => (
  <div className="space-y-1">
    <Label text={label} />
    <select
      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm outline-none shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Select {label}...</option>
      {options.map((opt, i) => (
        <option key={i} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);
const MultiSelectDropdown = ({
  label,
  value,
  options = [],
  onChange,
  maxSelections,
}) => {
  const selectedArray = value ? value.split(", ").filter(Boolean) : [];
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <Label text={label} />
        <span className="text-[9px] font-bold text-cyan-600">
          {selectedArray.length}/{maxSelections}
        </span>
      </div>
      <select
        className="w-full bg-white border rounded-xl p-3 text-sm outline-none shadow-sm mb-2 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all"
        onChange={(e) => {
          if (
            e.target.value &&
            !selectedArray.includes(e.target.value) &&
            selectedArray.length < maxSelections
          )
            onChange([...selectedArray, e.target.value].join(", "));
        }}
        value=""
      >
        <option value="">+ Add {label}...</option>
        {options.map((opt, i) => (
          <option key={i} value={opt} disabled={selectedArray.includes(opt)}>
            {opt}
          </option>
        ))}
      </select>
      <div className="flex flex-wrap gap-1.5">
        {selectedArray.map((tag, i) => (
          <div
            key={i}
            className="bg-cyan-600 text-white text-[10px] pl-2 pr-1 py-1 rounded-md flex items-center gap-1 shadow-sm"
          >
            {tag}
            <button
              onClick={() =>
                onChange(selectedArray.filter((t) => t !== tag).join(", "))
              }
            >
              <X size={10} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
