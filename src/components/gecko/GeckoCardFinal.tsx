"use client";

import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";

// --- Interfaces (Copied for stability) ---
export interface PedigreeNode {
    id: string;
    name?: string;
    morph?: string;
}

export interface GeckoDetails {
    id: string;
    imageUrl: string;
    hatchDate: string;
    morph: string;
    breeder: string;
    sireName: string;
    damName: string;
    name?: string;
    pedigree: {
        sire: PedigreeNode;
        dam: PedigreeNode;
        grandSires: [PedigreeNode, PedigreeNode];
        grandDams: [PedigreeNode, PedigreeNode];
    };
}

interface GeckoCardProps {
    gecko: GeckoDetails;
    displayImage?: string | null;
    className?: string;
    style?: React.CSSProperties;
}

// --- Helper Components ---
const LabelValue = ({ label, value }: { label: string; value: string }) => (
    <div className="mb-3">
        <div className="text-zinc-400 text-sm font-semibold uppercase tracking-wider">
            {label}
        </div>
        <div className="text-white text-lg font-bold uppercase tracking-wide break-words leading-tight">
            {value}
        </div>
    </div>
);

// --- Card Front (User Provided + Integrated) ---
export const CardFrontFinal = ({ gecko, displayImage }: { gecko: GeckoDetails; displayImage?: string | null }) => {
    const finalImage = displayImage || gecko.imageUrl || '/images/placeholder.png';

    return (
        <div className="w-[1062px] h-[685px] relative bg-black text-white overflow-hidden shadow-2xl flex-shrink-0">

            {/* 1. Background Layer: Carbon Pattern + Watermark */}
            <div className="absolute inset-0 z-0 bg-black">
                {/* Carbon Pattern */}
                <div className="absolute inset-0 opacity-40"
                    style={{
                        backgroundImage: `
                            linear-gradient(45deg, #1a1a1a 25%, transparent 25%, transparent 75%, #1a1a1a 75%, #1a1a1a),
                            linear-gradient(45deg, #1a1a1a 25%, transparent 25%, transparent 75%, #1a1a1a 75%, #1a1a1a)
                        `,
                        backgroundSize: '20px 20px',
                        backgroundPosition: '0 0, 10px 10px'
                    }}
                />

                {/* ★ Watermark Logo (Centered, Subtle) ★ */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/logo.png"
                        alt="Watermark"
                        className="w-[500px] h-[500px] object-contain grayscale"
                        crossOrigin="anonymous"
                    />
                </div>
            </div>

            {/* 2. Gold Border */}
            <div className="absolute inset-[10px] border-2 border-[#D4AF37] z-10 rounded-xl pointer-events-none" />

            {/* 3. Content Area (Safe Area) */}
            <div className="absolute inset-0 z-20 p-[40px] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-end border-b-2 border-[#D4AF37] pb-4 mb-6">
                    <div className="text-5xl font-bold text-[#D4AF37] tracking-widest font-serif">CRESTIA</div>
                    <div className="text-2xl text-[#D4AF37] opacity-80 font-sans tracking-widest font-bold">OFFICIAL ID CARD</div>
                </div>

                {/* Body */}
                <div className="flex-1 flex flex-row gap-10 items-center">
                    {/* Left: Photo & Name */}
                    <div className="w-[400px] flex flex-col gap-6">
                        <div className="w-full aspect-square relative rounded-xl overflow-hidden border-2 border-[#D4AF37] bg-zinc-900 shadow-lg">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={finalImage}
                                alt={gecko.id}
                                className="w-full h-full object-cover"
                                crossOrigin="anonymous"
                            />
                        </div>

                        {/* ★ Name: Text Only (Gold), No Background ★ */}
                        <div className="w-full text-center">
                            <h2 className="text-[#D4AF37] text-4xl font-extrabold truncate uppercase font-serif drop-shadow-md">
                                {gecko.name || "UNNAMED"}
                            </h2>
                        </div>
                    </div>

                    {/* Right: Info Fields */}
                    <div className="flex-1 flex flex-col justify-center h-full pt-4">
                        <div className="flex flex-col gap-2">
                            <LabelValue label="ID Number" value={gecko.id} />
                            <LabelValue label="Hatch Date" value={gecko.hatchDate} />
                            <LabelValue label="Morph" value={gecko.morph || "Unknown"} />
                            <LabelValue label="Breeder" value={gecko.breeder || "Unknown"} />
                            <LabelValue label="Lineage" value={`SIRE: ${gecko.sireName || 'N/A'} / DAM: ${gecko.damName || 'N/A'}`} />
                        </div>

                        {/* QR & Certified */}
                        <div className="flex flex-row items-end justify-between mt-auto pt-6">
                            <div className="flex flex-col items-center gap-2">
                                <div className="bg-white p-2 rounded">
                                    <QRCodeSVG value={`https://crestia.com/geckos/${gecko.id}`} size={80} />
                                </div>
                                <span className="text-[10px] text-zinc-500 tracking-widest font-bold">SCAN ID</span>
                            </div>

                            <div className="flex flex-col items-center justify-center w-[100px] h-[100px] rounded-full border-4 border-[#D4AF37] bg-black/50 shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                                <span className="text-[#D4AF37] font-bold text-sm tracking-widest">CRESTIA</span>
                                <span className="text-[#D4AF37] text-[8px] tracking-[0.2em] mt-1">CERTIFIED</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Card Back (Adapted to Match Style) ---
export const CardBackFinal = ({ gecko }: { gecko: GeckoDetails }) => {
    // Helper to get name
    const getName = (node: PedigreeNode) => node?.name || "Unknown";
    const selfName = gecko.name || gecko.morph || "Unknown";

    const PedigreeBox = ({ label, text }: { label: string, text: string }) => (
        <div className="flex flex-col items-center w-full">
            <div className="border border-[#D4AF37] bg-black/80 px-2 py-0.5 text-[#D4AF37] text-[10px] font-bold mb-1 w-full text-center">
                {label}
            </div>
            <div className="w-full bg-gradient-to-r from-[#B38728] to-[#FCF6BA] text-black font-bold text-center py-1.5 px-2 truncate text-xs shadow-md">
                {text}
            </div>
        </div>
    );

    return (
        <div className="w-[1062px] h-[685px] relative bg-black text-white overflow-hidden shadow-2xl flex-shrink-0">
            {/* Background Layer */}
            <div className="absolute inset-0 z-0 bg-black">
                <div className="absolute inset-0 opacity-40"
                    style={{
                        backgroundImage: `linear-gradient(45deg, #1a1a1a 25%, transparent 25%, transparent 75%, #1a1a1a 75%, #1a1a1a), linear-gradient(45deg, #1a1a1a 25%, transparent 25%, transparent 75%, #1a1a1a 75%, #1a1a1a)`,
                        backgroundSize: '20px 20px',
                        backgroundPosition: '0 0, 10px 10px'
                    }}
                />
                {/* Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logo.png" alt="Watermark" className="w-[500px] h-[500px] object-contain grayscale" crossOrigin="anonymous" />
                </div>
            </div>

            <div className="absolute inset-[10px] border-2 border-[#D4AF37] z-10 rounded-xl pointer-events-none" />

            <div className="absolute inset-0 z-20 p-[40px] flex flex-col">
                {/* Header */}
                <div className="flex flex-col items-center mb-10">
                    <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#BF953F] via-[#FCF6BA] to-[#B38728] tracking-widest font-sans uppercase drop-shadow-sm">
                        CRESTIA
                    </h1>
                    <div className="mt-2 text-black bg-gradient-to-b from-[#BF953F] via-[#FCF6BA] to-[#B38728] px-8 py-1 font-extrabold tracking-[0.2em] rounded text-lg">
                        PEDIGREE CERTIFICATE
                    </div>
                </div>

                {/* Pedigree Tree Layout */}
                <div className="flex-1 flex flex-row items-center justify-between w-full relative px-10">

                    {/* 1. Self */}
                    <div className="w-[20%] flex flex-col justify-center items-center relative">
                        <div className="text-[#D4AF37] font-bold text-xs mb-2 tracking-widest absolute -top-8 text-center w-full">SELF</div>
                        <PedigreeBox label="ID / NAME" text={`${gecko.id} / ${selfName}`} />
                        {/* Connector Output */}
                        <div className="absolute right-[-20%] top-1/2 w-[20%] h-[2px] bg-[#D4AF37]" />
                    </div>

                    {/* 2. Parents */}
                    <div className="w-[25%] flex flex-col justify-around h-full relative">
                        <div className="absolute left-[-2px] top-[25%] bottom-[25%] w-[2px] bg-[#D4AF37]" />

                        {/* Sire */}
                        <div className="relative">
                            <div className="absolute left-[-20px] top-1/2 w-[20px] h-[2px] bg-[#D4AF37]" />
                            <PedigreeBox label="SIRE" text={getName(gecko.pedigree.sire)} />
                            <div className="absolute right-[-20px] top-1/2 w-[20px] h-[2px] bg-[#D4AF37]" />
                        </div>
                        {/* Dam */}
                        <div className="relative">
                            <div className="absolute left-[-20px] top-1/2 w-[20px] h-[2px] bg-[#D4AF37]" />
                            <PedigreeBox label="DAM" text={getName(gecko.pedigree.dam)} />
                            <div className="absolute right-[-20px] top-1/2 w-[20px] h-[2px] bg-[#D4AF37]" />
                        </div>
                    </div>

                    {/* 3. Grandparents */}
                    <div className="w-[25%] flex flex-col justify-between h-full py-4">
                        {/* Sire Side */}
                        <div className="flex flex-col gap-4 relative justify-center h-1/2 border-l-2 border-[#D4AF37] pl-6">
                            <div className="absolute left-0 top-1/2 w-6 h-[2px] bg-[#D4AF37] -translate-x-full" />
                            <PedigreeBox label="GRANDSIRE" text={getName(gecko.pedigree.grandSires[0])} />
                            <PedigreeBox label="GRANDDAM" text={getName(gecko.pedigree.grandDams[0])} />
                        </div>
                        {/* Dam Side */}
                        <div className="flex flex-col gap-4 relative justify-center h-1/2 border-l-2 border-[#D4AF37] pl-6">
                            <div className="absolute left-0 top-1/2 w-6 h-[2px] bg-[#D4AF37] -translate-x-full" />
                            <PedigreeBox label="GRANDSIRE" text={getName(gecko.pedigree.grandSires[1])} />
                            <PedigreeBox label="GRANDDAM" text={getName(gecko.pedigree.grandDams[1])} />
                        </div>
                    </div>

                    {/* 4. Great Grandparents (Visual Only List) */}
                    <div className="w-[15%] flex flex-col justify-around h-full text-[8px] text-zinc-500 pl-4 border-l border-zinc-800">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className="w-2 h-[1px] bg-[#D4AF37]" />
                                <span>Unknown</span>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};

// --- Main Component ---
export const GeckoCardFinal = ({ gecko, displayImage, className, style }: GeckoCardProps) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div
            className={cn("group select-none relative", className)}
            style={{
                width: '1062px',
                height: '685px',
                perspective: '2000px',
                cursor: 'pointer',
                ...style
            }}
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <div className={cn(
                "relative w-full h-full transition-transform duration-700 transform-style-3d",
                isFlipped ? "rotate-y-180" : ""
            )}
                style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>

                {/* Front */}
                <div className="absolute w-full h-full backface-hidden" style={{ backfaceVisibility: 'hidden' }}>
                    <CardFrontFinal gecko={gecko} displayImage={displayImage} />
                </div>

                {/* Back */}
                <div className="absolute w-full h-full backface-hidden rotate-y-180" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                    <CardBackFinal gecko={gecko} />
                </div>
            </div>
        </div>
    );
};
