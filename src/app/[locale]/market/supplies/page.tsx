'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Rocket, Package, SearchX } from 'lucide-react';
import { COUPANG_ITEMS, ALI_ITEMS, type ShopItem } from '@/constants/shopData';
import { SimpleProductCard } from '@/components/shop/SimpleProductCard';

type TabType = 'coupang' | 'ali';

export default function SuppliesPage() {
    const [activeTab, setActiveTab] = useState<TabType>('coupang');

    const currentItems: ShopItem[] = activeTab === 'coupang' ? COUPANG_ITEMS : ALI_ITEMS;

    return (
        <div className="min-h-screen bg-black pt-28 pb-16 px-4">
            <div className="max-w-6xl mx-auto">
                {/* 헤더 영역 */}
                <div className="flex flex-col items-center text-center mb-10">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition mb-6 text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        홈으로 돌아가기
                    </Link>

                    <h1 className="text-3xl font-bold text-white mb-3">
                        <span className="text-[#D4AF37]">사육 용품</span> 추천
                    </h1>
                    <p className="text-zinc-500 max-w-lg">
                        크레스티드 게코 사육에 꼭 필요한 용품들을 엄선했습니다.
                        <br className="hidden sm:block" />
                        배송 속도와 가격에 따라 쇼핑몰을 선택해보세요.
                    </p>
                </div>

                {/* 탭 네비게이션 */}
                <div className="max-w-md mx-auto mb-10 bg-zinc-900 border border-zinc-800 rounded-full p-1 flex relative">
                    {/* 선택된 탭 배경 애니메이션 (선택 사항 - 여기선 간단히 스타일로 처리) */}

                    <button
                        onClick={() => setActiveTab('coupang')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-full font-bold transition-all relative z-10 ${activeTab === 'coupang'
                                ? 'bg-red-600 text-white shadow-lg'
                                : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                    >
                        <Rocket className="w-4 h-4" />
                        <span className="text-sm">국내배송 (쿠팡)</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('ali')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-full font-bold transition-all relative z-10 ${activeTab === 'ali'
                                ? 'bg-orange-500 text-white shadow-lg'
                                : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                    >
                        <Package className="w-4 h-4" />
                        <span className="text-sm">해외직구 (알리)</span>
                    </button>
                </div>

                {/* 탭 설명 배너 */}
                <div className={`max-w-3xl mx-auto p-4 rounded-xl mb-8 flex items-start gap-3 border ${activeTab === 'coupang'
                        ? 'bg-red-950/20 border-red-900/30'
                        : 'bg-orange-950/20 border-orange-900/30'
                    }`}>
                    <div className={`p-2 rounded-lg ${activeTab === 'coupang' ? 'bg-red-900/40 text-red-500' : 'bg-orange-900/40 text-orange-500'
                        }`}>
                        {activeTab === 'coupang' ? <Rocket className="w-5 h-5" /> : <Package className="w-5 h-5" />}
                    </div>
                    <div>
                        <h3 className={`font-bold mb-1 ${activeTab === 'coupang' ? 'text-red-500' : 'text-orange-500'
                            }`}>
                            {activeTab === 'coupang' ? '로켓배송으로 빠르게!' : '직구로 저렴하게!'}
                        </h3>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                            {activeTab === 'coupang'
                                ? '사료, 영양제 등 당장 필요한 생필품은 쿠팡 로켓배송을 추천합니다. 빠르면 내일 도착합니다.'
                                : '사육장, 조명, 인테리어 용품 등은 알리익스프레스가 훨씬 저렴합니다. 배송 기간은 1-2주 소요될 수 있습니다.'}
                        </p>
                    </div>
                </div>

                {/* 상품 그리드 */}
                {currentItems.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {currentItems.map((item) => (
                            <SimpleProductCard
                                key={item.id}
                                item={item}
                                platform={activeTab}
                            />
                        ))}
                    </div>
                ) : (
                    /* 데이터 없음 (Empty State) */
                    <div className="py-20 text-center border border-dashed border-zinc-800 rounded-xl bg-zinc-900/30">
                        <SearchX className="w-12 h-12 mx-auto text-zinc-600 mb-4" />
                        <h3 className="text-xl font-bold text-zinc-400 mb-2">상품 준비 중입니다</h3>
                        <p className="text-zinc-500">
                            더 좋은 상품을 찾고 있습니다.<br />조금만 기다려주세요!
                        </p>
                    </div>
                )}

                {/* 하단 안내 문구 */}
                <div className="mt-16 pt-8 border-t border-zinc-900 text-center">
                    <p className="text-[11px] text-zinc-700">
                        * 본 페이지의 링크를 통해 상품 구매 시, 파트너스 활동의 일환으로 일정액의 수수료를 제공받을 수 있습니다.
                    </p>
                </div>
            </div>
        </div>
    );
}
