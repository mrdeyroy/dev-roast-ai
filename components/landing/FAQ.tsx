"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";

const FAQS = [
  {
    question: "Is Dev Roast AI free?",
    answer: "Yes, it's completely free to use. We built this to bring some brutal honesty and fun to the developer community.",
  },
  {
    question: "Do you store my data?",
    answer: "We only fetch public data from your GitHub profile using the GitHub API. We store some anonymous usage statistics like your username and repo count to show on our live dashboard, but we do not store your code or private information.",
  },
  {
    question: "How does the AI generation work?",
    answer: "We analyze your GitHub metrics (commits, repos, languages, READMEs) and feed that data into our AI model along with a custom sarcastic prompt. The result is a personalized roast that actually reflects your coding habits.",
  },
  {
    question: "Will it work on mobile?",
    answer: "Absolutely. The interface is fully responsive, though we recommend viewing your roast on a desktop if you have a lot of repositories and complex metrics to display.",
  },
  {
    question: "Can I share my roast?",
    answer: "Yes! Every roast generates a unique URL that you can share with your friends, colleagues, or on social media. You can also screenshot the customized Share Card at the bottom of your roast page.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <section className="section" style={{ padding: "4rem 1.5rem" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ textAlign: "center", marginBottom: "3rem" }}
      >
        <span className="section-label">FAQ</span>
        <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 700, marginTop: "0.5rem" }}>
          Questions, <span className="gradient-text-fire">answered</span>
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", maxWidth: 450, margin: "0.75rem auto 0" }}>
          Everything you need to know before getting destroyed.
        </p>
      </motion.div>

      <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {FAQS.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="card-matte"
            style={{
              padding: "0",
              overflow: "hidden",
              border: openIndex === i ? "1px solid rgba(0, 229, 255, 0.2)" : "1px solid var(--glass-border)",
              transition: "border 0.3s",
            }}
          >
            <button
              onClick={() => toggle(i)}
              style={{
                width: "100%",
                padding: "1.25rem 1.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "transparent",
                border: "none",
                color: openIndex === i ? "var(--text-primary)" : "var(--text-primary)",
                fontSize: "1rem",
                fontWeight: 500,
                cursor: "pointer",
                textAlign: "left",
                gap: "1rem",
                fontFamily: "var(--font-heading)",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <HelpCircle
                  size={16}
                  style={{
                    color: openIndex === i ? "var(--accent-cyan)" : "var(--text-muted)",
                    transition: "color 0.3s",
                    flexShrink: 0,
                  }}
                />
                {faq.question}
              </span>
              <motion.div
                animate={{ rotate: openIndex === i ? 45 : 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  color: openIndex === i ? "var(--accent-cyan)" : "var(--text-muted)",
                  flexShrink: 0,
                }}
              >
                <Plus size={18} />
              </motion.div>
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    style={{
                      padding: "0 1.5rem 1.5rem 3rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.7,
                      fontSize: "0.92rem",
                    }}
                  >
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
