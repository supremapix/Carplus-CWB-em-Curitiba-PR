import React from 'react';
import { Search, Phone, MessageSquare, Wrench, Gauge, ShieldCheck, Sparkles, Disc } from 'lucide-react';
import { PromoTire } from '../data/promoTires';

interface WorkshopHeroProps {
  onSearchClick: () => void;
  onCallClick?: () => void;
  onSelectPromoTire: (slug: string) => void;
  promoTires: PromoTire[];
}

export default function WorkshopHero({
  onSearchClick,
  onSelectPromoTire,
  promoTires
}: WorkshopHeroProps) {
  const whatsappUrl = "https://api.whatsapp.com/send?phone=554130827282&text=Ol%C3%A1%20Carplus!%20Vim%20pelo%20site%20e%20gostaria%20de%20consultar%20pneus%20e%20servi%C3%A7os%20no%20Port%C3%A3o.";

  return (
    <div 
      className="relative bg-[#141416] text-white overflow-hidden py-14 sm:py-20 border-b border-zinc-800"
      id="hero-banner"
    >
      {/* 1. Textura sutil de banda de rodagem (SVG de sulcos) em baixa opacidade */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}
      />

      {/* 2. Faixa diagonal zebrada laranja/amarela estilo oficina (Hazard Stripes) */}
      <div 
        className="h-3 w-full absolute top-0 left-0 border-b border-[#F5A623]/80 z-20"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #F5A623 0, #F5A623 14px, #000 14px, #000 28px)'
        }}
      />

      {/* Linha zebrada sutil no rodapé da seção */}
      <div 
        className="h-1.5 w-full absolute bottom-0 left-0 border-t border-[#F5A623]/60 z-20 opacity-80"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #F5A623 0, #F5A623 10px, #000 10px, #000 20px)'
        }}
      />

      {/* Container Principal Rigorosamente Centralizado */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center space-y-10">
        
        {/* Badge de Oficina */}
        <div className="inline-flex items-center justify-center gap-2 bg-zinc-900 border border-[#F5A623]/50 text-[#F5A623] font-mono text-xs font-black uppercase tracking-wider px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-md max-w-full text-center">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F5A623] animate-pulse shrink-0" />
          <span className="hidden sm:inline">Centro Automotivo Autorizado • Av. Arthur Bernardes, 1323 - Portão</span>
          <span className="sm:hidden">Auto Center • Arthur Bernardes, 1323</span>
        </div>

        {/* Título Forte e Impactante */}
        <div className="max-w-4xl mx-auto space-y-4 w-full px-1 sm:px-0">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[1.1] select-none break-words [overflow-wrap:anywhere]">
            Pneus e <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5A623] via-amber-400 to-[#F5A623]">Auto Center</span> em Curitiba – Portão
          </h1>

          <p className="text-zinc-200 text-[18px] sm:text-[20px] font-normal leading-relaxed max-w-[65ch] mx-auto bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/80 [overflow-wrap:anywhere]">
            Procurando <strong className="text-white font-black">onde comprar pneus em Curitiba</strong>? A Carplus Pneus e Auto Center no Portão (Av. Arthur Bernardes, 1323) oferece mais de 1.900 opções de pneus novos multimarcas a pronta entrega, com montagem imediata anti-risco de rodas, alinhamento 3D computadorizado a laser e garantia oficial de 5 anos de fábrica.
          </p>
        </div>

        {/* 3. Pneu Grande em Destaque Girando Lentamente (SVG / Ilustração Oficina) */}
        <div className="relative flex items-center justify-center my-2 max-w-full overflow-hidden">
          {/* Brilho de oficina atrás do pneu */}
          <div className="absolute w-52 h-52 sm:w-80 sm:h-80 bg-[#F5A623]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Imagem do Pneu com rotação lenta */}
          <div className="relative w-48 h-48 sm:w-72 sm:h-72 select-none group max-w-full">
            <img
              src="/images/pneus/pneu-fallback.svg"
              alt="Pneu e Roda de Liga Leve em Destaque Carplus"
              className="w-full h-full object-contain animate-spin-slow drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)] filter contrast-105 max-w-full"
            />
          </div>
        </div>

        {/* 2 CTAs Grandes (56px) Centralizados */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto pt-2 max-w-full" id="hero-action-buttons">
          <button
            onClick={onSearchClick}
            data-cta-location="hero"
            className="w-full sm:w-auto min-h-[56px] h-auto py-3.5 px-4 sm:px-8 bg-[#F5A623] hover:bg-amber-400 text-zinc-950 font-black text-sm sm:text-lg uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2.5 sm:gap-3 transition-all duration-200 shadow-xl cursor-pointer active:scale-98 border border-[#d68516]"
            id="hero-ver-pneus-btn"
          >
            <Search className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3] shrink-0" />
            <span className="text-center font-black">Ver Todos os Pneus</span>
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cta-location="hero"
            className="w-full sm:w-auto min-h-[56px] h-auto py-3.5 px-4 sm:px-8 bg-[#25D366] hover:bg-emerald-600 text-white font-black text-sm sm:text-lg uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2.5 sm:gap-3 transition-all duration-200 shadow-xl cursor-pointer active:scale-98"
            id="hero-whatsapp-btn"
          >
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 fill-current shrink-0" />
            <span className="text-center font-black">Chamar no WhatsApp</span>
          </a>
        </div>

        {/* 3 Destaques de Confiança e Estrutura */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl mx-auto pt-4">
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex items-center justify-center sm:justify-start gap-3.5 text-left">
            <div className="w-11 h-11 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[#F5A623] shrink-0">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-sm font-black text-white uppercase">Montagem Anti-Risco</span>
              <span className="text-xs text-zinc-400">Desmontadoras pneumáticas de alta precisão</span>
            </div>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex items-center justify-center sm:justify-start gap-3.5 text-left">
            <div className="w-11 h-11 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[#F5A623] shrink-0">
              <Gauge className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-sm font-black text-white uppercase">Alinhamento 3D</span>
              <span className="text-xs text-zinc-400">Rampa computadorizada a laser</span>
            </div>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex items-center justify-center sm:justify-start gap-3.5 text-left">
            <div className="w-11 h-11 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-emerald-500 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-sm font-black text-white uppercase">Garantia de 5 Anos</span>
              <span className="text-xs text-zinc-400">Pneus 100% originais com nota e Inmetro</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
