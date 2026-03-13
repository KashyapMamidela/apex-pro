-- User stats (XP, level, coins)
CREATE TABLE IF NOT EXISTS public.user_stats (
  user_id UUID REFERENCES public.profiles(id) PRIMARY KEY,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  level_label TEXT DEFAULT 'BEGINNER',
  total_workouts INTEGER DEFAULT 0,
  total_calories_burned INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- AI generated plans (cached)
CREATE TABLE IF NOT EXISTS public.ai_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  plan_type TEXT CHECK (plan_type IN ('workout', 'diet')),
  workout_type TEXT CHECK (workout_type IN ('gym', 'home', 'mobility', NULL)),
  plan_json JSONB NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT now() + INTERVAL '7 days',
  is_active BOOLEAN DEFAULT true
);

-- Daily workout logs
CREATE TABLE IF NOT EXISTS public.workout_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  plan_id UUID REFERENCES public.ai_plans(id),
  date DATE DEFAULT CURRENT_DATE,
  workout_type TEXT,
  exercises_completed JSONB,
  duration_minutes INTEGER,
  xp_earned INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Daily nutrition logs
CREATE TABLE IF NOT EXISTS public.nutrition_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  date DATE DEFAULT CURRENT_DATE,
  meals JSONB,
  water_ml INTEGER DEFAULT 0,
  total_calories INTEGER DEFAULT 0,
  total_protein DECIMAL,
  total_carbs DECIMAL,
  total_fat DECIMAL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Community posts
CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  content TEXT,
  photo_url TEXT,
  post_type TEXT CHECK (post_type IN ('workout', 'streak', 'progress', 'general')),
  workout_tag TEXT,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Post likes
CREATE TABLE IF NOT EXISTS public.post_likes (
  user_id UUID REFERENCES public.profiles(id),
  post_id UUID REFERENCES public.community_posts(id),
  PRIMARY KEY (user_id, post_id)
);

-- Friend requests / relationships
CREATE TABLE IF NOT EXISTS public.friendships (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  requester_id UUID REFERENCES public.profiles(id),
  receiver_id UUID REFERENCES public.profiles(id),
  status TEXT CHECK (status IN ('pending', 'accepted', 'declined')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (requester_id, receiver_id)
);

-- Stories (ephemeral 24hr)
CREATE TABLE IF NOT EXISTS public.stories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  photo_url TEXT NOT NULL,
  caption TEXT,
  story_type TEXT,
  expires_at TIMESTAMPTZ DEFAULT now() + INTERVAL '24 hours',
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add new columns to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS instagram_handle TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS body_type TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS height DECIMAL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS weight DECIMAL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS age INTEGER;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_profile_complete BOOLEAN DEFAULT false;

-- Enable RLS on all new tables
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Own stats" ON public.user_stats FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Own plans" ON public.ai_plans FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Own workout logs" ON public.workout_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Own nutrition logs" ON public.nutrition_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Community posts visible to all" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "Own posts CRUD" ON public.community_posts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Own likes" ON public.post_likes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Friendships visible to participants" ON public.friendships FOR ALL USING (auth.uid() = requester_id OR auth.uid() = receiver_id);
CREATE POLICY "Stories visible to all" ON public.stories FOR SELECT USING (expires_at > now());
CREATE POLICY "Own stories" ON public.stories FOR ALL USING (auth.uid() = user_id);
