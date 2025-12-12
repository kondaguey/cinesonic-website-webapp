import React, { useState, useEffect } from "react";
import {
  Search,
  Edit2,
  Trash2,
  UserPlus,
  XCircle,
  Save,
  Loader2,
  Copy,
  Mail,
  Image as ImageIcon,
  Mic,
  FileText,
  BookOpen,
  AlertTriangle,
  GraduationCap,
  StickyNote,
  DollarSign,
  Briefcase,
  Quote,
  UploadCloud,
  CheckCircle,
  Plus,
  ArrowRight,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// 🟢 INITIALIZE SUPABASE
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function TalentManager({ data, onBack }) {
  // UI STATE
  const [filter, setFilter] = useState("");
  const [localData, setLocalData] = useState(data || []);
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState({
    headshot: false,
    demo: false,
    resume: false,
  });

  // MODAL STATES
  const [editingActor, setEditingActor] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [assignActor, setAssignActor] = useState(null); // For Casting Modal

  // DATA LISTS STATE
  const [lists, setLists] = useState({ genres: [], voices: [], ages: [] });
  const [projects, setProjects] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);

  // CASTING SELECTION STATE
  const [selectedProjId, setSelectedProjId] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState("");

  // 🟢 1. FETCH LISTS & PROJECTS ON LOAD
  useEffect(() => {
    const fetchData = async () => {
      // Fetch Lists
      const { data: listData } = await supabase.from("lists_db").select("*");
      if (listData) {
        setLists({
          genres: [...new Set(listData.map((d) => d.genre).filter(Boolean))],
          voices: [
            ...new Set(listData.map((d) => d.voice_type).filter(Boolean)),
          ],
          ages: [...new Set(listData.map((d) => d.age_range).filter(Boolean))],
        });
      }

      // Fetch Projects (Active Only)
      const { data: projData } = await supabase
        .from("production_db")
        .select("project_id, title, status")
        .neq("status", "COMPLETE")
        .neq("status", "CANCELLED");

      if (projData) setProjects(projData);

      // Fetch Open Roles
      const { data: roleData } = await supabase.from("casting_db").select("*");
      if (roleData) setAvailableRoles(roleData);
    };
    fetchData();
  }, []);

  // --- FILTERING ---
  const filteredData = localData.filter((actor) => {
    const search = filter.toLowerCase().trim();
    if (!search) return true;
    if (search === "active" || search === "on hiatus")
      return (actor.status || "").toLowerCase() === search;
    return (
      (actor.name || "").toLowerCase().includes(search) ||
      (actor.email || "").toLowerCase().includes(search) ||
      (actor.triggers || "").toLowerCase().includes(search)
    );
  });

  // --- UPDATE ACTOR ---
  const handleUpdate = async () => {
    if (!editingActor) return;
    setIsSaving(true);

    try {
      const payload = {
        name: editingActor.name,
        email: editingActor.email,
        status: editingActor.status,
        pfh_rate: editingActor.rate,
        union_status: editingActor.sag,
        age_range: editingActor.age_range,
        voice_type: editingActor.voice,
        genres: editingActor.genres,
        triggers: editingActor.triggers,
        training_notes: editingActor.training,
        other_notes: editingActor.notes,
        audiobooks_narrated: editingActor.audiobooks,
        bio: editingActor.bio,
        // URLs are updated via file handler immediately, but good to ensure sync
        headshot_url: editingActor.headshot,
        demo_url: editingActor.demo,
        resume_url: editingActor.resume,
      };

      const { error } = await supabase
        .from("actor_db")
        .update(payload)
        .eq("actor_id", editingActor.id);
      if (error) throw error;

      setLocalData((prev) =>
        prev.map((a) => (a.id === editingActor.id ? editingActor : a))
      );
      setEditingActor(null);
    } catch (err) {
      alert("Update Failed: " + err.message);
    }
    setIsSaving(false);
  };

  // --- FILE UPLOAD HANDLER (INSIDE EDIT) ---
  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file || !editingActor) return;

    setUploading((prev) => ({ ...prev, [type]: true }));

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${type}s/${Date.now()}-${editingActor.id}.${fileExt}`;

      const { error: upError } = await supabase.storage
        .from("roster-assets")
        .upload(fileName, file);
      if (upError) throw upError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("roster-assets").getPublicUrl(fileName);

      // Update State Immediately so they see it
      setEditingActor((prev) => ({ ...prev, [type]: publicUrl }));

      // We will save this to DB when they click "Save Changes", OR we can save instantly.
      // Let's save instantly to be safe.
      const colMap = {
        headshot: "headshot_url",
        demo: "demo_url",
        resume: "resume_url",
      };
      await supabase
        .from("actor_db")
        .update({ [colMap[type]]: publicUrl })
        .eq("actor_id", editingActor.id);
    } catch (err) {
      alert("Upload Error: " + err.message);
    }
    setUploading((prev) => ({ ...prev, [type]: false }));
  };

  // --- HELPER: APPEND TAG ---
  const addTag = (field, value) => {
    if (!value) return;
    const current = editingActor[field] || "";

    // 🟢 NEW: Check if we already have 2 items
    const currentCount = current ? current.split(",").length : 0;
    if (currentCount >= 2) return;

    // Avoid duplicates
    if (current.includes(value)) return;
    const newValue = current ? `${current}, ${value}` : value;
    setEditingActor({ ...editingActor, [field]: newValue });
  };

  // --- CASTING: ASSIGN TO PROJECT ---
  const handleConfirmAssignment = async () => {
    if (!selectedProjId || !selectedRoleId || !assignActor) return;
    setIsSaving(true);

    try {
      // Update casting_db
      const { error } = await supabase
        .from("casting_db")
        .update({ assigned_actor: assignActor.name, status: "Booked" }) // You can also store ID if you prefer
        .eq("role_id", selectedRoleId);

      if (error) throw error;

      alert(`Successfully assigned ${assignActor.name}!`);
      setAssignActor(null);
      setSelectedProjId("");
      setSelectedRoleId("");
    } catch (err) {
      alert("Assignment Failed: " + err.message);
    }
    setIsSaving(false);
  };

  // --- ADD TALENT ---
  const handleAddTalent = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.target);
    const newId = "ACT-" + Math.floor(1000 + Math.random() * 9000);

    try {
      const { error } = await supabase.from("actor_db").insert([
        {
          name: formData.get("name"),
          email: formData.get("email"),
          bio: formData.get("bio"),
          actor_id: newId,
          status: "Active",
          pfh_rate: 0,
          union_status: "Non-Union",
        },
      ]);

      if (error) throw error;

      // Reload page or update local state
      setLocalData([
        {
          name: formData.get("name"),
          email: formData.get("email"),
          id: newId,
          status: "Active",
        },
        ...localData,
      ]);
      setShowAddModal(false);
      alert(`Talent Added!\nAccess Key: ${newId}`);
    } catch (err) {
      alert("Error: " + err.message);
    }
    setIsSaving(false);
  };

  return (
    <div className="max-w-[1800px] mx-auto pb-20 animate-fade-in px-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <button
            onClick={onBack}
            className="text-xs text-gray-500 hover:text-gold uppercase tracking-widest mb-2 flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-serif text-white">Talent Command</h1>
          <p className="text-gray-400 text-xs mt-1">
            Full roster database & casting assignments.
          </p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative group flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-gold transition-colors" />
            <input
              type="text"
              placeholder="Search talent..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:border-gold outline-none transition-all"
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gold hover:bg-gold-light text-midnight font-bold px-4 py-2 rounded-lg flex items-center gap-2 text-xs uppercase tracking-widest shadow-lg shadow-gold/10 whitespace-nowrap"
          >
            <UserPlus size={16} /> Add Talent
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-midnight border border-white/10 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1400px]">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-[10px] uppercase tracking-widest text-gold font-bold whitespace-nowrap">
                <th className="p-4 w-64 sticky left-0 bg-[#0c0c1d] z-20">
                  Talent
                </th>
                <th className="p-4 w-32">Status</th>
                <th className="p-4 w-48">Production Data</th>
                <th className="p-4 w-40">Assets</th>
                <th className="p-4 w-64">Triggers (Off-Limits)</th>
                <th className="p-4 w-64">Training / Notes</th>
                <th className="p-4 w-32 text-right sticky right-0 bg-[#0c0c1d] z-20">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredData.map((actor) => (
                <tr key={actor.id} className="border-b border-white/5">
                  <td className="p-4 sticky left-0 bg-[#0a0a1a] group-hover:bg-[#111122] transition-colors z-20">
                    <div className="flex items-center gap-3">
                      {actor.headshot ? (
                        <img
                          src={actor.headshot}
                          className="w-10 h-10 rounded-full object-cover border border-white/10"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-gray-500">
                          {actor.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-white text-sm whitespace-nowrap">
                          {actor.name}
                        </div>
                        <div className="text-[10px] text-gray-500 font-mono flex items-center gap-2 mt-1">
                          <span className="bg-black/30 px-1 rounded text-gray-300">
                            {actor.id}
                          </span>
                          <button
                            onClick={() =>
                              navigator.clipboard.writeText(actor.id)
                            }
                            className="opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-opacity"
                            title="Copy Key"
                          >
                            <Copy size={10} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-[9px] font-bold uppercase border whitespace-nowrap ${
                        actor.status === "Active"
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : actor.status === "On Hiatus"
                          ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}
                    >
                      {actor.status}
                    </span>
                  </td>
                  <td className="p-4 space-y-1 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-xs text-white">
                      <Briefcase size={12} className="text-gray-500" />{" "}
                      {actor.sag || "Non-Union"}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gold font-mono">
                      <DollarSign size={10} />{" "}
                      {actor.rate ? `${actor.rate} PFH` : "TBD"}
                    </div>
                    {actor.audiobooks && (
                      <div className="flex items-center gap-2 text-[10px] text-gray-500">
                        <BookOpen size={10} /> {actor.audiobooks} Books
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <a
                        href={actor.headshot || "#"}
                        target="_blank"
                        className={`p-1.5 rounded border transition-colors ${
                          actor.headshot
                            ? "border-green-500/30 text-green-400 hover:bg-green-500/10"
                            : "border-white/5 text-gray-600 cursor-not-allowed opacity-30"
                        }`}
                        title="Headshot"
                      >
                        <ImageIcon size={14} />
                      </a>
                      <a
                        href={actor.demo || "#"}
                        target="_blank"
                        className={`p-1.5 rounded border transition-colors ${
                          actor.demo
                            ? "border-green-500/30 text-green-400 hover:bg-green-500/10"
                            : "border-white/5 text-gray-600 cursor-not-allowed opacity-30"
                        }`}
                        title="Demo"
                      >
                        <Mic size={14} />
                      </a>
                      <a
                        href={actor.resume || "#"}
                        target="_blank"
                        className={`p-1.5 rounded border transition-colors ${
                          actor.resume
                            ? "border-green-500/30 text-green-400 hover:bg-green-500/10"
                            : "border-white/5 text-gray-600 cursor-not-allowed opacity-30"
                        }`}
                        title="Resume"
                      >
                        <FileText size={14} />
                      </a>
                    </div>
                  </td>
                  <td className="p-4">
                    {actor.triggers ? (
                      <div className="flex flex-wrap gap-1 max-h-12 overflow-hidden">
                        {actor.triggers
                          .split(",")
                          .slice(0, 3)
                          .map((t, i) => (
                            <span
                              key={i}
                              className="text-[9px] bg-red-500/10 text-red-300 border border-red-500/20 px-1.5 py-0.5 rounded whitespace-nowrap"
                            >
                              {t.trim()}
                            </span>
                          ))}
                      </div>
                    ) : (
                      <span className="text-gray-600 text-[10px] italic">
                        -
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="text-[10px] text-gray-400 line-clamp-2 w-48 leading-relaxed">
                      {actor.training || actor.notes || (
                        <span className="opacity-30">No notes.</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right sticky right-0 bg-[#0a0a1a] group-hover:bg-[#111122] transition-colors z-20">
                    <div className="flex justify-end gap-2">
                      {/* CASTING BUTTON */}
                      <button
                        onClick={() => setAssignActor(actor)}
                        className="p-2 hover:bg-gold hover:text-midnight text-gold border border-gold/30 rounded transition-colors shadow-[0_0_10px_rgba(212,175,55,0.1)]"
                        title="Assign to Project"
                      >
                        <UserPlus size={14} />
                      </button>
                      <button
                        onClick={() => setEditingActor(actor)}
                        className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
                        title="Edit Full Profile"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(actor.id)}
                        className="p-2 hover:bg-red-500/10 rounded text-gray-600 hover:text-red-400 transition-colors"
                        title="Delete Actor"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🟢 FULL EDIT MODAL WITH UPLOADS & DROPDOWNS */}
      {editingActor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-midnight border border-gold/30 w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden animate-scale-in max-h-[90vh] flex flex-col">
            <div className="bg-black/40 p-5 border-b border-gold/10 flex justify-between items-center shrink-0">
              <h3 className="text-gold font-serif text-lg">
                Edit Talent: {editingActor.name}
              </h3>
              <button
                onClick={() => setEditingActor(null)}
                className="text-gray-400 hover:text-white"
              >
                <XCircle size={20} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
              {/* 🟢 ROW 1: MEDIA UPLOADS */}
              <div className="grid grid-cols-3 gap-6">
                {["headshot", "demo", "resume"].map((type) => (
                  <div
                    key={type}
                    className="relative group bg-white/5 border border-white/10 hover:border-gold/30 rounded-lg p-4 flex flex-col items-center justify-center text-center h-32 transition-all"
                  >
                    {uploading[type] ? (
                      <Loader2 className="animate-spin text-gold" />
                    ) : (
                      <>
                        {editingActor[type] ? (
                          <div className="flex flex-col items-center gap-2">
                            <CheckCircle className="text-green-400 w-6 h-6" />
                            <span className="text-[10px] text-gray-400 uppercase">
                              Current {type}
                            </span>
                            <a
                              href={editingActor[type]}
                              target="_blank"
                              className="text-[9px] text-gold hover:underline"
                            >
                              View
                            </a>
                          </div>
                        ) : (
                          <div className="text-gray-600 group-hover:text-gold transition-colors">
                            <UploadCloud className="w-8 h-8 mb-2 mx-auto" />
                            <span className="text-[10px] uppercase">
                              Upload {type}
                            </span>
                          </div>
                        )}
                        <input
                          type="file"
                          onChange={(e) => handleFileUpload(e, type)}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* ROW 2: BASIC INFO */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">
                    Name
                  </label>
                  <input
                    value={editingActor.name}
                    onChange={(e) =>
                      setEditingActor({ ...editingActor, name: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-gold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">
                    Email
                  </label>
                  <input
                    value={editingActor.email}
                    onChange={(e) =>
                      setEditingActor({
                        ...editingActor,
                        email: e.target.value,
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-gold outline-none"
                  />
                </div>
              </div>

              {/* ROW 3: SPECS (WITH DROPDOWN HELPERS) */}
              <div className="grid grid-cols-3 gap-6">
                {/* Age */}
                <div className="relative">
                  <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">
                    Age Ranges
                  </label>
                  <input
                    value={editingActor.age_range || ""}
                    onChange={(e) =>
                      setEditingActor({
                        ...editingActor,
                        age_range: e.target.value,
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded p-3 pr-8 text-white focus:border-gold outline-none text-xs"
                  />
                  <select
                    onChange={(e) => addTag("age_range", e.target.value)}
                    className="absolute right-1 top-7 w-6 h-6 opacity-0 cursor-pointer"
                  >
                    <option value="">Add...</option>
                    {lists.ages.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                  <Plus className="absolute right-3 top-9 w-3 h-3 text-gray-500 pointer-events-none" />
                </div>
                {/* Voice */}
                <div className="relative">
                  <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">
                    Voice Types
                  </label>
                  <input
                    value={
                      Array.isArray(editingActor.voice)
                        ? editingActor.voice.join(", ")
                        : editingActor.voice || ""
                    }
                    onChange={(e) =>
                      setEditingActor({
                        ...editingActor,
                        voice: e.target.value,
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-gold outline-none text-xs"
                  />
                  <select
                    onChange={(e) => addTag("voice", e.target.value)}
                    className="absolute right-1 top-7 w-6 h-6 opacity-0 cursor-pointer"
                  >
                    <option value="">Add...</option>
                    {lists.voices.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                  <Plus className="absolute right-3 top-9 w-3 h-3 text-gray-500 pointer-events-none" />
                </div>
                {/* Genre */}
                <div className="relative">
                  <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">
                    Genres
                  </label>
                  <input
                    value={
                      Array.isArray(editingActor.genres)
                        ? editingActor.genres.join(", ")
                        : editingActor.genres || ""
                    }
                    onChange={(e) =>
                      setEditingActor({
                        ...editingActor,
                        genres: e.target.value,
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-gold outline-none text-xs"
                  />
                  <select
                    onChange={(e) => addTag("genres", e.target.value)}
                    className="absolute right-1 top-7 w-6 h-6 opacity-0 cursor-pointer"
                  >
                    <option value="">Add...</option>
                    {lists.genres.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                  <Plus className="absolute right-3 top-9 w-3 h-3 text-gray-500 pointer-events-none" />
                </div>
              </div>

              {/* ROW 4: PRODUCTION */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">
                    Status
                  </label>
                  <select
                    value={editingActor.status}
                    onChange={(e) =>
                      setEditingActor({
                        ...editingActor,
                        status: e.target.value,
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-gold outline-none [&>option]:bg-midnight"
                  >
                    <option>Active</option>
                    <option>On Hiatus</option>
                    <option>Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">
                    Rate (PFH)
                  </label>
                  <input
                    type="number"
                    value={editingActor.rate}
                    onChange={(e) =>
                      setEditingActor({ ...editingActor, rate: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-gold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">
                    Union Status
                  </label>
                  <select
                    value={editingActor.sag}
                    onChange={(e) =>
                      setEditingActor({ ...editingActor, sag: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-gold outline-none [&>option]:bg-midnight"
                  >
                    <option>Non-Union</option>
                    <option>SAG-Eligible</option>
                    <option>SAG-AFTRA</option>
                    <option>Fi-Core</option>
                  </select>
                </div>
              </div>

              {/* ROW 5: TEXT AREAS */}
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-red-400 uppercase font-bold mb-1 block">
                    Triggers
                  </label>
                  <textarea
                    rows={1}
                    value={editingActor.triggers || ""}
                    onChange={(e) =>
                      setEditingActor({
                        ...editingActor,
                        triggers: e.target.value,
                      })
                    }
                    className="w-full bg-red-900/10 border border-red-500/20 rounded p-3 text-red-200 focus:border-red-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-blue-400 uppercase font-bold mb-1 block">
                    Training
                  </label>
                  <textarea
                    rows={2}
                    value={editingActor.training || ""}
                    onChange={(e) =>
                      setEditingActor({
                        ...editingActor,
                        training: e.target.value,
                      })
                    }
                    className="w-full bg-blue-900/10 border border-blue-500/20 rounded p-3 text-blue-200 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">
                    Public Bio (Max 300)
                  </label>
                  <textarea
                    rows={3}
                    maxLength={300}
                    value={editingActor.bio || ""}
                    onChange={(e) =>
                      setEditingActor({ ...editingActor, bio: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-gold outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-5 bg-black/20 border-t border-gold/10 flex justify-end gap-3 shrink-0">
              <button
                onClick={() => setEditingActor(null)}
                className="px-4 py-2 text-gray-400 hover:text-white text-xs uppercase"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={isSaving}
                className="bg-gold hover:bg-gold-light text-midnight font-bold px-6 py-2 rounded text-xs uppercase tracking-widest flex items-center gap-2"
              >
                {isSaving ? (
                  <Loader2 className="animate-spin" size={14} />
                ) : (
                  <Save size={14} />
                )}{" "}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🟢 CASTING ASSIGNMENT MODAL */}
      {assignActor && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-midnight border border-gold/50 w-full max-w-md rounded-xl shadow-[0_0_50px_rgba(212,175,55,0.2)] animate-scale-in">
            <div className="bg-black/40 p-6 border-b border-gold/20">
              <h3 className="text-xl font-serif text-gold mb-1">
                Assign to Project
              </h3>
              <p className="text-xs text-gray-400">
                Casting{" "}
                <strong className="text-white">{assignActor.name}</strong>
              </p>
            </div>
            <div className="p-6 space-y-6">
              {/* 1. SELECT PROJECT */}
              <div>
                <label className="text-[10px] text-gray-500 uppercase font-bold mb-2 block">
                  Select Active Project
                </label>
                <select
                  className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-gold outline-none [&>option]:bg-midnight"
                  onChange={(e) => setSelectedProjId(e.target.value)}
                  value={selectedProjId}
                >
                  <option value="" disabled>
                    Choose Project...
                  </option>
                  {projects.map((p) => (
                    <option key={p.project_id} value={p.project_id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. SELECT ROLE (FILTERED) */}
              <div>
                <label className="text-[10px] text-gray-500 uppercase font-bold mb-2 block">
                  Select Open Role
                </label>
                <select
                  className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-gold outline-none [&>option]:bg-midnight disabled:opacity-50"
                  disabled={!selectedProjId}
                  onChange={(e) => setSelectedRoleId(e.target.value)}
                  value={selectedRoleId}
                >
                  <option value="" disabled>
                    Choose Role...
                  </option>
                  {availableRoles
                    .filter((r) => r.project_id === selectedProjId)
                    .map((r) => (
                      <option key={r.role_id} value={r.role_id}>
                        {r.role_name} ({r.gender}) -{" "}
                        {r.assigned_actor ? "(Occupied)" : "OPEN"}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="p-6 bg-black/20 border-t border-gold/10 flex justify-end gap-3">
              <button
                onClick={() => setAssignActor(null)}
                className="px-4 py-2 text-gray-400 hover:text-white text-xs uppercase"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAssignment}
                disabled={!selectedRoleId || isSaving}
                className="bg-gold hover:bg-gold-light text-midnight font-bold px-6 py-2 rounded text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 className="animate-spin" size={14} />
                ) : (
                  <ArrowRight size={14} />
                )}{" "}
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <form
            onSubmit={handleAddTalent}
            className="bg-midnight border border-gold/30 w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-scale-in"
          >
            <div className="bg-black/40 p-5 border-b border-gold/10">
              <h3 className="text-gold font-serif text-lg">
                Onboard New Talent
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">
                  Full Name
                </label>
                <input
                  name="name"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-gold outline-none"
                  placeholder="Actor Name"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-gold outline-none"
                  placeholder="actor@email.com"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">
                  Initial Bio (Max 300)
                </label>
                <textarea
                  name="bio"
                  maxLength={300}
                  className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-gold outline-none resize-none"
                  placeholder="Short intro..."
                  rows={3}
                />
              </div>
            </div>
            <div className="p-5 bg-black/20 border-t border-gold/10 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white text-xs uppercase"
              >
                Cancel
              </button>
              <button
                disabled={isSaving}
                className="bg-gold hover:bg-gold-light text-midnight font-bold px-6 py-2 rounded text-xs uppercase tracking-widest flex items-center gap-2"
              >
                {isSaving ? (
                  <Loader2 className="animate-spin" size={14} />
                ) : (
                  <UserPlus size={14} />
                )}{" "}
                Create Profile
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
