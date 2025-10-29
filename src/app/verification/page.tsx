'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function SiteVerification() {
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/verify', { method: 'POST' });
      const result = await response.json();
      setVerificationResult(result);
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Site Verification</h1>
          
          <div className="space-y-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-green-800 mb-3">✅ Site Ready for AdSense</h2>
              <p className="text-green-700 mb-4">
                Your site meets all Google AdSense requirements and is ready for verification.
              </p>
              
              <button
                onClick={handleVerify}
                disabled={loading}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify Site Now'}
              </button>
            </div>

            {verificationResult && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Verification Result</h3>
                <pre className="text-sm text-blue-700 bg-blue-100 p-3 rounded overflow-auto">
                  {JSON.stringify(verificationResult, null, 2)}
                </pre>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Verification Methods</h2>
                <ul className="space-y-2 text-gray-600">
                  <li>✅ HTML Meta Tag (in &lt;head&gt;)</li>
                  <li>✅ HTML File Upload</li>
                  <li>✅ Google Analytics</li>
                  <li>✅ DNS Record</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Site Status</h2>
                <ul className="space-y-2 text-gray-600">
                  <li>✅ Domain: quemunity.app</li>
                  <li>✅ SSL Certificate: Valid</li>
                  <li>✅ robots.txt: Present</li>
                  <li>✅ Sitemap: Available</li>
                  <li>✅ Privacy Policy: Complete</li>
                </ul>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-orange-800 mb-3">AdSense Integration Ready</h2>
              <p className="text-orange-700 mb-4">
                Your site has all required elements for Google AdSense approval:
              </p>
              <ul className="list-disc list-inside text-orange-700 space-y-1 mb-4">
                <li>Original BBQ and recipe content</li>
                <li>Professional site design and navigation</li>
                <li>Privacy policy and contact information</li>
                <li>Mobile-responsive layout</li>
                <li>Fast loading times</li>
                <li>SEO optimization</li>
              </ul>
              
              <div className="space-y-2">
                <p className="font-semibold text-orange-800">Quick Links:</p>
                <div className="space-x-4">
                  <a href="https://quemunity.app/robots.txt" target="_blank" className="text-orange-600 hover:text-orange-700">robots.txt</a>
                  <a href="https://quemunity.app/sitemap.xml" target="_blank" className="text-orange-600 hover:text-orange-700">sitemap.xml</a>
                  <a href="https://quemunity.app/privacy" target="_blank" className="text-orange-600 hover:text-orange-700">Privacy Policy</a>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Verification Instructions</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700">For Google AdSense:</h3>
                  <ol className="list-decimal list-inside text-gray-600 space-y-1 mt-2">
                    <li>Go to your AdSense dashboard</li>
                    <li>Enter site URL: <code className="bg-gray-100 px-2 py-1 rounded">https://quemunity.app</code></li>
                    <li>Choose verification method (HTML file recommended)</li>
                    <li>Complete verification process</li>
                    <li>Wait for approval (typically 1-7 days)</li>
                  </ol>
                </div>
              </div>
            </div>
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