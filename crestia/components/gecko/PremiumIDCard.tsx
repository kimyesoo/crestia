"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import { QRCodeSVG } from "qrcode.react";
import { Download, Share2, Repeat, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PremiumIDCardProps {
    gecko: {
        id: string;
        name: string;
        morph: string;
        gender: string;
        birth_date: string | null;
        image_url: string | null;
    };
    lineage: {
        sire: string | null; // Name or "Unknown"
        sire_id: string | null;
        dam: string | null;
        dam_id: string | null;
    };
    shopName?: string;
}

export function PremiumIDCard({ gecko, lineage, shopName = "CRESTIA" }: PremiumIDCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const frontRef = useRef<HTMLDivElement>(null);
    const backRef = useRef<HTMLDivElement>(null);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const handleDownload = async (side: "front" | "back") => {
        const ref = side === "front" ? frontRef : backRef;
        if (!ref.current) return;

        // Ensure the side to download is visible for capture logic if needed,
        // but with 3D transform it might be tricky.
        // Strategy: Temporarily disable transform or use specific capture logic.
        // For simplicity in this 'flip' context, we might need to rely on the user seeing it,
        // OR we momentarily render a hidden clone.
        // Let's try direct capture. If it fails due to 3D, we'd need a hidden export container.

        // Better approach for stability: Create a clone off-screen? 
        // Or just capture what's visible. The user usually downloads what they see.
        // Let's enforce the side is visible first.
        if ((side === "front" && isFlipped) || (side === "back" && !isFlipped)) {
            setIsFlipped(side !== "front"); // Flip to the correct side
            await new Promise(resolve => setTimeout(resolve, 600)); // Wait for animation
        }

        setIsDownloading(true);

        try {
            const canvas = await html2canvas(ref.current, {
                useCORS: true,
                allowTaint: true,
                backgroundColor: null,
                scale: 3,
                logging: false,
            });

            const link = document.createElement("a");
            link.download = `CRESTIA_${side.toUpperCase()}_${gecko.name}_${gecko.id.slice(0, 8)}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
            toast.success(`${side === "front" ? "Front" : "Back"} Saved`);
        } catch (error) {
            console.error("Download failed", error);
            toast.error("Download Failed");
        } finally {
            setIsDownloading(false);
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link Copied");
    };

    return (
        <div className="flex flex-col items-center gap-8 perspective-2000">

            {/* 3D Card Container */}
            <div
                className="relative w-full max-w-4xl aspect-[1.586/1] cursor-pointer group"
                onClick={handleFlip}
                style={{ perspective: "2000px" }}
            >
                <motion.div
                    className="w-full h-full relative preserve-3d transition-transform duration-700"
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.8, type: "spring", stiffness: 260, damping: 20 }}
                    style={{ transformStyle: "preserve-3d" }}
                >
                    {/* FRONT SIDE */}
                    <div
                        ref={frontRef}
                        className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden border-[1px] border-gold-500/50 shadow-2xl bg-[#0a0a0a] flex"
                        style={{ backfaceVisibility: "hidden" }}
                    >
                        {/* LEFT: Image (Cover) */}
                        <div className="w-[45%] h-full relative border-r border-gold-500/20">
                            {gecko.image_url ? (
                                <img
                                    src={`/api/proxy-image?url=${encodeURIComponent(gecko.image_url)}`}
                                    alt={gecko.name}
                                    className="w-full h-full object-cover"
                                    crossOrigin="anonymous"
                                />
                            ) : (
                                <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-700 font-serif">NO IMAGE</div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                        </div>

                        {/* RIGHT: Details */}
                        <div className="flex-1 relative p-8 md:p-12 flex flex-col justify-between">
                            {/* Leather Texture BG */}
                            <div className="absolute inset-0 opacity-30 pointer-events-none"
                                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")` }}
                            />

                            {/* Hologram Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none mix-blend-overlay" />

                            {/* Top Content */}
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full border border-gold-500/50 flex items-center justify-center">
                                            <span className="text-gold-500 font-serif font-bold text-lg">C</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-gold-500 text-[10px] tracking-[0.3em] font-bold uppercase leading-none">Crestia</span>
                                            <span className="text-[8px] text-zinc-500 tracking-widest uppercase">Certified</span>
                                        </div>
                                    </div>
                                    <span className="text-zinc-600 font-mono text-xs tracking-widest opacity-50">{gecko.id.split('-')[0].toUpperCase()}</span>
                                </div>

                                <h1 className="text-5xl md:text-7xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500 tracking-tight leading-none mt-4 drop-shadow-2xl">
                                    {gecko.name}
                                </h1>
                            </div>

                            {/* Bottom Content */}
                            <div className="relative z-10 space-y-6">
                                <div className="space-y-1">
                                    <p className="text-gold-500/80 text-xs uppercase tracking-[0.2em]">Morphology</p>
                                    <p className="text-2xl font-light text-zinc-300 font-serif">{gecko.morph}</p>
                                </div>

                                <div className="flex justify-between items-end border-t border-gold-500/20 pt-6">
                                    <div>
                                        <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Sex</p>
                                        <p className="text-lg text-white font-medium">{gecko.gender}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Hatch Date</p>
                                        <p className="text-lg text-white font-medium">{gecko.birth_date || "Unknown"}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Breeder</p>
                                        <p className="text-lg text-gold-400 font-serif italic">{shopName}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BACK SIDE */}
                    <div
                        ref={backRef}
                        className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden border-[1px] border-gold-500/30 shadow-2xl bg-[#080808] p-12 flex flex-col justify-between"
                        style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                    >
                        {/* Leather Texture BG */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")` }}
                        />

                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <h2 className="text-3xl font-serif text-white mb-2">Pedigree Record</h2>
                                <p className="text-zinc-500 text-sm">Official System Matched Lineage</p>
                            </div>
                            <QRCodeSVG value={`https://crestia.app/geckos/${gecko.id}`} size={80} level="M" bgColor="transparent" fgColor="#D4AF37" />
                        </div>

                        {/* Detailed Lineage Grid */}
                        <div className="relative z-10 grid grid-cols-2 gap-8 border-t border-b border-zinc-800 py-8 my-4">
                            <div className="space-y-2">
                                <p className="text-xs text-blue-400 uppercase tracking-widest font-bold">Sire (Father)</p>
                                <p className="text-2xl text-white font-serif">{lineage.sire || "Unknown"}</p>
                                <p className="text-[10px] text-zinc-500 font-mono">{lineage.sire_id ? `ID: ${lineage.sire_id.slice(0, 8)}...` : "User Declared"}</p>
                            </div>
                            <div className="space-y-2 text-right">
                                <p className="text-xs text-pink-400 uppercase tracking-widest font-bold">Dam (Mother)</p>
                                <p className="text-2xl text-white font-serif">{lineage.dam || "Unknown"}</p>
                                <p className="text-[10px] text-zinc-500 font-mono">{lineage.dam_id ? `ID: ${lineage.dam_id.slice(0, 8)}...` : "User Declared"}</p>
                            </div>
                        </div>

                        <div className="relative z-10 text-center space-y-4">
                            <p className="text-[10px] text-zinc-600 max-w-lg mx-auto leading-relaxed">
                                Disclaimer: The information above is based on user-submitted data. 'System Matched' indicates a link exists within the Crestia database, not a guarantee of biological parentage.
                                Crestia verifies connection integrity but does not physically verify the authenticity of stated lineages.
                            </p>
                            <div className="text-gold-500/50 text-[10px] uppercase tracking-[0.5em] font-bold">
                                Crestia Luxury Repository
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Hint */}
            <p className="text-zinc-500 text-sm flex items-center gap-2 animate-pulse">
                <Repeat className="h-3 w-3" /> Tap card to flip
            </p>

            {/* Action Bar */}
            <div className="flex gap-4">
                <Button
                    onClick={(e) => { e.stopPropagation(); handleDownload("front"); }}
                    disabled={isDownloading}
                    variant="outline"
                    className="border-zinc-800 text-gold-500 hover:bg-zinc-900 hover:text-gold-400 min-w-[140px]"
                >
                    {isDownloading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Download className="mr-2 h-4 w-4" />
                            Save Front
                        </>
                    )}
                </Button>
                <Button
                    onClick={(e) => { e.stopPropagation(); handleDownload("back"); }}
                    disabled={isDownloading}
                    variant="outline"
                    className="border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white min-w-[140px]"
                >
                    {isDownloading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Download className="mr-2 h-4 w-4" />
                            Save Back
                        </>
                    )}
                </Button>
                <Button
                    onClick={(e) => { e.stopPropagation(); handleShare(); }}
                    variant="outline"
                    className="border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white"
                >
                    <Share2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
