import React from 'react';
import { Tire } from '../types';
import { MessageSquare, Eye, Wrench, Gauge, ShieldCheck } from 'lucide-react';
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
    <div 
      className="bg-white rounded-[14px] shadow-sm hover:shadow-xl hover:-translate-y-1 border-2 border-[#F5A623] hover:border-amber-400 transition-all duration-300 flex flex-col justify-between h-full group relative overflow-hidden"
      id={`tire-card-${tire.id}`}
    >
      {/* Faixa superior com sulco de pneu estilo oficina */}
      <div 
        className="h-2 w-full bg-zinc-900 border-b border-[#F5A623]/60 relative overflow-hidden shrink-0"
        title="Banda de rodagem Carplus"
      >
        <div 
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #F5A623 0, #F5A623 4px, transparent 4px, transparent 10px)'
          }}
        />
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Top badges: Selo de aro estilo etiqueta de oficina + Marca */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 bg-zinc-900 text-[#F5A623] text-xs font-black px-2.5 py-1 rounded-md tracking-wider border border-zinc-800 uppercase shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623]" />
              ARO {tire.rim}
            </span>
            <span className="text-xs font-black text-zinc-600 tracking-wider uppercase font-mono">
              {tire.brand}
            </span>
          </div>

          {/* Tire Image: Hover com pneu girando suavemente */}
          <div 
            onClick={() => onSelectTire && onSelectTire(tire)}
            className="relative py-4 bg-white rounded-xl flex items-center justify-center min-h-[180px] cursor-pointer mb-4"
          >
            <img 
              src={tire.image} 
              alt={tire.name} 
              className="max-h-40 object-contain w-auto transform transition-transform duration-500 group-hover:rotate-6 group-hover:scale-105"
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
          </div>

          {/* Tire Name in 18px font */}
          <h4 
            onClick={() => onSelectTire && onSelectTire(tire)}
            className="text-[18px] font-bold text-zinc-900 leading-snug line-clamp-2 min-h-[52px] cursor-pointer hover:text-[#F5A623] transition" 
            title={tire.name}
          >
            {tire.name}
          </h4>

          {/* Specs */}
          <p className="text-sm text-zinc-600 mt-1.5 font-medium">
            Medida: <strong className="text-zinc-900 font-bold">{tire.width}/{tire.aspectRatio} R{tire.rim}</strong>
          </p>

          {/* Ícones de serviços de oficina (Montagem, Balanceamento, Alinhamento) */}
          <div className="mt-3 py-2 px-2.5 bg-zinc-50 rounded-lg border border-zinc-100 flex items-center justify-between text-[11px] text-zinc-600">
            <span className="inline-flex items-center gap-1 font-semibold" title="Montagem anti-risco na loja">
              <Wrench className="w-3.5 h-3.5 text-[#F5A623] shrink-0" />
              Montagem
            </span>
            <span className="text-zinc-300">·</span>
            <span className="inline-flex items-center gap-1 font-semibold" title="Balanceamento computadorizado">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              Garantia 5A
            </span>
            <span className="text-zinc-300">·</span>
            <span className="inline-flex items-center gap-1 font-semibold" title="Alinhamento 3D a laser no Portão">
              <Gauge className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              Alinhamento 3D
            </span>
          </div>

          {/* Price status in dark green readable font */}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[18px] font-bold text-emerald-800">
              Sob consulta
            </span>
            <span className="text-xs text-zinc-500 font-medium">
              Pronta entrega
            </span>
          </div>
        </div>

        {/* Action Buttons with 48px height and normal casing */}
        <div className="mt-4 pt-3 border-t border-zinc-100 grid grid-cols-2 gap-2">
          <button
            onClick={() => onSelectTire && onSelectTire(tire)}
            className="h-[48px] min-h-[48px] px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold text-sm rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-98"
          >
            <Eye className="w-4 h-4 text-zinc-700 shrink-0" />
            <span>Ver detalhes</span>
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cta-location="card-produto"
            className="h-[48px] min-h-[48px] px-3 bg-[#25D366] hover:bg-emerald-600 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition shadow-xs active:scale-98"
            id={`whatsapp-consult-${tire.id}`}
          >
            <MessageSquare className="w-4 h-4 fill-current shrink-0" />
            <span>Cotar</span>
          </a>
        </div>
      </div>
    </div>
  );
}

