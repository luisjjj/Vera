-- Vera Database Schema
-- Run this in Supabase SQL Editor

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT NOT NULL DEFAULT '',
  niche TEXT NOT NULL DEFAULT '',
  platforms TEXT[] DEFAULT '{}',
  tone_of_voice TEXT NOT NULL DEFAULT '',
  goals TEXT[] DEFAULT '{}',
  onboarded BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Content plans table
CREATE TABLE IF NOT EXISTS content_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT '',
  week_start DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed')),
  generated_by TEXT NOT NULL DEFAULT 'manual' CHECK (generated_by IN ('ai', 'manual')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Plan items table
CREATE TABLE IF NOT EXISTS plan_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES content_plans(id) ON DELETE CASCADE,
  day TEXT NOT NULL CHECK (day IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
  platform TEXT NOT NULL,
  content_type TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Content ideas table
CREATE TABLE IF NOT EXISTS content_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  content_type TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'idea' CHECK (status IN ('idea', 'saved', 'used')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_content_plans_user_id ON content_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_content_plans_status ON content_plans(user_id, status);
CREATE INDEX IF NOT EXISTS idx_plan_items_plan_id ON plan_items(plan_id);
CREATE INDEX IF NOT EXISTS idx_content_ideas_user_id ON content_ideas(user_id);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_ideas ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Content plans policies
CREATE POLICY "Users can view own plans" ON content_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own plans" ON content_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own plans" ON content_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own plans" ON content_plans FOR DELETE USING (auth.uid() = user_id);

-- Plan items policies (access through parent plan)
CREATE POLICY "Users can view own plan items" ON plan_items
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM content_plans WHERE content_plans.id = plan_items.plan_id AND content_plans.user_id = auth.uid()
  ));
CREATE POLICY "Users can create own plan items" ON plan_items
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM content_plans WHERE content_plans.id = plan_items.plan_id AND content_plans.user_id = auth.uid()
  ));
CREATE POLICY "Users can update own plan items" ON plan_items
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM content_plans WHERE content_plans.id = plan_items.plan_id AND content_plans.user_id = auth.uid()
  ));
CREATE POLICY "Users can delete own plan items" ON plan_items
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM content_plans WHERE content_plans.id = plan_items.plan_id AND content_plans.user_id = auth.uid()
  ));

-- Content ideas policies
CREATE POLICY "Users can view own ideas" ON content_ideas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own ideas" ON content_ideas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ideas" ON content_ideas FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own ideas" ON content_ideas FOR DELETE USING (auth.uid() = user_id);
