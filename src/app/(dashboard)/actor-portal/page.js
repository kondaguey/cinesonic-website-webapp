"use client";

import React, { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  Mic,
  Image as ImageIcon,
  Loader2,
  ZoomIn,
  ZoomOut,
  Search,
  AlertTriangle,
  Clapperboard,
  Plus,
  Trash2,
  Key,
  User,
  Shield,
  FileText,
  Calendar, // ✅ Correct Import
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
} from "lucide-react";

// 🟢 CONFIGURATION
const MIN_BIO = 50;
const MAX_BIO = 600;

// 🟢 INITIALIZE SUPABASE
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// --- COMPONENT: THEMED DATE PICKER ---
const ThemedDatePicker = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDayClick = (day) => {
    const month = viewDate.getMonth() + 1;
    const year = viewDate.getFullYear();
    const formatted = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
    onChange(formatted);
    setIsOpen(false);
  };

  const changeMonth = (delta) => {
    setViewDate(
      new Date(viewDate.getFullYear(), viewDate.getMonth() + delta, 1)
    );
  };

  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth(),
    1
  ).getDay();

  return (
    <div className="relative" ref={ref}>
      <label className="block text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-2">
        {label}
      </label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-[#020010]/50 border cursor-pointer rounded-xl p-3 flex justify-between items-center transition-all ${
          isOpen
            ? "border-[#5865f2] ring-1 ring-[#5865f2]"
            : "border-white/10 hover:border-white/30"
        }`}
      >
        <span
          className={
            value
              ? "text-white uppercase tracking-wider"
              : "text-gray-500 text-sm"
          }
        >
          {value || "YYYY-MM-DD"}
        </span>
        <Calendar
          size={16}
          className={`text-gray-400 transition-colors ${
            isOpen ? "text-[#d4af37]" : ""
          }`}
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-64 mt-2 bg-[#0c0442] border border-[#5865f2]/30 rounded-xl shadow-2xl z-[9999] p-4 animate-in fade-in zoom-in-95">
          <div className="flex justify-between items-center mb-4">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              className="text-gray-400 hover:text-white"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-[#d4af37] font-bold text-sm uppercase tracking-widest">
              {viewDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button
              type="button"
              onClick={() => changeMonth(1)}
              className="text-gray-400 hover:text-white"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* 🟢 FIX: Added index 'i' and set key={i} to prevent duplicates */}
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <span key={i} className="text-[10px] text-gray-500 font-bold">
                {d}
              </span>
            ))}
            {Array(firstDayOfMonth)
              .fill(null)
              .map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
            {Array(getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth()))
              .fill(null)
              .map((_, i) => {
                const day = i + 1;
                const isSelected =
                  value && parseInt(value.split("-")[2]) === day;
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayClick(day)}
                    className={`h-7 w-7 rounded-full text-xs flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-[#d4af37] text-black font-bold"
                        : "text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};
// --- COMPONENT: THEMED SINGLE SELECT (FIXED Z-INDEX) ---
const ThemedSelect = ({
  label,
  value,
  options,
  onChange,
  placeholder = "Select...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <label className="block text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-2">
        {label}
      </label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-[#020010]/50 border cursor-pointer rounded-xl p-3 flex justify-between items-center transition-all ${
          isOpen
            ? "border-[#5865f2] ring-1 ring-[#5865f2]"
            : "border-white/10 hover:border-white/30"
        }`}
      >
        <span className={value ? "text-white" : "text-gray-500 text-sm"}>
          {value || placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {isOpen && (
        // 🟢 FIX 1: Z-INDEX 9999
        <div className="absolute top-full left-0 w-full mt-2 bg-[#0c0442] border border-[#5865f2]/30 rounded-xl shadow-2xl z-[9999] max-h-60 overflow-y-auto custom-scrollbar">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              className="px-4 py-3 text-sm text-gray-200 hover:bg-[#5865f2]/20 hover:text-white cursor-pointer transition-colors border-b border-white/5 last:border-0"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- COMPONENT: THEMED MULTI-SELECT (FIXED Z-INDEX) ---
const ThemedMultiSelect = ({ label, items, selected = [], onChange, max }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const toggle = (val) => {
    if (selected.includes(val)) onChange(selected.filter((i) => i !== val));
    else if (selected.length < max) onChange([...selected, val]);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div className="flex justify-between items-center mb-2">
        <label className="text-[#d4af37] text-xs font-bold uppercase tracking-widest">
          {label}
        </label>
        <span
          className={`text-[10px] px-2 py-0.5 rounded ${
            selected.length >= max
              ? "bg-red-500/20 text-red-300"
              : "bg-white/5 text-gray-400"
          }`}
        >
          {selected.length} / {max}
        </span>
      </div>

      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-[#020010]/50 border min-h-[50px] cursor-pointer rounded-xl p-2 flex flex-wrap gap-2 items-center transition-all ${
          isOpen
            ? "border-[#5865f2] ring-1 ring-[#5865f2]"
            : "border-white/10 hover:border-white/30"
        }`}
      >
        {selected.length > 0 ? (
          selected.map((item) => (
            <span
              key={item}
              className="bg-[#5865f2]/20 border border-[#5865f2]/50 text-white text-[10px] px-2 py-1 rounded-lg uppercase tracking-wide flex items-center gap-1"
              onClick={(e) => {
                e.stopPropagation();
                toggle(item);
              }}
            >
              {item} <X size={10} className="hover:text-red-400" />
            </span>
          ))
        ) : (
          <span className="text-gray-500 text-sm px-2">Select {label}...</span>
        )}
        <div className="ml-auto pr-2">
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {isOpen && (
        // 🟢 FIX 1: Z-INDEX 9999
        <div className="absolute top-full left-0 w-full mt-2 bg-[#0c0442] border border-[#5865f2]/30 rounded-xl shadow-2xl z-[9999] max-h-60 overflow-y-auto custom-scrollbar p-2 grid grid-cols-2 gap-1">
          {items.map((item) => {
            const isActive = selected.includes(item);
            const isDisabled = !isActive && selected.length >= max;
            return (
              <div
                key={item}
                onClick={() => !isDisabled && toggle(item)}
                className={`px-3 py-2 text-xs rounded-lg cursor-pointer flex justify-between items-center transition-all ${
                  isActive
                    ? "bg-[#5865f2] text-white font-bold shadow-lg"
                    : isDisabled
                    ? "opacity-30 cursor-not-allowed text-gray-500"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item}
                {isActive && <Check size={12} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default function ActorPortal() {
  // VIEW STATE
  const [view, setView] = useState("login");
  const [accessKey, setAccessKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // DATA STATE
  const [listOptions, setListOptions] = useState({
    genres: [],
    voices: [],
    ages: [],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [actorId, setActorId] = useState(null);
  const [publicId, setPublicId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    pseudonym: "",
    gender: "",
    bio: "",
    tags: "",
    genres: [],
    voice_type: [],
    age_range: [],
    status: "Active",
    union_status: "Non-Union",
    pfh_rate: "",
    website_link: "",
    audiobooks_narrated: "",
    next_available: "",
    triggers: "",
    training_notes: "",
    resume_url: "",
  });

  const [bookouts, setBookouts] = useState([]);
  const [newBookout, setNewBookout] = useState({ start: "", end: "" });

  // FILES & CROPPER
  const [headshotFile, setHeadshotFile] = useState(null);
  const [demoFile, setDemoFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // 🟢 FIX 2: CROPPER STATE
  const [cropPos, setCropPos] = useState({ x: 0, y: 0 });
  const [cropScale, setCropScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const imageRef = useRef(null);

  useEffect(() => {
    const fetchLists = async () => {
      const { data } = await supabase.from("lists_db").select("*");
      if (data) {
        setListOptions({
          genres: [...new Set(data.map((i) => i.genre).filter(Boolean))].sort(),
          voices: [
            ...new Set(data.map((i) => i.voice_type).filter(Boolean)),
          ].sort(),
          ages: [
            ...new Set(data.map((i) => i.age_range).filter(Boolean)),
          ].sort(),
        });
      }
    };
    fetchLists();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError("");
    try {
      const { data: actorData } = await supabase
        .from("actor_db")
        .select("*")
        .eq("actor_id", accessKey.trim())
        .single();
      if (actorData) loadActorData(actorData);
      else setLoginError("Invalid Actor ID.");
    } catch (err) {
      setLoginError("Connection Error.");
    }
    setLoading(false);
  };

  const loadActorData = (data) => {
    setActorId(data.id);
    setPublicId(data.actor_id);
    const parseArray = (val) =>
      val
        ? Array.isArray(val)
          ? val
          : val.split(",").map((s) => s.trim())
        : [];

    setFormData({
      name: data.name || "",
      email: data.email || "",
      pseudonym: data.pseudonym || "",
      gender: data.gender || "",
      bio: data.bio || "",
      tags: parseArray(data.voice_type).join(", "),
      genres: parseArray(data.genres),
      voice_type: parseArray(data.voice_type),
      age_range: parseArray(data.age_range),
      status: data.status || "Active",
      union_status: data.union_status || "Non-Union",
      pfh_rate: data.pfh_rate || "",
      website_link: data.website_link || "",
      audiobooks_narrated: data.audiobooks_narrated || "",
      next_available: data.next_available
        ? data.next_available.split("T")[0]
        : "",
      triggers: data.triggers || "",
      training_notes: data.training_notes || "",
      resume_url: data.resume_url || "",
    });

    if (data.bookouts) {
      const ranges = data.bookouts
        .split(",")
        .map((r) => {
          const parts = r.split(" to ");
          return parts.length === 2
            ? { start: parts[0].trim(), end: parts[1].trim() }
            : null;
        })
        .filter(Boolean);
      setBookouts(ranges);
    } else setBookouts([]);

    setPreviewImage(data.headshot_url);
    setHeadshotFile(null);
    setResumeFile(null);
    setDemoFile(null);
    setCropPos({ x: 0, y: 0 });
    setCropScale(1);
    setView("editor");
  };

  // 🟢 FIX 2: DRAG & ZOOM LOGIC RESTORED
  const handleWheel = (e) => {
    if (headshotFile) {
      e.preventDefault();
      setCropScale((s) => Math.min(Math.max(0.5, s - e.deltaY * 0.001), 3));
    }
  };

  const onDragStart = (e) => {
    if (!headshotFile) return;
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragStart.current = { x: clientX - cropPos.x, y: clientY - cropPos.y };
  };

  const onDragMove = (e) => {
    if (!isDragging) return;
    if (e.cancelable) e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setCropPos({
      x: clientX - dragStart.current.x,
      y: clientY - dragStart.current.y,
    });
  };

  const onDragEnd = () => setIsDragging(false);

  const getCroppedImg = async () => {
    if (!imageRef.current || !headshotFile) return null;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Output Resolution
    canvas.width = 800;
    canvas.height = 1067;

    // Fill background
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const img = imageRef.current;

    // 🟢 VISUAL MATH:
    // We treat the visual container (280px) as the "Viewport"
    // We scale the viewport up to the canvas size (800px)
    const ratio = canvas.width / 280;

    ctx.save();

    // 1. Apply Pan (scaled up)
    ctx.translate(cropPos.x * ratio, cropPos.y * ratio);

    // 2. Apply Zoom (scaled up)
    ctx.scale(cropScale * ratio, cropScale * ratio);

    // 3. Draw Image to FIT the "virtual" 280px width
    // This prevents the "zoomed way in" static issue
    const drawWidth = 280;
    const drawHeight = (img.naturalHeight / img.naturalWidth) * 280;

    ctx.drawImage(img, 0, 0, drawWidth, drawHeight);

    ctx.restore();

    return new Promise((resolve) =>
      canvas.toBlob(
        (blob) =>
          resolve(new File([blob], "headshot.jpg", { type: "image/jpeg" })),
        "image/jpeg",
        0.95
      )
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const targetPublicId =
        publicId || "ACT-" + Math.floor(1000 + Math.random() * 9000);
      let headshotUrl = previewImage;
      if (headshotFile) {
        const file = await getCroppedImg();
        const path = `headshots/${Date.now()}-${targetPublicId}.jpg`;
        await supabase.storage.from("roster-assets").upload(path, file);
        const { data } = supabase.storage
          .from("roster-assets")
          .getPublicUrl(path);
        headshotUrl = data.publicUrl;
      }
      let demoUrl = formData.demo_url;
      if (demoFile) {
        const path = `demos/${Date.now()}-${targetPublicId}.mp3`;
        await supabase.storage.from("roster-assets").upload(path, demoFile);
        const { data } = supabase.storage
          .from("roster-assets")
          .getPublicUrl(path);
        demoUrl = data.publicUrl;
      }
      let resumeUrl = formData.resume_url;
      if (resumeFile) {
        const ext = resumeFile.name.split(".").pop();
        const path = `resumes/${Date.now()}-${targetPublicId}.${ext}`;
        await supabase.storage.from("roster-assets").upload(path, resumeFile);
        const { data } = supabase.storage
          .from("roster-assets")
          .getPublicUrl(path);
        resumeUrl = data.publicUrl;
      }
      const payload = {
        name: formData.name,
        actor_id: targetPublicId,
        email: formData.email,
        bio: formData.bio,
        pseudonym: formData.pseudonym,
        gender: formData.gender,
        status: formData.status,
        union_status: formData.union_status,
        pfh_rate: formData.pfh_rate || 0,
        website_link: formData.website_link,
        audiobooks_narrated: formData.audiobooks_narrated,
        next_available: formData.next_available || null,
        triggers: formData.triggers,
        training_notes: formData.training_notes,
        genres: formData.genres.join(", "),
        voice_type: formData.voice_type.join(", "),
        age_range: formData.age_range.join(", "),
        bookouts: bookouts.map((b) => `${b.start} to ${b.end}`).join(", "),
        headshot_url: headshotUrl,
        demo_url: demoUrl,
        resume_url: resumeUrl,
        coming_soon: false,
      };
      const { error } = await supabase
        .from("actor_db")
        .update(payload)
        .eq("id", actorId);
      if (error) throw error;
      setSuccessMsg("Profile Synced Successfully");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      alert("Save failed: " + err.message);
    }
    setIsSaving(false);
  };

  if (view === "login") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[#020010]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#1a0f5e_0%,_#020010_80%)] pointer-events-none" />
        <Link
          href="/dashboard"
          className="absolute top-6 left-6 flex items-center gap-2 text-[#d4af37]/60 hover:text-[#d4af37] text-xs uppercase tracking-widest z-50 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Hub
        </Link>
        <div className="w-full max-w-md bg-[#0a0a15]/80 border border-white/10 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl relative z-10 text-center animate-fade-in-up">
          <div className="w-16 h-16 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(212,175,55,0.1)]">
            <Key className="text-[#d4af37]" size={28} />
          </div>
          <h2 className="text-3xl font-serif text-white mb-2">Actor Portal</h2>
          <p className="text-xs text-gray-400 uppercase tracking-[0.2em] mb-8">
            Secure Talent Access
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="ENTER ACTOR ID"
              className="w-full bg-[#020010]/50 border border-white/10 p-4 rounded-xl text-center text-white tracking-[0.2em] focus:border-[#d4af37] outline-none transition-all placeholder:text-gray-600"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
            />
            {loginError && (
              <div className="text-red-400 text-xs flex items-center justify-center gap-2 bg-red-900/10 py-2 rounded-lg border border-red-500/20">
                <AlertTriangle size={12} /> {loginError}
              </div>
            )}
            <button
              disabled={loading}
              className="w-full bg-[#d4af37] hover:bg-[#b8860b] text-black font-bold py-4 rounded-xl uppercase tracking-widest transition-all shadow-lg hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin mx-auto" />
              ) : (
                "Authenticate"
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // EDITOR
  return (
    <div className="min-h-screen bg-[#020010] text-white pt-24 pb-20 px-4 font-sans relative overflow-x-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1a0f5e_0%,_#020010_60%)] fixed z-0" />
      <div className="absolute top-6 left-6 z-50 flex items-center gap-4">
        <button
          onClick={() => setView("login")}
          className="flex items-center gap-2 text-[#d4af37]/60 hover:text-[#d4af37] text-xs uppercase tracking-widest transition-colors"
        >
          <ArrowLeft size={14} /> Logout
        </button>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 animate-fade-in">
        {/* LEFT COL: ASSETS */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0a0a15]/80 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl flex flex-col items-center">
            <div
              className={`w-[280px] aspect-[3/4] bg-[#020010] rounded-2xl overflow-hidden relative shadow-2xl border border-white/5 group ${
                headshotFile ? "cursor-move" : ""
              }`}
              onMouseDown={headshotFile ? onDragStart : null}
              onMouseMove={headshotFile ? onDragMove : null}
              onMouseUp={onDragEnd}
              onMouseLeave={onDragEnd}
              onTouchStart={headshotFile ? onDragStart : null}
              onTouchMove={headshotFile ? onDragMove : null}
              onTouchEnd={onDragEnd}
              onWheel={handleWheel}
            >
              {previewImage ? (
                <img
                  ref={imageRef}
                  src={previewImage}
                  alt="Headshot"
                  crossOrigin="anonymous"
                  // 🟢 FIX: 'w-full' ensures it fits the container. 'max-w-none' was causing the huge zoom.
                  className={
                    headshotFile
                      ? "w-full absolute origin-top-left"
                      : "w-full h-full object-cover"
                  }
                  draggable="false"
                  style={
                    headshotFile
                      ? {
                          transform: `translate(${cropPos.x}px, ${cropPos.y}px) scale(${cropScale})`,
                        }
                      : {}
                  }
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-700">
                  <User size={48} className="opacity-20 mb-2" />
                  <span className="text-[10px] uppercase tracking-widest">
                    No Headshot
                  </span>
                </div>
              )}
              {headshotFile && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest text-white/80 pointer-events-none border border-white/10">
                  Drag to Crop
                </div>
              )}
            </div>

            {/* ZOOM CONTROLS */}
            {headshotFile && (
              <div className="mt-4 flex items-center gap-4 bg-[#020010]/50 border border-white/10 p-2 rounded-full">
                <button
                  type="button"
                  onClick={() => setCropScale((s) => Math.max(0.5, s - 0.1))}
                  className="hover:text-[#d4af37]"
                >
                  <ZoomOut size={16} />
                </button>
                <span className="text-[10px] w-8 text-center text-gray-400">
                  {(cropScale * 100).toFixed(0)}%
                </span>
                <button
                  type="button"
                  onClick={() => setCropScale((s) => Math.min(3, s + 0.1))}
                  className="hover:text-[#d4af37]"
                >
                  <ZoomIn size={16} />
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 w-full mt-6">
              <label className="relative group border border-dashed border-white/20 hover:border-[#d4af37] rounded-2xl h-24 flex flex-col items-center justify-center transition-colors bg-white/[0.02] cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      setHeadshotFile(e.target.files[0]);
                      setPreviewImage(URL.createObjectURL(e.target.files[0]));
                      setCropPos({ x: 0, y: 0 });
                      setCropScale(1);
                    }
                  }}
                />
                <ImageIcon
                  size={20}
                  className="text-gray-400 group-hover:text-[#d4af37] mb-2"
                />
                <span className="text-[9px] uppercase tracking-widest text-gray-500 group-hover:text-white">
                  Photo
                </span>
              </label>
              <label className="relative group border border-dashed border-white/20 hover:border-[#d4af37] rounded-2xl h-24 flex flex-col items-center justify-center transition-colors bg-white/[0.02] cursor-pointer">
                <input
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files[0] && setDemoFile(e.target.files[0])
                  }
                />
                <Mic
                  size={20}
                  className={`mb-2 ${
                    demoFile
                      ? "text-green-400"
                      : "text-gray-400 group-hover:text-[#d4af37]"
                  }`}
                />
                <span className="text-[9px] uppercase tracking-widest text-gray-500 group-hover:text-white">
                  {demoFile ? "Ready" : "Demo"}
                </span>
              </label>
            </div>

            <label className="w-full mt-4 border border-dashed border-white/20 hover:border-[#d4af37] rounded-xl h-12 flex items-center justify-center cursor-pointer transition-colors bg-white/[0.02] gap-2 group">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) =>
                  e.target.files[0] && setResumeFile(e.target.files[0])
                }
              />
              <FileText
                size={16}
                className={
                  resumeFile
                    ? "text-green-400"
                    : "text-gray-400 group-hover:text-[#d4af37]"
                }
              />
              <span className="text-[10px] uppercase tracking-widest text-gray-500 group-hover:text-white">
                {resumeFile ? "Resume Loaded" : "Upload Resume PDF"}
              </span>
            </label>
          </div>

          <div className="bg-[#0a0a15]/80 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex justify-between items-end mb-2">
              <label className="text-[#d4af37] text-xs font-bold uppercase tracking-widest">
                Biography
              </label>
              <span
                className={`text-[10px] font-mono ${
                  formData.bio.length < MIN_BIO
                    ? "text-red-400"
                    : "text-green-400"
                }`}
              >
                {formData.bio.length} / {MAX_BIO}
              </span>
            </div>
            <textarea
              className="w-full h-40 bg-[#020010]/50 border border-white/10 rounded-xl p-4 text-sm text-gray-300 focus:border-[#d4af37] outline-none resize-none transition-colors"
              placeholder="Actor biography..."
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
            />
          </div>
        </div>

        {/* RIGHT COL: DATA */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#0a0a15]/80 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-2">
                Legal Name
              </label>
              <input
                className="w-full bg-[#020010]/50 border border-white/10 rounded-xl p-3 text-white focus:border-[#d4af37] outline-none"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-2">
                Email
              </label>
              <input
                className="w-full bg-[#020010]/50 border border-white/10 rounded-xl p-3 text-white focus:border-[#d4af37] outline-none"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-2">
                Pseudonym
              </label>
              <input
                className="w-full bg-[#020010]/50 border border-white/10 rounded-xl p-3 text-white focus:border-[#d4af37] outline-none"
                value={formData.pseudonym}
                onChange={(e) =>
                  setFormData({ ...formData, pseudonym: e.target.value })
                }
              />
            </div>
            <ThemedSelect
              label="Gender Identity"
              value={formData.gender}
              options={["Male", "Female", "Non-Binary", "Genderfluid"]}
              onChange={(v) => setFormData({ ...formData, gender: v })}
            />
          </div>

          <div className="bg-[#0a0a15]/80 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl space-y-6 relative z-50">
            <ThemedMultiSelect
              label="Voice Types"
              items={listOptions.voices}
              selected={formData.voice_type}
              max={4}
              onChange={(v) => setFormData({ ...formData, voice_type: v })}
            />
            <ThemedMultiSelect
              label="Genres"
              items={listOptions.genres}
              selected={formData.genres}
              max={6}
              onChange={(v) => setFormData({ ...formData, genres: v })}
            />
            <ThemedMultiSelect
              label="Age Ranges"
              items={listOptions.ages}
              selected={formData.age_range}
              max={3}
              onChange={(v) => setFormData({ ...formData, age_range: v })}
            />
          </div>

          <div className="bg-[#0a0a15]/80 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-40">
            <h3 className="text-[#d4af37] font-serif text-lg mb-6 flex items-center gap-2">
              <Clapperboard size={18} /> Status & Business
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <ThemedSelect
                label="Current Status"
                value={formData.status}
                options={[
                  "Active",
                  "Limited Availability",
                  "On Hiatus",
                  "Booked Solid",
                ]}
                onChange={(v) => setFormData({ ...formData, status: v })}
              />
              {/* 🟢 REPLACED INPUT WITH POPUP */}
              <ThemedDatePicker
                label="Next Open Date"
                value={formData.next_available}
                onChange={(v) =>
                  setFormData({ ...formData, next_available: v })
                }
              />
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <ThemedSelect
                label="Union"
                value={formData.union_status}
                options={["Non-Union", "SAG-Eligible", "SAG-AFTRA", "Fi-Core"]}
                onChange={(v) => setFormData({ ...formData, union_status: v })}
              />
              <div>
                <label className="block text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-2">
                  PFH Rate ($)
                </label>
                <input
                  type="number"
                  className="w-full bg-[#020010]/50 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#d4af37] outline-none"
                  value={formData.pfh_rate}
                  onChange={(e) =>
                    setFormData({ ...formData, pfh_rate: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-2">
                  Books Narrated
                </label>
                <input
                  className="w-full bg-[#020010]/50 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#d4af37] outline-none"
                  placeholder="10+"
                  value={formData.audiobooks_narrated}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      audiobooks_narrated: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="border-t border-white/10 pt-6">
              <label className="block text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-4">
                Bookouts
              </label>
              <div className="space-y-2 mb-4">
                {bookouts.map((b, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-black/40 px-4 py-3 rounded-lg border border-white/5"
                  >
                    <span className="text-xs text-gray-300 font-mono">
                      {b.start} <span className="text-[#d4af37] px-2">to</span>{" "}
                      {b.end}
                    </span>
                    <button
                      onClick={() =>
                        setBookouts(bookouts.filter((_, idx) => idx !== i))
                      }
                      className="text-red-500 hover:text-red-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                {/* 🟢 REPLACED INPUTS WITH POPUPS */}
                <div className="w-full">
                  <ThemedDatePicker
                    label="Start Date"
                    value={newBookout.start}
                    onChange={(v) => setNewBookout({ ...newBookout, start: v })}
                  />
                </div>
                <div className="w-full">
                  <ThemedDatePicker
                    label="End Date"
                    value={newBookout.end}
                    onChange={(v) => setNewBookout({ ...newBookout, end: v })}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (newBookout.start && newBookout.end) {
                      setBookouts([...bookouts, newBookout]);
                      setNewBookout({ start: "", end: "" });
                    }
                  }}
                  className="bg-[#d4af37] hover:bg-[#b8860b] text-black rounded-xl px-4 h-[46px] mt-6 transition-colors flex items-center justify-center"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-[#0a0a15]/80 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-30">
            <h3 className="text-[#d4af37] font-serif text-lg mb-6 flex items-center gap-2">
              <Shield size={18} /> Private Details
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-2">
                  Content Triggers
                </label>
                <textarea
                  className="w-full bg-[#020010]/50 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#d4af37] outline-none h-20 resize-none"
                  placeholder="Content you will not narrate..."
                  value={formData.triggers}
                  onChange={(e) =>
                    setFormData({ ...formData, triggers: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-2">
                  Training / Coaching
                </label>
                <textarea
                  className="w-full bg-[#020010]/50 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#d4af37] outline-none h-20 resize-none"
                  placeholder="Recent workshops, coaches..."
                  value={formData.training_notes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      training_notes: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving || formData.bio.length < MIN_BIO}
            className="w-full py-5 bg-[#d4af37] hover:bg-[#fff8e1] text-black font-bold uppercase tracking-[0.2em] rounded-xl shadow-lg hover:shadow-[#d4af37]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-95"
          >
            {isSaving ? (
              <Loader2 className="animate-spin mx-auto" />
            ) : (
              successMsg || "Save Profile"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
