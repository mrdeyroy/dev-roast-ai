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
    const existingIndex = current.findIndex((r) => r.id === roast.id);
    let updated = [...current];
    if (existingIndex !== -1) {
      // Update existing
      updated[existingIndex] = roast;
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
