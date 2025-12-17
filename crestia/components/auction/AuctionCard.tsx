"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow, differenceInSeconds } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Timer, Gavel } from "lucide-react";

interface AuctionCardProps {
    auction: {
        id: string;
        current_bid: number;
        end_at: string;
        gecko: {
            name: string;
            morph: string;
            image_url?: string | null;
            gender: "Male" | "Female" | "Unknown";
        } | null;
    };
}

export function AuctionCard({ auction }: AuctionCardProps) {
    const [timeLeft, setTimeLeft] = useState("");
    const [isEnded, setIsEnded] = useState(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const end = new Date(auction.end_at);
            const now = new Date();
            const diff = differenceInSeconds(end, now);

            if (diff <= 0) {
                setTimeLeft("Auction Ended");
                setIsEnded(true);
                return;
            }

            const days = Math.floor(diff / (3600 * 24));
            const hours = Math.floor((diff % (3600 * 24)) / 3600);
            const minutes = Math.floor((diff % 3600) / 60);
            const seconds = diff % 60;

            if (days > 0) {
                setTimeLeft(`${days}d ${hours}h left`);
            } else {
                setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [auction.end_at]);

    if (!auction.gecko) return null;

    return (
        <Link href={`/auction/${auction.id}`} className="group block h-full">
            <Card className="h-full bg-zinc-900 border-zinc-800 overflow-hidden group-hover:border-gold-500/50 transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.1)] relative flex flex-col">

                {/* Image Area */}
                <div className="aspect-[4/3] relative overflow-hidden bg-black">
                    {auction.gecko.image_url ? (
                        <img
                            src={auction.gecko.image_url}
                            alt={auction.gecko.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-zinc-700 bg-zinc-950">
                            <span className="text-xs uppercase tracking-widest">No Image</span>
                        </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3 z-10">
                        <Badge className={`${isEnded ? 'bg-zinc-600' : 'bg-red-600 animate-pulse'} text-white border-0 font-bold tracking-wider rounded-sm shadow-lg`}>
                            {isEnded ? "FINISHED" : "LIVE"}
                        </Badge>
                    </div>

                    {/* Timer Badge */}
                    <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-gold-500/30 text-gold-400 font-mono text-sm font-bold shadow-xl">
                        <Timer className="w-3 h-3" />
                        {timeLeft}
                    </div>

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60" />
                </div>

                <CardContent className="p-5 flex-grow space-y-2 relative">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-serif font-bold text-xl text-white group-hover:text-gold-400 transition-colors line-clamp-1">
                                {auction.gecko.name}
                            </h3>
                            <p className="text-xs text-gold-500/80 font-medium uppercase tracking-widest mt-1">
                                {auction.gecko.morph}
                            </p>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="p-5 pt-0 mt-auto border-t border-zinc-800/50">
                    <div className="w-full flex justify-between items-end mt-4">
                        <div className="flex flex-col">
                            <span className="text-xs text-zinc-500 font-medium uppercase">Current Bid</span>
                            <span className="text-2xl font-bold text-white font-serif flex items-center gap-1">
                                ${auction.current_bid.toLocaleString()}
                            </span>
                        </div>
                        <div className="bg-gold-500 text-black p-2 rounded-full transform group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                            <Gavel className="w-5 h-5" />
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}
