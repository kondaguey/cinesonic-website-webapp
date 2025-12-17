"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

// ATOMS
import Button from "../ui/Button";
import ParticleFx from "../ui/ParticleFx";

export default function CTASection({ theme = "gold" }) {
  // 1. LOCAL COLOR MAP
  const themeConfig = {
    gold: { hex: "#d4af37", glow: "from-[#d4af37]/20" },
    pink: { hex: "#ff3399", glow: "from-[#ff3399]/20" },
    fire: { hex: "#ff4500", glow: "from-[#ff4500]/20" },
    cyan: { hex: "#00f0ff", glow: "from-[#00f0ff]/20" },
    system: { hex: "#3b82f6", glow: "from-[#3b82f6]/20" },
  };

  const activeTheme = themeConfig[theme] || themeConfig.gold;
  const color = activeTheme.hex;

  return (
    <section className="relative py-32 px-6 bg-[#020010] overflow-hidden flex items-center justify-center min-h-[60vh] border-t border-white/5">
      {/* --- ATMOSPHERE --- */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {/* 1. Particle System (Subtle background movement) */}
        <div className="opacity-50">
          <ParticleFx variant="solo" count={15} color={color} />
        </div>

        {/* 2. Dynamic Ambient Glow (Bottom Up) */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] blur-[120px] opacity-40 transition-colors duration-1000"
          style={{
            background: `linear-gradient(to top, ${color}30, ${color}05, transparent)`,
          }}
        />

        {/* 3. Grain Texture */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />

        {/* 4. Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020010_100%)]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center group">
        {/* ICON - Floating */}
        <div className="mb-8 flex justify-center animate-fade-in-up">
          <div className="relative">
            <div
              className="absolute inset-0 blur-[20px] opacity-0 group-hover:opacity-40 transition-opacity duration-1000"
              style={{ backgroundColor: color }}
            />
            <div
              className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-md transition-colors duration-500"
              style={{ borderColor: `${color}40` }}
            >
              <Sparkles
                className="w-5 h-5 transition-colors duration-500"
                style={{ color: color }}
                strokeWidth={1.5}
              />
            </div>
          </div>
        </div>

        {/* HEADLINE */}
        <h2 className="text-5xl md:text-7xl font-serif text-white mb-8 tracking-tight leading-[1.1] drop-shadow-2xl animate-fade-in-up delay-100">
          Your voice has a <br />
          <span
            className="italic font-light transition-colors duration-500"
            style={{ color: color }}
          >
            story to tell.
          </span>
        </h2>

        {/* SUBTEXT */}
        <p className="text-lg text-white/40 max-w-xl mx-auto mb-12 font-light leading-relaxed tracking-wide animate-fade-in-up delay-200">
          We’ve set the stage. The acoustics are perfect. The only missing
          element is the narrator.
        </p>

        {/* ACTIONS */}
        <div className="flex flex-col items-center gap-6 animate-fade-in-up delay-300">
          {/* PRIMARY ACTION: Button Atom */}
          <Link href="/projectform">
            <Button
              variant="glow"
              theme={theme}
              className="!h-14 !px-10 !text-xs !tracking-[0.25em]"
            >
              Begin The Journey <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>

          {/* SECONDARY ACTION: Text Link */}
          <Link
            href="/portfolio"
            className="text-[10px] uppercase tracking-[0.2em] text-white/30 hover:text-white transition-colors duration-300 border-b border-transparent hover:border-white/20 pb-1"
          >
            Explore the Archives
          </Link>
        </div>
      </div>
    </section>
  );
}
