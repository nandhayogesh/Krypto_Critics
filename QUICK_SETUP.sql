-- 🚀 Run this SQL in your Supabase SQL Editor
-- Go to: https://qrwaabpwnzhixhkmdwqu.supabase.co (your dashboard)
-- Navigate to: SQL Editor > New Query
-- Copy and paste this entire script, then click "Run"

-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM public;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM anon;

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table  
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    movie_id TEXT NOT NULL,
    movie_title TEXT NOT NULL,
    movie_poster TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    review_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, movie_id)
);

-- Create watchlist table
CREATE TABLE IF NOT EXISTS watchlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    movie_id TEXT NOT NULL,
    movie_title TEXT NOT NULL,
    movie_poster TEXT,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, movie_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for reviews
CREATE POLICY "Anyone can view reviews" ON reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own reviews" ON reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON reviews
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON reviews
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for watchlist
CREATE POLICY "Users can view their own watchlist" ON watchlist
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert to their own watchlist" ON watchlist
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own watchlist" ON watchlist
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, first_name, last_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user profiles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_movie_id ON reviews(movie_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_user_id ON watchlist(user_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_movie_id ON watchlist(movie_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Success message
SELECT 'Database setup completed successfully! 🎉' as status;