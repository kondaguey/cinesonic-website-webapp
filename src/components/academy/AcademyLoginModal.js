"use client";

import React, { useEffect, useState } from "react";
import { X, Mail, Lock, ArrowRight, Github } from "lucide-react";
import { useTheme } from "../../components/ui/ThemeContext";
import { Cinzel } from "next/font/google";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["700"] });

export default function AcademyLoginModal({ onClose }) {
  const { activeStyles, activeColor } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className="fixed inset-0 z-[10002] flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div
        className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* MODAL */}
      <div
        className={`relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform ${
          isAnimating
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4"
        }`}
      >
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: activeColor }}
        />

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className={`${cinzel.className} text-2xl text-white mb-2`}>
              CineSonic <span className="text-white/50">ID</span>
            </h2>
            <p className="text-xs text-gray-400 uppercase tracking-widest">
              Access Student Portal
            </p>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider ml-1">
                Email
              </label>
              <input
                type="email"
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-[var(--c)] transition-colors"
                style={{ "--c": activeColor }}
                placeholder="student@example.com"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider ml-1">
                Password
              </label>
              <input
                type="password"
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-[var(--c)] transition-colors"
                style={{ "--c": activeColor }}
                placeholder="••••••••"
              />
            </div>
            <button
              className="w-full py-3 mt-2 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-lg hover:bg-[var(--c)] hover:text-white transition-all duration-300"
              style={{ "--c": activeColor }}
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[10px] text-gray-600 uppercase">
              Or continue with
            </span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 py-2.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
              <Github size={16} />{" "}
              <span className="text-xs font-bold text-gray-300">GitHub</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
              <span className="text-lg leading-none">G</span>{" "}
              <span className="text-xs font-bold text-gray-300">Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
