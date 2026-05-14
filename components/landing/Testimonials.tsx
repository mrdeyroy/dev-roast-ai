"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    quote: "Instantly polished profile with zero fiddling. Love the flow.",
    author: "Noah",
    role: "DevRel",
    emoji: "🎯",
  },
  {
    quote: "Brutally honest but exactly what my portfolio needed to stand out.",
    author: "Sarah",
    role: "Frontend Engineer",
    emoji: "💅",
  },
  {
    quote: "The AI saw right through my tutorial projects. Roasted me into actually building something real.",
    author: "Alex",
    role: "Full Stack Dev",
    emoji: "🔥",
  },
  {
    quote: "Sent this to my whole team. We spent an hour roasting each other instead of coding.",
    author: "Jordan",
    role: "Engineering Manager",
    emoji: "😂",
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ textAlign: "center", marginBottom: "2rem" }}
      >
        <span className="section-label">Testimonials</span>
        <h3
          style={{
            fontSize: "clamp(1.5rem, 3vw, 2rem)",
            fontWeight: 700,
            marginTop: "0.5rem",
          }}
        >
          Loved by <span className="gradient-text">developers</span>
        </h3>
      </motion.div>

      <div
        style={{
          maxWidth: 800,
          margin: "0 auto",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          className="card-glass"
          style={{
            minHeight: 200,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2.5rem 2rem",
            position: "relative",
          }}
        >
          {/* Decorative quote icon */}
          <Quote
            size={40}
            style={{
              position: "absolute",
              top: 20,
              left: 24,
              color: "var(--accent-purple)",
              opacity: 0.1,
            }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              style={{ textAlign: "center", width: "100%" }}
            >
              <span style={{ fontSize: "2rem", marginBottom: "0.75rem", display: "block" }}>
                {TESTIMONIALS[currentIndex].emoji}
              </span>
              <p
                style={{
                  fontSize: "1.15rem",
                  color: "var(--text-primary)",
                  fontWeight: 500,
                  lineHeight: 1.6,
                  marginBottom: "1.25rem",
                  maxWidth: 550,
                  margin: "0 auto 1.25rem",
                }}
              >
                &ldquo;{TESTIMONIALS[currentIndex].quote}&rdquo;
              </p>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "var(--text-secondary)",
                }}
              >
                <strong style={{ color: "var(--text-primary)" }}>
                  {TESTIMONIALS[currentIndex].author}
                </strong>
                <span style={{ color: "var(--text-muted)", margin: "0 0.5rem" }}>·</span>
                {TESTIMONIALS[currentIndex].role}
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
                width: i === currentIndex ? 28 : 8,
                height: 8,
                borderRadius: 4,
                background: i === currentIndex
                  ? "linear-gradient(90deg, var(--accent-cyan), var(--accent-purple))"
                  : "rgba(255,255,255,0.1)",
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
