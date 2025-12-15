"use client";

import React, { useEffect, useState } from "react";

// --- 1. SUPABASE IMPORT (Local) -------------------------

// Confirmed working path
import { supabase } from "../../../lib/supabaseClient.js";

// --- 2. ROSTER COMPONENTS ---
import ActorCard from "../../../components/marketing/ActorCard";
import ActorModal from "../../../components/marketing/ActorModal";
import MainRoster from "../../../components/marketing/MainRoster";
import RosterPreview from "../../../components/marketing/RosterPreview";

// --- 3. MARKETING COMPONENTS ---
import CostEstimator from "../../../components/marketing/CostEstimator";
import CTASection from "../../../components/marketing/CTASection";
import FAQSection from "../../../components/marketing/FAQSection";
import Footer from "../../../components/marketing/Footer";
import IndieAudioGuide from "../../../components/marketing/IndieAudioGuide";
import LogoCloud from "../../../components/marketing/LogoCloud";
import Navbar from "../../../components/marketing/Navbar";
import ProductionPipeline from "../../../components/marketing/ProductionPipeline";
import ServiceComparisonMatrix from "../../../components/marketing/ServiceComparisonMatrix";
import ServiceHero from "../../../components/marketing/ServiceHero";
import SonicVisualizer from "../../../components/marketing/SonicVisualizer";
import TestimonialsFeed from "../../../components/marketing/TestimonialsFeed";

export default function ComponentShowroom() {
  const [actors, setActors] = useState([]);
  const [selectedActor, setSelectedActor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    async function fetchAndMapActors() {
      try {
        setLoading(true);

        // 1. FETCH RAW DATA
        const { data, error } = await supabase
          .from("actor_db")
          .select("*")
          .order("id", { ascending: true });

        if (error) throw error;
        if (!data) throw new Error("No data returned from DB");

        // 2. HELPER: Clean up voice tags
        const cleanVoiceType = (rawInput) => {
          if (!rawInput) return "Voice Actor";
          try {
            if (rawInput.trim().startsWith("[")) {
              const parsed = JSON.parse(rawInput.replace(/'/g, '"'));
              return parsed.join("  •  ");
            }
            return rawInput;
          } catch (e) {
            return rawInput.replace(/[\[\]"]/g, "");
          }
        };

        // 3. MAP RAW DATA TO COMPONENT PROPS ("The Cooking Step")
        const mappedActors = data.map((actor) => ({
          ...actor,
          // Map DB columns (snake_case) to Component props (camelCase)
          isRevealed: !actor.coming_soon,
          roleName: cleanVoiceType(actor.voice_type),
          headshotUrl: actor.headshot_url,
        }));

        setActors(mappedActors);
      } catch (err) {
        console.error("Showroom Error:", err);
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAndMapActors();
  }, []);

  if (loading) return <div className="p-20 text-center">Loading Data...</div>;

  return (
    <div className="bg-white min-h-screen font-sans">
      <div className="border-b border-gray-200 mb-10">
        <Navbar />
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-24 space-y-12">
        {/* HEADER & DEBUGGER */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            Design System Showroom
          </h1>

          <div className="inline-block bg-gray-100 p-4 rounded-lg text-left text-xs font-mono border border-gray-300">
            <p className="font-bold text-gray-500 mb-2">DATA DIAGNOSTIC:</p>
            <p>Status: {errorMsg ? `Error: ${errorMsg}` : "Success"}</p>
            <p>Count: {actors.length} items</p>
            <p>First Item Check:</p>
            <ul className="pl-4 list-disc text-blue-600">
              <li>
                roleName: {actors[0]?.roleName || "MISSING (Check Mapping)"}
              </li>
              <li>
                headshotUrl: {actors[0]?.headshotUrl ? "Found" : "MISSING"}
              </li>
              <li>isRevealed: {actors[0]?.isRevealed?.toString()}</li>
            </ul>
          </div>
        </div>

        {/* =========================================
            A. ROSTER COMPONENTS
           ========================================= */}
        <section>
          <div className="mb-8 pb-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-blue-600">
              A. Roster Components
            </h2>
          </div>

          <div className="space-y-12">
            {/* 1. SINGLE CARD */}
            <div className="p-8 border border-gray-200 rounded-xl bg-gray-50">
              <h3 className="text-sm font-bold text-gray-400 uppercase mb-6">
                1. ActorCard (Individual)
              </h3>
              <div className="w-full max-w-xs mx-auto md:mx-0">
                {actors.length > 0 ? (
                  <ActorCard
                    actor={actors[0]}
                    onClick={() => setSelectedActor(actors[0])}
                  />
                ) : (
                  <div className="p-4 bg-red-100 text-red-600 rounded">
                    Roster array is empty.
                  </div>
                )}
              </div>
            </div>

            {/* 2. PREVIEW LIST */}
            <div className="p-8 border border-gray-200 rounded-xl bg-gray-50">
              <h3 className="text-sm font-bold text-gray-400 uppercase mb-6">
                2. RosterPreview
              </h3>
              <RosterPreview actors={actors.slice(0, 4)} />
            </div>

            {/* 3. MAIN ROSTER GRID */}
            <div className="p-8 border border-gray-200 rounded-xl bg-gray-900">
              <h3 className="text-sm font-bold text-gray-500 uppercase mb-6">
                3. MainRoster (Grid)
              </h3>
              <MainRoster actors={actors} onSelectActor={setSelectedActor} />
            </div>
          </div>
        </section>

        {/* =========================================
            B. MARKETING COMPONENTS
           ========================================= */}
        <section>
          <div className="mb-12 pb-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-green-600">
              B. Marketing Components
            </h2>
          </div>
          <div className="space-y-16">
            <ShowcaseBlock title="Service Hero">
              <ServiceHero />
            </ShowcaseBlock>
            <ShowcaseBlock title="Logo Cloud">
              <LogoCloud />
            </ShowcaseBlock>
            <ShowcaseBlock title="Sonic Visualizer">
              <SonicVisualizer />
            </ShowcaseBlock>
            <ShowcaseBlock title="Indie Audio Guide">
              <IndieAudioGuide />
            </ShowcaseBlock>
            <ShowcaseBlock title="Comparison Matrix">
              <ServiceComparisonMatrix />
            </ShowcaseBlock>
            <ShowcaseBlock title="Production Pipeline">
              <ProductionPipeline />
            </ShowcaseBlock>
            <ShowcaseBlock title="Cost Estimator">
              <CostEstimator />
            </ShowcaseBlock>
            <ShowcaseBlock title="Testimonials">
              <TestimonialsFeed />
            </ShowcaseBlock>
            <ShowcaseBlock title="FAQ Section">
              <FAQSection />
            </ShowcaseBlock>
            <ShowcaseBlock title="CTA Section">
              <CTASection />
            </ShowcaseBlock>
          </div>
        </section>
      </div>
      <Footer />

      {/* MODAL */}
      {selectedActor && (
        <ActorModal
          actor={selectedActor}
          onClose={() => setSelectedActor(null)}
        />
      )}
    </div>
  );
}

const ShowcaseBlock = ({ title, children }) => (
  <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
    <div className="bg-gray-100 px-4 py-2 text-xs font-mono text-gray-500 font-bold border-b border-gray-200">
      &lt;{title} /&gt;
    </div>
    <div className="bg-white">{children}</div>
  </div>
);
