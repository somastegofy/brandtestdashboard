import React, { useId } from 'react';
import { AlignCenter, AlignJustify, AlignLeft, AlignRight } from 'lucide-react';
import { HeadingTextProps, HeadingTextSpacing } from './types';
import { RichTextEditor } from './RichTextEditor';

interface HeadingTextSettingsProps {
  props: HeadingTextProps;
  onPropsChange: (props: HeadingTextProps) => void;
}

const headingLevels: Array<{ value: HeadingTextProps['heading']['level']; label: string }> = [
  { value: 'h1', label: 'H1' },
  { value: 'h2', label: 'H2' },
  { value: 'h3', label: 'H3' },
  { value: 'h4', label: 'H4' },
  { value: 'h5', label: 'H5' },
  { value: 'h6', label: 'H6' }
];

const headingWeightOptions = [
  { value: '400', label: 'Regular', short: 'Rg' },
  { value: '500', label: 'Medium', short: 'Md' },
  { value: '600', label: 'Semi', short: 'Sb' },
  { value: '700', label: 'Bold', short: 'Bd' },
  { value: '800', label: 'Extra', short: 'Ex' }
];

const bodyWeightOptions = [
  { value: '400', label: 'Regular', short: 'Rg' },
  { value: '500', label: 'Medium', short: 'Md' },
  { value: '600', label: 'Semi', short: 'Sb' }
];

const alignmentOptions = [
  { value: 'left', label: 'Left', icon: <AlignLeft className="w-4 h-4" /> },
  { value: 'center', label: 'Center', icon: <AlignCenter className="w-4 h-4" /> },
  { value: 'right', label: 'Right', icon: <AlignRight className="w-4 h-4" /> }
];

const bodyAlignmentOptions = [
  ...alignmentOptions,
  { value: 'justify', label: 'Justify', icon: <AlignJustify className="w-4 h-4" /> }
];

const textTransformOptions = [
  { value: 'none', label: 'Aa' },
  { value: 'uppercase', label: 'AA' },
  { value: 'lowercase', label: 'aa' },
  { value: 'capitalize', label: 'Aa+' }
];

const spacingOptions: Array<{ value: HeadingTextSpacing; label: string; helper: string }> = [
  { value: 'compact', label: 'Compact', helper: 'Tighter gap' },
  { value: 'comfortable', label: 'Comfort', helper: 'Balanced' },
  { value: 'relaxed', label: 'Relaxed', helper: 'Roomy spacing' }
];

export const HeadingTextSettings: React.FC<HeadingTextSettingsProps> = ({
  props,
  onPropsChange
}) => {
  const headingInputId = useId();
  const bodyInputId = useId();

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
        <div className="space-y-4">
          <div>
            <label htmlFor={headingInputId} className="block text-xs font-medium text-gray-700 mb-1">
              Heading Text
            </label>
            <RichTextEditor
              value={props.heading?.text || ''}
              onChange={(html) => updateProp(['heading', 'text'], html)}
              placeholder="Your heading"
            />
          </div>

          <div>
            <p className="text-xs font-medium text-gray-700 mb-2">Heading Level</p>
            <div className="grid grid-cols-6 gap-2">
              {headingLevels.map((level) => {
                const isActive = (props.heading?.level || 'h2') === level.value;
                return (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => updateProp(['heading', 'level'], level.value)}
                    className={`rounded-lg border px-2 py-1 text-xs font-semibold tracking-wide transition ${
                      isActive ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {level.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-700 mb-2">Font Weight</p>
            <div className="grid grid-cols-5 gap-2">
              {headingWeightOptions.map((option) => {
                const isActive = (props.heading?.fontWeight || '600') === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateProp(['heading', 'fontWeight'], option.value)}
                    className={`flex flex-col items-center justify-center rounded-lg border px-2 py-2 text-[11px] font-medium transition ${
                      isActive ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-sm font-semibold">{option.short}</span>
                    <span className="uppercase tracking-wide text-[9px]">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-700 mb-1">Alignment</p>
            <div className="grid grid-cols-3 gap-2">
              {alignmentOptions.map((option) => {
                const isActive = (props.heading?.align || props.alignment || 'left') === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateProp(['heading', 'align'], option.value)}
                    className={`flex flex-col items-center rounded-lg border px-3 py-2 text-xs font-medium transition ${
                      isActive ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover-border-gray-300'
                    }`}
                  >
                    {option.icon}
                    <span className="mt-1">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-700 mb-1">Text Transform</p>
            <div className="grid grid-cols-4 gap-2">
              {textTransformOptions.map((option) => {
                const isActive = (props.heading?.textTransform || 'none') === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateProp(['heading', 'textTransform'], option.value)}
                    className={`flex items-center justify-center rounded-lg border px-2 py-2 text-sm font-semibold transition ${
                      isActive ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover-border-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Text Settings */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Body Text</h4>
        <div className="space-y-4">
          <div>
            <label htmlFor={bodyInputId} className="block text-xs font-medium text-gray-700 mb-1">
              Text Content
            </label>
            <RichTextEditor
              value={props.text?.content || ''}
              onChange={(html) => updateProp(['text', 'content'], html)}
              placeholder="Your text content"
              className="min-h-[120px]"
            />
          </div>

          <div>
            <p className="text-xs font-medium text-gray-700 mb-1">Font Weight</p>
            <div className="grid grid-cols-3 gap-2">
              {bodyWeightOptions.map((option) => {
                const isActive = (props.text?.fontWeight || '400') === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateProp(['text', 'fontWeight'], option.value)}
                    className={`flex flex-col items-center justify-center rounded-lg border px-2 py-2 text-xs font-medium transition ${
                      isActive ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover-border-gray-300'
                    }`}
                  >
                    <span className="text-sm font-semibold">{option.short}</span>
                    <span className="text-[10px] uppercase tracking-wide">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-700 mb-1">Alignment</p>
            <div className="grid grid-cols-4 gap-2">
              {bodyAlignmentOptions.map((option) => {
                const isActive = (props.text?.align || props.alignment || 'left') === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateProp(['text', 'align'], option.value)}
                    className={`flex flex-col items-center rounded-lg border px-3 py-2 text-xs font-medium transition ${
                      isActive ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover-border-gray-300'
                    }`}
                  >
                    {option.icon}
                    <span className="mt-1">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* General Settings */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Layout</h4>
        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium text-gray-700 mb-1">Overall Alignment</p>
            <div className="grid grid-cols-3 gap-2">
              {alignmentOptions.map((option) => {
                const isActive = (props.alignment || 'left') === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onPropsChange({ ...props, alignment: option.value as any })}
                    className={`flex flex-col items-center rounded-lg border px-3 py-2 text-xs font-medium transition ${
                      isActive ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover-border-gray-300'
                    }`}
                  >
                    {option.icon}
                    <span className="mt-1">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-700 mb-1">Spacing Between Heading & Text</p>
            <div className="grid grid-cols-3 gap-2">
              {spacingOptions.map((option) => {
                const isActive = (props.spacing || 'comfortable') === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onPropsChange({ ...props, spacing: option.value as HeadingTextSpacing })}
                    className={`rounded-lg border px-3 py-2 text-xs transition ${
                      isActive ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover-border-gray-300'
                    }`}
                  >
                    <span className="font-semibold">{option.label}</span>
                    <span className="text-[10px] block">{option.helper}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

