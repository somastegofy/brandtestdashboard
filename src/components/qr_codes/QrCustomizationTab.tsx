import React, { useState } from 'react';
import { ArrowLeft, Link as LinkIcon, Palette, QrCode as QrCodeIcon } from 'lucide-react';
import type { QrCode } from '../../types/qrCodeTypes';
import type { Product } from '../../types/productTypes';
import type { StudioPage } from '../../types/qrCodeTypes';
import QRGenerator, { QRCustomization } from '../studio/QRGenerator';
import { saveQRCode, updateQRCodeUrl, QRCode as DbQRCode } from '../../api/qrCodes';

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
  const [destinationUrl, setDestinationUrl] = useState<string>(
    selectedQrCode?.url || 'https://stegofy.com'
  );
  const [ctaText, setCtaText] = useState<string>(
    (selectedQrCode?.customization as any)?.textContent || 'Scan Me'
  );
  const [showDesigner, setShowDesigner] = useState<boolean>(false);
  const [currentPreview, setCurrentPreview] = useState<string | null>(
    selectedQrCode?.previewImage || null
  );
  const [isSaving, setIsSaving] = useState(false);

  // State for Dynamic vs Static
  const [isDynamic, setIsDynamic] = useState<boolean>(true);

  // Persist a stable ID for new QRs so we can encode the dynamic link before saving
  const [tempId] = useState<string>(generateUUID());

  // Helper to check UUID validity
  const isUuid = (id?: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id || '');

  // Determine the ID to use:
  // 1. If existing has valid UUID, use it.
  // 2. If existing has legacy ID (qr-...), we MUST generate a new UUID for Dynamic functionality to work (as DB likely requires UUID or logic requires it).
  // 3. If new, use tempId.
  const activeQrId = (selectedQrCode?.id && isUuid(selectedQrCode.id)) ? selectedQrCode.id : tempId;

  // Dynamic Redirect Link
  const dynamicQrLink = `${window.location.protocol}//${window.location.host}/qr/${activeQrId}`;

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

      // Use the activeQrId (which covers both existing and our new reserved UUID)
      const dbQr: DbQRCode = await saveQRCode(activeQrId, {
        name,
        url: destinationUrl, // Always save the Target URL
        qrImagePng: qrData.qrImagePng,
        qrImageSvg: qrData.qrImageSvg,
        qrImageJpeg: qrData.qrImageJpeg,
        customization: { ...qrData.customization, isDynamic } as any, // Save dynamic state in customization
        campaignName: null,
        folderId: null,
        utmSource: undefined,
        utmMedium: undefined,
        utmCampaign: undefined,
      });

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
        url: dbQr.url,
        previewImage: dbQr.qr_image_png || dbQr.qr_image_svg || dbQr.qr_image_jpeg || qrData.qrImagePng,
      };

      setCurrentPreview(updated.previewImage);
      onQrCodeUpdate(updated);
      setShowDesigner(false);
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
      const dbQr = await updateQRCodeUrl(selectedQrCode.id, destinationUrl, name);

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
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-gray-400">
                  <LinkIcon className="w-3 h-3" />
                </span>
                <input
                  type="url"
                  value={destinationUrl}
                  onChange={(e) => setDestinationUrl(e.target.value)}
                  className="w-full pl-8 pr-2 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://..."
                />
              </div>
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
                    <p className="text-sm text-gray-600 break-all">{destinationUrl}</p>
                    {isDynamic ? (
                      <p className="text-xs text-gray-400 mt-1">(Redirects via: {dynamicQrLink})</p>
                    ) : (
                      <p className="text-xs text-gray-400 mt-1">(Static Direct Link)</p>
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
