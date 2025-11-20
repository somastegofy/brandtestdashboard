import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  MousePointer, 
  Download, 
  Share2, 
  Filter,
  Calendar,
  Package,
  Target,
  BarChart3,
  PieChart,
  Map,
  Activity,
  Eye,
  ShoppingCart,
  ExternalLink,
  FormInput,
  Smartphone,
  Monitor,
  Globe,
  ArrowUp,
  ArrowDown,
  Minus,
  ChevronDown,
  RefreshCw,
  FileText,
  Lock,
  Zap,
  Award,
  Heart,
  DollarSign,
  Percent,
  Timer,
  MapPin,
  UserCheck,
  UserX,
  Star,
  ThumbsUp,
  MessageSquare,
  Link,
  Facebook,
  Instagram,
  Twitter,
  Search,
  X,
  Copy
} from 'lucide-react';

const AnalyticsTab: React.FC = () => {
  const [dateRange, setDateRange] = useState('last-7-days');
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [selectedCampaign, setSelectedCampaign] = useState('all');
  const [selectedScanSource, setSelectedScanSource] = useState('all');
  const [selectedSourceChannel, setSelectedSourceChannel] = useState('all');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Sample data
  const kpiData = {
    totalScans: { value: 12847, change: 18.5, trend: 'up' },
    avgTimeOnPage: { value: 48, change: 12.3, trend: 'up' },
    conversionRate: { value: 8.7, change: -2.1, trend: 'down' },
    repeatScans: { value: 26.4, change: 5.8, trend: 'up' }
  };

  const newVsRepeatData = [
    { date: '2024-01-15', newScans: 120, repeatScans: 45 },
    { date: '2024-01-16', newScans: 135, repeatScans: 52 },
    { date: '2024-01-17', newScans: 98, repeatScans: 38 },
    { date: '2024-01-18', newScans: 156, repeatScans: 67 },
    { date: '2024-01-19', newScans: 142, repeatScans: 58 },
    { date: '2024-01-20', newScans: 178, repeatScans: 72 },
    { date: '2024-01-21', newScans: 165, repeatScans: 69 }
  ];

  const topProducts = [
    { name: 'Organic Honey', scans: 3247, avgTime: 52, engagementScore: 8.7 },
    { name: 'Premium Tea', scans: 2891, avgTime: 45, engagementScore: 8.2 },
    { name: 'Handmade Soap', scans: 2156, avgTime: 38, engagementScore: 7.9 },
    { name: 'Eco-Friendly Detergent', scans: 1834, avgTime: 41, engagementScore: 7.5 },
    { name: 'Natural Shampoo', scans: 1567, avgTime: 36, engagementScore: 7.1 }
  ];

  const topCategories = [
    { name: 'Personal Care', views: 8934, percentage: 35 },
    { name: 'Food & Beverages', views: 6721, percentage: 26 },
    { name: 'Home Care', views: 4892, percentage: 19 },
    { name: 'Health & Wellness', views: 3456, percentage: 14 },
    { name: 'Beauty', views: 1567, percentage: 6 }
  ];

  const sourceData = [
    { source: 'QR Scan', count: 7234, percentage: 56.3, color: 'bg-blue-500' },
    { source: 'Barcode Entry', count: 2891, percentage: 22.5, color: 'bg-green-500' },
    { source: 'Shared Link', count: 1567, percentage: 12.2, color: 'bg-purple-500' },
    { source: 'Social Media', count: 892, percentage: 6.9, color: 'bg-pink-500' },
    { source: 'Referral', count: 263, percentage: 2.1, color: 'bg-orange-500' }
  ];

  const products = ['Organic Honey', 'Premium Tea', 'Handmade Soap', 'Natural Shampoo', 'Protein Bar'];
  const sources = ['QR Scan', 'Barcode Entry', 'Shared Link', 'Social Media'];
  const scanSources = ['QR Code', 'Barcode', 'Manual Entry'];
  const sourceChannels = ['Amazon', 'Flipkart', 'Zepto', 'Dmart', 'BigBasket'];

  const benchmarkData = [
    { metric: 'New Consumer Growth', yourBrand: 18.0, industry: 11.0, unit: '%' },
    { metric: 'Avg. Time on Page', yourBrand: 48, industry: 35, unit: 's' },
    { metric: 'Repeat Scans', yourBrand: 26.0, industry: 18.0, unit: '%' },
    { metric: 'Form Conversion Rate', yourBrand: 12.6, industry: 7.9, unit: '%' },
    { metric: 'QR Scan to Buy Click', yourBrand: 8.3, industry: 4.6, unit: '%' }
  ];

  const timeHeatmapData = [
    { day: 'Mon', '6-9': 12, '9-12': 45, '12-15': 67, '15-18': 89, '18-21': 134, '21-24': 78 },
    { day: 'Tue', '6-9': 15, '9-12': 52, '12-15': 73, '15-18': 95, '18-21': 142, '21-24': 82 },
    { day: 'Wed', '6-9': 18, '9-12': 48, '12-15': 69, '15-18': 91, '18-21': 138, '21-24': 75 },
    { day: 'Thu', '6-9': 14, '9-12': 56, '12-15': 78, '15-18': 102, '18-21': 156, '21-24': 89 },
    { day: 'Fri', '6-9': 22, '9-12': 67, '12-15': 89, '15-18': 123, '18-21': 178, '21-24': 98 },
    { day: 'Sat', '6-9': 28, '9-12': 78, '12-15': 98, '15-18': 134, '18-21': 189, '21-24': 112 },
    { day: 'Sun', '6-9': 25, '9-12': 72, '12-15': 92, '15-18': 128, '18-21': 167, '21-24': 95 }
  ];

  const userSegmentData = [
    { segment: 'Registered Users', count: 8234, percentage: 64.1, color: 'bg-blue-500' },
    { segment: 'Anonymous Users', count: 4613, percentage: 35.9, color: 'bg-gray-400' }
  ];

  const personaData = [
    { persona: 'Health-Conscious', avgTime: 56, repeatScans: 34, actions: 18 },
    { persona: 'Deal Seekers', avgTime: 42, repeatScans: 28, actions: 22 },
    { persona: 'Premium Buyers', avgTime: 67, repeatScans: 45, actions: 31 },
    { persona: 'Eco-Friendly', avgTime: 52, repeatScans: 38, actions: 25 }
  ];

  const funnelData = [
    { stage: 'Viewed Product', count: 12847, percentage: 100, dropOff: 0 },
    { stage: 'Scrolled to Specs', count: 9234, percentage: 71.9, dropOff: 28.1 },
    { stage: 'Clicked E-commerce Link', count: 3456, percentage: 26.9, dropOff: 45.0 },
    { stage: 'Submitted Form / Asked Question', count: 1234, percentage: 9.6, dropOff: 17.3 }
  ];

  // New analytics data for buyer source insights
  const verifiedPurchasesBySource = [
    { source: 'Amazon', count: 234, percentage: 42.3, color: 'bg-orange-500' },
    { source: 'Flipkart', count: 156, percentage: 28.2, color: 'bg-blue-500' },
    { source: 'Zepto', count: 89, percentage: 16.1, color: 'bg-purple-500' },
    { source: 'Dmart', count: 45, percentage: 8.1, color: 'bg-red-500' },
    { source: 'Others', count: 29, percentage: 5.3, color: 'bg-gray-500' }
  ];

  const scanSourceBreakdown = [
    { source: 'QR Code', count: 1247, percentage: 68.7, color: 'bg-blue-500' },
    { source: 'Barcode', count: 423, percentage: 23.3, color: 'bg-green-500' },
    { source: 'Manual Entry', count: 144, percentage: 8.0, color: 'bg-purple-500' }
  ];

  const mostClaimedProducts = [
    { name: 'Organic Honey', claims: 89, approvalRate: 94 },
    { name: 'Premium Tea', claims: 67, approvalRate: 87 },
    { name: 'Handmade Soap', claims: 45, approvalRate: 91 },
    { name: 'Natural Shampoo', claims: 34, approvalRate: 89 },
    { name: 'Protein Bar', claims: 23, approvalRate: 96 }
  ];

  const approvalFunnelData = [
    { stage: 'Claims Submitted', count: 258, percentage: 100, dropOff: 0 },
    { stage: 'Invoice Verified', count: 234, percentage: 90.7, dropOff: 9.3 },
    { stage: 'Approved', count: 218, percentage: 84.5, dropOff: 6.2 },
    { stage: 'Rewards Sent', count: 205, percentage: 79.5, dropOff: 5.0 }
  ];

  const topLocationsBySource = [
    { location: 'Mumbai', qrScans: 234, barcodeScans: 89, manualEntry: 23 },
    { location: 'Delhi', qrScans: 198, barcodeScans: 67, manualEntry: 34 },
    { location: 'Bangalore', qrScans: 167, barcodeScans: 78, manualEntry: 19 },
    { location: 'Chennai', qrScans: 145, barcodeScans: 56, manualEntry: 28 },
    { location: 'Pune', qrScans: 123, barcodeScans: 45, manualEntry: 15 }
  ];

  const getHeatmapIntensity = (value: number) => {
    const max = 189; // Maximum value in the dataset
    const intensity = (value / max) * 100;
    if (intensity > 80) return 'bg-red-500';
    if (intensity > 60) return 'bg-orange-500';
    if (intensity > 40) return 'bg-yellow-500';
    if (intensity > 20) return 'bg-green-500';
    return 'bg-blue-500';
  };

  const getChangeIcon = (trend: string) => {
    if (trend === 'up') return <ArrowUp className="w-4 h-4 text-green-600" />;
    if (trend === 'down') return <ArrowDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getChangeColor = (trend: string) => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  const getBenchmarkIcon = (yourValue: number, industryValue: number) => {
    if (yourValue > industryValue) return <ArrowUp className="w-4 h-4 text-green-600" />;
    if (yourValue < industryValue) return <ArrowDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive insights into consumer behavior, engagement patterns, and performance metrics</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowExportModal(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button 
            onClick={() => setShowShareModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Dashboard
          </button>
        </div>
      </div>

      {/* Global Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
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
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Product/Category</label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Products</option>
              <option value="organic-honey">Organic Honey</option>
              <option value="premium-tea">Premium Tea</option>
              <option value="handmade-soap">Handmade Soap</option>
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Campaign</label>
            <select
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Campaigns</option>
              <option value="launch-campaign">Launch Campaign</option>
              <option value="sustainability">Sustainability Awareness</option>
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Scan Source</label>
            <select
              value={selectedScanSource}
              onChange={(e) => setSelectedScanSource(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Scan Sources</option>
              {scanSources.map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1">
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
          
          <div className="flex items-end">
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <div className={`flex items-center text-sm font-medium ${getChangeColor(kpiData.totalScans.trend)}`}>
              {getChangeIcon(kpiData.totalScans.trend)}
              <span className="ml-1">{Math.abs(kpiData.totalScans.change)}%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{kpiData.totalScans.value.toLocaleString()}</h3>
          <p className="text-gray-600">Total Scans</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div className={`flex items-center text-sm font-medium ${getChangeColor(kpiData.avgTimeOnPage.trend)}`}>
              {getChangeIcon(kpiData.avgTimeOnPage.trend)}
              <span className="ml-1">{Math.abs(kpiData.avgTimeOnPage.change)}%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{kpiData.avgTimeOnPage.value}s</h3>
          <p className="text-gray-600">Avg. Time on Page</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <MousePointer className="w-6 h-6 text-purple-600" />
            </div>
            <div className={`flex items-center text-sm font-medium ${getChangeColor(kpiData.conversionRate.trend)}`}>
              {getChangeIcon(kpiData.conversionRate.trend)}
              <span className="ml-1">{Math.abs(kpiData.conversionRate.change)}%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{kpiData.conversionRate.value}%</h3>
          <p className="text-gray-600">Conversion Rate</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <div className={`flex items-center text-sm font-medium ${getChangeColor(kpiData.repeatScans.trend)}`}>
              {getChangeIcon(kpiData.repeatScans.trend)}
              <span className="ml-1">{Math.abs(kpiData.repeatScans.change)}%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{kpiData.repeatScans.value}%</h3>
          <p className="text-gray-600">Repeat Scans</p>
        </div>
      </div>

      {/* New Analytics Widgets for Buyer Source Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Verified Purchases by Source */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Verified Purchases by Source</h3>
          
          <div className="space-y-4">
            {verifiedPurchasesBySource.map((source) => (
              <div key={source.source} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${source.color}`}></div>
                  <span className="text-sm font-medium text-gray-900">{source.source}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{source.count}</span>
                  <span className="text-xs text-gray-500">({source.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 h-48 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Purchase source distribution</p>
            </div>
          </div>
        </div>

        {/* Scan Source Breakdown */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Scan Source Breakdown</h3>
          
          <div className="space-y-4">
            {scanSourceBreakdown.map((source) => (
              <div key={source.source} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${source.color}`}></div>
                  <span className="text-sm font-medium text-gray-900">{source.source}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{source.count.toLocaleString()}</span>
                  <span className="text-xs text-gray-500">({source.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 h-48 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">QR vs Barcode vs Manual Entry</p>
            </div>
          </div>
        </div>
      </div>

      {/* Most Claimed Products & Approval Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Most Claimed Products</h3>
          
          <div className="space-y-4">
            {mostClaimedProducts.map((product, index) => (
              <div key={product.name} className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-700">#{index + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{product.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{product.claims} claims</span>
                      <span className="text-xs text-green-600">{product.approvalRate}% approved</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(product.claims / 100) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Approval Funnel</h3>
          
          <div className="space-y-4">
            {approvalFunnelData.map((stage, index) => (
              <div key={stage.stage} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{stage.stage}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{stage.count}</span>
                    <span className="text-xs text-gray-500">({stage.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-green-500' :
                      index === 2 ? 'bg-yellow-500' : 'bg-purple-500'
                    }`}
                    style={{ width: `${stage.percentage}%` }}
                  ></div>
                </div>
                {index < approvalFunnelData.length - 1 && stage.dropOff > 0 && (
                  <div className="text-xs text-red-600 mt-1">
                    Drop-off: {stage.dropOff}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Locations by Source Type */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Locations by Source Type</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-sm font-medium text-gray-700 pb-3">Location</th>
                <th className="text-left text-sm font-medium text-gray-700 pb-3">QR Scans</th>
                <th className="text-left text-sm font-medium text-gray-700 pb-3">Barcode Scans</th>
                <th className="text-left text-sm font-medium text-gray-700 pb-3">Manual Entry</th>
                <th className="text-left text-sm font-medium text-gray-700 pb-3">Total</th>
              </tr>
            </thead>
            <tbody className="space-y-2">
              {topLocationsBySource.map((location) => {
                const total = location.qrScans + location.barcodeScans + location.manualEntry;
                return (
                  <tr key={location.location} className="border-b border-gray-100">
                    <td className="py-3 text-sm font-medium text-gray-900">{location.location}</td>
                    <td className="py-3 text-sm text-blue-600">{location.qrScans}</td>
                    <td className="py-3 text-sm text-green-600">{location.barcodeScans}</td>
                    <td className="py-3 text-sm text-purple-600">{location.manualEntry}</td>
                    <td className="py-3 text-sm font-medium text-gray-900">{total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <span className="font-medium">Insight:</span> Mumbai leads in QR code scans, indicating higher smartphone adoption. Consider mobile-first campaigns for metro cities.
          </p>
        </div>
      </div>

      {/* Average Scan-to-Claim Time */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Average Scan-to-Claim Time</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">2.3 min</div>
            <div className="text-sm text-gray-600">QR Code Scans</div>
            <div className="text-xs text-green-600 mt-1">↓ 15% faster</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">3.7 min</div>
            <div className="text-sm text-gray-600">Barcode Scans</div>
            <div className="text-xs text-yellow-600 mt-1">→ Average</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">5.2 min</div>
            <div className="text-sm text-gray-600">Manual Entry</div>
            <div className="text-xs text-red-600 mt-1">↑ 40% slower</div>
          </div>
        </div>
        
        <div className="mt-6 p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700">
            <span className="font-medium">Insight:</span> QR code scans have the fastest claim completion rate. Promote QR codes for better user experience.
          </p>
        </div>
      </div>

      {/* Dashboard Modules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* New vs Repeat Scans */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">New vs Repeat Scans</h3>
            <div className="flex items-center space-x-2">
              <select className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>New Consumers</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Returning Consumers</span>
              </div>
            </div>
            
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Line chart visualization</p>
                <p className="text-xs text-gray-400 mt-1">Interactive chart showing scan trends over time</p>
              </div>
            </div>
          </div>
        </div>

        {/* Time Spent on Pages */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Time Spent on Pages</h3>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm">Mobile</button>
              <button className="px-3 py-1 text-gray-600 rounded text-sm hover:bg-gray-100">Desktop</button>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Hero Section</span>
                <span className="text-sm font-medium">18s</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Product Benefits</span>
                <span className="text-sm font-medium">12s</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Reviews</span>
                <span className="text-sm font-medium">8s</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '33%' }}></div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Call to Action</span>
                <span className="text-sm font-medium">10s</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <span className="font-medium">Insight:</span> Users spend most time on hero section. Consider optimizing product benefits section.
            </p>
          </div>
        </div>

        {/* Product Engagement Funnel */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Product Engagement Funnel</h3>
            <select className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="all">All Products</option>
              <option value="organic-honey">Organic Honey</option>
              <option value="premium-tea">Premium Tea</option>
            </select>
          </div>
          
          <div className="space-y-4">
            {funnelData.map((stage, index) => (
              <div key={stage.stage} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{stage.stage}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{stage.count.toLocaleString()}</span>
                    <span className="text-xs text-gray-500">({stage.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${
                      index === 0 ? 'bg-green-500' :
                      index === 1 ? 'bg-blue-500' :
                      index === 2 ? 'bg-yellow-500' : 'bg-purple-500'
                    }`}
                    style={{ width: `${stage.percentage}%` }}
                  ></div>
                </div>
                {index < funnelData.length - 1 && (
                  <div className="text-xs text-red-600 mt-1">
                    Drop-off: {funnelData[index + 1].dropOff}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Source of Views */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Source of Views</h3>
          
          <div className="space-y-4">
            {sourceData.map((source) => (
              <div key={source.source} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${source.color}`}></div>
                  <span className="text-sm font-medium text-gray-900">{source.source}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{source.count.toLocaleString()}</span>
                  <span className="text-xs text-gray-500">({source.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 h-48 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Pie chart visualization</p>
              <p className="text-xs text-gray-400 mt-1">Interactive pie chart with hover tooltips</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Categories & Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Categories</h3>
          
          <div className="space-y-4">
            {topCategories.map((category, index) => (
              <div key={category.name} className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-700">#{index + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{category.name}</span>
                    <span className="text-sm text-gray-600">{category.views.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Products</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-2">Product</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-2">Scans</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-2">Avg Time</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-2">Score</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                {topProducts.map((product, index) => (
                  <tr key={product.name} className="border-b border-gray-100">
                    <td className="py-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                          <Package className="w-3 h-3 text-gray-500" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-2 text-sm text-gray-600">{product.scans.toLocaleString()}</td>
                    <td className="py-2 text-sm text-gray-600">{product.avgTime}s</td>
                    <td className="py-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">{product.engagementScore}</span>
                        <div className="w-12 bg-gray-200 rounded-full h-1">
                          <div 
                            className="bg-green-500 h-1 rounded-full" 
                            style={{ width: `${(product.engagementScore / 10) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Time-of-Day & Day-of-Week Heatmap */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Time-of-Day & Day-of-Week Scans</h3>
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Low</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span>Medium</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>High</span>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <div className="grid grid-cols-7 gap-1 min-w-full">
            {timeHeatmapData.map((day) => (
              <div key={day.day} className="space-y-1">
                <div className="text-center text-xs font-medium text-gray-700 py-2">{day.day}</div>
                {Object.entries(day).slice(1).map(([timeSlot, value]) => (
                  <div
                    key={timeSlot}
                    className={`h-8 rounded flex items-center justify-center text-xs text-white font-medium ${getHeatmapIntensity(value as number)}`}
                    title={`${day.day} ${timeSlot}: ${value} scans`}
                  >
                    {value}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-6 gap-4 text-xs text-gray-500 text-center">
            <span>6-9 AM</span>
            <span>9-12 PM</span>
            <span>12-3 PM</span>
            <span>3-6 PM</span>
            <span>6-9 PM</span>
            <span>9-12 AM</span>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-700">
            <span className="font-medium">Insight:</span> Peak engagement occurs on weekends between 6-9 PM. Consider timing promotions during these hours.
          </p>
        </div>
      </div>

      {/* User Segmentation & Geolocation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">User Segmentation</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-4">Registered vs Anonymous</h4>
              <div className="space-y-3">
                {userSegmentData.map((segment) => (
                  <div key={segment.segment} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${segment.color}`}></div>
                      <span className="text-sm font-medium text-gray-900">{segment.segment}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{segment.count.toLocaleString()}</span>
                      <span className="text-xs text-gray-500">({segment.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-4">Top Personas</h4>
              <div className="space-y-3">
                {personaData.map((persona) => (
                  <div key={persona.persona} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{persona.persona}</span>
                      <Star className="w-4 h-4 text-yellow-500" />
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                      <div>Avg Time: {persona.avgTime}s</div>
                      <div>Repeat: {persona.repeatScans}%</div>
                      <div>Actions: {persona.actions}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Geolocation Heatmap</h3>
            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
              Run Targeted Campaign
            </button>
          </div>
          
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
            <div className="text-center">
              <Map className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">India map with heat gradients</p>
              <p className="text-xs text-gray-400 mt-1">Interactive map showing scan density by region</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Top Regions</h4>
            <div className="space-y-2">
              {[
                { region: 'Mumbai, Maharashtra', scans: 2847, percentage: 22.1 },
                { region: 'Delhi, NCR', scans: 2156, percentage: 16.8 },
                { region: 'Bangalore, Karnataka', scans: 1834, percentage: 14.3 },
                { region: 'Chennai, Tamil Nadu', scans: 1567, percentage: 12.2 },
                { region: 'Pune, Maharashtra', scans: 1234, percentage: 9.6 }
              ].map((region) => (
                <div key={region.region} className="flex items-center justify-between text-sm">
                  <span className="text-gray-900">{region.region}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">{region.scans.toLocaleString()}</span>
                    <span className="text-xs text-gray-500">({region.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Benchmarking */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Your Brand vs Similar Brands</h3>
          <select className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="d2c-food">vs D2C Food & Beverages</option>
            <option value="personal-care">vs Personal Care Brands</option>
            <option value="eco-friendly">vs Eco-Friendly Products</option>
          </select>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-sm font-medium text-gray-700 pb-3">Metric</th>
                <th className="text-left text-sm font-medium text-gray-700 pb-3">Your Brand</th>
                <th className="text-left text-sm font-medium text-gray-700 pb-3">Similar Brand Avg</th>
                <th className="text-left text-sm font-medium text-gray-700 pb-3">Performance</th>
              </tr>
            </thead>
            <tbody className="space-y-2">
              {benchmarkData.map((metric) => (
                <tr key={metric.metric} className="border-b border-gray-100">
                  <td className="py-3 text-sm font-medium text-gray-900">{metric.metric}</td>
                  <td className="py-3">
                    <span className="text-sm font-semibold text-blue-600">
                      {metric.yourBrand}{metric.unit}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-600">{metric.industry}{metric.unit}</td>
                  <td className="py-3">
                    <div className="flex items-center space-x-2">
                      {getBenchmarkIcon(metric.yourBrand, metric.industry)}
                      <span className={`text-sm font-medium ${
                        metric.yourBrand > metric.industry ? 'text-green-600' : 
                        metric.yourBrand < metric.industry ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {metric.yourBrand > metric.industry ? 'Above' : 
                         metric.yourBrand < metric.industry ? 'Below' : 'Equal'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <div className="flex items-start space-x-3">
            <Award className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-green-900">Performance Summary</h4>
              <p className="text-sm text-green-700 mt-1">
                Your brand is performing above industry average in 4 out of 5 key metrics. 
                Focus on improving form conversion rate to achieve excellence across all areas.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Export Analytics</h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="csv">CSV</option>
                  <option value="pdf">PDF Report</option>
                  <option value="excel">Excel</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Include Modules</label>
                <div className="space-y-2">
                  {['KPI Summary', 'Scan Trends', 'User Segmentation', 'Benchmarking'].map((module) => (
                    <label key={module} className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm text-gray-700">{module}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Share Dashboard</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shareable Link</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value="https://stegofy.com/analytics/shared/abc123"
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                  <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Password Protection</span>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6"></span>
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Access Level</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="view">View Only</option>
                  <option value="comment">View & Comment</option>
                  <option value="edit">Full Access</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                <Share2 className="w-4 h-4 mr-2" />
                Generate Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsTab;