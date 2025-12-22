"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Key,
  Mail,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
  Lock,
  Clock, // Added Clock icon
} from "lucide-react";

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function PasswordRescuePage() {
  const router = useRouter();

  // State
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // ⏱️ TIMER STATE
  const [timeLeft, setTimeLeft] = useState(60);

  // Form Data
  const [formData, setFormData] = useState({
    email: "",
    token: "",
    newPassword: "",
  });

  // ⏱️ TIMER LOGIC
  useEffect(() => {
    let interval = null;
    if (step === 2 && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [step, timeLeft]);

  // Format time as MM:SS (though it's just seconds here)
  const formattedTime = `00:${timeLeft < 10 ? `0${timeLeft}` : timeLeft}`;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 1. SEND RESET CODE
  const handleRequestCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        formData.email,
        {
          redirectTo: `${window.location.origin}/hub/password-rescue`,
        }
      );

      if (error) throw error;

      setSuccessMsg("Protocol Initiated.");
      // Reset timer and advance
      setTimeLeft(60);
      setTimeout(() => setStep(2), 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. VERIFY & RESET
  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Stop if expired
    if (timeLeft === 0) {
      setError("Code expired. Protocol terminated.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: formData.email,
        token: formData.token,
        type: "recovery",
      });

      if (verifyError) throw verifyError;

      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.newPassword,
      });

      if (updateError) throw updateError;

      setSuccessMsg("Access Restored. Redirecting...");
      setTimeout(() => {
        router.push("/hub");
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020010] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background FX */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1a0f5e_0%,_#020010_70%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-30" />

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 mb-4">
            <Shield className="w-8 h-8 text-[#d4af37]" />
          </div>
          <h1 className="text-2xl font-serif text-white">Account Recovery</h1>
          <p className="text-gray-500 text-xs uppercase tracking-widest mt-2">
            Secure Password Reset Protocol
          </p>
        </div>

        {/* Card */}
        <div
          className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden transition-colors duration-500"
          style={{
            borderColor:
              timeLeft < 10 && step === 2 ? "#ef4444" : "rgba(255,255,255,0.1)",
          }}
        >
          {/* Progress Bar (Acts as Timer Visual too) */}
          <div
            className={`absolute top-0 left-0 h-1 transition-all duration-1000 ease-linear ${
              timeLeft < 10 ? "bg-red-500" : "bg-[#d4af37]"
            }`}
            style={{ width: step === 1 ? "0%" : `${(timeLeft / 60) * 100}%` }}
          />

          <AnimatePresence mode="wait">
            {/* STEP 1: REQUEST CODE */}
            {step === 1 && (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleRequestCode}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500">
                    Registered Email
                  </label>
                  <div className="relative">
                    <input
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@cinesonic.studio"
                      className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-[#d4af37] focus:outline-none transition-colors"
                    />
                    <Mail
                      size={16}
                      className="absolute left-3 top-3.5 text-gray-500"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle size={14} /> {error}
                  </div>
                )}
                {successMsg && (
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-xs flex items-center gap-2">
                    <CheckCircle size={14} /> {successMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#d4af37] hover:bg-[#b5952f] text-black font-bold uppercase tracking-widest text-xs py-3 rounded-lg mt-4 flex items-center justify-center gap-2 transition-all"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    "Initiate Protocol"
                  )}
                </button>
              </motion.form>
            )}

            {/* STEP 2: VERIFY & RESET */}
            {step === 2 && (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleResetPassword}
                className="space-y-4"
              >
                {/* ⏱️ THE TIMER DISPLAY */}
                <div
                  className={`flex items-center justify-between p-3 rounded-lg mb-4 border ${
                    timeLeft === 0
                      ? "bg-red-500/10 border-red-500/30"
                      : "bg-[#d4af37]/10 border-[#d4af37]/30"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Clock
                      size={16}
                      className={
                        timeLeft < 10
                          ? "text-red-500 animate-pulse"
                          : "text-[#d4af37]"
                      }
                    />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      {timeLeft === 0 ? "EXPIRED" : "Code Expires In:"}
                    </span>
                  </div>
                  <span
                    className={`text-xl font-mono font-bold ${
                      timeLeft < 10 ? "text-red-500" : "text-white"
                    }`}
                  >
                    {formattedTime}
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500">
                    8-Digit Code
                  </label>
                  <div className="relative">
                    <input
                      name="token"
                      type="text"
                      required
                      disabled={timeLeft === 0}
                      value={formData.token}
                      onChange={handleChange}
                      placeholder="XXXXXX"
                      className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-[#d4af37] font-mono tracking-wider focus:border-[#d4af37] focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <Key
                      size={16}
                      className="absolute left-3 top-3.5 text-gray-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      name="newPassword"
                      type="password"
                      required
                      disabled={timeLeft === 0}
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-[#d4af37] focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <Lock
                      size={16}
                      className="absolute left-3 top-3.5 text-gray-500"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle size={14} /> {error}
                  </div>
                )}
                {successMsg && (
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-xs flex items-center gap-2">
                    <CheckCircle size={14} /> {successMsg}
                  </div>
                )}

                {timeLeft > 0 ? (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#d4af37] hover:bg-[#b5952f] text-black font-bold uppercase tracking-widest text-xs py-3 rounded-lg mt-4 flex items-center justify-center gap-2 transition-all"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      "Update Password"
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setTimeLeft(60);
                    }}
                    className="w-full bg-red-900/30 hover:bg-red-900/50 border border-red-500/30 text-red-400 font-bold uppercase tracking-widest text-xs py-3 rounded-lg mt-4 flex items-center justify-center gap-2 transition-all"
                  >
                    Protocol Expired - Restart
                  </button>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <div className="text-center mt-6">
          <Link
            href="/hub"
            className="text-gray-600 hover:text-[#d4af37] text-xs uppercase tracking-widest transition-colors"
          >
            Abort Sequence
          </Link>
        </div>
      </div>
    </div>
  );
}
