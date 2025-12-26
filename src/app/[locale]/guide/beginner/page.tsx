'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { PenLine, Eye, Clock, BookOpen, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
}

export default function BeginnerGuidePage() {
    const supabase = useMemo(() => createClient(), []);
    const [posts, setPosts] = useState<GuidePost[]>([]);
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
                .from('guide_posts')
                .select('*')
                .eq('category', 'beginner')
                .order('is_pinned', { ascending: false })
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) {
                console.error('Error fetching guides:', error);
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
                <div className="text-center mb-12">
                    <Badge variant="outline" className="border-[#D4AF37] text-[#D4AF37] tracking-widest uppercase mb-4">
                        <BookOpen className="w-3 h-3 mr-2" />
                        Beginner Guide
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FCF6BA] mb-4">
                        초보 사육 가이드
                    </h1>
                    <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl mx-auto">
                        크레스티드 게코를 처음 키우시는 분들을 위한 완벽한 가이드입니다.<br />
                        사육장 셋팅부터 먹이급여, 온습도 관리까지 모든 것을 알려드립니다.
                    </p>
                </div>

                {/* Write Button */}
                {user && (
                    <div className="flex justify-end mb-6">
                        <Link href="/guide/write">
                            <Button className="bg-[#D4AF37] hover:bg-[#C5A028] text-black gap-2">
                                <PenLine className="w-4 h-4" />
                                가이드 작성
                            </Button>
                        </Link>
                    </div>
                )}

                {/* Posts List */}
                {loading ? (
                    <div className="text-center py-20 text-zinc-500">로딩 중...</div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20">
                        <BookOpen className="w-16 h-16 mx-auto text-zinc-700 mb-4" />
                        <p className="text-zinc-500 mb-4">아직 입문 가이드가 없습니다.</p>
                        {user && (
                            <Link href="/guide/write">
                                <Button variant="outline">첫 번째 가이드 작성하기</Button>
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {posts.map((post) => (
                            <Link
                                key={post.id}
                                href={`/guide/${post.id}`}
                                className="group block bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden hover:border-[#D4AF37]/30 hover:bg-zinc-900 transition-all"
                            >
                                <div className="flex items-stretch">
                                    {/* Image */}
                                    {post.image_url && (
                                        <div className="w-48 flex-shrink-0 hidden md:block">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={post.image_url}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="p-6 flex-1">
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors">
                                            {post.title}
                                        </h3>
                                        <p className="text-zinc-500 text-sm line-clamp-2 mb-4">
                                            {post.content}
                                        </p>
                                        <div className="flex items-center gap-4 text-zinc-600 text-xs">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {formatDate(post.created_at)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Eye className="w-3 h-3" /> {post.view_count}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Back Link */}
                <div className="mt-12 text-center">
                    <Link href="/guide" className="text-zinc-500 hover:text-white transition inline-flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        전체 가이드 보기
                    </Link>
                </div>
            </div>
        </div>
    );
}
