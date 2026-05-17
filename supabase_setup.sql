-- Run this script in your Supabase SQL Editor to create the analytics tables

-- 1. Create the activity table
CREATE TABLE IF NOT EXISTS roast_activity (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  username text NOT NULL,
  type text NOT NULL DEFAULT 'PROFILE README',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create the stats table
CREATE TABLE IF NOT EXISTS roast_stats (
  id integer PRIMARY KEY DEFAULT 1,
  total_profiles integer DEFAULT 0,
  total_repos integer DEFAULT 0,
  total_generated integer DEFAULT 0
);

-- 3. Insert the initial starting row for stats
INSERT INTO roast_stats (id, total_profiles, total_repos, total_generated) 
VALUES (1, 0, 0, 0)
ON CONFLICT (id) DO NOTHING;

-- 4. Set up security (Allow anyone to read stats, but only server to write)
-- This assumes you are using the SUPABASE_SERVICE_ROLE_KEY in your API route
ALTER TABLE roast_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE roast_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to activity" ON roast_activity FOR SELECT USING (true);
CREATE POLICY "Allow public read access to stats" ON roast_stats FOR SELECT USING (true);

-- 5. Create saved_roasts table
CREATE TABLE IF NOT EXISTS saved_roasts (
  id text PRIMARY KEY,
  username text NOT NULL,
  profile_type text NOT NULL,
  score integer,
  data jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE saved_roasts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to saved_roasts" ON saved_roasts FOR SELECT USING (true);
