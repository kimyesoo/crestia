'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { CommunityTabs } from '@/components/community/CommunityTabs';
import { PostCard, Post } from '@/components/community/PostCard';
import { GalleryGrid } from '@/components/community/GalleryGrid';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { useEffect } from 'react';
import {
    Newspaper,
    BookOpen,
    Image as ImageIcon,
    MessageSquare,
    Sparkles
} from 'lucide-react';

// Mock Data
const MOCK_POSTS: Post[] = [
    // 공지사항
    {
        id: 'notice-1',
        title: '🎉 Crestia 커뮤니티 오픈 안내',
        summary: '안녕하세요! 크레스티드 게코 전문 플랫폼 Crestia 커뮤니티가 오픈했습니다. 사육자분들의 많은 참여 부탁드립니다.',
        thumbnail: '/hero-gecko.jpg',
        category: 'notice',
        author: 'Crestia',
        createdAt: new Date('2024-12-20'),
        views: 1250,
        comments: 45,
        likes: 89
    },
    {
        id: 'notice-2',
        title: '📢 야생동물 신고 도우미 기능 업데이트',
        summary: 'PDF 자동 생성 기능이 개선되었습니다. 이제 더 빠르고 정확하게 신고서를 작성하실 수 있습니다.',
        thumbnail: '/hero-gecko.jpg',
        category: 'notice',
        author: 'Crestia',
        createdAt: new Date('2024-12-18'),
        views: 890,
        comments: 23,
        likes: 56
    },
    // 가이드
    {
        id: 'guide-1',
        title: '크레스티드 게코 초보 사육 가이드 (완벽 정리)',
        summary: '처음 크레스티드 게코를 키우시는 분들을 위한 완벽 가이드입니다. 사육장 셋팅부터 먹이급여, 온습도 관리까지 모든 것을 알려드립니다.',
        thumbnail: '/hero-gecko.jpg',
        category: 'guide',
        author: '게코마스터',
        createdAt: new Date('2024-12-15'),
        views: 3420,
        comments: 156,
        likes: 423
    },
    {
        id: 'guide-2',
        title: '게코 탈피 불량 해결 방법 총정리',
        summary: '탈피 불량은 습도 관리가 핵심입니다. 올바른 습도 유지법과 탈피 불량 시 대처법을 알아봅시다.',
        thumbnail: '/hero-gecko.jpg',
        category: 'guide',
        author: '수의사토리',
        createdAt: new Date('2024-12-10'),
        views: 2100,
        comments: 89,
        likes: 312
    },
    // 게코스타그램
    {
        id: 'gallery-1',
        title: '우리집 막내 릴리화이트 ❤️',
        summary: '오늘 새로 맞이한 릴리화이트 베이비입니다!',
        thumbnail: '/hero-gecko.jpg',
        category: 'gallery',
        author: '게코러버',
        createdAt: new Date('2024-12-22'),
        views: 560,
        comments: 34,
        likes: 178
    },
    {
        id: 'gallery-2',
        title: '할로윈 크레스티드 자랑해요',
        summary: '3년째 키우고 있는 할크입니다',
        thumbnail: '/hero-gecko.jpg',
        category: 'gallery',
        author: '할크아빠',
        createdAt: new Date('2024-12-21'),
        views: 440,
        comments: 28,
        likes: 145
    },
    {
        id: 'gallery-3',
        title: '사육장 리모델링 완료!',
        summary: '바이오액티브 테라리움으로 꾸며봤어요',
        thumbnail: '/hero-gecko.jpg',
        category: 'gallery',
        author: '테라프로',
        createdAt: new Date('2024-12-20'),
        views: 890,
        comments: 67,
        likes: 234
    },
    {
        id: 'gallery-4',
        title: '먹방 타임 🍽️',
        summary: '오늘도 밀웜 먹는 우리 아기',
        thumbnail: '/hero-gecko.jpg',
        category: 'gallery',
        author: '먹방게코',
        createdAt: new Date('2024-12-19'),
        views: 320,
        comments: 19,
        likes: 98
    },
    {
        id: 'gallery-5',
        title: '첫 핸들링 성공!',
        summary: '드디어 손 위에 올라왔어요',
        thumbnail: '/hero-gecko.jpg',
        category: 'gallery',
        author: '뉴비사육사',
        createdAt: new Date('2024-12-18'),
        views: 510,
        comments: 42,
        likes: 156
    },
    {
        id: 'gallery-6',
        title: '화이트아웃 베이비 탄생 🎊',
        summary: '드디어 첫 해칭!',
        thumbnail: '/hero-gecko.jpg',
        category: 'gallery',
        author: '브리더킴',
        createdAt: new Date('2024-12-17'),
        views: 1200,
        comments: 89,
        likes: 345
    },
    // 자유게시판
    {
        id: 'board-1',
        title: '게코 온도 관리 어떻게 하세요?',
        summary: '겨울철 온도 관리가 어렵네요. 다들 어떤 방법으로 관리하시는지 궁금합니다.',
        category: 'board',
        author: '초보사육사',
        createdAt: new Date('2024-12-22'),
        views: 230,
        comments: 45,
        likes: 12
    },
    {
        id: 'board-2',
        title: '먹이 추천 부탁드려요',
        summary: '파충류 전용 사료 중에 어떤 게 좋을까요? 현재 판게아를 먹이고 있는데 다른 것도 시도해보고 싶어요.',
        category: 'board',
        author: '게코초보',
        createdAt: new Date('2024-12-21'),
        views: 180,
        comments: 32,
        likes: 8
    },
    {
        id: 'board-3',
        title: '오프라인 모임 있나요?',
        summary: '서울 근교에서 게코 사육자들 오프라인 모임이 있다면 참여하고 싶습니다!',
        category: 'board',
        author: '게코친구',
        createdAt: new Date('2024-12-20'),
        views: 340,
        comments: 56,
        likes: 34
    },
];

const TABS = [
    { id: 'all', label: '전체', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'notice', label: '공지', icon: <Newspaper className="w-4 h-4" /> },
    { id: 'guide', label: '가이드', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'gallery', label: '게코스타그램', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'board', label: '자유글', icon: <MessageSquare className="w-4 h-4" /> },
];

export default function CommunityPage() {
    const [activeTab, setActiveTab] = useState('all');
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user);
        });
    }, []);

    const filteredPosts = activeTab === 'all'
        ? MOCK_POSTS
        : MOCK_POSTS.filter(post => post.category === activeTab);

    const galleryPosts = filteredPosts.filter(post => post.category === 'gallery');
    const nonGalleryPosts = filteredPosts.filter(post => post.category !== 'gallery');

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar user={user} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FCF6BA] mb-3">
                        Community
                    </h1>
                    <p className="text-zinc-500 text-sm md:text-base">
                        크레스티드 게코 사육자들을 위한 커뮤니티 공간입니다
                    </p>
                </div>

                {/* Tabs */}
                <div className="mb-8">
                    <CommunityTabs
                        tabs={TABS}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />
                </div>

                {/* Content */}
                {activeTab === 'gallery' ? (
                    // Gallery Grid View
                    <GalleryGrid posts={galleryPosts} />
                ) : activeTab === 'all' ? (
                    // Mixed View: Gallery Grid + Post List
                    <div className="space-y-10">
                        {/* Gallery Section */}
                        {galleryPosts.length > 0 && (
                            <section>
                                <h2 className="flex items-center gap-2 text-lg font-bold text-white mb-4">
                                    <ImageIcon className="w-5 h-5 text-[#D4AF37]" />
                                    게코스타그램
                                </h2>
                                <GalleryGrid posts={galleryPosts.slice(0, 4)} />
                            </section>
                        )}

                        {/* Posts Section */}
                        {nonGalleryPosts.length > 0 && (
                            <section>
                                <h2 className="flex items-center gap-2 text-lg font-bold text-white mb-4">
                                    <Newspaper className="w-5 h-5 text-[#D4AF37]" />
                                    최신 글
                                </h2>
                                <div className="space-y-3">
                                    {nonGalleryPosts.map((post) => (
                                        <PostCard key={post.id} post={post} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                ) : (
                    // Filtered Post List View
                    <div className="space-y-3">
                        {filteredPosts.length > 0 ? (
                            filteredPosts.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))
                        ) : (
                            <div className="text-center py-20 text-zinc-500">
                                아직 등록된 글이 없습니다.
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
