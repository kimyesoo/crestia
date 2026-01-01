// 제휴 상품 데이터 - 쿠팡 / 알리 분리
// 실제 링크로 교체 필요

export type ProductCategory = 'food' | 'housing' | 'lighting' | 'supplement' | 'decor' | 'tools';

export interface AffiliateProduct {
    id: string;
    name: string;
    description: string;
    price: string;
    originalPrice?: string;
    image: string;
    purchaseUrl: string;
    category: ProductCategory;
}

// =========================================
// 🚀 쿠팡 로켓배송 - 빠른 배송이 필요한 생필품
// =========================================
export const COUPANG_ITEMS: AffiliateProduct[] = [
    // 사료
    {
        id: 'cp-food-1',
        name: '판게아 슈퍼푸드 인섹트',
        description: '입문자 필수 사료, 곤충 단백질',
        price: '28,000원',
        image: '/images/products/pangea-insect.jpg',
        purchaseUrl: 'https://link.coupang.com/XXXXX',
        category: 'food',
    },
    {
        id: 'cp-food-2',
        name: '레파시 크레스티드 게코 다이어트',
        description: '프리미엄 MRP 사료',
        price: '32,000원',
        originalPrice: '38,000원',
        image: '/images/products/repashy-cgd.jpg',
        purchaseUrl: 'https://link.coupang.com/XXXXX',
        category: 'food',
    },
    {
        id: 'cp-food-3',
        name: '판게아 바나나 파파야',
        description: '과일 베이스, 기호성 최고',
        price: '26,000원',
        image: '/images/products/pangea-banana.jpg',
        purchaseUrl: 'https://link.coupang.com/XXXXX',
        category: 'food',
    },
    // 영양제
    {
        id: 'cp-supp-1',
        name: '렙토비트 칼슘 파우더 D3',
        description: '구루병 예방 필수',
        price: '12,000원',
        image: '/images/products/calcium-d3.jpg',
        purchaseUrl: 'https://link.coupang.com/XXXXX',
        category: 'supplement',
    },
    {
        id: 'cp-supp-2',
        name: '렙타민 종합 비타민',
        description: '영양 불균형 보완',
        price: '15,000원',
        image: '/images/products/reptamin.jpg',
        purchaseUrl: 'https://link.coupang.com/XXXXX',
        category: 'supplement',
    },
    // 급수/청소
    {
        id: 'cp-tools-1',
        name: '렙타 세이프 테라리움 클리너',
        description: '안전한 사육장 세정제',
        price: '18,000원',
        image: '/images/products/cleaner.jpg',
        purchaseUrl: 'https://link.coupang.com/XXXXX',
        category: 'tools',
    },
];

// =========================================
// 📦 알리익스프레스 직구 - 저렴한 공산품
// =========================================
export const ALI_ITEMS: AffiliateProduct[] = [
    // 온습도 관리
    {
        id: 'ali-tools-1',
        name: '디지털 온습도계',
        description: '오차 ±1%, 미니 사이즈',
        price: '3,200원',
        originalPrice: '8,900원',
        image: '/images/products/hygrometer.jpg',
        purchaseUrl: 'https://s.click.aliexpress.com/XXXXX',
        category: 'tools',
    },
    {
        id: 'ali-tools-2',
        name: 'USB 초음파 가습기',
        description: '소형 테라리움용',
        price: '8,500원',
        image: '/images/products/usb-fogger.jpg',
        purchaseUrl: 'https://s.click.aliexpress.com/XXXXX',
        category: 'tools',
    },
    {
        id: 'ali-tools-3',
        name: 'LED 타이머 콘센트',
        description: '조명 자동화 필수',
        price: '5,200원',
        image: '/images/products/timer.jpg',
        purchaseUrl: 'https://s.click.aliexpress.com/XXXXX',
        category: 'tools',
    },
    // 사육장 데코
    {
        id: 'ali-decor-1',
        name: '인조 덩굴 세트 (3개입)',
        description: '등반용, 자연스러운 연출',
        price: '4,800원',
        image: '/images/products/vines.jpg',
        purchaseUrl: 'https://s.click.aliexpress.com/XXXXX',
        category: 'decor',
    },
    {
        id: 'ali-decor-2',
        name: '코코넛 쉘 은신처',
        description: '천연 소재, 습도 유지',
        price: '3,500원',
        image: '/images/products/coconut-hide.jpg',
        purchaseUrl: 'https://s.click.aliexpress.com/XXXXX',
        category: 'decor',
    },
    {
        id: 'ali-decor-3',
        name: '흡착식 먹이그릇',
        description: '벽면 부착형, 공간 절약',
        price: '2,800원',
        image: '/images/products/feeding-cup.jpg',
        purchaseUrl: 'https://s.click.aliexpress.com/XXXXX',
        category: 'decor',
    },
    {
        id: 'ali-decor-4',
        name: '미니 분무기 300ml',
        description: '수동 미스팅용',
        price: '1,900원',
        image: '/images/products/spray.jpg',
        purchaseUrl: 'https://s.click.aliexpress.com/XXXXX',
        category: 'tools',
    },
    // 조명
    {
        id: 'ali-light-1',
        name: 'UVB 5.0 컴팩트 램프',
        description: '소형 테라리움용',
        price: '12,000원',
        originalPrice: '25,000원',
        image: '/images/products/uvb-lamp.jpg',
        purchaseUrl: 'https://s.click.aliexpress.com/XXXXX',
        category: 'lighting',
    },
];
