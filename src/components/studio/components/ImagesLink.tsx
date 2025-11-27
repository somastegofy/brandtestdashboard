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
    cardTitle,
    cardDescription,
    items = [],
    layout = 'grid',
    columns = 3,
    spacing = '16px',
    imageAspectRatio = '16:9',
    showTitles = true,
    showDescriptions = false,
    imageBorderRadius = '8px',
    hoverEffect = 'zoom',
    contentDisplay = 'overlay'
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

  const wrapperStyle: React.CSSProperties = {
    ...style
  };

  const containerStyle: React.CSSProperties = {
    gap: spacing
  };

  const imageStyle: React.CSSProperties = {
    borderRadius: imageBorderRadius
  };

  const hasCaption = (item: ImageLinkItem) =>
    (showTitles && item.title) || (showDescriptions && item.description);

  const renderCaption = (item: ImageLinkItem, variant: 'overlay' | 'standard') => (
    <>
      {showTitles && item.title && (
        <h3
          className={`font-semibold ${
            variant === 'overlay' ? 'text-white text-lg' : 'text-gray-900 text-base'
          }`}
        >
          {item.title}
        </h3>
      )}
      {showDescriptions && item.description && (
        <p className={variant === 'overlay' ? 'text-white/90 text-sm' : 'text-gray-600 text-sm'}>
          {item.description}
        </p>
      )}
    </>
  );

  const renderImage = (
    item: ImageLinkItem,
    index: number,
    options?: {
      displayMode?: 'overlay' | 'below' | 'above';
      showCaption?: boolean;
    showButton?: boolean;
    }
  ) => {
    const displayMode = options?.displayMode ?? contentDisplay;
    const shouldShowCaption = options?.showCaption ?? true;
  const shouldShowButton = options?.showButton ?? true;
    const captionAvailable = shouldShowCaption && hasCaption(item);
    const overlayCaption =
      captionAvailable && displayMode === 'overlay' ? (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 space-y-1">
          {renderCaption(item, 'overlay')}
        </div>
      ) : null;

    const standardCaption =
      captionAvailable && displayMode !== 'overlay' ? (
        <div className="space-y-1">{renderCaption(item, 'standard')}</div>
      ) : null;

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
        {overlayCaption}
      </div>
    );

    const clickableImage = item.link ? (
      <a
        href={item.link}
        target={item.openInNewTab ? '_blank' : '_self'}
        rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
        className="block"
        onClick={(e) => e.stopPropagation()}
      >
        {imageContent}
      </a>
    ) : (
      imageContent
    );

    return (
      <div key={item.id || index} className="flex flex-col gap-3">
        {displayMode === 'above' && standardCaption}
        {clickableImage}
        {displayMode === 'below' && standardCaption}
        {shouldShowButton && item.link && (
          <a
            href={item.link}
            target={item.openInNewTab ? '_blank' : '_self'}
            rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            onClick={(e) => e.stopPropagation()}
          >
            View
          </a>
        )}
      </div>
    );
  };

  const hasCardIntro = Boolean(cardTitle?.trim() || cardDescription?.trim());
  const cardIntro = hasCardIntro ? (
    <div className="space-y-1">
      {cardTitle && <h2 className="text-2xl font-semibold text-gray-900">{cardTitle}</h2>}
      {cardDescription && <p className="text-gray-600">{cardDescription}</p>}
    </div>
  ) : null;

  const renderWithWrapper = (content: React.ReactNode) => (
    <div style={wrapperStyle} onClick={onClick} className="space-y-4">
      {cardIntro}
      {content}
    </div>
  );

  // Show placeholder if no items
  if (!items || items.length === 0) {
    return renderWithWrapper(
      <div className="w-full p-8 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
        <div className="text-lg font-medium mb-2">Images+Link Component</div>
        <div className="text-sm">Add images in the settings panel</div>
      </div>
    );
  }

  if (layout === 'carousel') {
    return renderWithWrapper(
      <div className="relative w-full" style={containerStyle}>
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
    return renderWithWrapper(
      <div className="space-y-4" style={containerStyle}>
        {items.map((item, index) => (
          <div key={item.id || index} className="flex gap-4">
            <div className="w-1/3 flex-shrink-0">
              {renderImage(item, index, { showCaption: false, showButton: false })}
            </div>
            <div className="flex-1">
              {showTitles && item.title && (
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              )}
              {showDescriptions && item.description && (
                <p className="text-gray-600 mb-2">{item.description}</p>
              )}
              {item.link && (
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
  const safeColumns = Math.min(4, Math.max(1, columns || 1));
  return renderWithWrapper(
    <div
      className="grid w-full"
      style={{
        ...containerStyle,
        gridTemplateColumns: `repeat(${safeColumns}, 1fr)`
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
  cardTitle: '',
  cardDescription: '',
  contentDisplay: 'overlay'
});

