import React from 'react';
import { Tire } from '../types';
import { MessageSquare, Eye } from 'lucide-react';
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
      className="bg-white rounded-[12px] shadow-sm hover:shadow-md border border-zinc-200 transition-all duration-200 p-5 flex flex-col justify-between h-full group"
      id={`tire-card-${tire.id}`}
    >
      <div>
        {/* Top badges */}
        <div className="flex items-center justify-between mb-3">
          <span className="bg-zinc-100 text-zinc-800 text-sm font-bold px-2.5 py-1 rounded-md">
            Aro {tire.rim}
          </span>
          <span className="text-xs font-semibold text-zinc-500 uppercase">
            {tire.brand}
          </span>
        </div>

        {/* Tire Image */}
        <div 
          onClick={() => onSelectTire && onSelectTire(tire)}
          className="relative py-4 bg-zinc-50 rounded-lg flex items-center justify-center min-h-[180px] cursor-pointer mb-4"
        >
          <img 
            src={tire.image} 
            alt={tire.name} 
            className="max-h-40 object-contain w-auto transform transition duration-300 group-hover:scale-105"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = getBrandFallbackImage(tire.brand, tire.id);
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
        <p className="text-sm text-zinc-600 mt-2 font-medium">
          Medida: {tire.width}/{tire.aspectRatio} R{tire.rim}
        </p>

        {/* Price status in dark green readable font */}
        <div className="mt-3 py-1">
          <span className="text-[18px] font-bold text-emerald-800">
            Sob consulta
          </span>
        </div>
      </div>

      {/* Action Buttons with 48px height and normal casing */}
      <div className="mt-4 pt-3 border-t border-zinc-100 grid grid-cols-2 gap-2">
        <button
          onClick={() => onSelectTire && onSelectTire(tire)}
          className="h-[48px] min-h-[48px] px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold text-sm rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition"
        >
          <Eye className="w-4 h-4 text-zinc-700" />
          <span>Ver detalhes</span>
        </button>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-cta-location="card-produto"
          className="h-[48px] min-h-[48px] px-3 bg-[#25D366] hover:bg-emerald-600 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition shadow-sm"
          id={`whatsapp-consult-${tire.id}`}
        >
          <MessageSquare className="w-4 h-4 fill-current shrink-0" />
          <span>Cotar</span>
        </a>
      </div>
    </div>
  );
}

