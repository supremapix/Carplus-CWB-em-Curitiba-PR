import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Calendar, Check, CheckCircle2, ChevronDown, ChevronRight, Clock, Copy, Info, MapPin, MessageCircle, Phone, Search, Share2, AlertTriangle } from 'lucide-react';
import { BLOG_POSTS, BLOG_CATEGORIES, type BlogPost, getBlogPostBySlug, getRelatedBlogPosts } from '../blog-data';
import { getCatalogSync } from '../data/catalogo-pneus';
import CatalogTireCard from './CatalogTireCard';
import type { CatalogTire } from '../types';
import { formatWhatsApp } from '../utils/whatsapp';
import { createPageShare } from '../utils/sharing';
import { trackEvent } from '../lib/analytics';
import '../blog.css';

interface BlogViewProps {
  currentSlug?: string | null;
  onNavigateBlog: (slug?: string) => void;
  onNavigateHome: () => void;
  onNavigateUrl?: (url: string) => void;
}

const normalizedSearch = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
const primaryClick = (event: React.MouseEvent<HTMLAnchorElement>) => event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
const optimizedPhotoPath = (path: string) => path.replace('/images/galeria/', '/images/carplus-real/').replace(/\.(?:jpe?g|png)$/i, '.webp');
const realPhotoFallback = (event: React.SyntheticEvent<HTMLImageElement>) => {
  const image = event.currentTarget;
  if (image.dataset.realFallback) return;
  image.dataset.realFallback = 'true';
  image.src = image.dataset.originalSrc || '/images/galeria/alinhamento.jpg';
};

export const BlogView: React.FC<BlogViewProps> = ({ currentSlug, onNavigateBlog, onNavigateHome, onNavigateUrl }) => {
  const instanceId = useId();
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [shareStatus, setShareStatus] = useState('');
  const [manualShareUrl, setManualShareUrl] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [nativeShareAvailable, setNativeShareAvailable] = useState(false);
  const manualLinkRef = useRef<HTMLInputElement>(null);
  const currentPost = useMemo(() => currentSlug ? getBlogPostBySlug(currentSlug) : null, [currentSlug]);

  useEffect(() => {
    setNativeShareAvailable(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
  }, []);

  useEffect(() => {
    setShareStatus('');
    setManualShareUrl('');
    setLinkCopied(false);
  }, [currentSlug]);

  useEffect(() => {
    if (!manualShareUrl) return;
    manualLinkRef.current?.focus();
    manualLinkRef.current?.select();
  }, [manualShareUrl]);

  const navigate = (event: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    if (!primaryClick(event)) return;
    if (url === '/') {
      event.preventDefault();
      onNavigateHome();
    } else if (url === '/blog' || url === '/blog/') {
      event.preventDefault();
      onNavigateBlog();
    } else if (url.startsWith('/blog/')) {
      event.preventDefault();
      onNavigateBlog(url.replace('/blog/', '').replace(/\/$/, ''));
    } else if (onNavigateUrl && url.startsWith('/')) {
      event.preventDefault();
      onNavigateUrl(url);
    } else return;
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleSelectCatalogTire = (tire: CatalogTire) => {
    if (onNavigateUrl) onNavigateUrl(`/pneu/${tire.slug}`);
    else {
      window.history.pushState(null, '', `/pneu/${tire.slug}`);
      window.dispatchEvent(new Event('popstate'));
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Find tires referenced or relevant to this article from official catalog
  const matchingCatalogTires = useMemo(() => {
    if (!currentPost) return [];
    const catalog = getCatalogSync();
    if (currentPost.slug === 'pneus-para-carro-eletrico-em-curitiba') {
      return catalog.filter(t => 
        t.nome.toLowerCase().includes('ev') || 
        t.categoria.toLowerCase().includes('elétr') ||
        t.medida === '175/55R16' ||
        t.medida === '195/60R16' ||
        t.medida === '205/50R17' ||
        t.medida === '215/55R17' ||
        t.medida === '235/50R19'
      ).slice(0, 4);
    }
    if (currentPost.slug === 'como-escolher-rodas-carro') {
      return catalog.filter(t => t.aro >= 17 && (t.destaque || t.novoModelo)).slice(0, 4);
    }
    if (
      currentPost.slug === 'pneu-desgastando-de-um-lado' || 
      currentPost.slug === 'carro-puxando-para-o-lado' || 
      currentPost.slug === 'quando-fazer-alinhamento-balanceamento' ||
      currentPost.slug === 'volante-vibrando-causas'
    ) {
      return catalog.filter(t => 
        t.medida === '175/65R14' || 
        t.medida === '185/60R15' || 
        t.medida === '205/55R16' || 
        t.medida === '215/50R17'
      ).slice(0, 4);
    }
    if (currentPost.slug === 'revisao-carro-antes-de-viajar') {
      return catalog.filter(t => 
        t.categoria.toLowerCase().includes('suv') || 
        t.medida === '205/55R16' || 
        t.medida === '215/65R16' || 
        t.medida === '225/65R17'
      ).slice(0, 4);
    }
    return catalog.filter(t => t.destaque).slice(0, 4);
  }, [currentPost]);

  const filteredPosts = useMemo(() => {
    const search = normalizedSearch(searchTerm.trim());
    return BLOG_POSTS.filter(post => (selectedCategory === 'Todas' || post.category === selectedCategory) && (!search || normalizedSearch(`${post.title} ${post.summary} ${post.category}`).includes(search)));
  }, [selectedCategory, searchTerm]);
  const relatedPosts = useMemo(() => currentPost ? getRelatedBlogPosts(currentPost) : [], [currentPost]);

  const recordShare = (method: string, post: BlogPost) => {
    const details = createPageShare(`/blog/${post.slug}`, post.title);
    trackEvent('share', { method, content_type: 'article', item_id: details.url, link_url: details.url, click_location: 'blog_article' });
  };
  const manualCopy = (url: string) => {
    setManualShareUrl(url);
    setLinkCopied(false);
    setShareStatus('Selecione e copie o link abaixo para compartilhar.');
  };
  const copyArticle = async (post: BlogPost) => {
    const details = createPageShare(`/blog/${post.slug}`, post.title);
    try {
      if (!navigator.clipboard?.writeText) { manualCopy(details.url); return; }
      await navigator.clipboard.writeText(details.url);
      setManualShareUrl('');
      setLinkCopied(true);
      setShareStatus('Link copiado! Cole na conversa para compartilhar o artigo.');
      recordShare('copy_link', post);
    } catch { manualCopy(details.url); }
  };
  const shareArticle = async (post: BlogPost) => {
    const details = createPageShare(`/blog/${post.slug}`, post.title);
    try {
      if (!navigator.share) { await copyArticle(post); return; }
      await navigator.share({ title: post.title, text: post.summary, url: details.url });
      setShareStatus('Compartilhamento concluído.');
      recordShare('native', post);
    } catch (error) {
      if (error && typeof error === 'object' && 'name' in error && error.name === 'AbortError') { setShareStatus('Compartilhamento cancelado.'); return; }
      manualCopy(details.url);
    }
  };

  const renderPostCard = (post: BlogPost) => (
    <article key={post.id} className="blog-card">
      <a href={`/blog/${post.slug}`} onClick={event => navigate(event, `/blog/${post.slug}`)} className="blog-card-link">
        <div className="blog-card-photo"><img src={optimizedPhotoPath(post.featuredImage)} data-original-src={post.featuredImage} alt={post.imageAlt} width="1600" height="1068" loading="lazy" decoding="async" onError={realPhotoFallback} /></div>
        <div className="blog-card-copy">
          <span className="blog-category">{post.category}</span>
          <div className="blog-card-meta"><span><Calendar aria-hidden="true" />{post.publishedDate}</span><span><Clock aria-hidden="true" />{post.readingTime}</span></div>
          <h2 className="blog-card-title">{post.title}</h2>
          <p className="blog-card-summary">{post.summary}</p>
          <span className="blog-card-read">Ler artigo completo<ArrowRight aria-hidden="true" /></span>
        </div>
      </a>
    </article>
  );

  if (currentPost) {
    return (
      <article id={`blog-post-${currentPost.slug}`} className="carplus-blog carplus-blog-article">
        <nav aria-label="Caminho da página" className="blog-breadcrumb blog-article-shell"><a href="/" onClick={event => navigate(event, '/')}>Início</a><ChevronRight aria-hidden="true" /><a href="/blog" onClick={event => navigate(event, '/blog')}>Blog</a><ChevronRight aria-hidden="true" /><span aria-current="page">{currentPost.category}</span></nav>
        <div className="blog-article-shell">
          <header className="blog-article-header">
            <a href="/blog" onClick={event => navigate(event, '/blog')} className="blog-back-link"><ArrowLeft aria-hidden="true" />Voltar para todos os artigos</a>
            <div className="blog-article-meta"><span className="blog-category">{currentPost.category}</span><span><Calendar aria-hidden="true" />Publicado em {currentPost.publishedDate}</span><span><Clock aria-hidden="true" />{currentPost.readingTime}</span></div>
            <h1 className="blog-article-title">{currentPost.h1}</h1>
            <p className="blog-article-lead">{currentPost.summary}</p>
          </header>
          <figure className="blog-featured-photo"><img src={optimizedPhotoPath(currentPost.featuredImage)} data-original-src={currentPost.featuredImage} alt={currentPost.imageAlt} width="1600" height="1068" loading="eager" fetchPriority="high" decoding="async" onError={realPhotoFallback} /><figcaption>{currentPost.imageAlt}</figcaption></figure>
          <div className="blog-prose">
            <p className="blog-paragraph blog-intro">{currentPost.intro}</p>
            {currentPost.sections.map((section, sectionIndex) => {
              const Heading = section.level === 'h3' ? 'h3' : 'h2';
              const CalloutIcon = section.callout?.type === 'warning' ? AlertTriangle : section.callout?.type === 'tip' ? CheckCircle2 : Info;
              return (
                <section key={sectionIndex} className="blog-section">
                  {section.title && <Heading className="blog-section-heading">{section.title}</Heading>}
                  {section.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex} className="blog-paragraph">{paragraph}</p>)}
                  {section.listItems && section.listItems.length > 0 && <ul className="blog-content-list">{section.listItems.map((item, itemIndex) => <li key={itemIndex}><CheckCircle2 aria-hidden="true" /><span>{item}</span></li>)}</ul>}
                  {section.callout && <aside className={`blog-callout blog-callout-${section.callout.type}`}><CalloutIcon aria-hidden="true" /><div><h3 className="blog-callout-title">{section.callout.title}</h3><p className="blog-paragraph">{section.callout.text}</p></div></aside>}
                  {section.internalLinks && section.internalLinks.length > 0 && <div className="blog-internal-links">{section.internalLinks.map((link, linkIndex) => <a key={linkIndex} href={link.url} onClick={event => navigate(event, link.url)} className="blog-internal-link"><span className="blog-internal-title">{link.text}<ArrowRight aria-hidden="true" /></span>{link.description && <span className="blog-internal-description">{link.description}</span>}</a>)}</div>}
                </section>
              );
            })}
            {currentPost.faqs && currentPost.faqs.length > 0 && <section className="blog-faq"><h2 className="blog-section-heading">Perguntas Frequentes sobre {currentPost.category}</h2><div>{currentPost.faqs.map((faq, index) => <details key={index}><summary><span>{faq.question}</span><ChevronDown aria-hidden="true" /></summary><p className="blog-paragraph">{faq.answer}</p></details>)}</div></section>}
            <aside className="blog-editorial-notice"><Info aria-hidden="true" /><p>Conteúdo informativo. A avaliação do seu veículo depende de inspeção presencial por um profissional.</p></aside>
          </div>

          <section className="blog-contact-panel" aria-labelledby={`${instanceId}-article-contact`}>
            <div><h2 id={`${instanceId}-article-contact`} className="blog-panel-title">{currentPost.ctaTitle || 'Precisa avaliar seu veículo em Curitiba?'}</h2><p className="blog-panel-text">{currentPost.ctaText || 'Se você identificou algum desses sinais, uma inspeção técnica na Carplus pode ajudar a encontrar a origem do problema.'}</p></div>
            <div className="blog-contact-actions"><a href={formatWhatsApp(currentPost.whatsappMessage || 'Olá, Carplus! Estava lendo o Blog e gostaria de tirar uma dúvida sobre manutenção.')} target="_blank" rel="noopener noreferrer" data-cta-location="blog-artigo" className="carplus-action-primary"><MessageCircle aria-hidden="true" />{currentPost.ctaButtonText || 'Solicitar orçamento'}</a><a href="/pneus" onClick={event => navigate(event, '/pneus')} className="carplus-action-secondary">Ver catálogo de pneus<ArrowRight aria-hidden="true" /></a></div>
            <div className="blog-local-details"><p><MapPin aria-hidden="true" /><span>Carplus Pneus e Oficina Mecânica — Portão, Curitiba<br />Av. Presidente Arthur da Silva Bernardes, 1323<br />Segunda a sexta: 8h às 18h · Sábado: 8h às 12h</span></p><a href="tel:+554130827282"><Phone aria-hidden="true" />(41) 3082-7282</a></div>
          </section>

          {matchingCatalogTires.length > 0 && <details className="blog-catalog-details"><summary><span>Ver opções do catálogo relacionadas a este assunto</span><ChevronDown aria-hidden="true" /></summary><div className="blog-catalog-content"><p className="blog-panel-text">Confira a medida e a aplicação com a equipe antes de escolher seu pneu.</p><div className="blog-tire-grid">{matchingCatalogTires.map(tire => <CatalogTireCard key={tire.id} tire={tire} onSelect={handleSelectCatalogTire} />)}</div><a href="/pneus" onClick={event => navigate(event, '/pneus')} className="carplus-action-secondary">Ver catálogo completo<ArrowRight aria-hidden="true" /></a></div></details>}

          <section className="blog-share-section" aria-label="Compartilhar este artigo"><div className="blog-share-actions"><a href="/blog" onClick={event => navigate(event, '/blog')} className="blog-back-link"><ArrowLeft aria-hidden="true" />Ver todos os artigos do blog</a><div className="blog-share-buttons">{nativeShareAvailable && <button type="button" onClick={() => shareArticle(currentPost)} data-share-channel="native" className="carplus-action-secondary"><Share2 aria-hidden="true" />Compartilhar artigo</button>}<button type="button" onClick={() => copyArticle(currentPost)} data-share-channel="copy_link" className="carplus-action-secondary">{linkCopied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}{linkCopied ? 'Link copiado' : 'Copiar link do artigo'}</button></div></div><p role="status" aria-live="polite" aria-atomic="true" className="blog-share-status">{shareStatus}</p>{manualShareUrl && <div className="blog-manual-copy"><label htmlFor={`${instanceId}-manual-share`}>Link do artigo para copiar</label><input ref={manualLinkRef} id={`${instanceId}-manual-share`} type="url" readOnly value={manualShareUrl} onFocus={event => event.currentTarget.select()} /></div>}</section>

          {relatedPosts.length > 0 && <section className="blog-related-section" aria-labelledby={`${instanceId}-related`}><h2 id={`${instanceId}-related`} className="blog-section-heading">Artigos Relacionados</h2><div className="blog-post-grid blog-related-grid">{relatedPosts.map(renderPostCard)}</div></section>}
        </div>
      </article>
    );
  }

  return (
    <div id="carplus-blog-main" className="carplus-blog carplus-blog-list">
      <div className="blog-list-shell">
        <nav aria-label="Caminho da página" className="blog-breadcrumb"><a href="/" onClick={event => navigate(event, '/')}>Início</a><ChevronRight aria-hidden="true" /><span aria-current="page">Blog Automotivo</span></nav>
        <header className="blog-list-header"><div><p className="blog-eyebrow"><BookOpen aria-hidden="true" />Blog da Carplus</p><h1 className="blog-list-title">Dicas de Manutenção Automotiva em Curitiba</h1><p className="blog-list-intro">Respostas sobre pneus, alinhamento e cuidados com o carro, com a Carplus no Portão, Curitiba.</p><a href={formatWhatsApp('Olá, Carplus! Vi o Blog e gostaria de tirar uma dúvida sobre o meu carro.')} target="_blank" rel="noopener noreferrer" data-cta-location="blog-lista-topo" className="carplus-action-primary"><MessageCircle aria-hidden="true" />Tirar dúvida no WhatsApp</a></div><figure className="blog-header-photo"><img src="/images/carplus-real/alinhamento.webp" alt="Equipamento de alinhamento na roda de um veículo na unidade Carplus do Portão" width="1600" height="1068" fetchPriority="high" decoding="async" onError={realPhotoFallback} /><figcaption>Alinhamento na nossa oficina no Portão.</figcaption></figure></header>
        <section className="blog-filter-panel" aria-label="Encontrar um artigo"><div className="blog-search-field"><label htmlFor={`${instanceId}-search`}>Qual é a sua dúvida?</label><div className="blog-input-with-icon"><Search aria-hidden="true" /><input id={`${instanceId}-search`} type="search" value={searchTerm} onChange={event => setSearchTerm(event.target.value)} placeholder="Ex.: pneu desgastando, alinhamento, freios" /></div></div><div className="blog-category-field"><label htmlFor={`${instanceId}-category`}>Filtrar por assunto</label><select id={`${instanceId}-category`} value={selectedCategory} onChange={event => setSelectedCategory(event.target.value)}><option value="Todas">Todos os assuntos ({BLOG_POSTS.length})</option>{BLOG_CATEGORIES.map(category => <option key={category} value={category}>{category} ({BLOG_POSTS.filter(post => post.category === category).length})</option>)}</select></div>{(searchTerm || selectedCategory !== 'Todas') && <button type="button" onClick={() => { setSearchTerm(''); setSelectedCategory('Todas'); }} className="carplus-action-secondary">Limpar filtros</button>}</section>
        <p className="blog-results-count" role="status" aria-live="polite">{filteredPosts.length} {filteredPosts.length === 1 ? 'artigo para você' : 'artigos para você'}</p>
        {filteredPosts.length > 0 ? <div className="blog-post-grid">{filteredPosts.map(renderPostCard)}</div> : <div className="blog-empty-state"><Search aria-hidden="true" /><h2 className="blog-panel-title">Nenhum artigo encontrado</h2><p className="blog-panel-text">Tente outro termo ou veja todos os assuntos.</p><button type="button" onClick={() => { setSelectedCategory('Todas'); setSearchTerm(''); }} className="carplus-action-primary">Ver todos os artigos</button></div>}
        <section className="blog-contact-panel blog-list-contact" aria-labelledby={`${instanceId}-list-contact`}><div><p className="blog-eyebrow">Carplus · Portão, Curitiba</p><h2 id={`${instanceId}-list-contact`} className="blog-panel-title">Quer conversar sobre o seu carro?</h2><p className="blog-panel-text">Conte o que você precisa. A equipe ajuda com pneus e serviços automotivos na nossa unidade.</p></div><div className="blog-contact-actions"><a href={formatWhatsApp('Olá, Carplus! Gostaria de tirar uma dúvida ou consultar um serviço na unidade Portão.')} target="_blank" rel="noopener noreferrer" data-cta-location="blog-lista-final" className="carplus-action-primary"><MessageCircle aria-hidden="true" />Falar no WhatsApp</a><a href="/pneus" onClick={event => navigate(event, '/pneus')} className="carplus-action-secondary">Ver pneus no catálogo</a><a href="tel:+554130827282" className="blog-phone-link"><Phone aria-hidden="true" />(41) 3082-7282</a></div></section>
      </div>
    </div>
  );
};

export default BlogView;
