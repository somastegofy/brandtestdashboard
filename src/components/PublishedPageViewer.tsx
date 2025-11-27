import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, ArrowLeft } from 'lucide-react';
import { loadPublishedStudioPageBySlug, incrementPageViews, StudioPage } from '../api/studioPages';
import { 
  HeaderComponent, 
  ImagesLinkComponent,
  ButtonsComponent,
  HeadingTextComponent,
  VideoComponent,
  ImageTextComponent,
  SocialLinksComponent,
  ContactUsComponent,
  IngredientsComponent,
  AddressComponent,
  MapComponent,
  ProductsComponent,
  GalleryComponent,
  NutritionTableComponent,
  RecipesComponent,
  PageContentBlock,
  HeaderProps,
  ImagesLinkProps,
  ButtonsProps,
  HeadingTextProps,
  VideoProps,
  ImageTextProps,
  SocialLinksProps,
  ContactUsProps,
  IngredientsProps,
  AddressProps,
  MapProps,
  ProductsProps,
  GalleryProps,
  NutritionTableProps,
  RecipesProps
} from './studio/components';
import { DesignCustomization } from './studio/DesignSettingsPanel';

const PublishedPageViewer: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [pageData, setPageData] = useState<StudioPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPage = async () => {
      if (!slug) {
        setError('No slug provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const page = await loadPublishedStudioPageBySlug(slug);
        
        if (!page) {
          setError('Page not found');
          setLoading(false);
          return;
        }

        setPageData(page);
        
        // Increment page views
        try {
          await incrementPageViews(page.id);
        } catch (viewError) {
          console.error('Error incrementing page views:', viewError);
          // Don't fail the page load if view increment fails
        }
      } catch (err: any) {
        console.error('Error loading published page:', err);
        setError(err.message || 'Failed to load page');
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, [slug]);

  // Helper function to get border radius value
  const getCardBorderRadius = (borderRadius: string, custom?: string): string => {
    if (borderRadius === 'custom' && custom) {
      return custom;
    }
    const radiusMap: Record<string, string> = {
      'none': '0px',
      'xs': '4px',
      'sm': '8px',
      'md': '12px',
      'lg': '16px',
      'xl': '24px',
      '2xl': '32px',
      'full': '9999px'
    };
    return radiusMap[borderRadius] || '12px';
  };

  // Helper function to get shadow/elevation CSS
  const getCardElevation = (elevation: string, shadowColor?: string): string => {
    if (!elevation || elevation === 'none') return 'none';
    
    const shadow = shadowColor || 'rgba(0, 0, 0, 0.1)';
    const elevationMap: Record<string, string> = {
      'none': 'none',
      'sm': `0 1px 2px 0 ${shadow}`,
      'md': `0 4px 6px -1px ${shadow}, 0 2px 4px -1px ${shadow}`,
      'lg': `0 10px 15px -3px ${shadow}, 0 4px 6px -2px ${shadow}`,
      'xl': `0 20px 25px -5px ${shadow}, 0 10px 10px -5px ${shadow}`,
      '2xl': `0 25px 50px -12px ${shadow}`,
      'inner': `inset 0 2px 4px 0 ${shadow}`
    };
    return elevationMap[elevation] || 'none';
  };

  // Apply design customization styles
  const applyDesignCustomization = (customization: DesignCustomization): React.CSSProperties => {
    const styles: React.CSSProperties = {
      backgroundColor: customization.backgroundColor || '#ffffff',
      fontFamily: customization.fontFamilyBody || 'system-ui, sans-serif',
      color: '#000000', // Default text color
    };

    // Apply background image if provided (without overlay - overlay is handled separately)
    if (customization.backgroundImage && customization.backgroundOverlay === 0) {
      styles.backgroundImage = `url(${customization.backgroundImage})`;
      styles.backgroundSize = customization.backgroundMode || 'cover';
      styles.backgroundPosition = 'center';
      styles.backgroundRepeat = 'no-repeat';
    }

    // Apply gradient if specified (only if no background image with overlay)
    if (customization.gradientType === 'linear' && (!customization.backgroundImage || customization.backgroundOverlay === 0)) {
      const angle = customization.gradientAngle || 90;
      if (customization.backgroundImage) {
        styles.backgroundImage = `linear-gradient(${angle}deg, ${customization.gradientColorStart}, ${customization.gradientColorEnd}), url(${customization.backgroundImage})`;
        styles.backgroundSize = `${customization.backgroundMode || 'cover'}, cover`;
      } else {
        styles.backgroundImage = `linear-gradient(${angle}deg, ${customization.gradientColorStart}, ${customization.gradientColorEnd})`;
      }
    } else if (customization.gradientType === 'radial' && (!customization.backgroundImage || customization.backgroundOverlay === 0)) {
      if (customization.backgroundImage) {
        styles.backgroundImage = `radial-gradient(circle, ${customization.gradientColorStart}, ${customization.gradientColorEnd}), url(${customization.backgroundImage})`;
        styles.backgroundSize = `${customization.backgroundMode || 'cover'}, cover`;
      } else {
        styles.backgroundImage = `radial-gradient(circle, ${customization.gradientColorStart}, ${customization.gradientColorEnd})`;
      }
    }

    return styles;
  };

  // Render a component based on its type
  const renderComponent = (component: PageContentBlock, customization: DesignCustomization) => {
    if (!component || !component.type) {
      return null;
    }

    // Calculate global card styles
    const cardBorderRadius = getCardBorderRadius(customization.cardBorderRadius || 'md', customization.cardBorderRadiusCustom);
    const cardElevation = getCardElevation(customization.cardElevation || 'none', customization.cardShadowColor);
    
    // Determine final border radius - use component-specific if set, otherwise use global
    const finalBorderRadius = component.style?.borderRadius && component.style.borderRadius !== '0' && component.style.borderRadius !== '0px'
      ? component.style.borderRadius
      : cardBorderRadius;
    
    // Apply global card styles first, then override with component-specific styles
    const componentStyle: React.CSSProperties = {
      // Apply global card styles from design customization FIRST (base styles)
      borderRadius: finalBorderRadius,
      backgroundColor: customization.cardSurfaceColor || '#ffffff',
      boxShadow: cardElevation !== 'none' ? cardElevation : undefined,
      transition: `all ${customization.transitionDuration || '150ms'} ${customization.transitionEasing || 'ease-in-out'}`,
      marginBottom: customization.componentGap || '24px',
      // Apply borders if border width is set
      ...(customization.cardBorderWidth && customization.cardBorderWidth !== '0' && {
        borderWidth: customization.cardBorderWidth,
        borderStyle: customization.cardBorderStyle || 'solid',
        borderColor: customization.cardBorderColor || '#e5e7eb',
      }),
      // Ensure overflow hidden when border radius is present
      ...(finalBorderRadius && finalBorderRadius !== '0' && finalBorderRadius !== '0px' && {
        overflow: 'hidden',
      }),
      // Override with component-specific styles if they exist
      ...(component.style?.margin && {
        marginTop: component.style.margin.top,
        marginRight: component.style.margin.right,
        marginBottom: component.style.margin.bottom,
        marginLeft: component.style.margin.left,
      }),
      ...(component.style?.padding && {
        paddingTop: component.style.padding.top,
        paddingRight: component.style.padding.right,
        paddingBottom: component.style.padding.bottom,
        paddingLeft: component.style.padding.left,
      }),
      ...(component.style?.backgroundColor && { backgroundColor: component.style.backgroundColor }),
      ...(component.style?.width && { width: component.style.width }),
      ...(component.style?.height && { height: component.style.height }),
      ...(component.style?.opacity !== undefined && { opacity: component.style.opacity }),
      ...(component.style?.textAlign && { textAlign: component.style.textAlign }),
    };

    switch (component.type) {
      case 'Header':
        return (
          <div key={component.id} style={componentStyle}>
            <HeaderComponent
              props={component.props as HeaderProps}
              style={{}}
              isSelected={false}
            />
          </div>
        );

      case 'Images+Link':
        return (
          <div key={component.id} style={componentStyle}>
            <ImagesLinkComponent
              props={component.props as ImagesLinkProps}
              style={{}}
              isSelected={false}
            />
          </div>
        );

      case 'Buttons':
        return (
          <div key={component.id} style={componentStyle}>
            <ButtonsComponent
              props={component.props as ButtonsProps}
              style={{}}
              isSelected={false}
            />
          </div>
        );

      case 'Heading+Text':
        return (
          <div key={component.id} style={componentStyle}>
            <HeadingTextComponent
              props={component.props as HeadingTextProps}
              style={{}}
              isSelected={false}
            />
          </div>
        );

      case 'Video':
        return (
          <div key={component.id} style={componentStyle}>
            <VideoComponent
              props={component.props as VideoProps}
              style={{}}
              isSelected={false}
            />
          </div>
        );

      case 'Image+Text':
        return (
          <div key={component.id} style={componentStyle}>
            <ImageTextComponent
              props={component.props as ImageTextProps}
              style={{}}
              isSelected={false}
            />
          </div>
        );

      case 'Social Links':
        return (
          <div key={component.id} style={componentStyle}>
            <SocialLinksComponent
              props={component.props as SocialLinksProps}
              style={{}}
              isSelected={false}
            />
          </div>
        );

      case 'Contact Us':
        return (
          <div key={component.id} style={componentStyle}>
            <ContactUsComponent
              props={component.props as ContactUsProps}
              style={{}}
              isSelected={false}
            />
          </div>
        );

      case 'Ingredients':
        return (
          <div key={component.id} style={componentStyle}>
            <IngredientsComponent
              props={component.props as IngredientsProps}
              style={{}}
              isSelected={false}
            />
          </div>
        );

      case 'Address':
        return (
          <div key={component.id} style={componentStyle}>
            <AddressComponent
              props={component.props as AddressProps}
              style={{}}
              isSelected={false}
            />
          </div>
        );

      case 'Map':
        return (
          <div key={component.id} style={componentStyle}>
            <MapComponent
              props={component.props as MapProps}
              style={{}}
              isSelected={false}
            />
          </div>
        );

      case 'Products':
        return (
          <div key={component.id} style={componentStyle}>
            <ProductsComponent
              props={component.props as ProductsProps}
              style={{}}
              isSelected={false}
            />
          </div>
        );

      case 'Gallery':
        return (
          <div key={component.id} style={componentStyle}>
            <GalleryComponent
              props={component.props as GalleryProps}
              style={{}}
              isSelected={false}
            />
          </div>
        );

      case 'Recipes':
        return (
          <div key={component.id} style={componentStyle}>
            <RecipesComponent
              props={component.props as RecipesProps}
              style={{}}
              isSelected={false}
            />
          </div>
        );

      case 'Nutrition Table':
        return (
          <div key={component.id} style={componentStyle}>
            <NutritionTableComponent
              props={component.props as NutritionTableProps}
              style={{}}
              isSelected={false}
            />
          </div>
        );

      default:
        console.warn(`Unknown component type: ${component.type}`);
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading published page...</p>
        </div>
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error || 'The published page you\'re looking for doesn\'t exist.'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Apply design customization to the page
  const pageStyle = applyDesignCustomization(pageData.design_customization);
  const customization = pageData.design_customization;

  // Create background overlay wrapper if needed
  const hasOverlay = customization.backgroundImage && customization.backgroundOverlay > 0;

  return (
    <div 
      className="min-h-screen w-full"
      style={pageStyle}
    >
      {/* Background overlay wrapper if needed */}
      {hasOverlay ? (
        <div 
          style={{
            position: 'relative',
            minHeight: '100vh',
            backgroundColor: customization.backgroundColor || '#ffffff',
            backgroundImage: customization.backgroundImage ? `url(${customization.backgroundImage})` : 'none',
            backgroundSize: customization.backgroundMode || 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: `rgba(0, 0, 0, ${customization.backgroundOverlay / 100})`,
              zIndex: 0,
            }}
          />
          {/* Content - Centered on desktop, left-aligned on mobile */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Mobile: Full width, left-aligned, no centering */}
            {/* Desktop: Centered with max-width container (like preview) */}
            <div className="p-4 md:p-8">
              <div className="w-full md:mx-auto md:bg-white md:shadow-lg md:min-h-full md:max-w-7xl">
                {pageData.page_content && Array.isArray(pageData.page_content) && pageData.page_content.length > 0 ? (
                  <div className="md:p-6">
                    {pageData.page_content.map((component) => renderComponent(component, pageData.design_customization))}
                  </div>
                ) : (
                  <div className="max-w-7xl mx-auto px-4 py-12 text-center">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No Content</h2>
                    <p className="text-gray-600">This page doesn't have any content yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Render all components without overlay - Centered on desktop, left-aligned on mobile */
        <div>
          {/* Mobile: Full width, left-aligned, no centering */}
          {/* Desktop: Centered with max-width container (like preview) */}
          <div className="p-4 md:p-8">
            <div className="w-full md:mx-auto md:bg-white md:shadow-lg md:min-h-full md:max-w-7xl">
              {pageData.page_content && Array.isArray(pageData.page_content) && pageData.page_content.length > 0 ? (
                <div className="md:p-6">
                  {pageData.page_content.map((component) => renderComponent(component, pageData.design_customization))}
                </div>
              ) : (
                <div className="max-w-7xl mx-auto px-4 py-12 text-center">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">No Content</h2>
                  <p className="text-gray-600">This page doesn't have any content yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Apply global design customization CSS variables */}
      <style>{`
        :root {
          /* Typography */
          --font-family-heading: ${pageData.design_customization.fontFamilyHeading || 'system-ui, sans-serif'};
          --font-family-body: ${pageData.design_customization.fontFamilyBody || 'system-ui, sans-serif'};
          --font-family-label: ${pageData.design_customization.fontFamilyLabel || 'system-ui, sans-serif'};
          --font-size-heading: ${pageData.design_customization.fontSizeHeading || '2rem'};
          --font-size-body: ${pageData.design_customization.fontSizeBody || '1rem'};
          --font-size-label: ${pageData.design_customization.fontSizeLabel || '0.875rem'};
          
          /* Colors */
          --primary-color: ${pageData.design_customization.primaryColor || '#3b82f6'};
          --secondary-color: ${pageData.design_customization.secondaryColor || '#8b5cf6'};
          --accent-color: ${pageData.design_customization.accentColor || '#10b981'};
          --text-color-primary: ${pageData.design_customization.textColorPrimary || '#111827'};
          --text-color-secondary: ${pageData.design_customization.textColorSecondary || '#6b7280'};
          --border-color-default: ${pageData.design_customization.borderColorDefault || '#e5e7eb'};
          
          /* Links */
          --link-color-default: ${pageData.design_customization.linkColorDefault || '#3b82f6'};
          --link-color-hover: ${pageData.design_customization.linkColorHover || '#2563eb'};
          --link-color-active: ${pageData.design_customization.linkColorActive || '#1d4ed8'};
          
          /* CTAs */
          --cta-color-default: ${pageData.design_customization.ctaColorDefault || '#10b981'};
          --cta-color-hover: ${pageData.design_customization.ctaColorHover || '#059669'};
          --cta-color-active: ${pageData.design_customization.ctaColorActive || '#047857'};
          
          /* Card Styles */
          --card-border-radius: ${getCardBorderRadius(pageData.design_customization.cardBorderRadius || 'md', pageData.design_customization.cardBorderRadiusCustom)};
          --card-elevation: ${getCardElevation(pageData.design_customization.cardElevation || 'none', pageData.design_customization.cardShadowColor)};
          --card-shadow-color: ${pageData.design_customization.cardShadowColor || 'rgba(0, 0, 0, 0.1)'};
          --card-surface-color: ${pageData.design_customization.cardSurfaceColor || '#ffffff'};
          --card-border-width: ${pageData.design_customization.cardBorderWidth || '0'};
          --card-border-color: ${pageData.design_customization.cardBorderColor || '#e5e7eb'};
          --card-border-style: ${pageData.design_customization.cardBorderStyle || 'solid'};
          
          /* Spacing */
          --global-spacing: ${pageData.design_customization.globalSpacing || '8px'};
          --component-gap: ${pageData.design_customization.componentGap || '24px'};
          --global-padding: ${pageData.design_customization.globalPadding || '16px'};
          
          /* Transitions */
          --transition-duration: ${pageData.design_customization.transitionDuration || '150ms'};
          --transition-easing: ${pageData.design_customization.transitionEasing || 'ease-in-out'};
          --transition: all var(--transition-duration) var(--transition-easing);
        }
        
        /* Typography */
        h1, h2, h3, h4, h5, h6 {
          font-family: var(--font-family-heading);
          font-size: var(--font-size-heading);
          color: var(--text-color-primary);
        }
        
        body, p, span, div {
          font-family: var(--font-family-body);
          font-size: var(--font-size-body);
          color: var(--text-color-primary);
        }
        
        label, small {
          font-family: var(--font-family-label);
          font-size: var(--font-size-label);
          color: var(--text-color-secondary);
        }
        
        /* Links */
        a {
          color: var(--link-color-default);
          transition: color var(--transition-duration) var(--transition-easing);
        }
        
        a:hover {
          color: var(--link-color-hover);
        }
        
        a:active {
          color: var(--link-color-active);
        }
        
        /* CTAs */
        button.cta, .cta-button {
          background-color: var(--cta-color-default);
          transition: background-color var(--transition-duration) var(--transition-easing);
        }
        
        button.cta:hover, .cta-button:hover {
          background-color: var(--cta-color-hover);
        }
        
        button.cta:active, .cta-button:active {
          background-color: var(--cta-color-active);
        }
        
        /* Card Styles - Applied globally */
        .card, [class*="card"], .component-card {
          border-radius: var(--card-border-radius);
          background-color: var(--card-surface-color);
          border: var(--card-border-width) var(--card-border-style) var(--card-border-color);
          box-shadow: var(--card-elevation);
          transition: var(--transition);
        }
        
        /* Global Spacing */
        .component-wrapper {
          margin-bottom: var(--component-gap);
        }
        
        /* Text Colors - Applied to all text elements */
        .component-wrapper, .component-wrapper * {
          color: var(--text-color-primary);
        }
        
        .component-wrapper p, .component-wrapper span, .component-wrapper div {
          color: var(--text-color-primary);
        }
        
        .component-wrapper label, .component-wrapper small {
          color: var(--text-color-secondary);
        }
        
        /* Interactive Elements */
        button, a, input, select, textarea {
          transition: var(--transition);
        }
      `}</style>
    </div>
  );
};

export default PublishedPageViewer;

