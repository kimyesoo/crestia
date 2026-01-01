'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Eye, Trash2, Send, User, PenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { SocialActions } from '@/components/SocialActions';
import { EmojiButton } from '@/components/EmojiButton';
import ReactMarkdown from 'react-markdown';

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
}

interface Comment {
    id: string;
    user_id: string;
    content: string;
    created_at: string;
    profiles?: { username: string | null };
}

export default function PostDetailPage() {
    const params = useParams();
    const router = useRouter();
    const supabase = useMemo(() => createClient(), []);
    const commentsRef = useRef<HTMLDivElement>(null);

    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [likesCount, setLikesCount] = useState(0);
    const [dislikesCount, setDislikesCount] = useState(0);
    const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null);
    const [newComment, setNewComment] = useState('');
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    const postId = params.id as string;

    useEffect(() => {
        const fetchData = async () => {
            // Get current user
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUser(user?.id || null);

            // Fetch post
            const { data: postData, error: postError } = await supabase
                .from('community_posts')
                .select('*')
                .eq('id', postId)
                .single();

            if (postError || !postData) {
                toast.error('게시글을 찾을 수 없습니다.');
                router.push('/community');
                return;
            }

            setPost(postData);

            // Increment view count
            await supabase
                .from('community_posts')
                .update({ view_count: (postData.view_count || 0) + 1 })
                .eq('id', postId);

            // Fetch comments
            const { data: commentsData } = await supabase
                .from('community_comments')
                .select('*')
                .eq('post_id', postId)
                .order('created_at', { ascending: true });

            setComments(commentsData || []);

            // Fetch reactions - try new table first, fallback to old likes table
            const { data: reactionsData } = await supabase
                .from('community_reactions')
                .select('reaction_type')
                .eq('post_id', postId);

            if (reactionsData && reactionsData.length > 0) {
                setLikesCount(reactionsData.filter(r => r.reaction_type === 'like').length);
                setDislikesCount(reactionsData.filter(r => r.reaction_type === 'dislike').length);
            } else {
                // Fallback to old likes table
                const { count } = await supabase
                    .from('community_likes')
                    .select('*', { count: 'exact', head: true })
                    .eq('post_id', postId);
                setLikesCount(count || 0);
            }

            // Check user's reaction
            if (user) {
                const { data: userReactionData } = await supabase
                    .from('community_reactions')
                    .select('reaction_type')
                    .eq('post_id', postId)
                    .eq('user_id', user.id)
                    .single();

                if (userReactionData) {
                    setUserReaction(userReactionData.reaction_type as 'like' | 'dislike');
                } else {
                    // Fallback: check old likes table
                    const { data: likeData } = await supabase
                        .from('community_likes')
                        .select('id')
                        .eq('post_id', postId)
                        .eq('user_id', user.id)
                        .single();
                    if (likeData) {
                        setUserReaction('like');
                    }
                }
            }

            setLoading(false);
        };

        fetchData();
    }, [postId, supabase, router]);

    const handleReaction = async (type: 'like' | 'dislike') => {
        if (!currentUser) return;

        // Try using new reactions table
        if (userReaction === type) {
            // Remove reaction
            await supabase
                .from('community_reactions')
                .delete()
                .eq('post_id', postId)
                .eq('user_id', currentUser);

            if (type === 'like') setLikesCount(prev => prev - 1);
            else setDislikesCount(prev => prev - 1);
            setUserReaction(null);
        } else if (userReaction) {
            // Change reaction
            await supabase
                .from('community_reactions')
                .update({ reaction_type: type })
                .eq('post_id', postId)
                .eq('user_id', currentUser);

            if (type === 'like') {
                setLikesCount(prev => prev + 1);
                setDislikesCount(prev => prev - 1);
            } else {
                setLikesCount(prev => prev - 1);
                setDislikesCount(prev => prev + 1);
            }
            setUserReaction(type);
        } else {
            // Add new reaction
            const { error } = await supabase
                .from('community_reactions')
                .insert({ post_id: postId, user_id: currentUser, reaction_type: type });

            if (error) {
                // Fallback to old likes table for like
                if (type === 'like') {
                    await supabase
                        .from('community_likes')
                        .insert({ post_id: postId, user_id: currentUser });
                }
            }

            if (type === 'like') setLikesCount(prev => prev + 1);
            else setDislikesCount(prev => prev + 1);
            setUserReaction(type);
        }
    };

    const handleAddComment = async () => {
        if (!currentUser) {
            toast.error('로그인이 필요합니다.');
            return;
        }

        if (!newComment.trim()) return;

        setIsSubmittingComment(true);

        const { data, error } = await supabase
            .from('community_comments')
            .insert({ post_id: postId, user_id: currentUser, content: newComment })
            .select('*')
            .single();

        if (error) {
            toast.error('댓글 작성 실패');
            setIsSubmittingComment(false);
            return;
        }

        setComments(prev => [...prev, data]);
        setNewComment('');
        toast.success('댓글이 작성되었습니다.');
        setIsSubmittingComment(false);
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!confirm('댓글을 삭제하시겠습니까?')) return;

        const { error } = await supabase
            .from('community_comments')
            .delete()
            .eq('id', commentId);

        if (error) {
            toast.error('댓글 삭제 실패');
            return;
        }

        setComments(prev => prev.filter(c => c.id !== commentId));
        toast.success('댓글이 삭제되었습니다.');
    };

    const handleDeletePost = async () => {
        if (!confirm('정말 삭제하시겠습니까?')) return;

        const { error } = await supabase
            .from('community_posts')
            .delete()
            .eq('id', postId);

        if (error) {
            toast.error('게시글 삭제 실패');
            return;
        }

        toast.success('게시글이 삭제되었습니다.');
        router.push('/community');
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getCategoryLabel = (category: string) => {
        switch (category) {
            case 'notice': return '공지사항';
            case 'gallery': return '갤러리';
            case 'board': return '자유게시판';
            default: return category;
        }
    };

    const scrollToComments = () => {
        commentsRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-zinc-400">로딩 중...</div>
            </div>
        );
    }

    if (!post) return null;

    return (
        <div className="min-h-screen bg-background pt-28 pb-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <Link href="/community" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition">
                    <ArrowLeft className="w-4 h-4" />
                    목록으로
                </Link>

                {/* Post Header */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-1 rounded">
                            {getCategoryLabel(post.category)}
                        </span>
                    </div>

                    <h1 className="text-2xl font-bold text-white mb-4">{post.title}</h1>

                    <div className="flex items-center justify-between text-sm text-zinc-500 pb-4 border-b border-zinc-800">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {post.profiles?.username || '익명'}
                            </span>
                            <span>{formatDate(post.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {post.view_count}
                            </span>
                        </div>
                    </div>

                    {/* Social Actions */}
                    <div className="mt-4">
                        <SocialActions
                            likesCount={likesCount}
                            dislikesCount={dislikesCount}
                            commentsCount={comments.length}
                            userReaction={userReaction}
                            isLoggedIn={!!currentUser}
                            onLike={() => handleReaction('like')}
                            onDislike={() => handleReaction('dislike')}
                            onScrollToComments={scrollToComments}
                            shareUrl={`/community/${post.id}`}
                            shareTitle={post.title}
                        />
                    </div>
                </div>

                {/* Post Content */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-6">
                    {post.image_url && (
                        <div className="mb-6">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={post.image_url}
                                alt="Post image"
                                className="max-w-full h-auto rounded-lg"
                            />
                        </div>
                    )}
                    <div className="prose prose-invert prose-zinc max-w-none prose-crestia">
                        <ReactMarkdown
                            components={{
                                p: ({ children }) => (
                                    <p className="text-zinc-300 leading-relaxed mb-4">{children}</p>
                                ),
                                a: ({ href, children }) => (
                                    <a
                                        href={href}
                                        className="text-[#D4AF37] hover:text-[#FCF6BA] underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {children}
                                    </a>
                                ),
                                strong: ({ children }) => (
                                    <strong className="text-white font-bold">{children}</strong>
                                ),
                            }}
                        >
                            {post.content}
                        </ReactMarkdown>
                    </div>
                </div>

                {/* Owner Actions */}
                {currentUser === post.user_id && (
                    <div className="flex justify-end gap-2 mb-6">
                        <Link href={`/community/${post.id}/edit`}>
                            <Button variant="outline" className="gap-2">
                                <PenLine className="w-4 h-4" />
                                수정
                            </Button>
                        </Link>
                        <Button onClick={handleDeletePost} variant="destructive" className="gap-2">
                            <Trash2 className="w-4 h-4" />
                            삭제
                        </Button>
                    </div>
                )}

                {/* Comments Section */}
                <div ref={commentsRef} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-6">
                        💬 댓글 <span className="text-[#D4AF37]">{comments.length}</span>
                    </h3>

                    {/* Comment Input */}
                    {currentUser ? (
                        <div className="mb-6">
                            <Textarea
                                placeholder="댓글을 입력하세요..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="bg-zinc-800 border-zinc-700 min-h-[80px] mb-3"
                            />
                            <div className="flex justify-between items-center">
                                <EmojiButton onEmojiSelect={(emoji) => setNewComment(prev => prev + emoji)} />
                                <Button
                                    onClick={handleAddComment}
                                    disabled={isSubmittingComment || !newComment.trim()}
                                    className="bg-[#D4AF37] hover:bg-[#C5A028] text-black gap-2"
                                >
                                    <Send className="w-4 h-4" />
                                    {isSubmittingComment ? '작성 중...' : '댓글 작성'}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="mb-6 text-center py-4 bg-zinc-800/50 rounded-lg">
                            <p className="text-zinc-400 mb-2">댓글을 작성하려면 로그인이 필요합니다.</p>
                            <Link href="/login">
                                <Button variant="outline" size="sm">로그인</Button>
                            </Link>
                        </div>
                    )}

                    {/* Comments List */}
                    <div className="space-y-4">
                        {comments.length === 0 ? (
                            <p className="text-zinc-500 text-center py-8">아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!</p>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment.id} className="bg-zinc-800/50 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center">
                                                <User className="w-4 h-4 text-zinc-400" />
                                            </div>
                                            <div>
                                                <span className="text-white font-medium text-sm">
                                                    {comment.profiles?.username || '익명'}
                                                </span>
                                                <span className="text-zinc-500 text-xs ml-2">
                                                    {formatDate(comment.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                        {currentUser === comment.user_id && (
                                            <button
                                                onClick={() => handleDeleteComment(comment.id)}
                                                className="text-zinc-500 hover:text-red-500 transition"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-zinc-300 whitespace-pre-wrap">{comment.content}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
