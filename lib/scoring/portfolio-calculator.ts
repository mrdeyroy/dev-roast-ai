import type { PortfolioAnalysis, PortfolioScoreBreakdown } from "@/lib/types/roast";

// ============================================
// Portfolio Score Calculator
// ============================================

export function calculatePortfolioScores(analysis: PortfolioAnalysis): PortfolioScoreBreakdown {
  const m = analysis.metrics;

  // Handle fetch failure
  if (!analysis.fetchSuccess) {
    return {
      overallScore: 10,
      originality: 10,
      uxQuality: 10,
      contentDepth: 10,
      projectPresentation: 10,
    };
  }

  // 1. Originality (0-100)
  let originality = 70; // Baseline — assume original until proven otherwise
  if (m.isTemplate) originality -= 30;
  originality -= m.templateSignals.length * 10;
  if (m.hasMissingContent) originality -= 15;
  // Bonus for custom tech
  if (m.cssFrameworks.length === 0 && analysis.technologies.length > 0) {
    originality += 10; // Custom CSS = effort
  }
  // Excessive animations penalty
  if (m.animationLibraries.length > 2) originality -= 10;
  originality = clamp(originality, 0, 100);

  // 2. UX Quality (0-100)
  let uxQuality = 0;
  uxQuality += m.semanticHtmlScore * 0.3;
  if (m.hasResponsiveSignals) uxQuality += 15;
  if (m.hasFavicon) uxQuality += 5;
  if (m.hasOpenGraph) uxQuality += 10;
  if (analysis.title) uxQuality += 5;
  if (analysis.metaDescription) uxQuality += 10;
  // Good heading hierarchy
  if (m.headingCount >= 3 && m.headingCount <= 15) uxQuality += 10;
  // Images present
  if (m.imageCount >= 2) uxQuality += 10;
  // Not too many scripts
  if (m.scriptCount <= 10) uxQuality += 5;
  else if (m.scriptCount > 20) uxQuality -= 10;
  // Penalty for missing content
  if (m.hasMissingContent) uxQuality -= 15;
  uxQuality = clamp(Math.round(uxQuality), 0, 100);

  // 3. Content Depth (0-100)
  let contentDepth = 0;
  // Word count scoring
  if (m.totalWords >= 500) contentDepth += 25;
  else if (m.totalWords >= 200) contentDepth += 15;
  else if (m.totalWords >= 50) contentDepth += 5;
  // Heading count
  contentDepth += Math.min(20, m.headingCount * 3);
  // Image count
  contentDepth += Math.min(15, m.imageCount * 3);
  // Link count
  contentDepth += Math.min(10, m.linkCount);
  // Social links
  contentDepth += Math.min(10, analysis.socialLinks.length * 3);
  // Penalty for lorem ipsum
  if (m.hasMissingContent) contentDepth -= 20;
  contentDepth = clamp(contentDepth, 0, 100);

  // 4. Project Presentation (0-100)
  let projectPresentation = 0;
  // Projects found
  projectPresentation += Math.min(40, m.projectCount * 10);
  // Project names found
  projectPresentation += Math.min(20, m.projectNames.length * 5);
  // Social links (shows connectivity)
  if (analysis.socialLinks.find((s) => s.platform === "GitHub")) {
    projectPresentation += 15;
  }
  // Technologies mentioned
  projectPresentation += Math.min(15, analysis.technologies.length * 5);
  // Penalty for no projects
  if (m.projectCount === 0) projectPresentation = Math.max(5, projectPresentation - 20);
  projectPresentation = clamp(projectPresentation, 0, 100);

  // Overall score
  const overallScore = Math.round(
    originality * 0.2 +
    uxQuality * 0.25 +
    contentDepth * 0.25 +
    projectPresentation * 0.3
  );

  return {
    overallScore: clamp(overallScore, 0, 100),
    originality: clamp(originality, 0, 100),
    uxQuality: clamp(uxQuality, 0, 100),
    contentDepth: clamp(contentDepth, 0, 100),
    projectPresentation: clamp(projectPresentation, 0, 100),
  };
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}
