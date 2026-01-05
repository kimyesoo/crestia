'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { LeadMagnet } from './LeadMagnet';

interface LeadMagnetTriggerProps {
    buttonText?: string;
    title?: string;
    description?: string;
    pdfName?: string;
    variant?: 'default' | 'outline' | 'ghost';
    className?: string;
}

/**
 * 리드 매그넷 모달을 트리거하는 버튼 컴포넌트
 * 
 * @example
 * <LeadMagnetTrigger 
 *   buttonText="PDF로 저장하기"
 *   pdfName="크레스티드 게코 모프 도감"
 * />
 */
export function LeadMagnetTrigger({
    buttonText = "PDF로 저장하기",
    title,
    description,
    pdfName,
    variant = 'outline',
    className
}: LeadMagnetTriggerProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                variant={variant}
                className={`border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/10 ${className}`}
            >
                <Download className="w-4 h-4 mr-2" />
                {buttonText}
            </Button>

            <LeadMagnet
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title={title}
                description={description}
                pdfName={pdfName}
            />
        </>
    );
}

/**
 * 가이드 페이지용 플로팅 리드 매그넷 버튼
 */
export function FloatingLeadMagnet({
    pdfName = "크레스티드 게코 가이드"
}: { pdfName?: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 right-4 z-40 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[#D4AF37] to-[#b08d22] text-black font-bold rounded-full shadow-lg shadow-[#D4AF37]/30 hover:scale-105 transition-transform"
            >
                <FileText className="w-5 h-5" />
                <span className="hidden sm:inline">PDF 저장</span>
            </button>

            <LeadMagnet
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                pdfName={pdfName}
            />
        </>
    );
}
