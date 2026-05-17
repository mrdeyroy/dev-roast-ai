"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Menu, X, Star } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/roast/demo-shibam-2024", label: "Demo Roast" },
  { href: "/history", label: "History" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("/");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    setActiveLink(window.location.pathname);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(10, 10, 15, 0.8)" : "rgba(10, 10, 15, 0.3)",
        backdropFilter: scrolled ? "blur(24px) saturate(1.2)" : "blur(8px)",
        WebkitBackdropFilter: scrolled ? "blur(24px) saturate(1.2)" : "blur(8px)",
        borderBottom: scrolled
          ? "1px solid rgba(255,255,255,0.06)"
          : "1px solid transparent",
        boxShadow: scrolled
          ? "0 4px 30px rgba(0, 0, 0, 0.3)"
          : "none",
      }}
    >
      <div className="section flex items-center justify-between" style={{ padding: "1rem 1.5rem" }}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline group">
          <motion.div
            whileHover={{ scale: 1.05, rotate: -5 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center"
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))",
              boxShadow: "0 0 20px rgba(0, 229, 255, 0.15)",
            }}
          >
            <Flame size={20} color="#000" strokeWidth={2.5} />
          </motion.div>
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
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="no-underline text-sm relative"
              style={{
                color: activeLink === link.href ? "var(--text-primary)" : "var(--text-secondary)",
                fontWeight: 500,
                transition: "color 0.2s",
                padding: "0.25rem 0",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
              onMouseLeave={(e) => {
                if (activeLink !== link.href) {
                  e.currentTarget.style.color = "var(--text-secondary)";
                }
              }}
            >
              {link.label}
              {/* Animated underline */}
              <motion.span
                style={{
                  position: "absolute",
                  bottom: -2,
                  left: 0,
                  right: 0,
                  height: 2,
                  borderRadius: 1,
                  background: "linear-gradient(90deg, var(--accent-cyan), var(--accent-purple))",
                  transformOrigin: "left",
                }}
                initial={{ scaleX: activeLink === link.href ? 1 : 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.2 }}
              />
            </Link>
          ))}

          {/* GitHub Star Button */}
          <motion.a
            href="https://github.com/mrdeyroy/dev-roast-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
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
              transition: "all 0.3s",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(234, 179, 8, 0.12)";
              e.currentTarget.style.borderColor = "rgba(234, 179, 8, 0.5)";
              e.currentTarget.style.boxShadow = "0 0 20px rgba(234, 179, 8, 0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(234, 179, 8, 0.06)";
              e.currentTarget.style.borderColor = "rgba(234, 179, 8, 0.3)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <Star size={14} fill="#EAB308" />
            Star on GitHub
          </motion.a>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/roast"
              className="btn-gradient no-underline"
              style={{
                padding: "0.55rem 1.25rem",
                fontSize: "0.85rem",
                boxShadow: "0 0 20px rgba(0, 229, 255, 0.1)",
              }}
            >
              <Flame size={16} />
              <span>Roast Me</span>
            </Link>
          </motion.div>
        </div>

        {/* Mobile toggle */}
        <motion.button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          whileTap={{ scale: 0.9 }}
          style={{ background: "none", border: "none", color: "var(--text-primary)", cursor: "pointer" }}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden"
            style={{
              background: "rgba(10, 10, 15, 0.95)",
              backdropFilter: "blur(24px)",
              borderTop: "1px solid var(--glass-border)",
              padding: "1rem 1.5rem 1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="no-underline"
                style={{
                  color: "var(--text-secondary)",
                  fontWeight: 500,
                  fontSize: "1rem",
                  padding: "0.75rem 0",
                  borderBottom: "1px solid var(--glass-border)",
                }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://github.com/mrdeyroy/dev-roast-ai"
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
                padding: "0.75rem 0",
                borderBottom: "1px solid var(--glass-border)",
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
              style={{ textAlign: "center", justifyContent: "center", marginTop: "0.5rem" }}
              onClick={() => setMobileOpen(false)}
            >
              <Flame size={16} />
              Roast Me
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
