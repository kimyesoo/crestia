"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Define recursive type for 3 generations
export interface PedigreeNode {
    id: string;
    name: string;
    morph: string;
    gender: "Male" | "Female" | "Unknown";
    image_url?: string | null;
    sire?: PedigreeNode | null;
    dam?: PedigreeNode | null;
    // New fields for reliability
    is_verified?: boolean; // True if ID linked
    manual_name?: string | null; // Display name if unlinked
}

interface PedigreeChartProps {
    gecko: PedigreeNode;
}

export function PedigreeChart({ gecko }: PedigreeChartProps) {
    const router = useRouter();

    const handleNodeClick = (id: string) => {
        router.push(`/lineage?id=${id}`);
    };

    const renderNode = (node: PedigreeNode | null | undefined, label: string, isRoot: boolean = false) => {
        // Handle Missing Node
        if (!node && !gecko.manual_name) { // Simple check, real logic depends on parent passing
            // Wait, the recursion structure means 'node' here IS the parent/grandparent.
            // If node is null, it really meant no data.
            return (
                <div className="flex flex-col items-center justify-center p-4 border border-dashed border-zinc-800 rounded-lg bg-zinc-900/30 opacity-50 h-[120px] w-full">
                    <span className="text-xs text-zinc-600 uppercase tracking-widest mb-1">{label}</span>
                    <span className="text-zinc-700 font-serif italic text-sm">Unknown</span>
                </div>
            );
        }

        // If node exists, it could be a real system node OR a manual entry wrapper we create in page.tsx
        // Let's assume page.tsx constructs a proper PedigreeNode object even for manual entries.
        // Manual entry: id might be empty or specific flag used.

        const isVerified = node?.is_verified ?? false;
        const displayName = node?.name || node?.manual_name || "Unknown";
        const displayMorph = node?.morph || (node?.manual_name ? "Manual Entry" : "");

        const isManual = !isVerified && !isRoot; // Root is always "verified" conceptually as it's the subject

        return (
            <Card
                onClick={() => node?.id && !isRoot && handleNodeClick(node.id)}
                className={cn(
                    "relative overflow-hidden transition-all duration-300 group w-full",
                    // Interactive only if system node
                    node?.id && !isRoot ? "cursor-pointer hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:border-gold-500/50" : "cursor-default opacity-90",
                    // Styles based on status
                    isRoot ? "border-gold-500 bg-black scale-105 z-10 shadow-xl" :
                        isVerified ? "border-zinc-700 bg-zinc-900 hover:border-gold-500/30" :
                            "border-dashed border-zinc-800 bg-zinc-900/50" // Unverified Style
                )}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/80 z-10" />

                {/* Background Image */}
                {node?.image_url && (
                    <img
                        src={node.image_url}
                        alt={displayName}
                        className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity"
                    />
                )}

                <div className="relative z-20 p-4 flex flex-col h-[120px] justify-between">
                    <div>
                        <div className="flex justify-between items-start">
                            <span className="text-[10px] uppercase tracking-widest text-gold-500/80 font-bold flex items-center gap-1">
                                {label}
                                {isVerified && <span className="bg-gold-500/20 text-gold-500 px-1 rounded-[2px] text-[8px] font-mono">System Matched</span>}
                            </span>
                            {node?.gender && (
                                <Badge variant="outline" className={cn(
                                    "text-[10px] px-1.5 py-0 border-zinc-700 bg-black/50",
                                    node.gender === 'Male' ? "text-blue-400" : node.gender === 'Female' ? "text-pink-400" : "text-zinc-400"
                                )}>
                                    {node.gender.charAt(0)}
                                </Badge>
                            )}
                        </div>
                        <h3 className={cn(
                            "font-serif font-bold text-white mt-1 leading-tight truncate pr-2",
                            isRoot ? "text-xl" : "text-lg",
                            !isVerified && "text-zinc-400 italic"
                        )}>
                            {displayName}
                        </h3>
                    </div>

                    <div className="flex justify-between items-end">
                        <p className="text-xs text-zinc-400 font-mono truncate max-w-[100px]">
                            {displayMorph}
                        </p>
                        {!isVerified && !isRoot && (
                            <span className="text-[9px] text-zinc-600 uppercase border border-zinc-800 px-1 rounded">User Declared</span>
                        )}
                    </div>
                </div>
            </Card>
        );
    };

    return (
        <div className="w-full overflow-x-auto pb-8">
            <div className="min-w-[800px] flex items-center justify-between gap-8 p-4 relative">

                {/* Connector Lines (SVG) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ overflow: 'visible' }}>
                    {/* Root to Parents */}
                    <path d="M 280 200 C 350 200, 350 100, 420 100" fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.4" />
                    <path d="M 280 200 C 350 200, 350 300, 420 300" fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.4" />

                    {/* Sire to Grandparents */}
                    <path d="M 620 100 C 670 100, 670 50, 720 50" fill="none" stroke="#3f3f46" strokeWidth="1" opacity="0.4" />
                    <path d="M 620 100 C 670 100, 670 150, 720 150" fill="none" stroke="#3f3f46" strokeWidth="1" opacity="0.4" />

                    {/* Dam to Grandparents */}
                    <path d="M 620 300 C 670 300, 670 250, 720 250" fill="none" stroke="#3f3f46" strokeWidth="1" opacity="0.4" />
                    <path d="M 620 300 C 670 300, 670 350, 720 350" fill="none" stroke="#3f3f46" strokeWidth="1" opacity="0.4" />
                </svg>

                {/* Generation 1: Self */}
                <div className="w-[250px] z-10 flex flex-col justify-center h-[400px]">
                    {renderNode(gecko, "Self", true)}
                </div>

                {/* Generation 2: Parents */}
                <div className="w-[200px] z-10 flex flex-col justify-between h-[400px] py-10">
                    <div className="relative">
                        {renderNode(gecko.sire, "Sire")}
                    </div>
                    <div className="relative">
                        {renderNode(gecko.dam, "Dam")}
                    </div>
                </div>

                {/* Generation 3: Grandparents */}
                <div className="w-[200px] z-10 flex flex-col justify-between h-[400px]">
                    {/* Sire's Parents */}
                    <div className="flex flex-col gap-2">
                        {renderNode(gecko.sire?.sire, "Paternal Grandsire")}
                        {renderNode(gecko.sire?.dam, "Paternal Granddam")}
                    </div>

                    {/* Dam's Parents */}
                    <div className="flex flex-col gap-2">
                        {renderNode(gecko.dam?.sire, "Maternal Grandsire")}
                        {renderNode(gecko.dam?.dam, "Maternal Granddam")}
                    </div>
                </div>

            </div>
        </div>
    );
}

import { BadgeCheck } from "lucide-react";
