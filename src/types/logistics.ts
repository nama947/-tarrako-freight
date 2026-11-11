/**
 * Data structures and domain models for TARRAKO FREIGHT - Automotive Ro-Ro & PCTC Platform
 * Headquartered at Port de Tarragona (ESTAR)
 */

export type VehicleCategory =
  | 'turisme'
  | 'suv_premium'
  | 'furgoneta'
  | 'camio_tractora'
  | 'maquinaria';

export type RoRoTransportMode =
  | 'PCTC_OCEAN'
  | 'SHORT_SEA_RORO'
  | 'HIGH_HEAVY'
  | 'CAR_HAULER_LAND';

// Legacy transport mode alias for backwards-compat if needed
export type TransportMode = RoRoTransportMode | 'FCL' | 'LCL' | 'AIR' | 'RAIL';

export type IncotermCode = 'EXW' | 'FCA' | 'FOB' | 'CFR' | 'CIF' | 'DAP' | 'DDP';

export interface PortLocation {
  code: string;
  name: string;
  city: string;
  country: string;
  region: 'Mediterrani' | 'Àsia Pacífic' | 'Nord d’Europa' | 'Amèrica' | 'Orient Mitjà';
  coordinates: [number, number]; // lat, lng
  terminalName: string;
  type: 'ro_ro_hub' | 'maritime' | 'pdi_center';
  unLocode: string;
}

export interface FreightQuoteRequest {
  originCode: string;
  destinationCode: string;
  mode: RoRoTransportMode;
  vehicleCategory: VehicleCategory;
  units: number;
  deckService: 'STANDARD_DECK' | 'LOWER_HEAVY_RAMP' | 'CLIMATE_CONTROLLED';
  includePdi: boolean;
  includeCustoms: boolean;
  includeInsurance: boolean;
  cargoValueEur: number;
  incoterm: IncotermCode;
  // Backwards compat properties optional
  containerSize?: string;
  weightKg?: number;
  volumeCbm?: number;
}

export interface QuoteBreakdownItem {
  label: string;
  amountEur: number;
  description: string;
}

export interface FreightQuoteResult {
  baseFreight: number;
  bafSurcharge: number;
  terminalHandlingCharge: number;
  pdiFee: number;
  customsFee: number;
  insuranceFee: number;
  documentationFee: number;
  subtotal: number;
  estimatedVat: number;
  totalEur: number;
  transitDaysEstimate: number;
  co2EmissionsKg: number;
  breakdown: QuoteBreakdownItem[];
  validUntil: string;
  vehicleCategoryName: string;
}

export interface EcomServiceItem {
  id: string;
  name: string;
  category: 'Fret Ro-Ro & PCTC' | 'Terminal & PDI' | 'Distribució Terrestre' | 'Duanes & Homologació';
  tagline: string;
  description: string;
  priceEur: number;
  unitLabel: string;
  badge?: string;
  leadTime: string;
  specs: { [key: string]: string };
  features: string[];
  imageUrl: string;
}

export interface BookingOrderItem {
  id: string;
  type: 'quote_booking' | 'service';
  title: string;
  referenceNumber: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  details: string;
  dateAdded: string;
}

export type CustomsCircuit = 'verd' | 'taronja' | 'vermell';

export interface ShipmentEvent {
  title: string;
  location: string;
  timestamp: string;
  completed: boolean;
  notes: string;
}

export interface ShipmentRecord {
  trackingCode: string;
  billOfLading: string;
  bookingRef: string;
  origin: PortLocation;
  destination: PortLocation;
  vesselName: string;
  voyageCode: string;
  status: 'reserva_confirmada' | 'embarcat' | 'en_transit' | 'arribada_port' | 'descarrega_roro' | 'inspeccio_pdi' | 'despatxat' | 'en_distribucio';
  statusLabel: string;
  circuitDuaner: CustomsCircuit;
  departureDate: string;
  estimatedArrival: string;
  batchId: string;
  vehicleType: string;
  vehicleCount: number;
  vinRange: string;
  deckLocation: string;
  cargoDescription: string;
  totalWeightTonnes: number;
  telemetry: {
    latitude: number;
    longitude: number;
    speedKnots: number;
    courseDeg: number;
    rampSecure: boolean;
    deckTemperatureC?: number;
    batteryMonitoringActive: boolean;
  };
  events: ShipmentEvent[];
}

export interface TaricDutyItem {
  hsCode: string;
  description: string;
  dutyRatePct: number;
  standardVatPct: number;
  originNotes: string;
  sampleGoods: string;
}
