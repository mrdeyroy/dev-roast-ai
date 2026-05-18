"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DEMO_ROAST } from "@/lib/mock-data";
import { useRoastStore } from "@/lib/store";
import { PLATFORM_CONFIG } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import RoastHeader from "@/components/roast/RoastHeader";
import ShareCard from "@/components/share/ShareCard";
import SharePrompt from "@/components/share/SharePrompt";
import Footer from "@/components/Footer";
import type { RoastResult } from "@/lib/types/roast";
import { saveRoast } from "@/lib/storage/history";
import { Info, Flame, AlertTriangle, Settings, BarChart2, CheckCircle2 } from "lucide-react";

interface Props {
  dbRoast: RoastResult | null;
  isDemo: boolean;
  requestedId: string;
}

export default function RoastResultClient({ dbRoast, isDemo, requestedId }: Props) {
  const { roastResult } = useRoastStore();
  const [clientRoast, setClientRoast] = useState<RoastResult | null>(null);

  // Try to load full roast from localStorage if DB fetch failed and we are on client side
  useEffect(() => {
    if (typeof window !== "undefined" && !dbRoast && !isDemo) {
      try {
        const saved = localStorage.getItem(`full_roast:${requestedId}`);
        if (saved) {
          setClientRoast(JSON.parse(saved));
        }
      } catch (e) {
        console.error("Failed to load local full roast:", e);
      }
    }
  }, [dbRoast, isDemo, requestedId]);

  // Resolution logic:
  // 1. If demo, use DEMO_ROAST
  // 2. If DB has it, use DB
  // 3. If loaded from localStorage, use clientRoast
  // 4. If Zustand store has it and IDs match, use store
  // 5. If nothing else, fallback to demo/store
  let data: RoastResult;
  if (isDemo) {
    data = DEMO_ROAST as RoastResult;
  } else if (dbRoast) {
    data = dbRoast;
  } else if (clientRoast) {
    data = clientRoast;
  } else if (roastResult && roastResult.id === requestedId) {
    data = roastResult;
  } else if (roastResult) {
    data = roastResult; // show whatever is in store if ID miss
  } else {
    data = DEMO_ROAST as RoastResult;
  }

  // Dynamically update document title on mount to fix metadata fallback title mismatches
  useEffect(() => {
    if (data && !isDemo) {
      const title = `${data.username} got roasted with a ${data.hireabilityScore}/100 hireability score 💀 | Dev Roast AI`;
      document.title = title;
    }
  }, [data, isDemo]);

  useEffect(() => {
    if (!isDemo && data) {
      // Save to summary history
      saveRoast({
        id: data.id,
        username: data.username,
        type: data.profileType,
        score: data.hireabilityScore,
        archetype: data.archetype?.name || "Developer",
        funniestLine: data.roastLines?.[0]?.text || "",
        createdAt: data.createdAt || new Date().toISOString(),
        shareUrl: `/roast/${data.id}`,
      });

      // Save full roast details for tab recovery & refresh resilience
      try {
        localStorage.setItem(`full_roast:${data.id}`, JSON.stringify(data));
      } catch (e) {
        console.error("Failed to save full roast locally", e);
      }
    }
  }, [data, isDemo]);

  const platformConfig = PLATFORM_CONFIG[data.profileType];

  return (
    <>
      <Navbar />
      <main
        className="section"
        style={{
          paddingTop: "6rem",
          paddingBottom: "4rem",
          maxWidth: 700,
          margin: "0 auto"
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
              {platformConfig.emoji} AI Generated for {data.profileType === "github" ? `@${data.username}` : data.username}
            </span>
          </motion.div>
        )}

        {/* Header with score */}
        <RoastHeader data={data} />

        <SharePrompt context="after-score" score={data.hireabilityScore} />
        
        <div className="gradient-separator" />

        {/* A. Quick Roast Header */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: "center", marginBottom: "2rem" }}
        >
          <h2 style={{ 
            fontSize: "1.5rem", 
            fontWeight: 700,
            color: "var(--accent-purple)",
            fontFamily: "var(--font-heading)" 
          }}>
            "{data.headerText || `${data.hireabilityScore}/100 — Recruiters are nervous.`}"
          </h2>
        </motion.div>

        {/* B. Short Roast Lines */}
        <div style={{ marginBottom: "2rem" }}>
          {data.roastLines?.map((line: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card-matte"
              style={{
                display: "flex",
                overflow: "hidden",
                marginBottom: "0.75rem",
                padding: 0,
                background: "rgba(255,255,255,0.02)",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.05)"
              }}
            >
              <div style={{
                width: "4px",
                background: line.type === 'damage' ? 'linear-gradient(to bottom, #ef4444, #f97316)' :
                            line.type === 'positive' ? 'linear-gradient(to bottom, #22c55e, #10b981)' :
                            'linear-gradient(to bottom, #a855f7, #ec4899)',
                flexShrink: 0
              }} />
              <div style={{ padding: "1.25rem 1.5rem" }}>
                <p style={{ margin: 0, fontSize: "1rem", lineHeight: 1.5, color: "var(--text-primary)" }}>
                  {line.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* C. Improvements (Max 3) */}
        {data.improvements && data.improvements.length > 0 && (
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <AlertTriangle size={18} /> How to fix this disaster
            </h3>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {data.improvements.map((imp: any, i: number) => (
                <div key={i} style={{ 
                  display: "flex", gap: "1rem", alignItems: "center", 
                  padding: "1rem 1.25rem", 
                  background: "rgba(255,255,255,0.02)", 
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.05)"
                }}>
                  <div style={{ color: "#a855f7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Settings size={18} />
                  </div>
                  <span style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                    {imp.text || imp.suggestions?.[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* D. Positive Ending */}
        {data.positiveEnding && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              padding: "1.25rem",
              background: "rgba(34, 197, 94, 0.05)",
              border: "1px solid rgba(34, 197, 94, 0.15)",
              borderRadius: "12px",
              textAlign: "center",
              marginBottom: "2.5rem"
            }}
          >
            <p style={{ margin: 0, fontSize: "0.95rem", color: "var(--accent-lime)", fontStyle: "italic" }}>
              {data.positiveEnding}
            </p>
          </motion.div>
        )}

        {/* E. Raw Analytics (Bypasses AI quota) */}
        {data.metricsSummary && (
          <div style={{ marginBottom: "2.5rem" }}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <BarChart2 size={18} /> 
              {data.profileType === 'github' ? 'GitHub Analytics' : data.profileType === 'linkedin' ? 'LinkedIn Analytics' : 'Portfolio Analytics'}
            </h3>
            
            <div
              className="card-matte"
              style={{
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.05)",
                background: "#0d0d12",
                overflow: "hidden",
                fontFamily: "var(--font-mono)",
              }}
            >
              {/* Terminal Header */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.75rem 1rem",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                background: "rgba(255,255,255,0.02)",
              }}>
                <div style={{ display: "flex", gap: "6px" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#eab308" }} />
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e" }} />
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", letterSpacing: "0.05em" }}>
                  analysis_stream.sh
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.7rem", color: "#ef4444", fontWeight: 700, letterSpacing: "0.05em" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", animation: "pulse 2s infinite" }} />
                  LIVE
                </div>
              </div>

              {/* Terminal Body */}
              <div style={{ padding: "1.5rem", fontSize: "0.95rem", lineHeight: 1.8 }}>
                <div style={{ color: "var(--accent-cyan)", marginBottom: "1rem", fontWeight: 600 }}>
                  $ scanning @{data.username}/{data.profileType}...
                </div>
                
                {Object.values(data.metricsSummary).map((stat: any, i) => {
                  let color = "var(--text-primary)";
                  if (i === 1) color = "#eab308"; // yellow
                  if (i === 2) color = "#f97316"; // orange
                  if (i === 3) color = "var(--accent-cyan)"; // cyan or green

                  return (
                    <div key={i} style={{ display: "flex", gap: "0.75rem", color }}>
                      <span style={{ opacity: 0.7 }}>{`->`}</span>
                      <span>
                        {stat.label}: {stat.value}
                      </span>
                    </div>
                  );
                })}

                <div style={{ color: "var(--text-muted)", marginTop: "1rem", opacity: 0.5 }}>
                  analyzing<span className="typing-cursor"></span>
                </div>
              </div>
            </div>
          </div>
        )}

        <SharePrompt context="after-roast" />

        <div className="gradient-separator" />

        {/* Share Card */}
        <ShareCard data={data} />
      </main>
      <Footer />
    </>
  );
}
