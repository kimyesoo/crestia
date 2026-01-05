'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

interface UpdateConsentResult {
    success: boolean;
    error?: string;
}

/**
 * 마케팅 수신 동의 상태 업데이트 Server Action
 * 
 * 로그인한 본인만 자신의 동의 상태를 변경할 수 있음
 */
export async function updateMarketingConsent(
    isAgreed: boolean
): Promise<UpdateConsentResult> {
    try {
        const supabase = await createClient();

        // 현재 로그인한 사용자 확인
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return { success: false, error: '로그인이 필요합니다.' };
        }

        // private_infos 레코드가 있는지 확인
        const { data: existingInfo } = await supabase
            .from('private_infos')
            .select('id')
            .eq('id', user.id)
            .single();

        if (existingInfo) {
            // 기존 레코드 업데이트
            const { error: updateError } = await supabase
                .from('private_infos')
                .update({
                    is_marketing_agreed: isAgreed,
                    marketing_agreed_at: isAgreed ? new Date().toISOString() : null,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (updateError) throw updateError;
        } else {
            // 새 레코드 생성
            const { error: insertError } = await supabase
                .from('private_infos')
                .insert({
                    id: user.id,
                    is_marketing_agreed: isAgreed,
                    marketing_agreed_at: isAgreed ? new Date().toISOString() : null
                });

            if (insertError) throw insertError;
        }

        // 동의 히스토리 기록 (법적 요구사항)
        const { error: historyError } = await supabase
            .from('marketing_consent_history')
            .insert({
                user_id: user.id,
                consent_type: isAgreed ? 'opt_in' : 'opt_out',
                consent_channel: 'web'
            });

        if (historyError) {
            console.error('Failed to log consent history:', historyError);
            // 히스토리 저장 실패는 치명적이지 않으므로 계속 진행
        }

        revalidatePath('/');

        return { success: true };

    } catch (error) {
        console.error('Error updating marketing consent:', error);
        return {
            success: false,
            error: '동의 상태 업데이트에 실패했습니다. 다시 시도해주세요.'
        };
    }
}

/**
 * 현재 사용자의 마케팅 동의 상태 조회
 */
export async function getMarketingConsentStatus(): Promise<boolean> {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        const { data } = await supabase
            .from('private_infos')
            .select('is_marketing_agreed')
            .eq('id', user.id)
            .single();

        return data?.is_marketing_agreed || false;
    } catch {
        return false;
    }
}
