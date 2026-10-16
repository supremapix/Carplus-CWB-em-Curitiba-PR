import React, { useState, useMemo, useEffect } from 'react';
import { CatalogTire } from '../types';
import { 
  getCatalogSync, getFullCatalog,
  CATALOG_BRANDS, CATALOG_CATEGORIES, 
  CATALOG_RIMS, CATALOG_WIDTHS, CATALOG_PROFILES, 
  CATALOG_VEHICLE_TYPES 
} from '../data/catalogo-pneus';
import CatalogTireCard from './CatalogTireCard';
import { 
  Search, SlidersHorizontal, X, ArrowUpDown, ChevronLeft, 
  ChevronRight, Filter, Sparkles, Check, RotateCcw, 
  Car, ShieldCheck, Tag, ShoppingBag, Loader2
} from 'lucide-react';

interface TireCatalogViewProps {
  initialBrand?: string;
  initialRim?: number;
  initialCategory?: string;
  initialSearch?: string;
  initialPage?: number;
  onSelectTire: (tire: CatalogTire) => void;
  onNavigateHome: () => void;
}

const ITEMS_PER_PAGE = 24;

export default function TireCatalogView({
  initialBrand,
  initialRim,
  initialCategory,
  initialSearch = '',
  initialPage = 1,
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
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand || 'Todas');
  const [selectedRim, setSelectedRim] = useState<number | 'Todos'>(initialRim || 'Todos');
  const [selectedWidth, setSelectedWidth] = useState<number | 'Todas'>('Todas');
  const [selectedProfile, setSelectedProfile] = useState<number | 'Todos'>('Todos');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'Todas');
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>('Todos');
  
  // Sort state
  const [sortBy, setSortBy] = useState<'relevancia' | 'marca' | 'aro-asc' | 'aro-desc' | 'nome'>('relevancia');

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(initialPage || 1);

  // Mobile filter drawer state
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Sync initial props if changed
  useEffect(() => {
    if (initialBrand) setSelectedBrand(initialBrand);
    if (initialRim) setSelectedRim(initialRim);
    if (initialCategory) setSelectedCategory(initialCategory);
    if (initialPage) setCurrentPage(initialPage);
  }, [initialBrand, initialRim, initialCategory, initialPage]);

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
    searchTerm, selectedBrand, selectedRim, selectedWidth, 
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
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-4 sm:py-8 px-4 sm:px-6 font-sans" id="tire-catalog-page">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Search, sorting and active filters stay above the products. */}
        <div id="catalog-search-controls" className="bg-white rounded-3xl border border-gray-200 p-4 sm:p-8 shadow-xs space-y-4">
          {/* Quick Search & Sort Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-1">
            <div className="relative md:col-span-8 lg:col-span-9">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                aria-label="Buscar pneus por medida, marca ou carro"
                value={searchTerm}
                onChange={(e) => handleFilterChange(() => setSearchTerm(e.target.value))}
                placeholder="Busque por medida (ex: 205/55R16), marca, modelo ou carro (ex: Corolla, HB20, Dolphin)..."
                className="w-full pl-11 pr-10 py-3 bg-gray-50 border border-gray-250 rounded-2xl text-xs sm:text-sm text-gray-900 focus:bg-white focus:border-[#f49e1a] focus:ring-2 focus:ring-yellow-500/20 outline-none transition"
              />
              {searchTerm && (
                <button
                  onClick={() => handleFilterChange(() => setSearchTerm(''))}
                  aria-label="Limpar busca de pneus"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 md:col-span-4 lg:col-span-3">
              <div className="relative w-full">
                <select
                  aria-label="Ordenar pneus"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full appearance-none bg-gray-50 border border-gray-250 py-3 pl-3 pr-8 rounded-2xl text-xs font-bold text-gray-800 focus:bg-white focus:border-[#f49e1a] outline-none cursor-pointer"
                >
                  <option value="relevancia">Mais Relevantes</option>
                  <option value="marca">Marca (A-Z)</option>
                  <option value="aro-asc">Aro Crescente (13 → 23)</option>
                  <option value="aro-desc">Aro Decrescente (23 → 13)</option>
                  <option value="nome">Nome do Pneu (A-Z)</option>
                </select>
                <ArrowUpDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>

              {/* Mobile filter toggle button */}
              <button
                onClick={() => setIsMobileFiltersOpen(true)}
                aria-label="Abrir filtros de pneus"
                className="lg:hidden bg-gray-900 text-white p-3 rounded-2xl flex items-center justify-center gap-1.5 shrink-0 relative font-bold text-xs"
              >
                <Filter className="w-4 h-4 text-[#f49e1a]" />
                <span className="hidden sm:inline">Filtros</span>
                {activeFilterCount > 0 && (
                  <span className="bg-[#f49e1a] text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Active Filter Pills Strip */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 text-xs">
              <span className="text-gray-500 font-bold text-[11px]">Filtros ativos:</span>
              
              {selectedBrand !== 'Todas' && (
                <span className="inline-flex items-center gap-1 bg-gray-900 text-white px-2.5 py-1 rounded-lg text-xs font-bold">
                  Marca: {selectedBrand}
                  <X className="w-3 h-3 cursor-pointer hover:text-yellow-400" onClick={() => handleFilterChange(() => setSelectedBrand('Todas'))} />
                </span>
              )}

              {selectedRim !== 'Todos' && (
                <span className="inline-flex items-center gap-1 bg-[#f49e1a] text-black px-2.5 py-1 rounded-lg text-xs font-black">
                  Aro: {selectedRim}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => handleFilterChange(() => setSelectedRim('Todos'))} />
                </span>
              )}

              {selectedCategory !== 'Todas' && (
                <span className="inline-flex items-center gap-1 bg-gray-200 text-gray-800 px-2.5 py-1 rounded-lg text-xs font-bold">
                  Categoria: {selectedCategory}
                  <X className="w-3 h-3 cursor-pointer hover:text-black" onClick={() => handleFilterChange(() => setSelectedCategory('Todas'))} />
                </span>
              )}

              {selectedWidth !== 'Todas' && (
                <span className="inline-flex items-center gap-1 bg-gray-200 text-gray-800 px-2.5 py-1 rounded-lg text-xs font-bold">
                  Largura: {selectedWidth} mm
                  <X className="w-3 h-3 cursor-pointer hover:text-black" onClick={() => handleFilterChange(() => setSelectedWidth('Todas'))} />
                </span>
              )}

              {selectedProfile !== 'Todos' && (
                <span className="inline-flex items-center gap-1 bg-gray-200 text-gray-800 px-2.5 py-1 rounded-lg text-xs font-bold">
                  Perfil: {selectedProfile}%
                  <X className="w-3 h-3 cursor-pointer hover:text-black" onClick={() => handleFilterChange(() => setSelectedProfile('Todos'))} />
                </span>
              )}

              {selectedVehicleType !== 'Todos' && (
                <span className="inline-flex items-center gap-1 bg-gray-200 text-gray-800 px-2.5 py-1 rounded-lg text-xs font-bold">
                  Veículo: {selectedVehicleType}
                  <X className="w-3 h-3 cursor-pointer hover:text-black" onClick={() => handleFilterChange(() => setSelectedVehicleType('Todos'))} />
                </span>
              )}

              {searchTerm && (
                <span className="inline-flex items-center gap-1 bg-yellow-500/20 text-yellow-900 border border-yellow-500/30 px-2.5 py-1 rounded-lg text-xs font-bold">
                  Busca: "{searchTerm}"
                  <X className="w-3 h-3 cursor-pointer" onClick={() => handleFilterChange(() => setSearchTerm(''))} />
                </span>
              )}

              <button
                onClick={handleResetFilters}
                className="text-xs font-extrabold text-red-600 hover:text-red-700 underline ml-2"
              >
                Limpar todos os filtros
              </button>
            </div>
          )}
        </div>

        {/* Main Content Layout: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 space-y-4">
            <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-xs space-y-6 sticky top-24">
              <div className="flex items-center justify-between border-b border-gray-150 pb-3">
                <span className="text-sm font-black text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#f49e1a]" /> Filtros de Busca
                </span>
                {activeFilterCount > 0 && (
                  <button
                    onClick={handleResetFilters}
                    className="text-[11px] font-bold text-gray-500 hover:text-red-600 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Limpar
                  </button>
                )}
              </div>

              {/* Marca */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-gray-700 block">
                  Marca ({CATALOG_BRANDS.length})
                </label>
                <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                  <button
                    onClick={() => handleFilterChange(() => setSelectedBrand('Todas'))}
                    className={`text-left text-xs font-bold px-2.5 py-1.5 rounded-lg transition ${
                      selectedBrand === 'Todas'
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Todas
                  </button>
                  {CATALOG_BRANDS.map(brand => (
                    <button
                      key={brand}
                      onClick={() => handleFilterChange(() => setSelectedBrand(brand))}
                      className={`text-left text-xs font-bold px-2.5 py-1.5 rounded-lg transition truncate ${
                        selectedBrand.toLowerCase() === brand.toLowerCase()
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                      title={brand}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Aro */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-gray-700 block">
                  Aro da Roda
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    onClick={() => handleFilterChange(() => setSelectedRim('Todos'))}
                    className={`text-xs font-bold py-1.5 rounded-lg transition text-center ${
                      selectedRim === 'Todos'
                        ? 'bg-[#f49e1a] text-black font-black'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Todos
                  </button>
                  {CATALOG_RIMS.map(rim => (
                    <button
                      key={rim}
                      onClick={() => handleFilterChange(() => setSelectedRim(rim))}
                      className={`text-xs font-bold py-1.5 rounded-lg transition text-center ${
                        selectedRim === rim
                          ? 'bg-[#f49e1a] text-black font-black'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Aro {rim}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categoria */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-gray-700 block">
                  Categoria de Uso
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleFilterChange(() => setSelectedCategory(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-250 py-2 px-3 rounded-xl text-xs font-bold text-gray-800 outline-none"
                >
                  <option value="Todas">Todas as Categorias</option>
                  {CATALOG_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Largura & Perfil */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase text-gray-700 block">
                    Largura (mm)
                  </label>
                  <select
                    value={selectedWidth}
                    onChange={(e) => handleFilterChange(() => setSelectedWidth(e.target.value === 'Todas' ? 'Todas' : parseInt(e.target.value, 10)))}
                    className="w-full bg-gray-50 border border-gray-250 py-2 px-2 rounded-xl text-xs font-bold text-gray-800 outline-none"
                  >
                    <option value="Todas">Todas</option>
                    {CATALOG_WIDTHS.map(w => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase text-gray-700 block">
                    Perfil (%)
                  </label>
                  <select
                    value={selectedProfile}
                    onChange={(e) => handleFilterChange(() => setSelectedProfile(e.target.value === 'Todos' ? 'Todos' : parseInt(e.target.value, 10)))}
                    className="w-full bg-gray-50 border border-gray-250 py-2 px-2 rounded-xl text-xs font-bold text-gray-800 outline-none"
                  >
                    <option value="Todos">Todos</option>
                    {CATALOG_PROFILES.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tipo de Veículo */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-gray-700 block">
                  Tipo de Veículo
                </label>
                <select
                  value={selectedVehicleType}
                  onChange={(e) => handleFilterChange(() => setSelectedVehicleType(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-250 py-2 px-3 rounded-xl text-xs font-bold text-gray-800 outline-none"
                >
                  <option value="Todos">Todos os Veículos</option>
                  {CATALOG_VEHICLE_TYPES.map(vt => (
                    <option key={vt} value={vt}>{vt}</option>
                  ))}
                </select>
              </div>

              {/* Quick Info Box */}
              <div className="bg-yellow-500/10 border border-yellow-500/20 p-3.5 rounded-2xl text-[11px] space-y-1">
                <span className="font-bold text-gray-900 block flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-yellow-700" /> Estrutura Especializada
                </span>
                <p className="text-gray-650 leading-relaxed">
                  Todos os pneus contam com maquinário pneumático anti-risco e alinhamento 3D no Portão.
                </p>
              </div>

            </div>
          </aside>

          {/* Products Grid & Pagination */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* Counter bar */}
            <div className="flex items-center justify-between text-xs font-bold text-gray-600 bg-white px-4 py-3 rounded-2xl border border-gray-200">
              <span>
                Exibindo <strong className="text-gray-950">{totalItems > 0 ? startIndex + 1 : 0}-{endIndex}</strong> de <strong className="text-gray-950">{totalItems}</strong> pneus encontrados
              </span>
              <span className="text-gray-400 hidden sm:inline">
                Página {validCurrentPage} de {totalPages}
              </span>
            </div>

            {/* Products Grid */}
            {currentTires.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4" id="catalog-products-grid">
                {currentTires.map((tire) => (
                  <CatalogTireCard
                    key={`tire-${tire.id}-${tire.slug}`}
                    tire={tire}
                    onSelect={onSelectTire}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-4">
                <div className="w-12 h-12 bg-yellow-500/10 text-yellow-700 rounded-full flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-gray-900">
                  Nenhum pneu encontrado com esses filtros
                </h3>
                <p className="text-xs text-gray-600 max-w-md mx-auto">
                  Tente limpar os filtros de busca ou procurar por outra medida, aro ou marca de pneu.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-gray-900 text-white text-xs font-black px-5 py-2.5 rounded-xl hover:bg-black transition"
                >
                  Restaurar Todos os Produtos
                </button>
              </div>
            )}

            {/* Pagination Controls (24 per page) */}
            {totalPages > 1 && (
              <div className="bg-white rounded-3xl border border-gray-200 p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(validCurrentPage - 1)}
                    disabled={validCurrentPage === 1}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold border border-gray-250 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none transition flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Anterior</span>
                  </button>

                  <button
                    onClick={() => handlePageChange(validCurrentPage + 1)}
                    disabled={validCurrentPage === totalPages}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold border border-gray-250 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none transition flex items-center gap-1"
                  >
                    <span className="hidden sm:inline">Próxima</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Page Number Buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1">
                  {/* First page */}
                  {validCurrentPage > 3 && (
                    <>
                      <button
                        onClick={() => handlePageChange(1)}
                        className="w-8 h-8 rounded-lg text-xs font-bold border border-gray-200 hover:bg-gray-100 text-gray-700"
                      >
                        1
                      </button>
                      {validCurrentPage > 4 && <span className="text-gray-400 text-xs px-1">...</span>}
                    </>
                  )}

                  {/* Middle pages window */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => Math.abs(p - validCurrentPage) <= 2)
                    .map(page => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition ${
                          validCurrentPage === page
                            ? 'bg-[#f49e1a] text-black font-black shadow-xs'
                            : 'border border-gray-200 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                  {/* Last page */}
                  {validCurrentPage < totalPages - 2 && (
                    <>
                      {validCurrentPage < totalPages - 3 && <span className="text-gray-400 text-xs px-1">...</span>}
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        className="w-8 h-8 rounded-lg text-xs font-bold border border-gray-200 hover:bg-gray-100 text-gray-700"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>

                <div className="text-xs text-gray-500 font-medium">
                  Total: {totalPages} páginas ({totalItems} produtos)
                </div>
              </div>
            )}

          </main>
        </div>

        {/* Store presentation follows the products so visitors can browse immediately. */}
        <section id="catalog-presentation" aria-labelledby="catalog-page-title" className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#f49e1a]">
                  Catálogo Oficial Carplus
                </span>
                <span className="text-[11px] font-bold bg-yellow-500/10 text-yellow-800 px-2.5 py-0.5 rounded-full border border-yellow-500/20">
                  {catalogList.length > 50 ? catalogList.length : 1962} opções no catálogo
                </span>
              </div>
              <h1 id="catalog-page-title" className="text-2xl sm:text-3xl font-black text-gray-950 uppercase tracking-tight">
                Pneus e Auto Center em Curitiba – Portão
              </h1>
              <p className="text-sm sm:text-base text-gray-700 max-w-3xl leading-relaxed bg-amber-50/50 p-3.5 rounded-2xl border border-amber-200/60 mt-1">
                Encontre pneus por medida, marca ou carro. Compare as opções e consulte preço, disponibilidade e aplicação pelo WhatsApp. Montagem e serviços na Carplus, no Portão, Curitiba.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onNavigateHome}
                className="text-xs font-bold text-gray-600 hover:text-black bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-xl transition"
              >
                Voltar à Página Inicial
              </button>
            </div>
          </div>
        </section>

        {/* Mobile Filter Drawer / Modal */}
        {isMobileFiltersOpen && (
          <div className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-xs lg:hidden">
            <div className="bg-white w-full max-w-md h-full ml-auto overflow-y-auto p-6 space-y-6 flex flex-col justify-between">
              
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <span className="text-base font-black text-gray-950 flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-[#f49e1a]" /> Filtros do Catálogo
                  </span>
                  <button
                    onClick={() => setIsMobileFiltersOpen(false)}
                    aria-label="Fechar filtros de pneus"
                    className="min-h-11 min-w-11 p-2 rounded-full hover:bg-gray-100 text-gray-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Marca */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-700 block">Marca</label>
                  <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto">
                    <button
                      onClick={() => handleFilterChange(() => setSelectedBrand('Todas'))}
                      className={`text-xs font-bold p-2 rounded-xl text-left ${selectedBrand === 'Todas' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}
                    >
                      Todas
                    </button>
                    {CATALOG_BRANDS.map(brand => (
                      <button
                        key={brand}
                        onClick={() => handleFilterChange(() => setSelectedBrand(brand))}
                        className={`text-xs font-bold p-2 rounded-xl text-left truncate ${selectedBrand.toLowerCase() === brand.toLowerCase() ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Aro */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-700 block">Aro</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    <button
                      onClick={() => handleFilterChange(() => setSelectedRim('Todos'))}
                      className={`text-xs font-bold p-2 rounded-xl ${selectedRim === 'Todos' ? 'bg-[#f49e1a] text-black font-black' : 'bg-gray-100 text-gray-800'}`}
                    >
                      Todos
                    </button>
                    {CATALOG_RIMS.map(rim => (
                      <button
                        key={rim}
                        onClick={() => handleFilterChange(() => setSelectedRim(rim))}
                        className={`text-xs font-bold p-2 rounded-xl ${selectedRim === rim ? 'bg-[#f49e1a] text-black font-black' : 'bg-gray-100 text-gray-800'}`}
                      >
                        {rim}"
                      </button>
                    ))}
                  </div>
                </div>

                {/* Categoria */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-700 block">Categoria</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => handleFilterChange(() => setSelectedCategory(e.target.value))}
                    className="w-full bg-gray-100 p-2.5 rounded-xl text-xs font-bold text-gray-900"
                  >
                    <option value="Todas">Todas as Categorias</option>
                    {CATALOG_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="w-full bg-[#f49e1a] text-black font-black py-3 rounded-2xl text-sm"
                >
                  Ver {totalItems} Resultados
                </button>
                <button
                  onClick={() => {
                    handleResetFilters();
                    setIsMobileFiltersOpen(false);
                  }}
                  className="w-full bg-gray-100 text-gray-700 font-bold py-2.5 rounded-2xl text-xs"
                >
                  Limpar Filtros
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Rich Authoritative SEO Guide & FAQ for Search Engines (Google, Bing, Yahoo) and LLMs */}
        <section className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 space-y-8 shadow-xs mt-10" id="seo-pneus-curitiba-guide">
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
                <h4 className="font-black text-sm text-gray-900">Onde comprar pneus novos em Curitiba com menor preço garantido?</h4>
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
        </section>

      </div>
    </div>
  );
}
