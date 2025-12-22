"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import {
  X,
  UserCog,
  LogOut,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Mic,
  Palette,
  BookOpen,
  Plus,
  ArrowRight,
} from "lucide-react";

// --- CONFIGURATION ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AccountModal({ isOpen, onClose }) {
  const router = useRouter();

  // USER STATE
  const [user, setUser] = useState(null);

  // SECURITY STATE
  const [newPassword, setNewPassword] = useState("");
  const [passLoading, setPassLoading] = useState(false);
  const [passMessage, setPassMessage] = useState(null);

  // IDENTITY STATE
  const [identitiesLoading, setIdentitiesLoading] = useState(true);
  const [profiles, setProfiles] = useState({
    actor: false,
    artist: false,
    author: false,
  });
  const [creating, setCreating] = useState(null); // 'actor' | 'artist' | 'author'

  // --- 1. INITIALIZATION ---
  useEffect(() => {
    if (isOpen) {
      initData();
    } else {
      // Reset forms on close
      setNewPassword("");
      setPassMessage(null);
    }
  }, [isOpen]);

  const initData = async () => {
    setIdentitiesLoading(true);

    // A. Get Current User
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();
    if (!currentUser) {
      onClose();
      return;
    }
    setUser(currentUser);

    // B. Check Identities (Parallel)
    const [actorCheck, artistCheck, authorCheck] = await Promise.all([
      supabase
        .from("actor_roster_public")
        .select("id")
        .eq("id", currentUser.id)
        .single(),
      supabase
        .from("artist_roster_public")
        .select("id")
        .eq("id", currentUser.id)
        .single(),
      supabase
        .from("author_roster_public")
        .select("id")
        .eq("id", currentUser.id)
        .single(),
    ]);

    setProfiles({
      actor: !!actorCheck.data,
      artist: !!artistCheck.data,
      author: !!authorCheck.data,
    });
    setIdentitiesLoading(false);
  };

  // --- 2. IDENTITY ACTIONS ---
  const handleInitializeProfile = async (type) => {
    setCreating(type);
    try {
      // Fetch user's name for default display name
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      const displayName = profile?.full_name || "New Talent Profile";
      let table = "";

      if (type === "actor") table = "actor_roster_public";
      if (type === "artist") table = "artist_roster_public";
      if (type === "author") table = "author_roster_public";

      const { error } = await supabase.from(table).insert({
        id: user.id,
        display_name: displayName,
        updated_at: new Date(),
      });

      if (error) throw error;

      await initData();
    } catch (err) {
      alert(`Error initializing ${type}: ${err.message}`);
    } finally {
      setCreating(null);
    }
  };

  const handleNavigate = (path) => {
    onClose();
    router.push(path);
  };

  // --- 3. SECURITY ACTIONS ---
  const handleUpdatePassword = async () => {
    if (newPassword.length < 6) {
      setPassMessage({
        type: "error",
        text: "Password must be at least 6 characters.",
      });
      return;
    }
    setPassLoading(true);
    setPassMessage(null);

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    setPassLoading(false);
    if (error) {
      setPassMessage({ type: "error", text: error.message });
    } else {
      setPassMessage({ type: "success", text: "Password updated securely." });
      setNewPassword("");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/hub");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-[#0a0a15] border border-white/10 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#d4af37] to-[#8a7224] flex items-center justify-center shadow-lg text-black">
            <UserCog size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white uppercase tracking-widest">
              My Account
            </h2>
            <p className="text-[10px] text-gray-400 font-mono">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* --- SECTION A: IDENTITY MANAGER --- */}
          <div>
            <h3 className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <ShieldCheck size={12} /> Access & Identities
            </h3>

            {identitiesLoading ? (
              <div className="py-8 text-center">
                <Loader2 className="animate-spin mx-auto text-gray-600" />
              </div>
            ) : (
              <div className="space-y-2">
                <IdentityRow
                  label="Actor Portal"
                  icon={Mic}
                  active={profiles.actor}
                  color="text-[#00f0ff]"
                  loading={creating === "actor"}
                  onInit={() => handleInitializeProfile("actor")}
                  onGo={() => handleNavigate("/actor-portal")}
                />
                <IdentityRow
                  label="Artist Portal"
                  icon={Palette}
                  active={profiles.artist}
                  color="text-[#ff3399]"
                  loading={creating === "artist"}
                  onInit={() => handleInitializeProfile("artist")}
                  onGo={() => handleNavigate("/artist-portal")}
                />
                <IdentityRow
                  label="Author Portal"
                  icon={BookOpen}
                  active={profiles.author}
                  color="text-orange-500"
                  loading={creating === "author"}
                  onInit={() => handleInitializeProfile("author")}
                  onGo={() => handleNavigate("/author-portal")}
                />
              </div>
            )}
          </div>

          {/* --- SECTION B: SECURITY --- */}
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">
              Change Password
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password..."
                className="flex-1 bg-[#020010] border border-white/10 rounded-lg px-3 py-2 text-xs outline-none text-white focus:border-[#d4af37] transition-colors"
              />
              <button
                onClick={handleUpdatePassword}
                disabled={passLoading || !newPassword}
                className="px-4 bg-[#d4af37] text-black rounded-lg text-[10px] font-bold uppercase hover:bg-[#b5952f] disabled:opacity-50 transition-all min-w-[80px] flex items-center justify-center"
              >
                {passLoading ? (
                  <Loader2 className="animate-spin" size={12} />
                ) : (
                  "Update"
                )}
              </button>
            </div>
            {passMessage && (
              <div
                className={`mt-2 text-[10px] font-bold flex items-center gap-2 ${
                  passMessage.type === "error"
                    ? "text-red-400"
                    : "text-green-400"
                }`}
              >
                {passMessage.type === "error" ? (
                  <AlertTriangle size={10} />
                ) : (
                  <CheckCircle2 size={10} />
                )}
                {passMessage.text}
              </div>
            )}
          </div>

          {/* --- SECTION C: LOGOUT --- */}
          <button
            onClick={handleSignOut}
            className="w-full py-4 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-red-500/10 flex items-center justify-center gap-2 transition-all group"
          >
            <LogOut
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Sign Out Securely
          </button>
        </div>
      </div>
    </div>
  );
}

const IdentityRow = ({
  label,
  icon: Icon,
  active,
  color,
  loading,
  onInit,
  onGo,
}) => (
  <div
    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
      active
        ? "bg-white/5 border-white/10"
        : "bg-black/40 border-dashed border-white/10 opacity-70 hover:opacity-100"
    }`}
  >
    <div className="flex items-center gap-3">
      <div
        className={`p-2 rounded-lg ${
          active ? `bg-${color}/10` : "bg-gray-800"
        } ${active ? color : "text-gray-500"}`}
      >
        <Icon size={16} />
      </div>
      <div>
        <div
          className={`text-xs font-bold ${
            active ? "text-white" : "text-gray-400"
          }`}
        >
          {label}
        </div>
        <div
          className={`text-[9px] uppercase tracking-wide ${
            active ? "text-green-500" : "text-gray-600"
          }`}
        >
          {active ? "Active" : "Not Initialized"}
        </div>
      </div>
    </div>

    {active ? (
      <button
        onClick={onGo}
        className="text-[10px] font-bold uppercase text-gray-500 hover:text-white flex items-center gap-1 transition-colors"
      >
        Enter <ArrowRight size={12} />
      </button>
    ) : (
      <button
        onClick={onInit}
        disabled={loading}
        className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase flex items-center gap-2 transition-all ${
          loading
            ? "bg-gray-700 text-gray-400"
            : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
        }`}
      >
        {loading ? (
          <Loader2 className="animate-spin" size={10} />
        ) : (
          <>
            <Plus size={10} /> Initialize
          </>
        )}
      </button>
    )}
  </div>
);
