import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterProperties,
  formatPrice,
  INITIAL_FILTERS,
  validateMontemorelosPostalCode,
} from './filterProperties';
import { Property } from '../types';

const SAMPLE_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    regionId: 'montemorelos-nl',
    title: 'Casa familiar con jardín',
    type: 'casa',
    price: 12000,
    currency: 'MXN',
    period: 'mensual',
    isDemo: true,
    status: 'publicado',
    colonia: 'Fraccionamiento Las Huertas',
    postalCode: '67510',
    city: 'Montemorelos',
    state: 'Nuevo León',
    bedrooms: 3,
    bathrooms: 2,
    furnished: false,
    petsAllowed: true,
    parkingSpots: 2,
    images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994'],
    virtualTour: {
      enabled: true,
      isDemoTour: true,
      rooms: [
        { id: 'sala', name: 'Sala', type: 'sala', panoramaUrl: 'data:image/svg+xml,...' },
        { id: 'cocina', name: 'Cocina', type: 'cocina', panoramaUrl: 'data:image/svg+xml,...' },
      ],
    },
    amenities: ['Cochera', 'Patio con asador', 'Clima'],
    description: 'Hermosa casa residencial',
    coexistenceRules: [],
    rentalRequirements: [],
    availableDate: 'Inmediata',
    host: {
      name: 'Carlos Garza',
      role: 'Propietario particular',
      verifiedIdentity: true,
      responseRate: '98%',
      responseTime: 'Menos de 1 hora',
    },
  },
  {
    id: 'prop-2',
    regionId: 'montemorelos-nl',
    title: 'Departamento céntrico',
    type: 'departamento',
    price: 7500,
    currency: 'MXN',
    period: 'mensual',
    isDemo: true,
    status: 'publicado',
    colonia: 'Centro',
    postalCode: '67500',
    city: 'Montemorelos',
    state: 'Nuevo León',
    bedrooms: 2,
    bathrooms: 1,
    furnished: true,
    petsAllowed: false,
    parkingSpots: 1,
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'],
    virtualTour: {
      enabled: false,
      isDemoTour: false,
      rooms: [],
    },
    amenities: ['Internet', 'Clima'],
    description: 'Departamento moderno en el centro',
    coexistenceRules: [],
    rentalRequirements: [],
    availableDate: '1 de Noviembre',
    host: {
      name: 'Mariana Treviño',
      role: 'Administradora',
      verifiedIdentity: true,
      responseRate: '100%',
      responseTime: '15 minutos',
    },
  },
  {
    id: 'prop-3-external',
    regionId: 'linares-nl',
    title: 'Casa en Linares',
    type: 'casa',
    price: 9000,
    currency: 'MXN',
    period: 'mensual',
    isDemo: true,
    status: 'publicado',
    colonia: 'Centro',
    postalCode: '67700',
    city: 'Linares',
    state: 'Nuevo León',
    bedrooms: 2,
    bathrooms: 1,
    furnished: false,
    petsAllowed: true,
    parkingSpots: 1,
    images: [],
    amenities: [],
    description: 'Casa en Linares',
    coexistenceRules: [],
    rentalRequirements: [],
    availableDate: 'Inmediata',
    host: {
      name: 'Roberto',
      role: 'Propietario',
      verifiedIdentity: true,
      responseRate: '90%',
      responseTime: '2 horas',
    },
  },
];

test('filters properties strictly by active region (Montemorelos)', () => {
  const result = filterProperties(SAMPLE_PROPERTIES, INITIAL_FILTERS, 'montemorelos-nl');
  assert.equal(result.length, 2);
  assert.ok(result.every((p) => p.regionId === 'montemorelos-nl'));
});

test('filters specifically for 360 virtual tours', () => {
  const filtersWith360 = {
    ...INITIAL_FILTERS,
    has360TourOnly: true,
  };
  const result = filterProperties(SAMPLE_PROPERTIES, filtersWith360, 'montemorelos-nl');
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'prop-1');
  assert.equal(result[0].virtualTour?.enabled, true);
});

test('filters by property type and price', () => {
  const filtersType = {
    ...INITIAL_FILTERS,
    type: 'departamento' as const,
    maxPrice: 8000,
  };
  const result = filterProperties(SAMPLE_PROPERTIES, filtersType, 'montemorelos-nl');
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'prop-2');
});

test('formats price and periodicity accurately in MXN', () => {
  assert.equal(formatPrice(12000, 'mensual'), '$12,000 / mes');
  assert.equal(formatPrice(3000, 'quincenal'), '$3,000 / quincena');
  assert.equal(formatPrice(25000, 'trimestral'), '$25,000 / trimestre');
});

test('validates Montemorelos postal codes correctly', () => {
  // Valid codes (67500 - 67599)
  const v1 = validateMontemorelosPostalCode('67500');
  assert.equal(v1.isValid, true);
  assert.deepEqual(v1.codes, [67500]);
  assert.equal(v1.errorMessage, null);

  const v2 = validateMontemorelosPostalCode('67510, 67520');
  assert.equal(v2.isValid, true);
  assert.deepEqual(v2.codes, [67510, 67520]);

  // Valid range
  const vRange = validateMontemorelosPostalCode('67500 - 67520');
  assert.equal(vRange.isValid, true);
  assert.deepEqual(vRange.ranges, [[67500, 67520]]);

  // Invalid code from outside Montemorelos (e.g. Monterrey 64000)
  const vInvalid = validateMontemorelosPostalCode('64000');
  assert.equal(vInvalid.isValid, false);
  assert.ok(vInvalid.errorMessage?.includes('67500 al 67599'));

  // Invalid range (inverted)
  const vInverted = validateMontemorelosPostalCode('67530 - 67510');
  assert.equal(vInverted.isValid, false);
});

test('filters properties by multiple colonias simultaneously', () => {
  const filtersMultiColonia = {
    ...INITIAL_FILTERS,
    colonias: ['Centro', 'Fraccionamiento Las Huertas'],
  };
  const result = filterProperties(SAMPLE_PROPERTIES, filtersMultiColonia, 'montemorelos-nl');
  assert.equal(result.length, 2);

  const filtersSingle = {
    ...INITIAL_FILTERS,
    colonias: ['Centro'],
  };
  const resultSingle = filterProperties(SAMPLE_PROPERTIES, filtersSingle, 'montemorelos-nl');
  assert.equal(resultSingle.length, 1);
  assert.equal(resultSingle[0].id, 'prop-2');
});

test('filters properties by postal code and range', () => {
  // Single CP 67510 (Fracc. Las Huertas)
  const filterCp = {
    ...INITIAL_FILTERS,
    postalCode: '67510',
  };
  const resultCp = filterProperties(SAMPLE_PROPERTIES, filterCp, 'montemorelos-nl');
  assert.equal(resultCp.length, 1);
  assert.equal(resultCp[0].id, 'prop-1');

  // Range 67500 to 67520 (matches both 67500 and 67510)
  const filterRange = {
    ...INITIAL_FILTERS,
    postalCode: '67500 - 67520',
  };
  const resultRange = filterProperties(SAMPLE_PROPERTIES, filterRange, 'montemorelos-nl');
  assert.equal(resultRange.length, 2);

  // CP outside Montemorelos or without match
  const filterEmpty = {
    ...INITIAL_FILTERS,
    postalCode: '67590',
  };
  const resultEmpty = filterProperties(SAMPLE_PROPERTIES, filterEmpty, 'montemorelos-nl');
  assert.equal(resultEmpty.length, 0);
});

