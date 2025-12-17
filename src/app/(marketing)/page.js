"use client";
import React from "react";
import Link from "next/link";
import { Mic2, Users, ArrowRight, Diamond, Star } from "lucide-react";

// 🟢 SAFE IMPORTS (Relative Paths)
// We go up one level from 'app' to 'src', then into 'components'
import RosterPreview from "../../components/marketing/RosterPreview";
import ParticleFx from "../../components/ui/ParticleFx";

export default function Home() {
  // Home is always the Classic Gold theme
  const PAGE_THEME = "gold";

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden font-sans selection:bg-[#d4af37]/30">
      {/* --- 1. FIXED BACKGROUND OVERLAYS --- */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        {/* Subtle Particle Dust (The "Cathedral" Atmosphere) */}
        <div className="absolute inset-0 opacity-40">
          <ParticleFx variant="solo" count={20} color="#d4af37" />
        </div>

        {/* Sonar Rings */}
        <div className="absolute w-[40vw] h-[40vw] min-w-[300px] min-h-[300px] rounded-full border border-white/[0.03]" />
        <div className="absolute w-[60vw] h-[60vw] min-w-[500px] min-h-[500px] rounded-full border border-white/[0.02]" />
        <div className="absolute w-[80vw] h-[80vw] min-w-[700px] min-h-[700px] rounded-full border border-white/[0.01]" />

        {/* Ambient Gold Glow */}
        <div className="absolute w-[50vw] h-[50vw] bg-[var(--color-gold)]/5 blur-[120px] rounded-full mix-blend-screen animate-pulse duration-[10000ms]" />

        {/* Film Noise */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>

      {/* --- 2. HERO SECTION --- */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center animate-fade-in">
        {/* Badge */}
        <div className="flex items-center gap-3 px-5 py-2 border border-white/10 bg-white/[0.03] backdrop-blur-md rounded-full shadow-lg shadow-[#d4af37]/5 mb-12">
          <Diamond
            size={10}
            className="text-[var(--color-gold)] fill-[var(--color-gold)] animate-pulse"
          />
          <span className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)]/80 font-semibold">
            Recording in session
          </span>
        </div>

        {/* --- THE TRADEMARK HEADER --- */}
        <h1 className="max-w-6xl mx-auto mb-10">
          {/* Top Line */}
          <span className="block text-xl md:text-2xl text-white/40 font-sans tracking-[0.2em] uppercase mb-6">
            More than just narration
          </span>

          {/* THE BRAND NAME */}
          <span className="relative inline-block">
            {/* The Main Text */}
            <span className="block text-6xl md:text-8xl lg:text-9xl font-serif font-normal text-shimmer-gold drop-shadow-[0_0_40px_rgba(212,175,55,0.25)] tracking-wide">
              CineSonic
            </span>

            {/* The Trademark Symbol */}
            <sup className="absolute top-0 -right-2 md:-top-4 md:-right-8 text-xl md:text-5xl font-sans font-normal select-none tracking-normal text-shimmer-gold drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]">
              ™
            </sup>
          </span>

          {/* Bottom Line */}
          <span className="block text-3xl md:text-5xl mt-8 text-white/90 font-serif font-light">
            We {/* UPDATED: Silver Shimmer from Theme Engine */}
            <span className="text-shimmer-silver font-normal italic">
              perform
            </span>{" "}
            audiobooks.
          </span>
        </h1>

        {/* Subhead */}
        <div className="relative max-w-3xl mx-auto mb-12">
          <h2 className="text-white/60 font-sans font-light leading-relaxed tracking-wide text-balance text-lg md:text-xl">
            A full-service, multi-cast production house featuring the most{" "}
            <span className="text-shimmer-gold font-medium border-b border-[#d4af37]/30">
              talented actors
            </span>{" "}
            and artists in the industry.
          </h2>
        </div>

        {/* Primary CTA */}
        <Link
          href="/projectform"
          className="
            group relative inline-flex items-center gap-3 px-12 py-5 
            shine-sweep 
            bg-white/[0.02] backdrop-blur-md border border-[#d4af37]/40 
            rounded-full 
            shadow-[0_0_20px_rgba(212,175,55,0.1)] 
            hover:shadow-[0_0_40px_rgba(212,175,55,0.3)] 
            hover:border-[#d4af37] 
            hover:scale-105 transition-all duration-300
          "
        >
          <span className="relative z-10 flex items-center gap-3 text-shimmer-gold font-bold uppercase tracking-[0.2em] text-xs">
            Start Casting <ArrowRight size={14} className="text-[#d4af37]" />
          </span>
        </Link>
      </section>

      {/* --- 3. LIVE ROSTER PREVIEW (Passing Gold Theme) --- */}
      <RosterPreview theme={PAGE_THEME} />

      {/* --- 4. NAVIGATION CARDS --- */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CARD 1: PROCESS */}
          <Link
            href="/about-us/audiobook-production-process"
            className="group relative min-h-[360px] flex flex-col justify-between p-10
                        bg-white/[0.02] backdrop-blur-sm border border-white/5 rounded-xl
                        transition-all duration-700 hover:bg-white/[0.04] hover:border-[#d4af37]/30 hover:-translate-y-1"
          >
            <div className="absolute top-0 left-0 w-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent group-hover:w-full transition-all duration-1000 ease-in-out" />

            <div className="space-y-6">
              <Mic2
                size={32}
                className="text-white/30 font-thin stroke-[1px] group-hover:text-[#d4af37] transition-colors duration-500"
              />
              <div>
                <h3 className="text-2xl md:text-3xl font-serif text-white/90 mb-3 group-hover:text-white transition-colors">
                  The Process
                </h3>
                <p className="text-base font-light text-white/40 leading-relaxed group-hover:text-white/60">
                  From manuscript prep to mastering. See how we build worlds.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-4">
              <span className="text-[10px] tracking-[0.3em] uppercase text-white/30 group-hover:text-[#d4af37] transition-colors">
                Learn More
              </span>
              <ArrowRight
                size={14}
                className="text-white/30 group-hover:text-[#d4af37] group-hover:translate-x-2 transition-transform duration-500"
              />
            </div>
          </Link>

          {/* CARD 2: ROSTER */}
          <Link
            href="/roster"
            className="group relative min-h-[360px] flex flex-col justify-between p-10
                        bg-white/[0.02] backdrop-blur-sm border border-white/5 rounded-xl
                        transition-all duration-700 hover:bg-white/[0.04] hover:border-[#d4af37]/30 hover:-translate-y-1"
          >
            <div className="absolute top-0 left-0 w-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent group-hover:w-full transition-all duration-1000 ease-in-out delay-100" />

            <div className="space-y-6">
              <Users
                size={32}
                className="text-white/30 font-thin stroke-[1px] group-hover:text-[#d4af37] transition-colors duration-500"
              />
              <div>
                <h3 className="text-2xl md:text-3xl font-serif text-white/90 mb-3 group-hover:text-white transition-colors">
                  The Roster
                </h3>
                <p className="text-base font-light text-white/40 leading-relaxed group-hover:text-white/60">
                  Access our private vault of 50+ elite, vetted narrators.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-4">
              <span className="text-[10px] tracking-[0.3em] uppercase text-white/30 group-hover:text-[#d4af37] transition-colors">
                Audit Talent
              </span>
              <ArrowRight
                size={14}
                className="text-white/30 group-hover:text-[#d4af37] group-hover:translate-x-2 transition-transform duration-500"
              />
            </div>
          </Link>
        </div>
      </section>

      {/* --- 5. SOCIAL PROOF --- */}
      <section className="relative z-10 py-24 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
          <div className="mb-8 flex justify-center text-[#d4af37] gap-2 opacity-80">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={14} fill="currentColor" />
            ))}
          </div>
          <h2 className="text-2xl md:text-4xl font-serif text-white/90 leading-normal mb-8 italic font-light">
            "CineSonic isn't a vendor. They are{" "}
            <span className="text-[#d4af37] font-normal not-italic">
              filmmakers for the ears.
            </span>
            "
          </h2>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              M.K. Williams
            </span>
            <span className="text-[10px] text-white/40 uppercase tracking-widest">
              Sci-Fi & Fantasy Author
            </span>
          </div>
        </div>
      </section>

      {/* --- 6. FINAL CTA --- */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-serif text-white/90 mb-10 font-light">
            Your story deserves to be{" "}
            <span className="text-[#d4af37] italic">heard.</span>
          </h2>
          <Link
            href="/projectform"
            className="inline-flex items-center gap-3 px-10 py-4 bg-transparent border border-[#d4af37] text-[#d4af37] font-bold text-xs uppercase tracking-[0.2em] rounded-full hover:bg-[#d4af37] hover:text-black transition-all duration-300 hover:scale-105"
          >
            Start Production <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </main>
  );
}
