import React, { useState } from 'react';
import { Car, Truck, Minus, Plus, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const SimpleCalculator: React.FC = () => {
  const { t, formatPrice } = useLanguage();

  const [selectedOrigin, setSelectedOrigin] = useState<string>('SHA');
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>('cotxe');
  const [units, setUnits] = useState<number>(5);

  const origins = t.calculator.origins;
  const vehicleTypes = t.calculator.vehicleTypes;

  const currentOrigin = origins.find((o) => o.code === selectedOrigin) || origins[0];
  const currentVehicle = vehicleTypes.find((v) => v.code === selectedVehicleType) || vehicleTypes[0];

  const ratePerVehicle = Math.round(currentOrigin.baseRate * currentVehicle.multiplier);
  const totalEstimate = ratePerVehicle * units;

  const handleDecrement = () => {
    setUnits((prev) => Math.max(1, prev - 1));
  };

  const handleIncrement = () => {
    setUnits((prev) => Math.min(500, prev + 1));
  };

  const handleRequestQuote = () => {
    const el = document.getElementById('contacte');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="calculadora" className="py-20 lg:py-24 bg-[#070c18] relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/50 border border-red-500/30 text-red-400 text-xs font-semibold mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span>{t.calculator.tag}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.calculator.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            {t.calculator.subtitle}
          </p>
        </div>

        {/* Calculator Main Box */}
        <div className="max-w-4xl mx-auto bg-[#0a0f1f] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Input Controls (Left 7 cols) */}
            <div className="md:col-span-7 space-y-6">
              {/* Field 1: Port d'origen */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  1. {t.calculator.originLabel}
                </label>
                <div className="relative">
                  <select
                    value={selectedOrigin}
                    onChange={(e) => setSelectedOrigin(e.target.value)}
                    className="w-full bg-slate-900 text-white rounded-xl px-4 py-3 border border-slate-700 focus:border-red-500 focus:outline-none appearance-none cursor-pointer text-sm font-medium"
                  >
                    {origins.map((orig) => (
                      <option key={orig.code} value={orig.code}>
                        {orig.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                    <MapPin className="w-4 h-4 text-red-500" />
                  </div>
                </div>
                {/* Fixed destination note */}
                <p className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span>{t.calculator.destinationText}</span>
                </p>
              </div>

              {/* Field 2: Tipus de vehicle */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  2. {t.calculator.vehicleTypeLabel}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {vehicleTypes.map((v) => {
                    const isSelected = selectedVehicleType === v.code;
                    return (
                      <button
                        key={v.code}
                        type="button"
                        onClick={() => setSelectedVehicleType(v.code)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-red-600/20 border-red-500 text-white shadow-md shadow-red-950/40'
                            : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                        }`}
                      >
                        <div className="mb-2">
                          {v.code === 'cotxe' && <Car className={`w-5 h-5 ${isSelected ? 'text-red-400' : 'text-slate-400'}`} />}
                          {v.code === 'furgoneta' && <Car className={`w-5 h-5 ${isSelected ? 'text-red-400' : 'text-slate-400'}`} />}
                          {v.code === 'camio' && <Truck className={`w-5 h-5 ${isSelected ? 'text-red-400' : 'text-slate-400'}`} />}
                        </div>
                        <div>
                          <div className="text-xs font-bold leading-tight">{v.name}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5 truncate">{v.sub}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Field 3: Quants vehicles vols portar */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  3. {t.calculator.unitsLabel}
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center rounded-xl bg-slate-900 border border-slate-700 overflow-hidden">
                    <button
                      type="button"
                      onClick={handleDecrement}
                      disabled={units <= 1}
                      aria-label="Disminuir unitats"
                      className="p-3 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={1000}
                      value={units}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val)) {
                          setUnits(Math.max(1, Math.min(1000, val)));
                        }
                      }}
                      className="w-16 text-center bg-transparent text-white font-mono font-bold text-base focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleIncrement}
                      disabled={units >= 1000}
                      aria-label="Augmentar unitats"
                      className="p-3 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs text-slate-400">
                    {units === 1 ? '1 vehicle' : `${units} vehicles`}
                  </span>
                </div>
              </div>
            </div>

            {/* Price Output Display (Right 5 cols) */}
            <div className="md:col-span-5 bg-[#0e1628] rounded-2xl border border-red-500/30 p-6 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-800">
                  <span>{t.calculator.estimateTitle}</span>
                  <span className="text-red-400 font-semibold">{currentOrigin.name.split(' ')[0]} → Tarragona</span>
                </div>

                <div className="mt-4 mb-2">
                  <span className="text-xs text-slate-400 block">{t.calculator.perVehicleText}</span>
                  <span className="text-2xl font-black text-white font-mono">
                    {formatPrice(ratePerVehicle)}
                  </span>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800">
                  <span className="text-xs font-semibold text-red-400 uppercase tracking-wider block mb-1">
                    {t.calculator.approxTotalText}
                  </span>
                  <div className="text-4xl font-black text-white font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-white">
                    {formatPrice(totalEstimate)}
                  </div>
                </div>

                <p className="mt-4 text-xs text-slate-400 leading-relaxed">
                  {t.calculator.disclaimer}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={handleRequestQuote}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-red-600 hover:bg-red-500 active:bg-red-700 shadow-lg shadow-red-950/60 flex items-center justify-center gap-2 transition-all cursor-pointer border border-red-400/50"
                >
                  <span>{t.calculator.btnRequest}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
