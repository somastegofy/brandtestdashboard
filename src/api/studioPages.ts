import { supabase } from '../lib/supabase';
import { PageContentBlock } from '../components/studio/components';
import { DesignCustomization } from '../components/studio/DesignSettingsPanel';
import { QRLinkData } from '../components/studio/QRLinkPanel';

export interface StudioPage {
  id: string;
  product_id: string | null;
  page_type: 'landing' | 'product';
  status: 'draft' | 'published';
  page_name: string;
  linked_product_id: string | null;
  is_default_page: boolean;
  seo_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  slug: string;
  enable_reward_logic: boolean;
  enable_smart_triggers: boolean;
  password_protection: boolean;
  password: string | null;
  page_content: PageContentBlock[];
  design_customization: DesignCustomization;
  qr_link_data: QRLinkData;
  published_url: string | null;
  page_views: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  last_saved_at: string;
}

export interface SaveStudioPageParams {
  productId: string | null;
  pageType: 'landing' | 'product';
  status: 'draft' | 'published';
  pageSettings: {
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
  };
  pageContent: PageContentBlock[];
  designCustomization: DesignCustomization;
  qrLinkData: QRLinkData;
  publishedUrl?: string;
}

/**
 * Save or update a studio page (draft or published)
 */
export async function saveStudioPage(
  pageId: string | null,
  params: SaveStudioPageParams
): Promise<StudioPage> {
  const pageData = {
    product_id: params.productId,
    page_type: params.pageType,
    status: params.status,
    page_name: params.pageSettings.pageName,
    linked_product_id: params.pageSettings.linkedProduct || null,
    is_default_page: params.pageSettings.isDefaultPage,
    seo_title: params.pageSettings.seoTitle || null,
    meta_description: params.pageSettings.metaDescription || null,
    meta_keywords: params.pageSettings.metaKeywords || null,
    slug: params.pageSettings.slug,
    enable_reward_logic: params.pageSettings.enableRewardLogic,
    enable_smart_triggers: params.pageSettings.enableSmartTriggers,
    password_protection: params.pageSettings.passwordProtection,
    password: params.pageSettings.password || null,
    page_content: params.pageContent,
    design_customization: params.designCustomization,
    qr_link_data: params.qrLinkData,
    published_url: params.publishedUrl || null,
  };

  if (pageId) {
    // Update existing page
    const { data, error } = await supabase
      .from('studio_pages')
      .update(pageData)
      .eq('id', pageId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    // Create new page
    const { data, error } = await supabase
      .from('studio_pages')
      .insert(pageData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

/**
 * Load a studio page by product ID and page type
 */
export async function loadStudioPage(
  productId: string,
  pageType: 'landing' | 'product',
  status?: 'draft' | 'published'
): Promise<StudioPage | null> {
  let query = supabase
    .from('studio_pages')
    .select('*')
    .eq('product_id', productId)
    .eq('page_type', pageType);

  if (status) {
    query = query.eq('status', status);
  } else {
    // If no status specified, prefer draft, then published
    query = query.order('status', { ascending: false }); // draft comes before published alphabetically
  }

  const { data, error } = await query
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * Load a studio page by ID
 */
export async function loadStudioPageById(pageId: string): Promise<StudioPage | null> {
  const { data, error } = await supabase
    .from('studio_pages')
    .select('*')
    .eq('id', pageId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    throw error;
  }
  return data;
}

/**
 * Load a published studio page by slug
 */
export async function loadPublishedStudioPageBySlug(slug: string): Promise<StudioPage | null> {
  const { data, error } = await supabase
    .from('studio_pages')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw error;
  }
  return data;
}

/**
 * Check if a slug already exists (for any page, draft or published)
 * Returns true if slug exists, false otherwise
 */
export async function checkSlugExists(slug: string, excludePageId?: string): Promise<boolean> {
  let query = supabase
    .from('studio_pages')
    .select('id')
    .eq('slug', slug)
    .limit(1);

  // If excludePageId is provided, exclude that page from the check (for updates)
  if (excludePageId) {
    query = query.neq('id', excludePageId);
  }

  const { data, error } = await query.maybeSingle();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return !!data;
}

/**
 * Check if a page name already exists for landing pages
 * Returns true if page name exists, false otherwise
 */
export async function checkLandingPageNameExists(pageName: string, excludePageId?: string): Promise<boolean> {
  let query = supabase
    .from('studio_pages')
    .select('id')
    .eq('page_name', pageName)
    .eq('page_type', 'landing')
    .limit(1);

  // If excludePageId is provided, exclude that page from the check (for updates)
  if (excludePageId) {
    query = query.neq('id', excludePageId);
  }

  const { data, error } = await query.maybeSingle();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return !!data;
}

/**
 * Get all studio pages for a product
 */
export async function getStudioPagesByProduct(productId: string): Promise<StudioPage[]> {
  const { data, error } = await supabase
    .from('studio_pages')
    .select('*')
    .eq('product_id', productId)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Get all landing pages (pages where product_id is null)
 */
export async function getAllLandingPages(): Promise<StudioPage[]> {
  const { data, error } = await supabase
    .from('studio_pages')
    .select('*')
    .eq('page_type', 'landing')
    .is('product_id', null)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Delete a studio page
 */
export async function deleteStudioPage(pageId: string): Promise<void> {
  const { error } = await supabase
    .from('studio_pages')
    .delete()
    .eq('id', pageId);

  if (error) throw error;
}

/**
 * Increment page views
 */
export async function incrementPageViews(pageId: string): Promise<void> {
  // First, get the current page views
  const { data: currentPage, error: fetchError } = await supabase
    .from('studio_pages')
    .select('page_views')
    .eq('id', pageId)
    .single();

  if (fetchError) {
    // If page doesn't exist or other error, just log and return
    console.error('Error fetching page views:', fetchError);
    return;
  }

  // Increment the view count
  const newViewCount = (currentPage?.page_views || 0) + 1;

  // Update the page views
  const { error: updateError } = await supabase
    .from('studio_pages')
    .update({ page_views: newViewCount })
    .eq('id', pageId);

  if (updateError) {
    console.error('Error updating page views:', updateError);
    // Don't throw - we don't want to break the page load if view increment fails
  }
}

