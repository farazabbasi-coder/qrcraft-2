import React, { useState } from 'react';
import { QrCode } from 'lucide-react';
import hospitalityImg from '../assets/images/about_qr_hospitality_1793271329973.jpg';
import packagingImg from '../assets/images/about_qr_packaging_1793271330449.jpg';

export type GuideLang = 'en' | 'ur';

interface HowItWorksSectionProps {
  guideLang: GuideLang;
  onChangeGuideLang: (lang: GuideLang) => void;
}

const STEPS_CONTENT: Record<
  GuideLang,
  { num: string; title: string; desc: string }[]
> = {
  en: [
    {
      num: '01',
      title: 'Select QR Code Type',
      desc: 'Pick from 11 dedicated formats such as Website URL, YouTube Video, WhatsApp Chat, Wi-Fi Login, or Contact vCard.',
    },
    {
      num: '02',
      title: 'Enter Your Information',
      desc: 'Type or paste your destination link, network credentials, or contact details with instant format validation.',
    },
    {
      num: '03',
      title: 'Customize Colors & Logo',
      desc: 'Choose module shapes, corner finder eyes, brand colors, and upload your logo while preserving camera scannability.',
    },
    {
      num: '04',
      title: 'Download PNG or SVG',
      desc: 'Export high-resolution PNG files for social media or crisp vector SVG files ready for commercial print.',
    },
  ],
  ur: [
    {
      num: '01',
      title: 'QR code type select karein',
      desc: 'Website URL, YouTube Video, WhatsApp, Wi-Fi, vCard ya Google Maps mein se apni zaroorat ka QR format chunein.',
    },
    {
      num: '02',
      title: 'Apni information enter karein',
      desc: 'Apna link, phone number, Wi-Fi details ya message enter karein — live preview foran update hota hai.',
    },
    {
      num: '03',
      title: 'QR code customize karein',
      desc: 'Apne brand ke mutabiq QR color, background, module pattern aur center logo upload karein.',
    },
    {
      num: '04',
      title: 'QR code download karein',
      desc: 'High-quality PNG ya print-ready vector SVG format mein ek click se download ya share karein.',
    },
  ],
};

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  guideLang,
  onChangeGuideLang,
}) => {
  const [img1Failed, setImg1Failed] = useState(false);
  const [img2Failed, setImg2Failed] = useState(false);

  const steps = STEPS_CONTENT[guideLang];

  return (
    <>
      {/* How It Works Section */}
      <section className="py-16 sm:py-24 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-xs font-medium text-indigo-600 mb-2">
                <span>Simple 4-Step Workflow</span>
                <span aria-hidden="true" className="mx-2">·</span>
                <span>Under 30 Seconds</span>
              </p>
              <h2
                className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900"
                style={{ textWrap: 'balance' }}
              >
                How It Works
              </h2>
            </div>

            {/* Clean Language Toggle for Guides */}
            <div
              role="group"
              aria-label="Guide language"
              className="inline-flex p-1 bg-slate-100 rounded-xl self-start sm:self-auto"
            >
              <button
                type="button"
                onClick={() => onChangeGuideLang('en')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  guideLang === 'en'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => onChangeGuideLang('ur')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  guideLang === 'ur'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Roman Urdu
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div
                key={step.num}
                className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-sm font-semibold text-indigo-600 tabular-nums">
                    {step.num}.
                  </span>
                  <h3 className="mt-3 font-display text-lg font-bold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About & Real-World Applications Section */}
      <section id="about" className="py-16 sm:py-24 bg-slate-50/70 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <div className="lg:col-span-5 flex flex-col justify-center">
              <p className="text-xs font-medium text-indigo-600 mb-2">
                <span>About QRCraft</span>
                <span aria-hidden="true" className="mx-2">·</span>
                <span>Privacy-First Architecture</span>
              </p>
              <h2
                className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900"
                style={{ textWrap: 'balance' }}
              >
                Designed for businesses, creators, and everyday print materials
              </h2>
              <p className="mt-4 text-base text-slate-600 leading-relaxed">
                Many online QR tools wrap your links inside paid tracking shorteners that deactivate after a trial period. QRCraft encodes your exact destination directly into the ISO-standard QR matrix inside your browser.
              </p>
              <p className="mt-3 text-base text-slate-600 leading-relaxed">
                Whether you are printing restaurant table menus, adding YouTube video tutorials to product boxes, or sharing office Wi-Fi access with guests, your data never leaves your device and your codes never expire.
              </p>

              <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-3 gap-4">
                <div>
                  <p className="font-display text-2xl font-bold text-slate-900 tabular-nums">100%</p>
                  <p className="text-xs text-slate-500 mt-0.5">Browser-side privacy</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-slate-900 tabular-nums">11</p>
                  <p className="text-xs text-slate-500 mt-0.5">Direct QR protocols</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-slate-900 tabular-nums">2048px</p>
                  <p className="text-xs text-slate-500 mt-0.5">PNG + Vector SVG</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Showcase Image Card 1 */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
                <div className="aspect-[4/3] w-full bg-slate-100 relative overflow-hidden">
                  {!img1Failed ? (
                    <img
                      src={hospitalityImg}
                      alt="Minimalist cafe tabletop stand displaying a printed QR code menu next to a coffee cup"
                      referrerPolicy="no-referrer"
                      onError={() => setImg1Failed(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-slate-100 flex flex-col items-center justify-center p-6 text-center">
                      <QrCode className="w-10 h-10 text-indigo-600 mb-2" />
                      <span className="text-xs font-medium text-slate-600">Hospitality &amp; Menus</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-display text-base font-bold text-slate-900">
                    Cafes, Restaurants &amp; Guest Wi-Fi
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Let guests view digital menus or join WPA2 Wi-Fi networks with a single camera scan—no typing long passwords.
                  </p>
                </div>
              </div>

              {/* Showcase Image Card 2 */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
                <div className="aspect-[4/3] w-full bg-slate-100 relative overflow-hidden">
                  {!img2Failed ? (
                    <img
                      src={packagingImg}
                      alt="Minimalist white retail packaging box and printed business card featuring a custom QR code"
                      referrerPolicy="no-referrer"
                      onError={() => setImg2Failed(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-indigo-50 flex flex-col items-center justify-center p-6 text-center">
                      <QrCode className="w-10 h-10 text-indigo-600 mb-2" />
                      <span className="text-xs font-medium text-slate-600">Packaging &amp; Print Cards</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-display text-base font-bold text-slate-900">
                    Retail Packaging &amp; vCard Networking
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Export sharp SVG vectors for business cards, product labels, and YouTube setup guides at any print size.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
