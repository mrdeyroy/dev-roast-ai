"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { CategoryRoast, RoastLine } from "@/lib/types/roast";

interface Props {
  data: CategoryRoast;
  index: number;
}

const severityMap: Record<string, { bg: string; border: string; color: string; label: string; glow: string }> = {
  mild: { bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.3)", color: "var(--roast-mild)", label: "Mild", glow: "rgba(59,130,246,0.1)" },
  medium: { bg: "rgba(234,179,8,0.1)", border: "rgba(234,179,8,0.3)", color: "var(--roast-medium)", label: "Medium", glow: "rgba(234,179,8,0.1)" },
  brutal: { bg: "rgba(249,115,22,0.1)", border: "rgba(249,115,22,0.3)", color: "var(--roast-brutal)", label: "Brutal 🔥", glow: "rgba(249,115,22,0.1)" },
  nuclear: { bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.3)", color: "var(--roast-nuclear)", label: "Nuclear ☠️", glow: "rgba(239,68,68,0.1)" },
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
      style={{
        marginBottom: "1rem",
        overflow: "hidden",
        borderLeft: expanded ? `3px solid ${severity.color}` : "3px solid transparent",
        transition: "border-left-color 0.3s ease",
      }}
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
        <motion.span
          animate={{ scale: expanded ? 1.15 : 1 }}
          transition={{ duration: 0.2 }}
          style={{ fontSize: "1.5rem" }}
        >
          {data.icon}
        </motion.span>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "1rem", fontWeight: 600, fontFamily: "var(--font-heading)" }}>
            {data.title}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.15rem" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              Score: {data.score}/100
            </span>
            {/* Mini score bar */}
            <div style={{ width: 50, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
              <div style={{
                width: `${data.score}%`,
                height: "100%",
                borderRadius: 2,
                background: severity.color,
                transition: "width 0.5s ease",
              }} />
            </div>
          </div>
        </div>

        {/* Severity badge */}
        <motion.span
          whileHover={{ scale: 1.05 }}
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
        </motion.span>

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
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.3 }}
                      style={{
                        display: "flex",
                        gap: "0.75rem",
                        marginBottom: "1rem",
                        alignItems: "flex-start",
                        padding: "0.5rem 0.75rem",
                        borderRadius: "var(--radius-sm)",
                        background: line.type === "damage" ? "rgba(239, 68, 68, 0.04)" : line.type === "positive" ? "rgba(132, 204, 22, 0.04)" : "transparent",
                        borderLeft: line.type === "damage" ? "2px solid var(--roast-nuclear)" : line.type === "positive" ? "2px solid var(--accent-lime)" : "2px solid transparent",
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
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
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
                    <div style={{ fontSize: "1rem", fontWeight: 700, fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
                      {metric.value}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
