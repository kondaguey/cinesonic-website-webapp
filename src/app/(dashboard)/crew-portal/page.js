"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Loader2,
  Shield,
  AlertTriangle,
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
  Search,
  Filter,
  User,
  Info,
  RefreshCw,
  Save,
  RotateCcw,
  Trash2,
  Zap,
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

// 🟢 1. REFACTORED PALETTE (Visuals Forced to Premium)
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

// --- CONFIGURATION ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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

export default function AdminPortal() {
  const [isSaving, setIsSaving] = useState(false);
  const [view, setView] = useState("login");
  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [error, setError] = useState("");
  const [accessInput, setAccessInput] = useState("");

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

  useEffect(() => {
    const savedKey = localStorage.getItem("cinesonic_access_key");
    if (savedKey && view === "login") autoLogin(savedKey);
  }, []);

  const autoLogin = async (key) => {
    setLoading(true);
    try {
      const { data: crewArray, error: loginErr } = await supabase.rpc(
        "secure_crew_login",
        { secret_key: key.trim() }
      );
      if (loginErr || !crewArray || crewArray.length === 0) {
        localStorage.removeItem("cinesonic_access_key");
      } else {
        setAccessInput(key);
        localStorage.setItem("cinesonic_access_key", key.trim());
        setView("dashboard");
        fetchAllData(key.trim());
      }
    } catch (err) {
      localStorage.removeItem("cinesonic_access_key");
    }
    setLoading(false);
  };

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data: crewArray, error: loginErr } = await supabase.rpc(
        "secure_crew_login",
        { secret_key: accessInput.trim() }
      );
      if (loginErr) throw loginErr;
      if (!crewArray || crewArray.length === 0)
        throw new Error("No matching Active user found for this key.");
      localStorage.setItem("cinesonic_access_key", accessInput.trim());
      setView("dashboard");
      fetchAllData(accessInput.trim());
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const fetchAllData = async (overrideKey = null) => {
    const activeKey = overrideKey || accessInput;
    if (!activeKey) return;
    setIsLoadingData(true);
    try {
      const { data: intakeData } = await supabase.rpc("secure_fetch_intakes", {
        secret_pass: activeKey,
      });
      if (intakeData)
        // Inside fetchAllData -> intakeData.map
        // Inside fetchAllData -> intakeData.map
        setIntakes(
          intakeData
            .map((i) => ({
              id: i.intake_id, // The PRJ-XXXX tag
              db_id: i.id, // The actual UUID for the SQL .eq() calls
              title: i.project_title,
              clientName: i.client_name,
              clientType: i.client_type,
              email: i.email,
              wordCount: i.word_count,
              style: i.style, // 🟢 Fixed: Now mapping the style spec
              genres: i.genres,
              baseFormat: i.base_format,
              priceTier: i.price_tier,
              isCinematic: i.is_cinematic,
              character_details: i.character_details,
              timeline_prefs: i.timeline_prefs,
              notes: i.notes,
            }))
            .filter((i) => i.status !== "Greenlit")
        );
      const { data: projData } = await supabase.rpc("secure_fetch_production", {
        secret_pass: activeKey,
      });
      if (projData)
        setProjects(
          projData.map((p) => ({
            "Project ID": p.project_id,
            Title: p.title,
            Status: p.status,
            Format: p.format || "Standard",
            "Start Date": p.start_date_1,
            "Start Date 2": p.start_date_2,
            "Start Date 3": p.start_date_3,
            "Contract Data": p.contract_data || {},
            "Project Correspondence": p.project_correspondence || [],
          }))
        );

      const { data: actorData } = await supabase
        .from("actor_db")
        .select("*")
        .order("name");
      if (actorData)
        setRoster(
          actorData.map((a) => ({
            name: a.name,
            id: a.actor_id,
            email: a.email,
            gender: a.gender,
            age_range: a.age_range,
            voice: a.voice_type,
            genres: a.genres,
            headshot: a.headshot_url,
            demo: a.demo_url,
          }))
        );

      const { data: crewData } = await supabase.rpc("secure_fetch_crew", {
        secret_pass: activeKey,
      });
      if (crewData)
        setCrewList(
          crewData.map((c) => ({
            name: c.name,
            role: c.role || "Crew",
            email: c.email,
            status: c.status || "Active",
          }))
        );

      const { data: artistData } = await supabase.rpc("secure_fetch_artists", {
        secret_pass: activeKey,
      });
      if (artistData)
        setArtistList(
          artistData.map((a) => ({
            name: a.name,
            specialty: a.specialty || "Artist",
            email: a.email,
            status: a.status || "Active",
          }))
        );

      const { data: roleData } = await supabase.rpc("secure_fetch_casting", {
        secret_pass: activeKey,
      });
      if (roleData)
        setAllRoles(
          roleData.map((r) => ({
            "Project ID": r.project_id,
            "Role ID": r.role_id,
            "Character Name": r.role_name,
            Gender: r.gender,
            "Age Range": r.age,
            "Vocal Specs": r.vocal_specs,
            Status: r.status,
            "Assigned Actor": r.assigned_actor,
          }))
        );
    } catch (e) {
      console.error("Fetch Error:", e);
    }
    setIsLoadingData(false);
  };

  const handleGreenLight = async (intakeItem) => {
    if (!intakeItem) return;
    setIsSaving(true);

    try {
      // We only need one update call.
      // The DB Trigger will catch this and handle the production_db insertion.
      const { error: updateError } = await supabase
        .from("project_intake_db")
        .update({ status: "Greenlit" })
        .eq("id", intakeItem.db_id); // Use the UUID

      if (updateError) throw updateError;

      alert("SUCCESS: System trigger fired. Production record created.");
      setSelectedIntake(null);
      fetchAllData();
    } catch (err) {
      alert("TRIGGER FAILURE: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const saveProject = async () => {
    if (!selectedProject || !selectedProject["Project ID"]) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("production_db")
        .update({
          title: selectedProject["Title"],
          status: selectedProject["Status"],
          format: selectedProject["Format"],
        })
        .eq("project_id", selectedProject["Project ID"]);

      if (error) throw error;
      fetchAllData();
    } catch (err) {
      console.error("SAVE FAILED:", err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field, value) =>
    setSelectedProject((prev) => ({ ...prev, [field]: value }));

  if (view === "login") {
    if (loading && localStorage.getItem("cinesonic_access_key")) {
      return (
        <div className="min-h-screen bg-[#020010] flex flex-col items-center justify-center text-white">
          <Loader2 className="w-12 h-12 text-[#d4af37] animate-spin mb-4" />
          <h2 className="text-xl font-serif text-[#d4af37] tracking-widest animate-pulse">
            RE-ESTABLISHING SECURE UPLINK...
          </h2>
        </div>
      );
    }
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative bg-[#020010]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1a0f5e_0%,_#020010_70%)] opacity-40" />
        <Link
          href="/"
          className="absolute top-8 left-8 z-50 flex items-center gap-2 text-[#d4af37]/60 hover:text-[#d4af37] text-xs uppercase tracking-widest transition-colors"
        >
          <ArrowLeft size={14} /> Back to Site
        </Link>
        <div className="w-full max-w-[400px] rounded-2xl border border-[#d4af37]/30 bg-[#0a0a0a] p-10 shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <Shield className="w-16 h-16 text-[#d4af37] mx-auto mb-6" />
            <h2 className="text-2xl font-serif text-[#d4af37] mb-2">
              Admin Portal
            </h2>
            <p className="text-xs text-gray-400 uppercase tracking-[0.2em]">
              Authorized Personnel Only
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="password"
              value={accessInput}
              onChange={(e) => setAccessInput(e.target.value)}
              className="w-full bg-white/5 border border-[#d4af37]/20 text-white py-4 rounded-xl text-center text-lg tracking-[0.2em] outline-none focus:border-[#d4af37] transition-all placeholder:text-gray-600 font-serif"
              placeholder="ACCESS CODE"
            />
            {error && (
              <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-xs text-center flex items-center justify-center gap-2">
                <AlertTriangle size={14} /> {error}
              </div>
            )}
            <button
              disabled={loading}
              className="w-full py-4 bg-[#d4af37] hover:bg-[#b8860b] text-black font-bold uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Enter Vault"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (isLoadingData)
    return (
      <div className="min-h-screen bg-[#020010] flex flex-col items-center justify-center text-white z-50">
        <div className="w-16 h-16 border-4 border-white/10 border-t-[#d4af37] rounded-full animate-spin mb-6" />
        <h2 className="text-xl font-serif text-[#d4af37] tracking-widest animate-pulse">
          Establishing Secure Uplink...
        </h2>
      </div>
    );

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
          onLogout={() => {
            localStorage.removeItem("cinesonic_access_key");
            setView("login");
          }}
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
              userKey={accessInput}
              onRecycleSuccess={() => {
                setSelectedProject(null);
                setView("dashboard");
                fetchAllData(accessInput);
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
                onSync={() => fetchAllData(false)}
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

  return (
    <div className="flex h-screen bg-[#020010] text-white font-sans overflow-hidden">
      <Sidebar
        projects={projects}
        selectedProject={null}
        onSelectProject={(p) => {
          setSelectedProject(p);
          setView("project");
        }}
        onLogout={() => {
          localStorage.removeItem("cinesonic_access_key");
          setView("login");
        }}
        onDashboardClick={() => {}}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        metaStatuses={META_STATUSES}
      />
      <main className="flex-1 overflow-y-auto custom-scrollbar p-8 relative">
        <DashboardStats
          data={projects}
          onNavigate={() => setView("roster")}
          onSync={() => fetchAllData(false)}
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
                  intake.clientType.toLowerCase().includes("drama");
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
                    <div className="flex justify-between items-start mb-4">
                      <span
                        className="text-[10px] px-2 py-0.5 rounded border uppercase tracking-widest font-bold"
                        style={{
                          color: themeColor,
                          backgroundColor: `${themeColor}15`,
                          borderColor: `${themeColor}40`,
                        }}
                      >
                        {intake.clientType}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">
                        {new Date(intake.timestamp).toLocaleDateString()}
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
      {selectedIntake && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in">
          {(() => {
            const themeColor = getLocalTheme(selectedIntake.clientType);
            const isDrama =
              selectedIntake.isCinematic ||
              selectedIntake.clientType.toLowerCase().includes("drama");
            return (
              <div
                className="bg-[#0c0442] border w-full max-w-4xl rounded-2xl overflow-hidden flex flex-col max-h-[95vh] shadow-2xl relative"
                style={{
                  borderColor: `${themeColor}60`,
                  boxShadow: `0 0 60px ${themeColor}20`,
                }}
              >
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
                        {selectedIntake.genres}
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
                        <LayoutDashboard size={14} /> Character Manifest (To
                        Explode)
                      </h4>
                      <div className="space-y-2">
                        {(selectedIntake.character_details || "")
                          .split("|")
                          .map((charStr, i) => {
                            if (!charStr.trim()) return null;
                            const parts = charStr.split(",");
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
                                    {parts[0]?.trim() || "Unknown"}
                                  </span>
                                  <span className="text-gray-400">
                                    {parts[1]?.trim()}
                                  </span>
                                  <span className="text-gray-400">
                                    {parts[2]?.trim()}
                                  </span>
                                  <span className="text-gray-500 italic">
                                    {parts[3]?.trim()}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
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
