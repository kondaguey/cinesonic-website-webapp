import React, { useState } from "react";
import {
  Mic,
  Sparkles,
  Loader2,
  Users,
  Check,
  CalendarArrowUp,
} from "lucide-react";

export default function CastingTab({
  project,
  roles,
  roster,
  updateField,
  matchResults,
  setMatchResults,
  runCreativeMatch,
  onConfirmSelections,
  initialSelections,
}) {
  const [isMatching, setIsMatching] = useState(false);
  const [selections, setSelections] = useState(initialSelections || {});

  // --- 1. THE MATCHMAKER ---
  const handleRunMatchmaker = () => {
    setIsMatching(true);
    setTimeout(() => {
      const results = {};
      if (!roster || roster.length === 0) {
        setIsMatching(false);
        return;
      }
      roles.forEach((role) => {
        const matches = runCreativeMatch(role, roster);
        results[role["Role ID"]] = matches;
      });
      setMatchResults(results);
      setIsMatching(false);
    }, 800);
  };

  // --- 2. SELECTION HANDLER ---
  const toggleSelection = (roleId, actor, type) => {
    setSelections((prev) => {
      const roleSel = prev[roleId] || { primary: null, backup: null };

      // If clicking the one already selected, toggle it OFF
      if (roleSel[type]?.id === actor.id) {
        return { ...prev, [roleId]: { ...roleSel, [type]: null } };
      }

      // If selecting Primary, ensure this actor isn't also Backup (and vice versa)
      const otherType = type === "primary" ? "backup" : "primary";
      const isActorInOtherSlot = roleSel[otherType]?.id === actor.id;

      return {
        ...prev,
        [roleId]: {
          ...roleSel,
          [type]: actor,
          [otherType]: isActorInOtherSlot ? null : roleSel[otherType], // Clear other slot if moving
        },
      };
    });
  };

  // --- 3. CONFIRM / MOVE TO SCHEDULE ---
  const handleConfirmCasting = () => {
    if (onConfirmSelections) {
      onConfirmSelections(selections);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* HEADER & ACTIONS */}
      <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
        <div>
          <h2 className="text-xl font-serif text-gold flex items-center gap-2">
            <Mic className="w-5 h-5" /> Casting Breakdown
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {roles.length} Roles • {roster.length} Talent Available
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleRunMatchmaker}
            disabled={isMatching || roles.length === 0}
            className="bg-black/40 border border-gold/30 hover:bg-gold/10 text-gold font-bold px-4 py-3 rounded-lg uppercase tracking-widest text-xs flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isMatching ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {matchResults && Object.keys(matchResults).length > 0
              ? "Re-Run Auto-Cast"
              : "Run Auto-Cast"}
          </button>

          <button
            onClick={handleConfirmCasting}
            disabled={Object.keys(selections).length === 0}
            className="bg-gold hover:bg-gold-light text-midnight font-bold px-6 py-3 rounded-lg uppercase tracking-widest text-xs flex items-center gap-2 shadow-lg shadow-gold/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CalendarArrowUp className="w-4 h-4" /> Confirm & Schedule
          </button>
        </div>
      </div>

      {/* ROLES GRID */}
      {roles.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-xl">
          <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-gray-400 font-bold uppercase tracking-widest">
            No Roles Found
          </h3>
          <p className="text-gray-600 text-sm mt-2">
            Run the intake Exploder first.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {roles.map((role) => {
            const roleMatches = matchResults[role["Role ID"]] || [];
            const activeSel = selections[role["Role ID"]] || {
              primary: null,
              backup: null,
            };

            return (
              <div
                key={role["Role ID"]}
                className={`bg-black/40 border rounded-xl overflow-hidden flex flex-col transition-all duration-300 ${
                  activeSel.primary
                    ? "border-gold shadow-[0_0_15px_rgba(212,175,55,0.15)]"
                    : "border-white/10"
                }`}
              >
                {/* ROLE HEADER */}
                <div className="p-4 bg-white/5 border-b border-white/5 relative overflow-hidden">
                  <div className="flex justify-between items-start relative z-10">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                        {role["Character Name"]}
                        {activeSel.primary && (
                          <Check className="w-4 h-4 text-gold" />
                        )}
                      </h3>
                      <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-wider text-gray-400">
                        <span className="bg-white/10 px-2 py-0.5 rounded">
                          {role["Gender"]}
                        </span>
                        <span className="bg-white/10 px-2 py-0.5 rounded">
                          {role["Age Range"]}
                        </span>
                      </div>
                    </div>
                    {/* SELECTION SUMMARY */}
                    <div className="text-right text-[10px] space-y-1">
                      {activeSel.primary && (
                        <div className="text-gold font-bold bg-gold/10 px-2 py-1 rounded border border-gold/20">
                          1st: {activeSel.primary.name}
                        </div>
                      )}
                      {activeSel.backup && (
                        <div className="text-blue-300 font-bold bg-blue-900/20 px-2 py-1 rounded border border-blue-500/20">
                          2nd: {activeSel.backup.name}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-300 italic line-clamp-2">
                    "{role["Vocal Specs"] || "No specs."}"
                  </div>
                </div>

                {/* MATCHES LIST */}
                <div className="flex-1 bg-black/20 p-4 min-h-[250px] max-h-[400px] overflow-y-auto custom-scrollbar">
                  {roleMatches.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-bold flex items-center gap-1">
                        <Sparkles size={10} className="text-gold" /> Suggested
                        Talent
                      </p>
                      {roleMatches.map((match, i) => {
                        if (!match || !match.actor) return null;
                        const actor = match.actor;
                        const isPrimary = activeSel.primary?.id === actor.id;
                        const isBackup = activeSel.backup?.id === actor.id;

                        return (
                          <div
                            key={actor.id || i}
                            className={`flex items-center justify-between p-2 rounded border transition-all group ${
                              isPrimary
                                ? "bg-gold/20 border-gold/50"
                                : isBackup
                                ? "bg-blue-900/20 border-blue-500/30"
                                : "bg-white/5 border-transparent hover:border-white/20 hover:bg-white/10"
                            }`}
                          >
                            {/* ACTOR INFO */}
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${
                                  isPrimary
                                    ? "bg-gold text-midnight border-gold"
                                    : "bg-white/10 text-gray-400 border-white/10"
                                }`}
                              >
                                {match.score}%
                              </div>
                              <div>
                                <div
                                  className={`text-sm font-bold ${
                                    isPrimary ? "text-gold" : "text-gray-200"
                                  }`}
                                >
                                  {actor.name}
                                </div>
                                <div className="text-[10px] text-gray-500 flex gap-1">
                                  <span>{actor.gender}</span>
                                  {actor.sag === "SAG-AFTRA" && (
                                    <span className="text-yellow-600 font-bold">
                                      • SAG
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* SELECTION BUTTONS */}
                            <div className="flex gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() =>
                                  toggleSelection(
                                    role["Role ID"],
                                    actor,
                                    "primary"
                                  )
                                }
                                className={`px-2 py-1 rounded text-[10px] font-bold uppercase border transition-colors ${
                                  isPrimary
                                    ? "bg-gold text-midnight border-gold shadow-glow"
                                    : "border-gray-600 text-gray-500 hover:border-gold hover:text-gold"
                                }`}
                              >
                                1st
                              </button>
                              <button
                                onClick={() =>
                                  toggleSelection(
                                    role["Role ID"],
                                    actor,
                                    "backup"
                                  )
                                }
                                className={`px-2 py-1 rounded text-[10px] font-bold uppercase border transition-colors ${
                                  isBackup
                                    ? "bg-blue-600 text-white border-blue-500 shadow-lg"
                                    : "border-gray-600 text-gray-500 hover:border-blue-400 hover:text-blue-400"
                                }`}
                              >
                                2nd
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-2 opacity-50">
                      <Users className="w-8 h-8" />
                      <span className="text-xs uppercase tracking-wide">
                        Run Auto-Cast to find talent
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
