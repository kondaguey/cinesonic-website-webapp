import React, { useState } from "react";
import { Save, Loader2, Calendar, User, Activity } from "lucide-react";
import Button from "../ui/Button";
import { getProjectTheme } from "../ui/ThemeContext";

const MASTER_STATUSES = [
  { id: "NEW", label: "New / Incoming", color: "text-purple-400" },
  { id: "NEGOTIATING", label: "Negotiating", color: "text-pink-400" },
  { id: "CASTING", label: "Casting", color: "text-yellow-400" },
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

  // 🟢 DETERMINE COLORS
  const themeColor = getProjectTheme(project["Format"]);

  const handleFieldUpdate = (field, value) => {
    setHasChanges(true);
    updateField(field, value);
  };

  const handleSave = () => {
    saveProject();
    setHasChanges(false);
  };

  const currentStatusID = project["Status"]
    ? String(project["Status"]).toUpperCase().trim()
    : "NEW";
  const activeStatusConfig = MASTER_STATUSES.find(
    (s) => s.id === currentStatusID
  ) || { color: "text-white" };

  return (
    <div className="mb-8 animate-fade-in">
      {/* --- TOP ROW --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div className="flex-1 w-full relative group">
          <div className="flex items-center gap-3 mb-2">
            <span
              className="text-[10px] px-2 py-0.5 rounded border uppercase tracking-wider font-bold"
              style={{
                color: themeColor,
                backgroundColor: `${themeColor}20`,
                borderColor: `${themeColor}30`,
              }}
            >
              {project["Project ID"]}
            </span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">
              {project["Format"] || "Standard"}
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
            className="text-3xl md:text-5xl font-serif text-white bg-transparent border-b border-transparent hover:border-white/10 outline-none transition-all w-full placeholder:text-gray-700 py-2"
            style={{ caretColor: themeColor }}
            onFocus={(e) => (e.target.style.borderColor = themeColor)}
            onBlur={(e) => (e.target.style.borderColor = "transparent")}
            placeholder="Untitled Project"
          />
        </div>

        {/* 🟢 SAVE BUTTON */}
        <Button
          onClick={handleSave}
          disabled={saving}
          variant={hasChanges ? "solid" : "ghost"}
          color={themeColor}
          className={`shrink-0 w-full md:w-auto min-w-[160px] ${
            hasChanges
              ? "animate-pulse-slow shadow-lg"
              : "border border-white/10"
          }`}
          style={{
            boxShadow: hasChanges ? `0 0 30px ${themeColor}40` : "none",
            borderColor: hasChanges ? themeColor : "rgba(255,255,255,0.1)",
          }}
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
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-4 group hover:border-white/20 transition-colors">
          <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
            <User size={18} />
          </div>
          <div className="flex-1">
            <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block mb-1">
              Coordinator
            </label>
            <input
              className="bg-transparent text-sm text-white font-bold outline-none w-full placeholder:text-gray-600 transition-colors"
              placeholder="Unassigned"
              value={project["Coordinator"] || ""}
              onChange={(e) => handleFieldUpdate("Coordinator", e.target.value)}
              onFocus={(e) => (e.target.style.color = themeColor)}
              onBlur={(e) => (e.target.style.color = "white")}
            />
          </div>
        </div>

        <div
          className={`bg-white/5 border p-4 rounded-xl flex items-center gap-4 relative group transition-colors ${
            hasChanges ? "border-white/30 bg-white/10" : "border-white/10"
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
                  <option value={currentStatusID}>{project["Status"]}</option>
                )}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-4 cursor-default">
          <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-gray-400">
            <Calendar size={18} />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block mb-1">
              Target Start
            </label>
            <div className="text-sm text-gray-300 font-bold font-mono">
              {project["Start Date"]
                ? new Date(project["Start Date"]).toLocaleDateString()
                : "TBD"}
            </div>
          </div>
        </div>
      </div>

      {/* --- TABS --- */}
      <div className="flex gap-1 border-b border-white/10 overflow-x-auto pb-0 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-wider transition-all relative rounded-t-lg
                ${
                  isActive
                    ? "bg-white/[0.02] text-white"
                    : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.01]"
                }
              `}
              style={{ color: isActive ? themeColor : undefined }}
            >
              <Icon
                size={14}
                style={{ color: isActive ? themeColor : "currentColor" }}
              />
              {tab.label}
              {isActive && (
                <div
                  className="absolute bottom-0 left-0 w-full h-[2px]"
                  style={{
                    backgroundColor: themeColor,
                    boxShadow: `0 -2px 10px ${themeColor}50`,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
