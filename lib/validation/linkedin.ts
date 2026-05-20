export type LinkedInValidationResult =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "valid"; isUrl: boolean }
  | { status: "invalid"; error: string };

export function isValidLinkedInUrl(input: string): boolean {
  const trimmed = input.trim();
  try {
    const url = trimmed.startsWith("http") ? new URL(trimmed) : new URL(`https://${trimmed}`);
    return url.hostname === "www.linkedin.com" || url.hostname === "linkedin.com";
  } catch {
    return false;
  }
}

export function validateLinkedInInput(input: string): LinkedInValidationResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { status: "idle" };
  }
  if (trimmed.length < 5) {
    return { status: "invalid", error: "Input is too short" };
  }
  const isUrl = trimmed.includes("linkedin.com");
  if (isUrl) {
    if (trimmed.includes("linkedin.com/in/")) {
      return { status: "valid", isUrl: true };
    }
    return { status: "invalid", error: "Not a valid LinkedIn profile URL. Must contain linkedin.com/in/" };
  }
  if (trimmed.length >= 10) {
    return { status: "valid", isUrl: false };
  }
  return { status: "invalid", error: "Paste at least 10 characters of your profile" };
}
