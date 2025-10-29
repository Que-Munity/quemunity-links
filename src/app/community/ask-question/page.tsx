'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, HelpCircle, Tag, AlertCircle } from 'lucide-react';

export default function AskQuestionPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    problem: '',
    details: '',
    urgency: 'normal',
    category: 'general',
    tags: ''
  });
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    } else {
      router.push('/auth/login');
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create question data
    const questionData = {
      id: Date.now().toString(),
      title: formData.title,
      problem: formData.problem,
      details: formData.details,
      urgency: formData.urgency,
      category: formData.category,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      author: currentUser?.username || 'Anonymous',
      authorId: currentUser?.id,
      createdAt: new Date().toISOString(),
      votes: 0,
      answers: 0,
      type: 'question'
    };

    // Save to localStorage for now (later we'll use a real database)
    const existingPosts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
    existingPosts.unshift(questionData);
    localStorage.setItem('communityPosts', JSON.stringify(existingPosts));

    // Redirect to community page
    router.push('/community');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/community" 
            className="flex items-center text-gray-600 hover:text-orange-600 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Community
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Ask for Help</h1>
          <p className="text-gray-600 mt-2">Get expert advice from experienced pitmasters in the community!</p>
        </div>

        {/* Tips Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <HelpCircle className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-blue-800 font-medium mb-2">Tips for getting great answers:</h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Be specific about your problem or question</li>
                <li>• Include details about your equipment, temperature, timing, etc.</li>
                <li>• Mention what you've already tried</li>
                <li>• Add photos if possible (coming soon!)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Question Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., My brisket keeps coming out dry - what am I doing wrong?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Problem Summary */}
            <div>
              <label htmlFor="problem" className="block text-sm font-medium text-gray-700 mb-2">
                Problem Summary *
              </label>
              <textarea
                id="problem"
                name="problem"
                required
                rows={3}
                value={formData.problem}
                onChange={handleInputChange}
                placeholder="Briefly describe what's going wrong or what you need help with..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Detailed Description */}
            <div>
              <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Description *
              </label>
              <textarea
                id="details"
                name="details"
                required
                rows={6}
                value={formData.details}
                onChange={handleInputChange}
                placeholder="Include specific details: equipment used, temperatures, timing, rubs/marinades, wood types, weather conditions, what you've tried before, etc."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="general">General Help</option>
                  <option value="techniques">Technique Problems</option>
                  <option value="equipment">Equipment Issues</option>
                  <option value="temperature">Temperature Control</option>
                  <option value="timing">Timing & Planning</option>
                  <option value="troubleshooting">Troubleshooting</option>
                  <option value="beginners">Beginner Questions</option>
                </select>
              </div>

              {/* Urgency */}
              <div>
                <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-2">
                  Urgency
                </label>
                <select
                  id="urgency"
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="low">Low - Planning ahead</option>
                  <option value="normal">Normal - This week</option>
                  <option value="high">High - Cooking today</option>
                  <option value="urgent">Urgent - Cooking now!</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags (optional)
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="brisket, dry, temperature, weber (separate with commas)"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Link
                href="/community"
                className="px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold flex items-center gap-2"
              >
                <AlertCircle className="w-5 h-5" />
                Ask for Help
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}