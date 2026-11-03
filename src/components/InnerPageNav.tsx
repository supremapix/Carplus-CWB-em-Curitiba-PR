import React from 'react';

const links = [
  { href: '/pneus', label: 'Todos os pneus' },
  { href: '/pneus-eletricos-curitiba', label: 'Elétricos' },
  { href: '/pneus-hibridos-curitiba', label: 'Híbridos' },
  { href: '/auto-center-curitiba', label: 'Auto center' },
  { href: '/blog', label: 'Guias e dicas' },
  { href: '/contato', label: 'Contato' },
];

/** Native links keep navigation, new tabs and browser history predictable. */
export default function InnerPageNav() {
  const pathname = typeof window === 'undefined' ? '' : window.location.pathname.replace(/\/$/, '');
  return (
    <nav className="inner-page-nav" aria-label="Explore a Carplus">
      <div className="inner-page-nav-shell">
        <a className="inner-page-home" href="/" aria-label="Voltar ao início">Início</a>
        <div className="inner-page-nav-links">
          {links.map(({ href, label }) => (
            <a key={href} href={href} aria-current={pathname === href ? 'page' : undefined}>{label}</a>
          ))}
        </div>
        <details className="inner-page-rims" onKeyDown={event => {
          if (event.key === 'Escape') {
            event.currentTarget.open = false;
            event.currentTarget.querySelector('summary')?.focus();
          }
        }}>
          <summary>Pneus por aro <span aria-hidden="true">⌄</span></summary>
          <div className="inner-page-rim-links" aria-label="Escolha o aro">
            {Array.from({ length: 11 }, (_, index) => index + 13).map(rim => (
              <a key={rim} href={`/aro/${rim}`} aria-current={pathname === `/aro/${rim}` ? 'page' : undefined}>Aro {rim}</a>
            ))}
          </div>
        </details>
      </div>
    </nav>
  );
}
