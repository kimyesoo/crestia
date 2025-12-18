"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
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
import { useRouter, usePathname } from "next/navigation";
import { Menu, LayoutDashboard, LogOut, User as UserIcon, Store } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTranslations, useLocale } from "next-intl";

interface NavbarProps {
    user: User | null;
}

export function Navbar({ user }: NavbarProps) {
    const [isScrolled, setIsScrolled] = React.useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const supabase = createClient();
    const t = useTranslations('Navigation'); // Updated key
    const locale = useLocale();

    // Locale Switcher Logic
    const currentLocale = pathname.startsWith('/ko') ? 'ko' : 'en';

    const toggleLanguage = () => {
        const newLocale = currentLocale === 'en' ? 'ko' : 'en';
        // Replace the locale segment in the pathname
        // If pathname is just "/" (rare with middleware redirecting), assume default en -> switch to ko
        const newPath = pathname.replace(/^\/(en|ko)/, `/${newLocale}`) || `/${newLocale}`;

        // If replacement didn't happen (e.g. root path issues), force it
        // But simply logic: if starts with /en or /ko, replace it. 
        // If it doesn't (could happen on some setups), prepend it.
        // Given our setup, it should always have the locale.
        router.push(newPath);
    };

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
            <NavLink href={`/${locale}`}>{t('home')}</NavLink>
            <NavLink href={`/${locale}/auctions`}>{t('auctions')}</NavLink>
            <NavLink href={`/${locale}/lineage`}>{t('lineage')}</NavLink>
            {user && <NavLink href={`/${locale}/dashboard`}>{t('dashboard')}</NavLink>}
            <NavLink href={`/${locale}/shop`}>{t('shop')}</NavLink>
        </>
    );

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ease-in-out border-b border-transparent min-h-[6rem] flex items-center",
                isScrolled
                    ? "bg-black/90 backdrop-blur-md border-zinc-800 py-4 shadow-lg"
                    : "bg-gradient-to-b from-black/80 to-transparent py-6"
            )}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href={`/${locale}`} className="relative z-10 flex items-center gap-2 group">
                    <div className="relative w-12 h-12 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                        <Image
                            src="/logo.png"
                            alt="Crestia Logo"
                            fill
                            className="object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]"
                            priority
                        />
                    </div>
                    <span className="text-2xl font-serif font-bold tracking-[0.2em] text-white group-hover:text-[#D4AF37] transition-colors duration-300">
                        CRESTIA
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-12">
                    <NavItems />
                </div>

                {/* Right Side Actions */}
                <div className="hidden md:flex items-center gap-6">
                    <button
                        onClick={toggleLanguage}
                        className="text-sm font-medium text-zinc-400 hover:text-[#D4AF37] transition-colors uppercase tracking-widest"
                    >
                        {currentLocale === 'en' ? 'KO' : 'EN'}
                    </button>

                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-[#D4AF37]/20 hover:ring-[#D4AF37] transition-all duration-300">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={user.user_metadata.avatar_url} />
                                        <AvatarFallback className="bg-zinc-900 text-[#D4AF37]">
                                            {user.email?.[0].toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 bg-black/95 border-zinc-800 text-zinc-200">
                                <DropdownMenuLabel className="text-[#D4AF37]">{t('myAccount')}</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-zinc-800" />
                                <DropdownMenuItem asChild className="focus:bg-zinc-900 focus:text-[#D4AF37] cursor-pointer">
                                    <Link href={`/${locale}/dashboard`}>
                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                        <span>{t('dashboard')}</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="focus:bg-zinc-900 focus:text-[#D4AF37] cursor-pointer">
                                    <Link href={`/${locale}/dashboard/profile`}>
                                        <UserIcon className="mr-2 h-4 w-4" />
                                        <span>{t('profile')}</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-zinc-800" />
                                <DropdownMenuItem onClick={handleLogout} className="text-red-400 focus:bg-red-950/20 focus:text-red-400 cursor-pointer">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>{t('logout')}</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button asChild variant="ghost" className="text-zinc-400 hover:text-[#D4AF37] hover:bg-transparent font-bold tracking-widest uppercase">
                            <Link href={`/${locale}/login`}>{t('login')}</Link>
                        </Button>
                    )}
                </div>

                {/* Mobile Menu */}
                <div className="md:hidden flex items-center gap-4">
                    <button
                        onClick={toggleLanguage}
                        className="text-xs font-medium text-zinc-400 hover:text-[#D4AF37] transition-colors uppercase tracking-widest"
                    >
                        {currentLocale === 'en' ? 'KO' : 'EN'}
                    </button>

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-zinc-200 hover:text-[#D4AF37] hover:bg-transparent">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] bg-black/95 border-l border-zinc-800 p-0">
                            <div className="flex flex-col h-full bg-black/95 backdrop-blur-xl">
                                <div className="p-8 border-b border-zinc-800/50">
                                    <span className="text-2xl font-serif font-bold tracking-[0.2em] text-[#D4AF37]">
                                        CRESTIA
                                    </span>
                                </div>
                                <div className="flex-1 flex flex-col p-8 gap-8">
                                    <div className="flex flex-col gap-6">
                                        <NavItems />
                                    </div>

                                    {user ? (
                                        <div className="mt-auto flex flex-col gap-4 border-t border-zinc-800/50 pt-8">
                                            <div className="flex items-center gap-3 text-zinc-400">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={user.user_metadata.avatar_url} />
                                                    <AvatarFallback className="bg-zinc-900 text-[#D4AF37]">
                                                        {user.email?.[0].toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm truncate">{user.email}</span>
                                            </div>
                                            <Button
                                                onClick={handleLogout}
                                                variant="ghost"
                                                className="justify-start px-0 text-red-400 hover:text-red-300 hover:bg-transparent"
                                            >
                                                <LogOut className="mr-2 h-4 w-4" />
                                                {t('logout')}
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="mt-auto border-t border-zinc-800/50 pt-8">
                                            <Button asChild className="w-full bg-[#D4AF37] text-black hover:bg-[#b08d22]">
                                                <Link href={`/${locale}/login`}>{t('login')}</Link>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="text-lg font-bold text-zinc-400 hover:text-[#D4AF37] transition-colors duration-300 uppercase tracking-widest relative group py-2 whitespace-nowrap"
        >
            {children}
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
        </Link>
    );
}
