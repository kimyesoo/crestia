import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-black border-t border-zinc-900 pt-20 pb-10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="md:col-span-1 space-y-6">
                        <Link href="/" className="block">
                            <h2 className="text-2xl font-serif font-bold text-gold-500 tracking-wider">CRESTIA</h2>
                        </Link>
                        <p className="text-zinc-500 text-sm leading-relaxed">
                            The premier destination for luxury crested geckos.
                            Combining elite pedigree management with an exclusive
                            auction marketplace.
                        </p>
                        <div className="flex gap-4">
                            <SocialIcon icon={<Instagram size={18} />} href="#" />
                            <SocialIcon icon={<Twitter size={18} />} href="#" />
                            <SocialIcon icon={<Facebook size={18} />} href="#" />
                        </div>
                    </div>

                    {/* Links Column 1 */}
                    <div>
                        <h3 className="text-white font-serif font-bold mb-6">Explore</h3>
                        <ul className="space-y-4 text-sm text-zinc-500">
                            <li><FooterLink href="/auction">Live Auctions</FooterLink></li>
                            <li><FooterLink href="/market">Marketplace</FooterLink></li>
                            <li><FooterLink href="/lineage">Lineage Search</FooterLink></li>
                            <li><FooterLink href="/dashboard">My Dashboard</FooterLink></li>
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div>
                        <h3 className="text-white font-serif font-bold mb-6">Support</h3>
                        <ul className="space-y-4 text-sm text-zinc-500">
                            <li><FooterLink href="#">Help Center</FooterLink></li>
                            <li><FooterLink href="#">Terms of Service</FooterLink></li>
                            <li><FooterLink href="#">Privacy Policy</FooterLink></li>
                            <li><FooterLink href="#">Contact Us</FooterLink></li>
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h3 className="text-white font-serif font-bold mb-6">Contact</h3>
                        <ul className="space-y-4 text-sm text-zinc-500">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-gold-500/50 shrink-0" />
                                <span>123 Gangnam-daero, Seoul, South Korea</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-gold-500/50 shrink-0" />
                                <span>+82 10-1234-5678</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-gold-500/50 shrink-0" />
                                <span>support@crestia.kr</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-600">
                    <p>&copy; {new Date().getFullYear()} Crestia. All rights reserved.</p>
                    <p>Designed for the Elite.</p>
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode, href: string }) {
    return (
        <a
            href={href}
            className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-gold-500 hover:border-gold-500/50 transition-all duration-300"
        >
            {icon}
        </a>
    );
}

function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
    return (
        <Link href={href} className="hover:text-gold-400 transition-colors block w-fit">
            {children}
        </Link>
    );
}
