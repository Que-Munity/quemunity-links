'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ThumbsUp, ThumbsDown, MessageSquare, Clock, User, Tag, AlertCircle, Send, Trash2, Reply } from 'lucide-react';

interface PostAuthor { id: string; username: string; image?: string | null }

interface Post {
  id: string;
  title: string;
  content?: string | null;
  problem?: string | null;
  details?: string | null;
  category: string;
  tags: string[];
  author: PostAuthor;
  createdAt: string;
  votes: number;
  replies: number;
  type: 'DISCUSSION' | 'QUESTION';
  urgency?: string | null;
}

interface PostComment {
  id: string;
  content: string;
  createdAt: string;
  author: PostAuthor;
  replies: PostComment[];
}

const CATEGORY_COLORS: Record<string, string> = {
  general: 'bg-gray-100 text-gray-800',
  techniques: 'bg-orange-100 text-orange-800',
  equipment: 'bg-blue-100 text-blue-800',
  recipes: 'bg-green-100 text-green-800',
  competition: 'bg-purple-100 text-purple-800',
  beginners: 'bg-yellow-100 text-yellow-800',
  showoff: 'bg-pink-100 text-pink-800',
  troubleshooting: 'bg-red-100 text-red-800',
};

const URGENCY_COLORS: Record<string, string> = {
  URGENT: 'bg-red-500 text-white',
  HIGH: 'bg-orange-500 text-white',
  NORMAL: 'bg-blue-500 text-white',
  LOW: 'bg-gray-500 text-white',
};

function formatTimeAgo(dateString: string) {
  const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function Avatar({ username, image }: { username: string; image?: string | null }) {
  if (image) return <img src={image} alt={username} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />;
  return (
    <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
      {username[0].toUpperCase()}
    </div>
  );
}

function CommentItem({
  comment, currentUserId, postId, onDeleted, onReply,
}: {
  comment: PostComment;
  currentUserId?: string;
  postId: string;
  onDeleted: () => void;
  onReply: (parentId: string, username: string) => void;
}) {
  const handleDelete = async () => {
    if (!confirm('Delete this comment?')) return;
    const res = await fetch(`/api/posts/${postId}/comments?commentId=${comment.id}`, { method: 'DELETE' });
    if (res.ok) onDeleted();
  };

  return (
    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
      <Avatar username={comment.author.username} image={comment.author.image} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm text-gray-900">{comment.author.username}</span>
          <span className="text-xs text-gray-500">{formatTimeAgo(comment.createdAt)}</span>
        </div>
        <p className="text-gray-700 text-sm whitespace-pre-wrap">{comment.content}</p>
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => onReply(comment.id, comment.author.username)}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-orange-600"
          >
            <Reply className="w-3 h-3" /> Reply
          </button>
          {currentUserId === comment.author.id && (
            <button onClick={handleDelete} className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500">
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          )}
        </div>
        {comment.replies.length > 0 && (
          <div className="mt-3 space-y-3 border-l-2 border-orange-100 pl-4">
            {comment.replies.map(reply => (
              <CommentItem
                key={reply.id}
                comment={reply}
                currentUserId={currentUserId}
                postId={postId}
                onDeleted={onDeleted}
                onReply={onReply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PostDetailPage() {
  const { data: session } = useSession();
  const params = useParams() as { id: string };
  const postId = params.id;

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<{ id: string; username: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [userVote, setUserVote] = useState<number | null>(null);

  const fetchPost = useCallback(async () => {
    try {
      const res = await fetch(`/api/posts/${postId}`);
      if (res.ok) setPost(await res.json());
    } catch (e) { /* */ }
  }, [postId]);

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/posts/${postId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments);
      }
    } catch (e) { /* */ }
  }, [postId]);

  useEffect(() => {
    Promise.all([fetchPost(), fetchComments()]).finally(() => setLoading(false));
  }, [fetchPost, fetchComments]);

  const handleVote = async (direction: 'up' | 'down') => {
    if (!session?.user) { alert('Please sign in to vote'); return; }
    const res = await fetch(`/api/posts/${postId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ direction }),
    });
    if (res.ok) {
      const data = await res.json();
      setPost(prev => prev ? { ...prev, votes: data.votes } : prev);
      setUserVote(data.userVote);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment.trim(), parentId: replyTo?.id ?? null }),
      });
      if (res.ok) {
        setNewComment('');
        setReplyTo(null);
        await fetchComments();
        await fetchPost();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to post');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = (parentId: string, username: string) => {
    setReplyTo({ id: parentId, username });
    setNewComment(`@${username} `);
    document.getElementById('comment-input')?.focus();
  };

  const totalComments = comments.reduce((s, c) => s + 1 + c.replies.length, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Post not found</h2>
          <Link href="/community/forum" className="text-orange-600 hover:text-orange-700">← Back to Forum</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/community/forum" className="flex items-center text-gray-600 hover:text-orange-600 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Forum
          </Link>
        </div>

        {/* Post */}
        <div className="bg-white rounded-xl shadow-lg p-5 sm:p-8 mb-8">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div className="flex items-center space-x-3">
              <Avatar username={post.author.username} image={post.author.image} />
              <div>
                <span className="font-medium text-gray-900">{post.author.username}</span>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-3 h-3" />
                  {formatTimeAgo(post.createdAt)}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {post.urgency && post.type === 'QUESTION' && (
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${URGENCY_COLORS[post.urgency] || 'bg-gray-500 text-white'}`}>
                  {post.urgency}
                </span>
              )}
              <span className={`px-2 py-1 text-xs rounded-full font-medium ${CATEGORY_COLORS[post.category] || 'bg-gray-100 text-gray-800'}`}>
                {post.category}
              </span>
              {post.type === 'QUESTION' && <AlertCircle className="w-4 h-4 text-blue-500" />}
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-5">{post.title}</h1>

          <div className="prose max-w-none mb-6">
            {post.type === 'QUESTION' ? (
              <>
                {post.problem && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Problem Summary:</h3>
                    <p className="text-blue-800">{post.problem}</p>
                  </div>
                )}
                {post.details && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Detailed Description:</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{post.details}</p>
                  </div>
                )}
              </>
            ) : (
              post.content && <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
            )}
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, i) => (
                <span key={i} className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full">
                  <Tag className="w-3 h-3 mr-1" />{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleVote('up')}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                    userVote === 1 ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm font-medium">{post.votes}</span>
                </button>
                <button
                  onClick={() => handleVote('down')}
                  className={`p-2 rounded-lg transition-colors ${
                    userVote === -1 ? 'bg-red-100 text-red-700' : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center space-x-1 text-gray-500">
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm">{totalComments} {post.type === 'QUESTION' ? 'answers' : 'replies'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {post.type === 'QUESTION' ? 'Answers' : 'Comments'} ({totalComments})
          </h2>

          {session?.user ? (
            <form onSubmit={handleSubmitComment} className="mb-8">
              {replyTo && (
                <div className="flex items-center gap-2 mb-2 text-sm text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
                  <Reply className="w-4 h-4" />
                  Replying to <span className="font-semibold">{replyTo.username}</span>
                  <button type="button" onClick={() => { setReplyTo(null); setNewComment(''); }} className="ml-auto text-gray-400 hover:text-gray-600 text-xs">
                    Cancel
                  </button>
                </div>
              )}
              <div className="flex items-start space-x-4">
                <Avatar username={session.user.name || session.user.email || 'U'} />
                <div className="flex-1">
                  <textarea
                    id="comment-input"
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder={post.type === 'QUESTION' ? 'Share your solution or advice...' : 'Add your thoughts...'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    rows={4}
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      type="submit"
                      disabled={!newComment.trim() || submitting}
                      className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      <span>{submitting ? 'Posting...' : post.type === 'QUESTION' ? 'Post Answer' : 'Post Comment'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8 text-center">
              <p className="text-gray-600">
                <Link href="/auth/signin" className="text-orange-600 hover:text-orange-700 font-medium">Sign in</Link>
                {' '}to {post.type === 'QUESTION' ? 'answer this question' : 'join the discussion'}
              </p>
            </div>
          )}

          <div className="space-y-4">
            {comments.map(comment => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={session?.user?.id as string | undefined}
                postId={postId}
                onDeleted={fetchComments}
                onReply={handleReply}
              />
            ))}
          </div>

          {comments.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {post.type === 'QUESTION' ? 'No answers yet' : 'No comments yet'}
              </h3>
              <p className="text-gray-500">
                {post.type === 'QUESTION' ? 'Be the first to help!' : 'Start the conversation!'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
