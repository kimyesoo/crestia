'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { PenLine, Eye, Clock, Pin, BookOpen, Lightbulb, Dna, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

// 고정 가이드 카드 데이터
const FEATURED_GUIDES = [
    {
        id: 'beginner',
        title: '초보 사육 가이드',
        subtitle: '입양부터 사육장 셋팅까지 4편 완결',
        description: '크레스티드 게코를 처음 키우시는 분들을 위한 완벽 가이드',
        href: '/guide/beginner',
        icon: BookOpen,
        gradient: 'from-emerald-500/20 to-emerald-500/5',
        borderColor: 'border-emerald-500/30',
        iconColor: 'text-emerald-400',
        articles: 4
    },
    {
        id: 'morphs',
        title: '모프 가이드',
        subtitle: 'Genetics of Crestia',
        description: '유전학 기반 모프 데이터베이스 - 위험도, 특징, 브리딩 조합',
        href: '/guide/morphs',
        icon: Dna,
        gradient: 'from-purple-500/20 to-purple-500/5',
        borderColor: 'border-purple-500/30',
        iconColor: 'text-purple-400',
        articles: 7
    }
];

const TABS = [
    { id: 'all', label: '전체', icon: BookOpen },
    { id: 'beginner', label: '입문 가이드', icon: BookOpen },
    { id: 'tips', label: '사육 팁', icon: Lightbulb },
];

export default function GuidePage() {
    const supabase = useMemo(() => createClient(), []);
    const [activeTab, setActiveTab] = useState('all');
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

            let query = supabase
                .from('guide_posts')
                .select('*')
                .order('is_pinned', { ascending: false })
                .order('created_at', { ascending: false });

            if (activeTab !== 'all') {
                query = query.eq('category', activeTab);
            }

            const { data, error } = await query.limit(50);

            if (error) {
                console.error('Error fetching guides:', error);
                setPosts([]);
            } else {
                setPosts(data || []);
            }

            setLoading(false);
        };

        fetchPosts();
    }, [activeTab, supabase]);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });
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
            case 'beginner': return '입문';
            case 'tips': return '팁';
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
                            <span className="text-[#D4AF37]">GUIDE</span>
                        </h1>
                        <p className="text-zinc-500">크레스티드 게코 사육 가이드 & 팁</p>
                    </div>
                    {user && (
                        <Link href="/guide/write">
                            <Button className="bg-[#D4AF37] hover:bg-[#C5A028] text-black gap-2">
                                <PenLine className="w-4 h-4" />
                                가이드 작성
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Featured Guides - 고정 가이드 카드 */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                        <h2 className="text-lg font-bold text-white">공식 가이드</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {FEATURED_GUIDES.map((guide) => {
                            const Icon = guide.icon;
                            return (
                                <Link
                                    key={guide.id}
                                    href={guide.href}
                                    className={`group block bg-gradient-to-br ${guide.gradient} border ${guide.borderColor} rounded-xl p-5 hover:scale-[1.02] transition-all duration-300`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-xl bg-zinc-900/50 ${guide.iconColor}`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-white font-bold text-lg mb-1 group-hover:text-[#D4AF37] transition-colors">
                                                {guide.title}
                                            </h3>
                                            <p className="text-zinc-500 text-sm mb-2">{guide.subtitle}</p>
                                            <p className="text-zinc-400 text-sm line-clamp-2">{guide.description}</p>
                                            <div className="flex items-center gap-2 mt-3 text-zinc-500 text-xs">
                                                <span className="bg-zinc-800 px-2 py-1 rounded">📚 {guide.articles}편</span>
                                                <span className="flex items-center gap-1 text-[#D4AF37]">
                                                    바로가기 <ChevronRight className="w-3 h-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Community Posts Section */}
                <div className="border-t border-zinc-800 pt-8">
                    <h2 className="text-lg font-bold text-white mb-4">커뮤니티 가이드</h2>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                        {TABS.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === tab.id
                                        ? 'bg-[#D4AF37] text-black'
                                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Posts List */}
                    {loading ? (
                        <div className="text-center py-12 text-zinc-500">로딩 중...</div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-12">
                            <BookOpen className="w-12 h-12 mx-auto text-zinc-700 mb-4" />
                            <p className="text-zinc-500 mb-4">아직 커뮤니티 가이드가 없습니다.</p>
                            {user && (
                                <Link href="/guide/write">
                                    <Button variant="outline">첫 번째 가이드 작성하기</Button>
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {posts.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/guide/${post.id}`}
                                    className="group block bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden hover:border-[#D4AF37]/30 hover:bg-zinc-900 transition-all"
                                >
                                    {/* Image or Placeholder */}
                                    <div className="aspect-video relative bg-zinc-800">
                                        {post.image_url ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={post.image_url}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-6xl opacity-30">🦎</span>
                                            </div>
                                        )}
                                        {post.is_pinned && (
                                            <div className="absolute top-2 right-2 bg-[#D4AF37] text-black px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                                <Pin className="w-3 h-3" /> 고정
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${getCategoryColor(post.category)}`}>
                                                {getCategoryIcon(post.category)}
                                                {getCategoryLabel(post.category)}
                                            </span>
                                        </div>
                                        <h3 className="text-white font-medium text-lg mb-2 line-clamp-2 group-hover:text-[#D4AF37] transition-colors">
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
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
