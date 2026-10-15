import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

export default function LiveWhatsAppChat({ pageKey }: { pageKey?: string }) {
  const phone = '554130827282'; // (41) 3082-7282
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [isHeroActionVisible, setIsHeroActionVisible] = useState(false);

  useEffect(() => {
    const checkMenuState = () => {
      setIsMenuOpen(document.body.classList.contains('mobile-menu-open'));
    };

    checkMenuState();
    const observer = new MutationObserver(checkMenuState);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    const footer = document.querySelector('footer');
    const footerObserver = 'IntersectionObserver' in window && footer
      ? new IntersectionObserver(([entry]) => setIsFooterVisible(entry.isIntersecting)) : null;
    if (footer && footerObserver) footerObserver.observe(footer);
    const heroAction = document.getElementById('hero-whatsapp-btn');
    setIsHeroActionVisible(false);
    const heroObserver = 'IntersectionObserver' in window && heroAction
      ? new IntersectionObserver(([entry]) => setIsHeroActionVisible(entry.isIntersecting)) : null;
    if (heroAction && heroObserver) heroObserver.observe(heroAction);
    return () => { observer.disconnect(); footerObserver?.disconnect(); heroObserver?.disconnect(); };
  }, [pageKey]);

  if (isMenuOpen || isFooterVisible || isHeroActionVisible) return null;

  const defaultUrl = typeof window !== 'undefined'
    ? `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(`Olá, Carplus! Quero um orçamento de pneus ou serviços. Vim da página: ${window.location.origin}${window.location.pathname}`)}`
    : `https://api.whatsapp.com/send?phone=${phone}`;

  return (
    <div className="fixed bottom-5 right-4 sm:right-6 z-50 font-sans" id="live-whatsapp-chat">
      <a
        href={defaultUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-cta-location="flutuante"
        data-analytics-url="https://api.whatsapp.com/send?phone=554130827282"
        className="flex items-center justify-center gap-2 w-[54px] h-[54px] sm:w-auto sm:h-[52px] sm:px-5 bg-[#f59c00] text-[#080808] font-bold rounded-full shadow-2xl transition-transform duration-200 hover:-translate-y-1 border-2 border-[#080808] cursor-pointer"
        aria-label="Falar no WhatsApp da Carplus"
        title="Falar no WhatsApp da Carplus"
        id="whatsapp-trigger-btn"
      >
        <MessageCircle className="w-6 h-6 shrink-0" />
        <span className="hidden sm:inline text-[14px] font-bold">Falar no WhatsApp</span>
      </a>
    </div>
  );
}

