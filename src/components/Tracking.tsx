import React, { useState } from 'react';
import {
  Search,
  Package,
  User,
  MapPin,
  Navigation,
  Calendar,
  AlertCircle,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  Ship,
  Warehouse,
  Flag,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface ShipmentRecord {
  tracking_code?: string;
  code?: string;
  codi?: string;
  client?: string;
  customer?: string;
  cliente?: string;
  origin?: string;
  origen?: string;
  destination?: string;
  desti?: string;
  destino?: string;
  location?: string;
  ubicacio?: string;
  ubicacion?: string;
  eta?: string;
  estimated_arrival?: string;
  arribada?: string;
  status?: string;
  estat?: string;
  estado?: string;
  [key: string]: string | undefined;
}

interface TrackingProps {
  onBackHome: () => void;
}

const SHEETDB_URL = 'https://sheetdb.io/api/v1/reprx64p44rlx';

function normalizeStatus(rawStatus: string): string {
  return rawStatus
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function getProgressConfig(rawStatus: string) {
  const norm = normalizeStatus(rawStatus);

  if (norm.includes('lliurat') || norm.includes('entregado') || norm.includes('delivered')) {
    return {
      percent: 100,
      barColor: 'bg-emerald-500',
      badgeClass: 'bg-emerald-950/70 text-emerald-400 border-emerald-500/40',
      glowClass: 'shadow-emerald-500/30',
      stepIndex: 2,
    };
  }

  if (norm.includes('transit') || norm.includes('transito')) {
    return {
      percent: 50,
      barColor: 'bg-blue-500',
      badgeClass: 'bg-blue-950/70 text-blue-400 border-blue-500/40',
      glowClass: 'shadow-blue-500/30',
      stepIndex: 1,
    };
  }

  if (norm.includes('magatzem') || norm.includes('almacen') || norm.includes('warehouse')) {
    return {
      percent: 10,
      barColor: 'bg-red-500',
      badgeClass: 'bg-red-950/70 text-red-400 border-red-500/40',
      glowClass: 'shadow-red-500/30',
      stepIndex: 0,
    };
  }

  return {
    percent: 10,
    barColor: 'bg-red-500',
    badgeClass: 'bg-slate-900 text-slate-300 border-slate-700',
    glowClass: 'shadow-red-500/20',
    stepIndex: 0,
  };
}

export const Tracking: React.FC<TrackingProps> = ({ onBackHome }) => {
  const { t } = useLanguage();

  const [codeInput, setCodeInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ShipmentRecord | null>(null);
  const [errorType, setErrorType] = useState<'empty' | 'not_found' | 'server_error' | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const codi = codeInput.trim();

    if (!codi) {
      setErrorType('empty');
      setResult(null);
      return;
    }

    setIsLoading(true);
    setErrorType(null);
    setResult(null);

    console.log('Cercant codi:', codi);

    try {
      const response = await fetch(
        `${SHEETDB_URL}/search?tracking_code=${encodeURIComponent(codi)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      console.log('Dades rebudes:', data);

      if (!Array.isArray(data) || data.length === 0) {
        setErrorType('not_found');
      } else {
        setResult(data[0] as ShipmentRecord);
      }
    } catch {
      setErrorType('server_error');
    } finally {
      setIsLoading(false);
    }
  };

  const displayCode =
    result?.tracking_code || result?.code || result?.codi || '—';
  const displayClient =
    result?.client || result?.customer || result?.cliente || '—';
  const displayOrigin =
    result?.origin || result?.origen || '—';
  const displayDestination =
    result?.destination || result?.desti || result?.destino || '—';
  const displayLocation =
    result?.location || result?.ubicacio || result?.ubicacion || '—';
  const displayEta =
    result?.eta || result?.estimated_arrival || result?.arribada || '—';
  const displayStatus =
    result?.status || result?.estat || result?.estado || '—';

  const progress = getProgressConfig(displayStatus);

  const stages = [
    {
      label: t.tracking.stages.warehouse,
      icon: Warehouse,
      reached: progress.stepIndex >= 0,
      active: progress.stepIndex === 0,
    },
    {
      label: t.tracking.stages.inTransit,
      icon: Ship,
      reached: progress.stepIndex >= 1,
      active: progress.stepIndex === 1,
    },
    {
      label: t.tracking.stages.delivered,
      icon: CheckCircle2,
      reached: progress.stepIndex >= 2,
      active: progress.stepIndex === 2,
    },
  ];

  return (
    <section className="min-h-[calc(100vh-160px)] py-14 sm:py-20 bg-[#050811] relative overflow-hidden">
      {/* Subtle Background Grid & Red Radial Accent */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 0%, rgba(220, 38, 38, 0.22), transparent 55%)',
        }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Back Home Link */}
        <div className="mb-8">
          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-red-500 group-hover:-translate-x-0.5 transition-transform" />
            <span>{t.tracking.btnBackHome}</span>
          </button>
        </div>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/50 border border-red-500/30 text-red-400 text-xs font-semibold mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span>{t.tracking.tag}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {t.tracking.title}
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            {t.tracking.subtitle}
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-[#090e1c] border border-slate-800 rounded-2xl p-5 sm:p-8 shadow-2xl mb-8">
          <form onSubmit={handleSearch} className="space-y-3">
            <label
              htmlFor="tracking-code-input"
              className="block text-xs font-bold uppercase tracking-wider text-slate-400"
            >
              {t.tracking.inputLabel}
            </label>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="tracking-code-input"
                  type="text"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  placeholder={t.tracking.inputPlaceholder}
                  className="w-full bg-slate-900/90 text-white font-mono rounded-xl pl-12 pr-4 py-3.5 border border-slate-700 focus:border-red-500 focus:outline-none text-sm sm:text-base placeholder-slate-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-red-600 hover:bg-red-500 active:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-red-950/60 flex items-center justify-center gap-2 transition-all cursor-pointer border border-red-400/50 shrink-0"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t.tracking.btnSearching}</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>{t.tracking.btnSearch}</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Error / Empty Messages */}
          {errorType && (
            <div className="mt-5 p-4 rounded-xl bg-red-950/70 border border-red-500/50 text-red-300 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-bold text-red-200">
                  {errorType === 'not_found'
                    ? t.tracking.notFound
                    : errorType === 'server_error'
                    ? t.tracking.serverError
                    : t.tracking.emptyInput}
                </p>
                {errorType === 'not_found' && (
                  <p className="text-xs text-red-300/80 mt-1">{t.tracking.notFoundHint}</p>
                )}
                {errorType === 'server_error' && (
                  <p className="text-xs text-red-300/80 mt-1">{t.tracking.serverErrorHint}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Result Card */}
        {result && (
          <div className="bg-[#090e1c] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl animate-fadeIn">
            {/* Top Status Strip */}
            <div className="px-5 sm:px-8 py-5 bg-[#0c1224] border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-red-950/70 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[11px] font-mono uppercase tracking-wider text-slate-400">
                    {t.tracking.resultTitle}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white font-mono tracking-wide">
                    {displayCode}
                  </h2>
                </div>
              </div>

              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold self-start sm:self-center ${progress.badgeClass}`}
              >
                <span className={`w-2 h-2 rounded-full ${progress.barColor}`} />
                <span>{displayStatus}</span>
              </div>
            </div>

            <div className="p-5 sm:p-8 space-y-8">
              {/* Progress Bar Section */}
              <div className="bg-slate-900/60 border border-slate-800/90 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-3">
                  <span>{t.tracking.labels.progress}</span>
                  <span className="font-mono text-white font-bold">{progress.percent}%</span>
                </div>

                {/* Bar Track */}
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out shadow-lg ${progress.barColor} ${progress.glowClass}`}
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>

                {/* Stages Below: Magatzem → En trànsit → Lliurat */}
                <div className="mt-5 grid grid-cols-3 gap-2">
                  {stages.map((stage, idx) => {
                    const StageIcon = stage.icon;
                    return (
                      <div
                        key={idx}
                        className={`flex flex-col items-center text-center gap-1.5 ${
                          idx === 0
                            ? 'items-start text-left'
                            : idx === 2
                            ? 'items-end text-right'
                            : 'items-center text-center'
                        }`}
                      >
                        <div
                          className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
                            stage.active
                              ? progress.stepIndex === 2
                                ? 'text-emerald-400'
                                : progress.stepIndex === 1
                                ? 'text-blue-400'
                                : 'text-red-400'
                              : stage.reached
                              ? 'text-slate-200'
                              : 'text-slate-500'
                          }`}
                        >
                          <StageIcon className="w-3.5 h-3.5 shrink-0" />
                          <span>{stage.label}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Details Grid: Code, Client, Origin, Destination, Location, ETA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Codi */}
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/90">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-1.5">
                    <Package className="w-3.5 h-3.5 text-red-500" />
                    <span>{t.tracking.labels.code}</span>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-white font-mono">
                    {displayCode}
                  </p>
                </div>

                {/* Client */}
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/90">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-1.5">
                    <User className="w-3.5 h-3.5 text-red-500" />
                    <span>{t.tracking.labels.client}</span>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-white">
                    {displayClient}
                  </p>
                </div>

                {/* Origen */}
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/90">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-1.5">
                    <Flag className="w-3.5 h-3.5 text-red-500" />
                    <span>{t.tracking.labels.origin}</span>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-white">
                    {displayOrigin}
                  </p>
                </div>

                {/* Destí */}
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/90">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    <span>{t.tracking.labels.destination}</span>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-white">
                    {displayDestination}
                  </p>
                </div>

                {/* Ubicació actual */}
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/90">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-1.5">
                    <Navigation className="w-3.5 h-3.5 text-red-500" />
                    <span>{t.tracking.labels.location}</span>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-white">
                    {displayLocation}
                  </p>
                </div>

                {/* Data prevista d'arribada (ETA) */}
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/90">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-1.5">
                    <Calendar className="w-3.5 h-3.5 text-red-500" />
                    <span>{t.tracking.labels.eta}</span>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-white font-mono">
                    {displayEta}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
