import assert from 'node:assert/strict';
import fs from 'node:fs';
const aliases=JSON.parse(fs.readFileSync('src/data/catalogCanonicalAliases.json','utf8'));
const raw=JSON.parse(fs.readFileSync('catalogo-pneus.json','utf8'));
const config=JSON.parse(fs.readFileSync('vercel.json','utf8'));
const sitemap=fs.readFileSync('dist/sitemap-institucional.xml','utf8');
for(const [from,to] of Object.entries(aliases)) {
 const strip=({id,slug,...rest})=>rest;
 assert.deepEqual(strip(raw.find(t=>t.slug===from)),strip(raw.find(t=>t.slug===to)));
 assert.ok(config.routes.some(r=>r.src===`/pneu/${from}/?`&&r.status===308&&r.headers.Location===`/pneu/${to}`));
 assert.ok(!sitemap.includes(`<loc>https://www.carpluscwb.com.br/pneu/${from}</loc>`));
 assert.ok(sitemap.includes(`<loc>https://www.carpluscwb.com.br/pneu/${to}</loc>`));
 assert.ok(fs.readFileSync(`dist/pneu/${to}/index.html`,'utf8').includes(`rel="canonical" href="https://www.carpluscwb.com.br/pneu/${to}"`));
}
console.log(`PASS: ${Object.keys(aliases).length} identical duplicates, redirects, sitemap exclusion and target canonical`);
