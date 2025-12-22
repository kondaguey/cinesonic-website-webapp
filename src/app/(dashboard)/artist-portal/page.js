"use client";

import React, { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AccountModal from "../../../components/dashboard/AccountModal";
import {
  ArrowLeft,
  ImageIcon,
  Loader2,
  ZoomIn,
  ZoomOut,
  Palette,
  Check,
  Laptop,
  Globe,
  Music,
  FileText,
  ShieldAlert, // For Denial Screen
  ArrowRight,
  Brush, // Theme Icon
} from "lucide-react";

// 🟢 CONFIGURATION
const MIN_BIO = 50;
const MAX_BIO = 800;

const DEFAULT_ROLES = [
  "Illustrator",
  "Graphic Designer",
  "Concept Artist",
  "Animator",
  "Photographer",
  "3D Modeler",
  "UX/UI Designer",
  "Motion Graphics",
];

const DEFAULT_STYLES = [
  "Minimalist",
  "Surrealism",
  "Cyberpunk",
  "Realistic",
  "Watercolor",
  "Pixel Art",
  "Vector",
  "Abstract",
];

// 🟢 INITIALIZE SUPABASE
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// --- COMPONENT: THEMED SINGLE SELECT ---
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
      <label className="block text-[#ff3399] text-xs font-bold uppercase tracking-widest mb-2">
        {label}
      </label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-[#020010]/50 border cursor-pointer rounded-xl p-3 flex justify-between items-center transition-all ${
          isOpen
            ? "border-[#ff3399] ring-1 ring-[#ff3399]"
            : "border-white/10 hover:border-white/30"
        }`}
      >
        <span className={value ? "text-white" : "text-gray-500 text-sm"}>
          {value || placeholder}
        </span>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-[#0c0442] border border-[#ff3399]/30 rounded-xl shadow-2xl z-[9999] max-h-60 overflow-y-auto custom-scrollbar">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              className="px-4 py-3 text-sm text-gray-200 hover:bg-[#ff3399]/20 hover:text-white cursor-pointer transition-colors border-b border-white/5 last:border-0"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- COMPONENT: THEMED MULTI-SELECT (GRID) ---
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
        <label className="text-[#ff3399] text-xs font-bold uppercase tracking-widest">
          {label}
        </label>
        <span
          className={`text-[10px] px-2 py-0.5 rounded font-mono ${
            selected.length >= max
              ? "bg-[#ff3399]/20 text-[#ff3399]"
              : "bg-white/5 text-gray-400"
          }`}
        >
          {selected.length} / {max}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
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
                    ? "bg-[#ff3399] border-[#ff3399] text-white shadow-[0_0_15px_rgba(255,51,153,0.3)] transform scale-105"
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
        })}
      </div>
    </div>
  );
};

export default function ArtistPortal() {
  const router = useRouter();

  // STATE: Page Status
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);
  const [denialReason, setDenialReason] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  // FORM STATE
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    display_name: "",
    bio: "",
    portfolio_url: "",
    style_tags: [],
    social_links: { website: "", instagram: "", linkedin: "" },
  });

  // FILES & CROPPER
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // CROPPER STATE
  const [cropPos, setCropPos] = useState({ x: 0, y: 0 });
  const [cropScale, setCropScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const imageRef = useRef(null);

  // 🔒 GATEKEEPER CHECK & INIT
  useEffect(() => {
    const init = async () => {
      // 1. Check Auth
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/");
        return;
      }
      setCurrentUser(user);

      try {
        // 2. Fetch Data
        const [profileRes, publicRes, privateRes] = await Promise.all([
          supabase.from("profiles").select("role").eq("id", user.id).single(),
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

        // 3. LOGIC CHECK
        // Is primary role 'artist'? OR Does artist profile exist?
        const isPrimaryArtist = profileRes.data?.role === "artist";
        const hasArtistProfile = publicRes.data || privateRes.data;

        if (!isPrimaryArtist && !hasArtistProfile) {
          setDenialReason(
            "Identity Verification Failed: No Artist Profile found for this account."
          );
          setDenied(true);
          setLoading(false);
          return;
        }

        // ✅ SUCCESS
        if (publicRes.data) {
          setFormData({
            display_name: publicRes.data.display_name || "",
            bio: publicRes.data.bio || "",
            portfolio_url: publicRes.data.portfolio_url || "",
            style_tags: publicRes.data.style_tags || [],
            social_links: publicRes.data.social_links || {
              website: "",
              instagram: "",
              linkedin: "",
            },
          });
          setPreviewImage(publicRes.data.headshot_url);
        } else {
          // NEW PROFILE (Authorized but empty)
          setFormData((prev) => ({
            ...prev,
            display_name: user.user_metadata?.full_name || "",
          }));
        }

        setLoading(false);
      } catch (err) {
        console.error("Init Error", err);
        setDenialReason("System Error: Unable to verify credentials.");
        setDenied(true);
        setLoading(false);
      }
    };

    init();
  }, []);

  // --- IMAGE LOGIC ---
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
    canvas.width = 1200;
    canvas.height = 1200;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const img = imageRef.current;
    const visualContainerWidth = 280;
    const outputFactor = canvas.width / visualContainerWidth;
    ctx.save();
    ctx.translate(cropPos.x * outputFactor, cropPos.y * outputFactor);
    const scaleMath =
      (visualContainerWidth / img.naturalWidth) * cropScale * outputFactor;
    ctx.scale(scaleMath, scaleMath);
    ctx.drawImage(img, 0, 0);
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

  // --- SAVE ---
  const handleSave = async () => {
    if (!currentUser) return;
    setIsSaving(true);
    setSuccessMsg("");

    try {
      let imgUrl = previewImage;

      // Upload Image if Changed
      if (imageFile) {
        const file = await getCroppedImg();
        const path = `artists/${currentUser.id}/headshot_${Date.now()}.jpg`;
        await supabase.storage
          .from("public-assets")
          .upload(path, file, { upsert: true });
        const { data } = supabase.storage
          .from("public-assets")
          .getPublicUrl(path);
        imgUrl = data.publicUrl;
      }

      // Upsert Data
      const payload = {
        id: currentUser.id,
        display_name: formData.display_name,
        bio: formData.bio,
        portfolio_url: formData.portfolio_url,
        style_tags: formData.style_tags,
        social_links: formData.social_links,
        headshot_url: imgUrl,
        updated_at: new Date(),
      };

      const { error } = await supabase
        .from("artist_roster_public")
        .upsert(payload);
      if (error) throw error;

      setSuccessMsg("Profile Updated Successfully");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error(err);
      alert("Error saving profile: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // 🔴 ACCESS DENIED SCREEN
  if (!loading && denied) {
    return (
      <div className="min-h-screen bg-[#020010] flex flex-col items-center justify-center relative overflow-hidden p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#ff3399_0%,_transparent_40%)] opacity-10" />
        <div className="z-10 w-full max-w-md bg-[#0a0a15] border border-[#ff3399]/30 rounded-3xl p-8 text-center shadow-2xl animate-in zoom-in-95">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#ff3399]/10 border border-[#ff3399]/20 flex items-center justify-center mb-6">
            <ShieldAlert className="text-[#ff3399]" size={32} />
          </div>
          <h2 className="text-2xl font-serif text-white mb-2">
            ACCESS RESTRICTED
          </h2>
          <p className="text-sm text-gray-400 mb-8 leading-relaxed">
            {denialReason}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push("/hub")}
              className="w-full py-4 bg-white text-black rounded-xl font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              Return to Hub <ArrowRight size={16} />
            </button>
            <p className="text-[10px] text-gray-500">
              Use "My Account" in the Hub to initialize this profile.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 🟣 STUDIO LOADING SCREEN
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#ec4899_0%,_transparent_25%)] opacity-20 animate-pulse" />
        <div className="z-10 flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full border border-pink-500/30 bg-pink-500/10 flex items-center justify-center shadow-[0_0_30px_rgba(236,72,153,0.2)]">
            <Brush className="text-pink-500 animate-bounce" size={32} />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-serif text-white tracking-widest mb-2">
              THE STUDIO
            </h2>
            <div className="flex items-center gap-3 text-pink-500/80 text-xs font-mono tracking-[0.2em] uppercase">
              <Loader2 className="animate-spin" size={12} /> Prepping Canvas...
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#020010] text-white pt-24 pb-20 px-4 font-sans relative overflow-x-hidden">
      {/* THEME BG */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#330019_0%,_#020010_60%)] fixed z-0 pointer-events-none" />

      <div className="absolute top-6 left-6 z-50">
        <Link
          href="/hub"
          className="flex items-center gap-2 text-[#ff3399]/60 hover:text-[#ff3399] text-xs uppercase tracking-widest transition-colors"
        >
          <ArrowLeft size={14} /> Return to Hub
        </Link>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 animate-fade-in">
        {/* LEFT COL: VISUALS (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0a0a15]/80 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl flex flex-col items-center">
            <h3 className="text-[#ff3399] text-xs font-bold uppercase tracking-widest mb-4 w-full text-left">
              Featured Art / Headshot
            </h3>

            {/* CROPPER */}
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
                    Upload Image
                  </span>
                </div>
              )}
            </div>

            {/* CONTROLS */}
            {imageFile && (
              <div className="mt-4 flex items-center gap-4 bg-[#020010]/50 border border-white/10 p-2 rounded-full">
                <button
                  onClick={() => setCropScale((s) => Math.max(0.5, s - 0.1))}
                  className="hover:text-[#ff3399]"
                >
                  <ZoomOut size={16} />
                </button>
                <span className="text-[10px] w-8 text-center text-gray-400">
                  {(cropScale * 100).toFixed(0)}%
                </span>
                <button
                  onClick={() => setCropScale((s) => Math.min(3, s + 0.1))}
                  className="hover:text-[#ff3399]"
                >
                  <ZoomIn size={16} />
                </button>
              </div>
            )}

            {/* UPLOAD BUTTON */}
            <label className="w-full mt-6 border border-dashed border-white/20 hover:border-[#ff3399] rounded-2xl h-12 flex items-center justify-center cursor-pointer transition-colors bg-white/[0.02] gap-2 group">
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
                size={16}
                className="text-gray-400 group-hover:text-[#ff3399]"
              />
              <span className="text-[10px] uppercase tracking-widest text-gray-500 group-hover:text-white">
                Select Image
              </span>
            </label>
          </div>

          {/* BIO */}
          <div className="bg-[#0a0a15]/80 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex justify-between items-end mb-2">
              <label className="text-[#ff3399] text-xs font-bold uppercase tracking-widest">
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
              className="w-full h-40 bg-[#020010]/50 border border-white/10 rounded-xl p-4 text-sm text-gray-300 focus:border-[#ff3399] outline-none resize-none transition-colors"
              placeholder="Tell us about your artistic style, medium, and experience..."
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
            />
          </div>
        </div>

        {/* RIGHT COL: DATA (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* IDENTITY */}
          <div className="bg-[#0a0a15]/80 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl space-y-6">
            <div>
              <label className="block text-[#ff3399] text-xs font-bold uppercase tracking-widest mb-2">
                Artist Name / Alias
              </label>
              <input
                className="w-full bg-[#020010]/50 border border-white/10 rounded-xl p-3 text-white focus:border-[#ff3399] outline-none"
                value={formData.display_name}
                onChange={(e) =>
                  setFormData({ ...formData, display_name: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[#ff3399] text-xs font-bold uppercase tracking-widest mb-2">
                  Portfolio Link
                </label>
                <div className="relative">
                  <Laptop
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <input
                    className="w-full bg-[#020010]/50 border border-white/10 rounded-xl p-3 pl-10 text-white focus:border-[#ff3399] outline-none"
                    placeholder="ArtStation / Behance"
                    value={formData.portfolio_url}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        portfolio_url: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-[#ff3399] text-xs font-bold uppercase tracking-widest mb-2">
                  Instagram (Optional)
                </label>
                <input
                  className="w-full bg-[#020010]/50 border border-white/10 rounded-xl p-3 text-white focus:border-[#ff3399] outline-none"
                  placeholder="@handle"
                  value={formData.social_links?.instagram || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      social_links: {
                        ...formData.social_links,
                        instagram: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* TAGS */}
          <div className="bg-[#0a0a15]/80 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
            <ThemedSelectionGrid
              label="Primary Roles"
              items={DEFAULT_ROLES}
              selected={formData.style_tags.filter((t) =>
                DEFAULT_ROLES.includes(t)
              )}
              max={3}
              onChange={(v) => {
                const others = formData.style_tags.filter(
                  (t) => !DEFAULT_ROLES.includes(t)
                );
                setFormData({ ...formData, style_tags: [...others, ...v] });
              }}
            />
            <div className="w-full h-px bg-white/5 my-6" />
            <ThemedSelectionGrid
              label="Art Styles"
              items={DEFAULT_STYLES}
              selected={formData.style_tags.filter((t) =>
                DEFAULT_STYLES.includes(t)
              )}
              max={5}
              onChange={(v) => {
                const others = formData.style_tags.filter(
                  (t) => !DEFAULT_STYLES.includes(t)
                );
                setFormData({ ...formData, style_tags: [...others, ...v] });
              }}
            />
          </div>

          {/* SAVE BUTTON */}
          <button
            onClick={handleSave}
            disabled={isSaving || formData.bio.length < MIN_BIO}
            className="w-full py-5 bg-[#ff3399] hover:bg-[#ff66b2] text-white font-bold uppercase tracking-[0.2em] rounded-xl shadow-[0_0_20px_rgba(255,51,153,0.3)] hover:shadow-[0_0_30px_rgba(255,51,153,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <Loader2 className="animate-spin" />
            ) : (
              successMsg || "Update Artist Profile"
            )}
          </button>
          <div className="mt-8">
            <AccountModal />
          </div>
        </div>
      </div>
    </div>
  );
}
