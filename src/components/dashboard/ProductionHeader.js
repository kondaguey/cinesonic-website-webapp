"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Save,
  Loader2,
  RotateCcw,
  Trash2,
  Mic,
  Clapperboard,
  ChevronDown,
  RefreshCw,
  Layers,
  User,
  CheckCircle2,
} from "lucide-react";

// --- CONFIG ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const MASTER_STATUSES = [
  { id: "Pre-Production", label: "Pre-Production", progress: 10 },
  { id: "Casting", label: "Casting", progress: 25 },
  { id: "In Production", label: "In Production", progress: 50 },
  { id: "Post-Production", label: "Post-Production", progress: 75 },
  { id: "Complete", label: "Complete", progress: 100 },
  { id: "Cancelled", label: "Cancelled", progress: 0 },
  { id: "On Hold", label: "On Hold", progress: 0 },
];

const STYLE_MAP = {
  SoloAB: "Solo Audiobook",
  SoloAD: "Solo Audio Drama",
  DualAB: "Dual Audiobook",
  DualAD: "Dual Audio Drama",
  DuetAB: "Duet Audiobook",
  DuetAD: "Duet Audio Drama",
  MultiAB: "Multi-Cast Audiobook",
  MultiAD: "Multi-Cast Audio Drama",
};

export default function ProjectHeader({
  project,
  onRevertSuccess,
  onDeleteSuccess,
  onProjectUpdate, // 🟢 1. NEW PROP ACCEPTED HERE
}) {
  // --- 1. LOCAL STATE ---
  const [data, setData] = useState({
    title: "",
    client_name: "",
    style: "",
    status: "",
  });
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSynced, setLastSynced] = useState(null);

  // Modals
  const [isReverting, setIsReverting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showRevertModal, setShowRevertModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // --- 2. FETCH DATA ---
  const fetchFreshData = async () => {
    if (!project?.project_ref_id) return;
    setLoading(true);

    const { data: dbData, error } = await supabase
      .from("active_productions")
      .select("title, client_name, style, production_status, updated_at")
      .eq("project_ref_id", project.project_ref_id)
      .single();

    if (dbData && !error) {
      setData({
        title: dbData.title || "",
        client_name: dbData.client_name || "",
        style: dbData.style || "",
        status: dbData.production_status || "Pre-Production",
      });
      setLastSynced(new Date(dbData.updated_at));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFreshData();
  }, [project?.project_ref_id]);

  if (!project) return null;

  // --- 3. DERIVED VISUALS ---
  const isCinematic =
    (data.style || "").endsWith("AD") || data.style === "MultiAD";
  const isOnHold = data.status === "On Hold";

  const THEME_BORDER = isCinematic
    ? "rgba(212,175,55,0.3)" // Gold
    : "rgba(192,192,192,0.3)"; // Silver

  const THEME_ICON_COLOR = isCinematic ? "text-[#d4af37]" : "text-gray-400";
  const THEME_BG_COLOR = isCinematic ? "bg-[#d4af37]/10" : "bg-white/10";

  // --- 4. HANDLERS ---

  const handleLocalChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  // 🟢 2. UPDATED SAVE HANDLER
  const handleSave = async () => {
    if (!hasChanges) return;
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("active_productions")
        .update({
          title: data.title,
          client_name: data.client_name,
          style: data.style,
          production_status: data.status,
          updated_at: new Date(),
        })
        .eq("project_ref_id", project.project_ref_id);

      if (error) throw error;

      setHasChanges(false);
      setLastSynced(new Date());

      // 🟢 TRIGGER PARENT UPDATE (WHICH UPDATES SIDEBAR)
      if (onProjectUpdate) onProjectUpdate();

      fetchFreshData(); // Silent re-fetch
    } catch (err) {
      alert("Save Failed: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const executeRevert = async () => {
    setIsReverting(true);
    try {
      const { error } = await supabase.rpc("revert_to_intake", {
        target_project_id: project.project_ref_id,
      });
      if (error) throw error;
      setShowRevertModal(false);
      if (onRevertSuccess) onRevertSuccess();
    } catch (err) {
      alert("Revert Failed: " + err.message);
    } finally {
      setIsReverting(false);
    }
  };

  const executeDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("active_productions")
        .delete()
        .eq("project_ref_id", project.project_ref_id);
      if (error) throw error;
      if (onDeleteSuccess) onDeleteSuccess();
    } catch (err) {
      alert("Delete Failed: " + err.message);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // --- RENDER ---
  return (
    <div
      className={`mb-8 animate-fade-in relative p-6 rounded-2xl transition-all duration-700 border border-white/5 bg-[#0a0a0a] shadow-2xl ${
        isOnHold
          ? "ring-2 ring-yellow-500/50 bg-yellow-500/5 shadow-[0_0_30px_rgba(234,179,8,0.2)]"
          : ""
      }`}
    >
      {/* BACKGROUND GRADIENT FX */}
      <div
        className="absolute inset-0 rounded-2xl opacity-20 pointer-events-none transition-all duration-1000"
        style={{
          background: isCinematic
            ? "radial-gradient(circle at top right, #d4af37 0%, transparent 60%)"
            : "radial-gradient(circle at top right, #4b5563 0%, transparent 60%)",
        }}
      />

      {/* HOLD BADGE */}
      {isOnHold && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black px-6 py-1 rounded-full text-[10px] font-black tracking-[0.3em] uppercase animate-pulse shadow-[0_0_20px_rgba(234,179,8,0.8)] z-50">
          Project On Hold / Review Required
        </div>
      )}

      {/* --- MODALS --- */}
      {showRevertModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-[#0c0442] border border-[#d4af37]/50 w-full max-w-md rounded-xl shadow-2xl p-8 text-center animate-in zoom-in-95">
            <RotateCcw className="w-12 h-12 text-[#d4af37] mx-auto mb-4" />
            <h3 className="text-2xl font-serif text-white mb-4">
              Revert to Intake?
            </h3>
            <p className="text-gray-400 text-sm mb-8">
              This will remove the project from Active Productions and return it
              to New Requests.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowRevertModal(false)}
                className="py-3 rounded-lg border border-white/10 text-gray-300 hover:bg-white/5 font-bold text-xs uppercase"
              >
                Cancel
              </button>
              <button
                onClick={executeRevert}
                disabled={isReverting}
                className="py-3 rounded-lg bg-[#d4af37] hover:bg-[#b8962e] text-black font-bold text-xs uppercase flex items-center justify-center gap-2"
              >
                {isReverting ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  "Confirm Revert"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
          <div className="bg-[#1a0505] border border-red-600/50 w-full max-w-md rounded-xl shadow-[0_0_50px_rgba(255,0,0,0.2)] p-8 text-center animate-in zoom-in-95">
            <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-serif text-white mb-2">
              Terminate Project?
            </h3>
            <p className="text-gray-400 text-sm mb-8">
              This action is <b>permanent</b> and cannot be undone.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="py-3 rounded-lg border border-white/10 text-gray-300 hover:bg-white/5 font-bold text-xs uppercase"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                disabled={isDeleting}
                className="py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  "Purge Data"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- HEADER CONTENT --- */}
      <div className="relative z-10">
        {/* TOP ROW: ID & SAVE */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-gray-500 font-mono border border-white/10 px-2 py-0.5 rounded bg-[#0a0a0a]">
              {project.project_ref_id}
            </span>
            {hasChanges && (
              <span className="text-[9px] text-yellow-400 font-bold animate-pulse flex items-center gap-1.5 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20">
                <RefreshCw size={10} className="animate-spin" /> Unsaved Changes
              </span>
            )}
            {!hasChanges && lastSynced && (
              <span className="text-[9px] text-gray-600 flex items-center gap-1 opacity-70">
                <CheckCircle2 size={10} /> Synced{" "}
                {lastSynced.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRevertModal(true)}
              className="p-2 rounded-lg border border-white/10 text-gray-500 hover:text-[#d4af37] hover:bg-[#d4af37]/10 transition-all"
              title="Revert to Intake"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="p-2 rounded-lg border border-white/10 text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
              title="Delete Project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-white/10 mx-1"></div>
            <button
              onClick={handleSave}
              disabled={isSaving || !hasChanges || loading}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold uppercase tracking-wider text-[10px] transition-all border ${
                hasChanges
                  ? "bg-[#d4af37] text-black border-[#d4af37] hover:scale-105 hover:shadow-lg hover:shadow-[#d4af37]/20"
                  : "bg-transparent text-gray-500 border-white/10 opacity-50 cursor-not-allowed"
              }`}
            >
              {isSaving ? (
                <Loader2 className="animate-spin w-3 h-3" />
              ) : (
                <Save className="w-3 h-3" />
              )}
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {/* MAIN EDITABLE AREA */}
        <div className="mb-8 pl-1">
          {/* Client Input */}
          <div className="flex items-center gap-2 mb-1 group">
            <User
              size={12}
              className="text-gray-600 group-hover:text-[#d4af37] transition-colors"
            />
            <input
              type="text"
              value={data.client_name}
              onChange={(e) => handleLocalChange("client_name", e.target.value)}
              className="bg-transparent text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white focus:text-white outline-none placeholder:text-gray-700 transition-colors w-full max-w-md border-b border-transparent focus:border-[#d4af37]/50"
              placeholder="CLIENT NAME / AUTHOR"
              disabled={loading}
            />
          </div>

          {/* Title Input */}
          <input
            type="text"
            value={data.title}
            onChange={(e) => handleLocalChange("title", e.target.value)}
            className="text-3xl md:text-5xl font-serif text-white bg-transparent border-b border-transparent hover:border-white/10 focus:border-[#d4af37] outline-none transition-all w-full placeholder:text-gray-800 py-2 leading-tight"
            placeholder={loading ? "Loading..." : "Untitled Project"}
            disabled={loading}
          />
        </div>

        {/* METADATA CONTROLS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. STYLE SELECTOR */}
          <div
            className="bg-[#0a0a0a] border rounded-xl p-4 flex items-center gap-4 group transition-all hover:border-white/30 relative overflow-hidden"
            style={{ borderColor: THEME_BORDER }}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-500 ${THEME_BG_COLOR} ${THEME_ICON_COLOR}`}
            >
              {isCinematic ? <Clapperboard size={20} /> : <Mic size={20} />}
            </div>
            <div className="flex-1 z-10">
              <label className="text-[9px] text-gray-500 uppercase tracking-widest font-bold block mb-1">
                Production Format
              </label>
              <div className="relative">
                <select
                  value={data.style}
                  onChange={(e) => handleLocalChange("style", e.target.value)}
                  className={`w-full bg-transparent text-sm font-bold outline-none appearance-none cursor-pointer relative z-10 pr-8 transition-colors duration-500 ${
                    isCinematic ? "text-[#d4af37]" : "text-white"
                  }`}
                  disabled={loading}
                >
                  {!data.style && (
                    <option value="" className="bg-[#0a0a0a]">
                      Select Format...
                    </option>
                  )}
                  {Object.entries(STYLE_MAP).map(([code, label]) => (
                    <option
                      key={code}
                      value={code}
                      className="bg-[#0a0a0a] text-white"
                    >
                      {label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* 2. STATUS SELECTOR */}
          <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-4 flex items-center gap-4 hover:border-blue-500/50 transition-all relative overflow-hidden">
            {/* Status Progress Bar Background */}
            <div
              className="absolute bottom-0 left-0 h-1 bg-blue-500/50 transition-all duration-1000"
              style={{
                width: `${
                  MASTER_STATUSES.find((s) => s.id === data.status)?.progress ||
                  0
                }%`,
              }}
            />

            <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Layers size={20} />
            </div>
            <div className="flex-1 z-10">
              <label className="text-[9px] text-gray-500 uppercase tracking-widest font-bold block mb-1">
                Pipeline Stage
              </label>
              <div className="relative">
                <select
                  value={data.status}
                  onChange={(e) => handleLocalChange("status", e.target.value)}
                  className="w-full bg-transparent text-sm font-bold text-blue-400 outline-none appearance-none cursor-pointer relative z-10 pr-8"
                  disabled={loading}
                >
                  {MASTER_STATUSES.map((s) => (
                    <option
                      key={s.id}
                      value={s.id}
                      className="bg-[#0a0a0a] text-white"
                    >
                      {s.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
