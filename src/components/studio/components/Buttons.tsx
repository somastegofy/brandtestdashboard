import React from 'react';
import { ButtonsProps } from './types';

interface ButtonsComponentProps {
  props: ButtonsProps;
  style?: Record<string, any>;
  isSelected?: boolean;
  onClick?: () => void;
  disableLinkNavigation?: boolean;
}

export const ButtonsComponent: React.FC<ButtonsComponentProps> = ({
  props,
  style = {},
  isSelected = false,
  onClick,
  disableLinkNavigation = false,
}) => {
  const {
    buttons = [],
    layout = 'horizontal',
    alignment = 'left',
    spacing = '30px',
    size = 'medium',
    fullWidth = false
  } = props;

  const CTA_DEFAULT = 'var(--cta-color-default, #10b981)';
  const CTA_TEXT = 'var(--cta-text-color, #ffffff)';

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };

  const getButtonStyle = (button: ButtonsProps['buttons'][0]) => {
    const variant = button.style === 'outline' ? 'outline' : 'normal';
    const isRounded = button.rounded !== false;
    const baseStyle: React.CSSProperties = {
      borderRadius: isRounded ? 'var(--cta-rounded-radius, 25px)' : '8px',
      fontWeight: button.fontWeight || '500',
      transition: 'all 0.2s ease-in-out',
    };
    if (variant === 'outline') {
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        color: CTA_DEFAULT,
        border: `2px solid ${CTA_DEFAULT}`,
      };
    }

    return {
      ...baseStyle,
      backgroundColor: CTA_DEFAULT,
      color: CTA_TEXT,
      border: 'none',
    };
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: layout === 'vertical' ? 'column' : 'row',
    flexWrap: layout === 'grid' ? 'wrap' : 'nowrap',
    gap: spacing || '30px',
    justifyContent: alignment === 'left' ? 'flex-start' : 
                   alignment === 'center' ? 'center' : 
                   alignment === 'right' ? 'flex-end' : 
                   alignment === 'space-between' ? 'space-between' : 'flex-start',
    alignItems: 'center',
    ...style
  };

  const buttonWrapperStyle: React.CSSProperties = {
    width: fullWidth ? '100%' : 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  };

  const renderButton = (button: ButtonsProps['buttons'][0], index: number) => {
    const titleAlign = button.titleAlign || 'left';
    const descriptionAlign = button.descriptionAlign || 'left';
    const buttonStyle = getButtonStyle(button);
    const buttonContent = (
      <button
        type={button.type === 'submit' ? 'submit' : 'button'}
        className={`${sizeClasses[size]} font-medium rounded transition-all ${
          button.style === 'outline' ? 'hover:bg-gray-50' : 'hover:opacity-90'
        }`}
        style={{
          ...buttonStyle,
          ...(fullWidth && { width: '100%' }),
        }}
        disabled={button.disabled}
      >
        {button.icon && button.iconPosition === 'left' && (
          <span className="mr-2" dangerouslySetInnerHTML={{ __html: button.icon }} />
        )}
        {button.text || 'Button'}
        {button.icon && button.iconPosition === 'right' && (
          <span className="ml-2" dangerouslySetInnerHTML={{ __html: button.icon }} />
        )}
      </button>
    );

    return (
      <div key={button.id || index} style={buttonWrapperStyle}>
        {button.title && (
          <div
            className="text-sm text-gray-900"
            style={{
              fontWeight: button.titleFontWeight || '600',
              textAlign: titleAlign
            }}
          >
            {button.title}
          </div>
        )}
        {button.description && (
          <p
            className="text-xs text-gray-600"
            style={{
              fontWeight: button.descriptionFontWeight || '400',
              textAlign: descriptionAlign,
              margin: 0
            }}
          >
            {button.description}
          </p>
        )}
        {button.link ? (
          <a
            href={button.link}
            target={button.openInNewTab ? '_blank' : '_self'}
            rel={button.openInNewTab ? 'noopener noreferrer' : undefined}
            onClick={(e) => {
              if (disableLinkNavigation) {
                e.preventDefault();
              }
            }}
            className="w-full"
          >
            {buttonContent}
          </a>
        ) : (
          buttonContent
        )}
      </div>
    );
  };

  if (buttons.length === 0) {
    return (
      <div style={containerStyle} className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500 text-sm">No buttons added. Add buttons in settings.</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {buttons.map((button, index) => renderButton(button, index))}
    </div>
  );
};

// Default props for Buttons component
export const getButtonsDefaultProps = (): ButtonsProps => ({
  buttons: [
    {
      id: 'button-1',
      title: '',
      description: '',
      text: 'Scan Me',
      link: '',
      style: 'normal',
      rounded: true,
      fontWeight: '500',
      disabled: false,
      openInNewTab: false,
      type: 'button',
      icon: '',
      iconPosition: 'left',
      titleAlign: 'left',
      titleFontWeight: '600',
      descriptionAlign: 'left',
      descriptionFontWeight: '400',
    }
  ],
  layout: 'horizontal',
  alignment: 'left',
  spacing: '30px',
  size: 'medium',
  fullWidth: false
});

