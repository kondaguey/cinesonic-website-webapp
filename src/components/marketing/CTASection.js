"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative py-32 px-6 bg-[#030303] overflow-hidden flex items-center justify-center min-h-[60vh]">
      {/* --- ATMOSPHERE --- */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {/* Deep Ambient Glow from bottom */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-gradient-to-t from-[#d4af37]/10 via-[#d4af37]/5 to-transparent blur-[100px] opacity-60" />

        {/* Grain Texture (Subtler) */}
        <div className="absolute inset-0 opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#030303_100%)]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center group">
        {/* Icon / Symbol - Floating */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-[#d4af37] blur-[20px] opacity-0 group-hover:opacity-20 transition-opacity duration-1000" />
            <Sparkles
              className="w-6 h-6 text-[#d4af37]/60 group-hover:text-[#d4af37] transition-colors duration-500"
              strokeWidth={1}
            />
          </div>
        </div>

        {/* Headline - High Serif, Elegant, Fade-in feel */}
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/40 mb-8 tracking-tight leading-[1.1]">
          Your voice has a <br />
          <span className="italic text-[#d4af37]/80 font-light">
            story to tell.
          </span>
        </h2>

        {/* Subtext - Mysterious & Invitational */}
        <p className="text-lg text-white/40 max-w-xl mx-auto mb-12 font-light leading-relaxed tracking-wide">
          We’ve set the stage. The acoustics are perfect. The only missing
          element is the narrator.
        </p>

        {/* THE BUTTON - Glass/Ghost Style */}
        <div className="flex flex-col items-center gap-6">
          <Link
            href="/projectform"
            className="group/btn relative px-10 py-4 rounded-full overflow-hidden transition-all duration-500"
          >
            {/* Button Background - Glassy & Subtle */}
            <div className="absolute inset-0 bg-white/5 border border-white/10 group-hover/btn:border-[#d4af37]/30 group-hover/btn:bg-[#d4af37]/5 transition-all duration-500 rounded-full" />

            {/* Button Glow on Hover */}
            <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 bg-[radial-gradient(100px_at_50%_-20%,rgba(212,175,55,0.2),transparent)] transition-opacity duration-500" />

            <div className="relative z-10 flex items-center gap-3">
              <span className="text-sm font-medium tracking-[0.2em] uppercase text-white/80 group-hover/btn:text-[#d4af37] transition-colors duration-300">
                Begin The Journey
              </span>
              <ArrowRight
                size={16}
                className="text-white/40 group-hover/btn:text-[#d4af37] group-hover/btn:translate-x-1 transition-all duration-300"
              />
            </div>
          </Link>

          {/* Very Subtle Text Link underneath */}
          <Link
            href="/portfolio"
            className="text-xs uppercase tracking-widest text-white/20 hover:text-white/50 transition-colors duration-300 border-b border-transparent hover:border-white/20 pb-0.5"
          >
            Explore the Archives
          </Link>
        </div>
      </div>
    </section>
  );
}
