import React, { useState } from 'react';
import { Flame } from 'lucide-react';
import { TIRES_DATA, getBrandFallbackImage } from '../data';

interface GaragemDePneusSectionProps {
  onNavigateToPage: (page: any, slug?: string) => void;
  onSelectBlogSlug?: (slug: string | null) => void;
}

export default function GaragemDePneusSection({
  onNavigateToPage,
  onSelectBlogSlug
}: GaragemDePneusSectionProps) {
  const [brandFilter, setBrandFilter] = useState<'Todos' | 'Pirelli' | 'Michelin' | 'Goodyear' | 'Bridgestone' | 'Delinte'>('Todos');
  const [rimFilter, setRimFilter] = useState<'Todos' | '14' | '15' | '16' | '17' | '18' | '19'>('Todos');

  const formatWhatsApp = (text: string) => {
    return `https://api.whatsapp.com/send?phone=554130827282&text=${encodeURIComponent(text)}`;
  };

  const filteredTires = TIRES_DATA.filter(t => {
    const matchBrand = brandFilter === 'Todos' || t.brand.toLowerCase() === brandFilter.toLowerCase();
    const matchRim = rimFilter === 'Todos' || String(t.rim) === rimFilter;
    return matchBrand && matchRim;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in font-sans text-gray-900" id="garagem-de-pneus-section">
      <div className="text-center space-y-2">
        <span className="bg-yellow-500 text-gray-950 font-mono font-black text-[9px] uppercase px-3 py-1 rounded inline-block">
          Pronta Entrega Imediata
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight uppercase font-mono">
          Garagem de Pneus Curitiba
        </h1>
        <p className="text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed text-xs sm:text-sm">
          Temos o maior e mais variado estoque de pneus novos com montagem rápida no Portão. Compare as marcas lendárias Pirelli, Goodyear, Bridgestone, Michelin de forma justa e garanta frete ou instalação grátis.
        </p>
      </div>

      {/* Stock info box */}
      <div className="bg-gray-150 border border-gray-350 p-5 rounded-2xl flex flex-col sm:flex-row items-center gap-4 text-xs">
        <Flame className="w-8 h-8 text-yellow-600 shrink-0 animate-pulse" />
        <p className="text-gray-700 leading-relaxed text-justify font-bold uppercase font-mono">
          ➔ ESTOQUE ATUALIZADO: Rodando com pneus seguros e de alta performance. Reservando pelo site, garantimos seu horário exclusivo para instalação mecânica em nossa estufa física e bicos novos grátis.
        </p>
      </div>

      {/* Filters UI */}
      <div className="bg-white border border-gray-200 p-5 rounded-2xl space-y-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider block font-mono">Filtro por Marca Especialista</label>
          <div className="flex flex-wrap gap-1.5">
            {['Todos', 'Pirelli', 'Michelin', 'Goodyear', 'Bridgestone', 'Delinte'].map(b => (
              <button
                key={b}
                onClick={() => setBrandFilter(b as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold border transition cursor-pointer ${
                  brandFilter === b 
                    ? 'bg-black text-white border-black' 
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-400'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider block font-mono">Filtro por Diâmetro (Aro)</label>
          <div className="flex flex-wrap gap-1.5">
            {['Todos', '14', '15', '16', '17', '18', '19'].map(r => (
              <button
                key={r}
                onClick={() => setRimFilter(r as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold border transition cursor-pointer ${
                  rimFilter === r 
                    ? 'bg-black text-white border-black' 
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-400'
                }`}
              >
                {r === 'Todos' ? 'Todos' : `R${r}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Tire Grid representation */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
          <h3 className="text-sm font-black uppercase font-mono text-gray-950">Medidas Disponíveis na Garagem ({filteredTires.length})</h3>
          <span className="text-[10px] text-gray-500 font-bold uppercase font-mono">Montagem Expressa inclusa</span>
        </div>

        {filteredTires.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredTires.map((tire, index) => (
              <div key={tire.id || index} className="bg-white border border-gray-200 p-4 rounded-2xl flex gap-4 items-center shadow-sm relative hover:border-[#f49e1a]/50 transition duration-300">
                <img 
                  src={tire.image || "/images/galeria/troca-pneu.webp"} 
                  alt={tire.name} 
                  className="w-20 h-20 object-contain p-1 shrink-0 bg-gray-50 rounded-xl"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = getBrandFallbackImage(tire.brand, tire.id);
                  }}
                />
                <div className="flex-1 space-y-1 text-left min-w-0">
                  <span className="bg-gray-900 text-white font-mono font-black text-[8px] uppercase px-1.5 py-0.5 rounded">
                    {tire.brand}
                  </span>
                  <h4 className="font-extrabold text-sm text-gray-950 truncate uppercase">{tire.model}</h4>
                  <p className="text-xs text-gray-500 font-semibold font-mono tracking-wide">{tire.width}/{tire.aspectRatio} R{tire.rim}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="font-black text-xs text-[#1ebd53] uppercase tracking-wider">Sob Consulta</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 shrink-0">
                  <a
                    href={formatWhatsApp(`Olá Carplus Curitiba! Gostaria de consultar o pneu ${tire.brand} ${tire.model} medida ${tire.width}/${tire.aspectRatio} R${tire.rim} pelo WhatsApp.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366] hover:bg-[#20ba5a] text-white text-[10px] font-black uppercase tracking-wider py-2 px-4 rounded-lg transition text-center cursor-pointer border border-[#1ebd53]"
                  >
                    Whats
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-yellow-500/5 border border-yellow-500/10 p-10 rounded-2xl text-center space-y-2">
            <p className="font-black text-sm text-gray-900 uppercase font-mono">Nenhum Pneu Filtro Encontrado</p>
            <p className="text-xs text-gray-600 max-w-sm mx-auto">Mas podemos faturar essa medida direto do atacado com até 24 horas. Fale com um consultor!</p>
            <a
              href={formatWhatsApp("Olá Carplus! Gostaria de verificar pneus novos sob consulta de estoque.")}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white hover:bg-yellow-500 hover:text-gray-950 font-mono font-black text-xs uppercase px-4 py-2.5 rounded-xl transition inline-block cursor-pointer"
            >
              Verificar via WhatsApp ➔
            </a>
          </div>
        )}

        {/* 3. INTERNAL LINKING: SERVICES -> BLOG */}
        <div className="bg-[#f49e1a]/5 border border-[#f49e1a]/15 p-5 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-4 text-xs mt-8 text-left">
          <div className="space-y-0.5">
            <span className="font-mono text-[9px] text-[#f49e1a] uppercase font-black tracking-widest block">Dica Técnica de Segurança</span>
            <p className="font-extrabold text-gray-950 uppercase">Como verificar o desgaste crítico do seu pneu através do TWI?</p>
            <p className="text-gray-550 leading-relaxed font-semibold">Mostramos em nosso blog como localizar os pequenos relevos no pneu e evitar ser penalizado em blitze.</p>
          </div>
          <button
            onClick={() => {
              if (onSelectBlogSlug) {
                onSelectBlogSlug('pneu-desgastando-de-um-lado');
              }
              onNavigateToPage('blog', 'pneu-desgastando-de-um-lado');
            }}
            className="bg-black hover:bg-[#f49e1a] hover:text-black text-white font-extrabold px-4 py-2.5 rounded-xl transition shrink-0 uppercase font-mono text-[10px] cursor-pointer"
          >
            Ver Guia TWI ➔
          </button>
        </div>
      </div>
    </div>
  );
}
