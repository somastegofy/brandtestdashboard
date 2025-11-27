/*
  # QR Codes Schema
  
  This migration creates:
  1. `qr_codes` table - Stores QR code data (images, customization, etc.)
  2. `studio_page_links` table - Links QR codes to studio pages
  
  QR codes are unique per landing page and persist across page updates.
  When a QR code is scanned, it redirects to the linked landing page.
*/

-- Create qr_codes table
CREATE TABLE IF NOT EXISTS qr_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, -- QR code name (campaign name or auto-generated)
  url text NOT NULL, -- The URL encoded in the QR code (can include UTM parameters)
  
  -- QR Code Images (base64 or URLs)
  qr_image_png text,
  qr_image_svg text,
  qr_image_jpeg text,
  
  -- QR Code Customization (JSONB)
  customization jsonb NOT NULL DEFAULT '{}'::jsonb,
  
  -- Metadata
  campaign_name text,
  folder_id uuid,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  
  -- QR Code settings
  error_correction_level text DEFAULT 'M' CHECK (error_correction_level IN ('L', 'M', 'Q', 'H')),
  size integer DEFAULT 256, -- QR code size in pixels
  margin integer DEFAULT 4, -- Margin in modules
  
  -- Stats
  total_scans integer DEFAULT 0,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure QR code ID is unique
  UNIQUE (id)
);

-- Create studio_page_links table (links QR codes to studio pages)
CREATE TABLE IF NOT EXISTS studio_page_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  qr_code_id uuid NOT NULL REFERENCES qr_codes(id) ON DELETE CASCADE,
  studio_page_id uuid NOT NULL REFERENCES studio_pages(id) ON DELETE CASCADE,
  
  -- Ensure one QR code per page (one-to-one relationship)
  UNIQUE (studio_page_id),
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_qr_codes_url ON qr_codes(url);
CREATE INDEX IF NOT EXISTS idx_qr_codes_campaign_name ON qr_codes(campaign_name);
CREATE INDEX IF NOT EXISTS idx_qr_codes_created_at ON qr_codes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_qr_codes_total_scans ON qr_codes(total_scans DESC);

CREATE INDEX IF NOT EXISTS idx_studio_page_links_qr_code_id ON studio_page_links(qr_code_id);
CREATE INDEX IF NOT EXISTS idx_studio_page_links_studio_page_id ON studio_page_links(studio_page_id);

-- Enable Row Level Security
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE studio_page_links ENABLE ROW LEVEL SECURITY;

-- RLS Policies for qr_codes
-- Allow all users (authenticated and anon) to view QR codes
CREATE POLICY "Users can view QR codes"
  ON qr_codes
  FOR SELECT
  USING (true);

-- Allow all users (authenticated and anon) to create QR codes
CREATE POLICY "Users can create QR codes"
  ON qr_codes
  FOR INSERT
  WITH CHECK (true);

-- Allow all users (authenticated and anon) to update QR codes
CREATE POLICY "Users can update QR codes"
  ON qr_codes
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow all users (authenticated and anon) to delete QR codes
CREATE POLICY "Users can delete QR codes"
  ON qr_codes
  FOR DELETE
  USING (true);

-- RLS Policies for studio_page_links
-- Allow all users (authenticated and anon) to view page links
CREATE POLICY "Users can view page links"
  ON studio_page_links
  FOR SELECT
  USING (true);

-- Allow all users (authenticated and anon) to create page links
CREATE POLICY "Users can create page links"
  ON studio_page_links
  FOR INSERT
  WITH CHECK (true);

-- Allow all users (authenticated and anon) to update page links
CREATE POLICY "Users can update page links"
  ON studio_page_links
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow all users (authenticated and anon) to delete page links
CREATE POLICY "Users can delete page links"
  ON studio_page_links
  FOR DELETE
  USING (true);

-- Function to update updated_at timestamp for qr_codes
CREATE OR REPLACE FUNCTION update_qr_codes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at for qr_codes
CREATE TRIGGER update_qr_codes_updated_at
  BEFORE UPDATE ON qr_codes
  FOR EACH ROW
  EXECUTE FUNCTION update_qr_codes_updated_at();

-- Function to update updated_at timestamp for studio_page_links
CREATE OR REPLACE FUNCTION update_studio_page_links_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at for studio_page_links
CREATE TRIGGER update_studio_page_links_updated_at
  BEFORE UPDATE ON studio_page_links
  FOR EACH ROW
  EXECUTE FUNCTION update_studio_page_links_updated_at();

-- Function to increment QR code scan count
CREATE OR REPLACE FUNCTION increment_qr_code_scans(qr_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE qr_codes
  SET total_scans = total_scans + 1
  WHERE id = qr_id;
END;
$$ LANGUAGE plpgsql;

