import { Metadata, ResolvingMetadata } from "next";
import { getRoastById } from "@/lib/roast-db";
import { DEMO_ROAST } from "@/lib/mock-data";
import RoastResultClient from "./RoastResultClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  
  // Try to fetch real roast, otherwise fallback to demo
  let roast = await getRoastById(id);
  if (!roast && id === "demo-shibam-2024") {
    roast = DEMO_ROAST as any;
  }

  if (!roast) {
    return {
      title: "Roast Not Found | Dev Roast AI",
    };
  }

  const title = `${roast.username} got roasted with a ${roast.hireabilityScore}/100 hireability score 💀 | Dev Roast AI`;
  const description = `${roast.archetype?.emoji || "🕵️"} ${roast.archetype?.name || "Mystery Dev"} — "${roast.headerText || "Recruiters are nervous."}"`;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://devroastai.vercel.app";
  const url = `${appUrl}/roast/${roast.id}`;
  const ogImageUrl = `${appUrl}/api/og/${roast.id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function RoastResultPage({ params }: Props) {
  const { id } = await params;
  
  // Try to fetch from DB
  let roast = await getRoastById(id);
  const isDemo = id === "demo-shibam-2024";
  
  // We will pass the DB roast if found, otherwise null
  // The client will handle fallback to its Zustand store if DB misses 
  // (which happens if they just generated it and we are using local JSON in Vercel which might reset, though Zustand has it)

  return <RoastResultClient dbRoast={roast} isDemo={isDemo} requestedId={id} />;
}
