import React, { useState } from "react";
import { Save, Loader2, Calendar, User, Activity } from "lucide-react";

// 1. MASTER LIST (Matches your Dashboard)
const MASTER_STATUSES = [
  { id: "NEW", label: "New / Incoming" },
  { id: "NEGOTIATING", label: "Negotiating" },
  { id: "CASTING", label: "Casting" },
  { id: "PRE-PRODUCTION", label: "Pre-Production" },
  { id: "IN PRODUCTION", label: "In Production" },
  { id: "POST-PRODUCTION", label: "Post-Production" },
  { id: "COMPLETE", label: "Complete" },
  { id: "CANCELLED", label: "Cancelled" },
];

export default function ProjectHeader({
  project,
  saveProject,
  saving,
  activeTab,
  setActiveTab,
  updateField,
  tabs,
}) {
  const [hasChanges, setHasChanges] = useState(false);

  if (!project) return null;

  // 🟢 WRAPPER: Tracks changes to trigger the "Glow"
  const handleFieldUpdate = (field, value) => {
    setHasChanges(true);
    updateField(field, value);
  };

  // 🟢 WRAPPER: Resets glow on save
  const handleSave = () => {
    saveProject();
    setHasChanges(false);
  };

  // 🟢 LOGIC: Robust Status Matcher
  const rawData = project["Status"];
  const currentStatusID = rawData
    ? String(rawData).toUpperCase().trim()
    : "NEW";

  return (
    <div className="mb-8">
      {/* TOP ROW */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex-1 w-full">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] bg-gold/20 text-gold px-2 py-0.5 rounded border border-gold/10 uppercase tracking-wider">
              {project["Project ID"]}
            </span>
            {hasChanges && (
              <span className="text-[9px] text-red-400 font-bold animate-pulse">
                (Unsaved Changes)
              </span>
            )}
          </div>
          <input
            type="text"
            value={project["Title"] || ""}
            onChange={(e) => handleFieldUpdate("Title", e.target.value)}
            className="text-3xl md:text-4xl font-serif text-white bg-transparent border-b border-transparent hover:border-white/20 focus:border-gold outline-none transition-all w-full placeholder:text-gray-600"
            placeholder="Project Title"
          />
        </div>

        {/* 🟢 SAVE BUTTON: Glows when changes are made */}
        <button
          onClick={handleSave}
          disabled={saving}
          className={`font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition-all disabled:opacity-50 uppercase tracking-widest text-xs duration-300 ${
            hasChanges
              ? "bg-gold text-midnight shadow-[0_0_30px_rgba(212,175,55,0.8)] scale-105 animate-pulse border-2 border-white/20"
              : "bg-gold/80 hover:bg-gold text-midnight shadow-lg shadow-gold/10"
          }`}
        >
          {saving ? (
            <>
              <Loader2 className="animate-spin w-4 h-4" /> Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />{" "}
              {hasChanges ? "Save Now!" : "Save Changes"}
            </>
          )}
        </button>
      </div>

      {/* META DATA ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* COORDINATOR */}
        <div className="bg-white/5 border border-white/10 p-3 rounded-lg flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-gray-400">
            <User size={14} />
          </div>
          <div className="flex-1">
            <label className="text-[9px] text-gray-500 uppercase tracking-wider block">
              Coordinator
            </label>
            <input
              className="bg-transparent text-sm text-white font-bold outline-none w-full placeholder:text-gray-600"
              placeholder="Unassigned"
              value={project["Coordinator"] || ""}
              onChange={(e) => handleFieldUpdate("Coordinator", e.target.value)}
            />
          </div>
        </div>

        {/* STATUS DROPDOWN (RESTORED) */}
        <div
          className={`bg-white/5 border p-3 rounded-lg flex items-center gap-3 relative group transition-colors ${
            hasChanges ? "border-gold/50" : "border-white/10"
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-gray-400">
            <Activity size={14} />
          </div>
          <div className="flex-1">
            <label className="text-[9px] text-gray-500 uppercase tracking-wider block">
              Current Status
            </label>
            <select
              value={currentStatusID}
              onChange={(e) => handleFieldUpdate("Status", e.target.value)}
              className="bg-transparent text-sm text-gold font-bold outline-none w-full appearance-none cursor-pointer [&>option]:bg-midnight"
            >
              {MASTER_STATUSES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
              {!MASTER_STATUSES.some((s) => s.id === currentStatusID) && (
                <option value={currentStatusID}>{rawData}</option>
              )}
            </select>
          </div>
        </div>

        {/* DATE SUMMARY */}
        <div className="bg-white/5 border border-white/10 p-3 rounded-lg flex items-center gap-3 opacity-70">
          <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-gray-400">
            <Calendar size={14} />
          </div>
          <div>
            <label className="text-[9px] text-gray-500 uppercase tracking-wider block">
              Target Start
            </label>
            <div className="text-sm text-gray-300 font-bold">
              {project["Start Date"]
                ? new Date(project["Start Date"]).toLocaleDateString()
                : "TBD"}
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-2 border-b border-white/10 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all relative ${
                isActive
                  ? "text-gold"
                  : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
              }`}
            >
              <Icon
                size={14}
                className={isActive ? "text-gold" : "text-gray-600"}
              />
              {tab.label}
              {isActive && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
