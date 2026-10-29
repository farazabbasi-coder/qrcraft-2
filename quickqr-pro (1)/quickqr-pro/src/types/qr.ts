export enum QrCategory {
  Website = 'website',
  YouTube = 'youtube',
  WhatsApp = 'whatsapp',
  WiFi = 'wifi',
  Text = 'text',
  Email = 'email',
  Phone = 'phone',
  VCard = 'vcard',
  Instagram = 'instagram',
  Facebook = 'facebook',
  Maps = 'maps',
}

export type BodyPattern = 'square' | 'rounded' | 'dots' | 'diamond' | 'classy';
export type EyePattern = 'square' | 'rounded' | 'circle' | 'leaf';
export type ErrorCorrection = 'L' | 'M' | 'Q' | 'H';
export type WifiEncryption = 'WPA' | 'WEP' | 'nopass';
export type MapsInputMode = 'query' | 'coordinates';
export type LogoPadShape = 'rounded' | 'circle';

export interface QrFormData {
  websiteUrl: string;
  youtubeUrl: string;
  whatsappCountryCode: string;
  whatsappPhone: string;
  whatsappMessage: string;
  wifiSsid: string;
  wifiPassword: string;
  wifiEncryption: WifiEncryption;
  wifiHidden: boolean;
  plainText: string;
  emailAddress: string;
  emailSubject: string;
  emailBody: string;
  phoneNumber: string;
  vcardFirstName: string;
  vcardLastName: string;
  vcardOrg: string;
  vcardTitle: string;
  vcardPhone: string;
  vcardEmail: string;
  vcardWebsite: string;
  vcardAddress: string;
  instagramHandle: string;
  facebookPage: string;
  mapsMode: MapsInputMode;
  mapsQuery: string;
  mapsLat: string;
  mapsLng: string;
}

export interface QrStyleConfig {
  fgColor: string;
  bgColor: string;
  useCustomEyeColor: boolean;
  eyeColor: string;
  size: number;
  margin: number;
  bodyPattern: BodyPattern;
  eyePattern: EyePattern;
  errorCorrection: ErrorCorrection;
  logoDataUrl: string | null;
  logoScale: number; // 0.16 to 0.26
  logoPadShape: LogoPadShape;
}

export interface PayloadValidationResult {
  isValid: boolean;
  isEmpty: boolean;
  payload: string;
  errorMessage: string | null;
  fieldErrors: Partial<Record<keyof QrFormData, string>>;
  summaryLabel: string;
}

export interface SavedQrHistoryItem {
  id: string;
  category: QrCategory;
  label: string;
  payload: string;
  createdAt: string;
  style: QrStyleConfig;
  formData: QrFormData;
}
