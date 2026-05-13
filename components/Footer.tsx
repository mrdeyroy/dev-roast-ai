"use client";

import { Flame, Code2, BriefcaseBusiness, Globe } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--glass-border)",
        padding: "3rem 0",
        marginTop: "auto",
      }}
    >
      <div
        className="section"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2rem",
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
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
        </div>

        {/* Links */}
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/" className="no-underline" style={{ color: "var(--text-secondary)", fontSize: "0.85rem", transition: "color 0.2s" }}>
            Home
          </Link>
          <Link href="/roast" className="no-underline" style={{ color: "var(--text-secondary)", fontSize: "0.85rem", transition: "color 0.2s" }}>
            Get Roasted
          </Link>
          <Link href="/roast/demo-shibam-2024" className="no-underline" style={{ color: "var(--text-secondary)", fontSize: "0.85rem", transition: "color 0.2s" }}>
            Demo
          </Link>
        </div>

        {/* Social */}
        <div style={{ display: "flex", gap: "1rem" }}>
          {[Code2, BriefcaseBusiness, Globe].map((Icon, i) => (
            <a
              key={i}
              href="#"
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
            >
              <Icon size={18} />
            </a>
          ))}
        </div>

        {/* Tagline */}
        <p
          style={{
            fontSize: "0.8rem",
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
