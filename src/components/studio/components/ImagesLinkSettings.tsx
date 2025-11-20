import React from 'react';
import { ImagesLinkProps, ImageLinkItem } from './types';
import { Plus, Trash2 } from 'lucide-react';

interface ImagesLinkSettingsProps {
  props: ImagesLinkProps;
  onPropsChange: (props: ImagesLinkProps) => void;
}

export const ImagesLinkSettings: React.FC<ImagesLinkSettingsProps> = ({
  props,
  onPropsChange
}) => {
  const updateProp = (key: keyof ImagesLinkProps, value: any) => {
    onPropsChange({ ...props, [key]: value });
  };

  const addImageItem = () => {
    const newItem: ImageLinkItem = {
      id: Date.now().toString(),
      imageUrl: '',
      alt: 'New Image',
      title: '',
      description: '',
      link: '',
      openInNewTab: false
    };
    updateProp('items', [...(props.items || []), newItem]);
  };

  const updateImageItem = (index: number, field: keyof ImageLinkItem, value: any) => {
    const newItems = [...(props.items || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    updateProp('items', newItems);
  };

  const removeImageItem = (index: number) => {
    const newItems = [...(props.items || [])];
    newItems.splice(index, 1);
    updateProp('items', newItems);
  };

  return (
    <div className="space-y-4">
      {/* Layout Settings */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Layout</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Layout Type
            </label>
            <select
              value={props.layout || 'grid'}
              onChange={(e) => updateProp('layout', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="grid">Grid</option>
              <option value="carousel">Carousel</option>
              <option value="list">List</option>
            </select>
          </div>

          {props.layout === 'grid' && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Columns: {props.columns || 3}
              </label>
              <input
                type="range"
                min="1"
                max="6"
                value={props.columns || 3}
                onChange={(e) => updateProp('columns', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Spacing
            </label>
            <input
              type="text"
              value={props.spacing || '16px'}
              onChange={(e) => updateProp('spacing', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="16px"
            />
          </div>
        </div>
      </div>

      {/* Image Settings */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Image Settings</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Aspect Ratio
            </label>
            <select
              value={props.imageAspectRatio || '16:9'}
              onChange={(e) => updateProp('imageAspectRatio', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="16:9">16:9 (Wide)</option>
              <option value="4:3">4:3 (Standard)</option>
              <option value="1:1">1:1 (Square)</option>
              <option value="3:4">3:4 (Portrait)</option>
              <option value="auto">Auto</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Border Radius
            </label>
            <input
              type="text"
              value={props.imageBorderRadius || '8px'}
              onChange={(e) => updateProp('imageBorderRadius', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="8px"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Hover Effect
            </label>
            <select
              value={props.hoverEffect || 'zoom'}
              onChange={(e) => updateProp('hoverEffect', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="none">None</option>
              <option value="zoom">Zoom</option>
              <option value="fade">Fade</option>
              <option value="lift">Lift</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Settings */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Content</h4>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={props.showTitles ?? true}
              onChange={(e) => updateProp('showTitles', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Show Titles</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={props.showDescriptions ?? false}
              onChange={(e) => updateProp('showDescriptions', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Show Descriptions</span>
          </label>
        </div>
      </div>

      {/* Link Settings */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Link Settings</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Link Style
            </label>
            <select
              value={props.linkStyle || 'entire-image'}
              onChange={(e) => updateProp('linkStyle', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="entire-image">Entire Image</option>
              <option value="overlay">Overlay Button</option>
              <option value="button">Button Below</option>
            </select>
          </div>
        </div>
      </div>

      {/* Image Items */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-900">Images</h4>
          <button
            onClick={addImageItem}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 border border-blue-300 rounded-lg hover:bg-blue-50"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Image
          </button>
        </div>
        <div className="space-y-4">
          {(props.items || []).map((item, index) => (
            <div key={item.id || index} className="p-4 border border-gray-200 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700">Image {index + 1}</span>
                <button
                  onClick={() => removeImageItem(index)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={item.imageUrl}
                  onChange={(e) => updateImageItem(index, 'imageUrl', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Alt Text
                </label>
                <input
                  type="text"
                  value={item.alt}
                  onChange={(e) => updateImageItem(index, 'alt', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {props.showTitles && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={item.title || ''}
                    onChange={(e) => updateImageItem(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              {props.showDescriptions && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={item.description || ''}
                    onChange={(e) => updateImageItem(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Link URL (Optional)
                </label>
                <input
                  type="text"
                  value={item.link || ''}
                  onChange={(e) => updateImageItem(index, 'link', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={item.openInNewTab || false}
                  onChange={(e) => updateImageItem(index, 'openInNewTab', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-xs text-gray-700">Open link in new tab</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

