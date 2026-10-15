import React, { useId, useState } from 'react';
import { ArrowUpRight, BadgeCheck, CarFront, ChevronDown, MessageSquare, Search, Zap } from 'lucide-react';
import { FAQ_ADVICE, TIRE_ADVICE_SCHEMA } from '../data/tireAdvice';
import { formatWhatsApp } from '../utils/whatsapp';

interface TireAdviceSectionProps {
  onFindTire?: () => void;
  onNavigate?: (path: string) => void;
}

type AdviceIntent = 'brand' | 'car' | 'electric';

const INTENTS = [
  { id: 'brand' as const, label: 'Pela marca', description: 'Quero saber se um pneu é uma boa escolha.', Icon: BadgeCheck },
  { id: 'car' as const, label: 'Pelo meu carro', description: 'Quero encontrar uma opção para o meu veículo.', Icon: CarFront },
  { id: 'electric' as const, label: 'Elétrico ou híbrido', description: 'Quero conferir a aplicação para o meu carro.', Icon: Zap },
];

const INTENT_CONTENT: Record<AdviceIntent, { title: string; text: string; brandLabel: string; placeholder: string; message: string }> = {
  brand: {
    title: 'A marca importa. O modelo e a aplicação também.',
    text: 'Prinx, Michelin, Pirelli ou outra marca: vamos comparar as opções pela medida, pelas especificações e pelo seu uso.',
    brandLabel: 'Marca do pneu',
    placeholder: 'Ex.: Prinx',
    message: 'Quero saber se uma marca e um modelo de pneu são uma boa escolha para o meu carro.',
  },
  car: {
    title: 'Vamos começar pelo carro que você dirige.',
    text: 'Conte o modelo, a versão e o ano que souber. A equipe ajuda a conferir a medida e a comparar as opções para a sua rotina.',
    brandLabel: 'Marca do veículo',
    placeholder: 'Ex.: Chevrolet',
    message: 'Quero ajuda para escolher um pneu para o meu carro e conferir a medida recomendada.',
  },
  electric: {
    title: 'Seu elétrico ou híbrido merece a aplicação certa.',
    text: 'Vamos conferir a recomendação do fabricante, os índices do pneu e as opções que fazem sentido para o seu veículo.',
    brandLabel: 'Marca do veículo',
    placeholder: 'Ex.: BYD',
    message: 'Quero ajuda para escolher pneus para o meu carro elétrico ou híbrido e confirmar a aplicação.',
  },
};

export default function TireAdviceSection({ onFindTire, onNavigate }: TireAdviceSectionProps) {
  const instanceId = useId();
  const [intent, setIntent] = useState<AdviceIntent>('brand');
  const [tireBrand, setTireBrand] = useState('');
  const [vehicleBrand, setVehicleBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const content = INTENT_CONTENT[intent];
  const brand = intent === 'brand' ? tireBrand : vehicleBrand;
  const message = [
    'Olá, Carplus! Quero tirar uma dúvida sobre pneus.',
    content.message,
    brand.trim() ? `${content.brandLabel}: ${brand.trim()}.` : '',
    model.trim() ? `Modelo e versão do carro: ${model.trim()}.` : '',
    year.trim() ? `Ano do carro: ${year.trim()}.` : '',
  ].filter(Boolean).join('\n');
  const inputClassName = 'mt-2 min-h-[52px] w-full rounded-xl border border-white/20 bg-[#080808] px-4 py-3 text-[16px] text-white placeholder:text-zinc-500 focus:border-[#f59c00] focus:outline-none focus:ring-2 focus:ring-[#f59c00]/30';

  return (
    <section id="guia-escolha" className="carplus-advice scroll-mt-28 border-y border-white/10 bg-[#080808] py-16 text-white sm:py-20" aria-labelledby={`${instanceId}-heading`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(TIRE_ADVICE_SCHEMA).replace(/</g, '\\u003c') }} />
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.16em] text-[#f59c00]">Escolha com orientação</p>
          <h2 id={`${instanceId}-heading`} className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">Qual pneu faz sentido para você?</h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-300 sm:text-lg">Comece pela sua dúvida. A Carplus ajuda a conferir as especificações e encontrar uma opção para o seu carro.</p>
        </div>

        <div className="grid gap-3 md:grid-cols-3" role="group" aria-label="Por onde você quer começar?">
          {INTENTS.map(({ id, label, description, Icon }) => (
            <button
              key={id}
              type="button"
              aria-pressed={intent === id}
              aria-controls={`${instanceId}-advice-fields`}
              onClick={() => setIntent(id)}
              className={`flex min-h-[132px] cursor-pointer items-start gap-4 rounded-2xl border p-5 text-left transition-colors ${intent === id ? 'border-[#f59c00] bg-[#f59c00]/10' : 'border-white/15 bg-white/[0.03] hover:border-white/40'}`}
            >
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${intent === id ? 'bg-[#f59c00] text-[#080808]' : 'bg-white/10 text-white'}`}><Icon aria-hidden="true" className="h-6 w-6" /></span>
              <span><span className="block text-[18px] font-bold">{label}</span><span className="mt-1.5 block text-[14px] leading-relaxed text-zinc-300">{description}</span></span>
            </button>
          ))}
        </div>

        <div id={`${instanceId}-advice-fields`} className="mt-5 grid gap-7 rounded-2xl border border-white/15 bg-[#111111] p-5 sm:p-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          <div>
            <h3 className="font-display text-2xl font-bold leading-snug">{content.title}</h3>
            <p className="mt-4 text-[16px] leading-relaxed text-zinc-300">{content.text}</p>
            <p className="mt-5 border-l-2 border-[#f59c00] pl-4 text-[14px] leading-relaxed text-zinc-400">Para confirmar a aplicação, vale ter o manual ou a etiqueta do veículo e a medida da lateral do pneu em mãos.</p>
          </div>

          <div>
            <fieldset aria-describedby={`${instanceId}-optional-help`}>
              <legend className="text-[17px] font-semibold">Conte o que você já sabe</legend>
              <p id={`${instanceId}-optional-help`} className="mt-1 text-[14px] leading-relaxed text-zinc-400">Todos os campos são opcionais. Você pode falar com a equipe agora.</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label htmlFor={`${instanceId}-brand`} className="text-[14px] font-medium text-zinc-200">{content.brandLabel} <span className="font-normal text-zinc-500">(opcional)</span>
                  <input id={`${instanceId}-brand`} name={intent === 'brand' ? 'tireBrand' : 'vehicleBrand'} type="text" maxLength={80} autoComplete="off" value={brand} onChange={(e) => intent === 'brand' ? setTireBrand(e.target.value) : setVehicleBrand(e.target.value)} placeholder={content.placeholder} className={inputClassName} />
                </label>
                <label htmlFor={`${instanceId}-year`} className="text-[14px] font-medium text-zinc-200">Ano do carro <span className="font-normal text-zinc-500">(opcional)</span>
                  <input id={`${instanceId}-year`} name="vehicleYear" type="text" inputMode="numeric" maxLength={9} autoComplete="off" value={year} onChange={(e) => setYear(e.target.value)} placeholder="Ex.: 2024" className={inputClassName} />
                </label>
                <label htmlFor={`${instanceId}-model`} className="text-[14px] font-medium text-zinc-200 sm:col-span-2">Modelo e versão do carro <span className="font-normal text-zinc-500">(opcional)</span>
                  <input id={`${instanceId}-model`} name="vehicleModel" type="text" maxLength={120} autoComplete="off" value={model} onChange={(e) => setModel(e.target.value)} placeholder="Ex.: Corolla XEi ou Dolphin Plus" className={inputClassName} />
                </label>
              </div>
            </fieldset>

            <a href={formatWhatsApp(message)} target="_blank" rel="noopener noreferrer" data-cta-location="guia-escolha" data-analytics-url="https://api.whatsapp.com/send?phone=554130827282" className="mt-5 flex min-h-[58px] w-full items-center justify-center gap-3 rounded-xl bg-[#f59c00] px-4 py-4 text-center text-[16px] font-bold leading-snug text-[#080808] transition-opacity hover:opacity-90">
              <MessageSquare aria-hidden="true" className="h-5 w-5 shrink-0" />
              <span>Tirar minha dúvida no WhatsApp</span>
              <ArrowUpRight aria-hidden="true" className="h-5 w-5 shrink-0" />
            </a>
            <p className="mt-3 text-[12px] leading-relaxed text-zinc-500">O WhatsApp abre com a mensagem preenchida para você revisar e enviar.</p>
            {onFindTire ? (
              <button type="button" onClick={onFindTire} className="mt-3 flex min-h-[44px] cursor-pointer items-center gap-2 text-[14px] font-medium text-zinc-300 underline underline-offset-4 hover:text-[#f59c00]"><Search aria-hidden="true" className="h-4 w-4" />Já sei a medida e quero buscar pneus</button>
            ) : onNavigate ? (
              <button type="button" onClick={() => onNavigate('/pneus')} className="mt-3 flex min-h-[44px] cursor-pointer items-center gap-2 text-[14px] font-medium text-zinc-300 underline underline-offset-4 hover:text-[#f59c00]"><Search aria-hidden="true" className="h-4 w-4" />Ver o catálogo de pneus</button>
            ) : null}
          </div>
        </div>

        <nav className="carplus-guide-links" aria-label="Guias para pneus BYD">
          <a href="/pneus-byd-curitiba">Pneus para BYD</a>
          <a href="/pneu-byd-dolphin-curitiba">Guia do Dolphin</a>
          <a href="/pneu-byd-dolphin-mini-curitiba">Guia do Dolphin Mini</a>
        </nav>
        <div className="mt-12 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          <div><h3 className="font-display text-2xl font-bold">Respostas para começar a escolha</h3><p className="mt-3 text-[16px] leading-relaxed text-zinc-400">Informações claras para conversar com a equipe e comparar as opções com mais segurança.</p></div>
          <div className="divide-y divide-white/10 border-y border-white/10">
            {FAQ_ADVICE.map(({ question, answer }, index) => (
              <div key={question}>
                <h4>
                  <button id={`${instanceId}-faq-${index}`} type="button" aria-expanded={openFaq === index} aria-controls={`${instanceId}-answer-${index}`} onClick={() => setOpenFaq(openFaq === index ? null : index)} className="flex min-h-[68px] w-full cursor-pointer items-center justify-between gap-4 py-5 text-left text-[16px] font-semibold leading-relaxed hover:text-[#f59c00]">
                    <span>{question}</span><ChevronDown aria-hidden="true" className={`h-5 w-5 shrink-0 text-[#f59c00] transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                  </button>
                </h4>
                <div id={`${instanceId}-answer-${index}`} role="region" aria-labelledby={`${instanceId}-faq-${index}`} hidden={openFaq !== index} className="pb-5 pr-8 text-[15px] leading-relaxed text-zinc-300">{answer}</div>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-7 text-[12px] leading-relaxed text-zinc-400">Orientações dos fabricantes: <a href="https://www.michelin.com.br/auto/sizes" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">como conferir a medida</a> e <a href="https://www.continental-tires.com/pt/pt/products/car/discover/by-vehicle-type/electric/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">escolha para veículos elétricos</a>.</p>
      </div>
    </section>
  );
}
