import React from "react";
import { Play } from "lucide-react";

const CastingTab = ({
  project,
  roles = [],
  roster = [],
  updateField,
  matchResults = {},
  setMatchResults,
  runCreativeMatch,
}) => {
  if (!project)
    return <div className="p-4 text-gray-500">No project selected.</div>;
  const safeRoles = roles.filter((r) => r && r["Character Name"]);

  const handleRunMatch = (role, index) => {
    if (runCreativeMatch) {
      const results = runCreativeMatch(role, roster);
      setMatchResults((prev) => ({ ...prev, [index]: results }));
    }
  };

  const assignActor = (actorName, roleIndex, type = "primary") => {
    const primaryKeys = ["Talent A", "Talent B", "Talent C", "Talent D"];
    const backupKeys = ["Backup A", "Backup B", "Backup C", "Backup D"];
    if (roleIndex >= primaryKeys.length) return;
    const field =
      type === "primary" ? primaryKeys[roleIndex] : backupKeys[roleIndex];
    const emailField = field + " Email";
    const currentValue = project[field];

    if (currentValue === actorName) {
      updateField(field, "");
      updateField(emailField, "");
    } else {
      const actorData = roster.find((r) => r.name === actorName);
      const actorEmail = actorData ? actorData.email : "";
      updateField(field, actorName);
      updateField(emailField, actorEmail);
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {safeRoles.length === 0 && (
        <div className="text-gray-500 italic border border-white/10 p-8 rounded text-center">
          No roles found for this project.
        </div>
      )}
      {safeRoles.map((role, rIdx) => {
        const matches = matchResults[rIdx] || [];
        const keys = ["Talent A", "Talent B", "Talent C", "Talent D"];
        const backupKeys = ["Backup A", "Backup B", "Backup C", "Backup D"];
        if (rIdx >= keys.length) return null;
        const currentActor = project[keys[rIdx]];
        const currentBackup = project[backupKeys[rIdx]];

        return (
          <div
            key={rIdx}
            className="bg-black/20 border border-white/10 rounded-xl overflow-hidden shadow-lg hover:border-white/20 transition"
          >
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-white/5 to-transparent">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-lg">
                  {rIdx + 1}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-3">
                    {role["Character Name"]}
                  </h3>
                  <div className="text-xs text-gray-400 font-mono mt-0.5 flex gap-2">
                    <span className="bg-white/10 px-2 py-0.5 rounded">
                      {role["Gender"] || "Any"}
                    </span>
                    <span className="bg-white/10 px-2 py-0.5 rounded">
                      {role["Age Range"] || "Any"}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleRunMatch(role, rIdx)}
                className="bg-gold hover:bg-white text-midnight px-4 py-2 rounded font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition"
              >
                <Play className="w-3 h-3 fill-current" />
                {matches.length > 0 ? "Re-Run Match" : "Run Match"}
              </button>
            </div>
            <div className="p-6 bg-black/20">
              <div className="flex gap-8 mb-4 border-b border-white/5 pb-4">
                <div className="text-xs">
                  <span className="text-gray-500 uppercase tracking-widest text-[9px]">
                    Primary:
                  </span>
                  <div
                    className={`text-lg font-bold ${
                      currentActor ? "text-gold" : "text-gray-600"
                    }`}
                  >
                    {currentActor || "None"}
                  </div>
                </div>
                <div className="text-xs">
                  <span className="text-gray-500 uppercase tracking-widest text-[9px]">
                    Backup:
                  </span>
                  <div
                    className={`text-lg font-bold ${
                      currentBackup ? "text-blue-400" : "text-gray-600"
                    }`}
                  >
                    {currentBackup || "None"}
                  </div>
                </div>
              </div>
              {matches.length === 0 ? (
                <div className="text-center text-gray-600 text-xs italic py-8 border border-white/5 border-dashed rounded">
                  Click "Run Match" to scan the actor database.
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                  {[0, 1, 2, 3, 4].map((slotIdx) => {
                    const candidate = matches[slotIdx];
                    const isThisPrimary = currentActor === candidate?.name;
                    const isThisBackup = currentBackup === candidate?.name;
                    return (
                      <div
                        key={slotIdx}
                        className={`relative p-3 rounded border border-white/5 flex flex-col justify-between min-h-[120px] transition ${
                          candidate
                            ? "bg-white/5 hover:border-gold/30"
                            : "bg-transparent border-dashed border-white/10 opacity-50"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[9px] text-gold font-bold uppercase">
                            Choice {slotIdx + 1}
                          </span>
                          {candidate && (
                            <span className="text-[9px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded font-bold">
                              {candidate.score}%
                            </span>
                          )}
                        </div>
                        {candidate ? (
                          <div className="flex-1 mb-2">
                            <div className="font-bold text-sm text-white truncate">
                              {candidate.name}
                            </div>
                            <div className="text-[10px] text-gray-400">
                              {candidate.status || "Active"}
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1 flex items-center justify-center text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                            Empty
                          </div>
                        )}
                        {candidate && (
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() =>
                                assignActor(candidate.name, rIdx, "primary")
                              }
                              disabled={
                                isThisBackup || (currentActor && !isThisPrimary)
                              }
                              className={`w-full py-1 text-[9px] uppercase tracking-wider rounded border transition ${
                                isThisPrimary
                                  ? "bg-green-500 text-midnight border-green-500 font-bold"
                                  : "border-white/20 hover:bg-gold hover:text-midnight"
                              } ${
                                isThisBackup || (currentActor && !isThisPrimary)
                                  ? "opacity-20 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              {isThisPrimary ? "Selected" : "Primary"}
                            </button>
                            <button
                              onClick={() =>
                                assignActor(candidate.name, rIdx, "backup")
                              }
                              disabled={
                                isThisPrimary ||
                                (currentBackup && !isThisBackup)
                              }
                              className={`w-full py-1 text-[9px] uppercase tracking-wider rounded border transition ${
                                isThisBackup
                                  ? "bg-blue-500 text-white border-blue-500 font-bold"
                                  : "border-white/10 text-gray-400 hover:text-blue-300"
                              } ${
                                isThisPrimary ||
                                (currentBackup && !isThisBackup)
                                  ? "opacity-20 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              {isThisBackup ? "Selected" : "Backup"}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default CastingTab;
