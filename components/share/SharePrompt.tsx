"use client";

import { motion } from "framer-motion";
import { Share2 } from "lucide-react";

interface Props {
  context: string;
  score?: number;
  archetypeName?: string;
}

export default function SharePrompt({ context, score, archetypeName }: Props) {
  const messages: Record<string, { text: string; emoji: string; color: string }> = {
    "after-score": {
      text: "Your friends need to see this disaster.",
      emoji: "📢",
      color: "var(--roast-nuclear)",
    },
    "after-roast": {
      text: "Share your emotional damage with the world.",
      emoji: "💀",
      color: "var(--roast-brutal)",
    },
    "after-archetype": {
      text: `Recruiters were warned. Were your friends?`,
      emoji: "⚠️",
      color: "var(--roast-medium)",
    },
  };

  const message = messages[context] || messages["after-roast"];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.75rem 1.25rem",
        borderRadius: "var(--radius-sm)",
        background: "rgba(168, 85, 247, 0.06)",
        border: "1px solid rgba(168, 85, 247, 0.15)",
        marginTop: "0.75rem",
        marginBottom: "0.75rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          style={{ fontSize: "1rem" }}
        >
          {message.emoji}
        </motion.span>
        <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 500 }}>
          {message.text}
        </span>
      </div>
      <button
        className="btn-outline"
        style={{
          padding: "0.35rem 0.8rem",
          fontSize: "0.75rem",
          borderColor: "rgba(168, 85, 247, 0.3)",
        }}
      >
        <Share2 size={12} />
        Share
      </button>
    </motion.div>
  );
}
