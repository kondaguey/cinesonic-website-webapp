import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Briefcase,
  Palette,
  BookOpen,
  Lock,
  Mail,
  CheckCircle,
} from "lucide-react";
import Button from "@/components/ui/Button";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function CrewScheduler({ project, onUpdate }) {
  const [rosters, setRosters] = useState({
    crew: [],
    artists: [],
    authors: [],
  });
  const crewManifest = project.crew_manifest || {};

  useEffect(() => {
    const fetchRosters = async () => {
      const [c, ar, au] = await Promise.all([
        supabase.from("team_about_public").select("*"),
        supabase.from("artist_roster_public").select("*"),
        supabase.from("author_roster_public").select("*"),
      ]);
      setRosters({
        crew: c.data || [],
        artists: ar.data || [],
        authors: au.data || [],
      });
    };
    fetchRosters();
  }, []);

  const handleUpdate = (key, field, value) => {
    const updatedCrew = {
      ...crewManifest,
      [key]: { ...(crewManifest[key] || { status: "Draft" }), [field]: value },
    };
    onUpdate({ crew_manifest: updatedCrew });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. CORE PRODUCTION */}
      <div>
        <h3 className="text-[#d4af37] text-xs font-bold uppercase tracking-widest border-b border-[#d4af37]/20 pb-2 mb-4 flex items-center gap-2">
          <Briefcase size={14} /> Core Production
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CrewCard
            label="Producer"
            id="producer"
            roster={rosters.crew}
            data={crewManifest["producer"]}
            onUpdate={handleUpdate}
          />
          <CrewCard
            label="Coordinator"
            id="coord"
            roster={rosters.crew}
            data={crewManifest["coord"]}
            onUpdate={handleUpdate}
          />
          <CrewCard
            label="Engineer"
            id="engineer"
            roster={rosters.crew}
            data={crewManifest["engineer"]}
            onUpdate={handleUpdate}
          />
          <CrewCard
            label="Proofer"
            id="proofer"
            roster={rosters.crew}
            data={crewManifest["proofer"]}
            onUpdate={handleUpdate}
          />
          <CrewCard
            label="Script Prep"
            id="script_prep"
            roster={rosters.crew}
            data={crewManifest["script_prep"]}
            onUpdate={handleUpdate}
          />
        </div>
      </div>

      {/* 2. CREATIVE */}
      <div>
        <h3 className="text-[#d4af37] text-xs font-bold uppercase tracking-widest border-b border-[#d4af37]/20 pb-2 mb-4 flex items-center gap-2">
          <Palette size={14} /> Creative Team
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CrewCard
            label="Cover Artist"
            id="artist"
            roster={rosters.artists}
            data={crewManifest["artist"]}
            onUpdate={handleUpdate}
          />
          <CrewCard
            label="Composer"
            id="music"
            roster={rosters.artists}
            data={crewManifest["music"]}
            onUpdate={handleUpdate}
          />
        </div>
      </div>

      {/* 3. AUTHORS */}
      <div>
        <h3 className="text-[#d4af37] text-xs font-bold uppercase tracking-widest border-b border-[#d4af37]/20 pb-2 mb-4 flex items-center gap-2">
          <BookOpen size={14} /> Authors
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CrewCard
            label="Primary Author"
            id="author_1"
            roster={rosters.authors}
            data={crewManifest["author_1"]}
            onUpdate={handleUpdate}
          />
          <CrewCard
            label="Co-Author"
            id="author_2"
            roster={rosters.authors}
            data={crewManifest["author_2"]}
            onUpdate={handleUpdate}
          />
        </div>
      </div>
    </div>
  );
}

const CrewCard = ({ label, id, roster, data = {}, onUpdate }) => {
  const isLocked = data.status === "Active";

  const handleSelect = (e) => {
    const person = roster.find((p) => p.id === e.target.value);
    if (person) {
      onUpdate(id, "name", person.display_name);
      onUpdate(id, "id", person.id);
      // Auto-fill email if available in public roster, otherwise wait for manual entry
    }
  };

  return (
    <div
      className={`p-4 rounded-xl border transition-all ${
        isLocked
          ? "bg-green-900/10 border-green-500/30"
          : "bg-[#0a0a0a] border-white/10"
      }`}
    >
      <div className="flex justify-between mb-2">
        <div className="text-[10px] text-gray-500 font-bold uppercase">
          {label}
        </div>
        {isLocked && <Lock size={10} className="text-green-500" />}
      </div>

      <select
        value={data.id || ""}
        onChange={handleSelect}
        className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-xs text-white mb-2 outline-none focus:border-[#d4af37]"
        disabled={isLocked}
      >
        <option value="">Select...</option>
        {roster.map((p) => (
          <option key={p.id} value={p.id}>
            {p.display_name} {p.job_title ? `(${p.job_title})` : ""}
          </option>
        ))}
      </select>

      <div className="relative mb-3">
        <Mail className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-600" />
        <input
          type="email"
          value={data.email || ""}
          onChange={(e) => onUpdate(id, "email", e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded pl-7 py-1.5 text-xs text-white outline-none focus:border-[#d4af37]"
          placeholder="Email..."
          disabled={isLocked}
        />
      </div>

      <Button
        onClick={() => onUpdate(id, "status", isLocked ? "Draft" : "Active")}
        color={isLocked ? "#ef4444" : "#22c55e"}
        variant={isLocked ? "ghost" : "glow"}
        className="w-full h-7 text-[9px]"
        disabled={!data.id}
      >
        {isLocked ? "Unlock" : "Lock Contract"}
      </Button>
    </div>
  );
};
