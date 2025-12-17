"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import { LineageTree } from "@/components/lineage/LineageTree";

export default function GeckoCardPage() {
    const params = useParams();
    const router = useRouter();
    const [isFlipped, setIsFlipped] = useState(false);
    const [gecko, setGecko] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // 데이터 가져오기 (게코 정보)
    useEffect(() => {
        const fetchGecko = async () => {
            try {
                // 실제 API 호출로 교체 필요 (예시 데이터 로직)
                // 지금은 화면이 뜨는지 확인하기 위해 임시 데이터를 사용하거나
                // supabase client로 데이터를 가져오는 로직이 있어야 합니다.
                // 여기서는 기존에 작성하셨던 데이터 fetching 로직이 있다고 가정하고
                // supabase 호출이 어렵다면 아래처럼 UI 테스트용 가짜 데이터를 씁니다.

                // ★ 중요: 실제 연동 시 아래 fetch 부분을 살리세요.
                /*
                const { data, error } = await supabase
                  .from('geckos')
                  .select('*')
                  .eq('id', params.id)
                  .single();
                if (data) setGecko(data);
                */

                // UI 테스트를 위한 더미 데이터 (데이터 연결 확인 후 삭제하세요)
                setGecko({
                    name: "5556",
                    morph: "Unknown",
                    gender: "Male",
                    birth_date: "2025-12-05",
                    image_url: "https://yjabnnxnughxyjgxigwr.supabase.co/storage/v1/object/public/gecko-images/582db09d-cf1b-479a-8dac-0bdd59471c02/1765958176310.png"
                });
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchGecko();
    }, [params.id]);

    const handleDownload = async () => {
        const element = document.getElementById("digital-card");
        if (!element) return;
        const canvas = await html2canvas(element, {
            useCORS: true,
            backgroundColor: null,
            scale: 2, // 고화질
        });
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `Crestia-${gecko?.name || "card"}.png`;
        link.click();
    };

    if (loading) return <div className="text-white text-center mt-20">Loading Certificate...</div>;

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
            <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2">
                    Digital Certificate
                </h1>
                <p className="text-zinc-500">Official proof of ownership and heritage.</p>
            </div>

            {/* ★ 핵심 수정: h-[450px]로 높이를 강제로 고정합니다. 
        이 높이가 없으면 absolute 자식들 때문에 높이가 0이 되어 안 보입니다.
      */}
            <div
                className="relative w-full max-w-[700px] h-[450px] group perspective-1000 cursor-pointer mx-auto"
                onClick={() => setIsFlipped(!isFlipped)}
            >
                <div
                    id="digital-card"
                    className={`relative w-full h-full transition-all duration-700 transform-style-3d ${isFlipped ? "rotate-y-180" : ""
                        }`}
                >
                    {/* 앞면 (Front) */}
                    <div className="absolute inset-0 w-full h-full backface-hidden">
                        <div className="w-full h-full bg-zinc-900 rounded-xl border-2 border-gold-500/30 p-8 flex items-center justify-between shadow-2xl relative overflow-hidden">
                            {/* 배경 질감 효과 */}
                            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/50 to-black opacity-50 z-0 pointer-events-none" />

                            {/* 왼쪽: 이미지 */}
                            <div className="relative z-10 w-[250px] h-[350px] bg-black rounded-lg overflow-hidden border border-zinc-700 shadow-inner">
                                {/* 프록시 이미지 적용 */}
                                {gecko?.image_url && (
                                    <img
                                        src={`/api/proxy-image?url=${encodeURIComponent(gecko.image_url)}`}
                                        alt="Gecko"
                                        className="w-full h-full object-cover"
                                        crossOrigin="anonymous"
                                    />
                                )}
                            </div>

                            {/* 오른쪽: 정보 */}
                            <div className="relative z-10 flex-1 pl-10 text-left h-full flex flex-col justify-center">
                                <div className="text-gold-500 text-xs tracking-[0.2em] font-bold mb-2">OFFICIAL DIGITAL ID</div>
                                <h2 className="text-5xl font-serif text-white font-bold mb-2">{gecko?.name}</h2>
                                <p className="text-2xl text-zinc-400 font-serif mb-8">{gecko?.morph || "Morph N/A"}</p>

                                <div className="space-y-2 text-sm text-zinc-300 font-mono">
                                    <p><span className="text-gold-500/70 w-20 inline-block">SEX</span> {gecko?.gender}</p>
                                    <p><span className="text-gold-500/70 w-20 inline-block">BORN</span> {gecko?.birth_date}</p>
                                    <p><span className="text-gold-500/70 w-20 inline-block">ID</span> {params.id?.toString().slice(0, 8)}...</p>
                                </div>

                                <div className="absolute bottom-0 right-0">
                                    <div className="text-right">
                                        <span className="text-gold-500 font-serif text-2xl tracking-widest">CRESTIA</span>
                                        <p className="text-[10px] text-zinc-600 mt-1">SYSTEM MATCHED</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 뒷면 (Back) */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                        <div className="w-full h-full bg-zinc-950 rounded-xl border-2 border-zinc-800 p-4 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
                            <h3 className="text-gold-500 font-serif text-2xl mb-2 relative z-10">Lineage Certification</h3>
                            <div className="w-full h-full relative z-0 flex items-center justify-center -mt-8">
                                <LineageTree geckoId={params.id as string} />
                            </div>
                            <div className="absolute bottom-4 text-[10px] text-zinc-600 z-10">
                                Crestia Inc. | Verified Digital Asset
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-12 flex gap-4">
                <button
                    onClick={() => router.back()}
                    className="px-6 py-2 rounded-full border border-zinc-700 text-zinc-400 hover:text-white hover:border-white transition-colors"
                >
                    Go Back
                </button>
                <button
                    onClick={handleDownload}
                    className="px-6 py-2 rounded-full bg-gold-600 text-black font-bold hover:bg-gold-500 transition-colors shadow-lg shadow-gold-900/20"
                >
                    Save Image
                </button>
            </div>
        </div>
    );
}