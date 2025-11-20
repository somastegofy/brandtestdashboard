import React from 'react';
import { HeadingTextProps } from './types';

interface HeadingTextSettingsProps {
  props: HeadingTextProps;
  onPropsChange: (props: HeadingTextProps) => void;
}

export const HeadingTextSettings: React.FC<HeadingTextSettingsProps> = ({
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
      {/* Heading Settings */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Heading</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Heading Text
            </label>
            <input
              type="text"
              value={props.heading?.text || ''}
              onChange={(e) => updateProp(['heading', 'text'], e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your heading"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Heading Level
            </label>
            <select
              value={props.heading?.level || 'h2'}
              onChange={(e) => updateProp(['heading', 'level'], e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="h1">H1</option>
              <option value="h2">H2</option>
              <option value="h3">H3</option>
              <option value="h4">H4</option>
              <option value="h5">H5</option>
              <option value="h6">H6</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Font Size
              </label>
              <input
                type="text"
                value={props.heading?.fontSize || '2rem'}
                onChange={(e) => updateProp(['heading', 'fontSize'], e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="2rem"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Font Weight
              </label>
              <select
                value={props.heading?.fontWeight || 'bold'}
                onChange={(e) => updateProp(['heading', 'fontWeight'], e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
                <option value="600">Semibold</option>
                <option value="700">Bold</option>
                <option value="800">Extra Bold</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Text Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={props.heading?.color || '#000000'}
                onChange={(e) => updateProp(['heading', 'color'], e.target.value)}
                className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={props.heading?.color || '#000000'}
                onChange={(e) => updateProp(['heading', 'color'], e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Alignment
            </label>
            <select
              value={props.heading?.align || 'left'}
              onChange={(e) => updateProp(['heading', 'align'], e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Margin Bottom
            </label>
            <input
              type="text"
              value={props.heading?.marginBottom || props.spacing || '16px'}
              onChange={(e) => updateProp(['heading', 'marginBottom'], e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="16px"
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
                Font Size
              </label>
              <input
                type="text"
                value={props.text?.fontSize || '1rem'}
                onChange={(e) => updateProp(['text', 'fontSize'], e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1rem"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Font Weight
              </label>
              <select
                value={props.text?.fontWeight || 'normal'}
                onChange={(e) => updateProp(['text', 'fontWeight'], e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="normal">Normal</option>
                <option value="400">Regular</option>
                <option value="500">Medium</option>
                <option value="600">Semibold</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Text Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={props.text?.color || '#333333'}
                onChange={(e) => updateProp(['text', 'color'], e.target.value)}
                className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={props.text?.color || '#333333'}
                onChange={(e) => updateProp(['text', 'color'], e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Alignment
            </label>
            <select
              value={props.text?.align || 'left'}
              onChange={(e) => updateProp(['text', 'align'], e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
              <option value="justify">Justify</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Line Height
            </label>
            <input
              type="text"
              value={props.text?.lineHeight || '1.6'}
              onChange={(e) => updateProp(['text', 'lineHeight'], e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="1.6"
            />
          </div>
        </div>
      </div>

      {/* General Settings */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">General</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Overall Alignment
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

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Spacing Between Heading & Text
            </label>
            <input
              type="text"
              value={props.spacing || '16px'}
              onChange={(e) => onPropsChange({ ...props, spacing: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="16px"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

