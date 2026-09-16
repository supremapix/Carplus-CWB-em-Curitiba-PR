import { CatalogTire } from '../types';
import { PROMO_CATALOG_TIRES } from './promoTires';

// Lightweight precalculated metadata for instant Home render without bundling 1.94MB JSON
export const DEFAULT_BRANDS = [
  'BRIDGESTONE', 'COMFORSER', 'CONTINENTAL', 'DELINTE', 'FIRESTONE',
  'GOODYEAR', 'HIFLY', 'JK TYRE', 'LINGLONG', 'MAXTREK',
  'MICHELIN', 'PIRELLI', 'PRINX', 'PROVATO', 'ROADKING',
  'SPEEDMAX', 'TORNEL', 'XBRI', 'YOKOHAMA', 'ZMAX'
].sort();

export const DEFAULT_RIMS = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

export const DEFAULT_WIDTHS = [
  145, 155, 165, 175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275, 285, 295, 305, 315
];

export const DEFAULT_PROFILES = [
  30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85
];

export const DEFAULT_CATEGORIES = [
  'Passeio', 'SUV / Crossover', 'Alta Performance', 'Econômico', 'All-Terrain', 'Carga / Utilitário'
];

export const PRESET_RIM_COUNTS: Record<number, number> = {
  13: 48, 14: 172, 15: 384, 16: 498, 17: 356, 18: 242, 19: 112, 20: 86, 21: 24, 22: 12, 23: 5
};

export const PRESET_BRAND_COUNTS: Record<string, number> = {
  BRIDGESTONE: 245, PIRELLI: 280, CONTINENTAL: 198, GOODYEAR: 210,
  MICHELIN: 185, DELINTE: 160, XBRI: 175, FIRESTONE: 140,
  YOKOHAMA: 85, LINGLONG: 78, PRINX: 62, COMFORSER: 45,
  SPEEDMAX: 40, MAXTREK: 35, HIFLY: 25, PROVATO: 15,
  ROADKING: 12, TORNEL: 10, ZMAX: 8, 'JK TYRE': 6
};

// In-memory cache for full catalog
let fullCatalogCache: CatalogTire[] | null = null;
let catalogLoadingPromise: Promise<CatalogTire[]> | null = null;

// Initial synchronous fallback array (Promo tires only for instant boot)
export const CATALOGO_PNEUS: CatalogTire[] = [...PROMO_CATALOG_TIRES];

export const CATALOG_BRANDS = DEFAULT_BRANDS;
export const CATALOG_CATEGORIES = DEFAULT_CATEGORIES;
export const CATALOG_RIMS = DEFAULT_RIMS;
export const CATALOG_WIDTHS = DEFAULT_WIDTHS;
export const CATALOG_PROFILES = DEFAULT_PROFILES;
export const CATALOG_VEHICLE_TYPES = ['Passeio', 'SUV', 'Caminhonete', 'Utilitário / Van'];

/**
 * Loads the complete 1,939-tire database on demand (code-split in separate chunk).
 * Returns the cached array if already loaded.
 */
export async function getFullCatalog(): Promise<CatalogTire[]> {
  if (fullCatalogCache) {
    return fullCatalogCache;
  }
  if (!catalogLoadingPromise) {
    catalogLoadingPromise = (async () => {
      try {
        const catalogModule = await import('../../catalogo-pneus.json');
        const rawList = (catalogModule.default || catalogModule) as CatalogTire[];
        fullCatalogCache = [...PROMO_CATALOG_TIRES, ...rawList];
        return fullCatalogCache;
      } catch (err) {
        console.warn('Could not lazy-load full catalog JSON, using promo catalog fallback:', err);
        fullCatalogCache = [...PROMO_CATALOG_TIRES];
        return fullCatalogCache;
      }
    })();
  }
  return catalogLoadingPromise;
}

/**
 * Synchronously returns whatever is currently loaded (promo or full).
 */
export function getCatalogSync(): CatalogTire[] {
  return fullCatalogCache || PROMO_CATALOG_TIRES;
}

/**
 * Searches for a tire by slug in the promo list first, then in the full catalog if available.
 */
export function findCatalogTireBySlug(slug: string): CatalogTire | undefined {
  if (!slug) return undefined;
  const cleanSlug = slug.toLowerCase().replace(/^\/pneu\//, '').replace(/\/$/, '');
  
  // 1. Check in promo tires first (always in memory)
  const promoMatch = PROMO_CATALOG_TIRES.find(t => 
    t.slug.toLowerCase() === cleanSlug || 
    t.slug.toLowerCase() === `pneu-${cleanSlug}` ||
    t.id.toString() === cleanSlug
  );
  if (promoMatch) return promoMatch;

  // 2. Check in full cache if already loaded
  if (fullCatalogCache) {
    return fullCatalogCache.find(t => 
      t.slug.toLowerCase() === cleanSlug || 
      t.slug.toLowerCase() === `pneu-${cleanSlug}` ||
      t.id.toString() === cleanSlug
    );
  }

  return undefined;
}

/**
 * Asynchronously finds a tire by slug, ensuring the full catalog is loaded.
 */
export async function findCatalogTireBySlugAsync(slug: string): Promise<CatalogTire | undefined> {
  const syncMatch = findCatalogTireBySlug(slug);
  if (syncMatch) return syncMatch;

  const full = await getFullCatalog();
  const cleanSlug = slug.toLowerCase().replace(/^\/pneu\//, '').replace(/\/$/, '');
  return full.find(t => 
    t.slug.toLowerCase() === cleanSlug || 
    t.slug.toLowerCase() === `pneu-${cleanSlug}` ||
    t.id.toString() === cleanSlug
  );
}

export function getTiresByBrand(brand: string): CatalogTire[] {
  const b = brand.toLowerCase();
  const list = getCatalogSync();
  return list.filter(t => t.marca.toLowerCase() === b);
}

export function getTiresByRim(rim: number): CatalogTire[] {
  const list = getCatalogSync();
  return list.filter(t => t.aro === rim);
}

export function getTiresByCategory(category: string): CatalogTire[] {
  const c = category.toLowerCase();
  const list = getCatalogSync();
  return list.filter(t => t.categoria.toLowerCase() === c);
}

