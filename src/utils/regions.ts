import { Region } from '../types';

export const INITIAL_REGIONS: Region[] = [
  {
    id: 'montemorelos-nl',
    name: 'Montemorelos',
    state: 'Nuevo León',
    code: 'MTY-MTM-01',
    isActivePublic: true, // Exclusive launch location
    isComingSoon: false,
    description: 'Capital Naranjera de México y sede de la Universidad de Montemorelos. Nuestra región activa de lanzamiento oficial.',
    listingCount: 3,
    waitlistCount: 28,
  },
  {
    id: 'linares-nl',
    name: 'Linares',
    state: 'Nuevo León',
    code: 'NL-LIN-02',
    isActivePublic: false,
    isComingSoon: true,
    description: 'Pueblo Mágico y centro cultural y educativo de la región citrícola. Próxima apertura planificada.',
    listingCount: 0,
    waitlistCount: 42,
  },
  {
    id: 'allende-nl',
    name: 'Allende',
    state: 'Nuevo León',
    code: 'NL-ALL-03',
    isActivePublic: false,
    isComingSoon: true,
    description: 'Corredor residencial e industrial en crecimiento entre Montemorelos y Monterrey.',
    listingCount: 0,
    waitlistCount: 19,
  },
  {
    id: 'santiago-nl',
    name: 'Santiago',
    state: 'Nuevo León',
    code: 'NL-STG-04',
    isActivePublic: false,
    isComingSoon: true,
    description: 'Zona de quintas, casas de descanso y residencias junto a la presa La Boca.',
    listingCount: 0,
    waitlistCount: 35,
  },
  {
    id: 'monterrey-sur-nl',
    name: 'Monterrey (Zona Sur / Tec)',
    state: 'Nuevo León',
    code: 'NL-MTY-05',
    isActivePublic: false,
    isComingSoon: true,
    description: 'Área universitaria y residencial de alta demanda de habitaciones y departamentos para estudiantes.',
    listingCount: 0,
    waitlistCount: 84,
  },
];

const LOCAL_STORAGE_REGIONS_KEY = 'nestfind_regions_data_v1';

export function getStoredRegions(): Region[] {
  if (typeof window === 'undefined') return INITIAL_REGIONS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_REGIONS_KEY);
    if (!raw) return INITIAL_REGIONS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_REGIONS;
  } catch {
    return INITIAL_REGIONS;
  }
}

export function saveStoredRegions(regions: Region[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_REGIONS_KEY, JSON.stringify(regions));
  } catch (err) {
    console.error('Error saving regions to localStorage', err);
  }
}

export function getDefaultRegion(regions: Region[] = INITIAL_REGIONS): Region {
  const active = regions.find((r) => r.isActivePublic);
  return active || regions[0] || INITIAL_REGIONS[0];
}

export function getActivePublicRegions(regions: Region[] = INITIAL_REGIONS): Region[] {
  return regions.filter((r) => r.isActivePublic);
}

export function getUpcomingRegions(regions: Region[] = INITIAL_REGIONS): Region[] {
  return regions.filter((r) => !r.isActivePublic && r.isComingSoon);
}

export function getRegionById(id: string, regions: Region[] = INITIAL_REGIONS): Region | undefined {
  return regions.find((r) => r.id === id);
}

export function toggleRegionActiveStatus(
  regions: Region[],
  regionId: string,
  newActiveState: boolean
): Region[] {
  // If deactivating the only active region, prevent complete blackout by ensuring at least one is active
  const wouldHaveNoActive = !newActiveState && regions.filter((r) => r.isActivePublic && r.id !== regionId).length === 0;
  if (wouldHaveNoActive) {
    return regions;
  }

  const updated = regions.map((r) => {
    if (r.id === regionId) {
      return {
        ...r,
        isActivePublic: newActiveState,
        isComingSoon: !newActiveState,
      };
    }
    return r;
  });

  saveStoredRegions(updated);
  return updated;
}

export function createNewRegion(
  regions: Region[],
  newRegionData: Omit<Region, 'id' | 'listingCount' | 'waitlistCount'>
): { updatedRegions: Region[]; newRegion: Region } {
  const slug = newRegionData.name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  const id = `${slug}-${newRegionData.state.toLowerCase().substring(0, 2)}`;

  const newRegion: Region = {
    ...newRegionData,
    id,
    listingCount: 0,
    waitlistCount: 0,
  };

  const updatedRegions = [...regions, newRegion];
  saveStoredRegions(updatedRegions);
  return { updatedRegions, newRegion };
}

export function updateRegionListingCount(
  regions: Region[],
  regionId: string,
  count: number
): Region[] {
  const updated = regions.map((r) => (r.id === regionId ? { ...r, listingCount: count } : r));
  saveStoredRegions(updated);
  return updated;
}
