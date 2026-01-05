// Types
export type FeedingType = 'insect' | 'cgd';

export interface WeightLog {
    id: string;
    gecko_id: string;
    weight: number;
    measured_at: string;
    notes?: string;
}

export interface FeedingLog {
    id: string;
    gecko_id: string;
    feeding_type: FeedingType;
    quantity?: number;
    fed_at: string;
    notes?: string;
}

export interface MergedCareLog {
    date: string;
    weight?: number;
    feeding?: FeedingType;
    feedingQuantity?: number;
    feedingNotes?: string;
    weightNotes?: string;
}

export interface GeckoInsight {
    type: 'growth' | 'hungry' | 'healthy' | 'warning' | 'need_data';
    message: string;
    emoji: string;
}

// ==========================================
// Data Processing Functions (클라이언트/서버 공용)
// ==========================================

/**
 * 날짜 기준으로 체중/급식 데이터 병합
 */
export function getMergedCareLogs(
    weightLogs: WeightLog[],
    feedingLogs: FeedingLog[]
): MergedCareLog[] {
    const dateMap = new Map<string, MergedCareLog>();

    // 체중 데이터 추가
    weightLogs.forEach(log => {
        const date = log.measured_at.split('T')[0]; // YYYY-MM-DD
        const existing = dateMap.get(date) || { date };
        existing.weight = Number(log.weight);
        existing.weightNotes = log.notes;
        dateMap.set(date, existing);
    });

    // 급식 데이터 추가
    feedingLogs.forEach(log => {
        const date = log.fed_at.split('T')[0]; // YYYY-MM-DD
        const existing = dateMap.get(date) || { date };
        existing.feeding = log.feeding_type;
        existing.feedingQuantity = log.quantity;
        existing.feedingNotes = log.notes;
        dateMap.set(date, existing);
    });

    // 날짜순 정렬
    return Array.from(dateMap.values()).sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );
}

// ==========================================
// Analysis Functions
// ==========================================

/**
 * 최근 30일 데이터 분석하여 인사이트 생성
 */
export function getGeckoInsights(
    weightLogs: WeightLog[],
    feedingLogs: FeedingLog[]
): GeckoInsight {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // 최근 30일 데이터 필터링
    const recentWeights = weightLogs.filter(
        log => new Date(log.measured_at) >= thirtyDaysAgo
    );
    const recentFeedings = feedingLogs.filter(
        log => new Date(log.fed_at) >= thirtyDaysAgo
    );

    // 데이터 부족 체크
    if (recentWeights.length < 3 && recentFeedings.length < 3) {
        return {
            type: 'need_data',
            message: '더 많은 기록이 필요해요. 꾸준히 기록해주세요!',
            emoji: '📊'
        };
    }

    // 마지막 급식일 체크
    if (recentFeedings.length > 0) {
        const lastFeedingDate = new Date(recentFeedings[recentFeedings.length - 1].fed_at);
        const daysSinceLastFeeding = Math.floor(
            (Date.now() - lastFeedingDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysSinceLastFeeding >= 4) {
            return {
                type: 'hungry',
                message: `밥 먹은 지 ${daysSinceLastFeeding}일 지났어요. 배고프지 않을까요?`,
                emoji: '⏰'
            };
        }
    }

    // 체중 변화 분석
    if (recentWeights.length >= 2) {
        const firstWeight = Number(recentWeights[0].weight);
        const lastWeight = Number(recentWeights[recentWeights.length - 1].weight);
        const weightChange = lastWeight - firstWeight;

        // 체중 감소 경고
        if (weightChange <= -3) {
            return {
                type: 'warning',
                message: '최근 체중이 줄었어요. 건강 상태를 확인해주세요.',
                emoji: '⚠️'
            };
        }

        // 충식 비율 계산
        const insectCount = recentFeedings.filter(f => f.feeding_type === 'insect').length;
        const insectRatio = recentFeedings.length > 0
            ? (insectCount / recentFeedings.length) * 100
            : 0;

        // 충식 효과 분석
        if (insectRatio > 60 && weightChange > 0) {
            return {
                type: 'growth',
                message: '귀뚜라미 효과가 좋네요! 폭풍 성장 중입니다.',
                emoji: '🦗'
            };
        }

        // CGD로 건강 유지
        if (insectRatio <= 40 && Math.abs(weightChange) < 2) {
            return {
                type: 'healthy',
                message: '슈퍼푸드로 건강하게 유지하고 있어요!',
                emoji: '🥣'
            };
        }
    }

    // 기본 인사이트
    return {
        type: 'healthy',
        message: '순조롭게 성장하고 있어요! 계속 기록해주세요.',
        emoji: '✨'
    };
}

/**
 * 급식 타입에 따른 아이콘 반환
 */
export function getFeedingIcon(type: FeedingType): string {
    return type === 'insect' ? '🦗' : '🥣';
}

/**
 * 급식 타입에 따른 한글 라벨 반환
 */
export function getFeedingLabel(type: FeedingType): string {
    return type === 'insect' ? '충식 (귀뚜라미)' : 'CGD (슈퍼푸드)';
}
