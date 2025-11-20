import { supabase, Asset } from '../lib/supabase';

export interface FetchAssetsParams {
  type?: string;
  folderId?: string;
  search?: string;
  sort?: 'newest' | 'name' | 'size';
}

export async function fetchAssets(params: FetchAssetsParams = {}): Promise<Asset[]> {
  let query = supabase.from('assets').select('*');

  if (params.type && params.type !== 'all') {
    query = query.eq('type', params.type);
  }

  if (params.folderId) {
    query = query.eq('folder_id', params.folderId);
  }

  if (params.search) {
    query = query.or(`name.ilike.%${params.search}%,tags.cs.{${params.search}}`);
  }

  switch (params.sort) {
    case 'name':
      query = query.order('name', { ascending: true });
      break;
    case 'size':
      query = query.order('size', { ascending: false });
      break;
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false });
      break;
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

export async function uploadAsset(file: File, folderId: string | null): Promise<Asset> {
  const fileType = getFileType(file.type);
  let width = null;
  let height = null;

  const objectUrl = URL.createObjectURL(file);

  if (fileType === 'image' && file.type.startsWith('image/')) {
    try {
      const dimensions = await getImageDimensions(file);
      width = dimensions.width;
      height = dimensions.height;
    } catch (err) {
      console.warn('Failed to get image dimensions:', err);
    }
  }

  const { data, error } = await supabase
    .from('assets')
    .insert([{
      name: file.name,
      url: objectUrl,
      type: fileType,
      mime_type: file.type,
      size: file.size,
      folder_id: folderId,
      width,
      height,
      thumbnail_url: fileType === 'image' ? objectUrl : null,
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateAsset(id: string, updates: Partial<Asset>): Promise<Asset> {
  const { data, error } = await supabase
    .from('assets')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteAsset(id: string): Promise<void> {
  const { error } = await supabase
    .from('assets')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function searchAssets(query: string): Promise<Asset[]> {
  return fetchAssets({ search: query });
}

function getFileType(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType === 'text/css') return 'css';
  if (mimeType === 'application/pdf') return 'document';
  if (mimeType.includes('word') || mimeType.includes('document')) return 'document';
  if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'document';
  return 'document';
}

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}
