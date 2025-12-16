"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { X, Play, Pause, Download, Share2, Sparkles, Mic2 } from "lucide-react";

export default function ActorModal({ actor, onClose }) {
  // 1. Prevent body scroll when modal is open
  useEffect(() => {
    if (actor) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [actor]);

  if (!actor) return null;

  // --- HELPER: CLEAN VOICE TYPE ---
  // Handles if voice_type is stored as a JSON string array like "['Deep', 'Raspy']"
  const getTags = (raw) => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    try {
      // Try to parse if it looks like an array string
      if (typeof raw === "string" && raw.startsWith("[")) {
        return JSON.parse(raw.replace(/'/g, '"'));
      }
      return [raw];
    } catch (e) {
      return [raw];
    }
  };

  const tags = getTags(actor.voice_type);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
      {/* --- BACKDROP --- */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#020010]/90 backdrop-blur-xl transition-opacity animate-fade-in cursor-pointer"
      />

      {/* --- MODAL CONTENT --- */}
      <div className="relative z-10 w-full max-w-5xl bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-scale-in max-h-[90vh] md:max-h-[600px]">
        {/* CLOSE BUTTON (Mobile Top Right) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white/70 hover:text-white hover:bg-white/10 transition-colors md:hidden"
        >
          <X size={20} />
        </button>

        {/* --- LEFT: IMAGE COLUMN --- */}
        <div className="relative w-full md:w-[40%] h-64 md:h-auto bg-black group overflow-hidden">
          {actor.headshot_url ? (
            <Image
              src={actor.headshot_url}
              alt={actor.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/5">
              <Mic2 size={64} className="text-white/20" />
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent md:bg-gradient-to-r" />

          {/* Name Overlay (Mobile Only) */}
          <div className="absolute bottom-4 left-4 md:hidden">
            <h2 className="text-2xl font-serif text-white font-bold">
              {actor.name}
            </h2>
            <div className="flex gap-2 mt-2">
              {tags.slice(0, 2).map((tag, i) => (
                <span
                  key={i}
                  className="text-[10px] uppercase tracking-wider bg-[#d4af37] text-black px-2 py-0.5 rounded font-bold"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* --- RIGHT: INFO COLUMN --- */}
        <div className="flex-1 p-6 md:p-10 flex flex-col overflow-y-auto">
          {/* Desktop Header */}
          <div className="hidden md:flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2 text-[#d4af37]">
                <Sparkles size={14} />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
                  Talent Profile
                </span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-serif text-white">
                {actor.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full border border-white/10 text-white/40 hover:text-white hover:border-white hover:bg-white/5 transition-all"
            >
              <X size={24} />
            </button>
          </div>

          {/* Tags Row */}
          <div className="hidden md:flex flex-wrap gap-2 mb-8">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-white/70 uppercase tracking-wider"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Bio / Description */}
          <div className="flex-1 space-y-6 mb-8">
            <p className="text-white/60 font-light leading-relaxed text-sm md:text-base">
              {actor.bio ||
                "This artist has not yet uploaded a biography. They are selected for the CineSonic roster based on exceptional vocal control and dramatic range."}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <StatBox
                label="Accent"
                value={actor.accent || "Standard American"}
              />
              <StatBox label="Gender" value={actor.gender || "Not Listed"} />
              <StatBox label="Age Range" value="Adult / Young Adult" />
              <StatBox label="Studio" value="Home Studio (Pro)" />
            </div>
          </div>

          {/* AUDIO PLAYER */}
          <div className="mt-auto pt-6 border-t border-white/10">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">
              Audio Demonstration
            </h4>
            {actor.demo_url ? (
              <InlinePlayer src={actor.demo_url} />
            ) : (
              <div className="p-4 rounded border border-dashed border-white/10 text-center text-white/30 text-xs italic">
                No demo reel available.
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-8">
            <button className="flex-1 py-4 bg-[#d4af37] hover:bg-white text-black font-bold text-xs uppercase tracking-[0.2em] transition-colors rounded">
              Request Audition
            </button>
            <button className="px-4 border border-white/10 rounded hover:bg-white/5 text-white/50 hover:text-white transition-colors">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Styles for animation */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scale-in {
          animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
}

// --- SUB-COMPONENT: INLINE PLAYER ---
// Defined *outside* the main component to prevent re-creation on render
function InlinePlayer({ src }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration || 1;
      setProgress((current / total) * 100);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4 group hover:border-[#d4af37]/30 transition-colors">
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        className="hidden"
      />

      <button
        onClick={togglePlay}
        className="w-12 h-12 rounded-full bg-[#d4af37] flex items-center justify-center text-black hover:scale-105 transition-transform shadow-[0_0_20px_rgba(212,175,55,0.2)]"
      >
        {isPlaying ? (
          <Pause size={18} fill="currentColor" />
        ) : (
          <Play size={18} fill="currentColor" className="ml-1" />
        )}
      </button>

      <div className="flex-1 space-y-2">
        {/* Fake Waveform Visual */}
        <div className="h-8 flex items-center gap-0.5 opacity-50">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-[#d4af37] rounded-full transition-all duration-300"
              style={{
                height: isPlaying ? `${Math.random() * 100}%` : "20%",
                opacity: i / 30 < progress / 100 ? 1 : 0.2,
              }}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#d4af37] transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <button className="text-white/30 hover:text-white transition-colors">
        <Download size={18} />
      </button>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-white/30 mb-1">
        {label}
      </div>
      <div className="text-white/80 font-medium text-sm">{value}</div>
    </div>
  );
}
