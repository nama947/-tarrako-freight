import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const ContactSection: React.FC = () => {
  const { t, lang } = useLanguage();

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [query, setQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !query.trim()) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch('https://formspree.io/f/mjywvwgd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          company: company.trim() || 'N/A',
          email: email.trim(),
          message: query.trim(),
          language: lang,
          submittedAt: new Date().toISOString(),
          _subject: `Sol·licitud de pressupost - TARRAKO FREIGHT (${name.trim()})`,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setName('');
        setCompany('');
        setEmail('');
        setQuery('');
      } else {
        const data = await response.json().catch(() => null);
        if (data && data.errors && data.errors.length > 0) {
          const detail = data.errors.map((err: { message: string }) => err.message).join(', ');
          setErrorMessage(detail || t.contact.errorMsg);
        } else {
          setErrorMessage(t.contact.errorMsg);
        }
      }
    } catch (err) {
      console.error('Error submitting form to Formspree:', err);
      setErrorMessage(t.contact.errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setCompany('');
    setEmail('');
    setQuery('');
    setErrorMessage(null);
    setIsSubmitted(false);
  };

  return (
    <section id="contacte" className="py-20 lg:py-24 bg-[#050811] relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/50 border border-red-500/30 text-red-400 text-xs font-semibold mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span>{t.contact.tag}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.contact.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
          {/* Left Column: Fictitious Contact Info at Port de Tarragona */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-[#090e1c] border border-slate-800 shadow-xl space-y-6">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    {t.contact.addressTitle}
                  </h4>
                  <p className="text-sm font-medium text-white leading-relaxed">
                    {t.contact.address}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4 pt-4 border-t border-slate-800/80">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    {t.contact.phoneTitle}
                  </h4>
                  <p className="text-base font-bold text-white font-mono">
                    {t.contact.phone}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t.contact.phoneHours}</span>
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 pt-4 border-t border-slate-800/80">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    {t.contact.emailTitle}
                  </h4>
                  <p className="text-sm font-bold text-red-400 font-mono">
                    {t.contact.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Reassurance note */}
            <div className="p-5 rounded-2xl bg-[#0b1222] border border-slate-800 text-xs text-slate-300 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Resposta ràpida en menys de 24 hores per part del nostre equip al Port de Tarragona.</span>
            </div>
          </div>

          {/* Right Column: Clean 4-Field Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-2xl bg-[#090e1c] border border-slate-800 shadow-2xl">
              {isSubmitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {t.contact.successTitle}
                  </h3>
                  <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                    {t.contact.successDesc}
                  </p>
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold border border-slate-700 transition-colors"
                    >
                      {t.contact.btnAnother}
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  action="https://formspree.io/f/mjywvwgd"
                  method="POST"
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white">
                      {t.contact.formTitle}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {t.contact.formSubtitle}
                    </p>
                  </div>

                  {/* Error Notification */}
                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <p className="leading-relaxed">{errorMessage}</p>
                    </div>
                  )}

                  {/* 1. Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {t.contact.nameLabel}
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t.contact.namePlaceholder}
                      className="w-full bg-slate-900/90 text-white rounded-xl px-4 py-3 border border-slate-700 focus:border-red-500 focus:outline-none text-sm placeholder-slate-500 transition-colors"
                    />
                  </div>

                  {/* 2. Company (Optional) */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {t.contact.companyLabel}
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder={t.contact.companyPlaceholder}
                      className="w-full bg-slate-900/90 text-white rounded-xl px-4 py-3 border border-slate-700 focus:border-red-500 focus:outline-none text-sm placeholder-slate-500 transition-colors"
                    />
                  </div>

                  {/* 3. Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {t.contact.emailLabel}
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.contact.emailPlaceholder}
                      className="w-full bg-slate-900/90 text-white rounded-xl px-4 py-3 border border-slate-700 focus:border-red-500 focus:outline-none text-sm placeholder-slate-500 transition-colors"
                    />
                  </div>

                  {/* 4. Query / Message */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {t.contact.queryLabel}
                    </label>
                    <textarea
                      required
                      name="message"
                      rows={4}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={t.contact.queryPlaceholder}
                      className="w-full bg-slate-900/90 text-white rounded-xl px-4 py-3 border border-slate-700 focus:border-red-500 focus:outline-none text-sm placeholder-slate-500 resize-none transition-colors"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-red-600 hover:bg-red-500 active:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-red-950/60 flex items-center justify-center gap-2 transition-all cursor-pointer border border-red-400/50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{t.contact.btnSubmitting}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{t.contact.btnSubmit}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
