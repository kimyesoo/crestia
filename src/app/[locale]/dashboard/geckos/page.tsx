import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Plus, Clock, Edit, CreditCard, GitFork, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export default async function MyGeckosPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    // Fetch All Geckos
    const { data: geckos } = await supabase
        .from("geckos")
        .select("id, name, morph, gender, image_url, created_at")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

    return (
        <div className="text-gold-500 font-sans pt-32 px-4 sm:px-6 lg:px-8 overflow-x-hidden pb-16">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-zinc-400 hover:text-white transition">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">My Geckos</h1>
                            <p className="text-zinc-500 text-sm mt-1">
                                {geckos?.length || 0} registered in your collection
                            </p>
                        </div>
                    </div>
                    <Button asChild className="bg-gold-600 text-black hover:bg-gold-500 font-bold">
                        <Link href="/dashboard/add" className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Add New
                        </Link>
                    </Button>
                </header>

                {/* Gecko Grid */}
                {geckos && geckos.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {geckos.map(gecko => (
                            <div
                                key={gecko.id}
                                className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden hover:border-gold-500/30 transition-all group"
                            >
                                {/* Image */}
                                <Link href={`/geckos/${gecko.id}`} className="block aspect-square relative overflow-hidden bg-black">
                                    {gecko.image_url ? (
                                        <img
                                            src={gecko.image_url}
                                            alt={gecko.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-700 text-sm">
                                            No Image
                                        </div>
                                    )}
                                </Link>

                                {/* Info */}
                                <div className="p-4">
                                    <Link href={`/geckos/${gecko.id}`} className="hover:underline decoration-gold-500/50">
                                        <h3 className="text-lg font-bold text-white truncate group-hover:text-gold-500 transition-colors">
                                            {gecko.name}
                                        </h3>
                                    </Link>
                                    <p className="text-sm text-zinc-500 truncate mt-1">{gecko.morph || 'Unknown morph'}</p>
                                    <div className="flex items-center gap-2 mt-2 text-xs text-zinc-600">
                                        <span className="capitalize">{gecko.gender || 'Unknown'}</span>
                                        <span className="w-1 h-1 rounded-full bg-zinc-700" />
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(gecko.created_at).toLocaleDateString('ko-KR')}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 mt-4 pt-3 border-t border-zinc-800">
                                        <Link
                                            href={`/lineage?gecko=${gecko.id}`}
                                            className="flex-1 h-9 inline-flex items-center justify-center rounded-md text-zinc-400 hover:text-green-400 hover:bg-zinc-800 transition-colors text-xs gap-1"
                                            title="View Lineage"
                                        >
                                            <GitFork className="w-4 h-4" />
                                            Lineage
                                        </Link>
                                        <Link
                                            href={`/geckos/${gecko.id}/card`}
                                            className="flex-1 h-9 inline-flex items-center justify-center rounded-md text-zinc-400 hover:text-gold-500 hover:bg-zinc-800 transition-colors text-xs gap-1"
                                            title="ID Card"
                                        >
                                            <CreditCard className="w-4 h-4" />
                                            Card
                                        </Link>
                                        <Link
                                            href={`/dashboard/edit/${gecko.id}`}
                                            className="flex-1 h-9 inline-flex items-center justify-center rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors text-xs gap-1"
                                            title="Edit"
                                        >
                                            <Edit className="w-4 h-4" />
                                            Edit
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-10 h-10 text-zinc-600" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No geckos registered yet</h3>
                        <p className="text-zinc-500 mb-6">Start building your collection by adding your first gecko.</p>
                        <Button asChild className="bg-gold-600 text-black hover:bg-gold-500 font-bold">
                            <Link href="/dashboard/add" className="flex items-center gap-2">
                                <Plus className="w-4 h-4" />
                                Register Your First Gecko
                            </Link>
                        </Button>
                    </div>
                )}

            </div>
        </div>
    );
}
