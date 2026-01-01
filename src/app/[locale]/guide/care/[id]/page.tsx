'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Clock, Newspaper } from 'lucide-react';
import { motion } from 'framer-motion';

// Pangea 데이터 import (한국어 번역본)
import pangeaData from '@/constants/pangea_data_ko.json';

export default function ArticleDetailPage() {
    const params = useParams();
    const articleId = params.id as string;

    // URL 디코딩하여 아티클 찾기
    const article = pangeaData.articles.find(a =>
        encodeURIComponent(a.title.replace(/\s+/g, '-').toLowerCase()) === articleId ||
        a.title.replace(/\s+/g, '-').toLowerCase() === decodeURIComponent(articleId)
    );

    // 인덱스로도 찾기 시도
    const articleByIndex = !article && !isNaN(Number(articleId))
        ? pangeaData.articles[Number(articleId)]
        : null;

    const displayArticle = article || articleByIndex;

    if (!displayArticle) {
        return (
            <div className="min-h-screen bg-black text-white pt-28 pb-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <Newspaper className="w-16 h-16 mx-auto text-zinc-600 mb-4" />
                    <h1 className="text-2xl font-bold mb-4">아티클을 찾을 수 없습니다</h1>
                    <Link href="/guide/care" className="text-emerald-500 hover:underline">
                        ← 사육 지식으로 돌아가기
                    </Link>
                </div>
            </div>
        );
    }

    // 마크다운 스타일 적용
    const formatContent = (content: string) => {
        return content
            .split('\n\n')
            .map((paragraph, idx) => (
                <p key={idx} className="mb-4 text-zinc-300 leading-relaxed">
                    {paragraph}
                </p>
            ));
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
                        href="/guide/care"
                        className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        사육 지식으로 돌아가기
                    </Link>
                </motion.div>

                {/* 헤더 */}
                <motion.header
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    {/* 출처 태그 */}
                    <div className="flex items-center gap-3 text-sm text-zinc-500 mb-4">
                        <Newspaper className="w-4 h-4" />
                        <span>Pangea Reptile Blog</span>
                        <span className="text-zinc-700">•</span>
                        <Clock className="w-4 h-4" />
                        <span>{new Date(displayArticle.scraped_at).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</span>
                    </div>

                    {/* 제목 */}
                    <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                        {displayArticle.title}
                    </h1>

                    {/* 요약 */}
                    <p className="mt-4 text-lg text-zinc-400 leading-relaxed border-l-4 border-emerald-500/50 pl-4">
                        {displayArticle.summary}
                    </p>
                </motion.header>

                {/* 본문 */}
                <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 md:p-8"
                >
                    <div className="prose prose-invert prose-zinc max-w-none">
                        {formatContent(displayArticle.content)}
                    </div>
                </motion.article>

                {/* 원문 링크 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-8 flex flex-wrap gap-4"
                >
                    <a
                        href={displayArticle.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-colors"
                    >
                        <ExternalLink className="w-4 h-4" />
                        원문 보기 (영어)
                    </a>
                    <Link
                        href="/guide/care"
                        className="inline-flex items-center gap-2 px-5 py-3 bg-zinc-800 text-white font-medium rounded-xl hover:bg-zinc-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        다른 아티클 보기
                    </Link>
                </motion.div>

                {/* 저작권 안내 */}
                <div className="mt-12 pt-6 border-t border-zinc-800 text-center text-xs text-zinc-600">
                    <p>이 콘텐츠는 Pangea Reptile의 블로그에서 번역된 정보입니다. 원문의 저작권은 Pangea Reptile에 있습니다.</p>
                </div>
            </div>
        </div>
    );
}
