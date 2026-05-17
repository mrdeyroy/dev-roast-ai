"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal, Zap, Skull, TrendingDown } from "lucide-react";

const analysisLines = [
  { text: "$ scanning @shibam/github...", color: "var(--accent-cyan)" },
  { text: "→ Found 47 repositories", color: "var(--text-secondary)" },
  { text: "→ 38 repos inactive (6+ months)", color: "var(--roast-medium)" },
  { text: "→ README quality: concerning", color: "var(--roast-brutal)" },
  { text: "→ Deployed projects: 0", color: "var(--roast-nuclear)" },
  { text: "→ Badge-to-content ratio: infinity", color: "var(--roast-nuclear)" },
  { text: "→ Archetype: Tutorial Warrior 🗡️", color: "var(--accent-purple)" },
  { text: "$ roast.generate() // sorry not sorry", color: "var(--accent-lime)" },
];

export default function DemoRoastPreview() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [totalRoasted, setTotalRoasted] = useState<string>("...");

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => res.json())
      .then((result) => {
        if (result.success && result.data) {
          setTotalRoasted(result.data.totalGenerated.toLocaleString());
        }
      })
      .catch(() => setTotalRoasted("14,028")); // Fallback if API fails
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= analysisLines.length) {
          // Reset after a pause
          setTimeout(() => setVisibleLines(0), 2000);
          return prev;
        }
        return prev + 1;
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="section" style={{ paddingBottom: "var(--section-gap)" }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "2.5rem",
          alignItems: "center",
        }}
      >
        {/* Left — Text */}
        <div style={{ flex: "1 1 400px", minWidth: 0 }}>
          <span className="section-label">Live Preview</span>
          <h2 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", marginBottom: "1rem" }}>
            AI analysis in{" "}
            <span className="gradient-text-fire">real time</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "1rem", marginBottom: "2rem" }}>
            Watch as our AI scans your profile, detects patterns, and crafts
            personalized roasts that are equal parts devastating and helpful.
          </p>
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            {[
              { label: "Developers Roasted", value: totalRoasted, trend: "+15", icon: Skull },
              { label: "Avg. Score", value: "47/100", trend: "-3", icon: TrendingDown },
              { label: "Tears Shed", value: "∞", trend: "↑", icon: null },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <div
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: 700,
                    fontFamily: "var(--font-heading)",
                    color: "var(--text-primary)",
                    lineHeight: 1.1,
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: "0.6rem", color: "var(--accent-lime)", fontWeight: 600, marginTop: "0.15rem" }}>
                  {stat.trend} this week
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right — Terminal */}
        <div className="terminal glow-corners" style={{ position: "relative", flex: "1 1 400px", minWidth: 0 }}>
          <div className="terminal-header">
            <div className="terminal-dot" style={{ background: "#EF4444" }} />
            <div className="terminal-dot" style={{ background: "#EAB308" }} />
            <div className="terminal-dot" style={{ background: "#22C55E" }} />
            <span style={{ marginLeft: "0.5rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
              analysis_stream.sh
            </span>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <div className="live-pulse-dot" style={{ width: 6, height: 6 }} />
              <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "var(--roast-nuclear)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Live
              </span>
            </div>
          </div>
          <div className="terminal-body" style={{ height: 280, overflow: "hidden" }}>
            {analysisLines.slice(0, visibleLines).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  color: line.color,
                  marginBottom: "0.5rem",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.82rem",
                }}
              >
                {line.text}
              </motion.div>
            ))}
            {visibleLines < analysisLines.length && (
              <span className="typing-cursor" style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
                analyzing
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Bottom stats row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginTop: "3rem",
        }}
      >
        {[
          { icon: Terminal, label: "Roast Categories", value: "5 categories", desc: "Deep analysis" },
          { icon: Zap, label: "Roast Modes", value: "5 modes", desc: "From mild to nuclear" },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={i}
              whileHover={{ y: -3 }}
              className="card-matte"
              style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem", cursor: "default" }}
            >
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "rgba(0, 229, 255, 0.08)",
                border: "1px solid rgba(0, 229, 255, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <Icon size={18} style={{ color: "var(--accent-cyan)" }} />
              </div>
              <div>
                <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)" }}>{item.value}</div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{item.label}</div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
