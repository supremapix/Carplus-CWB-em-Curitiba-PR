import React, { useState, useEffect, useRef, useMemo, useCallback, Suspense } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TireCard from './components/TireCard';
import CatalogTireCard from './components/CatalogTireCard';
import ScrollToTop from './components/ScrollToTop';
import { TIRES_DATA, MOST_SEARCHED_MEASURES, getBrandFallbackImage } from './data';
import { toSlug, getTireSlug } from './utils/slugify';
import EnhancedSEO from './components/EnhancedSEO';
import { Tire, CartItem, CatalogTire } from './types';
import AutoCenterSection from './components/AutoCenterSection';
import { 
  getCatalogSync, 
  getFullCatalog, 
  findCatalogTireBySlug,
  DEFAULT_BRANDS,
  DEFAULT_RIMS,
  DEFAULT_WIDTHS,
  DEFAULT_PROFILES,
  PRESET_RIM_COUNTS,
  PRESET_BRAND_COUNTS
} from './data/catalogo-pneus';
import { PROMO_TIRES } from './data/promoTires';
import WorkshopHero from './components/WorkshopHero';
import TireAdviceSection from './components/TireAdviceSection';
import HomeTireSearch from './components/HomeTireSearch';
import BrandComparisonStrip from './components/BrandComparisonStrip';

// Lazy-loaded heavy components to optimize initial bundle and TBT
const CartDrawer = React.lazy(() => import('./components/CartDrawer'));
const LiveWhatsAppChat = React.lazy(() => import('./components/LiveWhatsAppChat'));
const CompanyPages = React.lazy(() => import('./components/CompanyPages'));
const TireDetail = React.lazy(() => import('./components/TireDetail'));
const TireCatalogView = React.lazy(() => import('./components/TireCatalogView'));
const CatalogTireDetail = React.lazy(() => import('./components/CatalogTireDetail'));
const CarplusVideosSection = React.lazy(() => import('./components/CarplusVideosSection'));
const AuthoritySocialProof = React.lazy(() => import('./components/AuthoritySocialProof'));
const InstagramFeed = React.lazy(() => import('./components/InstagramFeed'));

const BRAND_LOGOS: Record<string, string> = {
  BRIDGESTONE: "https://pneufree.s3.sa-east-1.amazonaws.com/PneufreeReact/Images/SVGBrands/bridgestone.svg",
  PIRELLI: "https://pneufree.s3.sa-east-1.amazonaws.com/PneufreeReact/Images/SVGBrands/pirelli.svg",
  MICHELIN: "https://pneufree.s3.sa-east-1.amazonaws.com/PneufreeReact/Images/SVGBrands/michelin.svg",
  CONTINENTAL: "https://pneufree.s3.sa-east-1.amazonaws.com/PneufreeReact/Images/SVGBrands/continental.svg",
  GOODYEAR: "https://pneufree.s3.sa-east-1.amazonaws.com/PneufreeReact/Images/Quem-somos/marcas/lg-goodyear.svg",
  YOKOHAMA: "/yokohama.svg",
  FIRESTONE: "https://pneufree.s3.sa-east-1.amazonaws.com/PneufreeReact/Images/Quem-somos/marcas/lg-firestone.svg",
  DELINTE: "https://s19532.pcdn.co/wp-content/uploads/2019/12/Delinte-Logo-1.jpg",
  COMFORSER: "https://www.gtiresinternational.us/wp-content/uploads/2022/10/Comforser-Tires.png",
  XBRI: "https://pneufree.s3.sa-east-1.amazonaws.com/PneufreeReact/Images/SVGBrands/xbri.svg",
  PRINX: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKRauciXYNudC8XaeVj_7c3o5urb17rrs_uw&s",
  LINGLONG: "https://pneufree.s3.sa-east-1.amazonaws.com/PneufreeReact/Images/Quem-somos/marcas/lg-linglong.svg",
  SPEEDMAX: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6La6GWmZDeZMCxlH4OA8rJcNjLj8mrjpW4A&s"
};
import { 
  OFFICIAL_NEIGHBORHOODS, NON_OFFICIAL_NEIGHBORHOODS, POPULAR_REGIONS, 
  METROPOLITAN_CITIES, getRouteInstructions 
} from './seo-data';
import { 
  Search, ShieldCheck, Settings, PenTool as Tool, Sparkles, Navigation, 
  Map, Phone, Bookmark, Zap, SlidersHorizontal, CheckCircle, Info, Flame, ThumbsUp,
  ChevronUp, ChevronDown, Globe, Award, Car, ArrowRight, Disc, Wrench, Gauge
} from 'lucide-react';

export default function App() {
  // Global States
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'quem-somos' | 'politica-privacidades' | 'politica-devolucao' | 'mapa-do-site' | 'seo-landing' | 'pneu-detalhes' | 'contato' | 'curitiba' | 'regiao-metropolitana' | 'admin-indexacao' | 'carrinho' | 'oficina-do-pneu-curitiba' | 'garagem-de-pneus-curitiba' | 'pneus-pirelli-curitiba' | 'alinhamento-3d-curitiba' | 'blog' | 'xbri-pneus-curitiba' | 'pneus-baratos-em-curitiba' | 'melhor-site-para-comprar-pneus' | 'distribuidora-de-pneus-importados-atacado-curitiba' | 'pneu-hankook-curitiba' | 'pneus-bridgestone-curitiba-precos' | 'barao-pneus-e-oficina-bacacheri-curitiba' | 'barao-pneus-sao-jose-pinhais' | 'pneus-em-curitiba-melhor-preco' | 'distribuidora-de-pneus-em-curitiba' | 'bana-pneus' | 'loja-de-pneus-em-curitiba' | 'pneus-pirelli-em-curitiba-melhor-preco' | 'barao-pneus-e-oficina-portao' | 'auto-center-curitiba' | 'troca-de-pneus-curitiba' | 'centro-automotivo-portao' | 'pneus-byd-curitiba' | 'pneu-byd-dolphin-curitiba' | 'pneu-byd-dolphin-mini-curitiba' | 'pneu-byd-dolphin-gs-curitiba' | 'pneu-byd-king-curitiba' | 'pneu-175-55-r16-curitiba' | 'pneu-195-60-r16-curitiba' | 'pneu-205-50-r17-curitiba' | 'pneu-215-55-r17-curitiba' | 'pneu-225-60-r16-curitiba' | 'catalogo-pneus' | 'catalogo-detalhe'>('home');
  const [seoTarget, setSeoTarget] = useState<{ type: 'bairro' | 'cidade' | 'aro' | 'carro'; name: string; region?: string; detail?: string; } | null>(null);
  const [selectedBlogSlug, setSelectedBlogSlug] = useState<string | null>(null);
  const [activeHomeFaqIdx, setActiveHomeFaqIdx] = useState<number | null>(null);
  const [isRouteReady, setIsRouteReady] = useState(false);
  const [selectedTire, setSelectedTire] = useState<Tire | null>(null);
  const [selectedCatalogTire, setSelectedCatalogTire] = useState<CatalogTire | null>(null);
  const [catalogFilterBrand, setCatalogFilterBrand] = useState<string>('Todas');
  const [catalogFilterRim, setCatalogFilterRim] = useState<number | 'Todos'>('Todos');
  const [catalogFilterCategory, setCatalogFilterCategory] = useState<string>('Todas');
  const [catalogFilterSearch, setCatalogFilterSearch] = useState<string>('');
  const [isConveyorPaused, setIsConveyorPaused] = useState(false);

  // Search and Filter States
  const [keyword, setKeyword] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('Todas');
  const [selectedRim, setSelectedRim] = useState<number | 'Todos'>('Todos');
  const [filterWidth, setFilterWidth] = useState('Todos');
  const [filterProfile, setFilterProfile] = useState('Todos');
  const [onlyOffers, setOnlyOffers] = useState(false);

  // Car Guide States
  const [carSelectedBrand, setCarSelectedBrand] = useState('Todos');
  const [carSearchQuery, setCarSearchQuery] = useState('');

  // High-Fidelity Categories Portal Sub-Tabs
  const [activeCategoryTab, setActiveCategoryTab] = useState<'aro' | 'marcas' | 'carros'>('aro');
  // Category Accordion State
  const [openCategoryAccordion, setOpenCategoryAccordion] = useState<number | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Helper for category accordion toggle
  const toggleCategoryAccordion = (id: number) => {
    setOpenCategoryAccordion(openCategoryAccordion === id ? null : id);
  };


  // Large vehicle application reference database (Which tire goes on which car?)
  const ALL_BRANDS_CARS = [
    { brand: 'Fiat', model: 'Mobi', years: '2016-2026', measure: '175/65/14', engine: '1.0 Fire' },
    { brand: 'Fiat', model: 'Palio G3/G4', years: '2005-2018', measure: '175/65/14', engine: '1.0 / 1.4' },
    { brand: 'Fiat', model: 'Uno G2 (Novo)', years: '2010-2021', measure: '175/65/14', engine: '1.0 Evo' },
    { brand: 'Fiat', model: 'Uno Mille Antigo', years: '1990-2013', measure: '175/70/13', engine: '1.0 Smart' },
    { brand: 'Fiat', model: 'Argo Drive', years: '2017-2026', measure: '185/60/15', engine: '1.0 / 1.3 Firefly' },
    { brand: 'Fiat', model: 'Cronos', years: '2018-2026', measure: '185/60/15', engine: '1.3 Flex' },
    { brand: 'Fiat', model: 'Strada (Aro 14)', years: '2010-2020', measure: '175/70/14', engine: '1.4 Fire' },
    { brand: 'Fiat', model: 'Strada Novo Modelo', years: '2020-2026', measure: '185/60/15', engine: '1.3 Firefly' },
    { brand: 'Fiat', model: 'Siena / Grand Siena', years: '2008-2021', measure: '175/65/14', engine: '1.0 / 1.4' },
    { brand: 'Fiat', model: 'Toro Freedom', years: '2016-2025', measure: '215/65/16', engine: '1.8 Flex' },

    { brand: 'Volkswagen', model: 'Gol G4/G5/G6/G7', years: '2008-2023', measure: '175/65/14', engine: '1.0 / 1.6 MSi' },
    { brand: 'Volkswagen', model: 'Gol (R13)', years: '1996-2008', measure: '175/70/13', engine: '1.0 MI / 1.6 AP' },
    { brand: 'Volkswagen', model: 'Voyage MSi', years: '2008-2023', measure: '175/65/14', engine: '1.0 / 1.6' },
    { brand: 'Volkswagen', model: 'Fox Trend', years: '2005-2021', measure: '195/55/15', engine: '1.0 / 1.6' },
    { brand: 'Volkswagen', model: 'Polo Comfortline', years: '2018-2026', measure: '185/60/15', engine: '1.0 TSI' },
    { brand: 'Volkswagen', model: 'Virtus', years: '2018-2026', measure: '195/55/15', engine: '1.6 MSi / 1.0T' },
    { brand: 'Volkswagen', model: 'Saveiro Trend / Robust', years: '2012-2026', measure: '185/60/15', engine: '1.6 MSi' },
    { brand: 'Volkswagen', model: 'T-Cross Sense / 200 TSI', years: '2019-2026', measure: '205/55/17', engine: '1.0 TSI' },
    { brand: 'Volkswagen', model: 'Nivus Comfortline / Highline', years: '2020-2026', measure: '205/55/17', engine: '1.0 TSI' },
    { brand: 'Volkswagen', model: 'Amarok Highline', years: '2011-2025', measure: '265/60/18', engine: '2.0 / 3.0 V6 TDI' },

    { brand: 'Chevrolet', model: 'Onix Joy / Joy Plus', years: '2016-2021', measure: '175/65/14', engine: '1.0 SPE/4' },
    { brand: 'Chevrolet', model: 'Onix LT / LTZ', years: '2013-2019', measure: '185/65/15', engine: '1.4 SPE/4' },
    { brand: 'Chevrolet', model: 'Onix Premier Turbo', years: '2020-2026', measure: '195/55/16', engine: '1.0 Turbo' },
    { brand: 'Chevrolet', model: 'Prisma LTZ', years: '2013-2019', measure: '185/65/15', engine: '1.4 SPE/4' },
    { brand: 'Chevrolet', model: 'Corsa Classic', years: '2004-2016', measure: '175/70/13', engine: '1.0 VHC' },
    { brand: 'Chevrolet', model: 'Celta Spirit / Super', years: '2000-2015', measure: '175/70/13', engine: '1.0 VHC' },
    { brand: 'Chevrolet', model: 'Spin LT / LTZ', years: '2012-2026', measure: '195/65/15', engine: '1.8 EconoFlex' },
    { brand: 'Chevrolet', model: 'Cruze Sport6 LT/LTZ', years: '2016-2025', measure: '205/55/16', engine: '1.4 Turbo' },
    { brand: 'Chevrolet', model: 'S10 Advantage / LTZ', years: '2012-2025', measure: '265/60/18', engine: '2.5 / 2.8 CTDI' },

    { brand: 'Hyundai', model: 'HB20 Sense / Unique', years: '2012-2026', measure: '175/65/14', engine: '1.0 Kappa 12V' },
    { brand: 'Hyundai', model: 'HB20 Comfort / Evolution', years: '2013-2026', measure: '185/60/15', engine: '1.0 Turbo / 1.6' },
    { brand: 'Hyundai', model: 'HB20S Sedan Platinum', years: '2016-2026', measure: '185/60/15', engine: '1.0 Turbo' },
    { brand: 'Hyundai', model: 'Creta Action', years: '2017-2024', measure: '205/65/16', engine: '1.6 Gamma' },

    { brand: 'Renault', model: 'Kwid Zen / Intense / Outsider', years: '2017-2026', measure: '165/70/14', engine: '1.0 SCe' },
    { brand: 'Renault', model: 'Sandero Authentique', years: '2008-2022', measure: '185/65/15', engine: '1.0 16V' },
    { brand: 'Renault', model: 'Logan Zen / Life', years: '2008-2024', measure: '185/65/15', engine: '1.0 / 1.6' },
    { brand: 'Renault', model: 'Duster Expression', years: '2011-2020', measure: '205/60/16', engine: '1.6 / 2.0' },

    { brand: 'Ford', model: 'Ka Hatch SE', years: '2014-2021', measure: '175/65/14', engine: '1.0 TiVCT' },
    { brand: 'Ford', model: 'Ka+ Sedan SE', years: '2014-2021', measure: '195/55/15', engine: '1.5 Sigma' },
    { brand: 'Ford', model: 'Fiesta Rocam', years: '2004-2014', measure: '175/65/14', engine: '1.0 / 1.6' },
    { brand: 'Ford', model: 'EcoSport SE', years: '2013-2021', measure: '205/60/16', engine: '1.6 Sigma' },

    { brand: 'Toyota', model: 'Etios Hatch', years: '2012-2021', measure: '175/65/14', engine: '1.3 / 1.5' },
    { brand: 'Toyota', model: 'Yaris XL / XS', years: '2018-2026', measure: '185/60/15', engine: '1.5 Dual VVT-i' },
    { brand: 'Toyota', model: 'Corolla GLi G10/G11', years: '2009-2019', measure: '205/55/16', engine: '1.8 / 2.0' },
    { brand: 'Toyota', model: 'Corolla XEi G11/G12', years: '2015-2023', measure: '215/50/17', engine: '2.0 Flex' },

    { brand: 'Honda', model: 'Fit LX', years: '2008-2021', measure: '185/60/15', engine: '1.5 i-VTEC' },
    { brand: 'Honda', model: 'Fit EXL / Twist', years: '2015-2021', measure: '185/55/16', engine: '1.5 Flex' },
    { brand: 'Honda', model: 'Civic LXS / LXR G9', years: '2012-2016', measure: '205/55/16', engine: '1.8 / 2.0' },
    { brand: 'Honda', model: 'Civic EX / Sporting G10', years: '2016-2021', measure: '215/50/17', engine: '2.0 i-VTEC' },

    { brand: 'BYD', model: 'Dolphin Mini EV', years: '2024-2026', measure: '175/55/16', engine: 'Elétrico 75cv' },
    { brand: 'BYD', model: 'Dolphin GS / EV', years: '2023-2026', measure: '195/60/16', engine: 'Elétrico 95cv' },
    { brand: 'BYD', model: 'Dolphin Plus EV', years: '2023-2026', measure: '205/50/17', engine: 'Elétrico 204cv' },
    { brand: 'BYD', model: 'King DM-i (GL / GS)', years: '2024-2026', measure: '215/55/17', engine: 'Híbrido DM-i' },
    { brand: 'BYD', model: 'King DM-i (R16)', years: '2024-2026', measure: '225/60/16', engine: 'Híbrido DM-i' },
    { brand: 'BYD', model: 'Song Plus DM-i', years: '2022-2026', measure: '235/50/19', engine: 'Híbrido DM-i' },
    { brand: 'BYD', model: 'Yuan Plus EV', years: '2022-2026', measure: '215/55/18', engine: 'Elétrico 204cv' },
    { brand: 'BYD', model: 'Seal EV AWD', years: '2023-2026', measure: '235/45/19', engine: 'Elétrico 530cv' },

    { brand: 'GWM', model: 'Haval H6 HEV', years: '2023-2026', measure: '225/65/17', engine: 'Híbrido HEV 243cv' },
    { brand: 'GWM', model: 'Haval H6 PHEV', years: '2023-2026', measure: '235/55/19', engine: 'Híbrido Plug-in 393cv' },
    { brand: 'GWM', model: 'Haval H6 GT', years: '2023-2026', measure: '235/55/19', engine: 'Híbrido Plug-in 393cv' },
    { brand: 'GWM', model: 'Ora 03 Skin / GT', years: '2023-2026', measure: '215/50/18', engine: 'Elétrico 171cv' },
    { brand: 'GWM', model: 'Tank 300', years: '2024-2026', measure: '265/65/17', engine: 'Híbrido 4x4' },
    { brand: 'GWM', model: 'Poer Picape', years: '2024-2026', measure: '265/60/18', engine: 'Diesel 4x4' }
  ];

  // Unique manufacturers in our listing
  const carManufacturers = ['Todos', 'Fiat', 'Volkswagen', 'Chevrolet', 'Hyundai', 'Renault', 'Ford', 'Toyota', 'Honda', 'BYD', 'GWM'];

  // Catalog State (loads lightweight fallback synchronously, full 1,962 models on-demand only upon interaction)
  const [catalogList, setCatalogList] = useState<CatalogTire[]>(() => getCatalogSync());
  const isCatalogLoadedRef = useRef(false);

  const ensureFullCatalog = useCallback(() => {
    if (!isCatalogLoadedRef.current) {
      isCatalogLoadedRef.current = true;
      getFullCatalog().then(full => {
        setCatalogList(full);
      });
    }
  }, []);

  // Automatically ensure full catalog ONLY when navigating to full catalog or detail views
  useEffect(() => {
    if (currentView === 'catalogo-pneus' || currentView === 'catalogo-detalhe') {
      ensureFullCatalog();
    }
  }, [currentView, ensureFullCatalog]);

  // Dynamic filter lists derived from catalog
  const uniqueBrands = ['Todas', ...DEFAULT_BRANDS];
  const uniqueRims = ['Todos', ...DEFAULT_RIMS];
  const uniqueWidths = ['Todos', ...DEFAULT_WIDTHS];
  const uniqueProfiles = ['Todos', ...DEFAULT_PROFILES];

  // Refs for scrolling smoothly
  const homeRef = useRef<HTMLDivElement>(null);
  const finderRef = useRef<HTMLDivElement>(null);
  const catalogRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const mapsRef = useRef<HTMLDivElement>(null);

  // Cache cart items
  useEffect(() => {
    const saved = localStorage.getItem('carplus_cart');
    if (saved) {
      try {
        setCartItems(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem('carplus_cart', JSON.stringify(items));
  };

  // Cart operations
  const handleAddToCart = (tire: Tire, qty: number) => {
    const items = [...cartItems];
    const matchIdx = items.findIndex(item => item.tire.id === tire.id);
    if (matchIdx > -1) {
      items[matchIdx].quantity += qty;
    } else {
      items.push({ tire, quantity: qty });
    }
    saveCart(items);
    setIsCartOpen(true); // Open the side view to show progress
  };

  const handleRemoveFromCart = (tireId: string) => {
    const updated = cartItems.filter(item => item.tire.id !== tireId);
    saveCart(updated);
  };

  const handleUpdateQuantity = (tireId: string, quantity: number) => {
    const updated = cartItems.map(item => {
      if (item.tire.id === tireId) {
        return { ...item, quantity };
      }
      return item;
    });
    saveCart(updated);
  };

  const handleClearCart = () => {
    saveCart([]);
  };

  // Dedicated standalone views that switch the main layout view
  const PAGE_VIEWS = [
    'quem-somos',
    'blog',
    'contato',
    'alinhamento-3d-curitiba',
    'curitiba',
    'regiao-metropolitana',
    'politica-privacidades',
    'politica-devolucao',
    'mapa-do-site',
    'oficina-do-pneu-curitiba',
    'garagem-de-pneus-curitiba',
    'pneus-pirelli-curitiba',
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
    'centro-automotivo-portao',
    'admin-indexacao'
  ];

  // Scroll handler and page navigation mapping
  const handleScrollToSection = (sectionId: string) => {
    setSelectedCatalogTire(null);
    // Normalization & Aliases
    let targetView = sectionId;
    if (sectionId === 'servicos' || sectionId === 'alinhamento') {
      targetView = 'alinhamento-3d-curitiba';
    } else if (sectionId === 'fale-conosco' || sectionId === 'faleconosco') {
      targetView = 'contato';
    } else if (sectionId === 'catalogo-pneus' || sectionId === 'pneus' || sectionId === 'catalogo') {
      setSelectedTire(null);
      setSelectedCatalogTire(null);
      setSeoTarget(null);
      setSelectedBlogSlug(null);
      setCurrentView('catalogo-pneus');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 1. Check if it is a standalone company/institutional page
    if (PAGE_VIEWS.includes(targetView)) {
      setSelectedTire(null);
      setSeoTarget(null);
      setSelectedBlogSlug(null);
      setCurrentView(targetView as any);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 2. Home page top
    if (sectionId === 'home' || sectionId === '#home') {
      setSelectedTire(null);
      setSeoTarget(null);
      setSelectedBlogSlug(null);
      setCurrentView('home');
      setTimeout(() => {
        const targetElement = homeRef.current;
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 80);
      return;
    }

    // 3. Section on the home page ('catalog', 'finder', 'categories', 'maps-section', etc.)
    setSelectedTire(null);
    setSeoTarget(null);
    setSelectedBlogSlug(null);
    setCurrentView('home');

    setTimeout(() => {
      let targetElement: HTMLElement | null = null;
      if (sectionId === 'finder' || sectionId === 'simulador') targetElement = finderRef.current;
      else if (sectionId === 'catalog' || sectionId === 'ofertas' || sectionId === 'estoque') targetElement = catalogRef.current;
      else if (sectionId === 'categories' || sectionId === 'categorias') targetElement = categoriesRef.current;
      else if (sectionId === 'maps-section' || sectionId === 'endereco' || sectionId === 'localizacao') targetElement = mapsRef.current || document.getElementById('maps-section');

      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  // Quick measure filter applier (e.g. from Google searched list)
  const handleSearchMeasure = (ratioStr: string) => {
    ensureFullCatalog();
    const cleaned = ratioStr.replace(/\s*R\s*/i, '/').replace(/r/i, '/').replace(/-/g, '/');
    const parts = cleaned.split('/').filter(Boolean);
    if (parts.length >= 3) {
      setFilterWidth(parts[0]);
      setFilterProfile(parts[1]);
      setSelectedRim(Number(parts[2]));
      setKeyword('');
      setSelectedBrand('Todas');
      setOnlyOffers(false);
      setTimeout(() => {
        handleScrollToSection('catalog');
      }, 50);
    } else if (parts.length === 1 && !isNaN(Number(parts[0]))) {
      setSelectedRim(Number(parts[0]));
      setFilterWidth('Todos');
      setFilterProfile('Todos');
      setKeyword('');
      setSelectedBrand('Todas');
      setOnlyOffers(false);
      setTimeout(() => {
        handleScrollToSection('catalog');
      }, 50);
    } else {
      setKeyword(ratioStr);
      setTimeout(() => {
        handleScrollToSection('catalog');
      }, 50);
    }
  };

  const handleShowTireDetail = (tire: Tire) => {
    setSelectedTire(tire);
    setCurrentView('pneu-detalhes');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleSelectCatalogTire = (tire: CatalogTire) => {
    setSelectedCatalogTire(tire);
    setCurrentView('catalogo-detalhe');
    window.history.pushState(null, '', `/pneu/${tire.slug}`);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleSelectPromoTireBySlug = (slug: string) => {
    const tire = findCatalogTireBySlug(slug);
    if (tire) {
      setSelectedCatalogTire(tire);
      setCurrentView('catalogo-detalhe');
      window.history.pushState(null, '', `/pneu/${tire.slug}`);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  // Reset all catalog filters
  const resetFilters = () => {
    setKeyword('');
    setSelectedBrand('Todas');
    setSelectedRim('Todos');
    setFilterWidth('Todos');
    setFilterProfile('Todos');
    setOnlyOffers(false);
  };

  // Filter core logic across models in catalogList
  const filteredCatalogTires = useMemo(() => {
    let result = catalogList;

    if (keyword.trim()) {
      const q = keyword.toLowerCase().trim();
      const cleanQ = q.replace(/[^a-z0-9]/g, '');
      result = result.filter(t => {
        const n = t.nome.toLowerCase();
        const m = t.medida.toLowerCase();
        const b = t.marca.toLowerCase();
        const l = (t.linha || '').toLowerCase();
        const cleanM = m.replace(/[^a-z0-9]/g, '');
        const inCar = (t.carros || []).some(car => car.toLowerCase().includes(q));
        return n.includes(q) || m.includes(q) || cleanM.includes(cleanQ) || b.includes(q) || l.includes(q) || inCar;
      });
    }

    if (selectedBrand !== 'Todas') {
      result = result.filter(t => t.marca.toLowerCase() === selectedBrand.toLowerCase());
    }

    if (selectedRim !== 'Todos') {
      result = result.filter(t => t.aro === Number(selectedRim));
    }

    if (filterWidth !== 'Todos') {
      result = result.filter(t => t.largura === Number(filterWidth));
    }

    if (filterProfile !== 'Todos') {
      result = result.filter(t => t.perfil === Number(filterProfile));
    }

    if (onlyOffers) {
      result = result.filter(t => t.destaque || t.novoModelo);
    }

    return result;
  }, [catalogList, keyword, selectedBrand, selectedRim, filterWidth, filterProfile, onlyOffers]);

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredCatalogTires.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCatalogTires = filteredCatalogTires.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, selectedBrand, selectedRim, filterWidth, filterProfile, onlyOffers]);

  const handleHomeCatalogSearch = (query = '', brand = 'Todas', rim: number | 'Todos' = 'Todos') => {
    setCatalogFilterSearch(query);
    setCatalogFilterBrand(brand);
    setCatalogFilterRim(rim);
    setCatalogFilterCategory('Todas');
    handleScrollToSection('catalogo-pneus');
  };

  // --- INTEGRATED SPA CLIENT-SIDE URL ROUTING ENGINE ---
  const parsePathAndSetState = () => {
    setSelectedCatalogTire(null);
    const rawPath = window.location.pathname;
    const parts = rawPath.split('/').filter(Boolean);
    
    if (parts.length === 0) {
      setCurrentView('home');
      setSeoTarget(null);
      setSelectedTire(null);
      return;
    }

    const firstRoute = parts[0].toLowerCase();

    // Specific SEO vanity URLs matching for Aros (13 to 23)
    const aroMatch = firstRoute.match(/^(?:pneus?-aro-|aro-)(\d{2})(?:-curitiba)?$/);
    if (aroMatch && aroMatch[1]) {
      setCurrentView('seo-landing');
      setSeoTarget({ type: 'aro', name: aroMatch[1] });
      setSelectedTire(null);
    } else if (firstRoute === 'pirelli') {
      setCurrentView('seo-landing');
      setSeoTarget({ type: 'bairro', name: 'Pirelli' });
      setSelectedTire(null);
    } else if (firstRoute === 'honda') {
      setCurrentView('seo-landing');
      setSeoTarget({ type: 'carro', name: 'Honda' });
      setSelectedTire(null);
    } else if (firstRoute === 'sobre-a-carplus' || firstRoute === 'sobre') {
      setCurrentView('quem-somos');
      setSeoTarget(null);
      setSelectedTire(null);
    } else if (firstRoute === 'carrinho') {
      setCurrentView('carrinho');
      setSeoTarget(null);
      setSelectedTire(null);
    } else if (firstRoute === 'quem-somos' || firstRoute === 'quemsomos') {
      setCurrentView('quem-somos');
      setSeoTarget(null);
      setSelectedTire(null);
    } else if (firstRoute === 'curitiba') {
      setCurrentView('curitiba');
      setSeoTarget(null);
      setSelectedTire(null);
    } else if (firstRoute === 'regiao-metropolitana' || firstRoute === 'regiaometropolitana') {
      setCurrentView('regiao-metropolitana');
      setSeoTarget(null);
      setSelectedTire(null);
    } else if ((firstRoute === 'admin' && parts[1] === 'indexacao') || firstRoute === 'admin-indexacao') {
      setCurrentView('admin-indexacao');
      setSeoTarget(null);
      setSelectedTire(null);
    } else if (firstRoute === 'politica-privacidades') {
      setCurrentView('politica-privacidades');
      setSeoTarget(null);
      setSelectedTire(null);
    } else if (firstRoute === 'politica-devolucao') {
      setCurrentView('politica-devolucao');
      setSeoTarget(null);
      setSelectedTire(null);
    } else if (firstRoute === 'mapa-do-site') {
      setCurrentView('mapa-do-site');
      setSeoTarget(null);
      setSelectedTire(null);
    } else if (firstRoute === 'contato' || firstRoute === 'fale-conosco' || firstRoute === 'faleconosco') {
      setCurrentView('contato');
      setSeoTarget(null);
      setSelectedTire(null);
    } else if (firstRoute === 'oficina-do-pneu-curitiba') {
      setCurrentView('oficina-do-pneu-curitiba');
      setSeoTarget(null);
      setSelectedTire(null);
    } else if (firstRoute === 'garagem-de-pneus-curitiba') {
      setCurrentView('garagem-de-pneus-curitiba');
      setSeoTarget(null);
      setSelectedTire(null);
    } else if (firstRoute === 'pneus-pirelli-curitiba') {
      setCurrentView('pneus-pirelli-curitiba');
      setSeoTarget(null);
      setSelectedTire(null);
    } else if (firstRoute === 'alinhamento-3d-curitiba') {
      setCurrentView('alinhamento-3d-curitiba');
      setSelectedBlogSlug(null);
      setSeoTarget(null);
      setSelectedTire(null);
    } else if (firstRoute === 'blog') {
      setCurrentView('blog');
      const secondPart = parts[1];
      if (secondPart) {
        setSelectedBlogSlug(secondPart);
      } else {
        setSelectedBlogSlug(null);
      }
      setSeoTarget(null);
      setSelectedTire(null);
    } else if (firstRoute === 'xbri-pneus-curitiba') {
      setCurrentView('xbri-pneus-curitiba');
      setSelectedBlogSlug(null);
      setSeoTarget(null);
      setSelectedTire(null);
    } else if (firstRoute === 'pneus-baratos-em-curitiba') {
      setCurrentView('pneus-baratos-em-curitiba');
      setSeoTarget(null);
      setSelectedTire(null);
    } else if (firstRoute === 'melhor-site-para-comprar-pneus') {
      setCurrentView('melhor-site-para-comprar-pneus');
      setSeoTarget(null);
      setSelectedTire(null);
    } else if (firstRoute === 'distribuidora-de-pneus-importados-atacado-curitiba') {
      setCurrentView('distribuidora-de-pneus-importados-atacado-curitiba');
      setSeoTarget(null);
      setSelectedTire(null);
    } else if (firstRoute === 'pneu-hankook-curitiba') {
      setCurrentView('pneu-hankook-curitiba');
      setSeoTarget(null);
      setSelectedTire(null);
    } else if (firstRoute === 'pneus-bridgestone-curitiba-precos') {
      setCurrentView('pneus-bridgestone-curitiba-precos');
      setSeoTarget(null);
      setSelectedTire(null);
    } else if (firstRoute === 'barao-pneus-e-oficina-bacacheri-curitiba') {
      setCurrentView('barao-pneus-e-oficina-bacacheri-curitiba');
      setSeoTarget(null);
      setSelectedTire(null);
    } else if (firstRoute === 'barao-pneus-sao-jose-pinhais') {
      setCurrentView('barao-pneus-sao-jose-pinhais');
      setSeoTarget(null);
      setSelectedTire(null);
    } else if (firstRoute === 'pneus-em-curitiba-melhor-preco') {
      setCurrentView('pneus-em-curitiba-melhor-preco');
      setSeoTarget(null);
      setSelectedTire(null);
    } else if (firstRoute === 'distribuidora-de-pneus-em-curitiba') {
      setCurrentView('distribuidora-de-pneus-em-curitiba');
      setSeoTarget(null);
      setSelectedTire(null);
    } else if (firstRoute === 'bana-pneus') {
      setCurrentView('bana-pneus');
      setSeoTarget(null);
      setSelectedTire(null);
    } else if (firstRoute === 'loja-de-pneus-em-curitiba') {
      setCurrentView('loja-de-pneus-em-curitiba');
      setSeoTarget(null);
      setSelectedTire(null);
    } else if (firstRoute === 'pneus-pirelli-em-curitiba-melhor-preco') {
      setCurrentView('pneus-pirelli-em-curitiba-melhor-preco');
      setSeoTarget(null);
      setSelectedTire(null);
    } else if (firstRoute === 'barao-pneus-e-oficina-portao' || firstRoute === 'pneus-portao-curitiba' || firstRoute === 'pneus-no-portao-curitiba') {
      setCurrentView('barao-pneus-e-oficina-portao');
      setSeoTarget(null);
      setSelectedTire(null);
    } else if (firstRoute === 'auto-center-curitiba' || firstRoute === 'autocenter-curitiba' || firstRoute === 'auto-center' || firstRoute === 'centro-automotivo-curitiba' || firstRoute === 'autocenter') {
      setCurrentView('auto-center-curitiba');
      setSeoTarget(null);
      setSelectedTire(null);
    } else if (firstRoute === 'troca-de-pneus-curitiba' || firstRoute === 'troca-de-pneus' || firstRoute === 'onde-trocar-pneus-curitiba' || firstRoute === 'trocar-pneus-curitiba') {
      setCurrentView('troca-de-pneus-curitiba');
      setSeoTarget(null);
      setSelectedTire(null);
    } else if (firstRoute === 'centro-automotivo-portao' || firstRoute === 'auto-center-portao' || firstRoute === 'autocenter-portao') {
      setCurrentView('centro-automotivo-portao');
      setSeoTarget(null);
      setSelectedTire(null);
    } else if (firstRoute === 'pneus-byd-curitiba' || firstRoute === 'pneu-byd-curitiba' || firstRoute === 'pneus-byd' || (firstRoute === 'carro' && parts[1]?.toLowerCase() === 'byd')) {
      setCurrentView('pneus-byd-curitiba');
      setSeoTarget(null);
      setSelectedTire(null);
    } else if (
      firstRoute === 'pneu-byd-dolphin-curitiba' || 
      firstRoute === 'pneus-byd-dolphin' || 
      firstRoute === 'pneu-byd-dolphin' ||
      firstRoute === 'pneu-byd-dolphin-original' ||
      firstRoute === 'pneu-byd-dolphin-preco' ||
      firstRoute === 'valor-pneu-byd-dolphin'
    ) {
      setCurrentView('pneu-byd-dolphin-curitiba');
      setSeoTarget(null);
      setSelectedTire(null);
    } else if (
      firstRoute === 'pneu-byd-dolphin-mini-curitiba' || 
      firstRoute === 'pneus-byd-dolphin-mini' || 
      firstRoute === 'pneu-byd-dolphin-mini' ||
      firstRoute === 'valor-do-pneu-do-byd-dolphin-mini' ||
      firstRoute === 'valor-pneu-byd-dolphin-mini' ||
      firstRoute === 'preco-pneu-byd-dolphin-mini'
    ) {
      setCurrentView('pneu-byd-dolphin-mini-curitiba');
      setSeoTarget(null);
      setSelectedTire(null);
    } else if (
      firstRoute === 'pneu-byd-dolphin-gs-curitiba' || 
      firstRoute === 'pneu-byd-dolphin-gs' || 
      firstRoute === 'pneus-byd-dolphin-gs' ||
      firstRoute === 'pneu-byd-dolphin-gs-original' ||
      firstRoute === 'pneu-dolphin-gs-195-60-r16'
    ) {
      setCurrentView('pneu-byd-dolphin-gs-curitiba');
      setSeoTarget(null);
      setSelectedTire(null);
    } else if (firstRoute === 'pneu-byd-king-curitiba' || firstRoute === 'pneu-byd-king' || firstRoute === 'pneus-byd-king') {
      setCurrentView('pneu-byd-king-curitiba');
      setSeoTarget(null);
      setSelectedTire(null);
    } else if (firstRoute === 'pneu-175-55-r16-curitiba' || firstRoute === 'pneu-175-55-r16' || firstRoute === 'pneu-175-55-16') {
      setCurrentView('pneu-175-55-r16-curitiba');
      setSeoTarget(null);
      setSelectedTire(null);
    } else if (
      firstRoute === 'pneu-195-60-r16-curitiba' || 
      firstRoute === 'pneu-195-60-r16' || 
      firstRoute === 'pneu-195-60-16' ||
      firstRoute === 'pneu-byd-dolphin-195-60-r16-89h' ||
      firstRoute === 'pneu-byd-dolphin-195-60-r16'
    ) {
      setCurrentView('pneu-195-60-r16-curitiba');
      setSeoTarget(null);
      setSelectedTire(null);
    } else if (firstRoute === 'pneu-205-50-r17-curitiba' || firstRoute === 'pneu-205-50-r17' || firstRoute === 'pneu-205-50-17') {
      setCurrentView('pneu-205-50-r17-curitiba');
      setSeoTarget(null);
      setSelectedTire(null);
    } else if (firstRoute === 'pneu-215-55-r17-curitiba' || firstRoute === 'pneu-215-55-r17' || firstRoute === 'pneu-215-55-17') {
      setCurrentView('pneu-215-55-r17-curitiba');
      setSeoTarget(null);
      setSelectedTire(null);
    } else if (firstRoute === 'pneus') {
      if (parts[1] && (/^aro-(\d+)/.test(parts[1]) || /^\d+$/.test(parts[1]))) {
        const rimMatch = parts[1].match(/(?:aro-)?(\d+)/);
        const rimNumber = rimMatch ? parseInt(rimMatch[1], 10) : 16;
        setCatalogFilterRim(rimNumber);
        setCurrentView('catalogo-pneus');
        setSelectedTire(null);
        setSelectedCatalogTire(null);
        setSeoTarget(null);
      } else if (parts[1] === 'marca' && parts[2]) {
        setCatalogFilterBrand(decodeURIComponent(parts[2]));
        setCurrentView('catalogo-pneus');
        setSelectedTire(null);
        setSelectedCatalogTire(null);
        setSeoTarget(null);
      } else if (parts[1] === 'categoria' && parts[2]) {
        setCatalogFilterCategory(decodeURIComponent(parts[2]));
        setCurrentView('catalogo-pneus');
        setSelectedTire(null);
        setSelectedCatalogTire(null);
        setSeoTarget(null);
      } else {
        setCurrentView('catalogo-pneus');
        setSelectedTire(null);
        setSelectedCatalogTire(null);
        setSeoTarget(null);
      }
    } else if (/^pneus?-aro-(\d+)(-curitiba)?$/.test(firstRoute)) {
      const match = firstRoute.match(/^pneus?-aro-(\d+)/);
      const rimNumber = match ? match[1] : '16';
      setCurrentView('seo-landing');
      setSeoTarget({ type: 'aro', name: rimNumber });
      setSelectedTire(null);
    } else if (firstRoute === 'pneu-225-60-r16-curitiba' || firstRoute === 'pneu-225-60-r16' || firstRoute === 'pneu-225-60-16') {
      setCurrentView('pneu-225-60-r16-curitiba');
      setSeoTarget(null);
      setSelectedTire(null);
    } else if (firstRoute === 'pneu' && parts[1]) {
      const tireSlugParam = decodeURIComponent(parts[1]).trim();
      // First, check in comprehensive CATALOGO_PNEUS database
      const matchedCatalog = findCatalogTireBySlug(tireSlugParam);
      if (matchedCatalog) {
        setCurrentView('catalogo-detalhe');
        setSelectedCatalogTire(matchedCatalog);
        setSelectedTire(null);
        setSeoTarget(null);
      } else {
        // Fallback: check TIRES_DATA
        const tireParam = tireSlugParam.toLowerCase().replace(/[\s+]+/g, '+');
        const matched = TIRES_DATA.find(t => {
          const idMatch = t.id.toLowerCase() === tireParam;
          const slugMatch = getTireSlug(t).toLowerCase().replace(/[\s+]+/g, '+') === tireParam;
          return idMatch || slugMatch;
        });
        if (matched) {
          setCurrentView('pneu-detalhes');
          setSelectedTire(matched);
          setSelectedCatalogTire(null);
          setSeoTarget(null);
        } else {
          setCurrentView('catalogo-pneus');
          setSeoTarget(null);
          setSelectedTire(null);
          setSelectedCatalogTire(null);
        }
      }
    } else if (firstRoute.startsWith('pneus-no-') || firstRoute.startsWith('pneus-em-')) {
      const isPneusNo = firstRoute.startsWith('pneus-no-');
      const locationSlug = isPneusNo 
        ? firstRoute.substring('pneus-no-'.length) 
        : firstRoute.substring('pneus-em-'.length);
      
      if (locationSlug === 'curitiba' || locationSlug === 'curitiba-melhor-preco') {
        setCurrentView('curitiba');
        setSeoTarget(null);
        setSelectedTire(null);
        return;
      }

      // Check official neighborhood
      let matchedOfficial = OFFICIAL_NEIGHBORHOODS.find(n => toSlug(n) === locationSlug);
      if (locationSlug === 'cic') {
        matchedOfficial = "Cidade Industrial (CIC)";
      }
      if (matchedOfficial) {
        setCurrentView('seo-landing');
        setSeoTarget({ type: 'bairro', name: matchedOfficial });
        setSelectedTire(null);
        return;
      }

      // Check non-official neighborhood
      let matchedNon = NON_OFFICIAL_NEIGHBORHOODS.find(n => toSlug(n.name) === locationSlug);
      if (locationSlug === 'neo-ville') {
        matchedNon = NON_OFFICIAL_NEIGHBORHOODS.find(n => n.name === 'Neoville');
      }
      if (matchedNon) {
        setCurrentView('seo-landing');
        setSeoTarget({ type: 'bairro', name: matchedNon.name, region: matchedNon.region });
        setSelectedTire(null);
        return;
      }

      // Check city
      const matchedCity = METROPOLITAN_CITIES.find(c => toSlug(c) === locationSlug);
      if (matchedCity) {
        setCurrentView('seo-landing');
        setSeoTarget({ type: 'cidade', name: matchedCity });
        setSelectedTire(null);
        return;
      }

      // Fallback
      const fallbackName = locationSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      const detectedType = isPneusNo ? 'bairro' : 'cidade';
      setCurrentView('seo-landing');
      setSeoTarget({ type: detectedType, name: fallbackName });
      setSelectedTire(null);
    } else if (firstRoute === 'bairro' && parts[1]) {
      const slug = parts[1].toLowerCase();
      let matchedOfficial = OFFICIAL_NEIGHBORHOODS.find(n => toSlug(n) === slug);
      if (slug === 'cic') {
        matchedOfficial = "Cidade Industrial (CIC)";
      }
      if (matchedOfficial) {
        setCurrentView('seo-landing');
        setSeoTarget({ type: 'bairro', name: matchedOfficial });
        setSelectedTire(null);
        return;
      }
      let matchedNon = NON_OFFICIAL_NEIGHBORHOODS.find(n => toSlug(n.name) === slug);
      if (slug === 'neo-ville') {
        matchedNon = NON_OFFICIAL_NEIGHBORHOODS.find(n => n.name === 'Neoville');
      }
      if (matchedNon) {
        setCurrentView('seo-landing');
        setSeoTarget({ type: 'bairro', name: matchedNon.name, region: matchedNon.region });
        setSelectedTire(null);
        return;
      }
      const fallbackName = parts[1].split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      setCurrentView('seo-landing');
      setSeoTarget({ type: 'bairro', name: fallbackName });
      setSelectedTire(null);
    } else if (firstRoute === 'cidade' && parts[1]) {
      const slug = parts[1].toLowerCase();
      const matchedCity = METROPOLITAN_CITIES.find(c => toSlug(c) === slug);
      if (matchedCity) {
        setCurrentView('seo-landing');
        setSeoTarget({ type: 'cidade', name: matchedCity });
        setSelectedTire(null);
      } else {
        const fallbackName = parts[1].split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        setCurrentView('seo-landing');
        setSeoTarget({ type: 'cidade', name: fallbackName });
        setSelectedTire(null);
      }
    } else if (firstRoute === 'aro' && parts[1]) {
      setCurrentView('seo-landing');
      setSeoTarget({ type: 'aro', name: parts[1] });
      setSelectedTire(null);
    } else if (firstRoute === 'carro' && parts[1]) {
      const fallbackName = parts[1].split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      setCurrentView('seo-landing');
      setSeoTarget({ type: 'carro', name: fallbackName });
      setSelectedTire(null);
    } else if (firstRoute.startsWith('pneu-')) {
      const matchedCatalog = findCatalogTireBySlug(firstRoute);
      if (matchedCatalog) {
        setCurrentView('catalogo-detalhe');
        setSelectedCatalogTire(matchedCatalog);
        setSelectedTire(null);
        setSeoTarget(null);
      } else {
        setCurrentView('home');
        setSeoTarget(null);
        setSelectedTire(null);
      }
    } else {
      setCurrentView('home');
      setSeoTarget(null);
      setSelectedTire(null);
    }
  };

  const handleNavigateInternal = (path: string) => {
    window.history.pushState(null, '', path);
    parsePathAndSetState();
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  useEffect(() => {
    parsePathAndSetState();
    setIsRouteReady(true);
    
    const handlePopState = () => {
      parsePathAndSetState();
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    // Read the incoming URL before synchronizing the initially empty home state.
    if (!isRouteReady) return;
    let idealPath = '/';
    if (selectedCatalogTire) {
      idealPath = `/pneu/${selectedCatalogTire.slug}`;
    } else if (selectedTire) {
      idealPath = `/pneu/${getTireSlug(selectedTire)}`;
    } else if (currentView === 'catalogo-pneus') {
      idealPath = '/pneus';
    } else if (currentView === 'seo-landing' && seoTarget) {
      const slugName = toSlug(seoTarget.name);
      const currentPath = window.location.pathname.toLowerCase();
      const expectedPneusNo = `/pneus-no-${slugName}`;
      const expectedPneusEm = `/pneus-em-${slugName}`;
      if (currentPath === expectedPneusNo || currentPath === expectedPneusEm) {
        idealPath = window.location.pathname;
      } else {
        idealPath = `/${seoTarget.type}/${slugName}`;
      }
    } else if (currentView === 'curitiba') {
      idealPath = '/curitiba';
    } else if (currentView === 'regiao-metropolitana') {
      idealPath = '/regiao-metropolitana';
    } else if (currentView === 'admin-indexacao') {
      idealPath = '/admin/indexacao';
    } else if (currentView === 'blog') {
      idealPath = selectedBlogSlug ? `/blog/${selectedBlogSlug}` : '/blog';
    } else if (currentView !== 'home') {
      idealPath = `/${currentView}`;
    }

    if (window.location.pathname !== idealPath) {
      window.history.pushState(null, '', idealPath);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [isRouteReady, currentView, seoTarget, selectedTire, selectedCatalogTire, selectedBlogSlug]);

  // Hot offers in stock to highlight
  const spotlightOffers = TIRES_DATA.filter(t => t.isOffer);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-[#f49e1a] selection:text-gray-950 pb-24 sm:pb-0 overflow-x-hidden w-full max-w-full" id="carplus-root">
      
      {/* Dynamic Advanced Helmet-driven Head & Structured Data Management */}
      <EnhancedSEO 
        currentView={currentView} 
        seoTarget={seoTarget} 
        selectedTire={selectedTire} 
        selectedCatalogTire={selectedCatalogTire}
        selectedBlogSlug={selectedBlogSlug}
      />
      
      {/* Dynamic Navbar */}
      <Navbar 
        onScrollToSection={handleScrollToSection}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Content Layout */}
      {currentView === 'catalogo-detalhe' && selectedCatalogTire ? (
        <main className="flex-1 w-full bg-white">
          <Suspense fallback={<div className="min-h-[400px] flex items-center justify-center p-12 text-sm text-gray-500 font-mono">Carregando detalhes do pneu...</div>}>
            <CatalogTireDetail 
              tire={selectedCatalogTire}
              onBack={() => {
                setCurrentView('catalogo-pneus');
                setSelectedCatalogTire(null);
              }}
              onSelectTire={(tire) => {
                setSelectedCatalogTire(tire);
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
            />
          </Suspense>
        </main>
      ) : currentView === 'catalogo-pneus' ? (
        <main className="flex-1 w-full bg-white">
          <Suspense fallback={<div className="min-h-[400px] flex items-center justify-center p-12 text-sm text-gray-500 font-mono">Carregando catálogo de pneus...</div>}>
            <TireCatalogView 
              initialBrand={catalogFilterBrand}
              initialRim={catalogFilterRim === 'Todos' ? undefined : catalogFilterRim}
              initialCategory={catalogFilterCategory}
              initialSearch={catalogFilterSearch}
              onSelectTire={(tire) => {
                setSelectedCatalogTire(tire);
                setCurrentView('catalogo-detalhe');
              }}
              onNavigateHome={() => {
                setCurrentView('home');
              }}
            />
          </Suspense>
        </main>
      ) : currentView === 'pneu-detalhes' && selectedTire ? (
        <main className="flex-1 w-full bg-white">
          <Suspense fallback={<div className="min-h-[400px] flex items-center justify-center p-12 text-sm text-gray-500 font-mono">Carregando detalhes do produto...</div>}>
            <TireDetail 
              tire={selectedTire}
              onBack={() => {
                setCurrentView('home');
                setSelectedTire(null);
              }}
              onAddToCart={handleAddToCart}
            />
          </Suspense>
        </main>
      ) : currentView !== 'home' ? (
        <main className="flex-1 w-full bg-white">
          <Suspense fallback={<div className="min-h-[400px] flex items-center justify-center p-12 text-sm text-gray-500 font-mono">Carregando página...</div>}>
            <CompanyPages 
              view={currentView}
              seoTarget={seoTarget}
              selectedBlogSlug={selectedBlogSlug}
              onSelectBlogSlug={(slug) => {
                setSelectedBlogSlug(slug);
              }}
              onNavigateHome={() => {
                setCurrentView('home');
                setSeoTarget(null);
                setSelectedBlogSlug(null);
              }}
              onNavigateToPage={(page, slug) => {
                setCurrentView(page);
                setSeoTarget(null);
                if (page === 'blog' && slug) {
                  setSelectedBlogSlug(slug);
                } else if (page !== 'blog') {
                  setSelectedBlogSlug(null);
                }
              }}
              onSelectSeoTarget={(target) => {
                setCurrentView('seo-landing');
                setSeoTarget(target);
              }}
              onAddToCart={handleAddToCart}
              onSelectTire={handleShowTireDetail}
              onSelectRimFromSeo={rim => handleHomeCatalogSearch('', 'Todas', rim)}
              onSelectBrandFromSeo={brand => handleHomeCatalogSearch('', brand)}
              cartItems={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveFromCart={handleRemoveFromCart}
              onClearCart={handleClearCart}
            />
          </Suspense>
        </main>
      ) : (
        <main className="carplus-home flex-1 w-full pb-16 bg-white">

          {/* 1. Workshop Hero Section (Requirement 3: Dark graphite background, tread texture, hazard stripe, spinning tire, strong title, 2 CTAs) */}
          <div ref={homeRef}>
            <WorkshopHero 
              onSearchClick={() => handleScrollToSection('finder')}
              onSelectPromoTire={(slug) => handleSelectPromoTireBySlug(slug)}
              promoTires={PROMO_TIRES}
            />
          </div>

          <section ref={finderRef} id="finder" className="carplus-search-stage">
            <div ref={catalogRef} id="catalog" className="carplus-home-section">
              <HomeTireSearch onSearch={query => handleHomeCatalogSearch(query)} onHelp={() => document.getElementById('guia-escolha')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} />
            </div>
          </section>

          {/* 3. Featured Tires Grid Section (Requirement 5 & 9: Centered alignment, workshop tire cards) */}
          <div 
            className="w-full bg-[#F7F7F7] py-14 px-4 sm:px-6 lg:px-8 border-b border-zinc-200"
            id="conveyor-belt-section"
          >
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Header Centralizado Rigoroso */}
              <div className="text-center max-w-3xl mx-auto space-y-3">
                <div className="inline-flex items-center gap-2 bg-zinc-900 text-[#F5A623] px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ESCOLHA COM A CARPLUS</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight uppercase" id="conveyor-main-h1">
                  Compare opções para o seu carro.
                </h2>
                <p className="text-zinc-600 text-[18px] leading-relaxed max-w-[65ch] mx-auto">
                  Veja alguns modelos. Confirme a medida, o valor e a disponibilidade com a equipe antes de escolher.
                </p>
                <div className="pt-2">
                  <button 
                    onClick={() => handleHomeCatalogSearch('')}
                    className="carplus-action-primary"
                  >
                    <span>Ver Catálogo Completo</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 1 col mobile / 2 col tablet / 4 col desktop Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" id="conveyor-belt-container">
                {spotlightOffers.slice(0, 4).map((t) => (
                  <TireCard
                    key={`spotlight-${t.id}`}
                    tire={t}
                    onSelectTire={(selected) => handleShowTireDetail(selected)}
                  />
                ))}
              </div>

              <div ref={categoriesRef} id="categories">
                <BrandComparisonStrip onSelectBrand={brand => handleHomeCatalogSearch('', brand)} />
              </div>
            </div>
          </div>

          <TireAdviceSection onFindTire={() => handleHomeCatalogSearch('')} onNavigate={handleNavigateInternal} />

        {/* Installation services support the tire purchase. */}
        <section className="max-w-7xl mx-auto px-4 mt-12 w-full min-w-0 overflow-hidden" id="benefits-section">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-zinc-900 w-full min-w-0">
            
            {/* Card 1: Montagem & Chave Anti-Risco */}
            <div className="bg-white rounded-[14px] border border-zinc-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group">
              <div 
                className="h-2 w-full bg-zinc-900 border-b border-[#F5A623]/60 relative overflow-hidden shrink-0"
                title="Banda de rodagem Carplus"
              >
                <div 
                  className="absolute inset-0 opacity-70"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, #F5A623 0, #F5A623 4px, transparent 4px, transparent 10px)'
                  }}
                />
              </div>
              <div className="p-6 flex flex-col items-center sm:items-start text-center sm:text-left flex-1 justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 text-[#F5A623] flex items-center justify-center mb-4 border border-zinc-800 shadow-xs">
                    <Wrench className="w-6 h-6 shrink-0 group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                  <h4 className="font-extrabold text-[18px] text-zinc-900 uppercase tracking-tight">
                    Montagem na Carplus
                  </h4>
                  <p className="text-[16px] text-zinc-600 leading-relaxed mt-2 max-w-[60ch]">
                    Escolha o pneu e consulte a montagem na loja. A equipe confere a aplicação e os cuidados com as rodas.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-zinc-100 w-full flex items-center justify-between text-xs font-mono font-bold text-zinc-500">
                  <span className="uppercase text-[#F5A623]">BOX 01 & 02</span>
                  <span>PRONTA ENTREGA</span>
                </div>
              </div>
            </div>

            {/* Card 2: Geometria e Alinhamento 3D */}
            <div className="bg-white rounded-[14px] border border-zinc-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group">
              <div 
                className="h-2 w-full bg-zinc-900 border-b border-[#F5A623]/60 relative overflow-hidden shrink-0"
                title="Banda de rodagem Carplus"
              >
                <div 
                  className="absolute inset-0 opacity-70"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, #F5A623 0, #F5A623 4px, transparent 4px, transparent 10px)'
                  }}
                />
              </div>
              <div className="p-6 flex flex-col items-center sm:items-start text-center sm:text-left flex-1 justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 text-[#F5A623] flex items-center justify-center mb-4 border border-zinc-800 shadow-xs">
                    <Gauge className="w-6 h-6 shrink-0 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h4 className="font-extrabold text-[18px] text-zinc-900 uppercase tracking-tight">
                    Alinhamento e balanceamento
                  </h4>
                  <p className="text-[16px] text-zinc-600 leading-relaxed mt-2 max-w-[60ch]">
                    Consulte os serviços indicados para o seu carro e organize a instalação no mesmo endereço.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-zinc-100 w-full flex items-center justify-between text-xs font-mono font-bold text-zinc-500">
                  <span className="uppercase text-[#F5A623]">RAMPA LASER</span>
                  <span>EIXO DIANT. & TRAS.</span>
                </div>
              </div>
            </div>

            {/* Card 3: Elevador / Suspensão e Macaco */}
            <div className="bg-white rounded-[14px] border border-zinc-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group">
              <div 
                className="h-2 w-full bg-zinc-900 border-b border-[#F5A623]/60 relative overflow-hidden shrink-0"
                title="Banda de rodagem Carplus"
              >
                <div 
                  className="absolute inset-0 opacity-70"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, #F5A623 0, #F5A623 4px, transparent 4px, transparent 10px)'
                  }}
                />
              </div>
              <div className="p-6 flex flex-col items-center sm:items-start text-center sm:text-left flex-1 justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 text-[#F5A623] flex items-center justify-center mb-4 border border-zinc-800 shadow-xs">
                    <Car className="w-6 h-6 shrink-0 group-hover:-translate-y-1 transition-transform duration-300" />
                  </div>
                  <h4 className="font-extrabold text-[18px] text-zinc-900 uppercase tracking-tight">
                    Avaliação de suspensão e freios
                  </h4>
                  <p className="text-[16px] text-zinc-600 leading-relaxed mt-2 max-w-[60ch]">
                    Informe ruídos, vibrações ou desgaste nos pneus. A equipe avalia o veículo e explica o orçamento.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-zinc-100 w-full flex items-center justify-between text-xs font-mono font-bold text-zinc-500">
                  <span className="uppercase text-[#F5A623]">CHECKUP</span>
                  <span>100% TRANSPARENTE</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Carplus videos */}
        <section className="max-w-7xl mx-auto px-4">
          <details className="carplus-more-content">
            <summary>Vídeos da Carplus: pneus, serviços e estrutura</summary>
            <Suspense fallback={null}>
              <CarplusVideosSection />
            </Suspense>
          </details>
        </section>



        {/* Real Structure Image Gallery Section (Carplus Authentic Showroom) */}
        <section className="carplus-home-section carplus-store-gallery" id="carplus-real-gallery">
          <div className="text-center sm:text-left space-y-2 mb-6">
            <p className="carplus-section-label">Pneus e serviços no mesmo endereço</p>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 uppercase tracking-tight font-display">
              Conheça a Carplus no Portão.
            </h3>
            <p className="text-xs text-gray-500 max-w-2xl leading-relaxed">
              Uma loja de pneus e oficina no mesmo endereço. Veja nossa estrutura e converse com a equipe para organizar sua visita.
            </p>
          </div>

          <div className="carplus-real-photo-grid">
            {[
              { url: '/images/carplus-real/auto-center-de-pneus-em-curitiba.webp', fallback: '/images/galeria/auto-center-de-pneus-em-curitiba.jpg', label: 'Pneus Prinx na Carplus', alt: 'Pneus Prinx expostos com etiquetas no interior da loja Carplus' },
              { url: '/images/carplus-real/montagem-tecnica.webp', fallback: '/images/galeria/montagem-tecnica.jpg', label: 'Montagem de pneus na nossa oficina', alt: 'Técnico trabalhando na montagem de pneus na oficina Carplus' },
              { url: '/images/carplus-real/loja-de-pneus-em-curitiba.webp', fallback: '/images/galeria/loja-de-pneus-em-curitiba.webp', label: 'Nossa loja no Portão, Curitiba', alt: 'Fachada iluminada da Carplus Pneus e interior da loja' }
            ].map(photo => (
              <figure key={photo.url} className="carplus-photo-frame">
                <img src={photo.url} onError={event => { const image = event.currentTarget; if (image.dataset.realFallback) return; image.dataset.realFallback = 'true'; image.src = photo.fallback; }} alt={photo.alt} width="1600" height="1068" loading="lazy" decoding="async" />
                <figcaption>{photo.label}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="carplus-home-section">
          <details className="carplus-more-content carplus-store-details">
            <summary>Avaliações, serviços e informações da loja</summary>
            <Suspense fallback={null}><AuthoritySocialProof /></Suspense>
            <AutoCenterSection onNavigateToPage={handleNavigateInternal} />

        {/* Global Homepage Interactive FAQ Accordions (Workshop Style) */}
        <section className="max-w-7xl mx-auto px-4 mt-12 bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-sm" id="carplus-home-faq">
          <div className="text-center max-w-3xl mx-auto space-y-2 mb-8">
            <span className="bg-[#F5A623]/15 text-zinc-950 border border-[#F5A623]/30 font-mono font-black text-xs uppercase tracking-widest px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#F5A623]" />
              ANTES DE VIR À LOJA
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 uppercase tracking-tight font-display pt-1">
              O QUE VOCÊ PRECISA SABER.
            </h3>
            <p className="text-[18px] text-zinc-600 leading-relaxed max-w-[65ch] mx-auto">
              Tire suas dúvidas sobre pneus, serviços, pagamento e atendimento. Para confirmar valores e disponibilidade, fale com a Carplus pelo WhatsApp.
            </p>
          </div>

          <div className="space-y-3 max-w-4xl mx-auto">
            {[
              {
                q: "Onde comprar pneus em Curitiba?",
                a: "Na Carplus Pneus e Auto Center, na Av. Presidente Arthur da Silva Bernardes, 1323, no bairro Portão. Contamos com mais de 1.900 opções de pneus novos multimarcas a pronta entrega, com montagem técnica imediata e garantia oficial de fábrica."
              },
              {
                q: "Qual auto center perto de mim no Portão?",
                a: "A Carplus Pneus e Auto Center fica na Av. Presidente Arthur Bernardes, 1323, no Portão. Centro automotivo completo com 10 boxes ativos, desmontadoras pneumáticas anti-risco de rodas e alinhamento 3D computadorizado a laser."
              },
              {
                q: "Vocês fazem alinhamento e balanceamento?",
                a: "Sim! Dispomos de rampa de Alinhamento 3D Computadorizado a laser que afere convergência, cambagem e cáster com precisão milimétrica, além de balanceamento dinâmico de rodas para rodagem macia e uniforme."
              },
              {
                q: "Atendem carros elétricos?",
                a: "Sim, a equipe técnica da Carplus realiza montagem técnica com maquinário anti-risco e alinhamento 3D para veículos elétricos e híbridos. A disponibilidade de medidas homologadas e modelos de pneus pode ser consultada diretamente com nossos técnicos pelo WhatsApp."
              },
              {
                q: "Parcelam pneus?",
                a: "Sim! Na Carplus você pode parcelar a compra de pneus novos em até 10 vezes sem juros nos cartões de crédito físicos na loja do Portão, além de condições especiais com desconto para pagamento presencial via PIX."
              },
              {
                q: "Onde trocar pneus em Curitiba?",
                a: "No auto center da Carplus no Portão. Realizamos a substituição completa com desmontadoras pneumáticas anti-risco de rodas, alinhamento 3D computadorizado e montagem técnica especializada na nossa loja física."
              },
              {
                q: "Como faço para reservar um pneu em oferta e agendar a instalação?",
                a: "É super simples! Navegue em nosso catálogo, verifique as medidas desejadas e adicione ao carrinho de reserva online. Ao concluir o agendamento, você é direcionado ao atendimento integrado no WhatsApp para confirmar o melhor horário de atendimento. Não há cobrança prévia: você só realiza o pagamento na nossa sede física do Portão, após os pneus novos estarem instalados e balanceados no carro!"
              },
              {
                q: "A Carplus realiza a montagem e instalação dos pneus no local?",
                a: "Sim! Dispomos de auto center completo com desmontadoras pneumáticas anti-risco, balanceamento computadorizado e alinhamento 3D a laser. Você escolhe seus pneus e pode realizar todos os serviços de instalação no mesmo local no Portão."
              },
              {
                q: "A Carplus trabalha apenas com pneus novos de marcas oficiais com garantia?",
                a: "Sim, trabalhamos estritamente com pneus novos de primeira linha homologados mundialmente (Bridgestone, Pirelli, Michelin, Goodyear, Firestone, Dunlop, Delinte, Xbri, Comforser), todos com selo oficial do INMETRO e garantia oficial de 5 anos de fábrica contra deformidades ou falhas estruturais."
              },
              {
                q: "Quais as formas de pagamento disponíveis em sua autocenter?",
                a: "Aceitamos pagamento presencial em PIX com bônus de desconto adicional, cartões de débito tradicionais e cartões de crédito físicos, possibilitando o parcelamento em até 10 vezes sem juros no momento em que seu veículo for entregue."
              },
              {
                q: "Quais outros tipos de serviços de mecânica a Carplus executa?",
                a: "Além de montagem e balanceamento precisos, executamos serviços indispensáveis de geometria computadorizada com Alinhamento 3D de alta definição, diagnóstico rápido de fluídos e troca de pastilhas de freios dianteiros/traseiros, manutenção preventiva de suspensão (amortecedores, kits batentes, pivôs, buchas, braços axiais) e sapatas."
              }
            ].map((faq, idx) => {
              const isOpen = activeHomeFaqIdx === idx;
              return (
                <div 
                  key={idx} 
                  className={`border rounded-xl transition-all duration-300 overflow-hidden ${
                    isOpen 
                      ? 'border-zinc-300 border-l-4 border-l-[#F5A623] bg-amber-50/20 shadow-sm' 
                      : 'border-zinc-200 bg-white hover:border-zinc-300'
                  }`}
                >
                  <button
                    onClick={() => setActiveHomeFaqIdx(isOpen ? null : idx)}
                    className="w-full min-h-[56px] px-4 sm:px-5 py-3.5 sm:py-4 flex items-center justify-between text-left gap-3 sm:gap-4 font-bold text-[17px] sm:text-[18px] text-zinc-900 transition font-sans cursor-pointer focus:outline-hidden"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <Wrench className={`w-5 h-5 shrink-0 ${isOpen ? 'text-[#F5A623]' : 'text-zinc-500'}`} />
                      <span className={`${isOpen ? 'text-[#F5A623]' : 'text-zinc-900'} leading-snug font-bold break-words [overflow-wrap:anywhere] min-w-0`}>
                        {faq.q}
                      </span>
                    </div>
                    
                    <div 
                      className={`w-8 h-8 rounded-full border-2 border-zinc-300 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 border-[#F5A623] bg-[#F5A623]/10' : ''
                      }`}
                      title="Girar para abrir ou fechar"
                    >
                      <svg viewBox="0 0 24 24" className="w-5 h-5 text-zinc-700" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="9" />
                        <line x1="12" y1="3" x2="12" y2="21" />
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <circle cx="12" cy="12" r="3" fill="#F5A623" />
                      </svg>
                    </div>
                  </button>
                  
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-2 text-[17px] sm:text-[18px] text-zinc-700 leading-relaxed border-t border-zinc-100 bg-zinc-50/50 break-words [overflow-wrap:anywhere]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

          </details>
        </section>

        {/* Google Maps Integration details / directions */}
        <section className="max-w-7xl mx-auto px-4 mt-12 mb-6" id="maps-section">

          <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-md text-gray-800 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Context/Instructions (7 Columns) */}
            <div className="md:col-span-5 space-y-4 text-center md:text-left">
              <span className="bg-yellow-500/10 text-yellow-600 font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full inline-block">
                Como Chegar
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight uppercase">
                Venha à Carplus no Portão.
              </h3>
              
              <p className="text-xs sm:text-sm text-gray-500 text-left leading-relaxed">
                Estamos localizados na <strong>Av. Presid. Arthur da Silva Bernardes, 1323</strong>, no tradicional bairro Portão em Curitiba – PR (CEP: 80320-300). 
              </p>
              
              <p className="text-xs text-gray-400 text-left">
                Converse com a equipe antes da visita para confirmar pneus, serviços e horário de atendimento.
              </p>

              <div className="bg-black border border-yellow-500/20 p-4 rounded-2xl text-white text-xs space-y-2">
                <p className="flex items-center gap-2">
                  <Map className="w-4 h-4 text-yellow-500 shrink-0" />
                  <span><strong>Endereço:</strong> Av. Presidente Arthur da Silva Bernardes, 1323</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-yellow-500 shrink-0" />
                  <span><strong>Telefone:</strong> (41) 3082-7282</span>
                </p>
                <p className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-yellow-500 shrink-0" />
                  <span><strong>Referência:</strong> Próximo à rotatória e canaletas expressas do Portão.</span>
                </p>
              </div>

              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=Av.+Pres.+Arthur+da+Silva+Bernardes,+1323+-+Port%C3%A3o,+Curitiba+-+PR,+80320-300"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="carplus-action-secondary"
                  id="google-maps-directions-link"
                >
                  <Navigation className="w-4 h-4 shrink-0" />
                  Como chegar
                </a>
                <a
                  href="tel:4130827282"
                  className="carplus-action-secondary"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Ligar na Loja
                </a>
              </div>
            </div>

            {/* Embedded Live Google Maps Iframe (7 Columns) */}
            <div className="md:col-span-7 bg-[#f9fafb] border border-gray-150 p-2.5 rounded-3xl h-[280px] sm:h-[350px] relative overflow-hidden flex flex-col justify-between shadow-inner">
              <iframe
                title="Google Maps Carplus Pneus Arthur Bernardes Curitiba"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3601.8153096896264!2d-49.29955748858296!3d-25.477815134730646!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94dce308bc6ec871%3A0xe74ce958b449b28b!2sAv.%20Pres.%20Arthur%20da%20Silva%20Bernardes%2C%201323%20-%20Port%C3%A3o%2C%20Curitiba%20-%20PR%2C%2080320-300!5e0!3m2!1spt-BR!2sbr!4v1718040000000!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '1.25rem' }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full p-2"
              ></iframe>
            </div>

          </div>
        </section>

      </main>)}

      {/* Instagram Feed Section */}
      <Suspense fallback={null}>
        <InstagramFeed />
      </Suspense>

      {/* Primary contact remains available while browsing. Sharing is in the footer. */}
      <Suspense fallback={null}>
        <LiveWhatsAppChat pageKey={currentView} />
      </Suspense>
      <ScrollToTop />

      {/* Structured Footer */}
      <Footer onNavigate={handleScrollToSection} pageKey={`${currentView}:${selectedCatalogTire?.slug || selectedTire?.id || selectedBlogSlug || seoTarget?.name || ''}`} />

      {/* Cart side panel Drawer */}
      <Suspense fallback={null}>
        <CartDrawer 
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onRemoveItem={handleRemoveFromCart}
          onUpdateQuantity={handleUpdateQuantity}
          onClearCart={handleClearCart}
          onNavigateToCart={() => {
            setIsCartOpen(false);
            setCurrentView('carrinho');
            setSeoTarget(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            window.history.pushState(null, '', '/carrinho');
          }}
        />
      </Suspense>

    </div>
  );
}
