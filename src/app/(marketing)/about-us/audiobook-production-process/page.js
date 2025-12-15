"use client";
import React from "react";
import Link from "next/link";
import {
  FileText,
  Cpu,
  CalendarCheck,
  BookOpen,
  Mic2,
  Sliders,
  CheckCircle,
  Rocket,
  Megaphone,
} from "lucide-react";

// --- THE PIPELINE DATA ---
const steps = [
  {
    title: "Inquiry & Vision",
    subtitle: "Phase 01",
    description:
      "It starts with the script. You submit your project details via our secure portal. We analyze your genre, tone, and specific requirements to understand the core of the work.",
    icon: FileText,
    action: "LinkToForm",
  },
  {
    title: "The CREW Protocol",
    subtitle: "Phase 02",
    description:
      "Within 48 hours, our proprietary CREW software scans our roster of elite contractors. We generate a custom proposal with perfect casting matches—not just available talent, but the right talent.",
    icon: Cpu,
  },
  {
    title: "Greenlight & Schedule",
    subtitle: "Phase 03",
    description:
      "We strike the deal. A deposit secures your slot in our production calendar. No ambiguity—just a locked timeline, a signed agreement, and a shared mission.",
    icon: CalendarCheck,
  },
  {
    title: "Manuscript Prep",
    subtitle: "Phase 04",
    description:
      "You send the manuscript. Our prep team combs through it, creating a pronunciation guide and character bible before the actor ever sees a page to ensure total accuracy.",
    icon: BookOpen,
  },
  {
    title: "Principal Photography",
    subtitle: "Phase 05",
    description:
      "The talent enters the booth. We record with industry-leading hardware. You receive raw samples early to ensure the tone is locked in before we commit to the full read.",
    icon: Mic2,
  },
  {
    title: "Sonic Alchemy",
    subtitle: "Phase 06",
    description:
      "Post-production magic. Editing, mixing, and mastering. We clean the noise, balance the levels, and add sound design if the genre demands it.",
    icon: Sliders,
  },
  {
    title: "Review & Refine",
    subtitle: "Phase 07",
    description:
      "Delivery of the master files. You review the audio. If tweaks are needed, we handle the pickups swiftly. We don't stop until you approve every second.",
    icon: CheckCircle,
  },
  {
    title: "Final Push",
    subtitle: "Phase 08",
    description:
      "Final retail-ready files are delivered. We guide you on the upload process to ACX/Findaway, ensuring a flawless launch day.",
    icon: Rocket,
  },
];

export default function ProductionProcess() {
  return (
    <main className="relative min-h-screen w-full bg-[#050505] overflow-x-hidden selection:bg-[#d4af37]/30 font-sans">
      {/* --- 1. AMBIENT BACKGROUND --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[60vw] h-[60vh] bg-indigo-950/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[60vw] h-[60vh] bg-[#d4af37]/5 blur-[150px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>

      {/* --- 2. HEADER --- */}
      <section className="relative z-10 pt-32 pb-16 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-[#d4af37]/30 bg-[#d4af37]/5 backdrop-blur-md rounded-full mb-8 shadow-[0_0_15px_-3px_rgba(212,175,55,0.2)]">
          <Sliders size={14} className="text-[#d4af37]" />
          <span className="text-[11px] tracking-[0.3em] uppercase text-[#d4af37] font-bold">
            Workflow Visualization
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-serif text-white tracking-tight leading-none drop-shadow-2xl mb-6">
          From Manuscript <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728]">
            To Masterpiece.
          </span>
        </h1>
        <p className="text-white/60 text-lg max-w-2xl mx-auto font-light leading-relaxed">
          A rigid, battle-tested pipeline powered by proprietary tech and human
          artistry.
        </p>
      </section>

      {/* --- 3. THE PARALLEL MARKETING TRACKER --- */}
      <div className="fixed bottom-0 left-0 w-full z-40 pointer-events-none">
        <div className="w-full bg-gradient-to-t from-black via-black/95 to-transparent pt-16 pb-6 px-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between border-t border-[#d4af37]/20 pt-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-[#d4af37] blur-sm animate-ping opacity-50 rounded-full" />
                <Megaphone size={22} className="text-[#d4af37] relative z-10" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-[#d4af37] font-bold">
                  Parallel Track
                </div>
                <div className="text-sm md:text-base text-white/90 font-serif">
                  Marketing Strategy Active
                </div>
              </div>
            </div>
            <div className="hidden md:block text-xs text-white/50 font-mono">
              // We are building hype while we build the audio.
            </div>
          </div>
        </div>
      </div>

      {/* --- 4. THE PIPELINE --- */}
      <div className="relative w-full max-w-5xl mx-auto px-6 md:px-12 pb-48">
        {/* === SPINE (The Signal Flow) === */}
        <div className="fixed left-6 md:left-1/2 top-0 bottom-0 w-px md:w-[2px] md:-translate-x-1/2 z-0">
          <div className="w-full h-full bg-[#d4af37]/10" />
          <div className="absolute top-0 left-0 w-full h-[30vh] bg-gradient-to-b from-transparent via-[#d4af37] to-transparent animate-scan-slow opacity-50" />
        </div>

        {/* === STEPS LOOP === */}
        {/* Adjusted spacing to space-y-8 to accommodate larger boxes without overlapping */}
        <div className="relative z-10 space-y-8 pt-8">
          {steps.map((step, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={index}
                className={`flex flex-col md:flex-row items-center w-full ${
                  isEven ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* SPACER */}
                <div className="hidden md:block w-1/2" />

                {/* CONNECTION DOT */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-3 h-3 bg-[#050505] border border-[#d4af37] rounded-full z-20 shadow-[0_0_10px_#d4af37]">
                  <div className="absolute inset-0 bg-[#d4af37] animate-ping opacity-20 rounded-full" />
                </div>

                {/* CONTENT HALF */}
                <div
                  className={`w-full md:w-1/2 flex ${
                    isEven ? "justify-start md:pl-12" : "justify-end md:pr-12"
                  }`}
                >
                  {/* THE CARD */}
                  <div className="w-full max-w-lg pl-8 md:pl-0">
                    <div
                      className="group relative p-8 rounded-[1.5rem] overflow-hidden
                                    bg-[#0a0a0a]/90 backdrop-blur-2xl
                                    border border-[#d4af37]/10
                                    transition-all duration-500 ease-out
                                    hover:border-[#d4af37]/40 
                                    hover:bg-black
                                    hover:shadow-[0_0_30px_-10px_rgba(212,175,55,0.15)]
                                    hover:-translate-y-1"
                    >
                      <div className="relative z-10 flex flex-col gap-5">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-[#d4af37]/10 text-[#d4af37]">
                              <step.icon size={22} />
                            </div>
                            <span className="text-[#d4af37] text-xs font-bold uppercase tracking-widest">
                              {step.subtitle}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {/* Larger Title */}
                          <h3 className="text-2xl md:text-3xl font-serif text-white group-hover:text-[#d4af37] transition-colors duration-300">
                            {step.title}
                          </h3>
                          {/* Larger, Higher Contrast Description */}
                          <p className="text-base md:text-lg text-white/70 font-light leading-relaxed">
                            {step.description}
                          </p>
                        </div>

                        {/* SPECIAL ACTION BUTTON (For Step 1) */}
                        {step.action === "LinkToForm" && (
                          <Link
                            href="/projectform"
                            className="mt-2 inline-flex items-center justify-center w-full py-4 bg-[#d4af37] text-black font-bold text-sm uppercase tracking-widest rounded-xl hover:bg-white transition-colors duration-300 shadow-lg shadow-[#d4af37]/20"
                          >
                            Start The Process
                          </Link>
                        )}
                      </div>

                      {/* Gold Bar Accent */}
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
