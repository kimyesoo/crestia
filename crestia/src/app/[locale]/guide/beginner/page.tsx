import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { BookOpen } from "lucide-react";

export const metadata = {
    title: '초보 가이드 | Crestia',
    description: '크레스티드 게코를 처음 키우시는 분들을 위한 완벽한 사육 가이드입니다.',
};

export default function BeginnerGuidePage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
                <div className="text-center space-y-6 max-w-2xl mx-auto">
                    <Badge variant="outline" className="border-[#D4AF37] text-[#D4AF37] tracking-widest uppercase">
                        <BookOpen className="w-3 h-3 mr-2" />
                        Beginner Guide
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FCF6BA]">
                        초보 사육 가이드
                    </h1>
                    <p className="text-zinc-400 text-lg leading-relaxed">
                        크레스티드 게코를 처음 키우시는 분들을 위한 완벽한 가이드입니다.<br />
                        사육장 셋팅부터 먹이급여, 온습도 관리까지 모든 것을 알려드립니다.
                    </p>
                    <div className="pt-8 text-zinc-600 text-sm">
                        📝 콘텐츠 준비 중입니다...
                    </div>
                </div>
            </main>
        </div>
    );
}
