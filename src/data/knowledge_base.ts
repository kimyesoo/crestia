/**
 * Crestia 크레스티드 게코 지식백과 (Knowledge Base)
 * 
 * PDF 자료에서 추출한 핵심 정보를 구조화한 상수 데이터입니다.
 * 프론트엔드에서 팩트체크, UI 표시, 검증 등에 활용합니다.
 */

// 모프 위험 정보
export interface MorphRisk {
    name: string;
    nameKo: string;
    type: string;
    typeKo: string;
    risk: string;
    riskKo: string;
    advice: string;
    adviceKo: string;
}

// 잘못된 정보 (오해)
export interface Misconception {
    term: string;
    termKo: string;
    isReal: boolean;
    correction: string;
    correctionKo: string;
}

// 식단 정보
export interface DietInfo {
    recommendation: string;
    recommendationKo: string;
    warning: string;
    warningKo: string;
    cgdBrands: string[];
    feedingSchedule: {
        juvenile: string;
        juvenileKo: string;
        adult: string;
        adultKo: string;
    };
    insectsRatio: string;
    insectsRatioKo: string;
}

// 온도 정보
export interface TemperatureInfo {
    optimalRange: string;
    warningHigh: string;
    warningHighKo: string;
    warningLow: string;
    warningLowKo: string;
    summerCaution: string;
    summerCautionKo: string;
}

// 전체 지식베이스 타입
export interface GeckoKnowledgeBase {
    morphRisks: MorphRisk[];
    misconceptions: Misconception[];
    diet: DietInfo;
    temperature: TemperatureInfo;
}

/**
 * 게코 팩트 데이터
 */
export const GECKO_FACTS: GeckoKnowledgeBase = {
    morphRisks: [
        {
            name: "Lilly White",
            nameKo: "릴리화이트",
            type: "Incomplete Dominant",
            typeKo: "불완전 우성",
            risk: "Super form (Lilly x Lilly) is lethal - embryos die before hatching",
            riskKo: "슈퍼폼(릴리 x 릴리)은 치사 유전 - 배아가 부화 전 사망",
            advice: "Do not breed Lilly White x Lilly White. Always pair with non-Lilly.",
            adviceKo: "릴리화이트 x 릴리화이트 교배는 절대 금지. 반드시 논릴리와 페어링."
        },
        {
            name: "Super Cappuccino",
            nameKo: "슈퍼 카푸치노",
            type: "Super Form",
            typeKo: "슈퍼폼",
            risk: "Health issues including small/deformed nostrils, translucent skin, reduced lifespan",
            riskKo: "작은/기형 콧구멍, 반투명 피부, 수명 단축 등 건강 문제",
            advice: "Requires expert care. Not recommended for beginners.",
            adviceKo: "전문가 수준의 관리 필요. 초보자 비권장."
        },
        {
            name: "Axanthic",
            nameKo: "악산틱",
            type: "Recessive (Line-dependent)",
            typeKo: "열성 (라인별 상이)",
            risk: "Multiple unrelated lines exist. Crossing different lines may not produce Axanthic offspring.",
            riskKo: "서로 다른 라인 다수 존재. 다른 라인끼리 교배 시 악산틱 자손이 안 나올 수 있음.",
            advice: "Verify line compatibility before breeding. Keep lineage records.",
            adviceKo: "교배 전 라인 호환성 확인 필수. 혈통 기록 유지."
        }
    ],

    misconceptions: [
        {
            term: "Moonstone",
            termKo: "문스톤",
            isReal: false,
            correction: "Moonstone is NOT a recognized Crested Gecko morph. It is a marketing term.",
            correctionKo: "문스톤은 공인된 크레스티드 게코 모프가 아닙니다. 마케팅 용어입니다."
        },
        {
            term: "Piebald",
            termKo: "파이볼드",
            isReal: false,
            correction: "Genetically proven Piebald lines do not exist in Crested Geckos yet.",
            correctionKo: "유전적으로 입증된 파이볼드 라인은 크레스티드 게코에 아직 없습니다."
        },
        {
            term: "Blue Crested Gecko",
            termKo: "블루 크레스티드 게코",
            isReal: false,
            correction: "True blue coloration does not exist. 'Blue' is usually gray under certain lighting.",
            correctionKo: "진짜 파란색은 존재하지 않습니다. '블루'는 보통 특정 조명 하의 회색."
        }
    ],

    diet: {
        recommendation: "Balanced diet of CGD + occasional insects (crickets, dubia roaches)",
        recommendationKo: "CGD + 간헐적 곤충(귀뚜라미, 두비아) 균형 식단",
        warning: "Do not feed only jelly, fruits, or baby food. These lack essential nutrients.",
        warningKo: "젤리, 과일, 이유식만 급여 금지. 필수 영양소 부족.",
        cgdBrands: ["Pangea", "Repashy", "Zoo Med"],
        feedingSchedule: {
            juvenile: "Every day or every other day",
            juvenileKo: "매일 또는 격일",
            adult: "2-3 times per week",
            adultKo: "주 2-3회"
        },
        insectsRatio: "10-20% of total diet for adults",
        insectsRatioKo: "성체 총 식단의 10-20%"
    },

    temperature: {
        optimalRange: "22-26°C (72-78°F)",
        warningHigh: "Above 28°C can cause heat stress and death",
        warningHighKo: "28°C 초과 시 열 스트레스 및 사망 위험",
        warningLow: "Below 18°C can slow metabolism dangerously",
        warningLowKo: "18°C 미만 시 신진대사 위험하게 저하",
        summerCaution: "Korea summers can be deadly. AC essential.",
        summerCautionKo: "한국 여름은 치명적. 에어컨 필수."
    }
};

/**
 * 특정 모프의 위험 정보 조회
 */
export function getMorphRisk(morphName: string): MorphRisk | undefined {
    return GECKO_FACTS.morphRisks.find(
        (m) => m.name.toLowerCase().includes(morphName.toLowerCase()) ||
            m.nameKo.includes(morphName)
    );
}

/**
 * 오해 검증
 */
export function checkMisconception(term: string): Misconception | undefined {
    return GECKO_FACTS.misconceptions.find(
        (m) => m.term.toLowerCase().includes(term.toLowerCase()) ||
            m.termKo.includes(term)
    );
}

/**
 * 팩트체크 문자열 생성 (System Prompt용)
 */
export function getFactCheckPrompt(): string {
    const risks = GECKO_FACTS.morphRisks
        .map((r) => `- ${r.nameKo}: ${r.riskKo}`)
        .join('\n');

    const misconceptions = GECKO_FACTS.misconceptions
        .map((m) => `- ${m.termKo}: ${m.correctionKo}`)
        .join('\n');

    return `
[크레스티드 게코 지식백과 - 필수 팩트]

## 모프별 위험:
${risks}

## 잘못된 정보 교정:
${misconceptions}

## 식단:
- ${GECKO_FACTS.diet.warningKo}
- 권장: ${GECKO_FACTS.diet.recommendationKo}

## 온도:
- 적정: ${GECKO_FACTS.temperature.optimalRange}
- ${GECKO_FACTS.temperature.warningHighKo}
- ${GECKO_FACTS.temperature.summerCautionKo}
`.trim();
}
