import type { GitHubAnalysis, ScoreBreakdown } from "@/lib/types/roast";

// ============================================
// Dynamic Score Calculator
// ============================================

export function calculateScores(analysis: GitHubAnalysis): ScoreBreakdown {
  const m = analysis.metrics;
  const r = analysis.readmeAnalysis;

  // 1. Commit Consistency (0-100)
  const activeRatio = m.originalRepos > 0 ? m.activeRepos / m.originalRepos : 0;
  const commitConsistency = Math.round(
    Math.min(100, activeRatio * 100 * 1.2) // Slight boost
  );

  // 2. README Quality (0-100)
  let readmeQuality = 0;
  if (r.totalWithReadme > 0) {
    const customRatio = r.totalWithCustomReadme / Math.max(r.totalWithReadme, 1);
    const lengthScore = Math.min(40, (r.avgReadmeLength / 2000) * 40);
    const noExcessBadges = r.badgeHeavyRepos === 0 ? 15 : Math.max(0, 15 - r.badgeHeavyRepos * 5);
    const buzzPenalty = Math.min(15, r.buzzwordCount * 2);
    readmeQuality = Math.round(
      Math.min(100, customRatio * 40 + lengthScore + noExcessBadges + 10 - buzzPenalty)
    );
  }
  if (m.hasProfileReadme) readmeQuality = Math.min(100, readmeQuality + 15);

  // 3. Project Originality (0-100)
  const tutorialRatio =
    m.originalRepos > 0 ? m.tutorialProjects.length / m.originalRepos : 0;
  const genericRatio =
    m.originalRepos > 0 ? m.genericProjects.length / m.originalRepos : 0;
  const projectOriginality = Math.round(
    Math.max(0, Math.min(100, (1 - tutorialRatio * 0.6 - genericRatio * 0.4) * 100))
  );

  // 4. Deployment Score (0-100)
  const deployRatio =
    m.originalRepos > 0 ? m.deployedProjects / m.originalRepos : 0;
  const deploymentScore = Math.round(Math.min(100, deployRatio * 100 * 2)); // Double weight — deploying matters

  // 5. Profile Completeness (0-100)
  let profileCompleteness = 0;
  const p = analysis.profile;
  if (p.name) profileCompleteness += 15;
  if (p.bio) profileCompleteness += 15;
  if (p.blog) profileCompleteness += 10;
  if (p.twitter_username) profileCompleteness += 5;
  if (p.hireable !== null) profileCompleteness += 5;
  if (m.hasProfileReadme) profileCompleteness += 20;
  if (m.repoWithDescription > m.originalRepos * 0.5) profileCompleteness += 15;
  if (m.repoWithTopics > m.originalRepos * 0.3) profileCompleteness += 15;
  profileCompleteness = Math.min(100, profileCompleteness);

  // 6. Stack Depth (0-100)
  const languageCount = Object.keys(m.languages).length;
  // Sweet spot: 2-4 languages = deep, 1 = too narrow, 5+ = collector
  let stackDepth: number;
  if (languageCount === 0) stackDepth = 0;
  else if (languageCount <= 2) stackDepth = 40 + languageCount * 15;
  else if (languageCount <= 4) stackDepth = 70 + (languageCount - 2) * 10;
  else stackDepth = Math.max(30, 90 - (languageCount - 4) * 10); // Penalty for too many
  stackDepth = Math.min(100, Math.max(0, stackDepth));

  // Add bonus for actual stars (people care about your work)
  const starBonus = Math.min(20, m.totalStars * 2);
  stackDepth = Math.min(100, stackDepth + starBonus);

  // 7. Hireability Score (weighted average)
  const hireabilityScore = Math.round(
    commitConsistency * 0.2 +
      readmeQuality * 0.15 +
      projectOriginality * 0.2 +
      deploymentScore * 0.15 +
      profileCompleteness * 0.15 +
      stackDepth * 0.15
  );

  // 8. Placement Readiness (different weights — students care more about projects + deployment)
  const placementReadiness = Math.round(
    commitConsistency * 0.15 +
      readmeQuality * 0.15 +
      projectOriginality * 0.25 +
      deploymentScore * 0.25 +
      profileCompleteness * 0.1 +
      stackDepth * 0.1
  );

  return {
    hireabilityScore: clamp(hireabilityScore, 0, 100),
    placementReadiness: clamp(placementReadiness, 0, 100),
    commitConsistency: clamp(commitConsistency, 0, 100),
    readmeQuality: clamp(readmeQuality, 0, 100),
    projectOriginality: clamp(projectOriginality, 0, 100),
    deploymentScore: clamp(deploymentScore, 0, 100),
    profileCompleteness: clamp(profileCompleteness, 0, 100),
    stackDepth: clamp(stackDepth, 0, 100),
  };
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function getSeverityFromScore(
  score: number
): "mild" | "medium" | "brutal" | "nuclear" {
  if (score >= 75) return "mild";
  if (score >= 50) return "medium";
  if (score >= 25) return "brutal";
  return "nuclear";
}
