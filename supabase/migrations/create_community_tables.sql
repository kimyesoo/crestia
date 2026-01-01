-- ============================================
-- COMMUNITY TABLES MIGRATION FOR CRESTIA
-- Run this SQL in your Supabase SQL Editor
-- This script is safe to run multiple times
-- ============================================

-- 1. Create community_posts table
CREATE TABLE IF NOT EXISTS community_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'board',
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Create community_comments table
CREATE TABLE IF NOT EXISTS community_comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. Create community_likes table
CREATE TABLE IF NOT EXISTS community_likes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(post_id, user_id)
);

-- 4. Create guide_posts table (for beginner/tips guides)
CREATE TABLE IF NOT EXISTS guide_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'beginner', -- 'beginner' or 'tips'
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    view_count INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE guide_posts ENABLE ROW LEVEL SECURITY;

-- 6. Drop & Recreate RLS Policies for community_posts
DROP POLICY IF EXISTS "Anyone can view posts" ON community_posts;
DROP POLICY IF EXISTS "Authenticated users can create posts" ON community_posts;
DROP POLICY IF EXISTS "Users can update own posts" ON community_posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON community_posts;

CREATE POLICY "Anyone can view posts" ON community_posts
    FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON community_posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON community_posts
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON community_posts
    FOR DELETE USING (auth.uid() = user_id);

-- 7. Drop & Recreate RLS Policies for community_comments
DROP POLICY IF EXISTS "Anyone can view comments" ON community_comments;
DROP POLICY IF EXISTS "Authenticated users can create comments" ON community_comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON community_comments;

CREATE POLICY "Anyone can view comments" ON community_comments
    FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create comments" ON community_comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON community_comments
    FOR DELETE USING (auth.uid() = user_id);

-- 8. Drop & Recreate RLS Policies for community_likes
DROP POLICY IF EXISTS "Anyone can view likes" ON community_likes;
DROP POLICY IF EXISTS "Authenticated users can like" ON community_likes;
DROP POLICY IF EXISTS "Users can unlike" ON community_likes;

CREATE POLICY "Anyone can view likes" ON community_likes
    FOR SELECT USING (true);
CREATE POLICY "Authenticated users can like" ON community_likes
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike" ON community_likes
    FOR DELETE USING (auth.uid() = user_id);

-- 9. Drop & Recreate RLS Policies for guide_posts
DROP POLICY IF EXISTS "Anyone can view guides" ON guide_posts;
DROP POLICY IF EXISTS "Authenticated users can create guides" ON guide_posts;
DROP POLICY IF EXISTS "Users can update own guides" ON guide_posts;
DROP POLICY IF EXISTS "Users can delete own guides" ON guide_posts;

CREATE POLICY "Anyone can view guides" ON guide_posts
    FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create guides" ON guide_posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own guides" ON guide_posts
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own guides" ON guide_posts
    FOR DELETE USING (auth.uid() = user_id);

-- 10. Create indexes (IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_category ON community_posts(category);
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_post_id ON community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_community_likes_post_id ON community_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_guide_posts_category ON guide_posts(category);

-- 11. Function to increment community post view count
CREATE OR REPLACE FUNCTION increment_view_count(post_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE community_posts SET view_count = view_count + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION increment_view_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_view_count(UUID) TO anon;

-- 12. Function to increment guide view count
CREATE OR REPLACE FUNCTION increment_guide_view_count(guide_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE guide_posts SET view_count = view_count + 1 WHERE id = guide_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION increment_guide_view_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_guide_view_count(UUID) TO anon;

-- ============================================
-- DONE! Your community tables are ready.
-- ============================================
