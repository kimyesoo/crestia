'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Eye, ThumbsUp, User, MessageCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

// 리얼 Q&A 데이터 import
import qnaData from '@/constants/community_qna_dynamic.json';

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
    '유전/모프': { label: '유전/모프', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    '사육/건강': { label: '건강', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
    '사육/환경': { label: '환경', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    '사육/먹이': { label: '먹이', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
    '오해와진실': { label: '팩트체크', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
    '일반': { label: '일반', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
};

export default function QnADetailPage() {
    const params = useParams();
    const postIndex = Number(params.id);

    const post = qnaData.posts[postIndex];

    if (!post) {
        return (
            <div className="min-h-screen bg-black text-white pt-28 pb-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <MessageCircle className="w-16 h-16 mx-auto text-zinc-600 mb-4" />
                    <h1 className="text-2xl font-bold mb-4">질문을 찾을 수 없습니다</h1>
                    <Link href="/community/qna" className="text-purple-500 hover:underline">
                        ← Q&A로 돌아가기
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
            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
            .replace(/\n- /g, '<br/>• ')
            .replace(/\n\n/g, '</p><p class="mb-4 text-zinc-300 leading-relaxed">')
            .replace(/\n/g, '<br/>');
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
                        href="/community/qna"
                        className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Q&A로 돌아가기
                    </Link>
                </motion.div>

                {/* 질문 섹션 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 md:p-8 mb-6"
                >
                    {/* 질문 헤더 */}
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 flex-shrink-0 bg-purple-500/20 rounded-full flex items-center justify-center">
                            <span className="text-purple-400 font-bold text-lg">Q</span>
                        </div>
                        <div className="flex-1">
                            {/* 카테고리 */}
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${CATEGORY_LABELS[post.category]?.color || 'bg-zinc-800 text-zinc-400'}`}>
                                    {CATEGORY_LABELS[post.category]?.label || post.category}
                                </span>
                            </div>

                            {/* 제목 */}
                            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                {post.title}
                            </h1>

                            {/* 질문자 정보 */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 mb-4">
                                <span className="flex items-center gap-1">
                                    <User className="w-4 h-4" />
                                    {post.author}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {formatDate(post.date)}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Eye className="w-4 h-4" />
                                    {post.views.toLocaleString()}
                                </span>
                                <span className="flex items-center gap-1">
                                    <ThumbsUp className="w-4 h-4" />
                                    {post.likes}
                                </span>
                                <span className="flex items-center gap-1">
                                    <MessageCircle className="w-4 h-4" />
                                    {post.commentCount}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 질문 내용 */}
                    <div className="pl-16">
                        <p className="text-zinc-300 leading-relaxed text-lg">
                            {post.content}
                        </p>
                    </div>
                </motion.div>

                {/* 답변 섹션 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-green-900/20 to-zinc-900/50 border border-green-500/30 rounded-2xl p-6 md:p-8"
                >
                    {/* 답변 헤더 */}
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 flex-shrink-0 bg-green-500/20 rounded-full flex items-center justify-center">
                            <span className="text-green-400 font-bold text-lg">A</span>
                        </div>
                        <div className="flex-1">
                            {/* 채택 뱃지 */}
                            <div className="flex items-center gap-2 mb-3">
                                <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm font-medium rounded-full flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4" />
                                    베스트 답변
                                </span>
                            </div>

                            {/* 답변자 정보 */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
                                <span className="flex items-center gap-1 text-green-400 font-medium">
                                    <User className="w-4 h-4" />
                                    {post.bestAnswer.author}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {formatDate(post.bestAnswer.date)}
                                </span>
                                <span className="flex items-center gap-1">
                                    <ThumbsUp className="w-4 h-4" />
                                    {post.bestAnswer.likes}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 답변 내용 */}
                    <div className="pl-16">
                        <div
                            className="prose prose-invert prose-zinc max-w-none text-zinc-300 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: `<p>${renderMarkdown(post.bestAnswer.content)}</p>` }}
                        />
                    </div>
                </motion.div>

                {/* 하단 네비게이션 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-8 flex flex-wrap gap-4"
                >
                    <Link
                        href="/community/qna"
                        className="inline-flex items-center gap-2 px-5 py-3 bg-zinc-800 text-white font-medium rounded-xl hover:bg-zinc-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        다른 질문 보기
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
