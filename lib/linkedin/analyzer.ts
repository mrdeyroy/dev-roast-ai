import type { LinkedInAnalysis } from "@/lib/types/roast";

// ============================================
// LinkedIn Content Analyzer
// ============================================

const BUZZWORDS = [
  "synergy", "leverage", "thought leader", "serial entrepreneur",
  "passionate", "self-taught", "growth hacker", "disruptor",
  "innovative", "visionary", "dynamic", "proactive", "results-driven",
  "team player", "go-getter", "game-changer", "paradigm shift",
  "scalable", "agile", "cross-functional", "stakeholder",
  "value-add", "best practices", "deep dive", "move the needle",
  "circle back", "low-hanging fruit", "bandwidth", "pivot",
  "ecosystem", "end-to-end", "holistic", "seamless", "robust",
  "cutting-edge", "state-of-the-art", "next-gen", "world-class",
  "top-notch", "best-in-class", "industry-leading", "mission-critical",
  "transformative", "empowering", "optimize", "strategize",
  "ideation", "upskill", "reskill", "thought leadership",
  "data-driven", "customer-centric",
];

const CRINGE_PHRASES = [
  "aspiring ai/ml enthusiast",
  "open to work",
  "aspiring data scientist",
  "aspiring developer",
  "future ceo",
  "serial entrepreneur",
  "building the future",
  "changing the world",
  "making the world a better place",
  "on a mission to",
  "hustler",
  "grindset",
  "10x developer",
  "ninja",
  "rockstar",
  "guru",
  "wizard",
  "evangelist",
  "ambassador",
  "dream big",
  "work hard play hard",
  "eat sleep code repeat",
  "code is poetry",
  "coding is my passion",
  "let's connect",
  "always learning",
  "lifelong learner",
  "jack of all trades",
  "full stack everything",
  "multi-passionate",
  "thought leader in the making",
  "influencer",
  "content creator & developer",
  "student of life",
  "driven individual",
  "problem solver",
  "born to code",
];

const AI_BUZZWORDS = [
  "ai", "ml", "machine learning", "deep learning", "neural network",
  "llm", "gpt", "generative ai", "prompt engineer", "ai-powered",
  "transformer", "fine-tuning", "large language model", "chatbot",
  "artificial intelligence", "data science", "computer vision",
  "natural language processing", "nlp",
];

const FAKE_FOUNDER_SIGNALS = [
  "founder", "co-founder", "ceo", "cto", "coo",
  "chief", "head of", "director of", "vp of",
];

export function analyzeLinkedInContent(rawInput: string): LinkedInAnalysis {
  const text = rawInput.trim();
  const lowerText = text.toLowerCase();

  // Determine input type
  const isUrl = lowerText.startsWith("http") && lowerText.includes("linkedin.com");
  const profileUrl = isUrl ? text.split("\n")[0].trim() : null;

  // Parse content
  const lines = text.split("\n").filter((l) => l.trim());
  const headline = lines[0] || null;
  const aboutText = lines.length > 1 ? lines.slice(1).join("\n") : null;

  // Extract job titles (lines that look like titles)
  const titlePatterns = /\b(engineer|developer|designer|manager|analyst|consultant|intern|lead|architect|specialist|coordinator|associate|director|vp|cto|ceo|coo|founder)\b/gi;
  const jobTitles: string[] = [];
  for (const line of lines) {
    if (titlePatterns.test(line) && line.length < 100) {
      jobTitles.push(line.trim());
      titlePatterns.lastIndex = 0;
    }
  }

  // Extract skills (common patterns)
  const skillPatterns = /\b(javascript|typescript|python|java|react|angular|vue|node\.?js|express|django|flask|aws|azure|gcp|docker|kubernetes|sql|mongodb|postgres|redis|graphql|rest|api|git|ci\/cd|terraform|figma|photoshop|html|css|sass|tailwind|bootstrap|next\.?js|nuxt|svelte|go|rust|c\+\+|c#|swift|kotlin|flutter|dart|ruby|rails|php|laravel)\b/gi;
  const skillMatches = text.match(skillPatterns) || [];
  const skills = [...new Set(skillMatches.map((s) => s.toLowerCase()))];

  // Count buzzwords
  const buzzwordsFound: string[] = [];
  for (const bw of BUZZWORDS) {
    const regex = new RegExp(`\\b${bw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
    const matches = lowerText.match(regex);
    if (matches) {
      buzzwordsFound.push(...matches.map(() => bw));
    }
  }

  // Count cringe phrases
  const cringePhrasesFound: string[] = [];
  for (const phrase of CRINGE_PHRASES) {
    if (lowerText.includes(phrase)) {
      cringePhrasesFound.push(phrase);
    }
  }

  // Count AI buzzwords
  let overusedAITerms = 0;
  for (const term of AI_BUZZWORDS) {
    const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
    const matches = lowerText.match(regex);
    if (matches) overusedAITerms += matches.length;
  }

  // Count emojis
  const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{200D}\u{20E3}]/gu;
  const emojiCount = (text.match(emojiRegex) || []).length;

  // Count measurable achievements (numbers, percentages, $, metrics)
  const achievementPatterns = /\b\d+[%+]?\b|\$\d+|\d+x|\d+\s*(users|customers|clients|revenue|growth|increase|decrease|reduction|improvement|projects|applications|deployed)/gi;
  const measurableAchievements = (text.match(achievementPatterns) || []).length;

  // Detect "Open to Work"
  const hasOpenToWork = lowerText.includes("open to work") || lowerText.includes("opentowork") || lowerText.includes("#opentowork");

  // Detect fake founder energy
  const hasFakeFounderEnergy = FAKE_FOUNDER_SIGNALS.some((signal) => {
    const regex = new RegExp(`\\b${signal}\\b`, "gi");
    return regex.test(lowerText);
  }) && text.length < 500; // Short profile with big titles

  // Word and sentence stats
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const totalWords = words.length;
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const sentenceCount = sentences.length;
  const avgSentenceLength = sentenceCount > 0 ? Math.round(totalWords / sentenceCount) : 0;

  return {
    inputType: isUrl ? "url" : "paste",
    profileUrl,
    rawInput: text,
    headline,
    aboutText,
    jobTitles,
    skills,
    metrics: {
      totalWords,
      buzzwordCount: buzzwordsFound.length,
      buzzwordsFound: [...new Set(buzzwordsFound)],
      cringePhraseCount: cringePhrasesFound.length,
      cringePhrasesFound,
      emojiCount,
      measurableAchievements,
      jobTitleCount: jobTitles.length,
      hasOpenToWork,
      hasFakeFounderEnergy,
      overusedAITerms,
      sentenceCount,
      avgSentenceLength,
    },
  };
}
