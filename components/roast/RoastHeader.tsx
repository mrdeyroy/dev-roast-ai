"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Flame } from "lucide-react";
import type { RoastResult } from "@/lib/types/roast";
import { getRoastLevel, getSeverityClass } from "@/lib/utils";

interface Props {
  data: RoastResult;
}

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.round(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return <>{count}</>;
}

export default function RoastHeader({ data }: Props) {
  const roastLevel = getRoastLevel(data.hireabilityScore);
  const severityClass = getSeverityClass(data.hireabilityScore);

  const getScoreComment = (score: number) => {
    if (score >= 80) return "Recruiters are impressed. Rare.";
    if (score >= 60) return "You might survive a screening call.";
    if (score >= 40) return "Recruiters are nervous.";
    if (score >= 20) return "Consider a career change.";
    return "Absolutely unemployable.";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ marginBottom: "2rem" }}
    >
      {/* Score Card */}
      <div
        className="card-glass"
        style={{
          padding: "2.5rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          marginBottom: "1.25rem",
        }}
      >
        {/* Decorative glow */}
        <div
          style={{
            position: "absolute",
            top: "-50%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${data.hireabilityScore >= 50 ? "rgba(0,229,255,0.06)" : "rgba(239,68,68,0.06)"} 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        {/* Archetype badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="badge-pill"
          style={{
            marginBottom: "1.5rem",
            display: "inline-flex",
            background: "rgba(168, 85, 247, 0.12)",
            borderColor: "rgba(168, 85, 247, 0.3)",
            color: "var(--accent-purple)",
            fontSize: "0.85rem",
            padding: "0.4rem 1.2rem",
          }}
        >
          <span style={{ fontSize: "1.1rem" }}>{data.archetype.emoji}</span>
          {data.archetype.name}
        </motion.div>

        {/* Main score */}
        <div className="score-display" style={{ color: "var(--text-primary)", marginBottom: "0.5rem" }}>
          <AnimatedCounter target={data.hireabilityScore} />
          <span style={{ fontSize: "1.5rem", color: "var(--text-muted)" }}>/100</span>
        </div>

        <p style={{ color: "var(--text-secondary)", fontSize: "1rem", marginBottom: "1.5rem" }}>
          {getScoreComment(data.hireabilityScore)}
        </p>

        {/* Roast level + Placement */}
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div
            className={severityClass}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.4rem 1rem",
              borderRadius: 999,
              fontSize: "0.8rem",
              fontWeight: 600,
              border: "1px solid",
            }}
          >
            <Flame size={14} />
            {roastLevel}
          </div>

          {data.placementReadiness > 0 && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.4rem 1rem",
                borderRadius: 999,
                fontSize: "0.8rem",
                fontWeight: 600,
                background: "rgba(132, 204, 22, 0.1)",
                border: "1px solid rgba(132, 204, 22, 0.3)",
                color: "var(--accent-lime)",
              }}
            >
              <GraduationCap size={14} />
              Placement: <AnimatedCounter target={data.placementReadiness} />/100
            </div>
          )}
        </div>
      </div>

      {/* Archetype description */}
      <div className="card-matte" style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
        <span style={{ fontSize: "2rem" }}>{data.archetype.emoji}</span>
        <div>
          <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)" }}>
            You are: {data.archetype.name}
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            {data.archetype.description}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
