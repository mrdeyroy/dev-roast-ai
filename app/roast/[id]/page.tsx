"use client";

import { use } from "react";
import { motion } from "framer-motion";
import { DEMO_ROAST } from "@/lib/mock-data";
import { useRoastStore } from "@/lib/store";
import { PLATFORM_CONFIG } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import RoastHeader from "@/components/roast/RoastHeader";
import RoastCategory from "@/components/roast/RoastCategory";
import ImprovementSection from "@/components/roast/ImprovementSection";
import ShareCard from "@/components/share/ShareCard";
import SharePrompt from "@/components/share/SharePrompt";
import Footer from "@/components/Footer";

export default function RoastResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { roastResult } = useRoastStore();

  // Use real roast data if available and matching, otherwise fall back to demo
  const isDemo = id === "demo-shibam-2024";
  const data = isDemo
    ? DEMO_ROAST
    : roastResult && roastResult.id === id
      ? roastResult
      : roastResult
        ? roastResult // If IDs don't match exactly but we have a result, still show it
        : DEMO_ROAST; // Absolute fallback

  const categories = [data.githubRoast, data.readmeRoast, data.projectRoast];
  const platformConfig = PLATFORM_CONFIG[data.profileType];

  return (
    <>
      <Navbar />
      <main
        className="section"
        style={{
          paddingTop: "6rem",
          paddingBottom: "4rem",
          maxWidth: 800,
        }}
      >
        {/* Platform badge */}
        {!isDemo && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              textAlign: "center",
              marginBottom: "1rem",
            }}
          >
            <span
              className="badge-pill"
              style={{
                background: platformConfig.badgeBg,
                borderColor: platformConfig.badgeBorder,
                color: platformConfig.color,
                fontSize: "0.75rem",
              }}
            >
              {platformConfig.emoji} Real AI-generated {platformConfig.label.toLowerCase()} for {data.profileType === "github" ? `@${data.username}` : data.username}
            </span>
          </motion.div>
        )}

        {/* Header with score */}
        <RoastHeader data={data} />

        {/* Share prompt after score */}
        <SharePrompt context="after-score" score={data.hireabilityScore} />

        {/* Gradient separator */}
        <div className="gradient-separator" />

        {/* Roast Categories */}
        <div style={{ marginTop: "1.5rem" }}>
          <motion.h2
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              fontSize: "1.3rem",
              marginBottom: "1.25rem",
              color: "var(--text-primary)",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            🔥 The Roast
            <span style={{
              fontSize: "0.65rem",
              padding: "0.15rem 0.5rem",
              borderRadius: 6,
              background: "rgba(239, 68, 68, 0.1)",
              color: "var(--roast-nuclear)",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}>
              {categories.length} categories
            </span>
          </motion.h2>
          {categories.map((cat, i) => (
            <RoastCategory key={i} data={cat} index={i} />
          ))}
        </div>

        {/* Share prompt after roast */}
        <SharePrompt context="after-roast" />

        {/* Gradient separator */}
        <div className="gradient-separator" />

        {/* Improvements */}
        <div style={{ marginTop: "1rem" }}>
          <ImprovementSection improvements={data.improvements} />
        </div>

        {/* Share prompt after archetype */}
        <SharePrompt context="after-archetype" archetypeName={data.archetype.name} />

        {/* Share Card — the ONE place to share */}
        <ShareCard data={data} />
      </main>
      <Footer />
    </>
  );
}
