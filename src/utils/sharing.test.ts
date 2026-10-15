import assert from 'node:assert/strict';
import { test } from 'node:test';
import { HOME_SOCIAL_DESCRIPTION, HOME_SOCIAL_TITLE, SITE_ORIGIN } from '../lib/socialPreview';
import { createPageShare } from './sharing';

test('home sharing uses the social title and description without campaign parameters', () => {
  const share = createPageShare('/?utm_source=ad#contact', 'Temporary preview title');
  assert.equal(share.url, `${SITE_ORIGIN}/`);
  assert.equal(share.title, HOME_SOCIAL_TITLE);
  assert.equal(share.text, HOME_SOCIAL_DESCRIPTION);
});

test('a local preview shares the public page path and document title', () => {
  const share = createPageShare('http://127.0.0.1:8091/pneu-byd-dolphin-mini-curitiba?fbclid=private#medidas', 'Pneus para BYD Dolphin Mini | Carplus');
  assert.equal(share.url, `${SITE_ORIGIN}/pneu-byd-dolphin-mini-curitiba`);
  assert.equal(share.title, 'Pneus para BYD Dolphin Mini | Carplus');
  assert.equal(share.text, share.title);
});

test('external and protocol-relative input cannot replace the canonical origin', () => {
  assert.equal(createPageShare('https://unrelated.example/pneus?x=1#private').url, `${SITE_ORIGIN}/pneus`);
  assert.equal(createPageShare('//unrelated.example/pneus').url, `${SITE_ORIGIN}/pneus`);
  assert.equal(createPageShare('https://unrelated.example//pneus').url, `${SITE_ORIGIN}/pneus`);
});

test('WhatsApp share opens recipient selection instead of a store conversation', () => {
  const share = createPageShare('/pneus', 'Catálogo de pneus | Carplus');
  const whatsapp = new URL(share.whatsappUrl);
  assert.equal(whatsapp.origin, 'https://api.whatsapp.com');
  assert.equal(whatsapp.pathname, '/send');
  assert.equal(whatsapp.searchParams.has('phone'), false);
  assert.equal(whatsapp.searchParams.get('text'), `Catálogo de pneus | Carplus\n${SITE_ORIGIN}/pneus`);
});

test('invalid input falls back to a usable canonical home URL', () => {
  const share = createPageShare('http://[invalid');
  assert.equal(share.url, `${SITE_ORIGIN}/`);
  assert.equal(share.title, HOME_SOCIAL_TITLE);
});
