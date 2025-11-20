import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, Search, Settings, Layers, Zap, FileText, Monitor, Tablet, Smartphone, Package, Eye, Save, ExternalLink, CheckCircle, Clock, Share2, Copy, BarChart3, Mail, Phone, Undo, Redo, AlertCircle, Check, ChevronDown, X, ShoppingBag, Image as ImageIcon } from 'lucide-react';
import { Product } from '../types/productTypes';
import StudioStepper, { StepConfig } from './studio/StudioStepper';
import DesignSettingsPanel, { DesignCustomization } from './studio/DesignSettingsPanel';
import QRLinkPanel, { QRLinkData } from './studio/QRLinkPanel';
import { useHistory } from '../hooks/useHistory';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { 
  HeaderComponent, 
  getHeaderDefaultProps, 
  HeaderSettings,
  ImagesLinkComponent,
  getImagesLinkDefaultProps,
  ImagesLinkSettings,
  ButtonsComponent,
  getButtonsDefaultProps,
  ButtonsSettings,
  HeadingTextComponent,
  getHeadingTextDefaultProps,
  HeadingTextSettings,
  VideoComponent,
  getVideoDefaultProps,
  VideoSettings,
  ImageTextComponent,
  getImageTextDefaultProps,
  ImageTextSettings,
  SocialLinksComponent,
  getSocialLinksDefaultProps,
  SocialLinksSettings,
  ContactUsComponent,
  getContactUsDefaultProps,
  ContactUsSettings,
  IngredientsComponent,
  getIngredientsDefaultProps,
  IngredientsSettings,
  AddressComponent,
  getAddressDefaultProps,
  AddressSettings,
  MapComponent,
  getMapDefaultProps,
  MapSettings,
  ProductsComponent,
  getProductsDefaultProps,
  ProductsSettings,
  GalleryComponent,
  getGalleryDefaultProps,
  GallerySettings,
  NutritionTableComponent,
  getNutritionTableDefaultProps,
  NutritionTableSettings,
  RecipesComponent,
  getRecipesDefaultProps,
  RecipesSettings,
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
  RecipesProps,
  ComponentWrapper
} from './studio/components';
import { 
  saveStudioPage, 
  loadStudioPage,
  loadStudioPageById,
  checkSlugExists,
  checkLandingPageNameExists,
  getAllLandingPages,
  deleteStudioPage,
  StudioPage
} from '../api/studioPages';


// PageContentBlock is now imported from components

interface ComponentCategory {
  name: string;
  icon: React.ComponentType<any>;
  components: string[];
}

interface PageSettings {
  pageName: string;
  linkedProduct: string;
  isDefaultPage: boolean;
  seoTitle: string;
  metaDescription: string;
  metaKeywords: string;
  slug: string;
  enableRewardLogic: boolean;
  enableSmartTriggers: boolean;
  passwordProtection: boolean;
  password: string;
}

interface StudioTabProps {
  products: Product[];
  selectedProductForStudio: Product | null;
  setSelectedProductForStudio: (product: Product | null) => void;
  onCollapseSidebar?: () => void;
}

const StudioTab: React.FC<StudioTabProps> = ({
  products,
  selectedProductForStudio,
  setSelectedProductForStudio,
  onCollapseSidebar
}) => {
  const [selectedPageType, setSelectedPageType] = useState<'none' | 'landing' | 'product'>('none');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [showBuilder, setShowBuilder] = useState(false);
  const [activeRightTab, setActiveRightTab] = useState<'settings' | 'components' | 'integrations'>('settings');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [searchTerm, setSearchTerm] = useState('');
  const [pageContent, setPageContent] = useState<PageContentBlock[]>([]);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [publishStatus, setPublishStatus] = useState<'draft' | 'publishing' | 'published'>('draft');
  const [publishedPageUrl, setPublishedPageUrl] = useState<string>('');
  const [lastPublished, setLastPublished] = useState<string>('');
  const [pageViews, setPageViews] = useState<number>(0);
  const [showPublishedInfo, setShowPublishedInfo] = useState<boolean>(false);
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [slugAvailability, setSlugAvailability] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');
  const [slugError, setSlugError] = useState<string>('');
  const slugDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Page name validation state (for landing pages)
  const [pageNameAvailability, setPageNameAvailability] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');
  const [pageNameError, setPageNameError] = useState<string>('');
  const pageNameDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [draggedComponentId, setDraggedComponentId] = useState<string | null>(null);
  const [dragOverComponentId, setDragOverComponentId] = useState<string | null>(null);
  const previewScrollRef = useRef<HTMLDivElement>(null);
  const settingsPanelRef = useRef<HTMLDivElement>(null);
  const [pageSettings, setPageSettings] = useState<PageSettings>({
    pageName: '',
    linkedProduct: '',
    isDefaultPage: false,
    seoTitle: '',
    metaDescription: '',
    metaKeywords: '',
    slug: '',
    enableRewardLogic: false,
    enableSmartTriggers: false,
    passwordProtection: false,
    password: ''
  });

  // Three-step workflow state
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Design customization state with default values
  const [designCustomization, setDesignCustomization] = useState<DesignCustomization>({
    backgroundColor: '#ffffff',
    backgroundImage: '',
    backgroundMode: 'cover',
    backgroundOverlay: 0,
    gradientType: 'none',
    gradientAngle: 90,
    gradientColorStart: '#3b82f6',
    gradientColorEnd: '#8b5cf6',
    fontFamilyHeading: 'system-ui',
    fontFamilyBody: 'system-ui',
    fontFamilyLabel: 'system-ui',
    fontSizeHeading: '2rem',
    fontSizeBody: '1rem',
    fontSizeLabel: '0.875rem',
    cardBorderRadius: 'md',
    cardElevation: 'raised',
    cardSurfaceColor: '#ffffff',
    loaderType: 'spinner',
    loaderAccentColor: '#3b82f6',
    linkColorDefault: '#3b82f6',
    linkColorHover: '#2563eb',
    linkColorActive: '#1d4ed8',
    ctaColorDefault: '#10b981',
    ctaColorHover: '#059669',
    ctaColorActive: '#047857',
  });

  // QR and Link management state
  const [qrLinkData, setQrLinkData] = useState<QRLinkData>({
    slug: '',
    isSlugLocked: false,
    campaignName: '',
    folderId: '',
    qrOption: 'create_new',
    qrCodeId: '',
    qrImagePng: '',
    qrImageSvg: '',
    qrImageJpeg: '',
    qrCustomization: undefined,
    utmSource: '',
    utmMedium: '',
    utmCampaign: '',
  });

  // Sample folders and QR codes for demo
  const [folders] = useState([
    { id: 'folder-1', name: 'Marketing Campaigns' },
    { id: 'folder-2', name: 'Product Launches' },
    { id: 'folder-3', name: 'Seasonal Promotions' },
  ]);

  const [existingQRCodes] = useState([
    { id: 'qr-1', name: 'Summer Sale QR', imageUrl: 'https://via.placeholder.com/200' },
    { id: 'qr-2', name: 'Product Launch QR', imageUrl: 'https://via.placeholder.com/200' },
  ]);

  // Undo/Redo history
  const pageHistoryKey = selectedProductForStudio?.id || 'default';
  const {
    state: historyState,
    setState: setHistoryState,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useHistory(
    { pageContent, designCustomization, qrLinkData },
    pageHistoryKey
  );

  // Keyboard shortcuts
  useKeyboardShortcuts(
    [
      {
        key: 'z',
        ctrlKey: !navigator.platform.includes('Mac'),
        metaKey: navigator.platform.includes('Mac'),
        callback: undo,
      },
      {
        key: 'y',
        ctrlKey: !navigator.platform.includes('Mac'),
        callback: redo,
      },
      {
        key: 'z',
        shiftKey: true,
        metaKey: navigator.platform.includes('Mac'),
        callback: redo,
      },
    ],
    showBuilder
  );

  // Saved landing pages from database
  const [savedLandingPages, setSavedLandingPages] = useState<StudioPage[]>([]);
  const [isLoadingLandingPages, setIsLoadingLandingPages] = useState(false);
  
  // Load saved landing pages when component mounts or when returning to studio
  useEffect(() => {
    const loadLandingPages = async () => {
      setIsLoadingLandingPages(true);
      try {
        const pages = await getAllLandingPages();
        setSavedLandingPages(pages);
      } catch (error) {
        console.error('Error loading landing pages:', error);
      } finally {
        setIsLoadingLandingPages(false);
      }
    };
    
    if (selectedPageType === 'none') {
      loadLandingPages();
    }
  }, [selectedPageType]);

  // Handle edit landing page
  const handleEditLandingPage = async (pageId: string) => {
    try {
      setIsLoadingPage(true);
      const savedPage = await loadStudioPageById(pageId);
      
      if (!savedPage) {
        alert('Page not found');
        setIsLoadingPage(false);
        return;
      }

      // Load the page data
      setCurrentPageId(savedPage.id);
      setSelectedPageType(savedPage.page_type);
      
      // Load page settings
      setPageSettings({
        pageName: savedPage.page_name,
        linkedProduct: savedPage.linked_product_id || '',
        isDefaultPage: savedPage.is_default_page,
        seoTitle: savedPage.seo_title || '',
        metaDescription: savedPage.meta_description || '',
        metaKeywords: savedPage.meta_keywords || '',
        slug: savedPage.slug,
        enableRewardLogic: savedPage.enable_reward_logic,
        enableSmartTriggers: savedPage.enable_smart_triggers,
        passwordProtection: savedPage.password_protection,
        password: savedPage.password || ''
      });

      // Load page content
      if (savedPage.page_content && Array.isArray(savedPage.page_content)) {
        setPageContent(savedPage.page_content);
      } else {
        setPageContent([]);
      }

      // Load design customization
      if (savedPage.design_customization) {
        setDesignCustomization(savedPage.design_customization);
      }

      // Load QR & Link data
      if (savedPage.qr_link_data) {
        const qrLinkDataWithSlug = {
          ...savedPage.qr_link_data,
          slug: savedPage.qr_link_data.slug || savedPage.slug || '',
        };
        setQrLinkData(qrLinkDataWithSlug);
      } else if (savedPage.slug) {
        setQrLinkData(prev => ({
          ...prev,
          slug: savedPage.slug,
          isSlugLocked: false,
        }));
      }
      
      // Check slug availability - will be checked by useEffect when qrLinkData.slug is set

      // Set publish status
      if (savedPage.status === 'published' && savedPage.published_url) {
        setPublishStatus('published');
        setPublishedPageUrl(savedPage.published_url);
        setPageViews(savedPage.page_views || 0);
        if (savedPage.published_at) {
          setLastPublished(new Date(savedPage.published_at).toLocaleString());
        }
      } else {
        setPublishStatus('draft');
        setPublishedPageUrl('');
        setPageViews(0);
        setLastPublished('');
      }

      // Open builder
      setShowBuilder(true);
      setCurrentStep(0);
    } catch (error) {
      console.error('Error loading page:', error);
      alert('Failed to load page. Please try again.');
    } finally {
      setIsLoadingPage(false);
    }
  };

  // Handle delete landing page
  const handleDeleteLandingPage = async (pageId: string, pageName: string) => {
    if (!confirm(`Are you sure you want to delete "${pageName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteStudioPage(pageId);
      // Remove from local state
      setSavedLandingPages(prev => prev.filter(p => p.id !== pageId));
      alert('Page deleted successfully');
    } catch (error: any) {
      console.error('Error deleting page:', error);
      alert(`Failed to delete page: ${error.message || 'Unknown error'}`);
    }
  };

  // Auto-collapse sidebar when builder opens
  useEffect(() => {
    if (showBuilder && onCollapseSidebar) {
      onCollapseSidebar();
    }
  }, [showBuilder, onCollapseSidebar]);

  // Prevent body scroll when builder is open
  useEffect(() => {
    if (showBuilder) {
      // Store original overflow values
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      
      // Prevent body and html from scrolling
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      
      return () => {
        // Restore original overflow values
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
      };
    }
  }, [showBuilder]);

  // Lock preview canvas scroll when settings panel scrolls
  useEffect(() => {
    if (!showBuilder) return;
    
    const settingsPanel = settingsPanelRef.current;
    const previewScroll = previewScrollRef.current;
    
    if (!settingsPanel || !previewScroll) return;

    // Store the locked scroll position - initialize with current scroll
    let lockedScrollTop = previewScroll.scrollTop;
    
    // Update locked position ONLY when preview is intentionally scrolled by user
    const handlePreviewScroll = () => {
      lockedScrollTop = previewScroll.scrollTop;
    };
    
    // CRITICAL: Document-level wheel event handler to lock preview when settings scrolls
    const handleDocumentWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      
      // If wheel event originated from settings panel, lock preview immediately
      if (settingsPanel && (settingsPanel.contains(target) || target === settingsPanel)) {
        // IMMEDIATELY lock preview at stored position - do this BEFORE anything else
        // This prevents any scroll chaining from affecting preview
        if (previewScroll && previewScroll.scrollTop !== lockedScrollTop) {
          previewScroll.scrollTop = lockedScrollTop;
        }
      }
    };
    
    // Lock preview scroll SYNCHRONOUSLY when settings panel receives wheel events
    const handleSettingsWheel = (e: WheelEvent) => {
      // CRITICAL: Lock preview IMMEDIATELY before any scroll can happen
      previewScroll.scrollTop = lockedScrollTop;
      
      // Check if we're at boundaries to prevent scroll chaining
      const target = e.currentTarget as HTMLElement;
      const { scrollTop, scrollHeight, clientHeight } = target;
      const isAtTop = scrollTop === 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
      
      // Prevent scroll chaining when at boundaries
      if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
        e.preventDefault();
        e.stopPropagation();
        // Lock preview again immediately after preventDefault
        previewScroll.scrollTop = lockedScrollTop;
      }
      
      // Also prevent propagation to parent containers that might affect preview
      e.stopPropagation();
    };
    
    // Lock preview scroll SYNCHRONOUSLY when settings panel scrolls
    const handleSettingsScroll = () => {
      // IMMEDIATELY lock preview at stored position
      if (previewScroll.scrollTop !== lockedScrollTop) {
        previewScroll.scrollTop = lockedScrollTop;
      }
    };

    // Use document-level listener in capture phase to intercept ALL wheel events
    // This runs BEFORE any element-specific handlers
    document.addEventListener('wheel', handleDocumentWheel, { passive: false, capture: true });
    
    // Use capture phase to intercept events EARLY and prevent scroll chaining
    settingsPanel.addEventListener('wheel', handleSettingsWheel, { passive: false, capture: true });
    settingsPanel.addEventListener('scroll', handleSettingsScroll, { passive: false, capture: true });
    previewScroll.addEventListener('scroll', handlePreviewScroll, { passive: true });

    // Continuous monitoring as safety net - aggressively lock preview if it changes
    let scrollMonitorId: number;
    const monitorScroll = () => {
      // Check every frame and lock immediately if preview scroll changed
      if (previewScroll.scrollTop !== lockedScrollTop) {
        // Force lock immediately - no delay
        previewScroll.scrollTop = lockedScrollTop;
      }
      scrollMonitorId = requestAnimationFrame(monitorScroll);
    };
    scrollMonitorId = requestAnimationFrame(monitorScroll);

    return () => {
      cancelAnimationFrame(scrollMonitorId);
      document.removeEventListener('wheel', handleDocumentWheel, { capture: true } as any);
      settingsPanel.removeEventListener('wheel', handleSettingsWheel, { capture: true } as any);
      settingsPanel.removeEventListener('scroll', handleSettingsScroll, { capture: true } as any);
      previewScroll.removeEventListener('scroll', handlePreviewScroll);
    };
  }, [showBuilder, activeRightTab]);

  // Load saved page data when a product is selected
  useEffect(() => {
    const loadSavedPage = async () => {
      if (!selectedProductForStudio) {
        setCurrentPageId(null);
        setSelectedPageType('none');
        return;
      }

      setIsLoadingPage(true);
      try {
        // Try to load draft first, then published
        const savedPage = await loadStudioPage(
          selectedProductForStudio.id,
          'product',
          'draft'
        ) || await loadStudioPage(
          selectedProductForStudio.id,
          'product',
          'published'
        );

        if (savedPage) {
          // Load saved data
          setCurrentPageId(savedPage.id);
          setSelectedPageType(savedPage.page_type);
          setSelectedProductId(selectedProductForStudio.id);
          
          // Load page settings
          setPageSettings({
            pageName: savedPage.page_name,
            linkedProduct: savedPage.linked_product_id || savedPage.product_id || '',
            isDefaultPage: savedPage.is_default_page,
            seoTitle: savedPage.seo_title || '',
            metaDescription: savedPage.meta_description || '',
            metaKeywords: savedPage.meta_keywords || '',
            slug: savedPage.slug,
            enableRewardLogic: savedPage.enable_reward_logic,
            enableSmartTriggers: savedPage.enable_smart_triggers,
            passwordProtection: savedPage.password_protection,
            password: savedPage.password || ''
          });

          // Load page content
          if (savedPage.page_content && Array.isArray(savedPage.page_content)) {
            setPageContent(savedPage.page_content);
          } else {
            setPageContent([]);
          }

          // Load design customization
          if (savedPage.design_customization) {
            setDesignCustomization(savedPage.design_customization);
          }

          // Load QR & Link data (this is the single source of truth for slug)
          if (savedPage.qr_link_data) {
            // If qr_link_data has a slug, use it; otherwise use savedPage.slug
            const qrLinkDataWithSlug = {
              ...savedPage.qr_link_data,
              slug: savedPage.qr_link_data.slug || savedPage.slug || '',
            };
            setQrLinkData(qrLinkDataWithSlug);
          } else if (savedPage.slug) {
            // If no qr_link_data but we have a slug, initialize qrLinkData with the slug
            setQrLinkData(prev => ({
              ...prev,
              slug: savedPage.slug,
              isSlugLocked: false,
            }));
          }
          
          // Slug availability will be checked by the useEffect that watches qrLinkData.slug

          // Load publish status
          if (savedPage.status === 'published') {
            setPublishStatus('published');
            setPublishedPageUrl(savedPage.published_url || '');
            setPageViews(savedPage.page_views || 0);
            if (savedPage.published_at) {
              setLastPublished(new Date(savedPage.published_at).toLocaleString());
            }
          } else {
            setPublishStatus('draft');
            setPublishedPageUrl('');
            setPageViews(0);
            setLastPublished('');
          }
        } else {
          // No saved page, initialize with defaults (slug is empty for new pages)
          setCurrentPageId(null);
      setSelectedPageType('product');
      setSelectedProductId(selectedProductForStudio.id);
      setPageSettings(prev => ({
        ...prev,
        pageName: selectedProductForStudio.name,
        linkedProduct: selectedProductForStudio.id,
        slug: '' // Empty slug for new pages
      }));
          
          // Set empty slug in qrLinkData (single source of truth) - user will add slug later
      setQrLinkData(prev => ({
        ...prev,
        slug: '', // Empty slug for new pages
            isSlugLocked: false,
        campaignName: `${selectedProductForStudio.name} Campaign`,
      }));
          
          setPublishStatus('draft');
          setPublishedPageUrl('');
          setPageViews(0);
          setLastPublished('');
          setPageContent([]);
        }
      } catch (error) {
        console.error('Error loading saved page:', error);
        // Initialize with defaults on error (slug is empty for new pages)
        setCurrentPageId(null);
        setSelectedPageType('product');
        setSelectedProductId(selectedProductForStudio.id);
        
        // Set empty slug in qrLinkData (single source of truth) - user will add slug later
        setQrLinkData(prev => ({
          ...prev,
          slug: '', // Empty slug for new pages
          isSlugLocked: false,
          campaignName: `${selectedProductForStudio.name} Campaign`,
        }));
        
        // Also set in pageSettings for backward compatibility
        setPageSettings(prev => ({
          ...prev,
          pageName: selectedProductForStudio.name,
          linkedProduct: selectedProductForStudio.id,
          slug: '' // Empty slug for new pages
        }));
        
        setPublishStatus('draft');
        setPageContent([]);
      } finally {
        setIsLoadingPage(false);
      }
    };

    loadSavedPage();
  }, [selectedProductForStudio]);

  // Sync history state with local state
  useEffect(() => {
    if (historyState.pageContent !== undefined) {
      setPageContent(historyState.pageContent);
    }
    if (historyState.designCustomization !== undefined) {
      setDesignCustomization(historyState.designCustomization);
    }
    if (historyState.qrLinkData !== undefined) {
      setQrLinkData(historyState.qrLinkData);
    }
  }, [historyState]);

  // Step validation logic
  const getStepValidation = (): StepConfig[] => {
    const isStep1Valid = pageContent.length > 0;
    // Design step is always valid - contrast issues are warnings, not blockers
    const isStep2Valid = true;
    const isStep3Valid =
      qrLinkData.slug.length >= 5 &&
      qrLinkData.campaignName.trim().length > 0;

    return [
      { id: 1, label: 'Content', isValid: isStep1Valid },
      { id: 2, label: 'Design / Settings', isValid: isStep2Valid },
      { id: 3, label: 'QR & Link', isValid: isStep3Valid },
    ];
  };

  // Contrast validation
  const validateContrast = (): string[] => {
    const issues: string[] = [];
    const calculateContrast = (fg: string, bg: string): number => {
      const getLuminance = (hex: string): number => {
        const rgb = parseInt(hex.slice(1), 16);
        const r = (rgb >> 16) & 0xff;
        const g = (rgb >> 8) & 0xff;
        const b = (rgb >> 0) & 0xff;

        const [rs, gs, bs] = [r, g, b].map((c) => {
          const sRGB = c / 255;
          return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
        });

        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
      };

      const l1 = getLuminance(fg);
      const l2 = getLuminance(bg);
      const lighter = Math.max(l1, l2);
      const darker = Math.min(l1, l2);

      return (lighter + 0.05) / (darker + 0.05);
    };

    const bgContrast = calculateContrast('#000000', designCustomization.backgroundColor);
    if (bgContrast < 4.5) {
      issues.push(`Background color contrast is ${bgContrast.toFixed(2)}:1 (needs ≥4.5:1)`);
    }

    return issues;
  };

  // Handle step change
  const handleStepChange = (step: number) => {
    const steps = getStepValidation();
    if (step > currentStep) {
      for (let i = currentStep; i < step; i++) {
        if (!steps[i].isValid) {
          return;
        }
      }
    }
    setCurrentStep(step);

    // Auto-switch right panel tab based on step
    if (step === 1) {
      setActiveRightTab('settings');
    } else if (step === 2) {
      setActiveRightTab('settings');
    }
  };

  // Update functions to use history
  const updatePageContentWithHistory = (newContent: PageContentBlock[]) => {
    setHistoryState({
      pageContent: newContent,
      designCustomization,
      qrLinkData,
    });
  };

  const reorderComponents = (sourceId: string, targetId: string | null) => {
    if (sourceId === targetId) return;
    const newContent = [...pageContent];
    const sourceIndex = newContent.findIndex(component => component.id === sourceId);
    if (sourceIndex === -1) return;
    const [movedComponent] = newContent.splice(sourceIndex, 1);

    if (targetId) {
      const targetIndex = newContent.findIndex(component => component.id === targetId);
      if (targetIndex === -1) return;
      newContent.splice(targetIndex, 0, movedComponent);
    } else {
      newContent.push(movedComponent);
    }

    updatePageContentWithHistory(newContent);
  };

  const handleComponentDragStart = (event: React.DragEvent<HTMLDivElement>, componentId: string) => {
    setDraggedComponentId(componentId);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', componentId);
  };

  const handleComponentDragOver = (event: React.DragEvent<HTMLDivElement>, targetComponentId: string | null) => {
    event.preventDefault();
    if (!draggedComponentId || draggedComponentId === targetComponentId) return;
    setDragOverComponentId(targetComponentId);
    event.dataTransfer.dropEffect = 'move';
  };

  const handleComponentDragLeave = (targetComponentId: string | null) => {
    if (dragOverComponentId === targetComponentId) {
      setDragOverComponentId(null);
    }
  };

  const handleComponentDrop = (targetComponentId: string | null) => {
    if (!draggedComponentId) return;
    reorderComponents(draggedComponentId, targetComponentId);
    setDraggedComponentId(null);
    setDragOverComponentId(null);
  };

  const handleComponentDragEnd = () => {
    setDraggedComponentId(null);
    setDragOverComponentId(null);
  };

  const updateDesignCustomizationWithHistory = (key: keyof DesignCustomization, value: any) => {
    const newCustomization = { ...designCustomization, [key]: value };
    setHistoryState({
      pageContent,
      designCustomization: newCustomization,
      qrLinkData,
    });
  };

  const updateQrLinkDataWithHistory = (key: keyof QRLinkData, value: any) => {
    if (key === 'slug' && qrLinkData.isSlugLocked) {
      return;
    }
    const newQrLinkData = { ...qrLinkData, [key]: value };
    setHistoryState({
      pageContent,
      designCustomization,
      qrLinkData: newQrLinkData,
    });
  };

  // Handle product selection from dropdown
  const handleProductSelection = (productId: string) => {
    setSelectedProductId(productId);
    const product = products.find(p => p.id === productId);
    setSelectedProductForStudio(product || null);
  };

  // Handle publishing
  const handlePublish = async () => {
    if (!canPublish()) {
      if (!showBuilder) {
        return; // Silently fail if not in builder
      }
      if (selectedPageType === 'none') {
        alert('Please select a page type first');
        return;
      }
      if (!pageSettings.pageName || pageSettings.pageName.trim() === '') {
        alert('Please provide a page name');
        return;
      }
      
      // For landing pages, check page name uniqueness
      if (selectedPageType === 'landing') {
        if (pageNameAvailability === 'checking') {
          alert('Please wait while we check page name availability...');
          return;
        }
        
        if (pageNameAvailability === 'unavailable' || pageNameError) {
          alert(`Cannot publish: ${pageNameError || 'Page name is not available. Please choose a different name.'}`);
          return;
        }
      }
      
      // Slug is required for publishing
      const slug = qrLinkData.slug;
      if (!slug || slug.trim() === '') {
        alert('Please provide a slug in the QR & Link tab before publishing');
        return;
      }
      
      // Check if slug is available (final check before publishing)
      if (slugAvailability === 'checking') {
        alert('Please wait while we check slug availability...');
        return;
      }
      
      if (slugAvailability === 'unavailable' || slugError) {
        alert(`Cannot publish: ${slugError || 'Slug is not available. Please choose a different slug.'}`);
        return;
      }
      
      if (selectedPageType === 'product' && !selectedProductForStudio) {
        alert('Please select a product first');
        return;
      }
      if (pageContent.length === 0) {
        alert('Please add at least one component to the page before publishing');
        return;
      }
      return;
    }

    // Final validation: Check slug exists one more time before publishing
    const slug = qrLinkData.slug;
    try {
      const exists = await checkSlugExists(slug, currentPageId || undefined);
      if (exists) {
        setSlugAvailability('unavailable');
        setSlugError('This slug is already taken. Please choose a different one.');
        alert('This slug is already taken. Please choose a different slug.');
        return;
      }
    } catch (error: any) {
      console.error('Error checking slug:', error);
      alert('Error checking slug availability. Please try again.');
      return;
    }
    
    setPublishStatus('publishing');
    setSaveStatus('saving');
    
    try {
      // Build published URL (use qrLinkData.slug as single source of truth)
      const baseUrl = window.location.origin;
      const publishedUrl = `${baseUrl}/published-product/${qrLinkData.slug}`;

      // Ensure pageType is valid
      const pageType: 'landing' | 'product' = selectedPageType === 'landing' ? 'landing' : 'product';

      // For product pages, use selectedProductForStudio.id; for landing pages, use null or pageSettings.linkedProduct
      const productId = selectedPageType === 'product' && selectedProductForStudio 
        ? selectedProductForStudio.id 
        : (pageSettings.linkedProduct || null);

      // Sync slug to pageSettings for database storage (use qrLinkData.slug as single source of truth)
      const pageSettingsWithSlug = {
        ...pageSettings,
        slug: qrLinkData.slug || '',
      };

      // Save as published
      const savedPage = await saveStudioPage(currentPageId, {
        productId,
        pageType,
        status: 'published',
        pageSettings: pageSettingsWithSlug,
        pageContent,
        designCustomization,
        qrLinkData,
        publishedUrl,
      });

      setCurrentPageId(savedPage.id);
      setPublishedPageUrl(publishedUrl);
      setLastPublished(new Date().toLocaleString());
      setPageViews(savedPage.page_views || 0);
      setPublishStatus('published');
      setSaveStatus('saved');
      // Show published info section after successful publish
      setShowPublishedInfo(true);
      
      // Refresh landing pages list if it's a landing page
      if (selectedPageType === 'landing' && !productId) {
        try {
          const pages = await getAllLandingPages();
          setSavedLandingPages(pages);
        } catch (error) {
          console.error('Error refreshing landing pages:', error);
        }
      }
      
      // Show success message
      setTimeout(() => {
        setSaveStatus('idle');
    }, 2000);

      console.log('Page published successfully:', publishedUrl);
    } catch (error: any) {
      console.error('Error publishing page:', error);
      setPublishStatus('draft');
      setSaveStatus('error');
      alert(`Failed to publish page: ${error.message || 'Unknown error'}`);
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    }
  };

  // Check if we can save (have required data)
  const canSave = () => {
    // Must be in builder mode
    if (!showBuilder) return false;
    
    // Must have a page type selected
    if (selectedPageType === 'none') return false;
    
    // Must have page name (required)
    if (!pageSettings.pageName || pageSettings.pageName.trim() === '') return false;
    
    // For landing pages, page name must be unique
    if (selectedPageType === 'landing') {
      // Page name must be available (not checking or unavailable)
      if (pageNameAvailability === 'unavailable' || pageNameAvailability === 'checking') {
        return false;
      }
      
      // Page name must pass validation (no errors)
      if (pageNameError && pageNameError.trim() !== '') {
        return false;
      }
    }
    
    // Slug is optional for new pages, but if provided, it must be valid
    const slug = qrLinkData.slug;
    if (slug && slug.trim() !== '') {
      // Slug must be available (not checking or unavailable)
      if (slugAvailability === 'unavailable' || slugAvailability === 'checking') {
        return false;
      }
      
      // Slug must pass validation (no errors)
      if (slugError && slugError.trim() !== '') {
        return false;
      }
    }
    
    // For product pages, we need a product selected
    if (selectedPageType === 'product') {
      return !!selectedProductForStudio;
    }
    
    // For landing pages, we just need the above conditions
    return true;
  };

  // Check if we can publish (have required data and content)
  const canPublish = () => {
    if (!canSave()) return false;
    
    // Need at least one component to publish
    if (pageContent.length === 0) return false;
    
    // Slug is required for publishing
    const slug = qrLinkData.slug;
    if (!slug || slug.trim() === '') return false;
    
    // Slug must be available (not checking or unavailable)
    if (slugAvailability === 'unavailable' || slugAvailability === 'checking') {
      return false;
    }
    
    // Slug must pass validation (no errors)
    if (slugError && slugError.trim() !== '') {
      return false;
    }
    
    return true;
  };

  // Handle save draft
  const handleSaveDraft = async () => {
    if (!canSave()) {
      if (!showBuilder) {
        return; // Silently fail if not in builder
      }
      if (selectedPageType === 'none') {
        alert('Please select a page type first');
        return;
      }
      if (!pageSettings.pageName || pageSettings.pageName.trim() === '') {
        alert('Please provide a page name');
        return;
      }
      
      // For landing pages, check page name uniqueness
      if (selectedPageType === 'landing') {
        if (pageNameAvailability === 'checking') {
          alert('Please wait while we check page name availability...');
          return;
        }
        
        if (pageNameAvailability === 'unavailable' || pageNameError) {
          alert(`Cannot save: ${pageNameError || 'Page name is not available. Please choose a different name.'}`);
          return;
        }
      }
      
      // Slug is optional for drafts, but if provided, validate it
      const slug = qrLinkData.slug;
      if (slug && slug.trim() !== '') {
        // Check if slug is available (final check before saving)
        if (slugAvailability === 'checking') {
          alert('Please wait while we check slug availability...');
          return;
        }
        
        if (slugAvailability === 'unavailable' || slugError) {
          alert(`Cannot save: ${slugError || 'Slug is not available. Please choose a different slug.'}`);
          return;
        }
        
        // Final validation: Check slug exists one more time before saving
        try {
          const exists = await checkSlugExists(slug, currentPageId || undefined);
          if (exists) {
            setSlugAvailability('unavailable');
            setSlugError('This slug is already taken. Please choose a different one.');
            alert('This slug is already taken. Please choose a different slug.');
            return;
          }
        } catch (error: any) {
          console.error('Error checking slug:', error);
          alert('Error checking slug availability. Please try again.');
          return;
        }
      }
      
      if (selectedPageType === 'product' && !selectedProductForStudio) {
        alert('Please select a product first');
        return;
      }
      return;
    }

    setSaveStatus('saving');
    try {
      const publishedUrl = currentPageId && publishStatus === 'published' 
        ? publishedPageUrl 
        : undefined;

      // Ensure pageType is valid
      const pageType: 'landing' | 'product' = selectedPageType === 'landing' ? 'landing' : 'product';
      
      // For product pages, use selectedProductForStudio.id; for landing pages, use null or pageSettings.linkedProduct
      const productId = selectedPageType === 'product' && selectedProductForStudio 
        ? selectedProductForStudio.id 
        : (pageSettings.linkedProduct || null);
      
      // Use qrLinkData.slug as the single source of truth
      // Sync slug to pageSettings for database storage
      const pageSettingsWithSlug = {
      ...pageSettings,
        slug: qrLinkData.slug || '',
      };
      
      const savedPage = await saveStudioPage(currentPageId, {
        productId,
        pageType,
        status: 'draft',
        pageSettings: pageSettingsWithSlug,
        pageContent,
        designCustomization,
        qrLinkData,
        publishedUrl,
      });

      setCurrentPageId(savedPage.id);
      setSaveStatus('saved');
      
      // Refresh landing pages list if it's a landing page
      if (selectedPageType === 'landing' && !productId) {
        try {
          const pages = await getAllLandingPages();
          setSavedLandingPages(pages);
        } catch (error) {
          console.error('Error refreshing landing pages:', error);
        }
      }
      
      // Show success message
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);

      console.log('Draft saved successfully:', savedPage.id);
    } catch (error: any) {
      console.error('Error saving draft:', error);
      setSaveStatus('error');
      alert(`Failed to save draft: ${error.message || 'Unknown error'}`);
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    }
  };

  // Copy URL to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('URL copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const landingTemplates = [
    { id: 'standard', name: 'Standard Landing', category: 'Basic', description: 'Clean, professional layout' },
    { id: 'promotional', name: 'Promotional', category: 'Marketing', description: 'High-conversion focused' },
    { id: 'seasonal', name: 'Seasonal', category: 'Marketing', description: 'Holiday and event themes' },
    { id: 'brand-story', name: 'Brand Story', category: 'Storytelling', description: 'Narrative-driven design' },
    { id: 'rewards', name: 'Rewards Landing', category: 'Rewards', description: 'Loyalty program focused' },
    { id: 'custom', name: 'Start from Scratch', category: 'Custom', description: 'Build your own layout' },
  ];

  const productTemplates = [
    { id: 'standard-product', name: 'Standard Product', category: 'Basic', description: 'Classic product layout' },
    { id: 'minimalist', name: 'Minimalist', category: 'Design', description: 'Clean, minimal design' },
    { id: 'storytelling', name: 'Storytelling', category: 'Storytelling', description: 'Product story focus' },
    { id: 'product-first', name: 'Product First', category: 'Visual', description: 'Image-heavy layout' },
    { id: 'reward-focused', name: 'Reward-Focused', category: 'Rewards', description: 'Loyalty integration' },
    { id: 'feature-highlight', name: 'Feature Highlight', category: 'Technical', description: 'Feature comparison' },
    { id: 'how-to-guide', name: 'How-to Guide', category: 'Educational', description: 'Instructional layout' },
    { id: 'custom-product', name: 'Start from Scratch', category: 'Custom', description: 'Build your own layout' },
  ];

  // Template definitions - Using only Header and Images+Link components
  const standardLandingTemplate: PageContentBlock[] = [
    {
      id: 'header-1',
      type: 'Header',
      props: getHeaderDefaultProps(),
      style: {
        margin: { bottom: '2rem' }
      }
    },
    {
      id: 'images-link-1',
      type: 'Images+Link',
      props: getImagesLinkDefaultProps(),
      style: {
        margin: { bottom: '2rem' }
      }
    }
  ];

  const standardProductTemplate: PageContentBlock[] = [
    {
      id: 'header-1',
      type: 'Header',
      props: getHeaderDefaultProps(),
      style: {
        margin: { bottom: '1rem' }
      }
    },
    {
      id: 'images-link-1',
      type: 'Images+Link',
      props: getImagesLinkDefaultProps(),
      style: {
        margin: { bottom: '2rem' }
      }
    }
  ];

  const componentCategories: ComponentCategory[] = [
    { name: 'Basic', icon: FileText, components: ['Header', 'Heading+Text', 'Buttons', 'Images+Link', 'Image+Text', 'Video'] },
    { name: 'Commerce', icon: ShoppingBag, components: ['Products'] },
    { name: 'Media', icon: ImageIcon, components: ['Gallery'] },
    { name: 'Social', icon: Share2, components: ['Social Links'] },
    { name: 'Contact', icon: Mail, components: ['Contact Us', 'Address'] },
    { name: 'Content', icon: FileText, components: ['Ingredients', 'Recipes', 'Nutrition Table'] },
    { name: 'Location', icon: Package, components: ['Map'] },
  ];

  const addComponent = (type: string) => {
    const newComponent: PageContentBlock = {
      id: `component-${Date.now()}`,
      type,
      props: getDefaultProps(type),
      style: {}
    };
    const newContent = [...pageContent, newComponent];
    updatePageContentWithHistory(newContent);
    setSelectedComponentId(newComponent.id);
  };

  const getDefaultProps = (type: string): Record<string, any> => {
    switch (type) {
      case 'Header':
        return getHeaderDefaultProps();
      case 'Images+Link':
        return getImagesLinkDefaultProps();
      case 'Buttons':
        return getButtonsDefaultProps();
      case 'Heading+Text':
        return getHeadingTextDefaultProps();
      case 'Video':
        return getVideoDefaultProps();
      case 'Image+Text':
        return getImageTextDefaultProps();
      case 'Social Links':
        return getSocialLinksDefaultProps();
      case 'Contact Us':
        return getContactUsDefaultProps();
      case 'Ingredients':
        return getIngredientsDefaultProps();
      case 'Address':
        return getAddressDefaultProps();
      case 'Map':
        return getMapDefaultProps();
      case 'Products':
        return getProductsDefaultProps();
      case 'Gallery':
        return getGalleryDefaultProps();
      case 'Recipes':
        return getRecipesDefaultProps();
      case 'Nutrition Table':
        return getNutritionTableDefaultProps();
      default:
        return {};
    }
  };

  const selectComponent = (id: string) => {
    setSelectedComponentId(id);
    setActiveRightTab('components');
    // Close published info section when selecting a component to edit
    setShowPublishedInfo(false);
  };

  const updateComponentProps = (id: string, newProps: Record<string, any>) => {
    const newContent = pageContent.map(component =>
      component.id === id ? { ...component, props: { ...component.props, ...newProps } } : component
    );
    updatePageContentWithHistory(newContent);
  };

  const updateComponentStyle = (id: string, newStyle: Record<string, any>) => {
    const newContent = pageContent.map(component =>
      component.id === id ? { ...component, style: { ...component.style, ...newStyle } } : component
    );
    updatePageContentWithHistory(newContent);
  };

  const deleteComponent = (id: string) => {
    const newContent = pageContent.filter(component => component.id !== id);
    updatePageContentWithHistory(newContent);
    if (selectedComponentId === id) {
      setSelectedComponentId(null);
    }
  };


  // Check slug availability (using qrLinkData.slug as source of truth)
  const checkSlugAvailability = useCallback(async (slug: string) => {
    if (!slug || slug.trim() === '') {
      setSlugAvailability('idle');
      setSlugError('');
      return;
    }

    // Validate slug format
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(slug)) {
      setSlugAvailability('unavailable');
      setSlugError('Slug can only contain lowercase letters, numbers, and hyphens. It cannot start or end with a hyphen.');
      return;
    }

    if (slug.length < 5) {
      setSlugAvailability('unavailable');
      setSlugError('Slug must be at least 5 characters long.');
      return;
    }

    if (slug.length > 32) {
      setSlugAvailability('unavailable');
      setSlugError('Slug must be less than 32 characters long.');
      return;
    }

    setSlugAvailability('checking');
    setSlugError('');

    try {
      const exists = await checkSlugExists(slug, currentPageId || undefined);
      if (exists) {
        setSlugAvailability('unavailable');
        setSlugError('This slug is already taken. Please choose a different one.');
      } else {
        setSlugAvailability('available');
        setSlugError('');
      }
    } catch (error: any) {
      console.error('Error checking slug availability:', error);
      setSlugAvailability('idle');
      setSlugError('Error checking slug availability. Please try again.');
    }
  }, [currentPageId]);

  // Watch qrLinkData.slug changes and check availability
  useEffect(() => {
    if (!qrLinkData.slug || qrLinkData.slug.trim() === '') {
      setSlugAvailability('idle');
      setSlugError('');
      return;
    }

    // Clear previous timer
    if (slugDebounceTimerRef.current) {
      clearTimeout(slugDebounceTimerRef.current);
    }
    
    // Debounce slug availability check
    const timer = setTimeout(() => {
      checkSlugAvailability(qrLinkData.slug);
    }, 500);
    slugDebounceTimerRef.current = timer;
    
    // Cleanup timer on unmount or when slug changes
    return () => {
      if (slugDebounceTimerRef.current) {
        clearTimeout(slugDebounceTimerRef.current);
        slugDebounceTimerRef.current = null;
      }
    };
  }, [qrLinkData.slug, currentPageId, checkSlugAvailability]);

  // Check page name availability (for landing pages)
  const checkPageNameAvailability = useCallback(async (pageName: string) => {
    // Only check for landing pages
    if (selectedPageType !== 'landing') {
      setPageNameAvailability('idle');
      setPageNameError('');
      return;
    }

    if (!pageName || pageName.trim() === '') {
      setPageNameAvailability('idle');
      setPageNameError('');
      return;
    }

    setPageNameAvailability('checking');
    setPageNameError('');

    try {
      const exists = await checkLandingPageNameExists(pageName, currentPageId || undefined);
      if (exists) {
        setPageNameAvailability('unavailable');
        setPageNameError('This page name is already taken. Please choose a different one.');
      } else {
        setPageNameAvailability('available');
        setPageNameError('');
      }
    } catch (error: any) {
      console.error('Error checking page name availability:', error);
      setPageNameAvailability('idle');
      setPageNameError('Error checking page name availability. Please try again.');
    }
  }, [selectedPageType, currentPageId]);

  // Watch page name changes and check availability for landing pages
  useEffect(() => {
    if (selectedPageType !== 'landing') {
      setPageNameAvailability('idle');
      setPageNameError('');
      return;
    }

    if (!pageSettings.pageName || pageSettings.pageName.trim() === '') {
      setPageNameAvailability('idle');
      setPageNameError('');
      return;
    }

    // Clear previous timer
    if (pageNameDebounceTimerRef.current) {
      clearTimeout(pageNameDebounceTimerRef.current);
    }
    
    // Debounce page name availability check
    const timer = setTimeout(() => {
      checkPageNameAvailability(pageSettings.pageName);
    }, 500);
    pageNameDebounceTimerRef.current = timer;
    
    // Cleanup timer on unmount or when page name changes
    return () => {
      if (pageNameDebounceTimerRef.current) {
        clearTimeout(pageNameDebounceTimerRef.current);
        pageNameDebounceTimerRef.current = null;
      }
    };
  }, [pageSettings.pageName, selectedPageType, currentPageId, checkPageNameAvailability]);

  const handlePageSettingChange = (key: keyof PageSettings, value: any) => {
    setPageSettings(prev => ({
      ...prev,
      [key]: value
    }));
    // No auto-generation of slug from page name - slug is user-provided
  };

  const applyTemplate = (templateId: string) => {
    let templateContent: PageContentBlock[] = [];
    
    if (selectedPageType === 'landing') {
      switch (templateId) {
        case 'standard':
        case 'promotional':
        default:
          templateContent = standardLandingTemplate;
          break;
      }
    } else if (selectedPageType === 'product') {
      switch (templateId) {
        case 'standard-product':
        case 'minimalist':
        default:
          templateContent = standardProductTemplate;
          break;
      }
    }
    
    setPageContent(templateContent);
    setPageSettings(prev => ({
      ...prev,
      pageName: `New ${selectedPageType === 'landing' ? 'Landing' : 'Product'} Page`
    }));
  };

  // QR and Link handlers
  const handleSaveAndLockSlug = () => {
    if (!qrLinkData.slug || qrLinkData.slug.trim() === '') {
      alert('Please set a slug before locking it.');
      return;
    }
    updateQrLinkDataWithHistory('isSlugLocked', true);
    alert('Slug has been locked successfully!');
  };

  const handleUnlockSlug = () => {
    updateQrLinkDataWithHistory('isSlugLocked', false);
    alert('Slug has been unlocked. You can edit it now.');
  };

  const handleCreateNewQR = () => {
    // QR generation is now handled by QRGenerator component
    // This function is kept for backward compatibility but QRGenerator handles the actual generation
    // The QRGenerator will call onGenerate with the QR data
  };
  const renderComponent = (component: PageContentBlock) => {
    // Safety check to ensure component exists
    if (!component || !component.type) {
      return null;
    }
    
    const isSelected = selectedComponentId === component.id;

    const handleClick = () => {
      selectComponent(component.id);
    };

    const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      deleteComponent(component.id);
    };

    // Apply component style to wrapper
    const wrapperStyle: React.CSSProperties = {
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
      ...(component.style?.borderRadius && { borderRadius: component.style.borderRadius }),
      ...(component.style?.width && { width: component.style.width }),
      ...(component.style?.height && { height: component.style.height }),
    };

    const wrapperProps = {
      key: component.id,
      isSelected,
      onClick: handleClick,
      onDelete: handleDelete,
      style: wrapperStyle,
      className: 'mb-4',
      draggable: true,
      showDragHandle: true,
      dragActive: dragOverComponentId === component.id,
      onDragStart: (event: React.DragEvent<HTMLDivElement>) => handleComponentDragStart(event, component.id),
      onDragOver: (event: React.DragEvent<HTMLDivElement>) => handleComponentDragOver(event, component.id),
      onDragLeave: () => handleComponentDragLeave(component.id),
      onDrop: (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        handleComponentDrop(component.id);
      },
      onDragEnd: handleComponentDragEnd,
    };

    switch (component.type) {
      case 'Header':
        return (
          <ComponentWrapper {...wrapperProps}>
            <HeaderComponent
              props={component.props as HeaderProps}
              style={{}}
              isSelected={false}
              onClick={undefined}
            />
          </ComponentWrapper>
        );
      
      case 'Images+Link':
        return (
          <ComponentWrapper {...wrapperProps}>
            <ImagesLinkComponent
              props={component.props as ImagesLinkProps}
              style={{}}
              isSelected={false}
              onClick={undefined}
            />
          </ComponentWrapper>
        );

      case 'Buttons':
        return (
          <ComponentWrapper {...wrapperProps}>
            <ButtonsComponent
              props={component.props as ButtonsProps}
              style={{}}
              isSelected={false}
              onClick={undefined}
              disableLinkNavigation
            />
          </ComponentWrapper>
        );

      case 'Heading+Text':
        return (
          <ComponentWrapper {...wrapperProps}>
            <HeadingTextComponent
              props={component.props as HeadingTextProps}
              style={{}}
              isSelected={false}
              onClick={undefined}
            />
          </ComponentWrapper>
        );

      case 'Video':
        return (
          <ComponentWrapper {...wrapperProps}>
            <VideoComponent
              props={component.props as VideoProps}
              style={{}}
              isSelected={false}
              onClick={undefined}
            />
          </ComponentWrapper>
        );

      case 'Image+Text':
        return (
          <ComponentWrapper {...wrapperProps}>
            <ImageTextComponent
              props={component.props as ImageTextProps}
              style={{}}
              isSelected={false}
              onClick={undefined}
            />
          </ComponentWrapper>
        );

      case 'Social Links':
        return (
          <ComponentWrapper {...wrapperProps}>
            <SocialLinksComponent
              props={component.props as SocialLinksProps}
              style={{}}
              isSelected={false}
              onClick={undefined}
            />
          </ComponentWrapper>
        );

      case 'Contact Us':
        return (
          <ComponentWrapper {...wrapperProps}>
            <ContactUsComponent
              props={component.props as ContactUsProps}
              style={{}}
              isSelected={false}
              onClick={undefined}
            />
          </ComponentWrapper>
        );

      case 'Ingredients':
        return (
          <ComponentWrapper {...wrapperProps}>
            <IngredientsComponent
              props={component.props as IngredientsProps}
              style={{}}
              isSelected={false}
              onClick={undefined}
            />
          </ComponentWrapper>
        );

      case 'Address':
        return (
          <ComponentWrapper {...wrapperProps}>
            <AddressComponent
              props={component.props as AddressProps}
              style={{}}
              isSelected={false}
              onClick={undefined}
            />
          </ComponentWrapper>
        );

      case 'Map':
        return (
          <ComponentWrapper {...wrapperProps}>
            <MapComponent
              props={component.props as MapProps}
              style={{}}
              isSelected={false}
              onClick={undefined}
            />
          </ComponentWrapper>
        );

      case 'Products':
        return (
          <ComponentWrapper {...wrapperProps}>
            <ProductsComponent
              props={component.props as ProductsProps}
              style={{}}
              isSelected={false}
              onClick={undefined}
            />
          </ComponentWrapper>
        );

      case 'Gallery':
        return (
          <ComponentWrapper {...wrapperProps}>
            <GalleryComponent
              props={component.props as GalleryProps}
              style={{}}
              isSelected={false}
              onClick={undefined}
            />
          </ComponentWrapper>
        );

      case 'Recipes':
        return (
          <ComponentWrapper {...wrapperProps}>
            <RecipesComponent
              props={component.props as RecipesProps}
              style={{}}
              isSelected={false}
              onClick={undefined}
            />
          </ComponentWrapper>
        );

      case 'Nutrition Table':
        return (
          <ComponentWrapper {...wrapperProps}>
            <NutritionTableComponent
              props={component.props as NutritionTableProps}
              style={{}}
              isSelected={false}
              onClick={undefined}
            />
          </ComponentWrapper>
        );
      
      default:
        return (
          <ComponentWrapper {...wrapperProps}>
            <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
              <div className="text-lg font-medium mb-2">{component.type}</div>
              <div className="text-sm">Component not yet implemented</div>
            </div>
          </ComponentWrapper>
        );
    }
  };

  const renderPageContentList = () => (
    <div className="p-6 space-y-4">
      {pageContent.map(renderComponent)}
      {draggedComponentId && (
        <div
          className={`border-2 border-dashed rounded-xl py-4 px-6 text-center text-sm transition-colors ${
            dragOverComponentId === null ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-400'
          }`}
          onDragOver={(event) => handleComponentDragOver(event, null)}
          onDragLeave={() => handleComponentDragLeave(null)}
          onDrop={(event) => {
            event.preventDefault();
            handleComponentDrop(null);
          }}
        >
          Drop here to move component to the end
              </div>
            )}
          </div>
        );

  const filteredCategories = componentCategories.map(category => ({
    ...category,
    components: category.components.filter(component =>
      component.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.components.length > 0);

  const getDeviceWidth = () => {
    switch (deviceMode) {
      case 'tablet': return 'w-[768px]';
      case 'mobile': return 'w-[375px]';
      default: return 'w-full';
    }
  };

  const selectedComponent = pageContent.find(c => c.id === selectedComponentId);

  if (selectedPageType === 'none') {
    return (
      <div className="h-full bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Studio</h1>
            <p className="text-gray-600">Create and manage your brand pages with our drag-and-drop builder</p>
          </div>

          {/* Saved Landing Pages */}
            <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Saved Landing Pages</h2>
            {isLoadingLandingPages ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading pages...</span>
              </div>
            ) : savedLandingPages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedLandingPages.map((page) => (
                  <div key={page.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{page.page_name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        page.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {page.status === 'published' ? '✓ Published' : '📝 Draft'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">Landing Page</p>
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                      <span>{page.page_views || 0} views</span>
                      <span>{new Date(page.updated_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditLandingPage(page.id)}
                        className="flex-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-2 rounded font-medium transition-colors"
                      >
                        Edit
                      </button>
                      {page.status === 'published' && page.published_url && (
                        <button 
                          onClick={() => window.open(page.published_url || '', '_blank')}
                          className="flex-1 text-xs bg-green-100 hover:bg-green-200 text-green-800 px-3 py-2 rounded font-medium transition-colors"
                        >
                          View
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteLandingPage(page.id, page.page_name)}
                        className="text-xs bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <Layers className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-2">No saved landing pages yet</p>
                <p className="text-sm text-gray-500">Create your first landing page to get started</p>
            </div>
          )}
          </div>

          {/* Page Type Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Page</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                className="bg-white rounded-lg border-2 border-gray-200 p-6 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => setSelectedPageType('landing')}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Monitor className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Landing Page</h3>
                    <p className="text-sm text-gray-500">Brand pages, campaigns, and general content</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">Perfect for brand storytelling, marketing campaigns, and general information pages.</p>
              </div>

              <div 
                className="bg-white rounded-lg border-2 border-gray-200 p-6 hover:border-green-500 hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => setSelectedPageType('product')}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <Layers className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Product Page</h3>
                    <p className="text-sm text-gray-500">Detailed product information and features</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">Showcase your products with detailed information, images, and interactive elements.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!showBuilder) {
    const templates = selectedPageType === 'landing' ? landingTemplates : productTemplates;
    
    return (
      <div className="h-full bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <button 
              onClick={() => setSelectedPageType('none')}
              className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
            >
              ← Back to Studio
            </button>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Choose a {selectedPageType === 'landing' ? 'Landing' : 'Product'} Page Template
            </h1>
            <p className="text-gray-600">Select a template to get started, or build from scratch</p>
          </div>

          {/* Product Selection */}
          {selectedPageType === 'product' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Product</label>
              <select
                value={selectedProductId}
                onChange={(e) => handleProductSelection(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose a product...</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {product.status}
                  </option>
                ))}
              </select>
              {selectedProductId && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Package className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900">Product Selected</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Page content will be auto-populated with product details
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {(selectedPageType !== 'product' || selectedProductId) && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div 
                  key={template.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => {
                    applyTemplate(template.id);
                    setShowBuilder(true);
                  }}
                >
                  <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <Monitor className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Template Preview</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                        {template.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Apply design customization to canvas with direct styles
  const applyDesignCustomization = (customization: DesignCustomization): React.CSSProperties => {
    const styles: React.CSSProperties = {
      backgroundColor: customization.backgroundColor || '#ffffff',
      fontFamily: customization.fontFamilyBody || 'system-ui, sans-serif',
      color: '#000000',
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

  const canvasStyle = applyDesignCustomization(designCustomization);
  
  // Also set CSS variables for component styling
  const canvasCSSVars = {
    '--bg-color': designCustomization.backgroundColor,
    '--bg-image': designCustomization.backgroundImage ? `url(${designCustomization.backgroundImage})` : 'none',
    '--bg-mode': designCustomization.backgroundMode,
    '--bg-overlay': `${designCustomization.backgroundOverlay}%`,
    '--font-heading': designCustomization.fontFamilyHeading,
    '--font-body': designCustomization.fontFamilyBody,
    '--font-label': designCustomization.fontFamilyLabel,
    '--font-size-heading': designCustomization.fontSizeHeading,
    '--font-size-body': designCustomization.fontSizeBody,
    '--font-size-label': designCustomization.fontSizeLabel,
    '--card-surface': designCustomization.cardSurfaceColor,
    '--link-default': designCustomization.linkColorDefault,
    '--link-hover': designCustomization.linkColorHover,
    '--link-active': designCustomization.linkColorActive,
    '--cta-default': designCustomization.ctaColorDefault,
    '--cta-hover': designCustomization.ctaColorHover,
    '--cta-active': designCustomization.ctaColorActive,
  } as React.CSSProperties;

  return (
    <div 
      className="h-screen flex flex-col bg-gray-50" 
      style={{ 
        height: '100vh', 
        maxHeight: '100vh',
        overflow: 'hidden'
      }}
    >
      {/* Studio Stepper */}
      {showBuilder && (
        <div className="bg-white border-b border-gray-200 py-4 flex-shrink-0">
          <StudioStepper
            steps={getStepValidation()}
            currentStep={currentStep}
            onStepChange={handleStepChange}
          />
        </div>
      )}

      <div 
        className="flex-1 flex bg-gray-50 min-h-0" 
        style={{ 
          height: showBuilder ? 'calc(100vh - 73px)' : '100vh',
          maxHeight: showBuilder ? 'calc(100vh - 73px)' : '100vh',
          overflow: 'hidden',
          position: 'relative',
          overscrollBehavior: 'none'
        }}
      >
        {/* Left Sidebar - Component Library (Only show in Step 0 - Content) */}
        {showBuilder && currentStep === 0 && (
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col min-h-0" style={{ height: '100%', overflow: 'hidden' }}>
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Components</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search components..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto min-h-0 p-4" style={{ overscrollBehavior: 'contain' }}>
          {filteredCategories.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <Search className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>No components found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCategories.map((category) => (
                <div key={category.name}>
                  <div className="flex items-center mb-2">
                    <category.icon className="w-4 h-4 text-gray-500 mr-2" />
                    <h3 className="font-medium text-gray-700">{category.name}</h3>
                    <span className="ml-auto text-xs text-gray-500">({category.components.length})</span>
                  </div>
                  <div className="space-y-1">
                    {category.components.map((component) => (
                      <button
                        key={component}
                        onClick={() => addComponent(component)}
                        className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg flex items-center justify-between group"
                      >
                        {component}
                        <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      )}

        {/* Middle Panel - Live Preview (Fixed Position - Doesn't Scroll with Settings) */}
        <div 
          className="flex-1 flex flex-col min-h-0" 
          style={{ 
            height: '100%', 
            overflow: 'hidden',
            position: 'relative',
            overscrollBehavior: 'none',
            isolation: 'isolate',
            display: 'flex',
            flexDirection: 'column',
            willChange: 'scroll-position'
          }}
        >
        {showBuilder && (
          <div className="bg-white border-b border-gray-200 p-4 flex-shrink-0 z-10" style={{ flexShrink: 0 }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowBuilder(false)}
                className="text-blue-600 hover:text-blue-800"
                disabled={isLoadingPage}
              >
                ← Back
              </button>
              <h1 className="text-lg font-semibold text-gray-900">
                {isLoadingPage ? 'Loading...' : 'Page Builder'}
              </h1>
              {isLoadingPage && (
                <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              )}

              {/* Undo/Redo Buttons */}
              <div className="flex items-center space-x-1 ml-4">
                <button
                  onClick={undo}
                  disabled={!canUndo}
                  className={`p-2 rounded ${
                    canUndo
                      ? 'hover:bg-gray-100 text-gray-700'
                      : 'text-gray-300 cursor-not-allowed'
                  }`}
                  title={`Undo (${navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl'}+Z)`}
                >
                  <Undo className="w-4 h-4" />
                </button>
                <button
                  onClick={redo}
                  disabled={!canRedo}
                  className={`p-2 rounded ${
                    canRedo
                      ? 'hover:bg-gray-100 text-gray-700'
                      : 'text-gray-300 cursor-not-allowed'
                  }`}
                  title={`Redo (${navigator.platform.includes('Mac') ? 'Shift+Cmd+Z' : 'Ctrl+Y'})`}
                >
                  <Redo className="w-4 h-4" />
                </button>
              </div>
              
              {/* Publishing Status */}
              {selectedProductForStudio && (
                <div className="flex items-center space-x-2">
                  {publishStatus === 'draft' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      <Clock className="w-3 h-3 mr-1" />
                      Draft
                    </span>
                  )}
                  {publishStatus === 'publishing' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <div className="animate-spin w-3 h-3 mr-1 border border-yellow-600 border-t-transparent rounded-full"></div>
                      Publishing...
                    </span>
                  )}
                  {publishStatus === 'published' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Published
                    </span>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setDeviceMode('desktop')}
                  className={`p-2 rounded ${deviceMode === 'desktop' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeviceMode('tablet')}
                  className={`p-2 rounded ${deviceMode === 'tablet' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeviceMode('mobile')}
                  className={`p-2 rounded ${deviceMode === 'mobile' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex space-x-2">
                {/* Save Draft Button */}
                <button 
                  onClick={handleSaveDraft}
                  disabled={!canSave() || saveStatus === 'saving' || isLoadingPage}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed relative"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Draft'}
                  {saveStatus === 'saved' && (
                    <CheckCircle className="w-4 h-4 ml-2 text-green-600" />
                  )}
                  {saveStatus === 'error' && (
                    <span className="ml-2 text-red-600 text-xs">Error</span>
                  )}
                </button>
                
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </button>
                
                {/* Publish Button - Allow republishing */}
                <button 
                  onClick={handlePublish}
                  disabled={!canPublish() || publishStatus === 'publishing' || isLoadingPage}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {publishStatus === 'publishing' ? 'Publishing...' : publishStatus === 'published' ? 'Republish' : 'Publish'}
                </button>
              </div>
            </div>
          </div>
          
          {/* Published Page Info - Collapsible */}
          {publishStatus === 'published' && publishedPageUrl && (
            <div className="mt-4">
              {!showPublishedInfo ? (
                <button
                  onClick={() => setShowPublishedInfo(true)}
                  className="w-full px-4 py-2 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-between text-sm text-green-700"
                >
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Page Published Successfully - Click to view details</span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <ExternalLink className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-green-900">Page Published Successfully!</h4>
                    <p className="text-sm text-green-700">
                      Published on {lastPublished} • {pageViews} views
                    </p>
                    <p className="text-xs text-green-600 font-mono mt-1">{publishedPageUrl}</p>
                  </div>
                </div>
                      <button
                        onClick={() => setShowPublishedInfo(false)}
                        className="p-1 hover:bg-green-200 rounded transition-colors"
                        title="Hide published info"
                      >
                        <X className="w-4 h-4 text-green-700" />
                      </button>
                    </div>
                    <div className="flex items-center space-x-2 mb-4">
                  <button
                    onClick={() => copyToClipboard(publishedPageUrl)}
                    className="inline-flex items-center px-3 py-2 border border-green-300 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy URL
                  </button>
                  <button
                    onClick={() => window.open(publishedPageUrl, '_blank')}
                    className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Live Page
                  </button>
                </div>
          {/* Sharing Options */}
                    <div className="pt-4 border-t border-green-200">
                      <h4 className="text-sm font-medium text-green-900 mb-3">Share Your Published Page</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <button className="inline-flex items-center justify-center px-3 py-2 border border-green-300 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </button>
                        <button className="inline-flex items-center justify-center px-3 py-2 border border-green-300 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm">
                  <Phone className="w-4 h-4 mr-2" />
                  SMS
                </button>
                        <button className="inline-flex items-center justify-center px-3 py-2 border border-green-300 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Social Media
                </button>
                        <button className="inline-flex items-center justify-center px-3 py-2 border border-green-300 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </button>
                      </div>
                    </div>
              </div>
                </div>
              )}
            </div>
          )}
        </div>
        )}

        {/* Preview Canvas - Fixed Height, Independent Scroll */}
        <div 
          className="flex-1 bg-gray-100 min-h-0"
          style={{ 
            flex: '1 1 auto',
            overflow: 'hidden',
            position: 'relative',
            overscrollBehavior: 'none',
            isolation: 'isolate',
            display: 'flex',
            flexDirection: 'column',
            touchAction: 'pan-y'
          }}
        >
          <div 
            ref={previewScrollRef}
            className="h-full w-full overflow-y-auto overflow-x-hidden"
            style={{ 
              scrollBehavior: 'smooth',
              scrollbarWidth: 'thin',
              overscrollBehavior: 'none',
              overscrollBehaviorY: 'none',
              overscrollBehaviorX: 'none',
              WebkitOverflowScrolling: 'touch',
              touchAction: 'pan-y',
              isolation: 'isolate',
              pointerEvents: 'auto'
            }}
            onWheel={(e) => {
              // Prevent ANY scroll propagation to parent elements
              e.stopPropagation();
              
              // Only process wheel events that are directly on the preview canvas
              // Check if event target is within preview canvas (not settings panel)
              const target = e.target as HTMLElement;
              const settingsPanel = settingsPanelRef.current;
              const previewCanvas = e.currentTarget.parentElement;
              
              // If wheel event originated from outside preview canvas area, ignore it
              if (settingsPanel && (settingsPanel.contains(target) || target === settingsPanel)) {
                e.preventDefault();
                e.stopPropagation();
                return;
              }
              
              // Only allow scrolling if event is directly on preview canvas content
              if (previewCanvas && !previewCanvas.contains(target)) {
                e.preventDefault();
                e.stopPropagation();
                return;
              }
              
              // Prevent scroll chaining at boundaries
              const scrollTarget = e.currentTarget;
              const { scrollTop, scrollHeight, clientHeight } = scrollTarget;
              const isAtTop = scrollTop === 0;
              const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
              
              if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
                e.preventDefault();
              }
            }}
            onTouchMove={(e) => {
              // Prevent touch scroll propagation
              e.stopPropagation();
            }}
          >
            <div className="p-8">
          {/* Check if we need overlay wrapper */}
          {designCustomization.backgroundImage && designCustomization.backgroundOverlay > 0 ? (
            <div
              className={`mx-auto min-h-full shadow-lg ${getDeviceWidth()}`}
              style={{
                position: 'relative',
                backgroundColor: designCustomization.backgroundColor || '#ffffff',
                backgroundImage: designCustomization.backgroundImage ? `url(${designCustomization.backgroundImage})` : 'none',
                backgroundSize: designCustomization.backgroundMode || 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                ...canvasCSSVars,
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
                  backgroundColor: `rgba(0, 0, 0, ${designCustomization.backgroundOverlay / 100})`,
                  zIndex: 0,
                }}
              />
              {/* Content */}
              <div style={{ position: 'relative', zIndex: 1, ...canvasCSSVars }}>
            {/* Product Information Display */}
            {selectedPageType === 'product' && selectedProductForStudio && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <Package className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-blue-900">Editing: {selectedProductForStudio.name}</h4>
                    <p className="text-sm text-blue-700 mt-1">{selectedProductForStudio.shortDescription}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-blue-600">
                      <span>MRP: ₹{selectedProductForStudio.mrp}</span>
                      <span>Status: {selectedProductForStudio.status}</span>
                      <span>Views: {selectedProductForStudio.pageViews}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {pageContent.length === 0 ? (
              <div className="h-96 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Layers className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium mb-2">Start Building Your Page</p>
                  <p className="text-sm">Add components from the left sidebar to get started</p>
                </div>
              </div>
            ) : (
                  renderPageContentList()
                )}
              </div>
            </div>
          ) : (
          <div
            className={`mx-auto bg-white min-h-full shadow-lg ${getDeviceWidth()}`}
              style={{ ...canvasStyle, ...canvasCSSVars }}
          >
            {/* Product Information Display */}
            {selectedPageType === 'product' && selectedProductForStudio && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <Package className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-blue-900">Editing: {selectedProductForStudio.name}</h4>
                    <p className="text-sm text-blue-700 mt-1">{selectedProductForStudio.shortDescription}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-blue-600">
                      <span>MRP: ₹{selectedProductForStudio.mrp}</span>
                      <span>Status: {selectedProductForStudio.status}</span>
                      <span>Views: {selectedProductForStudio.pageViews}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {pageContent.length === 0 ? (
              <div className="h-96 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Layers className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium mb-2">Start Building Your Page</p>
                  <p className="text-sm">Add components from the left sidebar to get started</p>
          </div>
              </div>
            ) : (
              renderPageContentList()
            )}
          </div>
          )}
          
          {/* QR Code Integration Notice */}
          {selectedProductForStudio && publishStatus === 'published' && (
                <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg max-w-4xl mx-auto">
              <div className="flex items-start space-x-3">
                <Zap className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-purple-900">QR Code Integration</h4>
                  <p className="text-sm text-purple-700 mt-1">
                    Your product's QR code has been automatically updated to link to this published page. 
                    Customers scanning the QR code will now see your custom product page instead of the default view.
                  </p>
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      QR Code Updated
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Live & Accessible
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        </div>

          {/* Apply global design customization CSS variables */}
          <style>{`
            :root {
              --font-family-heading: ${designCustomization.fontFamilyHeading || 'system-ui, sans-serif'};
              --font-family-body: ${designCustomization.fontFamilyBody || 'system-ui, sans-serif'};
              --font-family-label: ${designCustomization.fontFamilyLabel || 'system-ui, sans-serif'};
              --font-size-heading: ${designCustomization.fontSizeHeading || '2rem'};
              --font-size-body: ${designCustomization.fontSizeBody || '1rem'};
              --font-size-label: ${designCustomization.fontSizeLabel || '0.875rem'};
              --link-color-default: ${designCustomization.linkColorDefault || '#3b82f6'};
              --link-color-hover: ${designCustomization.linkColorHover || '#2563eb'};
              --link-color-active: ${designCustomization.linkColorActive || '#1d4ed8'};
              --cta-color-default: ${designCustomization.ctaColorDefault || '#10b981'};
              --cta-color-hover: ${designCustomization.ctaColorHover || '#059669'};
              --cta-color-active: ${designCustomization.ctaColorActive || '#047857'};
            }
            
            h1, h2, h3, h4, h5, h6 {
              font-family: var(--font-family-heading);
              font-size: var(--font-size-heading);
            }
            
            body, p, span, div {
              font-family: var(--font-family-body);
              font-size: var(--font-size-body);
            }
            
            label, small {
              font-family: var(--font-family-label);
              font-size: var(--font-size-label);
            }
            
            a {
              color: var(--link-color-default);
            }
            
            a:hover {
              color: var(--link-color-hover);
            }
            
            a:active {
              color: var(--link-color-active);
            }
            
            button.cta, .cta-button {
              background-color: var(--cta-color-default);
            }
            
            button.cta:hover, .cta-button:hover {
              background-color: var(--cta-color-hover);
            }
            
            button.cta:active, .cta-button:active {
              background-color: var(--cta-color-active);
            }
          `}</style>
        </div>
      </div>

      {/* Right Sidebar - Context Panel */}
        {showBuilder && currentStep <= 1 && (
          <div 
            className="w-80 bg-white border-l border-gray-200 flex flex-col min-h-0" 
            style={{ 
              height: '100%', 
              overflow: 'hidden',
              overscrollBehavior: 'none'
            }}
          >
            <div className="border-b border-gray-200 flex-shrink-0 z-10 bg-white" style={{ position: 'sticky', top: 0 }}>
                <div className="flex">
                  <button
                    onClick={() => setActiveRightTab('settings')}
                    className={`flex-1 px-4 py-3 text-sm font-medium ${
                      activeRightTab === 'settings'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Settings
                  </button>
                  <button
                    onClick={() => setActiveRightTab('components')}
                    className={`flex-1 px-4 py-3 text-sm font-medium ${
                      activeRightTab === 'components'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Component
                  </button>
                  <button
                    onClick={() => setActiveRightTab('integrations')}
                    className={`flex-1 px-4 py-3 text-sm font-medium ${
                      activeRightTab === 'integrations'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Integrations
                  </button>
                </div>
              </div>

              <div 
                ref={settingsPanelRef}
                className="flex-1 min-h-0"
                style={{ 
                  overflowY: 'auto', 
                  overflowX: 'hidden',
                  overscrollBehavior: 'none',
                  overscrollBehaviorY: 'none',
                  overscrollBehaviorX: 'none',
                  touchAction: 'pan-y',
                  isolation: 'isolate'
                }}
                onWheel={(e) => {
                  // Prevent scroll propagation to preview canvas
                  e.stopPropagation();
                  // Prevent scroll chaining
                  const target = e.currentTarget;
                  const { scrollTop, scrollHeight, clientHeight } = target;
                  const isAtTop = scrollTop === 0;
                  const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
                  
                  // Prevent scroll chaining at boundaries
                  if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
                    e.preventDefault();
                  }
                }}
                onTouchMove={(e) => {
                  // Prevent touch scroll propagation
                  e.stopPropagation();
                }}
              >
                {activeRightTab === 'settings' && (
                  <div className="p-4">
                    {/* Original Settings Fields */}
            <div className="space-y-6">
              {/* Basic Page Settings */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Basic Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Page Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={pageSettings.pageName}
                      onChange={(e) => handlePageSettingChange('pageName', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        selectedPageType === 'landing' && pageNameError
                          ? 'border-red-500 bg-red-50'
                          : selectedPageType === 'landing' && pageNameAvailability === 'available'
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-300'
                      }`}
                      placeholder="Enter page name"
                      required
                    />
                    {selectedPageType === 'landing' && pageNameAvailability === 'checking' && (
                      <p className="mt-1 text-sm text-gray-500 flex items-center gap-1">
                        <span className="animate-spin">⏳</span> Checking availability...
                      </p>
                    )}
                    {selectedPageType === 'landing' && pageNameAvailability === 'available' && !pageNameError && (
                      <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                        <Check className="w-4 h-4" /> Page name is available
                      </p>
                    )}
                    {selectedPageType === 'landing' && pageNameError && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> {pageNameError}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Linked Product</label>
                    <select 
                      value={pageSettings.linkedProduct}
                      onChange={(e) => handlePageSettingChange('linkedProduct', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option>Select a product...</option>
                      <option value="organic-honey">Organic Honey 500g</option>
                      <option value="premium-tea">Premium Tea 250g</option>
                      <option value="handmade-soap">Handmade Soap Pack</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Set as Default Page</label>
                    <input 
                      type="checkbox" 
                      checked={pageSettings.isDefaultPage}
                      onChange={(e) => handlePageSettingChange('isDefaultPage', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Advanced Settings */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Advanced Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Enable Reward Logic</label>
                    <input 
                      type="checkbox" 
                      checked={pageSettings.enableRewardLogic}
                      onChange={(e) => handlePageSettingChange('enableRewardLogic', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Enable Smart Triggers</label>
                    <input 
                      type="checkbox" 
                      checked={pageSettings.enableSmartTriggers}
                      onChange={(e) => handlePageSettingChange('enableSmartTriggers', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Password Protection</label>
                    <input 
                      type="checkbox" 
                      checked={pageSettings.passwordProtection}
                      onChange={(e) => handlePageSettingChange('passwordProtection', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  {pageSettings.passwordProtection && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input
                        type="password"
                        value={pageSettings.password}
                        onChange={(e) => handlePageSettingChange('password', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter password"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* SEO Settings */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">SEO Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
                    <input
                      type="text"
                      value={pageSettings.seoTitle}
                      onChange={(e) => handlePageSettingChange('seoTitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Max 60 characters"
                      maxLength={60}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {pageSettings.seoTitle.length}/60 characters
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                    <textarea
                      value={pageSettings.metaDescription}
                      onChange={(e) => handlePageSettingChange('metaDescription', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="Max 160 characters"
                      maxLength={160}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {pageSettings.metaDescription.length}/160 characters
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meta Keywords</label>
                    <input
                      type="text"
                      value={pageSettings.metaKeywords}
                      onChange={(e) => handlePageSettingChange('metaKeywords', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>
                </div>
              </div>

              {/* Google Search Preview */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Search Preview</h3>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="text-blue-600 text-sm hover:underline cursor-pointer">
                    {pageSettings.seoTitle || pageSettings.pageName || 'Page Title'}
                  </div>
                  <div className="text-green-700 text-xs mt-1">
                    stegofy.com/{qrLinkData.slug || 'page-slug'}
                  </div>
                  <div className="text-gray-600 text-sm mt-1">
                    {pageSettings.metaDescription || 'Meta description will appear here...'}
                  </div>
                </div>
              </div>
            </div>

                    {/* Design Customization Panel (only show in Step 1) */}
                    {currentStep === 1 && (
                      <div className="mt-8 pt-8 border-t border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Design Customization</h2>
                        <DesignSettingsPanel
                          customization={designCustomization}
                          onCustomizationChange={updateDesignCustomizationWithHistory}
                          contrastIssues={validateContrast()}
                        />
                      </div>
                    )}
                  </div>
                )}

                {activeRightTab === 'components' && (
                  <div className="p-4">
              {!selectedComponent ? (
                <div className="text-center text-gray-500 mt-8">
                  <Layers className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p>No Component Selected</p>
                  <p className="text-sm mt-1">Click on a component in the preview to edit its properties</p>
                </div>
              ) : (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900">{selectedComponent.type} Settings</h3>
                    <button
                      onClick={() => deleteComponent(selectedComponent.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>

                  {/* Component-specific properties */}
                  {selectedComponent.type === 'Header' && (
                          <HeaderSettings
                            props={selectedComponent.props as HeaderProps}
                            onPropsChange={(newProps) => updateComponentProps(selectedComponent.id, newProps)}
                          />
                        )}

                        {selectedComponent.type === 'Buttons' && (
                          <ButtonsSettings
                            props={selectedComponent.props as ButtonsProps}
                            onPropsChange={(newProps) => updateComponentProps(selectedComponent.id, newProps)}
                          />
                        )}

                        {selectedComponent.type === 'Heading+Text' && (
                          <HeadingTextSettings
                            props={selectedComponent.props as HeadingTextProps}
                            onPropsChange={(newProps) => updateComponentProps(selectedComponent.id, newProps)}
                          />
                        )}

                        {selectedComponent.type === 'Video' && (
                          <VideoSettings
                            props={selectedComponent.props as VideoProps}
                            onPropsChange={(newProps) => updateComponentProps(selectedComponent.id, newProps)}
                          />
                        )}

                        {selectedComponent.type === 'Image+Text' && (
                          <ImageTextSettings
                            props={selectedComponent.props as ImageTextProps}
                            onPropsChange={(newProps) => updateComponentProps(selectedComponent.id, newProps)}
                          />
                        )}

                        {selectedComponent.type === 'Social Links' && (
                          <SocialLinksSettings
                            props={selectedComponent.props as SocialLinksProps}
                            onPropsChange={(newProps) => updateComponentProps(selectedComponent.id, newProps)}
                          />
                        )}

                        {selectedComponent.type === 'Contact Us' && (
                          <ContactUsSettings
                            props={selectedComponent.props as ContactUsProps}
                            onPropsChange={(newProps) => updateComponentProps(selectedComponent.id, newProps)}
                          />
                        )}

                        {selectedComponent.type === 'Ingredients' && (
                          <IngredientsSettings
                            props={selectedComponent.props as IngredientsProps}
                            onPropsChange={(newProps) => updateComponentProps(selectedComponent.id, newProps)}
                          />
                        )}

                        {selectedComponent.type === 'Address' && (
                          <AddressSettings
                            props={selectedComponent.props as AddressProps}
                            onPropsChange={(newProps) => updateComponentProps(selectedComponent.id, newProps)}
                          />
                        )}

                        {selectedComponent.type === 'Map' && (
                          <MapSettings
                            props={selectedComponent.props as MapProps}
                            onPropsChange={(newProps) => updateComponentProps(selectedComponent.id, newProps)}
                          />
                        )}

                        {selectedComponent.type === 'Products' && (
                          <ProductsSettings
                            props={selectedComponent.props as ProductsProps}
                            onPropsChange={(newProps) => updateComponentProps(selectedComponent.id, newProps)}
                          />
                        )}

                        {selectedComponent.type === 'Gallery' && (
                          <GallerySettings
                            props={selectedComponent.props as GalleryProps}
                            onPropsChange={(newProps) => updateComponentProps(selectedComponent.id, newProps)}
                          />
                        )}

                        {selectedComponent.type === 'Recipes' && (
                          <RecipesSettings
                            props={selectedComponent.props as RecipesProps}
                            onPropsChange={(newProps) => updateComponentProps(selectedComponent.id, newProps)}
                          />
                        )}

                        {selectedComponent.type === 'Nutrition Table' && (
                          <NutritionTableSettings
                            props={selectedComponent.props as NutritionTableProps}
                            onPropsChange={(newProps) => updateComponentProps(selectedComponent.id, newProps)}
                          />
                        )}

                        {selectedComponent.type === 'Images+Link' && (
                          <>
                            <ImagesLinkSettings
                              props={selectedComponent.props as ImagesLinkProps}
                              onPropsChange={(newProps) => updateComponentProps(selectedComponent.id, newProps)}
                            />
                            
                            {/* Advanced Styling Options - Only for Images+Link */}
                            <div className="border-t border-gray-200 pt-6">
                              <h4 className="text-sm font-medium text-gray-900 mb-4">Advanced Styling</h4>
                    <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                      <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Margin Top</label>
                        <input
                          type="text"
                                      value={selectedComponent.style?.margin?.top || ''}
                                      onChange={(e) => updateComponentStyle(selectedComponent.id, {
                                        margin: {
                                          ...selectedComponent.style?.margin,
                                          top: e.target.value
                                        }
                                      })}
                                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      placeholder="0px"
                        />
                      </div>
                      <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Margin Bottom</label>
                        <input
                          type="text"
                                      value={selectedComponent.style?.margin?.bottom || ''}
                                      onChange={(e) => updateComponentStyle(selectedComponent.id, {
                                        margin: {
                                          ...selectedComponent.style?.margin,
                                          bottom: e.target.value
                                        }
                                      })}
                                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      placeholder="0px"
                        />
                      </div>
                      <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Margin Left</label>
                        <input
                          type="text"
                                      value={selectedComponent.style?.margin?.left || ''}
                                      onChange={(e) => updateComponentStyle(selectedComponent.id, {
                                        margin: {
                                          ...selectedComponent.style?.margin,
                                          left: e.target.value
                                        }
                                      })}
                                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      placeholder="0px"
                        />
                      </div>
                      <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Margin Right</label>
                        <input
                          type="text"
                                      value={selectedComponent.style?.margin?.right || ''}
                                      onChange={(e) => updateComponentStyle(selectedComponent.id, {
                                        margin: {
                                          ...selectedComponent.style?.margin,
                                          right: e.target.value
                                        }
                                      })}
                                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      placeholder="0px"
                        />
                      </div>
                      </div>
                      <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Background Color</label>
                                  <div className="flex items-center space-x-2">
                        <input
                          type="color"
                                      value={selectedComponent.style?.backgroundColor || '#ffffff'}
                                      onChange={(e) => updateComponentStyle(selectedComponent.id, { backgroundColor: e.target.value })}
                                      className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                                    />
                        <input
                          type="text"
                                      value={selectedComponent.style?.backgroundColor || ''}
                                      onChange={(e) => updateComponentStyle(selectedComponent.id, { backgroundColor: e.target.value })}
                                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      placeholder="#ffffff"
                        />
                      </div>
                    </div>
                                <div className="grid grid-cols-2 gap-3">
                    <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Border Radius</label>
                        <input
                          type="text"
                                      value={selectedComponent.style?.borderRadius || ''}
                                      onChange={(e) => updateComponentStyle(selectedComponent.id, { borderRadius: e.target.value })}
                                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      placeholder="0px"
                        />
                      </div>
                      <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Width</label>
                        <input
                          type="text"
                                      value={selectedComponent.style?.width || ''}
                                      onChange={(e) => updateComponentStyle(selectedComponent.id, { width: e.target.value })}
                                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      placeholder="100%"
                        />
                      </div>
                      </div>
                    </div>
                  </div>
                          </>
                        )}
                </div>
              )}
            </div>
          )}

          {activeRightTab === 'integrations' && (
                  <div className="p-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Rewards & Campaigns</h3>
                <button className="w-full px-4 py-2 border border-gray-300 rounded-lg text-left hover:bg-gray-50 flex items-center justify-between">
                  Link Campaign
                  <Settings className="w-4 h-4 text-gray-400" />
                </button>
                        {selectedComponent && selectedComponent.type === 'Card' && (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                              <input
                                type="text"
                                value={selectedComponent.props.title || ''}
                                onChange={(e) => updateComponentProps(selectedComponent.id, { title: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                              <textarea
                                value={selectedComponent.props.description || ''}
                                onChange={(e) => updateComponentProps(selectedComponent.id, { description: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20 resize-none"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                              <input
                                type="url"
                                value={selectedComponent.props.imageUrl || ''}
                                onChange={(e) => updateComponentProps(selectedComponent.id, { imageUrl: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="https://example.com/image.jpg"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                              <input
                                type="text"
                                value={selectedComponent.props.buttonText || ''}
                                onChange={(e) => updateComponentProps(selectedComponent.id, { buttonText: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                              <input
                                type="url"
                                value={selectedComponent.props.buttonLink || ''}
                                onChange={(e) => updateComponentProps(selectedComponent.id, { buttonLink: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="https://example.com"
                              />
                            </div>
                          </div>
                        )}

                        {selectedComponent && selectedComponent.type === 'SocialLinks' && (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                              <input
                                type="url"
                                value={selectedComponent.props.facebookUrl || ''}
                                onChange={(e) => updateComponentProps(selectedComponent.id, { facebookUrl: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="https://facebook.com/yourpage"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Twitter URL</label>
                              <input
                                type="url"
                                value={selectedComponent.props.twitterUrl || ''}
                                onChange={(e) => updateComponentProps(selectedComponent.id, { twitterUrl: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="https://twitter.com/yourhandle"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                              <input
                                type="url"
                                value={selectedComponent.props.instagramUrl || ''}
                                onChange={(e) => updateComponentProps(selectedComponent.id, { instagramUrl: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="https://instagram.com/yourhandle"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                              <input
                                type="url"
                                value={selectedComponent.props.linkedinUrl || ''}
                                onChange={(e) => updateComponentProps(selectedComponent.id, { linkedinUrl: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="https://linkedin.com/in/yourprofile"
                              />
                            </div>
                            <div>
                              <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={selectedComponent.props.showLabels || false}
                                  onChange={(e) => updateComponentProps(selectedComponent.id, { showLabels: e.target.checked })}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-gray-700">Show Labels</span>
                              </label>
                            </div>
                          </div>
                        )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Smart Triggers</h3>
                <button className="w-full px-4 py-2 border border-gray-300 rounded-lg text-left hover:bg-gray-50 flex items-center justify-between">
                  Add Trigger
                  <Zap className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Analytics</h3>
                <button className="w-full px-4 py-2 border border-gray-300 rounded-lg text-left hover:bg-gray-50 flex items-center justify-between">
                  View Analytics
                  <Settings className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Dynamic Section Entry</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">QR Code Entry Point</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="top">Show Full Page from Top</option>
                      <option value="recipes">Jump to Recipes Section</option>
                      <option value="features">Jump to Features Section</option>
                      <option value="reviews">Jump to Reviews Section</option>
                      <option value="rewards">Jump to Rewards Section</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Barcode Entry Point</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="top">Show Full Page from Top</option>
                      <option value="how-to">Jump to How-to Instructions</option>
                      <option value="features">Jump to Features Section</option>
                      <option value="sustainability">Jump to Sustainability Section</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Direct Link Entry Point</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="top">Show Full Page from Top</option>
                      <option value="contact">Jump to Contact Section</option>
                      <option value="testimonials">Jump to Testimonials Section</option>
                    </select>
                  </div>
                  </div>
                </div>
              </div>
            </div>
                )}
              </div>
            </div>
          )}

          {/* For Step 2 (QR & Link), show QR Link Panel */}
        {showBuilder && currentStep === 2 && (
            <div className="w-[480px] bg-white border-l border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200 bg-blue-50">
                <h2 className="text-lg font-semibold text-gray-900">QR Code & Link Management</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Configure your page URL, QR code, and tracking parameters
                </p>
              </div>
              <QRLinkPanel
                data={qrLinkData}
                onChange={updateQrLinkDataWithHistory}
                baseUrl="https://example.com"
                folders={folders}
                existingQRCodes={existingQRCodes}
                onSaveAndLockSlug={handleSaveAndLockSlug}
                onCreateNewQR={handleCreateNewQR}
              slugAvailability={slugAvailability}
              slugError={slugError}
              onUnlockSlug={handleUnlockSlug}
              />
            </div>
      )}
      </div>
    </div>
  );
};

export default StudioTab;