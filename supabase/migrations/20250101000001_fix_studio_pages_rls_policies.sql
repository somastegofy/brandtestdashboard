/*
  # Fix Studio Pages RLS Policies
  
  This migration updates the RLS policies to allow both authenticated and anon users.
  This fixes the "new row violates row-level security policy" error when publishing pages.
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view studio pages" ON studio_pages;
DROP POLICY IF EXISTS "Users can create studio pages" ON studio_pages;
DROP POLICY IF EXISTS "Users can update studio pages" ON studio_pages;
DROP POLICY IF EXISTS "Users can delete studio pages" ON studio_pages;

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

