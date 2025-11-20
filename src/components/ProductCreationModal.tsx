import React, { useState } from 'react';
import { 
  X, 
  Save, 
  Upload, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Video, 
  Link, 
  AlertCircle,
  Eye,
  Package,
  Tag,
  Award,
  Leaf,
  Shield,
  Globe,
  BarChart3,
  QrCode,
  ExternalLink,
  Hash,
  Download,
  ToggleLeft,
  ToggleRight,
  Zap,
  FileText,
  Info
} from 'lucide-react';
import { Product, CategoryHierarchy, CERTIFICATION_OPTIONS, INGREDIENT_MEASUREMENT_UNITS, PRODUCT_VARIANTS, NUTRITION_MEASUREMENT_UNITS, PER_SERVE_QUANTITIES, RDA_PERCENTAGES } from '../types/productTypes';

interface MediaItem {
  id: string;
  type: 'url' | 'file';
  value: string; // URL string or file object URL
  file?: File;
  preview?: string;
}

interface ProductCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Omit<Product, 'id' | 'createdAt' | 'lastUpdated'>) => void;
  existingBarcodes: string[];
  categories: CategoryHierarchy[];
  onRedirectToStudio: (product: Product) => void;
}

const ProductCreationModal: React.FC<ProductCreationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingBarcodes,
  categories,
  onRedirectToStudio
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'media' | 'details' | 'advanced'>('basic');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Media state
  const [images, setImages] = useState<MediaItem[]>([]);
  const [videos, setVideos] = useState<MediaItem[]>([]);
  const [productBanner, setProductBanner] = useState<MediaItem | null>(null);

  // Basic product information
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    longDescription: '',
    mrp: '',
    categoryId: '',
    subcategoryId: '',
    status: 'draft' as const,
    qrStatus: 'not-generated' as const,
    studioPageLinked: false,
    barcode: '',
    enableBarcodeLinking: true,
    
    // Advanced product information
    ingredients: [''],
    ingredientsTableFormat: [],
    ingredientsFormat: 'paragraph' as const,
    nutritionInfo: [],
    keyBenefits: [''],
    usageInstructions: [''],
    technicalSpecs: [],
    weight: '',
    dimensions: '',
    sustainabilityFlags: {
      recyclable: false,
      compostable: false,
      carbonNeutral: false
    },
    certifications: [] as string[],
    manufacturingAddress: '',
    expiryDate: '',
    warrantyDurationMonths: '',
    
    // Identifier options
    barcodeNumber: '',
    skuCode: '',
    autoGenerateQr: true,
    
    // Studio integration
    studioPageStatus: 'default' as const,
    pageViews: 0
  });

  // Media handling functions
  const generateMediaId = () => `media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const addImageUrl = () => {
    const newImage: MediaItem = {
      id: generateMediaId(),
      type: 'url',
      value: '',
      preview: ''
    };
    setImages([...images, newImage]);
  };

  const addImageFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      const newImages = files.map(file => ({
        id: generateMediaId(),
        type: 'file' as const,
        value: URL.createObjectURL(file),
        file,
        preview: URL.createObjectURL(file)
      }));
      setImages([...images, ...newImages]);
    };
    input.click();
  };

  const updateImageUrl = (id: string, url: string) => {
    setImages(images.map(img => 
      img.id === id 
        ? { ...img, value: url, preview: url }
        : img
    ));
  };

  const removeImage = (id: string) => {
    const imageToRemove = images.find(img => img.id === id);
    if (imageToRemove?.type === 'file' && imageToRemove.value) {
      URL.revokeObjectURL(imageToRemove.value);
    }
    setImages(images.filter(img => img.id !== id));
  };

  const addVideoUrl = () => {
    const newVideo: MediaItem = {
      id: generateMediaId(),
      type: 'url',
      value: '',
      preview: ''
    };
    setVideos([...videos, newVideo]);
  };

  const addVideoFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.multiple = true;
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      const newVideos = files.map(file => ({
        id: generateMediaId(),
        type: 'file' as const,
        value: URL.createObjectURL(file),
        file,
        preview: URL.createObjectURL(file)
      }));
      setVideos([...videos, ...newVideos]);
    };
    input.click();
  };

  const updateVideoUrl = (id: string, url: string) => {
    setVideos(videos.map(video => 
      video.id === id 
        ? { ...video, value: url, preview: url }
        : video
    ));
  };

  const removeVideo = (id: string) => {
    const videoToRemove = videos.find(video => video.id === id);
    if (videoToRemove?.type === 'file' && videoToRemove.value) {
      URL.revokeObjectURL(videoToRemove.value);
    }
    setVideos(videos.filter(video => video.id !== id));
  };

  const setBannerFromUrl = () => {
    const url = prompt('Enter banner image URL:');
    if (url) {
      setProductBanner({
        id: generateMediaId(),
        type: 'url',
        value: url,
        preview: url
      });
    }
  };

  const setBannerFromFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const preview = URL.createObjectURL(file);
        setProductBanner({
          id: generateMediaId(),
          type: 'file',
          value: preview,
          file,
          preview
        });
      }
    };
    input.click();
  };

  const removeBanner = () => {
    if (productBanner?.type === 'file' && productBanner.value) {
      URL.revokeObjectURL(productBanner.value);
    }
    setProductBanner(null);
  };

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = 'Short description is required';
    }

    if (!formData.mrp || parseFloat(formData.mrp) <= 0) {
      newErrors.mrp = 'Valid MRP is required';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    if (!formData.subcategoryId) {
      newErrors.subcategoryId = 'Subcategory is required';
    }

    if (formData.barcodeNumber && existingBarcodes.includes(formData.barcodeNumber)) {
      newErrors.barcodeNumber = 'Barcode already exists';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSave = async () => {
    if (!validateForm()) return;

    // Convert media items to URLs (in a real app, you'd upload files first)
    const imageUrls = images.map(img => {
      if (img.type === 'file') {
        // In a real implementation, you would upload the file to your storage service
        // and return the public URL. For now, we'll use the object URL as a placeholder
        console.warn('File upload not implemented. Using object URL as placeholder.');
        return img.value;
      }
      return img.value;
    }).filter(url => url.trim() !== '');

    const videoUrls = videos.map(video => {
      if (video.type === 'file') {
        // Same as above - in real implementation, upload file and return URL
        console.warn('File upload not implemented. Using object URL as placeholder.');
        return video.value;
      }
      return video.value;
    }).filter(url => url.trim() !== '');

    const bannerUrl = productBanner ? (
      productBanner.type === 'file' 
        ? productBanner.value // In real app, this would be the uploaded URL
        : productBanner.value
    ) : '';

    const productData: Omit<Product, 'id' | 'createdAt' | 'lastUpdated'> = {
      name: formData.name,
      shortDescription: formData.shortDescription,
      longDescription: formData.longDescription,
      mrp: parseFloat(formData.mrp),
      categoryId: formData.categoryId,
      subcategoryId: formData.subcategoryId,
      images: imageUrls,
      videos: videoUrls,
      productBanner: bannerUrl,
      status: formData.status,
      qrStatus: formData.qrStatus,
      qrCodeUrl: formData.autoGenerateQr ? `/product/${formData.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}` : '',
      studioPageLinked: formData.studioPageLinked,
      barcode: formData.barcode,
      enableBarcodeLinking: formData.enableBarcodeLinking,
      
      ingredients: formData.ingredients.filter(ing => ing.trim() !== ''),
      ingredientsTableFormat: formData.ingredientsTableFormat,
      ingredientsFormat: formData.ingredientsFormat,
      nutritionInfo: formData.nutritionInfo,
      keyBenefits: formData.keyBenefits.filter(benefit => benefit.trim() !== ''),
      usageInstructions: formData.usageInstructions.filter(instruction => instruction.trim() !== ''),
      technicalSpecs: formData.technicalSpecs,
      weight: formData.weight,
      dimensions: formData.dimensions,
      sustainabilityFlags: formData.sustainabilityFlags,
      certifications: formData.certifications,
      manufacturingAddress: formData.manufacturingAddress,
      expiryDate: formData.expiryDate || null,
      warrantyDurationMonths: formData.warrantyDurationMonths ? parseInt(formData.warrantyDurationMonths) : null,
      
      barcodeNumber: formData.barcodeNumber,
      skuCode: formData.skuCode,
      productCode: `${formData.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      autoGenerateQr: formData.autoGenerateQr,
      
      studioPageStatus: formData.studioPageStatus,
      pageViews: formData.pageViews
    };

    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    onSave(productData);
    handleClose();
  };

  const handleClose = () => {
    // Clean up object URLs
    images.forEach(img => {
      if (img.type === 'file' && img.value) {
        URL.revokeObjectURL(img.value);
      }
    });
    videos.forEach(video => {
      if (video.type === 'file' && video.value) {
        URL.revokeObjectURL(video.value);
      }
    });
    if (productBanner?.type === 'file' && productBanner.value) {
      URL.revokeObjectURL(productBanner.value);
    }

    // Reset form
    setImages([]);
    setVideos([]);
    setProductBanner(null);
    setFormData({
      name: '',
      shortDescription: '',
      longDescription: '',
      mrp: '',
      categoryId: '',
      subcategoryId: '',
      status: 'draft',
      qrStatus: 'not-generated',
      studioPageLinked: false,
      barcode: '',
      enableBarcodeLinking: true,
      ingredients: [''],
      ingredientsTableFormat: [],
      ingredientsFormat: 'paragraph',
      nutritionInfo: [],
      keyBenefits: [''],
      usageInstructions: [''],
      technicalSpecs: [],
      weight: '',
      dimensions: '',
      sustainabilityFlags: {
        recyclable: false,
        compostable: false,
        carbonNeutral: false
      },
      certifications: [],
      manufacturingAddress: '',
      expiryDate: '',
      warrantyDurationMonths: '',
      barcodeNumber: '',
      skuCode: '',
      autoGenerateQr: true,
      studioPageStatus: 'default',
      pageViews: 0
    });
    setErrors({});
    setActiveTab('basic');
    onClose();
  };

  // Handle save draft
  const handleSaveDraft = () => {
    console.log('Saving draft:', formData);
    // In a real implementation, you would save the draft to localStorage or send to API
    // For now, we'll just log the data
  };

  // Get subcategories for selected category
  const getSubcategories = () => {
    const selectedCategory = categories.find(cat => cat.category.id === formData.categoryId);
    return selectedCategory ? selectedCategory.subcategories : [];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Create New Product</h3>
                <p className="text-sm text-gray-600">Add a new product to your catalog</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'basic', label: 'Basic Info', icon: Package },
              { id: 'media', label: 'Media', icon: ImageIcon },
              { id: 'details', label: 'Details', icon: Tag },
              { id: 'advanced', label: 'Advanced', icon: Award }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 inline mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter product name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    MRP (₹) *
                  </label>
                  <input
                    type="number"
                    value={formData.mrp}
                    onChange={(e) => setFormData({...formData, mrp: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.mrp ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                  {errors.mrp && (
                    <p className="text-red-500 text-sm mt-1">{errors.mrp}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: e.target.value, subcategoryId: ''})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.categoryId ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat.category.id} value={cat.category.id}>
                        {cat.category.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategory *
                  </label>
                  <select
                    value={formData.subcategoryId}
                    onChange={(e) => setFormData({...formData, subcategoryId: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.subcategoryId ? 'border-red-300' : 'border-gray-300'
                    }`}
                    disabled={!formData.categoryId}
                  >
                    <option value="">Select subcategory</option>
                    {getSubcategories().map(subcat => (
                      <option key={subcat.id} value={subcat.id}>
                        {subcat.name}
                      </option>
                    ))}
                  </select>
                  {errors.subcategoryId && (
                    <p className="text-red-500 text-sm mt-1">{errors.subcategoryId}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description *
                </label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.shortDescription ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Brief product description"
                />
                {errors.shortDescription && (
                  <p className="text-red-500 text-sm mt-1">{errors.shortDescription}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Long Description
                </label>
                <textarea
                  value={formData.longDescription}
                  onChange={(e) => setFormData({...formData, longDescription: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24 resize-none"
                  placeholder="Detailed product description"
                />
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-8">
              {/* Product Banner */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Product Banner
                </label>
                {productBanner ? (
                  <div className="relative">
                    <img
                      src={productBanner.preview}
                      alt="Product banner"
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      onClick={removeBanner}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Add a product banner image</p>
                    <div className="flex justify-center space-x-3">
                      <button
                        onClick={setBannerFromFile}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload File
                      </button>
                      <button
                        onClick={setBannerFromUrl}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Link className="w-4 h-4 mr-2" />
                        Add URL
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Product Images */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Product Images
                  </label>
                  <div className="flex space-x-2">
                    <button
                      onClick={addImageFile}
                      className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      Upload
                    </button>
                    <button
                      onClick={addImageUrl}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      <Link className="w-4 h-4 mr-1" />
                      Add URL
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {images.map((image, index) => (
                    <div key={image.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      {image.preview && (
                        <img
                          src={image.preview}
                          alt={`Product image ${index + 1}`}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        {image.type === 'url' ? (
                          <input
                            type="url"
                            value={image.value}
                            onChange={(e) => updateImageUrl(image.id, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter image URL"
                          />
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                              {image.file?.name || 'Uploaded file'}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({image.file ? (image.file.size / 1024 / 1024).toFixed(2) + ' MB' : ''})
                            </span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeImage(image.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {images.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p>No images added yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Videos */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Product Videos
                  </label>
                  <div className="flex space-x-2">
                    <button
                      onClick={addVideoFile}
                      className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      Upload
                    </button>
                    <button
                      onClick={addVideoUrl}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      <Link className="w-4 h-4 mr-1" />
                      Add URL
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {videos.map((video, index) => (
                    <div key={video.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      {video.preview && (
                        <video
                          src={video.preview}
                          className="w-16 h-16 object-cover rounded-lg"
                          controls={false}
                          muted
                        />
                      )}
                      <div className="flex-1">
                        {video.type === 'url' ? (
                          <input
                            type="url"
                            value={video.value}
                            onChange={(e) => updateVideoUrl(video.id, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter video URL"
                          />
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                              {video.file?.name || 'Uploaded file'}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({video.file ? (video.file.size / 1024 / 1024).toFixed(2) + ' MB' : ''})
                            </span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeVideo(video.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {videos.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Video className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p>No videos added yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Key Benefits */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Benefits
                </label>
                {formData.keyBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={benefit}
                      onChange={(e) => {
                        const newBenefits = [...formData.keyBenefits];
                        newBenefits[index] = e.target.value;
                        setFormData({...formData, keyBenefits: newBenefits});
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter key benefit"
                    />
                    {formData.keyBenefits.length > 1 && (
                      <button
                        onClick={() => {
                          const newBenefits = formData.keyBenefits.filter((_, i) => i !== index);
                          setFormData({...formData, keyBenefits: newBenefits});
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => setFormData({...formData, keyBenefits: [...formData.keyBenefits, '']})}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Benefit
                </button>
              </div>

              {/* Usage Instructions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Usage Instructions
                </label>
                {formData.usageInstructions.map((instruction, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={instruction}
                      onChange={(e) => {
                        const newInstructions = [...formData.usageInstructions];
                        newInstructions[index] = e.target.value;
                        setFormData({...formData, usageInstructions: newInstructions});
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter usage instruction"
                    />
                    {formData.usageInstructions.length > 1 && (
                      <button
                        onClick={() => {
                          const newInstructions = formData.usageInstructions.filter((_, i) => i !== index);
                          setFormData({...formData, usageInstructions: newInstructions});
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => setFormData({...formData, usageInstructions: [...formData.usageInstructions, '']})}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Instruction
                </button>
              </div>

              {/* Weight and Dimensions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight
                  </label>
                  <input
                    type="text"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 500g, 1kg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dimensions
                  </label>
                  <input
                    type="text"
                    value={formData.dimensions}
                    onChange={(e) => setFormData({...formData, dimensions: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 10x5x15 cm"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="space-y-6">
              {/* Sustainability Flags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Sustainability Features
                </label>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.sustainabilityFlags.recyclable}
                      onChange={(e) => setFormData({
                        ...formData,
                        sustainabilityFlags: {
                          ...formData.sustainabilityFlags,
                          recyclable: e.target.checked
                        }
                      })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Leaf className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700">Recyclable</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.sustainabilityFlags.compostable}
                      onChange={(e) => setFormData({
                        ...formData,
                        sustainabilityFlags: {
                          ...formData.sustainabilityFlags,
                          compostable: e.target.checked
                        }
                      })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Leaf className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700">Compostable</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.sustainabilityFlags.carbonNeutral}
                      onChange={(e) => setFormData({
                        ...formData,
                        sustainabilityFlags: {
                          ...formData.sustainabilityFlags,
                          carbonNeutral: e.target.checked
                        }
                      })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Globe className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-700">Carbon Neutral</span>
                  </label>
                </div>
              </div>

              {/* Certifications */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certifications
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {CERTIFICATION_OPTIONS.map(cert => (
                    <label key={cert} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.certifications.includes(cert)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              certifications: [...formData.certifications, cert]
                            });
                          } else {
                            setFormData({
                              ...formData,
                              certifications: formData.certifications.filter(c => c !== cert)
                            });
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{cert}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Manufacturing Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manufacturing Address
                </label>
                <textarea
                  value={formData.manufacturingAddress}
                  onChange={(e) => setFormData({...formData, manufacturingAddress: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20 resize-none"
                  placeholder="Enter manufacturing address"
                />
              </div>

              {/* Barcode and SKU */}
              <div>
                <div className="flex items-center space-x-2 mb-4 md:col-span-2">
                  <Hash className="w-5 h-5 text-purple-600" />
                  <h4 className="text-md font-medium text-gray-900">Identifier Options</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Barcode Number
                    </label>
                    <input
                      type="text"
                      value={formData.barcodeNumber}
                      onChange={(e) => setFormData({...formData, barcodeNumber: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.barcodeNumber ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter barcode number"
                    />
                    {errors.barcodeNumber && (
                      <p className="text-red-500 text-sm mt-1">{errors.barcodeNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SKU Code
                    </label>
                    <input
                      type="text"
                      value={formData.skuCode}
                      onChange={(e) => setFormData({...formData, skuCode: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter SKU code"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Code (Auto-generated)</label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value="Auto-generated based on product name"
                        readOnly
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                        placeholder="Auto-generated based on product name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Auto-generate QR Code</label>
                    <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <QrCode className="w-5 h-5 text-blue-600" />
                        <div>
                          <span className="text-sm font-medium text-gray-900">Auto-generate QR Code</span>
                          <p className="text-xs text-gray-500">Generate QR code automatically on save</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, autoGenerateQr: !formData.autoGenerateQr})}
                        className="flex-shrink-0"
                      >
                        {formData.autoGenerateQr ? (
                          <ToggleRight className="w-6 h-6 text-blue-600" />
                        ) : (
                          <ToggleLeft className="w-6 h-6 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Page Integration */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Zap className="w-5 h-5 text-orange-600" />
                  <h4 className="text-md font-medium text-gray-900">Product Page Integration</h4>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-gray-700">Studio Page Status:</span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <FileText className="w-3 h-3 mr-1" />
                          Using Default View
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">QR code will redirect to default product information page</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        // Create a temporary product object for studio redirection
                        const tempProduct: Product = {
                          id: 'temp-' + Date.now(),
                          name: formData.name || 'New Product',
                          shortDescription: formData.shortDescription,
                          longDescription: formData.longDescription,
                          mrp: parseFloat(formData.mrp) || 0,
                          categoryId: formData.categoryId,
                          subcategoryId: formData.subcategoryId,
                          images: images.map(img => img.value).filter(url => url.trim() !== ''),
                          videos: videos.map(video => video.value).filter(url => url.trim() !== ''),
                          productBanner: productBanner?.value || '',
                          status: formData.status,
                          qrStatus: formData.qrStatus,
                          qrCodeUrl: '',
                          studioPageLinked: false,
                          barcode: formData.barcode,
                          enableBarcodeLinking: formData.enableBarcodeLinking,
                          ingredients: formData.ingredients.filter(ing => ing.trim() !== ''),
                          ingredientsTableFormat: formData.ingredientsTableFormat,
                          ingredientsFormat: formData.ingredientsFormat,
                          nutritionInfo: formData.nutritionInfo,
                          keyBenefits: formData.keyBenefits.filter(benefit => benefit.trim() !== ''),
                          usageInstructions: formData.usageInstructions.filter(instruction => instruction.trim() !== ''),
                          technicalSpecs: formData.technicalSpecs,
                          weight: formData.weight,
                          dimensions: formData.dimensions,
                          sustainabilityFlags: formData.sustainabilityFlags,
                          certifications: formData.certifications,
                          manufacturingAddress: formData.manufacturingAddress,
                          expiryDate: formData.expiryDate || null,
                          warrantyDurationMonths: formData.warrantyDurationMonths ? parseInt(formData.warrantyDurationMonths) : null,
                          barcodeNumber: formData.barcodeNumber,
                          skuCode: formData.skuCode,
                          productCode: `${formData.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
                          autoGenerateQr: formData.autoGenerateQr,
                          studioPageStatus: formData.studioPageStatus,
                          pageViews: formData.pageViews,
                          createdAt: new Date().toISOString(),
                          lastUpdated: new Date().toISOString()
                        };
                        onRedirectToStudio(tempProduct);
                      }}
                      className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Create Product Page
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900 mb-2">Product Page Options</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• <strong>Default View:</strong> Shows basic product information automatically</li>
                        <li>• <strong>Custom Page:</strong> Create enhanced pages with Studio for better engagement</li>
                        <li>• <strong>Fallback:</strong> If custom page is deleted, QR reverts to default view</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveDraft}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Save Draft
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Create Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCreationModal;