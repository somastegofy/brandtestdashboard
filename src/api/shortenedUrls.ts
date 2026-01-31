/**
 * Shortened URLs API
 * 
 * This module handles creating and retrieving shortened URLs using Supabase.
 * Shortened URLs use the stego.fyi domain format.
 */

import { supabase } from '../lib/supabase';

export interface ShortenedURL {
  id: string;
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
  qrCodeId: string | null;
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;
  totalClicks: number;
}

const SHORT_DOMAIN = 'stego.fyi';

/**
 * Generate a unique short code for the URL
 */
function generateShortCode(): string {
  // Generate a 7 character alphanumeric code
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Create a shortened URL using Supabase
 * @param originalUrl The original URL to shorten
 * @param qrCodeId Optional QR code ID to link to
 * @param expirationTTL Optional expiration time in seconds (default: no expiration)
 * @returns The shortened URL object
 */
export async function createShortenedURL(
  originalUrl: string,
  qrCodeId?: string | null,
  expirationTTL?: number
): Promise<ShortenedURL> {
  let shortCode = generateShortCode();
  let attempts = 0;
  const maxAttempts = 10;

  // Try to create a unique short code
  while (attempts < maxAttempts) {
    try {
      // Check if code already exists
      const { data: existing } = await supabase
        .from('shortened_urls')
        .select('short_code')
        .eq('short_code', shortCode)
        .maybeSingle();

      if (existing) {
        // Code exists, generate a new one
        shortCode = generateShortCode();
        attempts++;
        continue;
      }

      // Calculate expiration date if provided
      const expiresAt = expirationTTL
        ? new Date(Date.now() + expirationTTL * 1000).toISOString()
        : null;

      // Create the shortened URL entry
      console.log('🔹 Creating shortened URL in Supabase:', {
        shortCode,
        originalUrl,
        qrCodeId: qrCodeId || null,
        expiresAt: expiresAt || null
      });
      
      const { data, error } = await supabase
        .from('shortened_urls')
        .insert({
          short_code: shortCode,
          original_url: originalUrl,
          qr_code_id: qrCodeId || null,
          expires_at: expiresAt,
        })
        .select()
        .single();
      
      console.log('📡 Supabase Response:', { data, error });

      if (error) {
        // If it's a unique constraint error, try again with new code
        if (error.code === '23505') {
          shortCode = generateShortCode();
          attempts++;
          continue;
        }
        throw error;
      }

      const shortUrl = `https://${SHORT_DOMAIN}/${shortCode}`;
      
      console.log('✅ shortenedUrls.ts: Shortened URL created successfully:', shortUrl);

      return {
        id: data.id,
        shortCode: data.short_code,
        shortUrl,
        originalUrl: data.original_url,
        qrCodeId: data.qr_code_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        expiresAt: data.expires_at,
        totalClicks: data.total_clicks || 0,
      };
    } catch (error: any) {
      if (attempts >= maxAttempts - 1) {
        throw new Error(`Failed to create shortened URL after ${maxAttempts} attempts: ${error.message}`);
      }
      shortCode = generateShortCode();
      attempts++;
    }
  }

  throw new Error('Failed to create shortened URL: Maximum attempts reached');
}

/**
 * Retrieve the original URL from a short code
 * @param shortCode The short code to look up
 * @returns The original URL or null if not found
 */
export async function getShortenedURL(shortCode: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('shortened_urls')
      .select('original_url, expires_at')
      .eq('short_code', shortCode)
      .maybeSingle();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    if (!data) {
      return null;
    }

    // Check if expired
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return null;
    }

    return data.original_url || null;
  } catch (error: any) {
    if (error.message?.includes('404') || error.code === 'PGRST116') {
      return null;
    }
    throw error;
  }
}

/**
 * Get shortened URL by QR code ID
 * @param qrCodeId The QR code ID
 * @returns The shortened URL object or null if not found
 */
export async function getShortenedURLByQRCodeId(qrCodeId: string): Promise<ShortenedURL | null> {
  try {
    const { data, error } = await supabase
      .from('shortened_urls')
      .select('*')
      .eq('qr_code_id', qrCodeId)
      .maybeSingle();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      shortCode: data.short_code,
      shortUrl: `https://${SHORT_DOMAIN}/${data.short_code}`,
      originalUrl: data.original_url,
      qrCodeId: data.qr_code_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      expiresAt: data.expires_at,
      totalClicks: data.total_clicks || 0,
    };
  } catch (error: any) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw error;
  }
}

/**
 * Increment click count for a shortened URL
 * @param shortCode The short code
 */
export async function incrementShortenedURLClicks(shortCode: string): Promise<void> {
  try {
    const { error } = await supabase.rpc('increment_shortened_url_clicks', {
      short_code_param: shortCode,
    });

    if (error) {
      console.error('Error incrementing shortened URL clicks:', error);
      // Don't throw - we don't want to break the redirect if click increment fails
    }
  } catch (error) {
    console.error('Error incrementing shortened URL clicks:', error);
  }
}

