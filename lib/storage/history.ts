export interface HistoryRoast {
  id: string;
  username: string;
  type: "github" | "linkedin" | "portfolio";
  score: number;
  archetype: string;
  funniestLine: string;
  createdAt: string;
  shareUrl: string;
}

const STORAGE_KEY = "devroast-history";
const MAX_ROASTS = 50;

export function getRoasts(): HistoryRoast[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to parse roast history", e);
    return [];
  }
}

export function saveRoast(roast: HistoryRoast): void {
  if (typeof window === "undefined") return;
  try {
    const current = getRoasts();

    // Deduplicate: check by ID OR by same username + type
    const existingById = current.findIndex((r) => r.id === roast.id);
    const existingByProfile = current.findIndex(
      (r) =>
        r.type === roast.type &&
        r.username.toLowerCase() === roast.username.toLowerCase() &&
        r.id !== roast.id
    );

    let updated = [...current];

    if (existingById !== -1) {
      // Update existing entry by ID
      updated[existingById] = roast;
      // Move to front
      const item = updated.splice(existingById, 1)[0];
      updated.unshift(item);
    } else if (existingByProfile !== -1) {
      // Replace old entry for same profile, move to front
      updated.splice(existingByProfile, 1);
      updated.unshift(roast);
    } else {
      // Add new to front
      updated.unshift(roast);
    }

    // Limit size
    if (updated.length > MAX_ROASTS) {
      updated = updated.slice(0, MAX_ROASTS);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save roast to history", e);
  }
}

export function deleteRoast(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const current = getRoasts();
    const filtered = current.filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error("Failed to delete roast from history", e);
  }
}

export function clearRoasts(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Failed to clear roast history", e);
  }
}
