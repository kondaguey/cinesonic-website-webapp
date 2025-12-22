"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import AccountModal from "../../../components/dashboard/AccountModal";
import {
  ArrowLeft,
  Loader2,
  BookOpen, // Main Icon
  Feather, // Theme Icon
  Save,
  LogOut,
  Sun,
  Moon,
  ShieldAlert, // Denial Icon
  ArrowRight,
} from "lucide-react";

import AuthorEditor from "../../../components/dashboard/editors/AuthorEditor";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AuthorPortal() {
  const router = useRouter();

  // STATE: Page Status
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);
  const [denialReason, setDenialReason] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  // STATE: Data & UI
  const [saving, setSaving] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [formData, setFormData] = useState({
    id: null,
    full_name: "",
    role: "author",
    public: {},
    private: {},
  });

  // 🔒 GATEKEEPER CHECK
  useEffect(() => {
    const initPortal = async () => {
      // 1. Auth Check (Reads Cookie)
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/");
        return;
      }
      setCurrentUser(user);

      try {
        // 2. Data Fetch (Parallel)
        const [profileRes, publicRes, privateRes] = await Promise.all([
          supabase.from("profiles").select("*").eq("id", user.id).single(),
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

        // 3. LOGIC CHECK
        // Is role 'author'? OR Do they have an author profile?
        const isPrimaryAuthor = profileRes.data?.role === "author";
        const hasAuthorProfile = publicRes.data || privateRes.data;

        if (!isPrimaryAuthor && !hasAuthorProfile) {
          // 🛑 SOFT REJECTION (Cookie Preserved)
          setDenialReason(
            "Identity Verification Failed: No Author Profile found for this account."
          );
          setDenied(true);
          setLoading(false);
          return;
        }

        // ✅ SUCCESS
        setFormData({
          ...profileRes.data,
          public: publicRes.data || {},
          private: privateRes.data || {},
        });

        setLoading(false);
      } catch (err) {
        console.error("Init Error:", err);
        setDenialReason("System Error: Unable to verify credentials.");
        setDenied(true);
        setLoading(false);
      }
    };
    initPortal();
  }, [router]);

  // --- SAVE HANDLER ---
  const handleSave = async () => {
    setSaving(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // MAPPING FOR AUTHOR (Customize based on your editor fields)
      const publicData = {
        ...formData.public,
        id: user.id,
        display_name: formData.public.display_name,
        // Add specific author fields here (e.g. published_works, bio)
        updated_at: new Date().toISOString(),
      };

      const privateData = {
        id: user.id,
        // Add specific author private fields here (e.g. agent info)
        updated_at: new Date().toISOString(),
      };

      const [publicResult, privateResult] = await Promise.all([
        supabase.from("author_roster_public").upsert(publicData),
        supabase.from("author_private").upsert(privateData),
      ]);

      if (publicResult.error) throw publicResult.error;
      if (privateResult.error) throw privateResult.error;

      alert("Author Profile saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Error saving: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  // THEME ENGINE
  const themes = {
    dark: {
      wrapper: "bg-[#020010] text-slate-200",
      header: "bg-[#020010]/80 border-white/10",
      heroGradient: "from-orange-900/40 via-[#020010] to-[#020010]",
      cardBg: "bg-white/5 border-white/10",
      textSecondary: "text-slate-400",
      editor: {
        bg: "bg-transparent",
        text: "text-slate-200",
        border: "border-white/10",
        inputBg: "bg-white/5 focus:bg-white/10",
      },
    },
    light: {
      wrapper: "bg-slate-50 text-slate-800",
      header: "bg-white/80 border-slate-200 shadow-sm",
      heroGradient: "from-orange-100 via-slate-50 to-slate-50",
      cardBg: "bg-white border-slate-200 shadow-xl shadow-slate-200/50",
      textSecondary: "text-slate-500",
      editor: {
        bg: "bg-transparent",
        text: "text-slate-800",
        border: "border-slate-200",
        inputBg: "bg-slate-100 focus:bg-white",
      },
    },
  };

  const activeTheme = isDarkMode ? themes.dark : themes.light;

  // 🔴 ACCESS DENIED SCREEN
  if (!loading && denied) {
    return (
      <div className="min-h-screen bg-[#020010] flex flex-col items-center justify-center relative overflow-hidden p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#f97316_0%,_transparent_40%)] opacity-10" />
        <div className="z-10 w-full max-w-md bg-[#0a0a15] border border-orange-500/20 rounded-3xl p-8 text-center shadow-2xl animate-in zoom-in-95">
          <div className="w-16 h-16 mx-auto rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-6">
            <ShieldAlert className="text-orange-500" size={32} />
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

  // 🟠 LIBRARY LOADING SCREEN
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#f97316_0%,_transparent_25%)] opacity-20 animate-pulse" />
        <div className="z-10 flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full border border-orange-500/30 bg-orange-500/10 flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.2)]">
            <Feather className="text-orange-500 animate-bounce" size={32} />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-serif text-white tracking-widest mb-2">
              THE LIBRARY
            </h2>
            <div className="flex items-center gap-3 text-orange-500/80 text-xs font-mono tracking-[0.2em] uppercase">
              <Loader2 className="animate-spin" size={12} /> Authenticating
              Literary ID...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020010] text-white pt-24 pb-20 px-4 font-sans relative overflow-x-hidden">
      {/* THEME BG */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#431407_0%,_#020010_60%)] fixed z-0 pointer-events-none" />

      <div className="absolute top-6 left-6 z-50">
        <Link
          href="/hub"
          className="flex items-center gap-2 text-orange-500/60 hover:text-orange-500 text-xs uppercase tracking-widest transition-colors"
        >
          <ArrowLeft size={14} /> Return to Hub
        </Link>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 animate-fade-in">
        {/* LEFT COL */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0a0a15]/80 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl flex flex-col items-center">
            <h3 className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-4 w-full text-left">
              Author Headshot
            </h3>
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
                  alt="Headshot"
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
                  <BookOpen size={48} className="opacity-20 mb-2" />
                  <span className="text-[10px] uppercase tracking-widest">
                    No Image
                  </span>
                </div>
              )}
            </div>
            {imageFile && (
              <div className="mt-4 flex items-center gap-4 bg-[#020010]/50 border border-white/10 p-2 rounded-full">
                <button
                  onClick={() => setCropScale((s) => Math.max(0.5, s - 0.1))}
                  className="hover:text-orange-500"
                >
                  <ZoomOut size={16} />
                </button>
                <span className="text-[10px] w-8 text-center text-gray-400">
                  {(cropScale * 100).toFixed(0)}%
                </span>
                <button
                  onClick={() => setCropScale((s) => Math.min(3, s + 0.1))}
                  className="hover:text-orange-500"
                >
                  <ZoomIn size={16} />
                </button>
              </div>
            )}
            <label className="w-full mt-6 border border-dashed border-white/20 hover:border-orange-500 rounded-2xl h-12 flex items-center justify-center cursor-pointer transition-colors bg-white/[0.02] gap-2 group">
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
                className="text-gray-400 group-hover:text-orange-500"
              />
              <span className="text-[10px] uppercase tracking-widest text-gray-500 group-hover:text-white">
                Select Image
              </span>
            </label>
          </div>

          <div className="bg-[#0a0a15]/80 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex justify-between items-end mb-2">
              <label className="text-orange-500 text-xs font-bold uppercase tracking-widest">
                Author Biography
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
              className="w-full h-64 bg-[#020010]/50 border border-white/10 rounded-xl p-4 text-sm text-gray-300 focus:border-orange-500 outline-none resize-none transition-colors"
              placeholder="Tell us about your published works, writing style, and literary background..."
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
            />
          </div>
        </div>

        {/* RIGHT COL */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#0a0a15]/80 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl space-y-6">
            <div>
              <label className="block text-orange-500 text-xs font-bold uppercase tracking-widest mb-2">
                Pen Name / Display Name
              </label>
              <input
                className="w-full bg-[#020010]/50 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 outline-none"
                value={formData.display_name}
                onChange={(e) =>
                  setFormData({ ...formData, display_name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-orange-500 text-xs font-bold uppercase tracking-widest mb-2">
                Website / Amazon Author Page
              </label>
              <div className="relative">
                <Globe
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  className="w-full bg-[#020010]/50 border border-white/10 rounded-xl p-3 pl-10 text-white focus:border-orange-500 outline-none"
                  placeholder="https://"
                  value={formData.website_url}
                  onChange={(e) =>
                    setFormData({ ...formData, website_url: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="bg-[#0a0a15]/80 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
            <ThemedSelectionGrid
              label="Primary Genres"
              items={BOOK_GENRES}
              selected={genres}
              max={4}
              onChange={(v) => setGenres(v)}
            />
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving || formData.bio.length < MIN_BIO}
            className="w-full py-5 bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase tracking-[0.2em] rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-95"
          >
            {isSaving ? (
              <Loader2 className="animate-spin mx-auto" />
            ) : (
              successMsg || "Update Author Profile"
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
