'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import {
    getGeckoInsights,
    getMergedCareLogs,
    WeightLog,
    FeedingLog
} from '@/lib/care-data';
import { CareChart } from '@/components/manager/CareChart';
import { InsightCard } from '@/components/manager/InsightCard';
import { CareActionBar } from '@/components/manager/CareActionBar';
import { DataExportBtn } from '@/components/manager/DataExportBtn';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft,
    ChevronDown,
    Loader2,
    Plus,
    History,
    Scale,
    Utensils
} from 'lucide-react';
import { toast } from 'sonner';

interface Gecko {
    id: string;
    name: string;
    morph: string;
    image_url?: string;
}

/**
 * Empty State Action Bar - 게코가 없을 때도 급식/체중 버튼 표시
 * 클릭 시 게코 등록 페이지로 안내
 */
function EmptyStateActionBar({ locale }: { locale: string }) {
    const router = useRouter();

    const handleClick = () => {
        toast.info('먼저 게코를 등록해주세요! 🦎', {
            description: '급식/체중 기록을 위해 게코 정보가 필요합니다.',
            action: {
                label: '등록하기',
                onClick: () => router.push(`/${locale}/dashboard/add`)
            }
        });
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-black via-black/95 to-transparent pb-safe">
            <div className="max-w-lg mx-auto flex gap-3">
                {/* 체중 버튼 */}
                <Button
                    onClick={handleClick}
                    className="flex-1 h-14 bg-gradient-to-r from-[#D4AF37] to-[#b08d22] text-black font-bold text-base hover:from-[#b08d22] hover:to-[#8a6e1a] shadow-lg shadow-[#D4AF37]/20"
                >
                    <Scale className="w-5 h-5 mr-2" />
                    ⚖️ 체중 잴 시간
                </Button>

                {/* 급식 버튼 */}
                <Button
                    onClick={handleClick}
                    className="flex-1 h-14 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold text-base hover:from-emerald-700 hover:to-green-700 shadow-lg shadow-emerald-500/20"
                >
                    <Utensils className="w-5 h-5 mr-2" />
                    🦗 밥 줄 시간
                </Button>
            </div>
        </div>
    );
}

export default function ManagerDashboardPage() {
    const [geckos, setGeckos] = useState<Gecko[]>([]);
    const [selectedGecko, setSelectedGecko] = useState<Gecko | null>(null);
    const [showGeckoSelect, setShowGeckoSelect] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
    const [feedingLogs, setFeedingLogs] = useState<FeedingLog[]>([]);

    const supabase = createClient();
    const locale = useLocale();
    const router = useRouter();

    // 사용자의 게코 목록 조회
    useEffect(() => {
        const fetchGeckos = async () => {
            const { data: userData } = await supabase.auth.getUser();
            if (!userData.user) {
                router.push(`/${locale}/login`);
                return;
            }

            const { data, error } = await supabase
                .from('geckos')
                .select('id, name, morph, image_url')
                .eq('owner_id', userData.user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching geckos:', error);
                return;
            }

            setGeckos(data || []);
            if (data && data.length > 0) {
                setSelectedGecko(data[0]);
            }
            setIsLoading(false);
        };

        fetchGeckos();
    }, [supabase, router, locale]);

    // 선택된 게코의 케어 로그 조회
    const fetchCareLogs = useCallback(async () => {
        if (!selectedGecko) return;

        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        // 체중 로그
        const { data: weightData } = await supabase
            .from('weight_logs')
            .select('*')
            .eq('gecko_id', selectedGecko.id)
            .gte('measured_at', ninetyDaysAgo.toISOString())
            .order('measured_at', { ascending: true });

        // 급식 로그
        const { data: feedingData } = await supabase
            .from('feeding_logs')
            .select('*')
            .eq('gecko_id', selectedGecko.id)
            .gte('fed_at', ninetyDaysAgo.toISOString())
            .order('fed_at', { ascending: true });

        setWeightLogs(weightData || []);
        setFeedingLogs(feedingData || []);
    }, [selectedGecko, supabase]);

    useEffect(() => {
        fetchCareLogs();
    }, [fetchCareLogs]);

    // 데이터 병합 및 인사이트 계산
    const mergedData = getMergedCareLogs(weightLogs, feedingLogs);
    const insight = getGeckoInsights(weightLogs, feedingLogs);

    // 데이터 새로고침 핸들러
    const handleDataAdded = () => {
        fetchCareLogs();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
            </div>
        );
    }

    // 등록된 게코가 없는 경우 - 급식 버튼 포함
    if (geckos.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black py-12 pb-28">
                <div className="max-w-lg mx-auto px-4 text-center">
                    <div className="text-6xl mb-6">🦎</div>
                    <h1 className="text-2xl font-bold text-white mb-4">
                        등록된 게코가 없어요
                    </h1>
                    <p className="text-zinc-400 mb-8">
                        케어 대시보드를 사용하려면 먼저 게코를 등록해주세요.
                    </p>
                    <Button asChild className="bg-[#D4AF37] text-black hover:bg-[#b08d22]">
                        <Link href={`/${locale}/dashboard/add`}>
                            <Plus className="w-5 h-5 mr-2" />
                            게코 등록하기
                        </Link>
                    </Button>
                </div>

                {/* Empty State Action Bar - 게코 등록 유도 */}
                <EmptyStateActionBar locale={locale} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black pb-28">
            {/* Header */}
            <div className="sticky top-20 z-40 bg-black/90 backdrop-blur-md border-b border-zinc-800">
                <div className="max-w-2xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link
                            href={`/${locale}/dashboard`}
                            className="flex items-center gap-2 text-zinc-400 hover:text-[#D4AF37] transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="hidden sm:inline">대시보드</span>
                        </Link>

                        {/* 게코 선택 드롭다운 */}
                        <div className="relative">
                            <button
                                onClick={() => setShowGeckoSelect(!showGeckoSelect)}
                                className="flex items-center gap-3 px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-xl hover:border-[#D4AF37]/50 transition-all"
                            >
                                {selectedGecko?.image_url && (
                                    <img
                                        src={selectedGecko.image_url}
                                        alt={selectedGecko.name}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                )}
                                <div className="text-left">
                                    <div className="font-medium text-white">
                                        {selectedGecko?.name}
                                    </div>
                                    <div className="text-xs text-zinc-500">
                                        {selectedGecko?.morph}
                                    </div>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${showGeckoSelect ? 'rotate-180' : ''}`} />
                            </button>

                            {showGeckoSelect && (
                                <div className="absolute right-0 top-full mt-2 w-64 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl overflow-hidden z-50">
                                    {geckos.map((gecko) => (
                                        <button
                                            key={gecko.id}
                                            onClick={() => {
                                                setSelectedGecko(gecko);
                                                setShowGeckoSelect(false);
                                            }}
                                            className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 transition-colors ${selectedGecko?.id === gecko.id ? 'bg-zinc-800' : ''
                                                }`}
                                        >
                                            {gecko.image_url ? (
                                                <img
                                                    src={gecko.image_url}
                                                    alt={gecko.name}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-lg">
                                                    🦎
                                                </div>
                                            )}
                                            <div className="text-left">
                                                <div className="font-medium text-white">
                                                    {gecko.name}
                                                </div>
                                                <div className="text-xs text-zinc-500">
                                                    {gecko.morph}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            {selectedGecko && (
                                <DataExportBtn
                                    geckoId={selectedGecko.id}
                                    geckoName={selectedGecko.name}
                                    variant="compact"
                                />
                            )}
                            <Link
                                href={`/${locale}/manager/history`}
                                className="flex items-center gap-2 text-zinc-400 hover:text-[#D4AF37] transition-colors"
                            >
                                <History className="w-5 h-5" />
                                <span className="hidden sm:inline">기록</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
                {/* Page Title */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-[#D4AF37] font-serif">
                        🏥 케어 대시보드
                    </h1>
                    <p className="text-zinc-400 mt-1">
                        {selectedGecko?.name}의 성장과 급식을 한눈에
                    </p>
                </div>

                {/* Insight Card */}
                <InsightCard insight={insight} />

                {/* Care Chart */}
                <CareChart data={mergedData} />

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-center">
                        <div className="text-3xl mb-2">⚖️</div>
                        <div className="text-2xl font-bold text-white">
                            {weightLogs.length > 0
                                ? `${weightLogs[weightLogs.length - 1].weight}g`
                                : '-'
                            }
                        </div>
                        <div className="text-xs text-zinc-500 mt-1">
                            최근 체중
                        </div>
                    </div>
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-center">
                        <div className="text-3xl mb-2">🍽️</div>
                        <div className="text-2xl font-bold text-white">
                            {feedingLogs.length > 0
                                ? (() => {
                                    const lastFeeding = new Date(feedingLogs[feedingLogs.length - 1].fed_at);
                                    const daysAgo = Math.floor((Date.now() - lastFeeding.getTime()) / (1000 * 60 * 60 * 24));
                                    return daysAgo === 0 ? '오늘' : `${daysAgo}일 전`;
                                })()
                                : '-'
                            }
                        </div>
                        <div className="text-xs text-zinc-500 mt-1">
                            마지막 급식
                        </div>
                    </div>
                </div>

                {/* 최근 기록 */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                    <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                        <span>📋</span> 최근 기록
                    </h3>

                    {mergedData.length === 0 ? (
                        <p className="text-zinc-500 text-center py-4">
                            아직 기록이 없어요. 아래 버튼을 눌러 시작하세요!
                        </p>
                    ) : (
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {mergedData.slice(-5).reverse().map((log, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between px-3 py-2 bg-zinc-800/50 rounded-lg"
                                >
                                    <span className="text-sm text-zinc-400">
                                        {new Date(log.date).toLocaleDateString('ko-KR', {
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </span>
                                    <div className="flex items-center gap-3">
                                        {log.weight && (
                                            <span className="text-sm text-white">
                                                ⚖️ {log.weight}g
                                            </span>
                                        )}
                                        {log.feeding && (
                                            <span className="text-sm text-white">
                                                {log.feeding === 'insect' ? '🦗' : '🥣'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Action Bar */}
            {selectedGecko && (
                <CareActionBar
                    geckoId={selectedGecko.id}
                    geckoName={selectedGecko.name}
                    onDataAdded={handleDataAdded}
                />
            )}

            {/* Click outside to close dropdown */}
            {showGeckoSelect && (
                <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowGeckoSelect(false)}
                />
            )}
        </div>
    );
}
