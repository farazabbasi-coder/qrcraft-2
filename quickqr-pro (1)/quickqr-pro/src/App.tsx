import React, { useMemo, useState } from 'react';
import {
  QrCategory,
  QrFormData,
  QrStyleConfig,
  SavedQrHistoryItem,
} from './types/qr';
import {
  buildAndValidateQrPayload,
  DEFAULT_FORM_DATA,
  PRESET_LOGOS,
  SAMPLE_FORM_DATA,
} from './utils/qrPayload';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { QrTypeInputs } from './components/QrTypeInputs';
import { QrCustomizationPanel } from './components/QrCustomizationPanel';
import { QrPreviewCard } from './components/QrPreviewCard';
import { FeaturesSection } from './components/FeaturesSection';
import { GuideLang, HowItWorksSection } from './components/HowItWorksSection';
import { FaqAndContactSection } from './components/FaqAndContactSection';

const DEFAULT_STYLE_CONFIG: QrStyleConfig = {
  fgColor: '#0F172A',
  bgColor: '#FFFFFF',
  useCustomEyeColor: false,
  eyeColor: '#4F46E5',
  size: 1024,
  margin: 4,
  bodyPattern: 'square',
  eyePattern: 'square',
  errorCorrection: 'M',
  logoDataUrl: null,
  logoScale: 0.2,
  logoPadShape: 'rounded',
};

export default function App() {
  const [activeCategory, setActiveCategory] = useState<QrCategory>(QrCategory.Website);
  const [formData, setFormData] = useState<QrFormData>(DEFAULT_FORM_DATA);
  const [styleConfig, setStyleConfig] = useState<QrStyleConfig>(DEFAULT_STYLE_CONFIG);
  const [showValidationErrors, setShowValidationErrors] = useState<boolean>(false);
  const [heroFeedback, setHeroFeedback] = useState<string | null>(null);
  const [guideLang, setGuideLang] = useState<GuideLang>('en');
  const [history, setHistory] = useState<SavedQrHistoryItem[]>([]);

  const validation = useMemo(
    () => buildAndValidateQrPayload(activeCategory, formData),
    [activeCategory, formData]
  );

  const scrollToGenerator = () => {
    const el = document.getElementById('generator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectCategory = (cat: QrCategory) => {
    setActiveCategory(cat);
    setShowValidationErrors(false);
    setHeroFeedback(null);
  };

  const handleChangeField = <K extends keyof QrFormData>(
    field: K,
    value: QrFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (heroFeedback) setHeroFeedback(null);
  };

  const handleUpdateStyle = <K extends keyof QrStyleConfig>(
    key: K,
    value: QrStyleConfig[K]
  ) => {
    setStyleConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveToHistory = () => {
    if (!validation.isValid || !validation.payload) {
      setShowValidationErrors(true);
      return;
    }

    setShowValidationErrors(false);
    setHistory((prev) => {
      // Avoid duplicate consecutive identical payloads
      const filtered = prev.filter((item) => item.payload !== validation.payload);
      const nextItem: SavedQrHistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        category: activeCategory,
        label: validation.summaryLabel,
        payload: validation.payload,
        createdAt: new Date().toISOString(),
        style: { ...styleConfig },
        formData: { ...formData },
      };
      return [nextItem, ...filtered].slice(0, 6);
    });
  };

  const handleQuickGenerateHero = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validation.isValid) {
      setShowValidationErrors(true);
      // If multi-field type like Wi-Fi or vCard needs extra details, scroll to full form
      if (
        activeCategory === QrCategory.WiFi ||
        activeCategory === QrCategory.VCard
      ) {
        scrollToGenerator();
      }
      return;
    }

    handleSaveToHistory();
    setHeroFeedback('QR code generated! Customize colors, patterns, or download below.');
    scrollToGenerator();
  };

  const handleFillSampleForCategory = () => {
    setShowValidationErrors(false);
    setFormData((prev) => {
      switch (activeCategory) {
        case QrCategory.Website:
          return { ...prev, websiteUrl: SAMPLE_FORM_DATA.websiteUrl };
        case QrCategory.YouTube:
          return { ...prev, youtubeUrl: SAMPLE_FORM_DATA.youtubeUrl };
        case QrCategory.WhatsApp:
          return {
            ...prev,
            whatsappCountryCode: SAMPLE_FORM_DATA.whatsappCountryCode,
            whatsappPhone: SAMPLE_FORM_DATA.whatsappPhone,
            whatsappMessage: SAMPLE_FORM_DATA.whatsappMessage,
          };
        case QrCategory.WiFi:
          return {
            ...prev,
            wifiSsid: SAMPLE_FORM_DATA.wifiSsid,
            wifiPassword: SAMPLE_FORM_DATA.wifiPassword,
            wifiEncryption: SAMPLE_FORM_DATA.wifiEncryption,
            wifiHidden: SAMPLE_FORM_DATA.wifiHidden,
          };
        case QrCategory.Text:
          return { ...prev, plainText: SAMPLE_FORM_DATA.plainText };
        case QrCategory.Email:
          return {
            ...prev,
            emailAddress: SAMPLE_FORM_DATA.emailAddress,
            emailSubject: SAMPLE_FORM_DATA.emailSubject,
            emailBody: SAMPLE_FORM_DATA.emailBody,
          };
        case QrCategory.Phone:
          return { ...prev, phoneNumber: SAMPLE_FORM_DATA.phoneNumber };
        case QrCategory.VCard:
          return {
            ...prev,
            vcardFirstName: SAMPLE_FORM_DATA.vcardFirstName,
            vcardLastName: SAMPLE_FORM_DATA.vcardLastName,
            vcardOrg: SAMPLE_FORM_DATA.vcardOrg,
            vcardTitle: SAMPLE_FORM_DATA.vcardTitle,
            vcardPhone: SAMPLE_FORM_DATA.vcardPhone,
            vcardEmail: SAMPLE_FORM_DATA.vcardEmail,
            vcardWebsite: SAMPLE_FORM_DATA.vcardWebsite,
            vcardAddress: SAMPLE_FORM_DATA.vcardAddress,
          };
        case QrCategory.Instagram:
          return { ...prev, instagramHandle: SAMPLE_FORM_DATA.instagramHandle };
        case QrCategory.Facebook:
          return { ...prev, facebookPage: SAMPLE_FORM_DATA.facebookPage };
        case QrCategory.Maps:
          return {
            ...prev,
            mapsQuery: SAMPLE_FORM_DATA.mapsQuery,
            mapsLat: SAMPLE_FORM_DATA.mapsLat,
            mapsLng: SAMPLE_FORM_DATA.mapsLng,
          };
      }
    });
  };

  const handleClearCurrentCategory = () => {
    setShowValidationErrors(false);
    setFormData((prev) => {
      switch (activeCategory) {
        case QrCategory.Website:
          return { ...prev, websiteUrl: '' };
        case QrCategory.YouTube:
          return { ...prev, youtubeUrl: '' };
        case QrCategory.WhatsApp:
          return { ...prev, whatsappPhone: '', whatsappMessage: '' };
        case QrCategory.WiFi:
          return { ...prev, wifiSsid: '', wifiPassword: '', wifiHidden: false };
        case QrCategory.Text:
          return { ...prev, plainText: '' };
        case QrCategory.Email:
          return { ...prev, emailAddress: '', emailSubject: '', emailBody: '' };
        case QrCategory.Phone:
          return { ...prev, phoneNumber: '' };
        case QrCategory.VCard:
          return {
            ...prev,
            vcardFirstName: '',
            vcardLastName: '',
            vcardOrg: '',
            vcardTitle: '',
            vcardPhone: '',
            vcardEmail: '',
            vcardWebsite: '',
            vcardAddress: '',
          };
        case QrCategory.Instagram:
          return { ...prev, instagramHandle: '' };
        case QrCategory.Facebook:
          return { ...prev, facebookPage: '' };
        case QrCategory.Maps:
          return { ...prev, mapsQuery: '', mapsLat: '', mapsLng: '' };
      }
    });
  };

  const handleTryFeaturePreset = (preset: 'youtube' | 'wifi' | 'vcard' | 'branded') => {
    setShowValidationErrors(false);
    if (preset === 'youtube') {
      setActiveCategory(QrCategory.YouTube);
      setFormData((prev) => ({ ...prev, youtubeUrl: SAMPLE_FORM_DATA.youtubeUrl }));
      setStyleConfig({
        ...DEFAULT_STYLE_CONFIG,
        fgColor: '#0F172A',
        useCustomEyeColor: true,
        eyeColor: '#DC2626',
        bodyPattern: 'rounded',
        eyePattern: 'rounded',
        logoDataUrl: PRESET_LOGOS.find((l) => l.id === 'youtube')?.dataUrl || null,
      });
    } else if (preset === 'wifi') {
      setActiveCategory(QrCategory.WiFi);
      setFormData((prev) => ({
        ...prev,
        wifiSsid: SAMPLE_FORM_DATA.wifiSsid,
        wifiPassword: SAMPLE_FORM_DATA.wifiPassword,
        wifiEncryption: 'WPA',
      }));
      setStyleConfig({
        ...DEFAULT_STYLE_CONFIG,
        fgColor: '#0F172A',
        useCustomEyeColor: true,
        eyeColor: '#0284C7',
        bodyPattern: 'dots',
        eyePattern: 'circle',
        logoDataUrl: PRESET_LOGOS.find((l) => l.id === 'wifi')?.dataUrl || null,
      });
    } else if (preset === 'vcard') {
      setActiveCategory(QrCategory.VCard);
      setFormData((prev) => ({
        ...prev,
        vcardFirstName: SAMPLE_FORM_DATA.vcardFirstName,
        vcardLastName: SAMPLE_FORM_DATA.vcardLastName,
        vcardOrg: SAMPLE_FORM_DATA.vcardOrg,
        vcardTitle: SAMPLE_FORM_DATA.vcardTitle,
        vcardPhone: SAMPLE_FORM_DATA.vcardPhone,
        vcardEmail: SAMPLE_FORM_DATA.vcardEmail,
        vcardWebsite: SAMPLE_FORM_DATA.vcardWebsite,
        vcardAddress: SAMPLE_FORM_DATA.vcardAddress,
      }));
      setStyleConfig({
        ...DEFAULT_STYLE_CONFIG,
        fgColor: '#0F172A',
        bodyPattern: 'classy',
        eyePattern: 'leaf',
        logoDataUrl: PRESET_LOGOS.find((l) => l.id === 'vcard')?.dataUrl || null,
      });
    } else if (preset === 'branded') {
      setActiveCategory(QrCategory.Website);
      setFormData((prev) => ({
        ...prev,
        websiteUrl: prev.websiteUrl.trim() || 'https://qrcraft.studio',
      }));
      setStyleConfig({
        ...DEFAULT_STYLE_CONFIG,
        fgColor: '#4F46E5',
        bgColor: '#FFFFFF',
        useCustomEyeColor: true,
        eyeColor: '#1E1B4B',
        bodyPattern: 'rounded',
        eyePattern: 'rounded',
        logoDataUrl: PRESET_LOGOS.find((l) => l.id === 'globe')?.dataUrl || null,
      });
    }
    scrollToGenerator();
  };

  const handleRestoreHistoryItem = (item: SavedQrHistoryItem) => {
    setActiveCategory(item.category);
    setFormData({ ...item.formData });
    setStyleConfig({ ...item.style });
    setShowValidationErrors(false);
    scrollToGenerator();
  };

  const handleJumpToCategory = (cat: QrCategory) => {
    setActiveCategory(cat);
    setShowValidationErrors(false);
    scrollToGenerator();
  };

  const handleLoadStudioSupportVCard = () => {
    setActiveCategory(QrCategory.VCard);
    setFormData((prev) => ({
      ...prev,
      vcardFirstName: 'QRCraft',
      vcardLastName: 'Support',
      vcardOrg: 'QRCraft Studio',
      vcardTitle: 'Print & Vector Desk',
      vcardPhone: '+923001234567',
      vcardEmail: 'support@qrcraft.studio',
      vcardWebsite: 'https://qrcraft.studio',
      vcardAddress: 'Lahore, Pakistan',
    }));
    setShowValidationErrors(false);
    scrollToGenerator();
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Navbar onStartCreating={scrollToGenerator} />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
          formData={formData}
          onChangeFormData={handleChangeField}
          validation={validation}
          showValidationErrors={showValidationErrors}
          onQuickGenerate={handleQuickGenerateHero}
          heroFeedback={heroFeedback}
        />

        {/* Main QR Generator Workspace */}
        <section id="generator" className="py-10 sm:py-14 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: QR Type, Data Inputs & Customization */}
              <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 space-y-8">
                <QrTypeInputs
                  activeCategory={activeCategory}
                  onSelectCategory={handleSelectCategory}
                  formData={formData}
                  onChangeField={handleChangeField}
                  onFillSample={handleFillSampleForCategory}
                  onClearCurrent={handleClearCurrentCategory}
                  validation={validation}
                  showValidationErrors={showValidationErrors}
                />

                <hr className="border-slate-200/80" />

                <QrCustomizationPanel
                  style={styleConfig}
                  onUpdateStyle={handleUpdateStyle}
                  onResetStyle={() => setStyleConfig(DEFAULT_STYLE_CONFIG)}
                />
              </div>

              {/* Right Column: Live QR Preview & Download Actions */}
              <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-22">
                <QrPreviewCard
                  activeCategory={activeCategory}
                  validation={validation}
                  style={styleConfig}
                  onGenerateClick={handleSaveToHistory}
                  onTriggerValidationError={() => setShowValidationErrors(true)}
                  history={history}
                  onRestoreHistoryItem={handleRestoreHistoryItem}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <FeaturesSection onTryFeaturePreset={handleTryFeaturePreset} />

        {/* How It Works & About Showcase */}
        <HowItWorksSection
          guideLang={guideLang}
          onChangeGuideLang={setGuideLang}
        />

        {/* FAQ, Contact & Footer */}
        <FaqAndContactSection
          guideLang={guideLang}
          onChangeGuideLang={setGuideLang}
          onJumpToCategory={handleJumpToCategory}
          onLoadStudioSupportVCard={handleLoadStudioSupportVCard}
        />
      </main>
    </div>
  );
}
