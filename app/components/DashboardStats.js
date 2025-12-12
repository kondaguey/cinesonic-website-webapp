import React from "react";
import {
  BarChart,
  Activity,
  CheckCircle,
  Briefcase,
  AlertTriangle,
  Users,
} from "lucide-react";

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
  { id: "CASTING", label: "Casting", color: "bg-gold", text: "text-gold" },
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
      <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden border border-white/5">
        <div
          className={`h-full ${colorClass} transition-all duration-1000 ease-out shadow-lg relative`}
          style={{ width: `${pct}%` }}
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-white/30" />
        </div>
      </div>
    </div>
  );
};

const DashboardStats = ({ data, onNavigate }) => {
  const safeData = Array.isArray(data) ? data : [];
  const totalProjects = safeData.length;

  // 🟢 ROBUST MATH: Normalize Data Before Counting
  const counts = safeData.reduce((acc, p) => {
    // 1. Get Status
    let s = p["Status"];

    // 2. Clean it (String -> Uppercase -> Trim)
    // If empty/null, default to "NEW"
    s = s ? String(s).toUpperCase().trim() : "NEW";

    // 3. Count it
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  // Calculate Active Pipeline (Total - Done - Dead)
  const activeCount =
    totalProjects - (counts["COMPLETE"] || 0) - (counts["CANCELLED"] || 0);

  // Calculate Late (Robust Date Check)
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
      <div className="flex justify-end">
        <button
          onClick={() => onNavigate("roster")}
          className="flex items-center gap-2 px-5 py-2.5 bg-midnight border border-gold/20 hover:border-gold text-gray-400 hover:text-gold rounded-lg transition-all shadow-md group uppercase tracking-widest text-[10px] font-bold"
        >
          <Users className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Talent Manager
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* TOTAL */}
        <div className="bg-midnight border border-gold/20 p-6 rounded-xl flex items-center gap-4 shadow-lg">
          <div className="p-3 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="text-3xl font-bold text-white">{totalProjects}</div>
            <div className="text-[10px] uppercase tracking-widest text-gray-400">
              Total Database
            </div>
          </div>
        </div>

        {/* ACTIVE */}
        <div className="bg-midnight border border-gold/20 p-6 rounded-xl flex items-center gap-4 shadow-lg">
          <div className="p-3 rounded-full bg-gold/10 text-gold border border-gold/20">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="text-3xl font-bold text-white">{activeCount}</div>
            <div className="text-[10px] uppercase tracking-widest text-gray-400">
              Active Pipeline
            </div>
          </div>
        </div>

        {/* LATE */}
        <div className="bg-midnight border border-red-500/30 p-6 rounded-xl flex items-center gap-4 shadow-lg">
          <div className="p-3 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-3xl font-bold text-white">{lateCount}</div>
            <div className="text-[10px] uppercase tracking-widest text-red-400">
              Past Start Date
            </div>
          </div>
        </div>

        {/* DONE */}
        <div className="bg-midnight border border-gold/20 p-6 rounded-xl flex items-center gap-4 shadow-lg">
          <div className="p-3 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-3xl font-bold text-white">
              {counts["COMPLETE"] || 0}
            </div>
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
            <p className="text-xs text-gray-400 mb-8 leading-relaxed">
              Live breakdown of all project stages.
            </p>
            <div className="bg-gradient-to-br from-gold/10 to-transparent border border-gold p-6 rounded-xl">
              <div className="text-gold text-xs font-bold uppercase tracking-widest mb-1">
                Incoming Volume
              </div>
              <div className="text-5xl font-black text-white">
                {counts["NEW"] || 0}
              </div>
            </div>
          </div>
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
