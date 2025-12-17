"use client";

import { useRef } from "react";
import html2canvas from "html2canvas";
import { QRCodeSVG } from "qrcode.react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface IDCardProps {
    gecko: {
        id: string;
        name: string;
        morph: string;
        gender: string;
        birth_date: string | null;
        image_url: string | null;
    };
    shopName?: string;
}

export function IDCard({ gecko, shopName = "CRESTIA" }: IDCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        if (!cardRef.current) return;
        setIsDownloading(true);

        try {
            const canvas = await html2canvas(cardRef.current, {
                useCORS: true, // Critical for Supabase Images
                backgroundColor: null,
                scale: 2, // Higher resolution
            });

            const link = document.createElement("a");
            link.download = `CRESTIA_ID_${gecko.name}_${gecko.id.slice(0, 8)}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        } catch (error) {
            console.error("Failed to generate ID card", error);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            {/* The ID Card (Visual) */}
            <div
                ref={cardRef}
                className="relative overflow-hidden rounded-xl shadow-2xl border border-gold-500/50"
                style={{
                    width: "600px",
                    height: "338px", // 85.6mm x 54mm equivalent ratio
                    background: "radial-gradient(circle at center, #1a1a1a 0%, #000000 100%)",
                }}
            >
                {/* Background Texture/Pattern */}
                <div className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: "radial-gradient(#D4AF37 1px, transparent 1px)",
                        backgroundSize: "20px 20px"
                    }}
                />

                {/* Gold Border Accent */}
                <div className="absolute top-4 left-4 right-4 bottom-4 border border-gold-500/30 rounded-lg pointer-events-none" />

                <div className="absolute inset-0 p-8 flex flex-row justify-between items-center z-10">

                    {/* Left Side: Photo & Info */}
                    <div className="flex flex-row space-x-6 items-center">
                        {/* Hexagon Clip Path for Image if possible, else Rounded Square */}
                        <div className="h-48 w-48 relative rounded-full overflow-hidden border-4 border-gold-500 shadow-lg bg-black">
                            {gecko.image_url ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                    src={gecko.image_url}
                                    alt={gecko.name}
                                    className="w-full h-full object-cover"
                                    crossOrigin="anonymous" // Essential for html2canvas
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-gold-500 text-xs">
                                    NO IMAGE
                                </div>
                            )}
                        </div>

                        <div className="space-y-1">
                            <div className="text-gold-500 text-xs tracking-[0.2em] font-bold uppercase mb-1">
                                Authentic Pedigree
                            </div>
                            <h1 className="text-4xl font-serif font-bold text-white tracking-tight">
                                {gecko.name}
                            </h1>
                            <p className="text-zinc-400 text-lg font-medium">{gecko.morph}</p>
                            <div className="pt-4 flex flex-col space-y-0.5 text-xs text-zinc-500 uppercase tracking-wider">
                                <p><span className="text-gold-600">Sex:</span> {gecko.gender}</p>
                                <p><span className="text-gold-600">DOB:</span> {gecko.birth_date || "Unknown"}</p>
                                <p><span className="text-gold-600">Breeder:</span> {shopName}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Validation */}
                    <div className="flex flex-col items-end justify-between h-full py-2">
                        <div className="text-right">
                            <h2 className="text-2xl font-serif font-bold text-gold-500">CRESTIA</h2>
                            <p className="text-[10px] text-zinc-600 uppercase tracking-widest">Digital Asset</p>
                        </div>

                        <div className="flex flex-col items-end space-y-2">
                            <div className="bg-white p-2 rounded">
                                <QRCodeSVG value={`https://crestia.app/geckos/${gecko.id}`} size={64} />
                            </div>
                            <p className="text-[8px] text-zinc-700 font-mono tracking-wider">
                                {gecko.id.toUpperCase()}
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            <Button onClick={handleDownload} disabled={isDownloading} className="bg-gold-500 text-black hover:bg-gold-400 font-bold">
                {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                Download Digital ID
            </Button>
        </div>
    );
}
