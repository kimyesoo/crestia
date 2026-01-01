'use client';

import { useState, useMemo } from 'react';
import { ArrowLeft, Dna, Calculator, AlertTriangle, Skull, Sparkles, TrendingUp, Baby, Crown, Flame, Shield, Palette, Coins, Zap } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {
    calculateGenetics,
    PRESET_PROFILES,
    type GeneticProfile,
    type CalculationResult,
    type TierType,
    type WarningType,
} from '@/lib/genetics/calculateGenetics';
import { AdSenseBanner } from '@/components/ads/AdSenseBanner';

// ============================================
// UI COMPONENTS
// ============================================

const TIER_CONFIG: Record<TierType, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
    entry: { label: 'Entry', color: 'text-zinc-400', bgColor: 'bg-zinc-800', icon: <Baby className="w-3 h-3" /> },
    high: { label: 'High', color: 'text-blue-400', bgColor: 'bg-blue-900/30', icon: <TrendingUp className="w-3 h-3" /> },
    elite: { label: 'Elite', color: 'text-purple-400', bgColor: 'bg-purple-900/30', icon: <Sparkles className="w-3 h-3" /> },
    apex: { label: 'Apex', color: 'text-[#D4AF37]', bgColor: 'bg-[#D4AF37]/20', icon: <Crown className="w-3 h-3" /> },
};

const WARNING_CONFIG: Record<WarningType, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
    lethal: { label: '☠️ 치사', color: 'text-red-400', bgColor: 'bg-red-900/30', icon: <Skull className="w-3 h-3" /> },
    health_risk: { label: '⚠️ 기형 위험', color: 'text-amber-400', bgColor: 'bg-amber-900/30', icon: <AlertTriangle className="w-3 h-3" /> },
    normal_zero: { label: '🧬 꽝 없음', color: 'text-emerald-400', bgColor: 'bg-emerald-900/30', icon: <Zap className="w-3 h-3" /> },
    investment: { label: '💰 투자 가치', color: 'text-[#D4AF37]', bgColor: 'bg-[#D4AF37]/20', icon: <Coins className="w-3 h-3" /> },
    hot: { label: '🔥 인기', color: 'text-orange-400', bgColor: 'bg-orange-900/30', icon: <Flame className="w-3 h-3" /> },
};

function ResultCard({ result }: { result: CalculationResult['offspring'][number] }) {
    const tierInfo = TIER_CONFIG[result.tier];
    const isLethal = result.warnings.includes('lethal');
    const isHealthRisk = result.warnings.includes('health_risk');

    return (
        <div className={`relative p-4 rounded-xl border ${isLethal ? 'border-red-500/50 bg-red-950/20' :
            isHealthRisk ? 'border-amber-500/50 bg-amber-950/20' :
                'border-zinc-800 bg-zinc-900/50'
            }`}>
            {/* Tier Badge */}
            <div className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${tierInfo.bgColor} ${tierInfo.color}`}>
                {tierInfo.icon}
                {tierInfo.label}
            </div>

            <div className="flex items-start gap-4">
                {/* Color Indicator */}
                <div
                    className="w-14 h-14 rounded-lg flex-shrink-0 border border-zinc-700 shadow-lg"
                    style={{ backgroundColor: result.color }}
                />

                <div className="flex-1 min-w-0 pr-16">
                    {/* Header */}
                    <div className="mb-2">
                        <h4 className="font-bold text-white text-lg">{result.koreanName}</h4>
                        <p className="text-xs text-zinc-500">{result.name}</p>
                    </div>

                    {/* Probability */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className={`text-3xl font-bold ${isLethal ? 'text-red-400' :
                            isHealthRisk ? 'text-amber-400' :
                                'text-[#D4AF37]'
                            }`}>
                            {result.probability}%
                        </span>
                    </div>

                    {/* Warning Tags */}
                    {result.warnings.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                            {result.warnings.map(warning => {
                                const config = WARNING_CONFIG[warning];
                                return (
                                    <span
                                        key={warning}
                                        className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${config.bgColor} ${config.color}`}
                                    >
                                        {config.icon}
                                        {config.label}
                                    </span>
                                );
                            })}
                        </div>
                    )}

                    {/* Description */}
                    <p className="text-sm text-zinc-400">{result.description}</p>

                    {/* Genotype */}
                    <p className="text-xs text-zinc-600 mt-2 font-mono bg-zinc-800/50 px-2 py-1 rounded inline-block">
                        {result.genotype}
                    </p>
                </div>
            </div>
        </div>
    );
}

function ParentSelector({
    title,
    gender,
    profile,
    onChange
}: {
    title: string;
    gender: 'male' | 'female';
    profile: GeneticProfile;
    onChange: (profile: GeneticProfile) => void;
}) {
    const genderIcon = gender === 'male' ? '♂' : '♀';
    const genderBg = gender === 'male' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(236, 72, 153, 0.2)';
    const genderBorder = gender === 'male' ? 'rgba(59, 130, 246, 0.5)' : 'rgba(236, 72, 153, 0.5)';

    const applyPreset = (presetKey: string) => {
        const preset = PRESET_PROFILES[presetKey];
        if (preset) {
            onChange(preset.profile);
        }
    };

    return (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <div className="text-center mb-4">
                <div
                    className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3"
                    style={{ backgroundColor: genderBg, border: `2px solid ${genderBorder}` }}
                >
                    <span className="text-3xl">{genderIcon}</span>
                </div>
                <h3 className="font-bold text-white">{title}</h3>
                <p className="text-xs text-zinc-500">{gender === 'male' ? 'Sire' : 'Dam'}</p>
            </div>

            {/* Quick Presets */}
            <div className="mb-4">
                <label className="text-xs text-zinc-400 mb-2 block">⚡ 퀵 프리셋</label>
                <Select onValueChange={applyPreset}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-xs">
                        <SelectValue placeholder="빠른 선택..." />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(PRESET_PROFILES).map(([key, { label }]) => (
                            <SelectItem key={key} value={key} className="text-xs">{label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="border-t border-zinc-800 pt-4 space-y-3">
                {/* Lilly White */}
                <div>
                    <label className="text-xs text-zinc-400 mb-1 block">🌸 릴리 화이트 (불완전 우성)</label>
                    <Select value={profile.lilly} onValueChange={(v) => onChange({ ...profile, lilly: v as any })}>
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-sm">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="lilly">Lilly White</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Complex */}
                <div>
                    <label className="text-xs text-zinc-400 mb-1 block">☕ 카푸치노 콤플렉스 (대립유전자)</label>
                    <Select value={profile.complex} onValueChange={(v) => onChange({ ...profile, complex: v as any })}>
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-sm">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="cappuccino">Cappuccino</SelectItem>
                            <SelectItem value="sable">Sable</SelectItem>
                            <SelectItem value="super_cappuccino">Super Cappuccino (멜라니스틱)</SelectItem>
                            <SelectItem value="super_sable">Super Sable</SelectItem>
                            <SelectItem value="luwak">Luwak (Capp+Sable)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Axanthic */}
                <div>
                    <label className="text-xs text-zinc-400 mb-1 block">🔮 아잔틱 (열성)</label>
                    <Select value={profile.axanthic} onValueChange={(v) => onChange({ ...profile, axanthic: v as any })}>
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-sm">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="het">Het (보인자)</SelectItem>
                            <SelectItem value="visual">Visual (발현)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Phantom */}
                <div>
                    <label className="text-xs text-zinc-400 mb-1 block">👻 팬텀 (열성)</label>
                    <Select value={profile.phantom} onValueChange={(v) => onChange({ ...profile, phantom: v as any })}>
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-sm">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="het">Het (보인자)</SelectItem>
                            <SelectItem value="visual">Visual (발현)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function MorphCalculatorPage() {
    const [parent1, setParent1] = useState<GeneticProfile>({
        lilly: 'normal',
        complex: 'normal',
        axanthic: 'normal',
        phantom: 'normal',
    });

    const [parent2, setParent2] = useState<GeneticProfile>({
        lilly: 'normal',
        complex: 'normal',
        axanthic: 'normal',
        phantom: 'normal',
    });

    const [result, setResult] = useState<CalculationResult | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);

    const handleCalculate = () => {
        setIsCalculating(true);
        setTimeout(() => {
            const calcResult = calculateGenetics(parent1, parent2);
            setResult(calcResult);
            setIsCalculating(false);
        }, 600);
    };

    const chartData = useMemo(() => {
        if (!result) return [];
        return result.offspring.map(r => ({
            name: r.koreanName,
            value: r.probability,
            color: r.color,
        }));
    }, [result]);

    const CHART_COLORS = ['#D4AF37', '#92400E', '#F9FAFB', '#4B5563', '#FBBF24', '#EF4444', '#1F2937', '#854D0E', '#9CA3AF', '#374151'];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b border-zinc-800 bg-zinc-900/50">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/tools" className="text-zinc-400 hover:text-white transition">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-white flex items-center gap-2">
                                <Dna className="w-5 h-5 text-[#D4AF37]" />
                                모프 계산기
                                <span className="text-xs bg-gradient-to-r from-[#D4AF37] to-[#FCF6BA] text-black px-2 py-0.5 rounded-full font-bold">
                                    Gen 2.0
                                </span>
                            </h1>
                            <p className="text-sm text-zinc-500">2025 Korean Market Standard</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* SEO Content Section */}
            <div className="max-w-6xl mx-auto px-4 pt-8">
                <div className="bg-gradient-to-r from-[#D4AF37]/10 to-transparent border-l-4 border-[#D4AF37] pl-4 py-3 mb-6">
                    <h1 className="text-2xl font-bold text-white mb-2">
                        크레스티드 게코 모프 계산기 (유전 확률 예측)
                    </h1>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                        멘델의 유전 법칙을 기반으로 부모 개체의 형질을 분석하여 2세의 모프를 예측합니다.
                        릴리 화이트, 아잔틱, 카푸치노, 세이블, 루왁 등 최신 모프 데이터를 지원하며,
                        치사 유전자와 건강 위험도까지 자동으로 계산해드립니다.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Info Banner */}
                <div className="bg-gradient-to-r from-zinc-900/80 to-zinc-800/80 border border-zinc-700 rounded-xl p-4 mb-8">
                    <div className="flex items-center justify-center gap-4 flex-wrap text-sm">
                        <span className="flex items-center gap-1 text-zinc-400">
                            <Dna className="w-4 h-4 text-[#D4AF37]" />
                            대립유전자 복합체
                        </span>
                        <span className="text-zinc-600">|</span>
                        <span className="flex items-center gap-1 text-zinc-400">
                            <Skull className="w-4 h-4 text-red-400" />
                            치사 유전자 감지
                        </span>
                        <span className="text-zinc-600">|</span>
                        <span className="flex items-center gap-1 text-zinc-400">
                            <Crown className="w-4 h-4 text-[#D4AF37]" />
                            2025 시장 가치 등급
                        </span>
                        <span className="text-zinc-600">|</span>
                        <span className="flex items-center gap-1 text-zinc-400">
                            <Zap className="w-4 h-4 text-emerald-400" />
                            Normal Zero 감지
                        </span>
                    </div>
                </div>

                {/* Parent Selection */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <ParentSelector
                        title="Father (수컷)"
                        gender="male"
                        profile={parent1}
                        onChange={setParent1}
                    />

                    {/* Calculate Button */}
                    <div className="flex flex-col items-center justify-center gap-4">
                        <Button
                            onClick={handleCalculate}
                            disabled={isCalculating}
                            size="lg"
                            className="bg-gradient-to-r from-[#D4AF37] to-[#C5A028] hover:from-[#C5A028] hover:to-[#B8942A] text-black font-bold px-10 py-7 rounded-full shadow-[0_0_40px_rgba(212,175,55,0.4)] transition-all hover:shadow-[0_0_60px_rgba(212,175,55,0.6)] hover:scale-105"
                        >
                            {isCalculating ? (
                                <Dna className="w-8 h-8 animate-spin" />
                            ) : (
                                <div className="flex flex-col items-center gap-1">
                                    <Calculator className="w-6 h-6" />
                                    <span className="text-lg">계산하기</span>
                                </div>
                            )}
                        </Button>
                        <p className="text-xs text-zinc-500 text-center">
                            유전 조합을 분석하고<br />2세 확률을 계산합니다
                        </p>
                    </div>

                    <ParentSelector
                        title="Mother (암컷)"
                        gender="female"
                        profile={parent2}
                        onChange={setParent2}
                    />
                </div>

                {/* Results */}
                {result && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Special Condition Banners */}
                        <div className="space-y-3 mb-6">
                            {/* Normal Zero Banner */}
                            {result.isNormalZero && (
                                <div className="bg-emerald-950/50 border border-emerald-700/50 rounded-xl p-4 flex items-center gap-3">
                                    <div className="w-12 h-12 bg-emerald-900/50 rounded-full flex items-center justify-center">
                                        <Zap className="w-6 h-6 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-emerald-400">🧬 꽝 없는 조합! (Normal Zero)</h4>
                                        <p className="text-emerald-300 text-sm">
                                            이 조합에서는 노말 자손이 태어나지 않습니다. 모든 자손이 특별한 모프를 가집니다!
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Lethal Warning */}
                            {result.hasLethal && (
                                <div className="bg-red-950/50 border border-red-700/50 rounded-xl p-4 flex items-center gap-3">
                                    <div className="w-12 h-12 bg-red-900/50 rounded-full flex items-center justify-center">
                                        <Skull className="w-6 h-6 text-red-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-red-400">☠️ 치사 유전자 경고 ({result.totalLethalPercent}%)</h4>
                                        <p className="text-red-300 text-sm">
                                            이 조합은 <strong>슈퍼 릴리(치사)</strong> 자손을 생산합니다.
                                            해당 개체는 부화하지 못하거나 부화 직후 사망합니다.
                                            <strong> Lilly x Lilly 교배는 윤리적 이유로 권장하지 않습니다.</strong>
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Health Risk Warning */}
                            {result.hasHealthRisk && (
                                <div className="bg-amber-950/50 border border-amber-700/50 rounded-xl p-4 flex items-center gap-3">
                                    <div className="w-12 h-12 bg-amber-900/50 rounded-full flex items-center justify-center">
                                        <AlertTriangle className="w-6 h-6 text-amber-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-amber-400">⚠️ 건강 위험 경고 ({result.totalHealthRiskPercent}%)</h4>
                                        <p className="text-amber-300 text-sm">
                                            이 조합은 <strong>슈퍼 카푸치노(멜라니스틱)</strong> 자손을 생산합니다.
                                            해당 모프는 시력 저하 등 건강 문제가 보고되어 있습니다.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Results Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                🧬 예상 결과
                            </h2>
                            <div className="flex items-center gap-4 text-sm text-zinc-500">
                                <span>{result.offspring.length}개 표현형</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Chart */}
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4">확률 분포</h3>
                                <div className="h-80">
                                    {chartData.length > 0 && (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={chartData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={100}
                                                    paddingAngle={2}
                                                    dataKey="value"
                                                >
                                                    {chartData.map((entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]}
                                                            stroke="rgba(0,0,0,0.5)"
                                                            strokeWidth={2}
                                                        />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: '#18181B',
                                                        border: '1px solid #3F3F46',
                                                        borderRadius: '8px',
                                                        padding: '8px 12px',
                                                    }}
                                                    formatter={(value, name) => [`${value ?? 0}%`, name]}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    )}
                                </div>
                                {/* Legend */}
                                <div className="mt-4 grid grid-cols-2 gap-2">
                                    {chartData.slice(0, 6).map((item, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                            <span className="text-zinc-400 truncate">{item.name}</span>
                                            <span className="text-zinc-500 ml-auto">{item.value}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Cards */}
                            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
                                {result.offspring.map((offspring, index) => (
                                    <ResultCard key={index} result={offspring} />
                                ))}
                            </div>
                        </div>

                        {/* Disclaimer */}
                        <div className="mt-8 p-4 bg-zinc-900/30 border border-zinc-800 rounded-lg">
                            <p className="text-xs text-zinc-500 text-center">
                                ⚠️ 이 계산기는 2025년 한국 크레스티드 게코 시장 표준과 최신 유전학 연구를 기반으로 합니다.
                                실제 결과는 환경 요인, 유전자 상호작용, 또는 아직 알려지지 않은 유전적 요소에 의해 달라질 수 있습니다.
                                번식 결정 전 전문 브리더와 상담하세요.
                            </p>
                        </div>

                        {/* 광고 배너 - 결과 하단 */}
                        <div className="mt-6">
                            <AdSenseBanner
                                slot="2345678901"
                                format="horizontal"
                                className="rounded-xl overflow-hidden"
                            />
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!result && (
                    <div className="text-center py-16">
                        <Dna className="w-20 h-20 mx-auto text-zinc-700 mb-6" />
                        <h3 className="text-xl font-medium text-zinc-400 mb-3">부모 모프를 선택하세요</h3>
                        <p className="text-sm text-zinc-600 max-w-md mx-auto">
                            퀵 프리셋을 사용하거나 각 유전자 좌위를 직접 선택한 후
                            <br />계산하기 버튼을 눌러주세요.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
