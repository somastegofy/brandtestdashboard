import type { QRCustomization } from '../components/studio/QRGenerator';

export type QrCustomization = QRCustomization;

export interface QrCode {
  id: string;
  name: string;
  type: 'Product QR' | 'Studio Page QR' | 'Custom QR';
  linkedTo: string;
  linkedId?: string;
  status: 'Linked to Custom Page' | 'Using Default View';
  dateCreated: string;
  lastUpdated: string;
  totalScans: number;
  customization: QrCustomization;
  url: string;
  previewImage: string;
}

export interface QrTemplate {
  id: string;
  name: string;
  preview: string;
  customization: Partial<QrCustomization>;
}

export interface StudioPage {
  id: string;
  title: string;
  type: 'Landing Page' | 'Product Page' | 'Brand Story';
  url: string;
  status: 'Published' | 'Draft';
  createdAt: string;
}

export interface QrSettings {
  defaultStyle: string;
  defaultCtaText: string;
  defaultCtaPlacement: 'top' | 'bottom' | 'left' | 'right';
  defaultLogo?: string;
  downloadSizePresets: {
    small: number;
    medium: number;
    large: number;
    custom: number;
  };
  autoGenerate: boolean;
  defaultErrorCorrection: 'L' | 'M' | 'Q' | 'H';
}