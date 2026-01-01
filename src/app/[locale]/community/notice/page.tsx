'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Eye, Bell, ArrowLeft } from 'lucide-react';
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
}

export default function NoticePage() {
    const supabase = useMemo(() => createClient(), []);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);

            const { data, error } = await supabase
                .from('community_posts')
                .select('*')
                .eq('category', 'notice')
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) {
                console.error('Error fetching posts:', error);
                setPosts([]);
            } else {
                setPosts(data || []);
            }

            setLoading(false);
        };

        fetchPosts();
    }, [supabase]);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-background pt-28 pb-8 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <Badge variant="outline" className="border-red-500 text-red-400 tracking-widest uppercase mb-4">
                        <Bell className="w-3 h-3 mr-2" />
                        Notice
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FCF6BA] mb-4">
                        공지사항
                    </h1>
                    <p className="text-zinc-400 text-lg leading-relaxed">
                        Crestia 커뮤니티의 중요한 공지사항을 확인하세요.
                    </p>
                </div>

                {/* Posts List */}
                {loading ? (
                    <div className="text-center py-20 text-zinc-500">로딩 중...</div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20">
                        <Bell className="w-16 h-16 mx-auto text-zinc-700 mb-4" />
                        <p className="text-zinc-500">아직 공지사항이 없습니다.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {posts.map((post) => (
                            <Link
                                key={post.id}
                                href={`/community/${post.id}`}
                                className="block bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 hover:border-red-500/30 hover:bg-zinc-900 transition-all"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-400">공지</span>
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
