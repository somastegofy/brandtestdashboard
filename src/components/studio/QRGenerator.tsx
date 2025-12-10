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
  bodyShape: 'square' | 'dots' | 'rounded' | 'heart';
  eyeFrameShape: 'square' | 'rounded' | 'circle';
  eyeBallShape: 'square' | 'rounded' | 'circle';
  // Logo
  logoEnabled: boolean;
  logoUrl: string;
  logoSize: number; // 0-50 (percentage)
  logoMargin: number; // pixels around logo
  logoBackgroundColor: string;
  logoBackgroundShape?: 'none' | 'square' | 'rounded' | 'circle';
  logoClearArea?: boolean;
  logoTintEnabled?: boolean;
  logoTintColor?: string;
  logoTintOpacity?: number;
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

// Size presets in cm for industry standards (assuming 300 DPI for print quality)
// 1 inch = 2.54 cm
// 300 DPI = ~118 pixels/cm
const SIZE_PRESETS = [
  { label: 'Default (512px)', value: 0 }, // 0 uses customization.size
  { label: '1 cm x 1 cm', value: 118 },
  { label: '1.5 cm x 1.5 cm', value: 177 },
  { label: '2 cm x 2 cm', value: 236 },
  { label: '2.5 cm x 2.5 cm', value: 295 },
  { label: '3 cm x 3 cm', value: 354 },
  { label: '4 cm x 4 cm', value: 472 },
  { label: '5 cm x 5 cm', value: 591 },
];

export interface QRGeneratorProps {
  url: string;
  qrId?: string; // Existing QR ID to maintain stability
  existingCustomization?: QRCustomization;
  /** When true, renders inline instead of fullscreen modal. */
  embed?: boolean;
  /** Optional initial CTA text under the QR when no existing customization. */
  initialTextContent?: string;
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
  embed = false,
  initialTextContent,
  onGenerate,
  onClose
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [downloadSize, setDownloadSize] = useState<number>(0); // 0 = default (customization.size)

  const [customization, setCustomization] = useState<QRCustomization>(
    existingCustomization || {
      // Colors
      foregroundColor: '#000000',
      backgroundColor: '#FFFFFF',
      eyeFrameColor: '#000000',
      eyeBallColor: '#000000',
      // Shapes
      bodyShape: 'square',
      eyeFrameShape: 'square',
      eyeBallShape: 'square',
      // Logo
      logoEnabled: true,
      logoUrl: '',
      logoSize: 20,
      logoMargin: 4,
      logoBackgroundColor: '#FFFFFF',
      logoBackgroundShape: 'circle',
      logoClearArea: true,
      logoTintEnabled: false,
      logoTintColor: '#000000',
      logoTintOpacity: 1,
      logoCornerRadius: 0,
      // Frame
      frameEnabled: true,
      frameType: 'rounded',
      frameColor: '#000000',
      frameWidth: 4,
      frameMargin: 20,
      framePadding: 10,
      // Text
      textEnabled: true,
      textContent: initialTextContent || 'Scan Me',
      textPosition: 'bottom',
      textColor: '#000000',
      textSize: 16,
      textFont: 'Arial',
      // Design
      designPattern: 'default',
      gradientColor1: undefined,
      gradientColor2: undefined,
      // Error correction & size
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



      // Apply logo area and optional logo
      if (customization.logoEnabled) {
        const logoSize = (size - (margin * 2)) * (customization.logoSize / 100);
        const logoX = (size - logoSize) / 2;
        const logoY = (size - logoSize) / 2;
        let logoSource: CanvasImageSource | null = null;
        if (customization.logoUrl) {
          const logoImg = new Image();
          logoImg.crossOrigin = 'anonymous';
          await new Promise((resolve, reject) => {
            logoImg.onload = resolve;
            logoImg.onerror = reject;
            logoImg.src = customization.logoUrl as string;
          });
          logoSource = logoImg;
        }

        // Clear area behind logo if requested, then paint background color
        const logoBgSize = logoSize + (customization.logoMargin * 2);
        const logoBgX = (size - logoBgSize) / 2;
        const logoBgY = (size - logoBgSize) / 2;
        const centerX = size / 2;
        const centerY = size / 2;
        const circleRadius = (logoSize / 2) + customization.logoMargin;

        const drawRoundedRect = (x: number, y: number, w: number, h: number, radius: number) => {
          const r = Math.max(0, Math.min(radius, Math.min(w, h) / 2));
          ctx.beginPath();
          ctx.moveTo(x + r, y);
          ctx.lineTo(x + w - r, y);
          ctx.quadraticCurveTo(x + w, y, x + w, y + r);
          ctx.lineTo(x + w, y + h - r);
          ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
          ctx.lineTo(x + r, y + h);
          ctx.quadraticCurveTo(x, y + h, x, y + h - r);
          ctx.lineTo(x, y + r);
          ctx.quadraticCurveTo(x, y, x + r, y);
          ctx.closePath();
        };

        const drawCircle = (cx: number, cy: number, r: number) => {
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.closePath();
        };

        const shape = customization.logoBackgroundShape || 'circle';

        if (customization.logoClearArea) {
          ctx.save();
          ctx.globalCompositeOperation = 'destination-out';
          if (shape === 'rounded') {
            drawRoundedRect(logoBgX, logoBgY, logoBgSize, logoBgSize, customization.logoCornerRadius);
          } else if (shape === 'square') {
            ctx.beginPath();
            ctx.rect(logoBgX, logoBgY, logoBgSize, logoBgSize);
            ctx.closePath();
          } else {
            drawCircle(centerX, centerY, circleRadius);
          }
          ctx.fill();
          ctx.restore();
        }

        if (shape !== 'none') {
          ctx.save();
          ctx.fillStyle = customization.logoBackgroundColor;
          if (shape === 'rounded') {
            drawRoundedRect(logoBgX, logoBgY, logoBgSize, logoBgSize, customization.logoCornerRadius);
            ctx.fill();
          } else if (shape === 'square') {
            ctx.fillRect(logoBgX, logoBgY, logoBgSize, logoBgSize);
          } else {
            drawCircle(centerX, centerY, circleRadius);
            ctx.fill();
          }
          ctx.restore();
        }

        if (logoSource && customization.logoTintEnabled) {
          const off = document.createElement('canvas');
          off.width = Math.max(1, Math.floor(logoSize));
          off.height = Math.max(1, Math.floor(logoSize));
          const octx = off.getContext('2d');
          if (octx) {
            octx.drawImage(logoSource as CanvasImageSource, 0, 0, off.width, off.height);
            octx.globalCompositeOperation = 'source-in';
            octx.globalAlpha = customization.logoTintOpacity ?? 1;
            octx.fillStyle = customization.logoTintColor || '#000000';
            octx.fillRect(0, 0, off.width, off.height);
            octx.globalCompositeOperation = 'source-over';
            octx.globalAlpha = 1;
          }
          logoSource = off;
        }

        if (logoSource && customization.logoCornerRadius > 0) {
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
          ctx.drawImage(logoSource as CanvasImageSource, logoX, logoY, logoSize, logoSize);
          ctx.restore();
        } else if (logoSource) {
          ctx.drawImage(logoSource as CanvasImageSource, logoX, logoY, logoSize, logoSize);
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

  // Helper: Normalize logo to PNG Data URI
  const getNormalizedLogoUrl = async (url: string, tint?: { enabled: boolean; color: string; opacity: number }): Promise<string> => {
    if (!url) return '';

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const size = Math.max(img.width, img.height);
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(url); // Fallback to original
            return;
          }

          // Draw image centered
          const x = (size - img.width) / 2;
          const y = (size - img.height) / 2;
          ctx.drawImage(img, x, y);

          // Apply tint if enabled
          if (tint?.enabled) {
            ctx.globalCompositeOperation = 'source-in';
            ctx.globalAlpha = tint.opacity;
            ctx.fillStyle = tint.color;
            ctx.fillRect(0, 0, size, size);
          }

          resolve(canvas.toDataURL('image/png'));
        } catch (e) {
          console.error('Error normalizing logo:', e);
          resolve(url); // Fallback
        }
      };
      img.onerror = () => {
        console.error('Error loading logo for normalization');
        resolve(url); // Fallback
      };
      img.src = url;
    });
  };

  // Download QR code in various formats with selected size
  const downloadQR = async (format: 'png' | 'svg' | 'jpeg', sizeOverride?: number) => {
    // Determine effective size (override > state > customization default)
    const effectiveSize = sizeOverride || (downloadSize > 0 ? downloadSize : customization.size);

    // We need a temporary canvas if the size is different from the preview canvas
    let targetCanvas = canvasRef.current;
    let tempCanvas: HTMLCanvasElement | null = null;

    if (effectiveSize !== customization.size && format !== 'svg') {
      // Create temp canvas for resizing
      tempCanvas = document.createElement('canvas');
      tempCanvas.width = effectiveSize;
      tempCanvas.height = effectiveSize;
      const ctx = tempCanvas.getContext('2d');
      if (ctx && canvasRef.current) {
        // High quality scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(canvasRef.current, 0, 0, effectiveSize, effectiveSize);
        targetCanvas = tempCanvas;
      }
    }

    if (!targetCanvas && format !== 'svg') return;

    let dataUrl = '';
    let mimeType = '';
    let extension = '';

    switch (format) {
      case 'png':
        dataUrl = targetCanvas!.toDataURL('image/png');
        mimeType = 'image/png';
        extension = 'png';
        break;
      case 'jpeg':
        dataUrl = targetCanvas!.toDataURL('image/jpeg', 0.92);
        mimeType = 'image/jpeg';
        extension = 'jpg';
        break;
      case 'svg':
        try {
          // Generate SVG with the specific effective size
          const baseSvg = await QRCode.toString(url, {
            type: 'svg',
            width: effectiveSize,
            margin: customization.margin,
            color: {
              dark: customization.foregroundColor,
              light: customization.backgroundColor
            },
            errorCorrectionLevel: customization.errorCorrectionLevel
          });

          // Add XML namespace for xlink
          let augmented = baseSvg.replace('<svg', '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');

          // Parse viewBox to determine the internal coordinate system
          const viewBoxMatch = baseSvg.match(/viewBox="([^"]+)"/);

          if (customization.logoEnabled && viewBoxMatch && viewBoxMatch[1]) {
            const vbParts = viewBoxMatch[1].split(/\s+/).map(Number);
            if (vbParts.length === 4) {
              const [vbX, vbY, vbWidth, vbHeight] = vbParts;

              // Use relative coordinates logic (same as handleSave)
              const pixelToCoordRatio = vbWidth / effectiveSize;

              const logoSizeCoords = vbWidth * (customization.logoSize / 100);

              const logoX = vbX + (vbWidth - logoSizeCoords) / 2;
              const logoY = vbY + (vbHeight - logoSizeCoords) / 2;

              const logoMarginCoords = customization.logoMargin * pixelToCoordRatio; // approximate scaling? No, margin is constant in visual pixel logic usually, but here we scale everything.
              // Actually if we scale the detailed QR, we should scale margin too? 
              // customization.logoMargin is in 'design pixels' (based on default ~512 canvas).
              // If we export at 5cm (approx 591px), the margin should probably scale proportionally if we want it to look identical?
              // OR we keep it fixed in pixels? Standard is usually proportional scaling for print.
              // Let's assume customization params are for the "base" design.

              // Scaling factor relative to "base" size (which is customization.size)
              // But wait, customization.size determines the PREVIEW CANVAS size.

              // Let's stick to the relative logic:
              // logoMargin is visual pixels in the preview.
              // We need to map that to coordinates.
              // PREVIEW pixel-to-coord ratio = vbWidth / customization.size.
              const previewRatio = vbWidth / customization.size;
              const scaledLogoMarginCoords = customization.logoMargin * previewRatio;

              const bgSize = logoSizeCoords + (scaledLogoMarginCoords * 2);
              const logoBgX = logoX - scaledLogoMarginCoords;
              const logoBgY = logoY - scaledLogoMarginCoords;

              const centerX = vbX + vbWidth / 2;
              const centerY = vbY + vbHeight / 2;
              const circleR = bgSize / 2;

              let overlays = '';
              const effectiveFill = customization.logoBackgroundShape !== 'none' ? customization.logoBackgroundColor : customization.backgroundColor;

              if (customization.logoClearArea || customization.logoBackgroundShape !== 'none') {
                const radiusCoords = customization.logoCornerRadius * previewRatio;

                if (customization.logoBackgroundShape === 'rounded') {
                  overlays += `<rect x="${logoBgX}" y="${logoBgY}" width="${bgSize}" height="${bgSize}" rx="${radiusCoords}" ry="${radiusCoords}" fill="${effectiveFill}"/>`;
                } else if (customization.logoBackgroundShape === 'square') {
                  overlays += `<rect x="${logoBgX}" y="${logoBgY}" width="${bgSize}" height="${bgSize}" fill="${effectiveFill}"/>`;
                } else {
                  overlays += `<circle cx="${centerX}" cy="${centerY}" r="${circleR}" fill="${effectiveFill}"/>`;
                }
              }

              let logoHref = '';
              if (customization.logoUrl) {
                logoHref = await getNormalizedLogoUrl(customization.logoUrl, {
                  enabled: customization.logoTintEnabled || false,
                  color: customization.logoTintColor || '#000000',
                  opacity: customization.logoTintOpacity ?? 1
                });
              }

              if (logoHref) {
                const clipId = `logoClip-${Date.now()}`;
                let clipDef = '';
                let clipAttr = '';
                const radiusCoords = customization.logoCornerRadius * previewRatio;

                if (customization.logoCornerRadius > 0) {
                  clipDef = `<defs><clipPath id="${clipId}"><rect x="${logoX}" y="${logoY}" width="${logoSizeCoords}" height="${logoSizeCoords}" rx="${radiusCoords}" ry="${radiusCoords}"/></clipPath></defs>`;
                  clipAttr = `clip-path="url(#${clipId})"`;
                }

                const imageEl = `${clipDef}<image x="${logoX}" y="${logoY}" width="${logoSizeCoords}" height="${logoSizeCoords}" href="${logoHref}" xlink:href="${logoHref}" ${clipAttr} preserveAspectRatio="xMidYMid meet" />`;

                const insertPos = augmented.lastIndexOf('</svg>');
                if (insertPos !== -1) {
                  augmented = augmented.slice(0, insertPos) + overlays + imageEl + augmented.slice(insertPos);
                } else {
                  augmented += overlays + imageEl;
                }
              } else if (overlays) {
                const insertPos = augmented.lastIndexOf('</svg>');
                if (insertPos !== -1) {
                  augmented = augmented.slice(0, insertPos) + overlays + augmented.slice(insertPos);
                } else {
                  augmented += overlays;
                }
              }
            }
          }

          const blob = new Blob([augmented], { type: 'image/svg+xml;charset=utf-8' });
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
    link.download = `qr-code-${effectiveSize}px-${Date.now()}.${extension}`;
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
        const baseSvg = await QRCode.toString(url, {
          type: 'svg',
          width: customization.size,
          margin: customization.margin,
          color: {
            dark: customization.foregroundColor,
            light: customization.backgroundColor
          },
          errorCorrectionLevel: customization.errorCorrectionLevel
        });

        let augmented = baseSvg.replace('<svg', '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');

        // Parse viewBox for coordinate system
        const viewBoxMatch = baseSvg.match(/viewBox="([^"]+)"/);

        if (customization.logoEnabled && viewBoxMatch && viewBoxMatch[1]) {
          const vbParts = viewBoxMatch[1].split(/\s+/).map(Number);
          if (vbParts.length === 4) {
            const [vbX, vbY, vbWidth, vbHeight] = vbParts;
            const pixelToCoordRatio = vbWidth / customization.size;
            const marginInCoords = customization.margin * pixelToCoordRatio;
            const logoSizeCoords = vbWidth * (customization.logoSize / 100);

            const logoX = vbX + (vbWidth - logoSizeCoords) / 2;
            const logoY = vbY + (vbHeight - logoSizeCoords) / 2;

            const logoMarginCoords = customization.logoMargin * pixelToCoordRatio;
            const bgSize = logoSizeCoords + (logoMarginCoords * 2);
            const logoBgX = logoX - logoMarginCoords;
            const logoBgY = logoY - logoMarginCoords;

            const centerX = vbX + vbWidth / 2;
            const centerY = vbY + vbHeight / 2;
            const circleR = bgSize / 2;

            let overlays = '';
            const effectiveFill = customization.logoBackgroundShape !== 'none' ? customization.logoBackgroundColor : customization.backgroundColor;

            if (customization.logoClearArea || customization.logoBackgroundShape !== 'none') {
              const radiusCoords = customization.logoCornerRadius * pixelToCoordRatio;
              if (customization.logoBackgroundShape === 'rounded') {
                overlays += `<rect x="${logoBgX}" y="${logoBgY}" width="${bgSize}" height="${bgSize}" rx="${radiusCoords}" ry="${radiusCoords}" fill="${effectiveFill}"/>`;
              } else if (customization.logoBackgroundShape === 'square') {
                overlays += `<rect x="${logoBgX}" y="${logoBgY}" width="${bgSize}" height="${bgSize}" fill="${effectiveFill}"/>`;
              } else {
                overlays += `<circle cx="${centerX}" cy="${centerY}" r="${circleR}" fill="${effectiveFill}"/>`;
              }
            }

            let logoHref = '';
            if (customization.logoUrl) {
              logoHref = await getNormalizedLogoUrl(customization.logoUrl, {
                enabled: customization.logoTintEnabled || false,
                color: customization.logoTintColor || '#000000',
                opacity: customization.logoTintOpacity ?? 1
              });
            }

            if (logoHref) {
              const clipId = `logoClip-save-${Date.now()}`;
              let clipDef = '';
              let clipAttr = '';
              const radiusCoords = customization.logoCornerRadius * pixelToCoordRatio;

              if (customization.logoCornerRadius > 0) {
                clipDef = `<defs><clipPath id="${clipId}"><rect x="${logoX}" y="${logoY}" width="${logoSizeCoords}" height="${logoSizeCoords}" rx="${radiusCoords}" ry="${radiusCoords}"/></clipPath></defs>`;
                clipAttr = `clip-path="url(#${clipId})"`;
              }

              const imageEl = `${clipDef}<image x="${logoX}" y="${logoY}" width="${logoSizeCoords}" height="${logoSizeCoords}" href="${logoHref}" xlink:href="${logoHref}" ${clipAttr} preserveAspectRatio="xMidYMid meet" />`;

              const insertPos = augmented.lastIndexOf('</svg>');
              if (insertPos !== -1) {
                augmented = augmented.slice(0, insertPos) + overlays + imageEl + augmented.slice(insertPos);
              } else {
                augmented += overlays + imageEl;
              }
            } else if (overlays) {
              const insertPos = augmented.lastIndexOf('</svg>');
              if (insertPos !== -1) {
                augmented = augmented.slice(0, insertPos) + overlays + augmented.slice(insertPos);
              } else {
                augmented += overlays;
              }
            }
          }
        }

        svgData = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(augmented)));
      } catch (error) {
        console.error('Error generating SVG:', error);
        svgData = pngData;
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

  const containerClassName = embed
    ? 'bg-white rounded-lg shadow-xl w-full flex flex-col'
    : 'bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col';

  const content = (
    <div className={containerClassName}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">QR Code Generator</h2>
          <p className="text-sm text-gray-600 mt-1">Customize your QR code with colors, logos, frames, and more</p>
        </div>
        {!embed && onClose && (
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
        <div className="flex-1 p-8 overflow-y-auto bg-gray-50">
          <div className="sticky top-0">
            <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Preview</h3>

              {/* QR Code Preview */}
              <div
                ref={previewRef}
                className="bg-white p-6 shadow-inner mb-4 flex items-center justify-center"
                style={{
                  minHeight: `${customization.size + (customization.textEnabled ? 60 : 0)}px`,
                  minWidth: `${customization.size}px`,
                  borderWidth: customization.frameEnabled ? customization.frameWidth : 2,
                  borderStyle: customization.frameEnabled && customization.frameType === 'dots' ? 'dotted' : 'solid',
                  borderColor: customization.frameEnabled ? customization.frameColor : '#E5E7EB',
                  borderRadius:
                    customization.bodyShape === 'rounded'
                      ? 24
                      : customization.bodyShape === 'dots'
                        ? 9999
                        : 12,
                  padding: customization.frameEnabled ? customization.framePadding : 16,
                  clipPath:
                    customization.bodyShape === 'heart'
                      ? 'path("M 24 4 C 20 -2 10 -2 6 4 C 0 12 8 20 24 32 C 40 20 48 12 42 4 C 38 -2 28 -2 24 4 Z")'
                      : undefined
                }}
              >
                {previewImage ? (
                  <div className="flex flex-col items-center justify-center w-full">
                    {customization.textEnabled && customization.textPosition === 'top' && (
                      <div
                        className="mb-2 text-center"
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
                    <div className="flex justify-center w-full">
                      <img
                        src={previewImage}
                        alt="QR Code Preview"
                        className="max-w-full h-auto"
                        style={{
                          minWidth: '300px',
                          minHeight: '300px',
                          borderRadius:
                            customization.bodyShape === 'rounded'
                              ? 24
                              : customization.bodyShape === 'dots'
                                ? 9999
                                : 0,
                          clipPath:
                            customization.bodyShape === 'heart'
                              ? 'path("M 24 4 C 20 -2 10 -2 6 4 C 0 12 8 20 24 32 C 40 20 48 12 42 4 C 38 -2 28 -2 24 4 Z")'
                              : undefined
                        }}
                      />
                    </div>
                    {customization.textEnabled && customization.textPosition === 'bottom' && (
                      <div
                        className="mt-2 text-center"
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
                  </div>
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
                <div className="flex flex-col gap-4 mt-6">
                  {/* Size Selection Dropdown */}
                  <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg border border-gray-200">
                    <span className="text-sm font-medium text-gray-600 pl-2">Download Size:</span>
                    <select
                      className="bg-white border text-sm font-medium border-gray-300 rounded-md py-1 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={downloadSize}
                      onChange={(e) => setDownloadSize(Number(e.target.value))}
                    >
                      {SIZE_PRESETS.map((preset) => (
                        <option key={preset.value} value={preset.value}>
                          {preset.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => downloadQR('png')}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      <Download size={18} />
                      PNG
                    </button>
                    <button
                      onClick={() => downloadQR('svg')}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      <Download size={18} />
                      SVG
                    </button>
                    <button
                      onClick={() => downloadQR('jpeg')}
                      className="col-span-2 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      <Download size={18} />
                      JPEG
                    </button>
                  </div>
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
                className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'design'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
              >
                <Palette className="w-4 h-4 mr-2" />
                Colors
              </button>
              <button
                onClick={() => setActiveTab('logo')}
                className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'logo'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Logo
              </button>
              <button
                onClick={() => setActiveTab('frame')}
                className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'frame'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
              >
                <Frame className="w-4 h-4 mr-2" />
                Frame
              </button>
              <button
                onClick={() => setActiveTab('text')}
                className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'text'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
              >
                <Type className="w-4 h-4 mr-2" />
                Text
              </button>
              <button
                onClick={() => setActiveTab('advanced')}
                className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'advanced'
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
          <div className="p-8 space-y-8">
            {/* Colors Tab */}
            {activeTab === 'design' && (
              <div className="space-y-6">
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
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => updateCustomization('bodyShape', 'square')}
                      className={`px-2 py-2 text-xs border rounded-lg flex flex-col items-center ${customization.bodyShape === 'square'
                        ? 'border-blue-500 text-blue-600 bg-blue-50'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      <span className="w-5 h-5 bg-gray-900 rounded-sm mb-1" />
                      Square
                    </button>
                    <button
                      type="button"
                      onClick={() => updateCustomization('bodyShape', 'rounded')}
                      className={`px-2 py-2 text-xs border rounded-lg flex flex-col items-center ${customization.bodyShape === 'rounded'
                        ? 'border-blue-500 text-blue-600 bg-blue-50'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      <span className="w-5 h-5 bg-gray-900 rounded-xl mb-1" />
                      Rounded
                    </button>
                    <button
                      type="button"
                      onClick={() => updateCustomization('bodyShape', 'dots')}
                      className={`px-2 py-2 text-xs border rounded-lg flex flex-col items-center ${customization.bodyShape === 'dots'
                        ? 'border-blue-500 text-blue-600 bg-blue-50'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      <span className="w-5 h-5 bg-gray-900 rounded-full mb-1" />
                      Circle
                    </button>
                    <button
                      type="button"
                      onClick={() => updateCustomization('bodyShape', 'heart')}
                      className={`px-2 py-2 text-xs border rounded-lg flex flex-col items-center ${customization.bodyShape === 'heart'
                        ? 'border-pink-500 text-pink-600 bg-pink-50'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      <span
                        className="w-5 h-5 bg-pink-500 mb-1"
                        style={{
                          clipPath:
                            'path("M 24 4 C 20 -2 10 -2 6 4 C 0 12 8 20 24 32 C 40 20 48 12 42 4 C 38 -2 28 -2 24 4 Z")'
                        }}
                      />
                      Heart
                    </button>
                  </div>
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
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-gray-900">Logo</h3>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Quick Logos
                  </label>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        const demoUrl = 'https://via.placeholder.com/200x200.png?text=Brand';
                        setLogoPreview(demoUrl);
                        setCustomization(prev => ({
                          ...prev,
                          logoEnabled: true,
                          logoUrl: demoUrl
                        }));
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-xs hover:bg-gray-50"
                    >
                      Simple Brand Logo
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const demoUrl = 'https://via.placeholder.com/200x200.png?text=Logo';
                        setLogoPreview(demoUrl);
                        setCustomization(prev => ({
                          ...prev,
                          logoEnabled: true,
                          logoUrl: demoUrl
                        }));
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-xs hover:bg-gray-50"
                    >
                      Text Logo
                    </button>
                  </div>
                </div>

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

                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-700">Clear area behind logo</label>
                  <input
                    type="checkbox"
                    checked={Boolean(customization.logoClearArea)}
                    onChange={(e) => updateCustomization('logoClearArea', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Background Shape</label>
                  <select
                    value={customization.logoBackgroundShape || 'circle'}
                    onChange={(e) => updateCustomization('logoBackgroundShape', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="none">None</option>
                    <option value="square">Square</option>
                    <option value="rounded">Rounded</option>
                    <option value="circle">Circle</option>
                  </select>
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

                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-700">Apply tint to logo</label>
                  <input
                    type="checkbox"
                    checked={Boolean(customization.logoTintEnabled)}
                    onChange={(e) => updateCustomization('logoTintEnabled', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                {customization.logoTintEnabled && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Tint Color</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={customization.logoTintColor || '#000000'}
                          onChange={(e) => updateCustomization('logoTintColor', e.target.value)}
                          className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={customization.logoTintColor || '#000000'}
                          onChange={(e) => updateCustomization('logoTintColor', e.target.value)}
                          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Tint Opacity: {Math.round((customization.logoTintOpacity || 1) * 100)}%</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={Math.round((customization.logoTintOpacity || 1) * 100)}
                        onChange={(e) => updateCustomization('logoTintOpacity', parseInt(e.target.value) / 100)}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Frame Tab */}
            {activeTab === 'frame' && (
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-gray-900">Frame</h3>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Frame Type
                  </label>
                  <select
                    value={customization.frameType}
                    onChange={(e) => updateCustomization('frameType', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
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
              </div>
            )}

            {/* Text Tab */}
            {activeTab === 'text' && (
              <div className="space-y-6">
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
              <div className="space-y-6">
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
  );

  if (embed) {
    return content;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {content}
    </div>
  );
};

export default QRGenerator;
