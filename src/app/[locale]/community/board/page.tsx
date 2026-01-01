'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { PenLine, Heart, MessageCircle, Eye, MessageSquare, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Post {
    id: string;
    user_id: string;
    category: string;
    title: string;
    content: string;
    image_url: string | null;
    view_count: number;
    created_at: string;
    likes_count?: number;
    comments_count?: number;
}

export default function BoardPage() {
    const supabase = useMemo(() => createClient(), []);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user?.id || null);
        };
        fetchUser();
    }, [supabase]);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);

            const { data, error } = await supabase
                .from('community_posts')
                .select('*')
                .eq('category', 'board')
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) {
                console.error('Error fetching posts:', error);
                setPosts([]);
            } else {
                const postsWithCounts = await Promise.all(
                    (data || []).map(async (post) => {
                        const { count: likesCount } = await supabase
                            .from('community_likes')
                            .select('*', { count: 'exact', head: true })
                            .eq('post_id', post.id);

                        const { count: commentsCount } = await supabase
                            .from('community_comments')
                            .select('*', { count: 'exact', head: true })
                            .eq('post_id', post.id);

                        return {
                            ...post,
                            likes_count: likesCount || 0,
                            comments_count: commentsCount || 0,
                        };
                    })
                );
                setPosts(postsWithCounts);
            }

            setLoading(false);
        };

        fetchPosts();
    }, [supabase]);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));

        if (hours < 1) return '방금 전';
        if (hours < 24) return `${hours}시간 전`;
        if (hours < 48) return '어제';
        return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-background pt-28 pb-8 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <Badge variant="outline" className="border-[#D4AF37] text-[#D4AF37] tracking-widest uppercase mb-4">
                        <MessageSquare className="w-3 h-3 mr-2" />
                        Free Board
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FCF6BA] mb-4">
                        자유게시판
                    </h1>
                    <p className="text-zinc-400 text-lg leading-relaxed">
                        질문, 사육 일지, 자유로운 이야기를 나눠보세요.
                    </p>
                </div>

                {/* Write Button */}
                <div className="flex justify-end mb-6">
                    <Link href="/community/write">
                        <Button className="bg-[#D4AF37] hover:bg-[#C5A028] text-black gap-2">
                            <PenLine className="w-4 h-4" />
                            글쓰기
                        </Button>
                    </Link>
                </div>

                {/* Posts List */}
                {loading ? (
                    <div className="text-center py-20 text-zinc-500">로딩 중...</div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20">
                        <MessageSquare className="w-16 h-16 mx-auto text-zinc-700 mb-4" />
                        <p className="text-zinc-500 mb-4">아직 게시글이 없습니다.</p>
                        <Link href="/community/write">
                            <Button variant="outline">첫 번째 글 작성하기</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {posts.map((post) => (
                            <Link
                                key={post.id}
                                href={`/community/${post.id}`}
                                className="block bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 hover:border-[#D4AF37]/30 hover:bg-zinc-900 transition-all"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">자유</span>
                                            <span className="text-zinc-600 text-xs">{formatDate(post.created_at)}</span>
                                        </div>
                                        <h3 className="text-white font-medium text-lg mb-1 truncate">{post.title}</h3>
                                        <p className="text-zinc-500 text-sm line-clamp-1">{post.content}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 mt-3 text-zinc-500 text-sm">
                                    <span className="flex items-center gap-1">
                                        <Eye className="w-4 h-4" /> {post.view_count}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Heart className="w-4 h-4" /> {post.likes_count}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MessageCircle className="w-4 h-4" /> {post.comments_count}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Back Link */}
                <div className="mt-12 text-center">
                    <Link href="/community" className="text-zinc-500 hover:text-white transition inline-flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        커뮤니티 메인
                    </Link>
                </div>
            </div>
        </div>
    );
}
