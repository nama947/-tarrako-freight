import React from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const Hero: React.FC = () => {
  const { t } = useLanguage();

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="inici" className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden bg-[#050811]">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 -z-10 w-[600px] max-w-full h-[600px] bg-red-950/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 -z-10 w-96 max-w-full h-96 bg-blue-950/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & 2 CTAs */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Tag badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-950/40 border border-red-500/30 text-xs font-semibold text-red-400 mb-6 w-fit">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>PORT DE TARRAGONA · TARRAKO FREIGHT</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15] text-balance">
              {t.hero.headline}
            </h1>

            {/* Subheadline */}
            <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
              {t.hero.subheadline}
            </p>

            {/* Two Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => handleScrollTo('contacte')}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 text-base font-bold text-white bg-red-600 hover:bg-red-500 active:bg-red-700 rounded-xl shadow-lg shadow-red-950/60 transition-all cursor-pointer border border-red-400/50"
              >
                <span>{t.hero.btnQuote}</span>
                <ArrowRight className="w-5 h-5 text-white" />
              </button>

              <button
                type="button"
                onClick={() => handleScrollTo('serveis')}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-base font-semibold text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                <span>{t.hero.btnServices}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Right Column: Large Sharp Photograph */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#0a0f1d] shadow-2xl shadow-black/80 group">
              <div className="relative aspect-[16/10] sm:aspect-[16/11] overflow-hidden">
                <img
                  src="/images/pctc_car_carrier_vessel_1793810685130.jpg"
                  alt="Vaixell portavehicles PCTC al Port de Tarragona"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-transparent to-transparent opacity-80" />

                {/* Subdued status badge */}
                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-slate-700/80 px-3 py-1 rounded-full text-xs text-slate-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Terminal Moll de Cantàbria</span>
                </div>
              </div>

              {/* Photo Caption */}
              <div className="p-4 bg-slate-950/95 border-t border-slate-800/80">
                <p className="text-xs text-slate-400 flex items-center justify-between">
                  <span>{t.hero.photoCaption}</span>
                  <span className="text-red-400 font-semibold">Tarragona Hub</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Large Simple Figures */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 p-8 rounded-2xl bg-[#090e1c] border border-slate-800 shadow-xl">
          <div className="text-center md:text-left border-b md:border-b-0 md:border-r border-slate-800 pb-6 md:pb-0 md:pr-6">
            <div className="text-3xl sm:text-4xl font-black text-white font-mono text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-white">
              {t.hero.stat1Number}
            </div>
            <div className="text-sm font-medium text-slate-300 mt-2">
              {t.hero.stat1Label}
            </div>
          </div>

          <div className="text-center md:text-left border-b md:border-b-0 md:border-r border-slate-800 pb-6 md:pb-0 md:pr-6">
            <div className="text-3xl sm:text-4xl font-black text-white font-mono text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-white">
              {t.hero.stat2Number}
            </div>
            <div className="text-sm font-medium text-slate-300 mt-2">
              {t.hero.stat2Label}
            </div>
          </div>

          <div className="text-center md:text-left">
            <div className="text-3xl sm:text-4xl font-black text-white font-mono text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-white">
              {t.hero.stat3Number}
            </div>
            <div className="text-sm font-medium text-slate-300 mt-2">
              {t.hero.stat3Label}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
