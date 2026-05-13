"use client";

import { useRef, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Link2, Flame, Check, X as XIcon, BriefcaseBusiness } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import type { RoastResult } from "@/lib/types/roast";
import { getRoastLevel, PLATFORM_CONFIG } from "@/lib/utils";

interface Props {
  data: RoastResult;
}

export default function ShareCard({ data }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const handleExport = useCallback(async () => {
    if (!cardRef.current) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#0a0a0f",
        scale: 2,
      });
      const link = document.createElement("a");
      link.download = `devroast-${data.username.replace(/[^a-zA-Z0-9]/g, "-")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      showToast("Card downloaded! 🔥");
    } catch (err) {
      console.error("Export failed:", err);
      showToast("Download failed. Try again.");
    }
  }, [data.username, showToast]);

  const handleCopyLink = useCallback(async () => {
    const url = `${window.location.origin}/roast/${data.id}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast("Link copied! 📋");
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      showToast("Link copied! 📋");
    }
  }, [data.id, showToast]);

  const handleTwitterShare = useCallback(() => {
    const text = `I just got roasted by Dev Roast AI 🔥\n\nScore: ${data.hireabilityScore}/100\nArchetype: ${data.archetype.name} ${data.archetype.emoji}\nVerdict: ${getRoastLevel(data.hireabilityScore)}\n\nThink you can survive?`;
    const url = `${window.location.origin}/roast/${data.id}`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank"
    );
    showToast("Opening Twitter... 🐦");
  }, [data, showToast]);

  const handleLinkedInShare = useCallback(() => {
    const url = `${window.location.origin}/roast/${data.id}`;
    // Include the URL explicitly in the text body so LinkedIn doesn't drop it
    const text = `I just got roasted by Dev Roast AI 🔥\n\nScore: ${data.hireabilityScore}/100\nArchetype: ${data.archetype.name} ${data.archetype.emoji}\nVerdict: ${getRoastLevel(data.hireabilityScore)}\n\nThink you can survive? Try it here:\n${url}`;
    
    window.open(
      `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`,
      "_blank"
    );
    showToast("Opening LinkedIn... 💼");
  }, [data, showToast]);

  const platformConfig = PLATFORM_CONFIG[data.profileType];

  // Get the first roast line for the quote
  const firstRoastLine = data.githubRoast.roastLines[0]?.text || "No words. Just damage.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      style={{ marginTop: "2rem" }}
    >
      {/* Share CTA */}
      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.3rem", marginBottom: "0.5rem" }}>
          Share your <span className="gradient-text-fire">destruction</span>
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
          Let the world know how bad it really is
        </p>
      </div>

      {/* Exportable Card */}
      <div
        ref={cardRef}
        style={{
          background: "linear-gradient(160deg, #0a0a0f 0%, #111128 50%, #0a0a0f 100%)",
          borderRadius: "var(--radius-lg)",
          padding: "2rem",
          border: "1px solid var(--glass-border)",
          maxWidth: 480,
          margin: "0 auto",
        }}
      >
        {/* Card header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                background: "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Flame size={16} color="#000" />
            </div>
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.85rem" }}>
              Dev Roast<span style={{ color: "var(--accent-cyan)" }}>.AI</span>
            </span>
          </div>
          <span
            style={{
              fontSize: "0.65rem",
              padding: "0.2rem 0.6rem",
              borderRadius: 999,
              background: platformConfig.badgeBg,
              border: `1px solid ${platformConfig.badgeBorder}`,
              color: platformConfig.color,
              fontWeight: 600,
            }}
          >
            {platformConfig.emoji} {platformConfig.label}
          </span>
        </div>

        {/* Username + archetype */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "linear-gradient(135deg, var(--accent-purple), var(--accent-pink))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 0.75rem",
              fontSize: "1.5rem",
            }}
          >
            {data.archetype.emoji}
          </div>
          <div style={{ fontSize: "1.2rem", fontWeight: 700, fontFamily: "var(--font-heading)" }}>
            {data.profileType === "github" ? `@${data.username}` : data.username}
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--accent-purple)", fontWeight: 500, marginTop: "0.25rem" }}>
            {data.archetype.name}
          </div>
        </div>

        {/* Score */}
        <div
          style={{
            textAlign: "center",
            padding: "1rem",
            borderRadius: "var(--radius)",
            background: "rgba(0,0,0,0.3)",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)", marginBottom: "0.4rem" }}>
            {data.profileType === "github" ? "Hireability Score" : data.profileType === "linkedin" ? "LinkedIn Score" : "Portfolio Score"}
          </div>
          <div style={{ fontSize: "2.5rem", fontWeight: 700, fontFamily: "var(--font-heading)", lineHeight: 1 }}>
            <span className="gradient-text-fire">{data.hireabilityScore}</span>
            <span style={{ fontSize: "1rem", color: "var(--text-muted)" }}>/100</span>
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.3rem" }}>
            {getRoastLevel(data.hireabilityScore)}
          </div>
        </div>

        {/* Radar Chart */}
        <div style={{ width: "100%", height: 200, marginBottom: "1rem" }}>
          <ResponsiveContainer>
            <RadarChart data={data.radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis
                dataKey="category"
                tick={{ fontSize: 10, fill: "var(--text-muted)" }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={false}
                axisLine={false}
              />
              <Radar
                name="Score"
                dataKey="score"
                stroke={platformConfig.color}
                fill={platformConfig.color}
                fillOpacity={0.15}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Funny quote */}
        <div
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "var(--radius-sm)",
            background: "rgba(239, 68, 68, 0.08)",
            border: "1px solid rgba(239, 68, 68, 0.15)",
            fontSize: "0.78rem",
            color: "var(--text-secondary)",
            fontFamily: "var(--font-mono)",
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          &ldquo;{firstRoastLine}&rdquo;
        </div>
      </div>

      {/* Share Buttons — simple, 4 working options */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "0.75rem",
          marginTop: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={handleExport}
          className="btn-gradient"
          style={{
            padding: "0.7rem 1.5rem",
            fontSize: "0.85rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Download size={16} />
          Download Card
        </button>
        <button
          onClick={handleTwitterShare}
          className="btn-outline"
          style={{
            padding: "0.7rem 1.5rem",
            fontSize: "0.85rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <XIcon size={16} />
          Share on X
        </button>
        <button
          onClick={handleLinkedInShare}
          className="btn-outline"
          style={{
            padding: "0.7rem 1.5rem",
            fontSize: "0.85rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <BriefcaseBusiness size={16} />
          Share on LinkedIn
        </button>
        <button
          onClick={handleCopyLink}
          className="btn-outline"
          style={{
            padding: "0.7rem 1.5rem",
            fontSize: "0.85rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Link2 size={16} />
          Copy Link
        </button>
      </div>

      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              bottom: "2rem",
              left: "50%",
              transform: "translateX(-50%)",
              padding: "0.75rem 1.5rem",
              borderRadius: "var(--radius)",
              background: "rgba(0, 229, 255, 0.12)",
              border: "1px solid rgba(0, 229, 255, 0.25)",
              backdropFilter: "blur(12px)",
              color: "var(--accent-cyan)",
              fontSize: "0.85rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              zIndex: 9999,
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
          >
            <Check size={16} />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
