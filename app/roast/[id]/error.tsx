"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Flame, RefreshCw, Home } from "lucide-react";

export default function RoastError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Roast page error:", error);
  }, [error]);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.5rem",
        position: "relative",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ maxWidth: 500, width: "100%", textAlign: "center", zIndex: 10 }}
      >
        {/* Animated glow flame box */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            background: "linear-gradient(135deg, #f43f5e, #a855f7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 2rem",
            boxShadow: "0 0 40px rgba(244, 63, 94, 0.3)",
          }}
        >
          <Flame size={40} color="#000" />
        </div>

        {/* Savage Fallback Error message */}
        <h1
          style={{
            fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
            marginBottom: "1rem",
            fontFamily: "var(--font-heading)",
            fontWeight: 700,
            color: "var(--text-primary)",
          }}
        >
          Emotionally <span className="gradient-text-fire">Overwhelmed</span> 💀
        </h1>
        
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "1rem",
            marginBottom: "2.5rem",
            lineHeight: 1.6,
          }}
        >
          The AI got emotionally overwhelmed by this profile. Even our trained LLMs couldn't digest the level of codebase disaster or buzzword cringe they just witnessed.
        </p>

        {/* Buttons */}
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => reset()}
            style={{
              padding: "0.8rem 1.5rem",
              borderRadius: "var(--radius-sm)",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)",
              color: "var(--text-primary)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            <RefreshCw size={16} />
            Try Again
          </motion.button>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/roast"
              className="btn-gradient-fire no-underline"
              style={{
                padding: "0.8rem 1.5rem",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                textDecoration: "none",
              }}
            >
              <Home size={16} />
              Go Back Home
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}
