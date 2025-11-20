import React from 'react';
import { ImageTextProps } from './types';

interface ImageTextComponentProps {
  props: ImageTextProps;
  style?: Record<string, any>;
  isSelected?: boolean;
  onClick?: () => void;
}

export const ImageTextComponent: React.FC<ImageTextComponentProps> = ({
  props,
  style = {},
  isSelected = false,
  onClick
}) => {
  const {
    image = { url: '', alt: '', align: 'left' },
    text = { content: '', heading: '', headingSize: '1.5rem', contentSize: '1rem', headingColor: '#000000', contentColor: '#333333', headingAlign: 'left', contentAlign: 'left' },
    layout = 'image-left',
    spacing = '24px',
    imageWidth = '50%',
    textWidth = '50%',
    alignment = 'left'
  } = props;

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: layout === 'image-top' ? 'column' : layout === 'image-bottom' ? 'column-reverse' : 'row',
    gap: spacing,
    alignItems: 'center',
    ...(layout === 'image-left' && { flexDirection: 'row' }),
    ...(layout === 'image-right' && { flexDirection: 'row-reverse' }),
    ...style
  };

  const imageStyle: React.CSSProperties = {
    width: layout === 'image-top' || layout === 'image-bottom' ? '100%' : imageWidth,
    flexShrink: 0
  };

  const textStyle: React.CSSProperties = {
    width: layout === 'image-top' || layout === 'image-bottom' ? '100%' : textWidth,
    textAlign: alignment
  };

  const imageContent = (
    <div style={imageStyle}>
      <img
        src={image.url || 'https://via.placeholder.com/600x400?text=Image'}
        alt={image.alt || 'Image'}
        className="w-full h-auto object-cover rounded-lg"
        style={{ maxWidth: '100%' }}
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=Image';
        }}
      />
    </div>
  );

  const textContent = (
    <div style={textStyle}>
      {text.heading && (
        <h2 style={{ fontSize: text.headingSize || '1.5rem', color: text.headingColor || '#000000', textAlign: text.headingAlign || alignment, marginBottom: '12px', fontWeight: 'bold' }}>
          {text.heading}
        </h2>
      )}
      {text.content && (
        <p style={{ fontSize: text.contentSize || '1rem', color: text.contentColor || '#333333', textAlign: text.contentAlign || alignment, lineHeight: '1.6' }}>
          {text.content}
        </p>
      )}
    </div>
  );

  if (!image.url && !text.content) {
    return (
      <div style={containerStyle} className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500 text-sm">No content. Add image and text in settings.</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {image.url && imageContent}
      {text.content && textContent}
    </div>
  );
};

export const getImageTextDefaultProps = (): ImageTextProps => ({
  image: {
    url: '',
    alt: 'Image',
    width: '',
    height: '',
    align: 'left'
  },
  text: {
    heading: 'Heading',
    content: 'Your text content goes here',
    headingSize: '1.5rem',
    contentSize: '1rem',
    headingColor: '#000000',
    contentColor: '#333333',
    headingAlign: 'left',
    contentAlign: 'left'
  },
  layout: 'image-left',
  spacing: '24px',
  imageWidth: '50%',
  textWidth: '50%',
  alignment: 'left'
});
