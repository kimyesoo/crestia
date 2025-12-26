import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Store, CreditCard, GitMerge, Edit } from "lucide-react";

// Force dynamic ensures we always get the latest data without aggressive caching issues
export const dynamic = "force-dynamic";

export default async function MarketPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch Profile for Shop Name
    let shopName = "Luxury Gecko Shop";
    if (user) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("shop_name")
            .eq("id", user.id)
            .single();
        if (profile?.shop_name) {
            shopName = profile.shop_name;
        }
    }

    // Fetch Geckos
    const { data: geckos } = await supabase
        .from("geckos")
        .select("*")
        .eq("owner_id", user?.id)
        .order("created_at", { ascending: false });

    return (
        <div className="min-h-screen bg-black text-gold-500 font-sans px-4 md:px-8 pb-8 pt-48">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <header className="mb-12 text-center md:text-left border-b border-zinc-800 pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">
                            {shopName}
                        </h1>
                        <p className="text-zinc-400 mt-2 font-light tracking-wide flex items-center gap-2 justify-center md:justify-start">
                            <Store className="w-4 h-4 text-gold-500" /> Collection & Inventory
                        </p>
                    </div>
                    <Button asChild className="bg-gold-600 text-black hover:bg-gold-500 hover:text-black font-bold">
                        <Link href="/dashboard/add">
                            <Plus className="mr-2 h-4 w-4" /> Add New Gecko
                        </Link>
                    </Button>
                </header>

                {/* Grid */}
                {geckos && geckos.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {geckos.map((gecko) => (
                            <div key={gecko.id} className="group flex flex-col h-full relative">
                                <Link href={`/geckos/${gecko.id}`} className="block flex-grow">
                                    <div className="h-full bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden group-hover:border-gold-500/50 transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.1)] flex flex-col">

                                        {/* For Sale Badge */}
                                        {gecko.is_for_sale && (
                                            <div className="absolute top-3 right-3 z-20">
                                                <Badge className="bg-gold-500 text-black hover:bg-gold-400 border-0 font-bold tracking-wider rounded-sm shadow-lg shadow-black/50">
                                                    FOR SALE
                                                </Badge>
                                            </div>
                                        )}

                                        {/* Image Area */}
                                        <div className="aspect-[4/3] relative overflow-hidden bg-black">
                                            {gecko.image_url ? (
                                                <img
                                                    src={gecko.image_url}
                                                    alt={gecko.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-zinc-700 bg-zinc-950">
                                                    <span className="text-xs uppercase tracking-widest">No Image</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-4 flex-grow space-y-1">
                                            <h3 className="font-serif text-xl tracking-wide text-white group-hover:text-gold-500 transition-colors">
                                                {gecko.name}
                                            </h3>
                                            <div className="flex justify-between items-center text-xs">
                                                <p className="text-gold-500/80 font-medium uppercase tracking-widest">
                                                    {gecko.morph}
                                                </p>
                                                <div className="flex items-center gap-1.5 text-zinc-500 font-mono">
                                                    <span className={`w-1.5 h-1.5 rounded-full ${gecko.gender === 'Male' ? 'bg-blue-400' : gecko.gender === 'Female' ? 'bg-pink-400' : 'bg-zinc-500'}`} />
                                                    {gecko.gender}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>

                                {/* Quick Actions Bar - Floating below card or attached */}
                                <div className="mt-2 grid grid-cols-3 gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                                    <ActionButton href={`/geckos/${gecko.id}/card`} icon={<CreditCard className="w-4 h-4" />} label="ID Card" />
                                    <ActionButton href={`/lineage?gecko=${gecko.id}`} icon={<GitMerge className="w-4 h-4" />} label="Lineage" />
                                    <ActionButton href={`/dashboard/edit/${gecko.id}`} icon={<Edit className="w-4 h-4" />} label="Edit" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30 text-center space-y-6">
                        <div className="p-6 bg-black rounded-full border border-zinc-800 shadow-xl">
                            <Store className="h-10 w-10 text-gold-500" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-serif font-bold text-white">Your Showcase is Empty</h3>
                            <p className="text-zinc-400 max-w-sm mx-auto">
                                You haven't registered any geckos yet. Add your first gecko to begin building your legacy.
                            </p>
                        </div>
                        <Button asChild size="lg" className="bg-gradient-to-r from-gold-400 to-gold-600 text-black hover:from-gold-300 hover:to-gold-500 font-bold border-0 shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-500">
                            <Link href="/dashboard/add" className="gap-2">
                                <Plus className="w-5 h-5" /> Register First Gecko
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

function ActionButton({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
    return (
        <Link
            href={href}
            className="w-full h-9 inline-flex items-center justify-center bg-zinc-900 border border-zinc-800 hover:bg-gold-500 hover:text-black hover:border-gold-500 text-zinc-400 transition-colors rounded-md px-3 text-sm font-medium"
        >
            {icon}
        </Link>
    );
}
