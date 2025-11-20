import React, { useState } from 'react';
import { 
  QrCode as QrCodeIcon, 
  Search, 
  Filter, 
  Download, 
  Settings as SettingsIcon,
  Palette,
  Package,
  Globe,
  Plus,
  RefreshCw,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle,
  FileText,
  Zap,
  Upload,
  Copy
} from 'lucide-react';
import { QrCode, QrCustomization, QrSettings, StudioPage } from '../types/qrCodeTypes';
import { Product } from '../types/productTypes';
import AllCodesView from './qr_codes/AllCodesView';
import QrCustomizationTab from './qr_codes/QrCustomizationTab';
import QrSettingsTab from './qr_codes/QrSettingsTab';

interface QrCodeManagerTabProps {
  products: Product[];
}

const QrCodeManagerTab: React.FC<QrCodeManagerTabProps> = ({ products }) => {
  const [activeSubTab, setActiveSubTab] = useState<'all-codes' | 'products-qr' | 'studio-pages-qr' | 'customization' | 'settings'>('all-codes');
  const [selectedQrCode, setSelectedQrCode] = useState<QrCode | null>(null);

  // Sample Studio Pages data
  const [studioPages] = useState<StudioPage[]>([
    {
      id: 'studio-1',
      title: 'Organic Honey Brand Story',
      type: 'Brand Story',
      url: '/studio/organic-honey-story',
      status: 'Published',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 'studio-2',
      title: 'Premium Tea Landing Page',
      type: 'Landing Page',
      url: '/studio/premium-tea-landing',
      status: 'Published',
      createdAt: '2024-01-18T09:15:00Z'
    },
    {
      id: 'studio-3',
      title: 'Sustainability Initiative',
      type: 'Landing Page',
      url: '/studio/sustainability',
      status: 'Draft',
      createdAt: '2024-01-20T14:30:00Z'
    }
  ]);

  // Default QR customization
  const defaultCustomization: QrCustomization = {
    template: 'default',
    shapes: {
      body: 'square',
      eyeFrame: 'square',
      eyeball: 'square'
    },
    colors: {
      body: '#000000',
      stroke: '#000000',
      eyeOuter: '#000000',
      eyeInner: '#000000'
    },
    logo: {
      enabled: false,
      scale: 0.2,
      position: 'center',
      removePadding: false
    },
    text: {
      enabled: false,
      content: 'Scan Me!',
      font: 'Arial',
      size: 14,
      color: '#000000',
      position: 'bottom'
    },
    stickers: {
      enabled: false,
      type: 'none',
      position: 'corner'
    },
    advanced: {
      cornerPadding: 10,
      effect3d: false,
      errorCorrection: 'M'
    }
  };

  // Sample QR Codes data
  const [qrCodes, setQrCodes] = useState<QrCode[]>([
    {
      id: 'qr-1',
      name: 'Organic Honey 500g QR',
      type: 'Product QR',
      linkedTo: 'Organic Honey 500g',
      linkedId: '1',
      status: 'Linked to Custom Page',
      dateCreated: '2024-01-15T10:30:00Z',
      lastUpdated: '2024-01-20T14:30:00Z',
      totalScans: 1247,
      customization: {
        ...defaultCustomization,
        colors: {
          ...defaultCustomization.colors,
          body: '#10B981'
        },
        logo: {
          ...defaultCustomization.logo,
          enabled: true,
          url: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg'
        }
      },
      url: '/product/organic-honey-500g-123456',
      previewImage: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://stegofy.com/product/organic-honey-500g-123456&color=10B981'
    },
    {
      id: 'qr-2',
      name: 'Premium Green Tea QR',
      type: 'Product QR',
      linkedTo: 'Premium Green Tea 250g',
      linkedId: '2',
      status: 'Using Default View',
      dateCreated: '2024-01-18T09:15:00Z',
      lastUpdated: '2024-01-18T09:15:00Z',
      totalScans: 892,
      customization: defaultCustomization,
      url: '/product/premium-green-tea-250g-789012',
      previewImage: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://stegofy.com/product/premium-green-tea-250g-789012'
    },
    {
      id: 'qr-3',
      name: 'Brand Story Landing QR',
      type: 'Studio Page QR',
      linkedTo: 'Organic Honey Brand Story',
      linkedId: 'studio-1',
      status: 'Linked to Custom Page',
      dateCreated: '2024-01-15T16:45:00Z',
      lastUpdated: '2024-01-19T11:20:00Z',
      totalScans: 567,
      customization: {
        ...defaultCustomization,
        colors: {
          ...defaultCustomization.colors,
          body: '#3B82F6'
        },
        text: {
          ...defaultCustomization.text,
          enabled: true,
          content: 'Learn Our Story'
        }
      },
      url: '/studio/organic-honey-story',
      previewImage: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://stegofy.com/studio/organic-honey-story&color=3B82F6'
    },
    {
      id: 'qr-4',
      name: 'Sustainability Page QR',
      type: 'Studio Page QR',
      linkedTo: 'Sustainability Initiative',
      linkedId: 'studio-3',
      status: 'Using Default View',
      dateCreated: '2024-01-20T14:30:00Z',
      lastUpdated: '2024-01-20T14:30:00Z',
      totalScans: 234,
      customization: {
        ...defaultCustomization,
        colors: {
          ...defaultCustomization.colors,
          body: '#059669'
        },
        shapes: {
          ...defaultCustomization.shapes,
          body: 'rounded'
        }
      },
      url: '/studio/sustainability',
      previewImage: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://stegofy.com/studio/sustainability&color=059669'
    },
    {
      id: 'qr-5',
      name: 'Custom Promotional QR',
      type: 'Custom QR',
      linkedTo: 'External Website',
      status: 'Using Default View',
      dateCreated: '2024-01-22T11:15:00Z',
      lastUpdated: '2024-01-22T11:15:00Z',
      totalScans: 89,
      customization: {
        ...defaultCustomization,
        colors: {
          ...defaultCustomization.colors,
          body: '#F59E0B'
        },
        text: {
          ...defaultCustomization.text,
          enabled: true,
          content: 'Visit Website'
        }
      },
      url: 'https://example.com',
      previewImage: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://example.com&color=F59E0B'
    }
  ]);

  // QR Settings state
  const [qrSettings, setQrSettings] = useState<QrSettings>({
    defaultStyle: 'modern',
    defaultCtaText: 'Scan Me!',
    defaultCtaPlacement: 'bottom',
    downloadSizePresets: {
      small: 200,
      medium: 400,
      large: 800,
      custom: 1000
    },
    autoGenerate: true,
    defaultErrorCorrection: 'M'
  });

  // Filter QR codes based on active sub-tab
  const getFilteredQrCodes = () => {
    switch (activeSubTab) {
      case 'products-qr':
        return qrCodes.filter(qr => qr.type === 'Product QR');
      case 'studio-pages-qr':
        return qrCodes.filter(qr => qr.type === 'Studio Page QR');
      default:
        return qrCodes;
    }
  };

  const handleQrCodeUpdate = (updatedQrCode: QrCode) => {
    setQrCodes(prev => prev.map(qr => qr.id === updatedQrCode.id ? updatedQrCode : qr));
  };

  const handleQrCodeDelete = (qrCodeId: string) => {
    setQrCodes(prev => prev.filter(qr => qr.id !== qrCodeId));
  };

  const handleCreateNewQr = () => {
    const newQrCode: QrCode = {
      id: `qr-${Date.now()}`,
      name: 'New QR Code',
      type: 'Custom QR',
      linkedTo: 'Not Linked',
      status: 'Using Default View',
      dateCreated: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      totalScans: 0,
      customization: defaultCustomization,
      url: 'https://stegofy.com',
      previewImage: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://stegofy.com'
    };
    setQrCodes(prev => [newQrCode, ...prev]);
    setSelectedQrCode(newQrCode);
    setActiveSubTab('customization');
  };

  // Sub-tab configuration
  const subTabs = [
    { 
      id: 'all-codes', 
      label: 'All Codes', 
      icon: QrCodeIcon, 
      count: qrCodes.length,
      description: 'All generated QR codes and linked barcodes'
    },
    { 
      id: 'products-qr', 
      label: 'Products QR', 
      icon: Package, 
      count: qrCodes.filter(qr => qr.type === 'Product QR').length,
      description: 'Product-linked QR codes'
    },
    { 
      id: 'studio-pages-qr', 
      label: 'Studio Pages QR', 
      icon: Globe, 
      count: qrCodes.filter(qr => qr.type === 'Studio Page QR').length,
      description: 'Landing & product page QR codes from Studio'
    },
    { 
      id: 'customization', 
      label: 'Customization', 
      icon: Palette, 
      count: null,
      description: 'Design, styling, and export tools'
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: SettingsIcon, 
      count: null,
      description: 'Default QR settings for new codes'
    }
  ];

  const renderContent = () => {
    switch (activeSubTab) {
      case 'all-codes':
      case 'products-qr':
      case 'studio-pages-qr':
        return (
          <AllCodesView
            qrCodes={getFilteredQrCodes()}
            products={products}
            studioPages={studioPages}
            onQrCodeUpdate={handleQrCodeUpdate}
            onQrCodeDelete={handleQrCodeDelete}
            onEditQrCode={(qrCode) => {
              setSelectedQrCode(qrCode);
              setActiveSubTab('customization');
            }}
            activeFilter={activeSubTab}
          />
        );
      case 'customization':
        return (
          <QrCustomizationTab
            selectedQrCode={selectedQrCode}
            onQrCodeUpdate={handleQrCodeUpdate}
            products={products}
            studioPages={studioPages}
            onBackToList={() => setActiveSubTab('all-codes')}
          />
        );
      case 'settings':
        return (
          <QrSettingsTab
            settings={qrSettings}
            onSettingsUpdate={setQrSettings}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <QrCodeIcon className="w-8 h-8 mr-3 text-blue-600" />
            QR Codes & Barcodes
          </h1>
          <p className="text-gray-600">Central hub for QR Code & Barcode management with advanced customization</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Bulk Export
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </button>
          <button
            onClick={handleCreateNewQr}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create QR Code
          </button>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <QrCodeIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex items-center text-green-600 text-sm font-medium">
              <RefreshCw className="w-4 h-4 mr-1" />
              +12%
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{qrCodes.length}</h3>
          <p className="text-gray-600">Total QR Codes</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {qrCodes.filter(qr => qr.type === 'Product QR').length}
          </h3>
          <p className="text-gray-600">Product QR Codes</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {qrCodes.filter(qr => qr.type === 'Studio Page QR').length}
          </h3>
          <p className="text-gray-600">Studio Page QR Codes</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex items-center text-green-600 text-sm font-medium">
              <RefreshCw className="w-4 h-4 mr-1" />
              +23%
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {qrCodes.reduce((total, qr) => total + qr.totalScans, 0).toLocaleString()}
          </h3>
          <p className="text-gray-600">Total Scans</p>
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
                title={tab.description}
              >
                <Icon className={`w-4 h-4 mr-2 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
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

      {/* Dynamic Content */}
      {renderContent()}
    </div>
  );
};

export default QrCodeManagerTab;