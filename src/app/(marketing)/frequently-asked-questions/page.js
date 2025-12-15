"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Minus,
  HelpCircle,
  ShieldCheck,
  Mic2,
  Cpu,
  Coins,
  ArrowRight,
  X,
} from "lucide-react";

// --- THE KNOWLEDGE BASE (SEO GOLD) ---
const FAQ_DATA = [
  {
    category: "General Logistics",
    icon: HelpCircle,
    color: "#d4af37", // Gold
    items: [
      {
        q: "How long does the entire production process take?",
        a: "For a standard 50,000 to 80,000-word novel, the typical timeline is 4-6 weeks from the moment casting is finalized. This includes recording, editing, mixing, mastering, and final QC. We do offer a 'Rush Production' service (2-3 weeks) for tight launch windows.",
      },
      {
        q: "What do I need to provide to get started?",
        a: "We need your final, proofed manuscript (Word or PDF). We also ask for a brief 'Character Profile' sheet describing the voices, accents, and personalities of your main cast. If you have a specific tone in mind (e.g., 'Dark & Gritty' vs. 'Light & Fun'), let us know.",
      },
      {
        q: "Do you handle fiction and non-fiction?",
        a: "Yes. While we specialize in cinematic fiction (Romance, Sci-Fi, Fantasy, Thriller), we also produce high-impact non-fiction, memoirs, and business books using our Solo narration production tier.",
      },
    ],
  },
  {
    category: "Rights & Finance",
    icon: Coins,
    color: "#ff3399", // Pink
    items: [
      {
        q: "Who owns the copyright to the audio files?",
        a: "You do. 100%. CineSonic operates on a 'Work for Hire' basis. Once the final invoice is paid, all intellectual property rights transfer to you. We do not claim any ownership or future royalties.",
      },
      {
        q: "Do you take royalties or is it a flat fee?",
        a: "We charge a flat Per Finished Hour (PFH) production fee. We do not take a percentage of your sales. This model is generally more profitable for authors in the long run compared to royalty-share deals.",
      },
      {
        q: "What is 'Per Finished Hour' (PFH)?",
        a: "PFH refers to the length of the final audiobook, not the time spent in the studio. If your book is 10 hours long, you pay for 10 hours, regardless of whether it took us 20 or 50 hours to record and edit it.",
      },
    ],
  },
  {
    category: "Creative & Casting",
    icon: Mic2,
    color: "#ff4500", // Orange
    items: [
      {
        q: "Can I choose my narrator?",
        a: "Absolutely. We curate a shortlist of 3-5 perfectly matched voices from our roster for you to audition. You have the final say. If none of them fit, we go back to the drawing board until we find 'The One'.",
      },
      {
        q: "What if I don't like a specific character voice?",
        a: "We catch this early. During the first 15 minutes of recording (the 'First 15' checkpoint), we send you the file for approval. This is where you can tweak accents, tone, or pacing before we record the full book.",
      },
      {
        q: "Can you do Duet Narration (Real-time acting)?",
        a: "Yes. Duet is our specialty. Unlike Dual narration (where actors just read their own chapters), Duet involves actors recording strictly their character's dialogue lines, which are then stitched together for a seamless conversation. It is the most immersive format available.",
      },
    ],
  },
  {
    category: "Technical & Distribution",
    icon: ShieldCheck,
    color: "#00f0ff", // Cyan
    items: [
      {
        q: "Will these files work on Audible/ACX?",
        a: "Yes. We guarantee our files pass ACX technical requirements. We deliver high-quality MP3s (192kbps or higher), mastered to -23dB to -18dB RMS with a -60dB noise floor.",
      },
      {
        q: "Do you upload the files for me?",
        a: "We deliver the retail-ready files to you via a secure download link. While we don't log into your ACX/KDP account for security reasons, we provide a step-by-step 'Upload Guide' that makes the process foolproof.",
      },
      {
        q: "What about Spotify and Findaway Voices?",
        a: "Our files are compatible with every major distributor, including Findaway Voices, Spotify, Author's Direct, Kobo, and libraries (Overdrive/Hoopla).",
      },
    ],
  },
];

export default function FAQPage() {
  const [query, setQuery] = useState("");
  const [openItems, setOpenItems] = useState({}); // Track multiple open items

  // --- 1. SEARCH LOGIC (THE BRAIN) ---
  const filteredData = useMemo(() => {
    if (!query) return FAQ_DATA;

    const lowerQ = query.toLowerCase();

    // Deep filter: Check categories AND items
    return FAQ_DATA.map((section) => {
      const matchingItems = section.items.filter(
        (item) =>
          item.q.toLowerCase().includes(lowerQ) ||
          item.a.toLowerCase().includes(lowerQ)
      );

      if (matchingItems.length > 0) {
        return { ...section, items: matchingItems };
      }
      return null;
    }).filter(Boolean); // Remove empty sections
  }, [query]);

  // Toggle Function
  const toggleItem = (categoryIndex, itemIndex) => {
    const key = `${categoryIndex}-${itemIndex}`;
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // --- 2. SEO INJECTION (THE ENGINE) ---
  // Flattens the data for Google's schema
  const allQuestions = FAQ_DATA.flatMap((cat) => cat.items);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allQuestions.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#d4af37]/30">
      {/* 🟢 SEO SCHEMA HEAD INJECTION */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* --- BACKGROUND --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-[#1a1a1a] to-[#050505]" />
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80vw] h-[60vh] bg-[#d4af37]/5 blur-[150px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
      </div>

      {/* --- HERO & SEARCH --- */}
      <section className="relative z-10 pt-40 pb-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-8 tracking-tight">
            Production{" "}
            <span className="text-[#d4af37] italic">Intelligence.</span>
          </h1>
          <p className="text-white/60 text-lg mb-12 max-w-2xl mx-auto">
            Everything you need to know about adapting your manuscript into a
            cinematic audio experience.
          </p>

          {/* OMNI-SEARCH BAR */}
          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#d4af37]/0 via-[#d4af37]/30 to-[#d4af37]/0 rounded-full blur-md opacity-0 group-hover:opacity-100 transition duration-700" />
            <div className="relative flex items-center bg-[#0a0a0a] border border-white/10 rounded-full px-6 py-4 focus-within:border-[#d4af37] transition-all shadow-2xl">
              <Search size={20} className="text-white/30 mr-4" />
              <input
                type="text"
                placeholder="Search 'royalties', 'timeline', 'distribution'..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-white placeholder:text-white/30 focus:outline-none text-lg"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={16} className="text-white/50" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* --- CONTENT AREA --- */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pb-40">
        {/* NO RESULTS STATE */}
        {filteredData.length === 0 && (
          <div className="text-center py-20 border border-white/5 rounded-3xl bg-white/[0.02]">
            <p className="text-white/40 text-lg">
              We couldn't find an answer for "{query}".
            </p>
            <Link
              href="/contact"
              className="text-[#d4af37] font-bold mt-4 inline-block hover:underline"
            >
              Ask us directly &rarr;
            </Link>
          </div>
        )}

        {/* CATEGORY LOOP */}
        <div className="space-y-16">
          {filteredData.map((section, catIndex) => (
            <div key={catIndex} className="animate-fade-in-up">
              {/* Section Header */}
              <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-4">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <section.icon size={24} style={{ color: section.color }} />
                </div>
                <h2 className="text-2xl md:text-3xl font-serif text-white">
                  {section.category}
                </h2>
              </div>

              {/* Questions Grid */}
              <div className="grid grid-cols-1 gap-4">
                {section.items.map((item, itemIndex) => {
                  // Unique ID for state tracking
                  const isOpen = query
                    ? true
                    : openItems[`${catIndex}-${itemIndex}`];

                  return (
                    <div
                      key={itemIndex}
                      onClick={() => toggleItem(catIndex, itemIndex)}
                      className={`group rounded-2xl border overflow-hidden cursor-pointer transition-all duration-500
                                ${
                                  isOpen
                                    ? "bg-white/5 border-white/10"
                                    : "bg-transparent border-white/5 hover:border-white/20 hover:bg-white/[0.02]"
                                }
                             `}
                      style={{
                        borderColor: isOpen ? `${section.color}50` : "",
                      }}
                    >
                      <div className="p-6 md:p-8">
                        <div className="flex justify-between items-start gap-6">
                          <h3
                            className={`text-lg md:text-xl font-medium transition-colors ${
                              isOpen
                                ? "text-white"
                                : "text-white/70 group-hover:text-white"
                            }`}
                          >
                            {item.q}
                          </h3>
                          <div
                            className={`shrink-0 mt-1 transition-transform duration-300 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          >
                            {isOpen ? (
                              <Minus
                                size={20}
                                style={{ color: section.color }}
                              />
                            ) : (
                              <Plus size={20} className="text-white/30" />
                            )}
                          </div>
                        </div>

                        <div
                          className={`grid transition-[grid-template-rows] duration-500 ${
                            isOpen ? "grid-rows-[1fr] pt-4" : "grid-rows-[0fr]"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <p className="text-white/60 leading-relaxed font-light text-base md:text-lg border-t border-white/5 pt-4">
                              {item.a}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- FOOTER CTA --- */}
      <section className="relative z-10 py-24 border-t border-white/10 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">
            Still have questions?
          </h2>
          <p className="text-white/50 mb-10 text-lg">
            Our production team is standing by to discuss your specific
            manuscript.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 px-10 py-4 bg-[#d4af37] text-black font-bold uppercase tracking-widest rounded-full hover:bg-white hover:scale-105 transition-all shadow-[0_0_40px_rgba(212,175,55,0.3)]"
          >
            Start a Conversation <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
