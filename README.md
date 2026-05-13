# 🔥 Dev Roast AI

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=2,12,18&height=220&section=header&text=Dev%20Roast%20AI&fontSize=65&fontColor=fff&animation=twinkling&fontAlignY=38&desc=AI-Powered%20Savage%20Profile%20Reviews&descAlignY=60" width="100%"/>

  <p align="center">
    <strong>Your GitHub called. It needs help.</strong>
    <br />
    Multi-Platform AI Roasts • Gamified Career Feedback • Shareable Cards • Constructive Redemption
  </p>

  <p align="center">
    <a href="https://github.com/mrdeyroy/dev-roast-ai"><strong>Explore the App »</strong></a>
    <br />
    <br />
    <a href="https://github.com/mrdeyroy/dev-roast-ai/issues">Report Bug</a>
    ·
    <a href="https://github.com/mrdeyroy/dev-roast-ai/issues">Request Feature</a>
  </p>
</div>

---

## 🌟 Features

- **Multi-Platform Roasting** — Drop your GitHub username, LinkedIn URL, Portfolio link, or upload your Resume for a personalized teardown.
- **AI Career Archetypes** — Get labeled as a "Tutorial Warrior", "Hackathon Sprinter", or "README Magician" by our AI.
- **Hireability Score** — A brutal but honest 1-100 score indicating how nervous recruiters are looking at your profile.
- **Dynamic Social Sharing** — One-click generation of meme-worthy, beautiful cards tailored for X (Twitter), LinkedIn, and Instagram.
- **Constructive Redemption** — Every roast ends with actual, actionable advice on how to fix your profile and become employable.
- **Global Leaderboard** — See who survived the roast and who got absolutely cooked by the AI.

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 14/15](https://nextjs.org/) + React |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com/) |
| **Animation** | [Framer Motion](https://www.framer.com/motion) |
| **AI Engine** | [OpenRouter](https://openrouter.ai/) (DeepSeek / Qwen) |
| **Database** | [Supabase](https://supabase.com/) |
| **Icons** | [Lucide](https://lucide.dev) |

## 📁 Project Structure

```text
dev-roast-ai/
├── app/               # Next.js App Router (Pages, API Routes, Layouts)
├── components/        # Reusable UI, Roast Cards, and Landing Page components
├── lib/               # AI prompts, Platform Analyzers, and Utilities
├── public/            # Static assets
├── data/              # Mock data & Analytics
└── DESIGN.md          # Core UI/UX design and product specifications
```

## 🚀 Getting Started

### Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/mrdeyroy/dev-roast-ai.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env.local` file and add your OpenRouter and Supabase keys.
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENROUTER_API_KEY=your_openrouter_api_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## 🤝 Contributing

We love contributions! Whether you want to add a new roast category or fix a bug, here's how to do it:
1. Fork the project.
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request!

Check out [CONTRIBUTING.md](./CONTRIBUTING.md) for more details.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/mrdeyroy">Shibam Dey Roy</a></sub>
</div>
