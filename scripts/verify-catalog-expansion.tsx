import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { CONSULTATION_LINES, filterConsultationLines, normalizeLine } from '../src/data/consultationLines';
import CatalogLineExplorer from '../src/components/CatalogLineExplorer';
import { getFullCatalog, PRESET_BRAND_COUNTS, PRESET_RIM_COUNTS } from '../src/data/catalogo-pneus';

const base = process.argv[2] || '1d954c2465dd8a56e99f0a16c4b318057f0e1f08';
const git = (...args: string[]) => execFileSync('git', args, { encoding:'utf8', maxBuffer:16*1024*1024 }).replace(/\r\n/g,'\n');
for (const file of ['catalogo-pneus.json','src/data/promoTires.ts','src/data.ts','src/components/Footer.tsx','src/components/VerifiedTireImage.tsx','src/components/RimTireExampleImage.tsx','src/lib/tireImageManifest.ts','src/components/EnhancedSEO.tsx','src/App.tsx','vercel.json','_redirects']) {
  assert.equal(fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n'),git('show',`${base}:${file}`),`Preserve ${file}`);
}
const catalog = await getFullCatalog();
assert.equal(catalog.length, 1939);
assert.equal(new Set(CONSULTATION_LINES.map(l=>normalizeLine(`${l.brand} ${l.model}`))).size,CONSULTATION_LINES.length);
assert.equal(CONSULTATION_LINES.filter(l=>!l.existing).length,29);
for (const line of CONSULTATION_LINES) {
  assert.match(line.source,/^https:\/\//);
  assert(!('price' in line || 'imagem' in line || 'medida' in line || 'offers' in line));
  if (!line.existing) assert(!catalog.some(t=>normalizeLine(t.marca)===normalizeLine(line.brand) && normalizeLine(t.linha)===normalizeLine(line.model)),`${line.model} already exists`);
}
assert.equal(filterConsultationLines('michelin').length,3);
assert.equal(filterConsultationLines('PRINX','',true).length,2);
assert.equal(filterConsultationLines('Todas','',true).length,5);
assert.equal(filterConsultationLines('Todas','e.Primacy').length,1);
assert.equal(filterConsultationLines('Todas','elétricos').length,5);
assert.equal(filterConsultationLines('Todas','Evo',true).length,0);
assert.equal(filterConsultationLines('Todas','Revo',true).length,0);
for(const [brand,count] of Object.entries(PRESET_BRAND_COUNTS)) assert.equal(count,catalog.filter(t=>t.marca.toUpperCase()===brand).length);
for(const [rim,count] of Object.entries(PRESET_RIM_COUNTS)) assert.equal(count,catalog.filter(t=>t.aro===Number(rim)).length);
const allHtml = renderToStaticMarkup(<CatalogLineExplorer />);
assert.equal((allHtml.match(/data-model=/g)||[]).length,31);
assert(!allHtml.includes('<img'));
assert(!allHtml.includes('schema.org/Product'));
const michelin = renderToStaticMarkup(<CatalogLineExplorer brand="MICHELIN" />);
assert(michelin.includes('e.Primacy') && !michelin.includes('ARGOS AX5'));
for (const route of ['pneus','pneus-eletricos-curitiba']) {
  const html=fs.readFileSync(`dist/${route}/index.html`,'utf8');
  assert(html.includes('Pilot Sport EV'));
  assert(html.includes('Primacy 5'));
  assert(html.includes('Linha sob consulta'));
  assert(html.includes(`https://www.carpluscwb.com.br/${route}`));
  assert(!html.includes('"availability":"https://schema.org/InStock"'));
}
console.log('PASS: 1939 records/prices/routes/images/footer preserved; 29 new lines; 5 explicit EV references; filtering, counts, static content and canonical domain verified.');
