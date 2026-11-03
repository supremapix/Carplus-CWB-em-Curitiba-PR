import React from 'react';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { renderToStaticMarkup } from 'react-dom/server';
import { getFullCatalog } from '../src/data/catalogo-pneus';
import { TIRES_DATA } from '../src/data';
import { getVerifiedTireImage, getTireImageState, TIRE_IMAGE_PENDING, VERIFIED_TIRE_IMAGES } from '../src/lib/tireImageManifest';
import VerifiedTireImage, { VerifiedTireImageView } from '../src/components/VerifiedTireImage';
import CatalogTireCard from '../src/components/CatalogTireCard';
import CatalogTireDetail from '../src/components/CatalogTireDetail';
import TireCard from '../src/components/TireCard';
import TireDetail from '../src/components/TireDetail';
const all = await getFullCatalog();
assert.equal(all.length,1939);
const counts={model:0,pending:0};
for (const t of all) {
 const before=JSON.stringify(t), image=getVerifiedTireImage(t);
 const html=renderToStaticMarkup(<VerifiedTireImage tire={t} />);
 if(image){counts.model++;assert.equal(image.brand,t.marca.toLowerCase());assert(image.pattern.test(t.nome));assert(fs.existsSync(`public${image.src}`));assert(html.includes('Foto representativa:'));assert.equal(getTireImageState(t,image.src),undefined,'failed load has no other model fallback');}
 else{counts.pending++;assert(!html.includes('<img'));assert(html.includes(TIRE_IMAGE_PENDING));}
 assert.equal(JSON.stringify(t),before,'resolver does not mutate product');
}
for (const [brand,name] of [['Pirelli','P Zero'],['Continental','SportContact 7'],['Continental','ContiPowerContact 2'],['Prinx','HH1'],['ZMAX','Vanmejor'],['Bridgestone','Ecopia EP300'],['Michelin','P400 Evo'],['Delinte','DH2X']]) assert.equal(getVerifiedTireImage({brand,name}),undefined,`${brand} ${name} must not reuse another model`);
const bad=all.find(t=>t.marca.toLowerCase()==='zmax')!;
assert(bad);
for(const node of [<CatalogTireCard tire={bad} onSelect={()=>{}} />,<CatalogTireDetail tire={bad} onBack={()=>{}} onSelectTire={()=>{}} />]){
 const html=renderToStaticMarkup(node);assert(html.includes(TIRE_IMAGE_PENDING));assert(!html.includes('src="/pneus/zmax'));assert(html.includes(bad.medida));
}
const legacy=TIRES_DATA.find(t=>!getVerifiedTireImage(t))!;
for(const node of [<TireCard tire={legacy} verifiedImages />,<TireDetail tire={legacy} onBack={()=>{}} onAddToCart={()=>{}} />]){const html=renderToStaticMarkup(node);assert(html.includes(TIRE_IMAGE_PENDING));assert(!html.includes(`src="${legacy.image}"`));}
// Exercise the actual <img onError> callback and rerender the production view.
const good=all.find(t=>getVerifiedTireImage(t))!;
let failedSource: string | undefined;
const onFailure=(source:string)=>{failedSource=source;};
const imageNode=(node:any):any=>!node ? undefined : node.type==='img' ? node : React.Children.toArray(node.props?.children).map(imageNode).find(Boolean);
const beforeFailure=VerifiedTireImageView({tire:good,onFailure});
const img=imageNode(beforeFailure);assert(img);assert.equal(typeof img.props.onError,'function');
img.props.onError();assert.equal(failedSource,getVerifiedTireImage(good)!.src);
const afterFailure=VerifiedTireImageView({tire:good,onFailure,failedSource});
assert.equal(imageNode(afterFailure),undefined,'failed img is removed: no retry loop');
const failedHTML=renderToStaticMarkup(afterFailure);assert(failedHTML.includes(TIRE_IMAGE_PENDING));assert(!failedHTML.includes('<img'));
img.props.onError();assert.equal(imageNode(VerifiedTireImageView({tire:good,onFailure,failedSource})),undefined,'repeated error stays neutral');
const different=all.find(t=>getVerifiedTireImage(t)&&getVerifiedTireImage(t)!.src!==failedSource)!;
assert(imageNode(VerifiedTireImageView({tire:different,onFailure,failedSource})),'navigation to different valid asset can recover');
const home=renderToStaticMarkup(<TireCard tire={legacy} />);assert(home.includes(`src="${legacy.image}"`),'Home default keeps original photograph branch');assert(!home.includes(TIRE_IMAGE_PENDING),'Home default does not opt in');
for(const p of ['catalogo-pneus.json','src/data.ts','src/data/promoTires.ts'])assert.equal(fs.readFileSync(p,'utf8'),execFileSync('git',['show',`HEAD:${p}`],{encoding:'utf8',maxBuffer:8e6}),'catalog identities/prices/dimensions preserved');
const homeMain=(s:string)=>s.slice(s.indexOf('<main className="carplus-home'),s.indexOf('</main>',s.indexOf('<main className="carplus-home'))+7);
assert.equal(homeMain(fs.readFileSync('src/App.tsx','utf8')),homeMain(execFileSync('git',['show','HEAD:src/App.tsx'],{encoding:'utf8',maxBuffer:8e6})));
assert.equal(new Set(VERIFIED_TIRE_IMAGES.map(t=>t.src)).size,8);
console.log(JSON.stringify({result:'PASS',records:all.length,...counts,verifiedModelAssets:8,homeMain:'unchanged',dataAndPrices:'unchanged',failureState:'pending without alternate photo',componentOnError:'actual handler invoked, neutral render, no loop, different-source recovery'}));

assert(!fs.readFileSync('src/components/VerifiedTireImage.tsx','utf8').includes('text-[10px]'), 'Image caveats must remain readable');
