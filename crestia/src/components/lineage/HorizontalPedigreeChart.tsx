"use client";

import { cn } from "@/lib/utils";
import { PedigreeNode } from "./PedigreeChart";

interface HorizontalPedigreeChartProps {
    gecko: PedigreeNode;
}

export function HorizontalPedigreeChart({ gecko }: HorizontalPedigreeChartProps) {
    // Helper to render a compact node
    const CompactNode = ({ node, label, isRoot = false }: { node?: PedigreeNode | null, label?: string, isRoot?: boolean }) => {
        const displayName = node?.name || node?.manual_name || "Unknown";

        // Root node gets special gold treatment
        if (isRoot) {
            return (
                <div className="flex flex-col justify-center h-full w-[120px]">
                    <div className="text-[6px] text-gold-500 mb-0.5 tracking-wider font-bold">SELF</div>
                    <div className="bg-gradient-to-r from-gold-600 to-gold-400 p-[1px] rounded-sm overflow-hidden shadow-md">
                        <div className="bg-black/80 backdrop-blur-sm px-2 py-1.5 flex flex-col items-start h-full">
                            <span className="text-[9px] font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-100 to-amber-400 truncate w-full font-serif">
                                {displayName}
                            </span>
                            <span className="text-[6px] text-zinc-400 truncate w-full font-mono mt-0.5">
                                {node?.morph || "No Morph Data"}
                            </span>
                            <span className="text-[6px] text-zinc-500 font-mono">
                                {node?.gender || "Unknown"}
                            </span>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="flex flex-col justify-center h-[34px] w-[90px] relative group">
                {label && <div className="absolute -top-1.5 left-0 text-[5px] text-gold-500/60 uppercase tracking-[0.1em]">{label}</div>}

                <div className={cn(
                    "border border-white/10 px-1.5 py-1 rounded-sm flex flex-col justify-center h-full bg-black/40",
                    node?.name ? "border-gold-500/30 bg-gold-900/10" : "border-dashed opacity-50"
                )}>
                    <span className={cn(
                        "text-[7px] font-bold truncate w-full font-serif leading-none",
                        node?.name ? "text-zinc-200" : "text-zinc-600 italic"
                    )}>
                        {displayName}
                    </span>
                    {(node?.name || node?.manual_name) && (
                        <span className="text-[5px] text-zinc-500 truncate w-full font-mono mt-0.5">
                            {node.id ? node.id.slice(0, 6) : "MANUAL"}
                        </span>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="flex items-center justify-center w-full h-full p-2">

            {/* COLUMN 1: SELF */}
            <div className="flex items-center z-10">
                <CompactNode node={gecko} isRoot />
                {/* Horizontal Output Line */}
                <div className="w-4 h-px bg-gold-500/50" />
            </div>

            {/* COLUMN 2: PARENTS */}
            <div className="flex flex-col gap-8 relative">
                {/* Connection Bracket (Left side of Parents col) */}
                <div className="absolute -left-4 top-[25%] bottom-[25%] w-4 border-l border-t border-b border-gold-500/50 rounded-l-sm" />

                {/* SIRE */}
                <div className="flex items-center relative">
                    <span className="absolute -top-3 left-0 text-[6px] text-gold-500 font-bold">SIRE</span>
                    <CompactNode node={gecko.sire} />
                    <div className="w-3 h-px bg-gold-500/30" />
                </div>

                {/* DAM */}
                <div className="flex items-center relative">
                    <span className="absolute -top-3 left-0 text-[6px] text-gold-500 font-bold">DAM</span>
                    <CompactNode node={gecko.dam} />
                    <div className="w-3 h-px bg-gold-500/30" />
                </div>
            </div>

            {/* COLUMN 3: GRANDPARENTS */}
            <div className="flex flex-col gap-2 ml-0">
                {/* SIRE'S SIDE */}
                <div className="flex flex-col gap-1 relative pl-3">
                    {/* Bracket */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-[24px] border-l border-t border-b border-gold-500/30" />

                    <div className="flex items-center">
                        <CompactNode node={gecko.sire?.sire} label="G.SIRE" />
                    </div>
                    <div className="flex items-center">
                        <CompactNode node={gecko.sire?.dam} label="G.DAM" />
                    </div>
                </div>

                <div className="h-6" /> {/* Spacer matched to parent gap */}

                {/* DAM'S SIDE */}
                <div className="flex flex-col gap-1 relative pl-3">
                    {/* Bracket */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-[24px] border-l border-t border-b border-gold-500/30" />

                    <div className="flex items-center">
                        <CompactNode node={gecko.dam?.sire} label="G.SIRE" />
                    </div>
                    <div className="flex items-center">
                        <CompactNode node={gecko.dam?.dam} label="G.DAM" />
                    </div>
                </div>
            </div>
        </div>
    );
}
