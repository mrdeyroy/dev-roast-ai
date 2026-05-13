"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Flame, Code2, BriefcaseBusiness, Globe, Sparkles, GraduationCap, Info } from "lucide-react";
import Navbar from "@/components/Navbar";
import { ROAST_MODES } from "@/lib/utils";
import type { RoastMode, ProfileType } from "@/lib/utils";
import { useRoastStore } from "@/lib/store";

const profileTypes = [
  {
    id: "github" as const,
    label: "GitHub",
    icon: Code2,
    placeholder: "github-username or github.com/username",
    helperText: "Enter your GitHub username or profile URL",
    inputType: "text" as const,
  },
  {
    id: "linkedin" as const,
    label: "LinkedIn",
    icon: BriefcaseBusiness,
    placeholder: "Paste your LinkedIn headline, about section, or profile URL...",
    helperText: "LinkedIn blocks scraping. Paste your headline/about section for a more devastating roast.",
    inputType: "textarea" as const,
  },
  {
    id: "portfolio" as const,
    label: "Portfolio",
    icon: Globe,
    placeholder: "https://your-portfolio.dev",
    helperText: "We'll analyze your HTML, detect templates, and roast your design choices.",
    inputType: "text" as const,
  },
];

export default function RoastInputPage() {
  const router = useRouter();
  const { input, setInput } = useRoastStore();
  const [activeTab, setActiveTab] = useState<ProfileType>(input.profileType);
  const [selectedMode, setSelectedMode] = useState<RoastMode>(input.roastMode);
  const [placementMode, setPlacementMode] = useState(input.placementMode);
  const [profileValue, setProfileValue] = useState(input.profileUrl);
  const [linkedInText, setLinkedInText] = useState(input.linkedInText);

  const currentProfile = profileTypes.find((p) => p.id === activeTab)!;

  const handleTabSwitch = (tabId: ProfileType) => {
    setActiveTab(tabId);
    // Reset input when switching tabs
    if (tabId === "linkedin") {
      setProfileValue("");
    } else {
      setLinkedInText("");
    }
  };

  const handleSubmit = () => {
    const inputValue = activeTab === "linkedin" ? linkedInText : profileValue;
    setInput({
      profileType: activeTab,
      profileUrl: activeTab === "linkedin" ? "" : profileValue,
      linkedInText: activeTab === "linkedin" ? linkedInText : "",
      roastMode: selectedMode,
      placementMode,
    });
    router.push("/roast/loading");
  };

  const isSubmitDisabled = activeTab === "linkedin"
    ? linkedInText.trim().length < 10
    : profileValue.trim().length < 1;

  return (
    <>
      <Navbar />
      <main
        className="section"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "6rem",
          paddingBottom: "4rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: 640, width: "100%" }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.25rem",
              }}
            >
              <Flame size={32} color="#000" />
            </motion.div>
            <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", marginBottom: "0.75rem" }}>
              Time to get <span className="gradient-text-fire">roasted</span>
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>
              Paste your profile and choose your destruction method.
            </p>
          </div>

          {/* Profile Type Tabs */}
          <div
            className="card-matte"
            style={{ padding: "0.35rem", marginBottom: "1.25rem", display: "flex", gap: "0.25rem" }}
          >
            {profileTypes.map((type) => {
              const Icon = type.icon;
              const isActive = activeTab === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => handleTabSwitch(type.id)}
                  style={{
                    flex: 1,
                    padding: "0.7rem",
                    borderRadius: "var(--radius-sm)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.4rem",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    fontFamily: "var(--font-heading)",
                    transition: "all 0.2s",
                    background: isActive ? "rgba(0, 229, 255, 0.1)" : "transparent",
                    color: isActive ? "var(--accent-cyan)" : "var(--text-muted)",
                    border: isActive ? "1px solid rgba(0, 229, 255, 0.2)" : "1px solid transparent",
                  }}
                >
                  <Icon size={16} />
                  {type.label}
                </button>
              );
            })}
          </div>

          {/* Input Field */}
          <div
            className="card-glass"
            style={{ padding: "1.5rem", marginBottom: "1.5rem" }}
          >
            <label
              style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "0.75rem",
              }}
            >
              {currentProfile.label} Profile
            </label>

            {currentProfile.inputType === "textarea" ? (
              /* LinkedIn textarea input */
              <textarea
                value={linkedInText}
                onChange={(e) => setLinkedInText(e.target.value)}
                placeholder={currentProfile.placeholder}
                rows={6}
                style={{
                  width: "100%",
                  padding: "0.9rem 1rem",
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--glass-border)",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.88rem",
                  lineHeight: 1.6,
                  resize: "vertical",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
              />
            ) : (
              /* GitHub/Portfolio text input */
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: "var(--radius-sm)",
                  padding: "0 1rem",
                  border: "1px solid var(--glass-border)",
                  transition: "border-color 0.2s",
                }}
              >
                {(() => {
                  const Icon = currentProfile.icon;
                  return <Icon size={18} style={{ color: "var(--text-muted)", flexShrink: 0 }} />;
                })()}
                <input
                  type="text"
                  value={profileValue}
                  onChange={(e) => setProfileValue(e.target.value)}
                  placeholder={currentProfile.placeholder}
                  style={{
                    flex: 1,
                    padding: "0.9rem 0",
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.9rem",
                  }}
                />
              </div>
            )}

            {/* Helper text with info icon */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.4rem",
                marginTop: "0.6rem",
              }}
            >
              <Info size={12} style={{ color: "var(--text-muted)", flexShrink: 0, marginTop: "0.15rem" }} />
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  fontStyle: "italic",
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                {currentProfile.helperText}
              </p>
            </div>
          </div>

          {/* Roast Mode Selector */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "0.95rem", marginBottom: "0.75rem", fontWeight: 600 }}>
              <Sparkles size={16} style={{ color: "var(--accent-purple)", verticalAlign: "middle", marginRight: "0.4rem" }} />
              Choose your destruction method
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
              {ROAST_MODES.map((mode) => {
                const isActive = selectedMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedMode(mode.id)}
                    className={isActive ? "card-glow-purple" : "card-matte"}
                    style={{
                      padding: "1rem",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.2s",
                      border: isActive ? undefined : "1px solid var(--glass-border)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                      <span style={{ fontSize: "1.1rem" }}>{mode.emoji}</span>
                      <span
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          color: isActive ? "var(--accent-purple)" : "var(--text-primary)",
                          fontFamily: "var(--font-heading)",
                        }}
                      >
                        {mode.label}
                      </span>
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {mode.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Placement Readiness Toggle — only for GitHub */}
          {activeTab === "github" && (
            <div
              className="card-matte"
              style={{
                padding: "1rem 1.25rem",
                marginBottom: "2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <GraduationCap size={20} style={{ color: "var(--accent-lime)" }} />
                <div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>Placement Readiness Score</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Extra scoring for students targeting internships
                  </div>
                </div>
              </div>
              <button
                onClick={() => setPlacementMode(!placementMode)}
                style={{
                  width: 48,
                  height: 26,
                  borderRadius: 999,
                  border: "none",
                  cursor: "pointer",
                  position: "relative",
                  background: placementMode ? "var(--accent-lime)" : "rgba(255,255,255,0.1)",
                  transition: "background 0.2s",
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "#fff",
                    position: "absolute",
                    top: 3,
                    left: placementMode ? 25 : 3,
                    transition: "left 0.2s",
                  }}
                />
              </button>
            </div>
          )}

          {/* Spacer when placement toggle is hidden */}
          {activeTab !== "github" && <div style={{ marginBottom: "2rem" }} />}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className="btn-gradient-fire"
            style={{
              width: "100%",
              padding: "1.1rem",
              fontSize: "1.1rem",
              fontWeight: 700,
              borderRadius: "var(--radius)",
              border: "none",
              cursor: isSubmitDisabled ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.6rem",
              fontFamily: "var(--font-heading)",
              opacity: isSubmitDisabled ? 0.5 : 1,
            }}
          >
            <Flame size={22} />
            Roast Me 🔥
          </motion.button>

          <p
            style={{
              textAlign: "center",
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              marginTop: "1rem",
            }}
          >
            No sign-up required. Results are public and shareable.
          </p>
        </motion.div>
      </main>
    </>
  );
}
