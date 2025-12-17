import { createClient } from "@/lib/supabase/server";
import { PedigreeChart, PedigreeNode } from "@/components/lineage/PedigreeChart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { redirect } from "next/navigation";

interface LineagePageProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function LineagePage({ searchParams }: LineagePageProps) {
    const params = await searchParams;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        // Option: public lineage? For now, protect it.
        // redirect("/login"); 
    }

    const id = typeof params.id === "string" ? params.id : null;
    let geckoData: PedigreeNode | null = null;

    // Search Action (Client side usually, but for simple MVP query params work)
    async function searchAction(formData: FormData) {
        "use server";
        const searchId = formData.get("searchId") as string;
        if (searchId) {
            redirect(`/lineage?id=${searchId}`);
        }
    }

    if (id) {
        // 3-Generation Fetch
        // We use explicit foreign key aliases if defined, or assume relation names.
        // Based on schema: sire_id -> geckos, dam_id -> geckos.
        // Supabase syntax: relation_name:column_name ( or just relation name if obvious )
        // Let's try explicit embedding with aliases.

        const { data, error } = await supabase
            .from("geckos")
            .select(`
                id, name, morph, gender, image_url, sire_name, dam_name,
                sire:geckos!sire_id ( 
                    id, name, morph, gender, image_url,
                    sire:geckos!sire_id ( id, name, morph, gender, image_url ),
                    dam:geckos!dam_id ( id, name, morph, gender, image_url )
                ),
                dam:geckos!dam_id ( 
                    id, name, morph, gender, image_url,
                    sire:geckos!sire_id ( id, name, morph, gender, image_url ),
                    dam:geckos!dam_id ( id, name, morph, gender, image_url )
                )
            `)
            .eq("id", id)
            .single();

        if (error) {
            console.error("Lineage Fetch Error:", error);
        } else if (data) {

            // Construct the Pedigree Tree with fallback for Manual Entries
            const buildNode = (gecko: any, manualName?: string | null): PedigreeNode | null => {
                // Priority 1: System Linked Gecko (Verified)
                if (gecko && gecko.id) {
                    return {
                        id: gecko.id,
                        name: gecko.name,
                        morph: gecko.morph,
                        gender: gecko.gender,
                        image_url: gecko.image_url,
                        is_verified: true,
                        // We do recursive check, but grand-parents manual check is tricky without deeper recursion or flat fetch.
                        // For MVP, we stick to system data for grandparents unless we recurse manually.
                        // System Grandparents:
                        sire: gecko.sire ? buildNode(gecko.sire) : null,
                        dam: gecko.dam ? buildNode(gecko.dam) : null,
                    };
                }

                // Priority 2: Manual Name Entry (Unverified)
                if (manualName) {
                    return {
                        id: "", // No link
                        name: manualName,
                        morph: "User Declared",
                        gender: "Unknown",
                        is_verified: false,
                        sire: null,
                        dam: null
                    };
                }

                return null;
            };

            // Root is always real if we found data
            geckoData = {
                id: data.id,
                name: data.name,
                morph: data.morph,
                gender: data.gender,
                image_url: data.image_url,
                is_verified: true,
                // Pass manual names from Root to 1st Generation construction
                // IMPORTANT: Pass 'system node' first, then 'manual name' as fallback inside the function
                sire: buildNode(data.sire, data.sire_name),
                dam: buildNode(data.dam, data.dam_name),
            };
        }
    }

    return (
        <div className="min-h-screen bg-black text-gold-500 font-sans p-4 md:p-8">
            <div className="container mx-auto max-w-6xl">

                {/* Header & Search */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2">
                            Lineage Explorer
                        </h1>
                        <p className="text-zinc-500">Trace the bloodlines of your elite geckos.</p>
                    </div>

                    <form action={searchAction} className="flex w-full md:w-auto gap-2">
                        <div className="relative w-full md:w-[300px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                            <Input
                                name="searchId"
                                placeholder="Enter Gecko ID / Select from List..."
                                className="pl-10 bg-zinc-900 border-zinc-800 text-white focus:border-gold-500/50"
                            />
                        </div>
                        <Button type="submit" variant="outline" className="border-gold-500/30 text-gold-500 hover:bg-gold-500/10">
                            Load
                        </Button>
                    </form>
                </div>

                {/* Main Content */}
                <div className="bg-zinc-950/50 border border-zinc-900 rounded-xl p-8 min-h-[600px] flex items-center justify-center relative backdrop-blur-sm">
                    {geckoData ? (
                        <PedigreeChart gecko={geckoData} />
                    ) : (
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto">
                                <Search className="h-8 w-8 text-zinc-600" />
                            </div>
                            <h3 className="text-xl font-serif text-white">Select a Gecko</h3>
                            <p className="text-zinc-500 max-w-md">
                                Enter a Gecko ID above or select one from your dashboard to view its full 3-generation pedigree tree.
                            </p>
                            <Button asChild className="mt-4 bg-zinc-100 text-black hover:bg-white">
                                <a href="/shop">Browse Collection</a>
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Legal Disclaimer */}
            <div className="mt-8 pt-8 border-t border-zinc-900 text-center">
                <p className="text-[10px] text-zinc-600 max-w-2xl mx-auto leading-relaxed">
                    Disclaimer: The information above is based on user-submitted data. 'System Matched' indicates a link exists within the Crestia database, not a guarantee of biological parentage.
                    Crestia verifies connection integrity but does not physically verify the authenticity of stated lineages.
                </p>
            </div>
        </div>
    );
}