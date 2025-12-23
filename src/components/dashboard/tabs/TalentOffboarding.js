import React from "react";
import { CheckCircle, DollarSign, Clock, AlertTriangle } from "lucide-react";

export default function TalentOffboarding({ project, user }) {
  // Logic: Find MY entry in the financial ledger (if you choose to expose it)
  // OR: Check the project status.

  const isProjectPaid = project.production_status === "Paid";

  // NOTE: Ideally, you check specific ledger entries for this user ID.
  // For now, we assume if project is Paid, Talent is Paid.

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
      {/* STATUS CARD */}
      <div
        className={`p-8 rounded-xl border flex flex-col items-center text-center gap-4 ${
          isProjectPaid
            ? "bg-green-900/10 border-green-500/30"
            : "bg-[#0a0a0a] border-white/10"
        }`}
      >
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center ${
            isProjectPaid
              ? "bg-green-500/20 text-green-500"
              : "bg-white/5 text-gray-500"
          }`}
        >
          {isProjectPaid ? <CheckCircle size={32} /> : <Clock size={32} />}
        </div>

        <div>
          <h3 className="text-xl font-bold text-white mb-1">
            {isProjectPaid ? "Payment Complete" : "Payment Pending"}
          </h3>
          <p className="text-xs text-gray-500">
            {isProjectPaid
              ? "This project has been settled. Thank you for your work!"
              : "Production is ongoing or invoice is processing."}
          </p>
        </div>
      </div>

      {/* INVOICE INFO */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-8">
        <h3 className="text-[#00f0ff] font-bold uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
          <DollarSign size={14} /> Invoice Details
        </h3>

        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Rate Type</span>
            <span className="text-white font-mono">PFH</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Reference ID</span>
            <span className="text-white font-mono">
              {project.project_ref_id}
            </span>
          </div>

          {!isProjectPaid && (
            <div className="mt-6 p-4 bg-yellow-900/10 border border-yellow-500/20 rounded-lg flex gap-3">
              <AlertTriangle className="text-yellow-500 shrink-0" size={16} />
              <p className="text-[10px] text-yellow-200/70 leading-relaxed">
                If you believe this status is incorrect, please contact your
                Production Coordinator via the Comms tab.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
