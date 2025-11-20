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
  cardBorderRadius: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  cardElevation: 'none' | 'raised' | 'overlay';
  cardSurfaceColor: string;
  loaderType: 'none' | 'spinner' | 'bar' | 'logo-pulse';
  loaderAccentColor: string;
  linkColorDefault: string;
  linkColorHover: string;
  linkColorActive: string;
  ctaColorDefault: string;
  ctaColorHover: string;
  ctaColorActive: string;
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
            <div className="grid grid-cols-5 gap-2">
              {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => onCustomizationChange('cardBorderRadius', size)}
                  className={`px-3 py-2 text-xs font-medium rounded border-2 transition-colors ${
                    customization.cardBorderRadius === size
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {size.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Elevation
            </label>
            <select
              value={customization.cardElevation}
              onChange={(e) =>
                onCustomizationChange('cardElevation', e.target.value as 'none' | 'raised' | 'overlay')
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="none">None (Flat)</option>
              <option value="raised">Raised (Shadow)</option>
              <option value="overlay">Overlay (Elevated)</option>
            </select>
          </div>

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
