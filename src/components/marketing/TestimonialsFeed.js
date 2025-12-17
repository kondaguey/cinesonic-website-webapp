"use client";
import React, { useRef } from "react";
import Link from "next/link";
import {
  Quote,
  Star,
  Feather,
  Mic2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import ParticleFx from "../ui/ParticleFx";

// --- DATA SOURCE ---
const TESTIMONIALS = [
  {
    author: "Eva Ashwood",
    role: "Bestselling Romance Author",
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
        "CineSonic was a joy to collaborate with. They prepared thoroughly and
        immersed themselves in the story so completely that it felt like they
        were living each scene. 20 distinct characters, handled flawlessly."
      </>
    ),
  },
  {
    author: "Elena Armas",
    role: "New York Times Bestseller",
    content: (
      <>
        "The production quality is simply unmatched. It isn't just narration; it
        is a full cinematic experience for the ears. The dual narration brought
        a depth I didn't know my manuscript had."
      </>
    ),
  },
  {
    author: "Indie Author Alliance",
    role: "Publication Review",
    content: (
      <>
        "Finally, a studio that treats indie authors with the same white-glove
        service as the big five publishers. The mastering was perfect on the
        first delivery."
      </>
    ),
  },
];

export default function TestimonialsFeed({ theme = "gold" }) {
  const scrollRef = useRef(null);

  // 1. LOCAL COLOR MAP
  const themeConfig = {
    gold: { hex: "#d4af37" },
    pink: { hex: "#ff3399" },
    fire: { hex: "#ff4500" },
    cyan: { hex: "#00f0ff" },
    system: { hex: "#3b82f6" },
  };

  const activeTheme = themeConfig[theme] || themeConfig.gold;
  const color = activeTheme.hex;

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === "left" ? -400 : 400;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section
      className="relative w-full bg-[#020010] overflow-hidden font-sans py-24 border-t border-white/5 group"
      // Dynamic text selection color
      style={{ "--selection-color": `${color}4D` }}
    >
      <style jsx>{`
        section ::selection {
          background-color: var(--selection-color);
          color: white;
        }
      `}</style>

      {/* --- 1. AMBIENT BACKGROUND --- */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Particles */}
        <div className="opacity-30">
          <ParticleFx variant="solo" count={6} color={color} />
        </div>

        <div className="absolute top-0 left-1/4 w-[50vw] h-[50vh] bg-[#0c0442]/20 blur-[150px] rounded-full" />
        <div
          className="absolute bottom-0 right-1/4 w-[60vw] h-[60vh] blur-[150px] rounded-full opacity-10 transition-colors duration-1000"
          style={{ backgroundColor: color }}
        />
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>

      {/* --- 2. HEADER --- */}
      <div className="relative z-10 px-6 mb-12 flex flex-col md:flex-row justify-between items-end gap-8 max-w-7xl mx-auto animate-fade-in-up">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/10 bg-white/5 rounded-full mb-6 transition-colors duration-500 hover:bg-white/10">
            <Feather
              size={12}
              style={{ color: color }}
              className="transition-colors duration-500"
            />
            <span className="text-[10px] tracking-[0.2em] uppercase text-white/60 font-medium">
              Partnerships
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-serif text-white tracking-tight leading-tight">
            Author{" "}
            <span
              className="italic transition-colors duration-500"
              style={{ color: color }}
            >
              Perspectives.
            </span>
          </h2>
        </div>

        {/* Carousel Controls */}
        <div className="flex gap-4">
          <button
            onClick={() => scroll("left")}
            className="p-3 rounded-full border border-white/10 bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-all hover:scale-110 active:scale-95"
            aria-label="Scroll Left"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-3 rounded-full border border-white/10 bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-all hover:scale-110 active:scale-95"
            aria-label="Scroll Right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* --- 3. REVIEWS CAROUSEL --- */}
      <div
        ref={scrollRef}
        className="relative z-10 flex gap-6 overflow-x-auto pb-12 px-6 max-w-7xl mx-auto custom-scrollbar snap-x snap-mandatory animate-fade-in-up"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          animationDelay: "100ms",
        }}
      >
        {TESTIMONIALS.map((item, index) => (
          <ReviewCard key={index} data={item} color={color} />
        ))}
      </div>

      {/* --- 4. CTA --- */}
      <div
        className="relative z-10 max-w-4xl mx-auto px-6 text-center mt-4 animate-fade-in-up"
        style={{ animationDelay: "200ms" }}
      >
        <Link
          href="/projectform"
          className="inline-flex items-center gap-3 px-8 py-4 text-black font-bold text-xs uppercase tracking-widest rounded-full hover:scale-105 transition-all duration-300 shadow-lg"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 30px ${color}33`,
          }}
        >
          Start Production <Mic2 size={16} />
        </Link>
      </div>
    </section>
  );
}

// --- UNIFIED CARD SUB-COMPONENT ---
function ReviewCard({ data, color }) {
  return (
    <div className="shrink-0 w-[85vw] md:w-[500px] snap-center relative p-8 md:p-10 rounded-2xl bg-[#0a0a0a] border border-white/5 transition-colors duration-500 group/card flex flex-col justify-between h-[350px] hover:bg-white/[0.02]">
      {/* Dynamic Border on Hover */}
      <div
        className="absolute inset-0 rounded-2xl border border-transparent group-hover/card:border-opacity-30 transition-colors duration-500 pointer-events-none"
        style={{ borderColor: color }}
      />

      {/* HEADER */}
      <div>
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/5">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                size={14}
                className="fill-current transition-colors duration-500"
                style={{ color: color }}
              />
            ))}
          </div>
          <Quote
            size={24}
            className="text-white/10 group-hover/card:text-white/30 transition-colors duration-500"
            fill="currentColor"
          />
        </div>

        {/* BODY */}
        <div className="text-base md:text-lg font-serif text-white/80 font-light leading-relaxed">
          {data.content}
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex flex-col pt-6 mt-auto">
        <h3 className="text-xs font-bold text-white uppercase tracking-widest">
          {data.author}
        </h3>
        <p
          className="text-xs mt-1 opacity-60 font-mono transition-colors duration-500"
          style={{ color: color }}
        >
          {data.role}
        </p>
      </div>
    </div>
  );
}
