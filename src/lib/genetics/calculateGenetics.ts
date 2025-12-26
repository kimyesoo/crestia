// ============================================
// CRESTIA GEN 2.0 - GENETIC CALCULATION ENGINE
// 2025 Korean Crested Gecko Market Standard
// ============================================

// ============================================
// TYPES & INTERFACES
// ============================================

export type LillyAllele = 'normal' | 'lilly';
export type ComplexAllele = 'normal' | 'cappuccino' | 'sable' | 'super_cappuccino' | 'super_sable' | 'luwak';
export type RecessiveAllele = 'normal' | 'het' | 'visual';

export interface GeneticProfile {
    lilly: LillyAllele;
    complex: ComplexAllele;
    axanthic: RecessiveAllele;
    phantom: RecessiveAllele;
}

export type TierType = 'entry' | 'high' | 'elite' | 'apex';
export type WarningType = 'lethal' | 'health_risk' | 'normal_zero' | 'investment' | 'hot';

export interface OffspringResult {
    name: string;
    koreanName: string;
    probability: number;
    genotype: string;
    description: string;
    tier: TierType;
    warnings: WarningType[];
    color: string;
}

export interface CalculationResult {
    offspring: OffspringResult[];
    hasLethal: boolean;
    hasHealthRisk: boolean;
    isNormalZero: boolean;
    totalLethalPercent: number;
    totalHealthRiskPercent: number;
}

// ============================================
// MORPH DICTIONARY - 2025 Korean Market Standard
// ============================================

interface MorphInfo {
    korean: string;
    description: string;
    tier: TierType;
    color: string;
}

export const MORPH_DICTIONARY: Record<string, MorphInfo> = {
    // Base
    'Normal': {
        korean: '노말',
        description: '야생형 표현형을 가진 건강한 개체입니다.',
        tier: 'entry',
        color: '#6B7280'
    },

    // Lilly White Line
    'Lilly White': {
        korean: '릴리 화이트',
        description: '머리와 등을 따라 흰색 패턴이 나타나는 아름다운 모프입니다.',
        tier: 'high',
        color: '#F9FAFB'
    },
    'Super Lilly': {
        korean: '슈퍼 릴리 (☠️ 사산)',
        description: '치사 유전자를 가진 개체입니다. 부화하지 못하거나 부화 직후 사망합니다.',
        tier: 'entry',
        color: '#EF4444'
    },

    // Cappuccino Complex
    'Cappuccino': {
        korean: '카푸치노',
        description: '따뜻한 갈색 톤과 특유의 패턴을 가진 인기 모프입니다.',
        tier: 'high',
        color: '#92400E'
    },
    'Super Cappuccino': {
        korean: '슈퍼 카푸치노 (멜라니스틱)',
        description: '매우 어두운 색상의 희귀한 슈퍼폼. ⚠️ 시력 저하 등 건강 문제가 보고됩니다.',
        tier: 'elite',
        color: '#1F2937'
    },
    'Sable': {
        korean: '세이블',
        description: '카푸치노와 같은 유전자 좌위를 공유하는 독특한 모프입니다.',
        tier: 'high',
        color: '#78350F'
    },
    'Super Sable': {
        korean: '슈퍼 세이블',
        description: '세이블의 슈퍼폼으로 건강하고 매우 희귀합니다.',
        tier: 'elite',
        color: '#451A03'
    },
    'Luwak': {
        korean: '루왁 (Capp+Sable)',
        description: '카푸치노와 세이블의 복합 이형접합체. 🔥 노말 제로 조합의 핵심!',
        tier: 'elite',
        color: '#854D0E'
    },

    // Designer Morphs - 2025 Korean Market Names
    'Frappuccino': {
        korean: '프라푸치노 (Frappuccino)',
        description: '릴리 화이트 + 카푸치노의 환상적인 조합! 💰 투자 가치 높음.',
        tier: 'elite',
        color: '#D4AF37'
    },
    'Seorak': {
        korean: '설악 (Seorak)',
        description: '슈퍼 카푸치노 + 릴리 화이트. 👑 최고급 희귀 모프. ⚠️ 건강 위험 존재.',
        tier: 'apex',
        color: '#FCD34D'
    },
    'Lilly Luwak': {
        korean: '릴리 루왁 (Lilly Luwak)',
        description: '루왁 + 릴리 화이트. 👑 최상위 콤보, 다음 세대 노말 제로 보장!',
        tier: 'apex',
        color: '#FBBF24'
    },
    'Lilly Axanthic': {
        korean: '릴리 아잔틱 (Lilly Axanthic)',
        description: '아잔틱 + 릴리 화이트. 🛡️ 안정적인 고가치 투자처.',
        tier: 'elite',
        color: '#9CA3AF'
    },
    'Phantom Lilly': {
        korean: '팬텀 릴리 (Phantom Lilly)',
        description: '팬텀 + 릴리 화이트. 🎨 파스텔 톤의 아름다운 조합.',
        tier: 'elite',
        color: '#E5E7EB'
    },

    // Recessive
    'Axanthic': {
        korean: '아잔틱 (발현)',
        description: '노란색 색소가 없어 회색/보라빛 톤을 보이는 모프입니다.',
        tier: 'high',
        color: '#4B5563'
    },
    'Het Axanthic': {
        korean: '헷 아잔틱',
        description: '아잔틱 유전자를 보유하지만 발현하지 않습니다.',
        tier: 'entry',
        color: '#9CA3AF'
    },
    'Phantom': {
        korean: '팬텀 (발현)',
        description: '독특한 패턴 감소를 보이는 열성 모프입니다.',
        tier: 'high',
        color: '#374151'
    },
    'Het Phantom': {
        korean: '헷 팬텀',
        description: '팬텀 유전자를 보유하지만 발현하지 않습니다.',
        tier: 'entry',
        color: '#9CA3AF'
    },
    '66% Poss Het Axanthic': {
        korean: '66% 파서블 헷 아잔틱',
        description: '66% 확률로 아잔틱 유전자를 보유할 수 있습니다.',
        tier: 'entry',
        color: '#9CA3AF'
    },
    '66% Poss Het Phantom': {
        korean: '66% 파서블 헷 팬텀',
        description: '66% 확률로 팬텀 유전자를 보유할 수 있습니다.',
        tier: 'entry',
        color: '#9CA3AF'
    },
};

// ============================================
// GENETIC CALCULATION FUNCTIONS
// ============================================

interface GeneResult {
    phenotype: string;
    probability: number;
}

// Lilly White Calculation (Incomplete Dominant with Lethal)
function calculateLilly(p1: LillyAllele, p2: LillyAllele): GeneResult[] {
    if (p1 === 'normal' && p2 === 'normal') {
        return [{ phenotype: 'Normal', probability: 100 }];
    }
    if ((p1 === 'lilly' && p2 === 'normal') || (p1 === 'normal' && p2 === 'lilly')) {
        return [
            { phenotype: 'Lilly White', probability: 50 },
            { phenotype: 'Normal', probability: 50 },
        ];
    }
    if (p1 === 'lilly' && p2 === 'lilly') {
        return [
            { phenotype: 'Super Lilly', probability: 25 },
            { phenotype: 'Lilly White', probability: 50 },
            { phenotype: 'Normal', probability: 25 },
        ];
    }
    return [{ phenotype: 'Normal', probability: 100 }];
}

// Complex Allele Calculation (Cappuccino/Sable/Luwak)
function calculateComplex(p1: ComplexAllele, p2: ComplexAllele): GeneResult[] {
    // Convert complex types to allele pairs
    const getAlleles = (allele: ComplexAllele): [string, string] => {
        switch (allele) {
            case 'cappuccino': return ['C', '+'];
            case 'sable': return ['S', '+'];
            case 'super_cappuccino': return ['C', 'C'];
            case 'super_sable': return ['S', 'S'];
            case 'luwak': return ['C', 'S'];
            default: return ['+', '+'];
        }
    };

    const [a1, a2] = getAlleles(p1);
    const [b1, b2] = getAlleles(p2);

    // Punnett square
    const combos: string[] = [
        [a1, b1].sort().join(''),
        [a1, b2].sort().join(''),
        [a2, b1].sort().join(''),
        [a2, b2].sort().join(''),
    ];

    const phenotypeMap: Record<string, string> = {
        '++': 'Normal',
        '+C': 'Cappuccino',
        '+S': 'Sable',
        'CC': 'Super Cappuccino',
        'SS': 'Super Sable',
        'CS': 'Luwak',
    };

    const counts: Record<string, number> = {};
    for (const combo of combos) {
        const pheno = phenotypeMap[combo] || 'Normal';
        counts[pheno] = (counts[pheno] || 0) + 25;
    }

    return Object.entries(counts).map(([phenotype, probability]) => ({ phenotype, probability }));
}

// Recessive Trait Calculation (Axanthic/Phantom)
function calculateRecessive(p1: RecessiveAllele, p2: RecessiveAllele, traitName: string): GeneResult[] {
    const getAlleles = (allele: RecessiveAllele): [string, string] => {
        switch (allele) {
            case 'visual': return ['a', 'a'];
            case 'het': return ['a', '+'];
            default: return ['+', '+'];
        }
    };

    const [a1, a2] = getAlleles(p1);
    const [b1, b2] = getAlleles(p2);

    const combos: string[] = [
        [a1, b1].sort().join(''),
        [a1, b2].sort().join(''),
        [a2, b1].sort().join(''),
        [a2, b2].sort().join(''),
    ];

    const counts: Record<string, number> = {};
    for (const combo of combos) {
        let pheno: string;
        if (combo === 'aa') {
            pheno = traitName;
        } else if (combo === '+a' || combo === 'a+') {
            // Special handling for Het x Het = 66% Poss Het
            if (p1 === 'het' && p2 === 'het') {
                pheno = `66% Poss Het ${traitName}`;
            } else {
                pheno = `Het ${traitName}`;
            }
        } else {
            pheno = 'Normal';
        }
        counts[pheno] = (counts[pheno] || 0) + 25;
    }

    return Object.entries(counts).map(([phenotype, probability]) => ({ phenotype, probability }));
}

// Combine all results and apply designer morph naming
function combineAndNameResults(
    lillyResults: GeneResult[],
    complexResults: GeneResult[],
    axanthicResults: GeneResult[],
    phantomResults: GeneResult[]
): OffspringResult[] {
    const combined: Map<string, number> = new Map();

    // Combine all loci
    for (const lilly of lillyResults) {
        for (const complex of complexResults) {
            for (const axanthic of axanthicResults) {
                for (const phantom of phantomResults) {
                    const prob = (lilly.probability * complex.probability * axanthic.probability * phantom.probability) / 1000000;
                    if (prob < 0.01) continue;

                    // Build genotype string
                    const parts: string[] = [];
                    if (lilly.phenotype !== 'Normal') parts.push(lilly.phenotype);
                    if (complex.phenotype !== 'Normal') parts.push(complex.phenotype);
                    if (axanthic.phenotype !== 'Normal') parts.push(axanthic.phenotype);
                    if (phantom.phenotype !== 'Normal') parts.push(phantom.phenotype);

                    const genotype = parts.length > 0 ? parts.join(' + ') : 'Normal';
                    combined.set(genotype, (combined.get(genotype) || 0) + prob);
                }
            }
        }
    }

    // Convert to results with designer names
    const results: OffspringResult[] = [];

    for (const [genotype, probability] of combined) {
        const roundedProb = Math.round(probability * 100) / 100;
        if (roundedProb < 0.1) continue;

        // Apply designer morph naming
        let displayName = genotype;
        let koreanName = '';

        // Check for specific combos
        if (genotype.includes('Lilly White') && genotype.includes('Cappuccino') && !genotype.includes('Super')) {
            displayName = 'Frappuccino';
        } else if (genotype.includes('Lilly White') && genotype.includes('Super Cappuccino')) {
            displayName = 'Seorak';
        } else if (genotype.includes('Lilly White') && genotype.includes('Luwak')) {
            displayName = 'Lilly Luwak';
        } else if (genotype.includes('Lilly White') && genotype.includes('Axanthic')) {
            displayName = 'Lilly Axanthic';
        } else if (genotype.includes('Lilly White') && genotype.includes('Phantom')) {
            displayName = 'Phantom Lilly';
        }

        // Get morph info
        const morphInfo = MORPH_DICTIONARY[displayName] || MORPH_DICTIONARY[genotype.split(' + ')[0]] || {
            korean: displayName,
            description: `복합 모프: ${genotype}`,
            tier: 'entry' as TierType,
            color: '#6B7280',
        };

        // Determine warnings
        const warnings: WarningType[] = [];
        if (genotype.includes('Super Lilly')) {
            warnings.push('lethal');
        }
        if (genotype.includes('Super Cappuccino')) {
            warnings.push('health_risk');
        }
        if (displayName === 'Frappuccino' || displayName === 'Seorak') {
            warnings.push('investment');
        }
        if (displayName === 'Luwak' || displayName === 'Lilly Luwak') {
            warnings.push('hot');
        }

        results.push({
            name: displayName,
            koreanName: morphInfo.korean,
            probability: roundedProb,
            genotype,
            description: morphInfo.description,
            tier: morphInfo.tier,
            warnings,
            color: morphInfo.color,
        });
    }

    // Sort by probability (highest first)
    return results.sort((a, b) => b.probability - a.probability);
}

// ============================================
// MAIN CALCULATION FUNCTION
// ============================================

export function calculateGenetics(parent1: GeneticProfile, parent2: GeneticProfile): CalculationResult {
    const lillyResults = calculateLilly(parent1.lilly, parent2.lilly);
    const complexResults = calculateComplex(parent1.complex, parent2.complex);
    const axanthicResults = calculateRecessive(parent1.axanthic, parent2.axanthic, 'Axanthic');
    const phantomResults = calculateRecessive(parent1.phantom, parent2.phantom, 'Phantom');

    const offspring = combineAndNameResults(lillyResults, complexResults, axanthicResults, phantomResults);

    // Check for special conditions
    const hasLethal = offspring.some(o => o.warnings.includes('lethal'));
    const hasHealthRisk = offspring.some(o => o.warnings.includes('health_risk'));
    const isNormalZero = !offspring.some(o => o.name === 'Normal' || o.genotype === 'Normal');

    const totalLethalPercent = offspring
        .filter(o => o.warnings.includes('lethal'))
        .reduce((sum, o) => sum + o.probability, 0);

    const totalHealthRiskPercent = offspring
        .filter(o => o.warnings.includes('health_risk'))
        .reduce((sum, o) => sum + o.probability, 0);

    // Add normal_zero warning to relevant offspring
    if (isNormalZero) {
        offspring.forEach(o => {
            if (!o.warnings.includes('normal_zero')) {
                o.warnings.push('normal_zero');
            }
        });
    }

    return {
        offspring,
        hasLethal,
        hasHealthRisk,
        isNormalZero,
        totalLethalPercent,
        totalHealthRiskPercent,
    };
}

// ============================================
// PRESET PROFILES - Quick Selection
// ============================================

export const PRESET_PROFILES: Record<string, { label: string; profile: GeneticProfile }> = {
    normal: {
        label: '노말 (Normal)',
        profile: { lilly: 'normal', complex: 'normal', axanthic: 'normal', phantom: 'normal' },
    },
    lilly: {
        label: '릴리 화이트 (Lilly White)',
        profile: { lilly: 'lilly', complex: 'normal', axanthic: 'normal', phantom: 'normal' },
    },
    cappuccino: {
        label: '카푸치노 (Cappuccino)',
        profile: { lilly: 'normal', complex: 'cappuccino', axanthic: 'normal', phantom: 'normal' },
    },
    sable: {
        label: '세이블 (Sable)',
        profile: { lilly: 'normal', complex: 'sable', axanthic: 'normal', phantom: 'normal' },
    },
    luwak: {
        label: '루왁 (Luwak)',
        profile: { lilly: 'normal', complex: 'luwak', axanthic: 'normal', phantom: 'normal' },
    },
    frappuccino: {
        label: '프라푸치노 (Frappuccino)',
        profile: { lilly: 'lilly', complex: 'cappuccino', axanthic: 'normal', phantom: 'normal' },
    },
    seorak: {
        label: '설악 (Seorak)',
        profile: { lilly: 'lilly', complex: 'super_cappuccino', axanthic: 'normal', phantom: 'normal' },
    },
    lilly_luwak: {
        label: '릴리 루왁 (Lilly Luwak)',
        profile: { lilly: 'lilly', complex: 'luwak', axanthic: 'normal', phantom: 'normal' },
    },
    axanthic: {
        label: '아잔틱 (Axanthic)',
        profile: { lilly: 'normal', complex: 'normal', axanthic: 'visual', phantom: 'normal' },
    },
    phantom: {
        label: '팬텀 (Phantom)',
        profile: { lilly: 'normal', complex: 'normal', axanthic: 'normal', phantom: 'visual' },
    },
};
