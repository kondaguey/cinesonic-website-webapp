"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../../../lib/supabaseClient";
import { Calendar, User, ArrowLeft, Share2, Clock } from "lucide-react";
import Link from "next/link";
import Navbar from "../../../../components/marketing/Navbar";
import Footer from "../../../../components/marketing/Footer";
import { useParams } from "next/navigation";

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // HELPER: Reading Time
  const getReadingTime = (htmlContent) => {
    if (!htmlContent) return 0;
    const text = htmlContent.replace(/<[^>]*>/g, "");
    const wordCount = text.split(/\s+/).length;
    return Math.ceil(wordCount / 200);
  };

  useEffect(() => {
    async function fetchPost() {
      if (!slug) return;
      const { data, error } = await supabase
        .from("blog_db")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) console.error("Error fetching post:", error);
      else setPost(data);
      setLoading(false);
    }
    fetchPost();
  }, [slug]);

  if (loading)
    return (
      <div className="min-h-screen bg-[#020010] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!post)
    return (
      <div className="min-h-screen bg-[#020010] flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-serif text-[#d4af37] mb-4">404</h1>
        <p className="text-gray-400 mb-8">
          Signal Lost. Transmission not found.
        </p>
        <Link
          href="/blog"
          className="px-6 py-3 border border-white/20 rounded-full hover:bg-white/10 transition"
        >
          Return to Log
        </Link>
      </div>
    );

  const readTime = getReadingTime(post.content);

  // IMAGE FALLBACK
  const coverImage =
    post.cover_image && post.cover_image.length > 5
      ? post.cover_image
      : "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-[#020010] text-white font-sans selection:bg-[#d4af37]/30">
      <Navbar />

      <main className="pt-32 pb-24">
        {/* HEADER SECTION */}
        <div className="max-w-4xl mx-auto px-6 mb-16 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center text-gray-500 hover:text-[#00f0ff] mb-8 transition-colors text-xs uppercase tracking-widest group"
          >
            <ArrowLeft
              size={14}
              className="mr-2 group-hover:-translate-x-1 transition-transform"
            />{" "}
            Back to Log
          </Link>

          {/* 1. COVER IMAGE (NOW FIRST) */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] group mb-10">
            <img
              src={coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020010] via-transparent to-transparent opacity-60" />
          </div>

          {/* 2. TITLE (BELOW IMAGE, SMALLER, GRADIENT GOLD) */}
          <h1 className="text-3xl md:text-5xl font-sans font-bold leading-tight mb-6 bg-gradient-to-br from-[#ffeebb] via-[#d4af37] to-[#b8860b] text-transparent bg-clip-text drop-shadow-sm">
            {post.title}
          </h1>

          {/* 3. META BADGES (LAST) */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] uppercase tracking-widest font-bold opacity-80">
            <span className="flex items-center gap-2 text-gray-400">
              <Calendar size={12} />{" "}
              {new Date(post.created_at).toLocaleDateString()}
            </span>
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <span className="flex items-center gap-2 text-gray-400">
              <User size={12} /> {post.author || "CineSonic Team"}
            </span>
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <span className="flex items-center gap-2 text-[#00f0ff]">
              <Clock size={12} /> {readTime} Min Read
            </span>
          </div>

          {/* TAGS */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex justify-center gap-2 mt-6">
              {post.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 border border-white/10 bg-white/5 rounded-full text-[10px] text-gray-500 uppercase tracking-widest"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* CONTENT SECTION */}
        <div className="max-w-3xl mx-auto px-6">
          <article className="blog-content">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>

          {/* FOOTER OF POST */}
          <div className="mt-16 pt-8 border-t border-white/10 flex justify-between items-center">
            <div className="text-gray-500 text-sm italic">
              End of Transmission
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
              }}
              className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#d4af37] hover:text-white transition-colors"
            >
              <Share2 size={16} /> Share Signal
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
