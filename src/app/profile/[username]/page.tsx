"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChefHat, Clock, Users, Star, Calendar, Plus, X } from 'lucide-react';
import SimpleUserNav from '@/components/SimpleUserNav';

export default function UserProfilePage({ params }: { params: { username: string } }) {
  const clientParams = useParams();
  const paramsObj = (clientParams || params) as { username: string };
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [profileUser, setProfileUser] = useState<any>(null);
  const [userRecipes, setUserRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    // Get current logged-in user
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }

    // Get profile user's data
  const userProfileKey = `userProfile_${paramsObj.username}`;
    const userProfile = localStorage.getItem(userProfileKey);
    
    if (userProfile) {
      const profile = JSON.parse(userProfile);
  setProfileUser({ username: paramsObj.username, ...profile });
      setUserRecipes(profile.recipes || []);
    } else {
      // Create a basic profile if none exists
      setProfileUser({
        username: paramsObj.username,
        joinDate: new Date().toISOString(),
        recipesCount: 0,
        bio: `BBQ enthusiast and member of the Que-Munity!`
      });
      setUserRecipes([]);
    }
    
    setLoading(false);
  }, [paramsObj.username]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const isOwnProfile = currentUser && currentUser.username === paramsObj.username;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <SimpleUserNav />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/* Profile Avatar */}
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mr-6">
                <span className="text-3xl font-bold text-orange-800">
                  {profileUser.username.charAt(0).toUpperCase()}
                </span>
              </div>
              
              {/* Profile Info */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{profileUser.username}</h1>
                <p className="text-gray-600 mt-2">{profileUser.bio || 'BBQ enthusiast and member of the Que-Munity!'}</p>
                <div className="flex items-center mt-3 text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Joined {formatDate(profileUser.joinDate || new Date().toISOString())}</span>
                  <span className="mx-4">•</span>
                  <ChefHat className="h-4 w-4 mr-2" />
                  <span>{userRecipes.length} recipes</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isOwnProfile && (
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {showCreateForm ? 'Cancel' : 'Create Recipe'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Create Recipe Form */}
        {showCreateForm && isOwnProfile && (
          <CreateRecipeForm 
            onRecipeCreated={(newRecipe) => {
              setUserRecipes([newRecipe, ...userRecipes]);
              setShowCreateForm(false);
              
              // Save to localStorage
              const userProfileKey = `userProfile_${currentUser.username}`;
              const userProfile = localStorage.getItem(userProfileKey)
                ? JSON.parse(localStorage.getItem(userProfileKey)!)
                : { recipes: [] };
              
              userProfile.recipes = [newRecipe, ...(userProfile.recipes || [])];
              localStorage.setItem(userProfileKey, JSON.stringify(userProfile));
            }}
            onCancel={() => setShowCreateForm(false)}
          />
        )}

        {/* User's Recipes */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {isOwnProfile ? 'My Recipes' : `${profileUser.username}'s Recipes`}
            </h2>
          </div>

          {userRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userRecipes.map((recipe) => (
                <div key={recipe.id} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                  {/* Recipe Image */}
                  <div className="bg-gradient-to-br from-orange-400 to-red-500 h-48 flex items-center justify-center">
                    <ChefHat className="h-16 w-16 text-white opacity-80" />
                  </div>

                  {/* Recipe Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{recipe.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{recipe.description}</p>

                    {/* Recipe Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{formatTime(recipe.cookTime)}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{recipe.servings} servings</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-2 text-yellow-400" />
                        <span>{recipe.avgRating > 0 ? recipe.avgRating.toFixed(1) : 'New'}</span>
                      </div>
                      <div className="text-orange-600 font-medium">
                        {recipe.difficulty}
                      </div>
                    </div>

                    {/* View Recipe Button */}
                    <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors">
                      View Recipe
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ChefHat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {isOwnProfile ? 'No recipes yet!' : `${profileUser.username} hasn't shared any recipes yet.`}
              </h3>
              <p className="text-gray-600 mb-6">
                {isOwnProfile 
                  ? 'Share your first BBQ masterpiece with the community.'
                  : 'Check back later for delicious recipes!'
                }
              </p>
              {isOwnProfile && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 inline-flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Recipe
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Create Recipe Form Component
function CreateRecipeForm({ onRecipeCreated, onCancel }: {
  onRecipeCreated: (recipe: any) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [smokingWood, setSmokingWood] = useState('Oak');
  const [smokerTemp, setSmokerTemp] = useState('');
  const [tempUnit, setTempUnit] = useState('F');
  const [cookingMethod, setCookingMethod] = useState('Smoking');
  const [customCookingMethod, setCustomCookingMethod] = useState('');
  
  // Dynamic arrays for ingredients and instructions
  const [ingredients, setIngredients] = useState(['']);
  const [instructions, setInstructions] = useState(['']);

  // Helper functions for dynamic arrays
  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const addInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const updateInstruction = (index: number, value: string) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validIngredients = ingredients.filter(ing => ing.trim());
    const validInstructions = instructions.filter(inst => inst.trim());
    
    if (!title.trim() || validIngredients.length === 0 || validInstructions.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      alert('Please sign in to create a recipe');
      return;
    }

    const user = JSON.parse(currentUser);
    const recipe = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      prepTime: Number(prepTime) || 30,
      cookTime: Number(cookTime) || 240,
      servings: Number(servings) || 4,
      difficulty,
      smokingWood,
      smokerTemp: `${smokerTemp}°${tempUnit}`,
      cookingMethod: cookingMethod === 'Other' ? customCookingMethod : cookingMethod,
      ingredients: validIngredients,
      instructions: validInstructions,
      avgRating: 0,
      totalReviews: 0,
      author: { 
        username: user.username,
        id: user.id || user.username 
      },
      createdAt: new Date().toISOString()
    };

    onRecipeCreated(recipe);
    
    // Reset form
    setTitle('');
    setDescription('');
    setPrepTime('');
    setCookTime('');
    setServings('');
    setDifficulty('Medium');
    setSmokingWood('Oak');
    setSmokerTemp('');
    setTempUnit('F');
    setCookingMethod('Smoking');
    setCustomCookingMethod('');
    setIngredients(['']);
    setInstructions(['']);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Create New Recipe</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Recipe Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recipe Basics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Recipe Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Perfect Smoked Brisket"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your BBQ masterpiece..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prep Time (min)</label>
              <input
                type="number"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                onFocus={(e) => e.target.select()}
                placeholder="30"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cook Time (min)</label>
              <input
                type="number"
                value={cookTime}
                onChange={(e) => setCookTime(e.target.value)}
                onFocus={(e) => e.target.select()}
                placeholder="240"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Servings</label>
              <input
                type="number"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                onFocus={(e) => e.target.select()}
                placeholder="4"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>
        </div>

        {/* BBQ Specific Settings */}
        <div className="bg-orange-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">BBQ Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cooking Method</label>
                <select
                  value={cookingMethod}
                  onChange={(e) => setCookingMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="Smoking">Smoking</option>
                  <option value="Grilling">Grilling</option>
                  <option value="Roasting">Roasting</option>
                  <option value="Braising">Braising</option>
                  <option value="Seasoning">Seasoning</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Custom cooking method input when "Other" is selected */}
              {cookingMethod === 'Other' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Custom Cooking Method</label>
                  <input
                    type="text"
                    value={customCookingMethod}
                    onChange={(e) => setCustomCookingMethod(e.target.value)}
                    placeholder="Enter your cooking method..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Smoking Wood</label>
                <select
                  value={smokingWood}
                  onChange={(e) => setSmokingWood(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="N/A">N/A</option>
                  <option value="Oak">Oak</option>
                  <option value="Hickory">Hickory</option>
                  <option value="Apple">Apple</option>
                  <option value="Cherry">Cherry</option>
                  <option value="Mesquite">Mesquite</option>
                  <option value="Pecan">Pecan</option>
                  <option value="Maple">Maple</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Temperature</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={smokerTemp}
                    onChange={(e) => setSmokerTemp(e.target.value)}
                    onFocus={(e) => e.target.select()}
                    placeholder="225"
                    min="0"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">°</span>
                    <select
                      value={tempUnit}
                      onChange={(e) => setTempUnit(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="F">F</option>
                      <option value="C">C</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Ingredients */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Ingredients *</h3>
            <button
              type="button"
              onClick={addIngredient}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center text-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Ingredient
            </button>
          </div>
          
          <div className="space-y-2">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center space-x-3">
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) => updateIngredient(index, e.target.value)}
                  placeholder="e.g., 1 whole packer brisket (12-15 lbs)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Instructions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Instructions *</h3>
            <button
              type="button"
              onClick={addInstruction}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center text-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Step
            </button>
          </div>
          
          <div className="space-y-3">
            {instructions.map((instruction, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">Step {index + 1}</span>
                  {instructions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInstruction(index)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <textarea
                  value={instruction}
                  onChange={(e) => updateInstruction(index, e.target.value)}
                  placeholder="Describe this cooking step in detail..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Create Recipe
          </button>
        </div>
      </form>
    </div>
  );
}