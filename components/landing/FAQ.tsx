"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

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
    answer: "We analyze your GitHub metrics (commits, repos, languages, READMEs) and feed that data into Google's Gemini AI model along with a custom sarcastic prompt. The result is a personalized roast that actually reflects your coding habits.",
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
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h3
          style={{
            fontSize: "0.85rem",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "var(--text-muted)",
            fontWeight: 600,
            marginBottom: "1rem",
          }}
        >
          FAQ
        </h3>
        <h2 style={{ fontSize: "2.5rem", fontWeight: 700 }}>
          Questions, <span className="gradient-text-fire">answered</span>
        </h2>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
        {FAQS.map((faq, i) => (
          <div
            key={i}
            className="card-matte"
            style={{
              padding: "0",
              overflow: "hidden",
              border: openIndex === i ? "1px solid rgba(255,255,255,0.15)" : "1px solid var(--glass-border)",
              transition: "border 0.3s",
            }}
          >
            <button
              onClick={() => toggle(i)}
              style={{
                width: "100%",
                padding: "1.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "transparent",
                border: "none",
                color: "var(--text-primary)",
                fontSize: "1.05rem",
                fontWeight: 500,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              {faq.question}
              <motion.div
                animate={{ rotate: openIndex === i ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                style={{ color: "var(--text-muted)" }}
              >
                {openIndex === i ? <Minus size={20} /> : <Plus size={20} />}
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
                      padding: "0 1.5rem 1.5rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.6,
                      fontSize: "0.95rem",
                    }}
                  >
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
