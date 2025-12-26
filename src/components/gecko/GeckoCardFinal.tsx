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

// --- Helper Components (Using inline styles for html2canvas compatibility) ---
const LabelValue = ({ label, value }: { label: string; value: string }) => (
    <div style={{ marginBottom: '12px' }}>
        <div style={{ color: '#a1a1aa', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Figtree, sans-serif' }}>
            {label}
        </div>
        <div style={{ color: '#ffffff', fontSize: '18px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.025em', lineHeight: 1.25, wordBreak: 'break-all', fontFamily: 'Figtree, sans-serif' }}>
            {value}
        </div>
    </div>
);

// --- Card Front (Using inline styles for html2canvas compatibility) ---
export const CardFrontFinal = ({ gecko, displayImage }: { gecko: GeckoDetails; displayImage?: string | null }) => {
    const finalImage = displayImage || gecko.imageUrl || '/images/placeholder.png';

    return (
        <div style={{ width: '1062px', height: '685px', position: 'relative', backgroundColor: '#000000', color: '#ffffff', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', flexShrink: 0 }}>

            {/* 1. Background Layer: Carbon Pattern + Watermark */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0, backgroundColor: '#000000' }}>
                {/* Carbon Pattern */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0.4,
                    backgroundImage: `
                        linear-gradient(45deg, #1a1a1a 25%, transparent 25%, transparent 75%, #1a1a1a 75%, #1a1a1a),
                        linear-gradient(45deg, #1a1a1a 25%, transparent 25%, transparent 75%, #1a1a1a 75%, #1a1a1a)
                    `,
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 10px 10px'
                }} />

                {/* Watermark Logo */}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.1, pointerEvents: 'none' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/logo.png"
                        alt="Watermark"
                        style={{ width: '500px', height: '500px', objectFit: 'contain', filter: 'grayscale(100%)' }}
                        crossOrigin="anonymous"
                    />
                </div>
            </div>

            {/* 2. Gold Border */}
            <div style={{ position: 'absolute', top: '10px', right: '10px', bottom: '10px', left: '10px', border: '2px solid #D4AF37', zIndex: 10, borderRadius: '12px', pointerEvents: 'none' }} />

            {/* 3. Content Area */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 20, padding: '40px', display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid #D4AF37', paddingBottom: '16px', marginBottom: '24px' }}>
                    <div style={{ fontSize: '48px', fontWeight: 700, color: '#D4AF37', letterSpacing: '0.1em', fontFamily: '"Playfair Display", Georgia, serif' }}>CRESTIA</div>
                    <div style={{ fontSize: '24px', color: '#D4AF37', opacity: 0.8, fontFamily: 'Figtree, sans-serif', letterSpacing: '0.1em', fontWeight: 700 }}>OFFICIAL ID CARD</div>
                </div>

                {/* Body */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'row', gap: '40px', alignItems: 'flex-start' }}>
                    {/* Left: Photo & Name */}
                    <div style={{ width: '360px', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                        <div style={{ width: '100%', height: '340px', position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '2px solid #D4AF37', backgroundColor: '#18181b', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={finalImage}
                                alt={gecko.id}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                crossOrigin="anonymous"
                            />
                        </div>

                        {/* Name */}
                        <div style={{ width: '100%', textAlign: 'center', marginTop: '24px', paddingBottom: '16px' }}>
                            <h2 style={{ color: '#D4AF37', fontSize: '30px', fontWeight: 800, textTransform: 'uppercase', fontFamily: '"Playfair Display", Georgia, serif', textShadow: '0 2px 4px rgba(0,0,0,0.5)', lineHeight: 1.2 }}>
                                {gecko.name || "UNNAMED"}
                            </h2>
                        </div>
                    </div>

                    {/* Right: Info Fields */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', paddingTop: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <LabelValue label="ID Number" value={gecko.id.length > 20 ? `${gecko.id.slice(0, 8)}...${gecko.id.slice(-4)}` : gecko.id} />
                            <LabelValue label="Hatch Date" value={gecko.hatchDate} />
                            <LabelValue label="Morph" value={gecko.morph || "Unknown"} />
                            <LabelValue label="Breeder" value={gecko.breeder || "Unknown"} />
                            <LabelValue label="Lineage" value={`SIRE: ${gecko.sireName || 'N/A'} / DAM: ${gecko.damName || 'N/A'}`} />
                        </div>

                        {/* QR & Certified */}
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                <div style={{ backgroundColor: '#ffffff', padding: '8px', borderRadius: '4px' }}>
                                    <QRCodeSVG value={`https://crestia.com/geckos/${gecko.id}`} size={80} />
                                </div>
                                <span style={{ fontSize: '10px', color: '#71717a', letterSpacing: '0.1em', fontWeight: 700, fontFamily: 'Figtree, sans-serif' }}>SCAN ID</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100px', height: '100px', borderRadius: '50%', border: '4px solid #D4AF37', backgroundColor: '#000000', boxShadow: '0 0 15px rgba(212,175,55,0.5)' }}>
                                <span style={{ color: '#D4AF37', fontWeight: 700, fontSize: '14px', letterSpacing: '0.1em', fontFamily: '"Playfair Display", Georgia, serif' }}>CRESTIA</span>
                                <span style={{ color: '#D4AF37', fontSize: '8px', letterSpacing: '0.2em', marginTop: '4px', fontFamily: 'Figtree, sans-serif' }}>CERTIFIED</span>
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            {/* Label */}
            <div style={{
                border: '1px solid #D4AF37',
                backgroundColor: 'rgba(0,0,0,0.8)',
                padding: '2px 8px',
                color: '#D4AF37',
                fontSize: '10px',
                fontWeight: 'bold',
                marginBottom: '2px',
                width: '100%',
                textAlign: 'center',
                boxSizing: 'border-box',
                fontFamily: 'Figtree, sans-serif'
            }}>
                {label}
            </div>
            {/* Value - centered text */}
            <div style={{
                width: '100%',
                background: 'linear-gradient(to right, #B38728, #FCF6BA)',
                color: '#000000',
                fontWeight: 'bold',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '28px',
                padding: '0 8px',
                boxSizing: 'border-box',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontFamily: 'Figtree, sans-serif'
            }}>
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
                {/* Header - Using solid gold color for html2canvas compatibility */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '48px', fontWeight: 900, color: '#D4AF37', letterSpacing: '0.1em', fontFamily: '"Playfair Display", Georgia, serif', textTransform: 'uppercase', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                        CRESTIA
                    </h1>
                    <div style={{ marginTop: '8px', color: '#000000', paddingLeft: '32px', paddingRight: '32px', paddingTop: '6px', paddingBottom: '6px', fontWeight: 800, letterSpacing: '0.2em', borderRadius: '4px', fontSize: '18px', fontFamily: 'Figtree, sans-serif', background: 'linear-gradient(to bottom, #BF953F, #FCF6BA, #B38728)' }}>
                        PEDIGREE CERTIFICATE
                    </div>
                </div>

                {/* Pedigree Tree Layout - Fixed height container for consistent rendering */}
                <div style={{ position: 'relative', height: '420px', width: '100%', marginTop: '10px' }}>

                    {/* SELF - Left */}
                    <div style={{ position: 'absolute', left: '40px', top: '50%', transform: 'translateY(-50%)', width: '160px' }}>
                        <div style={{ color: '#D4AF37', fontWeight: 'bold', fontSize: '12px', letterSpacing: '0.1em', textAlign: 'center', marginBottom: '8px', fontFamily: 'Figtree, sans-serif' }}>SELF</div>
                        <PedigreeBox label="NAME" text={selfName} />
                    </div>

                    {/* Horizontal line from SELF to vertical */}
                    <div style={{ position: 'absolute', left: '200px', top: '50%', width: '60px', height: '2px', background: '#D4AF37' }} />

                    {/* Vertical line between SIRE and DAM */}
                    <div style={{ position: 'absolute', left: '260px', top: '20%', width: '2px', height: '60%', background: '#D4AF37' }} />

                    {/* SIRE - Middle Top */}
                    <div style={{ position: 'absolute', left: '280px', top: '20%', transform: 'translateY(-50%)', width: '200px' }}>
                        <PedigreeBox label="SIRE" text={getName(gecko.pedigree.sire)} />
                    </div>

                    {/* Horizontal line from vertical to SIRE */}
                    <div style={{ position: 'absolute', left: '260px', top: '20%', width: '20px', height: '2px', background: '#D4AF37' }} />

                    {/* DAM - Middle Bottom */}
                    <div style={{ position: 'absolute', left: '280px', top: '80%', transform: 'translateY(-50%)', width: '200px' }}>
                        <PedigreeBox label="DAM" text={getName(gecko.pedigree.dam)} />
                    </div>

                    {/* Horizontal line from vertical to DAM */}
                    <div style={{ position: 'absolute', left: '260px', top: '80%', width: '20px', height: '2px', background: '#D4AF37' }} />

                    {/* Horizontal lines from parents to grandparents vertical */}
                    <div style={{ position: 'absolute', left: '480px', top: '20%', width: '40px', height: '2px', background: '#D4AF37' }} />
                    <div style={{ position: 'absolute', left: '480px', top: '80%', width: '40px', height: '2px', background: '#D4AF37' }} />

                    {/* Vertical line for SIRE's parents */}
                    <div style={{ position: 'absolute', left: '520px', top: '5%', width: '2px', height: '30%', background: '#D4AF37' }} />

                    {/* Vertical line for DAM's parents */}
                    <div style={{ position: 'absolute', left: '520px', top: '65%', width: '2px', height: '30%', background: '#D4AF37' }} />

                    {/* GRANDSIRE (Paternal) */}
                    <div style={{ position: 'absolute', left: '540px', top: '5%', transform: 'translateY(-50%)', width: '180px' }}>
                        <PedigreeBox label="GRANDSIRE" text={getName(gecko.pedigree.grandSires[0])} />
                    </div>
                    <div style={{ position: 'absolute', left: '520px', top: '5%', width: '20px', height: '2px', background: '#D4AF37' }} />

                    {/* GRANDDAM (Paternal) */}
                    <div style={{ position: 'absolute', left: '540px', top: '35%', transform: 'translateY(-50%)', width: '180px' }}>
                        <PedigreeBox label="GRANDDAM" text={getName(gecko.pedigree.grandDams[0])} />
                    </div>
                    <div style={{ position: 'absolute', left: '520px', top: '35%', width: '20px', height: '2px', background: '#D4AF37' }} />

                    {/* GRANDSIRE (Maternal) */}
                    <div style={{ position: 'absolute', left: '540px', top: '65%', transform: 'translateY(-50%)', width: '180px' }}>
                        <PedigreeBox label="GRANDSIRE" text={getName(gecko.pedigree.grandSires[1])} />
                    </div>
                    <div style={{ position: 'absolute', left: '520px', top: '65%', width: '20px', height: '2px', background: '#D4AF37' }} />

                    {/* GRANDDAM (Maternal) */}
                    <div style={{ position: 'absolute', left: '540px', top: '95%', transform: 'translateY(-50%)', width: '180px' }}>
                        <PedigreeBox label="GRANDDAM" text={getName(gecko.pedigree.grandDams[1])} />
                    </div>
                    <div style={{ position: 'absolute', left: '520px', top: '95%', width: '20px', height: '2px', background: '#D4AF37' }} />

                </div>
            </div>
        </div >
    );
};

// --- Main Component ---
export const GeckoCardFinal = ({
    gecko,
    displayImage,
    className,
    style,
}: GeckoCardProps) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [scale, setScale] = useState(0.5); // Start at 50% to prevent flash
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Card dimensions
    const cardWidth = 1062;
    const cardHeight = 685;

    // Calculate scale based on container width
    React.useEffect(() => {
        const calculateScale = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                // Use container width for scaling, cap at 1 (100%)
                setScale(Math.min(containerWidth / cardWidth, 1));
            }
        };

        // Initial calculation
        calculateScale();

        // Listen for resize
        window.addEventListener('resize', calculateScale);
        return () => window.removeEventListener('resize', calculateScale);
    }, []);

    const scaledHeight = cardHeight * scale;
    const scaledWidth = cardWidth * scale;

    return (
        // Outer wrapper with ref for measuring container width
        <div ref={containerRef} className="w-full overflow-hidden flex justify-center">
            {/* Container with exact scaled dimensions for proper centering */}
            <div
                className={cn("relative", className)}
                style={{
                    width: `${scaledWidth}px`,
                    height: `${scaledHeight}px`,
                    ...style
                }}
            >
                <div
                    className="group select-none absolute top-0 left-0"
                    style={{
                        width: `${cardWidth}px`,
                        height: `${cardHeight}px`,
                        perspective: '2000px',
                        cursor: 'pointer',
                        transform: `scale(${scale})`,
                        transformOrigin: 'top left',
                    }}
                    onClick={() => setIsFlipped(!isFlipped)}
                >
                    <div className={cn(
                        "relative w-full h-full transition-transform duration-700",
                    )}
                        style={{
                            transformStyle: 'preserve-3d',
                            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                        }}>

                        {/* Front */}
                        <div className="absolute w-full h-full" style={{ backfaceVisibility: 'hidden' }}>
                            <CardFrontFinal gecko={gecko} displayImage={displayImage} />
                        </div>

                        {/* Back */}
                        <div className="absolute w-full h-full" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                            <CardBackFinal gecko={gecko} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
