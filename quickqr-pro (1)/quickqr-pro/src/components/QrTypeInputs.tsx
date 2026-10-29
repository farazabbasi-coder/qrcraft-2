import React, { useState } from 'react';
import {
  AlertCircle,
  Eye,
  EyeOff,
  Globe,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
  Type,
  UserSquare2,
  Video,
  Wifi,
} from 'lucide-react';
import {
  MapsInputMode,
  PayloadValidationResult,
  QrCategory,
  QrFormData,
  WifiEncryption,
} from '../types/qr';
import { QR_CATEGORIES } from './HeroSection';

interface QrTypeInputsProps {
  activeCategory: QrCategory;
  onSelectCategory: (cat: QrCategory) => void;
  formData: QrFormData;
  onChangeField: <K extends keyof QrFormData>(field: K, value: QrFormData[K]) => void;
  onFillSample: () => void;
  onClearCurrent: () => void;
  validation: PayloadValidationResult;
  showValidationErrors: boolean;
}

const CATEGORY_ICONS: Record<QrCategory, React.ComponentType<{ className?: string }>> = {
  [QrCategory.Website]: Globe,
  [QrCategory.YouTube]: Video,
  [QrCategory.WhatsApp]: MessageCircle,
  [QrCategory.WiFi]: Wifi,
  [QrCategory.Text]: Type,
  [QrCategory.Email]: Mail,
  [QrCategory.Phone]: Phone,
  [QrCategory.VCard]: UserSquare2,
  [QrCategory.Instagram]: Instagram,
  [QrCategory.Facebook]: Share2,
  [QrCategory.Maps]: MapPin,
};

const COUNTRY_CODES = [
  { code: '+92', label: 'PK +92' },
  { code: '+91', label: 'IN +91' },
  { code: '+1', label: 'US/CA +1' },
  { code: '+44', label: 'UK +44' },
  { code: '+971', label: 'UAE +971' },
  { code: '+966', label: 'SA +966' },
  { code: '+61', label: 'AU +61' },
  { code: '+49', label: 'DE +49' },
  { code: '+90', label: 'TR +90' },
  { code: '+60', label: 'MY +60' },
];

export const QrTypeInputs: React.FC<QrTypeInputsProps> = ({
  activeCategory,
  onSelectCategory,
  formData,
  onChangeField,
  onFillSample,
  onClearCurrent,
  validation,
  showValidationErrors,
}) => {
  const [showWifiPassword, setShowWifiPassword] = useState(false);

  const getFieldError = (field: keyof QrFormData): string | undefined => {
    const err = validation.fieldErrors[field];
    if (!err) return undefined;
    // Show error immediately if user typed invalid non-empty text, or if Generate/Download was clicked
    if (showValidationErrors || !validation.isEmpty) {
      return err;
    }
    return undefined;
  };

  const inputClass = (field: keyof QrFormData) => {
    const hasErr = Boolean(getFieldError(field));
    return `w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 ${
      hasErr
        ? 'border-red-400 bg-red-50/30 focus:border-red-600 focus:ring-red-600/20'
        : 'border-slate-200 bg-white hover:border-slate-300 focus:border-indigo-600 focus:ring-indigo-600/20'
    }`;
  };

  const renderFieldError = (field: keyof QrFormData) => {
    const err = getFieldError(field);
    if (!err) return null;
    return (
      <p role="alert" className="mt-1.5 text-xs font-medium text-red-600 flex items-center gap-1.5">
        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
        <span>{err}</span>
      </p>
    );
  };

  return (
    <div className="space-y-6">
      {/* Step 1: QR Type Selector Grid */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-3">
          <h2 className="font-display text-base font-semibold text-slate-900">
            01. Choose QR Code Type
          </h2>
          <span className="text-xs text-slate-500 tabular-nums">11 formats</span>
        </div>

        <div
          role="tablist"
          aria-label="QR Code Formats"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2"
        >
          {QR_CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.id];
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-indigo-600'}`}
                />
                <span className="truncate">{cat.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-slate-200/80" />

      {/* Step 2: Content Input Fields */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h2 className="font-display text-base font-semibold text-slate-900">
            02. Enter Content Details
          </h2>
          <div className="flex items-center gap-3 text-xs font-medium">
            <button
              type="button"
              onClick={onFillSample}
              className="text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Load sample data
            </button>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <button
              type="button"
              onClick={onClearCurrent}
              className="text-slate-500 hover:text-slate-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Clear fields
            </button>
          </div>
        </div>

        {/* Dynamic Inputs by Category */}
        {activeCategory === QrCategory.Website && (
          <div className="space-y-2">
            <label htmlFor="field-website" className="block text-sm font-medium text-slate-700">
              Website or Landing Page URL
            </label>
            <input
              id="field-website"
              type="url"
              value={formData.websiteUrl}
              onChange={(e) => onChangeField('websiteUrl', e.target.value)}
              placeholder="https://yourwebsite.com"
              className={inputClass('websiteUrl')}
            />
            {renderFieldError('websiteUrl')}
            <p className="text-xs text-slate-500">
              Supports any standard web address. Missing <code className="font-mono">https://</code> is added automatically.
            </p>
          </div>
        )}

        {activeCategory === QrCategory.YouTube && (
          <div className="space-y-2">
            <label htmlFor="field-youtube" className="block text-sm font-medium text-slate-700">
              YouTube Video, Shorts, or Channel Link
            </label>
            <input
              id="field-youtube"
              type="url"
              value={formData.youtubeUrl}
              onChange={(e) => onChangeField('youtubeUrl', e.target.value)}
              placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              className={inputClass('youtubeUrl')}
            />
            {renderFieldError('youtubeUrl')}
            <p className="text-xs text-slate-500">
              Paste a full <code className="font-mono">youtube.com</code> or <code className="font-mono">youtu.be</code> link, <code className="font-mono">@handle</code>, or 11-character video ID.
            </p>
          </div>
        )}

        {activeCategory === QrCategory.WhatsApp && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label htmlFor="field-wa-code" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Country Code
                </label>
                <select
                  id="field-wa-code"
                  value={formData.whatsappCountryCode}
                  onChange={(e) => onChangeField('whatsappCountryCode', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 cursor-pointer"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="field-wa-phone" className="block text-sm font-medium text-slate-700 mb-1.5">
                  WhatsApp Phone Number
                </label>
                <input
                  id="field-wa-phone"
                  type="tel"
                  value={formData.whatsappPhone}
                  onChange={(e) => onChangeField('whatsappPhone', e.target.value)}
                  placeholder="3001234567"
                  className={inputClass('whatsappPhone')}
                />
                {renderFieldError('whatsappPhone')}
              </div>
            </div>

            <div>
              <label htmlFor="field-wa-msg" className="block text-sm font-medium text-slate-700 mb-1.5">
                Pre-filled Chat Message <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <textarea
                id="field-wa-msg"
                rows={2}
                value={formData.whatsappMessage}
                onChange={(e) => onChangeField('whatsappMessage', e.target.value)}
                placeholder="Hello! I would like to place an order..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
              />
            </div>
          </div>
        )}

        {activeCategory === QrCategory.WiFi && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label htmlFor="field-wifi-ssid" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Network Name (SSID)
                </label>
                <input
                  id="field-wifi-ssid"
                  type="text"
                  value={formData.wifiSsid}
                  onChange={(e) => onChangeField('wifiSsid', e.target.value)}
                  placeholder="e.g. Office_Fiber_5G"
                  className={inputClass('wifiSsid')}
                />
                {renderFieldError('wifiSsid')}
              </div>

              <div>
                <label htmlFor="field-wifi-enc" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Security / Encryption
                </label>
                <select
                  id="field-wifi-enc"
                  value={formData.wifiEncryption}
                  onChange={(e) => onChangeField('wifiEncryption', e.target.value as WifiEncryption)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 cursor-pointer"
                >
                  <option value="WPA">WPA / WPA2 / WPA3</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">None (Open Network)</option>
                </select>
              </div>
            </div>

            {formData.wifiEncryption !== 'nopass' && (
              <div>
                <label htmlFor="field-wifi-pass" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Wi-Fi Password
                </label>
                <div className="relative">
                  <input
                    id="field-wifi-pass"
                    type={showWifiPassword ? 'text' : 'password'}
                    value={formData.wifiPassword}
                    onChange={(e) => onChangeField('wifiPassword', e.target.value)}
                    placeholder="Minimum 8 characters for WPA"
                    className={`${inputClass('wifiPassword')} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowWifiPassword((prev) => !prev)}
                    aria-label={showWifiPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer"
                  >
                    {showWifiPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {renderFieldError('wifiPassword')}
              </div>
            )}

            <label className="inline-flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.wifiHidden}
                onChange={(e) => onChangeField('wifiHidden', e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
              />
              <span>Hidden Wi-Fi network (SSID is not broadcast publicly)</span>
            </label>
          </div>
        )}

        {activeCategory === QrCategory.Text && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="field-text" className="block text-sm font-medium text-slate-700">
                Plain Text Message
              </label>
              <span className="text-xs text-slate-500 font-mono tabular-nums">
                {formData.plainText.length} / 1500
              </span>
            </div>
            <textarea
              id="field-text"
              rows={4}
              value={formData.plainText}
              onChange={(e) => onChangeField('plainText', e.target.value)}
              placeholder="Enter coupon code, serial number, event note, or plain instructions..."
              className={inputClass('plainText')}
            />
            {renderFieldError('plainText')}
          </div>
        )}

        {activeCategory === QrCategory.Email && (
          <div className="space-y-3.5">
            <div>
              <label htmlFor="field-email" className="block text-sm font-medium text-slate-700 mb-1.5">
                Recipient Email Address
              </label>
              <input
                id="field-email"
                type="email"
                value={formData.emailAddress}
                onChange={(e) => onChangeField('emailAddress', e.target.value)}
                placeholder="support@yourcompany.com"
                className={inputClass('emailAddress')}
              />
              {renderFieldError('emailAddress')}
            </div>

            <div>
              <label htmlFor="field-email-sub" className="block text-sm font-medium text-slate-700 mb-1.5">
                Email Subject <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                id="field-email-sub"
                type="text"
                value={formData.emailSubject}
                onChange={(e) => onChangeField('emailSubject', e.target.value)}
                placeholder="Customer Feedback"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
              />
            </div>

            <div>
              <label htmlFor="field-email-body" className="block text-sm font-medium text-slate-700 mb-1.5">
                Message Body <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <textarea
                id="field-email-body"
                rows={2}
                value={formData.emailBody}
                onChange={(e) => onChangeField('emailBody', e.target.value)}
                placeholder="Write a default message body..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
              />
            </div>
          </div>
        )}

        {activeCategory === QrCategory.Phone && (
          <div className="space-y-2">
            <label htmlFor="field-phone" className="block text-sm font-medium text-slate-700">
              Phone Number (with Country Code)
            </label>
            <input
              id="field-phone"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => onChangeField('phoneNumber', e.target.value)}
              placeholder="+923001234567"
              className={inputClass('phoneNumber')}
            />
            {renderFieldError('phoneNumber')}
            <p className="text-xs text-slate-500">
              Scanning opens the phone dialer immediately with this number ready to call.
            </p>
          </div>
        )}

        {activeCategory === QrCategory.VCard && (
          <div className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label htmlFor="field-vc-first" className="block text-sm font-medium text-slate-700 mb-1.5">
                  First Name *
                </label>
                <input
                  id="field-vc-first"
                  type="text"
                  value={formData.vcardFirstName}
                  onChange={(e) => onChangeField('vcardFirstName', e.target.value)}
                  placeholder="Faraz"
                  className={inputClass('vcardFirstName')}
                />
                {renderFieldError('vcardFirstName')}
              </div>

              <div>
                <label htmlFor="field-vc-last" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Last Name
                </label>
                <input
                  id="field-vc-last"
                  type="text"
                  value={formData.vcardLastName}
                  onChange={(e) => onChangeField('vcardLastName', e.target.value)}
                  placeholder="Abbasi"
                  className={inputClass('vcardLastName')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label htmlFor="field-vc-phone" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Mobile / Work Phone *
                </label>
                <input
                  id="field-vc-phone"
                  type="tel"
                  value={formData.vcardPhone}
                  onChange={(e) => onChangeField('vcardPhone', e.target.value)}
                  placeholder="+923001234567"
                  className={inputClass('vcardPhone')}
                />
                {renderFieldError('vcardPhone')}
              </div>

              <div>
                <label htmlFor="field-vc-email" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  id="field-vc-email"
                  type="email"
                  value={formData.vcardEmail}
                  onChange={(e) => onChangeField('vcardEmail', e.target.value)}
                  placeholder="faraz@company.com"
                  className={inputClass('vcardEmail')}
                />
                {renderFieldError('vcardEmail')}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label htmlFor="field-vc-org" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Company / Organization
                </label>
                <input
                  id="field-vc-org"
                  type="text"
                  value={formData.vcardOrg}
                  onChange={(e) => onChangeField('vcardOrg', e.target.value)}
                  placeholder="QRCraft Studio"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                />
              </div>

              <div>
                <label htmlFor="field-vc-title" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Job Title
                </label>
                <input
                  id="field-vc-title"
                  type="text"
                  value={formData.vcardTitle}
                  onChange={(e) => onChangeField('vcardTitle', e.target.value)}
                  placeholder="Product Designer"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label htmlFor="field-vc-web" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Website
                </label>
                <input
                  id="field-vc-web"
                  type="url"
                  value={formData.vcardWebsite}
                  onChange={(e) => onChangeField('vcardWebsite', e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className={inputClass('vcardWebsite')}
                />
                {renderFieldError('vcardWebsite')}
              </div>

              <div>
                <label htmlFor="field-vc-addr" className="block text-sm font-medium text-slate-700 mb-1.5">
                  City / Office Address
                </label>
                <input
                  id="field-vc-addr"
                  type="text"
                  value={formData.vcardAddress}
                  onChange={(e) => onChangeField('vcardAddress', e.target.value)}
                  placeholder="Lahore, Pakistan"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                />
              </div>
            </div>
          </div>
        )}

        {activeCategory === QrCategory.Instagram && (
          <div className="space-y-2">
            <label htmlFor="field-instagram" className="block text-sm font-medium text-slate-700">
              Instagram Username or Profile URL
            </label>
            <input
              id="field-instagram"
              type="text"
              value={formData.instagramHandle}
              onChange={(e) => onChangeField('instagramHandle', e.target.value)}
              placeholder="@yourusername or https://instagram.com/yourusername"
              className={inputClass('instagramHandle')}
            />
            {renderFieldError('instagramHandle')}
          </div>
        )}

        {activeCategory === QrCategory.Facebook && (
          <div className="space-y-2">
            <label htmlFor="field-facebook" className="block text-sm font-medium text-slate-700">
              Facebook Page URL or Username
            </label>
            <input
              id="field-facebook"
              type="text"
              value={formData.facebookPage}
              onChange={(e) => onChangeField('facebookPage', e.target.value)}
              placeholder="https://www.facebook.com/yourpage or pagehandle"
              className={inputClass('facebookPage')}
            />
            {renderFieldError('facebookPage')}
          </div>
        )}

        {activeCategory === QrCategory.Maps && (
          <div className="space-y-4">
            <div className="inline-flex p-1 bg-slate-100 rounded-xl">
              {(['query', 'coordinates'] as MapsInputMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onChangeField('mapsMode', mode)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    formData.mapsMode === mode
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {mode === 'query' ? 'Address or Maps Link' : 'GPS Coordinates'}
                </button>
              ))}
            </div>

            {formData.mapsMode === 'query' ? (
              <div className="space-y-2">
                <label htmlFor="field-maps-query" className="block text-sm font-medium text-slate-700">
                  Place Name, Full Address, or Google Maps Link
                </label>
                <input
                  id="field-maps-query"
                  type="text"
                  value={formData.mapsQuery}
                  onChange={(e) => onChangeField('mapsQuery', e.target.value)}
                  placeholder="Badshahi Mosque, Lahore, Pakistan"
                  className={inputClass('mapsQuery')}
                />
                {renderFieldError('mapsQuery')}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="field-maps-lat" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Latitude (-90 to 90)
                  </label>
                  <input
                    id="field-maps-lat"
                    type="text"
                    value={formData.mapsLat}
                    onChange={(e) => onChangeField('mapsLat', e.target.value)}
                    placeholder="31.5880"
                    className={`${inputClass('mapsLat')} font-mono tabular-nums`}
                  />
                  {renderFieldError('mapsLat')}
                </div>
                <div>
                  <label htmlFor="field-maps-lng" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Longitude (-180 to 180)
                  </label>
                  <input
                    id="field-maps-lng"
                    type="text"
                    value={formData.mapsLng}
                    onChange={(e) => onChangeField('mapsLng', e.target.value)}
                    placeholder="74.3107"
                    className={`${inputClass('mapsLng')} font-mono tabular-nums`}
                  />
                  {renderFieldError('mapsLng')}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
