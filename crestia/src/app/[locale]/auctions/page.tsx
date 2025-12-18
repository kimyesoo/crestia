import { createClient } from "@/lib/supabase/server";
import { AuctionCard } from "@/components/auction/AuctionCard";
import { Gavel } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const revalidate = 60; // Revalidate every minute

export default async function AuctionPage() {
    const supabase = await createClient();

    // Fetch Active Auctions with Gecko Details
    const { data: auctions, error } = await supabase
        .from("auctions")
        .select(`
            id,
            current_bid,
            end_at,
            gecko:geckos (
                name,
                morph,
                image_url,
                gender
            )
        `)
        .eq("status", "active")
        .order("end_at", { ascending: true });

    if (error) {
        console.error("Error fetching auctions:", error);
    }

    return (
        <div className="min-h-screen bg-black text-gold-500 font-sans p-8 pt-40">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <header className="mb-12 text-center border-b border-zinc-800 pb-8 relative">
                    <div className="inline-block p-4 rounded-full bg-zinc-900/50 border border-zinc-800 mb-4 animate-pulse">
                        <Gavel className="w-8 h-8 text-gold-500" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-white tracking-tight mb-2">
                        Live Auctions
                    </h1>
                    <p className="text-zinc-400 font-light tracking-wide max-w-xl mx-auto">
                        Bid on exclusive, high-lineage geckos. Secure your legacy before the hammer drops.
                    </p>
                </header>

                {/* Grid */}
                {auctions && auctions.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {auctions.map((auction) => (
                            // Helper cast if needed, though robust code should handle nulls
                            // @ts-ignore - Supabase join types can be tricky
                            <AuctionCard key={auction.id} auction={auction} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30 text-center space-y-6">
                        <div className="p-6 bg-black rounded-full border border-zinc-800 shadow-xl opacity-50">
                            <Gavel className="h-10 w-10 text-zinc-600" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-serif font-bold text-white">No Active Auctions</h3>
                            <p className="text-zinc-500 max-w-sm mx-auto">
                                There are currently no live auctions. Check back later or browse our shop.
                            </p>
                        </div>
                        <Button asChild variant="outline" className="border-gold-500/30 text-gold-500 hover:bg-gold-500/10">
                            <Link href="/shop">View Shop Collection</Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}