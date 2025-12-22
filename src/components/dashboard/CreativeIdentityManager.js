"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import {
  Mic,
  Palette,
  BookOpen,
  Plus,
  ExternalLink,
  Loader2,
  ShieldAlert,
  UserCog,
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ACCEPT USERID PROP
export default function CreativeIdentityManager({ userId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState({
    actor: false,
    artist: false,
    author: false,
  });
  const [creating, setCreating] = useState(null);

  // 1. AUDIT IDENTITIES (Run whenever userId changes)
  useEffect(() => {
    if (userId) {
      checkIdentities();
    }
  }, [userId]);

  const checkIdentities = async () => {
    setLoading(true);
    try {
      // Run parallel checks against the public roster tables for the SELECTED USER
      const [actorCheck, artistCheck, authorCheck] = await Promise.all([
        supabase
          .from("actor_roster_public")
          .select("id")
          .eq("id", userId)
          .single(),
        supabase
          .from("artist_roster_public")
          .select("id")
          .eq("id", userId)
          .single(),
        supabase
          .from("author_roster_public")
          .select("id")
          .eq("id", userId)
          .single(),
      ]);

      setProfiles({
        actor: !!actorCheck.data,
        artist: !!artistCheck.data,
        author: !!authorCheck.data,
      });
    } catch (err) {
      console.error("Identity check failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. CREATE NEW IDENTITY (For the selected user)
  const createProfile = async (type) => {
    setCreating(type);
    try {
      // Fetch the user's name to use as default display name
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", userId)
        .single();

      const displayName = profile?.full_name || "New Talent Profile";

      let table = "";
      if (type === "actor") table = "actor_roster_public";
      if (type === "artist") table = "artist_roster_public";
      if (type === "author") table = "author_roster_public";

      // Insert with the SELECTED userId
      const { error } = await supabase.from(table).insert({
        id: userId,
        display_name: displayName,
        updated_at: new Date(),
      });

      if (error) throw error;

      // Refresh checks
      await checkIdentities();
    } catch (err) {
      alert(`Failed to initialize ${type} profile: ${err.message}`);
    } finally {
      setCreating(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 border border-white/10 rounded-2xl bg-[#0a0a0a] flex flex-col items-center justify-center text-center gap-2">
        <Loader2 className="animate-spin text-gray-500" size={20} />
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          Auditing Database...
        </span>
      </div>
    );
  }

  return (
    <div className="p-5 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <UserCog className="text-cyan-500" size={18} />
          <h3 className="text-white font-serif text-lg">Force Initialize</h3>
        </div>
        <span className="text-[9px] bg-cyan-900/30 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded uppercase tracking-wider">
          Admin Mode
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {/* ACTOR */}
        <IdentityCard
          type="actor"
          label="Actor Portal"
          isActive={profiles.actor}
          isCreating={creating === "actor"}
          icon={Mic}
          colorClass="text-cyan-400"
          bgClass="bg-cyan-500/20"
          onManage={() => router.push(`/actor-portal?impersonate=${userId}`)}
          onCreate={() => createProfile("actor")}
        />

        {/* ARTIST */}
        <IdentityCard
          type="artist"
          label="Artist Portal"
          isActive={profiles.artist}
          isCreating={creating === "artist"}
          icon={Palette}
          colorClass="text-pink-400"
          bgClass="bg-pink-500/20"
          onManage={() => router.push(`/artist-portal?impersonate=${userId}`)}
          onCreate={() => createProfile("artist")}
        />

        {/* AUTHOR */}
        <IdentityCard
          type="author"
          label="Author Portal"
          isActive={profiles.author}
          isCreating={creating === "author"}
          icon={BookOpen}
          colorClass="text-orange-400"
          bgClass="bg-orange-500/20"
          onManage={() => router.push(`/author-portal?impersonate=${userId}`)}
          onCreate={() => createProfile("author")}
        />
      </div>
    </div>
  );
}

const IdentityCard = ({
  label,
  isActive,
  isCreating,
  icon: Icon,
  colorClass,
  bgClass,
  onManage,
  onCreate,
}) => (
  <div
    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
      isActive
        ? "bg-white/5 border-white/10"
        : "bg-black/40 border-white/5 opacity-60"
    }`}
  >
    <div className="flex items-center gap-3">
      <div
        className={`p-2 rounded-md ${isActive ? bgClass : "bg-gray-800"} ${
          isActive ? colorClass : "text-gray-500"
        }`}
      >
        <Icon size={16} />
      </div>
      <div>
        <div
          className={`text-xs font-bold ${
            isActive ? "text-white" : "text-gray-400"
          }`}
        >
          {label}
        </div>
        <div className="text-[9px] text-gray-500 uppercase tracking-wide">
          {isActive ? "Active" : "Missing"}
        </div>
      </div>
    </div>
    {isActive ? (
      <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
    ) : (
      <button
        onClick={onCreate}
        disabled={isCreating}
        className="p-2 hover:bg-white/10 rounded text-white transition-colors"
      >
        {isCreating ? (
          <Loader2 className="animate-spin" size={14} />
        ) : (
          <Plus size={14} />
        )}
      </button>
    )}
  </div>
);
