import React, { useRef, useState } from 'react';
import { AlertTriangle, RotateCcw, Trash2, Upload } from 'lucide-react';
import {
  BodyPattern,
  ErrorCorrection,
  EyePattern,
  LogoPadShape,
  QrStyleConfig,
} from '../types/qr';
import { evaluateQrContrast, PRESET_LOGOS } from '../utils/qrPayload';

interface QrCustomizationPanelProps {
  style: QrStyleConfig;
  onUpdateStyle: <K extends keyof QrStyleConfig>(key: K, value: QrStyleConfig[K]) => void;
  onResetStyle: () => void;
}

type CustomTab = 'patterns' | 'colors' | 'logo' | 'size';

const BODY_PATTERNS: { id: BodyPattern; label: string }[] = [
  { id: 'square', label: 'Classic' },
  { id: 'rounded', label: 'Rounded' },
  { id: 'dots', label: 'Dots' },
  { id: 'diamond', label: 'Diamond' },
  { id: 'classy', label: 'Leaf' },
];

const EYE_PATTERNS: { id: EyePattern; label: string }[] = [
  { id: 'square', label: 'Square' },
  { id: 'rounded', label: 'Rounded' },
  { id: 'circle', label: 'Circle' },
  { id: 'leaf', label: 'Leaf' },
];

const FG_SWATCHES = [
  { hex: '#0F172A', name: 'Slate Black' },
  { hex: '#4F46E5', name: 'Royal Indigo' },
  { hex: '#1D4ED8', name: 'Cobalt Blue' },
  { hex: '#6D28D9', name: 'Deep Violet' },
  { hex: '#047857', name: 'Forest Emerald' },
  { hex: '#B91C1C', name: 'Crimson' },
];

const BG_SWATCHES = [
  { hex: '#FFFFFF', name: 'Pure White' },
  { hex: '#F8FAFC', name: 'Cool Ice' },
  { hex: '#EEF2FF', name: 'Soft Indigo' },
  { hex: '#F0FDF4', name: 'Mint Tint' },
  { hex: '#FEFCE8', name: 'Warm Ivory' },
];

const SIZE_PRESETS = [256, 512, 1024, 2048];

function normalizeHexInput(val: string, fallback: string): string {
  const cleaned = val.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(cleaned)) return cleaned.toUpperCase();
  if (/^[0-9a-fA-F]{6}$/.test(cleaned)) return `#${cleaned.toUpperCase()}`;
  return fallback;
}

export const QrCustomizationPanel: React.FC<QrCustomizationPanelProps> = ({
  style,
  onUpdateStyle,
  onResetStyle,
}) => {
  const [activeTab, setActiveTab] = useState<CustomTab>('patterns');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const contrast = evaluateQrContrast(style.fgColor, style.bgColor);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, SVG, or WebP).');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setUploadError('Logo image must be smaller than 4 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUpdateStyle('logoDataUrl', reader.result);
      }
    };
    reader.onerror = () => {
      setUploadError('Could not read the selected image file.');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAutoFixContrast = () => {
    onUpdateStyle('fgColor', '#0F172A');
    onUpdateStyle('bgColor', '#FFFFFF');
    if (style.useCustomEyeColor) {
      onUpdateStyle('eyeColor', '#4F46E5');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-base font-semibold text-slate-900">
          03. Customize Style &amp; Branding
        </h2>
        <button
          type="button"
          onClick={onResetStyle}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset styling</span>
        </button>
      </div>

      {/* Segmented Customization Tabs */}
      <div
        role="tablist"
        aria-label="Customization categories"
        className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl"
      >
        {(
          [
            { id: 'patterns', label: 'Patterns' },
            { id: 'colors', label: 'Colors' },
            { id: 'logo', label: 'Logo' },
            { id: 'size', label: 'Size & Quality' },
          ] as { id: CustomTab; label: string }[]
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === tab.id
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Patterns & Corner Eyes */}
      {activeTab === 'patterns' && (
        <div className="space-y-5 pt-1">
          <div>
            <p className="text-xs font-semibold text-slate-700 mb-2.5">Data Module Pattern</p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
              {BODY_PATTERNS.map((pat) => {
                const selected = style.bodyPattern === pat.id;
                return (
                  <button
                    key={pat.id}
                    type="button"
                    onClick={() => onUpdateStyle('bodyPattern', pat.id)}
                    className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-150 cursor-pointer ${
                      selected
                        ? 'border-indigo-600 bg-indigo-50/60 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <svg viewBox="0 0 28 28" className="w-7 h-7 fill-current" aria-hidden="true">
                      {pat.id === 'square' && (
                        <>
                          <rect x="2" y="2" width="10" height="10" />
                          <rect x="16" y="2" width="10" height="10" />
                          <rect x="2" y="16" width="10" height="10" />
                          <rect x="16" y="16" width="10" height="10" />
                        </>
                      )}
                      {pat.id === 'rounded' && (
                        <>
                          <rect x="2" y="2" width="10" height="10" rx="3.5" />
                          <rect x="16" y="2" width="10" height="10" rx="3.5" />
                          <rect x="2" y="16" width="10" height="10" rx="3.5" />
                          <rect x="16" y="16" width="10" height="10" rx="3.5" />
                        </>
                      )}
                      {pat.id === 'dots' && (
                        <>
                          <circle cx="7" cy="7" r="4.8" />
                          <circle cx="21" cy="7" r="4.8" />
                          <circle cx="7" cy="21" r="4.8" />
                          <circle cx="21" cy="21" r="4.8" />
                        </>
                      )}
                      {pat.id === 'diamond' && (
                        <>
                          <polygon points="7,1.5 12.5,7 7,12.5 1.5,7" />
                          <polygon points="21,1.5 26.5,7 21,12.5 15.5,7" />
                          <polygon points="7,15.5 12.5,21 7,26.5 1.5,21" />
                          <polygon points="21,15.5 26.5,21 21,26.5 15.5,21" />
                        </>
                      )}
                      {pat.id === 'classy' && (
                        <>
                          <path d="M7 2 H12 V7 Q12 12 7 12 H2 V7 Q2 2 7 2 Z" />
                          <path d="M21 2 H26 V7 Q26 12 21 12 H16 V7 Q16 2 21 2 Z" />
                          <path d="M7 16 H12 V21 Q12 26 7 26 H2 V21 Q2 16 7 16 Z" />
                          <path d="M21 16 H26 V21 Q26 26 21 26 H16 V21 Q16 16 21 16 Z" />
                        </>
                      )}
                    </svg>
                    <span className="text-xs font-medium whitespace-nowrap">{pat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-700 mb-2.5">Corner Finder Eye Style</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {EYE_PATTERNS.map((eye) => {
                const selected = style.eyePattern === eye.id;
                return (
                  <button
                    key={eye.id}
                    type="button"
                    onClick={() => onUpdateStyle('eyePattern', eye.id)}
                    className={`flex items-center justify-center gap-2.5 p-3 rounded-xl border transition-all duration-150 cursor-pointer ${
                      selected
                        ? 'border-indigo-600 bg-indigo-50/60 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <svg viewBox="0 0 28 28" className="w-6 h-6 shrink-0" aria-hidden="true">
                      {eye.id === 'square' && (
                        <>
                          <rect x="2" y="2" width="24" height="24" fill="currentColor" />
                          <rect x="6" y="6" width="16" height="16" fill="white" />
                          <rect x="10" y="10" width="8" height="8" fill="currentColor" />
                        </>
                      )}
                      {eye.id === 'rounded' && (
                        <>
                          <rect x="2" y="2" width="24" height="24" rx="6" fill="currentColor" />
                          <rect x="6" y="6" width="16" height="16" rx="4" fill="white" />
                          <rect x="10" y="10" width="8" height="8" rx="2" fill="currentColor" />
                        </>
                      )}
                      {eye.id === 'circle' && (
                        <>
                          <circle cx="14" cy="14" r="12" fill="currentColor" />
                          <circle cx="14" cy="14" r="8" fill="white" />
                          <circle cx="14" cy="14" r="4.2" fill="currentColor" />
                        </>
                      )}
                      {eye.id === 'leaf' && (
                        <>
                          <path d="M11 2 H26 V17 Q26 26 17 26 H2 V11 Q2 2 11 2 Z" fill="currentColor" />
                          <path d="M12 6 H22 V16 Q22 22 16 22 H6 V12 Q6 6 12 6 Z" fill="white" />
                          <rect x="10" y="10" width="8" height="8" rx="2.5" fill="currentColor" />
                        </>
                      )}
                    </svg>
                    <span className="text-xs font-medium whitespace-nowrap">{eye.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Colors & Contrast */}
      {activeTab === 'colors' && (
        <div className="space-y-5 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Foreground Color */}
            <div className="space-y-2.5">
              <label htmlFor="qr-fg-color" className="block text-xs font-semibold text-slate-700">
                QR Foreground Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="qr-fg-color"
                  type="color"
                  value={style.fgColor}
                  onChange={(e) => onUpdateStyle('fgColor', e.target.value.toUpperCase())}
                  className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0.5 bg-white shrink-0"
                />
                <input
                  type="text"
                  aria-label="Foreground hex color"
                  value={style.fgColor}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (/^#?[0-9a-fA-F]{0,6}$/.test(v)) {
                      onUpdateStyle(
                        'fgColor',
                        v.startsWith('#') ? v.toUpperCase() : `#${v.toUpperCase()}`
                      );
                    }
                  }}
                  onBlur={(e) => onUpdateStyle('fgColor', normalizeHexInput(e.target.value, '#0F172A'))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono text-xs text-slate-800 uppercase focus:border-indigo-600 focus:outline-none"
                />
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {FG_SWATCHES.map((sw) => (
                  <button
                    key={sw.hex}
                    type="button"
                    title={sw.name}
                    aria-label={`Set foreground to ${sw.name}`}
                    onClick={() => onUpdateStyle('fgColor', sw.hex)}
                    className={`w-6 h-6 rounded-md border transition-transform cursor-pointer ${
                      style.fgColor.toUpperCase() === sw.hex
                        ? 'ring-2 ring-indigo-600 ring-offset-1 scale-105'
                        : 'border-slate-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: sw.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Background Color */}
            <div className="space-y-2.5">
              <label htmlFor="qr-bg-color" className="block text-xs font-semibold text-slate-700">
                Background Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="qr-bg-color"
                  type="color"
                  value={style.bgColor}
                  onChange={(e) => onUpdateStyle('bgColor', e.target.value.toUpperCase())}
                  className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0.5 bg-white shrink-0"
                />
                <input
                  type="text"
                  aria-label="Background hex color"
                  value={style.bgColor}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (/^#?[0-9a-fA-F]{0,6}$/.test(v)) {
                      onUpdateStyle(
                        'bgColor',
                        v.startsWith('#') ? v.toUpperCase() : `#${v.toUpperCase()}`
                      );
                    }
                  }}
                  onBlur={(e) => onUpdateStyle('bgColor', normalizeHexInput(e.target.value, '#FFFFFF'))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono text-xs text-slate-800 uppercase focus:border-indigo-600 focus:outline-none"
                />
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {BG_SWATCHES.map((sw) => (
                  <button
                    key={sw.hex}
                    type="button"
                    title={sw.name}
                    aria-label={`Set background to ${sw.name}`}
                    onClick={() => onUpdateStyle('bgColor', sw.hex)}
                    className={`w-6 h-6 rounded-md border transition-transform cursor-pointer ${
                      style.bgColor.toUpperCase() === sw.hex
                        ? 'ring-2 ring-indigo-600 ring-offset-1 scale-105'
                        : 'border-slate-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: sw.hex }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Optional Accent Corner Eye Color */}
          <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
            <label className="inline-flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={style.useCustomEyeColor}
                onChange={(e) => onUpdateStyle('useCustomEyeColor', e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
              />
              <span>Use distinct accent color for corner finder eyes</span>
            </label>

            {style.useCustomEyeColor && (
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  aria-label="Corner eye color"
                  value={style.eyeColor}
                  onChange={(e) => onUpdateStyle('eyeColor', e.target.value.toUpperCase())}
                  className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer p-0.5 bg-white"
                />
                <span className="font-mono text-xs text-slate-600 uppercase tabular-nums">
                  {style.eyeColor}
                </span>
              </div>
            )}
          </div>

          {/* Scannability Contrast Check */}
          <div
            className={`p-3 rounded-xl border text-xs flex flex-wrap items-center justify-between gap-2 ${
              contrast.isLowContrast || contrast.isInverted
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <div className="flex items-center gap-2">
              {(contrast.isLowContrast || contrast.isInverted) && (
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              )}
              <span>
                Contrast ratio:{' '}
                <strong className="font-mono tabular-nums">{contrast.ratio.toFixed(1)}:1</strong>
                {contrast.isInverted
                  ? ' — Light QR modules on dark backgrounds may scan slower on older cameras.'
                  : contrast.isLowContrast
                  ? ' — Low contrast may reduce camera scan reliability.'
                  : ' — High scannability across mobile cameras.'}
              </span>
            </div>

            {(contrast.isLowContrast || contrast.isInverted) && (
              <button
                type="button"
                onClick={handleAutoFixContrast}
                className="px-2.5 py-1 rounded-md bg-amber-900 text-white font-semibold hover:bg-amber-950 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                Fix Contrast
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Center Logo Upload & Presets */}
      {activeTab === 'logo' && (
        <div className="space-y-4 pt-1">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-indigo-300 bg-indigo-50/40 hover:bg-indigo-50 text-indigo-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              <Upload className="w-4 h-4 shrink-0" />
              <span>Upload Custom Logo (PNG, SVG, JPG)</span>
            </button>

            {style.logoDataUrl && (
              <button
                type="button"
                onClick={() => onUpdateStyle('logoDataUrl', null)}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Logo</span>
              </button>
            )}
          </div>

          {uploadError && (
            <p role="alert" className="text-xs font-medium text-red-600">
              {uploadError}
            </p>
          )}

          {/* Quick Vector Icons */}
          <div>
            <p className="text-xs font-semibold text-slate-700 mb-2">Or Choose a Ready Icon Badge</p>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {PRESET_LOGOS.map((item) => {
                const isSelected = style.logoDataUrl === item.dataUrl;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      onUpdateStyle('logoDataUrl', isSelected ? null : item.dataUrl)
                    }
                    title={item.label}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={item.dataUrl}
                      alt={`${item.label} icon`}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-md"
                    />
                    <span className="text-[11px] text-slate-600 font-medium truncate max-w-full">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {style.logoDataUrl && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200/80">
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1.5">
                  <label htmlFor="logo-scale-slider">Logo Size</label>
                  <span className="font-mono tabular-nums">
                    {Math.round(style.logoScale * 100)}%
                  </span>
                </div>
                <input
                  id="logo-scale-slider"
                  type="range"
                  min={0.15}
                  max={0.24}
                  step={0.01}
                  value={style.logoScale}
                  onChange={(e) => onUpdateStyle('logoScale', Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div>
                <p className="text-xs font-medium text-slate-700 mb-1.5">Logo Frame Shape</p>
                <div className="inline-flex p-1 bg-slate-100 rounded-lg">
                  {(['rounded', 'circle'] as LogoPadShape[]).map((shape) => (
                    <button
                      key={shape}
                      type="button"
                      onClick={() => onUpdateStyle('logoPadShape', shape)}
                      className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition-colors cursor-pointer whitespace-nowrap ${
                        style.logoPadShape === shape
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {shape}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Size, Margin & Error Correction */}
      {activeTab === 'size' && (
        <div className="space-y-4 pt-1">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="size-range" className="text-xs font-semibold text-slate-700">
                Download Resolution (Pixels)
              </label>
              <span className="text-xs font-mono font-semibold text-indigo-700 tabular-nums">
                {style.size} × {style.size} px
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-3">
              {SIZE_PRESETS.map((px) => (
                <button
                  key={px}
                  type="button"
                  onClick={() => onUpdateStyle('size', px)}
                  className={`py-2 px-3 rounded-lg border text-xs font-mono font-medium tabular-nums transition-colors cursor-pointer whitespace-nowrap ${
                    style.size === px
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {px}px
                </button>
              ))}
            </div>

            <input
              id="size-range"
              type="range"
              min={256}
              max={2048}
              step={64}
              value={style.size}
              onChange={(e) => onUpdateStyle('size', Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200/80">
            <div>
              <p className="text-xs font-semibold text-slate-700 mb-2">Quiet Zone Border</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { val: 2, label: 'Compact' },
                  { val: 4, label: 'Standard' },
                  { val: 6, label: 'Wide' },
                ].map((m) => (
                  <button
                    key={m.val}
                    type="button"
                    onClick={() => onUpdateStyle('margin', m.val)}
                    className={`py-2 px-2.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      style.margin === m.val
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-700 mb-2">Error Correction</p>
              <div className="grid grid-cols-4 gap-1.5">
                {(['L', 'M', 'Q', 'H'] as ErrorCorrection[]).map((lvl) => {
                  const effective = style.logoDataUrl ? 'H' : style.errorCorrection;
                  const disabled = Boolean(style.logoDataUrl && lvl !== 'H');
                  return (
                    <button
                      key={lvl}
                      type="button"
                      disabled={disabled}
                      onClick={() => onUpdateStyle('errorCorrection', lvl)}
                      className={`py-2 rounded-lg border text-xs font-mono font-semibold transition-colors ${
                        effective === lvl
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                          : disabled
                          ? 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 cursor-pointer'
                      }`}
                    >
                      {lvl}
                    </button>
                  );
                })}
              </div>
              {style.logoDataUrl && (
                <p className="mt-1.5 text-[11px] text-slate-500">
                  Locked to High (H · 30%) while center logo is active so cameras scan reliably.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
