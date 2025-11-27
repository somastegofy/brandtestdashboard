import React from 'react';
import { HeadingTextProps, HeadingAlignmentOption, BodyAlignmentOption } from './types';

interface HeadingTextComponentProps {
  props: HeadingTextProps;
  style?: Record<string, any>;
  isSelected?: boolean;
  onClick?: () => void;
}

const SPACING_MAP: Record<NonNullable<HeadingTextProps['spacing']>, string> = {
  compact: '0.5rem',
  comfortable: '1rem',
  relaxed: '1.5rem'
};

export const HeadingTextComponent: React.FC<HeadingTextComponentProps> = ({
  props,
  style = {},
  onClick
}) => {
  const {
    heading = {
      text: 'Heading',
      level: 'h2',
      fontWeight: '600',
      align: 'left',
      textTransform: 'none'
    },
    text = {
      content: 'Your text content goes here',
      fontWeight: '400',
      align: 'left'
    },
    spacing = 'comfortable',
    alignment = 'left'
  } = props;

  const HeadingTag = heading.level || 'h2';
  const resolvedSpacing = SPACING_MAP[spacing] || SPACING_MAP.comfortable;
  const containerAlignment = (alignment || 'left') as HeadingAlignmentOption;
  const headingAlignment = (heading.align || containerAlignment) as HeadingAlignmentOption;
  const bodyAlignment = (text.align || containerAlignment) as BodyAlignmentOption;
  const headingWeight = heading.fontWeight || '600';
  const bodyWeight = text.fontWeight || '400';

  const containerStyle: React.CSSProperties = {
    textAlign: containerAlignment,
    ...style
  };

  const headingStyle: React.CSSProperties = {
    fontWeight: headingWeight,
    textAlign: headingAlignment,
    textTransform: heading.textTransform || 'none',
    marginBottom: resolvedSpacing
  };

  const textStyle: React.CSSProperties = {
    fontWeight: bodyWeight,
    textAlign: bodyAlignment,
    marginTop: resolvedSpacing === '0' ? '0' : `calc(${resolvedSpacing} * 0.5)`
  };

  const renderBodyContent = () => {
    if (!text.content) return null;
    const paragraphs = text.content.split(/\n{2,}/).filter(Boolean);

    if (paragraphs.length <= 1) {
      return <p style={textStyle}>{text.content}</p>;
    }

    return (
      <div className="space-y-3" style={{ textAlign: bodyAlignment }}>
        {paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className="leading-relaxed"
            style={{ fontWeight: bodyWeight, textAlign: bodyAlignment, margin: 0 }}
          >
            {paragraph}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div style={containerStyle} onClick={onClick} className="space-y-2">
      {heading.text && (
        <HeadingTag style={headingStyle} className="leading-tight tracking-tight text-balance">
          {heading.text}
        </HeadingTag>
      )}
      {renderBodyContent()}
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
    fontWeight: '600',
    align: 'left',
    textTransform: 'none'
  },
  text: {
    content: 'Your text content goes here. You can add multiple paragraphs or format your text as needed.',
    fontWeight: '400',
    align: 'left'
  },
  spacing: 'comfortable',
  alignment: 'left'
});

