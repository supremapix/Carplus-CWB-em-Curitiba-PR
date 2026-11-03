// Editorial model references, not SKUs or offers. Sources checked 2026-11-03.
// No price, size, load/speed index, image, stock or vehicle fitment is inferred.
export interface ConsultationLine {
  brand: string;
  model: string;
  source: string;
  sourceLabel?: string;
  international?: boolean;
  electric?: 'dedicated' | 'compatible';
  existing?: boolean;
}

export const CONSULTATION_LINES: ConsultationLine[] = [
  { brand: 'Michelin', model: 'e.Primacy', electric: 'compatible', source: 'https://www.michelin.com.br/auto/tyres/michelin-e-primacy' },
  { brand: 'Michelin', model: 'Pilot Sport EV', electric: 'dedicated', source: 'https://www.michelin.com.br/auto/tyres/michelin-pilot-sport-ev' },
  { brand: 'Michelin', model: 'Primacy 5', electric: 'compatible', source: 'https://www.michelin.com.br/auto/tyres/michelin-primacy-5' },
  { brand: 'Prinx', model: 'XLAB COMFORT EV', electric: 'dedicated', existing: true, source: 'https://www.prinx.com.br/produtos/pneu-eletrico/xlab-comfort-ev/' },
  { brand: 'Prinx', model: 'XNEX SPORT EV', electric: 'dedicated', existing: true, source: 'https://www.prinx.com.br/produtos/pneu-eletrico/xnex-sport-ev/' },
  { brand: 'Goodyear', model: 'Eagle Sport 2', source: 'https://www.goodyear.com.br/tire-details/eagle-sport-2?size=185%2F60R15' },
  { brand: 'Goodyear', model: 'Assurance MaxLife', source: 'https://www.goodyear.com.br/pneus-assurance' },
  { brand: 'Goodyear', model: 'Assurance Fuel Max All Weather', source: 'https://www.goodyear.com.br/pneus-assurance' },
  { brand: 'Yokohama', model: 'ADVAN Sport V107', source: 'https://www.yokohamatire.com/tires/advan-sport-v107', international: true },
  { brand: 'Yokohama', model: 'GEOLANDAR CV G058', source: 'https://www.y-yokohama.com/product/tire/geolandar/', international: true },
  { brand: 'Yokohama', model: 'GEOLANDAR H/T G056', source: 'https://www.y-yokohama.com/product/tire/geolandar/', international: true },
  { brand: 'Linglong', model: 'COMFORT MASTER', source: 'https://linglong.com.br/modelos/comfort-master' },
  { brand: 'Linglong', model: 'SPORT MASTER', source: 'https://linglong.com.br/modelos/sport-master' },
  { brand: 'Hifly', model: 'HF201', source: 'https://hifly-tires.com/product-range/summer-tires/hf-201/', international: true },
  { brand: 'Hifly', model: 'HF805', source: 'https://hifly-tires.com/product-range/summer-tires/hf-805/', international: true },
  { brand: 'Roadking', model: 'ARGOS AX5', source: 'https://roadkingpneus.com.br/passeio-vans-suv-ltr/' },
  { brand: 'Roadking', model: 'ARGOS UHP', source: 'https://roadkingpneus.com.br/passeio-vans-suv-ltr/' },
  { brand: 'Roadking', model: 'ARGOS TOURING', source: 'https://roadkingpneus.com.br/passeio-vans-suv-ltr/' },
  { brand: 'XBRI', model: 'SPORTLINE C2', source: 'https://www.xbri.com.br/' },
  { brand: 'XBRI', model: 'ECOLOGY', source: 'https://www.xbri.com.br/' },
  { brand: 'XBRI', model: 'BRUTUS II TA', source: 'https://www.xbri.com.br/' },
  { brand: 'Speedmax', model: 'Prime FRD16', source: 'https://www.speedmax.com.br/pneus' },
  { brand: 'Speedmax', model: 'MH01', source: 'https://www.speedmax.com.br/pneus' },
  { brand: 'Speedmax', model: 'HH301', source: 'https://www.speedmax.com.br/pneus' },
  { brand: 'JK Tyre', model: 'UX Royale', source: 'https://www.jktyre.com/pcr/suv/tyre-details/ux-royale', international: true },
  { brand: 'Maxtrek', model: 'MAXIMUS M9', source: 'https://www.maxtrektyres.com/english.php/Product/detail/id/4', international: true },
  { brand: 'Tornel', model: 'CLASSIC', source: 'https://jktornelmx.com/auto-suv/classic/', international: true },
  { brand: 'Comforser', model: 'CF1100', source: 'https://eprel.ec.europa.eu/screen/product/tyres/649838', sourceLabel: 'Registro público EPREL', international: true },
  { brand: 'ZMAX', model: 'ZEALION', source: 'https://eprel.ec.europa.eu/screen/product/tyres/761752', sourceLabel: 'Registro público EPREL', international: true },
  { brand: 'Provato', model: 'GREEN', source: 'https://registro.inmetro.gov.br/consulta/detalhe.aspx?NumeroRegistro=003057%2F2020&pag=1', sourceLabel: 'Registro público do modelo' },
  { brand: 'Provato', model: 'SPORT GREEN', source: 'https://registro.inmetro.gov.br/consulta/detalhe.aspx?NumeroRegistro=003057%2F2020&pag=1', sourceLabel: 'Registro público do modelo' },
];

export const normalizeLine = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9+]/g, '');
export function filterConsultationLines(brand = 'Todas', search = '', electricOnly = false) {
  return CONSULTATION_LINES.filter(line =>
    (brand === 'Todas' || normalizeLine(line.brand) === normalizeLine(brand)) &&
    (!search.trim() || normalizeLine(`${line.brand} ${line.model}${line.electric ? ' elétricos EV' : ''}`).includes(normalizeLine(search))) &&
    (!electricOnly || Boolean(line.electric))
  );
}
