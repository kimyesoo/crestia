'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Eye, MessageSquare, Heart } from 'lucide-react';

export interface Post {
    id: string;
    title: string;
    summary: string;
    thumbnail?: string;
    category: 'notice' | 'guide' | 'gallery' | 'board';
    author: string;
    authorAvatar?: string;
    createdAt: Date;
    views: number;
    comments: number;
    likes: number;
}

interface PostCardProps {
    post: Post;
}

export function PostCard({ post }: PostCardProps) {
    return (
        <Link
            href={`/ko/community/${post.category}/${post.id}`}
            className="group block bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden hover:border-[#D4AF37]/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.1)]"
        >
            <div className="flex gap-4 p-4">
                {/* Thumbnail */}
                {post.thumbnail && (
                    <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-800">
                        <Image
                            src={post.thumbnail}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Category Badge */}
                    <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mb-2 ${post.category === 'notice'
                            ? 'bg-red-500/20 text-red-400'
                            : post.category === 'guide'
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-zinc-700 text-zinc-400'
                        }`}>
                        {post.category === 'notice' ? '공지' :
                            post.category === 'guide' ? '가이드' :
                                post.category === 'gallery' ? '갤러리' : '자유'}
                    </span>

                    {/* Title */}
                    <h3 className="text-white font-bold text-base mb-1 line-clamp-1 group-hover:text-[#D4AF37] transition-colors">
                        {post.title}
                    </h3>

                    {/* Summary */}
                    <p className="text-zinc-500 text-sm line-clamp-2 mb-3">
                        {post.summary}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-zinc-600">
                        <div className="flex items-center gap-2">
                            <span>{post.author}</span>
                            <span>·</span>
                            <span>{formatDistanceToNow(post.createdAt, { addSuffix: true, locale: ko })}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {post.views}
                            </span>
                            <span className="flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" />
                                {post.comments}
                            </span>
                            <span className="flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                                {post.likes}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
