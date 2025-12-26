'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { PenLine, Heart, MessageCircle, Image as ImageIcon, ArrowLeft } from 'lucide-react';
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

export default function GalleryPage() {
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
                .eq('category', 'gallery')
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

    return (
        <div className="min-h-screen bg-background pt-28 pb-8 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <Badge variant="outline" className="border-[#D4AF37] text-[#D4AF37] tracking-widest uppercase mb-4">
                        <ImageIcon className="w-3 h-3 mr-2" />
                        Geckostagram
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FCF6BA] mb-4">
                        게코스타그램
                    </h1>
                    <p className="text-zinc-400 text-lg leading-relaxed">
                        자랑하고 싶은 게코 사진을 공유하고 다른 사육자들의 게코를 구경하세요!
                    </p>
                </div>

                {/* Write Button */}
                <div className="flex justify-end mb-6">
                    <Link href="/community/write">
                        <Button className="bg-[#D4AF37] hover:bg-[#C5A028] text-black gap-2">
                            <PenLine className="w-4 h-4" />
                            사진 올리기
                        </Button>
                    </Link>
                </div>

                {/* Gallery Grid */}
                {loading ? (
                    <div className="text-center py-20 text-zinc-500">로딩 중...</div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20">
                        <ImageIcon className="w-16 h-16 mx-auto text-zinc-700 mb-4" />
                        <p className="text-zinc-500 mb-4">아직 사진이 없습니다.</p>
                        <Link href="/community/write">
                            <Button variant="outline">첫 번째 사진 올리기</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {posts.map((post) => (
                            <Link
                                key={post.id}
                                href={`/community/${post.id}`}
                                className="group relative aspect-square rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-[#D4AF37]/50 transition-all"
                            >
                                {post.image_url ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={post.image_url}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                                        <span className="text-4xl">🦎</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                    <p className="text-white text-sm font-medium line-clamp-2">{post.title}</p>
                                    <div className="flex gap-3 mt-2 text-zinc-400 text-xs">
                                        <span className="flex items-center gap-1">
                                            <Heart className="w-3 h-3" /> {post.likes_count}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MessageCircle className="w-3 h-3" /> {post.comments_count}
                                        </span>
                                    </div>
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
