import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Mail, Send, Users } from "lucide-react";

export default function CommunicationHub({ project, onUpdate }) {
  const [note, setNote] = useState("");
  const chatEndRef = useRef(null);
  const chatLog = project.project_correspondence || [];

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog]);

  const handleSend = () => {
    if (!note.trim()) return;
    const newEntry = {
      text: note,
      author: "Producer",
      timestamp: new Date().toISOString(),
    };
    const newLog = [...chatLog, newEntry];
    onUpdate({ project_correspondence: newLog });
    setNote("");
  };

  const emailAll = () => {
    // Gather emails
    const emails = [];
    if (project.casting_manifest)
      project.casting_manifest.forEach(
        (r) => r.contract?.email && emails.push(r.contract.email)
      );
    if (project.crew_manifest)
      Object.values(project.crew_manifest).forEach(
        (c) => c.email && emails.push(c.email)
      );

    const uniqueEmails = [...new Set(emails)];
    if (uniqueEmails.length === 0) return alert("No active emails found.");

    window.location.href = `mailto:?bcc=${uniqueEmails.join(
      ","
    )}&subject=Update: ${project.title}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in h-[600px]">
      {/* CHAT AREA */}
      <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/10 rounded-xl flex flex-col overflow-hidden">
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-[#d4af37] font-bold uppercase tracking-widest flex items-center gap-2">
            <MessageSquare size={16} /> Crew Comms
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {chatLog.length === 0 && (
            <div className="text-gray-600 text-xs italic text-center mt-10">
              No messages yet.
            </div>
          )}
          {chatLog.map((msg, i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#d4af37]">
                  {msg.author}
                </span>
                <span className="text-[9px] text-gray-500">
                  {new Date(msg.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="bg-white/5 p-3 rounded-lg text-sm text-gray-300 border border-white/5">
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <div className="p-4 border-t border-white/10 flex gap-2">
          <input
            className="flex-1 bg-black border border-white/10 rounded-lg px-4 text-sm text-white outline-none focus:border-[#d4af37]"
            placeholder="Post update..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="p-3 bg-[#d4af37] text-black rounded-lg hover:bg-white transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* EMAIL BLASTER */}
      <div className="bg-[#0c0442] border border-[#d4af37]/30 rounded-xl p-6 flex flex-col gap-4">
        <h3 className="text-white font-bold uppercase tracking-widest flex items-center gap-2">
          <Mail size={16} /> Email Operations
        </h3>
        <p className="text-xs text-gray-400">
          Send bulk updates to the team. Only sends to members with confirmed
          contracts/emails.
        </p>
        <button
          onClick={emailAll}
          className="w-full py-3 bg-[#d4af37] text-black font-bold uppercase text-xs rounded-lg flex items-center justify-center gap-2 hover:bg-white transition-colors"
        >
          <Users size={16} /> Email All Active
        </button>
      </div>
    </div>
  );
}
