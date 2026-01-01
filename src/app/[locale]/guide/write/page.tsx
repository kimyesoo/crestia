'use client';

import { useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Send, ImagePlus, X, BookOpen, Lightbulb, Upload, Loader2, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function WriteGuidePage() {
    const router = useRouter();
    const supabase = useMemo(() => createClient(), []);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [category, setCategory] = useState('beginner');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');

    // 이미지 업로드 핸들러
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 파일 사이즈 체크 (5MB 제한)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('이미지 크기는 5MB 이하여야 합니다.');
            return;
        }

        // 파일 타입 체크
        if (!file.type.startsWith('image/')) {
            toast.error('이미지 파일만 업로드 가능합니다.');
            return;
        }

        setIsUploading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast.error('로그인이 필요합니다.');
                setIsUploading(false);
                return;
            }

            // 고유 파일명 생성
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/${Date.now()}.${fileExt}`;

            // Supabase Storage에 업로드
            const { data, error } = await supabase.storage
                .from('guide-images')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) {
                console.error('Upload error:', error);
                toast.error('이미지 업로드에 실패했습니다.');
                setIsUploading(false);
                return;
            }

            // 공개 URL 가져오기
            const { data: urlData } = supabase.storage
                .from('guide-images')
                .getPublicUrl(data.path);

            setImageUrl(urlData.publicUrl);
            toast.success('이미지가 업로드되었습니다!');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('이미지 업로드 중 오류가 발생했습니다.');
        }

        setIsUploading(false);
    };

    const handleSubmit = async () => {
        if (!title.trim() || !content.trim()) {
            toast.error('제목과 내용을 입력해주세요.');
            return;
        }

        setIsSubmitting(true);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            toast.error('로그인이 필요합니다.');
            setIsSubmitting(false);
            router.push('/login');
            return;
        }

        const { data, error } = await supabase
            .from('guide_posts')
            .insert({
                user_id: user.id,
                category,
                title: title.trim(),
                content: content.trim(),
                image_url: imageUrl.trim() || null,
            })
            .select('id')
            .single();

        if (error) {
            console.error(error);
            toast.error('가이드 작성에 실패했습니다.');
            setIsSubmitting(false);
            return;
        }

        toast.success('가이드가 작성되었습니다.');
        router.push(`/guide/${data.id}`);
    };

    return (
        <div className="min-h-screen bg-background pt-28 pb-8 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Link href="/guide" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition">
                        <ArrowLeft className="w-4 h-4" />
                        목록으로
                    </Link>
                </div>

                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                    <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-[#D4AF37]" />
                        가이드 작성
                    </h1>

                    {/* Category */}
                    <div className="mb-6">
                        <Label className="text-zinc-300 mb-2 block">카테고리</Label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger className="bg-zinc-800 border-zinc-700 w-full md:w-48">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="beginner">
                                    <span className="flex items-center gap-2">
                                        <BookOpen className="w-4 h-4" /> 입문 가이드
                                    </span>
                                </SelectItem>
                                <SelectItem value="tips">
                                    <span className="flex items-center gap-2">
                                        <Lightbulb className="w-4 h-4" /> 사육 팁
                                    </span>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Title */}
                    <div className="mb-6">
                        <Label className="text-zinc-300 mb-2 block">제목</Label>
                        <Input
                            placeholder="가이드 제목을 입력하세요"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-zinc-800 border-zinc-700"
                            maxLength={100}
                        />
                    </div>

                    {/* Image Section */}
                    <div className="mb-6">
                        <Label className="text-zinc-300 mb-2 block">
                            <ImagePlus className="w-4 h-4 inline mr-2" />
                            대표 이미지 (선택)
                        </Label>

                        {/* 이미지 모드 탭 */}
                        <div className="flex gap-2 mb-3">
                            <button
                                type="button"
                                onClick={() => setImageMode('upload')}
                                className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 transition ${imageMode === 'upload'
                                        ? 'bg-[#D4AF37] text-black'
                                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                                    }`}
                            >
                                <Upload className="w-4 h-4" />
                                파일 업로드
                            </button>
                            <button
                                type="button"
                                onClick={() => setImageMode('url')}
                                className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 transition ${imageMode === 'url'
                                        ? 'bg-[#D4AF37] text-black'
                                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                                    }`}
                            >
                                <LinkIcon className="w-4 h-4" />
                                URL 입력
                            </button>
                        </div>

                        {imageMode === 'upload' ? (
                            <div className="space-y-3">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading}
                                    className="w-full h-24 border-dashed border-2 border-zinc-700 hover:border-[#D4AF37] hover:bg-zinc-800/50"
                                >
                                    {isUploading ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            업로드 중...
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-zinc-400">
                                            <Upload className="w-6 h-6" />
                                            <span>클릭하여 이미지 선택</span>
                                            <span className="text-xs">최대 5MB • JPG, PNG, GIF</span>
                                        </div>
                                    )}
                                </Button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <Input
                                    placeholder="https://example.com/image.jpg"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    className="bg-zinc-800 border-zinc-700"
                                />
                                {imageUrl && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setImageUrl('')}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        )}

                        {/* Image Preview */}
                        {imageUrl && (
                            <div className="mt-4 relative">
                                <div className="border border-zinc-700 rounded-lg overflow-hidden">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={imageUrl}
                                        alt="Preview"
                                        className="max-w-full h-auto max-h-64 object-contain mx-auto"
                                        onError={() => toast.error('이미지를 불러올 수 없습니다.')}
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => setImageUrl('')}
                                    className="absolute top-2 right-2"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="mb-6">
                        <Label className="text-zinc-300 mb-2 block">내용</Label>
                        <Textarea
                            placeholder="가이드 내용을 작성하세요. 마크다운 형식을 지원합니다."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="bg-zinc-800 border-zinc-700 min-h-[400px] font-mono"
                        />
                        <p className="text-xs text-zinc-500 mt-2">
                            💡 Tip: 줄바꿈은 Enter 두 번, 제목은 # 또는 ## 을 사용하세요.
                        </p>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end gap-4">
                        <Button variant="outline" onClick={() => router.back()}>
                            취소
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting || isUploading}
                            className="bg-[#D4AF37] hover:bg-[#C5A028] text-black gap-2"
                        >
                            <Send className="w-4 h-4" />
                            {isSubmitting ? '작성 중...' : '작성하기'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
