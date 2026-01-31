# Cloudflare KV Proxy Edge Function

This Supabase Edge Function acts as a proxy between your frontend and Cloudflare KV API to avoid CORS issues.

## Setup Instructions

1. **Deploy the Edge Function:**
   ```bash
   # If you have Supabase CLI installed
   supabase functions deploy cloudflare-kv-proxy
   ```

2. **Or manually deploy via Supabase Dashboard:**
   - Go to your Supabase project dashboard
   - Navigate to "Edge Functions"
   - Click "Create a new function"
   - Name it: `cloudflare-kv-proxy`
   - Copy the contents of `index.ts` into the function editor
   - Deploy

3. **The function will be available at:**
   ```
   https://YOUR_PROJECT_ID.supabase.co/functions/v1/cloudflare-kv-proxy
   ```

## How It Works

The frontend calls this Edge Function instead of calling Cloudflare API directly. The Edge Function:
- Runs on the server (no CORS restrictions)
- Makes authenticated requests to Cloudflare KV API
- Returns the response to the frontend

## API Endpoints

### Create Shortened URL
```json
POST /functions/v1/cloudflare-kv-proxy
{
  "action": "create",
  "payload": [
    {
      "key": "abc1234",
      "value": "https://example.com",
      "metadata": { ... }
    }
  ]
}
```

### Get Shortened URL
```json
POST /functions/v1/cloudflare-kv-proxy
{
  "action": "get",
  "shortCode": "abc1234"
}
```

### Get Metadata
```json
POST /functions/v1/cloudflare-kv-proxy
{
  "action": "getMetadata",
  "shortCode": "abc1234"
}
```

