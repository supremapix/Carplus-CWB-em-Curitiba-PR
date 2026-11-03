import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import postcss from 'postcss';

// Source regression checks only, not mobile viewport/browser validation.
const css = fs.readFileSync('src/inner-pages.css', 'utf8');
const component = fs.readFileSync('src/components/BlogView.tsx', 'utf8');
const tree = postcss.parse(css);
tree.walkRules(rule => {
  assert.ok(rule.selector.split(',').length); // Also require the entire stylesheet to parse.
  assert.ok(rule.selector.startsWith('#carplus-root.carplus-inner-pages'), `Unscoped rule: ${rule.selector}`);
});
assert.match(css, /padding-inline: 14px/);
assert.match(css, /\[id\^="search-intent-"\].*padding-inline: 0/);
assert.match(css, /\.blog-card-photo \{ height: auto; aspect-ratio: 3 \/ 2;/);
assert.match(css, /\.blog-topics button \{ min-height: 46px/);
assert.match(css, /\.blog-contents a \{[^}]*min-height: 48px/);
assert.match(css, /\.blog-section \{ scroll-margin-top: 130px/);
assert.match(component, /href=\{`#artigo-secao-\$\{index\}`\}/);
assert.match(component, /id=\{`artigo-secao-\$\{sectionIndex\}`\}/);
assert.match(component, /aria-pressed=\{selectedCategory === category\}/);
assert.match(component, /role="status" aria-live="polite"/);
const previous = execFileSync('git', ['show', 'HEAD:src/components/BlogView.tsx'], {encoding:'utf8'});
// All pre-existing destinations, image references, article content and sharing handlers survive.
for (const pattern of [/href="[^"]+"/g, /src="[^"]+"/g, /\{currentPost\.[a-zA-Z]+\}/g]) {
  for (const value of previous.match(pattern) || []) assert.ok(component.includes(value), `Lost content or destination: ${value}`);
}
for (const file of ['src/components/Navbar.tsx','src/components/Footer.tsx','src/blog-data.ts','src/carplus-theme.css']) {
  assert.equal(execFileSync('git', ['diff','HEAD','--',file], {encoding:'utf8'}), '', `Protected file changed: ${file}`);
}
console.log('PASS: internal CSS scope, mobile gutter rules, readable blog typography, section anchors, topic filters, existing destinations and protected files. Source checks only; mobile rendering unverified.');
