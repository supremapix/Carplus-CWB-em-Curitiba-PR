export interface SeoItem {
  id: string;
  name: string;
  type: 'bairro-oficial' | 'bairro-nao-oficial' | 'regiao-popular' | 'rmc' | 'aro';
  slug: string;
  detailText?: string;
}

export const OFFICIAL_NEIGHBORHOODS: string[] = [
  "Abranches", "Água Verde", "Ahú", "Alto Boqueirão", "Alto da Glória",
  "Alto da Rua XV", "Atuba", "Augusta", "Bacacheri", "Bairro Alto",
  "Barreirinha", "Batel", "Bigorrilho", "Boa Vista", "Bom Retiro",
  "Boqueirão", "Butiatuvinha", "Cabral", "Cachoeira", "Cajuru",
  "Campina do Siqueira", "Campo Comprido", "Campo de Santana", "Capão Raso", "Capão da Imbuia",
  "Cascatinha", "Caximba", "Centro", "Centro Cívico", "Cidade Industrial (CIC)",
  "Cristo Rei", "Fanny", "Fazendinha", "Ganchinho", "Guabirotuba",
  "Guaíra", "Hauer", "Hugo Lange", "Jardim Botânico", "Jardim Social",
  "Jardim das Américas", "Juvevê", "Lamenha Pequena", "Lindóia", "Mercês",
  "Mossunguê", "Novo Mundo", "Orleans", "Parolin", "Pilarzinho",
  "Pinheirinho", "Portão", "Prado Velho", "Rebouças", "Riviera",
  "Santa Cândida", "Santa Felicidade", "Santa Quitéria", "Santo Inácio", "Seminário",
  "Sítio Cercado", "São Braz", "São Francisco", "São João", "São Lourenço",
  "São Miguel", "Taboão", "Tarumã", "Tatuquara", "Tingui",
  "Uberaba", "Umbará", "Vila Izabel", "Vista Alegre", "Xaxim"
];

export const NON_OFFICIAL_NEIGHBORHOODS: { name: string; region: string }[] = [
  { name: "Vila Sandra", region: "Cidade Industrial" },
  { name: "Vila Verde", region: "Cidade Industrial" },
  { name: "Vila Nossa Senhora da Luz", region: "Cidade Industrial" },
  { name: "Vitória Régia", region: "Cidade Industrial" },
  { name: "Caiuá", region: "Cidade Industrial" },
  { name: "Sabará", region: "Cidade Industrial" },
  { name: "Gabineto", region: "Cidade Industrial" },
  { name: "Itatiaia", region: "Cidade Industrial" },
  { name: "Santa Helena", region: "Cidade Industrial" },
  { name: "Conquista", region: "Cidade Industrial" },
  { name: "Barigui", region: "Cidade Industrial" },
  { name: "Osvaldo Cruz", region: "Cidade Industrial" },
  { name: "Atenas", region: "Cidade Industrial" },
  { name: "Neoville", region: "Cidade Industrial" },
  { name: "Vila Pantanal", region: "Cajuru" },
  { name: "Vila Torres", region: "Rebouças / Prado Velho" },
  { name: "Vila Hauer", region: "Hauer" },
  { name: "Vila Oficinas", region: "Cajuru / Capão da Imbuia" },
  { name: "Vila Guaíra", region: "Guaíra" },
  { name: "Vila Osternack", region: "Sítio Cercado" },
  { name: "Vila São Pedro", region: "Xaxim / Capão Raso" },
  { name: "Vila Audi", region: "Uberaba" },
  { name: "Vila Parolin", region: "Parolin" },
  { name: "Vila das Torres", region: "Rebouças" },
  { name: "Jardim Gabineto", region: "Cidade Industrial" },
  { name: "Jardim Itatiaia", region: "Cidade Industrial" },
  { name: "Jardim da Ordem", region: "Tatuquara" },
  { name: "Jardim Kosmos", region: "Bairro Alto" },
  { name: "Jardim Alvorada", region: "Guaíra / Lindóia" }
];

export const POPULAR_REGIONS: { name: string; subtitle: string; subAreas: string[] }[] = [
  {
    name: "Região Central & Rebouças",
    subtitle: "Prado Velho, Vila Torres, Vila das Torres, Vila Prado, Centro",
    subAreas: ["Vila Torres", "Vila das Torres", "Vila Oficinas", "Vila Prado", "Centro Cívico", "Rebouças"]
  },
  {
    name: "Região Cidade Industrial (CIC)",
    subtitle: "CIC Central, Vila Sandra, Vila Verde, Vitória Régia, Sabará, Neoville",
    subAreas: ["Vila Sandra", "Vila Verde", "Nossa Senhora da Luz", "Vitória Régia", "Caiuá", "Sabará", "Conquista", "Gabineto", "Itatiaia", "Santa Helena", "Atenas", "Osvaldo Cruz", "Barigui", "Neoville"]
  },
  {
    name: "Região Sul (Pinheirinho / Sítio Cercado / Umbará)",
    subtitle: "Pinheirinho Velho, Sítio Cercado Velho, Umbará de Baixo e de Cima, Capão Raso Velho",
    subAreas: ["Pinheirinho Velho", "Sítio Cercado Velho", "Umbará de Baixo", "Umbará de Cima", "Capão Raso Velho", "Vila Osternack", "Tatuquara"]
  },
  {
    name: "Região Boqueirão / Hauer / Xaxim",
    subtitle: "Carmo, Hauer Velho, Xaxim Velho, Boqueirão Alto, Boqueirão Velho",
    subAreas: ["Carmo", "Hauer Velho", "Xaxim Velho", "Boqueirão Alto", "Boqueirão Velho", "Vila Hauer", "Fanny", "Lindóia"]
  },
  {
    name: "Região Leste (Cajuru / Uberaba / Capão da Imbuia)",
    subtitle: "Vila Pantanal, Cajuru Alto, Uberaba Velho, Uberaba de Cima, Jardim das Torres",
    subAreas: ["Vila Pantanal", "Cajuru Alto", "Uberaba Velho", "Uberaba de Cima", "Jardim das Torres", "Vila Audi", "Cristo Rei"]
  },
  {
    name: "Região Norte (Boa Vista / Bairro Alto / Tingui)",
    subtitle: "Bairro Alto Norte, Bairro Alto Velho, Tingui Velho, Boa Vista Norte",
    subAreas: ["Bairro Alto Norte", "Bairro Alto Velho", "Tingui Velho", "Boa Vista Norte", "Jardim Kosmos", "Atuba", "Santa Cândida"]
  },
  {
    name: "Região Oeste (Santa Felicidade / Orleans / São Braz)",
    subtitle: "Orleans Velho, São Braz Alto, Santa Felicidade Norte",
    subAreas: ["Orleans Velho", "São Braz Alto", "Santa Felicidade Norte", "Butiatuvinha", "Santo Inácio", "Cascatinha"]
  }
];

export const METROPOLITAN_CITIES: string[] = [
  "São José dos Pinhais", "Pinhais", "Colombo", "Araucária", "Almirante Tamandaré",
  "Campo Largo", "Campo Magro", "Fazenda Rio Grande", "Quatro Barras",
  "Campina Grande do Sul", "Mandirituba", "Balsa Nova", "Rio Branco do Sul",
  "Itaperuçu", "Tijucas do Sul"
];

// The published address is the destination, not a geocoded point or route estimate.
export const CARPLUS_STORE_ADDRESS = 'Av. Presidente Arthur da Silva Bernardes, 1323, Portão, Curitiba - PR, 80320-300';
export const CARPLUS_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(CARPLUS_STORE_ADDRESS)}&travelmode=driving`;

export function getRouteInstructions(locationName: string, type: string): { route: string; distance: string; time: string } {
  const origin = locationName.trim();
  const departure = type === 'rmc'
    ? `Para sair de ${origin}, informe seu endereço de partida no aplicativo de mapas.`
    : `Para quem está em ${origin}, o trajeto depende do ponto exato de saída.`;

  return {
    route: `${departure} O atendimento é na loja do Portão: ${CARPLUS_STORE_ADDRESS}. Abra a rota no Google Maps, confira o destino e consulte as condições atuais do percurso antes de sair.`,
    distance: 'Consulte a rota',
    time: 'Varia conforme o trajeto'
  };
}
