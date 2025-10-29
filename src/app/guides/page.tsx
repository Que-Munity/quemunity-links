'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, BookOpen, Users, TrendingUp, Heart, Search, Filter, X } from 'lucide-react';
import FeaturedRecipes from '@/components/FeaturedRecipes';

interface Guide {
  id: number;
  title: string;
  description: string;
  image: string;
  readTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  tags: string[];
  author: string;
  views: number;
}

const guides: Guide[] = [
  {
    id: 1,
    title: "BBQ Smoking 101: Complete Beginner's Guide",
    description: "Master the fundamentals of low and slow BBQ smoking with this comprehensive starter guide covering equipment, techniques, and your first cook.",
    image: "/images/guides/bbq-basics.jpg",
    readTime: "20 min read",
    difficulty: "Beginner",
    category: "Fundamentals",
    tags: ["smoking", "basics", "temperature", "equipment"],
    author: "Mike 'Pitmaster' Johnson",
    views: 25847
  },
  {
    id: 2,
    title: "Perfect Brisket: Texas Style Mastery",
    description: "Master the holy grail of BBQ with this comprehensive guide to smoking championship-quality brisket using traditional Texas techniques.",
    image: "/images/guides/brisket-guide.jpg",
    readTime: "25 min read",
    difficulty: "Advanced",
    category: "Beef",
    tags: ["brisket", "texas", "beef", "advanced"],
    author: "Aaron Franklin",
    views: 18592
  },
  {
    id: 3,
    title: "Competition-Style BBQ Ribs: The 3-2-1 Method",
    description: "Learn the famous 3-2-1 method and competition techniques for perfect fall-off-the-bone ribs that win contests.",
    image: "/images/guides/ribs-guide.jpg",
    readTime: "18 min read",
    difficulty: "Intermediate",
    category: "Pork",
    tags: ["ribs", "pork", "competition", "3-2-1"],
    author: "Malcom Reed",
    views: 22134
  },
  {
    id: 4,
    title: "Wood Selection Guide: Flavor Profiles & Pairing",
    description: "Discover how different wood types affect flavor and learn the perfect pairings for various meats and cooking styles.",
    image: "/images/guides/wood-guide.jpg",
    readTime: "15 min read",
    difficulty: "Beginner",
    category: "Fundamentals",
    tags: ["wood", "flavor", "pairing", "smoking"],
    author: "John Smith",
    views: 14782
  },
  {
    id: 5,
    title: "Pulled Pork Perfection: Boston Butt Mastery",
    description: "From selection to serving, master every step of creating succulent, competition-quality pulled pork that falls apart with a fork.",
    image: "/images/guides/pulled-pork.jpg",
    readTime: "22 min read",
    difficulty: "Intermediate",
    category: "Pork",
    tags: ["pulled pork", "pork shoulder", "boston butt"],
    author: "BBQ Betty",
    views: 19456
  },
  {
    id: 6,
    title: "Chicken & Poultry: Safe Smoking Techniques",
    description: "Master the art of smoking chicken, turkey, and other poultry safely while achieving crispy skin and juicy meat.",
    image: "/images/guides/chicken-guide.jpg",
    readTime: "16 min read",
    difficulty: "Beginner",
    category: "Poultry",
    tags: ["chicken", "poultry", "safety", "crispy skin"],
    author: "Chef Rodriguez",
    views: 11298
  }
];

export default function GuidesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('bbq-guide-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('bbq-guide-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (guideId: number) => {
    setFavorites(prev => 
      prev.includes(guideId) 
        ? prev.filter(id => id !== guideId)
        : [...prev, guideId]
    );
  };

  const categories = ['All', 'Fundamentals', 'Beef', 'Pork', 'Poultry'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Enhanced filtering logic
  const filteredGuides = guides.filter(guide => {
    // Category filter
    if (selectedCategory !== 'All' && guide.category !== selectedCategory) {
      return false;
    }
    
    // Difficulty filter
    if (selectedDifficulty !== 'All' && guide.difficulty !== selectedDifficulty) {
      return false;
    }
    
    // Search term filter (title, description, tags, author)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        guide.title.toLowerCase().includes(searchLower) ||
        guide.description.toLowerCase().includes(searchLower) ||
        guide.author.toLowerCase().includes(searchLower) ||
        guide.tags.some(tag => tag.toLowerCase().includes(searchLower));
      
      if (!matchesSearch) return false;
    }
    
    // Favorites filter
    if (showFavoritesOnly && !favorites.includes(guide.id)) {
      return false;
    }
    
    return true;
  });

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSelectedDifficulty('All');
    setSearchTerm('');
    setShowFavoritesOnly(false);
  };

  const hasActiveFilters = selectedCategory !== 'All' || selectedDifficulty !== 'All' || searchTerm || showFavoritesOnly;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">BBQ Guides & Techniques</h1>
              <p className="text-gray-600 mt-2">Master the art of BBQ with our comprehensive guides</p>
            </div>
            <div className="flex items-center space-x-4">
              <BookOpen className="w-8 h-8 text-orange-600" />
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{guides.length}</div>
                <div className="text-sm text-gray-600">Expert Guides</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Ad Space - Top Banner */}
        <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-lg p-6 mb-8 text-center border-2 border-dashed border-orange-300">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">🔥 Premium BBQ Equipment</h3>
          <p className="text-gray-600 text-sm">Sponsored Content - Your ads here reach serious BBQ enthusiasts</p>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search guides by title, author, or tags..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-4 items-center">
            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Category:</span>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Difficulty:</span>
              <div className="flex flex-wrap gap-2">
                {difficulties.map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedDifficulty === difficulty
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            </div>

            {/* Favorites Toggle */}
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                showFavoritesOnly
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
              <span>Favorites Only ({favorites.length})</span>
            </button>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-orange-600 hover:text-orange-700 text-sm font-medium"
              >
                Clear All Filters
              </button>
            )}
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredGuides.length} of {guides.length} guides
            {hasActiveFilters && ' (filtered)'}
          </div>
        </div>

        {/* Guides Grid */}
        {filteredGuides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map((guide, index) => (
              <React.Fragment key={guide.id}>
                {/* Insert ad after every 3rd guide */}
                {index === 3 && (
                  <div className="bg-yellow-50 rounded-lg p-6 border-2 border-dashed border-yellow-300 flex items-center justify-center">
                    <div className="text-center">
                      <h4 className="font-semibold text-gray-700 mb-2">🌟 Featured Sponsor</h4>
                      <p className="text-sm text-gray-600">Premium ad placement</p>
                    </div>
                  </div>
                )}
                {/* Original guide card */}
            <div key={guide.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow relative">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleFavorite(guide.id);
                }}
                className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-colors ${
                  favorites.includes(guide.id)
                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                    : 'bg-white bg-opacity-90 text-gray-400 hover:text-red-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${favorites.includes(guide.id) ? 'fill-current' : ''}`} />
              </button>

              <Link href={`/guides/${guide.id}`} className="block">
                <div className="h-48 bg-gray-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    Guide Image
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="bg-white bg-opacity-90 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                      {guide.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{guide.title}</h3>
                  <p className="text-gray-600 mb-4">{guide.description}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {guide.readTime}
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {guide.views.toLocaleString()} views
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">by {guide.author}</div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      guide.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                      guide.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {guide.difficulty}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
              </React.Fragment>
            ))}
          </div>
        ) : (
          /* No Results State */
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No guides found</h3>
            <p className="text-gray-500 mb-6">
              {hasActiveFilters 
                ? "Try adjusting your filters or search terms"
                : "No guides match your current criteria"
              }
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}

        {/* Featured Recipes */}
        <FeaturedRecipes />
      </div>
    </div>
  );
}