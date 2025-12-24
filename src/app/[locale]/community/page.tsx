'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { PenLine, Heart, MessageCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Post {
    id: string;
    user_id: string;
    category: string;
    title: string;
    content: string;
    image_url: string | null;
    view_count: number;
    created_at: string;
    profiles?: { username: string | null };
    likes_count?: number;
    comments_count?: number;
}

const TABS = [
    { id: 'all', label: '전체' },
    { id: 'notice', label: '공지사항' },
    { id: 'gallery', label: '갤러리' },
    { id: 'board', label: '자유게시판' },
];

export default function CommunityPage() {
    const supabase = useMemo(() => createClient(), []);
    const [activeTab, setActiveTab] = useState('all');
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

            let query = supabase
                .from('community_posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (activeTab !== 'all') {
                query = query.eq('category', activeTab);
            }

            const { data, error } = await query.limit(50);

            if (error) {
                console.error('Error fetching posts:', error);
                setPosts([]);
            } else {
                // Get likes and comments count for each post
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
    }, [activeTab, supabase]);

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

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'notice': return 'bg-red-500/20 text-red-400';
            case 'gallery': return 'bg-purple-500/20 text-purple-400';
            case 'board': return 'bg-blue-500/20 text-blue-400';
            default: return 'bg-zinc-500/20 text-zinc-400';
        }
    };

    const getCategoryLabel = (category: string) => {
        switch (category) {
            case 'notice': return '공지';
            case 'gallery': return '갤러리';
            case 'board': return '자유';
            default: return category;
        }
    };

    return (
        <div className="min-h-screen bg-background pt-28 pb-8 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            <span className="text-[#D4AF37]">COMMUNITY</span>
                        </h1>
                        <p className="text-zinc-500">크레스티드 게코 사육자들을 위한 커뮤니티</p>
                    </div>
                    <Link href="/community/write">
                        <Button className="bg-[#D4AF37] hover:bg-[#C5A028] text-black gap-2">
                            <PenLine className="w-4 h-4" />
                            글쓰기
                        </Button>
                    </Link>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id
                                ? 'bg-[#D4AF37] text-black'
                                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Posts List */}
                {loading ? (
                    <div className="text-center py-20 text-zinc-500">로딩 중...</div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-zinc-500 mb-4">아직 게시글이 없습니다.</p>
                        {user && (
                            <Link href="/community/write">
                                <Button variant="outline">첫 번째 글 작성하기</Button>
                            </Link>
                        )}
                    </div>
                ) : activeTab === 'gallery' ? (
                    // Gallery Grid View
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
                ) : (
                    // List View
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
                                            <span className={`text-xs px-2 py-0.5 rounded ${getCategoryColor(post.category)}`}>
                                                {getCategoryLabel(post.category)}
                                            </span>
                                            <span className="text-zinc-500 text-xs">
                                                {post.profiles?.username || '익명'}
                                            </span>
                                            <span className="text-zinc-600 text-xs">
                                                {formatDate(post.created_at)}
                                            </span>
                                        </div>
                                        <h3 className="text-white font-medium text-lg mb-1 truncate">
                                            {post.title}
                                        </h3>
                                        <p className="text-zinc-500 text-sm line-clamp-1">
                                            {post.content}
                                        </p>
                                    </div>
                                    {post.image_url && (
                                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={post.image_url}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
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
            </div>
        </div>
    );
}
