import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { Language } from '../i18n/translations';

interface LanguageSelectorProps {
  isMobile?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ isMobile = false }) => {
  const { lang, setLang, languageOptions } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentOption = languageOptions.find((opt) => opt.code === lang) || languageOptions[0];

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (code: Language) => {
    setLang(code);
    setIsOpen(false);
  };

  if (isMobile) {
    return (
      <div className="w-full bg-[#0a0f1e]/90 border border-slate-800 rounded-lg p-2.5">
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-slate-400">
            <Globe className="w-3.5 h-3.5 text-red-500" />
            <span>IDIOMA</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-950/60 text-red-400 border border-red-800/40 font-bold">
            {currentOption.shortLabel}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {languageOptions.map((opt) => {
            const isActive = opt.code === lang;
            return (
              <button
                key={opt.code}
                type="button"
                onClick={() => handleSelect(opt.code)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg border text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-red-600 text-white border-red-500 font-bold shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                    : 'bg-[#0f172a]/70 hover:bg-[#1e293b] text-slate-300 border-slate-700/60'
                }`}
              >
                <span className="font-mono text-xs font-bold tracking-wider">{opt.shortLabel}</span>
                <span className="text-[10px] text-slate-300 mt-0.5 font-sans">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="relative inline-block text-left shrink-0" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Seleccionar idioma"
        className={`group relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#090d19] border text-xs font-mono font-medium transition-all duration-200 shrink-0 cursor-pointer ${
          isOpen
            ? 'border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.35)]'
            : 'border-slate-800 hover:border-red-500/60 text-slate-300 hover:text-white hover:bg-[#0f1629]'
        }`}
      >
        <Globe className="w-3.5 h-3.5 text-red-500 transition-transform duration-300 group-hover:rotate-45 shrink-0" />
        <span className="tracking-wider font-bold text-slate-200 group-hover:text-white">
          {currentOption.shortLabel}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-red-400' : 'group-hover:text-slate-200'
          }`}
        />
      </button>

      {/* Cyberpunk Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl bg-[#0a0f1d] border border-red-500/40 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.8),0_0_15px_rgba(239,68,68,0.15)] z-50 backdrop-blur-md overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-1.5 bg-[#050811] border-b border-slate-800 text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>IDIOMA</span>
            <span className="text-red-400 font-semibold">{currentOption.shortLabel}</span>
          </div>

          <div className="p-1 space-y-1">
            {languageOptions.map((opt) => {
              const isActive = opt.code === lang;
              return (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => handleSelect(opt.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-red-600 text-white font-semibold shadow-inner'
                      : 'text-slate-300 hover:bg-[#151f35] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-red-400 group-hover:text-white">
                      {opt.shortLabel}
                    </span>
                    <span className="text-xs font-sans">{opt.label}</span>
                  </div>
                  {isActive && <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
