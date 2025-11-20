import React from 'react';
import { ProductsProps, ProductItem, ProductBuyOption, ProductSpecification, ProductDetailSection, ProductLicense } from './types';
import { Plus, Trash2, Upload } from 'lucide-react';

interface ProductsSettingsProps {
  props: ProductsProps;
  onPropsChange: (props: ProductsProps) => void;
}

const createProduct = (): ProductItem => ({
  id: `product-${Date.now()}`,
  name: 'New Product',
  subtitle: '',
  imageUrl: '',
  price: { amount: 0, currency: '₹' },
  rating: { value: 4, count: 0 },
  shortDescription: '',
  longDescription: '',
  highlights: [],
  badges: [],
  stockStatus: 'in_stock',
  buyOptions: [
    { id: `buy-${Date.now()}`, label: 'Buy Now', type: 'website', url: '#' }
  ],
  specifications: [],
  detailSections: [],
  licenses: []
});

const createBuyOption = (): ProductBuyOption => ({
  id: `buy-${Date.now()}`,
  label: 'Website',
  type: 'website',
  url: '#'
});

const createSpecification = (): ProductSpecification => ({
  label: 'Attribute',
  value: 'Value'
});

const createDetailSection = (): ProductDetailSection => ({
  id: `detail-${Date.now()}`,
  title: 'Additional Info',
  content: ''
});

const createLicense = (): ProductLicense => ({
  id: `license-${Date.now()}`,
  name: 'Certification',
  licenseId: '',
  issuer: '',
  description: '',
  url: ''
});

export const ProductsSettings: React.FC<ProductsSettingsProps> = ({
  props,
  onPropsChange
}) => {
  const updateProp = (key: keyof ProductsProps, value: any) => {
    onPropsChange({ ...props, [key]: value });
  };

  const updateProduct = (id: string, changes: Partial<ProductItem>) => {
    const updatedProducts = props.products.map(product =>
      product.id === id ? { ...product, ...changes } : product
    );
    updateProp('products', updatedProducts);
  };

  const addProduct = () => {
    updateProp('products', [...props.products, createProduct()]);
  };

  const removeProduct = (id: string) => {
    updateProp('products', props.products.filter(product => product.id !== id));
  };

  const addBuyOption = (productId: string) => {
    updateProduct(productId, {
      buyOptions: [...(props.products.find(p => p.id === productId)?.buyOptions || []), createBuyOption()]
    });
  };

  const updateBuyOption = (productId: string, optionId: string, changes: Partial<ProductBuyOption>) => {
    const product = props.products.find(p => p.id === productId);
    if (!product) return;
    updateProduct(productId, {
      buyOptions: product.buyOptions.map(option =>
        option.id === optionId ? { ...option, ...changes } : option
      )
    });
  };

  const removeBuyOption = (productId: string, optionId: string) => {
    const product = props.products.find(p => p.id === productId);
    if (!product) return;
    updateProduct(productId, {
      buyOptions: product.buyOptions.filter(option => option.id !== optionId)
    });
  };

  const addSpecification = (productId: string) => {
    const product = props.products.find(p => p.id === productId);
    if (!product) return;
    updateProduct(productId, {
      specifications: [...(product.specifications || []), createSpecification()]
    });
  };

  const updateSpecification = (productId: string, index: number, changes: Partial<ProductSpecification>) => {
    const product = props.products.find(p => p.id === productId);
    if (!product || !product.specifications) return;
    const updatedSpecs = [...product.specifications];
    updatedSpecs[index] = { ...updatedSpecs[index], ...changes };
    updateProduct(productId, { specifications: updatedSpecs });
  };

  const removeSpecification = (productId: string, index: number) => {
    const product = props.products.find(p => p.id === productId);
    if (!product || !product.specifications) return;
    const updatedSpecs = [...product.specifications];
    updatedSpecs.splice(index, 1);
    updateProduct(productId, { specifications: updatedSpecs });
  };

  const addDetailSection = (productId: string) => {
    const product = props.products.find(p => p.id === productId);
    if (!product) return;
    updateProduct(productId, {
      detailSections: [...(product.detailSections || []), createDetailSection()]
    });
  };

  const updateDetailSection = (productId: string, sectionId: string, changes: Partial<ProductDetailSection>) => {
    const product = props.products.find(p => p.id === productId);
    if (!product || !product.detailSections) return;
    updateProduct(productId, {
      detailSections: product.detailSections.map(section =>
        section.id === sectionId ? { ...section, ...changes } : section
      )
    });
  };

  const removeDetailSection = (productId: string, sectionId: string) => {
    const product = props.products.find(p => p.id === productId);
    if (!product || !product.detailSections) return;
    updateProduct(productId, {
      detailSections: product.detailSections.filter(section => section.id !== sectionId)
    });
  };

  const addLicense = (productId: string) => {
    const product = props.products.find(p => p.id === productId);
    if (!product) return;
    updateProduct(productId, {
      licenses: [...(product.licenses || []), createLicense()]
    });
  };

  const updateLicense = (productId: string, licenseId: string, changes: Partial<ProductLicense>) => {
    const product = props.products.find(p => p.id === productId);
    if (!product || !product.licenses) return;
    updateProduct(productId, {
      licenses: product.licenses.map(license =>
        license.id === licenseId ? { ...license, ...changes } : license
      )
    });
  };

  const removeLicense = (productId: string, licenseId: string) => {
    const product = props.products.find(p => p.id === productId);
    if (!product || !product.licenses) return;
    updateProduct(productId, {
      licenses: product.licenses.filter(license => license.id !== licenseId)
    });
  };

  const handleProductImageUpload = (productId: string, file?: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateProduct(productId, { imageUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Section Title</label>
          <input
            type="text"
            value={props.title || ''}
            onChange={(e) => updateProp('title', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Featured Products"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Layout</label>
          <select
            value={props.layout}
            onChange={(e) => updateProp('layout', e.target.value as ProductsProps['layout'])}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="grid">Grid</option>
            <option value="list">List</option>
          </select>
        </div>
        {props.layout === 'grid' && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Columns</label>
            <input
              type="number"
              min={1}
              max={4}
              value={props.columns || 3}
              onChange={(e) => updateProp('columns', Number(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Card Style</label>
          <select
            value={props.cardStyle}
            onChange={(e) => updateProp('cardStyle', e.target.value as ProductsProps['cardStyle'])}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="elevated">Elevated</option>
            <option value="flat">Flat</option>
            <option value="bordered">Bordered</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {(['showRatings', 'showPrice', 'showDescription', 'showBuyButtons', 'showViewMore'] as Array<keyof ProductsProps>).map((key) => (
          <label key={key} className="flex items-center space-x-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={Boolean(props[key])}
              onChange={(e) => updateProp(key, e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>{key.replace('show', 'Show ')}</span>
          </label>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-900">Products</h4>
        <button
          onClick={addProduct}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Product
        </button>
      </div>

      <div className="space-y-4">
        {props.products.map((product) => (
          <div key={product.id} className="border border-gray-200 rounded-xl divide-y divide-gray-100 bg-white shadow-sm">
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{product.name}</p>
                <p className="text-xs text-gray-500">{product.subtitle || 'No subtitle'}</p>
              </div>
              <button
                onClick={() => removeProduct(product.id)}
                className="text-red-500 hover:text-red-700"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) => updateProduct(product.id, { name: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={product.subtitle || ''}
                    onChange={(e) => updateProduct(product.id, { subtitle: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={product.imageUrl}
                  onChange={(e) => updateProduct(product.id, { imageUrl: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
                <div className="mt-2">
                  <label className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-100 rounded-lg cursor-pointer hover:bg-blue-50">
                    <Upload className="w-3.5 h-3.5 mr-1.5" />
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleProductImageUpload(product.id, e.target.files?.[0])}
                    />
                  </label>
                  <p className="text-[11px] text-gray-500 mt-1">JPG, PNG or WebP up to 2 MB</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    value={product.price?.amount ?? ''}
                    onChange={(e) =>
                      updateProduct(product.id, {
                        price: { ...product.price, amount: Number(e.target.value) }
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="1299"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Currency</label>
                  <input
                    type="text"
                    value={product.price?.currency || '₹'}
                    onChange={(e) =>
                      updateProduct(product.id, {
                        price: { ...product.price, currency: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="₹"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Original Price</label>
                  <input
                    type="number"
                    value={product.price?.originalAmount ?? ''}
                    onChange={(e) =>
                      updateProduct(product.id, {
                        price: { ...product.price, originalAmount: Number(e.target.value) }
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="1599"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={product.rating?.value ?? ''}
                    onChange={(e) =>
                      updateProduct(product.id, {
                        rating: { ...product.rating, value: Number(e.target.value) }
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="4.5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Rating Count</label>
                  <input
                    type="number"
                    min="0"
                    value={product.rating?.count ?? ''}
                    onChange={(e) =>
                      updateProduct(product.id, {
                        rating: { ...product.rating, count: Number(e.target.value) }
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="120"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Short Description</label>
                <textarea
                  value={product.shortDescription || ''}
                  onChange={(e) => updateProduct(product.id, { shortDescription: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Long Description</label>
                <textarea
                  value={product.longDescription || ''}
                  onChange={(e) => updateProduct(product.id, { longDescription: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Highlights (comma separated)</label>
                  <input
                    type="text"
                    value={product.highlights?.join(', ') || ''}
                    onChange={(e) => updateProduct(product.id, { highlights: e.target.value.split(',').map(item => item.trim()).filter(Boolean) })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Premium materials, 2-year warranty"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Badges (comma separated)</label>
                  <input
                    type="text"
                    value={product.badges?.join(', ') || ''}
                    onChange={(e) => updateProduct(product.id, { badges: e.target.value.split(',').map(item => item.trim()).filter(Boolean) })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Bestseller, New Arrival"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Stock Status</label>
                <select
                  value={product.stockStatus || 'in_stock'}
                  onChange={(e) => updateProduct(product.id, { stockStatus: e.target.value as ProductItem['stockStatus'] })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="in_stock">In Stock</option>
                  <option value="low_stock">Limited Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                  <option value="preorder">Preorder</option>
                </select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Buy Options</h5>
                  <button
                    onClick={() => addBuyOption(product.id)}
                    className="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-800"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Option
                  </button>
                </div>

                <div className="space-y-3">
                  {product.buyOptions.map((option) => (
                    <div key={option.id} className="p-3 border border-gray-200 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-gray-700">Label</label>
                        <button
                          onClick={() => removeBuyOption(product.id, option.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Remove option"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={option.label}
                        onChange={(e) => updateBuyOption(product.id, option.id, { label: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Amazon"
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                          <select
                            value={option.type}
                            onChange={(e) => updateBuyOption(product.id, option.id, { type: e.target.value as ProductBuyOption['type'] })}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="website">Website</option>
                            <option value="amazon">Amazon</option>
                            <option value="flipkart">Flipkart</option>
                            <option value="whatsapp">WhatsApp</option>
                            <option value="custom">Custom</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Accent Color</label>
                          <input
                            type="text"
                            value={option.accentColor || ''}
                            onChange={(e) => updateBuyOption(product.id, option.id, { accentColor: e.target.value })}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="#111827"
                          />
                        </div>
                      </div>

                      <input
                        type="text"
                        value={option.url}
                        onChange={(e) => updateBuyOption(product.id, option.id, { url: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="https://example.com"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Specifications</h5>
                  <button
                    onClick={() => addSpecification(product.id)}
                    className="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-800"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Specification
                  </button>
                </div>

                <div className="space-y-3">
                  {(product.specifications || []).map((spec, idx) => (
                    <div key={`${spec.label}-${idx}`} className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={spec.label}
                        onChange={(e) => updateSpecification(product.id, idx, { label: e.target.value })}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Label"
                      />
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={spec.value}
                          onChange={(e) => updateSpecification(product.id, idx, { value: e.target.value })}
                          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Value"
                        />
                        <button
                          onClick={() => removeSpecification(product.id, idx)}
                          className="p-2 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Detail Sections</h5>
                  <button
                    onClick={() => addDetailSection(product.id)}
                    className="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-800"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Section
                  </button>
                </div>
                {(product.detailSections || []).map((section) => (
                  <div key={section.id} className="p-3 border border-gray-200 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-gray-700">Title</label>
                      <button
                        onClick={() => removeDetailSection(product.id, section.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Remove section"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => updateDetailSection(product.id, section.id, { title: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Warranty"
                    />
                    <textarea
                      value={section.content}
                      onChange={(e) => updateDetailSection(product.id, section.id, { content: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter detailed information..."
                      rows={2}
                    />
                  </div>
                ))}
                {(product.detailSections?.length ?? 0) === 0 && (
                  <p className="text-xs text-gray-500">Use detail sections to highlight policies, care instructions, compatible devices, etc.</p>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Licenses & Approvals</h5>
                  <button
                    onClick={() => addLicense(product.id)}
                    className="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-800"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add License
                  </button>
                </div>
                {(product.licenses || []).map((license) => (
                  <div key={license.id} className="p-3 border border-blue-100 rounded-lg bg-blue-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-blue-900">Name</label>
                      <button
                        onClick={() => removeLicense(product.id, license.id)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Remove license"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={license.name}
                      onChange={(e) => updateLicense(product.id, license.id, { name: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Organic Certified"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={license.licenseId || ''}
                        onChange={(e) => updateLicense(product.id, license.id, { licenseId: e.target.value })}
                        className="px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="License ID"
                      />
                      <input
                        type="text"
                        value={license.issuer || ''}
                        onChange={(e) => updateLicense(product.id, license.id, { issuer: e.target.value })}
                        className="px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Issued by"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={license.issuedOn || ''}
                        onChange={(e) => updateLicense(product.id, license.id, { issuedOn: e.target.value })}
                        className="px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Issued on (e.g., Jan 2025)"
                      />
                      <input
                        type="text"
                        value={license.validUntil || ''}
                        onChange={(e) => updateLicense(product.id, license.id, { validUntil: e.target.value })}
                        className="px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Valid until"
                      />
                    </div>
                    <textarea
                      value={license.description || ''}
                      onChange={(e) => updateLicense(product.id, license.id, { description: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Add notes about this license"
                      rows={2}
                    />
                    <input
                      type="text"
                      value={license.url || ''}
                      onChange={(e) => updateLicense(product.id, license.id, { url: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Link to certificate / website"
                    />
                  </div>
                ))}
                {(product.licenses?.length ?? 0) === 0 && (
                  <p className="text-xs text-gray-500">Add lab tests, compliance documents, or marketplace approvals.</p>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

