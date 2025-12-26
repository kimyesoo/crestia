'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, CheckCircle, Info, Search, Dna, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// MORPH DATABASE - 실제 유전학 기반 데이터
// ============================================

type RiskLevel = 'None' | 'Medium' | 'High';
type MorphType = 'Incomplete Dominant' | 'Recessive' | 'Polygenic' | 'Combination';

type Morph = {
    id: string;
    name: string;
    type: MorphType;
    tags: string[];
    description: string;
    features: string[];
    riskLevel: RiskLevel;
    gradient: string; // 카드 이미지 플레이스홀더용 그라데이션
};

const MORPH_DB: Morph[] = [
    {
        id: 'lilly-white',
        name: 'Lilly White (릴리 화이트)',
        type: 'Incomplete Dominant',
        tags: ['Lethal Super Form', 'Essential'],
        description: '2010년 규명된 형질로, 등과 옆구리에 순백색이 덮이는 특징이 있습니다. 슈퍼폼(Homozygous)은 치사 유전으로 부화 전후 사망하므로, 릴리끼리의 교배는 금기시됩니다.',
        features: ['순백색의 등과 옆구리', '배(Belly)는 거의 항상 흰색', '슈퍼폼 치사 유전 (25% 알 손실)'],
        riskLevel: 'High',
        gradient: 'from-white via-gray-200 to-gray-400'
    },
    {
        id: 'axanthic',
        name: 'Axanthic (아잔틱)',
        type: 'Recessive',
        tags: ['Recessive', 'Monotone'],
        description: '황색소포와 적색소포가 억제되어 노란색과 붉은색이 사라진 흑백(Monotone)의 개체입니다. 릴리 화이트와 결합 시 릴리 아잔틱이 되며, 최근 건강한 고가 모프로 각광받고 있습니다.',
        features: ['흑, 백, 회색의 모노톤', '열성 유전 (부모 모두에게 인자 필요)', '기형 이슈 없음'],
        riskLevel: 'None',
        gradient: 'from-zinc-800 via-zinc-500 to-zinc-300'
    },
    {
        id: 'cappuccino',
        name: 'Cappuccino (카푸치노)',
        type: 'Incomplete Dominant',
        tags: ['Allelic Complex', 'Health Risk'],
        description: '세이블과 같은 유전자 좌위를 공유하는 대립유전자입니다. 꼬리 기부의 Y자 패턴이 특징이며, 슈퍼폼(슈퍼 카푸치노)은 멜라니스틱하지만 비공 협착 등 기형 위험이 있습니다.',
        features: ['꼬리 기부의 Y자 패턴', '커피색 바디', '슈퍼폼의 건강 문제 주의'],
        riskLevel: 'Medium',
        gradient: 'from-amber-900 via-amber-700 to-amber-500'
    },
    {
        id: 'sable',
        name: 'Sable (세이블)',
        type: 'Incomplete Dominant',
        tags: ['Allelic Complex', 'Safe Option'],
        description: '카푸치노의 대립유전자이나, 슈퍼폼(슈퍼 세이블) 생성 시 기형 문제가 보고되지 않은 건강한 형질입니다. 꼬리가 두툼해지는 Club Tail 현상이 관찰되기도 합니다.',
        features: ['높은 대비(High Contrast)', '건강한 슈퍼폼(멜라니스틱)', '카푸치노와 교배 시 루왁 생산'],
        riskLevel: 'None',
        gradient: 'from-stone-900 via-stone-700 to-stone-500'
    },
    {
        id: 'frappuccino',
        name: 'Frappuccino (프라푸치노)',
        type: 'Combination',
        tags: ['High Value', 'Cash Cow'],
        description: '카푸치노와 릴리 화이트의 콤보 모프입니다. 릴리의 흰색과 카푸의 짙은 색이 극적인 대비를 이루며, 치사나 기형 없이 생산 가능한 최고의 인기 모프입니다.',
        features: ['극적인 색상 대비', '안전한 고수익 모프', '카푸치노(Het) x 릴리(Het) 조합'],
        riskLevel: 'None',
        gradient: 'from-amber-800 via-white to-amber-600'
    },
    {
        id: 'seorak',
        name: 'Seorak (설악)',
        type: 'Combination',
        tags: ['Apex Tier', 'High Risk'],
        description: '슈퍼 카푸치노와 릴리 화이트가 결합된 전설적인 모프입니다. 은색 유령 같은 외형을 가지지만, 생산 과정에서 기형 개체가 나올 확률이 있어 윤리적 접근이 필요합니다.',
        features: ['은회색/유령 같은 발색', '최상위 포식자 등급(Price)', '생산 난이도 최상'],
        riskLevel: 'High',
        gradient: 'from-slate-400 via-slate-200 to-white'
    },
    {
        id: 'luwak',
        name: 'Luwak (루왁)',
        type: 'Combination',
        tags: ['Normal Zero', 'Allelic Combo'],
        description: '카푸치노와 세이블이 하나씩 결합된 복합 이형접합체입니다. 노멀과 교배 시 자손에서 노멀이 단 한 마리도 나오지 않는(Normal Zero) 최고의 종충입니다.',
        features: ['독특한 파라독스 무늬', '노멀 제로(생산성 최고)', '건강한 멜라니스틱 계열'],
        riskLevel: 'None',
        gradient: 'from-zinc-900 via-amber-800 to-stone-600'
    }
];

// ============================================
// HELPER COMPONENTS
// ============================================

const RiskBadge = ({ level }: { level: RiskLevel }) => {
    switch (level) {
        case 'High':
            return (
                <Badge className="bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">
                    <AlertTriangle className="w-3 h-3 mr-1" />⚠️ Lethal/Risk
                </Badge>
            );
        case 'Medium':
            return (
                <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <Info className="w-3 h-3 mr-1" />주의 필요
                </Badge>
            );
        case 'None':
            return (
                <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
                    <CheckCircle className="w-3 h-3 mr-1" />Safe
                </Badge>
            );
    }
};

const TypeBadge = ({ type }: { type: MorphType }) => {
    const config: Record<MorphType, { color: string; label: string }> = {
        'Incomplete Dominant': { color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', label: '불완전 우성' },
        'Recessive': { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: '열성' },
        'Polygenic': { color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', label: '다인자' },
        'Combination': { color: 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/30', label: '콤보(Designer)' }
    };
    return <Badge className={`${config[type].color} border`}>{config[type].label}</Badge>;
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function MorphGuidePage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<MorphType | 'all'>('all');
    const [expandedMorph, setExpandedMorph] = useState<string | null>(null);

    const filteredMorphs = MORPH_DB.filter(morph => {
        const matchesSearch = morph.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            morph.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            morph.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesType = selectedType === 'all' || morph.type === selectedType;
        return matchesSearch && matchesType;
    });

    const filterTabs: Array<{ key: MorphType | 'all'; label: string }> = [
        { key: 'all', label: '전체' },
        { key: 'Incomplete Dominant', label: '불완전 우성' },
        { key: 'Recessive', label: '열성' },
        { key: 'Combination', label: '콤보(Designer)' }
    ];

    return (
        <div className="min-h-screen bg-background text-zinc-300 overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative pt-32 pb-16 px-4 overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[150px] pointer-events-none" />

                <div className="max-w-5xl mx-auto relative z-10">
                    <Link href="/guide" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition mb-8">
                        <ArrowLeft className="w-4 h-4" />
                        가이드 홈
                    </Link>

                    {/* Hero Title */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-3 mb-4">
                            <Dna className="w-10 h-10 text-[#D4AF37]" />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold bg-gradient-to-r from-[#FBF5b7] via-[#D4AF37] to-[#aa771c] bg-clip-text text-transparent mb-4">
                            Genetics of Crestia
                        </h1>
                        <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                            크레스티드 게코 유전학 바이블
                        </p>
                        <p className="text-sm text-zinc-500 mt-4 max-w-3xl mx-auto leading-relaxed">
                            초보자부터 전문 브리더까지 참고할 수 있는 과학적 모프 가이드입니다.
                            <br className="hidden md:block" />
                            각 유전형의 특징, 위험도, 그리고 브리딩 조합에 대한 신뢰할 수 있는 정보를 제공합니다.
                        </p>
                    </motion.div>

                    {/* Search */}
                    <div className="max-w-xl mx-auto mb-8">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                            <Input
                                placeholder="모프 이름, 태그 검색..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 py-6 bg-zinc-900/80 border-zinc-700 text-lg rounded-xl"
                            />
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex justify-center gap-2 flex-wrap">
                        {filterTabs.map((tab) => (
                            <Button
                                key={tab.key}
                                variant={selectedType === tab.key ? 'default' : 'outline'}
                                onClick={() => setSelectedType(tab.key)}
                                className={selectedType === tab.key
                                    ? 'bg-[#D4AF37] text-black hover:bg-[#C5A028] font-bold'
                                    : 'border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500'
                                }
                            >
                                {tab.label}
                            </Button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="px-4 pb-20">
                <div className="max-w-5xl mx-auto">
                    {/* Risk Legend */}
                    <div className="flex flex-wrap justify-center gap-6 mb-10 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                            <span className="text-zinc-400">Lethal/High Risk</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                            <span className="text-zinc-400">주의 필요</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-green-500"></span>
                            <span className="text-zinc-400">Safe</span>
                        </div>
                    </div>

                    {/* Morph Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AnimatePresence>
                            {filteredMorphs.map((morph, index) => (
                                <motion.div
                                    key={morph.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.05 }}
                                    layout
                                    className={`bg-zinc-900/70 border rounded-2xl overflow-hidden transition-all duration-300 ${expandedMorph === morph.id
                                            ? 'border-[#D4AF37]/50 shadow-lg shadow-[#D4AF37]/10'
                                            : 'border-zinc-800 hover:border-zinc-700'
                                        }`}
                                >
                                    {/* Gradient Image Placeholder */}
                                    <div className={`h-32 bg-gradient-to-br ${morph.gradient} relative`}>
                                        <div className="absolute inset-0 bg-black/20" />
                                        <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
                                            <RiskBadge level={morph.riskLevel} />
                                            <TypeBadge type={morph.type} />
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-5">
                                        {/* Title & Tags */}
                                        <h3 className="text-xl font-bold text-white mb-2">{morph.name}</h3>
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {morph.tags.map((tag) => (
                                                <Badge key={tag} variant="outline" className="text-[10px] border-zinc-700 text-zinc-500">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>

                                        {/* Features with Checkmarks */}
                                        <ul className="space-y-2 mb-4">
                                            {morph.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-sm text-zinc-400">
                                                    <CheckCircle className="w-4 h-4 text-[#D4AF37] mt-0.5 shrink-0" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* More Info Button */}
                                        <button
                                            onClick={() => setExpandedMorph(expandedMorph === morph.id ? null : morph.id)}
                                            className="w-full py-2 text-sm text-zinc-400 hover:text-white flex items-center justify-center gap-2 border-t border-zinc-800 transition-colors"
                                        >
                                            <BookOpen className="w-4 h-4" />
                                            {expandedMorph === morph.id ? '접기' : 'More Info'}
                                            {expandedMorph === morph.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        </button>

                                        {/* Expanded Description */}
                                        <AnimatePresence>
                                            {expandedMorph === morph.id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="pt-4 border-t border-zinc-800 mt-4">
                                                        <p className="text-sm text-zinc-400 leading-relaxed">
                                                            {morph.description}
                                                        </p>

                                                        {/* Risk Warning */}
                                                        {morph.riskLevel !== 'None' && (
                                                            <div className={`mt-4 p-3 rounded-lg ${morph.riskLevel === 'High'
                                                                    ? 'bg-red-500/10 border border-red-500/30'
                                                                    : 'bg-amber-500/10 border border-amber-500/30'
                                                                }`}>
                                                                <p className={`text-xs ${morph.riskLevel === 'High' ? 'text-red-400' : 'text-amber-400'}`}>
                                                                    <AlertTriangle className="w-4 h-4 inline mr-2" />
                                                                    {morph.riskLevel === 'High'
                                                                        ? '⚠️ 이 모프는 치사 또는 기형 위험이 있습니다. 브리딩 전 충분한 연구가 필요합니다.'
                                                                        : '⚠️ 슈퍼폼 생성 시 건강 문제가 발생할 수 있으니 주의하세요.'}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* No Results */}
                    {filteredMorphs.length === 0 && (
                        <div className="text-center py-20">
                            <Search className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                            <p className="text-zinc-500">검색 결과가 없습니다.</p>
                        </div>
                    )}

                    {/* Disclaimer */}
                    <div className="mt-16 p-6 bg-zinc-800/50 rounded-xl border border-zinc-700 text-center">
                        <AlertTriangle className="w-6 h-6 text-amber-500 mx-auto mb-3" />
                        <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl mx-auto">
                            본 가이드의 정보는 참고용이며, 전문적인 수의학적 진단을 대체하지 않습니다.
                            <br />
                            브리딩 결정 전 반드시 전문가와 상담하시기 바랍니다.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
