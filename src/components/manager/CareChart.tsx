'use client';

import {
    ComposedChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceDot
} from 'recharts';
import { MergedCareLog, getFeedingIcon, getFeedingLabel } from '@/lib/care-data';

interface CareChartProps {
    data: MergedCareLog[];
    className?: string;
}

// 커스텀 툴팁 컴포넌트
function CustomTooltip({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{ payload: MergedCareLog }>;
    label?: string;
}) {
    if (!active || !payload || payload.length === 0) return null;

    const data = payload[0].payload;
    const dateStr = new Date(data.date).toLocaleDateString('ko-KR', {
        month: 'long',
        day: 'numeric',
        weekday: 'short'
    });

    return (
        <div className="bg-zinc-900/95 border border-zinc-700 rounded-lg p-4 shadow-xl backdrop-blur-sm">
            <p className="text-[#D4AF37] font-semibold mb-2">{dateStr}</p>

            {data.weight && (
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">⚖️</span>
                    <span className="text-white font-medium">{data.weight}g</span>
                </div>
            )}

            {data.feeding && (
                <div className="flex items-center gap-2">
                    <span className="text-lg">{getFeedingIcon(data.feeding)}</span>
                    <span className="text-zinc-300">
                        {getFeedingLabel(data.feeding)}
                        {data.feedingQuantity && ` x${data.feedingQuantity}`}
                    </span>
                </div>
            )}

            {data.feeding && data.weight && (
                <p className="text-xs text-zinc-400 mt-2 border-t border-zinc-700 pt-2">
                    이날은 {data.feeding === 'insect' ? '귀뚜라미' : 'CGD'}
                    {data.feedingQuantity ? ` ${data.feedingQuantity}${data.feeding === 'insect' ? '마리' : 'g'}` : ''}를 먹고 {data.weight}g이었네요!
                </p>
            )}
        </div>
    );
}

// 급식 아이콘 렌더러
function FeedingDot({ cx, cy, payload }: { cx: number; cy: number; payload: MergedCareLog }) {
    if (!payload.feeding) return null;

    return (
        <g transform={`translate(${cx - 10}, ${cy - 25})`}>
            <text
                fontSize="18"
                textAnchor="middle"
                dominantBaseline="middle"
                x="10"
                y="10"
            >
                {getFeedingIcon(payload.feeding)}
            </text>
        </g>
    );
}

export function CareChart({ data, className }: CareChartProps) {
    // 체중 데이터만 필터링 (차트에 line을 그리기 위해)
    const weightData = data.filter(d => d.weight !== undefined);

    // Y축 범위 계산
    const weights = weightData.map(d => d.weight!);
    const minWeight = Math.max(0, Math.min(...weights) - 5);
    const maxWeight = Math.max(...weights) + 5;

    if (data.length === 0) {
        return (
            <div className={`flex flex-col items-center justify-center h-64 bg-zinc-900/50 rounded-xl border border-zinc-800 ${className}`}>
                <span className="text-4xl mb-4">📊</span>
                <p className="text-zinc-400 text-center">
                    아직 기록이 없어요.<br />
                    체중과 급식을 기록해주세요!
                </p>
            </div>
        );
    }

    return (
        <div className={`bg-zinc-900/50 rounded-xl border border-zinc-800 p-4 ${className}`}>
            <h3 className="text-lg font-semibold text-[#D4AF37] mb-4 flex items-center gap-2">
                <span>📈</span> 성장 & 급식 차트
            </h3>

            <ResponsiveContainer width="100%" height={300}>
                <ComposedChart
                    data={data}
                    margin={{ top: 30, right: 20, bottom: 20, left: 10 }}
                >
                    <defs>
                        <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#333"
                        vertical={false}
                    />

                    <XAxis
                        dataKey="date"
                        stroke="#666"
                        tick={{ fill: '#888', fontSize: 11 }}
                        tickFormatter={(value) => {
                            const date = new Date(value);
                            return `${date.getMonth() + 1}/${date.getDate()}`;
                        }}
                        tickLine={false}
                        axisLine={{ stroke: '#444' }}
                    />

                    <YAxis
                        domain={[minWeight, maxWeight]}
                        stroke="#666"
                        tick={{ fill: '#888', fontSize: 11 }}
                        tickFormatter={(value) => `${value}g`}
                        tickLine={false}
                        axisLine={{ stroke: '#444' }}
                        width={45}
                    />

                    <Tooltip content={<CustomTooltip />} />

                    {/* 체중 라인 차트 */}
                    <Line
                        type="monotone"
                        dataKey="weight"
                        stroke="#D4AF37"
                        strokeWidth={3}
                        dot={{
                            fill: '#D4AF37',
                            strokeWidth: 2,
                            r: 5,
                            stroke: '#1a1a1a'
                        }}
                        activeDot={{
                            r: 8,
                            fill: '#D4AF37',
                            stroke: '#fff',
                            strokeWidth: 2
                        }}
                        connectNulls
                    />

                    {/* 급식 아이콘 표시 */}
                    {data.filter(d => d.feeding && d.weight).map((entry, index) => (
                        <ReferenceDot
                            key={`feeding-${index}`}
                            x={entry.date}
                            y={entry.weight!}
                            shape={(props) => <FeedingDot {...props} payload={entry} />}
                        />
                    ))}
                </ComposedChart>
            </ResponsiveContainer>

            {/* 범례 */}
            <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#D4AF37]" />
                    <span className="text-zinc-400">체중 (g)</span>
                </div>
                <div className="flex items-center gap-2">
                    <span>🦗</span>
                    <span className="text-zinc-400">충식</span>
                </div>
                <div className="flex items-center gap-2">
                    <span>🥣</span>
                    <span className="text-zinc-400">CGD</span>
                </div>
            </div>
        </div>
    );
}
