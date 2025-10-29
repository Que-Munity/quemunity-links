'use client';

import { useState, useEffect } from "react";
import UserNav from "@/components/UserNav";
import Link from "next/link";
import { ArrowLeft, Save, Camera, Upload, Plus, X, Award, Flame, Users, Star, Trophy, Target } from "lucide-react";

interface ProfileData {
  username: string;
  bio: string;
  location: string;
  yearsExperience: string;
  favoriteProtein: string;
  smokerType: string;
  specialties: string[];
  achievements: string[];
  profileImage: string;
  coverImage: string;
  socialLinks: {
    instagram: string;
    youtube: string;
    tiktok: string;
  };
  queMasterSkills: string[];
  competitionHistory: string;
  signature_dish: string;
}

export default function EditProfilePage() {
  const [profile, setProfile] = useState<ProfileData>({
    username: '',
    bio: '',
    location: '',
    yearsExperience: '',
    favoriteProtein: '',
    smokerType: '',
    specialties: [],
    achievements: [],
    profileImage: '',
    coverImage: '',
    socialLinks: {
      instagram: '',
      youtube: '',
      tiktok: ''
    },
    queMasterSkills: [],
    competitionHistory: '',
    signature_dish: ''
  });

  const [newSpecialty, setNewSpecialty] = useState('');
  const [newAchievement, setNewAchievement] = useState('');
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    // Load existing profile data from localStorage
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialLinkChange = (platform: keyof typeof profile.socialLinks, value: string) => {
    setProfile(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const addSpecialty = () => {
    if (newSpecialty.trim() && !profile.specialties.includes(newSpecialty.trim())) {
      setProfile(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }));
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (index: number) => {
    setProfile(prev => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index)
    }));
  };

  const addAchievement = () => {
    if (newAchievement.trim() && !profile.achievements.includes(newAchievement.trim())) {
      setProfile(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()]
      }));
      setNewAchievement('');
    }
  };

  const removeAchievement = (index: number) => {
    setProfile(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  const addQueMasterSkill = () => {
    if (newSkill.trim() && !profile.queMasterSkills.includes(newSkill.trim())) {
      setProfile(prev => ({
        ...prev,
        queMasterSkills: [...prev.queMasterSkills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeQueMasterSkill = (index: number) => {
    setProfile(prev => ({
      ...prev,
      queMasterSkills: prev.queMasterSkills.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('userProfile', JSON.stringify(profile));
    
    // Update currentUser with profile data
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const updatedUser = {
      ...currentUser,
      username: profile.username,
      bio: profile.bio,
      location: profile.location,
      profileComplete: true
    };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Redirect back to profile
    window.location.href = '/profile';
  };

  const suggestedSpecialties = [
    'Brisket Master', 'Rib Specialist', 'Pulled Pork Pro', 'Wings Expert',
    'Seafood Smoking', 'Vegetarian BBQ', 'Competition Style', 'Low & Slow',
    'Hot & Fast', 'Sauce Master', 'Dry Rub Expert', 'International BBQ'
  ];

  const suggestedSkills = [
    'Temperature Control', 'Smoke Management', 'Meat Selection', 'Timing Perfection',
    'Fire Building', 'Wood Pairing', 'Seasoning Blends', 'Presentation',
    'Competition Judging', 'Teaching Others', 'Equipment Mastery', 'Recipe Development'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <UserNav />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/profile"
              className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Link>
          </div>

          {/* Main Edit Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-8">
              <Flame className="w-8 h-8 text-orange-500" />
              <h1 className="text-3xl font-bold text-gray-900">Build Your Que-Munity Profile</h1>
            </div>
            
            <div className="space-y-8">
              {/* Basic Info Section */}
              <div className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Basic Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pitmaster Name / Username
                    </label>
                    <input
                      type="text"
                      value={profile.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="BBQ_Master_2024"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Austin, TX"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your BBQ Story & Bio
                  </label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Tell the Que-Munity about your BBQ journey, what got you started, your passion for smoking, and what makes your BBQ special..."
                  />
                </div>
              </div>

              {/* BBQ Experience Section */}
              <div className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Flame className="w-5 h-5" />
                  BBQ Experience & Equipment
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience
                    </label>
                    <select
                      value={profile.yearsExperience}
                      onChange={(e) => handleInputChange('yearsExperience', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">Select...</option>
                      <option value="beginner">Beginner (0-1 years)</option>
                      <option value="intermediate">Intermediate (1-3 years)</option>
                      <option value="advanced">Advanced (3-5 years)</option>
                      <option value="expert">Expert (5-10 years)</option>
                      <option value="pitmaster">Pitmaster (10+ years)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Smoker/Grill
                    </label>
                    <select
                      value={profile.smokerType}
                      onChange={(e) => handleInputChange('smokerType', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">Select your main setup...</option>
                      <option value="offset">Offset Smoker</option>
                      <option value="pellet">Pellet Smoker</option>
                      <option value="kamado">Kamado (Big Green Egg, etc.)</option>
                      <option value="kettle">Kettle Grill</option>
                      <option value="electric">Electric Smoker</option>
                      <option value="gas">Gas Smoker</option>
                      <option value="stick-burner">Stick Burner</option>
                      <option value="multiple">Multiple Setups</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Favorite Protein
                    </label>
                    <select
                      value={profile.favoriteProtein}
                      onChange={(e) => handleInputChange('favoriteProtein', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">What's your go-to?</option>
                      <option value="brisket">Brisket</option>
                      <option value="ribs">Ribs (Pork or Beef)</option>
                      <option value="pork-shoulder">Pork Shoulder/Boston Butt</option>
                      <option value="chicken">Chicken</option>
                      <option value="turkey">Turkey</option>
                      <option value="salmon">Salmon</option>
                      <option value="tri-tip">Tri-Tip</option>
                      <option value="everything">I smoke everything!</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Signature Dish
                  </label>
                  <input
                    type="text"
                    value={profile.signature_dish}
                    onChange={(e) => handleInputChange('signature_dish', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="18-hour beef brisket with coffee rub, Honey glazed ribs, etc."
                  />
                </div>
              </div>

              {/* Que-Master Skills Section */}
              <div className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Your Que-Master Skills
                </h2>
                <p className="text-gray-600 mb-4">What are you known for in the BBQ community? What skills make you a Que-Master?</p>

                <div className="mb-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addQueMasterSkill()}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Add a skill you're known for..."
                    />
                    <button
                      onClick={addQueMasterSkill}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
                  {suggestedSkills.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => !profile.queMasterSkills.includes(skill) && setProfile(prev => ({
                        ...prev,
                        queMasterSkills: [...prev.queMasterSkills, skill]
                      }))}
                      className={`text-sm px-3 py-2 rounded-full border transition-colors ${
                        profile.queMasterSkills.includes(skill)
                          ? 'bg-orange-500 text-white border-orange-500'
                          : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-orange-50 hover:border-orange-300'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {profile.queMasterSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                    >
                      <Star className="w-3 h-3" />
                      {skill}
                      <button
                        onClick={() => removeQueMasterSkill(index)}
                        className="ml-1 text-orange-600 hover:text-orange-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Specialties Section */}
              <div className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  BBQ Specialties
                </h2>

                <div className="mb-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSpecialty}
                      onChange={(e) => setNewSpecialty(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSpecialty()}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Add a BBQ specialty..."
                    />
                    <button
                      onClick={addSpecialty}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
                  {suggestedSpecialties.map((specialty) => (
                    <button
                      key={specialty}
                      onClick={() => !profile.specialties.includes(specialty) && setProfile(prev => ({
                        ...prev,
                        specialties: [...prev.specialties, specialty]
                      }))}
                      className={`text-sm px-3 py-2 rounded-full border transition-colors ${
                        profile.specialties.includes(specialty)
                          ? 'bg-orange-500 text-white border-orange-500'
                          : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-orange-50 hover:border-orange-300'
                      }`}
                    >
                      {specialty}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {profile.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm"
                    >
                      <Flame className="w-3 h-3" />
                      {specialty}
                      <button
                        onClick={() => removeSpecialty(index)}
                        className="ml-1 text-amber-600 hover:text-amber-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Achievements Section */}
              <div className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Achievements & Competition History
                </h2>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Competition History (Optional)
                  </label>
                  <textarea
                    value={profile.competitionHistory}
                    onChange={(e) => handleInputChange('competitionHistory', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Share your competition experience, wins, notable events, or team history..."
                  />
                </div>

                <div className="mb-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newAchievement}
                      onChange={(e) => setNewAchievement(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addAchievement()}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="1st Place Ribs - Austin BBQ Festival 2024"
                    />
                    <button
                      onClick={addAchievement}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {profile.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                      <Trophy className="w-4 h-4 text-yellow-600" />
                      <span className="flex-1 text-gray-800">{achievement}</span>
                      <button
                        onClick={() => removeAchievement(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Links Section */}
              <div className="pb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Social Media & Content
                </h2>
                <p className="text-gray-600 mb-4">Share your BBQ content and connect with the community!</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instagram
                    </label>
                    <input
                      type="text"
                      value={profile.socialLinks.instagram}
                      onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="@your_bbq_account"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      YouTube Channel
                    </label>
                    <input
                      type="text"
                      value={profile.socialLinks.youtube}
                      onChange={(e) => handleSocialLinkChange('youtube', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Your Channel URL or @handle"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      TikTok
                    </label>
                    <input
                      type="text"
                      value={profile.socialLinks.tiktok}
                      onChange={(e) => handleSocialLinkChange('tiktok', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="@your_tiktok"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSave}
                  className="flex-1 inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors font-medium text-lg"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Save My Que-Master Profile
                </button>
                
                <Link
                  href="/profile"
                  className="px-6 py-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}