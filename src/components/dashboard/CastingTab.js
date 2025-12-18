import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Mic,
  Sparkles,
  Loader2,
  CalendarArrowUp,
  Check,
  Plus,
  Trash2,
} from "lucide-react";
import Button from "../ui/Button";

// --- HARDCODED PALETTE ---
const COLORS = {
  GOLD: "#d4af37",
  PINK: "#ff3399",
  FIRE: "#ff4500",
  CYAN: "#00f0ff",
  VIOLET: "#7c3aed",
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function CastingTab({
  project,
  roles,
  roster,
  matchResults,
  setMatchResults,
  runCreativeMatch,
  onConfirmSelections,
  updateField,
}) {
  // 1. DETERMINE FORMAT & COLORS
  const rawFormat = (project?.["Format"] || "Solo").toLowerCase();
  let baseColor = COLORS.GOLD;
  if (rawFormat.includes("multi")) baseColor = COLORS.CYAN;
  else if (rawFormat.includes("duet")) baseColor = COLORS.FIRE;
  else if (rawFormat.includes("dual")) baseColor = COLORS.PINK;

  const isCinematic =
    rawFormat.includes("drama") || rawFormat.includes("cinematic");
  const activeColor = isCinematic ? COLORS.VIOLET : baseColor;

  // STATE
  const [isMatching, setIsMatching] = useState(false);
  const [localRoles, setLocalRoles] = useState(roles || []);
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [listOptions, setListOptions] = useState({ ages: [], voiceTypes: [] });

  // Ref to prevent double-firing auto-creation
  const processingRef = useRef(false);

  // 2. FETCH LISTS
  useEffect(() => {
    const fetchLists = async () => {
      const { data } = await supabase
        .from("lists_db")
        .select("age_range, voice_type");
      if (data) {
        setListOptions({
          ages: [...new Set(data.map((i) => i.age_range).filter(Boolean))],
          voiceTypes: [
            ...new Set(data.map((i) => i.voice_type).filter(Boolean)),
          ],
        });
      }
    };
    fetchLists();
  }, []);

  // 3. SYNC LOCAL STATE (Initial Load)
  useEffect(() => {
    // Unique filter to prevent duplicates
    const uniqueMap = new Map();
    (roles || []).forEach((r) => uniqueMap.set(r["Role ID"], r));
    setLocalRoles(Array.from(uniqueMap.values()));
  }, [roles]);

  // 🟢 4. INTELLIGENT AUTO-POPULATION
  useEffect(() => {
    const checkAndCreateSlots = async () => {
      if (processingRef.current) return;

      // A. Determine Target Counts
      let minRequired = 1; // Solo default
      if (rawFormat.includes("multi")) minRequired = 4; // Multi starts at 4
      else if (rawFormat.includes("dual") || rawFormat.includes("duet"))
        minRequired = 2; // Dual/Duet is 2

      // B. Check if we need to add slots
      if (localRoles.length < minRequired) {
        processingRef.current = true;
        setIsAddingRole(true);

        const needed = minRequired - localRoles.length;
        const newRoles = [];

        // C. Create Missing Slots in Loop
        try {
          for (let i = 0; i < needed; i++) {
            const newRoleId =
              "ROLE-" + Math.floor(10000 + Math.random() * 90000);
            const newRole = {
              project_id: project["Project ID"],
              role_id: newRoleId,
              role_name: `Character ${localRoles.length + i + 1}`, // Auto-label
              gender: "Any",
              age: "Any",
              vocal_specs: "Narration",
              status: "Open",
              assigned_actor: null,
            };

            // Fire and forget insert to speed up UI
            await supabase.from("casting_db").insert([newRole]);

            // Map for UI
            newRoles.push({
              "Project ID": newRole.project_id,
              "Role ID": newRole.role_id,
              "Character Name": newRole.role_name,
              Gender: newRole.gender,
              "Age Range": newRole.age,
              "Vocal Specs": newRole.vocal_specs,
              Status: newRole.status,
              "Assigned Actor": null,
            });
          }

          // Update State Once
          setLocalRoles((prev) => [...prev, ...newRoles]);
        } catch (e) {
          console.error("Auto-pop error", e);
        } finally {
          setIsAddingRole(false);
          processingRef.current = false;
        }
      }
    };

    if (project?.["Project ID"]) {
      checkAndCreateSlots();
    }
  }, [rawFormat, localRoles.length, project]);

  // 5. VIEW LOGIC (Slicing & Buttons)
  let maxSlots = 1;
  if (rawFormat.includes("multi")) maxSlots = 6;
  else if (rawFormat.includes("dual") || rawFormat.includes("duet"))
    maxSlots = 2;

  // Visual Slice (Never show more than allowed, even if DB has them)
  const visibleRoles = localRoles.slice(0, maxSlots);

  // Show Add Button ONLY for Multi and ONLY if under 6
  const showAddButton = rawFormat.includes("multi") && visibleRoles.length < 6;

  // 6. SELECTIONS STATE
  const getSavedSelections = () => {
    try {
      return project?.["Contract Data"]?.casting_selections || {};
    } catch (e) {
      return {};
    }
  };
  const [selections, setSelections] = useState(getSavedSelections());
  useEffect(() => {
    setSelections(getSavedSelections());
  }, [project]);

  // --- HANDLERS ---

  const handleRoleChange = (index, field, value) => {
    const updatedRoles = [...localRoles];
    if (updatedRoles[index]) {
      updatedRoles[index] = { ...updatedRoles[index], [field]: value };
      setLocalRoles(updatedRoles);
    }
  };

  const saveRoleToDB = async (roleId, field, value) => {
    if (!roleId) return;
    await supabase
      .from("casting_db")
      .update({ [field]: value })
      .eq("role_id", roleId);
  };

  // Manual Add (For Multi slot 5 & 6)
  const handleAddSlot = async () => {
    if (localRoles.length >= 6) return;
    setIsAddingRole(true);
    const newRoleId = "ROLE-" + Math.floor(10000 + Math.random() * 90000);
    const newRole = {
      project_id: project["Project ID"],
      role_id: newRoleId,
      role_name: "New Character",
      gender: "Any",
      age: "Any",
      vocal_specs: "Narration",
      status: "Open",
      assigned_actor: null,
    };
    try {
      await supabase.from("casting_db").insert([newRole]);
      const mappedRole = {
        "Project ID": newRole.project_id,
        "Role ID": newRole.role_id,
        "Character Name": newRole.role_name,
        Gender: newRole.gender,
        "Age Range": newRole.age,
        "Vocal Specs": newRole.vocal_specs,
        Status: newRole.status,
        "Assigned Actor": null,
      };
      setLocalRoles((prev) => [...prev, mappedRole]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAddingRole(false);
    }
  };

  const handleRunMatchmaker = () => {
    setIsMatching(true);
    setTimeout(() => {
      const results = {};
      if (roster && roster.length > 0) {
        visibleRoles.forEach((role) => {
          if (role && role["Role ID"])
            results[role["Role ID"]] = runCreativeMatch(role, roster);
        });
      }
      setMatchResults(results);
      setIsMatching(false);
    }, 800);
  };

  const toggleSelection = (roleId, actor, type) => {
    const newSelections = { ...selections };
    const roleSel = newSelections[roleId] || { primary: null, backup: null };
    if (roleSel[type]?.id === actor.id)
      newSelections[roleId] = { ...roleSel, [type]: null };
    else {
      const otherType = type === "primary" ? "backup" : "primary";
      const isActorInOtherSlot = roleSel[otherType]?.id === actor.id;
      newSelections[roleId] = {
        ...roleSel,
        [type]: actor,
        [otherType]: isActorInOtherSlot ? null : roleSel[otherType],
      };
    }
    setSelections(newSelections);
    if (updateField) {
      const currentContractData = project["Contract Data"] || {};
      updateField("Contract Data", {
        ...currentContractData,
        casting_selections: newSelections,
      });
    }
  };

  const hasSelections = Object.keys(selections).length > 0;

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* HEADER */}
      <div className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-serif text-white flex items-center gap-3">
              <span
                className="p-2 rounded-full border"
                style={{
                  backgroundColor: `${activeColor}20`,
                  borderColor: `${activeColor}30`,
                }}
              >
                <Mic className="w-5 h-5" style={{ color: activeColor }} />
              </span>
              Casting Breakdown
            </h2>
            <p className="text-sm text-gray-400 mt-2 ml-1">
              Format:{" "}
              <strong style={{ color: activeColor }}>
                {project["Format"]}
              </strong>{" "}
              • Slots:{" "}
              <span className="text-white">
                {visibleRoles.length} / {maxSlots}
              </span>
            </p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Button
              onClick={handleRunMatchmaker}
              disabled={isMatching || visibleRoles.length === 0}
              variant="ghost"
              color={activeColor}
              className="border hover:bg-white/5"
              style={{ borderColor: `${activeColor}50` }}
            >
              {isMatching ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 mr-2" /> AI
                  Running...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" /> Auto-Cast
                </>
              )}
            </Button>
            <Button
              onClick={() =>
                onConfirmSelections && onConfirmSelections(selections)
              }
              disabled={!hasSelections}
              variant={hasSelections ? "solid" : "ghost"}
              color={activeColor}
              className={hasSelections ? "animate-pulse-slow" : "opacity-50"}
            >
              <CalendarArrowUp className="w-4 h-4 mr-2" /> Confirm & Schedule
            </Button>
          </div>
        </div>
      </div>

      {visibleRoles.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-xl bg-white/5">
          <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
            {isAddingRole ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" /> Initializing
                Slots...
              </>
            ) : (
              "Loading Roles..."
            )}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {visibleRoles.map((role, idx) => {
            if (!role || !role["Role ID"]) return null;
            const roleMatches = matchResults[role["Role ID"]] || [];
            const activeSel = selections[role["Role ID"]] || {
              primary: null,
              backup: null,
            };

            return (
              <div
                key={role["Role ID"] || idx}
                className="bg-[#0a0a0a] border rounded-xl overflow-hidden flex flex-col transition-all"
                style={{
                  borderColor: activeSel.primary
                    ? activeColor
                    : "rgba(255,255,255,0.1)",
                  boxShadow: activeSel.primary
                    ? `0 0 20px ${activeColor}10`
                    : "none",
                }}
              >
                {/* CARD HEADER */}
                <div className="p-5 bg-white/5 border-b border-white/5 relative group/edit">
                  <div className="flex justify-between items-start mb-3">
                    <input
                      type="text"
                      value={role["Character Name"]}
                      onChange={(e) =>
                        handleRoleChange(idx, "Character Name", e.target.value)
                      }
                      onBlur={(e) =>
                        saveRoleToDB(
                          role["Role ID"],
                          "role_name",
                          e.target.value
                        )
                      }
                      className="text-xl font-bold text-white bg-transparent border-b border-transparent hover:border-white/20 focus:border-[#d4af37] outline-none w-full font-serif placeholder:text-gray-600"
                      placeholder={`Character ${idx + 1}`}
                    />
                    {activeSel.primary && (
                      <Check
                        className="w-5 h-5 shrink-0 ml-2"
                        style={{ color: activeColor }}
                      />
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <select
                      value={role["Gender"]}
                      onChange={(e) =>
                        handleRoleChange(idx, "Gender", e.target.value)
                      }
                      onBlur={(e) =>
                        saveRoleToDB(role["Role ID"], "gender", e.target.value)
                      }
                      className="text-[10px] uppercase font-bold text-gray-400 bg-black/40 border border-white/10 px-2 py-1 rounded outline-none focus:border-[#d4af37] cursor-pointer hover:bg-white/5"
                    >
                      <option value="Any">Any Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-Binary">Non-Binary</option>
                    </select>
                    <select
                      value={role["Age Range"]}
                      onChange={(e) =>
                        handleRoleChange(idx, "Age Range", e.target.value)
                      }
                      onBlur={(e) =>
                        saveRoleToDB(role["Role ID"], "age", e.target.value)
                      }
                      className="text-[10px] uppercase font-bold text-gray-400 bg-black/40 border border-white/10 px-2 py-1 rounded outline-none focus:border-[#d4af37] cursor-pointer hover:bg-white/5"
                    >
                      <option value="Any">Any Age</option>
                      {listOptions.ages.map((age) => (
                        <option key={age} value={age}>
                          {age}
                        </option>
                      ))}
                    </select>
                  </div>
                  <select
                    value={role["Vocal Specs"] || ""}
                    onChange={(e) =>
                      handleRoleChange(idx, "Vocal Specs", e.target.value)
                    }
                    onBlur={(e) =>
                      saveRoleToDB(
                        role["Role ID"],
                        "vocal_specs",
                        e.target.value
                      )
                    }
                    className="w-full text-xs text-gray-400 italic bg-black/40 border border-white/5 rounded-lg p-2 outline-none focus:border-[#d4af37] cursor-pointer hover:bg-white/5"
                  >
                    <option value="">Select Vocal Style / Type...</option>
                    {listOptions.voiceTypes.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>

                {/* MATCHES */}
                <div className="flex-1 bg-black/20 p-2 min-h-[300px] max-h-[500px] overflow-y-auto custom-scrollbar">
                  {roleMatches.length > 0 ? (
                    <div className="space-y-1">
                      {roleMatches.map((match) => {
                        const actor = match.actor;
                        const isPrimary = activeSel.primary?.id === actor.id;
                        const isBackup = activeSel.backup?.id === actor.id;
                        return (
                          <div
                            key={actor.id}
                            className={`flex items-center justify-between p-3 rounded-lg border transition-all group ${
                              isPrimary
                                ? "bg-[#d4af37]/10 border-[#d4af37]/30"
                                : isBackup
                                ? "bg-blue-500/10 border-blue-500/30"
                                : "border-transparent hover:bg-white/5"
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className="w-12 h-8 rounded-full flex items-center justify-center border text-[10px] font-bold shadow-lg"
                                style={{
                                  backgroundColor: isPrimary
                                    ? activeColor
                                    : "black",
                                  borderColor: isPrimary
                                    ? activeColor
                                    : "rgba(255,255,255,0.1)",
                                  color: isPrimary ? "black" : "gray",
                                }}
                              >
                                {match.score}%
                              </div>
                              <div className="flex flex-col">
                                <span
                                  className={`text-sm font-bold ${
                                    isPrimary ? "text-white" : "text-gray-300"
                                  }`}
                                >
                                  {actor.name}
                                </span>
                                {match.isRequested && (
                                  <span className="text-[9px] text-[#d4af37] uppercase font-bold tracking-wider">
                                    ★ Client Requested
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2 opacity-100 md:opacity-40 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() =>
                                  toggleSelection(
                                    role["Role ID"],
                                    actor,
                                    "primary"
                                  )
                                }
                                className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase border transition-all duration-200 ${
                                  isPrimary
                                    ? "bg-[#d4af37] text-black border-[#d4af37]"
                                    : "bg-transparent text-gray-500 border-white/10 hover:border-[#d4af37] hover:text-[#d4af37]"
                                }`}
                              >
                                First Choice
                              </button>
                              <button
                                onClick={() =>
                                  toggleSelection(
                                    role["Role ID"],
                                    actor,
                                    "backup"
                                  )
                                }
                                className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase border transition-all duration-200 ${
                                  isBackup
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-transparent text-gray-500 border-white/10 hover:border-blue-500 hover:text-blue-400"
                                }`}
                              >
                                Backup
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-700 space-y-4 py-12">
                      <Sparkles className="w-12 h-12 opacity-20" />
                      <span className="text-xs uppercase font-bold tracking-widest opacity-50">
                        Ready to Cast
                      </span>
                      <p className="text-[10px] text-gray-600 max-w-[200px] text-center">
                        Click "Auto-Cast" above to analyze the roster against
                        role specs.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* 🟢 ADD BUTTON (ONLY Multi, Limit 6) */}
          {showAddButton && (
            <button
              onClick={handleAddSlot}
              disabled={isAddingRole}
              className="border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-3 min-h-[400px] hover:border-[#00f0ff] hover:bg-[#00f0ff]/5 transition-all group"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                {isAddingRole ? (
                  <Loader2 className="animate-spin text-[#00f0ff]" />
                ) : (
                  <Plus
                    className="text-gray-500 group-hover:text-[#00f0ff]"
                    size={32}
                  />
                )}
              </div>
              <span className="text-gray-500 font-bold uppercase tracking-widest text-xs group-hover:text-[#00f0ff]">
                Add Character Slot
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
