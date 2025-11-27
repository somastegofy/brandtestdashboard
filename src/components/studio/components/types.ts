// Studio Component Types

export interface ComponentStyle {
  margin?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  padding?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  backgroundColor?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  borderRadius?: string;
  borderWidth?: string;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';
  width?: string;
  height?: string;
  opacity?: number;
  // Allow additional CSS properties
  [key: string]: any;
}

export interface PageContentBlock {
  id: string;
  type: string;
  props: Record<string, any>;
  style?: ComponentStyle;
}

// Header Component Types
export type HeaderFontWeight = '400' | '500' | '600' | '700';
export type HeaderAlignment = 'left' | 'center' | 'right';
export type HeaderTextTransform = 'none' | 'uppercase' | 'lowercase' | 'capitalize';
export type HeaderLogoTextArrangement =
  | 'top_bottom'
  | 'bottom_top'
  | 'left_right'
  | 'right_left';

export interface HeaderProps {
  logo?: {
    enabled: boolean;
    src?: string;
    alt?: string;
    link?: string;
    openInNewTab?: boolean;
  };
  text?: {
    enabled: boolean;
    content: string;
    fontWeight?: HeaderFontWeight;
    align?: HeaderAlignment;
    textTransform?: HeaderTextTransform;
  };
  sticky?: boolean;
  height?: string;
  layout?: {
    logoTextArrangement?: HeaderLogoTextArrangement;
  };
}

// Images+Link Component Types
export interface ImageLinkItem {
  id: string;
  imageUrl: string;
  alt: string;
  title?: string;
  description?: string;
  link?: string;
  openInNewTab?: boolean;
}

export interface ImagesLinkProps {
  items: ImageLinkItem[];
  layout: 'grid' | 'carousel' | 'list';
  columns?: number; // For grid layout
  spacing?: string;
  imageAspectRatio?: '16:9' | '4:3' | '1:1' | '3:4' | 'auto';
  showTitles?: boolean;
  showDescriptions?: boolean;
  imageBorderRadius?: string;
  hoverEffect?: 'none' | 'zoom' | 'fade' | 'lift';
  cardTitle?: string;
  cardDescription?: string;
  contentDisplay?: 'overlay' | 'below' | 'above';
}

// Buttons Component Types
export interface ButtonItem {
  id: string;
  text: string;
  title?: string;
  titleAlign?: HeadingAlignmentOption;
  titleFontWeight?: '400' | '500' | '600' | '700';
  description?: string;
  descriptionAlign?: BodyAlignmentOption;
  descriptionFontWeight?: '400' | '500' | '600';
  link?: string;
  style: 'normal' | 'outline';
  rounded?: boolean;
  fontWeight?: '400' | '500' | '600' | '700';
  disabled?: boolean;
  openInNewTab?: boolean;
  type?: 'button' | 'submit';
  icon?: string;
  iconPosition?: 'left' | 'right';
}

export interface ButtonsProps {
  buttons: ButtonItem[];
  layout: 'horizontal' | 'vertical' | 'grid';
  alignment: 'left' | 'center' | 'right' | 'space-between';
  spacing?: string;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

// Heading+Text Component Types
export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type HeadingFontWeight = '400' | '500' | '600' | '700' | '800';
export type BodyFontWeight = '400' | '500' | '600';
export type HeadingTextTransform = 'none' | 'uppercase' | 'lowercase' | 'capitalize';
export type HeadingAlignmentOption = 'left' | 'center' | 'right';
export type BodyAlignmentOption = 'left' | 'center' | 'right' | 'justify';
export type HeadingTextSpacing = 'compact' | 'comfortable' | 'relaxed';

export interface HeadingTextProps {
  heading: {
    text: string;
    level: HeadingLevel;
    fontWeight?: HeadingFontWeight;
    align?: HeadingAlignmentOption;
    textTransform?: HeadingTextTransform;
  };
  text: {
    content: string;
    fontWeight?: BodyFontWeight;
    align?: BodyAlignmentOption;
  };
  spacing?: HeadingTextSpacing;
  alignment?: HeadingAlignmentOption;
}

// Video Component Types
export interface VideoProps {
  videoType: 'youtube' | 'vimeo';
  videoUrl: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  width?: string;
  height?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1' | 'auto';
  borderRadius?: string;
  align?: 'left' | 'center' | 'right';
}

// Image+Text Component Types
export interface ImageTextProps {
  image: {
    url: string;
    alt: string;
    width?: string;
    height?: string;
    align?: 'left' | 'right' | 'center';
  };
  text: {
    heading?: string;
    content: string;
    headingSize?: string;
    contentSize?: string;
    headingColor?: string;
    contentColor?: string;
    headingAlign?: 'left' | 'center' | 'right';
    contentAlign?: 'left' | 'center' | 'right' | 'justify';
  };
  layout: 'image-left' | 'image-right' | 'image-top' | 'image-bottom';
  spacing?: string;
  imageWidth?: string;
  textWidth?: string;
  alignment?: 'left' | 'center' | 'right';
}

// Social Links Component Types
export interface SocialLinkItem {
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'pinterest' | 'tiktok' | 'custom';
  url: string;
  customIcon?: string;
  customLabel?: string;
}

export interface SocialLinksProps {
  links: SocialLinkItem[];
  layout: 'horizontal' | 'vertical' | 'grid';
  size?: 'small' | 'medium' | 'large';
  spacing?: string;
  alignment?: 'left' | 'center' | 'right';
  iconColor?: string;
  hoverColor?: string;
  showLabels?: boolean;
  borderRadius?: string;
}

// Contact Us Component Types
export interface ContactField {
  id: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[]; // For select fields
}

export interface ContactUsProps {
  title?: string;
  subtitle?: string;
  fields: ContactField[];
  buttonText?: string;
  buttonStyle?: 'primary' | 'secondary' | 'outline';
  backgroundColor?: string;
  borderRadius?: string;
  padding?: string;
  alignment?: 'left' | 'center' | 'right';
  formAction?: string;
  formMethod?: 'get' | 'post';
}

// Ingredients Component Types
export interface IngredientItem {
  id: string;
  name: string;
  quantity?: string;
  unit?: string;
  optional?: boolean;
}

export interface IngredientsProps {
  title?: string;
  items: IngredientItem[];
  layout: 'list' | 'grid' | 'columns';
  columns?: number;
  showQuantity?: boolean;
  showUnit?: boolean;
  highlightOptional?: boolean;
  spacing?: string;
  itemStyle?: 'plain' | 'card' | 'bordered';
}

// Address Component Types
export interface AddressProps {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  phone?: string;
  email?: string;
  format: 'single-line' | 'multi-line' | 'labeled';
  alignment?: 'left' | 'center' | 'right';
  fontSize?: string;
  lineHeight?: string;
  spacing?: string;
  showIcons?: boolean;
  iconColor?: string;
}

// Map Component Types
export interface MapProps {
  iframeUrl?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  zoom?: number;
  height?: string;
  style?: 'default' | 'satellite' | 'terrain' | 'roadmap';
  showMarker?: boolean;
  markerLabel?: string;
  borderRadius?: string;
  interactive?: boolean;
}

// Products Component Types
export interface ProductBuyOption {
  id: string;
  label: string;
  type: 'website' | 'amazon' | 'flipkart' | 'whatsapp' | 'custom';
  url: string;
  accentColor?: string;
  icon?: string;
}

export interface ProductPrice {
  amount?: number;
  currency?: string;
  originalAmount?: number;
  badge?: string;
}

export interface ProductRating {
  value?: number;
  count?: number;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface ProductDetailSection {
  id: string;
  title: string;
  content: string;
  icon?: string;
}

export interface ProductLicense {
  id: string;
  name: string;
  licenseId?: string;
  issuer?: string;
  issuedOn?: string;
  validUntil?: string;
  description?: string;
  url?: string;
}

export interface ProductItem {
  id: string;
  name: string;
  subtitle?: string;
  imageUrl: string;
  price?: ProductPrice;
  rating?: ProductRating;
  shortDescription?: string;
  longDescription?: string;
  highlights?: string[];
  badges?: string[];
  stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock' | 'preorder';
  buyOptions: ProductBuyOption[];
  specifications?: ProductSpecification[];
  detailSections?: ProductDetailSection[];
  licenses?: ProductLicense[];
}

export interface ProductsProps {
  title?: string;
  layout: 'grid' | 'list';
  columns?: number;
  cardStyle?: 'flat' | 'elevated' | 'bordered';
  showRatings?: boolean;
  showPrice?: boolean;
  showDescription?: boolean;
  showBuyButtons?: boolean;
  showViewMore?: boolean;
  products: ProductItem[];
}

// Gallery Component Types
export interface GalleryImage {
  id: string;
  url: string;
  alt?: string;
  title?: string;
  description?: string;
}

export interface GalleryProps {
  title?: string;
  layout: 'grid' | 'masonry';
  columns?: number;
  spacing?: string;
  rounded?: string;
  showCaptions?: boolean;
  enableLightbox?: boolean;
  showThumbnailStrip?: boolean;
  allowDownload?: boolean;
  enableKeyboardNavigation?: boolean;
  showImageCount?: boolean;
  images: GalleryImage[];
}

// Recipes Component Types
export interface RecipeStep {
  id: string;
  stepNumber: number;
  instruction: string;
  imageUrl?: string;
  videoUrl?: string;
  videoType?: 'youtube' | 'vimeo';
  videoTitle?: string;
  duration?: string; // e.g., "5 minutes"
  tips?: string;
}

export interface NutritionalInfo {
  calories?: number;
  protein?: string;
  carbs?: string;
  fat?: string;
  fiber?: string;
  sugar?: string;
  sodium?: string;
  servings?: number;
}

export interface RecipeTime {
  prepTime?: string; // e.g., "15 minutes"
  cookTime?: string; // e.g., "30 minutes"
  totalTime?: string; // e.g., "45 minutes"
  servings?: number;
}

export interface RecipesProps {
  // Recipe Metadata
  title: string;
  description?: string;
  heroImage?: string;
  heroImageAlt?: string;
  
  // Time & Servings
  time?: RecipeTime;
  difficulty?: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  
  // Categories/Tags
  categories?: string[];
  tags?: string[];
  
  // Ingredients
  ingredients?: IngredientItem[];
  ingredientsTitle?: string;
  
  // Instructions
  steps: RecipeStep[];
  instructionsTitle?: string;
  stepNumberingStyle?: 'numbers' | 'icons' | 'none';
  
  // Nutritional Information
  nutritionalInfo?: NutritionalInfo;
  showNutritionalInfo?: boolean;
  
  // Display Options
  layout?: 'single-column' | 'two-column' | 'card';
  cardStyle?: 'flat' | 'elevated' | 'bordered';
  showHeroImage?: boolean;
  showTime?: boolean;
  showDifficulty?: boolean;
  showCategories?: boolean;
  showTags?: boolean;
  showIngredients?: boolean;
  showSteps?: boolean;
  stepImageAspectRatio?: '16:9' | '4:3' | '1:1' | '3:4' | 'auto';
  stepVideoAspectRatio?: '16:9' | '4:3' | '1:1' | 'auto';
  spacing?: string;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: string;
}

// Nutrition Table Component Types
export interface NutritionNutrient {
  id: string;
  name: string;
  amount?: string;
  subText?: string;
  highlight?: boolean;
}

export interface MacroSummaryItem {
  amount?: string;
}

export interface NutritionTableProps {
  title?: string;
  subtitle?: string;
  servingSize?: string;
  servingsPerContainer?: string;
  calories?: number;
  caloriesFromFat?: number;
  note?: string;
  highlightColor?: string;
  layout?: 'classic' | 'modern';
  showCaloriesFromFat?: boolean;
  showFootnotes?: boolean;
  footnotes?: string[];
  nutrients: NutritionNutrient[];
  basisType?: 'per_serving' | 'per_100g' | 'per_portion' | 'custom';
  customBasisLabel?: string;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: string;
  showAllergens?: boolean;
  allergens?: string[];
  sourceDisclosure?: string;
  showMacroSummary?: boolean;
  macroSummary?: {
    fat?: MacroSummaryItem;
    carbohydrates?: MacroSummaryItem;
    protein?: MacroSummaryItem;
    fiber?: MacroSummaryItem;
    sugar?: MacroSummaryItem;
  };
}

