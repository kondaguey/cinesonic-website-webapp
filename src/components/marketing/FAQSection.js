"use client";
import React, { useState, useMemo } from "react";
import { Minus, Plus, Search, Sparkles } from "lucide-react";
import ParticleFx from "../ui/ParticleFx";

const DEFAULT_FAQS = [
  {
    q: "How long is the journey?",
    a: "For a standard 50,000-word manuscript, the transformation takes 4-6 weeks after casting. We prioritize precision over speed, though expedited timelines are available for critical launches.",
  },
  {
    q: "Who holds the rights?",
    a: "You do. Exclusively. We operate as a silent partner—a 'Work for Hire' studio. You retain 100% of your master files, copyright, and royalties. We simply provide the vessel.",
  },
  {
    q: "Do I choose the voice?",
    a: "The voice is the soul of the book. We curate a shortlist of elite narrators tailored to your tone, but the final selection is yours alone.",
  },
  {
    q: "Is it retail-ready?",
    a: "Flawless. We master to ACX, Findaway, and Spotify strictures (RMS -23dB to -18dB, -60dB noise floor). Your files arrive polished, tagged, and ready for the world.",
  },
  {
    q: "How do I distribute?",
    a: "We craft the asset; you control the distribution. While we don't upload for you, our 'Launch Architecture' guide provides a step-by-step blueprint for all major platforms.",
  },
];

export default function FAQSection({
  title = "Curiosities",
  data = DEFAULT_FAQS,
  theme = "gold", // Accepts theme name
}) {
  const [openIndex, setOpenIndex] = useState(0);
  const [query, setQuery] = useState("");

  // 1. LOCAL COLOR MAP
  const themeConfig = {
    gold: { hex: "#d4af37", glow: "from-[#d4af37]/20" },
    pink: { hex: "#ff3399", glow: "from-[#ff3399]/20" },
    fire: { hex: "#ff4500", glow: "from-[#ff4500]/20" },
    cyan: { hex: "#00f0ff", glow: "from-[#00f0ff]/20" },
    system: { hex: "#3b82f6", glow: "from-[#3b82f6]/20" },
  };

  const activeTheme = themeConfig[theme] || themeConfig.gold;
  const color = activeTheme.hex;

  const filteredData = useMemo(() => {
    if (!query) return data;
    const lowerQuery = query.toLowerCase();
    return data.filter(
      (item) =>
        item.q.toLowerCase().includes(lowerQuery) ||
        item.a.toLowerCase().includes(lowerQuery)
    );
  }, [query, data]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <section className="relative py-32 px-6 bg-[#030303] overflow-hidden group">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* --- AMBIENCE --- */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 1. Subtle Background Particles */}
        <div className="opacity-30">
          <ParticleFx variant="solo" count={8} color={color} />
        </div>

        {/* 2. Top Light Leak - Tinted with Theme */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] blur-[100px] opacity-20 transition-colors duration-1000"
          style={{
            backgroundImage: `linear-gradient(to bottom, ${color}, transparent)`,
          }}
        />

        {/* 3. Grain */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* HEADER AREA */}
        <div className="text-center mb-20 animate-fade-in-up">
          <div className="inline-flex justify-center mb-6">
            <Sparkles
              className="w-5 h-5 opacity-60 transition-colors duration-500"
              style={{ color: color }}
              strokeWidth={1}
            />
          </div>

          <h2 className="text-3xl md:text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-white/20 mb-10 tracking-tight drop-shadow-lg">
            {title}
          </h2>

          {/* Minimalist Search */}
          <div className="relative group/search max-w-sm mx-auto">
            {/* Dynamic Glow on Hover */}
            <div
              className="absolute -inset-0.5 opacity-0 group-hover/search:opacity-100 transition duration-700 blur-md rounded-full"
              style={{
                background: `linear-gradient(to right, transparent, ${color}33, transparent)`,
              }}
            />
            <div className="relative flex items-center bg-white/[0.03] border border-white/5 rounded-full px-5 py-3 transition-colors focus-within:bg-white/[0.05] focus-within:border-white/10">
              <Search size={16} className="text-white/20 mr-4" />
              <input
                type="text"
                placeholder="Search the archives..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-white/80 placeholder:text-white/20 focus:outline-none text-sm tracking-wide font-light"
              />
            </div>
          </div>
        </div>

        {/* ACCORDION LIST */}
        <div className="space-y-0">
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => {
              const isOpen = query ? true : openIndex === index;
              return (
                <FAQItem
                  key={index}
                  item={item}
                  isOpen={isOpen}
                  color={color}
                  onClick={() =>
                    !query && setOpenIndex(openIndex === index ? null : index)
                  }
                />
              );
            })
          ) : (
            <div className="text-center py-12 text-white/20 font-serif italic tracking-wide">
              silence...
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ item, isOpen, onClick, color }) {
  return (
    <div className="group/item border-b border-white/[0.06] last:border-0 animate-fade-in-up">
      <button
        onClick={onClick}
        className="w-full py-8 flex items-center justify-between gap-6 text-left focus:outline-none"
      >
        <h3
          className={`text-lg md:text-xl font-serif tracking-wide transition-all duration-500 ease-out
            ${
              isOpen
                ? "text-shadow-sm scale-[1.01]"
                : "text-white/60 group-hover/item:text-white/90"
            }`}
          style={{
            color: isOpen ? color : undefined,
            // If closed, let Tailwind handle the gray/white colors
          }}
        >
          {item.q}
        </h3>

        {/* Minimalist Icon */}
        <div
          className={`shrink-0 transition-all duration-500 ${
            isOpen
              ? "rotate-180"
              : "group-hover/item:text-white/50 text-white/20"
          }`}
          style={{ color: isOpen ? color : undefined }}
        >
          {isOpen ? (
            <Minus size={14} strokeWidth={1} />
          ) : (
            <Plus size={14} strokeWidth={1} />
          )}
        </div>
      </button>

      {/* Answer Area */}
      <div
        className={`grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen
            ? "grid-rows-[1fr] opacity-100 pb-8"
            : "grid-rows-[0fr] opacity-0 pb-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-white/40 font-light leading-relaxed text-base md:text-lg max-w-[90%]">
            {item.a}
          </p>
        </div>
      </div>
    </div>
  );
}
