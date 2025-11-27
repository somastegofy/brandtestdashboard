import React, { useState, useEffect } from 'react';
import { Lock, Copy, Download, ExternalLink, AlertCircle, Check, ChevronDown, ChevronUp, Settings, QrCode } from 'lucide-react';
import QRGenerator, { QRCustomization } from './QRGenerator';
import { saveQRCode, linkQRCodeToPage, loadQRCodeById } from '../../api/qrCodes';

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
  studioPageId = null,
}) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const [utmExpanded, setUtmExpanded] = useState(false);
  const [isSavingQR, setIsSavingQR] = useState(false);
  const [isLoadingQR, setIsLoadingQR] = useState(false);

  // Helper function to validate UUID
  const isValidUUID = (str: string): boolean => {
    if (!str) return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };

  // Load saved QR code from database when qrCodeId changes
  useEffect(() => {
    const loadSavedQRCode = async () => {
      if (data.qrCodeId && isValidUUID(data.qrCodeId)) {
        setIsLoadingQR(true);
        try {
          const savedQR = await loadQRCodeById(data.qrCodeId);
          if (savedQR) {
            // Update QR code images if they exist in the database
            if (savedQR.qr_image_png) {
              onChange('qrImagePng', savedQR.qr_image_png);
            }
            if (savedQR.qr_image_svg) {
              onChange('qrImageSvg', savedQR.qr_image_svg);
            }
            if (savedQR.qr_image_jpeg) {
              onChange('qrImageJpeg', savedQR.qr_image_jpeg);
            }
            if (savedQR.customization) {
              onChange('qrCustomization', savedQR.customization);
            }
          }
        } catch (error) {
          console.error('Error loading saved QR code:', error);
        } finally {
          setIsLoadingQR(false);
        }
      }
    };

    loadSavedQRCode();
  }, [data.qrCodeId, onChange]); // Load when qrCodeId changes

  // Generate a blurred placeholder QR code (simple static pattern)
  const getPlaceholderQR = () => {
    // Create a simple SVG pattern that looks like a blurred QR code
    const blocks = [];
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 15; j++) {
        if (Math.random() > 0.5) {
          const size = 10;
          const x = 30 + i * 13;
          const y = 30 + j * 13;
          blocks.push(`<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="#9ca3af" opacity="0.4"/>`);
        }
      }
    }
    
    const svgContent = `
      <svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
        <rect width="256" height="256" fill="#f3f4f6"/>
        <rect x="20" y="20" width="216" height="216" fill="#ffffff" stroke="#d1d5db" stroke-width="2"/>
        ${blocks.join('')}
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svgContent)}`;
  };

  const fullUrl = `${baseUrl}/published-product/${data.slug}`;
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
    // Open the published page URL directly (not the QR redirect)
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

  const handleQRGenerated = async (qrData: {
    qrId: string;
    qrImagePng: string;
    qrImageSvg: string;
    qrImageJpeg: string;
    customization: QRCustomization;
  }) => {
    setIsSavingQR(true);
    try {
      // For new QR codes, use null to let database generate UUID
      // For existing QR codes, use the existing UUID (data.qrCodeId)
      // qrData.qrId might be a temporary string like "qr-123456789", so we ignore it for new codes
      const qrCodeIdToUse = data.qrCodeId || null;

      // For new QR codes, the images were generated with the direct published URL (fullUrl)
      // For existing QR codes (with qrCodeId), they were generated with the redirect URL
      const qrUrl = data.qrCodeId 
        ? `${baseUrl}/qr/${data.qrCodeId}${urlWithUTM !== fullUrl ? `?${urlWithUTM.split('?')[1]}` : ''}` // Redirect URL for tracking
        : (urlWithUTM || fullUrl); // Direct published URL (now includes /published-product/)

      // Save QR code to database - pass null for new codes to let DB generate UUID
      const qrCode = await saveQRCode(qrCodeIdToUse, {
        name: data.campaignName || `QR Code for ${data.slug || 'Page'}`,
        url: qrUrl,
        qrImagePng: qrData.qrImagePng,
        qrImageSvg: qrData.qrImageSvg,
        qrImageJpeg: qrData.qrImageJpeg,
        customization: qrData.customization,
        campaignName: data.campaignName || null,
        folderId: data.folderId || null,
        utmSource: data.utmSource || undefined,
        utmMedium: data.utmMedium || undefined,
        utmCampaign: data.utmCampaign || undefined,
      });

      // Link QR code to studio page if page ID exists
      if (studioPageId && qrCode.id) {
        await linkQRCodeToPage(qrCode.id, studioPageId);
      }

      // If this is a new QR code (no qrCodeId), we can optionally regenerate with redirect URL for tracking
      // But for now, we'll save with the direct URL so it works immediately
      // Users can regenerate later with the redirect URL if they want tracking

      // Update QR code data in state
      onChange('qrCodeId', qrCode.id);
      onChange('qrImagePng', qrData.qrImagePng);
      onChange('qrImageSvg', qrData.qrImageSvg);
      onChange('qrImageJpeg', qrData.qrImageJpeg);
      onChange('qrCustomization', qrData.customization);
      onChange('qrOption', 'create_new');

      setShowQRGenerator(false);
      alert('QR code saved successfully!');
    } catch (error: any) {
      console.error('Error saving QR code:', error);
      alert(`Failed to save QR code: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSavingQR(false);
    }
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
                  {/* Always show QR code preview - saved or placeholder */}
                  <div className="p-4 border border-gray-200 rounded-lg bg-white space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {data.qrCodeId && isValidUUID(data.qrCodeId) ? 'Saved QR Code Preview' : 'QR Code Preview'}
                      </p>
                      {data.qrCodeId && isValidUUID(data.qrCodeId) && (
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
                      <div className={`w-48 h-48 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center relative ${
                        !data.qrCodeId || !isValidUUID(data.qrCodeId) ? 'opacity-50' : ''
                      }`}>
                        {isLoadingQR ? (
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <p className="text-xs text-gray-500">Loading...</p>
                          </div>
                        ) : (data.qrImagePng || data.qrImageSvg || data.qrImageJpeg) && (data.qrCodeId && isValidUUID(data.qrCodeId)) ? (
                          // Show saved QR code
                          <img
                            src={data.qrImagePng || data.qrImageSvg || data.qrImageJpeg}
                            alt="Saved QR Code"
                            className="w-full h-full object-contain p-2"
                          />
                        ) : (
                          // Show blurred placeholder QR code
                          <div className="relative w-full h-full flex flex-col items-center justify-center">
                            <img
                              src={getPlaceholderQR()}
                              alt="Placeholder QR Code"
                              className="w-full h-full object-contain p-2 blur-sm"
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 rounded-lg">
                              <QrCode className="w-12 h-12 text-gray-400 mb-2" />
                              <p className="text-xs text-gray-600 text-center px-4">
                                {!data.slug || data.slug.trim() === '' 
                                  ? 'Enter a slug first to generate QR code'
                                  : 'Generate QR Code to save and preview'
                                }
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      {data.qrCodeId && isValidUUID(data.qrCodeId) && (
                        <div className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-green-600" />
                          <p className="text-xs text-green-600">QR Code Saved</p>
                          <p className="text-xs text-gray-500">•</p>
                          <p className="text-xs text-gray-500">ID: <span className="font-mono">{data.qrCodeId.substring(0, 8)}...</span></p>
                        </div>
                      )}
                      {(!data.qrCodeId || !isValidUUID(data.qrCodeId)) && (
                        <p className="text-xs text-amber-600 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          QR code not saved yet. Generate and save to enable scanning.
                        </p>
                      )}
                      
                      {/* Generate/Edit Button */}
                      <button
                        onClick={handleCreateQR}
                        disabled={!data.slug || data.slug.trim() === '' || isSavingQR || isLoadingQR}
                        className={`w-full px-4 py-2 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${
                          data.qrCodeId && isValidUUID(data.qrCodeId)
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {isSavingQR ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Settings className="w-4 h-4 mr-2" />
                            {data.qrCodeId && isValidUUID(data.qrCodeId) ? 'Edit QR Code Design' : 'Generate QR Code'}
                          </>
                        )}
                      </button>
                      
                      {/* Download buttons - only show if QR code is saved */}
                      {data.qrCodeId && isValidUUID(data.qrCodeId) && (data.qrImagePng || data.qrImageSvg || data.qrImageJpeg) && (
                        <div className="flex flex-wrap gap-2 justify-center w-full pt-2 border-t border-gray-200">
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
                      )}
                    </div>
                  </div>
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
          url={data.qrCodeId 
            ? `${baseUrl}/qr/${data.qrCodeId}${urlWithUTM !== fullUrl ? `?${urlWithUTM.split('?')[1]}` : ''}`
            : (urlWithUTM || fullUrl) // For new QR codes, use direct published URL (includes /published-product/)
          }
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
