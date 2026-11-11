import React, { useState, useMemo } from 'react';
import { Search, X, BookOpen, ExternalLink, HelpCircle } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const LogisticsGlossary: React.FC = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return t.glossary.items;

    return t.glossary.items.filter(
      (item) =>
        item.term.toLowerCase().includes(query) ||
        item.fullName.toLowerCase().includes(query) ||
        item.desc.toLowerCase().includes(query)
    );
  }, [searchQuery, t.glossary.items]);

  const handleClear = () => {
    setSearchQuery('');
  };

  const handleTermClick = (term: string) => {
    // If user clicks a term, filter by it or scroll to contact if they want more info
    setSearchQuery(term);
  };

  return (
    <section id="glossari" className="py-20 lg:py-24 bg-[#060a14] relative border-t border-slate-800/80">
      {/* Background ambient accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/50 border border-red-500/30 text-red-400 text-xs font-semibold mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t.glossary.tag}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.glossary.title}
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300">
            {t.glossary.subtitle}
          </p>
        </div>

        {/* Real-time Search Filter Bar */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5 text-red-500" />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.glossary.searchPlaceholder}
              className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 shadow-xl transition-all"
              aria-label={t.glossary.searchPlaceholder}
            />

            {searchQuery && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={t.glossary.clearSearch}
                aria-label={t.glossary.clearSearch}
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Quick Counter & Clear Action */}
          <div className="flex items-center justify-between mt-2.5 px-2 text-xs text-slate-400 font-mono">
            <span>
              <strong className="text-red-400 font-bold">{filteredItems.length}</strong>{' '}
              {t.glossary.countLabel}
            </span>

            {searchQuery && (
              <button
                type="button"
                onClick={handleClear}
                className="text-red-400 hover:text-red-300 underline cursor-pointer"
              >
                {t.glossary.clearSearch}
              </button>
            )}
          </div>
        </div>

        {/* Glossary Grid: Compact Cards */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filteredItems.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-[#0a0f1d] border border-slate-800/90 p-5 hover:border-red-500/60 hover:shadow-xl hover:shadow-red-950/20 transition-all group flex flex-col justify-between"
              >
                <div>
                  {/* Term Tag & Icon */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="inline-block px-2.5 py-1 rounded-md bg-red-950/70 border border-red-500/40 text-red-400 font-mono font-bold text-sm tracking-wide group-hover:border-red-400 group-hover:text-red-300 transition-colors">
                      {item.term}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      #{String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Full Name */}
                  <h3 className="text-sm font-semibold text-white group-hover:text-red-300 transition-colors mb-2.5 leading-snug">
                    {item.fullName}
                  </h3>

                  {/* Plain-Language 1-2 sentence explanation */}
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Subtle bottom badge */}
                <div className="mt-4 pt-3 border-t border-slate-850/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 font-mono text-slate-400">
                    <HelpCircle className="w-3 h-3 text-red-500/70" />
                    <span>Concepte logístic</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleTermClick(item.term)}
                    className="text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                    title={item.term}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="text-center py-16 px-4 bg-slate-900/40 rounded-2xl border border-slate-800 max-w-md mx-auto">
            <HelpCircle className="w-10 h-10 text-red-400/60 mx-auto mb-3" />
            <p className="text-slate-300 text-sm mb-4">
              {t.glossary.noResults}
            </p>
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              {t.glossary.clearSearch}
            </button>
          </div>
        )}

        {/* Quick Question / Contact Helper Note */}
        <div className="mt-14 max-w-2xl mx-auto p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="text-xs text-slate-300">
            <span className="font-bold text-white block mb-0.5">
              Tens algun dubte sobre un terme o tràmit duaner?
            </span>
            El nostre equip d'operacions del Port de Tarragona t'ajuda a resoldre'l sense compromís.
          </div>
          <a
            href="#contacte"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-red-600 text-white text-xs font-bold transition-colors shrink-0 cursor-pointer border border-slate-700 hover:border-red-500"
          >
            <span>Preguntar a un assessor</span>
          </a>
        </div>
      </div>
    </section>
  );
};
