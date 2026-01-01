export type ShopItem = {
    id: string;
    title: string;
    price: string;
    image: string;
    link: string;
    badges?: string[]; // e.g., ["품절임박", "강추"]
};

// =========================================
// 🇰🇷 쿠팡 로켓배송 (국내)
// =========================================
export const COUPANG_ITEMS: ShopItem[] = [
    {
        id: 'c1',
        title: '판게아 인섹트 슈퍼푸드 228g',
        price: '28,000원',
        image: 'https://thumbnail7.coupangcdn.com/thumbnails/remote/492x492ex/image/vendor_inventory/8f3c/2c5r6t7y8u9i0o.jpg', // 예시 이미지 (실제 이미지로 교체 권장)
        link: 'https://link.coupang.com/a/bCKx1y', // 예시 링크
        badges: ['강추', '로켓'],
    },
    {
        id: 'c2',
        title: '레파시 크레스티드 게코 다이어트 170g',
        price: '34,000원',
        image: 'https://thumbnail8.coupangcdn.com/thumbnails/remote/492x492ex/image/vendor_inventory/images/2018/10/26/11/4/2222.jpg',
        link: 'https://link.coupang.com/a/bCKy2z',
        badges: ['베스트'],
    },
    {
        id: 'c3',
        title: 'JIF 적재형 사육장 (대)',
        price: '8,500원',
        image: 'https://thumbnail6.coupangcdn.com/thumbnails/remote/492x492ex/image/vendor_inventory/images/2019/01/15/14/0/1111.jpg',
        link: 'https://link.coupang.com/a/bCKz3w',
    },
    {
        id: 'c4',
        title: '엑소테라 채집통 (특대)',
        price: '22,000원',
        image: 'https://thumbnail9.coupangcdn.com/thumbnails/remote/492x492ex/image/product/image/vendoritem/2019/02/08/3000189895/06e0e0.jpg',
        link: 'https://link.coupang.com/a/bCKa4s',
        badges: ['튼튼함'],
    },
    {
        id: 'c5',
        title: '렙토비트 칼슘제 (D3 포함)',
        price: '15,000원',
        image: 'https://thumbnail10.coupangcdn.com/thumbnails/remote/492x492ex/image/vendor_inventory/images/2018/06/04/17/8/5555.jpg',
        link: 'https://link.coupang.com/a/bCKb5d',
    },
];

// =========================================
// ✈️ 알리익스프레스 직구 (해외)
// =========================================
export const ALI_ITEMS: ShopItem[] = [
    {
        id: 'a1',
        title: '아크릴 사육장 (30x30x45)',
        price: '$18.50',
        image: 'https://ae01.alicdn.com/kf/S1234567890.jpg', // 예시 이미지
        link: 'https://s.click.aliexpress.com/e/_DdYx1', // 예시 링크
        badges: ['가성비'],
    },
    {
        id: 'a2',
        title: '디지털 온습도계 (미니)',
        price: '$2.50',
        image: 'https://ae01.alicdn.com/kf/S0987654321.jpg',
        link: 'https://s.click.aliexpress.com/e/_EeZ2',
        badges: ['초저가'],
    },
    {
        id: 'a3',
        title: '인조 덩굴 (2m)',
        price: '$3.20',
        image: 'https://ae01.alicdn.com/kf/S1122334455.jpg',
        link: 'https://s.click.aliexpress.com/e/_FfA3',
    },
    {
        id: 'a4',
        title: '코르크 보드 (배경용)',
        price: '$12.00',
        image: 'https://ae01.alicdn.com/kf/S5544332211.jpg',
        link: 'https://s.click.aliexpress.com/e/_GgB4',
    },
    {
        id: 'a5',
        title: '자동 급수기 (미스팅기)',
        price: '$25.00',
        image: 'https://ae01.alicdn.com/kf/S9988776655.jpg',
        link: 'https://s.click.aliexpress.com/e/_HhC5',
        badges: ['편리함'],
    },
];
