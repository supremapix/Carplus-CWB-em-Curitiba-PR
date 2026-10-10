import React, { useState, useEffect } from 'react';
import { Share2, Check } from 'lucide-react';

interface FloatingShareProps {
  currentView?: string;
  seoTarget?: any;
  selectedTire?: any;
}

export default function FloatingShare({ currentView, seoTarget, selectedTire }: FloatingShareProps) {
  const [copied, setCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const checkMenu = () => {
      setIsMenuOpen(document.body.classList.contains('mobile-menu-open'));
    };
    const observer = new MutationObserver(checkMenu);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: 'Carplus Pneus e Oficina - Portão Curitiba',
      text: 'Confira as melhores ofertas de pneus e serviços automotivos na Carplus Portão Curitiba!',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (err) {}
    }
  };

  if (isMenuOpen) return null;

  return (
    <div 
      className="fixed bottom-5 left-4 sm:left-6 z-40 select-none font-sans" 
      id="floating-share-btn"
    >
      <div className="relative">
        <button
          onClick={handleShare}
          aria-label="Compartilhar esta página"
          title="Compartilhar link da página"
          data-cta-location="flutuante"
          className="w-[48px] h-[48px] rounded-full bg-[#F5A623] hover:bg-amber-400 active:scale-95 text-zinc-950 flex items-center justify-center shadow-xl transition-all duration-200 cursor-pointer border-2 border-white"
        >
          {copied ? (
            <Check className="w-5 h-5 stroke-[3] text-black" />
          ) : (
            <Share2 className="w-5 h-5 stroke-[2.5] text-black" />
          )}
        </button>

        {copied && (
          <div className="absolute left-16 bottom-2 bg-zinc-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap animate-fade-in border border-zinc-700">
            Link copiado!
          </div>
        )}
      </div>
    </div>
  );
}
