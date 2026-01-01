import type { Metadata } from "next";
import Link from 'next/link';
import { FileText, Sparkles, Calculator, ArrowRight, GitFork, CreditCard } from 'lucide-react';

export const metadata: Metadata = {
    title: "Tools - 브리더 유틸리티",
    description: "멘델 유전 법칙 기반 2세 모프 예측, AI 작명소, 분양 계약서 생성기.",
    openGraph: {
        title: "Crestia Tools - 브리더 유틸리티",
        description: "멘델 유전 법칙 기반 2세 모프 예측, AI 작명소, 분양 계약서 생성기.",
    },
};

const tools = [
    {
        id: 'contract',
        title: '분양 계약서 생성기',
        titleEn: 'Sales Contract Generator',
        description: '복잡한 서류 작업 10초 컷. 양도/양수 신고에 필요한 서류를 PDF로 받아보세요.',
        icon: FileText,
        href: '/tools/contract',
        available: true,
    },
    {
        id: 'naming',
        title: '2세 작명소',
        titleEn: 'AI Gecko Naming',
        description: '내 도마뱀에게 딱 맞는 이름은? AI가 센스 있는 이름을 지어드립니다.',
        icon: Sparkles,
        href: '/tools/naming',
        available: true,
    },
    {
        id: 'calculator',
        title: '모프 계산기',
        titleEn: 'Morph Calculator',
        description: 'Gen 2.0 유전학 알고리즘! 부모 개체의 유전형을 입력하면 2세의 확률과 디자이너 모프를 계산합니다.',
        icon: Calculator,
        href: '/tools/calculator',
        available: true,
    },
    {
        id: 'lineage',
        title: '혈통도',
        titleEn: 'Lineage Tree',
        description: '내 게코의 가계도를 시각적으로 확인하세요. 부모, 조부모까지 한눈에!',
        icon: GitFork,
        href: '/lineage',
        available: true,
    },
    {
        id: 'card',
        title: 'ID 카드',
        titleEn: 'ID Card Generator',
        description: '분양용 ID 카드를 자동으로 생성하세요. 프리미엄 디자인!',
        icon: CreditCard,
        href: '/card',
        available: true,
    },
];

export default function ToolsPage() {
    return (
        <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-white mb-4">
                        <span className="text-[#D4AF37]">CRESTIA</span> TOOLS
                    </h1>
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                        브리더를 위한 프리미엄 유틸리티 도구 모음
                    </p>
                </div>

                {/* Tools Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tools.map((tool) => {
                        const IconComponent = tool.icon;
                        return (
                            <div
                                key={tool.id}
                                className={`
                                    relative group bg-zinc-900/50 rounded-xl p-8 
                                    border border-zinc-800 
                                    transition-all duration-300 ease-out
                                    hover:border-[#D4AF37]/50 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)]
                                    ${!tool.available ? 'opacity-60' : ''}
                                `}
                            >
                                {/* Coming Soon Badge */}
                                {!tool.available && (
                                    <div className="absolute top-4 right-4 bg-zinc-800 text-zinc-400 text-xs px-3 py-1 rounded-full">
                                        Coming Soon
                                    </div>
                                )}

                                {/* Icon */}
                                <div className="w-14 h-14 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#D4AF37]/20 transition-colors">
                                    <IconComponent className="w-7 h-7 text-[#D4AF37]" />
                                </div>

                                {/* Title */}
                                <h2 className="text-xl font-bold text-white mb-2">
                                    {tool.title}
                                </h2>
                                <p className="text-sm text-zinc-500 mb-4">
                                    {tool.titleEn}
                                </p>

                                {/* Description */}
                                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                                    {tool.description}
                                </p>

                                {/* Action Button */}
                                {tool.available ? (
                                    <Link
                                        href={tool.href}
                                        className="inline-flex items-center gap-2 text-[#D4AF37] font-medium text-sm group-hover:gap-3 transition-all"
                                    >
                                        바로가기
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                ) : (
                                    <span className="inline-flex items-center gap-2 text-zinc-500 font-medium text-sm cursor-not-allowed">
                                        준비 중
                                        <ArrowRight className="w-4 h-4" />
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Bottom Note */}
                <div className="text-center mt-16 text-zinc-500 text-sm">
                    더 많은 도구가 곧 추가될 예정입니다.
                </div>
            </div>
        </div>
    );
}
