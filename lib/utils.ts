export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getSeverityColor(score: number): string {
  if (score >= 75) return "var(--roast-mild)";
  if (score >= 50) return "var(--roast-medium)";
  if (score >= 25) return "var(--roast-brutal)";
  return "var(--roast-nuclear)";
}

export function getSeverityClass(score: number): string {
  if (score >= 75) return "severity-mild";
  if (score >= 50) return "severity-medium";
  if (score >= 25) return "severity-brutal";
  return "severity-nuclear";
}

export function getSeverityLabel(score: number): string {
  if (score >= 75) return "Mild";
  if (score >= 50) return "Medium";
  if (score >= 25) return "Brutal";
  return "Nuclear";
}

export function getRoastLevel(score: number): string {
  if (score >= 80) return "Barely Singed";
  if (score >= 60) return "Mild Roast";
  if (score >= 40) return "Cooked";
  if (score >= 20) return "Deep Fried";
  return "Beyond Saving";
}

export type RoastMode =
  | "recruiter"
  | "faang"
  | "senior"
  | "startup"
  | "brutal-twitter";

export const ROAST_MODES: { id: RoastMode; label: string; emoji: string; description: string }[] = [
  { id: "recruiter", label: "Recruiter Mode", emoji: "👔", description: "Polite but devastating" },
  { id: "faang", label: "FAANG Interviewer", emoji: "🏢", description: "System design nightmare" },
  { id: "senior", label: "Senior Developer", emoji: "👨‍💻", description: "Clean code purist" },
  { id: "startup", label: "Startup Founder", emoji: "🚀", description: "Ship or die" },
  { id: "brutal-twitter", label: "Brutal Twitter", emoji: "💀", description: "No mercy" },
];

export type ProfileType = "github" | "linkedin" | "portfolio";

// Platform-specific loading messages
export const LOADING_MESSAGES: Record<ProfileType, string[]> = {
  github: [
    "Fetching GitHub profile...",
    "Scanning repositories...",
    "Analyzing commit consistency...",
    "Reading README files...",
    "Detecting tutorial projects...",
    "Checking deployment status...",
    "Computing hireability score...",
    "Sending data to AI roast engine...",
    "Generating emotional damage...",
    "Crafting personalized insults...",
    "Finding something nice to say...",
    "Preparing your destruction...",
    "Finalizing roast...",
  ],
  linkedin: [
    "Parsing your LinkedIn content...",
    "Scanning for corporate buzzwords...",
    "Counting 'passionate' mentions...",
    "Measuring cringe density...",
    "Detecting fake founder energy...",
    "Analyzing recruiter readability...",
    "Checking for measurable achievements...",
    "Evaluating emoji overload...",
    "Sending to AI corporate roast engine...",
    "Generating LinkedIn-grade damage...",
    "Crafting professional insults...",
    "Preparing corporate destruction...",
    "Finalizing career damage...",
  ],
  portfolio: [
    "Fetching your portfolio...",
    "Parsing HTML structure...",
    "Detecting template usage...",
    "Counting CSS animations...",
    "Checking for actual projects...",
    "Analyzing design choices...",
    "Scanning for 'Under Construction' pages...",
    "Measuring glassmorphism levels...",
    "Sending to AI design roast engine...",
    "Generating frontend damage...",
    "Roasting your color palette...",
    "Preparing visual destruction...",
    "Finalizing portfolio roast...",
  ],
};

// Platform display config
export const PLATFORM_CONFIG: Record<ProfileType, {
  label: string;
  emoji: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
}> = {
  github: {
    label: "GitHub Roast",
    emoji: "🔥",
    color: "var(--accent-cyan)",
    badgeBg: "rgba(0, 229, 255, 0.08)",
    badgeBorder: "rgba(0, 229, 255, 0.2)",
  },
  linkedin: {
    label: "LinkedIn Roast",
    emoji: "💼",
    color: "#0A66C2",
    badgeBg: "rgba(10, 102, 194, 0.08)",
    badgeBorder: "rgba(10, 102, 194, 0.2)",
  },
  portfolio: {
    label: "Portfolio Roast",
    emoji: "🌐",
    color: "#A855F7",
    badgeBg: "rgba(168, 85, 247, 0.08)",
    badgeBorder: "rgba(168, 85, 247, 0.2)",
  },
};
