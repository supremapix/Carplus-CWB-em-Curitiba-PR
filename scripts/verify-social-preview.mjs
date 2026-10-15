#!/usr/bin/env node
/** Verify the no-JavaScript crawler preview, local PNG and React metadata isolation. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const ts = require('typescript');
const args = process.argv.slice(2);
const option = (name, fallback) => args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const baseRef = option('--base', 'HEAD');
const dist = path.resolve(root, option('--dist', 'dist'));
const origin = 'https://www.carpluspneuseoficina.com.br';
const imagePath = '/images/social/carplus-prinx-eletricos-og.png';
const imageUrl = `${origin}${imagePath}`;
const title = 'Pneus Prinx para elétricos e híbridos | Carplus';
const description = 'Encontre pneus para seu elétrico ou híbrido em Curitiba. Consulte a medida e as opções Prinx com a Carplus pelo WhatsApp: (41) 3082-7282.';
const imageAlt = 'Carplus Pneus, Prinx e pneus para elétricos e híbridos. WhatsApp (41) 3082-7282.';
const marker = 'data-carplus-social-fallback';
const expectedSocial = {
  'og:type': 'website', 'og:url': `${origin}/`, 'og:title': title, 'og:description': description,
  'og:image': imageUrl, 'og:image:secure_url': imageUrl, 'og:image:type': 'image/png',
  'og:image:width': '1200', 'og:image:height': '630', 'og:image:alt': imageAlt,
  'twitter:card': 'summary_large_image', 'twitter:title': title, 'twitter:description': description,
  'twitter:image': imageUrl, 'twitter:image:alt': imageAlt
};
const mutableKeys = new Set(Object.keys(expectedSocial).filter(key => !['og:type', 'og:url'].includes(key)));
const readWorking = file => fs.readFileSync(path.join(root, file), 'utf8');
const git = (...commands) => execFileSync('git', commands, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const baseCommit = git('rev-parse', '--verify', '--end-of-options', `${baseRef}^{commit}`).trim();
const baseFiles = new Set(git('ls-tree', '-r', '--name-only', baseCommit).trim().split(/\r?\n/));
const readBase = file => {
  if (!baseFiles.has(file)) { const error = new Error(`Missing baseline module ${file}`); error.code = 'ENOENT'; throw error; }
  return git('show', `${baseCommit}:${file}`);
};

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([^\s=<>/]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)].map(match => [match[1].toLowerCase(), match[2] ?? match[3] ?? match[4]]));
}
const sort = entries => [...entries].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
function headMetadata(html) {
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1];
  assert.ok(head, 'An actual HTML head must be present for crawlers');
  const tags = [...head.matchAll(/<meta\b[^>]*>/gi)].map(match => attributes(match[0]));
  return {
    title: head.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '',
    metas: sort(tags.map(tag => [(tag.property || tag.name || tag['http-equiv'] || '').toLowerCase(), tag.content || '']).filter(([key]) => key)),
    canonical: [...head.matchAll(/<link\b[^>]*>/gi)].map(match => attributes(match[0])).filter(tag => tag.rel === 'canonical').map(tag => tag.href),
    tags
  };
}
function validateSocial(metas, label, includeUrl = true) {
  for (const [key, value] of Object.entries(expectedSocial)) {
    if (!includeUrl && key === 'og:url') continue;
    assert.deepEqual(metas.filter(([name]) => name === key).map(([, item]) => item), [value], `${label}: one exact ${key}`);
  }
}
function validateMarkers(tags, label) {
  for (const tag of tags) {
    const key = tag.property || tag.name || '';
    if (/^(?:og:|twitter:)/.test(key)) assert.equal(tag[marker], 'true', `${label}: ${key} must be replaceable before React renders`);
    if (Object.hasOwn(tag, marker)) assert.match(key, /^(?:og:|twitter:)/, `${label}: fallback marker must be limited to social metadata`);
  }
}
function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(file) : file.endsWith('.html') ? [file] : [];
  });
}

// Render the pure SEO component into React element records, without executing a browser.
function loader(readSource, label) {
  const cache = new Map();
  const browser = { location: { pathname: '/', search: '', hash: '' }, localStorage: { getItem() { return null; } } };
  function load(moduleId) {
    if (cache.has(moduleId)) return cache.get(moduleId).exports;
    const module = { exports: {} };
    cache.set(moduleId, module);
    const text = readSource(moduleId);
    if (moduleId.endsWith('.json')) { module.exports = JSON.parse(text); return module.exports; }
    const code = ts.transpileModule(text, { fileName: moduleId, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    function localRequire(name) {
      if (['react', 'react/jsx-runtime', 'react-helmet-async'].includes(name)) return require(name);
      assert.ok(name.startsWith('.'), `Unexpected SEO dependency ${name}`);
      const relative = path.posix.normalize(path.posix.join(path.posix.dirname(moduleId), name));
      for (const candidate of [relative, `${relative}.ts`, `${relative}.tsx`, `${relative}.json`]) {
        try { readSource(candidate); return load(candidate); }
        catch (error) { if (!['ENOENT', 'EISDIR'].includes(error.code)) throw error; }
      }
      throw new Error(`Cannot resolve ${name} from ${moduleId}`);
    }
    const context = vm.createContext({ require: localRequire, module, exports: module.exports, console, window: browser, localStorage: browser.localStorage });
    new vm.Script(code, { filename: `${label}:${moduleId}` }).runInContext(context, { timeout: 10000 });
    return module.exports;
  }
  return load;
}
function reactMetadata(element) {
  const result = { title: '', metas: [], canonical: [], schemas: [] };
  function visit(node) {
    if (Array.isArray(node)) { node.forEach(visit); return; }
    if (!node || typeof node !== 'object') return;
    const props = node.props || {};
    if (node.type === 'meta') {
      const key = props.property || props.name || '';
      if (key) result.metas.push([key.toLowerCase(), props.content || '']);
    }
    if (node.type === 'title') result.title = String(props.children);
    if (node.type === 'link' && props.rel === 'canonical') result.canonical.push(props.href);
    if (node.type === 'script' && props.type === 'application/ld+json') result.schemas.push(JSON.parse(String(props.children)));
    visit(props.children);
  }
  visit(element);
  result.metas = sort(result.metas);
  // Serialize to remove differences between JavaScript VM realms.
  return JSON.parse(JSON.stringify(result));
}

try {
  const sourceIndex = headMetadata(readWorking('index.html'));
  const builtIndex = headMetadata(fs.readFileSync(path.join(dist, 'index.html'), 'utf8'));
  const originalIndex = headMetadata(readBase('index.html'));
  validateSocial(sourceIndex.metas, 'source home');
  validateSocial(builtIndex.metas, 'crawler home');
  validateMarkers(sourceIndex.tags, 'source home');
  validateMarkers(builtIndex.tags, 'crawler home');
  assert.equal(builtIndex.title, originalIndex.title, 'SEO title is preserved independently of the social title');
  assert.deepEqual(builtIndex.canonical, originalIndex.canonical, 'Home canonical is preserved');
  assert.deepEqual(builtIndex.metas.filter(([key]) => key === 'description'), originalIndex.metas.filter(([key]) => key === 'description'), 'SEO description is preserved independently of the social description');

  const image = fs.readFileSync(path.join(dist, imagePath.slice(1)));
  const sourceImage = fs.readFileSync(path.join(root, 'public', imagePath.slice(1)));
  assert.equal(image.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', 'Actual PNG signature');
  assert.equal(image.readUInt32BE(16), 1200, 'PNG width');
  assert.equal(image.readUInt32BE(20), 630, 'PNG height');
  assert.equal(crypto.createHash('sha256').update(image).digest('hex'), crypto.createHash('sha256').update(sourceImage).digest('hex'), 'Built preview equals the source PNG');
  let secondaryPages = 0;
  for (const file of walk(dist)) {
    if (file === path.join(dist, 'index.html')) continue;
    const metadata = headMetadata(fs.readFileSync(file, 'utf8'));
    assert.ok(!metadata.metas.some(([, value]) => value === imageUrl || value === title || value === description || value === imageAlt), `Home campaign must not leak into ${path.relative(dist, file)}`);
    validateMarkers(metadata.tags, path.relative(dist, file));
    secondaryPages++;
  }

  const main = readWorking('src/main.tsx');
  const cleanup = "document.head.querySelectorAll('meta[data-carplus-social-fallback]').forEach(tag => tag.remove());";
  assert.equal(main.split(cleanup).length, 2, 'Exactly one scoped fallback cleanup exists');
  assert.ok(main.indexOf(cleanup) < main.indexOf('createRoot(document'), 'Fallback cleanup runs before React creates the root');
  let removed = 0;
  new vm.Script(cleanup).runInNewContext({ document: { head: { querySelectorAll(selector) { assert.equal(selector, 'meta[data-carplus-social-fallback]'); return [{ remove() { removed++; } }, { remove() { removed++; } }]; } } } });
  assert.equal(removed, 2, 'Fallback cleanup actually removes the tagged metadata');

  const currentLoad = loader(readWorking, 'working');
  const baseLoad = loader(readBase, 'baseline');
  const currentSeo = currentLoad('src/components/EnhancedSEO.tsx').default;
  const originalSeo = baseLoad('src/components/EnhancedSEO.tsx').default;
  const constants = currentLoad('src/lib/socialPreview.ts');
  assert.equal(constants.HOME_SOCIAL_IMAGE_URL, imageUrl);
  assert.equal(constants.HOME_SOCIAL_TITLE, title);
  assert.equal(constants.HOME_SOCIAL_DESCRIPTION, description);
  assert.equal(constants.HOME_SOCIAL_IMAGE_ALT, imageAlt);
  const baseProps = { currentView: 'home', seoTarget: null, selectedTire: null, selectedCatalogTire: null, selectedBlogSlug: null };
  const views = [...new Set([...readWorking('src/components/EnhancedSEO.tsx').matchAll(/currentView === '([^']+)'/g)].map(match => match[1]))];
  const fixtures = views.map(currentView => ({ label: currentView, props: { ...baseProps, currentView } }));
  const promo = currentLoad('src/data/promoTires.ts').PROMO_CATALOG_TIRES[0];
  const legacy = currentLoad('src/data.ts').TIRES_DATA[0];
  const post = currentLoad('src/blog-data.ts').BLOG_POSTS[0];
  fixtures.push(
    { label: 'catalog product', props: { ...baseProps, currentView: 'catalogo-detalhe', selectedCatalogTire: promo } },
    { label: 'legacy product', props: { ...baseProps, currentView: 'pneu-detalhes', selectedTire: legacy } },
    { label: 'blog article', props: { ...baseProps, currentView: 'blog', selectedBlogSlug: post.slug } },
    ...[{ type: 'bairro', name: 'Portão' }, { type: 'cidade', name: 'São José dos Pinhais' }, { type: 'aro', name: '16' }, { type: 'carro', name: 'Toyota Corolla' }].map(seoTarget => ({ label: `SEO ${seoTarget.type}`, props: { ...baseProps, currentView: 'seo-landing', seoTarget } }))
  );
  for (const fixture of fixtures) {
    const before = reactMetadata(originalSeo(fixture.props));
    const after = reactMetadata(currentSeo(fixture.props));
    if (fixture.label === 'home') {
      validateSocial(after.metas, 'React home', false);
      before.metas = before.metas.filter(([key]) => !mutableKeys.has(key));
      after.metas = after.metas.filter(([key]) => !mutableKeys.has(key));
    }
    assert.deepEqual(after, before, `React SEO preserved: ${fixture.label}`);
  }
  console.log(`PASS: crawler home preview is complete and unique; PNG 1200x630; ${secondaryPages} secondary HTML files isolated; scoped pre-React cleanup; ${fixtures.length} React metadata cases preserve SEO and page-specific previews against ${baseCommit}.`);
} catch (error) {
  console.error(`FAIL: ${error.message}`);
  process.exitCode = 1;
}
