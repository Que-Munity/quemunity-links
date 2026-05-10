import Link from 'next/link';
import { ChefHat, Thermometer, Timer, Users, Award, Flame, Star } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              The Ultimate
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                {" "}BBQ Community
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Join thousands of BBQ enthusiasts sharing recipes, techniques, and the passion for perfectly smoked meats. 
              From beginner tips to competition secrets - we've got your pit covered.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/recipes"
                className="bg-orange-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-orange-700 transition-colors inline-flex items-center justify-center"
              >
                Browse Recipes
              </Link>
              <Link
                href="#features"
                className="bg-white text-orange-600 border-2 border-orange-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-orange-50 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        {/* Launch Notice */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="text-center">
              <p className="text-lg font-semibold">
                🚀 We're live!
                <Link href="/auth/signin" className="underline hover:no-underline ml-2">
                  Create your free account →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Perfect BBQ
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              From recipes to community, we've got all the tools for your BBQ journey
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <ChefHat className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Recipe Library</h3>
              <p className="text-gray-600">
                Thousands of tested BBQ recipes from brisket to ribs, with step-by-step guides
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Thermometer className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Temperature Guides</h3>
              <p className="text-gray-600">
                Perfect doneness every time with our comprehensive temperature and timing guides
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Timer className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Cook Timers</h3>
              <p className="text-gray-600">
                Smart timers and alerts to keep track of multiple dishes and cooking stages
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600">
                Connect with fellow pitmasters, share photos, and learn from the best
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">5,000+</div>
              <div className="text-lg text-gray-600">BBQ Recipes</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-600 mb-2">50,000+</div>
              <div className="text-lg text-gray-600">Community Members</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-600 mb-2">4.8★</div>
              <div className="text-lg text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Master the Art of BBQ?</h2>
          <p className="text-lg sm:text-xl mb-8 opacity-90">
            Join our community of passionate pitmasters and take your BBQ skills to the next level
          </p>
          <Link
            href="/recipes"
            className="bg-white text-orange-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-orange-50 transition-colors inline-flex items-center justify-center"
          >
            <Flame className="mr-2 h-5 w-5" />
            Start Your BBQ Journey
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Flame className="h-6 w-6 text-orange-400" />
                <span className="text-xl font-bold text-white">Que-Munity</span>
              </div>
              <p className="text-gray-400">
                The ultimate destination for BBQ enthusiasts worldwide.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Community</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/recipes" className="hover:text-white transition-colors">Recipes</Link></li>
                <li><Link href="/community/forum" className="hover:text-white transition-colors">Forums</Link></li>
                <li><Link href="/community" className="hover:text-white transition-colors">Events</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/guides" className="hover:text-white transition-colors">Guides</Link></li>
                <li><Link href="/tools" className="hover:text-white transition-colors">Tools</Link></li>
                <li><Link href="/recipes" className="hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/contact" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Que-Munity. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}