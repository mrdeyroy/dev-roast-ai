// ============================================
// Demo Data — kept ONLY for the demo roast page
// ============================================

import type { RoastResult } from "./types/roast";

// Archetype definitions (used by AI generator too)
export const ARCHETYPES = [
  { name: "Tutorial Warrior", emoji: "🗡️", description: "Completes every course, ships nothing original." },
  { name: "Hackathon Sprinter", emoji: "🏃", description: "Ships in 24 hours, abandons in 48." },
  { name: "README Magician", emoji: "🎩", description: "More badges than code. Presentation over substance." },
  { name: "Framework Collector", emoji: "🧩", description: "Knows 12 frameworks, masters none." },
  { name: "Overnight AI Expert", emoji: "🤖", description: "Added 'AI/ML' to bio after one Kaggle notebook." },
  { name: "StackOverflow Survivor", emoji: "🏥", description: "Code works. Nobody knows why. Including you." },
  { name: "Commit Phantom", emoji: "👻", description: "Last seen committing in 2022." },
  { name: "Deploy Denier", emoji: "🚫", description: "47 repos, 0 live URLs." },
];

export const DEMO_ROAST: RoastResult = {
  id: "demo-shibam-2024",
  username: "shibam",
  profileType: "github",
  profileUrl: "https://github.com/mrdeyroy",
  roastMode: "recruiter",
  avatar: "",
  createdAt: "2024-01-01T00:00:00Z",

  hireabilityScore: 42,
  placementReadiness: 61,
  overallRoastLevel: "Medium",
  archetype: {
    name: "Tutorial Warrior",
    emoji: "🗡️",
    description: "Completes every course, ships nothing original.",
  },

  headerText: "42/100 — Recruiters are nervous.",
  roastLines: [
    {
      type: "damage",
      text: "Last meaningful commit happened before ChatGPT existed. You've been busy... doing what exactly?",
    },
    {
      type: "insult",
      text: "Your contribution graph looks like a heart monitor — lots of flatlines with occasional panic spikes.",
    },
    {
      type: "analysis",
      text: "Out of 47 repositories, 38 have zero commits in the last 6 months. That's not a portfolio, that's a digital graveyard.",
    }
  ],
  improvements: [
    { icon: "🚀", text: "Deploy at least ONE of those 47 repos." },
    { icon: "🔥", text: "Delete the tutorial forks. We know you didn't write them." },
    { icon: "💻", text: "Write some actual code instead of collecting badges." }
  ],
  positiveEnding: "At least you have READMEs. Some developers treat documentation like it's optional.",

  radarData: [
    { category: "Hireability", score: 42, fullMark: 100 },
    { category: "Consistency", score: 23, fullMark: 100 },
    { category: "Originality", score: 30, fullMark: 100 },
    { category: "Readme Quality", score: 85, fullMark: 100 },
    { category: "Profile Comp.", score: 90, fullMark: 100 },
    { category: "Stack Depth", score: 55, fullMark: 100 },
  ],

  metricsSummary: {
    stat1: { label: "Total Repositories", value: 47 },
    stat2: { label: "Inactive (6+ months)", value: 38 },
    stat3: { label: "Top Language", value: "JavaScript" },
    stat4: { label: "Stars Earned", value: 12 },
  },
};
