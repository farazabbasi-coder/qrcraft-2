import React from 'react';
import { AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { PayloadValidationResult, QrCategory, QrFormData } from '../types/qr';

export interface CategoryMeta {
  id: QrCategory;
  label: string;
  shortLabel: string;
  quickPlaceholder: string;
  quickFieldLabel: string;
}

export const QR_CATEGORIES: CategoryMeta[] = [
  {
    id: QrCategory.Website,
    label: 'Website URL',
    shortLabel: 'Website',
    quickPlaceholder: 'https://yourwebsite.com',
    quickFieldLabel: 'Website URL',
  },
  {
    id: QrCategory.YouTube,
    label: 'YouTube Video',
    shortLabel: 'YouTube',
    quickPlaceholder: 'https://www.youtube.com/watch?v=...',
    quickFieldLabel: 'YouTube Video URL',
  },
  {
    id: QrCategory.WhatsApp,
    label: 'WhatsApp',
    shortLabel: 'WhatsApp',
    quickPlaceholder: '3001234567',
    quickFieldLabel: 'WhatsApp Number',
  },
  {
    id: QrCategory.WiFi,
    label: 'Wi-Fi Network',
    shortLabel: 'Wi-Fi',
    quickPlaceholder: 'Home_WiFi_5G',
    quickFieldLabel: 'Wi-Fi Network Name (SSID)',
  },
  {
    id: QrCategory.Text,
    label: 'Plain Text',
    shortLabel: 'Text',
    quickPlaceholder: 'Type any message or note...',
    quickFieldLabel: 'Text Content',
  },
  {
    id: QrCategory.Email,
    label: 'Email Address',
    shortLabel: 'Email',
    quickPlaceholder: 'hello@company.com',
    quickFieldLabel: 'Recipient Email',
  },
  {
    id: QrCategory.Phone,
    label: 'Phone Number',
    shortLabel: 'Phone',
    quickPlaceholder: '+923001234567',
    quickFieldLabel: 'Phone Number',
  },
  {
    id: QrCategory.VCard,
    label: 'Contact / vCard',
    shortLabel: 'vCard',
    quickPlaceholder: 'First Name (e.g. Faraz)',
    quickFieldLabel: 'Contact First Name',
  },
  {
    id: QrCategory.Instagram,
    label: 'Instagram Profile',
    shortLabel: 'Instagram',
    quickPlaceholder: '@yourusername',
    quickFieldLabel: 'Instagram Username or Link',
  },
  {
    id: QrCategory.Facebook,
    label: 'Facebook Page',
    shortLabel: 'Facebook',
    quickPlaceholder: 'https://facebook.com/yourpage',
    quickFieldLabel: 'Facebook Page URL or Handle',
  },
  {
    id: QrCategory.Maps,
    label: 'Google Maps',
    shortLabel: 'Google Maps',
    quickPlaceholder: 'Badshahi Mosque, Lahore or Maps link',
    quickFieldLabel: 'Location Search or Maps URL',
  },
];

interface HeroSectionProps {
  activeCategory: QrCategory;
  onSelectCategory: (cat: QrCategory) => void;
  formData: QrFormData;
  onChangeFormData: <K extends keyof QrFormData>(field: K, value: QrFormData[K]) => void;
  validation: PayloadValidationResult;
  showValidationErrors: boolean;
  onQuickGenerate: (e: React.FormEvent) => void;
  heroFeedback: string | null;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  activeCategory,
  onSelectCategory,
  formData,
  onChangeFormData,
  validation,
  showValidationErrors,
  onQuickGenerate,
  heroFeedback,
}) => {
  const currentMeta = QR_CATEGORIES.find((c) => c.id === activeCategory) || QR_CATEGORIES[0];

  const getQuickInputValue = (): string => {
    switch (activeCategory) {
      case QrCategory.Website:
        return formData.websiteUrl;
      case QrCategory.YouTube:
        return formData.youtubeUrl;
      case QrCategory.WhatsApp:
        return formData.whatsappPhone;
      case QrCategory.WiFi:
        return formData.wifiSsid;
      case QrCategory.Text:
        return formData.plainText;
      case QrCategory.Email:
        return formData.emailAddress;
      case QrCategory.Phone:
        return formData.phoneNumber;
      case QrCategory.VCard:
        return formData.vcardFirstName;
      case QrCategory.Instagram:
        return formData.instagramHandle;
      case QrCategory.Facebook:
        return formData.facebookPage;
      case QrCategory.Maps:
        return formData.mapsMode === 'coordinates' ? formData.mapsLat : formData.mapsQuery;
    }
  };

  const handleQuickInputChange = (val: string) => {
    switch (activeCategory) {
      case QrCategory.Website:
        onChangeFormData('websiteUrl', val);
        break;
      case QrCategory.YouTube:
        onChangeFormData('youtubeUrl', val);
        break;
      case QrCategory.WhatsApp:
        onChangeFormData('whatsappPhone', val);
        break;
      case QrCategory.WiFi:
        onChangeFormData('wifiSsid', val);
        break;
      case QrCategory.Text:
        onChangeFormData('plainText', val);
        break;
      case QrCategory.Email:
        onChangeFormData('emailAddress', val);
        break;
      case QrCategory.Phone:
        onChangeFormData('phoneNumber', val);
        break;
      case QrCategory.VCard:
        onChangeFormData('vcardFirstName', val);
        break;
      case QrCategory.Instagram:
        onChangeFormData('instagramHandle', val);
        break;
      case QrCategory.Facebook:
        onChangeFormData('facebookPage', val);
        break;
      case QrCategory.Maps:
        if (formData.mapsMode === 'coordinates') {
          onChangeFormData('mapsLat', val);
        } else {
          onChangeFormData('mapsQuery', val);
        }
        break;
    }
  };

  const hasVisibleError = showValidationErrors && !validation.isValid && validation.errorMessage;

  return (
    <section
      id="home"
      className="relative bg-gradient-to-b from-slate-50 via-white to-white pt-12 pb-10 sm:pt-16 sm:pb-12 border-b border-slate-200/70"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs font-medium text-slate-500 mb-3">
          <span>11 QR Formats</span>
          <span aria-hidden="true" className="mx-2">·</span>
          <span>PNG &amp; Vector SVG</span>
          <span aria-hidden="true" className="mx-2">·</span>
          <span>No Account or API Key Needed</span>
        </p>

        <h1
          className="font-display font-bold tracking-tight text-slate-900 mx-auto max-w-3xl"
          style={{ fontSize: 'clamp(2.25rem, 4.2vw, 3.6rem)', lineHeight: 1.12, textWrap: 'balance' }}
        >
          Free QR Code Generator
        </h1>

        <p
          className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed"
          style={{ textWrap: 'balance' }}
        >
          Create custom QR codes for websites, YouTube, WhatsApp, Wi-Fi and more — instantly and for free.
        </p>

        {/* Quick-Start Generator Bar */}
        <form
          onSubmit={onQuickGenerate}
          noValidate
          className="mt-8 max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-2.5 sm:p-3"
        >
          <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
            {/* QR Type Selector */}
            <div className="sm:w-52 shrink-0">
              <label htmlFor="hero-qr-type" className="sr-only">
                Select QR Code Type
              </label>
              <select
                id="hero-qr-type"
                value={activeCategory}
                onChange={(e) => onSelectCategory(e.target.value as QrCategory)}
                className="w-full h-12 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-800 hover:border-slate-300 focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 transition-colors cursor-pointer"
              >
                {QR_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Dynamic Primary Input */}
            <div className="flex-1 min-w-0">
              <label htmlFor="hero-quick-input" className="sr-only">
                {currentMeta.quickFieldLabel}
              </label>
              <input
                id="hero-quick-input"
                type="text"
                value={getQuickInputValue()}
                onChange={(e) => handleQuickInputChange(e.target.value)}
                placeholder={currentMeta.quickPlaceholder}
                aria-invalid={Boolean(hasVisibleError)}
                className={`w-full h-12 px-4 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                  hasVisibleError
                    ? 'border-red-400 bg-red-50/40 focus:border-red-600 focus:ring-red-600/20'
                    : 'border-slate-200 bg-white focus:border-indigo-600 focus:ring-indigo-600/20'
                }`}
              />
            </div>

            {/* Generate QR Code CTA */}
            <button
              type="submit"
              className="h-12 px-6 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-sm font-semibold rounded-xl inline-flex items-center justify-center gap-2 transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <span>Generate QR Code</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {hasVisibleError && (
            <div
              role="alert"
              className="mt-2.5 px-3 py-2 rounded-lg bg-red-50 text-red-700 text-xs font-medium flex items-center gap-2 text-left"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{validation.errorMessage}</span>
            </div>
          )}

          {!hasVisibleError && heroFeedback && (
            <div
              role="status"
              className="mt-2.5 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium flex items-center gap-2 text-left"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{heroFeedback}</span>
            </div>
          )}
        </form>
      </div>
    </section>
  );
};
