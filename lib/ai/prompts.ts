import type { GitHubAnalysis, ScoreBreakdown, LinkedInAnalysis, LinkedInScoreBreakdown, PortfolioAnalysis, PortfolioScoreBreakdown } from "@/lib/types/roast";

// ============================================
// Prompt Engineering — Short & Viral Format
// ============================================

const ROAST_MODE_PERSONAS: Record<string, string> = {
  recruiter: `You are a sarcastic tech recruiter. You're polite on the surface but devastating underneath. Use corporate jargon.`,
  faang: `You are a FAANG senior engineer conducting a code review. Drip with condescension.`,
  senior: `You are a battle-scarred senior developer. You're tired but amused. Mentor-meets-disappointed-parent energy.`,
  startup: `You are a startup founder who ships code at 2 AM. You judge everything by shipping speed and real users.`,
  brutal: `You are the most savage developer roaster on Twitter/X. You go for emotional damage.`,
};

function buildBasePrompt(persona: string, metricsJson: string, platformContext: string): string {
  return `
${persona}

You are generating a short, viral, highly shareable roast for Dev Roast AI.
Platform context: ${platformContext}

Here is the summarized data:
${metricsJson}

---

## YOUR TASK
Generate a JSON roast with this EXACT structure.
Make it SHORT, PUNCHY, and MEME-WORTHY (150-250 words total).
NO giant paragraphs. NO deep technical explanations. Prioritize humor and emotional damage.

IMPORTANT RULES:
1. Reference specific numbers/languages from the data.
2. Keep roastLines very short (1-2 sentences max).
3. Improvements must be actionable but sarcastic (3 max).
4. The positiveEnding should be exactly one line.

Return ONLY valid JSON:

{
  "archetype": {
    "name": "Creative title (e.g. 'Template Cowboy')",
    "emoji": "Single emoji",
    "description": "One-line savage description"
  },
  "headerText": "Short punchy header (e.g. '42/100 — Recruiters are nervous.')",
  "roastLines": [
    { "type": "damage", "text": "Short brutal observation 1" },
    { "type": "insult", "text": "Short brutal observation 2" },
    { "type": "analysis", "text": "Short brutal observation 3" }
  ],
  "improvements": [
    { "icon": "🔥", "text": "Short actionable suggestion 1" },
    { "icon": "💻", "text": "Short actionable suggestion 2" }
  ],
  "positiveEnding": "One line genuine but slightly backhanded compliment."
}
`.trim();
}

export function buildRoastPrompt(analysis: GitHubAnalysis, scores: ScoreBreakdown, roastMode: string): string {
  const m = analysis.metrics;
  const p = analysis.profile;
  const persona = ROAST_MODE_PERSONAS[roastMode] || ROAST_MODE_PERSONAS.recruiter;

  const metricsObj = {
    username: p.login,
    accountAgeDays: m.accountAgeDays,
    totalRepos: m.totalRepos,
    originalRepos: m.originalRepos,
    inactiveRepos: m.inactiveRepos,
    stars: m.totalStars,
    deployments: m.deployedProjects,
    topLanguages: Object.keys(m.languages).slice(0, 3),
    tutorialProjectsDetected: m.tutorialProjects.length,
    hireabilityScore: scores.hireabilityScore
  };

  return buildBasePrompt(persona, JSON.stringify(metricsObj, null, 2), "GitHub Profile Roast");
}

export function buildLinkedInRoastPrompt(analysis: LinkedInAnalysis, scores: LinkedInScoreBreakdown, roastMode: string): string {
  const m = analysis.metrics;
  const persona = ROAST_MODE_PERSONAS[roastMode] || ROAST_MODE_PERSONAS.recruiter;

  const metricsObj = {
    inputType: analysis.inputType,
    buzzwordCount: m.buzzwordCount,
    cringePhraseCount: m.cringePhraseCount,
    topBuzzwords: m.buzzwordsFound.slice(0, 3),
    measurableAchievements: m.measurableAchievements,
    hasOpenToWork: m.hasOpenToWork,
    overallScore: scores.overallScore
  };

  return buildBasePrompt(persona, JSON.stringify(metricsObj, null, 2), "LinkedIn Corporate Cringe Roast");
}

export function buildPortfolioRoastPrompt(analysis: PortfolioAnalysis, scores: PortfolioScoreBreakdown, roastMode: string): string {
  const m = analysis.metrics;
  const persona = ROAST_MODE_PERSONAS[roastMode] || ROAST_MODE_PERSONAS.recruiter;

  const metricsObj = {
    url: analysis.url,
    totalWords: m.totalWords,
    projectsShowcased: m.projectCount,
    isTemplate: m.isTemplate,
    hasAnimations: m.hasAnimations,
    technologiesDetected: analysis.technologies.slice(0, 3),
    overallScore: scores.overallScore
  };

  return buildBasePrompt(persona, JSON.stringify(metricsObj, null, 2), "Developer Portfolio UI/UX Roast");
}
