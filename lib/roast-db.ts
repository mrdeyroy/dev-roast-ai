import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import type { RoastResult } from "./types/roast";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const hasSupabase = supabaseUrl !== "" && supabaseKey !== "";
const supabase = hasSupabase ? createClient(supabaseUrl, supabaseKey) : null;

const DATA_DIR = path.join(process.cwd(), "data", "roasts");

function initLocalRoastDB() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export async function saveRoast(roast: RoastResult): Promise<void> {
  // Save to Supabase if available
  if (hasSupabase && supabase) {
    try {
      const { error } = await supabase.from("saved_roasts").insert({
        id: roast.id,
        username: roast.username,
        profile_type: roast.profileType,
        score: roast.hireabilityScore,
        data: roast
      });
      if (error) {
        console.error("Supabase insert error:", error.message, error.details);
      }
    } catch (e) {
      console.error("Failed to save to Supabase", e);
    }
  }

  // Always save locally for fallback / dev
  try {
    initLocalRoastDB();
    const filePath = path.join(DATA_DIR, `${roast.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(roast, null, 2));
  } catch (error) {
    console.error("Failed to save roast locally", error);
  }
}

export async function getRoastById(id: string): Promise<RoastResult | null> {
  // Try Supabase first
  if (hasSupabase && supabase) {
    try {
      const { data, error } = await supabase.from("saved_roasts").select("data").eq("id", id).single();
      if (data?.data) {
        return data.data as RoastResult;
      }
    } catch (e) {
      console.error("Failed to fetch from Supabase", e);
    }
  }

  // Fallback to local
  try {
    initLocalRoastDB();
    const filePath = path.join(DATA_DIR, `${id}.json`);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(content) as RoastResult;
    }
  } catch (error) {
    console.error("Failed to get roast locally", error);
  }

  return null;
}
