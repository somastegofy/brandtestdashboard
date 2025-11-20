import React from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Star, 
  Package, 
  ShoppingCart,
  MessageSquare,
  Award,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

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

interface CustomerDetailsModalProps {
  customerEmail: string | null;
  allReviews: Review[];
  isOpen: boolean;
  onClose: () => void;
}

const CustomerDetailsModal: React.FC<CustomerDetailsModalProps> = ({
  customerEmail,
  allReviews,
  isOpen,
  onClose
}) => {
  if (!isOpen || !customerEmail) return null;

  // Find customer details from the first review
  const customerReviews = allReviews.filter(review => review.email === customerEmail);
  const customer = customerReviews[0];
  
  if (!customer) return null;

  // Calculate customer statistics
  const totalReviews = customerReviews.length;
  const averageRating = customerReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
  const verifiedReviews = customerReviews.filter(review => review.verified).length;
  const publishedReviews = customerReviews.filter(review => review.status === 'published').length;
  const totalHelpfulVotes = customerReviews.reduce((sum, review) => sum + review.helpful, 0);

  // Get unique products reviewed
  const uniqueProducts = [...new Set(customerReviews.map(review => review.productName))];

  // Sort reviews by date (newest first)
  const sortedReviews = [...customerReviews].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{customer.customerName}</h3>
                <p className="text-sm text-gray-600">Customer Profile & Interaction History</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Modal Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Customer Information */}
            <div className="space-y-6">
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">Contact Information</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{customer.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{customer.mobile}</span>
                  </div>
                  {customer.location && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{customer.location}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      Customer since {new Date(sortedReviews[sortedReviews.length - 1]?.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Statistics */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">Customer Statistics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{totalReviews}</div>
                    <div className="text-xs text-gray-600">Total Reviews</div>
                  </div>
                  
                  <div className="bg-yellow-50 rounded-lg p-4 text-center">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Star className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
                    <div className="text-xs text-gray-600">Avg Rating</div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{verifiedReviews}</div>
                    <div className="text-xs text-gray-600">Verified</div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Award className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{totalHelpfulVotes}</div>
                    <div className="text-xs text-gray-600">Helpful Votes</div>
                  </div>
                </div>
              </div>

              {/* Products Reviewed */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">Products Reviewed</h4>
                <div className="space-y-2">
                  {uniqueProducts.map((product, index) => {
                    const productReviews = customerReviews.filter(r => r.productName === product);
                    const productAvgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
                    
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Package className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">{product}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {renderStars(Math.round(productAvgRating))}
                          <span className="text-xs text-gray-500">({productReviews.length})</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Interaction History */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-semibold text-gray-900">Interaction History</h4>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>{publishedReviews} published reviews</span>
                </div>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {sortedReviews.map((review, index) => (
                  <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          {renderStars(review.rating)}
                          <span className="text-sm text-gray-600">({review.rating}/5)</span>
                        </div>
                        {review.verified && (
                          <CheckCircle className="w-4 h-4 text-green-500" title="Verified Purchase" />
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(review.status)}
                        <span className="text-xs text-gray-500">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{review.productName}</span>
                      </div>
                      <h5 className="font-medium text-gray-900 mb-1">{review.title}</h5>
                      <p className="text-sm text-gray-700">{review.comment}</p>
                    </div>

                    {/* Media Attachments */}
                    {(review.images && review.images.length > 0) || (review.videos && review.videos.length > 0) ? (
                      <div className="mb-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-xs text-gray-500">Media attachments:</span>
                        </div>
                        <div className="flex space-x-2">
                          {review.images?.slice(0, 3).map((image, imgIndex) => (
                            <img
                              key={imgIndex}
                              src={image}
                              alt={`Review image ${imgIndex + 1}`}
                              className="w-12 h-12 object-cover rounded border border-gray-200"
                            />
                          ))}
                          {review.videos?.slice(0, 2).map((video, vidIndex) => (
                            <div key={vidIndex} className="relative">
                              <video
                                src={video}
                                className="w-12 h-12 object-cover rounded border border-gray-200"
                                muted
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-30 rounded flex items-center justify-center">
                                <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
                                  <div className="w-0 h-0 border-l-2 border-l-black border-y-1 border-y-transparent ml-0.5"></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {/* Brand Response */}
                    {review.response && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-600">B</span>
                          </div>
                          <span className="text-sm font-medium text-blue-900">{review.response.author}</span>
                          <span className="text-xs text-blue-600">
                            {new Date(review.response.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-blue-800">{review.response.message}</p>
                      </div>
                    )}

                    {/* Interaction Metrics */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Source: {review.source}</span>
                        {review.helpful > 0 && (
                          <span>{review.helpful} found helpful</span>
                        )}
                      </div>
                      {index === 0 && (
                        <span className="text-xs text-blue-600 font-medium">Latest</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsModal;