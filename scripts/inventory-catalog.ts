import fs from 'node:fs';
import { getFullCatalog, CATALOG_BRANDS } from '../src/data/catalogo-pneus';
import { normalizeLine, CONSULTATION_LINES } from '../src/data/consultationLines';

// Conservative family inventory: never count sizes, vehicle-specific duplicates,
// reinforcement or run-flat markings as extra model families.
const aliases: Record<string, string> = {
  f600: 'F-600', f700: 'F-700', p1cinturato: 'Cinturato P1',
  p1cinturatoplus: 'Cinturato P1 Plus', p7cinturato: 'Cinturato P7',
  p7: 'Cinturato P7', p7allseason: 'Cinturato P7 All Season',
};
export function modelFamily(line: string) {
  const cleaned = line.replace(/\s+(XL|RFT|MO)(?=\s|$)/gi, '').trim();
  return aliases[normalizeLine(cleaned)] || cleaned;
}
const catalog = await getFullCatalog();
const rows = CATALOG_BRANDS.map(brand => {
  const records = catalog.filter(t => t.marca.toUpperCase() === brand);
  const families = [...new Set(records.map(t => modelFamily(t.linha || 'Não informado')))].sort();
  const added = CONSULTATION_LINES.filter(t => t.brand.toUpperCase() === brand && !t.existing).map(t => t.model);
  return { brand, records: records.length, registeredFamilyCount: families.length, registeredFamilies: families, additionalConsultationLines: added };
});
fs.mkdirSync('docs/catalog-expansion', { recursive: true });
fs.writeFileSync('docs/catalog-expansion/inventory.json', JSON.stringify({
  checked: '2026-11-03', base: '1d954c2465dd8a56e99f0a16c4b318057f0e1f08',
  note: 'Conservative grouping of linha, not a count of sizes or vehicle variants. Legacy generic families (e.g. EfficientGrip, Wrangler, PremiumContact) can contain more than one model. They remain grouped, not expanded speculatively.',
  totalRecords: catalog.length, brands: rows
}, null, 2) + '\n');
// Lightweight accurate record counts; separate from model-family counts.
fs.writeFileSync('src/data/catalogCounts.json', JSON.stringify({
  brands: Object.fromEntries(rows.map(row => [row.brand, row.records])),
  rims: Object.fromEntries([...new Set(catalog.map(t => t.aro))].sort((a,b)=>a-b).map(rim => [rim, catalog.filter(t=>t.aro===rim).length]))
}, null, 2) + '\n');
console.log(`${catalog.length} original records, ${rows.length} brands; ${CONSULTATION_LINES.filter(l=>!l.existing).length} additional consultation lines`);
