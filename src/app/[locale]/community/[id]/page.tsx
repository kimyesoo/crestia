'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Heart, MessageCircle, Eye, Trash2, Send, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

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

    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [likesCount, setLikesCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const postId = params.id as string;

    useEffect(() => {
        const fetchData = async () => {
            // Get current user
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUser(user?.id || null);

            // Fetch post
            const { data: postData, error: postError } = await supabase
                .from('community_posts')
                .select('*, profiles:user_id(username)')
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
                .select('*, profiles:user_id(username)')
                .eq('post_id', postId)
                .order('created_at', { ascending: true });

            setComments(commentsData || []);

            // Fetch likes count
            const { count } = await supabase
                .from('community_likes')
                .select('*', { count: 'exact', head: true })
                .eq('post_id', postId);

            setLikesCount(count || 0);

            // Check if current user liked
            if (user) {
                const { data: likeData } = await supabase
                    .from('community_likes')
                    .select('id')
                    .eq('post_id', postId)
                    .eq('user_id', user.id)
                    .single();

                setIsLiked(!!likeData);
            }

            setLoading(false);
        };

        fetchData();
    }, [postId, supabase, router]);

    const handleLike = async () => {
        if (!currentUser) {
            toast.error('로그인이 필요합니다.');
            return;
        }

        if (isLiked) {
            // Unlike
            await supabase
                .from('community_likes')
                .delete()
                .eq('post_id', postId)
                .eq('user_id', currentUser);
            setIsLiked(false);
            setLikesCount(prev => prev - 1);
        } else {
            // Like
            await supabase
                .from('community_likes')
                .insert({ post_id: postId, user_id: currentUser });
            setIsLiked(true);
            setLikesCount(prev => prev + 1);
        }
    };

    const handleAddComment = async () => {
        if (!currentUser) {
            toast.error('로그인이 필요합니다.');
            return;
        }

        if (!newComment.trim()) return;

        const { data, error } = await supabase
            .from('community_comments')
            .insert({ post_id: postId, user_id: currentUser, content: newComment })
            .select('*, profiles:user_id(username)')
            .single();

        if (error) {
            toast.error('댓글 작성 실패');
            return;
        }

        setComments(prev => [...prev, data]);
        setNewComment('');
        toast.success('댓글이 작성되었습니다.');
    };

    const handleDeleteComment = async (commentId: string) => {
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

                    <div className="flex items-center justify-between text-sm text-zinc-500">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {post.profiles?.username || '익명'}
                            </span>
                            <span>{formatDate(post.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {post.view_count}
                            </span>
                            <span className="flex items-center gap-1">
                                <Heart className="w-4 h-4" />
                                {likesCount}
                            </span>
                            <span className="flex items-center gap-1">
                                <MessageCircle className="w-4 h-4" />
                                {comments.length}
                            </span>
                        </div>
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
                    <div className="text-zinc-300 whitespace-pre-wrap leading-relaxed">
                        {post.content}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mb-8">
                    <Button
                        onClick={handleLike}
                        variant={isLiked ? 'default' : 'outline'}
                        className={`gap-2 ${isLiked ? 'bg-red-500 hover:bg-red-600' : ''}`}
                    >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                        좋아요 {likesCount}
                    </Button>

                    {currentUser === post.user_id && (
                        <Button onClick={handleDeletePost} variant="destructive" className="gap-2">
                            <Trash2 className="w-4 h-4" />
                            삭제
                        </Button>
                    )}
                </div>

                {/* Comments Section */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                        댓글 {comments.length}개
                    </h3>

                    {/* Comment Input */}
                    <div className="flex gap-2 mb-6">
                        <Textarea
                            placeholder={currentUser ? '댓글을 입력하세요...' : '로그인 후 댓글을 작성할 수 있습니다.'}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            disabled={!currentUser}
                            className="bg-zinc-800 border-zinc-700 min-h-[60px]"
                        />
                        <Button onClick={handleAddComment} disabled={!currentUser || !newComment.trim()}>
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4">
                        {comments.length === 0 ? (
                            <p className="text-zinc-500 text-center py-4">아직 댓글이 없습니다.</p>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment.id} className="bg-zinc-800/50 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-white font-medium">
                                                {comment.profiles?.username || '익명'}
                                            </span>
                                            <span className="text-zinc-500 text-sm">
                                                {formatDate(comment.created_at)}
                                            </span>
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
                                    <p className="text-zinc-300">{comment.content}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
