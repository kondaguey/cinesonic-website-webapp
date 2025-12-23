"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  Clapperboard,
  Mic,
  Calendar,
  LayoutDashboard,
  Loader2,
  CheckCircle,
  X,
  Clock,
  FileText,
  DollarSign,
  Sparkles,
  AlignLeft,
  Zap,
} from "lucide-react";
import Button from "@/components/ui/Button"; // Adjust path as needed

// Helper for Stats Cards
function InfoCard({ icon: Icon, label, value, highlightColor }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4">
      <div
        className="p-2 rounded-lg shrink-0"
        style={{
          backgroundColor: highlightColor
            ? `${highlightColor}20`
            : "rgba(255,255,255,0.05)",
          color: highlightColor || "#9ca3af",
        }}
      >
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <div className="text-[9px] uppercase tracking-widest text-gray-500 font-bold mb-0.5">
          {label}
        </div>
        <div
          className="text-sm font-bold truncate"
          style={{ color: highlightColor || "white" }}
        >
          {value || "N/A"}
        </div>
      </div>
    </div>
  );
}

export default function IntakeModal({
  intake,
  onClose,
  onGreenlight,
  isSaving,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Lock scroll
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!mounted || !intake) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      {/* MODAL CONTAINER */}
      <div
        className="bg-[#0a0a0a] w-full max-w-5xl rounded-3xl overflow-hidden flex flex-col max-h-[95vh] shadow-2xl relative border animate-in slide-in-from-bottom-5 duration-300"
        style={{
          borderColor: intake.theme.border,
          boxShadow: `0 0 50px ${intake.theme.bg}`,
        }}
      >
        {/* HEADER */}
        <div className="relative p-6 md:p-8 border-b border-white/10 bg-[#050505] shrink-0">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              background: `linear-gradient(to right, ${intake.theme.hex}, transparent)`,
            }}
          />
          <div className="relative z-10 flex justify-between items-start">
            <div className="flex gap-6 items-center">
              {/* Large Icon Box */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center border shadow-lg shrink-0"
                style={{
                  backgroundColor: intake.theme.bg,
                  borderColor: intake.theme.border,
                  color: intake.theme.hex,
                }}
              >
                {(() => {
                  const Icon = intake.theme.icon;
                  return <Icon size={32} />;
                })()}
              </div>

              {/* Title Block */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-mono text-gray-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                    {intake.id}
                  </span>
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border"
                    style={{
                      borderColor: intake.theme.border,
                      color: intake.theme.hex,
                    }}
                  >
                    {intake.clientType} • {intake.theme.label}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-serif text-white mb-1 line-clamp-1">
                  {intake.project_title}
                </h2>
                <p className="text-gray-400 text-sm">
                  {intake.client_name} •{" "}
                  <span className="text-gray-600">
                    {intake.client_email || intake.email}
                  </span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 space-y-8 bg-[#020010]">
          {/* 1. Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InfoCard
              icon={FileText}
              label="Word Count"
              value={Number(intake.word_count).toLocaleString()}
            />
            <InfoCard
              icon={DollarSign}
              label="Price Tier"
              value={intake.priceTier}
              highlightColor={intake.theme.hex}
            />
            <InfoCard
              icon={Zap}
              label="Format"
              value={intake.base_format || "Standard"}
            />
            <InfoCard
              icon={Calendar}
              label="Requested"
              value={new Date(intake.timestamp).toLocaleDateString()}
            />
          </div>

          {/* 2. Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT: Character & Notes */}
            <div className="lg:col-span-2 space-y-8">
              {/* Character Manifest */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h4
                  className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2"
                  style={{ color: intake.theme.hex }}
                >
                  <LayoutDashboard size={16} /> Character Manifest
                </h4>
                <div className="space-y-3">
                  {(() => {
                    // Safe JSON Parsing
                    let chars = [];
                    if (typeof intake.character_details === "string") {
                      try {
                        chars = JSON.parse(intake.character_details);
                      } catch (e) {
                        chars = [];
                      }
                    } else if (Array.isArray(intake.character_details)) {
                      chars = intake.character_details;
                    }

                    if (!chars.length)
                      return (
                        <div className="text-gray-500 text-xs italic">
                          No character data provided.
                        </div>
                      );

                    return chars.map((char, i) => {
                      // Handle Form Submit Structure where actor_request is an object
                      const preferredActor =
                        char.actor_request?.name || char.preferredActorName;

                      return (
                        <div
                          key={i}
                          className="flex items-center gap-4 p-4 bg-[#0a0a0a] border border-white/5 rounded-xl hover:border-white/20 transition-colors"
                        >
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-black shrink-0"
                            style={{ backgroundColor: intake.theme.hex }}
                          >
                            {i + 1}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full text-xs items-center">
                            <span className="font-bold text-white text-sm truncate">
                              {char.name || char.role_name || "Unknown Role"}
                            </span>
                            <div className="text-gray-400 flex flex-col">
                              <span>{char.gender || "Any Gender"}</span>
                              <span className="text-[10px] opacity-60">
                                {char.age || char.age_range || "Any Age"}
                              </span>
                            </div>
                            {/* Actor Request Display */}
                            {preferredActor ? (
                              <span
                                className="flex items-center gap-1.5 font-medium truncate"
                                style={{ color: intake.theme.hex }}
                              >
                                <Sparkles size={12} /> {preferredActor}
                              </span>
                            ) : (
                              <span className="text-gray-600 italic">
                                Open Casting
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Notes Section */}
              {intake.notes && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2">
                    <AlignLeft size={16} /> Production Notes
                  </h4>
                  <p className="text-sm text-gray-300 leading-relaxed italic bg-black/20 p-4 rounded-xl border border-white/5">
                    "{intake.notes}"
                  </p>
                </div>
              )}
            </div>

            {/* RIGHT: Timeline */}
            <div>
              <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 h-fit sticky top-0">
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                  <Clock size={16} /> Timeline Options
                </h4>
                <div className="space-y-6 relative">
                  <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/10" />
                  {(intake.timeline_prefs || "").split("|").map((date, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 relative z-10"
                    >
                      <div
                        className="w-3.5 h-3.5 rounded-full bg-[#0a0a0a] border-2 shadow-[0_0_10px_currentColor]"
                        style={{
                          borderColor: intake.theme.hex,
                          color: intake.theme.hex,
                        }}
                      />
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-0.5">
                          Option 0{i + 1}
                        </span>
                        <span className="text-white font-mono text-sm block">
                          {date ? new Date(date).toLocaleDateString() : "TBD"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER ACTION */}
        <div className="p-6 bg-[#050505] border-t border-white/10 flex justify-end gap-3 shrink-0">
          <Button
            onClick={onGreenlight}
            variant="solid"
            className="text-black font-bold tracking-widest px-8 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
            style={{ backgroundColor: intake.theme.hex }}
          >
            {isSaving ? (
              <Loader2 className="animate-spin mr-2" size={18} />
            ) : (
              <CheckCircle className="mr-2" size={18} />
            )}
            {isSaving ? "PROCESSING..." : "GREENLIGHT PROJECT"}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
