"use client";
import React from "react";

const CLIENTS = [
  "Penguin Random House",
  "Harper Collins",
  "Audible Originals",
  "Hachette Audio",
  "Simon & Schuster",
  "Macmillan",
  "Blackstone Publishing",
  "Podium Audio",
];

export default function LogoCloud({ theme = "gold" }) {
  // 1. LOCAL COLOR MAP
  const themeConfig = {
    gold: { hex: "#d4af37" },
    pink: { hex: "#ff3399" },
    fire: { hex: "#ff4500" },
    cyan: { hex: "#00f0ff" },
    system: { hex: "#3b82f6" },
  };

  const activeTheme = themeConfig[theme] || themeConfig.gold;
  const color = activeTheme.hex;

  return (
    <section
      className="relative py-24 bg-[#020010] border-y border-white/5 overflow-hidden group"
      // 🟢 CSS VARIABLE INJECTION: This makes the hover effects performant
      style={{ "--theme-color": color }}
    >
      {/* --- ATMOSPHERE --- */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {/* Central Floor Spotlight - Dynamic Color */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60vw] h-[150px] blur-[100px] rounded-full opacity-20 transition-colors duration-1000"
          style={{ backgroundColor: color }}
        />

        {/* Grain */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 mb-16 text-center animate-fade-in">
        <div className="inline-block relative">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 relative z-10">
            Trusted by the world's best storytellers
          </p>
          {/* Dynamic Underline */}
          <div
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-px transition-all duration-1000"
            style={{
              background: `linear-gradient(to right, transparent, ${color}80, transparent)`,
              boxShadow: `0 0 10px ${color}`,
            }}
          />
        </div>
      </div>

      {/* --- THE SCROLL TRACK --- */}
      <div className="relative flex overflow-x-hidden group/track">
        {/* Gradient Masks (Fade into the void) */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-64 bg-gradient-to-r from-[#020010] via-[#020010]/90 to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-64 bg-gradient-to-l from-[#020010] via-[#020010]/90 to-transparent z-20 pointer-events-none" />

        {/* Scrolling Container - Pauses on Hover */}
        <div className="flex animate-scroll whitespace-nowrap group-hover/track:[animation-play-state:paused]">
          {/* We repeat the set 4 times to ensure seamless looping on ultra-wide screens */}
          <LogoSet items={CLIENTS} />
          <LogoSet items={CLIENTS} />
          <LogoSet items={CLIENTS} />
          <LogoSet items={CLIENTS} />
        </div>
      </div>

      {/* CSS Animation */}
      <style jsx global>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-scroll {
          animation: scroll 80s linear infinite; /* Very slow, majestic scroll */
        }
      `}</style>
    </section>
  );
}

function LogoSet({ items }) {
  return (
    <div className="flex gap-16 md:gap-32 px-8 md:px-16 items-center">
      {items.map((item, i) => (
        <span
          key={i}
          className="
            text-2xl md:text-4xl font-serif tracking-tight cursor-default transition-all duration-500
            
            /* DEFAULT STATE: Ghostly Gradient Text */
            text-transparent bg-clip-text bg-gradient-to-b from-white/30 via-white/10 to-white/5
            
            /* HOVER STATE: Ignite with Theme Color (via CSS Var) */
            hover:text-[var(--theme-color)] hover:bg-none
            hover:drop-shadow-[0_0_15px_var(--theme-color)]
            hover:scale-105
          "
        >
          {item}
        </span>
      ))}
    </div>
  );
}
