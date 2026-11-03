import React, { useState } from 'react';
import { getTireImageState, ImageTireIdentity, TIRE_IMAGE_CAVEAT, TIRE_IMAGE_PENDING } from '../lib/tireImageManifest';

interface ImageProps { tire: ImageTireIdentity; className?: string; compact?: boolean }
export default function VerifiedTireImage(props: ImageProps) {
  const [failedSource, setFailedSource] = useState<string>();
  return <VerifiedTireImageView {...props} failedSource={failedSource} onFailure={setFailedSource} />;
}

// Separate the render/error transition so it can be exercised without browser request interception.
export function VerifiedTireImageView({ tire, className = '', compact = false, failedSource, onFailure }: ImageProps & { failedSource?: string; onFailure: (source: string) => void }) {
  const image = getTireImageState(tire, failedSource);
  return <figure className={`flex min-h-0 flex-col items-center justify-center gap-2 text-center ${className}`} data-tire-image-status={image ? 'model-representative' : 'pending'}>
    {image ? <>
      <img src={image.src} alt={`Foto representativa: ${image.brand} ${image.model}; não comprova medida ou versão`} loading="lazy" decoding="async" className="min-h-0 max-h-full w-full flex-1 object-contain" onError={() => onFailure(image.src)} />
      <figcaption className={compact ? 'shrink-0 text-[14px] leading-snug text-zinc-700' : 'shrink-0 text-[14px] leading-relaxed text-zinc-700'} title={TIRE_IMAGE_CAVEAT}>{compact ? 'Foto do modelo; medida e versão podem variar.' : TIRE_IMAGE_CAVEAT}</figcaption>
    </> : <figcaption className="flex min-h-[48px] items-center justify-center rounded-lg bg-zinc-100 p-2 text-[14px] font-medium leading-relaxed text-zinc-700">{TIRE_IMAGE_PENDING}</figcaption>}
  </figure>;
}
