import type { ProfileType } from "@/lib/utils";
import type { RoastResult } from "@/lib/types/roast";

export interface CachedRoast {
  roastId: string;
  username: string;
  profileType: ProfileType;
  roastResult: RoastResult;
  generatedAt: string;
}

const CACHE_KEY = "devroast-cache";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

type CacheStore = Record<string, CachedRoast>;

function getCache(): CacheStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeCache(store: CacheStore): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(store));
  } catch (e) {
    console.error("Failed to write roast cache", e);
  }
}

function buildKey(profileType: ProfileType, identifier: string): string {
  return `${profileType}:${identifier.toLowerCase().trim()}`;
}

export function getCachedRoastForProfile(
  profileType: ProfileType,
  identifier: string
): CachedRoast | null {
  const store = getCache();
  const key = buildKey(profileType, identifier);
  const entry = store[key];
  if (!entry) return null;
  const age = Date.now() - new Date(entry.generatedAt).getTime();
  if (age > CACHE_TTL_MS) {
    const rest: CacheStore = {};
    for (const k in store) {
      if (k !== key) rest[k] = store[k];
    }
    writeCache(rest);
    return null;
  }
  return entry;
}

export function hasCachedRoast(
  profileType: ProfileType,
  identifier: string
): boolean {
  return getCachedRoastForProfile(profileType, identifier) !== null;
}

export function saveCachedRoast(
  profileType: ProfileType,
  identifier: string,
  roast: CachedRoast
): void {
  const store = getCache();
  const key = buildKey(profileType, identifier);
  store[key] = roast;
  writeCache(store);
}

export function updateCachedRoast(
  profileType: ProfileType,
  identifier: string,
  updates: Partial<CachedRoast>
): void {
  const store = getCache();
  const key = buildKey(profileType, identifier);
  if (store[key]) {
    store[key] = { ...store[key], ...updates };
    writeCache(store);
  }
}

export function clearExpiredCachedRoasts(): number {
  const store = getCache();
  const now = Date.now();
  let cleared = 0;
  for (const key in store) {
    const age = now - new Date(store[key].generatedAt).getTime();
    if (age > CACHE_TTL_MS) {
      delete store[key];
      cleared++;
    }
  }
  writeCache(store);
  return cleared;
}

export function clearAllCachedRoasts(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (e) {
    console.error("Failed to clear roast cache", e);
  }
}
