export interface TireAdviceFaq {
  question: string;
  answer: string;
}

// Shared by the visible guide and the homepage's structured data.
export const FAQ_ADVICE: TireAdviceFaq[] = [
  {
    question: 'Pneu Prinx é bom? E as outras marcas?',
    answer: 'Para escolher um pneu Prinx ou de outra marca, avalie o modelo específico e a sua aplicação. Compare a medida, os índices de carga e velocidade, a etiqueta do Inmetro e as condições de garantia. A Carplus ajuda você a conferir esses pontos e a comparar as opções para o seu carro e a sua rotina.',
  },
  {
    question: 'Qual é o melhor pneu para o meu carro?',
    answer: 'A melhor escolha depende da versão do veículo, da medida recomendada e do seu uso. Consulte o manual e a etiqueta do carro para confirmar as especificações; depois, compare características como aderência no molhado, eficiência e ruído. Informe modelo, versão e ano para a Carplus ajudar nessa escolha.',
  },
  {
    question: 'Qual pneu usar em carro elétrico ou híbrido?',
    answer: 'Comece pela especificação do fabricante do veículo: medida, índices de carga e velocidade e pressão recomendada. Confira a aplicação do modelo de pneu e considere conforto, ruído e eficiência. A indicação EV deve ser analisada junto com essas especificações e com a versão do seu elétrico ou híbrido.',
  },
  {
    question: 'Qual pneu usar no BYD Dolphin ou Dolphin Mini?',
    answer: 'Dolphin e Dolphin Mini têm versões e aplicações diferentes. Antes de escolher, confira o ano, a versão, a medida e os índices indicados pelo fabricante. Envie esses dados ou uma foto da etiqueta do veículo para a Carplus comparar as opções compatíveis, sem escolher apenas pelo nome do carro.',
  },
  {
    question: 'Preciso saber a medida para pedir um orçamento?',
    answer: 'Você pode começar a conversa informando o carro, a versão e o ano, mesmo sem saber a medida. Para confirmar a aplicação e o orçamento, a equipe pode pedir a medida indicada no manual ou na etiqueta do veículo e uma foto da lateral do pneu. Preço e disponibilidade são confirmados no atendimento.',
  },
];

export const TIRE_ADVICE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ADVICE.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
};
