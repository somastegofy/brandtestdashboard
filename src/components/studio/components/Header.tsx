import React from 'react';
import { HeaderProps } from './types';

interface HeaderComponentProps {
  props: HeaderProps;
  style?: Record<string, any>;
  isSelected?: boolean;
  onClick?: () => void;
}

export const HeaderComponent: React.FC<HeaderComponentProps> = ({
  props,
  style = {},
  isSelected = false,
  onClick
}) => {
  const {
    logo = { enabled: false, src: '', alt: '', width: 160, height: 48, align: 'left', link: '', openInNewTab: false },
    text = { enabled: false, content: '', fontSize: '24px', fontWeight: 'bold', color: '#000000', align: 'left', link: '', openInNewTab: false, fontFamily: '', letterSpacing: 'normal', textTransform: 'none' },
    navigation = { enabled: false, items: [], align: 'right' },
    background = { color: '#ffffff', image: '', opacity: 1 },
    sticky = false,
    height = '80px',
    padding = { top: '16px', bottom: '16px', left: '24px', right: '24px' },
    border = { enabled: false, width: '1px', color: '#e5e7eb', style: 'solid' as const },
    layout = { logoTextSpacing: '12px', logoTextAlignment: 'horizontal' }
  } = props;

  const headerStyle: React.CSSProperties = {
    position: sticky ? 'sticky' : 'relative',
    top: sticky ? 0 : 'auto',
    zIndex: sticky ? 1000 : 'auto',
    height: height,
    paddingTop: padding.top,
    paddingBottom: padding.bottom,
    paddingLeft: padding.left,
    paddingRight: padding.right,
    backgroundColor: background.color || '#ffffff',
    backgroundImage: background.image ? `url(${background.image})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    opacity: background.opacity ?? 1,
    borderBottom: border.enabled 
      ? `${border.width} ${border.style} ${border.color}` 
      : 'none',
    ...style
  };

  const logoAlignClass = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  }[logo.align || 'left'];

  const navAlignClass = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  }[navigation.align || 'right'];

  // Determine layout class for main header container
  const getLayoutClass = () => {
    const hasLogo = logo.enabled && logo.src;
    const hasText = text.enabled && text.content;
    const hasLeftContent = hasLogo || hasText;
    const hasRightContent = navigation.enabled && navigation.items.length > 0;
    
    if (hasLeftContent && hasRightContent) {
      return 'justify-between';
    } else if (hasLeftContent) {
      // If both logo and text are enabled, use their group alignment
      if (hasLogo && hasText) {
        // Group will handle its own alignment, header should space between if nav exists
        return 'justify-start';
      }
      // Single element alignment
      if (hasLogo) {
        return logo.align === 'center' ? 'justify-center' : 
               logo.align === 'right' ? 'justify-end' : 
               'justify-start';
      }
      if (hasText) {
        return text.align === 'center' ? 'justify-center' : 
               text.align === 'right' ? 'justify-end' : 
               'justify-start';
      }
    } else if (hasRightContent) {
      return navAlignClass;
    }
    return 'justify-start';
  };

  // Determine if logo and text should be grouped together
  const shouldGroupLogoAndText = (logo.enabled && logo.src) && (text.enabled && text.content);
  const logoTextAlignment = layout?.logoTextAlignment || 'horizontal';

  // Render Logo
  const renderLogo = () => {
    if (!logo.enabled || !logo.src) return null;

    const logoElement = (
      <img
        src={logo.src}
        alt={logo.alt}
        width={logo.width}
        height={logo.height}
        className="object-contain"
        style={{ maxHeight: height }}
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/160x48?text=Logo';
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

  // Render Text
  const renderText = () => {
    if (!text.enabled || !text.content) return null;

    const textStyle: React.CSSProperties = {
      fontSize: text.fontSize || '24px',
      fontWeight: text.fontWeight || 'bold',
      color: text.color || '#000000',
      fontFamily: text.fontFamily || 'inherit',
      letterSpacing: text.letterSpacing || 'normal',
      textTransform: text.textTransform || 'none',
      margin: 0,
      padding: 0,
    };

    const textElement = (
      <span style={textStyle}>
        {text.content}
      </span>
    );

    if (text.link) {
      return (
        <a
          href={text.link}
          target={text.openInNewTab ? '_blank' : '_self'}
          rel={text.openInNewTab ? 'noopener noreferrer' : undefined}
          onClick={(e) => e.stopPropagation()}
          style={textStyle}
          className="hover:opacity-80 transition-opacity"
        >
          {text.content}
        </a>
      );
    }

    return textElement;
  };

  // Render Logo and Text Group
  const renderLogoTextGroup = () => {
    const hasLogo = logo.enabled && logo.src;
    const hasText = text.enabled && text.content;
    
    if (!hasLogo && !hasText) {
      return (
        <div className="w-full text-center text-gray-400 text-sm py-4">
          Header - Configure logo or text in settings
        </div>
      );
    }

    // If both logo and text are enabled, group them together
    if (shouldGroupLogoAndText) {
      const spacing = layout?.logoTextSpacing || '12px';
      const isVertical = logoTextAlignment === 'vertical';
      
      // Determine group alignment based on which element's alignment takes precedence
      // Priority: logo alignment if both have same preference, otherwise left
      const groupAlign = logo.align === text.align ? logo.align : 'left';
      const groupAlignClass = groupAlign === 'center' ? 'mx-auto' : 
                              groupAlign === 'right' ? 'ml-auto' : '';
      
      return (
        <div className={`flex items-center ${isVertical ? 'flex-col' : 'flex-row'} ${groupAlignClass}`} style={{ gap: spacing }}>
          {renderLogo()}
          {renderText()}
        </div>
      );
    }

    // Render separately based on individual alignment
    if (hasLogo && !hasText) {
      const alignClass = logo.align === 'center' ? 'mx-auto' : 
                        logo.align === 'right' ? 'ml-auto' : '';
      return (
        <div className={`flex items-center ${alignClass}`}>
          {renderLogo()}
        </div>
      );
    }

    if (hasText && !hasLogo) {
      const alignClass = text.align === 'center' ? 'mx-auto' : 
                        text.align === 'right' ? 'ml-auto' : '';
      return (
        <div className={`flex items-center ${alignClass}`}>
          {renderText()}
        </div>
      );
    }

    return null;
  };

  return (
    <header
      className={`w-full flex items-center ${getLayoutClass()}`}
      style={headerStyle}
    >
      {/* Logo and/or Text Group */}
      {renderLogoTextGroup()}

      {/* Navigation */}
      {navigation.enabled && navigation.items.length > 0 ? (
        <nav className={`flex items-center gap-6 ${navAlignClass === 'justify-center' ? 'mx-auto' : ''}`}>
          {navigation.items.map((item, index) => (
            <a
              key={index}
              href={item.link}
              target={item.openInNewTab ? '_blank' : '_self'}
              rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
              className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
              onClick={(e) => e.stopPropagation()}
            >
              {item.label}
            </a>
          ))}
        </nav>
      ) : navigation.enabled && navigation.items.length === 0 ? (
        <div className={`flex items-center px-4 py-2 bg-gray-100 rounded text-gray-500 text-sm ${navAlignClass === 'justify-center' ? 'mx-auto' : 'ml-auto'}`}>
          Navigation (Add items in settings)
        </div>
      ) : null}
    </header>
  );
};

// Default props for Header component
export const getHeaderDefaultProps = (): HeaderProps => ({
  logo: {
    enabled: false,
    src: '',
    alt: 'Logo',
    width: 160,
    height: 48,
    align: 'left',
    link: '',
    openInNewTab: false
  },
  text: {
    enabled: true,
    content: 'Header Title',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#000000',
    align: 'left',
    link: '',
    openInNewTab: false,
    fontFamily: '',
    letterSpacing: 'normal',
    textTransform: 'none'
  },
  navigation: {
    enabled: false,
    items: [],
    align: 'right'
  },
  background: {
    color: '#ffffff',
    image: '',
    opacity: 1
  },
  sticky: false,
  height: '80px',
  padding: {
    top: '16px',
    bottom: '16px',
    left: '24px',
    right: '24px'
  },
  border: {
    enabled: true,
    width: '1px',
    color: '#e5e7eb',
    style: 'solid'
  },
  layout: {
    logoTextSpacing: '12px',
    logoTextAlignment: 'horizontal'
  }
});

