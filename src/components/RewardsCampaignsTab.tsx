import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Play, 
  Pause, 
  Copy,
  Save,
  Gift,
  Target,
  Shield,
  BarChart3,
  Calendar,
  MapPin,
  Clock,
  Users,
  Zap,
  Award,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Download,
  Upload,
  Link,
  Settings,
  X,
  ChevronDown,
  ToggleLeft,
  ToggleRight,
  Star,
  Coins,
  Ticket,
  Heart,
  Dice6,
  Send,
  Wallet,
  ExternalLink,
  Globe,
  Smartphone,
  Timer,
  UserCheck,
  FileText,
  Camera,
  Lock
} from 'lucide-react';
import CollapsiblePanel from './CollapsiblePanel';

interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'live' | 'paused' | 'completed';
  linkedPage: string;
  rewardType: string;
  rewardValue: string;
  totalScans: number;
  rewardsUnlocked: number;
  rewardsRedeemed: number;
  validityStart: string;
  validityEnd: string;
  createdAt: string;
}

const RewardsCampaignsTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'analytics'>('campaigns');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  // Sample campaigns data
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Organic Honey Launch Campaign',
      status: 'live',
      linkedPage: 'Organic Honey Product Page',
      rewardType: 'Points',
      rewardValue: '100 points',
      totalScans: 1247,
      rewardsUnlocked: 892,
      rewardsRedeemed: 634,
      validityStart: '2024-01-15',
      validityEnd: '2024-03-15',
      createdAt: '2024-01-10'
    },
    {
      id: '2',
      name: 'Premium Tea Discovery',
      status: 'draft',
      linkedPage: 'Premium Tea Landing Page',
      rewardType: 'Coupon',
      rewardValue: '20% off next purchase',
      totalScans: 0,
      rewardsUnlocked: 0,
      rewardsRedeemed: 0,
      validityStart: '2024-02-01',
      validityEnd: '2024-04-01',
      createdAt: '2024-01-20'
    },
    {
      id: '3',
      name: 'Sustainability Awareness',
      status: 'paused',
      linkedPage: 'Eco-Friendly Products',
      rewardType: 'Charity Donation',
      rewardValue: '₹10 to tree planting',
      totalScans: 567,
      rewardsUnlocked: 423,
      rewardsRedeemed: 423,
      validityStart: '2024-01-01',
      validityEnd: '2024-12-31',
      createdAt: '2024-01-05'
    }
  ]);

  // Campaign form state
  const [campaignForm, setCampaignForm] = useState({
    name: '',
    status: 'draft',
    linkedPage: '',
    rewardType: 'points',
    rewardValue: '',
    triggerEvents: [] as string[],
    redemptionAction: 'auto-send',
    frequencyCap: 'once-per-product',
    totalLimit: '',
    validityStart: '',
    validityEnd: '',
    termsUrl: '',
    // Misuse prevention
    requireSerialCode: false,
    requireInvoice: false,
    timeScanProtection: false,
    scanProtectionHours: '24',
    geoRestriction: false,
    sessionScanLimit: false,
    maxScansPerSession: '5'
  });

  const rewardTypes = [
    { value: 'points', label: 'Points', icon: Coins },
    { value: 'coupon', label: 'Coupon', icon: Ticket },
    { value: 'gift', label: 'Gift', icon: Gift },
    { value: 'charity', label: 'Charity Donation', icon: Heart },
    { value: 'lucky-draw', label: 'Lucky Draw Entry', icon: Dice6 }
  ];

  const triggerEvents = [
    { value: 'qr-scan', label: 'On QR Scan' },
    { value: 'form-submission', label: 'On Form Submission' },
    { value: 'review', label: 'On Review' },
    { value: 'scan-streak', label: 'On Scan Streak' },
    { value: 'quiz-participation', label: 'On Quiz Participation' }
  ];

  const redemptionActions = [
    { value: 'auto-send', label: 'Auto-send Coupon', icon: Send },
    { value: 'store-wallet', label: 'Store in Wallet', icon: Wallet },
    { value: 'external-integration', label: 'External Integration', icon: ExternalLink }
  ];

  const frequencyOptions = [
    { value: 'once-per-product', label: 'Once per Product' },
    { value: 'once-per-day', label: 'Once per Day' },
    { value: 'unlimited', label: 'Unlimited' }
  ];

  const linkedPages = [
    'Organic Honey Product Page',
    'Premium Tea Landing Page',
    'Handmade Soap Product Page',
    'Eco-Friendly Products',
    'Brand Story Landing Page'
  ];

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || campaign.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800', icon: FileText },
      live: { color: 'bg-green-100 text-green-800', icon: Play },
      paused: { color: 'bg-yellow-100 text-yellow-800', icon: Pause },
      completed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle }
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

  const getRewardTypeIcon = (type: string) => {
    const rewardType = rewardTypes.find(rt => rt.value === type);
    return rewardType ? rewardType.icon : Gift;
  };

  const handleTriggerEventChange = (event: string, checked: boolean) => {
    if (checked) {
      setCampaignForm({
        ...campaignForm,
        triggerEvents: [...campaignForm.triggerEvents, event]
      });
    } else {
      setCampaignForm({
        ...campaignForm,
        triggerEvents: campaignForm.triggerEvents.filter(e => e !== event)
      });
    }
  };

  const handleCreateCampaign = () => {
    const newCampaign: Campaign = {
      id: Date.now().toString(),
      name: campaignForm.name,
      status: campaignForm.status as Campaign['status'],
      linkedPage: campaignForm.linkedPage,
      rewardType: campaignForm.rewardType,
      rewardValue: campaignForm.rewardValue,
      totalScans: 0,
      rewardsUnlocked: 0,
      rewardsRedeemed: 0,
      validityStart: campaignForm.validityStart,
      validityEnd: campaignForm.validityEnd,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setCampaigns([...campaigns, newCampaign]);
    setShowCreateModal(false);
    // Reset form
    setCampaignForm({
      name: '',
      status: 'draft',
      linkedPage: '',
      rewardType: 'points',
      rewardValue: '',
      triggerEvents: [],
      redemptionAction: 'auto-send',
      frequencyCap: 'once-per-product',
      totalLimit: '',
      validityStart: '',
      validityEnd: '',
      termsUrl: '',
      requireSerialCode: false,
      requireInvoice: false,
      timeScanProtection: false,
      scanProtectionHours: '24',
      geoRestriction: false,
      sessionScanLimit: false,
      maxScansPerSession: '5'
    });
  };

  const CampaignsTab = () => (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Campaigns</h2>
          <p className="text-gray-600">Create and manage reward campaigns for your products</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Campaign
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search campaigns..."
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="live">Live</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reward</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCampaigns.map((campaign) => {
                const RewardIcon = getRewardTypeIcon(campaign.rewardType);
                const conversionRate = campaign.totalScans > 0 ? Math.round((campaign.rewardsUnlocked / campaign.totalScans) * 100) : 0;
                const redemptionRate = campaign.rewardsUnlocked > 0 ? Math.round((campaign.rewardsRedeemed / campaign.rewardsUnlocked) * 100) : 0;
                
                return (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                          <Target className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                          <div className="text-sm text-gray-500">{campaign.linkedPage}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(campaign.status)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <RewardIcon className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{campaign.rewardValue}</div>
                          <div className="text-xs text-gray-500 capitalize">{campaign.rewardType}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900">{campaign.totalScans.toLocaleString()} scans</div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{conversionRate}% unlocked</span>
                          <span>{redemptionRate}% redeemed</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {new Date(campaign.validityStart).toLocaleDateString()} - {new Date(campaign.validityEnd).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors" title="Edit">
                          <Edit className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-1 hover:bg-blue-100 rounded transition-colors" title="View Analytics">
                          <BarChart3 className="w-4 h-4 text-blue-500" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors" title="Duplicate">
                          <Copy className="w-4 h-4 text-gray-500" />
                        </button>
                        {campaign.status === 'live' ? (
                          <button className="p-1 hover:bg-yellow-100 rounded transition-colors" title="Pause">
                            <Pause className="w-4 h-4 text-yellow-600" />
                          </button>
                        ) : campaign.status === 'paused' ? (
                          <button className="p-1 hover:bg-green-100 rounded transition-colors" title="Resume">
                            <Play className="w-4 h-4 text-green-600" />
                          </button>
                        ) : null}
                        <button className="p-1 hover:bg-red-100 rounded transition-colors text-red-500" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const AnalyticsTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Campaign Analytics</h2>
        <p className="text-gray-600">Track performance and engagement across all campaigns</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex items-center text-green-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />
              +12%
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">1,814</h3>
          <p className="text-gray-600">Total Scans</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Gift className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex items-center text-green-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />
              +8%
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">1,315</h3>
          <p className="text-gray-600">Rewards Unlocked</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex items-center text-green-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />
              +15%
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">1,057</h3>
          <p className="text-gray-600">Rewards Redeemed</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex items-center text-green-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />
              +23%
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">72%</h3>
          <p className="text-gray-600">Conversion Rate</p>
        </div>
      </div>

      {/* Campaign Performance Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Performance</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Analytics chart will be displayed here</p>
          </div>
        </div>
      </div>

      {/* Top Performing Campaigns */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Campaigns</h3>
        <div className="space-y-4">
          {campaigns.filter(c => c.status === 'live').map((campaign, index) => {
            const conversionRate = campaign.totalScans > 0 ? Math.round((campaign.rewardsUnlocked / campaign.totalScans) * 100) : 0;
            return (
              <div key={campaign.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-700">#{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                    <p className="text-sm text-gray-500">{campaign.totalScans.toLocaleString()} scans</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">{conversionRate}%</div>
                  <div className="text-sm text-gray-500">Conversion</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Rewards & Campaigns</h1>
        <p className="text-gray-600">Create engaging reward campaigns to boost customer engagement</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'campaigns'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Target className="w-4 h-4 inline mr-2" />
              Campaigns ({campaigns.length})
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Analytics
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'campaigns' ? <CampaignsTab /> : <AnalyticsTab />}

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Create New Campaign</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Campaign Setup */}
              <CollapsiblePanel title="Campaign Setup" defaultOpen={true}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Name</label>
                    <input
                      type="text"
                      value={campaignForm.name}
                      onChange={(e) => setCampaignForm({...campaignForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter campaign name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Status</label>
                    <select
                      value={campaignForm.status}
                      onChange={(e) => setCampaignForm({...campaignForm, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="live">Live</option>
                      <option value="paused">Paused</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Linked Page or Product</label>
                    <select
                      value={campaignForm.linkedPage}
                      onChange={(e) => setCampaignForm({...campaignForm, linkedPage: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select a page</option>
                      {linkedPages.map(page => (
                        <option key={page} value={page}>{page}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reward Type</label>
                    <select
                      value={campaignForm.rewardType}
                      onChange={(e) => setCampaignForm({...campaignForm, rewardType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {rewardTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reward Value or Description</label>
                    <input
                      type="text"
                      value={campaignForm.rewardValue}
                      onChange={(e) => setCampaignForm({...campaignForm, rewardValue: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 100 points, 20% off, ₹50 voucher"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Trigger Events</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {triggerEvents.map(event => (
                      <label key={event.value} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={campaignForm.triggerEvents.includes(event.value)}
                          onChange={(e) => handleTriggerEventChange(event.value, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{event.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Redemption Action</label>
                    <select
                      value={campaignForm.redemptionAction}
                      onChange={(e) => setCampaignForm({...campaignForm, redemptionAction: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {redemptionActions.map(action => (
                        <option key={action.value} value={action.value}>{action.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Frequency Cap</label>
                    <select
                      value={campaignForm.frequencyCap}
                      onChange={(e) => setCampaignForm({...campaignForm, frequencyCap: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {frequencyOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Redemption Limit</label>
                    <input
                      type="number"
                      value={campaignForm.totalLimit}
                      onChange={(e) => setCampaignForm({...campaignForm, totalLimit: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Leave empty for unlimited"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Terms & Conditions URL</label>
                    <input
                      type="url"
                      value={campaignForm.termsUrl}
                      onChange={(e) => setCampaignForm({...campaignForm, termsUrl: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com/terms"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Start Date</label>
                    <input
                      type="date"
                      value={campaignForm.validityStart}
                      onChange={(e) => setCampaignForm({...campaignForm, validityStart: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Campaign End Date</label>
                    <input
                      type="date"
                      value={campaignForm.validityEnd}
                      onChange={(e) => setCampaignForm({...campaignForm, validityEnd: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </CollapsiblePanel>

              {/* Misuse Prevention */}
              <CollapsiblePanel title="Misuse Prevention">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-yellow-900">Security Features</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          Enable these features to prevent campaign abuse and ensure fair reward distribution.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <UserCheck className="w-5 h-5 text-gray-500" />
                          <div>
                            <span className="text-sm font-medium text-gray-700">Require Serial Code Verification</span>
                            <p className="text-xs text-gray-500">Verify product authenticity with serial codes</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setCampaignForm({...campaignForm, requireSerialCode: !campaignForm.requireSerialCode})}
                          className="flex-shrink-0"
                        >
                          {campaignForm.requireSerialCode ? (
                            <ToggleRight className="w-6 h-6 text-blue-600" />
                          ) : (
                            <ToggleLeft className="w-6 h-6 text-gray-400" />
                          )}
                        </button>
                      </label>
                    </div>

                    <div>
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <Camera className="w-5 h-5 text-gray-500" />
                          <div>
                            <span className="text-sm font-medium text-gray-700">Require Invoice Upload</span>
                            <p className="text-xs text-gray-500">Validate purchase with invoice photos</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setCampaignForm({...campaignForm, requireInvoice: !campaignForm.requireInvoice})}
                          className="flex-shrink-0"
                        >
                          {campaignForm.requireInvoice ? (
                            <ToggleRight className="w-6 h-6 text-blue-600" />
                          ) : (
                            <ToggleLeft className="w-6 h-6 text-gray-400" />
                          )}
                        </button>
                      </label>
                    </div>

                    <div>
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <Timer className="w-5 h-5 text-gray-500" />
                          <div>
                            <span className="text-sm font-medium text-gray-700">Time-based Scan Protection</span>
                            <p className="text-xs text-gray-500">Limit scans per device per time period</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setCampaignForm({...campaignForm, timeScanProtection: !campaignForm.timeScanProtection})}
                          className="flex-shrink-0"
                        >
                          {campaignForm.timeScanProtection ? (
                            <ToggleRight className="w-6 h-6 text-blue-600" />
                          ) : (
                            <ToggleLeft className="w-6 h-6 text-gray-400" />
                          )}
                        </button>
                      </label>
                      {campaignForm.timeScanProtection && (
                        <div className="mt-2 ml-8">
                          <select
                            value={campaignForm.scanProtectionHours}
                            onChange={(e) => setCampaignForm({...campaignForm, scanProtectionHours: e.target.value})}
                            className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="1">1 hour</option>
                            <option value="6">6 hours</option>
                            <option value="24">24 hours</option>
                            <option value="168">1 week</option>
                          </select>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-5 h-5 text-gray-500" />
                          <div>
                            <span className="text-sm font-medium text-gray-700">Geo-restriction</span>
                            <p className="text-xs text-gray-500">Block scans from specific locations</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setCampaignForm({...campaignForm, geoRestriction: !campaignForm.geoRestriction})}
                          className="flex-shrink-0"
                        >
                          {campaignForm.geoRestriction ? (
                            <ToggleRight className="w-6 h-6 text-blue-600" />
                          ) : (
                            <ToggleLeft className="w-6 h-6 text-gray-400" />
                          )}
                        </button>
                      </label>
                    </div>

                    <div className="md:col-span-2">
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <Smartphone className="w-5 h-5 text-gray-500" />
                          <div>
                            <span className="text-sm font-medium text-gray-700">Session Scan Limit</span>
                            <p className="text-xs text-gray-500">Maximum scans per session per device</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setCampaignForm({...campaignForm, sessionScanLimit: !campaignForm.sessionScanLimit})}
                          className="flex-shrink-0"
                        >
                          {campaignForm.sessionScanLimit ? (
                            <ToggleRight className="w-6 h-6 text-blue-600" />
                          ) : (
                            <ToggleLeft className="w-6 h-6 text-gray-400" />
                          )}
                        </button>
                      </label>
                      {campaignForm.sessionScanLimit && (
                        <div className="mt-2 ml-8">
                          <input
                            type="number"
                            value={campaignForm.maxScansPerSession}
                            onChange={(e) => setCampaignForm({...campaignForm, maxScansPerSession: e.target.value})}
                            className="w-24 px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min="1"
                            max="50"
                          />
                          <span className="ml-2 text-sm text-gray-500">scans per session</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CollapsiblePanel>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCampaign}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Create Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardsCampaignsTab;