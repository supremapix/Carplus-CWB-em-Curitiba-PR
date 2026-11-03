import fs from 'node:fs';
import assert from 'node:assert/strict';
const css = fs.readFileSync('src/inner-pages.css','utf8');
const controlCss=css.slice(css.indexOf('/* Paired control colors:'));
assert(controlCss.length>1000,'Paired control contract exists');
for(const selector of controlCss.matchAll(/([^{}]+)\{/g)) {
 const text=selector[1].replace(/\/\*[\s\S]*?\*\//g,'').trim();
 for(const part of text.split(/,\n/)) assert(part.trim().startsWith('#carplus-root.carplus-inner-pages'),'Control overrides cannot affect Home');
}
const luminance=hex=>hex.replace('#','').match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((s,x,i)=>s+x*[.2126,.7152,.0722][i],0);
const contrast=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const pairs=[['neutral','#202124','#ffffff'],['neutral hover','#202124','#eef0f3'],['primary','#ffffff','#b4232c'],['primary hover','#ffffff','#941c24'],['dark','#ffffff','#272b32'],['dark hover','#ffffff','#414752'],['filter','#8f1c24','#fff4f5'],['filter hover','#8f1c24','#ffe7e9'],['disabled','#555b65','#e7e9ed']];
for(const [state,fg,bg] of pairs) assert(contrast(fg,bg)>=4.5,`${state}: normal text minimum4.5`);
assert(contrast('#005fcc','#ffffff')>=3,'Focus indicator against white separation');
for(const marker of ['[aria-pressed="true"]','[aria-selected="true"]',':disabled','[aria-disabled="true"]',':focus-visible','color: inherit!important','background: var(--control-fill)!important','color: var(--control-ink)!important'])assert(controlCss.includes(marker),marker);
console.log(JSON.stringify({result:'PASS',scope:'inner pages only',colorPairs:pairs.map(([state,fg,bg])=>({state,ratio:contrast(fg,bg).toFixed(2)})),note:'Palette and CSS contract guard; actual browser computed-style QA still required'},null,2));

// Screenshot regression: static dark labels were excluded from control styling.
const badgeCss=css.slice(css.indexOf('/* Static badges are surfaces too:'));
for(const marker of ['span,div.absolute,div.inline-flex','.bg-black','.bg-gray-900','.bg-zinc-900','background: #272b32!important','color: #ffffff!important','opacity: 1!important','animation: none!important',':is(span,strong,small,svg,p,div,b,em,h2,h3,h4)','color: inherit!important']) assert(badgeCss.includes(marker),`Static badge contract: ${marker}`);
for(const file of ['src/components/TireDetail.tsx','src/components/CatalogTireDetail.tsx']) {
 const source=fs.readFileSync(file,'utf8');
 assert(source.includes('bg-gray-900'),'Keep a real dark-label fixture');
}
const detail=fs.readFileSync('src/components/TireDetail.tsx','utf8');
assert.match(detail,/<span className="absolute[^\"]*bg-black[^\"]*text-white[^\"]*">[\s\S]*?PREÇO REDUZIDO/,'Discount screenshot fixture');
assert.match(detail,/<div className="absolute[^\"]*bg-gray-900[^\"]*text-white[^\"]*">\s*Pronta Entrega/,'Availability screenshot fixture');
console.log('PASS: static dark badges, white-frame overlays, nested labels/icons and opacity are paired independently of buttons; browser computed-style QA required.');

for (const marker of ['text-[#c3c3c3]', 'text-[#1ebd53]', 'bg-[#1a1c20]', 'svg,p,div,b,em,h2,h3,h4']) assert(css.includes(marker), `Shared caption/descendant regression: ${marker}`);
assert(css.includes(':is(.bg-red-500,.bg-red-600,.bg-red-700)'), 'Red status labels must pair fill and ink');
