"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import type { Improvement } from "@/lib/types/roast";

interface Props {
  improvements: Improvement[];
}

export default function ImprovementSection({ improvements }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {/* Section header with gradient border */}
      <div
        style={{
          padding: "2px",
          borderRadius: "var(--radius)",
          background: "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple), var(--accent-lime))",
          marginBottom: "1.25rem",
        }}
      >
        <div
          style={{
            background: "var(--bg-card)",
            borderRadius: "calc(var(--radius) - 2px)",
            padding: "1.5rem",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: "1.4rem", marginBottom: "0.4rem" }}>
            How to become <span className="gradient-text">employable</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", margin: 0 }}>
            Enough roasting. Here&apos;s how to actually fix this.
          </p>
        </div>
      </div>

      {/* Improvement cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1rem",
        }}
      >
        {improvements.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
            className="card-matte"
            style={{ padding: "1.5rem" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
              <span style={{ fontSize: "1.4rem" }}>{item.icon}</span>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 600, margin: 0 }}>{item.category}</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {item.suggestions.map((suggestion, j) => (
                <div
                  key={j}
                  style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}
                >
                  <CheckCircle
                    size={14}
                    style={{ color: "var(--accent-lime)", flexShrink: 0, marginTop: "0.2rem" }}
                  />
                  <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    {suggestion}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
