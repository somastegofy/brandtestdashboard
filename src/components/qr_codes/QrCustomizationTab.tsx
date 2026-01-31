import React, { useState, useEffect } from 'react';
import { ArrowLeft, Link as LinkIcon, Palette, QrCode as QrCodeIcon } from 'lucide-react';
import type { QrCode } from '../../types/qrCodeTypes';
import type { Product } from '../../types/productTypes';
import type { StudioPage } from '../../types/qrCodeTypes';
import QRGenerator, { QRCustomization } from '../studio/QRGenerator';
import { saveQRCode, updateQRCodeUrl, QRCode as DbQRCode } from '../../api/qrCodes';
import { getCurrentBrandProfile, getBrandNameSlug, getQRType } from '../../api/brandProfile';
import { createShortenedURL } from '../../api/cloudflareKV';

// Simple UUID generator for client-side ID reservation
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

interface QrCustomizationTabProps {
  selectedQrCode: QrCode | null;
  onQrCodeUpdate: (qr: QrCode) => void;
  products: Product[];
  studioPages: StudioPage[];
  onBackToList: () => void;
}

const QrCustomizationTab: React.FC<QrCustomizationTabProps> = ({
  selectedQrCode,
  onQrCodeUpdate,
  onBackToList,
}) => {
  const [name, setName] = useState<string>(selectedQrCode?.name || 'New QR Code');
  
  // Helper to detect if URL is a redirect URL (should not be stored as destination)
  const isRedirectURL = (url: string): boolean => {
    if (!url) return false;
    try {
      const urlToCheck = url.startsWith('/') ? `http://localhost${url}` : url;
      const urlObj = new URL(urlToCheck);
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      const uuidMatch = pathParts[2]?.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
      return urlObj.pathname.startsWith('/qr/') || 
             Boolean(pathParts.length === 3 && pathParts[2] && uuidMatch);
    } catch {
      return false;
    }
  };
  
  // Extract destination URL - if stored URL is a redirect URL, use default
  const getInitialDestinationUrl = (): string => {
    const storedUrl = selectedQrCode?.url || '';
    if (isRedirectURL(storedUrl)) {
      // This is an old QR code with redirect URL stored - use default
      return 'https://stegofy.com';
    }
    return storedUrl || 'https://stegofy.com';
  };
  
  const [destinationUrl, setDestinationUrl] = useState<string>(getInitialDestinationUrl());
  const [showRedirectUrlWarning, setShowRedirectUrlWarning] = useState<boolean>(
    selectedQrCode?.url ? isRedirectURL(selectedQrCode.url) : false
  );
  const [ctaText, setCtaText] = useState<string>(
    (selectedQrCode?.customization as any)?.textContent || 'Scan Me'
  );
  const [showDesigner, setShowDesigner] = useState<boolean>(false);
  const [currentPreview, setCurrentPreview] = useState<string | null>(
    selectedQrCode?.previewImage || null
  );
  const [isSaving, setIsSaving] = useState(false);
  const [brandName, setBrandName] = useState<string>('');
  const [shortUrl, setShortUrl] = useState<string>('');

  // State for Dynamic vs Static
  const [isDynamic, setIsDynamic] = useState<boolean>(true);

  // Persist a stable ID for new QRs so we can encode the dynamic link before saving
  const [tempId] = useState<string>(generateUUID());

  // Load brand profile and shortened URL on mount
  useEffect(() => {
    const loadBrandProfile = async () => {
      try {
        const profile = await getCurrentBrandProfile();
        if (profile?.brand_name) {
          setBrandName(profile.brand_name);
        }
      } catch (error) {
        console.error('Error loading brand profile:', error);
      }
    };
    loadBrandProfile();
    
    // Note: Cloudflare KV doesn't support querying by QR code ID
    // Shortened URLs are stored by short code only
    // We'll create a new one when needed
  }, [selectedQrCode]);
  
  // Create shortened URL if it doesn't exist for existing QR codes
  useEffect(() => {
    const createMissingShortUrl = async () => {
      if (!selectedQrCode || !isUuid(selectedQrCode.id) || !isDynamic || !brandName) {
        return;
      }
      
      // Check if shortened URL already exists in state
      if (shortUrl) {
        return;
      }
      
      // Create shortened URL if missing
      try {
        const brandSlug = getBrandNameSlug(brandName);
        const qrType = getQRType(destinationUrl);
        const baseUrl = `${window.location.protocol}//${window.location.host}`;
        const finalQRUrl = `${baseUrl}/${brandSlug}/${qrType}/${selectedQrCode.id}`;
        
        // Note: Cloudflare KV doesn't support querying by QR code ID
        // We'll create a new shortened URL each time
        // (Cloudflare KV only supports lookup by short code)
        
        console.log('🔗 QrCustomizationTab: Creating shortened URL for:', finalQRUrl);
        const shortened = await createShortenedURL(finalQRUrl);
        console.log('✅ QrCustomizationTab: Shortened URL created:', shortened.shortUrl);
        setShortUrl(shortened.shortUrl);
      } catch (error) {
        console.error('Error creating shortened URL:', error);
      }
    };
    
    // Only run if we have all required data
    if (brandName && selectedQrCode && isUuid(selectedQrCode.id) && isDynamic && !shortUrl) {
      createMissingShortUrl();
    }
  }, [selectedQrCode?.id, brandName, isDynamic, destinationUrl]); // Removed shortUrl from deps to avoid loop

  // Helper to check UUID validity
  const isUuid = (id?: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id || '');

  // Determine the ID to use:
  // 1. If existing has valid UUID, use it.
  // 2. If existing has legacy ID (qr-...), we MUST generate a new UUID for Dynamic functionality to work (as DB likely requires UUID or logic requires it).
  // 3. If new, use tempId.
  const activeQrId = (selectedQrCode?.id && isUuid(selectedQrCode.id)) ? selectedQrCode.id : tempId;

  // Generate new URL structure: /{brandname}/{type}/{qrId}
  const brandSlug = brandName ? getBrandNameSlug(brandName) : 'brand';
  const qrType = getQRType(destinationUrl);
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  
  // Dynamic Redirect Link - using new format
  // Use the actual QR ID from selectedQrCode if available, otherwise use activeQrId
  const qrIdForUrl = (selectedQrCode?.id && isUuid(selectedQrCode.id)) ? selectedQrCode.id : activeQrId;
  
  // Check if existing QR code URL is in old format and needs migration
  const existingUrl = selectedQrCode?.url || '';
  const isOldFormat = existingUrl.includes('/qr/') && !existingUrl.includes('/page/') && !existingUrl.includes('/external/');
  
  // If it's an old format URL, generate new format; otherwise use existing if it's already in new format
  const dynamicQrLink = isOldFormat || !existingUrl || existingUrl === destinationUrl
    ? `${baseUrl}/${brandSlug}/${qrType}/${qrIdForUrl}`
    : existingUrl; // Use existing URL if it's already in new format

  // Determine which URL to encode in the QR image
  const encodedUrl = isDynamic ? dynamicQrLink : destinationUrl;

  const handleGenerate = async (qrData: {
    qrId: string;
    qrImagePng: string;
    qrImageSvg: string;
    qrImageJpeg: string;
    customization: QRCustomization;
  }) => {
    setIsSaving(true);
    try {
      const existing = selectedQrCode;

      // Generate new URL structure for dynamic QR codes
      const brandSlug = brandName ? getBrandNameSlug(brandName) : 'brand';
      const qrType = getQRType(destinationUrl);
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      
      // IMPORTANT: For dynamic QR codes, we save the DESTINATION URL in the database
      // The redirect URL (/{brandname}/{type}/{qrId}) is what gets encoded in the QR image
      // but the database stores where it should actually redirect to
      const qrUrl = isDynamic 
        ? destinationUrl // Save destination URL, not the redirect URL
        : destinationUrl;

      // Use the activeQrId (which covers both existing and our new reserved UUID)
      const dbQr: DbQRCode = await saveQRCode(activeQrId, {
        name,
        url: qrUrl, // Always save the destination URL
        qrImagePng: qrData.qrImagePng,
        qrImageSvg: qrData.qrImageSvg,
        qrImageJpeg: qrData.qrImageJpeg,
        customization: { ...qrData.customization, isDynamic } as any, // Save dynamic state in customization
        campaignName: undefined,
        folderId: undefined,
        utmSource: undefined,
        utmMedium: undefined,
        utmCampaign: undefined,
      });

      // No need to update URL - we already saved the destination URL correctly

      // Create shortened URL for dynamic QR codes (always create, even if it exists, to ensure it's up to date)
      let shortenedUrl = '';
      if (isDynamic) {
        try {
          const finalQRUrl = `${baseUrl}/${brandSlug}/${qrType}/${dbQr.id}`;
          
          // Create new shortened URL (Cloudflare KV doesn't support checking by QR code ID)
          console.log('🔗 QrCustomizationTab (handleGenerate): Creating shortened URL for:', finalQRUrl);
          const shortened = await createShortenedURL(finalQRUrl);
          shortenedUrl = shortened.shortUrl;
          setShortUrl(shortenedUrl);
          console.log('✅ QrCustomizationTab (handleGenerate): Shortened URL created:', shortenedUrl);
        } catch (shortUrlError: any) {
          console.error('Error creating shortened URL:', shortUrlError);
          // Check if it's a CORS error
          if (shortUrlError.message?.includes('CORS') || shortUrlError.message?.includes('Failed to fetch')) {
            console.warn('CORS error detected. This might be a browser security restriction. The shortened URL will be created on the server side.');
            // Don't fail the whole operation - shortened URL can be created later
          }
          // Don't fail the whole operation if shortened URL creation fails
        }
      }

      const updated: QrCode = {
        id: dbQr.id,
        name: dbQr.name,
        type: existing?.type || 'Custom QR',
        linkedTo: existing?.linkedTo || 'Custom Link',
        linkedId: existing?.linkedId,
        status: 'Linked to Custom Page',
        dateCreated: dbQr.created_at,
        lastUpdated: dbQr.updated_at,
        totalScans: dbQr.total_scans,
        customization: dbQr.customization as unknown as QRCustomization,
        url: destinationUrl, // Store the destination URL, not the redirect URL
        previewImage: dbQr.qr_image_png || dbQr.qr_image_svg || dbQr.qr_image_jpeg || qrData.qrImagePng,
      };

      setCurrentPreview(updated.previewImage);
      onQrCodeUpdate(updated);
      setShowDesigner(false);
      
      if (shortUrl) {
        alert(`QR code saved successfully!\nShort URL: ${shortUrl}`);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to save QR code:', error);
      alert('Failed to save QR code. Please check console for details.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle saving ONLY the URL/Name (without regenerating QR image)
  const handleUpdateUrlOnly = async () => {
    if (!selectedQrCode) return; // Can't update if not saved yet
    setIsSaving(true);
    try {
      // For dynamic QR codes, we still save the destination URL in the database
      // The redirect URL is only used in the QR code image itself
      const dbQr = await updateQRCodeUrl(selectedQrCode.id, destinationUrl, name);

      // Check and create shortened URL if it doesn't exist (for dynamic QR codes)
      if (isDynamic && (!shortUrl || shortUrl === '')) {
        try {
          const brandSlug = brandName ? getBrandNameSlug(brandName) : 'brand';
          const qrType = getQRType(destinationUrl);
          const baseUrl = `${window.location.protocol}//${window.location.host}`;
          const finalQRUrl = `${baseUrl}/${brandSlug}/${qrType}/${selectedQrCode.id}`;
          
          // Create new shortened URL
          try {
            console.log('🔗 QrCustomizationTab (handleUpdateUrlOnly): Creating shortened URL for:', finalQRUrl);
            const shortened = await createShortenedURL(finalQRUrl);
            setShortUrl(shortened.shortUrl);
            console.log('✅ QrCustomizationTab (handleUpdateUrlOnly): Shortened URL created:', shortened.shortUrl);
          } catch (createError) {
            console.error('Error creating shortened URL:', createError);
            // Don't fail the whole operation if shortened URL creation fails
          }
        } catch (shortUrlError) {
          console.error('Error creating shortened URL:', shortUrlError);
          // Don't fail the whole operation if shortened URL creation fails
        }
      }

      const updated: QrCode = {
        ...selectedQrCode,
        name: dbQr.name,
        url: dbQr.url,
        lastUpdated: dbQr.updated_at
      };
      onQrCodeUpdate(updated);
      alert('Destination URL updated successfully! ' + (isDynamic ? 'Existing QR codes will redirect to the new URL.' : 'Note: Since this is a Static QR, existing prints will NOT update.'));
    } catch (error) {
      console.error('Failed to update URL:', error);
      alert('Failed to update URL.');
    } finally {
      setIsSaving(false);
    }
  };

  // Build existing customization with CTA text
  const getExistingCustomization = (): QRCustomization | undefined => {
    if (!selectedQrCode?.customization) return undefined;
    const custom = selectedQrCode.customization as any;
    return {
      ...custom,
      textContent: ctaText,
      textEnabled: true,
    } as QRCustomization;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToList}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to all codes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Section - Compact Form */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                QR Code Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Product QR"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Destination URL
              </label>
              {showRedirectUrlWarning && (
                <div className="mb-2 p-2 bg-amber-50 border border-amber-200 rounded-lg text-[10px] text-amber-800">
                  <strong>⚠️ Warning:</strong> This QR code has a redirect URL stored instead of a destination URL. 
                  Please enter the actual destination URL (e.g., https://stegofy.com) below.
                </div>
              )}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-gray-400">
                  <LinkIcon className="w-3 h-3" />
                </span>
                <input
                  type="url"
                  value={destinationUrl}
                  onChange={(e) => {
                    const newUrl = e.target.value;
                    setDestinationUrl(newUrl);
                    // Hide warning if user enters a valid destination URL
                    if (newUrl && !isRedirectURL(newUrl)) {
                      setShowRedirectUrlWarning(false);
                    }
                  }}
                  className="w-full pl-8 pr-2 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://stegofy.com"
                />
              </div>
              {destinationUrl && isRedirectURL(destinationUrl) && (
                <p className="text-[10px] text-red-600 mt-1">
                  ⚠️ This appears to be a redirect URL. Please enter the actual destination URL (e.g., https://stegofy.com).
                </p>
              )}
            </div>

            {/* Dynamic Toggle */}
            <div className="flex items-center justify-between border border-blue-100 bg-blue-50 p-2 rounded-lg">
              <div>
                <label className="block text-xs font-medium text-blue-900">Dynamic QR</label>
                <p className="text-[10px] text-blue-700">{isDynamic ? 'Editable later' : 'Direct Link (Static)'}</p>
              </div>
              <button
                onClick={() => setIsDynamic(!isDynamic)}
                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isDynamic ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isDynamic ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>


            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                CTA Text
              </label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Scan Me"
              />
            </div>

            {/* Only show 'Save URL Only' if it's a valid Dynamic QR (UUID-based). Legacy QRs need re-saving first. */}
            {selectedQrCode && isUuid(selectedQrCode.id) && (
              <button
                onClick={handleUpdateUrlOnly}
                disabled={isSaving}
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mb-2"
              >
                <LinkIcon className="w-4 h-4 mr-2" />
                Save URL Only
              </button>
            )}

            {selectedQrCode && !isUuid(selectedQrCode.id) && (
              <div className="text-[10px] text-amber-600 bg-amber-50 p-2 rounded mb-2 border border-amber-200">
                Legacy QR detected. Please click "Re-Create Design" below to upgrade this to a Dynamic QR (requires re-printing).
              </div>
            )}

            <button
              onClick={() => setShowDesigner(true)}
              disabled={isSaving}
              className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Palette className="w-4 h-4 mr-2" />
              {currentPreview ? (selectedQrCode && !isUuid(selectedQrCode.id) ? 'Re-Create Design' : 'Edit Design') : 'Create Design'}
            </button>
          </div>
        </div>

        {/* Right Section - Large QR Preview */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
              {currentPreview ? (
                <>
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{name}</h3>
                    {isDynamic ? (
                      <div className="mt-2 space-y-2">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">QR Code URL:</p>
                          <p className="text-sm text-gray-900 font-mono break-all bg-gray-50 p-2 rounded">{dynamicQrLink}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Redirects to:</p>
                          <p className="text-sm text-gray-600 break-all">{destinationUrl}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Shortened URL (stego.fyi):</p>
                          {shortUrl ? (
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-blue-600 font-mono break-all bg-blue-50 p-2 rounded flex-1">{shortUrl}</p>
                              <button
                                onClick={async () => {
                                  try {
                                    await navigator.clipboard.writeText(shortUrl);
                                    alert('Shortened URL copied to clipboard!');
                                  } catch (error) {
                                    console.error('Failed to copy:', error);
                                  }
                                }}
                                className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                              >
                                Copy
                              </button>
                            </div>
                          ) : (
                            <p className="text-xs text-gray-400 italic">Generating shortened URL...</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-gray-600 break-all">{destinationUrl}</p>
                        <p className="text-xs text-gray-400 mt-1">(Static Direct Link)</p>
                      </>
                    )}
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-gray-200">
                    <img
                      src={currentPreview}
                      alt="QR Code Preview"
                      className="w-64 h-64 object-contain"
                    />
                    {ctaText && (
                      <p className="text-center mt-4 text-sm font-medium text-gray-900">
                        {ctaText}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setShowDesigner(true)}
                    className="inline-flex items-center px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Palette className="w-4 h-4 mr-2" />
                    Edit Design
                  </button>
                </>
              ) : (
                <div className="text-center space-y-4">
                  <QrCodeIcon className="w-24 h-24 text-gray-300 mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Create {isDynamic ? 'Dynamic' : 'Static'} QR Code
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {isDynamic
                        ? 'Dynamic QRs allow you to change the destination URL later without re-printing.'
                        : 'Static QRs link directly to your URL but cannot be changed later.'}
                    </p>
                    <button
                      onClick={() => setShowDesigner(true)}
                      disabled={isSaving}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <Palette className="w-4 h-4 mr-2" />
                      Create {isDynamic ? 'Dynamic' : 'Static'} Design
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Designer Modal */}
      {showDesigner && (
        <QRGenerator
          url={encodedUrl}
          qrId={activeQrId}
          existingCustomization={getExistingCustomization()}
          initialTextContent={ctaText}
          onGenerate={handleGenerate}
          onClose={() => setShowDesigner(false)}
        />
      )}
    </div>
  );
};

export default QrCustomizationTab;
