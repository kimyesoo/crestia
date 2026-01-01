'use client';

import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { type ShopItem } from '@/constants/shopData';

type PlatformType = 'coupang' | 'ali';

interface SimpleProductCardProps {
    item: ShopItem;
    platform: PlatformType;
}

export function SimpleProductCard({ item, platform }: SimpleProductCardProps) {
    const handlePurchase = () => {
        window.open(item.link, '_blank', 'noopener,noreferrer');
    };

    // 플랫폼별 스타일 설정
    const styles = {
        coupang: {
            buttonBg: 'bg-red-600 hover:bg-red-700',
            buttonLabel: '쿠팡에서 보기',
            badgeBg: 'bg-red-100 text-red-700',
        },
        ali: {
            buttonBg: 'bg-orange-500 hover:bg-orange-600',
            buttonLabel: '알리에서 보기',
            badgeBg: 'bg-orange-100 text-orange-700',
        }
    };

    const currentStyle = styles[platform];

    return (
        <div
            className="group relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all cursor-pointer shadow-sm hover:shadow-md"
            onClick={handlePurchase}
        >
            {/* 이미지 영역 */}
            <div className="relative aspect-square w-full bg-zinc-800 overflow-hidden">
                <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized // 외부 이미지 링크 사용 시 최적화 건너뛰기
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder-product.png';
                    }}
                />

                {/* 뱃지 */}
                {item.badges && item.badges.length > 0 && (
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {item.badges.map((badge, idx) => (
                            <span
                                key={idx}
                                className={`px-2 py-0.5 text-[10px] font-bold rounded ${currentStyle.badgeBg} shadow-sm backdrop-blur-sm bg-opacity-90`}
                            >
                                {badge}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* 정보 영역 */}
            <div className="p-4 flex flex-col gap-2">
                <h3 className="text-sm font-medium text-white line-clamp-2 leading-snug group-hover:text-zinc-200 transition-colors">
                    {item.title}
                </h3>

                <p className="text-lg font-bold text-white">
                    {item.price}
                </p>

                {/* 구매 버튼 */}
                <button
                    className={`w-full mt-2 py-2.5 rounded-lg text-sm font-bold text-white transition-colors flex items-center justify-center gap-1.5 ${currentStyle.buttonBg}`}
                >
                    {currentStyle.buttonLabel}
                    <ExternalLink className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}
