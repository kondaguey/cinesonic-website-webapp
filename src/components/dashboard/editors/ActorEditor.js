"use client";

import React, { useState, useEffect, useRef } from "react";
import HeadshotCropper from "./HeadshotCropper";
import TikTokIcon from "../../ui/TikTokIcon";
import { createClient } from "@supabase/supabase-js";
import {
  Globe,
  Mic,
  Users,
  ChevronDown,
  X,
  ShieldAlert,
  PlayCircle,
  UploadCloud,
  AlertTriangle,
  FileCheck,
  Instagram,
  Linkedin,
  Clapperboard,
  Trash2,
  Plus,
  FileText,
  DollarSign,
  Facebook,
  LinkIcon,
  Youtube,
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// --- HELPER: SCORE CALCULATOR (STRICT REQUIREMENTS) ---
const calculateScore = (data) => {
  let score = 0;

  // REQUIRED FIELDS LIST
  // Socials, Resume, Agency, Bookouts are OPTIONAL (0 points)
  const fields = [
    // Public Data
    { key: "headshot_url", weight: 10, silo: "public" },
    { key: "public_name", weight: 5, silo: "public" },
    { key: "bio", weight: 5, silo: "public" },
    { key: "demo_reel_url", weight: 10, silo: "public" },
    { key: "home_studio_specs", weight: 5, silo: "public" },
    { key: "voice_types", weight: 5, silo: "public", isArray: true },
    { key: "accents", weight: 5, silo: "public", isArray: true },
    { key: "genres", weight: 5, silo: "public", isArray: true },
    { key: "age_ranges", weight: 5, silo: "public", isArray: true },

    // Private Data
    { key: "legal_first_name", weight: 5, silo: "private" },
    { key: "legal_last_name", weight: 5, silo: "private" },
    { key: "legal_address", weight: 5, silo: "private" },
    { key: "phone_number", weight: 5, silo: "private" },
    { key: "union_status", weight: 5, silo: "private" },
    // Tax Docs: Must be 'submitted' OR 'verified' to count
    {
      key: "tax_documents_status",
      weight: 10,
      silo: "private",
      match: ["submitted", "verified"],
    },
    { key: "triggers", weight: 5, silo: "private" },
    { key: "pfh_rate", weight: 5, silo: "private" },
  ];

  let totalWeight = fields.reduce((acc, curr) => acc + curr.weight, 0);

  fields.forEach((f) => {
    const val = data[f.silo]?.[f.key];
    let isComplete = false;

    if (f.isArray) {
      isComplete = val && val.length > 0;
    } else if (f.match) {
      // Check if value exists in the match array (e.g. submitted or verified)
      isComplete = Array.isArray(f.match)
        ? f.match.includes(val)
        : val === f.match;
    } else {
      isComplete = !!val; // Standard "is truthy" check
    }

    if (isComplete) score += f.weight;
  });

  return Math.min(100, Math.round((score / totalWeight) * 100));
};

// --- HELPER: MULTI-SELECT DROPDOWN ---
const MultiSelectDropdown = ({
  label,
  icon: Icon,
  options,
  value, // <--- Received from parent (might be null)
  onChange,
  max,
  theme,
  required,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // FIX: Safety check. If DB returns null, treat as empty array.
  const validValue = value || [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSelection = (item) => {
    if (validValue.includes(item)) {
      onChange(validValue.filter((i) => i !== item));
    } else {
      if (validValue.length < max) {
        onChange([...validValue, item]);
      }
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <label className="text-[9px] font-bold text-slate-500 uppercase mb-1 block flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Icon size={10} /> {label}{" "}
          {required && <span className="text-red-500">*</span>}
        </span>
        <span
          className={`text-[9px] ${
            validValue.length === max ? "text-red-500" : "text-slate-400"
          }`}
        >
          {validValue.length} / {max}
        </span>
      </label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full min-h-[34px] ${theme.inputBg} border ${theme.border} rounded px-2 py-1.5 cursor-pointer flex items-center justify-between hover:border-cyan-500 transition-colors`}
      >
        <div className="flex flex-wrap gap-1">
          {validValue.length === 0 && (
            <span className="text-xs text-slate-500 italic">
              Select options...
            </span>
          )}
          {validValue.map((item) => (
            <span
              key={item}
              className="text-[10px] bg-cyan-500/10 text-cyan-600 px-1.5 rounded border border-cyan-500/20 font-bold whitespace-nowrap"
            >
              {item}
            </span>
          ))}
        </div>
        <ChevronDown
          size={14}
          className={`text-slate-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>
      {isOpen && (
        <div
          className={`absolute z-50 w-full mt-1 max-h-60 overflow-y-auto custom-scrollbar rounded-lg border ${
            theme.border
          } shadow-2xl ${
            theme.panelBg || "bg-white"
          } animate-in fade-in zoom-in-95 duration-100`}
        >
          {options.map((opt) => {
            const isSelected = validValue.includes(opt);
            const isDisabled = !isSelected && validValue.length >= max;
            return (
              <div
                key={opt}
                onClick={() => !isDisabled && toggleSelection(opt)}
                className={`px-3 py-2 text-xs border-b ${
                  theme.border
                } last:border-0 cursor-pointer flex items-center justify-between transition-colors
                  ${
                    isSelected
                      ? "bg-cyan-500/5 text-cyan-600 font-bold"
                      : theme.text
                  }
                  ${
                    isDisabled
                      ? "opacity-40 cursor-not-allowed bg-slate-100/5"
                      : "hover:bg-cyan-500/10"
                  }
                `}
              >
                <span>{opt}</span>
                {isSelected && <X size={12} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function ActorEditor({ formData, setFormData, theme }) {
  const [lists, setLists] = useState({
    genre: [],
    vocal_quality: [],
    accent: [],
    age_range: [],
  });
  const [loadingLists, setLoadingLists] = useState(true);
  const [uploading, setUploading] = useState({
    headshot: false,
    demo: false,
    resume: false,
    w9: false,
  });
  const [profileScore, setProfileScore] = useState(0);
  const [newBookout, setNewBookout] = useState({
    start: "",
    end: "",
    reason: "",
  });

  // 1. INIT
  useEffect(() => {
    const fetchLists = async () => {
      const { data } = await supabase.from("lists").select("category, label");
      if (data) {
        const grouped = data.reduce((acc, item) => {
          const cat = item.category.toLowerCase();
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(item.label);
          return acc;
        }, {});
        Object.keys(grouped).forEach((k) =>
          grouped[k].sort((a, b) => a.localeCompare(b))
        );
        setLists((prev) => ({ ...prev, ...grouped }));
      }
      setLoadingLists(false);
    };
    fetchLists();
  }, []);

  useEffect(() => {
    setProfileScore(calculateScore(formData));
  }, [formData]);

  // 2. FILE HANDLING LOGIC
  const handleFileUpload = async (e, type, bucket = "public-showcase") => {
    const file = e.target.files[0];
    if (!file) return;

    // Reject Non-PDFs for W9
    if (type === "w9" && file.type !== "application/pdf") {
      alert("Only PDF files are allowed for Tax Documents.");
      return;
    }

    setUploading((prev) => ({ ...prev, [type]: true }));

    try {
      const rawName = formData.public?.public_name || "Actor";
      const cleanName = rawName
        .replace(/[^a-zA-Z0-9]/g, "_")
        .replace(/_+/g, "_");
      let fileName;

      if (type === "w9") {
        const safeOriginalName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        fileName = `${cleanName}/${safeOriginalName}`;
      } else {
        const fileExt = file.name.split(".").pop();
        fileName = `${cleanName}/${cleanName}_${type}_${Date.now()}.${fileExt}`;
      }

      const { error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { upsert: true });
      if (error) throw error;

      if (bucket !== "secure-vault") {
        const {
          data: { publicUrl },
        } = supabase.storage.from(bucket).getPublicUrl(fileName);
        if (type === "headshot")
          updateField("public", "headshot_url", publicUrl);
        if (type === "demo") updateField("public", "demo_reel_url", publicUrl);
        if (type === "resume") updateField("public", "resume_url", publicUrl);
      } else {
        if (type === "w9") {
          updateField("private", "w9_i9_url", fileName);
          updateField("private", "tax_documents_status", "submitted");
        }
      }
    } catch (err) {
      console.error("Upload error:", err.message);
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleHeadshotWrapper = ({ file }) => {
    const syntheticEvent = { target: { files: [file] } };
    handleFileUpload(syntheticEvent, "headshot", "public-showcase");
  };

  const handleDeleteMedia = (type) => {
    if (!confirm("Are you sure you want to remove this file?")) return;

    if (type === "headshot") updateField("public", "headshot_url", null);
    if (type === "demo") updateField("public", "demo_reel_url", null);
    if (type === "resume") updateField("public", "resume_url", null);

    if (type === "w9") {
      updateField("private", "w9_i9_url", null);
      updateField("private", "tax_documents_status", "pending");
    }
  };

  // 3. HELPERS
  const updateField = (silo, field, val) => {
    setFormData((prev) => ({
      ...prev,
      [silo]: { ...prev[silo], [field]: val },
    }));
  };

  const updateSocial = (network, val) => {
    const current = formData.public?.social_links || {};
    updateField("public", "social_links", { ...current, [network]: val });
  };

  const addBookout = () => {
    if (!newBookout.start || !newBookout.end) return;
    const current = formData.private?.bookouts || [];
    updateField("private", "bookouts", [...current, newBookout]);
    setNewBookout({ start: "", end: "", reason: "" });
  };

  const removeBookout = (idx) => {
    const current = [...(formData.private?.bookouts || [])];
    current.splice(idx, 1);
    updateField("private", "bookouts", current);
  };

  // --- RENDER ---
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 relative">
      {/* HEADER */}
      <div
        className={`p-4 rounded-xl border ${theme.border} bg-gradient-to-r from-blue-500/5 to-cyan-500/5`}
      >
        <div className="flex justify-between items-end mb-2">
          <div>
            <h3
              className={`text-xs font-black uppercase tracking-widest ${theme.text}`}
            >
              Profile Strength
            </h3>
            <p className="text-[10px] text-slate-500">
              Must be 100% to submit profile.
            </p>
          </div>
          <span
            className={`text-xl font-black ${
              profileScore >= 100 ? "text-emerald-500" : "text-amber-500"
            }`}
          >
            {profileScore}%
          </span>
        </div>
        <div className="h-1.5 w-full bg-slate-500/10 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ease-out ${
              profileScore >= 100
                ? "bg-emerald-500"
                : "bg-gradient-to-r from-red-500 to-amber-500"
            }`}
            style={{ width: `${profileScore}%` }}
          />
        </div>
      </div>

      {/* IDENTITY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Headshot */}
        <div className="col-span-1 lg:col-span-3">
          <HeadshotCropper
            currentImage={formData.public?.headshot_url}
            onCropComplete={handleHeadshotWrapper}
            onDelete={() => handleDeleteMedia("headshot")}
            theme={theme}
          />
          {/* Visual Required Marker */}
          {!formData.public?.headshot_url && (
            <p className="text-[10px] text-red-500 text-center font-bold mt-1">
              * Headshot Required
            </p>
          )}

          {uploading.headshot && (
            <div className="mt-2 text-center">
              <span className="text-[10px] text-cyan-500 font-bold uppercase animate-pulse">
                Uploading...
              </span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="col-span-1 lg:col-span-9 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-bold text-emerald-500 uppercase tracking-widest mb-1 block">
                  Stage Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={formData.public?.display_name || ""}
                  onChange={(e) =>
                    updateField("public", "display_name", e.target.value)
                  }
                  className={`w-full ${theme.inputBg} border ${theme.border} rounded-lg px-3 py-2.5 text-sm font-bold ${theme.text} focus:border-cyan-500 outline-none`}
                />
              </div>
            </div>

            {/* Socials (OPTIONAL) */}
            <div className="col-span-2 space-y-2">
              <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest block">
                Social Profiles (Optional)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  {
                    id: "imdb",
                    icon: Clapperboard,
                    color: "focus:border-yellow-500",
                    groupColor: "group-focus-within:text-yellow-500",
                  },
                  {
                    id: "instagram",
                    icon: Instagram,
                    color: "focus:border-pink-500",
                    groupColor: "group-focus-within:text-pink-500",
                  },
                  {
                    id: "linkedin",
                    icon: Linkedin,
                    color: "focus:border-blue-500",
                    groupColor: "group-focus-within:text-blue-500",
                  },
                  {
                    id: "youtube",
                    icon: Youtube,
                    color: "focus:border-red-600",
                    groupColor: "group-focus-within:text-red-600",
                  },
                  {
                    id: "tiktok",
                    icon: TikTokIcon,
                    color: "focus:border-red-400",
                    groupColor: "group-focus-within:text-red-400",
                  },
                  {
                    id: "facebook",
                    icon: Facebook,
                    color: "focus:border-blue-600",
                    groupColor: "group-focus-within:text-blue-600",
                  },
                ].map((social) => (
                  <div key={social.id} className="relative group">
                    <social.icon
                      size={14}
                      className={`absolute left-3 top-2.5 text-slate-500 ${social.groupColor} transition-colors`}
                    />
                    <input
                      value={formData.public?.social_links?.[social.id] || ""}
                      onChange={(e) => updateSocial(social.id, e.target.value)}
                      className={`w-full ${theme.inputBg} border ${theme.border} rounded-lg pl-9 pr-2 py-2 text-xs ${theme.text} outline-none ${social.color} transition-colors`}
                      placeholder={
                        social.id.charAt(0).toUpperCase() + social.id.slice(1)
                      }
                    />
                  </div>
                ))}
                <div className="relative group sm:col-span-2 lg:col-span-2">
                  <LinkIcon
                    size={14}
                    className="absolute left-3 top-2.5 text-slate-500 group-focus-within:text-emerald-500 transition-colors"
                  />
                  <input
                    value={formData.public?.social_links?.website || ""}
                    onChange={(e) => updateSocial("website", e.target.value)}
                    className={`w-full ${theme.inputBg} border ${theme.border} rounded-lg pl-9 pr-2 py-2 text-xs ${theme.text} outline-none focus:border-emerald-500 transition-colors`}
                    placeholder="Personal Website URL"
                  />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="col-span-2">
              <div className="flex justify-between items-end mb-1">
                <label className="text-sm font-bold text-emerald-500 uppercase tracking-widest block">
                  Bio <span className="text-red-500">*</span>
                </label>
                <span
                  className={`text-[9px] font-mono font-bold transition-colors ${
                    (formData.public?.bio?.length || 0) >= 200 &&
                    (formData.public?.bio?.length || 0) <= 350
                      ? "text-emerald-500"
                      : "text-red-500"
                  }`}
                >
                  {formData.public?.bio?.length || 0} / 350
                </span>
              </div>
              <textarea
                rows={5}
                value={formData.public?.bio || ""}
                onChange={(e) => updateField("public", "bio", e.target.value)}
                className={`w-full ${theme.inputBg} border ${theme.border} rounded-lg px-3 py-2 text-sm ${theme.text} outline-none resize-none transition-colors focus:border-emerald-500`}
                placeholder="Brief professional summary..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* MEDIA & SPECS */}
      <div
        className={`p-5 rounded-xl border ${theme.border} ${theme.cardBg} space-y-4`}
      >
        <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg flex gap-3 items-start">
          <div className="mt-0.5 text-blue-500">
            <AlertTriangle size={14} />
          </div>
          <div className="text-[10px] text-slate-500">
            <span className="font-bold text-blue-500 block mb-1">
              FILE NAMING AUTOMATION
            </span>
            System will auto-rename uploads (e.g. First_Last_demo.mp3).
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Demo Reel */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-emerald-500 uppercase flex items-center gap-2">
                <PlayCircle size={16} className="text-red-500" /> Demo Reel{" "}
                <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] font-bold text-amber-500 flex items-center gap-1">
                <AlertTriangle size={12} /> Max 3 Min
              </span>
            </div>
            <div
              className={`flex-1 min-h-[100px] p-4 rounded-lg border border-dashed flex flex-col items-center justify-center relative transition-colors ${
                formData.public?.demo_reel_url
                  ? "border-slate-500/30 bg-slate-500/5"
                  : `${theme.border} ${theme.inputBg}`
              }`}
            >
              {formData.public?.demo_reel_url ? (
                <div className="w-full">
                  <audio
                    controls
                    src={formData.public.demo_reel_url}
                    className="w-full h-8 mb-2"
                  />
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[9px] text-slate-500 italic">
                      Uploaded
                    </span>
                    <div className="flex gap-2">
                      <button className="text-[9px] text-cyan-500 font-bold uppercase hover:underline relative z-10">
                        Replace
                        <input
                          type="file"
                          accept="audio/*"
                          onChange={(e) => handleFileUpload(e, "demo")}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </button>
                      <button
                        onClick={() => handleDeleteMedia("demo")}
                        className="text-[9px] text-red-500 font-bold uppercase hover:text-red-400 z-10"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-2 relative">
                  {uploading.demo ? (
                    <div className="animate-spin w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full mx-auto" />
                  ) : (
                    <UploadCloud
                      size={20}
                      className="mx-auto mb-2 text-slate-400"
                    />
                  )}
                  <span className="text-[9px] font-bold text-slate-500 uppercase block">
                    Upload MP3/WAV
                  </span>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => handleFileUpload(e, "demo")}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Specs & Resume */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-[9px] font-bold text-slate-500 uppercase mb-2 flex items-center gap-2">
                <Mic size={14} className="text-purple-500" /> Home Studio Specs{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={formData.public?.home_studio_specs || ""}
                onChange={(e) =>
                  updateField("public", "home_studio_specs", e.target.value)
                }
                className={`w-full ${theme.inputBg} border ${theme.border} rounded-lg px-3 py-2 text-[10px] font-mono ${theme.text} outline-none resize-none focus:border-purple-500`}
                placeholder={`Mic: Sennheiser MKH 416...`}
              />
            </div>
            <div>
              <label className="text-[9px] font-bold text-slate-500 uppercase mb-2 flex items-center gap-2">
                <FileText size={14} className="text-indigo-500" /> Resume
                (Optional)
              </label>
              <div
                className={`relative flex items-center gap-3 p-2 rounded-lg border border-dashed transition-colors ${
                  formData.public?.resume_url
                    ? "border-indigo-500/30 bg-indigo-500/5"
                    : `${theme.border} ${theme.inputBg}`
                }`}
              >
                {formData.public?.resume_url ? (
                  <>
                    <div className="w-6 h-6 rounded bg-indigo-500/20 flex items-center justify-center text-indigo-500 shrink-0">
                      <FileText size={12} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-[10px] font-bold ${theme.text} truncate`}
                      >
                        Resume_Uploaded.pdf
                      </p>
                    </div>
                    <div className="flex items-center gap-2 z-10">
                      <a
                        href={formData.public.resume_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[9px] font-bold text-indigo-500 hover:underline"
                      >
                        View
                      </a>
                      <div className="w-px h-3 bg-slate-500/20"></div>
                      <button
                        onClick={() => handleDeleteMedia("resume")}
                        className="text-red-500 hover:text-red-400"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="w-full flex items-center justify-center gap-2 py-0.5">
                    {uploading.resume ? (
                      <span className="text-[9px] text-indigo-500 animate-pulse">
                        Uploading...
                      </span>
                    ) : (
                      <>
                        <UploadCloud size={14} className="text-slate-400" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase">
                          Upload PDF
                        </span>
                      </>
                    )}
                  </div>
                )}
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handleFileUpload(e, "resume")}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={uploading.resume}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ATTRIBUTES (ALL REQUIRED) */}
      <div className={`p-4 rounded-xl border ${theme.border} ${theme.cardBg}`}>
        {loadingLists ? (
          <div className="text-center text-xs font-mono text-slate-500">
            SYNCING LISTS...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <MultiSelectDropdown
              label="Vocal Types"
              icon={Mic}
              max={3}
              required={true}
              options={lists.vocal_quality}
              value={formData.public?.voice_types}
              onChange={(val) => updateField("public", "voice_types", val)}
              theme={theme}
            />
            <MultiSelectDropdown
              label="Accents"
              icon={Globe}
              max={3}
              required={true}
              options={lists.accent}
              value={formData.public?.accents}
              onChange={(val) => updateField("public", "accents", val)}
              theme={theme}
            />
            <MultiSelectDropdown
              label="Genres"
              icon={FileText}
              max={3}
              required={true}
              options={lists.genre}
              value={formData.public?.genres}
              onChange={(val) => updateField("public", "genres", val)}
              theme={theme}
            />
            <MultiSelectDropdown
              label="Age Ranges"
              icon={Users}
              max={2}
              required={true}
              options={lists.age_range}
              value={formData.public?.age_ranges}
              onChange={(val) => updateField("public", "age_ranges", val)}
              theme={theme}
            />
          </div>
        )}
      </div>

      {/* PRIVATE DATA */}
      <div className={`rounded-xl border overflow-hidden ${theme.border}`}>
        <div className={`px-4 py-2 border-b ${theme.border} bg-slate-500/5`}>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <ShieldAlert size={12} /> Private Legal Data
          </h4>
        </div>
        <div className={`p-4 border-b ${theme.border} grid grid-cols-2 gap-4`}>
          <div className="space-y-4">
            <div>
              <label
                className={`text-[10px] font-bold uppercase mb-1 block ${theme.text}`}
              >
                Legal First Name <span className="text-red-500">*</span>
              </label>
              <input
                value={formData.private?.legal_first_name || ""}
                onChange={(e) =>
                  updateField("private", "legal_first_name", e.target.value)
                }
                className={`w-full ${theme.inputBg} border ${theme.border} rounded px-3 py-2 text-xs ${theme.text} outline-none focus:border-cyan-500`}
              />
            </div>
            <div>
              <label
                className={`text-[10px] font-bold uppercase mb-1 block ${theme.text}`}
              >
                Legal Last Name <span className="text-red-500">*</span>
              </label>
              <input
                value={formData.private?.legal_last_name || ""}
                onChange={(e) =>
                  updateField("private", "legal_last_name", e.target.value)
                }
                className={`w-full ${theme.inputBg} border ${theme.border} rounded px-3 py-2 text-xs ${theme.text} outline-none focus:border-cyan-500`}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label
                className={`text-[10px] font-bold uppercase mb-1 block ${theme.text}`}
              >
                Full Billing Address <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                value={formData.private?.legal_address || ""}
                onChange={(e) =>
                  updateField("private", "legal_address", e.target.value)
                }
                className={`w-full ${theme.inputBg} border ${theme.border} rounded px-3 py-2 text-xs ${theme.text} outline-none resize-none focus:border-cyan-500`}
              />
            </div>
            <div>
              <label
                className={`text-[10px] font-bold uppercase mb-1 block ${theme.text}`}
              >
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                value={formData.private?.phone_number || ""}
                onChange={(e) =>
                  updateField("private", "phone_number", e.target.value)
                }
                className={`w-full ${theme.inputBg} border ${theme.border} rounded px-3 py-2 text-xs ${theme.text} outline-none focus:border-cyan-500`}
              />
            </div>
          </div>
        </div>
        <div className={`p-4 border-b ${theme.border} grid grid-cols-2 gap-4`}>
          <div>
            <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">
              Union Status <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.private?.union_status || "Non-Union"}
              onChange={(e) =>
                updateField("private", "union_status", e.target.value)
              }
              className={`w-full ${theme.inputBg} border ${theme.border} rounded px-3 py-2 text-xs font-bold ${theme.text} outline-none`}
            >
              <option value="Non-Union">Non-Union</option>
              <option value="SAG-AFTRA">SAG-AFTRA</option>
              <option value="Fi-Core">Fi-Core</option>
              <option value="Eligible">SAG-Eligible</option>
            </select>
          </div>

          <div>
            <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">
              Tax Documents (W-9 / I-9) <span className="text-red-500">*</span>
            </label>
            <div
              className={`relative w-full h-10 ${theme.inputBg} border ${theme.border} rounded-md overflow-hidden group hover:border-slate-500 transition-colors`}
            >
              <div className="absolute inset-0 flex items-center justify-between px-3 z-10">
                <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                  {formData.private?.w9_i9_url ? (
                    <>
                      <div className="text-emerald-500">
                        <FileCheck size={16} />
                      </div>
                      <span
                        className={`text-xs font-bold truncate ${theme.text}`}
                      >
                        {formData.private.w9_i9_url.split("/").pop()}
                      </span>
                    </>
                  ) : (
                    <>
                      <UploadCloud size={16} className="text-slate-400" />
                      <span className="text-xs font-bold text-slate-400 uppercase">
                        {uploading.w9
                          ? "Uploading..."
                          : "Upload W9 / I9 (PDF Only)"}
                      </span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="relative overflow-hidden rounded bg-slate-500/10 hover:bg-cyan-500/10 transition-colors">
                    <div className="px-3 py-1.5 flex items-center gap-1 cursor-pointer">
                      <span className="text-[10px] font-bold text-cyan-600 uppercase">
                        {formData.private?.w9_i9_url ? "Replace" : "Select"}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) =>
                        handleFileUpload(e, "w9", "secure-vault")
                      }
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  {formData.private?.w9_i9_url && (
                    <button
                      onClick={() => handleDeleteMedia("w9")}
                      className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                      title="Remove file"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
              {formData.private?.w9_i9_url && (
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-slate-700/20">
                  <div className="h-full w-full bg-emerald-500" />
                </div>
              )}
              {uploading.w9 && (
                <div className="absolute inset-0 bg-black/10 z-20">
                  <div className="h-full w-full bg-slate-900/50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-cyan-500 border-t-transparent"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BOOKOUTS (OPTIONAL) */}
        <div className={`p-4 border-b ${theme.border}`}>
          <label className="text-[9px] font-bold text-slate-500 uppercase block mb-2">
            Bookouts (Optional)
          </label>
          <div className="space-y-2">
            {(formData.private?.bookouts || []).map((b, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 text-xs ${theme.text} bg-slate-500/5 p-2 rounded`}
              >
                <span className="font-mono">{b.start}</span>{" "}
                <span className="text-slate-500">to</span>{" "}
                <span className="font-mono">{b.end}</span>
                <span className="flex-1 text-slate-500 ml-2 truncate">
                  {b.reason}
                </span>
                <button
                  onClick={() => removeBookout(i)}
                  className="text-red-500 hover:text-red-400"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            <div className="flex gap-2 items-center">
              <input
                type="date"
                value={newBookout.start}
                onChange={(e) =>
                  setNewBookout({ ...newBookout, start: e.target.value })
                }
                className={`bg-transparent border ${theme.border} rounded px-2 py-1 text-xs ${theme.text}`}
              />
              <input
                type="date"
                value={newBookout.end}
                onChange={(e) =>
                  setNewBookout({ ...newBookout, end: e.target.value })
                }
                className={`bg-transparent border ${theme.border} rounded px-2 py-1 text-xs ${theme.text}`}
              />
              <input
                placeholder="Reason"
                value={newBookout.reason}
                onChange={(e) =>
                  setNewBookout({ ...newBookout, reason: e.target.value })
                }
                className={`flex-1 bg-transparent border ${theme.border} rounded px-2 py-1 text-xs ${theme.text}`}
              />
              <button
                onClick={addBookout}
                className="p-1.5 bg-cyan-500/10 text-cyan-500 rounded hover:bg-cyan-500 hover:text-white"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 grid grid-cols-2 gap-4">
          <div>
            <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">
              Agency Rep (Optional)
            </label>
            <input
              value={formData.private?.agency_representation?.name || ""}
              onChange={(e) =>
                updateField("private", "agency_representation", {
                  name: e.target.value,
                })
              }
              className={`w-full ${theme.inputBg} border ${theme.border} rounded px-3 py-2 text-xs ${theme.text} outline-none`}
              placeholder="Agency Name"
            />
          </div>
          <div>
            {/* TRIGGERS: REQUIRED WITH DISCLAIMER */}
            <label className="text-[9px] font-bold text-red-500 uppercase block mb-1">
              Triggers / CWs <span className="text-red-500">*</span>
            </label>
            <input
              value={formData.private?.triggers || ""}
              onChange={(e) =>
                updateField("private", "triggers", e.target.value)
              }
              className={`w-full ${theme.inputBg} border ${theme.border} rounded px-3 py-2 text-xs ${theme.text} outline-none placeholder:text-slate-600`}
              placeholder="e.g. Spiders, SA (Write 'None' if applicable)"
            />
            <p className="text-[9px] text-slate-500 italic mt-1">
              Please write "None" if you have no specific triggers.
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div
        className={`flex items-center justify-between p-3 rounded-lg border ${theme.border} ${theme.inputBg}`}
      >
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <DollarSign size={16} className="text-emerald-500" />
            <input
              type="number"
              placeholder="RATE"
              value={formData.private?.pfh_rate || ""}
              onChange={(e) =>
                updateField("private", "pfh_rate", parseFloat(e.target.value))
              }
              className={`w-16 bg-transparent text-sm font-bold font-mono ${theme.text} outline-none`}
            />
            <span className="text-[10px] font-bold text-slate-500">
              / PFH <span className="text-red-500">*</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                (formData.public?.availability_status || "Available") ===
                "Available"
                  ? "bg-emerald-500"
                  : "bg-red-500"
              }`}
            />
            <select
              value={formData.public?.availability_status || "Available"}
              onChange={(e) =>
                updateField("public", "availability_status", e.target.value)
              }
              className={`bg-transparent text-xs font-bold outline-none uppercase ${theme.text}`}
            >
              <option value="Available">Available</option>
              <option value="Not Available">Not Available</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
