"use client";

import { motion } from "framer-motion";
import { Share2, MessageCircle } from "lucide-react";

interface Props {
  context: string;
  score?: number;
  archetypeName?: string;
}

export default function SharePrompt({ context, score, archetypeName }: Props) {
  const messages: Record<string, { text: string; emoji: string }> = {
    "after-score": {
      text: "This score is too embarrassing to keep private",
      emoji: "📢",
    },
    "after-roast": {
      text: "This one hit hard 💀 Share the damage",
      emoji: "💀",
    },
    "after-archetype": {
      text: `I'm a ${archetypeName || "Tutorial Warrior"} 🗡️ What are you?`,
      emoji: "🤔",
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
        <span style={{ fontSize: "1rem" }}>{message.emoji}</span>
        <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
          {message.text}
        </span>
      </div>
      <button
        className="btn-outline"
        style={{ padding: "0.35rem 0.8rem", fontSize: "0.75rem" }}
      >
        <Share2 size={12} />
        Share
      </button>
    </motion.div>
  );
}
