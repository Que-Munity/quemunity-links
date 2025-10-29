'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Clock, Users, Star, ChefHat, ArrowLeft } from 'lucide-react';

// Mock data for recipes
const mockRecipes = [
  {
    id: '1',
    title: 'Perfect Smoked Brisket',
    description: 'Low and slow Texas-style brisket with a beautiful bark and tender interior.',
    cookTime: 720, // 12 hours
    servings: 8,
    difficulty: 'Hard',
    avgRating: 4.8,
    totalReviews: 156,
    cookingMethod: 'Smoking',
    smokingWood: 'Oak',
    author: { username: 'BBQPitmaster' },
    image: '/api/placeholder/400/300',
    ingredients: [
      '1 whole packer brisket (12-15 lbs)',
      '1/4 cup kosher salt',
      '1/4 cup black pepper',
      '2 tbsp garlic powder',
      '2 tbsp onion powder'
    ],
    instructions: [
      'Trim the brisket, leaving 1/4 inch of fat',
      'Season generously with rub 12 hours before cooking',
      'Set smoker to 225°F with oak wood',
      'Smoke fat-side down for 6 hours',
      'Wrap in butcher paper when internal temp hits 165°F',
      'Continue cooking until internal temp reaches 203°F',
      'Rest for 2 hours before slicing'
    ]
  },
  {
    id: '2', 
    title: 'Smoked Pulled Pork',
    description: 'Juicy Boston butt smoked to perfection and pulled for sandwiches.',
    cookTime: 480, // 8 hours
    servings: 12,
    difficulty: 'Medium',
    avgRating: 4.7,
    totalReviews: 203,
    cookingMethod: 'Smoking',
    smokingWood: 'Apple',
    author: { username: 'SmokeKing' },
    image: '/api/placeholder/400/300',
    ingredients: [
      '1 Boston butt (6-8 lbs)',
      '3 tbsp brown sugar',
      '2 tbsp paprika',
      '1 tbsp salt',
      '1 tbsp garlic powder',
      '1 tsp cayenne pepper'
    ],
    instructions: [
      'Mix all dry ingredients for rub',
      'Apply rub generously and let sit overnight',
      'Preheat smoker to 225°F with apple wood',
      'Smoke for 6-8 hours until internal temp reaches 195°F',
      'Wrap in foil if bark gets too dark',
      'Rest for 30 minutes before pulling',
      'Pull apart with forks and mix with juices'
    ]
  },
  {
    id: '3',
    title: 'BBQ Chicken Wings',
    description: 'Crispy skin chicken wings with a sweet and spicy glaze.',
    cookTime: 90,
    servings: 4,
    difficulty: 'Easy',
    avgRating: 4.6,
    totalReviews: 89,
    cookingMethod: 'Grilling',
    smokingWood: 'Cherry',
    author: { username: 'WingMaster' },
    image: '/api/placeholder/400/300'
  },
  {
    id: '4',
    title: 'Smoked Ribs',
    description: 'Fall-off-the-bone baby back ribs with homemade dry rub.',
    cookTime: 360, // 6 hours
    servings: 6,
    difficulty: 'Medium',
    avgRating: 4.9,
    totalReviews: 312,
    cookingMethod: 'Smoking',
    smokingWood: 'Hickory',
    author: { username: 'RibExpert' },
    image: '/api/placeholder/400/300'
  }
];

export default function RecipesPage() {
  const [recipes] = useState(mockRecipes);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = !selectedDifficulty || recipe.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const formatCookTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4">
            <Link 
              href="/"
              className="inline-flex items-center text-orange-600 hover:text-orange-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">BBQ Recipes</h1>
          <p className="text-xl text-gray-600">Discover authentic barbecue recipes from pitmasters around the world</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search recipes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <div key={recipe.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                <ChefHat className="h-16 w-16 text-white opacity-80" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{recipe.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{recipe.description}</p>
                
                <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatCookTime(recipe.cookTime)}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {recipe.servings} servings
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                    recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {recipe.difficulty}
                  </span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm font-medium">{recipe.avgRating}</span>
                    <span className="ml-1 text-sm text-gray-500">({recipe.totalReviews})</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    by {recipe.author.username}
                  </div>
                  <Link 
                    href={`/recipes/${recipe.id}`}
                    className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors inline-block text-center"
                  >
                    View Recipe
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <div className="text-center py-12">
            <ChefHat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No recipes found</h3>
            <p className="text-gray-600">Try adjusting your search terms or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}