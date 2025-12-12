"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Play, Pause, X, Star, Mic, Send, Search, Loader2 } from "lucide-react";

// 🟢 INITIALIZE SUPABASE
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function TalentRoster() {
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedActor, setSelectedActor] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [filter, setFilter] = useState("");

  // 🟢 AUDIO PLAYER REF
  const audioRef = React.useRef(null);

  // 🟢 FETCH REAL DATA
  useEffect(() => {
    const fetchActors = async () => {
      try {
        const { data, error } = await supabase
          .from("actors")
          .select("*")
          .order("created_at", { ascending: false }); // Newest first

        if (error) throw error;
        setActors(data || []);
      } catch (err) {
        console.error("Error fetching roster:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActors();
  }, []);

  // 🟢 HANDLE AUDIO PLAYBACK
  const toggleAudio = (url) => {
    if (!audioRef.current) {
      audioRef.current = new Audio(url);
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // If switching actors, update the source
      if (audioRef.current.src !== url) {
        audioRef.current.src = url;
      }
      audioRef.current.play();
      setIsPlaying(true);

      // Reset state when audio finishes
      audioRef.current.onended = () => setIsPlaying(false);
    }
  };

  // Stop audio when modal closes
  useEffect(() => {
    if (!selectedActor && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [selectedActor]);

  // FILTER LOGIC
  const filteredActors = actors.filter((actor) => {
    if (!filter) return true;
    const search = filter.toLowerCase();
    // Check name or tags (if tags exist)
    const matchesName = actor.name.toLowerCase().includes(search);
    const matchesTags =
      actor.tags &&
      actor.tags.some((tag) => tag.toLowerCase().includes(search));
    return matchesName || matchesTags;
  });

  return (
    <div className="min-h-screen bg-[#050510] text-white font-sans selection:bg-gold/30 pb-20">
      {/* HEADER */}
      <div className="relative py-20 px-6 text-center border-b border-white/5 bg-gradient-to-b from-midnight via-purple-900/10 to-transparent">
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gold to-white mb-6 animate-fade-in-up">
          The Roster
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-10 font-light tracking-wide">
          Curated voices for cinema-quality storytelling. <br />
          Click a talent to listen and request availability.
        </p>

        {/* SEARCH BAR */}
        <div className="max-w-md mx-auto relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-gold transition-colors" />
          <input
            type="text"
            placeholder="Search by name or style (e.g. 'Thriller')..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 text-white placeholder:text-gray-600 focus:border-gold outline-none transition-all focus:bg-black/40"
          />
        </div>
      </div>

      {/* ACTOR GRID */}
      <div className="max-w-7xl mx-auto px-6 pt-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gold/50">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <p className="uppercase tracking-widest text-xs">
              Loading Talent...
            </p>
          </div>
        ) : filteredActors.length === 0 ? (
          <div className="text-center py-20 text-gray-500 italic">
            No talent found. Try adjusting your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredActors.map((actor) => (
              <div
                key={actor.id}
                onClick={() => setSelectedActor(actor)}
                className="group relative cursor-pointer"
              >
                {/* IMAGE CONTAINER */}
                <div className="aspect-[3/4] overflow-hidden rounded-xl border border-white/10 relative shadow-2xl transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] bg-black">
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 z-10" />

                  {actor.image_url ? (
                    <img
                      src={actor.image_url}
                      alt={actor.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/5 text-gray-700">
                      No Image
                    </div>
                  )}

                  {/* OVERLAY INFO */}
                  <div className="absolute bottom-0 left-0 w-full p-4 z-20">
                    <h3 className="text-2xl font-serif font-bold text-white mb-1">
                      {actor.name}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {actor.tags &&
                        actor.tags.slice(0, 2).map((tag, i) => (
                          <span
                            key={i}
                            className="text-[9px] uppercase tracking-widest bg-gold/20 text-gold px-2 py-1 rounded border border-gold/10"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* HOVER PLAY ICON */}
                  <div className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]">
                    <div className="w-16 h-16 rounded-full bg-gold text-midnight flex items-center justify-center shadow-lg transform scale-50 group-hover:scale-100 transition-transform">
                      <Mic className="w-8 h-8" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🟢 TALENT MODAL */}
      {selectedActor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={() => setSelectedActor(null)}
          />

          {/* CONTENT */}
          <div className="relative bg-[#0a0a1a] border border-gold/20 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-scale-in max-h-[90vh]">
            {/* CLOSE BTN */}
            <button
              onClick={() => setSelectedActor(null)}
              className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full text-white hover:text-gold hover:bg-white/10 transition"
            >
              <X className="w-6 h-6" />
            </button>

            {/* LEFT: IMAGE */}
            <div className="w-full md:w-2/5 relative h-64 md:h-auto">
              <img
                src={selectedActor.image_url}
                className="w-full h-full object-cover"
                alt={selectedActor.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] md:bg-gradient-to-r md:from-transparent md:to-[#0a0a1a]" />
            </div>

            {/* RIGHT: DETAILS */}
            <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col h-full overflow-y-auto">
              <div className="mb-auto">
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-4xl font-serif font-bold text-white">
                    {selectedActor.name}
                  </h2>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 text-gold fill-gold" />
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedActor.tags &&
                    selectedActor.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs font-bold uppercase tracking-wider text-gray-400 border border-white/10 px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                </div>

                <p className="text-gray-300 leading-relaxed mb-8 text-sm md:text-base border-l-2 border-gold/50 pl-4 italic">
                  "{selectedActor.bio}"
                </p>
              </div>

              {/* REAL AUDIO PLAYER */}
              {selectedActor.demo_url ? (
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-6 flex items-center gap-4">
                  <button
                    onClick={() => toggleAudio(selectedActor.demo_url)}
                    className="w-12 h-12 rounded-full bg-gold hover:bg-white text-midnight transition-colors flex items-center justify-center shrink-0"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 fill-current" />
                    ) : (
                      <Play className="w-5 h-5 fill-current ml-1" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="text-xs font-bold uppercase text-gold mb-1">
                      Commercial Demo Reel
                    </div>
                    {/* AUDIO VISUALIZER (Animation) */}
                    <div className="flex items-center gap-0.5 h-6">
                      {[...Array(30)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 rounded-full transition-all duration-300 ${
                            isPlaying
                              ? "animate-music-bar bg-gold"
                              : "bg-gray-700"
                          }`}
                          style={{
                            height: isPlaying
                              ? `${Math.random() * 100}%`
                              : "30%",
                            animationDelay: `${i * 0.05}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-red-900/10 border border-red-500/20 p-4 rounded-xl mb-6 text-xs text-red-400 text-center uppercase tracking-widest">
                  No Audio Demo Available
                </div>
              )}

              {/* ACTION BUTTON */}
              <button
                onClick={() =>
                  (window.location.href = `mailto:casting@cinesonic.com?subject=Booking Request: ${selectedActor.name}`)
                }
                className="w-full bg-white/5 hover:bg-gold hover:text-midnight border border-gold/30 text-white font-bold py-4 rounded-lg uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 group"
              >
                <Send className="w-4 h-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                Request Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🟢 CSS FOR ANIMATIONS */}
      <style jsx>{`
        @keyframes music-bar {
          0%,
          100% {
            height: 20%;
          }
          50% {
            height: 100%;
          }
        }
        .animate-music-bar {
          animation: music-bar 0.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
