import React, { useMemo, useState } from 'react';
import { Star, ShoppingBag, ExternalLink, MessageCircle, Store, Package, BadgeCheck, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { ProductsProps, ProductItem, ProductBuyOption, ProductDetailSection, ProductLicense } from './types';

interface ProductsComponentProps {
  props: ProductsProps;
  style?: Record<string, any>;
  isSelected?: boolean;
  onClick?: () => void;
}

const platformIcons: Record<ProductBuyOption['type'], React.ReactNode> = {
  website: <ExternalLink className="w-4 h-4" />,
  amazon: <ShoppingBag className="w-4 h-4" />,
  flipkart: <Package className="w-4 h-4" />,
  whatsapp: <MessageCircle className="w-4 h-4" />,
  custom: <Store className="w-4 h-4" />
};

const stockStatusLabels: Record<NonNullable<ProductItem['stockStatus']>, { label: string; color: string }> = {
  in_stock: { label: 'In Stock', color: 'bg-green-100 text-green-800' },
  low_stock: { label: 'Limited Stock', color: 'bg-orange-100 text-orange-800' },
  out_of_stock: { label: 'Out of Stock', color: 'bg-red-100 text-red-800' },
  preorder: { label: 'Preorder', color: 'bg-blue-100 text-blue-800' }
};

export const ProductsComponent: React.FC<ProductsComponentProps> = ({
  props,
  style = {},
}) => {
  const {
    title = 'Featured Products',
    layout = 'grid',
    columns = 3,
    cardStyle = 'elevated',
    showRatings = true,
    showPrice = true,
    showDescription = true,
    showBuyButtons = true,
    showViewMore = true,
    products = []
  } = props;

  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  const containerClasses = useMemo(() => {
    if (layout === 'list') {
      return 'flex flex-col space-y-4';
    }
    return 'grid gap-6';
  }, [layout]);

  const gridStyle = useMemo(() => {
    if (layout === 'grid') {
      return {
        gridTemplateColumns: `repeat(${Math.min(columns, 4)}, minmax(0, 1fr))`
      } as React.CSSProperties;
    }
    return undefined;
  }, [layout, columns]);

  const cardBaseClasses = useMemo(() => {
    switch (cardStyle) {
      case 'bordered':
        return 'border border-gray-200 bg-white';
      case 'flat':
        return 'bg-white';
      default:
        return 'bg-white shadow-sm hover:shadow-md transition-shadow';
    }
  }, [cardStyle]);

  const handleToggleDetails = (id: string) => {
    setExpandedProduct(prev => (prev === id ? null : id));
  };

  const renderRating = (product: ProductItem) => {
    if (!showRatings || !product.rating?.value) return null;
    const ratingValue = Math.min(Math.max(product.rating.value, 0), 5);
    const filledStars = Math.floor(ratingValue);
    const decimal = ratingValue - filledStars;

    return (
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <div className="flex">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className={`w-4 h-4 ${index < filledStars ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
            />
          ))}
          {decimal > 0 && filledStars < 5 && (
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 opacity-70" />
          )}
        </div>
        <span className="font-medium">{ratingValue.toFixed(1)}</span>
        {product.rating.count && (
          <span className="text-xs text-gray-400">({product.rating.count} reviews)</span>
        )}
      </div>
    );
  };

  const renderPrice = (product: ProductItem) => {
    if (!showPrice || !product.price) return null;
    const { amount, currency = '₹', originalAmount, badge } = product.price;
    if (amount === undefined || amount === null) return null;

    return (
      <div className="flex items-center space-x-2">
        <div className="text-2xl font-semibold text-gray-900">
          {currency}{amount.toLocaleString()}
        </div>
        {originalAmount && originalAmount > amount && (
          <div className="text-sm text-gray-400 line-through">
            {currency}{originalAmount.toLocaleString()}
          </div>
        )}
        {badge && (
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-700">
            {badge}
          </span>
        )}
      </div>
    );
  };

  const renderBuyOptions = (product: ProductItem) => {
    if (!showBuyButtons || product.buyOptions.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2">
        {product.buyOptions.map(option => (
          <a
            key={option.id}
            href={option.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium border rounded-lg hover:-translate-y-0.5 transition-transform"
            style={{
              borderColor: option.accentColor || '#d1d5db',
              color: option.accentColor || '#111827'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="mr-2">
              {option.icon ? (
                <span dangerouslySetInnerHTML={{ __html: option.icon }} />
              ) : (
                platformIcons[option.type] || <ShoppingBag className="w-4 h-4" />
              )}
            </span>
            {option.label}
          </a>
        ))}
      </div>
    );
  };

  const renderStockStatus = (product: ProductItem) => {
    if (!product.stockStatus) return null;
    const status = stockStatusLabels[product.stockStatus];
    return (
      <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${status.color}`}>
        <BadgeCheck className="w-3 h-3 mr-1" />
        {status.label}
      </span>
    );
  };

  const renderDetailSections = (sections: ProductDetailSection[] = []) => {
    if (sections.length === 0) return null;
    return (
      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Product Details</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sections.map(section => (
            <div key={section.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
                {section.title}
              </p>
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLicenses = (licenses: ProductLicense[] = []) => {
    if (licenses.length === 0) return null;
    return (
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900">Certifications & Licenses</h4>
        {licenses.map((license) => (
          <div
            key={license.id}
            className="p-4 border border-blue-100 bg-blue-50 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            <div>
              <p className="text-sm font-semibold text-blue-900">{license.name}</p>
              {license.licenseId && (
                <p className="text-xs text-blue-700">ID: {license.licenseId}</p>
              )}
              {license.issuer && (
                <p className="text-xs text-blue-600 mt-1">Issued by {license.issuer}</p>
              )}
              {license.description && (
                <p className="text-xs text-blue-800 mt-1">{license.description}</p>
              )}
              {(license.issuedOn || license.validUntil) && (
                <p className="text-xs text-blue-600 mt-1">
                  {license.issuedOn && <span>Issued on {license.issuedOn}</span>}
                  {license.issuedOn && license.validUntil && <span className="mx-1">•</span>}
                  {license.validUntil && <span>Valid till {license.validUntil}</span>}
                </p>
              )}
            </div>
            {license.url && (
              <a
                href={license.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-blue-700 bg-white rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                View Document
              </a>
            )}
          </div>
        ))}
      </div>
    );
  };

  const hasExtraContent = (product: ProductItem) => {
    return Boolean(
      product.longDescription ||
      (product.highlights?.length ?? 0) > 0 ||
      (product.specifications?.length ?? 0) > 0 ||
      (product.detailSections?.length ?? 0) > 0 ||
      (product.licenses?.length ?? 0) > 0
    );
  };

  const renderProductCard = (product: ProductItem) => {
    const isExpanded = expandedProduct === product.id;
    return (
      <div
        key={product.id}
        className={`${cardBaseClasses} rounded-2xl overflow-hidden flex flex-col`}
      >
        <div className="relative">
          <img
            src={product.imageUrl || 'https://via.placeholder.com/600x400?text=Product'}
            alt={product.name}
            className="w-full h-64 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=Product';
            }}
          />
          {product.badges && product.badges.length > 0 && (
            <div className="absolute top-4 left-4 space-y-2">
              {product.badges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-white/90 text-gray-900"
                >
                  <Info className="w-3 h-3 mr-1 text-blue-500" />
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="p-5 flex-1 flex flex-col space-y-4">
          <div className="space-y-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
                {product.subtitle && (
                  <p className="text-sm text-gray-500">{product.subtitle}</p>
                )}
              </div>
              {renderStockStatus(product)}
            </div>
            {renderRating(product)}
          </div>

          {renderPrice(product)}

          {showDescription && product.shortDescription && (
            <p className="text-sm text-gray-600 line-clamp-3">
              {product.shortDescription}
            </p>
          )}

          {renderBuyOptions(product)}

          {showViewMore && hasExtraContent(product) && (
            <div className="pt-2">
              <button
                className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleDetails(product.id);
                }}
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-1" />
                    Hide Details
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-1" />
                    View Details
                  </>
                )}
              </button>
            </div>
          )}

          {isExpanded && (
            <div className="space-y-4 text-sm text-gray-600 border-t border-gray-100 pt-4">
              {product.longDescription && (
                <p>{product.longDescription}</p>
              )}
              {product.highlights && product.highlights.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Highlights</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {product.highlights.map((highlight, idx) => (
                      <li key={idx}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              )}
              {product.specifications && product.specifications.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Specifications</h4>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.specifications.map((spec) => (
                      <div key={spec.label} className="flex justify-between text-xs bg-gray-50 rounded-lg px-3 py-2">
                        <dt className="text-gray-500">{spec.label}</dt>
                        <dd className="text-gray-900 font-medium">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
              {product.detailSections && product.detailSections.length > 0 && (
                renderDetailSections(product.detailSections)
              )}

              {product.licenses && product.licenses.length > 0 && (
                renderLicenses(product.licenses)
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={style} className="space-y-6">
      {title && (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">Products</p>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          </div>
        </div>
      )}

      {products.length === 0 ? (
        <div className="p-6 border-2 border-dashed border-gray-200 rounded-xl text-center">
          <p className="text-gray-500 text-sm">No products added yet. Use the settings panel to add products.</p>
        </div>
      ) : (
        <div className={containerClasses} style={gridStyle}>
          {products.map(renderProductCard)}
        </div>
      )}
    </div>
  );
};

export const getProductsDefaultProps = (): ProductsProps => ({
  title: 'Featured Products',
  layout: 'grid',
  columns: 3,
  cardStyle: 'elevated',
  showRatings: true,
  showPrice: true,
  showDescription: true,
  showBuyButtons: true,
  showViewMore: true,
  products: [
    {
      id: 'product-1',
      name: 'Sample Product',
      subtitle: 'Premium Quality',
      imageUrl: 'https://via.placeholder.com/600x400?text=Product',
      price: {
        amount: 1299,
        currency: '₹',
        originalAmount: 1599,
        badge: 'Save 15%'
      },
      rating: { value: 4.5, count: 120 },
      shortDescription: 'High-quality product with excellent features for modern lifestyles.',
      longDescription: 'This is a detailed description where you can highlight product story, usage instructions, certifications, care tips, and more.',
      highlights: ['Premium materials', '2-year warranty', 'Fast shipping'],
      badges: ['Bestseller', 'New Arrival'],
      stockStatus: 'in_stock',
      buyOptions: [
        { id: 'buy-1', label: 'Official Website', type: 'website', url: '#' },
        { id: 'buy-2', label: 'Amazon', type: 'amazon', url: '#' },
      ],
      specifications: [
        { label: 'Weight', value: '1.2kg' },
        { label: 'Dimensions', value: '25 x 15 x 10 cm' },
      ],
      detailSections: [
        {
          id: 'detail-1',
          title: 'Warranty & Returns',
          content: '2-year warranty with doorstep service. 15-day return policy.'
        },
        {
          id: 'detail-2',
          title: 'Care Instructions',
          content: 'Wipe gently with a damp cloth. Avoid direct sunlight exposure.'
        }
      ],
      licenses: [
        {
          id: 'license-1',
          name: 'ISO 9001:2015',
          issuer: 'TÜV SÜD',
          licenseId: 'ISO9K-45871',
          url: '#'
        }
      ]
    }
  ],
});

