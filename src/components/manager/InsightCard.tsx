'use client';

import { GeckoInsight } from '@/lib/care-data';

interface InsightCardProps {
    insight: GeckoInsight;
    className?: string;
}

const INSIGHT_STYLES = {
    growth: {
        bg: 'from-green-500/10 to-emerald-500/5',
        border: 'border-green-500/30',
        text: 'text-green-400'
    },
    hungry: {
        bg: 'from-orange-500/10 to-amber-500/5',
        border: 'border-orange-500/30',
        text: 'text-orange-400'
    },
    healthy: {
        bg: 'from-blue-500/10 to-cyan-500/5',
        border: 'border-blue-500/30',
        text: 'text-blue-400'
    },
    warning: {
        bg: 'from-red-500/10 to-rose-500/5',
        border: 'border-red-500/30',
        text: 'text-red-400'
    },
    need_data: {
        bg: 'from-zinc-500/10 to-zinc-500/5',
        border: 'border-zinc-500/30',
        text: 'text-zinc-400'
    }
};

export function InsightCard({ insight, className }: InsightCardProps) {
    const style = INSIGHT_STYLES[insight.type];

    return (
        <div className={`
            relative overflow-hidden rounded-xl border p-5
            bg-gradient-to-br ${style.bg} ${style.border}
            ${className}
        `}>
            {/* 배경 이모지 */}
            <div className="absolute -right-4 -bottom-4 text-8xl opacity-10 select-none">
                {insight.emoji}
            </div>

            <div className="relative z-10 flex items-start gap-4">
                <div className="text-4xl">{insight.emoji}</div>
                <div>
                    <h3 className={`font-bold text-lg ${style.text}`}>
                        AI 인사이트
                    </h3>
                    <p className="text-white mt-1 leading-relaxed">
                        {insight.message}
                    </p>
                </div>
            </div>
        </div>
    );
}
