"use client";

import { useState, useEffect } from "react";
import { placeBid } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { differenceInSeconds } from "date-fns";
import { Gavel, Timer, AlertCircle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AuctionClientProps {
    auction: {
        id: string;
        current_bid: number;
        bid_increment: number;
        end_at: string;
        status: string;
    };
    currentUser: any;
}

export function AuctionClient({ auction, currentUser }: AuctionClientProps) {
    const [timeLeft, setTimeLeft] = useState("");
    const [isEnded, setIsEnded] = useState(auction.status !== "active");
    const [bidAmount, setBidAmount] = useState(auction.current_bid + auction.bid_increment);
    const [isLoading, setIsLoading] = useState(false);

    // Sync local state if server data changes (e.g. revalidate)
    useEffect(() => {
        setBidAmount(Math.max(bidAmount, auction.current_bid + auction.bid_increment));
        setIsEnded(auction.status !== "active");
    }, [auction.current_bid, auction.bid_increment, auction.status]);

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
                setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
            } else {
                setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [auction.end_at]);

    const handleBid = async () => {
        if (!currentUser) {
            toast.error("Login Required", { description: "Please login to place a bid." });
            // Ideally redirect to login here
            return;
        }

        setIsLoading(true);
        const result = await placeBid(auction.id, bidAmount);
        setIsLoading(false);

        if (result?.error) {
            toast.error("Bid Failed", { description: result.error });
        } else {
            toast.success("Bid Placed!", { description: `You represent the highest bid of $${bidAmount}` });
        }
    };

    return (
        <div className="space-y-8 bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 backdrop-blur-sm">

            {/* Countdown Header */}
            <div className="text-center space-y-2 pb-6 border-b border-zinc-800">
                <span className="text-sm font-medium text-zinc-400 uppercase tracking-widest">Time Remaining</span>
                <div className={cn("text-3xl md:text-4xl font-mono font-bold flex items-center justify-center gap-3", isEnded ? "text-red-500" : "text-gold-400")}>
                    <Timer className="w-8 h-8" />
                    {timeLeft}
                </div>
            </div>

            {/* Current Bid Display */}
            <div className="flex justify-between items-center py-4">
                <div>
                    <p className="text-zinc-400 text-sm">Current Highest Bid</p>
                    <p className="text-3xl font-serif font-bold text-white">${auction.current_bid.toLocaleString()}</p>
                </div>
                <div className="text-right">
                    <p className="text-zinc-400 text-sm">Increment</p>
                    <p className="text-xl font-serif text-zinc-300">+${auction.bid_increment}</p>
                </div>
            </div>

            {/* Bidding Area */}
            {!isEnded ? (
                <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-zinc-500">
                            <span>Your Offer</span>
                            <span>Min: ${(auction.current_bid + auction.bid_increment).toLocaleString()}</span>
                        </div>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
                            <Input
                                type="number"
                                value={bidAmount}
                                onChange={(e) => setBidAmount(Number(e.target.value))}
                                className="pl-6 bg-black border-zinc-700 text-white font-serif text-lg h-12 focus:border-gold-500"
                            />
                        </div>
                    </div>

                    <Button
                        onClick={handleBid}
                        disabled={isLoading || !currentUser}
                        className="w-full h-12 bg-gold-500 hover:bg-gold-400 text-black font-bold text-lg shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                    >
                        {isLoading ? "Placing Bid..." : "Place Bid Now"}
                    </Button>

                    {!currentUser && (
                        <p className="text-center text-xs text-red-400">
                            * You must be logged in to participate.
                        </p>
                    )}
                </div>
            ) : (
                <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 text-center space-y-2">
                    <Gavel className="w-8 h-8 text-zinc-600 mx-auto" />
                    <h3 className="text-white font-bold">Auction Closed</h3>
                    <p className="text-zinc-500 text-sm">This auction has successfully concluded.</p>
                </div>
            )}

            {/* Safety/Trust Badges */}
            <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <ShieldCheck className="w-4 h-4 text-gold-500/50" />
                    Secure Transaction
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <CheckCircle2 className="w-4 h-4 text-gold-500/50" />
                    Verified Breeder
                </div>
            </div>
        </div>
    );
}

import { ShieldCheck } from "lucide-react";
