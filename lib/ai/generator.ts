import OpenAI from "openai";
import type {
  GitHubAnalysis, ScoreBreakdown, RoastResult, RoastLine,
  LinkedInAnalysis, LinkedInScoreBreakdown,
  PortfolioAnalysis, PortfolioScoreBreakdown, Improvement,
} from "@/lib/types/roast";
import { buildRoastPrompt, buildLinkedInRoastPrompt, buildPortfolioRoastPrompt } from "./prompts";
import { getSeverityFromScore } from "@/lib/scoring/calculator";
import { SYSTEM_PROMPTS } from "./system-prompt";

// ============================================
// AI Caching (In-Memory)
// ============================================
const roastCache = new Map<string, { result: RoastResult; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

function getCacheKey(type: string, id: string, mode: string) {
  return `${type}:${id}:${mode}`;
}

function generateShortId(): string {
  return Math.random().toString(36).substring(2, 7);
}

// ============================================
// OpenRouter AI Roast Generator (Parallel Race Strategy)
// ============================================

interface AIRoastOutput {
  archetype: { name: string; emoji: string; description: string };
  headerText: string;
  roastLines: RoastLine[];
  improvements: Improvement[];
  positiveEnding: string;
}

const MODELS = [
  "minimax/minimax-m2.5:free",
  "openai/gpt-oss-20b:free",
  "openai/gpt-oss-120b:free",
  "google/gemma-4-31b-it:free",
  "openrouter/free",
];

function getOpenAIClient() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  return new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: apiKey,
    defaultHeaders: {
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": "Dev Roast AI",
    }
  });
}

async function callAIWithModel(prompt: string, systemMessage: string, model: string, signal: AbortSignal): Promise<string> {
  const openai = getOpenAIClient();
  if (!openai) throw new Error("No API key");

  const completion = await openai.chat.completions.create(
    {
      model: model,
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt },
      ],
      temperature: 0.9,
      max_tokens: 300,
      response_format: { type: "json_object" }
    },
    { signal }
  );

  const text = completion.choices[0]?.message?.content;
  if (!text) throw new Error(`Empty response from ${model}`);
  return text;
}

async function callAI(prompt: string, systemMessage: string): Promise<AIRoastOutput | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout for free tier reliability

  const errors: { model: string; error: any }[] = [];

  const runModel = async (model: string) => {
    try {
      return await callAIWithModel(prompt, systemMessage, model, controller.signal);
    } catch (err) {
      errors.push({ model, error: err });
      throw err;
    }
  };

  const startModelWithDelay = (model: string, delayMs: number): Promise<string> => {
    if (delayMs === 0) {
      return runModel(model);
    }
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        if (controller.signal.aborted) {
          reject(new Error("Aborted before start"));
          return;
        }
        runModel(model).then(resolve, reject);
      }, delayMs);
      
      controller.signal.addEventListener("abort", () => clearTimeout(timer));
    });
  };

  try {
    // Stagger requests to avoid simultaneous rate limits
    const promises = [
      startModelWithDelay("minimax/minimax-m2.5:free", 0),
      startModelWithDelay("openai/gpt-oss-20b:free", 1000),
      startModelWithDelay("openai/gpt-oss-120b:free", 2000),
      startModelWithDelay("google/gemma-4-31b-it:free", 3000),
      startModelWithDelay("openrouter/free", 3000),
    ];
    
    // Race all models — first to succeed wins
    const responseText = await Promise.any(promises);
    clearTimeout(timeoutId);
    controller.abort(); // cancel other pending requests

    try {
      return JSON.parse(responseText);
    } catch {
      try {
        const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) return JSON.parse(jsonMatch[1]);
        const looseMatch = responseText.match(/\{[\s\S]*\}/);
        return JSON.parse(looseMatch ? looseMatch[0] : "{}");
      } catch {
        console.error("Failed to parse AI JSON response:", responseText);
        return null;
      }
    }
  } catch (error) {
    clearTimeout(timeoutId);
    controller.abort();
    console.error("All OpenRouter free models failed or timed out.");
    errors.forEach(({ model, error: err }) => {
      const status = err?.status || err?.response?.status || "unknown";
      console.error(`- Model ${model} failed (status ${status}):`, err?.message || err);
    });
    return null;
  }
}

function sanitizeAIOutput(output: AIRoastOutput): AIRoastOutput {
  if (!output.roastLines || !Array.isArray(output.roastLines)) {
    output.roastLines = [{ type: "damage", text: "The AI was too stunned to speak." }];
  }
  if (!output.improvements || !Array.isArray(output.improvements)) {
    output.improvements = [{ icon: "🔥", text: "Try again later." }];
  }
  if (!output.archetype?.name) {
    output.archetype = { name: "Mystery Dev", emoji: "🕵️", description: "The AI couldn't figure you out." };
  }
  if (!output.headerText) {
    output.headerText = "Recruiters are nervous.";
  }
  if (!output.positiveEnding) {
    output.positiveEnding = "At least you tried.";
  }
  return output;
}

// ============================================
// GitHub Roast Generator
// ============================================

export async function generateRoast(
  analysis: GitHubAnalysis,
  scores: ScoreBreakdown,
  roastMode: string,
  placementMode: boolean
): Promise<RoastResult> {
  const cacheKey = getCacheKey("github", analysis.profile.login, roastMode);
  const cached = roastCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.result;
  }

  const prompt = buildRoastPrompt(analysis, scores, roastMode);
  const systemMsg = SYSTEM_PROMPTS.github || "You are Dev Roast AI. Output ONLY valid JSON.";

  const aiOutput = await callAI(prompt, systemMsg);

  if (!aiOutput) {
    return generateGitHubFallbackRoast(analysis, scores);
  }

  const safe = sanitizeAIOutput(aiOutput);

  const cleanUsername = analysis.profile.login.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();

  const result: RoastResult = {
    id: `${cleanUsername}-${generateShortId()}`,
    username: analysis.profile.login,
    profileType: "github",
    profileUrl: `https://github.com/${analysis.profile.login}`,
    roastMode,
    avatar: analysis.profile.avatar_url,
    createdAt: new Date().toISOString(),
    hireabilityScore: scores.hireabilityScore,
    placementReadiness: scores.placementReadiness,
    overallRoastLevel: getSeverityFromScore(scores.hireabilityScore),
    archetype: safe.archetype,
    
    headerText: safe.headerText,
    roastLines: safe.roastLines,
    improvements: safe.improvements.slice(0, 3), // max 3
    positiveEnding: safe.positiveEnding,

    radarData: [
      { category: "Hireability", score: scores.hireabilityScore, fullMark: 100 },
      { category: "Consistency", score: scores.commitConsistency, fullMark: 100 },
      { category: "Originality", score: scores.projectOriginality, fullMark: 100 },
      { category: "Readme Quality", score: scores.readmeQuality, fullMark: 100 },
      { category: "Profile Comp.", score: scores.profileCompleteness, fullMark: 100 },
      { category: "Stack Depth", score: scores.stackDepth, fullMark: 100 },
    ],

    metricsSummary: {
      stat1: { label: "Total Repositories", value: analysis.metrics.totalRepos },
      stat2: { label: "Inactive (6+ months)", value: analysis.metrics.inactiveRepos },
      stat3: { label: "Top Language", value: analysis.metrics.topLanguage || "None" },
      stat4: { label: "Stars Earned", value: analysis.metrics.totalStars },
    },
  };

  roastCache.set(cacheKey, { result, timestamp: Date.now() });
  return result;
}

// ============================================
// LinkedIn Roast Generator
// ============================================

export async function generateLinkedInRoast(
  analysis: LinkedInAnalysis,
  scores: LinkedInScoreBreakdown,
  roastMode: string
): Promise<RoastResult> {
  const rawUsername = analysis.headline
    ? analysis.headline.slice(0, 30)
    : "linkedin-user";
  const cleanUsername = rawUsername.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();

  const cacheKey = getCacheKey("linkedin", cleanUsername, roastMode);
  const cached = roastCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.result;
  }

  const prompt = buildLinkedInRoastPrompt(analysis, scores, roastMode);
  const systemMsg = SYSTEM_PROMPTS.linkedin || "You are Dev Roast AI. Output ONLY valid JSON.";

  const aiOutput = await callAI(prompt, systemMsg);

  if (!aiOutput) {
    return generateLinkedInFallbackRoast(analysis, scores);
  }

  const safe = sanitizeAIOutput(aiOutput);

  const result: RoastResult = {
    id: `li-${cleanUsername}-${generateShortId()}`,
    username: analysis.headline || "LinkedIn User",
    profileType: "linkedin",
    profileUrl: analysis.profileUrl || "",
    roastMode,
    avatar: "",
    createdAt: new Date().toISOString(),
    hireabilityScore: scores.overallScore,
    placementReadiness: scores.recruiterReadability,
    overallRoastLevel: getSeverityFromScore(scores.overallScore),
    archetype: safe.archetype,
    
    headerText: safe.headerText,
    roastLines: safe.roastLines,
    improvements: safe.improvements.slice(0, 3), // max 3
    positiveEnding: safe.positiveEnding,

    radarData: [
      { category: "Buzzword Free", score: scores.buzzwordDensity, fullMark: 100 },
      { category: "Readability", score: scores.recruiterReadability, fullMark: 100 },
      { category: "Cringe-Free", score: scores.cringeFactor, fullMark: 100 },
      { category: "Achievements", score: scores.achievementClarity, fullMark: 100 },
      { category: "Skills Depth", score: Math.min(100, analysis.skills.length * 15), fullMark: 100 },
      { category: "Authenticity", score: scores.overallScore, fullMark: 100 },
    ],

    metricsSummary: {
      stat1: { label: "Total Words", value: analysis.metrics.totalWords },
      stat2: { label: "Buzzwords Found", value: analysis.metrics.buzzwordCount },
      stat3: { label: "Cringe Phrases", value: analysis.metrics.cringePhraseCount },
      stat4: { label: "Measurable Results", value: analysis.metrics.measurableAchievements },
    },
  };

  roastCache.set(cacheKey, { result, timestamp: Date.now() });
  return result;
}

// ============================================
// Portfolio Roast Generator
// ============================================

export async function generatePortfolioRoast(
  analysis: PortfolioAnalysis,
  scores: PortfolioScoreBreakdown,
  roastMode: string
): Promise<RoastResult> {
  const rawUsername = analysis.title
    ? analysis.title.slice(0, 30)
    : new URL(analysis.url).hostname;
  const cleanUsername = rawUsername.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();

  const cacheKey = getCacheKey("portfolio", cleanUsername, roastMode);
  const cached = roastCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.result;
  }

  const prompt = buildPortfolioRoastPrompt(analysis, scores, roastMode);
  const systemMsg = SYSTEM_PROMPTS.portfolio || "You are Dev Roast AI. Output ONLY valid JSON.";

  const aiOutput = await callAI(prompt, systemMsg);

  if (!aiOutput) {
    return generatePortfolioFallbackRoast(analysis, scores);
  }

  const safe = sanitizeAIOutput(aiOutput);

  const result: RoastResult = {
    id: `pf-${cleanUsername}-${generateShortId()}`,
    username: analysis.title || new URL(analysis.url).hostname,
    profileType: "portfolio",
    profileUrl: analysis.url,
    roastMode,
    avatar: "",
    createdAt: new Date().toISOString(),
    hireabilityScore: scores.overallScore,
    placementReadiness: scores.projectPresentation,
    overallRoastLevel: getSeverityFromScore(scores.overallScore),
    archetype: safe.archetype,
    
    headerText: safe.headerText,
    roastLines: safe.roastLines,
    improvements: safe.improvements.slice(0, 3), // max 3
    positiveEnding: safe.positiveEnding,

    radarData: [
      { category: "Originality", score: scores.originality, fullMark: 100 },
      { category: "UX Quality", score: scores.uxQuality, fullMark: 100 },
      { category: "Content", score: scores.contentDepth, fullMark: 100 },
      { category: "Projects", score: scores.projectPresentation, fullMark: 100 },
      { category: "Semantic HTML", score: analysis.metrics.semanticHtmlScore, fullMark: 100 },
      { category: "Overall", score: scores.overallScore, fullMark: 100 },
    ],
  };

  roastCache.set(cacheKey, { result, timestamp: Date.now() });
  return result;
}

// ============================================
// Fallback Generators (Fast, no AI)
// ============================================

const EMERGENCY_ROASTS = [
  "Your GitHub survived. Your README did not.",
  "Recruiters opened your profile and closed the tab professionally.",
  "You deploy less often than Windows updates.",
  "The AI models refused to look at your code to preserve their sanity."
];

function getRandomEmergencyRoast() {
  return EMERGENCY_ROASTS[Math.floor(Math.random() * EMERGENCY_ROASTS.length)];
}

function generateGitHubFallbackRoast(analysis: GitHubAnalysis, scores: ScoreBreakdown): RoastResult {
  const cleanUsername = analysis.profile.login.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
  return {
    id: `${cleanUsername}-${generateShortId()}`,
    username: analysis.profile.login,
    profileType: "github",
    profileUrl: `https://github.com/${analysis.profile.login}`,
    roastMode: "brutal",
    avatar: analysis.profile.avatar_url,
    createdAt: new Date().toISOString(),
    hireabilityScore: scores.hireabilityScore,
    placementReadiness: scores.placementReadiness,
    overallRoastLevel: "Fallback",
    archetype: {
      name: "Free Tier Survivor",
      emoji: "🛡️",
      description: "You survived the roast because the AI models were down."
    },
    headerText: `${scores.hireabilityScore}/100 — The AI gave up.`,
    roastLines: [
      { type: "insult", text: getRandomEmergencyRoast() },
      { type: "damage", text: "Even our AI didn't want to read your code." },
      { type: "analysis", text: `You have ${analysis.metrics.totalRepos} repos, but we couldn't parse them into a real roast.` }
    ],
    improvements: [{ icon: "⚙️", text: "Try generating the roast again when models are online." }],
    positiveEnding: "At least your GitHub profile fetching worked perfectly!",
    radarData: [
      { category: "Hireability", score: scores.hireabilityScore, fullMark: 100 },
      { category: "Consistency", score: scores.commitConsistency, fullMark: 100 },
      { category: "Originality", score: scores.projectOriginality, fullMark: 100 },
      { category: "Readme Quality", score: scores.readmeQuality, fullMark: 100 },
      { category: "Activity", score: scores.profileCompleteness, fullMark: 100 },
      { category: "Sizzle", score: scores.stackDepth, fullMark: 100 },
    ],
    metricsSummary: {
      stat1: { label: "Total Repositories", value: analysis.metrics.totalRepos },
      stat2: { label: "Inactive (6+ months)", value: analysis.metrics.inactiveRepos },
      stat3: { label: "Top Language", value: analysis.metrics.topLanguage || "None" },
      stat4: { label: "Stars Earned", value: analysis.metrics.totalStars },
    },
  };
}

function generateLinkedInFallbackRoast(analysis: LinkedInAnalysis, scores: LinkedInScoreBreakdown): RoastResult {
  const cleanUsername = (analysis.headline || "linkedin-user").slice(0, 30).replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
  return {
    id: `li-${cleanUsername}-${generateShortId()}`,
    username: analysis.headline || "LinkedIn User",
    profileType: "linkedin",
    profileUrl: analysis.profileUrl || "",
    roastMode: "brutal",
    avatar: "",
    createdAt: new Date().toISOString(),
    hireabilityScore: scores.overallScore,
    placementReadiness: scores.recruiterReadability,
    overallRoastLevel: "Fallback",
    archetype: { name: "AI Quota Victim", emoji: "💀", description: "The AI models were too busy to roast you. Lucky escape." },
    headerText: `${scores.overallScore}/100 — Buzzword overload.`,
    roastLines: [
      { type: "damage", text: "AI couldn't generate a roast, but your about section probably roasts itself." },
      { type: "analysis", text: `We found ${analysis.metrics.buzzwordCount} buzzwords. The data speaks for itself.` },
      { type: "insult", text: "It's just too corporate for the AI to handle." }
    ],
    improvements: [{ icon: "⚙️", text: "Tone down the 'passionate leader' stuff and try again." }],
    positiveEnding: "At least your buzzword density is real data.",
    radarData: [
      { category: "Buzzword Free", score: scores.buzzwordDensity, fullMark: 100 },
      { category: "Readability", score: scores.recruiterReadability, fullMark: 100 },
      { category: "Cringe-Free", score: scores.cringeFactor, fullMark: 100 },
      { category: "Achievements", score: scores.achievementClarity, fullMark: 100 },
      { category: "Skills", score: Math.min(100, analysis.skills.length * 15), fullMark: 100 },
      { category: "Overall", score: scores.overallScore, fullMark: 100 },
    ],
  };
}

function generatePortfolioFallbackRoast(analysis: PortfolioAnalysis, scores: PortfolioScoreBreakdown): RoastResult {
  const cleanUsername = (analysis.title || new URL(analysis.url).hostname).slice(0, 30).replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
  return {
    id: `pf-${cleanUsername}-${generateShortId()}`,
    username: analysis.title || new URL(analysis.url).hostname,
    profileType: "portfolio",
    profileUrl: analysis.url,
    roastMode: "brutal",
    avatar: "",
    createdAt: new Date().toISOString(),
    hireabilityScore: scores.overallScore,
    placementReadiness: scores.projectPresentation,
    overallRoastLevel: "Fallback",
    archetype: { name: "Hosting Victim", emoji: "🌐", description: "Your portfolio survived because the AI didn't." },
    headerText: `${scores.overallScore}/100 — Another template.`,
    roastLines: [
      { type: "damage", text: "AI couldn't roast your content. Maybe there wasn't enough to roast." },
      { type: "insult", text: "It's just another template anyway." },
      { type: "analysis", text: `We detected ${analysis.metrics.projectCount} projects, but no AI models.` }
    ],
    improvements: [{ icon: "⚙️", text: "Try again when AI is awake." }],
    positiveEnding: "At least your site loaded. That's more than many developer portfolios can claim.",
    radarData: [
      { category: "Originality", score: scores.originality, fullMark: 100 },
      { category: "UX Quality", score: scores.uxQuality, fullMark: 100 },
      { category: "Content", score: scores.contentDepth, fullMark: 100 },
      { category: "Projects", score: scores.projectPresentation, fullMark: 100 },
      { category: "Semantic HTML", score: analysis.metrics.semanticHtmlScore, fullMark: 100 },
      { category: "Overall", score: scores.overallScore, fullMark: 100 },
    ],
  };
}
