import React, { useState } from 'react';
import { ArrowUp, ArrowUpRight, Clock, Heart, MapPin, MessageSquare, Phone, Share2 } from 'lucide-react';

interface FooterProps { onNavigate: (page: any) => void; }

const maps = 'https://maps.google.com/?q=Av.+Presid.+Arthur+da+Silva+Bernardes,+1323+-+Port%C3%A3o,+Curitiba+-+PR';
const whatsapp = 'https://api.whatsapp.com/send?phone=554130827282&text=Ol%C3%A1%20Carplus!%20Vim%20pelo%20site%20e%20gostaria%20de%20um%20or%C3%A7amento.';
const focusClass = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f59c00]';
const navigation = [
  { label: 'Pneus (catálogo)', page: 'catalogo-pneus', href: '/pneus' },
  { label: 'Serviços e Alinhamento 3D', page: 'alinhamento-3d-curitiba', href: '/alinhamento-3d-curitiba' },
  { label: 'Blog automotivo', page: 'blog', href: '/blog' },
  { label: 'Sobre a Carplus', page: 'quem-somos', href: '/quem-somos' },
  { label: 'Contato', page: 'contato', href: '/contato' },
];
const information = [
  { label: 'Atendimento em Curitiba', page: 'curitiba', href: '/curitiba' },
  { label: 'Região metropolitana', page: 'regiao-metropolitana', href: '/regiao-metropolitana' },
  { label: 'Política de privacidade', page: 'politica-privacidades', href: '/politica-privacidades' },
  { label: 'Trocas e devoluções', page: 'politica-devolucao', href: '/politica-devolucao' },
  { label: 'Mapa do site', page: 'mapa-do-site', href: '/mapa-do-site' },
];

export default function Footer({ onNavigate }: FooterProps) {
  const [shareMessage, setShareMessage] = useState('');

  const handleShare = async () => {
    try {
      if (navigator.share) await navigator.share({ title: 'Carplus Pneus e Oficina — Portão, Curitiba', text: 'Pneus e serviços automotivos na Carplus.', url: window.location.href });
      else if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(window.location.href); setShareMessage('Link copiado!'); }
      else setShareMessage('Copie o endereço desta página para compartilhar.');
    } catch (error) {
      if (!(error instanceof Error && error.name === 'AbortError')) setShareMessage('Copie o endereço desta página para compartilhar.');
    }
  };

  const navigate = (event: React.MouseEvent<HTMLAnchorElement>, page: string) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  const navigateHomeSection = (event: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onNavigate('home');
    window.setTimeout(() => document.getElementById(sectionId)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' }), 120);
  };
  const toTop = () => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });

  return (
    <footer className="carplus-footer relative border-t border-white/15 bg-[#080808] pb-28 text-white sm:pb-12" id="main-footer" data-cta-location="footer">
      <div className="mx-auto max-w-7xl px-5 pt-12 sm:px-8 lg:pt-16">
        <div className="flex flex-col items-center text-center">
          <a href="/" onClick={event => navigate(event, 'home')} aria-label="Carplus Pneus — início" className={`block ${focusClass}`}><img src="/images/logos/logo-vertical.svg" alt="Carplus Pneus e Oficina Mecânica Full Service" width="224" height="240" loading="lazy" className="mx-auto h-auto w-[180px] object-contain sm:w-[210px]" /></a>
          <p className="mt-7 max-w-xl text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">Seu carro precisa de atenção?<br /><span className="text-[#f59c00]">A Carplus ajuda você a escolher.</span></p>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-white/65">Conte qual é o seu carro e o que você precisa. Nossa equipe confere as opções de pneus e serviços e prepara seu orçamento.</p>
        </div>
        <div className="mx-auto mt-8 grid max-w-5xl gap-3 lg:grid-cols-[1.5fr_1fr_1fr]">
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" data-cta-location="footer" className={`flex min-h-14 items-center justify-center gap-3 rounded-sm bg-[#f59c00] px-5 py-4 text-center text-base font-bold text-[#080808] transition-shadow hover:shadow-[0_0_0_3px_#f59c0033] ${focusClass}`}><MessageSquare className="h-5 w-5 shrink-0" aria-hidden="true" /><span>Falar com a equipe no WhatsApp</span></a>
          <a href="tel:554130827282" data-cta-location="footer" className={`flex min-h-14 items-center justify-center gap-3 rounded-sm border border-white/30 px-4 py-4 text-base font-semibold transition-colors hover:border-[#f59c00] ${focusClass}`}><Phone className="h-5 w-5 shrink-0 text-[#f59c00]" aria-hidden="true" /><span>(41) 3082-7282</span></a>
          <a href={maps} target="_blank" rel="noopener noreferrer" data-cta-location="footer" className={`flex min-h-14 items-center justify-center gap-3 rounded-sm border border-white/30 px-5 py-4 text-base font-semibold transition-colors hover:border-[#f59c00] ${focusClass}`}><MapPin className="h-5 w-5 shrink-0 text-[#f59c00]" aria-hidden="true" /><span>Como chegar</span></a>
        </div>
        <div className="mt-12 grid gap-9 border-t border-white/15 pt-9 sm:grid-cols-2 lg:mt-14 lg:grid-cols-[1.2fr_1fr_1fr] lg:gap-12">
          <section aria-labelledby="footer-address">
            <h2 id="footer-address" className="mb-5 flex items-center gap-2 text-lg font-semibold"><MapPin className="h-5 w-5 text-[#f59c00]" aria-hidden="true" />Visite nossa loja</h2>
            <address className="not-italic text-base leading-relaxed text-white/70">Av. Presidente Arthur da Silva Bernardes, <strong className="font-semibold text-white">1323</strong><br />Portão · Curitiba / PR<br />CEP: 80320-300</address>
            <a href={maps} target="_blank" rel="noopener noreferrer" data-cta-location="footer" className={`mt-3 inline-flex min-h-12 items-center gap-2 text-sm font-semibold text-[#f59c00] hover:underline ${focusClass}`}>Abrir no Google Maps<ArrowUpRight className="h-4 w-4" aria-hidden="true" /></a>
            <h3 className="mb-3 mt-6 flex items-center gap-2 text-base font-semibold"><Clock className="h-4 w-4 text-[#f59c00]" aria-hidden="true" />Horário de atendimento</h3>
            <dl className="grid max-w-xs grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-sm text-white/70"><dt>Segunda a sexta</dt><dd className="text-white">8h às 18h</dd><dt>Sábado</dt><dd className="text-white">8h às 12h</dd><dt>Domingos e feriados</dt><dd>Fechado</dd></dl>
          </section>
          <nav aria-label="Links úteis no rodapé"><h2 className="mb-3 text-lg font-semibold">Encontre o que precisa</h2>{navigation.map(link => <a key={link.page} href={link.href} onClick={event => navigate(event, link.page)} className={`flex min-h-12 items-center justify-between gap-3 border-b border-white/10 py-3 text-base text-white/70 transition-colors hover:text-[#f59c00] ${focusClass}`}><span>{link.label}</span><ArrowUpRight className="h-4 w-4 shrink-0 text-[#f59c00]" aria-hidden="true" /></a>)}{[{ label: 'Ofertas de pneus', id: 'catalog' }, { label: 'Qual pneu serve no meu carro?', id: 'finder' }].map(link => <a key={link.id} href={`/#${link.id}`} onClick={event => navigateHomeSection(event, link.id)} className={`flex min-h-12 items-center justify-between gap-3 border-b border-white/10 py-3 text-base text-white/70 transition-colors hover:text-[#f59c00] ${focusClass}`}><span>{link.label}</span><ArrowUpRight className="h-4 w-4 shrink-0 text-[#f59c00]" aria-hidden="true" /></a>)}</nav>
          <nav aria-label="Informações da Carplus"><h2 className="mb-3 text-lg font-semibold">Mais informações</h2>{information.map(link => <a key={link.page} href={link.href} onClick={event => navigate(event, link.page)} className={`flex min-h-12 items-center border-b border-white/10 py-3 text-base text-white/70 transition-colors hover:text-[#f59c00] ${focusClass}`}>{link.label}</a>)}</nav>
        </div>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 border-t border-white/15 py-5 sm:justify-between"><button type="button" onClick={handleShare} className={`inline-flex min-h-12 items-center gap-2 text-sm font-semibold text-white/75 hover:text-[#f59c00] ${focusClass}`}><Share2 className="h-4 w-4 text-[#f59c00]" aria-hidden="true" />Compartilhar esta página</button><span role="status" className="text-sm text-[#f59c00]">{shareMessage}</span><button type="button" onClick={toTop} className={`inline-flex min-h-12 items-center gap-2 text-sm font-semibold text-white/75 hover:text-[#f59c00] ${focusClass}`}>Voltar ao topo<ArrowUp className="h-4 w-4 text-[#f59c00]" aria-hidden="true" /></button></div>
        <div className="flex flex-col justify-between gap-3 border-t border-white/15 pt-6 text-center text-xs leading-relaxed text-white/55 sm:flex-row sm:text-left"><p>© {new Date().getFullYear()} <strong className="font-semibold text-white/80">Carplus Pneus &amp; Oficina Mecânica.</strong><br />Todos os direitos reservados.</p><p>CNPJ: 22.845.891/0001-08<br />Portão, Curitiba / PR</p></div>
      </div>
      <SupremaCredit />
    </footer>
  );
}

export function SupremaCredit() {
  return <div className="mx-auto mt-7 flex max-w-7xl items-center justify-center px-5 text-center text-xs leading-relaxed text-white/55"><p className="flex flex-wrap items-center justify-center gap-1.5"><span>Desenvolvido com</span><Heart size={13} className="fill-[#f59c00] text-[#f59c00]" role="img" aria-label="amor" /><span>por</span><a id="developer-suprema-link" href="https://supremasite.com.br" target="_blank" rel="noopener noreferrer" className={`inline-flex min-h-12 items-center font-semibold text-white/80 hover:text-[#f59c00] ${focusClass}`}>Suprema Sites Express</a></p></div>;
}
