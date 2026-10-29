import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { QrCategory } from '../types/qr';

interface FeaturesSectionProps {
  onTryFeaturePreset: (preset: 'youtube' | 'wifi' | 'vcard' | 'branded') => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ onTryFeaturePreset }) => {
  return (
    <section id="features" className="py-16 sm:py-24 bg-slate-50/70 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-medium text-indigo-600 mb-2">
            <span>ISO/IEC 18004 Standard</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span>Static Permanent Codes</span>
          </p>
          <h2
            className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900"
            style={{ textWrap: 'balance' }}
          >
            Built for print clarity, instant camera recognition, and zero scan limits
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Every QR code is calculated directly in your browser without redirect trackers or paid subscriptions, so your printed materials keep working permanently.
          </p>
        </div>

        {/* Asymmetric Bento Grid (6 Core Features) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Feature 1 (Span 2): Fast QR Code Generation */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <p className="text-xs font-mono text-slate-400 tabular-nums mb-2">01 · Instant Engine</p>
              <h3 className="font-display text-xl font-bold text-slate-900">
                Fast QR Code Generation
              </h3>
              <p className="mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                Real-time matrix compilation updates your QR preview on every keystroke in under 5 milliseconds. Switch seamlessly between Website URLs, YouTube videos, WhatsApp chats, and Wi-Fi credentials without page reloads.
              </p>
            </div>
            <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs text-slate-500">
                <span>Zero server round-trips</span>
                <span aria-hidden="true" className="mx-2">·</span>
                <span>Works offline once loaded</span>
              </p>
              <button
                type="button"
                onClick={() => onTryFeaturePreset('youtube')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Try YouTube Video Preset</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Feature 2 (Span 1): Custom Colors and Logo */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <p className="text-xs font-mono text-slate-400 tabular-nums mb-2">02 · Brand Identity</p>
              <h3 className="font-display text-xl font-bold text-slate-900">
                Custom Colors and Logo
              </h3>
              <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                Upload your company logo, customize module patterns and corner eyes, and verify scannability with our built-in WCAG contrast ratio guard.
              </p>
            </div>
            <div className="mt-6 pt-5 border-t border-slate-100">
              <button
                type="button"
                onClick={() => onTryFeaturePreset('branded')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Preview Branded Theme</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Feature 3 (Span 1): High-Quality Downloads */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <p className="text-xs font-mono text-slate-400 tabular-nums mb-2">03 · Print &amp; Web</p>
              <h3 className="font-display text-xl font-bold text-slate-900">
                High-Quality Downloads
              </h3>
              <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                Export crisp raster PNGs up to <span className="font-mono tabular-nums">2048×2048px</span> for digital sharing, or true vector SVG files for billboards, menus, and product packaging.
              </p>
            </div>
            <p className="mt-6 pt-5 border-t border-slate-100 text-xs text-slate-500">
              <span>PNG up to 2048px</span>
              <span aria-hidden="true" className="mx-2">·</span>
              <span>Infinite-scale SVG</span>
            </p>
          </div>

          {/* Feature 4 (Span 2): Multiple QR Code Types */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <p className="text-xs font-mono text-slate-400 tabular-nums mb-2">04 · 11 Specialized Formats</p>
              <h3 className="font-display text-xl font-bold text-slate-900">
                Multiple QR Code Types
              </h3>
              <p className="mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed">
                Purpose-built encoders format standard payloads for Website URLs, YouTube, WhatsApp click-to-chat, automatic Wi-Fi login, vCard 3.0 digital business cards, Email, Phone dialer, Instagram, Facebook, and Google Maps coordinates.
              </p>
            </div>
            <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onTryFeaturePreset('wifi')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Load Wi-Fi Guest Card</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <button
                type="button"
                onClick={() => onTryFeaturePreset('vcard')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Load vCard Contact</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Feature 5: Mobile Friendly */}
          <div className="md:col-span-1 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
            <p className="text-xs font-mono text-slate-400 tabular-nums mb-2">05 · Cross-Device</p>
            <h3 className="font-display text-xl font-bold text-slate-900">
              Mobile Friendly
            </h3>
            <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
              Create, customize, share, and download codes comfortably on smartphones, tablets, or desktop screens—compatible with native iOS Camera and Android Google Lens.
            </p>
          </div>

          {/* Feature 6: Free to Use */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="max-w-lg">
              <p className="text-xs font-mono text-slate-400 tabular-nums mb-2">06 · No Restrictions</p>
              <h3 className="font-display text-xl font-bold text-slate-900">
                Free to Use — Forever
              </h3>
              <p className="mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed">
                No watermarks, no scan quotas, no forced sign-ups, and no expiring redirect links. Static QR payloads encode your destination directly into the pattern so they remain active indefinitely.
              </p>
            </div>
            <a
              href={`#generator`}
              data-category={QrCategory.Website}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold text-center transition-colors whitespace-nowrap shrink-0"
            >
              Start Generating Free
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
