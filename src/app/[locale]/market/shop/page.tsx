'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag, Star, ExternalLink, Package, Sparkles, Home, MoreHorizontal } from 'lucide-react';

// Category Types
type Category = 'all' | 'feed' | 'enclosure' | 'decor' | 'etc';

// Mock Shop Data with Affiliate Links
const SHOP_ITEMS = [
    // Feed Category
    {
        id: 'shop-1',
        name: '레파시 크레스티드 게코 다이어트 170g',
        category: 'feed' as Category,
        price: 32000,
        rating: 4.8,
        reviewCount: 256,
        image: 'https://via.placeholder.com/400x400/1a1a1a/D4AF37?text=REPASHY',
        affiliateUrl: 'https://link.coupang.com/example-repashy',
        isBest: true,
    },
    {
        id: 'shop-2',
        name: '팡게아 바나나 파파야 468g',
        category: 'feed' as Category,
        price: 45000,
        rating: 4.9,
        reviewCount: 189,
        image: 'https://via.placeholder.com/400x400/1a1a1a/D4AF37?text=PANGEA',
        affiliateUrl: 'https://link.coupang.com/example-pangea',
        isBest: true,
    },
    {
        id: 'shop-3',
        name: '블랙 판테라 겔 푸드 100g',
        category: 'feed' as Category,
        price: 28000,
        rating: 4.5,
        reviewCount: 87,
        image: 'https://via.placeholder.com/400x400/1a1a1a/D4AF37?text=PANTERA',
        affiliateUrl: 'https://link.coupang.com/example-pantera',
        isBest: false,
    },

    // Enclosure Category
    {
        id: 'shop-4',
        name: '엑소테라 30x30x45 글라스테라리움',
        category: 'enclosure' as Category,
        price: 89000,
        rating: 4.7,
        reviewCount: 324,
        image: 'https://via.placeholder.com/400x400/1a1a1a/D4AF37?text=EXOTERRA',
        affiliateUrl: 'https://link.coupang.com/example-exoterra',
        isBest: true,
    },
    {
        id: 'shop-5',
        name: '주비 열대우림 사육장 45x45x60',
        category: 'enclosure' as Category,
        price: 145000,
        rating: 4.6,
        reviewCount: 112,
        image: 'https://via.placeholder.com/400x400/1a1a1a/D4AF37?text=ZOOMED',
        affiliateUrl: 'https://link.coupang.com/example-zoomed',
        isBest: false,
    },

    // Decor Category
    {
        id: 'shop-6',
        name: '코르크 바크 튜브 대형',
        category: 'decor' as Category,
        price: 15000,
        rating: 4.4,
        reviewCount: 201,
        image: 'https://via.placeholder.com/400x400/1a1a1a/D4AF37?text=CORK',
        affiliateUrl: 'https://link.coupang.com/example-cork',
        isBest: false,
    },
    {
        id: 'shop-7',
        name: '인공 덩굴식물 세트 (3개입)',
        category: 'decor' as Category,
        price: 12000,
        rating: 4.3,
        reviewCount: 156,
        image: 'https://via.placeholder.com/400x400/1a1a1a/D4AF37?text=VINES',
        affiliateUrl: 'https://link.coupang.com/example-vines',
        isBest: false,
    },
    {
        id: 'shop-8',
        name: '마그네틱 먹이그릇 (벽부착형)',
        category: 'decor' as Category,
        price: 18000,
        rating: 4.8,
        reviewCount: 445,
        image: 'https://via.placeholder.com/400x400/1a1a1a/D4AF37?text=LEDGE',
        affiliateUrl: 'https://link.coupang.com/example-ledge',
        isBest: true,
    },

    // Etc Category
    {
        id: 'shop-9',
        name: '디지털 온습도계 (흡착식)',
        category: 'etc' as Category,
        price: 9900,
        rating: 4.5,
        reviewCount: 567,
        image: 'https://via.placeholder.com/400x400/1a1a1a/D4AF37?text=THERMO',
        affiliateUrl: 'https://link.coupang.com/example-thermo',
        isBest: true,
    },
    {
        id: 'shop-10',
        name: '미스팅 스프레이 500ml',
        category: 'etc' as Category,
        price: 6500,
        rating: 4.2,
        reviewCount: 234,
        image: 'https://via.placeholder.com/400x400/1a1a1a/D4AF37?text=SPRAY',
        affiliateUrl: 'https://link.coupang.com/example-spray',
        isBest: false,
    },
];

// Category Config
const CATEGORIES: { key: Category; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: '전체', icon: <Package className="w-4 h-4" /> },
    { key: 'feed', label: '사료/먹이', icon: <Sparkles className="w-4 h-4" /> },
    { key: 'enclosure', label: '사육장', icon: <Home className="w-4 h-4" /> },
    { key: 'decor', label: '인테리어', icon: <Star className="w-4 h-4" /> },
    { key: 'etc', label: '기타용품', icon: <MoreHorizontal className="w-4 h-4" /> },
];

// Format price to Korean Won
function formatPrice(price: number): string {
    return price.toLocaleString('ko-KR') + '원';
}

// Star Rating Component
function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`w-3 h-3 ${star <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-600'}`}
                />
            ))}
            <span className="text-xs text-zinc-400 ml-1">{rating.toFixed(1)}</span>
        </div>
    );
}

export default function ShopPage() {
    const [selectedCategory, setSelectedCategory] = useState<Category>('all');

    // Filter items by category
    const filteredItems = selectedCategory === 'all'
        ? SHOP_ITEMS
        : SHOP_ITEMS.filter(item => item.category === selectedCategory);

    // Handle affiliate link click
    const handleProductClick = (affiliateUrl: string) => {
        window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="min-h-screen bg-black">
            {/* Header */}
            <div className="border-b border-zinc-800 bg-zinc-900/50">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center gap-4 mb-6">
                        <Link href="/market" className="text-zinc-400 hover:text-white transition">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                                <ShoppingBag className="w-6 h-6 text-[#D4AF37]" />
                                추천 용품샵
                            </h1>
                            <p className="text-sm text-zinc-500 mt-1">Crested Gecko Supplies</p>
                        </div>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map((category) => (
                            <button
                                key={category.key}
                                onClick={() => setSelectedCategory(category.key)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category.key
                                        ? 'bg-[#D4AF37] text-black'
                                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                                    }`}
                            >
                                {category.icon}
                                {category.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Affiliate Notice */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 mb-8 text-sm text-zinc-400">
                    <p>
                        💡 <span className="text-zinc-300">이 페이지는 제휴 링크를 포함하고 있습니다.</span> 구매 시 Crestia에 소정의 수수료가 지급되며, 이는 서비스 운영에 사용됩니다.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredItems.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => handleProductClick(item.affiliateUrl)}
                            className="bg-[#111111] border border-zinc-800 rounded-xl overflow-hidden hover:border-[#D4AF37]/50 transition-all duration-300 cursor-pointer group"
                        >
                            {/* Image */}
                            <div className="aspect-square relative bg-zinc-900">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />

                                {/* Best Badge */}
                                {item.isBest && (
                                    <div className="absolute top-2 left-2 bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-black px-2 py-0.5 rounded text-xs font-bold">
                                        BEST
                                    </div>
                                )}

                                {/* External Link Icon */}
                                <div className="absolute top-2 right-2 bg-black/70 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ExternalLink className="w-3 h-3 text-white" />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-3">
                                {/* Name */}
                                <h3 className="text-sm font-medium text-white mb-2 line-clamp-2 min-h-[40px]">
                                    {item.name}
                                </h3>

                                {/* Rating */}
                                <div className="mb-2">
                                    <StarRating rating={item.rating} />
                                    <span className="text-xs text-zinc-500">({item.reviewCount})</span>
                                </div>

                                {/* Price */}
                                <p className="text-lg font-bold text-[#D4AF37] mb-3">
                                    {formatPrice(item.price)}
                                </p>

                                {/* CTA Button */}
                                <button className="w-full py-2 bg-zinc-800 hover:bg-[#D4AF37] text-zinc-300 hover:text-black text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1">
                                    <ExternalLink className="w-3 h-3" />
                                    구매하러 가기
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredItems.length === 0 && (
                    <div className="text-center py-20">
                        <ShoppingBag className="w-16 h-16 mx-auto text-zinc-700 mb-4" />
                        <h3 className="text-xl font-bold text-zinc-400 mb-2">상품이 없습니다</h3>
                        <p className="text-zinc-600">다른 카테고리를 선택해 주세요.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
