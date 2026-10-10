import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface RimsSectionProps {
  onSelectRim: (rim: number) => void;
  selectedRim?: number | 'Todos';
}

interface RimData {
  rim: number;
  label: string;
  sizePx: number;
  cars: string;
  popularMeasures: string;
}

const RIMS_DATA: RimData[] = [
  {
    rim: 13,
    label: 'Aro 13',
    sizePx: 84,
    cars: 'Celta, Uno, Palio, Gol G2/G3, Classic, Ka',
    popularMeasures: '175/70 R13 · 165/70 R13'
  },
  {
    rim: 14,
    label: 'Aro 14',
    sizePx: 92,
    cars: 'Gol, HB20, Onix, Fox, Kwid, Siena, Fiesta',
    popularMeasures: '175/65 R14 · 185/60 R14'
  },
  {
    rim: 15,
    label: 'Aro 15',
    sizePx: 100,
    cars: 'Polo, Yaris, Fit, City, HB20S, Cronos, Sandero',
    popularMeasures: '185/60 R15 · 195/55 R15'
  },
  {
    rim: 16,
    label: 'Aro 16',
    sizePx: 108,
    cars: 'Corolla, Civic, Renegade, Kicks, Dolphin Mini',
    popularMeasures: '205/55 R16 · 175/55 R16'
  },
  {
    rim: 17,
    label: 'Aro 17',
    sizePx: 116,
    cars: 'Compass, T-Cross, Tracker, Creta, HR-V, Nivus',
    popularMeasures: '215/50 R17 · 225/65 R17'
  },
  {
    rim: 18,
    label: 'Aro 18',
    sizePx: 124,
    cars: 'Hilux, S10, Ranger, Amarok, Toro, SW4, Taos',
    popularMeasures: '265/60 R18 · 225/55 R18'
  }
];

export default function RimsSection({ onSelectRim, selectedRim }: RimsSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasEntered, setHasEntered] = useState(false);
  const [hoveredRim, setHoveredRim] = useState<number | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasEntered(true);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-16 bg-[#18181b] text-white relative overflow-hidden border-t border-b border-zinc-800"
      id="secao-aros-oficina"
    >
      {/* Padrão sutil de oficina ao fundo */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#F5A623 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Faixa diagonal zebrada superior */}
      <div 
        className="h-2 w-full absolute top-0 left-0 border-b border-[#F5A623]/40"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #F5A623 0, #F5A623 10px, #000 10px, #000 20px)'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Cabeçalho rigorosamente centralizado */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-zinc-900 border border-[#F5A623]/40 text-[#F5A623] px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Guia Rápido de Medidas • Portão Curitiba</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            Escolha pelo <span className="text-[#F5A623]">Aro do seu Carro</span>
          </h2>
          
          <p className="text-zinc-300 text-[18px] leading-relaxed max-w-[65ch] mx-auto">
            Do compacto urbano aro 13 às caminhonetes e SUVs aro 18: toque no tamanho da roda para filtrar instantaneamente nosso catálogo no estoque a pronta entrega.
          </p>
        </div>

        {/* Grade de Cards dos Aros (13 a 18) - Centralizada */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-5 justify-center items-stretch w-full max-w-full min-w-0">
          {RIMS_DATA.map((item, idx) => {
            const isSelected = selectedRim === item.rim;
            const isHovered = hoveredRim === item.rim;

            return (
              <div
                key={`rim-card-${item.rim}`}
                onClick={() => onSelectRim(item.rim)}
                onMouseEnter={() => setHoveredRim(item.rim)}
                onMouseLeave={() => setHoveredRim(null)}
                className={`bg-zinc-900/90 hover:bg-zinc-900 border-2 rounded-[14px] p-5 flex flex-col justify-between items-center text-center transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden w-full max-w-full min-w-0 ${
                  isSelected 
                    ? 'border-[#F5A623] ring-2 ring-[#F5A623]/30 bg-zinc-850' 
                    : 'border-zinc-800 hover:border-[#F5A623]/80'
                }`}
              >
                {/* Faixa superior do card estilo oficina */}
                <div 
                  className="h-1.5 w-full absolute top-0 left-0 bg-zinc-950 border-b border-[#F5A623]/40"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, #F5A623 0, #F5A623 4px, transparent 4px, transparent 8px)'
                  }}
                />

                {/* Área da Roda/Pneu SVG proporcional com animação */}
                <div className="h-36 flex items-center justify-center my-2 relative">
                  <div
                    style={{
                      width: `${item.sizePx}px`,
                      height: `${item.sizePx}px`,
                      transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      transform: hasEntered
                        ? isHovered
                          ? 'rotate(720deg) scale(1.08)'
                          : 'rotate(0deg) scale(1)'
                        : 'translateX(-30px) rotate(-180deg) scale(0.85)'
                    }}
                    className="relative shrink-0 select-none"
                  >
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                      {/* Pneu Externo de Borracha */}
                      <circle cx="50" cy="50" r="48" fill="#18181b" stroke="#09090b" strokeWidth="4" />
                      {/* Ranhuras/Sulcos na Banda */}
                      <circle cx="50" cy="50" r="44" fill="none" stroke="#27272a" strokeWidth="2" strokeDasharray="3 3" />
                      
                      {/* Lateral do Pneu */}
                      <circle cx="50" cy="50" r="38" fill="#27272a" stroke="#3f3f46" strokeWidth="1" />
                      
                      {/* Roda de Liga Leve Metálica */}
                      <circle cx="50" cy="50" r="30" fill="#d4d4d8" stroke="#71717a" strokeWidth="2" />
                      
                      {/* Raios da Roda de Liga (5 raios) */}
                      <g stroke="#71717a" strokeWidth="3" strokeLinecap="round">
                        <line x1="50" y1="50" x2="50" y2="24" />
                        <line x1="50" y1="50" x2="75" y2="42" />
                        <line x1="50" y1="50" x2="65" y2="73" />
                        <line x1="50" y1="50" x2="35" y2="73" />
                        <line x1="50" y1="50" x2="25" y2="42" />
                      </g>

                      {/* Calota Central com Cor Carplus Laranja */}
                      <circle cx="50" cy="50" r="16" fill="#F5A623" stroke="#000" strokeWidth="1.5" />
                      
                      {/* Número do Aro em Destaque */}
                      <text 
                        x="50" 
                        y="55" 
                        textAnchor="middle" 
                        fontSize="13" 
                        fontWeight="900" 
                        fontFamily="monospace"
                        fill="#000000"
                      >
                        {item.rim}
                      </text>
                    </svg>
                  </div>
                </div>

                {/* Detalhes do Aro */}
                <div className="space-y-1.5 w-full">
                  <span className="text-xl font-black text-white block tracking-wide">
                    {item.label}
                  </span>
                  
                  <p className="text-xs font-mono text-[#F5A623] font-bold">
                    {item.popularMeasures}
                  </p>
                  
                  <p className="text-[13px] text-zinc-400 leading-snug line-clamp-2 min-h-[36px]">
                    {item.cars}
                  </p>
                </div>

                {/* Botão de Ação (48px) */}
                <button
                  type="button"
                  className={`mt-4 w-full h-[48px] min-h-[48px] px-3 font-bold text-sm rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-[#F5A623] text-black shadow-md'
                      : 'bg-zinc-800 text-zinc-200 hover:bg-[#F5A623] hover:text-black'
                  }`}
                >
                  <span>Ver Aro {item.rim}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
