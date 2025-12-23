'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, MessageSquare } from 'lucide-react';
import type { Post } from './PostCard';

interface GalleryGridProps {
    posts: Post[];
}

export function GalleryGrid({ posts }: GalleryGridProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-2">
            {posts.map((post) => (
                <Link
                    key={post.id}
                    href={`/ko/community/gallery/${post.id}`}
                    className="group relative aspect-square bg-zinc-900 overflow-hidden"
                >
                    {post.thumbnail ? (
                        <Image
                            src={post.thumbnail}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                            <span className="text-zinc-600 text-xs">No Image</span>
                        </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-4">
                        <span className="flex items-center gap-1 text-white text-sm font-medium">
                            <Heart className="w-4 h-4" />
                            {post.likes}
                        </span>
                        <span className="flex items-center gap-1 text-white text-sm font-medium">
                            <MessageSquare className="w-4 h-4" />
                            {post.comments}
                        </span>
                    </div>
                </Link>
            ))}
        </div>
    );
}
