"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mic,
  Users,
  Flame,
  Rocket,
  Check,
  Music,
  Heart,
  Zap,
  Sparkles,
} from "lucide-react";
import ParticleFx from "../ui/ParticleFx";

// --- DATA: STANDARD VS CINEMATIC ---
const SERVICES_DATA = [
  {
    id: "solo",
    baseColor: "#d4af37", // Gold
    iconStandard: Mic,
    iconCinematic: Music,
    link: "/solo-audiobook-production",
    standard: {
      title: "Solo",
      subtitle: "The Standard",
      price: "$",
      features: [
        "1 Narrator",
        "Consistent Tone",
        "Character Voices by Narrator",
        "Standard Editing",
      ],
      bestFor: "Non-Fiction / Thriller",
    },
    cinematic: {
      title: "Solo+",
      subtitle: "The Immersion",
      price: "$$",
      features: [
        "1 Narrator + SFX",
        "Musical Score",
        "Atmospheric Ambience",
        "Enhanced Mastering",
      ],
      bestFor: "Horror / Immersion",
    },
  },
  {
    id: "dual",
    baseColor: "#ff3399", // Neon Pink
    iconStandard: Users,
    iconCinematic: Heart,
    link: "/dual-audiobook-production",
    standard: {
      title: "Dual",
      subtitle: "Two Perspectives",
      price: "$$",
      features: [
        "2 Narrators (M/F)",
        "Split by Chapter (POV)",
        "Authentic Gender Voices",
        "Seamless Transitions",
      ],
      bestFor: "Romance / Contemp",
    },
    cinematic: {
      title: "Dual Cine",
      subtitle: "The Love Story",
      price: "$$$",
      features: [
        "2 Narrators + Score",
        "Romantic Swells",
        "Scene Transitions FX",
        "Emotional Depth",
      ],
      bestFor: "Epic Romance",
    },
  },
  {
    id: "duet",
    baseColor: "#ea580c", // Fire Orange
    iconStandard: Flame,
    iconCinematic: Zap,
    link: "/duet-audiobook-production",
    standard: {
      title: "Duet",
      subtitle: "High Heat",
      price: "$$$",
      features: [
        "2 Narrators (M/F)",
        "Real-time Dialogue",
        "Line-by-Line Stitching",
        "Maximum Chemistry",
      ],
      bestFor: "Dark Romance / Spicy",
    },
    cinematic: {
      title: "Audio Drama",
      subtitle: "Full Immersion",
      price: "$$$$",
      features: [
        "Full Cast Feel",
        "Sound Design Heavy",
        "Action Sequence FX",
        "TV for your Ears",
      ],
      bestFor: "Fantasy / Action",
    },
  },
  {
    id: "multi",
    baseColor: "#00f0ff", // Cyan
    iconStandard: Rocket,
    iconCinematic: Sparkles,
    link: "/multicast-audiobook-production",
    standard: {
      title: "Multi-Cast",
      subtitle: "The Galaxy",
      price: "$$$$",
      features: [
        "3-4 Narrators",
        "Full Ensemble Cast",
        "Cinema-Style Production",
        "Complex Coordination",
      ],
      bestFor: "Sci-Fi / Fantasy",
    },
    cinematic: {
      title: "Blockbuster",
      subtitle: "The Universe",
      price: "$$$$$",
      features: [
        "Full Cast (5+)",
        "Original Score",
        "3D Spatial Audio",
        "Theatrical Mix",
      ],
      bestFor: "Space Opera / Epic",
    },
  },
];

export default function ServiceComparisonMatrix({ theme = "gold" }) {
  // 🟢 STATE: Controls the entire section (ParticleFx + Content)
  const [isCinematic, setIsCinematic] = useState(false);

  // Theme Helper
  const themeConfig = {
    gold: { hex: "#d4af37" },
    pink: { hex: "#ff3399" },
    fire: { hex: "#ea580c" },
    cyan: { hex: "#00f0ff" },
    system: { hex: "#3b82f6" },
  };
  const activeTheme = themeConfig[theme] || themeConfig.gold;
  const sectionColor = activeTheme.hex;

  return (
    <section className="py-24 px-4 md:px-6 bg-[#020010] overflow-hidden transition-colors duration-1000">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* HEADER */}
        <div className="text-center mb-10 animate-fade-in-up">
          <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">
            Compare The Formats
          </h2>
          <div className="inline-block relative mb-8">
            <p
              className="text-white/50 font-light"
              style={{ color: `${sectionColor}AA` }}
            >
              Find the perfect vessel for your story.
            </p>
            <div className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>

          {/* 🟢 TOGGLE COMPONENT */}
          <CineSonicToggle
            isCinematic={isCinematic}
            onToggle={setIsCinematic}
            activeColor={sectionColor}
          />
        </div>

        {/* MATRIX GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {SERVICES_DATA.map((service, index) => (
            <MatrixColumn
              key={service.id}
              service={service}
              index={index}
              isCinematic={isCinematic}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------
// SUB-COMPONENT: The Switch
// ------------------------------------------------------------------
function CineSonicToggle({ isCinematic, onToggle, activeColor }) {
  const Icons = {
    Standard: Mic,
    Cinematic: Sparkles,
  };

  return (
    <div className="flex items-center justify-center gap-4 md:gap-6 pointer-events-auto">
      {/* Label: Standard */}
      <span
        className={`text-xs md:text-sm font-bold tracking-[0.2em] uppercase transition-all duration-500 cursor-pointer ${
          !isCinematic
            ? "opacity-100 scale-105"
            : "opacity-40 scale-100 text-gray-500"
        }`}
        style={{
          color: !isCinematic ? activeColor : undefined,
          textShadow: !isCinematic ? `0 0 15px ${activeColor}60` : "none",
        }}
        onClick={() => onToggle(false)}
      >
        Sonic Mode
      </span>

      {/* The Button */}
      <button
        onClick={() => onToggle(!isCinematic)}
        className="group relative inline-flex items-center justify-center cursor-pointer transition-transform active:scale-95"
      >
        {/* Track */}
        <div
          className="w-20 h-10 rounded-full border transition-all duration-500 ease-out flex items-center justify-between px-2 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]"
          style={{
            borderColor: activeColor,
            backgroundColor: isCinematic
              ? "rgba(124, 58, 237, 0.2)"
              : `${activeColor}20`,
            boxShadow: `0 0 20px ${activeColor}40`,
          }}
        >
          {/* Icons on Track */}
          <div
            className={`transition-opacity duration-300 ${
              isCinematic ? "opacity-30 blur-[1px]" : "opacity-100"
            }`}
          >
            <Icons.Standard
              size={14}
              color={isCinematic ? "#ffffff" : activeColor}
            />
          </div>
          <div
            className={`transition-opacity duration-300 ${
              isCinematic ? "opacity-100" : "opacity-30 blur-[1px]"
            }`}
          >
            <Icons.Cinematic
              size={14}
              color={isCinematic ? "#ffffff" : activeColor}
            />
          </div>
        </div>

        {/* Knob */}
        <div
          className="absolute left-1 top-1 w-8 h-8 rounded-full shadow-lg transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex items-center justify-center border border-white/20"
          style={{
            backgroundColor: activeColor,
            transform: isCinematic ? "translateX(125%)" : "translateX(0%)",
            boxShadow: `0 0 15px ${activeColor}`,
          }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <Icons.Standard
              size={16}
              className={`absolute transition-all duration-300 text-[#020010] ${
                isCinematic
                  ? "opacity-0 scale-50 rotate-[-90deg]"
                  : "opacity-100 scale-100 rotate-0"
              }`}
            />
            <Icons.Cinematic
              size={16}
              className={`absolute transition-all duration-300 text-white ${
                isCinematic
                  ? "opacity-100 scale-100 rotate-0"
                  : "opacity-0 scale-50 rotate-[90deg]"
              }`}
            />
          </div>
        </div>
      </button>

      {/* Label: Cinematic */}
      <span
        className={`text-xs md:text-sm font-bold tracking-[0.2em] uppercase transition-all duration-500 cursor-pointer ${
          isCinematic
            ? "opacity-100 scale-105"
            : "opacity-40 scale-100 text-gray-500"
        }`}
        style={{
          textShadow: isCinematic ? "0 0 20px #7c3aed" : "none",
          color: isCinematic ? "#fff" : undefined,
        }}
        onClick={() => onToggle(true)}
      >
        CineSonic Mode
      </span>
    </div>
  );
}

// ------------------------------------------------------------------
// SUB-COMPONENT: Matrix Column
// ------------------------------------------------------------------
function MatrixColumn({ service, index, isCinematic }) {
  const data = isCinematic ? service.cinematic : service.standard;
  const Icon = isCinematic ? service.iconCinematic : service.iconStandard;
  const displayColor = service.baseColor;

  // 🟢 FIX: Map Service IDs to ParticleFx Theme Keys
  // This ensures 'dual' gets PINK hearts, not mixed Gold/Pink.
  const themeMap = {
    solo: "gold",
    dual: "pink",
    duet: "fireOrange", // Maps to #ea580c
    multi: "cyan",
  };

  return (
    <div
      className="relative flex flex-col h-full rounded-3xl border border-white/5 bg-[#0a0a0a] overflow-hidden group hover:-translate-y-2 transition-transform duration-500 animate-fade-in-up"
      style={{
        boxShadow: `0 0 0 1px ${displayColor}20`,
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* 🟢 BACKGROUND FX */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity duration-700">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
        <ParticleFx
          vector={service.id}
          forceCinematic={isCinematic}
          // 🟢 FIX: We force the theme so ParticleFx doesn't fall back to global Gold
          forceTheme={themeMap[service.id]}
        />
      </div>

      {/* Top Border Color Line */}
      <div
        className="absolute top-0 left-0 right-0 h-1 transition-all duration-500 group-hover:h-1.5"
        style={{ backgroundColor: displayColor }}
      />

      <div className="relative z-10 flex flex-col h-full p-8">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <div
            key={isCinematic ? "cine" : "std"}
            className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 bg-white/5 backdrop-blur-md border border-white/10 group-hover:scale-110 transition-all duration-500 shadow-xl animate-in fade-in zoom-in duration-300"
            style={{
              borderColor: `${displayColor}40`,
              boxShadow: `0 0 30px ${displayColor}10`,
            }}
          >
            <Icon size={28} style={{ color: displayColor }} />
          </div>

          <h3 className="text-2xl font-serif text-white mb-1 transition-all duration-300">
            {data.title}
          </h3>
          <p
            className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 transition-all duration-300"
            style={{ color: displayColor }}
          >
            {data.subtitle}
          </p>
        </div>

        {/* Price Section */}
        <div className="mb-8 text-center">
          <span className="text-3xl font-light text-white/90 transition-all duration-300">
            {data.price}
          </span>
        </div>

        <div className="w-full h-px bg-white/10 mb-8" />

        {/* Features List */}
        <ul className="space-y-4 mb-8 flex-grow">
          <li className="flex items-center gap-3 text-sm text-white/80">
            <Check size={16} style={{ color: displayColor }} />
            <span className="font-bold text-white">Best For:</span>
          </li>
          <li className="pl-7 text-xs text-white/50 uppercase tracking-wide mb-4 transition-all duration-300">
            {data.bestFor}
          </li>
          {data.features.map((feat, i) => (
            <li
              key={`${isCinematic}-${i}`}
              className="flex items-start gap-3 text-sm text-white/70 animate-in slide-in-from-bottom-2 duration-300"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <Check
                size={14}
                className="mt-1 shrink-0"
                style={{ color: displayColor }}
              />
              <span>{feat}</span>
            </li>
          ))}
        </ul>

        {/* Action Button */}
        <ThemedButton
          link={service.link}
          color={displayColor}
          isCinematic={isCinematic}
        />
      </div>
    </div>
  );
}

function ThemedButton({ link, color, isCinematic }) {
  const [hover, setHover] = useState(false);
  return (
    <Link
      href={link}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="w-full py-3 rounded-lg border text-center text-xs font-bold uppercase tracking-widest transition-all duration-300"
      style={{
        backgroundColor: hover
          ? color
          : isCinematic
          ? `${color}20`
          : "rgba(255,255,255,0.03)",
        borderColor: hover ? color : `${color}40`,
        color: hover ? "#020010" : "#ffffff",
        boxShadow: hover ? `0 0 20px ${color}60` : "none",
      }}
    >
      {isCinematic ? "Audition Cast" : "View Details"}
    </Link>
  );
}
