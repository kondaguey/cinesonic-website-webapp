import React from "react";
import {
  FileSignature,
  Lock,
  Upload,
  Download,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Button from "@/components/ui/Button";

export default function ContractsManager({ project, onUpdate }) {
  // Helpers to check status
  const cast = project.casting_manifest || [];
  const crew = project.crew_manifest || {};

  // This would handle file uploads in a real implementation
  const handleUpload = (id, type) => {
    alert(`Upload ${type} for ${id}`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-xl">
        <h2 className="text-xl font-serif text-[#d4af37] flex items-center gap-2 mb-4">
          <FileSignature /> Master Contract Ledger
        </h2>

        {/* CAST TABLE */}
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 mt-6">
          Talent Contracts
        </h3>
        <div className="border border-white/10 rounded-lg overflow-hidden mb-8">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-white/5 text-xs uppercase font-bold text-[#d4af37]">
              <tr>
                <th className="p-3">Role</th>
                <th className="p-3">Talent</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {cast.map((r) => {
                const actor = r.assigned_actor || r.actor_request?.primary;
                if (!actor) return null;
                const isSigned = r.contract?.status === "Active";
                return (
                  <tr key={r.role_id} className="hover:bg-white/5">
                    <td className="p-3 text-white">{r.name}</td>
                    <td className="p-3">{actor.display_name}</td>
                    <td className="p-3">
                      {isSigned ? (
                        <span className="text-green-500 flex items-center gap-1 text-xs font-bold">
                          <Lock size={10} /> Signed
                        </span>
                      ) : (
                        <span className="text-yellow-500 text-xs font-bold">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right flex justify-end gap-2">
                      <button
                        onClick={() => handleUpload(r.role_id, "W9")}
                        className="text-[10px] border border-white/10 px-2 py-1 rounded hover:bg-white/10 flex items-center gap-1"
                      >
                        <Upload size={10} /> W9
                      </button>
                      <button className="text-[10px] border border-white/10 px-2 py-1 rounded hover:bg-white/10 flex items-center gap-1">
                        <Download size={10} /> PDF
                      </button>
                    </td>
                  </tr>
                );
              })}
              {cast.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-xs italic">
                    No talent assigned.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* CREW TABLE */}
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
          Crew Contracts
        </h3>
        <div className="border border-white/10 rounded-lg overflow-hidden">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-white/5 text-xs uppercase font-bold text-[#d4af37]">
              <tr>
                <th className="p-3">Position</th>
                <th className="p-3">Name</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {Object.entries(crew).map(([key, member]) => {
                if (!member.name) return null;
                const isSigned = member.status === "Active";
                return (
                  <tr key={key} className="hover:bg-white/5">
                    <td className="p-3 text-white capitalize">
                      {key.replace(/_/g, " ")}
                    </td>
                    <td className="p-3">{member.name}</td>
                    <td className="p-3">
                      {isSigned ? (
                        <span className="text-green-500 flex items-center gap-1 text-xs font-bold">
                          <Lock size={10} /> Signed
                        </span>
                      ) : (
                        <span className="text-yellow-500 text-xs font-bold">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right flex justify-end gap-2">
                      <button
                        onClick={() => handleUpload(key, "W9")}
                        className="text-[10px] border border-white/10 px-2 py-1 rounded hover:bg-white/10 flex items-center gap-1"
                      >
                        <Upload size={10} /> W9
                      </button>
                    </td>
                  </tr>
                );
              })}
              {Object.keys(crew).length === 0 && (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-xs italic">
                    No crew assigned.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
