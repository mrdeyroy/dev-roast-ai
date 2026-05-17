"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Activity,
  Users,
  Box,
  GitBranch,
  Link as LinkIcon,
  ExternalLink,
  Flame,
  Skull,
  AlertTriangle,
  Briefcase,
} from "lucide-react";

interface AnalyticsData {
  totalProfiles: number;
  totalRepositories: number;
  totalGenerated: number;
  recentActivity: Array<{
    username: string;
    timestamp: string;
    type: string;
  }>;
}

/* ——— Animated counter with glow ——— */
function AnimatedCounter({ target, duration = 2000, suffix = "" }: { target: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [counting, setCounting] = useState(true);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    setCounting(true);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
        setCounting(false);
      } else {
        setCount(Math.round(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return (
    <span ref={ref} className={`counter-glow ${counting ? "counting" : ""}`}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

/* ——— Mini Sparkline ——— */
function Sparkline({ data, color = "var(--accent-cyan)" }: { data: number[]; color?: string }) {
  return (
    <div className="sparkline-container">
      {data.map((value, i) => (
        <div
          key={i}
          className="sparkline-bar"
          style={{
            height: `${Math.max(4, (value / Math.max(...data)) * 100)}%`,
            background: `linear-gradient(to top, ${color}33, ${color})`,
            animationDelay: `${i * 0.05}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ——— Fake live activity messages ——— */
const LIVE_ROAST_MESSAGES = [
  { text: "someone just got roasted for 14 unfinished side projects", icon: "🔥", color: "var(--roast-nuclear)" },
  { text: "README detected with 37 badges and no documentation", icon: "📛", color: "var(--roast-brutal)" },
  { text: "another React weather app found in the wild", icon: "🌦️", color: "var(--roast-medium)" },
  { text: "recruiter confidence dropped by 17%", icon: "📉", color: "var(--roast-nuclear)" },
  { text: "AI discovered another unfinished SaaS", icon: "💀", color: "var(--text-muted)" },
  { text: "portfolio contained 9 unnecessary animations", icon: "✨", color: "var(--roast-brutal)" },
  { text: "contribution graph diagnosed as 'flatline with panic spikes'", icon: "📊", color: "var(--roast-medium)" },
  { text: "found someone with 47 repos and 0 deployments", icon: "🚀", color: "var(--roast-nuclear)" },
  { text: "tutorial project disguised as original work detected", icon: "🕵️", color: "var(--roast-brutal)" },
  { text: "LinkedIn buzzword density exceeded safe levels", icon: "💼", color: "var(--roast-medium)" },
  { text: "someone's entire GitHub is forked repos", icon: "🍴", color: "var(--roast-nuclear)" },
  { text: "empty portfolio with 'coming soon' since 2023", icon: "⏳", color: "var(--roast-brutal)" },
];

/* ——— Today's Worst Offense messages ——— */
const TODAYS_OFFENSES = [
  "47 repositories. 2 deployments. Inspirational confidence.",
  "README.md longer than their actual codebase.",
  "'Full Stack Developer' with only frontend repos.",
  "Used 14 frameworks to build one TODO app.",
  "Portfolio contains more animations than projects.",
  "Committed node_modules to the repo. Twice.",
  "Last commit was 'fixed typo' 6 months ago.",
];

export default function AnalyticsSection() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(0);
  const [currentOffense, setCurrentOffense] = useState(0);

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setData(result.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Simulate live activity feed popping one by one, resetting, and repeating
  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCount((prev) => {
        if (prev >= 6) {
          // Pause for 3 seconds before resetting
          setTimeout(() => setVisibleCount(0), 3000);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // Cycle offenses
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentOffense((prev) => (prev + 1) % TODAYS_OFFENSES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const sparkData1 = [3, 7, 4, 8, 6, 9, 5, 11, 7, 13, 8, 15, 10, 12];
  const sparkData2 = [2, 5, 3, 9, 6, 4, 8, 12, 7, 10, 14, 9, 11, 16];

  const safeProfiles = data?.totalProfiles || 0;
  const safeRepos = data?.totalRepositories || 0;
  const safeGenerated = data?.totalGenerated || 0;

  return (
    <section className="section" style={{ padding: "4rem 1.5rem" }}>
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: "center", marginBottom: "3rem" }}
      >
        <span className="section-label">Live Dashboard</span>
        <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", marginBottom: "0.75rem" }}>
          The damage so far
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "1rem", maxWidth: 500, margin: "0 auto" }}>
          Real-time stats from developers brave enough to face the truth.
        </p>
      </motion.div>

      {/* Featured Stat Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="featured-stat-card"
        style={{
          padding: "2.5rem 2rem",
          textAlign: "center",
          maxWidth: 500,
          margin: "0 auto 2rem",
          position: "relative",
        }}
      >
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--accent-cyan)", marginBottom: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
            <Flame size={14} />
            Featured Stat
          </div>
          <div style={{ fontSize: "clamp(3rem, 8vw, 4.5rem)", fontWeight: 700, fontFamily: "var(--font-heading)", lineHeight: 1 }}>
            {loading ? (
              <span style={{ color: "var(--text-muted)" }}>...</span>
            ) : (
              <span className="gradient-text">
                <AnimatedCounter target={safeGenerated || 128} duration={2500} />
              </span>
            )}
          </div>
          <div style={{ fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginTop: "0.5rem" }}>
            Developers Cooked This Week
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginTop: "1rem" }}>
            <span style={{ fontSize: "0.72rem", color: "var(--accent-lime)", fontWeight: 600 }}>
              +42 today
            </span>
            <span style={{ fontSize: "0.72rem", color: "var(--roast-brutal)", fontWeight: 600 }}>
              🔥 trending
            </span>
          </div>
        </div>
      </motion.div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.5rem",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        {/* Roast Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card-matte glow-corners"
          style={{ padding: "2rem" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem", color: "var(--text-muted)" }}>
            <TrendingUp size={16} color="var(--accent-cyan)" />
            <span style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Roast Analytics
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Developers Roasted */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(168, 85, 247, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Skull size={18} color="#a855f7" />
                </div>
                <div>
                  <span style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.9rem" }}>Developers Roasted</span>
                  <div style={{ fontSize: "0.65rem", color: "var(--accent-lime)", fontWeight: 600, marginTop: "0.15rem" }}>+18 this hour</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "1.4rem", fontWeight: 700, fontFamily: "var(--font-heading)" }}>
                  {loading ? "..." : <AnimatedCounter target={safeProfiles} />}
                </div>
                <Sparkline data={sparkData1} color="var(--accent-purple)" />
              </div>
            </div>

            {/* Repositories Judged */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(234, 179, 8, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Box size={18} color="#eab308" />
                </div>
                <div>
                  <span style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.9rem" }}>Repos Judged</span>
                  <div style={{ fontSize: "0.65rem", color: "var(--roast-brutal)", fontWeight: 600, marginTop: "0.15rem" }}>🔥 trending</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "1.4rem", fontWeight: 700, fontFamily: "var(--font-heading)" }}>
                  {loading ? "..." : <AnimatedCounter target={safeRepos} />}
                </div>
                <Sparkline data={sparkData2} color="var(--roast-medium)" />
              </div>
            </div>

            <div className="gradient-separator" style={{ margin: "0.25rem 0" }} />

            {/* Recent Profiles */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                <Activity size={16} color="var(--accent-purple)" />
                <span style={{ fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.05em", color: "var(--text-muted)", textTransform: "uppercase" }}>
                  Recent Victims
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {(() => {
                  const formatTimeAgo = (timestampStr: string): string => {
                    try {
                      const date = new Date(timestampStr);
                      const now = new Date();
                      const diffMs = now.getTime() - date.getTime();
                      const diffSec = Math.floor(diffMs / 1000);
                      if (diffSec < 60) return "just now";
                      const diffMin = Math.floor(diffSec / 60);
                      if (diffMin < 60) return `${diffMin}m ago`;
                      const diffHour = Math.floor(diffMin / 60);
                      if (diffHour < 24) return `${diffHour}h ago`;
                      const diffDay = Math.floor(diffHour / 24);
                      return `${diffDay}d ago`;
                    } catch {
                      return "recently";
                    }
                  };

                  const fallbackVictims = [
                    { name: "@johndoe", type: "GitHub", time: "2m ago" },
                    { name: "@sarah_dev", type: "LinkedIn", time: "5m ago" },
                    { name: "alexander.dev", type: "Portfolio", time: "12m ago" }
                  ];

                  const victims = data?.recentActivity && data.recentActivity.length > 0
                    ? data.recentActivity.slice(0, 3).map((act) => {
                        let displayName = act.username;
                        // Clean legacy/default names
                        if (displayName === "linkedin-roast") displayName = "linkedin_user";
                        if (displayName === "portfolio-roast") displayName = "portfolio_site";

                        const isDomain = displayName.includes(".");
                        const name = isDomain ? displayName : (displayName.startsWith("@") ? displayName : `@${displayName}`);

                        const type = isDomain || displayName.includes("portfolio") || act.type === "PORTFOLIO"
                          ? "Portfolio"
                          : displayName.toLowerCase().includes("linkedin") || act.type === "LINKEDIN"
                            ? "LinkedIn"
                            : "GitHub";

                        return {
                          name,
                          type,
                          time: formatTimeAgo(act.timestamp)
                        };
                      })
                    : fallbackVictims;

                  return victims.map((profile, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.02)", padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: i === 0 ? "var(--roast-nuclear)" : i === 1 ? "var(--accent-cyan)" : "var(--accent-lime)" }} />
                        <span style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: 500 }}>{profile.name}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{profile.type}</span>
                        <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>{profile.time}</span>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Live Activity Feed — Terminal Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="terminal"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div className="terminal-header">
            <div className="terminal-dot" style={{ background: "#EF4444" }} />
            <div className="terminal-dot" style={{ background: "#EAB308" }} />
            <div className="terminal-dot" style={{ background: "#22C55E" }} />
            <span style={{ marginLeft: "0.5rem", fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              live_roast_feed.sh
            </span>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <div className="live-pulse-dot" style={{ width: 6, height: 6 }} />
              <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "var(--roast-nuclear)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Live
              </span>
            </div>
          </div>

          <div className="terminal-body activity-feed activity-feed-mask" style={{ flex: 1, height: 320, overflow: "hidden", padding: "0.75rem 1rem" }}>
            <AnimatePresence>
              {LIVE_ROAST_MESSAGES.slice(0, visibleCount).map((msg, i) => {
                const age = (visibleCount - 1 - i) * 3;
                const ageText = age === 0 ? "now" : `${age}s ago`;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -15, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                    className="activity-line"
                    style={{ opacity: 1 - (visibleCount - 1 - i) * 0.15 }}
                  >
                    <span style={{ fontSize: "0.85rem", flexShrink: 0 }}>{msg.icon}</span>
                    <span style={{ fontSize: "0.75rem", color: msg.color, fontFamily: "var(--font-mono)", lineHeight: 1.4 }}>
                      {msg.text}
                    </span>
                    <span style={{ fontSize: "0.55rem", color: "var(--text-muted)", marginLeft: "auto", flexShrink: 0, fontFamily: "var(--font-mono)" }}>
                      {ageText}
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <div style={{ padding: "0.6rem 1rem", borderTop: "1px solid var(--glass-border)", textAlign: "center", fontSize: "0.6rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Real-time roast activity feed
          </div>
        </motion.div>

        {/* Today's Worst Offense + Creator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {/* Today's Worst Offense Widget */}
          <div
            className="card-glass"
            style={{
              padding: "1.75rem",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background: "linear-gradient(90deg, var(--roast-medium), var(--roast-brutal), var(--roast-nuclear))",
            }} />
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <Flame size={14} color="var(--roast-nuclear)" />
              <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--roast-nuclear)" }}>
                Today&apos;s Worst Offense
              </span>
            </div>
            <div style={{ minHeight: 48 }}>
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentOffense}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: "var(--text-primary)",
                    lineHeight: 1.5,
                    margin: 0,
                    fontStyle: "italic",
                  }}
                >
                  &ldquo;{TODAYS_OFFENSES[currentOffense]}&rdquo;
                </motion.p>
              </AnimatePresence>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem" }}>
              {TODAYS_OFFENSES.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === currentOffense ? 20 : 6,
                    height: 3,
                    borderRadius: 2,
                    background: i === currentOffense ? "var(--roast-nuclear)" : "rgba(255,255,255,0.1)",
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Creator Card */}
          <div className="card-matte" style={{ padding: "2rem", display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
              Creator
            </div>

            <h2 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "1rem" }}>
              Let&apos;s build <span className="gradient-text-fire">together</span>
            </h2>

            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "2rem", flex: 1 }}>
              Found this helpful? Follow the journey on social media or reach out for collaborations.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <a href="https://github.com/mrdeyroy" target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.75rem", borderRadius: "var(--radius-sm)", color: "var(--text-primary)", border: "1px solid var(--glass-border)", textDecoration: "none", fontSize: "0.9rem" }}>
                <GitBranch size={16} /> GitHub
              </a>
              <a href="https://linkedin.com/in/shibamdeyroy" target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.75rem", borderRadius: "var(--radius-sm)", color: "var(--text-primary)", border: "1px solid var(--glass-border)", textDecoration: "none", fontSize: "0.9rem" }}>
                <LinkIcon size={16} /> LinkedIn
              </a>
            </div>

            <a href="https://shibamdeyroy.vercel.app/" target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.75rem", borderRadius: "var(--radius-sm)", color: "var(--text-primary)", border: "1px solid var(--glass-border)", textDecoration: "none", fontSize: "0.9rem", width: "100%" }}>
              View Portfolio <ExternalLink size={16} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
