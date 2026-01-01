'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User } from '@supabase/supabase-js';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { createClient } from '@/lib/supabase/client';
import { useRouter, usePathname } from 'next/navigation';
import {
    Menu,
    LayoutDashboard,
    LogOut,
    User as UserIcon,
    ChevronDown,
    BookOpen,
    Lightbulb,
    Bell,
    Image as ImageIcon,
    MessageSquare,
    Gavel,
    ShoppingBag,
    FileText,
    X,
    Sparkles,
    Calculator,
    GitFork,
    Dna
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useTranslations, useLocale } from 'next-intl';

interface NavbarProps {
    user: User | null;
}

interface NavItem {
    label: string;
    sub: string;
    href?: string;
    children?: {
        label: string;
        sub: string;
        href: string;
        icon: React.ReactNode;
    }[];
}

export function Navbar({ user }: NavbarProps) {
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
    const [mobileOpenSection, setMobileOpenSection] = React.useState<string | null>(null);
    const router = useRouter();
    const pathname = usePathname();
    const supabase = createClient();
    const t = useTranslations('Navigation');
    const locale = useLocale();

    const currentLocale = pathname.startsWith('/ko') ? 'ko' : 'en';

    const toggleLanguage = () => {
        const newLocale = currentLocale === 'en' ? 'ko' : 'en';
        const newPath = pathname.replace(/^\/(en|ko)/, `/${newLocale}`) || `/${newLocale}`;
        router.push(newPath);
    };

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };

    const NAV_ITEMS: NavItem[] = [
        {
            label: 'HOME',
            sub: '(홈)',
            href: `/${locale}`
        },
        {
            label: 'GUIDE',
            sub: '(가이드)',
            href: `/${locale}/guide`,
            children: [
                { label: '초보 가이드', sub: 'Beginner Guide', href: `/${locale}/guide/beginner`, icon: <BookOpen className="w-4 h-4" /> },
                { label: '모프 도감', sub: 'Morphopedia', href: `/${locale}/guide/morphs`, icon: <Dna className="w-4 h-4" /> },
                { label: '사육 지식', sub: 'Care Guide', href: `/${locale}/guide/care`, icon: <Lightbulb className="w-4 h-4" /> },
            ]
        },
        {
            label: 'COMMUNITY',
            sub: '(커뮤니티)',
            href: `/${locale}/community`,
            children: [
                { label: '공지사항', sub: 'Notice', href: `/${locale}/community/notice`, icon: <Bell className="w-4 h-4" /> },
                { label: '크레스타그램', sub: 'Gallery', href: `/${locale}/community/gallery`, icon: <ImageIcon className="w-4 h-4" /> },
                { label: '자유게시판', sub: 'Board', href: `/${locale}/community/board`, icon: <MessageSquare className="w-4 h-4" /> },
                { label: 'Q&A', sub: '질문답변', href: `/${locale}/community/qna`, icon: <Lightbulb className="w-4 h-4" /> },
            ]
        },
        // ===== MARKET 메뉴 (경매/분양은 임시 숨김 - 용품 추천만 활성화) =====
        {
            label: 'SHOP',
            sub: '(추천템)',
            href: `/${locale}/market/supplies`,
            // 경매/분양 children은 런칭 후 활성화
            // children: [
            //     { label: '경매/분양', sub: 'Auction', href: `/${locale}/market/auction`, icon: <Gavel className="w-4 h-4" /> },
            //     { label: '용품 추천', sub: 'Supplies', href: `/${locale}/market/supplies`, icon: <ShoppingBag className="w-4 h-4" /> },
            // ]
        },
        // ===== MARKET 메뉴 끝 =====
        {
            label: 'TOOLS',
            sub: '(도구)',
            href: `/${locale}/tools`,
            children: [
                { label: '2세 작명소', sub: 'Naming', href: `/${locale}/tools/naming`, icon: <Sparkles className="w-4 h-4" /> },
                { label: '모프 계산기', sub: 'Calculator', href: `/${locale}/tools/calculator`, icon: <Calculator className="w-4 h-4" /> },
                { label: '분양 계약서', sub: 'Contract', href: `/${locale}/tools/contract`, icon: <FileText className="w-4 h-4" /> },
                { label: '혈통도', sub: 'Lineage', href: `/${locale}/lineage`, icon: <GitFork className="w-4 h-4" /> },
                { label: 'ID 카드', sub: 'Card', href: `/${locale}/card`, icon: <ImageIcon className="w-4 h-4" /> },
            ]
        },
        ...(user ? [{
            label: 'MY PAGE',
            sub: '(마이페이지)',
            href: `/${locale}/dashboard`,
            children: [
                { label: '대시보드', sub: 'Dashboard', href: `/${locale}/dashboard`, icon: <LayoutDashboard className="w-4 h-4" /> },
                { label: '프로필', sub: 'Profile', href: `/${locale}/dashboard/profile`, icon: <UserIcon className="w-4 h-4" /> },
            ]
        }] : []),
    ];

    return (
        <nav
            className={cn(
                'fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ease-in-out border-b border-transparent',
                isScrolled
                    ? 'bg-black/95 backdrop-blur-md border-zinc-800 shadow-lg'
                    : 'bg-gradient-to-b from-black/90 to-transparent'
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href={`/${locale}`} className="flex-shrink-0 flex items-center gap-2 group">
                        <div className="relative w-10 h-10 transition-transform duration-500 group-hover:scale-110">
                            <Image
                                src="/logo.png"
                                alt="Crestia Logo"
                                fill
                                sizes="40px"
                                className="object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]"
                                priority
                            />
                        </div>
                        <span className="text-xl font-serif font-bold tracking-[0.15em] text-white group-hover:text-[#D4AF37] transition-colors duration-300">
                            CRESTIA
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-1">
                        {NAV_ITEMS.map((item) => (
                            item.children ? (
                                <NavDropdown
                                    key={item.label}
                                    item={item}
                                    isOpen={openDropdown === item.label}
                                    onOpenChange={(open) => setOpenDropdown(open ? item.label : null)}
                                />
                            ) : (
                                <NavLink key={item.label} href={item.href!} label={item.label} sub={item.sub} />
                            )
                        ))}
                    </div>

                    {/* Right Section */}
                    <div className="hidden lg:flex items-center gap-4">
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
                            <Button asChild className="bg-[#D4AF37] text-black hover:bg-[#b08d22] font-bold tracking-wider">
                                <Link href={`/${locale}/login`}>{t('login')}</Link>
                            </Button>
                        )}
                    </div>

                    {/* Mobile Menu */}
                    <div className="lg:hidden flex items-center gap-3">
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
                            <SheetContent side="right" className="w-[320px] bg-black border-l border-zinc-800 p-0">
                                <div className="flex flex-col h-full">
                                    {/* Header */}
                                    <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                                        <span className="text-xl font-serif font-bold tracking-[0.15em] text-[#D4AF37]">
                                            CRESTIA
                                        </span>
                                        <SheetClose asChild>
                                            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                                                <X className="h-5 w-5" />
                                            </Button>
                                        </SheetClose>
                                    </div>

                                    {/* Navigation Items */}
                                    <div className="flex-1 overflow-y-auto py-4">
                                        {NAV_ITEMS.map((item) => (
                                            <div key={item.label} className="border-b border-zinc-800/50">
                                                {item.children ? (
                                                    <div>
                                                        <button
                                                            onClick={() => setMobileOpenSection(
                                                                mobileOpenSection === item.label ? null : item.label
                                                            )}
                                                            className="w-full flex items-center justify-between px-6 py-4 text-left"
                                                        >
                                                            <div>
                                                                <span className="text-sm font-bold text-zinc-300 uppercase tracking-widest">
                                                                    {item.label}
                                                                </span>
                                                                <span className="text-xs text-zinc-600 ml-2">{item.sub}</span>
                                                            </div>
                                                            <ChevronDown
                                                                className={cn(
                                                                    "w-4 h-4 text-zinc-500 transition-transform duration-200",
                                                                    mobileOpenSection === item.label && "rotate-180"
                                                                )}
                                                            />
                                                        </button>
                                                        {mobileOpenSection === item.label && (
                                                            <div className="bg-zinc-900/50 py-2">
                                                                {item.children.map((child) => (
                                                                    <SheetClose asChild key={child.href}>
                                                                        <Link
                                                                            href={child.href}
                                                                            className="flex items-center gap-3 px-8 py-3 text-zinc-400 hover:text-[#D4AF37] hover:bg-zinc-800/50 transition-colors"
                                                                        >
                                                                            {child.icon}
                                                                            <div>
                                                                                <div className="text-sm font-medium">{child.label}</div>
                                                                                <div className="text-xs text-zinc-600">{child.sub}</div>
                                                                            </div>
                                                                        </Link>
                                                                    </SheetClose>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <SheetClose asChild>
                                                        <Link
                                                            href={item.href!}
                                                            className="flex items-center px-6 py-4 text-zinc-300 hover:text-[#D4AF37] transition-colors"
                                                        >
                                                            <span className="text-sm font-bold uppercase tracking-widest">
                                                                {item.label}
                                                            </span>
                                                            <span className="text-xs text-zinc-600 ml-2">{item.sub}</span>
                                                        </Link>
                                                    </SheetClose>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Footer */}
                                    <div className="p-6 border-t border-zinc-800">
                                        {user ? (
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={user.user_metadata.avatar_url} />
                                                        <AvatarFallback className="bg-zinc-900 text-[#D4AF37]">
                                                            {user.email?.[0].toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-sm text-zinc-400 truncate">{user.email}</span>
                                                </div>
                                                <Button
                                                    onClick={handleLogout}
                                                    variant="ghost"
                                                    className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950/20"
                                                >
                                                    <LogOut className="mr-2 h-4 w-4" />
                                                    {t('logout')}
                                                </Button>
                                            </div>
                                        ) : (
                                            <SheetClose asChild>
                                                <Button asChild className="w-full bg-[#D4AF37] text-black hover:bg-[#b08d22]">
                                                    <Link href={`/${locale}/login`}>{t('login')}</Link>
                                                </Button>
                                            </SheetClose>
                                        )}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    );
}

// Desktop Dropdown Component
function NavDropdown({
    item,
    isOpen,
    onOpenChange
}: {
    item: NavItem;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    return (
        <div
            className="relative"
            onMouseEnter={() => onOpenChange(true)}
            onMouseLeave={() => onOpenChange(false)}
        >
            <Link
                href={item.href || '#'}
                className="group flex items-center gap-1 px-3 py-2 text-zinc-400 hover:text-[#D4AF37] transition-colors"
            >
                <div className="flex flex-col items-center leading-tight">
                    <span className="text-sm font-bold uppercase tracking-widest">
                        {item.label}
                    </span>
                    <span className="text-[10px] text-zinc-600 group-hover:text-[#D4AF37]/70 transition-colors">
                        {item.sub}
                    </span>
                </div>
                <ChevronDown className={cn(
                    "w-3 h-3 transition-transform duration-200",
                    isOpen && "rotate-180"
                )} />
            </Link>

            {isOpen && (
                <div className="absolute top-full left-0 pt-2">
                    <div className="bg-black/95 backdrop-blur-md border border-zinc-800 rounded-lg shadow-xl min-w-[200px] py-2">
                        {item.children?.map((child) => (
                            <Link
                                key={child.href}
                                href={child.href}
                                className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-[#D4AF37] hover:bg-zinc-900/50 transition-colors"
                            >
                                <span className="text-[#D4AF37]/70">{child.icon}</span>
                                <div>
                                    <div className="text-sm font-medium">{child.label}</div>
                                    <div className="text-xs text-zinc-600">{child.sub}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// Simple Nav Link Component
function NavLink({ href, label, sub }: { href: string; label: string; sub: string }) {
    return (
        <Link
            href={href}
            className="group flex flex-col items-center justify-center leading-tight px-3 py-2"
        >
            <div className="relative">
                <span className="text-sm font-bold text-zinc-400 group-hover:text-[#D4AF37] transition-colors duration-300 uppercase tracking-widest relative">
                    {label}
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
                </span>
                <span className="block text-[10px] text-zinc-600 group-hover:text-[#D4AF37]/70 transition-colors font-medium mt-[2px] text-center">
                    {sub}
                </span>
            </div>
        </Link>
    );
}
