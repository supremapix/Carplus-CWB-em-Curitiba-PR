import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const main = fs.readFileSync('src/main.tsx', 'utf8');
const adoption = main.match(/document\.head\.querySelectorAll\('link\[rel="canonical"\]'\)\.forEach\([^\n]+/)[0];
assert.ok(main.indexOf(adoption) < main.indexOf('createRoot('), 'Canonical adoption must precede React startup');
const helmet = fs.readFileSync('node_modules/react-helmet-async/lib/index.esm.js', 'utf8');
const update = helmet.slice(helmet.indexOf('var updateTags ='), helmet.indexOf('var updateAttributes ='));
class Element {
  constructor(tagName) { this.tagName = tagName; this.attributes = {}; }
  setAttribute(key, value) { this.attributes[key] = value; }
  isEqualNode(other) { return this.tagName === other.tagName && JSON.stringify(Object.entries(this.attributes).sort()) === JSON.stringify(Object.entries(other.attributes).sort()); }
}
const children = [];
const head = {
  querySelectorAll(selector) { return children.filter(e => selector === 'link[rel="canonical"]' ? e.tagName === 'link' && e.attributes.rel === 'canonical' : e.tagName === 'link' && 'data-rh' in e.attributes); },
  appendChild(e) { e.parentNode = head; children.push(e); },
  removeChild(e) { children.splice(children.indexOf(e), 1); }
};
const context = vm.createContext({ document: { head, createElement: type => new Element(type) }, HELMET_ATTRIBUTE: 'data-rh' });
vm.runInContext(update, context);
const origin = 'https://www.carpluscwb.com.br';
const routes = ['/blog', '/blog/desgaste-pneus-carros-eletricos', '/blog/como-escolher-pneus-carros-hibridos', '/pneus', '/pneu/pneu-pirelli-175-70r13-p400-evo-82t', '/pneu/pneu-pirelli-205-45r17-p-zero-84v-run-flat', '/aro/13', '/aro/23'];
for (const entry of routes) {
  children.length = 0;
  const crawler = new Element('link'); crawler.setAttribute('rel', 'canonical'); crawler.setAttribute('href', origin + entry); head.appendChild(crawler);
  vm.runInContext(adoption, context);
  for (const route of [entry, ...routes, ...routes.toReversed(), ...routes]) {
    context.target = origin + route;
    vm.runInContext("updateTags('link', [{rel:'canonical', href:target}]);", context);
    assert.equal(children.length, 1, `${entry} → ${route}: one canonical after navigation/back/forward`);
    assert.equal(children[0].attributes.href, origin + route);
  }
}
let files = 0;
function walk(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, item.name);
    if (item.isDirectory()) {
      walk(file);
      continue;
    }
    if (!file.endsWith('.html') || item.name === '404.html') continue;
    const html = fs.readFileSync(file, 'utf8');
    // Legacy redirects have no React app and transfer ownership to their target.
    if (/http-equiv="refresh"/.test(html)) continue;
    const tags = [...html.matchAll(/<link\b[^>]*rel="canonical"[^>]*>/g)];
    assert.equal(tags.length, 1, file);
    assert.match(tags[0][0], /https:\/\/www\.carpluscwb\.com\.br\//, file);
    files++;
  }
}
walk('dist');
console.log(`PASS: ${files} static documents each have one authoritative canonical; actual Helmet reconciler preserves single ownership across ${routes.length} direct entries and repeated navigation/back/forward sequences. Browser integration remains a separate check.`);
