"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import {
  Mic,
  User,
  Save,
  ArrowLeft,
  Loader2,
  LayoutGrid,
  AlertCircle,
  Sparkles,
  Mic2,
} from "lucide-react";

// --- SUB-COMPONENTS ---
import ActorEditor from "@/components/dashboard/editors/ActorEditor";
import TalentProductionView from "@/components/dashboard/TalentProductionView";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ActorPortalPage() {
  const router = useRouter();

  // 1. STATE: View Control
  const [view, setView] = useState("studio"); // 'studio' | 'profile'
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  // 2. STATE: Data
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);

  // Lifted State for the Profile Editor
  const [formData, setFormData] = useState({ public: {}, private: {} });
  const [saving, setSaving] = useState(false);

  // 3. INITIALIZATION
  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return router.push("/");
      setUser(user);

      // A. Fetch Profile Data
      const [pub, priv] = await Promise.all([
        supabase
          .from("actor_roster_public")
          .select("*")
          .eq("id", user.id)
          .single(),
        supabase.from("actor_private").select("*").eq("id", user.id).single(),
      ]);

      // If they deleted their profile but are logged in, kick them out
      if (!pub.data && !priv.data) {
        alert("Access Denied: No Actor Profile found.");
        return router.push("/hub");
      }

      setFormData({
        public: pub.data || {},
        private: priv.data || {},
      });

      // B. Fetch Assigned Projects (THE FIX FOR OWNERSHIP USERS)
      // We explicitly check if OUR ID is in the 'visible_to_user_ids' array.
      // This forces the "Actor View" even if you are an Admin.
      const { data: projData } = await supabase
        .from("active_productions")
        .select("id, project_ref_id, title, production_status, client_name")
        .contains("visible_to_user_ids", [user.id])
        .order("updated_at", { ascending: false });

      if (projData) setProjects(projData);

      setLoading(false);
    };
    init();
  }, []);

  // 4. ACTIONS
  const handleSaveProfile = async () => {
    setSaving(true);
    // Simulating save delay for UX
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    // In real implementation: Call supabase.upsert here using formData
    alert("Profile Updated Successfully");
  };

  const toggleAvailability = async (e) => {
    const newVal = e.target.value;
    setFormData((prev) => ({
      ...prev,
      public: { ...prev.public, availability_status: newVal },
    }));
    await supabase
      .from("actor_roster_public")
      .update({ availability_status: newVal })
      .eq("id", user.id);
  };

  if (loading)
    return (
      <div className="h-screen bg-[#051a10] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#10b981_0%,_transparent_40%)] opacity-20 animate-pulse" />
        <Loader2 className="animate-spin text-[#00ff9d] w-12 h-12 mb-4 relative z-10" />
        <div className="text-[#00ff9d] font-mono text-xs tracking-[0.3em] relative z-10">
          OPENING GREEN ROOM...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#020d08] text-white font-sans pb-20 selection:bg-[#00ff9d] selection:text-black">
      {/* 🟢 AMBIENT LIGHTING FX */}
      <div className="fixed top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-[#00ff9d]/10 to-transparent pointer-events-none" />
      <div className="fixed -top-40 -right-40 w-96 h-96 bg-[#00ff9d]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-[0.03] pointer-events-none" />

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#020d08]/80 backdrop-blur-xl border-b border-[#00ff9d]/10 px-6 py-4 flex justify-between items-center shadow-[0_0_30px_rgba(0,255,157,0.05)]">
        {/* Left: Brand & Nav */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => router.push("/hub")}
            className="group flex items-center gap-2 text-[#00ff9d]/60 hover:text-[#00ff9d] transition-colors text-xs font-bold uppercase tracking-widest"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="hidden md:inline">Lobby</span>
          </button>

          <div className="w-px h-6 bg-[#00ff9d]/20 hidden md:block" />

          {/* THE MODE SWITCHER */}
          <div className="flex bg-black/40 p-1 rounded-lg border border-[#00ff9d]/20 relative">
            <button
              onClick={() => {
                setView("studio");
                setSelectedProjectId(null);
              }}
              className={`relative z-10 px-5 py-2 rounded-md text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                view === "studio"
                  ? "text-[#020d08]"
                  : "text-[#00ff9d]/60 hover:text-[#00ff9d]"
              }`}
            >
              <LayoutGrid size={14} /> Studio
            </button>
            <button
              onClick={() => setView("profile")}
              className={`relative z-10 px-5 py-2 rounded-md text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                view === "profile"
                  ? "text-[#020d08]"
                  : "text-[#00ff9d]/60 hover:text-[#00ff9d]"
              }`}
            >
              <User size={14} /> Profile
            </button>

            {/* Sliding Pill Background */}
            <div
              className={`absolute top-1 bottom-1 rounded bg-[#00ff9d] transition-all duration-300 shadow-[0_0_15px_#00ff9d]`}
              style={{
                left: view === "studio" ? "4px" : "50%",
                width: "calc(50% - 4px)",
              }}
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* Availability (Always Visible) */}
          <div
            className={`hidden md:flex items-center gap-2 px-3 py-1.5 border rounded-lg transition-all ${
              formData.public?.availability_status === "Available"
                ? "bg-[#00ff9d]/10 border-[#00ff9d]/30 shadow-[0_0_10px_rgba(0,255,157,0.1)]"
                : "bg-red-500/10 border-red-500/30"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                formData.public?.availability_status === "Available"
                  ? "bg-[#00ff9d] animate-pulse"
                  : "bg-red-500"
              }`}
            />
            <select
              value={formData.public?.availability_status || "Available"}
              onChange={toggleAvailability}
              className={`bg-transparent text-xs font-bold uppercase outline-none cursor-pointer ${
                formData.public?.availability_status === "Available"
                  ? "text-[#00ff9d]"
                  : "text-red-500"
              }`}
            >
              <option value="Available">Available</option>
              <option value="Booked Out">Booked Out</option>
            </select>
          </div>

          {/* Save Button (Profile Mode Only) */}
          {view === "profile" && (
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-[#00ff9d] hover:bg-white text-black text-xs font-black uppercase tracking-widest rounded-full transition-all shadow-[0_0_20px_rgba(0,255,157,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
            >
              {saving ? (
                <Loader2 className="animate-spin" size={14} />
              ) : (
                <Save size={14} />
              )}{" "}
              Save Rider
            </button>
          )}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto p-6 relative z-10">
        {/* VIEW A: PROFILE EDITOR */}
        {view === "profile" && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            {/* Note: Passing a Neon Theme to your existing component */}
            <ActorEditor
              formData={formData}
              setFormData={setFormData}
              theme={{
                inputBg: "bg-[#051a10]",
                border: "border-[#00ff9d]/20",
                text: "text-white",
                cardBg: "bg-[#020d08]/50 backdrop-blur-md",
              }}
            />
          </div>
        )}

        {/* VIEW B: THE GREEN ROOM (Studio) */}
        {view === "studio" && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            {!selectedProjectId ? (
              <div className="space-y-8">
                {/* Neon Welcome Banner */}
                <div className="relative p-8 rounded-3xl overflow-hidden border border-[#00ff9d]/20 bg-[#051a10]">
                  <div className="absolute top-0 right-0 p-8 opacity-20">
                    <Mic2 className="w-64 h-64 text-[#00ff9d] rotate-12" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 text-[#00ff9d] text-xs font-black uppercase tracking-[0.3em] mb-2">
                      <Sparkles size={14} /> Talent Dashboard
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif text-white mb-2">
                      The{" "}
                      <span className="text-[#00ff9d] drop-shadow-[0_0_10px_rgba(0,255,157,0.5)]">
                        Green Room
                      </span>
                    </h2>
                    <p className="text-gray-400 max-w-lg">
                      Welcome back, {formData.public?.display_name || "Talent"}.
                      Manage your active bookings, contracts, and communication
                      channels here.
                    </p>
                  </div>
                </div>

                {/* Project Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedProjectId(p.project_ref_id)}
                      className="group bg-[#020d08] border border-[#00ff9d]/20 hover:border-[#00ff9d] p-6 rounded-2xl cursor-pointer transition-all hover:-translate-y-1 relative overflow-hidden shadow-2xl hover:shadow-[0_0_30px_rgba(0,255,157,0.1)]"
                    >
                      {/* Card Glow */}
                      <div className="absolute inset-0 bg-gradient-to-b from-[#00ff9d]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                          <span className="inline-block px-2 py-1 rounded bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/20 text-[10px] font-bold uppercase tracking-widest">
                            {p.production_status}
                          </span>
                          <Mic
                            size={16}
                            className="text-[#00ff9d]/40 group-hover:text-[#00ff9d] transition-colors"
                          />
                        </div>

                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#00ff9d] transition-colors">
                          {p.title}
                        </h3>
                        <p className="text-xs text-gray-500 font-mono mb-6">
                          {p.client_name || "Internal Production"}
                        </p>

                        <div className="w-full py-3 bg-[#00ff9d]/10 border border-[#00ff9d]/20 rounded-lg flex items-center justify-center text-xs font-bold uppercase tracking-widest text-[#00ff9d] group-hover:bg-[#00ff9d] group-hover:text-black transition-all">
                          Enter Studio
                        </div>
                      </div>
                    </div>
                  ))}

                  {projects.length === 0 && (
                    <div className="col-span-full py-24 text-center border border-dashed border-[#00ff9d]/20 rounded-3xl bg-[#00ff9d]/5 flex flex-col items-center justify-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-[#00ff9d]/10 flex items-center justify-center text-[#00ff9d]">
                        <Sparkles size={32} />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg">
                          All Quiet on Set
                        </h3>
                        <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                          No active casting assignments found
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* THE WORKSPACE */
              <TalentProductionView
                projectId={selectedProjectId}
                onBack={() => setSelectedProjectId(null)}
                user={user}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
