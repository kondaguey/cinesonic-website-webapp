"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  LayoutDashboard,
  Mic,
  Calendar,
  Users,
  FileSignature,
  Activity,
  MessageSquare,
  CheckCircle,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from "lucide-react";

// --- CHILD COMPONENTS ---
import ProjectHeader from "@/components/dashboard/ProductionHeader";

// --- TABS ---
import OverviewTab from "@/components/dashboard/tabs/Overview";
import CastingManager from "@/components/dashboard/tabs/CastingManager";
import TalentScheduler from "@/components/dashboard/tabs/TalentScheduler";
import CrewScheduler from "@/components/dashboard/tabs/CrewScheduler";
import ContractsManager from "@/components/dashboard/tabs/ContractsManager";
import WorkflowTracker from "@/components/dashboard/tabs/WorkflowTracker";
import CommunicationHub from "@/components/dashboard/tabs/CommunicationHub";
import OffboardingTab from "@/components/dashboard/tabs/Offboarding";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ProjectView({ projectId, onBack }) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [lastSave, setLastSave] = useState(Date.now());

  // 1. MASTER FETCH
  const fetchProject = useCallback(async () => {
    if (!projectId) {
      setLoading(false);
      return;
    }
    // Don't set loading=true here to avoid flickering on re-fetches
    try {
      const { data, error } = await supabase
        .from("active_productions")
        .select("*")
        .eq("project_ref_id", projectId)
        .single();

      if (error) throw error;
      setProject(data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Initial Load
  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  // 🟢 2. REALTIME LISTENER (The New Magic)
  useEffect(() => {
    if (!projectId) return;

    // Create the channel
    const channel = supabase
      .channel(`project_watch_${projectId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "active_productions",
          filter: `project_ref_id=eq.${projectId}`, // Only listen to THIS project
        },
        (payload) => {
          // payload.new contains the updated row from the DB
          console.log("⚡ Realtime Update Received!", payload.new);
          setProject(payload.new); // Instant Update on Screen
          setLastSave(Date.now()); // Update status indicator
        }
      )
      .subscribe();

    // Cleanup when component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId]);

  // 3. MASTER UPDATE
  const handleUpdate = async (updates) => {
    // Optimistic Update (Instant feedback for the user who clicked)
    setProject((prev) => ({ ...prev, ...updates }));

    // DB Update (Triggers the Realtime event for everyone else)
    const { error } = await supabase
      .from("active_productions")
      .update({ ...updates, updated_at: new Date() })
      .eq("project_ref_id", projectId);

    if (error) console.error("Save Error:", error);
    else setLastSave(Date.now());
  };

  if (loading)
    return (
      <div className="h-full flex items-center justify-center text-[#d4af37] animate-pulse">
        <Loader2 className="animate-spin mr-2" /> Connecting to Live Data...
      </div>
    );

  if (!project)
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-500">
        <AlertCircle size={48} className="mb-4 text-red-500 opacity-50" />
        <h2 className="text-xl font-serif text-white">Project Not Found</h2>
        <button
          onClick={onBack}
          className="mt-6 px-6 py-2 bg-white/5 border border-white/10 rounded-lg text-xs uppercase font-bold tracking-widest hover:bg-white/10 transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    );

  // TABS CONFIG
  const TABS = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "casting", label: "Casting", icon: Mic },
    { id: "talent_sched", label: "Talent Sched", icon: Calendar },
    { id: "crew_sched", label: "Crew Sched", icon: Users },
    { id: "contracts", label: "Contracts", icon: FileSignature },
    { id: "workflow", label: "Tracker", icon: Activity },
    { id: "comms", label: "Comms", icon: MessageSquare },
    { id: "offboard", label: "Offboard", icon: CheckCircle },
  ];

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4">
        <button
          onClick={onBack}
          className="flex items-center text-xs text-gray-500 hover:text-white uppercase tracking-widest w-fit group transition-colors"
        >
          <ArrowLeft
            size={14}
            className="mr-2 group-hover:-translate-x-1 transition-transform"
          />{" "}
          Back to Hub
        </button>
        <ProjectHeader
          project={project}
          onProjectUpdate={fetchProject}
          lastSynced={lastSave}
        />
      </div>

      {/* NAVIGATION BAR */}
      <div className="flex gap-2 border-b border-white/10 overflow-x-auto pb-1 custom-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "border-[#d4af37] text-[#d4af37] bg-[#d4af37]/5"
                : "border-transparent text-gray-500 hover:text-white hover:bg-white/5"
            }`}
          >
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT AREA */}
      <div className="flex-1 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20 custom-scrollbar">
        {activeTab === "overview" && <OverviewTab project={project} />}

        {activeTab === "casting" && (
          <CastingManager project={project} onUpdate={handleUpdate} />
        )}

        {activeTab === "talent_sched" && (
          <TalentScheduler project={project} onUpdate={handleUpdate} />
        )}

        {activeTab === "crew_sched" && (
          <CrewScheduler project={project} onUpdate={handleUpdate} />
        )}

        {activeTab === "contracts" && (
          <ContractsManager project={project} onUpdate={handleUpdate} />
        )}

        {activeTab === "workflow" && (
          <WorkflowTracker project={project} onUpdate={handleUpdate} />
        )}

        {activeTab === "comms" && (
          <CommunicationHub project={project} onUpdate={handleUpdate} />
        )}

        {activeTab === "offboard" && (
          <OffboardingTab project={project} onUpdate={handleUpdate} />
        )}
      </div>
    </div>
  );
}
