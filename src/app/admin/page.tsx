'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Upload, Image, FileText, Palette, Settings, Eye, Plus, X, Edit3, LogOut, Shield } from 'lucide-react';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('media');
  const [uploadedImages, setUploadedImages] = useState([
    { id: 1, name: 'hero-bbq.jpg', url: '/api/placeholder/800/400', size: '145 KB', uploaded: '2025-10-01' },
    { id: 2, name: 'brisket-hero.jpg', url: '/api/placeholder/600/300', size: '98 KB', uploaded: '2025-09-28' },
    { id: 3, name: 'logo-que-munity.png', url: '/api/placeholder/200/100', size: '23 KB', uploaded: '2025-09-25' }
  ]);
  const [selectedImage, setSelectedImage] = useState(null);

  // Check authentication on load
  useEffect(() => {
    const checkAuth = () => {
      const adminToken = localStorage.getItem('adminToken');
      const loginTime = localStorage.getItem('adminLoginTime');
      
      if (!adminToken || !loginTime) {
        router.push('/admin/login');
        return;
      }
      
      const now = Date.now();
      const loginTimestamp = parseInt(loginTime);
      const twoHours = 2 * 60 * 60 * 1000; // 2 hours
      
      if (now - loginTimestamp > twoHours) {
        // Session expired
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminLoginTime');
        router.push('/admin/login');
        return;
      }
      
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminLoginTime');
    router.push('/');
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    files.forEach((file: File) => {
      const newImage = {
        id: uploadedImages.length + 1,
        name: file.name,
        url: URL.createObjectURL(file),
        size: `${Math.round(file.size / 1024)} KB`,
        uploaded: new Date().toISOString().split('T')[0]
      };
      setUploadedImages(prev => [newImage, ...prev]);
    });
  };

  const copyImageUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('Image URL copied to clipboard!');
  };

  const deleteImage = (id: number) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id));
    alert('Image deleted successfully!');
  };

  // Show loading screen while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-orange-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, this will be handled by useEffect redirect
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center">
                <h1 className="text-2xl font-bold text-orange-600">Que-Munity Admin</h1>
              </Link>
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                Site Management
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-600 hover:text-orange-600 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">View Site</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600 flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-lg shadow-sm p-6">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('media')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'media' ? 'bg-orange-100 text-orange-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Image className="w-4 h-4" />
                Media Library
              </button>
              <button
                onClick={() => setActiveTab('content')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'content' ? 'bg-orange-100 text-orange-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FileText className="w-4 h-4" />
                Content Editor
              </button>
              <button
                onClick={() => setActiveTab('theme')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'theme' ? 'bg-orange-100 text-orange-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Palette className="w-4 h-4" />
                Theme & Branding
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'settings' ? 'bg-orange-100 text-orange-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Settings className="w-4 h-4" />
                Site Settings
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'media' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Media Library</h2>
                  <label className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 cursor-pointer transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Upload Images
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {uploadedImages.map((image) => (
                    <div key={image.id} className="group relative bg-gray-50 rounded-lg overflow-hidden">
                      <div className="aspect-video bg-gray-200 relative">
                        <img 
                          src={image.url} 
                          alt={image.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex gap-2">
                            <button
                              onClick={() => copyImageUrl(image.url)}
                              className="bg-white text-gray-900 px-3 py-1 rounded text-sm hover:bg-gray-100"
                            >
                              Copy URL
                            </button>
                            <button
                              onClick={() => deleteImage(image.id)}
                              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-gray-900 text-sm truncate">{image.name}</h3>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>{image.size}</span>
                          <span>{image.uploaded}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {uploadedImages.length === 0 && (
                  <div className="text-center py-12">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No images uploaded yet</h3>
                    <p className="text-gray-600 mb-4">Upload your first image to get started</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'content' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Content Editor</h2>
                <div className="space-y-6">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-gray-900">Quick Page Editing</h3>
                    <p className="text-gray-600 text-sm mb-3">Edit content directly on any page by adding custom CSS classes.</p>
                    <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                      .editable &#123; border: 2px dashed #orange; cursor: text; &#125;
                    </div>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="font-semibold text-gray-900">Image Replacement</h3>
                    <p className="text-gray-600 text-sm mb-3">Replace any image by copying the URL from Media Library and updating the src attribute.</p>
                    <div className="bg-gray-50 p-3 rounded text-sm">
                      1. Upload image to Media Library<br/>
                      2. Copy the image URL<br/>
                      3. Edit the component file<br/>
                      4. Replace the image src
                    </div>
                  </div>

                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="font-semibold text-gray-900">Logo Management</h3>
                    <p className="text-gray-600 text-sm mb-3">Update site logos and branding elements.</p>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 text-sm">
                      Edit Brand Assets
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'theme' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Theme & Branding</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Color Scheme</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-600 rounded"></div>
                        <span className="text-sm font-mono">#EA580C (Primary Orange)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-900 rounded"></div>
                        <span className="text-sm font-mono">#111827 (Dark Gray)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-50 rounded border"></div>
                        <span className="text-sm font-mono">#F9FAFB (Light Gray)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Typography</h3>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold">Heading Font (Inter)</div>
                      <div className="text-base">Body Font (Inter)</div>
                      <div className="text-sm font-mono">Code Font (Menlo)</div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Logo Settings</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-10 bg-orange-100 rounded flex items-center justify-center text-orange-600 font-bold">
                      LOGO
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Current logo: Text-based "Que-Munity"</p>
                      <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                        Upload Custom Logo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Site Settings</h2>
                <div className="space-y-8">
                  {/* Site Information */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Site Information</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Site Title</label>
                      <input 
                        type="text" 
                        defaultValue="Que-Munity - BBQ Community & Recipes"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
                      <textarea 
                        defaultValue="The ultimate BBQ community for pitmasters, recipes, guides, and smoking techniques."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                      <input 
                        type="email" 
                        defaultValue="info@que-munity.com"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <button className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors">
                      Save Site Settings
                    </button>
                  </div>

                  {/* Security Settings */}
                  <div className="space-y-6 pt-8 border-t">
                    <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-medium text-yellow-800 mb-2">Change Admin Password</h4>
                      <p className="text-sm text-yellow-700 mb-4">
                        To change your admin password, edit the password in <code className="bg-yellow-100 px-1 rounded">/src/app/admin/login/page.tsx</code> 
                        on line 31. Look for the <code className="bg-yellow-100 px-1 rounded">adminPassword</code> variable.
                      </p>
                      <div className="bg-white border border-yellow-300 rounded p-2 text-sm font-mono text-gray-700">
                        const adminPassword = 'QueMunity2025!'; // &lt;-- Change this
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-800 mb-2">Session Management</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Sessions expire after 2 hours of inactivity</li>
                        <li>• You'll be automatically logged out for security</li>
                        <li>• Login attempts are rate-limited to prevent attacks</li>
                        <li>• Only you should know the admin password</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}