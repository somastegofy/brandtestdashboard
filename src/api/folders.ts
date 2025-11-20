import { supabase, Folder } from '../lib/supabase';

export async function fetchFolders(): Promise<Folder[]> {
  const { data, error } = await supabase
    .from('folders')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function createFolder(name: string, parentId: string | null = null): Promise<Folder> {
  const path = parentId ? `/${name}` : `/${name}`;

  const { data, error } = await supabase
    .from('folders')
    .insert([{ name, parent_id: parentId, path }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateFolder(id: string, updates: Partial<Folder>): Promise<Folder> {
  const { data, error } = await supabase
    .from('folders')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteFolder(id: string): Promise<void> {
  const { error } = await supabase
    .from('folders')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getFolderPath(id: string): Promise<string> {
  const { data, error } = await supabase
    .from('folders')
    .select('path')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data?.path || '/';
}
