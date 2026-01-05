'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { PenLine, Lock } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';
import { BreederVerifyModal } from './BreederVerifyModal';

interface MarketWriteButtonProps {
    className?: string;
    variant?: 'default' | 'compact';
}

/**
 * 분양 글쓰기 버튼 컴포넌트
 * 
 * - 인증 회원 (breeder/admin): [🖊️ 분양하기] (활성화)
 * - 일반 회원: [🔒 브리더 인증하고 분양하기] (클릭 시 모달)
 * - 비로그인: [🔒 로그인 후 분양하기] (로그인 페이지로 이동)
 */
export function MarketWriteButton({ className, variant = 'default' }: MarketWriteButtonProps) {
    const { role, isLoading, canPost } = useUserRole();
    const [showModal, setShowModal] = useState(false);
    const locale = useLocale();

    // 로딩 중
    if (isLoading) {
        return (
            <Button
                className={`bg-zinc-800 text-zinc-500 cursor-not-allowed ${className}`}
                disabled
            >
                <div className="w-4 h-4 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin mr-2" />
                로딩 중...
            </Button>
        );
    }

    // 로그인하지 않은 경우
    if (role === null) {
        return (
            <Button asChild className={`bg-zinc-800 hover:bg-zinc-700 text-zinc-300 ${className}`}>
                <Link href={`/${locale}/login`}>
                    <Lock className="w-4 h-4 mr-2" />
                    {variant === 'compact' ? '로그인' : '로그인 후 분양하기'}
                </Link>
            </Button>
        );
    }

    // 브리더 또는 관리자인 경우 - 활성화
    if (canPost) {
        return (
            <Button asChild className={`bg-[#D4AF37] text-black hover:bg-[#b08d22] font-bold ${className}`}>
                <Link href={`/${locale}/market/new`}>
                    <PenLine className="w-4 h-4 mr-2" />
                    {variant === 'compact' ? '분양하기' : '🖊️ 분양하기'}
                </Link>
            </Button>
        );
    }

    // 일반 회원인 경우 - 모달 표시
    return (
        <>
            <Button
                onClick={() => setShowModal(true)}
                className={`bg-zinc-800 hover:bg-zinc-700 text-zinc-300 ${className}`}
            >
                <Lock className="w-4 h-4 mr-2" />
                {variant === 'compact' ? '브리더 인증' : '🔒 브리더 인증하고 분양하기'}
            </Button>

            <BreederVerifyModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
            />
        </>
    );
}
