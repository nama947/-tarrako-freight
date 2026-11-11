import React, { useState } from 'react';
import { Check, ArrowRight, FileText, FileDown } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { SpecSheetModal, ServiceCardData } from './SpecSheetModal';

export const ServicesStorefront: React.FC = () => {
  const { t } = useLanguage();
  const [activeSpecCard, setActiveSpecCard] = useState<ServiceCardData | null>(null);

  const handleQuoteClick = () => {
    const el = document.getElementById('contacte');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="serveis" className="py-20 lg:py-24 bg-[#050811] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/50 border border-red-500/30 text-red-400 text-xs font-semibold mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span>{t.services.tag}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.services.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            {t.services.subtitle}
          </p>
        </div>

        {/* Exactly 3 Service Cards with Technical Specification Sheets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {t.services.cards.map((card) => (
            <div
              key={card.id}
              className="rounded-2xl bg-[#090e1c] border border-slate-800 flex flex-col justify-between overflow-hidden hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-950/20 transition-all duration-300 group"
            >
              <div>
                {/* Card Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090e1c] via-transparent to-transparent opacity-80" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors mb-3">
                    {card.title}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    {card.desc}
                  </p>

                  {/* 3 Advantages with checkmarks */}
                  <div className="space-y-2.5 pt-4 border-t border-slate-800/80 mb-6">
                    {card.benefits.map((benefit, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <div className="w-4 h-4 rounded-full bg-red-950/60 border border-red-500/40 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 text-red-400" />
                        </div>
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* Requadre "Fitxa tècnica" */}
                  <div className="mt-6 pt-5 border-t border-slate-800/80">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-red-950/70 border border-red-500/40 flex items-center justify-center text-red-400">
                          <FileText className="w-3.5 h-3.5" />
                        </div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                          {card.techSpecsTitle}
                        </h4>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveSpecCard(card as ServiceCardData)}
                        className="text-[11px] font-mono text-red-400 hover:text-red-300 flex items-center gap-1 hover:underline cursor-pointer transition-colors"
                        title={t.services.btnDownloadSpec}
                      >
                        <FileDown className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{t.services.btnDownloadSpec}</span>
                        <span className="sm:hidden">PDF</span>
                      </button>
                    </div>

                    <div className="rounded-xl bg-[#060a14] border border-slate-800/90 p-3.5 space-y-2 text-xs">
                      {card.techSpecs.map((item, sIdx) => (
                        <div
                          key={sIdx}
                          className="flex flex-col sm:flex-row sm:items-start gap-0.5 sm:gap-1.5 pb-2 border-b border-slate-850/60 last:border-b-0 last:pb-0"
                        >
                          <span className="font-semibold text-red-400 shrink-0 sm:min-w-[130px]">
                            {item.label}:
                          </span>
                          <span className="text-slate-300 leading-relaxed font-normal">
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Dedicated Download/Print Button */}
                    <button
                      type="button"
                      onClick={() => setActiveSpecCard(card as ServiceCardData)}
                      className="w-full mt-3 py-2.5 px-3 rounded-lg bg-slate-900/90 hover:bg-slate-850 text-slate-200 hover:text-white border border-slate-700/80 hover:border-red-500/60 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer font-mono group/btn shadow-sm"
                    >
                      <FileDown className="w-4 h-4 text-red-500 group-hover/btn:scale-110 transition-transform" />
                      <span>{t.services.btnDownloadSpec}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Price & Action Footer */}
              <div className="p-6 pt-0 mt-auto">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between mb-4">
                  <span className="text-xs text-slate-400">Preu orientatiu:</span>
                  <span className="text-sm font-bold text-white font-mono">
                    {card.priceFrom}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleQuoteClick}
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-red-600 hover:bg-red-500 active:bg-red-700 shadow-lg shadow-red-950/50 flex items-center justify-center gap-2 transition-all cursor-pointer border border-red-400/40"
                >
                  <span>{card.btnText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Downloadable / Printable Technical Spec Sheet Modal */}
      <SpecSheetModal
        isOpen={!!activeSpecCard}
        card={activeSpecCard}
        onClose={() => setActiveSpecCard(null)}
      />
    </section>
  );
};

