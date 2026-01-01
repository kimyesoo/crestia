'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Timer, Gavel, Heart, Share2, Shield, Truck, User, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

// ============================================
// TYPES & MOCK DATA
// ============================================

interface BidHistory {
    id: string;
    bidder: string;
    amount: number;
    timestamp: Date;
}

interface AuctionDetail {
    id: string;
    title: string;
    morph: string;
    gender: 'male' | 'female';
    weight: number;
    birthDate: string;
    images: string[];
    currentBid: number;
    buyNowPrice: number | null;
    startingPrice: number;
    bidIncrement: number;
    bidCount: number;
    viewCount: number;
    endTime: Date;
    seller: {
        name: string;
        rating: number;
        verified: boolean;
        sales: number;
        avatar: string;
    };
    tags: string[];
    description: string;
    pedigree: string;
    shippingInfo: string;
    bidHistory: BidHistory[];
}

const MOCK_AUCTION: AuctionDetail = {
    id: '1',
    title: '프라푸치노 수컷 - 완벽한 패턴',
    morph: 'Frappuccino',
    gender: 'male',
    weight: 45,
    birthDate: '2024-06-15',
    images: [
        'https://images.unsplash.com/photo-1585095595205-e68428a9c9db?w=800',
        'https://images.unsplash.com/photo-1504450874802-0ba2bcd9b5ae?w=800',
        'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800',
        'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=800',
    ],
    currentBid: 2500000,
    buyNowPrice: 3500000,
    startingPrice: 1500000,
    bidIncrement: 50000,
    bidCount: 15,
    viewCount: 234,
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000 + 15 * 60 * 1000),
    seller: {
        name: 'CRESTIA_OFFICIAL',
        rating: 5.0,
        verified: true,
        sales: 127,
        avatar: '🦎',
    },
    tags: ['LillyWhite', 'Cappuccino', 'HighEnd', 'Investment'],
    description: `
## 개체 소개

이 프라푸치노 개체는 2024년 6월 15일에 출생한 수컷으로, 릴리 화이트와 카푸치노의 완벽한 조합을 보여줍니다.

### 특징
- **패턴**: 머리부터 꼬리까지 이어지는 선명한 화이트 패턴
- **발색**: 따뜻한 갈색 톤의 카푸치노 베이스 컬러
- **구조**: 건강한 체형과 완벽한 꼬리 재생

### 혈통
- **아버지**: Super Cappuccino (CRESTIA 직접 브리딩)
- **어머니**: Lilly White (Pangea Reptile 라인)

### 브리더 코멘트
"이 개체는 프라푸치노 라인 중에서도 특히 패턴이 선명하고 발색이 뛰어납니다. 브리딩 목적으로 매우 추천드리며, 다음 세대에서 높은 확률로 설악(Seorak) 생산이 가능합니다."
    `,
    pedigree: `
### 혈통 정보

**3세대 혈통 추적 완료**

| 세대 | 아버지 라인 | 어머니 라인 |
|------|------------|------------|
| 부모 | Super Cappuccino | Lilly White |
| 조부모 | Cappuccino x Cappuccino | Lilly x Normal |
| 증조부모 | 순수 카푸치노 라인 | Pangea Reptile 수입 라인 |

**유전 분석:**
- Cappuccino: 100% 확정
- Lilly White: 100% 확정
- 프라푸치노 Expression: Visual
    `,
    shippingInfo: `
### 배송 안내

🚚 **익일 배송** (14시 이전 결제 시)

**배송 방법:**
- 전문 파충류 운송 박스 사용
- 온도 조절 핫팩/쿨팩 동봉
- 실시간 배송 추적 제공

**배송비:**
- 서울/경기: 무료
- 그 외 지역: ₩5,000
- 제주/도서산간: ₩15,000

**주의사항:**
- 기상 악화 시 배송 지연 가능
- 개봉 후 1시간 이내 이상 발견 시 보상
- 라이브 도착 보장 (DOA 보상)

📞 배송 관련 문의: 010-XXXX-XXXX
    `,
    bidHistory: [
        { id: '1', bidder: 'k***1', amount: 2500000, timestamp: new Date(Date.now() - 5 * 60 * 1000) },
        { id: '2', bidder: 'g***o', amount: 2450000, timestamp: new Date(Date.now() - 15 * 60 * 1000) },
        { id: '3', bidder: 'r***7', amount: 2400000, timestamp: new Date(Date.now() - 30 * 60 * 1000) },
        { id: '4', bidder: 'k***1', amount: 2350000, timestamp: new Date(Date.now() - 45 * 60 * 1000) },
        { id: '5', bidder: 'm***e', amount: 2300000, timestamp: new Date(Date.now() - 60 * 60 * 1000) },
    ],
};

// ============================================
// COUNTDOWN HOOK
// ============================================

function useCountdown(endTime: Date) {
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, isUrgent: false });

    useEffect(() => {
        const calculate = () => {
            const diff = endTime.getTime() - Date.now();
            if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0, isUrgent: false };
            return {
                hours: Math.floor(diff / (1000 * 60 * 60)),
                minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((diff % (1000 * 60)) / 1000),
                isUrgent: diff < 60 * 60 * 1000,
            };
        };

        setTimeLeft(calculate());
        const timer = setInterval(() => setTimeLeft(calculate()), 1000);
        return () => clearInterval(timer);
    }, [endTime]);

    return timeLeft;
}

// ============================================
// MAIN PAGE
// ============================================

export default function AuctionDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const auction = MOCK_AUCTION; // In real app, fetch by resolvedParams.id
    const countdown = useCountdown(auction.endTime);

    const [selectedImage, setSelectedImage] = useState(0);
    const [bidAmount, setBidAmount] = useState(auction.currentBid + auction.bidIncrement);
    const [isLiked, setIsLiked] = useState(false);
    const [isBidding, setIsBidding] = useState(false);

    const formatPrice = (price: number) => new Intl.NumberFormat('ko-KR').format(price);
    const formatTime = (ago: Date) => {
        const diff = Date.now() - ago.getTime();
        const mins = Math.floor(diff / (1000 * 60));
        if (mins < 60) return `${mins}분 전`;
        const hours = Math.floor(mins / 60);
        return `${hours}시간 전`;
    };

    const handleBid = async () => {
        if (bidAmount < auction.currentBid + auction.bidIncrement) {
            toast.error(`최소 입찰 금액은 ₩${formatPrice(auction.currentBid + auction.bidIncrement)}입니다.`);
            return;
        }

        setIsBidding(true);
        // Simulate API call
        await new Promise(r => setTimeout(r, 1000));
        setIsBidding(false);
        toast.success('🎉 입찰 성공! 현재 최고 입찰자입니다.');
    };

    const handleBuyNow = async () => {
        setIsBidding(true);
        await new Promise(r => setTimeout(r, 1000));
        setIsBidding(false);
        toast.success('🎉 즉시 구매 완료! 판매자에게 연락드리겠습니다.');
    };

    return (
        <div className="min-h-screen bg-background pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
                    <Link href="/market/auction" className="hover:text-white flex items-center gap-1">
                        <ArrowLeft className="w-4 h-4" />
                        경매 목록
                    </Link>
                    <span>/</span>
                    <span className="text-zinc-400">{auction.morph}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Image Gallery */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={auction.images[selectedImage]}
                                alt={auction.title}
                                className="w-full h-full object-cover"
                            />

                            {/* Navigation */}
                            <button
                                onClick={() => setSelectedImage(i => (i - 1 + auction.images.length) % auction.images.length)}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={() => setSelectedImage(i => (i + 1) % auction.images.length)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>

                            {/* Timer Overlay */}
                            <div className={`absolute bottom-4 left-4 px-4 py-2 rounded-xl font-mono text-lg font-bold flex items-center gap-2 ${countdown.isUrgent ? 'bg-red-500 text-white animate-pulse' : 'bg-black/80 text-white'
                                }`}>
                                <Timer className="w-5 h-5" />
                                {String(countdown.hours).padStart(2, '0')}h {String(countdown.minutes).padStart(2, '0')}m {String(countdown.seconds).padStart(2, '0')}s
                            </div>
                        </div>

                        {/* Thumbnails */}
                        <div className="flex gap-3 overflow-x-auto pb-2">
                            {auction.images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                                            ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/30'
                                            : 'border-zinc-700 hover:border-zinc-500'
                                        }`}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Info & Bidding */}
                    <div className="space-y-6">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                            {auction.tags.map(tag => (
                                <span key={tag} className="text-xs px-3 py-1 bg-[#D4AF37]/20 text-[#D4AF37] rounded-full">
                                    #{tag}
                                </span>
                            ))}
                        </div>

                        {/* Title */}
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">{auction.title}</h1>
                            <div className="flex items-center gap-3">
                                <Badge variant="outline" className="border-zinc-700">
                                    {auction.morph}
                                </Badge>
                                <span className={`text-xl ${auction.gender === 'male' ? 'text-blue-400' : 'text-pink-400'}`}>
                                    {auction.gender === 'male' ? '♂ 수컷' : '♀ 암컷'}
                                </span>
                            </div>
                        </div>

                        {/* Quick Info */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-center">
                                <p className="text-zinc-500 text-xs mb-1">무게</p>
                                <p className="text-white font-bold">{auction.weight}g</p>
                            </div>
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-center">
                                <p className="text-zinc-500 text-xs mb-1">생년월일</p>
                                <p className="text-white font-bold">{auction.birthDate}</p>
                            </div>
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-center">
                                <p className="text-zinc-500 text-xs mb-1">입찰수</p>
                                <p className="text-white font-bold">{auction.bidCount}회</p>
                            </div>
                        </div>

                        {/* Price Panel */}
                        <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl p-6 space-y-4">
                            <div className="flex justify-between items-baseline">
                                <span className="text-zinc-400">현재가</span>
                                <span className="text-4xl font-bold text-[#D4AF37] font-mono">
                                    ₩{formatPrice(auction.currentBid)}
                                </span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500">시작가</span>
                                <span className="text-zinc-400">₩{formatPrice(auction.startingPrice)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500">입찰 단위</span>
                                <span className="text-zinc-400">₩{formatPrice(auction.bidIncrement)}</span>
                            </div>

                            {auction.buyNowPrice && (
                                <div className="flex justify-between text-sm pt-2 border-t border-zinc-700">
                                    <span className="text-zinc-500">즉시구매가</span>
                                    <span className="text-white font-bold">₩{formatPrice(auction.buyNowPrice)}</span>
                                </div>
                            )}
                        </div>

                        {/* Bid Controls */}
                        <div className="space-y-3">
                            <div className="flex gap-3">
                                <Input
                                    type="number"
                                    value={bidAmount}
                                    onChange={(e) => setBidAmount(Number(e.target.value))}
                                    className="bg-zinc-800 border-zinc-700 text-xl font-mono text-center"
                                    step={auction.bidIncrement}
                                    min={auction.currentBid + auction.bidIncrement}
                                />
                            </div>

                            <div className="flex gap-2">
                                {[50000, 100000, 200000].map(increment => (
                                    <Button
                                        key={increment}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setBidAmount(b => b + increment)}
                                        className="flex-1"
                                    >
                                        +₩{formatPrice(increment)}
                                    </Button>
                                ))}
                            </div>

                            <Button
                                onClick={handleBid}
                                disabled={isBidding}
                                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-[#D4AF37] to-[#C5A028] hover:from-[#C5A028] hover:to-[#B8942A] text-black"
                            >
                                <Gavel className="w-5 h-5 mr-2" />
                                {isBidding ? '입찰 중...' : `₩${formatPrice(bidAmount)} 입찰하기`}
                            </Button>

                            {auction.buyNowPrice && (
                                <Button
                                    onClick={handleBuyNow}
                                    disabled={isBidding}
                                    variant="outline"
                                    className="w-full h-12 border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/10"
                                >
                                    ₩{formatPrice(auction.buyNowPrice)} 즉시 구매
                                </Button>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setIsLiked(!isLiked)}
                                className="flex-1"
                            >
                                <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                                찜하기
                            </Button>
                            <Button variant="outline" className="flex-1">
                                <Share2 className="w-4 h-4 mr-2" />
                                공유
                            </Button>
                        </div>

                        {/* Seller Info */}
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-full flex items-center justify-center text-2xl">
                                    {auction.seller.avatar}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-white">{auction.seller.name}</span>
                                        {auction.seller.verified && (
                                            <CheckCircle2 className="w-4 h-4 text-blue-400" />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-zinc-400">
                                        <span>★ {auction.seller.rating}</span>
                                        <span>•</span>
                                        <span>{auction.seller.sales}회 거래</span>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">
                                    프로필
                                </Button>
                            </div>
                        </div>

                        {/* Bid History */}
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                            <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                                <Gavel className="w-4 h-4 text-[#D4AF37]" />
                                입찰 기록
                            </h3>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {auction.bidHistory.map((bid, index) => (
                                    <div key={bid.id} className="flex justify-between items-center text-sm py-2 border-b border-zinc-800 last:border-0">
                                        <div className="flex items-center gap-2">
                                            <span className={`font-mono ${index === 0 ? 'text-[#D4AF37]' : 'text-zinc-400'}`}>
                                                {bid.bidder}
                                            </span>
                                            {index === 0 && <Badge className="bg-[#D4AF37] text-black text-xs">최고</Badge>}
                                        </div>
                                        <div className="text-right">
                                            <span className="font-mono text-white">₩{formatPrice(bid.amount)}</span>
                                            <span className="text-zinc-500 text-xs ml-2">{formatTime(bid.timestamp)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs: Description / Shipping / Pedigree */}
                <div className="mt-12">
                    <Tabs defaultValue="description" className="w-full">
                        <TabsList className="w-full bg-zinc-900/50 border border-zinc-800 p-1 h-auto">
                            <TabsTrigger value="description" className="flex-1 py-3">
                                📝 개체 설명
                            </TabsTrigger>
                            <TabsTrigger value="shipping" className="flex-1 py-3">
                                🚚 배송 안내
                            </TabsTrigger>
                            <TabsTrigger value="breeder" className="flex-1 py-3">
                                🧬 혈통 정보
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="description" className="mt-6">
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 prose prose-invert prose-zinc max-w-none">
                                <div className="whitespace-pre-wrap text-zinc-300">{auction.description}</div>
                            </div>
                        </TabsContent>

                        <TabsContent value="shipping" className="mt-6">
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 prose prose-invert prose-zinc max-w-none">
                                <div className="whitespace-pre-wrap text-zinc-300">{auction.shippingInfo}</div>
                            </div>
                        </TabsContent>

                        <TabsContent value="breeder" className="mt-6">
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 prose prose-invert prose-zinc max-w-none">
                                <div className="whitespace-pre-wrap text-zinc-300">{auction.pedigree}</div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Trust Badges */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex items-center gap-4">
                        <Shield className="w-10 h-10 text-emerald-400" />
                        <div>
                            <h4 className="font-bold text-white">Crestia 인증</h4>
                            <p className="text-sm text-zinc-500">검증된 개체만 거래</p>
                        </div>
                    </div>
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex items-center gap-4">
                        <Truck className="w-10 h-10 text-blue-400" />
                        <div>
                            <h4 className="font-bold text-white">안전 배송</h4>
                            <p className="text-sm text-zinc-500">DOA 보상 보장</p>
                        </div>
                    </div>
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex items-center gap-4">
                        <AlertCircle className="w-10 h-10 text-[#D4AF37]" />
                        <div>
                            <h4 className="font-bold text-white">에스크로 결제</h4>
                            <p className="text-sm text-zinc-500">안전한 거래 보장</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
