'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, FolderHeart, LogIn, X, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SaveToCollectionProps {
    isLoggedIn?: boolean;
    onSave?: () => void;
    variant?: 'floating' | 'inline' | 'bar';
    className?: string;
}

export default function SaveToCollection({
    isLoggedIn = false,
    onSave,
    variant = 'inline',
    className = '',
}: SaveToCollectionProps) {
    const [showModal, setShowModal] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const router = useRouter();

    const handleClick = () => {
        if (isLoggedIn) {
            setIsSaved(true);
            onSave?.();
        } else {
            setShowModal(true);
        }
    };

    const handleLogin = () => {
        setShowModal(false);
        router.push('/ko/login');
    };

    // Floating Button Style
    if (variant === 'floating') {
        return (
            <>
                <motion.button
                    onClick={handleClick}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`fixed bottom-24 right-4 z-30 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-gold-400 to-amber-500 text-black font-semibold rounded-full shadow-lg shadow-gold-400/30 hover:shadow-gold-400/50 transition-all ${className}`}
                >
                    {isSaved ? (
                        <>
                            <Bookmark className="w-5 h-5 fill-current" />
                            <span>저장됨!</span>
                        </>
                    ) : (
                        <>
                            <FolderHeart className="w-5 h-5" />
                            <span>스크랩</span>
                        </>
                    )}
                </motion.button>
                <LoginModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onLogin={handleLogin}
                />
            </>
        );
    }

    // Bottom Bar Style
    if (variant === 'bar') {
        return (
            <>
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    className={`fixed bottom-0 left-0 right-0 z-30 p-4 bg-zinc-900/95 backdrop-blur-sm border-t border-zinc-800 ${className}`}
                >
                    <div className="max-w-lg mx-auto">
                        <motion.button
                            onClick={handleClick}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-semibold transition-all ${isSaved
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-gradient-to-r from-gold-400 to-amber-500 text-black hover:from-gold-500 hover:to-amber-600'
                                }`}
                        >
                            {isSaved ? (
                                <>
                                    <Bookmark className="w-5 h-5 fill-current" />
                                    <span>내 도감에 저장됨!</span>
                                </>
                            ) : (
                                <>
                                    <FolderHeart className="w-5 h-5" />
                                    <span>📂 이 꿀팁, 내 도감에 스크랩하기</span>
                                </>
                            )}
                        </motion.button>
                    </div>
                </motion.div>
                <LoginModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onLogin={handleLogin}
                />
            </>
        );
    }

    // Inline Button (Default)
    return (
        <>
            <motion.button
                onClick={handleClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${isSaved
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 hover:border-gold-400/50'
                    } ${className}`}
            >
                {isSaved ? (
                    <>
                        <Bookmark className="w-5 h-5 fill-current" />
                        <span>저장됨!</span>
                    </>
                ) : (
                    <>
                        <FolderHeart className="w-5 h-5" />
                        <span>📂 내 도감에 스크랩</span>
                    </>
                )}
            </motion.button>
            <LoginModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onLogin={handleLogin}
            />
        </>
    );
}

// Login Modal Component
function LoginModal({
    isOpen,
    onClose,
    onLogin,
}: {
    isOpen: boolean;
    onClose: () => void;
    onLogin: () => void;
}) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-6 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Warning Icon */}
                        <div className="flex justify-center mb-4">
                            <div className="p-4 bg-amber-500/10 rounded-full">
                                <AlertTriangle className="w-8 h-8 text-amber-500" />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-bold text-white mb-2">
                                잠깐! 이대로 나가시면...
                            </h3>
                            <p className="text-zinc-400">
                                지금 보신 <span className="text-gold-400 font-medium">꿀팁 정보가 사라집니다</span> 😢
                            </p>
                            <p className="text-zinc-500 text-sm mt-2">
                                로그인하고 영구 소장하세요!
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="space-y-3">
                            <motion.button
                                onClick={onLogin}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-gold-400 to-amber-500 text-black font-semibold rounded-xl hover:from-gold-500 hover:to-amber-600 transition-all"
                            >
                                <LogIn className="w-5 h-5" />
                                <span>로그인하고 저장하기</span>
                            </motion.button>

                            <button
                                onClick={onClose}
                                className="w-full py-3 text-zinc-400 hover:text-white transition-colors text-sm"
                            >
                                나중에 할게요
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
