/** Model-representative photographs. Never resolve from brand alone or infer a size/OE variant. */
export interface ImageTireIdentity { marca?: string; brand?: string; nome?: string; name?: string; linha?: string; model?: string }
export const TIRE_IMAGE_PENDING = 'Foto específica em atualização';
export const TIRE_IMAGE_CAVEAT = 'Foto representativa do modelo. Medida, inscrições laterais e detalhes de versões podem variar; confira a ficha do produto.';
export const VERIFIED_TIRE_IMAGES = [
  { brand: 'pirelli', model: 'P400 Evo', pattern: /\bp400\s+evo\b/i, src: '/pneus/pirelli.webp', source: 'Repository asset: visible P400 Evo sidewall; original photographer/license unverified', reference: 'https://www.pirelli.com/tyres/es-ar/auto/catalogo/producto/p400-evo' },
  { brand: 'prinx', model: 'HH2', pattern: /\bhh2\b/i, src: '/pneus/prinx.webp', source: 'Repository asset: visible PRINX HH2 sidewall; original photographer/license unverified' },
  { brand: 'bridgestone', model: 'Ecopia EP150', pattern: /\b(?:ecopia\s+)?ep\s*150\b/i, src: '/pneus/bridgestone.webp', source: 'Repository asset: visible Bridgestone Ecopia EP150 sidewall; original photographer/license unverified', reference: 'https://tires.bridgestone.com.br/pt-br/pneus/automotivos/ecopia/ep150' },
  { brand: 'delinte', model: 'DH2', pattern: /\bdh2\b/i, src: '/pneus/delinte.webp', source: 'Repository asset: visible Delinte DH2 sidewall; original photographer/license unverified' },
  { brand: 'continental', model: 'ContiPowerContact', pattern: /\bcontipowercontact\b(?!\s*\d)/i, src: '/pneus/continental.webp', source: 'Repository asset: visible ContiPowerContact sidewall; not PowerContact 2 or SportContact; original photographer/license unverified' },
  { brand: 'continental', model: 'SportContact 6', pattern: /\bsportcontact\s+6\b/i, src: '/pneus/modelos/sportcontact-6.png', source: 'https://continentaltire.com/sites/default/files/styles/modal/public/media/image/2024-12/ct_webpage_sportcontact6_l3qt_600x600_oe.png?itok=l_hDLHlN', reference: 'https://continentaltire.com/tires/sportcontact-6' },
  { brand: 'comforser', model: 'CF510', pattern: /\bcf510\b/i, src: '/pneus/comforser.webp', source: 'Repository asset: CF510 visible; pictured 195/60R15 is not proof of offered size; original photographer/license unverified' },
  { brand: 'tornel', model: 'Astral Neo', pattern: /\bastral\s+neo\b/i, src: '/pneus/tornel.webp', source: 'Repository asset: Astral Neo label visible, pictured 175/70R14 84T; original photographer/license unverified' },
] as const;

export function getVerifiedTireImage(tire: ImageTireIdentity) {
  const brand = (tire.marca || tire.brand || '').trim().toLowerCase();
  // Full title is authoritative when present. A conflicting or broad model field cannot grant a match.
  const name = (tire.nome || tire.name || tire.linha || tire.model || '').normalize('NFKC');
  return VERIFIED_TIRE_IMAGES.find(entry => entry.brand === brand && entry.pattern.test(name));
}

export function getTireImageState(tire: ImageTireIdentity, failedSource?: string) {
  const image = getVerifiedTireImage(tire);
  return image && image.src !== failedSource ? image : undefined;
}
