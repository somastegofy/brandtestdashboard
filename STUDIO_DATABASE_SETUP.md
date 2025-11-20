# Studio Pages Database Setup

## Overview
This document describes the database schema and setup for saving and loading Studio pages (Content, Design, QR & Link data).

## Database Schema

### Table: `studio_pages`

Stores all Studio page data including:
- Page settings (name, slug, SEO, etc.)
- Page content (components array)
- Design customization
- QR & Link data
- Status (draft/published)

#### Schema Details

```sql
CREATE TABLE studio_pages (
  id uuid PRIMARY KEY,
  product_id text,                    -- Product ID (can be null for landing pages)
  page_type text,                      -- 'landing' or 'product'
  status text,                         -- 'draft' or 'published'
  
  -- Page Settings
  page_name text NOT NULL,
  linked_product_id text,
  is_default_page boolean,
  seo_title text,
  meta_description text,
  meta_keywords text,
  slug text NOT NULL,
  enable_reward_logic boolean,
  enable_smart_triggers boolean,
  password_protection boolean,
  password text,
  
  -- JSONB Fields (flexible storage)
  page_content jsonb,                  -- Array of PageContentBlock
  design_customization jsonb,          -- DesignCustomization object
  qr_link_data jsonb,                 -- QRLinkData object
  
  -- Published metadata
  published_url text,
  page_views integer DEFAULT 0,
  
  -- Timestamps
  created_at timestamptz,
  updated_at timestamptz,
  published_at timestamptz,
  last_saved_at timestamptz
);
```

## Setup Instructions

### 1. Run the Migration

The migration file is located at:
```
supabase/migrations/20250101000000_create_studio_pages_table.sql
```

**To apply the migration:**

If using Supabase CLI:
```bash
supabase db push
```

Or manually run the SQL in your Supabase SQL Editor.

### 2. Environment Variables

Ensure your `.env` file has:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Row Level Security (RLS)

The migration includes RLS policies that allow authenticated users to:
- View all studio pages
- Create studio pages
- Update studio pages
- Delete studio pages

**Note:** If you need more restrictive policies (e.g., users can only see their own pages), update the RLS policies in the migration file.

## API Functions

### Save Draft / Publish
```typescript
import { saveStudioPage } from '../api/studioPages';

await saveStudioPage(pageId, {
  productId: 'product-123',
  pageType: 'product',
  status: 'draft' | 'published',
  pageSettings: { ... },
  pageContent: [ ... ],
  designCustomization: { ... },
  qrLinkData: { ... },
  publishedUrl: 'https://...'
});
```

### Load Saved Page
```typescript
import { loadStudioPage } from '../api/studioPages';

const page = await loadStudioPage(
  productId,
  'product',
  'draft' // optional: 'draft' | 'published'
);
```

## Data Structure

### Page Content (JSONB)
Stored as an array of `PageContentBlock`:
```typescript
[
  {
    id: "component-1",
    type: "Header",
    props: { ... },
    style: { ... }
  },
  {
    id: "component-2",
    type: "Images+Link",
    props: { ... },
    style: { ... }
  }
]
```

### Design Customization (JSONB)
Stored as `DesignCustomization` object:
```typescript
{
  backgroundColor: "#ffffff",
  backgroundImage: "",
  fontFamilyHeading: "system-ui",
  // ... all design settings
}
```

### QR & Link Data (JSONB)
Stored as `QRLinkData` object:
```typescript
{
  slug: "my-product-page",
  isSlugLocked: false,
  campaignName: "Product Campaign",
  qrOption: "create_new",
  // ... all QR & Link settings
}
```

## Features

### Auto-Load on Product Selection
When a product is selected in Studio:
1. System tries to load draft version first
2. If no draft, loads published version
3. If neither exists, initializes with defaults

### Save Draft
- Saves all current state (Content, Design, QR & Link)
- Status: `draft`
- Can be saved multiple times (updates existing record)

### Publish
- Saves all current state
- Status: `published`
- Sets `published_at` timestamp
- Generates `published_url`
- Can update existing draft to published

### Data Persistence
- All three workflow steps are saved:
  - **Step 1 (Content):** `page_content` JSONB
  - **Step 2 (Design):** `design_customization` JSONB
  - **Step 3 (QR & Link):** `qr_link_data` JSONB

## Troubleshooting

### Migration Fails
- Check if `studio_pages` table already exists
- Verify Supabase connection
- Check RLS policies are enabled

### Save Fails
- Verify environment variables are set
- Check browser console for error messages
- Ensure user is authenticated (if RLS requires it)

### Load Fails
- Check product ID is correct
- Verify page exists in database
- Check browser console for errors

## Next Steps

1. Run the migration in your Supabase project
2. Test save draft functionality
3. Test publish functionality
4. Test loading saved pages
5. Adjust RLS policies if needed for your use case

