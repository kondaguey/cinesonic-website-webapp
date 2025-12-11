import React from "react";
import { Calendar, CheckCircle, XCircle } from "lucide-react";

const ScheduleTab = ({ project, roles = [], roster = [], checkSchedule }) => {
  if (!project)
    return (
      <div className="p-8 text-gray-500 italic">
        Loading Project Schedule...
      </div>
    );
  const safeCheckSchedule = (name, start, end, rosterData) => {
    return checkSchedule
      ? checkSchedule(name, start, end, rosterData)
      : { status: "UNKNOWN", message: "Scheduler utility missing" };
  };
  const PROJECT_DURATION_DAYS = 5;
  const formatDate = (dateStr) => {
    if (!dateStr) return "TBD";
    const d = new Date(dateStr);
    return isNaN(d) ? dateStr : d.toLocaleDateString();
  };
  const dateOptions = [
    { label: "Option 1", date: project["Start Date"] },
    { label: "Option 2", date: project["Start Date 2"] },
    { label: "Option 3", date: project["Start Date 3"] },
  ].filter((opt) => opt.date);

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gold" /> Schedule Matrix
          </h3>
          <p className="text-gray-400 text-xs mt-1">
            Analyzing availability for Primary & Backup choices across all
            dates.
          </p>
        </div>
      </header>
      {dateOptions.length === 0 && (
        <div className="bg-white/5 border border-white/10 p-8 rounded text-center text-gray-500 italic">
          No start dates have been set for this project yet.
        </div>
      )}
      <div className="space-y-6">
        {dateOptions.map((opt, optIdx) => {
          const startDate = opt.date;
          const endDate = new Date(
            new Date(startDate).getTime() + PROJECT_DURATION_DAYS * 86400000
          ).toISOString();
          return (
            <div
              key={optIdx}
              className="bg-[#0A0A1F] border border-white/10 rounded-xl overflow-hidden shadow-lg"
            >
              <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-sm">
                    {optIdx + 1}
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                      {opt.label}
                    </div>
                    <div className="text-xl font-serif font-bold text-white">
                      {formatDate(opt.date)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-white/5">
                <div className="grid grid-cols-12 gap-4 p-3 bg-black/20 text-[9px] text-gray-500 uppercase tracking-widest font-bold">
                  <div className="col-span-3">Role</div>
                  <div className="col-span-4">Primary Selection</div>
                  <div className="col-span-1"></div>
                  <div className="col-span-4">Backup Selection</div>
                </div>
                {roles.map((role, rIdx) => {
                  const pKeys = [
                    "Talent A",
                    "Talent B",
                    "Talent C",
                    "Talent D",
                  ];
                  const bKeys = [
                    "Backup A",
                    "Backup B",
                    "Backup C",
                    "Backup D",
                  ];
                  if (rIdx >= pKeys.length) return null;
                  const primaryName = project[pKeys[rIdx]];
                  const backupName = project[bKeys[rIdx]];
                  const pSched = safeCheckSchedule(
                    primaryName,
                    startDate,
                    endDate,
                    roster
                  );
                  const bSched = safeCheckSchedule(
                    backupName,
                    startDate,
                    endDate,
                    roster
                  );
                  return (
                    <div
                      key={rIdx}
                      className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition"
                    >
                      <div className="col-span-3">
                        <div className="font-bold text-white text-sm">
                          {role["Character Name"]}
                        </div>
                        <div className="text-[10px] text-gray-500">
                          {role["Gender"]} • {role["Age Range"]}
                        </div>
                      </div>
                      <div className="col-span-4">
                        {primaryName ? (
                          <div
                            className={`p-2 rounded border flex items-start gap-2 ${
                              pSched.status === "CONFLICT"
                                ? "bg-red-500/10 border-red-500/30"
                                : "bg-green-500/10 border-green-500/30"
                            }`}
                          >
                            {pSched.status === "CONFLICT" ? (
                              <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                            ) : (
                              <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                            )}
                            <div>
                              <div className="text-xs font-bold text-white">
                                {primaryName}
                              </div>
                              <div
                                className={`text-[10px] font-bold ${
                                  pSched.status === "CONFLICT"
                                    ? "text-red-300"
                                    : "text-green-300"
                                }`}
                              >
                                {pSched.message}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-[10px] text-gray-600 italic py-2">
                            No Primary Selected
                          </div>
                        )}
                      </div>
                      <div className="col-span-1 flex justify-center opacity-20">
                        →
                      </div>
                      <div className="col-span-4">
                        {backupName ? (
                          <div
                            className={`p-2 rounded border flex items-start gap-2 ${
                              bSched.status === "CONFLICT"
                                ? "bg-red-500/10 border-red-500/30"
                                : "bg-blue-500/10 border-blue-500/30"
                            }`}
                          >
                            {bSched.status === "CONFLICT" ? (
                              <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                            ) : (
                              <CheckCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                            )}
                            <div>
                              <div className="text-xs font-bold text-white">
                                {backupName}
                              </div>
                              <div
                                className={`text-[10px] font-bold ${
                                  bSched.status === "CONFLICT"
                                    ? "text-red-300"
                                    : "text-blue-300"
                                }`}
                              >
                                {bSched.message}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-[10px] text-gray-600 italic py-2">
                            No Backup Selected
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default ScheduleTab;
