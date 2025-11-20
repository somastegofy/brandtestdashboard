import React from 'react';
import { HeaderProps } from './types';

interface HeaderSettingsProps {
  props: HeaderProps;
  onPropsChange: (props: HeaderProps) => void;
}

export const HeaderSettings: React.FC<HeaderSettingsProps> = ({
  props,
  onPropsChange
}) => {
  const updateProp = (path: string[], value: any) => {
    const newProps = { ...props };
    let current: any = newProps;
    
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) {
        current[path[i]] = {};
      }
      current = current[path[i]];
    }
    
    current[path[path.length - 1]] = value;
    onPropsChange(newProps);
  };

  const addNavigationItem = () => {
    const newItems = [...(props.navigation?.items || [])];
    newItems.push({
      label: 'New Item',
      link: '#',
      openInNewTab: false
    });
    updateProp(['navigation', 'items'], newItems);
  };

  const updateNavigationItem = (index: number, field: string, value: any) => {
    const newItems = [...(props.navigation?.items || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    updateProp(['navigation', 'items'], newItems);
  };

  const removeNavigationItem = (index: number) => {
    const newItems = [...(props.navigation?.items || [])];
    newItems.splice(index, 1);
    updateProp(['navigation', 'items'], newItems);
  };

  return (
    <div className="space-y-6">
      {/* Text Settings */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Text / Title</h4>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={props.text?.enabled ?? false}
              onChange={(e) => updateProp(['text', 'enabled'], e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Enable Text</span>
          </label>

          {props.text?.enabled && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Text Content
                </label>
                <input
                  type="text"
                  value={props.text?.content || ''}
                  onChange={(e) => updateProp(['text', 'content'], e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter header text"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Font Size
                </label>
                <input
                  type="text"
                  value={props.text?.fontSize || '24px'}
                  onChange={(e) => updateProp(['text', 'fontSize'], e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="24px"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Font Weight
                </label>
                <select
                  value={props.text?.fontWeight || 'bold'}
                  onChange={(e) => updateProp(['text', 'fontWeight'], e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="normal">Normal</option>
                  <option value="600">Semi-Bold</option>
                  <option value="bold">Bold</option>
                  <option value="700">Bold (700)</option>
                  <option value="800">Extra Bold</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Text Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={props.text?.color || '#000000'}
                    onChange={(e) => updateProp(['text', 'color'], e.target.value)}
                    className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={props.text?.color || '#000000'}
                    onChange={(e) => updateProp(['text', 'color'], e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Text Alignment
                </label>
                <select
                  value={props.text?.align || 'left'}
                  onChange={(e) => updateProp(['text', 'align'], e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Font Family (Optional)
                </label>
                <input
                  type="text"
                  value={props.text?.fontFamily || ''}
                  onChange={(e) => updateProp(['text', 'fontFamily'], e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Arial, sans-serif"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Letter Spacing
                  </label>
                  <input
                    type="text"
                    value={props.text?.letterSpacing || 'normal'}
                    onChange={(e) => updateProp(['text', 'letterSpacing'], e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="normal or 2px"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Text Transform
                  </label>
                  <select
                    value={props.text?.textTransform || 'none'}
                    onChange={(e) => updateProp(['text', 'textTransform'], e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="none">None</option>
                    <option value="uppercase">Uppercase</option>
                    <option value="lowercase">Lowercase</option>
                    <option value="capitalize">Capitalize</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Text Link (Optional)
                </label>
                <input
                  type="text"
                  value={props.text?.link || ''}
                  onChange={(e) => updateProp(['text', 'link'], e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={props.text?.openInNewTab || false}
                  onChange={(e) => updateProp(['text', 'openInNewTab'], e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-xs text-gray-700">Open link in new tab</span>
              </label>
            </>
          )}
        </div>
      </div>

      {/* Logo Settings */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Logo</h4>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={props.logo?.enabled ?? false}
              onChange={(e) => updateProp(['logo', 'enabled'], e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Enable Logo</span>
          </label>

          {props.logo?.enabled && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Logo URL
                </label>
                <input
                  type="text"
                  value={props.logo?.src || ''}
                  onChange={(e) => updateProp(['logo', 'src'], e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Alt Text
                </label>
                <input
                  type="text"
                  value={props.logo?.alt || ''}
                  onChange={(e) => updateProp(['logo', 'alt'], e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Width (px)
                  </label>
                  <input
                    type="number"
                    value={props.logo?.width || 160}
                    onChange={(e) => updateProp(['logo', 'width'], parseInt(e.target.value) || 160)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Height (px)
                  </label>
                  <input
                    type="number"
                    value={props.logo?.height || 48}
                    onChange={(e) => updateProp(['logo', 'height'], parseInt(e.target.value) || 48)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Logo Alignment
                </label>
                <select
                  value={props.logo?.align || 'left'}
                  onChange={(e) => updateProp(['logo', 'align'], e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Logo Link (Optional)
                </label>
                <input
                  type="text"
                  value={props.logo?.link || ''}
                  onChange={(e) => updateProp(['logo', 'link'], e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={props.logo?.openInNewTab || false}
                  onChange={(e) => updateProp(['logo', 'openInNewTab'], e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-xs text-gray-700">Open link in new tab</span>
              </label>
            </>
          )}
        </div>
      </div>

      {/* Navigation Settings */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Navigation</h4>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={props.navigation?.enabled ?? false}
              onChange={(e) => updateProp(['navigation', 'enabled'], e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Enable Navigation</span>
          </label>

          {props.navigation?.enabled && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Navigation Alignment
                </label>
                <select
                  value={props.navigation?.align || 'right'}
                  onChange={(e) => updateProp(['navigation', 'align'], e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-medium text-gray-700">
                    Navigation Items
                  </label>
                  <button
                    onClick={addNavigationItem}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    + Add Item
                  </button>
                </div>
                <div className="space-y-2">
                  {(props.navigation?.items || []).map((item, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-700">Item {index + 1}</span>
                        <button
                          onClick={() => removeNavigationItem(index)}
                          className="text-xs text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => updateNavigationItem(index, 'label', e.target.value)}
                        placeholder="Label"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        value={item.link}
                        onChange={(e) => updateNavigationItem(index, 'link', e.target.value)}
                        placeholder="URL"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      />
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={item.openInNewTab || false}
                          onChange={(e) => updateNavigationItem(index, 'openInNewTab', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-xs text-gray-700">Open in new tab</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Background Settings */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Background</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Background Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={props.background?.color || '#ffffff'}
                onChange={(e) => updateProp(['background', 'color'], e.target.value)}
                className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={props.background?.color || '#ffffff'}
                onChange={(e) => updateProp(['background', 'color'], e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Background Image URL (Optional)
            </label>
            <input
              type="text"
              value={props.background?.image || ''}
              onChange={(e) => updateProp(['background', 'image'], e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Opacity: {props.background?.opacity ?? 1}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={props.background?.opacity ?? 1}
              onChange={(e) => updateProp(['background', 'opacity'], parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Layout Settings */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Layout</h4>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={props.sticky || false}
              onChange={(e) => updateProp(['sticky'], e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Sticky Header</span>
          </label>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Height
            </label>
            <input
              type="text"
              value={props.height || '80px'}
              onChange={(e) => updateProp(['height'], e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="80px"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Padding
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Top</label>
                <input
                  type="text"
                  value={props.padding?.top || '16px'}
                  onChange={(e) => updateProp(['padding', 'top'], e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Bottom</label>
                <input
                  type="text"
                  value={props.padding?.bottom || '16px'}
                  onChange={(e) => updateProp(['padding', 'bottom'], e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Left</label>
                <input
                  type="text"
                  value={props.padding?.left || '24px'}
                  onChange={(e) => updateProp(['padding', 'left'], e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Right</label>
                <input
                  type="text"
                  value={props.padding?.right || '24px'}
                  onChange={(e) => updateProp(['padding', 'right'], e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Border Settings */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Border</h4>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={props.border?.enabled ?? false}
              onChange={(e) => updateProp(['border', 'enabled'], e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Enable Border</span>
          </label>

          {props.border?.enabled && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Border Width
                </label>
                <input
                  type="text"
                  value={props.border?.width || '1px'}
                  onChange={(e) => updateProp(['border', 'width'], e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1px"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Border Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={props.border?.color || '#e5e7eb'}
                    onChange={(e) => updateProp(['border', 'color'], e.target.value)}
                    className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={props.border?.color || '#e5e7eb'}
                    onChange={(e) => updateProp(['border', 'color'], e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Border Style
                </label>
                <select
                  value={props.border?.style || 'solid'}
                  onChange={(e) => updateProp(['border', 'style'], e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Layout Settings - Logo and Text Arrangement */}
      {(props.logo?.enabled && props.text?.enabled) && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Logo & Text Layout</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Arrangement
              </label>
              <select
                value={props.layout?.logoTextAlignment || 'horizontal'}
                onChange={(e) => updateProp(['layout', 'logoTextAlignment'], e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="horizontal">Horizontal (Logo left, Text right)</option>
                <option value="vertical">Vertical (Logo top, Text bottom)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Spacing Between Logo & Text
              </label>
              <input
                type="text"
                value={props.layout?.logoTextSpacing || '12px'}
                onChange={(e) => updateProp(['layout', 'logoTextSpacing'], e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="12px"
              />
              <p className="text-xs text-gray-500 mt-1">Spacing between logo and text when both are enabled</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

