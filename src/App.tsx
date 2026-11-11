import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { ServicesStorefront } from './components/ServicesStorefront';
import { SimpleCalculator } from './components/SimpleCalculator';
import { AboutUs } from './components/AboutUs';
import { BlogSection } from './components/BlogSection';
import { LogisticsGlossary } from './components/LogisticsGlossary';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FaqAssistant } from './components/FaqAssistant';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('inici');

  // Scroll spy effect: dynamically updates the active navigation tab based on scroll position
  useEffect(() => {
    const sectionIds = [
      'inici',
      'com-funciona',
      'serveis',
      'calculadora',
      'qui-som',
      'blog',
      'glossari',
      'contacte',
    ];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const element = document.getElementById(id);
        if (element) {
          const top = element.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#050811] text-slate-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
        {/* 1. Single Authoritative Header with Language Selector & Demana Pressupost */}
        <Header activeSection={activeSection} onNavigate={handleNavigate} />

        <main className="flex-1 w-full max-w-full overflow-x-hidden">
          {/* 2. INICI (Hero) */}
          <Hero />

          {/* 3. COM FUNCIONA (4 Passos) */}
          <HowItWorks />

          {/* 4. SERVEIS (3 Targetes) */}
          <ServicesStorefront />

          {/* 5. CALCULADORA DE PREU (Senzilla) */}
          <SimpleCalculator />

          {/* 6. QUI SOM (Valors, Línia de temps, Equip) */}
          <AboutUs />

          {/* 7. BLOG (3 Articles) */}
          <BlogSection />

          {/* 8. GLOSSARI (14 Termes clau + Cercador) */}
          <LogisticsGlossary />

          {/* 9. CONTACTE (Port de Tarragona + Formulari) */}
          <ContactSection />
        </main>

        {/* 10. FOOTER (Fosc, Àmbit estudiantil, Imatges IA, Textos legals) */}
        <Footer />

        {/* 11. ASSISTENT DE PREGUNTES FREQÜENTS (FAQ flotant interactiu sense IA) */}
        <FaqAssistant />
      </div>
    </LanguageProvider>
  );
}
