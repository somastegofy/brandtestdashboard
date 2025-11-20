import React from 'react';
import { HeadingTextProps } from './types';

interface HeadingTextComponentProps {
  props: HeadingTextProps;
  style?: Record<string, any>;
  isSelected?: boolean;
  onClick?: () => void;
}

export const HeadingTextComponent: React.FC<HeadingTextComponentProps> = ({
  props,
  style = {},
  isSelected = false,
  onClick
}) => {
  const {
    heading = {
      text: 'Heading',
      level: 'h2',
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#000000',
      align: 'left'
    },
    text = {
      content: 'Your text content goes here',
      fontSize: '1rem',
      color: '#333333',
      align: 'left'
    },
    spacing = '16px',
    alignment = 'left'
  } = props;

  const HeadingTag = heading.level || 'h2';

  const containerStyle: React.CSSProperties = {
    textAlign: alignment,
    ...style
  };

  const headingStyle: React.CSSProperties = {
    fontSize: heading.fontSize || '2rem',
    fontWeight: heading.fontWeight || 'bold',
    color: heading.color || '#000000',
    textAlign: heading.align || alignment,
    fontFamily: heading.fontFamily || 'inherit',
    letterSpacing: heading.letterSpacing || 'normal',
    textTransform: heading.textTransform || 'none',
    lineHeight: heading.lineHeight || '1.2',
    marginBottom: heading.marginBottom || spacing || '16px'
  };

  const textStyle: React.CSSProperties = {
    fontSize: text.fontSize || '1rem',
    fontWeight: text.fontWeight || 'normal',
    color: text.color || '#333333',
    textAlign: text.align || alignment,
    fontFamily: text.fontFamily || 'inherit',
    lineHeight: text.lineHeight || '1.6',
    marginTop: text.marginTop || '0'
  };

  return (
    <div style={containerStyle}>
      {heading.text && (
        <HeadingTag style={headingStyle}>
          {heading.text}
        </HeadingTag>
      )}
      {text.content && (
        <p style={textStyle}>
          {text.content}
        </p>
      )}
      {(!heading.text && !text.content) && (
        <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 text-sm">
          No content. Add heading and text in settings.
        </div>
      )}
    </div>
  );
};

// Default props for Heading+Text component
export const getHeadingTextDefaultProps = (): HeadingTextProps => ({
  heading: {
    text: 'Your Heading',
    level: 'h2',
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#000000',
    align: 'left',
    fontFamily: '',
    letterSpacing: 'normal',
    textTransform: 'none',
    lineHeight: '1.2',
    marginBottom: '16px'
  },
  text: {
    content: 'Your text content goes here. You can add multiple paragraphs or format your text as needed.',
    fontSize: '1rem',
    fontWeight: 'normal',
    color: '#333333',
    align: 'left',
    fontFamily: '',
    lineHeight: '1.6',
    marginTop: '0'
  },
  spacing: '16px',
  alignment: 'left'
});

