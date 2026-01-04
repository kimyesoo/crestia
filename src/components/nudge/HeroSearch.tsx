'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, TrendingUp, Flame } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TrendingTag {
    label: string;
    emoji?: string;
}

const TRENDING_TAGS: TrendingTag[] = [
    { label: '릴리화이트', emoji: '🤍' },
    { label: '노멀', emoji: '🦎' },
    { label: '거식', emoji: '😰' },
    { label: '카푸치노', emoji: '☕' },
    { label: '할리퀸', emoji: '🎭' },
    { label: '탈피', emoji: '✨' },
];

export default function HeroSearch() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleTagClick = (tag: TrendingTag) => {
        setSearchQuery(tag.label);
        inputRef.current?.focus();
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/ko/community?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <section className="relative overflow-hidden py-20 px-4">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900 to-black" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-400/10 via-transparent to-transparent" />

            {/* Content */}
            <div className="relative z-10 max-w-3xl mx-auto text-center">
                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
                >
                    내 크레의 가치는?
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-lg md:text-xl text-zinc-400 mb-8"
                >
                    지금 바로 모프를 확인해보세요
                </motion.p>

                {/* Search Bar */}
                <motion.form
                    onSubmit={handleSearch}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative"
                >
                    <div className={`
            relative flex items-center bg-zinc-800/80 backdrop-blur-sm border rounded-2xl 
            transition-all duration-300 overflow-hidden
            ${isFocused ? 'border-gold-400 shadow-lg shadow-gold-400/20' : 'border-zinc-700'}
          `}>
                        <Search className="absolute left-4 w-5 h-5 text-zinc-400" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder="모프, 사육 팁, 유전학... 무엇이든 검색하세요"
                            className="w-full py-4 pl-12 pr-4 bg-transparent text-white placeholder-zinc-500 focus:outline-none text-lg"
                        />
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="absolute right-2 px-6 py-2 bg-gradient-to-r from-gold-400 to-amber-500 text-black font-semibold rounded-xl hover:from-gold-500 hover:to-amber-600 transition-all"
                        >
                            검색
                        </motion.button>
                    </div>
                </motion.form>

                {/* Trending Tags */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-6"
                >
                    <div className="flex items-center justify-center gap-2 text-zinc-500 mb-3">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-medium">실시간 인기 태그</span>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2">
                        {TRENDING_TAGS.map((tag, index) => (
                            <motion.button
                                key={tag.label}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleTagClick(tag)}
                                className="px-4 py-2 bg-zinc-800/60 hover:bg-zinc-700/80 border border-zinc-700 hover:border-gold-400/50 rounded-full text-sm text-zinc-300 hover:text-white transition-all duration-200 flex items-center gap-1.5"
                            >
                                <span>{tag.emoji}</span>
                                <span>#{tag.label}</span>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
