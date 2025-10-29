import Link from 'next/link';
import SimpleUserNav from '@/components/SimpleUserNav';
import { Calculator, Clock, Thermometer, Timer, Flame, Scale } from 'lucide-react';

export default function ToolsPage() {
  const tools = [
    {
      id: 'smoking-time',
      title: 'Smoking Time Calculator',
      description: 'Calculate cooking times for different cuts of meat based on weight and temperature',
      icon: Clock,
      href: '/tools/smoking-time',
      color: 'bg-orange-500',
    },
    {
      id: 'temp-converter',
      title: 'Temperature Converter',
      description: 'Convert between Fahrenheit and Celsius for perfect temperature control',
      icon: Thermometer,
      href: '/tools/temperature-converter',
      color: 'bg-red-500',
    },
    {
      id: 'meat-calculator',
      title: 'Meat Calculator',
      description: 'Calculate how much meat you need for your BBQ based on number of guests',
      icon: Scale,
      href: '/tools/meat-calculator',
      color: 'bg-amber-500',
    },
    {
      id: 'timer',
      title: 'BBQ Timer',
      description: 'Set multiple timers for different stages of your BBQ cook',
      icon: Timer,
      href: '/tools/timer',
      color: 'bg-green-500',
    },
    {
      id: 'wood-guide',
      title: 'Wood Pairing Guide',
      description: 'Find the perfect wood type for your protein and desired flavor profile',
      icon: Flame,
      href: '/tools/wood-guide',
      color: 'bg-yellow-600',
    },
    {
      id: 'pellet-calculator',
      title: 'Pellet Usage Calculator',
      description: 'Estimate pellet consumption for your smoking sessions',
      icon: Calculator,
      href: '/tools/pellet-calculator',
      color: 'bg-purple-500',
    },
  ];

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
                <Link href="/recipes" className="text-gray-700 hover:text-orange-600">Recipes</Link>
                <Link href="/guides" className="text-gray-700 hover:text-orange-600">Guides</Link>
                <Link href="/community" className="text-gray-700 hover:text-orange-600">Que-Munity</Link>
                <Link href="/tools" className="text-orange-600 font-semibold">Tools</Link>
              </nav>
              <SimpleUserNav />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">BBQ Tools & Calculators</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Essential tools and calculators to help you master the art of BBQ. From timing your cooks to 
            calculating portions, we've got everything you need for the perfect barbecue.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <Link key={tool.id} href={tool.href}>
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-8 group cursor-pointer border border-gray-100 hover:border-orange-200">
                  <div className="flex items-center mb-6">
                    <div className={`${tool.color} rounded-lg p-3 mr-4 group-hover:scale-110 transition-transform duration-200`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                      {tool.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {tool.description}
                  </p>
                  
                  <div className="flex items-center text-orange-600 font-medium group-hover:text-orange-700">
                    <span>Use Tool</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Featured Section */}
        <div className="mt-16 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pro Tips</h2>
            <p className="text-gray-600 text-lg">
              Master these BBQ fundamentals with our calculators and guides
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Thermometer className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Temperature Control</h3>
              <p className="text-gray-600">
                Master internal temperatures and smoker settings for perfect results every time.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-amber-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Timing is Everything</h3>
              <p className="text-gray-600">
                Use our calculators to plan your cook times and never serve late again.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-red-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Flame className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Wood & Smoke</h3>
              <p className="text-gray-600">
                Learn which woods pair best with different proteins for optimal flavor.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}