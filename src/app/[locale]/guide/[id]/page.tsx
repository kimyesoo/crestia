'use client';

import { useState, useEffect, useMemo, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Eye, Clock, BookOpen, Lightbulb, Edit, Trash2, Send, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import { SocialActions } from '@/components/SocialActions';
import { EmojiButton } from '@/components/EmojiButton';
import { AdSenseBanner } from '@/components/ads/AdSenseBanner';
import { SocialProofToast, FactCheckBadge, SaveToCollection } from '@/components/nudge';

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

interface Comment {
    id: string;
    user_id: string;
    content: string;
    created_at: string;
    profiles?: { username: string | null };
}

export default function GuideDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const supabase = useMemo(() => createClient(), []);
    const commentsRef = useRef<HTMLDivElement>(null);

    const [post, setPost] = useState<GuidePost | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    // Social features state
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [likesCount, setLikesCount] = useState(0);
    const [dislikesCount, setDislikesCount] = useState(0);
    const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUserId(user?.id || null);
        };
        fetchUser();
    }, [supabase]);

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);

            // Increment view count
            await supabase.rpc('increment_guide_view_count', { guide_id: resolvedParams.id });

            const { data, error } = await supabase
                .from('guide_posts')
                .select('*')
                .eq('id', resolvedParams.id)
                .single();

            if (error) {
                console.error('Error fetching guide:', error);
                setPost(null);
            } else {
                setPost(data);
            }

            // Fetch comments
            const { data: commentsData } = await supabase
                .from('guide_comments')
                .select('*')
                .eq('guide_id', resolvedParams.id)
                .order('created_at', { ascending: true });

            setComments(commentsData || []);

            // Fetch reactions counts
            const { data: reactionsData } = await supabase
                .from('guide_reactions')
                .select('reaction_type')
                .eq('guide_id', resolvedParams.id);

            if (reactionsData) {
                setLikesCount(reactionsData.filter(r => r.reaction_type === 'like').length);
                setDislikesCount(reactionsData.filter(r => r.reaction_type === 'dislike').length);
            }

            // Check user's reaction
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: userReactionData } = await supabase
                    .from('guide_reactions')
                    .select('reaction_type')
                    .eq('guide_id', resolvedParams.id)
                    .eq('user_id', user.id)
                    .single();

                if (userReactionData) {
                    setUserReaction(userReactionData.reaction_type as 'like' | 'dislike');
                }
            }

            setLoading(false);
        };

        fetchPost();
    }, [resolvedParams.id, supabase]);

    const handleReaction = async (type: 'like' | 'dislike') => {
        if (!currentUserId) return;

        const guideId = resolvedParams.id;

        if (userReaction === type) {
            // Remove reaction
            await supabase
                .from('guide_reactions')
                .delete()
                .eq('guide_id', guideId)
                .eq('user_id', currentUserId);

            if (type === 'like') setLikesCount(prev => prev - 1);
            else setDislikesCount(prev => prev - 1);
            setUserReaction(null);
        } else if (userReaction) {
            // Change reaction
            await supabase
                .from('guide_reactions')
                .update({ reaction_type: type })
                .eq('guide_id', guideId)
                .eq('user_id', currentUserId);

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
            await supabase
                .from('guide_reactions')
                .insert({ guide_id: guideId, user_id: currentUserId, reaction_type: type });

            if (type === 'like') setLikesCount(prev => prev + 1);
            else setDislikesCount(prev => prev + 1);
            setUserReaction(type);
        }
    };

    const handleAddComment = async () => {
        if (!currentUserId) {
            toast.error('로그인이 필요합니다.');
            return;
        }

        if (!newComment.trim()) return;

        setIsSubmittingComment(true);

        const { data, error } = await supabase
            .from('guide_comments')
            .insert({
                guide_id: resolvedParams.id,
                user_id: currentUserId,
                content: newComment.trim()
            })
            .select('*')
            .single();

        if (error) {
            console.error(error);
            toast.error('댓글 작성에 실패했습니다.');
        } else {
            setComments(prev => [...prev, data]);
            setNewComment('');
            toast.success('댓글이 작성되었습니다!');
        }

        setIsSubmittingComment(false);
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!confirm('댓글을 삭제하시겠습니까?')) return;

        const { error } = await supabase
            .from('guide_comments')
            .delete()
            .eq('id', commentId);

        if (error) {
            toast.error('댓글 삭제에 실패했습니다.');
        } else {
            setComments(prev => prev.filter(c => c.id !== commentId));
            toast.success('댓글이 삭제되었습니다.');
        }
    };

    const handleDelete = async () => {
        if (!post || !confirm('정말 삭제하시겠습니까?')) return;

        const { error } = await supabase
            .from('guide_posts')
            .delete()
            .eq('id', post.id);

        if (error) {
            toast.error('삭제에 실패했습니다.');
        } else {
            toast.success('삭제되었습니다.');
            router.push('/guide');
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
            case 'beginner': return '입문 가이드';
            case 'tips': return '사육 팁';
            default: return category;
        }
    };

    const scrollToComments = () => {
        commentsRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background pt-28 pb-8 px-4">
                <div className="max-w-3xl mx-auto text-center text-zinc-500">로딩 중...</div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-background pt-28 pb-8 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <p className="text-zinc-500 mb-4">가이드를 찾을 수 없습니다.</p>
                    <Link href="/guide">
                        <Button variant="outline">목록으로</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-28 pb-8 px-4">
            {/* Social Proof Toast (Nudge) */}
            <SocialProofToast />
            {/* JSON-LD Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Article",
                        "headline": post.title,
                        "image": post.image_url || "https://crestia.vercel.app/logo.png",
                        "datePublished": post.created_at,
                        "author": {
                            "@type": "Person",
                            "name": "Crestia Team"
                        },
                        "publisher": {
                            "@type": "Organization",
                            "name": "Crestia",
                            "logo": {
                                "@type": "ImageObject",
                                "url": "https://crestia.vercel.app/logo.png"
                            }
                        },
                        "description": post.content.substring(0, 160),
                        "mainEntityOfPage": {
                            "@type": "WebPage",
                            "@id": `https://crestia.vercel.app/guide/${post.id}`
                        }
                    })
                }}
            />
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <Link href="/guide" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition">
                        <ArrowLeft className="w-4 h-4" />
                        목록으로
                    </Link>
                    {currentUserId === post.user_id && (
                        <div className="flex gap-2">
                            <Link href={`/guide/${post.id}/edit`}>
                                <Button variant="outline" size="sm" className="gap-1">
                                    <Edit className="w-4 h-4" /> 수정
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-1 text-red-400 hover:text-red-300"
                                onClick={handleDelete}
                            >
                                <Trash2 className="w-4 h-4" /> 삭제
                            </Button>
                        </div>
                    )}
                </div>

                {/* Image */}
                {post.image_url && (
                    <div className="mb-6 rounded-xl overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={post.image_url}
                            alt={post.title}
                            className="w-full h-auto max-h-96 object-cover"
                        />
                    </div>
                )}

                {/* Article */}
                <article className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 md:p-8">
                    {/* Category & Meta */}
                    <div className="flex items-center gap-3 mb-4">
                        <span className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${getCategoryColor(post.category)}`}>
                            {getCategoryIcon(post.category)}
                            {getCategoryLabel(post.category)}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        {post.title}
                    </h1>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-zinc-500 text-sm mb-6 pb-4 border-b border-zinc-800">
                        <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" /> {formatDate(post.created_at)}
                        </span>
                        <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" /> {post.view_count} views
                        </span>
                    </div>

                    {/* Social Actions */}
                    <div className="mb-8 pb-6 border-b border-zinc-800">
                        <SocialActions
                            likesCount={likesCount}
                            dislikesCount={dislikesCount}
                            commentsCount={comments.length}
                            userReaction={userReaction}
                            isLoggedIn={!!currentUserId}
                            onLike={() => handleReaction('like')}
                            onDislike={() => handleReaction('dislike')}
                            onScrollToComments={scrollToComments}
                            shareUrl={`/guide/${post.id}`}
                            shareTitle={post.title}
                        />
                    </div>

                    {/* Fact Check Badge (Nudge - Trust Signal) */}
                    <FactCheckBadge className="mb-6" />

                    {/* Content - Markdown Rendering */}
                    <div className="prose prose-lg prose-invert max-w-none prose-crestia">
                        <ReactMarkdown
                            components={{
                                h1: ({ children }) => (
                                    <h1 className="text-3xl font-bold text-white mt-8 mb-4">{children}</h1>
                                ),
                                h2: ({ children }) => (
                                    <h2 className="text-2xl font-bold text-white mt-8 mb-4 pb-2 border-b border-zinc-700">{children}</h2>
                                ),
                                h3: ({ children }) => (
                                    <h3 className="text-xl font-bold text-white mt-6 mb-3">{children}</h3>
                                ),
                                h4: ({ children }) => (
                                    <h4 className="text-lg font-semibold text-white mt-4 mb-2">{children}</h4>
                                ),
                                p: ({ children }) => (
                                    <p className="text-zinc-300 leading-relaxed mb-4">{children}</p>
                                ),
                                a: ({ href, children }) => (
                                    <a
                                        href={href}
                                        className="text-[#D4AF37] hover:text-[#FCF6BA] underline transition-colors"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {children}
                                    </a>
                                ),
                                strong: ({ children }) => (
                                    <strong className="text-white font-bold">{children}</strong>
                                ),
                                ul: ({ children }) => (
                                    <ul className="list-disc list-inside space-y-2 mb-4 text-zinc-300">{children}</ul>
                                ),
                                ol: ({ children }) => (
                                    <ol className="list-decimal list-inside space-y-2 mb-4 text-zinc-300">{children}</ol>
                                ),
                                li: ({ children }) => (
                                    <li className="text-zinc-300">{children}</li>
                                ),
                                blockquote: ({ children }) => (
                                    <blockquote className="border-l-4 border-[#D4AF37] bg-zinc-800/50 pl-4 py-2 my-4 italic text-zinc-400">
                                        {children}
                                    </blockquote>
                                ),
                                code: ({ className, children }) => {
                                    const isInline = !className;
                                    return isInline ? (
                                        <code className="bg-zinc-800 text-[#D4AF37] px-1.5 py-0.5 rounded text-sm font-mono">
                                            {children}
                                        </code>
                                    ) : (
                                        <code className={className}>{children}</code>
                                    );
                                },
                                pre: ({ children }) => (
                                    <pre className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 overflow-x-auto my-4">
                                        {children}
                                    </pre>
                                ),
                                hr: () => (
                                    <hr className="border-zinc-700 my-8" />
                                ),
                                img: ({ src, alt }) => (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={src}
                                        alt={alt || ''}
                                        className="rounded-lg max-w-full h-auto my-4"
                                    />
                                ),
                                table: ({ children }) => (
                                    <div className="overflow-x-auto my-4">
                                        <table className="w-full border-collapse border border-zinc-700">
                                            {children}
                                        </table>
                                    </div>
                                ),
                                thead: ({ children }) => (
                                    <thead className="bg-zinc-800">{children}</thead>
                                ),
                                th: ({ children }) => (
                                    <th className="border border-zinc-700 px-4 py-2 text-left text-white font-semibold">
                                        {children}
                                    </th>
                                ),
                                td: ({ children }) => (
                                    <td className="border border-zinc-700 px-4 py-2 text-zinc-300">
                                        {children}
                                    </td>
                                ),
                            }}
                        >
                            {post.content}
                        </ReactMarkdown>
                    </div>
                </article>

                {/* 광고 배너 - 본문과 댓글 사이 */}
                <div className="my-6">
                    <AdSenseBanner
                        slot="1234567890"
                        format="horizontal"
                        className="rounded-xl overflow-hidden"
                    />
                </div>

                {/* Comments Section */}
                <div ref={commentsRef} className="mt-8 bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        💬 댓글 <span className="text-[#D4AF37]">{comments.length}</span>
                    </h2>

                    {/* Comment Input */}
                    {currentUserId ? (
                        <div className="mb-6">
                            <Textarea
                                placeholder="댓글을 작성하세요..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="bg-zinc-800 border-zinc-700 mb-3 min-h-[100px]"
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
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center">
                                                <User className="w-4 h-4 text-zinc-400" />
                                            </div>
                                            <div>
                                                <p className="text-white text-sm font-medium">
                                                    {comment.profiles?.username || '익명'}
                                                </p>
                                                <p className="text-zinc-500 text-xs">
                                                    {formatDate(comment.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                        {currentUserId === comment.user_id && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteComment(comment.id)}
                                                className="text-red-400 hover:text-red-300 h-8 px-2"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                    <p className="text-zinc-300 text-sm whitespace-pre-wrap">
                                        {comment.content}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Save to Collection CTA (Nudge - Loss Aversion) */}
            <SaveToCollection isLoggedIn={!!currentUserId} variant="bar" />
        </div>
    );
}
