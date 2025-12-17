import React, { useState } from "react";
import {
  FileSignature,
  CheckCircle,
  Lock,
  Edit2,
  Search,
  UserPlus,
  Mail,
  X,
  Star,
  User,
} from "lucide-react";

// --- ATOMS ---
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import SectionHeader from "../ui/SectionHeader";

const ContractsTab = ({
  project,
  roles = [],
  updateField,
  roster = [],
  castingSelections = {},
}) => {
  const [searchingRoleIndex, setSearchingRoleIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  if (!project)
    return <div className="p-8 text-gray-500 italic">Loading Contracts...</div>;

  // --- HELPER: GET CONTRACT STATUS ---
  const getContractStatus = () => {
    try {
      const val = project["Contract Data"];
      return typeof val === "object" ? val : JSON.parse(val || "{}");
    } catch (e) {
      return {};
    }
  };
  const contractStatus = getContractStatus();

  // --- HELPER: UPDATE CONTRACT STATUS (Lock/Unlock) ---
  const updateContract = (key, value) => {
    const newContracts = { ...contractStatus, [key]: value };
    updateField("Contract Data", newContracts);
  };

  // --- HELPER: ASSIGN ACTOR ---
  const assignActor = (slotKey, actor) => {
    if (!actor) return;
    updateField(slotKey, actor.name);
    updateField(`${slotKey} Email`, actor.email || "");
    setSearchingRoleIndex(null);
    setSearchTerm("");
  };

  // --- RENDER: ROSTER SEARCH MODAL ---
  const renderSearchModal = () => {
    if (searchingRoleIndex === null) return null;

    const slotKey = `Talent ${String.fromCharCode(65 + searchingRoleIndex)}`;
    const filteredRoster = roster.filter((a) =>
      (a.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="absolute inset-0 z-20 bg-[#0a0a0a]/95 backdrop-blur-md rounded-xl p-4 flex flex-col border border-[#d4af37] shadow-xl animate-fade-in">
        <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
          <h5 className="text-[#d4af37] text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <Search size={14} />
            Search Roster: {slotKey}
          </h5>
          <button
            onClick={() => setSearchingRoleIndex(null)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="relative mb-3">
          <input
            autoFocus
            type="text"
            className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-sm text-white focus:border-[#d4af37] outline-none placeholder:text-gray-600 transition-all"
            placeholder="Type name to filter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
          {filteredRoster.slice(0, 50).map((actor) => (
            <button
              key={actor.id}
              onClick={() => assignActor(slotKey, actor)}
              className="w-full text-left px-3 py-3 hover:bg-[#d4af37]/10 hover:border-[#d4af37]/30 border border-transparent rounded-lg transition-all flex justify-between group"
            >
              <span className="text-sm font-bold text-gray-300 group-hover:text-white">
                {actor.name}
              </span>
              <span className="text-[10px] text-gray-500 group-hover:text-[#d4af37]">
                {actor.email}
              </span>
            </button>
          ))}
          {filteredRoster.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-xs italic">
              No matching talent found.
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* HEADER */}
      <div className="bg-white/5 p-6 rounded-xl border border-white/10">
        <h2 className="text-2xl font-serif text-white flex items-center gap-3">
          <span className="bg-[#d4af37]/20 p-2 rounded-full border border-[#d4af37]/30">
            <FileSignature className="w-5 h-5 text-[#d4af37]" />
          </span>
          Contracts & Assignments
        </h2>
        <p className="text-sm text-gray-400 mt-2 ml-1">
          Manage crew assignments and lock in talent contracts. Accepted
          contracts lock the fields.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* --- LEFT COL: CREW --- */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/10 mb-4">
            <User className="text-[#d4af37]" size={16} />
            <h4 className="text-[#d4af37] text-xs font-bold uppercase tracking-widest">
              Crew Assignments
            </h4>
          </div>

          {[
            { label: "Production Coordinator", key: "Coordinator" },
            { label: "Script Prep", key: "Script Prep" },
            { label: "Engineer", key: "Engineer" },
            { label: "Proofer", key: "Proofer" },
          ].map((field) => {
            const isAccepted = contractStatus[field.key] === true;
            const emailKey = field.key + " Email";

            return (
              <div
                key={field.key}
                className={`p-5 rounded-xl border transition-all duration-300 ${
                  isAccepted
                    ? "bg-green-900/10 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.05)]"
                    : "bg-[#0a0a0a] border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold flex items-center gap-2">
                    {isAccepted && (
                      <CheckCircle size={12} className="text-green-500" />
                    )}
                    {field.label}
                  </label>
                  {isAccepted && (
                    <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">
                      Active
                    </span>
                  )}
                </div>

                <div className="space-y-3 mb-4">
                  <div className="relative group">
                    <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
                    <input
                      type="text"
                      className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-3 py-2.5 text-sm text-white focus:border-[#d4af37] outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      placeholder={`Assign Name...`}
                      value={project[field.key] || ""}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      disabled={isAccepted}
                    />
                  </div>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
                    <input
                      type="email"
                      className={`w-full bg-black/40 border rounded-lg pl-10 pr-8 py-2 text-xs focus:border-[#d4af37] outline-none disabled:opacity-50 transition-all ${
                        isAccepted
                          ? "text-gray-500 border-white/5"
                          : "text-blue-300 border-white/10"
                      }`}
                      placeholder="Email Address..."
                      value={project[emailKey] || ""}
                      onChange={(e) => updateField(emailKey, e.target.value)}
                      disabled={isAccepted}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {isAccepted ? (
                        <Lock className="w-3 h-3 text-green-500" />
                      ) : (
                        <Edit2 className="w-3 h-3 text-[#d4af37] opacity-50" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => updateContract(field.key, true)}
                    disabled={!project[field.key] || isAccepted}
                    variant={isAccepted ? "solid" : "glow"}
                    color="#22c55e" // Green
                    className={`flex-1 py-2 text-[10px] h-8 ${
                      isAccepted
                        ? "bg-green-600 text-white border-green-600 hover:bg-green-600 cursor-default"
                        : ""
                    }`}
                  >
                    {isAccepted ? "Accepted" : "Mark Accepted"}
                  </Button>

                  {isAccepted && (
                    <Button
                      onClick={() => updateContract(field.key, false)}
                      variant="ghost"
                      color="#ef4444" // Red
                      className="h-8 px-3 text-[10px]"
                    >
                      Unlock
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* --- RIGHT COL: TALENT --- */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/10 mb-4">
            <Star className="text-[#d4af37]" size={16} />
            <h4 className="text-[#d4af37] text-xs font-bold uppercase tracking-widest">
              Talent Contracts
            </h4>
          </div>

          {["Talent A", "Talent B", "Talent C", "Talent D"].map((key, i) => {
            if (i >= roles.length) return null;

            const role = roles[i];
            const roleId = role["Role ID"];
            const roleName = role["Character Name"];

            const actorName = project[key];
            const emailKey = key + " Email";
            const isAccepted = contractStatus[key] === true;

            const selections = castingSelections[roleId] || {};
            const primary = selections.primary;
            const backup = selections.backup;

            return (
              <div
                key={key}
                className={`p-5 rounded-xl border relative transition-all duration-300 ${
                  isAccepted
                    ? "bg-green-900/10 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.05)]"
                    : "bg-[#0a0a0a] border-white/10 hover:border-white/20"
                }`}
              >
                {/* SEARCH OVERLAY */}
                {searchingRoleIndex === i && renderSearchModal()}

                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 font-mono mb-1">
                      {key}
                    </span>
                    <span className="text-sm font-bold text-white uppercase tracking-wide">
                      {roleName}
                    </span>
                  </div>
                  {!isAccepted && (
                    <Button
                      onClick={() => {
                        setSearchingRoleIndex(i);
                        setSearchTerm("");
                      }}
                      variant="ghost"
                      color="#d4af37"
                      className="h-7 px-3 text-[10px] border border-[#d4af37]/30 hover:bg-[#d4af37]/10"
                    >
                      <Search size={10} className="mr-1.5" /> Search DB
                    </Button>
                  )}
                </div>

                {/* 1. MANUAL ENTRY FIELDS */}
                <div className="space-y-3 mb-4">
                  <input
                    type="text"
                    className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-lg font-serif font-bold text-white focus:border-[#d4af37] outline-none disabled:opacity-50 placeholder:text-gray-600 transition-all"
                    placeholder="Enter Actor Name..."
                    value={actorName || ""}
                    onChange={(e) => updateField(key, e.target.value)}
                    disabled={isAccepted}
                  />

                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-600 group-hover:text-gray-400 transition-colors" />
                    <input
                      type="email"
                      className={`w-full bg-black/40 border rounded-lg pl-9 pr-8 py-2 text-xs focus:border-[#d4af37] outline-none transition-all ${
                        isAccepted
                          ? "text-gray-500 border-white/5"
                          : "text-blue-300 border-white/10"
                      }`}
                      placeholder="Actor Email..."
                      value={project[emailKey] || ""}
                      onChange={(e) => updateField(emailKey, e.target.value)}
                      disabled={isAccepted}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {isAccepted ? (
                        <Lock className="w-3 h-3 text-green-500" />
                      ) : (
                        <Edit2 className="w-3 h-3 text-[#d4af37] opacity-50" />
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. QUICK ADD BUTTONS */}
                {!isAccepted && (primary || backup) && (
                  <div className="flex gap-3 mb-5 overflow-x-auto pb-2 border-b border-white/5">
                    {primary && (
                      <button
                        onClick={() => assignActor(key, primary)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#d4af37]/10 hover:bg-[#d4af37] text-[#d4af37] hover:text-black border border-[#d4af37]/30 text-[10px] font-bold uppercase transition-all shrink-0 group/btn"
                      >
                        <Star
                          size={10}
                          className="group-hover/btn:fill-black"
                        />
                        Use 1st: {primary.name}
                      </button>
                    )}
                    {backup && (
                      <button
                        onClick={() => assignActor(key, backup)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded bg-blue-500/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 text-[10px] font-bold uppercase transition-all shrink-0"
                      >
                        Use 2nd: {backup.name}
                      </button>
                    )}
                  </div>
                )}

                {/* 3. STATUS ACTIONS */}
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => updateContract(key, true)}
                    disabled={!actorName || isAccepted}
                    variant={isAccepted ? "solid" : "glow"}
                    color="#22c55e"
                    className={`flex-1 py-2 text-[10px] h-9 ${
                      isAccepted
                        ? "bg-green-600 text-white border-green-600 hover:bg-green-600 cursor-default"
                        : ""
                    }`}
                  >
                    <FileSignature className="w-3 h-3 mr-2" />
                    {isAccepted ? "Contract Active" : "Mark Accepted"}
                  </Button>

                  {isAccepted && (
                    <Button
                      onClick={() => updateContract(key, false)}
                      variant="ghost"
                      color="#ef4444"
                      className="h-9 px-4 text-[10px]"
                    >
                      Unlock
                    </Button>
                  )}
                </div>
              </div>
            );
          })}

          {roles.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-xl bg-white/5">
              <p className="text-gray-500 text-sm">No roles found to cast.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ContractsTab;
