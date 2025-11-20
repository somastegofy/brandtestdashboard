import React, { useState } from 'react';
import { ImagesLinkProps, ImageLinkItem } from './types';

interface ImagesLinkComponentProps {
  props: ImagesLinkProps;
  style?: Record<string, any>;
  isSelected?: boolean;
  onClick?: () => void;
}

export const ImagesLinkComponent: React.FC<ImagesLinkComponentProps> = ({
  props,
  style = {},
  isSelected = false,
  onClick
}) => {
  const {
    items = [],
    layout = 'grid',
    columns = 3,
    spacing = '16px',
    imageAspectRatio = '16:9',
    showTitles = true,
    showDescriptions = false,
    imageBorderRadius = '8px',
    hoverEffect = 'zoom',
    linkStyle = 'entire-image'
  } = props;

  const [currentIndex, setCurrentIndex] = useState(0); // For carousel

  const aspectRatioClass = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
    '3:4': 'aspect-[3/4]',
    'auto': ''
  }[imageAspectRatio];

  const hoverEffectClass = {
    none: '',
    zoom: 'transition-transform duration-300 hover:scale-105',
    fade: 'transition-opacity duration-300 hover:opacity-80',
    lift: 'transition-transform duration-300 hover:-translate-y-2'
  }[hoverEffect];

  const containerStyle: React.CSSProperties = {
    gap: spacing,
    ...style
  };

  const imageStyle: React.CSSProperties = {
    borderRadius: imageBorderRadius
  };

  const renderImage = (item: ImageLinkItem, index: number) => {
    const imageContent = (
      <div className={`relative ${hoverEffectClass}`}>
        <img
          src={item.imageUrl || 'https://via.placeholder.com/400x300?text=Image'}
          alt={item.alt}
          className={`w-full h-full object-cover ${aspectRatioClass}`}
          style={imageStyle}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image';
          }}
        />
        {(showTitles || showDescriptions) && (item.title || item.description) && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
            {showTitles && item.title && (
              <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
            )}
            {showDescriptions && item.description && (
              <p className="text-sm opacity-90">{item.description}</p>
            )}
          </div>
        )}
        {linkStyle === 'overlay' && item.link && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-colors pointer-events-none">
            <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              View
            </span>
          </div>
        )}
        {linkStyle === 'button' && item.link && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <a
              href={item.link}
              target={item.openInNewTab ? '_blank' : '_self'}
              rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
              className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              View
            </a>
          </div>
        )}
      </div>
    );

    if (item.link && linkStyle === 'entire-image') {
      return (
        <a
          key={item.id || index}
          href={item.link}
          target={item.openInNewTab ? '_blank' : '_self'}
          rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
          className="block"
          onClick={(e) => e.stopPropagation()}
        >
          {imageContent}
        </a>
      );
    }

    return (
      <div key={item.id || index} className="block">
        {imageContent}
      </div>
    );
  };

  // Show placeholder if no items
  if (!items || items.length === 0) {
    return (
      <div className="w-full p-8 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
        <div className="text-lg font-medium mb-2">Images+Link Component</div>
        <div className="text-sm">Add images in the settings panel</div>
      </div>
    );
  }

  if (layout === 'carousel') {
    return (
      <div
        className="relative w-full"
        style={containerStyle}
      >
        <div className="overflow-hidden rounded-lg">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {items.map((item, index) => (
              <div key={item.id || index} className="w-full flex-shrink-0">
                {renderImage(item, index)}
              </div>
            ))}
          </div>
        </div>
        {items.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2 rounded-full shadow-lg z-10 transition-colors"
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2 rounded-full shadow-lg z-10 transition-colors"
              aria-label="Next image"
            >
              ›
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
              {items.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  if (layout === 'list') {
    return (
      <div
        className="space-y-4"
        style={containerStyle}
      >
        {items.map((item, index) => (
          <div key={item.id || index} className="flex gap-4">
            <div className="w-1/3 flex-shrink-0">
              {renderImage(item, index)}
            </div>
            <div className="flex-1">
              {showTitles && item.title && (
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              )}
              {showDescriptions && item.description && (
                <p className="text-gray-600 mb-2">{item.description}</p>
              )}
              {item.link && linkStyle === 'button' && (
                <a
                  href={item.link}
                  target={item.openInNewTab ? '_blank' : '_self'}
                  rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  View
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Grid layout
  return (
    <div
      className="grid w-full"
      style={{
        ...containerStyle,
        gridTemplateColumns: `repeat(${columns}, 1fr)`
      }}
    >
      {items.map((item, index) => renderImage(item, index))}
    </div>
  );
};

// Default props for Images+Link component
export const getImagesLinkDefaultProps = (): ImagesLinkProps => ({
  items: [
    {
      id: '1',
      imageUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
      alt: 'Image 1',
      title: 'Image Title',
      description: 'Image description',
      link: '',
      openInNewTab: false
    }
  ],
  layout: 'grid',
  columns: 3,
  spacing: '16px',
  imageAspectRatio: '16:9',
  showTitles: true,
  showDescriptions: false,
  imageBorderRadius: '8px',
  hoverEffect: 'zoom',
  linkStyle: 'entire-image'
});

