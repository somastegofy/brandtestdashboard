import { supabase } from '../lib/supabase';
import { QRCustomization } from '../components/studio/QRGenerator';

export interface QRCode {
  id: string;
  name: string;
  url: string;
  qr_image_png: string | null;
  qr_image_svg: string | null;
  qr_image_jpeg: string | null;
  customization: QRCustomization;
  campaign_name: string | null;
  folder_id: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  error_correction_level: 'L' | 'M' | 'Q' | 'H';
  size: number;
  margin: number;
  total_scans: number;
  created_at: string;
  updated_at: string;
  owner_id?: string | null;
}

export interface SaveQRCodeParams {
  name: string;
  url: string;
  qrImagePng: string;
  qrImageSvg: string;
  qrImageJpeg: string;
  customization: QRCustomization;
  campaignName?: string;
  folderId?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export interface StudioPageLink {
  id: string;
  qr_code_id: string;
  studio_page_id: string;
  created_at: string;
  updated_at: string;
}

/**
 * Save or update a QR code
 */
// Helper function to validate UUID format
function isValidUUID(str: string | null): boolean {
  if (!str) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

export async function saveQRCode(
  qrCodeId: string | null,
  params: SaveQRCodeParams
): Promise<QRCode> {
  // Attach current authenticated user as owner if available
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const qrData = {
    name: params.name,
    url: params.url,
    qr_image_png: params.qrImagePng,
    qr_image_svg: params.qrImageSvg,
    qr_image_jpeg: params.qrImageJpeg,
    customization: params.customization,
    campaign_name: params.campaignName || null,
    folder_id: params.folderId || null,
    utm_source: params.utmSource || null,
    utm_medium: params.utmMedium || null,
    utm_campaign: params.utmCampaign || null,
    error_correction_level: params.customization.errorCorrectionLevel || 'M',
    size: params.customization.size || 256,
    margin: params.customization.margin || 4,
    owner_id: user?.id || null,
  };

  if (qrCodeId && isValidUUID(qrCodeId)) {
    // Check if record exists first to decide update vs insert with specific ID (rare edge case of pre-generating ID)
    // Actually, simply: try update, if not found, insert?
    // Current logic assumes if valid UUID, it's an update.
    // We want to support: "New QR with Specific ID".
    // Let's rely on standard flow: if it exists, update. If we generated a new UUID client-side, it won't exist, so we should insert it.

    // We'll modify the logic: Check existence? Or catch error?
    // Easier: If 'qrCodeId' is provided but we "treat as new" (client gen), we need to insert.
    // The previous logic was: if valid UUID -> allow update.
    // Issue: Creating NEW with specific ID.
    // Solution: We'll just try to upsert or check existence.
    // But to minimize risk, let's just add 'id' to result.

    // BETTER: The component calling this knows if it's NEW or EXISTING.
    // We should trust the caller?

    // Let's assume if it exists in DB, update.
    const { count } = await supabase.from('qr_codes').select('id', { count: 'exact', head: true }).eq('id', qrCodeId);

    if (count && count > 0) {
      // Update existing
      const { data, error } = await supabase
        .from('qr_codes')
        .update(qrData)
        .eq('id', qrCodeId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Insert with specific ID
      const { data, error } = await supabase
        .from('qr_codes')
        .insert({ ...qrData, id: qrCodeId })
        .select()
        .single();

      if (error) throw error;
      return data;
    }

  } else {
    // Create new QR code (auto ID)
    const { data, error } = await supabase
      .from('qr_codes')
      .insert(qrData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

/**
 * Update only the destination URL and name (Dynamic QR update)
 */
export async function updateQRCodeUrl(
  qrCodeId: string,
  url: string,
  name: string
): Promise<QRCode> {
  const { data, error } = await supabase
    .from('qr_codes')
    .update({
      url,
      name,
      updated_at: new Date().toISOString()
    })
    .eq('id', qrCodeId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Load a QR code by ID
 */
export async function loadQRCodeById(qrCodeId: string): Promise<QRCode | null> {
  const { data, error } = await supabase
    .from('qr_codes')
    .select('*')
    .eq('id', qrCodeId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw error;
  }
  return data;
}

/**
 * Link a QR code to a studio page
 */
export async function linkQRCodeToPage(
  qrCodeId: string,
  studioPageId: string
): Promise<StudioPageLink> {
  // Check if a link already exists for this page
  const { data: existingLink } = await supabase
    .from('studio_page_links')
    .select('*')
    .eq('studio_page_id', studioPageId)
    .maybeSingle();

  if (existingLink) {
    // Update existing link
    const { data, error } = await supabase
      .from('studio_page_links')
      .update({ qr_code_id: qrCodeId })
      .eq('id', existingLink.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    // Create new link
    const { data, error } = await supabase
      .from('studio_page_links')
      .insert({
        qr_code_id: qrCodeId,
        studio_page_id: studioPageId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

/**
 * Get the QR code linked to a studio page
 */
export async function getQRCodeByPageId(studioPageId: string): Promise<QRCode | null> {
  const { data: link, error: linkError } = await supabase
    .from('studio_page_links')
    .select('qr_code_id')
    .eq('studio_page_id', studioPageId)
    .maybeSingle();

  if (linkError) {
    if (linkError.code === 'PGRST116') {
      return null;
    }
    throw linkError;
  }

  if (!link) {
    return null;
  }

  // Load the QR code
  return loadQRCodeById(link.qr_code_id);
}

/**
 * Get the studio page linked to a QR code
 */
export async function getPageByQRCodeId(qrCodeId: string): Promise<{ studio_page_id: string } | null> {
  const { data, error } = await supabase
    .from('studio_page_links')
    .select('studio_page_id')
    .eq('qr_code_id', qrCodeId)
    .maybeSingle();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw error;
  }
  return data;
}

/**
 * Increment QR code scan count
 */
export async function incrementQRCodeScans(qrCodeId: string): Promise<void> {
  // Use the database function to increment scans atomically
  const { error } = await supabase.rpc('increment_qr_code_scans', { qr_id: qrCodeId });

  if (error) {
    console.error('Error incrementing QR code scans:', error);
    // Don't throw - we don't want to break the redirect if scan increment fails
  }
}

/**
 * Get all QR codes (for reuse selection)
 */
export async function getAllQRCodes(): Promise<QRCode[]> {
  const { data, error } = await supabase
    .from('qr_codes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Get all QR codes that belong to the currently authenticated user/brand.
 */
export async function getCurrentUserQRCodes(): Promise<QRCode[]> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) return [];

  const { data, error } = await supabase
    .from('qr_codes')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function deleteQRCode(qrCodeId: string): Promise<void> {
  const { error: linkError } = await supabase
    .from('studio_page_links')
    .delete()
    .eq('qr_code_id', qrCodeId);

  if (linkError) throw linkError;

  const { error } = await supabase
    .from('qr_codes')
    .delete()
    .eq('id', qrCodeId);

  if (error) throw error;
}
