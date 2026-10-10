import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const checkMenu = () => {
      setIsMenuOpen(document.body.classList.contains('mobile-menu-open'));
    };
    const observer = new MutationObserver(checkMenu);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!visible || isMenuOpen) return null;

  return (
    <button
      onClick={scrollToTop}
      id="scroll-to-top-btn"
      aria-label="Voltar ao topo da página"
      title="Voltar ao topo"
      data-cta-location="flutuante"
      className="fixed bottom-[76px] right-5 sm:right-7 z-40 w-10 h-10 rounded-full bg-zinc-900/95 hover:bg-black text-[#F5A623] hover:text-white border border-zinc-700 shadow-xl flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 hover:scale-105"
    >
      <ArrowUp className="w-5 h-5 stroke-[2.5]" />
    </button>
  );
}
