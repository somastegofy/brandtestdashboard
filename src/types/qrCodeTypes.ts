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

export interface QrCustomization {
  template: string;
  shapes: {
    body: 'square' | 'circle' | 'rounded' | 'dots';
    eyeFrame: 'square' | 'circle' | 'rounded';
    eyeball: 'square' | 'circle' | 'rounded';
  };
  colors: {
    body: string;
    bodyGradient?: string;
    stroke: string;
    eyeOuter: string;
    eyeInner: string;
  };
  logo: {
    enabled: boolean;
    url?: string;
    scale: number;
    position: 'center' | 'corner';
    removePadding: boolean;
  };
  text: {
    enabled: boolean;
    content: string;
    font: string;
    size: number;
    color: string;
    position: 'top' | 'bottom' | 'left' | 'right';
  };
  stickers: {
    enabled: boolean;
    type: string;
    position: string;
  };
  advanced: {
    cornerPadding: number;
    effect3d: boolean;
    errorCorrection: 'L' | 'M' | 'Q' | 'H';
  };
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