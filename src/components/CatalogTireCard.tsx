import React from 'react';
import { CatalogTire } from '../types';
import { MessageSquare, Eye } from 'lucide-react';

interface CatalogTireCardProps {
  key?: React.Key;
  tire: CatalogTire;
  onSelect: (tire: CatalogTire) => void;
}

export default function CatalogTireCard({ tire, onSelect }: CatalogTireCardProps) {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  const displayImage = tire.imagemGrande || tire.imagem || '/images/pneus/pneu-pirelli-p400-evo-600x600.webp';

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = `Olá Carplus! Gostaria de cotar o pneu ${tire.nome} (${tire.medida}) no Portão. Link: https://www.carpluscwb.com.br/pneu/${tire.slug}`;
    const url = `https://api.whatsapp.com/send?phone=554130827282&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <article 
      onClick={() => onSelect(tire)}
      className="bg-white rounded-[12px] shadow-sm hover:shadow-md border border-zinc-200 transition-all duration-200 p-5 flex flex-col justify-between h-full group cursor-pointer"
      id={`catalog-tire-${tire.id}`}
    >
      <div>
        {/* Top badges */}
        <div className="flex items-center justify-between mb-3">
          <span className="bg-zinc-100 text-zinc-800 text-sm font-bold px-2.5 py-1 rounded-md">
            Aro {tire.aro}
          </span>
          <span className="text-xs font-semibold text-zinc-500 uppercase">
            {tire.marca}
          </span>
        </div>

        {/* Tire Image */}
        <div className="relative w-full h-44 bg-zinc-50 rounded-lg overflow-hidden flex items-center justify-center p-2 mb-4">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-zinc-100 animate-pulse flex items-center justify-center">
              <span className="text-xs text-zinc-500 font-medium">Carregando...</span>
            </div>
          )}
          <img
            src={imageError ? '/images/pneus/pneu-pirelli-p-zero.webp' : displayImage}
            alt={`Pneu ${tire.nome} ${tire.medida} Aro ${tire.aro} em Curitiba`}
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Tire Name in 18px font */}
        <h3 className="text-[18px] font-bold text-zinc-900 leading-snug line-clamp-2 min-h-[52px] group-hover:text-[#F5A623] transition" title={tire.nome}>
          {tire.nome}
        </h3>

        {/* Measure */}
        <p className="text-sm text-zinc-600 mt-2 font-medium">
          Medida: {tire.medida}
        </p>

        {/* Price Status in Dark Green */}
        <div className="mt-3 py-1">
          <span className="text-[18px] font-bold text-emerald-800">
            Sob consulta
          </span>
        </div>
      </div>

      {/* Action Buttons with 48px height and normal casing */}
      <div className="mt-4 pt-3 border-t border-zinc-100 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onSelect(tire)}
          className="h-[48px] min-h-[48px] px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold text-sm rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition"
        >
          <Eye className="w-4 h-4 text-zinc-700" />
          <span>Ver detalhes</span>
        </button>

        <button
          type="button"
          onClick={handleWhatsAppClick}
          data-cta-location="card-produto"
          className="h-[48px] min-h-[48px] px-3 bg-[#25D366] hover:bg-emerald-600 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition shadow-sm"
        >
          <MessageSquare className="w-4 h-4 fill-current shrink-0" />
          <span>Cotar</span>
        </button>
      </div>
    </article>
  );
}

