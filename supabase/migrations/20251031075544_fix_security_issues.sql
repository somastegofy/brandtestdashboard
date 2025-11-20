/*
  # Fix Security and Performance Issues

  ## Changes Made

  1. **Add Missing Foreign Key Indexes**
     - Add index on `file_shares.asset_id` for FK `file_shares_asset_id_fkey`
     - Add index on `studio_page_links.qr_code_id` for FK `studio_page_links_qr_code_id_fkey`

  2. **Optimize RLS Policies for Performance**
     - Update `studio_pages` RLS policies to use `(select auth.uid())` instead of `auth.uid()`
     - Update `studio_page_versions` RLS policies to use `(select auth.uid())`
     - Update `studio_page_analytics` RLS policies to use `(select auth.uid())`
     - This prevents re-evaluation of auth functions for each row, significantly improving query performance at scale

  ## Security Notes
  - All RLS policies maintain their original security logic
  - Only the performance optimization pattern is changed
  - Foreign key indexes improve query performance and prevent table locks during concurrent operations
*/

-- Add missing foreign key indexes
CREATE INDEX IF NOT EXISTS idx_file_shares_asset_id ON public.file_shares(asset_id);
CREATE INDEX IF NOT EXISTS idx_studio_page_links_qr_code_id ON public.studio_page_links(qr_code_id);

-- Optimize studio_pages RLS policies
DROP POLICY IF EXISTS "Users can view own studio pages" ON public.studio_pages;
CREATE POLICY "Users can view own studio pages"
  ON public.studio_pages
  FOR SELECT
  TO authenticated
  USING (created_by = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own studio pages" ON public.studio_pages;
CREATE POLICY "Users can insert own studio pages"
  ON public.studio_pages
  FOR INSERT
  TO authenticated
  WITH CHECK (created_by = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own studio pages" ON public.studio_pages;
CREATE POLICY "Users can update own studio pages"
  ON public.studio_pages
  FOR UPDATE
  TO authenticated
  USING (created_by = (select auth.uid()))
  WITH CHECK (created_by = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own studio pages" ON public.studio_pages;
CREATE POLICY "Users can delete own studio pages"
  ON public.studio_pages
  FOR DELETE
  TO authenticated
  USING (created_by = (select auth.uid()));

-- Optimize studio_page_versions RLS policies
DROP POLICY IF EXISTS "Users can view own page versions" ON public.studio_page_versions;
CREATE POLICY "Users can view own page versions"
  ON public.studio_page_versions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.studio_pages
      WHERE studio_pages.id = studio_page_versions.page_id
      AND studio_pages.created_by = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can insert own page versions" ON public.studio_page_versions;
CREATE POLICY "Users can insert own page versions"
  ON public.studio_page_versions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.studio_pages
      WHERE studio_pages.id = studio_page_versions.page_id
      AND studio_pages.created_by = (select auth.uid())
    )
  );

-- Optimize studio_page_analytics RLS policies
DROP POLICY IF EXISTS "Users can view analytics for own pages" ON public.studio_page_analytics;
CREATE POLICY "Users can view analytics for own pages"
  ON public.studio_page_analytics
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.studio_pages
      WHERE studio_pages.id = studio_page_analytics.page_id
      AND studio_pages.created_by = (select auth.uid())
    )
  );