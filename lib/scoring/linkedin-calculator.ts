import type { LinkedInAnalysis, LinkedInScoreBreakdown } from "@/lib/types/roast";

// ============================================
// LinkedIn Score Calculator
// ============================================

export function calculateLinkedInScores(analysis: LinkedInAnalysis): LinkedInScoreBreakdown {
  const m = analysis.metrics;

  // 1. Buzzword Density (0-100, higher = better, meaning fewer buzzwords)
  const buzzwordRatio = m.totalWords > 0 ? m.buzzwordCount / m.totalWords : 0;
  const buzzwordDensity = Math.round(
    Math.max(0, Math.min(100, (1 - buzzwordRatio * 10) * 100))
  );

  // 2. Recruiter Readability (0-100)
  let recruiterReadability = 50; // Baseline
  // Good sentence length (10-20 words)
  if (m.avgSentenceLength >= 10 && m.avgSentenceLength <= 20) recruiterReadability += 15;
  else if (m.avgSentenceLength > 30) recruiterReadability -= 10;
  // Has measurable achievements
  recruiterReadability += Math.min(25, m.measurableAchievements * 8);
  // Penalty for too many emojis
  recruiterReadability -= Math.min(15, m.emojiCount * 3);
  // Has skills listed
  if (analysis.skills.length >= 3) recruiterReadability += 10;
  // Has job titles
  if (m.jobTitleCount >= 1) recruiterReadability += 5;
  // Penalty for very short content
  if (m.totalWords < 20) recruiterReadability -= 20;
  recruiterReadability = clamp(recruiterReadability, 0, 100);

  // 3. Cringe Factor (0-100, higher = better, meaning less cringe)
  let cringeFactor = 100;
  cringeFactor -= m.cringePhraseCount * 15;
  cringeFactor -= m.emojiCount > 5 ? 10 : 0;
  cringeFactor -= m.hasOpenToWork ? 5 : 0;
  cringeFactor -= m.hasFakeFounderEnergy ? 15 : 0;
  cringeFactor -= Math.min(20, m.overusedAITerms * 4);
  cringeFactor = clamp(cringeFactor, 0, 100);

  // 4. Achievement Clarity (0-100)
  let achievementClarity = 10; // Low baseline
  achievementClarity += Math.min(50, m.measurableAchievements * 12);
  // Bonus for actual numbers in content
  const hasNumbers = m.measurableAchievements > 0;
  if (hasNumbers) achievementClarity += 15;
  // Penalty for all buzzwords and no numbers
  if (m.buzzwordCount > 3 && m.measurableAchievements === 0) {
    achievementClarity -= 20;
  }
  // Bonus for having skills
  if (analysis.skills.length >= 3) achievementClarity += 10;
  achievementClarity = clamp(achievementClarity, 0, 100);

  // Overall score (weighted average)
  const overallScore = Math.round(
    buzzwordDensity * 0.2 +
    recruiterReadability * 0.3 +
    cringeFactor * 0.25 +
    achievementClarity * 0.25
  );

  return {
    overallScore: clamp(overallScore, 0, 100),
    buzzwordDensity: clamp(buzzwordDensity, 0, 100),
    recruiterReadability: clamp(recruiterReadability, 0, 100),
    cringeFactor: clamp(cringeFactor, 0, 100),
    achievementClarity: clamp(achievementClarity, 0, 100),
  };
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}
