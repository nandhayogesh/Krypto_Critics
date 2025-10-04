-- Wishlist table for storing user's favorite movies
CREATE TABLE IF NOT EXISTS wishlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  movie_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Ensure one wishlist entry per user per movie
  UNIQUE(user_id, movie_id)
);

-- RLS (Row Level Security) policies for wishlist
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own wishlist items
CREATE POLICY "Users can view own wishlist items" ON wishlist
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can add items to their own wishlist
CREATE POLICY "Users can insert own wishlist items" ON wishlist
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can remove items from their own wishlist
CREATE POLICY "Users can delete own wishlist items" ON wishlist
  FOR DELETE USING (auth.uid() = user_id);

-- Index for better query performance
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_movie_id ON wishlist(movie_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_created_at ON wishlist(created_at);