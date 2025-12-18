import React, { useState, useMemo } from "react";
import {
  BarChart,
  Activity,
  CheckCircle,
  Briefcase,
  AlertTriangle,
  Users,
  RefreshCw,
  Filter,
  PieChart,
} from "lucide-react";

// CONFIG (Added Hex colors for the Donut Chart)
const STATUS_CONFIG = [
  {
    id: "NEW",
    label: "New / Incoming",
    color: "bg-purple-500",
    text: "text-purple-400",
    hex: "#a855f7",
  },
  {
    id: "NEGOTIATING",
    label: "Negotiating",
    color: "bg-pink-500",
    text: "text-pink-400",
    hex: "#ec4899",
  },
  {
    id: "CASTING",
    label: "Casting",
    color: "bg-[#d4af37]",
    text: "text-[#d4af37]",
    hex: "#d4af37",
  },
  {
    id: "PRE-PRODUCTION",
    label: "Pre-Production",
    color: "bg-blue-500",
    text: "text-blue-400",
    hex: "#3b82f6",
  },
  {
    id: "IN PRODUCTION",
    label: "In Production",
    color: "bg-indigo-500",
    text: "text-indigo-400",
    hex: "#6366f1",
  },
  {
    id: "POST-PRODUCTION",
    label: "Post-Production",
    color: "bg-cyan-500",
    text: "text-cyan-400",
    hex: "#06b6d4",
  },
  {
    id: "COMPLETE",
    label: "Complete",
    color: "bg-green-500",
    text: "text-green-400",
    hex: "#22c55e",
  },
  {
    id: "CANCELLED",
    label: "Cancelled",
    color: "bg-red-500",
    text: "text-red-500",
    hex: "#ef4444",
  },
];

const DashboardStats = ({ data, onNavigate, onSync, setFilterStatus }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const safeData = Array.isArray(data) ? data : [];
  const totalProjects = safeData.length;

  const handleSync = async () => {
    setIsSyncing(true);
    if (onSync) await onSync();
    setTimeout(() => setIsSyncing(false), 1000);
  };

  // --- 1. DATA MATH ---
  const counts = safeData.reduce((acc, p) => {
    let s = p["Status"];
    s = s ? String(s).toUpperCase().trim() : "NEW";
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const activeCount =
    totalProjects - (counts["COMPLETE"] || 0) - (counts["CANCELLED"] || 0);

  // Late Projects (Past Start Date but not Complete/Cancelled)
  const lateProjects = safeData.filter((p) => {
    const s = String(p["Status"] || "").toUpperCase();
    if (!p["Start Date"] || s.includes("COMPLETE") || s.includes("CANCELLED"))
      return false;
    const start = new Date(p["Start Date"]);
    const today = new Date();
    start.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return start < today;
  });

  // --- 2. DONUT CHART LOGIC (CSS CONIC GRADIENT) ---
  const conicGradient = useMemo(() => {
    let currentDeg = 0;
    const stops = STATUS_CONFIG.map((status) => {
      const count = counts[status.id] || 0;
      if (count === 0) return null;
      const deg = (count / totalProjects) * 360;
      const segment = `${status.hex} ${currentDeg}deg ${currentDeg + deg}deg`;
      currentDeg += deg;
      return segment;
    }).filter(Boolean);

    return stops.length > 0
      ? `conic-gradient(${stops.join(", ")})`
      : `conic-gradient(#333 0deg 360deg)`;
  }, [counts, totalProjects]);

  return (
    <div className="space-y-6 animate-fade-in-down">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-serif text-white">Crew Overview</h1>
          <p className="text-xs text-gray-400 mt-1">
            Welcome back. Production Intelligence is active.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[10px] font-mono font-bold text-green-400 tracking-wider">
                LIVE
              </span>
            </div>
            <div className="w-px h-3 bg-white/10"></div>
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              title="Sync Database"
            >
              <RefreshCw
                size={12}
                className={isSyncing ? "animate-spin" : ""}
              />
            </button>
          </div>

          <button
            onClick={() => onNavigate("roster")}
            className="flex items-center gap-2 bg-[#d4af37] hover:bg-[#b8860b] text-black font-bold uppercase tracking-wider text-xs px-6 py-2.5 rounded-lg shadow-lg hover:shadow-[#d4af37]/20 transition-all shrink-0 border border-[#d4af37]"
          >
            <Users size={16} /> Talent Manager
          </button>
        </div>
      </div>

      {/* --- STATS GRID (CLICKABLE FILTERS) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Briefcase}
          label="Total Database"
          value={totalProjects}
          theme="blue"
          onClick={() => setFilterStatus && setFilterStatus("All")}
        />
        <StatCard
          icon={Activity}
          label="Active Pipeline"
          value={activeCount}
          theme="gold"
          onClick={() => setFilterStatus && setFilterStatus("Active")} // You'll need to handle logic for "Active" group filter in sidebar if desired, or just map to "IN PRODUCTION"
        />
        <StatCard
          icon={AlertTriangle}
          label="Past Start Date"
          value={lateProjects.length}
          theme="red"
          onClick={() =>
            alert(`Warning: ${lateProjects.length} projects are delayed.`)
          }
        />
        <StatCard
          icon={CheckCircle}
          label="Completed"
          value={counts["COMPLETE"] || 0}
          theme="green"
          onClick={() => setFilterStatus && setFilterStatus("Complete")}
        />
      </div>

      {/* --- INTELLIGENCE GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. PIPELINE VISUALIZER (The Bars) */}
        <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <BarChart className="absolute -right-12 -bottom-12 text-[#d4af37] opacity-5 w-80 h-80 rotate-12 pointer-events-none" />
          <div className="relative z-10">
            <h3 className="text-xl font-serif font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="text-[#d4af37]" size={20} /> Studio Pipeline
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {STATUS_CONFIG.map((status) => (
                <PipelineBar
                  key={status.id}
                  label={status.label}
                  value={counts[status.id] || 0}
                  totalProjects={totalProjects}
                  colorClass={status.color}
                  textClass={status.text}
                  onClick={() => setFilterStatus && setFilterStatus(status.id)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 2. PROJECT HEALTH (Donut + Alerts) */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 shadow-2xl flex flex-col">
          <h3 className="text-xl font-serif font-bold text-white mb-6 flex items-center gap-2">
            <PieChart className="text-[#d4af37]" size={20} /> Project Health
          </h3>

          <div className="flex-1 flex flex-col items-center justify-center mb-8 relative">
            {/* CSS DONUT */}
            <div
              className="w-48 h-48 rounded-full shadow-[0_0_30px_rgba(0,0,0,0.5)] relative flex items-center justify-center transition-all duration-1000"
              style={{ background: conicGradient }}
            >
              <div className="w-32 h-32 bg-[#0a0a0a] rounded-full flex flex-col items-center justify-center z-10">
                <span className="text-3xl font-bold text-white">
                  {activeCount}
                </span>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* LATE PROJECT TICKER */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 overflow-hidden">
            <div className="flex items-center gap-2 mb-3 text-red-400 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle size={14} /> Attention Needed
            </div>
            <div className="h-32 overflow-y-auto custom-scrollbar space-y-2">
              {lateProjects.length === 0 ? (
                <div className="text-gray-500 text-[10px] italic">
                  No delays detected. Good job.
                </div>
              ) : (
                lateProjects.map((p) => (
                  <div
                    key={p["Project ID"]}
                    className="flex justify-between items-center text-[10px] border-b border-red-500/10 pb-2 mb-2 last:mb-0 last:pb-0 last:border-0"
                  >
                    <span className="text-white truncate max-w-[140px]">
                      {p["Title"]}
                    </span>
                    <span className="text-red-400 font-mono">
                      {new Date(p["Start Date"]).toLocaleDateString(undefined, {
                        month: "numeric",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;

// --- SUB-COMPONENTS ---

const StatCard = ({ icon: Icon, label, value, theme, onClick }) => {
  const themes = {
    blue: {
      border: "border-blue-500/20",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-400",
      labelColor: "text-gray-400",
    },
    gold: {
      border: "border-[#d4af37]/20",
      iconBg: "bg-[#d4af37]/10",
      iconColor: "text-[#d4af37]",
      labelColor: "text-gray-400",
    },
    red: {
      border: "border-red-500/30",
      iconBg: "bg-red-500/10",
      iconColor: "text-red-500",
      labelColor: "text-red-400",
    },
    green: {
      border: "border-green-500/20",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-400",
      labelColor: "text-gray-400",
    },
  };
  const t = themes[theme] || themes.blue;

  return (
    <div
      onClick={onClick}
      className={`bg-[#0a0a0a] border ${t.border} p-6 rounded-xl flex items-center gap-4 shadow-lg group hover:-translate-y-1 transition-all duration-300 cursor-pointer hover:bg-white/5`}
    >
      <div
        className={`p-3 rounded-full ${t.iconBg} ${t.iconColor} border ${t.border} group-hover:scale-110 transition-transform`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <div className="text-3xl font-bold text-white">{value}</div>
        <div
          className={`text-[10px] uppercase tracking-widest ${t.labelColor}`}
        >
          {label}
        </div>
      </div>
      <Filter className="w-4 h-4 text-gray-700 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

const PipelineBar = ({
  label,
  value,
  totalProjects,
  colorClass,
  textClass,
  onClick,
}) => {
  const pct = totalProjects > 0 ? (value / totalProjects) * 100 : 0;
  return (
    <div className="group cursor-pointer" onClick={onClick}>
      <div className="flex justify-between items-end mb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-white transition flex items-center gap-2">
          {label}{" "}
          <Filter
            size={10}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-[#d4af37]"
          />
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-gray-600">{pct.toFixed(1)}%</span>
          <span className={`text-sm font-bold ${textClass}`}>{value}</span>
        </div>
      </div>
      <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
        <div
          className={`h-full ${colorClass} transition-all duration-1000 ease-out shadow-lg relative group-hover:brightness-125`}
          style={{ width: `${pct}%` }}
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-white/30" />
        </div>
      </div>
    </div>
  );
};
