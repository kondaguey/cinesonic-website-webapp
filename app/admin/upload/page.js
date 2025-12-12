"use client";
import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Upload,
  Mic,
  Image as ImageIcon,
  Save,
  CheckCircle,
  Loader2,
  X,
} from "lucide-react";

// 🟢 INITIALIZE SUPABASE
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminUpload() {
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  // FORM STATE
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    tags: "", // We'll parse this comma-separated string into an array
  });

  // FILE STATE
  const [headshot, setHeadshot] = useState(null);
  const [demo, setDemo] = useState(null);

  // PREVIEW URLS (For local preview before upload)
  const [previewImage, setPreviewImage] = useState(null);

  // --- HANDLERS ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHeadshot(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleDemoChange = (e) => {
    const file = e.target.files[0];
    if (file) setDemo(file);
  };

  // --- UPLOAD LOGIC ---
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!formData.name || !headshot)
      return alert("Name and Headshot are required.");

    setUploading(true);

    try {
      // 1. UPLOAD IMAGE
      const imageFileName = `headshots/${Date.now()}-${headshot.name}`;
      const { data: imgData, error: imgError } = await supabase.storage
        .from("roster-assets")
        .upload(imageFileName, headshot);

      if (imgError) throw imgError;

      // 2. GET IMAGE PUBLIC URL
      const {
        data: { publicUrl: publicImgUrl },
      } = supabase.storage.from("roster-assets").getPublicUrl(imageFileName);

      // 3. UPLOAD DEMO (Optional)
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

      // 4. INSERT INTO DATABASE
      const { error: dbError } = await supabase.from("actors").insert([
        {
          name: formData.name,
          bio: formData.bio,
          tags: formData.tags.split(",").map((t) => t.trim()), // "Warm, Deep" -> ["Warm", "Deep"]
          image_url: publicImgUrl,
          demo_url: publicDemoUrl,
        },
      ]);

      if (dbError) throw dbError;

      setSuccess(true);
      // Reset form after 2 seconds
      setTimeout(() => {
        setSuccess(false);
        setFormData({ name: "", bio: "", tags: "" });
        setHeadshot(null);
        setDemo(null);
        setPreviewImage(null);
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
        {/* LEFT: UPLOAD FORM */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-serif font-bold text-gold mb-6 flex items-center gap-2">
            <Upload className="w-6 h-6" /> Add New Talent
          </h2>

          <form onSubmit={handleUpload} className="space-y-6">
            {/* NAME */}
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">
                Name
              </label>
              <input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none transition-colors"
                placeholder="e.g. Elena Vance"
                required
              />
            </div>

            {/* TAGS */}
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">
                Tags (Comma Separated)
              </label>
              <input
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none transition-colors"
                placeholder="e.g. Warm, Fiction, British"
              />
            </div>

            {/* BIO */}
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                className="w-full h-32 bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none transition-colors resize-none"
                placeholder="A short description of their voice and style..."
              />
            </div>

            {/* FILE UPLOADS */}
            <div className="grid grid-cols-2 gap-4">
              {/* IMAGE UPLOAD */}
              <div className="relative group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <div
                  className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center h-32 transition-colors ${
                    headshot
                      ? "border-green-500 bg-green-500/10"
                      : "border-white/20 hover:border-gold/50 hover:bg-white/5"
                  }`}
                >
                  {headshot ? (
                    <>
                      <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
                      <span className="text-xs text-green-400 font-bold truncate max-w-full px-2">
                        {headshot.name}
                      </span>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8 text-gray-500 mb-2 group-hover:text-gold" />
                      <span className="text-xs text-gray-500 font-bold uppercase">
                        Upload Headshot
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* DEMO UPLOAD */}
              <div className="relative group">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleDemoChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <div
                  className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center h-32 transition-colors ${
                    demo
                      ? "border-green-500 bg-green-500/10"
                      : "border-white/20 hover:border-gold/50 hover:bg-white/5"
                  }`}
                >
                  {demo ? (
                    <>
                      <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
                      <span className="text-xs text-green-400 font-bold truncate max-w-full px-2">
                        {demo.name}
                      </span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-8 h-8 text-gray-500 mb-2 group-hover:text-gold" />
                      <span className="text-xs text-gray-500 font-bold uppercase">
                        Upload MP3 Demo
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              disabled={uploading || success}
              className={`w-full py-4 rounded-lg font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all ${
                success
                  ? "bg-green-500 text-midnight"
                  : "bg-gold hover:bg-white text-midnight hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
              }`}
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" /> Uploading to
                  Cloud...
                </>
              ) : success ? (
                <>
                  <CheckCircle className="w-4 h-4" /> Upload Complete!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Publish to Roster
                </>
              )}
            </button>
          </form>
        </div>

        {/* RIGHT: LIVE PREVIEW CARD */}
        <div className="flex flex-col items-center justify-center">
          <div className="text-gray-500 text-xs uppercase tracking-widest mb-4">
            Live Card Preview
          </div>

          <div className="w-80 group relative">
            {/* IMAGE CONTAINER */}
            <div className="aspect-[3/4] overflow-hidden rounded-xl border border-white/10 relative shadow-2xl bg-black">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 z-10" />

              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-700 bg-white/5">
                  <ImageIcon className="w-12 h-12 opacity-20" />
                </div>
              )}

              {/* OVERLAY INFO */}
              <div className="absolute bottom-0 left-0 w-full p-4 z-20">
                <h3 className="text-2xl font-serif font-bold text-white mb-1">
                  {formData.name || "Actor Name"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {formData.tags ? (
                    formData.tags
                      .split(",")
                      .slice(0, 2)
                      .map((tag, i) => (
                        <span
                          key={i}
                          className="text-[9px] uppercase tracking-widest bg-gold/20 text-gold px-2 py-1 rounded border border-gold/10"
                        >
                          {tag.trim()}
                        </span>
                      ))
                  ) : (
                    <span className="text-[9px] uppercase tracking-widest bg-white/5 text-gray-500 px-2 py-1 rounded border border-white/5">
                      Tag 1
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs rounded max-w-sm text-center">
            <strong>Note:</strong> Files are uploaded to the{" "}
            <code>roster-assets</code> bucket. Make sure your Supabase Storage
            policies are set to Public.
          </div>
        </div>
      </div>
    </div>
  );
}
