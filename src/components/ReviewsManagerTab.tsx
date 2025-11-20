import React, { useState } from 'react';
import { 
  Star, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown,
  TrendingUp,
  Users,
  Award,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  Plus,
  RefreshCw,
  ExternalLink,
  Flag,
  Reply,
  Heart,
  Share2,
  Calendar,
  MapPin,
  Package,
  User,
  Mail,
  Phone,
  Image as ImageIcon,
  Play,
  UserCheck
} from 'lucide-react';
import ReviewReplyModal from './ReviewReplyModal';
import CustomerDetailsModal from './CustomerDetailsModal';

interface Review {
  id: string;
  customerName: string;
  email: string;
  mobile: string;
  productName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
  status: 'published' | 'pending' | 'rejected';
  source: 'QR Scan' | 'Website' | 'Email Campaign' | 'Manual Entry';
  location?: string;
  images?: string[];
  videos?: string[];
  response?: {
    message: string;
    date: string;
    author: string;
  };
}

const ReviewsManagerTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all-reviews' | 'pending' | 'published' | 'analytics'>('all-reviews');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRating, setSelectedRating] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');

  // Modal states
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedReviewForReply, setSelectedReviewForReply] = useState<Review | null>(null);
  const [selectedCustomerEmail, setSelectedCustomerEmail] = useState<string | null>(null);

  // Sample reviews data
  const [reviews] = useState<Review[]>([
    {
      id: 'REV-001',
      customerName: 'Priya Sharma',
      email: 'priya.sharma@gmail.com',
      mobile: '+91 98765 43210',
      productName: 'Organic Honey 500g',
      rating: 5,
      title: 'Excellent quality honey!',
      comment: 'This honey is absolutely pure and delicious. The taste is amazing and you can tell it\'s authentic. Will definitely buy again!',
      date: '2024-01-20T14:30:00Z',
      verified: true,
      helpful: 12,
      status: 'published',
      source: 'QR Scan',
      location: 'Mumbai, Maharashtra',
      images: [
        'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg',
        'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'
      ],
      videos: ['https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'],
      response: {
        message: 'Thank you so much for your wonderful review, Priya! We\'re delighted that you enjoyed our organic honey.',
        date: '2024-01-21T10:15:00Z',
        author: 'Brand Team'
      }
    },
    {
      id: 'REV-002',
      customerName: 'Rahul Kumar',
      email: 'rahul.k@yahoo.com',
      mobile: '+91 91234 56789',
      productName: 'Premium Green Tea 250g',
      rating: 4,
      title: 'Good tea, fast delivery',
      comment: 'The tea quality is good and the packaging was excellent. Delivery was faster than expected. Only wish it was a bit stronger in flavor.',
      date: '2024-01-19T16:45:00Z',
      verified: true,
      helpful: 8,
      status: 'published',
      source: 'Website',
      location: 'Delhi, NCR',
      images: ['https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg']
    },
    {
      id: 'REV-003',
      customerName: 'Anita Patel',
      email: 'anita.patel@hotmail.com',
      mobile: '+91 99887 76655',
      productName: 'Handmade Soap Pack',
      rating: 3,
      title: 'Average product',
      comment: 'The soap is okay but not as moisturizing as I expected. The fragrance is nice though.',
      date: '2024-01-18T11:20:00Z',
      verified: false,
      helpful: 3,
      status: 'pending',
      source: 'Email Campaign',
      location: 'Bangalore, Karnataka'
    },
    {
      id: 'REV-004',
      customerName: 'Vikram Singh',
      email: 'vikram.singh@gmail.com',
      mobile: '+91 94455 66778',
      productName: 'Organic Honey 500g',
      rating: 5,
      title: 'Pure and natural!',
      comment: 'Best honey I\'ve tasted in years. You can taste the purity. Highly recommended for health-conscious people.',
      date: '2024-01-17T09:15:00Z',
      verified: true,
      helpful: 15,
      status: 'published',
      source: 'QR Scan',
      location: 'Chennai, Tamil Nadu',
      images: [
        'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg'
      ],
      videos: ['https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4']
    },
    {
      id: 'REV-005',
      customerName: 'Meera Gupta',
      email: 'meera.g@outlook.com',
      mobile: '+91 98765 12345',
      productName: 'Premium Green Tea 250g',
      rating: 2,
      title: 'Not satisfied',
      comment: 'The tea doesn\'t taste as premium as advertised. Found better options at local stores.',
      date: '2024-01-16T14:20:00Z',
      verified: true,
      helpful: 2,
      status: 'rejected',
      source: 'Manual Entry',
      location: 'Pune, Maharashtra'
    },
    {
      id: 'REV-006',
      customerName: 'Priya Sharma',
      email: 'priya.sharma@gmail.com',
      mobile: '+91 98765 43210',
      productName: 'Premium Green Tea 250g',
      rating: 4,
      title: 'Good quality tea',
      comment: 'I previously reviewed the honey and loved it, so I tried the tea too. It\'s quite good, though I prefer stronger flavors.',
      date: '2024-01-22T11:30:00Z',
      verified: true,
      helpful: 5,
      status: 'published',
      source: 'QR Scan',
      location: 'Mumbai, Maharashtra',
      images: ['https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg']
    },
    {
      id: 'REV-007',
      customerName: 'Arjun Reddy',
      email: 'arjun.reddy@gmail.com',
      mobile: '+91 91239 87654',
      productName: 'Handmade Soap Pack',
      rating: 5,
      title: 'Amazing natural soap!',
      comment: 'This soap is fantastic! My skin feels so much better after using it. The natural ingredients really make a difference.',
      date: '2024-01-21T15:20:00Z',
      verified: true,
      helpful: 8,
      status: 'published',
      source: 'Website',
      location: 'Hyderabad, Telangana',
      images: [
        'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg',
        'https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg'
      ],
      videos: ['https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4']
    }
  ]);

  const products = ['Organic Honey 500g', 'Premium Green Tea 250g', 'Handmade Soap Pack'];
  const sources = ['QR Scan', 'Website', 'Email Campaign', 'Manual Entry'];

  // Filter reviews
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.productName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRating = selectedRating === 'all' || review.rating.toString() === selectedRating;
    const matchesProduct = selectedProduct === 'all' || review.productName === selectedProduct;
    const matchesSource = selectedSource === 'all' || review.source === selectedSource;
    
    let matchesTab = true;
    switch (activeTab) {
      case 'pending':
        matchesTab = review.status === 'pending';
        break;
      case 'published':
        matchesTab = review.status === 'published';
        break;
      default:
        matchesTab = true;
    }
    
    return matchesSearch && matchesRating && matchesProduct && matchesSource && matchesTab;
  });

  // Analytics calculations
  const totalReviews = reviews.length;
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
  const pendingReviews = reviews.filter(r => r.status === 'pending').length;
  const publishedReviews = reviews.filter(r => r.status === 'published').length;
  const verifiedReviews = reviews.filter(r => r.verified).length;

  // Handle reply to review
  const handleReplyToReview = (review: Review) => {
    setSelectedReviewForReply(review);
    setShowReplyModal(true);
  };

  const handleSaveReply = (reviewId: string, replyMessage: string) => {
    setReviews(prevReviews =>
      prevReviews.map(review =>
        review.id === reviewId
          ? {
              ...review,
              response: {
                message: replyMessage,
                date: new Date().toISOString(),
                author: 'Brand Team'
              }
            }
          : review
      )
    );
  };

  // Handle view customer details
  const handleViewCustomerDetails = (customerEmail: string) => {
    setSelectedCustomerEmail(customerEmail);
    setShowCustomerModal(true);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      rejected: { color: 'bg-red-100 text-red-800', icon: AlertCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'QR Scan':
        return <Package className="w-4 h-4 text-blue-500" />;
      case 'Website':
        return <ExternalLink className="w-4 h-4 text-green-500" />;
      case 'Email Campaign':
        return <Mail className="w-4 h-4 text-purple-500" />;
      case 'Manual Entry':
        return <User className="w-4 h-4 text-gray-500" />;
      default:
        return <MessageSquare className="w-4 h-4 text-gray-500" />;
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const subTabs = [
    { id: 'all-reviews', label: 'All Reviews', count: totalReviews },
    { id: 'pending', label: 'Pending Review', count: pendingReviews },
    { id: 'published', label: 'Published', count: publishedReviews },
    { id: 'analytics', label: 'Analytics', count: null }
  ];

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex items-center text-green-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />
              +12%
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{totalReviews}</h3>
          <p className="text-gray-600">Total Reviews</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{averageRating.toFixed(1)}</h3>
          <p className="text-gray-600">Average Rating</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{verifiedReviews}</h3>
          <p className="text-gray-600">Verified Reviews</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{Math.round((verifiedReviews / totalReviews) * 100)}%</h3>
          <p className="text-gray-600">Verification Rate</p>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = reviews.filter(r => r.rating === rating).length;
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            
            return (
              <div key={rating} className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 w-16">
                  <span className="text-sm font-medium text-gray-700">{rating}</span>
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-12">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Products by Reviews */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products by Reviews</h3>
        <div className="space-y-4">
          {products.map((product, index) => {
            const productReviews = reviews.filter(r => r.productName === product);
            const avgRating = productReviews.length > 0 
              ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length 
              : 0;
            
            return (
              <div key={product} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-700">#{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{product}</h4>
                    <div className="flex items-center space-x-2">
                      {renderStars(Math.round(avgRating))}
                      <span className="text-sm text-gray-500">({productReviews.length} reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">{avgRating.toFixed(1)}</div>
                  <div className="text-sm text-gray-500">Avg Rating</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderReviewsTable = () => (
    <>
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer & Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating & Review</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredReviews.map((review) => (
              <tr key={review.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mr-3">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewCustomerDetails(review.email)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          {review.customerName}
                        </button>
                        {review.verified && (
                          <CheckCircle className="w-4 h-4 text-green-500" title="Verified Purchase" />
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{review.productName}</div>
                      {review.location && (
                        <div className="text-xs text-gray-400 flex items-center mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {review.location}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-600">({review.rating}/5)</span>
                    </div>
                    <div className="text-sm font-medium text-gray-900">{review.title}</div>
                    <div className="text-sm text-gray-600 max-w-xs truncate">{review.comment}</div>
                    
                    {/* Media Indicators */}
                    {((review.images && review.images.length > 0) || (review.videos && review.videos.length > 0)) && (
                      <div className="flex items-center space-x-2">
                        {review.images && review.images.length > 0 && (
                          <div className="flex items-center space-x-1 text-xs text-blue-600">
                            <ImageIcon className="w-3 h-3" />
                            <span>{review.images.length} photo{review.images.length > 1 ? 's' : ''}</span>
                          </div>
                        )}
                        {review.videos && review.videos.length > 0 && (
                          <div className="flex items-center space-x-1 text-xs text-purple-600">
                            <Play className="w-3 h-3" />
                            <span>{review.videos.length} video{review.videos.length > 1 ? 's' : ''}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {review.helpful > 0 && (
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <ThumbsUp className="w-3 h-3" />
                        <span>{review.helpful} helpful</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    {getSourceIcon(review.source)}
                    <span className="text-sm text-gray-900">{review.source}</span>
                  </div>
                </td>
                <td className="px-6 py-4">{getStatusBadge(review.status)}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {new Date(review.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button className="p-1 hover:bg-gray-100 rounded transition-colors" title="View Details">
                      <Eye className="w-4 h-4 text-gray-500" />
                    </button>
                    <button 
                      onClick={() => handleReplyToReview(review)}
                      className="p-1 hover:bg-blue-100 rounded transition-colors" 
                      title="Reply"
                    >
                      <Reply className="w-4 h-4 text-blue-500" />
                    </button>
                    <button 
                      onClick={() => handleViewCustomerDetails(review.email)}
                      className="p-1 hover:bg-green-100 rounded transition-colors" 
                      title="View Customer"
                    >
                      <UserCheck className="w-4 h-4 text-green-500" />
                    </button>
                    {review.status === 'pending' && (
                      <>
                        <button className="p-1 hover:bg-green-100 rounded transition-colors" title="Approve">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        </button>
                        <button className="p-1 hover:bg-red-100 rounded transition-colors" title="Reject">
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        </button>
                      </>
                    )}
                    <button className="p-1 hover:bg-red-100 rounded transition-colors" title="Flag">
                      <Flag className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
          <p className="text-gray-600">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>

    {/* Reply Modal */}
    <ReviewReplyModal
      review={selectedReviewForReply}
      isOpen={showReplyModal}
      onClose={() => {
        setShowReplyModal(false);
        setSelectedReviewForReply(null);
      }}
      onReply={handleSaveReply}
    />

    {/* Customer Details Modal */}
    <CustomerDetailsModal
      customerEmail={selectedCustomerEmail}
      allReviews={reviews}
      isOpen={showCustomerModal}
      onClose={() => {
        setShowCustomerModal(false);
        setSelectedCustomerEmail(null);
      }}
    />
    </>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Star className="w-8 h-8 mr-3 text-yellow-600" />
            Reviews Manager
          </h1>
          <p className="text-gray-600">Manage customer reviews and feedback across all products</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export Reviews
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="bg-white rounded-lg border border-gray-200 p-1">
        <div className="flex space-x-1">
          {subTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Analytics Tab */}
      {activeTab === 'analytics' ? renderAnalyticsTab() : (
        <>
          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search reviews..."
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <select
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Products</option>
                  {products.map(product => (
                    <option key={product} value={product}>{product}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
                <select
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Sources</option>
                  {sources.map(source => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Results</label>
                <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                  Showing {filteredReviews.length} of {totalReviews} reviews
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Table */}
          {renderReviewsTable()}
        </>
      )}
    </div>
  );
};

export default ReviewsManagerTab;