import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  UserPlus, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  BarChart3, 
  Star, 
  Award, 
  ShoppingCart, 
  Package, 
  Zap, 
  Building, 
  Globe, 
  Target, 
  QrCode, 
  Scan, 
  Edit, 
  FileText, 
  CheckCircle, 
  Clock, 
  X, 
  ExternalLink, 
  Tag, 
  Shield, 
  Info,
  RefreshCw,
  UserCheck,
  Heart,
  MessageSquare,
  Repeat,
  Crown,
  Plus,
  ChevronDown,
  ChevronUp,
  Check,
  DollarSign,
  Gift,
  Activity,
  Calendar as CalendarIcon,
  TrendingDown
} from 'lucide-react';
import { Submission } from '../types/buyerSourceTypes';

interface ConsumersTabProps {
  submissions: Submission[];
  openSharedSubmissionDetailsModal: (submission: Submission, filteredList?: Submission[]) => void;
  closeSharedSubmissionDetailsModal: () => void;
  onTabChange: (tab: string) => void;
}

const ConsumersTab: React.FC<ConsumersTabProps> = ({
  submissions,
  openSharedSubmissionDetailsModal,
  closeSharedSubmissionDetailsModal,
  onTabChange
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'anonymous-viewers' | 'known-leads' | 'repeat-scanners' | 'top-reviewers' | 'verified-buyers'>('known-leads');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPurchaseChannel, setSelectedPurchaseChannel] = useState('all');
  const [showOnlyVerifiedBuyers, setShowOnlyVerifiedBuyers] = useState(false);
  const [showCampaignDropdown, setShowCampaignDropdown] = useState(false);
  const [selectedCampaignAudiences, setSelectedCampaignAudiences] = useState<string[]>([]);

  // Purchase channel options
  const purchaseChannels = [
    'Amazon', 'Flipkart', 'Zepto', 'Blinkit', 'Brand Website', 
    'Swiggy Instamart', 'Dmart', 'Reliance Smart Bazaar', 'More Supermarket', 'Other'
  ];

  // Campaign target groups
  const campaignTargetGroups = [
    { id: 'anonymous-viewers', label: 'Anonymous Viewers', type: 'paid', icon: Eye },
    { id: 'known-leads', label: 'Known Leads', type: 'free', icon: Users },
    { id: 'repeat-scanners', label: 'Repeat Scanners', type: 'paid', icon: Repeat },
    { id: 'top-reviewers', label: 'Top Reviewers', type: 'free', icon: Crown },
    { id: 'verified-buyers', label: 'Verified Buyers', type: 'free', icon: Shield },
    { id: 'product-reviewers', label: 'Product Reviewers', type: 'free', icon: Star },
    { id: 'reward-claimers', label: 'Reward Claimers', type: 'free', icon: Award },
  ];

  // Privacy masking functions
  const maskEmail = (email: string): string => {
    const [username, domain] = email.split('@');
    const maskedUsername = username.slice(0, 2) + '••••';
    return `${maskedUsername}@${domain}`;
  };

  const maskMobile = (mobile: string): string => {
    return '••••••' + mobile.slice(-4);
  };

  // Get verified buyers (approved submissions)
  const verifiedBuyers = submissions.filter(s => s.rewardStatus === 'Approved');
  
  // Get known leads (all submissions with contact info)
  const knownLeads = submissions;

  // Sample data for other tabs
  const anonymousViewers = [
    { id: 'AV-001', location: 'Mumbai, Maharashtra', scanCount: 3, lastSeen: '2024-01-20T14:30:00Z', deviceType: 'Mobile' },
    { id: 'AV-002', location: 'Delhi, NCR', scanCount: 1, lastSeen: '2024-01-19T16:45:00Z', deviceType: 'Desktop' },
    { id: 'AV-003', location: 'Bangalore, Karnataka', scanCount: 5, lastSeen: '2024-01-18T11:20:00Z', deviceType: 'Mobile' }
  ];

  const repeatScanners = [
    { id: 'RS-001', name: 'Frequent Scanner 1', scanCount: 15, products: ['Organic Honey', 'Premium Tea'], lastScan: '2024-01-20T14:30:00Z' },
    { id: 'RS-002', name: 'Frequent Scanner 2', scanCount: 12, products: ['Handmade Soap'], lastScan: '2024-01-19T16:45:00Z' }
  ];

  const topReviewers = [
    { id: 'TR-001', name: 'Top Reviewer 1', reviewCount: 8, rating: 4.8, lastReview: '2024-01-20T14:30:00Z' },
    { id: 'TR-002', name: 'Top Reviewer 2', reviewCount: 6, rating: 4.9, lastReview: '2024-01-19T16:45:00Z' }
  ];

  // Calculate analytics metrics
  const totalViewersCount = anonymousViewers.length + knownLeads.length;
  const rewardClaimersCount = submissions.filter(s => s.rewardSent && s.rewardStatus === 'Approved').length;
  const productReviewersCount = topReviewers.length;

  // Filter data based on current filters
  const getFilteredData = () => {
    let data: any[] = [];
    
    switch (activeSubTab) {
      case 'anonymous-viewers':
        data = anonymousViewers;
        break;
      case 'repeat-scanners':
        data = repeatScanners;
        break;
      case 'top-reviewers':
        data = topReviewers;
        break;
      case 'verified-buyers':
        data = verifiedBuyers;
        break;
      case 'known-leads':
        data = showOnlyVerifiedBuyers ? verifiedBuyers : knownLeads;
        break;
      default:
        data = knownLeads;
    }

    // Apply search filter
    if (searchTerm) {
      data = data.filter(item => {
        const searchLower = searchTerm.toLowerCase();
        
        switch (activeSubTab) {
          case 'anonymous-viewers':
            return item.id.toLowerCase().includes(searchLower) ||
                   item.location.toLowerCase().includes(searchLower) ||
                   item.deviceType.toLowerCase().includes(searchLower);
          
          case 'repeat-scanners':
            return item.name.toLowerCase().includes(searchLower) ||
                   item.products.some((product: string) => product.toLowerCase().includes(searchLower));
          
          case 'top-reviewers':
            return item.name.toLowerCase().includes(searchLower);
          
          case 'known-leads':
          case 'verified-buyers':
            return item.customerName.toLowerCase().includes(searchLower) ||
                   item.email.toLowerCase().includes(searchLower) ||
                   item.productScanned.toLowerCase().includes(searchLower);
          
          default:
            return true;
        }
      });
    }

    // Apply purchase channel filter
    if (selectedPurchaseChannel !== 'all' && (activeSubTab === 'known-leads' || activeSubTab === 'verified-buyers')) {
      data = data.filter(submission => submission.purchaseSource === selectedPurchaseChannel);
    }

    return data;
  };

  const filteredData = getFilteredData();

  // Helper function to get search placeholder based on active tab
  const getSearchPlaceholder = () => {
    switch (activeSubTab) {
      case 'anonymous-viewers':
        return 'Search by viewer ID, location, or device...';
      case 'repeat-scanners':
        return 'Search by name or products...';
      case 'top-reviewers':
        return 'Search by reviewer name...';
      case 'known-leads':
      case 'verified-buyers':
        return 'Search by name, email, or product...';
      default:
        return 'Search consumers...';
    }
  };

  // Helper function to get unfiltered count for current tab
  const getUnfilteredCount = () => {
    switch (activeSubTab) {
      case 'anonymous-viewers':
        return anonymousViewers.length;
      case 'repeat-scanners':
        return repeatScanners.length;
      case 'top-reviewers':
        return topReviewers.length;
      case 'verified-buyers':
        return verifiedBuyers.length;
      case 'known-leads':
        return showOnlyVerifiedBuyers ? verifiedBuyers.length : knownLeads.length;
      default:
        return knownLeads.length;
    }
  };

  // Sub-tab configuration
  const subTabs = [
    { 
      id: 'anonymous-viewers', 
      label: 'Anonymous Viewers', 
      icon: Eye, 
      count: anonymousViewers.length,
      description: 'Users who scanned without providing contact info'
    },
    { 
      id: 'known-leads', 
      label: 'Known Leads', 
      icon: Users, 
      count: knownLeads.length,
      description: 'Users who provided contact information'
    },
    { 
      id: 'repeat-scanners', 
      label: 'Repeat Scanners', 
      icon: Repeat, 
      count: repeatScanners.length,
      description: 'Users with multiple product scans'
    },
    { 
      id: 'top-reviewers', 
      label: 'Top Reviewers', 
      icon: Crown, 
      count: topReviewers.length,
      description: 'Users with highest review activity'
    },
    { 
      id: 'verified-buyers', 
      label: 'Verified Buyers', 
      icon: Shield, 
      count: verifiedBuyers.length,
      description: 'Invoice-verified customers'
    }
  ];

  // Handle campaign audience selection
  const handleCampaignAudienceToggle = (audienceId: string) => {
    setSelectedCampaignAudiences(prev => 
      prev.includes(audienceId) 
        ? prev.filter(id => id !== audienceId)
        : [...prev, audienceId]
    );
  };

  const handleCreateCampaign = () => {
    if (selectedCampaignAudiences.length === 0) return;
    
    // Determine if campaign is paid or free
    const isPaidCampaign = selectedCampaignAudiences.some(audienceId => 
      campaignTargetGroups.find(group => group.id === audienceId)?.type === 'paid'
    );
    
    // Store campaign data in localStorage for the rewards tab to pick up
    localStorage.setItem('pendingCampaignData', JSON.stringify({
      audiences: selectedCampaignAudiences,
      isPaid: isPaidCampaign,
      timestamp: Date.now()
    }));
    
    // Reset selections and close dropdown
    setSelectedCampaignAudiences([]);
    setShowCampaignDropdown(false);
    
    // Navigate to rewards & campaigns tab
    onTabChange('rewards-campaigns');
  };

  // Icon helpers
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

  // Render different table content based on active sub-tab
  const renderTableContent = () => {
    if (activeSubTab === 'anonymous-viewers') {
      return (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Viewer ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scan Count</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Seen</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {anonymousViewers.map((viewer) => (
                <tr key={viewer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{viewer.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    {viewer.location}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{viewer.scanCount}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{viewer.deviceType}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(viewer.lastSeen).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeSubTab === 'repeat-scanners') {
      return (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scanner</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Scans</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products Scanned</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Scan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {repeatScanners.map((scanner) => (
                <tr key={scanner.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center mr-3">
                        <Repeat className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{scanner.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{scanner.scanCount}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{scanner.products.join(', ')}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(scanner.lastScan).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                      <Eye className="w-4 h-4 text-gray-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeSubTab === 'top-reviewers') {
      return (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reviewer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review Count</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Review</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topReviewers.map((reviewer) => (
                <tr key={reviewer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center mr-3">
                        <Crown className="w-5 h-5 text-yellow-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{reviewer.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{reviewer.reviewCount}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm text-gray-900">{reviewer.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(reviewer.lastReview).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                      <MessageSquare className="w-4 h-4 text-gray-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // Known Leads and Verified Buyers table
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Channel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Scanned</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice Source</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified Buyer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link to Proof</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((submission) => (
              <tr key={submission.id} className="hover:bg-gray-50">
                {/* Customer */}
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mr-3">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{submission.customerName}</div>
                      <div className="text-sm text-gray-500">{submission.location}</div>
                    </div>
                  </div>
                </td>

                {/* Contact Info */}
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div 
                      className="text-sm text-gray-900 flex items-center space-x-2 cursor-pointer group"
                      title={`Purchase Date: ${new Date(submission.submissionTimestamp).toLocaleDateString()}\nSubmitted Proof: ${submission.invoiceUpload ? 'Yes' : 'No'}\nInvoice Status: ${submission.rewardStatus}`}
                    >
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
                    <div className="text-xs text-gray-500">
                      Preferred: {submission.purchaseSource}
                    </div>
                  </div>
                </td>

                {/* Purchase Channel */}
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    {getPurchaseSourceIcon(submission.purchaseSource)}
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {submission.purchaseSource}
                    </span>
                  </div>
                </td>

                {/* Product Scanned */}
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{submission.productScanned}</div>
                  {submission.invoiceAmount && (
                    <div className="text-xs text-gray-500">₹{submission.invoiceAmount}</div>
                  )}
                </td>

                {/* Invoice Source */}
                <td className="px-6 py-4">
                  <div 
                    className="flex items-center space-x-2 cursor-pointer"
                    title="Submitted via Buyer Proof"
                  >
                    {getScanSourceIcon(submission.scanSource)}
                    <span className="text-xs text-gray-500">Buyer Proof</span>
                  </div>
                </td>

                {/* Verified Buyer */}
                <td className="px-6 py-4">
                  {submission.rewardStatus === 'Approved' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      ✅ Verified
                    </span>
                  ) : (
                    getStatusBadge(submission.rewardStatus)
                  )}
                </td>

                {/* Link to Proof */}
                <td className="px-6 py-4">
                  <button
                    onClick={() => openSharedSubmissionDetailsModal(submission)}
                    className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    🔗 View Proof
                  </button>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    {submission.rewardStatus === 'Approved' && (
                      <>
                        <button className="p-1 hover:bg-blue-100 rounded transition-colors" title="Tag Consumer">
                          <Tag className="w-4 h-4 text-blue-500" />
                        </button>
                        <button className="p-1 hover:bg-purple-100 rounded transition-colors" title="Export to CRM">
                          <ExternalLink className="w-4 h-4 text-purple-500" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors" title="View Profile">
                          <UserPlus className="w-4 h-4 text-gray-500" />
                        </button>
                      </>
                    )}
                    <button className="p-1 hover:bg-gray-100 rounded transition-colors" title="View Details">
                      <Eye className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Users className="w-8 h-8 mr-3 text-blue-600" />
            Consumers
          </h1>
          <p className="text-gray-600">Manage and analyze your customer base across all touchpoints</p>
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
          
          {/* Create Campaign Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowCampaignDropdown(!showCampaignDropdown)}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
              {showCampaignDropdown ? (
                <ChevronUp className="w-4 h-4 ml-2" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-2" />
              )}
            </button>
            
            {showCampaignDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Select Target Audiences</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {campaignTargetGroups.map((group) => {
                      const Icon = group.icon;
                      const isSelected = selectedCampaignAudiences.includes(group.id);
                      const isPaid = group.type === 'paid';
                      
                      return (
                        <label
                          key={group.id}
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                            isSelected ? 'bg-blue-50 border-blue-200' : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleCampaignAudienceToggle(group.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <Icon className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-900">{group.label}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {isPaid ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                <DollarSign className="w-3 h-3 mr-1" />
                                Paid
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <Gift className="w-3 h-3 mr-1" />
                                Free
                              </span>
                            )}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                  
                  {selectedCampaignAudiences.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-600">
                          {selectedCampaignAudiences.length} audience(s) selected
                        </span>
                        {selectedCampaignAudiences.some(id => 
                          campaignTargetGroups.find(g => g.id === id)?.type === 'paid'
                        ) && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            <DollarSign className="w-3 h-3 mr-1" />
                            Paid Campaign
                          </span>
                        )}
                      </div>
                      <button
                        onClick={handleCreateCampaign}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Go to Campaigns
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Privacy and Consent Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-900">Privacy & Consent</h4>
            <p className="text-sm text-blue-700 mt-1">
              Stegofy prioritizes consumer trust. Only opted-in user data is shared. Anonymous behavioural insights help your brand experience without compromising privacy.
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex items-center text-green-600 text-xs font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12%
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{totalViewersCount}</h3>
          <p className="text-xs text-gray-600">Total Viewers</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-gray-600" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{anonymousViewers.length}</h3>
          <p className="text-xs text-gray-600">Anonymous Viewers</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex items-center text-green-600 text-xs font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              +8%
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{knownLeads.length}</h3>
          <p className="text-xs text-gray-600">Known Leads</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Repeat className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{repeatScanners.length}</h3>
          <p className="text-xs text-gray-600">Repeat Scanners</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Crown className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{topReviewers.length}</h3>
          <p className="text-xs text-gray-600">Top Reviewers</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex items-center text-green-600 text-xs font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              +15%
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{verifiedBuyers.length}</h3>
          <p className="text-xs text-gray-600">Verified Buyers</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{productReviewersCount}</h3>
          <p className="text-xs text-gray-600">Product Reviewers</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex items-center text-green-600 text-xs font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              +23%
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{rewardClaimersCount}</h3>
          <p className="text-xs text-gray-600">Reward Claimers</p>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="bg-white rounded-lg border border-gray-200 p-1">
        <div className="flex space-x-1 overflow-x-auto">
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex-shrink-0 flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={getSearchPlaceholder()}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Channel</label>
            <select
              value={selectedPurchaseChannel}
              onChange={(e) => setSelectedPurchaseChannel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={activeSubTab !== 'known-leads' && activeSubTab !== 'verified-buyers'}
            >
              <option value="all">All Channels</option>
              {purchaseChannels.map(channel => (
                <option key={channel} value={channel}>{channel}</option>
              ))}
            </select>
            {(activeSubTab !== 'known-leads' && activeSubTab !== 'verified-buyers') && (
              <p className="text-xs text-gray-500 mt-1">Not applicable for this consumer type</p>
            )}
          </div>
          
          <div className="flex items-end">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlyVerifiedBuyers}
                onChange={(e) => setShowOnlyVerifiedBuyers(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={activeSubTab !== 'known-leads'}
              />
              <div>
                <span className={`text-sm font-medium ${activeSubTab !== 'known-leads' ? 'text-gray-400' : 'text-gray-700'}`}>
                  Show Only Verified Buyers
                </span>
                <p className="text-xs text-gray-500">
                  {activeSubTab !== 'known-leads' ? 'Only available for Known Leads' : 'Filter to invoice-approved customers'}
                </p>
              </div>
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter Results</label>
            <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
              Showing {filteredData.length} of {getUnfilteredCount()} {activeSubTab.replace('-', ' ')}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Description */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900">
              {subTabs.find(tab => tab.id === activeSubTab)?.label}
            </h4>
            <p className="text-sm text-blue-700 mt-1">
              {subTabs.find(tab => tab.id === activeSubTab)?.description}
            </p>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {renderTableContent()}

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No consumers found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>

      {/* Engagement Funnel */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Activity className="w-6 h-6 mr-2 text-blue-600" />
            Engagement Funnel
          </h2>
          <button className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
            View Details
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Eye className="w-8 h-8 text-gray-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{totalViewersCount}</div>
            <div className="text-xs text-gray-600">Total Views</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{knownLeads.length}</div>
            <div className="text-xs text-gray-600">Known Leads</div>
            <div className="text-xs text-green-600">
              {totalViewersCount > 0 ? Math.round((knownLeads.length / totalViewersCount) * 100) : 0}%
            </div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Repeat className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{repeatScanners.length}</div>
            <div className="text-xs text-gray-600">Repeat Scans</div>
            <div className="text-xs text-green-600">
              {knownLeads.length > 0 ? Math.round((repeatScanners.length / knownLeads.length) * 100) : 0}%
            </div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Crown className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{topReviewers.length}</div>
            <div className="text-xs text-gray-600">Top Reviewers</div>
            <div className="text-xs text-green-600">
              {knownLeads.length > 0 ? Math.round((topReviewers.length / knownLeads.length) * 100) : 0}%
            </div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{verifiedBuyers.length}</div>
            <div className="text-xs text-gray-600">Verified Buyers</div>
            <div className="text-xs text-green-600">
              {knownLeads.length > 0 ? Math.round((verifiedBuyers.length / knownLeads.length) * 100) : 0}%
            </div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Star className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{productReviewersCount}</div>
            <div className="text-xs text-gray-600">Product Reviews</div>
            <div className="text-xs text-green-600">
              {verifiedBuyers.length > 0 ? Math.round((productReviewersCount / verifiedBuyers.length) * 100) : 0}%
            </div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Award className="w-8 h-8 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{rewardClaimersCount}</div>
            <div className="text-xs text-gray-600">Reward Claims</div>
            <div className="text-xs text-green-600">
              {verifiedBuyers.length > 0 ? Math.round((rewardClaimersCount / verifiedBuyers.length) * 100) : 0}%
            </div>
          </div>
        </div>
      </div>

      {/* New Leads by Week */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <CalendarIcon className="w-6 h-6 mr-2 text-green-600" />
            New Leads by Week
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">This Week</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <span className="text-sm text-gray-600">Previous Week</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-4 mb-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
            <div key={day} className="text-center">
              <div className="text-xs text-gray-500 mb-2">{day}</div>
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-20 flex items-end justify-center">
                  <div 
                    className="bg-green-500 rounded-full transition-all duration-300"
                    style={{ 
                      width: '60%', 
                      height: `${Math.random() * 60 + 20}%` 
                    }}
                  ></div>
                </div>
                <div className="text-sm font-medium text-gray-900 mt-2">
                  {Math.floor(Math.random() * 50) + 10}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span>+23% vs last week</span>
          </div>
          <div>
            Total this week: <span className="font-medium text-gray-900">247 leads</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsumersTab;