import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface BrandComparisonStripProps {
  onSelectBrand: (brand: string) => void;
}

// Manufacturer artwork, served locally. Six PNGs reuse the LP's official assets.
// XBRI: https://xbri.com.br/ -> https://cdn.pneufree.com.br/WhiteLabel/Images/XBRI/Icons/StoreLogo.svg
// Linglong: https://www.linglongtire.com/en/ -> /uploads/3484fafd6f5162fd9746c6fd86fcca2c.png
const BRANDS = [
  { name: 'Michelin', file: 'michelin.png', width: 1000, height: 196 },
  { name: 'Continental', file: 'continental.png', width: 1000, height: 182 },
  { name: 'XBRI', file: 'xbri.png', width: 1000, height: 185 },
  { name: 'Bridgestone', file: 'bridgestone.png', width: 1000, height: 243 },
  { name: 'Pirelli', file: 'pirelli.png', width: 1000, height: 219 },
  { name: 'Goodyear', file: 'goodyear.png', width: 1208, height: 212 },
  { name: 'Linglong', file: 'linglong.png', width: 154, height: 60 },
  { name: 'Firestone', file: 'firestone.png', width: 1206, height: 189 },
];

export default function BrandComparisonStrip({ onSelectBrand }: BrandComparisonStripProps) {
  const handleSelect = (event: React.MouseEvent<HTMLAnchorElement>, brand: string) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onSelectBrand(brand);
  };

  return (
    <section id="brands-conveyor-belt-container" className="carplus-brand-comparison mt-8 rounded-2xl border border-white/15 bg-[#111111] p-4 sm:p-6" aria-labelledby="brand-comparison-heading">
      <div className="mb-5">
        <h3 id="brand-comparison-heading" className="text-[13px] font-bold uppercase leading-relaxed tracking-[0.1em] text-white">Escolha uma marca de pneus.</h3>
        <p className="mt-2 text-[14px] leading-relaxed text-zinc-400">Selecione a marca para ver os modelos no catálogo.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {BRANDS.map(brand => (
          <a
            key={brand.name}
            href={`/pneus/marca/${encodeURIComponent(brand.name.toLowerCase())}`}
            onClick={event => handleSelect(event, brand.name)}
            aria-label={`Ver pneus ${brand.name} no catálogo`}
            data-cta-location="comparacao-marcas"
            className="carplus-white-surface group flex min-h-[124px] flex-col justify-between gap-4 rounded-xl border-2 border-white bg-white p-4 text-[#080808] transition-colors hover:border-[#f59c00] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f59c00] sm:min-h-[136px] sm:px-5"
          >
            <span className="flex h-[52px] w-full items-center justify-center">
              <img
                src={`/images/brands/${brand.file}`}
                width={brand.width}
                height={brand.height}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className="h-[50px] w-full max-w-[190px] object-contain"
                style={{ filter: 'none', mixBlendMode: 'normal', opacity: 1 }}
              />
            </span>
            <span className="flex items-center justify-between gap-2 border-t border-zinc-200 pt-3 text-[13px] font-bold leading-snug text-[#080808]">
              <span>{brand.name}</span>
              <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0 text-[#080808]" />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
