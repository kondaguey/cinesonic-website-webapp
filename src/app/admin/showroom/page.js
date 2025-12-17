"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// ICONS
import {
  Mic,
  Heart,
  Flame,
  Rocket,
  Palette,
  Type,
  Shield,
  Droplet,
  Sparkles,
  Zap,
  Settings,
  ChevronDown,
} from "lucide-react";

// --- 1. UI ATOMS ---
import Badge from "../../../components/ui/Badge";
import SectionHeader from "../../../components/ui/SectionHeader";
import ParticleFx from "../../../components/ui/ParticleFx";
import Button from "../../../components/ui/Button";

// --- 2. ROSTER COMPONENTS ---
import ActorCard from "../../../components/marketing/ActorCard";
import ActorModal from "../../../components/marketing/ActorModal";
import MainRoster from "../../../components/marketing/MainRoster";
import RosterPreview from "../../../components/marketing/RosterPreview";

// --- 3. MARKETING COMPONENTS ---
import CostEstimator from "../../../components/marketing/CostEstimator";
import CTASection from "../../../components/marketing/CTASection";
import FAQSection from "../../../components/marketing/FAQSection";
import Footer from "../../../components/marketing/Footer";
import IndieAudioGuide from "../../../components/marketing/IndieAudioGuide";
import LogoCloud from "../../../components/marketing/LogoCloud";
import Navbar from "../../../components/marketing/Navbar";
import ProductionPipeline from "../../../components/marketing/ProductionPipeline";
import ServiceComparisonMatrix from "../../../components/marketing/ServiceComparisonMatrix";
import ServiceHero from "../../../components/marketing/ServiceHero";
import TestimonialsFeed from "../../../components/marketing/TestimonialsFeed";

// INITIALIZE SUPABASE
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 🟢 THEME DEFINITIONS
const THEMES = {
  gold: { label: "Classic Gold", hex: "#d4af37", var: "gold" },
  pink: { label: "Romance Pink", hex: "#ff3399", var: "pink" },
  fire: { label: "High Heat", hex: "#ff4500", var: "fire" },
  cyan: { label: "Sci-Fi Cyan", hex: "#00f0ff", var: "cyan" },
  system: { label: "System Blue", hex: "#3b82f6", var: "system" },
};

export default function ComponentShowroom() {
  // --- STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [actors, setActors] = useState([]);
  const [selectedActor, setSelectedActor] = useState(null);

  // 🟢 NEW: GLOBAL THEME STATE FOR TESTING
  const [demoTheme, setDemoTheme] = useState("gold"); // Default to gold
  const activeColor = THEMES[demoTheme].hex;

  // --- MOCK LOGIN ---
  const handleLogin = (e) => {
    e.preventDefault();
    if (keyInput === "admin" || keyInput.length > 2) setIsAuthenticated(true);
  };

  // --- FETCH ACTORS ---
  useEffect(() => {
    if (!isAuthenticated) return;
    async function fetchActors() {
      // 1. Try DB
      const { data } = await supabase.from("actor_db").select("*").limit(8);

      // 2. Fallback Mock Data
      const mockActors = [
        {
          id: 1,
          name: "Sarah J",
          voice_type: "Sultry & Warm",
          isRevealed: true,
          headshot_url: "https://placehold.co/400x600/1a1a1a/d4af37?text=Sarah",
          demo_url:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        },
        {
          id: 2,
          name: "Marcus T",
          voice_type: "Deep & Gritty",
          isRevealed: true,
          headshot_url:
            "https://placehold.co/400x600/1a1a1a/00f0ff?text=Marcus",
          demo_url:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        },
        { id: 3, name: "Coming Soon", voice_type: "Hidden", isRevealed: false },
        {
          id: 4,
          name: "Elena R",
          voice_type: "Bright & Youthful",
          isRevealed: true,
          headshot_url: "https://placehold.co/400x600/1a1a1a/ff3399?text=Elena",
          demo_url:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        },
      ];

      setActors(
        data && data.length > 0
          ? data.map((a) => ({ ...a, isRevealed: !a.coming_soon }))
          : mockActors
      );
    }
    fetchActors();
  }, [isAuthenticated]);

  // --- LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#020010] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background FX */}
        <ParticleFx variant="solo" color="#d4af37" />

        <div className="relative z-10 w-full max-w-md border border-[#d4af37]/30 bg-[#0a0a0a]/90 backdrop-blur-xl p-10 text-center rounded-2xl shadow-2xl animate-fade-in-up">
          <div className="w-16 h-16 bg-[#d4af37]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#d4af37]/30">
            <Shield className="w-8 h-8 text-[#d4af37]" />
          </div>
          <h2 className="text-3xl text-white mb-2 font-serif">System Access</h2>
          <p className="text-[#d4af37] font-bold uppercase tracking-widest text-xs mb-8">
            Authorized Personnel Only
          </p>
          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="password"
              className="w-full text-center text-3xl font-bold p-4 rounded-xl border border-white/10 bg-black/40 text-white focus:border-[#d4af37] outline-none tracking-widest transition-all focus:shadow-[0_0_20px_rgba(212,175,55,0.2)]"
              placeholder="KEY"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              autoFocus
            />
            <Button
              variant="solid"
              theme="gold"
              className="w-full py-4 text-lg"
            >
              Unlock
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // --- MAIN SHOWROOM ---
  return (
    <div className="min-h-screen font-sans text-white pb-24 bg-[#050505] selection:bg-[#d4af37] selection:text-black">
      {/* 🟢 FLOATY THEME SWITCHER */}
      <div className="fixed bottom-6 right-6 z-[100] animate-fade-in-up">
        <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
            <Settings size={12} /> Test Palette
          </div>
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(THEMES).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setDemoTheme(key)}
                title={config.label}
                className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                  demoTheme === key
                    ? "scale-110 shadow-[0_0_15px_currentColor]"
                    : "opacity-50 hover:opacity-100 hover:scale-105"
                }`}
                style={{
                  backgroundColor: config.hex,
                  borderColor: demoTheme === key ? "white" : "transparent",
                  color: config.hex,
                }}
              />
            ))}
          </div>
          <div className="text-[10px] text-center text-gray-500 font-mono mt-1">
            Active:{" "}
            <span style={{ color: activeColor }}>
              {THEMES[demoTheme].label}
            </span>
          </div>
        </div>
      </div>

      {/* 🟢 GLOBAL STYLE DEFINITIONS */}
      <style jsx global>{`
        /* --- SHIMMERS --- */
        .shimmer-text {
          background-size: 200% auto;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine 3s linear infinite;
        }
        @keyframes shine {
          to {
            background-position: 200% center;
          }
        }
        .text-shimmer-galaxy {
          background-image: linear-gradient(
            to right,
            #00f0ff,
            #bd00ff,
            #00f0ff
          );
        }
      `}</style>

      {/* NAVBAR PLACEHOLDER */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <Navbar />
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-24 mt-12">
        {/* HEADER */}
        <div className="text-center space-y-6">
          <h1 className="shimmer-text text-shimmer-galaxy text-4xl font-serif font-bold">
            Style System v3.1
          </h1>
          <div className="inline-flex items-center gap-4 bg-white/5 px-6 py-2 rounded-full border border-white/10">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-mono text-green-400">ONLINE</span>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="text-xs text-red-400 hover:text-white ml-4 uppercase tracking-wider font-bold"
            >
              Lock System
            </button>
          </div>
        </div>

        {/* ==================================================
            0.0 BASE PALETTE
        ================================================== */}
        <section className="space-y-10">
          <SectionHeader
            icon={Droplet}
            title="0.0 Base Palette"
            color="text-[#5865F2]"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Dark Bases */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-8">
              <h5 className="text-white/50 mb-6">Dark Foundations</h5>
              <div className="grid grid-cols-2 gap-4">
                <Swatch color="bg-[#020010]" label="Deep Space" hex="#020010" />
                <Swatch color="bg-[#0c0442]" label="Midnight" hex="#0c0442" />
                <Swatch color="bg-[#5865F2]" label="Blurple" hex="#5865F2" />
                <Swatch
                  color="bg-[#3c45a5]"
                  label="Blurple Dark"
                  hex="#3c45a5"
                />
              </div>
            </div>

            {/* Gold Variations */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-8">
              <h5 className="text-[#d4af37] mb-6">The Gold Standard</h5>
              <div className="grid grid-cols-3 gap-4">
                <Swatch
                  color="bg-[#d4af37]"
                  label="Gold (Base)"
                  hex="#d4af37"
                />
                <Swatch color="bg-[#fcf6ba]" label="Gold Light" hex="#fcf6ba" />
                <Swatch color="bg-[#b38728]" label="Gold Dark" hex="#b38728" />
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            2. UI PRIMITIVES (TEST AREA)
        ================================================== */}
        <section className="space-y-10">
          <SectionHeader
            icon={Shield}
            title="2.0 UI Primitives (Live Test)"
            color={activeColor} // Header color matches theme
          />
          <div
            className="bg-white/5 border border-white/10 rounded-xl p-10 space-y-10 transition-colors duration-500"
            style={{ borderColor: `${activeColor}30` }}
          >
            {/* BADGES */}
            <div>
              <h5 className="text-white/50 mb-6 text-sm font-mono uppercase tracking-widest">
                Status Badges
              </h5>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-3">
                  <Mic size={16} style={{ color: activeColor }} />
                  {/* Manually constructing badge styles for demo, or update Badge atom to accept hex */}
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 border rounded-full`}
                    style={{
                      borderColor: `${activeColor}40`,
                      backgroundColor: `${activeColor}10`,
                    }}
                  >
                    <span
                      className="text-[10px] tracking-[0.2em] uppercase font-bold"
                      style={{ color: activeColor }}
                    >
                      Active Theme
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-white/10" />

            {/* BUTTONS */}
            <div>
              <h5 className="text-white/50 mb-6 text-sm font-mono uppercase tracking-widest">
                Interactive Buttons (Testing: {THEMES[demoTheme].label})
              </h5>
              <div className="flex flex-wrap gap-4 items-center">
                {/* 🟢 THESE BUTTONS NOW RESPOND TO THEME STATE */}
                <Button variant="solid" theme={demoTheme}>
                  Solid Action
                </Button>

                <Button variant="outline" theme={demoTheme}>
                  Outline
                </Button>

                <Button variant="ghost" theme={demoTheme}>
                  Ghost / Icon
                </Button>

                <Button variant="glow" theme={demoTheme}>
                  <Sparkles size={16} className="mr-2" />
                  Pulse Glow
                </Button>

                <Button variant="icon" theme={demoTheme}>
                  <Zap size={16} />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            3. ROSTER COMPONENTS
        ================================================== */}
        <section className="space-y-12">
          <SectionHeader
            icon={Mic}
            title="3.0 Roster Components"
            color="text-[#d4af37]"
          />

          <div className="p-4 bg-white/5 border border-white/10 rounded-lg mb-4 text-xs text-gray-400">
            <span className="text-white font-bold mr-2">NOTE:</span>
            The cards below act as individual instances. We are injecting the{" "}
            <span style={{ color: activeColor }}>
              {THEMES[demoTheme].label}
            </span>{" "}
            into the first card via props.
          </div>

          <ShowcaseBlock title="ActorCard (Single - Themed)">
            <div className="w-full max-w-xs mx-auto md:mx-0">
              {actors.length > 0 && (
                // 🟢 INJECTING THE ACTIVE COLOR INTO THE CARD
                <ActorCard
                  actor={actors[0]}
                  color={activeColor}
                  onClick={() => {}}
                />
              )}
            </div>
          </ShowcaseBlock>

          <ShowcaseBlock title="RosterPreview (Slider)">
            <RosterPreview actors={actors.slice(0, 4)} />
          </ShowcaseBlock>

          <ShowcaseBlock title="MainRoster (Grid)">
            <MainRoster actors={actors} onSelectActor={setSelectedActor} />
          </ShowcaseBlock>
        </section>

        {/* ==================================================
            4. MARKETING COMPONENTS
        ================================================== */}
        <section className="space-y-12">
          <SectionHeader
            icon={Rocket}
            title="4.0 Marketing Components"
            color="text-green-400"
          />

          <ShowcaseBlock title="Service Hero">
            <ServiceHero />
          </ShowcaseBlock>
          <ShowcaseBlock title="Logo Cloud">
            <LogoCloud />
          </ShowcaseBlock>

          <ShowcaseBlock title="Indie Audio Guide">
            <IndieAudioGuide />
          </ShowcaseBlock>
          <ShowcaseBlock title="Comparison Matrix">
            <ServiceComparisonMatrix />
          </ShowcaseBlock>
          <ShowcaseBlock title="Production Pipeline">
            <ProductionPipeline />
          </ShowcaseBlock>
          <ShowcaseBlock title="Cost Estimator">
            <CostEstimator />
          </ShowcaseBlock>
          <ShowcaseBlock title="Testimonials">
            <TestimonialsFeed />
          </ShowcaseBlock>
          <ShowcaseBlock title="FAQ Section">
            <FAQSection />
          </ShowcaseBlock>
          <ShowcaseBlock title="CTA Section">
            <CTASection />
          </ShowcaseBlock>
        </section>
      </div>

      <div className="mt-24 border-t border-white/10">
        <Footer />
      </div>

      {/* GLOBAL MODAL */}
      {selectedActor && (
        <ActorModal
          actor={selectedActor}
          onClose={() => setSelectedActor(null)}
        />
      )}
    </div>
  );
}

// --- HELPER COMPONENTS (Local to Showroom) ---

const ShowcaseBlock = ({ title, children }) => (
  <div className="border border-white/10 rounded-xl overflow-hidden shadow-lg bg-black/20 backdrop-blur-sm">
    <div className="bg-white/5 px-6 py-3 text-xs font-mono text-[#d4af37]/80 font-bold border-b border-white/5 flex justify-between items-center">
      <span>&lt;{title} /&gt;</span>
      <span className="text-[10px] opacity-50 uppercase">Component</span>
    </div>
    <div>{children}</div>
  </div>
);

const AnimationBox = ({ title, color, children }) => (
  <div className="relative h-64 rounded-xl border border-white/10 bg-black/40 overflow-hidden flex items-center justify-center group">
    <div
      className="absolute top-3 left-3 text-xs font-bold uppercase tracking-widest z-10 bg-black/50 px-2 py-1 rounded"
      style={{ color }}
    >
      {title}
    </div>
    {/* Isolated Animation Container */}
    <div className="absolute inset-0">{children}</div>
    <div className="absolute bottom-3 right-3 text-[9px] text-white/30 font-mono z-10">
      CSS Keyframe
    </div>
  </div>
);

function Swatch({ color, label, hex }) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className={`w-full h-16 rounded-lg shadow-inner border border-white/10 ${color}`}
        style={{ backgroundColor: hex }}
      ></div>
      <div>
        <p className="text-white font-bold text-sm">{label}</p>
        <p className="text-white/40 text-xs font-mono">{hex}</p>
      </div>
    </div>
  );
}

function ThemeCard({ title, icon: Icon, borderColor, hex, description }) {
  return (
    <div
      className={`bg-white/5 border ${borderColor} p-8 rounded-xl relative overflow-hidden group`}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
        style={{ backgroundColor: hex }}
      />
      <div className="relative z-10 space-y-6">
        <div className="flex justify-between items-start">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center border border-white/10"
            style={{ backgroundColor: `${hex}20` }}
          >
            <Icon size={24} style={{ color: hex }} />
          </div>
          <span className="font-mono text-[10px] text-white/30">{hex}</span>
        </div>
        <div>
          <h3 className="mb-2 text-xl font-serif">{title}</h3>
        </div>
        <div className="pt-4 border-t border-white/10">
          <p className="text-sm text-white/50 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

function ShimmerDemo({ label, className }) {
  return (
    <div className="space-y-2">
      <span className="text-xs text-white/30 uppercase tracking-widest">
        {label}
      </span>
      <h3
        className={`text-3xl md:text-4xl font-serif font-bold shimmer-text ${className}`}
      >
        The Quick Brown Fox
      </h3>
    </div>
  );
}

function TypeRow({ label, className, children }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-8 items-baseline border-b border-white/5 pb-4 last:border-0">
      <span className="text-xs text-white/30 font-mono text-right">
        {label}
      </span>
      <p className={className}>{children}</p>
    </div>
  );
}
