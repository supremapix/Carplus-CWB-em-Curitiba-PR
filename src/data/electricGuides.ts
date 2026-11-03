export type ElectricGuideKind = 'electric' | 'hybrid';

export const ELECTRIC_GUIDE_ROUTES = {
  electric: '/pneus-eletricos-curitiba',
  hybrid: '/pneus-hibridos-curitiba',
} as const;

export const CARPLUS_GUIDE_CONTACT = {
  address: 'Av. Presidente Arthur da Silva Bernardes, 1323, Portão, Curitiba, PR, 80320-300',
  phone: '(41) 3082-7282',
  whatsapp: 'https://wa.me/554130827282',
};

export const ELECTRIC_GUIDES = {
  electric: {
    title: 'Pneus para carros elétricos em Curitiba',
    metaTitle: 'Pneus para carros elétricos em Curitiba | Carplus',
    description: 'Confira medida, carga, velocidade e aplicação dos pneus do seu elétrico. Consulte a Carplus no Portão, em Curitiba.',
    intro: 'A escolha começa pelas especificações da versão do seu carro. Consulte medida, índices e aplicação; depois compare as características do pneu para sua rotina. A Carplus atende no Portão e ajuda a organizar essa consulta.',
    heading: 'Mais do que o aro: o conjunto certo para seu elétrico',
    explanation: 'Peso, entrega de torque, conforto acústico e resistência ao rolamento entram na escolha. Nenhuma dessas características dispensa a conferência da medida completa e dos requisitos do fabricante. Não há uma pressão ou um intervalo de rodízio universal para todos os elétricos.',
    steps: [
      ['Identifique a versão', 'Separe marca, modelo, ano e versão. Modelos com nomes parecidos, como Dolphin e Dolphin Mini, não devem ser tratados como equivalentes.'],
      ['Confira as especificações', 'Use o manual e a etiqueta do veículo para verificar medida, índices de carga e velocidade e possíveis diferenças entre os eixos.'],
      ['Compare o pneu específico', 'Verifique a ficha do modelo e da medida escolhidos. A inscrição EV, sozinha, não confirma a aplicação nem garante maior autonomia.'],
    ],
  },
  hybrid: {
    title: 'Pneus para carros híbridos em Curitiba',
    metaTitle: 'Pneus para carros híbridos em Curitiba | Carplus',
    description: 'Escolha pneus para seu híbrido pela aplicação, medida e índices exigidos. Prepare sua consulta à Carplus no Portão.',
    intro: 'Ter dois tipos de propulsão não define uma medida de pneu. Para escolher os pneus do seu híbrido, comece pelo ano, pela versão e pelas especificações do veículo, mesmo quando você ainda não sabe a medida.',
    heading: 'Compare pela aplicação, não apenas pelo selo',
    explanation: 'Uma tecnologia voltada a eletrificados pode reunir características de eficiência, carga e conforto. Mas dois pneus do mesmo aro não são necessariamente intercambiáveis. Compare opções específicas e confirme a aplicação antes de decidir pela marca ou pela inscrição EV.',
    steps: [
      ['Não sabe a medida?', 'Envie modelo, ano, versão e uma foto legível da lateral do pneu. A foto ajuda na consulta, mas o conjunto instalado não substitui a conferência do manual.'],
      ['Pergunte antes de comprar', 'A medida e os índices atendem à versão? Há requisitos diferentes por eixo? A opção está disponível e o orçamento inclui quais serviços?'],
      ['Planeje os cuidados', 'Siga as orientações de pressão e rodízio do fabricante. Desgaste irregular, perda de pressão e vibração pedem avaliação da causa, não apenas pneus novos.'],
    ],
  },
} as const;

export const ELECTRIC_GUIDE_ARTICLES = [
  { slug: 'desgaste-pneus-carros-eletricos', title: 'Desgaste diferente', description: 'Peso, torque e cuidados: o que observar antes da troca.' },
  { slug: 'como-escolher-pneus-carros-hibridos', title: 'Dúvida sobre aplicação', description: 'Como escolher pneus para híbridos sem depender só do selo EV.' },
  { slug: 'pneus-pressao-autonomia-carro-eletrico', title: 'Pressão que cai', description: 'Pressão, autonomia e por que seguir a referência do seu veículo.' },
  { slug: 'ruido-vibracao-pneus-carro-eletrico', title: 'Ruído ou vibração', description: 'Entenda o que relatar na avaliação de pneus, rodas e suspensão.' },
  { slug: 'bolha-furo-desgaste-pneu-eletrico-hibrido', title: 'Bolha ou dano visível', description: 'Orientações de segurança antes de organizar qualquer deslocamento.' },
] as const;
