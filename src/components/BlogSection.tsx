import React, { useState } from 'react';
import { BookOpen, Calendar, Clock, ArrowRight, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const BlogSection: React.FC = () => {
  const { t } = useLanguage();
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  const selectedArticle = t.blog.articles.find((a) => a.id === selectedArticleId) || null;

  return (
    <section id="blog" className="py-20 lg:py-24 bg-[#070b16] relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/50 border border-red-500/30 text-red-400 text-xs font-semibold mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span>{t.blog.tag}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.blog.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            {t.blog.subtitle}
          </p>
        </div>

        {/* 3 Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {t.blog.articles.map((article) => (
            <article
              key={article.id}
              className="rounded-2xl bg-[#0b1222] border border-slate-800 p-6 flex flex-col justify-between hover:border-red-500/50 hover:shadow-xl hover:shadow-red-950/20 transition-all duration-300 group"
            >
              <div>
                {/* Meta: Date & Read Time */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-4 pb-3 border-b border-slate-800/80">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-red-400" />
                    <span>{article.date}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{article.readTime}</span>
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors mb-3 leading-snug">
                  {article.title}
                </h3>

                {/* 1-sentence excerpt */}
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  {article.excerpt}
                </p>
              </div>

              {/* Read button */}
              <button
                type="button"
                onClick={() => setSelectedArticleId(article.id)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-200 bg-slate-900 hover:bg-red-600 hover:text-white border border-slate-700 hover:border-red-500 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{t.blog.btnRead}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </article>
          ))}
        </div>
      </div>

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-2xl bg-[#0a0f1e] border border-red-500/50 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedArticleId(null)}
              className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label={t.blog.btnClose}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
              <span className="flex items-center gap-1 text-red-400 font-semibold">
                <Calendar className="w-3.5 h-3.5" />
                <span>{selectedArticle.date}</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{selectedArticle.readTime}</span>
              </span>
            </div>

            <h3 className="text-2xl font-black text-white mb-6 pr-8 leading-tight">
              {selectedArticle.title}
            </h3>

            {/* Article Content Paragraphs */}
            <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              {selectedArticle.content.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Footer Close */}
            <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedArticleId(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold border border-slate-700 transition-colors"
              >
                {t.blog.btnClose}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
