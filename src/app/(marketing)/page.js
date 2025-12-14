"use client";
import React from "react";
import Link from "next/link";
import { Mic2, Users, ArrowRight, Diamond } from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden px-6 py-24">
      {/* --- 1. BACKGROUND: SONAR & AMBIENCE --- */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        {/* Sonar Rings (Concentric Circles) */}
        {/* We use absolute positioning to center them perfectly behind the content */}
        <div className="absolute w-[40vw] h-[40vw] min-w-[300px] min-h-[300px] rounded-full border border-white/[0.03]" />
        <div className="absolute w-[60vw] h-[60vw] min-w-[500px] min-h-[500px] rounded-full border border-white/[0.03]" />
        <div className="absolute w-[80vw] h-[80vw] min-w-[700px] min-h-[700px] rounded-full border border-white/[0.02]" />
        <div className="absolute w-[100vw] h-[100vw] min-w-[900px] min-h-[900px] rounded-full border border-white/[0.02]" />
        <div className="absolute w-[140vw] h-[140vw] min-w-[1200px] min-h-[1200px] rounded-full border border-white/[0.01]" />

        {/* Ambient Gold Glow (Center) */}
        <div className="absolute w-[50vw] h-[50vw] bg-gold/5 blur-[150px] rounded-full mix-blend-screen animate-pulse duration-[10000ms]" />

        {/* Film Noise */}
        <div
          className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* --- 2. HERO CONTENT --- */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center text-center gap-12 mb-24 animate-fade-in-up">
        {/* Jeweled Badge */}
        <div className="flex items-center gap-4 px-6 py-2.5 border border-white/10 bg-white/[0.02] backdrop-blur-md rounded-full shadow-[0_0_20px_rgba(212,175,55,0.05)]">
          <Diamond size={12} className="text-gold fill-gold animate-pulse" />
          <span className="text-xs tracking-[0.4em] uppercase text-gold/90 font-sans font-medium">
            Recording in session
          </span>
        </div>

        {/* H1: Massive, Thin, Gradient */}
        <h1 className="text-4xl md:text-5xl font-serif font-light tracking-tighter leading-[1.05]">
          <span className="tracking-wide bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent">
            More than just narration.
          </span>
          <br />
          <span className="tracking-wide bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent">
            We{" "}
          </span>
          {/* Gold Gradient Text */}
          <span className="tracking-wide bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728] bg-clip-text text-transparent drop-shadow-lg">
            perform
          </span>
          {/* Matching White Gradient */}
          <span className="tracking-wide bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent">
            {" "}
            Audiobooks.
          </span>
        </h1>
        {/* H2: Large, Thin, Elegant */}
        <div className="relative max-w-4xl mt-4">
          {/* Decorative Side Lines */}
          <div className="absolute left-[-40px] top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-gold/20 to-transparent hidden md:block" />
          <div className="absolute right-[-40px] top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-gold/20 to-transparent hidden md:block" />

          <h2 className="text-2xl md:text-3xl text-white/80 font-sans font-light leading-relaxed tracking-wide">
            CineSonic Audiobooks is a full-service, multi-cast audiobook and
            audio drama producer of the highest caliber, featuring the most{" "}
            <span className="bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728] bg-clip-text text-transparent font-medium">
              talented and experienced
            </span>{" "}
            actors and artists in the industry.
          </h2>
        </div>
      </div>

      {/* --- 3. GLASS CARDS (Linear Style) --- */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* CARD 1 */}
        <Link
          href="/projectform"
          className="group relative min-h-[400px] flex flex-col justify-between p-12 md:p-14
                     bg-white/[0.01] backdrop-blur-2xl border border-white/10 rounded-sm
                     transition-all duration-700 hover:border-gold/30 hover:bg-white/[0.02]"
        >
          {/* Top Line Shine on Hover */}
          <div className="absolute top-0 left-0 w-0 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent group-hover:w-full transition-all duration-1000 ease-in-out" />

          <div className="space-y-8">
            <Mic2
              size={42}
              className="text-white/70 font-thin stroke-[0.75px] group-hover:text-gold transition-colors duration-500"
            />

            <div>
              <h3 className="text-4xl md:text-5xl font-serif font-light text-white mb-4 group-hover:text-gold-light transition-colors">
                Vox Populi
              </h3>
              <p className="text-lg md:text-xl font-light text-white/40 leading-loose">
                Excepteur sint occaecat cupidatat non proident, sunt in culpa
                qui officia deserunt.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/5 pt-8 mt-4">
            <span className="text-sm tracking-[0.3em] uppercase text-white/30 group-hover:text-gold transition-colors">
              Access
            </span>
            <ArrowRight
              size={18}
              className="text-white/30 group-hover:text-gold group-hover:translate-x-3 transition-transform duration-500"
            />
          </div>
        </Link>

        {/* CARD 2 */}
        <Link
          href="/roster"
          className="group relative min-h-[400px] flex flex-col justify-between p-12 md:p-14
                     bg-white/[0.01] backdrop-blur-2xl border border-white/10 rounded-sm
                     transition-all duration-700 hover:border-gold/30 hover:bg-white/[0.02]"
        >
          {/* Top Line Shine on Hover */}
          <div className="absolute top-0 left-0 w-0 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent group-hover:w-full transition-all duration-1000 ease-in-out delay-100" />

          <div className="space-y-8">
            <Users
              size={42}
              className="text-white/70 font-thin stroke-[0.75px] group-hover:text-gold transition-colors duration-500"
            />

            <div>
              <h3 className="text-4xl md:text-5xl font-serif font-light text-white mb-4 group-hover:text-gold-light transition-colors">
                Ordo Ab Chao
              </h3>
              <p className="text-lg md:text-xl font-light text-white/40 leading-loose">
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/5 pt-8 mt-4">
            <span className="text-sm tracking-[0.3em] uppercase text-white/30 group-hover:text-gold transition-colors">
              Inspect
            </span>
            <ArrowRight
              size={18}
              className="text-white/30 group-hover:text-gold group-hover:translate-x-3 transition-transform duration-500"
            />
          </div>
        </Link>
      </div>
    </main>
  );
}
