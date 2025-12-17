import { createClient } from "@/lib/supabase/server";
import { AuctionPreview } from "@/components/home/AuctionPreview";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Dna, Crown, Store, Gavel } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();

  // Fetch Active Auctions
  const { data: auctions } = await supabase
    .from("auctions")
    .select(`
            *,
            gecko:geckos (
                name,
                morph,
                image_url,
                gender
            )
        `)
    .eq("status", "active")
    .order("end_at", { ascending: true })
    .limit(3);

  // Fetch Stats (Mocked or simple count query)
  const { count: geckoCount } = await supabase.from("geckos").select("*", { count: 'exact', head: true });
  const { count: activeAuctionCount } = await supabase.from("auctions").select("*", { count: 'exact', head: true }).eq("status", "active");

  return (
    <div className="min-h-screen bg-black font-sans text-white overflow-x-hidden">

      {/* 1. Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image/Gradient */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596727147705-53a7d0c5533b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 animate-in fade-in duration-1000"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black"></div>

        {/* Content */}
        <div className="relative container mx-auto px-6 text-center z-10 space-y-8">
          <div className="space-y-4 animate-in slide-in-from-bottom-10 fade-in duration-1000">
            <span className="text-gold-500 text-sm md:text-base font-bold tracking-[0.3em] uppercase">Premium Reptile Marketplace</span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white leading-tight">
              CRESTIA <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-500 to-gold-700">LEGACY</span>
            </h1>
            <p className="text-zinc-300 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
              The ultimate destination for elite crested geckos.
              Trade, auction, and manage your lineage with uncompromised luxury.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 animate-in slide-in-from-bottom-10 fade-in duration-1000 delay-200">
            <Link href="/auction">
              <Button className="h-14 px-10 text-lg bg-gold-500 text-black hover:bg-gold-400 font-bold rounded-none w-full sm:w-auto">
                <Gavel className="mr-2 h-5 w-5" />
                Start Bidding
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="h-14 px-10 text-lg border-white text-white hover:bg-white hover:text-black rounded-none w-full sm:w-auto">
                <Store className="mr-2 h-5 w-5" />
                Create My Shop
              </Button>
            </Link>
          </div>
        </div>

        {/* Search Bar (Floating) */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-xl px-6 animate-in fade-in duration-1000 delay-500">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-full p-2 flex items-center pr-4 shadow-2xl">
            <input
              type="text"
              placeholder="Search by Morph, ID, or Shop Name..."
              className="bg-transparent border-none text-white placeholder:text-zinc-400 flex-grow h-12 px-6 focus:ring-0 outline-none"
            />
            <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center text-black cursor-pointer hover:bg-gold-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Stats Section */}
      <section className="py-12 border-y border-zinc-900 bg-zinc-950">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-zinc-900">
            <StatItem label="Registered Geckos" value={geckoCount || 0} />
            <StatItem label="Active Auctions" value={activeAuctionCount || 0} />
            <StatItem label="Verified Breeders" value={12} />
            <StatItem label="Total Volume" value="$45K+" />
          </div>
        </div>
      </section>

      {/* 3. Live Auction Preview */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div>
              <span className="text-gold-500 font-bold tracking-widest uppercase text-sm">Live Marketplace</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mt-2">Curated Auctions</h2>
            </div>
          </div>

          <AuctionPreview auctions={auctions || []} />
        </div>
      </section>

      {/* 4. Features Section */}
      <section className="py-24 bg-zinc-950 border-t border-zinc-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gold-900/10 via-transparent to-transparent"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white">The Crestia Standard</h2>
            <p className="text-zinc-500 text-lg">
              We don't just sell geckos. We provide a platform for preserving legacy and value.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard
              icon={<Dna className="w-10 h-10 text-gold-500" />}
              title="Pedigree Tracking"
              description="Visualized lineage trees ensuring genetic transparency and value preservation for every gecko."
            />
            <FeatureCard
              icon={<ShieldCheck className="w-10 h-10 text-gold-500" />}
              title="Verified Breeders"
              description="Strict verification process for shops ensures you deal only with trusted professionals."
            />
            <FeatureCard
              icon={<Crown className="w-10 h-10 text-gold-500" />}
              title="Premium Auctions"
              description="A fair, transparent, and secure bidding environment designed for high-value assets."
            />
          </div>
        </div>
      </section>

      {/* 5. Footer */}
      <Footer />
    </div>
  );
}

function StatItem({ value, label }: { value: number | string, label: string }) {
  return (
    <div className="space-y-2">
      <div className="text-3xl md:text-4xl font-serif font-bold text-white">{value}</div>
      <div className="text-xs text-zinc-500 uppercase tracking-widest">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-zinc-900/50 p-10 border border-zinc-800 hover:border-gold-500/30 transition-colors group space-y-6 text-center md:text-left">
      <div className="w-16 h-16 bg-black border border-zinc-800 rounded-full flex items-center justify-center mx-auto md:mx-0 group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="text-zinc-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
