"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Trash2, Search, ArrowRight, Skull, Globe, Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getRoasts, deleteRoast, clearRoasts, HistoryRoast } from "@/lib/storage/history";

const GithubIcon = ({ size = 14, ...props }: any) => (
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

const LinkedinIcon = ({ size = 14, ...props }: any) => (
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

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryRoast[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "github" | "linkedin" | "portfolio">("all");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load history on mount
    setHistory(getRoasts());
    setLoading(false);
  }, []);

  const handleDelete = (id: string) => {
    handleDeleteRoast(id);
  };

  const handleDeleteRoast = (id: string) => {
    deleteRoast(id);
    setHistory(getRoasts());
  };

  const handleClearAll = () => {
    clearRoasts();
    setHistory([]);
    setShowClearConfirm(false);
  };

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.username.toLowerCase().includes(search.toLowerCase()) ||
      item.archetype.toLowerCase().includes(search.toLowerCase()) ||
      item.funniestLine.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filter === "all" ? true : item.type === filter;

    return matchesSearch && matchesFilter;
  });

  const getPlatformIcon = (type: "github" | "linkedin" | "portfolio") => {
    switch (type) {
      case "github":
        return <GithubIcon size={14} style={{ marginRight: 6 }} />;
      case "linkedin":
        return <LinkedinIcon size={14} style={{ marginRight: 6 }} />;
      case "portfolio":
        return <Globe size={14} style={{ marginRight: 6 }} />;
    }
  };

  const getPlatformBadgeStyles = (type: "github" | "linkedin" | "portfolio") => {
    switch (type) {
      case "github":
        return {
          background: "rgba(0, 229, 255, 0.08)",
          borderColor: "rgba(0, 229, 255, 0.2)",
          color: "var(--accent-cyan)",
        };
      case "linkedin":
        return {
          background: "rgba(168, 85, 247, 0.08)",
          borderColor: "rgba(168, 85, 247, 0.2)",
          color: "var(--accent-purple)",
        };
      case "portfolio":
        return {
          background: "rgba(132, 204, 22, 0.08)",
          borderColor: "rgba(132, 204, 22, 0.2)",
          color: "var(--accent-lime)",
        };
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Recently";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
  };

  return (
    <>
      <Navbar />
      <main
        className="section"
        style={{
          paddingTop: "6.5rem",
          paddingBottom: "5rem",
          maxWidth: 900,
          margin: "0 auto",
          minHeight: "calc(100vh - 120px)",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="badge-pill"
            style={{
              background: "rgba(255,255,255,0.03)",
              borderColor: "rgba(255,255,255,0.08)",
              color: "var(--text-muted)",
              fontSize: "0.75rem",
              marginBottom: "1rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Sparkles size={12} color="var(--accent-purple)" />
            Your Personal Roast Archive
          </motion.div>
          
          <motion.h1
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "2.5rem",
              fontWeight: 800,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
              marginBottom: "0.75rem",
            }}
          >
            Damage <span className="gradient-text-fire">History</span>
          </motion.h1>
          
          <motion.p
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05 }}
            style={{
              color: "var(--text-secondary)",
              maxWidth: 500,
              margin: "0 auto",
              fontSize: "0.95rem",
              lineHeight: 1.6,
            }}
          >
            Revisit every single time our AI demolished your coding confidence. Fully private, stored 100% locally in your browser.
          </motion.p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
            <RefreshCw size={24} className="animate-spin" color="var(--accent-cyan)" />
          </div>
        ) : (
          <>
            {history.length > 0 ? (
              <div>
                {/* Search & Filter Toolbar */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "1rem",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "2rem",
                  }}
                >
                  {/* Left: Filters */}
                  <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.25rem" }}>
                    {(["all", "github", "linkedin", "portfolio"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setFilter(t)}
                        className={`badge-pill no-underline cursor-pointer`}
                        style={{
                          background: filter === t ? "rgba(255,255,255,0.08)" : "transparent",
                          borderColor: filter === t ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.06)",
                          color: filter === t ? "var(--text-primary)" : "var(--text-muted)",
                          textTransform: "capitalize",
                          fontSize: "0.75rem",
                          fontWeight: 500,
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  {/* Right: Search & Clear Button */}
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", width: "100%", maxWidth: "450px", flexGrow: 1 }}>
                    <div style={{ position: "relative", flexGrow: 1 }}>
                      <Search
                        size={15}
                        color="var(--text-muted)"
                        style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}
                      />
                      <input
                        type="text"
                        placeholder="Search history..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                          width: "100%",
                          background: "rgba(255,255,255,0.02)",
                          border: "1px solid rgba(255,255,255,0.06)",
                          borderRadius: "8px",
                          padding: "0.5rem 1rem 0.5rem 2.25rem",
                          fontSize: "0.85rem",
                          color: "var(--text-primary)",
                          outline: "none",
                          fontFamily: "var(--font-body)",
                          transition: "border-color 0.2s",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "rgba(0, 229, 255, 0.4)")}
                        onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.06)")}
                      />
                    </div>

                    <button
                      onClick={() => setShowClearConfirm(true)}
                      style={{
                        background: "rgba(239, 68, 68, 0.06)",
                        border: "1px solid rgba(239, 68, 68, 0.15)",
                        borderRadius: "8px",
                        color: "#ef4444",
                        padding: "0.5rem 1rem",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(239, 68, 68, 0.12)";
                        e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(239, 68, 68, 0.06)";
                        e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.15)";
                      }}
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                {/* History Grid */}
                <AnimatePresence mode="popLayout">
                  {filteredHistory.length > 0 ? (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="show"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                        gap: "1.25rem",
                      }}
                    >
                      {filteredHistory.map((item) => (
                        <motion.div
                          key={item.id}
                          variants={cardVariants}
                          layout
                          className="card-matte"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            background: "rgba(255,255,255,0.015)",
                            borderRadius: "14px",
                            border: "1px solid rgba(255,255,255,0.05)",
                            padding: "1.25rem",
                            position: "relative",
                            overflow: "hidden",
                            height: "230px",
                          }}
                        >
                          {/* Inner Matte Header */}
                          <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                              {/* Platform Badge */}
                              <span
                                className="badge-pill"
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  padding: "0.2rem 0.55rem",
                                  fontSize: "0.65rem",
                                  fontWeight: 600,
                                  textTransform: "uppercase",
                                  letterSpacing: "0.05em",
                                  borderRadius: "6px",
                                  ...getPlatformBadgeStyles(item.type),
                                }}
                              >
                                {getPlatformIcon(item.type)}
                                {item.type}
                              </span>

                              {/* Score Badges */}
                              <span
                                style={{
                                  fontSize: "0.85rem",
                                  fontWeight: 700,
                                  fontFamily: "var(--font-mono)",
                                  color:
                                    item.score >= 70
                                      ? "var(--accent-lime)"
                                      : item.score >= 40
                                      ? "#eab308"
                                      : "var(--roast-nuclear)",
                                }}
                              >
                                {item.score}/100
                              </span>
                            </div>

                            {/* User & Archetype */}
                            <h3
                              style={{
                                fontSize: "1.1rem",
                                fontWeight: 700,
                                color: "var(--text-primary)",
                                fontFamily: "var(--font-heading)",
                                margin: "0 0 0.25rem 0",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              {item.type === "github" ? `@${item.username}` : item.username}
                            </h3>
                            
                            <div
                              style={{
                                fontSize: "0.75rem",
                                color: "var(--accent-purple)",
                                fontWeight: 600,
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                marginBottom: "0.75rem",
                              }}
                            >
                              {item.archetype}
                            </div>

                            {/* Funniest Line */}
                            <p
                              style={{
                                fontSize: "0.8rem",
                                color: "var(--text-secondary)",
                                lineHeight: 1.5,
                                fontStyle: "italic",
                                margin: 0,
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                opacity: 0.85,
                              } as any}
                            >
                              "{item.funniestLine || "Recruiters left the chat."}"
                            </p>
                          </div>

                          {/* Footer / CTA Actions */}
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              borderTop: "1px solid rgba(255,255,255,0.04)",
                              paddingTop: "0.75rem",
                              marginTop: "0.75rem",
                            }}
                          >
                            <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>
                              {formatDate(item.createdAt)}
                            </span>

                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              {/* Delete individual */}
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="history-delete-btn"
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  padding: "0.35rem",
                                  borderRadius: "6px",
                                  cursor: "pointer",
                                  color: "var(--text-muted)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  transition: "all 0.2s",
                                }}
                                title="Delete roast history entry"
                              >
                                <Trash2 size={14} />
                              </button>

                              <Link href={item.shareUrl} style={{ textDecoration: "none" }}>
                                <motion.div
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className="btn-gradient"
                                  style={{
                                    padding: "0.35rem 0.75rem",
                                    fontSize: "0.7rem",
                                    fontWeight: 600,
                                    borderRadius: "6px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                  }}
                                >
                                  <span>View Roast</span>
                                  <ArrowRight size={10} />
                                </motion.div>
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        textAlign: "center",
                        padding: "3rem 1.5rem",
                        background: "rgba(255,255,255,0.01)",
                        borderRadius: "14px",
                        border: "1px solid rgba(255,255,255,0.05)",
                        color: "var(--text-muted)",
                        fontSize: "0.9rem",
                      }}
                    >
                      No roasts found matching "{search}" under {filter}.
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Empty State */
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  textAlign: "center",
                  padding: "4rem 2rem",
                  background: "rgba(255,255,255,0.015)",
                  borderRadius: "16px",
                  border: "1px solid rgba(255,255,255,0.05)",
                  maxWidth: "500px",
                  margin: "0 auto",
                }}
              >
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: "12px",
                    background: "rgba(0, 229, 255, 0.08)",
                    border: "1px solid rgba(0, 229, 255, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.5rem",
                    color: "var(--accent-cyan)",
                  }}
                >
                  <Skull size={22} />
                </div>
                
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginBottom: "0.5rem",
                  }}
                >
                  Your archive is safe... for now.
                </h3>
                
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.5,
                    marginBottom: "1.75rem",
                  }}
                >
                  No previous roasts found. Have you been hiding your codebase, or are you just too terrified? Let's fix that.
                </p>

                <Link href="/roast" style={{ textDecoration: "none" }}>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn-gradient"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.6rem 1.5rem",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      borderRadius: "8px",
                      margin: "0 auto",
                    }}
                  >
                    <Flame size={16} />
                    <span>Roast Yourself</span>
                  </motion.div>
                </Link>
              </motion.div>
            )}
          </>
        )}
      </main>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showClearConfirm && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.75)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              zIndex: 999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1.5rem",
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{
                width: "100%",
                maxWidth: "400px",
                background: "#0d0d12",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "16px",
                padding: "1.5rem",
                boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
              }}
            >
              <div style={{ display: "flex", gap: "1rem", marginBottom: "1.25rem" }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "rgba(239, 68, 68, 0.08)",
                    border: "1px solid rgba(239, 68, 68, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ef4444",
                    flexShrink: 0,
                  }}
                >
                  <AlertCircle size={20} />
                </div>
                <div>
                  <h4
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      margin: "0 0 0.5rem 0",
                    }}
                  >
                    Delete all emotional damage history?
                  </h4>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
                    This action is permanent and completely irreversible. All stored roasts will be wiped from your browser storage.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "8px",
                    color: "var(--text-secondary)",
                    padding: "0.5rem 1rem",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearAll}
                  style={{
                    background: "#ef4444",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "0.5rem 1.25rem",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  Clear Everything
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />

      {/* Global CSS styles for deletion and hover turning red */}
      <style jsx global>{`
        .history-delete-btn:hover {
          color: #ef4444 !important;
          background: rgba(239, 68, 68, 0.08) !important;
        }
      `}</style>
    </>
  );
}
