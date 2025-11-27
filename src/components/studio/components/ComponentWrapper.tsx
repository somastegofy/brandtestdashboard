import React from 'react';
import { GripVertical, X } from 'lucide-react';

interface ComponentWrapperProps {
  children: React.ReactNode;
  isSelected?: boolean;
  onClick?: () => void;
  onDelete?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
  className?: string;
  draggable?: boolean;
  onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragOver?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: (event: React.DragEvent<HTMLDivElement>) => void;
  dragActive?: boolean;
  showDragHandle?: boolean;
}

/**
 * Reusable wrapper component for all Studio components
 * Provides consistent selection styling and click handling
 */
export const ComponentWrapper: React.FC<ComponentWrapperProps> = ({
  children,
  isSelected = false,
  onClick,
  onDelete,
  style = {},
  className = '',
  draggable = false,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  dragActive = false,
  showDragHandle = false,
}) => {
  // Merge style with CSS variables support and ensure border radius works
  const hasBorderRadius = style.borderRadius && 
    style.borderRadius !== '0' && 
    style.borderRadius !== '0px' && 
    style.borderRadius !== 'none';
  
  const mergedStyle: React.CSSProperties = {
    ...style,
    // Ensure CSS variables are accessible
    color: style.color || 'var(--text-color-primary, #111827)',
    // Ensure border radius is visible by handling overflow when border radius is set
    ...(hasBorderRadius && {
      overflow: 'hidden',
    }),
  };

  return (
    <div
      className={`relative transition-all cursor-pointer component-wrapper ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : dragActive ? 'ring-2 ring-dashed ring-blue-400 ring-offset-2 bg-blue-50/40' : 'hover:ring-1 hover:ring-gray-300'} ${className}`}
      style={mergedStyle}
      onClick={onClick}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
    >
      {draggable && showDragHandle && (
        <div className="absolute left-3 top-3 z-40">
          <div className="inline-flex items-center justify-center rounded-full bg-white/80 px-2 py-1 text-gray-500 text-xs shadow-sm border border-gray-200 pointer-events-none select-none">
            <GripVertical className="w-3.5 h-3.5 mr-1" />
            Drag
          </div>
        </div>
      )}
      {children}
      {isSelected && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(e);
          }}
          className="absolute -top-3 -right-3 bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm hover:bg-red-600 z-50 shadow-lg transition-colors"
          title="Delete component"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

