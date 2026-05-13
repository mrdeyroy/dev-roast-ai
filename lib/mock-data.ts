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
  profileUrl: "https://github.com/shibam",
  roastMode: "recruiter",
  avatar: "",
  createdAt: "2024-01-01T00:00:00Z",

  hireabilityScore: 42,
  placementReadiness: 61,
  overallRoastLevel: "Deep Fried",
  archetype: {
    name: "Tutorial Warrior",
    emoji: "🗡️",
    description: "Completes every course, ships nothing original.",
  },

  githubRoast: {
    title: "GitHub Activity",
    icon: "🔥",
    severity: "brutal",
    score: 35,
    roastLines: [
      {
        type: "insult",
        text: "Your contribution graph looks like a heart monitor — lots of flatlines with occasional panic spikes.",
      },
      {
        type: "damage",
        text: "Last meaningful commit happened before ChatGPT existed. You've been busy... doing what exactly?",
      },
      {
        type: "analysis",
        text: "Out of 47 repositories, 38 have zero commits in the last 6 months. That's not a portfolio, that's a digital graveyard.",
      },
      {
        type: "fix",
        text: "Pick your top 3 projects and commit to them daily for 30 days. Delete or archive the rest. Quality over quantity.",
      },
      {
        type: "positive",
        text: "Your commit messages are actually decent when you bother to write them. That's more than most.",
      },
    ],
    metrics: [
      { label: "Commit Consistency", value: "23%", trend: "down" },
      { label: "Active Repos", value: "9/47", trend: "down" },
      { label: "Stars Earned", value: "12", trend: "flat" },
      { label: "Contribution Streak", value: "3 days", trend: "down" },
    ],
  },

  readmeRoast: {
    title: "README Quality",
    icon: "📄",
    severity: "nuclear",
    score: 22,
    roastLines: [
      {
        type: "insult",
        text: "Your README has more badges than actual documentation. It's like a general with medals but no army.",
      },
      {
        type: "damage",
        text: "You wrote 'AI-powered' 17 times across your repos. Even ChatGPT is embarrassed for you.",
      },
      {
        type: "analysis",
        text: "73% of your READMEs are just the default create-react-app template. The ones you did customize have broken screenshots.",
      },
      {
        type: "fix",
        text: "Write a proper README with: Problem Statement → Solution → Demo GIF → Installation → Architecture. No more badge walls.",
      },
      {
        type: "positive",
        text: "At least you have READMEs. Some developers treat documentation like it's optional. (It's not.)",
      },
    ],
    metrics: [
      { label: "Documentation", value: "18%", trend: "down" },
      { label: "Screenshots", value: "2 broken", trend: "down" },
      { label: "Badge Count", value: "47", trend: "up" },
      { label: "Actual Content", value: "Minimal", trend: "flat" },
    ],
  },

  projectRoast: {
    title: "Project Quality",
    icon: "💻",
    severity: "brutal",
    score: 38,
    roastLines: [
      {
        type: "insult",
        text: "Another weather app. Another TODO app. Another e-commerce clone. Revolutionary innovation right there.",
      },
      {
        type: "damage",
        text: "Not a single project is deployed. It's like building houses but never letting anyone live in them.",
      },
      {
        type: "analysis",
        text: "80% of your projects are tutorial follow-alongs. Recruiters can tell. We always can tell.",
      },
      {
        type: "fix",
        text: "Build ONE project that solves a real problem you personally face. Deploy it. Get 10 real users. That's worth more than 50 TODO apps.",
      },
      {
        type: "positive",
        text: "Your tech stack diversity is impressive — React, Vue, Node, Python. Now pick one and go deep instead of being a framework collector.",
      },
    ],
    metrics: [
      { label: "Originality", value: "Low", trend: "down" },
      { label: "Deployed Projects", value: "0/47", trend: "down" },
      { label: "Real Users", value: "0", trend: "flat" },
      { label: "Tech Stack Variety", value: "High", trend: "up" },
    ],
  },

  improvements: [
    {
      category: "GitHub Profile",
      icon: "🔧",
      suggestions: [
        "Archive or delete repos with zero recent activity",
        "Pin your top 6 projects with proper descriptions",
        "Set up a profile README with your tech stack",
        "Aim for a 30-day commit streak",
      ],
    },
    {
      category: "Projects",
      icon: "🚀",
      suggestions: [
        "Build a project that solves a personal problem",
        "Deploy at least 3 projects on Vercel/Netlify",
        "Add demo links and GIFs to every project",
        "Get feedback from actual users",
      ],
    },
    {
      category: "Documentation",
      icon: "📝",
      suggestions: [
        "Write READMEs with Problem → Solution → Demo flow",
        "Fix broken screenshots immediately",
        "Remove excessive badge walls",
        "Add architecture diagrams for complex projects",
      ],
    },
    {
      category: "Career",
      icon: "💼",
      suggestions: [
        "Contribute to 2-3 open source projects",
        "Write technical blog posts about what you learn",
        "Build in public — share your progress on Twitter/LinkedIn",
        "Focus on depth over breadth in your tech stack",
      ],
    },
  ],

  radarData: [
    { category: "Commits", score: 35, fullMark: 100 },
    { category: "Projects", score: 38, fullMark: 100 },
    { category: "READMEs", score: 22, fullMark: 100 },
    { category: "Originality", score: 30, fullMark: 100 },
    { category: "Deployment", score: 10, fullMark: 100 },
    { category: "Stack Depth", score: 55, fullMark: 100 },
  ],
};
