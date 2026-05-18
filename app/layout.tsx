import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://devroastai.vercel.app";

export const metadata: Metadata = {
  title: "Dev Roast AI",
  description:
    "AI-powered developer roasting. Paste your GitHub, LinkedIn, or portfolio and get roasted like a real recruiter would. Fun, savage, and actually useful career feedback.",
  keywords: [
    "developer roast",
    "github review",
    "AI code review",
    "portfolio review",
    "resume roast",
    "hireability score",
    "developer feedback",
  ],
  metadataBase: new URL(appUrl),
  openGraph: {
    title: "Dev Roast AI",
    description:
      "Paste your GitHub and get roasted by AI. Funny, savage, and useful.",
    type: "website",
    siteName: "Dev Roast AI",
    images: [{ url: "/og/roast-image.png", width: 1200, height: 630, alt: "Dev Roast AI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dev Roast AI",
    description:
      "AI just reviewed your developer career. It's not looking great.",
    images: ["/og/roast-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen" suppressHydrationWarning>
        {/* Cinematic background system */}
        <div className="mesh-gradient-bg" aria-hidden="true" />
        <div className="mesh-gradient-extra" aria-hidden="true" />
        <div className="bg-grid-overlay" aria-hidden="true" />
        <div className="bg-noise-overlay" aria-hidden="true" />
        <div className="bg-vignette" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
