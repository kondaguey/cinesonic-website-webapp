"use client";
import React from "react";
import Image from "next/image";
import {
  Sparkles,
  Heart,
  Anchor,
  Lightbulb,
  Users,
  Feather,
  Film,
} from "lucide-react";

// --- DATA ---
const values = [
  {
    title: "Artistry First",
    description:
      "Technology serves the performance. We preserve the human element in every breath, creating audio that breathes.",
    icon: Sparkles,
  },
  {
    title: "Collaboration",
    description:
      "The best stories emerge from the collective spark of authors, narrators, and directors working in unison.",
    icon: Heart,
  },
  {
    title: "Integrity",
    description:
      "We honor the author's intent. This commitment is the anchor that holds our productions steady against trends.",
    icon: Anchor,
  },
  {
    title: "Innovation",
    description:
      "Pushing the boundaries of immersive sound design, spatial audio, and vocal performance.",
    icon: Lightbulb,
  },
  {
    title: "Empathy",
    description:
      "We listen deeply before we speak. Understanding our characters and audience is the heart of our craft.",
    icon: Users,
  },
  {
    title: "Stewardship",
    description:
      "Nurturing the stories entrusted to us ensures they are remembered by future generations.",
    icon: Feather,
  },
];

export default function CoreValues() {
  return (
    <main className="relative min-h-screen w-full bg-[#050505] overflow-hidden selection:bg-[#d4af37]/30">
      {/* --- 1. AMBIENT BACKGROUND --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Deep Atmospheric Glows */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80vw] h-[60vh] bg-indigo-950/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-0 w-[50vw] h-[50vh] bg-[#d4af37]/5 blur-[150px] rounded-full" />

        {/* Film Noise Texture */}
        <div
          className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* --- 2. MAIN CONTENT WRAPPER --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-24">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-28 animate-fade-in-up relative z-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-[#d4af37]/20 bg-[#d4af37]/5 backdrop-blur-md rounded-full mb-8 shadow-[0_0_15px_-3px_rgba(212,175,55,0.2)]">
            <Film size={14} className="text-[#d4af37]" />
            <span className="text-[11px] tracking-[0.3em] uppercase text-[#d4af37] font-semibold">
              Production Values
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif text-white tracking-tight leading-none drop-shadow-2xl">
            The Director's <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728] drop-shadow-md">
              Cut.
            </span>
          </h1>
        </div>

        {/* --- 3. TIMELINE CONTAINER --- */}
        <div className="relative w-full">
          {/* =========================================
              FILM STRIP SPINE (Centered)
             ========================================= */}
          <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-[160px] z-0 pointer-events-none">
            {/* 1. The Glow Behind the Film Strip */}
            <div className="absolute inset-0 bg-[#d4af37]/10 blur-[60px] rounded-full" />

            {/* 2. The Film Strip Image */}
            <div className="relative w-full h-full opacity-60 mix-blend-screen">
              <Image
                src="/images/film-strip-core-values-cinesonic-audiobooks.png"
                alt="Film Strip Spine"
                fill
                className="object-cover object-top"
                priority
              />
            </div>

            {/* 3. Top/Bottom Fade for Seamless Blending */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
          </div>

          {/* =========================================
              VALUES LIST
             ========================================= */}
          <div className="relative z-10 space-y-6 md:space-y-12 py-10">
            {values.map((value, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={index}
                  className={`relative flex flex-col md:flex-row items-center ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* SPACER (Pushes card to the side on Desktop) */}
                  <div className="hidden md:block w-1/2" />

                  {/* GLASS CARD CONTAINER */}
                  <div
                    className={`w-full md:w-1/2 ${
                      isEven ? "md:pl-20" : "md:pr-20"
                    }`}
                  >
                    <div
                      className="group relative p-8 md:p-10 rounded-2xl overflow-hidden
                                    border border-[#d4af37]/20 
                                    bg-[#0a0a0a]/60 backdrop-blur-xl
                                    shadow-[0_0_0_1px_rgba(212,175,55,0.05)]
                                    transition-all duration-500
                                    hover:border-[#d4af37]/60 
                                    hover:bg-[#0a0a0a]/80
                                    hover:shadow-[0_0_30px_-5px_rgba(212,175,55,0.15)]
                                    hover:-translate-y-1"
                    >
                      {/* Glossy Sheen Overlay (Top Right -> Bottom Left) */}
                      <div className="absolute inset-0 bg-gradient-to-bl from-white/10 via-transparent to-transparent opacity-30 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none" />

                      {/* Inner Content */}
                      <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center">
                        {/* Icon Box (Glowing Gold) */}
                        <div className="shrink-0 p-4 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] shadow-[0_0_15px_-3px_rgba(212,175,55,0.2)] group-hover:bg-[#d4af37]/20 group-hover:scale-110 transition-transform duration-500">
                          <value.icon size={26} strokeWidth={1.5} />
                        </div>

                        {/* Text */}
                        <div className="space-y-2">
                          <h3 className="text-2xl md:text-3xl font-serif text-white tracking-wide group-hover:text-[#fcf6ba] transition-colors duration-300">
                            {value.title}
                          </h3>
                          <p className="text-base text-white/60 font-light leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                            {value.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FOOTER ENDER */}
        <div className="mt-32 text-center relative z-20">
          <div className="w-px h-16 bg-gradient-to-b from-[#d4af37]/30 to-transparent mx-auto mb-6" />
          <h5 className="text-[10px] tracking-[0.5em] uppercase text-white/30">
            End Scene
          </h5>
        </div>
      </div>
    </main>
  );
}
