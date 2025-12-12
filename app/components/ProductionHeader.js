import React from "react";
import { Save, Loader2, Calendar, User, Activity } from "lucide-react";

export default function ProjectHeader({
  project,
  saveProject,
  saving,
  activeTab,
  setActiveTab,
  updateField,
  metaStatuses,
  tabs,
}) {
  if (!project) return null;

  return (
    <div className="mb-8 animate-fade-in-down">
      {/* TOP ROW: Title & Save */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex-1 w-full">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] bg-gold/20 text-gold px-2 py-0.5 rounded border border-gold/10 uppercase tracking-wider">
              {project["Project ID"]}
            </span>
          </div>

          {/* EDITABLE TITLE */}
          <input
            type="text"
            value={project["Title"] || ""}
            onChange={(e) => updateField("Title", e.target.value)}
            className="text-3xl md:text-4xl font-serif text-white bg-transparent border-b border-transparent hover:border-white/20 focus:border-gold outline-none transition-all w-full placeholder:text-gray-600"
            placeholder="Project Title"
          />
        </div>

        {/* SAVE BUTTON */}
        <button
          onClick={saveProject}
          disabled={saving}
          className="bg-gold hover:bg-gold-light text-midnight font-bold px-6 py-3 rounded-lg shadow-lg shadow-gold/10 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 uppercase tracking-widest text-xs"
        >
          {saving ? (
            <>
              <Loader2 className="animate-spin w-4 h-4" /> Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Changes
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
              onChange={(e) => updateField("Coordinator", e.target.value)}
            />
          </div>
        </div>

        {/* STATUS DROPDOWN */}
        <div className="bg-white/5 border border-white/10 p-3 rounded-lg flex items-center gap-3 relative group">
          <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-gray-400">
            <Activity size={14} />
          </div>
          <div className="flex-1">
            <label className="text-[9px] text-gray-500 uppercase tracking-wider block">
              Current Status
            </label>
            <select
              value={project["Status"] || "NEW"}
              onChange={(e) => updateField("Status", e.target.value)}
              className="bg-transparent text-sm text-gold font-bold outline-none w-full appearance-none cursor-pointer [&>option]:bg-midnight"
            >
              {metaStatuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* DATE SUMMARY (Read Only - Edit in Schedule Tab) */}
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

      {/* NAVIGATION TABS */}
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
