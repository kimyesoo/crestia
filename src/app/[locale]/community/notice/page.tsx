import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";

export const metadata = {
    title: '공지사항 | Crestia',
    description: 'Crestia 커뮤니티 공지사항입니다.',
};

export default function NoticePage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
                <div className="text-center space-y-6 max-w-2xl mx-auto">
                    <Badge variant="outline" className="border-red-500 text-red-400 tracking-widest uppercase">
                        <Bell className="w-3 h-3 mr-2" />
                        Notice
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FCF6BA]">
                        공지사항
                    </h1>
                    <p className="text-zinc-400 text-lg leading-relaxed">
                        Crestia 커뮤니티의 중요한 공지사항을 확인하세요.
                    </p>
                    <div className="pt-8 text-zinc-600 text-sm">
                        📝 콘텐츠 준비 중입니다...
                    </div>
                </div>
            </main>
        </div>
    );
}
