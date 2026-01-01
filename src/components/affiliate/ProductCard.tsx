'use client';

import Image from 'next/image';
import { type AffiliateProduct } from '@/constants/affiliateProducts';

type StoreTheme = 'coupang' | 'ali';

interface ProductCardProps {
    product: AffiliateProduct;
    theme?: StoreTheme;
}

// 테마별 색상
const THEME_COLORS = {
    coupang: {
        button: 'bg-[#E62E2E] hover:bg-[#CC2929]',
        accent: 'text-[#E62E2E]',
        label: '쿠팡 구매',
    },
    ali: {
        button: 'bg-[#FF6A00] hover:bg-[#E65E00]',
        accent: 'text-[#FF6A00]',
        label: '알리 구매',
    },
};

/**
 * 심플 상품 카드 컴포넌트
 * - 이미지 + 이름 + 가격 + 구매 버튼
 */
export function ProductCard({ product, theme = 'coupang' }: ProductCardProps) {
    const colors = THEME_COLORS[theme];

    const handlePurchase = () => {
        window.open(product.purchaseUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all group">
            {/* Image */}
            <div
                className="relative aspect-square bg-zinc-800 overflow-hidden cursor-pointer"
                onClick={handlePurchase}
            >
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder-product.png';
                    }}
                />
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Title */}
                <h3 className="font-bold text-white text-sm mb-1 line-clamp-2">
                    {product.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-zinc-500 mb-3 line-clamp-1">
                    {product.description}
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-4">
                    <span className={`text-lg font-bold ${colors.accent}`}>{product.price}</span>
                    {product.originalPrice && (
                        <span className="text-xs text-zinc-600 line-through">{product.originalPrice}</span>
                    )}
                </div>

                {/* Buy Button - Full Width */}
                <button
                    onClick={handlePurchase}
                    className={`w-full py-2.5 rounded-lg text-white font-bold text-sm transition-colors ${colors.button}`}
                >
                    {colors.label}
                </button>
            </div>
        </div>
    );
}

interface ProductGridProps {
    products: AffiliateProduct[];
    theme?: StoreTheme;
    columns?: 2 | 3 | 4;
}

/**
 * 상품 그리드 레이아웃
 */
export function ProductGrid({ products, theme = 'coupang', columns = 3 }: ProductGridProps) {
    const gridCols = {
        2: 'grid-cols-2',
        3: 'grid-cols-2 md:grid-cols-3',
        4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    };

    return (
        <div className={`grid ${gridCols[columns]} gap-4`}>
            {products.map((product) => (
                <ProductCard key={product.id} product={product} theme={theme} />
            ))}
        </div>
    );
}
