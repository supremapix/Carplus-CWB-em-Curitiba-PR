import React, { useState } from 'react';
import { Phone, MapPin, Clock, MessageSquare, Share2, ArrowUp, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: any) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const [shareCopied, setShareCopied] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Carplus Pneus e Oficina - Portão Curitiba',
        text: 'Encontre pneus novos com o melhor preço de Curitiba na Carplus Portão!',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2500);
      });
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black text-white text-[18px] py-12 pb-28 sm:pb-12 px-5 sm:px-8 border-t border-zinc-800" id="main-footer">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* (a) Logo + uma frase */}
        <div className="space-y-3 max-w-xl">
          <img 
            src="/images/logos/logo-horizontal.svg" 
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://img.carplusautos.com.br/cwb/logo-horizontal.svg';
            }}
            alt="Carplus Pneus e Oficina Mecânica" 
            className="h-10 w-auto object-contain"
          />
          <p className="text-zinc-300 text-[18px] leading-relaxed">
            Sua loja de pneus e centro automotivo especializado no bairro Portão em Curitiba. Pneus novos multimarcas com garantia de fábrica.
          </p>
        </div>

        {/* (b) Contato: telefone, WhatsApp e endereço, cada um clicável com 48px de área de toque */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-[#F5A623]">Contato e Localização</h3>
          
          <div className="flex flex-col gap-3 max-w-2xl">
            {/* Phone */}
            <a 
              href="tel:554130827282"
              data-cta-location="footer"
              className="flex items-center gap-3 p-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-xl min-h-[48px] transition cursor-pointer text-white font-medium"
            >
              <Phone className="w-6 h-6 text-[#F5A623] shrink-0" />
              <span>Ligar: <strong>(41) 3082-7282</strong></span>
            </a>

            {/* WhatsApp */}
            <a 
              href="https://api.whatsapp.com/send?phone=554130827282&text=Ol%C3%A1%20Carplus!%20Vim%20pelo%20site%20e%20gostaria%20de%20um%20or%C3%A7amento."
              target="_blank"
              rel="noopener noreferrer"
              data-cta-location="footer"
              className="flex items-center gap-3 p-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-xl min-h-[48px] transition cursor-pointer text-white font-medium"
            >
              <MessageSquare className="w-6 h-6 text-[#25D366] fill-current shrink-0" />
              <span>WhatsApp: <strong>(41) 3082-7282</strong></span>
            </a>

            {/* Address */}
            <a 
              href="https://maps.google.com/?q=Av.+Presid.+Arthur+da+Silva+Bernardes,+1323+-+Portão,+Curitiba+-+PR"
              target="_blank"
              rel="noopener noreferrer"
              data-cta-location="footer"
              className="flex items-start gap-3 p-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-xl min-h-[48px] transition cursor-pointer text-white font-medium"
            >
              <MapPin className="w-6 h-6 text-[#F5A623] shrink-0 mt-0.5" />
              <span>Av. Pres. Arthur Bernardes, 1323 - Portão, Curitiba - PR</span>
            </a>
          </div>
        </div>

        {/* (c) Horário de funcionamento em lista simples */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-[#F5A623]">Horário de Funcionamento</h3>
          <ul className="space-y-2 text-zinc-300">
            <li className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#F5A623] shrink-0" />
              <span>Segunda a Sexta: 08:00 às 18:00</span>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#F5A623] shrink-0" />
              <span>Sábado: 08:00 às 12:00</span>
            </li>
            <li className="text-zinc-400 text-sm pl-7">Domingos e feriados: Fechado</li>
          </ul>
        </div>

        {/* (d) Links úteis: Pneus, Serviços, Blog, Sobre, Contato, Compartilhar, ↑ Voltar ao topo */}
        <div className="space-y-3 pt-4 border-t border-zinc-800">
          <h3 className="text-xl font-bold text-[#F5A623]">Navegação Útil</h3>
          <div className="flex flex-wrap gap-x-6 gap-y-3 font-semibold text-[18px]">
            <button 
              onClick={() => { onNavigate('catalogo-pneus'); window.scrollTo({top: 0, behavior: 'smooth'}); }} 
              className="text-zinc-200 hover:text-[#F5A623] transition cursor-pointer min-h-[44px] py-1"
            >
              Pneus (catálogo)
            </button>
            <button 
              onClick={() => { onNavigate('alinhamento-3d-curitiba'); window.scrollTo({top: 0, behavior: 'smooth'}); }} 
              className="text-zinc-200 hover:text-[#F5A623] transition cursor-pointer min-h-[44px] py-1"
            >
              Serviços e Alinhamento
            </button>
            <button 
              onClick={() => { onNavigate('blog'); window.scrollTo({top: 0, behavior: 'smooth'}); }} 
              className="text-zinc-200 hover:text-[#F5A623] transition cursor-pointer min-h-[44px] py-1"
            >
              Blog
            </button>
            <button 
              onClick={() => { onNavigate('quem-somos'); window.scrollTo({top: 0, behavior: 'smooth'}); }} 
              className="text-zinc-200 hover:text-[#F5A623] transition cursor-pointer min-h-[44px] py-1"
            >
              Sobre
            </button>
            <button 
              onClick={() => { onNavigate('contato'); window.scrollTo({top: 0, behavior: 'smooth'}); }} 
              className="text-zinc-200 hover:text-[#F5A623] transition cursor-pointer min-h-[44px] py-1"
            >
              Contato
            </button>
            <button 
              onClick={handleShare}
              className="text-[#F5A623] hover:underline flex items-center gap-1.5 transition cursor-pointer min-h-[44px] py-1 font-bold"
            >
              <Share2 className="w-5 h-5 shrink-0" />
              <span>{shareCopied ? 'Link copiado!' : 'Compartilhar esta página'}</span>
            </button>
            <button 
              onClick={handleScrollToTop}
              className="text-[#F5A623] hover:underline flex items-center gap-1.5 transition cursor-pointer min-h-[44px] py-1 font-bold"
            >
              <ArrowUp className="w-5 h-5 shrink-0" />
              <span>↑ Voltar ao topo</span>
            </button>
          </div>
        </div>

        {/* (e) Linha final com © e CNPJ em 14px */}
        <div className="pt-6 border-t border-zinc-800 text-[14px] text-zinc-400 flex flex-col sm:flex-row justify-between gap-2">
          <p>© {new Date().getFullYear()} Carplus Pneus & Oficina. Todos os direitos reservados.</p>
          <p>CNPJ: 22.845.891/0001-08 • Av. Pres. Arthur Bernardes, 1323 - Portão, Curitiba/PR</p>
        </div>

      </div>

      <SupremaCredit />
    </footer>
  );
}

export function SupremaCredit() {
  return (
    <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-zinc-900 flex justify-center items-center">
      <div className="flex flex-col sm:flex-row items-center gap-2 text-xs text-zinc-500">
        <div className="flex items-center gap-1">
          <span>Desenvolvido com</span>
          <Heart size={12} className="text-[#F5A623] fill-[#F5A623]" /> 
          <span>por</span>
        </div>
        <a 
          id="developer-suprema-link"
          href="https://supremasite.com.br" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-zinc-300 hover:text-[#F5A623] transition font-bold"
        >
          Suprema Sites Express
        </a>
      </div>
    </div>
  );
}

