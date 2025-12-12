import React, { useState } from "react";
import {
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  RefreshCcw,
  PlayCircle,
  Clock,
} from "lucide-react";
import { checkSchedule } from "../utils/scheduler";

export default function ScheduleHub({
  project,
  roles,
  roster,
  castingSelections,
}) {
  const [analysisRun, setAnalysisRun] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const projectDate = project["Start Date"];

  const runAnalysis = () => {
    setIsChecking(true);
    // Fake delay to make it feel like it's calculating complex logic
    setTimeout(() => {
      setAnalysisRun(true);
      setIsChecking(false);
    }, 800);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* HEADER */}
      <div className="bg-white/5 p-6 rounded-xl border border-white/10 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-serif text-gold flex items-center gap-2">
            <Calendar className="w-5 h-5" /> Scheduling Matrix
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Target Start Date:{" "}
            <span className="text-white font-bold">{projectDate || "TBD"}</span>
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* LEGEND */}
          {analysisRun && (
            <div className="flex gap-2 animate-fade-in">
              <div className="flex items-center gap-1 text-[10px] text-gray-400 px-3 py-1 bg-black/20 rounded">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>{" "}
                Available
              </div>
              <div className="flex items-center gap-1 text-[10px] text-gray-400 px-3 py-1 bg-black/20 rounded">
                <div className="w-2 h-2 rounded-full bg-red-500"></div> Busy
              </div>
            </div>
          )}

          {/* ACTION BUTTON */}
          <button
            onClick={runAnalysis}
            disabled={isChecking}
            className="bg-gold hover:bg-gold-light text-midnight font-bold px-6 py-3 rounded-lg uppercase tracking-widest text-xs flex items-center gap-2 shadow-lg shadow-gold/10 transition-all disabled:opacity-50"
          >
            {isChecking ? (
              <RefreshCcw className="w-4 h-4 animate-spin" />
            ) : (
              <PlayCircle className="w-4 h-4" />
            )}
            {analysisRun ? "Refresh Analysis" : "Run Schedule Check"}
          </button>
        </div>
      </div>

      {/* MATRIX */}
      <div className="grid gap-4">
        {roles.map((role) => {
          const selection = castingSelections[role["Role ID"]] || {
            primary: null,
            backup: null,
          };

          return (
            <div
              key={role["Role ID"]}
              className="bg-black/40 border border-gold/10 rounded-lg p-4 flex flex-col md:flex-row gap-6 items-start md:items-center"
            >
              {/* ROLE INFO */}
              <div className="w-full md:w-1/4">
                <h3 className="font-bold text-white text-sm">
                  {role["Character Name"]}
                </h3>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                  {role["Gender"]} • {role["Age Range"]}
                </div>
              </div>

              {/* SELECTION SLOTS */}
              <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* PRIMARY SLOT */}
                <ActorSlot
                  type="Primary"
                  actor={selection.primary}
                  date={projectDate}
                  showResult={analysisRun}
                />

                {/* BACKUP SLOT */}
                <ActorSlot
                  type="Backup"
                  actor={selection.backup}
                  date={projectDate}
                  showResult={analysisRun}
                />
              </div>
            </div>
          );
        })}

        {roles.length === 0 && (
          <div className="text-center py-12 text-gray-500">No roles found.</div>
        )}
      </div>
    </div>
  );
}

// Sub-component for individual cards
function ActorSlot({ type, actor, date, showResult }) {
  if (!actor) {
    return (
      <div className="bg-white/5 border border-dashed border-white/10 rounded p-3 flex items-center justify-center gap-2 text-gray-600 h-20">
        <User size={16} />
        <span className="text-xs uppercase tracking-wide">
          No {type} Selected
        </span>
      </div>
    );
  }

  // Logic is only displayed if showResult is true
  let status = "pending";
  let reason = "";

  if (showResult) {
    const check = checkSchedule(actor, date);
    status = check.status;
    reason = check.reason;
  }

  const isPrimary = type === "Primary";

  return (
    <div
      className={`relative p-3 rounded border flex items-center gap-3 transition-colors ${
        isPrimary
          ? "bg-gold/10 border-gold/30"
          : "bg-blue-900/10 border-blue-500/20"
      }`}
    >
      {/* BADGE */}
      <div
        className={`absolute -top-2 -left-2 text-[9px] font-bold uppercase px-2 py-0.5 rounded shadow-sm ${
          isPrimary ? "bg-gold text-midnight" : "bg-blue-600 text-white"
        }`}
      >
        {type}
      </div>

      <div className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center text-sm font-bold text-gray-300">
        {actor.name.charAt(0)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold text-white truncate">
          {actor.name}
        </div>
        <div className="text-[10px] text-gray-400 truncate">{actor.email}</div>
      </div>

      {/* AVAILABILITY INDICATOR */}
      <div className="text-right">
        {!showResult ? (
          <div className="flex flex-col items-end text-gray-500">
            <Clock size={14} />
            <span className="text-[9px] uppercase font-bold mt-0.5">
              Pending
            </span>
          </div>
        ) : status === "available" ? (
          <div className="flex flex-col items-end text-green-400">
            <CheckCircle size={14} />
            <span className="text-[9px] uppercase font-bold mt-0.5">Open</span>
          </div>
        ) : status === "unknown" ? (
          <div className="flex flex-col items-end text-gray-500">
            <AlertCircle size={14} />
            <span className="text-[9px] uppercase font-bold mt-0.5">
              Unknown
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-end text-red-400">
            <AlertCircle size={14} />
            <span className="text-[9px] uppercase font-bold mt-0.5">Busy</span>
          </div>
        )}

        {/* REASON TEXT */}
        {showResult && status !== "available" && (
          <div className="text-[8px] text-red-300 opacity-80 mt-1 max-w-[80px] leading-tight">
            {reason}
          </div>
        )}
      </div>
    </div>
  );
}
