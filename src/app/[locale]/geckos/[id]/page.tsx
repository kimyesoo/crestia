"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import html2canvas from "html2canvas";
import { GeckoCardFinal, CardFrontFinal, CardBackFinal, GeckoDetails } from "@/components/gecko/GeckoCardFinal";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);


export default function GeckoDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [gecko, setGecko] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [localImageBase64, setLocalImageBase64] = useState<string | null>(null);

    // 1. Fetch Data
    useEffect(() => {
        const fetchGecko = async () => {
            if (!id) return;
            const { data, error } = await supabase
                .from("geckos")
                .select(`
            *,
            profiles (shop_name),
            sire:sire_id ( name, id ),
            dam:dam_id ( name, id )
          `)
                .eq("id", id)
                .single();

            if (error || !data) {
                console.error(error);
                // In a real app we might redirect to 404 here
                setLoading(false);
                return;
            }

            setGecko(data);
            if (data.image_url) fetchImageAsBase64(data.image_url);
            setLoading(false);
        };
        fetchGecko();
    }, [id]);

    // 2. Image Proxy
    const fetchImageAsBase64 = async (url: string) => {
        try {
            const response = await fetch(`/api/proxy-image?url=${encodeURIComponent(url)}`);
            const blob = await response.blob();
            const reader = new FileReader();
            reader.onloadend = () => setLocalImageBase64(reader.result as string);
            reader.readAsDataURL(blob);
        } catch (err) {
            console.error("Image proxy failed:", err);
        }
    };

    // 3. Download Handler
    const handleDownload = async (type: 'front' | 'back') => {
        // Target the HIDDEN elements specific for this page
        const targetId = type === 'front' ? "print-front-hidden" : "print-back-hidden";
        const element = document.getElementById(targetId);

        if (!element) {
            alert("Error: Card element not found!");
            return;
        }

        try {
            const canvas = await html2canvas(element, {
                backgroundColor: null,
                scale: 2,
                useCORS: true,
                allowTaint: true,
                logging: false,
            });

            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/png");
            link.download = `Crestia-${gecko?.name}-${type}.png`;
            link.click();
        } catch (err) {
            console.error(err);
            alert("Download failed: " + err);
        }
    };

    if (loading) return <div className="min-h-screen bg-black text-gold-500 flex items-center justify-center">Loading...</div>;
    if (!gecko) return <div className="min-h-screen bg-black text-red-500 flex items-center justify-center">Gecko Not Found</div>;

    const shopName = gecko.profiles?.shop_name || "Unknown Breeder";

    // Map gecko data to GeckoDetails for CardFrontFinal
    const geckoDetails: GeckoDetails = {
        id: gecko.id,
        name: gecko.name || 'UNNAMED',
        imageUrl: gecko.image_url,
        hatchDate: gecko.birth_date || 'Unknown',
        morph: gecko.morph || 'Unknown',
        breeder: shopName,
        sireName: gecko.sire?.name || gecko.sire_name || 'Unknown',
        damName: gecko.dam?.name || gecko.dam_name || 'Unknown',
        pedigree: {
            sire: { id: gecko.sire?.id || gecko.sire_id, name: gecko.sire?.name || gecko.sire_name || 'Unknown' },
            dam: { id: gecko.dam?.id || gecko.dam_id, name: gecko.dam?.name || gecko.dam_name || 'Unknown' },
            grandSires: [{ id: 'unknown', name: 'Unknown' }, { id: 'unknown', name: 'Unknown' }],
            grandDams: [{ id: 'unknown', name: 'Unknown' }, { id: 'unknown', name: 'Unknown' }]
        }
    };

    return (
        <div className="container mx-auto px-4 pt-32 pb-8 max-w-6xl">
            {/* Back Button */}
            <Link href="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-gold-500 mb-6 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* LEFT: Image & ID Card Download */}
                <div className="space-y-8">
                    <div className="aspect-square relative rounded-2xl overflow-hidden border border-gold-500/20 shadow-2xl bg-black">
                        {gecko.image_url ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                                src={gecko.image_url}
                                alt={gecko.name}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                No Image Available
                            </div>
                        )}
                    </div>

                    {/* ID Card Section */}
                    <div className="bg-card/30 border border-border/50 p-6 rounded-xl flex flex-col items-center space-y-4">
                        <h3 className="text-lg font-serif font-bold text-primary-foreground">Legacy Certificate</h3>
                        <p className="text-sm text-muted-foreground text-center">
                            Official Digital ID for {gecko.name}. <br /> Use this for trading and verification.
                        </p>

                        {/* Preview (Scaled Down) */}
                        <div className="origin-top transform scale-[0.35] md:scale-50 mb-[-200px] md:mb-[-150px]">
                            <CardFrontFinal gecko={geckoDetails} displayImage={localImageBase64} />
                        </div>

                        {/* Download Buttons */}
                        <div className="flex gap-4 pt-4 mt-20">
                            <button
                                onClick={() => handleDownload('front')}
                                className="px-4 py-2 bg-gradient-to-r from-gold-400 to-gold-600 text-black font-bold text-sm rounded-full shadow-lg hover:brightness-110"
                            >
                                Download Front
                            </button>
                            <button
                                onClick={() => handleDownload('back')}
                                className="px-4 py-2 border border-gold-500 text-gold-500 font-bold text-sm rounded-full hover:bg-gold-500/10"
                            >
                                Download Back
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Details */}
                <div className="space-y-12">
                    {/* (Preserved existing layout) */}
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Badge variant="outline" className="border-gold-500 text-gold-500 px-3 py-1 uppercase tracking-widest text-xs">{gecko.gender}</Badge>
                            <Badge variant="secondary" className="bg-zinc-800 text-zinc-400 px-3 py-1 uppercase tracking-widest text-xs">{gecko.is_for_sale ? "For Sale" : "Keeper"}</Badge>
                        </div>
                        <h1 className="text-5xl font-serif font-bold text-white mb-2 ml-[-2px] tracking-tight">{gecko.name}</h1>
                        <p className="text-2xl text-muted-foreground font-light">{gecko.morph}</p>
                    </div>

                    <div className="flex items-center gap-4 bg-secondary/20 p-4 rounded-lg border border-border/30">
                        <div className="h-12 w-12 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 font-serif font-bold text-xl">{shopName[0].toUpperCase()}</div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest">Breeder</p>
                            <p className="text-lg font-medium text-primary-foreground">{shopName}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <DetailItem label="Hatch Date" value={gecko.birth_date || "Unknown"} />
                        <DetailItem label="Lineage ID" value={gecko.id?.slice(0, 8)} />
                        <DetailItem label="Sire" value={gecko.sire?.name || "Unknown"} isLink={!!gecko.sire} linkId={gecko.sire?.id} />
                        <DetailItem label="Dam" value={gecko.dam?.name || "Unknown"} isLink={!!gecko.dam} linkId={gecko.dam?.id} />
                    </div>
                </div>
            </div>

            {/* Hidden Ghost Cards for Download */}
            <div style={{ position: 'fixed', top: 0, left: '-9999px', pointerEvents: 'none' }}>
                <div id="print-front-hidden" style={{ width: '1062px', height: '685px' }}>
                    <CardFrontFinal gecko={geckoDetails} displayImage={localImageBase64} />
                </div>
                <div id="print-back-hidden" style={{ width: '1062px', height: '685px' }}>
                    <CardBackFinal gecko={geckoDetails} />
                </div>
            </div>
        </div>
    );
}

function DetailItem({ label, value, isLink, linkId }: { label: string, value: string, isLink?: boolean, linkId?: string }) {
    return (
        <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-widest">{label}</p>
            {isLink ? (
                <Link href={`/geckos/${linkId}`} className="text-lg font-medium text-white hover:text-gold-500 underline decoration-gold-500/50 underline-offset-4 transition-all">
                    {value}
                </Link>
            ) : (
                <p className="text-lg font-medium text-white">{value}</p>
            )}
        </div>
    );
}
