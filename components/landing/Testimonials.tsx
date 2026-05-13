"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TESTIMONIALS = [
  {
    quote: "Instantly polished profile with zero fiddling. Love the flow.",
    author: "Noah",
    role: "DevRel",
  },
  {
    quote: "Brutally honest but exactly what my portfolio needed to stand out.",
    author: "Sarah",
    role: "Frontend Engineer",
  },
  {
    quote: "The AI saw right through my tutorial projects. Roasted me into actually building something real.",
    author: "Alex",
    role: "Full Stack Dev",
  },
  {
    quote: "Sent this to my whole team. We spent an hour roasting each other instead of coding.",
    author: "Jordan",
    role: "Engineering Manager",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="section" style={{ padding: "4rem 1.5rem" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h3
          style={{
            fontSize: "0.85rem",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "var(--text-muted)",
            fontWeight: 600,
          }}
        >
          Loved by developers
        </h3>
      </div>

      <div
        style={{
          maxWidth: 800,
          margin: "0 auto",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          className="card-matte"
          style={{
            minHeight: 180,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem 1.5rem",
            position: "relative",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              style={{ textAlign: "center", width: "100%" }}
            >
              <p
                style={{
                  fontSize: "1.1rem",
                  color: "var(--text-primary)",
                  fontWeight: 500,
                  lineHeight: 1.6,
                  marginBottom: "1rem",
                }}
              >
                "{TESTIMONIALS[currentIndex].quote}"
              </p>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "var(--text-secondary)",
                }}
              >
                {TESTIMONIALS[currentIndex].author} <span style={{ color: "var(--text-muted)", margin: "0 0.4rem" }}>•</span> {TESTIMONIALS[currentIndex].role}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Dots */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.5rem",
            marginTop: "1.5rem",
          }}
        >
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              style={{
                width: i === currentIndex ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: i === currentIndex ? "var(--accent-cyan)" : "rgba(255,255,255,0.1)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
                padding: 0,
              }}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
