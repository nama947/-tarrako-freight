import React from 'react';
import { Shield, Clock, Cpu, UserCheck } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const AboutUs: React.FC = () => {
  const { t } = useLanguage();

  const valueIcons = [
    <Shield key="shield" className="w-6 h-6 text-red-500" />,
    <Clock key="clock" className="w-6 h-6 text-red-500" />,
    <Cpu key="cpu" className="w-6 h-6 text-red-500" />,
  ];

  return (
    <section id="qui-som" className="py-20 lg:py-24 bg-[#050811] relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Short Intro */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/50 border border-red-500/30 text-red-400 text-xs font-semibold mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span>{t.about.tag}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.about.title}
          </h2>
          <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed">
            {t.about.desc}
          </p>
        </div>

        {/* 3 Core Values */}
        <div className="mb-20">
          <h3 className="text-xl font-bold text-white text-center mb-8">
            {t.about.valuesTitle}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.about.values.map((val, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#090e1c] border border-slate-800 hover:border-red-500/40 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 group-hover:border-red-500/40 group-hover:bg-red-950/20 transition-colors">
                  {valueIcons[idx]}
                </div>
                <h4 className="text-lg font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                  {val.title}
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 4 Timeline Dates */}
        <div className="mb-20">
          <h3 className="text-xl font-bold text-white text-center mb-10">
            {t.about.timelineTitle}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.about.timeline.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#0b1222] border border-slate-800 relative hover:border-red-500/50 transition-colors group"
              >
                <div className="text-3xl font-black text-red-500 font-mono mb-2">
                  {item.year}
                </div>
                <h4 className="text-base font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership Team (4 Members) */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-xl font-bold text-white">
              {t.about.teamTitle}
            </h3>
            <p className="text-sm text-slate-400 mt-2">
              {t.about.teamSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.about.team.map((member, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#090e1c] border border-slate-800 flex flex-col justify-between hover:border-red-500/40 transition-colors group"
              >
                <div>
                  <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 mb-4 group-hover:text-red-400 group-hover:border-red-500/40 transition-colors">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white group-hover:text-red-400 transition-colors">
                    {member.name}
                  </h4>
                  <p className="text-xs font-medium text-red-400/90 mt-1 mb-3">
                    {member.role}
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
