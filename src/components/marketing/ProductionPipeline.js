"use client";
import React from "react";
import { Mic2, FileText, Headphones, Send, Sparkles } from "lucide-react";

const STEPS = [
  {
    icon: FileText,
    title: "Onboarding & Script Prep",
    desc: "We analyze your manuscript to build the sonic architecture. Pronunciation guides are built, and character archetypes are defined.",
  },
  {
    icon: Mic2,
    title: "Casting & Auditions",
    desc: "We source talent from our elite roster based on your archetype data. You receive a curated shortlist of audition tapes to approve.",
  },
  {
    icon: Headphones,
    title: "Principal Photography",
    desc: "Production begins. Our directors guide the talent through every chapter to ensure emotional resonance and narrative pacing.",
  },
  {
    icon: Sparkles,
    title: "Post-Production",
    desc: "The cinematic touch. Editing, mixing, and mastering. We remove breaths, clicks, and noise, hitting strict -60dB noise floor standards.",
  },
  {
    icon: Send,
    title: "Delivery & Launch",
    desc: "You receive retail-ready master files formatted for ACX, Audible, and Spotify. Tagged, polished, and ready for upload.",
  },
];

export default function ProductionPipeline() {
  return (
    <section className="relative py-24 px-6 bg-[#030303] overflow-hidden">
      {/* --- ATMOSPHERE --- */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grain */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
        {/* Central Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[60vh] bg-[#d4af37]/5 blur-[120px] rounded-full pointer-events-none" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* HEADER */}
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-serif text-white mb-6 tracking-tight">
            From Page to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#d4af37] to-[#8a7020]">
              Performance.
            </span>
          </h2>
          <p className="text-white/50 font-light text-lg">
            Our rigorous 5-step production standard ensures your story
            translates perfectly to audio.
          </p>
        </div>

        {/* TIMELINE CONTAINER */}
        <div className="relative">
          {/* THE LINE (Responsive Positioning) */}
          {/* Mobile: Left aligned (pl-8). Desktop: Centered. */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#d4af37]/30 to-transparent md:-translate-x-1/2" />

          <div className="space-y-12 md:space-y-0">
            {STEPS.map((step, index) => (
              <TimelineNode key={index} data={step} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineNode({ data, index }) {
  const isEven = index % 2 === 0;
  const Icon = data.icon;

  return (
    <div
      className={`relative flex items-start md:items-center 
        ${isEven ? "md:flex-row" : "md:flex-row-reverse"}
      `}
    >
      {/* --- THE CONTENT CARD --- */}
      {/* Mobile: Full width with left margin. Desktop: 45% width. */}
      <div className="ml-20 md:ml-0 md:w-[45%] group">
        <div className="p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#d4af37]/20 hover:bg-white/[0.04] transition-all duration-500 relative overflow-hidden">
          {/* Hover Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative z-10">
            <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4af37]/50 mb-3">
              Step 0{index + 1}
            </span>
            <h3 className="text-xl font-serif text-white mb-3 group-hover:text-[#d4af37] transition-colors duration-300">
              {data.title}
            </h3>
            <p className="text-white/50 text-sm leading-relaxed font-light">
              {data.desc}
            </p>
          </div>
        </div>
      </div>

      {/* --- THE NODE (ICON) --- */}
      {/* Mobile: Fixed left position. Desktop: Centered. */}
      <div className="absolute left-8 md:left-1/2 -translate-x-1/2 flex items-center justify-center mt-1 md:mt-0">
        {/* Outer Ring */}
        <div className="w-12 h-12 rounded-full bg-[#050505] border border-[#d4af37]/20 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,1)] z-10">
          {/* Inner Circle */}
          <div className="w-8 h-8 rounded-full bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37]">
            <Icon size={14} strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* --- SPACER FOR DESKTOP GRID --- */}
      <div className="hidden md:block md:w-[45%]" />
    </div>
  );
}
