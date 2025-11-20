import React, { useState } from 'react';
import { 
  Upload, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Gift, 
  ShoppingCart, 
  FileText, 
  Camera, 
  Check, 
  AlertCircle,
  Eye,
  EyeOff,
  Settings,
  Target,
  Zap,
  Award,
  CreditCard,
  Coins,
  Ticket
} from 'lucide-react';
import { PurchaseVerificationConfig } from '../types/buyerSourceTypes';

interface PurchaseVerificationBlockProps {
  config: PurchaseVerificationConfig;
  onConfigChange: (config: PurchaseVerificationConfig) => void;
  isEditing?: boolean;
}

const PurchaseVerificationBlock: React.FC<PurchaseVerificationBlockProps> = ({ 
  config, 
  onConfigChange, 
  isEditing = false 
}) => {
  const [showPreview, setShowPreview] = useState(false);

  const rewardTypeIcons = {
    Points: Coins,
    Coupon: Ticket,
    Voucher: CreditCard,
    Gift: Gift
  };

  const defaultPurchaseSources = [
    'Amazon', 'Flipkart', 'Zepto', 'Dmart', 'BigBasket', 
    'Swiggy Instamart', 'Blinkit', 'JioMart', 'Other'
  ];

  const handleFieldToggle = (field: string, checked: boolean) => {
    const updatedFields = checked 
      ? [...config.fieldsToCollect, field as any]
      : config.fieldsToCollect.filter(f => f !== field);
    
    onConfigChange({
      ...config,
      fieldsToCollect: updatedFields
    });
  };

  const handlePurchaseSourceChange = (sources: string[]) => {
    onConfigChange({
      ...config,
      purchaseSourceOptions: sources
    });
  };

  const addPurchaseSource = (source: string) => {
    if (source && !config.purchaseSourceOptions.includes(source)) {
      handlePurchaseSourceChange([...config.purchaseSourceOptions, source]);
    }
  };

  const removePurchaseSource = (source: string) => {
    handlePurchaseSourceChange(config.purchaseSourceOptions.filter(s => s !== source));
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Purchase Verification Block</h3>
              <p className="text-sm text-gray-600">Configure purchase verification form</p>
            </div>
          </div>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <div className="space-y-6">
            {/* Basic Settings */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Basic Settings</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={config.title}
                    onChange={(e) => onConfigChange({...config, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Get 10% Off Your Next Purchase"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={config.description}
                    onChange={(e) => onConfigChange({...config, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20 resize-none"
                    placeholder="Brief instructions for users..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reward Type</label>
                  <select
                    value={config.rewardType}
                    onChange={(e) => onConfigChange({...config, rewardType: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Points">Points</option>
                    <option value="Coupon">Coupon</option>
                    <option value="Voucher">Voucher</option>
                    <option value="Gift">Gift</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CTA Button Text</label>
                  <input
                    type="text"
                    value={config.ctaButtonText}
                    onChange={(e) => onConfigChange({...config, ctaButtonText: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Submit & Claim Reward"
                  />
                </div>
              </div>
            </div>

            {/* Purchase Sources */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Purchase Source Options</h4>
              <div className="space-y-3">
                {defaultPurchaseSources.map(source => (
                  <label key={source} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.purchaseSourceOptions.includes(source)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          addPurchaseSource(source);
                        } else {
                          removePurchaseSource(source);
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{source}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Fields to Collect */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Fields to Collect</h4>
              <div className="space-y-3">
                {['Name', 'Age', 'Mobile', 'Email', 'Location'].map(field => (
                  <label key={field} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.fieldsToCollect.includes(field as any)}
                      onChange={(e) => handleFieldToggle(field, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{field}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Advanced Settings */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Advanced Settings</h4>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm font-medium text-gray-700">Require Invoice Upload</span>
                  <input
                    type="checkbox"
                    checked={config.requireInvoiceUpload}
                    onChange={(e) => onConfigChange({...config, requireInvoiceUpload: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm font-medium text-gray-700">Auto-capture Location</span>
                  <input
                    type="checkbox"
                    checked={config.autoCaptureLocation}
                    onChange={(e) => onConfigChange({...config, autoCaptureLocation: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm font-medium text-gray-700">Show Scan Type to Brand</span>
                  <input
                    type="checkbox"
                    checked={config.showScanTypeToBrand}
                    onChange={(e) => onConfigChange({...config, showScanTypeToBrand: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Visibility Rule</label>
                  <select
                    value={config.visibilityRule}
                    onChange={(e) => onConfigChange({...config, visibilityRule: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Always">Always Show</option>
                    <option value="Post-scan">Show Only Post-scan</option>
                    <option value="Post-validation">Show Only Post-validation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Post-Submission Message</label>
                  <textarea
                    value={config.postSubmissionMessage}
                    onChange={(e) => onConfigChange({...config, postSubmissionMessage: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-16 resize-none"
                    placeholder="Thank you! Your reward will be sent shortly..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Live Preview</h4>
              <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-md mx-auto">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                    {React.createElement(rewardTypeIcons[config.rewardType], { 
                      className: "w-6 h-6 text-blue-600" 
                    })}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {config.title || 'Reward Title'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {config.description || 'Reward description will appear here'}
                  </p>
                </div>

                <form className="space-y-4">
                  {config.fieldsToCollect.includes('Name') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your name"
                      />
                    </div>
                  )}

                  {config.fieldsToCollect.includes('Email') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your email"
                      />
                    </div>
                  )}

                  {config.fieldsToCollect.includes('Mobile') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                      <input
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your mobile number"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Source</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="">Select purchase source</option>
                      {config.purchaseSourceOptions.map(source => (
                        <option key={source} value={source}>{source}</option>
                      ))}
                    </select>
                  </div>

                  {config.requireInvoiceUpload && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Upload Invoice</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {config.ctaButtonText || 'Submit & Claim Reward'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render the actual component for end users
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-3">
          {React.createElement(rewardTypeIcons[config.rewardType], { 
            className: "w-6 h-6 text-blue-600" 
          })}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{config.title}</h3>
        <p className="text-sm text-gray-600">{config.description}</p>
      </div>

      <form className="space-y-4">
        {config.fieldsToCollect.includes('Name') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your name"
            />
          </div>
        )}

        {config.fieldsToCollect.includes('Email') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>
        )}

        {config.fieldsToCollect.includes('Mobile') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
            <input
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your mobile number"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Source</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">Select purchase source</option>
            {config.purchaseSourceOptions.map(source => (
              <option key={source} value={source}>{source}</option>
            ))}
          </select>
        </div>

        {config.requireInvoiceUpload && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Invoice</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer">
              <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500 mt-1">JPG, PNG, PDF up to 10MB</p>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          <Gift className="w-4 h-4 mr-2" />
          {config.ctaButtonText}
        </button>
      </form>
    </div>
  );
};

export default PurchaseVerificationBlock;