"use client";
import React, { useState, useMemo } from "react";
import { Minus, Plus, Search, Sparkles } from "lucide-react";

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
}) {
  const [openIndex, setOpenIndex] = useState(0);
  const [query, setQuery] = useState("");

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
    <section className="relative py-32 px-6 bg-[#030303] overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* --- AMBIENCE --- */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle top light leak */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[200px] bg-gradient-to-b from-white/5 to-transparent blur-3xl opacity-30" />
        {/* Grain */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* HEADER AREA */}
        <div className="text-center mb-20">
          <div className="inline-flex justify-center mb-6">
            <Sparkles className="w-5 h-5 text-[#d4af37]/50" strokeWidth={1} />
          </div>

          <h2 className="text-3xl md:text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-white/20 mb-10 tracking-tight">
            {title}
          </h2>

          {/* Minimalist Search */}
          <div className="relative group max-w-sm mx-auto">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-transparent via-[#d4af37]/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-700 blur-md" />
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

function FAQItem({ item, isOpen, onClick }) {
  return (
    <div className="group border-b border-white/[0.06] last:border-0">
      <button
        onClick={onClick}
        className="w-full py-8 flex items-center justify-between gap-6 text-left focus:outline-none"
      >
        <h3
          className={`text-lg md:text-xl font-serif tracking-wide transition-all duration-500 ease-out
            ${
              isOpen
                ? "text-[#d4af37] text-shadow-sm" // Active state color
                : "text-white/60 group-hover:text-white/90" // Inactive state
            }`}
        >
          {item.q}
        </h3>

        {/* Minimalist Icon */}
        <div
          className={`shrink-0 text-white/20 transition-all duration-500 ${
            isOpen ? "rotate-180 text-[#d4af37]" : "group-hover:text-white/50"
          }`}
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
