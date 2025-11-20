import React, { useMemo, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { GalleryProps } from './types';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';

interface GalleryComponentProps {
  props: GalleryProps;
  style?: Record<string, any>;
  isSelected?: boolean;
  onClick?: () => void;
}

export const GalleryComponent: React.FC<GalleryComponentProps> = ({
  props,
  style = {},
}) => {
  const {
    title = 'Gallery',
    layout = 'grid',
    columns = 3,
    spacing = '16px',
    rounded = '16px',
    showCaptions = true,
    enableLightbox = true,
    showThumbnailStrip = true,
    allowDownload = true,
    enableKeyboardNavigation = true,
    showImageCount = true,
    images = []
  } = props;

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const gridStyles = useMemo(() => {
    if (layout === 'masonry') {
      return {
        columnCount: Math.min(columns, 4),
        columnGap: spacing
      } as React.CSSProperties;
    }
    return {
      display: 'grid',
      gap: spacing,
      gridTemplateColumns: `repeat(${Math.min(columns, 4)}, minmax(0, 1fr))`
    } as React.CSSProperties;
  }, [layout, columns, spacing]);

  const openLightbox = (index: number) => {
    if (!enableLightbox) return;
    setActiveIndex(index);
  };

  const closeLightbox = () => setActiveIndex(null);

  const showNext = () => {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex + 1) % images.length);
  };

  const showPrev = () => {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex - 1 + images.length) % images.length);
  };

  useEffect(() => {
    if (!enableLightbox || activeIndex === null || !enableKeyboardNavigation) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        showNext();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        showPrev();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        closeLightbox();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableLightbox, enableKeyboardNavigation, activeIndex, images.length]);

  useEffect(() => {
    if (!enableLightbox) return;
    if (activeIndex !== null) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [enableLightbox, activeIndex]);

  const downloadImage = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop() || 'image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={style} className="space-y-6">
      {title && (
        <div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Gallery</p>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>
      )}

      {images.length === 0 ? (
        <div className="p-6 border-2 border-dashed border-gray-200 rounded-xl text-center">
          <p className="text-gray-500 text-sm">No images added yet. Use the settings panel to add images.</p>
        </div>
      ) : (
        <div style={gridStyles} className={layout === 'masonry' ? '[&>div]:mb-4' : ''}>
          {images.map((image, index) => (
            <div
              key={image.id}
              className="group relative overflow-hidden"
              style={{ borderRadius: rounded }}
              onClick={() => openLightbox(index)}
            >
              <img
                src={image.url}
                alt={image.alt || image.title || 'Gallery image'}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Image';
                }}
              />
              {showCaptions && (image.title || image.description) && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                  {image.title && <h3 className="text-lg font-semibold">{image.title}</h3>}
                  {image.description && <p className="text-sm text-white/80">{image.description}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {enableLightbox && activeIndex !== null && images[activeIndex] && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[1000] flex flex-col bg-black" role="dialog" aria-modal="true">
          <button
            className="absolute top-4 right-4 z-20 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/90 text-slate-700 hover:bg-white"
            onClick={closeLightbox}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {showImageCount && (
            <div className="absolute top-5 left-5 z-20 px-3 py-1 text-xs font-semibold rounded-full bg-white/90 text-slate-700">
              Image {activeIndex + 1} / {images.length}
            </div>
          )}

          <div className="flex-1 relative flex items-center justify-center">
            {images.length > 1 && (
              <button
                className="hidden md:inline-flex absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/90 text-slate-700 hover:bg-white shadow-lg"
                onClick={showPrev}
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <img
              src={images[activeIndex].url}
              alt={images[activeIndex].alt || images[activeIndex].title || 'Gallery image'}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-3xl shadow-2xl border border-white/10"
            />

            {images.length > 1 && (
              <button
                className="hidden md:inline-flex absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/90 text-slate-700 hover:bg-white shadow-lg"
                onClick={showNext}
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-6 md:hidden">
              <button
                className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/90 text-slate-700"
                onClick={showPrev}
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/90 text-slate-700"
                onClick={showNext}
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          {(images[activeIndex].title || images[activeIndex].description || allowDownload) && (
            <div className="px-5 py-4 bg-black/80 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t border-white/10">
              <div className="min-w-0">
                {images[activeIndex].title && (
                  <h3 className="text-lg font-semibold truncate">{images[activeIndex].title}</h3>
                )}
                {images[activeIndex].description && (
                  <p className="text-sm text-white/80 mt-1 line-clamp-2 md:line-clamp-none">{images[activeIndex].description}</p>
                )}
              </div>
              {allowDownload && (
                <button
                  onClick={() => downloadImage(images[activeIndex].url)}
                  className="inline-flex items-center px-4 py-2 text-sm font-semibold text-black bg-white rounded-full hover:bg-white/90"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </button>
              )}
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
};

export const getGalleryDefaultProps = (): GalleryProps => ({
  title: 'Gallery',
  layout: 'grid',
  columns: 3,
  spacing: '16px',
  rounded: '16px',
  showCaptions: true,
  enableLightbox: true,
  showThumbnailStrip: true,
  allowDownload: true,
  enableKeyboardNavigation: true,
  showImageCount: true,
  images: [
    {
      id: 'gallery-1',
      url: 'https://via.placeholder.com/800x600?text=Gallery+Image+1',
      title: 'Hero Shot',
      description: 'Highlight your product or experience with immersive imagery.'
    },
    {
      id: 'gallery-2',
      url: 'https://via.placeholder.com/800x600?text=Gallery+Image+2',
      title: 'In Detail',
      description: 'Zoom into the craftsmanship and unique details.'
    },
    {
      id: 'gallery-3',
      url: 'https://via.placeholder.com/800x600?text=Gallery+Image+3',
      title: 'Lifestyle',
      description: 'Showcase real-world usage and context.'
    }
  ]
});

