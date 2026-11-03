import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const main = fs.readFileSync('src/main.tsx', 'utf8');
const cleanup = main.match(/document\.head\.querySelectorAll\('link\[rel="canonical"\]'\)\.forEach\([^\n]+/)[0];
assert.ok(main.indexOf(cleanup) < main.indexOf('createRoot('), 'Canonical cleanup must precede React startup');
// Exercise the actual startup line. React 19 natively owns subsequent head links;
// browser direct/SPA/Back/Forward verification is required, not a legacy Helmet mock.
for (const initialCount of [0, 1, 2]) {
  const tags = Array.from({length: initialCount}, () => ({ removed: false, remove() { this.removed = true; } }));
  const context = vm.createContext({ document: { head: { querySelectorAll(selector) {
    assert.equal(selector, 'link[rel="canonical"]');
    return tags;
  } } } });
  vm.runInContext(cleanup, context);
  assert(tags.every(tag => tag.removed), 'No static canonical survives startup');
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
console.log(`PASS: ${files} static documents have one authoritative canonical; actual startup cleanup removes stale static ownership before React19. Browser direct/SPA/history checks remain mandatory.`);
