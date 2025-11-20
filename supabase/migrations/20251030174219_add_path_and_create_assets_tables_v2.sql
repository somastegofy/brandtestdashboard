/*
  # File Manager Schema Extension v2

  1. Changes to existing folders table
    - Add `path` column for full path tracking
  
  2. New Tables
    - `assets` - File storage metadata
    - `file_shares` - Public sharing links
  
  3. Security
    - Enable RLS on new tables
    - Add policies for authenticated users
  
  4. Initial Data
    - Insert default folders if not present
*/

-- Add path column to folders table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'folders' AND column_name = 'path'
  ) THEN
    ALTER TABLE folders ADD COLUMN path text NOT NULL DEFAULT '';
  END IF;
END $$;

-- Create assets table
CREATE TABLE IF NOT EXISTS assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  type text NOT NULL,
  mime_type text NOT NULL,
  size bigint NOT NULL DEFAULT 0,
  folder_id uuid REFERENCES folders(id) ON DELETE SET NULL,
  width integer,
  height integer,
  duration integer,
  tags text[] DEFAULT '{}',
  thumbnail_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create file_shares table
CREATE TABLE IF NOT EXISTS file_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id uuid REFERENCES assets(id) ON DELETE CASCADE,
  public_link text UNIQUE NOT NULL,
  expires_at timestamptz,
  download_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_assets_folder_id ON assets(folder_id);
CREATE INDEX IF NOT EXISTS idx_assets_type ON assets(type);
CREATE INDEX IF NOT EXISTS idx_assets_created_at ON assets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_assets_tags ON assets USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_folders_parent_id ON folders(parent_id);

-- Enable Row Level Security
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_shares ENABLE ROW LEVEL SECURITY;

-- Assets policies (allow all for demo purposes)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'assets' AND policyname = 'Allow all operations on assets'
  ) THEN
    CREATE POLICY "Allow all operations on assets"
      ON assets FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'assets' AND policyname = 'Allow public read on assets'
  ) THEN
    CREATE POLICY "Allow public read on assets"
      ON assets FOR SELECT
      TO anon
      USING (true);
  END IF;
END $$;

-- File shares policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'file_shares' AND policyname = 'Allow all operations on file_shares'
  ) THEN
    CREATE POLICY "Allow all operations on file_shares"
      ON file_shares FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'file_shares' AND policyname = 'Allow public read on file_shares'
  ) THEN
    CREATE POLICY "Allow public read on file_shares"
      ON file_shares FOR SELECT
      TO anon
      USING (true);
  END IF;
END $$;

-- Insert default folders if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM folders WHERE name = 'Root' AND parent_id IS NULL) THEN
    INSERT INTO folders (name, parent_id, path) VALUES ('Root', NULL, '/');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM folders WHERE name = 'Images' AND parent_id IS NULL) THEN
    INSERT INTO folders (name, parent_id, path) VALUES ('Images', NULL, '/Images');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM folders WHERE name = 'Videos' AND parent_id IS NULL) THEN
    INSERT INTO folders (name, parent_id, path) VALUES ('Videos', NULL, '/Videos');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM folders WHERE name = 'Documents' AND parent_id IS NULL) THEN
    INSERT INTO folders (name, parent_id, path) VALUES ('Documents', NULL, '/Documents');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM folders WHERE name = 'Audio' AND parent_id IS NULL) THEN
    INSERT INTO folders (name, parent_id, path) VALUES ('Audio', NULL, '/Audio');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM folders WHERE name = 'CSS' AND parent_id IS NULL) THEN
    INSERT INTO folders (name, parent_id, path) VALUES ('CSS', NULL, '/CSS');
  END IF;
END $$;