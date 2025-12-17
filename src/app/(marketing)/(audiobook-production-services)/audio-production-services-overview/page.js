"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mic,
  Users,
  Flame,
  Rocket,
  ArrowRight,
  Layers,
  Sparkles,
  Music,
  Heart,
  Zap,
  Wand2,
} from "lucide-react";

// 🟢 IMPORT THE MATRIX COMPONENT
import ServiceComparisonMatrix from "../../../../components/marketing/ServiceComparisonMatrix";

// --- CONFIGURATION DATA ---
const SERVICE_DATA = {
  solo: {
    id: "solo",
    href: "/solo-audiobook-production",
    std: {
      title: "Solo Production",
      subtitle: "The Industry Standard",
      description:
        "One distinct voice carrying your entire narrative. Perfect for non-fiction, memoirs, and literary fiction where intimacy is key.",
      icon: Mic,
      color: "#d4af37", // Gold
      gradient: "from-[#d4af37] to-[#b8860b]",
    },
    cine: {
      title: "Solo+ Experience",
      subtitle: "Enhanced Immersion",
      description:
        "The classic solo narration elevated with a custom musical score and subtle atmospheric sound design to underscore emotional beats.",
      icon: Music,
      color: "#7c3aed", // Violet
      gradient: "from-[#7c3aed] to-[#4c1d95]",
    },
  },
  dual: {
    id: "dual",
    href: "/dual-audiobook-production",
    std: {
      title: "Dual Narration",
      subtitle: "Two Perspectives",
      description:
        "Male and Female narrators reading their specific POV chapters. The absolute gold standard for Romance and Thrillers.",
      icon: Users,
      color: "#ff3399", // Pink
      gradient: "from-[#ff3399] to-[#ff0066]",
    },
    cine: {
      title: "Dual Cinematic",
      subtitle: "The Love Story",
      description:
        "Two narrators with full musical accompaniment. Swells of orchestra during the climax, silence during the heartbreak.",
      icon: Heart,
      color: "#7c3aed", // Violet
      gradient: "from-[#7c3aed] to-[#ff3399]", // Violet to Pink
    },
  },
  duet: {
    id: "duet",
    href: "/duet-audiobook-production",
    std: {
      title: "Duet Narration",
      subtitle: "High Heat & Chemistry",
      description:
        "Real acting. Actors interact line-by-line, creating a seamless dialogue flow. Ideal for high-stakes drama and spice.",
      icon: Flame,
      color: "#ea580c", // Orange
      gradient: "from-[#ea580c] to-[#dc2626]",
    },
    cine: {
      title: "Audio Drama",
      subtitle: "Full Immersion",
      description:
        "A TV show for your ears. Duet narration combined with heavy sound effects (doors slamming, rain falling) and action scoring.",
      icon: Zap,
      color: "#7c3aed", // Violet
      gradient: "from-[#7c3aed] to-[#ea580c]", // Violet to Orange
    },
  },
  multi: {
    id: "multi",
    href: "/multicast-audiobook-production",
    std: {
      title: "Multi-Cast Ensemble",
      subtitle: "Cinematic Scope",
      description:
        "A distinct actor for every major role. 3-4 pros building a world of sound without the clutter of sound effects.",
      icon: Rocket,
      color: "#00f0ff", // Cyan
      gradient: "from-[#00f0ff] to-[#0099ff]",
    },
    cine: {
      title: "Blockbuster",
      subtitle: "The Universe",
      description:
        "Full cast (5+ actors), original orchestral score, and 3D spatial audio mixing. The ultimate auditory experience.",
      icon: Sparkles,
      color: "#7c3aed", // Violet
      gradient: "from-[#7c3aed] to-[#00f0ff]", // Violet to Cyan
    },
  },
};

export default function ServicesOverviewPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#d4af37]/30 overflow-hidden">
      {/* --- 1. HERO SECTION --- */}
      <section className="relative pt-32 pb-24 px-6 border-b border-white/10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-white/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/10 bg-white/5 rounded-full mb-8">
            <Layers size={14} className="text-[#d4af37]" />
            <span className="text-[11px] tracking-[0.2em] uppercase text-white/60 font-bold">
              Production Suite
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif mb-6 drop-shadow-2xl text-white tracking-tight">
            Define Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-white to-[#d4af37]">
              Narrative Voice.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/60 leading-relaxed mb-10 max-w-2xl mx-auto font-light">
            Every story demands a unique vessel. From intimate solo performances
            to cinematic full-cast ensembles, we engineer the perfect audio
            format for your manuscript.
          </p>
        </div>
      </section>

      {/* --- SECTIONS --- */}
      <ServiceSection data={SERVICE_DATA.solo} align="left" />
      <ServiceSection data={SERVICE_DATA.dual} align="right" />
      <ServiceSection data={SERVICE_DATA.duet} align="left" />
      <ServiceSection data={SERVICE_DATA.multi} align="right" />

      {/* --- MATRIX --- */}
      <ServiceComparisonMatrix />

      {/* --- FOOTER CTA --- */}
      <section className="py-24 px-6 text-center border-t border-white/10">
        <h2 className="text-3xl font-serif text-white mb-6">
          Not sure which format fits?
        </h2>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 text-[#d4af37] hover:text-white transition-colors border-b border-[#d4af37] hover:border-white pb-1"
        >
          <span>Consult with our Creative Director</span>
          <ArrowRight size={16} />
        </Link>
      </section>
    </main>
  );
}

// ------------------------------------------------------------------
// COMPONENT: Service Section (With Toggle Logic)
// ------------------------------------------------------------------
function ServiceSection({ data, align }) {
  const [isCine, setIsCine] = useState(false);
  const isRight = align === "right";

  // Determine active mode
  const mode = isCine ? data.cine : data.std;
  const ActiveIcon = mode.icon;

  return (
    <section className="relative py-24 px-6 overflow-hidden group">
      {/* 1. Ambient Glow (Updates with mode color) */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 w-[600px] h-[600px] blur-[150px] opacity-10 transition-all duration-700 pointer-events-none rounded-full
          ${isRight ? "-right-32" : "-left-32"}
        `}
        style={{ backgroundColor: mode.color }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div
          className={`flex flex-col md:flex-row items-center gap-12 md:gap-24 ${
            isRight ? "md:flex-row-reverse" : ""
          }`}
        >
          {/* --- VISUAL SIDE (The Square) --- */}
          <div className="w-full md:w-1/2">
            <div className="block relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 bg-[#0a0a0a] shadow-2xl transition-colors duration-500">
              {/* Inner Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${mode.gradient} opacity-10 transition-all duration-700`}
              />

              {/* Center Icon Display */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-24 h-24 rounded-full border border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-500"
                  style={{
                    borderColor: `${mode.color}40`,
                    boxShadow: `0 0 40px ${mode.color}20`,
                  }}
                >
                  <ActiveIcon
                    size={40}
                    style={{ color: mode.color }}
                    className="transition-all duration-500"
                  />
                </div>
              </div>

              {/* --- 🟢 THE TOGGLE BUTTON --- */}
              <button
                onClick={() => setIsCine(!isCine)}
                className="absolute bottom-6 right-6 flex items-center gap-3 px-4 py-2 rounded-full border backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 group/toggle z-20"
                style={{
                  backgroundColor: isCine
                    ? "rgba(124, 58, 237, 0.2)"
                    : "rgba(255,255,255,0.05)",
                  borderColor: isCine ? "#7c3aed" : "rgba(255,255,255,0.2)",
                }}
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/90">
                  {isCine ? "CineSonic Mode" : "Sonic Mode"}
                </span>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    isCine
                      ? "bg-[#7c3aed] text-white"
                      : "bg-white/10 text-gray-400"
                  }`}
                >
                  {isCine ? <Sparkles size={12} /> : <Wand2 size={12} />}
                </div>
              </button>

              {/* Decorative Lines */}
              <div className="absolute bottom-6 left-6 flex items-end opacity-50">
                <div className="text-[10px] uppercase tracking-widest font-mono text-white/60">
                  Format_ID: {data.id.toUpperCase()}
                  {isCine ? "+" : ""}
                </div>
              </div>
            </div>
          </div>

          {/* --- TEXT SIDE --- */}
          <div className="w-full md:w-1/2 text-left">
            {/* Subtitle Pill */}
            <div className="inline-block mb-4 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm transition-colors duration-500">
              <span
                className="text-xs font-bold uppercase tracking-widest transition-colors duration-500"
                style={{ color: mode.color }}
              >
                {mode.subtitle}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-4xl md:text-6xl font-serif text-white mb-6 transition-all duration-500">
              {mode.title}
            </h2>

            {/* Description */}
            <p className="text-lg text-white/60 leading-relaxed mb-10 max-w-md transition-opacity duration-500 min-h-[80px]">
              {mode.description}
            </p>

            {/* CTA Button */}
            <Link
              href={data.href}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 border text-white font-bold rounded-full transition-all hover:bg-white/10 hover:pr-10 group/btn"
              style={{ borderColor: `${mode.color}40` }}
            >
              <span>{isCine ? "Explore Cinematic" : "Explore Standard"}</span>
              <ArrowRight
                size={18}
                style={{ color: mode.color }}
                className="group-hover/btn:translate-x-1 transition-transform duration-300"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
