"use client";

import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  X,
  UserCog,
  LogOut,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

// --- CONFIGURATION ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AccountModal({ isOpen, onClose, user }) {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }

  if (!isOpen) return null;

  const handleUpdatePassword = async () => {
    if (newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters.",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    setLoading(false);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Password updated securely." });
      setNewPassword("");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/"; // Force reload to clear state
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-sm bg-[#0a0a15] border border-white/10 rounded-3xl p-8 shadow-2xl animate-in zoom-in-95">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-[#d4af37]/10 flex items-center justify-center border border-[#d4af37]/20 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
            <UserCog size={24} className="text-[#d4af37]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white uppercase tracking-widest">
              Account
            </h2>
            <p className="text-[10px] text-gray-500 font-mono">{user?.email}</p>
          </div>
        </div>

        {/* PASSWORD FORM */}
        <div className="space-y-4 p-5 bg-white/5 rounded-2xl border border-white/5">
          <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck size={12} /> Security
          </label>

          <div className="space-y-2">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New secure password..."
              className="w-full bg-[#020010] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none text-white focus:border-[#d4af37] transition-colors placeholder:text-gray-700"
            />

            <button
              onClick={handleUpdatePassword}
              disabled={loading || !newPassword}
              className="w-full bg-[#d4af37] text-black h-10 rounded-xl text-xs font-bold uppercase hover:bg-[#b5952f] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={14} />
              ) : (
                "Update Password"
              )}
            </button>
          </div>

          {message && (
            <div
              className={`text-[10px] text-center font-bold flex items-center justify-center gap-2 ${
                message.type === "error" ? "text-red-400" : "text-green-400"
              }`}
            >
              {message.type === "error" ? (
                <AlertTriangle size={12} />
              ) : (
                <CheckCircle2 size={12} />
              )}
              {message.text}
            </div>
          )}
        </div>

        {/* SIGN OUT */}
        <button
          onClick={handleSignOut}
          className="w-full mt-6 py-4 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-red-500/10 flex items-center justify-center gap-2 transition-all group"
        >
          <LogOut
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Sign Out Securely
        </button>
      </div>
    </div>
  );
}
