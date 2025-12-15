"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Coins,
  Radio,
  Share2,
  ChevronRight,
  Lock,
  Unlock,
  Terminal,
} from "lucide-react";

// --- THE PROTOCOL DATA ---
const PHASES = [
  {
    id: "prep",
    title: "Phase I: The Blueprint",
    subtitle: "Manuscript Prep & Casting",
    icon: BookOpen,
    content: (
      <div className="space-y-4">
        <p>
          Great audiobooks aren't read; they are performed. Before a mic turns
          on, the manuscript must be analyzed for{" "}
          <strong>sonic architecture</strong>.
        </p>
        <ul className="space-y-3 mt-4">
          <li className="flex gap-3">
            <span className="text-[#d4af37] font-mono">01.</span>
            <span className="text-white/80">
              <strong>Character Archetypes:</strong> Don't just list names.
              Define the vocal texture. Is the antagonist gravelly? Is the love
              interest breathless? Create a "Casting Sheet" for your producer.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#d4af37] font-mono">02.</span>
            <span className="text-white/80">
              <strong>The Format Decision:</strong> Solo (Intimate), Dual
              (Romance Standard), or Duet (High Chemistry). Your genre dictates
              the format, not your budget.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#d4af37] font-mono">03.</span>
            <span className="text-white/80">
              <strong>Clean the Script:</strong> Remove visual cues that don't
              translate to audio. Ensure dialogue tags ("he said," "she said")
              aren't repetitive to the ear.
            </span>
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "budget",
    title: "Phase II: Resource Allocation",
    subtitle: "Investment vs. ROI",
    icon: Coins,
    content: (
      <div className="space-y-4">
        <p>
          Audio production is an investment asset. You generally have two paths
          to finance this asset, each with different long-term yields.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-2 text-[#d4af37]">
              <Lock size={16} />
              <h4 className="font-bold uppercase tracking-wider text-xs">
                Royalty Share
              </h4>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              <strong>Low Upfront Risk.</strong> You pay nothing now, but split
              royalties (usually 50/50) with the narrator/producer for 7 years.
              You lose long-term scaling revenue.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-white/5 border border-[#d4af37]/30">
            <div className="flex items-center gap-2 mb-2 text-[#d4af37]">
              <Unlock size={16} />
              <h4 className="font-bold uppercase tracking-wider text-xs">
                Pay for Production
              </h4>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              <strong>Maximum Asset Control.</strong> You pay a Per Finished
              Hour (PFH) rate. You own the masters 100%. You keep 100% of net
              royalties forever.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "prod",
    title: "Phase III: The Signal",
    subtitle: "Production Standards",
    icon: Radio,
    content: (
      <div className="space-y-4">
        <p>
          A great story is ruined by a noise floor louder than -60dB. Whether
          you hire a studio or DIY, the technical deliverables are
          non-negotiable.
        </p>
        <ul className="space-y-3 mt-4">
          <li className="flex gap-3">
            <span className="text-[#d4af37] font-mono">RMS:</span>
            <span className="text-white/80">
              Levels must average between -23dB and -18dB. Too quiet, and
              listeners in cars can't hear you. Too loud, and you clip
              (distortion).
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#d4af37] font-mono">Room Tone:</span>
            <span className="text-white/80">
              Pure silence feels unnatural. You need "Room Tone"—the sound of
              silence in a treated studio—to stitch edits seamlessly.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#d4af37] font-mono">QC:</span>
            <span className="text-white/80">
              Quality Control is the final firewall. Every second must be
              proofed for misreads, mouth clicks, and background noise before
              upload.
            </span>
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "distro",
    title: "Phase IV: Distribution",
    subtitle: "Going Wide vs. Exclusive",
    icon: Share2,
    content: (
      <div className="space-y-4">
        <p>
          The final strategic choice. Do you lock yourself into the biggest
          ecosystem, or cast a wide net?
        </p>
        <div className="space-y-4 mt-4">
          <div>
            <h4 className="text-white font-bold text-sm">
              The Exclusive Route (ACX/Audible)
            </h4>
            <p className="text-xs text-white/50 mt-1">
              Higher royalty rate (40%) on Audible, but you cannot sell your
              audiobook anywhere else (Spotify, Libraries, Direct) for 7 years.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm">
              The Wide Route (Findaway/Others)
            </h4>
            <p className="text-xs text-white/50 mt-1">
              Lower royalty rate on Audible (25%), but you gain access to 40+
              other retailers, library systems (Hoopla/Overdrive), and direct
              sales.
            </p>
          </div>
        </div>
      </div>
    ),
  },
];

export default function IndieAudioGuide() {
  const [activeTab, setActiveTab] = useState("prep");

  // Find active content
  const activeContent = PHASES.find((p) => p.id === activeTab);

  return (
    <section className="relative py-24 px-6 bg-[#050505] overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 w-[50vw] h-[50vh] bg-[#d4af37]/5 blur-[150px] rounded-full pointer-events-none -translate-y-1/2" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 border-b border-white/10 pb-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-4 opacity-70">
              <Terminal size={14} className="text-[#d4af37]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4af37]">
                Indie Resource
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif text-white">
              The Adaptation{" "}
              <span className="text-[#d4af37] italic">Protocol.</span>
            </h2>
            <p className="text-white/50 mt-4 text-lg font-light">
              A tactical guide to shifting your intellectual property from text
              to performance.
            </p>
          </div>
        </div>

        {/* --- INTERFACE DECK --- */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
          {/* LEFT: NAVIGATION (The Menu) */}
          <div className="flex flex-col gap-2">
            {PHASES.map((phase) => (
              <button
                key={phase.id}
                onClick={() => setActiveTab(phase.id)}
                className={`group flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-300
                            ${
                              activeTab === phase.id
                                ? "bg-white/10 border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.1)]"
                                : "bg-transparent border-white/5 hover:bg-white/5 hover:border-white/20"
                            }
                        `}
              >
                <div
                  className={`p-2 rounded-lg transition-colors ${
                    activeTab === phase.id
                      ? "bg-[#d4af37] text-black"
                      : "bg-white/5 text-white/50 group-hover:text-white"
                  }`}
                >
                  <phase.icon size={20} />
                </div>
                <div>
                  <h4
                    className={`text-sm font-bold transition-colors ${
                      activeTab === phase.id
                        ? "text-white"
                        : "text-white/60 group-hover:text-white"
                    }`}
                  >
                    {phase.title}
                  </h4>
                  <p className="text-[10px] uppercase tracking-wider text-white/30">
                    {phase.subtitle}
                  </p>
                </div>
                <ChevronRight
                  size={16}
                  className={`ml-auto transition-transform duration-300 ${
                    activeTab === phase.id
                      ? "translate-x-0 text-[#d4af37]"
                      : "-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* RIGHT: DATA DISPLAY (The Screen) */}
          <div className="relative min-h-[400px] rounded-3xl bg-[#0a0a0a] border border-white/10 overflow-hidden">
            {/* Screen Glare FX */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent" />

            <div className="relative z-10 p-8 md:p-12 h-full flex flex-col justify-center">
              {/* Animated Content Fade */}
              <div key={activeTab} className="animate-[fadeIn_0.5s_ease-out]">
                <div className="flex items-center gap-3 mb-6">
                  <activeContent.icon size={28} className="text-[#d4af37]" />
                  <h3 className="text-2xl md:text-3xl font-serif text-white">
                    {activeContent.title}
                  </h3>
                </div>

                <div className="text-lg text-white/70 font-light leading-relaxed">
                  {activeContent.content}
                </div>
              </div>
            </div>

            {/* Decorative Tech UI */}
            <div className="absolute bottom-6 right-6 text-[10px] font-mono text-white/20 uppercase tracking-widest">
              System_Status: Online
              <br />
              Module: {activeTab.toUpperCase()}
            </div>
          </div>
        </div>

        {/* --- BOTTOM: CINESONIC DISCLAIMER & CTA --- */}
        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-[#d4af37]/10 to-transparent border border-[#d4af37]/20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2">
            <h4 className="text-white font-bold text-lg">
              Our Production Model
            </h4>
            <p className="text-sm text-white/60 max-w-xl">
              CineSonic currently operates exclusively on a{" "}
              <strong>Pay-for-Production (Work for Hire)</strong> model. This
              ensures you retain 100% of your rights and royalties from day one.
              While we are exploring royalty-share partnerships for select
              backlists in the future, our current focus is on delivering asset
              ownership to the author.
            </p>
          </div>
          <Link
            href="/blog"
            className="shrink-0 px-6 py-3 bg-[#0a0a0a] border border-white/10 hover:border-[#d4af37] text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-all"
          >
            Read Full FAQ on the Blog
          </Link>
        </div>
      </div>

      {/* Animation Keyframes */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
