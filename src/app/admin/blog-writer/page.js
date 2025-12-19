"use client";

import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import Cookies from "js-cookie";
import {
  PenTool,
  Globe,
  Eye,
  EyeOff,
  Lock,
  User,
  Tag,
  ImageIcon,
  Layers,
  ChevronRight,
  Sparkles,
  FileText,
  Zap,
} from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const masterAdminPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function BlogWriter() {
  const [isAuth, setIsAuth] = useState(false);
  const [authStatus, setAuthStatus] = useState("idle");
  const [keyInput, setKeyInput] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [sessionRole, setSessionRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Content State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [author, setAuthor] = useState("CineSonic Team");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const editorRef = useRef(null);

  // 🟢 THE UPLOAD ENGINE
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setIsLoading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
      const filePath = `covers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("blog-assets")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("blog-assets")
        .getPublicUrl(filePath);

      setCoverImage(data.publicUrl);
      alert("Image Processed & Welded to Metadata.");
    } catch (error) {
      alert("Upload Failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 🟢 THE PUBLISH ENGINE (THE TUNNEL)
  const handlePublish = async () => {
    if (!title || !slug || !contentHtml) {
      alert(
        "CRITICAL ERROR: Manuscript incomplete. Title, Slug, and Content required."
      );
      return;
    }

    setIsLoading(true);

    // Clean up tags into an array
    const tagsArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "");
    const activeKey = keyInput || Cookies.get("cinesonic-beta-access");

    try {
      const { error } = await supabase.rpc("secure_upsert_blog", {
        secret_pass: activeKey,
        p_slug: slug,
        p_title: title,
        p_excerpt: excerpt,
        p_content: contentHtml,
        p_cover_image: coverImage,
        p_author: author,
        p_published: true, // Forces live status
        p_tags: tagsArray,
      });

      if (error) throw error;
      alert("SUCCESS: The manuscript is live on the CineSonic grid.");
    } catch (error) {
      console.error(error);
      alert("WELD FAILED: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccessRequest = async () => {
    setAuthStatus("checking");
    if (keyInput === masterAdminPass) {
      grantAccess("MASTER-ADMIN");
      return;
    }
    const { data } = await supabase
      .from("site_keys")
      .select("role, is_active")
      .eq("key", keyInput)
      .single();
    if (data && data.is_active && data.role === "crew") {
      grantAccess("STUDIO-CREW");
    } else {
      setAuthStatus("denied");
      alert("UNAUTHORIZED: CREW OR ADMIN ACCESS REQUIRED");
    }
  };

  const grantAccess = (role) => {
    setIsAuth(true);
    setSessionRole(role);
    sessionStorage.setItem("cineSonicBlogSession", role);
    Cookies.set("cinesonic-beta-access", keyInput, { expires: 7, path: "/" });
  };

  useEffect(() => {
    const session = sessionStorage.getItem("cineSonicBlogSession");
    if (session) {
      setIsAuth(true);
      setSessionRole(session);
    }
  }, []);

  useEffect(() => {
    if (!isAuth) return;
    const link = document.createElement("link");
    link.href = "https://cdn.quilljs.com/1.3.6/quill.snow.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src = "https://cdn.quilljs.com/1.3.6/quill.min.js";
    script.onload = () => {
      if (window.Quill && !editorRef.current) {
        editorRef.current = new window.Quill("#editor-container", {
          theme: "snow",
          modules: {
            toolbar: [
              [{ header: [2, 3, false] }],
              ["bold", "italic", "blockquote"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "image", "clean"],
            ],
          },
        });
        editorRef.current.on("text-change", () =>
          setContentHtml(editorRef.current.root.innerHTML)
        );
      }
    };
    document.body.appendChild(script);
  }, [isAuth]);

  if (!isAuth)
    return (
      <div className="fixed inset-0 bg-[#020010] flex items-center justify-center p-6 z-[9999]">
        <div className="relative bg-[#050510] p-12 rounded-[3rem] border border-white/10 w-full max-w-md shadow-2xl text-center">
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/20">
              <Sparkles className="text-white" size={32} />
            </div>
            <h2 className="text-3xl font-black text-white italic">
              CINE<span className="text-indigo-500 font-serif">SONIC</span>
            </h2>
            <p className="text-indigo-400/50 text-[10px] uppercase tracking-[0.4em] font-bold mt-2">
              Blog Writer Access
            </p>
          </div>
          <div className="relative mb-6">
            <input
              type={showKey ? "text" : "password"}
              className="w-full bg-black border border-white/10 rounded-2xl p-5 text-center text-white font-mono tracking-widest outline-none focus:border-indigo-500"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAccessRequest()}
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-indigo-400"
            >
              {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button
            onClick={handleAccessRequest}
            className="w-full bg-indigo-600 py-5 rounded-2xl text-white font-black uppercase tracking-widest hover:bg-indigo-500 transition-all"
          >
            Start Writing
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-sans">
      <nav className="sticky top-0 z-50 bg-[#0A0A0B] border-b border-white/5 px-10 py-6 flex justify-between items-center shadow-xl">
        <div className="flex items-center gap-6">
          <div className="text-2xl font-black tracking-tighter uppercase italic">
            Studio<span className="text-indigo-500">Writer</span>
          </div>
          <div className="bg-white/5 px-4 py-1.5 rounded-full border border-white/10 text-[10px] font-black text-white/40 uppercase">
            {sessionRole}
          </div>
        </div>
        {/* 🟢 CONNECTED BUTTON */}
        <button
          onClick={handlePublish}
          disabled={isLoading}
          className="bg-indigo-600 text-white px-12 py-3 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-indigo-500 disabled:opacity-50 transition-all"
        >
          {isLoading ? "WELDING..." : "Publish Live"}
        </button>
      </nav>

      <main className="max-w-[1600px] mx-auto p-10 grid grid-cols-12 gap-10">
        <aside className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-[#F3F4F6] border border-white rounded-[2.5rem] p-10 shadow-2xl">
            <div className="flex items-center gap-3 mb-10 pb-5 border-b border-black/5">
              <FileText className="text-indigo-600" size={20} />
              <h3 className="text-[11px] font-black text-black uppercase tracking-[0.2em]">
                Post Blueprint
              </h3>
            </div>

            <div className="space-y-8">
              <WriterInput
                label="Article Headline"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setSlug(
                    e.target.value
                      .toLowerCase()
                      .replace(/[^\w ]+/g, "")
                      .replace(/ +/g, "-")
                  );
                }}
              />
              <WriterInput
                label="Permalink Slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                isMono
              />
              <div className="space-y-3">
                <label className="text-[10px] font-black text-black/30 uppercase tracking-[0.2em]">
                  Excerpt
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full bg-white border border-black/10 p-5 text-sm text-black outline-none rounded-2xl h-44 focus:border-indigo-500 transition-all resize-none shadow-inner"
                  placeholder="Enter the hook..."
                />
              </div>
            </div>
          </div>

          <div className="bg-[#F3F4F6] border border-white rounded-[2.5rem] p-10 shadow-2xl space-y-8">
            <WriterInput
              label="Display Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              icon={<User size={14} className="text-indigo-600" />}
            />
            <WriterInput
              label="Search Tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="news, tutorials..."
              icon={<Tag size={14} className="text-indigo-600" />}
            />

            <div className="space-y-4">
              <label className="text-[10px] font-black text-black/40 uppercase tracking-[0.3em] flex items-center gap-3">
                <ImageIcon size={14} className="text-indigo-600" /> Cover Asset
              </label>

              {coverImage && (
                <div className="relative w-full h-40 rounded-2xl overflow-hidden border-2 border-indigo-500/20 mb-4 bg-white shadow-inner">
                  <img
                    src={coverImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setCoverImage("")}
                    className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-red-500 transition-colors"
                  >
                    <Zap size={12} />
                  </button>
                </div>
              )}

              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="flex items-center justify-center gap-3 w-full bg-white border-2 border-dashed border-black/10 p-8 rounded-2xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/30 transition-all group"
                >
                  <div className="text-center">
                    <div className="text-indigo-600 font-black text-xs uppercase tracking-widest mb-1 group-hover:scale-110 transition-transform">
                      {isLoading
                        ? "Uploading to Studio..."
                        : "Drop Cinematic Asset"}
                    </div>
                    <div className="text-[9px] text-black/30 font-bold uppercase">
                      PNG, JPG up to 10MB
                    </div>
                  </div>
                </label>
              </div>

              <input
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="URL will generate here..."
                className="w-full bg-transparent border-b border-black/5 pb-2 text-[10px] font-mono text-indigo-700 outline-none"
              />
            </div>
          </div>
        </aside>

        <section className="col-span-12 lg:col-span-8">
          <div className="bg-[#EDE6D6] rounded-[3.5rem] shadow-2xl overflow-hidden border-[24px] border-[#1A1A1C]">
            <style jsx global>{`
              .ql-toolbar.ql-snow {
                border: none !important;
                background: #d6cdb8 !important;
                padding: 30px 50px !important;
                border-bottom: 2px solid #c4b9a2 !important;
              }
              .ql-editor {
                font-family: "Charter", "Georgia", serif !important;
                font-size: 1.5rem !important;
                color: #1f1f1f !important;
                padding: 100px 140px !important;
                line-height: 2 !important;
                min-height: 1200px !important;
              }
              .ql-editor h2 {
                font-family: "Inter", sans-serif !important;
                font-weight: 900;
                color: #000;
                font-size: 3rem;
                margin-bottom: 2rem;
                letter-spacing: -0.05em;
              }
              .ql-editor blockquote {
                border-left: 8px solid #6366f1;
                padding-left: 30px;
                font-style: italic;
                color: #333;
                margin: 50px 0;
                background: rgba(0, 0, 0, 0.03);
                py: 20px;
              }
            `}</style>
            <div id="editor-container" />
          </div>
        </section>
      </main>
    </div>
  );
}

function WriterInput({ label, value, onChange, placeholder, isMono, icon }) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black text-black/40 uppercase tracking-[0.3em] flex items-center gap-3">
        {icon} {label}
      </label>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-white border border-black/5 rounded-xl p-4 text-base text-black outline-none focus:border-indigo-500 transition-all shadow-sm ${
          isMono ? "font-mono text-indigo-700 text-sm" : "font-serif"
        }`}
      />
    </div>
  );
}
