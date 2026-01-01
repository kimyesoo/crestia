'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Gavel, Clock, TrendingUp, Users, Flame } from 'lucide-react';

// Mock Auction Data
const AUCTION_ITEMS = [
    {
        id: 'auction-1',
        name: 'Phantom Axanthic',
        morph: 'Phantom Axanthic',
        image: '/images/gecko-placeholder.jpg',
        currentBid: 2500000,
        bidCount: 12,
        endTime: Date.now() + 2 * 60 * 60 * 1000 + 15 * 60 * 1000, // 2h 15m from now
        seller: 'CrestiaBreeder',
        isHot: true,
    },
    {
        id: 'auction-2',
        name: 'Super Lilly White',
        morph: 'Lilly White',
        image: '/images/gecko-placeholder.jpg',
        currentBid: 1800000,
        bidCount: 8,
        endTime: Date.now() + 5 * 60 * 60 * 1000 + 42 * 60 * 1000,
        seller: 'GoldGecko',
        isHot: false,
    },
    {
        id: 'auction-3',
        name: 'Cappuccino Het Axanthic',
        morph: 'Cappuccino',
        image: '/images/gecko-placeholder.jpg',
        currentBid: 3200000,
        bidCount: 15,
        endTime: Date.now() + 1 * 60 * 60 * 1000 + 5 * 60 * 1000,
        seller: 'PhantomBreeder',
        isHot: true,
    },
    {
        id: 'auction-4',
        name: 'Luwak Extreme',
        morph: 'Luwak',
        image: '/images/gecko-placeholder.jpg',
        currentBid: 4500000,
        bidCount: 20,
        endTime: Date.now() + 8 * 60 * 60 * 1000,
        seller: 'EliteGeckos',
        isHot: true,
    },
    {
        id: 'auction-5',
        name: 'Axanthic Female',
        morph: 'Axanthic',
        image: '/images/gecko-placeholder.jpg',
        currentBid: 1200000,
        bidCount: 5,
        endTime: Date.now() + 12 * 60 * 60 * 1000,
        seller: 'SilverScale',
        isHot: false,
    },
    {
        id: 'auction-6',
        name: 'Triple Het Male',
        morph: 'Triple Het',
        image: '/images/gecko-placeholder.jpg',
        currentBid: 950000,
        bidCount: 3,
        endTime: Date.now() + 24 * 60 * 60 * 1000,
        seller: 'GeneticKing',
        isHot: false,
    },
];

// Countdown Timer Component
function CountdownTimer({ endTime }: { endTime: number }) {
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const diff = endTime - Date.now();
            if (diff <= 0) {
                setIsExpired(true);
                return { hours: 0, minutes: 0, seconds: 0 };
            }
            return {
                hours: Math.floor(diff / (1000 * 60 * 60)),
                minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((diff % (1000 * 60)) / 1000),
            };
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [endTime]);

    if (isExpired) {
        return <span className="text-red-500 font-bold">종료됨</span>;
    }

    const isUrgent = timeLeft.hours < 2;

    return (
        <span className={`font-mono font-bold ${isUrgent ? 'text-red-400' : 'text-[#D4AF37]'}`}>
            {String(timeLeft.hours).padStart(2, '0')}h:{String(timeLeft.minutes).padStart(2, '0')}m:{String(timeLeft.seconds).padStart(2, '0')}s
        </span>
    );
}

// Format price to Korean Won
function formatPrice(price: number): string {
    return price.toLocaleString('ko-KR') + '원';
}

export default function AuctionPage() {
    return (
        <div className="min-h-screen bg-black">
            {/* Header */}
            <div className="border-b border-zinc-800 bg-zinc-900/50">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center gap-4 mb-4">
                        <Link href="/market" className="text-zinc-400 hover:text-white transition">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Gavel className="w-6 h-6 text-[#D4AF37]" />
                                실시간 경매
                            </h1>
                            <p className="text-sm text-zinc-500 mt-1">Premium Crested Gecko Auction</p>
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="flex flex-wrap gap-6 text-sm">
                        <div className="flex items-center gap-2 text-zinc-400">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <span>진행 중: <span className="text-white font-bold">{AUCTION_ITEMS.length}건</span></span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-400">
                            <Users className="w-4 h-4 text-blue-500" />
                            <span>총 입찰: <span className="text-white font-bold">{AUCTION_ITEMS.reduce((sum, item) => sum + item.bidCount, 0)}회</span></span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-400">
                            <Flame className="w-4 h-4 text-orange-500" />
                            <span>인기 경매: <span className="text-white font-bold">{AUCTION_ITEMS.filter(item => item.isHot).length}건</span></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Auction Grid */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {AUCTION_ITEMS.map((item) => (
                        <div
                            key={item.id}
                            className="bg-[#111111] border border-zinc-800 rounded-2xl overflow-hidden hover:border-[#D4AF37]/50 transition-all duration-300 group"
                        >
                            {/* Image */}
                            <div className="aspect-square relative bg-zinc-900">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400/18181b/D4AF37?text=CRESTIA';
                                    }}
                                />

                                {/* Hot Badge */}
                                {item.isHot && (
                                    <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                        <Flame className="w-3 h-3" />
                                        HOT
                                    </div>
                                )}

                                {/* Timer Badge */}
                                <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-[#D4AF37]" />
                                    <CountdownTimer endTime={item.endTime} />
                                </div>

                                {/* Bid Count */}
                                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-zinc-300">
                                    {item.bidCount}회 입찰
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                {/* Morph Tag */}
                                <div className="mb-2">
                                    <span className="text-xs text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-1 rounded-full">
                                        {item.morph}
                                    </span>
                                </div>

                                {/* Name */}
                                <h3 className="text-lg font-bold text-white mb-1">{item.name}</h3>
                                <p className="text-sm text-zinc-500 mb-4">by {item.seller}</p>

                                {/* Price & Bid */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-zinc-500 mb-1">현재 입찰가</p>
                                        <p className="text-xl font-bold text-[#D4AF37]">{formatPrice(item.currentBid)}</p>
                                    </div>
                                    <Link
                                        href={`/market/auction/${item.id}`}
                                        className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-black font-bold rounded-full hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all"
                                    >
                                        입찰하기
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State (if needed) */}
                {AUCTION_ITEMS.length === 0 && (
                    <div className="text-center py-20">
                        <Gavel className="w-16 h-16 mx-auto text-zinc-700 mb-4" />
                        <h3 className="text-xl font-bold text-zinc-400 mb-2">진행 중인 경매가 없습니다</h3>
                        <p className="text-zinc-600">새로운 경매가 시작되면 알려드릴게요!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
