import React from "react";
import {
  Mail,
  Calendar,
  FileText,
  CheckCircle,
  User,
  Users,
} from "lucide-react";

// --- ATOMS ---
import Button from "../ui/Button";
import SectionHeader from "../ui/SectionHeader";
import Badge from "../ui/Badge";

// --- LOCAL SUB-COMPONENTS (Could be extracted to UI later if needed) ---
const CrewCard = ({ label, name, email, onUpdate, onEmail }) => {
  const hasEmail = Boolean(email);

  return (
    <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-white/20 transition-all flex flex-col gap-3">
      <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
        {label}
      </label>

      <input
        type="text"
        value={name || ""}
        onChange={(e) => onUpdate(e.target.value)}
        className="w-full bg-transparent border-b border-white/20 pb-2 text-white text-sm font-bold focus:border-[#d4af37] outline-none placeholder-gray-600 transition-colors"
        placeholder="Unassigned"
      />

      <Button
        onClick={onEmail}
        disabled={!hasEmail}
        variant={hasEmail ? "glow" : "ghost"}
        color="#d4af37"
        className="w-full py-2 h-auto text-[10px]"
      >
        <Mail className="w-3 h-3 mr-2" />
        {hasEmail ? "Email" : "No Email"}
      </Button>
    </div>
  );
};

const TalentCard = ({ name, email, onEmail }) => {
  const hasEmail = Boolean(email);
  if (!name) {
    return (
      <div className="border border-white/5 border-dashed rounded-xl p-6 flex items-center justify-center text-gray-600 text-xs italic min-h-[140px]">
        Slot Empty
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-[#d4af37]/30 p-4 rounded-xl flex flex-col gap-4 hover:bg-[#d4af37]/5 transition group min-h-[140px]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37] font-bold shrink-0 text-sm">
          {name.charAt(0)}
        </div>
        <div className="overflow-hidden">
          <div className="flex items-center gap-1 mb-1">
            <CheckCircle className="w-3 h-3 text-green-400" />
            <span className="text-[9px] text-green-400 uppercase font-bold tracking-wider">
              Confirmed
            </span>
          </div>
          <div className="font-bold text-white text-sm truncate leading-tight">
            {name}
          </div>
        </div>
      </div>

      <div className="mt-auto pt-3 border-t border-white/5">
        <Button
          onClick={onEmail}
          disabled={!hasEmail}
          variant="ghost"
          color="#d4af37"
          className="w-full py-2 h-auto text-[10px] hover:bg-[#d4af37] hover:text-[#0c0442]"
        >
          <Mail className="w-3 h-3 mr-2" />
          {hasEmail ? "Email Talent" : "No Email"}
        </Button>
      </div>
    </div>
  );
};

const ProductionView = ({ project, updateField, roster }) => {
  if (!project) return null;

  const handleEmailIndividual = (email, subject = "") => {
    if (!email) return alert("No email address found for this person.");
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}`;
  };

  const handleEmailAll = () => {
    let emails = [];
    [
      "Coordinator Email",
      "Script Prep Email",
      "Engineer Email",
      "Proofer Email",
      "Talent A Email",
      "Talent B Email",
      "Talent C Email",
      "Talent D Email",
    ].forEach((k) => {
      if (project[k]) emails.push(project[k]);
    });
    if (emails.length === 0) return alert("No emails found in this project.");
    const subject = `PRODUCTION KICKOFF: ${project["Title"]} (${project["Project ID"]})`;
    window.location.href = `mailto:?bcc=${emails.join(
      ","
    )}&subject=${encodeURIComponent(subject)}`;
  };

  // 🟢 HELPER: Safe Date Parsing
  const getIsoDate = (dateVal) => {
    if (!dateVal) return "";
    if (typeof dateVal === "string" && dateVal.match(/^\d{4}-\d{2}-\d{2}$/))
      return dateVal;
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return "";
      return d.toISOString().split("T")[0];
    } catch (e) {
      return "";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* 1. LOGISTICS CARD */}
      <div className="bg-[#0c0442] border border-white/10 rounded-xl p-8 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition pointer-events-none">
          <FileText className="w-64 h-64 text-[#d4af37]" />
        </div>

        <div className="relative z-10">
          <SectionHeader
            icon={Calendar}
            title="Production Logistics"
            color="text-[#d4af37]"
          />

          {/* DATES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 mt-6">
            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 block font-bold">
                Official Start Date
              </label>
              <input
                type="date"
                value={getIsoDate(project["Confirmed Start"])}
                onChange={(e) => updateField("Confirmed Start", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-[#d4af37] outline-none transition-colors [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 block font-bold">
                Official End Date
              </label>
              <input
                type="date"
                value={getIsoDate(project["Confirmed End"])}
                onChange={(e) => updateField("Confirmed End", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-[#d4af37] outline-none transition-colors [color-scheme:dark]"
              />
            </div>
          </div>

          {/* CREW GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Coordinator", key: "Coordinator" },
              { label: "Script Prep", key: "Script Prep" },
              { label: "Engineer", key: "Engineer" },
              { label: "Proofer", key: "Proofer" },
            ].map((role) => (
              <CrewCard
                key={role.key}
                label={role.label}
                name={project[role.key]}
                email={project[`${role.key} Email`]}
                onUpdate={(val) => updateField(role.key, val)}
                onEmail={() =>
                  handleEmailIndividual(
                    project[`${role.key} Email`],
                    `Question for ${role.label}`
                  )
                }
              />
            ))}
          </div>
        </div>
      </div>

      {/* 2. LOCKED ROSTER */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-8">
        <header className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-[#d4af37]" />
            <h3 className="text-xl font-bold text-white font-serif">
              Locked Talent Roster
            </h3>
          </div>

          <Button
            onClick={handleEmailAll}
            variant="solid"
            color="#d4af37"
            className="w-auto px-4 py-2 text-[10px]"
          >
            <Users className="w-4 h-4 mr-2" /> Email Full Team (Kickoff)
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {["Talent A", "Talent B", "Talent C", "Talent D"].map((key) => (
            <TalentCard
              key={key}
              name={project[key]}
              email={project[`${key} Email`]}
              onEmail={() =>
                handleEmailIndividual(
                  project[`${key} Email`],
                  `Production Update: ${project["Title"]}`
                )
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default ProductionView;
