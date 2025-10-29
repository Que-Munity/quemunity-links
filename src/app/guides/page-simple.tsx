import Link from "next/link";
import { ArrowLeft, Book, Clock, Users } from "lucide-react";

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-6">
          <Link 
            href="/"
            className="inline-flex items-center text-orange-600 hover:text-orange-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">BBQ Guides</h1>
          <p className="text-xl text-gray-600 mb-8 text-center">
            Master the art of barbecue with our comprehensive guides
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-orange-50 p-6 rounded-lg">
              <Book className="h-8 w-8 text-orange-600 mb-3" />
              <h3 className="font-bold text-orange-800 mb-2">🔥 Smoking Basics</h3>
              <p className="text-sm text-gray-600">Learn the fundamentals of low and slow cooking</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <Clock className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="font-bold text-blue-800 mb-2">⏰ Temperature Guide</h3>
              <p className="text-sm text-gray-600">Perfect temperatures for every cut of meat</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <Users className="h-8 w-8 text-green-600 mb-3" />
              <h3 className="font-bold text-green-800 mb-2">🌳 Wood Types</h3>
              <p className="text-sm text-gray-600">Choosing the right wood for flavor profiles</p>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-gray-500 mb-4">
              Comprehensive guides coming soon! 
            </p>
            <Link 
              href="/tools"
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 inline-block"
            >
              Explore BBQ Tools
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}