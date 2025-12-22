"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
// 🟢 1. IMPORT MODAL
import AccountModal from "../../../components/dashboard/AccountModal";
import {
  Loader2,
  LayoutDashboard,
  Clapperboard,
  CheckCircle,
  X,
  Mic,
  FileSignature,
  Calendar,
  Play,
  ArrowLeft,
  Inbox,
  Briefcase,
  Palette,
  Zap,
  Info,
  Shield,
  ShieldAlert,
  ArrowRight,
  UserCog, // Button Icon
} from "lucide-react";
import Link from "next/link";

// --- UI COMPONENTS ---
import Button from "../../../components/ui/Button";
import SectionHeader from "../../../components/ui/SectionHeader";

// --- DASHBOARD SUB-COMPONENTS ---
import Sidebar from "../../../components/dashboard/Sidebar";
import DashboardStats from "../../../components/dashboard/DashboardStats";
import TalentManager from "../../../components/dashboard/TalentManager";
import ProductionView from "../../../components/dashboard/ProductionView";
import CastingTab from "../../../components/dashboard/CastingTab";
import ContractsTab from "../../../components/dashboard/ContractsTab";
import ProductionHub from "../../../components/dashboard/ProductionHub";
import ScheduleHub from "../../../components/dashboard/ScheduleHub";
import ProjectHeader from "../../../components/dashboard/ProductionHeader";

// --- UTILS ---
import { runCreativeMatch } from "../../../utils/dashboard/matchmaker";

// 🟢 CONFIGURATION
const COLORS = {
  GOLD: "#d4af37",
  SILVER: "#c0c0c0",
  MIDNIGHT: "#0c0442",
  HOLD: "#eab308",
};

const getLocalTheme = (formatString) => {
  if (!formatString) return COLORS.GOLD;
  const lower = formatString.toLowerCase();
  if (lower.includes("drama") || lower.includes("cinematic"))
    return COLORS.GOLD;
  return COLORS.SILVER;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// --- INLINE COMPONENT: SIMPLE TABLE MANAGER ---
const SimpleTableManager = ({ title, data, type, onBack }) => (
  <div className="p-8 animate-fade-in w-full h-full overflow-y-auto bg-[#020010]">
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
  const [currentUser, setCurrentUser] = useState(null);

  // VIEW STATE
  const [view, setView] = useState("dashboard"); // Default to dashboard immediately
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [denied, setDenied] = useState(false); // New: Denial State
  const [denialReason, setDenialReason] = useState("");

  // 🟢 2. MODAL STATE
  const [accountModalOpen, setAccountModalOpen] = useState(false);

  // DATA STATE
  const [projects, setProjects] = useState([]);
  const [roster, setRoster] = useState([]);
  const [crewList, setCrewList] = useState([]);
  const [artistList, setArtistList] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [intakes, setIntakes] = useState([]);

  // UI STATE
  const [selectedIntake, setSelectedIntake] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState("casting");
  const [filterStatus, setFilterStatus] = useState("All");
  const [matchResults, setMatchResults] = useState({});
  const [castingSelections, setCastingSelections] = useState({});

  const META_STATUSES = [
    "NEW",
    "NEGOTIATING",
    "CASTING",
    "PRE-PRODUCTION",
    "IN PRODUCTION",
    "POST-PRODUCTION",
    "COMPLETE",
    "CANCELLED",
    "HOLD",
  ];

  const TABS = [
    { id: "casting", label: "1. Casting", icon: Mic },
    { id: "schedule", label: "2. Schedule", icon: Calendar },
    { id: "contracts", label: "3. Contracts", icon: FileSignature },
    { id: "hub", label: "4. Workflow", icon: Play },
    { id: "production", label: "Logistics", icon: LayoutDashboard },
  ];

  // 1. AUTH CHECK & INITIAL LOAD (GATEKEEPER)
  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/dashboard/login"); // Bounce if not authenticated
        return;
      }

      // Verify Role & Clearance
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, clearance")
        .eq("id", user.id)
        .single();

      // ALLOW: Role = 'crew' OR Clearance >= 2 (Production Level) OR specific high-level roles
      const isCrew = profile?.role === "crew";
      const isHighLevel = ["admin", "executive", "ownership"].includes(
        profile?.role
      );
      const isCleared = profile?.clearance >= 2;

      if (profile && (isCrew || isHighLevel || isCleared)) {
        setCurrentUser(user);
        fetchAllData(); // proceed to load data
      } else {
        // ⛔ DENIED
        setDenialReason(
          "Access Denied: Production Clearance (Level 2+) Required"
        );
        setDenied(true);
        setIsLoadingData(false);
      }
    };
    init();
  }, []);

  // 2. DATA FETCHING (RLS VERSION)
  const fetchAllData = async () => {
    setIsLoadingData(true);
    try {
      // A. INTAKES
      const { data: intakeData } = await supabase
        .from("project_intake")
        .select("*")
        .neq("status", "Greenlit");

      if (intakeData) {
        setIntakes(
          intakeData.map((i) => ({
            id: i.intake_ref_id || i.id, // Display ID
            db_id: i.id, // UUID
            title: i.project_title,
            clientName: i.client_name,
            clientType: i.client_type,
            email: i.client_email,
            wordCount: i.word_count,
            style: i.style,
            genres: i.genres || [],
            baseFormat: i.base_format,
            priceTier: i.price_tier,
            isCinematic: i.is_cinematic,
            character_details: i.character_details, // Ensure mapping handles new JSONB
            notes: i.notes,
            timestamp: i.created_at,
          }))
        );
      }

      // B. PROJECTS (Active Productions)
      const { data: projData } = await supabase
        .from("active_productions")
        .select("*");
      if (projData) {
        setProjects(
          projData.map((p) => ({
            "Project ID": p.project_ref_id,
            Title: p.title,
            Status: p.production_status,
            Format: p.format || "Standard", // You might need to add this column or infer it
            // Map legacy fields if they exist in your new schema, otherwise use defaults
            "Start Date": new Date().toLocaleDateString(),
            "Contract Data": {},
            "Project Correspondence": [],
            db_id: p.id,
          }))
        );

        // Populate "All Roles" from the JSONB manifest in Active Productions
        // This simulates the old 'casting_manifest' table
        const roles = [];
        projData.forEach((p) => {
          if (p.casting_manifest && Array.isArray(p.casting_manifest)) {
            p.casting_manifest.forEach((r) => {
              roles.push({
                "Project ID": p.project_ref_id,
                "Role ID": r.role_id,
                "Character Name": r.name,
                "Assigned Actor": r.assigned_actor,
                Status: r.status,
              });
            });
          }
        });
        setAllRoles(roles);
      }

      // C. ROSTER (Public Actor Profiles)
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
            // Add other fields if available in public roster
            email: "Private", // Private info is in actor_private
            status: "Active",
          }))
        );
      }

      // D. CREW (Profiles filtered by role)
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

      // E. ARTISTS (Public Artist Profiles)
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

  // 3. ACTIONS
  const handleGreenLight = async (intakeItem) => {
    if (!intakeItem) return;
    setIsSaving(true);
    try {
      // Trigger the backend move
      const { error } = await supabase
        .from("project_intake")
        .update({ status: "Greenlit" })
        .eq("id", intakeItem.db_id);

      if (error) throw error;

      alert("Project Greenlit. Production Record Initialized.");
      setSelectedIntake(null);
      fetchAllData();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const saveProject = async (updates) => {
    // Map back to DB schema
    if (!selectedProject?.db_id) return;

    const { error } = await supabase
      .from("active_productions")
      .update({
        title: updates.title,
        production_status: updates.status,
        // Add mappings
      })
      .eq("id", selectedProject.db_id);

    if (error) alert(error.message);
    else fetchAllData();
  };

  const updateField = (field, value) => {
    setSelectedProject((prev) => ({ ...prev, [field]: value }));
  };

  // 4. RENDERING

  // 🔴 ACCESS DENIED SCREEN
  if (!isLoadingData && denied) {
    return (
      <div className="min-h-screen bg-[#020010] flex flex-col items-center justify-center relative overflow-hidden p-6 font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#d4af37_0%,_transparent_40%)] opacity-10" />
        <div className="z-10 w-full max-w-md bg-[#0a0a0a] border border-[#d4af37]/30 rounded-3xl p-8 text-center shadow-2xl animate-in zoom-in-95">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center mb-6">
            <ShieldAlert className="text-[#d4af37]" size={32} />
          </div>
          <h2 className="text-2xl font-serif text-white mb-2">
            RESTRICTED AREA
          </h2>
          <p className="text-sm text-gray-400 mb-8 leading-relaxed">
            {denialReason}
          </p>
          <button
            onClick={() => router.push("/hub")}
            className="w-full py-4 bg-white text-black rounded-xl font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            Return to Hub <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-[#020010] flex flex-col items-center justify-center text-white z-50">
        <div className="w-16 h-16 border-4 border-white/10 border-t-[#d4af37] rounded-full animate-spin mb-6" />
        <h2 className="text-xl font-serif text-[#d4af37] tracking-widest animate-pulse">
          Accessing Production Database...
        </h2>
      </div>
    );
  }

  // SUB-VIEWS
  if (view === "roster")
    return <TalentManager data={roster} onBack={() => setView("dashboard")} />;
  if (view === "crew")
    return (
      <SimpleTableManager
        title="Production Crew"
        data={crewList}
        type="crew"
        onBack={() => setView("dashboard")}
      />
    );
  if (view === "artists")
    return (
      <SimpleTableManager
        title="Visual Artists"
        data={artistList}
        type="artist"
        onBack={() => setView("dashboard")}
      />
    );

  // PROJECT WORKSPACE
  if (view === "project") {
    const currentRoles = selectedProject
      ? allRoles.filter(
          (r) => r["Project ID"] === selectedProject["Project ID"]
        )
      : [];

    return (
      <div className="flex h-screen bg-[#020010] text-white font-sans overflow-hidden">
        <Sidebar
          projects={projects}
          selectedProject={selectedProject}
          onSelectProject={(p) => {
            setSelectedProject(p);
            setView("project");
          }}
          onLogout={() => router.push("/hub")}
          onDashboardClick={() => {
            setSelectedProject(null);
            setView("dashboard");
          }}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          metaStatuses={META_STATUSES}
        />
        <main className="flex-1 overflow-y-auto custom-scrollbar p-8 relative">
          <div className="max-w-6xl mx-auto animate-fade-in">
            <ProjectHeader
              project={selectedProject}
              saveProject={saveProject}
              saving={isSaving}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              updateField={updateField}
              tabs={TABS}
              userKey="SESSION_AUTH" // No longer used but kept for prop compat
              onRecycleSuccess={() => {
                setSelectedProject(null);
                setView("dashboard");
                fetchAllData();
              }}
            />

            {activeTab === "casting" && (
              <CastingTab
                project={selectedProject}
                roles={currentRoles}
                roster={roster}
                updateField={updateField}
                matchResults={matchResults}
                setMatchResults={setMatchResults}
                runCreativeMatch={runCreativeMatch}
                onConfirmSelections={(s) => {
                  setCastingSelections(s);
                  setActiveTab("schedule");
                }}
                initialSelections={castingSelections}
              />
            )}
            {activeTab === "schedule" && (
              <ScheduleHub
                project={selectedProject}
                roles={currentRoles}
                roster={roster}
                castingSelections={castingSelections}
                onSync={fetchAllData}
              />
            )}
            {activeTab === "contracts" && (
              <ContractsTab
                project={selectedProject}
                roles={currentRoles}
                updateField={updateField}
                roster={roster}
                castingSelections={castingSelections}
              />
            )}
            {activeTab === "hub" && (
              <ProductionHub
                project={selectedProject}
                updateField={updateField}
                saveProject={saveProject}
              />
            )}
            {activeTab === "production" && (
              <ProductionView
                project={selectedProject}
                updateField={updateField}
                roster={roster}
              />
            )}
          </div>
        </main>
      </div>
    );
  }

  // MAIN DASHBOARD VIEW
  return (
    <div className="flex h-screen bg-[#020010] text-white font-sans overflow-hidden">
      <Sidebar
        projects={projects}
        selectedProject={null}
        onSelectProject={(p) => {
          setSelectedProject(p);
          setView("project");
        }}
        onLogout={() => router.push("/hub")}
        onDashboardClick={() => {}}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        metaStatuses={META_STATUSES}
      />
      <main className="flex-1 overflow-y-auto custom-scrollbar p-8 relative">
        {/* TOP NAV / STATS */}
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

            {/* 🟢 3. CIRCULAR ACCOUNT BUTTON */}
            <button
              onClick={() => setAccountModalOpen(true)}
              className="w-8 h-8 rounded-full flex items-center justify-center border border-white/10 bg-white/5 hover:border-emerald-500/50 hover:text-emerald-500 text-slate-400 transition-all"
              title="My Account"
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
          {/* I am rendering the modal here for clean context */}
          <AccountModal
            isOpen={accountModalOpen}
            onClose={() => setAccountModalOpen(false)}
          />
        </div>

        {/* INTAKE REQUESTS */}
        <div className="mt-12">
          <SectionHeader
            icon={Inbox}
            title={`New Project Requests (${intakes.length})`}
            color="text-[#d4af37]"
          />
          {intakes.length === 0 ? (
            <div className="mt-6 p-8 text-center text-gray-500 bg-white/5 rounded-xl border border-white/5 border-dashed">
              No new requests pending.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {intakes.map((intake) => {
                const themeColor = getLocalTheme(intake.clientType);
                const isCinema =
                  intake.isCinematic ||
                  (intake.clientType &&
                    intake.clientType.toLowerCase().includes("drama"));

                return (
                  <div
                    key={intake.id}
                    onClick={() => setSelectedIntake(intake)}
                    className="border p-5 rounded-xl cursor-pointer transition-all hover:bg-white/5 group shadow-lg bg-[#0a0a0a]"
                    style={{
                      borderColor: `${themeColor}50`,
                      boxShadow: isCinema
                        ? `0 0 25px ${themeColor}20`
                        : `0 0 15px ${themeColor}10`,
                    }}
                  >
                    {/* ... (Existing Intake Card JSX) ... */}
                    <div className="flex justify-between items-start mb-4">
                      <span
                        className="text-[10px] px-2 py-0.5 rounded border uppercase tracking-widest font-bold"
                        style={{
                          color: themeColor,
                          backgroundColor: `${themeColor}15`,
                          borderColor: `${themeColor}40`,
                        }}
                      >
                        {intake.clientType || "Project"}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">
                        {intake.timestamp
                          ? new Date(intake.timestamp).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      {isCinema ? (
                        <Clapperboard size={14} style={{ color: themeColor }} />
                      ) : (
                        <Mic size={14} style={{ color: themeColor }} />
                      )}
                      <h4
                        className="font-serif text-xl truncate text-gray-300 group-hover:text-white"
                        style={{ textShadow: `0 0 20px ${themeColor}20` }}
                      >
                        {intake.title}
                      </h4>
                    </div>
                    <p className="text-xs text-gray-400">{intake.clientName}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* GREENLIGHT MODAL */}
      {selectedIntake && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in">
          {(() => {
            const themeColor = getLocalTheme(selectedIntake.clientType);
            const isDrama =
              selectedIntake.isCinematic ||
              (selectedIntake.clientType &&
                selectedIntake.clientType.toLowerCase().includes("drama"));

            return (
              <div
                className="bg-[#0c0442] border w-full max-w-4xl rounded-2xl overflow-hidden flex flex-col max-h-[95vh] shadow-2xl relative"
                style={{
                  borderColor: `${themeColor}60`,
                  boxShadow: `0 0 60px ${themeColor}20`,
                }}
              >
                {/* ... (Existing Modal Content) ... */}
                <div
                  className="p-6 border-b flex justify-between items-center bg-[#050510]"
                  style={{ borderColor: `${themeColor}30` }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center border"
                      style={{
                        borderColor: themeColor,
                        backgroundColor: `${themeColor}10`,
                        color: themeColor,
                      }}
                    >
                      {isDrama ? <Clapperboard size={24} /> : <Mic size={24} />}
                    </div>
                    <div>
                      <h2 className="text-2xl font-serif text-white">
                        {selectedIntake.title}
                      </h2>
                      <div className="flex items-center gap-3 mt-1">
                        <span
                          className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border"
                          style={{
                            borderColor: `${themeColor}40`,
                            color: themeColor,
                          }}
                        >
                          {selectedIntake.clientType}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedIntake(null)}
                    className="text-gray-500 hover:text-white p-2"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-[#020010]">
                  <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <h4 className="text-[#d4af37] text-[10px] uppercase font-bold mb-3 flex items-center gap-2">
                        <Zap size={12} /> Production Tier
                      </h4>
                      <div className="text-white text-sm">
                        {selectedIntake.baseFormat} — {selectedIntake.style}
                        <br />
                        <span className="text-[#d4af37] font-mono">
                          {selectedIntake.priceTier} Budget
                        </span>
                      </div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <h4 className="text-gray-500 text-[10px] uppercase font-bold mb-3 flex items-center gap-2">
                        <Info size={12} /> Specs
                      </h4>
                      <div className="text-white text-sm">
                        {Number(selectedIntake.wordCount).toLocaleString()}{" "}
                        Words
                        <br />
                        {Array.isArray(selectedIntake.genres)
                          ? selectedIntake.genres.join(", ")
                          : selectedIntake.genres}
                      </div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <h4 className="text-gray-500 text-[10px] uppercase font-bold mb-3 flex items-center gap-2">
                        <Calendar size={12} /> Timeline
                      </h4>
                      <div className="text-white text-sm font-mono">
                        {selectedIntake.timeline_prefs?.split("|").join(" | ")}
                      </div>
                    </div>
                  </div>
                  {/* ... Character Manifest and Buttons ... */}
                  <div className="mb-8 relative">
                    <div
                      className="absolute -left-1 top-0 bottom-0 w-1 rounded-l-lg"
                      style={{ backgroundColor: themeColor }}
                    />
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-r-xl p-6">
                      <h4
                        className="text-[10px] uppercase font-bold mb-4 flex items-center gap-2"
                        style={{ color: themeColor }}
                      >
                        <LayoutDashboard size={14} /> Character Manifest
                      </h4>

                      <div className="space-y-2">
                        {(() => {
                          let chars = [];
                          if (
                            typeof selectedIntake.character_details === "string"
                          ) {
                            chars = selectedIntake.character_details
                              .split("|")
                              .map((s) => {
                                const p = s.split(",");
                                return {
                                  name: p[0],
                                  desc: p[1],
                                  gender: p[2],
                                  age: p[3],
                                };
                              });
                          } else if (
                            Array.isArray(selectedIntake.character_details)
                          ) {
                            chars = selectedIntake.character_details;
                          }

                          return chars.map((char, i) => {
                            if (!char?.name) return null;
                            return (
                              <div
                                key={i}
                                className="flex items-center gap-4 p-3 bg-white/5 rounded border border-white/5 hover:border-white/20 transition-colors"
                              >
                                <div
                                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-black"
                                  style={{ backgroundColor: themeColor }}
                                >
                                  {i + 1}
                                </div>
                                <div className="grid grid-cols-4 w-full gap-4 text-xs">
                                  <span className="font-bold text-white">
                                    {char.name || "Unknown"}
                                  </span>
                                  <span className="text-gray-400">
                                    {char.desc}
                                  </span>
                                  <span className="text-gray-400">
                                    {char.gender}
                                  </span>
                                  <span className="text-gray-500 italic">
                                    {char.age}
                                  </span>
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-[#0a0a0a] border-t border-white/10 flex justify-end gap-3">
                  <Button
                    onClick={() => setSelectedIntake(null)}
                    variant="ghost"
                    color="#ffffff"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleGreenLight(selectedIntake)}
                    variant="solid"
                    color={themeColor}
                    className="px-8 shadow-lg"
                    style={{ color: "black" }}
                  >
                    {isSaving ? (
                      <Loader2 className="animate-spin mr-2" />
                    ) : (
                      <CheckCircle className="mr-2" />
                    )}{" "}
                    GREENLIGHT
                  </Button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
