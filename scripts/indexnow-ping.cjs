/**
 * Script de submissão do protocolo IndexNow para Bing e Yandex
 * Execução: node scripts/indexnow-ping.cjs
 */
const https = require('https');

const HOST = 'www.carpluspneuseoficina.com.br';
const KEY = 'c7f0b9f5a6234b6890e72bd58a12c84e';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const URL_LIST = [
  `https://${HOST}/`,
  `https://${HOST}/pneus`,
  `https://${HOST}/servicos`,
  `https://${HOST}/alinhamento-3d-curitiba`,
  `https://${HOST}/centro-automotivo-portao`,
  `https://${HOST}/pneu-aro-13`,
  `https://${HOST}/pneu-aro-14`,
  `https://${HOST}/pneu-aro-15`,
  `https://${HOST}/pneu-aro-16`,
  `https://${HOST}/pneu-aro-17`,
  `https://${HOST}/pneu-aro-18`,
  `https://${HOST}/blog`,
  `https://${HOST}/blog/pneus-para-carro-eletrico-o-que-muda-quanto-duram-como-escolher`,
  `https://${HOST}/blog/posso-usar-pneu-comum-no-meu-carro-eletrico-ou-hibrido`,
  `https://${HOST}/blog/duvidas-sobre-pneus-quando-trocar-twi-validade-calibragem-rodizio`,
  `https://${HOST}/blog/auto-center-em-curitiba-como-escolher-oficina-de-pneus-de-confianca`,
  `https://${HOST}/blog/pneus-em-curitiba-guia-completo-comprar-pneus-novos-com-instalacao`,
  `https://${HOST}/contato`
];

const payload = JSON.stringify({
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList: URL_LIST
});

const options = {
  hostname: 'api.indexnow.org',
  port: 443,
  path: '/indexnow',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload)
  }
};

console.log(`[IndexNow] Enviando ${URL_LIST.length} URLs para api.indexnow.org...`);

const req = https.request(options, (res) => {
  console.log(`[IndexNow] Código de resposta HTTP: ${res.statusCode} ${res.statusMessage || ''}`);
  if (res.statusCode === 200 || res.statusCode === 202) {
    console.log('[IndexNow] Sucesso! URLs submetidas e chave validada pelo Bing e Yandex.');
  } else {
    console.log(`[IndexNow] Resposta recebida: ${res.statusCode}.`);
  }
});

req.on('error', (error) => {
  console.warn('[IndexNow] Aviso de envio (transiente de rede):', error.message);
});

req.write(payload);
req.end();
