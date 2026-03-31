-- Migration: Add extra profile columns for onboarding data
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS sport_type TEXT,
  ADD COLUMN IF NOT EXISTS workout_days INTEGER,
  ADD COLUMN IF NOT EXISTS session_duration TEXT,
  ADD COLUMN IF NOT EXISTS diet_preference TEXT,
  ADD COLUMN IF NOT EXISTS calorie_target INTEGER;
