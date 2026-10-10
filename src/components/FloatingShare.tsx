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
    let desc = 'Encontre pneus novos com o melhor preço de Curitiba, rampa 3D e instalação técnica especializada no Portão!';

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
      desc = 'Procurando serviços no Portão semelhantes a Barão Pneus? Conheça a alternativa Carplus Arthur Bernardes para Geometria 3D de alta precisão e pneus novos.';
    } else if (currentView === 'bana-pneus') {
      path = '/bana-pneus';
      title = 'Alternativa a Bana Pneus Curitiba - Serviços e Preços | Carplus';
      desc = 'Procurando alternativa a Bana Pneus em Curitiba? Conheça diferenciais de qualidade, prazos de garantia de 5 anos e condições exclusivas da Carplus Portão com serviços expressos.';
    } else if (currentView === 'pneus-baratos-em-curitiba') {
      path = '/pneus-baratos-em-curitiba';
      title = 'Pneus Baratos em Curitiba - Preço de Atacado Completo | Carplus';
      desc = 'Procura pneus baratos com preço de atacado e instalação de primeira classe em Curitiba? Veja a tabela de ofertas exclusivas com procedência garantida na Carplus Portão.';
    } else if (currentView === 'xbri-pneus-curitiba') {
      path = '/xbri-pneus-curitiba';
      title = 'Xbri Pneus Curitiba - Ampla Linha de Medidas e Modelos | Carplus';
      desc = 'Pensou em Pneus Xbri em Curitiba pelo menor valor? Encontre a linha completa para utilitários, vans e SUVs a pronta entrega na Carplus, com instalação expressa na hora.';
    } else if (currentView === 'pneus-pirelli-em-curitiba-melhor-preco') {
      path = '/pneus-pirelli-em-curitiba-melhor-preco';
      title = 'Pneus Pirelli em Curitiba Melhor Preço - Concessionária Completa | Carplus';
      desc = 'Melhor preço garantido em pneus originais Pirelli em Curitiba. Estoque completo Cinturato P1, P7, Scorpion a pronta entrega e geometria 3D computadorizada no Portão.';
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
      desc = `Buscando pneus em ${seoTarget.name}? Conheça as ofertas especiais, pneus novos de procedência e geometria 3D no Portão na Carplus.`;
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

  return null;
}
