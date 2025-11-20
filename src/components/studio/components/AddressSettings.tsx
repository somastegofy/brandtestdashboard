import React from 'react';
import { AddressProps } from './types';

interface AddressSettingsProps {
  props: AddressProps;
  onPropsChange: (props: AddressProps) => void;
}

export const AddressSettings: React.FC<AddressSettingsProps> = ({
  props,
  onPropsChange
}) => {
  const updateProp = (key: keyof AddressProps, value: any) => {
    onPropsChange({ ...props, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Address Details */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Address Details</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Street Address
            </label>
            <input
              type="text"
              value={props.street || ''}
              onChange={(e) => updateProp('street', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="123 Main Street"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                value={props.city || ''}
                onChange={(e) => updateProp('city', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="City"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                value={props.state || ''}
                onChange={(e) => updateProp('state', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="State"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                ZIP Code
              </label>
              <input
                type="text"
                value={props.zipCode || ''}
                onChange={(e) => updateProp('zipCode', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="12345"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                value={props.country || ''}
                onChange={(e) => updateProp('country', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Country"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Contact Information</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={props.phone || ''}
              onChange={(e) => updateProp('phone', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={props.email || ''}
              onChange={(e) => updateProp('email', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="info@example.com"
            />
          </div>
        </div>
      </div>

      {/* Format Settings */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Format Settings</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Format
            </label>
            <select
              value={props.format || 'multi-line'}
              onChange={(e) => updateProp('format', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="single-line">Single Line</option>
              <option value="multi-line">Multi Line</option>
              <option value="labeled">Labeled</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Alignment
            </label>
            <select
              value={props.alignment || 'left'}
              onChange={(e) => updateProp('alignment', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>
      </div>

      {/* Typography */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Typography</h4>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Font Size
              </label>
              <input
                type="text"
                value={props.fontSize || '1rem'}
                onChange={(e) => updateProp('fontSize', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1rem"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Line Height
              </label>
              <input
                type="text"
                value={props.lineHeight || '1.6'}
                onChange={(e) => updateProp('lineHeight', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1.6"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Line Spacing
            </label>
            <input
              type="text"
              value={props.spacing || '8px'}
              onChange={(e) => updateProp('spacing', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="8px"
            />
          </div>
        </div>
      </div>

      {/* Icon Settings */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Icons</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-700">Show Icons</label>
            <input
              type="checkbox"
              checked={props.showIcons || false}
              onChange={(e) => updateProp('showIcons', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>

          {props.showIcons && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Icon Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={props.iconColor || '#6b7280'}
                  onChange={(e) => updateProp('iconColor', e.target.value)}
                  className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={props.iconColor || '#6b7280'}
                  onChange={(e) => updateProp('iconColor', e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

