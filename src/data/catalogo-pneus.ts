import { CatalogTire } from '../types';
import { PROMO_CATALOG_TIRES } from './promoTires';
import catalogCounts from './catalogCounts.json';
import canonicalAliases from './catalogCanonicalAliases.json';
const aliases: Record<string, string> = canonicalAliases;
// Preserve lookups by historic numeric catalog IDs.
const legacyCatalogIds: Record<string, string> = {
  "405": "pneu-pirelli-31x1050r15lt-scorpion-atr-109s-letras-brancas",
  "1082": "pneu-continental-23560r17-fr-premiumcontact-6-vol-102v",
  "1181": "pneu-continental-25555r18-fr-contisportcontact-5-n0-105w",
  "1184": "pneu-continental-24545r18-xl-ecocontact-6-100y",
  "1185": "pneu-continental-23545r18-fr-contisportcontact-5-contiseal-94w",
  "1186": "pneu-continental-24550zr18-fr-contisportcontact-5-n0-100y",
  "1187": "pneu-continental-27535r18-fr-contisportcontact-3-mo-95y",
  "1188": "pneu-continental-27545zr18-fr-contisportcontact-5-n0-103y",
  "1189": "pneu-continental-27540r18-xl-fr-contisportcontact-2-j-103w",
  "1190": "pneu-continental-24545r18-xl-fr-contisportcontact-2-j-100w",
  "1196": "pneu-continental-25555r18-fr-procontact-tx-n0-105v",
  "1199": "pneu-continental-24535r18-fr-contisportcontact-5-ssr-88y",
  "1288": "pneu-continental-27545r19-xl-fr-premiumcontact-6-nf0-108y",
  "1291": "pneu-continental-22545r19-premiumcontact-6-ssr-92w",
  "1294": "pneu-continental-27550zr19-xl-fr-contisportcontact-5-suv-n0-112y",
  "1297": "pneu-continental-23550r19-fr-contisportcontact-5-suv-99v",
  "1302": "pneu-continental-26555r19-fr-crosscontact-rx-109h",
  "1366": "pneu-continental-29540zr20-xl-fr-sportcontact-6-mo1-110y",
  "1369": "pneu-continental-25550r20-xl-fr-contisportcontact-5-j-lr-109w",
  "1370": "pneu-continental-25540r20-xl-fr-sportcontact-6-ao-contisilent-101y",
  "1371": "pneu-continental-27535zr20-xl-fr-contisportcontact-3-j-102y",
  "1376": "pneu-continental-29540zr20-xl-fr-sportcontact-6-mo1-110y",
  "1443": "pneu-continental-27545r21-xl-fr-contisportcontact-5-suv-lr-110y",
  "1444": "pneu-continental-31540zr21-xl-fr-sportcontact-6-mo1-115y",
  "1445": "pneu-continental-28545zr21-fr-contisportcontact-5p-mo-109y"
};

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

// Actual record counts, regenerated with scripts/inventory-catalog.ts.
// These include size/vehicle variants and are not distinct-model counts.
export const PRESET_RIM_COUNTS: Record<number, number> = catalogCounts.rims;
export const PRESET_BRAND_COUNTS: Record<string, number> = catalogCounts.brands;

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
        fullCatalogCache = [...PROMO_CATALOG_TIRES, ...rawList.filter(t => !aliases[t.slug])];
        return fullCatalogCache;
      } catch (err) {
        console.warn('Could not lazy-load full catalog JSON, using promo catalog fallback:', err);
        // A transient chunk/network failure must remain retryable.
        catalogLoadingPromise = null;
        return [...PROMO_CATALOG_TIRES];
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
  const requestedSlug = slug.toLowerCase().replace(/^\/pneu\//, '').replace(/\/$/, '');
  const cleanSlug = aliases[requestedSlug] || legacyCatalogIds[requestedSlug] || requestedSlug;
  
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
  const requestedSlug = slug.toLowerCase().replace(/^\/pneu\//, '').replace(/\/$/, '');
  const cleanSlug = aliases[requestedSlug] || legacyCatalogIds[requestedSlug] || requestedSlug;
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

