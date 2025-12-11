import React from "react";
import {
  BarChart,
  Activity,
  CheckCircle,
  Briefcase,
  AlertTriangle,
  Users,
} from "lucide-react";

const getLoadColor = (pct) => {
  if (pct > 40) return { text: "text-red-500", bg: "bg-red-500" };
  if (pct > 25) return { text: "text-orange-400", bg: "bg-orange-500" };
  if (pct > 15) return { text: "text-blue-400", bg: "bg-blue-500" };
  return { text: "text-emerald-400", bg: "bg-emerald-500" };
};

const PipelineBar = ({ label, value, totalProjects }) => {
  const pct = totalProjects ? (value / totalProjects) * 100 : 0;
  const theme = getLoadColor(pct);
  return (
    <div className="group">
      <div className="flex justify-between items-end mb-2">
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-white transition">
          {label}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500">{pct.toFixed(0)}%</span>
          <span className={`text-sm font-bold ${theme.text}`}>{value}</span>
        </div>
      </div>
      <div className="w-full h-4 bg-black/20 rounded-full overflow-hidden border border-white/5">
        <div
          className={`h-full ${theme.bg} transition-all duration-1000 ease-out shadow-lg relative`}
          style={{ width: `${pct}%` }}
        >
          <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20" />
        </div>
      </div>
    </div>
  );
};

const DashboardStats = ({ data, onNavigate }) => {
  const safeData = Array.isArray(data) ? data : [];
  const totalProjects = safeData.length;
  const countStatus = (status) =>
    safeData.filter((p) => (p["Status"] || "").toUpperCase().trim() === status)
      .length;
  const newCount = countStatus("NEW");
  const negCount = countStatus("NEGOTIATING");
  const castCount = countStatus("CASTING");
  const prodCount = countStatus("IN PRODUCTION");
  const compCount = countStatus("COMPLETE");
  const lateCount = safeData.filter((p) => {
    if (!p["Start Date"] || (p["Status"] || "").toUpperCase() === "COMPLETE")
      return false;
    const delivery = new Date(p["Start Date"]);
    const today = new Date();
    return delivery < today;
  }).length;

  return (
    <div className="space-y-6 animate-fade-in-down">
      <div className="flex justify-end">
        <button
          onClick={() => onNavigate("roster")}
          className="flex items-center gap-2 px-5 py-2 bg-midnight border border-gold/20 hover:border-gold/50 text-gray-400 hover:text-gold rounded-lg transition-all shadow-md group"
        >
          <Users className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">
            Talent Manager
          </span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-midnight border border-gold/20 p-6 rounded-xl flex items-center gap-4 shadow-lg">
          <div className="p-3 rounded-full bg-blue-500/10 text-blue-400">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="text-3xl font-bold text-white">{totalProjects}</div>
            <div className="text-[10px] uppercase tracking-widest text-gray-400">
              Total Database
            </div>
          </div>
        </div>
        <div className="bg-midnight border border-gold/20 p-6 rounded-xl flex items-center gap-4 shadow-lg">
          <div className="p-3 rounded-full bg-gold/10 text-gold">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="text-3xl font-bold text-white">
              {totalProjects - compCount}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-gray-400">
              Active Pipeline
            </div>
          </div>
        </div>
        <div className="bg-midnight border border-red-500/30 p-6 rounded-xl flex items-center gap-4 shadow-lg relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="p-3 rounded-full bg-red-500/10 text-red-500 z-10">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="z-10">
            <div className="text-3xl font-bold text-white">{lateCount}</div>
            <div className="text-[10px] uppercase tracking-widest text-red-400">
              Past Due
            </div>
          </div>
        </div>
        <div className="bg-midnight border border-gold/20 p-6 rounded-xl flex items-center gap-4 shadow-lg">
          <div className="p-3 rounded-full bg-green-500/10 text-green-400">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-3xl font-bold text-white">{compCount}</div>
            <div className="text-[10px] uppercase tracking-widest text-gray-400">
              Completed
            </div>
          </div>
        </div>
      </div>
      <div className="bg-midnight border border-gold/30 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <BarChart className="absolute -right-12 -bottom-12 text-gold opacity-5 w-80 h-80 rotate-12 pointer-events-none" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 flex flex-col justify-center">
            <h3 className="text-3xl font-serif font-bold text-white mb-2">
              Studio Pipeline
            </h3>
            <p className="text-sm text-gray-400 mb-8">
              Live breakdown. Colors intensify based on volume.
            </p>
            <div className="bg-gold/5 border border-gold p-6 rounded-xl">
              <div className="text-gold text-xs font-bold uppercase tracking-widest mb-1">
                Incoming / New
              </div>
              <div className="text-5xl font-black text-white">{newCount}</div>
            </div>
          </div>
          <div className="lg:col-span-8 space-y-6 flex flex-col justify-center">
            <PipelineBar
              label="New Projects"
              value={newCount}
              totalProjects={totalProjects}
            />
            <PipelineBar
              label="Negotiating"
              value={negCount}
              totalProjects={totalProjects}
            />
            <PipelineBar
              label="Casting"
              value={castCount}
              totalProjects={totalProjects}
            />
            <PipelineBar
              label="In Production"
              value={prodCount}
              totalProjects={totalProjects}
            />
            <PipelineBar
              label="Complete"
              value={compCount}
              totalProjects={totalProjects}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardStats;
