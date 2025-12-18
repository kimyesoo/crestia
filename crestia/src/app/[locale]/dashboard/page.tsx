import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, ShieldCheck, Store, LayoutDashboard, Clock, ChevronRight, Edit, CreditCard } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function DashboardPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    // Fetch Profile Data
    const { data: profile } = await supabase
        .from("profiles")
        .select("shop_name, is_verified, avatar_url")
        .eq("id", user.id)
        .single();

    // Fetch Gecko Count
    const { count } = await supabase
        .from("geckos")
        .select("*", { count: "exact", head: true })
        .eq("owner_id", user.id);

    // Fetch Recent Geckos (Limit 3)
    const { data: recentGeckos } = await supabase
        .from("geckos")
        .select("id, name, morph, image_url, created_at")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3);

    const shopName = profile?.shop_name || "My Luxury Shop";
    const isVerified = profile?.is_verified || false;

    return (
        <div className="text-gold-500 font-sans">
            <div className="max-w-6xl mx-auto space-y-12">

                {/* Header with Profile Summary */}
                <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-zinc-800">
                    <div className="flex items-center gap-6">
                        <Avatar className="h-20 w-20 border-2 border-gold-500 bg-zinc-900 shadow-xl">
                            <AvatarImage src={profile?.avatar_url} />
                            <AvatarFallback className="text-2xl font-serif text-gold-500 bg-zinc-900">{shopName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-serif font-bold text-white tracking-tight flex items-center gap-3">
                                {shopName}
                                {isVerified && <ShieldCheck className="w-6 h-6 text-gold-500" />}
                            </h1>
                            <div className="flex items-center gap-4 mt-2 text-sm text-zinc-400">
                                <span className="flex items-center gap-1"><Store className="w-3 h-3" /> Dashboard</span>
                                <span className="w-1 h-1 rounded-full bg-zinc-700" />
                                <span>{user.email}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <Button asChild variant="outline" className="border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 flex-1 md:flex-none">
                            <Link href="/dashboard/profile">Edit Profile</Link>
                        </Button>
                        <Button asChild className="bg-gold-600 text-black hover:bg-gold-500 hover:text-black font-bold flex-1 md:flex-none">
                            <Link href="/shop">View Public Shop</Link>
                        </Button>
                    </div>
                </header>

                {/* Stats Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard
                        title="Total Geckos"
                        value={count || 0}
                        icon={<LayoutDashboard className="h-4 w-4 text-gold-500" />}
                        description="Registered in collection"
                    />
                    <StatCard
                        title="Verification"
                        value={isVerified ? "Verified" : "Pending"}
                        icon={<ShieldCheck className={`h-4 w-4 ${isVerified ? "text-gold-500" : "text-zinc-600"}`} />}
                        description={isVerified ? "Trusted Breeder Status" : "Submit documents"}
                        highlight={!isVerified}
                    />
                    <Button asChild className="h-auto flex flex-col items-center justify-center p-6 bg-zinc-900 border border-zinc-800 hover:border-gold-500/50 hover:bg-zinc-800 transition-all group">
                        <Link href="/dashboard/add">
                            <div className="bg-gold-500 rounded-full p-3 mb-3 group-hover:scale-110 transition-transform">
                                <Plus className="w-6 h-6 text-black" />
                            </div>
                            <span className="text-lg font-serif font-bold text-white">Register New Gecko</span>
                            <span className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">Add to Inventory</span>
                        </Link>
                    </Button>
                </section>

                {/* Recent Activity / Quick Manage */}
                <section>
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-white">Recently Added</h2>
                            <p className="text-zinc-500 text-sm mt-1">Quickly manage your latest additions.</p>
                        </div>
                        <Link href="/shop" className="text-sm text-gold-500 hover:text-gold-400 flex items-center gap-1">
                            View All <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {recentGeckos && recentGeckos.map(gecko => (
                            <div key={gecko.id} className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 flex items-center gap-4 hover:border-gold-500/30 transition-colors group">
                                <Link href={`/geckos/${gecko.id}`} className="h-16 w-16 rounded-md overflow-hidden bg-black shrink-0 relative block">
                                    {gecko.image_url ? (
                                        <img src={gecko.image_url} alt={gecko.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[8px] text-zinc-600">NO IMG</div>
                                    )}
                                </Link>
                                <div className="flex-grow min-w-0">
                                    <Link href={`/geckos/${gecko.id}`} className="hover:underline decoration-gold-500/50">
                                        <h3 className="text-white font-bold truncate group-hover:text-gold-500 transition-colors">{gecko.name}</h3>
                                    </Link>
                                    <p className="text-xs text-zinc-500 truncate">{gecko.morph}</p>
                                    <div className="flex items-center gap-1 mt-1 text-[10px] text-zinc-600">
                                        <Clock className="w-3 h-3" />
                                        {new Date(gecko.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Link
                                        href={`/geckos/${gecko.id}/card`}
                                        className="h-8 w-8 inline-flex items-center justify-center rounded-md text-zinc-400 hover:text-gold-500 hover:bg-zinc-800 transition-colors"
                                    >
                                        <CreditCard className="w-4 h-4" />
                                    </Link>
                                    <Link
                                        href={`/dashboard/edit/${gecko.id}`}
                                        className="h-8 w-8 inline-flex items-center justify-center rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
}

function StatCard({ title, value, icon, description, highlight = false }: any) {
    return (
        <Card className={`bg-zinc-900 border ${highlight ? 'border-gold-500/30' : 'border-zinc-800'} shadow-lg`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-widest">
                    {title}
                </CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-white font-serif">
                    {value}
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                    {description}
                </p>
            </CardContent>
        </Card>
    );
}
