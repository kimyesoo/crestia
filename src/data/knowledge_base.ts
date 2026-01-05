/**
 * Crestia 크레스티드 게코 모프 백과사전 (Knowledge Base)
 * Version 2.0 - 2025-01-05
 * 
 * 5장의 PDF 이미지에서 추출한 포괄적인 모프 정보
 */

// ============================================
// Type Definitions
// ============================================

export interface GeneticMorph {
    id: string;
    name: string;
    nameKo: string;
    inheritance: string;
    inheritanceKo: string;
    traits: string;
    traitsEn?: string;
    warning?: string;
    warningEn?: string;
    breedingNote?: string;
    healthIssues?: string;
    isLethalSuper: boolean;
    hasHealthRisks?: boolean;
    discoverer?: string;
    lines?: string[];
    allelicTo?: string;
}

export interface PatternTrait {
    id: string;
    name: string;
    nameKo: string;
    description: string;
    variations?: Record<string, string>;
}

export interface BaseColor {
    id: string;
    name: string;
    nameKo: string;
    description: string;
}

export interface Misconception {
    term: string;
    termKo: string;
    isReal: boolean;
    reality: string;
    explanation: string;
}

export interface DesignerCombo {
    name: string;
    nameKo: string;
    components: string[];
    description: string;
}

export interface RiskyPairing {
    pairing: string;
    result: string;
    risk: string;
    riskLevel: 'lethal' | 'high' | 'medium';
    recommendation: string;
}

// ============================================
// Proven Genetic Morphs (검증된 유전 모프)
// ============================================

export const PROVEN_GENETIC_MORPHS: GeneticMorph[] = [
    {
        id: 'lilly_white',
        name: 'Lilly White',
        nameKo: '릴리 화이트',
        inheritance: 'Incomplete Dominant',
        inheritanceKo: '불완전 우성',
        discoverer: 'Lilly Exotics (UK)',
        traits: '등과 꼬리에 선명하고 넓은 흰색/크림색 패턴. 배(Belly)가 순백색. 성장할수록 흰색 영역이 넓어짐.',
        traitsEn: 'Wide white/cream pattern on dorsal and tail. Pure white belly.',
        warning: '슈퍼 릴리 화이트(Homozygous)는 치사 유전자 - 부화 불가',
        breedingNote: '릴리 x 릴리 교배 금지 (25% 치사)',
        isLethalSuper: true
    },
    {
        id: 'axanthic',
        name: 'Axanthic',
        nameKo: '아잔틱',
        inheritance: 'Recessive',
        inheritanceKo: '열성',
        traits: '황색소포 결핍으로 노란색/붉은색 미발현. 파이어 업 시 모노톤(검정, 회색, 은색, 흰색).',
        lines: ['Altitude Exotics', 'Voodoo'],
        isLethalSuper: false
    },
    {
        id: 'cappuccino',
        name: 'Cappuccino',
        nameKo: '카푸치노',
        inheritance: 'Incomplete Dominant',
        inheritanceKo: '불완전 우성',
        traits: '부화 시 굵고 하얀 꼬리 핀스트라이프. 성장하며 커피색으로 어두워짐. 꼬리 기부 Y자 패턴.',
        breedingNote: '릴리와 교배 시 프라푸치노 생산',
        isLethalSuper: false
    },
    {
        id: 'sable',
        name: 'Sable',
        nameKo: '세이블',
        inheritance: 'Incomplete Dominant',
        inheritanceKo: '불완전 우성',
        traits: '카푸치노와 유사하나 검은 베이스가 더 짙음. 성장하며 형질 급변.',
        allelicTo: 'Cappuccino',
        isLethalSuper: false
    },
    {
        id: 'melanistic',
        name: 'Melanistic (Super Cappuccino)',
        nameKo: '멜라니스틱 (슈퍼 카푸치노)',
        inheritance: 'Super Form (Homo)',
        inheritanceKo: '슈퍼폼 (호모)',
        traits: '카푸치노 x 카푸치노. 전신 칠흑색.',
        healthIssues: '콧구멍 축소(Reduced Nostrils) 및 안구 질환',
        isLethalSuper: false,
        hasHealthRisks: true
    },
    {
        id: 'luwak',
        name: 'Luwak',
        nameKo: '루왁',
        inheritance: 'Combo (Double Het)',
        inheritanceKo: '이종 헷 (콤보)',
        traits: '카푸치노 x 세이블. 멜라니스틱과 달리 건강 문제 없음. 독특한 흑갈색 베이스.',
        isLethalSuper: false,
        hasHealthRisks: false
    },
    {
        id: 'phantom',
        name: 'Phantom',
        nameKo: '팬텀',
        inheritance: 'Recessive',
        inheritanceKo: '열성',
        traits: '멜라닌이 패턴을 덮어 색상 억제(Muted). 핀스트라이프 구조는 남지만 흰색이 사라짐.',
        breedingNote: '릴리와 결합 시 팬텀 릴리 - 몽환적인 보랏빛/회색빛',
        isLethalSuper: false
    },
    {
        id: 'genetic_hypo',
        name: 'Genetic Hypo',
        nameKo: '제네틱 하이포',
        inheritance: 'Incomplete Dominant',
        inheritanceKo: '불완전 우성',
        discoverer: 'The Bugg Plug',
        traits: '멜라닌 감소로 밝고 투명한 느낌. 성장하며 파스텔 톤.',
        isLethalSuper: false
    },
    {
        id: 'blizzard',
        name: 'Blizzard (BEL)',
        nameKo: '블리자드',
        inheritance: 'Super Form',
        inheritanceKo: '슈퍼폼',
        traits: '제네틱 하이포 x 제네틱 하이포. 블랙 아이 루시스틱. 패턴 없이 하얀 몸에 검은 눈.',
        isLethalSuper: false,
        hasHealthRisks: false
    }
];

// ============================================
// Polygenic Traits (다인자 유전 형질)
// ============================================

export const PATTERN_TRAITS: PatternTrait[] = [
    {
        id: 'harlequin',
        name: 'Harlequin',
        nameKo: '할리퀸',
        description: '등뿐만 아니라 옆구리와 사지에 불규칙한 패턴'
    },
    {
        id: 'extreme_harlequin',
        name: 'Extreme Harlequin',
        nameKo: '익스트림 할리퀸',
        description: '패턴이 바디의 60~80% 이상을 덮음'
    },
    {
        id: 'tricolor',
        name: 'Tri-color',
        nameKo: '트라이컬러',
        description: '베이스, 1차 패턴, 2차 패턴의 세 가지 색이 뚜렷함'
    },
    {
        id: 'tiger',
        name: 'Tiger / Brindle',
        nameKo: '타이거 / 브린들',
        description: '수직 줄무늬(Tiger) 또는 불규칙한 마블링(Brindle)'
    }
];

export const STRUCTURE_TRAITS: PatternTrait[] = [
    {
        id: 'pinstripe',
        name: 'Pinstripe',
        nameKo: '핀스트라이프',
        description: '등 양쪽 능선을 따라 비늘이 일렬로 솟아오른 형태',
        variations: { full: '풀(100%)', partial: '파셜', dash: '대시' }
    },
    {
        id: 'quadstripe',
        name: 'Quadstripe',
        nameKo: '쿼드 스트라이프',
        description: '핀스트라이프 2줄 + 옆구리 줄무늬 2줄 = 총 4줄'
    },
    {
        id: 'soft_scale',
        name: 'Soft Scale',
        nameKo: '소프트 스케일',
        description: 'AC Reptiles 라인. 비늘 간격이 넓고 부드러운 질감'
    }
];

export const INDEPENDENT_TRAITS: PatternTrait[] = [
    { id: 'dalmatian', name: 'Dalmatian', nameKo: '달마시안', description: '몸에 검은 점. 슈퍼 달마시안은 100개 이상' },
    { id: 'ink_spot', name: 'Ink Spot', nameKo: '잉크 스팟', description: '점이 크고 굵음' },
    { id: 'confetti', name: 'Confetti', nameKo: '콘페티', description: '검은 점 외에 다양한 색의 점' },
    { id: 'white_wall', name: 'White Wall', nameKo: '화이트 월', description: '옆구리 하단에 흰색 면' },
    { id: 'empty_back', name: 'Empty Back', nameKo: '엠티 백', description: '등 패턴이 지워져 베이스만 남음' }
];

// ============================================
// Base Colors (베이스 컬러)
// ============================================

export const BASE_COLORS: BaseColor[] = [
    { id: 'buckskin', name: 'Buckskin', nameKo: '벅스킨', description: '야생형. 패턴 없는 갈색/베이지색' },
    { id: 'dark_black', name: 'Dark/Black', nameKo: '다크/블랙', description: '멜라닌이 강한 고동색/검은색' },
    { id: 'red', name: 'Red', nameKo: '레드', description: '붉은색 주. 패턴리스나 바이컬러 많음' },
    { id: 'cream', name: 'Cream', nameKo: '크림', description: '색소가 옅은 상아색' },
    { id: 'lavender', name: 'Lavender', nameKo: '라벤더', description: '파이어 다운 시 보랏빛 회색' }
];

// ============================================
// Myths & Misconceptions (오해)
// ============================================

export const MISCONCEPTIONS: Misconception[] = [
    {
        term: 'Moonstone',
        termKo: '문스톤',
        isReal: false,
        reality: '크레스티드 게코의 공식 유전 모프가 아님',
        explanation: '콘 스네이크 모프명. 크레스티드 게코에서는 마케팅 용어.'
    },
    {
        term: 'Piebald',
        termKo: '파이볼드',
        isReal: false,
        reality: '재생산 가능한 파이볼드 라인 없음',
        explanation: 'Patient Zero가 발견되었으나 유전적 증명 실패.'
    },
    {
        term: 'Blue Crested Gecko',
        termKo: '블루 크레스티드 게코',
        isReal: false,
        reality: '진짜 파란색 존재하지 않음',
        explanation: '라벤더/회색이 특정 조명에서 파랗게 보이는 것.'
    }
];

// ============================================
// Designer Combos (콤보 모프)
// ============================================

export const DESIGNER_COMBOS: DesignerCombo[] = [
    { name: 'Frappuccino', nameKo: '프라푸치노', components: ['Cappuccino', 'Lilly White'], description: '카푸치노 색상 억제 + 릴리 화이트의 극적 대비' },
    { name: 'Axanthic Lilly', nameKo: '아잔틱 릴리', components: ['Axanthic', 'Lilly White'], description: '흑백 영화 같은 무채색 조화' },
    { name: 'Creamsicle', nameKo: '크림시클', components: ['Yellow/Orange Base', 'Cream Pattern'], description: '오렌지에 크림색 패턴, 아이스크림 색감' },
    { name: 'Super Stripe', nameKo: '슈퍼 스트라이프', components: ['Stripe Trait'], description: '등 중앙 스트라이프 + 핀스트라이프 5줄 구조' },
    { name: 'Phantom Lilly', nameKo: '팬텀 릴리', components: ['Phantom', 'Lilly White'], description: '몽환적인 보랏빛/회색빛' }
];

// ============================================
// Health Risks (건강 위험)
// ============================================

export const RISKY_PAIRINGS: RiskyPairing[] = [
    {
        pairing: 'Lilly White x Lilly White',
        result: 'Super Lilly White',
        risk: '치사 유전 - 25% 확률로 배아 사망',
        riskLevel: 'lethal',
        recommendation: '절대 금지'
    },
    {
        pairing: 'Cappuccino x Cappuccino',
        result: 'Melanistic (Super Cappuccino)',
        risk: '콧구멍 축소, 안구 질환',
        riskLevel: 'high',
        recommendation: '전문가 관리 필요'
    }
];

// ============================================
// Utility Functions
// ============================================

/**
 * 모프 ID로 유전 모프 찾기
 */
export function getMorphById(id: string): GeneticMorph | undefined {
    return PROVEN_GENETIC_MORPHS.find(m => m.id === id);
}

/**
 * 모프 이름(한글/영문)으로 검색
 */
export function searchMorph(query: string): GeneticMorph | undefined {
    const q = query.toLowerCase();
    return PROVEN_GENETIC_MORPHS.find(
        m => m.name.toLowerCase().includes(q) || m.nameKo.includes(query)
    );
}

/**
 * 오해 용어 검증
 */
export function checkMisconception(term: string): Misconception | undefined {
    return MISCONCEPTIONS.find(
        m => m.term.toLowerCase().includes(term.toLowerCase()) || m.termKo.includes(term)
    );
}

/**
 * 치사 또는 위험한 슈퍼폼 체크
 */
export function isRiskyMorph(morphId: string): boolean {
    const morph = getMorphById(morphId);
    return morph?.isLethalSuper || morph?.hasHealthRisks || false;
}

/**
 * 팩트체크용 System Prompt 생성
 */
export function getFactCheckPrompt(): string {
    const morphRisks = PROVEN_GENETIC_MORPHS
        .filter(m => m.isLethalSuper || m.hasHealthRisks)
        .map(m => `- ${m.nameKo}: ${m.warning || m.healthIssues}`)
        .join('\n');

    const myths = MISCONCEPTIONS
        .map(m => `- ${m.termKo}: ${m.reality}`)
        .join('\n');

    return `
[크레스티드 게코 모프 백과사전]

## 위험한 모프 조합:
${morphRisks}

## 잘못된 용어:
${myths}

## 기억할 것:
- 릴리 x 릴리 = 치사
- 슈퍼 카푸치노 = 건강 문제
- 문스톤/파이볼드 = 공식 모프 아님
`.trim();
}
