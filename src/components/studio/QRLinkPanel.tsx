import React, { useState } from 'react';
import { Lock, Copy, Download, ExternalLink, AlertCircle, Check, ChevronDown, ChevronUp, Settings } from 'lucide-react';
import QRGenerator, { QRCustomization } from './QRGenerator';

export interface QRLinkData {
  slug: string;
  isSlugLocked: boolean;
  campaignName: string;
  folderId: string;
  qrOption: 'reuse' | 'create_new';
  qrCodeId: string;
  qrImagePng: string;
  qrImageSvg: string;
  qrImageJpeg: string;
  qrCustomization?: QRCustomization;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
}

interface QRLinkPanelProps {
  data: QRLinkData;
  onChange: (key: keyof QRLinkData, value: any) => void;
  baseUrl: string;
  folders: Array<{ id: string; name: string }>;
  existingQRCodes: Array<{ id: string; name: string; imageUrl: string }>;
  onSaveAndLockSlug: () => void;
  onCreateNewQR: () => void;
  slugAvailability?: 'idle' | 'checking' | 'available' | 'unavailable';
  slugError?: string;
  onUnlockSlug?: () => void;
}

const QRLinkPanel: React.FC<QRLinkPanelProps> = ({
  data,
  onChange,
  baseUrl,
  folders,
  existingQRCodes,
  onSaveAndLockSlug,
  onCreateNewQR,
  slugAvailability = 'idle',
  slugError = '',
  onUnlockSlug,
}) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const [utmExpanded, setUtmExpanded] = useState(false);

  const fullUrl = `${baseUrl}/${data.slug}`;
  const urlWithUTM = data.utmSource || data.utmMedium || data.utmCampaign
    ? `${fullUrl}?${[
        data.utmSource && `utm_source=${encodeURIComponent(data.utmSource)}`,
        data.utmMedium && `utm_medium=${encodeURIComponent(data.utmMedium)}`,
        data.utmCampaign && `utm_campaign=${encodeURIComponent(data.utmCampaign)}`,
      ]
        .filter(Boolean)
        .join('&')}`
    : fullUrl;

  // Slug validation and availability checking is handled by parent component (StudioTab)
  // This component only displays the status passed as props and normalizes the input
  const handleSlugChange = (newSlug: string) => {
    // Normalize slug: convert to lowercase, replace spaces with hyphens, remove invalid characters
    const normalized = newSlug
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    onChange('slug', normalized);
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(urlWithUTM);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const handleDownloadQR = (format: 'png' | 'svg' | 'jpeg') => {
    let imageUrl = '';
    let extension = '';
    
    switch (format) {
      case 'png':
        imageUrl = data.qrImagePng;
        extension = 'png';
        break;
      case 'svg':
        imageUrl = data.qrImageSvg;
        extension = 'svg';
        break;
      case 'jpeg':
        imageUrl = data.qrImageJpeg;
        extension = 'jpg';
        break;
    }
    
    if (!imageUrl) return;

    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `qr-code-${data.slug || 'qr'}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTestScan = () => {
    window.open(fullUrl, '_blank');
  };

  const handleLockSlug = () => {
    setShowLockModal(true);
  };

  const confirmLockSlug = () => {
    onSaveAndLockSlug();
    setShowLockModal(false);
  };

  const handleCreateQR = () => {
    if (data.qrCodeId) {
      // If QR code already exists, show confirmation
      setShowQRModal(true);
    } else {
      // If no QR code exists, open generator directly
      setShowQRGenerator(true);
    }
  };

  const confirmCreateQR = () => {
    setShowQRModal(false);
    setShowQRGenerator(true);
  };

  const handleQRGenerated = (qrData: {
    qrId: string;
    qrImagePng: string;
    qrImageSvg: string;
    qrImageJpeg: string;
    customization: QRCustomization;
  }) => {
    // Update QR code data
    onChange('qrCodeId', qrData.qrId);
    onChange('qrImagePng', qrData.qrImagePng);
    onChange('qrImageSvg', qrData.qrImageSvg);
    onChange('qrImageJpeg', qrData.qrImageJpeg);
    onChange('qrCustomization', qrData.customization);
    onChange('qrOption', 'create_new');
    
    setShowQRGenerator(false);
  };

  const handleEditQR = () => {
    setShowQRGenerator(true);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">URL Management</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Base Domain
                </label>
                <input
                  type="text"
                  value={baseUrl}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={data.slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    disabled={data.isSlugLocked}
                    className={`w-full px-3 py-2 pr-10 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      data.isSlugLocked
                        ? 'bg-gray-50 text-gray-600 cursor-not-allowed'
                        : slugError
                        ? 'border-red-300 bg-red-50'
                        : slugAvailability === 'available'
                        ? 'border-green-300 bg-green-50'
                        : slugAvailability === 'checking'
                        ? 'border-yellow-300 bg-yellow-50'
                        : slugAvailability === 'unavailable'
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300'
                    }`}
                    placeholder="my-awesome-page"
                  />
                  {data.isSlugLocked && (
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" title="Slug is locked" />
                  )}
                  {!data.isSlugLocked && slugAvailability === 'checking' && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    </div>
                  )}
                  {!data.isSlugLocked && slugAvailability === 'available' && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                  )}
                  {!data.isSlugLocked && slugAvailability === 'unavailable' && (
                    <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-600" />
                  )}
                </div>
                {slugError && (
                  <p className="text-xs text-red-600 mt-1">{slugError}</p>
                )}
                {!slugError && slugAvailability === 'available' && (
                  <p className="text-xs text-green-600 mt-1">This slug is available!</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  5-32 characters, lowercase letters, numbers, and hyphens only. Cannot start or end with a hyphen.
                </p>
              </div>

              {data.isSlugLocked ? (
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between text-sm text-blue-800">
                      <div className="flex items-center">
                        <Lock className="w-4 h-4 mr-2" />
                        <span>Slug is locked and cannot be changed</span>
                      </div>
                      {onUnlockSlug && (
                        <button
                          onClick={onUnlockSlug}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium underline"
                        >
                          Unlock
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                slugAvailability === 'available' && (
                  <button
                    onClick={handleLockSlug}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Save & Lock Slug
                  </button>
                )
              )}

              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-xs font-medium text-gray-700 mb-1">Full URL</p>
                <p className="text-sm text-gray-900 break-all">{fullUrl}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Campaign Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Campaign Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={data.campaignName}
                  onChange={(e) => onChange('campaignName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Summer Sale 2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Folder (Optional)
                </label>
                <select
                  value={data.folderId}
                  onChange={(e) => onChange('folderId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">No folder</option>
                  {folders.map((folder) => (
                    <option key={folder.id} value={folder.id}>
                      {folder.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">QR Code Options</h3>
            <div className="space-y-4">
              <div>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="reuse"
                      checked={data.qrOption === 'reuse'}
                      onChange={(e) => onChange('qrOption', 'reuse')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Reuse existing QR code</span>
                  </label>

                  {data.qrOption === 'reuse' && (
                    <div className="ml-6">
                      <select
                        value={data.qrCodeId}
                        onChange={(e) => onChange('qrCodeId', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        <option value="">Select QR code...</option>
                        {existingQRCodes.map((qr) => (
                          <option key={qr.id} value={qr.id}>
                            {qr.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="create_new"
                      checked={data.qrOption === 'create_new'}
                      onChange={(e) => onChange('qrOption', 'create_new')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Create new QR code</span>
                  </label>
                </div>
              </div>

              {data.qrOption === 'create_new' && (
                <div className="space-y-3">
                  {!data.qrImagePng && (
                    <button
                      onClick={handleCreateQR}
                      disabled={!data.slug || data.slug.trim() === ''}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      {data.qrCodeId ? 'Regenerate QR Code' : 'Generate QR Code'}
                    </button>
                  )}

                  {(data.qrImagePng || data.qrImageSvg || data.qrImageJpeg) && (
                    <div className="p-4 border border-gray-200 rounded-lg bg-white space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">QR Code Preview</p>
                        {data.qrCodeId && (
                          <button
                            onClick={handleEditQR}
                            className="inline-flex items-center px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                            title="Edit QR Code Design"
                          >
                            <Settings className="w-3 h-3 mr-1" />
                            Edit Design
                          </button>
                        )}
                      </div>
                      <div className="flex flex-col items-center space-y-3">
                        <div className="w-48 h-48 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center">
                          {data.qrImagePng ? (
                            <img
                              src={data.qrImagePng}
                              alt="QR Code"
                              className="w-full h-full object-contain p-2"
                            />
                          ) : data.qrImageSvg ? (
                            <img
                              src={data.qrImageSvg}
                              alt="QR Code"
                              className="w-full h-full object-contain p-2"
                            />
                          ) : (
                            <p className="text-gray-400 text-sm">QR Code Preview</p>
                          )}
                        </div>
                        {data.qrCodeId && (
                          <p className="text-xs text-gray-500">QR ID: <span className="font-mono">{data.qrCodeId}</span></p>
                        )}
                        <div className="flex flex-wrap gap-2 justify-center">
                          <button
                            onClick={handleCopyUrl}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-xs"
                          >
                            {copiedUrl ? (
                              <>
                                <Check className="w-3.5 h-3.5 mr-1.5" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 mr-1.5" />
                                Copy URL
                              </>
                            )}
                          </button>
                          {data.qrImagePng && (
                            <button
                              onClick={() => handleDownloadQR('png')}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-xs"
                            >
                              <Download className="w-3.5 h-3.5 mr-1.5" />
                              PNG
                            </button>
                          )}
                          {data.qrImageSvg && (
                            <button
                              onClick={() => handleDownloadQR('svg')}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-xs"
                            >
                              <Download className="w-3.5 h-3.5 mr-1.5" />
                              SVG
                            </button>
                          )}
                          {data.qrImageJpeg && (
                            <button
                              onClick={() => handleDownloadQR('jpeg')}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-xs"
                            >
                              <Download className="w-3.5 h-3.5 mr-1.5" />
                              JPEG
                            </button>
                          )}
                          <button
                            onClick={handleTestScan}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-xs"
                          >
                            <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                            Test Scan
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <button
              onClick={() => setUtmExpanded(!utmExpanded)}
              className="flex items-center justify-between w-full text-sm font-semibold text-gray-900 mb-3"
            >
              <span>UTM Builder (Optional)</span>
              {utmExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {utmExpanded && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Source
                  </label>
                  <input
                    type="text"
                    value={data.utmSource}
                    onChange={(e) => onChange('utmSource', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="facebook"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medium
                  </label>
                  <input
                    type="text"
                    value={data.utmMedium}
                    onChange={(e) => onChange('utmMedium', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="social"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Campaign
                  </label>
                  <input
                    type="text"
                    value={data.utmCampaign}
                    onChange={(e) => onChange('utmCampaign', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="summer_sale"
                  />
                </div>

                {(data.utmSource || data.utmMedium || data.utmCampaign) && (
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-xs font-medium text-gray-700 mb-1">Preview with UTM</p>
                    <p className="text-xs text-gray-900 break-all">{urlWithUTM}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showLockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-start mb-4">
                <AlertCircle className="w-6 h-6 text-orange-500 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Lock Slug Permanently?
                  </h3>
                  <p className="text-sm text-gray-600">
                    Once you lock this slug, it cannot be changed. The URL will be permanent. Are you sure you want to continue?
                  </p>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowLockModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLockSlug}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Yes, Lock Slug
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showQRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-start mb-4">
                <AlertCircle className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Generate New QR Code?
                  </h3>
                  <p className="text-sm text-gray-600">
                    A new QR code will be created for this page. You can download and share it with your audience.
                  </p>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowQRModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmCreateQR}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  Generate QR Code
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Generator Modal */}
      {showQRGenerator && (
        <QRGenerator
          url={urlWithUTM || fullUrl}
          qrId={data.qrCodeId || undefined}
          existingCustomization={data.qrCustomization}
          onGenerate={handleQRGenerated}
          onClose={() => setShowQRGenerator(false)}
        />
      )}
    </div>
  );
};

export default QRLinkPanel;
