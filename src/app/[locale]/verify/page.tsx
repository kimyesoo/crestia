'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Shield, CheckCircle, Loader2, ArrowLeft, BadgeCheck, Store, FileCheck } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function VerifyPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const router = useRouter();
    const locale = useLocale();

    const handleRequestBreeder = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/user/request-breeder', {
                method: 'POST',
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || '브리더 신청에 실패했습니다.');
            }

            setIsVerified(true);
            toast.success('🎉 브리더 인증이 완료되었습니다!');

            // 2초 후 분양 페이지로 이동
            setTimeout(() => {
                router.push(`/${locale}/market/new`);
            }, 2000);
        } catch (error) {
            console.error('Error requesting breeder:', error);
            toast.error(error instanceof Error ? error.message : '오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black py-12">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Link */}
                <Link
                    href={`/${locale}`}
                    className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#D4AF37] transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>홈으로</span>
                </Link>

                {/* Main Card */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#D4AF37]/20 to-transparent p-8 border-b border-zinc-800">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                                <Shield className="w-8 h-8 text-[#D4AF37]" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white font-serif">
                                    브리더 인증
                                </h1>
                                <p className="text-zinc-400 mt-1">
                                    분양 권한을 얻기 위한 인증 절차입니다
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        {isVerified ? (
                            // 인증 완료 상태
                            <div className="text-center py-8">
                                <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-10 h-10 text-green-500" />
                                </div>
                                <h2 className="text-xl font-bold text-white mb-2">
                                    인증이 완료되었습니다!
                                </h2>
                                <p className="text-zinc-400">
                                    잠시 후 분양 페이지로 이동합니다...
                                </p>
                            </div>
                        ) : (
                            // 인증 대기 상태
                            <>
                                {/* Info Box */}
                                <div className="bg-zinc-800/50 rounded-xl p-6 mb-8">
                                    <h3 className="text-lg font-semibold text-[#D4AF37] mb-4">
                                        🔒 분양 권한이 필요합니다
                                    </h3>
                                    <p className="text-zinc-300 leading-relaxed">
                                        크레스티아에서 <strong className="text-white">분양 글을 작성</strong>하려면
                                        <strong className="text-[#D4AF37]"> 브리더 인증</strong>이 필요합니다.
                                        인증된 브리더만 분양 글을 등록할 수 있어,
                                        구매자들이 안심하고 거래할 수 있습니다.
                                    </p>
                                </div>

                                {/* Benefits */}
                                <div className="space-y-4 mb-8">
                                    <h4 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
                                        브리더 인증 혜택
                                    </h4>
                                    <div className="grid gap-3">
                                        <div className="flex items-center gap-3 p-4 bg-zinc-800/30 rounded-lg">
                                            <BadgeCheck className="w-5 h-5 text-[#D4AF37]" />
                                            <span className="text-zinc-300">프로필에 인증 배지 표시</span>
                                        </div>
                                        <div className="flex items-center gap-3 p-4 bg-zinc-800/30 rounded-lg">
                                            <Store className="w-5 h-5 text-[#D4AF37]" />
                                            <span className="text-zinc-300">분양 글 작성 권한</span>
                                        </div>
                                        <div className="flex items-center gap-3 p-4 bg-zinc-800/30 rounded-lg">
                                            <FileCheck className="w-5 h-5 text-[#D4AF37]" />
                                            <span className="text-zinc-300">거래 신뢰도 향상</span>
                                        </div>
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <Button
                                    onClick={handleRequestBreeder}
                                    disabled={isLoading}
                                    className="w-full bg-[#D4AF37] text-black hover:bg-[#b08d22] font-bold py-6 text-lg disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            인증 처리 중...
                                        </>
                                    ) : (
                                        <>
                                            <Shield className="w-5 h-5 mr-2" />
                                            브리더 인증 받기
                                        </>
                                    )}
                                </Button>

                                <p className="text-xs text-zinc-500 text-center mt-4">
                                    ※ 현재 테스트 기간으로 즉시 인증이 완료됩니다.
                                    <br />
                                    정식 오픈 후에는 별도의 인증 절차가 적용됩니다.
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
