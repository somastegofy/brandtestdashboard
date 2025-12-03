import React, { useState } from 'react';
import { ArrowLeft, Link as LinkIcon, Palette, QrCode as QrCodeIcon } from 'lucide-react';
import type { QrCode } from '../../types/qrCodeTypes';
import type { Product } from '../../types/productTypes';
import type { StudioPage } from '../../types/qrCodeTypes';
import QRGenerator, { QRCustomization } from '../studio/QRGenerator';
import { saveQRCode, QRCode as DbQRCode } from '../../api/qrCodes';

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

      // Use existing UUID if it looks like a Supabase id, otherwise treat as new
      const existingId = existing?.id && existing.id.includes('-') ? existing.id : null;

      const dbQr: DbQRCode = await saveQRCode(existingId, {
        name,
        url: destinationUrl,
        qrImagePng: qrData.qrImagePng,
        qrImageSvg: qrData.qrImageSvg,
        qrImageJpeg: qrData.qrImageJpeg,
        customization: qrData.customization,
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

            <button
              onClick={() => setShowDesigner(true)}
              disabled={isSaving}
              className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Palette className="w-4 h-4 mr-2" />
              {currentPreview ? 'Edit Design' : 'Open Designer'}
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
                    <p className="text-sm text-gray-600">{destinationUrl}</p>
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
                      No QR Code Generated Yet
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Fill in the details on the left and click "Open Designer" to create your QR code.
                    </p>
                    <button
                      onClick={() => setShowDesigner(true)}
                      disabled={isSaving}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <Palette className="w-4 h-4 mr-2" />
                      Open Designer
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
          url={destinationUrl}
          qrId={selectedQrCode?.id}
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
