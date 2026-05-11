import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Flame, Heart, MessageCircle, Clock } from 'lucide-react';

async function getTrending() {
  try {
    const recipes = await prisma.recipe.findMany({
      where: { isPublished: true },
      include: {
        author: { select: { username: true, displayName: true } },
        images: { where: { isPrimary: true }, take: 1 },
        _count: { select: { favorites: true, comments: true, reviews: true } },
      },
      orderBy: [{ favorites: { _count: 'desc' } }, { totalViews: 'desc' }],
      take: 6,
    });
    return recipes;
  } catch {
    return [];
  }
}

function formatTime(mins: number) {
  if (mins < 60) return `${mins}m`;
  return `${Math.floor(mins / 60)}h ${mins % 60 > 0 ? `${mins % 60}m` : ''}`.trim();
}

const CATEGORY_EMOJI: Record<string, string> = {
  Beef: '🥩', Pork: '🐷', Poultry: '🍗', Seafood: '🦐',
  'Wild Game': '🦌', Sides: '🌽', Desserts: '🍮', Other: '🔥',
};

export default async function TrendingRecipes() {
  const recipes = await getTrending();

  if (recipes.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-6 h-6 text-orange-500" />
              <span className="text-sm font-semibold text-orange-500 uppercase tracking-wide">Trending Now</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Recipes</h2>
            <p className="text-gray-500 mt-1">Most loved by our QueMunity</p>
          </div>
          <Link href="/recipes" className="text-orange-600 font-semibold hover:text-orange-700 transition-colors hidden sm:block">
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe, i) => (
            <Link key={recipe.id} href={`/recipes/${recipe.id}`} className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden">
              {/* Image */}
              <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 relative overflow-hidden">
                {recipe.images[0]?.url ? (
                  <img src={recipe.images[0].url} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">
                    {CATEGORY_EMOJI[recipe.category] ?? '🔥'}
                  </div>
                )}
                {i < 3 && (
                  <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    #{i + 1} Trending
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                  {recipe.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1 group-hover:text-orange-600 transition-colors">
                  {recipe.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-3">{recipe.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4 text-red-400" />
                      {recipe._count.favorites}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4 text-blue-400" />
                      {recipe._count.comments + recipe._count.reviews}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatTime(recipe.cookTime)}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-orange-500">
                    {recipe.author.displayName ?? recipe.author.username}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8 sm:hidden">
          <Link href="/recipes" className="text-orange-600 font-semibold">View all recipes →</Link>
        </div>
      </div>
    </section>
  );
}
