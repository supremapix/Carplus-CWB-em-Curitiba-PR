import React from 'react';
import { CARPLUS_DIRECTIONS_URL, CARPLUS_STORE_ADDRESS, getRouteInstructions } from '../seo-data';

interface LocalAreaGuideProps {
  name: string;
  type: string;
}

/** A visit guide for the single Portão store, not a claim of a branch in each area. */
export default function LocalAreaGuide({ name, type }: LocalAreaGuideProps) {
  const directions = getRouteInstructions(name, type);
  const message = `Olá, Carplus! Estou em ${name} e quero consultar pneus e atendimento na loja do Portão. Meu veículo é: `;
  const whatsapp = `https://wa.me/554130827282?text=${encodeURIComponent(message)}`;
  const arrivalAdvice = (type === 'rmc' || type === 'cidade')
    ? 'Antes de sair de outro município, confirme a disponibilidade da medida, o serviço solicitado e o horário de atendimento. No mapa, use seu endereço de origem, não apenas o nome da cidade.'
    : type === 'bairro-nao-oficial' || type === 'regiao-popular'
      ? 'Nomes de vilas e regiões podem aparecer de formas diferentes nos mapas. Informe a rua e o número de onde você vai sair para calcular o percurso até a loja.'
      : 'Mesmo dentro de um bairro, o percurso muda conforme a rua de saída. Confira a rota a partir do seu endereço e confirme o atendimento antes de se deslocar.';

  return (
    <section aria-labelledby="local-visit-guide" className="mt-10 space-y-6 rounded-3xl border border-gray-200 bg-white p-5 text-gray-900 sm:p-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-gray-600">Planeje sua visita</p>
        <h1 id="local-visit-guide" className="mt-2 text-2xl font-bold sm:text-3xl">Está em {name}? O atendimento é no Portão.</h1>
        <p className="mt-3 leading-relaxed text-gray-700">A Carplus tem uma única loja física neste atendimento: no Portão, em Curitiba. Esta página orienta quem vem de {name}; não representa uma filial nessa localidade.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-gray-50 p-5">
          <h3 className="text-xl font-bold">Como chegar à loja</h3>
          <address className="mt-3 not-italic font-semibold">{CARPLUS_STORE_ADDRESS}</address>
          <p className="mt-3 leading-relaxed text-gray-700">{directions.route}</p>
          <p className="mt-3 leading-relaxed text-gray-700">{arrivalAdvice}</p>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">Distâncias e tempos dependem da origem, do trajeto e do trânsito. Consulte a rota atual no aplicativo.</p>
          <a href={CARPLUS_DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-yellow-400 px-5 py-3 font-bold text-gray-900">Calcular minha rota no Google Maps</a>
        </div>

        <div className="rounded-2xl border border-gray-200 p-5">
          <h3 className="text-xl font-bold">O que confirmar antes de sair</h3>
          <ul className="mt-3 list-disc space-y-3 pl-5 leading-relaxed text-gray-700">
            <li>Informe modelo, versão e ano do veículo, além da medida completa do pneu.</li>
            <li>Envie uma foto legível da lateral do pneu e confira as especificações no manual do carro.</li>
            <li>Consulte preço, disponibilidade, opções de serviço e horário. Não presuma estoque ou encaixe imediato.</li>
            <li>Relate desgaste irregular, vibração ou alerta de pressão para orientar a avaliação.</li>
          </ul>
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-gray-900 px-5 py-3 font-bold text-white">Consultar atendimento pelo WhatsApp</a>
          <p className="mt-3 text-sm text-gray-600">Telefone: <a href="tel:+554130827282" className="underline">(41) 3082-7282</a></p>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-xl font-bold">Pneus para elétricos e híbridos</h3>
        <p className="mt-3 leading-relaxed text-gray-700">O tipo de motor e o aro não bastam para escolher um pneu. Confirme medida completa, índices de carga e velocidade e exigências da versão do veículo. Nos guias, veja o que levar à consulta e quais cuidados observar.</p>
        <div className="mt-3 flex flex-wrap gap-3">
          <a href="/pneus-eletricos-curitiba" className="inline-flex min-h-11 items-center rounded-xl border border-gray-300 px-4 py-2 font-semibold underline">Guia de pneus para elétricos</a>
          <a href="/pneus-hibridos-curitiba" className="inline-flex min-h-11 items-center rounded-xl border border-gray-300 px-4 py-2 font-semibold underline">Guia de pneus para híbridos</a>
          <a href="/pneus-byd-curitiba" className="inline-flex min-h-11 items-center rounded-xl border border-gray-300 px-4 py-2 font-semibold underline">Pneus para BYD</a>
        </div>
      </div>

      <nav aria-label="Guias de pneus por aro" className="border-t border-gray-200 pt-6">
        <h3 className="text-xl font-bold">Explore os guias de aro 13 a 23</h3>
        <p className="mt-3 leading-relaxed text-gray-700">Use o aro como ponto de partida. A aplicação depende também da largura, do perfil e das demais especificações; consulte a disponibilidade da medida exata.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {Array.from({ length: 11 }, (_, index) => index + 13).map(aro => (
            <a key={aro} href={`/aro/${aro}`} className="inline-flex min-h-11 min-w-16 items-center justify-center rounded-xl border border-gray-300 px-4 py-2 font-semibold hover:bg-yellow-100">Aro {aro}</a>
          ))}
        </div>
      </nav>
    </section>
  );
}
