import React from "react";
import { LayoutDashboard, Check } from "lucide-react";

const STEPS = [
  "Pre-Production",
  "Recording",
  "Post-Production",
  "Review",
  "Final Delivery",
];

export default function WorkflowTracker({ project, onUpdate }) {
  const currentStep = project.contract_data?.production_step || STEPS[0];

  const handleStepClick = (step) => {
    // Typically confirm with modal, here direct update
    const contractData = project.contract_data || {};
    const newStepData = {
      ...contractData,
      production_step: step,
      step_timestamps: {
        ...(contractData.step_timestamps || {}),
        [step]: new Date().toISOString(),
      },
    };
    onUpdate({ contract_data: newStepData });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-8">
        <h2 className="text-xl font-serif text-white mb-8 flex items-center gap-2">
          <LayoutDashboard className="text-[#d4af37]" /> Production Phase
        </h2>
        <div className="flex justify-between relative">
          {/* Line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -z-0 -translate-y-1/2" />

          {STEPS.map((step, i) => {
            const isActive = step === currentStep;
            const isDone = STEPS.indexOf(currentStep) > i;
            const timestamp = project.contract_data?.step_timestamps?.[step];

            return (
              <button
                key={step}
                onClick={() => handleStepClick(step)}
                className="relative z-10 flex flex-col items-center gap-3 group"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                    isActive
                      ? "bg-[#0c0442] border-[#d4af37] text-[#d4af37] scale-125 shadow-[0_0_20px_rgba(212,175,55,0.5)]"
                      : isDone
                      ? "bg-[#d4af37] border-[#d4af37] text-black"
                      : "bg-black border-white/20 text-gray-600 hover:border-white/50"
                  }`}
                >
                  {isDone ? <Check size={20} /> : i + 1}
                </div>
                <div className="flex flex-col items-center">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-widest ${
                      isActive ? "text-[#d4af37]" : "text-gray-500"
                    }`}
                  >
                    {step}
                  </span>
                  {timestamp && (
                    <span className="text-[9px] text-gray-600 bg-black/50 px-1 rounded mt-1">
                      {new Date(timestamp).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
