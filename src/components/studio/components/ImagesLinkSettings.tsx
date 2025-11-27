import React from 'react';
import { ImagesLinkProps, ImageLinkItem } from './types';
import { Plus, Trash2, ChevronDown } from 'lucide-react';

const layoutViewOptions: Array<{
  value: ImagesLinkProps['layout'];
  label: string;
}> = [
  { value: 'grid', label: 'Grid' },
  { value: 'carousel', label: 'Slider' },
  { value: 'list', label: 'List' },
];

const contentDisplayOptions: Array<{
  value: NonNullable<ImagesLinkProps['contentDisplay']>;
  label: string;
}> = [
  { value: 'overlay', label: 'Overlay' },
  { value: 'below', label: 'Below Image' },
  { value: 'above', label: 'Above Image' },
];

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
  const itemsCount = props.items?.length || 0;

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
      {/* Card Content */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Card Content</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={props.cardTitle || ''}
              onChange={(e) => updateProp('cardTitle', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Explore More"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={props.cardDescription || ''}
              onChange={(e) => updateProp('cardDescription', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
              placeholder="Add a short description for this block"
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

          {(props.showTitles || props.showDescriptions) && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-700">Content Display</p>
              <div className="grid grid-cols-3 gap-2">
                {contentDisplayOptions.map((option) => {
                  const isActive = (props.contentDisplay || 'overlay') === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateProp('contentDisplay', option.value)}
                      className={`flex flex-col items-center rounded-xl border px-3 py-2 text-xs font-medium transition ${
                        isActive ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <div className="w-full h-12 rounded-lg bg-gray-100 relative overflow-hidden mb-1">
                        {option.value === 'overlay' && (
                          <div className="absolute inset-x-1 bottom-1 h-3 rounded bg-gray-800"></div>
                        )}
                        {option.value === 'below' && (
                          <>
                            <div className="absolute inset-x-1 top-1 h-8 rounded bg-gray-200" />
                            <div className="absolute inset-x-2 bottom-1 h-2 rounded bg-gray-400" />
                          </>
                        )}
                        {option.value === 'above' && (
                          <>
                            <div className="absolute inset-x-2 top-1 h-2 rounded bg-gray-400" />
                            <div className="absolute inset-x-1 bottom-1 h-8 rounded bg-gray-200" />
                          </>
                        )}
                      </div>
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
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

        {/* Layout Settings - Only show if more than 1 image */}
        {itemsCount > 1 && (
          <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Layout</h4>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-gray-700 mb-2">View Type</p>
                <div className="grid grid-cols-3 gap-2">
                  {layoutViewOptions.map((option) => {
                    const isActive = (props.layout || 'grid') === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => updateProp('layout', option.value)}
                        className={`flex flex-col items-center rounded-xl border px-3 py-2 text-xs font-medium transition relative ${
                          isActive ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {isActive && (
                          <div className="absolute top-1 right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                        <div className="w-full h-10 rounded-lg bg-gray-100 relative overflow-hidden mb-1">
                          {option.value === 'list' && (
                            <div className="absolute inset-x-2 top-2 space-y-1">
                              <div className="h-1.5 rounded bg-gray-400"></div>
                              <div className="h-1.5 rounded bg-gray-400"></div>
                              <div className="h-1.5 rounded bg-gray-400"></div>
                            </div>
                          )}
                          {option.value === 'grid' && (
                            <div className="absolute inset-1 grid grid-cols-2 gap-1">
                              <div className="rounded bg-gray-300"></div>
                              <div className="rounded bg-gray-300"></div>
                              <div className="rounded bg-gray-300"></div>
                              <div className="rounded bg-gray-300"></div>
                            </div>
                          )}
                          {option.value === 'carousel' && (
                            <>
                              <div className="absolute inset-x-1 top-1 h-6 rounded bg-gray-300"></div>
                              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                              </div>
                            </>
                          )}
                        </div>
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {props.layout === 'grid' && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Columns: {props.columns || 3}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="4"
                    value={props.columns || 3}
                    onChange={(e) => updateProp('columns', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {(props.items || []).map((item, index) => {
            const imageId = item.id || `image-${index}`;
            const label = item.title?.trim() || item.alt || `Image ${index + 1}`;

            return (
              <details
                key={imageId}
                className="group rounded-2xl border border-gray-200 bg-white shadow-sm"
                open={index === 0}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 [&::-webkit-details-marker]:hidden">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-700">
                      {index + 1}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-800 truncate max-w-[180px]">
                        {label}
                      </span>
                      {item.imageUrl && (
                        <span className="text-[11px] text-gray-400 truncate max-w-[200px]">
                          {item.imageUrl}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeImageItem(index);
                      }}
                      className="rounded-full p-1.5 text-red-600 hover:bg-red-50"
                      title="Remove image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ChevronDown className="h-4 w-4 text-gray-500 transition group-open:rotate-180" />
                  </div>
                </summary>

                <div className="space-y-3 border-t border-gray-100 px-4 py-4">
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
              </details>
            );
          })}
        </div>
      </div>
    </div>
  );
};

