import { HOME_SOCIAL_DESCRIPTION, HOME_SOCIAL_TITLE, SITE_ORIGIN } from '../lib/socialPreview';

export interface PageShareDetails {
  title: string;
  text: string;
  url: string;
  whatsappUrl: string;
}

/** Share the public page path, without campaign parameters, fragments or preview hosts. */
export function createPageShare(pathname = '/', documentTitle = ''): PageShareDetails {
  let path = '/';
  try {
    path = new URL(pathname || '/', SITE_ORIGIN).pathname;
  } catch {
    // Invalid input falls back to the public home page.
  }
  const publicPath = `/${path.replace(/^\/+/, '')}`;
  const url = `${SITE_ORIGIN.replace(/\/+$/, '')}${publicPath}`;
  const isHome = publicPath === '/';
  const title = isHome ? HOME_SOCIAL_TITLE : documentTitle.trim() || 'Carplus Pneus e Oficina em Curitiba';
  const text = isHome ? HOME_SOCIAL_DESCRIPTION : title;
  const message = [title, isHome ? text : '', url].filter(Boolean).join('\n');

  return {
    title,
    text,
    url,
    whatsappUrl: `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`,
  };
}
