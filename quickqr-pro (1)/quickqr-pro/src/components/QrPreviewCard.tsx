import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  Check,
  Copy,
  Download,
  FileCode2,
  History,
  QrCode,
  Share2,
  Sparkles,
} from 'lucide-react';
import {
  PayloadValidationResult,
  QrCategory,
  QrStyleConfig,
  SavedQrHistoryItem,
} from '../types/qr';
import { generateQrSvgMarkup, renderQrToPngBlob } from '../utils/qrRenderer';
import { QR_CATEGORIES } from './HeroSection';

interface QrPreviewCardProps {
  activeCategory: QrCategory;
  validation: PayloadValidationResult;
  style: QrStyleConfig;
  onGenerateClick: () => void;
  onTriggerValidationError: () => void;
  history: SavedQrHistoryItem[];
  onRestoreHistoryItem: (item: SavedQrHistoryItem) => void;
}

export const QrPreviewCard: React.FC<QrPreviewCardProps> = ({
  activeCategory,
  validation,
  style,
  onGenerateClick,
  onTriggerValidationError,
  history,
  onRestoreHistoryItem,
}) => {
  const [statusToast, setStatusToast] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [isExportingPng, setIsExportingPng] = useState(false);
  const [shareDrawerOpen, setShareDrawerOpen] = useState(false);

  const showTemporaryStatus = (type: 'success' | 'error', message: string) => {
    setStatusToast({ type, message });
    window.setTimeout(() => {
      setStatusToast((prev) => (prev?.message === message ? null : prev));
    }, 3200);
  };

  // Render live SVG markup whenever payload or style changes
  const renderedQr = useMemo(() => {
    if (!validation.isValid || !validation.payload) return null;
    try {
      return generateQrSvgMarkup(validation.payload, style);
    } catch {
      return null;
    }
  }, [validation.isValid, validation.payload, style]);

  const categoryLabel =
    QR_CATEGORIES.find((c) => c.id === activeCategory)?.label || 'QR Code';

  const handleDownloadPng = async () => {
    if (!validation.isValid || !validation.payload) {
      onTriggerValidationError();
      showTemporaryStatus('error', validation.errorMessage || 'Enter valid data before downloading.');
      return;
    }

    setIsExportingPng(true);
    try {
      const blob = await renderQrToPngBlob(validation.payload, style);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qrcraft-${activeCategory}-${style.size}px.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      onGenerateClick();
      showTemporaryStatus('success', `Downloaded ${style.size}×${style.size} PNG file.`);
    } catch {
      showTemporaryStatus('error', 'Could not export PNG. Try removing corrupted custom logo.');
    } finally {
      setIsExportingPng(false);
    }
  };

  const handleDownloadSvg = () => {
    if (!validation.isValid || !renderedQr) {
      onTriggerValidationError();
      showTemporaryStatus('error', validation.errorMessage || 'Enter valid data before downloading.');
      return;
    }

    const blob = new Blob([renderedQr.svgMarkup], {
      type: 'image/svg+xml;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qrcraft-${activeCategory}-vector.svg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    onGenerateClick();
    showTemporaryStatus('success', 'Downloaded scalable vector SVG file.');
  };

  const handleCopyQr = async () => {
    if (!validation.isValid || !validation.payload) {
      onTriggerValidationError();
      showTemporaryStatus('error', validation.errorMessage || 'Enter valid data first.');
      return;
    }

    try {
      if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
        const blob = await renderQrToPngBlob(validation.payload, style);
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        showTemporaryStatus('success', 'QR code PNG image copied to clipboard.');
        return;
      }
    } catch {
      // Fallback to copying encoded QR text/URL when ClipboardItem image write is restricted in iframe
    }

    try {
      await navigator.clipboard.writeText(validation.payload);
      showTemporaryStatus('success', 'Encoded QR content copied to clipboard.');
    } catch {
      showTemporaryStatus('error', 'Clipboard access is blocked by browser permissions.');
    }
  };

  const handleShareQr = async () => {
    if (!validation.isValid || !validation.payload) {
      onTriggerValidationError();
      showTemporaryStatus('error', validation.errorMessage || 'Enter valid data before sharing.');
      return;
    }

    if (typeof navigator.share === 'function') {
      try {
        const blob = await renderQrToPngBlob(validation.payload, style);
        const file = new File([blob], `qrcraft-${activeCategory}.png`, { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `${categoryLabel} QR Code`,
            text: `Scan this ${categoryLabel} QR code`,
            files: [file],
          });
          showTemporaryStatus('success', 'Shared QR code image.');
          return;
        }
        await navigator.share({
          title: `${categoryLabel} QR Code`,
          text: validation.payload,
        });
        showTemporaryStatus('success', 'Shared QR code content.');
        return;
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') return;
      }
    }

    setShareDrawerOpen((prev) => !prev);
  };

  const handleCopySvgCode = async () => {
    if (!renderedQr) return;
    try {
      await navigator.clipboard.writeText(renderedQr.svgMarkup);
      showTemporaryStatus('success', 'Raw SVG vector markup copied to clipboard.');
    } catch {
      showTemporaryStatus('error', 'Unable to copy SVG code.');
    }
  };

  const handleCopyPayloadText = async () => {
    if (!validation.payload) return;
    try {
      await navigator.clipboard.writeText(validation.payload);
      showTemporaryStatus('success', 'QR target payload copied to clipboard.');
    } catch {
      showTemporaryStatus('error', 'Unable to copy payload.');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5">
      {/* Preview Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-semibold text-slate-900">
            Live QR Preview
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            <span>{categoryLabel}</span>
            <span aria-hidden="true" className="mx-1.5">·</span>
            <span className="font-mono tabular-nums">
              {style.size}×{style.size}px
            </span>
            {renderedQr && (
              <>
                <span aria-hidden="true" className="mx-1.5">·</span>
                <span className="font-mono tabular-nums">ECC {renderedQr.effectiveEcc}</span>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Live Vector QR Stage */}
      <div className="relative flex flex-col items-center justify-center rounded-2xl bg-slate-50 border border-slate-200/80 p-6 min-h-[296px]">
        {renderedQr ? (
          <div className="w-full max-w-[248px] aspect-square rounded-xl overflow-hidden shadow-xs border border-slate-200/60 bg-white flex items-center justify-center">
            <div
              className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:block"
              dangerouslySetInnerHTML={{ __html: renderedQr.svgMarkup }}
            />
          </div>
        ) : (
          <div className="text-center max-w-xs py-6 px-3 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-200/70 text-slate-500 flex items-center justify-center mx-auto">
              <QrCode className="w-7 h-7" />
            </div>
            <p className="text-sm font-semibold text-slate-800">
              {validation.isEmpty ? 'Waiting for Content' : 'Check Input Format'}
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              {validation.errorMessage ||
                'Fill in the required fields on the left to generate a live scannable QR code.'}
            </p>
          </div>
        )}

        {/* Encoded Target Readout */}
        {renderedQr && (
          <p
            title={validation.payload}
            className="mt-4 max-w-full truncate font-mono text-[11px] text-slate-500 px-2"
          >
            {validation.summaryLabel}
          </p>
        )}
      </div>

      {/* Primary Generate Action */}
      <button
        type="button"
        onClick={() => {
          if (!validation.isValid) {
            onTriggerValidationError();
            showTemporaryStatus(
              'error',
              validation.errorMessage || 'Please complete the required input fields.'
            );
            return;
          }
          onGenerateClick();
          showTemporaryStatus('success', 'QR code verified & saved to session history.');
        }}
        className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <Sparkles className="w-4 h-4 shrink-0" />
        <span>Generate QR Code</span>
      </button>

      {/* Download PNG & SVG Buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={handleDownloadPng}
          disabled={isExportingPng}
          className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <Download className="w-4 h-4 shrink-0" />
          <span>{isExportingPng ? 'Exporting...' : 'Download PNG'}</span>
        </button>

        <button
          type="button"
          onClick={handleDownloadSvg}
          className="py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <FileCode2 className="w-4 h-4 shrink-0 text-indigo-600" />
          <span>Download SVG</span>
        </button>
      </div>

      {/* Copy & Share Secondary Actions */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={handleCopyQr}
          className="py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <Copy className="w-3.5 h-3.5 shrink-0" />
          <span>Copy QR</span>
        </button>

        <button
          type="button"
          onClick={handleShareQr}
          aria-expanded={shareDrawerOpen}
          className="py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <Share2 className="w-3.5 h-3.5 shrink-0" />
          <span>Share / Embed</span>
        </button>
      </div>

      {/* Inline Share & Embed Panel (Iframe-safe fallback when native share sheet is unavailable) */}
      {shareDrawerOpen && renderedQr && (
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
          <p className="text-xs font-semibold text-slate-800">Quick Share &amp; Embed Options</p>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={handleCopyPayloadText}
              className="w-full py-2 px-3 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 text-xs font-medium text-slate-700 flex items-center justify-between cursor-pointer"
            >
              <span>Copy encoded QR data / URL</span>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <button
              type="button"
              onClick={handleCopySvgCode}
              className="w-full py-2 px-3 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 text-xs font-medium text-slate-700 flex items-center justify-between cursor-pointer"
            >
              <span>Copy inline &lt;svg&gt; HTML embed code</span>
              <FileCode2 className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      )}

      {/* Feedback Banner */}
      {statusToast && (
        <div
          role={statusToast.type === 'error' ? 'alert' : 'status'}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2 ${
            statusToast.type === 'error'
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}
        >
          {statusToast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          ) : (
            <Check className="w-4 h-4 shrink-0 text-emerald-600" />
          )}
          <span>{statusToast.message}</span>
        </div>
      )}

      {/* Session History */}
      {history.length > 0 && (
        <div className="pt-3 border-t border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
              <History className="w-3.5 h-3.5 text-indigo-600" />
              <span>Recent Codes</span>
            </span>
            <span className="tabular-nums">{history.length} saved</span>
          </div>

          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-0.5">
            {history.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onRestoreHistoryItem(item)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200/80 hover:border-indigo-300 hover:bg-slate-50 text-left flex items-center justify-between gap-2 transition-colors cursor-pointer"
              >
                <span className="text-xs font-medium text-slate-800 truncate">
                  {item.label}
                </span>
                <span className="text-[11px] text-slate-400 font-mono shrink-0 uppercase">
                  {item.category}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
