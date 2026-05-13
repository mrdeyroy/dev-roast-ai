"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Flame, Eye, Sparkles } from "lucide-react";

const floatingEmojis = ["💀", "🔥", "😬", "☠️", "🤡"];

export default function HeroSection() {
  return (
    <section
      className="section"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        paddingTop: "6rem",
        paddingBottom: "4rem",
        position: "relative",
      }}
    >
      {/* Floating Emojis */}
      {floatingEmojis.map((emoji, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: [0, 0.6, 0],
            y: [20, -80 - i * 30, -140 - i * 40],
            x: [0, (i % 2 === 0 ? 1 : -1) * (20 + i * 15), (i % 2 === 0 ? -1 : 1) * 10],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            repeatDelay: 2 + i * 1.5,
            ease: "easeOut",
          }}
          style={{
            position: "absolute",
            fontSize: "1.5rem",
            top: `${35 + i * 8}%`,
            left: `${15 + i * 15}%`,
            pointerEvents: "none",
            zIndex: 0,
          }}
          aria-hidden="true"
        >
          {emoji}
        </motion.span>
      ))}

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="badge-pill"
        style={{ marginBottom: "2rem" }}
      >
        <span className="badge-pill-dot" />
        AI-Powered Developer Roasting
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        style={{
          fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
          maxWidth: 800,
          marginBottom: "1.5rem",
          lineHeight: 1.1,
          position: "relative",
          zIndex: 1,
        }}
      >
        Your GitHub called.
        <br />
        <span className="gradient-text">It needs help.</span>
      </motion.h1>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        style={{
          fontSize: "clamp(1rem, 2vw, 1.2rem)",
          color: "var(--text-secondary)",
          maxWidth: 600,
          marginBottom: "2.5rem",
          lineHeight: 1.6,
          position: "relative",
          zIndex: 1,
        }}
      >
        Paste your GitHub, LinkedIn, or portfolio and get roasted like
        a real recruiter would. <strong style={{ color: "var(--text-primary)" }}>Fun, savage, and actually useful.</strong>
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Link href="/roast" className="btn-gradient no-underline" style={{ fontSize: "1.05rem", padding: "0.9rem 2rem" }}>
          <Flame size={20} />
          Roast Me
        </Link>
        <Link href="/roast/demo-shibam-2024" className="btn-outline no-underline" style={{ fontSize: "1.05rem", padding: "0.9rem 2rem" }}>
          <Eye size={20} />
          View Demo Roast
        </Link>
      </motion.div>

      {/* Mini preview card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="card-matte hover-glow"
        style={{
          marginTop: "4rem",
          padding: "1.5rem 2rem",
          maxWidth: 500,
          width: "100%",
          textAlign: "left",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Sparkles size={16} style={{ color: "var(--accent-cyan)" }} />
            <span style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent-cyan)" }}>
              Sample Roast
            </span>
          </div>
          <span
            className="badge-pill"
            style={{
              padding: "0.2rem 0.6rem",
              fontSize: "0.7rem",
              background: "rgba(239, 68, 68, 0.12)",
              borderColor: "rgba(239, 68, 68, 0.3)",
              color: "var(--roast-nuclear)",
            }}
          >
            Nuclear 💀
          </span>
        </div>

        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.85rem",
            color: "var(--text-secondary)",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          &quot;Your contribution graph looks like a heart monitor — lots of flatlines with occasional panic spikes.&quot;
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--roast-nuclear)", fontWeight: 600, fontFamily: "var(--font-heading)" }}>
              42/100
            </span>
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Hireability</span>
          </div>
          <div style={{ width: 1, height: 12, background: "var(--glass-border)" }} />
          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Tutorial Warrior 🗡️</span>
        </div>
      </motion.div>
    </section>
  );
}
