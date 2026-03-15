-- Fix user_stats columns
ALTER TABLE user_stats ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0;
ALTER TABLE user_stats DROP COLUMN IF EXISTS total_xp;
ALTER TABLE user_stats ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0;

-- Fix policies for profile creation
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own stats" ON user_stats;
CREATE POLICY "Users can insert their own stats" 
ON user_stats FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Community posts policies
DROP POLICY IF EXISTS "Authenticated users can insert posts" ON community_posts;
CREATE POLICY "Authenticated users can insert posts"
ON community_posts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Trigger for auto-profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insert into profiles
  INSERT INTO public.profiles (id, name, goal, level)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'name', 'Athlete'), 
    'Muscle Gain', 
    'Intermediate'
  );
  
  -- Insert into user_stats
  INSERT INTO public.user_stats (user_id, xp, current_streak)
  VALUES (new.id, 0, 0);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
