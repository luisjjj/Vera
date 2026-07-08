export type Platform =
  | 'youtube'
  | 'tiktok'
  | 'instagram'
  | 'twitter'
  | 'linkedin'
  | 'blog';

export type ContentType =
  | 'reel'
  | 'story'
  | 'post'
  | 'video'
  | 'carousel'
  | 'thread'
  | 'article';

export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export interface Profile {
  id: string;
  email: string;
  display_name: string;
  niche: string;
  platforms: Platform[];
  tone_of_voice: string;
  goals: string[];
  onboarded: boolean;
  created_at: string;
}

export interface ContentPlan {
  id: string;
  user_id: string;
  title: string;
  week_start: string;
  status: 'draft' | 'active' | 'completed';
  generated_by: 'ai' | 'manual';
  created_at: string;
  items: PlanItem[];
}

export interface PlanItem {
  id: string;
  plan_id: string;
  day: DayOfWeek;
  platform: Platform;
  content_type: ContentType;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  created_at: string;
}

export interface ContentIdea {
  id: string;
  user_id: string;
  platform: Platform;
  content_type: ContentType;
  title: string;
  description: string;
  status: 'idea' | 'saved' | 'used';
  created_at: string;
}
