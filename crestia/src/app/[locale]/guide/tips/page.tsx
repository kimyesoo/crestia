import { Badge } from "@/components/ui/badge";
import { Lightbulb } from "lucide-react";

export const metadata = {
    title: '사육 꿀팁 | Crestia',
    description: '크레스티드 게코 사육에 도움이 되는 꿀팁 모음입니다.',
};

export default function TipsPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
                <div className="text-center space-y-6 max-w-2xl mx-auto">
                    <Badge variant="outline" className="border-[#D4AF37] text-[#D4AF37] tracking-widest uppercase">
                        <Lightbulb className="w-3 h-3 mr-2" />
                        Care Tips
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FCF6BA]">
                        사육 꿀팁
                    </h1>
                    <p className="text-zinc-400 text-lg leading-relaxed">
                        경험 많은 사육자들이 공유하는 크레스티드 게코 사육 꿀팁입니다.<br />
                        탈피 관리, 먹이 급여 팁, 핸들링 방법 등을 확인해보세요.
                    </p>
                    <div className="pt-8 text-zinc-600 text-sm">
                        📝 콘텐츠 준비 중입니다...
                    </div>
                </div>
            </main>
        </div>
    );
}
