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
  Palette,
  Plus,
  Trash2,
  Key,
  User,
  Shield,
  FileText,
  Music,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Laptop,
  Globe,
} from "lucide-react";

// 🟢 CONFIGURATION
const MIN_BIO = 50;
const MAX_BIO = 800;

// 🟢 DEFAULTS (FALLBACKS if DB is empty/fails)
const DEFAULT_ROLES = [
  "Vocalist",
  "Producer",
  "Songwriter",
  "Audio Engineer",
  "Visual Artist",
  "Director",
  "Photographer",
  "Designer",
  "Musician",
  "DJ",
];

const DEFAULT_STYLES = [
  "Hip Hop",
  "R&B",
  "Pop",
  "Electronic",
  "Rock",
  "Alternative",
  "Soul",
  "Jazz",
  "Afrobeat",
  "Latin",
];

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
        <ChevronDown
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

// --- COMPONENT: THEMED SINGLE SELECT (Kept simple) ---
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
    <div className="relative" ref={ref} style={{ zIndex: isOpen ? 50 : 1 }}>
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

// --- COMPONENT: THEMED MULTI-SELECT (GRID MODE) ---
const ThemedSelectionGrid = ({
  label,
  items,
  selected = [],
  onChange,
  max,
}) => {
  const toggle = (val) => {
    if (selected.includes(val)) onChange(selected.filter((i) => i !== val));
    else if (selected.length < max) onChange([...selected, val]);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3">
        <label className="text-[#d4af37] text-xs font-bold uppercase tracking-widest">
          {label}
        </label>
        <span
          className={`text-[10px] px-2 py-0.5 rounded font-mono ${
            selected.length >= max
              ? "bg-[#d4af37]/20 text-[#d4af37]"
              : "bg-white/5 text-gray-400"
          }`}
        >
          {selected.length} / {max}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {items && items.length > 0 ? (
          items.map((item) => {
            const isActive = selected.includes(item);
            const isMaxed = !isActive && selected.length >= max;

            return (
              <button
                key={item}
                type="button"
                onClick={() => !isMaxed && toggle(item)}
                disabled={isMaxed}
                className={`
                  px-3 py-2 rounded-lg text-xs font-medium border transition-all duration-200 flex items-center gap-2
                  ${
                    isActive
                      ? "bg-[#5865f2] border-[#5865f2] text-white shadow-[0_0_15px_rgba(88,101,242,0.3)] transform scale-105"
                      : isMaxed
                      ? "bg-transparent border-white/5 text-gray-600 cursor-not-allowed opacity-50"
                      : "bg-[#020010]/30 border-white/10 text-gray-400 hover:border-white/30 hover:text-gray-200 hover:bg-white/5"
                  }
                `}
              >
                {item}
                {isActive && <Check size={12} className="text-white" />}
              </button>
            );
          })
        ) : (
          <div className="text-gray-500 text-xs italic p-4 border border-white/5 rounded-lg w-full text-center">
            Initializing Selection Options...
          </div>
        )}
      </div>
    </div>
  );
};

export default function ArtistPortal() {
  // VIEW STATE
  const [view, setView] = useState("login");
  const [accessKey, setAccessKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // DATA STATE
  // 🟢 Initialize with defaults so it never looks broken
  const [listOptions, setListOptions] = useState({
    roles: DEFAULT_ROLES,
    styles: DEFAULT_STYLES,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [artistId, setArtistId] = useState(null);
  const [publicId, setPublicId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    roles: [],
    styles: [],
    software: "",
    rates_info: "",
    status: "Active",
    website_link: "",
    portfolio_url: "",
    resume_url: "",
  });

  // FILES & CROPPER
  const [imageFile, setImageFile] = useState(null);
  const [reelFile, setReelFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // CROPPER STATE
  const [cropPos, setCropPos] = useState({ x: 0, y: 0 });
  const [cropScale, setCropScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const imageRef = useRef(null);

  // 🟢 FETCH LISTS (UPDATED COLUMN NAMES)
  useEffect(() => {
    const fetchLists = async () => {
      try {
        const { data, error } = await supabase.from("lists_db").select("*");

        if (error) {
          console.error("Supabase Error (lists_db):", error);
          // Keep defaults if error
          return;
        }

        if (data && data.length > 0) {
          // 🟢 UPDATED: Using 'roles' and 'styles' columns
          const dbRoles = [
            ...new Set(data.map((i) => i.roles).filter(Boolean)),
          ].sort();
          const dbStyles = [
            ...new Set(data.map((i) => i.styles).filter(Boolean)),
          ].sort();

          // Only update if DB has data, otherwise stick to defaults
          setListOptions({
            roles: dbRoles.length > 0 ? dbRoles : DEFAULT_ROLES,
            styles: dbStyles.length > 0 ? dbStyles : DEFAULT_STYLES,
          });
        }
      } catch (err) {
        console.error("Connection Error fetching lists:", err);
      }
    };

    fetchLists();
  }, []);

  // --- LOGIN (ARTIST ONLY) ---
  // --- LOGIN (ARTIST ONLY) ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError("");

    try {
      // 🟢 FIX: Use the Secure Tunnel (RPC) instead of .select()
      const { data: artistArray, error } = await supabase.rpc(
        "secure_artist_login",
        {
          secret_id: accessKey.trim(),
        }
      );

      // RPC returns an array, check if we got a match
      if (artistArray && artistArray.length > 0) {
        loadArtistData(artistArray[0]);
      } else {
        setLoginError("Invalid Artist ID.");
      }
    } catch (err) {
      console.error(err);
      setLoginError("Connection Error.");
    }
    setLoading(false);
  };

  const loadArtistData = (data) => {
    setArtistId(data.id);
    setPublicId(data.artist_id);

    const parseArray = (val) =>
      val
        ? Array.isArray(val)
          ? val
          : val.split(",").map((s) => s.trim())
        : [];

    setFormData({
      name: data.name || "",
      email: data.email || "",
      bio: data.bio || "",
      roles: parseArray(data.roles),
      styles: parseArray(data.styles),
      software: data.software || "",
      rates_info: data.rates_info || "",
      status: data.status || "Active",
      website_link: data.website_link || "",
      portfolio_url: data.portfolio_url || "",
      resume_url: data.resume_url || "",
    });

    setPreviewImage(data.featured_image_url);
    setImageFile(null);
    setResumeFile(null);
    setReelFile(null);
    setCropPos({ x: 0, y: 0 });
    setCropScale(1);
    setView("editor");
  };

  // --- IMAGE LOGIC (FIXED) ---
  const handleWheel = (e) => {
    if (imageFile) {
      e.preventDefault();
      setCropScale((s) => Math.min(Math.max(0.5, s - e.deltaY * 0.001), 3));
    }
  };

  const onDragStart = (e) => {
    if (!imageFile) return;
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
    if (!imageRef.current || !imageFile) return null;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Output Resolution
    canvas.width = 1200;
    canvas.height = 1200; // Artists often need square, or adjust as needed

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const img = imageRef.current;

    // 🟢 VISUAL MATH:
    const visualContainerWidth = 280;
    const outputFactor = canvas.width / visualContainerWidth;

    ctx.save();

    // 1. Apply Pan
    ctx.translate(cropPos.x * outputFactor, cropPos.y * outputFactor);

    // 2. Apply Zoom
    const scaleMath =
      (visualContainerWidth / img.naturalWidth) * cropScale * outputFactor;
    ctx.scale(scaleMath, scaleMath);

    // 3. Draw Image
    ctx.drawImage(img, 0, 0);

    ctx.restore();

    return new Promise((resolve) =>
      canvas.toBlob(
        (blob) =>
          resolve(new File([blob], "featured_art.jpg", { type: "image/jpeg" })),
        "image/jpeg",
        0.95
      )
    );
  };

  // --- SAVE ---
  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const targetPublicId =
        publicId || "ART-" + Math.floor(1000 + Math.random() * 9000);

      let imgUrl = previewImage;
      if (imageFile) {
        const file = await getCroppedImg();
        const path = `art_samples/${Date.now()}-${targetPublicId}.jpg`;
        await supabase.storage.from("roster-assets").upload(path, file);
        const { data } = supabase.storage
          .from("roster-assets")
          .getPublicUrl(path);
        imgUrl = data.publicUrl;
      }

      let demoUrl = formData.demo_url;
      if (reelFile) {
        const ext = reelFile.name.split(".").pop();
        const path = `demos/${Date.now()}-${targetPublicId}.${ext}`;
        await supabase.storage.from("roster-assets").upload(path, reelFile);
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
        artist_id: targetPublicId,
        email: formData.email,
        bio: formData.bio,
        status: formData.status,
        software: formData.software,
        rates_info: formData.rates_info,
        website_link: formData.website_link,
        portfolio_url: formData.portfolio_url,
        roles: formData.roles.join(", "),
        styles: formData.styles.join(", "),
        featured_image_url: imgUrl,
        demo_url: demoUrl,
        resume_url: resumeUrl,
      };

      // 🟢 SECURE TUNNEL (Bypasses the RLS Lock)
      const { error } = await supabase.rpc("secure_artist_self_update", {
        p_access_key: accessKey, // The key they logged in with (e.g. ART-5678)
        p_updates: payload,
      });

      if (error) throw error;

      setSuccessMsg("Artist Profile Synced");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      alert("Save failed: " + err.message);
    }
    setIsSaving(false);
  };

  // 🟢 VIEW: LOGIN
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
            <Palette className="text-[#d4af37]" size={28} />
          </div>
          <h2 className="text-3xl font-serif text-white mb-2">Artist Portal</h2>
          <p className="text-xs text-gray-400 uppercase tracking-[0.2em] mb-8">
            Musicians, Designers & Creatives
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="ENTER ARTIST ID"
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

  // 🟢 VIEW: EDITOR
  return (
    <div className="min-h-screen bg-[#020010] text-white pt-24 pb-20 px-4 font-sans relative overflow-x-hidden">
      {/* THEME BG */}
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
        {/* LEFT COL: VISUALS (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* VISUAL IDENTITY CARD */}
          <div className="bg-[#0a0a15]/80 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl flex flex-col items-center">
            <div
              className={`w-[280px] aspect-[3/4] bg-[#020010] rounded-2xl overflow-hidden relative shadow-2xl border border-white/5 group ${
                imageFile ? "cursor-move" : ""
              }`}
              onMouseDown={imageFile ? onDragStart : null}
              onMouseMove={imageFile ? onDragMove : null}
              onMouseUp={onDragEnd}
              onMouseLeave={onDragEnd}
              onTouchStart={imageFile ? onDragStart : null}
              onTouchMove={imageFile ? onDragMove : null}
              onTouchEnd={onDragEnd}
              onWheel={handleWheel}
            >
              {previewImage ? (
                <img
                  ref={imageRef}
                  src={previewImage}
                  alt="Visual Identity"
                  crossOrigin="anonymous"
                  className={
                    imageFile
                      ? "w-full absolute origin-top-left"
                      : "w-full h-full object-cover"
                  }
                  draggable="false"
                  style={
                    imageFile
                      ? {
                          transform: `translate(${cropPos.x}px, ${cropPos.y}px) scale(${cropScale})`,
                        }
                      : {}
                  }
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-700">
                  <Palette size={48} className="opacity-20 mb-2" />
                  <span className="text-[10px] uppercase tracking-widest">
                    No Visual
                  </span>
                </div>
              )}
              {imageFile && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest text-white/80 pointer-events-none border border-white/10">
                  Drag to Crop
                </div>
              )}
            </div>

            {/* ZOOM CONTROLS */}
            {imageFile && (
              <div className="mt-4 flex items-center gap-4 bg-[#020010]/50 border border-white/10 p-2 rounded-full">
                <button
                  onClick={() => setCropScale((s) => Math.max(0.5, s - 0.1))}
                  className="hover:text-[#d4af37]"
                >
                  <ZoomOut size={16} />
                </button>
                <span className="text-[10px] w-8 text-center text-gray-400">
                  {(cropScale * 100).toFixed(0)}%
                </span>
                <button
                  onClick={() => setCropScale((s) => Math.min(3, s + 0.1))}
                  className="hover:text-[#d4af37]"
                >
                  <ZoomIn size={16} />
                </button>
              </div>
            )}

            {/* UPLOADS */}
            <div className="grid grid-cols-2 gap-4 w-full mt-6">
              <label className="relative group border border-dashed border-white/20 hover:border-[#d4af37] rounded-2xl h-24 flex flex-col items-center justify-center transition-colors bg-white/[0.02] cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      setImageFile(e.target.files[0]);
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
                  Featured Piece
                </span>
              </label>
              <label className="relative group border border-dashed border-white/20 hover:border-[#d4af37] rounded-2xl h-24 flex flex-col items-center justify-center transition-colors bg-white/[0.02] cursor-pointer">
                <input
                  type="file"
                  accept="audio/*,video/*"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files[0] && setReelFile(e.target.files[0])
                  }
                />
                <Music
                  size={20}
                  className={`mb-2 ${
                    reelFile
                      ? "text-green-400"
                      : "text-gray-400 group-hover:text-[#d4af37]"
                  }`}
                />
                <span className="text-[9px] uppercase tracking-widest text-gray-500 group-hover:text-white">
                  {reelFile ? "Reel Ready" : "A/V Reel"}
                </span>
              </label>
            </div>

            {/* RESUME UPLOAD */}
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
                {resumeFile ? "Resume Loaded" : "Upload CV / Resume"}
              </span>
            </label>
          </div>

          {/* BIO */}
          <div className="bg-[#0a0a15]/80 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex justify-between items-end mb-2">
              <label className="text-[#d4af37] text-xs font-bold uppercase tracking-widest">
                Artist Biography
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
              placeholder="Tell us about your style and experience..."
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
            />
          </div>
        </div>

        {/* RIGHT COL: DATA (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* BASIC INFO */}
          <div className="bg-[#0a0a15]/80 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl grid grid-cols-1 gap-6">
            <div>
              <label className="block text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-2">
                Name / Alias
              </label>
              <input
                className="w-full bg-[#020010]/50 border border-white/10 rounded-xl p-3 text-white focus:border-[#d4af37] outline-none"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              {/* DIGITAL PRESENCE */}
              <div>
                <label className="block text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-2">
                  Website / Linktree
                </label>
                <div className="relative">
                  <Globe
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <input
                    className="w-full bg-[#020010]/50 border border-white/10 rounded-xl p-3 pl-10 text-white focus:border-[#d4af37] outline-none"
                    placeholder="https://"
                    value={formData.website_link}
                    onChange={(e) =>
                      setFormData({ ...formData, website_link: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-2">
                Portfolio Link (Behance, ArtStation, etc.)
              </label>
              <div className="relative">
                <Laptop
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  className="w-full bg-[#020010]/50 border border-white/10 rounded-xl p-3 pl-10 text-white focus:border-[#d4af37] outline-none"
                  placeholder="https://"
                  value={formData.portfolio_url}
                  onChange={(e) =>
                    setFormData({ ...formData, portfolio_url: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* DYNAMIC LISTS - NEW GRID MODE (No Dropdowns) */}
          <div className="bg-[#0a0a15]/80 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl space-y-8">
            <ThemedSelectionGrid
              label="Primary Roles"
              items={listOptions.roles}
              selected={formData.roles}
              max={3}
              onChange={(v) => setFormData({ ...formData, roles: v })}
            />

            {/* Divider */}
            <div className="w-full h-px bg-white/5" />

            <ThemedSelectionGrid
              label="Artistic Styles / Genres"
              items={listOptions.styles}
              selected={formData.styles}
              max={5}
              onChange={(v) => setFormData({ ...formData, styles: v })}
            />
          </div>

          {/* BUSINESS */}
          <div className="bg-[#0a0a15]/80 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
            <h3 className="text-[#d4af37] font-serif text-lg mb-6 flex items-center gap-2">
              <Laptop size={18} /> Professional Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <ThemedSelect
                label="Current Status"
                value={formData.status}
                options={[
                  "Active",
                  "Open to Commissions",
                  "Booked Solid",
                  "On Hiatus",
                ]}
                onChange={(v) => setFormData({ ...formData, status: v })}
              />
              <div>
                <label className="block text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-2">
                  Software / Tools
                </label>
                <input
                  className="w-full bg-[#020010]/50 border border-white/10 rounded-xl p-3 text-white focus:border-[#d4af37] outline-none"
                  placeholder="e.g. Logic Pro, Photoshop, Blender"
                  value={formData.software}
                  onChange={(e) =>
                    setFormData({ ...formData, software: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <label className="block text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-2">
                Rates / Pricing Info
              </label>
              <textarea
                className="w-full bg-[#020010]/50 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#d4af37] outline-none h-20 resize-none"
                placeholder="Briefly describe your rates (e.g. '$300 per cover', '$50/hr')..."
                value={formData.rates_info}
                onChange={(e) =>
                  setFormData({ ...formData, rates_info: e.target.value })
                }
              />
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
              successMsg || "Save Artist Profile"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
