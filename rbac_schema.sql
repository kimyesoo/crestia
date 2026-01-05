-- ==========================================
-- RBAC (Role-Based Access Control) Schema
-- ==========================================

-- 1. User Role Enum 타입 생성
-- ==========================================
DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('admin', 'breeder', 'member');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Profiles 테이블에 role 컬럼 추가
-- ==========================================
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role public.user_role DEFAULT 'member';

-- 기존 사용자들의 role을 member로 설정 (이미 NULL인 경우)
UPDATE public.profiles SET role = 'member' WHERE role IS NULL;

-- 3. Market Posts 테이블 생성 (분양 글)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.market_posts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    author_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    price integer,
    gecko_id uuid REFERENCES public.geckos(id) ON DELETE SET NULL,
    status text DEFAULT 'active' CHECK (status IN ('active', 'reserved', 'sold', 'closed')),
    images text[], -- 이미지 URL 배열
    contact_info text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.market_posts ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for market_posts
-- ==========================================

-- 4.1 SELECT: 모든 사용자가 조회 가능
CREATE POLICY "Market posts are viewable by everyone"
    ON public.market_posts FOR SELECT
    USING (true);

-- 4.2 INSERT: admin 또는 breeder만 가능
CREATE POLICY "Breeders and admins can insert market posts"
    ON public.market_posts FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'breeder')
        )
    );

-- 4.3 UPDATE: 자신의 글만 수정 가능 (admin/breeder만)
CREATE POLICY "Authors can update their own market posts"
    ON public.market_posts FOR UPDATE
    USING (
        author_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'breeder')
        )
    );

-- 4.4 DELETE: 자신의 글만 삭제 가능 (admin은 모든 글 삭제 가능)
CREATE POLICY "Authors can delete their own posts, admins can delete all"
    ON public.market_posts FOR DELETE
    USING (
        author_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- 5. Admin용 슈퍼 정책 (profiles 테이블)
-- ==========================================
-- Admin은 모든 profiles 조회/수정 가능
CREATE POLICY "Admins can do everything on profiles"
    ON public.profiles FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- 6. Market Posts 인덱스
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_market_posts_author_id ON public.market_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_market_posts_status ON public.market_posts(status);
CREATE INDEX IF NOT EXISTS idx_market_posts_created_at ON public.market_posts(created_at DESC);

-- 7. Updated At 트리거 (market_posts)
-- ==========================================
CREATE TRIGGER update_market_posts_updated_at
    BEFORE UPDATE ON public.market_posts
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ==========================================
-- 사용 방법:
-- 1. Supabase Dashboard > SQL Editor에서 이 스크립트 실행
-- 2. 특정 사용자를 admin으로 승격하려면:
--    UPDATE public.profiles SET role = 'admin' WHERE id = 'USER_UUID';
-- ==========================================
