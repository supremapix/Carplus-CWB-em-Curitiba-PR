import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck,
  Lightbulb,
  Fuel,
  Shield,
  Ruler,
  Handshake,
  Car,
  ArrowRight,
  CheckCircle2,
  Wrench,
  Gauge,
  Disc
} from 'lucide-react';

const VIDEOS = [
  {
    id: "TL490QZpGlc",
    tag: "NOVIDADE EXCLUSIVA",
    title: "Agora a Carplus Compra e Vende Veículos com Procedência!",
    desc: "Grande novidade na Carplus de Curitiba! Além de sermos o seu autocenter de confiança para pneus e serviços mecânicos, agora expandimos para a compra e venda de veículos seminovos. Oferecemos um estoque selecionado com rigor absoluto, garantindo procedência indiscutível e vistoria cautelar 100% aprovada.",
    link: "https://www.carplusautos.com.br/",
    linkLabel: "Conhecer Estoque de Veículos",
    highlights: [
      { icon: ShieldCheck, title: "Procedência Garantida", desc: "Carros checados contra leilões ou sinistros" },
      { icon: Wrench, title: "Vistoria Cautelar 100%", desc: "Saúde mecânica e estrutural certificada" },
      { icon: Gauge, title: "Negociação Transparente", desc: "Avaliação justa e honesta na loja" }
    ]
  },
  {
    id: "v72kI13VyAU",
    tag: "PROVA REAL DA LOJA",
    title: "Sua Segurança em Primeiro Lugar: Veja Nossa Troca de Pneus de Alta Performance",
    desc: "Acompanhe de perto a precisão cirúrgica de nossos profissionais na troca e alinhamento de pneus novos de alta durabilidade. Transparência operacional completa de quem é referência em Curitiba!",
    highlights: [
      { icon: Wrench, title: "Fixação Pneumática", desc: "Desmontadoras anti-risco de rodas" },
      { icon: ShieldCheck, title: "Válvulas Novas", desc: "Substituição preventiva de bicos" },
      { icon: Gauge, title: "Check-up Grátis", desc: "Inspeção visual de freios e suspensão" }
    ]
  },
  {
    id: "1fWqUJdCdRg",
    tag: "TECNOLOGIA RIGOROSA",
    title: "Balanceamento Computadorizado a Laser para Rodar sem Nenhuma Vibração",
    desc: "Sinta o conforto absoluto de uma rodagem perfeitamente lisa sob asfalto irregular. Assista como nossa tecnologia a laser corrige micro-oscilações para economizar combustível do seu carro!",
    highlights: [
      { icon: Disc, title: "Laser 3D de Precisão", desc: "Mapeamento milimétrico da roda" },
      { icon: ShieldCheck, title: "Sem Vibrações", desc: "Conforto e segurança em alta velocidade" },
      { icon: Fuel, title: "Economia de Combustível", desc: "Menor atrito e desgaste regular" }
    ]
  },
  {
    id: "4FpPSM5vYE8",
    tag: "NOSSO SHOWROOM",
    title: "Megaestrutura Carplus no Portão Curitiba: Sua Experiência Conforto VIP",
    desc: "Mais de 800m² dedicados à saúde do seu veículo. Visite nossos boxes de atendimento rápido, desfrute de nossa sala de espera climatizada e experimente o padrão de atendimento premium.",
    highlights: [
      { icon: Wrench, title: "10+ Boxes Ativos", desc: "Atendimento simultâneo sem demora" },
      { icon: ShieldCheck, title: "Espera VIP Climatizada", desc: "Café espresso, Wi-Fi e vista da oficina" },
      { icon: Gauge, title: "Acesso Rápido no Portão", desc: "Pátio amplo na Arthur Bernardes, 1323" }
    ]
  }
];

const SECRET_ACCORDIONS = [
  {
    icon: Lightbulb,
    title: "O Segredo dos Pneuzinhos Novos: Por que Trocar a Válvula (Bico) é 100% Obrigatório?",
    content: "O bico de borracha comum segura dezenas de libras de pressão e resseca continuamente com o calor severo e a força centrífuga das ruas. Bicos velhos sofrem microfissuras que geram perda imperceptível e diária de pressão. Para protegê-lo, na Carplus Pneus você não corre riscos: no agendamento físico, a substituição por válvulas novas de alta vedação é realizada com total rigor técnico!"
  },
  {
    icon: Fuel,
    title: "Rodar com Pneu Murcho? Calibragem Inteligente Reduz Consumo de Gasolina em até 12%",
    content: "Pneus abaixo da pressão ideal deformam a banda de rodagem e criam uma enorme resistência física contra o asfalto. Isso força o motor a gastar mais força e combustível desnecessário. Garantir a calibragem semanal pela manhã fria (conforme os níveis exatos de 30 a 34 PSI descritos na tampa do tanque do seu modelo) prolonga o ciclo de vida da borracha em até 15.000 km extras."
  },
  {
    icon: Shield,
    title: "O Mapeamento do INMETRO: Como Decifrar o Selo e Evitar Derrapagens em Dias de Chuva Curitibana?",
    content: "Cada pneu homologado pelo INMETRO carrega classificações cruciais. A aderência em piso molhado (escala de A a G) define quanto o pneu drena e adere. Escolher marcas classificadas de alta aderência comercializadas na Carplus reduz a distância de frenagem de emergência em até 15 metros em asfalto encharcado, protegendo quem você mais ama."
  },
  {
    icon: Ruler,
    title: "Alinhamento Geométrico 3D: impeça o Desgaste Prematuro e Lateral dos Ombros da Borracha",
    content: "Lombadas duras e buracos ocultos desalinham a cambagem e a convergência geométrica da suspensão. Quando isso ocorre, o carro arrasta o pneu de lado, desgastando desigualmente os chamados 'ombros' laterais em poucos meses. Nosso moderno Alinhamento Digital 3D de alta definição mapeia o chassi com exatidão milimétrica para que a banda apoie de forma plana e duradoura."
  },
  {
    icon: Handshake,
    title: "Sem Pegadinhas: Garantia de 5 Anos de Fábrica sem Burocracia na Nossa Recepção",
    content: "Nenhum de nossos pneus novos possui lotes antigos ou recondicionados (venda exclusiva com selo original e NF). Todos possuem 5 anos de garantia oficial estendida de fábrica contra defeitos estruturais e bolhas de moldagem. Se necessitar de perícia técnica, nós cuidamos de toda a validação rápida conosco na loja física Portão, sem formulários cansativos ou demoras."
  }
];

export default function CarplusVideosSection() {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAccordionIndex, setActiveAccordionIndex] = useState<number | null>(null);

  const handleNextVideo = () => {
    setActiveVideoIndex((prev) => (prev + 1) % VIDEOS.length);
    setIsPlaying(false);
  };

  const handlePrevVideo = () => {
    setActiveVideoIndex((prev) => (prev - 1 + VIDEOS.length) % VIDEOS.length);
    setIsPlaying(false);
  };

  const toggleAccordion = (idx: number) => {
    setActiveAccordionIndex((prev) => (prev === idx ? null : idx));
  };

  const activeVideo = VIDEOS[activeVideoIndex];
  const activeThumbnailUrl = `https://img.youtube.com/vi/${activeVideo.id}/hqdefault.jpg`;
  const activeWatchUrl = `https://www.youtube.com/shorts/${activeVideo.id}`;

  return (
    <div className="space-y-16 my-12 select-none w-full max-w-full overflow-hidden" id="carplus-videos-and-accordions">
      
      {/* 1. SEÇÃO DE VÍDEO OFICINA (Largura total mobile, moldura box oficina, play 72px) */}
      <div className="bg-[#18181b] border-2 border-zinc-800 rounded-3xl p-5 sm:p-8 text-white relative shadow-2xl overflow-hidden" id="box-video-section">
        
        {/* Faixa superior zebrada de oficina */}
        <div 
          className="h-2 w-full absolute top-0 left-0 border-b border-[#F5A623]/60"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #F5A623 0, #F5A623 10px, #000 10px, #000 20px)'
          }}
        />

        {/* Cabeçalho centralizado */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-8 pt-2">
          <div className="inline-flex items-center gap-1.5 bg-zinc-900 border border-[#F5A623]/50 text-[#F5A623] font-mono font-black text-xs uppercase tracking-widest px-4 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transparência Operacional • Portão Curitiba</span>
          </div>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-white tracking-tight leading-snug">
            Veja a Carplus em <span className="text-[#F5A623]">Ação na Prática</span>
          </h3>
          <p className="text-zinc-300 text-[18px] leading-relaxed max-w-[65ch] mx-auto">
            Acompanhe nossa equipe técnica em vídeo: estrutura dos boxes, maquinário anti-risco e como cuidamos do seu carro no Portão.
          </p>
        </div>

        {/* Painel do Vídeo Estilo Tela / Painel de Box de Oficina */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-zinc-950 border-4 border-zinc-800 rounded-2xl p-2 sm:p-4 shadow-2xl relative">
            
            {/* Top Bar do Painel de Oficina com parafusos e badge */}
            <div className="flex items-center justify-between pb-3 px-2 border-b border-zinc-800 text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F5A623] inline-block animate-pulse" />
                <span className="font-bold text-white uppercase tracking-wider">{activeVideo.tag}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>VÍDEO {activeVideoIndex + 1}/{VIDEOS.length}</span>
              </div>
            </div>

            {/* Tela do Vídeo (Largura total mobile) */}
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black mt-3">
              <AnimatePresence mode="wait">
                {isPlaying ? (
                  <motion.div
                    key={`player-${activeVideo.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <iframe
                      src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1&mute=0&rel=0&modestbranding=1&playsinline=1`}
                      title={activeVideo.title}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key={`thumb-${activeVideo.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsPlaying(true)}
                    className="absolute inset-0 w-full h-full cursor-pointer group"
                  >
                    {/* Poster atraente com gradiente */}
                    <img
                      src={activeThumbnailUrl}
                      alt={activeVideo.title}
                      className="absolute inset-0 w-full h-full object-cover filter brightness-[0.7] group-hover:brightness-[0.85] group-hover:scale-105 transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/30" />

                    {/* Botão Play Grande (72px) Laranja com Pulso */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-20">
                      <button
                        type="button"
                        aria-label="Reproduzir vídeo"
                        className="w-[72px] h-[72px] rounded-full bg-[#F5A623] hover:bg-amber-400 text-black flex items-center justify-center shadow-2xl transition-transform duration-300 transform group-hover:scale-110 cursor-pointer border-4 border-black/30 shrink-0"
                      >
                        <Play className="w-8 h-8 fill-current translate-x-0.5" />
                      </button>
                      <span className="text-xs sm:text-sm font-bold text-white bg-black/70 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-white/20 shadow-md max-w-[90%] text-center">
                        Assistir Demonstração (Toque para Iniciar)
                      </span>
                    </div>

                    {/* Título sobre o rodapé do vídeo */}
                    <div className="absolute bottom-3 left-3 right-3 z-20 text-center sm:text-left">
                      <p className="text-sm sm:text-base font-bold text-white leading-snug line-clamp-2 drop-shadow-md break-words [overflow-wrap:anywhere]">
                        {activeVideo.title}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Controles de Navegação entre Vídeos */}
            <div className="flex items-center justify-between pt-4 px-1 sm:px-2 gap-2">
              <button
                onClick={handlePrevVideo}
                className="h-10 px-2.5 sm:px-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg flex items-center gap-1 sm:gap-1.5 text-xs font-bold transition cursor-pointer border border-zinc-700 shrink-0"
              >
                <ChevronLeft className="w-4 h-4 shrink-0" />
                <span><span className="hidden sm:inline">Vídeo </span>Anterior</span>
              </button>

              {/* Bolinhas indicadoras */}
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-hidden">
                {VIDEOS.map((_, dotIdx) => (
                  <button
                    key={`video-dot-${dotIdx}`}
                    onClick={() => {
                      setActiveVideoIndex(dotIdx);
                      setIsPlaying(false);
                    }}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      dotIdx === activeVideoIndex ? 'w-6 sm:w-8 bg-[#F5A623]' : 'w-2 sm:w-2.5 bg-zinc-700 hover:bg-zinc-500'
                    }`}
                    aria-label={`Ir para vídeo ${dotIdx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNextVideo}
                className="h-10 px-2.5 sm:px-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg flex items-center gap-1 sm:gap-1.5 text-xs font-bold transition cursor-pointer border border-zinc-700 shrink-0"
              >
                <span>Próximo<span className="hidden sm:inline"> Vídeo</span></span>
                <ChevronRight className="w-4 h-4 shrink-0" />
              </button>
            </div>

          </div>

          {/* 3 Destaques Curtos com Ícones Abaixo do Vídeo */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
            {activeVideo.highlights?.map((hl, hIdx) => {
              const IconComp = hl.icon;
              return (
                <div 
                  key={`hl-${hIdx}`}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center gap-3.5 text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 text-[#F5A623]">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase">{hl.title}</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">{hl.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* 2. ACORDEONS DE CURIOSIDADES & SEGREDOS (Ícone pneu/ferramenta, roda que gira, borda laranja) */}
      <div className="bg-white border-2 border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm text-zinc-900" id="secrets-tires-accordion">
        
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="bg-[#F5A623]/15 text-zinc-950 border border-[#F5A623]/30 font-mono font-black text-xs uppercase tracking-widest px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#F5A623]" />
            Guia de Oficina para Condutores
          </span>
          <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-900 pt-1 leading-snug">
            Curiosidades & Segredos da Oficina: <span className="text-[#F5A623]">O que você precisa saber</span>
          </h3>
          <p className="text-[18px] text-zinc-600 max-w-[65ch] mx-auto leading-relaxed">
            Dicas práticas de mecânica e pneus para evitar desgastes prematuros e rodar seguro nas ruas de Curitiba.
          </p>
        </div>

        {/* 5 Acordeons com padrão de oficina */}
        <div className="space-y-3 max-w-4xl mx-auto" id="accordion-blocks-wrapper">
          {SECRET_ACCORDIONS.map((acc, idx) => {
            const isOpen = activeAccordionIndex === idx;
            const AccIcon = acc.icon;

            return (
              <div 
                key={`acc-curiosity-${idx}`}
                className={`border rounded-xl transition-all duration-300 overflow-hidden ${
                  isOpen 
                    ? 'border-zinc-300 border-l-4 border-l-[#F5A623] bg-amber-50/20 shadow-sm' 
                    : 'border-zinc-200 bg-white hover:border-zinc-300'
                }`}
              >
                {/* Header click com área de toque mínima 56px e texto 18px */}
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full min-h-[56px] px-4 sm:px-5 py-3.5 sm:py-4 flex items-center justify-between text-left gap-3 sm:gap-4 font-bold text-[17px] sm:text-[18px] text-zinc-900 transition font-sans cursor-pointer focus:outline-hidden"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <AccIcon className={`w-5 h-5 sm:w-6 sm:h-6 shrink-0 ${isOpen ? 'text-[#F5A623]' : 'text-zinc-500'}`} />
                    <span className={`${isOpen ? 'text-[#F5A623]' : 'text-zinc-900'} leading-snug font-bold break-words [overflow-wrap:anywhere] min-w-0`}>
                      {acc.title}
                    </span>
                  </div>

                  {/* Indicador de abrir em forma de pequena roda que gira ao abrir */}
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

                {/* Conteúdo com transição suave */}
                <div 
                  className="transition-all duration-300 ease-in-out overflow-hidden"
                  style={{
                    maxHeight: isOpen ? '700px' : '0px',
                    opacity: isOpen ? 1 : 0
                  }}
                >
                  <div className="px-4 sm:px-5 pb-5 pt-2 text-[17px] sm:text-[18px] text-zinc-700 leading-relaxed border-t border-zinc-100 bg-zinc-50/50 break-words [overflow-wrap:anywhere]">
                    {acc.content}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
