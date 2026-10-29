import {
  PayloadValidationResult,
  QrCategory,
  QrFormData,
} from '../types/qr';

export const DEFAULT_FORM_DATA: QrFormData = {
  websiteUrl: 'https://example.com',
  youtubeUrl: '',
  whatsappCountryCode: '+92',
  whatsappPhone: '',
  whatsappMessage: 'Hello! I scanned your QR code and would like to connect.',
  wifiSsid: '',
  wifiPassword: '',
  wifiEncryption: 'WPA',
  wifiHidden: false,
  plainText: '',
  emailAddress: '',
  emailSubject: 'Inquiry via QR Code',
  emailBody: '',
  phoneNumber: '',
  vcardFirstName: '',
  vcardLastName: '',
  vcardOrg: '',
  vcardTitle: '',
  vcardPhone: '',
  vcardEmail: '',
  vcardWebsite: '',
  vcardAddress: '',
  instagramHandle: '',
  facebookPage: '',
  mapsMode: 'query',
  mapsQuery: '',
  mapsLat: '',
  mapsLng: '',
};

export const SAMPLE_FORM_DATA: QrFormData = {
  websiteUrl: 'https://developer.mozilla.org',
  youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  whatsappCountryCode: '+92',
  whatsappPhone: '3001234567',
  whatsappMessage: 'Assalam-o-Alaikum! I found your contact via QR code.',
  wifiSsid: 'Studio_Guest_5G',
  wifiPassword: 'WelcomeGuest2026!',
  wifiEncryption: 'WPA',
  wifiHidden: false,
  plainText: 'Thank you for visiting! Present this code at the counter for 15% off your next order.',
  emailAddress: 'hello@qrcraft.studio',
  emailSubject: 'Project Inquiry',
  emailBody: 'Hi team, I scanned your QR card and would like to discuss a project.',
  phoneNumber: '+923001234567',
  vcardFirstName: 'Faraz',
  vcardLastName: 'Abbasi',
  vcardOrg: 'QRCraft Design Studio',
  vcardTitle: 'Product Lead',
  vcardPhone: '+923001234567',
  vcardEmail: 'faraz@qrcraft.studio',
  vcardWebsite: 'https://qrcraft.studio',
  vcardAddress: ' Gulberg III, Lahore, Pakistan',
  instagramHandle: '@natgeo',
  facebookPage: 'https://www.facebook.com/nasa',
  mapsMode: 'query',
  mapsQuery: 'Badshahi Mosque, Lahore, Pakistan',
  mapsLat: '31.5880',
  mapsLng: '74.3107',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidHttpUrl(raw: string): { valid: boolean; normalized: string; error?: string } {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { valid: false, normalized: '', error: 'Please enter a website URL.' };
  }

  // Catch malformed schemes like htp:// or :// or spaces inside URL
  if (/\s/.test(trimmed)) {
    return { valid: false, normalized: trimmed, error: 'URL cannot contain spaces. Check the address format.' };
  }

  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(trimmed) && !/^https?:\/\//i.test(trimmed)) {
    return {
      valid: false,
      normalized: trimmed,
      error: 'Only http:// and https:// website links are supported.',
    };
  }

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const parsed = new URL(withProtocol);
    const host = parsed.hostname;
    // Ensure valid domain with TLD or localhost / IPv4
    const isLocal = host === 'localhost';
    const isIpv4 = /^(\d{1,3}\.){3}\d{1,3}$/.test(host);
    const hasValidDomain = /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/.test(host) && host.split('.').pop()!.length >= 2;

    if (!isLocal && !isIpv4 && !hasValidDomain) {
      return {
        valid: false,
        normalized: withProtocol,
        error: 'Enter a valid domain name (for example, https://yourwebsite.com).',
      };
    }

    return { valid: true, normalized: parsed.toString() };
  } catch {
    return {
      valid: false,
      normalized: trimmed,
      error: 'Invalid URL format. Example: https://yourwebsite.com',
    };
  }
}

function escapeWifiField(val: string): string {
  return val.replace(/([\\;,:"])/g, '\\$1');
}

function escapeVCardField(val: string): string {
  return val.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
}

export function buildAndValidateQrPayload(
  category: QrCategory,
  data: QrFormData
): PayloadValidationResult {
  const fieldErrors: Partial<Record<keyof QrFormData, string>> = {};

  switch (category) {
    case QrCategory.Website: {
      const raw = data.websiteUrl.trim();
      if (!raw) {
        fieldErrors.websiteUrl = 'Website URL is required to generate a QR code.';
        return {
          isValid: false,
          isEmpty: true,
          payload: '',
          errorMessage: fieldErrors.websiteUrl,
          fieldErrors,
          summaryLabel: 'Website URL',
        };
      }
      const check = isValidHttpUrl(raw);
      if (!check.valid) {
        fieldErrors.websiteUrl = check.error || 'Enter a valid website URL.';
        return {
          isValid: false,
          isEmpty: false,
          payload: '',
          errorMessage: fieldErrors.websiteUrl,
          fieldErrors,
          summaryLabel: 'Invalid URL',
        };
      }
      return {
        isValid: true,
        isEmpty: false,
        payload: check.normalized,
        errorMessage: null,
        fieldErrors,
        summaryLabel: check.normalized,
      };
    }

    case QrCategory.YouTube: {
      const raw = data.youtubeUrl.trim();
      if (!raw) {
        fieldErrors.youtubeUrl = 'Enter a YouTube video link, Shorts URL, or channel handle.';
        return {
          isValid: false,
          isEmpty: true,
          payload: '',
          errorMessage: fieldErrors.youtubeUrl,
          fieldErrors,
          summaryLabel: 'YouTube Video',
        };
      }

      // Allow 11-char video ID directly
      if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) {
        const url = `https://www.youtube.com/watch?v=${raw}`;
        return {
          isValid: true,
          isEmpty: false,
          payload: url,
          errorMessage: null,
          fieldErrors,
          summaryLabel: url,
        };
      }

      // Allow @channel handle
      if (/^@[a-zA-Z0-9_.-]{2,40}$/.test(raw)) {
        const url = `https://www.youtube.com/${raw}`;
        return {
          isValid: true,
          isEmpty: false,
          payload: url,
          errorMessage: null,
          fieldErrors,
          summaryLabel: url,
        };
      }

      const check = isValidHttpUrl(raw);
      if (!check.valid) {
        fieldErrors.youtubeUrl = 'Enter a valid YouTube URL (e.g., https://youtube.com/watch?v=...).';
        return {
          isValid: false,
          isEmpty: false,
          payload: '',
          errorMessage: fieldErrors.youtubeUrl,
          fieldErrors,
          summaryLabel: 'Invalid YouTube URL',
        };
      }

      const parsed = new URL(check.normalized);
      const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
      const isYoutubeHost =
        host === 'youtube.com' ||
        host === 'm.youtube.com' ||
        host === 'music.youtube.com' ||
        host === 'youtu.be';

      if (!isYoutubeHost) {
        fieldErrors.youtubeUrl = 'URL must be a YouTube link (youtube.com or youtu.be).';
        return {
          isValid: false,
          isEmpty: false,
          payload: '',
          errorMessage: fieldErrors.youtubeUrl,
          fieldErrors,
          summaryLabel: 'Invalid YouTube Domain',
        };
      }

      return {
        isValid: true,
        isEmpty: false,
        payload: check.normalized,
        errorMessage: null,
        fieldErrors,
        summaryLabel: check.normalized,
      };
    }

    case QrCategory.WhatsApp: {
      const codeDigits = data.whatsappCountryCode.replace(/\D/g, '');
      const phoneDigits = data.whatsappPhone.replace(/\D/g, '').replace(/^0+/, '');
      if (!phoneDigits) {
        fieldErrors.whatsappPhone = 'Enter a WhatsApp phone number to generate chat link.';
        return {
          isValid: false,
          isEmpty: true,
          payload: '',
          errorMessage: fieldErrors.whatsappPhone,
          fieldErrors,
          summaryLabel: 'WhatsApp Chat',
        };
      }

      const fullDigits = `${codeDigits}${phoneDigits}`;
      if (fullDigits.length < 8 || fullDigits.length > 15) {
        fieldErrors.whatsappPhone = 'Enter a valid phone number (8 to 15 digits with country code).';
        return {
          isValid: false,
          isEmpty: false,
          payload: '',
          errorMessage: fieldErrors.whatsappPhone,
          fieldErrors,
          summaryLabel: 'Invalid Phone',
        };
      }

      const msg = data.whatsappMessage.trim();
      const query = msg ? `?text=${encodeURIComponent(msg)}` : '';
      const payload = `https://wa.me/${fullDigits}${query}`;
      return {
        isValid: true,
        isEmpty: false,
        payload,
        errorMessage: null,
        fieldErrors,
        summaryLabel: `wa.me/+${fullDigits}`,
      };
    }

    case QrCategory.WiFi: {
      const ssid = data.wifiSsid.trim();
      if (!ssid) {
        fieldErrors.wifiSsid = 'Enter your Wi-Fi network name (SSID).';
        return {
          isValid: false,
          isEmpty: true,
          payload: '',
          errorMessage: fieldErrors.wifiSsid,
          fieldErrors,
          summaryLabel: 'Wi-Fi Network',
        };
      }

      if (data.wifiEncryption !== 'nopass' && !data.wifiPassword) {
        fieldErrors.wifiPassword = 'Enter the Wi-Fi password, or choose "None (Open)" encryption.';
        return {
          isValid: false,
          isEmpty: false,
          payload: '',
          errorMessage: fieldErrors.wifiPassword,
          fieldErrors,
          summaryLabel: `Wi-Fi: ${ssid}`,
        };
      }

      if (data.wifiEncryption === 'WPA' && data.wifiPassword.length > 0 && data.wifiPassword.length < 8) {
        fieldErrors.wifiPassword = 'WPA/WPA2 passwords must be at least 8 characters long.';
        return {
          isValid: false,
          isEmpty: false,
          payload: '',
          errorMessage: fieldErrors.wifiPassword,
          fieldErrors,
          summaryLabel: `Wi-Fi: ${ssid}`,
        };
      }

      const enc = data.wifiEncryption;
      const passPart = enc === 'nopass' ? '' : `P:${escapeWifiField(data.wifiPassword)};`;
      const hiddenPart = data.wifiHidden ? 'H:true;' : '';
      const payload = `WIFI:T:${enc};S:${escapeWifiField(ssid)};${passPart}${hiddenPart};`;
      return {
        isValid: true,
        isEmpty: false,
        payload,
        errorMessage: null,
        fieldErrors,
        summaryLabel: `Wi-Fi · ${ssid}`,
      };
    }

    case QrCategory.Text: {
      const text = data.plainText.trim();
      if (!text) {
        fieldErrors.plainText = 'Enter text content to encode inside your QR code.';
        return {
          isValid: false,
          isEmpty: true,
          payload: '',
          errorMessage: fieldErrors.plainText,
          fieldErrors,
          summaryLabel: 'Plain Text',
        };
      }
      if (text.length > 1500) {
        fieldErrors.plainText = 'Keep text under 1,500 characters for reliable camera scanning.';
        return {
          isValid: false,
          isEmpty: false,
          payload: '',
          errorMessage: fieldErrors.plainText,
          fieldErrors,
          summaryLabel: 'Text too long',
        };
      }
      return {
        isValid: true,
        isEmpty: false,
        payload: text,
        errorMessage: null,
        fieldErrors,
        summaryLabel: text.length > 42 ? `${text.slice(0, 42)}...` : text,
      };
    }

    case QrCategory.Email: {
      const email = data.emailAddress.trim();
      if (!email) {
        fieldErrors.emailAddress = 'Enter a recipient email address.';
        return {
          isValid: false,
          isEmpty: true,
          payload: '',
          errorMessage: fieldErrors.emailAddress,
          fieldErrors,
          summaryLabel: 'Email Address',
        };
      }
      if (!EMAIL_REGEX.test(email)) {
        fieldErrors.emailAddress = 'Enter a valid email address (for example, name@company.com).';
        return {
          isValid: false,
          isEmpty: false,
          payload: '',
          errorMessage: fieldErrors.emailAddress,
          fieldErrors,
          summaryLabel: 'Invalid Email',
        };
      }

      const params: string[] = [];
      if (data.emailSubject.trim()) {
        params.push(`subject=${encodeURIComponent(data.emailSubject.trim())}`);
      }
      if (data.emailBody.trim()) {
        params.push(`body=${encodeURIComponent(data.emailBody.trim())}`);
      }
      const query = params.length > 0 ? `?${params.join('&')}` : '';
      const payload = `mailto:${email}${query}`;
      return {
        isValid: true,
        isEmpty: false,
        payload,
        errorMessage: null,
        fieldErrors,
        summaryLabel: email,
      };
    }

    case QrCategory.Phone: {
      const raw = data.phoneNumber.trim();
      if (!raw) {
        fieldErrors.phoneNumber = 'Enter a phone number to create a direct-call QR code.';
        return {
          isValid: false,
          isEmpty: true,
          payload: '',
          errorMessage: fieldErrors.phoneNumber,
          fieldErrors,
          summaryLabel: 'Phone Call',
        };
      }
      const cleaned = raw.replace(/[^\d+]/g, '');
      const digitsOnly = cleaned.replace(/\D/g, '');
      if (digitsOnly.length < 7 || digitsOnly.length > 15) {
        fieldErrors.phoneNumber = 'Enter a valid phone number between 7 and 15 digits.';
        return {
          isValid: false,
          isEmpty: false,
          payload: '',
          errorMessage: fieldErrors.phoneNumber,
          fieldErrors,
          summaryLabel: 'Invalid Phone',
        };
      }
      const normalized = cleaned.startsWith('+') ? cleaned : `+${digitsOnly}`;
      return {
        isValid: true,
        isEmpty: false,
        payload: `tel:${normalized}`,
        errorMessage: null,
        fieldErrors,
        summaryLabel: normalized,
      };
    }

    case QrCategory.VCard: {
      const first = data.vcardFirstName.trim();
      const last = data.vcardLastName.trim();
      const phone = data.vcardPhone.trim();
      const email = data.vcardEmail.trim();
      const website = data.vcardWebsite.trim();

      if (!first && !last) {
        fieldErrors.vcardFirstName = 'Enter at least a first name for the contact card.';
        return {
          isValid: false,
          isEmpty: !phone && !email && !data.vcardOrg.trim(),
          payload: '',
          errorMessage: fieldErrors.vcardFirstName,
          fieldErrors,
          summaryLabel: 'Contact vCard',
        };
      }

      if (!phone && !email) {
        fieldErrors.vcardPhone = 'Provide at least a phone number or email address for the contact.';
        return {
          isValid: false,
          isEmpty: false,
          payload: '',
          errorMessage: fieldErrors.vcardPhone,
          fieldErrors,
          summaryLabel: 'Incomplete vCard',
        };
      }

      if (email && !EMAIL_REGEX.test(email)) {
        fieldErrors.vcardEmail = 'Enter a valid contact email address.';
        return {
          isValid: false,
          isEmpty: false,
          payload: '',
          errorMessage: fieldErrors.vcardEmail,
          fieldErrors,
          summaryLabel: 'Invalid vCard Email',
        };
      }

      let normalizedWeb = '';
      if (website) {
        const webCheck = isValidHttpUrl(website);
        if (!webCheck.valid) {
          fieldErrors.vcardWebsite = 'Enter a valid website URL or leave blank.';
          return {
            isValid: false,
            isEmpty: false,
            payload: '',
            errorMessage: fieldErrors.vcardWebsite,
            fieldErrors,
            summaryLabel: 'Invalid vCard URL',
          };
        }
        normalizedWeb = webCheck.normalized;
      }

      const fullName = [first, last].filter(Boolean).join(' ');
      const lines = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${escapeVCardField(last)};${escapeVCardField(first)};;;`,
        `FN:${escapeVCardField(fullName)}`,
      ];
      if (data.vcardOrg.trim()) lines.push(`ORG:${escapeVCardField(data.vcardOrg.trim())}`);
      if (data.vcardTitle.trim()) lines.push(`TITLE:${escapeVCardField(data.vcardTitle.trim())}`);
      if (phone) lines.push(`TEL;TYPE=CELL:${phone.replace(/[^\d+]/g, '')}`);
      if (email) lines.push(`EMAIL;TYPE=INTERNET:${email}`);
      if (normalizedWeb) lines.push(`URL:${normalizedWeb}`);
      if (data.vcardAddress.trim()) {
        lines.push(`ADR;TYPE=WORK:;;${escapeVCardField(data.vcardAddress.trim())};;;;`);
      }
      lines.push('END:VCARD');

      return {
        isValid: true,
        isEmpty: false,
        payload: lines.join('\n'),
        errorMessage: null,
        fieldErrors,
        summaryLabel: `vCard · ${fullName}`,
      };
    }

    case QrCategory.Instagram: {
      const raw = data.instagramHandle.trim();
      if (!raw) {
        fieldErrors.instagramHandle = 'Enter an Instagram @username or profile URL.';
        return {
          isValid: false,
          isEmpty: true,
          payload: '',
          errorMessage: fieldErrors.instagramHandle,
          fieldErrors,
          summaryLabel: 'Instagram Profile',
        };
      }

      // Check if user pasted full URL
      if (raw.includes('/') || raw.startsWith('http')) {
        const check = isValidHttpUrl(raw);
        if (!check.valid) {
          fieldErrors.instagramHandle = 'Enter a valid Instagram URL or @username.';
          return {
            isValid: false,
            isEmpty: false,
            payload: '',
            errorMessage: fieldErrors.instagramHandle,
            fieldErrors,
            summaryLabel: 'Invalid Instagram URL',
          };
        }
        const host = new URL(check.normalized).hostname.toLowerCase().replace(/^www\./, '');
        if (host !== 'instagram.com' && host !== 'instagr.am') {
          fieldErrors.instagramHandle = 'URL must point to instagram.com.';
          return {
            isValid: false,
            isEmpty: false,
            payload: '',
            errorMessage: fieldErrors.instagramHandle,
            fieldErrors,
            summaryLabel: 'Invalid Instagram URL',
          };
        }
        return {
          isValid: true,
          isEmpty: false,
          payload: check.normalized,
          errorMessage: null,
          fieldErrors,
          summaryLabel: check.normalized,
        };
      }

      const cleanHandle = raw.replace(/^@/, '');
      if (!/^[a-zA-Z0-9._]{1,30}$/.test(cleanHandle)) {
        fieldErrors.instagramHandle = 'Instagram usernames can only contain letters, numbers, periods, and underscores.';
        return {
          isValid: false,
          isEmpty: false,
          payload: '',
          errorMessage: fieldErrors.instagramHandle,
          fieldErrors,
          summaryLabel: 'Invalid Username',
        };
      }

      const url = `https://www.instagram.com/${cleanHandle}/`;
      return {
        isValid: true,
        isEmpty: false,
        payload: url,
        errorMessage: null,
        fieldErrors,
        summaryLabel: `@${cleanHandle}`,
      };
    }

    case QrCategory.Facebook: {
      const raw = data.facebookPage.trim();
      if (!raw) {
        fieldErrors.facebookPage = 'Enter a Facebook page URL or username.';
        return {
          isValid: false,
          isEmpty: true,
          payload: '',
          errorMessage: fieldErrors.facebookPage,
          fieldErrors,
          summaryLabel: 'Facebook Page',
        };
      }

      if (raw.includes('/') || raw.includes('.') || raw.startsWith('http')) {
        const check = isValidHttpUrl(raw);
        if (!check.valid) {
          fieldErrors.facebookPage = 'Enter a valid Facebook URL (e.g., https://facebook.com/yourpage).';
          return {
            isValid: false,
            isEmpty: false,
            payload: '',
            errorMessage: fieldErrors.facebookPage,
            fieldErrors,
            summaryLabel: 'Invalid Facebook URL',
          };
        }
        const host = new URL(check.normalized).hostname.toLowerCase().replace(/^(www\.|m\.|web\.)/, '');
        if (host !== 'facebook.com' && host !== 'fb.com' && host !== 'fb.me') {
          fieldErrors.facebookPage = 'URL must be a valid facebook.com or fb.com address.';
          return {
            isValid: false,
            isEmpty: false,
            payload: '',
            errorMessage: fieldErrors.facebookPage,
            fieldErrors,
            summaryLabel: 'Invalid Facebook Domain',
          };
        }
        return {
          isValid: true,
          isEmpty: false,
          payload: check.normalized,
          errorMessage: null,
          fieldErrors,
          summaryLabel: check.normalized,
        };
      }

      const cleanPage = raw.replace(/^@/, '');
      if (!/^[a-zA-Z0-9.]{2,60}$/.test(cleanPage)) {
        fieldErrors.facebookPage = 'Enter a valid Facebook page handle or full URL.';
        return {
          isValid: false,
          isEmpty: false,
          payload: '',
          errorMessage: fieldErrors.facebookPage,
          fieldErrors,
          summaryLabel: 'Invalid Page Handle',
        };
      }

      const url = `https://www.facebook.com/${cleanPage}`;
      return {
        isValid: true,
        isEmpty: false,
        payload: url,
        errorMessage: null,
        fieldErrors,
        summaryLabel: `facebook.com/${cleanPage}`,
      };
    }

    case QrCategory.Maps: {
      if (data.mapsMode === 'coordinates') {
        const latStr = data.mapsLat.trim();
        const lngStr = data.mapsLng.trim();
        if (!latStr || !lngStr) {
          fieldErrors.mapsLat = 'Enter both latitude and longitude coordinates.';
          return {
            isValid: false,
            isEmpty: !latStr && !lngStr,
            payload: '',
            errorMessage: fieldErrors.mapsLat,
            fieldErrors,
            summaryLabel: 'Google Maps Coordinates',
          };
        }
        const lat = Number(latStr);
        const lng = Number(lngStr);
        if (Number.isNaN(lat) || lat < -90 || lat > 90) {
          fieldErrors.mapsLat = 'Latitude must be a number between -90 and 90.';
          return {
            isValid: false,
            isEmpty: false,
            payload: '',
            errorMessage: fieldErrors.mapsLat,
            fieldErrors,
            summaryLabel: 'Invalid Latitude',
          };
        }
        if (Number.isNaN(lng) || lng < -180 || lng > 180) {
          fieldErrors.mapsLng = 'Longitude must be a number between -180 and 180.';
          return {
            isValid: false,
            isEmpty: false,
            payload: '',
            errorMessage: fieldErrors.mapsLng,
            fieldErrors,
            summaryLabel: 'Invalid Longitude',
          };
        }
        const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        return {
          isValid: true,
          isEmpty: false,
          payload: url,
          errorMessage: null,
          fieldErrors,
          summaryLabel: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        };
      }

      const query = data.mapsQuery.trim();
      if (!query) {
        fieldErrors.mapsQuery = 'Enter a place name, street address, or Google Maps share link.';
        return {
          isValid: false,
          isEmpty: true,
          payload: '',
          errorMessage: fieldErrors.mapsQuery,
          fieldErrors,
          summaryLabel: 'Google Maps Location',
        };
      }

      if (/^https?:\/\//i.test(query) || query.startsWith('maps.app.goo.gl') || query.startsWith('goo.gl/maps')) {
        const check = isValidHttpUrl(query);
        if (!check.valid) {
          fieldErrors.mapsQuery = 'Enter a valid Google Maps link or plain street address.';
          return {
            isValid: false,
            isEmpty: false,
            payload: '',
            errorMessage: fieldErrors.mapsQuery,
            fieldErrors,
            summaryLabel: 'Invalid Maps Link',
          };
        }
        return {
          isValid: true,
          isEmpty: false,
          payload: check.normalized,
          errorMessage: null,
          fieldErrors,
          summaryLabel: 'Google Maps Link',
        };
      }

      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
      return {
        isValid: true,
        isEmpty: false,
        payload: url,
        errorMessage: null,
        fieldErrors,
        summaryLabel: query,
      };
    }
  }
}

// Calculate WCAG relative luminance and contrast ratio so users never create unscannable color combos
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '').trim();
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

function getRelativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex) || { r: 0, g: 0, b: 0 };
  const [rs, gs, bs] = [rgb.r / 255, rgb.g / 255, rgb.b / 255].map((c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function evaluateQrContrast(fgHex: string, bgHex: string): {
  ratio: number;
  isInverted: boolean;
  isLowContrast: boolean;
} {
  const lFg = getRelativeLuminance(fgHex);
  const lBg = getRelativeLuminance(bgHex);
  const lighter = Math.max(lFg, lBg);
  const darker = Math.min(lFg, lBg);
  const ratio = (lighter + 0.05) / (darker + 0.05);
  return {
    ratio,
    isInverted: lFg > lBg,
    isLowContrast: ratio < 3.5,
  };
}

export interface PresetLogoItem {
  id: string;
  label: string;
  dataUrl: string;
}

function makeSvgDataUrl(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const PRESET_LOGOS: PresetLogoItem[] = [
  {
    id: 'globe',
    label: 'Web',
    dataUrl: makeSvgDataUrl(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#4F46E5"/><circle cx="32" cy="32" r="18" fill="none" stroke="#FFFFFF" stroke-width="3.5"/><ellipse cx="32" cy="32" rx="8" ry="18" fill="none" stroke="#FFFFFF" stroke-width="3"/><line x1="14" y1="32" x2="50" y2="32" stroke="#FFFFFF" stroke-width="3"/></svg>`
    ),
  },
  {
    id: 'youtube',
    label: 'Video',
    dataUrl: makeSvgDataUrl(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#DC2626"/><polygon points="26,20 26,44 46,32" fill="#FFFFFF"/></svg>`
    ),
  },
  {
    id: 'whatsapp',
    label: 'Chat',
    dataUrl: makeSvgDataUrl(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#16A34A"/><path d="M32 15c-9.4 0-17 7.2-17 16.2 0 3.2 1 6.2 2.7 8.7L15.5 49l9.6-2.4c2.1 1 4.4 1.6 6.9 1.6 9.4 0 17-7.2 17-16.2S41.4 15 32 15z" fill="none" stroke="#FFFFFF" stroke-width="3.5" stroke-linejoin="round"/><circle cx="27" cy="31" r="2" fill="#FFFFFF"/><circle cx="32" cy="31" r="2" fill="#FFFFFF"/><circle cx="37" cy="31" r="2" fill="#FFFFFF"/></svg>`
    ),
  },
  {
    id: 'wifi',
    label: 'Wi-Fi',
    dataUrl: makeSvgDataUrl(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0284C7"/><path d="M14 26c10-9 26-9 36 0M20 34c6.6-6 17.4-6 24 0" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/><circle cx="32" cy="43" r="3.5" fill="#FFFFFF"/></svg>`
    ),
  },
  {
    id: 'instagram',
    label: 'Social',
    dataUrl: makeSvgDataUrl(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#9333EA"/><rect x="16" y="16" width="32" height="32" rx="9" fill="none" stroke="#FFFFFF" stroke-width="3.5"/><circle cx="32" cy="32" r="7.5" fill="none" stroke="#FFFFFF" stroke-width="3.5"/><circle cx="41.5" cy="22.5" r="2" fill="#FFFFFF"/></svg>`
    ),
  },
  {
    id: 'maps',
    label: 'Pin',
    dataUrl: makeSvgDataUrl(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#EA580C"/><path d="M32 14c-7.7 0-14 6.1-14 13.6C18 37.8 32 50 32 50s14-12.2 14-22.4C46 20.1 39.7 14 32 14z" fill="none" stroke="#FFFFFF" stroke-width="3.5" stroke-linejoin="round"/><circle cx="32" cy="27.5" r="4.5" fill="#FFFFFF"/></svg>`
    ),
  },
  {
    id: 'vcard',
    label: 'Contact',
    dataUrl: makeSvgDataUrl(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0F172A"/><circle cx="32" cy="25" r="7" fill="none" stroke="#FFFFFF" stroke-width="3.5"/><path d="M18 46c2.5-6.5 7.5-10 14-10s11.5 3.5 14 10" fill="none" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round"/></svg>`
    ),
  },
  {
    id: 'mail',
    label: 'Email',
    dataUrl: makeSvgDataUrl(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#2563EB"/><rect x="14" y="20" width="36" height="24" rx="4" fill="none" stroke="#FFFFFF" stroke-width="3.5"/><path d="M16 22l16 12 16-12" fill="none" stroke="#FFFFFF" stroke-width="3.5" stroke-linejoin="round"/></svg>`
    ),
  },
];
