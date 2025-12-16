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

export default function QuickAccessSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("intel"); // 'intel' or 'schedule'

  // --- CALCULATOR LOGIC ---
  const [wordCount, setWordCount] = useState("");
  const [stats, setStats] = useState({ hours: 0, weeks: 0 });

  useEffect(() => {
    const words = parseInt(wordCount.replace(/,/g, ""), 10) || 0;
    // Standard: ~9,300 words per finished hour
    const estHours = words / 9300;
    // Production Speed: Approx 2-3 finished hours per week + 2 weeks prep/post
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
          bg-[#050510]/90 backdrop-blur-md border-y border-l border-[#d4af37]/30 
          rounded-l-xl shadow-[0_0_20px_rgba(212,175,55,0.1)]
          transition-transform duration-300 group hover:translate-x-[-5px]
          ${isOpen ? "translate-x-full" : "translate-x-0"}
        `}
      >
        <Cpu size={18} className="text-[#d4af37] animate-pulse" />
        <span className="text-[10px] uppercase font-bold text-white [writing-mode:vertical-rl] rotate-180 tracking-[0.2em] group-hover:text-[#d4af37] transition-colors">
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
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/80">
              Logistics Center
            </h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-white transition-colors p-2"
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
          />
          <TabButton
            isActive={activeTab === "schedule"}
            onClick={() => setActiveTab("schedule")}
            icon={<Calendar size={14} />}
            label="Schedule"
          />
        </div>

        {/* --- SCROLLABLE CONTENT --- */}
        <div className="flex-1 overflow-y-auto p-6 relative">
          {/* Background FX */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

          {/* === TAB 1: INTEL (CALCULATOR) === */}
          {activeTab === "intel" && (
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-2">
                <h4 className="text-xl font-serif text-white">
                  Project Estimator
                </h4>
                <p className="text-xs text-white/50 leading-relaxed">
                  Enter your manuscript word count to generate estimated runtime
                  and production timeline based on our studio standards.
                </p>
              </div>

              {/* Input */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-[#d4af37]">
                  Manuscript Word Count
                </label>
                <div className="relative group">
                  <input
                    type="number"
                    value={wordCount}
                    onChange={(e) => setWordCount(e.target.value)}
                    placeholder="e.g. 65000"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:border-[#d4af37]/50 focus:outline-none focus:bg-white/10 transition-all font-mono text-sm"
                  />
                  <Database
                    size={14}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#d4af37]"
                  />
                </div>
              </div>

              {/* Data Display */}
              <div className="grid grid-cols-2 gap-4">
                <StatBox
                  label="Est. Runtime"
                  value={stats.hours > 0 ? `${stats.hours} Hrs` : "--"}
                  icon={<Clock size={14} />}
                />
                <StatBox
                  label="Est. Turnaround"
                  value={stats.weeks > 0 ? `${stats.weeks} Weeks` : "--"}
                  icon={<Calendar size={14} />}
                />
              </div>

              {/* Disclaimer */}
              <div className="p-4 rounded-lg bg-[#d4af37]/5 border border-[#d4af37]/20">
                <p className="text-[10px] text-white/60 leading-relaxed">
                  <span className="text-[#d4af37] font-bold">Note:</span>{" "}
                  Estimates include casting, prep, recording, and mastering.
                  Timelines may vary based on complexity (Duet/Multicast).
                </p>
              </div>

              <button
                onClick={() => setActiveTab("schedule")}
                className="w-full py-4 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-widest text-white transition-all rounded-lg"
              >
                Check Availability <ChevronRight size={14} />
              </button>
            </div>
          )}

          {/* === TAB 2: SCHEDULE (BOOKING) === */}
          {activeTab === "schedule" && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <h4 className="text-xl font-serif text-white">
                  Secure Production
                </h4>
                <p className="text-xs text-white/50 leading-relaxed">
                  Our roster books out 2-3 months in advance. Submit a request
                  to lock in your Q3/Q4 production slot.
                </p>
              </div>

              <form className="space-y-4">
                <InputGroup label="Author / Producer Name" type="text" />
                <InputGroup label="Email Address" type="email" />

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-white/40">
                    Desired Timeline
                  </label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-3 text-sm text-gray-300 focus:border-[#d4af37]/50 focus:outline-none focus:bg-white/10">
                    <option>ASAP (Rush)</option>
                    <option>Next 30 Days</option>
                    <option>Next Quarter (Q3)</option>
                    <option>End of Year (Q4)</option>
                  </select>
                </div>

                <div className="pt-4">
                  <Link
                    href="/projectform"
                    className="group relative flex items-center justify-center w-full py-4 bg-[#d4af37] text-black font-bold text-xs uppercase tracking-widest rounded-lg overflow-hidden transition-all hover:bg-[#b39020]"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Request Slot <ArrowRight size={14} />
                    </span>
                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shine" />
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
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-500"
        />
      )}
    </>
  );
}

// --- SUB-COMPONENTS ---

function TabButton({ isActive, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center justify-center gap-2 py-4 text-[10px] font-bold uppercase tracking-widest transition-all
        ${
          isActive
            ? "text-[#d4af37] bg-white/[0.03] border-b-2 border-[#d4af37]"
            : "text-white/40 hover:text-white hover:bg-white/[0.01] border-b-2 border-transparent"
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}

function StatBox({ label, value, icon }) {
  return (
    <div className="p-4 rounded-lg bg-white/[0.03] border border-white/5 flex flex-col items-center justify-center text-center gap-2">
      <div className="text-[#d4af37] opacity-80">{icon}</div>
      <div>
        <div className="text-[9px] uppercase tracking-widest text-white/40 mb-1">
          {label}
        </div>
        <div className="text-lg font-mono font-bold text-white">{value}</div>
      </div>
    </div>
  );
}

function InputGroup({ label, type = "text" }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] uppercase tracking-widest text-white/40">
        {label}
      </label>
      <input
        type={type}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-3 text-sm text-white focus:border-[#d4af37]/50 focus:outline-none focus:bg-white/10 transition-all"
      />
    </div>
  );
}
