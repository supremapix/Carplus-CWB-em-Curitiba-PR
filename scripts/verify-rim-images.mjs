import fs from 'node:fs';
import assert from 'node:assert/strict';
let total=0;
for(let aro=13;aro<=23;aro++){
 const html=fs.readFileSync(`dist/aro/${aro}/index.html`,'utf8');
 const images=[...html.matchAll(/<img\b[^>]*alt="Foto representativa:[^>]*>/g)];
 assert.equal(images.length,aro===23?2:3,`Aro ${aro}: verified model examples`);
 const expected=aro<=15?'/pneus/pirelli.webp':aro<=18?'/pneus/prinx.webp':'/pneus/modelos/sportcontact-6.png';
 for(const [tag] of images){assert(tag.includes(`src="${expected}"`));assert(fs.existsSync(`public${expected}`));}
 assert(html.includes('Medida, inscrições laterais e detalhes de versões podem variar'));
 total+=images.length;
}
assert.equal(total,32);
console.log('PASS: 32 model-representative photos, captions and existing assets across all 11 aro pages.');
