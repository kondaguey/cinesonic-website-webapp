"use client";

import React, { useState, useEffect } from "react";
import { Search, Sparkles } from "lucide-react"; // Added for UI polish
import { supabase } from "../../../../lib/supabaseClient";

// --- COMPONENTS ---
import MainRoster from "../../../../components/marketing/MainRoster";
import ActorModal from "../../../../components/marketing/ActorModal";
import Navbar from "../../../../components/marketing/Navbar";
import Footer from "../../../../components/marketing/Footer";

export default function RosterPage() {
  const [actors, setActors] = useState([]);
  const [selectedActor, setSelectedActor] = useState(null);
  const [loading, setLoading] = useState(true);

  // Optional: Simple search filter state
  const [searchTerm, setSearchTerm] = useState("");

  // --- 1. DATA FETCHING & MAPPING ---
  useEffect(() => {
    async function fetchActors() {
      try {
        setLoading(true);

        // Fetch from Supabase
        const { data, error } = await supabase
          .from("actor_db")
          .select("*")
          .order("id", { ascending: true }); // Or 'created_at'

        if (error) throw error;

        // --- HELPER: Clean up tags like '["Hero", "Villain"]' ---
        const cleanVoiceType = (rawInput) => {
          if (!rawInput) return "Voice Actor";
          try {
            if (rawInput.trim().startsWith("[")) {
              // Parse JSON array and join with a bullet point
              const parsed = JSON.parse(rawInput.replace(/'/g, '"'));
              return parsed.join("  •  ");
            }
            return rawInput;
          } catch (e) {
            // Fallback: remove brackets
            return rawInput.replace(/[\[\]"]/g, "");
          }
        };

        // --- THE MAPPING STEP (Cooking the data) ---
        const mappedActors = (data || []).map((actor) => ({
          ...actor,
          // Logic: If 'coming_soon' is true, they are NOT revealed
          isRevealed: !actor.coming_soon,
          // Map snake_case (DB) to camelCase (Component)
          roleName: cleanVoiceType(actor.voice_type),
          headshotUrl: actor.headshot_url,
        }));

        setActors(mappedActors);
      } catch (err) {
        console.error("Error fetching roster:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchActors();
  }, []);

  // --- 2. FILTER LOGIC ---
  const filteredActors = actors.filter(
    (actor) =>
      actor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      actor.roleName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#020014] text-white font-sans selection:bg-cyan-500/30">
      {/* BACKGROUND DECORATION */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Top Gold/Purple Glow */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-purple-900/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-amber-500/5 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="relative z-10">
        <main className="max-w-7xl mx-auto px-6 pt-20 pb-32">
          {/* --- HERO HEADER --- */}
          <div className="text-center mb-16 space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-bold tracking-[0.2em] uppercase">
              <Sparkles size={12} />
              <span>Elite Talent</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-serif text-white tracking-tight drop-shadow-2xl">
              The{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">
                Roster
              </span>
            </h1>

            <p className="text-lg text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
              Curated voices for cinematic audio. From gritty anti-heroes to
              ethereal narrators, find the perfect frequency for your story.
            </p>

            {/* SEARCH BAR */}
            <div className="max-w-md mx-auto relative mt-8 group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-500 group-focus-within:text-amber-400 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search by name or archetype..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all placeholder:text-gray-600"
              />
            </div>
          </div>

          {/* --- CONTENT AREA --- */}
          {loading ? (
            // LOADING STATE
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-16 h-16 border-4 border-white/5 border-t-amber-500 rounded-full animate-spin mb-6" />
              <p className="text-amber-500 text-xs font-bold tracking-widest uppercase animate-pulse">
                Initializing Roster Data...
              </p>
            </div>
          ) : (
            // GRID STATE
            <div className="animate-fade-in">
              {filteredActors.length > 0 ? (
                <MainRoster
                  actors={filteredActors}
                  onSelectActor={setSelectedActor}
                />
              ) : (
                <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
                  <p className="text-gray-500">
                    No actors found matching "{searchTerm}"
                  </p>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="mt-4 text-amber-400 hover:text-amber-300 text-sm font-bold underline underline-offset-4"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* --- MODAL --- */}
      {selectedActor && (
        <ActorModal
          actor={selectedActor}
          onClose={() => setSelectedActor(null)}
        />
      )}
    </div>
  );
}
