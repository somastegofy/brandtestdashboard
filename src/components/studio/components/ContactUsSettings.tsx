import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { ContactUsProps } from './types';

interface ContactUsSettingsProps {
  props: ContactUsProps;
  onPropsChange: (props: ContactUsProps) => void;
}

export const ContactUsSettings: React.FC<ContactUsSettingsProps> = ({
  props,
  onPropsChange
}) => {
  const updateProp = (key: keyof ContactUsProps, value: any) => {
    onPropsChange({ ...props, [key]: value });
  };

  const updateField = (index: number, key: keyof ContactUsProps['fields'][0], value: any) => {
    const newFields = [...(props.fields || [])];
    newFields[index] = { ...newFields[index], [key]: value };
    updateProp('fields', newFields);
  };

  const addField = () => {
    const newFields = [...(props.fields || []), {
      id: `field-${Date.now()}`,
      type: 'text' as const,
      label: 'New Field',
      placeholder: '',
      required: false
    }];
    updateProp('fields', newFields);
  };

  const removeField = (index: number) => {
    const newFields = [...(props.fields || [])];
    newFields.splice(index, 1);
    updateProp('fields', newFields);
  };

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">General</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={props.title || ''}
              onChange={(e) => updateProp('title', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Contact Us"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Subtitle
            </label>
            <input
              type="text"
              value={props.subtitle || ''}
              onChange={(e) => updateProp('subtitle', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Get in touch with us"
            />
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

      {/* Styling */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Styling</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Background Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={props.backgroundColor || '#ffffff'}
                onChange={(e) => updateProp('backgroundColor', e.target.value)}
                className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={props.backgroundColor || '#ffffff'}
                onChange={(e) => updateProp('backgroundColor', e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
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

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Padding
              </label>
              <input
                type="text"
                value={props.padding || '24px'}
                onChange={(e) => updateProp('padding', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="24px"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Button Settings */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Button</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Button Text
            </label>
            <input
              type="text"
              value={props.buttonText || 'Submit'}
              onChange={(e) => updateProp('buttonText', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Submit"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Button Style
            </label>
            <select
              value={props.buttonStyle || 'primary'}
              onChange={(e) => updateProp('buttonStyle', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="outline">Outline</option>
            </select>
          </div>
        </div>
      </div>

      {/* Form Settings */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Form Settings</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Form Action URL (Optional)
            </label>
            <input
              type="text"
              value={props.formAction || ''}
              onChange={(e) => updateProp('formAction', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="/api/contact"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Form Method
            </label>
            <select
              value={props.formMethod || 'post'}
              onChange={(e) => updateProp('formMethod', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="post">POST</option>
              <option value="get">GET</option>
            </select>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-900">Form Fields</h4>
          <button
            onClick={addField}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Field
          </button>
        </div>

        <div className="space-y-4">
          {(props.fields || []).map((field, index) => (
            <div key={field.id} className="p-4 border border-gray-200 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Field {index + 1}</span>
                <button
                  onClick={() => removeField(index)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Remove field"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Field Type
                </label>
                <select
                  value={field.type || 'text'}
                  onChange={(e) => updateField(index, 'type', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="text">Text</option>
                  <option value="email">Email</option>
                  <option value="tel">Phone</option>
                  <option value="textarea">Textarea</option>
                  <option value="select">Select</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Label *
                </label>
                <input
                  type="text"
                  value={field.label || ''}
                  onChange={(e) => updateField(index, 'label', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Field label"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Placeholder
                </label>
                <input
                  type="text"
                  value={field.placeholder || ''}
                  onChange={(e) => updateField(index, 'placeholder', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Placeholder text"
                />
              </div>

              {field.type === 'select' && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Options (one per line)
                  </label>
                  <textarea
                    value={(field.options || []).join('\n')}
                    onChange={(e) => {
                      const options = e.target.value.split('\n').filter(o => o.trim());
                      updateField(index, 'options', options);
                    }}
                    rows={4}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Option 1&#10;Option 2&#10;Option 3"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-700">Required</label>
                <input
                  type="checkbox"
                  checked={field.required || false}
                  onChange={(e) => updateField(index, 'required', e.target.checked)}
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

