"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import html2canvas from "html2canvas";
import Link from "next/link";
import { GeckoCardFinal, CardFrontFinal, CardBackFinal } from "@/components/gecko/GeckoCardFinal";



const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function GeckoCardPage() {
    const params = useParams();
    const router = useRouter();
    const [isFlipped, setIsFlipped] = useState(false);
    const [gecko, setGecko] = useState<any>(null); // Ideally use GeckoDetails interface
    const [loading, setLoading] = useState(true);
    const [localImageBase64, setLocalImageBase64] = useState<string | null>(null);

    // 1. 데이터 로드
    useEffect(() => {
        const fetchGecko = async () => {
            if (!params.id) return;
            try {
                // Fetch with Deep Lineage (Grandparents)
                // Note: Aliasing FK relationships: sire:sire_id (...), dam:dam_id (...)
                const { data, error } = await supabase
                    .from("geckos")
                    .select(`
                        *,
                        sire:sire_id (
                            id, name,
                            sire:sire_id (id, name),
                            dam:dam_id (id, name)
                        ),
                        dam:dam_id (
                            id, name,
                            sire:sire_id (id, name),
                            dam:dam_id (id, name)
                        )
                    `)
                    .eq("id", params.id)
                    .single();

                if (error) throw error;

                // Map data to GeckoDetails interface
                const mappedGecko = {
                    id: data.id,
                    imageUrl: data.image_url,
                    hatchDate: data.hatch_date,
                    morph: data.morph || 'Unknown',
                    breeder: data.breeder || 'Unknown',
                    sireName: data.sire?.name || 'N/A',
                    damName: data.dam?.name || 'N/A',
                    pedigree: {
                        sire: { id: data.sire?.id, name: data.sire?.name },
                        dam: { id: data.dam?.id, name: data.dam?.name },
                        grandSires: [
                            { id: data.sire?.sire?.id, name: data.sire?.sire?.name }, // Paternal Grandsire
                            { id: data.dam?.sire?.id, name: data.dam?.sire?.name }    // Maternal Grandsire
                        ],
                        grandDams: [
                            { id: data.sire?.dam?.id, name: data.sire?.dam?.name },   // Paternal Granddam
                            { id: data.dam?.dam?.id, name: data.dam?.dam?.name }      // Maternal Granddam
                        ]
                    }
                };

                setGecko(mappedGecko);
                if (data.image_url) fetchImageAsBase64(data.image_url);
            } catch (error) {
                console.error("Error fetching gecko:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGecko();
    }, [params.id]);

    // 2. 이미지 Base64 변환
    const fetchImageAsBase64 = async (url: string) => {
        try {
            const response = await fetch(`/api/proxy-image?url=${encodeURIComponent(url)}`);
            const blob = await response.blob();
            const reader = new FileReader();
            reader.onloadend = () => setLocalImageBase64(reader.result as string);
            reader.readAsDataURL(blob);
        } catch (err) {
            console.error("이미지 변환 실패:", err);
        }
    };

    // 3. 다운로드 핸들러
    const handleDownload = async (type: 'front' | 'back') => {
        // Target the GHOST element, not the screen element
        const targetId = type === 'front' ? "card-print-front" : "card-print-back";
        const element = document.getElementById(targetId);

        if (!element) {
            console.error("Print element not found:", targetId);
            return;
        }

        try {
            const canvas = await html2canvas(element, {
                vehicle: null,
                backgroundColor: null, // Force transparent background for clean cut
                scale: 1, // Already at high-res 1062x685, 1:1 capture
                useCORS: true,
                allowTaint: true,
                logging: false,
                width: 1062,
                height: 685,
                scrollX: 0,
                scrollY: 0,
                windowWidth: 1920, // Ensure ample viewport
                x: 0,
                y: 0,
                // Fix for lab()/oklab() color function parsing error
                onclone: (clonedDoc: Document) => {
                    // 1. Inject comprehensive CSS overrides
                    const style = clonedDoc.createElement('style');
                    style.innerHTML = `
                        /* Override Tailwind CSS lab()/oklab()/oklch() colors with HEX equivalents */
                        :root, * {
                            --tw-bg-opacity: 1 !important;
                            --tw-text-opacity: 1 !important;
                            --tw-border-opacity: 1 !important;
                        }
                        
                        /* White/Black */
                        .text-white, [class*="text-white"] { color: #ffffff !important; }
                        .text-black, [class*="text-black"] { color: #000000 !important; }
                        .bg-white, [class*="bg-white"] { background-color: #ffffff !important; }
                        .bg-black, [class*="bg-black"] { background-color: #000000 !important; }
                        
                        /* Zinc scale */
                        .text-zinc-50 { color: #fafafa !important; }
                        .text-zinc-100 { color: #f4f4f5 !important; }
                        .text-zinc-200 { color: #e4e4e7 !important; }
                        .text-zinc-300 { color: #d4d4d8 !important; }
                        .text-zinc-400 { color: #a1a1aa !important; }
                        .text-zinc-500 { color: #71717a !important; }
                        .text-zinc-600 { color: #52525b !important; }
                        .text-zinc-700 { color: #3f3f46 !important; }
                        .text-zinc-800 { color: #27272a !important; }
                        .text-zinc-900 { color: #18181b !important; }
                        .text-zinc-950 { color: #09090b !important; }
                        
                        .bg-zinc-50 { background-color: #fafafa !important; }
                        .bg-zinc-100 { background-color: #f4f4f5 !important; }
                        .bg-zinc-200 { background-color: #e4e4e7 !important; }
                        .bg-zinc-300 { background-color: #d4d4d8 !important; }
                        .bg-zinc-400 { background-color: #a1a1aa !important; }
                        .bg-zinc-500 { background-color: #71717a !important; }
                        .bg-zinc-600 { background-color: #52525b !important; }
                        .bg-zinc-700 { background-color: #3f3f46 !important; }
                        .bg-zinc-800 { background-color: #27272a !important; }
                        .bg-zinc-900 { background-color: #18181b !important; }
                        .bg-zinc-950 { background-color: #09090b !important; }
                        [class*="bg-zinc-900\\/"] { background-color: #18181b !important; }
                        [class*="bg-zinc-950\\/"] { background-color: #09090b !important; }
                        [class*="bg-black\\/"] { background-color: #000000 !important; }
                        
                        .border-zinc-800 { border-color: #27272a !important; }
                        .border-zinc-900 { border-color: #18181b !important; }
                        
                        /* Gold colors */
                        .text-gold-500, .text-\\[\\#D4AF37\\] { color: #D4AF37 !important; }
                        .bg-gold-500 { background-color: #D4AF37 !important; }
                        .border-gold-500, .border-\\[\\#D4AF37\\] { border-color: #D4AF37 !important; }
                        [class*="border-\\[\\#D4AF37\\]"] { border-color: #D4AF37 !important; }
                        
                        /* Gray scale (fallback) */
                        .text-gray-400 { color: #9ca3af !important; }
                        .text-gray-500 { color: #6b7280 !important; }
                        .text-gray-600 { color: #4b5563 !important; }
                        
                        /* Gradient backgrounds - use solid fallback */
                        [class*="bg-gradient"] { 
                            background-image: none !important;
                            background-color: #D4AF37 !important;
                        }
                        
                        /* Shadow overrides */
                        [class*="shadow"] {
                            box-shadow: none !important;
                        }
                    `;
                    clonedDoc.head.appendChild(style);

                    // 2. Traverse all elements and replace computed colors
                    const allElements = clonedDoc.querySelectorAll('*');
                    allElements.forEach((el) => {
                        const htmlEl = el as HTMLElement;
                        const computed = window.getComputedStyle(htmlEl);

                        // Replace any lab(), oklab(), oklch() colors with fallbacks
                        const bgColor = computed.backgroundColor;
                        const textColor = computed.color;
                        const borderColor = computed.borderColor;

                        if (bgColor && (bgColor.includes('lab(') || bgColor.includes('oklab(') || bgColor.includes('oklch('))) {
                            htmlEl.style.backgroundColor = '#000000';
                        }
                        if (textColor && (textColor.includes('lab(') || textColor.includes('oklab(') || textColor.includes('oklch('))) {
                            htmlEl.style.color = '#ffffff';
                        }
                        if (borderColor && (borderColor.includes('lab(') || borderColor.includes('oklab(') || borderColor.includes('oklch('))) {
                            htmlEl.style.borderColor = '#D4AF37';
                        }
                    });
                }
            } as any);

            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/png");
            link.download = `Crestia-${gecko?.id || 'Gecko'}-${type}.png`;
            link.click();
        } catch (err) {
            console.error("다운로드 에러:", err);
            alert("다운로드 실패: " + err);
        }
    };

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-[#D4AF37]">Loading...</div>;
    if (!gecko) return <div className="min-h-screen bg-black flex items-center justify-center text-red-500">Gecko not found.</div>;

    return (
        <div style={{ backgroundColor: '#000', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

            {/* 1. 화면 미리보기용 (사용자 편의를 위해 축소) */}
            <div className="flex items-center justify-center py-10" style={{ transform: 'scale(0.55)', transformOrigin: 'center' }}>
                <GeckoCardFinal gecko={gecko} displayImage={localImageBase64} />
            </div>

            {/* 2. 인쇄용 Ghost 요소 (사용자 눈엔 안 보임, 인쇄 규격 완벽 준수 1062x685) */}
            {/* Safe Area handled internally by GeckoCardFinal components. */}
            <div style={{ position: 'fixed', top: 0, left: '-9999px' }}>
                {/* Front Side Ghost */}
                <div id="card-print-front" style={{ width: '1062px', height: '685px', background: '#000' }}>
                    <CardFrontFinal gecko={gecko} displayImage={localImageBase64} />
                </div>

                {/* Back Side Ghost */}
                <div id="card-print-back" style={{ width: '1062px', height: '685px', background: '#000' }}>
                    <CardBackFinal gecko={gecko} />
                </div>
            </div>

            {/* 버튼 */}
            <div style={{ marginTop: '50px', display: 'flex', gap: '20px' }}>
                <button onClick={() => router.back()} style={{ padding: '12px 30px', borderRadius: '30px', border: '1px solid #D4AF37', background: 'transparent', color: '#D4AF37' }}>RETURN</button>
                <button
                    onClick={() => handleDownload('front')}
                    disabled={!localImageBase64 && gecko?.imageUrl}
                    style={{ padding: '12px 30px', borderRadius: '30px', border: 'none', background: 'linear-gradient(to bottom, #FBF5b7, #D4AF37)', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}
                >
                    DOWNLOAD FRONT
                </button>
                <button
                    onClick={() => handleDownload('back')}
                    disabled={!localImageBase64 && gecko?.imageUrl}
                    style={{ padding: '12px 30px', borderRadius: '30px', border: '1px solid #D4AF37', background: '#000', color: '#D4AF37', fontWeight: 'bold', cursor: 'pointer' }}
                >
                    DOWNLOAD BACK
                </button>
            </div>
        </div>
    );
}
