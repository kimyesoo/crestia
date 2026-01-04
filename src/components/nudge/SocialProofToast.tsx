'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Eye } from 'lucide-react';

interface SocialProofToastProps {
    minViewers?: number;
    maxViewers?: number;
    showDelay?: number;
    hideDelay?: number;
}

export default function SocialProofToast({
    minViewers = 5,
    maxViewers = 30,
    showDelay = 2000,
    hideDelay = 5000,
}: SocialProofToastProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [viewerCount, setViewerCount] = useState(0);

    useEffect(() => {
        // Generate random viewer count
        const count = Math.floor(Math.random() * (maxViewers - minViewers + 1)) + minViewers;
        setViewerCount(count);

        // Show toast after delay
        const showTimer = setTimeout(() => {
            setIsVisible(true);
        }, showDelay);

        // Hide toast after showing
        const hideTimer = setTimeout(() => {
            setIsVisible(false);
        }, showDelay + hideDelay);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
        };
    }, [minViewers, maxViewers, showDelay, hideDelay]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, x: 100, y: 0 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="fixed bottom-24 right-4 z-40 max-w-xs"
                >
                    <div className="flex items-center gap-3 px-4 py-3 bg-zinc-800/95 backdrop-blur-sm border border-zinc-700 rounded-xl shadow-lg">
                        {/* Pulsing indicator */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-25" />
                            <div className="relative w-3 h-3 bg-green-400 rounded-full" />
                        </div>

                        {/* Icon */}
                        <div className="p-2 bg-gold-400/10 rounded-lg">
                            <Eye className="w-4 h-4 text-gold-400" />
                        </div>

                        {/* Message */}
                        <div className="flex-1">
                            <p className="text-sm text-white">
                                현재 <span className="font-bold text-gold-400">{viewerCount}명</span>의 집사님이
                            </p>
                            <p className="text-xs text-zinc-400">이 정보를 보고 있습니다</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
