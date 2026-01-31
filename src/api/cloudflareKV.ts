/**
 * Cloudflare KV API Integration
 * 
 * This module handles creating and retrieving shortened URLs using Cloudflare KV storage.
 * Shortened URLs are stored on the stego.fyi domain.
 */

const CLOUDFLARE_ACCOUNT_ID = 'ded6562065dda6298a734c04ec522c9d';
const CLOUDFLARE_NAMESPACE_ID = 'f4dba023aef54544bff548c3007bd489';
const CLOUDFLARE_API_TOKEN = 'g8d4Q8p2oQbngq5fRMihmNzOVTpnB77W0qUoGXZa';
const SHORT_DOMAIN = 'stego.fyi';

const CLOUDFLARE_API_BASE = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/${CLOUDFLARE_NAMESPACE_ID}`;

export interface ShortenedURL {
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
  createdAt: string;
  expiresAt?: string;
}

/**
 * Generate a unique short code for the URL
 */
function generateShortCode(): string {
  // Generate a 6-8 character alphanumeric code
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Create a shortened URL using Cloudflare KV
 * @param originalUrl The original URL to shorten
 * @param expirationTTL Optional expiration time in seconds (default: no expiration)
 * @returns The shortened URL object
 */
export async function createShortenedURL(
  originalUrl: string,
  expirationTTL?: number
): Promise<ShortenedURL> {
  let shortCode = generateShortCode();
  let attempts = 0;
  const maxAttempts = 10;

  // Try to create a unique short code
  while (attempts < maxAttempts) {
    try {
      // Check if code already exists
      const existing = await getShortenedURL(shortCode);
      if (existing) {
        // Code exists, generate a new one
        shortCode = generateShortCode();
        attempts++;
        continue;
      }

      // Create the shortened URL entry
      const metadata = {
        originalUrl,
        createdAt: new Date().toISOString(),
      };

      const payload: Array<{
        key: string;
        value: string;
        expiration_ttl?: number;
        metadata?: Record<string, any>;
      }> = [
        {
          key: shortCode,
          value: originalUrl,
          metadata,
        },
      ];

      if (expirationTTL) {
        payload[0].expiration_ttl = expirationTTL;
      }
      console.log("🔹 Cloudflare KV Payload:", JSON.stringify(payload, null, 2));

      // Use Supabase Edge Function as proxy to avoid CORS issues
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
      const edgeFunctionUrl = `${supabaseUrl}/functions/v1/cloudflare-kv-proxy`;
      
      console.log("🔹 Calling Supabase Edge Function proxy for Cloudflare KV");
      
      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          action: 'create',
          payload: payload,
        }),
      });
      
      const rawText = await response.text();
      console.log("📡 Cloudflare Proxy Response:", rawText);
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Failed to create shortened URL: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`
        );
      }

      const shortUrl = `https://${SHORT_DOMAIN}/${shortCode}`;

      return {
        shortCode,
        shortUrl,
        originalUrl,
        createdAt: metadata.createdAt,
        expiresAt: expirationTTL
          ? new Date(Date.now() + expirationTTL * 1000).toISOString()
          : undefined,
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
    // Use Supabase Edge Function as proxy to avoid CORS issues
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/cloudflare-kv-proxy`;
    
    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({
        action: 'get',
        shortCode: shortCode,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 404 || errorData.error?.includes('not found')) {
        return null;
      }
      throw new Error(
        `Failed to retrieve shortened URL: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`
      );
    }

    const result = await response.json();
    return result.originalUrl || null;
  } catch (error: any) {
    if (error.message?.includes('404')) {
      return null;
    }
    throw error;
  }
}

/**
 * Get metadata for a shortened URL
 * @param shortCode The short code to look up
 * @returns The metadata object or null if not found
 */
export async function getShortenedURLMetadata(shortCode: string): Promise<Record<string, any> | null> {
  try {
    // Use Supabase Edge Function as proxy to avoid CORS issues
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/cloudflare-kv-proxy`;
    
    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({
        action: 'getMetadata',
        shortCode: shortCode,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 404 || errorData.error?.includes('not found')) {
        return null;
      }
      throw new Error(
        `Failed to retrieve shortened URL metadata: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`
      );
    }

    const result = await response.json();
    return result.metadata || null;
  } catch (error: any) {
    if (error.message?.includes('404')) {
      return null;
    }
    throw error;
  }
}

