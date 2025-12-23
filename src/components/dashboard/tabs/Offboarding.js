import React from "react";
import { CheckCircle, DollarSign, Archive, FileCheck } from "lucide-react";
import Button from "@/components/ui/Button";

export default function Offboarding({ project, onUpdate }) {
  const isPaid = project.production_status === "Paid";

  const handleMarkPaid = () => {
    if (confirm("Mark project as PAID? This is final.")) {
      onUpdate({ production_status: "Paid" });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center gap-6">
        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-2">
          <CheckCircle size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-serif text-white mb-2">
            Project Completion
          </h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Ensure all deliverables have been sent to the client and all
            contractors have submitted their invoices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
          <div
            className={`p-6 rounded-xl border flex flex-col items-center gap-3 transition-all ${
              isPaid
                ? "bg-green-900/20 border-green-500/50"
                : "bg-white/5 border-white/10"
            }`}
          >
            <DollarSign
              className={isPaid ? "text-green-500" : "text-gray-500"}
              size={24}
            />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Payment Status
            </span>
            {isPaid ? (
              <div className="text-green-400 font-bold">ALL SETTLED</div>
            ) : (
              <Button onClick={handleMarkPaid} color="#22c55e" variant="glow">
                Mark All Paid
              </Button>
            )}
          </div>

          <div className="p-6 rounded-xl border border-white/10 bg-white/5 flex flex-col items-center gap-3 opacity-50 cursor-not-allowed">
            <Archive className="text-gray-500" size={24} />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Archive Project
            </span>
            <div className="text-[10px] text-gray-500">Coming Soon</div>
          </div>
        </div>
      </div>
    </div>
  );
}
