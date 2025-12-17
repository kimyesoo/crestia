"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function placeBid(auctionId: string, bidAmount: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "You must be logged in to place a bid." };
    }

    // 1. Fetch current auction state
    const { data: auction, error: fetchError } = await supabase
        .from("auctions")
        .select("current_bid, bid_increment, status, end_at")
        .eq("id", auctionId)
        .single();

    if (fetchError || !auction) {
        return { error: "Auction not found." };
    }

    if (auction.status !== "active") {
        return { error: "This auction has ended." };
    }

    if (new Date(auction.end_at) < new Date()) {
        return { error: "Time has expired for this auction." };
    }

    // 2. Validate Bid Amount
    const minBid = auction.current_bid + auction.bid_increment;
    if (bidAmount < minBid) {
        return { error: `Bid must be at least $${minBid.toLocaleString()}` };
    }

    // 3. Update Auction
    const { error: updateError } = await supabase
        .from("auctions")
        .update({ current_bid: bidAmount })
        .eq("id", auctionId);

    if (updateError) {
        console.error("Bid Update Error:", updateError);
        return { error: "Failed to place bid. Please try again." };
    }

    // 4. Revalidate
    revalidatePath(`/auction/${auctionId}`);
    revalidatePath("/auction");

    return { success: true };
}
