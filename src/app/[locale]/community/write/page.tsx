'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Send, ImagePlus, X, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function WritePostPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = useMemo(() => createClient(), []);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [category, setCategory] = useState('board');
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Set category from URL query parameter
    useEffect(() => {
        const categoryParam = searchParams.get('category');
        if (categoryParam && ['board', 'gallery', 'qna', 'notice'].includes(categoryParam)) {
            setCategory(categoryParam);
        }
    }, [searchParams]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle file upload to Supabase Storage
    const handleFileUpload = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            toast.error('이미지 파일만 업로드할 수 있습니다.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('파일 크기는 5MB 이하여야 합니다.');
            return;
        }

        setIsUploading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast.error('로그인이 필요합니다.');
                router.push('/login');
                return;
            }

            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('community-images')
                .upload(fileName, file);

            if (uploadError) {
                console.error('Upload error:', uploadError);
                toast.error('이미지 업로드에 실패했습니다.');
                return;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('community-images')
                .getPublicUrl(fileName);

            setImageUrl(publicUrl);
            toast.success('이미지가 업로드되었습니다!');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('이미지 업로드 중 오류가 발생했습니다.');
        } finally {
            setIsUploading(false);
        }
    };

    // Handle drag events
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    // Handle file input change
    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    const handleSubmit = async () => {
        if (!title.trim() || !content.trim()) {
            toast.error('제목과 내용을 입력해주세요.');
            return;
        }

        // Gallery requires an image
        if (category === 'gallery' && !imageUrl) {
            toast.error('갤러리 게시글에는 이미지가 필요합니다.');
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
            .from('community_posts')
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
            console.error('Supabase error:', error.message, error.details, error.hint);
            toast.error(`게시글 작성 실패: ${error.message || '알 수 없는 오류'}`);
            setIsSubmitting(false);
            return;
        }

        toast.success('게시글이 작성되었습니다.');
        router.push(`/community/${data.id}`);
    };

    return (
        <div className="min-h-screen bg-background pt-28 pb-8 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Link href="/community" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition">
                        <ArrowLeft className="w-4 h-4" />
                        목록으로
                    </Link>
                </div>

                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                    <h1 className="text-2xl font-bold text-white mb-6">글쓰기</h1>

                    {/* Category */}
                    <div className="mb-6">
                        <Label className="text-zinc-300 mb-2 block">카테고리</Label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger className="bg-zinc-800 border-zinc-700 w-full md:w-48">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="board">자유게시판</SelectItem>
                                <SelectItem value="gallery">갤러리</SelectItem>
                                <SelectItem value="qna">Q&A</SelectItem>
                                <SelectItem value="notice">공지사항</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Title */}
                    <div className="mb-6">
                        <Label className="text-zinc-300 mb-2 block">제목</Label>
                        <Input
                            placeholder="제목을 입력하세요"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-zinc-800 border-zinc-700"
                            maxLength={100}
                        />
                    </div>

                    {/* Content */}
                    <div className="mb-6">
                        <Label className="text-zinc-300 mb-2 block">내용</Label>
                        <Textarea
                            placeholder="내용을 입력하세요"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="bg-zinc-800 border-zinc-700 min-h-[300px]"
                        />
                    </div>

                    {/* Image Upload (for gallery) */}
                    {category === 'gallery' && (
                        <div className="mb-6">
                            <Label className="text-zinc-300 mb-2 block">
                                <ImagePlus className="w-4 h-4 inline mr-2" />
                                이미지 업로드 <span className="text-red-400">*</span>
                            </Label>

                            {/* Drag and Drop Zone */}
                            {!imageUrl && (
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
                                        ${isDragging
                                            ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                                            : 'border-zinc-700 hover:border-zinc-600 bg-zinc-800/50'
                                        }
                                        ${isUploading ? 'pointer-events-none opacity-70' : ''}
                                    `}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileInputChange}
                                        className="hidden"
                                    />

                                    {isUploading ? (
                                        <div className="py-4">
                                            <Loader2 className="w-10 h-10 text-[#D4AF37] mx-auto mb-3 animate-spin" />
                                            <p className="text-zinc-400">업로드 중...</p>
                                        </div>
                                    ) : (
                                        <div className="py-4">
                                            <Upload className="w-10 h-10 text-zinc-500 mx-auto mb-3" />
                                            <p className="text-zinc-400 mb-1">
                                                사진을 여기에 드래그하거나
                                            </p>
                                            <p className="text-[#D4AF37] font-medium">
                                                클릭하여 업로드
                                            </p>
                                            <p className="text-zinc-600 text-sm mt-3">
                                                JPG, PNG, WebP (최대 5MB)
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Image Preview */}
                            {imageUrl && (
                                <div className="relative border border-zinc-700 rounded-xl overflow-hidden bg-zinc-800">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={imageUrl}
                                        alt="Preview"
                                        className="w-full max-h-80 object-contain"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setImageUrl('')}
                                        className="absolute top-3 right-3 p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition shadow-lg"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <div className="p-3 bg-zinc-800/80 text-center">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="text-[#D4AF37] text-sm hover:underline"
                                        >
                                            다른 사진으로 변경
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

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
