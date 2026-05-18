# Contributing to Dev Roast AI 🚀

First off, thank you for considering contributing to **Dev Roast AI**! Your effort helps developers worldwide laugh at their questionable code choices while actually improving their career setups.

This document outlines the guidelines and best practices to ensure a smooth, welcoming, and productive experience for everyone.

---

## 💡 Project Philosophy

We believe career advice shouldn't be boring. Our goal is to craft a **fun, modern, developer-native experience** that delivers sharp, witty roasting combined with high-impact, actionable value.

When contributing, please align with our core values:
* **Constructive Damage:** Roasts must be sharp, hilarious, and technically accurate, but never mean-spirited. The goal is always to guide developers toward improvement.
* **Premium UX/UI:** Everything should feel high-performance, responsive, and visually stunning (glassmorphism, smooth animations, dark-mode-first aesthetic).
* **Ethical Humor:** Focus on coding habits, resume cliché buzzwords, and architectural quirks. Avoid personal attacks or private info.

---

## 🛠️ Ways to Contribute

There are many ways to make an impact on the repository:

1. **🎨 UI/UX Improvements:** Enhance Framer Motion animations, responsive web configurations, or cinematic dark theme tokens.
2. **🔥 Roast Prompt Tuning:** Edit our LLM prompt engineering structures in `lib/ai/prompts.ts` to make the AI output even sharper and more hilarious.
3. **🐛 Bug Fixes & Refactoring:** Stabilize serverless endpoint handlers, resolve Next.js hydration anomalies, or clean up unused components.
4. **⚡ Performance Optimization:** Improve initial loads, image rendering strategies, or parallel model racing speeds.
5. **🔌 New Roast Platforms:** Implement connectors for other platform profiles (e.g. StackOverflow, CodePen, Dribbble).

---

## 🟢 Good First Issues

If you're new to the codebase or Next.js/TypeScript, start here:
* **UI Polish:** Add micro-interactions, subtle borders, or hover glow transitions.
* **Typo Fixes:** Correct grammatical slips in documentation, landing page helper texts, or system logs.
* **Mobile Enhancements:** Fine-tune column distributions on extra small screens.
* **Creative Roasts:** Suggest custom developer archetypes or roast lines inside `lib/ai/prompts.ts`.

---

## 💻 Local Setup & Development

Follow these steps to establish a fully operational development playground:

### 1. Clone & Install
```bash
git clone https://github.com/mrdeyroy/dev-roast-ai.git
cd dev-roast-ai
npm install
```

### 2. Configure Local Environment
Create a `.env.local` file in the root folder and add the following keys. Refer to your Supabase/OpenRouter dashboards:
```env
# OpenRouter API Key for AI generation
OPENROUTER_API_KEY=your_openrouter_api_key

# GitHub Personal Access Token to prevent API throttling
GITHUB_TOKEN=your_github_token

# Local Host URL for dynamic pathing
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase Keys (Optional fallback to local file system)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 4. Troubleshooting Local Builds
* **TypeScript Errors:** Ensure all types are strictly defined. Check files using `npm run build` or the TypeScript compiler directly.
* **API Rate Limits:** If OpenRouter keys run out of quota, check the mock files or implement automatic local mocks for sandbox testing.

---

## 🌿 Git & Branching Conventions

We enforce a clean git hierarchy to streamline code reviews and version history.

### Branch Naming Patterns
Name your branch based on the type of contribution:
* `feature/amazing-feature` — for new pages, tools, or major capabilities.
* `fix/bug-description` — for resolving crashes, typos, or style bugs.
* `docs/update-documentation` — for updates to markdown files or code comments.
* `refactor/clean-components` — for rewriting existing code without changing behavior.

### Commits Style
We follow [Conventional Commits](https://www.conventionalcommits.org/):
```bash
git commit -m "feat: add parallel model race fallbacks to generator"
git commit -m "fix: resolve mobile overflow inside score cards"
```

---

## ✅ Pull Request Checklist

Before submitting a Pull Request, please ensure:
- [ ] **Build Status:** Code compiles locally without errors using `npm run build`.
- [ ] **Linters & Formatters:** Code passes linter checks cleanly via `npm run lint`.
- [ ] **Responsive Design:** Interface has been tested across mobile, tablet, and desktop layouts.
- [ ] **Console Cleanliness:** No debug `console.log` statements remain in the code.
- [ ] **Commit conventions:** Git branch names and commit messages follow the repository guidelines.

---

## 🔒 Security & Privacy Guidelines

We take developer privacy very seriously:
* **No Unnecessary Scraping:** We do not scrape LinkedIn or ask for credentials. All LinkedIn inputs are processed through pasting, preventing account restrictions.
* **Localized History:** By default, user roast history is stored on the client side using Zustand storage, keeping data private unless deliberately saved or shared.
* **Sensitive Keys:** Never expose private environment variables.

---

## 🌟 Contributors

We recognize all contributors who help build a more engaging platform!

<a href="https://github.com/mrdeyroy/dev-roast-ai/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=mrdeyroy/dev-roast-ai" alt="Contributors" />
</a>

Thank you for being part of the **Dev Roast AI** developer community! 🚀
