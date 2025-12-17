import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <h2 className="text-2xl font-serif text-primary-foreground">Access Denied</h2>
                <p className="text-muted-foreground">Please log in to view your dashboard.</p>
                <Button asChild>
                    <Link href="/login">Login</Link>
                </Button>
            </div>
        );
    }

    const { data: geckos } = await supabase
        .from("geckos")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-primary-foreground">My Shop</h1>
                    <p className="text-muted-foreground mt-1">Manage your collection</p>
                </div>
                <Button asChild className="bg-gold-500 text-black hover:bg-gold-400 font-semibold gap-2">
                    <Link href="/dashboard/add">
                        <Plus className="h-4 w-4" /> Add Gecko
                    </Link>
                </Button>
            </div>

            {/* Grid */}
            {geckos && geckos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {geckos.map((gecko) => (
                        <Card key={gecko.id} className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden hover:border-gold-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-gold-900/10 group">
                            <div className="aspect-square relative overflow-hidden bg-secondary/50">
                                {gecko.image_url ? (
                                    <img
                                        src={gecko.image_url}
                                        alt={gecko.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-muted-foreground">
                                        No Image
                                    </div>
                                )}
                                {/* Badge Overlay */}
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <span className="px-2 py-1 bg-black/70 backdrop-blur text-xs text-white rounded-md border border-white/10 uppercase tracking-wider">
                                        {gecko.gender.charAt(0)}
                                    </span>
                                </div>
                            </div>

                            <CardHeader className="p-4 space-y-1">
                                <CardTitle className="font-serif text-lg tracking-wide group-hover:text-gold-400 transition-colors">
                                    {gecko.name}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider text-xs">
                                    {gecko.morph}
                                </p>
                            </CardHeader>

                            <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">
                                Born: {gecko.birth_date || "Unknown"}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 border border-dashed border-border/50 rounded-lg bg-card/20 text-center space-y-4">
                    <div className="p-4 bg-secondary/50 rounded-full">
                        <Plus className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-medium text-primary-foreground">Start Your Legacy</h3>
                    <p className="text-muted-foreground max-w-sm">
                        You haven't registered any geckos yet. Add your first gecko to begin tracking your lineage.
                    </p>
                    <Button asChild variant="outline" className="border-gold-500/30 text-gold-500 hover:bg-gold-500/10 hover:text-gold-400">
                        <Link href="/dashboard/add">Register First Gecko</Link>
                    </Button>
                </div>
            )}
        </div>
    );
}
