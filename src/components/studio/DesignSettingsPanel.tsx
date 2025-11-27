import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface DesignCustomization {
  backgroundColor: string;
  backgroundImage: string;
  backgroundMode: 'cover' | 'contain';
  backgroundOverlay: number;
  gradientType: 'linear' | 'radial' | 'none';
  gradientAngle: number;
  gradientColorStart: string;
  gradientColorEnd: string;
  fontFamilyHeading: string;
  fontFamilyBody: string;
  fontFamilyLabel: string;
  fontSizeHeading: string;
  fontSizeBody: string;
  fontSizeLabel: string;
  cardBorderRadius: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'custom';
  cardBorderRadiusCustom?: string;
  cardElevation: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'inner';
  cardShadowColor?: string;
  cardBorderWidth?: string;
  cardBorderColor?: string;
  cardBorderStyle?: 'solid' | 'dashed' | 'dotted';
  cardSurfaceColor: string;
  globalSpacing?: string;
  componentGap?: string;
  globalPadding?: string;
  transitionDuration?: string;
  transitionEasing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
  loaderType: 'none' | 'spinner' | 'bar' | 'logo-pulse';
  loaderAccentColor: string;
  linkColorDefault: string;
  linkColorHover: string;
  linkColorActive: string;
  ctaColorDefault: string;
  ctaColorHover: string;
  ctaColorActive: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  textColorPrimary?: string;
  textColorSecondary?: string;
  borderColorDefault?: string;
}

interface DesignSettingsPanelProps {
  customization: DesignCustomization;
  onCustomizationChange: (key: keyof DesignCustomization, value: any) => void;
  contrastIssues: string[];
}

function calculateContrast(foreground: string, background: string): number {
  const getLuminance = (hex: string): number => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;

    const [rs, gs, bs] = [r, g, b].map((c) => {
      const sRGB = c / 255;
      return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

function getBorderRadiusPreview(borderRadius: string, custom?: string): string {
  if (borderRadius === 'custom' && custom) {
    return `Custom: ${custom}`;
  }
  const radiusMap: Record<string, string> = {
    'none': '0px',
    'xs': '4px',
    'sm': '8px',
    'md': '12px',
    'lg': '16px',
    'xl': '24px',
    '2xl': '32px',
    'full': '9999px (Fully rounded)'
  };
  return radiusMap[borderRadius] || '12px';
}

const DesignSettingsPanel: React.FC<DesignSettingsPanelProps> = ({
  customization,
  onCustomizationChange,
  contrastIssues,
}) => {
  const contrast = calculateContrast('#000000', customization.backgroundColor);
  const meetsAA = contrast >= 4.5;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Background</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Background Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={customization.backgroundColor}
                onChange={(e) => onCustomizationChange('backgroundColor', e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={customization.backgroundColor}
                onChange={(e) => onCustomizationChange('backgroundColor', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="#ffffff"
              />
              <div
                className={`px-2 py-1 text-xs font-medium rounded ${
                  meetsAA
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
                title={`Contrast ratio: ${contrast.toFixed(2)}:1`}
              >
                {meetsAA ? 'AA ✓' : 'AA ✗'}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Contrast ratio: {contrast.toFixed(2)}:1 (WCAG AA requires ≥4.5:1)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Background Image URL
            </label>
            <input
              type="text"
              value={customization.backgroundImage}
              onChange={(e) => onCustomizationChange('backgroundImage', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {customization.backgroundImage && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Background Mode
                </label>
                <select
                  value={customization.backgroundMode}
                  onChange={(e) =>
                    onCustomizationChange('backgroundMode', e.target.value as 'cover' | 'contain')
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="cover">Cover (Fill)</option>
                  <option value="contain">Contain (Fit)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Overlay Scrim ({customization.backgroundOverlay}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="80"
                  value={customization.backgroundOverlay}
                  onChange={(e) =>
                    onCustomizationChange('backgroundOverlay', parseInt(e.target.value))
                  }
                  className="w-full"
                />
              </div>
            </>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Gradient</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gradient Type
            </label>
            <select
              value={customization.gradientType}
              onChange={(e) =>
                onCustomizationChange('gradientType', e.target.value as 'linear' | 'radial' | 'none')
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="none">None</option>
              <option value="linear">Linear</option>
              <option value="radial">Radial</option>
            </select>
          </div>

          {customization.gradientType !== 'none' && (
            <>
              {customization.gradientType === 'linear' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Angle ({customization.gradientAngle}°)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={customization.gradientAngle}
                    onChange={(e) =>
                      onCustomizationChange('gradientAngle', parseInt(e.target.value))
                    }
                    className="w-full"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Color
                  </label>
                  <input
                    type="color"
                    value={customization.gradientColorStart}
                    onChange={(e) =>
                      onCustomizationChange('gradientColorStart', e.target.value)
                    }
                    className="w-full h-10 border border-gray-300 rounded cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Color
                  </label>
                  <input
                    type="color"
                    value={customization.gradientColorEnd}
                    onChange={(e) =>
                      onCustomizationChange('gradientColorEnd', e.target.value)
                    }
                    className="w-full h-10 border border-gray-300 rounded cursor-pointer"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Typography</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heading Font
              </label>
              <select
                value={customization.fontFamilyHeading}
                onChange={(e) => onCustomizationChange('fontFamilyHeading', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="system-ui">System UI</option>
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Lato">Lato</option>
                <option value="Montserrat">Montserrat</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Size
              </label>
              <input
                type="text"
                value={customization.fontSizeHeading}
                onChange={(e) => onCustomizationChange('fontSizeHeading', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="2rem"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Body Font
              </label>
              <select
                value={customization.fontFamilyBody}
                onChange={(e) => onCustomizationChange('fontFamilyBody', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="system-ui">System UI</option>
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Lato">Lato</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Size
              </label>
              <input
                type="text"
                value={customization.fontSizeBody}
                onChange={(e) => onCustomizationChange('fontSizeBody', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="1rem"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Label Font
              </label>
              <select
                value={customization.fontFamilyLabel}
                onChange={(e) => onCustomizationChange('fontFamilyLabel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="system-ui">System UI</option>
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Size
              </label>
              <input
                type="text"
                value={customization.fontSizeLabel}
                onChange={(e) => onCustomizationChange('fontSizeLabel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="0.875rem"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Card Style</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Border Radius
            </label>
            <div className="grid grid-cols-5 gap-2 mb-2">
              {(['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', 'full'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => onCustomizationChange('cardBorderRadius', size)}
                  className={`px-2 py-1.5 text-xs font-medium rounded border-2 transition-colors ${
                    customization.cardBorderRadius === size
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {size === 'none' ? 'None' : size === 'full' ? '○' : size.toUpperCase()}
                </button>
              ))}
            </div>
            <button
              onClick={() => onCustomizationChange('cardBorderRadius', 'custom')}
              className={`w-full px-3 py-2 text-xs font-medium rounded border-2 transition-colors mb-2 ${
                customization.cardBorderRadius === 'custom'
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              Custom Value
            </button>
            {customization.cardBorderRadius === 'custom' && (
              <input
                type="text"
                value={customization.cardBorderRadiusCustom || ''}
                onChange={(e) => onCustomizationChange('cardBorderRadiusCustom', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="e.g., 12px, 1rem, 50%"
              />
            )}
            <p className="text-xs text-gray-500 mt-1">
              {getBorderRadiusPreview(customization.cardBorderRadius, customization.cardBorderRadiusCustom)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Elevation / Shadow
            </label>
            <select
              value={customization.cardElevation || 'none'}
              onChange={(e) =>
                onCustomizationChange('cardElevation', e.target.value as any)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm mb-2"
            >
              <option value="none">None (Flat)</option>
              <option value="sm">Small Shadow</option>
              <option value="md">Medium Shadow</option>
              <option value="lg">Large Shadow</option>
              <option value="xl">Extra Large Shadow</option>
              <option value="2xl">2X Large Shadow</option>
              <option value="inner">Inner Shadow</option>
            </select>
            {(customization.cardElevation && customization.cardElevation !== 'none') && (
              <div className="mt-2">
                <label className="block text-xs text-gray-600 mb-1">Shadow Color (Optional)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={customization.cardShadowColor || '#000000'}
                    onChange={(e) => onCustomizationChange('cardShadowColor', e.target.value)}
                    className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customization.cardShadowColor || ''}
                    onChange={(e) => onCustomizationChange('cardShadowColor', e.target.value)}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                    placeholder="#000000"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Border Width
              </label>
              <input
                type="text"
                value={customization.cardBorderWidth || '0'}
                onChange={(e) => onCustomizationChange('cardBorderWidth', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="0px, 1px, 2px"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Border Style
              </label>
              <select
                value={customization.cardBorderStyle || 'solid'}
                onChange={(e) => onCustomizationChange('cardBorderStyle', e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
              </select>
            </div>
          </div>

          {customization.cardBorderWidth && customization.cardBorderWidth !== '0' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Border Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={customization.cardBorderColor || '#e5e7eb'}
                  onChange={(e) => onCustomizationChange('cardBorderColor', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={customization.cardBorderColor || ''}
                  onChange={(e) => onCustomizationChange('cardBorderColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="#e5e7eb"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Surface Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={customization.cardSurfaceColor}
                onChange={(e) => onCustomizationChange('cardSurfaceColor', e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={customization.cardSurfaceColor}
                onChange={(e) => onCustomizationChange('cardSurfaceColor', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="#ffffff"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Global Spacing & Layout</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Component Gap (Space between components)
            </label>
            <input
              type="text"
              value={customization.componentGap || '24px'}
              onChange={(e) => onCustomizationChange('componentGap', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="24px, 1.5rem"
            />
            <p className="text-xs text-gray-500 mt-1">Default spacing between components</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Global Padding (Container padding)
            </label>
            <input
              type="text"
              value={customization.globalPadding || '16px'}
              onChange={(e) => onCustomizationChange('globalPadding', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="16px, 1rem"
            />
            <p className="text-xs text-gray-500 mt-1">Default padding inside components</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Global Spacing Scale
            </label>
            <input
              type="text"
              value={customization.globalSpacing || '8px'}
              onChange={(e) => onCustomizationChange('globalSpacing', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="8px, 0.5rem"
            />
            <p className="text-xs text-gray-500 mt-1">Base spacing unit (multiplied for different sizes)</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Color Palette</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primary Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={customization.primaryColor || '#3b82f6'}
                  onChange={(e) => onCustomizationChange('primaryColor', e.target.value)}
                  className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={customization.primaryColor || ''}
                  onChange={(e) => onCustomizationChange('primaryColor', e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                  placeholder="#3b82f6"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Secondary Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={customization.secondaryColor || '#8b5cf6'}
                  onChange={(e) => onCustomizationChange('secondaryColor', e.target.value)}
                  className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={customization.secondaryColor || ''}
                  onChange={(e) => onCustomizationChange('secondaryColor', e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                  placeholder="#8b5cf6"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Accent Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={customization.accentColor || '#10b981'}
                onChange={(e) => onCustomizationChange('accentColor', e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={customization.accentColor || ''}
                onChange={(e) => onCustomizationChange('accentColor', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="#10b981"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Text Color (Primary)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={customization.textColorPrimary || '#111827'}
                  onChange={(e) => onCustomizationChange('textColorPrimary', e.target.value)}
                  className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={customization.textColorPrimary || ''}
                  onChange={(e) => onCustomizationChange('textColorPrimary', e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                  placeholder="#111827"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Text Color (Secondary)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={customization.textColorSecondary || '#6b7280'}
                  onChange={(e) => onCustomizationChange('textColorSecondary', e.target.value)}
                  className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={customization.textColorSecondary || ''}
                  onChange={(e) => onCustomizationChange('textColorSecondary', e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                  placeholder="#6b7280"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default Border Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={customization.borderColorDefault || '#e5e7eb'}
                onChange={(e) => onCustomizationChange('borderColorDefault', e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={customization.borderColorDefault || ''}
                onChange={(e) => onCustomizationChange('borderColorDefault', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="#e5e7eb"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Transitions & Animations</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transition Duration
            </label>
            <select
              value={customization.transitionDuration || '150ms'}
              onChange={(e) => onCustomizationChange('transitionDuration', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="0ms">None (Instant)</option>
              <option value="75ms">Fast (75ms)</option>
              <option value="150ms">Default (150ms)</option>
              <option value="200ms">Smooth (200ms)</option>
              <option value="300ms">Slow (300ms)</option>
              <option value="500ms">Very Slow (500ms)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Applies to hover, focus, and interactive states</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transition Easing
            </label>
            <select
              value={customization.transitionEasing || 'ease-in-out'}
              onChange={(e) => onCustomizationChange('transitionEasing', e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="linear">Linear (Constant speed)</option>
              <option value="ease-in">Ease In (Start slow)</option>
              <option value="ease-out">Ease Out (End slow)</option>
              <option value="ease-in-out">Ease In Out (Smooth both ways)</option>
            </select>
          </div>
        </div>
      </div>

      {contrastIssues.length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-red-900 mb-1">
                Contrast Issues Detected
              </h4>
              <ul className="text-sm text-red-700 space-y-1">
                {contrastIssues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
              <p className="text-xs text-red-600 mt-2">
                Please fix these issues before proceeding to the next step.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignSettingsPanel;
