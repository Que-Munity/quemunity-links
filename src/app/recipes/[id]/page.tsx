'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Clock, Users, Star, ChefHat, Thermometer, TreePine, Printer, Heart, Share2 } from 'lucide-react';
import RecipeReviews from '@/components/RecipeReviews';
import { initializeSampleReviews } from '@/utils/sampleReviews';

// Recipe data that matches the main recipes page
const recipeData = {
  '1': {
    id: '1',
    title: 'Perfect Smoked Brisket',
    description: 'Low and slow Texas-style brisket with a beautiful bark and tender interior. This recipe will teach you how to achieve the perfect smoke ring and that coveted bark that makes brisket legendary.',
    cookTime: 720, // 12 hours
    prepTime: 60, // 1 hour
    servings: 8,
    difficulty: 'Hard',
    avgRating: 4.8,
    totalReviews: 156,
    smokingWood: 'Oak',
    smokerTemp: '225°F',
    author: { username: 'BBQPitmaster' },
    ingredients: [
      '1 whole packer brisket (12-15 lbs)',
      '1/4 cup kosher salt',
      '1/4 cup coarse black pepper',
      '2 tbsp garlic powder',
      '2 tbsp onion powder',
      '1 tbsp paprika',
      '1 tsp cayenne pepper (optional)',
      'Oak wood chunks or chips'
    ],
    instructions: [
      'Trim the brisket fat cap to 1/4 inch thickness. Remove any silver skin from the meat side.',
      'Mix all dry rub ingredients in a bowl. Apply generously to all surfaces of the brisket.',
      'Wrap in plastic wrap and refrigerate for 12-24 hours to allow the rub to penetrate.',
      'Remove brisket from refrigerator 1 hour before cooking to bring to room temperature.',
      'Preheat your smoker to 225°F and add oak wood for smoke.',
      'Place brisket fat-side down on the smoker grates. Insert probe thermometer into thickest part.',
      'Smoke for 6-8 hours until internal temperature reaches 165°F (the stall).',
      'Wrap brisket in butcher paper or foil. Return to smoker.',
      'Continue cooking until internal temperature reaches 203°F (probe should slide in like butter).',
      'Remove from smoker and let rest for 2 hours before slicing against the grain.'
    ]
  },
  '2': {
    id: '2',
    title: 'Smoked Pulled Pork',
    description: 'Juicy Boston butt smoked to perfection and pulled for sandwiches. This recipe creates tender, flavorful pork that falls apart with a fork.',
    cookTime: 480, // 8 hours
    prepTime: 30,
    servings: 12,
    difficulty: 'Medium',
    avgRating: 4.7,
    totalReviews: 203,
    smokingWood: 'Apple',
    smokerTemp: '225°F',
    author: { username: 'SmokeKing' },
    ingredients: [
      '1 Boston butt (6-8 lbs)',
      '3 tbsp brown sugar',
      '2 tbsp paprika',
      '1 tbsp salt',
      '1 tbsp garlic powder',
      '1 tsp cayenne pepper',
      'Apple wood chips'
    ],
    instructions: [
      'Mix all dry ingredients for rub.',
      'Apply rub generously and let sit overnight.',
      'Preheat smoker to 225°F with apple wood.',
      'Smoke for 6-8 hours until internal temp reaches 195°F.',
      'Wrap in foil if bark gets too dark.',
      'Rest for 30 minutes before pulling.',
      'Pull apart with forks and mix with juices.'
    ]
  },
  '3': {
    id: '3',
    title: 'BBQ Chicken Wings',
    description: 'Crispy skin chicken wings with a sweet and spicy glaze. Perfect for game day or any BBQ gathering.',
    cookTime: 90,
    prepTime: 15,
    servings: 4,
    difficulty: 'Easy',
    avgRating: 4.6,
    totalReviews: 89,
    smokingWood: 'Cherry',
    smokerTemp: '275°F',
    author: { username: 'WingMaster' },
    ingredients: [
      '2 lbs chicken wings',
      '2 tbsp olive oil',
      '1 tbsp paprika',
      '1 tsp garlic powder',
      '1 tsp onion powder',
      '1/2 tsp cayenne pepper',
      '1/2 cup BBQ sauce'
    ],
    instructions: [
      'Pat wings dry and toss with olive oil.',
      'Season with dry rub ingredients.',
      'Preheat smoker to 275°F with cherry wood.',
      'Smoke wings for 60 minutes.',
      'Brush with BBQ sauce.',
      'Cook additional 30 minutes until crispy.',
      'Serve immediately while hot.'
    ]
  },
  '4': {
    id: '4',
    title: 'Smoked Ribs',
    description: 'Fall-off-the-bone baby back ribs with homemade dry rub. These ribs are competition-worthy and always a crowd pleaser.',
    cookTime: 360, // 6 hours
    prepTime: 45,
    servings: 6,
    difficulty: 'Medium',
    avgRating: 4.9,
    totalReviews: 312,
    smokingWood: 'Hickory',
    smokerTemp: '225°F',
    author: { username: 'RibExpert' },
    ingredients: [
      '2 racks baby back ribs',
      '1/4 cup brown sugar',
      '2 tbsp paprika',
      '1 tbsp chili powder',
      '1 tbsp salt',
      '1 tbsp black pepper',
      '1 tsp garlic powder',
      'Hickory wood chunks'
    ],
    instructions: [
      'Remove membrane from back of ribs.',
      'Mix dry rub ingredients thoroughly.',
      'Apply rub generously to both sides of ribs.',
      'Let ribs sit at room temperature for 1 hour.',
      'Preheat smoker to 225°F with hickory wood.',
      'Smoke ribs bone-side down for 3 hours.',
      'Wrap in foil with butter and brown sugar.',
      'Continue cooking for 2 hours.',
      'Unwrap and cook 1 more hour for bark.',
      'Rest for 15 minutes before cutting.'
    ]
  }
};

export default function RecipePage({ params }: { params: { id: string } }) {
  const clientParams = useParams();
  const paramsObj = (clientParams || params) as { id: string };
  const recipe = recipeData[paramsObj.id as keyof typeof recipeData];
  
  // Load existing reviews from localStorage for this recipe
  const getExistingReviews = () => {
    if (typeof window === 'undefined') return [];
    
    // Initialize sample reviews on first load
    initializeSampleReviews();
    
  const storageKey = `reviews_${paramsObj.id}`;
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : [];
  };

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Recipe Not Found</h1>
          <p className="text-gray-600 mb-6">The recipe you're looking for doesn't exist.</p>
          <Link 
            href="/recipes"
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700"
          >
            Back to Recipes
          </Link>
        </div>
      </div>
    );
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link 
            href="/recipes"
            className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Recipes
          </Link>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{recipe.title}</h1>
              <div className="flex items-center mt-2 space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                  <span className="font-medium">{recipe.avgRating}</span>
                  <span className="ml-1">({recipe.totalReviews} reviews)</span>
                </div>
                <span>by {recipe.author.username}</span>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-4 lg:mt-0">
              <button className="flex items-center px-3 py-2 text-gray-600 hover:text-orange-600">
                <Heart className="h-5 w-5 mr-1" />
                Save
              </button>
              <button className="flex items-center px-3 py-2 text-gray-600 hover:text-orange-600">
                <Share2 className="h-5 w-5 mr-1" />
                Share
              </button>
              <button className="flex items-center px-3 py-2 text-gray-600 hover:text-orange-600">
                <Printer className="h-5 w-5 mr-1" />
                Print
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Image */}
        <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-lg h-64 flex items-center justify-center mb-8">
          <ChefHat className="h-24 w-24 text-white opacity-80" />
        </div>

        {/* Recipe Stats */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-gray-50 p-4 rounded-lg">
              <Clock className="h-6 w-6 mx-auto mb-2 text-orange-600" />
              <div className="text-sm font-medium text-gray-900">Prep Time</div>
              <div className="text-lg font-bold text-orange-600">{formatTime(recipe.prepTime)}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <Clock className="h-6 w-6 mx-auto mb-2 text-orange-600" />
              <div className="text-sm font-medium text-gray-900">Cook Time</div>
              <div className="text-lg font-bold text-orange-600">{formatTime(recipe.cookTime)}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <Users className="h-6 w-6 mx-auto mb-2 text-orange-600" />
              <div className="text-sm font-medium text-gray-900">Servings</div>
              <div className="text-lg font-bold text-orange-600">{recipe.servings}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <Thermometer className="h-6 w-6 mx-auto mb-2 text-orange-600" />
              <div className="text-sm font-medium text-gray-900">Smoker Temp</div>
              <div className="text-lg font-bold text-orange-600">{recipe.smokerTemp}</div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Recipe</h2>
          <p className="text-gray-700 text-lg leading-relaxed">{recipe.description}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Ingredients */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Ingredients</h2>
              <ul className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start">
                    <input 
                      type="checkbox" 
                      className="mr-3 mt-1 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-gray-700">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Instructions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Instructions</h2>
              <ol className="space-y-6">
                {recipe.instructions.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <span className="bg-orange-600 text-white text-lg font-bold rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-gray-700 text-lg leading-relaxed">{step}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Additional Info */}
            <div className="bg-orange-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-orange-900 mb-4">🔥 Recipe Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-orange-800">Difficulty:</span>
                  <span className="ml-2 text-orange-700">{recipe.difficulty}</span>
                </div>
                <div>
                  <span className="font-medium text-orange-800">Wood Type:</span>
                  <span className="ml-2 text-orange-700">{recipe.smokingWood}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <RecipeReviews recipeId={recipe.id} existingReviews={getExistingReviews()} />
        </div>
      </div>
    </div>
  );
}