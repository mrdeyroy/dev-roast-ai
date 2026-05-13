"use client";

import { use } from "react";
import { DEMO_ROAST } from "@/lib/mock-data";
import { useRoastStore } from "@/lib/store";
import { PLATFORM_CONFIG } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import RoastHeader from "@/components/roast/RoastHeader";
import RoastCategory from "@/components/roast/RoastCategory";
import ImprovementSection from "@/components/roast/ImprovementSection";
import ShareCard from "@/components/share/ShareCard";
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
          <div
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
          </div>
        )}

        {/* Header with score */}
        <RoastHeader data={data} />

        {/* Roast Categories */}
        <div style={{ marginTop: "1.5rem" }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "var(--text-primary)" }}>
            🔥 The Roast
          </h2>
          {categories.map((cat, i) => (
            <RoastCategory key={i} data={cat} index={i} />
          ))}
        </div>

        {/* Improvements */}
        <div style={{ marginTop: "2rem" }}>
          <ImprovementSection improvements={data.improvements} />
        </div>

        {/* Share Card — the ONE place to share */}
        <ShareCard data={data} />
      </main>
      <Footer />
    </>
  );
}
