import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export type UserRole = 'admin' | 'breeder' | 'member' | null;

interface UserWithRole {
    id: string;
    email: string | undefined;
    role: UserRole;
}

/**
 * 서버 사이드에서 현재 로그인한 사용자의 Role을 조회
 * 
 * @returns 사용자 정보 및 Role (로그인하지 않은 경우 null)
 */
export async function getUserWithRole(): Promise<UserWithRole | null> {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (error) {
        console.error('Error fetching user role:', error);
        return {
            id: user.id,
            email: user.email,
            role: 'member', // 기본값
        };
    }

    return {
        id: user.id,
        email: user.email,
        role: profile?.role || 'member',
    };
}

/**
 * 현재 사용자의 Role만 반환
 */
export async function getUserRole(): Promise<UserRole> {
    const user = await getUserWithRole();
    return user?.role || null;
}

/**
 * Breeder 또는 Admin 권한이 필요한 페이지에서 사용
 * 권한이 없으면 지정된 페이지로 리다이렉트
 * 
 * @param locale - 현재 로케일
 * @param redirectTo - 권한이 없을 때 리다이렉트할 경로 (기본값: /verify)
 * @returns 권한이 있는 경우 사용자 정보 반환
 */
export async function requireBreederRole(
    locale: string,
    redirectTo: string = '/verify'
): Promise<UserWithRole> {
    const user = await getUserWithRole();

    // 로그인하지 않은 경우
    if (!user) {
        redirect(`/${locale}/login`);
    }

    // 권한이 없는 경우
    if (user.role !== 'admin' && user.role !== 'breeder') {
        redirect(`/${locale}${redirectTo}`);
    }

    return user;
}

/**
 * Admin 권한이 필요한 페이지에서 사용
 * 권한이 없으면 홈으로 리다이렉트
 * 
 * @param locale - 현재 로케일
 * @returns 권한이 있는 경우 사용자 정보 반환
 */
export async function requireAdminRole(locale: string): Promise<UserWithRole> {
    const user = await getUserWithRole();

    if (!user) {
        redirect(`/${locale}/login`);
    }

    if (user.role !== 'admin') {
        redirect(`/${locale}`);
    }

    return user;
}

/**
 * 권한 체크 유틸리티 함수들
 */
export function canPostToMarket(role: UserRole): boolean {
    return role === 'admin' || role === 'breeder';
}

export function isAdmin(role: UserRole): boolean {
    return role === 'admin';
}

export function isBreeder(role: UserRole): boolean {
    return role === 'breeder';
}
