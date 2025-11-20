import React from 'react';
import { MapProps } from './types';

interface MapComponentProps {
  props: MapProps;
  style?: Record<string, any>;
  isSelected?: boolean;
  onClick?: () => void;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  props,
  style = {},
  isSelected = false,
  onClick
}) => {
  const {
    iframeUrl = '',
    address = '',
    latitude,
    longitude,
    zoom = 15,
    height = '400px',
    style: mapStyle = 'default',
    showMarker = true,
    markerLabel = '',
    borderRadius = '8px',
    interactive = true
  } = props;

  const containerStyle: React.CSSProperties = {
    height,
    borderRadius,
    overflow: 'hidden',
    position: 'relative',
    ...style
  };

  // If iframe URL is provided, use it directly (highest priority)
  // Extract URL from iframe tag if user pasted the whole iframe tag
  const getIframeSrc = () => {
    if (!iframeUrl) return null;
    
    // If user pasted the whole iframe tag, extract the src URL
    const iframeMatch = iframeUrl.match(/src=["']([^"']+)["']/i);
    if (iframeMatch) {
      return iframeMatch[1];
    }
    
    // If it's already just a URL, return it
    if (iframeUrl.startsWith('http://') || iframeUrl.startsWith('https://')) {
      return iframeUrl.trim();
    }
    
    return iframeUrl;
  };

  const iframeSrc = getIframeSrc();

  if (iframeSrc) {
    return (
      <div style={containerStyle} className="w-full">
        <iframe
          src={iframeSrc}
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          aria-label="Map"
          className="w-full h-full"
          onClick={(e) => e.stopPropagation()}
          onError={(e) => {
            console.error('Map iframe failed to load:', e);
          }}
        />
      </div>
    );
  }

  const mapTypeParam = {
    default: 'roadmap',
    satellite: 'satellite',
    terrain: 'terrain',
    roadmap: 'roadmap'
  }[mapStyle];

  // Alternative: OpenStreetMap with Leaflet or simple iframe fallback
  const buildAlternativeMap = () => {
    if (latitude && longitude) {
      return `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}`;
    }
    if (address) {
      // For address, we'd need geocoding - for now, show placeholder
      return null;
    }
    return null;
  };

  if (!address && !latitude && !longitude) {
    return (
      <div style={containerStyle} className="flex items-center justify-center border-2 border-dashed border-gray-300 bg-gray-50">
        <div className="text-center p-4">
          <p className="text-gray-500 text-sm mb-2">No location specified</p>
          <p className="text-gray-400 text-xs">Add an iframe URL, address, or coordinates in settings</p>
        </div>
      </div>
    );
  }

  // For production, use Google Maps Embed API or a mapping library like Leaflet
  // This is a simplified version that works with OpenStreetMap
  const mapSrc = buildAlternativeMap();

  if (!mapSrc) {
    return (
      <div style={containerStyle} className="flex items-center justify-center border border-gray-300 bg-gray-50">
        <div className="text-center p-4">
          <p className="text-gray-600 font-medium mb-1">Map Preview</p>
          <p className="text-gray-500 text-sm mb-2">
            {address || (latitude && longitude ? `${latitude}, ${longitude}` : 'Location')}
          </p>
          <p className="text-gray-400 text-xs">
            {interactive ? 'Interactive map' : 'Static map'}
          </p>
          {showMarker && markerLabel && (
            <p className="text-gray-500 text-xs mt-2">📍 {markerLabel}</p>
          )}
          <p className="text-gray-400 text-xs mt-4">
            Configure map API or use iframe URL in settings for full functionality
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle} className="w-full">
      {interactive ? (
        <iframe
          src={mapSrc}
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0 }}
          allowFullScreen
          aria-label="Interactive map"
          className="w-full h-full"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <div 
          className="w-full h-full flex items-center justify-center bg-gray-100 border border-gray-300"
          style={{ backgroundImage: `url(https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s(${longitude},${latitude})/${longitude},${latitude},${zoom},0/400x400?access_token=YOUR_TOKEN)` }}
        >
          <div className="text-center p-4">
            <p className="text-gray-600 font-medium mb-1">Map Location</p>
            <p className="text-gray-500 text-sm">{address || `${latitude}, ${longitude}`}</p>
            {showMarker && markerLabel && (
              <p className="text-gray-500 text-xs mt-2">📍 {markerLabel}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Default props for Map component
export const getMapDefaultProps = (): MapProps => ({
  iframeUrl: '',
  address: '',
  latitude: undefined,
  longitude: undefined,
  zoom: 15,
  height: '400px',
  style: 'default',
  showMarker: true,
  markerLabel: '',
  borderRadius: '8px',
  interactive: true
});

