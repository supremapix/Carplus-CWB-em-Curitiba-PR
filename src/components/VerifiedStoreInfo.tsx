import React from 'react';
export const VERIFIED_STORE_PAGES: Record<string,{title:string;description:string;competitor?:boolean}> = {
  'barao-pneus-e-oficina-bacacheri-curitiba': {title:'Pneus e oficina: conheça a Carplus no Portão',description:'Compare especificações e serviços antes de escolher. A Carplus atende em sua unidade no Portão, Curitiba.',competitor:true},
  'barao-pneus-sao-jose-pinhais': {title:'Pneus para motoristas de São José dos Pinhais | Carplus no Portão',description:'Organize sua consulta de pneus e serviços na Carplus em Curitiba. Confirme disponibilidade antes de se deslocar.',competitor:true},
  'barao-pneus-e-oficina-portao': {title:'Pneus e serviços no Portão | Carplus',description:'Consulte pneus, alinhamento e serviços na Carplus, na Av. Presidente Arthur da Silva Bernardes, 1323.',competitor:true},
  'pneus-pirelli-em-curitiba-melhor-preco': {title:'Pneus Pirelli em Curitiba | Consulte a Carplus',description:'Confira medida, carga e velocidade do seu carro e consulte modelos Pirelli, preços e disponibilidade com a Carplus.'},
  'distribuidora-de-pneus-em-curitiba': {title:'Consulta de pneus em Curitiba | Carplus no Portão',description:'Consulte modelos, medidas e condições de compra de pneus na Carplus. A disponibilidade é confirmada pela equipe.'}
};
export default function VerifiedStoreInfo({slug}:{slug:string}) {
 const page=VERIFIED_STORE_PAGES[slug];
 return <article className="mx-auto max-w-4xl space-y-6 px-6 py-10">
  <nav aria-label="Você está em"><a href="/">Início</a> / <a href="/pneus">Pneus</a></nav>
  <h1 className="text-3xl font-bold">{page.title}</h1><p>{page.description}</p>
  {page.competitor&&<p className="rounded-xl border bg-gray-50 p-5">Esta página é da Carplus. Não somos uma filial nem representantes da Barão Pneus. Nosso atendimento ocorre na unidade Carplus do Portão, em Curitiba.</p>}
  <section className="space-y-3"><h2 className="text-2xl font-bold">Como comparar uma opção de pneu</h2><p>Informe modelo, ano e versão do carro, medida completa e índices exigidos no manual ou etiqueta. Compare o modelo exato, as condições de compra e os serviços incluídos no orçamento. O nome da marca ou o aro sozinho não confirma compatibilidade.</p><p>Produtos cadastrados não garantem estoque. Confirme preço, disponibilidade, prazo e atendimento antes de se deslocar. Não há promessa de menor preço ou de disponibilidade de toda uma linha.</p><a className="carplus-action-secondary" href="/pneus">Consultar o catálogo</a></section>
  <section className="space-y-3"><h2 className="text-2xl font-bold">Conte o que seu carro apresenta</h2><p>Desgaste irregular, vibração ou perda recorrente de pressão merecem avaliação. Explique à equipe quando o sintoma aparece e se houve impacto em buraco ou guia. Confirme quais verificações e serviços estão disponíveis para seu veículo.</p><p><a href="/pneus-eletricos-curitiba">Pneus para elétricos</a> · <a href="/pneus-hibridos-curitiba">Pneus para híbridos</a> · <a href="/alinhamento-3d-curitiba">Alinhamento</a></p></section>
  <section className="space-y-3"><h2 className="text-2xl font-bold">Atendimento na unidade do Portão</h2><p>Av. Presidente Arthur da Silva Bernardes, 1323, Portão, Curitiba. Para quem vem de outro bairro ou município, consulte a rota a partir do seu endereço e combine o atendimento antes da viagem.</p><a className="carplus-action-primary" href="https://wa.me/554130827282" target="_blank" rel="noopener noreferrer">Consultar pneus e serviços</a> <a href="/contato">Endereço e contato</a></section>
 </article>;
}
