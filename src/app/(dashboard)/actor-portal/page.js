"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import {
  Save,
  Loader2,
  ArrowLeft,
  LogOut,
  Mic,
  Sun,
  Moon,
  Sparkles,
  Zap,
  CheckCircle2,
  Mic2, // Green Room Icon
  ShieldAlert, // For Denial Screen
  ArrowRight,
} from "lucide-react";

import ActorEditor from "../../../components/dashboard/editors/ActorEditor";
import AccountModal from "../../../components/dashboard/AccountModal";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ActorPortalPage() {
  const router = useRouter();

  // STATE: Page Status
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false); // New: Tracks rejection
  const [denialReason, setDenialReason] = useState(""); // New: Custom message

  // STATE: Data & UI
  const [saving, setSaving] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    full_name: "",
    role: "actor",
    public: {},
    private: {},
  });

  // 🔒 GATEKEEPER CHECK
  useEffect(() => {
    const initPortal = async () => {
      // 1. Auth Check
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/"); // Strictly for logged-out users
        return;
      }
      setUser(user);

      try {
        // 2. Data Fetch
        const [profileRes, publicRes, privateRes] = await Promise.all([
          supabase.from("profiles").select("*").eq("id", user.id).single(),
          supabase
            .from("actor_roster_public")
            .select("*")
            .eq("id", user.id)
            .single(),
          supabase.from("actor_private").select("*").eq("id", user.id).single(),
        ]);

        // 3. LOGIC CHECK
        const isPrimaryActor = profileRes.data?.role === "actor";
        const hasActorProfile = publicRes.data || privateRes.data;

        if (!isPrimaryActor && !hasActorProfile) {
          // 🛑 STOP: Do not redirect. Show Denial Screen.
          setDenialReason(
            "Identity Verification Failed: No Actor Profile found for this account."
          );
          setDenied(true);
          setLoading(false);
          return;
        }

        // ✅ SUCCESS: Load Data
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

  // --- FILE UPLOAD HELPER ---
  const uploadAsset = async (file, bucket, folder) => {
    if (!file) return null;
    const fileExt = file.name.split(".").pop();
    const fileName = `${folder}/${user.id}-${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // PREPARE PUBLIC
      const publicData = {
        ...formData.public,
        id: user.id,
        display_name: formData.public.display_name,
        website_url: formData.public.social_links?.website,
        headshot_url: formData.public.headshot_url,
        bio: formData.public.bio,
        demo_reel_url: formData.public.demo_reel_url,
        resume_url: formData.public.resume_url,
        home_studio_specs: formData.public.home_studio_specs,
        voice_types: formData.public.voice_types,
        accents: formData.public.accents,
        genres: formData.public.genres,
        age_ranges: formData.public.age_ranges,
        social_links: formData.public.social_links,
        availability_status: formData.public.availability_status,
        updated_at: new Date().toISOString(),
      };

      // PREPARE PRIVATE
      const privateData = {
        id: user.id,
        legal_first_name: formData.private.legal_first_name,
        legal_last_name: formData.private.legal_last_name,
        legal_address: formData.private.legal_address,
        phone_number: formData.private.phone_number,
        union_status: formData.private.union_status,
        pfh_rate: formData.private.pfh_rate,
        agency_representation: formData.private.agency_representation,
        bookouts: formData.private.bookouts,
        w9_i9_url: formData.private.w9_i9_url,
        triggers: formData.private.triggers,
        tax_documents_status: formData.private.tax_documents_status,
        updated_at: new Date().toISOString(),
      };

      const [publicResult, privateResult] = await Promise.all([
        supabase.from("actor_roster_public").upsert(publicData),
        supabase.from("actor_private").upsert(privateData),
      ]);

      if (publicResult.error) throw new Error(publicResult.error.message);
      if (privateResult.error) throw new Error(privateResult.error.message);

      // Custom Success UI (Optional: Replace alert with toast later)
      alert("Profile saved successfully!");
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
      heroGradient: "from-emerald-900/40 via-[#020010] to-[#020010]",
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
      heroGradient: "from-emerald-100 via-slate-50 to-slate-50",
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

  // 🔴 ACCESS DENIED SCREEN (Replaces Browser Popup)
  if (!loading && denied) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#ef4444_0%,_transparent_40%)] opacity-10" />
        <div className="z-10 w-full max-w-md bg-[#0a0a0a] border border-red-500/20 rounded-3xl p-8 text-center shadow-2xl animate-in zoom-in-95">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
            <ShieldAlert className="text-red-500" size={32} />
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

  // 🟢 GREEN ROOM LOADING SCREEN
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#10b981_0%,_transparent_25%)] opacity-20 animate-pulse" />
        <div className="z-10 flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <Mic2 className="text-emerald-500 animate-bounce" size={32} />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-serif text-white tracking-widest mb-2">
              THE GREEN ROOM
            </h2>
            <div className="flex items-center gap-3 text-emerald-500/80 text-xs font-mono tracking-[0.2em] uppercase">
              <Loader2 className="animate-spin" size={12} /> Verifying
              Credentials...
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-500 ${activeTheme.wrapper} pb-32`}
    >
      {/* HEADER */}
      <div
        className={`sticky top-0 z-50 backdrop-blur-xl border-b px-6 py-4 flex items-center justify-between transition-colors duration-500 ${activeTheme.header}`}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/hub")}
            className={`p-2 rounded-full transition-colors ${
              isDarkMode
                ? "hover:bg-white/10 text-slate-400 hover:text-white"
                : "hover:bg-slate-100 text-slate-500 hover:text-slate-900"
            }`}
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isDarkMode
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-emerald-100 text-emerald-600"
              }`}
            >
              <Mic size={20} />
            </div>
            <div>
              <h1 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                Actor Portal
              </h1>
              <p
                className={`text-[10px] uppercase tracking-wider ${activeTheme.textSecondary}`}
              >
                {formData.full_name || "Guest Talent"}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full transition-all ${
              isDarkMode
                ? "bg-white/5 text-yellow-400 hover:bg-white/10"
                : "bg-slate-100 text-indigo-500 hover:bg-slate-200"
            }`}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg ${
              isDarkMode
                ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20"
                : "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-400/50"
            }`}
          >
            {saving ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              <Save size={14} />
            )}
            {saving ? "Syncing..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* HERO */}
      <div
        className={`relative h-64 w-full bg-gradient-to-b ${activeTheme.heroGradient} transition-colors duration-500`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4 max-w-2xl px-6">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                isDarkMode
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-white border-slate-200 text-emerald-600 shadow-sm"
              }`}
            >
              <Sparkles size={12} /> Priority Talent
            </div>
            <h2
              className={`text-4xl md:text-5xl font-serif ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}
            >
              Welcome to the{" "}
              <span
                className={isDarkMode ? "text-emerald-400" : "text-emerald-600"}
              >
                Green Room
              </span>
            </h2>
          </div>
        </div>
      </div>

      {/* EDITOR */}
      <div className="max-w-5xl mx-auto px-6 -mt-12 relative z-10">
        <div
          className={`rounded-3xl p-8 backdrop-blur-xl transition-colors duration-500 ${activeTheme.cardBg}`}
        >
          <div
            className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 pb-8 border-b ${
              isDarkMode ? "border-white/10" : "border-slate-100"
            }`}
          ></div>
          <ActorEditor
            formData={formData}
            setFormData={setFormData}
            theme={activeTheme.editor}
          />
        </div>
        <div className="mt-8">
          <AccountModal />
        </div>
        <div className="mt-16 flex flex-col items-center gap-4">
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/dashboard");
            }}
            className={`text-xs flex items-center gap-2 uppercase tracking-widest transition-colors opacity-60 hover:opacity-100 ${
              isDarkMode ? "text-red-400" : "text-red-600"
            }`}
          >
            <LogOut size={14} /> End Secure Session
          </button>
          <p
            className={`text-[10px] uppercase tracking-widest ${activeTheme.textSecondary} opacity-40`}
          >
            CineSonic Talent OS • V4.5 Secure
          </p>
        </div>
      </div>
    </div>
  );
}

const StatBox = ({ icon: Icon, label, value, theme }) => (
  <div
    className={`flex items-center gap-3 p-3 rounded-2xl ${
      theme ? "bg-white/5" : "bg-slate-50"
    }`}
  >
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center ${
        theme
          ? "bg-emerald-500/20 text-emerald-400"
          : "bg-emerald-100 text-emerald-600"
      }`}
    >
      <Icon size={14} />
    </div>
    <div>
      <div
        className={`text-[9px] font-bold uppercase tracking-wider ${
          theme ? "text-slate-500" : "text-slate-400"
        }`}
      >
        {label}
      </div>
      <div
        className={`text-xs font-bold ${
          theme ? "text-white" : "text-slate-900"
        }`}
      >
        {value}
      </div>
    </div>
  </div>
);

const LoadingScreen = () => (
  <div className="h-screen w-full bg-[#020010] flex flex-col items-center justify-center gap-4 relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#10b981_0%,_#020010_40%)] opacity-20" />
    <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin relative z-10" />
    <div className="font-mono text-emerald-500 text-xs tracking-[0.3em] animate-pulse relative z-10">
      CONNECTING TO GREEN ROOM...
    </div>
  </div>
);
