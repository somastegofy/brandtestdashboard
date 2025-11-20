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
    spacing = '12px',
    size = 'medium',
    fullWidth = false
  } = props;

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };

  const getButtonStyle = (button: ButtonsProps['buttons'][0]) => {
    const baseStyle: React.CSSProperties = {
      borderRadius: button.borderRadius || '6px',
      fontWeight: button.fontWeight || '500',
      letterSpacing: button.letterSpacing || 'normal',
      textTransform: button.textTransform || 'none',
      transition: 'all 0.2s ease-in-out',
    };

    // Apply style variant
    switch (button.style) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: button.backgroundColor || '#3b82f6',
          color: button.textColor || '#ffffff',
          border: 'none',
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: button.backgroundColor || '#6b7280',
          color: button.textColor || '#ffffff',
          border: 'none',
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          color: button.textColor || button.backgroundColor || '#3b82f6',
          border: `2px solid ${button.borderColor || button.backgroundColor || '#3b82f6'}`,
        };
      case 'text':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          color: button.textColor || '#3b82f6',
          border: 'none',
        };
      case 'custom':
        return {
          ...baseStyle,
          backgroundColor: button.backgroundColor || '#3b82f6',
          color: button.textColor || '#ffffff',
          border: button.borderWidth && button.borderColor 
            ? `${button.borderWidth} solid ${button.borderColor}` 
            : 'none',
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: button.backgroundColor || '#3b82f6',
          color: button.textColor || '#ffffff',
          border: 'none',
        };
    }
  };

  const getButtonHoverStyle = (button: ButtonsProps['buttons'][0]) => {
    if (button.hoverBackgroundColor || button.hoverTextColor) {
      return {
        ':hover': {
          backgroundColor: button.hoverBackgroundColor || button.backgroundColor,
          color: button.hoverTextColor || button.textColor,
        }
      };
    }
    return {};
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: layout === 'vertical' ? 'column' : 'row',
    flexWrap: layout === 'grid' ? 'wrap' : 'nowrap',
    gap: spacing,
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
  };

  const renderButton = (button: ButtonsProps['buttons'][0], index: number) => {
    const buttonStyle = getButtonStyle(button);
    const buttonContent = (
      <button
        type={button.type === 'submit' ? 'submit' : 'button'}
        className={`${sizeClasses[size]} font-medium rounded transition-all ${
          button.style === 'outline' ? 'hover:bg-opacity-10' : 
          button.style === 'text' ? 'hover:bg-gray-100' : 
          'hover:opacity-90'
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
      <div key={index} style={buttonWrapperStyle}>
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
      text: 'Click Me',
      link: '',
      style: 'primary',
      size: 'medium',
      backgroundColor: '#3b82f6',
      textColor: '#ffffff',
      borderRadius: '6px',
      fontWeight: '500',
      disabled: false,
      openInNewTab: false,
      type: 'button',
      icon: '',
      iconPosition: 'left',
      hoverBackgroundColor: '',
      hoverTextColor: '',
      borderColor: '',
      borderWidth: ''
    }
  ],
  layout: 'horizontal',
  alignment: 'left',
  spacing: '12px',
  size: 'medium',
  fullWidth: false
});

