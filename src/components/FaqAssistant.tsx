import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, ArrowRight, RotateCcw, Bot, User, Sparkles } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  hasAction?: boolean;
}

export const FaqAssistant: React.FC = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize or reset chat on open or language switch
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text: t.faqAssistant.greeting,
      },
    ]);
  }, [t.faqAssistant.greeting]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSelectQuestion = (qId: string) => {
    const qItem = t.faqAssistant.questions.find((q) => q.id === qId);
    if (!qItem) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: qItem.question,
    };

    const botMsg: ChatMessage = {
      id: `bot-${Date.now() + 1}`,
      sender: 'assistant',
      text: qItem.answer,
      hasAction: 'hasAction' in qItem ? Boolean((qItem as { hasAction?: boolean }).hasAction) : false,
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
  };

  const handleGoToContact = () => {
    setIsOpen(false);
    const element = document.getElementById('contacte');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: t.faqAssistant.greeting,
      },
    ]);
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <aside aria-label="Assistent de preguntes freqüents">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 p-3.5 sm:p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center cursor-pointer group ${
            isOpen
              ? 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700 rotate-90 scale-95'
              : 'bg-red-600 hover:bg-red-500 text-white border border-red-400/50 shadow-red-950/70 hover:scale-105 active:scale-95 animate-bounce-subtle'
          }`}
          aria-label={t.faqAssistant.buttonTitle}
          title={t.faqAssistant.buttonTitle}
        >
          {isOpen ? (
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <div className="relative">
              <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400" />
            </div>
          )}
        </button>
      </aside>

      {/* Chat Pop-up Window */}
      {isOpen && (
        <section
          aria-label="Finestra de l'Assistent Tarrako"
          className="fixed bottom-20 right-3 sm:bottom-22 sm:right-6 z-40 w-[calc(100vw-24px)] sm:w-[390px] h-[520px] max-h-[calc(100vh-100px)] bg-[#070b14] border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn"
        >
          {/* Header */}
          <div className="px-4 py-3.5 bg-[#0a0f1d] border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-950/80 border border-red-500/50 flex items-center justify-center text-red-400 shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-white tracking-wide">
                    {t.faqAssistant.title}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {t.faqAssistant.badgeOnline} · Port de Tarragona
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors cursor-pointer"
                title={t.faqAssistant.resetChat}
                aria-label={t.faqAssistant.resetChat}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors cursor-pointer"
                aria-label="Tancar assistent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#050811]/90">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 text-xs ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-6 h-6 rounded-full bg-red-950 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-md ${
                      isUser
                        ? 'bg-red-600 text-white rounded-br-none border border-red-400/40'
                        : 'bg-[#0f172a] text-slate-200 rounded-bl-none border border-slate-800'
                    }`}
                  >
                    <p>{msg.text}</p>

                    {/* Action button inside response (for question 5) */}
                    {msg.hasAction && (
                      <div className="mt-2.5 pt-2 border-t border-slate-700/60">
                        <button
                          type="button"
                          onClick={handleGoToContact}
                          className="w-full py-2 px-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md cursor-pointer border border-red-400/50"
                        >
                          <span>{t.faqAssistant.btnGoToContact}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          {/* FAQ Questions Buttons Area */}
          <div className="p-3 bg-[#0a0f1d] border-t border-slate-800 shrink-0">
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-slate-400 mb-2">
              <Sparkles className="w-3 h-3 text-red-500" />
              <span>{t.faqAssistant.quickQuestionsLabel}</span>
            </div>

            <div className="flex flex-col gap-1.5 max-h-[155px] overflow-y-auto pr-1">
              {t.faqAssistant.questions.map((q) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => handleSelectQuestion(q.id)}
                  className="w-full text-left px-3 py-2 rounded-lg bg-slate-900/90 hover:bg-red-950/60 border border-slate-800 hover:border-red-500/50 text-slate-200 hover:text-white text-xs transition-all cursor-pointer flex items-center justify-between gap-2 group shadow-sm active:scale-[0.99]"
                >
                  <span className="leading-snug">{q.question}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-red-400 shrink-0 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};
