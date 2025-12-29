'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { PenLine, Eye, ThumbsUp, MessageCircle, Clock, HelpCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

// 리얼 Q&A 데이터 import
import qnaData from '@/constants/community_qna_dynamic.json';

interface QnaPost {
    id: string;
    category: string;
    title: string;
    author: string;
    date: string;
    views: number;
    likes: number;
    commentCount: number;
    content: string;
    bestAnswer: {
        author: string;
        content: string;
        likes: number;
        date: string;
    };
}

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
    '유전/모프': { label: '유전/모프', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    '사육/건강': { label: '건강', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
    '사육/환경': { label: '환경', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    '사육/먹이': { label: '먹이', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
    '오해와진실': { label: '팩트체크', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
    '일반': { label: '일반', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
};

export default function QnAPage() {
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
    const seedPosts: QnaPost[] = qnaData.posts;

    // 카테고리 필터링
    const filteredPosts = activeCategory === 'all'
        ? seedPosts
        : seedPosts.filter(p => p.category === activeCategory);

    // 카테고리 목록 추출 (중복 제거)
    const categories = [...new Set(seedPosts.map(p => p.category))];

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
                        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-400 text-sm font-medium mb-4"
                    >
                        <HelpCircle className="w-4 h-4" />
                        {seedPosts.length}개 질문
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent"
                    >
                        Q&A 게시판
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-3 text-zinc-400 text-lg max-w-2xl mx-auto"
                    >
                        크레스티드 게코 사육에 대한 질문과 전문가 답변
                    </motion.p>
                </div>

                {/* Category Tabs */}
                <div className="flex justify-center gap-2 mb-8 flex-wrap">
                    <button
                        onClick={() => setActiveCategory('all')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === 'all'
                                ? 'bg-purple-500 text-white'
                                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                            }`}
                    >
                        전체 ({seedPosts.length})
                    </button>
                    {categories.map((cat) => {
                        const count = seedPosts.filter(p => p.category === cat).length;
                        const labelInfo = CATEGORY_LABELS[cat] || { label: cat };
                        return (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                                    }`}
                            >
                                {labelInfo.label} ({count})
                            </button>
                        );
                    })}
                </div>

                {/* Write Button */}
                {user && (
                    <div className="flex justify-end mb-6">
                        <Link href="/community/write?category=qna">
                            <Button className="bg-purple-500 hover:bg-purple-400 text-white gap-2">
                                <PenLine className="w-4 h-4" />
                                질문하기
                            </Button>
                        </Link>
                    </div>
                )}

                {/* Posts List */}
                <div className="space-y-4">
                    {filteredPosts.map((post, index) => (
                        <Link key={post.id} href={`/community/qna/${index}`}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.02 }}
                                className="group bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300 mb-4"
                            >
                                <div className="flex items-start gap-4">
                                    {/* Q 아이콘 */}
                                    <div className="w-10 h-10 flex-shrink-0 bg-purple-500/20 rounded-full flex items-center justify-center">
                                        <span className="text-purple-400 font-bold">Q</span>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        {/* 카테고리 & 작성자 */}
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium border ${CATEGORY_LABELS[post.category]?.color || 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
                                                {CATEGORY_LABELS[post.category]?.label || post.category}
                                            </span>
                                            <span className="text-xs text-zinc-500 flex items-center gap-1">
                                                <User className="w-3 h-3" />
                                                {post.author}
                                            </span>
                                        </div>

                                        {/* 제목 */}
                                        <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-1 mb-2">
                                            {post.title}
                                        </h3>

                                        {/* 질문 내용 미리보기 */}
                                        <p className="text-sm text-zinc-500 line-clamp-2 mb-3">
                                            {post.content}
                                        </p>

                                        {/* 메타 정보 */}
                                        <div className="flex items-center gap-4 text-zinc-600 text-xs flex-wrap">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {formatDate(post.date)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Eye className="w-3 h-3" />
                                                {post.views.toLocaleString()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <ThumbsUp className="w-3 h-3" />
                                                {post.likes}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MessageCircle className="w-3 h-3" />
                                                {post.commentCount}
                                            </span>
                                            <span className="flex items-center gap-1 text-green-500">
                                                ✓ 답변 완료
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-12 pt-8 border-t border-zinc-800 text-center text-sm text-zinc-500">
                    <p>총 {seedPosts.length}개의 질문이 등록되어 있습니다</p>
                    <p className="text-xs text-zinc-600 mt-1">Knowledge Base 기반 전문가 답변 제공</p>
                </div>
            </div>
        </div>
    );
}
