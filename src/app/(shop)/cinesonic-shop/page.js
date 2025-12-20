"use client";

import React from "react";
import { Sparkles, ArrowRight, Mail } from "lucide-react";
import { useTheme } from "../../../components/ui/ThemeContext";
import { subscribeToWaitlist } from "../../../actions/subscribeActions"; // 🟢 Importing the generic action

export default function ShopPage() {
  const { theme, isCinematic } = useTheme();

  // 🟢 1. THE ALLOY MAP (Base vs. Mixed)
  const THEME_CONFIG = {
    gold: {
      base: {
        hex: "#d4af37",
        gradient: "linear-gradient(135deg, #d4af37 0%, #f3e5ab 100%)",
      },
      cine: {
        hex: "#a67c92",
        gradient: "linear-gradient(135deg, #d4af37 0%, #7c3aed 100%)",
      },
    },
    pink: {
      base: {
        hex: "#ff3399",
        gradient: "linear-gradient(135deg, #ff3399 0%, #ff9ec6 100%)",
      },
      cine: {
        hex: "#be36c3",
        gradient: "linear-gradient(135deg, #ff3399 0%, #7c3aed 100%)",
      },
    },
    fire: {
      base: {
        hex: "#ff4500",
        gradient: "linear-gradient(135deg, #ff4500 0%, #ffae42 100%)",
      },
      cine: {
        hex: "#be4077",
        gradient: "linear-gradient(135deg, #ff4500 0%, #7c3aed 100%)",
      },
    },
    cyan: {
      base: {
        hex: "#00f0ff",
        gradient: "linear-gradient(135deg, #00f0ff 0%, #50c878 100%)",
      },
      cine: {
        hex: "#3e95f6",
        gradient: "linear-gradient(135deg, #00f0ff 0%, #7c3aed 100%)",
      },
    },
    system: {
      base: {
        hex: "#3b82f6",
        gradient: "linear-gradient(135deg, #3b82f6 0%, #93c5fd 100%)",
      },
      cine: {
        hex: "#5c5ef2",
        gradient: "linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%)",
      },
    },
    violet: {
      base: {
        hex: "#7c3aed",
        gradient: "linear-gradient(135deg, #7c3aed 0%, #d8b4fe 100%)",
      },
      cine: {
        hex: "#7c3aed",
        gradient: "linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)",
      },
    },
  };

  // Safe fallback
  const config = THEME_CONFIG[theme] || THEME_CONFIG.gold;

  return (
    <div className="min-h-screen bg-[#020010] text-white flex flex-col items-center justify-center relative overflow-hidden px-4 sm:px-6">
      {/* ATMOSPHERE */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />

        {/* Layer 1: Base Glow (Responsive sizing) */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full blur-[100px] md:blur-[150px] opacity-10 transition-colors duration-1000"
          style={{ backgroundColor: config.base.hex }}
        />

        {/* Layer 2: Cine Glow (Violet Mix) - Fades In */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full blur-[100px] md:blur-[150px] opacity-10 transition-opacity duration-1000"
          style={{
            backgroundColor: "#7c3aed",
            opacity: isCinematic ? 0.4 : 0,
          }}
        />
      </div>

      <main className="relative z-10 w-full max-w-4xl mx-auto text-center">
        {/* =============================================
            1. THE GHOST BADGE
           ============================================= */}
        <div className="flex justify-center mb-8 md:mb-10">
          <div className="grid place-items-center">
            {/* LAYER 1: STANDARD */}
            <div
              className="col-start-1 row-start-1 inline-flex items-center gap-2 px-4 py-1.5 md:px-6 md:py-2 rounded-full border text-[10px] md:text-sm font-bold uppercase tracking-[0.2em] animate-pulse transition-all duration-500 whitespace-nowrap"
              style={{
                backgroundColor: `${config.base.hex}10`,
                borderColor: `${config.base.hex}40`,
                color: config.base.hex,
              }}
            >
              <Sparkles size={12} className="md:w-3.5 md:h-3.5" />
              <span>Store Opening Winter, 2026</span>
            </div>

            {/* LAYER 2: CINEMATIC */}
            <div
              className={`col-start-1 row-start-1 inline-flex items-center gap-2 px-4 py-1.5 md:px-6 md:py-2 rounded-full border text-[10px] md:text-sm font-bold uppercase tracking-[0.2em] animate-pulse transition-opacity duration-500 whitespace-nowrap
                    ${isCinematic ? "opacity-100" : "opacity-0"}`}
              style={{
                backgroundColor: `rgba(124, 58, 237, 0.1)`,
                borderColor: config.cine.hex,
                color: config.cine.hex,
              }}
            >
              <Sparkles size={12} className="md:w-3.5 md:h-3.5" />
              <span>Store Opening Winter, 2026</span>
            </div>
          </div>
        </div>

        {/* =============================================
            2. THE GHOST HEADER (H1)
           ============================================= */}
        <div className="relative mb-6 md:mb-8 grid place-items-center">
          {/* LAYER 1: BASE GRADIENT */}
          {/* Responsive Text: 5xl on mobile, 7xl on tablet, 9xl on desktop */}
          <h1
            className="col-start-1 row-start-1 text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-serif font-bold leading-none tracking-tight text-transparent bg-clip-text transition-all duration-700"
            style={{
              backgroundImage: config.base.gradient,
              filter: `drop-shadow(0 0 30px ${config.base.hex}40)`,
            }}
          >
            CineSonic™ <br /> Originals
          </h1>

          {/* LAYER 2: CINEMATIC GRADIENT */}
          <h1
            className={`col-start-1 row-start-1 text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-serif font-bold leading-none tracking-tight text-transparent bg-clip-text transition-opacity duration-700
                ${isCinematic ? "opacity-100" : "opacity-0"}`}
            style={{
              backgroundImage: config.cine.gradient,
              filter: `drop-shadow(0 0 30px #7c3aed60)`,
            }}
          >
            CineSonic™ <br /> Originals
          </h1>
        </div>

        <p className="max-w-xl mx-auto text-gray-400 text-base md:text-2xl font-light leading-relaxed mb-10 md:mb-12 px-4">
          A curated marketplace of cinema-grade SFX, exclusive scripts, and
          limited edition production gear.
        </p>

        {/* =============================================
            3. THE GHOST BUTTON (Notify Me)
           ============================================= */}
        <div className="max-w-[90vw] md:max-w-md mx-auto relative group">
          {/* Glow Behind */}
          <div
            className="absolute -inset-1 rounded-full opacity-25 blur transition duration-500 group-hover:opacity-50"
            style={{ backgroundColor: config.base.hex }}
          ></div>
          <div
            className={`absolute -inset-1 rounded-full opacity-25 blur transition duration-500 group-hover:opacity-50 ${
              isCinematic ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundColor: "#7c3aed" }}
          ></div>

          <form
            className="relative flex items-center bg-[#0a0a0a] border border-white/10 rounded-full p-1.5 md:p-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="pl-3 md:pl-4 text-gray-500">
              <Mail size={16} className="md:w-5 md:h-5" />
            </div>

            {/* Input - min-w-0 prevents flex items from overflowing container */}
            <input
              type="email"
              placeholder="Email for access..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-white px-3 md:px-4 py-2 text-xs md:text-base placeholder-gray-600 focus:outline-none min-w-0"
            />

            {/* THE BUTTON */}
            <div className="relative flex-shrink-0">
              {/* Layer 1: Base Solid */}
              <button
                className="px-4 py-2 md:px-6 md:py-3 rounded-full text-black font-bold uppercase tracking-widest text-[10px] md:text-xs transition-transform duration-300 hover:scale-105 flex items-center gap-2"
                style={{ backgroundColor: config.base.hex }}
              >
                <span>Notify Me</span>{" "}
                <ArrowRight size={12} className="md:w-3.5 md:h-3.5" />
              </button>

              {/* Layer 2: Cinematic Gradient */}
              <button
                className={`absolute inset-0 px-4 py-2 md:px-6 md:py-3 rounded-full text-white font-bold uppercase tracking-widest text-[10px] md:text-xs transition-opacity duration-500 flex items-center justify-center gap-2 pointer-events-none
                        ${isCinematic ? "opacity-100" : "opacity-0"}`}
                style={{ backgroundImage: config.cine.gradient }}
              >
                <span>Notify Me</span>{" "}
                <ArrowRight size={12} className="md:w-3.5 md:h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
