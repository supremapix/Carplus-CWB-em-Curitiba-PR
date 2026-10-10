import React, { useState } from 'react';
import { Phone, MapPin, Clock, MessageSquare, Share2, ArrowUp, Heart, ExternalLink } from 'lucide-react';

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
    <footer className="bg-[#141416] text-white text-[18px] pb-28 sm:pb-16 relative" id="main-footer">
      {/* Faixa superior de banda de rodagem com linha zebrada laranja */}
      <div className="w-full relative overflow-hidden">
        {/* Banda de rodagem negra texturizada */}
        <div 
          className="h-3 w-full bg-zinc-950 opacity-90"
          style={{
            backgroundImage: 'radial-gradient(#3f3f46 15%, transparent 16%), radial-gradient(#27272a 15%, transparent 16%)',
            backgroundSize: '12px 12px',
            backgroundPosition: '0 0, 6px 6px'
          }}
        />
        {/* Faixa diagonal zebrada laranja/preta estilo oficina */}
        <div 
          className="h-2 w-full border-t border-b border-[#F5A623]/80"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #F5A623 0, #F5A623 12px, #000 12px, #000 24px)'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-12 space-y-12">
        
        {/* Top: Logo + Chamada */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-4">
          {/* Logo Footer Vertical (Mobile w-[150px], Desktop w-[170px]) */}
          <div className="flex justify-center items-center w-full">
            <img 
              src="/images/logos/logo-vertical.svg" 
              alt="Carplus Pneus" 
              width="400"
              height="428"
              loading="lazy"
              className="block mx-auto w-[150px] lg:w-[170px] h-auto object-contain"
            />
          </div>
          <p className="text-zinc-300 text-[18px] leading-relaxed max-w-[65ch]">
            Loja de pneus novos e auto center multimarcas no bairro Portão, Curitiba. Mais de 1.900 medidas homologadas com garantia oficial de 5 anos de fábrica, montagem anti-risco e alinhamento 3D computadorizado.
          </p>
        </div>

        {/* 2 Botões Grandes de Ação Imediata (56px) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <a
            href="tel:554130827282"
            data-cta-location="footer"
            className="h-[56px] min-h-[56px] px-6 bg-[#F5A623] hover:bg-amber-400 text-zinc-950 font-black text-lg rounded-2xl flex items-center justify-center gap-3 transition shadow-lg cursor-pointer active:scale-98"
          >
            <Phone className="w-6 h-6 shrink-0 fill-current" />
            <span>Ligar: (41) 3082-7282</span>
          </a>

          <a
            href="https://api.whatsapp.com/send?phone=554130827282&text=Ol%C3%A1%20Carplus!%20Vim%20pelo%20site%20e%20gostaria%20de%20um%20or%C3%A7amento."
            target="_blank"
            rel="noopener noreferrer"
            data-cta-location="footer"
            className="h-[56px] min-h-[56px] px-6 bg-[#25D366] hover:bg-emerald-600 text-white font-black text-lg rounded-2xl flex items-center justify-center gap-3 transition shadow-lg cursor-pointer active:scale-98"
          >
            <MessageSquare className="w-6 h-6 fill-current shrink-0" />
            <span>WhatsApp no Portão</span>
          </a>
        </div>

        {/* Grid de 3 Blocos Claros Informativos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Bloco 1: Endereço & Localização */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 text-[#F5A623] mb-3">
                <MapPin className="w-6 h-6 shrink-0" />
                <h3 className="text-xl font-bold text-white">Endereço no Portão</h3>
              </div>
              <p className="text-zinc-300 text-[18px] leading-relaxed">
                Av. Presidente Arthur da Silva Bernardes, 1323<br />
                Bairro Portão — Curitiba/PR<br />
                CEP: 80320-300
              </p>
            </div>
            <a 
              href="https://maps.google.com/?q=Av.+Presid.+Arthur+da+Silva+Bernardes,+1323+-+Portão,+Curitiba+-+PR"
              target="_blank"
              rel="noopener noreferrer"
              data-cta-location="footer"
              className="mt-4 inline-flex items-center gap-2 text-[#F5A623] hover:underline font-bold text-[18px] cursor-pointer"
            >
              <span>Abrir no Google Maps</span>
              <ExternalLink className="w-4 h-4 shrink-0" />
            </a>
          </div>

          {/* Bloco 2: Horário de Atendimento */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 text-[#F5A623] mb-3">
                <Clock className="w-6 h-6 shrink-0" />
                <h3 className="text-xl font-bold text-white">Horário da Oficina</h3>
              </div>
              <div className="space-y-2 text-zinc-300 text-[18px]">
                <p><strong>Segunda a Sexta:</strong> 08:00 às 18:00</p>
                <p><strong>Sábado:</strong> 08:00 às 12:00</p>
                <p className="text-zinc-400 text-sm">Domingos e feriados: Fechado</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800 text-xs text-zinc-400 font-mono">
              Atendimento expresso com mais de 10 boxes ativos
            </div>
          </div>

          {/* Bloco 3: Serviços e Marcas */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 text-[#F5A623] mb-3">
                <Phone className="w-6 h-6 shrink-0" />
                <h3 className="text-xl font-bold text-white">Atendimento Direto</h3>
              </div>
              <div className="space-y-2 text-zinc-300 text-[18px]">
                <p>Telefone: <strong>(41) 3082-7282</strong></p>
                <p>WhatsApp: <strong>(41) 3082-7282</strong></p>
                <p className="text-sm text-zinc-400">Parcelamento em até 10x sem juros na loja física.</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800 text-xs text-zinc-400 font-mono">
              Pneus novos com garantia oficial de 5 anos
            </div>
          </div>

        </div>

        {/* Links Úteis & Compartilhar */}
        <div className="pt-6 border-t border-zinc-800 text-center">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 font-semibold text-[18px]">
            <button 
              onClick={() => { onNavigate('catalogo-pneus'); window.scrollTo({top: 0, behavior: 'smooth'}); }} 
              className="text-zinc-200 hover:text-[#F5A623] transition cursor-pointer min-h-[48px] py-1"
            >
              Pneus (catálogo)
            </button>
            <button 
              onClick={() => { onNavigate('alinhamento-3d-curitiba'); window.scrollTo({top: 0, behavior: 'smooth'}); }} 
              className="text-zinc-200 hover:text-[#F5A623] transition cursor-pointer min-h-[48px] py-1"
            >
              Serviços e Alinhamento 3D
            </button>
            <button 
              onClick={() => { onNavigate('blog'); window.scrollTo({top: 0, behavior: 'smooth'}); }} 
              className="text-zinc-200 hover:text-[#F5A623] transition cursor-pointer min-h-[48px] py-1"
            >
              Blog Automotivo
            </button>
            <button 
              onClick={() => { onNavigate('quem-somos'); window.scrollTo({top: 0, behavior: 'smooth'}); }} 
              className="text-zinc-200 hover:text-[#F5A623] transition cursor-pointer min-h-[48px] py-1"
            >
              Sobre a Carplus
            </button>
            <button 
              onClick={() => { onNavigate('contato'); window.scrollTo({top: 0, behavior: 'smooth'}); }} 
              className="text-zinc-200 hover:text-[#F5A623] transition cursor-pointer min-h-[48px] py-1"
            >
              Contato
            </button>
            <button 
              onClick={handleShare}
              className="text-[#F5A623] hover:underline flex items-center gap-1.5 transition cursor-pointer min-h-[48px] py-1 font-bold"
            >
              <Share2 className="w-5 h-5 shrink-0" />
              <span>{shareCopied ? 'Link copiado!' : 'Compartilhar esta página'}</span>
            </button>
            <button 
              onClick={handleScrollToTop}
              className="text-[#F5A623] hover:underline flex items-center gap-1.5 transition cursor-pointer min-h-[48px] py-1 font-bold"
            >
              <ArrowUp className="w-5 h-5 shrink-0" />
              <span>↑ Voltar ao topo</span>
            </button>
          </div>
        </div>

        {/* Linha final com © e CNPJ */}
        <div className="pt-6 border-t border-zinc-800 text-[14px] text-zinc-400 flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Carplus Pneus & Oficina Mecânica. Todos os direitos reservados.</p>
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

