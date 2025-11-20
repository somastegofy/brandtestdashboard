import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Star, 
  User, 
  Calendar, 
  MapPin, 
  Package,
  Image as ImageIcon,
  Play,
  CheckCircle
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

interface ReviewReplyModalProps {
  review: Review | null;
  isOpen: boolean;
  onClose: () => void;
  onReply: (reviewId: string, replyMessage: string) => void;
}

const ReviewReplyModal: React.FC<ReviewReplyModalProps> = ({
  review,
  isOpen,
  onClose,
  onReply
}) => {
  const [replyMessage, setReplyMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !review) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onReply(review.id, replyMessage.trim());
    setReplyMessage('');
    setIsSubmitting(false);
    onClose();
  };

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Reply to Review</h3>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Original Review */}
            <div className="space-y-6">
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">Original Review</h4>
                
                {/* Customer Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{review.customerName}</span>
                        {review.verified && (
                          <CheckCircle className="w-4 h-4 text-green-500" title="Verified Purchase" />
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{review.email}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{review.productName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{new Date(review.date).toLocaleDateString()}</span>
                    </div>
                    {review.location && (
                      <div className="flex items-center space-x-2 col-span-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{review.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Review Content */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    {renderStars(review.rating)}
                    <span className="text-sm text-gray-600">({review.rating}/5)</span>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>

                  {/* Media Attachments */}
                  {(review.images && review.images.length > 0) || (review.videos && review.videos.length > 0) ? (
                    <div>
                      <h6 className="text-sm font-medium text-gray-900 mb-3">Customer Media</h6>
                      <div className="grid grid-cols-2 gap-3">
                        {review.images?.map((image, index) => (
                          <div key={`img-${index}`} className="relative group">
                            <img
                              src={image}
                              alt={`Review image ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-gray-200"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                              <ImageIcon className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        ))}
                        {review.videos?.map((video, index) => (
                          <div key={`vid-${index}`} className="relative group">
                            <video
                              src={video}
                              className="w-full h-24 object-cover rounded-lg border border-gray-200"
                              muted
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg flex items-center justify-center">
                              <Play className="w-6 h-6 text-white" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {/* Existing Response */}
                  {review.response && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
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
                </div>
              </div>
            </div>

            {/* Reply Form */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-4">
                {review.response ? 'Update Your Response' : 'Write Your Response'}
              </h4>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Reply
                  </label>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32 resize-none"
                    placeholder={review.response ? "Update your response..." : "Thank you for your review! We appreciate your feedback..."}
                    required
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-blue-900 mb-2">Response Tips</h5>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Thank the customer for their feedback</li>
                    <li>• Address specific concerns mentioned in the review</li>
                    <li>• Keep your response professional and helpful</li>
                    <li>• Offer solutions or next steps if applicable</li>
                  </ul>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!replyMessage.trim() || isSubmitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        {review.response ? 'Update Reply' : 'Send Reply'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewReplyModal;