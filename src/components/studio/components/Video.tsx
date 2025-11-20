import React from 'react';
import { VideoProps } from './types';

interface VideoComponentProps {
  props: VideoProps;
  style?: Record<string, any>;
  isSelected?: boolean;
  onClick?: () => void;
}

export const VideoComponent: React.FC<VideoComponentProps> = ({
  props,
  style = {},
  isSelected = false,
  onClick
}) => {
  const {
    videoType = 'youtube',
    videoUrl = '',
    autoplay = false,
    loop = false,
    muted = false,
    controls = true,
    width = '100%',
    height,
    aspectRatio = '16:9',
    borderRadius = '0',
    align = 'center'
  } = props;

  const aspectRatioClass = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
    'auto': ''
  }[aspectRatio];

  const containerStyle: React.CSSProperties = {
    width,
    height: height || (aspectRatio === 'auto' ? 'auto' : undefined),
    textAlign: align,
    ...style
  };

  const iframeStyle: React.CSSProperties = {
    borderRadius,
    width: '100%',
    height: '100%',
    maxWidth: '100%',
    border: 'none'
  };

  // Extract video ID from YouTube URL
  const getYouTubeVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    
    // If it's already just an ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
      return url;
    }
    
    return null;
  };

  // Extract video ID from Vimeo URL
  const getVimeoVideoId = (url: string): string | null => {
    const patterns = [
      /(?:vimeo\.com\/)(\d+)/,
      /(?:player\.vimeo\.com\/video\/)(\d+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    
    // If it's already just an ID (numbers only)
    if (/^\d+$/.test(url)) {
      return url;
    }
    
    return null;
  };

  // Build embed URL
  const getEmbedUrl = (): string | null => {
    if (!videoUrl) return null;

    if (videoType === 'youtube') {
      const videoId = getYouTubeVideoId(videoUrl);
      if (!videoId) return null;

      let embedUrl = `https://www.youtube.com/embed/${videoId}?`;
      const params: string[] = [];
      
      if (!controls) params.push('controls=0');
      if (autoplay) params.push('autoplay=1');
      if (muted || autoplay) params.push('mute=1');
      if (loop) params.push('loop=1&playlist=' + videoId);
      if (!controls) params.push('modestbranding=1');
      
      embedUrl += params.join('&');
      return embedUrl;
    } else if (videoType === 'vimeo') {
      const videoId = getVimeoVideoId(videoUrl);
      if (!videoId) return null;

      let embedUrl = `https://player.vimeo.com/video/${videoId}?`;
      const params: string[] = [];
      
      if (!controls) params.push('controls=0');
      if (autoplay) params.push('autoplay=1');
      if (muted || autoplay) params.push('muted=1');
      if (loop) params.push('loop=1');
      
      embedUrl += params.join('&');
      return embedUrl;
    }

    return null;
  };

  if (!videoUrl) {
    return (
      <div style={containerStyle} className="p-8 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500 text-sm">No video URL provided. Add YouTube or Vimeo video URL in settings.</p>
      </div>
    );
  }

  const embedUrl = getEmbedUrl();

  if (!embedUrl) {
    return (
      <div style={containerStyle} className="p-8 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500 text-sm mb-2">Invalid {videoType === 'youtube' ? 'YouTube' : 'Vimeo'} URL</p>
        <p className="text-gray-400 text-xs">Please enter a valid {videoType === 'youtube' ? 'YouTube' : 'Vimeo'} video URL or video ID</p>
      </div>
    );
  }

  return (
    <div 
      style={containerStyle} 
      className={align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : ''}
    >
      <div 
        className={`${aspectRatioClass} w-full relative`} 
        style={{ maxWidth: width }}
      >
        <iframe
          src={embedUrl}
          style={iframeStyle}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={`${videoType === 'youtube' ? 'YouTube' : 'Vimeo'} video player`}
          onClick={(e) => {
            // Stop propagation for iframe clicks to prevent navigation in editor
            e.stopPropagation();
          }}
          onError={(e) => {
            console.error('Video iframe load error:', e);
          }}
        />
        {/* Add a clickable overlay for selection when component is not selected */}
        {!isSelected && (
          <div 
            className="absolute inset-0 z-10 cursor-pointer"
            style={{ 
              pointerEvents: 'auto',
              backgroundColor: 'transparent'
            }}
            onClick={(e) => {
              // Don't stop propagation - let click bubble up to ComponentWrapper
              // The ComponentWrapper will handle the selection
            }}
            onMouseEnter={(e) => {
              // Show selection hint on hover
              (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
            }}
          />
        )}
      </div>
    </div>
  );
};

// Default props for Video component
export const getVideoDefaultProps = (): VideoProps => ({
  videoType: 'youtube',
  videoUrl: '',
  autoplay: false,
  loop: false,
  muted: false,
  controls: true,
  width: '100%',
  height: '',
  aspectRatio: '16:9',
  borderRadius: '0',
  align: 'center'
});

