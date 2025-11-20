import React, { useState } from 'react';
import { NutritionTableProps, NutritionNutrient } from './types';
import { Plus, Trash2 } from 'lucide-react';

interface NutritionTableSettingsProps {
  props: NutritionTableProps;
  onPropsChange: (props: NutritionTableProps) => void;
}

export const NutritionTableSettings: React.FC<NutritionTableSettingsProps> = ({
  props,
  onPropsChange,
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'nutrients' | 'footnotes'>('basic');

  const updateProp = (key: keyof NutritionTableProps, value: any) => {
    onPropsChange({ ...props, [key]: value });
  };

  const addNutrient = () => {
    const newNutrient: NutritionNutrient = {
      id: `nutrient-${Date.now()}`,
      name: 'Protein',
      amount: '10g',
    };
    updateProp('nutrients', [...(props.nutrients || []), newNutrient]);
  };

  const updateNutrient = (nutrientId: string, updates: Partial<NutritionNutrient>) => {
    const nutrients = (props.nutrients || []).map((nutrient) =>
      nutrient.id === nutrientId ? { ...nutrient, ...updates } : nutrient
    );
    updateProp('nutrients', nutrients);
  };

  const removeNutrient = (nutrientId: string) => {
    const nutrients = (props.nutrients || []).filter((nutrient) => nutrient.id !== nutrientId);
    updateProp('nutrients', nutrients);
  };

  const addFootnote = () => {
    updateProp('footnotes', [...(props.footnotes || []), '']);
  };

  const updateFootnote = (index: number, value: string) => {
    const footnotes = [...(props.footnotes || [])];
    footnotes[index] = value;
    updateProp('footnotes', footnotes);
  };

  const removeFootnote = (index: number) => {
    const footnotes = [...(props.footnotes || [])];
    footnotes.splice(index, 1);
    updateProp('footnotes', footnotes);
  };

  const addAllergen = () => {
    updateProp('allergens', [...(props.allergens || []), '']);
  };

  const updateAllergen = (index: number, value: string) => {
    const allergens = [...(props.allergens || [])];
    allergens[index] = value;
    updateProp('allergens', allergens);
  };

  const removeAllergen = (index: number) => {
    const allergens = [...(props.allergens || [])];
    allergens.splice(index, 1);
    updateProp('allergens', allergens);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: 'basic', label: 'Basic' },
          { id: 'nutrients', label: 'Nutrients' },
          { id: 'footnotes', label: 'Footnotes' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-3 py-2 text-sm font-medium ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'basic' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={props.title || ''}
              onChange={(e) => updateProp('title', e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Nutrition Facts"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Subtitle</label>
              <input
                type="text"
                value={props.subtitle || ''}
                onChange={(e) => updateProp('subtitle', e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Per serving"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Measurement Basis</label>
              <select
                value={props.basisType || 'per_serving'}
                onChange={(e) => updateProp('basisType', e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="per_serving">Per Serving</option>
                <option value="per_100g">Per 100g</option>
                <option value="per_portion">Per Portion</option>
                <option value="custom">Custom Label</option>
              </select>
            </div>
          </div>

          {props.basisType === 'custom' && (
            <div>
              <label className="block text-sm font-medium mb-1">Custom Basis Label</label>
              <input
                type="text"
                value={props.customBasisLabel || ''}
                onChange={(e) => updateProp('customBasisLabel', e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Per 50g (dry mix)"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Serving Size</label>
              <input
                type="text"
                value={props.servingSize || ''}
                onChange={(e) => updateProp('servingSize', e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="1 cup (240ml)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Servings Per Container</label>
              <input
                type="text"
                value={props.servingsPerContainer || ''}
                onChange={(e) => updateProp('servingsPerContainer', e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="About 2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Calories</label>
              <input
                type="number"
                value={props.calories || 0}
                onChange={(e) => updateProp('calories', parseInt(e.target.value, 10) || 0)}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Calories from Fat</label>
              <input
                type="number"
                value={props.caloriesFromFat || 0}
                onChange={(e) => updateProp('caloriesFromFat', parseInt(e.target.value, 10) || 0)}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Layout</label>
            <select
              value={props.layout || 'classic'}
              onChange={(e) => updateProp('layout', e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="classic">Classic Label</option>
              <option value="modern">Modern Card</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={props.showCaloriesFromFat !== false}
                onChange={(e) => updateProp('showCaloriesFromFat', e.target.checked)}
              />
              Show Calories from Fat
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={props.showMacroSummary || false}
                onChange={(e) => updateProp('showMacroSummary', e.target.checked)}
              />
              Show Macro Summary
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={props.showAllergens || false}
                onChange={(e) => updateProp('showAllergens', e.target.checked)}
              />
              Show Allergen Callout
            </label>
          </div>
        </div>
      )}

      {activeTab === 'nutrients' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Nutrients</h4>
            <button
              onClick={addNutrient}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Nutrient
            </button>
          </div>

          {(props.nutrients || []).map((nutrient) => (
            <div key={nutrient.id} className="border rounded-xl p-4 space-y-3 bg-gray-50">
              <div className="flex items-center justify-between gap-3">
                <input
                  type="text"
                  value={nutrient.name}
                  onChange={(e) => updateNutrient(nutrient.id, { name: e.target.value })}
                  className="flex-1 border rounded-lg px-3 py-2 text-sm"
                  placeholder="Nutrient name (e.g., Protein)"
                />
                <button
                  onClick={() => removeNutrient(nutrient.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Amount</label>
                  <input
                    type="text"
                    value={nutrient.amount || ''}
                    onChange={(e) => updateNutrient(nutrient.id, { amount: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    placeholder="10g"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Subtext (optional)</label>
                  <input
                    type="text"
                    value={nutrient.subText || ''}
                    onChange={(e) => updateNutrient(nutrient.id, { subText: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    placeholder="of which sugars"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={nutrient.highlight || false}
                  onChange={(e) => updateNutrient(nutrient.id, { highlight: e.target.checked })}
                />
                Highlight row / show callout
              </label>
            </div>
          ))}

          {(!props.nutrients || props.nutrients.length === 0) && (
            <div className="text-center text-sm text-gray-500 py-6 border rounded-lg border-dashed">
              No nutrients yet. Click “Add Nutrient” to start building your table.
            </div>
          )}
        </div>
      )}

      {activeTab === 'footnotes' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Footnotes</label>
              <button
                onClick={addFootnote}
                className="flex items-center gap-1 text-sm text-blue-600"
              >
                <Plus className="w-4 h-4" />
                Add footnote
              </button>
            </div>

            {(props.footnotes || []).map((footnote, index) => (
              <div key={index} className="flex gap-2">
                <textarea
                  value={footnote}
                  onChange={(e) => updateFootnote(index, e.target.value)}
                  className="flex-1 border rounded-lg px-3 py-2 text-sm"
                  rows={2}
                />
                <button
                  onClick={() => removeFootnote(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {(!props.footnotes || props.footnotes.length === 0) && (
              <p className="text-xs text-gray-500">
                Add legal or nutritional disclaimers that should appear below the table.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={props.showAllergens || false}
                onChange={(e) => updateProp('showAllergens', e.target.checked)}
              />
              Allergen Disclosure
            </label>

            {props.showAllergens && (
              <div className="space-y-2">
                {(props.allergens || []).map((allergen, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={allergen}
                      onChange={(e) => updateAllergen(index, e.target.value)}
                      className="flex-1 border rounded-lg px-3 py-2 text-sm"
                      placeholder="e.g., Contains milk, soy"
                    />
                    <button
                      onClick={() => removeAllergen(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addAllergen}
                  className="flex items-center gap-2 text-sm text-blue-600"
                >
                  <Plus className="w-4 h-4" />
                  Add Allergen Info
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

