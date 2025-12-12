"use client";
import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Play,
  Pause,
  X,
  Search,
  Loader2,
  VolumeX,
  ArrowRight,
  User,
} from "lucide-react";

// 🟢 INITIALIZE SUPABASE
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function TalentRoster() {
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedActor, setSelectedActor] = useState(null);

  // Audio State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [filter, setFilter] = useState("");
  const audioRef = useRef(null);

  // 🟢 HELPER: SUPER CLEANER FOR TAGS
  // Handles: ["A", "B"] or "A, B" or ["A""B"] (The bug you saw)
  const parseTags = (input) => {
    if (!input) return [];
    if (Array.isArray(input)) return input;

    // 1. Convert to string
    let str = String(input);

    // 2. Remove brackets [ ]
    str = str.replace(/[\[\]]/g, "");

    // 3. Replace double quotes " with commas (Fixes the "Tag""Tag" bug)
    str = str.replace(/"/g, ",");

    // 4. Split by comma, trim, and remove empty strings
    return str
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  };

  // 🟢 FETCH DATA
  useEffect(() => {
    const fetchActors = async () => {
      try {
        const { data, error } = await supabase
          .from("actor_db")
          .select("*")
          .eq("status", "Active")
          .order("name", { ascending: true });

        if (error) throw error;

        const normalized = (data || []).map((a) => ({
          ...a,
          final_audio: a.demo_url || a.demo || a.audio_url || null,
          // 🟢 USE THE NEW CLEANER HERE
          final_voices: parseTags(a.voice_type),
          final_genres: parseTags(a.genres),
        }));

        setActors(normalized);
      } catch (err) {
        console.error("Error fetching roster:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActors();
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

  const filteredActors = actors.filter((actor) => {
    if (!filter) return true;
    const search = filter.toLowerCase();
    const name = actor.name?.toLowerCase() || "";
    const vTags = (actor.final_voices || []).join(" ");
    const gTags = (actor.final_genres || []).join(" ");
    const tags = (vTags + " " + gTags).toLowerCase();
    return name.includes(search) || tags.includes(search);
  });

  return (
    <div className="min-h-screen bg-[#050510] text-white font-sans selection:bg-gold/30 pb-20">
      {/* HEADER */}
      <div className="relative py-16 px-6 md:py-20 text-center border-b border-white/5 bg-gradient-to-b from-midnight via-purple-900/10 to-transparent">
        <h1 className="text-4xl md:text-7xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gold to-white mb-4 md:mb-6 animate-fade-in-up">
          The Roster
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-lg mb-8 font-light tracking-wide">
          Curated voices for cinema-quality storytelling.
        </p>

        {/* SEARCH */}
        <div className="max-w-md mx-auto relative group z-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-gold transition-colors" />
          <input
            type="text"
            placeholder="Search by name, genre, or style..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 text-white text-sm md:text-base placeholder:text-gray-600 focus:border-gold outline-none transition-all focus:bg-black/40 shadow-lg"
          />
        </div>
      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gold/50">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <p className="uppercase tracking-widest text-xs">
              Loading Talent...
            </p>
          </div>
        ) : filteredActors.length === 0 ? (
          <div className="text-center py-20 text-gray-500 italic border border-dashed border-white/10 rounded-xl">
            No active talent found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {filteredActors.map((actor) => (
              <div
                key={actor.id}
                onClick={() => setSelectedActor(actor)}
                className="group relative cursor-pointer"
              >
                {/* IMAGE CONTAINER */}
                <div className="aspect-[3/4] overflow-hidden rounded-xl border border-white/10 relative shadow-2xl transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] bg-black">
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />

                  {actor.headshot_url ? (
                    <img
                      src={actor.headshot_url}
                      alt={actor.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-white/5 text-gray-700 text-xs uppercase tracking-widest gap-2">
                      <UserPlaceholder />
                      <span>No Headshot</span>
                    </div>
                  )}

                  {/* OVERLAY INFO */}
                  <div className="absolute bottom-0 left-0 w-full p-4 z-20">
                    <h3 className="text-xl md:text-2xl font-serif font-bold text-white mb-1 drop-shadow-md">
                      {actor.name}
                    </h3>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {(actor.final_voices || []).slice(0, 2).map((tag, i) => (
                        <span
                          key={i}
                          className="text-[9px] uppercase tracking-widest bg-gold/20 text-gold px-2 py-1 rounded border border-gold/10 backdrop-blur-sm"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>

                    {/* VIEW PROFILE CTA */}
                    <div className="pt-3 border-t border-white/20 flex items-center justify-between group-hover:border-gold/50 transition-colors">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300 group-hover:text-gold transition-colors">
                        View Profile
                      </span>
                      <ArrowRight
                        size={14}
                        className="text-gray-400 group-hover:text-gold group-hover:translate-x-1 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {selectedActor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm animate-fade-in"
            onClick={() => setSelectedActor(null)}
          />

          <div className="relative bg-[#0a0a1a] border border-gold/20 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-scale-in max-h-[85vh] md:max-h-[90vh]">
            <button
              onClick={() => setSelectedActor(null)}
              className="absolute top-4 right-4 z-50 p-2 bg-black/60 backdrop-blur-md rounded-full text-white hover:text-gold hover:bg-white/10 transition shadow-lg"
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
                <div className="flex flex-wrap gap-2 text-gold/80 text-xs md:text-sm uppercase tracking-widest font-bold">
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

              {selectedActor.bio && (
                <div className="mb-6 md:mb-8">
                  <p className="text-base md:text-lg text-white/90 font-light leading-relaxed italic border-l-2 border-gold pl-4">
                    {selectedActor.bio}
                  </p>
                </div>
              )}

              {/* AUDIO PLAYER */}
              {selectedActor.final_audio ? (
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl mb-8 flex flex-col gap-2">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={(e) => toggleAudio(selectedActor.final_audio, e)}
                      className="w-10 h-10 bg-gold hover:bg-white text-midnight rounded-full flex items-center justify-center transition-colors shrink-0"
                    >
                      {isPlaying &&
                      audioRef.current?.src === selectedActor.final_audio ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-1" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex justify-between text-[10px] uppercase font-bold text-gold tracking-widest mb-1">
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
                        className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-gold [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
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

              <div className="space-y-6 text-sm text-gray-300 font-light leading-relaxed">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-gold text-xs font-bold uppercase tracking-widest mb-2 border-b border-white/10 pb-1">
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
                    <h4 className="text-gold text-xs font-bold uppercase tracking-widest mb-2 border-b border-white/10 pb-1">
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
                    <h4 className="text-gold text-xs font-bold uppercase tracking-widest mb-2 border-b border-white/10 pb-1">
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
                  className="bg-gold text-midnight hover:bg-white hover:scale-105 border border-gold hover:border-white px-8 py-4 rounded-lg uppercase tracking-widest text-xs font-bold transition-all shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:shadow-[0_0_25px_rgba(255,255,255,0.6)]"
                >
                  Request Availability
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const UserPlaceholder = () => (
  <svg
    className="w-12 h-12 text-gray-600 opacity-50 mb-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);
