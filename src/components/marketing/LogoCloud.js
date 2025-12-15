"use client";
import React from "react";

// Placeholder names since we don't have SVG logos handy.
// In production, replace the text spans with <img src="..." />
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
    <section className="py-12 bg-black border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/30">
          Trusted by the world's best storytellers
        </p>
      </div>

      {/* GRADIENT MASKS (Fades the edges) */}
      <div className="relative flex overflow-x-hidden group">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10" />

        {/* SCROLLING TRACK (Duplicated for seamless loop) */}
        <div className="flex animate-scroll whitespace-nowrap">
          <LogoSet items={CLIENTS} />
          <LogoSet items={CLIENTS} />
        </div>
      </div>

      {/* REQUIRED GLOBAL CSS FOR SCROLL ANIMATION */}
      <style jsx global>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
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
          className="text-xl md:text-2xl font-serif text-white/30 hover:text-[#d4af37] transition-colors duration-300 cursor-default whitespace-nowrap"
        >
          {item}
        </span>
      ))}
    </div>
  );
}
