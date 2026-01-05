-- ==========================================
-- Care Logs Schema (Weight & Feeding)
-- ==========================================

-- 1. Feeding Type Enum
-- ==========================================
DO $$ BEGIN
    CREATE TYPE public.feeding_type AS ENUM ('insect', 'cgd');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Weight Logs Table (체중 기록)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.weight_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    gecko_id uuid NOT NULL REFERENCES public.geckos(id) ON DELETE CASCADE,
    weight decimal(5,2) NOT NULL, -- 그램 단위 (소수점 2자리까지, 예: 45.50)
    measured_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.weight_logs ENABLE ROW LEVEL SECURITY;

-- Weight Logs Policies
CREATE POLICY "Users can view their own gecko weight logs"
    ON public.weight_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.geckos
            WHERE geckos.id = weight_logs.gecko_id
            AND geckos.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert weight logs for their own geckos"
    ON public.weight_logs FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.geckos
            WHERE geckos.id = gecko_id
            AND geckos.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own gecko weight logs"
    ON public.weight_logs FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.geckos
            WHERE geckos.id = weight_logs.gecko_id
            AND geckos.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own gecko weight logs"
    ON public.weight_logs FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.geckos
            WHERE geckos.id = weight_logs.gecko_id
            AND geckos.owner_id = auth.uid()
        )
    );

-- 3. Feeding Logs Table (급식 기록)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.feeding_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    gecko_id uuid NOT NULL REFERENCES public.geckos(id) ON DELETE CASCADE,
    feeding_type public.feeding_type NOT NULL DEFAULT 'cgd',
    quantity integer, -- 먹이 개수 (충식의 경우) 또는 그램(CGD의 경우)
    fed_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.feeding_logs ENABLE ROW LEVEL SECURITY;

-- Feeding Logs Policies
CREATE POLICY "Users can view their own gecko feeding logs"
    ON public.feeding_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.geckos
            WHERE geckos.id = feeding_logs.gecko_id
            AND geckos.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert feeding logs for their own geckos"
    ON public.feeding_logs FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.geckos
            WHERE geckos.id = gecko_id
            AND geckos.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own gecko feeding logs"
    ON public.feeding_logs FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.geckos
            WHERE geckos.id = feeding_logs.gecko_id
            AND geckos.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own gecko feeding logs"
    ON public.feeding_logs FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.geckos
            WHERE geckos.id = feeding_logs.gecko_id
            AND geckos.owner_id = auth.uid()
        )
    );

-- 4. Indexes for Performance
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_weight_logs_gecko_id ON public.weight_logs(gecko_id);
CREATE INDEX IF NOT EXISTS idx_weight_logs_measured_at ON public.weight_logs(measured_at DESC);
CREATE INDEX IF NOT EXISTS idx_feeding_logs_gecko_id ON public.feeding_logs(gecko_id);
CREATE INDEX IF NOT EXISTS idx_feeding_logs_fed_at ON public.feeding_logs(fed_at DESC);

-- ==========================================
-- 사용 방법:
-- 1. Supabase Dashboard > SQL Editor에서 이 스크립트 실행
-- ==========================================
