import { supabase } from '../lib/supabase';
import { BrandProfile } from '../lib/supabase';

/**
 * Get the current user's brand profile
 */
export async function getCurrentBrandProfile(): Promise<BrandProfile | null> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from('brand_profiles')
    .select('*')
    .eq('id', user.id)
    .single<BrandProfile>();

  if (error) {
    console.error('Error fetching brand profile:', error);
    return null;
  }

  return data;
}

/**
 * Get brand name slug (normalized for URLs)
 */
export function getBrandNameSlug(brandName: string): string {
  return brandName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/^-+|-+$/g, '');
}

/**
 * Determine QR code type based on URL
 * @param url The destination URL
 * @returns The QR type: 'page' for internal pages, 'external' for external URLs
 */
export function getQRType(url: string): 'page' | 'external' {
  // Check if URL is an internal page (contains /published-product/ or starts with base domain)
  const isInternal = url.includes('/published-product/') || 
                     url.includes('/qr/') ||
                     (!url.startsWith('http://') && !url.startsWith('https://'));
  
  return isInternal ? 'page' : 'external';
}

