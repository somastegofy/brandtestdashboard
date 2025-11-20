import React from 'react';
import { IngredientsProps } from './types';

interface IngredientsComponentProps {
  props: IngredientsProps;
  style?: Record<string, any>;
  isSelected?: boolean;
  onClick?: () => void;
}

export const IngredientsComponent: React.FC<IngredientsComponentProps> = ({
  props,
  style = {},
  isSelected = false,
  onClick
}) => {
  const {
    title = 'Ingredients',
    items = [],
    layout = 'list',
    columns = 2,
    showQuantity = true,
    showUnit = true,
    highlightOptional = true,
    spacing = '8px',
    itemStyle = 'plain'
  } = props;

  const containerStyle: React.CSSProperties = {
    gap: spacing,
    ...style
  };

  const getItemStyle = (item: IngredientsProps['items'][0]) => {
    const baseStyle: React.CSSProperties = {
      padding: itemStyle === 'card' ? '12px' : itemStyle === 'bordered' ? '8px' : '4px',
      borderRadius: itemStyle === 'card' ? '8px' : '0',
      border: itemStyle === 'bordered' ? '1px solid #e5e7eb' : 'none',
      backgroundColor: itemStyle === 'card' ? '#f9fafb' : 'transparent',
    };

    if (highlightOptional && item.optional) {
      baseStyle.opacity = 0.7;
      baseStyle.fontStyle = 'italic';
    }

    return baseStyle;
  };

  const formatIngredient = (item: IngredientsProps['items'][0]) => {
    const parts: string[] = [];
    
    if (showQuantity && item.quantity) {
      parts.push(item.quantity);
    }
    
    if (showUnit && item.unit) {
      parts.push(item.unit);
    }
    
    parts.push(item.name);
    
    if (item.optional && highlightOptional) {
      return `${parts.join(' ')} (optional)`;
    }
    
    return parts.join(' ');
  };

  if (items.length === 0) {
    return (
      <div style={containerStyle} className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500 text-sm">No ingredients added. Add ingredients in settings.</p>
      </div>
    );
  }

  const renderItem = (item: IngredientsProps['items'][0], index: number) => (
    <div
      key={item.id || index}
      style={getItemStyle(item)}
      className="flex items-start"
    >
      <span className="mr-2 text-gray-500">•</span>
      <span className="flex-1">{formatIngredient(item)}</span>
    </div>
  );

  if (layout === 'grid') {
    return (
      <div style={containerStyle}>
        {title && <h3 className="text-xl font-semibold mb-4">{title}</h3>}
        <div 
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${columns}, 1fr)`
          }}
        >
          {items.map((item, index) => renderItem(item, index))}
        </div>
      </div>
    );
  }

  if (layout === 'columns') {
    return (
      <div style={containerStyle}>
        {title && <h3 className="text-xl font-semibold mb-4">{title}</h3>}
        <div 
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${columns}, 1fr)`
          }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="space-y-2">
              {items
                .filter((_, index) => index % columns === colIndex)
                .map((item, index) => renderItem(item, colIndex * columns + index))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // List layout
  return (
    <div style={containerStyle} className="space-y-2">
      {title && <h3 className="text-xl font-semibold mb-4">{title}</h3>}
      <div className="space-y-2">
        {items.map((item, index) => renderItem(item, index))}
      </div>
    </div>
  );
};

// Default props for Ingredients component
export const getIngredientsDefaultProps = (): IngredientsProps => ({
  title: 'Ingredients',
  items: [
    {
      id: '1',
      name: 'Ingredient 1',
      quantity: '1',
      unit: 'cup',
      optional: false
    },
    {
      id: '2',
      name: 'Ingredient 2',
      quantity: '2',
      unit: 'tbsp',
      optional: false
    }
  ],
  layout: 'list',
  columns: 2,
  showQuantity: true,
  showUnit: true,
  highlightOptional: true,
  spacing: '8px',
  itemStyle: 'plain'
});

