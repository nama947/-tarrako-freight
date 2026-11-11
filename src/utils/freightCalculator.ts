import {
  FreightQuoteRequest,
  FreightQuoteResult,
  QuoteBreakdownItem,
  VehicleCategory,
} from '../types/logistics';

/**
 * Port to Port maritime reference distances from Port de Tarragona (approx nautical miles)
 */
export const PORT_DISTANCE_MATRIX: Record<string, Record<string, number>> = {
  TGN: {
    SHA: 8390, // Tarragona -> Shanghai
    YOK: 8940, // Tarragona -> Yokohama
    SIN: 7240, // Tarragona -> Singapur
    HAM: 2150, // Tarragona -> Hamburg / Emden
    RTM: 2040, // Tarragona -> Rotterdam
    DXB: 4340, // Tarragona -> Dubai / Jebel Ali
    LAX: 7950, // Tarragona -> Los Angeles
    VAL: 125,  // Tarragona -> València
  },
  SHA: {
    TGN: 8390,
    VAL: 8420,
    HAM: 10500,
    RTM: 10300,
    LAX: 5700,
  },
  HAM: {
    TGN: 2150,
    SHA: 10500,
    SIN: 8800,
  },
  SIN: {
    TGN: 7240,
    SHA: 2200,
    HAM: 8800,
  },
  YOK: {
    TGN: 8940,
    SHA: 1100,
  },
  VAL: {
    TGN: 125,
    SHA: 8420,
  },
};

export const VEHICLE_CATEGORY_LABELS: Record<VehicleCategory, { name: string; avgWeightTonnes: number; baseRateEur: number }> = {
  turisme: {
    name: 'Turisme / Sedan Elèctric Compacte',
    avgWeightTonnes: 1.6,
    baseRateEur: 780,
  },
  suv_premium: {
    name: 'SUV / Sedan Elèctric d’Alta Gamma',
    avgWeightTonnes: 2.3,
    baseRateEur: 980,
  },
  furgoneta: {
    name: 'Furgoneta Comercial / Van Lleugera',
    avgWeightTonnes: 2.8,
    baseRateEur: 1280,
  },
  camio_tractora: {
    name: 'Camió Rígid / Cap Tractor',
    avgWeightTonnes: 7.5,
    baseRateEur: 2450,
  },
  maquinaria: {
    name: 'Maquinària Pesada / Agrícola (High & Heavy)',
    avgWeightTonnes: 14.0,
    baseRateEur: 3600,
  },
};

/**
 * Calculates vehicle freight quotation for Ro-Ro / PCTC services
 */
export function calculateFreightQuote(req: FreightQuoteRequest): FreightQuoteResult {
  const origin = req.originCode || 'TGN';
  const dest = req.destinationCode || 'SHA';
  const distance = PORT_DISTANCE_MATRIX[origin]?.[dest] ?? PORT_DISTANCE_MATRIX[dest]?.[origin] ?? 6500;

  const vehicleInfo = VEHICLE_CATEGORY_LABELS[req.vehicleCategory] || VEHICLE_CATEGORY_LABELS.turisme;
  const units = Math.max(1, req.units || 1);

  // Distance factor for transoceanic vs short sea
  const distanceFactor = Math.max(0.4, distance / 6000);

  // Mode multiplier
  let modeMultiplier = 1.0;
  let baseTransitDays = 22;

  switch (req.mode) {
    case 'PCTC_OCEAN':
      modeMultiplier = 1.0;
      baseTransitDays = Math.max(14, Math.round(distance / 380));
      break;
    case 'SHORT_SEA_RORO':
      modeMultiplier = 0.65;
      baseTransitDays = Math.max(2, Math.round(distance / 420));
      break;
    case 'HIGH_HEAVY':
      modeMultiplier = 1.45;
      baseTransitDays = Math.max(16, Math.round(distance / 340));
      break;
    case 'CAR_HAULER_LAND':
      modeMultiplier = 0.55;
      baseTransitDays = Math.max(2, Math.round(distance / 600));
      break;
    default:
      modeMultiplier = 1.0;
      baseTransitDays = 22;
  }

  // Base freight per vehicle
  const baseRatePerUnit = Math.round(vehicleInfo.baseRateEur * distanceFactor * modeMultiplier);
  const baseFreight = baseRatePerUnit * units;

  // BAF (Bunker Adjustment Factor per vehicle slot)
  const bafSurcharge = Math.round(baseFreight * 0.12);

  // Terminal Ro-Ro Ramp Handling Charge (Stevedoring / lashing / unlashing) at Port de Tarragona
  const thcPerUnit = req.vehicleCategory === 'maquinaria' ? 180 : req.vehicleCategory === 'camio_tractora' ? 120 : 65;
  const terminalHandlingCharge = thcPerUnit * units;

  // PDI (Pre-Delivery Inspection, protective film removal, battery charge check, technical inspection)
  const pdiFee = req.includePdi ? (req.vehicleCategory === 'maquinaria' ? 190 : 75) * units : 0;

  // Customs export/import declaration
  const customsFee = req.includeCustoms ? 120 : 0;

  // Cargo insurance: All-Risks Ro-Ro ~ 0.35% of declared vehicle value
  const insuranceFee = req.includeInsurance
    ? Math.max(65, Math.round((req.cargoValueEur || (units * 25000)) * 0.0035))
    : 0;

  // Bill of Lading (PCTC e-Waybill) documentation fee
  const documentationFee = 65;

  const subtotal = baseFreight + bafSurcharge + terminalHandlingCharge + pdiFee + customsFee + insuranceFee + documentationFee;

  // Local VAT: International maritime freight is 0% VAT exempt (art. 21 Llei IVA);
  // Port handling, PDI & customs fees are subject to 21%
  const estimatedVat = Math.round((terminalHandlingCharge + pdiFee + customsFee + documentationFee) * 0.21);
  const totalEur = subtotal + estimatedVat;

  // CO2 calculation based on vehicle weight and nautical miles
  const totalTonnes = vehicleInfo.avgWeightTonnes * units;
  const co2EmissionsKg = Math.round(distance * totalTonnes * 0.016);

  const validUntilDate = new Date();
  validUntilDate.setDate(validUntilDate.getDate() + 14);
  const validUntilStr = validUntilDate.toISOString().split('T')[0];

  const breakdown: QuoteBreakdownItem[] = [
    {
      label: `Nòlit Ro-Ro (${units} ${units === 1 ? 'vehicle' : 'vehicles'})`,
      amountEur: baseFreight,
      description: `Fret marítim ${vehicleInfo.name} ruta ${origin} ⇄ ${dest}`,
    },
    {
      label: 'Recàrrec BAF de Combustible',
      amountEur: bafSurcharge,
      description: 'Ajust per consum de combustible en buc PCTC',
    },
    {
      label: 'Estiba & Rampa Terminal Ro-Ro',
      amountEur: terminalHandlingCharge,
      description: `Operativa de conducció per rampa i trincatge homologat a ${origin}`,
    },
    {
      label: 'Emissió e-BL / Manifest de Vehicles',
      amountEur: documentationFee,
      description: 'Documentació electrònica de transport marítim',
    },
  ];

  if (req.includePdi) {
    breakdown.push({
      label: `Inspecció & Preparació PDI (${units} veh.)`,
      amountEur: pdiFee,
      description: 'Verificació d’estat, revisió de bateria/OBD i rentat previ al lliurament a terminal Tarragona',
    });
  }

  if (req.includeCustoms) {
    breakdown.push({
      label: 'Despatx Duaner d’Automoció',
      amountEur: customsFee,
      description: 'Tramitació telemàtica DUA d’importació/exportació de vehicles',
    });
  }

  if (req.includeInsurance) {
    breakdown.push({
      label: 'Assegurança All-Risks d’Automoció',
      amountEur: insuranceFee,
      description: 'Cobertura integral durant la navegació i maniobres de rampa',
    });
  }

  return {
    baseFreight,
    bafSurcharge,
    terminalHandlingCharge,
    pdiFee,
    customsFee,
    insuranceFee,
    documentationFee,
    subtotal,
    estimatedVat,
    totalEur,
    transitDaysEstimate: baseTransitDays,
    co2EmissionsKg,
    breakdown,
    validUntil: validUntilStr,
    vehicleCategoryName: vehicleInfo.name,
  };
}

/**
 * Customs duties and import VAT calculation for imported vehicles
 * Note: Diferiment d'IVA a Espanya is via monthly VAT filing (REDEME / model 303), not OEA.
 */
export function calculateCustomsTariff(
  cifValueEur: number,
  dutyRatePct: number,
  vatRatePct: number = 21
) {
  const safeCif = Math.max(0, cifValueEur);
  const dutyAmountEur = Math.round(safeCif * (dutyRatePct / 100) * 100) / 100;
  const vatBase = safeCif + dutyAmountEur;
  const vatAmountEur = Math.round(vatBase * (vatRatePct / 100) * 100) / 100;
  const totalCustomsPayableEur = Math.round((dutyAmountEur + vatAmountEur) * 100) / 100;
  const landedCostEur = Math.round((safeCif + totalCustomsPayableEur) * 100) / 100;

  return {
    cifValueEur: safeCif,
    dutyAmountEur,
    vatAmountEur,
    totalCustomsPayableEur,
    landedCostEur,
  };
}
