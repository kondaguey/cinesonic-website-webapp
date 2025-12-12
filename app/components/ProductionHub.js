import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Check,
  Lock,
  Mail,
  Trophy,
  AlertCircle,
  MessageSquare,
  Send,
  Clock,
  FileAudio,
  AlertTriangle,
} from "lucide-react";

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

const ProductionHub = ({ project, updateField, user, saveProject }) => {
  const [newNote, setNewNote] = useState("");
  const chatEndRef = useRef(null);

  if (!project) return null;

  // --- DATA HELPERS ---
  const getContractStatus = () => {
    try {
      const val = project["Contract Data"];
      return typeof val === "object" ? val : JSON.parse(val || "{}");
    } catch (e) {
      return {};
    }
  };
  const contractStatus = getContractStatus();

  // --- CORRESPONDENCE PARSER ---
  const getCorrespondence = () => {
    try {
      const val = project["Project Correspondence"];
      if (!val) return [];
      return typeof val === "object" ? val : JSON.parse(val);
    } catch (e) {
      return [];
    }
  };
  const correspondenceLog = getCorrespondence();

  const currentProductionStep =
    contractStatus.production_step || PROGRESS_STEPS[0];

  const setProductionStep = (step) => {
    const newContracts = { ...contractStatus, production_step: step };
    updateField("Contract Data", newContracts);
  };

  // --- POST MESSAGE HANDLER ---
  const handlePostNote = () => {
    if (!newNote.trim()) return;

    const entry = {
      text: newNote,
      author: user?.name || "Crew Member",
      role: user?.role || "Staff",
      timestamp: new Date().toISOString(),
    };

    const newLog = [...correspondenceLog, entry];
    updateField("Project Correspondence", newLog);

    setNewNote("");

    // Silent Auto-Save
    setTimeout(() => {
      if (saveProject) saveProject();
    }, 100);
  };

  useEffect(() => {
    // OLD: chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

    // NEW: Add block: "nearest"
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [correspondenceLog]);

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

  // NEW: TOGGLE FILES RECEIVED
  const toggleFilesReceived = (key) => {
    const statusKey = `${key}_files_received`;
    const currentVal = contractStatus[statusKey] || false;

    const newContracts = { ...contractStatus, [statusKey]: !currentVal };
    updateField("Contract Data", newContracts);

    // Auto-save to lock it in
    setTimeout(() => {
      if (saveProject) saveProject();
    }, 100);
  };

  // NEW: CHECK OVERDUE STATUS
  const getOverdueStatus = (received) => {
    if (received) return { status: "complete", label: "Files In" };

    if (!project["Confirmed End"])
      return { status: "pending", label: "In Progress" };

    const today = new Date();
    const dueDate = new Date(project["Confirmed End"]);

    // Reset time to midnight for fair comparison
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    if (today > dueDate) {
      const diffTime = Math.abs(today - dueDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return { status: "late", label: `${diffDays} Days Late`, days: diffDays };
    }

    return { status: "pending", label: "On Track" };
  };

  const lockedCount = [
    "Coordinator",
    "Script Prep",
    "Engineer",
    "Proofer",
    "Talent A",
    "Talent B",
    "Talent C",
    "Talent D",
  ].filter((k) => contractStatus[k] === true && project[k]).length;

  return (
    // 🟢 FIX: Removed 'animate-fade-in' class here to stop scrolling on click
    <div className="space-y-8 pb-20">
      {/* WORKFLOW TRACKER */}
      <div className="relative bg-gradient-to-r from-[#0A0A1F] to-[#1a1a3a] border border-gold/20 rounded-2xl overflow-hidden shadow-2xl group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-[80px] group-hover:bg-gold/10 transition-colors pointer-events-none"></div>

        <div className="relative z-10 p-5">
          <h3 className="text-gold text-sm font-bold uppercase tracking-[0.2em] mb-2 flex items-center gap-3">
            <LayoutDashboard className="w-5 h-5 text-gold" />
            Active Workflow
          </h3>
          <p className="text-xs text-gray-500 mb-6">
            Click a step to update the project status.
          </p>

          <div className="overflow-x-auto pb-32 pt-12 px-2 custom-scrollbar">
            <div className="flex items-center min-w-[1200px] relative px-4">
              <div className="absolute left-4 right-16 top-[50%] -translate-y-1/2 h-0.5 bg-white/10 -z-0"></div>

              {PROGRESS_STEPS.map((step, idx) => {
                const currentIdx = PROGRESS_STEPS.indexOf(
                  currentProductionStep
                );
                const isCompleted = idx < currentIdx;
                const isActive = currentProductionStep === step;
                const stepTime = contractStatus.step_timestamps?.[step];

                return (
                  <div
                    key={idx}
                    className="flex-1 last:flex-none relative flex flex-col items-center justify-center group/step cursor-pointer"
                    onClick={() => setProductionStep(step)}
                  >
                    {idx > 0 && (
                      <div
                        className={`absolute right-[50%] top-[50%] -translate-y-1/2 h-0.5 w-full -z-0 transition-all duration-700 ${
                          idx <= currentIdx
                            ? "bg-gradient-to-r from-gold to-gold-light"
                            : "bg-transparent"
                        }`}
                        style={{ left: "-50%" }}
                      />
                    )}
                    <button
                      className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 border-2 ${
                        isActive
                          ? "bg-midnight border-gold text-gold scale-125 shadow-[0_0_20px_rgba(212,175,55,0.6)] ring-4 ring-gold/10"
                          : isCompleted
                          ? "bg-gold border-gold text-midnight scale-100"
                          : "bg-midnight border-white/20 text-gray-600 hover:border-white/50 hover:bg-white/5"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : isActive ? (
                        <div className="w-2.5 h-2.5 bg-gold rounded-full animate-pulse" />
                      ) : (
                        idx + 1
                      )}
                    </button>
                    <div
                      className={`absolute top-16 w-32 text-center text-[10px] font-bold uppercase tracking-wider leading-tight transition-colors duration-300 ${
                        isActive
                          ? "text-gold translate-y-0 opacity-100"
                          : isCompleted
                          ? "text-gray-400"
                          : "text-gray-600 group-hover/step:text-gray-400"
                      }`}
                    >
                      {step}
                    </div>
                    {stepTime && (isCompleted || isActive) && (
                      <div className="absolute top-24 w-32 text-center text-[9px] text-gray-500 font-mono flex flex-col items-center opacity-0 group-hover/step:opacity-100 transition-opacity">
                        <span className="text-gold/50">
                          {new Date(stepTime).toLocaleDateString()}
                        </span>
                        <span>
                          {new Date(stepTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* LOG SECTION */}
        <div className="bg-black/40 border-t border-white/5 grid grid-cols-1 md:grid-cols-3">
          <div className="p-6 border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-center">
            <h4 className="text-gold font-bold uppercase tracking-widest text-xs mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Production Log
            </h4>
            <p className="text-[10px] text-gray-400 leading-relaxed">
              Track status updates, delays, or important notes here.
            </p>
          </div>
          <div className="col-span-2 p-6 bg-[#050510]">
            <div className="h-40 overflow-y-auto custom-scrollbar mb-4 space-y-3 pr-2 border border-white/5 rounded-lg p-3 bg-black/20">
              {correspondenceLog.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-600 text-xs italic">
                  No updates logged yet.
                </div>
              ) : (
                correspondenceLog.map((msg, i) => (
                  <div
                    key={i}
                    className="flex gap-3 text-sm group animate-fade-in"
                  >
                    <div className="shrink-0 mt-1">
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-gold font-bold border border-white/5">
                        {msg.author ? msg.author.charAt(0) : "?"}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2 mb-0.5">
                        <span className="text-gold font-bold text-xs">
                          {msg.author}
                        </span>
                        <span className="text-[9px] text-gray-500 opacity-60">
                          {new Date(msg.timestamp).toLocaleString([], {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePostNote()}
                placeholder="Type a status update..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-gold outline-none transition-all placeholder:text-gray-600"
              />
              <button
                onClick={handlePostNote}
                disabled={!newNote.trim()}
                className="bg-gold hover:bg-gold-light text-midnight p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gold/10"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* LOCKED ROSTER & SUBMISSION TRACKER */}
      <header className="flex justify-between items-end border-b border-white/10 pb-4">
        <div>
          <h3 className="text-white font-bold text-xl flex items-center gap-2">
            <Lock className="w-5 h-5 text-gold" /> Locked Production Roster
          </h3>
          <p className="text-gray-400 text-xs mt-1 tracking-wide">
            {lockedCount > 0
              ? `${lockedCount} team members confirmed and ready.`
              : "Awaiting signed contracts."}
          </p>
        </div>

        {lockedCount > 0 && (
          <button
            onClick={handleEmailTeam}
            className="px-5 py-2.5 bg-gold hover:bg-white text-midnight font-bold rounded-lg text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-glow transition-all hover:-translate-y-0.5"
          >
            <Mail className="w-3 h-3" /> Email All Team
          </button>
        )}
      </header>

      {/* SUBMISSION TRACKING GRID */}
      {lockedCount === 0 ? (
        <div className="bg-white/5 border border-white/10 border-dashed rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-4">
          <AlertCircle className="w-12 h-12 text-gray-600 opacity-50" />
          <div>
            <h4 className="text-gray-300 font-bold uppercase tracking-widest text-sm">
              Roster Empty
            </h4>
            <p className="text-gray-500 text-xs mt-1">
              Visit the <strong className="text-gold">Contracts Tab</strong> to
              lock in Crew & Talent.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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

            // CALCULATE STATUS
            const filesReceived =
              contractStatus[`${item.key}_files_received`] || false;
            const timeline = getOverdueStatus(filesReceived);
            const isLate = timeline.status === "late";
            const isDone = timeline.status === "complete";

            // DYNAMIC BUTTON
            const emailSubject = isLate
              ? `URGENT: Material Overdue - ${project["Title"]}`
              : `Production Update: ${project["Title"]}`;

            const btnColor = isLate
              ? "bg-red-500 hover:bg-red-600 text-white border-red-500 shadow-red-900/50"
              : "bg-black/40 border-white/10 text-gray-300 hover:bg-gold hover:text-midnight hover:border-gold";

            return (
              <div
                key={i}
                className={`relative p-5 rounded-xl flex flex-col gap-4 border transition-all duration-300 ${
                  isDone
                    ? "bg-green-900/10 border-green-500/50"
                    : isLate
                    ? "bg-red-900/10 border-red-500/50"
                    : "bg-white/5 border-gold/10 hover:border-gold/30"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div
                      className={`text-[9px] uppercase tracking-widest font-bold mb-1.5 flex items-center gap-1.5 ${
                        isLate
                          ? "text-red-400"
                          : isDone
                          ? "text-green-400"
                          : "text-gray-400"
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          isLate
                            ? "bg-red-500 animate-pulse"
                            : isDone
                            ? "bg-green-500"
                            : "bg-gold"
                        }`}
                      ></div>
                      {item.role}
                    </div>
                    <div className="text-white font-serif font-bold text-lg leading-tight truncate">
                      {name}
                    </div>
                  </div>

                  {/* STATUS BADGE */}
                  <div
                    className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider border ${
                      isLate
                        ? "bg-red-500 text-white border-red-400 shadow-glow-red"
                        : isDone
                        ? "bg-green-500 text-midnight border-green-400"
                        : "bg-white/5 text-gray-500 border-white/10"
                    }`}
                  >
                    {timeline.label}
                  </div>
                </div>

                {/* FILES TOGGLE */}
                <div
                  onClick={() => toggleFilesReceived(item.key)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors border ${
                    filesReceived
                      ? "bg-green-500/20 border-green-500/30 text-green-300 hover:bg-green-500/30"
                      : "bg-black/30 border-white/5 text-gray-400 hover:bg-white/5"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center border ${
                      filesReceived
                        ? "bg-green-500 border-green-500 text-midnight"
                        : "border-gray-600"
                    }`}
                  >
                    {filesReceived && <Check size={14} strokeWidth={4} />}
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] font-bold uppercase tracking-wide">
                      Materials Received
                    </div>
                    <div className="text-[9px] opacity-60">
                      {filesReceived
                        ? "Submission Complete"
                        : "Pending Submission"}
                    </div>
                  </div>
                  <FileAudio
                    size={16}
                    className={
                      filesReceived ? "text-green-400" : "text-gray-600"
                    }
                  />
                </div>

                {/* ACTION BUTTON */}
                <button
                  onClick={() =>
                    (window.location.href = `mailto:${email}?subject=${encodeURIComponent(
                      emailSubject
                    )}`)
                  }
                  className={`w-full py-2.5 mt-auto rounded-lg text-[10px] font-bold uppercase border flex items-center justify-center gap-2 transition-all shadow-lg ${btnColor}`}
                >
                  {isLate ? <AlertTriangle size={12} /> : <Mail size={12} />}
                  {isLate ? "Send Late Notice" : "Email Individual"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductionHub;
