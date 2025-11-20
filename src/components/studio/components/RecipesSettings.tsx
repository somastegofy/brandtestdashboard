import React, { useState } from 'react';
import { RecipesProps, RecipeStep, IngredientItem, NutritionalInfo, RecipeTime } from './types';
import { Plus, Trash2, Upload, X, GripVertical } from 'lucide-react';

interface RecipesSettingsProps {
  props: RecipesProps;
  onPropsChange: (props: RecipesProps) => void;
}

export const RecipesSettings: React.FC<RecipesSettingsProps> = ({ props, onPropsChange }) => {
  const [activeSection, setActiveSection] = useState<'basic' | 'ingredients' | 'steps' | 'nutrition'>('basic');

  const updateProp = (key: keyof RecipesProps, value: any) => {
    onPropsChange({ ...props, [key]: value });
  };

  const updateNestedProp = (path: string[], value: any) => {
    const newProps = { ...props };
    let current: any = newProps;
    
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) {
        current[path[i]] = {};
      }
      current = current[path[i]];
    }
    
    current[path[path.length - 1]] = value;
    onPropsChange(newProps);
  };

  const addIngredient = () => {
    const newIngredient: IngredientItem = {
      id: `ingredient-${Date.now()}`,
      name: '',
      quantity: '',
      unit: '',
      optional: false
    };
    updateProp('ingredients', [...(props.ingredients || []), newIngredient]);
  };

  const updateIngredient = (id: string, updates: Partial<IngredientItem>) => {
    const ingredients = (props.ingredients || []).map(ing =>
      ing.id === id ? { ...ing, ...updates } : ing
    );
    updateProp('ingredients', ingredients);
  };

  const removeIngredient = (id: string) => {
    const ingredients = (props.ingredients || []).filter(ing => ing.id !== id);
    updateProp('ingredients', ingredients);
  };

  const addStep = () => {
    const newStep: RecipeStep = {
      id: `step-${Date.now()}`,
      stepNumber: (props.steps?.length || 0) + 1,
      instruction: ''
    };
    updateProp('steps', [...(props.steps || []), newStep]);
  };

  const updateStep = (id: string, updates: Partial<RecipeStep>) => {
    const steps = (props.steps || []).map((step, index) => {
      if (step.id === id) {
        const updated = { ...step, ...updates };
        // Auto-update step number based on position if not explicitly set
        if (!updates.stepNumber && !updates.id) {
          updated.stepNumber = index + 1;
        }
        return updated;
      }
      return step;
    });
    updateProp('steps', steps);
  };

  const removeStep = (id: string) => {
    const steps = (props.steps || [])
      .filter(step => step.id !== id)
      .map((step, index) => ({ ...step, stepNumber: index + 1 }));
    updateProp('steps', steps);
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const steps = [...(props.steps || [])];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= steps.length) return;
    
    [steps[index], steps[newIndex]] = [steps[newIndex], steps[index]];
    
    // Update step numbers
    steps.forEach((step, i) => {
      step.stepNumber = i + 1;
    });
    
    updateProp('steps', steps);
  };

  const addCategory = () => {
    const categories = [...(props.categories || []), ''];
    updateProp('categories', categories);
  };

  const updateCategory = (index: number, value: string) => {
    const categories = [...(props.categories || [])];
    categories[index] = value;
    updateProp('categories', categories.filter(c => c.trim() !== ''));
  };

  const removeCategory = (index: number) => {
    const categories = [...(props.categories || [])];
    categories.splice(index, 1);
    updateProp('categories', categories);
  };

  const addTag = () => {
    const tags = [...(props.tags || []), ''];
    updateProp('tags', tags);
  };

  const updateTag = (index: number, value: string) => {
    const tags = [...(props.tags || [])];
    tags[index] = value;
    updateProp('tags', tags.filter(t => t.trim() !== ''));
  };

  const removeTag = (index: number) => {
    const tags = [...(props.tags || [])];
    tags.splice(index, 1);
    updateProp('tags', tags);
  };

  const updateTime = (key: keyof RecipeTime, value: string) => {
    const time = { ...(props.time || {}), [key]: value };
    updateProp('time', time);
  };

  const updateNutritionalInfo = (key: keyof NutritionalInfo, value: any) => {
    const nutritionalInfo = { ...(props.nutritionalInfo || {}), [key]: value };
    updateProp('nutritionalInfo', nutritionalInfo);
  };

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveSection('basic')}
          className={`px-4 py-2 font-medium text-sm ${
            activeSection === 'basic'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Basic Info
        </button>
        <button
          onClick={() => setActiveSection('ingredients')}
          className={`px-4 py-2 font-medium text-sm ${
            activeSection === 'ingredients'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Ingredients
        </button>
        <button
          onClick={() => setActiveSection('steps')}
          className={`px-4 py-2 font-medium text-sm ${
            activeSection === 'steps'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Steps
        </button>
        <button
          onClick={() => setActiveSection('nutrition')}
          className={`px-4 py-2 font-medium text-sm ${
            activeSection === 'nutrition'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Nutrition
        </button>
      </div>

      {/* Basic Info Section */}
      {activeSection === 'basic' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Recipe Title *</label>
            <input
              type="text"
              value={props.title || ''}
              onChange={(e) => updateProp('title', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="e.g., Classic Chocolate Chip Cookies"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={props.description || ''}
              onChange={(e) => updateProp('description', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              rows={3}
              placeholder="A brief description of the recipe..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Hero Image URL</label>
            <input
              type="text"
              value={props.heroImage || ''}
              onChange={(e) => updateProp('heroImage', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">Main image displayed at the top of the recipe</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Hero Image Alt Text</label>
            <input
              type="text"
              value={props.heroImageAlt || ''}
              onChange={(e) => updateProp('heroImageAlt', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Recipe hero image"
            />
          </div>

          {/* Time & Servings */}
          <div className="space-y-3 pt-3 border-t">
            <h4 className="font-medium">Time & Servings</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Prep Time</label>
                <input
                  type="text"
                  value={props.time?.prepTime || ''}
                  onChange={(e) => updateTime('prepTime', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="15 minutes"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Cook Time</label>
                <input
                  type="text"
                  value={props.time?.cookTime || ''}
                  onChange={(e) => updateTime('cookTime', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="30 minutes"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Total Time</label>
                <input
                  type="text"
                  value={props.time?.totalTime || ''}
                  onChange={(e) => updateTime('totalTime', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="45 minutes"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Servings</label>
                <input
                  type="number"
                  value={props.time?.servings || ''}
                  onChange={(e) => updateTime('servings', parseInt(e.target.value) || undefined)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="4"
                />
              </div>
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium mb-1">Difficulty</label>
            <select
              value={props.difficulty || ''}
              onChange={(e) => updateProp('difficulty', e.target.value || undefined)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Select difficulty</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium mb-1">Categories</label>
            <div className="space-y-2">
              {(props.categories || []).map((category, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => updateCategory(index, e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                    placeholder="e.g., Dessert, Breakfast"
                  />
                  <button
                    onClick={() => removeCategory(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={addCategory}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add Category
              </button>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-1">Tags</label>
            <div className="space-y-2">
              {(props.tags || []).map((tag, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => updateTag(index, e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                    placeholder="e.g., vegetarian, quick"
                  />
                  <button
                    onClick={() => removeTag(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={addTag}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add Tag
              </button>
            </div>
          </div>

          {/* Display Options */}
          <div className="space-y-3 pt-3 border-t">
            <h4 className="font-medium">Display Options</h4>
            
            <div>
              <label className="block text-sm font-medium mb-1">Layout</label>
              <select
                value={props.layout || 'single-column'}
                onChange={(e) => updateProp('layout', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="single-column">Single Column</option>
                <option value="two-column">Two Column</option>
                <option value="card">Card</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Card Style</label>
              <select
                value={props.cardStyle || 'elevated'}
                onChange={(e) => updateProp('cardStyle', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="flat">Flat</option>
                <option value="elevated">Elevated</option>
                <option value="bordered">Bordered</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Step Numbering Style</label>
              <select
                value={props.stepNumberingStyle || 'numbers'}
                onChange={(e) => updateProp('stepNumberingStyle', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="numbers">Numbers</option>
                <option value="icons">Icons</option>
                <option value="none">None</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={props.showHeroImage !== false}
                  onChange={(e) => updateProp('showHeroImage', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Show Hero Image</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={props.showTime !== false}
                  onChange={(e) => updateProp('showTime', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Show Time Information</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={props.showDifficulty !== false}
                  onChange={(e) => updateProp('showDifficulty', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Show Difficulty</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={props.showCategories !== false}
                  onChange={(e) => updateProp('showCategories', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Show Categories</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={props.showTags !== false}
                  onChange={(e) => updateProp('showTags', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Show Tags</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={props.showIngredients !== false}
                  onChange={(e) => updateProp('showIngredients', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Show Ingredients</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={props.showSteps !== false}
                  onChange={(e) => updateProp('showSteps', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Show Steps</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={props.showNutritionalInfo || false}
                  onChange={(e) => updateProp('showNutritionalInfo', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Show Nutritional Information</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Ingredients Section */}
      {activeSection === 'ingredients' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Ingredients</h4>
            <button
              onClick={addIngredient}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Ingredient
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Ingredients Section Title</label>
            <input
              type="text"
              value={props.ingredientsTitle || 'Ingredients'}
              onChange={(e) => updateProp('ingredientsTitle', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="space-y-3">
            {(props.ingredients || []).map((ingredient, index) => (
              <div key={ingredient.id || index} className="p-4 border rounded-lg space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-600 mb-1">Name *</label>
                    <input
                      type="text"
                      value={ingredient.name || ''}
                      onChange={(e) => updateIngredient(ingredient.id, { name: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      placeholder="e.g., All-purpose flour"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Quantity</label>
                    <input
                      type="text"
                      value={ingredient.quantity || ''}
                      onChange={(e) => updateIngredient(ingredient.id, { quantity: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      placeholder="2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Unit</label>
                    <input
                      type="text"
                      value={ingredient.unit || ''}
                      onChange={(e) => updateIngredient(ingredient.id, { unit: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      placeholder="cups"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={ingredient.optional || false}
                      onChange={(e) => updateIngredient(ingredient.id, { optional: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-600">Optional</span>
                  </label>
                  <button
                    onClick={() => removeIngredient(ingredient.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {(!props.ingredients || props.ingredients.length === 0) && (
              <p className="text-sm text-gray-500 text-center py-4">No ingredients added yet</p>
            )}
          </div>
        </div>
      )}

      {/* Steps Section */}
      {activeSection === 'steps' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Instructions</h4>
            <button
              onClick={addStep}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Step
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Instructions Section Title</label>
            <input
              type="text"
              value={props.instructionsTitle || 'Instructions'}
              onChange={(e) => updateProp('instructionsTitle', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="space-y-4">
            {(props.steps || []).map((step, index) => (
              <div key={step.id || index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">Step {step.stepNumber || index + 1}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {index > 0 && (
                      <button
                        onClick={() => moveStep(index, 'up')}
                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
                        title="Move up"
                      >
                        <GripVertical className="w-4 h-4 rotate-90" />
                      </button>
                    )}
                    {index < (props.steps?.length || 0) - 1 && (
                      <button
                        onClick={() => moveStep(index, 'down')}
                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
                        title="Move down"
                      >
                        <GripVertical className="w-4 h-4 -rotate-90" />
                      </button>
                    )}
                    <button
                      onClick={() => removeStep(step.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Instruction *</label>
                  <textarea
                    value={step.instruction || ''}
                    onChange={(e) => updateStep(step.id, { instruction: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    rows={3}
                    placeholder="Describe what to do in this step..."
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Step Image URL</label>
                  <input
                    type="text"
                    value={step.imageUrl || ''}
                    onChange={(e) => updateStep(step.id, { imageUrl: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder="https://example.com/step-image.jpg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Video Type</label>
                    <select
                      value={step.videoType || ''}
                      onChange={(e) => updateStep(step.id, { videoType: e.target.value || undefined })}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    >
                      <option value="">None</option>
                      <option value="youtube">YouTube</option>
                      <option value="vimeo">Vimeo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Step Duration</label>
                    <input
                      type="text"
                      value={step.duration || ''}
                      onChange={(e) => updateStep(step.id, { duration: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      placeholder="5 minutes"
                    />
                  </div>
                </div>

                {step.videoType && (
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Video URL</label>
                    <input
                      type="text"
                      value={step.videoUrl || ''}
                      onChange={(e) => updateStep(step.id, { videoUrl: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      placeholder={step.videoType === 'youtube' ? 'https://youtube.com/watch?v=...' : 'https://vimeo.com/...'}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Paste the full {step.videoType === 'youtube' ? 'YouTube' : 'Vimeo'} URL
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Tips (Optional)</label>
                  <input
                    type="text"
                    value={step.tips || ''}
                    onChange={(e) => updateStep(step.id, { tips: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder="Helpful tip for this step..."
                  />
                </div>
              </div>
            ))}
            {(!props.steps || props.steps.length === 0) && (
              <p className="text-sm text-gray-500 text-center py-4">No steps added yet</p>
            )}
          </div>
        </div>
      )}

      {/* Nutrition Section */}
      {activeSection === 'nutrition' && (
        <div className="space-y-4">
          <h4 className="font-medium">Nutritional Information</h4>
          
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={props.showNutritionalInfo || false}
                onChange={(e) => updateProp('showNutritionalInfo', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Show Nutritional Information</span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Calories</label>
              <input
                type="number"
                value={props.nutritionalInfo?.calories || ''}
                onChange={(e) => updateNutritionalInfo('calories', parseInt(e.target.value) || undefined)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                placeholder="250"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Servings</label>
              <input
                type="number"
                value={props.nutritionalInfo?.servings || ''}
                onChange={(e) => updateNutritionalInfo('servings', parseInt(e.target.value) || undefined)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                placeholder="1"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Protein</label>
              <input
                type="text"
                value={props.nutritionalInfo?.protein || ''}
                onChange={(e) => updateNutritionalInfo('protein', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                placeholder="10g"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Carbs</label>
              <input
                type="text"
                value={props.nutritionalInfo?.carbs || ''}
                onChange={(e) => updateNutritionalInfo('carbs', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                placeholder="30g"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Fat</label>
              <input
                type="text"
                value={props.nutritionalInfo?.fat || ''}
                onChange={(e) => updateNutritionalInfo('fat', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                placeholder="8g"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Fiber</label>
              <input
                type="text"
                value={props.nutritionalInfo?.fiber || ''}
                onChange={(e) => updateNutritionalInfo('fiber', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                placeholder="5g"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Sugar</label>
              <input
                type="text"
                value={props.nutritionalInfo?.sugar || ''}
                onChange={(e) => updateNutritionalInfo('sugar', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                placeholder="15g"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Sodium</label>
              <input
                type="text"
                value={props.nutritionalInfo?.sodium || ''}
                onChange={(e) => updateNutritionalInfo('sodium', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                placeholder="200mg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

