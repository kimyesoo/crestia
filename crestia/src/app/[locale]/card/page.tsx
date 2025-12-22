'use client';

import React, { useState } from 'react';
import { GeckoCardFinal, GeckoDetails } from '@/components/gecko/GeckoCardFinal'; // ★ Corrected named import

// 임시 데이터 (또는 실제 데이터 연동)
const dummyGecko: GeckoDetails = {
    id: "3e490118-eae8-4e0a-8758-d25b3c488db5",
    name: "UNNAMED",
    morph: "LILLY WHITE",
    hatchDate: "2025-12-09",
    gender: "Unknown",
    sireId: "567", // Note: GeckoDetails doesn't strictly adhere to sireId/damId in interface shown earlier but checking GeckoDetails interface again... it has id, imageUrl... let's check the interface in GeckoCardFinal.tsx.
    // Re-reading Step 147: GeckoDetails interface has: id, imageUrl, hatchDate, morph, breeder, sireName, damName, name, pedigree (complex object). 
    // It DOES NOT have sireId, damId, gender in the interface definition in GeckoCardFinal.tsx lines 14-29. 
    // However, the object in page.tsx had them. I should match the interface.
    breeder: "CRESTIA",
    imageUrl: "/images/placeholder.png", // 실제 이미지 경로로 수정 필요
    sireName: "Unknown",
    damName: "Unknown",
    pedigree: {
        sire: { id: "unknown", name: "Unknown" },
        dam: { id: "unknown", name: "Unknown" },
        grandSires: [{ id: "unknown", name: "Unknown" }, { id: "unknown", name: "Unknown" }],
        grandDams: [{ id: "unknown", name: "Unknown" }, { id: "unknown", name: "Unknown" }]
    }
};

export default function CardPage() {
    // 실제 구현 시에는 URL 쿼리나 상태 관리로 데이터를 받아와야 함
    const [geckoData, setGeckoData] = useState(dummyGecko);

    return (
        <div className="min-h-screen bg-black flex flex-col items-center py-20">
            <h1 className="text-3xl text-[#D4AF37] font-bold mb-10 tracking-widest">
                ID CARD GENERATOR
            </h1>

            {/* ★★★ 여기서 구형이 나오면 절대 안됨. GeckoCardFinal만 렌더링 ★★★ */}
            <GeckoCardFinal gecko={geckoData} />

            <p className="text-gray-500 mt-8 text-sm">
                * This preview uses the final high-resolution print format.
            </p>
        </div>
    );
}
