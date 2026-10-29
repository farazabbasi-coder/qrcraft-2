import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, ChevronDown, Send } from 'lucide-react';
import { QrCategory } from '../types/qr';
import { QR_CATEGORIES } from './HeroSection';
import { GuideLang } from './HowItWorksSection';

interface FaqAndContactSectionProps {
  guideLang: GuideLang;
  onChangeGuideLang: (lang: GuideLang) => void;
  onJumpToCategory: (cat: QrCategory) => void;
  onLoadStudioSupportVCard: () => void;
}

const FAQ_DATA: Record<GuideLang, { q: string; a: string }[]> = {
  en: [
    {
      q: 'What is a QR code?',
      a: 'A QR (Quick Response) code is a two-dimensional matrix barcode standardized under ISO/IEC 18004. Unlike traditional one-dimensional barcodes, a QR code stores website links, Wi-Fi login credentials, WhatsApp chats, vCard contacts, or text horizontally and vertically so smartphone cameras can read it from any angle in a split second.',
    },
    {
      q: 'How do I create a custom QR code?',
      a: 'Select your desired QR format (such as Website URL, YouTube, WhatsApp, or Wi-Fi), enter your information in the content form, customize the colors, module pattern, or center logo if desired, and click Download PNG or Download SVG.',
    },
    {
      q: 'Is QRCraft completely free to use?',
      a: 'Yes. Every QR code generated on QRCraft is 100% free for both personal and commercial print use. Because your data is encoded directly into a static QR code without third-party redirect links, there are no scan limits, subscriptions, or expiration dates.',
    },
    {
      q: 'How do I download my QR code in PNG and SVG formats?',
      a: 'Once your input is valid, click "Download PNG" in the Live Preview panel for a crisp raster image (up to 2048×2048 pixels) ideal for websites, documents, and social media, or click "Download SVG" for an infinitely scalable vector file ideal for Adobe Illustrator, Figma, flyers, and packaging.',
    },
    {
      q: 'Can these QR codes be scanned by any mobile phone?',
      a: 'Yes. All generated QR codes follow standard Reed-Solomon error correction and finder-eye geometry, making them natively scannable with the built-in iPhone Camera app, Android Camera / Google Lens, WhatsApp scanner, and dedicated barcode readers.',
    },
  ],
  ur: [
    {
      q: 'QR code kya hota hai?',
      a: 'QR (Quick Response) code ek modern 2D barcode hota hai jisme website links, YouTube videos, WhatsApp numbers, Wi-Fi passwords, vCard contacts aur location data store kiya ja sakta hai. Isko kisi bhi smartphone camera se chand seconds mein scan karke direct open kiya ja sakta hai.',
    },
    {
      q: 'QR code kaise banayein?',
      a: 'Sab se pehle apna matlooba QR type (jaise Website, YouTube, WhatsApp ya Wi-Fi) select karein, phir apna link ya details enter karein. Uske baad apni pasand ka color, pattern aur logo choose karein aur Download PNG ya Download SVG button par click karein.',
    },
    {
      q: 'Kya QR code free hai?',
      a: 'Jee haan! Yahan banaye gaye tamam QR codes personal aur commercial istemal ke liye bilkul 100% free hain. In par koi scan limit nahi hoti aur na hi yeh kabhi expire hote hain.',
    },
    {
      q: 'QR code ko PNG aur SVG mein kaise download karein?',
      a: 'Right side par mojood Live QR Preview card mein "Download PNG" aur "Download SVG" ke buttons diye gaye hain. Digital sharing aur social media ke liye PNG (up to 2048px) aur printing ya designing software ke liye vector SVG download karein.',
    },
    {
      q: 'Kya QR code mobile se scan ho sakta hai?',
      a: 'Bilkul! Har QR code standard Reed-Solomon error correction ke saath generate hota hai, is liye iPhone (iOS Camera), Android Camera, Google Lens aur kisi bhi QR scanner app se foran scan ho jata hai—chahe aap ne center mein logo bhi lagaya ho.',
    },
  ],
};

const CONTACT_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const FaqAndContactSection: React.FC<FaqAndContactSectionProps> = ({
  guideLang,
  onChangeGuideLang,
  onJumpToCategory,
  onLoadStudioSupportVCard,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactTopic, setContactTopic] = useState('Print & SVG Export Help');
  const [contactMessage, setContactMessage] = useState('');
  const [contactError, setContactError] = useState<string | null>(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactError(null);

    if (!contactName.trim()) {
      setContactError('Please enter your name.');
      return;
    }
    if (!CONTACT_EMAIL_REGEX.test(contactEmail.trim())) {
      setContactError('Please enter a valid email address.');
      return;
    }
    if (contactMessage.trim().length < 10) {
      setContactError('Please write a brief message (at least 10 characters).');
      return;
    }

    setContactSubmitted(true);
    setContactName('');
    setContactEmail('');
    setContactMessage('');
  };

  const faqs = FAQ_DATA[guideLang];

  return (
    <>
      {/* FAQ Section */}
      <section id="faq" className="py-16 sm:py-24 bg-white border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-medium text-indigo-600 mb-2">
                <span>Frequently Asked Questions</span>
                <span aria-hidden="true" className="mx-2">·</span>
                <span>Scanning &amp; Print Tips</span>
              </p>
              <h2
                className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900"
                style={{ textWrap: 'balance' }}
              >
                Common Questions Answered
              </h2>
            </div>

            <div
              role="group"
              aria-label="FAQ language"
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

          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {faqs.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={item.q} className="py-4">
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between gap-4 py-2 text-left font-display text-base sm:text-lg font-semibold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                      <span>{item.q}</span>
                      <ChevronDown
                        className={`w-5 h-5 shrink-0 text-slate-400 transition-transform duration-150 ${
                          isOpen ? 'rotate-180 text-indigo-600' : ''
                        }`}
                      />
                    </button>
                  </h3>
                  {isOpen && (
                    <p className="pt-2 pb-2 pr-8 text-sm sm:text-base text-slate-600 leading-relaxed">
                      {item.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 sm:py-24 bg-slate-50/70 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-5 space-y-4">
              <p className="text-xs font-medium text-indigo-600">
                <span>Contact &amp; Support</span>
                <span aria-hidden="true" className="mx-2">·</span>
                <span>Print Consultation</span>
              </p>
              <h2
                className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900"
                style={{ textWrap: 'balance' }}
              >
                Need help preparing QR codes for commercial print or events?
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Send us a message for guidance on minimum print dimensions, CMYK contrast recommendations, or bulk event signage.
              </p>

              <div className="pt-4 space-y-3 text-sm text-slate-600">
                <p>
                  <span className="font-semibold text-slate-900">Email:</span>{' '}
                  <a
                    href="mailto:support@qrcraft.studio"
                    className="text-indigo-600 hover:underline"
                  >
                    support@qrcraft.studio
                  </a>
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Recommended Minimum Print Size:</span>{' '}
                  <span className="font-mono tabular-nums">2.0 cm × 2.0 cm</span> (SVG vector)
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onLoadStudioSupportVCard}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs sm:text-sm font-semibold text-slate-800 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Load QRCraft Support vCard in Generator
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
              {contactSubmitted ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-slate-900">
                    Message Received
                  </h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    Thank you for reaching out. Our team has logged your inquiry and will reply to your email shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setContactSubmitted(false)}
                    className="mt-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} noValidate className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Your Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Faraz Abbasi"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Email Address
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-topic" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Topic
                    </label>
                    <select
                      id="contact-topic"
                      value={contactTopic}
                      onChange={(e) => setContactTopic(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 cursor-pointer"
                    >
                      <option>Print &amp; SVG Export Help</option>
                      <option>Custom Branding &amp; Logo Scannability</option>
                      <option>Wi-Fi / vCard Format Question</option>
                      <option>Feature Suggestion</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contact-msg" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Message
                    </label>
                    <textarea
                      id="contact-msg"
                      rows={3}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Tell us how we can help..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                    />
                  </div>

                  {contactError && (
                    <p role="alert" className="text-xs font-medium text-red-600 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{contactError}</span>
                    </p>
                  )}

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Clean Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-200/80">
            <div className="md:col-span-4 space-y-3">
              <a
                href="#home"
                className="font-display text-lg font-bold tracking-tight text-slate-900 inline-block"
              >
                QRCraft
              </a>
              <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
                Fast, privacy-first QR code generator for websites, YouTube, WhatsApp, Wi-Fi, vCards, and Google Maps.
              </p>
            </div>

            <div className="md:col-span-5">
              <h3 className="text-xs font-semibold text-slate-900 mb-3">QR Code Generators</h3>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-slate-600">
                {QR_CATEGORIES.map((cat) => (
                  <li key={cat.id}>
                    <button
                      type="button"
                      onClick={() => onJumpToCategory(cat.id)}
                      className="hover:text-indigo-600 transition-colors text-left cursor-pointer"
                    >
                      {cat.label} QR
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-3">
              <h3 className="text-xs font-semibold text-slate-900 mb-3">Navigation</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <a href="#home" className="hover:text-indigo-600 transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#generator" className="hover:text-indigo-600 transition-colors">
                    QR Generator
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-indigo-600 transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-indigo-600 transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-indigo-600 transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-indigo-600 transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} QRCraft Studio. Free for personal and commercial use.</p>
            <p>
              <span>100% Client-Side Generation</span>
              <span aria-hidden="true" className="mx-2">·</span>
              <span>PNG &amp; Vector SVG</span>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};
