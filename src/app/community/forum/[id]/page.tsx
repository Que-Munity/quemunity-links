'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ThumbsUp, ThumbsDown, MessageSquare, Clock, User, Tag, AlertCircle, Send } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  content?: string;
  problem?: string;
  details?: string;
  category: string;
  tags: string[];
  author: string;
  authorId?: string;
  createdAt: string;
  votes: number;
  replies?: number;
  answers?: number;
  type?: string;
  urgency?: string;
}

interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  createdAt: string;
  votes: number;
}

export default function PostDetailPage() {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [newComment, setNewComment] = useState('');
  const [userVotes, setUserVotes] = useState<any>({});
  const router = useRouter();
  const params = useParams();
  const paramsObj = params as { id?: string };

  useEffect(() => {
    // Load current user
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }

    // Load user votes
    const votes = localStorage.getItem('userVotes');
    if (votes) {
      setUserVotes(JSON.parse(votes));
    }

    // Load post
    const savedPosts = localStorage.getItem('communityPosts');
    if (savedPosts && paramsObj.id) {
      const posts = JSON.parse(savedPosts);
      const foundPost = posts.find((p: Post) => p.id === paramsObj.id);
      setPost(foundPost || null);
    }

    // Load comments for this post
    const savedComments = localStorage.getItem('postComments');
    if (savedComments && paramsObj.id) {
      const allComments = JSON.parse(savedComments);
      const postComments = allComments.filter((c: Comment) => c.postId === paramsObj.id);
      setComments(postComments);
    }
  }, [paramsObj.id]);

  const handleVote = (postId: string, direction: 'up' | 'down') => {
    if (!currentUser) {
      alert('Please log in to vote on posts');
      return;
    }

    const voteKey = `${currentUser.id}_${postId}`;
    const existingVote = userVotes[voteKey];

    // If user already voted in same direction, remove vote
    if (existingVote === direction) {
      const newVotes = { ...userVotes };
      delete newVotes[voteKey];
      setUserVotes(newVotes);
      localStorage.setItem('userVotes', JSON.stringify(newVotes));

      // Update post vote count
      updatePostVotes(postId, direction === 'up' ? -1 : 1);
      return;
    }

    // Calculate vote change
    let voteChange = direction === 'up' ? 1 : -1;
    if (existingVote) {
      // User switching vote direction (remove old vote and add new)
      voteChange = direction === 'up' ? 2 : -2;
    }

    // Update user votes
    const newVotes = { ...userVotes, [voteKey]: direction };
    setUserVotes(newVotes);
    localStorage.setItem('userVotes', JSON.stringify(newVotes));

    // Update post vote count
    updatePostVotes(postId, voteChange);
  };

  const updatePostVotes = (postId: string, change: number) => {
    if (!post) return;

    const updatedPost = { ...post, votes: post.votes + change };
    setPost(updatedPost);

    // Update in localStorage
    const savedPosts = localStorage.getItem('communityPosts');
    if (savedPosts) {
      const posts = JSON.parse(savedPosts);
      const updatedPosts = posts.map((p: Post) => 
        p.id === postId ? updatedPost : p
      );
      localStorage.setItem('communityPosts', JSON.stringify(updatedPosts));
    }
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Please log in to comment');
      return;
    }
    if (!newComment.trim()) return;

    const comment: Comment = {
  id: Date.now().toString(),
  postId: paramsObj.id as string,
      author: currentUser.username,
      content: newComment,
      createdAt: new Date().toISOString(),
      votes: 0
    };

    // Add comment to state
    const updatedComments = [...comments, comment];
    setComments(updatedComments);

    // Save to localStorage
    const allComments = JSON.parse(localStorage.getItem('postComments') || '[]');
    allComments.push(comment);
    localStorage.setItem('postComments', JSON.stringify(allComments));

    // Update post reply/answer count
    if (post) {
      const updatedPost = {
        ...post,
        replies: post.type === 'question' ? post.answers : (post.replies || 0) + 1,
        answers: post.type === 'question' ? (post.answers || 0) + 1 : post.replies
      };
      setPost(updatedPost);

      // Update in posts localStorage
      const savedPosts = localStorage.getItem('communityPosts');
      if (savedPosts) {
        const posts = JSON.parse(savedPosts);
        const updatedPosts = posts.map((p: Post) => 
          p.id === post.id ? updatedPost : p
        );
        localStorage.setItem('communityPosts', JSON.stringify(updatedPosts));
      }
    }

    setNewComment('');
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'general': 'bg-gray-100 text-gray-800',
      'techniques': 'bg-orange-100 text-orange-800',
      'equipment': 'bg-blue-100 text-blue-800',
      'recipes': 'bg-green-100 text-green-800',
      'competition': 'bg-purple-100 text-purple-800',
      'beginners': 'bg-yellow-100 text-yellow-800',
      'showoff': 'bg-pink-100 text-pink-800',
      'troubleshooting': 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'normal': return 'bg-blue-500 text-white';
      case 'low': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getUserVote = (postId: string) => {
    if (!currentUser) return null;
    return userVotes[`${currentUser.id}_${postId}`] || null;
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Post not found</h2>
          <Link href="/community/forum" className="text-blue-600 hover:text-blue-700">
            ← Back to Forum
          </Link>
        </div>
      </div>
    );
  }

  const currentVote = getUserVote(post.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link 
            href="/community/forum" 
            className="flex items-center text-gray-600 hover:text-orange-600 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Forum
          </Link>
        </div>

        {/* Post */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          {/* Post Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-gray-900">{post.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">{formatTimeAgo(post.createdAt)}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {post.urgency && post.type === 'question' && (
                <span className={`px-3 py-1 text-sm rounded-full font-medium ${getUrgencyColor(post.urgency)}`}>
                  {post.urgency.toUpperCase()}
                </span>
              )}
              <span className={`px-3 py-1 text-sm rounded-full font-medium ${getCategoryColor(post.category)}`}>
                {post.category}
              </span>
              {post.type === 'question' && (
                <AlertCircle className="w-5 h-5 text-blue-500" />
              )}
            </div>
          </div>

          {/* Post Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{post.title}</h1>

          {/* Post Content */}
          <div className="prose max-w-none mb-6">
            {post.type === 'question' ? (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Problem Summary:</h3>
                  <p className="text-blue-800">{post.problem}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Detailed Description:</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{post.details}</p>
                </div>
              </>
            ) : (
              <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
            )}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, index) => (
                <span key={index} className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Voting and Stats */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleVote(post.id, 'up')}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                    currentVote === 'up' 
                      ? 'bg-green-100 text-green-700' 
                      : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm font-medium">{post.votes}</span>
                </button>
                <button
                  onClick={() => handleVote(post.id, 'down')}
                  className={`p-2 rounded-lg transition-colors ${
                    currentVote === 'down'
                      ? 'bg-red-100 text-red-700'
                      : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center space-x-1 text-gray-500">
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm">
                  {comments.length} {post.type === 'question' ? 'answers' : 'replies'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {post.type === 'question' ? 'Answers' : 'Comments'} ({comments.length})
          </h2>

          {/* Add Comment Form */}
          {currentUser ? (
            <form onSubmit={handleSubmitComment} className="mb-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center">
                    {currentUser.username[0].toUpperCase()}
                  </div>
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={post.type === 'question' ? 'Share your solution or advice...' : 'Add your thoughts...'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    rows={4}
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      type="submit"
                      disabled={!newComment.trim()}
                      className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      <span>{post.type === 'question' ? 'Post Answer' : 'Post Comment'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8 text-center">
              <p className="text-gray-600">
                <Link href="/auth/login" className="text-blue-600 hover:text-blue-700">Log in</Link> to {post.type === 'question' ? 'answer this question' : 'join the discussion'}
              </p>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
                    {comment.author[0].toUpperCase()}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-gray-900">{comment.author}</span>
                    <span className="text-sm text-gray-500">{formatTimeAgo(comment.createdAt)}</span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>

          {comments.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {post.type === 'question' ? 'No answers yet' : 'No comments yet'}
              </h3>
              <p className="text-gray-500">
                {post.type === 'question' ? 'Be the first to help solve this problem!' : 'Start the conversation!'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}