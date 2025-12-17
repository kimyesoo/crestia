"use client";

import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { QRCodeSVG } from "qrcode.react";
import { Download, Loader2, Printer, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
            // Wait for images to load + delay for styles
            await new Promise(resolve => setTimeout(resolve, 500));

            const canvas = await html2canvas(cardRef.current, {
                useCORS: true,
                backgroundColor: null,
                scale: 3, // High Res for printing
                logging: false,
            });

            const link = document.createElement("a");
            link.download = `CRESTIA_ID_${gecko.name}_${gecko.id.slice(0, 8)}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
            toast.success("ID Card Downloaded");
        } catch (error) {
            console.error("Failed to generate ID card", error);
            toast.error("Download Failed");
        } finally {
            setIsDownloading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link Copied", { description: "Ready to share with the world." });
    };

    return (
        <div className="flex flex-col items-center space-y-8 print:block print:space-y-0 print:w-full print:h-screen print:flex print:items-center print:justify-center print:bg-white">

            {/* The ID Card Container */}
            <div className="relative group perspective-1000 print:perspective-none">
                <div
                    ref={cardRef}
                    className={cn(
                        "relative overflow-hidden rounded-xl shadow-2xl border border-gold-500/50 transition-transform duration-500",
                        "w-[600px] h-[338px]", // Credit Card Ratio
                        "print:shadow-none print:border-black print:w-[350px] print:h-[200px] print:m-0" // Print optimization
                    )}
                    style={{
                        background: "radial-gradient(circle at center, #1a1a1a 0%, #000000 100%)",
                    }}
                >
                    {/* Holographic Sheen Effect (CSS) */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-20"
                        style={{ transform: 'skewX(-20deg) translateX(-150%)', animation: 'shimmer 3s infinite linear' }} />

                    {/* Background Texture */}
                    <div className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: "radial-gradient(#D4AF37 0.5px, transparent 0.5px)",
                            backgroundSize: "16px 16px"
                        }}
                    />

                    {/* Gold Border Inline */}
                    <div className="absolute top-3 left-3 right-3 bottom-3 border border-gold-500/20 rounded-lg pointer-events-none z-10" />

                    {/* Content Layer */}
                    <div className="absolute inset-0 p-8 flex flex-row justify-between items-center z-10">
                        {/* Left: Identity */}
                        <div className="flex flex-row space-x-6 items-center">
                            {/* Gecko Image */}
                            <div className="h-44 w-44 flex-shrink-0 relative rounded-full p-1 bg-gradient-to-br from-gold-300 to-gold-600 shadow-xl overflow-hidden print:h-24 print:w-24">
                                <div className="w-full h-full rounded-full overflow-hidden bg-black relative">
                                    {gecko.image_url ? (
                                        <img
                                            src={gecko.image_url}
                                            alt={gecko.name}
                                            className="w-full h-full object-cover"
                                            crossOrigin="anonymous"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-gold-500 text-[10px]">
                                            NO IMAGE
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Text Info */}
                            <div className="space-y-1 z-20">
                                <div className="text-gold-500 text-[10px] tracking-[0.25em] font-bold uppercase mb-1 drop-shadow-md">
                                    Official Digital ID
                                </div>
                                <h1 className="text-4xl font-serif font-bold text-white tracking-tight drop-shadow-xl print:text-2xl">
                                    {gecko.name}
                                </h1>
                                <p className="text-zinc-300 text-lg font-medium print:text-sm">{gecko.morph}</p>

                                <div className="pt-4 flex flex-col space-y-1 text-[11px] text-zinc-400 uppercase tracking-widest font-mono">
                                    <p className="flex items-center gap-2">
                                        <span className="text-gold-600">Sex</span> {gecko.gender}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="text-gold-600">Born</span> {gecko.birth_date || "Unknown"}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="text-gold-600">Origin</span> {shopName}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Verification */}
                        <div className="text-right">
                            <h2 className="text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-gold-300 to-gold-600 drop-shadow-sm">CRESTIA</h2>
                            <p className="text-[8px] text-zinc-600 uppercase tracking-[0.3em]">System Matched</p>
                        </div>

                        <div className="flex flex-col items-end space-y-2">
                            <div className="bg-white p-1.5 rounded-sm shadow-lg">
                                <QRCodeSVG value={`https://crestia.app/geckos/${gecko.id}`} size={60} level="M" />
                            </div>
                            <p className="text-[7px] text-zinc-600 font-mono tracking-widest opacity-70">
                                ID: {gecko.id.split('-')[0].toUpperCase()}
                            </p>
                            <p className="text-[5px] text-zinc-700 max-w-[100px] text-right leading-tight">
                                Data provided by user. System matches ID only. No physical verification.
                            </p>
                        </div>
                    </div>
                </div>
            </div>


            {/* Action Buttons (Hidden when printing) */}
            <div className="flex gap-4 print:hidden animate-in fade-in duration-700 delay-300">
                <Button onClick={handleDownload} disabled={isDownloading} variant="outline" className="border-zinc-800 text-gold-500 hover:bg-zinc-900 hover:text-gold-400">
                    {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                    Save Image
                </Button>
                <Button onClick={handlePrint} variant="outline" className="border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white">
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                </Button>
                <Button onClick={handleShare} variant="outline" className="border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Link
                </Button>
            </div>

            <style jsx global>{`
                @media print {
                    @page { margin: 0; size: landscape; }
                    body * { visibility: hidden; }
                    .print\\:block, .print\\:block * { visibility: visible; }
                    .print\\:block { position: absolute; left: 0; top: 0; width: 100%; height: 100%; margin: 0; padding: 0; background: white; }
                }
            `}</style>
        </div >
    );
}
