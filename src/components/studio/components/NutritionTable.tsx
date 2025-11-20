import React from 'react';
import { NutritionTableProps, NutritionNutrient } from './types';

interface NutritionTableComponentProps {
  props: NutritionTableProps;
  style?: Record<string, any>;
  isSelected?: boolean;
  onClick?: () => void;
}

export const NutritionTableComponent: React.FC<NutritionTableComponentProps> = ({
  props,
  style = {},
}) => {
  const {
    title = 'Nutrition Facts',
    subtitle,
    servingSize = '1 cup (240ml)',
    servingsPerContainer = 'About 2',
    calories = 210,
    caloriesFromFat = 40,
    note,
    highlightColor = '#111827',
    layout = 'classic',
    showCaloriesFromFat = true,
    showFootnotes = true,
    footnotes = [],
    nutrients = [],
    backgroundColor = '#ffffff',
    textColor = '#111827',
    borderRadius = '16px',
    showAllergens = false,
    allergens = [],
    sourceDisclosure,
    showMacroSummary = false,
    macroSummary,
    basisType = 'per_serving',
    customBasisLabel,
  } = props;

  const basisLabel = (() => {
    switch (basisType) {
      case 'per_100g':
        return 'Values per 100g';
      case 'per_portion':
        return 'Values per portion';
      case 'custom':
        return customBasisLabel?.trim() || 'Per serving';
      case 'per_serving':
      default:
        return 'Values per serving';
    }
  })();

  const containerStyle: React.CSSProperties = {
    backgroundColor,
    color: textColor,
    borderRadius,
    padding: layout === 'classic' ? '24px' : '32px',
    border: layout === 'classic' ? '2px solid #111827' : '1px solid rgba(15, 23, 42, 0.1)',
    maxWidth: layout === 'classic' ? 420 : 640,
    ...style,
  };

  const headerClass =
    layout === 'classic'
      ? 'text-3xl font-extrabold tracking-tight'
      : 'text-4xl font-black tracking-tight';

  const sectionDividerClass =
    layout === 'classic'
      ? 'border-t-2 border-gray-900 my-2'
      : 'border-t border-gray-200 my-4';

  const getNutrientRow = (nutrient: NutritionNutrient, showDivider = true) => (
    <div
      key={nutrient.id}
      className={`flex items-start ${layout === 'classic' ? 'py-1' : 'py-2'} ${
        showDivider ? 'border-b border-gray-200 last:border-none' : ''
      } ${nutrient.highlight ? 'bg-orange-50 rounded px-1' : ''}`}
    >
      <div className="flex-1">
        <span className="font-medium">{nutrient.name}</span>
        {nutrient.subText && (
          <span className="block text-xs text-gray-500">{nutrient.subText}</span>
        )}
      </div>
      {nutrient.amount && (
        <span className="min-w-[80px] text-right font-semibold">{nutrient.amount}</span>
      )}
    </div>
  );

  if (!nutrients.length) {
    return (
      <div style={containerStyle} className="border-2 border-dashed border-gray-300 text-center py-16">
        <p className="text-gray-500 text-sm">Add nutrients in settings to build a nutrition table.</p>
      </div>
    );
  }

  return (
    <div style={containerStyle} className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h3 className={headerClass}>{title}</h3>
          <span className="text-xs font-semibold uppercase tracking-wide bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
            {basisLabel}
          </span>
        </div>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        <div className="text-sm font-medium">Serving Size {servingSize}</div>
        <div className="text-sm text-gray-500">Servings Per Container {servingsPerContainer}</div>
      </div>

      <div className={sectionDividerClass} />

      <div className="flex items-baseline justify-between">
        <div>
          <span className="uppercase text-xs font-bold tracking-widest text-gray-500">Amount per serving</span>
          <div className="text-5xl font-black leading-tight">{calories}</div>
          <div className="text-sm font-semibold">Calories</div>
        </div>
        <div className="text-right">
          {showCaloriesFromFat && (
            <div className="text-sm text-gray-600">Calories from Fat {caloriesFromFat}</div>
          )}
        </div>
      </div>

      {showMacroSummary && macroSummary && (
        <div className="grid grid-cols-2 gap-3 rounded-xl bg-gray-50 p-3 border border-gray-200">
          {Object.entries(macroSummary).map(([key, value]) => {
            if (!value) return null;
            const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
            return (
              <div key={key} className="flex items-center justify-between text-sm">
                <span className="font-medium">{label}</span>
                <div className="text-right">
                  {value.amount && <div className="font-semibold">{value.amount}</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className={sectionDividerClass} />

      <div className="space-y-2">
        {nutrients.map((nutrient, idx) => getNutrientRow(nutrient, idx !== nutrients.length - 1))}
      </div>

      {note && (
        <div className="text-xs text-gray-500 pt-2 border-t border-dashed border-gray-200">
          {note}
        </div>
      )}

      {showAllergens && allergens && allergens.length > 0 && (
        <div className="text-xs text-gray-700 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
          <span className="font-semibold">Allergens:</span> {allergens.join(', ')}
        </div>
      )}

      {showFootnotes && footnotes && footnotes.length > 0 && (
        <div className="text-[11px] text-gray-500 space-y-1 border-t border-gray-200 pt-2">
          {footnotes.map((footnote, idx) => (
            <p key={idx} className="flex gap-1">
              <span>•</span>
              <span>{footnote}</span>
            </p>
          ))}
        </div>
      )}

      {sourceDisclosure && (
        <div className="text-[11px] text-gray-400 border-t border-gray-100 pt-2">
          Source: {sourceDisclosure}
        </div>
      )}
    </div>
  );
};

export const getNutritionTableDefaultProps = (): NutritionTableProps => ({
  title: 'Nutrition Facts',
  subtitle: 'Per serving',
  servingSize: '1 cup (240ml)',
  servingsPerContainer: 'About 2',
  calories: 210,
  caloriesFromFat: 40,
  note: 'Not a significant source of vitamin D, calcium or iron.',
  highlightColor: '#111827',
  layout: 'classic',
  basisType: 'per_serving',
  showCaloriesFromFat: true,
  showFootnotes: true,
  footnotes: [],
  nutrients: [
    { id: 'nutrient-1', name: 'Total Fat', amount: '8g' },
    { id: 'nutrient-2', name: 'Saturated Fat', amount: '3g' },
    { id: 'nutrient-3', name: 'Trans Fat', amount: '0g' },
  ],
  backgroundColor: '#ffffff',
  textColor: '#111827',
  borderRadius: '16px',
  showAllergens: false,
  allergens: [],
  showMacroSummary: false,
  macroSummary: {
    fat: { amount: '8g' },
    carbohydrates: { amount: '28g' },
    protein: { amount: '5g' },
  },
});

