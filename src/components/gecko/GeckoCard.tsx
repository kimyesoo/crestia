"use client";

import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";

// --- Interfaces ---

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
    name?: string; // Added name field
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

// --- SAFE CSS STYLES ---

export const carbonFiberStyle: React.CSSProperties = {
    backgroundColor: "#111111",
    backgroundImage: `
    linear-gradient(45deg, #000000 25%, transparent 25%, transparent 75%, #000000 75%, #000000),
    linear-gradient(45deg, #000000 25%, transparent 25%, transparent 75%, #000000 75%, #000000)
  `,
    backgroundSize: "30px 30px",
    backgroundPosition: "0 0, 15px 15px",
};

const goldGradientText: React.CSSProperties = {
    background: "linear-gradient(180deg, #BF953F 0%, #FCF6BA 50%, #B38728 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
};

const goldGradientBg: React.CSSProperties = {
    background: "linear-gradient(180deg, #BF953F 0%, #FCF6BA 50%, #B38728 100%)",
};

// --- Helper Components ---

const LabelValue = ({ label, value }: { label: string; value: string }) => (
    <div style={{ marginBottom: '12px' }}>
        <div style={{
            color: '#888888',
            fontSize: '14px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
        }}>
            {label}
        </div>
        <div style={{
            color: '#FFFFFF',
            fontSize: '18px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.025em',
            wordBreak: 'break-word',
            lineHeight: '1.2'
        }}>
            {value}
        </div>
    </div>
);

// Updated PedigreeBox with Truncate
const PedigreeBox = ({ label, text, subtext, isSmall = false }: { label: string; text?: string; subtext?: string; isSmall?: boolean }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '100%' }}>
        {/* Label Box */}
        <div style={{
            width: '100%',
            height: isSmall ? '20px' : '30px',
            border: '2px solid #B38728',
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '4px'
        }}>
            <span style={{
                color: '#B38728',
                fontSize: isSmall ? '9px' : '12px',
                fontWeight: 'bold',
                lineHeight: 1,
                whiteSpace: 'nowrap'
            }}>{label}</span>
        </div>

        {/* Value Box */}
        <div style={{
            width: '100%',
            height: isSmall ? '28px' : '40px',
            background: 'linear-gradient(90deg, #B38728 0%, #FCF6BA 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.5)',
            padding: '0 6px',
            overflow: 'hidden'
        }}>
            <span style={{
                color: '#000000',
                fontSize: isSmall ? '10px' : '16px',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: '100%',
                textAlign: 'center'
            }}>
                {text || "Unknown"}
            </span>
            {subtext && (
                <span style={{
                    color: '#333333',
                    fontSize: isSmall ? '8px' : '10px',
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '100%',
                    textAlign: 'center',
                    lineHeight: 1,
                    marginTop: '1px'
                }}>
                    {subtext}
                </span>
            )}
        </div>
    </div>
);

const Connector = ({ vertical = false, length = '24px', style }: { vertical?: boolean, length?: string, style?: React.CSSProperties }) => (
    <div style={{
        position: 'absolute',
        backgroundColor: '#B38728',
        ...(vertical ? { width: '2px', height: length } : { height: '2px', width: length }),
        ...style
    }} />
);


// --- Exports ---

// The Face Container for Printing
// FIXED: 1062px x 685px with Explicit Safe Area
export const GeckoCardFace = ({ children, className, style }: { children: React.ReactNode, className?: string, style?: React.CSSProperties }) => (
    <div className={className} style={{
        position: 'relative',
        width: '1062px',
        height: '685px',
        overflow: 'hidden',
        backgroundColor: '#111',
        ...style
    }}>
        {/* 0. Background Layer (Full Bleed - 100%) */}
        <div style={{
            position: 'absolute',
            top: 0, left: 0, width: '100%', height: '100%',
            zIndex: 0,
            ...carbonFiberStyle
        }} />

        {/* 1. Content Layer (Safe Area Margin) */}
        {/* Using padding here effectively creates the safe area */}
        <div style={{
            position: 'absolute',
            top: 0, left: 0, width: '100%', height: '100%',
            zIndex: 10,
            padding: '30px', // Safe area buffer
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {/* 2. INNER BORDER CONTAINER */}
            {/* This container defines the visual border. It is strictly inside the safe area. */}
            <div style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                borderRadius: '32px',
                border: '8px solid #B38728', // The main gold border
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)', // Inner shadow for depth
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden' // Content clipped to border radius
            }}>
                {/* Decorative inner line */}
                <div style={{
                    position: 'absolute',
                    top: '12px', left: '12px', right: '12px', bottom: '12px',
                    borderRadius: '24px',
                    border: '2px solid rgba(179, 135, 40, 0.5)',
                    pointerEvents: 'none',
                    zIndex: 20
                }} />

                {/* Actual Content passed as children */}
                <div style={{ position: 'relative', width: '100%', height: '100%', zIndex: 30 }}>
                    {children}
                </div>
            </div>
        </div>
    </div>
);

export const CardFront = ({ gecko, displayImage }: { gecko: GeckoDetails; displayImage?: string | null }) => {
    return (
        <div style={{ width: '100%', height: '100%', padding: '36px', display: 'flex', flexDirection: 'column' }}>

            {/* Header */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginBottom: '20px' }}>
                <h1 style={{
                    fontSize: '56px',
                    fontWeight: 900,
                    fontFamily: 'sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    margin: 0,
                    lineHeight: 1,
                    ...goldGradientText
                }}>Crestia</h1>

                <div style={{
                    marginTop: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    padding: '6px 20px',
                    borderRadius: '4px',
                    ...goldGradientBg
                }}>
                    <span style={{
                        color: '#000000',
                        fontWeight: 800,
                        letterSpacing: '0.15em',
                        fontSize: '16px'
                    }}>CRESTED GECKO ID CARD</span>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', gap: '30px', flex: 1, overflow: 'hidden' }}>

                {/* Left Column: Image & Logo */}
                <div style={{ width: '42%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Main Image */}
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: '1/1',
                        borderRadius: '16px',
                        border: '3px solid #D4AF37',
                        overflow: 'hidden',
                        boxShadow: '0 8px 12px rgba(0,0,0,0.3)',
                        background: '#1a1a1a'
                    }}>
                        {(displayImage || gecko.imageUrl) ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={displayImage || gecko.imageUrl}
                                alt={gecko.id}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    zIndex: 10,
                                    position: 'relative' // Critical for html2canvas
                                }}
                            />
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: '24px' }}>
                                No Image
                            </div>
                        )}
                    </div>

                    {/* Logo Area */}
                    <div style={{
                        flex: 1,
                        position: 'relative',
                        border: '1px solid rgba(179, 135, 40, 0.3)',
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <div style={{
                            width: '100px',
                            height: '100px',
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/logo.png"
                                alt="Crestia Logo"
                                style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column: Info & QR */}
                <div style={{ width: '58%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: '4px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <LabelValue label="Hatch Date:" value={gecko.hatchDate} />
                        <LabelValue label="Morph:" value={gecko.morph || "Unknown"} />
                        <LabelValue label="Lineage:" value={`SI: ${gecko.sireName || 'N/A'} / DA: ${gecko.damName || 'N/A'}`} />
                        <LabelValue label="Breeder:" value={gecko.breeder || "Unknown"} />

                        {/* ID - Truncate safely */}
                        <div style={{ marginTop: '4px', overflow: 'hidden' }}>
                            <div style={{ color: '#888', fontSize: '12px', fontWeight: 600 }}>ID NUMBER:</div>
                            <div style={{
                                fontSize: '20px',
                                fontWeight: 800,
                                letterSpacing: '0.05em',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                lineHeight: '1.2',
                                ...goldGradientText
                            }}>
                                {gecko.id}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '12px' }}>
                        {/* QR Code */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ padding: '6px', backgroundColor: '#FFF', borderRadius: '4px' }}>
                                <QRCodeSVG value={`https://crestia.com/geckos/${gecko.id}`} size={80} />
                            </div>
                            <span style={{ fontSize: '9px', color: '#888', marginTop: '6px', letterSpacing: '1px' }}>SCAN ID</span>
                        </div>

                        {/* Certified Logo */}
                        <div style={{ position: 'relative', width: '100px', height: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{
                                border: '3px solid #BF953F',
                                borderRadius: '50%',
                                width: '74px',
                                height: '74px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'rgba(0,0,0,0.5)'
                            }}>
                                <span style={{ fontSize: '12px', fontWeight: 'bold', ...goldGradientText, lineHeight: 1 }}>CRESTIA</span>
                                <span style={{ fontSize: '7px', fontWeight: 'bold', color: '#B38728', letterSpacing: '0.1em', marginTop: '2px' }}>CERTIFIED</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const CardBack = ({ gecko }: { gecko: GeckoDetails }) => {
    // Helper to get name
    const getName = (node: PedigreeNode) => node?.name || "Unknown";

    // Self Name Logic
    const selfName = gecko.name || gecko.morph || "Unknown";

    return (
        <div style={{ width: '100%', height: '100%', padding: '24px', display: 'flex', flexDirection: 'column', selectUser: 'none' } as React.CSSProperties}>
            {/* Header */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{
                    fontSize: '40px',
                    fontWeight: 900,
                    fontFamily: 'sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '8px',
                    lineHeight: 1,
                    ...goldGradientText
                }}>Crestia</h1>
                <div style={{
                    padding: '4px 30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px',
                    ...goldGradientBg
                }}>
                    <span style={{
                        color: '#000000',
                        fontWeight: 800,
                        letterSpacing: '0.15em',
                        fontSize: '16px'
                    }}>PEDIGREE CERTIFICATE</span>
                </div>
            </div>

            {/* Fixed Width Columns Tree */}
            <div style={{
                flex: 1,
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'stretch', // Full height
                justifyContent: 'space-between',
                position: 'relative'
            }}>

                {/* Col 1: Self (20%) */}
                <div style={{ width: '20%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <div style={{ width: '100%', position: 'relative', paddingRight: '10px' }}>
                        <span style={{
                            position: 'absolute', top: '-24px', left: '50%', transform: 'translateX(-50%)',
                            color: '#B38728', fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.1em'
                        }}>SELF</span>

                        <PedigreeBox
                            label="BASIC INFO"
                            text={selfName}
                            subtext={gecko.id} // ID as subtext
                        />

                        {/* Connector out */}
                        <Connector style={{ right: '0', top: '50%', width: '10px' }} />
                    </div>
                </div>

                {/* Col 2: Parents (25%) */}
                <div style={{ width: '25%', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', position: 'relative' }}>
                    {/* Vertical Spine */}
                    <div style={{ position: 'absolute', left: '0', top: '25%', bottom: '25%', width: '2px', backgroundColor: '#B38728' }}></div>

                    {/* Sire */}
                    <div style={{ position: 'relative', width: '100%', paddingLeft: '10px', paddingRight: '10px' }}>
                        <Connector style={{ left: '0', top: '50%', width: '10px' }} />
                        <PedigreeBox label="SIRE" text={getName(gecko.pedigree.sire)} />
                        <Connector style={{ right: '0', top: '50%', width: '10px' }} />
                    </div>

                    {/* Dam */}
                    <div style={{ position: 'relative', width: '100%', paddingLeft: '10px', paddingRight: '10px' }}>
                        <Connector style={{ left: '0', top: '50%', width: '10px' }} />
                        <PedigreeBox label="DAM" text={getName(gecko.pedigree.dam)} />
                        <Connector style={{ right: '0', top: '50%', width: '10px' }} />
                    </div>
                </div>


                {/* Col 3: Grandparents (25%) */}
                <div style={{ width: '25%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '10px 0', position: 'relative' }}>

                    {/* Sire's Parents */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px', position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '0', top: '30%', bottom: '30%', width: '2px', backgroundColor: '#B38728' }}></div>

                        <div style={{ position: 'relative', width: '100%', paddingLeft: '10px', paddingRight: '8px' }}>
                            <Connector style={{ left: '0', top: '50%', width: '10px' }} />
                            <PedigreeBox label="GRANDSIRE" text={getName(gecko.pedigree.grandSires[0])} isSmall />
                        </div>
                        <div style={{ position: 'relative', width: '100%', paddingLeft: '10px', paddingRight: '8px' }}>
                            <Connector style={{ left: '0', top: '50%', width: '10px' }} />
                            <PedigreeBox label="GRANDDAM" text={getName(gecko.pedigree.grandDams[0])} isSmall />
                        </div>
                    </div>

                    {/* Dam's Parents */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px', position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '0', top: '30%', bottom: '30%', width: '2px', backgroundColor: '#B38728' }}></div>

                        <div style={{ position: 'relative', width: '100%', paddingLeft: '10px', paddingRight: '8px' }}>
                            <Connector style={{ left: '0', top: '50%', width: '10px' }} />
                            <PedigreeBox label="GRANDSIRE" text={getName(gecko.pedigree.grandSires[1])} isSmall />
                        </div>
                        <div style={{ position: 'relative', width: '100%', paddingLeft: '10px', paddingRight: '8px' }}>
                            <Connector style={{ left: '0', top: '50%', width: '10px' }} />
                            <PedigreeBox label="GRANDDAM" text={getName(gecko.pedigree.grandDams[1])} isSmall />
                        </div>
                    </div>
                </div>


                {/* Col 4: Great Grandparents (30%) - Visual Only */}
                <div style={{ width: '30%', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', position: 'relative', paddingLeft: '6px' }}>
                    {[...Array(8)].map((_, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', position: 'relative', width: '100%' }}>
                            {/* Connector In */}
                            <Connector style={{ left: '-6px', top: '50%', width: '6px' }} />

                            {/* Connection Spine for every 2 items */}
                            {i % 2 === 0 && (
                                <div style={{ position: 'absolute', left: '-6px', top: '50%', height: '100%', width: '2px', backgroundColor: '#B38728', opacity: 0.5, zIndex: 0 }}></div>
                            )}
                            {i % 2 !== 0 && (
                                <div style={{ position: 'absolute', left: '-6px', top: '-50%', height: '100%', width: '2px', backgroundColor: '#B38728', opacity: 0.5, zIndex: 0 }}></div>
                            )}

                            <div style={{ width: '100%' }}>
                                <PedigreeBox label="G.GRAND" text="" isSmall />
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};


export const GeckoCard = ({ gecko, displayImage, className, style }: GeckoCardProps) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div
            className={cn("group select-none", className)}
            style={{
                width: '1062px',
                height: '685px',
                perspective: '2000px',
                cursor: 'pointer',
                ...style
            }}
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <div style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                transition: 'transform 0.7s',
                transformStyle: 'preserve-3d',
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
            }}>

                {/* Front Face */}
                <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
                    <GeckoCardFace>
                        <CardFront gecko={gecko} displayImage={displayImage} />
                    </GeckoCardFace>
                </div>

                {/* Back Face */}
                <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                    <GeckoCardFace>
                        <CardBack gecko={gecko} />
                    </GeckoCardFace>
                </div>

            </div>
        </div>
    );
};
