"use client";
import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Lock, Loader2, ArrowRight } from "lucide-react";
import Cookies from "js-cookie";
import crypto from "crypto"; // Native Node module, or use subtle crypto for browser

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// 🟢 THE GENERATOR FUNCTION
// You can run this locally in a separate script to know what today's code is
const generateDailyCode = async () => {
  const secret = "CinesonicIsTheFuture2025"; //Ideally pull from env, but client-side is tricky.
  // For client-side checking without exposing the secret perfectly, we usually use an API route.
  // BUT for a simple beta lock, we can do a simplified version or verify server-side.

  // SIMPLE VERSION (Date-based match):
  const today = new Date().toISOString().split("T")[0]; // "2025-12-17"
  const data = secret + today;

  // Create a simple hash buffer
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // Convert to hex, take first 6 numbers/chars, or just map to numbers
  // This logic creates a deterministic 6 digit code from the hash
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const numbersOnly = hashHex.replace(/\D/g, ""); // Remove letters
  return numbersOnly.substring(0, 6);
};

export default function BetaLogin() {
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleUnlock = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. GENERATE TODAY'S VALID CODE
      const validDailyCode = await generateDailyCode();

      // 2. CHECK: Is input == Daily Code?
      let isValid = key.trim() === validDailyCode;

      // 3. IF NOT, CHECK DATABASE (For VIP/Master keys)
      if (!isValid) {
        const { data } = await supabase
          .from("beta_keys")
          .select("*")
          .eq("key_code", key.trim())
          .eq("is_active", true)
          .single();

        if (data) isValid = true;
      }

      if (!isValid) throw new Error("Invalid Key");

      // 4. SUCCESS
      Cookies.set("cinesonic-beta-access", "granted", { expires: 1 });
      router.push("/");
    } catch (err) {
      setError("Access Denied: Invalid or Expired Key");
    } finally {
      setLoading(false);
    }
  };

  // ... Render ...

  return (
    <div className="min-h-screen bg-[#020010] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-8 animate-fade-in-up">
        {/* LOGO AREA */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-[#d4af37]/10 rounded-full flex items-center justify-center border border-[#d4af37]/30 shadow-[0_0_40px_rgba(212,175,55,0.2)]">
            <Lock className="w-8 h-8 text-[#d4af37]" />
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Private Beta</h1>
          <p className="text-gray-400 text-sm">
            CineSonic is currently in locked development. <br />
            Enter your access key to enter for 24 hours.
          </p>
        </div>

        <form onSubmit={handleUnlock} className="space-y-4">
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="ENTER ACCESS KEY"
            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-center text-xl tracking-[0.2em] font-bold text-white focus:outline-none focus:border-[#d4af37] focus:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all placeholder:text-gray-600 placeholder:text-sm placeholder:font-normal"
            autoFocus
          />

          {error && (
            <div className="text-red-400 text-xs font-bold uppercase tracking-widest animate-pulse">
              {error}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full py-4 bg-[#d4af37] hover:bg-[#b8860b] text-black font-bold uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                Enter Studio <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="pt-8 border-t border-white/5">
          <a
            href="mailto:admin@cinesonic.com?subject=Beta Key Request"
            className="text-xs text-gray-500 hover:text-[#d4af37] transition-colors uppercase tracking-widest"
          >
            Request Access Key
          </a>
        </div>
      </div>
    </div>
  );
}
