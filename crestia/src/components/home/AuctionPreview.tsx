"use client";

import { AuctionCard } from "@/components/auction/AuctionCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface AuctionPreviewProps {
    auctions: any[];
}

export function AuctionPreview({ auctions }: AuctionPreviewProps) {
    if (!auctions || auctions.length === 0) {
        return (
            <div className="text-center py-20 bg-zinc-900/30 rounded-2xl border border-zinc-800">
                <p className="text-zinc-500 mb-4">No active auctions at the moment.</p>
                <Link href="/market">
                    <Button variant="outline" className="text-gold-500 border-gold-500 hover:bg-gold-500 hover:text-black">
                        Browse Shop
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {auctions.map((auction, index) => (
                    <div
                        key={auction.id}
                        className="animate-in fade-in slide-in-from-bottom-5 duration-700 fill-mode-forwards opacity-0"
                        style={{ animationDelay: `${index * 150}ms`, animationFillMode: "forwards" }}
                    >
                        <AuctionCard auction={auction} />
                    </div>
                ))}
            </div>

            <div className="text-center pt-8">
                <Link href="/auction">
                    <Button className="bg-transparent border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-black px-8 py-6 text-lg rounded-none transition-all duration-300">
                        View All Live Auctions <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}
