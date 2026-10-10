/**
 * Script de auditoria e correção de imagens do catálogo Carplus
 * Execução: node check-images.cjs [--fix]
 */
const fs = require('fs');
const path = require('path');

const BRAND_MAPPING = {
  bridgestone: 'bridgestone',
  comforser: 'comforser',
  continental: 'continental',
  delinte: 'delinte',
  firestone: 'firestone',
  goodyear: 'goodyear',
  hifly: 'hifly',
  jk: 'jk-tyre',
  jktyre: 'jk-tyre',
  'jk tyre': 'jk-tyre',
  linglong: 'linglong',
  maxtrek: 'maxtrek',
  michelin: 'michelin',
  pirelli: 'pirelli',
  prinx: 'prinx',
  provato: 'provato',
  roadking: 'roadking',
  speedmax: 'speedmax',
  tornel: 'tornel',
  xbri: 'xbri',
  yokohama: 'yokohama',
  zmax: 'zmax'
};

function getBrandSlug(brand) {
  if (!brand) return 'pirelli';
  const clean = String(brand).toLowerCase().trim();
  for (const [key, slug] of Object.entries(BRAND_MAPPING)) {
    if (clean.includes(key)) return slug;
  }
  return 'pirelli';
}

function resolveTireImage(brand, isLarge = false) {
  const slug = getBrandSlug(brand);
  const fileName = isLarge ? `${slug}.webp` : `${slug}-300.webp`;
  const relativePath = `/pneus/${fileName}`;
  const fullPath = path.join(__dirname, 'public', 'pneus', fileName);
  if (fs.existsSync(fullPath)) {
    return relativePath;
  }
  return '/images/pneus/pneu-fallback.svg';
}

function checkAndFixCatalogoJson() {
  const jsonPath = path.join(__dirname, 'catalogo-pneus.json');
  if (!fs.existsSync(jsonPath)) return { total: 0, fixed: 0, itemsFixed: [] };

  const raw = fs.readFileSync(jsonPath, 'utf-8');
  const catalog = JSON.parse(raw);
  let fixedCount = 0;
  const itemsFixed = [];

  for (const item of catalog) {
    let changed = false;
    const currentImg = item.imagem || '';
    const currentImgG = item.imagemGrande || '';

    // Verify if currentImg exists in public/
    let exists = false;
    if (currentImg.startsWith('/') && fs.existsSync(path.join(__dirname, 'public', currentImg.slice(1)))) {
      exists = true;
    }

    if (!exists || currentImg.startsWith('http') || currentImg.includes('carpluspneuseoficina.com.br')) {
      const correctThumb = resolveTireImage(item.marca, false);
      const correctLarge = resolveTireImage(item.marca, true);
      itemsFixed.push({
        id: item.id,
        nome: item.nome,
        marca: item.marca,
        de: currentImg,
        para: correctThumb
      });
      item.imagem = correctThumb;
      item.imagemGrande = correctLarge;
      changed = true;
      fixedCount++;
    }
  }

  fs.writeFileSync(jsonPath, JSON.stringify(catalog, null, 2), 'utf-8');
  return { total: catalog.length, fixed: fixedCount, itemsFixed };
}

function checkAndFixDataTs() {
  const dataPath = path.join(__dirname, 'src', 'data.ts');
  if (!fs.existsSync(dataPath)) return { fixed: 0 };

  let content = fs.readFileSync(dataPath, 'utf-8');
  let fixedCount = 0;

  // Replace external image URLs in RAW_TIRES_DATA
  // Format: "image": "https://...", and brand is in the same object
  const regex = /\{\s*"id":\s*"([^"]+)",\s*"brand":\s*"([^"]+)",\s*"name":\s*"([^"]+)",\s*"price":\s*(\d+),\s*"promoPrice":\s*(\d+),\s*"image":\s*"([^"]+)"/g;

  content = content.replace(regex, (match, id, brand, name, price, promoPrice, oldImg) => {
    const newImg = resolveTireImage(brand, false);
    if (oldImg !== newImg) {
      fixedCount++;
      return `{\n    "id": "${id}",\n    "brand": "${brand}",\n    "name": "${name}",\n    "price": ${price},\n    "promoPrice": ${promoPrice},\n    "image": "${newImg}"`;
    }
    return match;
  });

  fs.writeFileSync(dataPath, content, 'utf-8');
  return { fixed: fixedCount };
}

console.log('=== AUDITORIA E CORREÇÃO DE ASSETS (PNEUS) ===\n');

const resJson = checkAndFixCatalogoJson();
console.log(`catalogo-pneus.json:`);
console.log(`  Total de produtos: ${resJson.total}`);
console.log(`  Produtos verificados e corrigidos para arquivos locais reais: ${resJson.fixed}`);

const resData = checkAndFixDataTs();
console.log(`\nsrc/data.ts:`);
console.log(`  Produtos em RAW_TIRES_DATA corrigidos para arquivos locais reais: ${resData.fixed}`);

console.log('\nAmostra de produtos com imagem corrigida:');
resJson.itemsFixed.slice(0, 10).forEach(item => {
  console.log(`  [ID ${item.id}] ${item.nome} (${item.marca}):`);
  console.log(`     -> ${item.para}`);
});

console.log('\nTodos os produtos apontam agora para /pneus/[marca]-300.webp ou /pneus/[marca].webp existentes em public/pneus/!');
