import React, { useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

interface HeaderProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeSection, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  const navItems = [
    { id: 'inici', label: t.nav.inici },
    { id: 'com-funciona', label: t.nav.comFunciona },
    { id: 'serveis', label: t.nav.serveis },
    { id: 'calculadora', label: t.nav.calculadora },
    { id: 'qui-som', label: t.nav.quiSom },
    { id: 'blog', label: t.nav.blog },
    { id: 'glossari', label: t.nav.glossari },
    { id: 'contacte', label: t.nav.contacte },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const handleQuoteClick = () => {
    onNavigate('contacte');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#060911]/95 backdrop-blur-md border-b border-slate-800/80 transition-colors shadow-2xl">
      {/* Top subtle cyber tech line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-red-600 via-blue-500/80 to-red-600" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand with Logo */}
        <a
          href="#inici"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('inici');
          }}
          className="flex items-center gap-2 sm:gap-2.5 group shrink min-w-0"
          aria-label="TARRAKO FREIGHT - Port de Tarragona"
        >
          <img
            src="/assets/aistudio/tarrako_freight_logo_tight.png"
            alt="Logotip TARRAKO FREIGHT"
            className="h-6 sm:h-7 w-auto object-contain shrink-0 group-hover:opacity-90 transition-opacity"
          />

          <div className="flex flex-col min-w-0">
            <span className="font-extrabold text-xs sm:text-sm tracking-wide text-white whitespace-nowrap leading-tight">
              TARRAKO{' '}
              <span className="text-red-500 font-semibold">
                FREIGHT
              </span>
            </span>
            {/* Subtle sublabel visible from md: */}
            <span className="hidden md:block text-[9px] text-slate-400 font-mono tracking-wider truncate leading-tight mt-0.5">
              {t.nav.sublabelPort}
            </span>
          </div>
        </a>

        {/* Desktop Navigation Bar */}
        <nav
          className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-semibold tracking-wide"
          aria-label="Navegació principal"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap relative group ${
                  isActive
                    ? 'text-white bg-red-950/60 border border-red-500/60 shadow-sm shadow-red-950/40 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-red-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action: Language Selector + Demana Pressupost + Mobile Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <LanguageSelector />

          {/* Demana pressupost CTA Button (hidden on mobile, visible from sm) */}
          <button
            type="button"
            onClick={handleQuoteClick}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-500 active:bg-red-700 rounded-lg shadow-lg shadow-red-950/50 transition-all cursor-pointer border border-red-400/50"
          >
            <span>{t.nav.demanaPressupost}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg cursor-pointer shrink-0"
            aria-label={mobileMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-red-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-3 pb-6 bg-[#070b14] border-b border-slate-800/90 shadow-2xl space-y-3">
          <div className="mb-2">
            <LanguageSelector isMobile={true} />
          </div>

          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                  activeSection === item.id
                    ? 'text-white bg-red-950/60 border border-red-500/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <span>{item.label}</span>
                {activeSection === item.id && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                )}
              </button>
            ))}
          </div>

          {/* Mobile Quote CTA */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleQuoteClick}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-red-600 hover:bg-red-500 flex items-center justify-center gap-2 shadow-lg shadow-red-950/50"
            >
              <span>{t.nav.demanaPressupost}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
