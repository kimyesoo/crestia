'use client';

import { useState, useEffect, useMemo, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Eye, Clock, BookOpen, Lightbulb, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface GuidePost {
    id: string;
    user_id: string;
    category: string;
    title: string;
    content: string;
    image_url: string | null;
    view_count: number;
    is_pinned: boolean;
    created_at: string;
    profiles?: { username: string | null };
}

export default function GuideDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const supabase = useMemo(() => createClient(), []);
    const [post, setPost] = useState<GuidePost | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUserId(user?.id || null);
        };
        fetchUser();
    }, [supabase]);

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);

            // Increment view count
            await supabase.rpc('increment_guide_view_count', { guide_id: resolvedParams.id });

            const { data, error } = await supabase
                .from('guide_posts')
                .select('*')
                .eq('id', resolvedParams.id)
                .single();

            if (error) {
                console.error('Error fetching guide:', error);
                setPost(null);
            } else {
                setPost(data);
            }

            setLoading(false);
        };

        fetchPost();
    }, [resolvedParams.id, supabase]);

    const handleDelete = async () => {
        if (!post || !confirm('정말 삭제하시겠습니까?')) return;

        const { error } = await supabase
            .from('guide_posts')
            .delete()
            .eq('id', post.id);

        if (error) {
            toast.error('삭제에 실패했습니다.');
        } else {
            toast.success('삭제되었습니다.');
            router.push('/guide');
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'beginner': return <BookOpen className="w-4 h-4" />;
            case 'tips': return <Lightbulb className="w-4 h-4" />;
            default: return <BookOpen className="w-4 h-4" />;
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'beginner': return 'bg-emerald-500/20 text-emerald-400';
            case 'tips': return 'bg-amber-500/20 text-amber-400';
            default: return 'bg-zinc-500/20 text-zinc-400';
        }
    };

    const getCategoryLabel = (category: string) => {
        switch (category) {
            case 'beginner': return '입문 가이드';
            case 'tips': return '사육 팁';
            default: return category;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background pt-28 pb-8 px-4">
                <div className="max-w-3xl mx-auto text-center text-zinc-500">로딩 중...</div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-background pt-28 pb-8 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <p className="text-zinc-500 mb-4">가이드를 찾을 수 없습니다.</p>
                    <Link href="/guide">
                        <Button variant="outline">목록으로</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-28 pb-8 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <Link href="/guide" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition">
                        <ArrowLeft className="w-4 h-4" />
                        목록으로
                    </Link>
                    {currentUserId === post.user_id && (
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="gap-1">
                                <Edit className="w-4 h-4" /> 수정
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-1 text-red-400 hover:text-red-300"
                                onClick={handleDelete}
                            >
                                <Trash2 className="w-4 h-4" /> 삭제
                            </Button>
                        </div>
                    )}
                </div>

                {/* Image */}
                {post.image_url && (
                    <div className="mb-6 rounded-xl overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={post.image_url}
                            alt={post.title}
                            className="w-full h-auto max-h-96 object-cover"
                        />
                    </div>
                )}

                {/* Article */}
                <article className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 md:p-8">
                    {/* Category & Meta */}
                    <div className="flex items-center gap-3 mb-4">
                        <span className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${getCategoryColor(post.category)}`}>
                            {getCategoryIcon(post.category)}
                            {getCategoryLabel(post.category)}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        {post.title}
                    </h1>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-zinc-500 text-sm mb-8 pb-6 border-b border-zinc-800">
                        <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" /> {formatDate(post.created_at)}
                        </span>
                        <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" /> {post.view_count} views
                        </span>
                    </div>

                    {/* Content */}
                    <div className="prose prose-invert prose-zinc max-w-none">
                        {post.content.split('\n').map((paragraph, index) => (
                            paragraph.trim() ? (
                                <p key={index} className="text-zinc-300 leading-relaxed mb-4">
                                    {paragraph}
                                </p>
                            ) : (
                                <br key={index} />
                            )
                        ))}
                    </div>
                </article>
            </div>
        </div>
    );
}
