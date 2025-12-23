import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";

export const metadata = {
    title: '자유게시판 | Crestia',
    description: '크레스티드 게코 사육자들의 자유로운 이야기 공간입니다.',
};

export default function BoardPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
                <div className="text-center space-y-6 max-w-2xl mx-auto">
                    <Badge variant="outline" className="border-[#D4AF37] text-[#D4AF37] tracking-widest uppercase">
                        <MessageSquare className="w-3 h-3 mr-2" />
                        Free Board
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FCF6BA]">
                        자유게시판
                    </h1>
                    <p className="text-zinc-400 text-lg leading-relaxed">
                        질문, 사육 일지, 자유로운 이야기를 나눠보세요.<br />
                        새로운 사육자도 환영합니다!
                    </p>
                    <div className="pt-8 text-zinc-600 text-sm">
                        📝 콘텐츠 준비 중입니다...
                    </div>
                </div>
            </main>
        </div>
    );
}
