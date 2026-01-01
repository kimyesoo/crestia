'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Dna, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

// 최종 모프 사전 import
import { MORPH_DICTIONARY } from '@/constants/morph_data_final';

// 유전 타입 스타일
const TYPE_STYLES: Record<string, string> = {
    'recessive': 'bg-red-500/20 text-red-400 border border-red-500/30',
    'incomplete dominant': 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    'dominant': 'bg-green-500/20 text-green-400 border border-green-500/30',
    'polygenic': 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    'combination': 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    'other': 'bg-zinc-500/20 text-zinc-400 border border-zinc-500/30',
};

function getTypeStyle(type: string) {
    const lower = type.toLowerCase();
    if (lower.includes('recessive')) return TYPE_STYLES['recessive'];
    if (lower.includes('incomplete') || lower.includes('불완전')) return TYPE_STYLES['incomplete dominant'];
    if (lower.includes('dominant') || lower.includes('우성')) return TYPE_STYLES['dominant'];
    if (lower.includes('polygenic') || lower.includes('다인자')) return TYPE_STYLES['polygenic'];
    if (lower.includes('combination') || lower.includes('combo')) return TYPE_STYLES['combination'];
    return TYPE_STYLES['other'];
}

export default function MorphDetailPage() {
    const params = useParams();
    const morphId = params.id as string;

    // 모프 찾기
    const morph = MORPH_DICTIONARY.find(m => m.id === morphId);

    if (!morph) {
        return (
            <div className="min-h-screen bg-black text-white pt-28 pb-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <Dna className="w-16 h-16 mx-auto text-zinc-600 mb-4" />
                    <h1 className="text-2xl font-bold mb-4">모프를 찾을 수 없습니다</h1>
                    <Link href="/guide/morphs" className="text-gold-500 hover:underline">
                        ← 모프 도감으로 돌아가기
                    </Link>
                </div>
            </div>
        );
    }

    // 마크다운을 HTML로 변환
    const renderMarkdown = (content: string) => {
        return content
            .replace(/## (.*)/g, '<h2 class="text-2xl font-bold text-white mt-8 mb-4">$1</h2>')
            .replace(/### (.*)/g, '<h3 class="text-xl font-semibold text-zinc-200 mt-6 mb-3">$1</h3>')
            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
            .replace(/\n- /g, '<br/>• ')
            .replace(/\n\n/g, '</p><p class="mb-4 text-zinc-300 leading-relaxed">')
            .replace(/> ⚠️(.*)/g, '<div class="bg-amber-500/10 border-l-4 border-amber-500 pl-4 py-3 my-4 text-amber-200">⚠️$1</div>')
            .replace(/> (.*)/g, '<blockquote class="border-l-4 border-gold-500 pl-4 my-4 text-zinc-400 italic">$1</blockquote>')
            .replace(/---/g, '<hr class="my-6 border-zinc-800"/>');
    };

    return (
        <div className="min-h-screen bg-black text-white pt-28 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                {/* 뒤로가기 */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <Link
                        href="/guide/morphs"
                        className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        모프 도감으로 돌아가기
                    </Link>
                </motion.div>

                {/* 헤더 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-500/30 to-gold-600/20 flex items-center justify-center shrink-0">
                            <Dna className="w-8 h-8 text-gold-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                {morph.name}
                            </h1>
                            <div className="flex flex-wrap gap-2">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeStyle(morph.type)}`}>
                                    {morph.type}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 요약 */}
                    <p className="text-lg text-zinc-400 leading-relaxed border-l-4 border-gold-500/50 pl-4">
                        {morph.summary}
                    </p>

                    {/* 태그 */}
                    {morph.tags && morph.tags.length > 0 && (
                        <div className="mt-4 flex items-center gap-2 flex-wrap">
                            <Tag className="w-4 h-4 text-zinc-500" />
                            {morph.tags.map((tag, idx) => (
                                <span key={idx} className="px-2 py-1 bg-zinc-800 text-zinc-400 text-xs rounded">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* 본문 */}
                <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 md:p-8"
                >
                    <div
                        className="prose prose-invert prose-zinc max-w-none"
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(morph.content) }}
                    />
                </motion.article>

                {/* 링크 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-8 flex flex-wrap gap-4"
                >
                    <Link
                        href="/guide/morphs"
                        className="inline-flex items-center gap-2 px-5 py-3 bg-zinc-800 text-white font-medium rounded-xl hover:bg-zinc-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        다른 모프 보기
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
