import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateFreightQuote,
  calculateCustomsTariff,
} from './freightCalculator';
import { FreightQuoteRequest } from '../types/logistics';

test('calculateFreightQuote produces coherent pricing breakdown for vehicle shipment', () => {
  const req: FreightQuoteRequest = {
    originCode: 'TGN',
    destinationCode: 'SHA',
    mode: 'PCTC_OCEAN',
    vehicleCategory: 'turisme',
    units: 10,
    deckService: 'STANDARD_DECK',
    includePdi: true,
    includeCustoms: true,
    includeInsurance: true,
    cargoValueEur: 250000,
    incoterm: 'CIF',
  };

  const result = calculateFreightQuote(req);

  assert.ok(result.baseFreight > 0, 'Base freight should be positive for 10 vehicles');
  assert.ok(result.bafSurcharge > 0, 'BAF surcharge should be positive');
  assert.equal(result.terminalHandlingCharge, 650, 'THC should be 65€ * 10 units = 650€');
  assert.equal(result.pdiFee, 750, 'PDI fee should be 75€ * 10 units = 750€');
  assert.equal(result.customsFee, 120, 'Customs fee should be 120€');
  assert.equal(result.insuranceFee, 875, 'Insurance: 250,000 * 0.0035 = 875€');
  assert.equal(result.documentationFee, 65, 'Documentation fee should be 65€');
  assert.ok(result.totalEur > result.subtotal, 'Total includes estimated local VAT');
  assert.ok(result.transitDaysEstimate >= 20, 'Transit time should be realistic for TGN-SHA');
  assert.ok(result.co2EmissionsKg > 0, 'CO2 should be computed');
  assert.equal(result.breakdown.length, 7, 'Should have all itemized breakdown lines including PDI');
});

test('calculateCustomsTariff accurately computes duty and import VAT for vehicle imports', () => {
  // CIF Value: 30,000 €, Duty Rate: 10% (standard EU third-country passenger car tariff)
  // Duty = 3,000 €
  // VAT Base = 33,000 € -> VAT at 21% = 6,930 €
  // Total payable in customs = 9,930 €
  // Landed Cost = 39,930 €
  const tariff = calculateCustomsTariff(30000, 10, 21);
  assert.equal(tariff.dutyAmountEur, 3000);
  assert.equal(tariff.vatAmountEur, 6930);
  assert.equal(tariff.totalCustomsPayableEur, 9930);
  assert.equal(tariff.landedCostEur, 39930);
});
