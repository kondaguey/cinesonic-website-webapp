import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Check,
  Lock,
  Mail,
  MessageSquare,
  Send,
  FileAudio,
  AlertTriangle,
  AlertCircle,
  X,
} from "lucide-react";

// --- ATOMS ---
import Button from "../ui/Button";
import SectionHeader from "../ui/SectionHeader";
import Badge from "../ui/Badge";

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
  const [pendingStep, setPendingStep] = useState(null); // 🟢 NEW: Tracks step awaiting confirmation
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

  // 🟢 LOGIC: 1. Request Change (Opens Modal)
  const requestStepChange = (step) => {
    if (step === currentProductionStep) return;
    setPendingStep(step);
  };

  // 🟢 LOGIC: 2. Confirm Change (Executes DB Update)
  const confirmStepChange = () => {
    if (!pendingStep) return;

    const now = new Date().toISOString();
    const currentTimestamps = contractStatus.step_timestamps || {};

    const newContracts = {
      ...contractStatus,
      production_step: pendingStep,
      step_timestamps: {
        ...currentTimestamps,
        [pendingStep]: now, // Locks in the time
      },
    };

    // Save to DB
    const updatedProject = { ...project, "Contract Data": newContracts };
    updateField("Contract Data", newContracts);
    saveProject(updatedProject);

    // Close Modal
    setPendingStep(null);
  };

  // 🟢 LOGIC: Post Note
  const handlePostNote = () => {
    if (!newNote.trim()) return;

    const entry = {
      text: newNote,
      author: user?.name || "Crew Member",
      role: user?.role || "Staff",
      timestamp: new Date().toISOString(),
    };

    const newLog = [...correspondenceLog, entry];
    const updatedProject = { ...project, "Project Correspondence": newLog };
    updateField("Project Correspondence", newLog);
    setNewNote("");
    saveProject(updatedProject);
  };

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [correspondenceLog]);

  // 🟢 LOGIC: Email Team
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

  // 🟢 LOGIC: Toggle Files
  const toggleFilesReceived = (key) => {
    const statusKey = `${key}_files_received`;
    const currentVal = contractStatus[statusKey] || false;
    const newContracts = { ...contractStatus, [statusKey]: !currentVal };
    const updatedProject = { ...project, "Contract Data": newContracts };
    updateField("Contract Data", newContracts);
    saveProject(updatedProject);
  };

  // 🟢 LOGIC: Status Check
  const getOverdueStatus = (received) => {
    if (received) return { status: "complete", label: "Files In" };
    if (!project["Confirmed End"])
      return { status: "pending", label: "In Progress" };

    const today = new Date();
    const dueDate = new Date(project["Confirmed End"]);
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
    <div className="space-y-8 pb-20 animate-fade-in relative">
      {/* 1. WORKFLOW TRACKER */}
      <div className="relative bg-[#0c0442] border border-[#d4af37]/20 rounded-2xl overflow-hidden shadow-2xl group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-[80px] group-hover:bg-[#d4af37]/10 transition-colors pointer-events-none"></div>

        <div className="relative z-10 p-6">
          <div className="flex items-center gap-3 mb-2">
            <LayoutDashboard className="w-5 h-5 text-[#d4af37]" />
            <h3 className="text-[#d4af37] text-sm font-bold uppercase tracking-[0.2em]">
              Active Workflow
            </h3>
          </div>
          <p className="text-xs text-gray-400 mb-8">
            Click a step to update status. Action requires confirmation.
          </p>

          <div className="overflow-x-auto pb-12 pt-4 px-2 custom-scrollbar">
            <div className="flex items-center min-w-[1000px] relative px-4">
              {/* Progress Line Background */}
              <div className="absolute left-4 right-16 top-[20px] h-0.5 bg-white/10 -z-0"></div>

              {PROGRESS_STEPS.map((step, idx) => {
                const currentIdx = PROGRESS_STEPS.indexOf(
                  currentProductionStep
                );
                const isCompleted = idx < currentIdx;
                const isActive = currentProductionStep === step;

                // 🟢 RETRIEVE TIMESTAMP
                const stepTimestamp = contractStatus.step_timestamps?.[step];

                return (
                  <div
                    key={idx}
                    className="flex-1 last:flex-none relative flex flex-col items-center justify-center group/step cursor-pointer"
                    onClick={() => requestStepChange(step)} // 🟢 UPDATED CLICK HANDLER
                  >
                    {/* Active Line Fill */}
                    {idx > 0 && (
                      <div
                        className={`absolute right-[50%] top-[20px] h-0.5 w-full -z-0 transition-all duration-700 ${
                          idx <= currentIdx
                            ? "bg-gradient-to-r from-[#d4af37] to-[#fcf6ba]"
                            : "bg-transparent"
                        }`}
                        style={{ left: "-50%" }}
                      />
                    )}

                    {/* Step Circle */}
                    <button
                      className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 border-2 ${
                        isActive
                          ? "bg-[#0c0442] border-[#d4af37] text-[#d4af37] scale-125 shadow-[0_0_20px_rgba(212,175,55,0.6)] ring-4 ring-[#d4af37]/10"
                          : isCompleted
                          ? "bg-[#d4af37] border-[#d4af37] text-[#0c0442] scale-100"
                          : "bg-[#0c0442] border-white/20 text-gray-600 hover:border-white/50 hover:bg-white/5"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : isActive ? (
                        <div className="w-2.5 h-2.5 bg-[#d4af37] rounded-full animate-pulse" />
                      ) : (
                        idx + 1
                      )}
                    </button>

                    {/* Label & Timestamp */}
                    <div
                      className={`mt-4 w-32 text-center flex flex-col items-center transition-all duration-300 ${
                        isActive
                          ? "opacity-100 transform translate-y-0"
                          : isCompleted
                          ? "opacity-90"
                          : "opacity-50 group-hover/step:opacity-100"
                      }`}
                    >
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider leading-tight mb-1 ${
                          isActive ? "text-[#d4af37]" : "text-gray-400"
                        }`}
                      >
                        {step}
                      </span>

                      {/* 🟢 TIMESTAMP DISPLAY */}
                      {stepTimestamp && (
                        <span className="text-[9px] font-mono text-gray-500 bg-black/20 px-1.5 py-0.5 rounded border border-white/5">
                          {new Date(stepTimestamp).toLocaleDateString(
                            undefined,
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* LOG SECTION */}
        <div className="bg-black/40 border-t border-white/5 grid grid-cols-1 md:grid-cols-3">
          <div className="p-6 border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-center">
            <h4 className="text-[#d4af37] font-bold uppercase tracking-widest text-xs mb-2 flex items-center gap-2">
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
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-[#d4af37] font-bold border border-white/5">
                        {msg.author ? msg.author.charAt(0) : "?"}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2 mb-0.5">
                        <span className="text-[#d4af37] font-bold text-xs">
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

            {/* Chat Input & Button */}
            <div className="flex items-center gap-2 h-10">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePostNote()}
                placeholder="Type a status update..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 text-sm text-white focus:border-[#d4af37] outline-none transition-all placeholder:text-gray-600 h-full"
              />

              <button
                onClick={handlePostNote}
                disabled={!newNote.trim()}
                className="h-10 w-10 shrink-0 rounded-lg bg-[#d4af37] text-[#0c0442] flex items-center justify-center hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_10px_rgba(212,175,55,0.2)]"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. LOCKED ROSTER HEADER */}
      <header className="flex justify-between items-end border-b border-white/10 pb-4">
        <div>
          <SectionHeader
            icon={Lock}
            title="Locked Production Roster"
            color="text-[#d4af37]"
          />
          <p className="text-gray-400 text-xs mt-1 tracking-wide pl-1">
            {lockedCount > 0
              ? `${lockedCount} team members confirmed.`
              : "Awaiting signed contracts."}
          </p>
        </div>

        {lockedCount > 0 && (
          <Button
            onClick={handleEmailTeam}
            variant="solid"
            color="#d4af37"
            className="w-auto px-4 py-2 text-[10px]"
          >
            <Mail className="w-3 h-3 mr-2" /> Email All Team
          </Button>
        )}
      </header>

      {/* 3. TRACKING GRID */}
      {lockedCount === 0 ? (
        <div className="bg-white/5 border border-white/10 border-dashed rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-4">
          <AlertCircle className="w-12 h-12 text-gray-600 opacity-50" />
          <div>
            <h4 className="text-gray-300 font-bold uppercase tracking-widest text-sm">
              Roster Empty
            </h4>
            <p className="text-gray-500 text-xs mt-1">
              Visit <strong className="text-[#d4af37]">Contracts Tab</strong> to
              lock Crew.
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

            const filesReceived =
              contractStatus[`${item.key}_files_received`] || false;
            const timeline = getOverdueStatus(filesReceived);
            const isLate = timeline.status === "late";
            const isDone = timeline.status === "complete";

            // Dynamic Button Config
            const btnColor = isLate ? "#ef4444" : "#d4af37";
            const btnVariant = isLate ? "solid" : "ghost";

            return (
              <div
                key={i}
                className={`relative p-5 rounded-xl flex flex-col gap-4 border transition-all duration-300 ${
                  isDone
                    ? "bg-green-900/10 border-green-500/50"
                    : isLate
                    ? "bg-red-900/10 border-red-500/50"
                    : "bg-[#0a0a0a] border-white/10 hover:border-[#d4af37]/30"
                }`}
              >
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {/* Status Dot */}
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          isLate
                            ? "bg-red-500 animate-pulse"
                            : isDone
                            ? "bg-green-500"
                            : "bg-[#d4af37]"
                        }`}
                      />
                      <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400">
                        {item.role}
                      </span>
                    </div>
                    <div className="text-white font-serif font-bold text-lg leading-tight truncate">
                      {name}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <Badge
                    label={timeline.label}
                    color={
                      isLate
                        ? "text-white"
                        : isDone
                        ? "text-[#0c0442]"
                        : "text-gray-400"
                    }
                    bg={
                      isLate
                        ? "bg-red-500"
                        : isDone
                        ? "bg-green-500"
                        : "bg-white/5"
                    }
                    border={
                      isLate
                        ? "border-red-400"
                        : isDone
                        ? "border-green-400"
                        : "border-white/10"
                    }
                  />
                </div>

                {/* File Status Toggle */}
                <div
                  onClick={() => toggleFilesReceived(item.key)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors border ${
                    filesReceived
                      ? "bg-green-500/20 border-green-500/30 text-green-300 hover:bg-green-500/30"
                      : "bg-black/30 border-white/5 text-gray-400 hover:bg-white/5"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                      filesReceived
                        ? "bg-green-500 border-green-500 text-black"
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

                {/* Action Button */}
                <Button
                  onClick={() => (window.location.href = `mailto:${email}`)}
                  variant={btnVariant}
                  color={btnColor}
                  className="w-full mt-auto py-2 text-[10px]"
                >
                  {isLate ? (
                    <AlertTriangle size={12} className="mr-2" />
                  ) : (
                    <Mail size={12} className="mr-2" />
                  )}
                  {isLate ? "Send Late Notice" : "Email Individual"}
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* 🟢 CUSTOM CONFIRMATION MODAL */}
      {pendingStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-[#0c0442] border border-[#d4af37]/30 w-full max-w-sm rounded-xl shadow-[0_0_50px_rgba(212,175,55,0.2)] animate-scale-in p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37] mb-4 border border-[#d4af37]/30">
                <LayoutDashboard size={24} />
              </div>
              <h3 className="text-xl font-serif text-white mb-2">
                Update Status?
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                You are about to move this project to:
              </p>
              <div className="mt-2 px-3 py-1 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded text-[#d4af37] font-bold text-sm uppercase tracking-wider">
                {pendingStep}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => setPendingStep(null)}
                variant="ghost"
                color="#9ca3af"
                className="justify-center"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmStepChange}
                variant="solid"
                color="#d4af37"
                className="justify-center"
              >
                Confirm Update
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionHub;
