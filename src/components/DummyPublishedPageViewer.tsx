import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Globe, 
  Share2, 
  Eye, 
  Heart, 
  Star,
  Package,
  Award,
  Leaf,
  Shield,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

interface PublishedPageData {
  brandName: string;
  tagline: string;
  description: string;
  coverImage: string;
  logo: string;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  social: {
    instagram: string;
    twitter: string;
    linkedin: string;
    facebook: string;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  productData?: {
    name: string;
    shortDescription: string;
    longDescription: string;
    mrp: number;
    images: string[];
    keyBenefits: string[];
    certifications: string[];
    sustainabilityFlags: {
      recyclable: boolean;
      compostable: boolean;
      carbonNeutral: boolean;
    };
  };
  publishedAt: string;
  pageViews: number;
}

const DummyPublishedPageViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pageData, setPageData] = useState<PublishedPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    // Simulate loading published page data
    const loadPageData = () => {
      try {
        const storedData = localStorage.getItem(`published-page-${id}`);
        if (storedData) {
          const data = JSON.parse(storedData);
          setPageData(data);
          
          // Simulate incrementing view count
          const currentViews = data.pageViews || 0;
          const newViewCount = currentViews + 1;
          setViewCount(newViewCount);
          
          // Update view count in localStorage
          const updatedData = { ...data, pageViews: newViewCount };
          localStorage.setItem(`published-page-${id}`, JSON.stringify(updatedData));
        } else {
          // Fallback dummy data if no stored data found
          setPageData({
            brandName: 'Sample Product Page',
            tagline: 'Experience Quality Like Never Before',
            description: 'This is a dynamically published product page created using our Studio platform.',
            coverImage: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
            logo: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
            contact: {
              email: 'contact@brand.com',
              phone: '+1 (555) 123-4567',
              address: '123 Business Street, City, State 12345'
            },
            social: {
              instagram: 'https://instagram.com/brand',
              twitter: 'https://twitter.com/brand',
              linkedin: 'https://linkedin.com/company/brand',
              facebook: 'https://facebook.com/brand'
            },
            colors: {
              primary: '#3B82F6',
              secondary: '#10B981',
              accent: '#F59E0B'
            },
            publishedAt: new Date().toISOString(),
            pageViews: 1
          });
          setViewCount(1);
        }
      } catch (error) {
        console.error('Error loading page data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Simulate network delay
    setTimeout(loadPageData, 1000);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading published page...</p>
        </div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
          <p className="text-gray-600 mb-6">The published page you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Bar - Shows this is a published page */}
      <div className="bg-green-50 border-b border-green-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Globe className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-900">Published Page</p>
              <p className="text-xs text-green-700">
                Published on {new Date(pageData.publishedAt).toLocaleDateString()} • {viewCount} views
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="inline-flex items-center px-3 py-2 border border-green-300 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </button>
            <button className="inline-flex items-center px-3 py-2 border border-green-300 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm">
              <Eye className="w-4 h-4 mr-2" />
              Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div 
        className="relative h-96 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${pageData.colors.primary}, ${pageData.colors.secondary})`
        }}
      >
        {pageData.coverImage && (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${pageData.coverImage})` }}
          />
        )}
        <div className="relative text-center text-white z-10">
          {pageData.logo && (
            <img
              src={pageData.logo}
              alt="Brand Logo"
              className="w-16 h-16 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
            />
          )}
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {pageData.brandName}
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
            {pageData.tagline}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* About Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">About</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                {pageData.description}
              </p>
              
              {pageData.productData && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span className="font-medium text-gray-900">Premium Quality</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-blue-500" />
                    <span className="font-medium text-gray-900">Certified Product</span>
                  </div>
                  {pageData.productData.sustainabilityFlags.recyclable && (
                    <div className="flex items-center space-x-2">
                      <Leaf className="w-5 h-5 text-green-500" />
                      <span className="font-medium text-gray-900">Eco-Friendly</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {pageData.productData && pageData.productData.images.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {pageData.productData.images.slice(0, 4).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg shadow-md"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        {pageData.productData && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Product Details</h2>
            <div className="bg-gray-50 rounded-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Benefits</h3>
                  <ul className="space-y-2">
                    {pageData.productData.keyBenefits.map((benefit, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Certifications</h3>
                  <div className="flex flex-wrap gap-2">
                    {pageData.productData.certifications.map((cert, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        <Shield className="w-3 h-3 mr-1" />
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    ₹{pageData.productData.mrp}
                  </div>
                  <p className="text-gray-600">Maximum Retail Price</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Section */}
        <div className="bg-gray-900 text-white rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pageData.contact.email && (
              <div className="flex items-center space-x-3">
                <Mail className="w-6 h-6 text-blue-400" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-gray-300">{pageData.contact.email}</p>
                </div>
              </div>
            )}
            
            {pageData.contact.phone && (
              <div className="flex items-center space-x-3">
                <Phone className="w-6 h-6 text-green-400" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-gray-300">{pageData.contact.phone}</p>
                </div>
              </div>
            )}
            
            {pageData.contact.address && (
              <div className="flex items-center space-x-3">
                <MapPin className="w-6 h-6 text-red-400" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-gray-300">{pageData.contact.address}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600">
            © 2024 {pageData.brandName}. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Powered by Stegofy Studio
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DummyPublishedPageViewer;