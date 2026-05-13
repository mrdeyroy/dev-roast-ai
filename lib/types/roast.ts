// ============================================
// Shared Types — Dev Roast AI
// ============================================

export interface RoastResult {
  id: string;
  username: string;
  profileType: "github" | "linkedin" | "portfolio";
  profileUrl: string;
  roastMode: string;
  avatar: string;
  createdAt: string;

  // Scores
  hireabilityScore: number;
  placementReadiness: number;
  overallRoastLevel: string;
  archetype: { name: string; emoji: string; description: string };

  // Category roasts (3 per platform, named generically)
  githubRoast: CategoryRoast;
  readmeRoast: CategoryRoast;
  projectRoast: CategoryRoast;

  // Improvements
  improvements: Improvement[];

  // Radar data
  radarData: RadarPoint[];
}

export interface CategoryRoast {
  title: string;
  icon: string;
  severity: "mild" | "medium" | "brutal" | "nuclear";
  score: number;
  roastLines: RoastLine[];
  metrics: { label: string; value: string; trend?: "up" | "down" | "flat" }[];
}

export interface RoastLine {
  type: "insult" | "damage" | "analysis" | "fix" | "positive";
  text: string;
}

export interface Improvement {
  category: string;
  icon: string;
  suggestions: string[];
}

export interface RadarPoint {
  category: string;
  score: number;
  fullMark: 100;
}

// ============================================
// GitHub Analysis Types
// ============================================

export interface GitHubProfile {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  html_url: string;
  blog: string | null;
  twitter_username: string | null;
  hireable: boolean | null;
}

export interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  archived: boolean;
  homepage: string | null;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  has_pages: boolean;
  default_branch: string;
  open_issues_count: number;
}

export interface GitHubAnalysis {
  profile: GitHubProfile;
  repos: GitHubRepo[];
  readmeContent: string | null;

  // Computed metrics
  metrics: {
    totalRepos: number;
    totalStars: number;
    totalForks: number;
    activeRepos: number;
    inactiveRepos: number;
    forkedRepos: number;
    originalRepos: number;
    languages: Record<string, number>;
    topLanguage: string;
    avgRepoAge: number;
    hasProfileReadme: boolean;
    hasWebsite: boolean;
    deployedProjects: number;
    recentCommitActivity: number; // repos with push in last 90 days
    repoWithTopics: number;
    repoWithDescription: number;
    tutorialProjects: string[];
    genericProjects: string[];
    accountAgeDays: number;
  };

  // Per-repo README analysis
  readmeAnalysis: {
    totalWithReadme: number;
    totalWithCustomReadme: number;
    avgReadmeLength: number;
    badgeHeavyRepos: number;
    brokenScreenshots: number;
    buzzwordCount: number;
  };
}

// ============================================
// LinkedIn Analysis Types
// ============================================

export interface LinkedInAnalysis {
  inputType: "url" | "paste";
  profileUrl: string | null;
  rawInput: string;

  // Extracted data
  headline: string | null;
  aboutText: string | null;
  jobTitles: string[];
  skills: string[];

  // Computed metrics
  metrics: {
    totalWords: number;
    buzzwordCount: number;
    buzzwordsFound: string[];
    cringePhraseCount: number;
    cringePhrasesFound: string[];
    emojiCount: number;
    measurableAchievements: number;
    jobTitleCount: number;
    hasOpenToWork: boolean;
    hasFakeFounderEnergy: boolean;
    overusedAITerms: number;
    sentenceCount: number;
    avgSentenceLength: number;
  };
}

// ============================================
// Portfolio Analysis Types
// ============================================

export interface PortfolioAnalysis {
  url: string;
  fetchSuccess: boolean;
  fetchError: string | null;

  // Extracted data
  title: string | null;
  metaDescription: string | null;
  metaKeywords: string[];
  technologies: string[];
  socialLinks: { platform: string; url: string }[];

  // Computed metrics
  metrics: {
    totalWords: number;
    headingCount: number;
    imageCount: number;
    linkCount: number;
    projectCount: number;
    projectNames: string[];
    hasAnimations: boolean;
    animationLibraries: string[];
    isTemplate: boolean;
    templateSignals: string[];
    hasMissingContent: boolean;
    missingContentSignals: string[];
    hasResponsiveSignals: boolean;
    hasFavicon: boolean;
    hasOpenGraph: boolean;
    scriptCount: number;
    cssFrameworks: string[];
    semanticHtmlScore: number; // 0-100
  };
}

// ============================================
// Scoring Types
// ============================================

export interface ScoreBreakdown {
  hireabilityScore: number;
  placementReadiness: number;
  commitConsistency: number;
  readmeQuality: number;
  projectOriginality: number;
  deploymentScore: number;
  profileCompleteness: number;
  stackDepth: number;
}

export interface LinkedInScoreBreakdown {
  overallScore: number;
  buzzwordDensity: number;
  recruiterReadability: number;
  cringeFactor: number;
  achievementClarity: number;
}

export interface PortfolioScoreBreakdown {
  overallScore: number;
  originality: number;
  uxQuality: number;
  contentDepth: number;
  projectPresentation: number;
}

// ============================================
// API Types
// ============================================

export interface RoastRequest {
  username: string; // backward compat for GitHub
  input?: string; // universal input field
  profileType?: "github" | "linkedin" | "portfolio";
  roastMode: string;
  placementMode: boolean;
}

export interface RoastAPIResponse {
  success: boolean;
  data?: RoastResult;
  error?: string;
}
