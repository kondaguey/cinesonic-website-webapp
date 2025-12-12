"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  ArrowRight,
  Globe,
  Clapperboard,
  Mic,
  ArrowLeft,
} from "lucide-react";

export default function DashboardHub() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(typeof navigator !== "undefined" ? navigator.onLine : true);
    window.addEventListener("online", () => setIsOnline(true));
    window.addEventListener("offline", () => setIsOnline(false));
    return () => {
      window.removeEventListener("online", () => setIsOnline(true));
      window.removeEventListener("offline", () => setIsOnline(false));
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center text-white relative overflow-hidden bg-[radial-gradient(circle_at_50%_0%,_#1a0f5e_0%,_#020014_70%)]">
      {/* NAV: Back to Public Home */}
      <div className="absolute top-6 left-6 z-50">
        <Link
          href="/"
          className="text-xs text-gold/60 hover:text-gold uppercase tracking-widest flex items-center gap-2 transition-colors"
        >
          <ArrowLeft size={14} /> Public Home
        </Link>
      </div>

      {/* STATUS HUD */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
        <div className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isOnline ? "bg-green-400" : "bg-red-400"
            }`}
          ></span>
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              isOnline ? "bg-green-500" : "bg-red-500"
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

      {/* CENTER CONTENT */}
      <div className="flex-grow flex flex-col items-center justify-center w-full max-w-7xl px-4 py-8 relative z-10">
        {/* HERO TITLE */}
        <div className="text-center w-full max-w-4xl mb-12">
          <h1 className="text-5xl md:text-6xl font-serif text-gold mb-3 tracking-wide">
            CineSonic
          </h1>
          <p className="text-gray-400 tracking-[0.4em] text-xs md:text-sm uppercase font-light">
            Internal Hub V14
          </p>
        </div>

        {/* 🟢 THE ROUTING GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-10">
          {/* 1. TALENT SHOWCASE -> app/dashboard/talentupload */}
          <Link
            href="./talentupload"
            className="group bg-black/40 backdrop-blur-xl border border-gold/20 p-10 rounded-2xl hover:border-gold/60 transition-all hover:-translate-y-2 flex flex-col items-center shadow-2xl"
          >
            <div className="w-20 h-20 bg-midnight border border-gold/30 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Clapperboard className="w-10 h-10 text-gold" />
            </div>
            <h3 className="text-2xl font-bold uppercase tracking-widest text-white mb-2 font-serif">
              Showcase
            </h3>
            <p className="text-sm text-gray-400 group-hover:text-white">
              Upload & Edit Media
            </p>
          </Link>

          {/* 2. TALENT PORTAL -> app/dashboard/talentform */}
          <Link
            href="./talentform"
            className="group bg-black/40 backdrop-blur-xl border border-gold/20 p-10 rounded-2xl hover:border-gold/60 transition-all hover:-translate-y-2 flex flex-col items-center shadow-2xl"
          >
            <div className="w-20 h-20 bg-midnight border border-gold/30 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Mic className="w-10 h-10 text-gold" />
            </div>
            <h3 className="text-2xl font-bold uppercase tracking-widest text-white mb-2 font-serif">
              Talent Portal
            </h3>
            <p className="text-sm text-gray-400 group-hover:text-white">
              Profile & Availability
            </p>
          </Link>

          {/* 3. STAFF / CREW PORTAL -> app/dashboard/crewportal */}
          <Link
            href="./crewportal"
            className="group bg-black/40 backdrop-blur-xl border border-gold/20 p-10 rounded-2xl hover:border-gold/60 transition-all hover:-translate-y-2 flex flex-col items-center shadow-2xl"
          >
            <div className="w-20 h-20 bg-midnight border border-gold/30 rounded-full flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <Shield className="w-10 h-10 text-gold" />
            </div>
            <h3 className="text-2xl font-bold uppercase tracking-widest text-white mb-2 font-serif">
              Staff Access
            </h3>
            <p className="text-sm text-gray-400 group-hover:text-white">
              Main Admin Dashboard
            </p>
          </Link>
        </div>

        {/* EXTERNAL LINK */}
        <Link
          href="/"
          className="flex items-center gap-2 text-gold/60 hover:text-gold uppercase tracking-widest text-xs transition-colors"
        >
          <Globe size={14} /> Public Homepage <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
