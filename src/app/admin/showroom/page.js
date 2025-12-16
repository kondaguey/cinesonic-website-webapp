"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient.js";

// ICONS
import {
  ArrowRight,
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
} from "lucide-react";

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
import SonicVisualizer from "../../../components/marketing/SonicVisualizer";
import TestimonialsFeed from "../../../components/marketing/TestimonialsFeed";

export default function ComponentShowroom() {
  // --- STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [actors, setActors] = useState([]);
  const [selectedActor, setSelectedActor] = useState(null);

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
        <div className="relative z-10 w-full max-w-md border-t-4 border-[#d4af37] bg-[#0a0a0a] p-10 text-center rounded-xl shadow-2xl">
          <h2 className="text-3xl text-white mb-2 font-serif">System Access</h2>
          <p className="text-[#d4af37] font-bold uppercase tracking-widest text-xs mb-8">
            Authorized Personnel Only
          </p>
          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="password"
              className="w-full text-center text-3xl font-bold p-4 rounded-xl border border-white/10 bg-black/40 text-white focus:border-[#d4af37] outline-none tracking-widest"
              placeholder="KEY"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              autoFocus
            />
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-[#d4af37] text-black font-bold uppercase tracking-wider hover:bg-white transition-all"
            >
              Unlock
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- MAIN SHOWROOM ---
  return (
    <div className="min-h-screen font-sans text-white pb-24 bg-[#050505]">
      {/* 🟢 GLOBAL STYLE DEFINITIONS (The Source of Truth) */}
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

        .text-shimmer-gold {
          background-image: linear-gradient(
            to right,
            #bf953f,
            #fcf6ba,
            #b38728,
            #fbf5b7,
            #aa771c
          );
        }
        .text-shimmer-silver {
          background-image: linear-gradient(
            to right,
            #9ca3af,
            #f3f4f6,
            #d1d5db,
            #f9fafb,
            #9ca3af
          );
        }
        .text-shimmer-pink {
          background-image: linear-gradient(
            to right,
            #ff3399,
            #ffb3d9,
            #ff3399
          );
        }
        .text-shimmer-fire {
          background-image: linear-gradient(
            to right,
            #ff4500,
            #ffaa00,
            #ff4500
          );
        }
        .text-shimmer-galaxy {
          background-image: linear-gradient(
            to right,
            #00f0ff,
            #bd00ff,
            #00f0ff
          );
        }

        /* --- FX ANIMATIONS --- */
        @keyframes riseFast {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: translateY(-400px) scale(0);
            opacity: 0;
          }
        }
        @keyframes floatUp {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          30% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-300px) rotate(20deg);
            opacity: 0;
          }
        }
        @keyframes warpDown {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          20% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(600px);
            opacity: 0;
          }
        }
        @keyframes pulseGlow {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.15;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0.3;
          }
        }
      `}</style>

      {/* NAVBAR PLACEHOLDER */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <Navbar />
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-24 mt-12">
        {/* HEADER */}
        <div className="text-center space-y-6">
          <h1 className="shimmer-text text-shimmer-galaxy text-4xl font-serif">
            Style System v3.1
          </h1>
          <div className="inline-flex items-center gap-4 bg-white/5 px-6 py-2 rounded-full border border-white/10">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-mono text-green-400">ONLINE</span>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="text-xs text-red-400 hover:text-white ml-4"
            >
              LOCK
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
            0.1 VISUAL THEMES
        ================================================== */}
        <section className="space-y-10">
          <SectionHeader
            icon={Palette}
            title="0.1 Visual Themes"
            color="text-[#d4af37]"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ThemeCard
              title="Classic / Solo"
              icon={Mic}
              borderColor="border-[#d4af37]"
              hex="#d4af37"
              description="Elegant. Timeless. Used for main branding."
            />
            <ThemeCard
              title="Romance / Dual"
              icon={Heart}
              borderColor="border-[#ff3399]"
              hex="#ff3399"
              description="Neon & Rose Gold. Passionate."
            />
            <ThemeCard
              title="High Heat / Duet"
              icon={Flame}
              borderColor="border-[#ff4500]"
              hex="#ff4500"
              description="Magma Orange. Intense. Dynamic."
            />
            <ThemeCard
              title="Sci-Fi / Multi"
              icon={Rocket}
              borderColor="border-[#00f0ff]"
              hex="#00f0ff"
              description="Cyan & Purple. Holographic. Tech."
            />
          </div>
        </section>

        {/* ==================================================
            0.2 SHIMMER EFFECTS
        ================================================== */}
        <section className="space-y-10">
          <SectionHeader
            icon={Sparkles}
            title="0.2 Text Shimmers"
            color="text-white"
          />
          <div className="bg-white/5 border border-white/10 rounded-xl p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ShimmerDemo label="Gold (Base)" className="text-shimmer-gold" />
              <ShimmerDemo
                label="Silver (Secondary)"
                className="text-shimmer-silver"
              />
              <ShimmerDemo label="Romance Pink" className="text-shimmer-pink" />
              <ShimmerDemo
                label="High Heat Fire"
                className="text-shimmer-fire"
              />
              <ShimmerDemo
                label="Sci-Fi Galaxy"
                className="text-shimmer-galaxy"
              />
            </div>
          </div>
        </section>

        {/* ==================================================
            0.3 ANIMATION LAB (HIGH FIDELITY)
        ================================================== */}
        <section className="space-y-10">
          <SectionHeader
            icon={Zap}
            title="0.3 Animation FX Lab"
            color="text-yellow-400"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. SOLO */}
            <AnimationBox title="Pulse Glow (Solo)" color="#d4af37">
              <div className="absolute inset-0 overflow-hidden">
                {/* Pulsing Center Aura */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#d4af37] rounded-full blur-[50px] animate-[pulseGlow_4s_ease-in-out_infinite]" />
                {/* Particles */}
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full animate-pulse"
                    style={{
                      width: Math.random() * 4 + 1 + "px",
                      height: Math.random() * 4 + 1 + "px",
                      backgroundColor: "#d4af37",
                      top: Math.random() * 100 + "%",
                      left: Math.random() * 100 + "%",
                      opacity: Math.random() * 0.5 + 0.3,
                      animationDuration: Math.random() * 2 + 1 + "s",
                    }}
                  />
                ))}
              </div>
            </AnimationBox>

            {/* 2. DUAL */}
            <AnimationBox title="Floating Hearts (Romance)" color="#ff3399">
              <div className="absolute inset-0 overflow-hidden">
                {/* Hearts */}
                {[...Array(6)].map((_, i) => (
                  <Heart
                    key={i}
                    size={10 + Math.random() * 16}
                    fill="#ff3399"
                    stroke="none"
                    className="absolute animate-[floatUp_6s_ease-in-out_infinite]"
                    style={{
                      color: "#ff3399",
                      left: Math.random() * 80 + 10 + "%",
                      bottom: "-30px",
                      opacity: 0,
                      animationDelay: Math.random() * 4 + "s",
                    }}
                  />
                ))}
                {/* Bottom Blur Tint */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-[70px] bg-[#ff3399] opacity-[0.25]" />
              </div>
            </AnimationBox>

            {/* 3. DUET (INTENSIFIED) */}
            <AnimationBox title="Rising Embers (Heat)" color="#ff4500">
              <div className="absolute inset-0 overflow-hidden">
                {/* Embers */}
                {[...Array(25)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full animate-[riseFast_3s_linear_infinite]"
                    style={{
                      width: Math.random() * 3 + 1 + "px",
                      height: Math.random() * 3 + 1 + "px",
                      backgroundColor: "#ff4500",
                      left: Math.random() * 100 + "%",
                      bottom: "-20px",
                      opacity: 0,
                      animationDelay: Math.random() * 3 + "s",
                      animationDuration: Math.random() * 1.5 + 1.5 + "s",
                    }}
                  />
                ))}
                {/* Bottom Gradient Tint */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#ff4500]/40 to-transparent" />
              </div>
            </AnimationBox>

            {/* 4. MULTI (WARP DOWN) */}
            <AnimationBox title="Warp Speed (Sci-Fi)" color="#00f0ff">
              <div className="absolute inset-0 overflow-hidden">
                {/* Stars */}
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-[1px] bg-[#00f0ff] animate-[warpDown_2s_linear_infinite]"
                    style={{
                      height: Math.random() * 40 + 20 + "px",
                      left: Math.random() * 100 + "%",
                      top: "-60px",
                      opacity: 0,
                      animationDelay: Math.random() * 2 + "s",
                    }}
                  />
                ))}
                {/* No Bottom Tint (Space is dark) */}
              </div>
            </AnimationBox>
          </div>
        </section>

        {/* ==================================================
            1. TYPOGRAPHY & COLORS
        ================================================== */}
        <section className="space-y-10">
          <SectionHeader
            icon={Type}
            title="1.0 Typography & Contrast"
            color="text-white"
          />
          <div className="bg-white/5 border border-white/10 rounded-xl p-10 space-y-12">
            {/* Font Colors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-white/10">
              <div className="space-y-2">
                <p className="text-xs text-white/30 font-mono">
                  White (Headlines)
                </p>
                <p className="text-3xl text-white font-serif">#FFFFFF</p>
                <p className="text-white text-sm">
                  Used for h1, h2, h3. Maximum contrast.
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-white/30 font-mono">
                  Off-White (Body)
                </p>
                <p className="text-3xl text-white/70 font-sans">
                  #FFFFFF / 70%
                </p>
                <p className="text-white/70 text-sm">
                  Used for paragraphs. Reduces eye strain on black.
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-white/30 font-mono">Gold (Accent)</p>
                <p className="text-3xl text-[#d4af37] font-serif">#D4AF37</p>
                <p className="text-[#d4af37] text-sm">
                  Used for links, buttons, and highlights.
                </p>
              </div>
            </div>

            {/* Font Hierarchy */}
            <div className="space-y-8">
              <TypeRow
                label="h1 (Cinzel)"
                className="text-4xl md:text-5xl font-serif text-white"
              >
                Cinematic Headline
              </TypeRow>
              <TypeRow
                label="h2 (Cinzel)"
                className="text-3xl md:text-4xl font-serif text-white"
              >
                Section Title
              </TypeRow>
              <TypeRow
                label="h3 (Cinzel)"
                className="text-2xl font-serif text-white"
              >
                Card or Object Title
              </TypeRow>
              <TypeRow
                label="Body (Sans)"
                className="text-base text-white/70 font-light"
              >
                Standard body text designed for readability. Note how this
                off-white color sits comfortably on the deep background without
                vibrating.
              </TypeRow>
            </div>
          </div>
        </section>

        {/* ==================================================
            2. UI PRIMITIVES
        ================================================== */}
        <section className="space-y-10">
          <SectionHeader
            icon={Shield}
            title="2.0 UI Primitives"
            color="text-white"
          />
          <div className="bg-white/5 border border-white/10 rounded-xl p-8 space-y-8">
            <h5 className="text-white/50 mb-4">Badges & Pills</h5>
            <div className="flex flex-wrap gap-4">
              <Badge
                icon={Mic}
                label="Production"
                color="text-[#d4af37]"
                bg="bg-[#d4af37]/10"
                border="border-[#d4af37]/30"
              />
              <Badge
                icon={Heart}
                label="Romance"
                color="text-[#ff3399]"
                bg="bg-[#ff3399]/10"
                border="border-[#ff3399]/30"
              />
              <Badge
                icon={Flame}
                label="High Heat"
                color="text-[#ff4500]"
                bg="bg-[#ff4500]/10"
                border="border-[#ff4500]/30"
              />
              <Badge
                icon={Rocket}
                label="Sci-Fi"
                color="text-[#00f0ff]"
                bg="bg-[#00f0ff]/10"
                border="border-[#00f0ff]/30"
              />
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

          <ShowcaseBlock title="ActorCard (Single)">
            <div className="w-full max-w-xs mx-auto md:mx-0">
              {actors.length > 0 && (
                <ActorCard actor={actors[0]} onClick={() => {}} />
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
            {" "}
            <ServiceHero />{" "}
          </ShowcaseBlock>
          <ShowcaseBlock title="Logo Cloud">
            {" "}
            <LogoCloud />{" "}
          </ShowcaseBlock>
          <ShowcaseBlock title="Sonic Visualizer">
            {" "}
            <SonicVisualizer />{" "}
          </ShowcaseBlock>
          <ShowcaseBlock title="Indie Audio Guide">
            {" "}
            <IndieAudioGuide />{" "}
          </ShowcaseBlock>
          <ShowcaseBlock title="Comparison Matrix">
            {" "}
            <ServiceComparisonMatrix />{" "}
          </ShowcaseBlock>
          <ShowcaseBlock title="Production Pipeline">
            {" "}
            <ProductionPipeline />{" "}
          </ShowcaseBlock>
          <ShowcaseBlock title="Cost Estimator">
            {" "}
            <CostEstimator />{" "}
          </ShowcaseBlock>
          <ShowcaseBlock title="Testimonials">
            {" "}
            <TestimonialsFeed />{" "}
          </ShowcaseBlock>
          <ShowcaseBlock title="FAQ Section">
            {" "}
            <FAQSection />{" "}
          </ShowcaseBlock>
          <ShowcaseBlock title="CTA Section">
            {" "}
            <CTASection />{" "}
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

// --- HELPER COMPONENTS ---

const SectionHeader = ({ icon: Icon, title, color }) => (
  <div className="flex items-center gap-4 pb-4 border-b border-white/10">
    <Icon className={color} size={28} />
    <h2 className="text-3xl md:text-4xl text-white font-serif">{title}</h2>
  </div>
);

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

function Badge({ icon: Icon, label, color, bg, border }) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 border ${border} ${bg} rounded-full`}
    >
      <Icon size={12} className={color} />
      <span
        className={`text-[10px] tracking-[0.2em] uppercase font-bold ${color}`}
      >
        {label}
      </span>
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
