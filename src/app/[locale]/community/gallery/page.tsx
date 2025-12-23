import { Badge } from "@/components/ui/badge";
import { Image as ImageIcon } from "lucide-react";

export const metadata = {
    title: '게코스타그램 | Crestia',
    description: '사육자들이 공유하는 크레스티드 게코 사진 갤러리입니다.',
};

export default function GalleryPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
                <div className="text-center space-y-6 max-w-2xl mx-auto">
                    <Badge variant="outline" className="border-[#D4AF37] text-[#D4AF37] tracking-widest uppercase">
                        <ImageIcon className="w-3 h-3 mr-2" />
                        Geckostagram
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FCF6BA]">
                        게코스타그램
                    </h1>
                    <p className="text-zinc-400 text-lg leading-relaxed">
                        자랑하고 싶은 게코 사진을 공유하고 다른 사육자들의 게코를 구경하세요!
                    </p>
                    <div className="pt-8 text-zinc-600 text-sm">
                        📝 콘텐츠 준비 중입니다...
                    </div>
                </div>
            </main>
        </div>
    );
}
