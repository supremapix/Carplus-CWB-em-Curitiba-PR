import React, { useState, useEffect } from 'react';
import { Share2, Check, X, MessageSquare, Facebook, Linkedin, Twitter, Copy, ExternalLink, Sparkles } from 'lucide-react';

interface FloatingShareProps {
  currentView?: string;
  seoTarget?: any;
  selectedTire?: any;
}

export default function FloatingShare({ currentView, seoTarget, selectedTire }: FloatingShareProps) {
  const [isOpen, setIsOpen] = useState(false);
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

  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://www.carpluspneuseoficina.com.br';
  const shareTitle = selectedTire 
    ? `Pneu ${selectedTire.brand} ${selectedTire.model} (${selectedTire.width}/${selectedTire.aspectRatio} R${selectedTire.rim}) | Carplus Curitiba`
    : seoTarget?.title || 'Carplus Pneus e Oficina Mecânica | Curitiba Portão';
  const shareDesc = selectedTire
    ? `Com instalação especializada, alinhamento e balanceamento inclusos em Curitiba. Confira!`
    : 'Especialistas em pneus novos, importados, nacionais e mecânica full service no Portão, Curitiba.';
  
  // NEVER use logo as share preview image per user request ("a imagem do botao compartilhar nao pode ser a logo")
  const shareImage = selectedTire?.image || selectedTire?.imagem || selectedTire?.imagemGrande || 'https://www.carpluspneuseoficina.com.br/images/galeria/pneus-auto-center.jpg';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      // fallback
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareDesc,
          url: shareUrl,
        });
        setIsOpen(false);
      } catch (err) {
        // cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  if (isMenuOpen) return null;

  return (
    <div 
      className="fixed bottom-5 left-4 sm:left-6 z-50 font-sans select-none" 
      id="floating-share-btn"
    >
      {/* Expanded Share Card Modal/Popover */}
      {isOpen && (
        <div className="absolute bottom-16 left-0 w-[320px] sm:w-[370px] bg-white border-2 border-[#f49e1a] rounded-3xl shadow-2xl p-4 sm:p-5 animate-fade-in z-50 text-zinc-900">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-[#f49e1a]">
                <Share2 className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-zinc-950">Compartilhar Carplus</h4>
                <p className="text-[10px] text-zinc-500">Divulgue esta página nas redes</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-700 transition-colors cursor-pointer"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Preview Card with Image & Text */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-3 mb-4 flex items-center gap-3">
            <div className="w-14 h-14 shrink-0 rounded-xl bg-white border border-zinc-200 overflow-hidden flex items-center justify-center p-1 shadow-inner">
              <img 
                src={shareImage} 
                alt="Preview" 
                className="w-full h-full object-cover rounded-lg" 
                onError={(e)=>{ (e.target as HTMLImageElement).src = 'https://www.carpluspneuseoficina.com.br/og-carplus.webp'; }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1 text-[9px] font-black uppercase text-[#f49e1a] tracking-wider mb-0.5">
                <Sparkles className="w-3 h-3" />
                <span>Carplus Curitiba</span>
              </div>
              <p className="text-xs font-bold text-zinc-900 line-clamp-1">{shareTitle}</p>
              <p className="text-[10px] text-zinc-600 line-clamp-2 mt-0.5">{shareDesc}</p>
            </div>
          </div>

          {/* Share Action Buttons */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            {/* WhatsApp */}
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareTitle} - ${shareDesc} Acesse: ${shareUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              data-cta-location="flutuante"
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-[10px] font-black uppercase tracking-wider rounded-xl bg-green-500 hover:bg-green-600 text-white transition-all shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5 shrink-0" />
              <span>WhatsApp</span>
            </a>

            {/* Facebook */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              data-cta-location="flutuante"
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-[10px] font-black uppercase tracking-wider rounded-xl bg-[#1877F2] hover:bg-[#1877F2]/90 text-white transition-all shadow-sm"
            >
              <Facebook className="w-3.5 h-3.5 shrink-0" />
              <span>Facebook</span>
            </a>

            {/* Twitter / X */}
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
              target="_blank"
              rel="noopener noreferrer"
              data-cta-location="flutuante"
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-[10px] font-black uppercase tracking-wider rounded-xl bg-black hover:bg-neutral-800 text-white transition-all shadow-sm"
            >
              <Twitter className="w-3.5 h-3.5 shrink-0" />
              <span>Twitter / X</span>
            </a>

            {/* LinkedIn */}
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              data-cta-location="flutuante"
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-[10px] font-black uppercase tracking-wider rounded-xl bg-[#0a66c2] hover:bg-[#0a66c2]/90 text-white transition-all shadow-sm"
            >
              <Linkedin className="w-3.5 h-3.5 shrink-0" />
              <span>LinkedIn</span>
            </a>

            {/* Pinterest */}
            <a
              href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(shareImage)}&description=${encodeURIComponent(shareTitle)}`}
              target="_blank"
              rel="noopener noreferrer"
              data-cta-location="flutuante"
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-[10px] font-black uppercase tracking-wider rounded-xl bg-[#E60023] hover:bg-[#E60023]/90 text-white transition-all shadow-sm"
            >
              <svg className="w-3.5 h-3.5 shrink-0 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.399.165-1.491-.693-2.424-2.875-2.424-4.626 0-3.769 2.739-7.237 7.892-7.237 4.144 0 7.365 2.955 7.365 6.909 0 4.122-2.604 7.44-6.216 7.44-1.213 0-2.354-.63-2.744-1.379l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
              </svg>
              <span>Pinterest</span>
            </a>

            {/* Threads */}
            <a
              href={`https://threads.net/intent/post?text=${encodeURIComponent(`${shareTitle} - ${shareUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              data-cta-location="flutuante"
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-[10px] font-black uppercase tracking-wider rounded-xl bg-zinc-900 hover:bg-black text-white transition-all shadow-sm border border-zinc-700"
            >
              <svg className="w-3.5 h-3.5 shrink-0 fill-current" viewBox="0 0 24 24">
                <path d="M12.186 24h-.007c-3.582-.025-6.314-1.183-8.125-3.447C2.42 18.52 1.5 15.65 1.5 12.003c0-3.648.92-6.52 2.554-8.553C5.865 1.187 8.597.025 12.179 0h.014c3.415.023 6.021 1.054 7.761 3.064 1.636 1.88 2.474 4.549 2.492 7.933l.004.341v.373c0 3.385-.856 6.054-2.492 7.933-1.74 2.01-4.346 3.041-7.768 3.064zm-.007-2.15c2.909-.02 5.127-.88 6.586-2.559 1.396-1.605 2.106-3.923 2.106-6.892 0-2.969-.71-5.287-2.106-6.892-1.459-1.68-3.677-2.54-6.586-2.56h-.014c-2.909.02-5.127.88-6.586 2.56-1.396 1.605-2.106 3.923-2.106 6.892 0 2.969.71 5.287 2.106 6.892 1.459 1.679 3.677 2.539 6.586 2.559h.014zm5.02-9.852c-.225 1.14-.945 2.01-2.14 2.593-1.02.5-2.25.683-3.664.545-1.25-.123-2.29-.623-2.996-1.442-.656-.757-.998-1.755-.998-2.887 0-1.272.39-2.317 1.127-3.024.767-.735 1.803-1.12 3.003-1.12 1.325 0 2.413.435 3.23 1.295.738.775 1.161 1.848 1.248 3.053zm-2.095-.084c-.062-.832-.34-1.503-.826-1.996-.453-.46-1.082-.702-1.869-.702-.756 0-1.37.228-1.825.679-.474.47-.723 1.157-.723 2.04 0 .805.216 1.457.643 1.942.443.51 1.087.79 1.916.837.747.042 1.36-.145 1.776-.541.449-.425.688-1.096.908-2.257z"/>
              </svg>
              <span>Threads</span>
            </a>
          </div>

          {/* Copy Link & Native Share */}
          <div className="flex gap-2">
            <button
              onClick={handleCopyLink}
              data-cta-location="flutuante"
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all border cursor-pointer ${
                copied 
                  ? 'bg-amber-400 border-black text-black' 
                  : 'bg-zinc-100 hover:bg-zinc-200 border-zinc-300 text-zinc-900'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copiado!' : 'Copiar Link'}</span>
            </button>

            {typeof navigator !== 'undefined' && (navigator as any).share && (
              <button
                onClick={handleNativeShare}
                data-cta-location="flutuante"
                className="flex items-center justify-center gap-1 px-3 py-2.5 text-[10px] font-black uppercase tracking-wider rounded-xl bg-[#f49e1a] hover:bg-amber-400 text-zinc-950 border border-amber-500 transition-all cursor-pointer shadow-sm"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Mais...</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Compartilhar esta página"
          title="Compartilhar link da página"
          data-cta-location="flutuante"
          className="w-[52px] h-[52px] rounded-full bg-[#f49e1a] hover:bg-amber-400 active:scale-95 text-zinc-950 flex items-center justify-center shadow-2xl transition-all duration-200 cursor-pointer border-3 border-white ring-4 ring-amber-400/30"
        >
          {isOpen ? (
            <X className="w-6 h-6 stroke-[3] text-black" />
          ) : (
            <Share2 className="w-6 h-6 stroke-[2.5] text-black animate-bounce" />
          )}
        </button>

        {!isOpen && (
          <span className="absolute -top-2 -right-2 bg-zinc-900 text-amber-400 text-[9px] font-black px-2 py-0.5 rounded-full uppercase border border-amber-400/50 shadow-md">
            Compartilhar
          </span>
        )}
      </div>
    </div>
  );
}
