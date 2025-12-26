'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Share2, MessageCircle, Link as LinkIcon, Twitter, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SocialActionsProps {
    // Reaction counts
    likesCount: number;
    dislikesCount: number;
    commentsCount: number;
    // User state
    userReaction: 'like' | 'dislike' | null;
    isLoggedIn: boolean;
    // Handlers
    onLike: () => void;
    onDislike: () => void;
    onScrollToComments?: () => void;
    // Share info
    shareUrl: string;
    shareTitle: string;
}

export function SocialActions({
    likesCount,
    dislikesCount,
    commentsCount,
    userReaction,
    isLoggedIn,
    onLike,
    onDislike,
    onScrollToComments,
    shareUrl,
    shareTitle,
}: SocialActionsProps) {
    const [showShareMenu, setShowShareMenu] = useState(false);

    const handleShare = async (platform: 'copy' | 'twitter' | 'facebook') => {
        const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${shareUrl}` : shareUrl;

        switch (platform) {
            case 'copy':
                try {
                    await navigator.clipboard.writeText(fullUrl);
                    toast.success('링크가 복사되었습니다!');
                } catch {
                    toast.error('링크 복사에 실패했습니다.');
                }
                break;
            case 'twitter':
                window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(fullUrl)}`,
                    '_blank'
                );
                break;
            case 'facebook':
                window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
                    '_blank'
                );
                break;
        }
        setShowShareMenu(false);
    };

    const handleReaction = (type: 'like' | 'dislike') => {
        if (!isLoggedIn) {
            toast.error('로그인이 필요합니다.');
            return;
        }
        if (type === 'like') {
            onLike();
        } else {
            onDislike();
        }
    };

    return (
        <div className="flex items-center gap-2 flex-wrap">
            {/* Like Button */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => handleReaction('like')}
                className={`gap-2 ${userReaction === 'like'
                    ? 'bg-green-500/20 text-green-400 border-green-500/50 hover:bg-green-500/30'
                    : 'hover:bg-green-500/10 hover:text-green-400 hover:border-green-500/30'
                    }`}
            >
                <ThumbsUp className={`w-4 h-4 ${userReaction === 'like' ? 'fill-current' : ''}`} />
                <span>{likesCount}</span>
            </Button>

            {/* Dislike Button */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => handleReaction('dislike')}
                className={`gap-2 ${userReaction === 'dislike'
                    ? 'bg-red-500/20 text-red-400 border-red-500/50 hover:bg-red-500/30'
                    : 'hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30'
                    }`}
            >
                <ThumbsDown className={`w-4 h-4 ${userReaction === 'dislike' ? 'fill-current' : ''}`} />
                <span>{dislikesCount}</span>
            </Button>

            {/* Comments Button */}
            {onScrollToComments && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onScrollToComments}
                    className="gap-2 hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/30"
                >
                    <MessageCircle className="w-4 h-4" />
                    <span>{commentsCount}</span>
                </Button>
            )}

            {/* Share Dropdown */}
            <DropdownMenu open={showShareMenu} onOpenChange={setShowShareMenu}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] hover:border-[#D4AF37]/30"
                    >
                        <Share2 className="w-4 h-4" />
                        공유
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => handleShare('copy')} className="gap-2 cursor-pointer">
                        <LinkIcon className="w-4 h-4" />
                        링크 복사
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare('twitter')} className="gap-2 cursor-pointer">
                        <Twitter className="w-4 h-4" />
                        트위터 공유
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare('facebook')} className="gap-2 cursor-pointer">
                        <Facebook className="w-4 h-4" />
                        페이스북 공유
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
