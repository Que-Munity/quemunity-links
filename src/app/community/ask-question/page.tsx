'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, HelpCircle, Tag, AlertCircle } from 'lucide-react';

export default function AskQuestionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    problem: '',
    details: '',
    urgency: 'NORMAL',
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
          problem: formData.problem,
          details: formData.details,
          urgency: formData.urgency,
          category: formData.category,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
          type: 'QUESTION',
        }),
      });

      if (res.ok) {
        const post = await res.json();
        router.push(`/community/forum/${post.id}`);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to submit question');
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
          <h1 className="text-3xl font-bold text-gray-900">Ask for Help</h1>
          <p className="text-gray-600 mt-2">Get expert advice from experienced pitmasters in the community!</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <HelpCircle className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-blue-800 font-medium mb-2">Tips for getting great answers:</h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Be specific about your problem or question</li>
                <li>• Include details about your equipment, temperature, timing, etc.</li>
                <li>• Mention what you've already tried</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Question Title *</label>
              <input
                type="text" id="title" name="title" required
                value={formData.title} onChange={handleChange}
                placeholder="e.g., My brisket keeps coming out dry - what am I doing wrong?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="problem" className="block text-sm font-medium text-gray-700 mb-2">Problem Summary *</label>
              <textarea
                id="problem" name="problem" required rows={3}
                value={formData.problem} onChange={handleChange}
                placeholder="Briefly describe what's going wrong..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-2">Detailed Description *</label>
              <textarea
                id="details" name="details" required rows={6}
                value={formData.details} onChange={handleChange}
                placeholder="Include: equipment used, temperatures, timing, rubs/marinades, wood types, what you've tried before..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  id="category" name="category"
                  value={formData.category} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="general">General Help</option>
                  <option value="techniques">Technique Problems</option>
                  <option value="equipment">Equipment Issues</option>
                  <option value="troubleshooting">Troubleshooting</option>
                  <option value="beginners">Beginner Questions</option>
                </select>
              </div>
              <div>
                <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-2">Urgency</label>
                <select
                  id="urgency" name="urgency"
                  value={formData.urgency} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="LOW">Low - Planning ahead</option>
                  <option value="NORMAL">Normal - This week</option>
                  <option value="HIGH">High - Cooking today</option>
                  <option value="URGENT">Urgent - Cooking now!</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">Tags (optional)</label>
              <div className="relative">
                <Tag className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text" id="tags" name="tags"
                  value={formData.tags} onChange={handleChange}
                  placeholder="brisket, dry, temperature, weber (comma-separated)"
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
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors font-semibold flex items-center gap-2"
              >
                <AlertCircle className="w-5 h-5" />
                {submitting ? 'Submitting...' : 'Ask for Help'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
