import { NextRequest, NextResponse } from "next/server";
import { analyzeGitHubProfile } from "@/lib/github/analyzer";
import { calculateScores } from "@/lib/scoring/calculator";
import { generateRoast, generateLinkedInRoast, generatePortfolioRoast } from "@/lib/ai/generator";
import { analyzeLinkedInContent } from "@/lib/linkedin/analyzer";
import { analyzePortfolio } from "@/lib/portfolio/analyzer";
import { calculateLinkedInScores } from "@/lib/scoring/linkedin-calculator";
import { calculatePortfolioScores } from "@/lib/scoring/portfolio-calculator";
import { saveRoast } from "@/lib/roast-db";
import type { RoastAPIResponse, RoastRequest } from "@/lib/types/roast";

export const maxDuration = 60; // Allow up to 60 seconds for analysis

function extractLinkedInHandle(input: string): string {
  try {
    const trimmed = input.trim();
    if (trimmed.includes("linkedin.com")) {
      const cleaned = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
      const url = new URL(cleaned);
      const parts = url.pathname.split("/").filter(Boolean);
      const inIndex = parts.indexOf("in");
      if (inIndex !== -1 && parts[inIndex + 1]) {
        return parts[inIndex + 1];
      }
    }
    return "linkedin_user";
  } catch {
    return "linkedin_user";
  }
}

function extractPortfolioDomain(input: string): string {
  try {
    const trimmed = input.trim();
    const cleaned = trimmed.startsWith("http") ? trimmed : `http://${trimmed}`;
    const url = new URL(cleaned);
    return url.hostname.replace("www.", "");
  } catch {
    return "portfolio_site";
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RoastRequest;
    const {
      roastMode = "recruiter",
      placementMode = false,
      profileType = "github",
    } = body;

    // Get the input value — support both legacy `username` and new `input`
    const inputValue = body.input || body.username || "";

    if (!inputValue || typeof inputValue !== "string" || inputValue.trim().length < 1) {
      return NextResponse.json<RoastAPIResponse>(
        { success: false, error: "Input is required. Paste a username, URL, or content." },
        { status: 400 }
      );
    }

    // Route to the correct analyzer pipeline
    if (profileType === "linkedin") {
      return await handleLinkedInRoast(inputValue, roastMode);
    }

    if (profileType === "portfolio") {
      return await handlePortfolioRoast(inputValue, roastMode);
    }

    // Default: GitHub roast
    return await handleGitHubRoast(inputValue, roastMode, placementMode);

  } catch (err: unknown) {
    console.error("Roast generation failed:", err);
    const message = err instanceof Error ? err.message : "Unknown error";

    if (message.includes("429") || message.toLowerCase().includes("too many requests")) {
      return NextResponse.json<RoastAPIResponse>(
        { success: false, error: "The AI is currently roasting too many people. Please try again in a minute." },
        { status: 429 }
      );
    }

    return NextResponse.json<RoastAPIResponse>(
      { success: false, error: "Something went wrong while roasting. The AI might be taking a coffee break." },
      { status: 500 }
    );
  }
}

// ============================================
// GitHub Pipeline
// ============================================

async function handleGitHubRoast(input: string, roastMode: string, placementMode: boolean) {
  const cleanUsername = extractGitHubUsername(input);
  if (!cleanUsername || cleanUsername.length < 1 || cleanUsername.length > 39) {
    return NextResponse.json<RoastAPIResponse>(
      { success: false, error: "Invalid GitHub username. Even the AI gave up searching." },
      { status: 400 }
    );
  }

  let analysis;
  try {
    analysis = await analyzeGitHubProfile(cleanUsername);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message === "PROFILE_NOT_FOUND") {
      return NextResponse.json<RoastAPIResponse>(
        { success: false, error: `GitHub profile "${cleanUsername}" not found. Even the AI gave up searching.` },
        { status: 404 }
      );
    }
    if (message === "RATE_LIMITED") {
      return NextResponse.json<RoastAPIResponse>(
        { success: false, error: "GitHub API rate limit hit. Too many roasts today. Try again in a few minutes." },
        { status: 429 }
      );
    }
    throw err;
  }

  if (analysis.metrics.originalRepos === 0) {
    return NextResponse.json<RoastAPIResponse>(
      { success: false, error: `@${cleanUsername} has zero public repositories. There's nothing to roast. That IS the roast.` },
      { status: 400 }
    );
  }

  const scores = calculateScores(analysis);
  const roastResult = await generateRoast(analysis, scores, roastMode, placementMode);
  await saveRoast(roastResult);

  // Record analytics
  try {
    const { recordRoastActivity } = await import("@/lib/analytics");
    await recordRoastActivity(cleanUsername, analysis.metrics.totalRepos);
  } catch (e) {
    console.error("Failed to record analytics:", e);
  }

  return NextResponse.json<RoastAPIResponse>({ success: true, data: roastResult });
}

// ============================================
// LinkedIn Pipeline
// ============================================

async function handleLinkedInRoast(input: string, roastMode: string) {
  const trimmed = input.trim();

  if (trimmed.length < 10) {
    return NextResponse.json<RoastAPIResponse>(
      { success: false, error: "Your LinkedIn content is too short to roast. Paste your headline, about section, or profile URL." },
      { status: 400 }
    );
  }

  // Analyze the content
  const analysis = analyzeLinkedInContent(trimmed);

  // If it's just a URL with no pasted content, provide a fun response
  if (analysis.inputType === "url" && analysis.metrics.totalWords < 15) {
    // Still analyze — the AI will roast them for hiding behind privacy
    console.warn("LinkedIn URL-only input detected, proceeding with limited analysis");
  }

  const scores = calculateLinkedInScores(analysis);
  const roastResult = await generateLinkedInRoast(analysis, scores, roastMode);
  await saveRoast(roastResult);

  // Record analytics
  try {
    const { recordRoastActivity } = await import("@/lib/analytics");
    await recordRoastActivity(extractLinkedInHandle(input), 0);
  } catch (e) {
    console.error("Failed to record analytics:", e);
  }

  return NextResponse.json<RoastAPIResponse>({ success: true, data: roastResult });
}

// ============================================
// Portfolio Pipeline
// ============================================

async function handlePortfolioRoast(input: string, roastMode: string) {
  const trimmed = input.trim();

  // Basic URL validation
  const urlLike = trimmed.startsWith("http") || trimmed.includes(".");
  if (!urlLike) {
    return NextResponse.json<RoastAPIResponse>(
      { success: false, error: "That doesn't look like a URL. Enter your portfolio website address." },
      { status: 400 }
    );
  }

  const analysis = await analyzePortfolio(trimmed);

  if (!analysis.fetchSuccess) {
    // Still proceed — the AI will roast the dead site
    console.warn(`Portfolio fetch failed: ${analysis.fetchError}. Generating roast anyway.`);
  }

  const scores = calculatePortfolioScores(analysis);
  const roastResult = await generatePortfolioRoast(analysis, scores, roastMode);
  await saveRoast(roastResult);

  // Record analytics
  try {
    const { recordRoastActivity } = await import("@/lib/analytics");
    await recordRoastActivity(extractPortfolioDomain(input), 0);
  } catch (e) {
    console.error("Failed to record analytics:", e);
  }

  return NextResponse.json<RoastAPIResponse>({ success: true, data: roastResult });
}

// ============================================
// Helpers
// ============================================

function extractGitHubUsername(input: string): string {
  const trimmed = input.trim();

  // Handle full GitHub URLs
  const urlMatch = trimmed.match(
    /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9-]+)\/?/
  );
  if (urlMatch) return urlMatch[1];

  // Handle @username format
  if (trimmed.startsWith("@")) return trimmed.slice(1);

  // Plain username
  return trimmed;
}
