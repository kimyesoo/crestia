import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { EditGeckoForm } from "../EditGeckoForm";

export default async function EditGeckoPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // 1. Fetch Target Gecko
    const { data: gecko, error } = await supabase
        .from("geckos")
        .select("*")
        .eq("id", id)
        .eq("owner_id", user.id)
        .single();

    if (error || !gecko) {
        redirect("/dashboard");
    }

    // 2. Fetch Potential Parents
    // Fetch all geckos owned by the user (excluding the gecko itself to prevent circular lineage)
    const { data: potentialParents } = await supabase
        .from("geckos")
        .select("id, name, gender")
        .eq("owner_id", user.id)
        .neq("id", id);

    return (
        <div className="min-h-screen bg-black text-gold-500 font-sans">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-serif font-bold text-primary-foreground">Edit Gecko</h1>
                    <p className="text-muted-foreground mt-1">Update details for {gecko.name}.</p>
                </div>

                <div className="bg-card/40 backdrop-blur-md border border-border/50 rounded-xl p-6 md:p-8">
                    <EditGeckoForm
                        gecko={gecko}
                        potentialParents={potentialParents || []}
                    />
                </div>
            </div>
        </div>
    );
}
