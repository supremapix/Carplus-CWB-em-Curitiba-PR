import React from 'react';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { getFullCatalog } from '../src/data/catalogo-pneus';
import VerifiedTireImage, { VerifiedTireImageView } from '../src/components/VerifiedTireImage';
import { getVerifiedTireImage, getTireIllustration, TIRE_AI_IMAGE, TIRE_AI_LOW_IMAGE, TIRE_AI_HIGH_IMAGE, TIRE_AI_CAPTION, TIRE_IMAGE_PENDING } from '../src/lib/tireImageManifest';
assert(TIRE_AI_CAPTION.includes('Roda ilustrativa; não acompanha o pneu.'));
const compactView=renderToStaticMarkup(<VerifiedTireImage tire={{marca:'Unknown',nome:'Unlisted'}} compact className="h-28 w-24"/>);
assert(compactView.includes('height:auto'));
assert(compactView.includes('text-[14px]'));
assert(compactView.includes(TIRE_AI_CAPTION));
const rows=await getFullCatalog();assert.equal(rows.length,1939);
const count={model:0,illustration:0,low:0,standard:0,high:0};
for(const tire of rows){
 const before=JSON.stringify(tire),html=renderToStaticMarkup(<VerifiedTireImage tire={tire}/>),real=getVerifiedTireImage(tire);
 assert(!html.includes('sportcontact-6.png'));
 if(real){count.model++;assert(html.includes('model-representative'));assert(!html.includes(TIRE_AI_CAPTION));}
 else {count.illustration++;const src=getTireIllustration(tire);assert(html.includes(TIRE_AI_CAPTION));assert(html.includes(`src="${src}"`));count[src===TIRE_AI_LOW_IMAGE?'low':src===TIRE_AI_HIGH_IMAGE?'high':'standard']++;}
 assert.equal(JSON.stringify(tire),before);
}
assert.equal(getVerifiedTireImage({marca:'Continental',nome:'SportContact 6'}),undefined);
for(const [ratio,expected] of [[44,TIRE_AI_LOW_IMAGE],[45,TIRE_AI_LOW_IMAGE],[46,TIRE_AI_IMAGE],[69,TIRE_AI_IMAGE],[70,TIRE_AI_HIGH_IMAGE],[71,TIRE_AI_HIGH_IMAGE],[undefined,TIRE_AI_IMAGE],[NaN,TIRE_AI_IMAGE],[0,TIRE_AI_IMAGE],[101,TIRE_AI_IMAGE],['45',TIRE_AI_IMAGE]] as const)assert.equal(getTireIllustration({perfil:ratio as number}),expected);
const imageNode=(node:any):any=>!node?undefined:node.type==='img'?node:React.Children.toArray(node.props?.children).map(imageNode).find(Boolean);
let failedSources:string[]=[];const onFailure=(src:string)=>{if(!failedSources.includes(src))failedSources.push(src);};
const good=rows.find(t=>getVerifiedTireImage(t))!;
const render=()=>VerifiedTireImageView({tire:good,failedSources,onFailure});
let img=imageNode(render());assert(img);img.props.onError();
img=imageNode(render());assert(img);assert.equal(img.props.src,getTireIllustration(good));assert.equal(img.props.alt,TIRE_AI_CAPTION);img.props.onError();
assert.equal(imageNode(render()),undefined);assert(renderToStaticMarkup(render()).includes(TIRE_IMAGE_PENDING));
img.props.onError();assert.equal(imageNode(render()),undefined,'repeated illustration failure never loops to real image');
for(const src of [TIRE_AI_IMAGE,TIRE_AI_LOW_IMAGE,TIRE_AI_HIGH_IMAGE])assert(fs.existsSync(`public${src}`));
console.log(JSON.stringify({result:'PASS',records:rows.length,...count,disclosure:'visible in every AI branch',failures:'real→illustration→text, no loops',restrictedSportContact6:'excluded',proportions:'numeric thresholds and invalid input tested'}));

// Generated artwork is UI-only, never a claim of an authentic Product or social photograph.
for (const file of ['src/components/EnhancedSEO.tsx', 'scripts/build-seo.ts']) {
  const source = fs.readFileSync(file, 'utf8');
  assert(!source.includes('getTireIllustration'), `${file}: illustrative assets must not enter metadata`);
}
assert(!fs.existsSync('public/pneus/modelos/sportcontact-6.png'), 'restricted manufacturer download must not be published');
