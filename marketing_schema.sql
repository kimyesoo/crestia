-- ==========================================
-- Marketing Consent Schema
-- ==========================================

-- 1. private_infos 테이블이 없으면 생성
-- ==========================================
CREATE TABLE IF NOT EXISTS public.private_infos (
    id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    phone text,
    real_name text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.private_infos ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own private info"
    ON public.private_infos FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own private info"
    ON public.private_infos FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own private info"
    ON public.private_infos FOR UPDATE
    USING (auth.uid() = id);

-- 2. 마케팅 동의 컬럼 추가
-- ==========================================
ALTER TABLE public.private_infos 
ADD COLUMN IF NOT EXISTS is_marketing_agreed boolean DEFAULT false;

ALTER TABLE public.private_infos 
ADD COLUMN IF NOT EXISTS marketing_agreed_at timestamp with time zone;

-- 3. 마케팅 동의 히스토리 테이블 (법적 요구사항)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.marketing_consent_history (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    consent_type text NOT NULL CHECK (consent_type IN ('opt_in', 'opt_out')),
    consent_channel text DEFAULT 'web', -- web, app, email 등
    ip_address text,
    user_agent text,
    consented_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.marketing_consent_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own consent history"
    ON public.marketing_consent_history FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own consent history"
    ON public.marketing_consent_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 4. Indexes
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_marketing_consent_user_id 
    ON public.marketing_consent_history(user_id);

-- ==========================================
-- 사용 방법:
-- 1. Supabase Dashboard > SQL Editor에서 이 스크립트 실행
-- ==========================================
