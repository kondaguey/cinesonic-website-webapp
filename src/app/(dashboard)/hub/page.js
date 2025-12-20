"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import {
  Shield,
  Mic,
  Palette,
  Globe,
  User,
  Music,
  BookOpen,
  Terminal,
} from "lucide-react";

// Import your Smart Gatekeeper
import LoginModal from "../../../components/dashboard/LoginModal";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// --- MAIN HUB ---
export default function DashboardHub() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);

  // MODAL STATE: Keeps track of WHICH door they tried to open
  const [modalState, setModalState] = useState({
    isOpen: false,
    role: "actor",
    destination: "/hub",
  });

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getUser();
  }, []);

  // THE TRAFFIC COP
  const handleAccess = (role, path) => {
    if (currentUser) {
      // Logged in? Go right in.
      router.push(path);
    } else {
      // Not logged in? Open the Context-Aware Modal
      setModalState({ isOpen: true, role: role, destination: path });
    }
  };

  return (
    <div className="min-h-screen bg-[#020010] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans text-white">
      {/* BACKGROUND FX */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1a0f5e_0%,_#020010_70%)] opacity-50 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-30" />

      {/* TOP NAV: LEFT */}
      <div className="absolute top-8 left-8 z-20">
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-500 hover:text-[#d4af37] text-xs uppercase tracking-widest transition-colors"
        >
          <Globe size={14} /> Return to Public Site
        </Link>
      </div>

      {/* TOP NAV: RIGHT - REMOVED AS REQUESTED */}

      {/* MAIN CONTENT */}
      <div className="relative z-10 w-full max-w-7xl animate-fade-in-up">
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

        <div className="space-y-16">
          {/* --- TIER 1: TALENT ROSTERS (Top Row - Big Cards) --- */}
          <div>
            <div className="flex items-center justify-center gap-4 mb-8 opacity-70">
              <div className="h-px bg-gradient-to-r from-transparent to-[#00f0ff] w-24" />
              <h3 className="text-[11px] uppercase tracking-[0.4em] font-black text-[#00f0ff] glow-sm text-center">
                Talent Rosters
              </h3>
              <div className="h-px bg-gradient-to-l from-transparent to-[#00f0ff] w-24" />
            </div>

            <div className="flex flex-wrap justify-center gap-8">
              {/* 1. ACTOR LOGIN */}
              <div
                onClick={() => handleAccess("actor", "/actor-portal")}
                className="cursor-pointer w-full md:w-96 group relative bg-[#0a0a0a] border border-white/10 hover:border-[#00f0ff] rounded-3xl p-10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_50px_rgba(0,240,255,0.2)] flex flex-col items-center text-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[#00f0ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-16 h-16 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 relative z-10">
                  <Mic className="w-8 h-8 text-[#00f0ff]" />
                </div>
                <h2 className="text-2xl font-serif text-white mb-2 relative z-10 group-hover:text-[#00f0ff] transition-colors">
                  Actor Portal
                </h2>
                <div className="mt-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-600 group-hover:text-white transition-colors relative z-10">
                  <User size={12} className="text-[#00f0ff]" /> Talent Login
                </div>
              </div>

              {/* 2. ARTIST LOGIN */}
              <div
                onClick={() => handleAccess("artist", "/artist-portal")}
                className="cursor-pointer w-full md:w-96 group relative bg-[#0a0a0a] border border-white/10 hover:border-[#ff3399] rounded-3xl p-10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_50px_rgba(255,51,153,0.2)] flex flex-col items-center text-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[#ff3399]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-16 h-16 rounded-2xl bg-[#ff3399]/10 border border-[#ff3399]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 relative z-10">
                  <Palette className="w-8 h-8 text-[#ff3399]" />
                </div>
                <h2 className="text-2xl font-serif text-white mb-2 relative z-10 group-hover:text-[#ff3399] transition-colors">
                  Artist Portal
                </h2>
                <div className="mt-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-600 group-hover:text-white transition-colors relative z-10">
                  <Music size={12} className="text-[#ff3399]" /> Creative Login
                </div>
              </div>

              {/* 3. AUTHOR LOGIN */}
              <div
                onClick={() => handleAccess("author", "/author-portal")}
                className="cursor-pointer w-full md:w-96 group relative bg-[#0a0a0a] border border-white/10 hover:border-orange-500 rounded-3xl p-10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_50px_rgba(249,115,22,0.2)] flex flex-col items-center text-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 relative z-10">
                  <BookOpen className="w-8 h-8 text-orange-500" />
                </div>
                <h2 className="text-2xl font-serif text-white mb-2 relative z-10 group-hover:text-orange-500 transition-colors">
                  In-House Author Portal
                </h2>
                <div className="mt-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-600 group-hover:text-white transition-colors relative z-10">
                  <User size={12} className="text-orange-500" /> Literary Login
                </div>
              </div>
            </div>
          </div>

          {/* --- TIER 2: SYSTEM OPERATIONS (Bottom Row - Compact Cards) --- */}
          <div>
            <div className="flex items-center justify-center gap-4 mb-6 opacity-50 hover:opacity-100 transition-opacity">
              <div className="h-px bg-white/20 w-12" />
              <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white">
                System Operations
              </h3>
              <div className="h-px bg-white/20 w-12" />
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              {/* 4. COMMAND CENTER (Admin) */}
              <div
                onClick={() =>
                  handleAccess("admin", "/admin/master-controller")
                }
                className="cursor-pointer w-full md:w-80 group relative bg-[#0a0a0a] border border-white/5 hover:border-red-900 rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 flex flex-col items-center text-center overflow-hidden opacity-80 hover:opacity-100"
              >
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform relative z-10">
                  <Terminal className="w-5 h-5 text-red-700 group-hover:text-red-500" />
                </div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-1 group-hover:text-red-500 transition-colors">
                  Command Center
                </h2>
              </div>

              {/* 5. CREW PORTAL (Crew) */}
              <div
                onClick={() => handleAccess("crew", "/crew-portal")}
                className="cursor-pointer w-full md:w-80 group relative bg-[#0a0a0a] border border-white/5 hover:border-[#d4af37]/50 rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 flex flex-col items-center text-center overflow-hidden opacity-80 hover:opacity-100"
              >
                <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform relative z-10">
                  <Shield className="w-5 h-5 text-[#8a7224] group-hover:text-[#d4af37]" />
                </div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-1 group-hover:text-[#d4af37] transition-colors">
                  Crew Portal
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-16 text-center border-t border-white/5 pt-8">
          <div className="flex justify-center items-center gap-2 text-[10px] text-gray-600 uppercase tracking-widest">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            System Operational • V4.5.3
          </div>
        </div>
      </div>

      {/* DYNAMIC KEYCARD MODAL */}
      <LoginModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        targetRole={modalState.role}
        destination={modalState.destination}
      />
    </div>
  );
}
