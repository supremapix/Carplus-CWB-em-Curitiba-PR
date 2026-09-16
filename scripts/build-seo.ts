import * as fs from 'fs';
import * as path from 'path';
import { TIRES_DATA, CAR_MODELS_DATA } from '../src/data';
import { BLOG_POSTS, BlogPost } from '../src/blog-data';
import { isPageReleased, calculateLocalScore, AROS, CARS } from '../src/utils/seoWaves';

// Helper to escape HTML attributes and text
function escapeHtml(str: string): string {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Slugify helper
function toSlug(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9_-\s]/gi, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function getTireSlug(tire: { id: string; brand: string; name?: string; width: number; aspectRatio: number; rim: number; model: string }): string {
  const brand = toSlug(tire.brand);
  const width = tire.width;
  const aspect = tire.aspectRatio;
  const rim = tire.rim;
  const model = toSlug(tire.model);

  let loadSpeed = '';
  const tireName = tire.name || `${tire.brand} ${tire.model}`;
  const loadSpeedMatch = tireName.match(/\b(\d{2,3}[A-Z])\b/i);
  if (loadSpeedMatch) {
    loadSpeed = loadSpeedMatch[1].toLowerCase();
  }

  let parts = [brand, width, aspect, rim];
  if (loadSpeed) {
    parts.push(loadSpeed);
  }
  parts.push(model);

  return parts.filter(Boolean).join('-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-');
}

const DOMAIN = "https://www.carpluscwb.com.br";
const NAP_ADDRESS = "Av. Presidente Arthur da Silva Bernardes, 1323 - Portão, Curitiba - PR, 80320-300";
const NAP_PHONE = "(41) 3082-7282";
const NAP_WHATSAPP = "554130827282";

const OFFICIAL_NEIGHBORHOODS = [
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

const NON_OFFICIAL_NEIGHBORHOODS = [
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

const METROPOLITAN_CITIES = [
  "São José dos Pinhais", "Pinhais", "Colombo", "Araucária", "Almirante Tamandaré",
  "Campo Largo", "Campo Magro", "Fazenda Rio Grande", "Quatro Barras",
  "Campina Grande do Sul", "Mandirituba", "Balsa Nova", "Rio Branco do Sul",
  "Itaperuçu", "Tijucas do Sul"
];

// Common Measures for Rim
const RIM_MEASURES: Record<number, string[]> = {
  13: ["165/70 R13", "175/70 R13", "155/80 R13"],
  14: ["175/65 R14", "175/70 R14", "185/60 R14", "185/65 R14", "185/70 R14"],
  15: ["185/60 R15", "185/65 R15", "195/55 R15", "195/60 R15", "195/65 R15", "205/60 R15"],
  16: ["205/55 R16", "205/60 R16", "215/65 R16", "195/55 R16", "205/65 R16"],
  17: ["215/50 R17", "215/55 R17", "225/45 R17", "225/50 R17", "225/65 R17", "205/55 R17"],
  18: ["225/40 R18", "225/45 R18", "235/50 R18", "235/60 R18", "265/60 R18"],
  19: ["235/55 R19", "245/45 R19", "255/50 R19", "235/40 R19"],
  20: ["245/45 R20", "255/50 R20", "265/50 R20", "275/40 R20"]
};

// Common Cars for Rim
const RIM_CARS: Record<number, string[]> = {
  13: ["Fiat Uno", "Fiat Palio", "Chevrolet Celta", "Ford Ka", "VW Gol G2/G3"],
  14: ["Fiat Palio", "Fiat Siena", "Fiat Strada", "VW Gol", "VW Voyage", "Chevrolet Corsa", "Renault Sandero", "Ford Fiesta", "Toyota Etios"],
  15: ["Fiat Argo", "Fiat Cronos", "VW Polo", "VW Fox", "VW Saveiro", "Chevrolet Onix", "Chevrolet Prisma", "Hyundai HB20", "Honda Fit", "Toyota Yaris"],
  16: ["VW Golf", "VW T-Cross", "Honda Civic", "Toyota Corolla", "Hyundai Creta", "Renault Duster", "Chevrolet Tracker", "Nissan Kicks"],
  17: ["Toyota Corolla", "Honda Civic", "VW Nivus", "VW Taos", "Jeep Compass", "Jeep Renegade", "Chevrolet Cruze", "Hyundai Creta"],
  18: ["Toyota Hilux", "Chevrolet S10", "Ford Ranger", "Jeep Compass", "VW Amarok", "Mitsubishi L200", "BMW Série 3"],
  19: ["Volvo XC60", "Audi Q5", "BMW X3", "Jeep Commander", "Toyota RAV4"],
  20: ["Toyota SW4", "Range Rover Evoque", "Porsche Macan", "BMW X5", "Audi Q7"]
};

// Sitemaps & Robots generation logic is linked directly with the prerendered routes below

// Robots Generator
function generateRobots() {
  const publicDir = path.join(process.cwd(), 'public');
  const distDir = path.join(process.cwd(), 'dist');

  const content = `User-agent: *
Allow: /

# Canonical Sitemaps Index
Sitemap: ${DOMAIN}/sitemap-index.xml
`;

  fs.writeFileSync(path.join(publicDir, 'robots.txt'), content);
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'robots.txt'), content);
  }
  console.log("robots.txt generated.");
}

// ==========================================
// Semantic HTML Generators for Each Page Type
// ==========================================

function renderHeader(): string {
  return `<header style="padding: 1rem 1.5rem; border-bottom: 2px solid #111827; background: #ffffff;">
    <nav style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
      <a href="/" style="font-weight: 900; font-size: 1.35rem; color: #111827; text-decoration: none; letter-spacing: -0.02em;">
        CARPLUS <span style="background: #f49e1a; padding: 0.15rem 0.4rem; border-radius: 4px; color: #000000; font-size: 0.85em;">PNEUS</span>
      </a>
      <div style="display: flex; align-items: center; gap: 1.25rem; flex-wrap: wrap;">
        <a href="/pneus" style="color: #1f2937; font-weight: 700; text-decoration: none; font-size: 0.95rem;">Catálogo Completo</a>
        <a href="/alinhamento-3d-curitiba" style="color: #1f2937; font-weight: 700; text-decoration: none; font-size: 0.95rem;">Alinhamento 3D</a>
        <a href="/blog" style="color: #1f2937; font-weight: 700; text-decoration: none; font-size: 0.95rem;">Blog & Dicas</a>
        <a href="/quem-somos" style="color: #1f2937; font-weight: 700; text-decoration: none; font-size: 0.95rem;">Quem Somos</a>
        <a href="/contato" style="color: #1f2937; font-weight: 700; text-decoration: none; font-size: 0.95rem;">Contato & Loja</a>
        <a href="https://wa.me/${NAP_WHATSAPP}" style="background: #25D366; color: #ffffff; padding: 0.4rem 0.85rem; border-radius: 9999px; font-weight: 800; font-size: 0.85rem; text-decoration: none; display: inline-flex; align-items: center; gap: 0.35rem;">
          WhatsApp: (41) 3082-7282
        </a>
      </div>
    </nav>
  </header>`;
}

function renderNapBlock(customTitle?: string): string {
  return `<section style="background: #111827; color: #ffffff; border-radius: 1rem; padding: 1.75rem; margin: 2.5rem 0 1.5rem 0; border: 2px solid #f49e1a;">
    <h2 style="font-size: 1.25rem; font-weight: 900; color: #f49e1a; margin-bottom: 0.75rem; text-transform: uppercase;">
      ${escapeHtml(customTitle || "Carplus Pneus Auto Center • Loja Física no Portão")}
    </h2>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem; font-size: 0.95rem; color: #e5e7eb; line-height: 1.5;">
      <div>
        <p style="margin: 0 0 0.5rem 0;"><strong>📍 Endereço Oficial:</strong></p>
        <p style="margin: 0; color: #cbd5e1;">${NAP_ADDRESS}</p>
        <p style="margin: 0.35rem 0 0 0; font-size: 0.85rem; color: #94a3b8;">Em frente ao tubo de ônibus, fácil acesso pelas vias rápidas de Curitiba.</p>
      </div>
      <div>
        <p style="margin: 0 0 0.5rem 0;"><strong>📞 Atendimento & Agendamento:</strong></p>
        <p style="margin: 0; color: #cbd5e1;">Telefone / WhatsApp: <strong>${NAP_PHONE}</strong></p>
        <p style="margin: 0.35rem 0 0 0; font-size: 0.85rem; color: #94a3b8;">Horário: Segunda a Sexta das 08h às 18h | Sábado das 08h às 12h.</p>
      </div>
      <div>
        <p style="margin: 0 0 0.5rem 0;"><strong>🛠️ Serviços Disponíveis no Box:</strong></p>
        <p style="margin: 0; color: #cbd5e1;">Montagem computadorizada grátis, válvulas novas, balanceamento, alinhamento 3D a laser, freios, suspensão e amortecedores.</p>
      </div>
    </div>
    <div style="margin-top: 1.25rem; display: flex; gap: 0.75rem; flex-wrap: wrap;">
      <a href="https://wa.me/${NAP_WHATSAPP}?text=Ola,%20gostaria%20de%20solicitar%20um%20orcamento%20de%20pneus%20e%20servicos" style="background: #f49e1a; color: #000000; padding: 0.65rem 1.25rem; border-radius: 0.5rem; font-weight: 800; text-decoration: none; font-size: 0.95rem; display: inline-block;">
        Falar com Especialista no WhatsApp
      </a>
      <a href="/contato" style="background: transparent; color: #ffffff; border: 1px solid #ffffff; padding: 0.65rem 1.25rem; border-radius: 0.5rem; font-weight: 700; text-decoration: none; font-size: 0.95rem; display: inline-block;">
        Ver Mapa e Rotas de Acesso
      </a>
    </div>
  </section>`;
}

function renderFooter(): string {
  return `<footer style="background: #0b0f19; color: #9ca3af; padding: 3rem 1.5rem 2rem 1.5rem; border-top: 1px solid #1f2937; font-size: 0.875rem;">
    <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
      <div>
        <p style="font-size: 1.1rem; font-weight: 900; color: #ffffff; margin-bottom: 0.75rem;">CARPLUS PNEUS</p>
        <p style="line-height: 1.5; margin-bottom: 0.5rem;">Sua loja de pneus novos e centro automotivo de confiança no Portão em Curitiba. Pneus multimarcas com garantia de 5 anos de fábrica e montagem inclusa.</p>
      </div>
      <div>
        <p style="font-size: 0.95rem; font-weight: 800; color: #ffffff; margin-bottom: 0.75rem; text-transform: uppercase;">Pneus por Aro</p>
        <div style="display: flex; flex-direction: column; gap: 0.35rem;">
          <a href="/aro/13" style="color: #9ca3af; text-decoration: none;">Pneus Aro 13</a>
          <a href="/aro/14" style="color: #9ca3af; text-decoration: none;">Pneus Aro 14</a>
          <a href="/aro/15" style="color: #9ca3af; text-decoration: none;">Pneus Aro 15</a>
          <a href="/aro/16" style="color: #9ca3af; text-decoration: none;">Pneus Aro 16</a>
          <a href="/aro/17" style="color: #9ca3af; text-decoration: none;">Pneus Aro 17</a>
          <a href="/aro/18" style="color: #9ca3af; text-decoration: none;">Pneus Aro 18</a>
        </div>
      </div>
      <div>
        <p style="font-size: 0.95rem; font-weight: 800; color: #ffffff; margin-bottom: 0.75rem; text-transform: uppercase;">Serviços Técnicos</p>
        <div style="display: flex; flex-direction: column; gap: 0.35rem;">
          <a href="/alinhamento-3d-curitiba" style="color: #9ca3af; text-decoration: none;">Alinhamento 3D Computadorizado</a>
          <a href="/troca-de-pneus-curitiba" style="color: #9ca3af; text-decoration: none;">Troca de Pneus Expressa</a>
          <a href="/auto-center-curitiba" style="color: #9ca3af; text-decoration: none;">Auto Center e Oficina Mecânica</a>
          <a href="/pneus-pirelli-curitiba" style="color: #9ca3af; text-decoration: none;">Pneus Pirelli em Curitiba</a>
          <a href="/xbri-pneus-curitiba" style="color: #9ca3af; text-decoration: none;">Pneus Xbri em Curitiba</a>
        </div>
      </div>
      <div>
        <p style="font-size: 0.95rem; font-weight: 800; color: #ffffff; margin-bottom: 0.75rem; text-transform: uppercase;">Institucional</p>
        <div style="display: flex; flex-direction: column; gap: 0.35rem;">
          <a href="/quem-somos" style="color: #9ca3af; text-decoration: none;">Quem Somos</a>
          <a href="/contato" style="color: #9ca3af; text-decoration: none;">Fale Conosco e Endereço</a>
          <a href="/mapa-do-site" style="color: #9ca3af; text-decoration: none;">Mapa do Site</a>
          <a href="/politica-privacidades" style="color: #9ca3af; text-decoration: none;">Privacidade de Dados</a>
          <a href="/politica-devolucao" style="color: #9ca3af; text-decoration: none;">Garantia e Devoluções</a>
        </div>
      </div>
    </div>
    <div style="max-width: 1200px; margin: 0 auto; padding-top: 1.5rem; border-top: 1px solid #1f2937; text-align: center; font-size: 0.8rem; color: #6b7280;">
      © ${new Date().getFullYear()} Carplus Pneus & Auto Center. Todos os direitos reservados. CNPJ ativo. ${NAP_ADDRESS}.
    </div>
  </footer>`;
}

// Blog Article Pre-Renderer
function renderBlogArticleShell(post: BlogPost): string {
  let contentHtml = '';

  // Breadcrumbs
  contentHtml += `<nav style="font-size: 0.85rem; color: #6b7280; margin-bottom: 1.25rem;">
    <a href="/" style="color: #4b5563; text-decoration: none;">Início</a> &gt; 
    <a href="/blog" style="color: #4b5563; text-decoration: none;">Blog Automotivo</a> &gt; 
    <span style="color: #111827; font-weight: 600;">${escapeHtml(post.title)}</span>
  </nav>`;

  // Article Header
  contentHtml += `<header style="margin-bottom: 2rem;">
    <div style="display: inline-block; background: #fef3c7; color: #92400e; font-size: 0.8rem; font-weight: 800; text-transform: uppercase; padding: 0.25rem 0.65rem; border-radius: 9999px; margin-bottom: 0.75rem;">
      ${escapeHtml(post.category)}
    </div>
    <h1 style="font-size: 2.15rem; font-weight: 900; color: #111827; line-height: 1.2; margin-bottom: 1rem; letter-spacing: -0.02em;">
      ${escapeHtml(post.h1 || post.title)}
    </h1>
    <div style="display: flex; gap: 1.5rem; font-size: 0.875rem; color: #6b7280; flex-wrap: wrap; border-bottom: 1px solid #e5e7eb; padding-bottom: 1rem;">
      <span>📅 Publicado em: <strong>${escapeHtml(post.publishedDate)}</strong></span>
      <span>⏱️ Tempo de leitura: <strong>${escapeHtml(post.readingTime)}</strong></span>
      <span>✍️ Autor: <strong>Equipe Técnica Carplus Pneus</strong></span>
    </div>
  </header>`;

  // Intro
  contentHtml += `<div style="font-size: 1.15rem; line-height: 1.7; color: #374151; font-weight: 500; margin-bottom: 2rem; background: #f9fafb; padding: 1.25rem; border-left: 4px solid #f49e1a; border-radius: 0 0.5rem 0.5rem 0;">
    ${escapeHtml(post.intro)}
  </div>`;

  // Sections
  post.sections.forEach(sec => {
    if (sec.title) {
      contentHtml += `<h2 style="font-size: 1.45rem; font-weight: 800; color: #111827; margin: 2rem 0 0.75rem 0;">${escapeHtml(sec.title)}</h2>`;
    }
    sec.paragraphs.forEach(p => {
      contentHtml += `<p style="font-size: 1.05rem; line-height: 1.75; color: #4b5563; margin-bottom: 1rem;">${escapeHtml(p)}</p>`;
    });
    if (sec.listItems && sec.listItems.length > 0) {
      contentHtml += `<ul style="margin: 1rem 0 1.5rem 1.5rem; font-size: 1.05rem; color: #4b5563; line-height: 1.7;">`;
      sec.listItems.forEach(item => {
        contentHtml += `<li style="margin-bottom: 0.5rem;">${escapeHtml(item)}</li>`;
      });
      contentHtml += `</ul>`;
    }
    if (sec.callout) {
      const bg = sec.callout.type === 'warning' ? '#fef2f2' : sec.callout.type === 'tip' ? '#f0fdf4' : '#eff6ff';
      const border = sec.callout.type === 'warning' ? '#ef4444' : sec.callout.type === 'tip' ? '#22c55e' : '#3b82f6';
      const textCol = sec.callout.type === 'warning' ? '#991b1b' : sec.callout.type === 'tip' ? '#166534' : '#1e40af';
      contentHtml += `<div style="background: ${bg}; border-left: 4px solid ${border}; padding: 1.25rem; border-radius: 0 0.5rem 0.5rem 0; margin: 1.5rem 0;">
        <strong style="display: block; color: ${textCol}; font-size: 1rem; margin-bottom: 0.35rem;">💡 ${escapeHtml(sec.callout.title)}</strong>
        <p style="margin: 0; color: #374151; font-size: 0.95rem; line-height: 1.6;">${escapeHtml(sec.callout.text)}</p>
      </div>`;
    }
    if (sec.internalLinks && sec.internalLinks.length > 0) {
      contentHtml += `<div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.5rem; padding: 1rem; margin: 1.5rem 0;">
        <strong style="font-size: 0.9rem; text-transform: uppercase; color: #0f172a; display: block; margin-bottom: 0.5rem;">🔗 Páginas Recomendadas:</strong>
        <div style="display: flex; flex-direction: column; gap: 0.35rem;">`;
      sec.internalLinks.forEach(link => {
        contentHtml += `<a href="${escapeHtml(link.url)}" style="color: #2563eb; font-weight: 700; text-decoration: underline; font-size: 0.95rem;">${escapeHtml(link.text)}</a>`;
      });
      contentHtml += `</div></div>`;
    }
  });

  // FAQs
  if (post.faqs && post.faqs.length > 0) {
    contentHtml += `<section style="margin: 3rem 0 2rem 0; background: #f9fafb; border-radius: 1rem; padding: 1.75rem; border: 1px solid #e5e7eb;">
      <h2 style="font-size: 1.4rem; font-weight: 800; color: #111827; margin-bottom: 1.25rem;">Perguntas Frequentes sobre ${escapeHtml(post.title)}</h2>`;
    post.faqs.forEach(faq => {
      contentHtml += `<div style="margin-bottom: 1.25rem;">
        <h3 style="font-size: 1.05rem; font-weight: 700; color: #1f2937; margin-bottom: 0.35rem;">❓ ${escapeHtml(faq.question)}</h3>
        <p style="font-size: 0.95rem; color: #4b5563; line-height: 1.6; margin: 0;">${escapeHtml(faq.answer)}</p>
      </div>`;
    });
    contentHtml += `</section>`;
  }

  // CTA Block
  contentHtml += renderNapBlock(`Agende sua Revisão ou Troca de Pneus na Carplus`);

  return `<div id="root">
    ${renderHeader()}
    <main style="max-width: 900px; margin: 2.5rem auto; padding: 0 1.25rem; font-family: system-ui, -apple-system, sans-serif;">
      ${contentHtml}
    </main>
    ${renderFooter()}
  </div>`;
}

// Product Pre-Renderer
function renderProductShell(tire: typeof TIRES_DATA[0], slug: string): string {
  const price = tire.promoPrice || tire.price;
  const formattedPrice = `R$ ${price},00`;

  let html = `<nav style="font-size: 0.85rem; color: #6b7280; margin-bottom: 1.25rem;">
    <a href="/" style="color: #4b5563; text-decoration: none;">Início</a> &gt; 
    <a href="/pneus" style="color: #4b5563; text-decoration: none;">Catálogo de Pneus</a> &gt; 
    <a href="/aro/${tire.rim}" style="color: #4b5563; text-decoration: none;">Aro ${tire.rim}</a> &gt; 
    <span style="color: #111827; font-weight: 600;">${escapeHtml(tire.brand)} ${escapeHtml(tire.model)}</span>
  </nav>`;

  html += `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2.5rem; margin-bottom: 3rem; align-items: start;">
    <div style="background: #ffffff; border: 2px solid #e5e7eb; border-radius: 1rem; padding: 2rem; text-align: center;">
      <img src="${escapeHtml(tire.image)}" alt="Pneu ${escapeHtml(tire.brand)} ${escapeHtml(tire.model)} ${tire.width}/${tire.aspectRatio} R${tire.rim}" style="max-height: 340px; max-width: 100%; object-contain: contain; margin: 0 auto;" />
      <div style="margin-top: 1rem; display: inline-block; background: #ecfdf5; color: #065f46; font-size: 0.85rem; font-weight: 800; padding: 0.35rem 0.85rem; border-radius: 9999px;">
        ✓ Em Estoque à Pronta Entrega no Portão
      </div>
    </div>
    <div>
      <div style="font-size: 0.85rem; font-weight: 800; color: #f49e1a; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.35rem;">
        Marca Oficial: ${escapeHtml(tire.brand)}
      </div>
      <h1 style="font-size: 2rem; font-weight: 900; color: #111827; line-height: 1.2; margin-bottom: 1rem;">
        Pneu ${escapeHtml(tire.brand)} ${escapeHtml(tire.model)} ${tire.width}/${tire.aspectRatio} R${tire.rim}
      </h1>
      
      <div style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 0.75rem; padding: 1.25rem; margin-bottom: 1.5rem;">
        <div style="font-size: 0.85rem; color: #64748b; text-transform: uppercase; font-weight: 700;">Preço Promocional à Vista no PIX</div>
        <div style="font-size: 2.25rem; font-weight: 900; color: #15803d; margin: 0.25rem 0;">${formattedPrice}</div>
        <div style="font-size: 0.9rem; color: #475569;">Ou parcele em até <strong>10x sem juros</strong> no cartão de crédito na loja.</div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 0.65rem; margin-bottom: 1.75rem; font-size: 0.95rem; color: #334155;">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span style="color: #16a34a; font-weight: 900;">✓</span> <strong>Montagem Técnica Grátis:</strong> Feita na hora em nosso Auto Center Portão.
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span style="color: #16a34a; font-weight: 900;">✓</span> <strong>Válvulas / Bicos Novos Grátis:</strong> Substituição preventiva inclusa.
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span style="color: #16a34a; font-weight: 900;">✓</span> <strong>Garantia de 5 Anos:</strong> Garantia oficial de fábrica contra defeitos.
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span style="color: #16a34a; font-weight: 900;">✓</span> <strong>Pagamento Seguro:</strong> Pague apenas após a instalação no veículo.
        </div>
      </div>

      <a href="https://wa.me/${NAP_WHATSAPP}?text=Ola,%20quero%20reservar%20o%20Pneu%20${encodeURIComponent(tire.brand)}%20${encodeURIComponent(tire.model)}%20${tire.width}/${tire.aspectRatio}%20R${tire.rim}" style="background: #25D366; color: #ffffff; padding: 0.85rem 1.75rem; border-radius: 0.5rem; font-weight: 900; font-size: 1.1rem; text-decoration: none; display: block; text-align: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
        Reservar Este Pneu pelo WhatsApp
      </a>
    </div>
  </div>`;

  // Technical Specs Table
  html += `<section style="margin-bottom: 2.5rem;">
    <h2 style="font-size: 1.4rem; font-weight: 800; color: #111827; margin-bottom: 1rem; border-bottom: 2px solid #f49e1a; padding-bottom: 0.5rem;">
      Ficha Técnica Detalhada do Pneu
    </h2>
    <table style="width: 100%; border-collapse: collapse; font-size: 0.95rem; text-align: left;">
      <tbody>
        <tr style="border-bottom: 1px solid #e5e7eb; background: #f9fafb;">
          <td style="padding: 0.75rem 1rem; font-weight: 700; color: #374151; width: 40%;">Marca Fabricante</td>
          <td style="padding: 0.75rem 1rem; color: #111827;">${escapeHtml(tire.brand)}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 0.75rem 1rem; font-weight: 700; color: #374151;">Modelo do Desenho</td>
          <td style="padding: 0.75rem 1rem; color: #111827;">${escapeHtml(tire.model)}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb; background: #f9fafb;">
          <td style="padding: 0.75rem 1rem; font-weight: 700; color: #374151;">Dimensão / Medida</td>
          <td style="padding: 0.75rem 1rem; color: #111827;">${tire.width}/${tire.aspectRatio} R${tire.rim}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 0.75rem 1rem; font-weight: 700; color: #374151;">Largura da Banda</td>
          <td style="padding: 0.75rem 1rem; color: #111827;">${tire.width} mm</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb; background: #f9fafb;">
          <td style="padding: 0.75rem 1rem; font-weight: 700; color: #374151;">Perfil / Altura</td>
          <td style="padding: 0.75rem 1rem; color: #111827;">${tire.aspectRatio}% da largura</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 0.75rem 1rem; font-weight: 700; color: #374151;">Diâmetro da Roda (Aro)</td>
          <td style="padding: 0.75rem 1rem; color: #111827;">Aro ${tire.rim} polegadas</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb; background: #f9fafb;">
          <td style="padding: 0.75rem 1rem; font-weight: 700; color: #374151;">Instalação e Montagem</td>
          <td style="padding: 0.75rem 1rem; color: #15803d; font-weight: 700;">Gratuita na Loja Carplus Portão</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 0.75rem 1rem; font-weight: 700; color: #374151;">Garantia</td>
          <td style="padding: 0.75rem 1rem; color: #111827;">5 anos contra defeitos de fabricação</td>
        </tr>
      </tbody>
    </table>
  </section>`;

  // Description & Local Guide
  html += `<section style="margin-bottom: 2.5rem; line-height: 1.7; color: #4b5563;">
    <h2 style="font-size: 1.35rem; font-weight: 800; color: #111827; margin-bottom: 0.75rem;">
      Sobre o Pneu ${escapeHtml(tire.brand)} ${escapeHtml(tire.model)} ${tire.width}/${tire.aspectRatio} R${tire.rim}
    </h2>
    <p>O pneu <strong>${escapeHtml(tire.brand)} ${escapeHtml(tire.model)}</strong> na medida <strong>${tire.width}/${tire.aspectRatio} R${tire.rim}</strong> é uma excelente opção para motoristas que exigem máxima segurança, alta durabilidade e frenagem precisa no asfalto seco e molhado de Curitiba e Região Metropolitana.</p>
    <p>Projetado com compostos modernos de borracha e ranhuras otimizadas para drenagem de água, este modelo previne aquaplanagens em dias de chuva e garante rodar silencioso e econômico para o seu veículo.</p>
  </section>`;

  html += renderNapBlock(`Instale o Pneu ${escapeHtml(tire.brand)} ${tire.width}/${tire.aspectRatio} R${tire.rim} no Portão`);

  return `<div id="root">
    ${renderHeader()}
    <main style="max-width: 1000px; margin: 2.5rem auto; padding: 0 1.25rem; font-family: system-ui, -apple-system, sans-serif;">
      ${html}
    </main>
    ${renderFooter()}
  </div>`;
}

// Car Model Pre-Renderer
function renderCarShell(carName: string): string {
  const carClean = toSlug(carName).replace(/^(fiat|volkswagen|vw|chevrolet|gm|hyundai|ford|renault|toyota|honda|byd|gwm|jeep|nissan|peugeot|citroen)-/, '');
  const matchedCar = CAR_MODELS_DATA.find(c => {
    const slug1 = toSlug(c.name);
    const slug2 = toSlug(`${c.brand} ${c.name}`);
    return slug1 === toSlug(carName) || slug2 === toSlug(carName) || slug1.includes(carClean) || toSlug(carName).includes(slug1);
  });
  const measure = matchedCar ? matchedCar.recommendedTireRatio.replace(/\/(\d{2})$/, ' R$1') : 'consulte a medida original';
  
  let html = `<nav style="font-size: 0.85rem; color: #6b7280; margin-bottom: 1.25rem;">
    <a href="/" style="color: #4b5563; text-decoration: none;">Início</a> &gt; 
    <a href="/pneus" style="color: #4b5563; text-decoration: none;">Catálogo de Pneus</a> &gt; 
    <span style="color: #111827; font-weight: 600;">Pneus para ${escapeHtml(carName)}</span>
  </nav>`;

  html += `<header style="margin-bottom: 2rem;">
    <div style="display: inline-block; background: #eff6ff; color: #1e40af; font-size: 0.8rem; font-weight: 800; text-transform: uppercase; padding: 0.25rem 0.65rem; border-radius: 9999px; margin-bottom: 0.75rem;">
      Guia de Aplicação Oficial de Pneus
    </div>
    <h1 style="font-size: 2.15rem; font-weight: 900; color: #111827; line-height: 1.2; margin-bottom: 1rem;">
      Pneus para ${escapeHtml(carName)} em Curitiba | Medida Original e Troca
    </h1>
    <p style="font-size: 1.1rem; line-height: 1.6; color: #4b5563;">
      Confira as medidas homologadas de fábrica para o <strong>${escapeHtml(carName)}</strong>, opções de marcas nacionais e importadas em estoque e faça sua instalação técnica com montagem grátis no Portão.
    </p>
  </header>`;

  html += `<div style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 1rem; padding: 1.5rem; margin-bottom: 2rem;">
    <h2 style="font-size: 1.25rem; font-weight: 800; color: #0f172a; margin-bottom: 0.75rem;">
      📋 Medida Homologada Recomendada para ${escapeHtml(carName)}
    </h2>
    <p style="font-size: 1rem; color: #334155; margin-bottom: 1rem;">
      A medida mais comum equipada no ${escapeHtml(carName)} é: <strong style="font-size: 1.2rem; color: #b45309; background: #fef3c7; padding: 0.2rem 0.6rem; border-radius: 4px;">${escapeHtml(measure)}</strong>.
    </p>
    <div style="font-size: 0.95rem; color: #475569; line-height: 1.6;">
      <p style="margin: 0.25rem 0;">• <strong>Calibragem recomendada:</strong> 30 a 32 PSI para uso urbano; 32 a 35 PSI com veículo carregado ou viagens em rodovias.</p>
      <p style="margin: 0.25rem 0;">• <strong>Rodízio Preventivo:</strong> Faça o rodízio dos pneus a cada 10.000 km junto com o alinhamento 3D para prolongar a vida útil.</p>
      <p style="margin: 0.25rem 0;">• <strong>Importância da Geometria 3D:</strong> O asfalto e lombadas de Curitiba exigem alinhamento periódico para evitar desgaste irregular nas bordas.</p>
    </div>
  </div>`;

  html += `<section style="margin-bottom: 2.5rem;">
    <h2 style="font-size: 1.35rem; font-weight: 800; color: #111827; margin-bottom: 1rem;">
      Marcas em Destaque para ${escapeHtml(carName)} na Carplus Portão
    </h2>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem;">
      <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 1.25rem;">
        <h3 style="font-size: 1.1rem; font-weight: 800; color: #111827; margin-bottom: 0.35rem;">Pirelli / Cinturato</h3>
        <p style="font-size: 0.9rem; color: #6b7280; margin-bottom: 0.75rem;">Homologação original com alto índice de aderência e durabilidade.</p>
        <span style="font-size: 0.85rem; font-weight: 700; color: #15803d;">Montagem e bico inclusos</span>
      </div>
      <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 1.25rem;">
        <h3 style="font-size: 1.1rem; font-weight: 800; color: #111827; margin-bottom: 0.35rem;">Bridgestone / Firestone</h3>
        <p style="font-size: 0.9rem; color: #6b7280; margin-bottom: 0.75rem;">Tecnologia japonesa com excelente absorção de impactos e maciez.</p>
        <span style="font-size: 0.85rem; font-weight: 700; color: #15803d;">Montagem e bico inclusos</span>
      </div>
      <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 1.25rem;">
        <h3 style="font-size: 1.1rem; font-weight: 800; color: #111827; margin-bottom: 0.35rem;">Xbri / Linha Econômica</h3>
        <p style="font-size: 0.9rem; color: #6b7280; margin-bottom: 0.75rem;">O melhor custo por quilômetro rodado para frotistas e motoristas de aplicativo.</p>
        <span style="font-size: 0.85rem; font-weight: 700; color: #15803d;">Montagem e bico inclusos</span>
      </div>
    </div>
  </section>`;

  html += renderNapBlock(`Troque os Pneus do seu ${escapeHtml(carName)} na Carplus Portão`);

  return `<div id="root">
    ${renderHeader()}
    <main style="max-width: 1000px; margin: 2.5rem auto; padding: 0 1.25rem; font-family: system-ui, -apple-system, sans-serif;">
      ${html}
    </main>
    ${renderFooter()}
  </div>`;
}

// Aro Pre-Renderer
function renderAroShell(aroNum: number): string {
  const commonMeasures = RIM_MEASURES[aroNum] || ["Consulte nossas medidas"];
  const compatibleCars = RIM_CARS[aroNum] || ["Diversos modelos nacionais e importados"];

  let html = `<nav style="font-size: 0.85rem; color: #6b7280; margin-bottom: 1.25rem;">
    <a href="/" style="color: #4b5563; text-decoration: none;">Início</a> &gt; 
    <a href="/pneus" style="color: #4b5563; text-decoration: none;">Catálogo de Pneus</a> &gt; 
    <span style="color: #111827; font-weight: 600;">Pneus Aro ${aroNum}</span>
  </nav>`;

  html += `<header style="margin-bottom: 2rem;">
    <div style="display: inline-block; background: #fef3c7; color: #92400e; font-size: 0.8rem; font-weight: 800; text-transform: uppercase; padding: 0.25rem 0.65rem; border-radius: 9999px; margin-bottom: 0.75rem;">
      Catálogo Especializado por Diâmetro
    </div>
    <h1 style="font-size: 2.15rem; font-weight: 900; color: #111827; line-height: 1.2; margin-bottom: 1rem;">
      Pneus Aro ${aroNum} em Curitiba | Preços, Medidas e Instalação Grátis
    </h1>
    <p style="font-size: 1.1rem; line-height: 1.6; color: #4b5563;">
      Encontre a linha completa de <strong>Pneus Aro ${aroNum}</strong> em Curitiba na Carplus Portão. Pneus novos com nota fiscal, 5 anos de garantia de fábrica, montagem computadorizada e bicos de borracha inclusos.
    </p>
  </header>`;

  html += `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2.5rem;">
    <div style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 0.75rem; padding: 1.5rem;">
      <h2 style="font-size: 1.2rem; font-weight: 800; color: #0f172a; margin-bottom: 0.75rem;">
        📏 Medidas Populares no Aro ${aroNum}
      </h2>
      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
        ${commonMeasures.map(m => `<span style="background: #ffffff; border: 1px solid #cbd5e1; padding: 0.4rem 0.75rem; border-radius: 0.375rem; font-weight: 700; color: #1e293b; font-size: 0.95rem;">${escapeHtml(m)}</span>`).join('')}
      </div>
    </div>
    <div style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 0.75rem; padding: 1.5rem;">
      <h2 style="font-size: 1.2rem; font-weight: 800; color: #0f172a; margin-bottom: 0.75rem;">
        🚗 Veículos que Utilizam Aro ${aroNum}
      </h2>
      <p style="font-size: 0.95rem; color: #475569; line-height: 1.5;">
        ${compatibleCars.join(', ')}.
      </p>
    </div>
  </div>`;

  html += `<section style="margin-bottom: 2.5rem;">
    <h2 style="font-size: 1.35rem; font-weight: 800; color: #111827; margin-bottom: 1rem;">
      Vantagens de Comprar Pneus Aro ${aroNum} na Carplus Portão
    </h2>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; color: #374151; font-size: 0.95rem;">
      <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 1rem;">
        <strong style="display: block; color: #111827; margin-bottom: 0.25rem;">🔧 Montagem sem Custos Adicionais</strong>
        Troca de pneus rápida e profissional com máquinas modernas que não riscam suas rodas.
      </div>
      <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 1rem;">
        <strong style="display: block; color: #111827; margin-bottom: 0.25rem;">🎯 Geometria e Alinhamento 3D</strong>
        Ajuste milimétrico a laser de cambagem e convergência para evitar desgaste prematuro.
      </div>
      <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 1rem;">
        <strong style="display: block; color: #111827; margin-bottom: 0.25rem;">💳 Parcelamento em até 10x</strong>
        Facilidade no pagamento e valores transparentes sem taxas surpresa no balcão.
      </div>
    </div>
  </section>`;

  html += renderNapBlock(`Compre e Instale Pneus Aro ${aroNum} em Curitiba`);

  return `<div id="root">
    ${renderHeader()}
    <main style="max-width: 1000px; margin: 2.5rem auto; padding: 0 1.25rem; font-family: system-ui, -apple-system, sans-serif;">
      ${html}
    </main>
    ${renderFooter()}
  </div>`;
}

// Bairro Pre-Renderer
function renderBairroShell(bairroName: string): string {
  return `<div id="root">
    ${renderHeader()}
    <main style="max-width: 1000px; margin: 2.5rem auto; padding: 0 1.25rem; font-family: system-ui, -apple-system, sans-serif;">
      <nav style="font-size: 0.85rem; color: #6b7280; margin-bottom: 1.25rem;">
        <a href="/" style="color: #4b5563; text-decoration: none;">Início</a> &gt; 
        <a href="/curitiba" style="color: #4b5563; text-decoration: none;">Bairros de Curitiba</a> &gt; 
        <span style="color: #111827; font-weight: 600;">Pneus no ${escapeHtml(bairroName)}</span>
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="display: inline-block; background: #fef3c7; color: #92400e; font-size: 0.8rem; font-weight: 800; text-transform: uppercase; padding: 0.25rem 0.65rem; border-radius: 9999px; margin-bottom: 0.75rem;">
          Atendimento Regional Curitiba
        </div>
        <h1 style="font-size: 2.15rem; font-weight: 900; color: #111827; line-height: 1.2; margin-bottom: 1rem;">
          Pneus e Oficina Mecânica no Bairro ${escapeHtml(bairroName)} - Curitiba | Carplus
        </h1>
        <p style="font-size: 1.1rem; line-height: 1.6; color: #4b5563;">
          Atendimento especializado para motoristas, famílias e empresas do bairro <strong>${escapeHtml(bairroName)}</strong> em Curitiba. Nossa loja e oficina mecânica fica localizada no <strong>Portão (Av. Presidente Arthur Bernardes, 1323)</strong>, proporcionando fácil acesso e instalação técnica imediata.
        </p>
      </header>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2.5rem;">
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 1.5rem;">
          <h2 style="font-size: 1.15rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem;">🚗 Pneus Novos com Montagem Inclusa</h2>
          <p style="font-size: 0.95rem; color: #475569; line-height: 1.5;">Linha completa de pneus Pirelli, Goodyear, Bridgestone, Continental e marcas importadas com 5 anos de garantia de fábrica.</p>
        </div>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 1.5rem;">
          <h2 style="font-size: 1.15rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem;">📐 Alinhamento 3D e Balanceamento</h2>
          <p style="font-size: 0.95rem; color: #475569; line-height: 1.5;">Tecnologia tridimensional a laser para calibrar com exatidão a geometria da suspensão do seu carro, prevenindo desgastes laterais.</p>
        </div>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 1.5rem;">
          <h2 style="font-size: 1.15rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem;">⚙️ Mecânica Rápida e Freios</h2>
          <p style="font-size: 0.95rem; color: #475569; line-height: 1.5;">Revisão completa de pastilhas, discos, amortecedores, pivôs e buchas com diagnóstico transparente antes de qualquer serviço.</p>
        </div>
      </div>

      ${renderNapBlock(`Loja Carplus Pneus • Atendimento ao Bairro ${escapeHtml(bairroName)}`)}
    </main>
    ${renderFooter()}
  </div>`;
}

// Cidade Pre-Renderer
function renderCidadeShell(cidadeName: string): string {
  return `<div id="root">
    ${renderHeader()}
    <main style="max-width: 1000px; margin: 2.5rem auto; padding: 0 1.25rem; font-family: system-ui, -apple-system, sans-serif;">
      <nav style="font-size: 0.85rem; color: #6b7280; margin-bottom: 1.25rem;">
        <a href="/" style="color: #4b5563; text-decoration: none;">Início</a> &gt; 
        <a href="/regiao-metropolitana" style="color: #4b5563; text-decoration: none;">Região Metropolitana</a> &gt; 
        <span style="color: #111827; font-weight: 600;">Pneus em ${escapeHtml(cidadeName)}</span>
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="display: inline-block; background: #eff6ff; color: #1e40af; font-size: 0.8rem; font-weight: 800; text-transform: uppercase; padding: 0.25rem 0.65rem; border-radius: 9999px; margin-bottom: 0.75rem;">
          Região Metropolitana de Curitiba
        </div>
        <h1 style="font-size: 2.15rem; font-weight: 900; color: #111827; line-height: 1.2; margin-bottom: 1rem;">
          Pneus e Auto Center para ${escapeHtml(cidadeName)} - Região Metropolitana | Carplus
        </h1>
        <p style="font-size: 1.1rem; line-height: 1.6; color: #4b5563;">
          Abastecimento ágil de pneus novos com preços de atacado e varejo para motoristas, frotistas e empresas de <strong>${escapeHtml(cidadeName)}</strong>. Faça sua reserva online e execute a montagem técnica e alinhamento 3D no Auto Center Portão.
        </p>
      </header>

      <div style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 0.75rem; padding: 1.5rem; margin-bottom: 2rem; line-height: 1.6; color: #334155;">
        <h2 style="font-size: 1.25rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem;">Vantagens para Clientes de ${escapeHtml(cidadeName)}</h2>
        <p>• Pneus à pronta entrega com montagem imediata sem fila de espera;</p>
        <p>• Parcelamento em até 10x sem juros no cartão de crédito;</p>
        <p>• Garantia formal de 5 anos de fábrica contra defeitos de fabricação;</p>
        <p>• Localização estratégica no Portão com acesso facilitado pela Linha Verde e vias rápidas.</p>
      </div>

      ${renderNapBlock(`Atendimento a ${escapeHtml(cidadeName)} no Auto Center Portão`)}
    </main>
    ${renderFooter()}
  </div>`;
}

// Service & High-Intent Pre-Renderer
function renderServiceShell(title: string, desc: string): string {
  return `<div id="root">
    ${renderHeader()}
    <main style="max-width: 1000px; margin: 2.5rem auto; padding: 0 1.25rem; font-family: system-ui, -apple-system, sans-serif;">
      <header style="margin-bottom: 2rem;">
        <h1 style="font-size: 2.15rem; font-weight: 900; color: #111827; line-height: 1.2; margin-bottom: 1rem;">
          ${escapeHtml(title)}
        </h1>
        <p style="font-size: 1.1rem; line-height: 1.6; color: #4b5563;">
          ${escapeHtml(desc)}
        </p>
      </header>

      <section style="margin-bottom: 2.5rem; line-height: 1.7; color: #374151;">
        <h2 style="font-size: 1.35rem; font-weight: 800; color: #111827; margin-bottom: 0.75rem;">
          Diferenciais e Estrutura Técnica da Carplus Pneus
        </h2>
        <p>A Carplus Pneus conta com rampa de alinhamento 3D computadorizada, balanceadoras dinâmicas de alta precisão e desmontadoras automáticas que preservam a integridade das rodas de liga leve e de ferro.</p>
        <p>Trabalhamos com estoque próprio das maiores marcas mundiais e importadas homologadas pelo INMETRO, garantindo durabilidade, economia de combustível e segurança para as ruas e rodovias do Paraná.</p>
      </section>

      ${renderNapBlock()}
    </main>
    ${renderFooter()}
  </div>`;
}

// Home Page Pre-Renderer
function renderHomeShell(): string {
  return `<div id="root">
    ${renderHeader()}
    <main style="max-width: 1200px; margin: 2rem auto; padding: 0 1.25rem; font-family: system-ui, -apple-system, sans-serif;">
      <section style="text-align: center; padding: 2.5rem 1rem; background: linear-gradient(135deg, #111827 0%, #1f2937 100%); color: #ffffff; border-radius: 1.5rem; margin-bottom: 2.5rem; border: 2px solid #f49e1a;">
        <div style="display: inline-block; background: #f49e1a; color: #000000; font-weight: 900; font-size: 0.85rem; text-transform: uppercase; padding: 0.35rem 0.85rem; border-radius: 9999px; margin-bottom: 1rem;">
          Loja Oficial & Centro Automotivo no Portão
        </div>
        <h1 style="font-size: 2.5rem; font-weight: 900; line-height: 1.15; margin-bottom: 1rem; letter-spacing: -0.02em;">
          Pneus Novos com Montagem Grátis e Alinhamento 3D em Curitiba
        </h1>
        <p style="font-size: 1.15rem; color: #e5e7eb; max-width: 750px; margin: 0 auto 1.75rem auto; line-height: 1.6;">
          Compre pneus nacionais e importados de aro 13 a 22 pelo menor preço, com 5 anos de garantia, bicos novos inclusos e pagamento facilitado em até 10x sem juros.
        </p>
        <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
          <a href="/pneus" style="background: #f49e1a; color: #000000; padding: 0.85rem 1.75rem; border-radius: 0.5rem; font-weight: 900; font-size: 1rem; text-decoration: none;">
            Ver Catálogo de Pneus
          </a>
          <a href="https://wa.me/${NAP_WHATSAPP}" style="background: #25D366; color: #ffffff; padding: 0.85rem 1.75rem; border-radius: 0.5rem; font-weight: 900; font-size: 1rem; text-decoration: none;">
            Chamar no WhatsApp (41) 3082-7282
          </a>
        </div>
      </section>

      <section style="margin-bottom: 3rem;">
        <h2 style="font-size: 1.6rem; font-weight: 900; color: #111827; text-align: center; margin-bottom: 1.5rem; text-transform: uppercase;">
          Pneus por Tamanho de Aro
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.75rem;">
          ${[13, 14, 15, 16, 17, 18, 19, 20].map(aro => `
            <a href="/aro/${aro}" style="display: block; background: #ffffff; border: 2px solid #111827; border-radius: 0.5rem; padding: 1rem 0.5rem; text-align: center; text-decoration: none; color: #111827; font-weight: 800;">
              <span style="display: block; font-size: 1.25rem;">Aro ${aro}</span>
              <span style="font-size: 0.75rem; color: #6b7280;">Ver Modelos</span>
            </a>
          `).join('')}
        </div>
      </section>

      <section style="margin-bottom: 3rem;">
        <h2 style="font-size: 1.6rem; font-weight: 900; color: #111827; text-align: center; margin-bottom: 1.5rem; text-transform: uppercase;">
          Serviços Automotivos no Portão
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
          <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 1.5rem;">
            <h3 style="font-size: 1.2rem; font-weight: 800; color: #111827; margin-bottom: 0.5rem;">📐 Alinhamento 3D a Laser</h3>
            <p style="font-size: 0.95rem; color: #4b5563; line-height: 1.5; margin-bottom: 1rem;">Geometria precisa de alta definição para garantir estabilidade e evitar desgaste prematuro de pneus.</p>
            <a href="/alinhamento-3d-curitiba" style="color: #2563eb; font-weight: 700; text-decoration: none;">Saiba mais &rarr;</a>
          </div>
          <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 1.5rem;">
            <h3 style="font-size: 1.2rem; font-weight: 800; color: #111827; margin-bottom: 0.5rem;">⚖️ Balanceamento Computadorizado</h3>
            <p style="font-size: 0.95rem; color: #4b5563; line-height: 1.5; margin-bottom: 1rem;">Elimine vibrações no volante e preserve os componentes da caixa de direção e amortecedores.</p>
            <a href="/troca-de-pneus-curitiba" style="color: #2563eb; font-weight: 700; text-decoration: none;">Saiba mais &rarr;</a>
          </div>
          <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 1.5rem;">
            <h3 style="font-size: 1.2rem; font-weight: 800; color: #111827; margin-bottom: 0.5rem;">🔧 Oficina Mecânica & Suspensão</h3>
            <p style="font-size: 0.95rem; color: #4b5563; line-height: 1.5; margin-bottom: 1rem;">Troca de pastilhas de freio, amortecedores, buchas, pivôs e revisão preventiva completa.</p>
            <a href="/auto-center-curitiba" style="color: #2563eb; font-weight: 700; text-decoration: none;">Saiba mais &rarr;</a>
          </div>
        </div>
      </section>

      ${renderNapBlock()}
    </main>
    ${renderFooter()}
  </div>`;
}

// Redirect HTML for Numeric ID routes
function renderIdRedirectHtml(canonicalSlugUrl: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Redirecionando para página oficial do pneu | Carplus Pneus</title>
  <link rel="canonical" href="${canonicalSlugUrl}" />
  <meta name="robots" content="noindex, follow" />
  <meta http-equiv="refresh" content="0; url=${canonicalSlugUrl}" />
  <script>
    window.location.replace("${canonicalSlugUrl}");
  </script>
</head>
<body>
  <p>Página de produto atualizada. Redirecionando para <a href="${canonicalSlugUrl}">${canonicalSlugUrl}</a>...</p>
</body>
</html>`;
}

// ==========================================
// Main Static HTML Prerendering Routine & Sitemaps
// ==========================================

interface PrerenderRoute {
  path: string;
  title: string;
  desc: string;
  keywords: string;
  schema: any;
  isIndexable: boolean;
  customBodyHtml?: string;
  isRedirect?: boolean;
  redirectTargetUrl?: string;
}

function getAllPrerenderRoutes(): PrerenderRoute[] {
  const routes: PrerenderRoute[] = [];

  const makeLocalBusiness = (areaServedName?: string) => ({
    "@type": "AutoRepair",
    "@id": `${DOMAIN}/#localbusiness`,
    "name": "Carplus Pneus & Auto Center",
    "description": "Loja de pneus novos e centro automotivo especializado em alinhamento 3D, balanceamento computadorizado e oficina mecânica no Portão, Curitiba.",
    "url": DOMAIN,
    "telephone": NAP_PHONE,
    "priceRange": "$$",
    "image": `${DOMAIN}/carplus-logo.svg`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Av. Presidente Arthur da Silva Bernardes, 1323",
      "addressLocality": "Curitiba",
      "addressRegion": "PR",
      "postalCode": "80320-300",
      "addressCountry": "BR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -25.477815,
      "longitude": -49.299557
    },
    ...(areaServedName ? { "areaServed": { "@type": "AdministrativeArea", "name": areaServedName } } : {})
  });

  // Core Static Routes
  routes.push({
    path: 'quem-somos',
    title: 'Quem Somos - Conheça a Carplus Pneus no Portão em Curitiba',
    desc: 'Conheça a história e estrutura da Carplus Pneus no bairro Portão, Curitiba. Oficina mecânica completa com alinhamento 3D, balanceamento de pneus e equipe especializada.',
    keywords: 'sobre a carplus, quem somos carplus, autocenter curitiba, pneus portao, mecanica curitiba',
    schema: { "@context": "https://schema.org", "@graph": [makeLocalBusiness(), { "@type": "WebPage", "name": "Quem Somos", "url": `${DOMAIN}/quem-somos` }] },
    isIndexable: true,
    customBodyHtml: renderServiceShell('Quem Somos - Carplus Pneus Auto Center', 'Conheça a história e estrutura da Carplus Pneus no bairro Portão, Curitiba. Oficina mecânica completa com alinhamento 3D, balanceamento de pneus e equipe especializada.')
  });

  routes.push({
    path: 'contato',
    title: 'Fale Conosco, Agende e Como Chegar | Carplus Pneus',
    desc: 'Endereço, telefone e WhatsApp da Carplus Pneus no Portão, Curitiba. Agende sua troca de pneus e revisão preventiva com orçamento transparente.',
    keywords: 'contato carplus, telefone carplus, whatsapp carplus, como chegar carplus, agendar revisao',
    schema: { "@context": "https://schema.org", "@graph": [makeLocalBusiness(), { "@type": "WebPage", "name": "Contato", "url": `${DOMAIN}/contato` }] },
    isIndexable: true,
    customBodyHtml: renderServiceShell('Fale Conosco, Agende e Como Chegar | Carplus Pneus', 'Endereço, telefone e WhatsApp da Carplus Pneus no Portão, Curitiba. Agende sua troca de pneus e revisão preventiva com orçamento transparente.')
  });

  routes.push({
    path: 'mapa-do-site',
    title: 'Mapa do Site - Catálogo e Páginas de Pneus em Curitiba | Carplus',
    desc: 'Navegue pelo mapa de conteúdo completo da Carplus. Encontre pneus por aro, pneus aro 13, 14, 15, 16, 17, 18 e diretório de bairros de Curitiba.',
    keywords: 'mapa do site, catalogo de pneus, bairros de curitiba pneus, busca de pneus por aro',
    schema: { "@context": "https://schema.org", "@graph": [makeLocalBusiness(), { "@type": "WebPage", "name": "Mapa do Site", "url": `${DOMAIN}/mapa-do-site` }] },
    isIndexable: true,
    customBodyHtml: renderServiceShell('Mapa do Site - Catálogo e Conteúdo Completo', 'Navegue pelo mapa de conteúdo completo da Carplus. Encontre pneus por aro, medidas populares e diretório de bairros.')
  });

  routes.push({
    path: 'politica-privacidades',
    title: 'Política de Privacidade e Proteção de Dados | Carplus Pneus',
    desc: 'Conheça nossas diretrizes de privacidade, confidencialidade e segurança de dados pessoais na Carplus Pneus Auto Center.',
    keywords: 'privacidade carplus, termos de uso carplus, segurança site de pneus, dados protegidos',
    schema: { "@context": "https://schema.org", "@graph": [makeLocalBusiness()] },
    isIndexable: true,
    customBodyHtml: renderServiceShell('Política de Privacidade e Proteção de Dados', 'Conheça nossas diretrizes de privacidade, confidencialidade e segurança de dados pessoais na Carplus Pneus Auto Center.')
  });

  routes.push({
    path: 'politica-devolucao',
    title: 'Política de Troca, Devolução e Garantia de 5 Anos | Carplus Pneus',
    desc: 'Confira a regulamentação para garantia oficial de 5 anos de fábrica contra defeitos, trocas de medidas e termos de devoluções da Carplus Pneus.',
    keywords: 'garantia de pneus, troca de medida de pneus, carplus garantia, devolucoes pneus curitiba',
    schema: { "@context": "https://schema.org", "@graph": [makeLocalBusiness()] },
    isIndexable: true,
    customBodyHtml: renderServiceShell('Política de Troca, Devolução e Garantia de 5 Anos', 'Confira a regulamentação para garantia oficial de 5 anos de fábrica contra defeitos, trocas de medidas e termos de devoluções da Carplus Pneus.')
  });

  routes.push({
    path: 'curitiba',
    title: 'Pneus em Curitiba - O Guia Completo da Instalação Técnica por Bairros | Carplus',
    desc: 'Acesse o diretório completo e hubs de atendimento por bairros em Curitiba. Adquira pneus novos das principais marcas com montagem, bico e calibragem grátis no Portão.',
    keywords: 'pneus curitiba, bairros curitiba, comprar pneu curitiba, autocenter curitiba',
    schema: { "@context": "https://schema.org", "@graph": [makeLocalBusiness(), { "@type": "WebPage", "name": "Pneus em Curitiba", "url": `${DOMAIN}/curitiba` }] },
    isIndexable: true,
    customBodyHtml: renderServiceShell('Pneus em Curitiba - Guia Completo de Instalação e Atendimento', 'Acesse o diretório completo e hubs de atendimento por bairros em Curitiba. Adquira pneus novos com montagem e alinhamento 3D no Portão.')
  });

  routes.push({
    path: 'regiao-metropolitana',
    title: 'Pneus na Região Metropolitana de Curitiba (RMC) - Serviços de Autocenter | Carplus',
    desc: 'Selecione sua cidade na Região Metropolitana para pneus novos selecionados. Agende a montagem expressa em nosso Auto Center Portão na Av. Arthur Bernardes.',
    keywords: 'pneus rmc, pneus regiao metropolitana curitiba, pneus pinhais, pneus colombo, pneus sjp',
    schema: { "@context": "https://schema.org", "@graph": [makeLocalBusiness(), { "@type": "WebPage", "name": "Pneus RMC", "url": `${DOMAIN}/regiao-metropolitana` }] },
    isIndexable: true,
    customBodyHtml: renderServiceShell('Pneus na Região Metropolitana de Curitiba (RMC)', 'Atendimento completo para motoristas e empresas da Região Metropolitana com montagem no Auto Center Portão.')
  });

  // Blog Hub Route
  routes.push({
    path: 'blog',
    title: 'Blog da Carplus Pneus - Manual de Dicas e Mecânica de Pneus | Carplus',
    desc: 'Esclareça suas dúvidas técnicas sobre alinhamento 3D, indicador TWI, limites de segurança de pneus murchos e cuidados fundamentais no clima chuvoso de Curitiba.',
    keywords: 'blog carplus, manual do pneu, calibragem curitiba, indicador twi, dicas suspensão',
    schema: { "@context": "https://schema.org", "@graph": [makeLocalBusiness(), { "@type": "WebPage", "name": "Blog Automotivo", "url": `${DOMAIN}/blog` }] },
    isIndexable: true,
    customBodyHtml: renderServiceShell('Blog da Carplus Pneus - Dicas Automotivas e Mecânica', 'Artigos técnicos e práticos para cuidar dos pneus, suspensão e alinhamento do seu carro.')
  });

  // High-Intent Specific Search Pages
  const highIntentPages = [
    { slug: 'oficina-do-pneu-curitiba', title: 'Oficina do Pneu Curitiba - Serviços e Borracharia de Alta Precisão | Carplus', desc: 'Centro Automotivo em Curitiba especializado em troca de pneus, conserto de rodas, suspensão e freios. Ganhe bicos de borracha novos e montagem expressa de graça.' },
    { slug: 'garagem-de-pneus-curitiba', title: 'Garagem de Pneus Curitiba - Amplo Estoque a Pronta Entrega | Carplus Pneus', desc: 'A grande garagem de pneus de Curitiba. Amplo estoque de pneus novos Pirelli, Goodyear, Bridgestone, Delinte com bicos grátis e montagem em nosso box Portão.' },
    { slug: 'pneus-pirelli-curitiba', title: 'Pneus Pirelli em Curitiba - Linha Completa no Portão | Carplus', desc: 'Buscando pneus Pirelli em Curitiba? Grade completa de medidas Cinturato P7, Scorpion e P-Zero. Montagem e bico de borracha gratuito em nossa rampa 3D no Portão.' },
    { slug: 'alinhamento-3d-curitiba', title: 'Alinhamento 3D Curitiba - Prevenção de Desgaste e Geometria | Carplus', desc: 'Alinhamento Computadorizado Tridimensional de alta precisão em Curitiba. Evite desgaste precoce de pneus e desvios nas retas. Equipamentos novos e precisos.' },
    { slug: 'xbri-pneus-curitiba', title: 'Xbri Pneus Curitiba - Ampla Linha de Medidas e Modelos | Carplus', desc: 'Buscando pneus Xbri em Curitiba com o melhor custo-benefício, alta durabilidade e aderência garantida? Ganhe bicos de borracha novos e montagem grátis no Portão.' },
    { slug: 'pneus-baratos-em-curitiba', title: 'Pneus Baratos em Curitiba - Preço de Atacado Completo | Carplus', desc: 'Onde comprar pneus baratos em Curitiba? Seleção de pneus importados e nacionais pelo menor preço à pronta entrega. Ganhe bicos novos e instalação expressa sem pagar mais nada.' },
    { slug: 'melhor-site-para-comprar-pneus', title: 'Melhor Site para Comprar Pneus no Brasil - Reserva Online Segura | Carplus', desc: 'Descubra a Carplus Pneus como o melhor site para comprar pneus: pesquise com transparência total de preços, faça sua reserva online e pague apenas pós-montagem com bicos gratuitos.' },
    { slug: 'distribuidora-de-pneus-importados-atacado-curitiba', title: 'Distribuidora de Pneus Importados Atacado Curitiba - Faturado CNPJ | Carplus', desc: 'Importação direta e venda corporativa de pneus em Curitiba. Condições de atacado imbatíveis no faturamento empresarial, frotistas e revendas com envio ágil para todo o estado.' },
    { slug: 'pneu-hankook-curitiba', title: 'Pneu Hankook Curitiba - Linha Premium Dynapro e Ventus | Carplus Pneus', desc: 'Encontre pneus Hankook em Curitiba. Alta durabilidade, altíssima performance asiática homologada como equipamento original de montadoras mundiais de luxo. Montagem rápida grátis no Portão.' },
    { slug: 'pneus-bridgestone-curitiba-precos', title: 'Pneus Bridgestone Curitiba Preços - Modelos Turanza e Ecopia | Carplus', desc: 'Precisa de pneus Bridgestone em Curitiba? Faça simulações e compre com preços imbatíveis. Instalação profissional expressa com troca gratuita de bicos inclusa em nossa loja física.' },
    { slug: 'barao-pneus-e-oficina-bacacheri-curitiba', title: 'Alternativa a Barão Pneus e Oficina Bacacheri Curitiba | Carplus', desc: 'Buscando alternativa a Barão Pneus e Oficina Bacacheri no norte de Curitiba? Compare e descubra as vantagens exclusivas e equipamentos 3D da Carplus Portão.' },
    { slug: 'barao-pneus-sao-jose-pinhais', title: 'Conheça Alternativa a Barão Pneus São José Pinhais | Carplus', desc: 'Pesquisando Barão Pneus em São José dos Pinhais? Conheça a alternativa de pneus novos na Carplus. Localização de fácil acesso pela rápida do Portão.' },
    { slug: 'pneus-em-curitiba-melhor-preco', title: 'Pneus em Curitiba com Melhor Preço - Cobrimos Orçamentos | Carplus', desc: 'Garantia absoluta de pneus em Curitiba com o melhor preço real do mercado! Linha completa Pirelli, Delinte, Goodyear de aro 13 a 20 com montagem e bicos novos grátis hoje.' },
    { slug: 'distribuidora-de-pneus-em-curitiba', title: 'Distribuidora de Pneus em Curitiba - Estoque Completo Portão | Carplus', desc: 'Distribuidora ágil de pneus novos com venda varejo direta pelo menor custo para o motorista de Curitiba. Isenção total de taxas de montagem e suporte técnico em suspensões.' },
    { slug: 'bana-pneus', title: 'Alternativa a Bana Pneus Curitiba - Serviços e Preços | Carplus', desc: 'Procurando alternativa a Bana Pneus em Curitiba? Conheça diferenciais de qualidade, prazos de garantia de 5 anos e condições exclusivas da Carplus Portão com serviços expressos.' },
    { slug: 'loja-de-pneus-em-curitiba', title: 'Loja de Pneus em Curitiba - Box Rápido e Atendimento Sede | Carplus', desc: 'Venha conhecer sua melhor loja de pneus novos em Curitiba ao lado da Arthur Bernardes. Troca veloz, maquinários modernos anti-riscos e bico premium grátis com total comodidade.' },
    { slug: 'pneus-pirelli-em-curitiba-melhor-preco', title: 'Pneus Pirelli em Curitiba com Melhor Preço - Linha Completa | Carplus', desc: 'Melhor preço em pneus novos Pirelli em Curitiba. Estoque completo Cinturato P1, P7, Scorpion a pronta entrega com bico grátis e geometria 3D computadorizada no Portão.' },
    { slug: 'barao-pneus-e-oficina-portao', title: 'Alternativa a Barão Pneus e Oficina Portão | Carplus', desc: 'Procurando serviços no Portão semelhantes a Barão Pneus? Conheça a alternativa Carplus Arthur Bernardes para Geometria 3D de alta precisão e bicos grátis.' },
    { slug: 'auto-center-curitiba', title: 'Auto Center e Centro Automotivo em Curitiba | Carplus Pneus', desc: 'Auto Center completo em Curitiba com pneus novos multimarcas, montagem técnica com bicos inclusos, alinhamento 3D computadorizado e oficina mecânica no Portão.' },
    { slug: 'troca-de-pneus-curitiba', title: 'Troca de Pneus em Curitiba com Montagem e Válvulas Inclusas | Carplus', desc: 'Troca de pneus em Curitiba com desmontadora anti-risco, válvulas de ar novas, balanceamento computadorizado e alinhamento 3D na Av. Arthur Bernardes, Portão.' },
    { slug: 'centro-automotivo-portao', title: 'Centro Automotivo no Portão Curitiba - Oficina e Pneus | Carplus', desc: 'Centro automotivo e auto center no Portão em Curitiba. Loja de pneus novos, montagem inclusa, geometria 3D, freios e suspensão na Av. Presidente Arthur Bernardes, 1323.' }
  ];

  highIntentPages.forEach(p => {
    routes.push({
      path: p.slug,
      title: p.title,
      desc: p.desc,
      keywords: `${p.slug.replace(/-/g, ', ')}, pneus curitiba, auto center portao`,
      schema: { "@context": "https://schema.org", "@graph": [makeLocalBusiness(), { "@type": "WebPage", "name": p.title, "url": `${DOMAIN}/${p.slug}` }] },
      isIndexable: true,
      customBodyHtml: renderServiceShell(p.title, p.desc)
    });
  });

  // Blog Posts Pre-Rendering (Authentic Articles)
  BLOG_POSTS.forEach(post => {
    const postUrl = `${DOMAIN}/blog/${post.slug}`;
    const blogSchema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": postUrl
      },
      "headline": post.h1 || post.title,
      "description": post.metaDescription || post.summary,
      "image": post.featuredImage.startsWith('http') ? post.featuredImage : `${DOMAIN}${post.featuredImage}`,
      "author": {
        "@type": "Organization",
        "name": "Carplus Pneus & Auto Center",
        "url": DOMAIN
      },
      "publisher": {
        "@type": "Organization",
        "name": "Carplus Pneus",
        "logo": {
          "@type": "ImageObject",
          "url": `${DOMAIN}/carplus-logo.svg`
        }
      },
      "datePublished": post.publishedIso,
      "dateModified": post.updatedIso || post.publishedIso
    };

    routes.push({
      path: `blog/${post.slug}`,
      title: post.metaTitle || `${post.title} | Blog Carplus`,
      desc: post.metaDescription || post.summary,
      keywords: `${post.category}, pneus curitiba, dicas mecanica, ${post.title.toLowerCase().replace(/[^a-z0-9]/g, ' ')}`,
      schema: blogSchema,
      isIndexable: true,
      customBodyHtml: renderBlogArticleShell(post)
    });
  });

  // Official Neighborhoods (75)
  OFFICIAL_NEIGHBORHOODS.forEach(n => {
    const isReleased = isPageReleased(n, 'bairro', 80);
    routes.push({
      path: `bairro/${toSlug(n)}`,
      title: `Pneus no Bairro ${n}, Curitiba - Entrega e Instalação Grátis | Carplus`,
      desc: `Precisa de pneus no bairro ${n} em Curitiba? Compre online na Carplus e ganhe montagem gratuita hoje mesmo em nossa loja física, localizada ao lado da sua região!`,
      keywords: `pneus no bairro ${n}, pneus em curitiba, pneus ${n} curitiba, pneus perto do ${n}, borracharia ${n}`,
      schema: { "@context": "https://schema.org", "@graph": [makeLocalBusiness(n)] },
      isIndexable: isReleased,
      customBodyHtml: renderBairroShell(n)
    });

    if (n === "Cidade Industrial (CIC)") {
      routes.push({
        path: `bairro/cic`,
        title: `Pneus no CIC (Cidade Industrial de Curitiba) - Promoção e Montagem Grátis | Carplus`,
        desc: `Buscando pneus novos no CIC em Curitiba? Compre na Carplus com os menores preços da região, montagem grátis e bico de ar novos inclusos no Portão!`,
        keywords: `pneus no cic, pneus cidade industrial de curitiba, pneus cic, borracharia cic, pneus perto do cic`,
        schema: { "@context": "https://schema.org", "@graph": [makeLocalBusiness("Cidade Industrial (CIC)")] },
        isIndexable: isReleased,
        customBodyHtml: renderBairroShell("Cidade Industrial (CIC)")
      });
    }
  });

  // Non-Official Neighborhoods (29)
  NON_OFFICIAL_NEIGHBORHOODS.forEach(n => {
    routes.push({
      path: `bairro/${toSlug(n.name)}`,
      title: `Pneus no Bairro ${n.name}, Curitiba - Entrega e Instalação Grátis | Carplus`,
      desc: `Precisa de pneus no bairro ${n.name} em Curitiba? Compre online na Carplus e ganhe montagem gratuita hoje mesmo em nossa loja física, localizada ao lado da sua região!`,
      keywords: `pneus no bairro ${n.name}, pneus em curitiba, pneus ${n.name} curitiba, pneus perto do ${n.name}, borracharia ${n.name}`,
      schema: { "@context": "https://schema.org", "@graph": [makeLocalBusiness(n.name)] },
      isIndexable: isPageReleased(n.name, 'bairro', 80),
      customBodyHtml: renderBairroShell(n.name)
    });
  });

  // Metropolitan Cities (15)
  METROPOLITAN_CITIES.forEach(c => {
    routes.push({
      path: `cidade/${toSlug(c)}`,
      title: `Pneus em ${c} - Filtre por Aro, Parcele em até 10x sem juros | Carplus`,
      desc: `Encontre pneus novos para entrega ou instalação de fábrica com agendamento rápido em ${c}. Atendimento completo para motoristas da RMC na Carplus Pneus.`,
      keywords: `pneus em ${c}, pneus cidade ${c}, comprar pneus ${c}, borracharia em ${c}, pneus rmc`,
      schema: { "@context": "https://schema.org", "@graph": [makeLocalBusiness(c)] },
      isIndexable: isPageReleased(c, 'cidade', 80),
      customBodyHtml: renderCidadeShell(c)
    });
  });

  // Aros (8)
  AROS.forEach(a => {
    routes.push({
      path: `aro/${a}`,
      title: `Pneus Aro ${a} em Curitiba | Pneus por Aro no Portão | Carplus Pneus`,
      desc: `Buscando pneus por aro? Veja ofertas irresistíveis de Pneus Aro ${a} em Curitiba com ampla garantia e montagem inclusa. Pirelli, Goodyear, Bridgestone e mais.`,
      keywords: `pneus aro ${a}, pneus por aro, pneus aro ${a} em curitiba, pneus r${a}, comprar pneu aro ${a}`,
      schema: { "@context": "https://schema.org", "@graph": [makeLocalBusiness()] },
      isIndexable: isPageReleased(String(a), 'aro', 80),
      customBodyHtml: renderAroShell(Number(a))
    });
  });

  // Cars (46)
  CARS.forEach(car => {
    routes.push({
      path: `carro/${toSlug(car)}`,
      title: `Pneus para ${car} em Curitiba | Medida Original Recomendada | Carplus`,
      desc: `Tabela completa e preços imperdíveis de Pneus homologados para ${car} em Curitiba. Preserve a segurança de fábrica com pneus originais das melhores marcas.`,
      keywords: `pneus para ${car}, pneu original ${car}, pneu homologado ${car}, medida pneu ${car}`,
      schema: { "@context": "https://schema.org", "@graph": [makeLocalBusiness()] },
      isIndexable: isPageReleased(car, 'carro', 80),
      customBodyHtml: renderCarShell(car)
    });
  });

  // Tires (Friendly Slug Routes + Numeric ID Redirect Routes)
  const seenProductSlugs = new Set<string>();

  TIRES_DATA.forEach(t => {
    const slug = getTireSlug(t);

    // 1. Primary Friendly Slug Route (Indexable, Full Product HTML)
    if (!seenProductSlugs.has(slug)) {
      seenProductSlugs.add(slug);

      routes.push({
        path: `pneu/${slug}`,
        title: `Pneu ${t.brand} ${t.model} ${t.width}/${t.aspectRatio} R${t.rim} Curitiba | Carplus`,
        desc: `Compre seu Pneu ${t.brand} ${t.model} original medida ${t.width}/${t.aspectRatio} R${t.rim} na Carplus Portão. Montagem computadorizada e bicos de ar grátis inclusos!`,
        keywords: `pneu ${t.brand}, pneu ${t.brand} ${t.model}, pneu ${t.width} ${t.aspectRatio} r${t.rim}, pneus novos curitiba, pneu portao`,
        schema: {
          "@context": "https://schema.org",
          "@graph": [
            makeLocalBusiness(),
            {
              "@type": "Product",
              "name": `Pneu ${t.brand} ${t.model} ${t.width}/${t.aspectRatio} R${t.rim}`,
              "image": t.image,
              "description": `Pneu novo modelo ${t.model} marca ${t.brand}, medida ${t.width}/${t.aspectRatio} R${t.rim}. Montagem técnica e bicos de alta qualidade grátis inclusos no Portão.`,
              "brand": { "@type": "Brand", "name": t.brand },
              "offers": {
                "@type": "Offer",
                "price": t.promoPrice || t.price,
                "priceCurrency": "BRL",
                "availability": "https://schema.org/InStock"
              }
            }
          ]
        },
        isIndexable: true,
        customBodyHtml: renderProductShell(t, slug)
      });
    }

    // 2. Numeric Parameter ID Route (Strictly noindex, redirects to friendly slug)
    routes.push({
      path: `pneu/${t.id}`,
      title: `Pneu ${t.brand} ${t.model} | Carplus Pneus`,
      desc: `Redirecionando para a página oficial do pneu ${t.brand} ${t.model}...`,
      keywords: '',
      schema: {},
      isIndexable: false,
      isRedirect: true,
      redirectTargetUrl: `${DOMAIN}/pneu/${slug}`
    });
  });

  return routes;
}

function generateSitemaps(routes: PrerenderRoute[]) {
  console.log("Generating segmented sitemaps strictly synchronized with indexable routes...");
  
  const publicDir = path.join(process.cwd(), 'public');
  const distDir = path.join(process.cwd(), 'dist');

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const makeSitemapxml = (urls: { loc: string; priority: string }[]) => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    urls.forEach(u => {
      xml += `  <url>\n`;
      xml += `    <loc>${u.loc}</loc>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>${u.priority}</priority>\n`;
      xml += `  </url>\n`;
    });
    xml += `</urlset>\n`;
    return xml;
  };

  const writeSitemapFile = (filename: string, content: string) => {
    fs.writeFileSync(path.join(publicDir, filename), content);
    if (fs.existsSync(distDir)) {
      fs.writeFileSync(path.join(distDir, filename), content);
    }
    console.log(`Sitemap written: ${filename}`);
  };

  // Only take routes that are indexable and not redirects
  const indexableRoutes = routes.filter(r => r.isIndexable && !r.isRedirect);

  // 1. sitemap-institucional.xml (Home, static pages, high-intent pages, products)
  const instUrls: { loc: string; priority: string }[] = [];
  const seenInstUrls = new Set<string>();

  const addInstUrl = (loc: string, priority: string) => {
    if (!seenInstUrls.has(loc)) {
      seenInstUrls.add(loc);
      instUrls.push({ loc, priority });
    }
  };

  // Home (matches canonical https://www.carpluscwb.com.br/)
  addInstUrl(`${DOMAIN}/`, "1.0");

  indexableRoutes.forEach(r => {
    if (r.path.startsWith('pneu/')) {
      addInstUrl(`${DOMAIN}/${r.path}`, "0.8");
    } else if (
      !r.path.startsWith('bairro/') &&
      !r.path.startsWith('cidade/') &&
      !r.path.startsWith('carro/') &&
      !r.path.startsWith('aro/') &&
      r.path !== 'blog' &&
      !r.path.startsWith('blog/')
    ) {
      addInstUrl(`${DOMAIN}/${r.path}`, r.path.startsWith('politica-') ? "0.3" : "0.9");
    }
  });
  writeSitemapFile('sitemap-institucional.xml', makeSitemapxml(instUrls));

  // 2. sitemap-bairros.xml
  const bairroUrls: { loc: string; priority: string }[] = [];
  indexableRoutes.forEach(r => {
    if (r.path.startsWith('bairro/')) {
      bairroUrls.push({ loc: `${DOMAIN}/${r.path}`, priority: "0.7" });
    }
  });
  writeSitemapFile('sitemap-bairros.xml', makeSitemapxml(bairroUrls));

  // 3. sitemap-cidades.xml
  const cidadeUrls: { loc: string; priority: string }[] = [];
  indexableRoutes.forEach(r => {
    if (r.path.startsWith('cidade/')) {
      cidadeUrls.push({ loc: `${DOMAIN}/${r.path}`, priority: "0.7" });
    }
  });
  writeSitemapFile('sitemap-cidades.xml', makeSitemapxml(cidadeUrls));

  // 4. sitemap-carros.xml
  const carroUrls: { loc: string; priority: string }[] = [];
  indexableRoutes.forEach(r => {
    if (r.path.startsWith('carro/')) {
      carroUrls.push({ loc: `${DOMAIN}/${r.path}`, priority: "0.7" });
    }
  });
  writeSitemapFile('sitemap-carros.xml', makeSitemapxml(carroUrls));

  // 5. sitemap-aros.xml
  const aroUrls: { loc: string; priority: string }[] = [];
  indexableRoutes.forEach(r => {
    if (r.path.startsWith('aro/')) {
      aroUrls.push({ loc: `${DOMAIN}/${r.path}`, priority: "0.8" });
    }
  });
  writeSitemapFile('sitemap-aros.xml', makeSitemapxml(aroUrls));

  // 6. sitemap-blog.xml
  const blogUrls: { loc: string; priority: string }[] = [];
  indexableRoutes.forEach(r => {
    if (r.path === 'blog' || r.path.startsWith('blog/')) {
      blogUrls.push({ loc: `${DOMAIN}/${r.path}`, priority: r.path === 'blog' ? "0.8" : "0.7" });
    }
  });
  writeSitemapFile('sitemap-blog.xml', makeSitemapxml(blogUrls));

  // 7. sitemap-index.xml (include all segmented sitemaps with >0 URLs)
  const allSegmented = [
    { name: 'sitemap-institucional.xml', list: instUrls },
    { name: 'sitemap-bairros.xml', list: bairroUrls },
    { name: 'sitemap-cidades.xml', list: cidadeUrls },
    { name: 'sitemap-carros.xml', list: carroUrls },
    { name: 'sitemap-aros.xml', list: aroUrls },
    { name: 'sitemap-blog.xml', list: blogUrls }
  ];

  let indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  indexXml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  
  allSegmented.forEach(s => {
    if (s.list.length > 0) {
      indexXml += `  <sitemap>\n`;
      indexXml += `    <loc>${DOMAIN}/${s.name}</loc>\n`;
      indexXml += `  </sitemap>\n`;
    }
  });
  indexXml += `</sitemapindex>\n`;

  fs.writeFileSync(path.join(publicDir, 'sitemap-index.xml'), indexXml);
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), indexXml);
  
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'sitemap-index.xml'), indexXml);
    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), indexXml);
  }
}

function runPrerendering(routes: PrerenderRoute[]) {
  console.log("Starting Real Semantic Static HTML Prerendering...");
  
  const distPath = path.join(process.cwd(), 'dist');
  const templatePath = path.join(distPath, 'index.html');

  if (!fs.existsSync(templatePath)) {
    console.warn("dist/index.html not found. Please run 'npm run build' first.");
    return;
  }

  const templateHtml = fs.readFileSync(templatePath, 'utf8');

  console.log(`Writing pre-rendered static HTML for ${routes.length} paths...`);

  // Update homepage (dist/index.html) with semantic pre-rendered shell
  const homeTitle = "Pneus, Auto Center e Oficina Mecânica em Curitiba | Carplus Portão";
  const homeDesc = "Carplus Pneus é loja de pneus, auto center e oficina mecânica no Portão, Curitiba. Pneus novos multimarcas, montagem, alinhamento 3D, balanceamento e serviços automotivos.";
  const homeShell = renderHomeShell();
  let updatedTemplateHtml = templateHtml.replace(/<div id="root"><\/div>/i, homeShell);
  fs.writeFileSync(templatePath, updatedTemplateHtml);

  // Write static subpages sequentially
  routes.forEach(r => {
    const targetDir = path.join(distPath, r.path);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    if (r.isRedirect && r.redirectTargetUrl) {
      const redirectHtml = renderIdRedirectHtml(r.redirectTargetUrl);
      fs.writeFileSync(path.join(targetDir, 'index.html'), redirectHtml);
      return;
    }

    const pageUrl = `${DOMAIN}/${r.path}`;
    const robotsVal = r.isIndexable ? "index, follow" : "noindex, follow";
    const subpageShell = r.customBodyHtml || renderServiceShell(r.title, r.desc);

    // Replace header and body values cleanly
    let rewritten = templateHtml
      .replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(r.title)}</title>`)
      .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, `<meta name="description" content="${escapeHtml(r.desc)}" />`)
      .replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${pageUrl}" />`)
      .replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${escapeHtml(r.title)}" />`)
      .replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${escapeHtml(r.desc)}" />`)
      .replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${pageUrl}" />`)
      .replace(/<head>/i, `<head>\n    <meta name="keywords" content="${escapeHtml(r.keywords)}" />\n    <meta name="robots" content="${robotsVal}" />`)
      .replace(/<\/head>/i, `    <script type="application/ld+json">\n${JSON.stringify(r.schema, null, 2)}\n    </script>\n  </head>`)
      .replace(/<div id="root"><\/div>/i, subpageShell);

    fs.writeFileSync(path.join(targetDir, 'index.html'), rewritten);
  });

  // Generate physical folders and redirect pages for legacy URLs
  const legacyRedirects = [
    { from: 'fale-conosco', to: 'contato' },
    { from: 'faleconosco', to: 'contato' },
    { from: 'quemsomos', to: 'quem-somos' }
  ];

  legacyRedirects.forEach(redir => {
    const targetDir = path.join(distPath, redir.from);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Redirecionando... | Carplus Pneus</title>
  <meta http-equiv="refresh" content="0; url=/${redir.to}" />
  <script>
    window.location.replace("/${redir.to}");
  </script>
</head>
<body>
  <p>Página movida. Redirecionando para <a href="/${redir.to}">/${redir.to}</a>...</p>
</body>
</html>`;
    fs.writeFileSync(path.join(targetDir, 'index.html'), html);
  });

  console.log("Static HTML pre-rendering with real content and wave rules completed successfully!");
}

// Main execution block
try {
  const routes = getAllPrerenderRoutes();
  runPrerendering(routes);
  generateSitemaps(routes);
  generateRobots();
} catch (e) {
  console.error("Error building SEO scripts: ", e);
}
