import React from 'react';
import { Tire } from '../types';
import { ArrowUpRight, MessageSquare, Eye, Wrench } from 'lucide-react';
import { getBrandFallbackImage } from '../data';
import { formatWhatsApp } from '../utils/whatsapp';

interface TireCardProps {
  key?: string;
  tire: Tire;
  onAddToCart?: (tire: Tire, quantity: number) => void;
  onSelectTire?: (tire: Tire) => void;
}

export default function TireCard({ tire, onSelectTire }: TireCardProps) {
  const whatsappUrl = formatWhatsApp(
    `Olá Carplus! Gostaria de consultar o preço e disponibilidade do Pneu ${tire.brand} ${tire.model} (${tire.width}/${tire.aspectRatio} R${tire.rim}) para instalação no Portão.`
  );

  return (
    <article
      className="carplus-product-card group relative flex h-full flex-col overflow-hidden rounded-[20px] border border-white/15 bg-white text-[#080808] shadow-lg transition-[border-color,box-shadow,transform] duration-300 hover:border-[#f59c00] hover:shadow-[0_20px_45px_rgba(0,0,0,0.2)] motion-safe:hover:-translate-y-1"
      id={`tire-card-${tire.id}`}
    >
      <div className="flex min-h-[64px] shrink-0 items-center justify-between gap-3 border-t-4 border-[#f59c00] bg-[#080808] px-5 py-3">
        <span className="min-w-0 text-[17px] font-black uppercase tracking-[0.06em] text-white">
          {tire.brand}
        </span>
        <span className="shrink-0 rounded-md border border-[#f59c00]/50 bg-[#f59c00]/10 px-2.5 py-1 text-[12px] font-bold uppercase tracking-wide text-[#f59c00]">
          Aro {tire.rim}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5">
        <button
          type="button"
          onClick={() => onSelectTire && onSelectTire(tire)}
          aria-label={`Ver detalhes de ${tire.name}`}
          className="carplus-product-media relative my-3 flex h-[200px] w-full cursor-pointer items-center justify-center rounded-xl bg-white p-4"
        >
          <span aria-hidden="true" className="absolute bottom-3 h-3 w-24 rounded-[50%] bg-black/5 blur-sm" />
          <img
            src={tire.image}
            alt={tire.name}
            loading="lazy"
            decoding="async"
            className="relative h-full max-h-[180px] w-full object-contain transition-transform duration-500 motion-safe:group-hover:scale-[1.04]"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.dataset.triedFallback) {
                target.dataset.triedFallback = 'true';
                target.src = getBrandFallbackImage(tire.brand, tire.id);
              } else {
                target.src = '/images/pneus/pneu-fallback.svg';
              }
            }}
          />
        </button>

        <div className="mb-4 flex items-center justify-between gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-3">
          <div>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-500">Medida do pneu</span>
            <p className="mt-0.5 font-display text-[23px] font-bold leading-tight tracking-tight text-[#080808]">
              {tire.width}/{tire.aspectRatio} <span className="text-zinc-500">R{tire.rim}</span>
            </p>
          </div>
          <span aria-hidden="true" className="h-9 w-1 shrink-0 rounded-full bg-[#f59c00]" />
        </div>

        <h4 className="min-h-[52px] text-[18px] font-bold leading-snug" title={tire.name}>
          <button
            type="button"
            onClick={() => onSelectTire && onSelectTire(tire)}
            className="cursor-pointer text-left transition-colors hover:text-zinc-600"
          >
            {tire.name}
          </button>
        </h4>

        <p className="mt-3 flex items-start gap-2 border-b border-zinc-200 pb-4 text-[12px] leading-relaxed text-zinc-600">
          <Wrench aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#080808]" />
          Montagem e alinhamento na Carplus
        </p>

        <div className="mt-auto pt-4">
          <span className="block text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-500">Preço e disponibilidade</span>
          <p className="mt-0.5 text-[20px] font-bold leading-tight text-[#080808]">Sob consulta</p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cta-location="card-produto"
            className="mt-4 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#f59c00] px-3 py-3 text-[14px] font-bold text-[#080808] transition-colors hover:bg-[#080808] hover:text-[#f59c00]"
            id={`whatsapp-consult-${tire.id}`}
            aria-label={`Consultar ${tire.name} no WhatsApp`}
          >
            <MessageSquare aria-hidden="true" className="h-4 w-4 shrink-0" />
            <span>Consultar no WhatsApp</span>
            <ArrowUpRight aria-hidden="true" className="ml-auto h-4 w-4 shrink-0" />
          </a>

          <button
            type="button"
            onClick={() => onSelectTire && onSelectTire(tire)}
            className="mt-2 flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-3 text-[13px] font-semibold text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-[#080808]"
            aria-label={`Ver pneu e orçamento de ${tire.name}`}
          >
            <Eye aria-hidden="true" className="h-4 w-4 shrink-0" />
            Ver pneu e orçamento
          </button>
        </div>
      </div>
    </article>
  );
}
