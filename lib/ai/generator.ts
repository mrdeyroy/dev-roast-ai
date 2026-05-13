import OpenAI from "openai";
import type {
  GitHubAnalysis, ScoreBreakdown, RoastResult, RoastLine,
  LinkedInAnalysis, LinkedInScoreBreakdown,
  PortfolioAnalysis, PortfolioScoreBreakdown,
} from "@/lib/types/roast";
import { buildRoastPrompt, buildLinkedInRoastPrompt, buildPortfolioRoastPrompt } from "./prompts";
import { getSeverityFromScore } from "@/lib/scoring/calculator";

// ============================================
// OpenRouter AI Roast Generator
// ============================================

interface AIRoastOutput {
  archetype: { name: string; emoji: string; description: string };
  githubRoast: { roastLines: RoastLine[] };
  readmeRoast: { roastLines: RoastLine[] };
  projectRoast: { roastLines: RoastLine[] };
  improvements: { category: string; icon: string; suggestions: string[] }[];
}

const MODELS = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "google/gemma-4-31b-it:free",
  "qwen/qwen3-coder:free",
  "openrouter/free" // Guaranteed fallback router
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

async function callAI(prompt: string, systemMessage: string): Promise<AIRoastOutput | null> {
  const openai = getOpenAIClient();
  if (!openai) return null;

  let responseText = "";
  let success = false;

  for (const model of MODELS) {
    try {
      console.log(`Attempting roast with model: ${model}`);
      const completion = await openai.chat.completions.create({
        model: model,
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: prompt },
        ],
        temperature: 0.9,
        max_tokens: 1500,
        response_format: { type: "json_object" }
      });

      responseText = completion.choices[0].message.content || "";
      success = true;
      break;
    } catch (error) {
      console.error(`Failed with model ${model}:`, error);
    }
  }

  if (!success || !responseText) return null;

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
}

function sanitizeAIOutput(output: AIRoastOutput): AIRoastOutput {
  if (!output.githubRoast?.roastLines) {
    output.githubRoast = { roastLines: [{ type: "damage", text: "The AI was too stunned to speak." }] };
  }
  if (!output.readmeRoast?.roastLines) {
    output.readmeRoast = { roastLines: [{ type: "insult", text: "Your profile broke the parser." }] };
  }
  if (!output.projectRoast?.roastLines) {
    output.projectRoast = { roastLines: [{ type: "analysis", text: "No notable data detected." }] };
  }
  if (!output.archetype?.name) {
    output.archetype = { name: "Mystery Dev", emoji: "🕵️", description: "The AI couldn't figure you out." };
  }
  return output;
}

// ============================================
// GitHub Roast Generator (original)
// ============================================

export async function generateRoast(
  analysis: GitHubAnalysis,
  scores: ScoreBreakdown,
  roastMode: string,
  placementMode: boolean
): Promise<RoastResult> {
  const prompt = buildRoastPrompt(analysis, scores, roastMode);
  const systemMsg = `You are Dev Roast AI. You roast developers in a funny, internet-native, slightly savage but useful way. You MUST output ONLY valid JSON matching the exact schema provided in the user prompt. No markdown wrapping.`;

  const aiOutput = await callAI(prompt, systemMsg);

  if (!aiOutput) {
    console.error("All OpenRouter free models failed or timed out.");
    return generateGitHubFallbackRoast(analysis, "All free AI models are currently busy.");
  }

  const safe = sanitizeAIOutput(aiOutput);

  return {
    id: `${analysis.profile.login}-${Math.random().toString(36).substring(2, 7)}`,
    username: analysis.profile.login,
    profileType: "github",
    profileUrl: `https://github.com/${analysis.profile.login}`,
    roastMode,
    avatar: analysis.profile.avatar_url,
    createdAt: new Date().toISOString(),
    hireabilityScore: scores.hireabilityScore,
    placementReadiness: scores.placementReadiness,
    overallRoastLevel: "Medium",
    archetype: safe.archetype,
    githubRoast: {
      title: "GitHub Activity",
      icon: "🔥",
      severity: getSeverityFromScore(scores.commitConsistency),
      score: scores.commitConsistency,
      roastLines: safe.githubRoast.roastLines,
      metrics: [
        { label: "Total Repos", value: analysis.metrics.totalRepos.toString() },
        { label: "Stars Earned", value: analysis.metrics.totalStars.toString() },
        { label: "Forks Created", value: analysis.metrics.totalForks.toString() },
      ],
    },
    readmeRoast: {
      title: "README Quality",
      icon: "📄",
      severity: getSeverityFromScore(scores.readmeQuality),
      score: scores.readmeQuality,
      roastLines: safe.readmeRoast.roastLines,
      metrics: [
        { label: "Total READMEs", value: analysis.readmeAnalysis.totalWithReadme.toString() },
        { label: "Custom READMEs", value: analysis.readmeAnalysis.totalWithCustomReadme.toString() },
        { label: "Badges Used", value: analysis.readmeAnalysis.badgeHeavyRepos.toString() },
      ],
    },
    projectRoast: {
      title: "Project Quality",
      icon: "💻",
      severity: getSeverityFromScore(scores.projectOriginality),
      score: scores.projectOriginality,
      roastLines: safe.projectRoast.roastLines,
      metrics: [
        { label: "Languages Used", value: Object.keys(analysis.metrics.languages).length.toString() },
        { label: "Deployed Projects", value: analysis.metrics.deployedProjects.toString() },
      ],
    },
    improvements: safe.improvements || [],
    radarData: [
      { category: "Hireability", score: scores.hireabilityScore, fullMark: 100 },
      { category: "Consistency", score: scores.commitConsistency, fullMark: 100 },
      { category: "Originality", score: scores.projectOriginality, fullMark: 100 },
      { category: "Readme Quality", score: scores.readmeQuality, fullMark: 100 },
      { category: "Profile Comp.", score: scores.profileCompleteness, fullMark: 100 },
      { category: "Stack Depth", score: scores.stackDepth, fullMark: 100 },
    ],
  };
}

// ============================================
// LinkedIn Roast Generator
// ============================================

export async function generateLinkedInRoast(
  analysis: LinkedInAnalysis,
  scores: LinkedInScoreBreakdown,
  roastMode: string
): Promise<RoastResult> {
  const prompt = buildLinkedInRoastPrompt(analysis, scores, roastMode);
  const systemMsg = `You are Dev Roast AI — LinkedIn Edition. You roast LinkedIn profiles with corporate cringe humor. Be funny, specific, and reference actual buzzwords and phrases found. Output ONLY valid JSON. No markdown wrapping.`;

  const aiOutput = await callAI(prompt, systemMsg);

  if (!aiOutput) {
    return generateLinkedInFallbackRoast(analysis, scores, "All free AI models are currently busy.");
  }

  const safe = sanitizeAIOutput(aiOutput);
  const m = analysis.metrics;

  const username = analysis.headline
    ? analysis.headline.slice(0, 30).replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()
    : "linkedin-user";

  return {
    id: `li-${username}-${Math.random().toString(36).substring(2, 7)}`,
    username: analysis.headline || "LinkedIn User",
    profileType: "linkedin",
    profileUrl: analysis.profileUrl || "",
    roastMode,
    avatar: "",
    createdAt: new Date().toISOString(),
    hireabilityScore: scores.overallScore,
    placementReadiness: scores.recruiterReadability,
    overallRoastLevel: "Medium",
    archetype: safe.archetype,
    githubRoast: {
      title: "Headline & Title",
      icon: "💼",
      severity: getSeverityFromScore(scores.cringeFactor),
      score: scores.cringeFactor,
      roastLines: safe.githubRoast.roastLines,
      metrics: [
        { label: "Buzzwords", value: m.buzzwordCount.toString(), trend: m.buzzwordCount > 3 ? "down" : "up" },
        { label: "Cringe Phrases", value: m.cringePhraseCount.toString(), trend: m.cringePhraseCount > 2 ? "down" : "up" },
        { label: "Emojis", value: m.emojiCount.toString(), trend: m.emojiCount > 5 ? "down" : "flat" },
      ],
    },
    readmeRoast: {
      title: "About & Bio",
      icon: "📋",
      severity: getSeverityFromScore(scores.recruiterReadability),
      score: scores.recruiterReadability,
      roastLines: safe.readmeRoast.roastLines,
      metrics: [
        { label: "Word Count", value: m.totalWords.toString() },
        { label: "AI Buzzwords", value: m.overusedAITerms.toString(), trend: m.overusedAITerms > 3 ? "down" : "flat" },
        { label: "Avg Sentence", value: `${m.avgSentenceLength} words` },
      ],
    },
    projectRoast: {
      title: "Credibility & Achievements",
      icon: "🏆",
      severity: getSeverityFromScore(scores.achievementClarity),
      score: scores.achievementClarity,
      roastLines: safe.projectRoast.roastLines,
      metrics: [
        { label: "Measurable Results", value: m.measurableAchievements.toString(), trend: m.measurableAchievements > 2 ? "up" : "down" },
        { label: "Skills Listed", value: analysis.skills.length.toString() },
        { label: "Open to Work", value: m.hasOpenToWork ? "🟢 Yes" : "No" },
      ],
    },
    improvements: safe.improvements || [],
    radarData: [
      { category: "Buzzword Free", score: scores.buzzwordDensity, fullMark: 100 },
      { category: "Readability", score: scores.recruiterReadability, fullMark: 100 },
      { category: "Cringe-Free", score: scores.cringeFactor, fullMark: 100 },
      { category: "Achievements", score: scores.achievementClarity, fullMark: 100 },
      { category: "Skills Depth", score: Math.min(100, analysis.skills.length * 15), fullMark: 100 },
      { category: "Authenticity", score: scores.overallScore, fullMark: 100 },
    ],
  };
}

// ============================================
// Portfolio Roast Generator
// ============================================

export async function generatePortfolioRoast(
  analysis: PortfolioAnalysis,
  scores: PortfolioScoreBreakdown,
  roastMode: string
): Promise<RoastResult> {
  const prompt = buildPortfolioRoastPrompt(analysis, scores, roastMode);
  const systemMsg = `You are Dev Roast AI — Portfolio Edition. You roast developer portfolios with design and frontend humor. Be funny, specific, and reference actual technologies and design patterns found. Output ONLY valid JSON. No markdown wrapping.`;

  const aiOutput = await callAI(prompt, systemMsg);

  if (!aiOutput) {
    return generatePortfolioFallbackRoast(analysis, scores, "All free AI models are currently busy.");
  }

  const safe = sanitizeAIOutput(aiOutput);
  const m = analysis.metrics;

  const username = analysis.title
    ? analysis.title.slice(0, 30).replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()
    : new URL(analysis.url).hostname.replace(/\./g, "-");

  return {
    id: `pf-${username}-${Math.random().toString(36).substring(2, 7)}`,
    username: analysis.title || new URL(analysis.url).hostname,
    profileType: "portfolio",
    profileUrl: analysis.url,
    roastMode,
    avatar: "",
    createdAt: new Date().toISOString(),
    hireabilityScore: scores.overallScore,
    placementReadiness: scores.projectPresentation,
    overallRoastLevel: "Medium",
    archetype: safe.archetype,
    githubRoast: {
      title: "Design & Visual",
      icon: "🎨",
      severity: getSeverityFromScore(scores.originality),
      score: scores.originality,
      roastLines: safe.githubRoast.roastLines,
      metrics: [
        { label: "Animations", value: m.animationLibraries.length > 0 ? m.animationLibraries.join(", ") : "None" },
        { label: "CSS Framework", value: m.cssFrameworks.length > 0 ? m.cssFrameworks.join(", ") : "Custom" },
        { label: "Template", value: m.isTemplate ? "Detected 🚨" : "Original ✓" },
      ],
    },
    readmeRoast: {
      title: "Content & Copy",
      icon: "📝",
      severity: getSeverityFromScore(scores.contentDepth),
      score: scores.contentDepth,
      roastLines: safe.readmeRoast.roastLines,
      metrics: [
        { label: "Word Count", value: m.totalWords.toString() },
        { label: "Images", value: m.imageCount.toString() },
        { label: "Headings", value: m.headingCount.toString() },
      ],
    },
    projectRoast: {
      title: "Tech & Projects",
      icon: "⚙️",
      severity: getSeverityFromScore(scores.projectPresentation),
      score: scores.projectPresentation,
      roastLines: safe.projectRoast.roastLines,
      metrics: [
        { label: "Projects Found", value: m.projectCount.toString() },
        { label: "Technologies", value: analysis.technologies.length > 0 ? analysis.technologies.join(", ") : "Unknown" },
        { label: "Social Links", value: analysis.socialLinks.length.toString() },
      ],
    },
    improvements: safe.improvements || [],
    radarData: [
      { category: "Originality", score: scores.originality, fullMark: 100 },
      { category: "UX Quality", score: scores.uxQuality, fullMark: 100 },
      { category: "Content", score: scores.contentDepth, fullMark: 100 },
      { category: "Projects", score: scores.projectPresentation, fullMark: 100 },
      { category: "Semantic HTML", score: m.semanticHtmlScore, fullMark: 100 },
      { category: "Overall", score: scores.overallScore, fullMark: 100 },
    ],
  };
}

// ============================================
// Fallback Generators
// ============================================

function generateGitHubFallbackRoast(analysis: GitHubAnalysis, reason: string): RoastResult {
  return {
    id: `${analysis.profile.login}-fallback`,
    username: analysis.profile.login,
    profileType: "github",
    profileUrl: `https://github.com/${analysis.profile.login}`,
    roastMode: "brutal",
    avatar: analysis.profile.avatar_url,
    createdAt: new Date().toISOString(),
    hireabilityScore: 10,
    placementReadiness: 10,
    overallRoastLevel: "Fallback",
    archetype: {
      name: "Free Tier Survivor",
      emoji: "🛡️",
      description: "You survived the roast because the AI models were down."
    },
    githubRoast: {
      title: "GitHub Activity",
      icon: "🔥",
      severity: "nuclear",
      score: 10,
      roastLines: [
        { type: "insult", text: "We tried to ask the AI to roast you, but the models refused to respond." },
        { type: "damage", text: reason },
        { type: "analysis", text: `You have ${analysis.metrics.totalRepos} repos, but we couldn't parse them into a real roast.` },
        { type: "positive", text: "At least your GitHub profile fetching worked perfectly! Those stats below are 100% real." }
      ],
      metrics: [
        { label: "Total Repos", value: analysis.metrics.totalRepos.toString() },
        { label: "Stars Earned", value: analysis.metrics.totalStars.toString() },
        { label: "Forks Created", value: analysis.metrics.totalForks.toString() },
      ],
    },
    readmeRoast: {
      title: "README Quality",
      icon: "📄",
      severity: "nuclear",
      score: 10,
      roastLines: [{ type: "damage", text: "We couldn't generate a real roast for this section." }],
      metrics: [
        { label: "Total READMEs", value: analysis.readmeAnalysis.totalWithReadme.toString() },
        { label: "Custom READMEs", value: analysis.readmeAnalysis.totalWithCustomReadme.toString() },
        { label: "Badges Used", value: analysis.readmeAnalysis.badgeHeavyRepos.toString() },
      ],
    },
    projectRoast: {
      title: "Project Quality",
      icon: "💻",
      severity: "nuclear",
      score: 10,
      roastLines: [{ type: "damage", text: "The AI is taking a nap." }],
      metrics: [
        { label: "Languages Used", value: Object.keys(analysis.metrics.languages).length.toString() },
        { label: "Deployed Projects", value: analysis.metrics.deployedProjects.toString() },
      ],
    },
    improvements: [{
      category: "System",
      icon: "⚙️",
      suggestions: ["Check OPENROUTER_API_KEY", "Try again when OpenRouter models are less congested"]
    }],
    radarData: [
      { category: "Hireability", score: 10, fullMark: 100 },
      { category: "Consistency", score: 10, fullMark: 100 },
      { category: "Originality", score: 10, fullMark: 100 },
      { category: "Readme Quality", score: 10, fullMark: 100 },
      { category: "Activity", score: 10, fullMark: 100 },
      { category: "Sizzle", score: 10, fullMark: 100 },
    ],
  };
}

function generateLinkedInFallbackRoast(analysis: LinkedInAnalysis, scores: LinkedInScoreBreakdown, reason: string): RoastResult {
  const m = analysis.metrics;
  return {
    id: `li-fallback-${Math.random().toString(36).substring(2, 7)}`,
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
    githubRoast: {
      title: "Headline & Title",
      icon: "💼",
      severity: "nuclear",
      score: scores.cringeFactor,
      roastLines: [
        { type: "damage", text: reason },
        { type: "analysis", text: `We found ${m.buzzwordCount} buzzwords and ${m.cringePhraseCount} cringe phrases. The data speaks for itself.` },
        { type: "positive", text: "At least your buzzword density is real data. That's more honest than your LinkedIn bio." },
      ],
      metrics: [
        { label: "Buzzwords", value: m.buzzwordCount.toString() },
        { label: "Cringe Phrases", value: m.cringePhraseCount.toString() },
        { label: "Emojis", value: m.emojiCount.toString() },
      ],
    },
    readmeRoast: {
      title: "About & Bio", icon: "📋", severity: "nuclear", score: scores.recruiterReadability,
      roastLines: [{ type: "damage", text: "AI couldn't generate a roast, but your about section probably roasts itself." }],
      metrics: [{ label: "Word Count", value: m.totalWords.toString() }],
    },
    projectRoast: {
      title: "Credibility", icon: "🏆", severity: "nuclear", score: scores.achievementClarity,
      roastLines: [{ type: "damage", text: "The AI gave up trying to find measurable achievements." }],
      metrics: [{ label: "Measurable Results", value: m.measurableAchievements.toString() }],
    },
    improvements: [{ category: "System", icon: "⚙️", suggestions: ["Try again later", "AI models are congested"] }],
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

function generatePortfolioFallbackRoast(analysis: PortfolioAnalysis, scores: PortfolioScoreBreakdown, reason: string): RoastResult {
  const m = analysis.metrics;
  const hostname = (() => { try { return new URL(analysis.url).hostname; } catch { return analysis.url; } })();
  return {
    id: `pf-fallback-${Math.random().toString(36).substring(2, 7)}`,
    username: analysis.title || hostname,
    profileType: "portfolio",
    profileUrl: analysis.url,
    roastMode: "brutal",
    avatar: "",
    createdAt: new Date().toISOString(),
    hireabilityScore: scores.overallScore,
    placementReadiness: scores.projectPresentation,
    overallRoastLevel: "Fallback",
    archetype: { name: "Hosting Victim", emoji: "🌐", description: "Your portfolio survived because the AI didn't." },
    githubRoast: {
      title: "Design & Visual", icon: "🎨", severity: "nuclear", score: scores.originality,
      roastLines: [
        { type: "damage", text: reason },
        { type: "analysis", text: `We analyzed ${m.totalWords} words, ${m.imageCount} images, and ${m.projectCount} projects. The AI couldn't bear to comment.` },
        { type: "positive", text: "At least your site loaded. That's more than many developer portfolios can claim." },
      ],
      metrics: [
        { label: "Template", value: m.isTemplate ? "Detected" : "Original" },
        { label: "Animations", value: m.animationLibraries.length.toString() },
      ],
    },
    readmeRoast: {
      title: "Content", icon: "📝", severity: "nuclear", score: scores.contentDepth,
      roastLines: [{ type: "damage", text: "AI couldn't roast your content. Maybe there wasn't enough to roast." }],
      metrics: [{ label: "Words", value: m.totalWords.toString() }],
    },
    projectRoast: {
      title: "Tech & Projects", icon: "⚙️", severity: "nuclear", score: scores.projectPresentation,
      roastLines: [{ type: "damage", text: "The AI surrendered trying to find your projects." }],
      metrics: [{ label: "Projects Found", value: m.projectCount.toString() }],
    },
    improvements: [{ category: "System", icon: "⚙️", suggestions: ["Try again later", "AI models are congested"] }],
    radarData: [
      { category: "Originality", score: scores.originality, fullMark: 100 },
      { category: "UX Quality", score: scores.uxQuality, fullMark: 100 },
      { category: "Content", score: scores.contentDepth, fullMark: 100 },
      { category: "Projects", score: scores.projectPresentation, fullMark: 100 },
      { category: "Semantic HTML", score: m.semanticHtmlScore, fullMark: 100 },
      { category: "Overall", score: scores.overallScore, fullMark: 100 },
    ],
  };
}
