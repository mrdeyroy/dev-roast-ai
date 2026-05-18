# 🔥 Dev Roast AI

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=2,12,18&height=220&section=header&text=Dev%20Roast%20AI&fontSize=65&fontColor=fff&animation=twinkling&fontAlignY=38&desc=AI-Powered%20Savage%20Profile%20Reviews&descAlignY=60" width="100%"/>

  <p align="center">
    <strong>Your GitHub called. It needs help.</strong>
    <br />
    Multi-Platform AI Roasts • Gamified Career Feedback • Shareable Cards • Constructive Redemption
  </p>

  <p align="center">
    <a href="https://devroastai.vercel.app"><strong>Try Dev Roast AI »</strong></a>
    <br />
    <br />
    <a href="https://github.com/mrdeyroy/dev-roast-ai/issues">Report Bug</a>
    ·
    <a href="https://github.com/mrdeyroy/dev-roast-ai/issues">Request Feature</a>
  </p>

  <!-- Badges Row -->
  <p align="center">
    <img src="https://img.shields.io/badge/Next.js-16.2.6-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Open%20Source-Yes-4B275F?style=flat-square" alt="Open Source" />
    <img src="https://img.shields.io/badge/PRs-Welcome-2ea44f?style=flat-square" alt="PRs Welcome" />
    <img src="https://img.shields.io/badge/AI--Powered-OpenRouter-7c3aed?style=flat-square" alt="AI Powered" />
    <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="MIT License" />
    <img src="https://img.shields.io/badge/Deployed-Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Deployed on Vercel" />
  </p>
</div>

---

## 🌐 Live Demo

The application is deployed on Vercel with automated GitHub integration, global edge caching, and live Supabase analytics:

👉 **[Try Dev Roast AI (devroastai.vercel.app)](https://devroastai.vercel.app)**

---

## ⚡ How Dev Roast AI Works

Our pipelines are fast, completely secure, and require zero credentials:

```text
Paste Profile Handle / Content
             ↓
   AI Multi-Engine Analysis
             ↓
  Generate Savage Career Roast
             ↓
Dynamic Social Sharing (LinkedIn/X)
```

1. **Paste Profile:** Enter your GitHub username, paste your LinkedIn headline/about section, or input your portfolio URL.
2. **AI Analysis:** Our scoring engines break down your data (buzzwords, activity consistency, templates, originality).
3. **Generate Roast:** Free-tier LLMs race to produce the most devastating, personalized roast.
4. **Share Socially:** Export a custom-styled PNG card or click to share directly on X/Twitter and LinkedIn.

---

## 🌟 Key Features

| Category | Features | Description |
| :--- | :--- | :--- |
| **🧠 AI Multi-Platform Analysis** | GitHub, LinkedIn & Portfolios | Cross-platform scraping-free analysis that extracts metrics, detects templates, and scores structure. |
| **💥 Gamified Career Reviews** | Hireability Score & Archetypes | Savage 1-100 scoring paired with creative custom roles like *Tutorial Warrior* ⚔️ or *README Magician* 🧙‍♂️. |
| **📈 Dynamic Share System** | Custom OG Cards & Feed Share | Dynamically generated visual sharing cards with absolute URLs, radar graphics, and one-click direct socials pre-fills. |
| **🛠️ Constructive Redemption** | Fix Your Disaster suggestions | Every roast concludes with 3 actionable improvements to help turn your profile into a hiring magnet. |
| **⚡ High-End Architecture** | Parallel Race Strategy & Skeletons | OpenRouter free-tier race architecture with aborted timeout fallback logic and zero-latency loading skeletons. |

---

## 🧠 System Architecture

Dev Roast AI is architected with modern, modular pipelines:
1. **Scraping-Free LinkedIn Pipe:** Standardized paste-only analysis box that evaluates buzzword densities, achievements clarity, and cringe factors without scraping barriers.
2. **Portfolio Parser:** Deep HTML scanning structure that inspects semantic HTML layouts, template keywords, and responsiveness markers.
3. **Parallel AI Race Logic:** Queries multiple models simultaneously (`deepseek-chat-v3`, `qwen3-32b`, `gemma-3-27b`) via OpenRouter, resolving the fastest response and falling back to offline heuristic engines if rate limits occur.
4. **State Management & History:** Zustand client store with localized browser history syncing, ensuring zero hydration mismatches.
5. **Storage System:** Serverless Supabase integration for permanent storage and analytics, falling back to local files in development.

---

## 🛠 Tech Stack

### Framework & Styling
* **Framework:** [Next.js 16.2.6 (App Router)](https://nextjs.org/) + React 19
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com) (cinematic dark mode, glassmorphism UI tokens)
* **Animation:** [Framer Motion](https://www.framer.com/motion) (fade-in routes, typing animations, glowing card borders)
* **Icons:** [Lucide React](https://lucide.dev)

### AI & Storage Strategy
* **AI Engine:** [OpenRouter API](https://openrouter.ai/) (Parallel race execution over Qwen, DeepSeek, and Gemma)
* **Database:** [Supabase Client](https://supabase.com/) (Serverless Postgres database storing live roast activity logs)
* **Local Storage:** Zustand sync persistence for offline history retrieval

---

## 🔑 Environment Variables

To run the application in production, set up the following environment variables. Do NOT prefix secret keys with `NEXT_PUBLIC_` to keep them entirely server-side.

```env
# OpenRouter Access (Server-side)
OPENROUTER_API_KEY=your_openrouter_api_key

# GitHub Token to avoid rate limits (Server-side)
GITHUB_TOKEN=your_github_token

# Absolute deployment URL for social meta references (Client/Server)
NEXT_PUBLIC_APP_URL=https://devroastai.vercel.app

# Supabase Storage Credentials (Client/Server)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

---

## 🚀 Deploying on Vercel

1. Push your project to GitHub.
2. Import the project into Vercel.
3. Add the **Environment Variables** in Vercel's project dashboard.
4. Click **Deploy**. Vercel will build and cache the serverless assets, making the app live globally.

---

## 🛣 Roadmap

We are constantly building new ways to incinerate developer egos:
- [ ] **Resume Roast Mode:** Drop a PDF resume and get standard ATS-compliant reviews styled in a savage format.
- [ ] **Screenshot Teardowns:** Paste a screenshot of your portfolio layout or landing page for custom design roasting.
- [ ] **Developer Battles:** Input two handles and compare who has the most employable repository history.
- [ ] **Mock AI Technical Interviews:** Face off against a highly aggressive AI interviewer trained to mock coding mistakes.
- [ ] **Public Leaderboard Profiles:** Share your surviving high scores and rank on a global wall of fame.

---

## ❤️ Open Source

Dev Roast AI is fully open-source and welcoming of all developer contributions!
* Found a bug? Open an **[Issue](https://github.com/mrdeyroy/dev-roast-ai/issues)**.
* Have a savage roast prompt improvement? Edit the prompts in `lib/ai/prompts.ts` and send a **Pull Request**.
* Want to add a new roast metric? See [CONTRIBUTING.md](./CONTRIBUTING.md) to get started.

---

<div align="center">
  <sub>Built with caffeine, AI, and questionable career decisions.</sub>
  <br />
  <sub>Distributed under the MIT License. Copyright © 2026 <a href="https://github.com/mrdeyroy">Shibam Dey Roy</a></sub>
</div>
