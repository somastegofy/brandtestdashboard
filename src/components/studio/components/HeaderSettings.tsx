import React, { useId } from 'react';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { HeaderProps, HeaderLogoTextArrangement } from './types';

interface HeaderSettingsProps {
  props: HeaderProps;
  onPropsChange: (props: HeaderProps) => void;
}

export const HeaderSettings: React.FC<HeaderSettingsProps> = ({
  props,
  onPropsChange
}) => {
  const componentId = useId();
  const textContentId = `${componentId}-text-content`;
  const logoUrlId = `${componentId}-logo-url`;
  const logoAltId = `${componentId}-logo-alt`;
  const logoLinkId = `${componentId}-logo-link`;
  const minHeightId = `${componentId}-min-height`;

  const fontWeightOptions = [
    { value: '400', label: 'Regular', short: 'Rg' },
    { value: '500', label: 'Medium', short: 'Md' },
    { value: '600', label: 'Semi', short: 'Sb' },
    { value: '700', label: 'Bold', short: 'Bd' }
  ];

  const alignmentOptions: Array<{ value: 'left' | 'center' | 'right'; label: string; icon: React.ReactNode }> = [
    { value: 'left', label: 'Left', icon: <AlignLeft className="w-4 h-4" /> },
    { value: 'center', label: 'Center', icon: <AlignCenter className="w-4 h-4" /> },
    { value: 'right', label: 'Right', icon: <AlignRight className="w-4 h-4" /> }
  ];

  const textTransformOptions = [
    { value: 'none', label: 'Aa' },
    { value: 'uppercase', label: 'AA' },
    { value: 'lowercase', label: 'aa' },
    { value: 'capitalize', label: 'Aa+' }
  ];

  const arrangementOptions: Array<{
    value: HeaderLogoTextArrangement;
    label: string;
    layout: 'vertical' | 'horizontal';
    order: Array<'logo' | 'text'>;
  }> = [
    { value: 'top_bottom', label: 'Top + Bottom', layout: 'vertical', order: ['logo', 'text'] },
    { value: 'bottom_top', label: 'Bottom + Top', layout: 'vertical', order: ['text', 'logo'] },
    { value: 'left_right', label: 'Left + Right', layout: 'horizontal', order: ['logo', 'text'] },
    { value: 'right_left', label: 'Right + Left', layout: 'horizontal', order: ['text', 'logo'] }
  ];

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
                <label htmlFor={textContentId} className="block text-xs font-medium text-gray-700 mb-1">
                  Text Content
                </label>
                <input
                  id={textContentId}
                  type="text"
                  value={props.text?.content || ''}
                  onChange={(e) => updateProp(['text', 'content'], e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter header text"
                />
              </div>

          <div>
            <p className="text-xs font-medium text-gray-700 mb-1">
              Font Weight
            </p>
            <div className="grid grid-cols-4 gap-2">
              {fontWeightOptions.map((option) => {
                const isActive = (props.text?.fontWeight || '600') === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateProp(['text', 'fontWeight'], option.value)}
                    className={`flex flex-col items-center justify-center rounded-lg border px-2 py-2 text-xs font-medium transition ${
                      isActive ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
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
            <p className="text-xs font-medium text-gray-700 mb-1">
              Alignment
            </p>
            <div className="grid grid-cols-3 gap-2">
              {alignmentOptions.map((option) => {
                const isActive = (props.text?.align || 'center') === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateProp(['text', 'align'], option.value)}
                    className={`flex flex-col items-center rounded-lg border px-3 py-2 text-xs font-medium transition ${
                      isActive ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                    title={option.label}
                  >
                    {option.icon}
                    <span className="mt-1">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-700 mb-1">
              Text Transform
            </p>
            <div className="grid grid-cols-4 gap-2">
              {textTransformOptions.map((option) => {
                const isActive = (props.text?.textTransform || 'none') === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateProp(['text', 'textTransform'], option.value)}
                    className={`flex items-center justify-center rounded-lg border px-2 py-2 text-sm font-semibold transition ${
                      isActive ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
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
                <label htmlFor={logoUrlId} className="block text-xs font-medium text-gray-700 mb-1">
                  Logo URL
                </label>
                <input
                  id={logoUrlId}
                  type="text"
                  value={props.logo?.src || ''}
                  onChange={(e) => updateProp(['logo', 'src'], e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/logo.png"
                />
                <p className="mt-1 text-xs text-gray-500">A placeholder logo is shown if this field is empty.</p>
              </div>

              <div>
                <label htmlFor={logoAltId} className="block text-xs font-medium text-gray-700 mb-1">
                  Alt Text
                </label>
                <input
                  id={logoAltId}
                  type="text"
                  value={props.logo?.alt || ''}
                  onChange={(e) => updateProp(['logo', 'alt'], e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor={logoLinkId} className="block text-xs font-medium text-gray-700 mb-1">
                  Logo Link (Optional)
                </label>
                <input
                  id={logoLinkId}
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

      {/* Arrangement */}
      {(props.logo?.enabled && props.text?.enabled) && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Logo & Text Arrangement</h4>
          <div className="grid grid-cols-2 gap-3">
            {arrangementOptions.map((option) => {
              const isActive = (props.layout?.logoTextArrangement || 'left_right') === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateProp(['layout', 'logoTextArrangement'], option.value)}
                  className={`flex flex-col items-center rounded-lg border px-3 py-2 text-xs font-medium transition ${
                    isActive ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <div
                    className={`mb-2 flex h-10 w-full overflow-hidden rounded-md border ${
                      isActive ? 'border-blue-300 bg-blue-100/70' : 'border-gray-200 bg-gray-50'
                    } ${option.layout === 'vertical' ? 'flex-col' : 'flex-row'}`}
                  >
                    {option.order.map((item, idx) => (
                      <span
                        key={`${option.value}-${item}-${idx}`}
                        className={`flex-1 ${item === 'logo' ? 'bg-white' : 'bg-gray-100'} flex items-center justify-center text-[10px] font-semibold uppercase tracking-wide`}
                      >
                        {item === 'logo' ? 'Logo' : 'Text'}
                      </span>
                    ))}
                  </div>
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Layout Settings */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Behavior</h4>
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
            <label htmlFor={minHeightId} className="block text-xs font-medium text-gray-700 mb-1">
              Minimum Height
            </label>
            <input
              id={minHeightId}
              type="text"
              value={props.height || '80px'}
              onChange={(e) => updateProp(['height'], e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="80px"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

