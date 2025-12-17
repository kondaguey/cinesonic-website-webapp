import React, { useState } from "react";
import { Save, Loader2, Calendar, User, Activity } from "lucide-react";

// --- ATOMS ---
import Button from "../ui/Button";

// 1. MASTER LIST (Matches your Dashboard)
const MASTER_STATUSES = [
  { id: "NEW", label: "New / Incoming", color: "text-purple-400" },
  { id: "NEGOTIATING", label: "Negotiating", color: "text-pink-400" },
  { id: "CASTING", label: "Casting", color: "text-[#d4af37]" },
  { id: "PRE-PRODUCTION", label: "Pre-Production", color: "text-blue-400" },
  { id: "IN PRODUCTION", label: "In Production", color: "text-indigo-400" },
  { id: "POST-PRODUCTION", label: "Post-Production", color: "text-cyan-400" },
  { id: "COMPLETE", label: "Complete", color: "text-green-400" },
  { id: "CANCELLED", label: "Cancelled", color: "text-red-500" },
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

  const activeStatusConfig = MASTER_STATUSES.find(
    (s) => s.id === currentStatusID
  ) || { color: "text-white" };

  return (
    <div className="mb-8 animate-fade-in">
      {/* --- TOP ROW: TITLE & SAVE --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div className="flex-1 w-full relative group">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] bg-[#d4af37]/20 text-[#d4af37] px-2 py-0.5 rounded border border-[#d4af37]/10 uppercase tracking-wider font-bold">
              {project["Project ID"]}
            </span>
            {hasChanges && (
              <span className="text-[9px] text-red-400 font-bold animate-pulse flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                Unsaved Changes
              </span>
            )}
          </div>

          <input
            type="text"
            value={project["Title"] || ""}
            onChange={(e) => handleFieldUpdate("Title", e.target.value)}
            className="text-3xl md:text-5xl font-serif text-white bg-transparent border-b border-transparent hover:border-white/10 focus:border-[#d4af37] outline-none transition-all w-full placeholder:text-gray-700 py-2"
            placeholder="Untitled Project"
          />
        </div>

        {/* 🟢 SAVE BUTTON: Fixed Width Issue */}
        <Button
          onClick={handleSave}
          disabled={saving}
          variant={hasChanges ? "glow" : "solid"}
          color="#d4af37"
          // Added 'w-full md:w-auto' to override the default full width on desktop
          className={`shrink-0 w-full md:w-auto min-w-[160px] ${
            hasChanges
              ? "animate-pulse-slow shadow-[0_0_30px_rgba(212,175,55,0.4)]"
              : "opacity-80 hover:opacity-100"
          }`}
        >
          {saving ? (
            <>
              <Loader2 className="animate-spin w-4 h-4 mr-2" /> Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />{" "}
              {hasChanges ? "Save Changes" : "Saved"}
            </>
          )}
        </Button>
      </div>

      {/* --- META DATA ROW --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* 1. COORDINATOR INPUT */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-4 group hover:border-white/20 transition-colors">
          <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
            <User size={18} />
          </div>
          <div className="flex-1">
            <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block mb-1">
              Coordinator
            </label>
            <input
              className="bg-transparent text-sm text-white font-bold outline-none w-full placeholder:text-gray-600 focus:text-[#d4af37] transition-colors"
              placeholder="Unassigned"
              value={project["Coordinator"] || ""}
              onChange={(e) => handleFieldUpdate("Coordinator", e.target.value)}
            />
          </div>
        </div>

        {/* 2. STATUS DROPDOWN */}
        <div
          className={`bg-white/5 border p-4 rounded-xl flex items-center gap-4 relative group transition-colors ${
            hasChanges
              ? "border-[#d4af37]/50 bg-[#d4af37]/5"
              : "border-white/10 hover:border-white/20"
          }`}
        >
          <div
            className={`w-10 h-10 rounded-full bg-black/40 flex items-center justify-center transition-colors ${activeStatusConfig.color}`}
          >
            <Activity size={18} />
          </div>
          <div className="flex-1">
            <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block mb-1">
              Current Status
            </label>
            <div className="relative">
              <select
                value={currentStatusID}
                onChange={(e) => handleFieldUpdate("Status", e.target.value)}
                className={`bg-transparent text-sm font-bold outline-none w-full appearance-none cursor-pointer [&>option]:bg-[#0c0442] ${activeStatusConfig.color}`}
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
        </div>

        {/* 3. DATE DISPLAY */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-4 opacity-70 hover:opacity-100 transition-opacity cursor-default">
          <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-gray-400">
            <Calendar size={18} />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block mb-1">
              Target Start
            </label>
            <div className="text-sm text-gray-300 font-bold font-mono">
              {project["Start Date"]
                ? new Date(project["Start Date"]).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "TBD"}
            </div>
          </div>
        </div>
      </div>

      {/* --- TABS NAVIGATION --- */}
      <div className="flex gap-1 border-b border-white/10 overflow-x-auto pb-0 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-wider transition-all relative rounded-t-lg ${
                isActive
                  ? "text-[#d4af37] bg-white/[0.02]"
                  : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.01]"
              }`}
            >
              <Icon
                size={14}
                className={`transition-colors ${
                  isActive
                    ? "text-[#d4af37]"
                    : "text-gray-600 group-hover:text-gray-400"
                }`}
              />
              {tab.label}

              {isActive && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#d4af37] shadow-[0_-2px_10px_rgba(212,175,55,0.5)]"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
