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
    is_verified?: boolean;
    manual_name?: string | null;
}

interface PedigreeChartProps {
    gecko: PedigreeNode;
}

export function PedigreeChart({ gecko }: PedigreeChartProps) {
    const router = useRouter();

    const handleNodeClick = (id: string) => {
        router.push(`/lineage?id=${id}`);
    };

    // Single Card Component
    const NodeCard = ({ node, label, isRoot = false }: { node?: PedigreeNode | null, label: string, isRoot?: boolean }) => {

        // Missing / Placeholder
        if (!node && !gecko.manual_name) {
            return (
                <div className="flex flex-col items-center justify-center p-2 rounded-lg border border-dashed border-zinc-800 bg-zinc-900/30 opacity-50 w-full h-[90px] md:h-[110px]">
                    <span className="text-[9px] text-zinc-600 uppercase tracking-widest mb-1">{label}</span>
                    <span className="text-zinc-700 font-serif italic text-[10px]">Unknown</span>
                </div>
            );
        }

        const isVerified = node?.is_verified ?? false;
        const displayName = node?.name || node?.manual_name || "Unknown";
        const displayMorph = node?.morph || (node?.manual_name ? "Manual Entry" : "");
        const isInteractive = !!node?.id && !isRoot;

        return (
            <Card
                onClick={() => isInteractive && handleNodeClick(node!.id)}
                className={cn(
                    "relative overflow-hidden transition-all duration-300 group w-full h-[90px] md:h-[110px] flex flex-col justify-between p-2 md:p-3 shadow-lg",
                    isInteractive ? "cursor-pointer hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:border-gold-500/50" : "cursor-default",
                    isRoot ? "border-gold-500 bg-black z-10 md:scale-110" :
                        isVerified ? "border-zinc-700 bg-zinc-900" :
                            "border-dashed border-zinc-700 bg-zinc-900/50"
                )}
            >
                {node?.image_url && (
                    <div className="absolute inset-0 z-0">
                        <img src={node.image_url} alt={displayName} className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    </div>
                )}

                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-0.5">
                            <span className="text-[8px] uppercase tracking-wider text-gold-500/80 font-bold flex items-center gap-1">
                                {label}
                            </span>
                            {node?.gender && (
                                <Badge variant="outline" className={cn(
                                    "text-[7px] px-1 py-0 h-3 border-zinc-700 bg-black/50 backdrop-blur-sm",
                                    node.gender === 'Male' ? "text-blue-400" : node.gender === 'Female' ? "text-pink-400" : "text-zinc-400"
                                )}>
                                    {node.gender.charAt(0)}
                                </Badge>
                            )}
                        </div>
                        <h3 className={cn(
                            "font-serif font-bold text-white leading-tight truncate pr-1",
                            isRoot ? "text-sm md:text-lg" : "text-xs md:text-sm",
                            !isVerified && "text-zinc-400 italic"
                        )}>
                            {displayName}
                        </h3>
                    </div>
                    <p className="text-[8px] md:text-[9px] text-zinc-400 font-mono truncate max-w-[90%] opacity-80">
                        {displayMorph}
                    </p>
                </div>
            </Card>
        );
    };

    // Connector Lines (Inverted Merge Style: └──┬──┘)
    const ConnectorBlock = () => (
        <div className="flex flex-col items-center w-full h-6 md:h-8 -mt-2 md:-mt-3 mb-1 z-0 relative">
            {/* Vertical arms coming down from parents (implicit via bottom-border) */}
            {/* The U-shape bracket */}
            <div className="w-1/2 border-b border-l border-r border-gold-500/50 h-[60%] rounded-bl-xl rounded-br-xl" />
            {/* Vertical Line down to Child */}
            <div className="w-px bg-gold-500/50 h-[40%]" />
        </div>
    );

    // Recursive Group for Parents
    const ParentGroup = ({
        node,
        label,
        sireLabel,
        damLabel,
        sireNode,
        damNode
    }: {
        node?: PedigreeNode | null,
        label: string,
        sireLabel: string,
        damLabel: string,
        sireNode?: PedigreeNode | null,
        damNode?: PedigreeNode | null,
    }) => {
        return (
            <div className="flex flex-col items-center w-full">
                {/* Top: Grandparents */}
                <div className="flex justify-center gap-2 md:gap-4 w-full mb-0 z-10 relative">
                    <div className="w-1/2 min-w-0">
                        <NodeCard node={sireNode} label={sireLabel} />
                    </div>
                    <div className="w-1/2 min-w-0">
                        <NodeCard node={damNode} label={damLabel} />
                    </div>
                </div>

                {/* Middle: Connector */}
                <ConnectorBlock />

                {/* Bottom: Parent */}
                <div className="w-full md:w-[80%] px-1 md:px-0 z-10 relative">
                    <NodeCard node={node} label={label} />
                </div>
            </div>
        );
    };

    return (
        <div className="w-full max-w-5xl mx-auto py-8">
            <div className="flex flex-col items-center">

                {/* Generation 1 & 2 Nested */}
                <div className="flex justify-center gap-4 md:gap-12 w-full z-10 relative">
                    {/* Sire Side */}
                    <div className="w-1/2">
                        <ParentGroup
                            node={gecko.sire}
                            label="Sire"
                            sireNode={gecko.sire?.sire}
                            sireLabel="Pat. Grandsire"
                            damNode={gecko.sire?.dam}
                            damLabel="Pat. Granddam"
                        />
                    </div>

                    {/* Dam Side */}
                    <div className="w-1/2">
                        <ParentGroup
                            node={gecko.dam}
                            label="Dam"
                            sireNode={gecko.dam?.sire}
                            sireLabel="Mat. Grandsire"
                            damNode={gecko.dam?.dam}
                            damLabel="Mat. Granddam"
                        />
                    </div>
                </div>

                {/* Main Connector (Parents -> Self) */}
                <div className="flex flex-col items-center w-full h-8 md:h-12 -mt-2 md:-mt-3 mb-1 z-0 relative">
                    {/* Merge bracket */}
                    <div className="w-[50%] border-b border-l border-r border-gold-500/50 h-[60%] rounded-bl-2xl rounded-br-2xl" />
                    <div className="w-px bg-gold-500/50 h-[40%]" />
                </div>

                {/* Self */}
                <div className="w-1/2 md:w-1/3 max-w-[250px] z-20 relative">
                    <NodeCard node={gecko} label="Self" isRoot={true} />
                </div>

            </div>
        </div>
    );
}
