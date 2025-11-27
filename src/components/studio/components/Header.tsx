import React from 'react';
import { HeaderProps, HeaderAlignment } from './types';

interface HeaderComponentProps {
  props: HeaderProps;
  style?: Record<string, any>;
  isSelected?: boolean;
  onClick?: () => void;
}

const DEFAULT_LOGO_PLACEHOLDER =
  'https://images.placeholders.dev/?width=320&height=140&text=Your+Logo&fontSize=32';
const LOGO_RATIO = 70;
const TEXT_RATIO = 30;

export const HeaderComponent: React.FC<HeaderComponentProps> = ({
  props,
  style = {},
  onClick
}) => {
  const {
    logo = { enabled: true, src: '', alt: 'Brand logo', link: '', openInNewTab: false },
    text = { enabled: true, content: '', fontWeight: '600', align: 'center', textTransform: 'none' },
    sticky = false,
    height = '80px',
    layout = { logoTextArrangement: 'left_right' }
  } = props;

  const headerStyle: React.CSSProperties = {
    position: sticky ? 'sticky' : 'relative',
    top: sticky ? 0 : 'auto',
    zIndex: sticky ? 1000 : 'auto',
    minHeight: height || '80px',
    ...style
  };

  const hasLogo = logo?.enabled !== false;
  const hasText = text?.enabled !== false && Boolean(text?.content?.trim());
  const arrangement = layout?.logoTextArrangement || 'left_right';
  const isVerticalArrangement = arrangement === 'top_bottom' || arrangement === 'bottom_top';
  const shouldReverseOrder = arrangement === 'right_left' || arrangement === 'bottom_top';

  const renderLogo = () => {
    if (!hasLogo) return null;

    const finalSrc = logo.src?.trim() || DEFAULT_LOGO_PLACEHOLDER;

    const logoElement = (
      <img
        src={finalSrc}
        alt={logo.alt || 'Brand logo'}
        className="object-contain max-h-24 w-full"
        style={{
          maxWidth: '100%',
          height: 'auto'
        }}
        onError={(e) => {
          (e.target as HTMLImageElement).src = DEFAULT_LOGO_PLACEHOLDER;
        }}
      />
    );

    if (logo.link) {
      return (
        <a
          href={logo.link}
          target={logo.openInNewTab ? '_blank' : '_self'}
          rel={logo.openInNewTab ? 'noopener noreferrer' : undefined}
          className="inline-block"
          onClick={(e) => e.stopPropagation()}
        >
          {logoElement}
        </a>
      );
    }

    return logoElement;
  };

  const renderText = () => {
    if (!hasText) return null;

    const textStyle: React.CSSProperties = {
      fontWeight: text.fontWeight || '600',
      textTransform: text.textTransform || 'none',
      margin: 0,
      padding: 0,
      textAlign: (text.align as HeaderAlignment) || 'center'
    };

    return <span style={textStyle}>{text.content}</span>;
  };

  const buildSection = (kind: 'logo' | 'text') => {
    const content = kind === 'logo' ? renderLogo() : renderText();
    if (!content) return null;

    const hasBoth = hasLogo && hasText;
    const baseStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent:
        kind === 'logo'
          ? 'center'
          : (text.align === 'right' && !isVerticalArrangement) ? 'flex-end'
          : (text.align === 'left' && !isVerticalArrangement) ? 'flex-start'
          : 'center',
      textAlign: kind === 'text' ? (text.align as HeaderAlignment) || 'center' : 'center',
      width: isVerticalArrangement ? '100%' : undefined
    };

    if (hasBoth) {
      const ratioValue = kind === 'logo' ? `${LOGO_RATIO}%` : `${TEXT_RATIO}%`;
      if (isVerticalArrangement) {
        baseStyle.flexBasis = ratioValue;
      } else {
        baseStyle.flexBasis = ratioValue;
        baseStyle.maxWidth = ratioValue;
      }
    } else {
      baseStyle.flexBasis = '100%';
      baseStyle.maxWidth = '100%';
    }

    return (
      <div key={kind} style={baseStyle}>
        {content}
      </div>
    );
  };

  const orderedSections = (() => {
    const order: Array<'logo' | 'text'> = shouldReverseOrder ? ['text', 'logo'] : ['logo', 'text'];
    const rendered = order.map((item) => buildSection(item)).filter(Boolean);

    if (rendered.length === 0) {
      return (
        <div className="w-full text-center text-gray-400 text-sm py-6">
          Header - configure your logo or brand text
        </div>
      );
    }

    return rendered;
  })();

  return (
    <header
      className="w-full flex items-center justify-center"
      style={headerStyle}
      onClick={onClick}
    >
      <div
        className={`flex ${isVerticalArrangement ? 'flex-col' : 'flex-row items-center'} w-full`}
        style={{
          gap: isVerticalArrangement ? 'clamp(12px, 3vw, 36px)' : 'clamp(16px, 4vw, 64px)'
        }}
      >
        {orderedSections}
      </div>
    </header>
  );
};

// Default props for Header component
export const getHeaderDefaultProps = (): HeaderProps => ({
  logo: {
    enabled: true,
    src: DEFAULT_LOGO_PLACEHOLDER,
    alt: 'Brand logo',
    link: '',
    openInNewTab: false
  },
  text: {
    enabled: true,
    content: 'Header Title',
    fontWeight: '600',
    align: 'center',
    textTransform: 'none'
  },
  sticky: false,
  height: '80px',
  layout: {
    logoTextArrangement: 'left_right'
  }
});

