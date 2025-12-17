import { createClient } from "@/lib/supabase/server";
import { AddGeckoForm } from "./AddGeckoForm";
import { redirect } from "next/navigation";

export default async function AddGeckoPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch Potential Parents (Include Unknown gender for flexibility)
    const { data: sires } = await supabase
        .from("geckos")
        .select("id, name")
        .eq("owner_id", user.id)
        .or("gender.eq.Male,gender.eq.Unknown");

    const { data: dams } = await supabase
        .from("geckos")
        .select("id, name")
        .eq("owner_id", user.id)
        .or("gender.eq.Female,gender.eq.Unknown");

    return (
        <div className="min-h-screen bg-black text-gold-500 font-sans">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-serif font-bold text-primary-foreground">Register New Gecko</h1>
                    <p className="text-muted-foreground mt-1">Add a new addition to your collection.</p>
                </div>

                <div className="bg-card/40 backdrop-blur-md border border-border/50 rounded-xl p-6 md:p-8">
                    <AddGeckoForm
                        sires={sires || []}
                        dams={dams || []}
                    />
                </div>
            </div>
        </div>
    );
}
