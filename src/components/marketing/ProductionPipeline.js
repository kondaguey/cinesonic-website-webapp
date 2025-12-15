"use client";
import React from "react";
import { Mic, FileText, Headphones, Send, Sparkles } from "lucide-react";

const STEPS = [
  {
    icon: FileText,
    title: "Onboarding & Script Prep",
    desc: "We analyze your manuscript, create pronunciation guides, and define the character archetypes.",
  },
  {
    icon: Mic,
    title: "Casting & Auditions",
    desc: "We source talent from our elite roster. You receive audition tapes to approve the perfect voice.",
  },
  {
    icon: Headphones,
    title: "Principal Photography",
    desc: "Production begins. Our directors guide the talent through every chapter to ensure emotional resonance.",
  },
  {
    icon: Sparkles,
    title: "Post-Production (Cinematic)",
    desc: "Editing, mixing, and mastering. We remove breaths, clicks, and noise, hitting -60dB noise floor standards.",
  },
  {
    icon: Send,
    title: "Delivery & Launch",
    desc: "You receive retail-ready files formatted for ACX, Audible, and Spotify. Ready for upload.",
  },
];

export default function ProductionPipeline() {
  return (
    <section className="py-24 px-6 bg-[#050505]">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">
            From Page to <span className="text-[#d4af37]">Performance.</span>
          </h2>
          <p className="text-white/50">
            Our rigorous 5-step production standard.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* The Vertical Line (Gold Gradient) */}
          <div className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#d4af37]/50 to-transparent -translate-x-1/2" />

          {/* Steps */}
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
      className={`relative flex items-center md:justify-between ${
        isEven ? "md:flex-row" : "md:flex-row-reverse"
      }`}
    >
      {/* CONTENT SIDE */}
      <div className="ml-16 md:ml-0 md:w-[45%] p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-[#d4af37]/30 transition-colors group">
        <h3 className="text-xl font-serif text-white mb-2 group-hover:text-[#d4af37] transition-colors">
          {index + 1}. {data.title}
        </h3>
        <p className="text-white/60 text-sm leading-relaxed">{data.desc}</p>
      </div>

      {/* CENTER NODE (The Dot) */}
      <div className="absolute left-[27px] md:left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-[#050505] border border-[#d4af37]/30 flex items-center justify-center z-10 shadow-[0_0_20px_rgba(0,0,0,1)]">
        <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 flex items-center justify-center">
          <Icon size={18} className="text-[#d4af37]" />
        </div>
      </div>

      {/* EMPTY SPACER SIDE (Desktop only) */}
      <div className="hidden md:block md:w-[45%]" />
    </div>
  );
}
