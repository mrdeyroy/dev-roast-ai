import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const username = searchParams.get("username") || "Developer";
    const score = searchParams.get("score") || "0";
    const archetype = searchParams.get("archetype") || "Mystery Dev";

    // Convert score to severity
    const numScore = parseInt(score, 10);
    let severityLabel = "Nuclear";
    let severityColor = "#ef4444"; // red
    if (numScore >= 75) {
      severityLabel = "Mild";
      severityColor = "#22c55e"; // green
    } else if (numScore >= 50) {
      severityLabel = "Medium";
      severityColor = "#eab308"; // yellow
    } else if (numScore >= 25) {
      severityLabel = "Brutal";
      severityColor = "#f97316"; // orange
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0a0a0f",
            backgroundImage: "radial-gradient(circle at 50% -20%, #2a1b54 0%, #0a0a0f 70%)",
            color: "white",
            padding: "40px",
            fontFamily: "sans-serif",
          }}
        >
          {/* Logo / Brand */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              position: "absolute",
              top: 40,
              left: 50,
            }}
          >
            <span style={{ fontSize: 32, fontWeight: 800, color: "white" }}>
              Dev Roast<span style={{ color: "#00e5ff" }}>.AI</span>
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              marginTop: 40,
            }}
          >
            <div
              style={{
                fontSize: 64,
                fontWeight: 800,
                color: "white",
                marginBottom: 10,
              }}
            >
              {username}
            </div>
            
            <div
              style={{
                fontSize: 32,
                color: "#a855f7",
                fontWeight: 600,
                marginBottom: 60,
              }}
            >
              {archetype}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.5)",
                padding: "30px 60px",
                borderRadius: 20,
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div style={{ fontSize: 24, color: "#888", textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>
                Roast Score
              </div>
              <div style={{ display: "flex", alignItems: "baseline", marginBottom: 10 }}>
                <span style={{ fontSize: 120, fontWeight: 900, color: severityColor, lineHeight: 1 }}>
                  {score}
                </span>
                <span style={{ fontSize: 40, color: "#555", marginLeft: 10 }}>/100</span>
              </div>
              <div style={{ fontSize: 32, fontWeight: 700, color: severityColor, textTransform: "uppercase", letterSpacing: 3 }}>
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
  } catch (e: any) {
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}
