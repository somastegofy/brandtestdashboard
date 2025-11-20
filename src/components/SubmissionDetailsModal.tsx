import React, { useState } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  ShoppingCart, 
  FileText, 
  Award, 
  Check, 
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Clock,
  QrCode,
  Scan,
  Edit,
  Package,
  Zap,
  Building,
  Globe,
  Target,
  Mail,
  Phone,
  MapPin,
  Tag,
  UserPlus
} from 'lucide-react';
import { Submission } from '../types/buyerSourceTypes';

interface SubmissionDetailsModalProps {
  submission: Submission | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (submissionId: string, comment: string) => void;
  onReject: (submissionId: string, reason: string) => void;
  onNavigate?: (direction: 'prev' | 'next') => void;
  currentIndex?: number;
  totalCount?: number;
  canNavigate?: boolean;
}

const SubmissionDetailsModal: React.FC<SubmissionDetailsModalProps> = ({
  submission,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onNavigate,
  currentIndex = -1,
  totalCount = 0,
  canNavigate = false
}) => {
  const [approvalComment, setApprovalComment] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  if (!isOpen || !submission) return null;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      Rejected: { color: 'bg-red-100 text-red-800', icon: X },
      Pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  const getScanSourceIcon = (source: string) => {
    switch (source) {
      case 'QR Code':
        return <QrCode className="w-4 h-4 text-blue-500" />;
      case 'Barcode':
        return <Scan className="w-4 h-4 text-green-500" />;
      case 'Manual Entry':
        return <Edit className="w-4 h-4 text-purple-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPurchaseSourceIcon = (source: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'Amazon': <ShoppingCart className="w-4 h-4 text-orange-500" />,
      'Flipkart': <Package className="w-4 h-4 text-blue-500" />,
      'Zepto': <Zap className="w-4 h-4 text-purple-500" />,
      'Dmart': <Building className="w-4 h-4 text-red-500" />,
      'BigBasket': <ShoppingCart className="w-4 h-4 text-green-500" />,
      'Swiggy Instamart': <Globe className="w-4 h-4 text-orange-600" />,
      'Blinkit': <Target className="w-4 h-4 text-yellow-500" />,
      'JioMart': <Building className="w-4 h-4 text-blue-600" />
    };
    return iconMap[source] || <ShoppingCart className="w-4 h-4 text-gray-500" />;
  };

  const handleApprove = () => {
    onApprove(submission.id, approvalComment);
    setApprovalComment('');
    onClose();
  };

  const handleReject = () => {
    onReject(submission.id, rejectionReason);
    setRejectionReason('');
    onClose();
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (onNavigate) {
      onNavigate(direction);
      setApprovalComment('');
      setRejectionReason('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold text-gray-900">Submission Details</h3>
              {getStatusBadge(submission.rewardStatus)}
            </div>
            <div className="flex items-center space-x-3">
              {/* Navigation Controls */}
              {canNavigate && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleNavigate('prev')}
                    disabled={currentIndex === 0}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Previous submission"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-500 px-2">
                    {currentIndex + 1} of {totalCount}
                  </span>
                  <button
                    onClick={() => handleNavigate('next')}
                    disabled={currentIndex === totalCount - 1}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Next submission"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Modal Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Customer Information */}
            <div className="space-y-6">
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Customer Information
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Submission ID:</span>
                    <span className="text-sm text-gray-900">{submission.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Customer Name:</span>
                    <span className="text-sm text-gray-900">{submission.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Email:</span>
                    <span className="text-sm text-gray-900">{submission.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Mobile Number:</span>
                    <span className="text-sm text-gray-900">{submission.mobileNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Location:</span>
                    <span className="text-sm text-gray-900">{submission.location}</span>
                  </div>
                </div>
              </div>

              {/* Purchase Information */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2 text-green-600" />
                  Purchase Information
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Purchase Source:</span>
                    <div className="flex items-center space-x-2">
                      {getPurchaseSourceIcon(submission.purchaseSource)}
                      <span className="text-sm text-gray-900">{submission.purchaseSource}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Product Scanned:</span>
                    <span className="text-sm text-gray-900">{submission.productScanned}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Scan Source:</span>
                    <div className="flex items-center space-x-2">
                      {getScanSourceIcon(submission.scanSource)}
                      <span className="text-sm text-gray-900">{submission.scanSource}</span>
                    </div>
                  </div>
                  {submission.invoiceAmount && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">Invoice Amount:</span>
                      <span className="text-sm text-gray-900">₹{submission.invoiceAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Submission Date:</span>
                    <span className="text-sm text-gray-900">
                      {new Date(submission.submissionTimestamp).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice and Campaign Information */}
            <div className="space-y-6">
              {/* Invoice Upload */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-purple-600" />
                  Invoice Upload
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  {submission.invoiceUpload ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Invoice uploaded</p>
                          <p className="text-xs text-gray-500">Click to view full invoice</p>
                        </div>
                      </div>
                      <button
                        onClick={() => window.open(submission.invoiceUpload!, '_blank')}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Invoice
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                      <p className="text-sm text-red-600 font-medium">No invoice uploaded</p>
                      <p className="text-xs text-gray-500">Customer did not provide invoice</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Campaign and Reward Information */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-orange-600" />
                  Campaign & Reward
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Campaign ID:</span>
                    <span className="text-sm text-gray-900">{submission.campaignId || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Reward Status:</span>
                    {getStatusBadge(submission.rewardStatus)}
                  </div>
                  {submission.rewardSent && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">Reward Sent:</span>
                      <span className="text-sm text-gray-900">{submission.rewardSent}</span>
                    </div>
                  )}
                  {submission.approvalComment && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Approval Comment:</span>
                      <p className="text-sm text-gray-900 mt-1 p-2 bg-green-50 rounded border-l-4 border-green-400">
                        {submission.approvalComment}
                      </p>
                    </div>
                  )}
                  {submission.rejectionReason && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Rejection Reason:</span>
                      <p className="text-sm text-gray-900 mt-1 p-2 bg-red-50 rounded border-l-4 border-red-400">
                        {submission.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions for Pending Submissions */}
              {submission.rewardStatus === 'Pending' && (
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Review Actions</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comment/Reason
                      </label>
                      <textarea
                        value={approvalComment || rejectionReason}
                        onChange={(e) => {
                          setApprovalComment(e.target.value);
                          setRejectionReason(e.target.value);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20 resize-none"
                        placeholder="Enter your comment or reason..."
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleReject}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Reject
                      </button>
                      <button
                        onClick={handleApprove}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Approve
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions for Approved Submissions */}
              {submission.rewardStatus === 'Approved' && (
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Customer Actions</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <button className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Tag className="w-4 h-4 mr-2" />
                      Tag Consumer
                    </button>
                    <button className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Export to CRM
                    </button>
                    <button className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <UserPlus className="w-4 h-4 mr-2" />
                      View Consumer Profile
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetailsModal;