'use client';

// npm install xlsx 필요
import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Plus,
    CreditCard,
    Calculator,
    Sparkles,
    TrendingUp,
    Calendar,
    Egg,
    Baby,
    Heart,
    ChevronRight,
    X,
    FileSpreadsheet
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import * as XLSX from 'xlsx';

// Types
interface Gecko {
    id: string;
    name: string;
    morph: string;
    gender: 'male' | 'female' | 'unknown';
    value: number;
    hatchDate?: string;
}

interface BreedingSchedule {
    id: string;
    matingDate: string;
    sireName: string;
    damName: string;
}

// Sample data for demo purposes
const SAMPLE_GECKOS: Gecko[] = [
    { id: '1', name: 'Goldie', morph: 'Lilly White', gender: 'female', value: 3500000 },
    { id: '2', name: 'Shadow', morph: 'Dark Base', gender: 'male', value: 2800000 },
    { id: '3', name: 'Sunset', morph: 'Super Dalmatian', gender: 'female', value: 4200000 },
    { id: '4', name: 'Pearl', morph: 'Lilly White', gender: 'female', value: 2700000 },
    { id: '5', name: 'Thunder', morph: 'Harlequin', gender: 'male', value: 2000000 },
];

const SAMPLE_SCHEDULE: BreedingSchedule[] = [
    { id: '1', matingDate: '2025-01-15', sireName: 'Thunder', damName: 'Goldie' },
];

// Color palette for charts
const CHART_COLORS = ['#D4AF37', '#8B7355', '#C5A028', '#B08D22', '#FCF6BA'];

export default function MyRoomPage() {
    const [user, setUser] = useState<User | null>(null);
    const [geckos, setGeckos] = useState<Gecko[]>([]);
    const [schedules, setSchedules] = useState<BreedingSchedule[]>([]);
    const [showMatingModal, setShowMatingModal] = useState(false);
    const [newMating, setNewMating] = useState({ date: '', sire: '', dam: '' });
    const locale = useLocale();
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();

        // Load data from localStorage or use sample data
        const savedGeckos = localStorage.getItem('my_geckos');
        const savedSchedules = localStorage.getItem('breeding_schedules');

        setGeckos(savedGeckos ? JSON.parse(savedGeckos) : SAMPLE_GECKOS);
        setSchedules(savedSchedules ? JSON.parse(savedSchedules) : SAMPLE_SCHEDULE);
    }, [supabase.auth]);

    // Calculate stats
    const totalValue = geckos.reduce((sum, g) => sum + g.value, 0);
    const maleCount = geckos.filter(g => g.gender === 'male').length;
    const femaleCount = geckos.filter(g => g.gender === 'female').length;
    const unknownCount = geckos.filter(g => g.gender === 'unknown').length;

    // Calculate morph distribution for chart
    const morphDistribution = geckos.reduce((acc, gecko) => {
        const morph = gecko.morph || '미분류';
        acc[morph] = (acc[morph] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(morphDistribution).map(([name, value]) => ({
        name,
        value,
        percentage: Math.round((value / geckos.length) * 100)
    }));

    // Calculate D-Day for breeding schedules
    const getBreedingDays = (matingDate: string) => {
        const mating = new Date(matingDate);
        const today = new Date();
        const layingDate = new Date(mating.getTime() + 30 * 24 * 60 * 60 * 1000);
        const hatchDate = new Date(layingDate.getTime() + 60 * 24 * 60 * 60 * 1000);

        const daysToLaying = Math.ceil((layingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        const daysToHatch = Math.ceil((hatchDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        return { daysToLaying, daysToHatch, layingDate, hatchDate };
    };

    // Add new mating schedule
    const handleAddMating = () => {
        if (!newMating.date || !newMating.sire || !newMating.dam) return;

        const newSchedule: BreedingSchedule = {
            id: Date.now().toString(),
            matingDate: newMating.date,
            sireName: newMating.sire,
            damName: newMating.dam,
        };

        const updatedSchedules = [...schedules, newSchedule];
        setSchedules(updatedSchedules);
        localStorage.setItem('breeding_schedules', JSON.stringify(updatedSchedules));
        setNewMating({ date: '', sire: '', dam: '' });
        setShowMatingModal(false);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW',
            maximumFractionDigits: 0
        }).format(value);
    };

    // Excel 내보내기 함수
    const handleDownloadExcel = () => {
        // ===== 시트 1: 게코 목록 =====
        const geckoHeaders = ['이름', '모프', '성별', '생년월일', '가치(원)'];
        const geckoData = geckos.map(gecko => ([
            gecko.name,
            gecko.morph,
            gecko.gender === 'male' ? '수컷' : gecko.gender === 'female' ? '암컷' : '미구분',
            gecko.hatchDate || '-',
            gecko.value
        ]));
        const wsGeckos = XLSX.utils.aoa_to_sheet([geckoHeaders, ...geckoData]);
        wsGeckos['!cols'] = [
            { wch: 15 }, // 이름
            { wch: 20 }, // 모프
            { wch: 10 }, // 성별
            { wch: 12 }, // 생년월일
            { wch: 15 }, // 가치
        ];

        // ===== 시트 2: 브리딩 스케줄 =====
        const scheduleHeaders = ['수컷(Sire)', '암컷(Dam)', '메이팅일', '산란예정일', '부화예정일', '산란까지', '부화까지'];
        const scheduleData = schedules.map(schedule => {
            const { daysToLaying, daysToHatch, layingDate, hatchDate } = getBreedingDays(schedule.matingDate);
            return [
                schedule.sireName,
                schedule.damName,
                schedule.matingDate,
                layingDate.toLocaleDateString('ko-KR'),
                hatchDate.toLocaleDateString('ko-KR'),
                daysToLaying <= 0 ? 'D-Day!' : `D-${daysToLaying}`,
                daysToHatch <= 0 ? 'D-Day!' : `D-${daysToHatch}`
            ];
        });
        const wsSchedules = XLSX.utils.aoa_to_sheet([scheduleHeaders, ...scheduleData]);
        wsSchedules['!cols'] = [
            { wch: 15 }, // 수컷
            { wch: 15 }, // 암컷
            { wch: 12 }, // 메이팅일
            { wch: 14 }, // 산란예정
            { wch: 14 }, // 부화예정
            { wch: 10 }, // D-Day
            { wch: 10 }, // D-Day
        ];

        // 워크북 생성 (2개의 시트)
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, wsGeckos, '내 게코 목록');
        XLSX.utils.book_append_sheet(wb, wsSchedules, '브리딩 스케줄');

        // 파일명 생성 (날짜 포함)
        const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const fileName = `Crestia_Backup_${today}.xlsx`;

        // 다운로드
        XLSX.writeFile(wb, fileName);
    };

    return (
        <div className="min-h-screen bg-black">
            <Navbar user={user} />

            <div className="pt-24 pb-20 px-4 max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                <span className="text-[#D4AF37]">My</span> Breeding Room
                            </h1>
                            <p className="text-zinc-500 text-sm">
                                {user ? `안녕하세요, ${user.email?.split('@')[0]}님` : '로그인하면 나만의 대시보드를 사용할 수 있어요'}
                            </p>
                        </div>
                        {/* Excel Export Button */}
                        <Button
                            onClick={handleDownloadExcel}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                        >
                            <FileSpreadsheet className="w-4 h-4 mr-2 md:mr-2" />
                            <span className="hidden md:inline">엑셀로 내보내기</span>
                            <span className="md:hidden">내보내기</span>
                        </Button>
                    </div>
                    {!user && (
                        <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400 text-sm">
                            <Sparkles className="w-4 h-4" />
                            미리보기 모드 - 샘플 데이터로 체험 중입니다
                        </div>
                    )}
                </div>

                {/* Portfolio Summary */}
                <Card className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-zinc-800 mb-6">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
                            총 자산 가치
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            {/* Value Display */}
                            <div>
                                <p className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                                    {formatCurrency(totalValue)}
                                </p>
                                <div className="flex items-center gap-4 mt-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                                        <span className="text-zinc-400 text-sm">수컷 {maleCount}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-pink-500" />
                                        <span className="text-zinc-400 text-sm">암컷 {femaleCount}</span>
                                    </div>
                                    {unknownCount > 0 && (
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-zinc-500" />
                                            <span className="text-zinc-400 text-sm">미구분 {unknownCount}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Donut Chart */}
                            <div className="w-full lg:w-64 h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={40}
                                            outerRadius={70}
                                            paddingAngle={2}
                                            dataKey="value"
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    return (
                                                        <div className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm">
                                                            <p className="text-white">{payload[0].payload.name}</p>
                                                            <p className="text-[#D4AF37]">{payload[0].payload.percentage}%</p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Legend
                                            verticalAlign="middle"
                                            align="right"
                                            layout="vertical"
                                            formatter={(value) => (
                                                <span className="text-zinc-400 text-xs">{value}</span>
                                            )}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Link href={`/${locale}/dashboard/geckos/new`}>
                        <Card className="bg-zinc-900/50 border-zinc-800 hover:border-[#D4AF37]/50 transition-colors cursor-pointer h-full">
                            <CardContent className="flex items-center gap-4 p-4">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                    <Plus className="w-6 h-6 text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-white font-medium">개체 추가하기</p>
                                    <p className="text-zinc-500 text-sm">새로운 게코 등록</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-zinc-600 ml-auto" />
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href={`/${locale}/card`}>
                        <Card className="bg-zinc-900/50 border-zinc-800 hover:border-[#D4AF37]/50 transition-colors cursor-pointer h-full">
                            <CardContent className="flex items-center gap-4 p-4">
                                <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center">
                                    <CreditCard className="w-6 h-6 text-[#D4AF37]" />
                                </div>
                                <div>
                                    <p className="text-white font-medium">ID 카드 만들기</p>
                                    <p className="text-zinc-500 text-sm">프리미엄 카드 생성</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-zinc-600 ml-auto" />
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href={`/${locale}/tools/calculator`}>
                        <Card className="bg-zinc-900/50 border-zinc-800 hover:border-[#D4AF37]/50 transition-colors cursor-pointer h-full">
                            <CardContent className="flex items-center gap-4 p-4">
                                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                    <Calculator className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-white font-medium">가상 배합 돌려보기</p>
                                    <p className="text-zinc-500 text-sm">2세 모프 예측</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-zinc-600 ml-auto" />
                            </CardContent>
                        </Card>
                    </Link>
                </div>

                {/* Breeding Scheduler */}
                <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-[#D4AF37]" />
                            브리딩 스케줄러
                        </CardTitle>
                        <Button
                            onClick={() => setShowMatingModal(true)}
                            size="sm"
                            className="bg-[#D4AF37] hover:bg-[#C5A028] text-black"
                        >
                            <Heart className="w-4 h-4 mr-1" />
                            메이팅 등록
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {schedules.length === 0 ? (
                            <div className="text-center py-8">
                                <Calendar className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                                <p className="text-zinc-500">등록된 스케줄이 없습니다</p>
                                <p className="text-zinc-600 text-sm mt-1">메이팅을 등록하면 산란/부화 예정일을 자동 계산해드려요</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {schedules.map((schedule) => {
                                    const { daysToLaying, daysToHatch, layingDate, hatchDate } = getBreedingDays(schedule.matingDate);

                                    return (
                                        <div key={schedule.id} className="bg-zinc-800/50 rounded-xl p-4">
                                            {/* Pairing Info */}
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="text-blue-400">♂ {schedule.sireName}</span>
                                                <Heart className="w-4 h-4 text-pink-400" />
                                                <span className="text-pink-400">♀ {schedule.damName}</span>
                                            </div>

                                            {/* Timeline */}
                                            <div className="relative">
                                                <div className="absolute left-[15px] top-6 bottom-6 w-0.5 bg-zinc-700" />

                                                {/* Mating */}
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center z-10">
                                                        <Heart className="w-4 h-4 text-pink-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-zinc-400 text-sm">메이팅</p>
                                                        <p className="text-white text-sm">{schedule.matingDate}</p>
                                                    </div>
                                                    <div className="text-zinc-500 text-sm">완료</div>
                                                </div>

                                                {/* Laying */}
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center z-10">
                                                        <Egg className="w-4 h-4 text-amber-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-zinc-400 text-sm">산란 예정</p>
                                                        <p className="text-white text-sm">{layingDate.toLocaleDateString('ko-KR')}</p>
                                                    </div>
                                                    <div className={`text-sm font-bold ${daysToLaying <= 0 ? 'text-emerald-400' : daysToLaying <= 7 ? 'text-amber-400' : 'text-zinc-400'}`}>
                                                        {daysToLaying <= 0 ? 'D-Day!' : `D-${daysToLaying}`}
                                                    </div>
                                                </div>

                                                {/* Hatching */}
                                                <div className="flex items-center gap-4">
                                                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center z-10">
                                                        <Baby className="w-4 h-4 text-emerald-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-zinc-400 text-sm">부화 예정</p>
                                                        <p className="text-white text-sm">{hatchDate.toLocaleDateString('ko-KR')}</p>
                                                    </div>
                                                    <div className={`text-sm font-bold ${daysToHatch <= 0 ? 'text-emerald-400' : daysToHatch <= 7 ? 'text-amber-400' : 'text-zinc-400'}`}>
                                                        {daysToHatch <= 0 ? 'D-Day!' : `D-${daysToHatch}`}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Mating Registration Modal */}
            {showMatingModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                                <Heart className="w-5 h-5 text-pink-400" />
                                메이팅 등록
                            </CardTitle>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowMatingModal(false)}
                                className="text-zinc-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-zinc-400 text-sm mb-2 block">메이팅 날짜</label>
                                <Input
                                    type="date"
                                    value={newMating.date}
                                    onChange={(e) => setNewMating({ ...newMating, date: e.target.value })}
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                />
                            </div>
                            <div>
                                <label className="text-zinc-400 text-sm mb-2 block">수컷 (Sire) 이름</label>
                                <Input
                                    value={newMating.sire}
                                    onChange={(e) => setNewMating({ ...newMating, sire: e.target.value })}
                                    placeholder="예: Thunder"
                                    className="bg-zinc-800 border-zinc-700"
                                />
                            </div>
                            <div>
                                <label className="text-zinc-400 text-sm mb-2 block">암컷 (Dam) 이름</label>
                                <Input
                                    value={newMating.dam}
                                    onChange={(e) => setNewMating({ ...newMating, dam: e.target.value })}
                                    placeholder="예: Goldie"
                                    className="bg-zinc-800 border-zinc-700"
                                />
                            </div>
                            <Button
                                onClick={handleAddMating}
                                className="w-full bg-[#D4AF37] hover:bg-[#C5A028] text-black font-bold"
                                disabled={!newMating.date || !newMating.sire || !newMating.dam}
                            >
                                등록하기
                            </Button>
                            <p className="text-zinc-500 text-xs text-center">
                                * 산란 예정일: 메이팅 + 30일 / 부화 예정일: 산란 + 60일로 자동 계산됩니다
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
