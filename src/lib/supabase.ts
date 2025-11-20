import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
