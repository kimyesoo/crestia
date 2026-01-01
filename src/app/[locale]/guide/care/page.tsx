'use client';

import { BookOpen, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

// 메인 페이지 컴포넌트
export default function CareGuidePage() {
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
                        전문 사육 정보
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
                        크레스티드 게코 전문 사육 정보를 만나보세요
                    </motion.p>
                </div>

                {/* 빈 상태 표시 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center py-20"
                >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                        <FileText className="w-10 h-10 text-zinc-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-zinc-300 mb-2">
                        전문 콘텐츠 준비 중
                    </h3>
                    <p className="text-zinc-500 max-w-md mx-auto">
                        전문가의 검증된 사육 지식이 곧 업로드될 예정입니다.<br />
                        더 나은 정보를 제공하기 위해 준비 중입니다.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
