import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { IDCard } from "@/components/gecko/IDCard";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageProps {
    params: { id: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function GeckoDetailPage(props: PageProps) {
    // Await params first to satisfy Next.js 15+ requirements if applicable, or standard practice
    const params = await Promise.resolve(props.params);
    const id = params.id;

    const supabase = await createClient();

    // Fetch Gecko with Profile and Parents (Lineage)
    const { data: gecko, error } = await supabase
        .from("geckos")
        .select(`
      *,
      profiles (
        shop_name
      ),
      sire:geckos!sire_id (
        id, name, morph, image_url
      ),
      dam:geckos!dam_id (
        id, name, morph, image_url
      )
    `)
        .eq("id", id)
        .single();

    if (error || !gecko) {
        notFound();
    }

    // Format Shop Name
    const shopName = gecko.profiles?.shop_name || "Unknown Breeder";

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Back Button */}
            <Link href="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-gold-500 mb-6 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* LEFT: Image & ID Card Download */}
                <div className="space-y-8">
                    <div className="aspect-square relative rounded-2xl overflow-hidden border border-gold-500/20 shadow-2xl bg-black">
                        {gecko.image_url ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                                src={gecko.image_url}
                                alt={gecko.name}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                No Image Available
                            </div>
                        )}
                    </div>

                    {/* ID Card Section */}
                    <div className="bg-card/30 border border-border/50 p-6 rounded-xl flex flex-col items-center space-y-4">
                        <h3 className="text-lg font-serif font-bold text-primary-foreground">Legacy Certificate</h3>
                        <p className="text-sm text-muted-foreground text-center">
                            Official Digital ID for {gecko.name}. <br /> Use this for trading and verification.
                        </p>
                        {/* ID Component (Hidden Preview Logic handled inside or just shown? Instructions said viewable) */}
                        <div className="scale-75 origin-top">
                            <IDCard gecko={gecko} shopName={shopName} />
                        </div>
                    </div>
                </div>

                {/* RIGHT: Details & Lineage */}
                <div className="space-y-12">
                    {/* Header Info */}
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Badge variant="outline" className="border-gold-500 text-gold-500 px-3 py-1 uppercase tracking-widest text-xs">
                                {gecko.gender}
                            </Badge>
                            <Badge variant="secondary" className="bg-zinc-800 text-zinc-400 px-3 py-1 uppercase tracking-widest text-xs">
                                {gecko.is_for_sale ? "For Sale" : "Keeper"}
                            </Badge>
                        </div>
                        <h1 className="text-5xl font-serif font-bold text-white mb-2 ml-[-2px] tracking-tight">
                            {gecko.name}
                        </h1>
                        <p className="text-2xl text-muted-foreground font-light">{gecko.morph}</p>
                    </div>

                    {/* Breeder Info */}
                    <div className="flex items-center gap-4 bg-secondary/20 p-4 rounded-lg border border-border/30">
                        <div className="h-12 w-12 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 font-serif font-bold text-xl">
                            {shopName[0].toUpperCase()}
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest">Breeder</p>
                            <p className="text-lg font-medium text-primary-foreground">{shopName}</p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-6">
                        <DetailItem label="Hatch Date" value={gecko.birth_date || "Unknown"} />
                        <DetailItem label="Lineage ID" value={gecko.id.slice(0, 8)} />
                        <DetailItem label="Sire" value={gecko.sire?.name || "Unknown"} isLink={!!gecko.sire} linkId={gecko.sire?.id} />
                        <DetailItem label="Dam" value={gecko.dam?.name || "Unknown"} isLink={!!gecko.dam} linkId={gecko.dam?.id} />
                    </div>

                    {/* Description */}
                    {gecko.description && (
                        <div>
                            <h3 className="text-lg font-serif font-bold text-primary-foreground mb-3">About</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {gecko.description}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Lineage Tree Visualization (Simple version) */}
            <div className="mt-20 border-t border-border/30 pt-10">
                <h2 className="text-3xl font-serif font-bold text-center mb-12">Pedigree Lineage</h2>

                <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
                    {/* Sire Side */}
                    <ParentCard parent={gecko.sire} role="Sire" color="text-blue-400" />

                    {/* The Gecko */}
                    <div className="relative">
                        <div className="h-40 w-40 rounded-full border-4 border-gold-500 overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                            {gecko.image_url ? (
                                <img src={gecko.image_url} alt={gecko.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-zinc-900" />
                            )}
                        </div>
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-black px-4 py-1 rounded-full border border-gold-500 text-gold-500 font-bold text-sm whitespace-nowrap">
                            {gecko.name}
                        </div>
                    </div>

                    {/* Dam Side */}
                    <ParentCard parent={gecko.dam} role="Dam" color="text-pink-400" />
                </div>
            </div>


            {/* Legal Disclaimer */}
            <div className="mt-16 pt-8 border-t border-zinc-900 text-center">
                <p className="text-[10px] text-zinc-600 max-w-2xl mx-auto leading-relaxed">
                    Disclaimer: The information above is based on user-submitted data. 'DB Matched' indicates a link exists within the Crestia database, not a guarantee of biological parentage.
                    Crestia verifies connection integrity but does not physically verify the authenticity of stated lineages.
                </p>
            </div>
        </div >
    );
}

function DetailItem({ label, value, isLink, linkId }: { label: string, value: string, isLink?: boolean, linkId?: string }) {
    return (
        <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-widest">{label}</p>
            {isLink ? (
                <Link href={`/geckos/${linkId}`} className="text-lg font-medium text-white hover:text-gold-500 underline decoration-gold-500/50 underline-offset-4 transition-all">
                    {value}
                </Link>
            ) : (
                <p className="text-lg font-medium text-white">{value}</p>
            )}
        </div>
    )
}

function ParentCard({ parent, role, color }: { parent: any, role: string, color: string }) {
    if (!parent) {
        return (
            <div className="flex flex-col items-center space-y-3 opacity-50 grayscale">
                <div className="h-24 w-24 rounded-full border-2 border-dashed border-zinc-700 bg-zinc-900/50 flex items-center justify-center text-zinc-700 text-xs">
                    Unknown
                </div>
                <div className="text-center">
                    <p className={`text-xs font-bold uppercase tracking-widest ${color}`}>{role}</p>
                    <p className="text-sm font-medium text-muted-foreground">Unknown</p>
                </div>
            </div>
        )
    }

    return (
        <Link href={`/geckos/${parent.id}`} className="group flex flex-col items-center space-y-3 hover:scale-105 transition-transform duration-300">
            <div className="h-24 w-24 rounded-full border-2 border-zinc-800 group-hover:border-gold-500/50 overflow-hidden bg-zinc-900">
                {parent.image_url ? (
                    <img src={parent.image_url} alt={parent.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-zinc-800" />
                )}
            </div>
            <div className="text-center">
                <p className={`text-xs font-bold uppercase tracking-widest ${color}`}>{role}</p>
                <p className="text-lg font-medium text-white group-hover:text-gold-400 transition-colors">{parent.name}</p>
                <p className="text-xs text-muted-foreground">{parent.morph}</p>
            </div>
        </Link>
    )
}
