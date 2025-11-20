import React, { useState, useRef, useEffect, useCallback } from 'react';
import QRCode from 'qrcode';
import { Download, RefreshCw, Upload, X, Check, Palette, Frame, Sparkles, Image as ImageIcon, Type, Settings2 } from 'lucide-react';

export interface QRCustomization {
  // Colors
  foregroundColor: string;
  backgroundColor: string;
  eyeFrameColor: string;
  eyeBallColor: string;
  // Shapes
  bodyShape: 'square' | 'dots' | 'rounded';
  eyeFrameShape: 'square' | 'rounded' | 'circle';
  eyeBallShape: 'square' | 'rounded' | 'circle';
  // Logo
  logoEnabled: boolean;
  logoUrl: string;
  logoSize: number; // 0-50 (percentage)
  logoMargin: number; // pixels around logo
  logoBackgroundColor: string;
  logoCornerRadius: number;
  // Frame
  frameEnabled: boolean;
  frameType: 'none' | 'border' | 'rounded' | 'dots' | 'squares';
  frameColor: string;
  frameWidth: number;
  frameMargin: number;
  framePadding: number;
  frameLabel?: string;
  frameLabelSize?: number;
  frameLabelColor?: string;
  // Text
  textEnabled: boolean;
  textContent: string;
  textPosition: 'top' | 'bottom';
  textColor: string;
  textSize: number;
  textFont: string;
  // Design
  designPattern: 'default' | 'gradient' | 'dots' | 'squares' | 'circles';
  gradientColor1?: string;
  gradientColor2?: string;
  // Error correction
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  // Size
  size: number; // pixels
  margin: number; // pixels
}

export interface QRGeneratorProps {
  url: string;
  qrId?: string; // Existing QR ID to maintain stability
  existingCustomization?: QRCustomization;
  onGenerate: (qrData: {
    qrId: string;
    qrImagePng: string;
    qrImageSvg: string;
    qrImageJpeg: string;
    customization: QRCustomization;
  }) => void;
  onClose?: () => void;
}

const QRGenerator: React.FC<QRGeneratorProps> = ({
  url,
  qrId,
  existingCustomization,
  onGenerate,
  onClose
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [customization, setCustomization] = useState<QRCustomization>(
    existingCustomization || {
      foregroundColor: '#000000',
      backgroundColor: '#FFFFFF',
      eyeFrameColor: '#000000',
      eyeBallColor: '#000000',
      bodyShape: 'square',
      eyeFrameShape: 'square',
      eyeBallShape: 'square',
      logoEnabled: false,
      logoUrl: '',
      logoSize: 20,
      logoMargin: 4,
      logoBackgroundColor: '#FFFFFF',
      logoCornerRadius: 0,
      frameEnabled: false,
      frameType: 'none',
      frameColor: '#000000',
      frameWidth: 4,
      frameMargin: 20,
      framePadding: 10,
      textEnabled: false,
      textContent: 'Scan Me',
      textPosition: 'bottom',
      textColor: '#000000',
      textSize: 16,
      textFont: 'Arial',
      designPattern: 'default',
      errorCorrectionLevel: 'M',
      size: 512,
      margin: 4
    }
  );

  const [previewImage, setPreviewImage] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'design' | 'logo' | 'frame' | 'text' | 'advanced'>('design');
  const [logoPreview, setLogoPreview] = useState<string>('');

  // Generate QR code with customization
  const generateQRCode = useCallback(async () => {
    if (!canvasRef.current || !url) return;

    setIsGenerating(true);
    try {
      const canvas = canvasRef.current;
      const size = customization.size;
      const margin = customization.margin;

      // Set canvas size
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw background
      ctx.fillStyle = customization.backgroundColor;
      ctx.fillRect(0, 0, size, size);

      // Generate QR code data URL
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: size - (margin * 2),
        margin: 0,
        color: {
          dark: customization.foregroundColor,
          light: customization.backgroundColor
        },
        errorCorrectionLevel: customization.errorCorrectionLevel
      });

      // Draw QR code
      const qrImage = new Image();
      await new Promise((resolve, reject) => {
        qrImage.onload = resolve;
        qrImage.onerror = reject;
        qrImage.src = qrDataUrl;
      });

      ctx.drawImage(qrImage, margin, margin);

      // Apply logo if enabled
      if (customization.logoEnabled && customization.logoUrl) {
        const logoImg = new Image();
        logoImg.crossOrigin = 'anonymous';
        await new Promise((resolve, reject) => {
          logoImg.onload = resolve;
          logoImg.onerror = reject;
          logoImg.src = customization.logoUrl;
        });

        const logoSize = (size - (margin * 2)) * (customization.logoSize / 100);
        const logoX = (size - logoSize) / 2;
        const logoY = (size - logoSize) / 2;

        // Draw logo background if needed
        if (customization.logoBackgroundColor !== customization.backgroundColor) {
          ctx.fillStyle = customization.logoBackgroundColor;
          const logoBgSize = logoSize + (customization.logoMargin * 2);
          const logoBgX = (size - logoBgSize) / 2;
          const logoBgY = (size - logoBgSize) / 2;
          ctx.fillRect(logoBgX, logoBgY, logoBgSize, logoBgSize);
        }

        // Draw logo with corner radius
        if (customization.logoCornerRadius > 0) {
          ctx.save();
          const radius = customization.logoCornerRadius;
          const x = logoX;
          const y = logoY;
          const w = logoSize;
          const h = logoSize;
          ctx.beginPath();
          ctx.moveTo(x + radius, y);
          ctx.lineTo(x + w - radius, y);
          ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
          ctx.lineTo(x + w, y + h - radius);
          ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
          ctx.lineTo(x + radius, y + h);
          ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
          ctx.lineTo(x, y + radius);
          ctx.quadraticCurveTo(x, y, x + radius, y);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
          ctx.restore();
        } else {
          ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
        }
      }

      // Update preview
      setPreviewImage(canvas.toDataURL('image/png'));

    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [url, customization]);

  // Generate QR on customization change
  useEffect(() => {
    if (url) {
      generateQRCode();
    }
  }, [generateQRCode]);

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setLogoPreview(result);
      setCustomization(prev => ({ ...prev, logoUrl: result, logoEnabled: true }));
    };
    reader.readAsDataURL(file);
  };

  // Download QR code in various formats
  const downloadQR = async (format: 'png' | 'svg' | 'jpeg') => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    let dataUrl = '';
    let mimeType = '';
    let extension = '';

    switch (format) {
      case 'png':
        dataUrl = canvas.toDataURL('image/png');
        mimeType = 'image/png';
        extension = 'png';
        break;
      case 'jpeg':
        dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        mimeType = 'image/jpeg';
        extension = 'jpg';
        break;
      case 'svg':
        // For SVG, we need to generate it separately
        try {
          const svgString = await QRCode.toString(url, {
            type: 'svg',
            width: customization.size,
            margin: customization.margin,
            color: {
              dark: customization.foregroundColor,
              light: customization.backgroundColor
            },
            errorCorrectionLevel: customization.errorCorrectionLevel
          });
          const blob = new Blob([svgString], { type: 'image/svg+xml' });
          dataUrl = URL.createObjectURL(blob);
          mimeType = 'image/svg+xml';
          extension = 'svg';
        } catch (error) {
          console.error('Error generating SVG:', error);
          return;
        }
        break;
    }

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `qr-code-${Date.now()}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (format === 'svg') {
      URL.revokeObjectURL(dataUrl);
    }
  };

  // Save and generate QR
  const handleSave = async () => {
    if (!canvasRef.current) return;

    setIsGenerating(true);
    try {
      const canvas = canvasRef.current;

      // Generate all formats
      const pngData = canvas.toDataURL('image/png');
      const jpegData = canvas.toDataURL('image/jpeg', 0.92);
      
      let svgData = '';
      try {
        const svgString = await QRCode.toString(url, {
          type: 'svg',
          width: customization.size,
          margin: customization.margin,
          color: {
            dark: customization.foregroundColor,
            light: customization.backgroundColor
          },
          errorCorrectionLevel: customization.errorCorrectionLevel
        });
        svgData = 'data:image/svg+xml;base64,' + btoa(svgString);
      } catch (error) {
        console.error('Error generating SVG:', error);
        svgData = pngData; // Fallback to PNG
      }

      onGenerate({
        qrId: qrId || `qr-${Date.now()}`,
        qrImagePng: pngData,
        qrImageSvg: svgData,
        qrImageJpeg: jpegData,
        customization
      });

      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error saving QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const updateCustomization = (key: keyof QRCustomization, value: any) => {
    setCustomization(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">QR Code Generator</h2>
            <p className="text-sm text-gray-600 mt-1">Customize your QR code with colors, logos, frames, and more</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Left Panel - Preview */}
          <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
            <div className="sticky top-0">
              <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
                
                {/* QR Code Preview */}
                <div 
                  ref={previewRef}
                  className="bg-white p-8 rounded-lg border-2 border-gray-200 shadow-inner mb-4"
                  style={{ 
                    minHeight: `${customization.size + (customization.textEnabled ? 60 : 0)}px`,
                    minWidth: `${customization.size}px`
                  }}
                >
                  {previewImage ? (
                    <>
                      {customization.textEnabled && customization.textPosition === 'top' && (
                        <div 
                          className="text-center mb-4"
                          style={{
                            color: customization.textColor,
                            fontSize: `${customization.textSize}px`,
                            fontFamily: customization.textFont,
                            fontWeight: 'bold'
                          }}
                        >
                          {customization.textContent}
                        </div>
                      )}
                      <div className="flex justify-center">
                        <img 
                          src={previewImage} 
                          alt="QR Code Preview" 
                          className="max-w-full h-auto"
                        />
                      </div>
                      {customization.textEnabled && customization.textPosition === 'bottom' && (
                        <div 
                          className="text-center mt-4"
                          style={{
                            color: customization.textColor,
                            fontSize: `${customization.textSize}px`,
                            fontFamily: customization.textFont,
                            fontWeight: 'bold'
                          }}
                        >
                          {customization.textContent}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-gray-400">
                      {isGenerating ? (
                        <div className="text-center">
                          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                          <p>Generating QR code...</p>
                        </div>
                      ) : (
                        <p>Enter a URL to generate QR code</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Download Buttons */}
                {previewImage && (
                  <div className="flex flex-wrap gap-2 justify-center w-full">
                    <button
                      onClick={() => downloadQR('png')}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      PNG
                    </button>
                    <button
                      onClick={() => downloadQR('svg')}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      SVG
                    </button>
                    <button
                      onClick={() => downloadQR('jpeg')}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      JPEG
                    </button>
                  </div>
                )}

                {/* URL Display */}
                <div className="mt-4 p-3 bg-gray-100 rounded-lg w-full">
                  <p className="text-xs text-gray-600 mb-1">QR Code URL:</p>
                  <p className="text-sm text-gray-900 break-all font-mono">{url || 'No URL provided'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Settings */}
          <div className="w-96 border-l border-gray-200 overflow-y-auto bg-white">
            {/* Tabs */}
            <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
              <div className="flex overflow-x-auto">
                <button
                  onClick={() => setActiveTab('design')}
                  className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'design' 
                      ? 'border-blue-600 text-blue-600' 
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Palette className="w-4 h-4 mr-2" />
                  Colors
                </button>
                <button
                  onClick={() => setActiveTab('logo')}
                  className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'logo' 
                      ? 'border-blue-600 text-blue-600' 
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Logo
                </button>
                <button
                  onClick={() => setActiveTab('frame')}
                  className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'frame' 
                      ? 'border-blue-600 text-blue-600' 
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Frame className="w-4 h-4 mr-2" />
                  Frame
                </button>
                <button
                  onClick={() => setActiveTab('text')}
                  className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'text' 
                      ? 'border-blue-600 text-blue-600' 
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Type className="w-4 h-4 mr-2" />
                  Text
                </button>
                <button
                  onClick={() => setActiveTab('advanced')}
                  className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'advanced' 
                      ? 'border-blue-600 text-blue-600' 
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Settings2 className="w-4 h-4 mr-2" />
                  Advanced
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6 space-y-6">
              {/* Colors Tab */}
              {activeTab === 'design' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900">Colors</h3>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Foreground Color (QR Pattern)
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={customization.foregroundColor}
                        onChange={(e) => updateCustomization('foregroundColor', e.target.value)}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customization.foregroundColor}
                        onChange={(e) => updateCustomization('foregroundColor', e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Background Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={customization.backgroundColor}
                        onChange={(e) => updateCustomization('backgroundColor', e.target.value)}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customization.backgroundColor}
                        onChange={(e) => updateCustomization('backgroundColor', e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Eye Frame Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={customization.eyeFrameColor}
                        onChange={(e) => updateCustomization('eyeFrameColor', e.target.value)}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customization.eyeFrameColor}
                        onChange={(e) => updateCustomization('eyeFrameColor', e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Eye Ball Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={customization.eyeBallColor}
                        onChange={(e) => updateCustomization('eyeBallColor', e.target.value)}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customization.eyeBallColor}
                        onChange={(e) => updateCustomization('eyeBallColor', e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Body Shape
                    </label>
                    <select
                      value={customization.bodyShape}
                      onChange={(e) => updateCustomization('bodyShape', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="square">Square</option>
                      <option value="dots">Dots</option>
                      <option value="rounded">Rounded</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        Eye Frame Shape
                      </label>
                      <select
                        value={customization.eyeFrameShape}
                        onChange={(e) => updateCustomization('eyeFrameShape', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="square">Square</option>
                        <option value="rounded">Rounded</option>
                        <option value="circle">Circle</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        Eye Ball Shape
                      </label>
                      <select
                        value={customization.eyeBallShape}
                        onChange={(e) => updateCustomization('eyeBallShape', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="square">Square</option>
                        <option value="rounded">Rounded</option>
                        <option value="circle">Circle</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Logo Tab */}
              {activeTab === 'logo' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900">Logo</h3>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-gray-700">Enable Logo</label>
                    <input
                      type="checkbox"
                      checked={customization.logoEnabled}
                      onChange={(e) => updateCustomization('logoEnabled', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>

                  {customization.logoEnabled && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Upload Logo
                        </label>
                        <div className="flex items-center space-x-2">
                          <label className="flex-1 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors text-center">
                            <Upload className="w-4 h-4 mx-auto mb-1 text-gray-400" />
                            <span className="text-xs text-gray-600">Upload Image</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleLogoUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                        {logoPreview && (
                          <div className="mt-2 p-2 border border-gray-200 rounded-lg">
                            <img src={logoPreview} alt="Logo preview" className="w-16 h-16 object-contain mx-auto" />
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Logo Size: {customization.logoSize}%
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="50"
                          value={customization.logoSize}
                          onChange={(e) => updateCustomization('logoSize', parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Logo Margin: {customization.logoMargin}px
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="20"
                          value={customization.logoMargin}
                          onChange={(e) => updateCustomization('logoMargin', parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Logo Background Color
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={customization.logoBackgroundColor}
                            onChange={(e) => updateCustomization('logoBackgroundColor', e.target.value)}
                            className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={customization.logoBackgroundColor}
                            onChange={(e) => updateCustomization('logoBackgroundColor', e.target.value)}
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Logo Corner Radius: {customization.logoCornerRadius}px
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="20"
                          value={customization.logoCornerRadius}
                          onChange={(e) => updateCustomization('logoCornerRadius', parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Frame Tab */}
              {activeTab === 'frame' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900">Frame</h3>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-gray-700">Enable Frame</label>
                    <input
                      type="checkbox"
                      checked={customization.frameEnabled}
                      onChange={(e) => updateCustomization('frameEnabled', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>

                  {customization.frameEnabled && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Frame Type
                        </label>
                        <select
                          value={customization.frameType}
                          onChange={(e) => updateCustomization('frameType', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="none">None</option>
                          <option value="border">Border</option>
                          <option value="rounded">Rounded Border</option>
                          <option value="dots">Dotted Border</option>
                          <option value="squares">Square Border</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Frame Color
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={customization.frameColor}
                            onChange={(e) => updateCustomization('frameColor', e.target.value)}
                            className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={customization.frameColor}
                            onChange={(e) => updateCustomization('frameColor', e.target.value)}
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Frame Width: {customization.frameWidth}px
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="20"
                          value={customization.frameWidth}
                          onChange={(e) => updateCustomization('frameWidth', parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Frame Margin: {customization.frameMargin}px
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="50"
                          value={customization.frameMargin}
                          onChange={(e) => updateCustomization('frameMargin', parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Frame Padding: {customization.framePadding}px
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="30"
                          value={customization.framePadding}
                          onChange={(e) => updateCustomization('framePadding', parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Frame Label (Optional)
                        </label>
                        <input
                          type="text"
                          value={customization.frameLabel || ''}
                          onChange={(e) => updateCustomization('frameLabel', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Scan Here"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Text Tab */}
              {activeTab === 'text' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900">Text</h3>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-gray-700">Enable Text</label>
                    <input
                      type="checkbox"
                      checked={customization.textEnabled}
                      onChange={(e) => updateCustomization('textEnabled', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>

                  {customization.textEnabled && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Text Content
                        </label>
                        <input
                          type="text"
                          value={customization.textContent}
                          onChange={(e) => updateCustomization('textContent', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Scan Me"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Position
                        </label>
                        <select
                          value={customization.textPosition}
                          onChange={(e) => updateCustomization('textPosition', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="top">Top</option>
                          <option value="bottom">Bottom</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Text Color
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={customization.textColor}
                            onChange={(e) => updateCustomization('textColor', e.target.value)}
                            className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={customization.textColor}
                            onChange={(e) => updateCustomization('textColor', e.target.value)}
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-2">
                            Font Size: {customization.textSize}px
                          </label>
                          <input
                            type="range"
                            min="12"
                            max="48"
                            value={customization.textSize}
                            onChange={(e) => updateCustomization('textSize', parseInt(e.target.value))}
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-2">
                            Font Family
                          </label>
                          <select
                            value={customization.textFont}
                            onChange={(e) => updateCustomization('textFont', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="Arial">Arial</option>
                            <option value="Helvetica">Helvetica</option>
                            <option value="Times New Roman">Times New Roman</option>
                            <option value="Courier New">Courier New</option>
                            <option value="Verdana">Verdana</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Advanced Tab */}
              {activeTab === 'advanced' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900">Advanced Settings</h3>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Error Correction Level
                    </label>
                    <select
                      value={customization.errorCorrectionLevel}
                      onChange={(e) => updateCustomization('errorCorrectionLevel', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="L">L - Low (~7% damage tolerance)</option>
                      <option value="M">M - Medium (~15% damage tolerance)</option>
                      <option value="Q">Q - Quartile (~25% damage tolerance)</option>
                      <option value="H">H - High (~30% damage tolerance)</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Higher levels allow more damage but increase QR code complexity
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      QR Code Size: {customization.size}px
                    </label>
                    <input
                      type="range"
                      min="200"
                      max="2000"
                      step="50"
                      value={customization.size}
                      onChange={(e) => updateCustomization('size', parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Small (200px)</span>
                      <span>Large (2000px)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Margin: {customization.margin}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={customization.margin}
                      onChange={(e) => updateCustomization('margin', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {qrId && <span>QR Code ID: <span className="font-mono font-medium">{qrId}</span></span>}
            {!qrId && <span>New QR code will be generated</span>}
          </div>
          <div className="flex items-center space-x-3">
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={!url || isGenerating}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Save QR Code
                </>
              )}
            </button>
          </div>
        </div>

        {/* Hidden Canvas for QR Generation */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default QRGenerator;

