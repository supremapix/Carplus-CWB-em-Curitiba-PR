import React, { useState } from 'react';
import { PROMO_TIRES, PromoTire } from '../data/promoTires';
import { getBrandFallbackImage } from '../data';
import { MessageSquare, ArrowRight, Eye, MapPin } from 'lucide-react';

interface HeroPromoTiresProps {
  onSelectTire: (slug: string) => void;
  onAddToCart?: (tire: PromoTire) => void;
  onScrollToFinder?: () => void;
}

export const HeroPromoTires: React.FC<HeroPromoTiresProps> = ({ onSelectTire }) => {
  const [filterBrand, setFilterBrand] = useState<string>('TODAS');
  
  const displayedTires = PROMO_TIRES.filter((t) => {
    if (filterBrand === 'TODAS') return true;
    return t.marca.toUpperCase() === filterBrand.toUpperCase();
  }).slice(0, 6);

  const brandsList = Array.from(new Set(PROMO_TIRES.map((t) => t.marca))).sort();

  const handleWhatsAppQuote = (tire: PromoTire) => {
    const message = encodeURIComponent(
      `Olá Carplus! Gostaria de consultar o pneu ${tire.marca} ${tire.medida} ${tire.modelo} na loja do Portão em Curitiba.`
    );
    window.open(`https://wa.me/554130827282?text=${message}`, '_blank');
  };

  const handleScrollToTires = () => {
    const catalogEl = document.getElementById('catalog') || document.getElementById('catalogo-pneus');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="hero-banner" 
      className="w-full bg-black text-white py-10 sm:py-16 px-4 sm:px-6 md:px-8 rounded-2xl border border-zinc-800 shadow-xl relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Location Subtitle Kicker */}
        <div className="flex items-center gap-2 text-zinc-300 text-sm font-medium">
          <MapPin className="w-4 h-4 text-[#F5A623] shrink-0" />
          <span>Av. Pres. Arthur Bernardes, 1323 - Portão, Curitiba</span>
        </div>

        {/* Short Heading & Support Sentence (Requirement 5) */}
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
            Pneus Novos em Curitiba com Pronta Entrega
          </h1>

          <p className="text-zinc-300 text-[18px] sm:text-[20px] font-normal leading-relaxed">
            Encontre a medida perfeita para seu carro com garantia de 5 anos, montagem técnica e alinhamento 3D no Portão.
          </p>
        </div>

        {/* MAX 2 Hero Action Buttons (Requirement 5: Ver pneus / Falar no WhatsApp) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
          <button
            onClick={handleScrollToTires}
            data-cta-location="hero"
            className="h-[56px] min-h-[56px] px-8 bg-[#F5A623] hover:bg-amber-400 text-zinc-950 font-extrabold text-[18px] rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
          >
            <span>Ver pneus</span>
            <ArrowRight className="w-5 h-5 shrink-0" />
          </button>

          <a
            href="https://api.whatsapp.com/send?phone=554130827282&text=Ol%C3%A1%20Carplus!%20Gostaria%20de%20consultar%20pneus%20e%20servi%C3%A7os."
            target="_blank"
            rel="noopener noreferrer"
            data-cta-location="hero"
            className="h-[56px] min-h-[56px] px-8 bg-[#25D366] hover:bg-emerald-500 text-white font-extrabold text-[18px] rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
          >
            <MessageSquare className="w-5 h-5 fill-current shrink-0" />
            <span>Falar no WhatsApp</span>
          </a>
        </div>

        {/* Featured Products Grid (Max 6 featured promo tires) */}
        <div className="pt-8 border-t border-zinc-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-white">Destaques em Estoque no Portão</h2>
            
            {/* Simple brand chips */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterBrand('TODAS')}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
                  filterBrand === 'TODAS'
                    ? 'bg-[#F5A623] text-zinc-950 font-bold'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                Todas
              </button>
              {brandsList.slice(0, 5).map((brand) => (
                <button
                  key={brand}
                  onClick={() => setFilterBrand(brand)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
                    filterBrand === brand
                      ? 'bg-[#F5A623] text-zinc-950 font-bold'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedTires.map((tire) => (
              <div
                key={tire.id}
                className="bg-white text-zinc-900 rounded-[14px] p-5 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-[#F5A623] hover:border-amber-400"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-zinc-900 text-[#F5A623] text-xs font-black px-2.5 py-1 rounded-md tracking-wider border border-zinc-800 uppercase">
                      Aro {tire.aro}
                    </span>
                    <span className="text-xs font-black text-zinc-600 uppercase font-mono tracking-wider">
                      {tire.marca}
                    </span>
                  </div>

                  <div 
                    onClick={() => onSelectTire(tire.slug)}
                    className="relative w-full h-36 bg-white rounded-lg flex items-center justify-center p-2 mb-3 cursor-pointer"
                  >
                    <img
                      src={tire.imagem300 || tire.imagem600 || '/pneus/jk-tyre-300.webp'}
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        if (!target.dataset.triedFallback1) {
                          target.dataset.triedFallback1 = 'true';
                          target.src = getBrandFallbackImage(tire.marca, String(tire.id));
                        } else {
                          target.src = '/images/pneus/pneu-fallback.svg';
                        }
                      }}
                      alt={`Pneu ${tire.marca} ${tire.medida} ${tire.modelo}`}
                      className="max-h-32 object-contain"
                    />
                  </div>

                  <h3
                    onClick={() => onSelectTire(tire.slug)}
                    className="text-[18px] font-bold text-zinc-900 leading-snug line-clamp-1 cursor-pointer hover:text-[#F5A623] transition"
                  >
                    {tire.marca} {tire.medida}
                  </h3>
                  <p className="text-sm text-zinc-600 mt-1 font-medium">{tire.modelo}</p>

                  <div className="mt-3">
                    <span className="text-[18px] font-bold text-emerald-800">
                      Sob consulta
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-zinc-100">
                  <button
                    onClick={() => onSelectTire(tire.slug)}
                    className="h-[48px] min-h-[48px] px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold text-sm rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition"
                  >
                    <Eye className="w-4 h-4 text-zinc-700" />
                    <span>Ver detalhes</span>
                  </button>

                  <button
                    onClick={() => handleWhatsAppQuote(tire)}
                    data-cta-location="hero"
                    className="h-[48px] min-h-[48px] px-3 bg-[#25D366] hover:bg-emerald-600 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4 fill-current shrink-0" />
                    <span>Cotar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};



