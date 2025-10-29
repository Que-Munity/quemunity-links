'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, Star, Users, ChefHat, Flame } from 'lucide-react';

interface FeaturedRecipe {
  id: number;
  title: string;
  description: string;
  image: string;
  cookTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  reviewCount: number;
  author: string;
  tags: string[];
}

const featuredRecipes: FeaturedRecipe[] = [
  {
    id: 1,
    title: "Championship Brisket Rub",
    description: "Award-winning dry rub that's taken home 3 grand championships. The secret is in the coffee grounds and brown sugar ratio.",
    image: "/images/recipes/brisket-rub.jpg",
    cookTime: "30 min prep + 12-16 hr cook",
    difficulty: "Advanced",
    rating: 4.9,
    reviewCount: 847,
    author: "QueMunity",
    tags: ["brisket", "rub", "championship"]
  },
  {
    id: 2,
    title: "Perfect Pulled Pork Shoulder",
    description: "Foolproof method for juicy, tender pulled pork that falls apart with a fork. Works every time!",
    image: "/images/recipes/pulled-pork.jpg",
    cookTime: "8-10 hours",
    difficulty: "Intermediate",
    rating: 4.8,
    reviewCount: 1203,
    author: "QueMunity",
    tags: ["pork", "pulled-pork", "easy"]
  },
  {
    id: 3,
    title: "Competition Ribs (3-2-1 Method)",
    description: "The famous 3-2-1 method that produces tender, juicy ribs with perfect bark every time.",
    image: "/images/recipes/competition-ribs.jpg",
    cookTime: "6 hours",
    difficulty: "Intermediate",
    rating: 4.7,
    reviewCount: 956,
    author: "QueMunity",
    tags: ["ribs", "3-2-1", "competition"]
  },
  {
    id: 4,
    title: "Kansas City Burnt Ends",
    description: "The candy of BBQ! These cubed beef belly burnt ends are absolutely addictive.",
    image: "/images/recipes/burnt-ends.jpg",
    cookTime: "6-8 hours",
    difficulty: "Advanced",
    rating: 4.9,
    reviewCount: 678,
    author: "QueMunity",
    tags: ["burnt-ends", "beef", "candy"]
  }
];

export default function FeaturedRecipes() {
  const [recipes] = useState<FeaturedRecipe[]>(featuredRecipes);

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <ChefHat className="w-6 h-6 mr-2 text-orange-600" />
            Featured QueMunity Recipes
          </h2>
          <p className="text-gray-600 mt-1">
            Top-rated recipes from our community with proven results
          </p>
        </div>
        <Link 
          href="/recipes" 
          className="text-orange-600 hover:text-orange-700 font-medium"
        >
          View All Recipes →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="group cursor-pointer">
            <Link href={`/recipes/${recipe.id}`}>
              <div className="bg-gray-100 rounded-lg overflow-hidden mb-3 group-hover:shadow-md transition-shadow">
                {/* Recipe Image */}
                <div className="h-48 bg-gradient-to-br from-orange-200 to-red-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    <Flame className="w-12 h-12" />
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="bg-white bg-opacity-90 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                      {recipe.author}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      recipe.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                      recipe.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {recipe.difficulty}
                    </span>
                  </div>
                </div>

                {/* Recipe Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                    {recipe.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {recipe.description}
                  </p>

                  {/* Recipe Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {recipe.cookTime}
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                      {recipe.rating}
                    </div>
                  </div>

                  {/* Reviews */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="w-4 h-4 mr-1" />
                      {recipe.reviewCount.toLocaleString()} reviews
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {recipe.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-8 p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Want to submit your own recipe?
        </h3>
        <p className="text-gray-600 mb-4">
          Share your BBQ secrets with the community and build your reputation as a pitmaster
        </p>
        <Link 
          href="/recipes/create" 
          className="inline-block bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors"
        >
          Submit Recipe
        </Link>
      </div>
    </div>
  );
}