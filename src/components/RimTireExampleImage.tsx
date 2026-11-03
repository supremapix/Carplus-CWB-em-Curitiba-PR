import React from 'react';
import { CatalogTire } from '../types';
import { getVerifiedTireImage } from '../lib/tireImageManifest';
import VerifiedTireImage from './VerifiedTireImage';

export function getVerifiedRimModelImage(tire: CatalogTire): string | undefined {
  return getVerifiedTireImage(tire)?.src;
}
export default function RimTireExampleImage({ tire }: { tire: CatalogTire }) {
  return <VerifiedTireImage tire={tire} className="mb-4 h-[320px] w-full bg-white p-4" />;
}
