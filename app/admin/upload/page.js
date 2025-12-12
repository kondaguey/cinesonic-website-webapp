"use client";
import React, { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Upload,
  Mic,
  Image as ImageIcon,
  Save,
  CheckCircle,
  Loader2,
  Move,
  ZoomIn,
  ZoomOut,
  AlertCircle,
  Search,
  RotateCcw,
} from "lucide-react";

// 🟢 CONFIGURATION
const MIN_BIO = 50;
const MAX_BIO = 350;

// 🟢 INITIALIZE SUPABASE
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminUpload() {
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  // 🟢 SEARCH STATE
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [editMode, setEditMode] = useState(false); // Are we editing?
  const [actorId, setActorId] = useState(null); // The Supabase ID (if editing)

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    tags: "",
  });

  // FILE STATE
  const [headshot, setHeadshot] = useState(null);
  const [demo, setDemo] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [existingHeadshot, setExistingHeadshot] = useState(null); // For display in edit mode

  // DRAG STATE
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const imageRef = useRef(null);

  // Event Listeners for Drag
  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    if (isDragging) {
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("mouseleave", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseleave", handleMouseUp);
    };
  }, [isDragging]);

  // 🟢 SEARCH HANDLER
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);

    try {
      // Search by Name OR Actor ID
      const { data, error } = await supabase
        .from("actor_db")
        .select("*")
        .or(`name.ilike.%${searchQuery}%,actor_id.eq.${searchQuery}`)
        .limit(1)
        .single();

      if (error || !data) {
        alert("Actor not found. Try exact ID or Name.");
      } else {
        // LOAD DATA INTO FORM
        setEditMode(true);
        setActorId(data.actor_id); // Keep the ID safe
        setFormData({
          name: data.name,
          bio: data.bio || "",
          tags: Array.isArray(data.voice_type)
            ? data.voice_type.join(", ")
            : data.voice_type || "",
        });
        setExistingHeadshot(data.headshot_url); // Show current image
        setPreviewImage(data.headshot_url); // Put current image in cropper (as reference)
      }
    } catch (err) {
      console.error(err);
      alert("Search failed.");
    }
    setIsSearching(false);
  };

  // RESET FORM (Back to Add Mode)
  const resetForm = () => {
    setEditMode(false);
    setActorId(null);
    setFormData({ name: "", bio: "", tags: "" });
    setHeadshot(null);
    setDemo(null);
    setPreviewImage(null);
    setExistingHeadshot(null);
    setSearchQuery("");
    setPosition({ x: 0, y: 0 });
    setScale(1);
  };

  // --- HANDLERS ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHeadshot(file);
      setPreviewImage(URL.createObjectURL(file));
      setPosition({ x: 0, y: 0 });
      setScale(1);
    }
  };

  const handleDemoChange = (e) => {
    const file = e.target.files[0];
    if (file) setDemo(file);
  };

  const onMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const generateCroppedImage = async () => {
    if (!imageRef.current || !headshot) return null; // Only crop if NEW file
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 600;
    canvas.height = 800;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const img = imageRef.current;
    const renderRatio = canvas.width / 320;

    ctx.drawImage(
      img,
      position.x * renderRatio,
      position.y * renderRatio,
      img.width * scale * renderRatio,
      img.height * scale * renderRatio
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(new File([blob], headshot.name, { type: "image/jpeg" }));
        },
        "image/jpeg",
        0.95
      );
    });
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (formData.bio.length < MIN_BIO) {
      return alert(
        `Bio is too short! Please write at least ${MIN_BIO} characters.`
      );
    }

    if (!formData.name) {
      return alert("Name is required.");
    }

    // In Edit Mode, image is optional. In Add Mode, it's required.
    if (!editMode && !headshot) {
      return alert("Headshot is required for new profiles.");
    }

    setUploading(true);

    try {
      // 1. Determine ID (New or Existing)
      const targetId = editMode
        ? actorId
        : "ACT-" + Math.floor(1000 + Math.random() * 9000);

      // 2. Process Image (Only if changed)
      let publicImgUrl = existingHeadshot;
      if (headshot) {
        const finalImageFile = await generateCroppedImage();
        const imageFileName = `headshots/${Date.now()}-${targetId}.jpg`;

        const { error: imgError } = await supabase.storage
          .from("roster-assets")
          .upload(imageFileName, finalImageFile);

        if (imgError) throw imgError;

        const { data } = supabase.storage
          .from("roster-assets")
          .getPublicUrl(imageFileName);
        publicImgUrl = data.publicUrl;
      }

      // 3. Process Demo (Only if changed)
      let publicDemoUrl = null; // Don't overwrite unless we have logic to keep old one

      // If editing, first fetch current demo url to preserve it if not changing
      if (editMode && !demo) {
        // We essentially "keep" the old one by not updating that column,
        // OR we fetch it first.
        // Simplest way for update: Construct payload dynamically.
      }

      if (demo) {
        const demoFileName = `demos/${Date.now()}-${targetId}.mp3`;
        const { error: demoError } = await supabase.storage
          .from("roster-assets")
          .upload(demoFileName, demo);

        if (demoError) throw demoError;

        const { data } = supabase.storage
          .from("roster-assets")
          .getPublicUrl(demoFileName);
        publicDemoUrl = data.publicUrl;
      }

      // 4. Construct Payload
      const voiceTags = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t);

      const dbPayload = {
        name: formData.name,
        bio: formData.bio,
        voice_type: voiceTags,
        headshot_url: publicImgUrl,
        // Only update demo_url if a new one was uploaded
        ...(publicDemoUrl && { demo_url: publicDemoUrl }),
        // Defaults for new records
        ...(!editMode && {
          actor_id: targetId,
          status: "Active",
          union_status: "Non-Union",
          pfh_rate: 0,
        }),
      };

      // 5. Database Action
      let dbError;
      if (editMode) {
        // UPDATE
        const { error } = await supabase
          .from("actor_db")
          .update(dbPayload)
          .eq("actor_id", targetId);
        dbError = error;
      } else {
        // INSERT
        const { error } = await supabase.from("actor_db").insert([dbPayload]);
        dbError = error;
      }

      if (dbError) throw dbError;

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        if (!editMode) resetForm(); // Clear only if it was a new add
        setUploading(false);
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      alert("Action failed: " + error.message);
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050510] text-white p-8 flex items-center justify-center font-sans">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* LEFT: FORM */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl shadow-xl order-2 lg:order-1 relative">
          {/* 🟢 TOP SEARCH BAR */}
          <div className="absolute -top-14 left-0 w-full flex gap-2 px-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-gold outline-none"
                placeholder="Search Name or ID to Edit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-white/10 hover:bg-gold hover:text-midnight px-4 rounded-lg font-bold transition-colors"
            >
              {isSearching ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                "Load"
              )}
            </button>
            {editMode && (
              <button
                onClick={resetForm}
                className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-4 rounded-lg flex items-center gap-2 font-bold transition-colors"
              >
                <RotateCcw size={16} /> New
              </button>
            )}
          </div>

          <h2 className="text-2xl font-serif font-bold text-gold mb-6 flex items-center gap-2">
            {editMode ? (
              <span className="text-blue-400 flex items-center gap-2">
                <Upload className="w-6 h-6" /> Editing: {formData.name}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Upload className="w-6 h-6" /> Add New Talent
              </span>
            )}
          </h2>

          <form onSubmit={handleUpload} className="space-y-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">
                Name
              </label>
              <input
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none"
                placeholder="e.g. Elena Vance"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">
                Voice Tags (Separated by commas)
              </label>
              <input
                value={formData.tags || ""}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none"
                placeholder="e.g. Warm, Fiction, British"
              />
            </div>

            {/* BIO */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 block">
                  Bio
                </label>
                <span
                  className={`text-[10px] font-mono ${
                    formData.bio.length < MIN_BIO
                      ? "text-red-400 animate-pulse"
                      : "text-green-400"
                  }`}
                >
                  {formData.bio.length} / {MAX_BIO}
                </span>
              </div>
              <textarea
                value={formData.bio || ""}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                maxLength={MAX_BIO}
                className={`w-full h-32 bg-black/40 border rounded-lg p-3 text-white focus:border-gold outline-none resize-none transition-colors ${
                  formData.bio.length > 0 && formData.bio.length < MIN_BIO
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-white/10"
                }`}
                placeholder={`Brief marketing bio (Min ${MIN_BIO} chars)...`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <div
                  className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center h-32 ${
                    headshot
                      ? "border-green-500 bg-green-500/10"
                      : "border-white/20 hover:border-gold/50"
                  }`}
                >
                  <ImageIcon className="w-8 h-8 text-gray-500 mb-2" />
                  <span className="text-xs text-gray-500 font-bold uppercase text-center">
                    {headshot
                      ? "New Image Selected"
                      : editMode
                      ? "Keep Current Image"
                      : "Select Image"}
                  </span>
                  {editMode && !headshot && (
                    <span className="text-[9px] text-gray-500 mt-1">
                      (Click to replace)
                    </span>
                  )}
                </div>
              </div>

              <div className="relative group">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleDemoChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <div
                  className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center h-32 ${
                    demo
                      ? "border-green-500 bg-green-500/10"
                      : "border-white/20 hover:border-gold/50"
                  }`}
                >
                  <Mic className="w-8 h-8 text-gray-500 mb-2" />
                  <span className="text-xs text-gray-500 font-bold uppercase text-center">
                    {demo
                      ? "New Audio Selected"
                      : editMode
                      ? "Keep Current Audio"
                      : "Select Audio"}
                  </span>
                  {editMode && !demo && (
                    <span className="text-[9px] text-gray-500 mt-1">
                      (Click to replace)
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              disabled={uploading || success || formData.bio.length < MIN_BIO}
              className={`w-full py-4 rounded-lg font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                success
                  ? "bg-green-500 text-midnight"
                  : "bg-gold hover:bg-white text-midnight"
              }`}
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" />{" "}
                  {editMode ? "Updating Profile..." : "Creating Profile..."}
                </>
              ) : success ? (
                "Saved Successfully!"
              ) : (
                <>
                  <Save className="w-4 h-4" />{" "}
                  {editMode ? "Update Roster" : "Publish to Roster"}
                </>
              )}
            </button>
          </form>
        </div>

        {/* RIGHT: PREVIEW */}
        <div className="flex flex-col items-center justify-start order-1 lg:order-2 pt-10">
          {/* Info Badge */}
          {editMode && (
            <div className="bg-blue-500/10 border border-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-xs font-bold mb-4 animate-fade-in">
              Editing Mode Active
            </div>
          )}

          <div className="w-80 relative group select-none">
            {/* If we are dragging a NEW image, allow crop controls. If just viewing old one, lock it. */}
            <div
              className={`aspect-[3/4] overflow-hidden rounded-xl border-2 border-gold/50 relative shadow-2xl bg-black ${
                headshot ? "cursor-move" : ""
              }`}
              onMouseDown={headshot ? onMouseDown : null}
              onMouseMove={headshot ? onMouseMove : null}
              style={{
                cursor: isDragging ? "grabbing" : headshot ? "grab" : "default",
              }}
            >
              {previewImage ? (
                <img
                  ref={imageRef}
                  src={previewImage}
                  alt="Preview"
                  draggable="false"
                  className={
                    headshot
                      ? "max-w-none absolute origin-top-left"
                      : "w-full h-full object-cover"
                  }
                  style={
                    headshot
                      ? {
                          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                          width: "100%",
                        }
                      : {}
                  }
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-700 bg-white/5">
                  <div className="text-center">
                    <ImageIcon className="w-12 h-12 opacity-20 mx-auto mb-2" />
                    <div className="text-[10px] uppercase opacity-40">
                      No Image Selected
                    </div>
                  </div>
                </div>
              )}
              {/* OVERLAY */}
              <div className="absolute inset-0 border-[10px] border-black/10 pointer-events-none z-20"></div>
              <div className="absolute bottom-0 left-0 w-full p-4 z-20 pointer-events-none bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-2xl font-serif font-bold text-white mb-1">
                  {formData.name || "Actor Name"}
                </h3>
                <div className="flex gap-1 flex-wrap">
                  {formData.tags ? (
                    formData.tags
                      .split(",")
                      .slice(0, 3)
                      .map(
                        (t, i) =>
                          t.trim() && (
                            <span
                              key={i}
                              className="text-[9px] uppercase tracking-widest bg-gold/20 text-gold px-2 py-1 rounded border border-gold/10"
                            >
                              {t.trim()}
                            </span>
                          )
                      )
                  ) : (
                    <span className="text-[9px] uppercase tracking-widest bg-white/5 text-gray-500 px-2 py-1 rounded border border-white/5">
                      Tag
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ZOOM CONTROLS (Only for NEW images) */}
          {headshot && (
            <div className="mt-6 flex items-center gap-4 bg-white/5 p-2 rounded-full border border-white/10 animate-fade-in">
              <button
                onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}
                className="p-2 hover:text-gold"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono w-12 text-center text-gray-400">
                {(scale * 100).toFixed(0)}%
              </span>
              <button
                onClick={() => setScale((s) => Math.min(3, s + 0.1))}
                className="p-2 hover:text-gold"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          )}

          {!headshot && editMode && (
            <p className="mt-4 text-[10px] text-gray-500 uppercase tracking-widest">
              Showing Current Headshot
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
