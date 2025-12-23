"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import AccountModal from "@/components/dashboard/AccountModal";
import {
  ArrowLeft,
  Briefcase,
  Palette,
  ShieldAlert,
  ArrowRight,
  UserCog,
} from "lucide-react";
import Link from "next/link";

// --- COMPONENTS ---
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardStats from "@/components/dashboard/DashboardStats";
import TalentManager from "@/components/dashboard/TalentManager";
import IntakeRequests from "@/components/dashboard/IntakeRequests";

// 🟢 THE NEW ORCHESTRATOR IMPORT
import ProjectView from "@/components/dashboard/ProductionView";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// 🟢 BACKGROUND
const DASHBOARD_BG =
  "bg-[radial-gradient(ellipse_at_top_left,_#1a1a2e_0%,_#020010_100%)]";

// --- INLINE: SIMPLE TABLE MANAGER (Kept for Crew/Artist lists) ---
const SimpleTableManager = ({ title, data, type, onBack }) => (
  <div
    className={`p-8 animate-fade-in w-full h-full overflow-y-auto ${DASHBOARD_BG}`}
  >
    <div className="flex items-center gap-4 mb-8">
      <button
        onClick={onBack}
        className="text-gray-400 hover:text-[#d4af37] transition-colors"
      >
        <ArrowLeft />
      </button>
      <h2 className="text-3xl font-serif text-[#d4af37]">{title}</h2>
    </div>
    <div className="bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
      <table className="w-full text-left text-sm text-gray-400">
        <thead className="bg-white/5 text-xs uppercase tracking-widest font-bold text-[#d4af37] border-b border-white/10">
          <tr>
            <th className="p-4">Name</th>
            <th className="p-4">{type === "crew" ? "Role" : "Specialty"}</th>
            <th className="p-4">Email</th>
            <th className="p-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.map((item, i) => (
            <tr key={i} className="hover:bg-white/5 transition-colors">
              <td className="p-4 font-bold text-white">{item.name}</td>
              <td className="p-4">
                {type === "crew" ? item.role : item.specialty}
              </td>
              <td className="p-4 font-mono text-xs text-gray-500">
                {item.email}
              </td>
              <td className="p-4">
                <span className="bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20 px-2 py-1 rounded text-[10px] uppercase font-bold">
                  {item.status || "Active"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default function ProductionPortal() {
  const router = useRouter();

  // VIEW STATE
  const [view, setView] = useState("dashboard");
  const [selectedProject, setSelectedProject] = useState(null); // Holds the Project Object

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [denied, setDenied] = useState(false);
  const [denialReason, setDenialReason] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // DATA STATE (Dashboard Level Only)
  const [projects, setProjects] = useState([]);
  const [roster, setRoster] = useState([]);
  const [crewList, setCrewList] = useState([]);
  const [artistList, setArtistList] = useState([]);

  // MODAL STATE
  const [accountModalOpen, setAccountModalOpen] = useState(false);

  // 1. AUTH CHECK
  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/dashboard/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role, clearance")
        .eq("id", user.id)
        .single();

      const isCrew = profile?.role === "crew";
      const isHighLevel = ["admin", "executive", "ownership"].includes(
        profile?.role
      );
      const isCleared = profile?.clearance >= 2;

      if (profile && (isCrew || isHighLevel || isCleared)) {
        fetchAllData();
      } else {
        setDenialReason(
          "Access Denied: Production Clearance (Level 2+) Required"
        );
        setDenied(true);
        setIsLoadingData(false);
      }
    };
    init();
  }, [refreshKey]);

  // 2. DATA FETCHING (Lightweight - Just for lists/stats)
  const fetchAllData = async () => {
    setIsLoadingData(true);
    try {
      // Projects (Basic Info Only for Stats/Sidebar)
      const { data: projData } = await supabase
        .from("active_productions")
        .select("id, project_ref_id, title, production_status, style, format");
      if (projData) setProjects(projData);

      // Roster (For Talent Manager View)
      const { data: actorData } = await supabase
        .from("actor_roster_public")
        .select("*");
      if (actorData) {
        setRoster(
          actorData.map((a) => ({
            name: a.display_name,
            id: a.id,
            headshot: a.headshot_url,
            demo: a.demo_reel_url,
            email: "Private",
            status: "Active",
          }))
        );
      }

      // Crew List (For Admin View)
      const { data: crewData } = await supabase
        .from("profiles")
        .select("full_name, email, role, status")
        .eq("role", "crew");
      if (crewData) {
        setCrewList(
          crewData.map((c) => ({
            name: c.full_name,
            role: "Production Staff",
            email: c.email,
            status: c.status,
          }))
        );
      }

      // Artist List (For Admin View)
      const { data: artistData } = await supabase
        .from("artist_roster_public")
        .select("*");
      if (artistData) {
        setArtistList(
          artistData.map((a) => ({
            name: a.display_name,
            specialty: "Visual Artist",
            email: "Private",
            status: "Active",
          }))
        );
      }
    } catch (e) {
      console.error("Fetch Error:", e);
    }
    setIsLoadingData(false);
  };

  const handleProjectUpdate = () => {
    setRefreshKey((prev) => prev + 1); // Refresh Sidebar
  };

  // --- ACCESS DENIED ---
  if (!isLoadingData && denied) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-6 font-sans ${DASHBOARD_BG}`}
      >
        <div className="z-10 w-full max-w-md bg-[#0a0a0a] border border-[#d4af37]/30 rounded-3xl p-8 text-center shadow-2xl">
          <ShieldAlert className="text-[#d4af37] w-16 h-16 mx-auto mb-6" />
          <h2 className="text-2xl font-serif text-white mb-2">
            RESTRICTED AREA
          </h2>
          <p className="text-sm text-gray-400 mb-8">{denialReason}</p>
          <button
            onClick={() => router.push("/hub")}
            className="w-full py-4 bg-white text-black rounded-xl font-bold uppercase tracking-widest hover:bg-gray-200"
          >
            Return to Hub <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  // --- LOADING ---
  if (isLoadingData) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center text-white z-50 ${DASHBOARD_BG}`}
      >
        <div className="w-16 h-16 border-4 border-white/10 border-t-[#d4af37] rounded-full animate-spin mb-6" />
        <h2 className="text-xl font-serif text-[#d4af37] tracking-widest animate-pulse">
          Accessing Production Database...
        </h2>
      </div>
    );
  }

  // --- 🟢 PROJECT VIEW (THE FIX) ---
  if (view === "project" && selectedProject) {
    return (
      <div
        className={`flex h-screen text-white font-sans overflow-hidden ${DASHBOARD_BG}`}
      >
        <Sidebar
          selectedProject={selectedProject}
          onSelectProject={(p) => setSelectedProject(p)}
          onLogout={() => router.push("/hub")}
          onDashboardClick={() => {
            setSelectedProject(null);
            setView("dashboard");
          }}
          refreshTrigger={refreshKey}
        />
        <main className="flex-1 overflow-y-auto custom-scrollbar p-8 relative">
          <div className="max-w-7xl mx-auto animate-fade-in">
            {/* We simply mount the Orchestrator here. 
                It handles its own state, tabs, and database calls.
            */}
            <ProjectView
              projectId={selectedProject.project_ref_id}
              onBack={() => {
                setSelectedProject(null);
                setView("dashboard");
              }}
            />
          </div>
        </main>
      </div>
    );
  }

  // --- DASHBOARD VIEW ---
  return (
    <div
      className={`flex h-screen text-white font-sans overflow-hidden ${DASHBOARD_BG}`}
    >
      <Sidebar
        selectedProject={null}
        onSelectProject={(p) => {
          setSelectedProject(p);
          setView("project");
        }}
        onLogout={() => router.push("/hub")}
        onDashboardClick={() => {}}
        refreshTrigger={refreshKey}
      />
      <main className="flex-1 overflow-y-auto custom-scrollbar p-8 relative">
        {/* VIEW: ROSTER */}
        {view === "roster" && (
          <TalentManager data={roster} onBack={() => setView("dashboard")} />
        )}
        {view === "crew" && (
          <SimpleTableManager
            title="Production Crew"
            data={crewList}
            type="crew"
            onBack={() => setView("dashboard")}
          />
        )}
        {view === "artists" && (
          <SimpleTableManager
            title="Visual Artists"
            data={artistList}
            type="artist"
            onBack={() => setView("dashboard")}
          />
        )}

        {/* VIEW: DASHBOARD HOME */}
        {view === "dashboard" && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-serif text-white">
                Production <span className="text-[#d4af37]">Dashboard</span>
              </h1>
              <div className="flex gap-4">
                <Link
                  href="/hub"
                  className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-xs uppercase tracking-widest border border-white/10 px-4 py-2 rounded-lg"
                >
                  <ArrowLeft size={14} /> Back to Hub
                </Link>
                <button
                  onClick={() => setAccountModalOpen(true)}
                  className="w-8 h-8 rounded-full flex items-center justify-center border border-white/10 bg-white/5 hover:border-emerald-500/50 hover:text-emerald-500 text-slate-400 transition-all"
                >
                  <UserCog size={16} />
                </button>
              </div>
            </div>

            <DashboardStats
              data={projects}
              onNavigate={() => setView("roster")}
              onSync={fetchAllData}
            />

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setView("crew")}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg border border-white/10 transition-all text-xs font-bold uppercase tracking-widest text-[#d4af37]"
              >
                <Briefcase size={14} /> Manage Crew
              </button>
              <button
                onClick={() => setView("artists")}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg border border-white/10 transition-all text-xs font-bold uppercase tracking-widest text-[#d4af37]"
              >
                <Palette size={14} /> Manage Artists
              </button>
            </div>

            <div className="mt-8">
              <IntakeRequests onGreenlightComplete={handleProjectUpdate} />
            </div>
          </div>
        )}

        <AccountModal
          isOpen={accountModalOpen}
          onClose={() => setAccountModalOpen(false)}
        />
      </main>
    </div>
  );
}
