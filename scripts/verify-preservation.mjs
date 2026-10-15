#!/usr/bin/env node
/**
 * Verify a UI-only change against a Git baseline, without building or rewriting files.
 * Run after npm run build:
 *   node scripts/verify-preservation.mjs --base <original-commit>
 * Use --sources-only before a build. --allow-home-advice permits an additive home
 * FAQ and the new src/data/tireAdvice.ts, while retaining existing SEO and text.
 * --allow-route-startup-fix permits only the readiness gate and initial catalog
 * selection clears that prevent stale startup/navigation state from replacing URLs.
 * --allow-social-preview permits only the specified home OG/Twitter preview and
 * the exact share-link analytics guard; secondary-page SEO remains unchanged.
 * --allow-real-photos permits only the 16 approved factual imageAlt strings in
 * BLOG_POSTS; image URLs and every other byte of blog data remain protected.
 * HEAD is the default baseline; pin the original
 * commit when checking again after committing the UI change.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const argv = process.argv.slice(2);
const failures = [];
const warnings = [];
const allowHomeAdvice = argv.includes('--allow-home-advice');
const allowRouteStartupFix = argv.includes('--allow-route-startup-fix');
const allowSocialPreview = argv.includes('--allow-social-preview');
const allowRealPhotos = argv.includes('--allow-real-photos');
const homeSocialImage = 'https://www.carpluspneuseoficina.com.br/images/social/carplus-prinx-nova-energia-og.png';
const homeSocialTitle = 'Pneus Prinx para elétricos e híbridos | Carplus';
const homeSocialDescription = 'Encontre pneus para seu elétrico ou híbrido em Curitiba. Consulte a medida e as opções Prinx com a Carplus pelo WhatsApp: (41) 3082-7282.';
const homeSocialAlt = 'Carplus Pneus para Elétricos: Nova energia, a mesma confiança. Linha Prinx para elétricos e híbridos.';
const homeSocialValues = {
  'og:type': 'website', 'og:url': 'https://www.carpluspneuseoficina.com.br/',
  'og:title': homeSocialTitle, 'og:description': homeSocialDescription,
  'og:image': homeSocialImage, 'og:image:secure_url': homeSocialImage,
  'og:image:type': 'image/png', 'og:image:width': '1200', 'og:image:height': '630', 'og:image:alt': homeSocialAlt,
  'twitter:card': 'summary_large_image', 'twitter:title': homeSocialTitle,
  'twitter:description': homeSocialDescription, 'twitter:image': homeSocialImage, 'twitter:image:alt': homeSocialAlt
};
const mutableHomeSocialKeys = new Set(Object.keys(homeSocialValues).filter(key => !['og:type', 'og:url'].includes(key)));
const normalized = value => String(value).replace(/\r\n?/g, '\n');
const digest = value => crypto.createHash('sha256').update(normalized(value)).digest('hex');
const posix = value => value.replace(/\\/g, '/');
const sorted = values => [...new Set(values)].sort();
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

function option(name, fallback) {
  const index = argv.indexOf(name);
  if (index < 0) return fallback;
  if (!argv[index + 1] || argv[index + 1].startsWith('--')) throw new Error(`Missing value for ${name}`);
  return argv[index + 1];
}

function check(condition, message) {
  if (!condition) failures.push(message);
}

function compare(label, before, after) {
  check(JSON.stringify(before) === JSON.stringify(after), `${label} changed`);
}

function normalizeAllowedAdviceAnalytics(baseline, working) {
  const original = "link_url: String(url).slice(0, 300)";
  const allowed = "link_url: el?.closest('[data-analytics-url]')?.getAttribute('data-analytics-url') || String(url).slice(0, 300)";
  const before = normalized(baseline);
  const after = normalized(working);
  if (allowHomeAdvice && before.split(original).length === 2 && after.split(allowed).length === 2) return after.replace(allowed, original);
  return after;
}

function normalizeAllowedShareAnalytics(baseline, working) {
  const guard = "    if (el?.closest('[data-share-channel]')) return;\n";
  const before = normalized(baseline);
  const after = normalized(working);
  if (!allowSocialPreview || before.includes(guard)) return after;
  const prefix = '  function handleInteraction(url: string | null, el: HTMLElement | null) {\n';
  if (after.split(`${prefix}${guard}`).length === 2) return after.replace(`${prefix}${guard}`, prefix);
  return after;
}

function normalizeRealPhotoBlogData(baseline, working) {
  const before = normalized(baseline);
  const after = normalized(working);
  if (!allowRealPhotos) return after;
  // These are descriptions of the existing, visually verified Carplus photos.
  // Each key is a post ID, never a positional or unrestricted property match.
  const approved = {
    'pneus-para-carro-eletrico-em-curitiba': ['loja-de-pneus-em-curitiba.webp', 'Fachada da Carplus iluminada, com letreiro e telefone visíveis.'],
    '1': ['alinhamento.jpg', 'Roda de veículo com alvo de alinhamento e técnico na oficina.'],
    '2': ['rampa-de-geometria.jpg', 'Jeep Compass branco sobre a rampa de alinhamento na oficina.'],
    '3': ['montagem-tecnica.jpg', 'Técnico manuseando pneu junto ao equipamento da oficina.'],
    '4': ['troca-de-pneus.jpg', 'Homem ao lado de um pneu no equipamento da oficina.'],
    '5': ['fachada-carplus.webp', 'Fachada da Carplus com letreiro e símbolo da marca.'],
    '6': ['tecnicos.jpg', 'Técnico trabalhando junto ao capô aberto de um veículo.'],
    '7': ['auto-center-pneus-portao.jpg', 'Rodas e pneus em primeiro plano, com equipamentos da oficina ao fundo.'],
    '8': ['caminhonete-suv.jpg', 'SUVs suspensos sem rodas e outros veículos no interior da oficina.'],
    '9': ['consultoria-avaliacao-estrutural.jpg', 'Dois homens junto a um veículo suspenso na oficina.'],
    '10': ['rodas-de-liga-leve.webp', 'Rodas de liga leve expostas no interior da loja.'],
    'pneus-para-carro-eletrico-o-que-muda-quanto-duram-como-escolher': ['loja-de-pneus-em-curitiba.webp', 'Fachada da Carplus iluminada, com letreiro e telefone visíveis.'],
    'posso-usar-pneu-comum-no-meu-carro-eletrico-ou-hibrido': ['troca-de-pneus.jpg', 'Homem ao lado de um pneu no equipamento da oficina.'],
    'duvidas-sobre-pneus-quando-trocar-twi-validade-calibragem-rodizio': ['mostruario-pneus-novos.webp', 'Pneus com etiquetas organizados em prateleiras na loja.'],
    'auto-center-em-curitiba-como-escolher-oficina-de-pneus-de-confianca': ['fachada-carplus.webp', 'Fachada da Carplus com letreiro e símbolo da marca.'],
    'pneus-em-curitiba-guia-completo-comprar-pneus-novos-com-instalacao': ['mostruario-pneus-novos.webp', 'Pneus com etiquetas organizados em prateleiras na loja.']
  };
  const ts = require('typescript');
  function posts(source) {
    const ast = ts.createSourceFile('src/blog-data.ts', source, ts.ScriptTarget.Latest, true);
    const declarations = ast.statements.filter(ts.isVariableStatement).flatMap(statement => [...statement.declarationList.declarations]).filter(declaration => ts.isIdentifier(declaration.name) && declaration.name.text === 'BLOG_POSTS');
    if (declarations.length !== 1 || !ts.isArrayLiteralExpression(declarations[0].initializer)) throw new Error('Expected one literal BLOG_POSTS array for the real-photo exception');
    const entries = new Map();
    for (const post of declarations[0].initializer.elements) {
      if (!ts.isObjectLiteralExpression(post)) throw new Error('Unexpected BLOG_POSTS entry in real-photo exception');
      const fields = {};
      for (const key of ['id', 'featuredImage', 'imageAlt']) {
        const properties = post.properties.filter(property => ts.isPropertyAssignment(property) && property.name.text === key);
        if (properties.length !== 1 || !ts.isStringLiteral(properties[0].initializer)) throw new Error(`Expected a single literal ${key} per blog post`);
        const literal = properties[0].initializer;
        fields[key] = { value: literal.text, start: literal.getStart(ast), end: literal.getEnd() };
      }
      if (entries.has(fields.id.value)) throw new Error(`Duplicate blog ID: ${fields.id.value}`);
      entries.set(fields.id.value, fields);
    }
    return entries;
  }
  const beforePosts = posts(before);
  const afterPosts = posts(after);
  const ids = Object.keys(approved);
  if (beforePosts.size !== ids.length || afterPosts.size !== ids.length) throw new Error('Real-photo exception requires exactly the original 16 blog posts');
  const replacements = [];
  for (const id of ids) {
    const original = beforePosts.get(id);
    const current = afterPosts.get(id);
    const [file, alt] = approved[id];
    if (!original || !current || original.featuredImage.value !== `/images/galeria/${file}` || current.featuredImage.value !== original.featuredImage.value) throw new Error(`Blog image URL changed or missing for ${id}`);
    if (current.imageAlt.value !== alt) throw new Error(`Blog imageAlt is not the approved factual description for ${id}`);
    replacements.push({ start: current.imageAlt.start, end: current.imageAlt.end, value: before.slice(original.imageAlt.start, original.imageAlt.end) });
  }
  // Replacing only literal ranges preserves every other character for the hash.
  return replacements.sort((a, b) => b.start - a.start).reduce((source, replacement) => source.slice(0, replacement.start) + replacement.value + source.slice(replacement.end), after);
}

function normalizeSocialIndexSource(source, validate = false) {
  const text = normalized(source);
  if (validate) {
    validateHomeSocialMetadata(htmlSeo(text, 'index.html').metas, 'index.html');
    for (const match of text.matchAll(/<meta\b[^>]*>/gi)) {
      const meta = attributes(match[0]);
      const key = meta.property || meta.name || '';
      if (!Object.hasOwn(homeSocialValues, key)) continue;
      check(meta['data-carplus-social-fallback'] === 'true', `index.html: missing social fallback marker on ${key}`);
      check(Object.keys(meta).every(attribute => ['property', 'name', 'content', 'data-carplus-social-fallback'].includes(attribute)), `index.html: unexpected attributes on ${key}`);
    }
  }
  return text.replace(/^[\t ]*<meta\b[^>]*>[\t ]*\n?/gm, tag => {
    const meta = attributes(tag);
    return Object.hasOwn(homeSocialValues, meta.property || meta.name || '') ? '' : tag;
  });
}

function normalizeSocialEnhancedSeo(baseline, working) {
  const before = normalized(baseline);
  let after = normalized(working);
  if (!allowSocialPreview || before === after) return after;
  const replacements = [
    ["import { HOME_SOCIAL_IMAGE_URL, HOME_SOCIAL_TITLE, HOME_SOCIAL_DESCRIPTION, HOME_SOCIAL_IMAGE_ALT } from '../lib/socialPreview';\n", ''],
    ["  const isHomeSocialPreview = currentView === 'home' && !selectedTire && !selectedCatalogTire && !seoTarget;\n", ''],
    ['  let ogImage = isHomeSocialPreview ? HOME_SOCIAL_IMAGE_URL : `${domain}/og-carplus.webp`;', '  let ogImage = `${domain}/og-carplus.webp`;'],
    ['<meta property="og:title" content={isHomeSocialPreview ? HOME_SOCIAL_TITLE : title} />', '<meta property="og:title" content={title} />'],
    ['<meta property="og:description" content={isHomeSocialPreview ? HOME_SOCIAL_DESCRIPTION : desc} />', '<meta property="og:description" content={desc} />'],
    ['      {isHomeSocialPreview && <meta property="og:image:type" content="image/png" />}\n', ''],
    ['<meta property="og:image:alt" content={isHomeSocialPreview ? HOME_SOCIAL_IMAGE_ALT : \'Carplus Pneus Portão Curitiba\'} />', '<meta property="og:image:alt" content="Carplus Pneus Portão Curitiba" />'],
    ['<meta name="twitter:title" content={isHomeSocialPreview ? HOME_SOCIAL_TITLE : title} />', '<meta name="twitter:title" content={title} />'],
    ['<meta name="twitter:description" content={isHomeSocialPreview ? HOME_SOCIAL_DESCRIPTION : desc} />', '<meta name="twitter:description" content={desc} />'],
    ['      {isHomeSocialPreview && <meta name="twitter:image:alt" content={HOME_SOCIAL_IMAGE_ALT} />}\n', '']
  ];
  for (const [permitted, original] of replacements) {
    if (!before.includes(permitted) && after.split(permitted).length === 2) after = after.replace(permitted, original);
  }
  return after;
}

function validateHomeSocialMetadata(metas, label) {
  for (const [key, expected] of Object.entries(homeSocialValues)) {
    const values = metas.filter(([name]) => name === key).map(([, value]) => value);
    compare(`${label}: exact social metadata ${key}`, [expected], values);
  }
}

function protectedPath(file) {
  return /^(?:src\/(?:data(?:\/|\.ts$)|blog-data\.ts$|seo-data\.ts$|lib\/analytics\.ts$|utils\/(?:seoWaves|slugify)\.ts$|components\/EnhancedSEO\.tsx$)|scripts\/(?:build-seo\.ts|vite-plugin-prerender\.ts)$|(?:vite\.config\.ts|index\.html|catalogo-pneus\.json|relatorio-incompletos\.json|metadata\.json|urls_to_test\.json|vercel\.json|_redirects)$|public\/(?:sitemap[^/]*\.xml|robots\.txt|llms(?:-full)?\.txt|_redirects|\.htaccess|404\.html|[a-z0-9]{24,}\.txt)$)/i.test(file);
}

function analyticsIds(text) {
  return sorted(text.match(/\b(?:G-[A-Z0-9]{5,}|GTM-[A-Z0-9]+|AW-\d+(?:\/[A-Za-z0-9_-]+)?|UA-\d+-\d+)\b/g) || []);
}

function attributes(tag) {
  const result = {};
  for (const match of tag.matchAll(/([^\s=<>/]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
    result[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4];
  }
  return result;
}

function canonicalJson(value) {
  if (Array.isArray(value)) return value.map(canonicalJson);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonicalJson(value[key])]));
  return value;
}

function isSubsequence(before, after) {
  let index = 0;
  for (const value of after) if (index < before.length && before[index] === value) index++;
  return index === before.length;
}

function onlyFaqSchema(schema) {
  return schema?.['@type'] === 'FAQPage' || (Array.isArray(schema?.['@graph']) && schema['@graph'].length > 0 && schema['@graph'].every(node => node?.['@type'] === 'FAQPage'));
}

function htmlSeo(html, file) {
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] || '';
  const metas = [...head.matchAll(/<meta\b[^>]*>/gi)].map(match => attributes(match[0])).map(meta => {
    const key = meta.name || meta.property || meta['http-equiv'] || (meta.charset ? 'charset' : '');
    return [key.toLowerCase(), meta.content ?? meta.charset ?? ''];
  }).filter(([key]) => key).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
  const canonicals = [...head.matchAll(/<link\b[^>]*>/gi)].map(match => attributes(match[0])).filter(link => link.rel?.toLowerCase() === 'canonical').map(link => link.href);
  const schemas = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].filter(match => attributes(match[1]).type === 'application/ld+json').map(match => {
    try { return canonicalJson(JSON.parse(match[2])); }
    catch { throw new Error(`Invalid JSON-LD in ${file}`); }
  });
  const headings = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map(match => match[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim());
  const redirect = metas.find(([key]) => key === 'refresh')?.[1] || '';
  const bodyText = (html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] || '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean);
  return {
    title: head.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1].trim() || '',
    metas, canonicals, schemas, headings, redirect, bodyText,
    analyticsIds: analyticsIds(head),
    hasPrerenderedRoot: Boolean(html.match(/<div\s+id=["']root["'][^>]*>([\s\S]*?)<\/div>/i)?.[1].replace(/<!--[\s\S]*?-->/g, '').trim())
  };
}

function compareSeo(label, file, beforeHtml, afterHtml, permitAdvice = false) {
  const before = htmlSeo(beforeHtml, file);
  const after = htmlSeo(afterHtml, file);
  if (allowSocialPreview && file === 'index.html') {
    validateHomeSocialMetadata(after.metas, label);
    after.metas = [...after.metas.filter(([key]) => !mutableHomeSocialKeys.has(key)), ...before.metas.filter(([key]) => mutableHomeSocialKeys.has(key))].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
  }
  if (!permitAdvice || file !== 'index.html') { compare(label, before, after); return; }
  const { schemas: beforeSchemas, bodyText: beforeText, ...beforeMetadata } = before;
  const { schemas: afterSchemas, bodyText: afterText, ...afterMetadata } = after;
  compare(label, beforeMetadata, afterMetadata);
  check(isSubsequence(beforeText, afterText), `${label}: existing home text removed or reordered`);
  let existingSchema = 0;
  for (const schema of afterSchemas) {
    if (existingSchema < beforeSchemas.length && JSON.stringify(schema) === JSON.stringify(beforeSchemas[existingSchema])) existingSchema++;
    else check(onlyFaqSchema(schema), `${label}: only additive FAQPage JSON-LD is allowed on home`);
  }
  check(existingSchema === beforeSchemas.length, `${label}: existing home JSON-LD changed or removed`);
}

function walk(directory, suffix) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(file, suffix) : entry.isFile() && file.endsWith(suffix) ? [file] : [];
  });
}

function routeContract(ts, appSource, normalizeStartup = false) {
  const source = ts.createSourceFile('src/App.tsx', appSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const printer = ts.createPrinter({ removeComments: true, newLine: ts.NewLineKind.LineFeed });
  const contract = {};
  const declarations = new Set(['PAGE_VIEWS', 'parsePathAndSetState', 'handleNavigateInternal', 'handleScrollToSection']);
  const print = node => printer.printNode(ts.EmitHint.Unspecified, node, source).trim();
  const routeEffects = [];
  const seoUses = [];
  let readyStates = 0;
  function updateArrow(body, arrow) {
    return ts.factory.updateArrowFunction(arrow, arrow.modifiers, arrow.typeParameters, arrow.parameters, arrow.type, arrow.equalsGreaterThanToken, ts.factory.updateBlock(arrow.body, body));
  }
  function normalizeHandler(node) {
    if (!normalizeStartup || !['parsePathAndSetState', 'handleScrollToSection'].includes(node.name.text)) return node;
    const arrow = node.initializer;
    if (!ts.isArrowFunction(arrow) || !ts.isBlock(arrow.body) || print(arrow.body.statements[0]) !== 'setSelectedCatalogTire(null);') throw new Error(`Expected exactly one initial catalog clear in ${node.name.text}`);
    const initializer = updateArrow(arrow.body.statements.slice(1), arrow);
    return ts.factory.updateVariableDeclaration(node, node.name, node.exclamationToken, node.type, initializer);
  }
  function normalizeEffect(node) {
    if (!normalizeStartup) return node;
    const arrow = node.arguments[0];
    const deps = node.arguments[1];
    if (!ts.isArrowFunction(arrow) || !ts.isBlock(arrow.body) || !ts.isArrayLiteralExpression(deps) || node.arguments.length !== 2) throw new Error('Unexpected routing effect structure');
    let statements = [...arrow.body.statements];
    let nextDeps = deps;
    if (/\blet\s+idealPath\b/.test(node.getText(source))) {
      const gate = statements[0];
      if (!ts.isIfStatement(gate) || gate.elseStatement || !ts.isPrefixUnaryExpression(gate.expression) || gate.expression.operator !== ts.SyntaxKind.ExclamationToken || gate.expression.operand.getText(source) !== 'isRouteReady' || !ts.isReturnStatement(gate.thenStatement) || gate.thenStatement.expression) throw new Error('Expected exactly if (!isRouteReady) return at the start of the URL effect');
      const names = deps.elements.map(element => element.getText(source));
      if (JSON.stringify(names) !== JSON.stringify(['isRouteReady', 'currentView', 'seoTarget', 'selectedTire', 'selectedCatalogTire', 'selectedBlogSlug'])) throw new Error('Unexpected route startup dependency changes');
      statements = statements.slice(1);
      nextDeps = ts.factory.updateArrayLiteralExpression(deps, deps.elements.filter((_, index) => index !== 0 && index !== 4));
    } else {
      if (print(statements[0]) !== 'parsePathAndSetState();' || print(statements[1]) !== 'setIsRouteReady(true);') throw new Error('Expected setIsRouteReady(true) immediately after the initial URL parse');
      statements.splice(1, 1);
    }
    return ts.factory.updateCallExpression(node, node.expression, node.typeArguments, [updateArrow(statements, arrow), nextDeps]);
  }
  function visit(node) {
    if (normalizeStartup && ts.isVariableDeclaration(node) && ts.isArrayBindingPattern(node.name) && node.name.elements[0]?.name?.getText(source) === 'isRouteReady') {
      readyStates++;
      if (print(node) !== '[isRouteReady, setIsRouteReady] = useState(false)') throw new Error('The route readiness state must be exactly useState(false) with the expected setter');
    }
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && declarations.has(node.name.text)) contract[node.name.text] = print(normalizeHandler(node));
    if (ts.isCallExpression(node) && node.expression.getText(source) === 'useEffect') {
      const text = node.getText(source);
      if (/\bparsePathAndSetState\s*\(|\blet\s+idealPath\b/.test(text)) routeEffects.push(print(normalizeEffect(node)));
    }
    if ((ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) && node.tagName.getText(source) === 'EnhancedSEO') seoUses.push(print(node));
    ts.forEachChild(node, visit);
  }
  visit(source);
  contract.routeEffects = routeEffects;
  contract.enhancedSeoUses = seoUses;
  if (normalizeStartup && readyStates !== 1) throw new Error('Expected one and only one isRouteReady state declaration');
  if ([...declarations].some(name => !contract[name]) || routeEffects.length < 2 || !seoUses.length) throw new Error('Could not identify the existing App routing/SEO contract; inspect verifier before relying on it');
  return contract;
}

/** Execute the existing SEO generator against a virtual filesystem only. */
function virtualSeoBuild(ts, readSource, label) {
  const files = new Map();
  const directories = new Set([root, path.join(root, 'public'), path.join(root, 'dist')]);
  const cache = new Map();
  const errors = [];
  const fileKey = file => path.resolve(String(file));
  files.set(fileKey(path.join(root, 'dist', 'index.html')), readSource('index.html'));
  const virtualFs = {
    existsSync(file) { return files.has(fileKey(file)) || directories.has(fileKey(file)); },
    readFileSync(file) {
      const key = fileKey(file);
      if (!files.has(key)) throw new Error(`Unexpected virtual filesystem read: ${file}`);
      return files.get(key);
    },
    writeFileSync(file, value) { files.set(fileKey(file), String(value)); },
    mkdirSync(file) { directories.add(fileKey(file)); }
  };
  function load(moduleId) {
    if (cache.has(moduleId)) return cache.get(moduleId).exports;
    const module = { exports: {} };
    cache.set(moduleId, module);
    const text = readSource(moduleId);
    if (moduleId.endsWith('.json')) { module.exports = JSON.parse(text); return module.exports; }
    const compiled = ts.transpileModule(text, {
      fileName: moduleId,
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true }
    }).outputText;
    const sandboxRequire = name => {
      if (name === 'fs' || name === 'node:fs') return virtualFs;
      if (name === 'path' || name === 'node:path') return path;
      if (!name.startsWith('.')) throw new Error(`Unexpected dependency in SEO generator: ${name}`);
      const relative = path.posix.normalize(path.posix.join(path.posix.dirname(moduleId), name));
      for (const candidate of [relative, `${relative}.ts`, `${relative}.tsx`, `${relative}.json`, `${relative}/index.ts`]) {
        try { readSource(candidate); return load(candidate); }
        catch (error) { if (!['ENOENT', 'EISDIR', 'BASE_FILE_MISSING'].includes(error.code)) throw error; }
      }
      throw new Error(`Cannot resolve SEO dependency ${name} from ${moduleId}`);
    };
    const context = vm.createContext({
      require: sandboxRequire, module, exports: module.exports,
      process: { cwd: () => root, env: {} },
      console: { log() {}, warn() {}, error(...args) { errors.push(args.map(String).join(' ')); } }
    });
    new vm.Script(compiled, { filename: `${label}:${moduleId}` }).runInContext(context, { timeout: 30000 });
    return module.exports;
  }
  load('scripts/build-seo.ts');
  if (errors.length) throw new Error(`${label} SEO generator reported: ${errors.join('; ')}`);
  const distPrefix = `${path.join(root, 'dist')}${path.sep}`;
  return new Map([...files].filter(([file]) => file.startsWith(distPrefix)).map(([file, text]) => [posix(path.relative(path.join(root, 'dist'), file)), text]));
}

function sitemapInventory(text) {
  return sorted([...text.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)].map(match => match[1].trim()));
}

function summarize(htmlMap) {
  const summary = { html: 0, indexable: 0, noindex: 0, redirects: 0, jsonLdPages: 0, categories: {} };
  for (const [file, html] of htmlMap) {
    if (!file.endsWith('.html')) continue;
    const seo = htmlSeo(html, file);
    summary.html++;
    if (seo.redirect) summary.redirects++;
    if (seo.metas.some(([key, content]) => key === 'robots' && /noindex/i.test(content))) summary.noindex++;
    else if (!seo.redirect) summary.indexable++;
    if (seo.schemas.length) summary.jsonLdPages++;
    const category = file === 'index.html' ? 'home' : file.split('/')[0];
    summary.categories[category] = (summary.categories[category] || 0) + 1;
  }
  return summary;
}

try {
  const baseRef = option('--base', 'HEAD');
  const baseCommit = git('rev-parse', '--verify', '--end-of-options', `${baseRef}^{commit}`).trim();
  const baseFiles = git('ls-tree', '-r', '--name-only', baseCommit).trim().split(/\r?\n/).filter(Boolean);
  const baseSet = new Set(baseFiles);
  const workingFiles = git('ls-files', '-c', '-o', '--exclude-standard', '-z').split('\0').filter(Boolean);
  const readBase = file => {
    if (!baseSet.has(file)) { const error = new Error(`No baseline file ${file}`); error.code = 'BASE_FILE_MISSING'; throw error; }
    return git('show', `${baseCommit}:${file}`);
  };
  const readWorking = file => fs.readFileSync(path.join(root, file), 'utf8');
  const protectedFiles = sorted([...baseFiles, ...workingFiles].filter(protectedPath));
  for (const file of protectedFiles) {
    if (allowHomeAdvice && file === 'src/data/tireAdvice.ts' && !baseSet.has(file)) continue;
    if ((allowHomeAdvice || allowSocialPreview) && file === 'scripts/build-seo.ts') {
      check(fs.existsSync(path.join(root, file)), `Protected file removed: ${file}`);
      continue; // All of its generated pages, metadata, schemas and text are checked below.
    }
    check(baseSet.has(file), `Protected file added: ${file}`);
    check(fs.existsSync(path.join(root, file)), `Protected file removed: ${file}`);
    if (baseSet.has(file) && fs.existsSync(path.join(root, file))) {
      const baseline = readBase(file);
      const working = readWorking(file);
      if (allowSocialPreview && file === 'index.html') compare(`Protected file ${file}`, digest(normalizeSocialIndexSource(baseline)), digest(normalizeSocialIndexSource(working, true)));
      else {
        let permitted = working;
        if (file === 'src/lib/analytics.ts') permitted = normalizeAllowedAdviceAnalytics(baseline, normalizeAllowedShareAnalytics(baseline, working));
        if (allowSocialPreview && file === 'src/components/EnhancedSEO.tsx') permitted = normalizeSocialEnhancedSeo(baseline, working);
        if (allowRealPhotos && file === 'src/blog-data.ts') permitted = normalizeRealPhotoBlogData(baseline, working);
        compare(`Protected file ${file}`, digest(baseline), digest(permitted));
      }
    }
  }

  const baselinePackage = JSON.parse(readBase('package.json'));
  const currentPackage = JSON.parse(readWorking('package.json'));
  compare('Production build command', baselinePackage.scripts?.build, currentPackage.scripts?.build);

  let ts;
  try { ts = require('typescript'); }
  catch { throw new Error('Install repository dependencies with npm ci before running this verifier (typescript is required)'); }
  const baseApp = readBase('src/App.tsx');
  const beforeContract = routeContract(ts, baseApp, allowRouteStartupFix && /\[isRouteReady,\s*setIsRouteReady\]\s*=\s*useState\(false\)/.test(baseApp));
  const afterContract = routeContract(ts, readWorking('src/App.tsx'), allowRouteStartupFix);
  for (const key of Object.keys(beforeContract)) compare(`App route/SEO contract: ${key}`, beforeContract[key], afterContract[key]);

  const baselineIds = analyticsIds(readBase('index.html') + readBase('src/lib/analytics.ts'));
  compare('Analytics property IDs', baselineIds, analyticsIds(readWorking('index.html') + readWorking('src/lib/analytics.ts')));
  const expected = virtualSeoBuild(ts, readBase, 'baseline');
  const currentGenerated = virtualSeoBuild(ts, readWorking, 'working');
  compare('Generated SEO file inventory', sorted(expected.keys()), sorted(currentGenerated.keys()));
  for (const [file, html] of expected) {
    if (file.endsWith('.html') && currentGenerated.has(file)) compareSeo(`Generated SEO ${file}`, file, html, currentGenerated.get(file), allowHomeAdvice);
    else if (currentGenerated.has(file)) compare(`Generated sitemap/robots ${file}`, normalized(html), normalized(currentGenerated.get(file)));
  }

  // Vite copies public files before the generator runs; include those untouched pages/files.
  for (const file of baseFiles.filter(file => file.startsWith('public/') && (protectedPath(file) || file.endsWith('.html')))) {
    const output = file.slice('public/'.length);
    if (!expected.has(output)) expected.set(output, readBase(file));
  }
  const expectedBuild = new Map(expected);
  if ((allowHomeAdvice || allowSocialPreview) && currentGenerated.has('index.html')) expectedBuild.set('index.html', currentGenerated.get('index.html'));

  if (!argv.includes('--sources-only')) {
    const dist = path.resolve(root, option('--dist', 'dist'));
    check(fs.existsSync(path.join(dist, 'index.html')), 'Missing dist/index.html; run npm run build first');
    const actualHtml = sorted(walk(dist, '.html').map(file => posix(path.relative(dist, file))));
    compare('Built HTML route inventory', sorted([...expectedBuild.keys()].filter(file => file.endsWith('.html'))), actualHtml);
    for (const [file, baseline] of expectedBuild) {
      const output = path.join(dist, file);
      if (!fs.existsSync(output)) { failures.push(`Build output missing: ${file}`); continue; }
      const actual = fs.readFileSync(output, 'utf8');
      if (file.endsWith('.html')) compareSeo(`Built SEO ${file}`, file, baseline, actual);
      else compare(`Built SEO support file ${file}`, normalized(baseline), normalized(actual));
    }
  }

  const baselineSummary = summarize(expected);
  const sitemapCounts = Object.fromEntries([...expected].filter(([file]) => /^sitemap[^/]*\.xml$/.test(file)).map(([file, text]) => [file, sitemapInventory(text).length]));
  const catalog = JSON.parse(readBase('catalogo-pneus.json'));
  const catalogCount = Array.isArray(catalog) ? catalog.length : Object.keys(catalog).length;
  console.log(`Baseline ${baseCommit}`);
  console.log(`Protected source/data/SEO/analytics files: ${protectedFiles.length}; catalog records: ${catalogCount}`);
  console.log(`Generated/preserved HTML: ${baselineSummary.html}; indexable: ${baselineSummary.indexable}; noindex: ${baselineSummary.noindex}; redirects: ${baselineSummary.redirects}; JSON-LD pages: ${baselineSummary.jsonLdPages}`);
  console.log(`Analytics IDs: ${baselineIds.join(', ') || '(none)'}`);
  console.log(`Sitemap inventories: ${JSON.stringify(sitemapCounts)}`);
  console.log(`App routing contracts: ${Object.keys(beforeContract).join(', ')}`);
  if (allowHomeAdvice) warnings.push('Additive home advice enabled: existing text/metadata must remain; additional home JSON-LD must be FAQPage; only the exact data-analytics-url fallback is permitted in analytics.ts');
  if (allowRouteStartupFix) warnings.push('Route startup fix enabled: only the exact readiness state/gate/dependencies and first catalog clear in the two navigation handlers are normalized');
  if (allowSocialPreview) warnings.push('Home social preview enabled: exact OG/Twitter values and fallback markers, exact EnhancedSEO edits and one exact share analytics guard only; secondary-page metadata remains unchanged');
  if (allowRealPhotos) warnings.push('Real photos enabled: only the exact factual imageAlt literal for each of the 16 original blog IDs is normalized; featuredImage URLs and all other blog data remain protected');
  if (argv.includes('--sources-only')) warnings.push('dist was not checked (--sources-only); run the full verification after the production build');
  for (const warning of warnings) console.warn(`WARN: ${warning}`);
  if (failures.length) {
    console.error(`FAIL: ${failures.length} preservation check(s)`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
  } else console.log(`PASS: ${argv.includes('--sources-only') ? 'source' : 'source and built'} routes, SEO, data, redirects and analytics preserved; UI markup/classes are unrestricted`);
} catch (error) {
  console.error(`FAIL: ${error.message}`);
  process.exitCode = 1;
}
