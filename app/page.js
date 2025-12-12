"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Film, Mic, Shield, Users, ArrowRight, Globe } from "lucide-react";

export default function Landing() {
  // 🟢 SYSTEM STATUS LOGIC
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(typeof navigator !== "undefined" ? navigator.onLine : true);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center text-white relative overflow-hidden bg-[radial-gradient(circle_at_50%_0%,_#1a0f5e_0%,_#020014_70%)]">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-gold/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px]"></div>
      </div>

      {/* 🟢 TOP RIGHT STATUS HUD (Fixed position) */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg animate-fade-in">
        <div className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isOnline ? "bg-green-400" : "bg-red-400"
            }`}
          ></span>
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              isOnline
                ? "bg-green-500 shadow-[0_0_10px_#22c55e]"
                : "bg-red-500 shadow-[0_0_10px_#ef4444]"
            }`}
          ></span>
        </div>
        <span
          className={`text-[10px] tracking-widest uppercase font-bold ${
            isOnline ? "text-green-500/90" : "text-red-500"
          }`}
        >
          {isOnline ? "Systems Online" : "Connection Lost"}
        </span>
      </div>

      {/* CONTENT WRAPPER */}
      <div className="flex-grow flex flex-col items-center justify-center w-full max-w-7xl px-4 py-8 relative z-10">
        {/* HERO */}
        <div className="text-center animate-fade-in-up w-full max-w-4xl mb-10 md:mb-12">
          <img
            src="https://www.danielnotdaylewis.com/img/cinesonic_logo_banner_gold_16x9.png"
            className="h-32 md:h-64 object-contain mx-auto mb-6 md:mb-8 shadow-[0_0_40px_rgba(212,175,55,0.15)] rounded-2xl border border-gold/10"
            alt="CineSonic Logo"
          />
          <h1 className="text-4xl md:text-6xl font-serif text-gold mb-3 tracking-wide drop-shadow-lg">
            CineSonic
          </h1>
          <p className="text-gray-400 tracking-[0.3em] md:tracking-[0.5em] text-xs md:text-sm uppercase font-light">
            Production Intelligence V13
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-10 animate-fade-in">
          {/* Publishers */}
          <Link
            href="/projectintake"
            className="group relative bg-black/40 backdrop-blur-xl border border-gold/20 p-8 md:p-10 rounded-2xl hover:border-gold/60 transition-all duration-300 hover:-translate-y-2 overflow-hidden shadow-2xl flex flex-col items-center"
          >
            <div className="absolute inset-0 bg-gold/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-midnight border border-gold/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                <Film className="w-8 h-8 md:w-10 md:h-10 text-gold" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-white mb-2 font-serif">
                Publishers
              </h3>
              <p className="text-xs md:text-sm text-gray-400 group-hover:text-white transition-colors">
                Submit New Project
              </p>
            </div>
          </Link>

          {/* Talent */}
          <Link
            href="/talent"
            className="group relative bg-black/40 backdrop-blur-xl border border-gold/20 p-8 md:p-10 rounded-2xl hover:border-gold/60 transition-all duration-300 hover:-translate-y-2 overflow-hidden shadow-2xl flex flex-col items-center"
          >
            <div className="absolute inset-0 bg-gold/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-midnight border border-gold/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                <Mic className="w-8 h-8 md:w-10 md:h-10 text-gold" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-white mb-2 font-serif">
                Talent Portal
              </h3>
              <p className="text-xs md:text-sm text-gray-400 group-hover:text-white transition-colors">
                Manage Profile & Avail
              </p>
            </div>
          </Link>

          {/* Admin */}
          <Link
            href="/admin"
            className="group relative bg-black/40 backdrop-blur-xl border border-gold/20 p-8 md:p-10 rounded-2xl hover:border-gold/60 transition-all duration-300 hover:-translate-y-2 overflow-hidden shadow-2xl flex flex-col items-center"
          >
            <div className="absolute inset-0 bg-gold/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-midnight border border-gold/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                <Shield className="w-8 h-8 md:w-10 md:h-10 text-gold" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-white mb-2 font-serif">
                Staff Access
              </h3>
              <p className="text-xs md:text-sm text-gray-400 group-hover:text-white transition-colors">
                Studio Dashboard
              </p>
            </div>
          </Link>
        </div>

        {/* 🟢 DUAL ACTION BUTTONS */}
        <div className="relative z-10 animate-fade-in-up delay-300 flex flex-col md:flex-row gap-4 w-full md:w-auto">
          {/* Button 1: Roster (Glass Style) */}
          <Link
            href="/roster"
            className="group flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white/5 backdrop-blur-md border border-gold/30 hover:bg-gold hover:text-midnight hover:border-gold transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
          >
            <Users className="w-4 h-4 text-gold group-hover:text-midnight transition-colors" />
            <span className="uppercase tracking-[0.2em] text-xs font-bold text-gray-200 group-hover:text-midnight">
              Browse Roster
            </span>
          </Link>

          {/* Button 2: Main Website (Solid Gold Style) */}
          <Link
            href="https://www.danielnotdaylewis.com" // Update this link if needed
            target="_blank"
            className="group flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gold/10 hover:bg-gold border border-gold text-gold hover:text-midnight transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)]"
          >
            <Globe className="w-4 h-4" />
            <span className="uppercase tracking-[0.2em] text-xs font-bold">
              Official Site
            </span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
