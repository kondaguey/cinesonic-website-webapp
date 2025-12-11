import React from "react";
import { FileSignature, CheckCircle, Lock, Edit2 } from "lucide-react";

const ContractsTab = ({ project, roles = [], updateField }) => {
  if (!project)
    return <div className="p-8 text-gray-500 italic">Loading Contracts...</div>;

  const getContractStatus = () => {
    try {
      const val = project["Contract Data"];
      return typeof val === "object" ? val : JSON.parse(val || "{}");
    } catch (e) {
      return {};
    }
  };
  const contractStatus = getContractStatus();

  const updateContract = (key, value) => {
    const newContracts = { ...contractStatus, [key]: value };
    updateField("Contract Data", newContracts);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <header>
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
          <FileSignature className="w-5 h-5 text-gold" /> Contracts &
          Assignments
        </h3>
        <p className="text-gray-400 text-xs mt-1">
          Assign names and emails below. Lock them to confirm participation.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                className="bg-white/5 p-4 rounded-lg border border-white/10"
              >
                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2 block">
                  {field.label}
                </label>
                <div className="space-y-2 mb-3">
                  <input
                    type="text"
                    className="w-full bg-black/40 border border-white/20 rounded px-3 py-2 text-sm text-white focus:border-gold outline-none disabled:opacity-50"
                    placeholder={`Assign Name...`}
                    value={project[field.key] || ""}
                    onChange={(e) => updateField(field.key, e.target.value)}
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
                      placeholder={`Email Address for ${field.label}...`}
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
        <div className="space-y-4">
          <h4 className="text-gold text-xs font-bold uppercase tracking-widest border-b border-white/10 pb-2">
            Talent Contracts
          </h4>
          {["Talent A", "Talent B", "Talent C", "Talent D"].map((key, i) => {
            if (i >= roles.length) return null;
            const roleName = roles[i]
              ? roles[i]["Character Name"]
              : `Role ${i + 1}`;
            const actorName = project[key];
            const emailKey = key + " Email";
            const isAccepted = contractStatus[key] === true;
            return (
              <div
                key={key}
                className="bg-white/5 p-4 rounded-lg border border-white/10"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="w-full">
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                      {roleName}
                    </div>
                    <div
                      className={`text-lg font-serif font-bold ${
                        actorName ? "text-white" : "text-gray-600 italic"
                      }`}
                    >
                      {actorName || "Unassigned"}
                    </div>
                    {actorName && (
                      <div className="relative mt-2">
                        <input
                          type="email"
                          className={`w-full bg-black/40 border rounded px-3 py-1.5 pr-8 text-xs focus:border-gold outline-none ${
                            isAccepted
                              ? "text-gray-500 border-white/5"
                              : "text-blue-300 border-white/10"
                          }`}
                          placeholder="Actor Email..."
                          value={project[emailKey] || ""}
                          onChange={(e) =>
                            updateField(emailKey, e.target.value)
                          }
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
                    )}
                  </div>
                </div>
                {actorName ? (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => updateContract(key, true)}
                      className={`flex-1 py-2 rounded text-[10px] uppercase font-bold transition flex items-center justify-center gap-2 ${
                        isAccepted
                          ? "bg-green-500 text-midnight shadow-glow"
                          : "bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500 hover:text-midnight"
                      }`}
                    >
                      <FileSignature className="w-3 h-3" />{" "}
                      {isAccepted ? "Proposal Accepted" : "Accept Proposal"}
                    </button>
                    <button
                      onClick={() => updateContract(key, false)}
                      className="px-4 py-2 rounded text-[10px] uppercase font-bold bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white"
                    >
                      Decline
                    </button>
                  </div>
                ) : (
                  <div className="text-[10px] text-gray-500 border-t border-white/5 pt-2 mt-2">
                    Select a Primary Actor in the Casting Tab first.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default ContractsTab;
