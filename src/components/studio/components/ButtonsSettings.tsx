import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { ButtonsProps } from './types';

interface ButtonsSettingsProps {
  props: ButtonsProps;
  onPropsChange: (props: ButtonsProps) => void;
}

export const ButtonsSettings: React.FC<ButtonsSettingsProps> = ({
  props,
  onPropsChange
}) => {
  const updateProp = (key: keyof ButtonsProps, value: any) => {
    onPropsChange({ ...props, [key]: value });
  };

  const updateButton = (index: number, key: keyof ButtonsProps['buttons'][0], value: any) => {
    const newButtons = [...(props.buttons || [])];
    newButtons[index] = { ...newButtons[index], [key]: value };
    updateProp('buttons', newButtons);
  };

  const addButton = () => {
    const newButtons = [...(props.buttons || []), {
      text: 'New Button',
      link: '',
      style: 'primary',
      size: props.size || 'medium',
      backgroundColor: '#3b82f6',
      textColor: '#ffffff',
      borderRadius: '6px',
      fontWeight: '500',
      disabled: false,
      openInNewTab: false,
      type: 'button',
      icon: '',
      iconPosition: 'left',
      hoverBackgroundColor: '',
      hoverTextColor: '',
      borderColor: '',
      borderWidth: ''
    }];
    updateProp('buttons', newButtons);
  };

  const removeButton = (index: number) => {
    const newButtons = [...(props.buttons || [])];
    newButtons.splice(index, 1);
    updateProp('buttons', newButtons);
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
              <option value="space-between">Space Between</option>
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
              Default Size
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

          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-700">Full Width Buttons</label>
            <input
              type="checkbox"
              checked={props.fullWidth || false}
              onChange={(e) => updateProp('fullWidth', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Buttons List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-900">Buttons</h4>
          <button
            onClick={addButton}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Button
          </button>
        </div>

        <div className="space-y-4">
          {(props.buttons || []).map((button, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Button {index + 1}</span>
                <button
                  onClick={() => removeButton(index)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Remove button"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Button Text *
                </label>
                <input
                  type="text"
                  value={button.text || ''}
                  onChange={(e) => updateButton(index, 'text', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Button Text"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Link URL
                </label>
                <input
                  type="text"
                  value={button.link || ''}
                  onChange={(e) => updateButton(index, 'link', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>

              {button.link && (
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-700">Open in New Tab</label>
                  <input
                    type="checkbox"
                    checked={button.openInNewTab || false}
                    onChange={(e) => updateButton(index, 'openInNewTab', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Style
                </label>
                <select
                  value={button.style || 'primary'}
                  onChange={(e) => updateButton(index, 'style', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                  <option value="outline">Outline</option>
                  <option value="text">Text</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              {button.style === 'custom' && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Background Color
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={button.backgroundColor || '#3b82f6'}
                          onChange={(e) => updateButton(index, 'backgroundColor', e.target.value)}
                          className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={button.backgroundColor || '#3b82f6'}
                          onChange={(e) => updateButton(index, 'backgroundColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Text Color
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={button.textColor || '#ffffff'}
                          onChange={(e) => updateButton(index, 'textColor', e.target.value)}
                          className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={button.textColor || '#ffffff'}
                          onChange={(e) => updateButton(index, 'textColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Border Width
                    </label>
                    <input
                      type="text"
                      value={button.borderWidth || ''}
                      onChange={(e) => updateButton(index, 'borderWidth', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="2px"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Border Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={button.borderColor || ''}
                        onChange={(e) => updateButton(index, 'borderColor', e.target.value)}
                        className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={button.borderColor || ''}
                        onChange={(e) => updateButton(index, 'borderColor', e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </>
              )}

              {(button.style === 'primary' || button.style === 'secondary') && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Background Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={button.backgroundColor || '#3b82f6'}
                        onChange={(e) => updateButton(index, 'backgroundColor', e.target.value)}
                        className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={button.backgroundColor || '#3b82f6'}
                        onChange={(e) => updateButton(index, 'backgroundColor', e.target.value)}
                        className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Text Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={button.textColor || '#ffffff'}
                        onChange={(e) => updateButton(index, 'textColor', e.target.value)}
                        className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={button.textColor || '#ffffff'}
                        onChange={(e) => updateButton(index, 'textColor', e.target.value)}
                        className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {(button.style === 'outline' || button.style === 'text') && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Text Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={button.textColor || '#3b82f6'}
                      onChange={(e) => updateButton(index, 'textColor', e.target.value)}
                      className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={button.textColor || '#3b82f6'}
                      onChange={(e) => updateButton(index, 'textColor', e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {button.style === 'outline' && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Border Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={button.borderColor || button.textColor || '#3b82f6'}
                      onChange={(e) => updateButton(index, 'borderColor', e.target.value)}
                      className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={button.borderColor || button.textColor || '#3b82f6'}
                      onChange={(e) => updateButton(index, 'borderColor', e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Border Radius
                </label>
                <input
                  type="text"
                  value={button.borderRadius || '6px'}
                  onChange={(e) => updateButton(index, 'borderRadius', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="6px"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Font Weight
                </label>
                <select
                  value={button.fontWeight || '500'}
                  onChange={(e) => updateButton(index, 'fontWeight', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="400">Normal</option>
                  <option value="500">Medium</option>
                  <option value="600">Semibold</option>
                  <option value="700">Bold</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-700">Disabled</label>
                <input
                  type="checkbox"
                  checked={button.disabled || false}
                  onChange={(e) => updateButton(index, 'disabled', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

