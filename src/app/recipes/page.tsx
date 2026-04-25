'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, Filter, Clock, Users, Star, ChefHat, ArrowLeft, Plus } from 'lucide-react';

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
  smokingWood?: string | null;
  author: { username: string };
  primaryImage?: string | null;
}

// Static demo recipes (keep IDs 1-4 working)
const DEMO_RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Perfect Smoked Brisket',
    description: 'Low and slow Texas-style brisket with a beautiful bark and tender interior.',
    cookTime: 720, servings: 8, difficulty: 'HARD',
    avgRating: 4.8, totalReviews: 156,
    cookingMethod: 'SMOKING', smokingWood: 'Oak',
    author: { username: 'BBQPitmaster' },
  },
  {
    id: '2',
    title: 'Smoked Pulled Pork',
    description: 'Juicy Boston butt smoked to perfection and pulled for sandwiches.',
    cookTime: 480, servings: 12, difficulty: 'MEDIUM',
    avgRating: 4.7, totalReviews: 203,
    cookingMethod: 'SMOKING', smokingWood: 'Apple',
    author: { username: 'SmokeKing' },
  },
  {
    id: '3',
    title: 'BBQ Chicken Wings',
    description: 'Crispy skin chicken wings with a sweet and spicy glaze. Perfect for game day.',
    cookTime: 90, servings: 4, difficulty: 'EASY',
    avgRating: 4.6, totalReviews: 89,
    cookingMethod: 'SMOKING', smokingWood: 'Cherry',
    author: { username: 'WingMaster' },
  },
  {
    id: '4',
    title: 'Smoked Ribs',
    description: 'Fall-off-the-bone baby back ribs with homemade dry rub.',
    cookTime: 360, servings: 6, difficulty: 'MEDIUM',
    avgRating: 4.9, totalReviews: 312,
    cookingMethod: 'SMOKING', smokingWood: 'Hickory',
    author: { username: 'RibExpert' },
  },
];

function formatTime(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) return m > 0 ? `${h}h ${m}m` : `${h}h`;
  return `${m}m`;
}

function difficultyLabel(d: string) {
  return d.charAt(0) + d.slice(1).toLowerCase();
}

function difficultyColor(d: string) {
  if (d === 'EASY') return 'bg-green-100 text-green-800';
  if (d === 'MEDIUM') return 'bg-yellow-100 text-yellow-800';
  if (d === 'HARD') return 'bg-red-100 text-red-800';
  if (d === 'EXPERT') return 'bg-purple-100 text-purple-800';
  return 'bg-gray-100 text-gray-800';
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center relative overflow-hidden">
        {recipe.primaryImage ? (
          <img src={recipe.primaryImage} alt={recipe.title} className="w-full h-full object-cover" />
        ) : (
          <ChefHat className="h-16 w-16 text-white opacity-80" />
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{recipe.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{recipe.description}</p>

        <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {formatTime(recipe.cookTime)}
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {recipe.servings} servings
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColor(recipe.difficulty)}`}>
            {difficultyLabel(recipe.difficulty)}
          </span>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-medium">{recipe.avgRating.toFixed(1)}</span>
            <span className="ml-1 text-sm text-gray-500">({recipe.totalReviews})</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">by {recipe.author.username}</span>
          <Link
            href={`/recipes/${recipe.id}`}
            className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors text-sm"
          >
            View Recipe
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RecipesPage() {
  const [dbRecipes, setDbRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

  const fetchRecipes = useCallback(async () => {
    try {
      const params = new URLSearchParams({ limit: '100' });
      if (selectedDifficulty) params.set('difficulty', selectedDifficulty);
      if (searchTerm) params.set('search', searchTerm);

      const res = await fetch(`/api/recipes?${params}`);
      if (res.ok) {
        const data = await res.json();
        setDbRecipes(
          (data.recipes || []).map((r: any) => ({
            id: r.id,
            title: r.title,
            description: r.description,
            cookTime: r.cookTime,
            servings: r.servings,
            difficulty: r.difficulty,
            avgRating: r.avgRating ?? 0,
            totalReviews: r.totalReviews ?? 0,
            cookingMethod: r.cookingMethod,
            smokingWood: r.smokingWood,
            author: { username: r.author?.username ?? 'Unknown' },
            primaryImage: r.images?.[0]?.url ?? null,
          }))
        );
      }
    } catch (error) {
      console.error('Failed to load recipes:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedDifficulty, searchTerm]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  // Filter demo recipes client-side (they're not in the DB)
  const filteredDemo = DEMO_RECIPES.filter(r => {
    const matchSearch = !searchTerm ||
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDiff = !selectedDifficulty || r.difficulty === selectedDifficulty;
    return matchSearch && matchDiff;
  });

  // Combine: DB recipes first, then demos
  const allRecipes = [...dbRecipes, ...filteredDemo];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4">
            <Link href="/" className="inline-flex items-center text-orange-600 hover:text-orange-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">BBQ Recipes</h1>
              <p className="text-xl text-gray-600">Discover authentic barbecue recipes from pitmasters around the world</p>
            </div>
            <Link
              href="/recipes/create"
              className="flex items-center gap-2 bg-orange-600 text-white px-5 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              <Plus className="h-5 w-5" />
              Add Recipe
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div className="flex items-center gap-4">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedDifficulty}
                onChange={e => setSelectedDifficulty(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">All Difficulties</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
                <option value="EXPERT">Expert</option>
              </select>
            </div>
          </div>
        </div>

        {/* Recipe Count */}
        {!loading && (
          <p className="text-sm text-gray-500 mb-4">
            {allRecipes.length} recipe{allRecipes.length !== 1 ? 's' : ''} found
            {dbRecipes.length > 0 && (
              <span className="ml-2 text-orange-600 font-medium">• {dbRecipes.length} from the community</span>
            )}
          </p>
        )}

        {/* Recipe Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-full" />
                  <div className="h-4 bg-gray-100 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}

        {!loading && allRecipes.length === 0 && (
          <div className="text-center py-12">
            <ChefHat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No recipes found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or be the first to add one!</p>
            <Link href="/recipes/create" className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 font-medium">
              Create First Recipe
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
