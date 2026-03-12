-- 1. Users Extension (Assuming auth.users exists, creating a public.profiles mapping)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT,
  email TEXT,
  goal TEXT CHECK (goal IN ('muscle_gain', 'fat_loss', 'strength', 'endurance')),
  experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
  equipment TEXT CHECK (equipment IN ('full_gym', 'dumbbells_only', 'home_workout')),
  focus_area TEXT CHECK (focus_area IN ('chest', 'back', 'legs', 'full_body')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Workout History
CREATE TABLE IF NOT EXISTS public.workout_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  workout_id TEXT, -- to group exercises from the same session
  exercise_name TEXT NOT NULL,
  sets INTEGER NOT NULL,
  reps INTEGER NOT NULL,
  weight NUMERIC,
  completed BOOLEAN DEFAULT false,
  date DATE DEFAULT CURRENT_DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.workout_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own workout history" ON public.workout_history FOR ALL USING (auth.uid() = user_id);

-- 3. Body Progress Tracking
CREATE TABLE IF NOT EXISTS public.progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE NOT NULL,
  weight NUMERIC,
  chest NUMERIC,
  waist NUMERIC,
  arms NUMERIC,
  thighs NUMERIC,
  progress_photo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own progress" ON public.progress FOR ALL USING (auth.uid() = user_id);

-- 4. Streak Tracking
CREATE TABLE IF NOT EXISTS public.streaks (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_active_date DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own streaks" ON public.streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own streaks" ON public.streaks FOR UPDATE USING (auth.uid() = user_id);

-- 5. Daily Fitness Score
CREATE TABLE IF NOT EXISTS public.daily_scores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE NOT NULL,
  score INTEGER DEFAULT 0,
  workout_completed BOOLEAN DEFAULT false,
  diet_followed BOOLEAN DEFAULT false,
  water_goal BOOLEAN DEFAULT false,
  steps_goal BOOLEAN DEFAULT false,
  stretching_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, date)
);

ALTER TABLE public.daily_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own daily scores" ON public.daily_scores FOR ALL USING (auth.uid() = user_id);
