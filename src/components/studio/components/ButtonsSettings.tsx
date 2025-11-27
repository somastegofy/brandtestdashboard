import React from 'react';
import { ChevronDown, Trash2 } from 'lucide-react';
import { ButtonsProps } from './types';

interface ButtonsSettingsProps {
  props: ButtonsProps;
  onPropsChange: (props: ButtonsProps) => void;
}

const BUTTON_TEXT_PRESETS = ['Scan Me', 'Read More', 'Know More', 'Visit Us', 'Contact Us', 'Book Now'];

const CTA_FONT_WEIGHTS = [
  { value: '400', label: 'Rg' },
  { value: '500', label: 'Md' },
  { value: '600', label: 'Sb' },
  { value: '700', label: 'Bd' },
];

const TITLE_FONT_WEIGHTS = [
  { value: '400', label: 'Rg' },
  { value: '500', label: 'Md' },
  { value: '600', label: 'Sb' },
  { value: '700', label: 'Bd' },
];

const DESCRIPTION_FONT_WEIGHTS = [
  { value: '400', label: 'Rg' },
  { value: '500', label: 'Md' },
  { value: '600', label: 'Sb' },
];

const ALIGNMENT_OPTIONS = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
];

const DESCRIPTION_ALIGNMENT_OPTIONS = [
  ...ALIGNMENT_OPTIONS,
  { value: 'justify', label: 'Justify' },
];

const MIN_BUTTONS = 1;
const MAX_BUTTONS = 6;

const generateButtonId = () => `button-${Math.random().toString(36).slice(2, 8)}-${Date.now()}`;

const createButton = (): ButtonsProps['buttons'][0] => ({
  id: generateButtonId(),
  text: BUTTON_TEXT_PRESETS[0],
  title: '',
  description: '',
  link: '',
  style: 'normal',
  rounded: true,
  fontWeight: '500',
  disabled: false,
  openInNewTab: false,
  type: 'button',
  icon: '',
  iconPosition: 'left',
  titleAlign: 'left',
  titleFontWeight: '600',
  descriptionAlign: 'left',
  descriptionFontWeight: '400',
});

export const ButtonsSettings: React.FC<ButtonsSettingsProps> = ({ props, onPropsChange }) => {
  const updateProp = (key: keyof ButtonsProps, value: any) => {
    onPropsChange({ ...props, [key]: value });
  };

  const buttons = props.buttons?.length ? props.buttons : [createButton()];
  const buttonCount = buttons.length;

  const updateButton = (index: number, key: keyof ButtonsProps['buttons'][0], value: any) => {
    const next = [...buttons];
    next[index] = { ...next[index], [key]: value };
    updateProp('buttons', next);
  };

  const handleAdjustButtonCount = (delta: number) => {
    const nextCount = Math.min(MAX_BUTTONS, Math.max(MIN_BUTTONS, buttonCount + delta));
    if (nextCount === buttonCount) return;

    if (nextCount > buttonCount) {
      const additions = Array.from({ length: nextCount - buttonCount }, () => createButton());
      updateProp('buttons', [...buttons, ...additions]);
    } else {
      updateProp('buttons', buttons.slice(0, nextCount));
    }
  };

  const removeButton = (index: number) => {
    if (buttonCount <= MIN_BUTTONS) return;
    const next = [...buttons];
    next.splice(index, 1);
    updateProp('buttons', next);
  };

  const renderWeightButtons = (
    options: { value: string; label: string }[],
    currentValue: string | undefined,
    onSelect: (value: string) => void
  ) => (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = currentValue === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
              isActive ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );

  const renderAlignmentButtons = (
    options: { value: string; label: string }[],
    currentValue: string | undefined,
    onSelect: (value: string) => void
  ) => (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = currentValue === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
              isActive ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Layout Settings */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Layout</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Layout Type</label>
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
            <label className="block text-xs font-medium text-gray-700 mb-1">Alignment</label>
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
            <label className="block text-xs font-medium text-gray-700 mb-1">Default Size</label>
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
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <h4 className="text-sm font-medium text-gray-900">Buttons</h4>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Total Buttons</span>
            <div className="flex items-center rounded-full border border-gray-200">
              <button
                type="button"
                onClick={() => handleAdjustButtonCount(-1)}
                className="px-3 py-1 text-lg font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                disabled={buttonCount <= MIN_BUTTONS}
                aria-label="Remove button"
              >
                –
              </button>
              <span className="px-4 text-sm font-semibold text-gray-900">{buttonCount}</span>
              <button
                type="button"
                onClick={() => handleAdjustButtonCount(1)}
                className="px-3 py-1 text-lg font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                disabled={buttonCount >= MAX_BUTTONS}
                aria-label="Add button"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {buttons.map((button, index) => {
            const buttonId = button.id || `button-${index}`;
            const resolvedStyle = button.style === 'outline' ? 'outline' : 'normal';
            return (
              <details key={buttonId} className="group rounded-2xl border border-gray-200 bg-white shadow-sm" open={index === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 [&::-webkit-details-marker]:hidden">
                  <span className="text-sm font-medium text-gray-800">Button {index + 1}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeButton(index);
                      }}
                      className="rounded-full p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-40"
                      disabled={buttonCount <= MIN_BUTTONS}
                      title="Remove button"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ChevronDown className="h-4 w-4 text-gray-500 transition group-open:rotate-180" />
                  </div>
                </summary>

                <div className="space-y-4 border-t border-gray-100 px-4 py-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Button Text *</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {BUTTON_TEXT_PRESETS.map((preset) => {
                        const isActive = button.text === preset;
                        return (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => updateButton(index, 'text', preset)}
                            className={`px-3 py-1.5 rounded-full border text-xs font-medium transition ${
                              isActive
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                            }`}
                          >
                            {preset}
                          </button>
                        );
                      })}
                    </div>
                    <input
                      type="text"
                      value={button.text || ''}
                      onChange={(e) => updateButton(index, 'text', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Custom button text"
                    />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Title (Optional)</label>
                      <input
                        type="text"
                        value={button.title || ''}
                        onChange={(e) => updateButton(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Add a small title above the button"
                      />
                    </div>
                    {!!button.title?.trim() && (
                      <div className="flex flex-wrap gap-4">
                        <div>
                          <p className="text-[11px] font-semibold uppercase text-gray-500 mb-1">Title Alignment</p>
                          {renderAlignmentButtons(ALIGNMENT_OPTIONS, button.titleAlign || 'left', (value) =>
                            updateButton(index, 'titleAlign', value)
                          )}
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase text-gray-500 mb-1">Title Font Weight</p>
                          {renderWeightButtons(TITLE_FONT_WEIGHTS, button.titleFontWeight || '600', (value) =>
                            updateButton(index, 'titleFontWeight', value)
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Description (Optional)</label>
                      <textarea
                        value={button.description || ''}
                        onChange={(e) => updateButton(index, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Add supporting text below the button"
                      />
                    </div>
                    {!!button.description?.trim() && (
                      <div className="flex flex-wrap gap-4">
                        <div>
                          <p className="text-[11px] font-semibold uppercase text-gray-500 mb-1">Description Alignment</p>
                          {renderAlignmentButtons(
                            DESCRIPTION_ALIGNMENT_OPTIONS,
                            button.descriptionAlign || 'left',
                            (value) => updateButton(index, 'descriptionAlign', value)
                          )}
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase text-gray-500 mb-1">Description Font Weight</p>
                          {renderWeightButtons(
                            DESCRIPTION_FONT_WEIGHTS,
                            button.descriptionFontWeight || '400',
                            (value) => updateButton(index, 'descriptionFontWeight', value)
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Link URL</label>
                      <input
                        type="text"
                        value={button.link || ''}
                        onChange={(e) => updateButton(index, 'link', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://example.com"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-700">Open in new tab</span>
                      <input
                        type="checkbox"
                        checked={button.openInNewTab || false}
                        onChange={(e) => updateButton(index, 'openInNewTab', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Button Style</label>
                      <select
                        value={resolvedStyle}
                        onChange={(e) => updateButton(index, 'style', e.target.value as 'normal' | 'outline')}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="normal">Normal (primary)</option>
                        <option value="outline">Outline</option>
                      </select>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Button Font Weight</p>
                      {renderWeightButtons(CTA_FONT_WEIGHTS, button.fontWeight || '500', (value) =>
                        updateButton(index, 'fontWeight', value)
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700">Rounded Corners (25px)</span>
                    <input
                      type="checkbox"
                      checked={button.rounded !== false}
                      onChange={(e) => updateButton(index, 'rounded', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700">Disable Button</span>
                    <input
                      type="checkbox"
                      checked={button.disabled || false}
                      onChange={(e) => updateButton(index, 'disabled', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      </div>
    </div>
  );
};

