import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  QrCode, 
  Package, 
  TrendingUp, 
  BarChart3, 
  Calendar, 
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  FileText,
  Tag,
  Award,
  Leaf,
  Shield,
  Globe,
  Download,
  RefreshCw,
  Grid,
  List,
  Star,
  Users,
  ShoppingCart,
  FolderPlus
} from 'lucide-react';
import ProductCreationModal from './ProductCreationModal';
import CategoryCreationModal from './CategoryCreationModal';
import SubcategoryCreationModal from './SubcategoryCreationModal';
import { Product, CategoryHierarchy, Category } from '../types/productTypes';

interface ProductsTabProps {
  onTabChange: (tab: string) => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categoriesState: CategoryHierarchy[];
  setCategoriesState: React.Dispatch<React.SetStateAction<CategoryHierarchy[]>>;
  onRedirectToStudio: (product: Product) => void;
}

const ProductsTab: React.FC<ProductsTabProps> = ({ 
  onTabChange, 
  products, 
  setProducts, 
  categoriesState, 
  setCategoriesState,
  onRedirectToStudio
}) => {
  const [activeProductSubTab, setActiveProductSubTab] = useState<'products' | 'categories'>('products');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCategoryCreationModal, setShowCategoryCreationModal] = useState(false);
  const [showSubcategoryCreationModal, setShowSubcategoryCreationModal] = useState(false);
  const [selectedParentCategory, setSelectedParentCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get existing barcodes for validation
  const existingBarcodes = products
    .filter(product => product.barcodeNumber)
    .map(product => product.barcodeNumber);

  // Get existing category and subcategory names for validation
  const existingCategoryNames = categoriesState.map(cat => cat.category.name);
  const getExistingSubcategoryNames = (parentCategoryId: string) => {
    const parentCategory = categoriesState.find(cat => cat.category.id === parentCategoryId);
    return parentCategory ? parentCategory.subcategories.map(sub => sub.name) : [];
  };

  // Filter products based on search and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Handle saving new category
  const handleSaveNewCategory = (categoryName: string) => {
    const newCategory: CategoryHierarchy = {
      category: {
        id: `cat-${Date.now()}`,
        name: categoryName,
        type: 'category',
        productCount: 0,
        createdAt: new Date().toISOString()
      },
      subcategories: [],
      totalProducts: 0
    };

    setCategoriesState(prev => [...prev, newCategory]);
  };

  // Handle saving new subcategory
  const handleSaveNewSubcategory = (subcategoryName: string, parentCategoryId: string) => {
    const newSubcategory: Category = {
      id: `sub-${Date.now()}`,
      name: subcategoryName,
      type: 'subcategory',
      parentCategoryId,
      productCount: 0,
      createdAt: new Date().toISOString()
    };

    setCategoriesState(prev => 
      prev.map(catHierarchy => 
        catHierarchy.category.id === parentCategoryId
          ? {
              ...catHierarchy,
              subcategories: [...catHierarchy.subcategories, newSubcategory]
            }
          : catHierarchy
      )
    );
  };

  // Open subcategory modal with selected parent category
  const openSubcategoryModal = (parentCategory: Category) => {
    setSelectedParentCategory(parentCategory);
    setShowSubcategoryCreationModal(true);
  };

  // Handle saving new product
  const handleSaveProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'lastUpdated'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    setProducts(prevProducts => [...prevProducts, newProduct]);
    setShowCreateModal(false);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      draft: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      archived: { color: 'bg-gray-100 text-gray-800', icon: AlertCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Get QR status badge
  const getQRStatusBadge = (qrStatus: string, studioPageStatus: string) => {
    if (qrStatus === 'not-generated') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <AlertCircle className="w-3 h-3 mr-1" />
          No QR Code
        </span>
      );
    }

    if (studioPageStatus === 'linked') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Linked to Custom Page
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        <FileText className="w-3 h-3 mr-1" />
        Using Default View
      </span>
    );
  };

  // Get category name
  const getCategoryName = (categoryId: string) => {
    const category = categoriesState.find(cat => cat.category.id === categoryId);
    return category ? category.category.name : 'Unknown';
  };

  // Render category management UI
  const renderCategoryManagement = () => (
    <div className="space-y-6">
      {/* Category Management Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Category Management</h2>
          <p className="text-gray-600">Organize your products with categories and subcategories</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCategoryCreationModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </button>
        </div>
      </div>

      {/* Categories Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <FolderPlus className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{categoriesState.length}</h3>
          <p className="text-gray-600">Total Categories</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Tag className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {categoriesState.reduce((total, cat) => total + cat.subcategories.length, 0)}
          </h3>
          <p className="text-gray-600">Total Subcategories</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{products.length}</h3>
          <p className="text-gray-600">Total Products</p>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subcategories</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categoriesState.map((categoryHierarchy) => {
                const categoryProducts = products.filter(p => p.categoryId === categoryHierarchy.category.id);
                
                return (
                  <tr key={categoryHierarchy.category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                          <FolderPlus className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{categoryHierarchy.category.name}</div>
                          <div className="text-sm text-gray-500">Main Category</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {categoryHierarchy.subcategories.length > 0 ? (
                          categoryHierarchy.subcategories.map((subcategory) => (
                            <div key={subcategory.id} className="flex items-center space-x-2">
                              <Tag className="w-3 h-3 text-green-500" />
                              <span className="text-sm text-gray-700">{subcategory.name}</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500">No subcategories</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{categoryProducts.length}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(categoryHierarchy.category.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openSubcategoryModal(categoryHierarchy.category)}
                          className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Subcategory
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors" title="Edit">
                          <Edit className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-1 hover:bg-red-100 rounded transition-colors text-red-500" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {categoriesState.length === 0 && (
          <div className="text-center py-12">
            <FolderPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first category.</p>
            <button
              onClick={() => setShowCategoryCreationModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Analytics data
  const totalProducts = products.length;
  const publishedProducts = products.filter(p => p.status === 'published').length;
  const draftProducts = products.filter(p => p.status === 'draft').length;
  const qrGeneratedProducts = products.filter(p => p.qrStatus === 'generated').length;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Package className="w-8 h-8 mr-3 text-blue-600" />
            Products
          </h1>
          <p className="text-gray-600">Manage your product catalog and QR code generation</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
          {activeProductSubTab === 'products' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Product
            </button>
          )}
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="bg-white rounded-lg border border-gray-200 p-1">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveProductSubTab('categories')}
            className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeProductSubTab === 'categories'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <FolderPlus className={`w-4 h-4 mr-2 ${activeProductSubTab === 'categories' ? 'text-blue-600' : 'text-gray-400'}`} />
            <span>Categories</span>
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              activeProductSubTab === 'categories' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {categoriesState.length}
            </span>
          </button>
          <button
            onClick={() => setActiveProductSubTab('products')}
            className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeProductSubTab === 'products'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Package className={`w-4 h-4 mr-2 ${activeProductSubTab === 'products' ? 'text-blue-600' : 'text-gray-400'}`} />
            <span>Products</span>
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              activeProductSubTab === 'products' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {totalProducts}
            </span>
          </button>
        </div>
      </div>

      {/* Conditional Content Rendering */}
      {activeProductSubTab === 'categories' ? renderCategoryManagement() : (
        <>
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex items-center text-green-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />
              +12%
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{totalProducts}</h3>
          <p className="text-gray-600">Total Products</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{publishedProducts}</h3>
          <p className="text-gray-600">Published</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{draftProducts}</h3>
          <p className="text-gray-600">Drafts</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <QrCode className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{qrGeneratedProducts}</h3>
          <p className="text-gray-600">QR Generated</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search products..."
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              {categoriesState.map(cat => (
                <option key={cat.category.id} value={cat.category.id}>
                  {cat.category.name}
                </option>
              ))}
            </select>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>

            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{product.shortDescription}</p>
                  <div className="flex items-center space-x-2 mb-3">
                    {getStatusBadge(product.status)}
                    {getQRStatusBadge(product.qrStatus, product.studioPageStatus)}
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">MRP:</span>
                  <span className="font-medium text-gray-900">₹{product.mrp}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Category:</span>
                  <span className="text-gray-900">{getCategoryName(product.categoryId)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Page Views:</span>
                  <span className="text-gray-900">{product.pageViews.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Last Updated:</span>
                  <span className="text-gray-900">
                    {new Date(product.lastUpdated).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Sustainability and Certifications */}
              <div className="flex items-center space-x-2 mb-4">
                {product.sustainabilityFlags.recyclable && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Leaf className="w-3 h-3 mr-1" />
                    Recyclable
                  </span>
                )}
                {product.certifications.length > 0 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Award className="w-3 h-3 mr-1" />
                    {product.certifications.length} Cert{product.certifications.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                    <Edit className="w-4 h-4 text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors" title="View">
                    <Eye className="w-4 h-4 text-blue-500" />
                  </button>
                  {product.qrStatus === 'generated' && (
                    <button className="p-2 hover:bg-purple-100 rounded-lg transition-colors" title="QR Code">
                      <QrCode className="w-4 h-4 text-purple-500" />
                    </button>
                  )}
                </div>
                
                {product.studioPageStatus === 'default' && (
                  <button className="inline-flex items-center px-3 py-1 text-xs bg-orange-100 text-orange-800 rounded-full hover:bg-orange-200 transition-colors">
                    <Zap className="w-3 h-3 mr-1" />
                    Enhance Page
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MRP</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QR Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page Views</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                          <Package className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.shortDescription.substring(0, 50)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{getCategoryName(product.categoryId)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">₹{product.mrp}</td>
                    <td className="px-6 py-4">{getStatusBadge(product.status)}</td>
                    <td className="px-6 py-4">{getQRStatusBadge(product.qrStatus, product.studioPageStatus)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{product.pageViews.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors" title="Edit">
                          <Edit className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-1 hover:bg-blue-100 rounded transition-colors" title="View">
                          <Eye className="w-4 h-4 text-blue-500" />
                        </button>
                        {product.qrStatus === 'generated' && (
                          <button className="p-1 hover:bg-purple-100 rounded transition-colors" title="QR Code">
                            <QrCode className="w-4 h-4 text-purple-500" />
                          </button>
                        )}
                        <button className="p-1 hover:bg-red-100 rounded transition-colors text-red-500" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-4">Get started by creating your first product.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Product
          </button>
        </div>
      )}
        </>
      )}

      {/* Product Creation Modal */}
      <ProductCreationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleSaveProduct}
        existingBarcodes={existingBarcodes}
        categories={categoriesState}
        onRedirectToStudio={(product) => {
          setShowCreateModal(false);
          onRedirectToStudio(product);
        }}
      />

      {/* Category Creation Modal */}
      <CategoryCreationModal
        isOpen={showCategoryCreationModal}
        onClose={() => setShowCategoryCreationModal(false)}
        onSave={handleSaveNewCategory}
        existingCategoryNames={existingCategoryNames}
      />

      {/* Subcategory Creation Modal */}
      <SubcategoryCreationModal
        isOpen={showSubcategoryCreationModal}
        onClose={() => {
          setShowSubcategoryCreationModal(false);
          setSelectedParentCategory(null);
        }}
        onSave={handleSaveNewSubcategory}
        parentCategory={selectedParentCategory}
        existingSubcategoryNames={selectedParentCategory ? getExistingSubcategoryNames(selectedParentCategory.id) : []}
      />
    </div>
  );
};

export default ProductsTab;