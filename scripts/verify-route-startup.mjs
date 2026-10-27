#!/usr/bin/env node
/** Run the real App route handlers/effects with StrictMode effect replay and batched state. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const ts = require('typescript');
const sourceText = fs.readFileSync(path.join(root, 'src/App.tsx'), 'utf8');
const source = ts.createSourceFile('src/App.tsx', sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const printer = ts.createPrinter({ removeComments: true });
const print = node => printer.printNode(ts.EmitHint.Unspecified, node, source);
const declarations = new Map();
const initializers = new Map();
const setters = new Map();
let mountEffect, syncEffect, syncDependencies, footerNavigation, catalogBack;
const stateNames = new Set(['currentView', 'seoTarget', 'selectedTire', 'selectedCatalogTire', 'selectedBlogSlug', 'isRouteReady', 'catalogFilterBrand', 'catalogFilterRim', 'catalogFilterCategory', 'catalogFilterSearch', 'catalogRestoreState', 'catalogNavigationKey']);

function find(node) {
  if (ts.isVariableDeclaration(node)) {
    if (ts.isIdentifier(node.name) && ['PAGE_VIEWS', 'resetCatalogNavigation', 'rememberCatalogState', 'restoreCatalogNavigation', 'parsePathAndSetState', 'handleScrollToSection'].includes(node.name.text)) declarations.set(node.name.text, node);
    if (ts.isArrayBindingPattern(node.name) && ts.isCallExpression(node.initializer) && node.initializer.expression.getText(source) === 'useState') {
      const name = node.name.elements[0]?.name?.getText(source);
      if (stateNames.has(name)) {
        initializers.set(name, print(node.initializer.arguments[0]));
        setters.set(node.name.elements[1].name.getText(source), name);
      }
    }
  }
  if (ts.isCallExpression(node) && node.expression.getText(source) === 'useEffect') {
    const text = node.getText(source);
    if (/\blet\s+idealPath\b/.test(text)) { syncEffect = node.arguments[0]; syncDependencies = node.arguments[1]; }
    else if (/\bparsePathAndSetState\s*\(/.test(text)) mountEffect = node.arguments[0];
  }
  if (ts.isJsxSelfClosingElement(node) && node.tagName.getText(source) === 'CatalogTireDetail') {
    catalogBack = node.attributes.properties.find(attribute => ts.isJsxAttribute(attribute) && attribute.name.getText(source) === 'onBack')?.initializer?.expression;
  }
  if (ts.isJsxSelfClosingElement(node) && node.tagName.getText(source) === 'Footer') {
    footerNavigation = node.attributes.properties.find(attribute => ts.isJsxAttribute(attribute) && attribute.name.getText(source) === 'onNavigate');
  }
  ts.forEachChild(node, find);
}
find(source);
assert.ok(mountEffect && syncEffect && syncDependencies, 'Real routing effects must be identifiable');
assert.ok(declarations.get('parsePathAndSetState') && declarations.get('handleScrollToSection'), 'Real navigation handlers must exist');
assert.equal(footerNavigation?.initializer?.expression?.getText(source), 'handleScrollToSection', 'Footer navigation must use the handler that clears stale product state');

// Evaluate actual data/helpers in isolated CommonJS modules; no browser, network or writes.
const moduleCache = new Map();
function loadModule(moduleId) {
  if (moduleCache.has(moduleId)) return moduleCache.get(moduleId).exports;
  const module = { exports: {} };
  moduleCache.set(moduleId, module);
  const text = fs.readFileSync(path.join(root, moduleId), 'utf8');
  if (moduleId.endsWith('.json')) { module.exports = JSON.parse(text); return module.exports; }
  const code = ts.transpileModule(text, { fileName: moduleId, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  function localRequire(name) {
    assert.ok(name.startsWith('.'), `Unexpected route-data dependency ${name}`);
    const relative = path.posix.normalize(path.posix.join(path.posix.dirname(moduleId), name));
    for (const candidate of [relative, `${relative}.ts`, `${relative}.tsx`, `${relative}.json`]) {
      if (fs.existsSync(path.join(root, candidate)) && fs.statSync(path.join(root, candidate)).isFile()) return loadModule(candidate);
    }
    throw new Error(`Unresolved data dependency ${name} from ${moduleId}`);
  }
  const context = vm.createContext({ module, exports: module.exports, require: localRequire, console });
  new vm.Script(code, { filename: moduleId }).runInContext(context, { timeout: 10000 });
  return module.exports;
}
const catalog = loadModule('src/data/catalogo-pneus.ts');
const tireData = loadModule('src/data.ts');
const slugs = loadModule('src/utils/slugify.ts');
const geography = loadModule('src/seo-data.ts');
const blog = loadModule('src/blog-data.ts');
const products = catalog.getCatalogSync();
assert.ok(products.length >= 2, 'Use real catalog products for the navigation checks');
const legacyTire = tireData.TIRES_DATA.find(tire => !catalog.findCatalogTireBySlug(slugs.getTireSlug(tire)) && !catalog.findCatalogTireBySlug(String(tire.id)));
assert.ok(legacyTire, 'Use a real legacy product outside the promo list');

function arrowBody(arrow, statements) {
  return ts.factory.updateArrowFunction(arrow, arrow.modifiers, arrow.typeParameters, arrow.parameters, arrow.type, arrow.equalsGreaterThanToken, ts.factory.updateBlock(arrow.body, statements));
}

function harness(incomingPath, { removeStartupGate = false, removeCatalogClears = false } = {}) {
  const state = {};
  const queue = [];
  const history = [];
  const listeners = new Map();
  const location = { pathname: incomingPath, search: '', hash: '', href: `https://www.carpluscwb.com.br${incomingPath}` };
  const window = {
    location,
    history: {
      state: null,
      pushState(nextState, _title, url) { const parsed = new URL(url, 'https://carplus.example'); this.state = nextState; location.pathname = parsed.pathname; location.search = parsed.search; location.hash = parsed.hash; location.href = parsed.href; history.push(parsed.pathname); },
      replaceState(nextState, _title, url) { this.state = nextState; if (url) { const parsed = new URL(url, 'https://carplus.example'); location.pathname = parsed.pathname; location.search = parsed.search; location.hash = parsed.hash; location.href = parsed.href; } }
    },
    scrollTo() {},
    addEventListener(name, callback) { if (!listeners.has(name)) listeners.set(name, new Set()); listeners.get(name).add(callback); },
    removeEventListener(name, callback) { listeners.get(name)?.delete(callback); }
  };
  const context = vm.createContext({
    window, document: { getElementById() { return null; } },
    console, URL, Number, useCallback: fn => fn, lastCatalogState: { current: undefined }, setTimeout(callback) { callback(); return 1; },
    ...catalog, ...tireData, ...slugs, ...geography,
    homeRef: { current: null }, finderRef: { current: null }, catalogRef: { current: null }, categoriesRef: { current: null }, mapsRef: { current: null }
  });
  for (const [name, expression] of initializers) state[name] = new vm.Script(`(${expression})`).runInContext(context);
  for (const [setter, name] of setters) context[setter] = value => queue.push([name, value]);
  let actualSync = syncEffect;
  if (removeStartupGate) {
    assert.ok(ts.isIfStatement(syncEffect.body.statements[0]), 'Negative control needs the first readiness gate');
    actualSync = arrowBody(syncEffect, syncEffect.body.statements.slice(1));
  }
  const handlerCode = ['PAGE_VIEWS', 'resetCatalogNavigation', 'rememberCatalogState', 'restoreCatalogNavigation', 'parsePathAndSetState', 'handleScrollToSection'].map(name => {
    const declaration = declarations.get(name);
    if (!removeCatalogClears || !['parsePathAndSetState', 'handleScrollToSection'].includes(name)) return `const ${print(declaration)};`;
    const arrow = declaration.initializer;
    assert.equal(print(arrow.body.statements[0]).trim(), 'setSelectedCatalogTire(null);', 'Negative control needs the first product clear');
    return `const ${name} = ${print(arrowBody(arrow, arrow.body.statements.slice(1)))};`;
  }).join('\n');
  const factorySource = `function renderRoutes(snapshot) {
    const {${[...stateNames].join(',')}} = snapshot;
    ${handlerCode}
    return {parsePathAndSetState, handleScrollToSection, rememberCatalogState, catalogBack:${print(catalogBack)}, mount:${print(mountEffect)}, sync:${print(actualSync)}, dependencies:${print(syncDependencies)}};
  }`;
  const compiled = ts.transpileModule(factorySource, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None } }).outputText;
  new vm.Script(compiled).runInContext(context);
  const render = () => context.renderRoutes({ ...state });
  const flush = () => {
    let changed = false;
    while (queue.length) {
      const [name, update] = queue.shift();
      const next = typeof update === 'function' ? update(state[name]) : update;
      if (!Object.is(next, state[name])) { state[name] = next; changed = true; }
    }
    return changed;
  };
  const sameDependencies = (a, b) => a.length === b.length && a.every((item, index) => Object.is(item, b[index]));
  let committed;
  function settle() {
    for (let turn = 0; turn < 10; turn++) {
      if (!flush()) return;
      const next = render();
      const previous = committed;
      committed = next;
      if (!sameDependencies(previous.dependencies, next.dependencies)) next.sync();
    }
    throw new Error(`Route state failed to settle for ${incomingPath}`);
  }
  // React StrictMode discards a render, then replays passive-effect setup/cleanup.
  // Updates from both mount passes are batched; effect closures see initial state.
  render();
  committed = render();
  const cleanup = committed.mount();
  committed.sync();
  if (typeof cleanup === 'function') cleanup();
  committed.mount();
  committed.sync();
  settle();
  assert.equal(listeners.get('popstate')?.size, 1, 'StrictMode replay must leave one active popstate listener');
  return {
    state, location, history,
    navigate(section) { committed.handleScrollToSection(section); settle(); },
    popTo(url, entryState = null) { window.history.state = entryState; location.pathname = url; location.href = `https://www.carpluscwb.com.br${url}`; for (const callback of listeners.get('popstate') || []) callback(); settle(); },
    selectCatalog(product) { context.setSelectedCatalogTire(product); settle(); },
    rememberCatalog(snapshot) { committed.rememberCatalogState(snapshot); },
    getHistoryState() { return window.history.state; },
    backToCatalog() { committed.catalogBack(); settle(); }

  };
}

const cases = [
  { url: '/pneu-byd-dolphin-mini-curitiba', view: 'pneu-byd-dolphin-mini-curitiba' },
  { url: '/pneu-byd-dolphin-curitiba', view: 'pneu-byd-dolphin-curitiba' },
  { url: '/pneu-byd-king-curitiba', view: 'pneu-byd-king-curitiba' },
  { url: '/pneus', view: 'catalogo-pneus' },
  { url: '/pneus/aro-17', expected: '/pneus', view: 'catalogo-pneus', rim: 17 },
  { url: `/pneu/${products[0].slug}`, view: 'catalogo-detalhe' },
  { url: `/pneu/${slugs.getTireSlug(legacyTire)}`, view: 'pneu-detalhes' },
  { url: `/pneu/${legacyTire.id}`, expected: `/pneu/${slugs.getTireSlug(legacyTire)}`, view: 'pneu-detalhes' },
  { url: '/bairro/portao', view: 'seo-landing', target: 'bairro' },
  { url: '/blog', view: 'blog' },
  { url: `/blog/${blog.BLOG_POSTS[0].slug}`, view: 'blog', blog: blog.BLOG_POSTS[0].slug },
  { url: '/', view: 'home' }
];
for (const test of cases) {
  const route = harness(test.url);
  assert.equal(route.location.pathname, test.expected || test.url, `Direct load preserved: ${test.url}`);
  assert.equal(route.state.currentView, test.view, `Correct initial view: ${test.url}`);
  assert.equal(route.state.isRouteReady, true, 'Initial URL parse marks routing ready');
  if (test.target) assert.equal(route.state.seoTarget.type, test.target);
  if (test.blog) assert.equal(route.state.selectedBlogSlug, test.blog);
  if (test.rim) assert.equal(route.state.catalogFilterRim, test.rim);
  if (test.url !== '/') assert.ok(!route.history.some(url => url === '/' || url === '/home'), `No transient home overwrite: ${test.url}`);
}

const nextProduct = harness(`/pneu/${products[0].slug}`);
nextProduct.selectCatalog(products[1]);
assert.equal(nextProduct.state.currentView, 'catalogo-detalhe');
assert.equal(nextProduct.location.pathname, `/pneu/${products[1].slug}`, 'Changing only selectedCatalogTire updates the URL');

for (const [section, expectedPath, expectedView] of [['servicos', '/alinhamento-3d-curitiba', 'alinhamento-3d-curitiba'], ['contato', '/contato', 'contato'], ['home', '/', 'home']]) {
  const route = harness(`/pneu/${products[0].slug}`);
  route.navigate(section);
  assert.equal(route.state.selectedCatalogTire, null, `Product cleared before navigating to ${section}`);
  assert.equal(route.location.pathname, expectedPath, `Product → ${section} URL`);
  assert.equal(route.state.currentView, expectedView, `Product → ${section} view`);
}
const browserHistory = harness(`/pneu/${products[0].slug}`);
browserHistory.popTo('/contato');
assert.equal(browserHistory.state.selectedCatalogTire, null, 'Parsing browser history clears the previous catalog product');
assert.equal(browserHistory.location.pathname, '/contato', 'Browser history keeps the incoming route');

const brokenStartup = harness('/pneu-byd-dolphin-mini-curitiba', { removeStartupGate: true });
assert.notEqual(brokenStartup.location.pathname, '/pneu-byd-dolphin-mini-curitiba', 'Negative control must reproduce the startup race when only the gate is removed');
const brokenExit = harness(`/pneu/${products[0].slug}`, { removeCatalogClears: true });
brokenExit.navigate('contato');
assert.notEqual(brokenExit.location.pathname, '/contato', 'Negative control must reproduce stale-product URL when only the clears are removed');

const snapshot = {
  searchTerm: '', selectedBrand: 'PIRELLI', selectedRim: 16, selectedWidth: 'Todas', selectedProfile: 'Todos',
  selectedCategory: 'Todas', selectedVehicleType: 'Todos', sortBy: 'marca', currentPage: 2
};
const aliasJourney = harness('/pneus/aro-17');
assert.equal(aliasJourney.location.pathname, '/pneus');
assert.equal(aliasJourney.history.length, 0, 'Catalog alias normalization replaces rather than pushes an entry, avoiding a Back loop');
const catalogJourney = harness('/pneus');
catalogJourney.rememberCatalog(snapshot);
assert.equal(catalogJourney.getHistoryState().carplusCatalog, snapshot, 'Save selection in the existing history entry without adding a URL');
const savedEntry = catalogJourney.getHistoryState();
catalogJourney.selectCatalog(products[0]);
catalogJourney.backToCatalog();
assert.equal(catalogJourney.state.currentView, 'catalogo-pneus');
assert.equal(catalogJourney.state.catalogRestoreState, snapshot, 'Internal back restores all filters, sort and page');
catalogJourney.selectCatalog(products[0]);
catalogJourney.popTo('/pneus', savedEntry);
assert.equal(catalogJourney.state.catalogRestoreState, snapshot, 'Browser Back restores the catalog history snapshot');
catalogJourney.popTo(`/pneu/${products[0].slug}`);
catalogJourney.backToCatalog();
assert.equal(catalogJourney.state.catalogRestoreState, snapshot, 'Browser Forward then internal back keeps catalog context');
catalogJourney.navigate('catalogo-pneus');
assert.equal(catalogJourney.state.catalogRestoreState, undefined, 'Fresh catalog navigation clears restoration');
assert.equal(catalogJourney.state.catalogFilterBrand, 'Todas');
assert.equal(catalogJourney.state.catalogFilterRim, 'Todos');
catalogJourney.popTo('/pneus/marca/michelin');
assert.equal(catalogJourney.state.catalogRestoreState, undefined, 'Fresh brand URL does not reuse the last catalog snapshot');
assert.equal(catalogJourney.state.catalogFilterBrand, 'michelin');
assert.equal(catalogJourney.state.catalogFilterRim, 'Todos');
catalogJourney.popTo('/pneus', { carplusCatalog: { currentPage: 2 } });
assert.equal(catalogJourney.state.catalogRestoreState, undefined, 'Malformed history entries are ignored');

console.log(`PASS: catalog filter/page snapshots, internal back, browser Back/Forward, fresh navigation and malformed history; ${cases.length} real direct routes under StrictMode/state batching; catalog product changes; product → services/contact/home; browser history; footer handler; both regression controls reproduce the original failures.`);
