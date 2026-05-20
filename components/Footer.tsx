"use client";

import { motion } from "framer-motion";
import { Flame, Globe, ArrowUp } from "lucide-react";
import Link from "next/link";

const GithubIcon = ({ size = 24, ...props }: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4" />
  </svg>
);

const LinkedinIcon = ({ size = 24, ...props }: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const socialLinks = [
  { icon: GithubIcon, href: "https://github.com/mrdeyroy", label: "GitHub" },
  { icon: LinkedinIcon, href: "https://linkedin.com/in/shibamdeyroy", label: "LinkedIn" },
  { icon: Globe, href: "https://shibamdeyroy.vercel.app/", label: "Portfolio" },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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
        {/* Back to Top Button */}
        <motion.button
          onClick={scrollToTop}
          whileHover={{ y: -3, scale: 1.05, boxShadow: "0 0 20px rgba(0, 229, 255, 0.25)" }}
          whileTap={{ scale: 0.97 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "24px",
            padding: "0.55rem 1.1rem",
            color: "var(--text-secondary)",
            fontSize: "0.82rem",
            fontWeight: 600,
            fontFamily: "var(--font-heading)",
            cursor: "pointer",
            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            outline: "none",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(0, 229, 255, 0.5)";
            e.currentTarget.style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
            e.currentTarget.style.color = "var(--text-secondary)";
          }}
        >
          <ArrowUp size={14} style={{ color: "var(--accent-cyan)" }} />
          <span>Back to Top</span>
        </motion.button>

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
