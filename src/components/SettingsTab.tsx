import React, { useState } from 'react';
import { 
  Search, 
  Save, 
  Upload, 
  Info, 
  User, 
  Globe, 
  Search as SearchIcon, 
  Languages, 
  QrCode, 
  Gift, 
  Zap, 
  Palette, 
  Shield, 
  Link, 
  Users, 
  Settings,
  ChevronDown,
  ChevronUp,
  Crown,
  ExternalLink,
  Plus,
  Trash2,
  Edit,
  Eye,
  Copy,
  Check,
  X,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Camera,
  Image as ImageIcon,
  Smartphone,
  Monitor,
  CreditCard,
  DollarSign,
  Star,
  Target,
  Paintbrush,
  FileText,
  Lock,
  Database,
  Webhook,
  BarChart3,
  ShoppingCart,
  MessageSquare,
  UserPlus,
  UserMinus,
  Crown as CrownIcon
} from 'lucide-react';
import CollapsiblePanel from './CollapsiblePanel';

interface SettingsData {
  // Brand Profile & Identity
  brandName: string;
  brandLogo: string;
  brandBanner: string;
  shortDescription: string;
  longDescription: string;
  industry: string;
  website: string;
  contactEmail: string;
  contactPhone: string;
  contactWhatsApp: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    linkedin: string;
    twitter: string;
    youtube: string;
  };
  
  // Domain & URL Management
  customDomain: string;
  subdomain: string;
  urlFormat: string;
  
  // SEO Defaults
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogImage: string;
  
  // Multilingual & Localization
  multilingualEnabled: boolean;
  primaryLanguage: string;
  additionalLanguages: string[];
  defaultCurrency: string;
  measurementUnits: string;
  
  // QR Code & Barcode Rules
  qrCodeStyle: string;
  autoGenerateQR: boolean;
  defaultQRLanding: string;
  barcodeMapping: string;
  
  // Rewards & Loyalty Defaults
  defaultRewardType: string;
  defaultRewardValue: number;
  pointsExpiry: number;
  loyaltyRules: {
    repeatScans: number;
    reviewSubmissions: number;
    referralBonus: number;
  };
  
  // Smart Trigger Defaults
  locationDefaults: any[];
  deviceDefaults: string;
  languageDefaults: string;
  
  // Branding & Styling
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  font: string;
  buttonStyle: string;
  backgroundPattern: string;
  
  // Privacy & Compliance
  termsUrl: string;
  privacyUrl: string;
  gdprEnabled: boolean;
  ccpaEnabled: boolean;
  cookieConsent: boolean;
  dataSharing: {
    email: boolean;
    phone: boolean;
  };
  
  // Integrations
  integrations: {
    crm: string;
    analytics: string[];
    marketing: string[];
    ecommerce: string[];
  };
  
  // Account & User Management
  brandOwner: {
    name: string;
    email: string;
    role: string;
  };
  users: any[];
  subscription: {
    plan: string;
    status: string;
  };
}

const SettingsTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState('brand-profile');
  const [searchTerm, setSearchTerm] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [settingsData, setSettingsData] = useState<SettingsData>({
    // Brand Profile & Identity
    brandName: 'Stegofy Brand',
    brandLogo: '',
    brandBanner: '',
    shortDescription: 'Premium quality products for modern consumers',
    longDescription: 'We are committed to delivering exceptional products that meet the highest standards of quality and sustainability.',
    industry: 'food-beverages',
    website: 'https://mybrand.com',
    contactEmail: 'contact@mybrand.com',
    contactPhone: '+1 (555) 123-4567',
    contactWhatsApp: '+1 (555) 123-4567',
    socialMedia: {
      facebook: 'https://facebook.com/mybrand',
      instagram: 'https://instagram.com/mybrand',
      linkedin: 'https://linkedin.com/company/mybrand',
      twitter: 'https://twitter.com/mybrand',
      youtube: 'https://youtube.com/@mybrand'
    },
    
    // Domain & URL Management
    customDomain: '',
    subdomain: 'mybrand',
    urlFormat: 'product-name',
    
    // SEO Defaults
    metaTitle: 'Premium Products | Stegofy Brand',
    metaDescription: 'Discover our range of premium quality products designed for modern consumers.',
    keywords: ['premium', 'quality', 'sustainable', 'organic'],
    ogImage: '',
    
    // Multilingual & Localization
    multilingualEnabled: false,
    primaryLanguage: 'en',
    additionalLanguages: [],
    defaultCurrency: 'USD',
    measurementUnits: 'metric',
    
    // QR Code & Barcode Rules
    qrCodeStyle: 'modern',
    autoGenerateQR: true,
    defaultQRLanding: 'product-page',
    barcodeMapping: 'auto-link',
    
    // Rewards & Loyalty Defaults
    defaultRewardType: 'points',
    defaultRewardValue: 100,
    pointsExpiry: 365,
    loyaltyRules: {
      repeatScans: 50,
      reviewSubmissions: 25,
      referralBonus: 200
    },
    
    // Smart Trigger Defaults
    locationDefaults: [],
    deviceDefaults: 'all',
    languageDefaults: 'auto',
    
    // Branding & Styling
    colors: {
      primary: '#3B82F6',
      secondary: '#10B981',
      accent: '#F59E0B'
    },
    font: 'inter',
    buttonStyle: 'rounded',
    backgroundPattern: 'none',
    
    // Privacy & Compliance
    termsUrl: 'https://mybrand.com/terms',
    privacyUrl: 'https://mybrand.com/privacy',
    gdprEnabled: true,
    ccpaEnabled: false,
    cookieConsent: true,
    dataSharing: {
      email: true,
      phone: false
    },
    
    // Integrations
    integrations: {
      crm: '',
      analytics: [],
      marketing: [],
      ecommerce: []
    },
    
    // Account & User Management
    brandOwner: {
      name: 'John Doe',
      email: 'john@mybrand.com',
      role: 'Owner'
    },
    users: [
      { id: '1', name: 'Jane Smith', email: 'jane@mybrand.com', role: 'Admin', status: 'Active' },
      { id: '2', name: 'Mike Johnson', email: 'mike@mybrand.com', role: 'Editor', status: 'Active' }
    ],
    subscription: {
      plan: 'Professional',
      status: 'Active'
    }
  });

  const settingsTabs = [
    { id: 'brand-profile', label: 'Brand Profile & Identity', icon: User },
    { id: 'domain-url', label: 'Domain & URL Management', icon: Globe },
    { id: 'seo-defaults', label: 'SEO Defaults', icon: SearchIcon },
    { id: 'multilingual', label: 'Multilingual & Localization', icon: Languages },
    { id: 'qr-barcode', label: 'QR Code & Barcode Rules', icon: QrCode },
    { id: 'rewards-loyalty', label: 'Rewards & Loyalty Defaults', icon: Gift },
    { id: 'smart-triggers', label: 'Smart Trigger Defaults', icon: Zap },
    { id: 'branding-styling', label: 'Branding & Styling', icon: Palette },
    { id: 'privacy-compliance', label: 'Privacy & Compliance', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: Link },
    { id: 'account-users', label: 'Account & User Management', icon: Users }
  ];

  const industries = [
    { value: 'food-beverages', label: 'Food & Beverages' },
    { value: 'personal-care', label: 'Personal Care & Beauty' },
    { value: 'home-living', label: 'Home & Living' },
    { value: 'fashion-apparel', label: 'Fashion & Apparel' },
    { value: 'health-wellness', label: 'Health & Wellness' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'sports-fitness', label: 'Sports & Fitness' },
    { value: 'books-media', label: 'Books & Media' },
    { value: 'toys-games', label: 'Toys & Games' },
    { value: 'other', label: 'Other' }
  ];

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'it', label: 'Italian' },
    { value: 'pt', label: 'Portuguese' },
    { value: 'ru', label: 'Russian' },
    { value: 'ja', label: 'Japanese' },
    { value: 'ko', label: 'Korean' },
    { value: 'zh', label: 'Chinese' },
    { value: 'hi', label: 'Hindi' },
    { value: 'ar', label: 'Arabic' }
  ];

  const currencies = [
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'GBP', label: 'British Pound (£)' },
    { value: 'JPY', label: 'Japanese Yen (¥)' },
    { value: 'CAD', label: 'Canadian Dollar (C$)' },
    { value: 'AUD', label: 'Australian Dollar (A$)' },
    { value: 'INR', label: 'Indian Rupee (₹)' },
    { value: 'CNY', label: 'Chinese Yuan (¥)' }
  ];

  const handleInputChange = (field: string, value: any) => {
    setSettingsData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setSettingsData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof SettingsData],
        [field]: value
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleSaveDraft = () => {
    console.log('Saving as draft:', settingsData);
    setHasUnsavedChanges(false);
    // In a real implementation, this would save to localStorage or send to API
  };

  const handlePublishChanges = () => {
    console.log('Publishing changes:', settingsData);
    setHasUnsavedChanges(false);
    // In a real implementation, this would publish changes globally
  };

  const handleImageUpload = (field: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        handleInputChange(field, url);
      }
    };
    input.click();
  };

  const renderTooltip = (text: string) => (
    <div className="group relative inline-block ml-2">
      <Info className="w-4 h-4 text-gray-400 cursor-help" />
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
        {text}
      </div>
    </div>
  );

  const renderUpgradePrompt = (feature: string) => (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-2">
      <div className="flex items-center space-x-3">
        <Crown className="w-5 h-5 text-orange-600" />
        <div>
          <h4 className="text-sm font-medium text-orange-900">{feature} - Premium Feature</h4>
          <p className="text-sm text-orange-700 mt-1">Upgrade to Professional plan to unlock this feature.</p>
        </div>
        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm">
          Upgrade Now
        </button>
      </div>
    </div>
  );

  const renderBrandProfileTab = () => (
    <div className="space-y-8">
      <CollapsiblePanel title="Basic Information" defaultOpen={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand Name
              {renderTooltip('The official name of your brand as it appears to customers')}
            </label>
            <input
              type="text"
              value={settingsData.brandName}
              onChange={(e) => handleInputChange('brandName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your brand name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industry/Sector
              {renderTooltip('Select the primary industry your brand operates in')}
            </label>
            <select
              value={settingsData.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {industries.map(industry => (
                <option key={industry.value} value={industry.value}>{industry.label}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website URL
              {renderTooltip('Your main website URL')}
            </label>
            <input
              type="url"
              value={settingsData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://yourbrand.com"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Short Description
            {renderTooltip('Brief description of your brand (used in previews and summaries)')}
          </label>
          <input
            type="text"
            value={settingsData.shortDescription}
            onChange={(e) => handleInputChange('shortDescription', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Brief description of your brand"
          />
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Long Description
            {renderTooltip('Detailed description of your brand story and values')}
          </label>
          <textarea
            value={settingsData.longDescription}
            onChange={(e) => handleInputChange('longDescription', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24 resize-none"
            placeholder="Detailed description of your brand..."
          />
        </div>
      </CollapsiblePanel>

      <CollapsiblePanel title="Brand Assets">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand Logo
              {renderTooltip('Upload your brand logo (recommended: 200x200px, PNG format)')}
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {settingsData.brandLogo ? (
                <div className="space-y-4">
                  <img
                    src={settingsData.brandLogo}
                    alt="Brand Logo"
                    className="w-24 h-24 object-contain mx-auto rounded-lg border border-gray-200"
                  />
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleImageUpload('brandLogo')}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Change Logo
                    </button>
                    <button
                      onClick={() => handleInputChange('brandLogo', '')}
                      className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <button
                    onClick={() => handleImageUpload('brandLogo')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Upload Logo
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand Banner
              {renderTooltip('Upload your brand banner (recommended: 1200x400px, JPG/PNG format)')}
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {settingsData.brandBanner ? (
                <div className="space-y-4">
                  <img
                    src={settingsData.brandBanner}
                    alt="Brand Banner"
                    className="w-full h-24 object-cover mx-auto rounded-lg border border-gray-200"
                  />
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleImageUpload('brandBanner')}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Change Banner
                    </button>
                    <button
                      onClick={() => handleInputChange('brandBanner', '')}
                      className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <button
                    onClick={() => handleImageUpload('brandBanner')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Upload Banner
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CollapsiblePanel>

      <CollapsiblePanel title="Contact Information">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Email
              {renderTooltip('Primary email for customer inquiries')}
            </label>
            <input
              type="email"
              value={settingsData.contactEmail}
              onChange={(e) => handleInputChange('contactEmail', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="contact@yourbrand.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
              {renderTooltip('Primary phone number for customer support')}
            </label>
            <input
              type="tel"
              value={settingsData.contactPhone}
              onChange={(e) => handleInputChange('contactPhone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              WhatsApp Number
              {renderTooltip('WhatsApp number for customer support (optional)')}
            </label>
            <input
              type="tel"
              value={settingsData.contactWhatsApp}
              onChange={(e) => handleInputChange('contactWhatsApp', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>
      </CollapsiblePanel>

      <CollapsiblePanel title="Social Media Links">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Facebook className="w-4 h-4 mr-2 text-blue-600" />
              Facebook
              {renderTooltip('Your Facebook page URL')}
            </label>
            <input
              type="url"
              value={settingsData.socialMedia.facebook}
              onChange={(e) => handleNestedInputChange('socialMedia', 'facebook', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://facebook.com/yourbrand"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Instagram className="w-4 h-4 mr-2 text-pink-600" />
              Instagram
              {renderTooltip('Your Instagram profile URL')}
            </label>
            <input
              type="url"
              value={settingsData.socialMedia.instagram}
              onChange={(e) => handleNestedInputChange('socialMedia', 'instagram', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://instagram.com/yourbrand"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Linkedin className="w-4 h-4 mr-2 text-blue-700" />
              LinkedIn
              {renderTooltip('Your LinkedIn company page URL')}
            </label>
            <input
              type="url"
              value={settingsData.socialMedia.linkedin}
              onChange={(e) => handleNestedInputChange('socialMedia', 'linkedin', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://linkedin.com/company/yourbrand"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Twitter className="w-4 h-4 mr-2 text-blue-400" />
              Twitter/X
              {renderTooltip('Your Twitter/X profile URL')}
            </label>
            <input
              type="url"
              value={settingsData.socialMedia.twitter}
              onChange={(e) => handleNestedInputChange('socialMedia', 'twitter', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://twitter.com/yourbrand"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Youtube className="w-4 h-4 mr-2 text-red-600" />
              YouTube
              {renderTooltip('Your YouTube channel URL')}
            </label>
            <input
              type="url"
              value={settingsData.socialMedia.youtube}
              onChange={(e) => handleNestedInputChange('socialMedia', 'youtube', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://youtube.com/@yourbrand"
            />
          </div>
        </div>
      </CollapsiblePanel>
    </div>
  );

  const renderDomainUrlTab = () => (
    <div className="space-y-8">
      <CollapsiblePanel title="Domain Configuration" defaultOpen={true}>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Stegofy Subdomain (Read-only)
              {renderTooltip('Your default Stegofy subdomain - this cannot be changed')}
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={`${settingsData.subdomain}.stegofy.com`}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Copy className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Domain
              {renderTooltip('Use your own domain for product pages (Premium feature)')}
            </label>
            <input
              type="text"
              value={settingsData.customDomain}
              onChange={(e) => handleInputChange('customDomain', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="products.yourbrand.com"
              disabled
            />
            {renderUpgradePrompt('Custom Domain')}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subdomain Setup
              {renderTooltip('Customize your Stegofy subdomain')}
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={settingsData.subdomain}
                onChange={(e) => handleInputChange('subdomain', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="mybrand"
              />
              <span className="text-gray-500">.stegofy.com</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Product Page URL Format
              {renderTooltip('Choose how your product URLs are structured')}
            </label>
            <select
              value={settingsData.urlFormat}
              onChange={(e) => handleInputChange('urlFormat', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="product-name">/p/product-name</option>
              <option value="product-id">/product/product-id</option>
              <option value="category-product">/category/product-name</option>
            </select>
            <div className="mt-2 text-sm text-gray-600">
              Preview: {settingsData.subdomain}.stegofy.com{settingsData.urlFormat === 'product-name' ? '/p/organic-honey-500g' : settingsData.urlFormat === 'product-id' ? '/product/12345' : '/food/organic-honey-500g'}
            </div>
          </div>
        </div>
      </CollapsiblePanel>
    </div>
  );

  const renderSeoDefaultsTab = () => (
    <div className="space-y-8">
      <CollapsiblePanel title="Default Meta Tags" defaultOpen={true}>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Meta Title
              {renderTooltip('Default title tag for product pages (can be overridden per product)')}
            </label>
            <input
              type="text"
              value={settingsData.metaTitle}
              onChange={(e) => handleInputChange('metaTitle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Premium Products | Your Brand"
            />
            <div className="mt-1 text-sm text-gray-500">
              {settingsData.metaTitle.length}/60 characters (recommended)
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Meta Description
              {renderTooltip('Default description for search engines and social media previews')}
            </label>
            <textarea
              value={settingsData.metaDescription}
              onChange={(e) => handleInputChange('metaDescription', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20 resize-none"
              placeholder="Discover our range of premium quality products..."
            />
            <div className="mt-1 text-sm text-gray-500">
              {settingsData.metaDescription.length}/160 characters (recommended)
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Keywords
              {renderTooltip('Default keywords for SEO (comma-separated)')}
            </label>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {settingsData.keywords.map((keyword, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    {keyword}
                    <button
                      onClick={() => {
                        const newKeywords = settingsData.keywords.filter((_, i) => i !== index);
                        handleInputChange('keywords', newKeywords);
                      }}
                      className="ml-2 hover:text-blue-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Add keyword"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const value = (e.target as HTMLInputElement).value.trim();
                      if (value && !settingsData.keywords.includes(value)) {
                        handleInputChange('keywords', [...settingsData.keywords, value]);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="Add keyword"]') as HTMLInputElement;
                    const value = input.value.trim();
                    if (value && !settingsData.keywords.includes(value)) {
                      handleInputChange('keywords', [...settingsData.keywords, value]);
                      input.value = '';
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Open Graph Image
              {renderTooltip('Default image for social media sharing (recommended: 1200x630px)')}
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {settingsData.ogImage ? (
                <div className="space-y-4">
                  <img
                    src={settingsData.ogImage}
                    alt="OG Image"
                    className="w-full h-32 object-cover mx-auto rounded-lg border border-gray-200"
                  />
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleImageUpload('ogImage')}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Change Image
                    </button>
                    <button
                      onClick={() => handleInputChange('ogImage', '')}
                      className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <button
                    onClick={() => handleImageUpload('ogImage')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Upload OG Image
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CollapsiblePanel>
    </div>
  );

  const renderMultilingualTab = () => (
    <div className="space-y-8">
      <CollapsiblePanel title="Language Settings" defaultOpen={true}>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-blue-900">Enable Multilingual Support</h4>
              <p className="text-sm text-blue-700 mt-1">Allow your product pages to be displayed in multiple languages</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settingsData.multilingualEnabled}
                onChange={(e) => handleInputChange('multilingualEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Language
              {renderTooltip('The main language for your brand content')}
            </label>
            <select
              value={settingsData.primaryLanguage}
              onChange={(e) => handleInputChange('primaryLanguage', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {languages.map(lang => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </select>
          </div>

          {settingsData.multilingualEnabled && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Languages
                {renderTooltip('Select additional languages to support')}
              </label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {settingsData.additionalLanguages.map((lang, index) => {
                    const langLabel = languages.find(l => l.value === lang)?.label || lang;
                    return (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                        {langLabel}
                        <button
                          onClick={() => {
                            const newLangs = settingsData.additionalLanguages.filter((_, i) => i !== index);
                            handleInputChange('additionalLanguages', newLangs);
                          }}
                          className="ml-2 hover:text-green-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
                <select
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value && !settingsData.additionalLanguages.includes(value) && value !== settingsData.primaryLanguage) {
                      handleInputChange('additionalLanguages', [...settingsData.additionalLanguages, value]);
                    }
                    e.target.value = '';
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Add a language...</option>
                  {languages.filter(lang => 
                    lang.value !== settingsData.primaryLanguage && 
                    !settingsData.additionalLanguages.includes(lang.value)
                  ).map(lang => (
                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </CollapsiblePanel>

      <CollapsiblePanel title="Regional Settings">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Currency
              {renderTooltip('Default currency for product pricing')}
            </label>
            <select
              value={settingsData.defaultCurrency}
              onChange={(e) => handleInputChange('defaultCurrency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {currencies.map(currency => (
                <option key={currency.value} value={currency.value}>{currency.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Measurement Units
              {renderTooltip('Default measurement system for product specifications')}
            </label>
            <select
              value={settingsData.measurementUnits}
              onChange={(e) => handleInputChange('measurementUnits', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="metric">Metric (kg, cm, °C)</option>
              <option value="imperial">Imperial (lbs, inches, °F)</option>
            </select>
          </div>
        </div>
      </CollapsiblePanel>
    </div>
  );

  const renderQrBarcodeTab = () => (
    <div className="space-y-8">
      <CollapsiblePanel title="QR Code Settings" defaultOpen={true}>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default QR Code Style
              {renderTooltip('Choose the visual style for your QR codes')}
            </label>
            <div className="grid grid-cols-3 gap-4">
              {['modern', 'classic', 'rounded'].map(style => (
                <div
                  key={style}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    settingsData.qrCodeStyle === style ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleInputChange('qrCodeStyle', style)}
                >
                  <div className="w-16 h-16 bg-gray-900 mx-auto mb-2 rounded" style={{
                    borderRadius: style === 'rounded' ? '8px' : style === 'modern' ? '4px' : '0px'
                  }}></div>
                  <div className="text-center text-sm font-medium capitalize">{style}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-green-900">Auto-generate QR for New Products</h4>
              <p className="text-sm text-green-700 mt-1">Automatically create QR codes when new products are added</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settingsData.autoGenerateQR}
                onChange={(e) => handleInputChange('autoGenerateQR', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default QR Landing Page
              {renderTooltip('Where QR codes should redirect users by default')}
            </label>
            <select
              value={settingsData.defaultQRLanding}
              onChange={(e) => handleInputChange('defaultQRLanding', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="product-page">Product Page</option>
              <option value="brand-landing">Brand Landing Page</option>
              <option value="custom-url">Custom URL</option>
            </select>
          </div>
        </div>
      </CollapsiblePanel>

      <CollapsiblePanel title="Barcode Settings">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Barcode Mapping Rules
              {renderTooltip('How barcodes should be linked to products')}
            </label>
            <select
              value={settingsData.barcodeMapping}
              onChange={(e) => handleInputChange('barcodeMapping', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="auto-link">Auto-link to Products</option>
              <option value="manual-link">Manual Link Required</option>
              <option value="disabled">Barcode Scanning Disabled</option>
            </select>
          </div>
        </div>
      </CollapsiblePanel>
    </div>
  );

  const renderRewardsLoyaltyTab = () => (
    <div className="space-y-8">
      <CollapsiblePanel title="Default Reward Settings" defaultOpen={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Reward Type
              {renderTooltip('Default type of reward for new campaigns')}
            </label>
            <select
              value={settingsData.defaultRewardType}
              onChange={(e) => handleInputChange('defaultRewardType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="points">Points</option>
              <option value="coupons">Coupons</option>
              <option value="cashback">Cashback</option>
              <option value="gifts">Gifts</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Reward Value
              {renderTooltip('Default value for rewards (points, percentage, or amount)')}
            </label>
            <input
              type="number"
              value={settingsData.defaultRewardValue}
              onChange={(e) => handleInputChange('defaultRewardValue', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="100"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Points Expiry (Days)
              {renderTooltip('How many days before earned points expire')}
            </label>
            <input
              type="number"
              value={settingsData.pointsExpiry}
              onChange={(e) => handleInputChange('pointsExpiry', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="365"
            />
          </div>
        </div>
      </CollapsiblePanel>

      <CollapsiblePanel title="Loyalty Rules">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Points for Repeat Scans
                {renderTooltip('Points awarded for scanning the same product multiple times')}
              </label>
              <input
                type="number"
                value={settingsData.loyaltyRules.repeatScans}
                onChange={(e) => handleNestedInputChange('loyaltyRules', 'repeatScans', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Points for Review Submissions
                {renderTooltip('Points awarded for submitting product reviews')}
              </label>
              <input
                type="number"
                value={settingsData.loyaltyRules.reviewSubmissions}
                onChange={(e) => handleNestedInputChange('loyaltyRules', 'reviewSubmissions', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="25"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Referral Bonus Points
                {renderTooltip('Points awarded for successful referrals')}
              </label>
              <input
                type="number"
                value={settingsData.loyaltyRules.referralBonus}
                onChange={(e) => handleNestedInputChange('loyaltyRules', 'referralBonus', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="200"
              />
            </div>
          </div>
        </div>
      </CollapsiblePanel>
    </div>
  );

  const renderSmartTriggersTab = () => (
    <div className="space-y-8">
      <CollapsiblePanel title="Location Defaults" defaultOpen={true}>
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Location-based Triggers</h4>
            <p className="text-sm text-blue-700">Configure default behaviors based on user location</p>
          </div>
          
          <div className="text-center py-8 text-gray-500">
            <Target className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>Location defaults will be configured here</p>
            <p className="text-sm">Set up geo-specific content and triggers</p>
          </div>
        </div>
      </CollapsiblePanel>

      <CollapsiblePanel title="Device Defaults">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Device Targeting
              {renderTooltip('Default device types to target with smart triggers')}
            </label>
            <select
              value={settingsData.deviceDefaults}
              onChange={(e) => handleInputChange('deviceDefaults', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Devices</option>
              <option value="mobile">Mobile Only</option>
              <option value="desktop">Desktop Only</option>
              <option value="tablet">Tablet Only</option>
            </select>
          </div>
        </div>
      </CollapsiblePanel>

      <CollapsiblePanel title="Language Defaults">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language Detection
              {renderTooltip('How to handle language detection for smart triggers')}
            </label>
            <select
              value={settingsData.languageDefaults}
              onChange={(e) => handleInputChange('languageDefaults', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="auto">Auto-detect</option>
              <option value="primary">Use Primary Language</option>
              <option value="browser">Use Browser Language</option>
            </select>
          </div>
        </div>
      </CollapsiblePanel>
    </div>
  );

  const renderBrandingStylingTab = () => (
    <div className="space-y-8">
      <CollapsiblePanel title="Color Scheme" defaultOpen={true}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Color
              {renderTooltip('Main brand color used throughout your pages')}
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={settingsData.colors.primary}
                onChange={(e) => handleNestedInputChange('colors', 'primary', e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={settingsData.colors.primary}
                onChange={(e) => handleNestedInputChange('colors', 'primary', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="#3B82F6"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secondary Color
              {renderTooltip('Secondary brand color for accents and highlights')}
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={settingsData.colors.secondary}
                onChange={(e) => handleNestedInputChange('colors', 'secondary', e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={settingsData.colors.secondary}
                onChange={(e) => handleNestedInputChange('colors', 'secondary', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="#10B981"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Accent Color
              {renderTooltip('Accent color for buttons and call-to-action elements')}
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={settingsData.colors.accent}
                onChange={(e) => handleNestedInputChange('colors', 'accent', e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={settingsData.colors.accent}
                onChange={(e) => handleNestedInputChange('colors', 'accent', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="#F59E0B"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Color Preview</h4>
          <div className="flex space-x-4">
            <div className="flex-1 h-16 rounded-lg" style={{ backgroundColor: settingsData.colors.primary }}></div>
            <div className="flex-1 h-16 rounded-lg" style={{ backgroundColor: settingsData.colors.secondary }}></div>
            <div className="flex-1 h-16 rounded-lg" style={{ backgroundColor: settingsData.colors.accent }}></div>
          </div>
        </div>
      </CollapsiblePanel>

      <CollapsiblePanel title="Typography">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Font Family
              {renderTooltip('Default font family for your brand pages')}
            </label>
            <select
              value={settingsData.font}
              onChange={(e) => handleInputChange('font', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="inter">Inter</option>
              <option value="roboto">Roboto</option>
              <option value="open-sans">Open Sans</option>
              <option value="lato">Lato</option>
              <option value="montserrat">Montserrat</option>
              <option value="poppins">Poppins</option>
            </select>
          </div>
        </div>
      </CollapsiblePanel>

      <CollapsiblePanel title="Button Styles">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Button Style Preset
              {renderTooltip('Default style for buttons across your pages')}
            </label>
            <div className="grid grid-cols-3 gap-4">
              {['rounded', 'square', 'pill'].map(style => (
                <div
                  key={style}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    settingsData.buttonStyle === style ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleInputChange('buttonStyle', style)}
                >
                  <div 
                    className="w-full h-10 bg-blue-600 mx-auto mb-2 flex items-center justify-center text-white text-sm"
                    style={{
                      borderRadius: style === 'pill' ? '20px' : style === 'rounded' ? '8px' : '0px'
                    }}
                  >
                    Button
                  </div>
                  <div className="text-center text-sm font-medium capitalize">{style}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CollapsiblePanel>

      <CollapsiblePanel title="Background">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Pattern
              {renderTooltip('Default background pattern for your pages')}
            </label>
            <select
              value={settingsData.backgroundPattern}
              onChange={(e) => handleInputChange('backgroundPattern', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="none">None</option>
              <option value="dots">Dots</option>
              <option value="grid">Grid</option>
              <option value="diagonal">Diagonal Lines</option>
              <option value="waves">Waves</option>
            </select>
          </div>
        </div>
      </CollapsiblePanel>
    </div>
  );

  const renderPrivacyComplianceTab = () => (
    <div className="space-y-8">
      <CollapsiblePanel title="Legal Pages" defaultOpen={true}>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Terms & Conditions URL
              {renderTooltip('Link to your terms and conditions page')}
            </label>
            <input
              type="url"
              value={settingsData.termsUrl}
              onChange={(e) => handleInputChange('termsUrl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://yourbrand.com/terms"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Privacy Policy URL
              {renderTooltip('Link to your privacy policy page')}
            </label>
            <input
              type="url"
              value={settingsData.privacyUrl}
              onChange={(e) => handleInputChange('privacyUrl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://yourbrand.com/privacy"
            />
          </div>
        </div>
      </CollapsiblePanel>

      <CollapsiblePanel title="Compliance Settings">
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-blue-900">GDPR Compliance</h4>
              <p className="text-sm text-blue-700 mt-1">Enable GDPR compliance features for EU users</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settingsData.gdprEnabled}
                onChange={(e) => handleInputChange('gdprEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-purple-900">CCPA Compliance</h4>
              <p className="text-sm text-purple-700 mt-1">Enable CCPA compliance features for California users</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settingsData.ccpaEnabled}
                onChange={(e) => handleInputChange('ccpaEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-green-900">Cookie Consent</h4>
              <p className="text-sm text-green-700 mt-1">Show cookie consent banner to users</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settingsData.cookieConsent}
                onChange={(e) => handleInputChange('cookieConsent', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>
        </div>
      </CollapsiblePanel>

      <CollapsiblePanel title="Data Sharing Preferences">
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Email Sharing</h4>
              <p className="text-sm text-gray-600 mt-1">Allow sharing customer email addresses with partners</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settingsData.dataSharing.email}
                onChange={(e) => handleNestedInputChange('dataSharing', 'email', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Phone Sharing</h4>
              <p className="text-sm text-gray-600 mt-1">Allow sharing customer phone numbers with partners</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settingsData.dataSharing.phone}
                onChange={(e) => handleNestedInputChange('dataSharing', 'phone', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </CollapsiblePanel>
    </div>
  );

  const renderIntegrationsTab = () => (
    <div className="space-y-8">
      <CollapsiblePanel title="CRM Integrations" defaultOpen={true}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'HubSpot', icon: Database, color: 'orange' },
              { name: 'Zoho CRM', icon: Database, color: 'blue' },
              { name: 'Salesforce', icon: Database, color: 'blue' }
            ].map(crm => (
              <div key={crm.name} className="border border-gray-200 rounded-lg p-4 text-center">
                <crm.icon className={`w-12 h-12 mx-auto mb-3 text-${crm.color}-600`} />
                <h4 className="font-medium text-gray-900 mb-2">{crm.name}</h4>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  Connect
                </button>
              </div>
            ))}
          </div>
        </div>
      </CollapsiblePanel>

      <CollapsiblePanel title="Analytics Integrations">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Google Analytics', icon: BarChart3, color: 'green' },
              { name: 'Meta Pixel', icon: BarChart3, color: 'blue' }
            ].map(analytics => (
              <div key={analytics.name} className="border border-gray-200 rounded-lg p-4 text-center">
                <analytics.icon className={`w-12 h-12 mx-auto mb-3 text-${analytics.color}-600`} />
                <h4 className="font-medium text-gray-900 mb-2">{analytics.name}</h4>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  Connect
                </button>
              </div>
            ))}
          </div>
        </div>
      </CollapsiblePanel>

      <CollapsiblePanel title="Marketing Integrations">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Mailchimp', icon: Mail, color: 'yellow' },
              { name: 'Klaviyo', icon: Mail, color: 'purple' }
            ].map(marketing => (
              <div key={marketing.name} className="border border-gray-200 rounded-lg p-4 text-center">
                <marketing.icon className={`w-12 h-12 mx-auto mb-3 text-${marketing.color}-600`} />
                <h4 className="font-medium text-gray-900 mb-2">{marketing.name}</h4>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  Connect
                </button>
              </div>
            ))}
          </div>
        </div>
      </CollapsiblePanel>

      <CollapsiblePanel title="E-commerce Integrations">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Shopify', icon: ShoppingCart, color: 'green' },
              { name: 'WooCommerce', icon: ShoppingCart, color: 'purple' }
            ].map(ecommerce => (
              <div key={ecommerce.name} className="border border-gray-200 rounded-lg p-4 text-center">
                <ecommerce.icon className={`w-12 h-12 mx-auto mb-3 text-${ecommerce.color}-600`} />
                <h4 className="font-medium text-gray-900 mb-2">{ecommerce.name}</h4>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  Connect
                </button>
              </div>
            ))}
          </div>
        </div>
      </CollapsiblePanel>
    </div>
  );

  const renderAccountUsersTab = () => (
    <div className="space-y-8">
      <CollapsiblePanel title="Brand Owner Information" defaultOpen={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Owner Name
              {renderTooltip('Name of the brand owner/administrator')}
            </label>
            <input
              type="text"
              value={settingsData.brandOwner.name}
              onChange={(e) => handleNestedInputChange('brandOwner', 'name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Owner Email
              {renderTooltip('Email address of the brand owner')}
            </label>
            <input
              type="email"
              value={settingsData.brandOwner.email}
              onChange={(e) => handleNestedInputChange('brandOwner', 'email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="john@yourbrand.com"
            />
          </div>
        </div>
      </CollapsiblePanel>

      <CollapsiblePanel title="User Management">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-medium text-gray-900">Team Members</h4>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <UserPlus className="w-4 h-4 mr-2" />
              Invite User
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mr-3">
                        <CrownIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{settingsData.brandOwner.name}</div>
                        <div className="text-sm text-gray-500">{settingsData.brandOwner.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Owner
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-1 hover:bg-gray-100 rounded transition-colors" title="Edit">
                      <Edit className="w-4 h-4 text-gray-500" />
                    </button>
                  </td>
                </tr>
                {settingsData.users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mr-3">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'Admin' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors" title="Edit">
                          <Edit className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-1 hover:bg-red-100 rounded transition-colors" title="Remove">
                          <UserMinus className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CollapsiblePanel>

      <CollapsiblePanel title="Subscription & Billing">
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-medium text-green-900">
                  {settingsData.subscription.plan} Plan
                </h4>
                <p className="text-sm text-green-700 mt-1">
                  Status: {settingsData.subscription.status}
                </p>
              </div>
              <div className="flex space-x-3">
                <button className="px-4 py-2 border border-green-300 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                  View Billing
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Upgrade Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </CollapsiblePanel>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'brand-profile':
        return renderBrandProfileTab();
      case 'domain-url':
        return renderDomainUrlTab();
      case 'seo-defaults':
        return renderSeoDefaultsTab();
      case 'multilingual':
        return renderMultilingualTab();
      case 'qr-barcode':
        return renderQrBarcodeTab();
      case 'rewards-loyalty':
        return renderRewardsLoyaltyTab();
      case 'smart-triggers':
        return renderSmartTriggersTab();
      case 'branding-styling':
        return renderBrandingStylingTab();
      case 'privacy-compliance':
        return renderPrivacyComplianceTab();
      case 'integrations':
        return renderIntegrationsTab();
      case 'account-users':
        return renderAccountUsersTab();
      default:
        return renderBrandProfileTab();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Settings className="w-7 h-7 mr-3 text-blue-600" />
              Settings
            </h1>
            <p className="text-gray-600 mt-1">Centralized brand control center</p>
          </div>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search settings..."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar - Settings Navigation */}
        <div className="w-80 bg-white border-r border-gray-200 h-screen overflow-y-auto">
          <nav className="p-4">
            <div className="space-y-1">
              {settingsTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className="font-medium text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8 pb-24">
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Sticky Save/Publish Bar */}
      <div className="fixed bottom-0 left-80 right-0 bg-white border-t border-gray-200 px-8 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {hasUnsavedChanges && (
              <div className="flex items-center text-orange-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-2" />
                You have unsaved changes
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleSaveDraft}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Save as Draft
            </button>
            <button
              onClick={handlePublishChanges}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Publish Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;