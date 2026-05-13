import * as cheerio from "cheerio";
import type { PortfolioAnalysis } from "@/lib/types/roast";

// ============================================
// Portfolio Website Analyzer
// ============================================

const TEMPLATE_SIGNALS = [
  "starter", "template", "theme by", "theme credit", "built with starter",
  "gatsby-starter", "hugo-theme", "jekyll-theme", "powered by wordpress",
  "developer folio", "developer-portfolio", "portfolio-template",
  "templatemo", "html5up", "w3-", "colorlib",
];

const ANIMATION_LIBRARIES = [
  { name: "AOS", signals: ["aos-init", "data-aos", "aos.css", "aos.js"] },
  { name: "GSAP", signals: ["gsap", "scrolltrigger", "tweenmax"] },
  { name: "Framer Motion", signals: ["framer-motion", "__framer"] },
  { name: "Animate.css", signals: ["animate__", "animate.css", "animated"] },
  { name: "Lottie", signals: ["lottie", "lottie-player"] },
  { name: "Three.js", signals: ["three.js", "threejs", "three.module"] },
  { name: "Particles.js", signals: ["particles.js", "particlesjs", "tsparticles"] },
];

const CSS_FRAMEWORKS = [
  { name: "Tailwind CSS", signals: ["tailwindcss", "tailwind.config", "tw-"] },
  { name: "Bootstrap", signals: ["bootstrap", "btn-primary", "container-fluid", "col-md-", "col-lg-"] },
  { name: "Bulma", signals: ["bulma", "is-primary", "is-dark"] },
  { name: "Material UI", signals: ["mui", "material-ui", "MuiButton"] },
  { name: "Chakra UI", signals: ["chakra-ui", "chakra"] },
];

const TECH_SIGNALS = [
  { name: "React", signals: ["react", "_next", "__next", "react-dom", "reactjs"] },
  { name: "Next.js", signals: ["next.js", "_next", "nextjs"] },
  { name: "Vue", signals: ["vue", "vuejs", "__vue", "nuxt"] },
  { name: "Angular", signals: ["angular", "ng-", "ng-version"] },
  { name: "Svelte", signals: ["svelte", "sveltekit"] },
  { name: "Gatsby", signals: ["gatsby", "gatsby-"] },
  { name: "WordPress", signals: ["wordpress", "wp-content", "wp-includes"] },
  { name: "Wix", signals: ["wix.com", "wixsite", "wix-"] },
  { name: "Squarespace", signals: ["squarespace", "sqsp"] },
  { name: "Webflow", signals: ["webflow", "wf-"] },
];

const MISSING_CONTENT_SIGNALS = [
  "under construction", "coming soon", "work in progress",
  "lorem ipsum", "dolor sit amet", "placeholder",
  "this page is empty", "nothing here yet", "stay tuned",
  "launching soon", "check back later",
];

export async function analyzePortfolio(url: string): Promise<PortfolioAnalysis> {
  // Normalize URL
  let normalizedUrl = url.trim();
  if (!normalizedUrl.startsWith("http")) {
    normalizedUrl = `https://${normalizedUrl}`;
  }

  // Fetch HTML
  let html: string;
  let fetchSuccess = true;
  let fetchError: string | null = null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const res = await fetch(normalizedUrl, {
      headers: {
        "User-Agent": "DevRoastAI/1.0 (Portfolio Analyzer)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: controller.signal,
      redirect: "follow",
    });

    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    html = await res.text();
  } catch (err) {
    fetchSuccess = false;
    fetchError = err instanceof Error ? err.message : "Failed to fetch";
    html = "";
  }

  if (!fetchSuccess || !html) {
    return createEmptyAnalysis(normalizedUrl, fetchError);
  }

  const $ = cheerio.load(html);
  const lowerHtml = html.toLowerCase();

  // Extract basic metadata
  const title = $("title").text().trim() || null;
  const metaDescription = $('meta[name="description"]').attr("content")?.trim() || null;
  const metaKeywordsRaw = $('meta[name="keywords"]').attr("content") || "";
  const metaKeywords = metaKeywordsRaw.split(",").map((k) => k.trim()).filter(Boolean);

  // Detect technologies
  const technologies: string[] = [];
  for (const tech of TECH_SIGNALS) {
    if (tech.signals.some((s) => lowerHtml.includes(s))) {
      technologies.push(tech.name);
    }
  }

  // Detect CSS frameworks
  const cssFrameworks: string[] = [];
  for (const fw of CSS_FRAMEWORKS) {
    if (fw.signals.some((s) => lowerHtml.includes(s))) {
      cssFrameworks.push(fw.name);
    }
  }

  // Detect animations
  const animationLibraries: string[] = [];
  for (const lib of ANIMATION_LIBRARIES) {
    if (lib.signals.some((s) => lowerHtml.includes(s))) {
      animationLibraries.push(lib.name);
    }
  }
  const hasAnimations = animationLibraries.length > 0 ||
    lowerHtml.includes("animation") ||
    lowerHtml.includes("@keyframes") ||
    lowerHtml.includes("transition");

  // Detect template
  const templateSignals: string[] = [];
  for (const signal of TEMPLATE_SIGNALS) {
    if (lowerHtml.includes(signal)) {
      templateSignals.push(signal);
    }
  }
  const isTemplate = templateSignals.length > 0;

  // Detect missing content
  const missingContentSignals: string[] = [];
  for (const signal of MISSING_CONTENT_SIGNALS) {
    if (lowerHtml.includes(signal)) {
      missingContentSignals.push(signal);
    }
  }
  const hasMissingContent = missingContentSignals.length > 0;

  // Count elements
  const headingCount = $("h1, h2, h3, h4, h5, h6").length;
  const imageCount = $("img").length;
  const linkCount = $("a").length;
  const scriptCount = $("script").length;

  // Extract text and count words
  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const totalWords = bodyText.split(/\s+/).filter((w) => w.length > 1).length;

  // Detect projects section
  const projectNames: string[] = [];
  const projectSelectors = [
    ".project", ".projects", "#projects", "[class*='project']",
    ".portfolio", "#portfolio", ".work", "#work", ".case-study",
  ];
  for (const selector of projectSelectors) {
    $(selector).each((_, el) => {
      const heading = $(el).find("h2, h3, h4").first().text().trim();
      if (heading && heading.length < 80) {
        projectNames.push(heading);
      }
    });
  }
  // Also look for project headings
  $("h2, h3").each((_, el) => {
    const text = $(el).text().toLowerCase().trim();
    if (text.includes("project") || text.includes("portfolio") || text.includes("work")) {
      const siblings = $(el).nextAll("h3, h4, .card, article").slice(0, 5);
      siblings.each((_, sib) => {
        const name = $(sib).text().trim().slice(0, 60);
        if (name && !projectNames.includes(name)) {
          projectNames.push(name);
        }
      });
    }
  });
  const projectCount = Math.max(projectNames.length, $(projectSelectors.join(", ")).length);

  // Extract social links
  const socialPatterns: { platform: string; pattern: RegExp }[] = [
    { platform: "GitHub", pattern: /github\.com\/[\w-]+/i },
    { platform: "LinkedIn", pattern: /linkedin\.com\/in\/[\w-]+/i },
    { platform: "Twitter/X", pattern: /(?:twitter|x)\.com\/[\w-]+/i },
    { platform: "Instagram", pattern: /instagram\.com\/[\w-]+/i },
    { platform: "YouTube", pattern: /youtube\.com\/(?:@|channel\/|c\/)[\w-]+/i },
    { platform: "Dribbble", pattern: /dribbble\.com\/[\w-]+/i },
    { platform: "Behance", pattern: /behance\.net\/[\w-]+/i },
    { platform: "Medium", pattern: /medium\.com\/@?[\w-]+/i },
    { platform: "Dev.to", pattern: /dev\.to\/[\w-]+/i },
  ];

  const socialLinks: { platform: string; url: string }[] = [];
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") || "";
    for (const { platform, pattern } of socialPatterns) {
      if (pattern.test(href) && !socialLinks.find((s) => s.platform === platform)) {
        socialLinks.push({ platform, url: href });
      }
    }
  });

  // Responsive signals
  const hasResponsiveSignals = lowerHtml.includes("viewport") ||
    lowerHtml.includes("@media") ||
    lowerHtml.includes("responsive") ||
    cssFrameworks.length > 0;

  // Favicon
  const hasFavicon = !!$('link[rel*="icon"]').length || !!$('link[rel="shortcut icon"]').length;

  // Open Graph
  const hasOpenGraph = !!$('meta[property^="og:"]').length;

  // Semantic HTML score
  let semanticHtmlScore = 0;
  if ($("header").length) semanticHtmlScore += 15;
  if ($("nav").length) semanticHtmlScore += 15;
  if ($("main").length) semanticHtmlScore += 15;
  if ($("footer").length) semanticHtmlScore += 15;
  if ($("section").length) semanticHtmlScore += 10;
  if ($("article").length) semanticHtmlScore += 10;
  if ($("h1").length === 1) semanticHtmlScore += 10; // Single H1
  if ($("h1").length > 1) semanticHtmlScore += 5; // Multiple H1s (not ideal)
  if ($('img[alt]').length >= imageCount * 0.5) semanticHtmlScore += 10; // Alt tags
  semanticHtmlScore = Math.min(100, semanticHtmlScore);

  return {
    url: normalizedUrl,
    fetchSuccess,
    fetchError,
    title,
    metaDescription,
    metaKeywords,
    technologies,
    socialLinks,
    metrics: {
      totalWords,
      headingCount,
      imageCount,
      linkCount,
      projectCount,
      projectNames: projectNames.slice(0, 10),
      hasAnimations,
      animationLibraries,
      isTemplate,
      templateSignals,
      hasMissingContent,
      missingContentSignals,
      hasResponsiveSignals,
      hasFavicon,
      hasOpenGraph,
      scriptCount,
      cssFrameworks,
      semanticHtmlScore,
    },
  };
}

function createEmptyAnalysis(url: string, error: string | null): PortfolioAnalysis {
  return {
    url,
    fetchSuccess: false,
    fetchError: error || "Could not fetch portfolio",
    title: null,
    metaDescription: null,
    metaKeywords: [],
    technologies: [],
    socialLinks: [],
    metrics: {
      totalWords: 0,
      headingCount: 0,
      imageCount: 0,
      linkCount: 0,
      projectCount: 0,
      projectNames: [],
      hasAnimations: false,
      animationLibraries: [],
      isTemplate: false,
      templateSignals: [],
      hasMissingContent: false,
      missingContentSignals: [],
      hasResponsiveSignals: false,
      hasFavicon: false,
      hasOpenGraph: false,
      scriptCount: 0,
      cssFrameworks: [],
      semanticHtmlScore: 0,
    },
  };
}
