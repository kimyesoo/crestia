'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, X, Filter, Dna, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// 최종 모프 사전 import
import { MORPH_DICTIONARY, MorphDef } from '@/constants/morph_data_final';

// 유전 타입 정의
const GENETIC_TYPES = {
    all: { label: '전체', labelEn: 'All', color: 'bg-zinc-700 text-zinc-300' },
    recessive: { label: '열성', labelEn: 'Recessive', color: 'bg-red-500/20 text-red-400 border border-red-500/30' },
    'incomplete-dominant': { label: '불완전우성', labelEn: 'Inc. Dominant', color: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
    dominant: { label: '우성', labelEn: 'Dominant', color: 'bg-green-500/20 text-green-400 border border-green-500/30' },
    polygenic: { label: '다인자', labelEn: 'Polygenic', color: 'bg-purple-500/20 text-purple-400 border border-purple-500/30' },
    combination: { label: '콤보', labelEn: 'Combination', color: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' },
    other: { label: '기타', labelEn: 'Other', color: 'bg-zinc-500/20 text-zinc-400 border border-zinc-500/30' },
};

// 모프 이름과 타입 파싱 함수
function parseMorphName(rawName: string): { name: string; type: string; availability: string } {
    // 예: "Lilly White Incomplete Dominant 2010 First produced in 2010 Common Common Availability"
    const parts = rawName.split(' ');

    // 유전 타입 키워드
    const typeKeywords = ['Recessive', 'Dominant', 'Polygenic', 'Other', 'Physical'];
    const availabilityKeywords = ['Rarest', 'Lower', 'Average', 'Common', 'Higher'];

    let typeIndex = -1;
    let type = '';

    // 유전 타입 찾기
    for (let i = 0; i < parts.length; i++) {
        if (parts[i] === 'Incomplete' && parts[i + 1] === 'Dominant') {
            typeIndex = i;
            type = 'Incomplete Dominant';
            break;
        }
        if (typeKeywords.includes(parts[i])) {
            typeIndex = i;
            type = parts[i];
            break;
        }
    }

    // 이름 추출 (타입 이전까지)
    const name = typeIndex > 0 ? parts.slice(0, typeIndex).join(' ') : parts[0];

    // 가용성 추출
    let availability = 'Common';
    for (const keyword of availabilityKeywords) {
        if (rawName.includes(keyword)) {
            availability = keyword;
            break;
        }
    }

    return { name, type, availability };
}

// 타입을 필터 키로 변환
function getTypeKey(type: string): string {
    const lower = type.toLowerCase();
    if (lower.includes('incomplete')) return 'incomplete-dominant';
    if (lower.includes('recessive')) return 'recessive';
    if (lower.includes('dominant')) return 'dominant';
    if (lower.includes('polygenic')) return 'polygenic';
    return 'other';
}

// 모프 카드 컴포넌트 (Link로 페이지 이동)
function MorphCard({ morph }: { morph: MorphDef }) {
    const typeKey = getTypeKey(morph.type);
    const typeInfo = GENETIC_TYPES[typeKey as keyof typeof GENETIC_TYPES] || GENETIC_TYPES.other;

    return (
        <Link href={`/guide/morphs/${morph.id}`}>
            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -4 }}
                className="group bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden cursor-pointer hover:border-gold-500/50 hover:shadow-lg hover:shadow-gold-500/10 transition-all duration-300 h-full"
            >
                {/* 이미지 영역 */}
                {morph.imageUrl ? (
                    <div className="relative w-full h-40 overflow-hidden bg-zinc-800">
                        <img
                            src={morph.imageUrl}
                            alt={morph.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                    </div>
                ) : (
                    <div className="w-full h-32 bg-gradient-to-br from-gold-500/10 to-zinc-800 flex items-center justify-center">
                        <Dna className="w-12 h-12 text-gold-500/50" />
                    </div>
                )}

                <div className="p-5">
                    {/* 모프 이름 */}
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-gold-500 transition-colors">
                        {morph.name}
                    </h3>

                    {/* 유전 타입 뱃지 */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${typeInfo.color}`}>
                            {typeInfo.label}
                        </span>
                        {morph.tags.slice(0, 2).map((tag, idx) => (
                            <span key={idx} className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-400">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* 요약 */}
                    <p className="text-sm text-zinc-500 line-clamp-2">
                        {morph.summary || `${morph.name} 모프에 대한 상세 정보를 확인하세요.`}
                    </p>
                </div>
            </motion.div>
        </Link>
    );
}

// 메인 페이지 컴포넌트
export default function MorphsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');

    // 필터링된 모프 목록
    const filteredMorphs = useMemo(() => {
        return MORPH_DICTIONARY.filter((morph: MorphDef) => {
            const typeKey = getTypeKey(morph.type);

            // 검색 필터
            const matchesSearch = morph.name.toLowerCase().includes(searchQuery.toLowerCase());

            // 타입 필터
            const matchesType = activeFilter === 'all' || typeKey === activeFilter;

            return matchesSearch && matchesType;
        });
    }, [searchQuery, activeFilter]);

    // 타입별 개수 계산
    const typeCounts = useMemo(() => {
        const counts: Record<string, number> = { all: MORPH_DICTIONARY.length };
        MORPH_DICTIONARY.forEach((morph: MorphDef) => {
            const typeKey = getTypeKey(morph.type);
            counts[typeKey] = (counts[typeKey] || 0) + 1;
        });
        return counts;
    }, []);

    return (
        <div className="min-h-screen bg-black text-white pt-28 pb-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                {/* 헤더 */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/10 border border-gold-500/30 rounded-full text-gold-500 text-sm font-medium mb-4"
                    >
                        <Sparkles className="w-4 h-4" />
                        총 {MORPH_DICTIONARY.length}개 모프 수록
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent"
                    >
                        모프 도감
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-3 text-zinc-400 text-lg"
                    >
                        크레스티드 게코의 다양한 모프와 유전 정보를 탐색하세요
                    </motion.p>
                </div>

                {/* 검색 및 필터 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8 space-y-4"
                >
                    {/* 검색바 */}
                    <div className="relative max-w-md mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="모프 이름 검색..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {/* 필터 탭 */}
                    <div className="flex flex-wrap justify-center gap-2">
                        {Object.entries(GENETIC_TYPES).map(([key, info]) => (
                            <button
                                key={key}
                                onClick={() => setActiveFilter(key)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === key
                                    ? 'bg-gold-500 text-black'
                                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                                    }`}
                            >
                                {info.label}
                                <span className="ml-1.5 text-xs opacity-70">
                                    ({typeCounts[key] || 0})
                                </span>
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* 결과 카운트 */}
                <div className="flex items-center gap-2 mb-6 text-sm text-zinc-500">
                    <Filter className="w-4 h-4" />
                    <span>{filteredMorphs.length}개 결과</span>
                </div>

                {/* 모프 그리드 */}
                {filteredMorphs.length > 0 ? (
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredMorphs.map((morph) => (
                                <MorphCard
                                    key={morph.id}
                                    morph={morph}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
                            <Search className="w-8 h-8 text-zinc-600" />
                        </div>
                        <p className="text-zinc-500">검색 결과가 없습니다</p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setActiveFilter('all');
                            }}
                            className="mt-4 text-gold-500 hover:underline"
                        >
                            필터 초기화
                        </button>
                    </div>
                )}

                {/* 출처 표시 */}
                <div className="mt-12 pt-8 border-t border-zinc-800 text-center text-sm text-zinc-500">
                    <p>모프 데이터: {MORPH_DICTIONARY.length}개 수록</p>
                </div>
            </div>
        </div>
    );
}
