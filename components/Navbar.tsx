"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Flame, Menu, X, Star } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(10, 10, 15, 0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
      }}
    >
      <div className="section flex items-center justify-between" style={{ padding: "1rem 1.5rem" }}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <div
            className="flex items-center justify-center"
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))",
            }}
          >
            <Flame size={20} color="#000" strokeWidth={2.5} />
          </div>
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "1.1rem",
              color: "var(--text-primary)",
            }}
          >
            Dev Roast
            <span style={{ color: "var(--accent-cyan)" }}>.AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="no-underline text-sm"
            style={{ color: "var(--text-secondary)", fontWeight: 500, transition: "color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
          >
            Home
          </Link>
          <Link
            href="/roast/demo-shibam-2024"
            className="no-underline text-sm"
            style={{ color: "var(--text-secondary)", fontWeight: 500, transition: "color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
          >
            Demo Roast
          </Link>

          {/* GitHub Star Button */}
          <a
            href="https://github.com/ShibamDey-cmd/Dev-RoastAI"
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.45rem 0.9rem",
              borderRadius: "var(--radius-sm)",
              border: "1px solid rgba(234, 179, 8, 0.3)",
              background: "rgba(234, 179, 8, 0.06)",
              color: "#EAB308",
              fontSize: "0.82rem",
              fontWeight: 600,
              fontFamily: "var(--font-heading)",
              transition: "all 0.2s",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(234, 179, 8, 0.12)";
              e.currentTarget.style.borderColor = "rgba(234, 179, 8, 0.5)";
              e.currentTarget.style.boxShadow = "0 0 12px rgba(234, 179, 8, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(234, 179, 8, 0.06)";
              e.currentTarget.style.borderColor = "rgba(234, 179, 8, 0.3)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <Star size={14} fill="#EAB308" />
            Star on GitHub
          </a>

          <Link href="/roast" className="btn-gradient no-underline" style={{ padding: "0.55rem 1.25rem", fontSize: "0.85rem" }}>
            <Flame size={16} />
            Roast Me
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ background: "none", border: "none", color: "var(--text-primary)", cursor: "pointer" }}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden"
          style={{
            background: "rgba(10, 10, 15, 0.95)",
            backdropFilter: "blur(20px)",
            borderTop: "1px solid var(--glass-border)",
            padding: "1rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <Link
            href="/"
            className="no-underline"
            style={{ color: "var(--text-secondary)", fontWeight: 500, fontSize: "1rem", padding: "0.5rem 0" }}
            onClick={() => setMobileOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/roast/demo-shibam-2024"
            className="no-underline"
            style={{ color: "var(--text-secondary)", fontWeight: 500, fontSize: "1rem", padding: "0.5rem 0" }}
            onClick={() => setMobileOpen(false)}
          >
            Demo Roast
          </Link>
          <a
            href="https://github.com/ShibamDey-cmd/Dev-RoastAI"
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              color: "#EAB308",
              fontWeight: 600,
              fontSize: "1rem",
              padding: "0.5rem 0",
              textDecoration: "none",
            }}
            onClick={() => setMobileOpen(false)}
          >
            <Star size={16} fill="#EAB308" />
            Star on GitHub
          </a>
          <Link
            href="/roast"
            className="btn-gradient no-underline"
            style={{ textAlign: "center", justifyContent: "center" }}
            onClick={() => setMobileOpen(false)}
          >
            <Flame size={16} />
            Roast Me
          </Link>
        </motion.div>
      )}
    </motion.nav>
  );
}
