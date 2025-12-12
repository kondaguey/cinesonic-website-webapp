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
} from "lucide-react";

const ContractsTab = ({
  project,
  roles = [],
  updateField,
  roster = [], // 🟢 NEW PROP
  castingSelections = {}, // 🟢 NEW PROP
}) => {
  // State for the Roster Search Modal
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

  // --- HELPER: ASSIGN ACTOR (Fills Name & Email) ---
  const assignActor = (slotKey, actor) => {
    if (!actor) return;
    updateField(slotKey, actor.name);
    updateField(`${slotKey} Email`, actor.email || "");
    // Close search if open
    setSearchingRoleIndex(null);
    setSearchTerm("");
  };

  // --- RENDER: ROSTER SEARCH MODAL ---
  const renderSearchModal = () => {
    if (searchingRoleIndex === null) return null;

    const slotKey = `Talent ${String.fromCharCode(65 + searchingRoleIndex)}`; // Talent A, B, C...
    const filteredRoster = roster.filter((a) =>
      (a.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="absolute inset-0 z-20 bg-midnight/95 backdrop-blur-sm rounded-xl p-4 flex flex-col border border-gold/30">
        <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
          <h5 className="text-gold text-xs font-bold uppercase tracking-widest">
            Search Database for {slotKey}
          </h5>
          <button
            onClick={() => setSearchingRoleIndex(null)}
            className="text-gray-400 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            autoFocus
            type="text"
            className="w-full bg-black/40 border border-white/20 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-gold outline-none"
            placeholder="Type name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
          {filteredRoster.slice(0, 50).map((actor) => (
            <button
              key={actor.id}
              onClick={() => assignActor(slotKey, actor)}
              className="w-full text-left px-3 py-2 hover:bg-gold/20 hover:text-gold rounded transition flex justify-between group"
            >
              <span className="text-sm font-bold text-gray-300 group-hover:text-white">
                {actor.name}
              </span>
              <span className="text-[10px] text-gray-500 group-hover:text-gold/70">
                {actor.email}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <header>
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
          <FileSignature className="w-5 h-5 text-gold" /> Contracts &
          Assignments
        </h3>
        <p className="text-gray-400 text-xs mt-1">
          Assign names below. Use the buttons to quick-fill from Casting choices
          or the Database.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* --- LEFT COL: CREW --- */}
        <div className="space-y-4">
          <h4 className="text-gold text-xs font-bold uppercase tracking-widest border-b border-white/10 pb-2">
            Crew Assignments
          </h4>
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
                className="bg-white/5 p-4 rounded-lg border border-white/10 relative"
              >
                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2 block">
                  {field.label}
                </label>
                <div className="space-y-2 mb-3">
                  <div className="relative">
                    <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input
                      type="text"
                      className="w-full bg-black/40 border border-white/10 rounded pl-9 pr-3 py-2 text-sm text-white focus:border-gold outline-none disabled:opacity-50"
                      placeholder={`Assign Name...`}
                      value={project[field.key] || ""}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      disabled={isAccepted}
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input
                      type="email"
                      className={`w-full bg-black/40 border rounded pl-9 pr-8 py-1.5 text-xs focus:border-gold outline-none ${
                        isAccepted
                          ? "text-gray-500 border-white/5"
                          : "text-blue-300 border-white/10"
                      }`}
                      placeholder="Email Address..."
                      value={project[emailKey] || ""}
                      onChange={(e) => updateField(emailKey, e.target.value)}
                      disabled={isAccepted}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-50">
                      {isAccepted ? (
                        <Lock className="w-3 h-3 text-green-500" />
                      ) : (
                        <Edit2 className="w-3 h-3 text-gold" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateContract(field.key, true)}
                    className={`flex-1 py-1.5 rounded text-[10px] uppercase font-bold transition flex items-center justify-center gap-2 ${
                      isAccepted
                        ? "bg-green-500 text-midnight"
                        : "bg-white/10 text-gray-400 hover:bg-green-500/20 hover:text-green-400"
                    }`}
                  >
                    <CheckCircle className="w-3 h-3" />{" "}
                    {isAccepted ? "Accepted" : "Mark Accepted"}
                  </button>
                  {isAccepted && (
                    <button
                      onClick={() => updateContract(field.key, false)}
                      className="px-3 py-1.5 rounded text-[10px] uppercase font-bold bg-white/10 text-gray-400 hover:bg-red-500/20 hover:text-red-400"
                    >
                      Unlock
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* --- RIGHT COL: TALENT --- */}
        <div className="space-y-4">
          <h4 className="text-gold text-xs font-bold uppercase tracking-widest border-b border-white/10 pb-2">
            Talent Contracts
          </h4>
          {["Talent A", "Talent B", "Talent C", "Talent D"].map((key, i) => {
            if (i >= roles.length) return null;

            const role = roles[i];
            const roleId = role["Role ID"];
            const roleName = role["Character Name"];

            const actorName = project[key];
            const emailKey = key + " Email";
            const isAccepted = contractStatus[key] === true;

            // Get Quick Picks from Casting Tab Drafts
            const selections = castingSelections[roleId] || {};
            const primary = selections.primary;
            const backup = selections.backup;

            return (
              <div
                key={key}
                className="bg-white/5 p-4 rounded-lg border border-white/10 relative group"
              >
                {/* SEARCH OVERLAY (Only for this card) */}
                {searchingRoleIndex === i && renderSearchModal()}

                <div className="flex justify-between items-start mb-3">
                  <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                    {roleName}
                  </div>
                  {!isAccepted && (
                    <button
                      onClick={() => {
                        setSearchingRoleIndex(i);
                        setSearchTerm("");
                      }}
                      className="text-[9px] flex items-center gap-1 text-gold hover:text-white uppercase tracking-wider transition-colors border border-gold/30 hover:bg-gold/10 px-2 py-0.5 rounded"
                    >
                      <Search size={10} /> Search DB
                    </button>
                  )}
                </div>

                {/* 1. MANUAL ENTRY FIELDS */}
                <div className="space-y-2 mb-3">
                  <input
                    type="text"
                    className="w-full bg-black/40 border border-white/20 rounded px-3 py-2 text-lg font-serif font-bold text-white focus:border-gold outline-none disabled:opacity-50 placeholder:text-gray-600"
                    placeholder="Enter Actor Name..."
                    value={actorName || ""}
                    onChange={(e) => updateField(key, e.target.value)}
                    disabled={isAccepted}
                  />
                  <div className="relative">
                    <input
                      type="email"
                      className={`w-full bg-black/40 border rounded px-3 py-1.5 pr-8 text-xs focus:border-gold outline-none ${
                        isAccepted
                          ? "text-gray-500 border-white/5"
                          : "text-blue-300 border-white/10"
                      }`}
                      placeholder="Actor Email..."
                      value={project[emailKey] || ""}
                      onChange={(e) => updateField(emailKey, e.target.value)}
                      disabled={isAccepted}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-50">
                      {isAccepted ? (
                        <Lock className="w-3 h-3 text-green-500" />
                      ) : (
                        <Edit2 className="w-3 h-3 text-gold" />
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. QUICK ADD BUTTONS (From Casting Tab) */}
                {!isAccepted && (primary || backup) && (
                  <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                    {primary && (
                      <button
                        onClick={() => assignActor(key, primary)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-gold/10 hover:bg-gold text-gold hover:text-midnight border border-gold/30 text-[10px] font-bold uppercase transition-all shrink-0"
                      >
                        <Star size={10} fill="currentColor" />
                        Use 1st: {primary.name}
                      </button>
                    )}
                    {backup && (
                      <button
                        onClick={() => assignActor(key, backup)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-500/10 hover:bg-blue-500 text-blue-300 hover:text-white border border-blue-500/30 text-[10px] font-bold uppercase transition-all shrink-0"
                      >
                        Use 2nd: {backup.name}
                      </button>
                    )}
                  </div>
                )}

                {/* 3. STATUS ACTIONS */}
                <div className="flex gap-2 border-t border-white/5 pt-3">
                  <button
                    onClick={() => updateContract(key, true)}
                    disabled={!actorName}
                    className={`flex-1 py-2 rounded text-[10px] uppercase font-bold transition flex items-center justify-center gap-2 ${
                      isAccepted
                        ? "bg-green-500 text-midnight shadow-glow"
                        : actorName
                        ? "bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500 hover:text-midnight"
                        : "bg-gray-800 text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    <FileSignature className="w-3 h-3" />{" "}
                    {isAccepted ? "Accepted" : "Mark Accepted"}
                  </button>
                  {isAccepted && (
                    <button
                      onClick={() => updateContract(key, false)}
                      className="px-4 py-2 rounded text-[10px] uppercase font-bold bg-white/10 text-gray-400 hover:bg-red-500/20 hover:text-red-400"
                    >
                      Unlock
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default ContractsTab;
