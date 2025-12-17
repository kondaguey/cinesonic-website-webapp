"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  X,
  Calendar,
  Calculator,
  Clock,
  Cpu,
  ArrowRight,
  Database,
  ChevronRight,
} from "lucide-react";

export default function QuickAccessSidebar({ theme = "gold" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("intel"); // 'intel' or 'schedule'

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

  // --- CALCULATOR LOGIC ---
  const [wordCount, setWordCount] = useState("");
  const [stats, setStats] = useState({ hours: 0, weeks: 0 });

  useEffect(() => {
    // Basic logic: 9300 words = 1 finished hour
    // Production speed: ~2.5 finished hours per week (conservative estimate for solo narrator) + 2 weeks prep/QC
    const words = parseInt(wordCount.replace(/,/g, ""), 10) || 0;
    const estHours = words / 9300;
    const estWeeks = estHours > 0 ? Math.ceil(estHours / 2.5) + 2 : 0;

    setStats({
      hours: estHours.toFixed(1),
      weeks: estWeeks,
    });
  }, [wordCount]);

  return (
    <>
      {/* 1. TRIGGER BUTTON (Vertical Side Tab) */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed right-0 top-[30%] md:top-[40%] z-[40] 
          flex flex-col items-center justify-center gap-3 py-4 px-2
          bg-[#050510]/90 backdrop-blur-md border-y border-l
          rounded-l-xl shadow-xl transition-all duration-500 group hover:pl-4
          ${
            isOpen
              ? "translate-x-full opacity-0 pointer-events-none"
              : "translate-x-0 opacity-100"
          }
        `}
        style={{
          borderColor: `${color}30`,
          boxShadow: `0 0 20px ${color}10`,
        }}
      >
        <Cpu size={18} className="animate-pulse" style={{ color: color }} />
        <span
          className="text-[10px] uppercase font-bold [writing-mode:vertical-rl] rotate-180 tracking-[0.2em] transition-colors duration-300"
          style={{ color: "rgba(255,255,255,0.5)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = color)}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "rgba(255,255,255,0.5)")
          }
        >
          Production Hub
        </span>
      </button>

      {/* 2. THE SIDEBAR PANEL */}
      <div
        className={`fixed inset-y-0 right-0 z-[60] 
          w-[85vw] md:w-[400px] 
          bg-[#030303] border-l border-white/10 shadow-2xl 
          transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) flex flex-col
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* --- HEADER --- */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div
              className="w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px_currentColor]"
              style={{ backgroundColor: color, color: color }}
            />
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/80 font-mono">
              Logistics Center
            </h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
          >
            <X size={18} />
          </button>
        </div>

        {/* --- TABS --- */}
        <div className="grid grid-cols-2 border-b border-white/5">
          <TabButton
            isActive={activeTab === "intel"}
            onClick={() => setActiveTab("intel")}
            icon={<Calculator size={14} />}
            label="Estimator"
            color={color}
          />
          <TabButton
            isActive={activeTab === "schedule"}
            onClick={() => setActiveTab("schedule")}
            icon={<Calendar size={14} />}
            label="Schedule"
            color={color}
          />
        </div>

        {/* --- SCROLLABLE CONTENT --- */}
        <div className="flex-1 overflow-y-auto p-6 relative custom-scrollbar">
          {/* Background FX */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

          {/* === TAB 1: INTEL (CALCULATOR) === */}
          {activeTab === "intel" && (
            <div className="space-y-8 animate-fade-in-up">
              <div className="space-y-2">
                <h4 className="text-xl font-serif text-white">
                  Project Estimator
                </h4>
                <p className="text-xs text-white/50 leading-relaxed font-light">
                  Enter your manuscript word count to generate estimated runtime
                  and production timeline.
                </p>
              </div>

              {/* Input */}
              <div className="space-y-2">
                <label
                  className="text-[10px] uppercase tracking-widest font-bold"
                  style={{ color: color }}
                >
                  Manuscript Word Count
                </label>
                <div className="relative group">
                  <input
                    type="number"
                    value={wordCount}
                    onChange={(e) => setWordCount(e.target.value)}
                    placeholder="e.g. 65000"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:bg-white/10 transition-all font-mono text-sm"
                    onFocus={(e) => (e.target.style.borderColor = `${color}80`)}
                    onBlur={(e) =>
                      (e.target.style.borderColor = "rgba(255,255,255,0.1)")
                    }
                  />
                  <Database
                    size={14}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 transition-colors"
                    style={{
                      color: wordCount ? color : undefined,
                    }}
                  />
                </div>
              </div>

              {/* Data Display */}
              <div className="grid grid-cols-2 gap-4">
                <StatBox
                  label="Est. Runtime"
                  value={stats.hours > 0 ? `${stats.hours} Hrs` : "--"}
                  icon={<Clock size={14} />}
                  color={color}
                />
                <StatBox
                  label="Est. Turnaround"
                  value={stats.weeks > 0 ? `${stats.weeks} Weeks` : "--"}
                  icon={<Calendar size={14} />}
                  color={color}
                />
              </div>

              {/* Disclaimer */}
              <div
                className="p-4 rounded-lg bg-white/[0.03] border"
                style={{ borderColor: `${color}30` }}
              >
                <p className="text-[10px] text-white/60 leading-relaxed font-light">
                  <span className="font-bold" style={{ color: color }}>
                    Note:
                  </span>{" "}
                  Estimates include casting, prep, recording, and mastering.
                  Timelines may vary based on complexity.
                </p>
              </div>

              <button
                onClick={() => setActiveTab("schedule")}
                className="w-full py-4 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-widest text-white transition-all rounded-lg group"
              >
                Check Availability
                <ChevronRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          )}

          {/* === TAB 2: SCHEDULE (BOOKING) === */}
          {activeTab === "schedule" && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="space-y-2">
                <h4 className="text-xl font-serif text-white">
                  Secure Production
                </h4>
                <p className="text-xs text-white/50 leading-relaxed font-light">
                  Our roster books out 2-3 months in advance. Submit a request
                  to lock in your production slot.
                </p>
              </div>

              <form className="space-y-4">
                <InputGroup
                  label="Author / Producer Name"
                  type="text"
                  color={color}
                />
                <InputGroup label="Email Address" type="email" color={color} />

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
                    Desired Timeline
                  </label>
                  <select
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-3 text-sm text-gray-300 focus:outline-none focus:bg-white/10 transition-colors"
                    onFocus={(e) => (e.target.style.borderColor = `${color}80`)}
                    onBlur={(e) =>
                      (e.target.style.borderColor = "rgba(255,255,255,0.1)")
                    }
                  >
                    <option>ASAP (Rush)</option>
                    <option>Next 30 Days</option>
                    <option>Next Quarter (Q3)</option>
                    <option>End of Year (Q4)</option>
                  </select>
                </div>

                <div className="pt-4">
                  <Link
                    href="/projectform"
                    className="group relative flex items-center justify-center w-full py-4 text-black font-bold text-xs uppercase tracking-widest rounded-lg overflow-hidden transition-all"
                    style={{ backgroundColor: color }}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Request Slot <ArrowRight size={14} />
                    </span>
                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                  </Link>
                  <p className="text-center text-[9px] text-white/30 mt-3">
                    No payment required to inquire.
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* --- FOOTER STATUS --- */}
        <div className="p-4 border-t border-white/5 bg-black/40">
          <div className="flex justify-between items-center text-[9px] font-mono text-white/30 uppercase tracking-widest">
            <span>System: Online</span>
            <span>Ver 2.0.4</span>
          </div>
        </div>
      </div>

      {/* 3. BACKDROP OVERLAY */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-500 animate-fade-in"
        />
      )}

      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </>
  );
}

// --- SUB-COMPONENTS ---

function TabButton({ isActive, onClick, icon, label, color }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center justify-center gap-2 py-4 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2
        ${
          isActive
            ? "bg-white/[0.03]"
            : "text-white/40 hover:text-white hover:bg-white/[0.01]"
        }
      `}
      style={{
        borderColor: isActive ? color : "transparent",
        color: isActive ? color : undefined,
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function StatBox({ label, value, icon, color }) {
  return (
    <div className="p-4 rounded-lg bg-white/[0.03] border border-white/5 flex flex-col items-center justify-center text-center gap-2 transition-colors hover:border-white/10">
      <div style={{ color: color, opacity: 0.8 }}>{icon}</div>
      <div>
        <div className="text-[9px] uppercase tracking-widest text-white/40 mb-1 font-bold">
          {label}
        </div>
        <div className="text-lg font-mono font-bold text-white">{value}</div>
      </div>
    </div>
  );
}

function InputGroup({ label, type = "text", color }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
        {label}
      </label>
      <input
        type={type}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-3 text-sm text-white focus:outline-none focus:bg-white/10 transition-all"
        onFocus={(e) => (e.target.style.borderColor = `${color}80`)}
        onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
      />
    </div>
  );
}
