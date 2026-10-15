import React, { useState, useEffect } from 'react';
import { 
  Building, ShieldCheck, HelpCircle, ArrowLeft, Navigation, 
  Phone, Globe, Sparkles, AlertCircle, Send, CheckCircle2, Star,
  ChevronDown, ChevronUp, Tag, Flame, HelpCircle as InfoIcon,
  ChevronLeft, ChevronRight, Wrench, Users, Clock, Info, X,
  Map, BarChart3, Settings2, FileText, Signal, Zap, Car,
  ShoppingBag, Layers, ExternalLink, ArrowRight, BookOpen, Gauge, BatteryCharging
} from 'lucide-react';
import { 
  OFFICIAL_NEIGHBORHOODS, NON_OFFICIAL_NEIGHBORHOODS, POPULAR_REGIONS, 
  METROPOLITAN_CITIES, getRouteInstructions 
} from '../seo-data';
import { 
  calculateLocalScore, isPageReleased, getSavedGSCRate, saveGSCRate, 
  PRIORITY_NEIGHBORHOODS, PRIORITY_CITIES, getWave2Bairros, getWave2Cidades, 
  getAllNeighborhoods, getAllCities, AROS as WAVE_AROS, CARS as WAVE_CARS
} from '../utils/seoWaves';
import ServiceHistory from './ServiceHistory';
import { TIRES_DATA, CAR_MODELS_DATA, getBrandFallbackImage } from '../data';
import TireCard from './TireCard';
import CarplusVideosSection from './CarplusVideosSection';
import { motion, AnimatePresence } from 'motion/react';
import SearchIntentPages from './SearchIntentPages';
import BlogView from './BlogView';
import BydClusterPages, { BydClusterView } from './BydClusterPages';
import RimAuthoritySection from './RimAuthoritySection';
import GaragemDePneusSection from './GaragemDePneusSection';
import OficinaDoPneuSection from './OficinaDoPneuSection';
import AdminIndexacaoSection from './AdminIndexacaoSection';


interface CompanyPagesProps {
  view: 'quem-somos' | 'politica-privacidades' | 'politica-devolucao' | 'mapa-do-site' | 'seo-landing' | 'contato' | 'curitiba' | 'regiao-metropolitana' | 'admin-indexacao' | 'carrinho' | 'oficina-do-pneu-curitiba' | 'garagem-de-pneus-curitiba' | 'pneus-pirelli-curitiba' | 'alinhamento-3d-curitiba' | 'blog' | 'xbri-pneus-curitiba' | 'pneus-baratos-em-curitiba' | 'melhor-site-para-comprar-pneus' | 'distribuidora-de-pneus-importados-atacado-curitiba' | 'pneu-hankook-curitiba' | 'pneus-bridgestone-curitiba-precos' | 'barao-pneus-e-oficina-bacacheri-curitiba' | 'barao-pneus-sao-jose-pinhais' | 'pneus-em-curitiba-melhor-preco' | 'distribuidora-de-pneus-em-curitiba' | 'bana-pneus' | 'loja-de-pneus-em-curitiba' | 'pneus-pirelli-em-curitiba-melhor-preco' | 'barao-pneus-e-oficina-portao' | 'auto-center-curitiba' | 'troca-de-pneus-curitiba' | 'centro-automotivo-portao' | BydClusterView;
  seoTarget: { type: 'bairro' | 'cidade' | 'aro' | 'carro'; name: string; region?: string; detail?: string; } | null;
  onNavigateHome: () => void;
  onNavigateToPage: (page: any, slug?: string) => void;
  onSelectSeoTarget: (target: { type: 'bairro' | 'cidade' | 'aro' | 'carro'; name: string; region?: string; detail?: string; }) => void;
  onSelectRimFromSeo?: (rim: number | 'Todos') => void;
  onSelectBrandFromSeo?: (brand: string) => void;
  onAddToCart?: (tire: any, quantity: number) => void;
  onSelectTire?: (tire: any) => void;
  cartItems?: any[];
  onUpdateQuantity?: (tireId: string, quantity: number) => void;
  onRemoveFromCart?: (tireId: string) => void;
  onClearCart?: () => void;
  selectedBlogSlug?: string | null;
  onSelectBlogSlug?: (slug: string | null) => void;
}

export default function CompanyPages({ 
  view, 
  seoTarget, 
  onNavigateHome, 
  onNavigateToPage, 
  onSelectSeoTarget,
  onSelectRimFromSeo,
  onSelectBrandFromSeo,
  onAddToCart,
  onSelectTire,
  cartItems = [],
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
  selectedBlogSlug,
  onSelectBlogSlug
}: CompanyPagesProps) {
  // Aros 13 to 23
  const AROS = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

  const formatWhatsApp = (text: string) => {
    return `https://api.whatsapp.com/send?phone=554130827282&text=${encodeURIComponent(text)}`;
  };

  const getMostSearchedTires = (name: string, type: string) => {
    const tier1 = TIRES_DATA.find(t => t.rim === 14) || TIRES_DATA[1];
    const tier2 = TIRES_DATA.find(t => t.rim === 15) || TIRES_DATA[2];
    const tier3 = TIRES_DATA.find(t => t.rim === 16 || t.rim === 17) || TIRES_DATA[4];

    return [
      {
        category: 'Hatchbacks & Compactos',
        medida: '175/65R14 ou 185/60R15',
        sugestao: tier1,
        motivo: `Alta eficiência e dirigibilidade macia recomendada para os condutores que trafegam em ${name}.`
      },
      {
        category: 'Sedans & Comerciais Leves',
        medida: '195/55R15 ou 205/55R16',
        sugestao: tier2,
        motivo: `Estabilidade superior nas curvas e durabilidade nas vias rápidas e avenidas de ${name}.`
      },
      {
        category: 'SUVs & Linha Pesada Premium',
        medida: '225/45R17 ou 225/55R18',
        sugestao: tier3,
        motivo: `Aderência máxima sob pista molhada e asfalto de terra, ideal para sua segurança na região.`
      }
    ];
  };

  // State for active rotating offer in SEO pages hero
  const [activeOfferIdx, setActiveOfferIdx] = useState(0);
  
  // State for active FAQ accordion index
  const [activeFaqIdx, setActiveFaqIdx] = useState<number | null>(null);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactPlate, setContactPlate] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isContactSubmitted, setIsContactSubmitted] = useState(false);

  // Offers of tires
  const offersOnSale = TIRES_DATA.filter(t => t.isOffer);

  useEffect(() => {
    if (offersOnSale.length === 0) return;
    const timer = setInterval(() => {
      setActiveOfferIdx((prev) => (prev + 1) % offersOnSale.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [offersOnSale.length]);

  return (
    <div className={view === 'blog' ? 'min-h-screen font-sans' : 'bg-white text-gray-900 min-h-screen py-10 px-4 sm:px-6 font-sans'} id="company-pages-container">
      
      {/* Header element */}
      {view !== 'blog' && view !== 'quem-somos' && <div className="max-w-6xl mx-auto flex items-center justify-between border-b border-gray-205 pb-5 mb-8">
        <button 
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 text-xs sm:text-sm uppercase font-extrabold tracking-wider text-yellow-600 hover:text-yellow-700 cursor-pointer"
          id="back-home-button"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar ao Início / Catálogo</span>
        </button>
        <span className="text-[10px] uppercase font-mono tracking-widest text-gray-500 font-extrabold">
          Carplus Pneus • Unidade Portão Curitiba
        </span>
      </div>}

      <div className={view === 'blog' ? '' : 'max-w-6xl mx-auto'}>

        {/* VIEW: CARRINHO DE COMPRAS WOOCOMMERCE SIMULADO */}
        {view === 'carrinho' && (() => {
          const total = cartItems.reduce((acc, item) => acc + ((item.tire.promoPrice || item.tire.price) * item.quantity), 0);
          const totalPix = total * 0.95;
          const totalInstallment = total / 10;
          
          const buildCartWhatsAppMessage = () => {
            const listText = cartItems.map(item => {
              const cleanedName = `Pneu ${item.tire.brand} ${item.tire.width}/${item.tire.aspectRatio}R${item.tire.rim} ${item.tire.model}`;
              return `• ${item.quantity}x ${cleanedName} - (Preço sob consulta)`;
            }).join('\n');
            const message = `Olá equipe Carplus Pneus! Gostaria de consultar o preço e agendar a instalação para os seguintes pneus do meu carrinho:\n\n${listText}\n\nPor favor, me enviem o orçamento atualizado para pagamento facilitado em até 10x sem juros ou desconto considerável no PIX à vista!`;
            return `https://api.whatsapp.com/send?phone=554130827282&text=${encodeURIComponent(message)}`;
          };

          return (
            <div className="space-y-8 animate-fade-in" id="view-carrinho-page">
              <div className="text-center md:text-left">
                <span className="bg-yellow-500/10 text-yellow-700 border border-yellow-500/25 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full inline-block">
                  Ambiente Seguro de Compra • Carplus CWB
                </span>
                <h2 className="text-3xl sm:text-4xl font-black uppercase text-gray-950 mt-3 tracking-tight">
                  Seu Carrinho • <span className="text-yellow-600">Revisão de Compra</span>
                </h2>
                <p className="text-sm max-w-2xl mt-2 text-left leading-relaxed text-gray-650 font-medium">
                  Confira as quantidades dos pneus novos da sua frota e usufrua da nossa estrutura especializada no Portão: montagem técnica computadorizada, balanceamento dinâmico e alinhamento 3D de alta precisão!
                </p>
              </div>

              {cartItems.length === 0 ? (
                <div className="bg-gray-50 border border-dashed border-gray-300 rounded-3xl p-12 text-center space-y-6" id="empty-cart-view">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto text-gray-400">
                    <Building className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-extrabold text-gray-950 uppercase">Sem pneus no carrinho de compras</h3>
                    <p className="text-xs text-gray-650 max-w-md mx-auto">
                      Seu carrinho de compras está limpo. Navegue pelo nosso mapa do site ou volte ao catálogo para selecionar as melhores marcas (Pirelli, Bridgestone, Goodyear, Michelin) com garantia de 5 anos de fábrica!
                    </p>
                  </div>
                  <button 
                    onClick={onNavigateHome}
                    className="bg-gray-950 hover:bg-[#f49e1a] hover:text-black text-white font-black px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow border border-transparent hover:border-black cursor-pointer"
                  >
                    Voltar ao Catálogo de Pneus
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="active-cart-grid">
                  {/* Cart Items List Table (Left Col - 8 cols span) */}
                  <div className="lg:col-span-8 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                    <h3 className="text-lg font-black uppercase text-gray-950 border-b border-gray-100 pb-3 flex items-center gap-2">
                      <Tag className="w-5 h-5 text-yellow-600" />
                      <span>Seus Itens Selecionados ({cartItems.reduce((s, i) => s + i.quantity, 0)} pneus)</span>
                    </h3>

                    <div className="space-y-4 divide-y divide-gray-100">
                      {cartItems.map((item, idx) => {
                        const originalP = item.tire.price;
                        const finalP = item.tire.promoPrice || originalP;
                        const itemSub = finalP * item.quantity;
                        const cleanedName = `Pneu ${item.tire.brand} ${item.tire.width}/${item.tire.aspectRatio}R${item.tire.rim} ${item.tire.model}`;

                        return (
                          <div 
                            key={`cart-item-${item.tire.id}-${idx}`}
                            className={`pt-4 first:pt-0 flex flex-col sm:flex-row items-center justify-between gap-4`}
                          >
                            {/* Product Thumbnail & Details */}
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                              <div className="w-20 h-20 bg-gray-50 border border-gray-150 rounded-xl p-2 flex items-center justify-center shrink-0">
                                <img 
                                  src={item.tire.image} 
                                  alt={cleanedName} 
                                  className="w-full h-full object-contain"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <div className="space-y-1">
                                <span className="inline-block text-[9px] bg-gray-100 border border-gray-200 text-gray-700 font-mono font-bold px-2 py-0.5 rounded uppercase">
                                  {item.tire.brand}
                                </span>
                                <h4 className="text-sm font-extrabold text-gray-950 uppercase leading-snug line-clamp-1">
                                  {cleanedName}
                                </h4>
                                <p className="text-xs text-gray-400 font-mono">
                                  Medida: {item.tire.width}/{item.tire.aspectRatio} R{item.tire.rim} • Cód: {item.tire.id}
                                </p>
                              </div>
                            </div>

                            {/* Quantity & Small Totals Controls */}
                            <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-gray-50 pt-3 sm:pt-0">
                              {/* Quantity selection */}
                              <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-1">
                                <button
                                  onClick={() => onUpdateQuantity && onUpdateQuantity(item.tire.id, Math.max(1, item.quantity - 1))}
                                  className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black font-extrabold cursor-pointer hover:bg-gray-200 rounded-lg transition"
                                  disabled={item.quantity <= 1}
                                  aria-label="Diminuir unidade"
                                >
                                  -
                                </button>
                                <span className="w-10 text-center font-mono text-sm font-extrabold text-gray-950">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => onUpdateQuantity && onUpdateQuantity(item.tire.id, item.quantity + 1)}
                                  className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black font-extrabold cursor-pointer hover:bg-gray-200 rounded-lg transition"
                                  aria-label="Aumentar unidade"
                                >
                                  +
                                </button>
                              </div>

                              {/* Price Math block */}
                              <div className="text-right space-y-0.5 min-w-[100px]">
                                <p className="text-[10px] text-gray-400 font-mono">Unitário: Sob Consulta</p>
                                <p className="text-sm font-black text-[#1ebd53] uppercase tracking-wider">Sob Consulta</p>
                              </div>

                              {/* Remove cross action button */}
                              <button
                                onClick={() => onRemoveFromCart && onRemoveFromCart(item.tire.id)}
                                className="text-gray-400 hover:text-red-500 p-2 rounded-xl hover:bg-red-50 transition cursor-pointer shrink-0"
                                aria-label="Remover item"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="border-t border-gray-100 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <button 
                        onClick={onNavigateHome}
                        className="text-yellow-600 hover:text-yellow-700 hover:underline font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Adicionar Mais Pneus</span>
                      </button>

                      {onClearCart && (
                        <button 
                          onClick={onClearCart}
                          className="text-gray-400 hover:text-red-500 font-extrabold text-xs uppercase tracking-wider cursor-pointer"
                        >
                          Limpar Todo o Carrinho
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Summary Board panel (Right Col - 4 cols span) */}
                  <div className="lg:col-span-4 space-y-6">
                    {/* Order summary element */}
                    <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                      <h3 className="text-lg font-black uppercase text-gray-950 border-b border-gray-200 pb-3 flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-green-600" />
                        <span>Resumo do Pedido</span>
                      </h3>

                      <div className="space-y-3 font-mono text-sm border-b border-gray-200 pb-4">
                        <div className="flex justify-between items-center text-gray-650">
                          <span>Subtotal de Itens</span>
                          <span className="text-[#1ebd53] font-extrabold uppercase">Sob Consulta</span>
                        </div>
                        <div className="flex justify-between items-center text-gray-650">
                          <span>Montagem e Instalação</span>
                          <span className="text-green-600 font-extrabold uppercase">Incluso</span>
                        </div>
                        <div className="flex justify-between items-center text-gray-650">
                          <span>Bicos de Borracha</span>
                          <span className="text-green-600 font-extrabold uppercase">Cortesia</span>
                        </div>
                        <div className="flex justify-between items-center text-gray-650">
                          <span>Check-up Geometria</span>
                          <span className="text-green-600 font-extrabold uppercase">Incluso</span>
                        </div>
                      </div>

                      {/* Payment Methods Breakdown */}
                      <div className="space-y-4">
                        {/* À Vista PIX */}
                        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 space-y-1">
                          <span className="text-[10px] text-green-700 font-mono uppercase font-black tracking-wider block">À Vista PIX</span>
                          <p className="text-lg font-black text-green-850 uppercase tracking-wide">Desconto Especial</p>
                          <p className="text-xs text-green-600 font-bold select-none">Consulte desconto de 5% à vista no pix!</p>
                        </div>

                        {/* Cartão de Crédito */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-1">
                          <span className="text-[10px] text-gray-500 font-mono uppercase font-black tracking-wider block">Parcelamento no Cartão</span>
                          <p className="text-lg font-black text-gray-950 uppercase tracking-wide">Até 10x sem juros</p>
                          <p className="text-xs text-gray-400 font-bold select-none">Sem juros adicionais em bandeiras oficiais.</p>
                        </div>
                      </div>

                      {/* Checkout button linked to WhatsApp */}
                      <a 
                        href={buildCartWhatsAppMessage()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-black py-4 rounded-2xl text-xs uppercase tracking-wider block text-center shadow-lg transition-all transform hover:scale-[1.01] cursor-pointer border border-[#1ebd53]"
                        id="complete-order-button"
                      >
                        Consultar Orçamento via WhatsApp
                      </a>

                      <p className="text-[10px] text-gray-400 text-center leading-relaxed font-semibold">
                        Garantimos reserva imediata do estoque com faturamento e instalação em nossa loja física oficial (Av. Arthur Bernardes, 1323 - Portão).
                      </p>
                    </div>

                    {/* Protection assurance certificate */}
                    <div className="bg-white border border-gray-200 rounded-3xl p-5 space-y-3 shadow-inner">
                      <h4 className="text-xs font-black text-gray-950 uppercase flex items-center gap-1.5 font-mono">
                        <ShieldCheck className="w-4 h-4 text-yellow-600" />
                        <span>Garantia de 5 anos Inclusa</span>
                      </h4>
                      <p className="text-[11px] text-gray-650 leading-relaxed text-left font-medium">
                        Todos os pneus em estoque acompanham o selo de qualidade do Inmetro, nota fiscal e cobertura de garantia total de 5 anos contra defeitos e anomalias de fábrica. Sua compra e rodagem estão amparadas com tranquilidade na Carplus.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* VIEW: QUEM SOMOS */}
        {view === 'quem-somos' && (
          <div className="space-y-12 text-white sm:space-y-16" id="view-quem-somos">
            <section className="grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12" aria-labelledby="about-carplus-title">
              <div>
                <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-[#f59c00]">Portão · Curitiba</p>
                <h1 id="about-carplus-title" className="mt-3 font-display text-4xl font-bold uppercase leading-tight tracking-tight text-white sm:text-5xl">Quem Somos • <span className="text-[#f59c00]">Carplus Pneus &amp; Auto Center</span></h1>
                <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-[#c3c3c3]">Pneus e serviços automotivos no mesmo endereço. Conte qual é o seu carro e a equipe ajuda a conferir a medida, as opções e o orçamento antes da sua visita.</p>
                <div className="mt-7 flex flex-col gap-3 sm:items-start">
                  <a href={formatWhatsApp('Olá, Carplus! Conheci a loja pela página Quem Somos e quero um orçamento para o meu carro.')} target="_blank" rel="noopener noreferrer" data-cta-location="quem-somos-hero" className="carplus-action-primary inline-flex min-h-[56px] items-center justify-center gap-3 rounded-xl bg-[#f59c00] px-6 py-4 text-center text-[16px] font-bold text-[#080808]"><Phone aria-hidden="true" className="h-5 w-5 shrink-0" />Pedir orçamento no WhatsApp<ArrowRight aria-hidden="true" className="h-5 w-5 shrink-0" /></a>
                  <a href="/pneus" onClick={event => { if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; event.preventDefault(); onNavigateToPage('catalogo-pneus'); }} className="carplus-action-secondary inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-white/25 px-6 py-3 text-[16px] font-semibold text-white">Ver pneus no catálogo<ArrowRight aria-hidden="true" className="h-4 w-4" /></a>
                </div>
              </div>
              <figure className="overflow-hidden rounded-2xl border border-[#f59c00]/30 bg-[#111111]">
                <img src="/images/carplus-real/rampa-de-geometria.webp" alt="Veículo na rampa de geometria da unidade Carplus no Portão" width="1384" height="924" fetchPriority="high" decoding="async" className="aspect-[4/3] w-full object-cover sm:min-h-[360px]" onError={event => { const image = event.currentTarget; if (image.dataset.realFallback) return; image.dataset.realFallback = 'true'; image.src = '/images/galeria/rampa-de-geometria.jpg'; }} />
                <figcaption className="border-t border-white/10 px-5 py-4 text-[15px] leading-relaxed text-[#c3c3c3]">Nossa estrutura de atendimento no Portão, Curitiba.</figcaption>
              </figure>
            </section>

            <section className="grid gap-4 md:grid-cols-3" aria-label="Como a Carplus ajuda você">
              {[
                { Icon: CheckCircle2, title: 'Ajuda para escolher', text: 'Conferimos a medida e a aplicação para comparar as opções para o seu carro.' },
                { Icon: Wrench, title: 'Pneus e serviços no mesmo lugar', text: 'Consulte pneus, montagem, balanceamento e alinhamento 3D na nossa unidade.' },
                { Icon: Navigation, title: 'Loja no Portão', text: 'Av. Presidente Arthur da Silva Bernardes, 1323, em Curitiba. Fale com a equipe antes de vir.' },
              ].map(({ Icon, title, text }) => (
                <div key={title} className="rounded-2xl border border-white/15 bg-[#111111] p-6">
                  <Icon aria-hidden="true" className="h-6 w-6 text-[#f59c00]" />
                  <h2 className="mt-4 text-[20px] font-semibold leading-snug text-white">{title}</h2>
                  <p className="mt-2 text-[16px] leading-relaxed text-[#c3c3c3]">{text}</p>
                </div>
              ))}
            </section>

            <section aria-labelledby="about-how-title">
              <h2 id="about-how-title" className="font-display text-3xl font-bold uppercase text-white sm:text-4xl">Do primeiro contato à sua visita.</h2>
              <ol className="mt-6 grid gap-6 md:grid-cols-3">
                {[
                  { number: '01', title: 'Conte qual é o seu carro', text: 'Envie modelo, ano e medida do pneu, se souber.' },
                  { number: '02', title: 'Confira as opções e o orçamento', text: 'A equipe confere a aplicação, as marcas e a disponibilidade.' },
                  { number: '03', title: 'Combine sua visita', text: 'Confirme o atendimento pelo WhatsApp e venha à loja.' },
                ].map(({ number, title, text }) => (
                  <li key={number} className="border-t border-[#f59c00]/40 pt-5">
                    <span className="text-[14px] font-bold tracking-wider text-[#f59c00]">{number}</span>
                    <h3 className="mt-2 text-[19px] font-semibold leading-snug text-white">{title}</h3>
                    <p className="mt-2 text-[16px] leading-relaxed text-[#c3c3c3]">{text}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section className="grid gap-5 md:grid-cols-2" aria-label="Fotos reais da Carplus">
              {[
                { src: '/images/carplus-real/montagem-tecnica.webp', fallback: '/images/galeria/montagem-tecnica.jpg', alt: 'Técnico da Carplus trabalhando na montagem de um pneu', caption: 'Montagem de pneus na nossa oficina.' },
                { src: '/images/carplus-real/alinhamento.webp', fallback: '/images/galeria/alinhamento.jpg', alt: 'Equipamento de alinhamento na roda de um veículo na Carplus', caption: 'Equipamentos e atendimento na unidade Portão.' },
              ].map(photo => (
                <figure key={photo.src} className="overflow-hidden rounded-2xl border border-[#f59c00]/25 bg-[#111111]">
                  <img src={photo.src} alt={photo.alt} width="1384" height="924" loading="lazy" decoding="async" className="aspect-[3/2] w-full object-cover" onError={event => { const image = event.currentTarget; if (image.dataset.realFallback) return; image.dataset.realFallback = 'true'; image.src = photo.fallback; }} />
                  <figcaption className="border-t border-white/10 px-5 py-4 text-[16px] leading-relaxed text-[#c3c3c3]">{photo.caption}</figcaption>
                </figure>
              ))}
            </section>

            <section className="grid gap-7 rounded-2xl border border-[#f59c00]/30 bg-[#111111] p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr]" aria-labelledby="about-visit-title">
              <div>
                <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-[#f59c00]">Venha à Carplus</p>
                <h2 id="about-visit-title" className="mt-3 font-display text-3xl font-bold uppercase text-white">Seu próximo passo começa no WhatsApp.</h2>
                <p className="mt-3 text-[16px] leading-relaxed text-[#c3c3c3]">Tire sua dúvida, consulte as opções e combine o atendimento com a nossa equipe.</p>
                <a href={formatWhatsApp('Olá, Carplus! Quero consultar pneus ou serviços para o meu carro e combinar uma visita à loja.')} target="_blank" rel="noopener noreferrer" data-cta-location="quem-somos-visita" className="carplus-action-primary mt-5 inline-flex min-h-[56px] items-center justify-center gap-3 rounded-xl bg-[#f59c00] px-6 py-4 text-center text-[16px] font-bold text-[#080808]"><Phone aria-hidden="true" className="h-5 w-5 shrink-0" />Falar com a equipe no WhatsApp</a>
              </div>
              <div className="border-t border-white/15 pt-6 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
                <h3 className="text-[18px] font-semibold text-white">Endereço e atendimento</h3>
                <address className="mt-3 text-[16px] not-italic leading-relaxed text-[#c3c3c3]">Av. Presidente Arthur da Silva Bernardes, 1323<br />Portão · Curitiba / PR</address>
                <p className="mt-4 text-[16px] leading-relaxed text-[#c3c3c3]">Segunda a sexta: 8h às 18h<br />Sábado: 8h às 12h</p>
                <a href="tel:554130827282" className="mt-3 inline-flex min-h-[48px] items-center gap-2 text-[17px] font-semibold text-white"><Phone aria-hidden="true" className="h-4 w-4 text-[#f59c00]" />(41) 3082-7282</a>
                <a href="https://maps.google.com/?q=Av.+Presid.+Arthur+da+Silva+Bernardes,+1323+-+Port%C3%A3o,+Curitiba+-+PR" target="_blank" rel="noopener noreferrer" data-cta-location="quem-somos-localizacao" className="carplus-action-secondary mt-3 flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-white/25 px-5 py-3 text-[16px] font-semibold text-white"><Navigation aria-hidden="true" className="h-5 w-5 text-[#f59c00]" />Como chegar à loja</a>
              </div>
            </section>

            <section aria-labelledby="about-faq-title">
              <h2 id="about-faq-title" className="font-display text-3xl font-bold uppercase text-white">Antes de falar com a equipe.</h2>
              <div className="mt-5 divide-y divide-white/15 border-y border-white/15">
                {[
                  { question: 'Preciso saber a medida do pneu para pedir um orçamento?', answer: 'Não. Envie o modelo, a versão e o ano do carro. Se puder, mande também uma foto da medida na lateral do pneu ou da etiqueta do veículo para ajudar na conferência.' },
                  { question: 'Posso comprar e instalar os pneus no mesmo local?', answer: 'Sim. Na unidade Portão você pode consultar pneus e serviços de montagem, balanceamento e alinhamento 3D. Confirme as opções, os valores e o atendimento com a equipe pelo WhatsApp.' },
                ].map(({ question, answer }) => (
                  <details key={question} className="group">
                    <summary className="flex min-h-[64px] cursor-pointer list-none items-center justify-between gap-4 py-4 text-[17px] font-semibold leading-relaxed text-white [&::-webkit-details-marker]:hidden"><span>{question}</span><ChevronDown aria-hidden="true" className="h-5 w-5 shrink-0 text-[#f59c00] transition-transform group-open:rotate-180" /></summary>
                    <p className="pb-5 pr-8 text-[16px] leading-relaxed text-[#c3c3c3]">{answer}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>
        )}
        {/* VIEW: PRIVACY POLICY */}
        {view === 'politica-privacidades' && (
          <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm" id="view-privacy-policy">
            <div className="border-b border-gray-200 pb-4">
              <span className="bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 font-bold text-xs uppercase tracking-widest px-3 py-1 rounded-full">
                Segurança Legal
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-gray-950 mt-2">
                Política de Privacidade • <span className="text-yellow-600">Carplus Pneus</span>
              </h2>
              <p className="text-[10px] text-gray-400 mt-1 font-mono font-extrabold">Última atualização: 11 de Junho de 2026</p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-gray-700 text-left leading-relaxed">
              <p>
                A Carplus Pneus está comprometida com a proteção de dados pessoais e privacidade de nossos clientes. Esta Política de Privacidade explica como coletamos, armazenamos e utilizamos as informações no âmbito deste portal e do agendamento comercial físico.
              </p>

              <h4 className="text-gray-900 font-extrabold uppercase mt-4">1. Coleta e Uso de Informações</h4>
              <p>
                Nós não coletamos dados para fins de comercialização com terceiros. As informações inseridas no formulário do Carrinho de Compras e do chat de suporte (como Nome, Placa do Veículo e preferência de pneu) são tratadas voluntariamente e de forma encriptada para agilizar seu atendimento via WhatsApp direto com nosso canal de vendas físico.
              </p>

              <h4 className="text-gray-900 font-extrabold uppercase mt-4">2. Armazenamento Local (Cookies e LocalStorage)</h4>
              <p>
                Este site utiliza a tecnologia de <strong>LocalStorage</strong> em seu navegador web local. Isso garante que os itens adicionados ao seu carrinho de pneus e o seu histórico de registros de placas sejam persistidos localmente de forma privada e exclusiva no seu computador ou celular, sem qualquer envio a bancos de dados externos.
              </p>

              <h4 className="text-gray-900 font-extrabold uppercase mt-4">3. Transações de Pagamento Seguras</h4>
              <p>
                Lembramos que **não realizamos transações digitais de cartões ou boletos online** neste ambiente. Todo o faturamento e pagamento das mercadorias e de mão de obra de oficina mecânica ocorre pessoalmente de forma presencial no ato da entrega técnica na nossa loja física (Av. Presid. Arthur da Silva Bernardes, 1323, Portão, Curitiba - PR).
              </p>

              <h4 className="text-gray-900 font-extrabold uppercase mt-4">4. Contato Encarregado</h4>
              <p>
                Em caso de dúvidas para remoção ou atualização física de histórico automotivo local, por favor ligue diretamente para a gerência da Carplus Portão através do contato telefônico principal: <strong>(41) 3082-7282</strong>.
              </p>
            </div>
          </div>
        )}

        {/* VIEW: RETURN POLICY */}
        {view === 'politica-devolucao' && (
          <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm" id="view-return-policy">
            <div className="border-b border-gray-250 pb-4">
              <span className="bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 font-bold text-xs uppercase tracking-widest px-3 py-1 rounded-full">
                Garantia Certificada
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-gray-950 mt-2 select-none">
                Política de Troca & Devolução • <span className="text-yellow-600">Carplus Pneus</span>
              </h2>
              <p className="text-[10px] text-gray-400 mt-1 font-mono font-extrabold">Em total conformidade com a Lei Federal nº 8.078/1990 (Código de Defesa do Consumidor - CDC).</p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-gray-700 text-left leading-relaxed">
              <p>
                A Carplus Pneus busca sempre a satisfação total e a integridade preventiva dos condutores de Curitiba e região metropolitana. Veja como funcionam as trocas e garantias em nossa oficina física do Portão:
              </p>

              <h4 className="text-gray-900 font-extrabold uppercase mt-4">1. Arrependimento e Troca Preventiva</h4>
              <p>
                Conforme o CDC, caso queira substituir ou devolver pneus comprados que ainda não foram montados no veículo, asseguramos um período de até 7 dias corridos após a retirada física para a troca de perfil ou solicitação de devolução, desde que a borracha esteja intacta, com os selos de certificação do INMETRO preservados.
              </p>

              <h4 className="text-gray-900 font-extrabold uppercase mt-4">2. Garantia de 5 Anos Contra Defeitos de Fabricação</h4>
              <p>
                Todos os nossos pneus multimarcas homologados comercializados gozam de **garantia estendida legal de 5 (cinco) anos** fornecida diretamente pelo fabricante oficial nacional (Bridgestone, Michelin, Pirelli, Kumho, Hankook e Dunlop). A garantia cobre problemas estruturais como bolhas térmicas ou descolamento de banda de rolagem decorrentes de defeito de fundição na fabricação.
              </p>

              <h4 className="text-gray-900 font-extrabold uppercase mt-4">3. Exclusão de Coberturas</h4>
              <p>
                A garantia contra defeitos de fabricação **NÃO** cobre rasgos provocados por cortes em guias, furos acidentais de pregos, impactos de buracos decorrentes de más condições asfálticas ou desgaste irregular provocado por falta de vistorias técnicas periódicas de alinhamento e geometria 3D.
              </p>

              <h4 className="text-gray-900 font-extrabold uppercase mt-4">4. Procedimento de Troca</h4>
              <p>
                Traga o carro à nossa sede no endereço <strong>Av. Presidente Arthur da Silva Bernardes, 1323 (Portão)</strong> para análise imediata do engenheiro técnico credenciado. O laudo é emitido e, confirmada a ocorrência de defeito original, efetuamos a substituição imediata sem custos extras.
              </p>
            </div>
          </div>
        )}

        {/* VIEW: MAPA DO SITE */}
        {view === 'mapa-do-site' && (
          <div className="space-y-10 animate-fade-in" id="view-sitemap-portal">
            
            {/* Header / Intro Banner */}
            <div className="bg-gradient-to-r from-gray-950 via-gray-900 to-black text-white p-6 sm:p-8 rounded-3xl border border-gray-800 shadow-xl space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-yellow-500 text-gray-950 font-black text-xs uppercase tracking-widest px-3 py-1 rounded-full font-mono">
                  Diretório Geral & Hubs Oficiais
                </span>
                <span className="bg-white/10 text-gray-300 font-bold text-xs px-3 py-1 rounded-full">
                  Atualizado com Novo Cluster BYD Elétricos
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-tight">
                Mapa do Site • <span className="text-yellow-500">Hubs Principais e Páginas do Portal</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 max-w-3xl leading-relaxed">
                Navegue com facilidade por todos os <strong>Hubs Principais</strong> temáticos da Carplus em Curitiba: páginas pilares de veículos elétricos e híbridos (BYD), serviços de centro automotivo no Portão, marcas de pneus, comparativos comerciais, catálogo por montadora, medidas de aros e o diretório geolocalizado de 75 bairros e 29 cidades metropolitanas.
              </p>
            </div>

            {/* SEÇÃO 1: HUBS PRINCIPAIS E PILARES ESTRATÉGICOS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b-2 border-yellow-500 pb-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-yellow-500 text-gray-950 rounded-xl">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-black uppercase text-gray-950 tracking-tight font-mono">
                      Hubs Principais & Páginas Pilares do Portal
                    </h2>
                    <p className="text-xs text-gray-500">
                      As páginas centrais de navegação, categorias estratégicas e serviços da Carplus em Curitiba.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Hub 1: BYD & Veículos Elétricos */}
                <div className="bg-gradient-to-br from-yellow-500/10 via-white to-yellow-500/5 border-2 border-yellow-500 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition group">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="bg-yellow-500 text-gray-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded font-mono">
                        Novo Cluster 2025/2026
                      </span>
                      <Zap className="w-5 h-5 text-yellow-600 group-hover:scale-110 transition" />
                    </div>
                    <h3 className="text-base font-black text-gray-950 uppercase leading-snug">
                      Hub Pneus BYD & Veículos Elétricos
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Guia completo para elétricos e híbridos: Dolphin, Dolphin Mini, GS, King e medidas recomendadas para o asfalto de Curitiba.
                    </p>
                  </div>
                  <div className="pt-4 mt-2 border-t border-yellow-500/20">
                    <button 
                      onClick={() => onNavigateToPage('pneus-byd-curitiba')}
                      className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-950 font-black text-xs uppercase py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 shadow cursor-pointer"
                    >
                      <span>Acessar Hub BYD</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Hub 2: Hub Curitiba Central */}
                <div className="bg-white border border-gray-250 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:border-gray-400 transition group">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="bg-gray-100 text-gray-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded font-mono">
                        Geolocalização
                      </span>
                      <Map className="w-5 h-5 text-gray-700 group-hover:scale-110 transition" />
                    </div>
                    <h3 className="text-base font-black text-gray-950 uppercase leading-snug">
                      Hub Curitiba (Bairros e Rotas)
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Diretório unificado com rotas e orientações de percurso saindo de todos os 75 bairros e vilas de Curitiba até o Portão.
                    </p>
                  </div>
                  <div className="pt-4 mt-2 border-t border-gray-150">
                    <button 
                      onClick={() => onNavigateToPage('curitiba')}
                      className="w-full bg-gray-900 hover:bg-black text-white font-black text-xs uppercase py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Acessar Hub Curitiba</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Hub 3: Região Metropolitana */}
                <div className="bg-white border border-gray-250 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:border-gray-400 transition group">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="bg-gray-100 text-gray-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded font-mono">
                        RMC • 29 Cidades
                      </span>
                      <Globe className="w-5 h-5 text-gray-700 group-hover:scale-110 transition" />
                    </div>
                    <h3 className="text-base font-black text-gray-950 uppercase leading-snug">
                      Hub Região Metropolitana (RMC)
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Atendimento expresso para São José dos Pinhais, Colombo, Pinhais, Araucária, Fazenda Rio Grande e municípios vizinhos.
                    </p>
                  </div>
                  <div className="pt-4 mt-2 border-t border-gray-150">
                    <button 
                      onClick={() => onNavigateToPage('regiao-metropolitana')}
                      className="w-full bg-gray-900 hover:bg-black text-white font-black text-xs uppercase py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Acessar Hub RMC</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Hub 4: Alinhamento 3D */}
                <div className="bg-white border border-gray-250 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:border-gray-400 transition group">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="bg-gray-100 text-gray-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded font-mono">
                        Geometria a Laser
                      </span>
                      <Gauge className="w-5 h-5 text-gray-700 group-hover:scale-110 transition" />
                    </div>
                    <h3 className="text-base font-black text-gray-950 uppercase leading-snug">
                      Hub Alinhamento 3D Computadorizado
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Convergência, cambagem e cáster com tecnologia de sensores reflexivos e banco de dados de montadoras globais.
                    </p>
                  </div>
                  <div className="pt-4 mt-2 border-t border-gray-150">
                    <button 
                      onClick={() => onNavigateToPage('alinhamento-3d-curitiba')}
                      className="w-full bg-gray-900 hover:bg-black text-white font-black text-xs uppercase py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Ver Alinhamento 3D</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Hub 5: Oficina do Pneu */}
                <div className="bg-white border border-gray-250 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:border-gray-400 transition group">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="bg-gray-100 text-gray-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded font-mono">
                        Auto Center no Portão
                      </span>
                      <Wrench className="w-5 h-5 text-gray-700 group-hover:scale-110 transition" />
                    </div>
                    <h3 className="text-base font-black text-gray-950 uppercase leading-snug">
                      Hub Oficina do Pneu & Mecânica
                    </h3>
                    <p className="text-xs text-gray-650 leading-relaxed font-semibold">
                      Montagem técnica especializada, balanceamento dinâmico, revisão preventiva de freios e amortecedores.
                    </p>
                  </div>
                  <div className="pt-4 mt-2 border-t border-gray-150">
                    <button 
                      onClick={() => onNavigateToPage('oficina-do-pneu-curitiba')}
                      className="w-full bg-gray-900 hover:bg-black text-white font-black text-xs uppercase py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Ver Oficina do Pneu</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Hub 6: Loja de Pneus no Portão */}
                <div className="bg-white border border-gray-250 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:border-gray-400 transition group">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="bg-gray-100 text-gray-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded font-mono">
                        Arthur Bernardes 1323
                      </span>
                      <Building className="w-5 h-5 text-gray-700 group-hover:scale-110 transition" />
                    </div>
                    <h3 className="text-base font-black text-gray-950 uppercase leading-snug">
                      Hub Loja de Pneus em Curitiba
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Estoque próprio a pronta entrega, ponta de estoque e condições em até 10x sem juros no cartão físico.
                    </p>
                  </div>
                  <div className="pt-4 mt-2 border-t border-gray-150">
                    <button 
                      onClick={() => onNavigateToPage('loja-de-pneus-em-curitiba')}
                      className="w-full bg-gray-900 hover:bg-black text-white font-black text-xs uppercase py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Ver Loja Física</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Hub 7: Garagem de Pneus */}
                <div className="bg-white border border-gray-250 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:border-gray-400 transition group">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="bg-gray-100 text-gray-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded font-mono">
                        Estrutura & Agilidade
                      </span>
                      <ShieldCheck className="w-5 h-5 text-gray-700 group-hover:scale-110 transition" />
                    </div>
                    <h3 className="text-base font-black text-gray-950 uppercase leading-snug">
                      Hub Garagem de Pneus Curitiba
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Pátio estruturado com elevadores rápidos para trocas ágeis e atendimento sem perda de tempo.
                    </p>
                  </div>
                  <div className="pt-4 mt-2 border-t border-gray-150">
                    <button 
                      onClick={() => onNavigateToPage('garagem-de-pneus-curitiba')}
                      className="w-full bg-gray-900 hover:bg-black text-white font-black text-xs uppercase py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Ver Garagem de Pneus</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Hub 8: Blog Automotivo */}
                <div className="bg-white border border-gray-250 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:border-gray-400 transition group">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="bg-gray-100 text-gray-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded font-mono">
                        Conteúdo & Dicas
                      </span>
                      <BookOpen className="w-5 h-5 text-gray-700 group-hover:scale-110 transition" />
                    </div>
                    <h3 className="text-base font-black text-gray-950 uppercase leading-snug">
                      Hub Blog & Dicas Automotivas
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Artigos especializados sobre calibragem ideal, tempo de troca, alinhamento e economia de combustível.
                    </p>
                  </div>
                  <div className="pt-4 mt-2 border-t border-gray-150">
                    <button 
                      onClick={() => onNavigateToPage('blog')}
                      className="w-full bg-gray-900 hover:bg-black text-white font-black text-xs uppercase py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Ler Artigos do Blog</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* SEÇÃO 2: CLUSTER BYD - PÁGINAS DE MODELOS E MEDIDAS ESPECÍFICAS */}
            <div className="bg-gray-950 text-white rounded-3xl p-6 sm:p-8 space-y-6 border border-gray-800 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-yellow-500 text-gray-950 rounded-2xl">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black uppercase text-yellow-500 font-mono">
                      Cluster Especializado • Linha BYD & Medidas em Curitiba
                    </h2>
                    <p className="text-xs text-gray-400">
                      Páginas dedicadas com especificações por modelo e medidas frequentes de veículos elétricos e híbridos.
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => onNavigateToPage('pneus-byd-curitiba')}
                  className="bg-yellow-500 hover:bg-yellow-400 text-gray-950 font-black text-xs uppercase px-4 py-2 rounded-xl transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <span>Abrir Hub BYD Completo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Modelos BYD */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-yellow-400 font-mono flex items-center gap-2 border-b border-gray-800 pb-2">
                    <Car className="w-4 h-4" />
                    <span>Páginas por Modelo BYD</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <button
                      onClick={() => onNavigateToPage('pneu-byd-dolphin-curitiba')}
                      className="bg-gray-950 hover:bg-yellow-500 hover:text-gray-950 border border-gray-800 hover:border-yellow-500 p-3 rounded-xl text-left transition cursor-pointer group"
                    >
                      <div className="text-xs font-black uppercase flex items-center justify-between">
                        <span>BYD Dolphin</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                      </div>
                      <p className="text-[10px] text-gray-400 group-hover:text-gray-900 mt-1 font-mono">Medida 195/60 R16 & Aro 16</p>
                    </button>

                    <button
                      onClick={() => onNavigateToPage('pneu-byd-dolphin-mini-curitiba')}
                      className="bg-gray-950 hover:bg-yellow-500 hover:text-gray-950 border border-gray-800 hover:border-yellow-500 p-3 rounded-xl text-left transition cursor-pointer group"
                    >
                      <div className="text-xs font-black uppercase flex items-center justify-between">
                        <span>BYD Dolphin Mini</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                      </div>
                      <p className="text-[10px] text-gray-400 group-hover:text-gray-900 mt-1 font-mono">Medida 175/55 R16 Aro 16</p>
                    </button>

                    <button
                      onClick={() => onNavigateToPage('pneu-byd-dolphin-gs-curitiba')}
                      className="bg-gray-950 hover:bg-yellow-500 hover:text-gray-950 border border-gray-800 hover:border-yellow-500 p-3 rounded-xl text-left transition cursor-pointer group"
                    >
                      <div className="text-xs font-black uppercase flex items-center justify-between">
                        <span>BYD Dolphin GS</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                      </div>
                      <p className="text-[10px] text-gray-400 group-hover:text-gray-900 mt-1 font-mono">Versões e Medidas de Rodagem</p>
                    </button>

                    <button
                      onClick={() => onNavigateToPage('pneu-byd-king-curitiba')}
                      className="bg-gray-950 hover:bg-yellow-500 hover:text-gray-950 border border-gray-800 hover:border-yellow-500 p-3 rounded-xl text-left transition cursor-pointer group"
                    >
                      <div className="text-xs font-black uppercase flex items-center justify-between">
                        <span>BYD King (Sedan DM-i)</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                      </div>
                      <p className="text-[10px] text-gray-400 group-hover:text-gray-900 mt-1 font-mono">Medida 215/55 R17 Aro 17</p>
                    </button>
                  </div>
                </div>

                {/* Medidas Frequentes */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-yellow-400 font-mono flex items-center gap-2 border-b border-gray-800 pb-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Páginas de Medidas Frequentes Elétricas/Híbridas</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                    <button
                      onClick={() => onNavigateToPage('pneu-175-55-r16-curitiba')}
                      className="bg-gray-950 hover:bg-yellow-500 hover:text-gray-950 border border-gray-800 hover:border-yellow-500 p-2.5 rounded-xl text-center transition cursor-pointer"
                    >
                      <span className="block text-xs font-black font-mono">175/55 R16</span>
                      <span className="text-[9px] text-gray-400 block mt-0.5">Dolphin Mini</span>
                    </button>

                    <button
                      onClick={() => onNavigateToPage('pneu-195-60-r16-curitiba')}
                      className="bg-gray-950 hover:bg-yellow-500 hover:text-gray-950 border border-gray-800 hover:border-yellow-500 p-2.5 rounded-xl text-center transition cursor-pointer"
                    >
                      <span className="block text-xs font-black font-mono">195/60 R16</span>
                      <span className="text-[9px] text-gray-400 block mt-0.5">Dolphin EV</span>
                    </button>

                    <button
                      onClick={() => onNavigateToPage('pneu-205-50-r17-curitiba')}
                      className="bg-gray-950 hover:bg-yellow-500 hover:text-gray-950 border border-gray-800 hover:border-yellow-500 p-2.5 rounded-xl text-center transition cursor-pointer"
                    >
                      <span className="block text-xs font-black font-mono">205/50 R17</span>
                      <span className="text-[9px] text-gray-400 block mt-0.5">Aro 17 Sport</span>
                    </button>

                    <button
                      onClick={() => onNavigateToPage('pneu-215-55-r17-curitiba')}
                      className="bg-gray-950 hover:bg-yellow-500 hover:text-gray-950 border border-gray-800 hover:border-yellow-500 p-2.5 rounded-xl text-center transition cursor-pointer"
                    >
                      <span className="block text-xs font-black font-mono">215/55 R17</span>
                      <span className="text-[9px] text-gray-400 block mt-0.5">BYD King DM-i</span>
                    </button>

                    <button
                      onClick={() => onNavigateToPage('pneu-225-60-r16-curitiba')}
                      className="bg-gray-950 hover:bg-yellow-500 hover:text-gray-950 border border-gray-800 hover:border-yellow-500 p-2.5 rounded-xl text-center transition cursor-pointer"
                    >
                      <span className="block text-xs font-black font-mono">225/60 R16</span>
                      <span className="text-[9px] text-gray-400 block mt-0.5">Sedans & SUVs</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* CRITICAL INTEGRATION: SERVICE HISTORY */}
            <div className="border border-gray-250 p-1 bg-gray-50 rounded-3xl shadow-sm" id="integrated-service-history">
              <div className="p-4 border-b border-gray-200 bg-white rounded-t-3xl text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-2">
                <div>
                  <span className="bg-yellow-500 text-gray-950 font-mono font-black text-[9px] uppercase px-2.5 py-1 rounded border border-black inline-block">
                    Área Exclusiva do Cliente
                  </span>
                  <h3 className="text-sm font-black text-gray-900 uppercase mt-1">Busque seu Histórico Digital nesta Página</h3>
                </div>
                <div className="text-[10px] text-gray-500 font-mono font-bold">
                  Consultas locais de placa gravadas diretamente no seu aparelho.
                </div>
              </div>
              <div className="p-2 bg-white rounded-b-3xl">
                <ServiceHistory />
              </div>
            </div>

            {/* SEÇÃO 3: HUBS DE MARCAS, OFERTAS & COMPARATIVOS (SEARCH INTENT) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                <Tag className="w-5 h-5 text-yellow-600" />
                <h3 className="text-base sm:text-lg font-black uppercase text-gray-950 font-mono">
                  Hubs de Marcas, Busca Comercial & Comparativos de Preço
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Coluna 1: Marcas Líderes */}
                <div className="bg-white border border-gray-200 p-5 rounded-2xl space-y-3 shadow-sm">
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 font-mono flex items-center gap-1.5 border-b border-gray-150 pb-2">
                    <Sparkles className="w-4 h-4 text-yellow-600" />
                    <span>Grandes Fabricantes</span>
                  </h4>
                  <ul className="space-y-2 text-xs font-bold text-gray-700">
                    <li>
                      <button onClick={() => onNavigateToPage('pneus-pirelli-curitiba')} className="hover:text-yellow-600 transition cursor-pointer text-left flex items-center justify-between w-full">
                        <span>Pneus Pirelli Curitiba</span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                    </li>
                    <li>
                      <button onClick={() => onNavigateToPage('pneus-pirelli-em-curitiba-melhor-preco')} className="hover:text-yellow-600 transition cursor-pointer text-left flex items-center justify-between w-full">
                        <span>Pirelli em Curitiba Melhor Preço</span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                    </li>
                    <li>
                      <button onClick={() => onNavigateToPage('pneus-bridgestone-curitiba-precos')} className="hover:text-yellow-600 transition cursor-pointer text-left flex items-center justify-between w-full">
                        <span>Pneus Bridgestone Preços</span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                    </li>
                    <li>
                      <button onClick={() => onNavigateToPage('pneu-hankook-curitiba')} className="hover:text-yellow-600 transition cursor-pointer text-left flex items-center justify-between w-full">
                        <span>Pneus Hankook Curitiba</span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                    </li>
                    <li>
                      <button onClick={() => onNavigateToPage('xbri-pneus-curitiba')} className="hover:text-yellow-600 transition cursor-pointer text-left flex items-center justify-between w-full">
                        <span>XBRI Pneus Curitiba</span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Coluna 2: Preço & Distribuição */}
                <div className="bg-white border border-gray-200 p-5 rounded-2xl space-y-3 shadow-sm">
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 font-mono flex items-center gap-1.5 border-b border-gray-150 pb-2">
                    <ShoppingBag className="w-4 h-4 text-yellow-600" />
                    <span>Preço, Atacado & Compras</span>
                  </h4>
                  <ul className="space-y-2 text-xs font-bold text-gray-700">
                    <li>
                      <button onClick={() => onNavigateToPage('pneus-baratos-em-curitiba')} className="hover:text-yellow-600 transition cursor-pointer text-left flex items-center justify-between w-full">
                        <span>Pneus Baratos em Curitiba</span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                    </li>
                    <li>
                      <button onClick={() => onNavigateToPage('pneus-em-curitiba-melhor-preco')} className="hover:text-yellow-600 transition cursor-pointer text-left flex items-center justify-between w-full">
                        <span>Pneus em Curitiba Melhor Preço</span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                    </li>
                    <li>
                      <button onClick={() => onNavigateToPage('distribuidora-de-pneus-em-curitiba')} className="hover:text-yellow-600 transition cursor-pointer text-left flex items-center justify-between w-full">
                        <span>Distribuidora de Pneus Curitiba</span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                    </li>
                    <li>
                      <button onClick={() => onNavigateToPage('distribuidora-de-pneus-importados-atacado-curitiba')} className="hover:text-yellow-600 transition cursor-pointer text-left flex items-center justify-between w-full">
                        <span>Atacado de Pneus Importados</span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                    </li>
                    <li>
                      <button onClick={() => onNavigateToPage('melhor-site-para-comprar-pneus')} className="hover:text-yellow-600 transition cursor-pointer text-left flex items-center justify-between w-full">
                        <span>Melhor Site para Comprar Pneus</span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Coluna 3: Comparativos de Mercado */}
                <div className="bg-white border border-gray-200 p-5 rounded-2xl space-y-3 shadow-sm">
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 font-mono flex items-center gap-1.5 border-b border-gray-150 pb-2">
                    <Building className="w-4 h-4 text-yellow-600" />
                    <span>Comparativos Comerciais</span>
                  </h4>
                  <ul className="space-y-2 text-xs font-bold text-gray-700">
                    <li>
                      <button onClick={() => onNavigateToPage('bana-pneus')} className="hover:text-yellow-600 transition cursor-pointer text-left flex items-center justify-between w-full">
                        <span>Bana Pneus Curitiba Comparativo</span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                    </li>
                    <li>
                      <button onClick={() => onNavigateToPage('barao-pneus-e-oficina-bacacheri-curitiba')} className="hover:text-yellow-600 transition cursor-pointer text-left flex items-center justify-between w-full">
                        <span>Barão Pneus Bacacheri Comparativo</span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                    </li>
                    <li>
                      <button onClick={() => onNavigateToPage('barao-pneus-sao-jose-pinhais')} className="hover:text-yellow-600 transition cursor-pointer text-left flex items-center justify-between w-full">
                        <span>Barão Pneus São José dos Pinhais</span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                    </li>
                    <li>
                      <button onClick={() => onNavigateToPage('barao-pneus-e-oficina-portao')} className="hover:text-yellow-600 transition cursor-pointer text-left flex items-center justify-between w-full">
                        <span>Barão Pneus Portão Comparativo</span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                    </li>
                  </ul>
                </div>

              </div>
            </div>

            {/* SEÇÃO 4: HUBS POR MONTADORA & VEÍCULOS */}
            <div className="bg-white border border-gray-200 p-5 sm:p-6 rounded-2xl space-y-4 shadow-sm">
              <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                <Car className="w-5 h-5 text-yellow-600" />
                <h3 className="text-base sm:text-lg font-black uppercase text-gray-950 font-mono">
                  Hubs por Montadora de Veículos
                </h3>
              </div>
              <p className="text-xs text-gray-600 font-medium">
                Selecione a montadora do seu carro para carregar medidas originais, modelos recomendados e promoções de pneus compatíveis:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {[
                  { brand: 'BYD', label: 'BYD Elétricos/Híbridos', isSpecial: true },
                  { brand: 'Volkswagen', label: 'Volkswagen' },
                  { brand: 'Chevrolet', label: 'Chevrolet' },
                  { brand: 'Fiat', label: 'Fiat' },
                  { brand: 'Toyota', label: 'Toyota' },
                  { brand: 'Honda', label: 'Honda' },
                  { brand: 'Hyundai', label: 'Hyundai' },
                  { brand: 'Renault', label: 'Renault' },
                  { brand: 'Ford', label: 'Ford' },
                  { brand: 'Jeep', label: 'Jeep' },
                ].map((item) => (
                  <button
                    key={item.brand}
                    onClick={() => {
                      if (item.brand === 'BYD') {
                        onNavigateToPage('pneus-byd-curitiba');
                      } else {
                        onSelectSeoTarget({ type: 'carro', name: item.brand });
                      }
                    }}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      item.isSpecial 
                        ? 'bg-yellow-500/10 border-yellow-500 hover:bg-yellow-500/20 text-gray-950 font-black' 
                        : 'bg-gray-50 border-gray-200 hover:border-gray-400 hover:bg-white text-gray-800 font-bold'
                    }`}
                  >
                    <span className="text-xs uppercase">{item.label}</span>
                    <span className="text-[9px] text-gray-400 font-mono mt-1">Ver modelos & pneus →</span>
                  </button>
                ))}
              </div>
            </div>

            {/* SEÇÃO 5: HUBS POR ARO (R13 - R23) */}
            <div className="bg-white border border-gray-200 p-5 sm:p-6 rounded-2xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-600" />
                  <h3 className="text-base sm:text-lg font-black uppercase text-gray-950 font-mono">
                    Destaques por Medida de Aro (R13 a R23)
                  </h3>
                </div>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2 text-center font-mono w-full max-w-full min-w-0">
                {AROS.map((aro) => (
                  <button
                    key={`aro-link-${aro}`}
                    onClick={() => {
                      if (onSelectRimFromSeo) {
                        onSelectRimFromSeo(aro);
                      } else {
                        onSelectSeoTarget({ type: 'aro', name: `Aro ${aro}` });
                      }
                    }}
                    className="bg-gray-50 border border-gray-200 hover:border-yellow-600 hover:bg-yellow-500/10 py-3 rounded-xl text-gray-900 hover:text-yellow-650 font-black uppercase text-xs cursor-pointer shadow-sm transition"
                  >
                    R{aro}
                  </button>
                ))}
              </div>
            </div>

            {/* SEÇÃO 6: CIDADES DA REGIÃO METROPOLITANA (RMC) */}
            <div className="bg-white border border-gray-200 p-5 sm:p-6 rounded-2xl space-y-4 shadow-sm text-gray-800">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-yellow-600" />
                  <h3 className="text-base sm:text-lg font-black uppercase text-gray-950 font-mono">
                    Cidades da Região Metropolitana de Curitiba (RMC)
                  </h3>
                </div>
                <button
                  onClick={() => onNavigateToPage('regiao-metropolitana')}
                  className="text-xs font-mono font-bold text-yellow-650 hover:underline cursor-pointer"
                >
                  Ver Hub RMC Completo →
                </button>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-bold">
                {METROPOLITAN_CITIES.map((cidade) => (
                  <button
                    key={`cidade-link-${cidade}`}
                    onClick={() => onSelectSeoTarget({ type: 'cidade', name: cidade })}
                    className="bg-gray-50 border border-gray-200 hover:border-yellow-600 hover:bg-yellow-500/10 px-3 py-2 rounded-xl text-gray-750 hover:text-yellow-650 cursor-pointer shadow-sm transition"
                  >
                    {cidade}
                  </button>
                ))}
              </div>
            </div>

            {/* SEÇÃO 7: BAIRROS OFICIAIS DE CURITIBA (75 BAIRROS) */}
            <div className="bg-white border border-gray-200 p-5 sm:p-6 rounded-2xl space-y-4 shadow-sm text-gray-850">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <div className="flex items-center gap-2">
                  <Map className="w-5 h-5 text-yellow-600" />
                  <h3 className="text-base sm:text-lg font-black uppercase text-gray-950 font-mono">
                    Geolocalização: 75 Bairros Oficiais de Curitiba
                  </h3>
                </div>
                <button
                  onClick={() => onNavigateToPage('curitiba')}
                  className="text-xs font-mono font-bold text-yellow-650 hover:underline cursor-pointer"
                >
                  Ver Hub Curitiba Completo →
                </button>
              </div>
              <p className="text-xs text-gray-600 text-left font-medium">
                Clique sobre qualquer bairro de Curitiba para carregar instruções de percurso e vantagens até a nossa loja na Av. Pres. Arthur da Silva Bernardes, 1323 (Portão).
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 text-xs font-bold text-gray-700">
                {OFFICIAL_NEIGHBORHOODS.map((bairro) => (
                  <button
                    key={`bairro-link-${bairro}`}
                    onClick={() => onSelectSeoTarget({ type: 'bairro', name: bairro })}
                    className="text-left hover:text-yellow-600 transition py-1.5 px-2 rounded-lg hover:bg-yellow-500/5 cursor-pointer flex items-center gap-1.5 truncate border border-transparent hover:border-yellow-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 inline-block shrink-0"></span>
                    <span className="truncate">{bairro}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* SEÇÃO 8: VILAS, LOTEAMENTOS & BAIRROS NÃO OFICIAIS */}
            <div className="bg-white border border-gray-200 p-5 sm:p-6 rounded-2xl space-y-4 shadow-sm text-gray-850">
              <h3 className="text-base sm:text-lg font-black uppercase text-gray-950 font-mono border-b border-gray-200 pb-2">
                Vilas, Loteamentos & Bairros Não Oficiais (Buscas Populares em Curitiba)
              </h3>
              <p className="text-xs text-gray-600 text-left font-medium">
                Termos regionais e microrregiões de grande circulação em Curitiba:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5 text-xs font-bold text-gray-700">
                {NON_OFFICIAL_NEIGHBORHOODS.map((v) => (
                  <button
                    key={`non-off-link-${v.name}`}
                    onClick={() => onSelectSeoTarget({ type: 'bairro', name: v.name, region: v.region })}
                    className="text-left hover:text-yellow-600 transition py-2 px-2.5 cursor-pointer flex flex-col bg-gray-50 hover:bg-white rounded-xl border border-gray-200 hover:border-yellow-500 shadow-sm"
                  >
                    <span className="text-gray-900 font-extrabold truncate">{v.name}</span>
                    <span className="text-[9px] text-gray-400 truncate">Região {v.region}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* SEÇÃO 9: SUBDIVISÕES E MACRORREGIÕES */}
            <div className="bg-white border border-gray-200 p-5 sm:p-6 rounded-2xl space-y-4 shadow-sm text-gray-850">
              <h3 className="text-base sm:text-lg font-black uppercase text-gray-950 font-mono border-b border-gray-200 pb-2">
                Subdivisões e Macrorregiões de Curitiba
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {POPULAR_REGIONS.map((reg) => (
                  <div key={reg.name} className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-black text-yellow-600 uppercase font-mono">{reg.name}</h4>
                      <p className="text-[10px] text-gray-500 mt-0.5">{reg.subtitle}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-200">
                      {reg.subAreas.map((sa) => (
                        <button
                          key={sa}
                          onClick={() => onSelectSeoTarget({ type: 'bairro', name: sa, region: reg.name })}
                          className="bg-white border border-gray-200 hover:bg-yellow-500/10 px-2 py-1 rounded-lg text-[10px] text-gray-750 hover:text-yellow-650 font-bold transition cursor-pointer"
                        >
                          {sa}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SEÇÃO 10: INSTITUCIONAL & DOCUMENTAÇÃO TÉCNICA */}
            <div className="bg-gray-900 text-white rounded-3xl p-6 sm:p-8 space-y-4 border border-gray-800 shadow-md">
              <h3 className="text-base sm:text-lg font-black uppercase text-yellow-500 font-mono border-b border-gray-800 pb-2">
                Páginas Institucionais, Políticas & Sitemaps XML Técnicos
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-bold">
                <button
                  onClick={onNavigateHome}
                  className="bg-gray-950 hover:bg-yellow-500 hover:text-gray-950 border border-gray-800 p-3 rounded-xl text-left transition cursor-pointer"
                >
                  Catálogo & Início
                </button>
                <button
                  onClick={() => onNavigateToPage('quem-somos')}
                  className="bg-gray-950 hover:bg-yellow-500 hover:text-gray-950 border border-gray-800 p-3 rounded-xl text-left transition cursor-pointer"
                >
                  Quem Somos • Sobre a Carplus
                </button>
                <button
                  onClick={() => onNavigateToPage('contato')}
                  className="bg-gray-950 hover:bg-yellow-500 hover:text-gray-950 border border-gray-800 p-3 rounded-xl text-left transition cursor-pointer"
                >
                  Fale Conosco & Contato Oficial
                </button>
                <button
                  onClick={() => onNavigateToPage('politica-privacidades')}
                  className="bg-gray-950 hover:bg-yellow-500 hover:text-gray-950 border border-gray-800 p-3 rounded-xl text-left transition cursor-pointer"
                >
                  Política de Privacidade
                </button>
                <button
                  onClick={() => onNavigateToPage('politica-devolucao')}
                  className="bg-gray-950 hover:bg-yellow-500 hover:text-gray-950 border border-gray-800 p-3 rounded-xl text-left transition cursor-pointer"
                >
                  Política de Trocas & Devolução
                </button>
                <button
                  onClick={() => onNavigateToPage('admin-indexacao')}
                  className="bg-gray-950 hover:bg-yellow-500 hover:text-gray-950 border border-gray-800 p-3 rounded-xl text-left transition cursor-pointer flex items-center justify-between"
                >
                  <span>⚙️ Painel de Indexação (GSC)</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                </button>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-950 hover:bg-yellow-500 hover:text-gray-950 border border-gray-800 p-3 rounded-xl text-left transition flex items-center justify-between"
                >
                  <span>Sitemap XML Geral</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </a>
                <a
                  href="/sitemap-institucional.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-950 hover:bg-yellow-500 hover:text-gray-950 border border-gray-800 p-3 rounded-xl text-left transition flex items-center justify-between"
                >
                  <span>Sitemap Institucional XML</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </a>
                <a
                  href="/sitemap-carros.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-950 hover:bg-yellow-500 hover:text-gray-950 border border-gray-800 p-3 rounded-xl text-left transition flex items-center justify-between"
                >
                  <span>Sitemap Carros/BYD XML</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </a>
              </div>
            </div>

          </div>
        )}

        {/* VIEW: CONTATO COMPLETO */}
        {view === 'contato' && (
          <div className="space-y-8" id="view-contato-completo">
            <div className="text-center md:text-left">
              <span className="bg-black text-white font-black text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full inline-block shadow-sm">
                Atendimento Oficial Carplus
              </span>
              <h2 className="text-3xl sm:text-4xl font-black uppercase text-gray-950 mt-3 tracking-tight">
                Fale Conosco • <span className="text-[#f49e1a]">Página de Contato Completa</span>
              </h2>
              <p className="text-sm max-w-2xl mt-2 text-left leading-relaxed text-gray-650 font-semibold">
                Entre em contato conosco para agendamento de suspensão, revisão, freios, serviços sob medida ou para dúvidas de compras e reservas de pneus novos no Portão.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch pt-2">
              {/* Store details and Info cards */}
              <div className="space-y-6 flex flex-col justify-between">
                <div className="bg-white border-2 border-black rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                  <h3 className="text-lg font-black text-gray-950 uppercase border-b-2 border-black pb-2 select-none">
                    Informações de Contato Físico
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-black text-[#f49e1a] p-2.5 rounded-xl shrink-0">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs uppercase font-extrabold tracking-wider text-gray-400">Telefone Fixo / WhatsApp</h4>
                        <p className="text-base font-black text-gray-900 mt-0.5">(41) 3082-7282</p>
                        <p className="text-[11px] text-gray-500 font-bold">Fale conosco por ligação ou direct no aplicativo</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-black text-[#f49e1a] p-2.5 rounded-xl shrink-0">
                        <Navigation className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs uppercase font-extrabold tracking-wider text-gray-400">Nosso Endereço</h4>
                        <p className="text-base font-black text-gray-900 mt-0.5">Av. Pres. Arthur da Silva Bernardes, 1323</p>
                        <p className="text-[11px] text-gray-500 font-bold">Portão • Curitiba - PR • CEP: 80320-300</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-black text-[#f49e1a] p-2.5 rounded-xl shrink-0">
                        <Building className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs uppercase font-extrabold tracking-wider text-gray-400">Horários de Atendimento</h4>
                        <p className="text-sm font-black text-gray-900 mt-0.5">Segunda a Sexta: 08:00 – 18:00</p>
                        <p className="text-sm font-black text-gray-900">Sábados: 08:00 – 12:00</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-black text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow flex flex-col justify-between">
                  <div>
                    <h4 className="font-black text-[#f49e1a] uppercase text-sm tracking-widest">Compromisso Carplus</h4>
                    <p className="text-xs text-left text-gray-300 mt-2 leading-relaxed font-bold">
                      Transparência total e laudos técnicos precisos. Sem taxas embutidas, sem serviços dispensáveis e atendimento técnico qualificado com a nossa equipe no Portão.
                    </p>
                  </div>
                  <div className="pt-2">
                    <a
                      href="https://api.whatsapp.com/send?phone=554130827282&text=Olá%20Carplus!%20Desejo%20falar%20diretamente%20com%20a%20gerência%20para%20uma%20consulta."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#f49e1a] hover:bg-white hover:text-black text-black font-black text-[11px] uppercase tracking-wider px-4 py-3 rounded-xl block text-center transition-all duration-300 border-2 border-black shadow"
                    >
                      Falar Direto no WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              {/* Form column */}
              <div className="bg-white border-2 border-black rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                <h3 className="text-lg font-black text-gray-950 uppercase border-b-2 border-black pb-2 select-none">
                  Formulário de Contato e Orçamento
                </h3>

                {isContactSubmitted ? (
                  <div className="bg-gray-50 border-2 border-black p-6 rounded-2xl text-center space-y-4" id="success-contact-box">
                    <CheckCircle2 className="w-12 h-12 text-[#f49e1a] mx-auto animate-pulse" />
                    <h4 className="text-lg font-black uppercase text-black">Mensagem Enviada!</h4>
                    <p className="text-xs text-gray-600 font-bold">
                      Obrigado! Um assistente técnico irá responder você diretamente em instantes ou abrir o WhatsApp para dar continuidade.
                    </p>
                    <button 
                      type="button"
                      onClick={() => setIsContactSubmitted(false)}
                      className="bg-black text-white hover:bg-neutral-900 font-black text-[11px] uppercase tracking-wider px-4 py-2.5 rounded-xl transition border-2 border-black"
                      style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.9)' }}
                    >
                      Enviar Nova Mensagem
                    </button>
                  </div>
                ) : (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      const wpText = `Olá Carplus! Gostaria de falar com vocês.\n\n*Nome:* ${contactName}\n*Telefone:* ${contactPhone}\n*Placa do Veículo:* ${contactPlate || 'Não informada'}\n*Mensagem:* ${contactMessage}`;
                      window.open(`https://api.whatsapp.com/send?phone=554130827282&text=${encodeURIComponent(wpText)}`, '_blank');
                      setIsContactSubmitted(true);
                      setContactName('');
                      setContactPhone('');
                      setContactPlate('');
                      setContactMessage('');
                    }} 
                    className="space-y-4" 
                    id="contact-page-form"
                  >
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-extrabold text-gray-700 mb-1">
                        Seu Nome Completo (obrigatório)
                      </label>
                      <input 
                        type="text" 
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Ex: João da Silva"
                        className="w-full bg-white border-2 border-black rounded-xl px-3.5 py-2.5 text-xs text-black font-semibold focus:outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-extrabold text-gray-700 mb-1">
                        Seu Whatsapp ou Telefone (obrigatório)
                      </label>
                      <input 
                        type="tel" 
                        required
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="Ex: (41) 99999-9999"
                        className="w-full bg-white border-2 border-black rounded-xl px-3.5 py-2.5 text-xs text-black font-semibold focus:outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-extrabold text-gray-700 mb-1">
                        Placa do Veículo / Modelo (opcional)
                      </label>
                      <input 
                        type="text" 
                        value={contactPlate}
                        onChange={(e) => setContactPlate(e.target.value)}
                        placeholder="Ex: Fiat Argo - ABC1D23"
                        className="w-full bg-white border-2 border-black rounded-xl px-3.5 py-2.5 text-xs text-black font-semibold focus:outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-extrabold text-gray-700 mb-1">
                        Sua Mensagem ou Dúvida (obrigatório)
                      </label>
                      <textarea 
                        rows={4}
                        required
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Diga qual pneu procura ou qual serviço deseja agendar..."
                        className="w-full bg-white border-2 border-black rounded-xl px-3.5 py-2.5 text-xs text-black font-semibold focus:outline-none focus:border-black resize-none"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#f49e1a] hover:bg-black hover:text-white text-black font-black text-xs uppercase tracking-widest py-3 px-4 rounded-xl border-2 border-black shadow-md transition duration-300"
                      id="contact-form-submit-btn"
                    >
                      Enviar agora pelo WhatsApp
                    </button>
                  </form>
                )}
              </div>
            </div>
            
            <CarplusVideosSection />
          </div>
        )}

        {/* VIEW: CURITIBA HUBS (Always indexable) */}
        {view === 'curitiba' && (() => {
          const rate = getSavedGSCRate();
          const curitibaBairros = getAllNeighborhoods();
          
          return (
            <div className="space-y-8 animate-fade-in text-gray-900 pb-12" id="view-curitiba-hub">
              {/* Breadcrumb List JSON-LD Schema */}
              <script type="application/ld+json">
                {JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "BreadcrumbList",
                  "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.carpluspneuseoficina.com.br" },
                    { "@type": "ListItem", "position": 2, "name": "Curitiba", "item": "https://www.carpluspneuseoficina.com.br/curitiba" }
                  ]
                })}
              </script>

              {/* Hub Intro */}
              <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="text-center sm:text-left space-y-3">
                  <span className="bg-yellow-500/15 text-gray-950 font-mono font-black text-[10px] uppercase tracking-widest px-3.5 py-1.5 rounded-full inline-block">
                    Diretório Municipal de Curitiba
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-black uppercase text-gray-950 font-mono">
                    Pneus em Curitiba • <span className="text-yellow-600">Atendimento por Bairros</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-650 leading-relaxed max-w-4xl">
                    Selecione sua região abaixo para conferir ofertas exclusivas de pneus novos <strong>Pirelli, Goodyear, Michelin, Bridgestone, Delinte</strong> e mais. Compre diretamente online e usufrua de nossa instalação profissional computadorizada e alinhamento 3D no Portão!
                  </p>
                </div>
              </div>

              {/* Segment 1: Priority Neighborhoods (Wave 1) */}
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-gray-900 flex items-center gap-2 font-mono">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  Regiões de Destaque (Fácil Acesso à Sede do Portão)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {PRIORITY_NEIGHBORHOODS.map(name => {
                    return (
                      <button
                        key={name}
                        onClick={() => onSelectSeoTarget({ type: 'bairro', name })}
                        className="bg-white hover:bg-yellow-500/5 border-2 border-gray-200 hover:border-yellow-500 rounded-xl p-3 text-left transition shrink-0 cursor-pointer text-xs font-bold flex flex-col justify-between"
                      >
                        <span className="text-gray-950 block">{name}</span>
                        <span className="text-[9px] text-gray-400 font-mono font-medium mt-1">
                          Score Local: {calculateLocalScore(name, 'bairro')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Segment 2: All Other Neighborhoods */}
              <div className="space-y-4 border-t border-gray-150 pt-8">
                <h3 className="text-sm font-black uppercase tracking-wider text-gray-900 flex items-center gap-2 font-mono">
                  <Navigation className="w-4 h-4 text-gray-400" />
                  Todos os Bairros Cadastrados e Cobertos
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {curitibaBairros.filter(n => !PRIORITY_NEIGHBORHOODS.includes(n)).sort().map(name => {
                    return (
                      <button
                        key={name}
                        onClick={() => onSelectSeoTarget({ type: 'bairro', name })}
                        className="bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-400 rounded-xl p-2.5 text-left transition shrink-0 cursor-pointer text-[11px] font-bold text-gray-750 hover:text-black flex flex-col justify-between"
                      >
                        <span>{name}</span>
                        <span className="text-[8px] text-gray-400 font-mono mt-0.5">
                          Score: {calculateLocalScore(name, 'bairro')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Hub FAQ Section */}
              <div className="bg-white border text-gray-900 border-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                <h3 className="text-base font-black uppercase text-gray-950 font-mono border-b border-gray-200 pb-3">
                  Dúvidas Frequentes sobre Atendimento em Curitiba
                </h3>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <p className="text-xs uppercase font-extrabold tracking-wider text-gray-500 font-mono">Onde fica localizada a oficina Carplus?</p>
                    <p className="text-xs sm:text-sm text-gray-750 leading-relaxed font-bold">Ficamos localizados estrategicamente na Av. Presidente Arthur da Silva Bernardes, 1323, no bairro Portão em Curitiba (PR). Nossas amplas instalações contam com boxes de atendimento expresso, rampa de geometria 3D alemã de última linha e sala de espera climatizada de padrão executivo.</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs uppercase font-extrabold tracking-wider text-gray-500 font-mono">Como faço para reservar pneus novos online?</p>
                    <p className="text-xs sm:text-sm text-gray-750 leading-relaxed font-bold">Basta navegar no catálogo desse site, selecionar as borrachas, e clicar no botão de compra. Seus pneus ficarão reservados de graça, e você só paga na recepção física da nossa loja após eles estarem instalados e montados no veículo por nossos mecânicos seniores.</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* VIEW: REGIAO METROPOLITANA HUBS (Always indexable) */}
        {view === 'regiao-metropolitana' && (() => {
          const rate = getSavedGSCRate();
          const rmcCities = getAllCities();

          return (
            <div className="space-y-8 animate-fade-in text-gray-900 pb-12" id="view-rmc-hub">
              {/* Breadcrumb List JSON-LD Schema */}
              <script type="application/ld+json">
                {JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "BreadcrumbList",
                  "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.carpluspneuseoficina.com.br" },
                    { "@type": "ListItem", "position": 2, "name": "Região Metropolitana", "item": "https://www.carpluspneuseoficina.com.br/regiao-metropolitana" }
                  ]
                })}
              </script>

              {/* Hub Intro */}
              <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="text-center sm:text-left space-y-3">
                  <span className="bg-yellow-500/15 text-gray-950 font-mono font-black text-[10px] uppercase tracking-widest px-3.5 py-1.5 rounded-full inline-block">
                    Diretório da Grande Curitiba (RMC)
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-black uppercase text-gray-950 font-mono">
                    Pneus na Região Metropolitana • <span className="text-yellow-600">Serviços e Pronta Entrega</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-650 leading-relaxed max-w-4xl">
                    Selecione seu município na Região Metropolitana em que reside. Agende sua instalação e montagem técnica em nossa loja-sede do Portão, Curitiba. Pneus novos com garantia oficial de fábrica.
                  </p>
                </div>
              </div>

              {/* Segment 1: Priority Cities (Wave 1) */}
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-gray-900 flex items-center gap-2 font-mono">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  Cidades com Atendimento Expresso Integrado
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {PRIORITY_CITIES.map(name => {
                    return (
                      <button
                        key={name}
                        onClick={() => onSelectSeoTarget({ type: 'cidade', name })}
                        className="bg-white hover:bg-yellow-500/5 border-2 border-gray-200 hover:border-yellow-500 rounded-xl p-3 text-left transition shrink-0 cursor-pointer text-xs font-bold flex flex-col justify-between"
                      >
                        <span className="text-gray-950 block">{name}</span>
                        <span className="text-[9px] text-gray-400 font-mono mt-1">
                          Score Local: {calculateLocalScore(name, 'cidade')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Segment 2: Other RMC Cities */}
              <div className="space-y-4 border-t border-gray-150 pt-8">
                <h3 className="text-sm font-black uppercase tracking-wider text-gray-900 flex items-center gap-2 font-mono">
                  <Navigation className="w-4 h-4 text-gray-400" />
                  Todos os Municípios da Grande Curitiba Atendidos
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {rmcCities.filter(c => !PRIORITY_CITIES.includes(c)).sort().map(name => {
                    return (
                      <button
                        key={name}
                        onClick={() => onSelectSeoTarget({ type: 'cidade', name })}
                        className="bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-400 rounded-xl p-2.5 text-left transition shrink-0 cursor-pointer text-[11px] font-bold text-gray-750 hover:text-black flex flex-col justify-between"
                      >
                        <span>{name}</span>
                        <span className="text-[8px] text-gray-400 font-mono mt-0.5">
                          Score: {calculateLocalScore(name, 'cidade')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Hub Attendance Details */}
              <div className="bg-white border text-gray-900 border-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                <h3 className="text-base font-black uppercase text-gray-950 font-mono border-b border-gray-200 pb-3">
                  Instalação Técnica para Clientes da RMC
                </h3>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-bold bg-gray-50 p-4 rounded-xl border border-gray-150">
                  ⚠️ <strong>Atenção morador da Região Metropolitana:</strong> O agendamento é sincronizado de forma instantânea através do nosso canais digitais do WhatsApp. Devido à alta rotatividade do nosso estoque físico, sugerimos encomendar as borrachas via site para garantir as tarifas e a disponibilidade das medidas ideais para seu modelo de automóvel.
                </p>
              </div>
            </div>
          );
        })()}

        {/* VIEW: ADMINISTRATIVE WAVE INDEXING DASHBOARD (Never indexed) */}
        {view === 'admin-indexacao' && (
          <AdminIndexacaoSection onNavigateHome={onNavigateHome} />
        )}

        {/* VIEW: SEO DYNAMIC LANDING PAGE */}
        {view === 'seo-landing' && seoTarget && (() => {
          const sampleSearched = getMostSearchedTires(seoTarget.name, seoTarget.type);
          const isAro = seoTarget.type === 'aro';
          const isCarro = seoTarget.type === 'carro';

          let targetTires: any[] = [];
          let ratioText = '';

          if (isAro) {
            const extracted = seoTarget.name.match(/\d+/);
            const targetRim = extracted ? parseInt(extracted[0]) : null;
            targetTires = targetRim ? TIRES_DATA.filter(t => t.rim === targetRim) : [];
          } else if (isCarro) {
            const normalizedCarName = seoTarget.name.toLowerCase();
            const matchedCar = CAR_MODELS_DATA.find(c => 
              normalizedCarName.includes(c.name.toLowerCase()) || 
              c.name.toLowerCase().includes(normalizedCarName) ||
              normalizedCarName.includes(c.brand.toLowerCase() + " " + c.name.toLowerCase())
            );
            if (matchedCar) {
              const ratio = matchedCar.recommendedTireRatio;
              ratioText = ratio;
              const parts = ratio.split('/');
              if (parts.length >= 3) {
                const [w, a, r] = parts.map(Number);
                targetTires = TIRES_DATA.filter(t => t.width === w && t.aspectRatio === a && t.rim === r);
              }
            }
          } else {
            // Curated offers for local neighborhoods or cities
            targetTires = TIRES_DATA.filter(t => t.isOffer).slice(0, 8);
          }

          if (isCarro && targetTires.length === 0 && ratioText) {
            const parts = ratioText.split('/');
            if (parts.length >= 3) {
              const r = parseInt(parts[2]);
              targetTires = TIRES_DATA.filter(t => t.rim === r);
            }
          }

          const localFaq = [
            {
              q: `A Carplus Pneus realmente atende moradores de ${seoTarget.name}?`,
              a: `Sim, atendemos todos os condutores da região de ${seoTarget.name} com montagem técnica especializada de pneus adquiridos aqui no portal, balanceamento computadorizado e alinhamento 3D no Portão.`
            },
            {
              q: `Como faço para chegar de ${seoTarget.name} até a loja no Portão?`,
              a: `O percurso de carro saindo de ${seoTarget.name} dura pouquíssimos minutos. A distância estimada é de aproximadamente ${getRouteInstructions(seoTarget.name, seoTarget.type).distance} e o tempo estimado de percurso é de cerca de ${getRouteInstructions(seoTarget.name, seoTarget.type).time} de carro, seguindo as indicações do roteiro prático e de fácil acesso listado em nosso painel.`
            },
            {
              q: "Quais são as marcas de pneus novos disponíveis em estoque?",
              a: "Contamos com estoque à pronta entrega de grandes fabricantes de renome internacional com certificação completa do INMETRO, tais como Pirelli, Bridgestone, Michelin, Goodyear, Firestone, Dunlop, Delinte, Comforser e Xbri."
            },
            {
              q: "Como funciona a garantia de 5 anos das borrachas?",
              a: "Todos os pneus novos comercializados na Carplus possuem garantia de fábrica estendida de cinco anos contra eventuais imperfeições estruturais ou vícios de fundição. No ato da sua montagem, nossos técnicos ainda realizam um teste de suspensão preventivo completo."
            },
            {
              q: "Como reservo o pneu e quando realiza o pagamento?",
              a: "A reserva das unidades é efetuada totalmente online sem custos adicionais. Você não faz nenhum pagamento digital no site. O agendamento é sincronizado direto com nosso WhatsApp comercial e você só paga na nossa recepção física após os pneus estarem devidamente instalados no carro."
            }
          ];

          const CARPLUS_GALLERY = [
            { url: '/images/carplus-real/rampa-de-geometria.webp', fallback: '/images/galeria/rampa-de-geometria.jpg', label: 'Rampa de geometria da Carplus' },
            { url: '/images/carplus-real/montagem-tecnica.webp', fallback: '/images/galeria/montagem-tecnica.jpg', label: 'Montagem de pneus na nossa oficina' },
            { url: '/images/carplus-real/alinhamento.webp', fallback: '/images/galeria/alinhamento.jpg', label: 'Equipamento de alinhamento da unidade Portão' },
            { url: '/images/carplus-real/tecnicos.webp', fallback: '/images/galeria/tecnicos.jpg', label: 'Atendimento técnico na oficina Carplus' },
            { url: '/images/carplus-real/consultoria-avaliacao-estrutural.webp', fallback: '/images/galeria/consultoria-avaliacao-estrutural.jpg', label: 'Atendimento na unidade Portão' },
            { url: '/images/carplus-real/auto-center-pneus-portao.webp', fallback: '/images/galeria/auto-center-pneus-portao.jpg', label: 'Equipamentos e estrutura da nossa oficina' }
          ];

          return (
            <div className="space-y-8 animate-fade-in" id="view-seo-landing">
              
              {/* If it's an Aro page (16 to 23), display the complete Authority Hub Component */}
              {seoTarget.type === 'aro' && (
                <RimAuthoritySection 
                  aroName={seoTarget.name}
                  onSelectAro={(newAro) => {
                    window.history.pushState(null, '', `/aro/${newAro}`);
                    window.dispatchEvent(new Event('popstate'));
                  }}
                />
              )}

              {/* Dynamic content rendering with Premium Hero Carousel (Pure White / Crisp Style) */}
              <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 sm:p-8 space-y-8 shadow-sm text-gray-900" id="seo-hero-whitesection">
                
                {/* Hero section splits in two - shown only for non-aro pages */}
                {seoTarget.type !== 'aro' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-gray-200 pb-8">
                    <div className="lg:col-span-7 space-y-4 text-center sm:text-left">
                      <span className="bg-yellow-500/15 text-gray-900 border border-[#f49e1a]/35 font-mono font-black text-[10px] uppercase tracking-widest px-3.5 py-1.5 rounded-full inline-block">
                        {seoTarget.type === 'bairro' ? 'Bairro / Região de Curitiba' : 
                         seoTarget.type === 'cidade' ? 'Município Região Metropolitana (RMC)' : 
                         'Guia Homologado de Automóvel'}
                      </span>
                      
                      <h2 className="text-2xl sm:text-4xl font-black text-gray-950 uppercase tracking-tight leading-tight select-none">
                        {seoTarget.type === 'bairro' && `Pneus em Curitiba - Bairro ${seoTarget.name}`}
                        {seoTarget.type === 'cidade' && `Pneus na Região Metropolitana - Fácil Acesso em ${seoTarget.name}`}
                        {seoTarget.type === 'carro' && `Pneus Homologados Originais para ${seoTarget.name}`}
                      </h2>
                      
                      <p className="text-xs text-yellow-600 uppercase font-mono font-black tracking-wider">
                        Serviços de Troca de Pneus, Alinhamento 3D e Freios para condutores de {seoTarget.name}
                      </p>

                      <div className="space-y-4 text-xs sm:text-sm text-gray-650 text-left leading-relaxed font-semibold">
                        <p>
                          A <strong className="text-gray-900">Carplus Pneus & Oficina</strong> está localizada na Av. Presidente Arthur da Silva Bernardes, 1323, no bairro Portão em Curitiba - PR, e atende com excelência clientes de <strong className="text-yellow-650">{seoTarget.name}</strong> e toda a Região Metropolitana.
                        </p>
                        <p>
                          Oferecemos um portfólio completo com as marcas líderes do mercado em estoque (Bridgestone, Michelin, Pirelli, Dunlop, Goodyear, Continental e muito mais). Todos os pneus contam com opção de montagem técnica especializada e alinhamento 3D em nossa loja sede do Portão.
                        </p>
                      </div>
                    </div>

                    {/* Spotlight Offers premium animated container - Styled to White/Grey */}
                    <div className="lg:col-span-5 bg-gray-50 border border-gray-250 p-5 rounded-3xl relative overflow-hidden flex flex-col justify-between h-[360px] shadow-sm">
                      <div className="absolute top-0 right-0 bg-[#f49e1a] text-gray-950 font-black text-[9px] uppercase tracking-wider px-3.5 py-1 rounded-bl-xl font-mono flex items-center gap-1 z-10 border-b border-l border-gray-300">
                        <Flame className="w-3 h-3 animate-pulse text-gray-950" />
                        <span>Oferta Especial Local</span>
                      </div>

                      {offersOnSale.length > 0 && (
                        <div className="relative flex-grow flex flex-col justify-center">
                          <AnimatePresence mode="wait">
                            {offersOnSale.map((t, idx) => {
                              if (idx !== activeOfferIdx) return null;
                              return (
                                <motion.div
                                  key={t.id}
                                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                  transition={{ duration: 0.3 }}
                                  className="flex flex-col justify-between h-full pt-4"
                                >
                                  <div className="flex justify-center flex-grow items-center bg-white rounded-2xl p-2 border border-gray-200">
                                    <img 
                                      src={t.image} 
                                      alt={t.name} 
                                      className="h-28 object-contain"
                                      referrerPolicy="no-referrer"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = getBrandFallbackImage(t.brand, t.id);
                                      }}
                                    />
                                  </div>
                                  <div className="text-center mt-3 space-y-0.5">
                                    <span className="text-[10px] text-yellow-600 font-mono tracking-widest font-black uppercase">
                                      {t.brand}
                                    </span>
                                    <h4 className="text-gray-900 font-black text-xs uppercase truncate max-w-xs mx-auto">
                                      {t.name}
                                    </h4>
                                    <div className="flex items-center justify-center gap-2 mt-1">
                                      <span className="text-sm font-black text-[#1ebd53] uppercase tracking-wider">
                                        Preço Sob Consulta
                                      </span>
                                    </div>
                                  </div>
                                  <div className="pt-3">
                                    <a
                                      href={formatWhatsApp(`Olá Carplus! Vi o Pneu ${t.name} nas buscas do bairro/cidade ${seoTarget.name} e gostaria de reservá-lo para instalação inclusa.`)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white hover:text-white font-black py-2.5 rounded-xl text-[10px] uppercase tracking-wider transition text-center block cursor-pointer border border-[#1ebd53] shadow-sm"
                                    >
                                      Consultar pelo WhatsApp
                                    </a>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </AnimatePresence>
                        </div>
                      )}

                      {/* Dot Indicators */}
                      <div className="flex justify-center gap-1.5 mt-2 z-10">
                        {offersOnSale.map((_, dotIdx) => (
                          <button
                            key={dotIdx}
                            onClick={() => setActiveOfferIdx(dotIdx)}
                            className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                              dotIdx === activeOfferIdx ? 'bg-yellow-600 w-3' : 'bg-gray-300'
                            }`}
                            aria-label={`Slide ${dotIdx}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Specific local most searched tires section */}
                <div className="space-y-4">
                  <h4 className="text-sm font-black text-gray-950 uppercase border-l-4 border-yellow-500 pl-3 leading-tight select-none font-mono">
                    Pneus Mais Procurados localmente por condutores em {seoTarget.name}
                  </h4>
                  <p className="text-xs text-gray-600">
                    Abaixo listamos as medidas de pneus novos e marcas homologadas que apresentam campeões históricos de buscas para veículos residindo ou circulando em {seoTarget.name}:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {sampleSearched.map((p, idx) => (
                      <div key={idx} className="bg-white border-2 border-gray-150 rounded-2xl p-4 flex flex-col justify-between space-y-4 shadow-sm">
                        <div>
                          <span className="text-yellow-650 bg-yellow-500/10 font-mono font-black text-[9px] uppercase px-2 py-0.5 rounded border border-yellow-500/25 inline-block">
                            {p.category}
                          </span>
                          <h5 className="text-gray-900 font-black text-sm uppercase mt-2 font-display">
                            Medida Ideal: {p.medida}
                          </h5>
                          <p className="text-[11px] text-gray-550 mt-1.5 text-left leading-relaxed font-semibold">
                            {p.motivo}
                          </p>
                          {p.sugestao && (
                            <p className="text-[10px] text-gray-500 font-mono mt-2 uppercase">
                              Sugestão de Estoque: <strong className="text-gray-900 font-extrabold">{p.sugestao.brand} {p.sugestao.model}</strong>
                            </p>
                          )}
                        </div>

                        <a 
                          href={formatWhatsApp(`Olá Carplus! Gostaria de consultar preços de pneus na medida ${p.medida} para meu carro, sabendo do guia mais buscado do bairro/localidade ${seoTarget.name}.`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-[#1e2026] hover:bg-yellow-500 hover:text-gray-950 text-[#f49e1a] font-black border border-black py-2 rounded-xl text-[10px] uppercase tracking-wider text-center transition cursor-pointer"
                        >
                          Consultar Preço da Medida
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* MATCHING REAL TIRES DYNAMIC CATALOG GRID */}
                <div className="space-y-4 border-t border-gray-150 pt-7">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                    <div>
                      {isAro && (
                        <>
                          <h4 className="text-sm font-black text-gray-950 uppercase border-l-4 border-yellow-500 pl-3 leading-tight select-none font-mono">
                            Estoque Imediato no {seoTarget.name}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">
                            Abaixo listamos todos os modelos de pneus novos nacionais e importados de **{seoTarget.name}** disponíveis em Curitiba:
                          </p>
                        </>
                      )}
                      {isCarro && (
                        <>
                          <h4 className="text-sm font-black text-gray-950 uppercase border-l-4 border-yellow-500 pl-3 leading-tight select-none font-mono">
                            Pneus Compatíveis com {seoTarget.name} {ratioText ? `(${ratioText})` : ''}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">
                            Veja os pneus novos no estoque correspondentes à medida oficial ou compatíveis do seu carro:
                          </p>
                        </>
                      )}
                      {!isAro && !isCarro && (
                        <>
                          <h4 className="text-sm font-black text-gray-950 uppercase border-l-4 border-yellow-500 pl-3 leading-tight select-none font-mono">
                            Destaques em Oferta com Pronta Entrega para {seoTarget.name}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">
                            Pneus novos com pronta entrega e montagem especializada para motoristas de {seoTarget.name}:
                          </p>
                        </>
                      )}
                    </div>
                    <span className="font-mono text-[10px] bg-[#f49e1a]/15 text-yellow-650 font-black px-2.5 py-1 rounded border border-[#f49e1a]/30 uppercase shrink-0">
                      {targetTires.length} Pneus em Estoque
                    </span>
                  </div>

                  {targetTires.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="seo-page-tire-grid">
                      {targetTires.map((t) => (
                        <div key={t.id} className="h-full">
                          <TireCard 
                            tire={t}
                            onAddToCart={(tire, qty) => {
                              if (onAddToCart) {
                                onAddToCart(tire, qty);
                              } else {
                                const whatsappUrl = `https://wa.me/554130827282?text=Olá%20Carplus!%20Gostaria%20de%20reservar%20${qty}%20unidades%20do%20pneu%20${encodeURIComponent(tire.name)}%20com%20instalação%20profissional%252c%20vi%20na%20página%20de%20${encodeURIComponent(seoTarget.name)}.`;
                                window.open(whatsappUrl, '_blank');
                              }
                            }}
                            onSelectTire={(tire) => {
                              if (onSelectTire) {
                                onSelectTire(tire);
                              }
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-yellow-500/5 border border-[#f49e1a]/15 p-6 rounded-2xl text-center space-y-2">
                       <p className="text-xs font-black text-gray-900 uppercase">Gama Completa Sob Demanda</p>
                       <p className="text-[11px] text-gray-600 max-w-md mx-auto leading-relaxed">
                         Não localizamos unidades de estoque imediato para esta medida específica agora, mas podemos importar e faturar direto do atacado em até 24 horas, mantendo a instalação profissional no Portão!
                       </p>
                       <a 
                         href={formatWhatsApp(`Olá Carplus! Gostaria de consultar pneu para meu veículo ${seoTarget.name}, que vi na página do site.`)}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="inline-block bg-black text-white hover:bg-[#f49e1a] hover:text-black font-mono font-black text-[10px] uppercase tracking-wider py-2 px-4 rounded-xl transition cursor-pointer" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.9)' }}
                       >
                         Consultar Medida Personalizada ➔
                       </a>
                    </div>
                  )}
                </div>

                {/* Route instructions box - percurso */}
                <div className="bg-gray-50 border border-gray-150 p-5 rounded-2xl space-y-3.5 font-sans shadow-inner text-gray-900">
                  <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
                    <Navigation className="w-5 h-5 text-yellow-600 shrink-0" />
                    <h4 className="text-sm font-black text-gray-950 uppercase tracking-widest font-mono">Percurso Recomendado até a Unidade Carplus Portão</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                    <div className="bg-white p-3 rounded-xl border border-gray-200">
                      <p className="text-[10px] text-gray-400 uppercase font-mono font-bold">Origem da Partida</p>
                      <p className="font-extrabold text-gray-900 uppercase mt-0.5">{seoTarget.name}</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-gray-200">
                      <p className="text-[10px] text-gray-400 uppercase font-mono font-bold">Distância Estimada</p>
                      <p className="font-black text-yellow-650 font-mono text-sm mt-0.5">
                        {getRouteInstructions(seoTarget.name, seoTarget.type).distance}
                      </p>
                    </div>
                    <div className="bg-yellow-500/10 border border-[#f49e1a]/20 p-3 rounded-xl">
                      <p className="text-[10px] text-yellow-650 uppercase font-mono font-extrabold">Tempo Médio de Carro</p>
                      <p className="font-black text-yellow-650 font-mono text-sm mt-0.5">
                        {getRouteInstructions(seoTarget.name, seoTarget.type).time}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-gray-700 leading-relaxed text-left bg-white p-3.5 rounded-xl border border-gray-200 uppercase font-mono font-bold shadow-sm">
                    <strong className="text-gray-900 block uppercase text-[10px] tracking-wider mb-2 font-sans font-black">Passo a passo do percurso:</strong>
                    {getRouteInstructions(seoTarget.name, seoTarget.type).route}
                  </div>

                  <div className="text-[10px] text-gray-500 text-left flex items-start gap-1.5 font-medium leading-relaxed">
                    <AlertCircle className="w-4 h-4 text-[#f49e1a] shrink-0 mt-0.5" />
                    <p>
                      <strong>Atenção:</strong> Siga com segurança, respeitando as faixas exclusivas dos ônibus expressos biarticulados nas canaletas de Curitiba. Estamos localizados na Avenida Arthur Bernardes, uma avenida de super fácil acesso, com pátio amplo para manobras de veículos médios, caminhonetes ou SUVs.
                    </p>
                  </div>
                </div>

                {/* Real photo gallery showcasing Carplus workshop */}
                <div className="space-y-4">
                  <h4 className="text-sm font-black text-gray-950 uppercase border-l-4 border-yellow-500 pl-3 leading-tight select-none font-mono">
                    Estrutura Física Carplus: Nossa Loja em Curitiba
                  </h4>
                  <p className="text-xs text-gray-600">
                    Veja fotos reais de nossa infraestrutura na Unidade Portão, equipada com rampas computadorizadas de Alinhamento 3D:
                  </p>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {CARPLUS_GALLERY.map((img, idx) => (
                      <figure key={idx} className="overflow-hidden rounded-2xl border border-[#f59c00]/25 bg-[#111111]">
                        <img 
                          src={img.url} 
                          onError={(e) => {
                            const image = e.currentTarget;
                            if (image.dataset.realFallback) return;
                            image.dataset.realFallback = 'true';
                            image.src = img.fallback;
                          }}
                          alt={img.label}
                          width="1384"
                          height="924"
                          loading="lazy"
                          decoding="async"
                          className="aspect-[3/2] w-full object-cover"
                        />
                        <figcaption className="border-t border-white/10 px-4 py-4 text-[16px] leading-relaxed text-[#c3c3c3]">{img.label}</figcaption>
                      </figure>
                    ))}
                  </div>
                </div>

                {/* Advantages highlighted list */}
                <div className="space-y-4">
                  <h4 className="text-sm font-black text-gray-950 uppercase border-l-4 border-yellow-500 pl-3 leading-tight select-none font-mono">
                    Vantagens em Escolher a Carplus Pneus
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { title: "35 Anos de Tradição de Mercado", desc: "Desde 1991 garantindo honestidade e precisão no orçamento, sem forçar reparos indesejados." },
                      { title: "Técnicos Treinados e Habilitados", desc: "Troca e alinhamento com maquinário anti-risco, calibragem computadorizada e testes de rolagem." },
                      { title: "Geometria 3D e Alinhamento Preciso", desc: "Nossos equipamentos ajustam os eixos de cambagem seguindo as especificações exatas do seu modelo." },
                      { title: "Maior Nota de Aprovação no Google Mapas", desc: "Reconhecimento comprovado e real no mapa de Curitiba, com milhares de clientes satisfeitos recomendando." },
                      { title: "Facilidade de Pagamento Presencial", desc: "Parcele tudo em até 10x sem juros no cartão de crédito físico diretamente na nossa entrega técnica." },
                      { title: "Melhor Medida com Nota INMETRO", desc: "Segurança total em curvas sob pista molhada no inverno característico de Curitiba." }
                    ].map((adv, idx) => (
                      <div key={idx} className="bg-gray-50 border border-gray-200 p-4 rounded-xl flex gap-3 shadow-inner">
                        <CheckCircle2 className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-extrabold text-gray-905 text-xs uppercase">{adv.title}</h5>
                          <p className="text-[11px] text-gray-600 mt-1 text-left leading-relaxed font-semibold">{adv.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Local FAQ Accordion container */}
                <div className="space-y-4 border-t border-gray-200 pt-6 text-gray-900">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-yellow-600 shrink-0" />
                    <h4 className="text-sm font-black text-gray-950 uppercase tracking-wider font-mono">Perguntas Frequentes (FAQ) de Atendimento</h4>
                  </div>
                  <p className="text-xs text-gray-600">
                    Consulte as principais dúvidas sobre frete, agendamento de orçamento online e serviços executados na nossa autocenter:
                  </p>

                  <div className="space-y-2.5">
                    {localFaq.map((faq, idx) => {
                      const isOpen = activeFaqIdx === idx;
                      return (
                        <div key={idx} className="bg-gray-55 border border-gray-200 rounded-xl overflow-hidden transition-all duration-300">
                          <button
                            onClick={() => setActiveFaqIdx(isOpen ? null : idx)}
                            className="w-full flex items-center justify-between p-4 text-left text-gray-800 hover:text-yellow-650 transition cursor-pointer font-black text-xs sm:text-sm uppercase bg-gray-50"
                          >
                            <span>{faq.q}</span>
                            {isOpen ? (
                              <ChevronUp className="w-4 h-4 text-yellow-500 shrink-0" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-yellow-500 shrink-0" />
                            )}
                          </button>
                          
                          {isOpen && (
                            <div className="p-4 pt-4 border-t border-gray-200 bg-white text-xs text-gray-600 leading-relaxed text-left font-semibold">
                              {faq.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <CarplusVideosSection />

                {/* Direct Cross-Linking Menu satisfying: 'crie links internos entre as paginas pneus, bairro e cidade e aro e marcas' */}
                <div className="bg-yellow-500/5 border-2 border-dashed border-[#f49e1a]/30 rounded-2xl p-5 sm:p-6 space-y-4 text-gray-900" id="seo-deep-internal-links">
                  <h4 className="text-xs sm:text-sm font-black text-gray-950 uppercase tracking-widest flex items-center gap-2 font-mono">
                    <InfoIcon className="w-4 h-4 text-[#f49e1a] shrink-0" />
                    <span>Rede de Localizações & Navegabilidade de Termos Oficiais</span>
                  </h4>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    Facilitamos a navegação de motoristas e idosos com atalhos diretos entre bairros próximos, principais aros de rodas suportados e marcas de pneus em estoque para Curitiba:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans">
                    
                    {/* Column 1: Bairros Próximos */}
                    <div className="space-y-2.5">
                      <p className="font-extrabold uppercase text-gray-950 border-b border-gray-200 pb-1 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#f49e1a]"></span>
                        Atalhos de Bairros
                      </p>
                      <div className="flex flex-col gap-1 text-[10px] font-bold text-gray-700">
                        {['Portão', 'Água Verde', 'CIC', 'Pinheirinho', 'Batel', 'Santa Felicidade'].map((b) => (
                          <button
                            key={b}
                            onClick={() => onSelectSeoTarget({ type: 'bairro', name: b })}
                            className="text-left hover:text-yellow-600 hover:underline transition"
                          >
                            ➔ Pneus no bairro {b}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Column 2: Cidades RMC */}
                    <div className="space-y-2.5">
                      <p className="font-extrabold uppercase text-gray-950 border-b border-gray-200 pb-1 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#f49e1a]"></span>
                        Cidades do PR
                      </p>
                      <div className="flex flex-col gap-1 text-[10px] font-bold text-gray-700">
                        {['Araucária', 'Colombo', 'Pinhais', 'São José dos Pinhais', 'Fazenda Rio Grande', 'Campo Largo'].map((c) => (
                          <button
                            key={c}
                            onClick={() => onSelectSeoTarget({ type: 'cidade', name: c })}
                            className="text-left hover:text-yellow-600 hover:underline transition"
                          >
                            ➔ Instalação em {c} (RMC)
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Column 3: Aro do Pneu */}
                    <div className="space-y-2.5">
                      <p className="font-extrabold uppercase text-gray-950 border-b border-gray-200 pb-1 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#f49e1a]"></span>
                        Buscar por Aro
                      </p>
                      <div className="flex flex-col gap-1 text-[10px] font-bold text-gray-700">
                        {[13, 14, 15, 16, 17, 18, 19, 20].map((a) => (
                          <button
                            key={a}
                            onClick={() => {
                              if (onSelectRimFromSeo) {
                                onSelectRimFromSeo(a);
                              } else {
                                onSelectSeoTarget({ type: 'aro', name: `Aro ${a}` });
                              }
                            }}
                            className="text-left hover:text-yellow-600 hover:underline transition"
                          >
                            ➔ Ver modelos Aro R{a}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Column 4: Marcas Principais */}
                    <div className="space-y-2.5">
                      <p className="font-extrabold uppercase text-gray-950 border-b border-gray-200 pb-1 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#f49e1a]"></span>
                        Navegar por Marca
                      </p>
                      <div className="flex flex-col gap-1 text-[10px] font-bold text-gray-700">
                        {['Bridgestone', 'Pirelli', 'Michelin', 'Continental', 'Goodyear', 'Delinte'].map((brand) => (
                          <button
                            key={brand}
                            onClick={() => {
                              if (onSelectBrandFromSeo) {
                                onSelectBrandFromSeo(brand);
                              } else {
                                onSelectSeoTarget({ type: 'aro', name: brand }); // fallback or similar
                              }
                            }}
                            className="text-left hover:text-yellow-600 hover:underline transition"
                          >
                            ➔ Pneus da {brand} novos
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

                {/* 2. INTERNAL LINKING: CATEGORIAS -> SERVIÇOS */}
                <div className="bg-yellow-500/5 border border-yellow-500/20 p-5 rounded-3xl space-y-3 text-xs text-left">
                  <h4 className="font-extrabold text-[#f49e1a] uppercase tracking-wider font-mono">
                    ➔ Centro Automotivo & Serviços Adicionais no Portão
                  </h4>
                  <p className="text-gray-700 leading-relaxed font-semibold">
                    Se você está em <strong>{seoTarget.name}</strong> ou redondezas de Curitiba, agende junto aos seus pneus novos as revisões preventivas eletrônicas de geometria e rodagem em nossa loja sede:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <a
                      href="/alinhamento-3d-curitiba"
                      onClick={(e) => {
                        e.preventDefault();
                        window.history.pushState(null, '', '/alinhamento-3d-curitiba');
                        window.dispatchEvent(new Event('popstate'));
                      }}
                      className="bg-white hover:bg-black hover:text-white text-gray-800 border border-gray-200 p-3 rounded-xl transition font-medium flex flex-col justify-between"
                    >
                      <div>
                        <span className="font-black text-gray-950 block uppercase font-mono mb-1">Geometria 3D</span>
                        <span className="text-[10px] text-gray-500 block leading-snug">Preserve a banda de rodagem com o Alinhamento Computadorizado Tridimensional ➔</span>
                      </div>
                    </a>

                    <a
                      href="/oficina-do-pneu-curitiba"
                      onClick={(e) => {
                        e.preventDefault();
                        window.history.pushState(null, '', '/oficina-do-pneu-curitiba');
                        window.dispatchEvent(new Event('popstate'));
                      }}
                      className="bg-white hover:bg-black hover:text-white text-gray-800 border border-gray-200 p-3 rounded-xl transition font-medium flex flex-col justify-between"
                    >
                      <div>
                        <span className="font-black text-gray-950 block uppercase font-mono mb-1">Oficina & Suspensão</span>
                        <span className="text-[10px] text-gray-500 block leading-snug">Revisão rigorosa de amortecedores, molas, pastilhas e buchas no Portão ➔</span>
                      </div>
                    </a>

                    <a
                      href="/pneus-pirelli-curitiba"
                      onClick={(e) => {
                        e.preventDefault();
                        window.history.pushState(null, '', '/pneus-pirelli-curitiba');
                        window.dispatchEvent(new Event('popstate'));
                      }}
                      className="bg-white hover:bg-black hover:text-white text-gray-800 border border-gray-200 p-3 rounded-xl transition font-medium flex flex-col justify-between"
                    >
                      <div>
                        <span className="font-black text-gray-950 block uppercase font-mono mb-1">Pirelli Especialista</span>
                        <span className="text-[10px] text-gray-500 block leading-snug">Explore as especificações das séries Cinturato, Scorpion e P-Zero no estoque ➔</span>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Bottom Actions direct triggers */}
                <div className="bg-gray-150 border-2 border-gray-200 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-inner">
                  <div className="text-center sm:text-left">
                    <h5 className="text-gray-950 font-black leading-tight uppercase text-xs font-mono">Deseja reservar agora seu Pneu com Instalação?</h5>
                    <p className="text-[11px] text-gray-600 mt-1 font-medium">Contate um consultor gratuitamente via chat ou navegue pelo mapa do site completo.</p>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => {
                        onNavigateToPage('mapa-do-site');
                      }}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-900 border border-gray-300 font-extrabold text-xs uppercase px-4 py-2.5 rounded-xl transition cursor-pointer"
                    >
                      Outros Bairros / Mapa
                    </button>
                    <a
                      href={formatWhatsApp(`Olá Carplus Pneus! Agendei a reserva do trajeto saindo de ${seoTarget.name} e gostaria de confirmar dia/hora para montagem e atendimento no Portão.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#f49e1a] hover:bg-yellow-400 text-gray-950 font-black text-xs uppercase px-5 py-2.5 rounded-xl transition border border-black flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Reservar Agora</span>
                    </a>
                  </div>
                </div>

              </div>
            </div>
          );
        })()}

        {/* 1. OFICINA DO PNEU CURITIBA LAYOUT */}
        {view === 'oficina-do-pneu-curitiba' && (
          <OficinaDoPneuSection onNavigateHome={onNavigateHome} />
        )}

        {/* 2. GARAGEM DE PNEUS CURITIBA */}
        {view === 'garagem-de-pneus-curitiba' && (
          <GaragemDePneusSection 
            onNavigateToPage={onNavigateToPage} 
            onSelectBlogSlug={onSelectBlogSlug} 
          />
        )}

        {/* 3. PNEUS PIRELLI CURITIBA */}
        {view === 'pneus-pirelli-curitiba' && (() => {
          const pirelliTires = TIRES_DATA.filter(t => t.brand.toLowerCase() === 'pirelli');

          return (
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in font-sans text-gray-900">
              <div className="text-center space-y-2">
                <span className="bg-red-600 text-white font-mono font-bold text-[9px] uppercase px-3.5 py-1.5 rounded inline-block tracking-widest">
                  Catálogo Pirelli em Curitiba
                </span>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight uppercase font-mono">
                  Pneus Pirelli Curitiba
                </h1>
                <p className="text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed text-sm">
                  Encontre pneus Pirelli novos para pronta entrega em Curitiba: linhas Cinturato, Scorpion e Chrono. Pneus 100% novos com garantia de fábrica, montagem especializada e alinhamento 3D no bairro Portão.
                </p>
              </div>

              {/* Informational Column Copy */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm text-xs sm:text-sm">
                <div className="space-y-3">
                  <h3 className="text-sm font-black uppercase text-gray-950 font-mono border-l-4 border-red-600 pl-3 leading-none">Cinturato, Scorpion & Chrono</h3>
                  <p className="text-gray-700 leading-relaxed text-left">
                    A Pirelli é reconhecida mundialmente pela excelente aderência e estabilidade dinâmica. A linha <strong>Cinturato (P1 e P7)</strong> oferece rendimento quilométrico e frenagem eficiente no asfalto molhado de Curitiba. A linha <strong>Scorpion</strong> atende SUVs e picapes (Toro, Renegade, Compass, Duster), combinando tração e silêncio de rodagem. Já a linha <strong>Chrono</strong> atende vans e frotas comerciais com alta durabilidade sob carga.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-sm font-black uppercase text-gray-950 font-mono border-l-4 border-red-600 pl-3 leading-none">Loja de Pneus Pirelli no Portão</h3>
                  <p className="text-gray-700 leading-relaxed text-left">
                    Em nossa loja física na Av. Presidente Arthur Bernardes, 1323, você conta com elevadores pantográficos calibrados e técnicos capacitados. Dispomos de estrutura para montagem computadorizada anti-risco, alinhamento 3D tridimensional e balanceamento dinâmico no mesmo local.
                  </p>
                </div>
              </div>

              {/* Guia Rápido de Onde Comprar e Medidas */}
              <div className="bg-gray-50 border border-gray-200 p-5 rounded-3xl space-y-3 text-left">
                <h3 className="text-sm font-black uppercase font-mono text-gray-950">Onde Comprar Pneus Pirelli em Curitiba</h3>
                <p className="text-xs text-gray-700 leading-relaxed font-medium">
                  A Carplus Pneus está situada na Av. Presidente Arthur da Silva Bernardes, 1323 (Portão), com fácil acesso para moradores de bairros vizinhos como Água Verde, Batel, Seminário, Santa Quitéria e CIC. Você pode consultar medidas pelo WhatsApp e reservar seus pneus com instalação imediata no box.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <a
                    href="/alinhamento-3d-curitiba"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigateToPage('alinhamento-3d-curitiba');
                      window.history.pushState(null, '', '/alinhamento-3d-curitiba');
                    }}
                    className="bg-yellow-500/15 text-yellow-900 border border-yellow-500/30 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-yellow-500/25 transition"
                  >
                    Alinhamento 3D para Pirelli ➔
                  </a>
                  <a
                    href="/oficina-do-pneu-curitiba"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigateToPage('oficina-do-pneu-curitiba');
                      window.history.pushState(null, '', '/oficina-do-pneu-curitiba');
                    }}
                    className="bg-gray-100 text-gray-800 border border-gray-300 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-200 transition"
                  >
                    Serviços de Oficina e Montagem ➔
                  </a>
                  <a
                    href="/loja-de-pneus-em-curitiba"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigateToPage('loja-de-pneus-em-curitiba');
                      window.history.pushState(null, '', '/loja-de-pneus-em-curitiba');
                    }}
                    className="bg-red-50 text-red-900 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-100 transition"
                  >
                    Loja de Pneus no Portão ➔
                  </a>
                </div>
              </div>

              {/* Pirelli Tires List */}
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase font-mono text-gray-950 border-b border-gray-200 pb-2 text-left">Pneus Pirelli em Destaque no Estoque</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {pirelliTires.map((tire, idx) => (
                    <div key={tire.id || idx} className="bg-white border border-gray-200 p-4 rounded-2xl flex gap-4 items-center shadow-sm hover:border-red-500/40 transition duration-300">
                      <img 
                        src={tire.image || "/images/galeria/troca-pneu.webp"} 
                        alt={tire.name} 
                        className="w-20 h-20 object-contain p-1 shrink-0 bg-white rounded-xl"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = getBrandFallbackImage(tire.brand, tire.id);
                        }}
                      />
                      <div className="flex-1 space-y-0.5 text-left min-w-0">
                        <span className="bg-red-600 text-white font-mono font-bold text-[8px] uppercase px-1.5 py-0.5 rounded">
                          PIRELLI
                        </span>
                        <h4 className="font-extrabold text-sm text-gray-950 truncate uppercase">{tire.model}</h4>
                        <p className="text-xs text-gray-500 font-semibold font-mono">{tire.width}/{tire.aspectRatio} R{tire.rim}</p>
                        <span className="font-black text-xs text-[#1ebd53] uppercase tracking-wider block pt-1">Sob Consulta</span>
                      </div>

                      <div className="flex flex-col gap-1 shrink-0">
                        <a
                          href={formatWhatsApp(`Olá Carplus Curitiba! Gostaria de consultar o pneu Pirelli ${tire.model} de medida ${tire.width}/${tire.aspectRatio} R${tire.rim} que vi no site.`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#25D366] hover:bg-[#20ba5a] text-white text-[10px] font-black uppercase tracking-wider py-2 px-4 rounded-lg transition text-center cursor-pointer border border-[#1ebd53]"
                        >
                          Whats
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. INTERNAL LINKING: SERVICES -> BLOG */}
              <div className="bg-yellow-500/5 border border-yellow-500/15 p-5 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-4 text-xs mt-6 text-left">
                <div className="space-y-0.5">
                  <span className="font-mono text-[9px] text-[#f49e1a] uppercase font-black tracking-widest block">Conteúdo Recomendado do Blog</span>
                  <p className="font-extrabold text-gray-950 uppercase">O Clima de Curitiba e Seus Pneus: Cuidados fundamentais</p>
                  <p className="text-gray-550 leading-relaxed font-semibold">Explicamos como as bruscas oscilações térmicas e chuvas frequentes afetam a calibragem dos compostos Pirelli.</p>
                </div>
                <button
                  onClick={() => {
                    onNavigateToPage('blog');
                  }}
                  className="bg-black hover:bg-[#f49e1a] hover:text-black text-white font-extrabold px-4 py-2.5 rounded-xl transition shrink-0 uppercase font-mono text-[10px]"
                >
                  Ler Artigo ➔
                </button>
              </div>
            </div>
          );
        })()}

        {/* 4. ALINHAMENTO 3D CURITIBA */}
        {view === 'alinhamento-3d-curitiba' && (() => {
          return (
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in font-sans text-gray-900">
              <div className="text-center space-y-2">
                <span className="bg-yellow-500/10 text-yellow-650 font-mono font-black text-[10px] uppercase px-3.5 py-1.5 rounded-full border border-yellow-500/25">
                  Tecnologia e Precisão Computadorizada
                </span>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight uppercase font-mono">
                  Alinhamento 3D Curitiba
                </h1>
                <p className="text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed text-sm">
                  Restabeleça as tolerâncias milimétricas originais do fabricante com nossa rampa computadorizada de Alinhamento Tridimensional no bairro Portão. Garanta a dirigibilidade exata e preserve a borracha dos pneus novos.
                </p>
              </div>

              {/* Structured explanation of 3D technology */}
              <div className="grid grid-cols-1 items-center gap-7 rounded-2xl border border-[#f59c00]/25 bg-[#111111] p-5 sm:p-7 lg:grid-cols-[0.85fr_1.15fr]">
                <div className="space-y-4">
                  <h3 className="text-base font-black uppercase text-gray-950 font-mono border-l-4 border-yellow-500 pl-3 leading-tight">O que é Geometria Computadorizada 3D?</h3>
                  <p className="text-xs sm:text-sm text-gray-705 leading-relaxed text-left font-medium">
                    Ao contrário do alinhamento óptico manual tradicional, o <strong>Alinhamento 3D</strong> utiliza garras reflexivas especiais fixadas nas rodas que interagem em tempo real com modernos projetores e sensores de laser infravermelho. O software decodifica a posição tridimensional do carro e a compara contra a biblioteca de tolerância oficial de caster, câmber e convergência atualizada diretamente das montadoras de veículos.
                  </p>
                  <p className="text-xs sm:text-sm text-gray-705 leading-relaxed text-left font-semibold">
                    Evitamos esforços do volante nas retas, reduzimos o arrasto prejudicial dos sulcos de pneu na asfalto, e aumentamos consideravelmente a durabilidade dos seus pneus e juntas homocinéticas da caixa mecânica de direção.
                  </p>
                </div>
                <figure className="overflow-hidden rounded-xl border border-[#f59c00]/25 bg-[#080808]">
                  <img src="/images/carplus-real/rampa-de-geometria.webp" alt="Jeep Compass na rampa de geometria da unidade Carplus no Portão" width="1384" height="924" loading="lazy" decoding="async" className="aspect-[3/2] w-full object-cover sm:min-h-[300px]" onError={event => { const image = event.currentTarget; if (image.dataset.realFallback) return; image.dataset.realFallback = 'true'; image.src = '/images/galeria/rampa-de-geometria.jpg'; }} />
                  <figcaption className="border-t border-white/10 px-4 py-4 text-[16px] leading-relaxed text-[#c3c3c3]">Rampa de geometria da nossa unidade no Portão.</figcaption>
                </figure>
              </div>

              {/* Step-by-Step Box */}
              <div className="bg-gray-100 p-6 rounded-3xl border border-gray-200 space-y-4">
                <h3 className="text-sm font-black text-gray-900 uppercase font-mono text-center">Processo Técnico Rigoroso Carplus</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium">
                  <div className="bg-white p-4 rounded-xl border border-gray-150 space-y-1">
                    <span className="font-mono font-black text-yellow-500">Passo 01</span>
                    <h4 className="font-extrabold text-gray-950 uppercase">Mapeamento Geométrico</h4>
                    <p className="text-[11px] text-gray-650 leading-relaxed text-left">
                      Colocamos os alvos de leitura reflexiva e medimos em segundos as deformidades angulares do chassi do veículo.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-150 space-y-1">
                    <span className="font-mono font-black text-yellow-500">Passo 02</span>
                    <h4 className="font-extrabold text-gray-950 uppercase">Configuração Milimétrica</h4>
                    <p className="text-[11px] text-gray-650 leading-relaxed text-left">
                      Nossos técnicos experientes giram os tensores com ferramentas calibradas regulando converge/diverge até as barras ficarem perfeitamente centralizadas.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-150 space-y-1">
                    <span className="font-mono font-black text-yellow-500">Passo 03</span>
                    <h4 className="font-extrabold text-gray-950 uppercase">Balanceamento Final</h4>
                    <p className="text-[11px] text-gray-650 leading-relaxed text-left">
                      Adicionamos os contrapesos corretivos na máquina rotadora de balanceamento para anular descompensação dinâmica acima de 80 km/h.
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. INTERNAL LINKING: SERVICES -> BLOG */}
              <div className="bg-yellow-500/5 border border-yellow-500/15 p-5 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-4 text-xs mt-4 text-left font-sans">
                <div className="space-y-0.5">
                  <span className="font-mono text-[9px] text-[#f49e1a] uppercase font-black tracking-widest block font-bold">Artigo Editorial Do Blog</span>
                  <p className="font-extrabold text-gray-950 uppercase">Alinhamento 3D vs Alinhamento Convencional: Qual escolher?</p>
                  <p className="text-gray-550 leading-relaxed font-semibold">Explicamos cientificamente as diferenças tecnológicas para proteger as rodas e poupar combustível.</p>
                </div>
                <button
                  onClick={() => {
                    onNavigateToPage('blog');
                  }}
                  className="bg-black hover:bg-[#f49e1a] hover:text-black text-white font-extrabold px-4 py-2.5 rounded-xl transition shrink-0 uppercase font-mono text-[10px]"
                >
                  Ler Artigo ➔
                </button>
              </div>

              {/* Call to action */}
              <div className="bg-yellow-500/5 border border-yellow-500/15 p-6 rounded-3xl text-center space-y-3 font-sans">
                <h3 className="text-lg font-black uppercase font-mono text-gray-950">Gostaria de agendar o Alinhamento de seu Veículo?</h3>
                <p className="text-xs text-gray-650 max-w-xl mx-auto leading-relaxed font-bold">
                  Não rodar torto prolonga a vida útil da sua suspensão e poupa em até 10% no consumo médio de combustível do tanque! Venha ao Portão.
                </p>
                <div className="flex flex-wrap gap-3 items-center justify-center pt-2">
                  <button
                    onClick={onNavigateHome}
                    className="bg-white border border-gray-300 font-extrabold text-xs uppercase px-4 py-2.5 rounded-xl cursor-pointer hover:bg-gray-50"
                  >
                    Voltar ao Início
                  </button>
                  <a
                    href={formatWhatsApp("Olá Carplus Curitiba! Gostaria de agendar um Alinhamento Computadorizado 3D e Balanceamento na Avenida Arthur Bernardes.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-yellow-500 hover:bg-yellow-400 text-gray-950 font-black text-xs uppercase px-6 py-3.5 rounded-xl transition border border-black cursor-pointer shadow-sm"
                  >
                    Agendar Alinhamento ➔
                  </a>
                </div>
              </div>
            </div>
          );
        })()}

        {/* 5. DYNAMIC BLOG AND READ-POST VIEWS */}
        {view === 'blog' && (
          <BlogView 
            currentSlug={selectedBlogSlug}
            onNavigateBlog={(slug) => {
              if (onSelectBlogSlug) {
                onSelectBlogSlug(slug || null);
              }
            }}
            onNavigateHome={onNavigateHome}
            onNavigateUrl={(url) => {
              const clean = url.replace(/^\//, '').replace(/\/$/, '');
              if (!clean || clean === 'home') {
                onNavigateHome();
              } else if (clean === 'contato' || clean === 'fale-conosco') {
                onNavigateToPage('contato');
              } else if (clean.startsWith('blog/')) {
                const slug = clean.replace('blog/', '');
                if (onSelectBlogSlug) onSelectBlogSlug(slug);
              } else {
                onNavigateToPage(clean as any);
              }
            }}
          />
        )}

        {[
          'xbri-pneus-curitiba',
          'pneus-baratos-em-curitiba',
          'melhor-site-para-comprar-pneus',
          'distribuidora-de-pneus-importados-atacado-curitiba',
          'pneu-hankook-curitiba',
          'pneus-bridgestone-curitiba-precos',
          'barao-pneus-e-oficina-bacacheri-curitiba',
          'barao-pneus-sao-jose-pinhais',
          'pneus-em-curitiba-melhor-preco',
          'distribuidora-de-pneus-em-curitiba',
          'bana-pneus',
          'loja-de-pneus-em-curitiba',
          'pneus-pirelli-em-curitiba-melhor-preco',
          'barao-pneus-e-oficina-portao',
          'auto-center-curitiba',
          'troca-de-pneus-curitiba',
          'centro-automotivo-portao'
        ].includes(view) && (
          <SearchIntentPages 
            view={view as any} 
            onNavigateHome={onNavigateHome} 
            onNavigateToPage={onNavigateToPage}
          />
        )}

        {[
          'pneus-byd-curitiba',
          'pneu-byd-dolphin-curitiba',
          'pneu-byd-dolphin-mini-curitiba',
          'pneu-byd-dolphin-gs-curitiba',
          'pneu-byd-king-curitiba',
          'pneu-175-55-r16-curitiba',
          'pneu-195-60-r16-curitiba',
          'pneu-205-50-r17-curitiba',
          'pneu-215-55-r17-curitiba',
          'pneu-225-60-r16-curitiba'
        ].includes(view) && (
          <BydClusterPages 
            view={view as BydClusterView} 
            onNavigateHome={onNavigateHome} 
            onNavigateToPage={onNavigateToPage as any}
            onAddToCart={onAddToCart}
            onShowTireDetail={onSelectTire}
          />
        )}

        {view === 'seo-landing' && !seoTarget && (
          <div className="max-w-2xl mx-auto text-center py-16 px-4" id="seo-landing-error-fallback">
            <h2 className="text-3xl font-black text-gray-900 uppercase">Página Não Encontrada</h2>
            <p className="mt-4 text-gray-600">A localidade ou página de pneus que você está procurando não foi encontrada em nossa base ativa.</p>
            <button
              onClick={onNavigateHome}
              className="mt-8 bg-black hover:bg-[#f49e1a] hover:text-black text-white font-mono font-black text-xs uppercase px-6 py-3.5 rounded-xl transition cursor-pointer"
            >
              Voltar para a Página Inicial
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
