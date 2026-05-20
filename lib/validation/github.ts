export type GitHubValidationResult =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "valid"; username: string; avatar: string; name: string }
  | { status: "invalid"; error: string };

export function extractGitHubUsername(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const urlMatch = trimmed.match(
    /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9-]+)\/?/
  );
  if (urlMatch) return urlMatch[1];
  if (trimmed.startsWith("@")) return trimmed.slice(1);
  if (/^[a-zA-Z0-9-]+$/.test(trimmed)) return trimmed;
  return null;
}

export async function validateGitHubProfile(
  input: string
): Promise<GitHubValidationResult> {
  const username = extractGitHubUsername(input);
  if (!username) {
    return { status: "invalid", error: "Not a valid GitHub username or URL" };
  }
  if (username.length < 1 || username.length > 39) {
    return { status: "invalid", error: "GitHub username must be 1-39 characters" };
  }
  try {
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      }
    );
    if (res.status === 404) {
      return { status: "invalid", error: "GitHub profile not found" };
    }
    if (res.status === 403) {
      return { status: "invalid", error: "GitHub API rate limit. Try again later." };
    }
    if (!res.ok) {
      return { status: "invalid", error: "Could not verify GitHub profile" };
    }
    const data = await res.json();
    return {
      status: "valid",
      username: data.login,
      avatar: data.avatar_url,
      name: data.name || data.login,
    };
  } catch {
    return { status: "invalid", error: "Network error. Check your connection." };
  }
}
