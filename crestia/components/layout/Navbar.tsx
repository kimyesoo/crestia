"use client";

import * as React from "react";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Menu, LayoutDashboard, LogOut, User as UserIcon, Store } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavbarProps {
    user: User | null;
}

export function Navbar({ user }: NavbarProps) {
    const [isScrolled, setIsScrolled] = React.useState(false);
    const router = useRouter();
    const supabase = createClient();

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };

    const NavItems = () => (
        <>
            <NavLink href="/">Home</NavLink>
            <NavLink href="/auction">Auctions</NavLink>
            <NavLink href="/lineage">Lineage</NavLink>
            {user && <NavLink href="/dashboard">Dashboard</NavLink>}
            <NavLink href="/shop">Shop</NavLink>
        </>
    );

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b border-transparent",
                isScrolled
                    ? "bg-black/90 backdrop-blur-md border-zinc-800 py-3 shadow-lg"
                    : "bg-gradient-to-b from-black/80 to-transparent py-6"
            )}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="font-serif text-2xl font-bold text-white tracking-tight hover:text-gold-500 transition-colors flex items-center gap-2">
                    <span className="text-gold-500">✦</span> CRESTIA
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    <NavItems />
                </div>

                {/* Right Side: Auth & Mobile Menu */}
                <div className="flex items-center space-x-4">
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-gold-500/20 hover:ring-gold-500/50 transition-all p-0 overflow-hidden">
                                    <Avatar className="h-full w-full">
                                        <AvatarImage src={user.user_metadata.avatar_url} alt={user.email || ""} className="object-cover" />
                                        <AvatarFallback className="bg-zinc-900 text-gold-500 font-serif">
                                            {user.email?.[0].toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 bg-zinc-950 border-zinc-800 text-zinc-300" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none font-serif text-white">{user.user_metadata.full_name || "Member"}</p>
                                        <p className="text-xs leading-none text-zinc-500 truncate">
                                            {user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-zinc-800" />
                                <DropdownMenuItem asChild className="focus:bg-zinc-900 focus:text-gold-500 cursor-pointer">
                                    <Link href="/dashboard/profile" className="flex items-center">
                                        <UserIcon className="mr-2 h-4 w-4" /> Profile Settings
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="focus:bg-zinc-900 focus:text-gold-500 cursor-pointer">
                                    <Link href="/dashboard" className="flex items-center">
                                        <LayoutDashboard className="mr-2 h-4 w-4" /> Seller Dashboard
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="focus:bg-zinc-900 focus:text-gold-500 cursor-pointer">
                                    <Link href="/shop" className="flex items-center">
                                        <Store className="mr-2 h-4 w-4" /> My Shop
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-zinc-800" />
                                <DropdownMenuItem onClick={handleLogout} className="text-red-400 focus:text-red-300 focus:bg-red-950/20 cursor-pointer">
                                    <LogOut className="mr-2 h-4 w-4" /> Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button asChild size="sm" className="bg-gold-500 text-black hover:bg-gold-400 font-bold tracking-wide transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)]">
                            <Link href="/login">
                                LOGIN
                            </Link>
                        </Button>
                    )}

                    {/* Mobile Menu */}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-zinc-300 hover:text-white">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="bg-black border-zinc-900 w-[300px] sm:w-[400px]">
                                <nav className="flex flex-col gap-6 mt-10">
                                    <NavItems />
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="text-sm font-medium text-zinc-400 hover:text-gold-500 transition-colors duration-300 uppercase tracking-widest relative group py-2"
        >
            {children}
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold-500 transition-all duration-300 group-hover:w-full" />
        </Link>
    );
}
