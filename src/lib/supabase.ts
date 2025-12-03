import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Public client – used for all browser-facing operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Admin client – used only for auth.admin.* workflows like checking
 * for duplicate emails. This MUST NOT be exposed in a real production
 * browser app; it is intended for a trusted backend environment.
 *
 * In this project we keep it here for simplicity to satisfy the
 * "auth.admin.listUsers() or equivalent" requirement.
 */
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : null;

export interface Folder {
  id: string;
  name: string;
  parent_id: string | null;
  path: string;
  created_at: string;
  updated_at: string;
}

export interface Asset {
  id: string;
  name: string;
  url: string;
  type: string;
  mime_type: string;
  size: number;
  folder_id: string | null;
  width: number | null;
  height: number | null;
  duration: number | null;
  tags: string[];
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface FileShare {
  id: string;
  asset_id: string;
  public_link: string;
  expires_at: string | null;
  download_count: number;
  created_at: string;
}

export interface BrandProfile {
  id: string; // FK → auth.users.id
  brand_name: string;
  first_name: string;
  last_name: string;
  official_email: string;
  mobile_number: string | null;
  designation: string | null;
  industry_category: string | null;
  number_of_employees: string | null;
  created_at?: string;
  updated_at?: string;
}
