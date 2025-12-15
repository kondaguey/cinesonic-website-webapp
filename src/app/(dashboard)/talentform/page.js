"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import {
  LogOut,
  Loader2,
  Plus,
  Trash2,
  CheckSquare,
  Key,
  AlertTriangle,
  CheckCircle,
  Pencil,
  FileText,
  Image as ImageIcon,
  ArrowLeft,
  Check,
  Mic,
  Info,
  Globe,
} from "lucide-react";

// 🟢 INITIALIZE SUPABASE
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 🟢 CONSTANTS
const GENRE_OPTIONS = [
  "Fiction",
  "Sci-Fi",
  "Romance",
  "Thriller",
  "Non-Fiction",
  "Fantasy",
  "YA",
  "Horror",
  "Erotica",
  "Kids",
];
const VOICE_OPTIONS = [
  "Warm",
  "Raspy",
  "Authoritative",
  "Bright",
  "Textured",
  "Deep",
  "Youthful",
  "Character",
];
const AGE_OPTIONS = ["Teen", "20s", "30s", "40s", "50s", "60s", "70s", "80+"];

// COMPONENT: CHECKBOX GROUP
const CheckboxGroup = ({ label, items, field, max, formData, setFormData }) => {
  const handleCheckbox = (val) => {
    setFormData((prev) => {
      const current = prev[field] || [];
      if (current.includes(val))
        return { ...prev, [field]: current.filter((i) => i !== val) };
      if (current.length >= max) return prev;
      return { ...prev, [field]: [...current, val] };
    });
  };

  return (
    <div className="bg-white/5 border border-white/10 p-5 rounded-xl flex flex-col h-full shadow-inner hover:border-gold/30 transition-colors">
      <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
        <label className="text-gold font-serif font-bold text-base tracking-widest uppercase">
          {label}
        </label>
        <span className="text-xs text-gray-300 font-bold bg-black/40 px-2 py-1 rounded border border-white/10">
          Max {max}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto custom-scrollbar pr-2 max-h-80">
        {(items || []).map((item) => {
          const isSelected = (formData[field] || []).includes(item);
          const isDisabled =
            !isSelected && (formData[field] || []).length >= max;
          return (
            <div
              key={item}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => !isDisabled && handleCheckbox(item)}
              className={`text-left text-base p-3 rounded-lg flex items-center gap-3 transition-all border cursor-pointer select-none
                ${
                  isSelected
                    ? "bg-gold/20 border-gold text-white shadow-[0_0_15px_rgba(212,175,55,0.3)] font-bold"
                    : "border-transparent text-gray-300 hover:bg-white/10 hover:text-white"
                }
                ${isDisabled ? "opacity-30 cursor-not-allowed" : ""}
              `}
            >
              <div
                className={`w-5 h-5 border rounded flex items-center justify-center transition-colors shrink-0 ${
                  isSelected
                    ? "border-gold bg-gold text-midnight"
                    : "border-gray-500"
                }`}
              >
                {isSelected && <CheckSquare size={14} strokeWidth={4} />}
              </div>
              <span className="leading-tight pt-0.5">{item}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function TalentPortal() {
  const [view, setView] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [accessKey, setAccessKey] = useState("");

  const [formData, setFormData] = useState(null);

  const [uploading, setUploading] = useState({
    headshot: false,
    resume: false,
    demo: false,
  });

  const [dynamicLists, setDynamicLists] = useState({
    genres: GENRE_OPTIONS,
    voices: VOICE_OPTIONS,
    ages: AGE_OPTIONS,
  });

  const [bookoutRanges, setBookoutRanges] = useState([]);
  const [newBookout, setNewBookout] = useState({ start: "", end: "" });

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [checks, setChecks] = useState({
    truth: false,
    roster: false,
    data: false,
    token: false,
  });

  // 🟢 FETCH LISTS FROM DB ON LOAD
  useEffect(() => {
    const fetchLists = async () => {
      const { data } = await supabase.from("lists_db").select("*");
      if (data && data.length > 0) {
        const genres = [...new Set(data.map((d) => d.genre).filter(Boolean))];
        const voices = [
          ...new Set(data.map((d) => d.voice_type).filter(Boolean)),
        ];
        const ages = [...new Set(data.map((d) => d.age_range).filter(Boolean))];
        if (genres.length) setDynamicLists({ genres, voices, ages });
      }
    };
    fetchLists();
  }, []);

  // 🟢 FILE UPLOAD HANDLER
  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading((prev) => ({ ...prev, [type]: true }));

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${type}s/${Date.now()}-${
        formData.id || "unknown"
      }.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("roster-assets")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("roster-assets").getPublicUrl(fileName);

      setFormData((prev) => ({ ...prev, [type]: publicUrl }));
    } catch (err) {
      console.error(err);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  // --- LOGIN (SUPABASE) ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase
        .from("actor_db")
        .select("*")
        .eq("actor_id", accessKey.trim())
        .single();

      if (error || !data) {
        setError("Invalid Access Key");
      } else {
        const parseList = (str) =>
          str ? str.split(",").map((s) => s.trim()) : [];

        setFormData({
          id: data.id,
          name: data.name,
          email: data.email || "",
          pseudonym: data.pseudonym || "",
          gender: data.gender || "",

          ages: parseList(data.age_range),
          voice: parseList(data.voice_type),
          genres: parseList(data.genres),

          status: data.status || "Active",
          nextAvailable: data.next_available || "",
          rate: data.pfh_rate || "",
          sag: data.union_status || "",
          website: data.website_link || "",
          triggers: data.triggers || "",
          training: data.training_notes || "",
          audiobooks: data.audiobooks_narrated || "",

          headshot: data.headshot_url || "",
          resume: data.resume_url || "",
          demo: data.demo_url || "",
        });

        // Parse Bookouts
        const parsedBookouts = [];
        if (data.bookouts) {
          if (Array.isArray(data.bookouts)) {
            setBookoutRanges(data.bookouts);
            return;
          }
          String(data.bookouts)
            .split(",")
            .forEach((range) => {
              const parts = range.trim().split(" to ");
              if (parts.length === 2)
                parsedBookouts.push({ start: parts[0], end: parts[1] });
            });
        }
        setBookoutRanges(parsedBookouts);

        setView("profile");
      }
    } catch (err) {
      console.error(err);
      setError("Connection Error");
    }
    setLoading(false);
  };

  // --- HELPER FUNCTIONS ---
  const addBookout = () => {
    if (!newBookout.start || !newBookout.end) return;
    setBookoutRanges((prev) =>
      [...prev, newBookout].sort((a, b) => (a.start > b.start ? 1 : -1))
    );
    setNewBookout({ start: "", end: "" });
  };

  const removeBookout = (index) => {
    setBookoutRanges((prev) => prev.filter((_, i) => i !== index));
  };

  const handleOpenModal = () => {
    setChecks({ truth: false, roster: false, data: false, token: false });
    setShowModal(true);
  };

  const handleCheckAll = () => {
    setChecks({ truth: true, roster: true, data: true, token: true });
  };

  // --- SAVE PROFILE (SUPABASE) ---
  const submitFinal = async () => {
    setLoading(true);
    try {
      const bookoutsString = bookoutRanges
        .map((b) => `${b.start} to ${b.end}`)
        .join(", ");

      const payload = {
        name: formData.name,
        email: formData.email,
        pseudonym: formData.pseudonym,
        gender: formData.gender,
        age_range: formData.ages.join(", "),
        voice_type: formData.voice.join(", "),
        genres: formData.genres.join(", "),
        status: formData.status,
        next_available: formData.nextAvailable || null,
        pfh_rate: formData.rate || null,
        union_status: formData.sag,
        website_link: formData.website,
        triggers: formData.triggers,
        training_notes: formData.training,
        bookouts: bookoutsString,
        audiobooks_narrated: formData.audiobooks,
        headshot_url: formData.headshot,
        resume_url: formData.resume,
        demo_url: formData.demo,
      };

      const { error } = await supabase
        .from("actor_db")
        .update(payload)
        .eq("id", formData.id);

      if (error) throw error;

      setShowModal(false);
      setView("success");
    } catch (err) {
      console.error(err);
      alert("Save Failed: " + err.message);
    }
    setLoading(false);
  };

  // --- VIEWS ---
  if (view === "login")
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative bg-[radial-gradient(circle_at_50%_0%,_#1a0f5e_0%,_#020014_70%)]">
        {/* NAVIGATION */}
        <div className="absolute top-6 left-6 z-50 flex flex-col items-start gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-gold/60 hover:text-gold text-xs uppercase tracking-widest transition-colors"
          >
            <ArrowLeft size={14} /> Back to Hub
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-500 hover:text-white text-xs uppercase tracking-widest transition-colors pl-1"
          >
            <Globe size={12} /> Public Home
          </Link>
        </div>

        {/* 🟢 FIXED: Removed rounded-b-2xl and border-t-0 to make it a standalone full card */}
        <div className="w-full max-w-[480px] rounded-2xl border border-gold/30 backdrop-blur-2xl bg-black/40 p-8 md:p-10 shadow-2xl animate-fade-in-up">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl text-gold font-serif mb-2">
              Talent Portal
            </h2>
            <p className="text-xs text-gray-400 uppercase tracking-[0.2em]">
              Secure Access
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="group relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Key className="w-5 h-5 text-gold/50 group-focus-within:text-gold transition-colors" />
              </div>
              <input
                type="password"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                className="w-full bg-white/5 border border-gold/20 text-white py-4 pl-12 pr-4 rounded-xl text-lg tracking-[0.15em] outline-none focus:border-gold focus:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all placeholder:text-gray-600 placeholder:text-sm placeholder:tracking-normal"
                placeholder="ENTER ACCESS KEY"
              />
            </div>
            {error && (
              <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-xs text-center flex items-center justify-center gap-2 animate-fade-in">
                <AlertTriangle size={14} /> {error}
              </div>
            )}
            <button
              disabled={loading}
              className="w-full bg-gold hover:bg-gold-light text-midnight font-bold py-4 rounded-xl uppercase tracking-widest flex justify-center gap-2 transition-all transform hover:-translate-y-0.5 shadow-lg shadow-gold/20"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Authenticate"}
            </button>
          </form>
        </div>
      </div>
    );

  if (view === "success")
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(circle_at_50%_0%,_#1a0f5e_0%,_#020014_70%)]">
        <div className="text-center animate-zoom-in bg-black/40 p-12 rounded-2xl border border-gold/30 shadow-2xl backdrop-blur-xl">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/50 shadow-[0_0_30px_rgba(74,222,128,0.2)]">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-3xl text-gold font-serif mb-2">
            Profile Updated
          </h2>
          <p className="text-gray-400 mb-8 font-sans">
            Data synced with casting roster.
          </p>
          <button
            onClick={() => {
              setView("login");
              setAccessKey("");
            }}
            className="text-gold hover:text-white underline text-sm uppercase tracking-wider"
          >
            Back to Login
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center py-8 md:py-12 px-4 bg-[radial-gradient(circle_at_50%_0%,_#1a0f5e_0%,_#020014_70%)] text-white">
      {/* 🟢 FIXED: Removed the Banner Image DIV completely */}

      {/* 🟢 FIXED: Changed rounded-b-2xl to rounded-2xl to fix top corners */}
      <div className="w-full max-w-4xl bg-black/40 border border-gold/30 rounded-2xl backdrop-blur-xl shadow-2xl p-6 md:p-12 animate-fade-in">
        {/* HEADER AREA */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-white/10 pb-6 gap-6 md:gap-4">
          <div className="w-full">
            <div className="flex items-center gap-3 mb-2">
              {isEditingName ? (
                <input
                  autoFocus
                  onBlur={() => setIsEditingName(false)}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="bg-transparent border-b border-gold text-2xl md:text-3xl font-serif text-white outline-none w-full"
                />
              ) : (
                <h1
                  className="text-gold font-serif text-2xl md:text-3xl cursor-pointer hover:text-white transition-colors"
                  onClick={() => setIsEditingName(true)}
                >
                  {formData.name}
                </h1>
              )}
              <button
                onClick={() => setIsEditingName(!isEditingName)}
                className="text-gray-600 hover:text-gold transition-colors"
              >
                <Pencil size={16} />
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {isEditingEmail ? (
                <input
                  autoFocus
                  onBlur={() => setIsEditingEmail(false)}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="bg-transparent border-b border-gold text-sm text-gray-300 outline-none w-full md:w-64"
                />
              ) : (
                <span className="text-sm text-gray-300 tracking-wide font-sans break-all">
                  {formData.email}
                </span>
              )}
              <button
                onClick={() => setIsEditingEmail(!isEditingEmail)}
                className="text-gray-600 hover:text-gold transition-colors opacity-50 hover:opacity-100 shrink-0"
              >
                <Pencil size={12} />
              </button>
            </div>
          </div>
          <button
            onClick={() => {
              setView("login");
              setAccessKey("");
            }}
            className="shrink-0 text-xs text-red-400 hover:text-red-300 flex items-center gap-2 border border-red-900/50 px-4 py-2 rounded bg-red-900/10 transition-colors hover:bg-red-900/20 uppercase tracking-widest"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>

        {/* IDENTITY */}
        <div className="mb-10 border-b border-white/10 pb-10">
          <h3 className="text-gold font-serif text-lg md:text-xl border-l-4 border-gold pl-4 mb-8 uppercase tracking-widest">
            Identity
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="text-gray-400 text-xs uppercase mb-2 block tracking-wider font-bold">
                Pseudonym
              </label>
              <input
                value={formData.pseudonym || ""}
                onChange={(e) =>
                  setFormData({ ...formData, pseudonym: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 focus:border-gold p-4 rounded-lg text-white outline-none transition-colors"
                placeholder="For spicy content..."
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs uppercase mb-2 block tracking-wider font-bold">
                Gender Identity
              </label>
              <select
                value={formData.gender || ""}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 focus:border-gold p-4 rounded-lg text-white outline-none appearance-none [&>option]:bg-midnight"
              >
                <option value="" disabled>
                  Select...
                </option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* LISTS */}
        <div className="mb-10 border-b border-white/10 pb-10">
          <h3 className="text-gold font-serif text-lg md:text-xl border-l-4 border-gold pl-4 mb-8 uppercase tracking-widest">
            Casting Specs
          </h3>
          <div className="grid grid-cols-1 gap-6">
            <CheckboxGroup
              label="Age Ranges"
              items={dynamicLists.ages}
              field="ages"
              max={2}
              formData={formData}
              setFormData={setFormData}
            />
            <CheckboxGroup
              label="Voice Types"
              items={dynamicLists.voices}
              field="voice"
              max={3}
              formData={formData}
              setFormData={setFormData}
            />
            <CheckboxGroup
              label="Genres"
              items={dynamicLists.genres}
              field="genres"
              max={5}
              formData={formData}
              setFormData={setFormData}
            />
          </div>
        </div>

        {/* PROFESSIONAL */}
        <div className="mb-10 border-b border-white/10 pb-10">
          <h3 className="text-gold font-serif text-lg md:text-xl border-l-4 border-gold pl-4 mb-8 uppercase tracking-widest">
            Professional Assets
          </h3>
          {/* 🟢 FILE NAMING INSTRUCTIONS */}
          <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-lg mb-6 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
            <div className="text-sm text-gray-300">
              <strong className="text-blue-300 block mb-1 uppercase tracking-wider text-xs">
                File Naming Requirements
              </strong>
              <p className="mb-2 text-xs">
                To ensure your assets are processed correctly, please rename
                your files before uploading:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] font-mono text-blue-200/80">
                <span className="bg-blue-500/10 px-2 py-1 rounded border border-blue-500/10">
                  FirstLast_Headshot.jpg
                </span>
                <span className="bg-blue-500/10 px-2 py-1 rounded border border-blue-500/10">
                  FirstLast_Resume.pdf
                </span>
                <span className="bg-blue-500/10 px-2 py-1 rounded border border-blue-500/10">
                  FirstLast_Demo.mp3
                </span>
              </div>
            </div>
          </div>
          {/* ASSET UPLOADER GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* 1. HEADSHOT */}
            <div
              className={`relative bg-white/5 border border-dashed rounded-xl p-6 text-center group transition-colors overflow-hidden ${
                formData.headshot
                  ? "border-green-500/50 bg-green-500/5"
                  : "border-white/10 hover:border-gold/50"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "headshot")}
                className="absolute inset-0 opacity-0 cursor-pointer z-20"
                disabled={uploading.headshot}
              />
              <div className="relative z-10">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors ${
                    formData.headshot
                      ? "bg-green-500/20 text-green-400"
                      : "bg-black/20 text-gray-400 group-hover:text-gold"
                  }`}
                >
                  {uploading.headshot ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <ImageIcon />
                  )}
                </div>
                <label className="text-gold font-bold text-sm uppercase mb-1 block">
                  Headshot
                </label>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                  {formData.headshot ? "File on File" : "Click to Upload"}
                </p>
                {formData.headshot && (
                  <div className="mt-2 text-[10px] text-green-400 font-mono truncate px-2">
                    {formData.headshot.split("/").pop()}
                  </div>
                )}
              </div>
            </div>

            {/* 2. RESUME */}
            <div
              className={`relative bg-white/5 border border-dashed rounded-xl p-6 text-center group transition-colors overflow-hidden ${
                formData.resume
                  ? "border-green-500/50 bg-green-500/5"
                  : "border-white/10 hover:border-gold/50"
              }`}
            >
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileUpload(e, "resume")}
                className="absolute inset-0 opacity-0 cursor-pointer z-20"
                disabled={uploading.resume}
              />
              <div className="relative z-10">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors ${
                    formData.resume
                      ? "bg-green-500/20 text-green-400"
                      : "bg-black/20 text-gray-400 group-hover:text-gold"
                  }`}
                >
                  {uploading.resume ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <FileText />
                  )}
                </div>
                <label className="text-gold font-bold text-sm uppercase mb-1 block">
                  Resume / CV
                </label>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                  {formData.resume ? "File on File" : "Click to Upload"}
                </p>
              </div>
            </div>

            {/* 3. DEMO */}
            <div
              className={`relative bg-white/5 border border-dashed rounded-xl p-6 text-center group transition-colors overflow-hidden ${
                formData.demo
                  ? "border-green-500/50 bg-green-500/5"
                  : "border-white/10 hover:border-gold/50"
              }`}
            >
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => handleFileUpload(e, "demo")}
                className="absolute inset-0 opacity-0 cursor-pointer z-20"
                disabled={uploading.demo}
              />
              <div className="relative z-10">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors ${
                    formData.demo
                      ? "bg-green-500/20 text-green-400"
                      : "bg-black/20 text-gray-400 group-hover:text-gold"
                  }`}
                >
                  {uploading.demo ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Mic />
                  )}
                </div>
                <label className="text-gold font-bold text-sm uppercase mb-1 block">
                  Primary Demo
                </label>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                  {formData.demo ? "File on File" : "Your Strongest Reel"}
                </p>
              </div>
            </div>
          </div>

          {/* WEBSITE LINK */}
          <div className="mb-8">
            <label className="text-gold text-xs uppercase mb-2 block font-bold tracking-wider">
              Website / Portfolio Link
            </label>
            <input
              value={formData.website || ""}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              className="w-full bg-black/50 border border-white/10 p-4 rounded-lg text-base text-white focus:border-gold outline-none"
              placeholder="https://..."
            />
          </div>

          {/* 🟢 GRID OF 3 (Union, Rate, Books) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="text-gold text-xs uppercase mb-2 block font-bold tracking-wider">
                Union Status
              </label>
              <select
                value={formData.sag || ""}
                onChange={(e) =>
                  setFormData({ ...formData, sag: e.target.value })
                }
                className="w-full bg-white/5 border border-gold/30 focus:border-gold p-4 rounded-lg text-white outline-none [&>option]:bg-midnight"
              >
                <option value="" disabled>
                  Select...
                </option>
                <option>Non-Union</option>
                <option>SAG-Eligible</option>
                <option>SAG-AFTRA</option>
                <option>Fi-Core</option>
              </select>
            </div>
            <div>
              <label className="text-gold text-xs uppercase mb-2 block font-bold tracking-wider">
                PFH Rate ($)
              </label>
              <input
                type="number"
                value={formData.rate || ""}
                onChange={(e) =>
                  setFormData({ ...formData, rate: e.target.value })
                }
                className="w-full bg-white/5 border border-gold/30 focus:border-gold p-4 rounded-lg text-white outline-none"
              />
            </div>
            {/* 🟢 NEW FIELD: AUDIOBOOKS NARRATED */}
            <div>
              <label className="text-gold text-xs uppercase mb-2 block font-bold tracking-wider">
                Audiobooks Narrated
              </label>
              <input
                type="text"
                value={formData.audiobooks || ""}
                onChange={(e) =>
                  setFormData({ ...formData, audiobooks: e.target.value })
                }
                className="w-full bg-white/5 border border-gold/30 focus:border-gold p-4 rounded-lg text-white outline-none"
                placeholder="e.g. 10+"
              />
            </div>
          </div>
          <div>
            <label className="text-gold text-xs uppercase mb-2 block font-bold tracking-wider">
              Training / Notes
            </label>
            <textarea
              rows={2}
              value={formData.training || ""}
              onChange={(e) =>
                setFormData({ ...formData, training: e.target.value })
              }
              className="w-full bg-white/5 border border-gold/30 focus:border-gold p-4 rounded-lg text-white outline-none"
            />
          </div>
        </div>

        {/* AVAILABILITY */}
        <div className="mb-8">
          <h3 className="text-gold font-serif text-lg md:text-xl border-l-4 border-gold pl-4 mb-8 uppercase tracking-widest">
            Availability
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="text-gold text-xs uppercase mb-2 block font-bold tracking-wider">
                Current Status
              </label>
              <select
                value={formData.status || "Active"}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full bg-white/5 border border-gold/30 focus:border-gold p-4 rounded-lg text-white outline-none [&>option]:bg-midnight"
              >
                <option value="Active">🟢 Active</option>
                <option value="Limited">🟡 Limited</option>
                <option value="On Hiatus">🔴 On Hiatus</option>
              </select>
            </div>
            <div>
              <label className="text-gold text-xs uppercase mb-2 block font-bold tracking-wider">
                Next Open Date
              </label>
              <input
                type="date"
                value={
                  formData.nextAvailable
                    ? formData.nextAvailable.split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setFormData({ ...formData, nextAvailable: e.target.value })
                }
                className="w-full bg-white/5 border border-gold/30 focus:border-gold p-4 rounded-lg text-white outline-none uppercase text-sm [color-scheme:dark]"
              />
            </div>
          </div>

          <div className="bg-white/5 border border-gold/10 rounded-xl p-6">
            <label className="text-gold text-xs uppercase mb-4 block font-bold tracking-wider">
              Future Bookouts
            </label>
            <div className="space-y-2 mb-4">
              {bookoutRanges.length === 0 && (
                <p className="text-xs text-gray-500 italic">
                  No future bookouts listed.
                </p>
              )}
              {bookoutRanges.map((b, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-black/30 p-3 rounded border border-white/5"
                >
                  <span className="text-sm text-gray-300">
                    {b.start} <span className="text-gold px-2">to</span> {b.end}
                  </span>
                  <button
                    onClick={() => removeBookout(i)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 items-end">
              <div className="grow">
                <label className="text-[10px] text-gray-400 uppercase mb-1 block">
                  Start
                </label>
                <input
                  type="date"
                  value={newBookout.start}
                  onChange={(e) =>
                    setNewBookout({ ...newBookout, start: e.target.value })
                  }
                  className="w-full bg-black/50 border border-white/10 p-3 rounded text-xs text-white [color-scheme:dark]"
                />
              </div>
              <div className="grow">
                <label className="text-[10px] text-gray-400 uppercase mb-1 block">
                  End
                </label>
                <input
                  type="date"
                  value={newBookout.end}
                  onChange={(e) =>
                    setNewBookout({ ...newBookout, end: e.target.value })
                  }
                  className="w-full bg-black/50 border border-white/10 p-3 rounded text-xs text-white [color-scheme:dark]"
                />
              </div>
              <button
                onClick={addBookout}
                className="bg-gold hover:bg-gold-light text-midnight p-3 rounded-lg flex items-center justify-center transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleOpenModal}
          className="w-full bg-gold hover:bg-gold-light text-midnight font-bold py-5 rounded-xl text-lg uppercase tracking-widest shadow-lg shadow-gold/20 transition-all transform hover:-translate-y-1"
        >
          Save Profile
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-deep-space border border-gold/30 w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
            <div className="bg-black/40 p-5 border-b border-gold/10 flex justify-between items-center">
              <h3 className="text-gold font-serif text-lg">Confirm Update</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                &times;
              </button>
            </div>
            <div className="p-6 space-y-4">
              <button
                type="button"
                onClick={handleCheckAll}
                className="w-full py-2 mb-2 text-xs font-bold uppercase tracking-widest text-gold border border-gold/30 rounded hover:bg-gold/10 transition-colors flex items-center justify-center gap-2"
              >
                <Check size={14} /> Check All
              </button>

              {[
                { k: "truth", label: "All information is accurate." },
                { k: "roster", label: "Roster status depends on engagement." },
                { k: "data", label: "Consent to store data for casting." },
                { k: "token", label: "I have saved my Access Key." },
              ].map((item) => (
                <label
                  key={item.k}
                  className="flex gap-3 items-start cursor-pointer group"
                >
                  <div
                    className={`mt-0.5 w-5 h-5 border rounded flex items-center justify-center transition-colors shrink-0 ${
                      checks[item.k]
                        ? "bg-gold border-gold text-midnight"
                        : "border-gray-500 group-hover:border-gold"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={checks[item.k]}
                      onChange={() =>
                        setChecks({ ...checks, [item.k]: !checks[item.k] })
                      }
                    />
                    {checks[item.k] && <CheckSquare size={14} />}
                  </div>
                  <span className="text-base text-gray-300 group-hover:text-white select-none pt-0.5 font-bold">
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
            <div className="p-5 bg-black/20 border-t border-gold/10 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="text-xs text-gray-400 hover:text-white px-4 py-2 uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                onClick={submitFinal}
                disabled={!Object.values(checks).every(Boolean) || loading}
                className="bg-gold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gold-light text-midnight text-xs font-bold px-6 py-3 rounded-lg uppercase tracking-wider transition-colors"
              >
                {loading ? "Saving..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
