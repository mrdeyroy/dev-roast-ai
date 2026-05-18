import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getRoastById } from "@/lib/roast-db";
import { DEMO_ROAST } from "@/lib/mock-data";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Try to fetch real roast, otherwise fallback to demo
    let roast = await getRoastById(id);
    if (!roast && id === "demo-shibam-2024") {
      roast = DEMO_ROAST as any;
    }

    if (!roast) {
      return new Response(`Roast not found`, { status: 404 });
    }

    const username = roast.username || "Developer";
    const score = roast.hireabilityScore || 0;
    const archetype = roast.archetype?.name || "Mystery Dev";
    const emoji = roast.archetype?.emoji || "🕵️";
    const funniestLine = roast.roastLines?.[0]?.text || "The AI was too stunned to speak.";

    // Convert score to severity
    let severityLabel = "Nuclear 💀";
    let severityColor = "#f43f5e"; // bright red
    let bgGlow = "#991b1b"; // dark red
    
    if (score >= 75) {
      severityLabel = "Mild ☕";
      severityColor = "#10b981"; // emerald green
      bgGlow = "#064e3b";
    } else if (score >= 50) {
      severityLabel = "Medium 🔔";
      severityColor = "#f59e0b"; // amber
      bgGlow = "#78350f";
    } else if (score >= 25) {
      severityLabel = "Brutal ⚡";
      severityColor = "#f97316"; // orange
      bgGlow = "#7c2d12";
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#08080c",
            backgroundImage: `radial-gradient(circle at 80% 20%, ${bgGlow}44 0%, #08080c 60%)`,
            color: "white",
            padding: "60px",
            fontFamily: "sans-serif",
            position: "relative",
          }}
        >
          {/* Subtle grid pattern background */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              opacity: 0.8,
            }}
          />

          {/* Left Column: Branding, Username, and Burn Line */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "60%",
              height: "100%",
              justifyContent: "space-between",
              zIndex: 10,
            }}
          >
            {/* Logo / Brand */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ fontSize: 32, fontWeight: 900, color: "white", letterSpacing: "-0.05em" }}>
                Dev Roast<span style={{ color: "#a855f7" }}>.AI</span>
              </span>
            </div>

            {/* Profile Info & Burn */}
            <div style={{ display: "flex", flexDirection: "column", margin: "20px 0" }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: 18, color: "#a855f7", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {roast.profileType === "github" ? `@${username}` : username}
                </span>
              </div>
              
              <div
                style={{
                  fontSize: 54,
                  fontWeight: 900,
                  color: "white",
                  lineHeight: 1.1,
                  marginBottom: "24px",
                  letterSpacing: "-0.02em",
                }}
              >
                {emoji} {archetype}
              </div>

              {/* Killer Roast Line (Quote Card) */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "24px 30px",
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                  borderLeft: `5px solid ${severityColor}`,
                  borderRadius: "0 16px 16px 0",
                  width: "100%",
                }}
              >
                <div style={{ fontSize: 18, color: "#888", fontStyle: "italic", marginBottom: "8px", fontWeight: 600 }}>
                  Funniest Roast Line
                </div>
                <div
                  style={{
                    fontSize: 22,
                    color: "#e2e8f0",
                    fontWeight: 500,
                    lineHeight: 1.4,
                  }}
                >
                  "{funniestLine}"
                </div>
              </div>
            </div>

            {/* Footer Website */}
            <div style={{ display: "flex", color: "#666", fontSize: 16, fontWeight: 600 }}>
              devroastai.vercel.app
            </div>
          </div>

          {/* Right Column: Score Gauge */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "35%",
              zIndex: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(10, 10, 15, 0.7)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                padding: "45px 35px",
                borderRadius: "32px",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
                width: "280px",
                height: "360px",
              }}
            >
              <span
                style={{
                  fontSize: 16,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  fontWeight: 700,
                  marginBottom: "20px",
                }}
              >
                Hireability
              </span>

              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "center",
                  position: "relative",
                  marginBottom: "20px",
                }}
              >
                <span
                  style={{
                    fontSize: 110,
                    fontWeight: 950,
                    color: severityColor,
                    lineHeight: 0.9,
                    letterSpacing: "-0.04em",
                  }}
                >
                  {score}
                </span>
                <span style={{ fontSize: 32, color: "#475569", fontWeight: 700, marginLeft: "4px" }}>
                  /100
                </span>
              </div>

              <div
                style={{
                  backgroundColor: `${severityColor}22`,
                  border: `1px solid ${severityColor}44`,
                  color: severityColor,
                  padding: "10px 24px",
                  borderRadius: "9999px",
                  fontSize: 18,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                {severityLabel}
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error: any) {
    console.error("OG generation failed:", error);
    return new Response(`Failed to generate social image`, { status: 500 });
  }
}
