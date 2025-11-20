import React from 'react';
import { ImageTextProps } from './types';

interface ImageTextSettingsProps {
  props: ImageTextProps;
  onPropsChange: (props: ImageTextProps) => void;
}

export const ImageTextSettings: React.FC<ImageTextSettingsProps> = ({
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
              value={props.layout || 'image-left'}
              onChange={(e) => onPropsChange({ ...props, layout: e.target.value as any })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="image-left">Image Left</option>
              <option value="image-right">Image Right</option>
              <option value="image-top">Image Top</option>
              <option value="image-bottom">Image Bottom</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Spacing
            </label>
            <input
              type="text"
              value={props.spacing || '24px'}
              onChange={(e) => onPropsChange({ ...props, spacing: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="24px"
            />
          </div>

          {(props.layout === 'image-left' || props.layout === 'image-right') && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Image Width
                </label>
                <input
                  type="text"
                  value={props.imageWidth || '50%'}
                  onChange={(e) => onPropsChange({ ...props, imageWidth: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="50%"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Text Width
                </label>
                <input
                  type="text"
                  value={props.textWidth || '50%'}
                  onChange={(e) => onPropsChange({ ...props, textWidth: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="50%"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Alignment
            </label>
            <select
              value={props.alignment || 'left'}
              onChange={(e) => onPropsChange({ ...props, alignment: e.target.value as any })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>
      </div>

      {/* Image Settings */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Image</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="text"
              value={props.image?.url || ''}
              onChange={(e) => updateProp(['image', 'url'], e.target.value)}
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
              value={props.image?.alt || ''}
              onChange={(e) => updateProp(['image', 'alt'], e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Image description"
            />
          </div>
        </div>
      </div>

      {/* Text Settings */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Text</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Heading
            </label>
            <input
              type="text"
              value={props.text?.heading || ''}
              onChange={(e) => updateProp(['text', 'heading'], e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Heading"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Heading Size
              </label>
              <input
                type="text"
                value={props.text?.headingSize || '1.5rem'}
                onChange={(e) => updateProp(['text', 'headingSize'], e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1.5rem"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Heading Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={props.text?.headingColor || '#000000'}
                  onChange={(e) => updateProp(['text', 'headingColor'], e.target.value)}
                  className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={props.text?.headingColor || '#000000'}
                  onChange={(e) => updateProp(['text', 'headingColor'], e.target.value)}
                  className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Text Content
            </label>
            <textarea
              value={props.text?.content || ''}
              onChange={(e) => updateProp(['text', 'content'], e.target.value)}
              rows={4}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your text content"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Content Size
              </label>
              <input
                type="text"
                value={props.text?.contentSize || '1rem'}
                onChange={(e) => updateProp(['text', 'contentSize'], e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1rem"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Content Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={props.text?.contentColor || '#333333'}
                  onChange={(e) => updateProp(['text', 'contentColor'], e.target.value)}
                  className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={props.text?.contentColor || '#333333'}
                  onChange={(e) => updateProp(['text', 'contentColor'], e.target.value)}
                  className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

