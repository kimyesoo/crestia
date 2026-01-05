'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from '@/components/ui/dialog';
import {
    FileText,
    Mail,
    Loader2,
    CheckCircle,
    Sparkles,
    Gift
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { updateMarketingConsent } from '@/app/actions/marketing';
import { toast } from 'sonner';

interface LeadMagnetProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    pdfName?: string;
}

/**
 * 리드 매그넷 모달 컴포넌트
 * 
 * PDF/리포트 다운로드를 미끼로 마케팅 수신 동의를 유도
 */
export function LeadMagnet({
    isOpen,
    onClose,
    title = "이 정보를 PDF로 소장하고 싶으신가요?",
    description = "지금 보고 계신 정보를 깔끔한 PDF로 정리해서 보내드릴게요.",
    pdfName = "크레스티드 게코 사육 가이드"
}: LeadMagnetProps) {
    const [step, setStep] = useState<'initial' | 'consent' | 'success'>('initial');
    const [isMarketingAgreed, setIsMarketingAgreed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const supabase = createClient();
    const router = useRouter();
    const locale = useLocale();

    // 사용자 로그인 상태 확인
    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserEmail(user.email || null);
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
        };

        if (isOpen) {
            checkUser();
        }
    }, [isOpen, supabase]);

    const handleRequestPDF = () => {
        if (!isLoggedIn) {
            // 로그인 페이지로 이동
            toast.info('로그인 후 PDF를 받으실 수 있어요!');
            router.push(`/${locale}/login?redirect=${encodeURIComponent(window.location.pathname)}`);
            onClose();
            return;
        }
        setStep('consent');
    };

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            // 마케팅 동의 업데이트
            if (isMarketingAgreed) {
                const result = await updateMarketingConsent(true);
                if (!result.success) {
                    console.error('Marketing consent update failed:', result.error);
                }
            }

            // TODO: 실제로는 여기서 이메일 발송 API를 호출해야 함
            // 현재는 시뮬레이션

            setStep('success');
            toast.success('PDF가 이메일로 전송되었어요! 📧');

        } catch (error) {
            console.error('Error:', error);
            toast.error('오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setStep('initial');
        setIsMarketingAgreed(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md">
                {step === 'initial' && (
                    <>
                        <DialogHeader>
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 flex items-center justify-center">
                                    <FileText className="w-8 h-8 text-[#D4AF37]" />
                                </div>
                            </div>
                            <DialogTitle className="text-xl font-bold text-center text-white">
                                {title}
                            </DialogTitle>
                            <DialogDescription className="text-zinc-400 text-center mt-2">
                                {description}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="mt-6 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FileText className="w-6 h-6 text-red-400" />
                                </div>
                                <div>
                                    <p className="font-medium text-white text-sm">
                                        {pdfName}.pdf
                                    </p>
                                    <p className="text-xs text-zinc-500">
                                        이메일로 바로 받기
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={handleRequestPDF}
                            className="w-full mt-6 bg-[#D4AF37] text-black hover:bg-[#b08d22] font-bold py-6"
                        >
                            <Mail className="w-5 h-5 mr-2" />
                            이메일로 PDF 받기
                        </Button>

                        <p className="text-xs text-zinc-500 text-center mt-3">
                            {isLoggedIn
                                ? `${userEmail}로 전송됩니다`
                                : '로그인 후 이용 가능합니다'
                            }
                        </p>
                    </>
                )}

                {step === 'consent' && (
                    <>
                        <DialogHeader>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                                    <Gift className="w-6 h-6 text-[#D4AF37]" />
                                </div>
                                <div>
                                    <DialogTitle className="text-lg font-bold text-white">
                                        잠깐! 특별 혜택 🎁
                                    </DialogTitle>
                                    <DialogDescription className="text-zinc-400 text-sm">
                                        더 많은 정보를 무료로 받아보세요
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="mt-6 space-y-4">
                            {/* 마케팅 동의 체크박스 */}
                            <label className="flex items-start gap-3 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700 cursor-pointer hover:border-[#D4AF37]/50 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={isMarketingAgreed}
                                    onChange={(e) => setIsMarketingAgreed(e.target.checked)}
                                    className="mt-1 w-5 h-5 rounded border-zinc-600 bg-zinc-800 text-[#D4AF37] focus:ring-[#D4AF37] focus:ring-offset-0"
                                />
                                <div className="flex-1">
                                    <p className="font-medium text-white text-sm">
                                        유익한 크레 사육 꿀팁도 받아볼게요!
                                    </p>
                                    <p className="text-xs text-zinc-500 mt-1">
                                        월 1~2회 뉴스레터와 이벤트 소식을 보내드려요
                                    </p>
                                </div>
                            </label>

                            {/* 법적 고지 */}
                            <div className="text-xs text-zinc-500 space-y-1 px-1">
                                <p className="flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" />
                                    <span className="font-medium text-zinc-400">
                                        [광고성 정보 수신 동의]
                                    </span>
                                </p>
                                <p>
                                    체크하시면 Crestia의 프로모션, 이벤트, 신규 기능 안내 등
                                    광고성 정보를 이메일로 수신하는 데 동의하게 됩니다.
                                    동의를 거부하셔도 서비스 이용에는 제한이 없으며,
                                    동의 후에도 [마이페이지 &gt; 설정]에서 언제든 철회할 수 있습니다.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <Button
                                variant="ghost"
                                onClick={() => setStep('initial')}
                                className="flex-1 text-zinc-400 hover:text-white hover:bg-zinc-800"
                            >
                                이전
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="flex-1 bg-[#D4AF37] text-black hover:bg-[#b08d22] font-bold"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    'PDF 보내기'
                                )}
                            </Button>
                        </div>

                        <p className="text-xs text-zinc-600 text-center mt-3">
                            마케팅 수신 동의는 선택사항입니다
                        </p>
                    </>
                )}

                {step === 'success' && (
                    <div className="text-center py-6">
                        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">
                            전송 완료! 📧
                        </h3>
                        <p className="text-zinc-400 mb-6">
                            {userEmail}로 PDF를 보내드렸어요.
                            <br />
                            메일함을 확인해주세요!
                        </p>

                        {isMarketingAgreed && (
                            <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg p-4 mb-6">
                                <p className="text-sm text-[#D4AF37]">
                                    ✨ 앞으로 유익한 정보도 보내드릴게요!
                                </p>
                            </div>
                        )}

                        <Button
                            onClick={handleClose}
                            className="w-full bg-zinc-800 hover:bg-zinc-700 text-white"
                        >
                            닫기
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
