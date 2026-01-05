'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export type UserRole = 'admin' | 'breeder' | 'member' | null;

interface UseUserRoleReturn {
    role: UserRole;
    isLoading: boolean;
    isAdmin: boolean;
    isBreeder: boolean;
    isMember: boolean;
    canPost: boolean; // admin 또는 breeder인 경우 true
    refetch: () => Promise<void>;
}

/**
 * 현재 로그인한 사용자의 Role을 조회하는 React Hook
 * 
 * @example
 * const { role, isBreeder, canPost } = useUserRole();
 * 
 * if (canPost) {
 *   // 분양 글쓰기 가능
 * }
 */
export function useUserRole(): UseUserRoleReturn {
    const [role, setRole] = useState<UserRole>(null);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    const fetchRole = async () => {
        try {
            setIsLoading(true);
            
            const { data: { user } } = await supabase.auth.getUser();
            
            if (!user) {
                setRole(null);
                return;
            }

            const { data: profile, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (error) {
                console.error('Error fetching user role:', error);
                setRole('member'); // 기본값
                return;
            }

            setRole(profile?.role || 'member');
        } catch (error) {
            console.error('Error in useUserRole:', error);
            setRole(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRole();

        // 인증 상태 변경 감지
        const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
            fetchRole();
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return {
        role,
        isLoading,
        isAdmin: role === 'admin',
        isBreeder: role === 'breeder',
        isMember: role === 'member',
        canPost: role === 'admin' || role === 'breeder',
        refetch: fetchRole,
    };
}
