"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import {
  Mic,
  Activity,
  Globe,
  Award,
  UserCheck,
  Fingerprint,
  ArrowRight,
  Layers,
  Loader2,
  User,
  Play,
  Pause,
  X,
  VolumeX,
} from "lucide-react";

// 🟢 INITIALIZE SUPABASE
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function BestActorsPage() {
  const [featuredTalent, setFeaturedTalent] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🟢 MODAL & AUDIO STATE
  const [selectedActor, setSelectedActor] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  // 🟢 HELPER: CLEAN TAGS
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

  // 🟢 FETCH & SHUFFLE DATA
  useEffect(() => {
    const fetchTalent = async () => {
      try {
        const { data, error } = await supabase
          .from("actor_db")
          .select("*")
          .eq("status", "Active");

        if (error) throw error;

        const normalized = (data || []).map((a) => ({
          ...a,
          final_audio: a.demo_url || a.demo || a.audio_url || null,
          final_voices: parseTags(a.voice_type),
          final_genres: parseTags(a.genres),
        }));

        // Fisher-Yates Shuffle
        for (let i = normalized.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [normalized[i], normalized[j]] = [normalized[j], normalized[i]];
        }

        setFeaturedTalent(normalized.slice(0, 6));
      } catch (err) {
        console.error("Error fetching teaser:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTalent();
  }, []);

  // 🟢 AUDIO ENGINE
  const setupAudioListeners = (audio) => {
    audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
    audio.onloadedmetadata = () => setDuration(audio.duration);
    audio.onended = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
  };

  const toggleAudio = (url, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!url) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(url);
      setupAudioListeners(audioRef.current);
    }

    if (audioRef.current.src !== url) {
      audioRef.current.pause();
      audioRef.current.src = url;
      setCurrentTime(0);
      setIsPlaying(false);
      setupAudioListeners(audioRef.current);
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((err) => console.log("Audio Error:", err));
      setIsPlaying(true);
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };
  }, []);

  return (
    <main className="relative min-h-screen w-full bg-[#050505] overflow-x-hidden selection:bg-[#d4af37]/30 font-sans">
      {/* --- 1. CINEMATIC BACKGROUND --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[70vw] h-[80vh] bg-gradient-to-b from-[#d4af37]/5 to-transparent blur-[150px] rounded-full opacity-30" />
        <div className="absolute bottom-0 left-0 w-[50vw] h-[60vh] bg-indigo-950/10 blur-[150px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>

      {/* --- 2. HERO --- */}
      <section className="relative z-10 pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end gap-12 md:gap-24">
            <div className="w-full md:w-2/3">
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/10 bg-white/5 rounded-full mb-6">
                <UserCheck size={12} className="text-[#d4af37]" />
                <span className="text-[10px] tracking-[0.2em] uppercase text-white/60 font-medium">
                  Talent Roster
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-serif text-white tracking-tight leading-[1.1]">
                We don't hire <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-white to-[#d4af37]">
                  readers.
                </span>
              </h1>
            </div>
            <div className="w-full md:w-1/3 pb-2">
              <p className="text-lg text-white/70 font-light leading-relaxed border-l border-[#d4af37]/50 pl-6">
                Reading is functional.{" "}
                <strong className="text-white">Acting is visceral.</strong> We
                scour the globe for the artists who can do more than pronounce
                words—they inhabit souls.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. STATS --- */}
      <section className="relative z-10 py-20 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-2">
            <div className="text-5xl md:text-6xl font-serif text-white/20 font-bold">
              5k+
            </div>
            <h3 className="text-[#d4af37] uppercase tracking-widest text-xs font-bold">
              Auditions Reviewed
            </h3>
          </div>
          <div className="space-y-2">
            <div className="text-5xl md:text-6xl font-serif text-white/20 font-bold">
              1%
            </div>
            <h3 className="text-[#d4af37] uppercase tracking-widest text-xs font-bold">
              Acceptance Rate
            </h3>
          </div>
          <div className="space-y-2">
            <div className="text-5xl md:text-6xl font-serif text-white/20 font-bold">
              0
            </div>
            <h3 className="text-[#d4af37] uppercase tracking-widest text-xs font-bold">
              AI Voices
            </h3>
          </div>
        </div>
      </section>

      {/* --- 4. THE ANATOMY SECTION (Moved Back Up) --- */}
      <section className="relative z-10 py-32 px-6 bg-white/[0.02] border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center">
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">
              The <span className="italic text-[#d4af37]">Standard</span>.
            </h2>
            <p className="text-white/60 text-lg max-w-xl mx-auto font-light">
              A CineSonic actor requires a specific combination of technical
              skill and emotional intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnatomyCard
              icon={Mic}
              title="Texture"
              desc="A voice that isn't just clear, but has grain, weight, and history."
            />
            <AnatomyCard
              icon={Activity}
              title="Stamina"
              desc="Maintaining energy and consistency over 15+ hour epics."
            />
            <AnatomyCard
              icon={Globe}
              title="Dialect"
              desc="Accents that are native-level accurate, never caricatures."
            />
            <AnatomyCard
              icon={Fingerprint}
              title="Range"
              desc="Creating 20+ unique character voices that are instantly identifiable."
            />
          </div>
        </div>
      </section>

      {/* --- 5. LIVE ROSTER SHOWCASE (Moved To Bottom) --- */}
      <section className="relative z-10 py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-serif text-white">
              Featured <span className="italic text-[#d4af37]">Talent</span>
            </h2>
            <div className="flex gap-2 items-center">
              <div className="h-2 w-2 rounded-full bg-[#d4af37] animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest text-white/50">
                Random Selection
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-80 border border-dashed border-white/10 rounded-2xl bg-white/5">
              <div className="flex flex-col items-center text-[#d4af37]">
                <Loader2 className="animate-spin mb-3 w-8 h-8" />
                <span className="text-xs uppercase tracking-widest">
                  Accessing Vault...
                </span>
              </div>
            </div>
          ) : (
            /* ADDED pt-10 to prevent hover clipping */
            <div className="flex gap-8 overflow-x-auto pb-12 pt-10 snap-x snap-mandatory no-scrollbar">
              {featuredTalent.map((actor) => (
                <div
                  key={actor.id}
                  onClick={() => setSelectedActor(actor)}
                  className="snap-center shrink-0 w-[300px] h-[420px] relative group bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden hover:border-[#d4af37]/40 transition-all duration-500 hover:-translate-y-4 shadow-xl hover:shadow-[0_20px_40px_-10px_rgba(212,175,55,0.1)] cursor-pointer"
                >
                  {/* Image Layer */}
                  <div className="absolute inset-0 bg-[#050505]">
                    {actor.headshot_url ? (
                      <img
                        src={actor.headshot_url}
                        alt={actor.name}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-white/20">
                        <User size={50} strokeWidth={1} />
                      </div>
                    )}
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-500" />

                  {/* Content */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <h3 className="text-2xl font-serif text-white mb-2 group-hover:text-[#d4af37] transition-colors">
                      {actor.name}
                    </h3>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {(actor.final_voices || []).slice(0, 2).map((tag, i) => (
                        <span
                          key={i}
                          className="text-[10px] uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full text-white/80 border border-white/5 backdrop-blur-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {/* 'View All' Card */}
              <Link
                href="/roster"
                className="snap-center shrink-0 w-[300px] h-[420px] relative group bg-[#d4af37] rounded-2xl overflow-hidden flex flex-col items-center justify-center text-center cursor-pointer hover:-translate-y-4 transition-transform duration-500 shadow-xl"
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                <div className="relative z-10 p-8 text-black">
                  <Layers size={48} className="mx-auto mb-6" />
                  <h3 className="text-3xl font-serif font-bold mb-2">
                    View All
                  </h3>
                  <p className="text-sm font-medium opacity-80">
                    Access Full Roster
                  </p>
                  <div className="mt-8 w-12 h-12 mx-auto rounded-full border border-black/20 flex items-center justify-center group-hover:scale-110 transition-transform bg-black/5">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* --- 6. CTA --- */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-10">
            Ready to find your voice?
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <Link
              href="/roster"
              className="inline-flex items-center gap-3 px-10 py-4 bg-[#d4af37] text-black font-bold text-sm uppercase tracking-widest rounded-full hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(212,175,55,0.3)]"
            >
              Browse The Roster <ArrowRight size={18} />
            </Link>
            <Link
              href="/projectform"
              className="text-white/60 text-sm hover:text-white border-b border-transparent hover:border-white transition-all pb-1"
            >
              Or let us cast for you
            </Link>
          </div>
        </div>
      </section>

      {/* --- MODAL (RESTORED TO EXACT ROSTER MATCH) --- */}
      {selectedActor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm animate-fade-in"
            onClick={() => setSelectedActor(null)}
          />

          <div className="relative bg-[#0a0a1a] border border-[#d4af37]/20 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-scale-in max-h-[85vh] md:max-h-[90vh]">
            <button
              onClick={() => setSelectedActor(null)}
              className="absolute top-4 right-4 z-50 p-2 bg-black/60 backdrop-blur-md rounded-full text-white hover:text-[#d4af37] hover:bg-white/10 transition shadow-lg"
            >
              <X className="w-6 h-6" />
            </button>

            {/* LEFT: IMAGE */}
            <div className="w-full md:w-1/3 relative h-64 md:h-auto shrink-0 bg-black">
              {selectedActor.headshot_url ? (
                <img
                  src={selectedActor.headshot_url}
                  className="w-full h-full object-cover object-top grayscale"
                />
              ) : (
                <div className="w-full h-full bg-white/5 flex items-center justify-center text-gray-600">
                  No Image
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] to-transparent md:bg-gradient-to-r" />
            </div>

            {/* RIGHT: INFO */}
            <div className="flex-1 p-6 md:p-12 overflow-y-auto custom-scrollbar">
              <div className="mb-6 md:mb-8 pr-10 md:pr-0">
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-2 leading-tight">
                  {selectedActor.name}
                </h2>

                {/* 1. RESTORED: Union / Gender / Age */}
                <div className="flex flex-wrap gap-2 text-[#d4af37]/80 text-xs md:text-sm uppercase tracking-widest font-bold">
                  {selectedActor.union_status && (
                    <span>{selectedActor.union_status}</span>
                  )}
                  {selectedActor.gender && (
                    <span>• {selectedActor.gender}</span>
                  )}
                  {selectedActor.age_range && (
                    <span>
                      •{" "}
                      {Array.isArray(selectedActor.age_range)
                        ? selectedActor.age_range.join(", ")
                        : selectedActor.age_range}
                    </span>
                  )}
                </div>
              </div>

              {/* 2. RESTORED: Bio */}
              {selectedActor.bio && (
                <div className="mb-6 md:mb-8">
                  <p className="text-base md:text-lg text-white/90 font-light leading-relaxed italic border-l-2 border-[#d4af37] pl-4">
                    {selectedActor.bio}
                  </p>
                </div>
              )}

              {/* 3. RESTORED: Audio Player */}
              {selectedActor.final_audio ? (
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl mb-8 flex flex-col gap-2">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={(e) => toggleAudio(selectedActor.final_audio, e)}
                      className="w-10 h-10 bg-[#d4af37] hover:bg-white text-black rounded-full flex items-center justify-center transition-colors shrink-0"
                    >
                      {isPlaying &&
                      audioRef.current?.src === selectedActor.final_audio ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-1" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex justify-between text-[10px] uppercase font-bold text-[#d4af37] tracking-widest mb-1">
                        <span>Primary Demo</span>
                        <span>
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[#d4af37] [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                        style={{
                          background: `linear-gradient(to right, #d4af37 ${
                            (currentTime / duration) * 100
                          }%, rgba(255,255,255,0.1) ${
                            (currentTime / duration) * 100
                          }%)`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white/5 border border-white/10 border-dashed p-4 rounded-xl mb-8 flex items-center gap-4 opacity-50">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-gray-500">
                    <VolumeX size={18} />
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                    No Audio Available
                  </div>
                </div>
              )}

              {/* 4. RESTORED: Full Details Grid (Voices, Genres, Experience) */}
              <div className="space-y-6 text-sm text-gray-300 font-light leading-relaxed">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-2 border-b border-white/10 pb-1">
                      Voice Types
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(selectedActor.final_voices || []).map((tag, i) => (
                        <span
                          key={i}
                          className="bg-white/5 px-2 py-1 rounded text-xs border border-white/5"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-2 border-b border-white/10 pb-1">
                      Genres
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(selectedActor.final_genres || []).map((tag, i) => (
                        <span
                          key={i}
                          className="bg-white/5 px-2 py-1 rounded text-xs border border-white/5"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {(selectedActor.training_notes ||
                  selectedActor.audiobooks_narrated) && (
                  <div>
                    <h4 className="text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-2 border-b border-white/10 pb-1">
                      Experience
                    </h4>
                    {selectedActor.audiobooks_narrated && (
                      <p className="mb-2 font-bold text-white">
                        {selectedActor.audiobooks_narrated} Audiobooks Narrated
                      </p>
                    )}
                    <p className="text-xs opacity-70 whitespace-pre-wrap">
                      {selectedActor.training_notes}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                <button
                  onClick={() =>
                    (window.location.href = `mailto:casting@cinesonicaudiobooks.com?subject=Availability Request: ${selectedActor.name}`)
                  }
                  className="bg-[#d4af37] text-black hover:bg-white hover:scale-105 border border-[#d4af37] hover:border-white px-8 py-4 rounded-lg uppercase tracking-widest text-xs font-bold transition-all shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:shadow-[0_0_25px_rgba(255,255,255,0.6)]"
                >
                  Request Availability
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// --- SUB COMPONENT ---
function AnatomyCard({ icon: Icon, title, desc }) {
  return (
    <div className="group relative p-10 h-80 flex flex-col justify-between bg-[#0a0a0a] border border-white/10 overflow-hidden transition-all duration-500 hover:border-[#d4af37]/50 rounded-xl">
      <div className="absolute inset-0 bg-gradient-to-b from-[#d4af37]/0 to-[#d4af37]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <div className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-full mb-6 text-[#d4af37] group-hover:scale-110 transition-transform">
          <Icon size={24} />
        </div>
        <h3 className="text-2xl font-serif text-white mb-3">{title}</h3>
      </div>
      <div className="relative z-10 opacity-60 group-hover:opacity-100 transition-all duration-500">
        <p className="text-base leading-relaxed text-white font-light">
          {desc}
        </p>
      </div>
    </div>
  );
}
