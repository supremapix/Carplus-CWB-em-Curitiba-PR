declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    gtag_report_conversion?: (url?: string) => boolean;
    fbq?: (...args: any[]) => void;
    uetq?: any[];
  }
}

export interface TrackEventParams {
  click_location?: string;
  button_text?: string;
  link_url?: string;
  service_name?: string;
  tire_size?: string;
  contact_method?: string;
  form_name?: string;
  currency?: string;
  value?: number;
  [key: string]: any;
}

export function trackEvent(name: string, params: TrackEventParams = {}) {
  try {
    const enrichedParams = {
      ...params,
      page_path: typeof window !== 'undefined' ? window.location.pathname : '',
      transport_type: 'beacon'
    };

    if ((import.meta as any).env?.DEV) {
      console.log('[Analytics Debug]', name, enrichedParams);
    }

    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', name, enrichedParams);
    }

    // Conversion integrations if present
    if (typeof window !== 'undefined') {
      if (['whatsapp_click', 'phone_click', 'generate_lead'].includes(name)) {
        if (typeof window.gtag_report_conversion === 'function') {
          try {
            window.gtag_report_conversion();
          } catch (e) {}
        }
        if (typeof window.fbq === 'function') {
          try {
            if (name === 'generate_lead') {
              window.fbq('track', 'Lead');
            } else {
              window.fbq('track', 'Contact');
            }
          } catch (e) {}
        }
        if (window.uetq && Array.isArray(window.uetq)) {
          try {
            if (name === 'generate_lead') {
              window.uetq.push('event', 'generate_lead', {});
            } else {
              window.uetq.push('event', 'contact', {});
            }
          } catch (e) {}
        }
      }
    }
  } catch (err) {
    if ((import.meta as any).env?.DEV) {
      console.error('[Analytics Error]', err);
    }
  }
}

let listenersInitialized = false;

export function initAnalyticsListeners() {
  if (typeof window === 'undefined' || listenersInitialized) return;
  listenersInitialized = true;

  let last = { key: '', t: 0 };

  function classify(url: string | null): string | null {
    if (!url) return null;
    const u = String(url).toLowerCase();
    if (u.includes('wa.me/') || u.includes('api.whatsapp.com') || u.includes('web.whatsapp.com') || u.startsWith('whatsapp://')) {
      return 'whatsapp_click';
    }
    if (u.startsWith('tel:')) {
      return 'phone_click';
    }
    if (u.startsWith('mailto:')) {
      return 'email_click';
    }
    if (u.includes('google.com/maps') || u.includes('maps.google') || u.includes('goo.gl/maps') || u.includes('maps.app.goo.gl') || u.includes('waze.com')) {
      return 'directions_click';
    }
    if (u.includes('instagram.com') || u.includes('facebook.com') || u.includes('tiktok.com') || u.includes('youtube.com')) {
      return 'social_click';
    }
    return null;
  }

  function locationOf(el: HTMLElement | null): string {
    if (!el || !el.closest) return 'hero';
    const tagged = el.closest('[data-track-location], [data-cta-location]');
    if (tagged) {
      const loc = tagged.getAttribute('data-track-location') || tagged.getAttribute('data-cta-location');
      if (loc) return loc;
    }
    if (el.closest('header, nav')) return 'header';
    if (el.closest('footer')) return 'rodape';
    
    let fixed = el as HTMLElement | null;
    while (fixed && fixed !== document.body) {
      const pos = window.getComputedStyle(fixed).position;
      if (pos === 'fixed' || pos === 'sticky') return 'botao_flutuante';
      fixed = fixed.parentElement;
    }

    const sec = el.closest('section[id], [id]');
    if (sec && sec.id) {
      const id = sec.id.toLowerCase();
      if (id.includes('hero')) return 'hero';
      if (id.includes('pneu') || id.includes('catalogo')) return 'pneus';
      if (id.includes('servico') || id.includes('auto-center')) return 'card_servico';
      if (id.includes('diferencial') || id.includes('garantia') || id.includes('sobre')) return 'diferenciais';
      if (id.includes('depoimento') || id.includes('avaliacao') || id.includes('social')) return 'depoimentos';
      if (id.includes('local') || id.includes('contato') || id.includes('mapa')) return 'localizacao';
      if (id.includes('faq') || id.includes('pergunta')) return 'faq';
    }
    return 'hero';
  }

  function getServiceAndSize(el: HTMLElement | null) {
    let service_name: string | undefined;
    let tire_size: string | undefined;
    if (el && el.closest) {
      const sEl = el.closest('[data-service]');
      if (sEl) service_name = sEl.getAttribute('data-service') || undefined;

      const tEl = el.closest('[data-tire-size]');
      if (tEl) tire_size = tEl.getAttribute('data-tire-size') || undefined;
    }
    return { service_name, tire_size };
  }

  function handleInteraction(url: string | null, el: HTMLElement | null) {
    const evt = classify(url);
    if (!evt) return;

    const key = evt + '|' + url;
    const now = Date.now();
    if (key === last.key && now - last.t < 1000) return;
    last = { key, t: now };

    const button_text = el ? (el.getAttribute('aria-label') || el.innerText || el.title || '').replace(/\s+/g, ' ').trim().slice(0, 100) : '';
    const click_location = locationOf(el);
    const { service_name, tire_size } = getServiceAndSize(el);

    const params: TrackEventParams = {
      click_location,
      button_text,
      link_url: el?.closest('[data-analytics-url]')?.getAttribute('data-analytics-url') || String(url).slice(0, 300),
    };
    if (service_name) params.service_name = service_name;
    if (tire_size) params.tire_size = tire_size;
    if (evt === 'whatsapp_click') params.contact_method = 'whatsapp';
    if (evt === 'phone_click') params.contact_method = 'telefone';

    trackEvent(evt, params);
  }

  // 1) Click delegation on <a>
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement | null;
    const a = target && target.closest ? target.closest('a[href]') : null;
    if (a) {
      handleInteraction((a as HTMLAnchorElement).href, a as HTMLElement);
    }
  }, true);

  // 2) window.open delegation
  let lastClicked: HTMLElement | null = null;
  document.addEventListener('click', (e) => {
    lastClicked = e.target as HTMLElement | null;
  }, true);

  const origOpen = window.open;
  window.open = function(url?: string | URL, ...args: any[]) {
    try {
      if (url) {
        const urlStr = typeof url === 'string' ? url : url.toString();
        const el = lastClicked && lastClicked.closest ? (lastClicked.closest('button, a, [role="button"]') || lastClicked) : lastClicked;
        handleInteraction(urlStr, el as HTMLElement);
      }
    } catch (err) {}
    return origOpen.apply(window, [url, ...args]);
  };
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initAnalyticsListeners());
  } else {
    initAnalyticsListeners();
  }
}
