import { createClient } from "@/lib/supabase/server";
import { PremiumIDCard } from "@/components/gecko/PremiumIDCard";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, GitMerge } from "lucide-react";

export const dynamic = "force-dynamic";

interface CardPageProps {
    params: { id: string };
}

export default async function GeckoCardPage(props: CardPageProps) {
    const params = await Promise.resolve(props.params);
    const supabase = await createClient();

    // Fetch Gecko and Owner (Shop Name) PLUS Lineage Names
    const { data: gecko, error } = await supabase
        .from("geckos")
        .select(`
            *,
            owner:profiles (
                shop_name
            ),
            sire_link:geckos!sire_id (
                id, name
            ),
            dam_link:geckos!dam_id (
                id, name
            )
        `)
        .eq("id", params.id)
        .single();

    if (error || !gecko) {
        notFound();
    }

    // Prepare Lineage Data (Hybrid of Linked vs Manual)
    const lineageData = {
        sire: gecko.sire_link?.name || gecko.sire_name || "Unknown",
        sire_id: gecko.sire_link?.id || null,
        dam: gecko.dam_link?.name || gecko.dam_name || "Unknown",
        dam_id: gecko.dam_link?.id || null,
    };

    // Default to 'CRESTIA' if shop name not set
    // @ts-ignore
    const shopName = gecko.owner?.shop_name || "Crestia Member";

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">

            {/* Ambient Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold-600/5 rounded-full blur-[128px] pointer-events-none" />

            {/* Navigation / Header */}
            <div className="absolute top-8 left-8 print:hidden z-20">
                <Link href={`/geckos/${gecko.id}`}>
                    <Button variant="ghost" className="text-zinc-500 hover:text-white">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Gecko
                    </Button>
                </Link>
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full flex flex-col items-center gap-12 text-center pt-8">
                <div className="space-y-4 print:hidden animate-in fade-in slide-in-from-top-4 duration-700">
                    <h1 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight">Digital Certificate</h1>
                    <p className="text-zinc-500">Official proof of ownership and heritage.</p>
                </div>

                {/* Premium ID Card Component */}
                <div className="w-full flex justify-center px-4 md:px-0 opacity-0 animate-in fade-in zoom-in-95 duration-1000 fill-mode-forwards" style={{ animationDelay: '200ms' }}>
                    <PremiumIDCard
                        gecko={{
                            id: gecko.id,
                            name: gecko.name,
                            morph: gecko.morph,
                            gender: gecko.gender,
                            birth_date: gecko.birth_date,
                            image_url: gecko.image_url
                        }}
                        lineage={lineageData}
                        shopName={shopName}
                    />
                </div>

                <div className="print:hidden">
                    <Link href={`/lineage?id=${gecko.id}`}>
                        <Button variant="link" className="text-gold-500 hover:text-gold-400">
                            <GitMerge className="mr-2 h-4 w-4" />
                            View Interactive Pedigree
                        </Button>
                    </Link>
                </div>
            </div>
            {/* Legal Disclaimer is included in the back of the card, but we can keep a page footer if desired. The Prompt asked for it at the bottom of the PAGE too in Step 822, but Step 858 says "In the Back". Let's optimize and remove redundancy if it's on the card, but for safety per Step 822/858 instructions I will put it on the card as requested in 858, and maybe leave a small page footer too. */}
        </div>
    );
}
