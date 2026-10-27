import React, { useState, useMemo, useEffect, useRef } from 'react';
import '../tire-catalog.css';
import { CatalogTire } from '../types';
import {
  getCatalogSync, getFullCatalog,
  CATALOG_BRANDS, CATALOG_CATEGORIES,
  CATALOG_RIMS, CATALOG_WIDTHS, CATALOG_PROFILES,
  CATALOG_VEHICLE_TYPES
} from '../data/catalogo-pneus';
import CatalogTireCard from './CatalogTireCard';
import { Search, X, ChevronLeft, ChevronRight, ChevronDown, SlidersHorizontal, Sparkles, Check, Car, ShieldCheck, Loader2 } from 'lucide-react';

export interface TireCatalogState {
  searchTerm: string;
  selectedBrand: string;
  selectedRim: number | 'Todos';
  selectedWidth: number | 'Todas';
  selectedProfile: number | 'Todos';
  selectedCategory: string;
  selectedVehicleType: string;
  sortBy: 'relevancia' | 'marca' | 'aro-asc' | 'aro-desc' | 'nome';
  currentPage: number;
}

interface TireCatalogViewProps {
  initialBrand?: string;
  initialRim?: number;
  initialCategory?: string;
  initialSearch?: string;
  initialPage?: number;
  initialState?: TireCatalogState;
  onStateChange?: (state: TireCatalogState) => void;
  onSelectTire: (tire: CatalogTire) => void;
  onNavigateHome: () => void;
}

const ITEMS_PER_PAGE = 24;
const normalizeBrand = (brand?: string) => CATALOG_BRANDS.find(option => option.toLowerCase() === brand?.toLowerCase()) || brand || 'Todas';
const normalizeCategory = (category?: string) => CATALOG_CATEGORIES.find(option => option.toLowerCase() === category?.toLowerCase()) || category || 'Todas';

export default function TireCatalogView({
  initialBrand,
  initialRim,
  initialCategory,
  initialSearch = '',
  initialPage = 1,
  initialState,
  onStateChange,
  onSelectTire,
  onNavigateHome
}: TireCatalogViewProps) {
  const [catalogList, setCatalogList] = useState<CatalogTire[]>(getCatalogSync);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoadingCatalog(true);
    getFullCatalog().then(fullList => {
      if (isMounted) {
        setCatalogList(fullList);
        setIsLoadingCatalog(false);
      }
    }).catch(() => {
      if (isMounted) setIsLoadingCatalog(false);
    });
    return () => { isMounted = false; };
  }, []);

  // Filter states
  const [searchTerm, setSearchTerm] = useState(initialState?.searchTerm ?? initialSearch);
  const [selectedBrand, setSelectedBrand] = useState<string>(initialState?.selectedBrand ?? normalizeBrand(initialBrand));
  const [selectedRim, setSelectedRim] = useState<number | 'Todos'>(initialState?.selectedRim ?? (initialRim || 'Todos'));
  const [selectedWidth, setSelectedWidth] = useState<number | 'Todas'>(initialState?.selectedWidth ?? 'Todas');
  const [selectedProfile, setSelectedProfile] = useState<number | 'Todos'>(initialState?.selectedProfile ?? 'Todos');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialState?.selectedCategory ?? normalizeCategory(initialCategory));
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>(initialState?.selectedVehicleType ?? 'Todos');

  // Sort state
  const [sortBy, setSortBy] = useState<TireCatalogState['sortBy']>(initialState?.sortBy ?? 'relevancia');

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(initialState?.currentPage ?? (initialPage || 1));

  const resultsRef = useRef<HTMLDivElement>(null);

  // Restore a returning visitor's filters; a new navigation request resets them.
  const initialPropsKey = JSON.stringify([initialBrand, initialRim, initialCategory, initialSearch, initialPage]);
  const previousInitialProps = useRef(initialPropsKey);
  useEffect(() => {
    if (previousInitialProps.current === initialPropsKey) return;
    previousInitialProps.current = initialPropsKey;
    setSelectedBrand(normalizeBrand(initialBrand));
    setSelectedRim(initialRim || 'Todos');
    setSelectedCategory(normalizeCategory(initialCategory));
    setSearchTerm(initialSearch);
    setSelectedWidth('Todas');
    setSelectedProfile('Todos');
    setSelectedVehicleType('Todos');
    setSortBy('relevancia');
    setCurrentPage(initialPage || 1);
  }, [initialPropsKey, initialBrand, initialRim, initialCategory, initialSearch, initialPage]);

  useEffect(() => {
    onStateChange?.({ searchTerm, selectedBrand, selectedRim, selectedWidth, selectedProfile, selectedCategory, selectedVehicleType, sortBy, currentPage });
  }, [searchTerm, selectedBrand, selectedRim, selectedWidth, selectedProfile, selectedCategory, selectedVehicleType, sortBy, currentPage, onStateChange]);

  // Reset page when filters change
  const handleFilterChange = (setter: () => void) => {
    setter();
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedBrand('Todas');
    setSelectedRim('Todos');
    setSelectedWidth('Todas');
    setSelectedProfile('Todos');
    setSelectedCategory('Todas');
    setSelectedVehicleType('Todos');
    setSortBy('relevancia');
    setCurrentPage(1);
  };

  // Filtered and Sorted Tires calculation
  const filteredTires = useMemo(() => {
    let result = [...catalogList];

    // Search query filter (matches name, measure, brand, model, or compatible car)
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      const normalizedQ = q.replace(/[^a-z0-9]/g, '');
      result = result.filter(tire => {
        const nameMatch = tire.nome.toLowerCase().includes(q);
        const medidaMatch = tire.medida.toLowerCase().includes(q) || tire.medida.toLowerCase().replace(/[^a-z0-9]/g, '').includes(normalizedQ);
        const brandMatch = tire.marca.toLowerCase().includes(q);
        const lineMatch = (tire.linha || '').toLowerCase().includes(q);
        const carMatch = (tire.carros || []).some(car => car.toLowerCase().includes(q));
        const categoryMatch = (tire.categoria || '').toLowerCase().includes(q);
        return nameMatch || medidaMatch || brandMatch || lineMatch || carMatch || categoryMatch;
      });
    }

    // Brand filter
    if (selectedBrand !== 'Todas') {
      result = result.filter(t => t.marca.toLowerCase() === selectedBrand.toLowerCase());
    }

    // Rim filter
    if (selectedRim !== 'Todos') {
      result = result.filter(t => t.aro === selectedRim);
    }

    // Width filter
    if (selectedWidth !== 'Todas') {
      result = result.filter(t => t.largura === selectedWidth);
    }

    // Profile filter
    if (selectedProfile !== 'Todos') {
      result = result.filter(t => t.perfil === selectedProfile);
    }

    // Category filter
    if (selectedCategory !== 'Todas') {
      result = result.filter(t => t.categoria.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Vehicle type filter
    if (selectedVehicleType !== 'Todos') {
      result = result.filter(t => (t.tipoVeiculo || []).some(v => v.toLowerCase() === selectedVehicleType.toLowerCase()));
    }

    // Sorting
    if (sortBy === 'marca') {
      result.sort((a, b) => a.marca.localeCompare(b.marca) || a.nome.localeCompare(b.nome));
    } else if (sortBy === 'aro-asc') {
      result.sort((a, b) => a.aro - b.aro || a.largura - b.largura);
    } else if (sortBy === 'aro-desc') {
      result.sort((a, b) => b.aro - a.aro || b.largura - a.largura);
    } else if (sortBy === 'nome') {
      result.sort((a, b) => a.nome.localeCompare(b.nome));
    } else {
      // Relevância: Destaque > Novo Modelo > Aro decrescente
      result.sort((a, b) => {
        if (a.destaque && !b.destaque) return -1;
        if (!a.destaque && b.destaque) return 1;
        if (a.novoModelo && !b.novoModelo) return -1;
        if (!a.novoModelo && b.novoModelo) return 1;
        return a.id - b.id;
      });
    }

    return result;
  }, [
    catalogList, searchTerm, selectedBrand, selectedRim, selectedWidth,
    selectedProfile, selectedCategory, selectedVehicleType, sortBy
  ]);

  // Pagination calculation
  const totalItems = filteredTires.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const currentTires = filteredTires.slice(startIndex, endIndex);

  // Active filter count
  const activeFilterCount = [
    selectedBrand !== 'Todas',
    selectedRim !== 'Todos',
    selectedWidth !== 'Todas',
    selectedProfile !== 'Todos',
    selectedCategory !== 'Todas',
    selectedVehicleType !== 'Todos',
    searchTerm.trim().length > 0
  ].filter(Boolean).length;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    resultsRef.current?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    resultsRef.current?.focus({ preventScroll: true });
  };

  const activeFilters = [
    ...(searchTerm.trim() ? [{ label: `Busca: ${searchTerm}`, clear: () => setSearchTerm('') }] : []),
    ...(selectedRim !== 'Todos' ? [{ label: `Aro ${selectedRim}`, clear: () => setSelectedRim('Todos') }] : []),
    ...(selectedBrand !== 'Todas' ? [{ label: selectedBrand, clear: () => setSelectedBrand('Todas') }] : []),
    ...(selectedWidth !== 'Todas' ? [{ label: `Largura ${selectedWidth} mm`, clear: () => setSelectedWidth('Todas') }] : []),
    ...(selectedProfile !== 'Todos' ? [{ label: `Perfil ${selectedProfile}%`, clear: () => setSelectedProfile('Todos') }] : []),
    ...(selectedCategory !== 'Todas' ? [{ label: selectedCategory, clear: () => setSelectedCategory('Todas') }] : []),
    ...(selectedVehicleType !== 'Todos' ? [{ label: selectedVehicleType, clear: () => setSelectedVehicleType('Todos') }] : []),
  ];

  return (
    <div className="carplus-catalog" id="tire-catalog-page">
      <div className="catalog-container">
        <nav className="catalog-breadcrumb" aria-label="Navegação estrutural">
          <a href="/" onClick={event => { if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) { event.preventDefault(); onNavigateHome(); } }}>Início</a>
          <ChevronRight aria-hidden="true" />
          <span aria-current="page">Catálogo de pneus</span>
        </nav>

        <header className="catalog-heading" id="catalog-presentation">
          <p className="catalog-eyebrow">Carplus · Portão, Curitiba</p>
          <h1 id="catalog-page-title">Encontre o pneu para seu carro</h1>
          <p>Busque pela medida ou escolha o aro e a marca. Veja os detalhes de cada pneu e consulte preço e disponibilidade.</p>
        </header>

        <section className="catalog-search-panel" id="catalog-search-controls" aria-label="Busca e filtros de pneus">
          <div className="catalog-primary-filters">
            <div className="catalog-field catalog-search-field">
              <label htmlFor="catalog-search">Medida, marca ou carro</label>
              <div className="catalog-search-input">
                <Search aria-hidden="true" />
                <input
                  id="catalog-search" type="search" value={searchTerm}
                  onChange={event => handleFilterChange(() => setSearchTerm(event.target.value))}
                  placeholder="Ex.: 205/55 R16 ou Corolla"
                  aria-describedby="catalog-search-help" autoComplete="off"
                />
                {searchTerm && <button type="button" onClick={() => handleFilterChange(() => setSearchTerm(''))} aria-label="Limpar busca de pneus"><X aria-hidden="true" /></button>}
              </div>
              <p id="catalog-search-help">A medida está escrita na lateral do pneu. Confirme a aplicação no manual do veículo.</p>
            </div>
            <div className="catalog-field">
              <label htmlFor="catalog-rim">Aro da roda</label>
              <select id="catalog-rim" value={selectedRim} onChange={event => handleFilterChange(() => setSelectedRim(event.target.value === 'Todos' ? 'Todos' : Number(event.target.value)))}>
                <option value="Todos">Todos os aros</option>
                {CATALOG_RIMS.map(rim => <option key={rim} value={rim}>Aro {rim}</option>)}
              </select>
            </div>
            <div className="catalog-field">
              <label htmlFor="catalog-brand">Marca</label>
              <select id="catalog-brand" value={selectedBrand} onChange={event => handleFilterChange(() => setSelectedBrand(event.target.value))}>
                <option value="Todas">Todas as marcas</option>
                {selectedBrand !== 'Todas' && !CATALOG_BRANDS.includes(selectedBrand) && <option value={selectedBrand}>{selectedBrand}</option>}
                {CATALOG_BRANDS.map(brand => <option key={brand} value={brand}>{brand}</option>)}
              </select>
            </div>
          </div>

          <details className="catalog-extra-filters">
            <summary><SlidersHorizontal aria-hidden="true" /><span>Refinar por medida e uso</span><ChevronDown aria-hidden="true" /></summary>
            <div className="catalog-extra-grid">
              <div className="catalog-field">
                <label htmlFor="catalog-width">Largura (mm)</label>
                <select id="catalog-width" value={selectedWidth} onChange={event => handleFilterChange(() => setSelectedWidth(event.target.value === 'Todas' ? 'Todas' : Number(event.target.value)))}>
                  <option value="Todas">Todas as larguras</option>
                  {CATALOG_WIDTHS.map(width => <option key={width} value={width}>{width} mm</option>)}
                </select>
              </div>
              <div className="catalog-field">
                <label htmlFor="catalog-profile">Perfil (%)</label>
                <select id="catalog-profile" value={selectedProfile} onChange={event => handleFilterChange(() => setSelectedProfile(event.target.value === 'Todos' ? 'Todos' : Number(event.target.value)))}>
                  <option value="Todos">Todos os perfis</option>
                  {CATALOG_PROFILES.map(profile => <option key={profile} value={profile}>{profile}%</option>)}
                </select>
              </div>
              <div className="catalog-field">
                <label htmlFor="catalog-category">Categoria de uso</label>
                <select id="catalog-category" value={selectedCategory} onChange={event => handleFilterChange(() => setSelectedCategory(event.target.value))}>
                  <option value="Todas">Todas as categorias</option>
                  {selectedCategory !== 'Todas' && !CATALOG_CATEGORIES.includes(selectedCategory) && <option value={selectedCategory}>{selectedCategory}</option>}
                  {CATALOG_CATEGORIES.map(category => <option key={category} value={category}>{category}</option>)}
                </select>
              </div>
              <div className="catalog-field">
                <label htmlFor="catalog-vehicle">Tipo de veículo</label>
                <select id="catalog-vehicle" value={selectedVehicleType} onChange={event => handleFilterChange(() => setSelectedVehicleType(event.target.value))}>
                  <option value="Todos">Todos os veículos</option>
                  {CATALOG_VEHICLE_TYPES.map(vehicle => <option key={vehicle} value={vehicle}>{vehicle}</option>)}
                </select>
              </div>
            </div>
          </details>

          {activeFilterCount > 0 && <div className="catalog-active-filters" aria-label="Filtros selecionados">
            {activeFilters.map(filter => <button className="catalog-filter-chip" type="button" key={filter.label} onClick={() => handleFilterChange(filter.clear)} aria-label={`Remover filtro ${filter.label}`}><span>{filter.label}</span><X aria-hidden="true" /></button>)}
            <button type="button" className="catalog-clear" onClick={handleResetFilters}>Limpar filtros</button>
          </div>}
        </section>

        <section className="catalog-results" aria-labelledby="catalog-results-title" aria-busy={isLoadingCatalog}>
          <div className="catalog-results-toolbar" ref={resultsRef} tabIndex={-1}>
            <div>
              <h2 id="catalog-results-title">{isLoadingCatalog ? 'Carregando catálogo…' : `${totalItems.toLocaleString('pt-BR')} pneus encontrados`}</h2>
              <p role="status" aria-live="polite">{isLoadingCatalog ? 'Buscando todas as opções para você.' : totalItems > 0 ? `Mostrando ${startIndex + 1}–${endIndex} · Página ${validCurrentPage} de ${totalPages}` : 'Experimente outra medida ou remova um filtro.'}</p>
            </div>
            <div className="catalog-field catalog-sort">
              <label htmlFor="catalog-sort">Ordenar por</label>
              <select id="catalog-sort" value={sortBy} onChange={event => handleFilterChange(() => setSortBy(event.target.value as typeof sortBy))}>
                <option value="relevancia">Relevância</option>
                <option value="marca">Marca (A–Z)</option>
                <option value="aro-asc">Aro crescente</option>
                <option value="aro-desc">Aro decrescente</option>
                <option value="nome">Nome do pneu (A–Z)</option>
              </select>
            </div>
          </div>

          {currentTires.length > 0 ? (
            <div className="catalog-products" id="catalog-products-grid">
              {currentTires.map(tire => <CatalogTireCard key={`tire-${tire.id}-${tire.slug}`} tire={tire} onSelect={onSelectTire} />)}
            </div>
          ) : isLoadingCatalog ? (
            <div className="catalog-empty"><Loader2 className="catalog-loading-icon" aria-hidden="true" /><p>Carregando pneus…</p></div>
          ) : (
            <div className="catalog-empty">
              <Search aria-hidden="true" />
              <h3>Nenhum pneu encontrado</h3>
              <p>Tente outra medida, aro ou marca. Você também pode limpar os filtros para voltar ao catálogo completo.</p>
              <button type="button" onClick={handleResetFilters}>Ver todos os pneus</button>
            </div>
          )}

          {totalPages > 1 && <nav className="catalog-pagination" aria-label="Páginas do catálogo">
            <button type="button" onClick={() => handlePageChange(validCurrentPage - 1)} disabled={validCurrentPage === 1}><ChevronLeft aria-hidden="true" />Anterior</button>
            <label className="catalog-page-select">Página <select aria-label="Ir para a página" value={validCurrentPage} onChange={event => handlePageChange(Number(event.target.value))}>{Array.from({ length: totalPages }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}</option>)}</select><span>de {totalPages}</span></label>
            <button type="button" onClick={() => handlePageChange(validCurrentPage + 1)} disabled={validCurrentPage === totalPages}>Próxima<ChevronRight aria-hidden="true" /></button>
          </nav>}
        </section>

        {/* Rich Authoritative SEO Guide & FAQ for Search Engines (Google, Bing, Yahoo) and LLMs */}
        <details className="catalog-guide" id="seo-pneus-curitiba-guide">
          <summary><span>Guia de medidas e dúvidas sobre pneus</span><ChevronDown aria-hidden="true" /></summary>
          <div className="catalog-guide-content space-y-8">
          <div className="border-b border-gray-200 pb-6 space-y-3">
            <span className="bg-[#F5A623]/20 text-zinc-900 border border-[#F5A623]/40 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full inline-block">
              Guia Completo do Consumidor • Curitiba & Região
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-950 uppercase tracking-tight">
              Catálogo de Pneus em Curitiba: Guia Técnico de Compras & Instalação no Portão
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              Comprar pneus novos em Curitiba exige atenção ao clima chuvoso da cidade, ao tipo de pavimento urbano e às especificações originais recomendadas pelas montadoras. Na <strong>Carplus Pneus e Auto Center</strong> (Av. Presidente Arthur Bernardes, 1323 - Portão), mantemos um acervo permanente com mais de <strong>1.900 modelos de pneus novos</strong> homologados das principais marcas mundiais a pronta entrega.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 border border-gray-200 p-5 rounded-2xl space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#F5A623]/20 border border-[#F5A623]/40 flex items-center justify-center text-zinc-900 font-black">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="font-extrabold text-sm uppercase text-gray-900">Garantia Oficial de 5 Anos</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Todos os pneus comercializados pela Carplus acompanham garantia oficial de 5 anos direto do fabricante contra defeitos de fabricação ou vícios de estrutura.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-5 rounded-2xl space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#F5A623]/20 border border-[#F5A623]/40 flex items-center justify-center text-zinc-900 font-black">
                <Check className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="font-extrabold text-sm uppercase text-gray-900">Montagem & Balanceamento</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Equipamentos de montagem anti-risco e alinhamento 3D computadorizado a laser para preservar suas rodas e garantir rodagem uniforme sem trepidações no volante.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-5 rounded-2xl space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#F5A623]/20 border border-[#F5A623]/40 flex items-center justify-center text-zinc-900 font-black">
                <Car className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="font-extrabold text-sm uppercase text-gray-900">Aros 13 ao 23 a Pronta Entrega</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Linha completa para veículos populares (Gol, Uno, HB20, Onix), sedãs, SUVs (T-Cross, Creta, Compass), caminhonetes (Hilux, Ranger, S10) e carros elétricos (BYD Dolphin, Seal, GWM Haval).
              </p>
            </div>
          </div>

          {/* Marcas Parceiras */}
          <div className="space-y-3 pt-2 border-t border-gray-200">
            <h3 className="text-lg font-black uppercase text-gray-950">
              Marcas Oficiais Comercializadas em Curitiba
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Trabalhamos diretamente com os principais grupos pneumáticos do mundo: <strong>Pirelli, Bridgestone, Continental, Goodyear, Michelin, Firestone, Delinte, Xbri, Linglong, Yokohama, Prinx, Comforser, Speedmax, Zmax, Provato e Roadking</strong>.
            </p>
          </div>

          {/* FAQ Accordion Section for Google, Bing, Yahoo & LLMs */}
          <div className="space-y-4 pt-4 border-t border-gray-200" id="faq-pneus-curitiba">
            <h3 className="text-xl font-black uppercase text-gray-950 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#F5A623]" />
              Perguntas Frequentes sobre Pneus em Curitiba (FAQ)
            </h3>

            <div className="space-y-3">
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl space-y-1.5 text-left">
                <h4 className="font-black text-sm text-gray-900">Onde comprar pneus novos em Curitiba?</h4>
                <p className="text-xs text-gray-700 leading-relaxed">
                  Na <strong>Carplus Pneus e Auto Center</strong>, localizada na Av. Presidente Arthur Bernardes, 1323 - Bairro Portão, Curitiba - PR. Oferecemos preços de fábrica, montagem no local e orçamento transparente sem surpresas.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl space-y-1.5 text-left">
                <h4 className="font-black text-sm text-gray-900">Como saber a medida exata do pneu para o meu carro?</h4>
                <p className="text-xs text-gray-700 leading-relaxed">
                  Você pode verificar na lateral do pneu atual do seu veículo (exemplo: <strong>205/55 R16 91V</strong>) ou consultar o manual do proprietário / etiqueta na coluna da porta do motorista. Nosso assistente online e equipe pelo WhatsApp (41) 3082-7282 auxiliam no diagnóstico exato.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl space-y-1.5 text-left">
                <h4 className="font-black text-sm text-gray-900">Quando devo fazer a troca dos pneus?</h4>
                <p className="text-xs text-gray-700 leading-relaxed">
                  O limite legal do indicador TWI (Tread Wear Indicator) na banda de rodagem é de 1,6 mm. Se a borracha atingir essa marca ou se o pneu apresentar bolhas, ressecamento ou desgaste irregular, a substituição deve ser feita imediatamente para manter a segurança do veículo nas pistas molhadas de Curitiba.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl space-y-1.5 text-left">
                <h4 className="font-black text-sm text-gray-900">A Carplus atende a quais bairros e regiões de Curitiba?</h4>
                <p className="text-xs text-gray-700 leading-relaxed">
                  Localizada no Portão, a Carplus é de fácil acesso para motoristas do Água Verde, Vila Izabel, Batel, Santa Quitéria, Fazendinha, Capão Raso, Novo Mundo, Cidade Industrial (CIC), Centro, Bigorrilho, Champagnat e toda a Região Metropolitana de Curitiba.
                </p>
              </div>
            </div>
          </div>
          </div>
        </details>

      </div>
    </div>
  );
}
