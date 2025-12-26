'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { PenLine, Eye, Clock, Lightbulb, ArrowLeft } from 'lucide-react';
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

export default function TipsPage() {
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
                .eq('category', 'tips')
                .order('is_pinned', { ascending: false })
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) {
                console.error('Error fetching tips:', error);
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
                        <Lightbulb className="w-3 h-3 mr-2" />
                        Care Tips
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FCF6BA] mb-4">
                        사육 꿀팁
                    </h1>
                    <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl mx-auto">
                        경험 많은 사육자들이 공유하는 크레스티드 게코 사육 꿀팁입니다.<br />
                        탈피 관리, 먹이 급여 팁, 핸들링 방법 등을 확인해보세요.
                    </p>
                </div>

                {/* Write Button */}
                {user && (
                    <div className="flex justify-end mb-6">
                        <Link href="/guide/write">
                            <Button className="bg-[#D4AF37] hover:bg-[#C5A028] text-black gap-2">
                                <PenLine className="w-4 h-4" />
                                팁 공유하기
                            </Button>
                        </Link>
                    </div>
                )}

                {/* Posts List */}
                {loading ? (
                    <div className="text-center py-20 text-zinc-500">로딩 중...</div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20">
                        <Lightbulb className="w-16 h-16 mx-auto text-zinc-700 mb-4" />
                        <p className="text-zinc-500 mb-4">아직 사육 팁이 없습니다.</p>
                        {user && (
                            <Link href="/guide/write">
                                <Button variant="outline">첫 번째 팁 공유하기</Button>
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {posts.map((post) => (
                            <Link
                                key={post.id}
                                href={`/guide/${post.id}`}
                                className="group block bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-[#D4AF37]/30 hover:bg-zinc-900 transition-all"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 flex-shrink-0 bg-amber-500/20 rounded-full flex items-center justify-center">
                                        <Lightbulb className="w-6 h-6 text-amber-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                                            {post.title}
                                        </h3>
                                        <p className="text-zinc-500 text-sm line-clamp-2 mb-3">
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
