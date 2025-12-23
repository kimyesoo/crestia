import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "./ProfileForm";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    return (
        <div className="min-h-screen bg-black text-gold-500 font-sans p-4 md:p-8">
            <div className="container mx-auto max-w-3xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-serif font-bold text-white mb-2">Shop Settings</h1>
                    <p className="text-zinc-500">Manage your public profile and brand identity.</p>
                </div>

                <div className="bg-zinc-950/50 border border-zinc-900 rounded-xl p-6 md:p-10 backdrop-blur-sm shadow-2xl">
                    <ProfileForm email={user.email || ""} profile={profile} />
                </div>
            </div>
        </div>
    );
}
