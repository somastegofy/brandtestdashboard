import React from 'react';
import { RecipesProps, IngredientItem } from './types';
import { Clock, Users, ChefHat, Star, Tag } from 'lucide-react';

interface RecipesComponentProps {
  props: RecipesProps;
  style?: Record<string, any>;
  isSelected?: boolean;
  onClick?: () => void;
  disableLinkNavigation?: boolean;
}

export const RecipesComponent: React.FC<RecipesComponentProps> = ({
  props,
  style = {},
  isSelected = false,
  onClick,
  disableLinkNavigation = false
}) => {
  const {
    title = 'Recipe Title',
    description,
    heroImage,
    heroImageAlt = 'Recipe hero image',
    time,
    difficulty,
    categories = [],
    tags = [],
    ingredients = [],
    ingredientsTitle = 'Ingredients',
    steps = [],
    instructionsTitle = 'Instructions',
    stepNumberingStyle = 'numbers',
    nutritionalInfo,
    showNutritionalInfo = false,
    layout = 'single-column',
    cardStyle = 'elevated',
    showHeroImage = true,
    showTime = true,
    showDifficulty = true,
    showCategories = true,
    showTags = true,
    showIngredients = true,
    showSteps = true,
    stepImageAspectRatio = '16:9',
    stepVideoAspectRatio = '16:9',
    spacing = '24px',
    backgroundColor,
    textColor,
    borderRadius = '12px'
  } = props;

  // Extract video ID helpers (similar to Video component)
  const getYouTubeVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
      return url;
    }
    
    return null;
  };

  const getVimeoVideoId = (url: string): string | null => {
    const patterns = [
      /(?:vimeo\.com\/)(\d+)/,
      /(?:player\.vimeo\.com\/video\/)(\d+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    
    return null;
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-orange-600 bg-orange-100';
      case 'Expert': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyIcon = (difficulty?: string) => {
    switch (difficulty) {
      case 'Easy': return <Star className="w-4 h-4" />;
      case 'Medium': return <Star className="w-4 h-4" />;
      case 'Hard': return <ChefHat className="w-4 h-4" />;
      case 'Expert': return <ChefHat className="w-4 h-4" />;
      default: return <ChefHat className="w-4 h-4" />;
    }
  };

  const aspectRatioClass = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
    '3:4': 'aspect-[3/4]',
    'auto': ''
  };

  const containerStyle: React.CSSProperties = {
    backgroundColor: backgroundColor || '#ffffff',
    color: textColor || '#000000',
    borderRadius: borderRadius,
    padding: spacing,
    gap: spacing,
    ...style
  };

  const cardClasses = {
    flat: 'bg-white',
    elevated: 'bg-white shadow-lg',
    bordered: 'bg-white border-2 border-gray-200'
  };

  if (steps.length === 0 && ingredients.length === 0) {
    return (
      <div style={containerStyle} className={`p-8 border-2 border-dashed border-gray-300 rounded-lg ${cardClasses[cardStyle]}`}>
        <p className="text-gray-500 text-center">No recipe content added. Add ingredients and steps in settings.</p>
      </div>
    );
  }

  const renderStepMedia = (step: RecipesProps['steps'][0]) => {
    if (step.videoUrl && step.videoType) {
      const videoId = step.videoType === 'youtube' 
        ? getYouTubeVideoId(step.videoUrl)
        : getVimeoVideoId(step.videoUrl);

      if (videoId) {
        const embedUrl = step.videoType === 'youtube'
          ? `https://www.youtube.com/embed/${videoId}`
          : `https://player.vimeo.com/video/${videoId}`;

        return (
          <div className={`w-full ${aspectRatioClass[stepVideoAspectRatio] || 'aspect-video'}`}>
            <iframe
              src={embedUrl}
              className="w-full h-full rounded-lg border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={step.videoTitle || `Step ${step.stepNumber} video`}
            />
          </div>
        );
      }
    }

    if (step.imageUrl) {
      return (
        <div className={`w-full ${aspectRatioClass[stepImageAspectRatio] || 'aspect-video'} overflow-hidden rounded-lg`}>
          <img
            src={step.imageUrl}
            alt={`Step ${step.stepNumber}`}
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

    return null;
  };

  const renderIngredients = () => {
    if (!showIngredients || ingredients.length === 0) return null;

    return (
      <div className="space-y-3">
        <h3 className="text-xl font-semibold mb-4">{ingredientsTitle}</h3>
        <div className="space-y-2">
          {ingredients.map((item: IngredientItem, index: number) => (
            <div key={item.id || index} className="flex items-start gap-2">
              <span className="text-gray-500 mt-1">•</span>
              <span className="flex-1">
                {item.quantity && <span className="font-medium">{item.quantity} </span>}
                {item.unit && <span>{item.unit} </span>}
                <span>{item.name}</span>
                {item.optional && <span className="text-gray-500 italic"> (optional)</span>}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSteps = () => {
    if (!showSteps || steps.length === 0) return null;

    return (
      <div className="space-y-6">
        {instructionsTitle && (
          <h3 className="text-xl font-semibold mb-4">{instructionsTitle}</h3>
        )}
        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={step.id || index} className="flex gap-4">
              {/* Step Number/Icon */}
              <div className="flex-shrink-0">
                {stepNumberingStyle === 'numbers' && (
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-semibold">
                    {step.stepNumber || index + 1}
                  </div>
                )}
                {stepNumberingStyle === 'icons' && (
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600">
                    <ChefHat className="w-5 h-5" />
                  </div>
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1 space-y-3">
                <p className="text-base leading-relaxed">{step.instruction}</p>
                
                {/* Media */}
                {renderStepMedia(step)}
                
                {/* Step duration and tips */}
                {(step.duration || step.tips) && (
                  <div className="text-sm text-gray-600 space-y-1">
                    {step.duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{step.duration}</span>
                      </div>
                    )}
                    {step.tips && (
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2 rounded">
                        <span className="font-medium text-yellow-800">Tip: </span>
                        <span className="text-yellow-700">{step.tips}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderNutritionalInfo = () => {
    if (!showNutritionalInfo || !nutritionalInfo) return null;

    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-3">Nutritional Information</h4>
        {nutritionalInfo.servings && (
          <p className="text-sm text-gray-600 mb-3">Per {nutritionalInfo.servings} serving(s)</p>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          {nutritionalInfo.calories && (
            <div>
              <span className="text-gray-600">Calories: </span>
              <span className="font-medium">{nutritionalInfo.calories}</span>
            </div>
          )}
          {nutritionalInfo.protein && (
            <div>
              <span className="text-gray-600">Protein: </span>
              <span className="font-medium">{nutritionalInfo.protein}</span>
            </div>
          )}
          {nutritionalInfo.carbs && (
            <div>
              <span className="text-gray-600">Carbs: </span>
              <span className="font-medium">{nutritionalInfo.carbs}</span>
            </div>
          )}
          {nutritionalInfo.fat && (
            <div>
              <span className="text-gray-600">Fat: </span>
              <span className="font-medium">{nutritionalInfo.fat}</span>
            </div>
          )}
          {nutritionalInfo.fiber && (
            <div>
              <span className="text-gray-600">Fiber: </span>
              <span className="font-medium">{nutritionalInfo.fiber}</span>
            </div>
          )}
          {nutritionalInfo.sugar && (
            <div>
              <span className="text-gray-600">Sugar: </span>
              <span className="font-medium">{nutritionalInfo.sugar}</span>
            </div>
          )}
          {nutritionalInfo.sodium && (
            <div>
              <span className="text-gray-600">Sodium: </span>
              <span className="font-medium">{nutritionalInfo.sodium}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={containerStyle} className={`${cardClasses[cardStyle]} ${layout === 'card' ? 'p-6' : ''}`}>
      {/* Hero Image */}
      {showHeroImage && heroImage && (
        <div className="w-full mb-6 rounded-lg overflow-hidden">
          <div className="aspect-video w-full">
            <img
              src={heroImage}
              alt={heroImageAlt}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Recipe Header */}
      <div className="space-y-4 mb-6">
        <h1 className="text-3xl font-bold">{title}</h1>
        {description && <p className="text-lg text-gray-700">{description}</p>}

        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          {showTime && time && (
            <>
              {time.prepTime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Prep: {time.prepTime}</span>
                </div>
              )}
              {time.cookTime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Cook: {time.cookTime}</span>
                </div>
              )}
              {time.totalTime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Total: {time.totalTime}</span>
                </div>
              )}
              {time.servings && (
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{time.servings} servings</span>
                </div>
              )}
            </>
          )}

          {showDifficulty && difficulty && (
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${getDifficultyColor(difficulty)}`}>
              {getDifficultyIcon(difficulty)}
              <span className="font-medium">{difficulty}</span>
            </div>
          )}
        </div>

        {/* Categories */}
        {showCategories && categories.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((category, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
              >
                {category}
              </span>
            ))}
          </div>
        )}

        {/* Tags */}
        {showTags && tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <Tag className="w-4 h-4 text-gray-500" />
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Two-column layout */}
      {layout === 'two-column' ? (
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            {renderIngredients()}
            {renderNutritionalInfo()}
          </div>
          <div>
            {renderSteps()}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {renderIngredients()}
          {renderSteps()}
          {renderNutritionalInfo()}
        </div>
      )}
    </div>
  );
};

export const getRecipesDefaultProps = (): RecipesProps => ({
  title: 'Delicious Recipe',
  description: 'A mouth-watering recipe that will delight your taste buds',
  ingredientsTitle: 'Ingredients',
  instructionsTitle: 'Instructions',
  stepNumberingStyle: 'numbers',
  layout: 'single-column',
  cardStyle: 'elevated',
  showHeroImage: true,
  showTime: true,
  showDifficulty: true,
  showCategories: true,
  showTags: true,
  showIngredients: true,
  showSteps: true,
  showNutritionalInfo: false,
  stepImageAspectRatio: '16:9',
  stepVideoAspectRatio: '16:9',
  spacing: '24px',
  borderRadius: '12px',
  steps: [
    {
      id: 'step-1',
      stepNumber: 1,
      instruction: 'First step instruction goes here'
    }
  ],
  ingredients: [],
  categories: [],
  tags: []
});

