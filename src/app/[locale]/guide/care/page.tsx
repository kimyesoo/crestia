'use client';

import Link from 'next/link';
import { BookOpen, ChevronRight, Newspaper, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

// Pangea 데이터 import (한국어 번역본)
import pangeaData from '@/constants/pangea_data_ko.json';

// 아티클 카드 컴포넌트 (Link로 페이지 이동)
function ArticleCard({ article, index }: { article: any; index: number }) {
    return (
        <Link href={`/guide/care/${index}`}>
            <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="group h-full bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300"
            >
                <div className="p-6">
                    {/* 출처 태그 */}
                    <div className="flex items-center gap-2 text-xs text-zinc-500 mb-3">
                        <Newspaper className="w-3 h-3" />
                        <span>Pangea Reptile Blog</span>
                        <span className="text-zinc-700">•</span>
                        <Clock className="w-3 h-3" />
                        <span>{new Date(article.scraped_at).toLocaleDateString('ko-KR')}</span>
                    </div>

                    {/* 제목 */}
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2 mb-3">
                        {article.title}
                    </h3>

                    {/* 요약 */}
                    <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3 mb-4">
                        {article.summary}
                    </p>

                    {/* 더 읽기 버튼 */}
                    <div className="inline-flex items-center gap-1 text-sm font-medium text-emerald-400 group-hover:text-emerald-300 transition-colors group/btn">
                        더 읽기
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </div>
                </div>
            </motion.article>
        </Link>
    );
}

// 메인 페이지 컴포넌트
export default function CareGuidePage() {
    // 전체 아티클 표시 (필터링 제거)
    const displayArticles = pangeaData.articles;

    return (
        <div className="min-h-screen bg-black text-white pt-28 pb-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                {/* 헤더 */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-sm font-medium mb-4"
                    >
                        <BookOpen className="w-4 h-4" />
                        {displayArticles.length}개 아티클 수록
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent"
                    >
                        사육 지식
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-3 text-zinc-400 text-lg max-w-2xl mx-auto"
                    >
                        Pangea Reptile의 전문 사육 정보를 한국어로 쉽게 접해보세요
                    </motion.p>
                </div>

                {/* Featured 아티클 (첫 번째) */}
                {displayArticles.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-8"
                    >
                        <Link href="/guide/care/0">
                            <div className="group relative bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden cursor-pointer hover:border-emerald-500/30 transition-all">
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative p-8 md:p-10">
                                    <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium mb-3">
                                        <span className="px-2 py-1 bg-emerald-500/10 rounded">FEATURED</span>
                                        <span className="text-zinc-500">Pangea Reptile Blog</span>
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-white group-hover:text-emerald-400 transition-colors mb-4">
                                        {displayArticles[0].title}
                                    </h2>
                                    <p className="text-zinc-400 leading-relaxed line-clamp-3 max-w-3xl">
                                        {displayArticles[0].summary}
                                    </p>
                                    <div className="mt-6 inline-flex items-center gap-2 text-emerald-400 font-medium group-hover:gap-3 transition-all">
                                        전문 읽기
                                        <ChevronRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                )}

                {/* 아티클 그리드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {displayArticles.slice(1).map((article, index) => (
                        <ArticleCard
                            key={article.url}
                            article={article}
                            index={index + 1}
                        />
                    ))}
                </div>

                {/* 데이터 없음 */}
                {displayArticles.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
                            <BookOpen className="w-8 h-8 text-zinc-600" />
                        </div>
                        <p className="text-zinc-500">아직 수집된 아티클이 없습니다</p>
                    </div>
                )}

                {/* 출처 표시 */}
                <div className="mt-12 pt-8 border-t border-zinc-800 text-center text-sm text-zinc-500">
                    <p>
                        데이터 출처: <a href={pangeaData.source_url} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">Pangea Reptile Blog</a>
                    </p>
                    <p className="mt-1">마지막 업데이트: {new Date(pangeaData.translated_at).toLocaleDateString('ko-KR')}</p>
                    <p className="mt-3 text-xs text-zinc-600">
                        이 콘텐츠는 Pangea Reptile의 블로그에서 수집된 정보입니다. 원문의 저작권은 Pangea Reptile에 있습니다.
                    </p>
                </div>
            </div>
        </div>
    );
}
