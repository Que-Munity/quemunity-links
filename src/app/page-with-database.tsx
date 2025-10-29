import Link from "next/link";
import { Search, Clock, Users, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";
import AdSenseAd from "@/components/AdSenseAd";

async function getFeaturedRecipes() {
  try {
    const recipes = await prisma.recipe.findMany({
      where: {
        isPublished: true,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
        images: {
          where: { isPrimary: true },
          take: 1,
        },
        ratings: true,
        _count: {
          select: {
            favorites: true,
            reviews: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 3,
    });

    // Calculate average ratings
    return recipes.map(recipe => {
      const avgRating = recipe.ratings.length > 0 
        ? recipe.ratings.reduce((sum, rating) => sum + rating.value, 0) / recipe.ratings.length 
        : 0;
      
      return {
        ...recipe,
        avgRating: Math.round(avgRating * 10) / 10,
        totalRatings: recipe.ratings.length,
        totalReviews: recipe._count.reviews,
        totalFavorites: recipe._count.favorites,
        cookTimeDisplay: `${Math.floor(recipe.cookTime / 60)}${recipe.cookTime % 60 > 0 ? `.5` : ''} hours`,
        ratings: undefined, // Remove raw ratings from response
      };
    });
  } catch (error) {
    console.error('Error fetching featured recipes:', error);
    return [];
  }
}

export default async function Home() {
  const featuredRecipes = await getFeaturedRecipes();

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100">


      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-orange-600">
            Master the Art of <span className="text-orange-500">BBQ</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover authentic barbecue recipes, smoking techniques, and join a community of pitmasters
            sharing their secrets for perfect low and slow cooking.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for brisket, ribs, pulled pork..."
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="flex items-center justify-center space-x-3">
              <Users className="w-8 h-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-orange-600">50K+</div>
                <div className="text-gray-600">BBQ Enthusiasts</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Clock className="w-8 h-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-orange-600">1,200+</div>
                <div className="text-gray-600">Tested Recipes</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <TrendingUp className="w-8 h-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-orange-600">4.9</div>
                <div className="text-gray-600">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Placement - Top Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdSenseAd 
          adSlot="7382728474"
          adFormat="auto"
          className="bg-gray-50 rounded-lg p-4"
        />
      </section>

      {/* Featured Recipes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-3xl font-bold mb-8 text-center text-orange-600">Featured Recipes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredRecipes.length > 0 ? featuredRecipes.map((recipe) => (
            <Link href={`/recipes/${recipe.id}`} key={recipe.id}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="h-48 bg-gradient-to-br from-orange-100 to-red-100 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🍖</div>
                      <div className="text-gray-600 font-medium">{recipe.title}</div>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      recipe.difficulty === 'EASY' ? 'bg-green-100 text-green-800' :
                      recipe.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {recipe.difficulty}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-semibold mb-2 text-orange-600">{recipe.title}</h4>
                  <p className="text-gray-600 mb-4 line-clamp-2">{recipe.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                    <span>⏱️ {recipe.cookTimeDisplay}</span>
                    <span>� {recipe.servings} servings</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span>⭐ {recipe.avgRating > 0 ? recipe.avgRating : 'New'}</span>
                      {recipe.totalRatings > 0 && (
                        <span className="ml-1">({recipe.totalRatings})</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      by {recipe.author.username}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-500 text-lg">No recipes found. Database might be empty.</p>
              <Link href="/recipes" className="mt-4 inline-block bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700">
                Browse All Recipes
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Ad Placement - Mid Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdSenseAd 
          adSlot="9128394756"
          adFormat="auto"
          className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto"
        />
      </section>

      {/* Footer */}
      <footer className="bg-orange-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4 text-orange-300">Que-Munity</h4>
              <p className="text-orange-200">The ultimate destination for BBQ enthusiasts and pitmasters.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-orange-300">Recipes</h4>
              <ul className="space-y-2 text-orange-200">
                <li><Link href="/recipes/beef" className="hover:text-orange-100 transition-colors">Beef</Link></li>
                <li><Link href="/recipes/pork" className="hover:text-orange-100 transition-colors">Pork</Link></li>
                <li><Link href="/recipes/chicken" className="hover:text-orange-100 transition-colors">Chicken</Link></li>
                <li><Link href="/recipes/sides" className="hover:text-orange-100 transition-colors">Sides</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-orange-300">Learn</h4>
              <ul className="space-y-2 text-orange-200">
                <li><Link href="/guides/smoking" className="hover:text-orange-100 transition-colors">Smoking Basics</Link></li>
                <li><Link href="/guides/wood-types" className="hover:text-orange-100 transition-colors">Wood Types</Link></li>
                <li><Link href="/guides/temperature" className="hover:text-orange-100 transition-colors">Temperature Guide</Link></li>
                <li><Link href="/guides/equipment" className="hover:text-orange-100 transition-colors">Equipment</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-orange-300">Que-Munity</h4>
              <ul className="space-y-2 text-orange-200">
                <li><Link href="/community/forums" className="hover:text-orange-100 transition-colors">Forums</Link></li>
                <li><Link href="/community/competitions" className="hover:text-orange-100 transition-colors">Competitions</Link></li>
                <li><Link href="/community/events" className="hover:text-orange-100 transition-colors">Events</Link></li>
                <li><Link href="/about" className="hover:text-orange-100 transition-colors">About Us</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-orange-700 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-orange-200">
              <p>&copy; 2024 Que-Munity. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link href="/privacy" className="hover:text-orange-100 transition-colors">Privacy Policy</Link>
                <Link href="/contact" className="hover:text-orange-100 transition-colors">Contact</Link>
                <Link href="/about" className="hover:text-orange-100 transition-colors">About</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
