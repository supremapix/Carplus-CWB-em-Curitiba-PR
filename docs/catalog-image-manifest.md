# Catalog image correction (preview only)

Reviewed 2026-11-03. Resolver: `src/lib/tireImageManifest.ts`. Rendering: `VerifiedTireImage`.

The resolver allows eight explicitly identified models, never a brand-wide image. It reads the actual product title first, requires matching brand, and distinguishes SportContact 6 from 7 and ContiPowerContact from PowerContact 2. It does not change catalog records, dimensions, prices, IDs or slugs.

134 of the 1,939 catalog records currently resolve to a model-representative photo. The remaining 1,805 show “Foto específica em atualização”. This is a truthfulness correction, not a claim that all product photographs have been obtained. On image-load error the same neutral state replaces the image; no brand fallback is tried.

## Manifest and provenance

- Pirelli P400 Evo: `/pneus/pirelli.webp`; existing asset, label visible. Manufacturer reference https://www.pirelli.com/tyres/es-ar/auto/catalogo/producto/p400-evo
- Prinx HH2: `/pneus/prinx.webp`; existing asset, PRINX and HH2 visible.
- Bridgestone Ecopia EP150: `/pneus/bridgestone.webp`; existing asset, Ecopia EP150 visible. Manufacturer reference https://tires.bridgestone.com.br/pt-br/pneus/automotivos/ecopia/ep150
- Delinte DH2: `/pneus/delinte.webp`; existing asset, DH2 visible.
- Continental ContiPowerContact: `/pneus/continental.webp`; existing asset, ContiPowerContact visible, not a substitute for SportContact or PowerContact 2.
- Comforser CF510: `/pneus/comforser.webp`; existing asset, CF510 visible. Pictured sidewall 195/60R15 is not proof of another advertised size.
- Tornel Astral Neo: `/pneus/tornel.webp`; existing asset, Astral Neo and 175/70R14 84T visible.
- Continental SportContact 6: `/pneus/modelos/sportcontact-6.png`; manufacturer product https://continentaltire.com/tires/sportcontact-6 ; original image https://continentaltire.com/sites/default/files/styles/modal/public/media/image/2024-12/ct_webpage_sportcontact6_l3qt_600x600_oe.png?itok=l_hDLHlN

Existing-asset original photographer, licensing and acquisition provenance were not independently established. No generated or approximate substitute model images were added. All eight allowed assets were visually inspected. The descriptions establish model-level identity, not exact SKU, OE homologation, XL/run-flat/ContiSilent construction, size, load/speed index, availability or stock. Captions state those representation limits.

## Covered paths

Catalog cards and direct catalog details (including related cards), legacy inner promotional cards/details, institutional offer carousel/Pirelli lists, garage lists, inner cart page/drawer, dormant finder, aro hub illustrations, static generated legacy product image HTML, selected-product social sharing and Product image metadata. A missing image is omitted from Product schema rather than asserting the placeholder is a product photograph.

## Deliberate Home exception

Home main JSX, HeroPromoTires and Home TireCard visuals remain unchanged under the user's explicit Home preservation constraint. TireCard and CartDrawer opt into safe images only in inner contexts; the default/Home branch preserves prior behavior. Consequently this preview correction does NOT certify or correct the Home promotional images. A later Home correction needs separate scope authorization.

## Checks

`node --import tsx scripts/verify-tire-image-safety.tsx` evaluates all 1,939 records, negative brand/model/generation examples, immutable data, inner SSR placeholders, load-failure resolver state and unchanged Home behavior. `npm run lint` passes. `scripts/verify-rim-images.mjs` checks 32 model photos across 11 generated aro pages. Browser image-load failures and final combined build are separate checks owned by the preview integration reviewer.
