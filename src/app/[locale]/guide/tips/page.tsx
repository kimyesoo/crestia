'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { PenLine, Eye, Clock, Lightbulb, ArrowLeft, ThumbsUp, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

// 동적 생성 데이터 import
import tipsData from '@/constants/husbandry_data_dynamic.json';

interface TipArticle {
    id: string;
    title: string;
    category: string;
    summary: string;
    content: string;
    author: string;
    views: number;
    likes: number;
    created_at: string;
    tags: string[];
}

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
    diet: { label: '먹이', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
    housing: { label: '환경', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    health: { label: '건강', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
};

export default function TipsPage() {
    const supabase = useMemo(() => createClient(), []);
    const [user, setUser] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<string>('all');

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user?.id || null);
        };
        fetchUser();
    }, [supabase]);

    // 시드 데이터 사용
    const seedArticles: TipArticle[] = tipsData.articles;

    // 카테고리 필터링
    const filteredArticles = activeCategory === 'all'
        ? seedArticles
        : seedArticles.filter(a => a.category === activeCategory);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-black pt-28 pb-8 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-sm font-medium mb-4"
                    >
                        <Lightbulb className="w-4 h-4" />
                        {seedArticles.length}개 팁 수록
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent"
                    >
                        사육 꿀팁
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-3 text-zinc-400 text-lg max-w-2xl mx-auto"
                    >
                        경험 많은 사육자들이 공유하는 크레스티드 게코 사육 꿀팁
                    </motion.p>
                </div>

                {/* Category Tabs */}
                <div className="flex justify-center gap-2 mb-8 flex-wrap">
                    <button
                        onClick={() => setActiveCategory('all')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === 'all'
                                ? 'bg-amber-500 text-black'
                                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                            }`}
                    >
                        전체 ({seedArticles.length})
                    </button>
                    {Object.entries(CATEGORY_LABELS).map(([key, { label }]) => {
                        const count = seedArticles.filter(a => a.category === key).length;
                        return (
                            <button
                                key={key}
                                onClick={() => setActiveCategory(key)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === key
                                        ? 'bg-amber-500 text-black'
                                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                                    }`}
                            >
                                {label} ({count})
                            </button>
                        );
                    })}
                </div>

                {/* Write Button */}
                {user && (
                    <div className="flex justify-end mb-6">
                        <Link href="/guide/write">
                            <Button className="bg-amber-500 hover:bg-amber-400 text-black gap-2">
                                <PenLine className="w-4 h-4" />
                                팁 공유하기
                            </Button>
                        </Link>
                    </div>
                )}

                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredArticles.map((article, index) => (
                        <Link key={article.id} href={`/guide/tips/${index}`}>
                            <motion.article
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                                className="group h-full bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300"
                            >
                                <div className="p-6">
                                    {/* Category & Author */}
                                    <div className="flex items-center justify-between mb-3">
                                        <span className={`px-2 py-1 rounded text-xs font-medium border ${CATEGORY_LABELS[article.category]?.color || 'bg-zinc-800 text-zinc-400'}`}>
                                            {CATEGORY_LABELS[article.category]?.label || article.category}
                                        </span>
                                        <div className="flex items-center gap-1 text-xs text-zinc-500">
                                            <User className="w-3 h-3" />
                                            <span>{article.author}</span>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 mb-3">
                                        {article.title}
                                    </h3>

                                    {/* Summary */}
                                    <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2 mb-4">
                                        {article.summary}
                                    </p>

                                    {/* Meta */}
                                    <div className="flex items-center gap-4 text-zinc-500 text-xs">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {formatDate(article.created_at)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Eye className="w-3 h-3" />
                                            {article.views.toLocaleString()}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <ThumbsUp className="w-3 h-3" />
                                            {article.likes}
                                        </span>
                                    </div>
                                </div>
                            </motion.article>
                        </Link>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-12 pt-8 border-t border-zinc-800 text-center text-sm text-zinc-500">
                    <p>총 {seedArticles.length}개의 사육 팁이 수록되어 있습니다</p>
                </div>

                {/* Back Link */}
                <div className="mt-6 text-center">
                    <Link href="/guide" className="text-zinc-500 hover:text-white transition inline-flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        전체 가이드 보기
                    </Link>
                </div>
            </div>
        </div>
    );
}
