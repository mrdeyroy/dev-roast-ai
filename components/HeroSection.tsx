"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Flame, Eye, Sparkles, Zap, ArrowRight } from "lucide-react";

const floatingEmojis = ["💀", "🔥", "😬", "☠️", "🤡", "😤", "💥"];

const roastQuotes = [
  {
    text: "Your contribution graph looks like a heart monitor — lots of flatlines with occasional panic spikes.",
    score: 42,
    archetype: "Tutorial Warrior 🗡️",
    severity: "Nuclear 💀",
  },
  {
    text: "47 repositories. 2 deployments. Inspirational confidence.",
    score: 31,
    archetype: "Repo Hoarder 📦",
    severity: "Deep Fried 🍳",
  },
  {
    text: "Your README has more badges than your profile has contributions. That's modern art.",
    score: 38,
    archetype: "Badge Collector 🏅",
    severity: "Brutal 🔥",
  },
  {
    text: "Found 6 to-do apps, 3 weather apps, and a portfolio that links to... more portfolios.",
    score: 27,
    archetype: "Framework Tourist 🧳",
    severity: "Nuclear 💀",
  },
];

export default function HeroSection() {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [displayedScore, setDisplayedScore] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % roastQuotes.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Animate score counter
  useEffect(() => {
    const target = roastQuotes[currentQuote].score;
    setDisplayedScore(0);
    let start = 0;
    const increment = target / 30;
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setDisplayedScore(target);
        clearInterval(timer);
      } else {
        setDisplayedScore(Math.round(start));
      }
    }, 30);
    return () => clearInterval(timer);
  }, [currentQuote]);

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
            opacity: [0, 0.5, 0],
            y: [20, -100 - i * 25, -160 - i * 35],
            x: [0, (i % 2 === 0 ? 1 : -1) * (15 + i * 12), (i % 2 === 0 ? -1 : 1) * 8],
          }}
          transition={{
            duration: 5 + i * 0.4,
            repeat: Infinity,
            repeatDelay: 3 + i * 1.2,
            ease: "easeOut",
          }}
          style={{
            position: "absolute",
            fontSize: `${1.2 + (i % 3) * 0.3}rem`,
            top: `${30 + i * 7}%`,
            left: `${10 + i * 12}%`,
            pointerEvents: "none",
            zIndex: 0,
          }}
          aria-hidden="true"
        >
          {emoji}
        </motion.span>
      ))}

      {/* Decorative glow behind heading */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 400,
          background: "radial-gradient(ellipse, rgba(0, 229, 255, 0.06) 0%, transparent 70%)",
          pointerEvents: "none",
          filter: "blur(40px)",
        }}
        aria-hidden="true"
      />

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
          fontSize: "clamp(2.8rem, 7vw, 5rem)",
          maxWidth: 850,
          marginBottom: "1.5rem",
          lineHeight: 1.05,
          position: "relative",
          zIndex: 1,
          letterSpacing: "-0.03em",
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
          maxWidth: 620,
          marginBottom: "2.5rem",
          lineHeight: 1.7,
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
        <Link
          href="/roast"
          className="btn-gradient no-underline"
          style={{
            fontSize: "1.1rem",
            padding: "1rem 2.2rem",
            boxShadow: "0 0 40px rgba(0, 229, 255, 0.15)",
          }}
        >
          <Flame size={20} />
          <span>Roast Me</span>
          <motion.span
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowRight size={18} />
          </motion.span>
        </Link>
        <Link href="/roast/demo-shibam-2024" className="btn-outline no-underline" style={{ fontSize: "1.05rem", padding: "1rem 2rem" }}>
          <Eye size={20} />
          View Demo Roast
        </Link>
      </motion.div>

      {/* Auto-cycling roast preview card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="card-matte hover-glow glow-corners"
        style={{
          marginTop: "4rem",
          padding: "1.75rem 2rem",
          maxWidth: 540,
          width: "100%",
          textAlign: "left",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Card header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles size={16} style={{ color: "var(--accent-cyan)" }} />
            </motion.div>
            <span style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent-cyan)" }}>
              AI Scan Active
            </span>
            <div className="live-pulse" style={{ marginLeft: "0.25rem" }}>
              <div className="live-pulse-dot" style={{ width: 6, height: 6 }} />
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.span
              key={currentQuote}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="badge-pill"
              style={{
                padding: "0.2rem 0.6rem",
                fontSize: "0.65rem",
                background: "rgba(239, 68, 68, 0.12)",
                borderColor: "rgba(239, 68, 68, 0.3)",
                color: "var(--roast-nuclear)",
              }}
            >
              {roastQuotes[currentQuote].severity}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Roast text with typing feel */}
        <div style={{ minHeight: 52, position: "relative" }}>
          <AnimatePresence mode="wait">
            <motion.p
              key={currentQuote}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.82rem",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              &quot;{roastQuotes[currentQuote].text}&quot;
              <span className="typing-cursor" style={{ marginLeft: 0 }} />
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Bottom metrics */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid var(--glass-border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--roast-nuclear)", fontWeight: 700, fontFamily: "var(--font-heading)" }}>
              {displayedScore}/100
            </span>
            <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>Hireability</span>
          </div>
          <div style={{ width: 1, height: 12, background: "var(--glass-border)" }} />
          <AnimatePresence mode="wait">
            <motion.span
              key={currentQuote}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}
            >
              {roastQuotes[currentQuote].archetype}
            </motion.span>
          </AnimatePresence>
          <div style={{ marginLeft: "auto" }}>
            <Zap size={12} style={{ color: "var(--accent-purple)", opacity: 0.6 }} />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
