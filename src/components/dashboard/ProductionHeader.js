"use client";

import React, { useState } from "react";
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
} from "lucide-react";

// --- CONFIG ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const FORMAT_OPTIONS = [
  { label: "Solo Audiobook", value: "Solo Audiobook" },
  { label: "Solo Audiodrama", value: "Solo Audiodrama" },
  { label: "Dual Audiobook", value: "Dual Audiobook" },
  { label: "Dual Audiodrama", value: "Dual Audiodrama" },
  { label: "Duet Audiobook", value: "Duet Audiobook" },
  { label: "Duet Audiodrama", value: "Duet Audiodrama" },
  { label: "Multi-Cast Audiobook", value: "Multi-Cast Audiobook" },
  { label: "Multi-Cast Audiodrama", value: "Multi-Cast Audiodrama" },
];

const MASTER_STATUSES = [
  { id: "NEW", label: "New / Incoming" },
  { id: "NEGOTIATING", label: "Negotiating" },
  { id: "CASTING", label: "Casting" },
  { id: "PRE-PRODUCTION", label: "Pre-Production" },
  { id: "IN PRODUCTION", label: "In Production" },
  { id: "POST-PRODUCTION", label: "Post-Production" },
  { id: "COMPLETE", label: "Complete" },
  { id: "CANCELLED", label: "Cancelled" },
  { id: "HOLD", label: "HOLD" },
];

export default function ProjectHeader({
  project,
  saveProject,
  saving,
  updateField,
  userKey,
  onRecycleSuccess,
  onDeleteSuccess,
}) {
  const [hasChanges, setHasChanges] = useState(false);
  const [isRecycling, setIsRecycling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showRecycleModal, setShowRecycleModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 🟡 GLOW LOGIC
  const isOnHold = project["Status"] === "HOLD";
  const isCinematic = project["Format"]?.includes("Audiodrama");
  const THEME_BORDER = isCinematic
    ? "rgba(212,175,55,0.3)"
    : "rgba(192,192,192,0.3)";

  const handleFieldChange = (field, value) => {
    setHasChanges(true);
    updateField(field, value);
  };

  // 🟢 FIXED: Wrapper to handle UI state after save
  const handleManualSave = async () => {
    if (!hasChanges) return;
    await saveProject(); // Wait for parent
    setHasChanges(false); // Stop the pulse
  };

  const executeRecycle = async () => {
    setIsRecycling(true);
    try {
      // Ensure we target the text ID column for recycling too
      const { error } = await supabase.rpc("secure_recycle_project", {
        secret_pass: userKey,
        target_project_id: project["Project ID"],
      });
      if (error) throw error;
      setShowRecycleModal(false);
      if (onRecycleSuccess) onRecycleSuccess();
    } catch (err) {
      alert("Recycle Failed: " + err.message);
      setIsRecycling(false);
    }
  };

  // 🟢 FIXED: Now targets 'project_id' (the text ID) instead of 'id' (uuid)
  const executeDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("projects_db")
        .delete()
        .eq("project_id", project["Project ID"]); // <--- CHANGED THIS

      if (error) throw error;
      if (onDeleteSuccess) onDeleteSuccess();
    } catch (err) {
      alert("Delete Failed: " + err.message);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (!project) return null;

  return (
    <div
      className={`mb-8 animate-fade-in relative p-4 rounded-2xl transition-all duration-700 ${
        isOnHold
          ? "ring-2 ring-yellow-500/50 bg-yellow-500/5 shadow-[0_0_30px_rgba(234,179,8,0.2)]"
          : ""
      }`}
    >
      {/* 🟢 HOLD GLOW LABEL */}
      {isOnHold && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black px-6 py-1 rounded-full text-[10px] font-black tracking-[0.3em] uppercase animate-pulse shadow-[0_0_20px_rgba(234,179,8,0.8)] z-50">
          Project On Hold / Review Required
        </div>
      )}

      {/* 🔴 RESTORED: DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
          <div className="bg-[#1a0505] border border-red-600/50 w-full max-w-md rounded-xl shadow-[0_0_50px_rgba(255,0,0,0.2)] p-8 text-center">
            <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-serif text-white mb-2">
              Terminate Project?
            </h3>
            <p className="text-gray-400 text-sm mb-8">
              This action is permanent. The record will be purged from the
              mainframe.
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

      {/* 🟡 RESTORED: RECYCLE MODAL */}
      {showRecycleModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-[#0c0442] border border-[#d4af37]/50 w-full max-w-md rounded-xl shadow-2xl p-8 text-center">
            <RotateCcw className="w-12 h-12 text-[#d4af37] mx-auto mb-4" />
            <h3 className="text-2xl font-serif text-white mb-4">
              Reverse Explosion?
            </h3>
            <p className="text-gray-400 text-sm mb-8">
              This will return the request to the <b>Intake Holding Tank</b>{" "}
              with a <b>Hold</b> label.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowRecycleModal(false)}
                className="py-3 rounded-lg border border-white/10 text-gray-300 hover:bg-white/5 font-bold text-xs uppercase"
              >
                Cancel
              </button>
              <button
                onClick={executeRecycle}
                disabled={isRecycling}
                className="py-3 rounded-lg bg-[#d4af37] hover:bg-[#b8962e] text-black font-bold text-xs uppercase flex items-center justify-center gap-2"
              >
                {isRecycling ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  "Confirm Recycle"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOP ROW: ID, Status, Title, Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div className="flex-1 w-full">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] text-gray-500 font-mono border border-white/10 px-2 py-0.5 rounded bg-[#0a0a0a]">
              {project["Project ID"]}
            </span>
            {hasChanges && (
              <span className="text-[9px] text-yellow-400 font-bold animate-pulse flex items-center gap-1.5 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20">
                <RefreshCw size={10} className="animate-spin" /> Unsaved Changes
              </span>
            )}
          </div>
          <input
            type="text"
            value={project["Title"] || ""}
            onChange={(e) => handleFieldChange("Title", e.target.value)}
            className="text-3xl md:text-4xl font-serif text-white bg-transparent border-b border-transparent hover:border-white/10 focus:border-[#d4af37] outline-none transition-all w-full placeholder:text-gray-700 py-1"
            placeholder="Untitled Project"
          />
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowRecycleModal(true)}
            className="p-3 rounded-xl border border-white/10 text-gray-500 hover:text-[#d4af37] hover:bg-[#d4af37]/10 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="p-3 rounded-xl border border-white/10 text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleManualSave}
            disabled={saving || !hasChanges}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-all border ${
              hasChanges
                ? "bg-[#d4af37] text-black border-[#d4af37]"
                : "bg-transparent text-gray-500 border-white/10 opacity-50 cursor-not-allowed"
            }`}
          >
            {saving ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? "Transmitting..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* MATRIX */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* CHANGE PROJECT TYPE / FORMAT */}
        <div
          className="bg-[#0a0a0a] border rounded-xl p-4 flex items-center gap-4 group transition-all hover:border-[#d4af37]/50"
          style={{ borderColor: THEME_BORDER }}
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isCinematic
                ? "bg-[#d4af37]/20 text-[#d4af37]"
                : "bg-white/10 text-gray-400"
            }`}
          >
            {isCinematic ? <Clapperboard size={20} /> : <Mic size={20} />}
          </div>
          <div className="flex-1">
            <label className="text-[9px] text-gray-500 uppercase tracking-widest font-bold block mb-1">
              Production Format
            </label>
            <div className="relative">
              <select
                value={project["Format"] || ""}
                onChange={(e) => handleFieldChange("Format", e.target.value)}
                className="w-full bg-transparent text-sm font-bold text-white outline-none appearance-none cursor-pointer relative z-10 pr-8"
              >
                {FORMAT_OPTIONS.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    className="bg-[#0a0a0a] text-white"
                  >
                    {opt.label}
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

        {/* CHANGE PRODUCTION STAGE */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-4 flex items-center gap-4 hover:border-blue-500/50 transition-all">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Layers size={20} />
          </div>
          <div className="flex-1">
            <label className="text-[9px] text-gray-500 uppercase tracking-widest font-bold block mb-1">
              Pipeline Stage
            </label>
            <div className="relative">
              <select
                value={project["Status"] || ""}
                onChange={(e) => handleFieldChange("Status", e.target.value)}
                className="w-full bg-transparent text-sm font-bold text-blue-400 outline-none appearance-none cursor-pointer relative z-10 pr-8"
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
  );
}
