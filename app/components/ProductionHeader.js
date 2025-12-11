import React from "react";
import { Save, Loader2, Clock } from "lucide-react";

const ProjectHeader = ({
  project,
  saveProject,
  saving,
  activeTab,
  setActiveTab,
  updateField,
  metaStatuses,
  tabs,
}) => {
  if (!project) return null;

  return (
    <div className="mb-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] text-gray-400 font-mono">
              {project["Project ID"]}
            </span>
            <select
              value={project["Status"] || "NEW"}
              onChange={(e) => updateField("Status", e.target.value)}
              className="bg-transparent text-gold text-xs font-bold uppercase tracking-widest border-none outline-none cursor-pointer hover:bg-white/5 rounded px-1 -ml-1 [&>option]:bg-midnight"
            >
              {metaStatuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <h2 className="text-3xl font-serif font-bold text-white leading-tight">
            {project["Title"]}
          </h2>
        </div>
        <button
          onClick={saveProject}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-gold hover:bg-[#b08d2b] text-midnight font-bold rounded-full shadow-lg hover:shadow-gold/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Changes
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white/5 p-4 rounded-lg border border-white/5">
        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">
            Start Date
          </label>
          <input
            type="date"
            className="bg-transparent text-white text-sm font-bold outline-none w-full cursor-pointer [color-scheme:dark]"
            value={
              project["Start Date"]
                ? new Date(project["Start Date"]).toISOString().split("T")[0]
                : ""
            }
            onChange={(e) => updateField("Start Date", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">
            End Date
          </label>
          <input
            type="date"
            className="bg-transparent text-white text-sm font-bold outline-none w-full cursor-pointer [color-scheme:dark]"
            value={
              project["End Date"]
                ? new Date(project["End Date"]).toISOString().split("T")[0]
                : ""
            }
            onChange={(e) => updateField("End Date", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">
            QC Status
          </label>
          <select
            className="bg-transparent text-sm font-bold text-blue-400 outline-none w-full [&>option]:bg-midnight"
            value={project["QC Status"] || "Pending"}
            onChange={(e) => updateField("QC Status", e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="In Review">In Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div className="flex items-center gap-2 border-l border-white/10 pl-4">
          <Clock className="w-4 h-4 text-gray-500" />
          <div className="text-xs text-gray-400">
            Auto-saves disabled. <br /> Remember to save.
          </div>
        </div>
      </div>

      <div className="flex border-b border-white/10">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-wide transition-all border-b-2 ${
                isActive
                  ? "border-gold text-gold bg-gold/5"
                  : "border-transparent text-gray-500 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive ? "text-gold" : "text-gray-600"
                }`}
              />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default ProjectHeader;
