import React from 'react';
import { Search, MessageSquare, Wrench, Gauge, ArrowRight, MapPin, Check } from 'lucide-react';
import { PromoTire } from '../data/promoTires';

interface WorkshopHeroProps {
  onSearchClick: () => void;
  onCallClick?: () => void;
  onSelectPromoTire: (slug: string) => void;
  promoTires: PromoTire[];
}

export default function WorkshopHero({ onSearchClick }: WorkshopHeroProps) {
  const whatsappUrl = `https://api.whatsapp.com/send?phone=554130827282&text=${encodeURIComponent('Olá Carplus! Quero um orçamento de pneus Prinx para meu carro elétrico ou híbrido. Podem conferir a medida e as opções para o meu veículo?')}`;

  return (
    <section className="carplus-hero" id="hero-banner" aria-labelledby="carplus-hero-title" data-track-location="hero">
      <div className="carplus-hero-photo">
        <img src="/images/social/carplus-prinx-nova-energia-hero.webp" alt="Pneus Prinx para elétricos e híbridos, com carro elétrico ao fundo" width="1731" height="909" fetchPriority="high" decoding="async" />
        <span className="carplus-photo-caption">PRINX NA CARPLUS · PORTÃO, CURITIBA</span>
      </div>
      <div className="carplus-hero-layout">
        <div className="carplus-hero-copy">
          <span className="carplus-eyebrow"><span />CARPLUS · PNEUS PARA ELÉTRICOS · CURITIBA</span>
          <h1 id="carplus-hero-title">PNEUS PRINX<br />PARA ELÉTRICOS<br /><em>E HÍBRIDOS.</em></h1>
          <p>Seu elétrico merece o pneu certo. Conheça as opções Prinx na Carplus: informe o carro e o ano, e nossa equipe confere a medida, a aplicação e o orçamento.</p>
          <div className="carplus-hero-actions" id="hero-action-buttons">
            <a className="carplus-button carplus-button-primary carplus-action-primary" href={whatsappUrl} target="_blank" rel="noopener noreferrer" data-cta-location="hero" id="hero-whatsapp-btn">
              <MessageSquare size={23} aria-hidden="true" /><span>Orçamento no WhatsApp</span><ArrowRight size={19} aria-hidden="true" />
            </a>
            <button className="carplus-button carplus-button-secondary carplus-action-secondary" onClick={onSearchClick} data-cta-location="hero" id="hero-ver-pneus-btn"><Search size={19} aria-hidden="true" />Encontrar meu pneu</button>
          </div>
          <p className="carplus-hero-help"><Check size={16} aria-hidden="true" />Não sabe a medida? A Carplus ajuda você a conferir.</p>
        </div>
        <div className="carplus-hero-address">
          <MapPin size={24} aria-hidden="true" /><div><span>VISITE A CARPLUS NO PORTÃO</span><strong>Av. Arthur Bernardes, 1323</strong><a href="https://maps.google.com/?q=Av.+Presid.+Arthur+da+Silva+Bernardes,+1323+-+Port%C3%A3o,+Curitiba+-+PR" target="_blank" rel="noopener noreferrer">Ver como chegar <ArrowRight size={16} aria-hidden="true" /></a></div>
        </div>
      </div>
      <div className="carplus-hero-services">
        <div><span className="carplus-service-number">01</span><div><strong>Linha Prinx para seu carro</strong><span>Consulte medida e aplicação</span></div></div>
        <div><Wrench aria-hidden="true" /><div><strong>Montagem e manutenção</strong><span>Pneus e oficina no mesmo endereço</span></div></div>
        <div><Gauge aria-hidden="true" /><div><strong>Alinhamento 3D</strong><span>Consulte os serviços para seu veículo</span></div></div>
      </div>
    </section>
  );
}
