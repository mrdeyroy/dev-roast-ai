"use client";

import { motion } from "framer-motion";

export default function RoastLoadingSkeleton() {
  return (
    <main
      style={{
        paddingTop: "6rem",
        paddingBottom: "4rem",
        maxWidth: 700,
        margin: "0 auto",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
      }}
    >
      {/* Platform Badge Skeleton */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
        <div
          className="skeleton"
          style={{
            width: 180,
            height: 24,
            borderRadius: 999,
          }}
        />
      </div>

      {/* Main Score Header Card Skeleton */}
      <div
        className="card-matte"
        style={{
          padding: "2rem",
          borderRadius: 24,
          border: "1px solid rgba(255, 255, 255, 0.05)",
          marginBottom: "2.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5rem",
        }}
      >
        <div className="skeleton" style={{ width: 100, height: 100, borderRadius: "50%" }} />
        <div className="skeleton" style={{ width: 220, height: 32, borderRadius: 8 }} />
        <div className="skeleton" style={{ width: 140, height: 18, borderRadius: 6 }} />
        <div className="skeleton" style={{ width: 280, height: 16, borderRadius: 6 }} />
      </div>

      {/* Separator Skeleton */}
      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginBottom: "2rem" }}>
        <div className="skeleton" style={{ width: 10, height: 10, borderRadius: "50%" }} />
        <div className="skeleton" style={{ width: 60, height: 2, alignSelf: "center" }} />
        <div className="skeleton" style={{ width: 10, height: 10, borderRadius: "50%" }} />
      </div>

      {/* Main Punchline Skeleton */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "2.5rem" }}>
        <div className="skeleton" style={{ width: "80%", height: 28, borderRadius: 6 }} />
      </div>

      {/* Savage Roast Lines Skeletons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "3rem" }}>
        {[1, 2, 3].map((idx) => (
          <div
            key={idx}
            className="card-matte"
            style={{
              padding: "1.25rem 1.5rem",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.05)",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            <div className="skeleton" style={{ width: "95%", height: 16, borderRadius: 4 }} />
            <div className="skeleton" style={{ width: "60%", height: 16, borderRadius: 4 }} />
          </div>
        ))}
      </div>

      {/* Style overrides for skeleton pulse */}
      <style jsx global>{`
        .skeleton {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.03) 25%,
            rgba(255, 255, 255, 0.08) 50%,
            rgba(255, 255, 255, 0.03) 75%
          );
          background-size: 200% 100%;
          animation: skeleton-pulse 1.6s infinite linear;
        }

        @keyframes skeleton-pulse {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </main>
  );
}
