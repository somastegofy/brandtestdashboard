import React from 'react';
import { SocialLinksProps } from './types';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Music, Heart } from 'lucide-react';

interface SocialLinksComponentProps {
  props: SocialLinksProps;
  style?: Record<string, any>;
  isSelected?: boolean;
  onClick?: () => void;
}

export const SocialLinksComponent: React.FC<SocialLinksComponentProps> = ({
  props,
  style = {},
  isSelected = false,
  onClick
}) => {
  const {
    links = [],
    layout = 'horizontal',
    size = 'medium',
    spacing = '12px',
    alignment = 'center',
    iconColor = '#000000',
    hoverColor = '#3b82f6',
    showLabels = false,
    borderRadius = '8px'
  } = props;

  const sizeClasses = {
    small: 'w-8 h-8 text-sm',
    medium: 'w-10 h-10 text-base',
    large: 'w-12 h-12 text-lg'
  };

  const getIcon = (platform: string, customIcon?: string) => {
    if (customIcon) {
      return <span dangerouslySetInnerHTML={{ __html: customIcon }} />;
    }

    const iconSize = size === 'small' ? 16 : size === 'medium' ? 20 : 24;
    const iconProps = { size: iconSize };

    switch (platform) {
      case 'facebook':
        return <Facebook {...iconProps} />;
      case 'twitter':
        return <Twitter {...iconProps} />;
      case 'instagram':
        return <Instagram {...iconProps} />;
      case 'linkedin':
        return <Linkedin {...iconProps} />;
      case 'youtube':
        return <Youtube {...iconProps} />;
      case 'pinterest':
        return <Heart {...iconProps} />; // Using Heart icon as alternative for Pinterest
      case 'tiktok':
        return <Music {...iconProps} />;
      default:
        return <div className="w-full h-full bg-gray-300 rounded" />;
    }
  };

  const getPlatformLabel = (platform: string, customLabel?: string) => {
    if (customLabel) return customLabel;
    return platform.charAt(0).toUpperCase() + platform.slice(1);
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: layout === 'vertical' ? 'column' : 'row',
    flexWrap: layout === 'grid' ? 'wrap' : 'nowrap',
    gap: spacing,
    justifyContent: alignment === 'left' ? 'flex-start' : 
                   alignment === 'center' ? 'center' : 
                   alignment === 'right' ? 'flex-end' : 'center',
    alignItems: 'center',
    ...style
  };

  const linkStyle: React.CSSProperties = {
    borderRadius,
    transition: 'all 0.2s ease-in-out',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    color: iconColor,
    cursor: 'pointer'
  };

  if (links.length === 0) {
    return (
      <div style={containerStyle} className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500 text-sm">No social links added. Add links in settings.</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {links.map((link, index) => (
        <a
          key={index}
          href={link.url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className={`${sizeClasses[size]} flex items-center justify-center border border-gray-200 hover:border-gray-400 transition-all`}
          style={{
            ...linkStyle,
            borderRadius
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = hoverColor + '10';
            e.currentTarget.style.borderColor = hoverColor;
            e.currentTarget.style.color = hoverColor;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.color = iconColor;
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
          title={getPlatformLabel(link.platform, link.customLabel)}
        >
          {getIcon(link.platform, link.customIcon)}
          {showLabels && (
            <span className="ml-2 text-xs font-medium">
              {getPlatformLabel(link.platform, link.customLabel)}
            </span>
          )}
        </a>
      ))}
    </div>
  );
};

// Default props for Social Links component
export const getSocialLinksDefaultProps = (): SocialLinksProps => ({
  links: [
    {
      platform: 'facebook',
      url: 'https://facebook.com',
      customIcon: undefined,
      customLabel: undefined
    }
  ],
  layout: 'horizontal',
  size: 'medium',
  spacing: '12px',
  alignment: 'center',
  iconColor: '#000000',
  hoverColor: '#3b82f6',
  showLabels: false,
  borderRadius: '8px'
});

