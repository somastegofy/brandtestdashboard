import React from 'react';
import { GalleryProps, GalleryImage } from './types';
import { Plus, Trash2, Upload } from 'lucide-react';

interface GallerySettingsProps {
  props: GalleryProps;
  onPropsChange: (props: GalleryProps) => void;
}

const createImage = (): GalleryImage => ({
  id: `gallery-${Date.now()}`,
  url: '',
  title: '',
  description: '',
  alt: ''
});

export const GallerySettings: React.FC<GallerySettingsProps> = ({
  props,
  onPropsChange
}) => {
  const updateProp = (key: keyof GalleryProps, value: any) => {
    onPropsChange({ ...props, [key]: value });
  };

  const updateImage = (id: string, changes: Partial<GalleryImage>) => {
    const updatedImages = props.images.map(image =>
      image.id === id ? { ...image, ...changes } : image
    );
    updateProp('images', updatedImages);
  };

  const addImage = () => {
    updateProp('images', [...props.images, createImage()]);
  };

  const removeImage = (id: string) => {
    updateProp('images', props.images.filter(image => image.id !== id));
  };

  const handleImageUpload = (id: string, file?: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateImage(id, { url: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Gallery Title</label>
          <input
            type="text"
            value={props.title || ''}
            onChange={(e) => updateProp('title', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Gallery"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Layout</label>
          <select
            value={props.layout}
            onChange={(e) => updateProp('layout', e.target.value as GalleryProps['layout'])}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="grid">Grid</option>
            <option value="masonry">Masonry</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Columns</label>
          <input
            type="number"
            min={1}
            max={4}
            value={props.columns || 3}
            onChange={(e) => updateProp('columns', Number(e.target.value))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Spacing</label>
          <input
            type="text"
            value={props.spacing || '16px'}
            onChange={(e) => updateProp('spacing', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="16px"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Corner Radius</label>
          <input
            type="text"
            value={props.rounded || '16px'}
            onChange={(e) => updateProp('rounded', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="16px"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { key: 'showCaptions', label: 'Show Captions', defaultValue: true },
          { key: 'enableLightbox', label: 'Enable Lightbox', defaultValue: true },
          { key: 'showThumbnailStrip', label: 'Show Thumbnail Strip', defaultValue: true },
          { key: 'allowDownload', label: 'Allow Image Download', defaultValue: true },
          { key: 'enableKeyboardNavigation', label: 'Keyboard Navigation', defaultValue: true },
          { key: 'showImageCount', label: 'Show Image Counter', defaultValue: true },
        ].map(({ key, label, defaultValue }) => (
          <label key={key} className="flex items-center space-x-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={(props[key as keyof GalleryProps] as boolean | undefined) ?? defaultValue}
              onChange={(e) => updateProp(key as keyof GalleryProps, e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>{label}</span>
          </label>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-900">Images</h4>
        <button
          onClick={addImage}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Image
        </button>
      </div>

      <div className="space-y-4">
        {props.images.map((image) => (
          <div key={image.id} className="border border-gray-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">{image.title || 'Untitled Image'}</p>
              <button
                onClick={() => removeImage(image.id)}
                className="text-red-500 hover:text-red-700"
                title="Remove image"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="text"
                value={image.url}
                onChange={(e) => updateImage(image.id, { url: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
              <div className="mt-2">
                <label className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-100 rounded-lg cursor-pointer hover:bg-blue-50">
                  <Upload className="w-3.5 h-3.5 mr-1.5" />
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(image.id, e.target.files?.[0])}
                  />
                </label>
                <p className="text-[11px] text-gray-500 mt-1">Supports JPG, PNG, WebP up to 2 MB</p>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={image.title || ''}
                onChange={(e) => updateImage(image.id, { title: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={image.description || ''}
                onChange={(e) => updateImage(image.id, { description: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Alt Text</label>
              <input
                type="text"
                value={image.alt || ''}
                onChange={(e) => updateImage(image.id, { alt: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the image for accessibility"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

