"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Loader2,
  Shield,
  AlertTriangle,
  LayoutDashboard,
  Clapperboard, // 🟢 NEW: For Cinema Mode
  CheckCircle,
  X,
  Mic,
  FileSignature,
  Calendar,
  Play,
  Trash2,
  Globe,
  Inbox,
} from "lucide-react";
import Link from "next/link";

// --- UI ATOMS ---
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import SectionHeader from "../../../components/ui/SectionHeader";

// --- DASHBOARD COMPONENTS ---
import Sidebar from "../../../components/dashboard/Sidebar";
import DashboardStats from "../../../components/dashboard/DashboardStats";
import TalentManager from "../../../components/dashboard/TalentManager";
import ProductionView from "../../../components/dashboard/ProductionView";
import CastingTab from "../../../components/dashboard/CastingTab";
import ContractsTab from "../../../components/dashboard/ContractsTab";
import ProductionHub from "../../../components/dashboard/ProductionHub";
import ScheduleHub from "../../../components/dashboard/ScheduleHub";
import ProjectHeader from "../../../components/dashboard/ProductionHeader";

// UTILS
import { runCreativeMatch } from "../../../utils/dashboard/matchmaker";

// 🟢 INITIALIZE SUPABASE
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminPortal() {
  const [view, setView] = useState("login");
  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [error, setError] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [crewUser, setCrewUser] = useState(null);

  // DATA STATE
  const [projects, setProjects] = useState([]);
  const [roster, setRoster] = useState([]);
  const [allRoles, setAllRoles] = useState([]);

  // INTAKE STATE
  const [intakes, setIntakes] = useState([]);
  const [selectedIntake, setSelectedIntake] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  // PROJECT UI STATE
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState("production");
  const [filterStatus, setFilterStatus] = useState("All");
  const [matchResults, setMatchResults] = useState({});
  const [saving, setSaving] = useState(false);

  // CASTING SELECTIONS
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
  ];

  const TABS = [
    { id: "production", label: "Production", icon: LayoutDashboard },
    { id: "casting", label: "Casting", icon: Mic },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "contracts", label: "Contracts", icon: FileSignature },
    { id: "hub", label: "Workflow", icon: Play },
  ];

  // 🟢 1. REALTIME LISTENER
  useEffect(() => {
    if (view !== "dashboard") return;
    const channels = supabase
      .channel("admin-dashboard-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "project_intake_db" },
        () => fetchAllData(false)
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "production_db" },
        () => fetchAllData(false)
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "casting_db" },
        () => fetchAllData(false)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channels);
    };
  }, [view]);

  // --- 2. LOGIN ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await supabase
        .from("crew_db")
        .select("*")
        .eq("access_key", accessKey.trim())
        .single();

      if (data) {
        setCrewUser(data);
        setView("dashboard");
        fetchAllData(true);
      } else {
        setError("Access Denied: Invalid Credentials");
      }
    } catch (err) {
      setError("Connection Error");
    }
    setLoading(false);
  };

  // --- 3. DATA FETCHING ---
  const fetchAllData = async (showLoadingScreen = false) => {
    if (showLoadingScreen) setIsLoadingData(true);

    try {
      // 🟢 INTAKES - Now grabbing 'is_cinematic'
      const { data: intakeData } = await supabase
        .from("project_intake_db")
        .select("*")
        .eq("status", "New") // Note: Ensure casing matches DB ('New' or 'NEW')
        .order("created_at", { ascending: false });

      if (intakeData) {
        setIntakes(
          intakeData.map((i) => ({
            id: i.intake_id,
            db_id: i.id,
            timestamp: i.created_at,
            clientType: i.client_type,
            clientName: i.client_name,
            email: i.email,
            title: i.project_title,
            wordCount: i.word_count,
            style: i.style,
            genres: i.genres,
            characters: i.character_details,
            timeline: i.timeline_prefs,
            notes: i.notes,
            // 🟢 NEW: Capture the Cinema Toggle
            isCinematic: i.is_cinematic,
            baseFormat: i.base_format,
          }))
        );
      }

      // Projects
      const { data: projData } = await supabase
        .from("production_db")
        .select("*")
        .order("created_at", { ascending: false });

      setProjects(
        (projData || []).map((p) => ({
          "Project ID": p.project_id,
          Title: p.title,
          "Start Date": p.start_date_1,
          "Start Date 2": p.start_date_2,
          "Start Date 3": p.start_date_3,
          Coordinator: p.coordinator,
          "Coordinator Email": p.coordinator_email,
          "Script Prep": p.script_prep,
          "Script Prep Email": p.script_prep_email,
          Engineer: p.engineer,
          "Engineer Email": p.engineer_email,
          Proofer: p.proofer,
          "Proofer Email": p.proofer_email,
          "Talent A": p.talent_a,
          "Talent A Email": p.talent_a_email,
          "Talent B": p.talent_b,
          "Talent B Email": p.talent_b_email,
          "Talent C": p.talent_c,
          "Talent C Email": p.talent_c_email,
          "Talent D": p.talent_d,
          "Talent D Email": p.talent_d_email,
          "QC Status": p.qc_status,
          Status: p.status,
          "Contract Data": p.contract_data,
          "Project Booked Date": p.project_booked_date,
          "Project Correspondence": p.project_correspondence,
          // 🟢 NEW: If you added 'format' column to production_db, map it here
          Format: p.format || "Standard",
        }))
      );

      // Roles
      const { data: roleData } = await supabase.from("casting_db").select("*");
      setAllRoles(
        (roleData || []).map((r) => ({
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

      // Roster
      const { data: actorData } = await supabase
        .from("actor_db")
        .select("*")
        .order("name", { ascending: true });

      setRoster(
        (actorData || []).map((a) => ({
          name: a.name,
          id: a.actor_id,
          email: a.email,
          gender: a.gender,
          age_range: a.age_range,
          voice: a.voice_type,
          genres: a.genres,
          status: a.status,
          next_avail: a.next_available,
          rate: a.pfh_rate,
          sag: a.union_status,
          triggers: a.triggers,
          bookouts: a.bookouts,
          notes: a.other_notes,
          training: a.training_notes,
          bio: a.bio,
          audiobooks: a.audiobooks_narrated,
          headshot: a.headshot_url,
          demo: a.demo_url,
          resume: a.resume_url,
        }))
      );
    } catch (e) {
      console.error("Fetch error", e);
    }
    if (showLoadingScreen) setIsLoadingData(false);
  };

  // --- 4. APPROVE INTAKE (EXPLODE TO PRODUCTION) ---
  const handleApproveIntake = async () => {
    if (!selectedIntake) return;
    setProcessingId(selectedIntake.id);

    try {
      const projectId = "PROJ-" + Math.floor(1000 + Math.random() * 9000);
      const dates = (selectedIntake.timeline || "").split("|");

      // 🟢 LOGIC: DETERMINE THE 8-SERVICE FORMAT
      // If isCinematic is true, we upgrade the service name to "Audio Drama" / "Cinema"
      let finalFormat = selectedIntake.clientType;

      if (selectedIntake.isCinematic) {
        if (selectedIntake.clientType === "Multi")
          finalFormat = "Multi-Cast Cinema";
        else finalFormat = `${selectedIntake.clientType} Audio Drama`;
      } else {
        finalFormat = `${selectedIntake.clientType} Production`; // Standard
      }

      // Create Project
      await supabase.from("production_db").insert([
        {
          project_id: projectId,
          title: selectedIntake.title,
          start_date_1: dates[0] || "",
          start_date_2: dates[1] || "",
          start_date_3: dates[2] || "",
          status: "CASTING",
          qc_status: "No QC",
          coordinator: "Unassigned",
          format: finalFormat, // 🟢 SAVING THE CALCULATED FORMAT
        },
      ]);

      // Parse Characters & Create Roles
      const charBlock = selectedIntake.characters || "";
      let rolesToInsert = [];

      try {
        // Attempt to parse JSON first (since we send JSON from the new form)
        const charArray = JSON.parse(charBlock);
        rolesToInsert = charArray.map((char) => ({
          project_id: projectId,
          role_id: "ROLE-" + Math.floor(10000 + Math.random() * 90000),
          role_name: char.name || "Unknown",
          gender: char.gender || "Any",
          age: char.age || "Any",
          vocal_specs: char.style || "See Breakdown",
          status: "Open",
          assigned_actor: char.preferredActorName || null, // Keep preference if exists
        }));
      } catch (e) {
        // Fallback to text parsing if legacy text format
        const lines = charBlock
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter((l) => l.length > 2);
        rolesToInsert = lines.map((line) => {
          let charName = line,
            gender = "Any",
            age = "Any",
            specs = "See Breakdown";
          if (line.includes(":")) {
            const parts = line.split(":");
            const prefix = parts[0].trim();
            const details = parts.slice(1).join(":").trim();
            if (prefix.startsWith("M")) gender = "Male";
            else if (prefix.startsWith("F")) gender = "Female";
            charName = details.split("-")[0].trim();
          }
          return {
            project_id: projectId,
            role_id: "ROLE-" + Math.floor(10000 + Math.random() * 90000),
            role_name: charName,
            gender: gender,
            age: age,
            vocal_specs: specs,
            status: "Open",
          };
        });
      }

      if (rolesToInsert.length > 0) {
        await supabase.from("casting_db").insert(rolesToInsert);
      }

      // Mark Approved
      await supabase
        .from("project_intake_db")
        .update({ status: "Approved" })
        .eq("id", selectedIntake.db_id);

      alert(`Project Approved! Created ${finalFormat}: ${projectId}`);
      setSelectedIntake(null);
    } catch (err) {
      alert("Approval Failed: " + err.message);
    }
    setProcessingId(null);
  };

  // --- 5. DELETE INTAKE ---
  const handleDeleteIntake = async () => {
    if (!selectedIntake || !confirm("Reject and delete this request?")) return;
    setProcessingId(selectedIntake.id);
    try {
      await supabase
        .from("project_intake_db")
        .delete()
        .eq("id", selectedIntake.db_id);
      setSelectedIntake(null);
    } catch (err) {
      alert("Delete Failed: " + err.message);
    }
    setProcessingId(null);
  };

  // --- 6. SAVE PROJECT ---
  const saveProject = async (dataOverride = null) => {
    const projectToSave = dataOverride || selectedProject;
    if (!projectToSave) return;
    setSaving(true);
    try {
      const updatePayload = {
        title: projectToSave["Title"],
        start_date_1: projectToSave["Start Date"],
        start_date_2: projectToSave["Start Date 2"],
        start_date_3: projectToSave["Start Date 3"],
        coordinator: projectToSave["Coordinator"],
        coordinator_email: projectToSave["Coordinator Email"],
        status: projectToSave["Status"],
        contract_data: projectToSave["Contract Data"],
        project_correspondence: projectToSave["Project Correspondence"],
      };

      const { error } = await supabase
        .from("production_db")
        .update(updatePayload)
        .eq("project_id", projectToSave["Project ID"]);

      if (error) throw error;

      // Optimistic Update
      setProjects((prev) =>
        prev.map((p) =>
          p["Project ID"] === projectToSave["Project ID"] ? projectToSave : p
        )
      );
      if (dataOverride) setSelectedProject(dataOverride);
    } catch (err) {
      alert("Save Failed: " + err.message);
    }
    setSaving(false);
  };

  const updateField = (field, value) =>
    setSelectedProject((prev) => ({ ...prev, [field]: value }));
  const handleCastingConfirm = (selections) => {
    setCastingSelections(selections);
    setActiveTab("schedule");
  };

  // --- RENDER: LOGIN ---
  if (view === "login")
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative bg-[#020010]">
        <div className="absolute top-6 left-6 z-50 flex flex-col items-start gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-500 hover:text-white text-xs uppercase tracking-widest transition-colors pl-1"
          >
            <Globe size={12} /> Public Home
          </Link>
        </div>

        <div className="w-full max-w-[400px] rounded-2xl border border-[#d4af37]/30 backdrop-blur-2xl bg-[#0a0a0a] p-10 shadow-2xl animate-fade-in-up">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#d4af37]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#d4af37]/30">
              <Shield className="w-8 h-8 text-[#d4af37]" />
            </div>
            <h2 className="text-2xl font-serif text-[#d4af37] mb-2">
              Crew Portal
            </h2>
            <p className="text-xs text-gray-400 uppercase tracking-[0.2em]">
              Authorized Personnel Only
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="password"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              className="w-full bg-white/5 border border-[#d4af37]/20 text-white py-4 pl-4 pr-4 rounded-xl text-center text-lg tracking-[0.2em] outline-none focus:border-[#d4af37] focus:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all placeholder:text-gray-600 placeholder:text-sm placeholder:tracking-normal"
              placeholder="ACCESS KEY"
            />
            {error && (
              <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-xs text-center flex items-center justify-center gap-2 animate-fade-in">
                <AlertTriangle size={14} /> {error}
              </div>
            )}
            <Button
              disabled={loading}
              variant="solid"
              color="#d4af37"
              className="w-full py-4 text-sm"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Verify Credentials"
              )}
            </Button>
          </form>
        </div>
      </div>
    );

  // --- RENDER: LOADING ---
  if (isLoadingData)
    return (
      <div className="min-h-screen bg-[#020010] flex flex-col items-center justify-center text-white z-50">
        <div className="w-16 h-16 border-4 border-white/10 border-t-[#d4af37] rounded-full animate-spin mb-6"></div>
        <h2 className="text-xl font-serif text-[#d4af37] tracking-widest animate-pulse">
          Accessing Database...
        </h2>
      </div>
    );

  const currentRoles = selectedProject
    ? allRoles.filter((r) => r["Project ID"] === selectedProject["Project ID"])
    : [];

  // --- RENDER: MAIN APP ---
  return (
    <div className="flex h-screen bg-[#020010] text-white font-sans overflow-hidden">
      <Sidebar
        user={crewUser}
        projects={projects}
        selectedProject={selectedProject}
        onSelectProject={(p) => {
          setSelectedProject(p);
          setView("project");
        }}
        onLogout={() => setView("login")}
        onDashboardClick={() => {
          setSelectedProject(null);
          setView("dashboard");
        }}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        metaStatuses={META_STATUSES}
      />

      <main className="flex-1 overflow-y-auto custom-scrollbar p-8 relative">
        {view === "dashboard" ? (
          <>
            <DashboardStats
              data={projects}
              onNavigate={() => setView("roster")}
              onSync={() => fetchAllData(false)}
            />

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
                  {/* 🟢 INTAKE CARDS: Now Aware of Cinema Mode */}
                  {intakes.map((intake) => (
                    <div
                      key={intake.id}
                      onClick={() => setSelectedIntake(intake)}
                      className={`
                        border p-5 rounded-xl cursor-pointer transition-all hover:bg-white/5 group shadow-lg
                        ${
                          intake.isCinematic
                            ? "bg-[#0a0a0a] border-[#7c3aed]/50 hover:border-[#7c3aed] shadow-[0_0_15px_rgba(124,58,237,0.1)]" // Violet Glow
                            : "bg-[#0a0a0a] border-white/10 hover:border-[#d4af37]/50" // Standard Gold
                        }
                      `}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <Badge
                          label={
                            intake.clientType +
                            (intake.isCinematic ? " DRAMA" : "")
                          }
                          color={
                            intake.isCinematic
                              ? "text-[#7c3aed]"
                              : "text-[#d4af37]"
                          }
                          bg={
                            intake.isCinematic
                              ? "bg-[#7c3aed]/10"
                              : "bg-[#d4af37]/10"
                          }
                          border={
                            intake.isCinematic
                              ? "border-[#7c3aed]/20"
                              : "border-[#d4af37]/20"
                          }
                        />
                        <span className="text-[10px] text-gray-500 font-mono">
                          {new Date(intake.timestamp).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-1">
                        {intake.isCinematic && (
                          <Clapperboard size={14} className="text-[#7c3aed]" />
                        )}
                        <h4
                          className={`font-serif text-xl truncate transition-colors ${
                            intake.isCinematic
                              ? "text-white group-hover:text-[#7c3aed]"
                              : "text-white group-hover:text-[#d4af37]"
                          }`}
                        >
                          {intake.title}
                        </h4>
                      </div>

                      <p className="text-xs text-gray-400">
                        {intake.clientName}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : view === "roster" ? (
          <TalentManager data={roster} onBack={() => setView("dashboard")} />
        ) : (
          <div className="max-w-6xl mx-auto animate-fade-in">
            <ProjectHeader
              project={selectedProject}
              saveProject={saveProject}
              saving={saving}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              updateField={updateField}
              metaStatuses={META_STATUSES}
              tabs={TABS}
            />
            {activeTab === "production" && (
              <ProductionView
                project={selectedProject}
                updateField={updateField}
                roster={roster}
              />
            )}
            {activeTab === "casting" && (
              <CastingTab
                project={selectedProject}
                roles={currentRoles}
                roster={roster}
                updateField={updateField}
                matchResults={matchResults}
                setMatchResults={setMatchResults}
                runCreativeMatch={runCreativeMatch}
                onConfirmSelections={handleCastingConfirm}
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
                user={crewUser}
                saveProject={saveProject}
              />
            )}
          </div>
        )}
      </main>

      {/* MODAL: INTAKE DETAIL */}
      {selectedIntake && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div
            className={`
             border w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scale-in
             ${
               selectedIntake.isCinematic
                 ? "bg-[#0c0442] border-[#7c3aed]/50"
                 : "bg-[#0c0442] border-[#d4af37]/30"
             }
          `}
          >
            <div
              className={`
              p-6 border-b flex justify-between items-center shrink-0
              ${
                selectedIntake.isCinematic
                  ? "bg-[#7c3aed]/10 border-[#7c3aed]/20"
                  : "bg-black/40 border-[#d4af37]/20"
              }
            `}
            >
              <div>
                <h2
                  className={`text-2xl font-serif ${
                    selectedIntake.isCinematic
                      ? "text-[#7c3aed]"
                      : "text-[#d4af37]"
                  }`}
                >
                  {selectedIntake.title}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  {selectedIntake.isCinematic && (
                    <Badge
                      label="CINEMATIC MODE ACTIVE"
                      bg="bg-[#7c3aed]"
                      color="text-white"
                    />
                  )}
                  <p className="text-xs text-gray-400 uppercase tracking-widest">
                    {selectedIntake.id} • {selectedIntake.clientName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedIntake(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span
                    className={`block text-[10px] uppercase font-bold mb-1 ${
                      selectedIntake.isCinematic
                        ? "text-[#7c3aed]"
                        : "text-[#d4af37]"
                    }`}
                  >
                    Email
                  </span>
                  {selectedIntake.email}
                </div>
                <div>
                  <span
                    className={`block text-[10px] uppercase font-bold mb-1 ${
                      selectedIntake.isCinematic
                        ? "text-[#7c3aed]"
                        : "text-[#d4af37]"
                    }`}
                  >
                    Word Count
                  </span>
                  {selectedIntake.wordCount}
                </div>
                <div>
                  <span
                    className={`block text-[10px] uppercase font-bold mb-1 ${
                      selectedIntake.isCinematic
                        ? "text-[#7c3aed]"
                        : "text-[#d4af37]"
                    }`}
                  >
                    Style
                  </span>
                  {selectedIntake.style}
                </div>
                <div>
                  <span
                    className={`block text-[10px] uppercase font-bold mb-1 ${
                      selectedIntake.isCinematic
                        ? "text-[#7c3aed]"
                        : "text-[#d4af37]"
                    }`}
                  >
                    Genres
                  </span>
                  {selectedIntake.genres}
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded border border-white/10">
                <span
                  className={`block text-[10px] uppercase font-bold mb-2 ${
                    selectedIntake.isCinematic
                      ? "text-[#7c3aed]"
                      : "text-[#d4af37]"
                  }`}
                >
                  Character Breakdown
                </span>
                <pre className="text-xs text-gray-300 whitespace-pre-wrap font-sans">
                  {selectedIntake.characters}
                </pre>
              </div>
              <div className="bg-white/5 p-4 rounded border border-white/10">
                <span
                  className={`block text-[10px] uppercase font-bold mb-2 ${
                    selectedIntake.isCinematic
                      ? "text-[#7c3aed]"
                      : "text-[#d4af37]"
                  }`}
                >
                  Notes
                </span>
                <p className="text-sm text-gray-300">
                  {selectedIntake.notes || "None"}
                </p>
              </div>
            </div>

            <div
              className={`
              p-6 bg-black/40 border-t flex justify-between items-center shrink-0
              ${
                selectedIntake.isCinematic
                  ? "border-[#7c3aed]/20"
                  : "border-[#d4af37]/20"
              }
            `}
            >
              <Button
                onClick={handleDeleteIntake}
                disabled={processingId === selectedIntake.id}
                variant="ghost"
                color="#ef4444"
                className="text-xs"
              >
                <Trash2 size={14} className="mr-2" /> Reject
              </Button>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedIntake(null)}
                  className="px-4 py-2 text-gray-400 hover:text-white text-xs uppercase transition-colors"
                >
                  Close
                </button>
                <Button
                  onClick={handleApproveIntake}
                  disabled={processingId === selectedIntake.id}
                  variant="solid"
                  color={selectedIntake.isCinematic ? "#7c3aed" : "#d4af37"}
                  className="text-xs px-6"
                >
                  {processingId === selectedIntake.id ? (
                    <Loader2 className="animate-spin mr-2" size={16} />
                  ) : (
                    <CheckCircle className="mr-2" size={16} />
                  )}
                  {selectedIntake.isCinematic
                    ? "Greenlight Audio Drama"
                    : "Greenlight Production"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
