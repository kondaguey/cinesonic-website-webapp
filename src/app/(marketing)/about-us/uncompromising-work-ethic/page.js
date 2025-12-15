"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import {
  ShieldCheck,
  Target,
  Clock,
  Zap,
  ArrowRight,
  ChevronDown,
  Layers,
  Star,
  Quote,
} from "lucide-react";

// IMPORT THE NEW COMPONENT
import ActorCard from "../../../../components/marketing/ActorCard";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function WorkEthicPage() {
  return (
    <main className="relative min-h-screen w-full bg-[#050505] overflow-x-hidden selection:bg-[#d4af37]/30 font-sans">
      {/* ... (Background & Hero Sections remain exactly the same) ... */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[80vw] h-[80vh] bg-gradient-to-br from-[#d4af37]/5 to-transparent blur-[150px] rounded-full opacity-20" />
        <div className="absolute bottom-0 right-0 w-[60vw] h-[60vh] bg-indigo-950/10 blur-[150px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>

      <section className="relative z-10 pt-32 pb-20 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/10 bg-white/5 rounded-full mb-6">
          <ShieldCheck size={12} className="text-[#d4af37]" />
          <span className="text-[10px] tracking-[0.2em] uppercase text-white/60 font-medium">
            Our Philosophy
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-serif text-white tracking-tight leading-[1.1] mb-6">
          We are allergic to <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-white to-[#d4af37]">
            "good enough."
          </span>
        </h1>
        <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
          In an industry racing to the bottom with AI and shortcuts, we are
          running in the opposite direction.
        </p>
      </section>

      <section className="relative z-10 py-20 px-6 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <ValueCard
            icon={Target}
            title="Precision Casting"
            desc="We don't just fill a role. We find the soul."
          />
          <ValueCard
            icon={Clock}
            title="The Extra Mile"
            desc="We burn the hours so you don't burn your reputation."
          />
          <ValueCard
            icon={Zap}
            title="Sonic Obsession"
            desc="Silence is our canvas. We hunt noise with forensic intensity."
          />
        </div>
      </section>

      {/* --- 4. THE ROSTER SHOWCASE (Now using Component) --- */}
      <RosterSection />

      {/* ... (Testimonials, FAQ, CTA remain exactly the same) ... */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-10 md:p-14 rounded-[2rem] bg-[#0a0a0a] border border-white/5 text-center">
            <Quote className="absolute top-8 left-8 text-[#d4af37]/10 w-12 h-12" />
            <div className="relative z-10 space-y-6">
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={14}
                    className="fill-[#d4af37] text-[#d4af37]"
                  />
                ))}
              </div>
              <h3 className="text-xl md:text-3xl font-serif text-white leading-relaxed italic">
                "They treated my manuscript with more care than I expected. They
                acted like <span className="text-[#d4af37]">partners.</span>"
              </h3>
              <div>
                <p className="text-white font-bold uppercase tracking-widest text-xs">
                  Sarah J.
                </p>
                <p className="text-white/40 text-[10px]">
                  USA Today Bestselling Author
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-24 px-6 bg-white/[0.02] border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-2">
              Common <span className="italic text-[#d4af37]">Questions</span>
            </h2>
          </div>
          <div className="space-y-3">
            <FAQItem
              question="Do you use AI voices?"
              answer="Absolutely not. Human actors only."
            />
            <FAQItem question="Who owns the rights?" answer="You do. 100%." />
          </div>
        </div>
      </section>

      <section className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-serif text-white mb-8">
            Work with the <span className="text-[#d4af37]">obsessed.</span>
          </h2>
          <Link
            href="/projectform"
            className="inline-flex items-center gap-3 px-10 py-4 bg-[#d4af37] text-black font-bold text-sm uppercase tracking-widest rounded-full hover:bg-white transition-all duration-300"
          >
            Start Your Project <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}

// --- SUB-COMPONENTS ---
// ValueCard and FAQItem remain here for now as they are very specific to this page layout

function ValueCard({ icon: Icon, title, desc }) {
  return (
    <div className="group p-8 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-[#d4af37]/30 transition-colors duration-500">
      <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-[#d4af37] mb-6 group-hover:scale-110 transition-transform">
        <Icon size={20} />
      </div>
      <h3 className="text-xl font-serif text-white mb-3">{title}</h3>
      <p className="text-white/60 text-sm leading-relaxed font-light">{desc}</p>
    </div>
  );
}

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-xl bg-[#0a0a0a] overflow-hidden transition-all duration-300 hover:border-[#d4af37]/20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <span className="text-lg font-serif text-white/90">{question}</span>
        <ChevronDown
          size={20}
          className={`text-[#d4af37] transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="p-6 pt-0 text-white/60 text-sm leading-relaxed font-light">
          {answer}
        </p>
      </div>
    </div>
  );
}

// --- THE REFACTORED ROSTER SECTION ---
function RosterSection() {
  const [talent, setTalent] = useState([]);
  const [loading, setLoading] = useState(true);

  const parseTags = (input) => {
    if (!input) return [];
    if (Array.isArray(input)) return input;
    let str = String(input);
    str = str.replace(/[\[\]]/g, "");
    str = str.replace(/"/g, ",");
    return str
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from("actor_db")
        .select("*")
        .eq("status", "Active");
      if (data) {
        // Shuffle logic
        const shuffled = data
          .map((a) => ({
            ...a,
            final_voices: parseTags(a.voice_type),
          }))
          .sort(() => 0.5 - Math.random())
          .slice(0, 6);
        setTalent(shuffled);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="relative z-10 py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12 flex justify-between items-end">
        <div>
          <h2 className="text-3xl md:text-5xl font-serif text-white mb-2">
            Proof of <span className="text-[#d4af37] italic">Quality.</span>
          </h2>
          <p className="text-white/50 text-sm">
            Our roster represents the top 1% of applicants.
          </p>
        </div>
        <Link
          href="/roster"
          className="hidden md:flex items-center gap-2 text-[#d4af37] text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
        >
          View Full Roster <ArrowRight size={14} />
        </Link>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center border-y border-white/5 bg-white/[0.02]">
          <span className="text-[#d4af37] text-xs uppercase tracking-widest animate-pulse">
            Loading Talent...
          </span>
        </div>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-8 pt-4 px-6 snap-x snap-mandatory no-scrollbar">
          {/* 1. MAPPED ACTORS - USING NEW COMPONENT */}
          {talent.map((actor) => (
            <ActorCard
              key={actor.id}
              actor={actor}
              variant="default" // <--- Changing this to "reveal" later is effortless
              onClick={() => console.log("Open Modal Logic Here if needed")}
            />
          ))}

          {/* 2. STATIC 'SEE ALL' CARD */}
          <Link
            href="/roster"
            className="snap-center shrink-0 w-[260px] h-[360px] relative group bg-[#d4af37] rounded-xl overflow-hidden flex flex-col items-center justify-center text-center cursor-pointer hover:-translate-y-2 transition-transform shadow-lg"
          >
            <div className="relative z-10 p-6 text-black">
              <Layers size={40} className="mx-auto mb-4" />
              <h3 className="text-xl font-serif font-bold">See All</h3>
            </div>
          </Link>
        </div>
      )}
    </section>
  );
}
