import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { IngredientsProps } from './types';

interface IngredientsSettingsProps {
  props: IngredientsProps;
  onPropsChange: (props: IngredientsProps) => void;
}

export const IngredientsSettings: React.FC<IngredientsSettingsProps> = ({
  props,
  onPropsChange
}) => {
  const updateProp = (key: keyof IngredientsProps, value: any) => {
    onPropsChange({ ...props, [key]: value });
  };

  const updateItem = (index: number, key: keyof IngredientsProps['items'][0], value: any) => {
    const newItems = [...(props.items || [])];
    newItems[index] = { ...newItems[index], [key]: value };
    updateProp('items', newItems);
  };

  const addItem = () => {
    const newItems = [...(props.items || []), {
      id: `ingredient-${Date.now()}`,
      name: 'New Ingredient',
      quantity: '',
      unit: '',
      optional: false
    }];
    updateProp('items', newItems);
  };

  const removeItem = (index: number) => {
    const newItems = [...(props.items || [])];
    newItems.splice(index, 1);
    updateProp('items', newItems);
  };

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">General</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={props.title || ''}
              onChange={(e) => updateProp('title', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ingredients"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Layout
            </label>
            <select
              value={props.layout || 'list'}
              onChange={(e) => updateProp('layout', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="list">List</option>
              <option value="grid">Grid</option>
              <option value="columns">Columns</option>
            </select>
          </div>

          {(props.layout === 'grid' || props.layout === 'columns') && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Columns: {props.columns || 2}
              </label>
              <input
                type="range"
                min="1"
                max="4"
                value={props.columns || 2}
                onChange={(e) => updateProp('columns', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Item Style
            </label>
            <select
              value={props.itemStyle || 'plain'}
              onChange={(e) => updateProp('itemStyle', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="plain">Plain</option>
              <option value="card">Card</option>
              <option value="bordered">Bordered</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Spacing
            </label>
            <input
              type="text"
              value={props.spacing || '8px'}
              onChange={(e) => updateProp('spacing', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="8px"
            />
          </div>
        </div>
      </div>

      {/* Display Options */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Display Options</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-700">Show Quantity</label>
            <input
              type="checkbox"
              checked={props.showQuantity !== false}
              onChange={(e) => updateProp('showQuantity', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-700">Show Unit</label>
            <input
              type="checkbox"
              checked={props.showUnit !== false}
              onChange={(e) => updateProp('showUnit', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-700">Highlight Optional</label>
            <input
              type="checkbox"
              checked={props.highlightOptional !== false}
              onChange={(e) => updateProp('highlightOptional', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Ingredients List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-900">Ingredients</h4>
          <button
            onClick={addItem}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Ingredient
          </button>
        </div>

        <div className="space-y-4">
          {(props.items || []).map((item, index) => (
            <div key={item.id || index} className="p-4 border border-gray-200 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Ingredient {index + 1}</span>
                <button
                  onClick={() => removeItem(index)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Remove ingredient"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={item.name || ''}
                  onChange={(e) => updateItem(index, 'name', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ingredient name"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="text"
                    value={item.quantity || ''}
                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={item.unit || ''}
                    onChange={(e) => updateItem(index, 'unit', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="cup"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-700">Optional</label>
                <input
                  type="checkbox"
                  checked={item.optional || false}
                  onChange={(e) => updateItem(index, 'optional', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

