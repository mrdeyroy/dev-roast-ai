export type PortfolioValidationResult =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "valid"; url: string }
  | { status: "invalid"; error: string };

export function isValidPortfolioUrl(input: string): boolean {
  const trimmed = input.trim();
  if (!trimmed) return false;
  const hasProtocol = trimmed.startsWith("http://") || trimmed.startsWith("https://");
  const hasDot = trimmed.includes(".");
  const hasSpace = trimmed.includes(" ");
  if (hasSpace) return false;
  return hasProtocol || hasDot;
}

export function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export async function validatePortfolioUrl(
  input: string
): Promise<PortfolioValidationResult> {
  if (!isValidPortfolioUrl(input)) {
    return { status: "invalid", error: "Not a valid URL" };
  }
  const url = normalizeUrl(input);
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (res.ok || res.status < 500) {
      return { status: "valid", url };
    }
    return { status: "invalid", error: "Website unreachable" };
  } catch {
    return { status: "invalid", error: "Website unreachable" };
  }
}
