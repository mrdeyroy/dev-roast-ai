"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Flame, Zap, Shield } from "lucide-react";
import type { RoastResult } from "@/lib/types/roast";
import { getRoastLevel, getSeverityClass } from "@/lib/utils";

interface Props {
  data: RoastResult;
}

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    setDone(false);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
        setDone(true);
      } else {
        setCount(Math.round(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return <span className={`counter-glow ${!done ? "counting" : ""}`}>{count}</span>;
}

/* ——— Dynamic Roast Meter ——— */
function RoastMeter({ score }: { score: number }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(100 - score), 300);
    return () => clearTimeout(timer);
  }, [score]);

  const getLevel = (s: number) => {
    if (s >= 75) return { label: "Mild", color: "var(--roast-mild)", emoji: "😌" };
    if (s >= 50) return { label: "Cooked", color: "var(--roast-medium)", emoji: "😰" };
    if (s >= 25) return { label: "Deep Fried", color: "var(--roast-brutal)", emoji: "😵" };
    return { label: "Nuclear", color: "var(--roast-nuclear)", emoji: "💀" };
  };

  const level = getLevel(score);

  return (
    <div style={{ marginTop: "1.5rem", padding: "0 1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
        <span style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)" }}>
          Roast Intensity
        </span>
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5 }}
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            color: level.color,
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
          }}
        >
          {level.emoji} {level.label}
        </motion.span>
      </div>
      <div className="roast-meter-track" style={{ height: 10, borderRadius: 5 }}>
        <motion.div
          className="roast-meter-fill"
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 1.8, ease: [0.34, 1.56, 0.64, 1], delay: 0.5 }}
          style={{
            height: "100%",
            borderRadius: 5,
            position: "relative",
          }}
        />
      </div>
      {/* Level markers */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.4rem" }}>
        {["Mild", "Cooked", "Deep Fried", "Nuclear"].map((label, i) => (
          <span key={label} style={{ fontSize: "0.55rem", color: "var(--text-muted)", opacity: 0.6 }}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function RoastHeader({ data }: Props) {
  const roastLevel = getRoastLevel(data.hireabilityScore);
  const severityClass = getSeverityClass(data.hireabilityScore);

  const getScoreComment = (score: number) => {
    if (score >= 80) return "Recruiters are impressed. Rare.";
    if (score >= 60) return "You might survive a screening call.";
    if (score >= 40) return "Recruiters are concerned.";
    if (score >= 20) return "Consider a career pivot.";
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
          padding: "3rem 2.5rem 2rem",
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
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${data.hireabilityScore >= 50 ? "rgba(0,229,255,0.08)" : "rgba(239,68,68,0.08)"} 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        {/* Archetype badge — dramatic reveal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          className="badge-pill"
          style={{
            marginBottom: "1.5rem",
            display: "inline-flex",
            background: "rgba(168, 85, 247, 0.12)",
            borderColor: "rgba(168, 85, 247, 0.3)",
            color: "var(--accent-purple)",
            fontSize: "0.9rem",
            padding: "0.5rem 1.4rem",
            fontWeight: 600,
          }}
        >
          <span style={{ fontSize: "1.2rem" }}>{data.archetype.emoji}</span>
          {data.archetype.name}
        </motion.div>

        {/* Main score — HUGE */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 100, damping: 12 }}
          className="score-display"
          style={{ color: "var(--text-primary)", marginBottom: "0.5rem" }}
        >
          <AnimatedCounter target={data.hireabilityScore} />
          <span style={{ fontSize: "1.8rem", color: "var(--text-muted)", fontWeight: 400 }}>/100</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{
            color: "var(--text-secondary)",
            fontSize: "1.1rem",
            marginBottom: "0.5rem",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {getScoreComment(data.hireabilityScore)}
        </motion.p>

        {/* Roast level + Placement */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}
        >
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
        </motion.div>

        {/* Roast Meter */}
        <RoastMeter score={data.hireabilityScore} />
      </div>

      {/* Archetype description */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
        className="card-matte glow-corners"
        style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}
      >
        <span style={{ fontSize: "2.5rem" }}>{data.archetype.emoji}</span>
        <div>
          <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>
            You are: {data.archetype.name}
          </div>
          <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5, marginTop: "0.2rem" }}>
            {data.archetype.description}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
