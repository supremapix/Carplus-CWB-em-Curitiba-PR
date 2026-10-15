import React from 'react';
import { ArrowUpRight, Instagram } from 'lucide-react';

export default function InstagramFeed() {
  return (
    <section id="carplus-instagram-feed" className="border-y border-white/10 bg-[#0c0c0c] px-5 py-10 text-white sm:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-6 md:grid-cols-[1fr_auto]">
        <div>
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#f59c00]"><Instagram aria-hidden="true" className="h-5 w-5" />@carpluscwb</p>
          <h3 className="text-2xl font-bold">Conheça o dia a dia da Carplus.</h3>
          <p className="mt-2 text-base leading-relaxed text-white/65">Veja nossa estrutura, os serviços e a rotina da equipe no Portão.</p>
        </div>
        <a href="https://www.instagram.com/carpluscwb/" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-14 items-center justify-center gap-3 rounded-sm border border-white/30 px-6 py-3 text-base font-semibold text-white hover:border-[#f59c00]">Visitar o Instagram<ArrowUpRight aria-hidden="true" className="h-5 w-5 text-[#f59c00]" /></a>
        <details className="md:col-span-2">
          <summary className="min-h-12 cursor-pointer py-3 text-sm text-white/65">Ver publicações aqui no site</summary>
          <div className="mx-auto mt-4 max-w-[480px] overflow-hidden rounded-lg bg-white">
            <iframe src="https://www.instagram.com/carpluscwb/embed" title="Publicações da Carplus no Instagram" loading="lazy" className="block h-[430px] w-full border-0" />
          </div>
        </details>
      </div>
    </section>
  );
}
