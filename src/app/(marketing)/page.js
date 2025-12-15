"use client";
import React from "react";
import Link from "next/link";
import { Mic2, Users, ArrowRight, Diamond, Star } from "lucide-react";

// 🟢 1. IMPORT THE REAL COMPONENT
// (Make sure this path matches where you saved RosterPreview.js)
import RosterPreview from "../../components/marketing/RosterPreview";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full bg-[#050505] overflow-x-hidden selection:bg-[#d4af37]/30 font-sans">
      {/* --- 1. FIXED BACKGROUND (SONAR & NOISE) --- */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        {/* Sonar Rings */}
        <div className="absolute w-[40vw] h-[40vw] min-w-[300px] min-h-[300px] rounded-full border border-white/[0.03]" />
        <div className="absolute w-[60vw] h-[60vw] min-w-[500px] min-h-[500px] rounded-full border border-white/[0.03]" />
        <div className="absolute w-[80vw] h-[80vw] min-w-[700px] min-h-[700px] rounded-full border border-white/[0.02]" />
        <div className="absolute w-[100vw] h-[100vw] min-w-[900px] min-h-[900px] rounded-full border border-white/[0.02]" />
        <div className="absolute w-[140vw] h-[140vw] min-w-[1200px] min-h-[1200px] rounded-full border border-white/[0.01]" />

        {/* Ambient Gold Glow */}
        <div className="absolute w-[50vw] h-[50vw] bg-[#d4af37]/5 blur-[150px] rounded-full mix-blend-screen animate-pulse duration-[10000ms]" />

        {/* Film Noise */}
        <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>

      {/* --- 2. HERO SECTION --- */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center">
        {/* Badge */}
        <div className="flex items-center gap-4 px-6 py-2.5 border border-white/10 bg-white/[0.02] backdrop-blur-md rounded-full shadow-[0_0_20px_rgba(212,175,55,0.05)] mb-12">
          <Diamond
            size={12}
            className="text-[#d4af37] fill-[#d4af37] animate-pulse"
          />
          <span className="text-xs tracking-[0.4em] uppercase text-[#d4af37]/90 font-medium">
            Recording in session
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-light tracking-tighter leading-[1.05] mb-8">
          <span className="bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent">
            More than just narration.
          </span>
          <br />
          <span className="bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent">
            We{" "}
          </span>
          <span className="bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728] bg-clip-text text-transparent drop-shadow-lg">
            perform
          </span>
          <span className="bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent">
            {" "}
            Audiobooks.
          </span>
        </h1>

        {/* Subhead */}
        <div className="relative max-w-4xl mt-4 mb-12">
          <h2 className="text-xl md:text-2xl text-white/70 font-sans font-light leading-relaxed tracking-wide">
            CineSonic is a full-service, multi-cast producer featuring the most{" "}
            <span className="text-white font-normal underline decoration-[#d4af37]/50 underline-offset-4 decoration-1">
              talented actors
            </span>{" "}
            in the industry.
          </h2>
        </div>

        {/* Primary CTA */}
        <Link
          href="/projectform"
          className="group relative inline-flex items-center gap-4 px-12 py-5 bg-[#d4af37] text-black font-bold text-sm uppercase tracking-widest rounded-full overflow-hidden transition-all hover:scale-105 shadow-[0_0_40px_rgba(212,175,55,0.3)]"
        >
          <span className="relative z-10 flex items-center gap-2">
            Start Casting <ArrowRight size={18} />
          </span>
          <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
        </Link>
      </section>

      {/* --- 3. LIVE ROSTER PREVIEW (The New Component) --- */}
      {/* This replaces the entire old Section 3 block */}
      <RosterPreview />

      {/* --- 4. NAVIGATION CARDS (The Path) --- */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* CARD 1: PROCESS */}
          <Link
            href="/about-us/audiobook-production-process"
            className="group relative min-h-[400px] flex flex-col justify-between p-10 md:p-14
                        bg-[#0a0a0a] border border-white/10 rounded-2xl
                        transition-all duration-700 hover:border-[#d4af37]/40 hover:-translate-y-2 hover:shadow-2xl"
          >
            <div className="absolute top-0 left-0 w-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent group-hover:w-full transition-all duration-1000 ease-in-out" />
            <div className="space-y-8">
              <Mic2
                size={42}
                className="text-white/50 font-thin stroke-[1px] group-hover:text-[#d4af37] transition-colors duration-500"
              />
              <div>
                <h3 className="text-3xl md:text-4xl font-serif text-white mb-4 group-hover:text-[#d4af37] transition-colors">
                  The Process
                </h3>
                <p className="text-lg font-light text-white/40 leading-relaxed">
                  From manuscript prep to mastering. See how we build worlds.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-white/5 pt-8 mt-4">
              <span className="text-xs tracking-[0.3em] uppercase text-white/30 group-hover:text-[#d4af37] transition-colors">
                Learn More
              </span>
              <ArrowRight
                size={18}
                className="text-white/30 group-hover:text-[#d4af37] group-hover:translate-x-3 transition-transform duration-500"
              />
            </div>
          </Link>

          {/* CARD 2: ROSTER */}
          <Link
            href="/roster"
            className="group relative min-h-[400px] flex flex-col justify-between p-10 md:p-14
                        bg-[#0a0a0a] border border-white/10 rounded-2xl
                        transition-all duration-700 hover:border-[#d4af37]/40 hover:-translate-y-2 hover:shadow-2xl"
          >
            <div className="absolute top-0 left-0 w-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent group-hover:w-full transition-all duration-1000 ease-in-out delay-100" />
            <div className="space-y-8">
              <Users
                size={42}
                className="text-white/50 font-thin stroke-[1px] group-hover:text-[#d4af37] transition-colors duration-500"
              />
              <div>
                <h3 className="text-3xl md:text-4xl font-serif text-white mb-4 group-hover:text-[#d4af37] transition-colors">
                  The Roster
                </h3>
                <p className="text-lg font-light text-white/40 leading-relaxed">
                  Access our private vault of 50+ elite, vetted narrators.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-white/5 pt-8 mt-4">
              <span className="text-xs tracking-[0.3em] uppercase text-white/30 group-hover:text-[#d4af37] transition-colors">
                Audit Talent
              </span>
              <ArrowRight
                size={18}
                className="text-white/30 group-hover:text-[#d4af37] group-hover:translate-x-3 transition-transform duration-500"
              />
            </div>
          </Link>
        </div>
      </section>

      {/* --- 5. SOCIAL PROOF --- */}
      <section className="relative z-10 py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12 flex justify-center text-[#d4af37] gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={20} fill="currentColor" />
            ))}
          </div>
          <h2 className="text-3xl md:text-5xl font-serif text-white leading-tight mb-8">
            "CineSonic isn't a vendor. They are{" "}
            <span className="text-[#d4af37] italic">
              filmmakers for the ears.
            </span>{" "}
            The attention to detail is obsessive."
          </h2>
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold uppercase tracking-widest text-white">
              M.K. Williams
            </span>
            <span className="text-xs text-white/40 mt-1">
              Sci-Fi & Fantasy Author
            </span>
          </div>
        </div>
      </section>

      {/* --- 6. FINAL CTA --- */}
      <section className="relative z-10 py-32 px-6 bg-gradient-to-t from-[#d4af37]/10 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-8">
            Your story <br /> deserves to be{" "}
            <span className="text-[#d4af37]">heard.</span>
          </h2>
          <Link
            href="/projectform"
            className="inline-flex items-center gap-3 px-12 py-5 bg-[#d4af37] text-black font-bold text-sm uppercase tracking-widest rounded-full hover:bg-white transition-all duration-300 hover:scale-105 shadow-[0_0_50px_rgba(212,175,55,0.4)]"
          >
            Start Production <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
