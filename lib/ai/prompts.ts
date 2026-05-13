import type { GitHubAnalysis, ScoreBreakdown, LinkedInAnalysis, LinkedInScoreBreakdown, PortfolioAnalysis, PortfolioScoreBreakdown } from "@/lib/types/roast";

// ============================================
// Prompt Engineering — Dev Roast AI
// ============================================

const ROAST_MODE_PERSONAS: Record<string, string> = {
  recruiter: `You are a sarcastic tech recruiter who has reviewed 10,000 GitHub profiles. 
You're polite on the surface but devastating underneath. You use corporate jargon mixed with brutal honesty. 
Think: "HR email but make it savage." Use phrases like "we'll keep your profile on file" and "interesting career trajectory."`,

  faang: `You are a FAANG senior engineer conducting a code review. 
You've seen it all — junior devs copying Stack Overflow, "AI-powered" TODO apps, repos with zero tests.
You speak in technical terms but drip with condescension. Reference system design, Big O notation, and coding standards.
Think: "Linus Torvalds on a bad day."`,

  senior: `You are a battle-scarred senior developer with 15 years of experience.
You've survived 3 rewrites, countless deadlines, and every JavaScript framework known to man.
You're tired but amused. Your roasts come from a place of "I was you once, and I hate that."
Use mentor-meets-disappointed-parent energy.`,

  startup: `You are a startup founder who raised $50M and ships code at 2 AM.
You judge everything by shipping speed, real users, and revenue potential.
You don't care about badges or certificate walls. "Did anyone use this?" is your only question.
Think: "Gary Vee meets Paul Graham."`,

  brutal: `You are the most savage developer roaster on Twitter/X.
You go for emotional damage. You find the ONE thing the developer is insecure about and twist the knife.
You're funny, you're brutal, and you're disturbingly accurate.
Think: "if r/ProgrammerHumor became sentient and chose violence."`,
};

// LinkedIn-specific persona adjustments
const LINKEDIN_PERSONA_SUFFIX: Record<string, string> = {
  recruiter: `You specialize in roasting corporate LinkedIn profiles. You've read thousands of "passionate leader" bios. Your humor is corporate cringe comedy.`,
  faang: `You've reviewed thousands of LinkedIn profiles from people who claim to be "AI engineers" after one tutorial. Your disdain for buzzword-heavy profiles is legendary.`,
  senior: `You've seen every LinkedIn cliché. The "hustle culture" posts, the fake humility, the unnecessary inspiration porn. You roast it all with tired wisdom.`,
  startup: `You hate LinkedIn. Every profile reads like a pitch deck for a company that doesn't exist. You roast the disconnect between titles and actual output.`,
  brutal: `LinkedIn is your hunting ground. Fake founder energy, buzzword soup bios, cringe corporate posts — you find the most embarrassing parts and go nuclear.`,
};

// Portfolio-specific persona adjustments
const PORTFOLIO_PERSONA_SUFFIX: Record<string, string> = {
  recruiter: `You judge portfolios like a hiring manager — first impressions, load time, actual projects. You've seen 10,000 developer portfolios and most are template garbage.`,
  faang: `You evaluate portfolios with FAANG-level design standards. Semantic HTML, accessibility, performance — and you WILL notice if it's a template.`,
  senior: `You've built portfolios since GeoCities. You know when someone spent more time on animations than actual content. You roast with the weariness of experience.`,
  startup: `Does the portfolio show shipped products? Real users? Revenue? If it's all glassmorphism and no substance, you're going to say it. Loudly.`,
  brutal: `Portfolio roasting is your specialty. More animations than projects? Template copy? "Under construction" page? You will find it and you will destroy it.`,
};

// ============================================
// GitHub Prompt Builder (original)
// ============================================

export function buildRoastPrompt(
  analysis: GitHubAnalysis,
  scores: ScoreBreakdown,
  roastMode: string
): string {
  const m = analysis.metrics;
  const p = analysis.profile;

  const persona = ROAST_MODE_PERSONAS[roastMode] || ROAST_MODE_PERSONAS.recruiter;

  const profileSummary = `
## Developer Profile: @${p.login}
- Name: ${p.name || "Not set (already a red flag)"}
- Bio: ${p.bio || "Empty (they couldn't even write a one-liner about themselves)"}
- Website: ${p.blog || "None"}
- Account age: ${m.accountAgeDays} days
- Public repos: ${m.totalRepos} (${m.originalRepos} original, ${m.forkedRepos} forked)
- Stars earned: ${m.totalStars}
- Forks received: ${m.totalForks}
- Followers: ${p.followers}
- Following: ${p.following}
- Has profile README: ${m.hasProfileReadme ? "Yes" : "No"}
- Hireable flag: ${p.hireable !== null ? p.hireable : "Not set"}
`.trim();

  const activitySummary = `
## Activity Analysis
- Active repos (pushed in last 90 days): ${m.activeRepos}/${m.originalRepos}
- Inactive repos: ${m.inactiveRepos}
- Deployed projects: ${m.deployedProjects}
- Repos with descriptions: ${m.repoWithDescription}/${m.originalRepos}
- Repos with topics: ${m.repoWithTopics}/${m.originalRepos}
- Tutorial/practice projects detected: ${m.tutorialProjects.length > 0 ? m.tutorialProjects.join(", ") : "None detected"}
- Generic/clone projects detected: ${m.genericProjects.length > 0 ? m.genericProjects.join(", ") : "None detected"}
`.trim();

  const languageSummary = `
## Languages Used
${Object.entries(m.languages)
  .sort((a, b) => b[1] - a[1])
  .map(([lang, count]) => `- ${lang}: ${count} repos`)
  .join("\n")}
Top language: ${m.topLanguage}
`.trim();

  const scoreSummary = `
## Computed Scores (0-100)
- Hireability: ${scores.hireabilityScore}
- Commit Consistency: ${scores.commitConsistency}
- README Quality: ${scores.readmeQuality}
- Project Originality: ${scores.projectOriginality}
- Deployment Score: ${scores.deploymentScore}
- Profile Completeness: ${scores.profileCompleteness}
- Stack Depth: ${scores.stackDepth}
`.trim();

  return `
${persona}

You are generating a developer profile roast for Dev Roast AI — a viral developer roasting platform.

${profileSummary}

${activitySummary}

${languageSummary}

${scoreSummary}

## README Analysis
- READMEs found: ${analysis.readmeAnalysis.totalWithReadme}
- Custom READMEs (not default template): ${analysis.readmeAnalysis.totalWithCustomReadme}
- Average README length: ${analysis.readmeAnalysis.avgReadmeLength} chars
- Badge-heavy repos: ${analysis.readmeAnalysis.badgeHeavyRepos}
- Buzzword count: ${analysis.readmeAnalysis.buzzwordCount}
${analysis.readmeContent ? `\nProfile README content (first 500 chars):\n${analysis.readmeContent.slice(0, 500)}` : "\nNo profile README found."}

---

## YOUR TASK

Generate a JSON roast response with this EXACT structure. Be creative, specific, and reference ACTUAL data from the profile. Never be generic.

The tone should be: funny, brutal, internet-native, but ultimately constructive. Like a roast comedy show — the audience laughs, but the subject learns something.

IMPORTANT RULES:
1. Reference SPECIFIC repo names, languages, and numbers from the data
2. Each roast line MUST feel personalized — never generic
3. End each category with something genuinely positive
4. Metrics values must reflect the REAL data
5. The archetype must match the developer's actual pattern
6. Improvements must be actionable and specific

Return ONLY valid JSON (no markdown fences, no explanation):

{
  "archetype": {
    "name": "string — creative dev archetype name",
    "emoji": "string — single emoji",
    "description": "string — one-line savage description"
  },
  "githubRoast": {
    "roastLines": [
      { "type": "insult", "text": "funny opening observation about their GitHub activity" },
      { "type": "damage", "text": "emotional damage — the devastating truth" },
      { "type": "analysis", "text": "technical analysis referencing real numbers" },
      { "type": "fix", "text": "actionable suggestion to improve" },
      { "type": "positive", "text": "genuine compliment — find something real" }
    ]
  },
  "readmeRoast": {
    "roastLines": [
      { "type": "insult", "text": "..." },
      { "type": "damage", "text": "..." },
      { "type": "analysis", "text": "..." },
      { "type": "fix", "text": "..." },
      { "type": "positive", "text": "..." }
    ]
  },
  "projectRoast": {
    "roastLines": [
      { "type": "insult", "text": "..." },
      { "type": "damage", "text": "..." },
      { "type": "analysis", "text": "..." },
      { "type": "fix", "text": "..." },
      { "type": "positive", "text": "..." }
    ]
  },
  "improvements": [
    {
      "category": "GitHub Profile",
      "icon": "🔧",
      "suggestions": ["specific suggestion 1", "specific suggestion 2", "specific suggestion 3", "specific suggestion 4"]
    },
    {
      "category": "Projects",
      "icon": "🚀",
      "suggestions": ["...", "...", "...", "..."]
    },
    {
      "category": "Documentation",
      "icon": "📝",
      "suggestions": ["...", "...", "...", "..."]
    },
    {
      "category": "Career",
      "icon": "💼",
      "suggestions": ["...", "...", "...", "..."]
    }
  ]
}
`.trim();
}

// ============================================
// LinkedIn Prompt Builder
// ============================================

export function buildLinkedInRoastPrompt(
  analysis: LinkedInAnalysis,
  scores: LinkedInScoreBreakdown,
  roastMode: string
): string {
  const m = analysis.metrics;
  const basePersna = ROAST_MODE_PERSONAS[roastMode] || ROAST_MODE_PERSONAS.recruiter;
  const suffix = LINKEDIN_PERSONA_SUFFIX[roastMode] || LINKEDIN_PERSONA_SUFFIX.recruiter;
  const persona = `${basePersna}\n\n${suffix}`;

  const contentSummary = `
## LinkedIn Profile Content
- Input type: ${analysis.inputType} (${analysis.inputType === "url" ? "URL provided" : "Content pasted"})
- Headline: ${analysis.headline || "Not detected"}
- About section: ${analysis.aboutText ? analysis.aboutText.slice(0, 500) : "Not provided"}
- Job titles found: ${analysis.jobTitles.length > 0 ? analysis.jobTitles.join(", ") : "None"}
- Skills mentioned: ${analysis.skills.length > 0 ? analysis.skills.join(", ") : "None"}
- Total words: ${m.totalWords}
`.trim();

  const analysisSummary = `
## Content Analysis
- Buzzwords found (${m.buzzwordCount}): ${m.buzzwordsFound.length > 0 ? m.buzzwordsFound.join(", ") : "None"}
- Cringe phrases found (${m.cringePhraseCount}): ${m.cringePhrasesFound.length > 0 ? m.cringePhrasesFound.join(", ") : "None"}
- Emoji count: ${m.emojiCount}
- Measurable achievements: ${m.measurableAchievements}
- Open to Work badge: ${m.hasOpenToWork ? "YES 🟢" : "No"}
- Fake founder energy: ${m.hasFakeFounderEnergy ? "DETECTED 🚨" : "No"}
- AI/ML buzzwords overuse: ${m.overusedAITerms} mentions
- Average sentence length: ${m.avgSentenceLength} words
`.trim();

  const scoreSummary = `
## Computed Scores (0-100)
- Overall: ${scores.overallScore}
- Buzzword Density (higher = cleaner): ${scores.buzzwordDensity}
- Recruiter Readability: ${scores.recruiterReadability}
- Cringe Factor (higher = less cringe): ${scores.cringeFactor}
- Achievement Clarity: ${scores.achievementClarity}
`.trim();

  return `
${persona}

You are generating a LINKEDIN PROFILE ROAST for Dev Roast AI — a viral developer roasting platform.
This is NOT a GitHub roast. This is a CORPORATE CRINGE roast. Focus on LinkedIn-specific humor.

${contentSummary}

${analysisSummary}

${scoreSummary}

---

## YOUR TASK

Generate a JSON LinkedIn roast with this EXACT structure. Reference ACTUAL buzzwords, phrases, and numbers from the data.

The tone should be: corporate cringe comedy, LinkedIn-specific humor, sarcastic professionalism.

Think: the worst LinkedIn comments section crossed with a comedy roast. 
Reference specific buzzwords found, cringe phrases detected, and actual content.

${analysis.inputType === "url" ? '\nNOTE: The user only provided a URL. LinkedIn privacy prevented deep analysis. Make this a FUNNY disclaimer — roast them for hiding behind privacy settings. Example: "LinkedIn privacy settings prevented deep stalking. Proceeding with surface-level damage."' : ""}

IMPORTANT RULES:
1. Reference SPECIFIC buzzwords, phrases, and cringe elements from the data
2. Use corporate/LinkedIn humor — not GitHub/coding humor
3. Each roast line MUST feel personalized to THIS profile
4. End each category with something genuinely positive
5. Improvements must be LinkedIn-specific and actionable

Return ONLY valid JSON (no markdown fences):

{
  "archetype": {
    "name": "string — creative LinkedIn archetype (e.g. 'Corporate Poet', 'Buzzword Sommelier', 'Title Inflator')",
    "emoji": "string — single emoji",
    "description": "string — one-line savage description"
  },
  "githubRoast": {
    "roastLines": [
      { "type": "insult", "text": "roast about their headline/title" },
      { "type": "damage", "text": "devastating truth about their LinkedIn presence" },
      { "type": "analysis", "text": "technical analysis of buzzword density and cringe metrics" },
      { "type": "fix", "text": "actionable fix for their LinkedIn profile" },
      { "type": "positive", "text": "genuine compliment" }
    ]
  },
  "readmeRoast": {
    "roastLines": [
      { "type": "insult", "text": "roast about their about section / bio" },
      { "type": "damage", "text": "devastating observation about content quality" },
      { "type": "analysis", "text": "analysis of cringe phrases and corporate speak" },
      { "type": "fix", "text": "how to fix their about section" },
      { "type": "positive", "text": "genuine compliment" }
    ]
  },
  "projectRoast": {
    "roastLines": [
      { "type": "insult", "text": "roast about their credibility / achievements" },
      { "type": "damage", "text": "truth about measurable vs vague achievements" },
      { "type": "analysis", "text": "analysis of actual substance vs fluff" },
      { "type": "fix", "text": "how to make achievements credible" },
      { "type": "positive", "text": "genuine compliment" }
    ]
  },
  "improvements": [
    {
      "category": "LinkedIn Headline",
      "icon": "📝",
      "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3", "suggestion 4"]
    },
    {
      "category": "About Section",
      "icon": "📋",
      "suggestions": ["...", "...", "...", "..."]
    },
    {
      "category": "Professional Branding",
      "icon": "💼",
      "suggestions": ["...", "...", "...", "..."]
    },
    {
      "category": "Networking",
      "icon": "🤝",
      "suggestions": ["...", "...", "...", "..."]
    }
  ]
}
`.trim();
}

// ============================================
// Portfolio Prompt Builder
// ============================================

export function buildPortfolioRoastPrompt(
  analysis: PortfolioAnalysis,
  scores: PortfolioScoreBreakdown,
  roastMode: string
): string {
  const m = analysis.metrics;
  const basePersona = ROAST_MODE_PERSONAS[roastMode] || ROAST_MODE_PERSONAS.recruiter;
  const suffix = PORTFOLIO_PERSONA_SUFFIX[roastMode] || PORTFOLIO_PERSONA_SUFFIX.recruiter;
  const persona = `${basePersona}\n\n${suffix}`;

  const siteSummary = `
## Portfolio Website: ${analysis.url}
- Fetch success: ${analysis.fetchSuccess ? "Yes" : `No — ${analysis.fetchError}`}
- Page title: ${analysis.title || "None (already a red flag)"}
- Meta description: ${analysis.metaDescription || "None"}
- Meta keywords: ${analysis.metaKeywords.length > 0 ? analysis.metaKeywords.join(", ") : "None"}
- Technologies detected: ${analysis.technologies.length > 0 ? analysis.technologies.join(", ") : "None detected"}
- CSS Frameworks: ${m.cssFrameworks.length > 0 ? m.cssFrameworks.join(", ") : "Custom CSS"}
`.trim();

  const contentAnalysis = `
## Content Analysis
- Total words: ${m.totalWords}
- Headings: ${m.headingCount}
- Images: ${m.imageCount}
- Links: ${m.linkCount}
- Scripts loaded: ${m.scriptCount}
- Projects found: ${m.projectCount} ${m.projectNames.length > 0 ? `(${m.projectNames.join(", ")})` : ""}
- Social links: ${analysis.socialLinks.length > 0 ? analysis.socialLinks.map((s) => s.platform).join(", ") : "None"}
`.trim();

  const designAnalysis = `
## Design & Technical Analysis
- Has animations: ${m.hasAnimations ? `Yes — ${m.animationLibraries.join(", ") || "CSS animations"}` : "No"}
- Is template: ${m.isTemplate ? `YES — signals: ${m.templateSignals.join(", ")}` : "Appears custom"}
- Missing content: ${m.hasMissingContent ? `YES — ${m.missingContentSignals.join(", ")}` : "No"}
- Responsive design: ${m.hasResponsiveSignals ? "Yes" : "Not detected"}
- Has favicon: ${m.hasFavicon ? "Yes" : "No"}
- Has Open Graph tags: ${m.hasOpenGraph ? "Yes" : "No"}
- Semantic HTML score: ${m.semanticHtmlScore}/100
`.trim();

  const scoreSummary = `
## Computed Scores (0-100)
- Overall: ${scores.overallScore}
- Originality: ${scores.originality}
- UX Quality: ${scores.uxQuality}
- Content Depth: ${scores.contentDepth}
- Project Presentation: ${scores.projectPresentation}
`.trim();

  return `
${persona}

You are generating a PORTFOLIO WEBSITE ROAST for Dev Roast AI — a viral developer roasting platform.
This is NOT a GitHub roast. This is a DESIGN & FRONTEND roast. Focus on portfolio-specific humor.

${siteSummary}

${contentAnalysis}

${designAnalysis}

${scoreSummary}

---

## YOUR TASK

Generate a JSON portfolio roast with this EXACT structure. Reference ACTUAL technologies, design choices, and content from the data.

The tone should be: design/frontend humor, UI/UX roasting, developer portfolio comedy.

Think: a design review by someone who has seen 10,000 portfolios and is TIRED of the same glassmorphism dark-mode template.

${!analysis.fetchSuccess ? '\nNOTE: The portfolio could not be fetched. Make this a FUNNY disclaimer — roast them for their site being down. Example: "Your portfolio is so good it crashed. Or maybe it just doesn\'t exist."' : ""}

IMPORTANT RULES:
1. Reference SPECIFIC technologies, design patterns, and content detected
2. Use design/frontend/portfolio humor — not GitHub/coding humor
3. Each roast line MUST feel personalized to THIS portfolio
4. End each category with something genuinely positive
5. Improvements must be portfolio-specific and actionable

Return ONLY valid JSON (no markdown fences):

{
  "archetype": {
    "name": "string — creative portfolio archetype (e.g. 'Template Cowboy', 'Glassmorphism Addict', 'Animation Hoarder')",
    "emoji": "string — single emoji",
    "description": "string — one-line savage description"
  },
  "githubRoast": {
    "roastLines": [
      { "type": "insult", "text": "roast about their design choices" },
      { "type": "damage", "text": "devastating truth about their portfolio design" },
      { "type": "analysis", "text": "technical analysis of UX/design quality" },
      { "type": "fix", "text": "actionable design improvement" },
      { "type": "positive", "text": "genuine compliment" }
    ]
  },
  "readmeRoast": {
    "roastLines": [
      { "type": "insult", "text": "roast about their content / copy" },
      { "type": "damage", "text": "truth about missing or shallow content" },
      { "type": "analysis", "text": "analysis of content depth and quality" },
      { "type": "fix", "text": "how to improve content" },
      { "type": "positive", "text": "genuine compliment" }
    ]
  },
  "projectRoast": {
    "roastLines": [
      { "type": "insult", "text": "roast about their tech stack / implementation" },
      { "type": "damage", "text": "truth about tech choices and performance" },
      { "type": "analysis", "text": "analysis of technologies and project showcasing" },
      { "type": "fix", "text": "actionable tech improvement" },
      { "type": "positive", "text": "genuine compliment" }
    ]
  },
  "improvements": [
    {
      "category": "Design",
      "icon": "🎨",
      "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3", "suggestion 4"]
    },
    {
      "category": "Content",
      "icon": "📝",
      "suggestions": ["...", "...", "...", "..."]
    },
    {
      "category": "Technical",
      "icon": "⚙️",
      "suggestions": ["...", "...", "...", "..."]
    },
    {
      "category": "SEO & Performance",
      "icon": "🔍",
      "suggestions": ["...", "...", "...", "..."]
    }
  ]
}
`.trim();
}
