import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">About Que-Munity</h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our BBQ Community</h2>
              <p className="text-gray-700 mb-4">
                Welcome to Que-Munity, the ultimate destination for BBQ enthusiasts, pitmasters, 
                and anyone passionate about the art of smoking meats. Our community brings together 
                thousands of barbecue lovers from around the world to share recipes, techniques, 
                and the joy of low and slow cooking.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">What We Offer</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Authentic BBQ recipes from experienced pitmasters</li>
                <li>Step-by-step smoking guides for beginners</li>
                <li>Equipment reviews and recommendations</li>
                <li>Wood pairing guides for different meats</li>
                <li>Temperature and timing calculators</li>
                <li>Active community forums and discussions</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-700 mb-4">
                We believe that great barbecue brings people together. Our mission is to preserve 
                and share the traditions of American barbecue while helping both beginners and 
                experts improve their craft. Whether you're smoking your first brisket or 
                perfecting your competition recipe, Que-Munity is here to support your journey.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Join Our Community</h2>
              <p className="text-gray-700 mb-4">
                Ready to take your BBQ skills to the next level? Join thousands of barbecue 
                enthusiasts who trust Que-Munity for authentic recipes, expert advice, and 
                the camaraderie that makes BBQ culture so special.
              </p>
            </section>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <Link href="/" className="text-orange-600 hover:text-orange-700">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}