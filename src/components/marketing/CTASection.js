"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, Mic2, Star } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative py-24 px-6 bg-[#050505] overflow-hidden">
      {/* --- BACKGROUND FX --- */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top Spotlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[40vh] bg-[#d4af37]/10 blur-[120px] rounded-full mix-blend-screen" />
        {/* Bottom Shadow */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#050505] to-transparent" />
        {/* Grain */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* THE CARD */}
        <div className="relative rounded-[3rem] p-[1px] bg-gradient-to-b from-[#d4af37]/40 via-white/5 to-transparent overflow-hidden group">
          {/* Inner Card Background */}
          <div className="relative rounded-[3rem] bg-[#0a0a0a] overflow-hidden px-8 py-16 md:px-20 md:py-24 text-center">
            {/* Hover Spotlight (Follows mouse effect logic simplified for CSS) */}
            <div className="absolute inset-0 bg-[radial-gradient(800px_at_50%_-20%,rgba(212,175,55,0.1),transparent)] opacity-50 group-hover:opacity-100 transition-opacity duration-700" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 mb-8 animate-fade-in">
                <div className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d4af37]">
                  Booking Q3 Production
                </span>
              </div>

              {/* Headline */}
              <h2 className="text-4xl md:text-7xl font-serif text-white mb-6 tracking-tight leading-tight">
                Ready to{" "}
                <span className="text-[#d4af37] italic">Greenlight</span> <br />
                Your Masterpiece?
              </h2>

              <p className="text-lg md:text-xl text-white/50 max-w-2xl mb-10 font-light leading-relaxed">
                The studio is open. The roster is elite.{" "}
                <br className="hidden md:block" />
                The only thing missing is your manuscript.
              </p>

              {/* THE BUTTON */}
              <Link
                href="/projectform"
                className="group/btn relative inline-flex items-center justify-center gap-4 px-12 py-5 bg-[#d4af37] text-[#050505] rounded-full overflow-hidden transition-transform duration-300 hover:scale-105 shadow-[0_0_40px_rgba(212,175,55,0.3)] hover:shadow-[0_0_60px_rgba(212,175,55,0.5)]"
              >
                {/* Button Shine Effect */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/btn:animate-shine" />

                <span className="text-sm font-bold uppercase tracking-widest relative z-10">
                  Start Production
                </span>
                <ArrowRight
                  size={18}
                  className="relative z-10 group-hover/btn:translate-x-1 transition-transform"
                />
              </Link>

              {/* Trust Indicator */}
              <div className="mt-10 flex items-center gap-4 text-white/30 text-xs uppercase tracking-widest font-bold">
                <div className="flex -space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full bg-white/10 border border-[#0a0a0a] flex items-center justify-center"
                    >
                      <Star
                        size={10}
                        className="text-[#d4af37] fill-[#d4af37]"
                      />
                    </div>
                  ))}
                </div>
                <span>100% Rights Retention</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
