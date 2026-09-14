import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function LiveWhatsAppChat() {
  const phone = '554130827282'; // (41) 3082-7282

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
    <div className="fixed bottom-6 right-6 z-50 font-sans" id="live-whatsapp-chat">
      <a
        href={defaultUrl}
        onClick={handleClick}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95 border-2 border-white"
        aria-label="Falar no WhatsApp da Carplus"
        title="Falar no WhatsApp"
        id="whatsapp-trigger-btn"
      >
        <MessageCircle className="w-6 h-6 shrink-0 fill-current" />
      </a>
    </div>
  );
}
