# Catalog image correction (preview only)

Reviewed 2026-11-03. Resolver: `src/lib/tireImageManifest.ts`. Rendering: `VerifiedTireImage`.

The resolver allows seven explicitly identified models, never a brand-wide image. It reads the actual product title first, requires matching brand, and distinguishes SportContact 6 from 7 and ContiPowerContact from PowerContact 2. It does not change catalog records, dimensions, prices, IDs or slugs.

95 of the 1,939 catalog records resolve to an existing model-representative photo. The remaining 1,844 use clearly disclosed generated illustrations, never claimed as exact models or tread designs. Reliable numeric aspect ratios select generic low-profile (923), standard (679), or high-sidewall (242) proportions. Real-photo errors fall back to an illustration; illustration errors fall back to “Foto específica em atualização”, without retry loops.

## Manifest and provenance

- Pirelli P400 Evo: `/pneus/pirelli.webp`; existing asset, label visible. Manufacturer reference https://www.pirelli.com/tyres/es-ar/auto/catalogo/producto/p400-evo
- Prinx HH2: `/pneus/prinx.webp`; existing asset, PRINX and HH2 visible.
- Bridgestone Ecopia EP150: `/pneus/bridgestone.webp`; existing asset, Ecopia EP150 visible. Manufacturer reference https://tires.bridgestone.com.br/pt-br/pneus/automotivos/ecopia/ep150
- Delinte DH2: `/pneus/delinte.webp`; existing asset, DH2 visible.
- Continental ContiPowerContact: `/pneus/continental.webp`; existing asset, ContiPowerContact visible, not a substitute for SportContact or PowerContact 2.
- Comforser CF510: `/pneus/comforser.webp`; existing asset, CF510 visible. Pictured sidewall 195/60R15 is not proof of another advertised size.
- Tornel Astral Neo: `/pneus/tornel.webp`; existing asset, Astral Neo and 175/70R14 84T visible.

Existing-asset original photographer, licensing and acquisition provenance were not independently established. The three generated illustrations are visibly labeled at 14px or larger: “Imagem ilustrativa gerada por IA. Não representa o modelo ou desenho exato. Roda ilustrativa; não acompanha o pneu.” All seven existing model assets were visually inspected. The descriptions establish model-level identity, not exact SKU, OE homologation, XL/run-flat/ContiSilent construction, size, load/speed index, availability or stock. Captions state those representation limits.

## Covered paths

Catalog cards and direct catalog details (including related cards), legacy inner promotional cards/details, institutional offer carousel/Pirelli lists, garage lists, inner cart page/drawer, dormant finder, aro hub illustrations, static generated legacy product image HTML, selected-product social sharing and Product image metadata. A missing image is omitted from Product schema rather than asserting the placeholder is a product photograph.

## Deliberate Home exception

Home main JSX, HeroPromoTires and Home TireCard visuals remain unchanged under the user's explicit Home preservation constraint. TireCard and CartDrawer opt into safe images only in inner contexts; the default/Home branch preserves prior behavior. Consequently this preview correction does NOT certify or correct the Home promotional images. A later Home correction needs separate scope authorization.

## Checks

`node --import tsx scripts/verify-tire-image-safety.tsx` evaluates all 1,939 records, negative brand/model/generation examples, immutable data, inner SSR placeholders, load-failure resolver state and unchanged Home behavior. `npm run lint` passes. `scripts/verify-rim-images.mjs` checks 32 catalog examples with model photographs or disclosed illustrations across 11 generated aro pages. Browser image-load failures and final combined build are separate checks owned by the preview integration reviewer.

## Removed newly sourced asset

SportContact 6 manufacturer image removed from this preview asset tree because commercial-republication permission was not established and the source terms restrict commercial copying. No new research-candidate photographs are published. See https://continentaltire.com/legal . Existing assets retain limited provenance; model identification does not establish licensing rights. Generated asset provenance is recorded in ai-tire-illustration-provenance.json and ai-tire-variants-provenance.json. Generated imagery is excluded from Product image schema and product social photo metadata.

Wheel variants are generic generated artwork, not a wheel-and-tire offer. WebP delivery assets total 200,124 bytes (900px, quality90); original PNGs remain separately preserved. Original and delivery hashes are recorded in ai-tire-wheel-provenance.json.
