import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

export default function LiveWhatsAppChat() {
  const phone = '554130827282'; // (41) 3082-7282
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const checkMenuState = () => {
      setIsMenuOpen(document.body.classList.contains('mobile-menu-open'));
    };

    checkMenuState();
    const observer = new MutationObserver(checkMenuState);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  if (isMenuOpen) return null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://www.carpluscwb.com.br/';
    const message = `Olá Carplus! Gostaria de informações sobre pneus e serviços. Vim da página: ${currentUrl}`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const defaultUrl = typeof window !== 'undefined'
    ? `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(`Olá Carplus! Gostaria de informações sobre pneus e serviços. Vim da página: ${window.location.href}`)}`
    : `https://api.whatsapp.com/send?phone=${phone}`;

  return (
    <div className="fixed bottom-5 right-4 sm:right-6 z-50 font-sans" id="live-whatsapp-chat">
      <a
        href={defaultUrl}
        onClick={handleClick}
        target="_blank"
        rel="noopener noreferrer"
        data-cta-location="flutuante"
        className="flex items-center justify-center gap-2 w-[52px] h-[52px] sm:w-auto sm:h-[48px] sm:px-4 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-full shadow-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 border-2 border-white cursor-pointer"
        aria-label="Falar no WhatsApp da Carplus"
        title="Falar no WhatsApp da Carplus"
        id="whatsapp-trigger-btn"
      >
        <MessageCircle className="w-6 h-6 shrink-0 fill-current text-white" />
        <span className="hidden sm:inline text-[15px] tracking-wide font-extrabold">WhatsApp</span>
      </a>
    </div>
  );
}

