import React from 'react';
import { VideoProps } from './types';

interface VideoSettingsProps {
  props: VideoProps;
  onPropsChange: (props: VideoProps) => void;
}

export const VideoSettings: React.FC<VideoSettingsProps> = ({
  props,
  onPropsChange
}) => {
  const updateProp = (key: keyof VideoProps, value: any) => {
    onPropsChange({ ...props, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Video Type & URL */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Video</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Video Platform *
            </label>
            <select
              value={props.videoType || 'youtube'}
              onChange={(e) => updateProp('videoType', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="youtube">YouTube</option>
              <option value="vimeo">Vimeo</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Video URL or ID *
            </label>
            <input
              type="text"
              value={props.videoUrl || ''}
              onChange={(e) => updateProp('videoUrl', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={props.videoType === 'youtube' 
                ? "https://www.youtube.com/watch?v=dQw4w9WgXcQ or video ID"
                : "https://vimeo.com/123456789 or video ID"}
            />
            <p className="text-xs text-gray-500 mt-1">
              {props.videoType === 'youtube' 
                ? 'Paste a YouTube video URL (e.g., https://www.youtube.com/watch?v=...) or just the video ID'
                : 'Paste a Vimeo video URL (e.g., https://vimeo.com/123456789) or just the video ID'}
            </p>
            {props.videoUrl && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                <p className="text-blue-800 font-medium mb-1">Examples:</p>
                {props.videoType === 'youtube' ? (
                  <ul className="text-blue-700 list-disc list-inside space-y-1">
                    <li>Full URL: https://www.youtube.com/watch?v=dQw4w9WgXcQ</li>
                    <li>Short URL: https://youtu.be/dQw4w9WgXcQ</li>
                    <li>Video ID only: dQw4w9WgXcQ</li>
                  </ul>
                ) : (
                  <ul className="text-blue-700 list-disc list-inside space-y-1">
                    <li>Full URL: https://vimeo.com/123456789</li>
                    <li>Video ID only: 123456789</li>
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Settings */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Playback Settings</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-700">Autoplay</label>
            <input
              type="checkbox"
              checked={props.autoplay || false}
              onChange={(e) => updateProp('autoplay', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-700">Loop</label>
            <input
              type="checkbox"
              checked={props.loop || false}
              onChange={(e) => updateProp('loop', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-700">Muted</label>
            <input
              type="checkbox"
              checked={props.muted || false}
              onChange={(e) => updateProp('muted', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-700">Show Controls</label>
            <input
              type="checkbox"
              checked={props.controls !== false}
              onChange={(e) => updateProp('controls', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Display Settings */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Display Settings</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Width
            </label>
            <input
              type="text"
              value={props.width || '100%'}
              onChange={(e) => updateProp('width', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="100%"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Height (leave empty for aspect ratio)
            </label>
            <input
              type="text"
              value={props.height || ''}
              onChange={(e) => updateProp('height', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="auto"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Aspect Ratio
            </label>
            <select
              value={props.aspectRatio || '16:9'}
              onChange={(e) => updateProp('aspectRatio', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="16:9">16:9 (Widescreen)</option>
              <option value="4:3">4:3 (Standard)</option>
              <option value="1:1">1:1 (Square)</option>
              <option value="auto">Auto</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Border Radius
            </label>
            <input
              type="text"
              value={props.borderRadius || '0'}
              onChange={(e) => updateProp('borderRadius', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Alignment
            </label>
            <select
              value={props.align || 'center'}
              onChange={(e) => updateProp('align', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

