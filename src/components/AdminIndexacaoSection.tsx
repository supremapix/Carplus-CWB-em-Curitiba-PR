import React, { useState } from 'react';
import { 
  ArrowLeft, BarChart3, Settings2, FileText, Signal, Map, Sparkles, AlertCircle, CheckCircle2 
} from 'lucide-react';
import { 
  calculateLocalScore, isPageReleased, getSavedGSCRate, saveGSCRate, 
  PRIORITY_NEIGHBORHOODS, PRIORITY_CITIES,
  getAllNeighborhoods, getAllCities, AROS as WAVE_AROS, CARS as WAVE_CARS
} from '../utils/seoWaves';

interface AdminIndexacaoSectionProps {
  onNavigateHome: () => void;
}

export default function AdminIndexacaoSection({ onNavigateHome }: AdminIndexacaoSectionProps) {
  const [simulatedRate, setSimulatedRate] = useState(() => getSavedGSCRate());
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const bairrosList = getAllNeighborhoods();
  const cidadesList = getAllCities();

  // Calculate counts based on current slider rate
  const indexableBairros = bairrosList.filter(b => isPageReleased(b, 'bairro', simulatedRate));
  const indexableCidades = cidadesList.filter(c => isPageReleased(c, 'cidade', simulatedRate));
  const indexableCarros = WAVE_CARS.filter(c => isPageReleased(c, 'carro', simulatedRate));
  const indexableAros = WAVE_AROS.filter(a => isPageReleased(a, 'aro', simulatedRate));

  const alwaysIndexedCount = 8; // static core pages + tires
  const totalIndexable = indexableBairros.length + indexableCidades.length + indexableCarros.length + indexableAros.length + alwaysIndexedCount;
  const totalPagesInSystem = bairrosList.length + cidadesList.length + WAVE_CARS.length + WAVE_AROS.length + alwaysIndexedCount;

  let currentPhaseName = "Fase 1 - Indexação Controlada (Bairros & Cidades Prioritários)";
  let phaseColor = "text-yellow-600 bg-yellow-50 border-yellow-250";
  if (simulatedRate >= 90) {
    currentPhaseName = "Fase 3 - Escalabilidade Enterprise Total (Tudo Liberado)";
    phaseColor = "text-green-700 bg-green-50 border-green-250";
  } else if (simulatedRate >= 80) {
    currentPhaseName = "Fase 2 - Liberação Progressiva (Próximos Bairros & Cidades pSEO)";
    phaseColor = "text-blue-700 bg-blue-50 border-blue-250";
  }

  const isAlertTriggered = simulatedRate < 70;

  // GBP Post Copywriter Recommendations Generator
  const [currentGbpPost, setCurrentGbpPost] = useState<{ text: string; pageName: string } | null>(null);

  const generateWeeklyRecommendation = () => {
    // Find currently indexable local pages
    const releasedLocals = [
      ...indexableBairros.map(b => ({ name: b, type: 'bairro' })),
      ...indexableCidades.map(c => ({ name: c, type: 'cidade' }))
    ];
    if (releasedLocals.length === 0) {
      setCurrentGbpPost({ text: "Cadastre bairros prioritários para gerar recomendações.", pageName: "Nenhum" });
      return;
    }
    // Pick a random indexable item
    const randomIndex = Math.floor(Math.random() * releasedLocals.length);
    const selected = releasedLocals[randomIndex];
    
    const cleanSlug = selected.name.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9_-\s]/gi, '')
      .trim().replace(/\s+/g, '-').replace(/-+/g, '-');

    const postText = `🚙 Buscando pneus novos de alta durabilidade e economia para rodar na região do ${selected.name === 'Curitiba' ? 'Centro' : selected.name}? ⭐️\n\nNa Carplus Pneus Arthur Bernardes (no Portão), oferecemos as melhores marcas mundiais como Pirelli, Goodyear, Bridgestone e Delinte com montagem técnica computadorizada e bicos de ar de brinde! 🛠\n\nMoradores e motoristas do ${selected.name} contam com condições incríveis de pagamento em até 10x sem juros! Consulte a medida recomendada para seu carro.\n\n👉 Acesse agora nossa página oficial de atendimento em ${selected.name}:\nhttps://www.carpluscwb.com.br/${selected.type}/${cleanSlug}`;
    
    setCurrentGbpPost({ text: postText, pageName: selected.name });
    setCopySuccess(null);
  };

  const handleCopyGbp = () => {
    if (!currentGbpPost) return;
    navigator.clipboard.writeText(currentGbpPost.text);
    setCopySuccess("Copiado!");
    setTimeout(() => setCopySuccess(null), 3000);
  };

  // Update rate and persist
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSimulatedRate(val);
    saveGSCRate(val);
  };

  // Active tab for listing pages below
  const [activeListTab, setActiveListTab] = useState<'bairro' | 'cidade' | 'carro' | 'aro'>('bairro');

  const getDisplayList = () => {
    if (activeListTab === 'bairro') return bairrosList;
    if (activeListTab === 'cidade') return cidadesList;
    if (activeListTab === 'carro') return WAVE_CARS;
    return WAVE_AROS;
  };

  return (
    <div className="space-y-8 text-gray-950 animate-fade-in pb-12" id="admin-dashboard-container">
      {/* Header block */}
      <div className="bg-gray-950 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl border border-gray-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="bg-yellow-500 text-gray-950 font-mono font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded inline-block">
              Enterprise SEO Control Box
            </span>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight font-mono text-yellow-500">
              Painel de Indexação em Ondas Progressivas
            </h1>
            <p className="text-xs text-gray-400 font-medium">
              Simulação e controle de liberação das páginas programáticas (pSEO) nas SERPs do Google Search Console.
            </p>
          </div>
          <button 
            onClick={onNavigateHome}
            className="self-start md:self-auto flex items-center gap-1.5 bg-gray-900 border border-gray-800 hover:bg-yellow-500 hover:text-gray-950 font-black text-xs uppercase px-4 py-2.5 rounded-xl transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Home
          </button>
        </div>
      </div>

      {/* Top Row Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border-2 border-gray-250 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] uppercase font-mono font-black tracking-wider text-gray-500">Índice GSC Estimado</span>
            <BarChart3 className="w-4 h-4 text-yellow-500" />
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-black font-mono text-gray-910">{simulatedRate}%</p>
            <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded border ${phaseColor}`}>
              {currentPhaseName.split('(')[0]}
            </span>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-250 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] uppercase font-mono font-black tracking-wider text-gray-500">Páginas Indexáveis</span>
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-black font-mono text-gray-910">{totalIndexable} <span className="text-xs text-gray-400 font-medium font-sans">/ {totalPagesInSystem}</span></p>
            <p className="text-[10px] text-gray-500 font-bold">
              {Math.round((totalIndexable / totalPagesInSystem) * 100)}% de eficiência técnica liberada
            </p>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-250 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] uppercase font-mono font-black tracking-wider text-gray-500 font-bold">URLs Filtradas (noindex)</span>
            <AlertCircle className="w-4 h-4 text-yellow-600" />
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-black font-mono text-yellow-600">{totalPagesInSystem - totalIndexable}</p>
            <p className="text-[10px] text-gray-400 font-bold">
              Proteção tática contra algoritmos de Spam Local
            </p>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-250 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] uppercase font-mono font-black tracking-wider text-gray-500">Crawler Health Status</span>
            <Signal className="w-4 h-4 text-blue-500" />
          </div>
          <div className="space-y-1">
            <p className={`text-xl font-black font-mono ${isAlertTriggered ? 'text-red-650' : 'text-green-700'}`}>
              {isAlertTriggered ? '🚨 ALERTA (<70%)' : '🟢 ESTÁVEL'}
            </p>
            <p className="text-[10px] text-gray-500 font-bold leading-tight">
              {isAlertTriggered ? 'Confiança algorítmica baixa! Alerta disparado.' : 'Comportamento de excelência. Risco de spam zero.'}
            </p>
          </div>
        </div>
      </div>

      {/* Slider Controller (Live Sandbox) */}
      <div className="bg-white border-2 border-gray-250 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-base font-black text-gray-900 uppercase font-mono flex items-center justify-center sm:justify-start gap-1.5">
            <Settings2 className="w-5 h-5 text-yellow-500" />
            Simulador e Provocador de Indexação do Google Search Console
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed font-semibold">
            Arraste o controle deslizante para simular o progresso do Google na indexação das páginas de bairros e municípios de Curitiba. Isso altera instantaneamente as tags e links do sitemap.
          </p>
        </div>

        {/* Range input */}
        <div className="space-y-3 bg-gray-50 border border-gray-150 p-6 rounded-2xl shadow-inner">
          <div className="flex items-center justify-between text-xs font-black font-mono uppercase tracking-wider">
            <span className="text-gray-400">Taxa Inicial (Phase 1)</span>
            <span className="text-gray-900 bg-white border border-gray-300 px-3 py-1.5 rounded-xl block text-sm shadow">
              Simulado GSC: <strong className="text-blue-600 ml-1">{simulatedRate}%</strong>
            </span>
            <span className="text-gray-400 font-bold">Modo Enterprise (100%)</span>
          </div>
          <input 
            type="range" 
            min="10" 
            max="100" 
            step="5" 
            value={simulatedRate} 
            onChange={handleSliderChange}
            className="w-full accent-blue-600 block h-2.5 bg-gray-200 rounded-lg cursor-ew-resize opacity-90"
            id="admin-slider-gsc"
          />
          <div className="grid grid-cols-3 text-center text-[10px] text-gray-500 uppercase font-mono font-black pt-3">
            <div className="text-left">
              <p className="text-gray-700">Fase 1 (10% - 79%)</p>
              <p className="font-medium text-[9px] text-gray-400">Somente Bairros (20) & Cidades (5) Principais</p>
            </div>
            <div>
              <p className="text-blue-600">Fase 2 (80% - 89%)</p>
              <p className="font-medium text-[9px] text-gray-400">+20 Bairros & +5 Cidades pSEO adicionados</p>
            </div>
            <div className="text-right">
              <p className="text-green-700">Fase 3 (&ge;90%)</p>
              <p className="font-medium text-[9px] text-gray-400">Liberação Completa (Aros, Carros e RMC completo)</p>
            </div>
          </div>
        </div>

        {/* Simulated alert banner */}
        {isAlertTriggered && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 space-y-2 text-xs">
            <h5 className="font-black flex items-center gap-1.5 uppercase font-mono text-xs text-red-650">
              <AlertCircle className="w-4 h-4 text-red-650" />
              GSC Monitor Alerta: Alarme de Confiança Baixa
            </h5>
            <p className="font-semibold leading-relaxed">
              ALERTA AUTOMÁTICO: A taxa de indexação atual simulada caiu abaixo do limite de segurança recomendado de <strong>70%</strong>. Baixo ranqueamento de páginas locais sem proteção tática noindex induz o crawler do Google a considerar as landings como "Páginas Úteis Duplicadas", reduzindo drasticamente o orçamento tático de rastreamento do Carplus CWB.
            </p>
          </div>
        )}
      </div>

      {/* Section row: GBP copywriter post & live view of pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* 1. GBP Weekly Post copy writer */}
        <div className="bg-white border-2 border-gray-250 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm flex flex-col justify-between h-full min-h-[460px]">
          <div className="space-y-3">
            <span className="bg-[#f49e1a]/15 text-gray-950 font-mono font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full inline-block">
              Google Meu Negócio (GBP) Integration
            </span>
            <h3 className="text-base font-black text-gray-950 uppercase font-mono flex items-center gap-1.5">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              Gerador de Postagens Semanal pSEO
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed font-semibold">
              Com o intuito de estabelecer autoridade nas landings liberadas em ondas, o algoritmo recomenda postar nos canais oficiais do Perfil da Empresa no Google de forma semanal linkando de volta para landings ativas (com robots index)!
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4.5 space-y-3 text-xs mt-4">
            {currentGbpPost ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-gray-250 pb-2">
                  <span className="text-[10px] font-black font-mono text-gray-400 uppercase tracking-widest">
                    Landing Selecionada: <strong className="text-gray-800 font-black">{currentGbpPost.pageName}</strong>
                  </span>
                  <span className="text-[9px] text-green-700 bg-green-50 px-2 py-0.5 rounded font-black uppercase font-mono">
                    Released / Ativo
                  </span>
                </div>
                <pre className="text-[11px] text-gray-750 font-sans font-bold leading-relaxed whitespace-pre-wrap max-h-56 overflow-y-auto select-all cursor-pointer border border-gray-150 p-3 rounded-lg bg-white shadow-inner">
                  {currentGbpPost.text}
                </pre>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400 space-y-2">
                <FileText className="w-8 h-8 text-gray-300 mx-auto" />
                <p className="font-extrabold text-xs">Nenhum post gerado ainda</p>
                <p className="text-[10px] font-medium">Clique no botão abaixo para gerar uma recomendação.</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              onClick={generateWeeklyRecommendation}
              className="flex-1 bg-[#f49e1a] hover:bg-black hover:text-white text-black font-black text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl border-2 border-black transition cursor-pointer text-center"
            >
              Sortear & Gerar Post Semanal
            </button>
            {currentGbpPost && (
              <button
                onClick={handleCopyGbp}
                className="bg-gray-950 hover:bg-gray-850 text-white font-extrabold text-xs uppercase tracking-wider py-3.5 px-4.5 rounded-xl transition cursor-pointer shrink-0 border-2 border-transparent"
              >
                {copySuccess || "Copiar Texto"}
              </button>
            )}
          </div>
        </div>

        {/* 2. Live Page index map (The Interactive Index Mapper list) */}
        <div className="bg-white border-2 border-gray-250 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm flex flex-col justify-between h-full min-h-[460px]">
          <div className="space-y-3">
            <h3 className="text-base font-black text-gray-950 uppercase font-mono flex items-center gap-1.5">
              <Map className="w-5 h-5 text-blue-500" />
              Mapeador Dinâmico de Landings
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed font-semibold">
              Visualize instantaneamente de forma tática o status de indexação de cada uma das landing pages cadastradas com base no índice simulado do GSC.
            </p>
          </div>

          {/* List Sub Tabs */}
          <div className="grid grid-cols-4 gap-1.5 bg-gray-100 p-1 rounded-xl mt-4 border border-gray-200">
            {(['bairro', 'cidade', 'carro', 'aro'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveListTab(tab)}
                className={`py-1.5 px-1 text-[10px] font-black uppercase tracking-wider rounded-lg transition shrink-0 cursor-pointer ${activeListTab === tab ? 'bg-white text-gray-950 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-800'}`}
              >
                {tab === 'bairro' ? 'Bairros' : tab === 'cidade' ? 'Cidades' : tab === 'carro' ? 'Carros' : 'Aros'}
              </button>
            ))}
          </div>

          {/* Search / Status Filter header */}
          <div className="border border-gray-150 rounded-2xl max-h-76 overflow-y-auto mt-4 bg-white shadow-inner divide-y divide-gray-150">
            {getDisplayList().map(name => {
              const score = calculateLocalScore(name, activeListTab);
              const isReleased = isPageReleased(name, activeListTab, simulatedRate);
              const isPriority = activeListTab === 'bairro' ? PRIORITY_NEIGHBORHOODS.includes(name) : activeListTab === 'cidade' ? PRIORITY_CITIES.includes(name) : false;

              return (
                <div key={name} className="flex items-center justify-between p-3.5 hover:bg-gray-50/50 transition">
                  <div className="space-y-1">
                    <span className="text-xs font-black text-gray-850 tracking-tight flex items-center gap-1">
                      {name}
                      {isPriority && (
                        <span className="bg-yellow-500/15 text-yellow-600 font-mono font-black text-[7px] uppercase px-1 rounded border border-yellow-500/15">
                          Priority
                        </span>
                      )}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-gray-400 font-black font-mono">
                      Score: <strong className="text-gray-650 font-bold">{score}</strong> • Volume: {score > 85 ? 'Excelente' : 'Bom'} • Proximidade: {score > 90 ? 'Extrema' : 'Sede RMC'}
                    </span>
                  </div>

                  <div>
                    {isReleased ? (
                      <span className="text-[9px] font-black uppercase font-mono tracking-widest text-green-700 bg-green-50/50 border border-green-200 px-2.5 py-1 rounded-xl">
                        index, follow
                      </span>
                    ) : (
                      <span className="text-[9px] font-black uppercase font-mono tracking-widest text-yellow-700 bg-yellow-50/50 border border-yellow-250 px-2.5 py-1 rounded-xl">
                        noindex, follow
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
