"use client";
import React from "react";
import Link from "next/link";
import { Quote, Star, Feather, Mic2 } from "lucide-react";

// --- DATA SOURCE ---
const TESTIMONIALS = [
  {
    author: "Eva Ashwood",
    role: "Bestselling Author",
    content: (
      <>
        "CineSonic did a fantastic job bringing my books to life. They handled
        multiple voices seamlessly and delivered a strong, engaging performance.
        A pleasure to work with from start to finish!"
      </>
    ),
  },
  {
    author: "Jim Christ",
    role: 'Author of "Right There in Black and White"',
    content: (
      <>
        <p>
          Fellow authors, if you’re looking for a professional production team
          to create your audiobook, you should give strong consideration to
          working with <span className="text-white font-medium">CineSonic</span>
          .
        </p>
        <p>
          They did an outstanding job producing my last novel. It was a true
          performance, with the talent acting out over{" "}
          <span className="text-white font-medium">20 distinct characters</span>
          , many of them with strong accents.
        </p>
        <p>
          They prepared thoroughly and immersed themselves in the story so
          completely that it felt like they were living each scene. The
          attention to detail, emotional range, and ability to shift seamlessly
          between voices brought the book to life in a way I hadn’t imagined
          possible.
        </p>
        <p className="text-[#d4af37]">
          "CineSonic was also a joy to collaborate with—professional,
          communicative, and genuinely passionate about the craft."
        </p>
      </>
    ),
  },
];

export default function TestimonialsFeed() {
  return (
    <section className="relative w-full bg-[#050505] overflow-hidden selection:bg-[#d4af37]/30 font-sans">
      {/* --- 1. AMBIENT BACKGROUND --- */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[50vw] h-[50vh] bg-indigo-950/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[60vw] h-[60vh] bg-[#d4af37]/5 blur-[150px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>

      {/* --- 2. HEADER --- */}
      <div className="relative z-10 pt-24 pb-16 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/10 bg-white/5 rounded-full mb-6">
          <Feather size={12} className="text-[#d4af37]" />
          <span className="text-[10px] tracking-[0.2em] uppercase text-white/60 font-medium">
            Partnerships
          </span>
        </div>

        <h2 className="text-4xl md:text-5xl font-serif text-white tracking-tight leading-tight mb-4">
          Author <span className="text-[#d4af37] italic">Perspectives.</span>
        </h2>
        <p className="text-white/50 text-base md:text-lg max-w-xl mx-auto font-light leading-relaxed">
          The trust between an author and a production team is sacred.
          <br />
          Here is what happens when that trust is earned.
        </p>
      </div>

      {/* --- 3. REVIEWS LIST --- */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 pb-24 space-y-8">
        {TESTIMONIALS.map((item, index) => (
          <ReviewCard key={index} data={item} />
        ))}
      </div>

      {/* --- 4. CTA --- */}
      <div className="relative z-10 py-20 border-t border-white/5 bg-black/20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-serif text-white mb-8">
            Ready to adapt <span className="text-[#d4af37] italic">your</span>{" "}
            manuscript?
          </h2>
          <Link
            href="/projectform"
            className="inline-flex items-center gap-3 px-8 py-3 bg-[#d4af37] text-black font-bold text-xs uppercase tracking-widest rounded-full hover:bg-white transition-colors duration-300 shadow-lg shadow-[#d4af37]/10"
          >
            Start Production <Mic2 size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// --- UNIFIED CARD SUB-COMPONENT ---
function ReviewCard({ data }) {
  return (
    <div className="w-full relative p-8 md:p-12 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-[#d4af37]/20 transition-colors duration-500 group">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} size={16} className="text-[#d4af37] fill-[#d4af37]" />
          ))}
        </div>
        <Quote
          size={24}
          className="text-[#d4af37]/20 group-hover:text-[#d4af37]/40 transition-colors duration-500"
          fill="currentColor"
        />
      </div>

      {/* BODY */}
      <div className="mb-8 text-base md:text-lg font-sans text-white/70 font-light leading-relaxed space-y-4">
        {data.content}
      </div>

      {/* FOOTER */}
      <div className="flex flex-col pt-2">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest">
          {data.author}
        </h3>
        <p className="text-[#d4af37] text-xs mt-1">{data.role}</p>
      </div>
    </div>
  );
}
