'use client';

import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Shield, BadgeCheck, Store, ArrowRight } from 'lucide-react';

interface BreederVerifyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * 브리더 인증 안내 모달
 * 
 * 일반 회원이 분양하기 버튼을 클릭했을 때 표시되는 모달
 * 브리더 인증 안내 및 인증 페이지 링크 제공
 */
export function BreederVerifyModal({ isOpen, onClose }: BreederVerifyModalProps) {
    const router = useRouter();
    const locale = useLocale();

    const handleVerify = () => {
        onClose();
        router.push(`/${locale}/verify`);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                            <Shield className="w-6 h-6 text-[#D4AF37]" />
                        </div>
                        <DialogTitle className="text-xl font-bold text-[#D4AF37]">
                            브리더 인증이 필요합니다
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-zinc-400 text-base leading-relaxed">
                        크레스티아에서 분양 글을 작성하려면 브리더 인증이 필요합니다.
                        인증된 브리더만 분양 글을 등록할 수 있어요.
                    </DialogDescription>
                </DialogHeader>

                {/* Benefits */}
                <div className="space-y-3 my-4">
                    <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
                        <BadgeCheck className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                        <span className="text-sm text-zinc-300">프로필에 인증 배지 표시</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
                        <Store className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                        <span className="text-sm text-zinc-300">분양 글 작성 권한 획득</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 mt-2">
                    <Button
                        onClick={handleVerify}
                        className="w-full bg-[#D4AF37] text-black hover:bg-[#b08d22] font-bold py-5"
                    >
                        <Shield className="w-4 h-4 mr-2" />
                        브리더 인증 받으러 가기
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button
                        onClick={onClose}
                        variant="ghost"
                        className="w-full text-zinc-400 hover:text-white hover:bg-zinc-800"
                    >
                        나중에 할게요
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
