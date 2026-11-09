import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { BLOG_POSTS } from '../src/blog-data';
const slug='rodas-de-liga-leve-riscadas-na-troca-de-pneus';
const post=BLOG_POSTS.find(p=>p.slug===slug)!;
assert(post);assert.equal(BLOG_POSTS.filter(p=>p.slug===slug).length,1);
assert.equal(post.category,'Rodas');assert.equal(post.publishedIso,'2026-11-09');
assert(post.intro.includes('frustração'));assert(post.faqs.some(f=>f.question.includes('risco zero')));
assert.equal(post.featuredImage,'/images/galeria/rodas-de-liga-leve.webp');
for(const path of [post.featuredImage,'/images/carplus-real/rodas-de-liga-leve.webp','/images/carplus-real/montagem-tecnica.webp'])assert(fs.existsSync('public'+path));
for(const route of [`blog/${slug}`,'troca-de-pneus-curitiba']){
 const html=fs.readFileSync(`dist/${route}/index.html`,'utf8');
 assert.equal((html.match(/<h1\b/g)||[]).length,1,route);
 assert.equal((html.match(/rel="canonical"/g)||[]).length,1,route);
 assert(html.includes(`https://www.carpluscwb.com.br/${route}`));
 assert(html.includes('/images/carplus-real/'));
 assert(html.includes('risco zero'));
 assert(!html.includes('garantindo total integridade'));
 assert(!html.includes('garras emborrachadas que não arranham'));
}
assert(fs.readFileSync('dist/sitemap-blog.xml','utf8').includes(`/blog/${slug}`));
const source=fs.readFileSync('src/components/WheelCareSection.tsx','utf8');
assert(source.includes('md:grid-cols-2'));assert(source.includes('md:grid-cols-3'));assert(source.includes('width="1600" height="1068"'));
for(const file of ['src/App.tsx','src/components/Navbar.tsx','src/components/Footer.tsx','src/inner-pages.css','src/components/HeroPromoTires.tsx','src/data/catalogo-pneus.ts'])assert.equal(execFileSync('git',['diff','ff20c28','--',file],{encoding:'utf8'}),'',`${file} must remain unchanged`);
console.log('PASS: new article, factual wording, real assets, responsive layout rules, static service/article HTML, sitemap, canonical and existing navigation/catalog/Home sources preserved.');
