/*
  # Shortened URLs Schema
  
  This migration creates a table to store shortened URLs for QR codes.
  Shortened URLs use the stego.fyi domain and are stored in Supabase.
*/

-- Create shortened_urls table
CREATE TABLE IF NOT EXISTS shortened_urls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  short_code text NOT NULL UNIQUE, -- The short code (e.g., "abc1234")
  original_url text NOT NULL, -- The original URL to redirect to
  qr_code_id uuid REFERENCES qr_codes(id) ON DELETE SET NULL, -- Optional link to QR code
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  expires_at timestamptz, -- Optional expiration
  total_clicks integer DEFAULT 0, -- Track clicks
  
  -- Ensure short code is unique
  UNIQUE (short_code)
);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_shortened_urls_short_code ON shortened_urls(short_code);
CREATE INDEX IF NOT EXISTS idx_shortened_urls_qr_code_id ON shortened_urls(qr_code_id);

-- Enable Row Level Security
ALTER TABLE shortened_urls ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Users can view shortened URLs" ON shortened_urls;
DROP POLICY IF EXISTS "Users can create shortened URLs" ON shortened_urls;
DROP POLICY IF EXISTS "Users can update shortened URLs" ON shortened_urls;
DROP POLICY IF EXISTS "Users can delete shortened URLs" ON shortened_urls;

-- RLS Policies for shortened_urls
-- Allow all users (authenticated and anon) to view shortened URLs (needed for redirects)
CREATE POLICY "Users can view shortened URLs"
  ON shortened_urls
  FOR SELECT
  USING (true);

-- Allow all users (authenticated and anon) to create shortened URLs
CREATE POLICY "Users can create shortened URLs"
  ON shortened_urls
  FOR INSERT
  WITH CHECK (true);

-- Allow all users (authenticated and anon) to update shortened URLs
CREATE POLICY "Users can update shortened URLs"
  ON shortened_urls
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow all users (authenticated and anon) to delete shortened URLs
CREATE POLICY "Users can delete shortened URLs"
  ON shortened_urls
  FOR DELETE
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_shortened_urls_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists (for idempotency)
DROP TRIGGER IF EXISTS update_shortened_urls_updated_at ON shortened_urls;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_shortened_urls_updated_at
  BEFORE UPDATE ON shortened_urls
  FOR EACH ROW
  EXECUTE FUNCTION update_shortened_urls_updated_at();

-- Function to increment click count
CREATE OR REPLACE FUNCTION increment_shortened_url_clicks(short_code_param text)
RETURNS void AS $$
BEGIN
  UPDATE shortened_urls
  SET total_clicks = total_clicks + 1
  WHERE short_code = short_code_param;
END;
$$ LANGUAGE plpgsql;

