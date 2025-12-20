"use client";

import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import {
  X,
  Mail,
  Lock,
  Loader2,
  ShieldCheck,
  AlertTriangle,
  Fingerprint,
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Map internal roles to pretty Display Names and Colors
const ROLE_CONFIG = {
  actor: {
    label: "Actor Login",
    color: "text-[#00f0ff]",
    border: "border-[#00f0ff]",
  },
  artist: {
    label: "Artist Login",
    color: "text-[#ff3399]",
    border: "border-[#ff3399]",
  },
  author: {
    label: "Author Login",
    color: "text-orange-500",
    border: "border-orange-500",
  },
  crew: {
    label: "Crew Login",
    color: "text-[#d4af37]",
    border: "border-[#d4af37]",
  },
  admin: {
    label: "Command Login",
    color: "text-red-500",
    border: "border-red-500",
  },
};

export default function LoginModal({
  isOpen,
  onClose,
  targetRole,
  destination,
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  // Get styling based on the requested role
  const style = ROLE_CONFIG[targetRole] || ROLE_CONFIG.actor;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. AUTHENTICATE (Check Email/Pass)
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) throw new Error("Incorrect credentials.");

      // 2. CHECK PROFILE & ROLE (The 3-Way Match)
      const userId = authData.user.id;
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (profileError || !profile) throw new Error("Profile not found.");

      // 3. THE SECURITY CHECK
      // Does their role match the door they are trying to open?
      // (Admins can open any door)
      if (
        profile.role !== targetRole &&
        profile.role !== "admin" &&
        profile.role !== "ownership"
      ) {
        await supabase.auth.signOut(); // Kick them out immediately
        throw new Error(`Access Denied. You are not a ${targetRole}.`);
      }

      // 4. SUCCESS - GO TO DESTINATION
      onClose();
      router.push(destination);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className={`relative w-full max-w-sm bg-[#0a0a15] border ${style.border}/30 rounded-3xl p-8 shadow-2xl animate-in zoom-in-95`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* DYNAMIC HEADER */}
        <div className="text-center mb-8">
          <div
            className={`inline-block p-3 rounded-full bg-white/5 border ${style.border}/20 mb-4 shadow-[0_0_20px_rgba(0,0,0,0.5)]`}
          >
            <Fingerprint className={style.color} size={32} />
          </div>
          <h2
            className={`text-xl font-serif text-white mb-1 uppercase tracking-widest ${style.color}`}
          >
            {style.label}
          </h2>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">
            Restricted Access
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label
              className={`text-[9px] font-bold uppercase tracking-widest ml-1 ${style.color}`}
            >
              Email ID
            </label>
            <div className="relative group">
              <Mail
                className="absolute left-4 top-3.5 text-gray-500"
                size={16}
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#020010] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:border-white/30 outline-none transition-all"
                placeholder={`${targetRole}@cinesonic.com`}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label
              className={`text-[9px] font-bold uppercase tracking-widest ml-1 ${style.color}`}
            >
              Password
            </label>
            <div className="relative group">
              <Lock
                className="absolute left-4 top-3.5 text-gray-500"
                size={16}
              />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#020010] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:border-white/30 outline-none transition-all"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2 text-red-400 text-[10px] font-bold uppercase tracking-wide">
              <AlertTriangle size={14} /> <span>{error}</span>
            </div>
          )}

          <button
            disabled={loading}
            className={`w-full bg-white text-black font-bold py-4 rounded-xl uppercase tracking-widest transition-all mt-2 flex items-center justify-center gap-2 hover:bg-gray-200 ${
              loading ? "opacity-50" : ""
            }`}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              "Authenticate"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
