import { getLocale } from 'next-intl/server';
import { requireBreederRole } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, PenLine, Image as ImageIcon, DollarSign, FileText } from 'lucide-react';

export const metadata = {
    title: '분양 글쓰기',
    description: '크레스티드 게코 분양 글을 작성합니다.',
};

export default async function MarketNewPage() {
    const locale = await getLocale();

    // 권한 체크 - breeder/admin이 아니면 /verify로 리다이렉트
    await requireBreederRole(locale);

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href={`/${locale}/market/auction`}
                        className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#D4AF37] transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>분양 목록으로</span>
                    </Link>
                    <h1 className="text-3xl font-bold text-[#D4AF37] font-serif">
                        🖊️ 분양 글쓰기
                    </h1>
                    <p className="text-zinc-400 mt-2">
                        크레스티드 게코 분양 정보를 입력해주세요.
                    </p>
                </div>

                {/* Form */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-6">
                    {/* Title */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2">
                            <FileText className="w-4 h-4 text-[#D4AF37]" />
                            제목
                        </label>
                        <input
                            type="text"
                            placeholder="예: 하이포 할리퀸 수컷 분양합니다"
                            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition-all"
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2">
                            <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                            가격 (원)
                        </label>
                        <input
                            type="number"
                            placeholder="250000"
                            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition-all"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2">
                            <PenLine className="w-4 h-4 text-[#D4AF37]" />
                            상세 설명
                        </label>
                        <textarea
                            rows={6}
                            placeholder="모프, 성별, 나이, 특이사항 등을 자세히 적어주세요..."
                            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition-all resize-none"
                        />
                    </div>

                    {/* Images */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2">
                            <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
                            사진 업로드
                        </label>
                        <div className="border-2 border-dashed border-zinc-700 rounded-lg p-8 text-center hover:border-[#D4AF37]/50 transition-colors cursor-pointer">
                            <ImageIcon className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                            <p className="text-zinc-400">클릭하여 사진을 업로드하세요</p>
                            <p className="text-xs text-zinc-600 mt-1">최대 5장까지 업로드 가능</p>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <label className="text-sm font-medium text-zinc-300 mb-2 block">
                            연락처 (선택)
                        </label>
                        <input
                            type="text"
                            placeholder="카카오톡 ID 또는 연락처"
                            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition-all"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <Button
                            className="w-full bg-[#D4AF37] text-black hover:bg-[#b08d22] font-bold py-6 text-lg"
                        >
                            분양 글 등록하기
                        </Button>
                        <p className="text-xs text-zinc-500 text-center mt-3">
                            등록된 글은 관리자 검토 후 게시됩니다.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
