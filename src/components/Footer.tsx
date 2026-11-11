import React, { useState } from 'react';
import { ShieldAlert, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const [activeModal, setActiveModal] = useState<'avis' | 'privacitat' | 'cookies' | null>(null);

  const modalContent = activeModal ? t.legalModals[activeModal] : null;

  return (
    <footer className="bg-[#03060d] text-slate-400 border-t border-slate-800/90 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-slate-800/80">
          {/* Brand Info */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/tarrako_freight_logo_tight.png"
                alt="TARRAKO FREIGHT"
                className="h-7 sm:h-8 w-auto object-contain shrink-0"
              />
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-black tracking-wider text-white">
                  TARRAKO{' '}
                  <span className="text-red-500 font-semibold">
                    FREIGHT
                  </span>
                </span>
                <span className="text-[10px] font-mono tracking-widest text-slate-400">
                  PORT DE TARRAGONA · RO-RO & PCTC
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              {t.footer.brandDesc}
            </p>

            {/* Academic Notice Banner */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-amber-500/30 text-amber-300/90 text-xs flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                {t.footer.academicNotice}
              </p>
            </div>
          </div>

          {/* Quick Links & AI Attribution */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-4 md:items-end md:text-right">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                Port de Tarragona Hub
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Edifici Tarrako Tower, Moll de Cantàbria s/n<br />
                43004 Port de Tarragona, Espanya
              </p>
            </div>

            <div className="text-xs text-slate-500">
              <p>{t.footer.imageCredit}</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Legal Links, Version & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
            <span>© {new Date().getFullYear()} TARRAKO FREIGHT. {t.footer.rights}</span>
            <span className="hidden sm:inline text-slate-700">•</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t.footer.versionText}</span>
            </span>
          </div>

          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setActiveModal('avis')}
              className="hover:text-red-400 transition-colors cursor-pointer"
            >
              {t.footer.legalNotice}
            </button>
            <button
              type="button"
              onClick={() => setActiveModal('privacitat')}
              className="hover:text-red-400 transition-colors cursor-pointer"
            >
              {t.footer.privacy}
            </button>
            <button
              type="button"
              onClick={() => setActiveModal('cookies')}
              className="hover:text-red-400 transition-colors cursor-pointer"
            >
              {t.footer.cookies}
            </button>
          </div>
        </div>
      </div>

      {/* Legal Modals */}
      {modalContent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg bg-[#0a0f1e] border border-red-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-xs font-mono text-red-400 uppercase tracking-wider mb-2">
              {t.legalModals.header}
            </div>

            <h3 className="text-xl font-bold text-white mb-4">
              {modalContent.title}
            </h3>

            <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              <p>{modalContent.p1}</p>
              <p>{modalContent.p2}</p>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                {t.legalModals.btnClose}
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
