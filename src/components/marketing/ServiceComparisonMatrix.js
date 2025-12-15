"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Mic, Users, Flame, Rocket, Check, Heart } from "lucide-react";

// --- CONFIGURATION ---
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

export default function ServiceComparisonMatrix() {
  return (
    <section className="py-24 px-4 md:px-6 bg-[#050505] overflow-hidden">
      {/* 🟢 GLOBAL ANIMATION STYLES */}
      <style jsx global>{`
        @keyframes riseFast {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: translateY(-400px) scale(0);
            opacity: 0;
          }
        }
        @keyframes floatUp {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          30% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-300px) rotate(20deg);
            opacity: 0;
          }
        }
        @keyframes warpDown {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          20% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(600px);
            opacity: 0;
          }
        }
        @keyframes pulseGlow {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.15;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0.3;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">
            Compare The Formats
          </h2>
          <p className="text-white/50">
            Find the perfect vessel for your story.
          </p>
        </div>

        {/* MATRIX GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service) => (
            <MatrixColumn key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}

// --- INDIVIDUAL COLUMN COMPONENT ---
function MatrixColumn({ service }) {
  const Icon = service.icon;

  return (
    <div
      className="relative flex flex-col h-full rounded-3xl border border-white/5 bg-[#0a0a0a] overflow-hidden group hover:-translate-y-2 transition-transform duration-500"
      style={{
        boxShadow: `0 0 0 1px ${service.color}20`,
      }}
    >
      {/* --- BACKGROUND FX LAYER --- */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity duration-700">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
        {service.id === "solo" && <FxSolo color={service.color} />}
        {service.id === "dual" && <FxDual color={service.color} />}
        {service.id === "duet" && <FxDuet color={service.color} />}
        {service.id === "multi" && <FxMulti color={service.color} />}
      </div>

      {/* Top Border Accent */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: service.color }}
      />

      {/* --- CONTENT --- */}
      <div className="relative z-10 flex flex-col h-full p-8">
        {/* HEADER */}
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
            className="text-xs font-bold uppercase tracking-widest opacity-80"
            style={{ color: service.color }}
          >
            {service.subtitle}
          </p>
        </div>

        {/* PRICE INDICATOR */}
        <div className="mb-8 text-center">
          <span className="text-3xl font-light text-white/90">
            {service.price}
          </span>
        </div>

        {/* DIVIDER */}
        <div className="w-full h-px bg-white/10 mb-8" />

        {/* FEATURES LIST */}
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

        {/* 🟢 THEMED CTA BUTTON */}
        <ThemedButton link={service.link} color={service.color} />
      </div>
    </div>
  );
}

// --- THEMED BUTTON COMPONENT ---
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
        // 🟢 Border is ALWAYS the theme color (40% opacity when idle), solid when hovered
        borderColor: hover ? color : `${color}60`,
        color: hover ? "#000000" : "#ffffff",
        boxShadow: hover ? `0 0 20px ${color}60` : "none",
      }}
    >
      View Details
    </Link>
  );
}

// --- VISUAL FX COMPONENTS (CSS ANIMATED) ---

// 1. SOLO: Floating Gold Dust + 🟢 NEW PULSE
const FxSolo = ({ color }) => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Pulsing Center Aura */}
    <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-[#d4af37] rounded-full blur-[50px] animate-[pulseGlow_4s_ease-in-out_infinite]" />
    {[...Array(8)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full animate-pulse"
        style={{
          width: Math.random() * 4 + 1 + "px",
          height: Math.random() * 4 + 1 + "px",
          backgroundColor: color,
          top: Math.random() * 100 + "%",
          left: Math.random() * 100 + "%",
          opacity: Math.random() * 0.5 + 0.3,
          animationDuration: Math.random() * 2 + 1 + "s",
        }}
      />
    ))}
  </div>
);

// 2. DUAL: Floating Hearts
const FxDual = ({ color }) => (
  <div className="absolute inset-0 overflow-hidden">
    {[...Array(6)].map((_, i) => (
      <Heart
        key={i}
        size={10 + Math.random() * 16}
        fill={color}
        stroke="none"
        className="absolute animate-[floatUp_6s_ease-in-out_infinite]"
        style={{
          color: color,
          left: Math.random() * 80 + 10 + "%",
          bottom: "-30px",
          opacity: 0,
          animationDelay: Math.random() * 4 + "s",
        }}
      />
    ))}
    <div
      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-[70px]"
      style={{ backgroundColor: color, opacity: 0.15 }}
    />
  </div>
);

// 3. DUET: Rising Embers (🟢 INCREASED & INTENSIFIED)
const FxDuet = ({ color }) => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Increased count to 25 for "more embers" */}
    {[...Array(25)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full animate-[riseFast_3s_linear_infinite]"
        style={{
          width: Math.random() * 3 + 1 + "px",
          height: Math.random() * 3 + 1 + "px",
          backgroundColor: color,
          left: Math.random() * 100 + "%",
          bottom: "-20px",
          opacity: 0,
          animationDelay: Math.random() * 3 + "s",
          animationDuration: Math.random() * 1.5 + 1.5 + "s", // Faster mix
        }}
      />
    ))}
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-t from-[#ff4500]/30 to-transparent" />
  </div>
);

// 4. MULTI: Warp Stars (Downward)
const FxMulti = ({ color }) => (
  <div className="absolute inset-0 overflow-hidden">
    {[...Array(10)].map((_, i) => (
      <div
        key={i}
        className="absolute w-[1px] bg-white animate-[warpDown_2s_linear_infinite]"
        style={{
          height: Math.random() * 40 + 20 + "px",
          left: Math.random() * 100 + "%",
          top: "-60px",
          opacity: 0,
          animationDelay: Math.random() * 2 + "s",
          backgroundColor: color,
        }}
      />
    ))}
  </div>
);
