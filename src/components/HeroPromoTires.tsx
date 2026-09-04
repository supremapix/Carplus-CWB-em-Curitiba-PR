import React, { useState } from 'react';
import { PROMO_TIRES, PromoTire } from '../data/promoTires';
import { ShieldCheck, ArrowRight, Sparkles, CheckCircle2, Eye, Phone, MapPin, Search, Filter } from 'lucide-react';

interface HeroPromoTiresProps {
  onSelectTire: (slug: string) => void;
  onAddToCart?: (tire: PromoTire) => void;
  onScrollToFinder?: () => void;
}

export const HeroPromoTires: React.FC<HeroPromoTiresProps> = ({ onSelectTire, onAddToCart, onScrollToFinder }) => {
  const [filterBrand, setFilterBrand] = useState<string>('TODAS');
  
  const displayedTires = PROMO_TIRES.filter((t) => {
    if (filterBrand === 'TODAS') return true;
    return t.marca.toUpperCase() === filterBrand.toUpperCase();
  });

  const brandsList = Array.from(new Set(PROMO_TIRES.map((t) => t.marca))).sort();

  const handleWhatsAppQuote = (tire: PromoTire) => {
    const message = encodeURIComponent(
      `Olá Carplus! Vi a promoção do pneu *${tire.marca} ${tire.medida} ${tire.modelo}* por *R$ ${tire.precoPromocional},00* e gostaria de agendar a montagem grátis na loja do Portão em Curitiba.`
    );
    window.open(`https://wa.me/554130827282?text=${message}`, '_blank');
  };

  return (
    <section 
      id="hero-banner" 
      className="w-full bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white py-8 sm:py-12 px-4 sm:px-6 md:px-8 rounded-3xl border border-amber-500/30 shadow-2xl relative overflow-hidden"
    >
      {/* Background glow accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#f49e1a]/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-6">
        
        {/* Hero Top Bar - Location Trust */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800/80 pb-4">
          <div className="inline-flex items-center gap-2 bg-neutral-900/90 text-white font-mono text-[11px] uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-neutral-700 shadow">
            <span className="w-2 h-2 rounded-full bg-[#f49e1a] animate-pulse"></span>
            <MapPin className="w-3.5 h-3.5 text-[#f49e1a]" />
            <span>Centro Automotivo Autorizado • Av. Arthur Bernardes, 1323 - Portão, Curitiba</span>
          </div>

          <div className="flex items-center gap-3 text-xs font-bold text-gray-300">
            <a 
              href="tel:4130827282" 
              className="inline-flex items-center gap-1.5 text-[#f49e1a] hover:text-amber-400 transition"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>(41) 3082-7282</span>
            </a>
            <span className="text-gray-600">•</span>
            <span className="text-emerald-400 font-mono font-bold">Loja Aberta Hoje</span>
          </div>
        </div>

        {/* Hero Main Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#f49e1a]/20 border border-[#f49e1a]/50 text-[#f49e1a] px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#f49e1a]" />
              <span>OFERTAS IMPERDÍVEIS • ESTOQUE DE CURITIBA</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-[1.08] select-none">
              Promoção de Pneus em <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f49e1a] via-amber-400 to-yellow-500">Destaque na Hero</span>
            </h1>

            <p className="text-gray-300 text-sm sm:text-base md:text-lg font-medium leading-relaxed">
              Aproveite os melhores preços de Curitiba com <strong className="text-white font-black">montagem grátis</strong>, <strong className="text-white font-black">bicos novos inclusos</strong> e alinhamento 3D promocional no Portão.
            </p>
          </div>

          {/* Controls & Quick Action Button */}
          {onScrollToFinder && (
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={onScrollToFinder}
                className="bg-gray-800 hover:bg-gray-700 text-white font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-wider transition flex items-center gap-2 border border-gray-700 cursor-pointer shadow-md"
              >
                <Search className="w-4 h-4 text-[#f49e1a]" />
                <span>Buscar por Carro</span>
              </button>
            </div>
          )}
        </div>

        {/* Brand Filter Bar for the 20 Promo Tires */}
        <div className="bg-gray-900/90 border border-amber-500/30 p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#f49e1a] uppercase">
            <Filter className="w-4 h-4" />
            <span>20 PNEUS EM PROMOÇÃO ({displayedTires.length} EXIBIDOS)</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setFilterBrand('TODAS')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                filterBrand === 'TODAS'
                  ? 'bg-[#f49e1a] text-black font-black shadow'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Todas as Marcas (20)
            </button>
            {brandsList.map((brand) => (
              <button
                key={brand}
                onClick={() => setFilterBrand(brand)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  filterBrand === brand
                    ? 'bg-[#f49e1a] text-black font-black shadow'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Promo Grid - Displays all 20 tires directly in the Hero */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayedTires.map((tire) => {
            const discount = Math.round(((tire.precoOriginal - tire.precoPromocional) / tire.precoOriginal) * 100);
            return (
              <div
                key={tire.id}
                className="bg-gray-900/95 border border-gray-800 hover:border-[#f49e1a] rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-[#f49e1a]/15 group relative overflow-hidden"
              >
                {/* Badge Discount */}
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                  <span className="bg-[#f49e1a] text-black font-black text-[10px] uppercase px-2 py-0.5 rounded-md shadow">
                    -{discount}% OFF
                  </span>
                  {tire.isHero && (
                    <span className="bg-red-600 text-white font-black text-[9px] uppercase px-2 py-0.5 rounded-md shadow">
                      HERO ★
                    </span>
                  )}
                </div>

                {/* Tire Image Container with local picture & webp fallback */}
                <div
                  onClick={() => onSelectTire(tire.slug)}
                  className="relative w-full h-44 bg-gray-950/80 rounded-xl overflow-hidden flex items-center justify-center p-3 cursor-pointer group-hover:scale-105 transition-transform duration-300 border border-gray-800 mb-3"
                >
                  <img
                    src={tire.imagem300}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = tire.fallback300;
                    }}
                    alt={`Pneu ${tire.marca} ${tire.medida} ${tire.modelo} em Curitiba`}
                    loading="lazy"
                    className="max-h-36 object-contain drop-shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                    <span className="bg-[#f49e1a] text-black text-xs font-black px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg">
                      <Eye className="w-3.5 h-3.5" />
                      Ver Ficha do Pneu
                    </span>
                  </div>
                </div>

                {/* Info Block */}
                <div className="space-y-2 flex-grow">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-black uppercase text-[#f49e1a]">
                      {tire.marca}
                    </span>
                    <span className="text-[10px] text-gray-300 font-mono font-bold bg-gray-800 px-2 py-0.5 rounded">
                      Aro {tire.aro}
                    </span>
                  </div>

                  <h3
                    onClick={() => onSelectTire(tire.slug)}
                    className="text-sm font-black text-white group-hover:text-[#f49e1a] transition cursor-pointer leading-tight line-clamp-1"
                  >
                    {tire.marca} {tire.medida}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium line-clamp-1">{tire.modelo}</p>

                  <div className="text-[10px] text-gray-300 flex items-center gap-1 pt-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="line-clamp-1">Montagem grátis + bico novo</span>
                  </div>

                  {/* Price Box */}
                  <div className="bg-gray-950/90 p-2.5 rounded-xl border border-gray-800/80 mt-2">
                    <div className="text-[10px] text-gray-500 line-through">
                      De R$ {tire.precoOriginal},00
                    </div>
                    <div className="flex items-baseline justify-between">
                      <div className="text-lg font-black text-[#f49e1a]">
                        R$ {tire.precoPromocional}
                        <span className="text-[10px] text-gray-400 font-normal ml-1">à vista</span>
                      </div>
                      <span className="text-[9px] text-emerald-400 font-black uppercase">10x Sem Juros</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-2.5 border-t border-gray-800">
                  <button
                    onClick={() => onSelectTire(tire.slug)}
                    className="w-full bg-gray-800 hover:bg-gray-750 text-white font-bold py-2 px-2 rounded-xl text-xs transition flex items-center justify-center gap-1 cursor-pointer border border-gray-700"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    <span>Detalhes</span>
                  </button>

                  <button
                    onClick={() => handleWhatsAppQuote(tire)}
                    className="w-full bg-[#25D366] hover:bg-emerald-500 text-black font-black py-2 px-2 rounded-xl text-xs transition flex items-center justify-center gap-1 cursor-pointer shadow-md"
                  >
                    <span>Garanta Já</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Trust Bar */}
        <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#f49e1a]" />
            </div>
            <div>
              <strong className="text-white block font-black uppercase text-xs">
                Garantia Oficial de 5 Anos & Menor Preço de Curitiba
              </strong>
              <span>Garantia de fábrica com nota fiscal e instalação imediata sem filas na loja do Portão.</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};


