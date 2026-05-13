"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { CategoryRoast, RoastLine } from "@/lib/types/roast";

interface Props {
  data: CategoryRoast;
  index: number;
}

const severityMap: Record<string, { bg: string; border: string; color: string; label: string }> = {
  mild: { bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.3)", color: "var(--roast-mild)", label: "Mild" },
  medium: { bg: "rgba(234,179,8,0.1)", border: "rgba(234,179,8,0.3)", color: "var(--roast-medium)", label: "Medium" },
  brutal: { bg: "rgba(249,115,22,0.1)", border: "rgba(249,115,22,0.3)", color: "var(--roast-brutal)", label: "Brutal" },
  nuclear: { bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.3)", color: "var(--roast-nuclear)", label: "Nuclear ☠️" },
};

const lineTypeStyles: Record<RoastLine["type"], { emoji: string; color: string }> = {
  insult: { emoji: "🗣️", color: "var(--text-primary)" },
  damage: { emoji: "💀", color: "var(--roast-nuclear)" },
  analysis: { emoji: "📊", color: "var(--text-secondary)" },
  fix: { emoji: "🔧", color: "var(--accent-cyan)" },
  positive: { emoji: "✅", color: "var(--accent-lime)" },
};

const TrendIcon = ({ trend }: { trend?: "up" | "down" | "flat" }) => {
  if (trend === "up") return <TrendingUp size={12} style={{ color: "var(--accent-lime)" }} />;
  if (trend === "down") return <TrendingDown size={12} style={{ color: "var(--roast-nuclear)" }} />;
  return <Minus size={12} style={{ color: "var(--text-muted)" }} />;
};

export default function RoastCategory({ data, index }: Props) {
  const [expanded, setExpanded] = useState(index === 0);
  const severity = severityMap[data.severity] || severityMap.mild;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="card-matte"
      style={{ marginBottom: "1rem", overflow: "hidden" }}
    >
      {/* Header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%",
          padding: "1.25rem 1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: "var(--text-primary)",
          textAlign: "left",
        }}
      >
        <span style={{ fontSize: "1.5rem" }}>{data.icon}</span>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "1rem", fontWeight: 600, fontFamily: "var(--font-heading)" }}>
            {data.title}
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
            Score: {data.score}/100
          </div>
        </div>

        {/* Severity badge */}
        <span
          style={{
            padding: "0.25rem 0.75rem",
            borderRadius: 999,
            fontSize: "0.7rem",
            fontWeight: 600,
            background: severity.bg,
            border: `1px solid ${severity.border}`,
            color: severity.color,
          }}
        >
          {severity.label}
        </span>

        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={18} style={{ color: "var(--text-muted)" }} />
        </motion.div>
      </button>

      {/* Expandable content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "0 1.5rem 1.5rem", borderTop: "1px solid var(--glass-border)" }}>
              {/* Roast lines */}
              <div style={{ marginTop: "1.25rem" }}>
                {data.roastLines.map((line, i) => {
                  const style = lineTypeStyles[line.type];
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.3 }}
                      style={{
                        display: "flex",
                        gap: "0.75rem",
                        marginBottom: "1rem",
                        alignItems: "flex-start",
                      }}
                    >
                      <span style={{ fontSize: "1rem", flexShrink: 0, marginTop: "0.1rem" }}>
                        {style.emoji}
                      </span>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.88rem",
                          lineHeight: 1.6,
                          color: style.color,
                          fontFamily: line.type === "analysis" ? "var(--font-mono)" : "var(--font-body)",
                          fontStyle: line.type === "positive" ? "italic" : "normal",
                        }}
                      >
                        {line.type === "insult" || line.type === "damage" ? (
                          <>&ldquo;{line.text}&rdquo;</>
                        ) : (
                          line.text
                        )}
                      </p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Metrics */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                  gap: "0.75rem",
                  marginTop: "0.5rem",
                }}
              >
                {data.metrics.map((metric, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "0.75rem",
                      borderRadius: "var(--radius-sm)",
                      background: "rgba(0,0,0,0.25)",
                      border: "1px solid var(--glass-border)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                      <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        {metric.label}
                      </span>
                      <TrendIcon trend={metric.trend} />
                    </div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 700, fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
                      {metric.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
