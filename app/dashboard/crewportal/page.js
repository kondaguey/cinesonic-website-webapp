"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Loader2,
  Shield,
  AlertTriangle,
  ArrowLeft,
  LayoutDashboard,
  Clapperboard,
  CheckCircle,
  X,
  Mic,
  FileSignature,
  Calendar,
  Play,
  Trash2,
  Globe,
} from "lucide-react";
import Link from "next/link";

// COMPONENT IMPORTS
import Sidebar from "../../components/Sidebar";
import DashboardStats from "../../components/DashboardStats";
import TalentManager from "../../components/TalentManager";
import ProductionView from "../../components/ProductionView";
import CastingTab from "../../components/CastingTab";
import ContractsTab from "../../components/ContractsTab";
import ProductionHub from "../../components/ProductionHub";
import ScheduleHub from "../../components/ScheduleHub";
import ProjectHeader from "../../components/ProductionHeader";

// UTILS
import { runCreativeMatch } from "../../utils/matchmaker";

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

  // 🟢 1. REALTIME LISTENER (THE MAGIC TRICK)
  useEffect(() => {
    // Only subscribe if logged in
    if (view !== "dashboard") return;

    console.log("🟢 Connecting to Realtime Channels...");

    const channels = supabase
      .channel("admin-dashboard-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "project_intake_db" },
        (payload) => {
          console.log("🔔 Intake Update:", payload);
          fetchAllData(false); // Silent Refresh
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "production_db" },
        (payload) => {
          console.log("🔔 Production Update:", payload);
          fetchAllData(false); // Silent Refresh
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "casting_db" },
        (payload) => {
          console.log("🔔 Casting Update:", payload);
          fetchAllData(false); // Silent Refresh
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channels);
    };
  }, [view]); // Re-run when view switches to dashboard

  // --- 2. LOGIN (SUPABASE) ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase
        .from("crew_db")
        .select("*")
        .eq("access_key", accessKey.trim())
        .single();

      if (data) {
        setCrewUser(data);
        setView("dashboard");
        fetchAllData(true); // Initial load with spinner
      } else {
        setError("Access Denied: Invalid Credentials");
      }
    } catch (err) {
      setError("Connection Error");
    }
    setLoading(false);
  };

  // --- 3. DATA FETCHING (SUPABASE) ---
  const fetchAllData = async (showLoadingScreen = false) => {
    if (showLoadingScreen) setIsLoadingData(true);

    try {
      // A. Get Intakes (Status = NEW)
      const { data: intakeData } = await supabase
        .from("project_intake_db")
        .select("*")
        .eq("status", "NEW")
        .order("created_at", { ascending: false });

      if (intakeData) {
        const formattedIntakes = intakeData.map((i) => ({
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
        }));
        setIntakes(formattedIntakes);
      }

      // B. Get Projects (production_db)
      const { data: projData } = await supabase
        .from("production_db")
        .select("*")
        .order("created_at", { ascending: false });

      const mappedProjects = (projData || []).map((p) => ({
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
        "Backup A": p.backup_a,
        "Backup A Email": p.backup_a_email,
        "Backup B": p.backup_b,
        "Backup B Email": p.backup_b_email,
        "Backup C": p.backup_c,
        "Backup C Email": p.backup_c_email,
        "Backup D": p.backup_d,
        "Backup D Email": p.backup_d_email,
        "Contract Data": p.contract_data,
        "Project Booked Date": p.project_booked_date,
        "Project Correspondence": p.project_correspondence,
      }));
      setProjects(mappedProjects);

      // C. Get Roles (casting_db)
      const { data: roleData } = await supabase.from("casting_db").select("*");
      const mappedRoles = (roleData || []).map((r) => ({
        "Project ID": r.project_id,
        "Role ID": r.role_id,
        "Character Name": r.role_name,
        Gender: r.gender,
        "Age Range": r.age,
        "Vocal Specs": r.vocal_specs,
        Status: r.status,
        "Assigned Actor": r.assigned_actor,
      }));
      setAllRoles(mappedRoles);
      // D. Get Roster (actor_db)
      const { data: actorData } = await supabase
        .from("actor_db")
        .select("*")
        .order("name", { ascending: true });

      const mappedRoster = (actorData || []).map((a) => ({
        name: a.name,
        id: a.actor_id,
        email: a.email,
        pseudonym: a.pseudonym,
        gender: a.gender,
        age_range: a.age_range,
        voice: a.voice_type,
        genres: a.genres,
        status: a.status,
        next_avail: a.next_available,
        rate: a.pfh_rate,
        sag: a.union_status,
        link: a.website_link,
        triggers: a.triggers,
        bookouts: a.bookouts,

        // 🟢 CRITICAL MAPPINGS - VERIFY THESE
        notes: a.other_notes, // Private Notes
        training: a.training_notes, // Training
        bio: a.bio, // Public Bio
        audiobooks: a.audiobooks_narrated, // Audiobooks Count

        // 🟢 MEDIA MAPPINGS
        headshot: a.headshot_url,
        demo: a.demo_url,
        resume: a.resume_url,
      }));
      setRoster(mappedRoster);
    } catch (e) {
      console.error("Fetch error", e);
    }

    if (showLoadingScreen) setIsLoadingData(false);
  };

  // --- 4. APPROVE & EXPLODE ---
  const handleApproveIntake = async () => {
    if (!selectedIntake) return;
    setProcessingId(selectedIntake.id);

    try {
      const projectId = "PROJ-" + Math.floor(1000 + Math.random() * 9000);
      const dates = (selectedIntake.timeline || "").split("|");

      const { error: prodError } = await supabase.from("production_db").insert([
        {
          project_id: projectId,
          title: selectedIntake.title,
          start_date_1: dates[0] || "",
          start_date_2: dates[1] || "",
          start_date_3: dates[2] || "",
          status: "CASTING",
          qc_status: "No QC",
          coordinator: "Unassigned",
        },
      ]);

      if (prodError) throw prodError;

      const charBlock = selectedIntake.characters || "";
      const lines = charBlock
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l.length > 2);

      const rolesToInsert = lines.map((line) => {
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

          const detailParts = details.split("-").map((s) => s.trim());
          if (detailParts.length >= 2) {
            charName = detailParts[0];
            age = detailParts[1] || "Any";
            specs = detailParts.slice(2).join(" - ") || "Standard";
          } else {
            charName = details;
          }
        }

        return {
          project_id: projectId,
          role_id: "ROLE-" + Math.floor(10000 + Math.random() * 90000),
          role_name: charName,
          gender: gender,
          age: age,
          vocal_specs: specs,
          status: "Open",
          assigned_actor: "",
        };
      });

      if (rolesToInsert.length > 0) {
        const { error: castError } = await supabase
          .from("casting_db")
          .insert(rolesToInsert);
        if (castError) throw castError;
      }

      await supabase
        .from("project_intake_db")
        .update({ status: "APPROVED" })
        .eq("id", selectedIntake.db_id);

      alert(`Project Approved! Created ID: ${projectId}`);
      setSelectedIntake(null);
      // NOTE: We don't need to call fetchAllData() here because Realtime will catch the INSERT event!
    } catch (err) {
      console.error(err);
      alert("Approval Failed: " + err.message);
    }
    setProcessingId(null);
  };

  // --- 5. DELETE INTAKE ---
  const handleDeleteIntake = async () => {
    if (!selectedIntake) return;
    if (!confirm("Are you sure you want to REJECT and DELETE this request?"))
      return;

    setProcessingId(selectedIntake.id);

    try {
      const { error } = await supabase
        .from("project_intake_db")
        .delete()
        .eq("id", selectedIntake.db_id);

      if (error) throw error;

      setSelectedIntake(null);
      // Realtime will catch the DELETE event
    } catch (err) {
      alert("Delete Failed: " + err.message);
    }
    setProcessingId(null);
  };

  // --- 6. SAVE PROJECT (With Override Support) ---
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
        script_prep: projectToSave["Script Prep"],
        script_prep_email: projectToSave["Script Prep Email"],
        engineer: projectToSave["Engineer"],
        engineer_email: projectToSave["Engineer Email"],
        proofer: projectToSave["Proofer"],
        proofer_email: projectToSave["Proofer Email"],

        talent_a: projectToSave["Talent A"],
        talent_a_email: projectToSave["Talent A Email"],
        talent_b: projectToSave["Talent B"],
        talent_b_email: projectToSave["Talent B Email"],
        talent_c: projectToSave["Talent C"],
        talent_c_email: projectToSave["Talent C Email"],
        talent_d: projectToSave["Talent D"],
        talent_d_email: projectToSave["Talent D Email"],

        qc_status: projectToSave["QC Status"],
        status: projectToSave["Status"],

        backup_a: projectToSave["Backup A"],
        backup_a_email: projectToSave["Backup A Email"],
        backup_b: projectToSave["Backup B"],
        backup_b_email: projectToSave["Backup B Email"],
        backup_c: projectToSave["Backup C"],
        backup_c_email: projectToSave["Backup C Email"],
        backup_d: projectToSave["Backup D"],
        backup_d_email: projectToSave["Backup D Email"],

        contract_data: projectToSave["Contract Data"],
        project_booked_date: projectToSave["Project Booked Date"],
        project_correspondence: projectToSave["Project Correspondence"],
      };

      const { error } = await supabase
        .from("production_db")
        .update(updatePayload)
        .eq("project_id", projectToSave["Project ID"]);

      if (error) throw error;

      // Optimistic UI update
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

  const updateField = (field, value) => {
    setSelectedProject((prev) => ({ ...prev, [field]: value }));
  };

  const handleCastingConfirm = (selections) => {
    setCastingSelections(selections);
    setActiveTab("schedule");
  };

  // --- RENDER ---
  if (view === "login")
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative bg-[radial-gradient(circle_at_50%_0%,_#1a0f5e_0%,_#020014_70%)]">
        {/* 🟢 NAVIGATION: DUAL BACK BUTTONS */}
        <div className="absolute top-6 left-6 z-50 flex flex-col items-start gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-gold/60 hover:text-gold text-xs uppercase tracking-widest transition-colors"
          >
            <ArrowLeft size={14} /> Back to Hub
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-500 hover:text-white text-xs uppercase tracking-widest transition-colors pl-1"
          >
            <Globe size={12} /> Public Home
          </Link>
        </div>

        <div className="w-full max-w-[400px] rounded-2xl border border-gold/30 backdrop-blur-2xl bg-black/40 p-10 shadow-2xl animate-fade-in-up">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-gold/30">
              <Shield className="w-8 h-8 text-gold" />
            </div>
            <h2 className="text-2xl font-serif text-gold mb-2">Crew Portal</h2>
            <p className="text-xs text-gray-400 uppercase tracking-[0.2em]">
              Authorized Personnel Only
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="password"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              className="w-full bg-white/5 border border-gold/20 text-white py-4 pl-4 pr-4 rounded-xl text-center text-lg tracking-[0.2em] outline-none focus:border-gold focus:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all placeholder:text-gray-600 placeholder:text-sm placeholder:tracking-normal"
              placeholder="ACCESS KEY"
            />
            {error && (
              <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-xs text-center flex items-center justify-center gap-2 animate-fade-in">
                <AlertTriangle size={14} /> {error}
              </div>
            )}
            <button
              disabled={loading}
              className="w-full bg-gold hover:bg-gold-light text-midnight font-bold py-4 rounded-xl uppercase tracking-widest flex justify-center gap-2 transition-all transform hover:-translate-y-0.5 shadow-lg shadow-gold/20"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Verify Credentials"
              )}
            </button>
          </form>
        </div>
      </div>
    );

  if (isLoadingData)
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_50%_0%,_#1a0f5e_0%,_#020014_70%)] flex flex-col items-center justify-center text-white z-50">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-white/10 border-t-gold rounded-full animate-spin"></div>
        </div>
        <h2 className="mt-6 text-xl font-serif text-gold tracking-widest animate-pulse">
          Accessing Database...
        </h2>
      </div>
    );

  const currentRoles = selectedProject
    ? allRoles.filter((r) => r["Project ID"] === selectedProject["Project ID"])
    : [];

  return (
    <div className="flex h-screen bg-[radial-gradient(circle_at_50%_0%,_#1a0f5e_0%,_#020014_70%)] text-white font-sans overflow-hidden">
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
            <div className="mb-8 flex justify-between items-end">
              <h1 className="text-3xl font-serif text-white flex items-center gap-3">
                <LayoutDashboard className="text-gold" /> Crew Overview
              </h1>
              <div className="flex items-center gap-3">
                {/* Live Indicator */}
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-[10px] uppercase font-bold text-green-400 tracking-wider">
                    Live
                  </span>
                </div>
                <button
                  onClick={() => fetchAllData(false)}
                  className="text-xs text-gold border border-gold/30 px-3 py-1 rounded hover:bg-gold/10 flex items-center gap-2"
                >
                  <Loader2 size={12} /> Sync
                </button>
              </div>
            </div>
            <DashboardStats
              data={projects}
              onNavigate={() => setView("roster")}
            />
            <div className="mt-12">
              <h3 className="text-gold font-bold uppercase tracking-widest border-b border-white/10 pb-2 mb-4">
                New Project Requests ({intakes.length})
              </h3>
              {intakes.length === 0 ? (
                <div className="p-8 text-center text-gray-500 bg-white/5 rounded-xl border border-white/5">
                  No new requests pending.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {intakes.map((intake) => (
                    <div
                      key={intake.id}
                      onClick={() => setSelectedIntake(intake)}
                      className="bg-white/5 border border-white/10 p-5 rounded-xl hover:border-gold/50 cursor-pointer transition-all hover:bg-white/10 group"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] bg-gold/20 text-gold px-2 py-1 rounded border border-gold/10">
                          {intake.clientType}
                        </span>
                        <span className="text-[10px] text-gray-500">
                          {new Date(intake.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-serif text-xl text-white group-hover:text-gold mb-1 truncate">
                        {intake.title}
                      </h4>
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
          <div className="max-w-6xl mx-auto">
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
          <div className="bg-midnight border border-gold/30 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-black/40 p-6 border-b border-gold/20 flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-2xl font-serif text-gold">
                  {selectedIntake.title}
                </h2>
                <p className="text-xs text-gray-400 uppercase tracking-widest">
                  {selectedIntake.id} • {selectedIntake.clientName}
                </p>
              </div>
              <button
                onClick={() => setSelectedIntake(null)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-8 overflow-y-auto custom-scrollbar space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gold block text-xs uppercase mb-1">
                    Email
                  </span>
                  {selectedIntake.email}
                </div>
                <div>
                  <span className="text-gold block text-xs uppercase mb-1">
                    Word Count
                  </span>
                  {selectedIntake.wordCount}
                </div>
                <div>
                  <span className="text-gold block text-xs uppercase mb-1">
                    Style
                  </span>
                  {selectedIntake.style}
                </div>
                <div>
                  <span className="text-gold block text-xs uppercase mb-1">
                    Genres
                  </span>
                  {selectedIntake.genres}
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded border border-white/10">
                <span className="text-gold block text-xs uppercase mb-2">
                  Character Breakdown
                </span>
                <pre className="text-xs text-gray-300 whitespace-pre-wrap font-sans">
                  {selectedIntake.characters}
                </pre>
              </div>
              <div className="bg-white/5 p-4 rounded border border-white/10">
                <span className="text-gold block text-xs uppercase mb-2">
                  Notes
                </span>
                <p className="text-sm text-gray-300">
                  {selectedIntake.notes || "None"}
                </p>
              </div>
            </div>
            <div className="p-6 bg-black/40 border-t border-gold/20 flex justify-between items-center shrink-0">
              <button
                onClick={handleDeleteIntake}
                disabled={processingId === selectedIntake.id}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-4 py-2 rounded text-xs uppercase tracking-widest transition-colors flex items-center gap-2 border border-transparent hover:border-red-500/30"
              >
                <Trash2 size={14} /> Reject
              </button>
              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedIntake(null)}
                  className="px-4 py-2 text-gray-400 hover:text-white text-sm uppercase transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handleApproveIntake}
                  disabled={processingId === selectedIntake.id}
                  className="bg-gold hover:bg-gold-light text-midnight font-bold px-6 py-2 rounded uppercase tracking-widest text-sm flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-gold/10 transition-all"
                >
                  {processingId === selectedIntake.id ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <CheckCircle size={16} />
                  )}{" "}
                  Approve & Explode
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
