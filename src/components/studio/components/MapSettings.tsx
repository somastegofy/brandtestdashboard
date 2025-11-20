import React from 'react';
import { MapProps } from './types';

interface MapSettingsProps {
  props: MapProps;
  onPropsChange: (props: MapProps) => void;
}

export const MapSettings: React.FC<MapSettingsProps> = ({
  props,
  onPropsChange
}) => {
  const updateProp = (key: keyof MapProps, value: any) => {
    onPropsChange({ ...props, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Location Settings */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Location</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Iframe URL (Recommended)
            </label>
            <input
              type="text"
              value={props.iframeUrl || ''}
              onChange={(e) => updateProp('iframeUrl', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Paste the iframe src URL from Google Maps, OpenStreetMap, or any map service. You can paste either just the URL or the entire iframe tag - both will work. This takes priority over address/coordinates.
            </p>
            {props.iframeUrl && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                <p className="text-blue-800 font-medium mb-1">Tip:</p>
                <p className="text-blue-700">
                  If you pasted the entire iframe tag, make sure it includes the src attribute. The component will automatically extract the URL.
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-3">
            <p className="text-xs font-medium text-gray-700 mb-2">Or use address/coordinates:</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              value={props.address || ''}
              onChange={(e) => updateProp('address', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="123 Main St, City, State ZIP"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter an address or use coordinates below (only used if iframe URL is empty)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={props.latitude || ''}
                onChange={(e) => updateProp('latitude', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="40.7128"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={props.longitude || ''}
                onChange={(e) => updateProp('longitude', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="-74.0060"
              />
            </div>
          </div>

          <p className="text-xs text-gray-500">
            Leave iframe URL empty and use address/coordinates for automatic map generation
          </p>
        </div>
      </div>

      {/* Map Settings */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Map Settings</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Zoom Level: {props.zoom || 15}
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={props.zoom || 15}
              onChange={(e) => updateProp('zoom', parseInt(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              1 (World) to 20 (Building level)
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Map Style
            </label>
            <select
              value={props.style || 'default'}
              onChange={(e) => updateProp('style', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="default">Default (Roadmap)</option>
              <option value="satellite">Satellite</option>
              <option value="terrain">Terrain</option>
              <option value="roadmap">Roadmap</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Height
            </label>
            <input
              type="text"
              value={props.height || '400px'}
              onChange={(e) => updateProp('height', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="400px"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Border Radius
            </label>
            <input
              type="text"
              value={props.borderRadius || '8px'}
              onChange={(e) => updateProp('borderRadius', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="8px"
            />
          </div>
        </div>
      </div>

      {/* Marker Settings */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Marker</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-700">Show Marker</label>
            <input
              type="checkbox"
              checked={props.showMarker !== false}
              onChange={(e) => updateProp('showMarker', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>

          {props.showMarker && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Marker Label
              </label>
              <input
                type="text"
                value={props.markerLabel || ''}
                onChange={(e) => updateProp('markerLabel', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Location name"
              />
            </div>
          )}
        </div>
      </div>

      {/* Interaction */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Interaction</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-700">Interactive Map</label>
            <input
              type="checkbox"
              checked={props.interactive !== false}
              onChange={(e) => updateProp('interactive', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          <p className="text-xs text-gray-500">
            Interactive maps allow zooming and panning. Disable for static maps.
          </p>
        </div>
      </div>

      {/* API Note */}
      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-xs text-yellow-800">
          <strong>Note:</strong> For full map functionality, you'll need to configure a mapping API (Google Maps, Mapbox, or OpenStreetMap) in your project settings.
        </p>
      </div>
    </div>
  );
};

