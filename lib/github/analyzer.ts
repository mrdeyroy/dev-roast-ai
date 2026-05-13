import type { GitHubProfile, GitHubRepo, GitHubAnalysis } from "@/lib/types/roast";

const GITHUB_API = "https://api.github.com";
const TUTORIAL_KEYWORDS = [
  "todo", "weather", "calculator", "counter", "clock",
  "tic-tac-toe", "tictactoe", "snake", "quiz", "notes",
  "blog", "chat", "landing-page", "portfolio-template",
  "tutorial", "course", "bootcamp", "practice", "learning",
  "crud", "hello-world", "helloworld", "test", "demo",
  "freeCodeCamp", "freecodecamp", "odin", "project",
];

const GENERIC_KEYWORDS = [
  "clone", "copy", "replica", "template", "starter",
  "boilerplate", "example", "sample", "assignment",
];

const BUZZWORDS = [
  "ai-powered", "machine-learning", "blockchain", "revolutionary",
  "cutting-edge", "next-gen", "scalable", "enterprise-grade",
  "state-of-the-art", "industry-leading", "best-in-class",
];

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "DevRoastAI/1.0",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: getHeaders(), next: { revalidate: 300 } });
  if (!res.ok) {
    if (res.status === 404) throw new Error("PROFILE_NOT_FOUND");
    if (res.status === 403) throw new Error("RATE_LIMITED");
    throw new Error(`GitHub API error: ${res.status}`);
  }
  return res.json();
}

// ============================================
// Main Analyzer
// ============================================

export async function analyzeGitHubProfile(username: string): Promise<GitHubAnalysis> {
  // Fetch profile + repos in parallel
  const [profile, repos] = await Promise.all([
    fetchJSON<GitHubProfile>(`${GITHUB_API}/users/${username}`),
    fetchAllRepos(username),
  ]);

  // Fetch profile README
  const readmeContent = await fetchProfileReadme(username);

  // Analyze README quality across repos (sample top 10 by stars)
  const topRepos = [...repos]
    .filter((r) => !r.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 10);

  const readmeAnalysis = await analyzeReadmes(username, topRepos);

  // Compute metrics
  const now = Date.now();
  const ninetyDaysAgo = now - 90 * 24 * 60 * 60 * 1000;
  const originalRepos = repos.filter((r) => !r.fork);
  const activeRepos = originalRepos.filter(
    (r) => new Date(r.pushed_at).getTime() > ninetyDaysAgo
  );
  const inactiveRepos = originalRepos.filter(
    (r) => new Date(r.pushed_at).getTime() <= ninetyDaysAgo
  );

  // Language breakdown
  const languages: Record<string, number> = {};
  for (const repo of originalRepos) {
    if (repo.language) {
      languages[repo.language] = (languages[repo.language] || 0) + 1;
    }
  }
  const topLanguage =
    Object.entries(languages).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";

  // Detect tutorial / generic projects
  const tutorialProjects = detectTutorialProjects(originalRepos);
  const genericProjects = detectGenericProjects(originalRepos);

  // Detect deployed projects (homepage URL or GitHub Pages)
  const deployedProjects = originalRepos.filter(
    (r) => (r.homepage && r.homepage.trim() !== "") || r.has_pages
  ).length;

  // Account age
  const accountAgeDays = Math.floor(
    (now - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    profile,
    repos: originalRepos,
    readmeContent,
    metrics: {
      totalRepos: repos.length,
      totalStars: repos.reduce((s, r) => s + r.stargazers_count, 0),
      totalForks: repos.reduce((s, r) => s + r.forks_count, 0),
      activeRepos: activeRepos.length,
      inactiveRepos: inactiveRepos.length,
      forkedRepos: repos.filter((r) => r.fork).length,
      originalRepos: originalRepos.length,
      languages,
      topLanguage,
      avgRepoAge:
        originalRepos.length > 0
          ? Math.floor(
              originalRepos.reduce(
                (s, r) =>
                  s +
                  (now - new Date(r.created_at).getTime()) /
                    (1000 * 60 * 60 * 24),
                0
              ) / originalRepos.length
            )
          : 0,
      hasProfileReadme: readmeContent !== null,
      hasWebsite: !!(profile.blog && profile.blog.trim() !== ""),
      deployedProjects,
      recentCommitActivity: activeRepos.length,
      repoWithTopics: originalRepos.filter((r) => r.topics.length > 0).length,
      repoWithDescription: originalRepos.filter(
        (r) => r.description && r.description.trim() !== ""
      ).length,
      tutorialProjects,
      genericProjects,
      accountAgeDays,
    },
    readmeAnalysis,
  };
}

// ============================================
// Helpers
// ============================================

async function fetchAllRepos(username: string): Promise<GitHubRepo[]> {
  const allRepos: GitHubRepo[] = [];
  let page = 1;
  const perPage = 100;

  // Fetch up to 300 repos max (3 pages)
  while (page <= 3) {
    const repos = await fetchJSON<GitHubRepo[]>(
      `${GITHUB_API}/users/${username}/repos?per_page=${perPage}&page=${page}&sort=updated`
    );
    allRepos.push(...repos);
    if (repos.length < perPage) break;
    page++;
  }

  return allRepos;
}

async function fetchProfileReadme(username: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://raw.githubusercontent.com/${username}/${username}/main/README.md`,
      { headers: { "User-Agent": "DevRoastAI/1.0" } }
    );
    if (res.ok) return res.text();
    // Try master branch
    const res2 = await fetch(
      `https://raw.githubusercontent.com/${username}/${username}/master/README.md`,
      { headers: { "User-Agent": "DevRoastAI/1.0" } }
    );
    if (res2.ok) return res2.text();
    return null;
  } catch {
    return null;
  }
}

async function analyzeReadmes(
  username: string,
  repos: GitHubRepo[]
): Promise<GitHubAnalysis["readmeAnalysis"]> {
  let totalWithReadme = 0;
  let totalWithCustomReadme = 0;
  let totalLength = 0;
  let badgeHeavyRepos = 0;
  let buzzwordCount = 0;

  // Sample up to 5 READMEs for performance
  const sampled = repos.slice(0, 5);

  for (const repo of sampled) {
    try {
      const res = await fetch(
        `https://raw.githubusercontent.com/${username}/${repo.name}/${repo.default_branch}/README.md`,
        { headers: { "User-Agent": "DevRoastAI/1.0" } }
      );
      if (!res.ok) continue;
      totalWithReadme++;

      const content = await res.text();
      totalLength += content.length;

      // Check if it's a default template
      const isDefault =
        content.includes("Getting Started with Create React App") ||
        content.includes("This is a [Next.js]") ||
        content.includes("# Welcome to") ||
        content.length < 200;
      if (!isDefault) totalWithCustomReadme++;

      // Count badges
      const badgeCount = (content.match(/!\[.*?\]\(https:\/\/img\.shields\.io/g) || []).length +
        (content.match(/!\[.*?\]\(https:\/\/badges/g) || []).length;
      if (badgeCount > 5) badgeHeavyRepos++;

      // Count buzzwords
      const lower = content.toLowerCase();
      for (const bw of BUZZWORDS) {
        const count = (lower.match(new RegExp(bw, "gi")) || []).length;
        buzzwordCount += count;
      }
    } catch {
      // Skip failed README fetches
    }
  }

  return {
    totalWithReadme,
    totalWithCustomReadme,
    avgReadmeLength:
      totalWithReadme > 0 ? Math.round(totalLength / totalWithReadme) : 0,
    badgeHeavyRepos,
    brokenScreenshots: 0, // Would require HTML rendering to detect
    buzzwordCount,
  };
}

function detectTutorialProjects(repos: GitHubRepo[]): string[] {
  return repos
    .filter((r) => {
      const name = r.name.toLowerCase();
      const desc = (r.description || "").toLowerCase();
      return TUTORIAL_KEYWORDS.some((kw) => name.includes(kw) || desc.includes(kw));
    })
    .map((r) => r.name);
}

function detectGenericProjects(repos: GitHubRepo[]): string[] {
  return repos
    .filter((r) => {
      const name = r.name.toLowerCase();
      const desc = (r.description || "").toLowerCase();
      return GENERIC_KEYWORDS.some((kw) => name.includes(kw) || desc.includes(kw));
    })
    .map((r) => r.name);
}
