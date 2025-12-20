"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, XCircle, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTheme } from "../../../components/ui/ThemeContext";
import { unsubscribeUser } from "../../../actions/subscribeActions";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || ""; // Brevo sends ?email=...

  const { activeStyles } = useTheme();
  const activeColor = activeStyles?.color || "#d4af37";

  const [email, setEmail] = useState(initialEmail);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleUnsubscribe = async (e) => {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData();
    formData.append("email", email);

    const result = await unsubscribeUser(formData);

    if (result.success) {
      setStatus("success");
      setMessage(result.message);
    } else {
      setStatus("error");
      setMessage(result.message);
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  if (status === "success") {
    return (
      <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="mx-auto w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
          <CheckCircle2 size={40} className="text-green-500" />
        </div>
        <h1 className="text-3xl font-serif text-white">Unsubscribed</h1>
        <p className="text-gray-400 max-w-md mx-auto">
          We've removed <strong>{email}</strong> from our mailing list. You
          won't hear from us again.
        </p>
        <div className="pt-8">
          <Link
            href="/"
            className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft size={14} /> Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
      {/* Glow Element */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: activeColor }}
      />

      <div className="text-center mb-8">
        <h1 className="text-2xl font-serif text-white mb-2">Unsubscribe</h1>
        <p className="text-sm text-gray-400">
          We're sorry to see you go. Confirm your email below to stop receiving
          updates.
        </p>
      </div>

      <form onSubmit={handleUnsubscribe} className="space-y-6">
        <div className="space-y-2 text-left">
          <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 ml-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-gray-500" size={16} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-white/30 transition-colors"
              placeholder="email@example.com"
            />
          </div>
        </div>

        <button
          disabled={status === "loading"}
          className="w-full py-3 rounded-lg font-bold uppercase tracking-widest text-xs bg-white text-black hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
        >
          {status === "loading" ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              <XCircle size={16} /> Confirm Unsubscribe
            </>
          )}
        </button>

        {status === "error" && (
          <p className="text-red-500 text-xs text-center">{message}</p>
        )}
      </form>

      <div className="mt-8 pt-6 border-t border-white/5 text-center">
        <p className="text-[10px] text-gray-600 mb-2">
          Want to adjust preferences instead?
        </p>
        <Link
          href="/newsletter"
          className="text-xs font-bold uppercase tracking-widest transition-colors hover:opacity-80"
          style={{ color: activeColor }}
        >
          Manage Frequencies
        </Link>
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <div className="min-h-screen bg-[#020010] flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <UnsubscribeContent />
      </Suspense>
    </div>
  );
}
