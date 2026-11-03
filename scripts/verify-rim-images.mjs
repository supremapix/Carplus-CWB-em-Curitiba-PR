import fs from 'node:fs';
import assert from 'node:assert/strict';
let total=0;
for(let aro=13;aro<=23;aro++){
 const html=fs.readFileSync(`dist/aro/${aro}/index.html`,'utf8');
 const images=[...html.matchAll(/<img\b[^>]*alt="(?:Foto representativa:|Imagem ilustrativa gerada por IA)[^>]*>/g)];
 assert.equal(images.length,aro===23?2:3,`Aro ${aro}: verified model examples`);
 const expected=aro<=15?'/pneus/pirelli.webp':aro<=18?'/pneus/prinx.webp':null;
 for(const [tag] of images){if(expected){assert(tag.includes(`src="${expected}"`));assert(fs.existsSync(`public${expected}`));}else {assert(tag.includes('/pneus/illustrations/'));assert(tag.includes('Imagem ilustrativa gerada por IA'));}assert(!tag.includes('sportcontact-6.png'));}
 assert(html.includes(aro<=18 ? 'Medida, inscrições laterais e detalhes de versões podem variar' : 'Não representa o modelo ou desenho exato.'));
 total+=images.length;
}
assert.equal(total,32);
console.log('PASS: 32 model-representative or explicitly AI illustrations, captions and existing assets across all 11 aro pages.');
