import React, { useId, useState } from 'react';
import { formatWhatsApp } from '../utils/whatsapp';

interface HomeTireSearchProps {
  onSearch: (query: string) => void;
  onHelp?: () => void;
}

export default function HomeTireSearch({ onSearch, onHelp }: HomeTireSearchProps) {
  const inputId = useId();
  const [query, setQuery] = useState('');
  const helpUrl = formatWhatsApp('Olá, Carplus! Não sei a medida do pneu do meu carro. Quero informar o modelo, a versão e o ano para receber orientação.');

  return (
    <div className="carplus-home-search grid gap-5 text-white lg:grid-cols-[1.45fr_1fr]" data-track-location="busca-home">
      <div className="carplus-search-panel rounded-xl border border-white/15 bg-[#121212] p-6 sm:p-8">
        <p className="mb-3 text-[16px] font-semibold text-[#f59c00]">Encontre seu próximo pneu</p>
        <h2 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl">Encontre pneus para o seu carro.</h2>
        <form
          role="search"
          aria-label="Buscar pneus no catálogo"
          data-form-name="busca-home"
          className="mt-6"
          onSubmit={(event) => {
            event.preventDefault();
            onSearch(query.trim());
          }}
        >
          <label htmlFor={inputId} className="mb-3 block text-[16px] font-semibold leading-relaxed text-white">Busque pela medida, marca ou carro</label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id={inputId}
              name="busca"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ex.: 205/55 R16, Prinx ou Corolla"
              autoComplete="off"
              enterKeyHint="search"
              spellCheck={false}
              maxLength={120}
              className="min-h-[56px] min-w-0 flex-1 rounded-md border border-white/30 bg-[#080808] px-4 py-3 text-[16px] leading-relaxed text-white placeholder:text-zinc-400 focus:border-[#f59c00] focus:outline-none"
            />
            <button type="submit" className="carplus-action-primary flex min-h-[56px] cursor-pointer items-center justify-center gap-3 rounded-md bg-[#f59c00] px-6 py-3 text-[16px] font-bold leading-relaxed text-[#080808] transition-opacity hover:opacity-90">
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>
              Buscar pneus
            </button>
          </div>
          <button type="button" onClick={() => onSearch('')} className="mt-3 inline-flex min-h-[48px] cursor-pointer items-center gap-3 py-2 text-[16px] font-semibold text-white underline underline-offset-4 hover:text-[#f59c00]">
            Ver todos os pneus <span aria-hidden="true">→</span>
          </button>
        </form>
      </div>

      <aside className="carplus-help-panel flex flex-col rounded-xl border border-[#f59c00]/35 bg-[#080808] p-6 sm:p-8">
        <h3 className="font-display text-3xl font-bold leading-tight text-white">Não sabe a medida?</h3>
        <p className="mt-4 text-[16px] leading-relaxed text-zinc-300">Informe o carro, a versão e o ano. A equipe ajuda a conferir a medida e as opções para você.</p>
        <a
          href={helpUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-cta-location="busca-home"
          data-analytics-url="https://api.whatsapp.com/send?phone=554130827282"
          className="carplus-action-secondary mt-6 flex min-h-[56px] items-center justify-center gap-3 rounded-md border border-[#f59c00] px-4 py-3 text-center text-[16px] font-bold leading-relaxed text-[#f59c00] transition-colors hover:bg-[#f59c00]/10"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 11.5a9 9 0 0 1-13 8L2 22l2-6a9 9 0 1 1 17-4.5Z" /><path d="M8 8c1 4 3 6 7 7l2-2-3-2-1 1-2-2 1-1-2-3-2 2Z" /></svg>
          Pedir ajuda no WhatsApp
        </a>
        {onHelp && (
          <button type="button" onClick={onHelp} className="mt-3 inline-flex min-h-[48px] cursor-pointer items-center self-start py-2 text-left text-[16px] font-medium leading-relaxed text-white underline underline-offset-4 hover:text-[#f59c00]">Como escolher meu pneu</button>
        )}
      </aside>
    </div>
  );
}
