import React from "react";
import { LayoutDashboard, Check, Lock, Mail } from "lucide-react";

const PROGRESS_STEPS = [
  "Cast and Crew Confirmed",
  "Pre-production",
  "Recording",
  "CRX",
  "Post Production",
  "Complete",
  "Awaiting Payment",
  "Paid",
];

const ProductionHub = ({ project, updateField }) => {
  if (!project) return null;
  const getContractStatus = () => {
    try {
      const val = project["Contract Data"];
      return typeof val === "object" ? val : JSON.parse(val || "{}");
    } catch (e) {
      return {};
    }
  };
  const contractStatus = getContractStatus();
  const currentProductionStep =
    contractStatus.production_step || PROGRESS_STEPS[0];
  const setProductionStep = (step) => {
    const newContracts = { ...contractStatus, production_step: step };
    updateField("Contract Data", newContracts);
  };

  const handleEmailTeam = () => {
    let emails = [];
    [
      "Coordinator",
      "Script Prep",
      "Engineer",
      "Proofer",
      "Talent A",
      "Talent B",
      "Talent C",
      "Talent D",
    ].forEach((k) => {
      if (contractStatus[k] === true && project[`${k} Email`])
        emails.push(project[`${k} Email`]);
    });
    if (emails.length === 0)
      return alert("No confirmed team members with emails found.");
    window.location.href = `mailto:?bcc=${emails.join(
      ","
    )}&subject=Project Update: ${project["Title"]}`;
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {project["Status"] === "IN PRODUCTION" ? (
        <div className="bg-[#0A0A1F] border border-white/10 p-6 rounded-xl overflow-x-auto">
          <h3 className="text-gold text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4" /> Production Workflow
          </h3>
          <div className="flex items-center min-w-[800px]">
            {PROGRESS_STEPS.map((step, idx) => {
              const currentIdx = PROGRESS_STEPS.indexOf(currentProductionStep);
              const isCompleted = idx < currentIdx;
              const isActive = currentProductionStep === step;
              return (
                <div
                  key={idx}
                  className="flex items-center flex-1 last:flex-none relative group"
                >
                  <button
                    onClick={() => setProductionStep(step)}
                    className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all border-2 ${
                      isActive
                        ? "bg-gold border-gold text-midnight scale-110 shadow-glow"
                        : isCompleted
                        ? "bg-green-500 border-green-500 text-midnight"
                        : "bg-black border-white/20 text-gray-500 hover:border-white/50"
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                  </button>
                  <div
                    className={`absolute top-10 left-1/2 -translate-x-1/2 w-24 text-center text-[9px] font-bold uppercase tracking-wide leading-tight ${
                      isActive
                        ? "text-gold"
                        : isCompleted
                        ? "text-green-400"
                        : "text-gray-600"
                    }`}
                  >
                    {step}
                  </div>
                  {idx < PROGRESS_STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 ${
                        idx < currentIdx ? "bg-green-500" : "bg-white/10"
                      }`}
                    ></div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="h-12"></div>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 border-dashed p-8 rounded-xl text-center">
          <div className="text-gray-400 text-xs mb-2">
            Production Workflow is active only when Project Status is{" "}
            <strong>IN PRODUCTION</strong>.
          </div>
        </div>
      )}

      <header className="flex justify-between items-center mb-6 pt-4 border-t border-white/10">
        <div>
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <Lock className="w-5 h-5 text-gold" /> Locked Production Roster
          </h3>
          <p className="text-gray-400 text-xs mt-1">
            Only Crew & Talent with accepted proposals appear here.
          </p>
        </div>
        <button
          onClick={handleEmailTeam}
          className="px-4 py-2 bg-gold text-midnight border border-gold rounded text-[10px] font-bold uppercase tracking-widest hover:bg-white flex items-center gap-2 shadow-glow"
        >
          <Mail className="w-3 h-3" /> Email All Team
        </button>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { role: "Coordinator", key: "Coordinator" },
          { role: "Script Prep", key: "Script Prep" },
          { role: "Engineer", key: "Engineer" },
          { role: "Proofer", key: "Proofer" },
          { role: "Talent A", key: "Talent A" },
          { role: "Talent B", key: "Talent B" },
          { role: "Talent C", key: "Talent C" },
          { role: "Talent D", key: "Talent D" },
        ].map((item, i) => {
          const name = project[item.key];
          const email = project[`${item.key} Email`];
          if (!name || contractStatus[item.key] !== true) return null;
          return (
            <div
              key={i}
              className="p-4 bg-green-900/10 border border-green-500/30 rounded-lg flex flex-col gap-3 group hover:bg-green-900/20 transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-green-400 uppercase tracking-widest font-bold mb-1">
                    {item.role}
                  </div>
                  <div className="text-white font-bold text-lg leading-tight">
                    {name}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1">
                    {email || "No email"}
                  </div>
                </div>
                <Lock className="w-4 h-4 text-green-500" />
              </div>
              <button
                onClick={() => (window.location.href = `mailto:${email}`)}
                className="w-full py-2 mt-1 rounded bg-white/5 border border-white/10 text-gray-300 text-[10px] font-bold uppercase hover:bg-gold hover:text-midnight hover:border-gold transition flex items-center justify-center gap-2"
              >
                <Mail className="w-3 h-3" /> Email {item.role}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default ProductionHub;
