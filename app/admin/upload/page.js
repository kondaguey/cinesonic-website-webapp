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
} from "lucide-react";

// 🟢 CONFIGURATION
const MIN_BIO = 200;
const MAX_BIO = 350;

// 🟢 INITIALIZE SUPABASE
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminUpload() {
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    tags: "",
  });

  // FILE STATE
  const [headshot, setHeadshot] = useState(null);
  const [demo, setDemo] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

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
    if (!imageRef.current) return null;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // High Res Output (3:4 Ratio)
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

    // 🟢 VALIDATION: Check Bio Length
    if (formData.bio.length < MIN_BIO) {
      return alert(
        `Bio is too short! Please write at least ${MIN_BIO} characters.`
      );
    }

    if (!formData.name || !headshot)
      return alert("Name and Headshot are required.");

    setUploading(true);

    try {
      const finalImageFile = await generateCroppedImage();

      // 1. Upload Image
      const imageFileName = `headshots/${Date.now()}-${finalImageFile.name}`;
      const { error: imgError } = await supabase.storage
        .from("roster-assets")
        .upload(imageFileName, finalImageFile);
      if (imgError) throw imgError;
      const {
        data: { publicUrl: publicImgUrl },
      } = supabase.storage.from("roster-assets").getPublicUrl(imageFileName);

      // 2. Upload Demo
      let publicDemoUrl = null;
      if (demo) {
        const demoFileName = `demos/${Date.now()}-${demo.name}`;
        const { error: demoError } = await supabase.storage
          .from("roster-assets")
          .upload(demoFileName, demo);
        if (demoError) throw demoError;
        const {
          data: { publicUrl },
        } = supabase.storage.from("roster-assets").getPublicUrl(demoFileName);
        publicDemoUrl = publicUrl;
      }

      // 3. Save to DB
      const { error: dbError } = await supabase.from("actors").insert([
        {
          name: formData.name,
          bio: formData.bio,
          tags: formData.tags
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t),
          image_url: publicImgUrl,
          demo_url: publicDemoUrl,
        },
      ]);

      if (dbError) throw dbError;

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setFormData({ name: "", bio: "", tags: "" });
        setHeadshot(null);
        setDemo(null);
        setPreviewImage(null);
        setPosition({ x: 0, y: 0 });
        setScale(1);
        setUploading(false);
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      alert("Upload failed: " + error.message);
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050510] text-white p-8 flex items-center justify-center font-sans">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* LEFT: FORM */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl shadow-xl order-2 lg:order-1">
          <h2 className="text-2xl font-serif font-bold text-gold mb-6 flex items-center gap-2">
            <Upload className="w-6 h-6" /> Add New Talent
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
                Tags
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

            {/* 🟢 BIO WITH CHARACTER LIMIT */}
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
                  {formData.bio.length} / {MAX_BIO} chars
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
                placeholder={`Brief description (Min ${MIN_BIO} chars)...`}
              />
              {formData.bio.length > 0 && formData.bio.length < MIN_BIO && (
                <div className="text-[10px] text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Bio too short
                </div>
              )}
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
                  <span className="text-xs text-gray-500 font-bold uppercase">
                    {headshot ? "Replace Image" : "Select Image"}
                  </span>
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
                  <span className="text-xs text-gray-500 font-bold uppercase">
                    {demo ? "Replace Audio" : "Select Audio"}
                  </span>
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
                  <Loader2 className="animate-spin w-4 h-4" /> Cropping &
                  Uploading...
                </>
              ) : success ? (
                "Done!"
              ) : (
                <>
                  <Save className="w-4 h-4" /> Publish to Roster
                </>
              )}
            </button>
          </form>
        </div>

        {/* RIGHT: PREVIEW */}
        <div className="flex flex-col items-center justify-start order-1 lg:order-2 pt-10">
          <div className="text-gold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
            <Move className="w-4 h-4" /> Drag to Reposition
          </div>

          <div className="w-80 relative group select-none">
            <div
              className="aspect-[3/4] overflow-hidden rounded-xl border-2 border-gold/50 relative shadow-2xl bg-black cursor-move"
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              style={{ cursor: isDragging ? "grabbing" : "grab" }}
            >
              {previewImage ? (
                <img
                  ref={imageRef}
                  src={previewImage}
                  alt="Preview"
                  draggable="false"
                  className="max-w-none absolute origin-top-left"
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    width: "100%",
                  }}
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

          {/* ZOOM CONTROLS */}
          {previewImage && (
            <div className="mt-6 flex items-center gap-4 bg-white/5 p-2 rounded-full border border-white/10">
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
        </div>
      </div>
    </div>
  );
}
