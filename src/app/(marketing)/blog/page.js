"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabaseClient";
import { Calendar, User, ArrowRight, Tag, Search } from "lucide-react";
import Navbar from "../../../components/marketing/Navbar";
import Footer from "../../../components/marketing/Footer";

export default function BlogIndex() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from("blog_db")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (error) console.error("Error fetching blog:", error);
      else setPosts(data || []);
      setLoading(false);
    }
    fetchPosts();
  }, []);

  // Simple Search Filter
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(filter.toLowerCase()) ||
      (post.excerpt &&
        post.excerpt.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#020010] text-white font-sans selection:bg-[#00f0ff]/30">
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        {/* HERO HEADER */}
        <div className="text-center mb-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#00f0ff]/30 bg-[#00f0ff]/10 rounded-full">
            <span className="w-2 h-2 bg-[#00f0ff] rounded-full animate-pulse" />
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#00f0ff] font-bold">
              Transmission Log
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif text-white tracking-tight drop-shadow-2xl">
            Signal{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#f0e68c]">
              Frequency
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto font-light">
            Insights on audio production, casting updates, and industry news
            from the CineSonic deck.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative mt-8">
            <Search className="absolute left-4 top-3.5 text-gray-600 w-5 h-5" />
            <input
              type="text"
              placeholder="Search transmission logs..."
              className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 text-white focus:border-[#d4af37] focus:outline-none transition-all"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

        {/* POSTS GRID */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group relative bg-[#0a0a15] border border-white/10 rounded-2xl overflow-hidden hover:border-[#d4af37]/50 transition-all duration-500 hover:-translate-y-2"
              >
                {/* Image Aspect Ratio Container */}
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={
                      post.cover_image ||
                      "https://placehold.co/600x400/1a1a1a/FFF?text=CineSonic"
                    }
                    alt={post.title}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a15] to-transparent opacity-80" />
                </div>

                <div className="p-8 relative">
                  {/* Meta Data */}
                  <div className="flex items-center gap-4 text-xs text-[#d4af37] mb-4 uppercase tracking-widest font-bold">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />{" "}
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                    {post.tags && post.tags[0] && (
                      <span className="flex items-center gap-1 border border-[#d4af37]/30 px-2 py-0.5 rounded-full">
                        <Tag size={10} /> {post.tags[0]}
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl font-serif text-white mb-3 group-hover:text-[#d4af37] transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center text-[#00f0ff] text-xs font-bold uppercase tracking-wider group-hover:translate-x-2 transition-transform">
                    Read Transmission <ArrowRight size={14} className="ml-2" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && filteredPosts.length === 0 && (
          <div className="text-center py-20 opacity-50">
            <p>No transmissions found matching your query.</p>
          </div>
        )}
      </main>
    </div>
  );
}
