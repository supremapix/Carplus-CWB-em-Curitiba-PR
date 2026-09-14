import React, { useState } from 'react';
import { Wrench, Gauge, ShieldCheck, CheckCircle2, Phone } from 'lucide-react';

interface OficinaDoPneuSectionProps {
  onNavigateHome: () => void;
}

export default function OficinaDoPneuSection({ onNavigateHome }: OficinaDoPneuSectionProps) {
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);

  const formatWhatsApp = (text: string) => {
    return `https://api.whatsapp.com/send?phone=554130827282&text=${encodeURIComponent(text)}`;
  };
  
  const symptoms = [
    {
      id: 'puxando',
      label: 'Carro puxando para a esquerda/direita',
      diagnostic: 'Divergência ou câmber desequilibrado. Necessita de Alinhamento 3D corretivo.',
      tip: 'Rodar assim gasta rapidamente o flanco interno de um dos pneus.'
    },
    {
      id: 'tremendo',
      label: 'Volante vibrando acima de 80 km/h',
      diagnostic: 'Desbalanceamento das rodas dianteiras ou traseiras. Necessita de Balanceamento Computadorizado.',
      tip: 'Pode danificar os rolamentos e buchas de balança a médio prazo.'
    },
    {
      id: 'estalo',
      label: 'Ruídos ou estalos secos ao esterçar',
      diagnostic: 'Folga em juntas homocinéticas, buchas ou pivô de bandeja. Recomenda-se vistoria física suspensa.',
      tip: 'Item crítico de segurança ativa do veículo!'
    },
    {
      id: 'gasto_torto',
      label: 'Pneu com desgaste irregular ("escamado" ou liso nos cantos)',
      diagnostic: 'Sintoma clássico de suspensão frouxa, pressão incorreta ou geometria desalinhada.',
      tip: 'Inverter os pneus de lado ajuda temporariamente, mas o alinhamento é mandatório.'
    }
  ];

  const matchedSymptom = symptoms.find(s => s.id === selectedSymptom);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in font-sans" id="oficina-do-pneu-section">
      <div className="text-center space-y-3">
        <span className="bg-yellow-500/10 text-yellow-650 font-mono font-black text-[10px] uppercase px-3.5 py-1.5 rounded-full border border-yellow-500/25">
          Centro Especializado Portão
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight uppercase font-mono">
          Oficina do Pneu Curitiba
        </h1>
        <p className="text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
          Revisão completa de montagem, borracharia técnica computadorizada, suspensão, freios, alinhamento 3D e balanceamento com total precisão de fábrica.
        </p>
      </div>

      {/* Banner / Visual */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 sm:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 text-left">
          <span className="font-mono text-yellow-500 uppercase tracking-widest text-xs font-black">Instalação Expressa</span>
          <h2 className="text-xl sm:text-2xl font-black uppercase font-mono">Bicos de Borracha e Montagem de Graça</h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-md font-medium">
            Ao adquirir seus pneus novos na Carplus, nós realizamos a montagem técnica computadorizada e damos as válvulas novas gratuitamente em nossa oficina física na Arthur Bernardes.
          </p>
        </div>
        <img 
          src="/images/galeria/oficina-carros.webp" 
          alt="Oficina Carplus Portão"
          className="w-full md:w-56 h-36 object-cover rounded-2xl border border-white/10"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Bento Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-gray-200 p-5 rounded-2xl space-y-2">
          <div className="w-10 h-10 bg-yellow-500/10 text-yellow-600 rounded-xl flex items-center justify-center font-bold">
            <Wrench className="w-5 h-5" />
          </div>
          <h3 className="font-black text-sm uppercase text-gray-900 font-mono">Troca & Montagem sem Riscos</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Montadoras pneumáticas automáticas com proteção de polímero para não marcar nem arranhar as bordas das suas rodas de liga leve.
          </p>
        </div>

        <div className="bg-white border border-gray-200 p-5 rounded-2xl space-y-2">
          <div className="w-10 h-10 bg-yellow-500/10 text-yellow-600 rounded-xl flex items-center justify-center font-bold">
            <Gauge className="w-5 h-5" />
          </div>
          <h3 className="font-black text-sm uppercase text-gray-900 font-mono">Alinhamento Laser 3D</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Ajuste milimétrico de caster, camber e convergência para evitar desgaste prematuro ou irregular dos pneus novos.
          </p>
        </div>

        <div className="bg-white border border-gray-200 p-5 rounded-2xl space-y-2">
          <div className="w-10 h-10 bg-yellow-500/10 text-yellow-600 rounded-xl flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-black text-sm uppercase text-gray-900 font-mono">Balanceamento Dinâmico</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Equipamentos aferidos periodicamente para zerar qualquer tipo de vibração no volante acima de 60 ou 100 km/h.
          </p>
        </div>
      </div>

      {/* Diagnostic Interactive Tool */}
      <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 text-left">
        <div className="space-y-1">
          <span className="font-mono text-[9px] uppercase font-black tracking-widest text-yellow-600 block">Auto-Diagnóstico Rápido</span>
          <h3 className="text-lg font-black uppercase text-gray-950 font-mono">Está sentindo algum comportamento estranho no veículo?</h3>
          <p className="text-xs text-gray-600">Selecione o sintoma para saber a causa provável e o procedimento preventivo correto:</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {symptoms.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSymptom(s.id === selectedSymptom ? null : s.id)}
              className={`p-4 rounded-2xl border text-left transition duration-200 flex items-start gap-3 cursor-pointer ${
                selectedSymptom === s.id 
                  ? 'bg-yellow-500/10 border-yellow-500 shadow-sm' 
                  : 'bg-white border-gray-200 hover:border-gray-400'
              }`}
            >
              <div className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                selectedSymptom === s.id ? 'border-yellow-600 bg-yellow-500' : 'border-gray-300'
              }`}>
                {selectedSymptom === s.id && <div className="w-1.5 h-1.5 bg-black rounded-full"></div>}
              </div>
              <div>
                <p className="text-xs font-black text-gray-900 uppercase font-mono">{s.label}</p>
              </div>
            </button>
          ))}
        </div>

        {matchedSymptom && (
          <div className="bg-white border border-yellow-500/40 rounded-2xl p-5 space-y-3 shadow-md animate-fade-in">
            <div className="flex items-center gap-2 text-yellow-650 font-mono font-black text-xs uppercase">
              <CheckCircle2 className="w-4 h-4 text-yellow-600" />
              <span>Diagnóstico Recomendado:</span>
            </div>
            <p className="text-sm font-bold text-gray-900">{matchedSymptom.diagnostic}</p>
            <p className="text-xs text-gray-550 italic bg-gray-50 p-2.5 rounded-lg border border-gray-150">
              💡 {matchedSymptom.tip}
            </p>
            <div className="pt-2">
              <a
                href={formatWhatsApp(`Olá Carplus Curitiba! Meu carro está com o comportamento "${matchedSymptom.label}". Gostaria de agendar uma inspeção em seu centro automotivo.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-xs uppercase px-4 py-2.5 rounded-xl transition shadow cursor-pointer"
              >
                Agendar Vistoria desse Sintoma
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Internal Routing Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a 
          href="/alinhamento-3d-curitiba"
          onClick={(e) => {
            e.preventDefault();
            window.history.pushState(null, '', '/alinhamento-3d-curitiba');
            window.dispatchEvent(new PopStateEvent('popstate'));
          }}
          className="bg-white border border-gray-200 hover:border-yellow-500 p-4 rounded-2xl transition space-y-1 block group text-left cursor-pointer shadow-sm"
        >
          <span className="text-[9px] font-black uppercase text-yellow-600 font-mono">Geometria Completa</span>
          <h4 className="font-black text-xs uppercase text-gray-900 group-hover:text-yellow-600 transition">Alinhamento 3D Laser ➔</h4>
          <p className="text-[11px] text-gray-550 leading-relaxed">Tecnologia computadorizada de ponta a ponta para preservar seus pneus.</p>
        </a>

        <a 
          href="/loja-de-pneus-em-curitiba"
          onClick={(e) => {
            e.preventDefault();
            window.history.pushState(null, '', '/loja-de-pneus-em-curitiba');
            window.dispatchEvent(new PopStateEvent('popstate'));
          }}
          className="bg-white border border-gray-200 hover:border-yellow-500 p-4 rounded-2xl transition space-y-1 block group text-left cursor-pointer shadow-sm"
        >
          <span className="text-[9px] font-black uppercase text-yellow-600 font-mono">Estoque Novo</span>
          <h4 className="font-black text-xs uppercase text-gray-900 group-hover:text-yellow-600 transition">Pneus em Curitiba ➔</h4>
          <p className="text-[11px] text-gray-550 leading-relaxed">Conheça nossa linha completa com montagem e bicos grátis no Portão.</p>
        </a>

        <a 
          href="/contato"
          onClick={(e) => {
            e.preventDefault();
            window.history.pushState(null, '', '/contato');
            window.dispatchEvent(new PopStateEvent('popstate'));
          }}
          className="bg-white border border-gray-200 hover:border-yellow-500 p-4 rounded-2xl transition space-y-1 block group text-left cursor-pointer shadow-sm"
        >
          <span className="text-[9px] font-black uppercase text-yellow-600 font-mono">Localização Fácil</span>
          <h4 className="font-black text-xs uppercase text-gray-900 group-hover:text-yellow-600 transition">Como Chegar na Loja ➔</h4>
          <p className="text-[11px] text-gray-550 leading-relaxed">Avenida Presidente Arthur Bernardes, 1323. Ponto nobre e fácil acesso.</p>
        </a>
      </div>

      {/* Action CTA */}
      <div className="bg-gray-50 border border-gray-200 p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-left space-y-1">
          <h4 className="font-black text-sm uppercase font-mono text-gray-950">Precisa de um orçamento sem compromisso?</h4>
          <p className="text-xs text-gray-600">Traga seu veículo para uma inspeção visual gratuita de pneus, freios e suspensão.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onNavigateHome}
            className="border border-gray-300 hover:bg-gray-100 font-extrabold text-xs uppercase px-5 py-3 rounded-xl transition cursor-pointer bg-white"
          >
            Ir para Início
          </button>
          <a 
            href={formatWhatsApp("Olá Carplus Curitiba! Vi a página Oficina do Pneu e gostaria de solicitar um orçamento para alinhamento 3D e balanceamento.")}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-yellow-500 hover:bg-yellow-400 text-gray-950 font-black text-xs uppercase px-6 py-3.5 rounded-xl transition border border-black cursor-pointer inline-flex items-center gap-2"
          >
            <Phone className="w-3.5 h-3.5" />
            Falar via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
