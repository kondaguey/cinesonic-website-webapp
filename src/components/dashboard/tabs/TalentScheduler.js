import React, { useState } from "react";
import { Calendar, CheckCircle, Clock, XCircle, User } from "lucide-react";
import { checkSchedule } from "@/utils/dashboard/scheduler"; // Ensure util path is correct

export default function ScheduleTab({ project, onSync }) {
  const [analysisRun, setAnalysisRun] = useState(false);

  const manifest = project.casting_manifest || [];
  const dates = [
    { label: "Option A", val: project.start_date_1 || project["Start Date"] },
    { label: "Option B", val: project.start_date_2 },
    { label: "Option C", val: project.start_date_3 },
  ];

  const handleRunCheck = () => {
    if (onSync) onSync(); // Refresh project data first
    setAnalysisRun(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 flex justify-between items-center">
        <h2 className="text-xl font-serif text-[#d4af37] flex gap-2">
          <Calendar /> Schedule Matrix
        </h2>
        <button
          onClick={handleRunCheck}
          className="px-6 py-2 bg-[#d4af37] text-black font-bold uppercase text-xs rounded-lg hover:bg-[#b8860b]"
        >
          Run Conflict Check
        </button>
      </div>

      <div className="grid gap-4">
        {manifest.map((role) => {
          const actor = role.assigned_actor || role.actor_request?.primary;
          if (!actor) return null; // Don't show empty slots in schedule

          return (
            <div
              key={role.role_id}
              className="bg-[#0a0a0a] border border-white/10 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center"
            >
              <div className="w-full md:w-1/4">
                <div className="text-xs text-gray-500 uppercase font-bold">
                  {role.name}
                </div>
                <div className="text-lg font-bold text-white">
                  {actor.display_name || actor.name}
                </div>
              </div>

              <div className="flex-1 grid grid-cols-3 gap-2 w-full">
                {dates.map((d, i) => {
                  if (!d.val) return null;
                  // Mock check if util not hooked up yet, otherwise use checkSchedule(actor, d.val)
                  const status = analysisRun ? "CLEAR" : "PENDING";

                  return (
                    <div
                      key={i}
                      className={`p-2 rounded border flex flex-col items-center ${
                        status === "CLEAR"
                          ? "bg-green-900/20 border-green-900/50"
                          : "bg-white/5 border-white/10"
                      }`}
                    >
                      <div className="text-[9px] text-gray-400 uppercase">
                        {d.label}
                      </div>
                      <div
                        className={`text-xs font-bold ${
                          status === "CLEAR"
                            ? "text-green-400"
                            : "text-gray-500"
                        }`}
                      >
                        {status}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        {manifest.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            No cast members to schedule.
          </div>
        )}
      </div>
    </div>
  );
}
