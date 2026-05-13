import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

export interface AnalyticsData {
  totalProfiles: number;
  totalRepositories: number;
  totalGenerated: number;
  recentActivity: Array<{
    username: string;
    timestamp: string;
    type: string;
  }>;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const hasSupabase = supabaseUrl !== "" && supabaseKey !== "";
const supabase = hasSupabase ? createClient(supabaseUrl, supabaseKey) : null;

// ==========================================
// LOCAL FALLBACK DB (For local development without Supabase)
// ==========================================
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "analytics.json");

function initLocalDB() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify(
        { totalProfiles: 0, totalRepositories: 0, totalGenerated: 0, recentActivity: [] },
        null,
        2
      )
    );
  }
}

function getLocalAnalytics(): AnalyticsData {
  try {
    initLocalDB();
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8")) as AnalyticsData;
  } catch {
    return { totalProfiles: 0, totalRepositories: 0, totalGenerated: 0, recentActivity: [] };
  }
}

function recordLocalActivity(username: string, reposCount: number) {
  try {
    initLocalDB();
    const data = getLocalAnalytics();
    data.totalGenerated += 1;
    if (!data.recentActivity.some((a) => a.username.toLowerCase() === username.toLowerCase())) {
      data.totalProfiles += 1;
      data.totalRepositories += reposCount;
    }
    data.recentActivity.unshift({ username, timestamp: new Date().toISOString(), type: "PROFILE README" });
    if (data.recentActivity.length > 10) data.recentActivity = data.recentActivity.slice(0, 10);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Failed to record local activity", error);
  }
}

// ==========================================
// SUPABASE DB (For Vercel Production)
// ==========================================
export async function getAnalytics(): Promise<AnalyticsData> {
  if (!hasSupabase || !supabase) {
    return getLocalAnalytics();
  }

  try {
    // Fetch stats
    const { data: stats } = await supabase.from("roast_stats").select("*").eq("id", 1).single();

    // Fetch recent activity
    const { data: activity } = await supabase
      .from("roast_activity")
      .select("username, type, created_at")
      .order("created_at", { ascending: false })
      .limit(3);

    return {
      totalProfiles: stats?.total_profiles || 0,
      totalRepositories: stats?.total_repos || 0,
      totalGenerated: stats?.total_generated || 0,
      recentActivity: (activity || []).map((a) => ({
        username: a.username,
        type: a.type,
        timestamp: a.created_at,
      })),
    };
  } catch (error) {
    console.error("Failed to fetch from Supabase", error);
    return getLocalAnalytics();
  }
}

export async function recordRoastActivity(username: string, reposCount: number): Promise<void> {
  if (!hasSupabase || !supabase) {
    return recordLocalActivity(username, reposCount);
  }

  try {
    // Insert activity
    await supabase.from("roast_activity").insert({ username, type: "PROFILE README" });

    // Update stats
    const { data: stats } = await supabase.from("roast_stats").select("*").eq("id", 1).single();

    if (stats) {
      // Check if new profile
      const { data: existing } = await supabase.from("roast_activity").select("id").eq("username", username).limit(2);
      const isNewProfile = existing && existing.length === 1;

      await supabase
        .from("roast_stats")
        .update({
          total_generated: stats.total_generated + 1,
          total_profiles: stats.total_profiles + (isNewProfile ? 1 : 0),
          total_repos: stats.total_repos + (isNewProfile ? reposCount : 0),
        })
        .eq("id", 1);
    }
  } catch (error) {
    console.error("Failed to record activity in Supabase", error);
  }
}
