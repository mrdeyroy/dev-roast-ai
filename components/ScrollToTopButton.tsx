"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button when scrolled down 300px
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          whileHover={{ y: -4, scale: 1.1, boxShadow: "0 0 20px rgba(0, 229, 255, 0.4)" }}
          whileTap={{ scale: 0.95 }}
          style={{
            position: "fixed",
            bottom: "2.5rem",
            right: "2.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "44px",
            height: "44px",
            background: "rgba(10, 10, 15, 0.75)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "50%",
            color: "var(--text-secondary)",
            cursor: "pointer",
            transition: "border-color 0.3s, color 0.3s, background-color 0.3s",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
            outline: "none",
            zIndex: 9999,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(0, 229, 255, 0.5)";
            e.currentTarget.style.color = "var(--text-primary)";
            e.currentTarget.style.background = "rgba(10, 10, 15, 0.9)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
            e.currentTarget.style.color = "var(--text-secondary)";
            e.currentTarget.style.background = "rgba(10, 10, 15, 0.75)";
          }}
          aria-label="Back to Top"
        >
          <ArrowUp size={20} style={{ color: "var(--accent-cyan)" }} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
