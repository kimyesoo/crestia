import { Badge } from "@/components/ui/badge";

export default function ShowcasePage() {
    return (
        <div className="min-h-screen bg-black text-white font-sans pt-48 pb-20 px-4 md:px-8 flex flex-col items-center justify-center">
            <div className="text-center space-y-6 max-w-lg">
                <Badge variant="outline" className="border-gold-500 text-gold-500 tracking-widest uppercase mb-4">Coming Soon</Badge>
                <h1 className="text-4xl md:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FCF6BA]">
                    Showcase
                </h1>
                <p className="text-zinc-400 text-lg leading-relaxed">
                    A premium gallery to display your finest gecko lineage.<br />
                    This feature is currently under development.
                </p>
            </div>
        </div>
    );
}
