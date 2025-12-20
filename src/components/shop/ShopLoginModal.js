"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { X, ShoppingBag, Loader2 } from "lucide-react";
// 🟢 1. IMPORT THEME CONTEXT
import { useTheme } from "../ui/ThemeContext";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// 🟢 2. REMOVED 'isOpen' PROP (Navbar handles mounting/unmounting)
export default function ShopLoginModal({ onClose }) {
  const router = useRouter();

  // 🟢 3. GET ACTIVE COLOR
  const { activeColor } = useTheme();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  // 🟢 4. ANIMATION & SCROLL LOCK
  useEffect(() => {
    setIsAnimating(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    // Wait for animation to finish before unmounting
    setTimeout(onClose, 300);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isSignUp) {
        // --- SIGN UP ---
        const { data: authData, error: authError } = await supabase.auth.signUp(
          {
            email,
            password,
          }
        );
        if (authError) throw authError;

        // --- PROFILE CREATION ---
        if (authData?.user) {
          const { error: profileError } = await supabase
            .from("profiles")
            .insert([
              {
                id: authData.user.id,
                email: email,
                role: "customer",
                clearance: 0,
                status: "active",
              },
            ]);

          if (profileError)
            console.error("Profile creation failed:", profileError);
        }
      } else {
        // --- LOGIN ---
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (loginError) throw loginError;
      }

      handleClose();
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10002] flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div
        className={`absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* MODAL */}
      <div
        className={`relative w-full max-w-sm bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-2xl transition-all duration-300 transform ${
          isAnimating
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4"
        }`}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          {/* 🟢 DYNAMIC THEME COLOR BADGE */}
          <div
            className="inline-block p-3 rounded-full mb-4 shadow-[0_0_20px_rgba(var(--c),0.2)]"
            style={{
              backgroundColor: `${activeColor}15`,
              borderColor: `${activeColor}30`,
              borderWidth: "1px",
            }}
          >
            <ShoppingBag style={{ color: activeColor }} size={32} />
          </div>

          <h2 className="text-xl font-serif text-white mb-1">
            {isSignUp ? "Join CineSonic" : "Store Access"}
          </h2>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">
            {isSignUp ? "Create your customer profile" : "Login to view orders"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@address.com"
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors placeholder:text-gray-600"
              style={{ caretColor: activeColor }}
              // Inline style for focus border since Tailwind arbitrary values can be tricky with dynamic vars
              onFocus={(e) => (e.target.style.borderColor = activeColor)}
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(255,255,255,0.1)")
              }
            />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors placeholder:text-gray-600"
              style={{ caretColor: activeColor }}
              onFocus={(e) => (e.target.style.borderColor = activeColor)}
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(255,255,255,0.1)")
              }
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2 text-red-400 text-[10px] text-center uppercase tracking-wide font-bold">
              {error}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full text-black font-bold py-3 rounded-xl uppercase tracking-widest transition-all shadow-lg hover:brightness-110 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: activeColor,
              boxShadow: `0 0 20px ${activeColor}40`,
            }}
          >
            {loading ? (
              <Loader2 className="animate-spin mx-auto" size={16} />
            ) : isSignUp ? (
              "Create Account"
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-white/5 pt-4">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[10px] text-gray-500 hover:text-white uppercase tracking-widest transition-colors"
          >
            {isSignUp
              ? "Already have an account? Sign In"
              : "New here? Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
}
