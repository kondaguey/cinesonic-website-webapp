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

// --- ATOMS ---
import Button from "../ui/Button";

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
      <div className="bg-white/5 p-6 rounded-xl border border-white/10 flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
        <div className="w-full md:w-auto">
          <h2 className="text-xl font-serif text-[#d4af37] flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5" /> Scheduling Matrix
          </h2>
          <div className="flex flex-wrap gap-2 text-xs">
            {dates.map((d, i) => (
              <div
                key={i}
                className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 ${
                  d.val
                    ? "bg-[#d4af37]/10 border-[#d4af37]/30 text-white"
                    : "bg-black/20 border-white/5 text-gray-500"
                }`}
              >
                <span className="text-[#d4af37] font-bold uppercase text-[10px] tracking-wider">
                  {d.label}
                </span>
                <span className="font-mono">
                  {d.val ? formatDate(d.val) : "None"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 w-full md:w-auto">
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            {/* 🟢 FIXED: Explicit Label & Fixed Size */}
            <Button
              onClick={handleDeepSync}
              disabled={isChecking}
              variant="ghost"
              color="#d4af37"
              className="!w-auto border border-[#d4af37]/30 hover:bg-[#d4af37]/10 text-xs px-4"
              title="Pull fresh data from Roster"
            >
              {isChecking ? (
                <RefreshCcw className="w-3 h-3 animate-spin mr-2" />
              ) : (
                <Database className="w-3 h-3 mr-2" />
              )}
              {isChecking ? "Syncing..." : "Sync Roster Data"}
            </Button>

            {/* BUTTON 2: THE INITIAL RUNNER */}
            <Button
              onClick={runLocalCheck}
              disabled={isChecking || analysisRun}
              variant={analysisRun ? "solid" : "glow"}
              color="#d4af37"
              className={`!w-auto min-w-[180px] ${
                analysisRun ? "opacity-50 cursor-default" : "animate-pulse-slow"
              }`}
            >
              {analysisRun ? (
                <>
                  <Check size={16} className="mr-2" /> Matrix Active
                </>
              ) : (
                <>
                  <PlayCircle size={16} className="mr-2" /> Run Schedule Matrix
                </>
              )}
            </Button>
          </div>

          {/* SYNC FEEDBACK TEXT */}
          <div className="text-[10px] text-gray-500 h-4 flex justify-end">
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
              className="bg-[#0a0a0a] border border-white/10 rounded-xl p-5 flex flex-col md:flex-row gap-6 items-start md:items-center hover:border-[#d4af37]/20 transition-colors"
            >
              {/* ROLE INFO */}
              <div className="w-full md:w-1/5 min-w-[180px]">
                <h3 className="font-bold text-white text-sm mb-1 font-serif">
                  {role["Character Name"]}
                </h3>
                <div className="flex gap-2">
                  <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded text-gray-300 uppercase tracking-wider">
                    {role["Gender"]}
                  </span>
                  <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded text-gray-300 uppercase tracking-wider">
                    {role["Age Range"]}
                  </span>
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
          <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-xl">
            <p className="text-gray-500 text-sm">
              No roles found for this project.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// 🟢 SLOT: CHECKS ALL 3 DATES
function ActorSlot({ type, selectedActor, roster, dates, showResult }) {
  if (!selectedActor) {
    return (
      <div className="bg-white/5 border border-dashed border-white/10 rounded-lg p-4 flex items-center justify-center gap-2 text-gray-600 h-28">
        <User size={16} />
        <span className="text-[10px] uppercase tracking-widest font-bold">
          No {type} Selected
        </span>
      </div>
    );
  }

  const liveActor =
    roster.find((r) => String(r.id) === String(selectedActor.id)) ||
    selectedActor;

  return (
    <div className="relative p-4 rounded-lg border bg-[#0c0442]/30 border-white/10 flex gap-4 transition-colors group hover:border-white/20">
      <div
        className={`absolute -top-2.5 -left-2 text-[9px] font-bold uppercase px-2 py-0.5 rounded shadow-lg tracking-widest ${
          type === "Primary"
            ? "bg-[#d4af37] text-black"
            : "bg-blue-600 text-white"
        }`}
      >
        {type}
      </div>

      <div className="w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-sm font-bold text-gray-300 shrink-0">
        {(liveActor.name || "?").charAt(0)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold text-white truncate mb-3">
          {liveActor.name}
        </div>

        <div className="space-y-1.5">
          {dates.map((dateObj, i) => {
            if (!dateObj.val) return null;

            let result = { status: "PENDING", reason: "" };
            if (showResult) {
              result = checkSchedule(liveActor, dateObj.val);
            }

            let colorClass = "text-gray-500";
            let bgClass = "bg-black/20";
            let icon = <Clock size={10} />;

            if (showResult) {
              if (result.status === "CLEAR") {
                colorClass = "text-green-400";
                bgClass = "bg-green-900/20";
                icon = <CheckCircle size={10} />;
              } else {
                colorClass = "text-red-400";
                bgClass = "bg-red-900/20";
                icon = <XCircle size={10} />;
              }
            }

            return (
              <div
                key={i}
                className={`flex justify-between items-center text-[10px] px-2 py-1.5 rounded transition-colors ${bgClass}`}
              >
                <span className="text-gray-400 font-bold w-16 uppercase tracking-wider text-[9px]">
                  {dateObj.label}
                </span>
                <div className={`flex items-center gap-1.5 ${colorClass}`}>
                  {icon}
                  <span className="uppercase font-bold tracking-wide">
                    {showResult && result.status === "CLEAR"
                      ? "OPEN"
                      : result.reason || "PENDING"}
                  </span>
                </div>
              </div>
            );
          })}

          {!dates.some((d) => d.val) && (
            <div className="text-[10px] text-gray-500 italic text-center py-2">
              No start dates set in project details.
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
