import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { SocialLinksProps } from './types';

interface SocialLinksSettingsProps {
  props: SocialLinksProps;
  onPropsChange: (props: SocialLinksProps) => void;
}

export const SocialLinksSettings: React.FC<SocialLinksSettingsProps> = ({
  props,
  onPropsChange
}) => {
  const updateProp = (key: keyof SocialLinksProps, value: any) => {
    onPropsChange({ ...props, [key]: value });
  };

  const updateLink = (index: number, key: keyof SocialLinksProps['links'][0], value: any) => {
    const newLinks = [...(props.links || [])];
    newLinks[index] = { ...newLinks[index], [key]: value };
    updateProp('links', newLinks);
  };

  const addLink = () => {
    const newLinks = [...(props.links || []), {
      platform: 'facebook' as const,
      url: '',
      customIcon: undefined,
      customLabel: undefined
    }];
    updateProp('links', newLinks);
  };

  const removeLink = (index: number) => {
    const newLinks = [...(props.links || [])];
    newLinks.splice(index, 1);
    updateProp('links', newLinks);
  };

  return (
    <div className="space-y-6">
      {/* Layout Settings */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Layout</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Layout Type
            </label>
            <select
              value={props.layout || 'horizontal'}
              onChange={(e) => updateProp('layout', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
              <option value="grid">Grid</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Icon Size
            </label>
            <select
              value={props.size || 'medium'}
              onChange={(e) => updateProp('size', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Spacing
            </label>
            <input
              type="text"
              value={props.spacing || '12px'}
              onChange={(e) => updateProp('spacing', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="12px"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Alignment
            </label>
            <select
              value={props.alignment || 'center'}
              onChange={(e) => updateProp('alignment', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Border Radius
            </label>
            <input
              type="text"
              value={props.borderRadius || '8px'}
              onChange={(e) => updateProp('borderRadius', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="8px"
            />
          </div>
        </div>
      </div>

      {/* Color Settings */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Colors</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Icon Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={props.iconColor || '#000000'}
                onChange={(e) => updateProp('iconColor', e.target.value)}
                className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={props.iconColor || '#000000'}
                onChange={(e) => updateProp('iconColor', e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Hover Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={props.hoverColor || '#3b82f6'}
                onChange={(e) => updateProp('hoverColor', e.target.value)}
                className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={props.hoverColor || '#3b82f6'}
                onChange={(e) => updateProp('hoverColor', e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-700">Show Labels</label>
            <input
              type="checkbox"
              checked={props.showLabels || false}
              onChange={(e) => updateProp('showLabels', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Links List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-900">Social Links</h4>
          <button
            onClick={addLink}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Link
          </button>
        </div>

        <div className="space-y-4">
          {(props.links || []).map((link, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Link {index + 1}</span>
                <button
                  onClick={() => removeLink(index)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Remove link"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Platform
                </label>
                <select
                  value={link.platform || 'facebook'}
                  onChange={(e) => updateLink(index, 'platform', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="facebook">Facebook</option>
                  <option value="twitter">Twitter</option>
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="youtube">YouTube</option>
                  <option value="pinterest">Pinterest</option>
                  <option value="tiktok">TikTok</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  URL *
                </label>
                <input
                  type="text"
                  value={link.url || ''}
                  onChange={(e) => updateLink(index, 'url', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>

              {link.platform === 'custom' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Custom Label
                    </label>
                    <input
                      type="text"
                      value={link.customLabel || ''}
                      onChange={(e) => updateLink(index, 'customLabel', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Custom Platform Name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Custom Icon (SVG HTML)
                    </label>
                    <textarea
                      value={link.customIcon || ''}
                      onChange={(e) => updateLink(index, 'customIcon', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="<svg>...</svg>"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Paste SVG HTML code for custom icon
                    </p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

