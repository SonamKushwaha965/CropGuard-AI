import React, { useState } from 'react';
import { Download, Smartphone, X, Check } from 'lucide-react';
import { usePWAInstall } from '../utils/usePWAInstall';

interface PWAInstallButtonProps {
  language?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed to Home Screen / standalone mode, hide prompt
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow (supports native install prompt)
  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="inline-flex items-center gap-1.5 rounded-lg bg-[#15803d] px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#166534] transition-colors whitespace-nowrap cursor-pointer"
        title="Add Smart Crop Disease Detection to your Home Screen for full offline use"
      >
        <Download className="h-3.5 w-3.5" />
        Add to Home Screen
      </button>
    );
  }

  // iOS Safari flow (guided step-by-step instructions)
  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-800/25 bg-white px-3 py-1.5 text-xs font-semibold text-[#0f5123] hover:bg-emerald-50 transition-colors whitespace-nowrap cursor-pointer"
          title="Install on iPhone / iPad"
        >
          <Smartphone className="h-3.5 w-3.5 text-[#15803d]" />
          Install App
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2 text-base font-bold text-slate-900">
                  <Smartphone className="h-5 w-5 text-[#15803d]" />
                  Add to iPhone / iPad
                </div>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="rounded-lg p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[#0f5123] font-bold">
                    1
                  </span>
                  <span>
                    Tap the <strong>Share</strong> icon (square with upward arrow) in the Safari toolbar at the bottom.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[#0f5123] font-bold">
                    2
                  </span>
                  <span>
                    Scroll down and tap <strong>Add to Home Screen</strong>.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[#0f5123] font-bold">
                    3
                  </span>
                  <span>
                    Tap <strong>Add</strong> in the top-right corner to access Smart Crop anytime offline in the field.
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-[#0f5123] py-2.5 text-xs font-bold text-white hover:bg-[#14532d] transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Always render an Add to Home Screen button fallback that can trigger browser install or guidance
  return (
    <button
      type="button"
      onClick={() => {
        // Trigger install if prompt exists or alert guide
        if (!install()) {
          alert('To add this app to your Home Screen: tap your browser menu (⋮) and select "Add to Home screen" or "Install App".');
        }
      }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-800/25 bg-white px-3 py-1.5 text-xs font-semibold text-[#0f5123] hover:bg-emerald-50 transition-colors whitespace-nowrap cursor-pointer"
      title="Add Smart Crop Disease Detection to your Home Screen"
    >
      <Download className="h-3.5 w-3.5 text-[#15803d]" />
      Install App
    </button>
  );
};
