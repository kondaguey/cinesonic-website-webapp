import React, { useState, useEffect } from "react";
import {
  Calendar,
  User,
  CheckCircle,
  RefreshCcw,
  PlayCircle,
  Clock,
  XCircle,
  Database,
  Check,
} from "lucide-react";

// Helper: Clean Date Display
const formatDate = (dateString) => {
  if (!dateString) return "No Date Set";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
};

export default function ScheduleHub({
  project,
  roles,
  roster,
  castingSelections,
  onSync,
}) {
  const [analysisRun, setAnalysisRun] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // 1. GET ALL 3 DATES
  const dates = [
    { label: "Option 1", val: project["Start Date"] },
    { label: "Option 2", val: project["Start Date 2"] },
    { label: "Option 3", val: project["Start Date 3"] },
  ];

  // Reset analysis (Re-enable the big button) if selections change
  useEffect(() => {
    setAnalysisRun(false);
  }, [project, castingSelections]);

  // --- LOGIC: INITIAL LOCAL CHECK ---
  const runLocalCheck = () => {
    setIsChecking(true);
    setTimeout(() => {
      setAnalysisRun(true);
      setIsChecking(false);
    }, 500);
  };

  // --- LOGIC: RE-RUN (SYNC & CHECK) ---
  const handleDeepSync = async () => {
    setIsChecking(true);
    if (onSync) {
      await onSync(false); // Silent Sync
      setLastSyncTime(new Date().toLocaleTimeString());
    }
    setAnalysisRun(true);
    setIsChecking(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* HEADER */}
      <div className="bg-white/5 p-6 rounded-xl border border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-serif text-gold flex items-center gap-2">
            <Calendar className="w-5 h-5" /> Scheduling Matrix
          </h2>
          <div className="flex flex-wrap gap-2 mt-2 text-xs">
            {dates.map((d, i) => (
              <div
                key={i}
                className={`px-3 py-1 rounded border ${
                  d.val
                    ? "bg-white/10 border-white/20 text-white"
                    : "bg-black/20 border-white/5 text-gray-500"
                }`}
              >
                <span className="text-gold font-bold uppercase mr-1">
                  {d.label}:
                </span>
                {d.val ? formatDate(d.val) : "None"}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-3">
            {/* BUTTON 1: THE RE-RUNNER (Database Sync) */}
            <button
              onClick={handleDeepSync}
              disabled={isChecking}
              className="group border border-gold/30 hover:bg-gold/10 text-gold p-3 rounded-lg transition-colors flex items-center justify-center shadow-lg relative disabled:opacity-50"
              title="Refresh Data & Re-Run"
            >
              {isChecking ? (
                <RefreshCcw className="w-4 h-4 animate-spin" />
              ) : (
                <Database className="w-4 h-4" />
              )}
            </button>

            {/* BUTTON 2: THE INITIAL RUNNER */}
            <button
              onClick={runLocalCheck}
              // Gray out if checking OR if already run
              disabled={isChecking || analysisRun}
              className={`font-bold px-6 py-3 rounded-lg uppercase tracking-widest text-xs flex items-center gap-2 shadow-lg transition-all ${
                analysisRun
                  ? "bg-white/5 text-gray-500 border border-white/5 cursor-default" // Grayed out state
                  : "bg-gold hover:bg-gold-light text-midnight shadow-gold/10 active:scale-95" // Active state
              }`}
            >
              {analysisRun ? (
                <>
                  <Check size={16} /> Matrix Active
                </>
              ) : (
                <>
                  <PlayCircle size={16} /> Run Schedule Matrix
                </>
              )}
            </button>
          </div>

          {/* SYNC FEEDBACK TEXT */}
          <div className="text-[10px] text-gray-500 h-4">
            {lastSyncTime ? (
              <span className="text-green-400 flex items-center gap-1 animate-fade-in">
                <CheckCircle size={10} /> Data Updated: {lastSyncTime}
              </span>
            ) : (
              <span>Using cached roster data</span>
            )}
          </div>
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
              <div className="w-full md:w-1/5">
                <h3 className="font-bold text-white text-sm">
                  {role["Character Name"]}
                </h3>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                  {role["Gender"]} • {role["Age Range"]}
                </div>
              </div>

              {/* SELECTION SLOTS */}
              <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                <ActorSlot
                  type="Primary"
                  selectedActor={selection.primary}
                  roster={roster}
                  dates={dates}
                  showResult={analysisRun}
                />
                <ActorSlot
                  type="Backup"
                  selectedActor={selection.backup}
                  roster={roster}
                  dates={dates}
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

// 🟢 SLOT: CHECKS ALL 3 DATES
function ActorSlot({ type, selectedActor, roster, dates, showResult }) {
  if (!selectedActor) {
    return (
      <div className="bg-white/5 border border-dashed border-white/10 rounded p-3 flex items-center justify-center gap-2 text-gray-600 h-24">
        <User size={16} />
        <span className="text-xs uppercase tracking-wide">
          No {type} Selected
        </span>
      </div>
    );
  }

  const liveActor =
    roster.find((r) => String(r.id) === String(selectedActor.id)) ||
    selectedActor;

  return (
    <div className="relative p-3 rounded border bg-white/5 border-white/10 flex gap-3 transition-colors">
      <div
        className={`absolute -top-2 -left-2 text-[9px] font-bold uppercase px-2 py-0.5 rounded shadow-sm ${
          type === "Primary"
            ? "bg-gold text-midnight"
            : "bg-blue-600 text-white"
        }`}
      >
        {type}
      </div>

      <div className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center text-sm font-bold text-gray-300 shrink-0">
        {(liveActor.name || "?").charAt(0)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold text-white truncate mb-2">
          {liveActor.name}
        </div>

        <div className="space-y-1">
          {dates.map((dateObj, i) => {
            if (!dateObj.val) return null;

            let result = { status: "PENDING", reason: "" };
            if (showResult) {
              result = checkSchedule(liveActor, dateObj.val);
            }

            let colorClass = "text-gray-500";
            let icon = <Clock size={10} />;

            if (showResult) {
              if (result.status === "CLEAR") {
                colorClass = "text-green-400";
                icon = <CheckCircle size={10} />;
              } else {
                colorClass = "text-red-400";
                icon = <XCircle size={10} />;
              }
            }

            return (
              <div
                key={i}
                className="flex justify-between items-center text-[10px] bg-black/20 px-2 py-1 rounded"
              >
                <span className="text-gray-400 font-bold w-16">
                  {dateObj.label}
                </span>
                <div className={`flex items-center gap-1 ${colorClass}`}>
                  {icon}
                  <span className="uppercase font-bold">
                    {showResult && result.status === "CLEAR"
                      ? "OPEN"
                      : result.reason || "PENDING"}
                  </span>
                </div>
              </div>
            );
          })}

          {!dates.some((d) => d.val) && (
            <div className="text-[10px] text-gray-500 italic">
              No dates set.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 🟢 SCHEDULE LOGIC
export function checkSchedule(actor, projectStartStr) {
  if (!actor) return { status: "NEUTRAL", reason: "Unassigned" };
  if (!projectStartStr) return { status: "UNKNOWN", reason: "No Date" };

  const projectStart = new Date(projectStartStr);
  const today = new Date();

  if (isNaN(projectStart.getTime()))
    return { status: "UNKNOWN", reason: "Invalid Date" };

  projectStart.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  // RULE 1: STATUS
  const status = (actor["status"] || "").toLowerCase().trim();
  if (status.includes("hiatus") || status.includes("inactive")) {
    return { status: "CONFLICT", reason: "On Hiatus" };
  }

  // RULE 2: NEXT AVAIL
  const nextAvailStr = actor["next_avail"];
  if (nextAvailStr) {
    const nextAvail = new Date(nextAvailStr);
    if (!isNaN(nextAvail.getTime())) {
      nextAvail.setHours(0, 0, 0, 0);
      if (projectStart < nextAvail) {
        return {
          status: "CONFLICT",
          reason: `Until ${nextAvail.toLocaleDateString(undefined, {
            month: "numeric",
            day: "numeric",
          })}`,
        };
      }
    }
  }

  // RULE 3: BOOKOUTS
  const bookoutsStr = actor["bookouts"];
  if (bookoutsStr) {
    const ranges = String(bookoutsStr).split(",");

    for (let range of ranges) {
      const parts = range.trim().split(/ to | - /i);
      if (parts.length === 2) {
        const bookStart = new Date(parts[0]);
        const bookEnd = new Date(parts[1]);

        if (!isNaN(bookStart.getTime()) && !isNaN(bookEnd.getTime())) {
          bookStart.setHours(0, 0, 0, 0);
          bookEnd.setHours(23, 59, 59, 999);
          if (projectStart >= bookStart && projectStart <= bookEnd) {
            const cleanStart = bookStart.toLocaleDateString(undefined, {
              month: "numeric",
              day: "numeric",
            });
            const cleanEnd = bookEnd.toLocaleDateString(undefined, {
              month: "numeric",
              day: "numeric",
            });
            return {
              status: "CONFLICT",
              reason: `Booked ${cleanStart}-${cleanEnd}`,
            };
          }
        }
      }
    }
  }

  return { status: "CLEAR", reason: "Available" };
}
