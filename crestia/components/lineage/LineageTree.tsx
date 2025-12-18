"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PedigreeChart, PedigreeNode } from "./PedigreeChart";

import { HorizontalPedigreeChart } from "./HorizontalPedigreeChart";

interface LineageTreeProps {
    geckoId: string;
    variant?: "vertical" | "horizontal";
}

export function LineageTree({ geckoId, variant = "vertical" }: LineageTreeProps) {
    const [gecko, setGecko] = useState<PedigreeNode | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchLineage = async () => {
            // 1. Fetch data with 3 levels of depth (Self -> Parents -> Grandparents)
            const { data, error } = await supabase
                .from("geckos")
                .select(`
                    id, name, morph, gender, image_url, sire_name, dam_name,
                    sire:geckos!sire_id ( 
                        id, name, morph, gender, image_url, sire_name, dam_name,
                        sire:geckos!sire_id ( id, name, morph, gender, image_url ),
                        dam:geckos!dam_id ( id, name, morph, gender, image_url )
                    ),
                    dam:geckos!dam_id ( 
                        id, name, morph, gender, image_url, sire_name, dam_name,
                        sire:geckos!sire_id ( id, name, morph, gender, image_url ),
                        dam:geckos!dam_id ( id, name, morph, gender, image_url )
                    )
                `)
                .eq("id", geckoId)
                .single();

            if (error || !data) {
                console.error("Lineage fetch failed:", error);
                setLoading(false);
                return;
            }

            // 2. Recursive helper to build nodes handling "User Declared" manual names
            const buildNode = (nodeData: any, manualName?: string | null): PedigreeNode => {
                // If we have a linked node, use it.
                if (nodeData && nodeData.id) {
                    return {
                        id: nodeData.id,
                        name: nodeData.name,
                        morph: nodeData.morph,
                        gender: nodeData.gender,
                        image_url: nodeData.image_url,
                        sire: buildNode(nodeData.sire, nodeData.sire_name),
                        dam: buildNode(nodeData.dam, nodeData.dam_name),
                        is_verified: true,
                    };
                }

                // If no linked node but we have a manual name, create a "User Declared" node
                if (manualName) {
                    return {
                        id: "",
                        name: manualName,
                        morph: "User Declared",
                        gender: "Unknown",
                        is_verified: false,
                        manual_name: manualName
                    };
                }

                // Empty/Unknown node
                return {
                    id: "",
                    name: "Unknown",
                    morph: "",
                    gender: "Unknown",
                    manual_name: null
                };
            };

            const fullTree = buildNode(data);
            setGecko(fullTree);
            setLoading(false);
        };

        if (geckoId) {
            fetchLineage();
        }
    }, [geckoId]);

    if (loading) return <div className="text-zinc-500 text-xs animate-pulse">Loading Lineage...</div>;
    if (!gecko) return <div className="text-zinc-500 text-xs">No Lineage Found</div>;

    if (variant === "horizontal") {
        return <HorizontalPedigreeChart gecko={gecko} />;
    }

    // Scale down the chart to fit the card back (Legacy Vertical Behavior)
    return (
        <div className="w-[180%] h-[180%] transform origin-top-left scale-[0.55] -ml-[0%] -mt-[5%] pointer-events-none">
            <PedigreeChart gecko={gecko} />
        </div>
    );
}
