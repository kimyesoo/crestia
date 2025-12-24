'use client';

import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NamingPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                {/* Icon */}
                <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-10 h-10 text-[#D4AF37]" />
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-white mb-2">
                    2세 작명소
                </h1>
                <p className="text-zinc-500 text-sm mb-6">AI Gecko Naming</p>

                {/* Description */}
                <p className="text-zinc-400 mb-8">
                    AI가 당신의 도마뱀에게 딱 맞는 센스 있는 이름을 지어드립니다.
                    <br />
                    <span className="text-[#D4AF37]">Coming Soon</span>
                </p>

                {/* Back Button */}
                <Link href="/tools">
                    <Button variant="outline" className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        돌아가기
                    </Button>
                </Link>
            </div>
        </div>
    );
}
