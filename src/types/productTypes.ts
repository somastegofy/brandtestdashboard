export interface Product {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  mrp: number;
  categoryId: string; // Links to subcategory ID
  subcategoryId: string; // Direct link to subcategory
  images: string[];
  videos: string[];
  productBanner: string;
  status: 'published' | 'draft' | 'archived';
  qrStatus: 'generated' | 'not-generated';
  qrCodeUrl: string;
  studioPageLinked: boolean;
  barcode: string;
  enableBarcodeLinking: boolean;
  createdAt: string;
  
  // Advanced product information
  ingredients: string[]; // For paragraph format
  ingredientsTableFormat: Ingredient[]; // For table format
  ingredientsFormat: 'paragraph' | 'table';
  nutritionInfo: NutritionInfo[];
  keyBenefits: string[];
  usageInstructions: string[];
  technicalSpecs: TechnicalSpec[];
  weight: string;
  dimensions: string;
  sustainabilityFlags: SustainabilityFlags;
  certifications: string[];
  manufacturingAddress: string;
  expiryDate: string | null;
  warrantyDurationMonths: number | null;
  
  // Identifier options
  barcodeNumber: string;
  skuCode: string;
  productCode: string; // Auto-generated
  autoGenerateQr: boolean;
  
  // Studio integration
  studioPageStatus: 'linked' | 'default';
  lastUpdated: string;
  pageViews: number;
}

export interface Ingredient {
  name: string;
  quantity: string;
  quantityUnit: 'weight' | 'percentage';
  measurementUnit: string;
  productVariant: string;
}
export interface NutritionInfo {
  nutrientName: string;
  contains: string;
  measurementUnit: string;
  perServeQuantity: string;
  rdaPercentage: string;
}

export interface TechnicalSpec {
  label: string;
  value: string;
}

export interface SustainabilityFlags {
  recyclable: boolean;
  compostable: boolean;
  carbonNeutral: boolean;
}

export interface Category {
  id: string;
  name: string;
  type: 'category' | 'subcategory';
  parentCategoryId?: string; // Only for subcategories
  productCount: number;
  createdAt: string;
}

export interface CategoryHierarchy {
  category: Category;
  subcategories: Category[];
  totalProducts: number;
}

// Dropdown options for ingredients
export const INGREDIENT_QUANTITY_UNITS = [
  { value: 'weight', label: 'Weight' },
  { value: 'percentage', label: 'Percentage' }
];
// Predefined certification options
export const CERTIFICATION_OPTIONS = [
  'FSSAI',
  'Organic India',
  'Vegan Certified',
  'ISO 9001',
  'ISO 14001',
  'BIS',
  'HACCP',
  'GMP',
  'Halal',
  'Kosher',
  'Fair Trade',
  'Rainforest Alliance',
  'USDA Organic',
  'EU Organic',
  'Cruelty Free',
  'Non-GMO',
  'Gluten Free',
  'Keto Friendly'
];

export const INGREDIENT_MEASUREMENT_UNITS = [
  'Kg', 'Grams', 'Milligrams', 'Liters', 'Milliliters', '%'
];

export const PRODUCT_VARIANTS = [
  '50G', '100G', '250G', '500G', '1Kg', '2Kg', '5Kg',
  '100ml', '250ml', '500ml', '1L', '2L'
];

// Dropdown options for nutrition info
export const NUTRITION_MEASUREMENT_UNITS = [
  'Kcal', 'Grams', 'Milligrams', 'Micrograms', 'IU'
];

export const PER_SERVE_QUANTITIES = [
  '11G', '15G', '20G', '25G', '30G', '50G', '100G'
];

export const RDA_PERCENTAGES = [
  '5%', '10%', '15%', '20%', '25%', '30%', '50%', '75%', '100%'
];

// Sample categories for demonstration
export const SAMPLE_CATEGORIES: CategoryHierarchy[] = [
  {
    category: { id: 'food', name: 'Food & Beverages', type: 'category', productCount: 0, createdAt: '2024-01-01' },
    subcategories: [
      { id: 'honey', name: 'Honey & Sweeteners', type: 'subcategory', parentCategoryId: 'food', productCount: 0, createdAt: '2024-01-01' },
      { id: 'tea', name: 'Tea & Coffee', type: 'subcategory', parentCategoryId: 'food', productCount: 0, createdAt: '2024-01-01' },
      { id: 'snacks', name: 'Snacks', type: 'subcategory', parentCategoryId: 'food', productCount: 0, createdAt: '2024-01-01' }
    ],
    totalProducts: 0
  },
  {
    category: { id: 'personal-care', name: 'Personal Care', type: 'category', productCount: 0, createdAt: '2024-01-01' },
    subcategories: [
      { id: 'soap', name: 'Soaps & Cleansers', type: 'subcategory', parentCategoryId: 'personal-care', productCount: 0, createdAt: '2024-01-01' },
      { id: 'shampoo', name: 'Hair Care', type: 'subcategory', parentCategoryId: 'personal-care', productCount: 0, createdAt: '2024-01-01' },
      { id: 'skincare', name: 'Skin Care', type: 'subcategory', parentCategoryId: 'personal-care', productCount: 0, createdAt: '2024-01-01' }
    ],
    totalProducts: 0
  },
  {
    category: { id: 'home', name: 'Home & Living', type: 'category', productCount: 0, createdAt: '2024-01-01' },
    subcategories: [
      { id: 'cleaning', name: 'Cleaning Products', type: 'subcategory', parentCategoryId: 'home', productCount: 0, createdAt: '2024-01-01' },
      { id: 'decor', name: 'Home Decor', type: 'subcategory', parentCategoryId: 'home', productCount: 0, createdAt: '2024-01-01' },
      { id: 'kitchen', name: 'Kitchen & Dining', type: 'subcategory', parentCategoryId: 'home', productCount: 0, createdAt: '2024-01-01' }
    ],
    totalProducts: 0
  }
];