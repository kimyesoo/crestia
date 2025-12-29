'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Eye, ThumbsUp, User, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

// 동적 생성 데이터 import
import tipsData from '@/constants/husbandry_data_dynamic.json';

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
    diet: { label: '먹이', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
    housing: { label: '환경', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    health: { label: '건강', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
};

export default function TipDetailPage() {
    const params = useParams();
    const tipIndex = Number(params.id);

    const article = tipsData.articles[tipIndex];

    if (!article) {
        return (
            <div className="min-h-screen bg-black text-white pt-28 pb-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <Lightbulb className="w-16 h-16 mx-auto text-zinc-600 mb-4" />
                    <h1 className="text-2xl font-bold mb-4">팁을 찾을 수 없습니다</h1>
                    <Link href="/guide/tips" className="text-amber-500 hover:underline">
                        ← 사육 팁으로 돌아가기
                    </Link>
                </div>
            </div>
        );
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // 마크다운을 HTML로 변환
    const renderMarkdown = (content: string) => {
        return content
            .replace(/## (.*)/g, '<h2 class="text-2xl font-bold text-white mt-8 mb-4">$1</h2>')
            .replace(/### (.*)/g, '<h3 class="text-xl font-semibold text-zinc-200 mt-6 mb-3">$1</h3>')
            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
            .replace(/\n- /g, '<br/>• ')
            .replace(/\n\n/g, '</p><p class="mb-4 text-zinc-300 leading-relaxed">')
            .replace(/---/g, '<hr class="my-6 border-zinc-800"/>')
            .replace(/\| (.*?) \| (.*?) \|/g, '<tr><td class="border border-zinc-700 px-3 py-2">$1</td><td class="border border-zinc-700 px-3 py-2">$2</td></tr>');
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
                        href="/guide/tips"
                        className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        사육 팁으로 돌아가기
                    </Link>
                </motion.div>

                {/* 헤더 */}
                <motion.header
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    {/* 카테고리 뱃지 */}
                    <div className="flex items-center gap-3 mb-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${CATEGORY_LABELS[article.category]?.color || 'bg-zinc-800 text-zinc-400'}`}>
                            {CATEGORY_LABELS[article.category]?.label || article.category}
                        </span>
                        {article.tags.slice(1).map((tag, idx) => (
                            <span key={idx} className="px-2 py-1 bg-zinc-800 text-zinc-400 text-xs rounded">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* 제목 */}
                    <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
                        {article.title}
                    </h1>

                    {/* 메타 정보 */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
                        <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {article.author}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDate(article.created_at)}
                        </span>
                        <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {article.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                            <ThumbsUp className="w-4 h-4" />
                            {article.likes}
                        </span>
                    </div>

                    {/* 요약 */}
                    <p className="mt-4 text-lg text-zinc-400 leading-relaxed border-l-4 border-amber-500/50 pl-4">
                        {article.summary}
                    </p>
                </motion.header>

                {/* 본문 */}
                <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 md:p-8"
                >
                    <div
                        className="prose prose-invert prose-zinc max-w-none"
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(article.content) }}
                    />
                </motion.article>

                {/* 하단 네비게이션 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-8 flex flex-wrap gap-4"
                >
                    <Link
                        href="/guide/tips"
                        className="inline-flex items-center gap-2 px-5 py-3 bg-zinc-800 text-white font-medium rounded-xl hover:bg-zinc-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        다른 팁 보기
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
