import React, { useState } from 'react';
import { ShieldCheck, Wrench, Navigation, CheckCircle2, ChevronDown, ChevronUp, ArrowRight, Disc, Gauge, MapPin } from 'lucide-react';

interface AutoCenterSectionProps {
  onNavigateToPage?: (path: string) => void;
}

export default function AutoCenterSection({ onNavigateToPage }: AutoCenterSectionProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const localAnswers = [
    {
      q: "Onde comprar pneus em Curitiba?",
      a: "Na Carplus Pneus, situada na Av. Presidente Arthur da Silva Bernardes, 1323, no Portão em Curitiba. Dispomos de amplo estoque com mais de 1.900 opções de pneus novos para aros 13 a 23 das principais fabricantes mundiais (Bridgestone, Pirelli, Michelin, Goodyear, Continental, Firestone, Delinte, Xbri e Linglong), com pronta entrega e agendamento prático.",
      actionLabel: "Ver Catálogo de Pneus",
      actionPath: "/pneus"
    },
    {
      q: "Onde trocar pneus em Curitiba?",
      a: "No auto center da Carplus no Portão. A troca é feita com desmontadoras pneumáticas anti-risco que protegem rodas de liga leve ou ferro, incluindo bicos de borracha novos e montagem técnica de cortesia na compra dos pneus novos.",
      actionLabel: "Página de Troca de Pneus",
      actionPath: "/troca-de-pneus-curitiba"
    },
    {
      q: "Onde encontrar auto center com pneus em Curitiba?",
      a: "A Carplus integra no mesmo endereço loja completa de pneus novos e centro automotivo com mecânica expressa. Você escolhe a medida ideal do seu carro e já realiza a instalação, balanceamento dinâmico e geometria no mesmo local.",
      actionLabel: "Conhecer o Auto Center",
      actionPath: "/auto-center-curitiba"
    },
    {
      q: "Qual centro automotivo no Portão?",
      a: "A Carplus Pneus e Oficina Mecânica atende no bairro Portão (Av. Arthur Bernardes, 1323), com acesso facilitado para motoristas do Água Verde, Vila Izabel, Batel, Santa Quitéria, Fazendinha, Capão Raso e Novo Mundo.",
      actionLabel: "Centro Automotivo no Portão",
      actionPath: "/centro-automotivo-portao"
    },
    {
      q: "Onde fazer alinhamento e balanceamento?",
      a: "Na rampa de Alinhamento 3D Computadorizado da Carplus no Portão. Nossos sensores tridimensionais de alta definição medem convergência, cambagem e cáster com rigor milimétrico, eliminando puxões no volante e desgaste irregular.",
      actionLabel: "Serviço de Alinhamento 3D",
      actionPath: "/alinhamento-3d-curitiba"
    },
    {
      q: "Onde comprar e instalar pneus no mesmo local?",
      a: "Na Carplus Pneus no Portão. O cliente adquire seus pneus novos e realiza toda a montagem, substituição de válvulas, balanceamento e alinhamento 3D em um único local, sem necessidade de deslocamentos para oficinas ou borracharias secundárias.",
      actionLabel: "Loja e Oficina Integrada",
      actionPath: "/loja-de-pneus-em-curitiba"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 mt-12 select-none" id="auto-center-curitiba">
      <div className="bg-white border-2 border-black p-6 sm:p-8">
        
        {/* Header Block */}
        <div className="border-b-2 border-black pb-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="bg-[#f49e1a] text-black font-mono font-black text-[11px] uppercase tracking-wider px-3 py-1 border border-black inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              Portão · Curitiba-PR
            </span>
            <span className="bg-black text-white font-mono font-bold text-[11px] uppercase tracking-wider px-3 py-1">
              Av. Pres. Arthur Bernardes, 1323
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-black tracking-tight font-display">
            Auto Center e Centro Automotivo em Curitiba
          </h2>

          <p className="text-gray-800 text-sm sm:text-base font-medium mt-3 max-w-4xl leading-relaxed">
            A <strong>Carplus Pneus</strong> é loja de pneus, autocenter e centro automotivo no Portão, Curitiba, com pneus novos multimarcas, montagem especializada e serviços automotivos completos para veículos de passeio, SUVs, utilitários e caminhonetes.
          </p>
        </div>

        {/* 4 Core Pillars of Service */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-8">
          <div className="border-2 border-black p-5 bg-neutral-50 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-black text-[#f49e1a] border border-black flex items-center justify-center mb-3">
                <Disc className="w-5 h-5" />
              </div>
              <h3 className="font-black text-sm uppercase text-black">Loja de Pneus Novos</h3>
              <p className="text-xs text-gray-700 mt-2 leading-relaxed">
                Catálogo de Aros 13 a 23 com pronta entrega e encomenda rápida. Pneus homologados pelo INMETRO com 5 anos de garantia das maiores fabricantes mundiais.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-200">
              <span className="text-[11px] font-mono font-bold text-gray-900">+1.900 opções disponíveis</span>
            </div>
          </div>

          <div className="border-2 border-black p-5 bg-neutral-50 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-[#f49e1a] text-black border border-black flex items-center justify-center mb-3">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-black text-sm uppercase text-black">Montagem & Válvulas</h3>
              <p className="text-xs text-gray-700 mt-2 leading-relaxed">
                Montagem técnica de cortesia na compra dos pneus com maquinário pneumático que preserva as rodas, com bicos de borracha novos substituídos.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-200">
              <span className="text-[11px] font-mono font-bold text-gray-900">Instalação sem taxa extra</span>
            </div>
          </div>

          <div className="border-2 border-black p-5 bg-neutral-50 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-black text-[#f49e1a] border border-black flex items-center justify-center mb-3">
                <Gauge className="w-5 h-5" />
              </div>
              <h3 className="font-black text-sm uppercase text-black">Alinhamento 3D & Balanço</h3>
              <p className="text-xs text-gray-700 mt-2 leading-relaxed">
                Rampa de geometria tridimensional computadorizada para conferência precisa de cambagem, cáster e convergência, além de balanceamento dinâmico.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-200">
              <span className="text-[11px] font-mono font-bold text-gray-900">Geometria tridimensional</span>
            </div>
          </div>

          <div className="border-2 border-black p-5 bg-neutral-50 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-[#f49e1a] text-black border border-black flex items-center justify-center mb-3">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="font-black text-sm uppercase text-black">Mecânica Preventiva</h3>
              <p className="text-xs text-gray-700 mt-2 leading-relaxed">
                Oficina especializada em suspensão (amortecedores, molas, buchas, pivôs), sistema de freios (pastilhas e discos) e troca de óleo para sua total segurança.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-200">
              <span className="text-[11px] font-mono font-bold text-gray-900">Revisão e manutenção</span>
            </div>
          </div>
        </div>

        {/* Short Answers block to semantic queries */}
        <div className="mt-8 border-t-2 border-black pt-6">
          <div className="mb-4">
            <span className="text-[11px] font-mono font-black uppercase text-black bg-[#f49e1a] px-2.5 py-1 border border-black">
              Perguntas e Respostas Rápidas
            </span>
            <h3 className="text-lg sm:text-xl font-black uppercase text-black mt-2">
              Dúvidas Frequentes sobre Compra, Troca e Auto Center em Curitiba
            </h3>
          </div>

          <div className="space-y-2.5">
            {localAnswers.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="border-2 border-black bg-white">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left font-black text-xs sm:text-sm uppercase text-black hover:bg-neutral-50 transition cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#f49e1a] border border-black shrink-0" />
                      {item.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-black shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-black shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 border-t border-gray-200 text-xs text-gray-800 leading-relaxed">
                      <p>{item.a}</p>
                      {onNavigateToPage && item.actionPath && (
                        <div className="mt-3">
                          <button
                            onClick={() => onNavigateToPage(item.actionPath)}
                            className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-black hover:text-[#f49e1a] transition underline cursor-pointer"
                          >
                            <span>{item.actionLabel}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Direct Cluster Linking Bar */}
        <div className="mt-8 pt-6 border-t-2 border-black flex flex-wrap items-center justify-between gap-3 bg-neutral-50 p-4 border border-black">
          <div className="text-xs text-gray-900 font-bold">
            <span className="font-black uppercase text-black block sm:inline mr-2">Páginas Especializadas:</span>
            Pneus + Auto Center + Oficina Mecânica no Portão
          </div>
          <div className="flex flex-wrap gap-2">
            {onNavigateToPage && (
              <>
                <button
                  onClick={() => onNavigateToPage('/auto-center-curitiba')}
                  className="bg-black hover:bg-[#f49e1a] text-white hover:text-black border border-black text-xs font-black px-3 py-1.5 uppercase transition cursor-pointer"
                >
                  Auto Center Curitiba
                </button>
                <button
                  onClick={() => onNavigateToPage('/troca-de-pneus-curitiba')}
                  className="bg-white hover:bg-[#f49e1a] text-black border border-black text-xs font-black px-3 py-1.5 uppercase transition cursor-pointer"
                >
                  Troca de Pneus
                </button>
                <button
                  onClick={() => onNavigateToPage('/centro-automotivo-portao')}
                  className="bg-white hover:bg-[#f49e1a] text-black border border-black text-xs font-black px-3 py-1.5 uppercase transition cursor-pointer"
                >
                  Centro Automotivo Portão
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
