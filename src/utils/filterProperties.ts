import { FilterState, Property } from '../types';

export interface MontemorelosColoniaData {
  name: string;
  postalCode: string;
  zone: string;
}

export const MONTEMORELOS_COLONIAS: MontemorelosColoniaData[] = [
  { name: 'Centro', postalCode: '67500', zone: 'Zona Urbana Central' },
  { name: 'Fraccionamiento Las Huertas', postalCode: '67510', zone: 'Norte / Libramiento' },
  { name: 'Colonia Matamoros', postalCode: '67520', zone: 'Sur / Área Hospitalaria' },
  { name: 'Gil de Leyva', postalCode: '67520', zone: 'Sur / Cerca de UMontemorelos' },
  { name: 'Del Maestro', postalCode: '67520', zone: 'Residencial Poniente' },
  { name: 'Bugambilias', postalCode: '67510', zone: 'Norte / Las Huertas' },
  { name: 'Fraccionamiento Universidad', postalCode: '67560', zone: 'Campus UMontemorelos / La Carlota' },
  { name: 'Barrio Lerdo de Tejada', postalCode: '67540', zone: 'Oriente' },
  { name: 'Valle del Mirador', postalCode: '67570', zone: 'Sur Poniente' },
  { name: 'El Realito', postalCode: '67510', zone: 'Norte' },
  { name: 'Zaragoza', postalCode: '67500', zone: 'Centro Histórico' },
  { name: 'Campestre', postalCode: '67530', zone: 'Periférico' },
];

export const MONTEMORELOS_POSTAL_CODES = [
  { code: '67500', description: 'Centro, Zaragoza, Morelos' },
  { code: '67510', description: 'Fracc. Las Huertas, Bugambilias, El Realito' },
  { code: '67520', description: 'Colonia Matamoros, Gil de Leyva, Del Maestro' },
  { code: '67530', description: 'Campestre, José María Morelos' },
  { code: '67540', description: 'Barrio Lerdo de Tejada, San Francisco' },
  { code: '67560', description: 'Fracc. Universidad, UMontemorelos, La Carlota' },
  { code: '67570', description: 'Valle del Mirador, Los Sabinos' },
];

export const INITIAL_FILTERS: FilterState = {
  regionId: 'montemorelos-nl',
  colonia: 'todas',
  colonias: [],
  postalCode: '',
  type: 'todas',
  minPrice: 0,
  maxPrice: 25000,
  period: 'todas',
  bedrooms: 'todos',
  bathrooms: 'todos',
  furnished: 'todos',
  petsAllowed: 'todos',
  has360TourOnly: false,
  amenities: [],
  searchQuery: '',
};

export interface PostalCodeValidationResult {
  isValid: boolean;
  codes: number[];
  ranges: [number, number][];
  errorMessage: string | null;
}

/**
 * Validates whether an input represents one or more valid Montemorelos postal codes or ranges (67500 - 67599).
 * Supports:
 * - Single code: "67510"
 * - Comma separated: "67500, 67510"
 * - Range: "67500-67520" or "67500 a 67520"
 */
export function validateMontemorelosPostalCode(input: string): PostalCodeValidationResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { isValid: true, codes: [], ranges: [], errorMessage: null };
  }

  const codes: number[] = [];
  const ranges: [number, number][] = [];

  // Check for range patterns: "67500-67520" or "67500 a 67520" or "67500 - 67520"
  const rangeRegex = /^(\d{5})\s*(?:-|a|al)\s*(\d{5})$/i;
  const rangeMatch = trimmed.match(rangeRegex);

  if (rangeMatch) {
    const start = parseInt(rangeMatch[1], 10);
    const end = parseInt(rangeMatch[2], 10);

    if (start > end) {
      return {
        isValid: false,
        codes: [],
        ranges: [],
        errorMessage: `El rango de código postal es inválido (${start} es mayor que ${end}).`,
      };
    }

    if (start < 67500 || end > 67599) {
      return {
        isValid: false,
        codes: [],
        ranges: [],
        errorMessage: `El rango (${start} - ${end}) excede los códigos postales de Montemorelos, N.L. (rango oficial 67500 a 67599).`,
      };
    }

    ranges.push([start, end]);
    return { isValid: true, codes: [], ranges, errorMessage: null };
  }

  // Split by comma or spaces
  const tokens = trimmed.split(/[,\s]+/).filter(Boolean);

  for (const token of tokens) {
    // If user is partially typing, e.g. "675", we check if it is a prefix of Montemorelos
    if (/^\d{1,4}$/.test(token)) {
      if (!'67500'.startsWith(token) && !'67599'.startsWith(token)) {
        return {
          isValid: false,
          codes: [],
          ranges: [],
          errorMessage: `El prefijo "${token}" no corresponde a los códigos postales de Montemorelos (inician con 675XX).`,
        };
      }
      continue;
    }

    const num = parseInt(token, 10);
    if (isNaN(num) || token.length !== 5) {
      return {
        isValid: false,
        codes: [],
        ranges: [],
        errorMessage: `"${token}" no es un código postal válido de 5 dígitos (ej. 67500, 67510, 67520).`,
      };
    }

    if (num < 67500 || num > 67599) {
      return {
        isValid: false,
        codes: [],
        ranges: [],
        errorMessage: `El código postal "${token}" no pertenece a Montemorelos, N.L. Los códigos de Montemorelos van del 67500 al 67599.`,
      };
    }

    codes.push(num);
  }

  return { isValid: true, codes, ranges, errorMessage: null };
}

export function filterProperties(
  properties: Property[],
  filters: FilterState,
  activeRegionId: string
): Property[] {
  // Parse postal code filter if present
  const postalValidation = filters.postalCode
    ? validateMontemorelosPostalCode(filters.postalCode)
    : { isValid: true, codes: [], ranges: [], errorMessage: null };

  return properties.filter((prop) => {
    // 1. Region Isolation: Must match the currently selected / active region
    const targetRegion = filters.regionId || activeRegionId;
    if (prop.regionId !== targetRegion) {
      return false;
    }

    // 2. Only show published properties in public view
    if (prop.status !== 'publicado') {
      return false;
    }

    // 3. Search query (matches colonia, title, description, postal code, or referenceLocation)
    if (filters.searchQuery && filters.searchQuery.trim().length > 0) {
      const q = filters.searchQuery.toLowerCase().trim();
      const match =
        prop.title.toLowerCase().includes(q) ||
        prop.colonia.toLowerCase().includes(q) ||
        (prop.postalCode && prop.postalCode.includes(q)) ||
        prop.city.toLowerCase().includes(q) ||
        (prop.referenceLocation && prop.referenceLocation.toLowerCase().includes(q)) ||
        prop.description.toLowerCase().includes(q);
      if (!match) return false;
    }

    // 4. Multiple Colonias Filter
    if (filters.colonias && filters.colonias.length > 0) {
      const propColoniaLower = prop.colonia.toLowerCase().trim();
      const matchesAnyColonia = filters.colonias.some(
        (c) => c.toLowerCase().trim() === propColoniaLower
      );
      if (!matchesAnyColonia) {
        return false;
      }
    } else if (filters.colonia && filters.colonia !== 'todas') {
      // Legacy single colonia filter fallback
      if (prop.colonia.toLowerCase().trim() !== filters.colonia.toLowerCase().trim()) {
        return false;
      }
    }

    // 5. Postal Code filter (single, multiple comma-separated, or range)
    if (filters.postalCode && filters.postalCode.trim().length > 0) {
      if (!postalValidation.isValid) {
        // If invalid CP was entered, return no results
        return false;
      }

      const propCpNum = parseInt(prop.postalCode || '0', 10);

      // Check explicit codes match
      const inCodes = postalValidation.codes.includes(propCpNum);
      // Check ranges match
      const inRange = postalValidation.ranges.some(
        ([start, end]) => propCpNum >= start && propCpNum <= end
      );

      // Check partial prefix (e.g. user typed "6751")
      const trimmedQuery = filters.postalCode.trim();
      const isPrefixMatch =
        trimmedQuery.length < 5 &&
        /^\d+$/.test(trimmedQuery) &&
        (prop.postalCode || '').startsWith(trimmedQuery);

      if (!inCodes && !inRange && !isPrefixMatch) {
        return false;
      }
    }

    // 6. Property Type
    if (filters.type !== 'todas') {
      if (prop.type !== filters.type) {
        return false;
      }
    }

    // 7. Price range
    if (filters.minPrice > 0 && prop.price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice > 0 && prop.price > filters.maxPrice) {
      return false;
    }

    // 8. Rent Periodicity
    if (filters.period !== 'todas') {
      if (prop.period !== filters.period) {
        return false;
      }
    }

    // 9. Bedrooms count
    if (filters.bedrooms !== 'todos') {
      const minBeds = Number(filters.bedrooms);
      if (prop.bedrooms < minBeds) {
        return false;
      }
    }

    // 10. Bathrooms count
    if (filters.bathrooms !== 'todos') {
      const minBaths = Number(filters.bathrooms);
      if (prop.bathrooms < minBaths) {
        return false;
      }
    }

    // 11. Furnished
    if (filters.furnished !== 'todos') {
      if (prop.furnished !== filters.furnished) {
        return false;
      }
    }

    // 12. Pets allowed
    if (filters.petsAllowed !== 'todos') {
      if (prop.petsAllowed !== filters.petsAllowed) {
        return false;
      }
    }

    // 13. 360° Virtual Tour filter
    if (filters.has360TourOnly) {
      const hasTour =
        Boolean(prop.virtualTour?.enabled) &&
        Array.isArray(prop.virtualTour?.rooms) &&
        (prop.virtualTour?.rooms.length ?? 0) > 0;
      if (!hasTour) {
        return false;
      }
    }

    // 14. Amenities
    if (filters.amenities && filters.amenities.length > 0) {
      const hasAllAmenities = filters.amenities.every((reqAmenity) =>
        prop.amenities.some((a) => a.toLowerCase().includes(reqAmenity.toLowerCase()))
      );
      if (!hasAllAmenities) {
        return false;
      }
    }

    return true;
  });
}

export function formatPrice(price: number, period: string, currency: string = 'MXN'): string {
  const formattedNumber = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price);

  const periodLabel =
    period === 'quincenal'
      ? '/ quincena'
      : period === 'mensual'
      ? '/ mes'
      : period === 'trimestral'
      ? '/ trimestre'
      : `/${period}`;

  return `${formattedNumber} ${periodLabel}`;
}
