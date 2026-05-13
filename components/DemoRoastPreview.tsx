"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal, Zap } from "lucide-react";

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
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2rem",
          alignItems: "center",
        }}
      >
        {/* Left — Text */}
        <div>
          <span className="section-label">Live Preview</span>
          <h2 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", marginBottom: "1rem" }}>
            AI analysis in{" "}
            <span className="gradient-text-fire">real time</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "1rem", marginBottom: "1.5rem" }}>
            Watch as our AI scans your profile, detects patterns, and crafts 
            personalized roasts that are equal parts devastating and helpful.
          </p>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            {[
              { label: "Profiles Roasted", value: "2,847" },
              { label: "Avg. Score", value: "47/100" },
              { label: "Tears Shed", value: "∞" },
            ].map((stat, i) => (
              <div key={i}>
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    fontFamily: "var(--font-heading)",
                    color: "var(--text-primary)",
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Terminal */}
        <div className="terminal" style={{ position: "relative" }}>
          <div className="terminal-header">
            <div className="terminal-dot" style={{ background: "#EF4444" }} />
            <div className="terminal-dot" style={{ background: "#EAB308" }} />
            <div className="terminal-dot" style={{ background: "#22C55E" }} />
            <span style={{ marginLeft: "0.5rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
              analysis_stream.sh
            </span>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--roast-nuclear)", animation: "badgePulse 1.5s ease infinite" }} />
              <span style={{ fontSize: "0.65rem", fontWeight: 600, color: "var(--roast-nuclear)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Live
              </span>
            </div>
          </div>
          <div className="terminal-body" style={{ minHeight: 280 }}>
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
          { icon: Terminal, label: "Roast Categories", value: "5 categories" },
          { icon: Zap, label: "Roast Modes", value: "5 modes" },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="card-matte"
              style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}
            >
              <Icon size={20} style={{ color: "var(--accent-cyan)" }} />
              <div>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>{item.value}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{item.label}</div>
              </div>
            </div>
          );
        })}
      </motion.div>
    </section>
  );
}
