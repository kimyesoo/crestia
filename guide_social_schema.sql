-- ==========================================
-- Guide Social Features Schema
-- Run this in Supabase SQL Editor
-- ==========================================

-- Guide Comments Table
CREATE TABLE IF NOT EXISTS public.guide_comments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    guide_id uuid NOT NULL REFERENCES public.guide_posts(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.guide_comments ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Guide comments are viewable by everyone"
    ON public.guide_comments FOR SELECT USING (true);

CREATE POLICY "Users can insert their own guide comments"
    ON public.guide_comments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own guide comments"
    ON public.guide_comments FOR DELETE USING (auth.uid() = user_id);

-- ==========================================
-- Guide Reactions Table (likes + dislikes in one table)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.guide_reactions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    guide_id uuid NOT NULL REFERENCES public.guide_posts(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reaction_type text NOT NULL CHECK (reaction_type IN ('like', 'dislike')),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(guide_id, user_id)  -- One reaction per user per guide
);

-- Enable RLS
ALTER TABLE public.guide_reactions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Guide reactions are viewable by everyone"
    ON public.guide_reactions FOR SELECT USING (true);

CREATE POLICY "Users can insert their own guide reactions"
    ON public.guide_reactions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own guide reactions"
    ON public.guide_reactions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own guide reactions"
    ON public.guide_reactions FOR DELETE USING (auth.uid() = user_id);

-- ==========================================
-- Community Reactions Table (add dislikes support)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.community_reactions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reaction_type text NOT NULL CHECK (reaction_type IN ('like', 'dislike')),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(post_id, user_id)  -- One reaction per user per post
);

-- Enable RLS
ALTER TABLE public.community_reactions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Community reactions are viewable by everyone"
    ON public.community_reactions FOR SELECT USING (true);

CREATE POLICY "Users can insert their own community reactions"
    ON public.community_reactions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own community reactions"
    ON public.community_reactions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own community reactions"
    ON public.community_reactions FOR DELETE USING (auth.uid() = user_id);

-- ==========================================
-- Indexes for Performance
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_guide_comments_guide_id ON public.guide_comments(guide_id);
CREATE INDEX IF NOT EXISTS idx_guide_reactions_guide_id ON public.guide_reactions(guide_id);
CREATE INDEX IF NOT EXISTS idx_community_reactions_post_id ON public.community_reactions(post_id);
