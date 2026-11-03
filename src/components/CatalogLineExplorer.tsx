import React from 'react';
import { ConsultationLine, filterConsultationLines } from '../data/consultationLines';
import { formatWhatsApp } from '../utils/whatsapp';

const styles = `
#carplus-root .consultation-explorer{margin:28px 0;padding:24px;border:1px solid #454545;border-top:3px solid #f59c00;border-radius:10px;background:#151515;color:#eee;line-height:1.6}
#carplus-root .consultation-explorer h2{font-size:clamp(24px,3vw,32px);line-height:1.2;color:#fff;margin:8px 0 16px;font-weight:750;text-transform:none}
#carplus-root .consultation-explorer h3{font-size:19px;color:#fff;margin:0 0 12px;font-weight:700;text-transform:none}
#carplus-root .consultation-explorer p{color:#ddd;margin:0 0 12px;font-size:15px}
#carplus-root .consultation-explorer .consultation-kicker,#carplus-root .consultation-explorer .consultation-brand{color:#ffc264;font-size:13px;font-weight:750;letter-spacing:.05em}
#carplus-root .consultation-explorer .consultation-electric{margin-top:24px}
#carplus-root .consultation-explorer .consultation-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin:16px 0}
#carplus-root .consultation-explorer .consultation-line{display:flex;flex-direction:column;min-width:0;padding:20px;background:#202020;border:1px solid #555;border-radius:8px}
#carplus-root .consultation-explorer .consultation-ev{color:#c7f6df;background:#133d2b;border:1px solid #53896d;display:block;padding:6px 8px;font-size:13px;border-radius:4px;margin-bottom:12px}
#carplus-root .consultation-explorer .consultation-status{font-weight:750;color:#fff}
#carplus-root .consultation-explorer .consultation-source{color:#ffc264;text-decoration:underline;text-underline-offset:4px;min-height:44px;display:flex;align-items:center;margin-top:auto}
#carplus-root .consultation-explorer .consultation-cta{background:#f59c00;color:#151515;display:block;border:1px solid #f59c00;border-radius:5px;text-align:center;font-weight:750;padding:12px;margin-top:12px;text-decoration:none;overflow-wrap:anywhere}
#carplus-root .consultation-explorer .consultation-note{font-size:13px;color:#c7c7c7}
#carplus-root .consultation-explorer summary{cursor:pointer;padding:16px 0;color:#ffc264;font-weight:750;list-style:inside disclosure-closed}
#carplus-root .consultation-explorer details[open]>summary{list-style-type:disclosure-open}
#carplus-root .consultation-explorer :is(a,summary):focus-visible{outline:3px solid #fff;outline-offset:4px}
@media(max-width:850px){#carplus-root .consultation-explorer .consultation-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:580px){#carplus-root .consultation-explorer{padding:18px}#carplus-root .consultation-explorer .consultation-grid{grid-template-columns:1fr}}
`;

function LineCard({ line }: { line: ConsultationLine }) {
  return <article className="consultation-line" data-model={`${line.brand} ${line.model}`}>
    <p className="consultation-brand">{line.brand}</p>
    <h3>{line.model}</h3>
    {line.electric && <span className="consultation-ev">{line.electric === 'dedicated' ? 'Linha desenvolvida para elétricos' : 'Aplicações para elétricos'}</span>}
    <p className="consultation-status">Linha sob consulta</p>
    <p>{line.electric === 'compatible' ? 'A fabricante informa aplicação em elétricos; a linha também atende outras motorizações.' : 'Consulte a possibilidade de fornecimento para a especificação do seu veículo.'}</p>
    {line.international && <p className="consultation-note">Referência internacional. Fornecimento no Brasil sujeito a confirmação.</p>}
    <a className="consultation-source" href={line.source} target="_blank" rel="noopener noreferrer">{line.sourceLabel || 'Consultar fonte da marca'}<span className="sr-only"> — {line.brand} {line.model} (nova aba)</span></a>
    <a className="consultation-cta" href={formatWhatsApp(`Olá! Gostaria de consultar a possibilidade de fornecimento da linha ${line.brand} ${line.model}. Vou informar meu veículo, ano, versão, medida e índices de carga e velocidade para confirmar aplicação, preço e disponibilidade.`)} target="_blank" rel="noopener noreferrer">Consultar {line.model}<span className="sr-only"> no WhatsApp (nova aba)</span></a>
  </article>;
}

export default function CatalogLineExplorer({ brand = 'Todas', search = '', electricOnly = false }: { brand?: string; search?: string; electricOnly?: boolean }) {
  const lines = filterConsultationLines(brand, search, electricOnly);
  const electric = lines.filter(line => line.electric);
  const other = lines.filter(line => !line.electric);
  if (!lines.length) return null;
  return <section className="consultation-explorer" aria-labelledby="consultation-heading" id="linhas-sob-consulta">
    <style>{styles}</style>
    <header>
      <p className="consultation-kicker">Mais modelos para comparar</p>
      <h2 id="consultation-heading">{brand !== 'Todas' ? `Linhas ${brand} sob consulta` : 'Pneus para elétricos e mais linhas por marca'}</h2>
      <p>Conheça linhas dos catálogos das marcas e consulte a possibilidade de fornecimento na Carplus. Esta seleção não confirma estoque, preço ou medidas disponíveis na loja.</p>
      <p><strong>Antes de escolher:</strong> confira medida, índices de carga e velocidade, ano e versão do veículo. A indicação para elétricos não confirma compatibilidade com qualquer carro; tecnologias acústicas também variam por versão do pneu.</p>
    </header>
    {electric.length > 0 && <div className="consultation-electric">
      <h3>Em destaque para veículos elétricos</h3>
      <div className="consultation-grid">{electric.map(line => <React.Fragment key={`${line.brand}-${line.model}`}><LineCard line={line} /></React.Fragment>)}</div>
    </div>}
    {other.length > 0 && <details className="consultation-more" open={brand !== 'Todas' || Boolean(search.trim())}>
      <summary>Explorar mais {other.length} linhas sob consulta{brand !== 'Todas' ? ` da ${brand}` : ' por marca'}</summary>
      <div className="consultation-grid">{other.map(line => <React.Fragment key={`${line.brand}-${line.model}`}><LineCard line={line} /></React.Fragment>)}</div>
    </details>}
    <p className="consultation-note">As linhas acima não representam medidas específicas e não entram na contagem dos produtos cadastrados. Fontes conferidas em 03/11/2026.</p>
  </section>;
}
