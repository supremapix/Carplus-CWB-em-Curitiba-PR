import React, { useEffect, useState } from 'react';
import { getFullCatalog } from '../data/catalogo-pneus';
import type { CatalogTire } from '../types';
import { CARPLUS_GUIDE_CONTACT, ELECTRIC_GUIDES, ELECTRIC_GUIDE_ROUTES, ELECTRIC_GUIDE_ARTICLES, type ElectricGuideKind } from '../data/electricGuides';

interface ElectricGuidesProps {
  kind: ElectricGuideKind;
  onNavigateUrl?: (url: string) => void;
}

// Every selector is scoped to this component; server rendering needs no browser globals.
const guideStyles = `
.electric-guide{background:#fff;color:#242424;line-height:1.7;padding:36px 20px 64px;font-family:inherit}
.electric-guide *{box-sizing:border-box}.electric-guide .eg-wrap{max-width:1120px;margin:auto}
.electric-guide .eg-crumbs{display:flex;flex-wrap:wrap;gap:10px;font-size:14px;margin-bottom:28px}
.electric-guide a{color:#a31621;text-decoration:underline;text-underline-offset:4px}
.electric-guide a:focus-visible,.electric-guide input:focus-visible,.electric-guide select:focus-visible,.electric-guide summary:focus-visible{outline:3px solid #ae1f2a;outline-offset:4px}
.electric-guide .eg-eyebrow{font-size:13px;letter-spacing:.12em;font-weight:800;text-transform:uppercase;color:#a31621}
.electric-guide h1{font-size:clamp(32px,5vw,54px);line-height:1.12;letter-spacing:-.035em;max-width:850px;margin:12px 0 22px;font-weight:800}
.electric-guide h2{font-size:clamp(25px,3vw,34px);line-height:1.2;letter-spacing:-.025em;margin:0 0 18px;font-weight:750}
.electric-guide h3{font-size:20px;line-height:1.3;margin:0 0 12px;font-weight:750}
.electric-guide p{margin:0 0 18px}.electric-guide .eg-lead{max-width:800px;font-size:19px;color:#4b4b4b}
.electric-guide .eg-section{padding:38px 0;border-top:1px solid #dedede}.electric-guide .eg-hero{padding-bottom:38px}
.electric-guide .eg-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.electric-guide .eg-grid-two{grid-template-columns:repeat(2,minmax(0,1fr))}
.electric-guide .eg-card{background:#f5f5f5;border:1px solid #dedede;border-radius:16px;padding:24px}.electric-guide .eg-card p:last-child{margin-bottom:0}
.electric-guide .eg-number{color:#a31621;font-weight:800;font-size:14px;display:block;margin-bottom:12px}
.electric-guide .eg-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:24px}.electric-guide .eg-button{background:#b51e29;color:#fff;border:1px solid #b51e29;border-radius:8px;padding:12px 20px;font-weight:700;text-decoration:none;display:inline-block}.electric-guide .eg-button-secondary{background:#fff;color:#a31621}
.electric-guide .eg-fields{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin:20px 0}.electric-guide label{display:flex;flex-direction:column;font-weight:700;gap:6px}.electric-guide input,.electric-guide select{width:100%;min-width:0;border:1px solid #aaa;border-radius:8px;background:#fff;color:#242424;padding:12px;font:inherit}
.electric-guide .eg-small{font-size:14px;color:#555}.electric-guide .eg-note{background:#fff4f3;border-left:4px solid #b51e29;padding:20px;margin:24px 0}.electric-guide .eg-list{padding-left:22px}.electric-guide .eg-list li{margin:8px 0}
.electric-guide details{border-bottom:1px solid #ddd;padding:18px 0}.electric-guide summary{cursor:pointer;font-size:18px;font-weight:700}.electric-guide details p{padding-top:16px;max-width:850px}
.electric-guide address{font-style:normal}.electric-guide .eg-products{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:20px}
@media(max-width:720px){.electric-guide{padding:24px 16px 40px}.electric-guide .eg-grid,.electric-guide .eg-grid-two,.electric-guide .eg-fields,.electric-guide .eg-products{grid-template-columns:1fr}.electric-guide .eg-card{padding:20px}.electric-guide .eg-section{padding:28px 0}.electric-guide .eg-button{width:100%;text-align:center}}
`;

export default function ElectricGuides({ kind, onNavigateUrl }: ElectricGuidesProps) {
  const page = ELECTRIC_GUIDES[kind];
  const [catalog, setCatalog] = useState<CatalogTire[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [measure, setMeasure] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [version, setVersion] = useState('');
  useEffect(() => {
    let mounted = true;
    getFullCatalog().then(items => { if (mounted) { setCatalog(items); setLoaded(true); } });
    return () => { mounted = false; };
  }, []);
  const measures = Array.from(new Set(catalog.map(tire => tire.medida))).sort();
  const matches = measure ? catalog.filter(tire => tire.medida === measure).filter((tire, index, all) => all.findIndex(item => item.slug === tire.slug) === index) : [];
  const consult = `${CARPLUS_GUIDE_CONTACT.whatsapp}?text=${encodeURIComponent(`Olá, Carplus! Quero consultar pneus para meu ${kind === 'electric' ? 'elétrico' : 'híbrido'}. Modelo: ${model || 'a informar'}. Ano: ${year || 'a informar'}. Versão: ${version || 'a informar'}. Medida: ${measure || 'a confirmar'}. Gostaria de confirmar aplicação, preço e disponibilidade.`)}`;
  const navigate = (event: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    if (onNavigateUrl && url.startsWith('/') && event.button === 0 && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) { event.preventDefault(); onNavigateUrl(url); }
  };
  const link = (url: string, text: string, className?: string) => <a className={className} href={url} onClick={event => navigate(event, url)}>{text}</a>;
  const articles = kind === 'hybrid' ? [ELECTRIC_GUIDE_ARTICLES[1], ...ELECTRIC_GUIDE_ARTICLES.filter((_, i) => i !== 1)] : ELECTRIC_GUIDE_ARTICLES;
  return <article className="electric-guide">
    <style>{guideStyles}</style>
    <div className="eg-wrap">
      <nav className="eg-crumbs" aria-label="Navegação estrutural">{link('/', 'Início')}<span aria-hidden="true">/</span>{link('/pneus', 'Pneus')}<span aria-hidden="true">/</span><span>{kind === 'electric' ? 'Elétricos' : 'Híbridos'}</span></nav>
      <header className="eg-hero"><span className="eg-eyebrow">Carplus · Portão · Curitiba</span><h1>{page.title}</h1><p className="eg-lead">{page.intro}</p><div className="eg-actions"><a className="eg-button" href="#consultar-aplicacao">Conferir minha aplicação</a>{link(ELECTRIC_GUIDE_ROUTES[kind === 'electric' ? 'hybrid' : 'electric'], kind === 'electric' ? 'Ver guia de híbridos' : 'Ver guia de elétricos', 'eg-button eg-button-secondary')}</div></header>
      <section className="eg-section" aria-labelledby="eg-choose"><h2 id="eg-choose">{page.heading}</h2><p className="eg-lead">{page.explanation}</p><div className="eg-grid">{page.steps.map(([title, text], index) => <article className="eg-card" key={title}><span className="eg-number">0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
      <section className="eg-section" id="consultar-aplicacao" aria-labelledby="eg-application"><h2 id="eg-application">Prepare sua consulta por veículo ou medida</h2><p>Não precisa adivinhar a medida. Informe o que souber e confirme os requisitos do manual no atendimento. Esses dados só são enviados quando você iniciar a conversa no WhatsApp.</p><div className="eg-fields"><label htmlFor="eg-model">Marca e modelo<input id="eg-model" value={model} onChange={event => setModel(event.target.value)} placeholder="Ex.: marca e modelo do carro" autoComplete="off" /></label><label htmlFor="eg-year">Ano/modelo<input id="eg-year" value={year} onChange={event => setYear(event.target.value)} placeholder="Ex.: 2025/2026" inputMode="numeric" autoComplete="off" /></label><label htmlFor="eg-version">Versão<input id="eg-version" value={version} onChange={event => setVersion(event.target.value)} placeholder="Conforme documento/manual" autoComplete="off" /></label></div><label htmlFor="eg-measure">Medida completa cadastrada<select id="eg-measure" value={measure} onChange={event => setMeasure(event.target.value)}><option value="">{loaded ? 'Não sei a medida / selecionar' : 'Carregando medidas do catálogo…'}</option>{measures.map(value => <option key={value} value={value}>{value}</option>)}</select></label><p className="eg-small">Exemplo apenas de leitura: 205/55 R16 informa largura, perfil e aro. Não é uma recomendação para um veículo. Confira também carga, velocidade e demais requisitos.</p><div className="eg-note"><strong>Aplicação a confirmar.</strong> Os resultados abaixo são correspondências por medida, não uma lista de pneus homologados para seu elétrico ou híbrido. Marca, nome e aro não comprovam compatibilidade.</div><a className="eg-button" href={consult} target="_blank" rel="noopener noreferrer">Consultar com a Carplus pelo WhatsApp</a>
        <div aria-live="polite">{measure ? <><p className="eg-small" style={{ marginTop: 20 }}>{matches.length} opções cadastradas para {measure}. Preço e disponibilidade devem ser confirmados.</p><div className="eg-products">{matches.slice(0, 6).map(tire => <article className="eg-card" key={tire.slug}><span className="eg-eyebrow">{tire.marca}</span><h3>{tire.nome}</h3><p>{tire.medida} · Carga {tire.indiceCarga || 'a confirmar'} · Velocidade {tire.indiceVelocidade || 'a confirmar'}</p><p className="eg-small">Aplicação a confirmar no atendimento.</p><a href={`${CARPLUS_GUIDE_CONTACT.whatsapp}?text=${encodeURIComponent(`Olá! Quero consultar ${tire.nome}, medida ${tire.medida}, e confirmar aplicação, preço e disponibilidade para meu veículo.`)}`} target="_blank" rel="noopener noreferrer">Consultar esta opção</a></article>)}</div>{matches.length === 0 && <p>Não há produtos cadastrados neste filtro. Consulte opções e disponibilidade.</p>}{matches.length > 6 && <p className="eg-small">Mostrando 6 opções. {link('/pneus', 'Consultar catálogo completo')}</p>}</> : <p className="eg-small" style={{ marginTop: 20 }}>Selecione uma medida para ver itens realmente cadastrados. {link('/pneus', 'Explorar o catálogo completo')}</p>}</div>
      </section>
      <section className="eg-section" aria-labelledby="eg-symptoms"><h2 id="eg-symptoms">O que você está percebendo?</h2><p>Escolha a dúvida ou o sinal para entender o próximo passo. Conteúdo informativo não substitui uma inspeção.</p><div className="eg-grid">{articles.map(article => <article className="eg-card" key={article.slug}><h3>{link(`/blog/${article.slug}`, article.title)}</h3><p>{article.description}</p></article>)}</div><aside className="eg-note"><strong>Bolha, dano visível ou perda importante de pressão?</strong> Pare em local seguro e organize assistência conforme o manual. Não continue dirigindo para testar o pneu ou apenas para chegar à loja. {link('/blog/bolha-furo-desgaste-pneu-eletrico-hibrido', 'Leia as orientações de segurança.')}</aside></section>
      <section className="eg-section" aria-labelledby="eg-services"><h2 id="eg-services">Cuidados com pneus, rodas e suspensão</h2><div className="eg-grid-two eg-grid"><div><p>A Carplus informa oferecer montagem, balanceamento, alinhamento 3D, troca de válvulas e serviços de suspensão. Consulte quais procedimentos são indicados e atendidos para seu modelo.</p><ul className="eg-list"><li>Balanceamento e alinhamento são procedimentos diferentes.</li><li>Desgaste irregular pede avaliação da causa.</li><li>Pressão e rodízio devem seguir o manual da versão.</li><li>Informe impactos, modificações nas rodas e reparos anteriores.</li></ul></div><aside className="eg-card"><h3>Uma conversa mais útil</h3><p>Conte quando o sintoma começou, em quais condições aparece e qual roda é afetada. Não faça testes de velocidade ou manobras para tentar reproduzir um problema.</p><p>Serviços, valores e disponibilidade dependem da avaliação e da confirmação no atendimento.</p></aside></div></section>
      <section className="eg-section" aria-labelledby="eg-faq"><h2 id="eg-faq">Dúvidas antes de escolher</h2>{[
        ['Preciso comprar um pneu com a inscrição EV?', 'Não decida só pela inscrição. Confira a aplicação, a medida completa e os índices exigidos pelo veículo. Tecnologias voltadas a eletrificados não tornam qualquer pneu compatível com qualquer modelo.'],
        ['Posso escolher só pelo aro?', 'Não. O aro é apenas parte da medida. Largura, perfil, carga, velocidade e outros requisitos precisam ser conferidos no manual e na ficha do pneu.'],
        ['O pneu instalado hoje é uma referência suficiente?', 'Não necessariamente, principalmente se houve mudança de rodas ou compra do carro usado. Uma foto ajuda, mas deve ser confrontada com as especificações corretas da versão.'],
        ['Pneus novos resolvem qualquer vibração?', 'Não. É preciso avaliar a causa. Pneus, rodas, equilíbrio do conjunto, geometria e componentes da suspensão podem entrar na investigação.'],
        ['Como consultar preço e disponibilidade?', 'Envie modelo, versão, ano e medida, se souber. A Carplus confirma as opções e o orçamento no atendimento. Os itens exibidos por medida não representam estoque confirmado.'],
      ].map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</section>
      <section className="eg-section" aria-labelledby="eg-sources"><h2 id="eg-sources">Referências para conferir</h2><p>Orientações baseadas em fontes dos fabricantes. Cada artigo reúne suas referências específicas.</p><ul className="eg-list"><li><a href="https://www.michelin.com.br/auto/conselhos/informacoes-basicas-sobre-pneus/indice-de-carga-do-pneu-e-classificacao-de-velocidade-do-pneu">Michelin: índices de carga e velocidade</a></li><li><a href="https://www.pirelli.com/tyres/pt-br/carro/tecnologia-e-conhecimento/elect">Pirelli: tecnologia ELECT</a></li><li><a href="https://www.continental-tires.com/tire-knowledge/electric-vehicle-tires/">Continental: pneus e veículos elétricos</a></li><li><a href="https://www.byd.com/br/manual-proprietario">BYD: manuais por modelo</a></li></ul></section>
      <section className="eg-section" aria-labelledby="eg-contact"><span className="eg-eyebrow">Atendimento no Portão</span><h2 id="eg-contact">Converse com a Carplus</h2><address>{CARPLUS_GUIDE_CONTACT.address}<br /><a href="tel:+554130827282">{CARPLUS_GUIDE_CONTACT.phone}</a></address><div className="eg-actions"><a className="eg-button" href={consult} target="_blank" rel="noopener noreferrer">Consultar pneus e atendimento</a>{link('/pneus', 'Voltar ao catálogo', 'eg-button eg-button-secondary')}</div></section>
    </div>
  </article>;
}
