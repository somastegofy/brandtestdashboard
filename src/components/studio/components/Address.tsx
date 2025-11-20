import React from 'react';
import { AddressProps } from './types';
import { MapPin, Phone, Mail } from 'lucide-react';

interface AddressComponentProps {
  props: AddressProps;
  style?: Record<string, any>;
  isSelected?: boolean;
  onClick?: () => void;
}

export const AddressComponent: React.FC<AddressComponentProps> = ({
  props,
  style = {},
  isSelected = false,
  onClick
}) => {
  const {
    street = '',
    city = '',
    state = '',
    zipCode = '',
    country = '',
    phone = '',
    email = '',
    format = 'multi-line',
    alignment = 'left',
    fontSize = '1rem',
    lineHeight = '1.6',
    spacing = '8px',
    showIcons = false,
    iconColor = '#6b7280'
  } = props;

  const containerStyle: React.CSSProperties = {
    textAlign: alignment,
    fontSize,
    lineHeight,
    ...style
  };

  const lineStyle: React.CSSProperties = {
    marginBottom: spacing
  };

  const iconStyle: React.CSSProperties = {
    color: iconColor,
    width: '16px',
    height: '16px',
    marginRight: '8px',
    display: 'inline-block',
    verticalAlign: 'middle'
  };

  const hasAddress = street || city || state || zipCode || country;
  const hasContact = phone || email;

  if (!hasAddress && !hasContact) {
    return (
      <div style={containerStyle} className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500 text-sm">No address information added. Add details in settings.</p>
      </div>
    );
  }

  const renderAddressLine = () => {
    const parts: string[] = [];
    if (street) parts.push(street);
    if (city) parts.push(city);
    if (state) parts.push(state);
    if (zipCode) parts.push(zipCode);
    if (country) parts.push(country);
    return parts.filter(Boolean).join(', ');
  };

  if (format === 'single-line') {
    return (
      <div style={containerStyle} className="flex flex-wrap items-center gap-2">
        {hasAddress && (
          <>
            {showIcons && <MapPin style={iconStyle} />}
            <span>{renderAddressLine()}</span>
          </>
        )}
        {hasAddress && hasContact && <span className="text-gray-400">|</span>}
        {phone && (
          <>
            {showIcons && <Phone style={iconStyle} />}
            <span>{phone}</span>
          </>
        )}
        {phone && email && <span className="text-gray-400">|</span>}
        {email && (
          <>
            {showIcons && <Mail style={iconStyle} />}
            <span>{email}</span>
          </>
        )}
      </div>
    );
  }

  if (format === 'labeled') {
    return (
      <div style={containerStyle} className="space-y-2">
        {hasAddress && (
          <div style={lineStyle}>
            <strong>Address:</strong>{' '}
            {showIcons && <MapPin style={iconStyle} />}
            {renderAddressLine()}
          </div>
        )}
        {phone && (
          <div style={lineStyle}>
            <strong>Phone:</strong>{' '}
            {showIcons && <Phone style={iconStyle} />}
            {phone}
          </div>
        )}
        {email && (
          <div style={lineStyle}>
            <strong>Email:</strong>{' '}
            {showIcons && <Mail style={iconStyle} />}
            <a href={`mailto:${email}`} className="text-blue-600 hover:underline">
              {email}
            </a>
          </div>
        )}
      </div>
    );
  }

  // Multi-line format
  return (
    <div style={containerStyle} className="space-y-2">
      {hasAddress && (
        <div style={lineStyle}>
          {showIcons && <MapPin style={iconStyle} />}
          {street && <div>{street}</div>}
          {(city || state || zipCode) && (
            <div>
              {city && <span>{city}</span>}
              {city && state && <span>, </span>}
              {state && <span>{state}</span>}
              {zipCode && <span> {zipCode}</span>}
            </div>
          )}
          {country && <div>{country}</div>}
        </div>
      )}
      {phone && (
        <div style={lineStyle}>
          {showIcons && <Phone style={iconStyle} />}
          <a href={`tel:${phone}`} className="text-blue-600 hover:underline">
            {phone}
          </a>
        </div>
      )}
      {email && (
        <div style={lineStyle}>
          {showIcons && <Mail style={iconStyle} />}
          <a href={`mailto:${email}`} className="text-blue-600 hover:underline">
            {email}
          </a>
        </div>
      )}
    </div>
  );
};

// Default props for Address component
export const getAddressDefaultProps = (): AddressProps => ({
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
  phone: '',
  email: '',
  format: 'multi-line',
  alignment: 'left',
  fontSize: '1rem',
  lineHeight: '1.6',
  spacing: '8px',
  showIcons: false,
  iconColor: '#6b7280'
});

