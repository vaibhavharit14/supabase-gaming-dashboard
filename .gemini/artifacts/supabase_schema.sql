-- 1. PROFILES: Extending Auth.users
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'lapsed')),
  plan TEXT CHECK (plan IN ('monthly', 'yearly')),
  charity_id UUID,
  charity_percentage NUMERIC DEFAULT 10 CHECK (charity_percentage >= 10 AND charity_percentage <= 100),
  total_winnings NUMERIC DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, subscription_status, plan)
  VALUES (
    new.id, 
    new.email, 
    split_part(new.email, '@', 1), 
    'active', 
    'monthly'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. CHARITIES: Directory of causes
CREATE TABLE charities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  website_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. SCORES: Stableford golf scores
CREATE TABLE scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  score INTEGER CHECK (score >= 1 AND score <= 45),
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. DRAWS: Monthly prize pool configurations
CREATE TABLE draws (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  month TEXT NOT NULL,
  year INTEGER NOT NULL,
  status TEXT DEFAULT 'simulated' CHECK (status IN ('simulated', 'published')),
  logic TEXT DEFAULT 'random' CHECK (logic IN ('random', 'algorithmic')),
  jackpot_pool NUMERIC DEFAULT 0,
  payout_4_match NUMERIC DEFAULT 0,
  payout_3_match NUMERIC DEFAULT 0,
  winning_numbers INTEGER[] DEFAULT '{}'::INTEGER[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. WINNERS: Records of prize recipients
CREATE TABLE winners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  draw_id UUID REFERENCES draws ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  match_type INTEGER CHECK (match_type IN (3, 4, 5)),
  prize_amount NUMERIC NOT NULL,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected', 'paid')),
  proof_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. AUTOMATION: ROLLING 5 SCORES TRIGGER
-- This function ensures only the latest 5 scores are kept per user
CREATE OR REPLACE FUNCTION maintain_rolling_5_scores()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM scores
  WHERE user_id = NEW.user_id
  AND id NOT IN (
    SELECT id FROM scores
    WHERE user_id = NEW.user_id
    ORDER BY date DESC, created_at DESC
    LIMIT 5
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_rolling_scores
AFTER INSERT ON scores
FOR EACH ROW
EXECUTE FUNCTION maintain_rolling_5_scores();

-- 7. RLS POLICIES (Simple version for candidate test)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE winners ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only read/edit their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Scores: Users can only see/insert their own scores
CREATE POLICY "Users can view own scores" ON scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scores" ON scores FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Charities/Draws: Readable by everyone
CREATE POLICY "Anyone can view charities" ON charities FOR SELECT USING (true);
CREATE POLICY "Anyone can view draws" ON draws FOR SELECT USING (true);
