"use client";

import { motion } from "framer-motion";
import { Flame, Code2, BriefcaseBusiness, Globe } from "lucide-react";
import Link from "next/link";

const socialLinks = [
  { icon: Code2, href: "https://github.com/mrdeyroy", label: "GitHub" },
  { icon: BriefcaseBusiness, href: "https://linkedin.com/in/shibamdeyroy", label: "LinkedIn" },
  { icon: Globe, href: "https://shibamdeyroy.vercel.app/", label: "Portfolio" },
];

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: "auto",
        position: "relative",
      }}
    >
      {/* Gradient top border */}
      <div className="gradient-separator" style={{ margin: 0 }} />

      <div
        className="section"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.75rem",
          textAlign: "center",
          padding: "3rem 1.5rem",
        }}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Flame size={18} color="#000" />
          </div>
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "1rem",
              color: "var(--text-primary)",
            }}
          >
            Dev Roast<span style={{ color: "var(--accent-cyan)" }}>.AI</span>
          </span>
        </motion.div>

        {/* Links */}
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { href: "/", label: "Home" },
            { href: "/roast", label: "Get Roasted" },
            { href: "/roast/demo-shibam-2024", label: "Demo" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="no-underline"
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.85rem",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Social */}
        <div style={{ display: "flex", gap: "0.75rem" }}>
          {socialLinks.map((social, i) => {
            const Icon = social.icon;
            return (
              <motion.a
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="card-matte"
                style={{
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 10,
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                title={social.label}
              >
                <Icon size={18} />
              </motion.a>
            );
          })}
        </div>

        {/* Tagline */}
        <p
          style={{
            fontSize: "0.78rem",
            color: "var(--text-muted)",
            margin: 0,
          }}
        >
          Made with 🔥 and questionable career choices
        </p>
      </div>
    </footer>
  );
}
