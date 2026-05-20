"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Flame, AlertCircle, Zap } from "lucide-react";
import { useRoastStore } from "@/lib/store";
import { LOADING_MESSAGES, PLATFORM_CONFIG } from "@/lib/utils";
import { getCachedRoastForProfile } from "@/lib/storage/cache";

export default function RoastLoadingPage() {
  const router = useRouter();
  const { input, setRoastResult, setError, setLoadingProgress, setLoadingStep } = useRoastStore();
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [displayedMessages, setDisplayedMessages] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCached, setIsCached] = useState(false);
  const calledApi = useRef(false);

  const platformConfig = PLATFORM_CONFIG[input.profileType];
  const loadingSteps = LOADING_MESSAGES[input.profileType];

  const getIntensityLabel = useCallback((p: number) => {
    if (p < 20) return "Scanning...";
    if (p < 40) return "Mild Concern";
    if (p < 60) return "Getting Spicy";
    if (p < 80) return "BRUTAL";
    return "☠️ NUCLEAR ☠️";
  }, []);

  const getIntensityColor = useCallback((p: number) => {
    if (p < 20) return "var(--accent-cyan)";
    if (p < 40) return "var(--roast-mild)";
    if (p < 60) return "var(--roast-medium)";
    if (p < 80) return "var(--roast-brutal)";
    return "var(--roast-nuclear)";
  }, []);

  // Step cycling animation
  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((prev) => {
        const next = prev + 1;
        if (next < loadingSteps.length) {
          setDisplayedMessages((msgs) => [...msgs, loadingSteps[next]]);
        }
        return next >= loadingSteps.length ? prev : next;
      });
    }, 400);

    setDisplayedMessages([loadingSteps[0]]);
    return () => clearInterval(timer);
  }, [loadingSteps]);

  // Check cache and make API call
  useEffect(() => {
    const inputValue = input.profileType === "linkedin"
      ? input.linkedInText
      : input.profileUrl;

    if (!inputValue) {
      setErrorMsg(`No input provided. Go back and paste your ${input.profileType === "github" ? "GitHub username" : input.profileType === "linkedin" ? "LinkedIn content" : "portfolio URL"}.`);
      return;
    }

    // Check cache first
    const cached = getCachedRoastForProfile(input.profileType, inputValue);
    if (cached) {
      setIsCached(true);
      setProgress(100);
      setDisplayedMessages((msgs) => [...msgs, "🔥 Existing roast found!"]);
      setRoastResult(cached.roastResult);
      setLoadingProgress(100);
      setLoadingStep("🔥 Existing roast found!");
      setTimeout(() => {
        router.push(`/roast/${cached.roastId}`);
      }, 500);
      return;
    }

    let progressVal = 0;
    const progressTimer = setInterval(() => {
      progressVal += 0.8 + Math.random() * 0.4;
      if (progressVal > 85) {
        clearInterval(progressTimer);
        setProgress(85);
        return;
      }
      setProgress(progressVal);
    }, 100);

    const payload = {
      input: inputValue,
      username: input.profileType === "github" ? inputValue : undefined,
      profileType: input.profileType,
      roastMode: input.roastMode,
      placementMode: input.placementMode,
    };

    const abortController = new AbortController();
    calledApi.current = true;

    fetch("/api/roast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: abortController.signal,
    })
      .then(async (res) => {
        const data = await res.json();
        clearInterval(progressTimer);

        if (!res.ok || !data.success) {
          setErrorMsg(data.error || "Roast generation failed.");
          setError(data.error || "Roast generation failed.");
          return;
        }

        setProgress(100);
        setDisplayedMessages((msgs) => [...msgs, "🔥 Roast complete!"]);
        setRoastResult(data.data);

        setTimeout(() => {
          router.push(`/roast/${data.data.id}`);
        }, 800);
      })
      .catch((err) => {
        clearInterval(progressTimer);
        if (err.name === "AbortError") return;
        setErrorMsg("Network error. Check your connection and try again.");
        setError("Network error");
      });

    return () => {
      clearInterval(progressTimer);
      abortController.abort();
    };
  }, [input, router, setRoastResult, setError, setLoadingProgress, setLoadingStep]);

  const displayName = input.profileType === "linkedin"
    ? input.linkedInText.slice(0, 40).trim() || "your LinkedIn"
    : input.profileUrl || "your profile";

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.5rem",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ maxWidth: 560, width: "100%", textAlign: "center" }}
      >
        {/* Error State */}
        {errorMsg ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 20,
                background: "linear-gradient(135deg, var(--roast-nuclear), var(--accent-purple))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 2rem",
              }}
            >
              <AlertCircle size={40} color="#000" />
            </div>
            <h1 style={{ fontSize: "1.8rem", marginBottom: "0.75rem" }}>
              <span className="gradient-text-fire">Roast Failed</span>
            </h1>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.95rem",
                marginBottom: "2rem",
                maxWidth: 400,
                margin: "0 auto 2rem",
                lineHeight: 1.6,
              }}
            >
              {errorMsg}
            </p>
            <button
              onClick={() => router.push("/roast")}
              className="btn-gradient"
              style={{ padding: "0.8rem 2rem", fontSize: "0.95rem" }}
            >
              <Flame size={18} />
              Try Again
            </button>
          </motion.div>
        ) : (
          <>
            {/* Platform badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.3rem 0.8rem",
                borderRadius: 999,
                fontSize: "0.7rem",
                fontWeight: 600,
                background: isCached ? "rgba(34, 197, 94, 0.08)" : platformConfig.badgeBg,
                border: `1px solid ${isCached ? "rgba(34, 197, 94, 0.2)" : platformConfig.badgeBorder}`,
                color: isCached ? "rgb(34, 197, 94)" : platformConfig.color,
                marginBottom: "1.5rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {isCached ? "⚡" : platformConfig.emoji} {isCached ? "Cached Roast Found" : platformConfig.label}
            </div>

            {/* Icon */}
            <motion.div
              animate={
                isCached
                  ? { scale: [1, 1.1, 1] }
                  : {
                      rotate: [0, -5, 5, -5, 0],
                      scale: [1, 1.05, 1, 1.05, 1],
                    }
              }
              transition={{ duration: isCached ? 0.5 : 2, repeat: isCached ? 1 : Infinity }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 20,
                background: isCached
                  ? "linear-gradient(135deg, #22c55e, #16a34a)"
                  : `linear-gradient(135deg, ${getIntensityColor(progress)}, var(--accent-purple))`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 2rem",
                boxShadow: isCached
                  ? "0 0 40px rgba(34, 197, 94, 0.4)"
                  : `0 0 40px ${getIntensityColor(progress)}40`,
              }}
            >
              {isCached ? <Zap size={40} color="#000" /> : <Flame size={40} color="#000" />}
            </motion.div>

            {/* Title */}
            <h1 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>
              {isCached ? (
                <span style={{ color: "rgb(34, 197, 94)" }}>Roast Found in Cache</span>
              ) : (
                <>Preparing your <span className="gradient-text-fire">roast</span></>
              )}
            </h1>
            <p
              style={{
                color: "var(--text-secondary)",
                marginBottom: "2rem",
                fontSize: "0.95rem",
              }}
            >
              {isCached
                ? "🔥 Existing roast found. Reopening emotional damage..."
                : `Our AI is analyzing <strong>${displayName}</strong>. This is gonna hurt.`}
            </p>

            {!isCached && (
              <>
                {/* Roast Intensity Meter */}
                <div
                  className="card-matte"
                  style={{ padding: "1.5rem", marginBottom: "1.5rem" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        color: "var(--text-muted)",
                      }}
                    >
                      Roast Intensity
                    </span>
                    <motion.span
                      key={getIntensityLabel(progress)}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: getIntensityColor(progress),
                        fontFamily: "var(--font-heading)",
                      }}
                    >
                      {getIntensityLabel(progress)}
                    </motion.span>
                  </div>
                  <div className="roast-meter-track">
                    <motion.div
                      className="roast-meter-fill"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Terminal with real steps */}
                <div
                  className="terminal"
                  style={{ textAlign: "left", marginBottom: "1.5rem" }}
                >
                  <div className="terminal-header">
                    <div className="terminal-dot" style={{ background: "#EF4444" }} />
                    <div className="terminal-dot" style={{ background: "#EAB308" }} />
                    <div className="terminal-dot" style={{ background: "#22C55E" }} />
                    <span style={{ marginLeft: "0.5rem", fontSize: "0.7rem", color: "var(--text-muted)" }}>
                      {input.profileType === "linkedin" ? "linkedin_roast.sh" : input.profileType === "portfolio" ? "portfolio_roast.sh" : "roast_engine.sh"}
                    </span>
                    <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-lime)", animation: "badgePulse 1s ease infinite" }} />
                      <span style={{ fontSize: "0.6rem", fontWeight: 600, color: "var(--accent-lime)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        Running
                      </span>
                    </div>
                  </div>
                  <div
                    className="terminal-body"
                    style={{ maxHeight: 220, overflowY: "auto", scrollBehavior: "smooth" }}
                    ref={(el) => { if (el) el.scrollTop = el.scrollHeight; }}
                  >
                    {displayedMessages.slice(-8).map((msg, i) => (
                      <motion.div
                        key={`${msg}-${i}`}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ marginBottom: "0.4rem", fontSize: "0.8rem", fontFamily: "var(--font-mono)", display: "flex", alignItems: "center", gap: "0.5rem" }}
                      >
                        <span style={{ color: "var(--accent-cyan)" }}>❯</span>
                        <span style={{ color: i === displayedMessages.slice(-8).length - 1 ? "var(--text-primary)" : "var(--text-muted)" }}>
                          {msg}
                        </span>
                      </motion.div>
                    ))}
                    {progress < 100 && (
                      <span className="typing-cursor" style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                        processing
                      </span>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Progress percentage */}
            {!isCached && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "2rem", fontWeight: 700, fontFamily: "var(--font-heading)", color: getIntensityColor(progress) }}>
                  {Math.round(Math.min(progress, 100))}%
                </span>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>complete</span>
              </div>
            )}

            {isCached && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", color: "rgb(34, 197, 94)" }}
              >
                <Zap size={20} />
                <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>Redirecting instantly...</span>
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </main>
  );
}
