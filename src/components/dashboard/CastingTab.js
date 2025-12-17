import React, { useState } from "react";
import {
  Mic,
  Sparkles,
  Loader2,
  Users,
  Check,
  CalendarArrowUp,
  Info,
  User,
  Clock,
  Star,
} from "lucide-react";

// --- ATOMS ---
import Button from "../ui/Button";
import Badge from "../ui/Badge";

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
    // Simulating the heavy lifting of the AI matching process
    setTimeout(() => {
      const results = {};
      if (!roster || roster.length === 0) {
        setIsMatching(false);
        return;
      }
      roles.forEach((role) => {
        if (role && role["Role ID"]) {
          const matches = runCreativeMatch(role, roster);
          results[role["Role ID"]] = matches;
        }
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
          [otherType]: isActorInOtherSlot ? null : roleSel[otherType],
        },
      };
    });
  };

  // --- 3. CONFIRM HANDLER ---
  const handleConfirmCasting = () => {
    if (onConfirmSelections) {
      onConfirmSelections(selections);
    }
  };

  const hasSelections = Object.keys(selections).length > 0;

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* --- HEADER & ACTIONS --- */}
      <div className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-serif text-white flex items-center gap-3">
              <span className="bg-[#d4af37]/20 p-2 rounded-full border border-[#d4af37]/30">
                <Mic className="w-5 h-5 text-[#d4af37]" />
              </span>
              Casting Breakdown
            </h2>
            <p className="text-sm text-gray-400 mt-2 ml-1">
              Active Roster:{" "}
              <span className="text-white">{roster.length} Talent</span> • Roles
              to Cast: <span className="text-white">{roles.length}</span>
            </p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <Button
              onClick={handleRunMatchmaker}
              disabled={isMatching || roles.length === 0}
              variant="ghost"
              color="#d4af37"
              className="border border-[#d4af37]/30 hover:bg-[#d4af37]/10"
            >
              {isMatching ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                  Running AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {matchResults && Object.keys(matchResults).length > 0
                    ? "Re-Run Auto-Cast"
                    : "Run Auto-Cast"}
                </>
              )}
            </Button>

            <Button
              onClick={handleConfirmCasting}
              disabled={!hasSelections}
              variant={hasSelections ? "solid" : "glow"}
              color="#d4af37"
              className={hasSelections ? "animate-pulse-slow" : "opacity-50"}
            >
              <CalendarArrowUp className="w-4 h-4 mr-2" />
              Confirm & Schedule
            </Button>
          </div>
        </div>

        {/* DRAFT MODE WARNING */}
        {hasSelections && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-start gap-3 animate-fade-in">
            <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-200 leading-relaxed">
              <strong className="text-blue-100 uppercase tracking-wide text-xs">
                Draft Mode Active:
              </strong>{" "}
              Your selections are staged but <u>not yet locked</u>. The global
              save button will not capture these. Please click{" "}
              <strong className="text-[#d4af37]">Confirm & Schedule</strong>{" "}
              above to finalize the cast list.
            </div>
          </div>
        )}
      </div>

      {/* --- ROLES GRID --- */}
      {roles.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-xl bg-white/5">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-white font-serif text-xl mb-2">
            No Roles Detected
          </h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            It looks like this project has no character breakdown yet. Run the
            Intake Exploder to generate roles.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {roles.map((role, idx) => {
            if (!role || !role["Role ID"]) return null;

            const roleMatches = matchResults[role["Role ID"]] || [];
            const activeSel = selections[role["Role ID"]] || {
              primary: null,
              backup: null,
            };

            return (
              <div
                key={role["Role ID"] || idx}
                className={`bg-[#0a0a0a] border rounded-xl overflow-hidden flex flex-col transition-all duration-300 group hover:border-white/20 ${
                  activeSel.primary
                    ? "border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.1)]"
                    : "border-white/10"
                }`}
              >
                {/* ROLE HEADER */}
                <div className="p-5 bg-white/5 border-b border-white/5 relative">
                  <div className="flex justify-between items-start relative z-10">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2 font-serif">
                        {role["Character Name"]}
                        {activeSel.primary && (
                          <Check className="w-5 h-5 text-[#d4af37]" />
                        )}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge
                          icon={User}
                          label={role["Gender"]}
                          color="text-white/60"
                          bg="bg-white/5"
                          border="border-white/10"
                        />
                        <Badge
                          icon={Clock}
                          label={role["Age Range"]}
                          color="text-white/60"
                          bg="bg-white/5"
                          border="border-white/10"
                        />
                      </div>
                    </div>

                    {/* SELECTION SUMMARY PILLS */}
                    <div className="text-right space-y-2">
                      {activeSel.primary && (
                        <div className="inline-flex items-center px-2 py-1 rounded bg-[#d4af37]/20 border border-[#d4af37]/40">
                          <span className="text-[#d4af37] text-[10px] font-bold uppercase tracking-wider mr-2">
                            1st Pick
                          </span>
                          <span className="text-white text-xs font-bold">
                            {activeSel.primary.name}
                          </span>
                        </div>
                      )}
                      {activeSel.backup && (
                        <div className="flex justify-end">
                          <div className="inline-flex items-center px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20">
                            <span className="text-blue-400 text-[10px] font-bold uppercase tracking-wider mr-2">
                              Backup
                            </span>
                            <span className="text-white/80 text-xs">
                              {activeSel.backup.name}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-1 p-3 bg-black/20 rounded border border-white/5">
                    <p className="text-xs text-gray-400 italic line-clamp-2 leading-relaxed">
                      "
                      {role["Vocal Specs"] ||
                        "No specific vocal instructions provided."}
                      "
                    </p>
                  </div>
                </div>

                {/* MATCHES LIST */}
                <div className="flex-1 bg-black/40 p-2 min-h-[300px] max-h-[500px] overflow-y-auto custom-scrollbar">
                  {roleMatches.length > 0 ? (
                    <div className="space-y-1">
                      {/* List Header */}
                      <div className="px-3 py-2 flex items-center justify-between text-[10px] uppercase tracking-widest text-gray-600 font-bold">
                        <span>Candidate</span>
                        <span>Selection</span>
                      </div>

                      {roleMatches.map((match, i) => {
                        if (!match || !match.actor) return null;
                        const actor = match.actor;
                        const isPrimary = activeSel.primary?.id === actor.id;
                        const isBackup = activeSel.backup?.id === actor.id;

                        return (
                          <div
                            key={actor.id || i}
                            className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 group/item ${
                              isPrimary
                                ? "bg-[#d4af37]/10 border-[#d4af37]/40"
                                : isBackup
                                ? "bg-blue-900/20 border-blue-500/30"
                                : "bg-transparent border-transparent hover:bg-white/5 hover:border-white/10"
                            }`}
                          >
                            {/* ACTOR INFO */}
                            <div className="flex items-center gap-4">
                              {/* Score Bubble */}
                              <div
                                className={`w-10 h-10 rounded-full flex flex-col items-center justify-center border ${
                                  isPrimary
                                    ? "bg-[#d4af37] text-black border-[#d4af37]"
                                    : "bg-black text-gray-500 border-white/10 group-hover/item:border-white/30"
                                }`}
                              >
                                <span className="text-xs font-bold leading-none">
                                  {match.score}
                                </span>
                                <span className="text-[8px] uppercase leading-none opacity-80">
                                  %
                                </span>
                              </div>

                              <div>
                                <div
                                  className={`text-sm font-bold mb-0.5 ${
                                    isPrimary
                                      ? "text-[#d4af37]"
                                      : "text-gray-200"
                                  }`}
                                >
                                  {actor.name}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-wider">
                                  <span>{actor.gender}</span>
                                  {actor.sag === "SAG-AFTRA" && (
                                    <>
                                      <span className="w-1 h-1 rounded-full bg-gray-600" />
                                      <span className="text-yellow-600 font-bold">
                                        SAG
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* SELECTION BUTTONS (Using Base HTML buttons for specific styling needs here, or Custom Tiny Variants) */}
                            <div className="flex gap-2 opacity-40 group-hover/item:opacity-100 transition-opacity">
                              <button
                                onClick={() =>
                                  toggleSelection(
                                    role["Role ID"],
                                    actor,
                                    "primary"
                                  )
                                }
                                className={`h-8 px-3 rounded text-[10px] font-bold uppercase tracking-wider border transition-all ${
                                  isPrimary
                                    ? "bg-[#d4af37] text-black border-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.4)]"
                                    : "bg-transparent border-white/20 text-gray-400 hover:border-[#d4af37] hover:text-[#d4af37]"
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
                                className={`h-8 px-3 rounded text-[10px] font-bold uppercase tracking-wider border transition-all ${
                                  isBackup
                                    ? "bg-blue-600 text-white border-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]"
                                    : "bg-transparent border-white/20 text-gray-400 hover:border-blue-400 hover:text-blue-400"
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
                    <div className="h-full flex flex-col items-center justify-center text-gray-700 space-y-4 opacity-50 py-12">
                      <Sparkles className="w-12 h-12" />
                      <span className="text-xs uppercase tracking-widest font-bold">
                        Awaiting Auto-Cast
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
