import React, { useState } from "react";
import {
  BarChart,
  Activity,
  CheckCircle,
  Briefcase,
  AlertTriangle,
  Users,
  RefreshCw,
} from "lucide-react";

// --- ATOMS ---
import Button from "../ui/Button";

// CONFIG
const STATUS_CONFIG = [
  {
    id: "NEW",
    label: "New / Incoming",
    color: "bg-purple-500",
    text: "text-purple-400",
  },
  {
    id: "NEGOTIATING",
    label: "Negotiating",
    color: "bg-pink-500",
    text: "text-pink-400",
  },
  {
    id: "CASTING",
    label: "Casting",
    color: "bg-[#d4af37]",
    text: "text-[#d4af37]",
  },
  {
    id: "PRE-PRODUCTION",
    label: "Pre-Production",
    color: "bg-blue-500",
    text: "text-blue-400",
  },
  {
    id: "IN PRODUCTION",
    label: "In Production",
    color: "bg-indigo-500",
    text: "text-indigo-400",
  },
  {
    id: "POST-PRODUCTION",
    label: "Post-Production",
    color: "bg-cyan-500",
    text: "text-cyan-400",
  },
  {
    id: "COMPLETE",
    label: "Complete",
    color: "bg-green-500",
    text: "text-green-400",
  },
  {
    id: "CANCELLED",
    label: "Cancelled",
    color: "bg-red-500",
    text: "text-red-500",
  },
];

const DashboardStats = ({ data, onNavigate, onSync }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const safeData = Array.isArray(data) ? data : [];
  const totalProjects = safeData.length;

  // 🟢 HANDLE SYNC
  const handleSync = async () => {
    setIsSyncing(true);
    if (onSync) await onSync();
    setTimeout(() => setIsSyncing(false), 1000);
  };

  // ROBUST MATH
  const counts = safeData.reduce((acc, p) => {
    let s = p["Status"];
    s = s ? String(s).toUpperCase().trim() : "NEW";
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const activeCount =
    totalProjects - (counts["COMPLETE"] || 0) - (counts["CANCELLED"] || 0);

  const lateCount = safeData.filter((p) => {
    const s = String(p["Status"] || "").toUpperCase();
    if (!p["Start Date"] || s.includes("COMPLETE") || s.includes("CANCELLED"))
      return false;
    const delivery = new Date(p["Start Date"]);
    const today = new Date();
    if (isNaN(delivery.getTime())) return false;
    delivery.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return delivery < today;
  }).length;

  return (
    <div className="space-y-6 animate-fade-in-down">
      {/* HEADER ROW */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-serif text-white">Crew Overview</h1>
          <p className="text-xs text-gray-400 mt-1">
            Welcome back. Here is the active studio status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* LIVE SYSTEM PILL */}
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

            {/* SYNC BUTTON */}
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

          {/* TALENT MANAGER BUTTON */}
          <Button
            onClick={() => onNavigate("roster")}
            variant="glow"
            color="#d4af37"
            className="!w-auto min-w-0 px-6 whitespace-nowrap"
          >
            <Users className="w-4 h-4 mr-2" />
            Talent Manager
          </Button>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Briefcase}
          label="Total Database"
          value={totalProjects}
          theme="blue"
        />
        <StatCard
          icon={Activity}
          label="Active Pipeline"
          value={activeCount}
          theme="gold"
        />
        <StatCard
          icon={AlertTriangle}
          label="Past Start Date"
          value={lateCount}
          theme="red"
        />
        <StatCard
          icon={CheckCircle}
          label="Completed"
          value={counts["COMPLETE"] || 0}
          theme="green"
        />
      </div>

      {/* MAIN PIPELINE CHART */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <BarChart className="absolute -right-12 -bottom-12 text-[#d4af37] opacity-5 w-80 h-80 rotate-12 pointer-events-none" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Summary Column */}
          <div className="lg:col-span-4 flex flex-col justify-center">
            <h3 className="text-3xl font-serif font-bold text-white mb-2">
              Studio Pipeline
            </h3>
            <p className="text-xs text-gray-400 mb-8 leading-relaxed">
              Live breakdown of all project stages.
            </p>
            <div className="bg-[#d4af37]/5 border border-[#d4af37] p-6 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <Activity className="text-[#d4af37]" size={48} />
              </div>
              <div className="relative z-10">
                <div className="text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-1">
                  Incoming Volume
                </div>
                <div className="text-5xl font-black text-white">
                  {counts["NEW"] || 0}
                </div>
              </div>
            </div>
          </div>

          {/* Bars Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 content-center">
            {STATUS_CONFIG.map((status) => (
              <PipelineBar
                key={status.id}
                label={status.label}
                value={counts[status.id] || 0}
                totalProjects={totalProjects}
                colorClass={status.color}
                textClass={status.text}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;

// --- SUB-COMPONENTS ---

const StatCard = ({ icon: Icon, label, value, theme }) => {
  const themes = {
    blue: {
      border: "border-blue-500/20",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-400",
      iconBorder: "border-blue-500/20",
      labelColor: "text-gray-400",
    },
    gold: {
      border: "border-[#d4af37]/20",
      iconBg: "bg-[#d4af37]/10",
      iconColor: "text-[#d4af37]",
      iconBorder: "border-[#d4af37]/20",
      labelColor: "text-gray-400",
    },
    red: {
      border: "border-red-500/30",
      iconBg: "bg-red-500/10",
      iconColor: "text-red-500",
      iconBorder: "border-red-500/20",
      labelColor: "text-red-400",
    },
    green: {
      border: "border-green-500/20",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-400",
      iconBorder: "border-green-500/20",
      labelColor: "text-gray-400",
    },
  };
  const t = themes[theme] || themes.blue;
  return (
    <div
      className={`bg-[#0a0a0a] border ${t.border} p-6 rounded-xl flex items-center gap-4 shadow-lg group hover:-translate-y-1 transition-transform duration-300`}
    >
      <div
        className={`p-3 rounded-full ${t.iconBg} ${t.iconColor} border ${t.iconBorder} group-hover:scale-110 transition-transform`}
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
    </div>
  );
};

const PipelineBar = ({
  label,
  value,
  totalProjects,
  colorClass,
  textClass,
}) => {
  const pct = totalProjects > 0 ? (value / totalProjects) * 100 : 0;
  return (
    <div className="group">
      <div className="flex justify-between items-end mb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-white transition">
          {label}
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
