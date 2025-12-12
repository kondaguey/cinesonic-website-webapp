"use client";
import React from "react";
import Link from "next/link";
import { Mic2, Shield, Users, Send, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_50%_0%,_#1a0f5e_0%,_#020014_70%)] text-white">
      {/* NAV: Links to the Internal Hub */}
      <nav className="p-6 flex justify-between items-center border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="text-2xl font-serif text-white tracking-wider flex items-center gap-2">
          <Mic2 className="text-gold" size={24} />
          PRODUCTION<span className="text-gold">HOUSE</span>
        </div>

        <Link
          href="/dashboard"
          className="group flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-gold/50 hover:bg-gold/5 hover:shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all duration-500"
        >
          {/* 🟢 The Live Pulse (The "Whoa" Factor) */}
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 duration-1000"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 shadow-[0_0_8px_#22c55e]"></span>
          </div>

          {/* 🖥️ Tech Text */}
          <div className="flex flex-col leading-none">
            <span className="text-[10px] font-bold text-gray-400 group-hover:text-gold uppercase tracking-[0.2em] transition-colors">
              Production Hub
            </span>
            <span className="text-[8px] text-green-500/70 font-mono tracking-widest group-hover:text-green-400 transition-colors mt-[2px]">
              SYSTEMS ONLINE
            </span>
          </div>

          <Shield
            size={12}
            className="text-gray-600 group-hover:text-gold transition-colors ml-1"
          />
        </Link>
      </nav>

      {/* HERO SECTION */}
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 animate-fade-in-up">
        <div className="text-center mb-16 max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight">
            Voices that <span className="text-gold">Resonate</span>
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed">
            Premium audio production services. From casting to mastering, we
            manage the entire lifecycle of your audio project.
          </p>
        </div>

        {/* PRIMARY ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {/* 1. START A PRODUCTION (Links to app/projectform) */}
          <Link
            href="/projectform"
            className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold/50 p-10 rounded-2xl text-left transition-all duration-300"
          >
            <div className="absolute top-6 right-6 p-3 bg-gold/10 rounded-full group-hover:bg-gold text-gold group-hover:text-midnight transition-colors">
              <Send size={24} />
            </div>
            <h3 className="text-2xl font-serif text-white mb-2">
              Start a Production
            </h3>
            <p className="text-sm text-gray-400 group-hover:text-gray-200">
              Publishers & Authors: Submit a new project request here.
            </p>
          </Link>

          {/* 2. BROWSE ROSTER (Links to app/roster) */}
          <Link
            href="/roster"
            className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold/50 p-10 rounded-2xl text-left transition-all duration-300"
          >
            <div className="absolute top-6 right-6 p-3 bg-gold/10 rounded-full group-hover:bg-gold text-gold group-hover:text-midnight transition-colors">
              <Users size={24} />
            </div>
            <h3 className="text-2xl font-serif text-white mb-2">
              Browse Roster
            </h3>
            <p className="text-sm text-gray-400 group-hover:text-gray-200">
              View our active talent pool and listen to demos.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
