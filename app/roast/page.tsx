"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Flame, Code2, BriefcaseBusiness, Globe, Sparkles,
  GraduationCap, Info, Loader2, CheckCircle2, AlertCircle,
  Zap
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { ROAST_MODES } from "@/lib/utils";
import type { RoastMode, ProfileType } from "@/lib/utils";
import { useRoastStore } from "@/lib/store";
import type { ValidationStatus } from "@/lib/store";
import { validateGitHubProfile } from "@/lib/validation/github";
import { validateLinkedInInput } from "@/lib/validation/linkedin";
import { validatePortfolioUrl } from "@/lib/validation/portfolio";
import { getCachedRoastForProfile, clearExpiredCachedRoasts } from "@/lib/storage/cache";

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
  const { input, setInput, setValidation: setStoreValidation } = useRoastStore();
  const [activeTab, setActiveTab] = useState<ProfileType>(input.profileType);
  const [selectedMode, setSelectedMode] = useState<RoastMode>(input.roastMode);
  const [placementMode, setPlacementMode] = useState(input.placementMode);
  const [profileValue, setProfileValue] = useState(input.profileUrl);
  const [linkedInText, setLinkedInText] = useState(input.linkedInText);

  const [validationStatus, setValidationStatus] = useState<ValidationStatus>("idle");
  const [validationMessage, setValidationMessage] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [cachedRoastFound, setCachedRoastFound] = useState(false);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const validationAbort = useRef(false);

  const currentProfile = profileTypes.find((p) => p.id === activeTab)!;

  // Clean up expired cache entries on mount
  useEffect(() => {
    clearExpiredCachedRoasts();
  }, []);

  const resetValidation = useCallback(() => {
    setValidationStatus("idle");
    setValidationMessage("");
    setCachedRoastFound(false);
    setStoreValidation("idle");
  }, [setStoreValidation]);

  const runValidation = useCallback(async (value: string, tab: ProfileType) => {
    if (!value.trim()) {
      resetValidation();
      return;
    }

    validationAbort.current = false;
    setValidationStatus("checking");
    setValidationMessage("Checking profile...");
    setStoreValidation("checking", "Checking profile...");
    setIsChecking(true);

    let result;
    if (tab === "github") {
      result = await validateGitHubProfile(value);
    } else if (tab === "linkedin") {
      result = validateLinkedInInput(value);
    } else {
      result = await validatePortfolioUrl(value);
    }

    if (validationAbort.current) return;

    setIsChecking(false);

    if (result.status === "valid") {
      setValidationStatus("valid");
      setCachedRoastFound(false);
      const msg = tab === "github"
        ? " GitHub profile found"
        : tab === "linkedin"
          ? " LinkedIn URL looks valid"
          : " Portfolio detected";
      setValidationMessage(msg);
      setStoreValidation("valid", msg);
    } else if (result.status === "invalid") {
      setValidationStatus("invalid");
      setCachedRoastFound(false);
      const msg = tab === "github"
        ? `❌ ${result.error}`
        : tab === "linkedin"
          ? `❌ ${result.error}`
          : `❌ ${result.error}`;
      setValidationMessage(msg);
      setStoreValidation("invalid", msg);
    }
  }, [resetValidation, setStoreValidation]);

  const handleInputChange = useCallback((value: string, tab?: ProfileType) => {
    const currentTab = tab ?? activeTab;
    if (currentTab === "linkedin") {
      setLinkedInText(value);
    } else {
      setProfileValue(value);
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (!value.trim()) {
      resetValidation();
      return;
    }

    setValidationStatus("checking");
    setValidationMessage("Checking profile...");

    debounceTimer.current = setTimeout(() => {
      runValidation(value, currentTab);
    }, 600);
  }, [activeTab, resetValidation, runValidation]);

  const handleTabSwitch = (tabId: ProfileType) => {
    setActiveTab(tabId);
    resetValidation();
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    if (tabId === "linkedin") {
      setProfileValue("");
      if (linkedInText.trim()) {
        runValidation(linkedInText, tabId);
      }
    } else {
      setLinkedInText("");
      if (profileValue.trim()) {
        runValidation(profileValue, tabId);
      }
    }
  };

  const handleSubmit = () => {
    const inputValue = activeTab === "linkedin" ? linkedInText : profileValue;
    if (!inputValue.trim()) return;

    const identifier = activeTab === "github"
      ? inputValue
      : activeTab === "linkedin"
        ? inputValue
        : inputValue;

    const cached = getCachedRoastForProfile(activeTab, identifier);
    if (cached) {
      setInput({
        profileType: activeTab,
        profileUrl: activeTab === "linkedin" ? "" : profileValue,
        linkedInText: activeTab === "linkedin" ? linkedInText : "",
        roastMode: selectedMode,
        placementMode,
      });
      setCachedRoastFound(true);
      setValidationMessage("🔥 Existing roast found. Reopening emotional damage...");
      setTimeout(() => {
        router.push(`/roast/${cached.roastId}`);
      }, 600);
      return;
    }

    setInput({
      profileType: activeTab,
      profileUrl: activeTab === "linkedin" ? "" : profileValue,
      linkedInText: activeTab === "linkedin" ? linkedInText : "",
      roastMode: selectedMode,
      placementMode,
    });
    router.push("/roast/loading");
  };

  const getInputBorderStyle = () => {
    if (validationStatus === "checking") {
      return "1px solid var(--accent-cyan)";
    }
    if (validationStatus === "valid") {
      return "1px solid rgba(34, 197, 94, 0.5)";
    }
    if (validationStatus === "invalid") {
      return "1px solid rgba(239, 68, 68, 0.5)";
    }
    return "1px solid var(--glass-border)";
  };

  const getInputBoxShadow = () => {
    if (validationStatus === "valid") {
      return "0 0 20px rgba(34, 197, 94, 0.15)";
    }
    if (validationStatus === "invalid") {
      return "0 0 12px rgba(239, 68, 68, 0.1)";
    }
    if (validationStatus === "checking") {
      return "0 0 20px rgba(0, 229, 255, 0.1)";
    }
    return "none";
  };

  const isSubmitDisabled = validationStatus !== "valid" || isChecking;

  const currentValue = activeTab === "linkedin" ? linkedInText : profileValue;

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
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "0.75rem",
              }}
            >
              <span>{currentProfile.label} Profile</span>
              {validationStatus !== "idle" && currentValue.trim() && (
                <span
                  className={
                    validationStatus === "checking" ? "validation-pulse" :
                      validationStatus === "valid" ? "validation-valid" :
                        "validation-invalid"
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    textTransform: "none",
                    letterSpacing: "normal",
                    color:
                      validationStatus === "checking" ? "var(--accent-cyan)" :
                        validationStatus === "valid" ? "rgb(34, 197, 94)" :
                          "rgb(239, 68, 68)",
                  }}
                >
                  {validationStatus === "checking" && (
                    <Loader2 size={12} className="spin-animation" />
                  )}
                  {validationStatus === "valid" && <CheckCircle2 size={12} />}
                  {validationStatus === "invalid" && <AlertCircle size={12} />}
                  {validationMessage}
                </span>
              )}
            </label>

            {currentProfile.inputType === "textarea" ? (
              <textarea
                value={linkedInText}
                onChange={(e) => handleInputChange(e.target.value, "linkedin")}
                placeholder={currentProfile.placeholder}
                rows={6}
                style={{
                  width: "100%",
                  padding: "0.9rem 1rem",
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: "var(--radius-sm)",
                  border: getInputBorderStyle(),
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.88rem",
                  lineHeight: 1.6,
                  resize: "vertical",
                  outline: "none",
                  transition: "border-color 0.3s, box-shadow 0.3s",
                  boxShadow: getInputBoxShadow(),
                }}
              />
            ) : (
              <div
                className={
                  validationStatus === "invalid" ? "shake-animation" : ""
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: "var(--radius-sm)",
                  padding: "0 1rem",
                  border: getInputBorderStyle(),
                  transition: "border-color 0.3s, box-shadow 0.3s",
                  boxShadow: getInputBoxShadow(),
                }}
              >
                {(() => {
                  const Icon = currentProfile.icon;
                  return (
                    <Icon
                      size={18}
                      style={{
                        color:
                          validationStatus === "valid"
                            ? "rgb(34, 197, 94)"
                            : validationStatus === "invalid"
                              ? "rgb(239, 68, 68)"
                              : "var(--text-muted)",
                        flexShrink: 0,
                        transition: "color 0.3s",
                      }}
                    />
                  );
                })()}
                <input
                  type="text"
                  value={profileValue}
                  onChange={(e) => handleInputChange(e.target.value, activeTab)}
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
                {validationStatus === "checking" && (
                  <Loader2 size={16} className="spin-animation" style={{ color: "var(--accent-cyan)", flexShrink: 0 }} />
                )}
                {validationStatus === "valid" && (
                  <CheckCircle2 size={16} style={{ color: "rgb(34, 197, 94)", flexShrink: 0 }} />
                )}
                {validationStatus === "invalid" && (
                  <AlertCircle size={16} style={{ color: "rgb(239, 68, 68)", flexShrink: 0 }} />
                )}
              </div>
            )}

            {cachedRoastFound && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  marginTop: "0.6rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  fontSize: "0.75rem",
                  color: "var(--accent-cyan)",
                  fontWeight: 600,
                }}
              >
                <Zap size={12} />
                {validationMessage}
              </motion.div>
            )}

            {/* Helper text */}
            {!validationMessage || validationStatus === "idle" ? (
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
            ) : null}
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
            whileHover={isSubmitDisabled ? {} : { scale: 1.02 }}
            whileTap={isSubmitDisabled ? {} : { scale: 0.98 }}
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className="btn-gradient-fire"
            title={
              validationStatus === "invalid"
                ? "Please enter a valid profile first"
                : validationStatus === "checking"
                  ? "Checking profile..."
                  : validationStatus === "idle"
                    ? "Enter a profile URL or username"
                    : ""
            }
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
              transition: "opacity 0.3s, transform 0.2s",
            }}
          >
            {cachedRoastFound ? (
              <Zap size={22} />
            ) : isChecking ? (
              <Loader2 size={22} className="spin-animation" />
            ) : (
              <Flame size={22} />
            )}
            {cachedRoastFound
              ? "Opening Existing Roast..."
              : isChecking
                ? "Checking..."
                : "Roast Me 🔥"}
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
