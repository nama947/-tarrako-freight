import React from 'react';
import { Anchor, Ship, ShieldCheck, Truck, ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const HowItWorks: React.FC = () => {
  const { t } = useLanguage();

  const stepIcons = [
    <Anchor key="anchor" className="w-6 h-6 text-red-500" />,
    <Ship key="ship" className="w-6 h-6 text-red-500" />,
    <ShieldCheck key="shield" className="w-6 h-6 text-red-500" />,
    <Truck key="truck" className="w-6 h-6 text-red-500" />,
  ];

  return (
    <section id="com-funciona" className="py-20 lg:py-24 bg-[#070b16] relative border-t border-slate-800/80">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[700px] max-w-full h-[400px] bg-red-950/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/50 border border-red-500/30 text-red-400 text-xs font-semibold mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span>{t.howItWorks.tag}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.howItWorks.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            {t.howItWorks.subtitle}
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {t.howItWorks.steps.map((step, idx) => (
            <div
              key={step.num}
              className="relative rounded-2xl bg-[#0b1222] border border-slate-800/90 p-6 flex flex-col justify-between hover:border-red-500/50 transition-all duration-300 group shadow-lg shadow-black/40"
            >
              <div>
                {/* Step number badge & icon */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:border-red-500/40 group-hover:bg-red-950/20 transition-colors">
                    {stepIcons[idx]}
                  </div>
                  <span className="text-3xl font-black text-slate-700 group-hover:text-red-500/80 transition-colors font-mono">
                    0{step.num}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-red-400 transition-colors">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-300 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {/* Desktop connector arrow (not on last item) */}
              {idx < t.howItWorks.steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-700">
                  <div className="w-6 h-6 rounded-full bg-[#070b16] border border-slate-800 flex items-center justify-center shadow">
                    <ArrowRight className="w-3 h-3 text-red-500" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Callout box under the 4 steps */}
        <div className="mt-12 p-6 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <p className="text-sm text-slate-300">
              <strong className="text-white font-semibold">Port de Tarragona:</strong> Connexió directa sense grues, trincatge certificat i vigilància contínua.
            </p>
          </div>
          <a
            href="#calculadora"
            className="text-xs font-bold text-red-400 hover:text-red-300 inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <span>Calcula el cost del teu viatge</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
