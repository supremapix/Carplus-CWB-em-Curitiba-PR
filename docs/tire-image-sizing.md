# Tire image sizing

Product image frames now use their available width, a square frame and object-fit: contain. Card padding is reduced; detail columns split equally and reserve space for badges and disclosures. Row thumbnails are enlarged, with stacked layouts on small screens for the garage and Pirelli recommendations. Sharing previews use contain. The shared component also covers brand, vehicle, rim and budget pages. Workshop/editorial photography and logos are unchanged.

No image sources, catalog entries, prices, routes, metadata, fallback logic or disclosure wording changed. Footer from c85200d is preserved.

Validation: npm run lint; npm run build (2557 static pages); node --import tsx scripts/verify-tire-illustrations.tsx (1939 records); node scripts/verify-enlarged-tires.cjs (home, catalog, individual product, rim and garage at 360/390/1440px). The browser script checks image loading, contain sizing, captions, page overflow and JavaScript errors, and writes screenshots outside the repository. Set TEST_BASE_URL to test production.
