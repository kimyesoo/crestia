"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import html2canvas from "html2canvas";
import GeckoCardContent from "@/components/GeckoCardContent";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function GeckoCardPage() {
    const params = useParams();
    const router = useRouter();
    const [isFlipped, setIsFlipped] = useState(false);
    const [gecko, setGecko] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [localImageBase64, setLocalImageBase64] = useState<string | null>(null);

    // 1. 데이터 로드
    useEffect(() => {
        const fetchGecko = async () => {
            if (!params.id) return;
            try {
                // Fetch with Parent Names
                const { data, error } = await supabase
                    .from("geckos")
                    .select("*, sire:sire_id(name), dam:dam_id(name)")
                    .eq("id", params.id)
                    .single();
                if (error) throw error;

                // Flatten parent names for component compatibility if needed, 
                // but GeckoCardContent already handles `sire.name`.
                setGecko(data);
                if (data.image_url) fetchImageAsBase64(data.image_url);
            } catch (error) {
                console.error(error);
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
        const targetId = type === 'front' ? "print-front" : "print-back";
        const element = document.getElementById(targetId);

        if (!element) return;

        try {
            const canvas = await html2canvas(element, {
                backgroundColor: null,
                scale: 2, // 고화질
                useCORS: true,
                allowTaint: true,
                logging: false,
            });

            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/png");
            link.download = `Crestia-${gecko?.name}-${type}.png`;
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

            {/* 1. 화면에 보이는 3D 인터랙티브 카드 */}
            <div
                style={{ width: '700px', height: '440px', perspective: '1000px', cursor: 'pointer', userSelect: 'none' }}
                onClick={() => setIsFlipped(!isFlipped)}
            >
                <div style={{ position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d', transition: 'transform 0.8s', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                    <GeckoCardContent side="front" gecko={gecko} localImageBase64={localImageBase64} is3D={true} />
                    <GeckoCardContent side="back" gecko={gecko} localImageBase64={localImageBase64} is3D={true} />
                </div>
            </div>

            {/* 2. 숨겨진 인쇄용 카드 (Ghost Cards) */}
            <div style={{ position: 'fixed', top: 0, left: '-9999px', pointerEvents: 'none' }}>
                <div id="print-front">
                    <GeckoCardContent side="front" gecko={gecko} localImageBase64={localImageBase64} is3D={false} />
                </div>
                <div id="print-back">
                    <GeckoCardContent side="back" gecko={gecko} localImageBase64={localImageBase64} is3D={false} />
                </div>
            </div>

            {/* 버튼 */}
            <div style={{ marginTop: '50px', display: 'flex', gap: '20px' }}>
                <button onClick={() => router.back()} style={{ padding: '12px 30px', borderRadius: '30px', border: '1px solid #D4AF37', background: 'transparent', color: '#D4AF37' }}>RETURN</button>
                <button
                    onClick={() => handleDownload('front')}
                    disabled={!localImageBase64 && gecko?.image_url}
                    style={{ padding: '12px 30px', borderRadius: '30px', border: 'none', background: 'linear-gradient(to bottom, #FBF5b7, #D4AF37)', color: '#000', fontWeight: 'bold' }}
                >
                    DOWNLOAD FRONT
                </button>
                <button
                    onClick={() => handleDownload('back')}
                    disabled={!localImageBase64 && gecko?.image_url}
                    style={{ padding: '12px 30px', borderRadius: '30px', border: '1px solid #D4AF37', background: '#000', color: '#D4AF37', fontWeight: 'bold' }}
                >
                    DOWNLOAD BACK
                </button>
            </div>
        </div>
    );
}
