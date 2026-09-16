import React, { useState, useMemo } from 'react';
import { Share2, X, Link2, Check, ChevronLeft, ChevronRight, Camera, ExternalLink } from 'lucide-react';
import { toSlug } from '../utils/slugify';

// 100% Fotos reais da loja física, recepção, showroom e oficina técnica Carplus no Portão Curitiba
export const REAL_SITE_GALLERY = [
  {
    title: "Fachada & Recepção Carplus Portão",
    url: "/images/galeria/fachada-carplus.webp",
    remoteUrl: "https://img.carplusautos.com.br/cwb/fachada-carplus.webp",
    category: "Fachada Oficial"
  },
  {
    title: "Showroom de Pneus Novos & Pirelli",
    url: "/images/galeria/loja-de-pneus-em-curitiba.webp",
    remoteUrl: "https://img.carplusautos.com.br/cwb/loja-de-pneus-em-curitiba.webp",
    category: "Showroom"
  },
  {
    title: "Auto Center Pneus no Portão",
    url: "/images/galeria/auto-center-pneus-portao.jpg",
    remoteUrl: "https://img.carplusautos.com.br/cwb/auto-center-pneus-portao.jpg",
    category: "Oficina Própria"
  },
  {
    title: "Alinhamento 3D Computadorizado Laser",
    url: "/images/galeria/alinhamento.jpg",
    remoteUrl: "https://img.carplusautos.com.br/cwb/alinhamento.jpg",
    category: "Geometria 3D"
  },
  {
    title: "Nossa Equipe de Técnicos Habilitados",
    url: "/images/galeria/tecnicos.jpg",
    remoteUrl: "https://img.carplusautos.com.br/cwb/tecnicos.jpg",
    category: "Equipe Técnica"
  },
  {
    title: "Troca de Pneus de Alta Performance",
    url: "/images/galeria/troca-de-pneus.jpg",
    remoteUrl: "https://img.carplusautos.com.br/cwb/troca-de-pneus.jpg",
    category: "Borracharia Avançada"
  },
  {
    title: "Rampa de Geometria e Freios",
    url: "/images/galeria/rampa-de-geometria.jpg",
    remoteUrl: "https://img.carplusautos.com.br/cwb/rampa-de-geometria.jpg",
    category: "Rampa 3D"
  },
  {
    title: "Montagem Técnica com Válvula/Bico Grátis",
    url: "/images/galeria/montagem-tecnica.jpg",
    remoteUrl: "https://img.carplusautos.com.br/cwb/montagem-tecnica.jpg",
    category: "Montagem Técnica"
  },
  {
    title: "Cuidado na Troca de Rodas de Liga Leve",
    url: "/images/galeria/rodas-de-liga-leve.webp",
    remoteUrl: "https://img.carplusautos.com.br/cwb/rodas-de-liga-leve.webp",
    category: "Rodas de Liga Leve"
  },
  {
    title: "Mostruário Especial de Pneus Novos",
    url: "/images/galeria/mostruario-pneus-novos.webp",
    remoteUrl: "https://img.carplusautos.com.br/cwb/mostruario-pneus-novos.webp",
    category: "Estoque Físico"
  },
  {
    title: "Exposição e Estoque Próprio de Pneus",
    url: "/images/galeria/show-row-pneus.webp",
    remoteUrl: "https://img.carplusautos.com.br/cwb/show-row-pneus.webp",
    category: "Estoque Próprio"
  },
  {
    title: "Recepção e Espera Climatizada",
    url: "/images/galeria/recepcao.jpg",
    remoteUrl: "https://img.carplusautos.com.br/cwb/recepcao.jpg",
    category: "Atendimento"
  },
  {
    title: "Serviço Especial para Camionetes e SUVs",
    url: "/images/galeria/caminhonete-suv.jpg",
    remoteUrl: "https://img.carplusautos.com.br/cwb/caminhonete-suv.jpg",
    category: "SUVs & Pickups"
  },
  {
    title: "Consultoria e Avaliação Estrutural",
    url: "/images/galeria/consultoria-avaliacao-estrutural.jpg",
    remoteUrl: "https://img.carplusautos.com.br/cwb/consultoria-avaliacao-estrutural.jpg",
    category: "Diagnóstico Preventivo"
  },
  {
    title: "Auto Center de Pneus em Curitiba",
    url: "/images/galeria/auto-center-de-pneus-em-curitiba.jpg",
    remoteUrl: "https://img.carplusautos.com.br/cwb/auto-center-de-pneus-em-curitiba.jpg",
    category: "Centro Automotivo"
  },
  {
    title: "Pneus e Serviços Auto Center",
    url: "/images/galeria/pneus-auto-center.jpg",
    remoteUrl: "https://img.carplusautos.com.br/cwb/pneus-auto-center.jpg",
    category: "Pneus & Serviços"
  },
  {
    title: "Vistoria e Alinhamento Técnico de Suspensão",
    url: "/images/quemsomos/vistoria-alinhamento.jpg",
    remoteUrl: "https://img.carplusautos.com.br/cwb/vistoria-alinhamento.jpg",
    category: "Inspeção Suspensão"
  },
  {
    title: "Amplo Elevador Automotivo de Alta Capacidade",
    url: "/images/quemsomos/amplo-elevador.png",
    remoteUrl: "https://img.carplusautos.com.br/cwb/amplo-elevador.png",
    category: "Elevador Automotivo"
  },
  {
    title: "Acabamento Seguro e Cuidado com as Rodas",
    url: "/images/quemsomos/acabamento-seguro.png",
    remoteUrl: "https://img.carplusautos.com.br/cwb/acabamento-seguro.png",
    category: "Torquímetro & Cuidado"
  },
  {
    title: "Check-up de Motores & Fluidos Auto Center",
    url: "/images/quemsomos/check-up-motores-fluidos-auto-center.png",
    remoteUrl: "https://img.carplusautos.com.br/cwb/check-up-motores-fluidos-auto-center.png",
    category: "Check-up Preventivo"
  },
  {
    title: "Alinhamento Computadorizado Tridimensional Laser",
    url: "/images/quemsomos/alinhamento-computadorizado-tridmencional.png",
    remoteUrl: "https://img.carplusautos.com.br/cwb/alinhamento-computadorizado-tridmencional.png",
    category: "Tecnologia 3D"
  }
];

interface FloatingShareProps {
  currentView: string;
  seoTarget?: any;
  selectedTire?: any;
}

export default function FloatingShare({ currentView, seoTarget, selectedTire }: FloatingShareProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  // Lista dinâmica: somente imagens reais do site/loja física Carplus e, se houver pneu selecionado, a foto real do pneu
  const galleryList = useMemo(() => {
    if (selectedTire && (selectedTire.image || selectedTire.imagem)) {
      const tireImg = selectedTire.image || selectedTire.imagem;
      const tireItem = {
        title: `Pneu ${selectedTire.brand} ${selectedTire.model} (${selectedTire.medida || `${selectedTire.width}/${selectedTire.aspectRatio} R${selectedTire.rim}`})`,
        url: tireImg,
        remoteUrl: tireImg,
        category: 'Pneu Real do Catálogo'
      };
      return [tireItem, ...REAL_SITE_GALLERY];
    }
    return REAL_SITE_GALLERY;
  }, [selectedTire]);

  const safeImageIndex = imageIndex >= galleryList.length ? 0 : imageIndex;
  const currentPhoto = galleryList[safeImageIndex];

  // Determine share URL and text dynamically
  const getShareInfo = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.carpluscwb.com.br';
    let path = '';
    let title = 'Carplus Pneus e Oficina - Portão Curitiba';
    let desc = 'Encontre pneus novos com o melhor preço de Curitiba, rampa 3D e montagem técnica inclusa com bico grátis!';

    if (currentView === 'pneu-detalhes' && selectedTire) {
      path = `/pneu/${selectedTire.id}`;
      title = `Pneu ${selectedTire.brand.toUpperCase()} ${selectedTire.model.toUpperCase()} na Carplus`;
      desc = `Confira a oferta de Pneu ${selectedTire.brand.toUpperCase()} ${selectedTire.model.toUpperCase()} ${selectedTire.width}/${selectedTire.aspectRatio} R${selectedTire.rim} na Carplus Pneus Portão!`;
    } else if (currentView === 'barao-pneus-e-oficina-bacacheri-curitiba') {
      path = '/barao-pneus-e-oficina-bacacheri-curitiba';
      title = 'Alternativa a Barão Pneus e Oficina Bacacheri Curitiba | Carplus';
      desc = 'Buscando alternativa a Barão Pneus e Oficina Bacacheri no norte de Curitiba? Compare e descubra as vantagens exclusivas e equipamentos 3D da Carplus Portão.';
    } else if (currentView === 'barao-pneus-sao-jose-pinhais') {
      path = '/barao-pneus-sao-jose-pinhais';
      title = 'Conheça Alternativa a Barão Pneus São José Pinhais | Carplus';
      desc = 'Pesquisando Barão Pneus em São José dos Pinhais? Conheça a alternativa de pneus novos na Carplus. Localização de fácil acesso pela rápida do Portão.';
    } else if (currentView === 'barao-pneus-e-oficina-portao') {
      path = '/barao-pneus-e-oficina-portao';
      title = 'Alternativa a Barão Pneus e Oficina Portão | Carplus';
      desc = 'Procurando serviços no Portão semelhantes a Barão Pneus? Conheça a alternativa Carplus Arthur Bernardes para Geometria 3D de alta precisão e bicos grátis.';
    } else if (currentView === 'bana-pneus') {
      path = '/bana-pneus';
      title = 'Alternativa a Bana Pneus Curitiba - Serviços e Preços | Carplus';
      desc = 'Procurando alternativa a Bana Pneus em Curitiba? Conheça diferenciais de qualidade, prazos de garantia de 5 anos e condições exclusivas da Carplus Portão com serviços expressos.';
    } else if (currentView === 'pneus-baratos-em-curitiba') {
      path = '/pneus-baratos-em-curitiba';
      title = 'Pneus Baratos em Curitiba - Preço de Atacado Completo | Carplus';
      desc = 'Procura pneus baratos com preço de atacado e instalação de primeira classe em Curitiba? Veja a tabela de ofertas exclusivas com bicos de ar inclusos na Carplus Portão.';
    } else if (currentView === 'xbri-pneus-curitiba') {
      path = '/xbri-pneus-curitiba';
      title = 'Xbri Pneus Curitiba - Ampla Linha de Medidas e Modelos | Carplus';
      desc = 'Pensou em Pneus Xbri em Curitiba pelo menor valor? Encontre a linha completa para utilitários, vans e SUVs a pronta entrega na Carplus, com instalação expressa na hora.';
    } else if (currentView === 'pneus-pirelli-em-curitiba-melhor-preco') {
      path = '/pneus-pirelli-em-curitiba-melhor-preco';
      title = 'Pneus Pirelli em Curitiba Melhor Preço - Concessionária Completa | Carplus';
      desc = 'Melhor preço garantido em pneus originais Pirelli em Curitiba. Estoque completo Cinturato P1, P7, Scorpion a pronta entrega com bico grátis e geometria 3D computadorizada no Portão.';
    } else if (currentView === 'seo-landing' && seoTarget) {
      const slugName = toSlug(seoTarget.name);
      const prefix = seoTarget.type === 'bairro' ? 'pneus-no-' : 'pneus-em-';
      
      const currentPath = typeof window !== 'undefined' ? window.location.pathname.toLowerCase() : '';
      if (currentPath === `/pneus-no-${slugName}` || currentPath === `/pneus-em-${slugName}`) {
        path = window.location.pathname;
      } else {
        path = `/${prefix}${slugName}`;
      }
      
      title = `Pneus em ${seoTarget.name} - Carplus Pneus`;
      desc = `Buscando pneus em ${seoTarget.name}? Conheça as ofertas especiais, pneus novos com bico grátis e geometria 3D no Portão na Carplus.`;
    } else if (currentView !== 'home') {
      path = `/${currentView}`;
      // Format view name beautifully
      const formattedName = currentView.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      title = `${formattedName} - Carplus Pneus Curitiba`;
    }

    return {
      url: `${origin}${path}`,
      title,
      desc,
      text: `${title} - ${desc}`
    };
  };

  const { url: shareUrl, title: shareTitle, text: shareText } = getShareInfo();
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.carpluscwb.com.br';
  const shareImageAbsolute = currentPhoto.url.startsWith('http') 
    ? currentPhoto.url 
    : `${origin}${currentPhoto.url}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShare = (platform: string) => {
    let href = '';
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);
    const encodedImage = encodeURIComponent(shareImageAbsolute);
    const encodedTitle = encodeURIComponent(shareTitle);

    switch (platform) {
      case 'pinterest':
        href = `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedImage}&description=${encodedText}`;
        break;
      case 'twitter':
        href = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
        break;
      case 'facebook':
        href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'whatsapp':
        href = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'linkedin':
        href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
    }

    if (href) {
      window.open(href, '_blank', 'noopener,noreferrer');
    }
  };

  const nextImage = () => {
    setImageIndex((prev) => (prev === galleryList.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setImageIndex((prev) => (prev === 0 ? galleryList.length - 1 : prev - 1));
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 font-sans" id="floating-share-widget">
      {/* Container holding button and the popover */}
      <div className="relative">
        
        {/* Floating Share Button with alert/pulse effect */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex items-center justify-center bg-[#f49e1a] text-gray-950 p-3.5 sm:p-4 rounded-full shadow-2xl hover:bg-yellow-400 border-2 border-black transition duration-300 transform hover:scale-105 cursor-pointer"
          aria-label="Compartilhar página"
          title="Compartilhar esta página"
          id="share-floating-trigger-btn"
        >
          {/* Animated pulsing outer waves */}
          <span className="absolute inset-0 rounded-full bg-[#f49e1a]/40 animate-ping pointer-events-none"></span>
          
          {/* Internal indicator/alert pulse dot */}
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-950"></span>
          </span>

          <Share2 className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
        </button>

        {/* Share menu panel with 75% dark transparency (backdrop-blur ensures readability) */}
        {isOpen && (
          <div 
            className="absolute bottom-16 left-0 bg-gray-950/85 text-white backdrop-blur-md border border-white/20 p-4 sm:p-5 rounded-2xl w-80 sm:w-96 shadow-2xl transition duration-300 z-50 max-h-[85vh] overflow-y-auto"
            id="share-transparent-popup-menu"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3.5">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-[#f49e1a]" />
                <h4 className="font-extrabold text-sm uppercase tracking-wider text-[#f49e1a]">Compartilhar Página</h4>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-white hover:bg-white/10 p-1 rounded-full transition cursor-pointer"
                id="close-share-popup-btn"
                aria-label="Fechar janela de compartilhamento"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Gallery Image Attachment Selector - APENAS FOTOS REAIS DO SITE/LOJA */}
            <div className="mb-3.5 bg-black/45 border border-white/10 rounded-xl p-2.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-300 uppercase tracking-wider">
                  <Camera className="w-3.5 h-3.5 text-[#f49e1a]" />
                  Fotos Reais da Loja & Oficina:
                </span>
                <span className="text-[10px] font-mono font-bold text-yellow-400 bg-yellow-500/20 px-2 py-0.5 rounded-full border border-yellow-500/30">
                  {safeImageIndex + 1} de {galleryList.length}
                </span>
              </div>

              {/* Main Photo Frame */}
              <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900 group border border-white/10">
                <img 
                  src={currentPhoto.url} 
                  alt={currentPhoto.title}
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (currentPhoto.remoteUrl && target.src !== currentPhoto.remoteUrl) {
                      target.src = currentPhoto.remoteUrl;
                    }
                  }}
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                />
                
                {/* Overlay Badge & Title */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-between p-2.5">
                  <div className="flex justify-start">
                    <span className="bg-black/70 backdrop-blur-sm text-yellow-400 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border border-yellow-400/40">
                      {currentPhoto.category}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white truncate w-full shadow-sm">
                      {currentPhoto.title}
                    </p>
                    <p className="text-[9px] text-gray-300 font-medium truncate">
                      Foto real registrada na Av. Arthur Bernardes, Portão
                    </p>
                  </div>
                </div>
                
                {/* Arrow Navigation */}
                <button 
                  onClick={prevImage}
                  className="absolute left-1.5 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-1.5 rounded-full transition cursor-pointer border border-white/20"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-1.5 rounded-full transition cursor-pointer border border-white/20"
                  aria-label="Próxima foto"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Thumbnails strip for fast selection of real photos */}
              <div className="flex gap-1.5 overflow-x-auto mt-2 pt-1 pb-1 scrollbar-thin">
                {galleryList.map((item, idx) => (
                  <button
                    key={`share-thumb-${idx}`}
                    onClick={() => setImageIndex(idx)}
                    className={`relative w-11 h-8 rounded shrink-0 overflow-hidden border transition cursor-pointer ${
                      idx === safeImageIndex 
                        ? 'border-[#f49e1a] ring-1 ring-[#f49e1a] opacity-100 scale-105' 
                        : 'border-white/20 opacity-50 hover:opacity-80'
                    }`}
                    title={item.title}
                    aria-label={`Selecionar foto ${item.title}`}
                  >
                    <img 
                      src={item.url} 
                      alt="" 
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        if (item.remoteUrl && target.src !== item.remoteUrl) {
                          target.src = item.remoteUrl;
                        }
                      }}
                      className="w-full h-full object-cover" 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Content Preview */}
            <div className="mb-3.5 bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs">
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Texto do Compartilhamento:
              </span>
              <p className="text-gray-200 line-clamp-2 font-medium leading-relaxed">
                {shareTitle}
              </p>
              <p className="text-gray-400 line-clamp-2 mt-1 leading-relaxed text-[11px]">
                {shareText}
              </p>
            </div>

            {/* Social Grid */}
            <div className="grid grid-cols-3 gap-2">
              
              {/* WhatsApp */}
              <button
                onClick={() => handleShare('whatsapp')}
                className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl bg-green-600/20 hover:bg-green-600/35 border border-green-500/30 hover:border-green-500/50 transition group cursor-pointer"
                id="share-whatsapp-btn"
              >
                <svg className="w-5 h-5 text-green-400 group-hover:scale-110 transition duration-250" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span className="text-[10px] font-bold text-gray-300">WhatsApp</span>
              </button>

              {/* Twitter / X */}
              <button
                onClick={() => handleShare('twitter')}
                className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition group cursor-pointer"
                id="share-twitter-btn"
              >
                <svg className="w-5 h-5 text-gray-200 group-hover:scale-110 transition duration-250" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span className="text-[10px] font-bold text-gray-300">Twitter (X)</span>
              </button>

              {/* Facebook */}
              <button
                onClick={() => handleShare('facebook')}
                className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/35 border border-blue-500/30 hover:border-blue-500/50 transition group cursor-pointer"
                id="share-facebook-btn"
              >
                <svg className="w-5 h-5 text-blue-400 group-hover:scale-110 transition duration-250" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="text-[10px] font-bold text-gray-300">Facebook</span>
              </button>

              {/* Pinterest */}
              <button
                onClick={() => handleShare('pinterest')}
                className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/35 border border-red-500/30 hover:border-red-500/50 transition group cursor-pointer"
                id="share-pinterest-btn"
              >
                <svg className="w-5 h-5 text-red-400 group-hover:scale-110 transition duration-250" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.41 7.61 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.966 1.406-5.966s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.204 0 1.03.399 2.137.893 2.734a.39.39 0 0 1 .091.371c-.099.412-.32 1.303-.362 1.482a.238.238 0 0 1-.318.152c-2.502-1.164-4.061-4.825-4.061-7.754 0-6.312 4.584-12.115 13.228-12.115 6.94 0 12.33 4.945 12.33 11.554 0 6.892-4.347 12.44-10.38 12.44-2.027 0-3.931-1.052-4.585-2.298l-1.248 4.757c-.451 1.731-1.67 3.897-2.485 5.223 1.123.348 2.316.536 3.553.536 6.621 0 11.983-5.36 11.983-11.98c0-6.621-5.362-11.983-11.983-11.983z" />
                </svg>
                <span className="text-[10px] font-bold text-gray-300">Pinterest</span>
              </button>

              {/* LinkedIn */}
              <button
                onClick={() => handleShare('linkedin')}
                className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl bg-blue-700/20 hover:bg-blue-700/35 border border-blue-500/30 hover:border-blue-500/50 transition group cursor-pointer"
                id="share-linkedin-btn"
              >
                <svg className="w-5 h-5 text-blue-300 group-hover:scale-110 transition duration-250" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
                </svg>
                <span className="text-[10px] font-bold text-gray-300">LinkedIn</span>
              </button>

              {/* Copy URL */}
              <button
                onClick={handleCopyLink}
                className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl transition border group cursor-pointer ${
                  copied 
                    ? 'bg-yellow-500/30 border-yellow-500/50' 
                    : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20'
                }`}
                id="share-copy-link-btn"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-yellow-400 group-hover:scale-110 transition duration-250" />
                ) : (
                  <Link2 className="w-5 h-5 text-[#f49e1a] group-hover:scale-110 transition duration-250" />
                )}
                <span className="text-[10px] font-bold text-gray-300">
                  {copied ? 'Copiado!' : 'Copiar Link'}
                </span>
              </button>

            </div>

            {/* Note footer with 65% opacity theme styling */}
            <p className="text-[9px] text-gray-400 text-center mt-3 leading-relaxed">
              * Fotos 100% reais das instalações da Carplus Portão (Av. Arthur Bernardes, Curitiba).
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
