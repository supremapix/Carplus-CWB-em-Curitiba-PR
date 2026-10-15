import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, MessageSquare, Phone, ShoppingCart, X } from 'lucide-react';

interface NavbarProps {
  onScrollToSection: (sectionId: string) => void;
  cartCount: number;
  onOpenCart: () => void;
}

const primaryLinks = [
  { label: 'Pneus', id: 'catalogo-pneus', href: '/pneus' },
  { label: 'Serviços', id: 'alinhamento-3d-curitiba', href: '/alinhamento-3d-curitiba' },
  { label: 'Sobre a Carplus', id: 'quem-somos', href: '/quem-somos' },
  { label: 'Contato', id: 'contato', href: '/contato' },
];
const moreLinks = [
  { label: 'Início', id: 'home', href: '/' },
  { label: 'Ofertas de pneus', id: 'catalog', href: '/#catalog' },
  { label: 'Qual pneu serve no meu carro?', id: 'finder', href: '/#finder' },
  { label: 'Blog automotivo', id: 'blog', href: '/blog' },
];
const whatsapp = 'https://api.whatsapp.com/send?phone=554130827282&text=Ol%C3%A1%20Carplus!%20Gostaria%20de%20consultar%20pneus%20e%20servi%C3%A7os%20para%20o%20meu%20carro.';
const maps = 'https://maps.google.com/?q=Av.+Presid.+Arthur+da+Silva+Bernardes,+1323+-+Port%C3%A3o,+Curitiba+-+PR';
const focusClass = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f59c00]';

export default function Navbar({ onScrollToSection, cartCount, onOpenCart }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  const closeMenu = (returnFocus = false) => {
    setIsMobileMenuOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  };

  useEffect(() => {
    document.body.classList.toggle('mobile-menu-open', isMobileMenuOpen);
    return () => document.body.classList.remove('mobile-menu-open');
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    panelRef.current?.querySelector<HTMLAnchorElement>('a[href]')?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsMobileMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    const handleOutsideClick = (event: PointerEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) setIsMobileMenuOpen(false);
    };
    const desktop = window.matchMedia('(min-width: 1280px)');
    const handleDesktop = () => { if (desktop.matches) setIsMobileMenuOpen(false); };
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handleOutsideClick);
    desktop.addEventListener('change', handleDesktop);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handleOutsideClick);
      desktop.removeEventListener('change', handleDesktop);
    };
  }, [isMobileMenuOpen]);

  const navigate = (event: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    closeMenu();
    onScrollToSection(sectionId);
  };

  return (
    <header ref={headerRef} className="carplus-navbar sticky top-0 z-40 w-full border-b border-white/10 bg-[#080808] text-white" id="main-header" data-cta-location="header" onBlur={event => { if (event.relatedTarget instanceof Node && !event.currentTarget.contains(event.relatedTarget)) setIsMobileMenuOpen(false); }}>
      <div className="mx-auto flex min-h-[84px] max-w-7xl items-center justify-between gap-3 px-4 sm:gap-5 sm:px-6 xl:min-h-[92px]">
        <a href="/" onClick={event => navigate(event, 'home')} aria-label="Carplus Pneus — início" className={`flex min-h-12 min-w-0 shrink-0 items-center ${focusClass}`}>
          <img src="/images/logos/logo-horizontal.svg" onError={event => { if (event.currentTarget.getAttribute('src') !== '/logo-horizontal.svg') event.currentTarget.src = '/logo-horizontal.svg'; }} alt="Carplus Pneus e Oficina Mecânica" width="300" height="43" loading="eager" className="h-auto w-[210px] max-w-[calc(100vw-140px)] object-contain sm:w-[235px] xl:w-[245px]" />
        </a>
        <nav aria-label="Navegação principal" className="hidden items-center gap-1 xl:flex">
          {primaryLinks.map(link => <a key={link.id} href={link.href} onClick={event => navigate(event, link.id)} className={`inline-flex min-h-12 items-center whitespace-nowrap px-3 text-[15px] font-semibold text-white/80 transition-colors hover:text-[#f59c00] ${focusClass}`}>{link.label}</a>)}
        </nav>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <a href="tel:554130827282" data-cta-location="header" aria-label="Ligar para a Carplus: (41) 3082-7282" className={`hidden min-h-12 items-center justify-center gap-2 px-2 text-sm font-semibold text-white/85 transition-colors hover:text-[#f59c00] md:inline-flex ${focusClass}`}><Phone className="h-5 w-5 shrink-0 text-[#f59c00]" aria-hidden="true" /><span className="hidden 2xl:inline">(41) 3082-7282</span></a>
          <button type="button" onClick={onOpenCart} id="header-cart-btn" aria-label={`Abrir carrinho${cartCount > 0 ? `, ${cartCount} ${cartCount === 1 ? 'item' : 'itens'}` : ''}`} className={`relative hidden min-h-12 min-w-12 items-center justify-center rounded-sm border border-white/20 text-white transition-colors hover:border-[#f59c00] hover:text-[#f59c00] sm:inline-flex ${focusClass}`}><ShoppingCart className="h-5 w-5" aria-hidden="true" />{cartCount > 0 && <span className="absolute -right-2 -top-2 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#f59c00] px-1 text-xs font-bold text-[#080808]" aria-hidden="true">{cartCount}</span>}</button>
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" data-cta-location="header" className={`hidden min-h-12 items-center justify-center gap-2 rounded-sm bg-[#f59c00] px-4 text-sm font-bold text-[#080808] transition-shadow hover:shadow-[0_0_0_3px_#f59c0033] xl:inline-flex ${focusClass}`}><MessageSquare className="h-5 w-5 shrink-0" aria-hidden="true" />Pedir orçamento no WhatsApp</a>
          <button ref={toggleRef} type="button" onClick={() => setIsMobileMenuOpen(open => !open)} id="mobile-menu-toggle" aria-controls="mobile-navigation-links" aria-expanded={isMobileMenuOpen} aria-label={isMobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'} className={`inline-flex min-h-12 min-w-[84px] items-center justify-center gap-2 rounded-sm border border-[#f59c00] px-3 text-[15px] font-bold text-[#f59c00] transition-colors hover:bg-[#f59c00] hover:text-[#080808] xl:hidden ${focusClass}`}>{isMobileMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}<span>{isMobileMenuOpen ? 'Fechar' : 'Menu'}</span></button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div ref={panelRef} id="mobile-navigation-links" className="max-h-[calc(100dvh-85px)] overflow-y-auto overscroll-contain border-t border-white/15 bg-[#080808] px-5 pb-6 pt-4 shadow-2xl sm:px-6 xl:hidden">
          <nav aria-label="Navegação móvel" className="mx-auto max-w-3xl">
            <div className="grid gap-0 sm:grid-cols-2 sm:gap-x-7">{primaryLinks.map(link => <a key={link.id} href={link.href} onClick={event => navigate(event, link.id)} className={`flex min-h-14 items-center justify-between gap-4 border-b border-white/15 py-3 text-lg font-semibold text-white hover:text-[#f59c00] ${focusClass}`}>{link.label}<ArrowUpRight className="h-5 w-5 text-[#f59c00]" aria-hidden="true" /></a>)}</div>
            <div className="mt-4 grid sm:grid-cols-2 sm:gap-x-7">{moreLinks.map(link => <a key={link.id} href={link.href} onClick={event => navigate(event, link.id)} className={`flex min-h-12 items-center py-2 text-[15px] text-white/75 hover:text-[#f59c00] ${focusClass}`}>{link.label}</a>)}<button type="button" onClick={() => { closeMenu(); onOpenCart(); }} className={`flex min-h-12 items-center gap-2 py-2 text-left text-[15px] text-white/75 hover:text-[#f59c00] ${focusClass}`}><ShoppingCart className="h-4 w-4" aria-hidden="true" />Carrinho{cartCount > 0 ? ` (${cartCount})` : ''}</button></div>
            <div className="mt-5 grid gap-3 border-t border-white/15 pt-5 sm:grid-cols-2"><a href={whatsapp} target="_blank" rel="noopener noreferrer" data-cta-location="header" className={`flex min-h-14 items-center justify-center gap-3 rounded-sm bg-[#f59c00] px-4 py-3 text-center text-base font-bold text-[#080808] ${focusClass}`}><MessageSquare className="h-5 w-5 shrink-0" aria-hidden="true" />Pedir orçamento no WhatsApp</a><a href="tel:554130827282" data-cta-location="header" className={`flex min-h-14 items-center justify-center gap-3 rounded-sm border border-white/30 px-4 py-3 text-base font-semibold text-white ${focusClass}`}><Phone className="h-5 w-5 shrink-0 text-[#f59c00]" aria-hidden="true" />(41) 3082-7282</a></div>
            <a href={maps} target="_blank" rel="noopener noreferrer" data-cta-location="header" className={`mt-3 flex min-h-12 items-center justify-between gap-3 py-3 text-sm text-white/65 hover:text-[#f59c00] ${focusClass}`}><span>Av. Pres. Arthur Bernardes, 1323 · Portão, Curitiba</span><ArrowUpRight className="h-4 w-4 shrink-0 text-[#f59c00]" aria-hidden="true" /></a>
          </nav>
        </div>
      )}
    </header>
  );
}
