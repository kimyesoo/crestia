import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * POST /api/user/request-breeder
 * 
 * 브리더 권한 신청 API
 * 현재는 테스트용으로 즉시 role을 'breeder'로 업그레이드
 * 추후 SMS 인증 등 추가 가능
 */
export async function POST() {
    try {
        const supabase = await createClient();

        // 현재 로그인한 사용자 확인
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: '로그인이 필요합니다.' },
                { status: 401 }
            );
        }

        // 현재 사용자의 role 확인
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profileError) {
            console.error('Error fetching profile:', profileError);
            return NextResponse.json(
                { error: '프로필을 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        // 이미 breeder 또는 admin인 경우
        if (profile.role === 'breeder' || profile.role === 'admin') {
            return NextResponse.json(
                {
                    success: true,
                    message: '이미 브리더 권한이 있습니다.',
                    role: profile.role
                },
                { status: 200 }
            );
        }

        // role을 breeder로 업그레이드 (테스트용 즉시 승인)
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ role: 'breeder' })
            .eq('id', user.id);

        if (updateError) {
            console.error('Error updating role:', updateError);
            return NextResponse.json(
                { error: '권한 업데이트에 실패했습니다.' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: '브리더 인증이 완료되었습니다!',
                role: 'breeder'
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error in request-breeder API:', error);
        return NextResponse.json(
            { error: '서버 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
