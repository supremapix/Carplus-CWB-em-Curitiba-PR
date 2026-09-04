import React, { useState } from 'react';
import { PROMO_TIRES, PromoTire } from '../data/promoTires';
import { Tag, ShieldCheck, ArrowRight, ShoppingCart, Sparkles, CheckCircle2, ChevronRight, Eye } from 'lucide-react';

interface HeroPromoTiresProps {
  onSelectTire: (slug: string) => void;
  onAddToCart?: (tire: PromoTire) => void;
}

export const HeroPromoTires: React.FC<HeroPromoTiresProps> = ({ onSelectTire, onAddToCart }) => {
  const [showAll20, setShowAll20] = useState(false);
  const heroTires = PROMO_TIRES.filter((t) => t.isHero); // First 8
  const displayedTires = showAll20 ? PROMO_TIRES : heroTires;

  const handleWhatsAppQuote = (tire: PromoTire) => {
    const message = encodeURIComponent(
      `Olá Carplus! Vi a promoção do pneu *${tire.marca} ${tire.medida} ${tire.modelo}* por *R$ ${tire.precoPromocional},00* e gostaria de agendar a montagem grátis na loja do Portão em Curitiba.`
    );
    window.open(`https://wa.me/554130827282?text=${message}`, '_blank');
  };

  return (
    <section className="w-full bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white py-10 px-4 sm:px-6 rounded-3xl my-8 border border-amber-500/30 shadow-2xl relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#f49e1a]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#f49e1a]/20 border border-[#f49e1a]/50 text-[#f49e1a] px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>OFERTAS IMPERDÍVEIS • ESTOQUE DE CURITIBA</span>
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
              Promoção de Pneus em <span className="text-[#f49e1a]">Destaque na Hero</span>
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-2xl font-medium">
              Aproveite os melhores preços de Curitiba com <strong className="text-white">montagem grátis</strong>, <strong className="text-white">bicos novos inclusos</strong> e alinhamento 3D promocional no Portão.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAll20(!showAll20)}
              className="bg-amber-500 hover:bg-amber-400 text-black font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <span>{showAll20 ? 'Exibir Apenas os 8 da Home' : 'Ver Todos os 20 Pneus em Promoção'}</span>
              <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${showAll20 ? 'rotate-90' : ''}`} />
            </button>
          </div>
        </div>

        {/* Promo Grid (8 on home by default, or all 20 when expanded) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayedTires.map((tire, idx) => {
            const discount = Math.round(((tire.precoOriginal - tire.precoPromocional) / tire.precoOriginal) * 100);
            return (
              <div
                key={tire.id}
                className="bg-gray-900/90 border border-gray-800 hover:border-[#f49e1a] rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-[#f49e1a]/10 group relative overflow-hidden"
              >
                {/* Badge Discount */}
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                  <span className="bg-[#f49e1a] text-black font-black text-[10px] uppercase px-2 py-0.5 rounded-md shadow">
                    -{discount}% OFF
                  </span>
                  {tire.isHero && (
                    <span className="bg-red-600 text-white font-black text-[9px] uppercase px-2 py-0.5 rounded-md">
                      HERO ★
                    </span>
                  )}
                </div>

                {/* Tire Image Container with local picture & webp fallback */}
                <div
                  onClick={() => onSelectTire(tire.slug)}
                  className="relative w-full h-44 bg-gray-950/60 rounded-xl overflow-hidden flex items-center justify-center p-3 cursor-pointer group-hover:scale-105 transition-transform duration-300 border border-gray-800/80 mb-3"
                >
                  <img
                    src={tire.imagem300}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = tire.fallback300;
                    }}
                    alt={`Pneu ${tire.marca} ${tire.medida} ${tire.modelo} em Curitiba`}
                    loading="lazy"
                    className="max-h-36 object-contain drop-shadow-xl"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                    <span className="bg-[#f49e1a] text-black text-xs font-black px-3 py-1.5 rounded-lg flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      Ver Página
                    </span>
                  </div>
                </div>

                {/* Info Block */}
                <div className="space-y-2 flex-grow">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-black uppercase text-[#f49e1a]">
                      {tire.marca}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono bg-gray-800 px-2 py-0.5 rounded">
                      Aro {tire.aro}
                    </span>
                  </div>

                  <h4
                    onClick={() => onSelectTire(tire.slug)}
                    className="text-sm font-black text-white group-hover:text-[#f49e1a] transition cursor-pointer leading-tight line-clamp-1"
                  >
                    {tire.marca} {tire.medida}
                  </h4>
                  <p className="text-xs text-gray-400 font-medium line-clamp-1">{tire.modelo}</p>

                  <div className="text-[10px] text-gray-400 flex items-center gap-1 pt-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="line-clamp-1">Montagem grátis no Portão</span>
                  </div>

                  {/* Price */}
                  <div className="bg-gray-950/80 p-2.5 rounded-xl border border-gray-800/80 mt-2">
                    <div className="text-[10px] text-gray-500 line-through">
                      De R$ {tire.precoOriginal},00
                    </div>
                    <div className="flex items-baseline justify-between">
                      <div className="text-lg font-black text-[#f49e1a]">
                        R$ {tire.precoPromocional}
                        <span className="text-[10px] text-gray-400 font-normal ml-1">à vista</span>
                      </div>
                      <span className="text-[9px] text-emerald-400 font-bold">10x S/ Juros</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-2 border-t border-gray-800">
                  <button
                    onClick={() => onSelectTire(tire.slug)}
                    className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-2 rounded-xl text-xs transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    <span>Detalhes</span>
                  </button>

                  <button
                    onClick={() => handleWhatsAppQuote(tire)}
                    className="w-full bg-[#25D366] hover:bg-emerald-600 text-black font-black py-2 px-2 rounded-xl text-xs transition flex items-center justify-center gap-1 cursor-pointer shadow"
                  >
                    <span>Garanta Já</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Guarantee Banner */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#f49e1a]" />
            </div>
            <div>
              <strong className="text-white block font-black uppercase text-xs">
                Garantia Oficial & Menor Preço de Curitiba
              </strong>
              <span>Preço baixo de verdade com nota fiscal, garantia oficial de fábrica e atendimento técnico presencial.</span>
            </div>
          </div>

          <button
            onClick={() => setShowAll20(!showAll20)}
            className="whitespace-nowrap font-black text-xs text-[#f49e1a] hover:underline flex items-center gap-1 cursor-pointer"
          >
            {showAll20 ? 'Ver menos' : 'Exibir tabela completa de 20 promoções'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
