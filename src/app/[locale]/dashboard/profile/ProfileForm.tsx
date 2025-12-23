"use client";

import { useState } from "react";
import { updateProfile } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Store, ShieldCheck, User } from "lucide-react";

interface ProfileFormProps {
    email: string;
    profile: {
        shop_name: string | null;
        is_verified: boolean;
        avatar_url: string | null;
    } | null;
}

export function ProfileForm({ email, profile }: ProfileFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    async function onSubmit(formData: FormData) {
        setIsLoading(true);
        const result = await updateProfile(formData);
        setIsLoading(false);

        if (result?.error) {
            toast.error("Update Failed", { description: result.error });
        } else {
            toast.success("Profile Updated", { description: "Your shop branding has been refreshed." });
        }
    }

    return (
        <div className="space-y-8">
            {/* Header / Avatar Area */}
            <div className="flex flex-col md:flex-row items-center gap-6 pb-8 border-b border-zinc-800">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-zinc-900 border-2 border-gold-500/30 flex items-center justify-center overflow-hidden">
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <User className="h-10 w-10 text-gold-500/50" />
                        )}
                    </div>
                </div>

                <div className="text-center md:text-left space-y-2">
                    <h2 className="text-2xl font-serif font-bold text-white">
                        {profile?.shop_name || "New Shop"}
                    </h2>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                        <span className="text-zinc-400 text-sm">{email}</span>
                        {profile?.is_verified ? (
                            <Badge variant="outline" className="bg-gold-500/10 text-gold-500 border-gold-500/50 flex items-center gap-1">
                                <ShieldCheck className="h-3 w-3" /> Verified
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="bg-zinc-800 text-zinc-500 border-zinc-700">
                                Unverified
                            </Badge>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Form */}
            <form action={onSubmit} className="space-y-6 max-w-lg">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-zinc-400">Email Address</Label>
                    <Input
                        id="email"
                        value={email}
                        disabled
                        className="bg-zinc-900/50 border-zinc-800 text-zinc-500 cursor-not-allowed"
                    />
                    <p className="text-[10px] text-zinc-600">Email cannot be changed.</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="shop_name" className="text-white">Shop Name</Label>
                    <div className="relative">
                        <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold-500/50" />
                        <Input
                            id="shop_name"
                            name="shop_name"
                            defaultValue={profile?.shop_name || ""}
                            placeholder="Enter your shop name"
                            className="pl-10 bg-zinc-900 border-zinc-800 text-white focus:border-gold-500/50 placeholder:text-zinc-600"
                        />
                    </div>
                    <p className="text-[10px] text-zinc-500">This will be displayed on your public shop page.</p>
                </div>

                <div className="pt-4">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-gold-500 hover:bg-gold-400 text-black font-bold w-full md:w-auto min-w-[150px]"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
