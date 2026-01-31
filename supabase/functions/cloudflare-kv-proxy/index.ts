/**
 * Supabase Edge Function: Cloudflare KV Proxy
 * 
 * This function proxies requests to Cloudflare KV API to avoid CORS issues.
 * It runs on the server side, so it can make requests to Cloudflare without CORS restrictions.
 */

// Deno type declarations for Supabase Edge Functions
declare const Deno: {
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

const CLOUDFLARE_ACCOUNT_ID = 'ded6562065dda6298a734c04ec522c9d';
const CLOUDFLARE_NAMESPACE_ID = 'f4dba023aef54544bff548c3007bd489';
const CLOUDFLARE_API_TOKEN = 'g8d4Q8p2oQbngq5fRMihmNzOVTpnB77W0qUoGXZa';
const CLOUDFLARE_API_BASE = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/${CLOUDFLARE_NAMESPACE_ID}`;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { action, payload, shortCode } = await req.json();

    let cloudflareResponse: Response;
    let result: any;

    switch (action) {
      case 'create':
        // Create shortened URL
        cloudflareResponse = await fetch(`${CLOUDFLARE_API_BASE}/bulk`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!cloudflareResponse.ok) {
          const errorData = await cloudflareResponse.json().catch(() => ({}));
          throw new Error(
            `Cloudflare API error: ${cloudflareResponse.status} ${cloudflareResponse.statusText}. ${JSON.stringify(errorData)}`
          );
        }

        result = await cloudflareResponse.json();
        return new Response(
          JSON.stringify({ success: true, data: result }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        );

      case 'get':
        // Get shortened URL
        if (!shortCode) {
          throw new Error('shortCode is required for get action');
        }

        cloudflareResponse = await fetch(`${CLOUDFLARE_API_BASE}/values/${shortCode}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
          },
        });

        if (cloudflareResponse.status === 404) {
          return new Response(
            JSON.stringify({ originalUrl: null }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200,
            }
          );
        }

        if (!cloudflareResponse.ok) {
          const errorData = await cloudflareResponse.json().catch(() => ({}));
          throw new Error(
            `Cloudflare API error: ${cloudflareResponse.status} ${cloudflareResponse.statusText}. ${JSON.stringify(errorData)}`
          );
        }

        const originalUrl = await cloudflareResponse.text();
        return new Response(
          JSON.stringify({ originalUrl: originalUrl || null }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        );

      case 'getMetadata':
        // Get metadata for shortened URL
        if (!shortCode) {
          throw new Error('shortCode is required for getMetadata action');
        }

        cloudflareResponse = await fetch(`${CLOUDFLARE_API_BASE}/metadata/${shortCode}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
          },
        });

        if (cloudflareResponse.status === 404) {
          return new Response(
            JSON.stringify({ metadata: null }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200,
            }
          );
        }

        if (!cloudflareResponse.ok) {
          const errorData = await cloudflareResponse.json().catch(() => ({}));
          throw new Error(
            `Cloudflare API error: ${cloudflareResponse.status} ${cloudflareResponse.statusText}. ${JSON.stringify(errorData)}`
          );
        }

        const metadata = await cloudflareResponse.json();
        return new Response(
          JSON.stringify({ metadata: metadata || null }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        );

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error: any) {
    console.error('Error in cloudflare-kv-proxy:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

