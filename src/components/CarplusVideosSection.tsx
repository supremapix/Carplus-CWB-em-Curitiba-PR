import React, { useEffect, useId, useRef, useState } from 'react';
import { ArrowRight, ChevronDown, ExternalLink, MessageCircle, Play } from 'lucide-react';
import { formatWhatsApp } from '../utils/whatsapp';
import '../videos.css';

const VIDEOS = [
  {
    id: 'v72kI13VyAU',
    category: 'Pneus',
    title: 'Troca de pneus na Carplus',
    description: 'Veja a equipe durante a troca de pneus na nossa oficina.',
  },
  {
    id: '1fWqUJdCdRg',
    category: 'Serviços',
    title: 'Balanceamento de rodas',
    description: 'Conheça uma etapa do serviço de balanceamento na Carplus.',
  },
  {
    id: '4FpPSM5vYE8',
    category: 'Nossa loja',
    title: 'Conheça a estrutura da Carplus',
    description: 'Um olhar sobre a nossa unidade no Portão, em Curitiba.',
  },
  {
    id: 'TL490QZpGlc',
    category: 'Veículos',
    title: 'Veículos na Carplus',
    description: 'Assista à apresentação da área de veículos da Carplus.',
    link: 'https://www.carplusautos.com.br/',
    linkLabel: 'Conhecer os veículos Carplus',
  },
];

const SECRET_ACCORDIONS = [
  {
    title: 'Quando verificar as válvulas?',
    content: 'Na troca de pneus, peça à equipe que confira o estado das válvulas e indique se precisam de substituição.',
  },
  {
    title: 'Qual pressão usar nos pneus?',
    content: 'Consulte a pressão recomendada no manual ou na etiqueta do veículo. A calibragem varia conforme o modelo e a carga.',
  },
  {
    title: 'Como comparar as opções de pneus?',
    content: 'Confira a medida, os índices de carga e velocidade e as informações da etiqueta do pneu. A equipe ajuda a comparar opções para o seu veículo.',
  },
  {
    title: 'Quando avaliar o alinhamento?',
    content: 'Se notar desgaste irregular, vibração ou o carro puxando, solicite uma avaliação para identificar a causa antes de definir o serviço.',
  },
  {
    title: 'Como consultar a garantia?',
    content: 'Antes de comprar, confirme as condições de garantia do modelo escolhido e guarde a nota fiscal. A equipe orienta sobre o atendimento na loja.',
  },
];

const thumbnail = (id: string) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

export default function CarplusVideosSection() {
  const instanceId = useId();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const activeVideo = VIDEOS[activeVideoIndex];
  const watchUrl = `https://www.youtube.com/watch?v=${activeVideo.id}`;

  useEffect(() => {
    const enclosingDetails = sectionRef.current?.closest('details');
    if (!enclosingDetails) return;
    const stopWhenClosed = () => { if (!enclosingDetails.open) setIsPlaying(false); };
    enclosingDetails.addEventListener('toggle', stopWhenClosed);
    return () => enclosingDetails.removeEventListener('toggle', stopWhenClosed);
  }, []);

  const selectVideo = (index: number) => {
    if (index === activeVideoIndex) return;
    setIsPlaying(false);
    setActiveVideoIndex(index);
  };

  return (
    <div ref={sectionRef} className="carplus-videos" id="carplus-videos-and-accordions">
      <section className="videos-panel" id="box-video-section" aria-labelledby={`${instanceId}-heading`}>
        <header className="videos-heading">
          <p className="videos-eyebrow">Na nossa loja · Portão, Curitiba</p>
          <h2 id={`${instanceId}-heading`} className="videos-title">Conheça a Carplus em vídeo.</h2>
          <p className="videos-intro">Veja a troca de pneus, os serviços e a estrutura. Escolha um vídeo para assistir.</p>
        </header>

        <div className="videos-layout">
          <div className="videos-feature">
            <div className="videos-player" id={`${instanceId}-player`} aria-labelledby={`${instanceId}-active-title`}>
              {isPlaying ? (
                <iframe
                  key={activeVideo.id}
                  src={`https://www.youtube-nocookie.com/embed/${activeVideo.id}?autoplay=1&rel=0&playsinline=1`}
                  title={`${activeVideo.title} | Carplus`}
                  width="960"
                  height="540"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              ) : (
                <button type="button" className="videos-poster" onClick={() => setIsPlaying(true)} aria-label={`Reproduzir: ${activeVideo.title}`}>
                  <img key={activeVideo.id} src={thumbnail(activeVideo.id)} alt="" aria-hidden="true" width="480" height="360" loading="lazy" decoding="async" onError={event => { event.currentTarget.hidden = true; }} />
                  <span className="videos-play-symbol"><Play aria-hidden="true" /></span>
                  <span className="videos-play-label">Reproduzir vídeo</span>
                </button>
              )}
            </div>
            <div className="videos-feature-copy">
              <p className="videos-player-status" role="status" aria-live="polite" aria-atomic="true"><span>Vídeo {activeVideoIndex + 1} de {VIDEOS.length}</span><span>{isPlaying ? 'Assistindo' : 'Selecionado para assistir'}</span></p>
              <h3 id={`${instanceId}-active-title`} className="videos-active-title">{activeVideo.title}</h3>
              <p className="videos-description">{activeVideo.description}</p>
              <div className="videos-external-links">
                <a href={watchUrl} target="_blank" rel="noopener noreferrer" data-cta-location="videos-youtube">Assistir no YouTube<ExternalLink aria-hidden="true" /></a>
                {activeVideo.link && <a href={activeVideo.link} target="_blank" rel="noopener noreferrer" data-cta-location="videos-veiculos">{activeVideo.linkLabel}<ArrowRight aria-hidden="true" /></a>}
              </div>
            </div>
          </div>

          <aside className="videos-playlist" aria-labelledby={`${instanceId}-playlist-title`}>
            <h3 id={`${instanceId}-playlist-title`} className="videos-playlist-title">Escolha um vídeo</h3>
            <ol className="videos-playlist-items" aria-label="Vídeos da Carplus">
              {VIDEOS.map((video, index) => {
                const selected = index === activeVideoIndex;
                return (
                  <li key={video.id}>
                    <button type="button" className={`videos-playlist-button${selected ? ' is-selected' : ''}`} onClick={() => selectVideo(index)} aria-pressed={selected} aria-controls={`${instanceId}-player`}>
                      <span className="videos-playlist-thumb"><Play aria-hidden="true" /><img src={thumbnail(video.id)} alt="" aria-hidden="true" width="480" height="360" loading="lazy" decoding="async" onError={event => { event.currentTarget.hidden = true; }} /></span>
                      <span className="videos-playlist-copy"><span className="videos-category">{video.category}</span><span className="videos-playlist-video-title">{video.title}</span><span className="videos-playlist-label">{selected ? (isPlaying ? 'Assistindo' : 'Selecionado') : 'Selecionar vídeo'}</span></span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </aside>
        </div>

        <div className="videos-conversion">
          <div><h3 className="videos-conversion-title">Quer conversar sobre pneus?</h3><p>Conte qual é o seu carro e tire sua dúvida com a equipe da Carplus.</p></div>
          <a href={formatWhatsApp('Olá, Carplus! Vi os vídeos da loja e quero conversar sobre pneus para o meu carro.')} target="_blank" rel="noopener noreferrer" data-cta-location="videos" className="carplus-action-primary"><MessageCircle aria-hidden="true" />Conversar sobre pneus<ArrowRight aria-hidden="true" /></a>
        </div>
      </section>

      <details className="videos-tips" id="secrets-tires-accordion">
        <summary><span>Cuidados com os pneus: orientações rápidas</span><ChevronDown aria-hidden="true" /></summary>
        <dl className="videos-tips-list" id="accordion-blocks-wrapper">{SECRET_ACCORDIONS.map(tip => <div key={tip.title}><dt>{tip.title}</dt><dd>{tip.content}</dd></div>)}</dl>
      </details>
    </div>
  );
}
