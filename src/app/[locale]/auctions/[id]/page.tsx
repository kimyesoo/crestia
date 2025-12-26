import { createClient } from "@/lib/supabase/server";
import { AuctionClient } from "./AuctionClient";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Dna, Info } from "lucide-react";
import { format } from "date-fns";
import { notFound } from "next/navigation";

// Force dynamic rendering to ensure fresh data on load
export const dynamic = "force-dynamic";

interface AuctionDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function AuctionDetailPage({ params }: AuctionDetailPageProps) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch Auction with Gecko Details
    const { data: auction, error } = await supabase
        .from("auctions")
        .select(`
            *,
            gecko:geckos (
                id,
                name,
                morph,
                gender,
                birth_date,
                description,
                image_url
            )
        `)
        .eq("id", id)
        .single();

    if (error || !auction) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-black text-gold-500 font-sans p-4 md:p-8">
            <div className="container mx-auto max-w-6xl">
                {/* ID / Breadcrumb Area could go here */}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Left: Image Showcase */}
                    <div className="space-y-6">
                        <div className="aspect-[4/3] relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl">
                            {auction.gecko.image_url ? (
                                <img
                                    src={auction.gecko.image_url}
                                    alt={auction.gecko.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-500 uppercase tracking-widest">
                                    No Image Available
                                </div>
                            )}
                            <div className="absolute top-4 left-4">
                                <Badge className="bg-red-600 text-white border-0 text-sm px-3 py-1 font-bold shadow-lg animate-pulse">
                                    LIVE AUCTION
                                </Badge>
                            </div>
                        </div>

                        <div className="bg-zinc-900/30 rounded-xl p-6 border border-zinc-800">
                            <h3 className="text-xl font-serif font-bold text-white mb-4 flex items-center gap-2">
                                <Info className="w-5 h-5 text-gold-500" />
                                Gecko Details
                            </h3>
                            <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                                <div>
                                    <span className="block text-zinc-500">Morph</span>
                                    <span className="text-white font-medium">{auction.gecko.morph}</span>
                                </div>
                                <div>
                                    <span className="block text-zinc-500">Gender</span>
                                    <span className="text-white font-medium">{auction.gecko.gender}</span>
                                </div>
                                <div>
                                    <span className="block text-zinc-500">Hatch Date</span>
                                    <span className="text-white font-medium">
                                        {auction.gecko.birth_date ? format(new Date(auction.gecko.birth_date), "PPP") : "Unknown"}
                                    </span>
                                </div>
                                <div className="col-span-2 pt-2 border-t border-zinc-800 mt-2">
                                    <span className="block text-zinc-500 mb-1">Description</span>
                                    <p className="text-zinc-300 leading-relaxed mb-4">
                                        {auction.gecko.description || "No description provided."}
                                    </p>

                                    {/* Connectivity Links */}
                                    <div className="flex gap-4 pt-2">
                                        <a href={`/lineage?gecko=${auction.gecko.id}`} className="text-xs text-gold-500 hover:text-gold-400 flex items-center gap-2 uppercase tracking-wider font-bold">
                                            <Dna className="w-3 h-3" /> View Lineage
                                        </a>
                                        <a href={`/geckos/${auction.gecko.id}/card`} className="text-xs text-gold-500 hover:text-gold-400 flex items-center gap-2 uppercase tracking-wider font-bold">
                                            <Badge className="w-3 h-3 p-0 bg-transparent text-gold-500 border border-gold-500 rounded-sm flex items-center justify-center text-[8px]">ID</Badge> Digital Card
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Bidding UI & Info */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2">
                                {auction.gecko.name}
                            </h1>
                            <div className="flex items-center gap-2 text-gold-500/80 font-medium tracking-wide">
                                <Dna className="w-4 h-4" />
                                {auction.gecko.morph}
                            </div>
                        </div>

                        {/* Interactive Client Component */}
                        <AuctionClient auction={auction} currentUser={user} />

                        <div className="text-center text-xs text-zinc-600 max-w-md mx-auto">
                            By placing a bid, you agree to the Crestia Auction Terms & Conditions.
                            All bids are final and binding.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
