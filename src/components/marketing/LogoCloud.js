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

export default function LogoCloud() {
  return (
    <section className="relative py-20 bg-[#030303] border-y border-white/5 overflow-hidden">
      {/* --- ATMOSPHERE --- */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Central Floor Spotlight */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60vw] h-[100px] bg-[#d4af37]/10 blur-[80px] rounded-full opacity-40" />
        {/* Grain */}
        <div className="absolute inset-0 opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 mb-12 text-center">
        <div className="inline-block relative">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 relative z-10">
            Trusted by the world's best storytellers
          </p>
          {/* Subtle line under text */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-px bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent" />
        </div>
      </div>

      {/* --- THE SCROLL TRACK --- */}
      <div className="relative flex overflow-x-hidden group">
        {/* Gradient Masks (Fade into the void) */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-[#030303] via-[#030303]/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-[#030303] via-[#030303]/80 to-transparent z-20 pointer-events-none" />

        {/* Scrolling Container - Pauses on Hover */}
        <div className="flex animate-scroll whitespace-nowrap group-hover:[animation-play-state:paused]">
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
            transform: translateX(-100%); /* Adjusted for smoother loop math */
          }
        }
        .animate-scroll {
          animation: scroll 60s linear infinite; /* Slowed down for elegance */
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
            text-xl md:text-3xl font-serif tracking-tight cursor-default transition-all duration-500
            
            /* Default State: Metallic/Ghostly Gradient */
            text-transparent bg-clip-text bg-gradient-to-b from-white/40 via-white/20 to-white/10
            
            /* Hover State: Gold & Glow */
            hover:text-[#d4af37] hover:bg-none hover:drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]
          "
        >
          {item}
        </span>
      ))}
    </div>
  );
}
