"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Mic, Users, Flame, Rocket, Check } from "lucide-react";
import ParticleFx from "../ui/ParticleFx"; // Import our Atom

const SERVICES = [
  {
    id: "solo",
    title: "Solo",
    subtitle: "The Standard",
    price: "$",
    color: "#d4af37", // Gold
    icon: Mic,
    features: [
      "1 Narrator",
      "Consistent Tone",
      "Character Voices by Narrator",
      "Standard Editing",
    ],
    bestFor: "Non-Fiction / Thriller",
    link: "/solo-audiobook-production",
  },
  {
    id: "dual",
    title: "Dual",
    subtitle: "Two Perspectives",
    price: "$$",
    color: "#ff3399", // Neon Pink
    icon: Users,
    features: [
      "2 Narrators (M/F)",
      "Split by Chapter (POV)",
      "Authentic Gender Voices",
      "Seamless Transitions",
    ],
    bestFor: "Romance / Contemp",
    link: "/dual-audiobook-production",
  },
  {
    id: "duet",
    title: "Duet",
    subtitle: "High Heat",
    price: "$$$",
    color: "#ff4500", // Fire Orange
    icon: Flame,
    features: [
      "2 Narrators (M/F)",
      "Real-time Dialogue",
      "Line-by-Line Stitching",
      "Maximum Chemistry",
    ],
    bestFor: "Dark Romance / Spicy",
    link: "/duet-audiobook-production",
  },
  {
    id: "multi",
    title: "Multi-Cast",
    subtitle: "The Galaxy",
    price: "$$$$",
    color: "#00f0ff", // Cyan
    icon: Rocket,
    features: [
      "3-4 Narrators",
      "Full Ensemble Cast",
      "Cinema-Style Production",
      "Complex Coordination",
    ],
    bestFor: "Sci-Fi / Fantasy",
    link: "/multicast-audiobook-production",
  },
];

export default function ServiceComparisonMatrix({ theme = "gold" }) {
  // 1. LOCAL COLOR MAP (For Section Header context)
  const themeConfig = {
    gold: { hex: "#d4af37" },
    pink: { hex: "#ff3399" },
    fire: { hex: "#ff4500" },
    cyan: { hex: "#00f0ff" },
    system: { hex: "#3b82f6" },
  };

  const activeTheme = themeConfig[theme] || themeConfig.gold;
  const sectionColor = activeTheme.hex;

  return (
    <section className="py-24 px-4 md:px-6 bg-[#020010] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* SECTION HEADER (Themed) */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">
            Compare The Formats
          </h2>
          <div className="inline-block relative">
            <p
              className="text-white/50 font-light"
              style={{ color: `${sectionColor}AA` }}
            >
              Find the perfect vessel for your story.
            </p>
            <div className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
        </div>

        {/* MATRIX GRID - Mobile Optimized */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service, index) => (
            <MatrixColumn key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MatrixColumn({ service, index }) {
  const Icon = service.icon;

  return (
    <div
      className="relative flex flex-col h-full rounded-3xl border border-white/5 bg-[#0a0a0a] overflow-hidden group hover:-translate-y-2 transition-transform duration-500 animate-fade-in-up"
      style={{
        boxShadow: `0 0 0 1px ${service.color}20`,
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* BACKGROUND FX:
         We use the ParticleFx component here. 
         Note: ParticleFx is client-side only (canvas), so it handles its own hydration safety.
      */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity duration-700">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
        {/* Pass the specific variant ID (solo, dual, duet, multi) to ParticleFx */}
        <ParticleFx variant={service.id} count={10} color={service.color} />
      </div>

      {/* Top Border Color Line */}
      <div
        className="absolute top-0 left-0 right-0 h-1 transition-all duration-500 group-hover:h-1.5"
        style={{ backgroundColor: service.color }}
      />

      <div className="relative z-10 flex flex-col h-full p-8">
        <div className="mb-8 text-center">
          <div
            className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 bg-white/5 backdrop-blur-md border border-white/10 group-hover:scale-110 transition-transform duration-500 shadow-xl"
            style={{
              borderColor: `${service.color}40`,
              boxShadow: `0 0 30px ${service.color}10`,
            }}
          >
            <Icon size={28} style={{ color: service.color }} />
          </div>
          <h3 className="text-2xl font-serif text-white mb-1">
            {service.title}
          </h3>
          <p
            className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80"
            style={{ color: service.color }}
          >
            {service.subtitle}
          </p>
        </div>

        <div className="mb-8 text-center">
          <span className="text-3xl font-light text-white/90">
            {service.price}
          </span>
        </div>

        <div className="w-full h-px bg-white/10 mb-8" />

        <ul className="space-y-4 mb-8 flex-grow">
          <li className="flex items-center gap-3 text-sm text-white/80">
            <Check size={16} style={{ color: service.color }} />
            <span className="font-bold text-white">Best For:</span>
          </li>
          <li className="pl-7 text-xs text-white/50 uppercase tracking-wide mb-4">
            {service.bestFor}
          </li>
          {service.features.map((feat, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-sm text-white/70"
            >
              <Check
                size={14}
                className="mt-1 shrink-0"
                style={{ color: service.color }}
              />
              <span>{feat}</span>
            </li>
          ))}
        </ul>

        <ThemedButton link={service.link} color={service.color} />
      </div>
    </div>
  );
}

function ThemedButton({ link, color }) {
  const [hover, setHover] = useState(false);
  return (
    <Link
      href={link}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="w-full py-3 rounded-lg border text-center text-xs font-bold uppercase tracking-widest transition-all duration-300"
      style={{
        backgroundColor: hover ? color : "rgba(255,255,255,0.03)",
        borderColor: hover ? color : `${color}40`,
        color: hover ? "#020010" : "#ffffff", // Dark text on hover for contrast
        boxShadow: hover ? `0 0 20px ${color}60` : "none",
      }}
    >
      View Details
    </Link>
  );
}
