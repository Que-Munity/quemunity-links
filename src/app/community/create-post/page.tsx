'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Tag } from 'lucide-react';

export default function CreatePostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    tags: '',
  });

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" /></div>;

  if (!session?.user) {
    router.push('/auth/signin');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          category: formData.category,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
          type: 'DISCUSSION',
        }),
      });

      if (res.ok) {
        const post = await res.json();
        router.push(`/community/forum/${post.id}`);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to create post');
      }
    } catch (error) {
      alert('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/community" className="flex items-center text-gray-600 hover:text-orange-600 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Community
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Share Your BBQ Experience</h1>
          <p className="text-gray-600 mt-2">Tell the community about your latest cook, technique, or discovery!</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Post Title *</label>
              <input
                type="text" id="title" name="title" required
                value={formData.title} onChange={handleChange}
                placeholder="e.g., Perfect Brisket Bark - My Secret Method"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                id="category" name="category"
                value={formData.category} onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="general">General Discussion</option>
                <option value="techniques">Techniques & Tips</option>
                <option value="equipment">Equipment Reviews</option>
                <option value="recipes">Recipe Sharing</option>
                <option value="competition">Competition BBQ</option>
                <option value="beginners">Beginner Help</option>
                <option value="showoff">Show Off Your Cooks</option>
              </select>
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">Your Story *</label>
              <textarea
                id="content" name="content" required rows={8}
                value={formData.content} onChange={handleChange}
                placeholder="Share your experience, technique, or ask for advice..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">Tags (optional)</label>
              <div className="relative">
                <Tag className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text" id="tags" name="tags"
                  value={formData.tags} onChange={handleChange}
                  placeholder="brisket, smoking, wood, rub (comma-separated)"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Link href="/community" className="px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
                Cancel
              </Link>
              <button
                type="submit" disabled={submitting}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors font-semibold"
              >
                {submitting ? 'Posting...' : 'Share Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
