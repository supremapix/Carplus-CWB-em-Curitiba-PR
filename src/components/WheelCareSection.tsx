import React from 'react';
import { formatWhatsApp } from '../utils/whatsapp';

export const WHEEL_CARE_SLUG = 'rodas-de-liga-leve-riscadas-na-troca-de-pneus';
export const WHEEL_CARE_MESSAGE = 'Olá, Carplus! Tenho preocupação com riscos nas minhas rodas de liga leve. Quero conversar sobre os cuidados na troca dos pneus e pedir um orçamento.';

export default function WheelCareSection() {
  return (
    <section aria-labelledby="wheel-care-title" className="rounded-2xl border border-gray-200 bg-white p-5 md:p-8 space-y-5">
      <div className="grid gap-6 md:grid-cols-2 items-center">
        <div className="space-y-4">
          <p className="text-sm font-bold text-red-700">Cuidado com o que é seu</p>
          <h2 id="wheel-care-title" className="text-2xl md:text-3xl font-bold text-gray-950 leading-tight">Já riscaram suas rodas na troca dos pneus?</h2>
          <p className="text-base text-gray-700 leading-relaxed">Você leva o carro para cuidar da segurança e volta preocupado com um risco que não estava ali. A frustração é compreensível. Suas rodas merecem o mesmo cuidado que seus pneus.</p>
          <p className="text-base text-gray-700 leading-relaxed">Na Carplus, traga essa preocupação para a conversa antes do serviço. Conte o que aconteceu, mostre o acabamento das rodas e peça à equipe que explique os cuidados indicados para o seu conjunto.</p>
        </div>
        <figure className="m-0">
          <img src="/images/carplus-real/montagem-tecnica.webp" alt="Profissional manuseando um pneu na oficina Carplus, no Portão." width="1600" height="1068" loading="lazy" decoding="async" className="w-full h-auto rounded-xl" />
          <figcaption className="mt-2 text-xs text-gray-600">Foto real da oficina Carplus, no Portão, em Curitiba.</figcaption>
        </figure>
      </div>
      <h3 className="text-lg font-bold text-gray-950">Três cuidados para combinar antes de autorizar</h3>
      <ol className="grid gap-3 md:grid-cols-3 text-sm text-gray-700 leading-relaxed">
        <li className="rounded-xl bg-gray-50 border border-gray-200 p-4"><strong className="block text-gray-950 mb-2">1. Confira as rodas</strong>Peça uma avaliação visual conjunta e registre marcas já existentes, inclusive nas bordas.</li>
        <li className="rounded-xl bg-gray-50 border border-gray-200 p-4"><strong className="block text-gray-950 mb-2">2. Entenda a montagem</strong>Pergunte sobre ferramentas e proteções adequadas ao acabamento da roda e sobre cuidados com o sensor de pressão, quando houver.</li>
        <li className="rounded-xl bg-gray-50 border border-gray-200 p-4"><strong className="block text-gray-950 mb-2">3. Confira na entrega</strong>Revise o estado das rodas com a equipe e esclareça qualquer diferença antes de sair.</li>
      </ol>
      <p className="text-sm text-gray-600 leading-relaxed">A proteção depende do conjunto, das ferramentas e da execução. Equipamento algum, por si só, representa garantia de risco zero.</p>
      <div className="flex flex-wrap gap-3">
        <a className="carplus-action-primary" href={formatWhatsApp(WHEEL_CARE_MESSAGE)} target="_blank" rel="noopener noreferrer" data-cta-location="troca-pneus-cuidado-rodas">Conversar sobre minhas rodas</a>
        <a className="carplus-action-secondary" href={`/blog/${WHEEL_CARE_SLUG}`}>Ler o guia de cuidados com as rodas</a>
      </div>
    </section>
  );
}
