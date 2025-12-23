"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  LayoutDashboard,
  FileSignature,
  MessageSquare,
  Activity,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";

// --- TALENT TABS ---
import OverviewTab from "./tabs/Overview"; // Reused from Crew
import CommunicationHub from "./tabs/CommunicationHub"; // Reused
import WorkflowTracker from "./tabs/WorkflowTracker"; // Reused (Read Only)
// New Talent Specifics:
import ContractsManager from "./tabs/ContractsManager"; // We will modify/reuse to show "My Contract"
import TalentOffboarding from "./tabs/TalentOffboarding"; // Specific for Talent

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function TalentProjectView({ projectId, onBack, user }) {
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // REALTIME SETUP
  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("active_productions")
        .select("*")
        .eq("project_ref_id", projectId)
        .single();
      if (data) setProject(data);
    };
    fetch();

    const channel = supabase
      .channel(`talent_${projectId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "active_productions",
          filter: `project_ref_id=eq.${projectId}`,
        },
        (payload) => setProject(payload.new)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId]);

  // Update Wrapper (Restricted)
  const handleUpdate = async (updates) => {
    // Talent can only update correspondence (via chat) or specific flags
    // The components handle the logic, we just pass the updater
    await supabase
      .from("active_productions")
      .update(updates)
      .eq("project_ref_id", projectId);
  };

  if (!project)
    return <div className="p-10 text-gray-500">Loading Studio...</div>;

  const TABS = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "contracts", label: "My Contracts", icon: FileSignature },
    { id: "tracker", label: "Tracker", icon: Activity },
    { id: "comms", label: "Comms", icon: MessageSquare },
    { id: "offboard", label: "Offboarding", icon: CheckCircle },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-4 text-gray-500 text-xs uppercase tracking-widest">
        <button
          onClick={onBack}
          className="hover:text-[#00f0ff] flex items-center gap-1 transition-colors"
        >
          <ArrowLeft size={12} /> Projects
        </button>
        <span>/</span>
        <span className="text-[#00f0ff]">{project.title}</span>
      </div>

      {/* Nav */}
      <div className="flex gap-2 border-b border-white/10 overflow-x-auto pb-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "border-[#00f0ff] text-[#00f0ff] bg-[#00f0ff]/5"
                : "border-transparent text-gray-500 hover:text-white"
            }`}
          >
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="animate-fade-in">
        {activeTab === "overview" && <OverviewTab project={project} />}

        {/* Reusing Manager but could pass a prop 'viewMode="talent"' to hide other people's contracts */}
        {activeTab === "contracts" && (
          <ContractsManager project={project} onUpdate={handleUpdate} />
        )}

        {activeTab === "tracker" && <WorkflowTracker project={project} />}

        {activeTab === "comms" && (
          <CommunicationHub
            project={project}
            onUpdate={handleUpdate}
            variant="talent"
          />
        )}

        {activeTab === "offboard" && (
          <TalentOffboarding project={project} user={user} />
        )}
      </div>
    </div>
  );
}
