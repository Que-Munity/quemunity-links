'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, Clock, Users, Star, ChefHat } from 'lucide-react';
import UserNav from '@/components/UserNav';

interface Recipe {
  id: string;
  title: string;
  description: string;
  cookTime: number;
  servings: number;
  difficulty: string;
  avgRating: number;
  totalReviews: number;
  cookingMethod: string;
  smokingWood?: string;
  author: {
    username: string;
  };
  tags: {
    tag: {
      name: string;
    };
  }[];
}

const categories = ['All', 'Beef', 'Pork', 'Chicken', 'Ribs', 'Sides', 'Sauces', 'Seasonings'];
const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
const cookingMethods = ['All', 'Charcoal Grill', 'Gas Grill', 'Pellet Smoker', 'Offset Smoker', 'Electric Smoker', 'Kamado', 'Other'];
const woodTypes = ['All', 'Apple', 'Cherry', 'Hickory', 'Mesquite', 'Oak', 'Pecan', 'Maple'];
const cookTimes = ['All', 'Under 2 hours', '2-4 hours', '4-8 hours', '8+ hours'];

export default function RecipesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedCookingMethod, setSelectedCookingMethod] = useState('All');
  const [selectedWoodType, setSelectedWoodType] = useState('All');
  const [selectedCookTime, setSelectedCookTime] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch recipes from API
  useEffect(() => {
    async function fetchRecipes() {
      try {
        setLoading(true);
        const response = await fetch('/api/recipes');
        if (response.ok) {
          const data = await response.json();
          setRecipes(data.recipes || []);
        } else {
          console.error('Failed to fetch recipes');
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchRecipes();
  }, []);

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedDifficulty('All');
    setSelectedCookingMethod('All');
    setSelectedWoodType('All');
    setSelectedCookTime('All');
    setSortBy('newest');
  };

  const filteredAndSortedRecipes = recipes
    .filter(recipe => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           recipe.tags.some(recipeTag => recipeTag.tag.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All' || 
                             recipe.tags.some(recipeTag => 
                               recipeTag.tag.name.toLowerCase().includes(selectedCategory.toLowerCase())
                             );
      
      const matchesDifficulty = selectedDifficulty === 'All' || recipe.difficulty === selectedDifficulty.toUpperCase();
      
      const matchesCookingMethod = selectedCookingMethod === 'All' || recipe.cookingMethod === selectedCookingMethod.toUpperCase().replace(/\s+/g, '_');
      
      const matchesWoodType = selectedWoodType === 'All' || recipe.smokingWood?.toLowerCase().includes(selectedWoodType.toLowerCase());
      
      const matchesCookTime = selectedCookTime === 'All' || (() => {
        const cookTime = recipe.cookTime;
        switch (selectedCookTime) {
          case 'Under 2 hours': return cookTime < 120;
          case '2-4 hours': return cookTime >= 120 && cookTime < 240;
          case '4-8 hours': return cookTime >= 240 && cookTime < 480;
          case '8+ hours': return cookTime >= 480;
          default: return true;
        }
      })();

      return matchesSearch && matchesCategory && matchesDifficulty && matchesCookingMethod && matchesWoodType && matchesCookTime;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating': return (b.avgRating || 0) - (a.avgRating || 0);
        case 'cookTime': return a.cookTime - b.cookTime;
        case 'title': return a.title.localeCompare(b.title);
        case 'newest':
        default: return b.id.localeCompare(a.id);
      }
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center">
              <h1 className="text-3xl font-bold text-orange-600">Que-Munity</h1>
            </Link>
            <div className="flex items-center space-x-8">
              <nav className="hidden md:flex space-x-8">
                <Link href="/recipes" className="text-orange-600 font-semibold">Recipes</Link>
                <Link href="/guides" className="text-gray-700 hover:text-orange-600">Guides</Link>
                <Link href="/community" className="text-gray-700 hover:text-orange-600">Que-Munity</Link>
                <Link href="/tools" className="text-gray-700 hover:text-orange-600">Tools</Link>
              </nav>
              <UserNav />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">BBQ Recipes</h1>
            <p className="text-xl text-gray-600">
              Discover {recipes.length} authentic barbecue recipes from pitmasters around the world
              {searchTerm || selectedCategory !== 'All' || selectedDifficulty !== 'All' || selectedCookingMethod !== 'All' || selectedWoodType !== 'All' || selectedCookTime !== 'All' 
                ? ` • ${filteredAndSortedRecipes.length} matching recipes` 
                : ''}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              href="/recipes/create"
              className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
            >
              <ChefHat className="w-5 h-5 mr-2" />
              Share Your Recipe
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search recipes, ingredients, or techniques..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </button>

            {/* Sort Options */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="rating">Highest Rated</option>
                <option value="cookTime">Cook Time</option>
                <option value="title">A-Z</option>
              </select>
            </div>
          </div>

          {/* Enhanced Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {difficulties.map(difficulty => (
                      <option key={difficulty} value={difficulty}>{difficulty}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cooking Method</label>
                  <select
                    value={selectedCookingMethod}
                    onChange={(e) => setSelectedCookingMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {cookingMethods.map(method => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Wood Type</label>
                  <select
                    value={selectedWoodType}
                    onChange={(e) => setSelectedWoodType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {woodTypes.map(wood => (
                      <option key={wood} value={wood}>{wood}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cook Time</label>
                  <select
                    value={selectedCookTime}
                    onChange={(e) => setSelectedCookTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {cookTimes.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={clearAllFilters}
                    className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredAndSortedRecipes.length} of {recipes.length} recipes
          </p>
        </div>

        {/* Recipe Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading delicious recipes...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedRecipes.map((recipe) => (
              <Link key={recipe.id} href={`/recipes/${recipe.id}`}>
                <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="aspect-video bg-gradient-to-br from-orange-100 to-amber-100 rounded-t-lg flex items-center justify-center">
                    <ChefHat className="w-12 h-12 text-orange-600" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{recipe.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{recipe.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          <span className="text-sm">{recipe.cookTime} min</span>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Users className="w-4 h-4 mr-1" />
                          <span className="text-sm">{recipe.servings} servings</span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        recipe.difficulty === 'EASY' ? 'bg-green-100 text-green-800' :
                        recipe.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {recipe.difficulty}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= (recipe.avgRating || 0)
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 ml-2">
                          ({recipe.totalReviews || 0})
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">
                        by {recipe.author.username}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredAndSortedRecipes.length === 0 && recipes.length > 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No recipes found matching your criteria.</p>
            <button
              onClick={clearAllFilters}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}