import React from 'react';
import { CatalogTire } from '../types';
import { ArrowUpRight, MessageSquare, Eye, Wrench } from 'lucide-react';
import { getBrandFallbackImage } from '../data';

interface CatalogTireCardProps {
  key?: React.Key;
  tire: CatalogTire;
  onSelect: (tire: CatalogTire) => void;
}

export default function CatalogTireCard({ tire, onSelect }: CatalogTireCardProps) {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [fallbackStep, setFallbackStep] = React.useState(0);

  const primaryImage = tire.imagemGrande || tire.imagem || getBrandFallbackImage(tire.marca);

  const getImageSource = () => {
    if (fallbackStep === 0) return primaryImage;
    if (fallbackStep === 1) return getBrandFallbackImage(tire.marca);
    return '/images/pneus/pneu-fallback.svg';
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = `Olá Carplus! Gostaria de cotar o pneu ${tire.nome} (${tire.medida}) no Portão. Link: https://www.carpluspneuseoficina.com.br/pneu/${tire.slug}`;
    const url = `https://api.whatsapp.com/send?phone=554130827282&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <article
      onClick={() => onSelect(tire)}
      className="carplus-product-card group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[20px] border border-white/15 bg-white text-[#080808] shadow-lg transition-[border-color,box-shadow,transform] duration-300 hover:border-[#f59c00] hover:shadow-[0_20px_45px_rgba(0,0,0,0.2)] motion-safe:hover:-translate-y-1"
      id={`catalog-tire-${tire.id}`}
    >
      <div className="flex min-h-[64px] shrink-0 items-center justify-between gap-3 border-t-4 border-[#f59c00] bg-[#080808] px-5 py-3">
        <span className="min-w-0 text-[17px] font-black uppercase tracking-[0.06em] text-white">
          {tire.marca}
        </span>
        <span className="shrink-0 rounded-md border border-[#f59c00]/50 bg-[#f59c00]/10 px-2.5 py-1 text-[12px] font-bold uppercase tracking-wide text-[#f59c00]">
          Aro {tire.aro}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5">
        <div className="carplus-product-media relative my-3 flex h-[200px] w-full items-center justify-center rounded-xl bg-white p-4">
          <span aria-hidden="true" className="absolute bottom-3 h-3 w-24 rounded-[50%] bg-black/5 blur-sm" />
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-white motion-safe:animate-pulse">
              <span className="text-[12px] font-medium text-zinc-500">Carregando imagem...</span>
            </div>
          )}
          <img
            src={getImageSource()}
            alt={`Pneu ${tire.nome} ${tire.medida} Aro ${tire.aro} em Curitiba`}
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setFallbackStep((prev) => Math.min(prev + 1, 2));
              setImageLoaded(true);
            }}
            className="relative h-full max-h-[180px] w-full object-contain transition-transform duration-500 motion-safe:group-hover:scale-[1.04]"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="mb-4 flex items-center justify-between gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-3">
          <div>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-500">Medida do pneu</span>
            <p className="mt-0.5 font-display text-[23px] font-bold leading-tight tracking-tight text-[#080808]">{tire.medida}</p>
          </div>
          <span aria-hidden="true" className="h-9 w-1 shrink-0 rounded-full bg-[#f59c00]" />
        </div>

        <h3 className="min-h-[52px] text-[18px] font-bold leading-snug" title={tire.nome}>
          {tire.nome}
        </h3>

        <p className="mt-3 flex items-start gap-2 border-b border-zinc-200 pb-4 text-[12px] leading-relaxed text-zinc-600">
          <Wrench aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#080808]" />
          Montagem e alinhamento na Carplus
        </p>

        <div className="mt-auto pt-4">
          <span className="block text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-500">Preço e disponibilidade</span>
          <p className="mt-0.5 text-[20px] font-bold leading-tight text-[#080808]">Sob consulta</p>

          <button
            type="button"
            onClick={handleWhatsAppClick}
            data-cta-location="card-produto"
            className="mt-4 flex min-h-[52px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#f59c00] px-3 py-3 text-[14px] font-bold text-[#080808] transition-colors hover:bg-[#080808] hover:text-[#f59c00]"
            aria-label={`Consultar ${tire.nome} no WhatsApp`}
          >
            <MessageSquare aria-hidden="true" className="h-4 w-4 shrink-0" />
            <span>Consultar no WhatsApp</span>
            <ArrowUpRight aria-hidden="true" className="ml-auto h-4 w-4 shrink-0" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(tire);
            }}
            className="mt-2 flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-3 text-[13px] font-semibold text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-[#080808]"
            aria-label={`Ver pneu e orçamento de ${tire.nome}`}
          >
            <Eye aria-hidden="true" className="h-4 w-4 shrink-0" />
            Ver pneu e orçamento
          </button>
        </div>
      </div>
    </article>
  );
}
