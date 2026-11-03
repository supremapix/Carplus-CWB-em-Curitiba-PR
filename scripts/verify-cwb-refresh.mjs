import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
const base='cdb241058e535a4d595e81e7d6ec04ea27aae363';
const gitFile=p=>execFileSync('git',['show',`${base}:${p}`],{encoding:'utf8',maxBuffer:8e6});
for(const p of ['catalogo-pneus.json','src/data/promoTires.ts','src/data.ts','src/components/Navbar.tsx','src/components/Footer.tsx','src/carplus-theme.css','src/index.css']) assert.equal(fs.readFileSync(p,'utf8'),gitFile(p),`preserved ${p}`);
const app=fs.readFileSync('src/App.tsx','utf8'),orig=gitFile('src/App.tsx');
const home=s=>s.slice(s.indexOf('<main className="carplus-home'),s.indexOf('</main>',s.indexOf('<main className="carplus-home'))+7);
assert.equal(home(app),home(orig),'Home main JSX unchanged');
assert(app.includes("currentView !== 'home' && <InnerPageNav />"));
const paths=['pneus','pneus-byd-curitiba','pneu-byd-dolphin-curitiba','pneu-byd-dolphin-mini-curitiba','pneu-byd-dolphin-gs-curitiba','pneu-byd-king-curitiba','pneu-175-55-r16-curitiba','pneu-195-60-r16-curitiba','pneu-205-50-r17-curitiba','pneu-215-55-r17-curitiba','pneu-225-60-r16-curitiba','pneus-eletricos-curitiba','pneus-hibridos-curitiba','bairro/portao',...Array.from({length:11},(_,i)=>`aro/${i+13}`),...['desgaste-pneus-carros-eletricos','como-escolher-pneus-carros-hibridos','pneus-pressao-autonomia-carro-eletrico','ruido-vibracao-pneus-carro-eletrico','bolha-furo-desgaste-pneu-eletrico-hibrido'].map(x=>'blog/'+x)];
for(const p of paths){const s=fs.readFileSync(path.join('dist',p,'index.html'),'utf8');assert(s.includes(`rel="canonical" href="https://www.carpluscwb.com.br/${p}"`),`canonical ${p}`);assert.equal((s.match(/<h1[ >]/g)||[]).length,1,`one H1 ${p}`);assert(s.includes('name="robots" content="index, follow"'),`robots ${p}`);for(const match of s.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g))JSON.parse(match[1]);}
for (const p of ['pneus-eletricos-curitiba','pneus-hibridos-curitiba']) {
  const html=fs.readFileSync(path.join('dist',p,'index.html'),'utf8');
  assert.equal((html.match(/<main[ >]/g)||[]).length,1, `One main landmark: ${p}`);
  assert.equal((html.match(/<article class="electric-guide"/g)||[]).length,1, `Guide is an article: ${p}`);
}
const catalog=JSON.parse(fs.readFileSync('catalogo-pneus.json','utf8'));assert.equal(catalog.length,1919);for(const t of catalog)assert(fs.existsSync(path.join('dist','pneu',t.slug,'index.html')),`product ${t.slug}`);
for(const p of fs.readdirSync('dist').filter(p=>p.startsWith('sitemap')&&p.endsWith('.xml'))){const s=fs.readFileSync(path.join('dist',p),'utf8');assert(!s.includes('carpluspneuseoficina.com.br'),`own sitemap domain ${p}`);}
assert(!fs.readFileSync('src/seo-data.ts','utf8').includes('4.5 km'),'no fake route fallback');
console.log(JSON.stringify({result:'PASS',preservedRawProducts:1919,checkedSemanticRoutes:paths.length,homeJSX:'unchanged',catalogAndPriceData:'unchanged',domain:'www.carpluscwb.com.br',browserQA:'not covered by this script'},null,2));

for (const file of ['RimAuthoritySection.tsx','BydClusterPages.tsx','ElectricGuides.tsx']) {
 const code=fs.readFileSync(path.join('src/components',file),'utf8');
 assert(!/\.(indiceCarga|indiceVelocidade)/.test(code), `New guide must not expose unverified catalog index fallback: ${file}`);
 assert(code.includes('Índices de carga e velocidade a confirmar'), `Explicit index confirmation: ${file}`);
}
console.log('PASS: new hubs do not expose conflicting fallback load/speed labels; catalog data unchanged.');

for(const slug of ['barao-pneus-e-oficina-bacacheri-curitiba','barao-pneus-sao-jose-pinhais','barao-pneus-e-oficina-portao','pneus-pirelli-em-curitiba-melhor-preco','distribuidora-de-pneus-em-curitiba']) {
 const html=fs.readFileSync(path.join('dist',slug,'index.html'),'utf8');
 assert(html.includes('name="robots" content="index, follow"'));
 assert(!/pronta entrega|Estoque Completo|garantindo geometria/i.test(html),`No invented stock/performance: ${slug}`);
 if(slug.startsWith('barao-'))assert(html.includes('Não somos uma filial nem representantes da Barão Pneus.'),`Independent identity: ${slug}`);
}
const evArticle=fs.readFileSync('dist/blog/pneus-para-carro-eletrico-em-curitiba/index.html','utf8');
assert(!/Não Aguentam|até 30%|até 10%|até 20%|protegendo 100%|35.000 km a 50.000/.test(evArticle),'No unsupported EV guarantees');
assert(evArticle.includes('continentaltire.com/ev-compatible'),'Manufacturer evidence linked');
console.log('PASS: targeted legacy EV and five institutional routes have qualified claims; URLs/index policy preserved.');
