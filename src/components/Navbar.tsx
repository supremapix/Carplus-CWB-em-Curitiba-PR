import React, { useState, useEffect } from 'react';
import { Phone, ShoppingCart, Menu, X, MapPin, MessageSquare, Compass, Home, Disc, HelpCircle, Wrench, Info, Mail } from 'lucide-react';

interface NavbarProps {
  onScrollToSection: (sectionId: string) => void;
  cartCount: number;
  onOpenCart: () => void;
}

export default function Navbar({ onScrollToSection, cartCount, onOpenCart }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Lock background scroll and set mobile-menu-open class when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.style.overflow = 'auto';
      document.body.classList.remove('mobile-menu-open');
    }
    return () => {
      document.body.style.overflow = 'auto';
      document.body.classList.remove('mobile-menu-open');
    };
  }, [isMobileMenuOpen]);

  // Handle ESC key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  const formatWhatsApp = (text: string) => {
    return `https://api.whatsapp.com/send?phone=554130827282&text=${encodeURIComponent(text)}`;
  };

  const navLinks = [
    { label: 'Início', id: 'home' },
    { label: 'Catálogo', id: 'catalogo-pneus' },
    { label: 'Ofertas', id: 'catalog' },
    { label: 'Serviços', id: 'alinhamento-3d-curitiba' },
    { label: 'Quem Somos', id: 'quem-somos' },
    { label: 'Blog', id: 'blog' },
    { label: 'Contato', id: 'contato' }
  ];

  const handleMobileNav = (sectionId: string) => {
    onScrollToSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-black max-w-full overflow-x-hidden" id="main-header">
      {/* Top Bar - Clean single centered phone link on mobile, Address + Phone on desktop */}
      <div className="bg-zinc-900 text-zinc-300 py-1.5 px-4 border-b border-zinc-800 text-sm w-full overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-center sm:justify-between gap-4">
          <div className="hidden sm:flex items-center gap-2 truncate min-w-0">
            <MapPin className="w-4 h-4 text-[#F5A623] shrink-0" />
            <span className="truncate">Av. Pres. Arthur Bernardes, 1323 - Portão, Curitiba</span>
          </div>
          <a 
            href="tel:554130827282"
            data-cta-location="header"
            className="flex items-center justify-center gap-2 font-bold text-[#F5A623] hover:text-amber-300 transition shrink-0 min-h-[44px] px-2 text-center"
          >
            <Phone className="w-4 h-4 shrink-0" />
            <span>(41) 3082-7282</span>
          </a>
        </div>
      </div>

      {/* Main navigation header */}
      <nav className="bg-black text-white py-3 px-3 sm:px-6 shadow-md border-b border-zinc-800 relative z-40 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 w-full min-w-0">
          {/* Brand Logo */}
          <a 
            href="/" 
            onClick={(e) => {
              e.preventDefault();
              onScrollToSection('home');
            }} 
            className="cursor-pointer shrink min-w-0 flex items-center min-h-[48px]"
          >
            <img
              src="/images/logos/logo-horizontal.svg"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = 'https://img.carplusautos.com.br/cwb/logo-horizontal.svg';
              }}
              alt="Carplus Pneus e Oficina Mecânica"
              className="h-8 sm:h-11 w-auto max-w-[170px] sm:max-w-none object-contain shrink-0"
            />
          </a>

          {/* Core Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 shrink-0">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => onScrollToSection(link.id)}
                className="text-base font-semibold text-zinc-200 hover:text-[#F5A623] py-2 transition duration-150 cursor-pointer whitespace-nowrap min-h-[48px] flex items-center"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop Right CTA / Shopping Cart Button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={onOpenCart}
              className="hidden sm:flex bg-[#F5A623] hover:bg-amber-400 text-zinc-950 font-bold px-4 py-2.5 rounded-xl items-center gap-2 shadow-sm transition shrink-0 min-h-[48px] cursor-pointer"
              id="header-cart-btn"
            >
              <ShoppingCart className="w-5 h-5 shrink-0" />
              <span className="text-sm font-extrabold">Carrinho</span>
              {cartCount > 0 && (
                <span className="bg-black text-[#F5A623] text-xs font-black px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Header Menu Toggle Button (Requirement 1 & 3: Icon + Written "Menu", min 48x48px, fully visible) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 text-white bg-zinc-800 hover:bg-zinc-700 cursor-pointer rounded-xl font-bold text-base min-w-[48px] min-h-[48px] transition shrink-0 border border-zinc-700 active:scale-95"
              id="mobile-menu-toggle"
              aria-label="Abrir Menu de Navegação"
            >
              <Menu className="w-5 h-5 text-[#F5A623] shrink-0" />
              <span className="text-white font-extrabold text-base tracking-wide">Menu</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Fullscreen Overlay (Requirement 3: Clean 6 items without numbers, Fechar visible, no Carrinho item) */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-black text-white flex flex-col justify-between p-4 sm:p-5 overflow-y-auto w-full max-w-full"
          id="mobile-navigation-links"
          role="dialog"
          aria-modal="true"
        >
          {/* Top Bar: Logo & Written "Fechar ✕" Button */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800 w-full gap-2 shrink-0">
            <img
              src="/images/logos/logo-horizontal.svg"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = 'https://img.carplusautos.com.br/cwb/logo-horizontal.svg';
              }}
              alt="Carplus Pneus"
              className="h-8 sm:h-9 w-auto max-w-[160px] object-contain shrink-0"
            />
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-base rounded-xl min-h-[48px] min-w-[48px] cursor-pointer border border-zinc-700 transition shrink-0"
              aria-label="Fechar Menu"
            >
              <span>Fechar</span>
              <X className="w-5 h-5 text-[#F5A623] shrink-0" />
            </button>
          </div>

          {/* Clean 6-item Vertical Navigation List (Requirement 3: Início · Pneus (catálogo) · Qual pneu serve no meu carro? · Serviços e Alinhamento · Sobre · Contato) */}
          <div className="py-4 my-auto space-y-1 w-full">
            <button
              onClick={() => handleMobileNav('home')}
              className="w-full h-[64px] min-h-[64px] flex items-center gap-4 px-2 border-b border-zinc-800 text-left active:bg-zinc-900 transition cursor-pointer"
            >
              <Home className="w-6 h-6 text-[#F5A623] shrink-0" />
              <span className="text-[20px] font-bold text-white tracking-tight">Início</span>
            </button>

            <button
              onClick={() => handleMobileNav('catalogo-pneus')}
              className="w-full h-[64px] min-h-[64px] flex items-center gap-4 px-2 border-b border-zinc-800 text-left active:bg-zinc-900 transition cursor-pointer"
            >
              <Disc className="w-6 h-6 text-[#F5A623] shrink-0" />
              <span className="text-[20px] font-bold text-white tracking-tight">Pneus (catálogo)</span>
            </button>

            <button
              onClick={() => handleMobileNav('finder')}
              className="w-full h-[64px] min-h-[64px] flex items-center gap-4 px-2 border-b border-zinc-800 text-left active:bg-zinc-900 transition cursor-pointer"
            >
              <HelpCircle className="w-6 h-6 text-[#F5A623] shrink-0" />
              <span className="text-[20px] font-bold text-white tracking-tight">Qual pneu serve no meu carro?</span>
            </button>

            <button
              onClick={() => handleMobileNav('alinhamento-3d-curitiba')}
              className="w-full h-[64px] min-h-[64px] flex items-center gap-4 px-2 border-b border-zinc-800 text-left active:bg-zinc-900 transition cursor-pointer"
            >
              <Wrench className="w-6 h-6 text-[#F5A623] shrink-0" />
              <span className="text-[20px] font-bold text-white tracking-tight">Serviços e Alinhamento</span>
            </button>

            <button
              onClick={() => handleMobileNav('quem-somos')}
              className="w-full h-[64px] min-h-[64px] flex items-center gap-4 px-2 border-b border-zinc-800 text-left active:bg-zinc-900 transition cursor-pointer"
            >
              <Info className="w-6 h-6 text-[#F5A623] shrink-0" />
              <span className="text-[20px] font-bold text-white tracking-tight">Sobre</span>
            </button>

            <button
              onClick={() => handleMobileNav('contato')}
              className="w-full h-[64px] min-h-[64px] flex items-center gap-4 px-2 border-b border-zinc-800 text-left active:bg-zinc-900 transition cursor-pointer"
            >
              <Mail className="w-6 h-6 text-[#F5A623] shrink-0" />
              <span className="text-[20px] font-bold text-white tracking-tight">Contato</span>
            </button>
          </div>

          {/* Bottom Action Area: 2 Large 56px Action Buttons + Simple Address */}
          <div className="pt-4 border-t border-zinc-800 space-y-3 w-full shrink-0">
            <a
              href="tel:554130827282"
              data-cta-location="header"
              className="w-full h-[56px] min-h-[56px] bg-[#F5A623] hover:bg-amber-400 text-zinc-950 font-extrabold text-[18px] rounded-xl flex items-center justify-center gap-3 transition cursor-pointer"
            >
              <Phone className="w-6 h-6 shrink-0" />
              <span>Ligar (41) 3082-7282</span>
            </a>

            <a
              href={formatWhatsApp('Olá Carplus! Gostaria de consultar pneus e serviços para o meu carro.')}
              target="_blank"
              rel="noopener noreferrer"
              data-cta-location="header"
              className="w-full h-[56px] min-h-[56px] bg-[#25D366] hover:bg-emerald-500 text-white font-extrabold text-[18px] rounded-xl flex items-center justify-center gap-3 transition cursor-pointer"
            >
              <MessageSquare className="w-6 h-6 shrink-0 fill-current" />
              <span>Chamar no WhatsApp</span>
            </a>

            {/* Single clean address line with "Ver no mapa" link */}
            <div className="pt-2 text-center text-sm text-zinc-400">
              <span>Av. Pres. Arthur Bernardes, 1323 - Portão, Curitiba</span>
              <a 
                href="https://maps.google.com/?q=Av.+Presid.+Arthur+da+Silva+Bernardes,+1323+-+Portão,+Curitiba+-+PR" 
                target="_blank"
                rel="noopener noreferrer"
                data-cta-location="header"
                className="text-[#F5A623] underline font-bold ml-2 inline-flex items-center gap-1"
              >
                <Compass className="w-4 h-4 inline" />
                <span>Ver no mapa</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

