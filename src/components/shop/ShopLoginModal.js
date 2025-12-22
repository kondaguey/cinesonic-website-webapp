"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ShoppingBag,
  Loader2,
  ChevronRight,
  User,
  Lock,
  Mail,
} from "lucide-react";
import { useTheme } from "../ui/ThemeContext";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

export default function ShopLoginModal({ onClose }) {
  const router = useRouter();
  const { activeColor } = useTheme();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isSignUp) {
        const { data: authData, error: authError } = await supabase.auth.signUp(
          {
            email,
            password,
          }
        );
        if (authError) throw authError;

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
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (loginError) throw loginError;
      }

      onClose();
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10002] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative w-full max-w-sm bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        style={{ borderColor: `${activeColor}40` }}
      >
        <div className="h-1 w-full" style={{ backgroundColor: activeColor }} />

        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-lg bg-white/5 border border-white/10"
                style={{ color: activeColor }}
              >
                <ShoppingBag size={24} />
              </div>
              <div>
                <h3 className="text-xl font-serif text-white">
                  {isSignUp ? "Create Profile" : "Store Access"}
                </h3>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                  {isSignUp ? "Join the Collective" : "Member Identification"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-2 rounded-lg text-red-400 text-[10px] font-bold text-center uppercase tracking-wider">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@address.com"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none transition-colors"
                  style={{ caretColor: activeColor }}
                />
                <Mail
                  size={16}
                  className="absolute right-3 top-3.5 text-gray-600"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">
                Passcode
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none transition-colors"
                />
                <Lock
                  size={16}
                  className="absolute right-3 top-3.5 text-gray-600"
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full py-3 rounded-lg font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 mt-4 transition-all hover:brightness-110 active:scale-95"
              style={{
                backgroundColor: activeColor,
                color: "#000",
                boxShadow: `0 0 20px ${activeColor}30`,
              }}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <>
                  {isSignUp ? "Initialize Account" : "Sign In"}{" "}
                  <ChevronRight size={14} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-white/5 pt-4">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[10px] text-gray-500 hover:text-white uppercase tracking-widest transition-colors font-bold"
            >
              {isSignUp
                ? "Already a Member? Sign In"
                : "New Client? Register Here"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
