import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Check, 
  X, 
  MessageSquare,
  FileText,
  Receipt,
  Package,
  Calendar,
  MapPin,
  Smartphone,
  QrCode,
  Scan,
  Edit,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  ShoppingCart,
  Star,
  Award,
  Target,
  BarChart3,
  Plus,
  RefreshCw,
  Upload,
  Phone,
  Mail,
  User,
  Building,
  CreditCard,
  Zap,
  Globe,
  Tag,
  UserPlus,
  Shield,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';
import { Submission } from '../types/buyerSourceTypes';

interface BuyerSourceProofTabProps {
  submissions: Submission[];
  setSubmissions: React.Dispatch<React.SetStateAction<Submission[]>>;
  openSharedSubmissionDetailsModal: (submission: Submission, filteredList?: Submission[]) => void;
  closeSharedSubmissionDetailsModal: () => void;
}

const BuyerSourceProofTab: React.FC<BuyerSourceProofTabProps> = ({
  submissions,
  setSubmissions,
  openSharedSubmissionDetailsModal,
  closeSharedSubmissionDetailsModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSourceChannel, setSelectedSourceChannel] = useState('all');
  const [selectedScanSource, setSelectedScanSource] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [dateRange, setDateRange] = useState('last-30-days');
  const [activeSubTab, setActiveSubTab] = useState<'all-submissions' | 'pending-approvals' | 'approved-buyers' | 'rejected-submissions'>('all-submissions');

  const sourceChannels = ['Amazon', 'Flipkart', 'Zepto', 'Dmart', 'BigBasket', 'Swiggy Instamart', 'Blinkit', 'JioMart'];
  const scanSources = ['QR Code', 'Barcode', 'Manual Entry'];
  const products = ['Organic Honey 500g', 'Premium Tea 250g', 'Handmade Soap Pack', 'Natural Shampoo 400ml'];

  // Privacy masking functions
  const maskEmail = (email: string): string => {
    const [username, domain] = email.split('@');
    const maskedUsername = username.slice(0, 2) + '••••';
    return `${maskedUsername}@${domain}`;
  };

  const maskMobile = (mobile: string): string => {
    return '••••••' + mobile.slice(-4);
  };

  // Filter submissions based on active sub-tab
  const getFilteredSubmissions = () => {
    let statusFiltered = submissions;
    
    switch (activeSubTab) {
      case 'pending-approvals':
        statusFiltered = submissions.filter(s => s.rewardStatus === 'Pending');
        break;
      case 'approved-buyers':
        statusFiltered = submissions.filter(s => s.rewardStatus === 'Approved');
        break;
      case 'rejected-submissions':
        statusFiltered = submissions.filter(s => s.rewardStatus === 'Rejected');
        break;
      default:
        statusFiltered = submissions;
    }

    return statusFiltered.filter(submission => {
      const matchesSearch = 
        submission.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.productScanned.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSourceChannel = selectedSourceChannel === 'all' || submission.purchaseSource === selectedSourceChannel;
      const matchesScanSource = selectedScanSource === 'all' || submission.scanSource === selectedScanSource;
      const matchesProduct = selectedProduct === 'all' || submission.productScanned === selectedProduct;
      
      return matchesSearch && matchesSourceChannel && matchesScanSource && matchesProduct;
    });
  };

  const filteredSubmissions = getFilteredSubmissions();

  // Analytics data
  const totalSubmissions = submissions.length;
  const pendingSubmissions = submissions.filter(s => s.rewardStatus === 'Pending').length;
  const approvedSubmissions = submissions.filter(s => s.rewardStatus === 'Approved').length;
  const rejectedSubmissions = submissions.filter(s => s.rewardStatus === 'Rejected').length;
  const approvalRate = totalSubmissions > 0 ? Math.round((approvedSubmissions / totalSubmissions) * 100) : 0;

  const subTabs = [
    { id: 'all-submissions', label: 'All Submissions', icon: FileText, count: totalSubmissions },
    { id: 'pending-approvals', label: 'Pending Approvals', icon: Clock, count: pendingSubmissions },
    { id: 'approved-buyers', label: 'Approved Buyers', icon: CheckCircle, count: approvedSubmissions },
    { id: 'rejected-submissions', label: 'Rejected Submissions', icon: X, count: rejectedSubmissions }
  ];

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

  const openSubmissionDetails = (submission: Submission) => {
    openSharedSubmissionDetailsModal(submission, filteredSubmissions);
  };

  // Render table headers based on active sub-tab
  const renderTableHeaders = () => {
    const commonHeaders = ['Submission ID', 'Customer', 'Contact Info', 'Purchase Source', 'Product Scanned', 'Scan Source', 'Invoice'];
    
    switch (activeSubTab) {
      case 'pending-approvals':
        return ['Submission ID', 'Customer', 'Purchase Source', 'Product Scanned', 'Scan Source', 'Invoice', 'Campaign', 'Submission Date', 'Actions'];
      case 'approved-buyers':
        return ['Submission ID', 'Customer', 'Contact Info', 'Purchase Source', 'Product Scanned', 'Scan Source', 'Invoice', 'Reward Sent', 'Approval Date', 'Actions'];
      case 'rejected-submissions':
        return ['Submission ID', 'Customer', 'Purchase Source', 'Product Scanned', 'Scan Source', 'Invoice', 'Rejection Reason', 'Submission Date'];
      default:
        return [...commonHeaders, 'Status', 'Reward Sent', 'Submission Date', 'Actions'];
    }
  };

  // Render table row based on active sub-tab
  const renderTableRow = (submission: Submission) => {
    const isPending = submission.rewardStatus === 'Pending';
    const isApproved = submission.rewardStatus === 'Approved';
    const isRejected = submission.rewardStatus === 'Rejected';

    return (
      <tr 
        key={submission.id} 
        className="hover:bg-gray-50 cursor-pointer transition-colors"
        onClick={() => openSubmissionDetails(submission)}
      >
        {/* Submission ID */}
        <td className="px-6 py-4">
          <div className="text-sm font-medium text-gray-900">{submission.id}</div>
        </td>

        {/* Customer */}
        <td className="px-6 py-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mr-3">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">{submission.customerName}</div>
              {(activeSubTab === 'approved-buyers' || (activeSubTab === 'all-submissions' && submission.rewardStatus === 'Approved')) && (
                <div className="text-sm text-gray-500">{submission.location}</div>
              )}
            </div>
          </div>
        </td>

        {/* Contact Info - Only show for tabs that include contact info */}
        {(activeSubTab === 'all-submissions' || activeSubTab === 'approved-buyers') && (
          <td className="px-6 py-4">
            <div className="space-y-1">
              <div className="text-sm text-gray-900 flex items-center space-x-2">
                <Mail className="w-3 h-3" />
                <span>
                  {submission.rewardStatus === 'Approved' 
                    ? submission.email 
                    : maskEmail(submission.email)
                  }
                </span>
              </div>
              <div className="text-sm text-gray-900 flex items-center space-x-2">
                <Phone className="w-3 h-3" />
                <span>
                  {submission.rewardStatus === 'Approved' 
                    ? submission.mobileNumber 
                    : maskMobile(submission.mobileNumber)
                  }
                </span>
              </div>
            </div>
          </td>
        )}
        {/* Purchase Source */}
        <td className="px-6 py-4">
          <div className="flex items-center space-x-2">
            {getPurchaseSourceIcon(submission.purchaseSource)}
            <span className="text-sm font-medium text-gray-900">{submission.purchaseSource}</span>
          </div>
          {submission.location && activeSubTab !== 'approved-buyers' && !(activeSubTab === 'all-submissions' && submission.rewardStatus === 'Approved') && (
            <div className="text-xs text-gray-500 flex items-center space-x-1 mt-1">
              <MapPin className="w-3 h-3" />
              <span>{submission.location.split(',')[0]}</span>
            </div>
          )}
        </td>

        {/* Product Scanned */}
        <td className="px-6 py-4">
          <div className="text-sm font-medium text-gray-900">{submission.productScanned}</div>
          {submission.invoiceAmount && (
            <div className="text-xs text-gray-500">₹{submission.invoiceAmount}</div>
          )}
        </td>

        {/* Scan Source */}
        <td className="px-6 py-4">
          <div className="flex items-center space-x-2">
            {getScanSourceIcon(submission.scanSource)}
            <span className="text-sm text-gray-900">{submission.scanSource}</span>
          </div>
        </td>

        {/* Invoice */}
        <td className="px-6 py-4">
          {submission.invoiceUpload ? (
            <div className="flex items-center space-x-2">
              <button className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 transition-colors">
                <CheckCircle className="w-3 h-3 mr-1" />
                View
              </button>
            </div>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              <X className="w-3 h-3 mr-1" />
              Missing
            </span>
          )}
        </td>

        {/* Dynamic columns based on sub-tab */}
        {activeSubTab === 'pending-approvals' && (
          <>
            <td className="px-6 py-4">
              <div className="text-sm text-gray-900">{submission.campaignId || '-'}</div>
            </td>
            <td className="px-6 py-4">
              <div className="text-sm text-gray-900">
                {new Date(submission.submissionTimestamp).toLocaleDateString()}
              </div>
            </td>
            <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openSubmissionDetails(submission)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors" 
                  title="View Details"
                >
                  <Eye className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </td>
          </>
        )}

        {activeSubTab === 'approved-buyers' && (
          <>
            <td className="px-6 py-4">
              <div className="text-sm text-gray-900">{submission.rewardSent || '-'}</div>
            </td>
            <td className="px-6 py-4">
              <div className="text-sm text-gray-900">
                {new Date(submission.submissionTimestamp).toLocaleDateString()}
              </div>
            </td>
            <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center space-x-2">
                <button className="p-1 hover:bg-blue-100 rounded transition-colors" title="Tag Consumer">
                  <Tag className="w-4 h-4 text-blue-500" />
                </button>
                <button className="p-1 hover:bg-purple-100 rounded transition-colors" title="Export to CRM">
                  <ExternalLink className="w-4 h-4 text-purple-500" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded transition-colors" title="View Profile">
                  <UserPlus className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </td>
          </>
        )}

        {activeSubTab === 'rejected-submissions' && (
          <>
            <td className="px-6 py-4">
              <div className="text-sm text-red-600">{submission.rejectionReason || '-'}</div>
            </td>
            <td className="px-6 py-4">
              <div className="text-sm text-gray-900">
                {new Date(submission.submissionTimestamp).toLocaleDateString()}
              </div>
            </td>
          </>
        )}

        {activeSubTab === 'all-submissions' && (
          <>
            <td className="px-6 py-4">{getStatusBadge(submission.rewardStatus)}</td>
            <td className="px-6 py-4">
              <div className="text-sm text-gray-900">{submission.rewardSent || '-'}</div>
            </td>
            <td className="px-6 py-4">
              <div className="text-sm text-gray-900">
                {new Date(submission.submissionTimestamp).toLocaleDateString()}
              </div>
            </td>
            <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openSubmissionDetails(submission)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors" 
                  title="View Details"
                >
                  <Eye className="w-4 h-4 text-gray-500" />
                </button>
                {submission.invoiceUpload && (
                  <button className="p-1 hover:bg-blue-100 rounded transition-colors" title="View Invoice">
                    <ExternalLink className="w-4 h-4 text-blue-500" />
                  </button>
                )}
              </div>
            </td>
          </>
        )}
      </tr>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Receipt className="w-8 h-8 mr-3 text-blue-600" />
            Buyer Source & Proof
          </h1>
          <p className="text-gray-600">Manage user submissions from QR/barcode/manual scans with invoice upload, consumer data, and reward linkage</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex items-center text-green-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />
              +12%
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{totalSubmissions}</h3>
          <p className="text-gray-600">Total Submissions</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{pendingSubmissions}</h3>
          <p className="text-gray-600">Pending Review</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{approvedSubmissions}</h3>
          <p className="text-gray-600">Approved</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <X className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{rejectedSubmissions}</h3>
          <p className="text-gray-600">Rejected</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{approvalRate}%</h3>
          <p className="text-gray-600">Approval Rate</p>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="bg-white rounded-lg border border-gray-200 p-1">
        <div className="flex space-x-1">
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-4 h-4 mr-2 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                <span>{tab.label}</span>
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

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
                placeholder="Search submissions..."
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Source Channel</label>
            <select
              value={selectedSourceChannel}
              onChange={(e) => setSelectedSourceChannel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Channels</option>
              {sourceChannels.map(channel => (
                <option key={channel} value={channel}>{channel}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Scan Source</label>
            <select
              value={selectedScanSource}
              onChange={(e) => setSelectedScanSource(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Sources</option>
              {scanSources.map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="today">Today</option>
              <option value="last-7-days">Last 7 days</option>
              <option value="last-30-days">Last 30 days</option>
              <option value="last-90-days">Last 90 days</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
        </div>
      </div>

      {/* Privacy Notice for Pending Approvals */}
      {activeSubTab === 'pending-approvals' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-yellow-900">Privacy Protection Active</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Customer contact information is masked in the table view. Click on any row to view full details for approval/rejection.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Submissions Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {renderTableHeaders().map((header, index) => (
                  <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubmissions.map(renderTableRow)}
            </tbody>
          </table>
        </div>

        {filteredSubmissions.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerSourceProofTab;