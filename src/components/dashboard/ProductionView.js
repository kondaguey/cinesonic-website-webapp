import React from "react";
import {
  Mail,
  Calendar,
  FileText,
  CheckCircle,
  User,
  Users,
} from "lucide-react";

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
  // Ensures the date input doesn't crash if the backend sends "TBD" or a weird string
  const getIsoDate = (dateVal) => {
    if (!dateVal) return "";
    // If it's already YYYY-MM-DD, return it
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
      <div className="bg-midnight border border-white/10 rounded-xl p-8 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition pointer-events-none">
          <FileText className="w-64 h-64 text-gold" />
        </div>

        <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gold" /> Production Logistics
        </h3>

        {/* 🟢 DATES SECTION (Mapped to Confirmed Keys) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <label className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 block">
              Official Start Date
            </label>
            <input
              type="date"
              // 🟢 READS "Confirmed Start" (Parsed from Col AG)
              value={getIsoDate(project["Confirmed Start"])}
              // 🟢 WRITES "Confirmed Start"
              onChange={(e) => updateField("Confirmed Start", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white text-sm focus:border-gold outline-none transition [color-scheme:dark]"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 block">
              Official End Date
            </label>
            <input
              type="date"
              // 🟢 READS "Confirmed End" (Parsed from Col AG)
              value={getIsoDate(project["Confirmed End"])}
              // 🟢 WRITES "Confirmed End"
              onChange={(e) => updateField("Confirmed End", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white text-sm focus:border-gold outline-none transition [color-scheme:dark]"
            />
          </div>
        </div>

        {/* 🟢 CREW ASSIGNMENTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Coordinator", key: "Coordinator" },
            { label: "Script Prep", key: "Script Prep" },
            { label: "Engineer", key: "Engineer" },
            { label: "Proofer", key: "Proofer" },
          ].map((role) => {
            const emailKey = role.key + " Email";
            const hasEmail = Boolean(project[emailKey]);
            return (
              <div
                key={role.key}
                className="bg-white/5 p-3 rounded border border-white/10"
              >
                <label className="text-[9px] text-gray-500 uppercase tracking-widest mb-1 block">
                  {role.label}
                </label>
                <input
                  type="text"
                  value={project[role.key] || ""}
                  onChange={(e) => updateField(role.key, e.target.value)}
                  className="w-full bg-transparent border-b border-white/20 pb-1 text-white text-sm focus:border-gold outline-none placeholder-gray-600 transition mb-2"
                  placeholder="Unassigned"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleEmailIndividual(
                        project[emailKey],
                        `Question for ${role.label}`
                      )
                    }
                    disabled={!hasEmail}
                    className={`flex-1 py-1.5 rounded text-[9px] uppercase font-bold flex items-center justify-center gap-2 transition ${
                      hasEmail
                        ? "bg-gold text-midnight hover:bg-white"
                        : "bg-white/5 text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    <Mail className="w-3 h-3" />{" "}
                    {hasEmail ? "Email" : "No Email"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🟢 LOCKED ROSTER */}
      <div className="bg-midnight border border-white/10 rounded-xl p-8">
        <header className="flex justify-between items-center mb-6">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-gold" /> Locked Talent Roster
          </h3>
          <button
            onClick={handleEmailAll}
            className="flex items-center gap-2 bg-white/10 hover:bg-gold hover:text-midnight text-white border border-white/20 hover:border-gold px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest transition"
          >
            <Users className="w-4 h-4" /> Email Full Team (Kickoff)
          </button>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {["Talent A", "Talent B", "Talent C", "Talent D"].map((key) => {
            const actorName = project[key];
            const actorEmail = project[`${key} Email`];
            const displayEmail = actorEmail || "No Email";
            const hasEmail = displayEmail !== "No Email";

            if (!actorName)
              return (
                <div
                  key={key}
                  className="border border-white/5 border-dashed rounded-xl p-6 flex items-center justify-center text-gray-600 text-xs italic"
                >
                  Slot Empty
                </div>
              );

            return (
              <div
                key={key}
                className="bg-white/5 border border-gold/30 p-4 rounded-xl flex flex-col gap-3 hover:bg-gold/5 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold shrink-0">
                    {actorName.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-[9px] text-green-400 uppercase font-bold flex items-center gap-1 mb-0.5">
                      <CheckCircle className="w-3 h-3" /> Confirmed
                    </div>
                    <div className="font-bold text-white text-sm truncate">
                      {actorName}
                    </div>
                  </div>
                </div>
                <div className="pt-3 border-t border-white/5 mt-auto">
                  <button
                    onClick={() =>
                      handleEmailIndividual(
                        displayEmail,
                        `Production Update: ${project["Title"]}`
                      )
                    }
                    disabled={!hasEmail}
                    className={`w-full py-2 rounded text-[10px] uppercase font-bold flex items-center justify-center gap-2 transition ${
                      hasEmail
                        ? "bg-white/10 hover:bg-gold hover:text-midnight text-gray-300"
                        : "bg-black/20 text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    <Mail className="w-3 h-3" />{" "}
                    {hasEmail ? "Email Talent" : "No Email"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default ProductionView;
