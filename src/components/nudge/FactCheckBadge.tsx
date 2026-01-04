'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Shield, Info } from 'lucide-react';

interface FactCheckBadgeProps {
    variant?: 'default' | 'compact';
    className?: string;
}

export default function FactCheckBadge({
    variant = 'default',
    className = ''
}: FactCheckBadgeProps) {
    const [showTooltip, setShowTooltip] = useState(false);

    if (variant === 'compact') {
        return (
            <div
                className={`relative inline-flex ${className}`}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            >
                <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full cursor-help">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    <span className="text-xs text-emerald-400 font-medium">검증됨</span>
                </div>

                <AnimatePresence>
                    {showTooltip && (
                        <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-50"
                        >
                            <p className="text-xs text-zinc-300">
                                최신 유전학 PDF 데이터베이스를 기반으로 검증된 답변입니다.
                            </p>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-zinc-800 border-r border-b border-zinc-700" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    return (
        <div
            className={`relative ${className}`}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 border border-emerald-500/30 rounded-xl cursor-help"
            >
                {/* Icon Container */}
                <div className="flex items-center justify-center w-10 h-10 bg-emerald-500/20 rounded-lg">
                    <Shield className="w-5 h-5 text-emerald-400" />
                </div>

                {/* Text */}
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-semibold text-emerald-400">
                            크레스티아 지식백과 검증됨
                        </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">
                        전문 브리더 & 학술 자료 기반 검증
                    </p>
                </div>

                {/* Info Icon */}
                <Info className="w-4 h-4 text-zinc-500" />
            </motion.div>

            {/* Tooltip */}
            <AnimatePresence>
                {showTooltip && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute top-full left-0 right-0 mt-2 p-4 bg-zinc-800/95 backdrop-blur-sm border border-zinc-700 rounded-xl shadow-xl z-50"
                    >
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <Shield className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-sm text-white font-medium mb-1">검증 정보</p>
                                <p className="text-xs text-zinc-400 leading-relaxed">
                                    이 답변은 <span className="text-emerald-400">최신 유전학 PDF 데이터베이스</span>를
                                    기반으로 검증되었습니다. 크레스티드 게코 전문 브리더와 학술 자료를 참고하여
                                    정확성을 확인했습니다.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
