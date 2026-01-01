'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Save, ImagePlus, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function EditPostPage() {
    const params = useParams();
    const router = useRouter();
    const supabase = useMemo(() => createClient(), []);
    const postId = params.id as string;

    const [category, setCategory] = useState('board');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    // Fetch existing post data
    useEffect(() => {
        const fetchPost = async () => {
            // Get current user first
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast.error('로그인이 필요합니다.');
                router.push('/login');
                return;
            }
            setCurrentUserId(user.id);

            // Fetch post
            const { data: post, error } = await supabase
                .from('community_posts')
                .select('*')
                .eq('id', postId)
                .single();

            if (error || !post) {
                toast.error('게시글을 찾을 수 없습니다.');
                router.push('/community');
                return;
            }

            // Check if the post belongs to the current user
            if (post.user_id !== user.id) {
                toast.error('수정 권한이 없습니다.');
                router.push(`/community/${postId}`);
                return;
            }

            // Set form data
            setCategory(post.category || 'board');
            setTitle(post.title || '');
            setContent(post.content || '');
            setImageUrl(post.image_url || '');
            setIsLoading(false);
        };

        fetchPost();
    }, [postId, supabase, router]);

    const handleSubmit = async () => {
        if (!title.trim() || !content.trim()) {
            toast.error('제목과 내용을 입력해주세요.');
            return;
        }

        setIsSubmitting(true);

        const { error } = await supabase
            .from('community_posts')
            .update({
                category,
                title: title.trim(),
                content: content.trim(),
                image_url: imageUrl.trim() || null,
            })
            .eq('id', postId)
            .eq('user_id', currentUserId); // Extra safety check

        if (error) {
            console.error(error);
            toast.error('게시글 수정에 실패했습니다.');
            setIsSubmitting(false);
            return;
        }

        toast.success('게시글이 수정되었습니다.');
        router.push(`/community/${postId}`);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-28 pb-8 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Link href={`/community/${postId}`} className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition">
                        <ArrowLeft className="w-4 h-4" />
                        돌아가기
                    </Link>
                </div>

                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                    <h1 className="text-2xl font-bold text-white mb-6">게시글 수정</h1>

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

                    {/* Image URL (for gallery) */}
                    {category === 'gallery' && (
                        <div className="mb-6">
                            <Label className="text-zinc-300 mb-2 block">
                                <ImagePlus className="w-4 h-4 inline mr-2" />
                                이미지 URL (선택)
                            </Label>
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
                            {imageUrl && (
                                <div className="mt-4 border border-zinc-700 rounded-lg overflow-hidden">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={imageUrl}
                                        alt="Preview"
                                        className="max-w-full h-auto max-h-64 object-contain mx-auto"
                                        onError={() => toast.error('이미지를 불러올 수 없습니다.')}
                                    />
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
                            disabled={isSubmitting}
                            className="bg-[#D4AF37] hover:bg-[#C5A028] text-black gap-2"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            {isSubmitting ? '저장 중...' : '저장하기'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
