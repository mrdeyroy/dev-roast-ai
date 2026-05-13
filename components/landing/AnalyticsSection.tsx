"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Activity, Users, Box, GitBranch, Link as LinkIcon, ExternalLink } from "lucide-react";

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

export default function AnalyticsSection() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <section className="section" style={{ padding: "4rem 1.5rem" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.5rem",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        {/* Usage Analytics */}
        <div className="card-matte" style={{ padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem", color: "var(--text-muted)" }}>
            <TrendingUp size={16} color="var(--accent-cyan)" />
            <span style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Usage Analytics
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(168, 85, 247, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Users size={18} color="#a855f7" />
                </div>
                <span style={{ fontWeight: 500, color: "var(--text-primary)" }}>Profiles</span>
              </div>
              <span style={{ fontSize: "1.2rem", fontWeight: 700 }}>
                {loading ? "..." : data?.totalProfiles || 0}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(234, 179, 8, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Box size={18} color="#eab308" />
                </div>
                <span style={{ fontWeight: 500, color: "var(--text-primary)" }}>Repositories</span>
              </div>
              <span style={{ fontSize: "1.2rem", fontWeight: 700 }}>
                {loading ? "..." : data?.totalRepositories || 0}
              </span>
            </div>

            <div style={{ height: 1, background: "var(--glass-border)", margin: "0.5rem 0" }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.05em", color: "var(--text-muted)", textTransform: "uppercase" }}>
                Total Generated
              </span>
              <span style={{ fontSize: "1.2rem", fontWeight: 700 }}>
                {loading ? "..." : data?.totalGenerated || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Live Activity */}
        <div className="card-matte" style={{ padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem", color: "var(--text-muted)" }}>
            <Activity size={16} color="var(--accent-purple)" />
            <span style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Live Activity
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", minHeight: 180 }}>
            {loading ? (
              <div style={{ textAlign: "center", color: "var(--text-muted)", marginTop: "2rem" }}>Loading activity...</div>
            ) : data?.recentActivity.length === 0 ? (
              <div style={{ textAlign: "center", color: "var(--text-muted)", marginTop: "2rem" }}>No activity yet. Be the first!</div>
            ) : (
              data?.recentActivity.slice(0, 3).map((activity, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.75rem", background: "rgba(255,255,255,0.03)", borderRadius: "var(--radius-md)", border: "1px solid var(--glass-border)" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(168, 85, 247, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Users size={14} color="#a855f7" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)" }}>{activity.username}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{activity.type}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.7rem", color: "var(--text-muted)" }}>
            REAL-TIME UPDATES VIA SUPABASE
          </div>
        </div>

        {/* Creator */}
        <div className="card-matte" style={{ padding: "2rem", display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
            Creator
          </div>

          <h2 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "1rem" }}>
            Let's build <span className="gradient-text-fire">together</span>
          </h2>

          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "2rem", flex: 1 }}>
            Found this helpful? Follow the journey on social media or reach out for collaborations.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <a href="https://github.com/mrdeyroy" target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.75rem", borderRadius: "var(--radius-md)", color: "var(--text-primary)", border: "1px solid var(--glass-border)", textDecoration: "none", fontSize: "0.9rem" }}>
              <GitBranch size={16} /> GitHub
            </a>
            <a href="https://linkedin.com/in/shibamdeyroy" target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.75rem", borderRadius: "var(--radius-md)", color: "var(--text-primary)", border: "1px solid var(--glass-border)", textDecoration: "none", fontSize: "0.9rem" }}>
              <LinkIcon size={16} /> LinkedIn
            </a>
          </div>

          <a href="https://shibamdeyroy.vercel.app/" target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.75rem", borderRadius: "var(--radius-md)", color: "var(--text-primary)", border: "1px solid var(--glass-border)", textDecoration: "none", fontSize: "0.9rem", width: "100%" }}>
            View Portfolio <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
