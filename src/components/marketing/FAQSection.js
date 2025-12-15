"use client";
import React, { useState, useMemo } from "react";
import { Plus, Minus, HelpCircle, Search, X } from "lucide-react";

// Default data (Fallback)
const DEFAULT_FAQS = [
  {
    q: "How long does production take?",
    a: "For a standard 50,000-word novel, our turnaround is typically 4-6 weeks after casting is finalized. Expedited 'Rush Production' is available for strict launch deadlines.",
  },
  {
    q: "Do I own the rights to the audio?",
    a: "100%. You own the master files and the copyright. We work on a 'Work for Hire' basis. We take no royalties, ensuring you keep every cent of your sales.",
  },
  {
    q: "Can I approve the narrator?",
    a: "Absolutely. We provide a curated shortlist of auditions based on your character profiles. You have the final say on the voice of your brand.",
  },
  {
    q: "What technical standards do you meet?",
    a: "We master to ACX/Audible, Findaway Voices, and Spotify standards (RMS -23dB to -18dB, -3dB peak, -60dB noise floor). Your files are retail-ready upon delivery.",
  },
  {
    q: "Do you handle distribution?",
    a: "We are a production house, not a distributor. However, we provide a comprehensive 'Launch Guide' that walks you through uploading your files to ACX, IngramSpark, and other platforms.",
  },
];

export default function FAQSection({
  title = "Common Questions",
  subtitle = "Production Intelligence",
  data = DEFAULT_FAQS,
}) {
  const [openIndex, setOpenIndex] = useState(0);
  const [query, setQuery] = useState("");

  // --- 1. SEARCH LOGIC ---
  const filteredData = useMemo(() => {
    if (!query) return data;
    const lowerQuery = query.toLowerCase();
    return data.filter(
      (item) =>
        item.q.toLowerCase().includes(lowerQuery) ||
        item.a.toLowerCase().includes(lowerQuery)
    );
  }, [query, data]);

  // --- 2. SEO MAGIC (JSON-LD SCHEMA) ---
  // This generates the code Google needs to give you Rich Snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <section className="relative py-24 px-6 bg-[#050505] overflow-hidden border-t border-white/5">
      {/* 🟢 INJECT SEO SCHEMA INTO HEAD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vh] bg-[#d4af37]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* HEADER */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 opacity-70">
            <HelpCircle size={14} className="text-[#d4af37]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4af37]">
              {subtitle}
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif text-white mb-8">
            {title}
          </h2>

          {/* --- 3. SEARCH BAR --- */}
          <div className="relative max-w-md mx-auto group">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#d4af37]/0 via-[#d4af37]/20 to-[#d4af37]/0 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-500" />

            <div className="relative flex items-center bg-[#0a0a0a] border border-white/10 rounded-full px-4 py-3 focus-within:border-[#d4af37]/50 focus-within:shadow-[0_0_20px_rgba(212,175,55,0.1)] transition-all">
              <Search size={18} className="text-white/30 mr-3" />
              <input
                type="text"
                placeholder="Search answers..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-white placeholder:text-white/30 focus:outline-none text-sm"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X size={14} className="text-white/50" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* QUESTIONS LIST */}
        <div className="space-y-4 min-h-[300px]">
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => {
              // If user is searching, FORCE OPEN everything (better UX)
              // If not searching, use normal accordion behavior
              const isOpen = query ? true : openIndex === index;

              return (
                <FAQItem
                  key={index}
                  item={item}
                  isOpen={isOpen}
                  isSearching={!!query}
                  onClick={() =>
                    !query && setOpenIndex(openIndex === index ? null : index)
                  }
                />
              );
            })
          ) : (
            // No Results State
            <div className="text-center py-12 text-white/30 italic">
              No answers found for "{query}".
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// --- INDIVIDUAL ITEM ---
function FAQItem({ item, isOpen, onClick, isSearching }) {
  return (
    <div
      onClick={onClick}
      className={`group relative rounded-2xl border transition-all duration-500 overflow-hidden
            ${
              isOpen
                ? "bg-white/5 border-[#d4af37]/30 shadow-[0_0_30px_rgba(212,175,55,0.05)]"
                : "bg-transparent border-white/5 hover:border-white/10 hover:bg-white/[0.02] cursor-pointer"
            }
        `}
    >
      {/* Glow Line on Active */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 bg-[#d4af37] transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between gap-6">
          <h3
            className={`text-lg md:text-xl font-serif transition-colors duration-300 ${
              isOpen ? "text-white" : "text-white/70 group-hover:text-white"
            }`}
          >
            {item.q}
          </h3>

          {/* Hide toggle icon if searching (since we force open) */}
          {!isSearching && (
            <div
              className={`shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300
                        ${
                          isOpen
                            ? "border-[#d4af37] bg-[#d4af37] text-black rotate-180"
                            : "border-white/10 text-white/50 group-hover:border-white/30"
                        }
                    `}
            >
              {isOpen ? <Minus size={14} /> : <Plus size={14} />}
            </div>
          )}
        </div>

        {/* Answer (Animated Height) */}
        <div
          className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            isOpen
              ? "grid-rows-[1fr] pt-4 opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <p className="text-white/60 leading-relaxed font-light text-base md:text-lg">
              {item.a}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
