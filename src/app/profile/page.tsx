'use client';

import { useState, useEffect } from "react";
import UserNav from "@/components/UserNav";
import Link from "next/link";
import { Utensils, Clock, Star, Edit, Settings, User } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user profile data from localStorage
    const storedUser = localStorage.getItem('currentUser');
    const storedProfile = localStorage.getItem('userProfile');
    
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      const profileData = storedProfile ? JSON.parse(storedProfile) : {};
      
      setUser({
        ...userData,
        ...profileData,
        recipes: [],
        ratings: [],
        reviews: []
      });
    } else {
      // Mock user data
      setUser({
        id: '1',
        email: 'user@example.com',
        username: 'BBQMaster',
        firstName: 'BBQ',
        lastName: 'Enthusiast',
        createdAt: new Date().toISOString(),
        bio: '',
        location: '',
        recipes: [],
        ratings: [],
        reviews: []
      });
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <UserNav />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="text-orange-600">Loading your profile...</div>
        </div>
      </div>
    );
  }

  const totalRecipes = user?.recipes?.length || 0;
  const totalRatings = user?.ratings?.length || 0;
  const averageRating = 4.5; // Mock rating

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <UserNav />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {user.username?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-6">
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                      {user.username || "BBQ Enthusiast"}
                    </h1>
                    {user.location && (
                      <p className="text-lg text-gray-600 mb-2">📍 {user.location}</p>
                    )}
                    {user.yearsExperience && (
                      <p className="text-gray-600 mb-2">🔥 {user.yearsExperience.charAt(0).toUpperCase() + user.yearsExperience.slice(1)} Level Pitmaster</p>
                    )}
                    <p className="text-gray-500">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                  
                  <Link
                    href="/profile/edit"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors font-medium"
                  >
                    <Edit className="w-5 h-5 mr-2" />
                    Edit Profile
                  </Link>
                </div>

                {/* Bio Section */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-800 leading-relaxed">
                    {user.bio || "Tell the Que-Munity about your BBQ journey, what got you started, your passion for smoking, and what makes your BBQ special..."}
                  </p>
                </div>

                {/* Equipment & Preferences */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Primary Setup</div>
                    <div className="font-semibold text-gray-900">
                      {user.smokerType || "Select your main setup..."}
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-amber-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Favorite Protein</div>
                    <div className="font-semibold text-gray-900">
                      {user.favoriteProtein || "What's your go-to?"}
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Signature Dish</div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {user.signature_dish || "18-hour beef brisket with coffee rub, Honey glazed ribs, etc."}
                    </div>
                  </div>
                </div>

                {/* Que-Master Skills */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Star className="w-5 h-5 text-orange-500" />
                    Que-Master Skills
                  </h3>
                  {user.queMasterSkills && user.queMasterSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.queMasterSkills.map((skill: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-orange-50 rounded-lg text-center">
                      <p className="text-gray-600 italic">Temperature Control • Smoke Management • Wood Pairing • Meat Selection • Timing Perfection • Fire Building</p>
                    </div>
                  )}
                </div>

                {/* BBQ Specialties */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-amber-500" />
                    BBQ Specialties
                  </h3>
                  {user.specialties && user.specialties.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.specialties.map((specialty: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-amber-50 rounded-lg text-center">
                      <p className="text-gray-600 italic">Brisket Master • Rib Specialist • Pulled Pork Pro • Wings Expert • Sauce Master • Dry Rub Expert</p>
                    </div>
                  )}
                </div>

                {/* Achievements */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <User className="w-5 h-5 text-yellow-500" />
                    Achievements & Competition History
                  </h3>
                  {user.achievements && user.achievements.length > 0 ? (
                    <div className="space-y-2">
                      {user.achievements.map((achievement: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                          <User className="w-4 h-4 text-yellow-600" />
                          <span className="text-gray-800">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-yellow-50 rounded-lg text-center">
                      <p className="text-gray-600 italic">1st Place Ribs - Austin BBQ Festival 2024 • Grand Champion - State Championship • Featured in BBQ Monthly Magazine</p>
                    </div>
                  )}
                </div>

                {/* Social Links */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Connect & Follow</h3>
                  {user.socialLinks && (user.socialLinks.instagram || user.socialLinks.youtube || user.socialLinks.tiktok) ? (
                    <div className="flex gap-3 flex-wrap">
                      {user.socialLinks.instagram && (
                        <a href={`https://instagram.com/${user.socialLinks.instagram.replace('@', '')}`} 
                           target="_blank" rel="noopener noreferrer"
                           className="px-4 py-2 bg-pink-100 text-pink-800 rounded-lg text-sm hover:bg-pink-200 transition-colors">
                          📸 Instagram
                        </a>
                      )}
                      {user.socialLinks.youtube && (
                        <a href={user.socialLinks.youtube} target="_blank" rel="noopener noreferrer"
                           className="px-4 py-2 bg-red-100 text-red-800 rounded-lg text-sm hover:bg-red-200 transition-colors">
                          🎥 YouTube
                        </a>
                      )}
                      {user.socialLinks.tiktok && (
                        <a href={`https://tiktok.com/${user.socialLinks.tiktok.replace('@', '')}`} 
                           target="_blank" rel="noopener noreferrer"
                           className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 transition-colors">
                          🎵 TikTok
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 bg-blue-50 rounded-lg text-center">
                      <p className="text-gray-600 italic">@your_bbq_account • Your Channel URL or @handle • @your_tiktok</p>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Utensils className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{totalRecipes}</div>
                    <div className="text-sm text-gray-600">Recipes</div>
                  </div>
                  
                  <div className="text-center p-4 bg-amber-50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Star className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {averageRating > 0 ? averageRating.toFixed(1) : "N/A"}
                    </div>
                    <div className="text-sm text-gray-600">Avg Rating</div>
                  </div>
                  
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Clock className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{totalRatings}</div>
                    <div className="text-sm text-gray-600">Reviews Given</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* My Recipes */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Recipes</h2>
              <Link
                href="/recipes/create"
                className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <Utensils className="w-4 h-4 mr-2" />
                Create Recipe
              </Link>
            </div>

            <div className="text-center py-12">
              <Utensils className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No recipes yet</h3>
              <p className="text-gray-500 mb-4">Start sharing your BBQ expertise with the Que-Munity!</p>
              <Link
                href="/guides"
                className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Browse Guides
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}