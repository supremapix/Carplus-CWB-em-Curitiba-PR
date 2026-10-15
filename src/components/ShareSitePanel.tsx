import React, { useEffect, useId, useRef, useState } from 'react';
import { ArrowUpRight, Check, Copy, MessageSquare, Share2 } from 'lucide-react';
import { trackEvent } from '../lib/analytics';
import { HOME_SOCIAL_IMAGE_ALT, HOME_SOCIAL_IMAGE_PATH, SITE_ORIGIN } from '../lib/socialPreview';
import { createPageShare, type PageShareDetails } from '../utils/sharing';

interface ShareSitePanelProps {
  className?: string;
  showPreview?: boolean;
  pageKey?: string;
}

const actionClass = 'flex min-h-[52px] items-center justify-center gap-2 rounded-xl px-4 py-3 text-center text-[16px] font-semibold leading-snug transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f59c00]';

function currentPageShare(): PageShareDetails {
  return createPageShare(
    typeof window === 'undefined' ? '/' : window.location.pathname,
    typeof document === 'undefined' ? '' : document.title,
  );
}

export default function ShareSitePanel({ className = '', showPreview = true, pageKey }: ShareSitePanelProps) {
  const instanceId = useId();
  const manualLinkRef = useRef<HTMLInputElement>(null);
  const [nativeShareAvailable, setNativeShareAvailable] = useState(false);
  const [status, setStatus] = useState('');
  const [copied, setCopied] = useState(false);
  const [manualLink, setManualLink] = useState('');
  const [share, setShare] = useState<PageShareDetails>(currentPageShare);
  const isHome = share.url === `${SITE_ORIGIN}/`;
  const previewVisible = showPreview && isHome;

  useEffect(() => {
    setNativeShareAvailable(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
  }, []);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setShare(currentPageShare());
      setStatus('');
      setCopied(false);
      setManualLink('');
    });
    return () => { cancelled = true; };
  }, [pageKey]);

  useEffect(() => {
    if (!manualLink) return;
    manualLinkRef.current?.focus();
    manualLinkRef.current?.select();
  }, [manualLink]);

  const recordShare = (method: 'whatsapp' | 'copy_link' | 'native', details: PageShareDetails) => {
    trackEvent('share', { method, content_type: 'page', item_id: details.url, link_url: details.url, click_location: 'footer_share' });
  };

  const showManualCopy = (details: PageShareDetails) => {
    setCopied(false);
    setManualLink(details.url);
    setStatus('Selecione e copie o link abaixo para compartilhar.');
  };

  const handleCopy = async () => {
    const details = currentPageShare();
    try {
      if (!navigator.clipboard?.writeText) {
        showManualCopy(details);
        return;
      }
      await navigator.clipboard.writeText(details.url);
      setCopied(true);
      setManualLink('');
      setStatus('Link copiado! Agora é só colar na conversa.');
      recordShare('copy_link', details);
    } catch {
      showManualCopy(details);
    }
  };

  const handleNativeShare = async () => {
    const details = currentPageShare();
    try {
      await navigator.share({ title: details.title, text: details.text, url: details.url });
      setStatus('Compartilhamento concluído.');
      recordShare('native', details);
    } catch (error) {
      if (error && typeof error === 'object' && 'name' in error && error.name === 'AbortError') {
        setStatus('Compartilhamento cancelado.');
        return;
      }
      showManualCopy(details);
    }
  };

  return (
    <section className={`rounded-2xl border border-[#f59c00]/25 bg-[#111111] p-5 text-white sm:p-6 ${className}`} aria-labelledby={`${instanceId}-title`} data-cta-location="footer_share">
      <div className={`grid items-center gap-5 ${previewVisible ? 'sm:grid-cols-[170px_1fr]' : ''}`}>
        {previewVisible && <img src={HOME_SOCIAL_IMAGE_PATH} alt={HOME_SOCIAL_IMAGE_ALT} width="1200" height="630" loading="lazy" decoding="async" className="mx-auto aspect-[1200/630] w-full max-w-[240px] rounded-lg border border-white/10 object-cover sm:max-w-none" />}
        <div>
          <h2 id={`${instanceId}-title`} className="flex items-center gap-2 text-[21px] font-semibold leading-tight text-white"><Share2 aria-hidden="true" className="h-5 w-5 shrink-0 text-[#f59c00]" />Compartilhe a Carplus</h2>
          <p className="mt-2 text-[16px] leading-relaxed text-[#c3c3c3]">{isHome ? 'Envie esta página para quem procura pneus Prinx ou pneus para carros elétricos e híbridos.' : 'Envie esta página para quem procura pneus ou precisa de orientação para o carro.'}</p>
          <div className={`mt-4 grid gap-3 ${nativeShareAvailable ? 'lg:grid-cols-3' : 'sm:grid-cols-2'}`}>
            <a href={share.whatsappUrl} target="_blank" rel="noopener noreferrer" data-share-channel="whatsapp" onClick={event => {
              const details = currentPageShare();
              event.currentTarget.href = details.whatsappUrl;
              recordShare('whatsapp', details);
              setStatus('Escolha o contato no WhatsApp para enviar o link.');
            }} className={`carplus-action-primary bg-[#f59c00] text-[#080808] hover:bg-[#ffaf28] ${actionClass}`}>
              <MessageSquare aria-hidden="true" className="h-5 w-5 shrink-0" /><span>Enviar no WhatsApp</span><ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0" />
            </a>
            <button type="button" data-share-channel="copy_link" onClick={handleCopy} className={`carplus-action-secondary cursor-pointer border border-white/25 bg-transparent text-white hover:border-[#f59c00] ${actionClass}`}>
              {copied ? <Check aria-hidden="true" className="h-5 w-5 shrink-0 text-[#f59c00]" /> : <Copy aria-hidden="true" className="h-5 w-5 shrink-0 text-[#f59c00]" />}<span>{copied ? 'Link copiado' : 'Copiar link'}</span>
            </button>
            {nativeShareAvailable && <button type="button" data-share-channel="native" onClick={handleNativeShare} className={`carplus-action-secondary cursor-pointer border border-white/25 bg-transparent text-white hover:border-[#f59c00] ${actionClass}`}><Share2 aria-hidden="true" className="h-5 w-5 shrink-0 text-[#f59c00]" /><span>Outras opções</span></button>}
          </div>
          <p role="status" aria-live="polite" aria-atomic="true" className="mt-3 min-h-6 text-[16px] leading-relaxed text-[#c3c3c3]">{status}</p>
          {manualLink && <div className="mt-3"><label htmlFor={`${instanceId}-manual-link`} className="mb-2 block text-[16px] font-medium text-white">Link desta página</label><input ref={manualLinkRef} id={`${instanceId}-manual-link`} type="url" readOnly value={manualLink} onFocus={event => event.currentTarget.select()} className="min-h-[52px] w-full rounded-xl border border-white/25 bg-[#080808] px-4 py-3 text-[16px] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f59c00]" /><button type="button" data-share-channel="manual_copy" onClick={() => { manualLinkRef.current?.focus(); manualLinkRef.current?.select(); }} className={`carplus-action-secondary mt-3 cursor-pointer border border-white/25 text-white ${actionClass}`}>Selecionar link para copiar</button></div>}
        </div>
      </div>
    </section>
  );
}
