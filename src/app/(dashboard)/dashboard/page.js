"use client";

import React from "react";
import Link from "next/link";
import {
  Shield,
  Mic,
  Palette,
  ArrowRight,
  Globe,
  Lock,
  User,
  Music,
} from "lucide-react";

export default function DashboardHub() {
  return (
    <div className="min-h-screen bg-[#020010] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans text-white">
      {/* BACKGROUND FX */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1a0f5e_0%,_#020010_70%)] opacity-50 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-30" />

      {/* TOP NAV */}
      <div className="absolute top-8 left-8 z-20">
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-500 hover:text-[#d4af37] text-xs uppercase tracking-widest transition-colors"
        >
          <Globe size={14} /> Return to Public Site
        </Link>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 w-full max-w-5xl animate-fade-in-up">
        {/* HEADER */}
        <div className="text-center mb-16">
          <div className="inline-block p-4 rounded-full bg-white/5 border border-white/10 mb-6 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
            <span className="text-3xl">🎬</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-4 tracking-tight">
            CineSonic <span className="text-[#d4af37]">Studio Hub</span>
          </h1>
          <p className="text-gray-400 uppercase tracking-[0.2em] text-xs md:text-sm max-w-lg mx-auto leading-relaxed">
            Select your access terminal. Unauthorized access is prohibited.
          </p>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. CREW PORTAL (Gold) */}
          <Link
            href="/crew-portal"
            className="group relative bg-[#0a0a0a] border border-white/10 hover:border-[#d4af37] rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_50px_rgba(212,175,55,0.15)] flex flex-col items-center text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#d4af37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="w-16 h-16 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 relative z-10">
              <Shield className="w-8 h-8 text-[#d4af37]" />
            </div>

            <h2 className="text-2xl font-serif text-white mb-2 relative z-10 group-hover:text-[#d4af37] transition-colors">
              Crew Portal
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed mb-8 relative z-10 px-4">
              Production Management, Casting Database, and Scheduling Matrix.
            </p>

            <div className="mt-auto flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-600 group-hover:text-white transition-colors relative z-10">
              <Lock size={12} className="text-[#d4af37]" /> Restricted Access
            </div>
          </Link>

          {/* 2. ACTOR PORTAL (Blue/Cyan) */}
          <Link
            href="/actor-portal"
            className="group relative bg-[#0a0a0a] border border-white/10 hover:border-[#00f0ff] rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_50px_rgba(0,240,255,0.15)] flex flex-col items-center text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#00f0ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="w-16 h-16 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 relative z-10">
              <Mic className="w-8 h-8 text-[#00f0ff]" />
            </div>

            <h2 className="text-2xl font-serif text-white mb-2 relative z-10 group-hover:text-[#00f0ff] transition-colors">
              Actor Portal
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed mb-8 relative z-10 px-4">
              Roster Registration, Profile Updates, and Audio Sample Uploads.
            </p>

            <div className="mt-auto flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-600 group-hover:text-white transition-colors relative z-10">
              <User size={12} className="text-[#00f0ff]" /> Talent Access
            </div>
          </Link>

          {/* 3. ARTIST PORTAL (Violet/Pink) */}
          <Link
            href="/artist-portal"
            className="group relative bg-[#0a0a0a] border border-white/10 hover:border-[#ff3399] rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_50px_rgba(255,51,153,0.15)] flex flex-col items-center text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#ff3399]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="w-16 h-16 rounded-2xl bg-[#ff3399]/10 border border-[#ff3399]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 relative z-10">
              <Palette className="w-8 h-8 text-[#ff3399]" />
            </div>

            <h2 className="text-2xl font-serif text-white mb-2 relative z-10 group-hover:text-[#ff3399] transition-colors">
              Artist Portal
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed mb-8 relative z-10 px-4">
              Sound Designers, Composers, and Visual Artists Workspace.
            </p>

            <div className="mt-auto flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-600 group-hover:text-white transition-colors relative z-10">
              <Music size={12} className="text-[#ff3399]" /> Creative Access
            </div>
          </Link>
        </div>

        {/* FOOTER METADATA */}
        <div className="mt-16 text-center border-t border-white/5 pt-8">
          <div className="flex justify-center items-center gap-2 text-[10px] text-gray-600 uppercase tracking-widest">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            System Operational • V4.5.2
          </div>
        </div>
      </div>
    </div>
  );
}
