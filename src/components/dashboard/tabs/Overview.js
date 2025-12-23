import React from "react";
import {
  Activity,
  Calendar,
  CheckCircle,
  Users,
  FileSignature,
} from "lucide-react";

export default function OverviewTab({ project }) {
  const manifest = project.casting_manifest || [];
  const crew = project.crew_manifest || {};
  const status = project.production_status || "Pre-Production";
  const contracts = project["Contract Data"] || {};

  // Stats Calculation
  const castCount = manifest.length;
  const castSigned = manifest.filter(
    (r) => r.contract?.status === "Active"
  ).length;
  const crewCount = Object.keys(crew).length;
  const crewSigned = Object.values(crew).filter(
    (c) => c.status === "Active"
  ).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* HERO CARD */}
      <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-xl flex justify-between items-center bg-[url('/noise.png')]">
        <div>
          <h2 className="text-3xl font-serif text-white mb-2">
            {project.title}
          </h2>
          <div className="flex gap-3">
            <span className="px-3 py-1 bg-[#d4af37] text-black text-xs font-bold uppercase tracking-widest rounded">
              {status}
            </span>
            <span className="px-3 py-1 border border-white/20 text-gray-400 text-xs font-bold uppercase tracking-widest rounded">
              {project.project_ref_id}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">
            Start Date
          </div>
          <div className="text-xl font-mono text-[#d4af37]">
            {project.confirmed_start_date || "TBD"}
          </div>
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Cast Signed"
          value={`${castSigned}/${castCount}`}
          icon={Users}
          color={
            castSigned === castCount && castCount > 0
              ? "text-green-500"
              : "text-white"
          }
        />
        <StatCard
          label="Crew Signed"
          value={`${crewSigned}/${crewCount}`}
          icon={Users}
          color={
            crewSigned === crewCount && crewCount > 0
              ? "text-green-500"
              : "text-white"
          }
        />
        <StatCard
          label="Contracts"
          value={Object.keys(contracts).length}
          icon={FileSignature}
        />
        <StatCard label="Progress" value="Pending" icon={Activity} />
      </div>
    </div>
  );
}

const StatCard = ({ label, value, icon: Icon, color = "text-white" }) => (
  <div className="bg-[#0a0a0a] border border-white/10 p-4 rounded-xl flex items-center gap-4">
    <div className="p-3 bg-white/5 rounded-full text-gray-400">
      <Icon size={20} />
    </div>
    <div>
      <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
        {label}
      </div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
    </div>
  </div>
);
