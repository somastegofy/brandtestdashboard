/*
  # Studio Pages Schema
  
  This migration creates the studio_pages table to store:
  - Page content (components)
  - Design customization
  - QR & Link data
  - Page settings
  - Status (draft/published)
  - Product association
*/

-- Create studio_pages table
CREATE TABLE IF NOT EXISTS studio_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text, -- Store product ID as text (can be UUID or string from state)
  page_type text NOT NULL CHECK (page_type IN ('landing', 'product')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  
  -- Page Settings
  page_name text NOT NULL,
  linked_product_id text,
  is_default_page boolean DEFAULT false,
  seo_title text,
  meta_description text,
  meta_keywords text,
  slug text NOT NULL,
  enable_reward_logic boolean DEFAULT false,
  enable_smart_triggers boolean DEFAULT false,
  password_protection boolean DEFAULT false,
  password text,
  
  -- Page Content (JSONB for flexible component storage)
  page_content jsonb NOT NULL DEFAULT '[]'::jsonb,
  
  -- Design Customization (JSONB)
  design_customization jsonb NOT NULL DEFAULT '{}'::jsonb,
  
  -- QR & Link Data (JSONB)
  qr_link_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  
  -- Published URL and metadata
  published_url text,
  page_views integer DEFAULT 0,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz,
  last_saved_at timestamptz DEFAULT now()
  
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_studio_pages_product_id ON studio_pages(product_id);
CREATE INDEX IF NOT EXISTS idx_studio_pages_status ON studio_pages(status);
CREATE UNIQUE INDEX IF NOT EXISTS idx_studio_pages_slug ON studio_pages(slug) WHERE slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_studio_pages_page_type ON studio_pages(page_type);
CREATE INDEX IF NOT EXISTS idx_studio_pages_updated_at ON studio_pages(updated_at DESC);

-- Partial unique index for product_id + slug combination (only when both are not null)
CREATE UNIQUE INDEX IF NOT EXISTS idx_studio_pages_product_slug 
  ON studio_pages(product_id, slug) 
  WHERE product_id IS NOT NULL AND slug IS NOT NULL;

-- Enable Row Level Security
ALTER TABLE studio_pages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Note: These policies allow both authenticated and anon users to access all pages
-- For production, you may want to restrict to authenticated users only
-- If you need user-specific access control, add a `created_by uuid REFERENCES auth.users(id)` column
-- and update policies to use: USING (created_by = auth.uid())

-- Allow all users (authenticated and anon) to view studio pages
CREATE POLICY "Users can view studio pages"
  ON studio_pages
  FOR SELECT
  USING (true);

-- Allow all users (authenticated and anon) to create studio pages
CREATE POLICY "Users can create studio pages"
  ON studio_pages
  FOR INSERT
  WITH CHECK (true);

-- Allow all users (authenticated and anon) to update studio pages
CREATE POLICY "Users can update studio pages"
  ON studio_pages
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow all users (authenticated and anon) to delete studio pages
CREATE POLICY "Users can delete studio pages"
  ON studio_pages
  FOR DELETE
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_studio_pages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  NEW.last_saved_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_studio_pages_updated_at
  BEFORE UPDATE ON studio_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_studio_pages_updated_at();

-- Function to set published_at when status changes to published
CREATE OR REPLACE FUNCTION set_studio_pages_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'published' AND OLD.status != 'published' THEN
    NEW.published_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set published_at
CREATE TRIGGER set_studio_pages_published_at
  BEFORE UPDATE ON studio_pages
  FOR EACH ROW
  EXECUTE FUNCTION set_studio_pages_published_at();

